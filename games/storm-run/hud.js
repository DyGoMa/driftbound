// Storm Run: the arm in the corner and the rest of what's on top of play. The arm sits in the rock under the road, clear of the action.
// Base state from CAST.md: scars from hand to elbow are always there. Each Surge burns a new branch from the elbow toward the shoulder.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const SKIN = '#e4b48a', DEAD = '#8b93a8';
  const LEN = 164;   // shoulder to fingertips, px

  // The branching scar, as segments in order from elbow to shoulder. Each lights when the scars reach its share of the way up.
  const CLIMB = [
    [[74, 1], [66, -4]], [[66, -4], [60, 4]], [[60, 4], [54, -2]], [[60, 4], [58, 11]],
    [[54, -2], [46, 4]], [[46, 4], [41, -4]], [[41, -4], [38, -11]], [[46, 4], [44, 12]],
    [[41, -4], [32, 2]], [[32, 2], [26, -6]], [[32, 2], [28, 10]], [[26, -6], [18, 1]],
    [[18, 1], [13, -8]], [[18, 1], [12, 8]], [[13, -8], [7, -3]],
  ];
  const BASE = [[[132, 1], [122, -3]], [[122, -3], [115, 4]], [[115, 4], [105, -4]], [[105, -4], [96, 3]], [[96, 3], [84, -3]], [[84, -3], [74, 1]], [[105, -4], [100, -8]], [[115, 4], [111, 8]], [[84, -3], [80, -9]]];
  // The mark on the back of the hand: a jagged fork with three points (CAST.md, kaito-sheet-v8.png).
  const FORK = [[[133, 0], [139, -0.5]], [[139, -0.5], [143, -3.5]], [[143, -3.5], [145.5, -2.5]], [[145.5, -2.5], [151, -8]], [[139, -0.5], [144, 1.2]], [[144, 1.2], [147, 0]], [[147, 0], [153, 1]], [[139, -0.5], [141.5, 4]], [[141.5, 4], [145, 3.6]], [[145, 3.6], [149, 8.5]]];

  // The bare arm of a lean runner, seen from the back of the hand: shoulder, bicep and triceps, the dip of the elbow, a forearm that tapers to the wrist.
  const OUTLINE = [[-30, -19], [-8, -21], [8, -20], [20, -14], [28, -12.5], [44, -15.5], [62, -12.5], [74, -8.5], [88, -12], [108, -10], [132, -7],
    [132, 7], [110, 9], [90, 12], [76, 8.5], [60, 13], [38, 16], [20, 17.5], [-8, 21], [-30, 22]];
  const HALF = { 90: 12, 104: 10.6, 118: 9.2 };   // half the arm's thickness where each gauntlet band sits

  function clipPanel(c) {
    c.beginPath(); c.moveTo(-8, -25); c.lineTo(LEN + 10, -25); c.lineTo(LEN + 3, 24); c.lineTo(-16, 24); c.closePath();
  }

  function paintArm(c, dead) {
    const A_ = A(), skin = dead ? DEAD : SKIN, shadow = A_.shade(skin, 0.74), crease = A_.shade(skin, 0.48);
    const line = (x1, y1, qx, qy, x2, y2, lw) => { c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(qx, qy, x2, y2); c.lineWidth = lw || 1.1; c.strokeStyle = crease; c.lineCap = 'round'; c.stroke(); };
    // A close-up in a slanted frame: the arm runs off its left edge, so there's no cut end at the shoulder.
    clipPanel(c); c.fillStyle = 'rgba(12,16,38,.62)'; c.fill();
    c.save();
    clipPanel(c); c.clip();
    A_.blob(c, OUTLINE, skin, 2.2);
    // The one shadow tone, along the underside, following the muscle
    c.save();
    c.beginPath(); c.moveTo(-30, 8); c.quadraticCurveTo(0, 9, 22, 6); c.quadraticCurveTo(44, 10, 66, 5); c.quadraticCurveTo(76, 3, 88, 5); c.quadraticCurveTo(108, 5, 134, 3); c.lineTo(134, 30); c.lineTo(-30, 30); c.closePath();
    c.fillStyle = shadow;
    const clipTo = () => { const n = OUTLINE.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m0 = mid(OUTLINE[n - 1], OUTLINE[0]); const p = new Path2D(); p.moveTo(m0[0], m0[1]); for (let i = 0; i < n; i++) { const m = mid(OUTLINE[i], OUTLINE[(i + 1) % n]); p.quadraticCurveTo(OUTLINE[i][0], OUTLINE[i][1], m[0], m[1]); } p.closePath(); return p; };
    const fillPath = new Path2D(); fillPath.moveTo(-30, 8); fillPath.quadraticCurveTo(0, 9, 22, 6); fillPath.quadraticCurveTo(44, 10, 66, 5); fillPath.quadraticCurveTo(76, 3, 88, 5); fillPath.quadraticCurveTo(108, 5, 134, 3); fillPath.lineTo(134, 30); fillPath.lineTo(-30, 30); fillPath.closePath();
    c.clip(clipTo()); c.fill(fillPath);
    c.restore();
    A_.blob(c, OUTLINE, null, 2.2);
    // Muscle: the shoulder's edge, bicep from triceps, the elbow's fold, the long forearm muscle
    line(26, -12, 22, -2, 8, 5, 1.3);
    line(30, 3, 50, 7, 68, 1);
    line(44, -9, 52, -6, 60, -7, 0.9);
    line(72, -5, 77, -1, 74, 4, 1.3);
    line(84, -7, 100, -3, 124, -3);
    c.restore();
    // The hand, fingers open, thumb toward the road. Inked as one shape.
    const palm = cc => { cc.beginPath(); cc.moveTo(130, -7.4); cc.quadraticCurveTo(142, -11, 152, -10.5); cc.quadraticCurveTo(155, -4, 153.5, 9); cc.quadraticCurveTo(142, 11, 130, 7.4); cc.closePath(); };
    const finger = (y0, x1, y1, r) => ({ a: [152, y0], b: [x1, y1], ra: r + 0.3, rb: r - 0.4, color: skin, noShade: true });
    A_.joined(c, [
      { a: [134, -6], b: [142, -13.5], ra: 3.2, rb: 2.2, color: skin, noShade: true },
      { path: palm, color: skin },
      finger(-8, 167, -10, 2.4), finger(-3.2, 170, -3.8, 2.5), finger(1.6, 169, 2.2, 2.5), finger(6.4, 164, 8.4, 2.2),
    ], 1.15);
    A_.poly(c, [[131, 3], [152, 5], [153.5, 9], [142, 10.6], [131, 7]], shadow, 0);
    [-5.6, -0.8, 4].forEach(y => A_.line(c, 153, y, 158, y, 0.9, crease));
  }

  // Gauntlet: three bands with gaps, so the scars show through (Dylan's "Open bracer"), each fastened by a block clasp as on the sheet.
  function paintBands(c, dead) {
    const A_ = A(), metal = dead ? '#5d6276' : '#7b7f88', light = dead ? '#70758c' : '#b4b8bf', dark = A_.shade(metal, 0.68);
    [90, 104, 118].forEach(x => {
      const h = HALF[x];
      A_.poly(c, [[x, -h - 1], [x + 3.5, -h - 1.8], [x + 7.5, -h - 0.6], [x + 7.5, h + 0.6], [x + 3.5, h + 1.8], [x, h + 1]], metal, 1.7);
      A_.poly(c, [[x + 1, -h], [x + 6.5, -h], [x + 6.5, -h * 0.45], [x + 1, -h * 0.45]], light, 0);
      A_.poly(c, [[x + 1, h * 0.4], [x + 6.5, h * 0.4], [x + 6.5, h + 0.2], [x + 1, h + 0.6]], dark, 0);
      A_.poly(c, [[x - 1, -h - 5], [x + 8.5, -h - 5], [x + 9, -h + 2.5], [x - 1.5, -h + 2.5]], A_.shade(metal, 0.85), 1.5);
      A_.poly(c, [[x, -h - 4], [x + 7.5, -h - 4], [x + 7.5, -h - 2.4], [x, -h - 2.4]], light, 0);
      A_.circle(c, x + 3.8, -h - 0.5, 1, A_.INK, 0);
    });
  }

  function segs(c, list, col, lw) {
    c.beginPath();
    list.forEach(s => { c.moveTo(s[0][0], s[0][1]); c.lineTo(s[1][0], s[1][1]); });
    c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  }

  function drawArm(c, w, t) {
    const x = 22, y = 332, A_ = A();
    const dead = w.numb > 0, jolt = w.deadTap > 0 ? Math.sin(t * 60) * 1.6 : (w.scarFlash > 0 ? (Math.random() - 0.5) * 2 : 0);
    c.save();
    c.translate(x + jolt, y);
    c.rotate(-0.03);
    c.scale(0.92, 0.92);
    SR.stamp(c, SR.bake('arm' + (dead ? 'd' : ''), 216, 54, 22, 27, cc => paintArm(cc, dead)), 0, 0);
    // The base scars, hand to elbow
    segs(c, BASE, dead ? '#59607a' : '#c99c38', 1.3);
    // The climb
    const n = Math.round(CLIMB.length * Math.min(1, w.scar));
    if (n > 0) {
      const on = CLIMB.slice(0, n);
      if (!dead) segs(c, on, 'rgba(242,210,27,.45)', w.scarFlash > 0 ? 5 : 3.2);
      segs(c, on, dead ? '#6a7290' : '#fff2a0', 1.5);
    }
    SR.stamp(c, SR.bake('bands' + (dead ? 'd' : ''), 60, 40, -84, 22, cc => paintBands(cc, dead)), 0, 0);
    // The mark on the hand
    segs(c, FORK, A_.INK, 3.1);
    segs(c, FORK, dead ? '#59607a' : (w.surgeT > 0 ? '#ffffff' : '#f2d21b'), 1.7);
    if (dead) {
      A_.text(c, 'NUMB', LEN * 0.42, -1, { size: 22, color: '#dfe6ff', align: 'center', lw: 4 });
      A_.bar(c, 16, 16, LEN - 40, 5, w.numb / T.numbSecs, '#9fb0e8');
    }
    c.restore();
  }

  // Hits left: little forks. Skarn's Catches: wolf-grey ones.
  function drawHits(c, w) {
    const A_ = A(), x = 196, y = 326;
    const fork = (px, col) => A_.poly(c, [[px - 2, y - 11], [px + 5, y - 11], [px + 1.5, y - 2], [px + 7, y - 2], [px - 3, y + 11], [px, y + 1], [px - 6, y + 1]], col, 1.6);
    let px = x;
    for (let i = 0; i < T.hits; i++) { fork(px, i < w.hits ? A_.ORANGE : '#3a3550'); px += 17; }
    for (let i = 0; i < w.catches; i++) { fork(px, '#b9bfd4'); px += 17; }
  }

  SR.ringPrompt = function (c, x, y, t) {
    const A_ = A(), r = 18 + ((t * 2) % 1) * 22;
    c.globalAlpha = 1 - ((t * 2) % 1);
    A_.circle(c, x, y, r, null, 2.4, '#f2d21b');
    c.globalAlpha = 1;
  };

  SR.hud = function (c, run, view) {
    const A_ = A(), w = run.w, t = run.time;
    A_.hud(c, run, view);
    drawArm(c, w, t);
    drawHits(c, w);
    if (run.boss) {
      const b = w.boss, cx = view.w / 2;
      A_.text(c, 'SILT', cx - 58, 16, { size: 16, color: '#dfe2ea', align: 'right' });
      for (let i = 0; i < T.bossHits; i++) {
        const on = i < b.hp;
        A_.circle(c, cx - 40 + i * 26, 16, 9, '#3d3e48', 2);
        A_.circle(c, cx - 40 + i * 26, 16, 5, on ? '#ffffff' : '#20222e', 0);
      }
    } else if (!run.endless) {
      A_.bar(c, view.w / 2 - 90, 11, 180, 10, w.dist / run.stage.length, A_.GOLD);
      A_.text(c, Math.max(0, Math.ceil(run.stage.length - w.dist)) + ' m', view.w / 2 + 100, 16, { size: 13, color: A_.PAPER });
    } else {
      A_.text(c, Math.floor(w.dist) + ' m', view.w / 2, 16, { size: 18, color: A_.GOLD, align: 'center' });
    }
    if (run.stage.hint && t < 7) {
      c.globalAlpha = Math.min(1, 7 - t);
      // On the boss the corner talk box opens over the rock while this shows, so the hint goes up under the pips.
      if (run.boss) A_.text(c, run.stage.hint, view.w / 2, 42, { size: 13, body: true, color: A_.PAPER, lw: 3, align: 'center' });
      else A_.text(c, run.stage.hint, 190, 350, { size: 13, body: true, color: A_.PAPER, lw: 3 });
      c.globalAlpha = 1;
    }
  };
})();
