// What a new attempt does and doesn't hand back, through real taps and real screens: node games/split-light/test/review-retry.js
// Undo and Scrape are per level, not per attempt. Spent shots stay spent, down to what the board needs. Growths you could use break off, so failing can't shorten a board.
const { start, check, finish, HELP } = require('./harness');
const os = require('os'), path = require('path'), fs = require('fs');
const SHOTS = path.join(os.tmpdir(), 'kcheck', 'split-light', 'retry');
fs.mkdirSync(SHOTS, { recursive: true });

(async () => {
  const h = await start();
  const { ctx, page } = await h.open('phone');
  await page.evaluate(HELP);
  const buy = list => page.evaluate(list => { DriftSave.finishRun('smoke-bank', 0, 3000); list.forEach(u => DriftSave.buyUpgrade('split-light', u, 20, 3)); }, list);

  // ---- Steady Hand 1: fire, undo, retry, over and over. The review got this loop for free on level 8.
  await buy(['steady']);
  const loop = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(7, { fair: false, seed: 3 });
    const r = __kit.run(), w = r.w, log = [];
    for (let i = 0; i < 6 && !r.over; i++) {
      __tapB(r, 'fire'); __land(r);
      const undoOn = SL.buttons(r).find(b => b.id === 'undo').on;
      if (undoOn) __tapB(r, 'undo');
      __tapB(r, 'retry');
      log.push({ undoOn, undos: w.undos, fired: w.fired, shots: w.S.shots, g: w.S.g.slice() });
    }
    __solve(r);
    return { log, over: r.over, salvage: r.salvage, score: r.score, used: w.fired + w.boardFired };
  });
  loop.log.forEach((l, i) => console.log(`     cycle ${i + 1}: ${JSON.stringify(l)}`));
  console.log('     then clear: ' + JSON.stringify({ over: loop.over, salvage: loop.salvage, score: loop.score, used: loop.used }));
  check(loop.log[0].undoOn && loop.log[0].undos === 0 && loop.log[0].fired === 0, 'the one undo works, takes the shot back, and Retry does not hand it back');
  check(loop.log.slice(1).every(l => !l.undoOn && l.undos === 0), 'every later cycle: Undo stays off');
  check(loop.log.every((l, i) => l.fired === i), `every later shot stays in the count (${loop.log.map(l => l.fired)})`);
  check(loop.over === 'win' && loop.salvage < 10 && loop.score < 770, `a clear after that pays ${loop.salvage} and scores ${loop.score}, under the clean 10 and 770`);

  // ---- Shard Scraper 1: scrape, retry, scrape. The review cleared a whole board this way.
  await buy(['scraper']);
  const scrape = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(7, { fair: false, seed: 3 });
    const r = __kit.run(), w = r.w;
    if (w.undoTotal) w.aids.undo = w.undoTotal, w.undos = 0;
    __tapB(r, 'fire'); __land(r); __tapB(r, 'fire'); __land(r);
    const grown = w.S.g.slice();
    __tapB(r, 'scrape'); __tapC(r, grown[0]);
    const once = { g: w.S.g.slice(), scrapes: w.scrapes };
    __tapB(r, 'retry');
    const after = { g: w.S.g.slice(), scrapes: w.scrapes, on: SL.buttons(r).find(b => b.id === 'scrape').on };
    __tapB(r, 'scrape');
    if (after.g.length) __tapC(r, after.g[0]);
    return { grown, once, after, end: { g: w.S.g.slice(), scrapes: w.scrapes } };
  });
  console.log('     scraper: ' + JSON.stringify(scrape));
  check(scrape.once.scrapes === 0 && scrape.once.g.length === scrape.grown.length - 1, 'the one scrape takes one growth');
  check(scrape.after.scrapes === 0 && !scrape.after.on, 'Retry does not hand the scrape back, and the button is off');
  check(scrape.end.g.join() === scrape.after.g.join(), `no second growth comes off (${scrape.after.g} then ${scrape.end.g})`);

  // ---- Spent shots stay spent, and never fewer than the board needs.
  const ladder = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(15, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w, log = [{ shots: w.S.shots, fired: w.fired }];
    for (let i = 0; i < 4 && !r.over; i++) {
      __tapB(r, 'fire'); __land(r);
      if (r.over) break;
      __tapB(r, 'retry');
      const need = SL.solve(w.L, Object.assign({}, w.S, { shots: w.L.shots }));
      log.push({ shots: w.S.shots, fired: w.fired, g: w.S.g.slice(), need: need && need.shots });
    }
    const before = JSON.stringify({ s: w.S.shots, g: w.S.g, f: w.fired });
    __tapB(r, 'retry');
    return { log, par: w.L.par, full: w.L.shots, idle: before === JSON.stringify({ s: w.S.shots, g: w.S.g, f: w.fired }) };
  });
  ladder.log.forEach(l => console.log('     level 16: ' + JSON.stringify(l)));
  check(ladder.log.slice(1).every(l => l.shots === Math.max(ladder.full - l.fired, l.need)), 'each new attempt gets the shots not yet spent, or what the board needs if that is more');
  check(ladder.log.slice(1).every(l => l.need >= ladder.par), `no board along the way can be cleared under par ${ladder.par}`);
  check(ladder.idle, 'Retry with no shot fired changes nothing');

  // ---- The review's replay on level 7: three wasted shots, then Retry.
  const stones = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(6, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w;
    for (let i = 0; i < 3 && !r.over; i++) { __tapB(r, 'fire'); __land(r); }
    const had = w.S.g.slice();
    __tapB(r, 'retry');
    const after = { had, g: w.S.g.slice(), shots: w.S.shots, fired: w.fired, minShotsNow: SL.solve(w.L, Object.assign({}, w.S, { shots: w.L.shots })).shots };
    __solve(r);
    return { after, par: w.L.par, salvage: r.salvage, over: r.over };
  });
  console.log('     level 7: ' + JSON.stringify(stones));
  check(stones.after.minShotsNow >= stones.par, `three wasted shots don't shorten the board: fewest now ${stones.after.minShotsNow}, par ${stones.par}`);
  check(stones.after.shots === stones.after.minShotsNow, `no spare shots left after spending them: ${stones.after.shots}`);

  // A real plant, then Retry: the stone is gone. Plant, then use it in the same attempt: it still works, and that's par.
  const plant = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(6, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w, plan = SL.solve(w.L, w.S).plan;
    __shot(r, plan[0]);
    const planted = w.S.g.slice(), min1 = SL.solve(w.L, w.S).shots;
    __tapB(r, 'retry');
    const after = { g: w.S.g.slice(), min: SL.solve(w.L, Object.assign({}, w.S, { shots: w.L.shots })).shots };
    SL.forgetShots();
    __kit.jump(6, { fair: true, seed: 3 });
    const r2 = __kit.run();
    __solve(r2);
    return { planted, min1, after, par: w.L.par, clean: { over: r2.over, salvage: r2.salvage, used: r2.w.fired + r2.w.boardFired } };
  });
  console.log('     level 7 plant: ' + JSON.stringify(plant));
  check(plant.min1 < plant.par && !plant.after.g.some(i => plant.planted.includes(i)) && plant.after.min === plant.par, 'a stepping stone helps in its own attempt, and breaks off on Retry');
  check(plant.clean.over === 'win' && plant.clean.used === plant.par && plant.clean.salvage === 10, 'planting within one attempt still clears at par for full pay');

  // ---- The boss keeps its own rules: full shots, Undo and Scrape per board, and Reset costs nerve.
  const boss = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(16, { fair: false, seed: 3 });
    const r = __kit.run(), w = r.w;
    __tapB(r, 'fire'); __land(r);
    __tapB(r, 'undo');
    const usedUp = w.undos;
    __tapB(r, 'fire'); __land(r);
    __tapB(r, 'retry'); __tapB(r, 'retry');
    let g = 0; while (w.gap > 0 && g++ < 400) __step(r);
    return { usedUp, undos: w.undos, undoTotal: w.undoTotal, nerve: w.boss.nerve, shots: w.S.shots, full: w.L.shots };
  });
  console.log('     boss: ' + JSON.stringify(boss));
  check(boss.usedUp === boss.undoTotal - 1 && boss.undos === boss.undoTotal && boss.nerve === 2 && boss.shots === boss.full, 'a boss Reset costs a point of nerve, then gives full shots and the board\'s undo');

  // ---- Real screens, saved: a reload, Restart, Menu and a loss don't hand back undos, scrapes or shots. A win does, for the replay.
  await page.evaluate(() => { SL.forgetShots(); DriftSave.setStoryCarry('split-light', null); __kit.title(); });
  const enter = async () => { await page.locator('[data-kit="story"]').click(); await page.locator('[data-stage="0"]').click(); await page.locator('[data-kit="skip"]').click(); };
  await enter();
  const used = await page.evaluate(() => {
    const r = __kit.run(), w = r.w, start = { undos: w.undos, scrapes: w.scrapes, shots: w.S.shots };
    __tapB(r, 'fire'); __land(r); __tapB(r, 'undo');
    __tapB(r, 'fire'); __land(r);
    __tapB(r, 'scrape'); __tapC(r, w.S.g[0]);
    return { start, undos: w.undos, scrapes: w.scrapes, shots: w.S.shots, boardFired: w.boardFired, book: DriftSave.getSetting('split-light-unfinished', {}) };
  });
  console.log('     level 1 used: ' + JSON.stringify(used));
  check(used.undos === used.start.undos - 1 && used.scrapes === used.start.scrapes - 1 && used.book.aids[0].undo === 1 && used.book.aids[0].scrape === 1, 'one undo and one scrape used, and the save knows');
  const read = () => page.evaluate(() => { const w = __kit.run().w; return { undos: w.undos, scrapes: w.scrapes, shots: w.S.shots, fired: w.fired }; });
  const wantShots = 3 - 1, same = (s, what) => check(s.undos === used.undos && s.scrapes === used.scrapes && s.shots === wantShots && s.fired === 1, `${what}: nothing handed back (${JSON.stringify(s)})`);
  await page.locator('[data-kit="pause"]').click();
  await page.locator('[data-kit="restart"]').click();
  same(await read(), 'Pause, Restart');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(SHOTS, 'after-restart.png') });
  await page.locator('[data-kit="pause"]').click();
  await page.locator('[data-kit="quit"]').click();
  await enter();
  same(await read(), 'Menu and back');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  if (await page.locator('#drift-gate .yes').count()) await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title', null, { timeout: 8000 });
  await page.evaluate(HELP);
  await enter();
  same(await read(), 'a reload');
  await page.evaluate(() => { const r = __kit.run(); __tapB(r, 'fire'); __land(r); });
  await page.evaluate(() => { const r = __kit.run(); __tapB(r, 'retry'); });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(SHOTS, 'after-retry.png') });
  const retried = await read();
  console.log('     after a real Retry: ' + JSON.stringify(retried));
  check(retried.undos === used.undos && retried.scrapes === used.scrapes && retried.fired === 2 && retried.shots === 1, 'a real Retry: one shot left of three, nothing handed back');
  await page.evaluate(() => { const r = __kit.run(); __solve(r); });
  await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 5000 });
  const cleared = await page.evaluate(() => { const b = DriftSave.getSetting('split-light-unfinished', {}); __kit.title(); return b; });
  check(!cleared.aids[0] && !cleared.spent[0] && !cleared.scars[0], `a win clears it all: ${JSON.stringify(cleared)}`);
  await enter();
  const replay = await read();
  check(replay.undos === used.start.undos && replay.scrapes === used.start.scrapes && replay.shots === 3, `the replay starts with them back: ${JSON.stringify(replay)}`);

  // An old save with no record of these yet still loads.
  const old = await page.evaluate(() => { DriftSave.setSetting('split-light-unfinished', { spent: { 7: 1 }, scars: { 7: [] } }); __kit.jump(0, { fair: false, seed: 3 }); __kit.title(); return SL.aidsLogged({ index: 7 }); });
  check(old.undo === 0 && old.scrape === 0, `a save from before this rule loads: ${JSON.stringify(old)}`);

  await ctx.close();
  await h.close();
  finish('what a new attempt hands back', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
