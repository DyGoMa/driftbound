// Hot Hand: is it fair? node games/hot-hand/tools/fairness.js [--seeds 20] [--only players|audit|threats|air|targets|bet|pics|endless|keys|say|pals|palrate|ups|perf] [--stage 5]
// Plays every stage in headless Chrome through the game's real tap handling, with bots that are only allowed what a person is allowed:
//  - a warning-time audit: every hit that lands is logged with how long its warning had been showing. Nothing may land with less than MIN_LEAD seconds of warning.
//  - reaction bots: each sees a thing only after its reaction time, taps no faster than a person, and misses its spot a little.
//  - proof heat matters: a bot that refuses to go above WARM must do worse than one that plays the top, and a button-masher must burn itself.
//  - tap targets: the smallest target on screen, in CSS px, on the smallest phone.
//  - the bet: real screens, real clicks, with nothing in the bank: it can't go below zero, can't trap you, and a lost bet shows.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let pw = null; for (const p of PW) { try { pw = require(p); break; } catch (e) { /* next */ } }
if (!pw) { console.error('playwright-core not found'); process.exit(2); }
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const SEEDS = +opt('seeds', 20), ONLY = opt('only', ''), STAGE = opt('stage', '');
const ROOT = path.resolve(__dirname, '../../..');
const MIN_LEAD = 0.8;           // PROVISIONAL: seconds of warning every hit must have had
const SMALL_SCALE = 568 / 640;  // the kit's scale on a 568 x 320 phone
const SHOTS = path.join(os.tmpdir(), 'kcheck', 'hot-hand');
fs.mkdirSync(SHOTS, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
const fails = []; const check = (ok, s) => { console.log((ok ? 'ok   ' : 'FAIL ') + s); if (!ok) fails.push(s); };

// In the page: run one stage many times under one set of rules.
const runMany = (page, stage, seeds, setup) => page.evaluate(([stage, seeds, setup]) => {
  const keep = {}; for (const k of Object.keys(setup)) { keep[k] = TUNE[k]; TUNE[k] = setup[k]; }
  const out = [];
  for (let s = 1; s <= seeds; s++) {
    const bot = setup.__idle ? false : true;
    const r = __kit.runStage(stage, { bot, seed: s * 7919 + stage * 13, fair: true, maxSeconds: setup.__idle ? 180 : 400, renderEvery: 0 });
    out.push(Object.assign({ result: r.result, secs: r.seconds, salvage: r.salvage }, r.info));
  }
  for (const k of Object.keys(setup)) TUNE[k] = keep[k];
  return out;
}, [stage, seeds, setup]);

const sum = (a, f) => a.reduce((n, x) => n + f(x), 0);
function line(name, list) {
  const wins = list.filter(r => r.result === 'win').length, hits = sum(list, r => r.hits || 0), over = sum(list, r => r.over || 0);
  return `${name.padEnd(22)} wins ${String(wins).padStart(3)}/${list.length}  hits/run ${(hits / list.length).toFixed(1).padStart(4)}  overheats/run ${(over / list.length).toFixed(1).padStart(4)}  avg heat ${String(Math.round(sum(list, r => r.avgHeat || 0) / list.length)).padStart(3)}  salvage ${Math.round(sum(list, r => r.salvage) / list.length)}  secs ${Math.round(sum(list, r => r.secs) / list.length)}`;
}

// lag: how long the thumb takes to arrive after the eye has picked: the tap lands where the thing was seen.
const PLAYERS = {
  'plain bot': { botHuman: null },
  'quick thumb (0.3 s)': { botHuman: { react: 0.3, taps: 3.5, jitter: 8, sloppy: 0.08, slip: 0.1, lag: 0.1 } },
  'clean thumb, never red': { botHuman: { react: 0.45, taps: 2.8, jitter: 8, sloppy: 0, lag: 0.15 } },
  'steady (0.45 s)': { botHuman: { react: 0.45, taps: 2.8, jitter: 12, sloppy: 0.1, slip: 0.08, lag: 0.15 } },
  'average (0.45 s)': { botHuman: { react: 0.45, taps: 2.8, jitter: 12, sloppy: 0.18, slip: 0.2, lag: 0.15 } },
  'slow (0.6 s)': { botHuman: { react: 0.6, taps: 2.2, jitter: 14, sloppy: 0.28, slip: 0.3, lag: 0.2 } },
  'never above WARM': { botHuman: { react: 0.45, taps: 2.8, jitter: 8, sloppy: 0, lag: 0.15 }, botCap: 53 },
  'never above COLD': { botHuman: { react: 0.45, taps: 2.8, jitter: 8, sloppy: 0, lag: 0.15 }, botCap: 18 },
  'button masher': { botHuman: { react: 0.15, taps: 6, jitter: 10, sloppy: 0.35, lag: 0.1 }, botIgnoreHeat: true },
};

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${srv.address().port}/games/hot-hand/index.html?test`;
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 844, height: 390 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(url); await page.waitForTimeout(600); await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
  const stages = await page.evaluate(() => Kit.def.stages.length);

  const parts = { page, ctx, SEEDS, ONLY, STAGE, stages, check, runMany, line, sum, PLAYERS, MIN_LEAD, SMALL_SCALE, SHOTS, path, fs };
  for (const part of ['players', 'bet', 'threats', 'misc']) await require('./fair-' + part + '.js')(parts);

  check(errs.length === 0, 'no page errors (' + errs.length + ')' + (errs[0] ? ': ' + errs[0] : ''));
  await b.close(); srv.close();
  console.log(fails.length ? `\nFAILED ${fails.length}:\n - ` + fails.join('\n - ') : '\nPASSED');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
