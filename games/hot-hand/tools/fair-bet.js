// Hot Hand fairness script, part: the bet through the real screens, a hidden tab, burns through the menu. Run through tools/fairness.js.
module.exports = async function ({ page, ctx, SEEDS, ONLY, STAGE, stages, check, runMany, line, sum, PLAYERS, MIN_LEAD, SMALL_SCALE, SHOTS, path, fs }) {
  if (!ONLY || ONLY === 'bet') {
    console.log('\n== The bet, through the real screens, starting with nothing in the bank ==');
    await page.evaluate(() => { localStorage.clear(); });
    await page.reload(); await page.waitForTimeout(700);
    if (await page.locator('#drift-gate .yes').count()) { await page.locator('#drift-gate .yes').click(); }
    await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
    const bal = () => page.evaluate(() => DriftSave.load().salvage);
    check((await bal()) === 0, 'starts with 0 salvage in the bank');
    const toCard = async () => {
      // Clear the wave, then wait for the card. The time between is the game's own.
      await page.evaluate(() => { __kit.bot(false); __kit.timeScale = 8; });
      await page.waitForFunction(() => __kit.run().w.phase === 'wave', null, { timeout: 15000 });
      await page.evaluate(() => { const w = __kit.run().w; w.deck.length = 0; w.foes.forEach(f => { f.dead = true; }); });
      await page.waitForFunction(() => __kit.state().screen === 'ask', null, { timeout: 15000 });
      await page.waitForTimeout(500);
    };
    await page.evaluate(() => { __kit.jump(0, { fair: true }); });
    await page.waitForTimeout(200);
    await toCard();
    const opts = await page.locator('#kit-ui [data-opt]').allTextContents();
    console.log('card: ' + opts.map(s => s.trim().replace(/\s+/g, ' ')).join(' | '));
    check(opts.length === 3, 'the card offers 3 choices with an empty bank, cashing in always first');
    await page.screenshot({ path: path.join(SHOTS, 'card-first.png') });
    await page.locator('[data-opt="2"]').click();
    const riding = await page.evaluate(() => ({ s: __kit.run().w.stake, salvage: __kit.run().salvage }));
    check(riding.s > 0 && riding.salvage === 0, `Let it ride: ${riding.s} rides, nothing paid yet`);
    await page.evaluate(() => { __kit.timeScale = 1; });
    await page.evaluate(() => { const r = __kit.run(); HH.hurt(r, 1, { why: 'test', warnAt: r.time - 1 }); });
    const bust = await page.evaluate(() => { const w = __kit.run().w; return { stake: w.stake, bustT: w.bustT, last: w.lastBust, lost: w.betsLost }; });
    check(bust.stake === 0 && bust.bustT > 0 && bust.last === riding.s && bust.lost === 1, `a hit busts it: BUST shows for ${bust.bustT.toFixed(2)} s, ${bust.last} gone`);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SHOTS, 'bust.png') });
    check((await bal()) >= 0, 'the bank has not gone below zero: ' + (await bal()));
    await toCard();
    const txt = await page.locator('#kit-ui .kit-sub').first().textContent();
    console.log('next card says: ' + txt);
    check(/Bet lost/.test(txt), 'the next card says the bet was lost');
    await page.screenshot({ path: path.join(SHOTS, 'card-lost.png') });
    await page.locator('[data-opt="0"]').click();
    const paid = await page.evaluate(() => ({ salvage: __kit.run().salvage, stake: __kit.run().w.stake }));
    check(paid.salvage > 0 && paid.stake === 0, `Cash in pays straight away (${paid.salvage}), nothing rides`);
    // A win pays. No hits in the wave.
    await page.evaluate(() => { __kit.title(); });
    await page.evaluate(() => { __kit.jump(0, { fair: true }); });
    await page.waitForTimeout(200);
    await toCard();
    await page.locator('[data-opt="2"]').click();
    const stake = await page.evaluate(() => __kit.run().w.stake);
    await toCard();
    const won = await page.evaluate(() => { const w = __kit.run().w; return { won: w.wonLast, table: w.table }; });
    check(won.won === stake * 2 && won.table >= won.won, `a clean wave doubles it: ${stake} pays ${won.won}, table ${won.table}`);
    await page.screenshot({ path: path.join(SHOTS, 'card-won.png') });
    await page.locator('[data-opt="0"]').click();
    const before = await page.evaluate(() => __kit.run().salvage);
    // Salvage already paid can't be taken back by a later bet.
    await page.evaluate(() => { const r = __kit.run(); r.w.stake = 5; HH.hurt(r, 1, { why: 'test', warnAt: r.time - 1 }); });
    const after = await page.evaluate(() => __kit.run().salvage);
    check(after === before, `a later bust leaves paid salvage alone (${before} to ${after})`);
    await page.evaluate(() => { __kit.timeScale = 1; __kit.title(); });

    console.log('\n== A hidden tab with the card up cashes the table in ==');
    await page.evaluate(() => { __kit.jump(0, { fair: true }); });
    await page.waitForTimeout(200);
    await toCard();
    const hid = await page.evaluate(() => {
      const r = __kit.run(), before = DriftSave.load().salvage, t = r.w.table;
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange'));
      const got = DriftSave.load().salvage - before;
      delete document.hidden; document.dispatchEvent(new Event('visibilitychange'));
      return { t, got };
    });
    check(hid.got === hid.t && hid.t > 0, `hiding the tab banks the table straight away (${hid.got} of ${hid.t})`);
    await page.waitForTimeout(600);
    const back = { text: await page.locator('#kit-ui .kit-sub').first().textContent(), n: await page.locator('#kit-ui [data-opt]').count() };
    console.log('card after coming back: ' + back.text);
    check(back.n === 1 && back.text.includes('+' + hid.t + ' safe'), 'and the card comes back changed: it says so, and offers no bet');
    await page.locator('[data-opt="0"]').click();
    const went = await page.evaluate(() => { const w = __kit.run().w; return { stake: w.stake, table: w.table, phase: w.phase }; });
    check(went.stake === 0 && went.table === 0 && went.phase === 'gap', 'pressing on bets nothing and goes on to the next wave');
    await page.evaluate(() => { __kit.timeScale = 1; __kit.title(); });

    console.log('\n== A bet pays what the card promised, whatever is on the table ==');
    const paid2 = await page.evaluate(() => {
      const T = TUNE, keep = [T.botBet, T.botHuman], real = HH.waveCleared, out = { n: 0, bad: 0, most: 0, mostStake: 0 };
      HH.waveCleared = function (run) { const w = run.w, stake = w.stake, base = run.boss ? T.bossPurse : run.stage.isEndless ? T.endlessPurse : T.purse, extra = w.extra; real.apply(HH, arguments); if (stake > 0) { out.n++; out.mostStake = Math.max(out.mostStake, stake); out.most = Math.max(out.most, w.table); if (w.wonLast !== Math.round(stake * HH.betX(run)) || w.table !== base + extra + w.wonLast) out.bad++; } };
      T.botBet = 'all'; T.botHuman = null;
      for (let i = 0; i < 5; i++) for (let s = 1; s <= 5; s++) __kit.runStage(i, { bot: true, seed: s * 41 + i, fair: true, renderEvery: 0 });
      for (let s = 1; s <= 3; s++) __kit.runStage(0, { bot: true, endless: true, seed: s * 97, fair: true, maxSeconds: 600, renderEvery: 0 });
      HH.waveCleared = real; [T.botBet, T.botHuman] = keep;
      return out;
    });
    check(paid2.n > 20 && paid2.bad === 0, `${paid2.n} bets won, ${paid2.bad} paid anything but the promise (biggest stake ${paid2.mostStake}, fullest table ${paid2.most})`);

    console.log('\n== Burns last the story run, through Menu ==');
    const burn = await page.evaluate(() => {
      __kit.jump(0, { fair: true }); const r = __kit.run();
      r.w.heat = 100; r.w.foes.length = 0; HH.goOver(r);
      const a = r.carry.burns, lock = r.w.lockT; r.win(0);
      return { a, lock };
    });
    await page.waitForFunction(() => __kit.state().screen === 'result');
    await page.waitForTimeout(500);
    await page.locator('[data-kit="menu"]').click();
    await page.locator('[data-kit="story"]').click();
    await page.locator('[data-stage="1"]').click();
    const carried = await page.evaluate(() => { const r = __kit.run(); return { burns: r.carry.burns, screen: __kit.state().screen }; });
    check(burn.a === 1 && carried.burns === 1, `a burn taken on stage 1 is still there on stage 2 after going through the menu (${burn.a} to ${carried.burns})`);
    await page.evaluate(() => { DriftSave.setStoryCarry('hot-hand', null); __kit.title(); });
  }
};
