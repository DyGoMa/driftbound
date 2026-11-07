// Does the talk in play arrive when it applies, and does every memory scene get played? node games/tide-gap/test/talk.js [seeds]
// Headless Chrome, the game's own bot, with run.say logged against the boss's state. Script numbers: nobody has read these at speed.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
if (!playwright) { console.error('playwright-core not found'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..', '..', '..'), SEEDS = +process.argv[2] || 12;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('x'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  const page = await (await browser.newContext({ viewport: { width: 360, height: 640 } })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/games/tide-gap/index.html?test`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');

  const out = await page.evaluate(SEEDS => {
    const res = { boss: [], timeline: [], stage4: [], carried: [], fails: [] };
    const init0 = Kit.def.init, update0 = Kit.def.update;
    let log = [], states = [], last = null, carryOut = null;
    Kit.def.init = run => { init0(run); run.say = (who, text) => { const b = run.w.boss; log.push({ t: run.time, who, text, state: b ? b.state : '', hits: b ? b.hits : 0 }); }; };
    Kit.def.update = (dt, run, input) => { update0(dt, run, input); const b = run.w.boss; carryOut = run.carry; if (b && b.state !== last) { last = b.state; states.push({ t: run.time, state: b.state, hits: b.hits }); } };
    const W = TG.WORDS, openText = W.boss.open.text, hitText = W.boss.hit.map(l => l.text), fallText = W.boss.fall.text;
    const said = (id, l) => TG.memory(id).after.every(a => l.some(x => x.text === TG.voice(a.text, [])));

    // The boss: every call on time, every scene played.
    for (let s = 1; s <= SEEDS; s++) {
      log = []; states = []; last = null;
      const r = __kit.runStage(4, { bot: true, seed: s * 137 + 4, fair: true, renderEvery: 0 });
      if (r.result !== 'win') { res.fails.push(`boss seed ${s}: bot ${r.result}`); continue; }
      let lateOpen = 0, lateHit = 0, shutOpen = 0;
      states.forEach(st => {
        if (st.state === 'open' && !log.some(l => l.text === openText && Math.abs(l.t - st.t) < 0.1)) lateOpen++;
        if (st.state === 'stagger' && !log.some(l => hitText.includes(l.text) && Math.abs(l.t - st.t) < 0.1)) lateHit++;
      });
      log.forEach(l => { if (l.text === openText && l.state !== 'open') shutOpen++; });
      const fallSaid = log.some(l => l.text === fallText);
      const scenes = r.info.lostIds || ['coat', 'cards', 'soup'].filter((id, i) => i < r.info.dives);
      const missing = scenes.filter(id => !said(id, log));
      if (lateOpen || lateHit || shutOpen || !fallSaid || missing.length) res.fails.push(`boss seed ${s}: late open ${lateOpen}, late hit ${lateHit}, open while shut ${shutOpen}, fall line ${fallSaid}, scenes missing ${missing}`);
      res.boss.push(`${r.seconds}s`);
      if (s === 1) { res.timeline = log.map(l => `t=${l.t.toFixed(1)} ${l.state} hits ${l.hits} ${l.who}: ${l.text.slice(0, 54)}`); res.states = states.map(x => `t=${x.t.toFixed(1)} ${x.state}`); }
    }

    // Stage 4, a Dive at every tooth: the comment on the first Dive comes first, and a scene the stage's end cuts off opens the boss.
    TUNE.botShut = 'dive';
    for (let s = 1; s <= SEEDS; s++) {
      log = [];
      const r = __kit.runStage(3, { bot: true, seed: s * 211 + 3, fair: true, renderEvery: 0 });
      if (r.result !== 'win') continue;
      const stage = log.slice(), cAfter = JSON.parse(JSON.stringify(carryOut)), left = cAfter.talkLeft || [];
      const first = stage.findIndex(l => l.text === W.firstDrown.text), coat = stage.findIndex(l => l.text === TG.memory('coat').after[0].text);
      if (first < 0 || (coat >= 0 && first > coat)) res.fails.push(`stage 4 seed ${s}: first Dive's comment at ${first}, scene at ${coat}`);
      log = [];
      __kit.runStage(4, { bot: true, seed: s * 211 + 4, fair: true, renderEvery: 0, carry: cAfter });
      const owed = cAfter.lost.filter(id => !said(id, stage.concat(log)));
      const leftPlayed = left.every(l => log.some(x => x.text === TG.voice(l.text, [])));
      if (owed.length || !leftPlayed) res.fails.push(`stage 4 into boss, seed ${s}: scenes never played ${owed}; carried in and played ${leftPlayed}`);
      res.stage4.push(`left ${left.length}`);
      if (s === 1) res.carried = stage.map(l => `t=${l.t.toFixed(1)} ${l.who}: ${l.text.slice(0, 54)}`);
    }
    TUNE.botShut = 'weigh';
    Kit.def.init = init0; Kit.def.update = update0;
    return res;
  }, SEEDS);

  console.log('Boss states, seed 1: ' + out.states.join(', '));
  console.log('Boss talk, seed 1:\n  ' + out.timeline.join('\n  '));
  console.log('Boss length by seed: ' + out.boss.join(' '));
  console.log('Stage 4, Dive every tooth, seed 1:\n  ' + out.carried.join('\n  '));
  console.log('Scene lines the end of stage 4 carried into the boss, by seed: ' + out.stage4.join(', '));
  await browser.close(); server.close();
  const fails = out.fails.concat(errs.slice(0, 5).map(e => 'page error: ' + e));
  if (fails.length) { console.log('FAILED:'); fails.forEach(f => console.log('  ' + f)); process.exit(1); }
  console.log('PASSED');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
