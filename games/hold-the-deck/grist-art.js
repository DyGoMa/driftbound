// Hold the Deck: Grist in code, per grist-sheet-v2.png. From behind when he charges up a lane; from the side on his button. A dome of riveted iron plates, one huge anvil horn, six stubby clawed legs.
window.HD = window.HD || {};
(function () {
  const A = () => Kit.art;
  const IRON = '#4d4c52', DARK = '#36353b', LIGHT = '#6a696f', RUST = '#a4592c', RIVET = '#8a8990', EYE = '#ff8a2a';

  const rivets = (c, list, r = 1.5) => list.forEach(q => { A().circle(c, q[0], q[1], r, RIVET, 0.7); });
  function rust(c, x, y, len) {
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 2, y + len * 0.5, x - 1, y + len);
    c.lineWidth = 1.4; c.strokeStyle = RUST; c.lineCap = 'round'; c.stroke();
  }
  function foot(c, x, y, s) {
    const A_ = A();
    A_.ellipse(c, x, y - 4 * s, 11 * s, 6 * s, DARK, 1.4);
    for (const k of [-1, 0, 1]) A_.poly(c, [[x + k * 7 * s - 3 * s, y - 3 * s], [x + k * 7 * s + 3 * s, y - 3 * s], [x + k * 8.4 * s, y + 2 * s]], '#26252a', 1);
  }

  // From behind (the sheet's rear view). Feet at 0, about 92 tall, 106 wide. leg: 0 or 1 for the gallop.
  function back(c, leg) {
    const A_ = A(), u = leg ? 1 : -1;
    // The anvil horn, peeking over the shell
    A_.poly(c, [[-5, -84], [5, -84], [8, -96], [18, -102], [-18, -102], [-8, -96]], DARK, 1.8);
    A_.poly(c, [[-18, -102], [18, -102], [14, -98], [-14, -98]], LIGHT, 0);
    // Legs: the far pair inside, the near pair big
    for (const s of [-1, 1]) {
      A_.joined(c, [{ a: [s * 22, -30], b: [s * 26, -10 + (s * u > 0 ? -6 : 0)], ra: 10, rb: 8.6, color: DARK }], 1.3);
      foot(c, s * 26, -2 + (s * u > 0 ? -6 : 0), 0.9);
      A_.joined(c, [{ a: [s * 38, -30], b: [s * 42, -8 + (s * u < 0 ? -7 : 0)], ra: 12.5, rb: 10.5, color: IRON }], 1.6);
      A_.poly(c, [[s * 32, -32], [s * 48, -32], [s * 50, -20], [s * 42, -14], [s * 33, -20]], LIGHT, 1.2);
      foot(c, s * 42, 0 + (s * u < 0 ? -7 : 0), 1.1);
    }
    // The shell, plate over plate
    A_.blob(c, [[-52, -24], [-50, -60], [-30, -86], [0, -92], [30, -86], [50, -60], [52, -24], [20, -20, 1], [0, -10, 1], [-20, -20, 1]], IRON, 2.2);
    A_.poly(c, [[10, -90], [30, -86], [50, -60], [52, -24], [20, -20], [0, -10], [8, -40]], DARK, 0);
    c.beginPath(); c.arc(0, -34, 40, Math.PI * 1.03, Math.PI * 1.97); c.lineWidth = 1.6; c.strokeStyle = A_.INK; c.stroke();
    c.beginPath(); c.arc(0, -34, 52, Math.PI * 1.06, Math.PI * 1.94); c.lineWidth = 1.2; c.stroke();
    A_.poly(c, [[-40, -34], [40, -34], [20, -20], [0, -10], [-20, -20]], A_.shade(IRON, 1.12), 1.8);
    A_.line(c, 0, -72, 0, -12, 2, A_.INK); A_.line(c, 1.4, -72, 1.4, -14, 0.9, LIGHT);
    A_.blob(c, [[-52, -24], [-50, -60], [-30, -86], [0, -92], [30, -86], [50, -60], [52, -24], [20, -20, 1], [0, -10, 1], [-20, -20, 1]], null, 2.2);
    rivets(c, [[-33, -66], [33, -66], [-18, -79], [18, -79], [-44, -46], [44, -46], [-30, -30], [30, -30], [-12, -24], [12, -24], [-8, -64], [8, -64]]);
    rust(c, -24, -74, 15); rust(c, 26, -56, 14); rust(c, -40, -40, 9);
  }

  // From the side, facing right (the sheet's side view). Feet at 0.
  function side(c, awake) {
    const A_ = A();
    for (const x of [-30, -2, 26]) {
      A_.joined(c, [{ a: [x, -30], b: [x, -8], ra: 10, rb: 8.6, color: DARK }], 1.4);
      A_.poly(c, [[x - 10, -32], [x + 10, -32], [x + 11, -18], [x, -13], [x - 11, -18]], IRON, 1.3);
      foot(c, x, 0, 1);
    }
    // The shell
    A_.blob(c, [[-54, -26], [-48, -56], [-20, -74], [12, -74], [34, -56], [40, -30], [8, -24, 1], [-30, -24, 1]], IRON, 2.2);
    A_.poly(c, [[-54, -26], [-46, -38], [38, -38], [40, -30], [8, -24], [-30, -24]], DARK, 0);
    for (const q of [[-22, -74, -30, -26], [8, -75, 2, -24]]) { c.beginPath(); c.moveTo(q[0], q[1]); c.quadraticCurveTo(q[0] - 6, -50, q[2], q[3]); c.lineWidth = 1.5; c.strokeStyle = A_.INK; c.stroke(); }
    A_.blob(c, [[-54, -26], [-48, -56], [-20, -74], [12, -74], [34, -56], [40, -30], [8, -24, 1], [-30, -24, 1]], null, 2.2);
    rivets(c, [[-38, -44], [-14, -62], [-14, -36], [16, -60], [16, -34], [30, -48]]);
    rust(c, -6, -66, 16); rust(c, 22, -56, 12);
    // Head low at the front, and the anvil horn rising forward from it
    const dip = awake ? 0 : 6;
    c.save(); c.translate(0, dip);
    A_.poly(c, [[36, -48], [40, -66], [32, -88], [44, -88], [96, -88], [64, -74], [56, -60], [54, -44]], '#3f3e44', 1.9);
    A_.poly(c, [[44, -88], [96, -88], [80, -82], [46, -82]], '#5b5a61', 0);
    A_.line(c, 58, -74, 50, -52, 1.3, RUST);
    A_.poly(c, [[34, -44], [52, -46], [60, -34], [58, -22], [46, -16], [36, -24]], IRON, 1.8);
    A_.poly(c, [[50, -22], [55, -22], [53, -8]], '#26252a', 1);
    if (awake) { c.globalAlpha = 0.4; A_.circle(c, 49, -33, 6.5, EYE, 0); c.globalAlpha = 1; A_.circle(c, 49, -33, 3, EYE, 1); A_.circle(c, 49, -33, 1.1, '#fff1d0', 0); }
    else A_.line(c, 45, -33, 53, -32, 1.6, A_.INK);
    c.restore();
  }

  HD.drawGristBack = function (c, x, y, h, t) {
    const A_ = A(), leg = Math.floor(t * 12) % 2;
    if (A_.draw(c, 'grist_charge', A_.frameAt('grist_charge', t), x, y, h)) return;
    HD.stamp(c, HD.bake('gristBack' + leg, 130, 120, 65, 110, cc => back(cc, leg)), x, y, h / 102);
  };
  HD.drawGristSide = function (c, x, y, s, awake, t) {
    const A_ = A(), h = 82 * s, breathe = awake ? 0 : Math.sin((t || 0) * 1.6) * 0.012;
    // Same scale in both pictures (fill 0.806), so the horn keeps its size as he wakes.
    if (A_.draw(c, awake ? 'grist_awake' : 'grist_sleep', 0, x, y, h)) return;
    c.save(); c.translate(x - 16 * s, y); c.scale(s, s * (1 + breathe));
    HD.stamp(c, HD.bake('gristSide' + (awake ? 1 : 0), 170, 110, 60, 100, cc => side(cc, awake)), 0, 0);
    c.restore();
  };
})();
