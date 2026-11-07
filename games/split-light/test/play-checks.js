// What a person would trip over: node games/split-light/test/play-checks.js
// Dead boards and Retry; a thumb tapping at random; upgrades through real taps; the arm carried across a story run; pals; every sound.
const { start, check, finish } = require('./harness');

(async () => {
  const h = await start();

  const { page, ctx } = await h.open('phone');
  const step = `(r, n = 1) => { for (let i = 0; i < n; i++) { Kit.input._begin(1 / 60); if (!r.over) { r.time += 1 / 60; SL.step(r, 1 / 60, Kit.input); } Kit.input._end(); } }`;
  await page.evaluate(`window.__step = ${step}`);

  // ---- Dead boards: reach one through real taps wherever the map says one exists, see the banner, press Retry with a real tap, then win.
  const dead = await page.evaluate(() => {
    const out = [];
    SL.forgetShots();
    const tapB = (r, id) => { const b = SL.buttons(r).find(x => x.id === id); Kit.input.sim.tap(b.x + b.w / 2, b.y + b.h / 2); };
    const tapC = (r, i) => { const L = r.w.L, P = SL.cellXY(r, i % L.cols, Math.floor(i / L.cols)); Kit.input.sim.tap(P.x, P.y); };
    Kit.def.stages.forEach((st, i) => {
      __kit.jump(i, { fair: true, seed: 2 });
      const r = __kit.run(), w = r.w;
      w.boss && (w.boss.opened = true);
      const spec0 = w.L;
      // Find a line of shots that leaves shots but no way through.
      let bad = null;
      const search = (S, path) => {
        if (bad || path.length >= S.shots + path.length || S.shots <= 0) return;
        for (const oc of SL.outcomes(spec0, S)) {
          const N = SL.after(spec0, S, oc.res);
          if (!SL.alive(N)) continue;
          const p = path.concat([oc]);
          if (N.shots > 0 && !SL.solve(spec0, N)) { bad = p; return; }
          if (spec0.mode !== 'clock') search(N, p);
        }
      };
      if (spec0.mode === 'clock') return;   // clocked boards: covered by the map in levels-test.js
      search(w.S, []);
      if (!bad) { out.push({ i: i + 1, has: false }); return; }
      for (const oc of bad) {
        if (w.perch !== oc.perch) { tapC(r, spec0.perches[oc.perch].i); __step(r); }
        for (const k of Object.keys(oc.assign)) if (w.lean[k] !== oc.assign[k]) { tapC(r, +k); __step(r); }
        tapB(r, 'fire'); __step(r, 2);
        let g = 0; while (w.beam && g++ < 600) __step(r);
      }
      const flagged = w.dead, fireOff = !SL.buttons(r).find(x => x.id === 'fire').on, retryMain = SL.buttons(r).find(x => x.id === 'retry').main;
      const nerve0 = w.boss ? w.boss.nerve : 0;
      tapB(r, 'retry'); __step(r, 2);
      let g = 0; while (w.gap > 0 && g++ < 300) __step(r);
      const fresh = (w.boss ? w.S.shots === w.L.shots : w.S.shots === SL.shotsFor(w.L, w.S, w.fired) && w.S.shots < w.L.shots) && !w.dead && !!SL.solve(w.L, w.S);   // levels: only the shots not yet spent, and always enough for a way through. The boss: full shots, for a point of nerve
      out.push({ i: i + 1, has: true, flagged, fireOff, retryMain, fresh, nerveCost: w.boss ? nerve0 - w.boss.nerve : 0 });
    });
    __kit.title();
    return out;
  });
  const withDead = dead.filter(d => d.has);
  console.log(`     boards where a shot can leave no way through: ${withDead.map(d => d.i).join(', ')}`);
  check(withDead.length >= 5, `found ${withDead.length} boards with reachable dead ends`);
  check(withDead.every(d => d.flagged && d.fireOff && d.retryMain), 'each one shows NO WAY THROUGH, turns FIRE off and makes Retry the big button');
  check(withDead.every(d => d.fresh), 'a real tap on Retry gives the shots not yet spent (full on the boss) and a board with a way through, every time');
  const bossDead = withDead.filter(d => d.i === 17);
  if (bossDead.length) check(bossDead[0].nerveCost === 1, `on the boss, Reset costs ${bossDead[0].nerveCost} point of nerve`);

  // ---- A thumb tapping anywhere at random, through the real input. It must never crash or get stuck: the end of every game is a win, a loss, or a Retry on offer.
  const monkey = await page.evaluate(() => {
    const out = { games: 0, wins: 0, losses: 0, deadRetries: 0, stuck: 0, shots: 0 };
    let seed = 777; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let pass = 0; pass < 12; pass++) {
      Kit.def.stages.forEach((st, i) => {
        __kit.jump(i, { fair: true, seed: pass * 13 + i + 1 });
        const r = __kit.run(), w = r.w;
        if (w.boss) w.boss.opened = true;
        out.games++;
        for (let n = 0; n < 2400 && !r.over; n++) {
          if (n % 7 === 0) {
            const useFire = rnd() < 0.25, b = SL.buttons(r).find(x => x.id === 'fire');
            if (w.dead && rnd() < 0.5) { const q = SL.buttons(r).find(x => x.id === 'retry'); Kit.input.sim.tap(q.x + 5, q.y + 5); out.deadRetries++; }
            else if (useFire) Kit.input.sim.tap(b.x + 9, b.y + 9);
            else Kit.input.sim.tap(rnd() * 360, rnd() * 640);
          }
          __step(r);
          const b = SL.buttons(r);
          if (!r.over && !w.beam && w.gap <= 0 && SL.alive(w.S) && !b.find(x => x.id === 'fire').on && !w.dead && w.S.shots > 0) out.stuck++;
          if (!r.over && !w.beam && w.gap <= 0 && w.S.shots <= 0 && SL.alive(w.S) && !w.dead) out.stuck++;
        }
        if (r.over === 'win') out.wins++; else if (r.over === 'lose') out.losses++;
      });
    }
    __kit.title();
    return out;
  });
  console.log(`     random thumb: ${monkey.games} games, ${monkey.wins} wins, ${monkey.losses} losses, ${monkey.deadRetries} retries from a dead board`);
  check(monkey.stuck === 0, `random thumb never found a stuck moment (${monkey.stuck})`);

  // ---- Upgrades
  const upg = await page.evaluate(() => {
    const d = DriftSave; d.finishRun('smoke-bank', 0, 3000);
    ['steady', 'scraper', 'look'].forEach(u => { d.buyUpgrade('split-light', u, 20, 3); d.buyUpgrade('split-light', u, 45, 3); });
    const tap = (r, id) => { const b = SL.buttons(r).find(x => x.id === id); Kit.input.sim.tap(b.x + b.w / 2, b.y + b.h / 2); __step(r, 2); };
    SL.forgetShots();   // the random thumb above left growths behind, as a person would
    __kit.jump(7, { fair: false, seed: 5 });
    const r = __kit.run(), w = r.w, out = { undos: w.undos, scrapes: w.scrapes, look: w.look };
    const before = w.S.shots;
    out.fullShots = before;
    tap(r, 'fire'); let g = 0; while (w.beam && g++ < 400) __step(r);
    out.shotSpent = before - w.S.shots; out.grew = w.S.g.length;
    tap(r, 'undo');
    out.afterUndo = { shots: w.S.shots, g: w.S.g.length, undos: w.undos };
    tap(r, 'fire'); g = 0; while (w.beam && g++ < 400) __step(r);
    const grown = w.S.g[0];
    tap(r, 'scrape'); out.scraping = w.scraping;
    const P = SL.cellXY(r, grown % w.L.cols, Math.floor(grown / w.L.cols));
    Kit.input.sim.tap(P.x, P.y); __step(r, 2);
    out.afterScrape = { g: w.S.g.length, scrapes: w.scrapes };
    // Second Look: more bounces drawn per level. A board with crystals in a chain.
    __kit.jump(1, { fair: false, seed: 5 });
    const r2 = __kit.run(), w2 = r2.w;
    Object.assign(w2.lean, SL.solve(w2.L, w2.S).plan[0].assign);
    out.lookSegs = [0, 1, 2].map(n => SL.shoot(w2.L, w2.S, 0, w2.lean, { maxBounces: n }).segs.length);
    // The switch
    __kit.jump(7, { fair: true });
    out.fairButtons = SL.buttons(__kit.run()).map(b => b.id);
    out.fairLook = __kit.run().w.look;
    __kit.title();
    return out;
  });
  check(upg.undos === 2 && upg.scrapes === 2 && upg.look === 2, `level 2 upgrades give ${upg.undos} undos, ${upg.scrapes} scrapes, ${upg.look} bounces shown`);
  check(upg.shotSpent === 1 && upg.afterUndo.shots === upg.fullShots && upg.afterUndo.g === 0 && upg.afterUndo.undos === 1, `Undo takes the shot back: ${JSON.stringify(upg.afterUndo)}`);
  check(upg.scraping && upg.afterScrape.g === 0 && upg.afterScrape.scrapes === 1, `Scrape removes the growth: ${JSON.stringify(upg.afterScrape)}`);
  check(upg.lookSegs[0] === 1 && upg.lookSegs[1] === 2 && upg.lookSegs[2] === 3, `Second Look draws ${upg.lookSegs.join(', ')} segments for 0, 1, 2 bounces`);
  check(upg.fairButtons.join() === 'fire,retry' && upg.fairLook === 0, 'the No-upgrades switch takes all three away');

  // ---- The arm: a real story run through real screens. It lasts through Menu and Next, comes back on Retry, and starts over from stage 1.
  await page.evaluate(() => { DriftSave.setStoryCarry('split-light', null); SL.forgetShots(); __kit.title(); });
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="0"]').click();
  await page.locator('[data-kit="skip"]').click();
  await page.evaluate(() => { const r = __kit.run(), w = r.w; SL.fire(r); let g = 0; while (w.beam && g++ < 400) __step(r); w.lean[w.L.pieces.findIndex(p => p)] = 1; SL.fire(r); g = 0; while (w.beam && g++ < 400) __step(r); });
  await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 5000 });
  await page.waitForTimeout(500);
  const afterOne = await page.evaluate(() => DriftSave.storyCarry('split-light').spent);
  check(afterOne === 2, `two shots on stage 1 are saved on the arm (spent ${afterOne})`);
  await page.locator('[data-kit="menu"]').click();
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="1"]').click();
  const arm = await page.evaluate(() => {
    const r = __kit.run(), a0 = SL.armState(r), w = r.w;
    SL.fire(r); let g = 0; while (w.beam && g++ < 400) __step(r);
    const a1 = SL.armState(r);
    SL.retry(r);
    const a2 = SL.armState(r);
    return { a0, a1, a2 };
  });
  check(arm.a0.spent === 2, `Menu, Story, stage 2: the arm still shows 2 (${arm.a0.spent})`);
  check(arm.a1.spent === 3 && arm.a1.fresh === 1, `a shot adds a fresh shard to the arm at once (${JSON.stringify(arm.a1)})`);
  check(arm.a2.spent === 3, `Retry gives the shots back, but the shot stays on her arm (${arm.a2.spent})`);
  const fresh = await page.evaluate(() => { __kit.title(); return true; });
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="0"]').click();
  const reset = await page.evaluate(() => SL.armState(__kit.run()).spent);
  check(fresh && reset === 0, `stage 1 starts a new run with a clean count (${reset})`);
  await page.evaluate(() => __kit.title());

  // ---- Pals, forced on, played by the bot through real taps, nothing saved. A fresh save: the random thumb above may well have caught one for real.
  const { page: pp, ctx: pc } = await h.open('phone');
  const pals = await pp.evaluate(() => {
    const T = TUNE, keep = { chance: T.glimmickChance, wait: T.glimmickWait, b: T.shardleBounces, pals: T.botPals };
    const save = () => { DriftSave.load(); };
    save();
    let g = 0, s = 0;
    T.botPals = 'glimmick'; T.glimmickChance = 1;
    for (let k = 0; k < 8; k++) if ((__kit.runStage(5, { bot: true, seed: 50 + k, renderEvery: 0, maxSeconds: 120 }).caught || []).includes('glimmick')) g++;
    const noGlim = __kit.runStage(2, { bot: true, seed: 3, renderEvery: 0, maxSeconds: 60 }).caught.length;   // Set 1: it doesn't come
    T.botPals = 'shardle'; T.shardleChance = 1; T.shardleBounces = 1;
    for (let k = 0; k < 8; k++) if ((__kit.runStage(10, { bot: true, seed: 80 + k, renderEvery: 0, maxSeconds: 120 }).caught || []).includes('shardle')) s++;
    T.glimmickChance = keep.chance; T.glimmickWait = keep.wait; T.shardleBounces = keep.b; T.botPals = keep.pals; T.shardleChance = 0.35;
    return { g, s, noGlim };
  });
  check(pals.g === 8, `Glimmick, forced: caught ${pals.g} of 8 after waiting`);
  check(pals.noGlim === 0, 'Glimmick stays out of Set 1');
  check(pals.s === 8, `Shardle, forced with a lower bounce count: caught ${pals.s} of 8`);
  await pc.close();

  // ---- Every effect the game asks for exists.
  const missing = await page.evaluate(async () => {
    const files = ['play.js', 'moves.js', 'control.js', 'boss.js', 'palcatch.js'], names = new Set(Kit.audio.names()), out = [];
    for (const f of files) {
      const t = await (await fetch(f)).text();
      for (const m of t.matchAll(/AU\(\)\.play\('([a-z0-9]+)'\)/g)) if (!names.has(m[1])) out.push(f + ':' + m[1]);
    }
    return out;
  });
  check(missing.length === 0, `every sound the game plays is defined (${missing.join(', ') || 'none missing'})`);
  await ctx.close();

  await h.close();
  finish('play checks', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
