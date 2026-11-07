// Hot Hand: drawing Warden Krell's shield line. Steel, heavy, the Sever's mark on each shield, and in the middle of each a boiler vent: a grille that's shut, whistling, or open and glowing.
window.HH = window.HH || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  function paintShield(c, kind) {
    const A_ = A(), W = T.shieldW, H = T.shieldPlate, steel = '#8c929a', dark = '#62666e', hw = W / 2, vTop = -T.ventMid - 20, vLow = -T.ventMid + 20;
    // Chest high, so the man pushing it shows over the top. Shield stands on the ground, feet at 0.
    const body = [[-hw, -H + 8], [-hw + 10, -H], [hw - 10, -H], [hw, -H + 8], [hw, -20], [hw - 8, 0], [-hw + 8, 0], [-hw, -20]];
    A_.poly(c, body, steel, 2.6);
    A_.poly(c, [[hw - 18, -H], [hw - 10, -H], [hw, -H + 8], [hw, -20], [hw - 8, 0], [hw - 18, 0]], dark, 0);
    A_.poly(c, [[-hw + 8, -H + 3], [hw - 8, -H + 3], [hw - 8, -H + 6], [-hw + 8, -H + 6]], '#a6acb4', 0);
    A_.poly(c, body, null, 2.6);
    for (const [x, y] of [[-hw + 7, -H + 8], [hw - 7, -H + 8], [-hw + 7, -14], [hw - 7, -14]]) A_.circle(c, x, y, 2, '#3e4149', 0.9);
    A_.poly(c, [[-hw, -H + 10], [hw, -H + 10], [hw, -H + 15], [-hw, -H + 15]], '#17181f', 0);
    A_.circle(c, 0, -H + 12.5, 6, null, 2.8, '#efefe8');
    A_.poly(c, [[-hw, -H + 10], [hw, -H + 10], [hw, -H + 15], [-hw, -H + 15]], '#17181f', 0);
    // The vent's housing
    A_.poly(c, [[-20, vTop], [20, vTop], [20, vLow], [-20, vLow]], '#2a2c34', 2.2);
    if (kind === 'down') {
      A_.poly(c, [[-20, vTop], [20, vTop], [20, vLow], [-20, vLow]], '#17151a', 2.2);
      A_.line(c, -hw + 4, -H + 12, 6, vTop + 14, 2.6, A_.INK); A_.line(c, 6, vTop + 14, -8, -14, 2.6, A_.INK); A_.line(c, 6, vTop + 14, hw - 6, -H + 26, 2.6, A_.INK);
    } else if (kind !== 'open') {
      for (let i = 0; i < 5; i++) A_.poly(c, [[-18, vTop + 2 + i * 7.6], [18, vTop + 2 + i * 7.6], [18, vTop + 7 + i * 7.6], [-18, vTop + 7 + i * 7.6]], kind === 'tell' ? '#c9783a' : '#70747c', 1.1);
    }
  }
  const keyOf = k => 'shield' + k;
  HH.drawShield = function (c, s, t) {
    const A_ = A(), k = s.down ? 'down' : s.vent, b = HH.bake(keyOf(k), 100, 150, 50, 140, cc => paintShield(cc, k)), S = s.s;
    if (s.down) {
      c.save(); c.translate(s.x, s.y); c.rotate(-0.18 * Math.min(1, s.downT * 2)); c.translate(-s.x, -s.y);
      HH.stamp(c, b, s.x, s.y + 8 * S * Math.min(1, s.downT * 2), false, S);
      c.restore();
      HH.flame(c, s.x - 8 * S, s.y - 6 * S, 34 * S, t + s.i, undefined);
      HH.flame(c, s.x + 12 * S, s.y - 2 * S, 22 * S, t + s.i + 2, undefined);
      return;
    }
    // The man pushing it, head and top hand over the plate. A picture when there is one.
    if (!A_.draw(c, 'shield_man', 0, s.x + T.shieldManX * S, s.y, T.shieldH * S)) {
      A_.personFast(c, 'trooper', { x: s.x + T.shieldManX * S, y: s.y, h: T.shieldH * S, pose: 'brace', flip: true });
    }
    HH.stamp(c, b, s.x, s.y, false, S);
    const mid = s.y - T.ventMid * S, gw = 18 * S, gh = 20 * S;
    if (s.vent === 'open') { // open: hot and bright, the thing to tap
      c.fillStyle = '#ff8a2a'; c.fillRect(s.x - gw, mid - gh, gw * 2, gh * 2);
      c.fillStyle = '#ffe46a'; c.fillRect(s.x - gw * 0.66, mid - gh * 0.7, gw * 1.32, gh * 1.4);
      c.fillStyle = '#ffffff'; c.fillRect(s.x - gw * 0.3, mid - gh * 0.4, gw * 0.6, gh * 0.8);
      const u = Math.max(0, s.vt / T.ventOpen[Math.min(2, HH.bossRoundOf)]);
      A_.circle(c, s.x, mid, 26 * S + 8 * u, null, 2.6, '#ffe46a');
    } else if (s.vent === 'tell') { // whistling: steam, about to open
      for (let i = 0; i < 4; i++) { const a = ((t * 2 + i * 0.25) % 1); c.globalAlpha = (1 - a) * 0.7; A_.circle(c, s.x - 8 + i * 5, mid - gh - a * 34 * S, (3 + a * 7) * S, '#dfe6ee', 0); c.globalAlpha = 1; }
    }
    if (s.flash > 0) { c.save(); c.globalAlpha = 0.45; A_.poly(c, [[s.x - 33 * S, s.y - T.shieldPlate * S], [s.x + 33 * S, s.y - T.shieldPlate * S], [s.x + 33 * S, s.y], [s.x - 33 * S, s.y]], '#fff2b0', 0); c.restore(); }
  };
  // The pressure gauge over a shield, big. Drawn with the warnings, over everything.
  HH.drawGauge = function (c, s) {
    const need = T.ventNeed[HH.bossRoundOf], frac = s.gauge / need, gx = s.x - 26, gy = s.y - T.shieldH * s.s - 14;
    A().bar(c, gx, gy, 52, 9, frac, frac > 0.66 ? '#ff5a1e' : '#ffb33a');
  };

  HH.drawKrell = function (c, b, t) {
    const A_ = A(), k = b.krell, h = A_.heightOf('krell', T.pxPerCm), x = k.x, y = k.y;
    const key = k.down ? 'krell_down' : k.exposed ? 'krell_hurt' : b.windT > 0 ? 'krell_throw' : 'krell_stand';
    const body = o => {
      if (A_.draw(o, key, A_.frameAt(key, t), x, y, h)) return;
      if (k.down) A_.personFast(o, 'krell', { x, y, h, pose: 'hide', flip: true });
      else if (k.exposed) A_.personFast(o, 'krell', { x, y, h, pose: 'hurt', flip: true });
      else if (b.windT > 0) A_.person(o, 'krell', { x, y, h, pose: 'throw', phase: 0.1, flip: true });
      else A_.personFast(o, 'krell', { x, y, h, pose: 'brace', flip: true });
    };
    body(c);
    if (k.flash > 0) HH.flashFigure(c, x - h, y - h * 1.25, h * 2, h * 1.35, body);
    if (b.windT > 0) A_.text(c, 'QUENCH!', x, y - h - 12, { size: 18, color: '#bfe1ff', align: 'center', lw: 4 });
    if (k.exposed) {
      const u = k.exposeT / T.exposeSecs[b.round];
      A_.bar(c, x - 40, y - h - 16, 80, 8, u, A_.GOLD);
      A_.text(c, 'NOW!', x, y - h - 30, { size: 20, color: '#ffe46a', align: 'center', lw: 4 });
    }
  };
  HH.drawLine = function (c, run, t) {
    const b = run.w.boss;
    HH.bossRoundOf = b.round;
    if (b.state === 'ramTell') {
      const A_ = A(), u = b.ramT / T.ramTell;
      A_.text(c, 'CHARGE!', 330, 92, { size: 38, color: '#ff5a3a', align: 'center', lw: 5 });
      A_.bar(c, 260, 114, 140, 11, u, '#ff5a3a');
    }
  };
})();
