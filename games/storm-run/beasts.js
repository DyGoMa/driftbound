// Storm Run: Skarn (art/skarn-glide.webp, from skarn-sheet-v3.png; the code version stays as the fallback) and the Hollow swooper, in code. Picture keys in art/REQUEST.md replace these when they exist.
window.SR = window.SR || {};
(function () {
  const A = () => Kit.art;
  const DARK = '#3c3f4c', SLATE = '#5a6076', PALE = '#aaa49d', CHAR = '#26272f', YEL = '#f2d21b';

  // ---- Skarn, gliding, facing right (skarn-sheet-v3.png). Origin = the middle of his body. frame 0 to 3 changes the fin's lightning and the fur.
  const SWEEP = [-1, 0.25], TUFTS = [1, 0.55, 0.8, 0.45, 0.95, 0.6];
  // Looks only: the picture's height, and how far his paws hang below x, y. Fin to paws matches the code Skarn; about 166 px nose-to-tail reach, the same room SKARN_BACK allows.
  const GLIDE_H = 72, GLIDE_BELOW = 24;
  // Traces a clockwise outline with layered fur tufts along it, all swept the same way. o.len = tuft length; o.step = spacing; o.v = sweep; o.on(nx, ny) picks which edges grow them.
  function shag(c, pts, o = {}) {
    const len = o.len || 5, step = o.step || 9, V = o.v || SWEEP, on = o.on || (() => true);
    let k = 0;
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, nx = dy / l, ny = -dx / l;
      if (!on(nx, ny)) { c.lineTo(q[0], q[1]); return; }
      const n = Math.max(1, Math.round(l / step));
      for (let j = 0; j < n; j++) {
        const ax = p[0] + dx * j / n, ay = p[1] + dy * j / n, bx = p[0] + dx * (j + 1) / n, by = p[1] + dy * (j + 1) / n, s = len * TUFTS[k++ % TUFTS.length];
        c.quadraticCurveTo(ax + (bx - ax) * 0.6 + nx * s * 0.35, ay + (by - ay) * 0.6 + ny * s * 0.35, bx + nx * s * 0.8 + V[0] * s, by + ny * s * 0.8 + V[1] * s);
        c.lineTo(bx, by);
      }
    });
    c.closePath();
  }
  const fur = (c, pts, fill, lw, o) => { A().joined(c, [{ path: cc => shag(cc, pts, o), color: fill }], lw || 0.0001); };
  // The outline of a limb along a line. pts: [x, y, half width], from the body out to the paw.
  function band(pts) {
    const up = [], dn = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = dy / l, ny = -dx / l;
      up.push([p[0] + nx * p[2], p[1] + ny * p[2]]); dn.unshift([p[0] - nx * p[2], p[1] - ny * p[2]]);
    });
    return up.concat(dn);
  }
  // A leg as the sheet has it: slate at the top, pale and furry below, into a big paw with black claws, all inked as one shape. d = 1 reaches right, -1 trails left.
  function furLeg(c, pts, splitX, d, far) {
    const A_ = A(), pale = far ? A_.shade(PALE, 0.66) : PALE, dark = far ? A_.shade(DARK, 0.8) : DARK, out = band(pts), end = pts[pts.length - 1];
    const x = end[0] + d * 3, y = end[1], o = { len: 4.5, step: 6, v: [-d, 0.3], on: (nx, ny) => ny > -0.2 };
    const pawPath = cc => { cc.beginPath(); cc.moveTo(x - 7 * d, y - 6.5); cc.quadraticCurveTo(x + 7 * d, y - 8, x + 13 * d, y - 2); cc.quadraticCurveTo(x + 15 * d, y + 3, x + 12 * d, y + 6.5); cc.lineTo(x - 6 * d, y + 6.5); cc.closePath(); };
    A_.joined(c, [{ path: cc => shag(cc, out, o), color: pale }, { path: pawPath, color: pale }], 1.1);
    [3, 7.5, 12].forEach(k => A_.poly(c, [[x + k * d, y + 3.5], [x + (k + 3.5) * d, y + 3.5], [x + (k + 7) * d, y + 10], [x + (k + 2) * d, y + 8]], CHAR, 0.8));
    // The slate of the upper leg, ending in a jagged line of fur
    c.save(); shag(c, out, o); c.clip();
    const top = pts[0], yA = top[1] - 30, yB = end[1] + 30, teeth = [];
    for (let i = 0; i <= 14; i++) teeth.push([splitX + (i % 2 ? 7 * d : -3 * d), yA + (yB - yA) * i / 14]);
    A_.poly(c, [[top[0] + 40 * -d, yA]].concat(teeth).concat([[top[0] + 40 * -d, yB]]), dark, 0);
    c.restore();
    [5.5, 10].forEach(k => A_.line(c, x + k * d, y - 2.5, x + (k + 1) * d, y + 4.5, 1.1, A_.shade(pale, 0.6)));
  }

  // The sail: curved black spines standing past a scalloped membrane, tallest behind the shoulders.
  const SPINES = [[30, -22, 34, -62, 26, -72], [15, -20, 15, -60, 8, -72], [0, -19, -2, -54, -10, -66], [-14, -17, -18, -44, -27, -55], [-28, -15, -34, -32, -43, -42], [-42, -13, -50, -22, -58, -30], [-54, -11, -62, -16, -71, -19]];
  function sail(c, f, bob, lit, dim) {
    const A_ = A(), tip = s => [s[4], s[5] + bob];
    c.beginPath(); c.moveTo(38, -22);
    SPINES.forEach((s, i) => {
      const p = tip(s), lo = 14 - i * 1.1;
      if (i === 0) { c.quadraticCurveTo(38, -50, p[0] - 1, p[1] + 6); return; }
      const q = tip(SPINES[i - 1]);
      c.quadraticCurveTo((p[0] + q[0]) / 2 + 2, (p[1] + q[1]) / 2 + lo, p[0], p[1] + 6);
    });
    c.lineTo(-66, -8); c.closePath();
    c.fillStyle = '#383a45'; c.fill();
    c.lineWidth = 1.8; c.strokeStyle = A_.INK; c.lineJoin = 'round'; c.stroke();
    SPINES.forEach(s => {
      const trace = () => { c.beginPath(); c.moveTo(s[0], s[1]); c.quadraticCurveTo(s[2], s[3] + bob, s[4], s[5] + bob); };
      trace(); c.lineWidth = 3.6; c.strokeStyle = A_.INK; c.lineCap = 'round'; c.stroke();
      trace(); c.lineWidth = 1.2; c.strokeStyle = '#5c6072'; c.stroke();
    });
    // Lightning crawling along the scallops, broken as on the sheet
    const seed = SR.scatter(31 + f * 17);
    c.beginPath();
    for (let i = 1; i < SPINES.length; i++) {
      if ((i + f) % 3 === 0) continue;
      const p = tip(SPINES[i]), q = tip(SPINES[i - 1]), lo = 12 - i * 1;
      c.moveTo(q[0] - 1, q[1] + 6);
      for (let n = 1; n <= 3; n++) { const u = n / 4; c.lineTo(q[0] + (p[0] - q[0]) * u + (seed() - 0.5) * 4, q[1] + (p[1] - q[1]) * u + lo * Math.sin(u * Math.PI) * 0.75 + 3 + (seed() - 0.5) * 6); }
      c.lineTo(p[0] + 1, p[1] + 6);
    }
    if (!dim) { c.lineWidth = 4.4; c.strokeStyle = 'rgba(242,210,27,.35)'; c.lineJoin = 'miter'; c.stroke(); }
    c.lineWidth = 2; c.strokeStyle = lit; c.stroke();
    if (!dim) { c.lineWidth = 0.8; c.strokeStyle = '#fff'; c.stroke(); }
  }

  // One lobe of the heavy forked tail: slate at the root, a jagged line, pale at the tip.
  function tailLobe(c, pts, cutX) {
    const A_ = A(), o = { len: 6, step: 8, v: [-1, 0.05] };
    A_.joined(c, [{ path: cc => shag(cc, pts, o), color: PALE }], 1.1);
    c.save(); shag(c, pts, o); c.clip();
    const teeth = [];
    for (let i = 0; i <= 8; i++) teeth.push([cutX + (i % 2 ? -7 : 3), -44 + i * 11]);
    A_.poly(c, [[0, -44]].concat(teeth).concat([[0, 44]]), DARK, 0);
    c.restore();
  }

  function paintSkarn(c, f, dim) {
    const A_ = A(), bob = [0, 1, 0, -1][f];
    const lit = dim ? '#6c7088' : YEL;
    // Far legs, behind everything
    furLeg(c, [[30, 6, 11], [50, 18, 8.5], [68, 22, 6.5], [80, 25, 6]], 54, 1, true);
    furLeg(c, [[-34, 6, 12], [-56, 18, 9], [-74, 21, 6.5], [-86, 25, 6]], -58, -1, true);
    // Tail: lower lobe, then upper
    tailLobe(c, [[-125, 28 - bob], [-104, 9 - bob], [-78, 0], [-50, -2], [-48, 10], [-74, 21], [-99, 30 - bob]], -92);
    tailLobe(c, [[-127, -24 + bob], [-104, -31 + bob], [-80, -25], [-52, -13], [-52, 3], [-80, -6], [-104, -12 + bob]], -94);
    sail(c, f, bob, lit, dim);
    // Body, a pale underside, and the shadow on the flank
    const trunk = [[-66, -8], [-40, -15], [-6, -19], [30, -22], [50, -10], [46, 8], [26, 20], [-12, 15], [-46, 14], [-68, 4]];
    fur(c, trunk, DARK, 1.2, { len: 4, step: 10, on: (nx, ny) => ny > 0 });
    fur(c, [[-40, 8], [-12, 8], [24, 12], [28, 20], [-12, 16], [-44, 14]], PALE, 0, { len: 3.4, step: 8, v: [-1, -0.5], on: (nx, ny) => ny < 0 });
    A_.poly(c, [[-58, -6], [-22, -12], [-34, 2], [-60, 4]], A_.shade(DARK, 0.8), 0);
    // Near legs, reaching fore and trailing aft
    furLeg(c, [[-22, -4, 5], [-42, 1, 15], [-64, 13, 11.5], [-84, 19, 8], [-100, 25, 7]], -72, -1, false);
    furLeg(c, [[34, 3, 13], [56, 15, 9.5], [76, 21, 7.5], [90, 25, 7]], 60, 1, false);
    // Mane: dark and long over the shoulder, a blue-grey sweep across it, a pale ruff down the chest
    const mane = [[4, -18], [24, -30], [46, -34], [64, -14], [62, 2], [48, 18], [26, 14], [8, 8], [0, -6]];
    fur(c, mane, '#454a5c', 1.2, { len: 9, step: 9, v: [-1, 0.45] });
    fur(c, [[12, -18], [28, -26], [46, -26], [44, -12], [26, -2], [12, -4]], SLATE, 0, { len: 8, step: 9, v: [-1, 0.5] });
    fur(c, [[34, -6], [56, -8], [62, 4], [50, 22], [36, 30], [24, 20], [28, 6]], PALE, 1, { len: 8, step: 8, v: [-0.7, 0.75] });
    [[40, 0, 34, 12], [50, 2, 44, 18], [32, 8, 30, 18]].forEach(l => A_.line(c, l[0], l[1], l[2], l[3], 1.1, A_.shade(PALE, 0.68)));
    // Head
    A_.poly(c, [[44, -14], [46, -36], [62, -40], [74, -32], [96, -22], [96, -16], [76, -11], [58, -7]], DARK, 1.9);
    fur(c, [[44, -26], [52, -20], [58, -10], [50, -2], [40, -8]], '#454a5c', 0, { len: 6, step: 7, v: [-1, 0.5] });
    A_.poly(c, [[52, -14], [60, -8], [76, -11], [92, -14], [74, -18], [60, -18]], PALE, 0);
    A_.poly(c, [[52, -14], [60, -8], [76, -11], [92, -14], [96, -16], [76, -11], [58, -7]], null, 1.2);
    A_.poly(c, [[92, -23], [98, -21], [97, -17], [92, -18]], A_.INK, 0);
    A_.line(c, 72, -14, 92, -16, 1.1);
    A_.poly(c, [[80, -14.6], [83, -14.8], [81.4, -8.4]], '#f5efe2', 1);
    // Ears
    A_.poly(c, [[47, -36], [42, -60], [58, -40]], DARK, 1.7); A_.poly(c, [[48.5, -38], [45, -53], [54, -40]], SLATE, 0);
    A_.poly(c, [[56, -38], [55, -62], [68, -36]], DARK, 1.7); A_.poly(c, [[58, -39], [57.5, -55], [65, -37]], SLATE, 0);
    // The angry yellow eye
    if (!dim) { c.fillStyle = 'rgba(242,210,27,.22)'; c.beginPath(); c.arc(70, -28, 5.5, 0, 7); c.fill(); }
    A_.poly(c, [[64, -30], [75, -27], [66, -25]], lit, 0.9);
    A_.poly(c, [[62, -32], [77, -28], [76, -26], [63, -29.5]], A_.INK, 0);
  }
  SR.drawSkarn = function (c, x, y, t, o = {}) {
    const f = Math.floor(t * 9) % 4, A_ = A();
    if (A_.has('skarn_glide')) {
      const fr = A_.frameAt('skarn_glide', t) % 4;
      if (!o.dim) { A_.draw(c, 'skarn_glide', fr, x, y + GLIDE_BELOW, GLIDE_H); return; }
      // The numb arm dims him: the same frame under a cold wash, which puts out the fin's lightning and the eye.
      SR.stamp(c, SR.bake('skarnDim' + fr, 190, 90, 95, 64, cc => {
        A_.draw(cc, 'skarn_glide', fr, 0, GLIDE_BELOW, GLIDE_H);
        cc.globalCompositeOperation = 'source-atop'; cc.fillStyle = 'rgba(58,68,108,.45)'; cc.fillRect(-95, -64, 190, 90);
      }), x, y);
      return;
    }
    const b = SR.bake('skarn' + f + (o.dim ? 'd' : ''), 286, 136, 144, 88, cc => paintSkarn(cc, f, o.dim));
    SR.stamp(c, b, x, y, false, 0.66);
  };

  // ---- A Hollow swooper, facing left: a stripped flyer in plates and cables, blank white eye, white core (CAST.md, Hollows).
  const HIDE = '#a39a96', PLATE = '#3d3e48';
  function paintSwoop(c, f) {
    const A_ = A(), wing = [-30, -14, 8, -6][f], tip = [-46, -22, 16, -10][f];
    // Far wing
    A_.poly(c, [[6, -6], [14 + 6, wing * 0.8 - 6], [34, tip * 0.8 - 6], [28, 4], [14, 2]], A_.shade(PLATE, 0.8), 1.5);
    // Tail, thin and long
    A_.limb(c, 18, 2, 50, 8, 3.4, 0.8, HIDE, 1.5);
    // Body
    A_.poly(c, [[-18, -8], [8, -10], [24, -2], [20, 6], [0, 11], [-16, 8]], HIDE, 1.7);
    A_.poly(c, [[-14, 7], [0, 10], [18, 6], [10, 2], [-8, 3]], A_.shade(HIDE, 0.74), 0);
    for (let i = 0; i < 3; i++) A_.line(c, 2 + i * 5, 3, 5 + i * 5, 7, 0.9, A_.shade(HIDE, 0.6));
    // Neck and head with a plated skull
    A_.limb(c, -14, -3, -28, -8, 6, 4, HIDE, 1.6);
    A_.poly(c, [[-26, -14], [-34, -13], [-48, -5], [-48, -3], [-34, -2], [-24, -4]], HIDE, 1.6);
    A_.poly(c, [[-22, -16], [-34, -14], [-40, -8], [-30, -8], [-22, -10]], PLATE, 1.3);
    A_.poly(c, [[-26, -14], [-22, -26], [-20, -12]], HIDE, 1.3);
    A_.poly(c, [[-37, -8.4], [-31, -9.4], [-32, -6.8]], '#ffffff', 0.7);
    // Open jaw line
    A_.line(c, -47, -4, -36, -3, 1);
    // Plate on the shoulder, cables, and the core on the chest
    A_.poly(c, [[-6, -11], [8, -12], [13, -4], [6, 3], [-6, 1]], PLATE, 1.5);
    c.beginPath(); c.moveTo(-10, 5); c.quadraticCurveTo(2, 0, 14, 4); c.moveTo(-10, 5); c.quadraticCurveTo(-4, -6, 2, -8);
    c.lineWidth = 1.4; c.strokeStyle = A_.INK; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(-12, 5, 7, 0, 7); c.fill();
    A_.circle(c, -12, 5, 4.2, '#ffffff', 1.4, PLATE);
    // Near wing: dark sail on ribs
    A_.poly(c, [[-4, -8], [8, wing - 8], [40, tip - 4], [30, tip * 0.5 + 6], [22, 4], [12, 2]], PLATE, 1.7);
    A_.line(c, -2, -8, 40, tip - 4, 1.4, '#6a6c78');
    A_.line(c, 4, -6, 30, tip * 0.5 + 5, 1.1, '#6a6c78');
    A_.line(c, 8, -4, 22, 3, 1.1, '#6a6c78');
  }
  SR.drawSwoop = function (c, x, y, t, tip) {
    c.save();
    c.translate(x, y); c.rotate(Math.atan(tip || 0) * -0.7);
    if (!Kit.art.draw(c, 'hollow_swoop', Kit.art.frameAt('hollow_swoop', t), 0, 28, 56)) {
      const f = Math.floor(t * 12) % 4;
      SR.stamp(c, SR.bake('swoop' + f, 120, 90, 56, 56, cc => paintSwoop(cc, f)), 0, 0, false, 1.15);
    }
    c.restore();
  };
})();
