// What a stage costs, measured through real taps and real screens: node games/split-light/test/review-checks.js
// Every shot counts and growths in the way stay, through Retry, a loss, Restart, Menu and a reload. Pay and score, replays, New best, boss score, win lines.
// Vasch's board rules are in review-boss.js, pictures and layout in review-shots.js.
const { start, check, finish, HELP } = require('./harness');

(async () => {
  const h = await start();
  const first = await h.open('phone'), ctx = first.ctx;
  const page = first.page;
  await page.evaluate(HELP);

  // ---- Retry. Board 8: two wasted shots, Retry, then the fewest shots from what's left.
  const retry = await page.evaluate(() => {
    SL.forgetShots();
    __kit.jump(7, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w;
    __tapB(r, 'fire'); __land(r);
    const first = { shots: w.S.shots, g: w.S.g.slice(), boardFired: w.boardFired };
    __tapB(r, 'fire'); __land(r);
    const had = w.S.g.slice();
    __tapB(r, 'retry');
    const after = { shots: w.S.shots, g: w.S.g.slice(), boardFired: w.boardFired, fired: w.fired, arm: SL.armState(r).spent, way: !!SL.solve(w.L, w.S), held: w.held };
    __solve(r);
    SL.forgetShots();
    return { first, had, after, full: w.L.shots, salvage: r.salvage, score: r.score, used: w.fired + w.boardFired, par: w.L.par, over: r.over, spent: r.carry.spent, line: r.stage.winLine.text };
  });
  console.log('     level 8 after a wasted attempt: ' + JSON.stringify(retry));
  check(retry.after.shots === retry.full - 2 && retry.after.arm === 2 && retry.after.held === 0, `Retry gives back only the shots not spent (${retry.after.shots} of ${retry.full}) and scores nothing, and the arm keeps its 2 shots (${retry.after.arm})`);
  check(retry.after.way && retry.after.g.every(i => retry.had.includes(i)), `the growths in the way stay on the board: had ${retry.had}, kept ${retry.after.g}`);
  const overBy = retry.used - retry.par, wantPay = Math.max(1, 10 - 4 * overBy);
  check(retry.salvage === wantPay && retry.spent === retry.used, `${overBy} shots over par pays ${retry.salvage} of 10, the arm counts ${retry.spent}`);
  check(/Not pretty/.test(retry.line), `a clear over par doesn't get told it was clean: "${retry.line}"`);
  const clean = await page.evaluate(() => { SL.forgetShots(); __kit.jump(7, { fair: true, seed: 3 }); const r = __kit.run(); __solve(r); SL.forgetShots(); return { salvage: r.salvage, score: r.score, line: r.stage.winLine.text }; });
  console.log('     level 8 clean at par: ' + JSON.stringify(clean));
  check(clean.salvage === 10 && clean.score > retry.score, `a clean par pays ${clean.salvage} and scores ${clean.score}, the wasted attempt ${retry.salvage} and ${retry.score}`);
  check(/^Clean\./.test(clean.line), `a clean clear still gets its own line: "${clean.line}"`);

  // ---- A lost attempt, then Try again, Pause and Restart, Menu, and a reload: none wipes shots or growths, and none sets a best.
  await page.evaluate(() => { SL.forgetShots(); DriftSave.setStoryCarry('split-light', null); __kit.title(); });
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="0"]').click();
  await page.locator('[data-kit="skip"]').click();
  const lastG = await page.evaluate(() => { const r = __kit.run(); for (let i = 0; i < 3; i++) { __tapB(r, 'fire'); __land(r); } return r.w.S.g.slice(); });
  await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 5000 });
  await page.waitForTimeout(900);
  const down = await page.evaluate(() => ({ text: document.querySelector('.kit-screen').innerText.replace(/\s+/g, ' '), newBest: !!document.querySelector('.kit-new'), best: DriftSave.game('split-light').best, fair: DriftSave.game('split-light').fairBest }));
  console.log('     level 1 lost: ' + down.text);
  check(!down.newBest && down.best === 0 && down.fair === 0, `a lost attempt doesn't set a best or say New best (best ${down.best}, fair best ${down.fair})`);
  await page.locator('[data-kit="primary"]').click();
  const lost = await page.evaluate(() => { const r = __kit.run(); return { fired: r.w.fired, arm: SL.armState(r).spent, g: r.w.S.g.slice() }; });
  check(lost.fired === 3 && lost.arm === 3 && lost.g.length > 0, `out of shots, then Try again: the 3 shots still count and the growths are there (${JSON.stringify(lost)}; last board had ${lastG})`);
  await page.locator('[data-kit="pause"]').click();
  await page.locator('[data-kit="restart"]').click();
  const restarted = await page.evaluate(() => { const r = __kit.run(); return { fired: r.w.fired, g: r.w.S.g.slice() }; });
  check(restarted.fired === 3 && restarted.g.join() === lost.g.join(), `Pause, Restart: still counted and still there (${JSON.stringify(restarted)})`);
  await page.locator('[data-kit="pause"]').click();
  await page.locator('[data-kit="quit"]').click();
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="0"]').click();
  await page.locator('[data-kit="skip"]').click();
  const menu = await page.evaluate(() => { const r = __kit.run(); return { fired: r.w.fired, g: r.w.S.g.slice() }; });
  check(menu.fired === 3 && menu.g.join() === lost.g.join(), `Menu and back: the same (${JSON.stringify(menu)})`);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  if (await page.locator('#drift-gate .yes').count()) await page.locator('#drift-gate .yes').click();   // the gate remembers its answer
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title', null, { timeout: 8000 });
  await page.evaluate(HELP);
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="0"]').click();
  await page.locator('[data-kit="skip"]').click();
  const reload = await page.evaluate(() => { const r = __kit.run(); return { fired: r.w.fired, g: r.w.S.g.slice(), arm: SL.armState(r).spent }; });
  check(reload.fired === 3 && reload.arm === 3 && reload.g.join() === lost.g.join(), `a reload doesn't wipe them either (${JSON.stringify(reload)})`);
  const pay = await page.evaluate(() => { const r = __kit.run(); __solve(r); return r.salvage; });
  check(pay === 1, `a 4-shot clear of a par 1 board pays the floor: ${pay}`);
  await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 5000 });
  const cleared = await page.evaluate(() => { const b = DriftSave.getSetting('split-light-unfinished', {}); __kit.title(); return b; });
  check(!cleared.spent[0] && !cleared.scars[0], `a win clears what the stage kept: ${JSON.stringify(cleared)}`);

  // ---- The score: replays can't pump it. Real screens, bot playing.
  await ctx.close();
  const { page: ps, ctx: cs } = await h.open('phone');
  await ps.evaluate(HELP);
  const log = [];
  const save = () => ps.evaluate(() => { const g = DriftSave.game('split-light'); return { best: g.best, fair: g.fairBest, salvage: g.salvage, cleared: g.cleared, spent: (DriftSave.storyCarry('split-light') || {}).spent }; });
  const playStage = async i => {
    await ps.locator('[data-kit="story"]').click();
    await ps.locator(`[data-stage="${i}"]`).click();
    await ps.locator('[data-kit="skip"]').click();
    await ps.evaluate(() => __solve(__kit.run()));
    await ps.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 6000 });
    await ps.waitForTimeout(900);
    await ps.locator('[data-kit="menu"]').click();
  };
  await playStage(0); log.push(['stage 1', await save()]);
  await playStage(1); log.push(['stage 2', await save()]);
  for (let k = 1; k <= 5; k++) { await playStage(1); log.push(['stage 2 again ' + k, await save()]); }
  log.forEach(l => console.log('     ' + l[0] + ': ' + JSON.stringify(l[1])));
  const s2 = log[1][1], s7 = log[6][1];
  check(s7.best === s2.best && s7.fair === s2.fair, `5 replays of stage 2 leave best at ${s7.best} and fair best at ${s7.fair}`);
  check(s7.spent === s2.spent, `and the arm's count at ${s7.spent}`);
  check(s7.salvage - s2.salvage === 10, `replays pay a share: 5 replays earned ${s7.salvage - s2.salvage} salvage (a first clear of stage 2 pays 8)`);
  await cs.close();

  // ---- The boss's score: a flawless run is at par on every board, whatever the boards before it took. A lost boss attempt banks nothing.
  const { page: pb, ctx: cb } = await h.open('phone');
  await pb.evaluate(HELP);
  const boss = await pb.evaluate(() => {
    const log = [], keep = SL.bossBoardWon;
    SL.bossBoardWon = function (r, used, over) { const before = r.w.held; keep(r, used, over); log.push({ phase: log.length, used, par: r.w.L.par, over, bonus: (r.w.held || r.score) - before }); };
    __kit.jump(16, { fair: true, seed: 5 });
    const r = __kit.run(), w = r.w; w.boss.opened = true;
    let g = 0; while (!r.over && g++ < 6) __solve(r);
    SL.bossBoardWon = keep;
    return { log, score: r.score, over: r.over };
  });
  console.log('     boss, flawless: ' + JSON.stringify(boss));
  check(boss.over === 'win' && boss.log.length === 3 && boss.log.every(b => b.over === 0), `a flawless boss run is at par on all three boards: over ${boss.log.map(b => b.over).join(', ')}`);
  await pb.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 8000 });
  await cb.close();
  const { page: pl, ctx: cl } = await h.open('phone');
  await pl.evaluate(HELP);
  await pl.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 5 });
    const r = __kit.run(), w = r.w; w.boss.opened = true;
    __solve(r);   // one board won: points on the way
    for (let n = 0; n < 3 && !r.over; n++) { __tapB(r, 'fire'); __land(r); let q = 0; while (w.gap > 0 && q++ < 400) __step(r); if (r.over) break; __tapB(r, 'retry'); __tapB(r, 'retry'); q = 0; while (w.gap > 0 && q++ < 400) __step(r); }
  });
  await pl.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 8000 });
  const lostBoss = await pl.evaluate(() => ({ best: DriftSave.game('split-light').best, newBest: !!document.querySelector('.kit-new') }));
  check(lostBoss.best === 0 && !lostBoss.newBest, `a boss attempt lost after winning a board banks no best (${JSON.stringify(lostBoss)})`);
  await cl.close();

  await h.close();
  finish('review checks', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
