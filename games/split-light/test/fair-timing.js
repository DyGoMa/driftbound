// Proof that the game's timing is fair: node games/split-light/test/fair-timing.js [--seeds 20]
// Nothing runs on a clock except the rails and openings marked with a ring. For those:
//  1. Boards with no clock: 10 minutes with nobody playing changes nothing.
//  2. Clocked boards: measures every stop and warning as they happen in the real game.
//  3. What you see is what you hit: a press at any moment of a stop, even the very last step and during the slide, hits what's on screen, and the clock holds while the beam flies.
//  4. A slow, late player with no look-ahead: sees the moment it wants, reacts after a set delay, taps at one tap every 0.45 s through the real input. Must beat every clocked board.
//     Delays run from quick to longer than most of a stop. A player who misses a stop just waits for it to come round: nothing is lost.
//  5. After Vasch corrects a crystal: it shows for long enough, and only one turns.
const { start, check, finish } = require('./harness');
const SEEDS = process.argv.includes('--seeds') ? +process.argv[process.argv.indexOf('--seeds') + 1] : 20;

(async () => {
  const h = await start(), { page } = await h.open('phone');

  // ---- 1
  const still = await page.evaluate(() => {
    const out = [], minutes = 10;
    Kit.def.stages.forEach((st, i) => {
      if (st.boss) return;
      __kit.jump(i, { fair: true, seed: 1 });
      const r = __kit.run(), key0 = SL.stateKey(r.w.S), clocked = r.w.L.mode === 'clock';
      if (clocked) return;
      for (let n = 0; n < minutes * 3600; n++) { Kit.input._begin(1 / 60); SL.step(r, 1 / 60, Kit.input); Kit.input._end(); }
      out.push({ i: i + 1, same: SL.stateKey(r.w.S) === key0 && !r.over });
    });
    __kit.title();
    return out;
  });
  check(still.every(s => s.same), `${still.length} boards with no clock: 10 minutes idle changes nothing`);

  // ---- 2
  const stops = await page.evaluate(() => {
    const out = [];
    const boards = [{ name: 'L15 clockwork', i: 14, spec: null }, { name: 'boss 2 metronome', i: 16, spec: SL.BOSS[1] }, { name: 'boss 3 the arm', i: 16, spec: SL.BOSS[2] }];
    boards.forEach(b => {
      __kit.jump(b.i, { fair: true, seed: 1 });
      const r = __kit.run();
      if (b.spec) { r.w.boss.opened = true; SL.loadBoard(r, b.spec); }
      const L = r.w.L, seen = [];
      let last = r.w.S.tick, sinceTick = 0, warnAt = null;
      for (let n = 0; n < 3600; n++) {
        Kit.input._begin(1 / 60); SL.step(r, 1 / 60, Kit.input); Kit.input._end();
        sinceTick += 1 / 60;
        if (r.w.warned && warnAt === null) warnAt = sinceTick;
        if (r.w.S.tick !== last) { seen.push({ stop: sinceTick, warnFor: warnAt === null ? 0 : sinceTick - warnAt }); last = r.w.S.tick; sinceTick = 0; warnAt = null; }
      }
      out.push({ name: b.name, clock: L.clock, cycle: L.cycle, n: seen.length, shortestStop: Math.min(...seen.map(s => s.stop)), shortestWarn: Math.min(...seen.map(s => s.warnFor)) });
    });
    __kit.title();
    return out;
  });
  stops.forEach(s => {
    console.log(`     ${s.name}: ${s.n} stops seen, shortest ${s.shortestStop.toFixed(2)} s, warning at least ${s.shortestWarn.toFixed(2)} s before each move, the whole round repeats every ${(s.clock * s.cycle).toFixed(1)} s`);
    check(s.shortestStop >= 2.5, `${s.name}: every stop lasts at least 2.5 s`);
    check(s.shortestWarn >= 0.95, `${s.name}: the warning gives at least 0.95 s`);
  });

  // ---- 3
  const wysiwyg = await page.evaluate(() => {
    const out = { presses: 0, wrong: 0, clockMoved: 0 };
    const boards = [[14, null], [16, SL.BOSS[1]], [16, SL.BOSS[2]]];
    boards.forEach(([i, spec]) => {
      __kit.jump(i, { fair: true, seed: 1 });
      const base = __kit.run();
      const L0 = (spec || base.stage.level);
      const L = SL.compile(L0);
      for (let tick = 0; tick < L.cycle; tick++) {
        for (let frame = 0; frame < Math.round(L.clock * 60); frame += 7) {
          __kit.jump(i, { fair: true, seed: 1 });
          const r = __kit.run(), w = r.w;
          if (spec) { w.boss.opened = true; SL.loadBoard(r, spec); }
          const step = () => { Kit.input._begin(1 / 60); SL.step(r, 1 / 60, Kit.input); Kit.input._end(); };
          let guard = 0;
          while (w.S.tick !== tick && guard++ < 3000) step();
          for (let f = 0; f < frame; f++) step();
          const tickAtPress = w.S.tick, expected = SL.shoot(w.L, w.S, w.perch, w.lean);
          const b = SL.buttons(r).find(x => x.id === 'fire');
          Kit.input.sim.tap(b.x + b.w / 2, b.y + b.h / 2);
          step();
          out.presses++;
          if (!w.beam || JSON.stringify(w.beam.res.hits) !== JSON.stringify(expected.hits) || JSON.stringify(w.beam.res.growth) !== JSON.stringify(expected.growth)) out.wrong++;
          for (let f = 0; f < 240 && w.beam; f++) { if (w.S.tick !== tickAtPress) out.clockMoved++; step(); }
        }
      }
    });
    __kit.title();
    return out;
  });
  check(wysiwyg.wrong === 0, `a press at any moment of a stop hits what is on screen: ${wysiwyg.presses} presses, ${wysiwyg.wrong} wrong`);
  check(wysiwyg.clockMoved === 0, 'the clock holds while the beam is in the air');

  // ---- 4 A reaction-limited player, playing through input.sim only.
  await page.evaluate(() => {
    window.__slow = function (run, input) {
      const w = run.w, me = w.slowMem || (w.slowMem = { nextAt: 0, key: null, plan: null, reactAt: null, tick: -1, presses: 0, late: 0 });
      if (run.over || w.gap > 0 || w.beam || run.time < me.nextAt) return;
      const key = w.S.g.join(',') + '|' + w.S.hp.join('') + '|' + w.S.shots + '|' + w.S.sealed + '|' + (w.L.mode === 'clock' ? '' : w.S.tick);
      if (me.key !== key) { me.key = key; me.plan = SL.solve(w.L, w.S); }
      if (!me.plan) { const b = SL.buttons(run).find(x => x.id === 'retry'); input.sim.tap(b.x + b.w / 2, b.y + b.h / 2); me.nextAt = run.time + 0.45; return; }
      const step = me.plan.plan[0];
      const P = i => SL.cellXY(run, i % w.L.cols, Math.floor(i / w.L.cols));
      if (w.perch !== step.perch) { const p = P(w.L.perches[step.perch].i); input.sim.tap(p.x, p.y); me.nextAt = run.time + window.__slowGap; return; }
      const wrong = Object.keys(step.assign).map(Number).find(i => w.lean[i] !== step.assign[i]);
      if (wrong !== undefined) { const p = P(wrong); input.sim.tap(p.x, p.y); me.nextAt = run.time + window.__slowGap; return; }
      // The moment it wants has to be on screen for a whole reaction time before the thumb lands. It never looks ahead.
      if (w.L.mode === 'clock') {
        if (w.S.tick !== step.tick) { me.reactAt = null; return; }
        if (me.reactAt === null) me.reactAt = run.time + window.__slowLo + run.rng() * (window.__slowHi - window.__slowLo);
        if (run.time < me.reactAt) return;
        me.reactAt = null;
      }
      const b = SL.buttons(run).find(x => x.id === 'fire');
      input.sim.tap(b.x + b.w / 2, b.y + b.h / 2);
      me.nextAt = run.time + 0.45;
    };
    window.__botReal = Kit.def.bot;
    Kit.def.bot = window.__slow;
  });
  const ranges = [[0.4, 0.7], [0.7, 1.2], [1.2, 1.8], [1.8, 2.4]];
  for (const [lo, hi] of ranges) {
    for (const stage of [14, 16]) {
      const res = await page.evaluate(({ lo, hi, stage, seeds }) => {
        window.__slowLo = lo; window.__slowHi = hi; window.__slowGap = 0.45;
        const out = { wins: 0, secs: [], retries: 0, shots: 0, par: 0 };
        for (let s = 1; s <= seeds; s++) {
          const r = __kit.runStage(stage, { bot: true, seed: s * 101 + stage, maxSeconds: 400, fair: true, renderEvery: 0 });
          if (r.result === 'win') out.wins++;
          out.secs.push(r.seconds); out.retries += r.info.retries; out.shots += r.info.shotsUsed; out.par += r.info.par;
        }
        return out;
      }, { lo, hi, stage, seeds: SEEDS });
      const name = stage === 14 ? 'L15 clockwork' : 'the boss, whole stage';
      console.log(`     reacts in ${lo} to ${hi} s, ${name}: ${res.wins}/${SEEDS} wins, ${Math.min(...res.secs)} to ${Math.max(...res.secs)} s, resets ${res.retries}, shots ${res.shots} (par ${res.par})`);
      check(res.wins === SEEDS && res.retries === 0, `slow player (${lo} to ${hi} s) beats ${name} every time, with no reset`);
    }
  }
  await page.evaluate(() => { Kit.def.bot = window.__botReal; });

  // ---- 5
  const corr = await page.evaluate(() => {
    __kit.jump(16, { fair: true, seed: 3 });
    const r = __kit.run(), w = r.w;
    w.boss.opened = true; w.boss.phase = 2; SL.loadBoard(r, SL.BOSS[2]);
    const leansBefore = Object.assign({}, w.lean);
    SL.fire(r);
    let guard = 0;
    const step = () => { Kit.input._begin(1 / 60); SL.step(r, 1 / 60, Kit.input); Kit.input._end(); };
    while (w.beam && guard++ < 400) step();
    const changed = Object.keys(w.lean).filter(k => w.lean[k] !== leansBefore[k]);
    const shown = w.corrected ? w.corrected.t : 0;
    const still = SL.stillPossible(w.L, w.S);
    __kit.title();
    return { changed: changed.length, shown, still };
  });
  check(corr.changed === 1 && corr.shown >= 1.5, `Vasch turns exactly ${corr.changed} crystal after a shot, marked for ${corr.shown.toFixed(1)} s`);
  check(corr.still, 'his correction never closes the way through: leans are free to turn back');

  await h.close();
  finish('fair timing', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
