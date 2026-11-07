// Hot Hand: things in the air. Rules only.
window.HH = window.HH || {};
(function () {
  const T = TUNE;

  // Things in the air: hooks, bolts, Krell's quench cans. All can be burned on the way.
  HH.addProj = function (run, type, x, y, dur, arc, warnAt) {
    const w = run.w, p = { kind: 'proj', type, sx: x, sy: y, tx: w.jx, ty: T.frontY - 55, t: 0, dur, arc, warnAt, x, y, spin: 0, pending: 0, mark: 0 };
    w.projs.push(p);
    return p;
  };
  // Where a thing in the air is at a given moment of its flight.
  HH.projAt = function (p, at) {
    const u = Math.max(0, Math.min(1, at / p.dur));
    return { x: p.sx + (p.tx - p.sx) * u, y: p.sy + (p.ty - p.sy) * u - Math.sin(u * Math.PI) * p.arc, u };
  };
  // How far a tap is from a thing in the air: from where it is, or from where it was a moment ago. A thumb that tapped what it saw has arrived late, and that still counts.
  HH.projMiss = function (p, x, y) {
    let best = Math.hypot(p.x - x, p.y - y);
    for (let a = T.projLagStep; a <= T.projLag + 1e-6; a += T.projLagStep) { const q = HH.projAt(p, p.t - a); best = Math.min(best, Math.hypot(q.x - x, q.y - y)); }
    return best;
  };
  HH.stepProjs = function (run, dt) {
    const w = run.w;
    for (const p of w.projs) {
      p.t += dt; p.spin += dt * 14;
      const at = HH.projAt(p, p.t), u = at.u;
      p.x = at.x; p.y = at.y;
      if (u >= 1 && !p.doomed) {
        p.gone = true;
        if (p.type === 'quench') HH.quenched(run);
        else HH.hurt(run, T.airHurt, { why: p.type, warnAt: p.warnAt });
      } else if (u >= 1) p.gone = true;
    }
    w.projs = w.projs.filter(p => !p.gone);
  };
})();
