// What a Dive really costs, and whether a gentle pull is heard. node games/tide-gap/test/prices.js
// Spare copies can't pay at the boss; a wreck doesn't keep cache gold and hand the line back; Mopclaw's line stays paid; an empty book's lose lines vary; the boss's strip stays clear of Pause; real touch at a gentle pull Dives.
// Real kit screens and real touch events, headless Chrome. Scripts prove rules and wiring, not feel.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('x'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
let fails = 0;
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails++; };

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/games/tide-gap/index.html?test`;
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  const errs = [];
  const open = async (viewport, extra) => {
    const ctx = await browser.newContext(Object.assign({ viewport }, extra || {}));
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.locator('#drift-gate .yes').click();
    await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
    return { ctx, page };
  };
  const { ctx, page } = await open({ width: 390, height: 844 });
  const wait = ms => page.waitForTimeout(ms);
  const toResult = () => page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 8000 });
  const again = async () => { await wait(700); await page.locator('[data-kit="primary"]').first().click(); };

  // ---- The review's run: Tougher Hull 3 and Spare Logbook 3, scraping every tooth, 10 seeds. Three copies used to pay for the boss exactly, and the book ended on six.
  const story = await page.evaluate(() => {
    localStorage.clear(); DriftSave.load();
    for (const id of ['hull', 'spare']) for (let i = 0; i < 3; i++) DriftSave.buyUpgrade('tide-gap', id, 0, 3);
    const u = Kit.def.update; let last; Kit.def.update = (d, r, i) => { last = r; return u(d, r, i); };
    TUNE.botShut = 'scrape';
    const out = [];
    for (let s = 1; s <= 10; s++) {
      let c, t = '';
      for (let i = 0; i < 5; i++) { let n = 0, r; do { n++; r = __kit.runStage(i, { bot: true, seed: s * 7919 + i * 31 + n, fair: false, renderEvery: 0, carry: c && JSON.parse(JSON.stringify(c)), continued: !!c, maxSeconds: 400 }); } while (r.result !== 'win' && n < 20); t += r.result === 'win' ? 'w' : 'l'; if (r.result !== 'win') break; c = JSON.parse(JSON.stringify(last.carry)); }
      out.push({ t, lines: c.rows.filter(q => !q.lost).length, lost: c.lost.join(), copies: c.sparesUsed });
    }
    TUNE.botShut = 'weigh'; Kit.def.update = u;
    return out;
  });
  console.log('     ' + story.map(s => `${s.t} L${s.lines} [${s.lost}] copies ${s.copies}`).join('\n     '));
  check(story.every(s => s.t === 'wwwww' && s.lines === 3), 'Tougher Hull 3 and Spare Logbook 3, scraping every tooth: the boss still drowns three real lines');

  // ---- A copy pays on a stage, not at the boss, even with copies left.
  const copies = await page.evaluate(() => {
    __kit.jump(1, { fair: false }); let r = __kit.run();
    const a = { spare: TG.spareLeft(r) }; TG.drown(r); a.after = TG.spareLeft(r); a.lines = TG.linesLeft(r);
    __kit.jump(4, { fair: false }); r = __kit.run();
    const b = { spare: TG.spareLeft(r) }; TG.drown(r); b.lines = TG.linesLeft(r);
    __kit.title();
    return { a, b };
  });
  check(copies.a.spare === 3 && copies.a.after === 2 && copies.a.lines === 6, `stage 2: a copy pays first (${copies.a.spare} to ${copies.a.after}, ${copies.a.lines} lines)`);
  check(copies.b.spare === 0 && copies.b.lines === 5, `boss: no copy pays (${copies.b.spare} copies, ${copies.b.lines} lines)`);
  await page.evaluate(() => { localStorage.clear(); DriftSave.load(); });

  // ---- Dive a tooth for its cache, then wreck: the line comes back and the gold doesn't. Win it, and the gold pays.
  const diveFor = async (i) => {
    await page.evaluate(i => { TUNE.botShut = 'dive'; __kit.jump(i, { fair: true }); __kit.bot(true); __kit.timeScale = 8; }, i);
    await page.waitForFunction(() => __kit.run().w.heldSalvage > 0 || __kit.run().over, null, { timeout: 60000 });
    await page.evaluate(() => { __kit.bot(false); __kit.timeScale = 1; });
  };
  await diveFor(0);
  const died = await page.evaluate(() => { const r = __kit.run(), w = r.w; const before = { held: w.heldSalvage, sal: r.salvage, lines: TG.linesLeft(r) }; w.dive.state = 'up'; w.hullLeft = 1; w.inv = 0; TG.knock(r, 'rock'); return before; });
  await toResult();
  const earned = await page.evaluate(() => { const r = __kit.run(); return { sal: r.salvage, banked: r.banked }; });
  await again(); await wait(100);
  const retried = await page.evaluate(() => { const r = __kit.run(); return { lines: TG.linesLeft(r), sal: r.salvage }; });
  check(died.held >= 5 && died.lines === 5, `Dive for the cache: ${died.held} held, ${died.lines} lines`);
  check(earned.banked === Math.floor(died.sal), `wreck: earns only what isn't Dive gold (${earned.banked} banked, ${died.held} left behind)`);
  check(retried.lines === 6 && retried.sal === 0, `try again: the line is back (${retried.lines}), and no gold came with it`);

  const cleared = await page.evaluate(() => {
    TUNE.botShut = 'dive';
    const r = __kit.runStage(0, { bot: true, seed: 11, fair: true, renderEvery: 0 });
    TUNE.botShut = 'scrape';
    const s = __kit.runStage(0, { bot: true, seed: 11, fair: true, renderEvery: 0 });
    TUNE.botShut = 'weigh';
    return { dive: r.salvage, scrape: s.salvage };
  });
  check(cleared.dive >= cleared.scrape + 10, `clear the stage: the gold pays (Dive ${cleared.dive}, scrape ${cleared.scrape})`);

  // ---- Pause, then Restart: the line stays gone, so its gold comes along.
  await diveFor(1);
  const held = await page.evaluate(() => __kit.run().w.heldSalvage);
  await page.keyboard.press('KeyP'); await wait(100); await page.locator('[data-kit="restart"]').click(); await wait(100);
  const restarted = await page.evaluate(() => { const r = __kit.run(); return { lines: TG.linesLeft(r), sal: r.salvage }; });
  check(restarted.lines === 5 && restarted.sal === held, `Pause, Restart: line stays gone (${restarted.lines}), its ${held} gold comes along (${restarted.sal})`);
  await page.evaluate(() => { TUNE.botShut = 'weigh'; __kit.title(); });

  // ---- Lose lines with a blank book. Eight deaths through the real result screen.
  const said = [];
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => { const carry = { rows: TG.MEMORIES.map(m => ({ lost: m.id })), lost: TG.MEMORIES.map(m => m.id), pagesFound: 0, sparesUsed: 0 }; __kit.jump(1, { fair: true, carry, continued: true }); __kit.run().lose(0); });
    await toResult();
    said.push(await page.locator('.kit-line').first().textContent());
  }
  const twice = said.filter((l, i) => i && l === said[i - 1]).length, kinds = new Set(said).size;
  check(kinds >= 4 && twice === 0, `blank book, 8 deaths: ${kinds} different lines, ${twice} repeated running`);
  await page.evaluate(() => __kit.title());

  // ---- Mopclaw, last, since it really goes in the save. Catch costs the line: dying keeps the pal and the line stays gone.
  await page.evaluate(() => { TUNE.palBot = 'mopclaw'; __kit.jump(2, { fair: true }); __kit.bot(true); __kit.timeScale = 6; });
  await page.waitForFunction(() => __kit.state().screen === 'catch', null, { timeout: 90000 });
  const caught = await page.evaluate(() => { __kit.bot(false); __kit.timeScale = 1; const r = __kit.run(); return { lines: TG.linesLeft(r), lost: r.carry.lost.slice(), pals: r.caught.slice() }; });
  await wait(700); await page.locator('[data-kit="catch-ok"]').click(); await wait(100);
  await page.evaluate(() => { const r = __kit.run(), w = r.w; w.dive.state = 'up'; w.hullLeft = 1; w.inv = 0; TG.knock(r, 'rock'); });
  await toResult();
  await again(); await wait(100);
  const after = await page.evaluate(() => { const r = __kit.run(); TUNE.palBot = false; return { lines: TG.linesLeft(r), lost: r.carry.lost.slice(), has: r.hasPal('mopclaw') }; });
  check(caught.lines === 5 && after.lines === 5 && after.has && after.lost.join() === caught.lost.join(), `catch Mopclaw, wreck, try again: pal kept, line stays gone (${after.lines} lines, lost ${after.lost})`);
  await ctx.close();

  // ---- The boss's strip and Pause, by screen.
  for (const [width, height] of [[320, 568], [360, 640], [375, 667], [390, 664], [1440, 900]]) {
    const v = await open({ width, height });
    const r = await v.page.evaluate(() => { __kit.jump(4, { fair: true }); const run = __kit.run(), L = TG.bookLayout(run, Kit.view), P = document.querySelector('.kit-pause').getBoundingClientRect(), k = Kit.view.scale, cv = document.querySelector('canvas').getBoundingClientRect(); return { strip: L.strip, right: cv.left + (L.x - Kit.view.left) * k + L.w * k, pause: P.left }; });
    check(!r.strip || r.right <= r.pause, `${width}x${height}: strip ${r.strip}, book's right edge ${r.right.toFixed(1)}, Pause at ${r.pause}`);
    await v.ctx.close();
  }

  // ---- Real touch events, 375x667. 48 CSS px in about 0.45 s failed 8 of 8 in the review, on stages 2 and 3. Holding still must still do nothing.
  const t = await open({ width: 375, height: 667 }, { hasTouch: true, isMobile: true });
  const cdp = await t.ctx.newCDPSession(t.page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  let dived = 0, ring = 0, ms = 0;
  const TRIES = [[1, 500], [1, 560], [1, 600], [2, 500], [2, 560], [2, 600], [1, 520], [2, 580]];
  for (const [stage, y] of TRIES) {
    await t.page.evaluate(i => { __kit.jump(i, { fair: true }); __kit.bot(false); __kit.timeScale = 1; const w = __kit.run().w; w.diveUnlocked = true; }, stage);
    await t.page.waitForTimeout(150);
    await touch('touchStart', 190, y); await t.page.waitForTimeout(300);
    await t.page.evaluate(() => { window.__ring = 0; clearInterval(window.__ringT); window.__ringT = setInterval(() => { if (__kit.run().w.pullShow > 0) window.__ring++; }, 16); });
    const t0 = Date.now();
    for (let i = 1; i <= 12; i++) await touch('touchMove', 190, y + i * 4);
    ms += Date.now() - t0;
    await t.page.waitForTimeout(500);
    ring += await t.page.evaluate(() => window.__ring);
    if (await t.page.evaluate(() => __kit.run().w.dive.state !== 'up' || TG.linesLeft(__kit.run()) < 6)) dived++;
    await touch('touchEnd');
  }
  check(dived === TRIES.length, `real touch, 48 CSS px in ${Math.round(ms / TRIES.length)} ms on average: Dived ${dived} of ${TRIES.length}`);
  check(ring > 0, `the thin ring showed on the way down (seen on ${ring} samples)`);
  await t.page.evaluate(() => { __kit.jump(1, { fair: true }); const w = __kit.run().w; w.diveUnlocked = true; });
  await touch('touchStart', 190, 560); await t.page.waitForTimeout(2500);
  const still = await t.page.evaluate(() => ({ dive: __kit.run().w.dive.state, lines: TG.linesLeft(__kit.run()), ring: __kit.run().w.pullShow }));
  await touch('touchEnd');
  check(still.dive === 'up' && still.lines === 6 && !still.ring, `a thumb held still for 2.5 s: dive ${still.dive}, ${still.lines} lines, no ring`);
  await t.ctx.close();

  check(errs.length === 0, `no page errors (${errs.length})${errs.length ? ': ' + errs.slice(0, 3).join('; ') : ''}`);
  await browser.close(); server.close();
  console.log(fails ? `FAILED ${fails}` : 'PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
