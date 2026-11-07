// Headless test of one game: node tools/smoke.js <gameId> [--seeds 3] [--out folder] [--speed 12] [--query tall]
// Serves the site folder itself, passes the 18+ gate like a person, then at phone and computer size:
//  1. checks the gate comes first and nothing shows behind it;
//  2. walks the real screens with the bot: title, story, talk, play, results, boss, ending, then endless;
//  3. runs every stage with the bot (must win) and with nobody at the controls (must not win), at several seeds, with no upgrades;
//  4. checks the pause button, sideways scroll, the wrong-way-round phone prompt, saved progress after a reload, real touch and keys, sound, upgrades, pals, choices (smoke-checks.js);
//  5. collects page errors, console errors and missing files; takes screenshots (title, talk, play, result, ending).
// Exit code 0 only if everything passed. Needs Chrome and playwright-core (set NODE_PATH, or see PW below).
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* try the next one */ } }
if (!playwright) { console.error('playwright-core not found. Tried: ' + PW.join(', ')); process.exit(2); }

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2), gameId = args[0];
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
if (!gameId) { console.error('Usage: node tools/smoke.js <gameId> [--seeds 3] [--out folder] [--speed 12] [--query tall]'); process.exit(2); }
const SEEDS = +opt('seeds', 3), SPEED = +opt('speed', 12);
const OUT = path.resolve(opt('out', path.join(os.tmpdir(), 'kcheck', 'smoke', gameId + (opt('query', '') ? '-' + opt('query', '') : ''))));
const QUERY = opt('query', '');   // extra address flags, e.g. --query tall
const extra = require('./smoke-checks.js');
const IGNORED_HOSTS = /fonts\.(googleapis|gstatic)\.com/;   // no internet in a test must not fail a game
fs.mkdirSync(OUT, { recursive: true });

const pageDir = ['games', 'tools'].map(d => path.join(d, gameId)).find(d => fs.existsSync(path.join(ROOT, d, 'index.html')));
if (!pageDir) { console.error('No index.html for ' + gameId + ' under games/ or tools/'); process.exit(2); }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('missing'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const fails = [], notes = [];
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails.push(what); return ok; };

async function waitFor(page, fn, arg, ms, what) {
  try { await page.waitForFunction(fn, arg, { timeout: ms, polling: 50 }); return true; }
  catch (e) { check(false, 'timed out waiting for ' + what); return false; }
}
const screen = page => page.evaluate(() => window.__kit && __kit.state().screen);
// Takes the picture, and fails if the screen needs scrolling to reach its buttons (a long stage list may scroll).
const shot = async (page, label, name) => {
  await page.screenshot({ path: path.join(OUT, `${label}-${name}.png`) });
  const over = await page.evaluate(() => { const s = document.querySelector('#kit-ui .kit-screen'); return s ? s.scrollHeight - s.clientHeight : 0; });
  if (over > 1 && name !== 'stages') check(false, `${label}: the ${name} screen is ${over}px too tall and needs scrolling`);
};
async function noSideScroll(page, label, where) {
  const r = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  check(r.sw <= r.cw, `${label}: no sideways scroll on ${where} (${r.sw} <= ${r.cw})`);
}
const press = (page, sel) => page.locator(sel).first().click({ timeout: 8000 });

async function walkStory(page, label, stageCount, size) {
  // Real screens from the title to the ending, with the bot playing at raised speed.
  await press(page, '[data-kit="story"]');
  check((await screen(page)) === 'stages', `${label}: Story opens the stage select`);
  await shot(page, label, 'stages');
  await page.evaluate(s => { __kit.bot(true); __kit.timeScale = s; }, SPEED);
  await press(page, '#kit-ui [data-primary]');
  let lastIndex = -1, talkShot = false, playShot = false, resultShot = false, wins = 0, losses = 0, guard = 0;
  const deadline = Date.now() + 240000;
  while (Date.now() < deadline && guard++ < 4000) {
    const st = await page.evaluate(() => __kit.state());
    if (st.screen === 'title') break;
    if (st.screen === 'play') {
      if (!playShot && st.time > 2) { await shot(page, label, 'play'); playShot = true; }
      if (st.index !== lastIndex) { lastIndex = st.index; }
      await page.waitForTimeout(60);
      continue;
    }
    if (st.screen === 'talk' && !talkShot) { await page.waitForTimeout(150); await shot(page, label, 'talk'); talkShot = true; }
    if (st.screen === 'ending' && !(walkStory.endShot || {})[label]) { (walkStory.endShot = walkStory.endShot || {})[label] = 1; await shot(page, label, 'ending'); }
    if (st.screen === 'result') {
      const text = await page.locator('#kit-ui .kit-head').first().textContent();
      if (text === 'DOWN') losses++; else wins++;
      if (!resultShot) { await shot(page, label, 'result'); resultShot = true; }
    }
    if (st.screen.includes('talk')) await page.mouse.click(size.w / 2, size.h / 3);   // a real tap anywhere moves talk on
    else {
      await page.waitForFunction(() => !document.querySelector('.kit-wait'), null, { timeout: 2000 }).catch(() => {});   // the screen's tap guard
      const btn = page.locator('#kit-ui [data-primary]').first();
      if (await btn.count()) await btn.click({ timeout: 5000 }).catch(() => {});
    }
    await page.waitForTimeout(30);
  }
  check((await screen(page)) === 'title', `${label}: the story runs through to the ending and back to the title`);
  check(wins >= stageCount, `${label}: bot cleared all ${stageCount} stages through the real screens (clears ${wins}, deaths ${losses})`);
  await page.evaluate(() => { __kit.bot(false); __kit.timeScale = 1; });
}

