// Does the bond cost change how you play, and is it still fair? node games/tide-gap/test/fairness.js [seeds]
// Plays through the real input path in headless Chrome with the no-foresight player in botfair.js: it sees only what's on the smallest screen and through the fog, reacts late, steers at a set thumb speed, and believes whatever arrows the book still gives.
// 1. What a line costs: rock knocks a run at each number of lines left, with the shut teeth taken out and the hull not limiting, so nothing hides the count. Must go up as the book empties, at two reaction speeds.
// 2. An empty book is hard, not hopeless: at 0.35 s it must still finish each stage at least a quarter of the time, with the shut teeth costing their knocks. Stage 4's last two teeth only come if a found page can pay for a Dive.
// 3. A full book at a normal reaction wins nearly always, and the boss with a full book still can be beaten.
// 4. What you do at a shut tooth matters: scrape every one, Dive at every one, or weigh it up.
// 5. A whole story run, hull and book carried from stage to stage, with each of those habits.
// These are script numbers. A person's thumb has to confirm them.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
if (!playwright) { console.error('playwright-core not found'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..', '..', '..'), SEEDS = +process.argv[2] || 20;
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

  // lines: how many the book starts with. shut: what it does at a shut tooth.
  const play = (i, react, thumb, lines, shut) => page.evaluate(([i, react, thumb, lines, shut, n]) => {
    TUNE.botMode = 'react'; TUNE.botReact = react; TUNE.botThumb = thumb; TUNE.botSense = true; TUNE.botShut = shut;
    const gone = 6 - lines;
    const carry = gone ? { rows: TG.MEMORIES.map((m, k) => (k < gone ? { lost: m.id } : { id: m.id, text: m.text })), lost: TG.MEMORIES.slice(0, gone).map(m => m.id), pagesFound: 0, sparesUsed: 0 } : undefined;
    let wins = 0, dives = 0, left = 0; const causes = {};
    for (let s = 1; s <= n; s++) {
      const r = __kit.runStage(i, { bot: true, seed: s * 7919 + i * 31, fair: true, renderEvery: 0, carry: carry && JSON.parse(JSON.stringify(carry)) });
      if (r.result === 'win') wins++;
      dives += r.info.dives; left += r.info.lines;
      (r.info.causes || []).forEach(c => { causes[c] = (causes[c] || 0) + 1; });
    }
    TUNE.botMode = 'plan'; TUNE.botSense = false; TUNE.botShut = 'weigh';
    return { wins, dives, left, causes };
  }, [i, react, thumb, lines, shut, SEEDS]);

  const fmt = r => `${String(r.wins).padStart(3)}/${SEEDS} wins, ${JSON.stringify(r.causes)} over ${SEEDS} runs`;
  const fails = [];

  // Rock knocks a run with no teeth and a hull that can't run out, so an early end can't hide what a line costs.
  const rocks = (i, react, thumb, lines) => page.evaluate(([i, react, thumb, lines, n]) => {
    TUNE.botMode = 'react'; TUNE.botReact = react; TUNE.botThumb = thumb; TUNE.botSense = true; TUNE.botShut = 'scrape';
    const hull = TUNE.hull, shut = Kit.def.stages[i].shut, gone = 6 - lines; TUNE.hull = 30; Kit.def.stages[i].shut = [];
    const carry = gone ? { rows: TG.MEMORIES.map((m, k) => (k < gone ? { lost: m.id } : { id: m.id, text: m.text })), lost: TG.MEMORIES.slice(0, gone).map(m => m.id), pagesFound: 0, sparesUsed: 0 } : undefined;
    let rock = 0;
    for (let s = 1; s <= n; s++) (__kit.runStage(i, { bot: true, seed: s * 32452843 + i, fair: true, renderEvery: 0, carry: carry && JSON.parse(JSON.stringify(carry)) }).info.causes || []).forEach(c => { if (c === 'rock') rock++; });
    TUNE.hull = hull; Kit.def.stages[i].shut = shut; TUNE.botMode = 'plan'; TUNE.botSense = false; TUNE.botShut = 'weigh';
    return rock / n;
  }, [i, react, thumb, lines, SEEDS]);
  console.log('1. What a line costs. Rock knocks a run, never Diving, no shut teeth, the hull not limiting:');
  for (const [react, thumb] of [[0.35, 260], [0.5, 200]]) for (let i = 1; i < 4; i++) {
    const row = [], cost = [];
    for (const k of [6, 5, 4, 3, 2, 1, 0]) { const c = await rocks(i, react, thumb, k); cost.push(c); row.push(`${k} lines ${c.toFixed(2)}`); }
    console.log(`   ${react} s, ${thumb} px/s, stage ${i + 1}: ` + row.join(', '));
    // Stage 2's six-line figure is the script leaning into the next gate too early, not the game (NOTES.md), so that stage is measured from five.
    const top = i === 1 ? cost[1] : cost[0];
    if (cost[6] <= top) fails.push(`${react} s, stage ${i + 1}: an empty book costs no more than a full one`);
    if (i > 1 && !(cost[3] > top && cost[6] > cost[3])) fails.push(`${react} s, stage ${i + 1}: no slope from full to half to empty`);
  }

  console.log('2. An empty book, 260 px/s thumb. Shut teeth get scraped, since Dives have stopped, unless a found page has paid for one and the hull is on its last plank:');
  for (const react of [0.25, 0.35, 0.5, 0.7]) {
    const out = [];
    for (let i = 0; i < 4; i++) { const r = await play(i, react, 260, 0, 'weigh'); out.push(`stage ${i + 1} ${r.wins}/${SEEDS}`); if (react === 0.35 && r.wins < SEEDS * 0.25) fails.push(`empty book, 0.35 s, stage ${i + 1}: ${r.wins}/${SEEDS}`); }
    console.log(`   reaction ${react}s: ` + out.join(' | '));
  }

  console.log('3. A full book, weighing up shut teeth:');
  for (const [react, thumb] of [[0.35, 260], [0.5, 200], [0.7, 200]]) {
    const out = [];
    for (let i = 0; i < 5; i++) { const r = await play(i, react, thumb, 6, 'weigh'); out.push(`${i === 4 ? 'boss' : 'stage ' + (i + 1)} ${r.wins}/${SEEDS}`); if (react === 0.35 && r.wins < SEEDS * 0.9) fails.push(`full book, 0.35 s, ${i === 4 ? 'boss' : 'stage ' + (i + 1)}: ${r.wins}/${SEEDS}`); }
    console.log(`   reaction ${react}s, ${thumb} px/s: ` + out.join(' | '));
  }
  console.log('   Boulders alone, stage 2, a slow player (0.7 s, 200 px/s):');
  { const r = await play(1, 0.7, 200, 6, 'weigh'); console.log('     ' + fmt(r)); }

  console.log('4. What you do at a shut tooth, a story player at 0.5 s and 200 px/s, full book at the start of each stage:');
  for (const shut of ['scrape', 'dive', 'weigh']) {
    const out = [];
    for (let i = 0; i < 4; i++) { const r = await play(i, 0.5, 200, 6, shut); out.push(`stage ${i + 1} ${r.wins}/${SEEDS}, ${(r.left / SEEDS).toFixed(1)} lines left`); }
    console.log(`   ${shut.padEnd(6)}: ` + out.join(' | '));
  }
  console.log('   The boss by lines coming in, 0.5 s, 200 px/s:');
  { const out = []; for (const k of [6, 4, 2, 1, 0]) { const r = await play(4, 0.5, 200, k, 'weigh'); out.push(`${k} lines ${r.wins}/${SEEDS}, knocks ${JSON.stringify(r.causes)}, ${(r.dives / SEEDS).toFixed(1)} Dives, ${(r.left / SEEDS).toFixed(1)} left`); if (r.wins === 0) fails.push(`boss with ${k} lines, 0.5 s: never won`); } console.log('     ' + out.join('\n     ')); }

  console.log('5. A whole story run, 8 seeds, up to 12 tries a stage. Tries per stage, then lines and planks left at the boss. Bots here never fetch a page:');
  const story = (react, thumb, shut, weighLines, seed) => page.evaluate(([react, thumb, shut, weighLines, seed]) => {
    TUNE.botMode = 'react'; TUNE.botReact = react; TUNE.botThumb = thumb; TUNE.botSense = true; TUNE.botShut = shut; TUNE.botWeighLines = weighLines;
    const up = Kit.def.update; let carry, tries = [], atBoss = '', lastCarry, lastW;
    Kit.def.update = (dt, run, input) => { lastCarry = run.carry; lastW = run.w; TG.step(run, dt, input); };
    for (let i = 0; i < 5; i++) {
      let n = 0, r;
      do { n++; r = __kit.runStage(i, { bot: true, seed: seed * 7 + i * 1009 + n * 31, fair: true, renderEvery: 0, carry: carry && JSON.parse(JSON.stringify(carry)) }); } while (r.result !== 'win' && n < 12);
      tries.push(r.result === 'win' ? n : 'x');
      if (r.result !== 'win') break;
      carry = JSON.parse(JSON.stringify(lastCarry));
      if (i === 3) atBoss = `${carry.rows.filter(q => !q.lost).length}L ${lastW.hullLeft}p`;
    }
    Kit.def.update = up; TUNE.botMode = 'plan'; TUNE.botSense = false; TUNE.botShut = 'weigh'; TUNE.botWeighLines = 5;
    return tries.join('') + ' ' + atBoss;
  }, [react, thumb, shut, weighLines, seed]);
  for (const [react, thumb] of [[0.35, 260], [0.5, 200]]) for (const [name, shut, lines] of [['keep lines, scrape till the last plank', 'weigh', 7], ['Dive at every tooth', 'dive', 5], ['Dive with 4 or more lines', 'weigh', 4]]) {
    const out = [];
    for (let s = 1; s <= 8; s++) out.push(await story(react, thumb, shut, lines, s));
    console.log(`   ${react} s, ${name}: ` + out.join(' | '));
    if (out.filter(o => !o.includes('x')).length < 6) fails.push(`${react} s, ${name}: story runs that can't finish`);
  }

  await browser.close(); server.close();
  if (errs.length) fails.push('page errors: ' + errs.slice(0, 5).join('; '));
  if (fails.length) { console.log('FAILED:'); fails.forEach(f => console.log('  ' + f)); process.exit(1); }
  console.log('PASSED');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
