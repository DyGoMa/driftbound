// Hot Hand: Ashka flies spotter. Every few seconds she picks a target and marks it. Hitting a marked target costs no heat, takes some off, and hits a tier harder.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;

  HH.ashkaNew = (x) => ({ x, y: T.flyHome.y, tx: x, ty: T.flyHome.y, wait: T.markFirst, target: null, t: 0, flap: 0 });

  // Who she goes for. On the street: whoever is far enough off to reach, toughest first. At the boss: a vent that's open, or whistling and about to be, or Krell when he's in the open. Never a vent that's still shut: her mark says "now".
  function choose(run) {
    const w = run.w;
    if (w.boss) {
      if (w.boss.krell.exposed) return w.boss.krell;
      const v = w.boss.shields.filter(s => !s.down && (s.vent === 'tell' || s.vent === 'open'));
      if (v.length) return v.find(s => s.vent === 'open') || v[0];
    }
    const list = w.foes.filter(f => !f.dead && f.pending < f.hp && f.x < T.botEdge && f.x > 20 && !(f.type === 'sniper' && f.state === 'hide') && f.type !== 'cart');
    if (!list.length) return null;
    list.sort((a, b) => (T.foes[b.type].hp - T.foes[a.type].hp) || (a.d - b.d));
    return list[0];
  }

  HH.stepAshka = function (run, dt) {
    const w = run.w, a = w.ashka;
    a.t += dt; a.flap += dt;
    if (a.target && (a.target.dead || a.target.down || !(a.target.mark > 0))) a.target = null;
    if (a.target && a.target.kind === 'krell' && !a.target.exposed) { a.target.mark = 0; a.target = null; }
    if (!a.target) {
      a.wait -= dt;
      if (a.wait <= 0 && w.phase === 'wave') {
        const t = choose(run);
        if (t) {
          t.mark = T.markSecs; a.target = t;
          a.wait = run.range(T.markEvery[0], T.markEvery[1]);
          HH.sfx(run, 'cry');
          if (!w.seen.mark) { w.seen.mark = 1; HH.teach(run, 'mark', W.first.mark); }
        } else a.wait = T.markRetry;
      }
    }
    // Where she flies: a slow circle over Juno, or over her target. Looks only.
    // Beside her target, toward Juno, never on it: the signs over its head have to stay clear.
    if (a.target) { a.tx = a.target.x + (a.target.x > w.jx ? -1 : 1) * T.ashkaBeside + Math.cos(a.t * 2.4) * 6; a.ty = HH.markY(a.target) + T.ashkaDrop + Math.sin(a.t * 3.4) * 5; }
    else { a.tx = w.jx + T.flyHome.x * 0.4 + Math.cos(a.t * 0.9) * 40 * (w.jx > 200 ? 1.6 : 1); a.ty = T.flyHome.y + Math.sin(a.t * 1.7) * 18; }
    // Near Juno, or on her way past, she aims above Juno's head, so a wing doesn't cover the lead's face or hair.
    const near = Math.abs(a.x - w.jx) < T.ashkaClearX || Math.abs(a.tx - w.jx) < T.ashkaClearX || (a.x - w.jx) * (a.tx - w.jx) < 0;
    if (near) a.ty = Math.min(a.ty, T.frontY - T.ashkaClearY);
    const k = Math.min(1, dt * 5);
    a.vx = (a.tx - a.x) * k; a.x += a.vx; a.y += (a.ty - a.y) * k;
    if (w.boss) for (const s of w.boss.shields) if (s.mark > 0) s.mark -= dt;
    if (w.boss && w.boss.krell.mark > 0) w.boss.krell.mark -= dt;
  };
  HH.markY = t => {
    const b = HH.box(t);
    return b.y0 - 8;
  };
})();