async function runSize(browser, base, size) {
  const label = size.name;
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, hasTouch: !!size.touch, isMobile: !!size.touch, deviceScaleFactor: size.touch ? 2 : 1 });
  const page = await ctx.newPage();
  const problems = [];
  page.on('pageerror', e => problems.push('page error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !IGNORED_HOSTS.test(m.location().url || '') && !/404/.test(m.text())) problems.push('console error: ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !IGNORED_HOSTS.test(r.url()) && !/does-not-exist/.test(r.url())) problems.push('missing file: ' + r.url() + ' (' + r.status() + ')'); });

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  check(await page.locator('#drift-gate').count() === 1, `${label}: the 18+ gate comes first`);
  check(await page.locator('#kit-root').count() === 0, `${label}: no game behind the gate`);
  await page.waitForTimeout(600);
  await page.locator('#drift-gate .yes').click();
  await waitFor(page, () => window.__kit && __kit.state().screen === 'title', null, 8000, 'the title screen');
  const st0 = await page.evaluate(() => __kit.state());
  check(st0.hasBot, `${label}: the game has a test bot`);
  await page.waitForTimeout(300);
  await shot(page, label, 'title');
  await noSideScroll(page, label, 'the title');
  for (const k of ['story', 'upgrades', 'fair', 'sound', 'back']) check(await page.locator(`[data-kit="${k}"]`).count() === 1, `${label}: title has ${k}`);
  const wantsEndless = await page.evaluate(() => Kit.def.endless !== false);
  if (wantsEndless) check(await page.locator('[data-kit="endless"][disabled]').count() === 1, `${label}: Endless is locked before the ending`);

  if (label === 'phone') await extra.lint(page, st0.game, pageDir.startsWith('games'), check, n => notes.push(n));

  // Upgrades screen shows; pictures that fail stay silent.
  await press(page, '[data-kit="upgrades"]');
  await shot(page, label, 'upgrades');
  await press(page, '[data-kit="back"]');

  // Pause button stops the steps, and the page stays still.
  await page.evaluate(() => __kit.jump(0));
  await page.waitForTimeout(200);
  await press(page, '[data-kit="pause"]');
  const s1 = await page.evaluate(() => __kit.state());
  check(s1.paused && s1.screen === 'paused', `${label}: pause button pauses`);
  await shot(page, label, 'paused');
  await page.waitForTimeout(150);
  const s2 = await page.evaluate(() => __kit.state());
  check(s1.steps === s2.steps, `${label}: no steps while paused (${s1.steps} = ${s2.steps})`);
  await press(page, '[data-kit="resume"]');
  await page.evaluate(() => __kit.title());

  await extra.inputChecks(page, check, label, size);
  await page.evaluate(() => __kit.title());

  // Every stage, bot on and bot off, several seeds, no upgrades, nothing saved.
  const stages = st0.stageCount, idleOk = await page.evaluate(() => !!(Kit.def.test && Kit.def.test.idleNeverLoses));
  for (let i = 0; i < stages; i++) {
    const wins = [];
    for (let seed = 1; seed <= SEEDS; seed++) wins.push(await page.evaluate(([i, seed]) => __kit.runStage(i, { bot: true, seed: seed * 7919 + i }), [i, seed]));
    const won = wins.filter(w => w.result === 'win').length;
    check(won === wins.length, `${label}: stage ${i + 1} bot wins ${won}/${wins.length} (${wins.map(w => w.result + ' ' + w.seconds + 's').join(', ')})`);
    const idle = await page.evaluate(i => __kit.runStage(i, { bot: false, seed: 4242 + i, maxSeconds: Kit.def.test && Kit.def.test.idleSeconds }), i);
    check(idle.result !== 'win' && (idle.result === 'lose' || idleOk), `${label}: stage ${i + 1} with nobody playing: ${idle.result} after ${idle.seconds}s`);
  }

  await walkStory(page, label, stages, size);
  const after = await page.evaluate(id => DriftSave.game(id), st0.game);
  check(after.cleared >= stages && after.finished, `${label}: progress saved (cleared ${after.cleared}, finished ${after.finished})`);
  await shot(page, label, 'title-after');

  // Endless: unlocked now; run with nobody at the controls until it ends.
  if (wantsEndless) {
    check(await page.locator('[data-kit="endless"]:not([disabled])').count() === 1, `${label}: Endless is open after the ending`);
    await page.evaluate(() => { __kit.timeScale = 16; });
    await press(page, '[data-kit="endless"]');
    // Since pals always come when earned (Dylan 2026-11-07), a still player can catch one here (Silent Cut's Tuftle).
    // Tap OK on the catch moment like a person, then forget that pal so the catch check below starts fresh.
    let caughtIdle = [];
    for (let i = 0; i < 4 && await waitFor(page, () => ['result', 'catch'].includes(__kit.state().screen), null, 90000, 'an idle endless run to end') && await screen(page) === 'catch'; i++) {
      await page.waitForTimeout(500);   // the screen's tap guard
      await page.locator('[data-kit="catch-ok"]').click();
      caughtIdle = await page.evaluate(() => DriftSave.load().pals);
    }
    if (caughtIdle.length) await page.evaluate(() => { const k = 'driftbound-save-v1', d = JSON.parse(localStorage.getItem(k)); d.pals = []; localStorage.setItem(k, JSON.stringify(d)); });
    if (caughtIdle.length) notes.push(`${label}: the idle player caught ${caughtIdle.join(', ')} in endless (then forgotten for the catch check)`);
    const ended = await screen(page) === 'result';
    if (ended) { const best = await page.evaluate(id => DriftSave.game(id).best, st0.game); await shot(page, label, 'endless-result'); notes.push(`${label}: idle endless ended, best ${best}`); }
    await page.evaluate(() => { __kit.timeScale = 1; __kit.title(); });
    const bot = await page.evaluate(() => __kit.runStage(0, { bot: true, endless: true, seed: 11, maxSeconds: 60 }));
    check(bot.result !== 'error', `${label}: bot in endless for up to 60s: ${bot.result} at ${bot.seconds}s, score ${bot.score}`);
  }

  await extra.soundChecks(page, check, label, base);
  await extra.upgradeChecks(page, check, label, st0.game);
  await extra.momentChecks(page, check, label, st0.game, n => shot(page, label, n));

  // Reload: still there, no gate again, Endless stays open.
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await waitFor(page, () => window.__kit && __kit.state().screen === 'title', null, 8000, 'the title after reload');
  check(await page.locator('#drift-gate').count() === 0, `${label}: the gate remembers the Yes`);
  const reloaded = await page.evaluate(id => DriftSave.game(id).finished, st0.game);
  check(reloaded, `${label}: progress survives a reload`);

  // The phone held the wrong way shows the prompt and stops play.
  if (size.touch) {
    await page.setViewportSize({ width: size.h, height: size.w });
    await page.waitForTimeout(250);
    const blocked = await page.evaluate(() => __kit.state().blocked);
    check(blocked && await page.locator('#kit-turn').isVisible(), `${label}: wrong-way phone shows the turn prompt`);
    await shot(page, label, 'turn');
    await page.setViewportSize({ width: size.w, height: size.h });
    await page.waitForTimeout(250);
    check(!(await page.evaluate(() => __kit.state().blocked)), `${label}: prompt clears when turned back`);
  }

  check(problems.length === 0, `${label}: no errors (${problems.length})`);
  problems.slice(0, 12).forEach(p => console.log('     ' + p));
  await ctx.close();
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}/${pageDir.replace(/\\/g, '/')}/index.html?test${QUERY ? '&' + QUERY : ''}`;
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  let orientation = 'landscape';
  try {
    // Find out which way up the game wants to be held, from its own definition, with the gate answered.
    const probe = await browser.newContext({ viewport: { width: 900, height: 600 } });
    const p = await probe.newPage();
    await p.goto(base, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(600);
    await p.locator('#drift-gate .yes').click();
    await p.waitForFunction(() => window.__kit, null, { timeout: 8000 });
    orientation = await p.evaluate(() => __kit.state().orientation);
    await probe.close();

    const phone = orientation === 'portrait' ? { name: 'phone', w: 390, h: 844, touch: true } : { name: 'phone', w: 844, h: 390, touch: true };
    const small = orientation === 'portrait' ? { name: 'small-phone', w: 320, h: 568, touch: true } : { name: 'small-phone', w: 568, h: 320, touch: true };
    for (const size of [phone, { name: 'computer', w: 1440, h: 900 }, small]) await runSize(browser, base, size);
  } catch (e) {
    check(false, 'the test itself stopped: ' + e.message);
  }
  await browser.close();
  server.close();
  notes.forEach(n => console.log('note ' + n));
  console.log(`\nScreenshots: ${OUT}`);
  console.log(fails.length ? `FAILED ${fails.length}:\n - ${fails.join('\n - ')}` : `PASSED: ${gameId}`);
  process.exit(fails.length ? 1 : 0);
})();
