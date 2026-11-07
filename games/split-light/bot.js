// Split Light test bot. It asks the solver for the fewest-shots plan from the board as it stands, then does it with taps through input.sim, like a thumb:
// perch, then each crystal that's wrong, one tap at a time, then waits for the right moment of the clock and fires.
window.SL = window.SL || {};
(function () {
  const T = TUNE;

  function tapCell(run, input, i) {
    const L = run.w.L, P = SL.cellXY(run, i % L.cols, Math.floor(i / L.cols));
    input.sim.tap(P.x, P.y);
  }
  function tapButton(run, input, id) {
    const b = SL.buttons(run).find(x => x.id === id);
    input.sim.tap(b.x + b.w / 2, b.y + b.h / 2);
  }

  SL.bot = function (run, input) {
    const w = run.w, me = w.botMem || (w.botMem = { nextAt: 0, key: null, plan: null, fireAt: 0 });
    if (run.over || w.gap > 0 || w.beam) return;
    if (run.time < me.nextAt) return;
    if (T.botPals && w.pal) { input.sim.tap(w.pal.x, w.pal.y - T.palTapUp); me.nextAt = run.time + T.botTapGap; return; }
    if (T.botPals === 'glimmick' && !w.glimmickTried) return;   // the pal test: stand and wait, as a person would

    const key = w.S.g.join(',') + '|' + w.S.hp.join('') + '|' + w.S.shots + '|' + w.S.sealed + '|' + (w.L.mode === 'clock' ? '' : w.S.tick);
    if (me.key !== key) { me.key = key; me.plan = SL.solve(w.L, w.S); }
    const plan = me.plan;
    if (!plan || !plan.plan.length) { tapButton(run, input, 'retry'); me.key = null; me.nextAt = run.time + T.botTapGap; return; }
    const step = plan.plan[0];

    if (w.perch !== step.perch) { tapCell(run, input, w.L.perches[step.perch].i); me.nextAt = run.time + T.botTapGap; me.fireAt = run.time + T.botFireGap; return; }
    const wrong = Object.keys(step.assign).map(Number).find(i => w.lean[i] !== step.assign[i]);
    if (wrong !== undefined) { tapCell(run, input, wrong); me.nextAt = run.time + T.botTapGap; me.fireAt = run.time + T.botFireGap; return; }
    if (run.time < me.fireAt) return;
    if (w.L.mode === 'clock' && w.S.tick !== step.tick) return;   // wait for the moment
    tapButton(run, input, 'fire');
    me.nextAt = run.time + T.botTapGap;
  };
})();
