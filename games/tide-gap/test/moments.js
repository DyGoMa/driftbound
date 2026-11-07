// The bond cost and the controls, through real input and the kit's real screens. node games/tide-gap/test/moments.js
// Real drag steers, real hold dives, a drag never dives. A lost line stays through Next stage, Menu and reload; a retry puts back what the stage began with; stage 1 starts clean.
// Upgrades change what they say. An empty book stops Dives and gets a page in the boss. The ending changes with what's left.
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
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
  const pull = async (x = 195, y = 560) => { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x, y + 50, { steps: 3 }); };
  const w = () => page.evaluate(() => { const r = __kit.run(), w = r.w; return { dive: w.dive.state, target: w.targetX, ship: w.shipX, lines: TG.linesLeft(r), lost: r.carry.lost, air: w.airMax, hull: w.hullMax, spare: TG.spareLeft(r), screen: __kit.state().screen }; });
  const wait = ms => page.waitForTimeout(ms);
  const skipTalk = async () => { for (let i = 0; i < 6 && (await page.evaluate(() => __kit.state().screen)) === 'talk'; i++) { await page.locator('[data-kit="skip"]').click({ timeout: 2000 }).catch(() => {}); await wait(60); } };

  // ---- Stage 1 locks the Dive until the crew have explained it, and a thumb left resting through that moment never spends a line.
  await page.evaluate(() => { __kit.bot(false); __kit.jump(0, { fair: true }); });
  await pull(); await wait(300);
  let s = await w();
  check(s.dive === 'up' && s.lines === 6, `stage 1, before the crew explain it: even a real pull doesn't Dive (${s.dive}, lines ${s.lines})`);
  await page.mouse.up();
  const rest = await page.evaluate(() => {
    __kit.jump(0, { fair: true }); const r = __kit.run(), w = r.w, I = Kit.input; __kit.timeScale = 0;
    w.laid.end = 1e9;
    const step = () => { I._begin(1 / 60); r.time += 1 / 60; Kit.def.update(1 / 60, r, I); I._end(); };
    I.reset(); I.sim.press(180, 560);
    let n = 0; while (!w.diveUnlocked && n++ < 60 * 60) step();
    const unlockedAt = +(w.dist / r.stage.length).toFixed(2);
    for (let i = 0; i < 180; i++) step();
    const out = { unlockedAt, dive: w.dive.state, lines: TG.linesLeft(r), said: !!w.diveHintDelay || w.diveHintT > 0 };
    __kit.timeScale = 1; __kit.title(); return out;
  });
  check(rest.dive === 'up' && rest.lines === 6, `a thumb resting from the start, through the unlock (at ${rest.unlockedAt} of the stage) and 3 s past it: no Dive, ${rest.lines} lines`);
  check(rest.said, 'the how-to comes after Ione has said it');
  await page.evaluate(() => { __kit.bot(false); __kit.jump(0, { fair: true }); const w = __kit.run().w; w.diveUnlocked = true; w.laid.end = 1e9; w.rocks = []; w.gates = []; });

  // ---- Real drag steers and never dives. Nothing a thumb does by habit spends a memory.
  const t0 = (await w()).target;
  await page.mouse.move(195, 600); await page.mouse.down(); await wait(40);
  await page.mouse.move(255, 600, { steps: 6 }); await wait(700);
  s = await w();
  check(s.target > t0 + 60 && s.dive === 'up' && s.lines === 6, `a drag steers (aim ${t0} to ${Math.round(s.target)}) and holding still afterward doesn't Dive (${s.dive}, lines ${s.lines})`);
  await page.mouse.up();
  await page.mouse.move(195, 600); await page.mouse.down(); await wait(500); await page.mouse.move(255, 600, { steps: 4 }); await wait(60); await page.mouse.up();
  check((await w()).lines === 6, 'a press, a pause, then a drag: no Dive');
  await page.mouse.move(195, 600); await page.mouse.down(); for (let i = 0; i < 20; i++) { await page.mouse.move(195 + (i % 2 ? 4 : -4), 600 + (i % 3) * 3); await wait(25); } await page.mouse.up();
  check((await w()).lines === 6, 'a jittering thumb: no Dive');
  await page.mouse.move(100, 500); await page.mouse.down(); for (let i = 0; i <= 20; i++) { const a = i / 20; await page.mouse.move(100 + 190 * a, 500 + 34 * Math.sin(a * Math.PI)); await wait(16); } await page.mouse.up();
  check((await w()).lines === 6, "a wide sweep with a thumb's arc in it: no Dive");
  await page.mouse.move(195, 560); await page.mouse.down(); for (let i = 0; i < 40; i++) { await page.mouse.move(195, 560 + i); await wait(20); } await page.mouse.up();
  check((await w()).lines === 6, 'a slow wander down the glass: no Dive');
  await page.mouse.move(195, 560); await page.mouse.down(); await page.mouse.move(195, 610, { steps: 3 }); await page.mouse.up(); await wait(200);
  check((await w()).lines === 6, 'a flick down and straight off the glass: no Dive');

  // ---- A real pull dives from a thumb already on the glass, costs one line, and rises when let go.
  await page.mouse.move(195, 560); await page.mouse.down(); await page.mouse.move(240, 560, { steps: 4 }); await wait(400);
  await page.mouse.move(240, 610, { steps: 3 });
  await page.waitForFunction(() => __kit.run().w.dive.state === 'down', null, { timeout: 2000 });
  s = await w();
  check(s.lines === 5 && s.lost[0] === 'coat', `a thumb already down, pulled down and kept on, Dives and drowns the first line (lines ${s.lines}, lost ${s.lost})`);
  await page.mouse.up(); await wait(350);
  check((await w()).dive === 'up', 'letting go comes back up');
  await pull(); await page.waitForFunction(() => __kit.run().w.dive.state === 'down'); await page.waitForFunction(() => __kit.run().w.dive.state !== 'down', null, { timeout: 5000 }); await wait(500);
  s = await w();
  check(s.dive === 'up' && s.lines === 4, `running out of air surfaces, and a thumb left down doesn't Dive again (${s.dive}, lines ${s.lines})`);
  await page.mouse.up();

  // ---- A Dive goes under a rock; coming up under one is a knock.
  const under = await page.evaluate(() => {
    __kit.jump(1, { fair: true }); __kit.bot(false); const save = __kit.state().timeScale; __kit.timeScale = 0;
    const r = __kit.run(), w = r.w, I = Kit.input, step = () => { I._begin(1 / 60); r.time += 1 / 60; Kit.def.update(1 / 60, r, I); I._end(); };
    w.rocks = []; w.gates = []; w.laid.end = 1e9; w.dropT = 1e9;
    const rock = TG.makeRock({ side: 'M', x0: w.shipX, w: 120, at: w.dist + 160, len: 110, from: 0, to: 0, drift: 0 });
    w.rocks.push(rock);
    I.reset(); I.sim.press(180, 560); step(); I.sim.move(180, 600);
    let t = 0; while (w.dive.state !== 'down' && t++ < 60) step();
    const startKnocks = w.knocks;
    let overlapped = 0; for (let i = 0; i < 70 && w.dive.state === 'down'; i++) { step(); if (TG.hullHits(rock, rock.x, w.shipX, w.dist, 3)) overlapped++; }
    const after = w.knocks - startKnocks;
    I.sim.release(); for (let i = 0; i < 30; i++) step();
    const surfaced = w.knocks - startKnocks;
    __kit.title();
    return { overlapped, after, surfaced };
  });
  check(under.overlapped > 0 && under.after === 0, `under a rock on a Dive: ${under.overlapped} steps inside its outline, ${under.after} knocks`);
  check(under.surfaced === 1, `let go under it: knocked once, thrown clear (${under.surfaced})`);

  // ---- A shut tooth: no way through on the surface. Scrape: one knock, through to the far side. Dive: one line, no knock, and the cache.
  const tooth = await page.evaluate(() => {
    const out = {};
    for (const how of ['scrape', 'dive']) {
      const seeds = [11, 12, 13, 14, 15, 16]; let wins = 0, knocks = 0, lines = 0, salvage = 0, shut = 0;
      TUNE.botShut = how;
      for (const seed of seeds) { const r = __kit.runStage(0, { bot: true, seed, renderEvery: 0 }); if (r.result === 'win') wins++; knocks += r.info.knocks; lines += r.info.lines; salvage += r.salvage; shut += (r.info.causes || []).filter(c => c === 'shut').length; }
      out[how] = { wins, knocks, shut, lines: lines / seeds.length, salvage: salvage / seeds.length };
    }
    TUNE.botShut = 'weigh';
    return out;
  });
  check(tooth.scrape.wins === 6 && tooth.scrape.shut === 6, `scrape a shut tooth on stage 1: ${tooth.scrape.shut} shut knocks in 6 runs, ${tooth.scrape.wins} wins, ${tooth.scrape.lines} lines left, ${tooth.scrape.salvage.toFixed(1)} salvage`);
  check(tooth.dive.wins === 6 && tooth.dive.shut === 0 && tooth.dive.knocks === 0, `Dive it: ${tooth.dive.knocks} knocks in 6 runs, ${tooth.dive.lines} lines left, ${tooth.dive.salvage.toFixed(1)} salvage (a Dive pays)`);
  check(tooth.dive.salvage > tooth.scrape.salvage + 10, 'the Dive earns more than the scrape');
  // A story run comes into stage 4 on 2 planks against its two teeth: with no Tougher Hull, it can't reach the boss without a Dive. A blank book isn't asked to pay: its last tooth stays away.
  const must = await page.evaluate(() => {
    const blank = () => ({ rows: TG.MEMORIES.map(m => ({ lost: m.id })), lost: TG.MEMORIES.map(m => m.id), pagesFound: 0, sparesUsed: 0 });
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8].map(s => s * 101), teeth = o => { let wins = 0, most = 0; for (const seed of seeds) { const r = __kit.runStage(3, Object.assign({ bot: true, seed, renderEvery: 0, fair: true }, o && o())); if (r.result === 'win') wins++; most = Math.max(most, (r.info.causes || []).filter(c => c === 'shut').length); } return { wins, most }; };
    TUNE.botShut = 'scrape'; const never = teeth(() => ({ carry: { hullLost: 1 } }));
    TUNE.botShut = 'weigh'; const weigh = teeth(() => ({ carry: { hullLost: 1 } }));
    // Lay the whole course with nothing found on the way, and count its teeth.
    const count = carry => { __kit.jump(3, { fair: true, carry }); const r = __kit.run(), w = r.w; w.dist = r.stage.length; TG.layAhead(r, w); const n = w.gates.filter(g => g.shut).length; __kit.title(); return n; };
    // What's knocked off stays off, down to 2 planks; the boss starts whole.
    const hullAt = (i, lost) => { __kit.jump(i, { fair: true, carry: { hullLost: lost } }); const h = __kit.run().w.hullLeft; __kit.title(); return h; };
    return { never, weigh, empty: count(blank()), full: count(undefined), hull: [hullAt(1, 0), hullAt(1, 1), hullAt(2, 2), hullAt(4, 2)] };
  });
  check(must.never.wins === 0 && must.never.most === 2, `never Diving on stage 4, coming in on 2 planks: ${must.never.wins} wins of 8, ${must.never.most} shut knocks end it`);
  check(String(must.hull) === '3,2,2,3', `planks at the start of a stage with 0, 1 and 2 lost, and of the boss with 2 lost: ${must.hull}`);
  check(must.weigh.wins === 8, `Diving when it counts on stage 4: ${must.weigh.wins} wins of 8`);
  check(must.full === 2 && must.empty === 1, `stage 4's teeth: ${must.full} with a book, ${must.empty} with a blank one and no page found`);

  // ---- The kit forgetting the thumb isn't letting go: a Dive under a rock carries on through a pause or a catch moment.
  const midRock = async (mop) => {
    await page.evaluate(([mop]) => { __kit.bot(false); __kit.jump(2, { fair: true }); __kit.timeScale = 1; const r = __kit.run(), w = r.w; w.rocks = []; w.gates = []; w.laid.end = 1e9; const rock = TG.makeRock({ side: 'M', x0: w.shipX, w: 120, at: w.dist + 230, len: 150, from: 0, to: 0, drift: 0 }); w.rocks.push(rock); window.__rock = rock; if (mop) w.mop = { x: w.shipX, at: rock.at, rock, said: true }; }, [mop]);
    await page.mouse.move(195, 560); await page.mouse.down();
    await page.waitForFunction(() => { const w = __kit.run().w, k = __rock; return (k.at - k.len / 2) - (w.dist + TUNE.hullHalfLen) < 40; });
    await page.mouse.move(195, 610, { steps: 3 });
  };
  await midRock(false); await wait(500);
  await page.keyboard.press('KeyP'); await wait(200); await page.keyboard.press('KeyP'); await wait(2800);
  s = await page.evaluate(() => ({ k: __kit.run().w.knocks, st: __kit.run().w.dive.state })); await page.mouse.up();
  check(s.k === 0 && s.st === 'up', `pause under a rock with the thumb still on, resume: comes up clear of it, ${s.k} knocks`);
  await midRock(false); await wait(500);
  await page.evaluate(() => Kit.onHidden()); await wait(200); await page.mouse.up(); await page.locator('[data-kit="resume"]').click(); await wait(2800);
  s = await page.evaluate(() => ({ k: __kit.run().w.knocks, st: __kit.run().w.dive.state }));
  check(s.k === 0 && s.st === 'up', `tab hidden under a rock, back again: ${s.k} knocks`);

  // ---- Restart by choice isn't an undo. Dying still puts back what the stage began with, which a Restart has moved on.
  await page.evaluate(() => { __kit.bot(false); __kit.jump(1, { fair: true }); const w = __kit.run().w; w.rocks = []; w.gates = []; w.laid.end = 1e9; w.dropT = 1e9; });
  await pull(); await wait(250); await page.mouse.up(); await wait(300);
  s = await w(); const beforeRestart = s.lines;
  await page.keyboard.press('KeyP'); await wait(100); await page.locator('[data-kit="restart"]').click(); await wait(100);
  s = await w();
  check(s.lines === beforeRestart && s.lines === 5, `Pause then Restart keeps the drowned line (${beforeRestart} to ${s.lines})`);
  await page.evaluate(() => __kit.title());

  // ---- The boss with a thumb already on the glass.
  await page.evaluate(() => { __kit.bot(false); __kit.jump(4, { fair: true }); const b = __kit.run().w.boss; b.state = 'volley'; b.y = TUNE.boss.cutterY; b.move = 99; b.moveT = 0.2; });
  await page.mouse.move(195, 560); await page.mouse.down(); await page.mouse.move(225, 560, { steps: 4 }); await page.waitForFunction(() => __kit.run().w.boss.state === 'open'); await wait(300);
  check((await w()).dive === 'up', 'boss: plates open, a thumb resting costs nothing');
  await page.mouse.move(225, 610, { steps: 3 }); await page.waitForFunction(() => __kit.run().w.dive.state === 'down', null, { timeout: 1500 }).catch(() => {});
  check((await w()).dive === 'down', 'boss: the words on screen work with a thumb already down');
  await page.mouse.up(); await wait(300); await page.evaluate(() => __kit.title());
  await page.evaluate(() => { __kit.jump(0, { fair: true, carry: { rows: TG.MEMORIES.map((m, k) => (k < 2 ? { lost: m.id } : { id: m.id, text: m.text })), lost: ['coat', 'cards'], pagesFound: 0, sparesUsed: 0 } }); __kit.bot(false); __kit.timeScale = 1; __kit.run().w.diveUnlocked = true; });

  // ---- Keys
  await page.keyboard.down('ArrowDown'); await page.waitForFunction(() => __kit.run().w.dive.state === 'down', null, { timeout: 2000 }).catch(() => {});
  check((await w()).dive === 'down', 'the down arrow Dives on a computer'); await page.keyboard.up('ArrowDown'); await wait(350);
  const k0 = (await w()).target; await page.keyboard.down('ArrowRight'); await wait(200); await page.keyboard.up('ArrowRight');
  check((await w()).target > k0 + 10, 'arrow keys steer');
  const keySound = await page.evaluate(async () => { const said = []; const p = Kit.audio.play; Kit.audio.play = n => { said.push(n); return p(n); }; window.__said = said; window.__p = p; return 1; });
  await wait(600); await page.keyboard.down('ArrowLeft'); await wait(300); await page.keyboard.up('ArrowLeft');
  check(await page.evaluate(() => { Kit.audio.play = __p; return __said.includes('steer'); }), `keyboard steering makes the steer sound (${keySound})`);

  // ---- What a run has cost stays. Win, Next stage: carried. Lose, retry: back to where the stage began. Menu, reload: carried. Stage 1: clean.
  const lostNow = (await w()).lost.length;
  await page.evaluate(() => __kit.run().win(0));
  await page.waitForFunction(() => __kit.state().screen === 'result'); await wait(520);
  await page.locator('[data-kit="primary"]').click(); await wait(100);
  await skipTalk();
  s = await w();
  check(s.lost.length === lostNow, `Next stage carries the losses (${s.lost})`);
  await page.evaluate(() => TG.drown(__kit.run()));
  check((await w()).lost.length === lostNow + 1, 'a Dive on stage 2 adds to them');
  await page.evaluate(() => __kit.run().lose(0));
  await page.waitForFunction(() => __kit.state().screen === 'result'); await wait(520);
  await page.locator('[data-kit="primary"]').click(); await wait(100);
  check((await w()).lost.length === lostNow, 'dying puts back what the stage began with');
  await page.evaluate(() => __kit.run().win(0));
  await page.waitForFunction(() => __kit.state().screen === 'result'); await wait(520);
  await page.locator('[data-kit="menu"]').click(); await wait(100);
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
  await page.locator('[data-kit="story"]').click(); await page.locator('[data-stage="2"]').click(); await wait(100);
  await skipTalk();
  s = await w();
  check(s.lost.length === lostNow, `after a reload, picking stage 3 from the list carries the same losses (${s.lost})`);
  await page.evaluate(() => __kit.title());
  await page.locator('[data-kit="story"]').click(); await page.locator('[data-stage="0"]').click(); await wait(100);
  await skipTalk();
  check((await w()).lost.length === 0, 'picking stage 1 starts a clean book');
  await page.evaluate(() => __kit.title());

  // ---- Her words change when "pup" has gone.
  const talk = await page.evaluate(() => { const lost = TG.MEMORIES.slice(0, 5).map(m => m.id); const carry = { rows: TG.MEMORIES.map((m, k) => (k < 5 ? { lost: m.id } : { id: m.id, text: m.text })), lost, pagesFound: 0, sparesUsed: 0 }; __kit.jump(3, { carry, fair: true }); const t = Kit.def.stages[3].talk.map(l => l.text).join(' | '); __kit.title(); return t; });
  check(!/\bpup\b/.test(talk) && /called me Kaito/.test(talk), 'with that line gone, the talk scene drops "pup" and Kaito notices: ' + talk.slice(0, 120) + '...');

  // ---- Upgrades do what they say, a spare copy burns before a real line and stays burned across stages.
  const TUNE_AIR = await page.evaluate(() => TUNE.diveSecs);
  const up = await page.evaluate(() => {
    DriftSave.finishRun('moments', 0, 2000);
    ['hull', 'dive', 'spare'].forEach(id => { for (let i = 0; i < 2; i++) DriftSave.buyUpgrade('tide-gap', id, 1, 3); });
    __kit.jump(0, { fair: false });
    let r = __kit.run();
    const a = { hull: r.w.hullMax, air: r.w.airMax, spare: TG.spareLeft(r) };
    TG.drown(r); const b = { spare: TG.spareLeft(r), lines: TG.linesLeft(r) };
    const carry = JSON.parse(JSON.stringify(r.carry));
    __kit.jump(1, { fair: false, carry, continued: true }); r = __kit.run();
    const c = { spare: TG.spareLeft(r) };
    __kit.jump(0, { fair: true }); r = __kit.run();
    const d = { hull: r.w.hullMax, air: r.w.airMax, spare: TG.spareLeft(r) };
    __kit.title();
    return { a, b, c, d };
  });
  check(up.a.hull === 5 && Math.abs(up.a.air - (TUNE_AIR + 0.8)) < 0.01 && up.a.spare === 2, `level 2 upgrades: hull ${up.a.hull}, air ${up.a.air}, spares ${up.a.spare}`);
  check(up.b.spare === 1 && up.b.lines === 6, `a spare copy pays first (spares ${up.b.spare}, lines ${up.b.lines})`);
  check(up.c.spare === 1, `the burned copy stays burned on the next stage (spares ${up.c.spare})`);
  check(up.d.hull === 3 && up.d.air === TUNE_AIR && up.d.spare === 0, 'the No-upgrades switch gives the base numbers');

  // ---- An empty book: no arrows, no Dive, and the boss still can't be a dead end.
  const empty = await page.evaluate(() => {
    const carry = () => ({ rows: TG.MEMORIES.map(m => ({ lost: m.id })), lost: TG.MEMORIES.map(m => m.id), pagesFound: 0, sparesUsed: 0 });
    __kit.jump(1, { carry: carry(), fair: true }); const r = __kit.run(), sense = TG.senseNow(r), can = TG.canDive(r), st = TG.selaState(r); __kit.title();
    const list = []; for (let s = 1; s <= 10; s++) { const x = __kit.runStage(4, { bot: true, seed: s * 977, carry: carry(), renderEvery: 0 }); list.push(x.result); }
    return { reach: sense.reach, can, st, boss: list.filter(x => x === 'win').length };
  });
  check(empty.reach === 0 && !empty.can && empty.st === 'empty', `no lines: arrows gone (reach ${empty.reach}), Dives stop (${empty.can}), Sela lets the book hang (${empty.st})`);
  check(empty.boss === 10, `an empty book at the boss: loose pages keep it winnable, bot ${empty.boss}/10`);

  // ---- The boss's Dives cost lines that stay gone, unless the book would otherwise be empty.
  const bossBook = await page.evaluate(() => { const list = []; for (let s = 1; s <= 8; s++) { const x = __kit.runStage(4, { bot: true, seed: s * 41, renderEvery: 0 }); list.push(x.info.lines); } return list; });
  check(bossBook.every(n => n === 3), `a full book comes out of the boss with three lines: ${bossBook.join(',')}`);

  // ---- Sense weakens with every line.
  const reach = await page.evaluate(() => TUNE.sense.map(s => s.reach));
  check(reach.every((v, i) => !i || v > reach[i - 1]), 'every lost line shortens the warning: ' + reach.join(' < '));

  // ---- The ending is written from what's left.
  const end = await page.evaluate(() => {
    const rows = n => TG.MEMORIES.map((m, k) => (k < 6 - n ? { lost: m.id } : { id: m.id, text: m.text }));
    const of = n => TG.buildEnding(TG.MEMORIES.slice(0, 6 - n).map(m => m.id), rows(n));
    const txt = e => e.talk.map(l => l.text).join(' ');
    return { three: txt(of(3)), one: txt(of(1)), none: txt(of(0)), card1: of(1).card.text, lens: [3, 2, 1, 0].map(n => of(n).talk.length) };
  });
  check(/First thing I'd save/.test(end.three) && !/What do you call me/.test(end.three), 'pup kept: she still calls him pup');
  check(/What do you call me/.test(end.one) && /writing that down/.test(end.one) && !/What does he want/.test(end.one), 'pup lost, song kept: Kaito has to tell her');
  check(/What does he want/.test(end.none) && !/Is he mine|Kaito, is it|isn't it\?/.test(end.none), "nothing left: she's lost what the book says she lost, and still knows Kaito's name and Vesh's");
  check((end.none.match(/blue smear/g) || []).length === 1, 'the smear line is not said twice');
  console.log('     ending lengths for 3, 2, 1, 0 lines: ' + end.lens.join(', '));
  console.log('     card with one line left: ' + end.card1);

  // ---- Pals: real conditions, forced chance.
  const pals = await page.evaluate(() => {
    const out = {};
    TUNE.palBot = 'bobbin'; out.bobbin = 0; for (let s = 1; s <= 8; s++) if (__kit.runStage(1, { bot: true, seed: s * 11, renderEvery: 0 }).caught.includes('bobbin')) out.bobbin++;
    TUNE.palBot = 'mopclaw'; out.mop = 0; out.dives = 0; for (let s = 1; s <= 8; s++) { const r = __kit.runStage(2, { bot: true, seed: s * 13, renderEvery: 0 }); if (r.caught.includes('mopclaw')) out.mop++; out.dives += r.info.dives; }
    TUNE.palBot = false;
    return out;
  });
  check(pals.bobbin === 8, `Bobbin, chance forced, stay alongside: ${pals.bobbin}/8`);
  check(pals.mop === 8 && pals.dives >= 8, `Mopclaw, chance forced, only by a Dive: ${pals.mop}/8, ${pals.dives} Dives`);
  const noDive = await page.evaluate(() => { TUNE.palBot = false; const w = []; for (let s = 1; s <= 10; s++) w.push(__kit.runStage(3, { bot: true, seed: s * 17, renderEvery: 0 })); return w.filter(r => r.caught.includes('mopclaw')).length; });
  check(noDive === 0, `no Dive, no Mopclaw (${noDive} caught in 10 runs without Dives)`);

  // Last, because this one really catches Mopclaw into the save.
  await midRock(true); await page.waitForFunction(() => __kit.state().screen === 'catch', null, { timeout: 8000 }); await page.mouse.up(); await wait(600);
  await page.locator('[data-kit="catch-ok"]').click(); await wait(2800);
  s = await page.evaluate(() => ({ k: __kit.run().w.knocks, st: __kit.run().w.dive.state }));
  check(s.k === 0 && s.st === 'up', `catch Mopclaw under the rock: comes up clear of it, ${s.k} knocks`);

  check(errs.length === 0, 'no page errors ' + errs.slice(0, 3).join('; '));
  await browser.close(); server.close();
  console.log(fails ? `FAILED ${fails}` : 'PASSED');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
