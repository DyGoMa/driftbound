// Vasch's boards, measured through real taps: node games/split-light/test/review-boss.js
// Scrape and Undo, the crush, Reset's second tap, his count (and Undo resetting it), his corrected line.
const { start, check, finish, HELP } = require('./harness');

(async () => {
  const h = await start();
  const { page, ctx } = await h.open('phone');
  await page.evaluate(HELP);
  await page.evaluate(() => { const d = DriftSave; d.finishRun('smoke-bank', 0, 3000); ['steady', 'scraper'].forEach(u => d.buyUpgrade('split-light', u, 20, 3)); });
  const scrape = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(0, { fair: false, seed: 1 });
    const r = __kit.run(), w = r.w, on = id => SL.buttons(r).find(x => x.id === id).on;
    for (let i = 0; i < 3; i++) { __tapB(r, 'fire'); __land(r); }
    const empty = { shots: w.S.shots, dead: w.dead, undos: w.undos, hist: w.history.length, scrapeOn: on('scrape'), undoOn: on('undo'), over: r.over };
    __tapB(r, 'undo');
    const undone = { shots: w.S.shots, dead: w.dead, undos: w.undos, over: r.over };
    return { empty, undone };
  });
  console.log('     level 1, out of shots with an Undo left: ' + JSON.stringify(scrape));
  check(scrape.empty.dead && !scrape.empty.over && scrape.empty.undoOn && !scrape.empty.scrapeOn, 'out of shots: Undo is offered, Scrape is off, because a growth gone is no use with no shots');
  check(scrape.undone.shots === 1 && !scrape.undone.over, 'Undo gets the shot back');
  const scrapeBoss = await page.evaluate(() => {
    __kit.jump(16, { fair: false, seed: 1 });
    const r = __kit.run(), w = r.w;
    w.boss.opened = true;
    let line = null;
    const search = (S, path) => { if (line || S.shots <= 1) return; for (const oc of SL.outcomes(w.L, S)) { const N = SL.after(w.L, S, oc.res); if (!SL.alive(N)) continue; const p = path.concat([oc]); if (!SL.solve(w.L, N) && N.g.length) { line = p; return; } search(N, p); } };
    search(w.S, []);
    if (!line) return { none: true };
    line.forEach(oc => __shot(r, oc));
    const dead = { shots: w.S.shots, dead: w.dead, g: w.S.g.slice(), undos: w.undos, hist: w.history.length };
    __tapB(r, 'scrape');
    const P = SL.cellXY(r, dead.g[0] % w.L.cols, Math.floor(dead.g[0] / w.L.cols));
    Kit.input.sim.tap(P.x, P.y); __step(r, 2);
    const after = { g: w.S.g.slice(), dead: w.dead, undos: w.undos, hist: w.history.length, undoOn: SL.buttons(r).find(x => x.id === 'undo').on };
    __tapB(r, 'undo');
    const back = { shots: w.S.shots, g: w.S.g.slice(), dead: w.dead, stillGone: !w.S.g.includes(dead.g[0]) };
    return { dead, after, back };
  });
  console.log('     boss 1, dead board, Scrape then Undo: ' + JSON.stringify(scrapeBoss));
  check(!scrapeBoss.none && scrapeBoss.after.undoOn && scrapeBoss.after.hist === scrapeBoss.dead.hist, 'on a dead boss board, Scrape leaves the Undo working');
  check(scrapeBoss.back.stillGone, 'and the scraped growth stays gone through the Undo');

  const undo = await page.evaluate(() => {
    __kit.jump(16, { fair: false, seed: 3 });
    const r = __kit.run(), w = r.w, b = w.boss;
    b.opened = true; b.phase = 2; SL.loadBoard(r, SL.BOSS[2]);
    const st = SL.solve(w.L, w.S).plan[0], c0 = { chamber: b.chamber, score: w.held, hp: w.S.hp.slice(), sealed: w.S.sealed };
    let g = 0; while (w.S.tick !== st.tick && g++ < 2000) __step(r);
    __shot(r, st);
    const hit = { chamber: b.chamber, score: w.held, hp: w.S.hp.slice(), sealed: w.S.sealed, ring: !!w.corrected };
    __tapB(r, 'undo');
    const back = { chamber: b.chamber, score: w.held, hp: w.S.hp.slice(), sealed: w.S.sealed, ring: !!w.corrected };
    return { c0, hit, back };
  });
  console.log('     boss 3, hit then Undo: ' + JSON.stringify(undo));
  check(undo.hit.chamber < 1 && undo.back.chamber === undo.c0.chamber && undo.back.score === undo.c0.score, 'Undo takes back the crack in his arm and the points');

  // ---- His count. It fires for you; firing resets it; Undo resets it too, so he can't fire the same shot straight back.
  const count = await page.evaluate(() => {
    __kit.jump(16, { fair: false, seed: 4 });
    const r = __kit.run(), w = r.w;
    w.boss.opened = true;
    const secs = (n, stop) => { let g = 0; while (g++ < n * 60 && !stop()) __step(r); return g / 60; };
    const first = secs(60, () => w.boardFired > 0);   // nobody playing: how long until he fires?
    __land(r);
    const left = w.S.shots;
    const second = secs(60, () => w.S.shots < left || w.beam);
    __land(r);
    // Two untouched shots can leave the board dead, where his count ends in a reset instead. So: one shot on the plan, then most of his count, then Undo.
    __kit.jump(16, { fair: false, seed: 4 });
    const r2 = __kit.run(), w2 = r2.w, secs2 = n => { let g = 0; while (g++ < n * 60) __step(r2); };
    w2.boss.opened = true;
    __shot(r2, SL.solve(w2.L, w2.S).plan[0]);
    secs2(TUNE.bossCount * 0.9);
    const before = SL.countOf(w2), firedBefore = w2.boardFired;
    __tapB(r2, 'undo');
    const after = SL.countOf(w2), firedAfter = w2.boardFired;
    secs2(TUNE.bossCount * 0.3);
    return { first: +first.toFixed(1), second: +second.toFixed(1), before: +before.toFixed(2), after: +after.toFixed(2), firedBefore, firedAfter, firedLater: w2.boardFired, undos: w2.undos };
  });
  console.log('     his count: ' + JSON.stringify(count));
  check(count.first > 44 && count.first < 46, `nobody playing: he fires for you at ${count.first} s (his count plus the time to read the board)`);
  check(count.second > 29 && count.second < 31, `and after that every ${count.second} s`);
  check(count.before > 8 && count.after < 1, `Undo starts his count again: ${count.before} back to ${count.after}`);
  check(count.firedLater === count.firedAfter, `so he doesn't fire the same shot straight back (${count.firedAfter} shots, ${count.firedLater} after waiting)`);
  for (const seed of [1, 2, 3, 9]) {
    const idle = await page.evaluate(s => { const o = __kit.runStage(16, { bot: false, seed: s, maxSeconds: 900, renderEvery: 0 }); return { result: o.result, seconds: o.seconds, score: o.score }; }, seed);
    check(idle.result === 'lose', `the boss with nobody playing is lost, seed ${seed}: ${JSON.stringify(idle)}`);
  }

  const crush = await page.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w;
    w.boss.opened = true;
    let said = []; const keep = r.say; r.say = (who, text) => { said.push(text); keep(who, text, 4); };
    // A line of shots on board 1 that ends with a growth under a rail core as it arrives.
    let line = null;
    const seek = (S, path) => {
      if (line || S.shots <= 0) return;
      for (const oc of SL.outcomes(w.L, S)) {
        const N = SL.after(w.L, S, oc.res);
        if (!SL.alive(N)) continue;
        const p = path.concat([oc]);
        if (S.g.concat(oc.res.growth).some(i => !N.g.includes(i))) { line = p; return; }
        seek(N, p);
      }
    };
    seek(w.S, []);
    if (!line) return { none: true };
    const steps = line.map(oc => { const had = w.S.g.concat(oc.res.growth); __shot(r, oc); return { had, after: w.S.g.slice() }; });
    return { steps, said, seen: !!w.seen.crush };
  });
  console.log('     boss 1, a growth crushed: ' + JSON.stringify(crush));
  check(crush.seen && crush.said.some(t => /crushed/.test(t)), 'a crushed growth has its line, and the burst and the sound go with it');

  // A real touch near the top of Reset, right after a shot that leaves a way through.
  await page.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 2 });
    const r = __kit.run(), w = r.w; w.boss.opened = true;
    __shot(r, SL.outcomes(w.L, w.S).find(o => { const N = SL.after(w.L, w.S, o.res); return SL.alive(N) && SL.solve(w.L, N); }));
  });
  await page.waitForTimeout(150);
  const at = await page.evaluate(() => {
    const r = __kit.run(), s = Kit.view.scale, c = Kit.canvas.getBoundingClientRect(), b = SL.buttons(r).find(x => x.id === 'retry');
    return { x: c.left + (b.x + b.w / 2 - Kit.view.left) * s, y: c.top + (b.y + 4 - Kit.view.top) * s, nerve: r.w.boss.nerve };
  });
  await page.touchscreen.tap(at.x, at.y);
  await page.waitForTimeout(150);
  const one = await page.evaluate(() => { const w = __kit.run().w; return { nerve: w.boss.nerve, arm: w.resetArm, label: SL.buttons(__kit.run()).find(x => x.id === 'retry').label }; });
  await page.waitForTimeout(2800);
  const later = await page.evaluate(() => { const w = __kit.run().w; return { nerve: w.boss.nerve, arm: w.resetArm }; });
  await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(120); await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(150);
  const two = await page.evaluate(() => __kit.run().w.boss.nerve);
  console.log(`     a slip onto Reset: nerve ${at.nerve}, after one touch ${JSON.stringify(one)}, 2.8 s later ${JSON.stringify(later)}, after two touches ${two}`);
  check(one.nerve === at.nerve && one.arm > 0, 'one touch on Reset costs nothing and asks again');
  check(later.nerve === at.nerve && later.arm === 0, 'the question goes away by itself');
  check(two === at.nerve - 1, 'two touches do reset, for a point of nerve');

  const deadTap = await page.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 2 });
    const r = __kit.run(), w = r.w; w.boss.opened = true;
    __deadLine(w.L, w.S).forEach(oc => __shot(r, oc));
    const n = w.boss.nerve, dead = w.dead;
    __tapB(r, 'retry');
    return { dead, cost: n - w.boss.nerve };
  });
  check(deadTap.dead && deadTap.cost === 1, 'on a dead board with nothing else to try, one tap resets');

  const bossScore = await page.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 2 });
    const r = __kit.run(), w = r.w; w.boss.opened = true;
    const hit = SL.outcomes(w.L, w.S).find(o => o.res.hits.length);
    __shot(r, hit);
    const shot = w.held, banked = r.score;
    __tapB(r, 'retry'); __tapB(r, 'retry');
    let g = 0; while (w.gap > 0 && g++ < 300) __step(r);
    return { shot, banked, after: w.held, g: w.S.g.length, shots: w.S.shots };
  });
  check(bossScore.shot > 0 && bossScore.after === 0 && bossScore.banked === 0, `a failed boss board scores nothing (${bossScore.shot} back to ${bossScore.after}, ${bossScore.banked} banked)`);

  // His corrected line gets read: the order lines come in during a bot boss run, with the time of each.
  const said = await page.evaluate(async () => {
    const out = [], keep = Kit.ui.say;
    Kit.timeScale = 1;
    __kit.jump(16, { fair: true, seed: 5 });
    const r = __kit.run();
    r.w.boss.phase = 2; r.w.boss.opened = true; SL.loadBoard(r, SL.BOSS[2]);
    Kit.ui.say = function (who, text, secs, at) { out.push({ t: +r.time.toFixed(2), text }); return keep.call(Kit.ui, who, text, secs, at); };
    __kit.bot(true); Kit.timeScale = 6;
    for (let i = 0; i < 300 && !r.over; i++) await new Promise(res => setTimeout(res, 50));
    __kit.bot(false); Kit.timeScale = 1; Kit.ui.say = keep;
    return { out, over: r.over };
  });
  said.out.forEach(l => console.log(`       ${l.t}: ${l.text}`));
  const C = /corrected one of yours|was wrong|Marked/, H = /my arm|Eleven years|taught you/;
  const firstC = said.out.findIndex(l => C.test(l.text));
  check(firstC >= 0 && said.out[firstC + 1] && H.test(said.out[firstC + 1].text) && said.out[firstC + 1].t - said.out[firstC].t > 2, 'on a hit, his corrected line shows first, and the hit line waits its turn');
  await ctx.close();

  await h.close();
  finish('review of the boss', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
