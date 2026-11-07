// Hold the Deck: Bram in code, per bram-sheet-v3.png. Seen from behind in play (he's facing the boarders), from the front on the body icon and the title.
// Joints are in his own terms, + toward his left, so the grey (CAST.md: left shoulder and forearm at the start) lands on the right side from either view.
// Simple and tidy on purpose: a picture replaces him through Kit.art (art/REQUEST.md).
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const SKIN = '#bd7d4c', CLOTH = '#4f3b2d', BELT = '#6d4627', BOOT = '#5a3b28', IRON = '#8e949d', IRON_L = '#b4b9c2', INK_TAT = '#191316', TOWEL = '#efe8d8', BEARD = '#17131a';

  // Where the grey goes, in order. part + u = along a limb; x, y = fixed on the trunk. at = the iron at which it starts. r = its size when grown.
  const PATCHES = [
    { part: 'shL', r: 9, at: 0 }, { part: 'armLf', u: 0.5, r: 5.5, at: 0 },            // the sheet's base state
    { part: 'armLu', u: 0.5, r: 6.5, at: 0.03 }, { x: 13, y: -82, r: 6.5, at: 0.08 }, { part: 'armLf', u: 0.15, r: 5.5, at: 0.12 }, { part: 'armLf', u: 0.9, r: 5, at: 0.18 },
    { x: 12, y: -70, r: 8, at: 0.22 }, { x: 7, y: -60, r: 7, at: 0.28 }, { part: 'legLu', u: 0.3, r: 8, at: 0.34 }, { part: 'legLu', u: 0.8, r: 7.5, at: 0.4 },
    { x: 1, y: -76, r: 8, at: 0.46 }, { part: 'legLl', u: 0.4, r: 7, at: 0.5 }, { x: -6, y: -66, r: 8, at: 0.56 }, { part: 'shR', r: 8.5, at: 0.6 },
    { part: 'armRu', u: 0.5, r: 6.5, at: 0.65 }, { part: 'armRf', u: 0.4, r: 5.5, at: 0.7 }, { part: 'legRu', u: 0.4, r: 8, at: 0.74 }, { part: 'legRl', u: 0.4, r: 7, at: 0.8 },
    { x: -12, y: -74, r: 8, at: 0.84 }, { part: 'armRf', u: 0.9, r: 5, at: 0.88 }, { x: 0, y: -84, r: 5, at: 0.9 }, { x: 5, y: -92, r: 5.5, at: 0.93 }, { x: -3, y: -96, r: 5, at: 0.97 },
  ];
  const JAG = PATCHES.map((p, i) => { const r = HD.scatter(i * 31 + 5), a = []; for (let j = 0; j < 11; j++) a.push(0.72 + r() * 0.56); return a; });

  function poseJoints(o) {
    const u = o.u === undefined ? 0 : o.u, s = o.step || 0, b = Math.sin((o.t || 0) * 2) * 0.5;
    const j = { hipL: [9, -47], kneeL: [12.5, -26 - Math.max(0, s) * 4], ankL: [13.5, -7 - Math.max(0, s) * 5], hipR: [-9, -47], kneeR: [-12.5, -26 - Math.max(0, -s) * 4], ankR: [-13.5, -7 - Math.max(0, -s) * 5],
      shL: [19.5, -79 + b], elL: [26, -63 + b], haL: [27.5, -47 + b], shR: [-19.5, -79 + b], elR: [-26, -63 + b], haR: [-27.5, -47 + b], neck: [0, -85 + b], head: [0, -93 + b], lift: 0, tilt: 0, gone: 0 };
    if (o.pose === 'swing') {   // a wide sideways sweep of the hammer, which reads from behind: his right arm comes across
      const sign = o.view === 'front' ? 1 : -1, sx = sign * j.shR[0], sy = j.shR[1], an = -0.25 - 2.6 * u;
      const hand = [sx + Math.cos(an) * 30, sy + Math.sin(an) * 26];
      j.haR = [sign * hand[0], hand[1]]; j.elR = [sign * (sx + hand[0]) / 2, (sy + hand[1]) / 2 - 4];
      j.shL = [19.5, -77]; j.elL = [24, -62]; j.haL = [20, -50]; j.tilt = (u - 0.5) * 0.07;
    } else if (o.pose === 'iron') {
      j.kneeL = [16, -25]; j.ankL = [19, -7]; j.kneeR = [-16, -25]; j.ankR = [-19, -7]; j.hipL = [10, -44]; j.hipR = [-10, -44];
      j.shL = [20, -74]; j.elL = [31, -68]; j.haL = [13, -82]; j.shR = [-20, -74]; j.elR = [-31, -68]; j.haR = [-13, -82]; j.neck = [0, -80]; j.head = [0, -88];
    } else if (o.pose === 'hurt') {
      j.elL = [31, -68]; j.haL = [38, -56]; j.elR = [-31, -68]; j.haR = [-38, -56]; j.tilt = 0.08; j.head = [2, -91];
    } else if (o.pose === 'down') {
      j.hipL = [10, -26]; j.hipR = [-10, -26]; j.kneeL = [14, -6]; j.ankL = [12, -3]; j.kneeR = [-14, -6]; j.ankR = [-12, -3];
      for (const k of ['shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'neck', 'head']) j[k] = [j[k][0], j[k][1] + 22];
      j.haL = [24, -12]; j.haR = [-24, -12]; j.head = [0, -67]; j.lift = 0;
    }
    return j;
  }

  function limb(c, a, b, ra, rb, col, X, lw) { A().joined(c, [{ a: [X(a[0]), a[1]], b: [X(b[0]), b[1]], ra, rb, color: col }], lw); }
  function arm(c, sh, el, ha, skin, X, lw) {
    A().joined(c, [{ a: [X(sh[0]), sh[1]], b: [X(el[0]), el[1]], ra: 7.4, rb: 5.8, color: skin }, { a: [X(el[0]), el[1]], b: [X(ha[0]), ha[1]], ra: 5.8, rb: 4, color: skin }], lw);
    A().circle(c, X(ha[0]), ha[1], 4.6, skin, lw * 1.4);
  }

  function hammer(c, j, X, lw, o) {
    const A_ = A(), hx = X(j.haR[0]), hy = j.haR[1], ex = X(j.elR[0]), ey = j.elR[1], an = Math.atan2(hy - ey, hx - ex);
    c.save(); c.translate(hx, hy); c.rotate(an);
    A_.poly(c, [[-2, -1.6], [24, -1.6], [24, 1.6], [-2, 1.6]], '#a87a4a', lw * 1.3);
    A_.poly(c, [[20, -9], [31, -9], [31, 9], [20, 9]], '#6e727b', lw * 1.5);
    A_.poly(c, [[20, -9], [31, -9], [31, -4], [20, -4]], '#9398a2', 0);
    c.restore();
  }

  function patchesFor(c, j, o, X, lw, parts) {
    const A_ = A(), iron = o.iron || 0;
    PATCHES.forEach((p, i) => {
      if (iron < p.at || (parts && !parts.includes((p.part || '').slice(0, 4))) || (!parts && p.part && /^(arm|sh)/.test(p.part))) return;
      const seg = { armLu: ['shL', 'elL'], armLf: ['elL', 'haL'], armRu: ['shR', 'elR'], armRf: ['elR', 'haR'], legLu: ['hipL', 'kneeL'], legLl: ['kneeL', 'ankL'], legRu: ['hipR', 'kneeR'], legRl: ['kneeR', 'ankR'] }[p.part];
      let x, y;
      if (seg) { const a = j[seg[0]], b = j[seg[1]]; x = a[0] + (b[0] - a[0]) * p.u; y = a[1] + (b[1] - a[1]) * p.u; }
      else if (p.part) { x = j[p.part][0]; y = j[p.part][1]; }
      else { x = p.x; y = p.y + (j.head[1] + 93); }
      const grow = p.at === 0 ? 1 : 0.4 + 0.6 * Math.min(1, (iron - p.at) / 0.08), r = p.r * grow, pts = JAG[i].map((k, n) => { const a = n / 11 * 6.283; return [X(x) + Math.cos(a) * r * k, y + Math.sin(a) * r * k]; });
      A_.poly(c, pts, IRON, lw * 1.1);
      A_.poly(c, pts.map(q => [X(x) + (q[0] - X(x)) * 0.5 - r * 0.15, y + (q[1] - y) * 0.5 - r * 0.2]), IRON_L, 0);
    });
  }

  // o: { view: 'back'|'front', pose: 'idle'|'swing'|'iron'|'hurt'|'down', u, step, t, iron, heat }. Units: feet at 0, crown at -100.
  HD.bramFigure = function (c, o) {
    const A_ = A(), front = o.view === 'front', X = v => (front ? v : -v), j = poseJoints(o), iron = o.iron || 0, stance = o.pose === 'iron';
    const skin = stance ? '#7f858f' : (iron >= 0.8 ? HD.mix(SKIN, IRON, Math.min(1, (iron - 0.8) / 0.2)) : SKIN), lw = o.lw || 1;
    c.save();
    c.rotate(j.tilt);
    // Legs: baggy work trousers, big boots.
    for (const s of ['R', 'L']) {
      const hip = j['hip' + s], knee = j['knee' + s], ank = j['ank' + s];
      A_.joined(c, [{ a: [X(hip[0]), hip[1]], b: [X(knee[0]), knee[1]], ra: 9.6, rb: 8.2, color: CLOTH }, { a: [X(knee[0]), knee[1]], b: [X(ank[0]), ank[1]], ra: 8.2, rb: 7.2, color: CLOTH }], lw);
      A_.poly(c, [[X(knee[0]) - 5, knee[1] + 3], [X(knee[0]) + 5, knee[1] + 3], [X(knee[0]) + 5, knee[1] + 13], [X(knee[0]) - 5, knee[1] + 13]], A_.shade(CLOTH, 1.22), lw * 0.7);   // cargo pocket
      A_.poly(c, [[X(ank[0]) - 8, ank[1] - 1], [X(ank[0]) + 8, ank[1] - 1], [X(ank[0]) + 10, ank[1] + 6], [X(ank[0]) - 10, ank[1] + 6]], BOOT, lw * 1.4);
      A_.poly(c, [[X(ank[0]) - 10.5, ank[1] + 4.5], [X(ank[0]) + 10.5, ank[1] + 4.5], [X(ank[0]) + 10.5, ank[1] + 7], [X(ank[0]) - 10.5, ank[1] + 7]], '#2a1c14', 0);
    }
    // Trunk: a big V. The dungarees come up one side to the strap over his right shoulder, as on the sheet.
    const up = j.shL[1] + 79, b = stance ? 3 : 0, torso = [[X(-19.5), -80 + up], [X(19.5), -80 + up], [X(16), -60 + b], [X(13), -45], [X(-13), -45], [X(-16), -60 + b]];
    A_.poly(c, torso, skin, lw * 1.5);
    A_.poly(c, [[X(10), -80 + up], [X(19.5), -80 + up], [X(16), -60 + b], [X(13), -45], [X(5), -45], [X(12), -62]], A_.shade(skin, 0.82), 0);
    A_.poly(c, [[X(14), -45], [X(15), -56], [X(-12), -82 + up], [X(-18), -80 + up], [X(-15), -60], [X(-14), -45]], CLOTH, lw * 1.2);
    if (!front) { // tattoos across the shoulders, and the line of the back
      for (const s of [1, -1]) for (const y of [-77, -72, -67]) { c.beginPath(); c.moveTo(X(s * 4), y + up); c.quadraticCurveTo(X(s * 11), y - 5 + up, X(s * 17), y - 1 + up); c.lineWidth = 1.8; c.strokeStyle = stance ? '#5f646c' : INK_TAT; c.stroke(); }
    } else { // the anvil mark over his heart, and the chest
      const glow = o.heat ? 1 : 0.7;
      c.globalAlpha = 0.45 * glow; A_.circle(c, X(9), -71, 7.5, '#ff7a2a', 0); c.globalAlpha = 1;
      A_.poly(c, [[X(4), -74], [X(14), -74], [X(11), -71], [X(11), -68.5], [X(13), -66.5], [X(5), -66.5], [X(7), -68.5], [X(7), -71]], '#ff6a1f', 0);
    }
    // Belt with tool pouches
    A_.poly(c, [[X(-16), -50], [X(16), -50], [X(16), -44], [X(-16), -44]], BELT, lw * 1.2);
    A_.poly(c, [[X(11), -46], [X(20), -46], [X(20), -33], [X(11), -33]], BELT, lw);
    patchesFor(c, j, o, X, lw * 0.6, null);
    // Head: bald, heavy beard along the jaw, ears.
    const hx = X(j.head[0]), hy = j.head[1];
    A_.poly(c, [[X(-5.5), j.neck[1] - 2], [X(5.5), j.neck[1] - 2], [X(7.5), j.neck[1] + 5], [X(-7.5), j.neck[1] + 5]], skin, lw);
    if (front) {
      A_.ellipse(c, hx - 7.8, hy, 1.6, 2.4, skin, lw * 0.7); A_.ellipse(c, hx + 7.8, hy, 1.6, 2.4, skin, lw * 0.7);
      A_.ellipse(c, hx, hy - 1, 7.6, 8.6, skin, lw * 1.3);
      A_.poly(c, [[hx - 7.6, hy + 0], [hx - 4, hy + 2], [hx + 4, hy + 2], [hx + 7.6, hy + 0], [hx + 6, hy + 9], [hx, hy + 11], [hx - 6, hy + 9]], BEARD, lw);
      A_.poly(c, [[hx - 2, hy + 4.4], [hx + 2, hy + 4.4], [hx + 2, hy + 5.6], [hx - 2, hy + 5.6]], '#8a4f33', 0);
      A_.line(c, hx - 4.8, hy - 2.2, hx - 2, hy - 1.8, 1.1, BEARD); A_.line(c, hx + 2, hy - 1.8, hx + 4.8, hy - 2.2, 1.1, BEARD);
      A_.circle(c, hx - 3.3, hy - 0.4, 0.8, '#2c1a10', 0); A_.circle(c, hx + 3.3, hy - 0.4, 0.8, '#2c1a10', 0);
    } else {
      A_.poly(c, [[hx - 8, hy + 3], [hx + 8, hy + 3], [hx + 6, hy + 8], [hx - 6, hy + 8]], BEARD, lw);
      A_.ellipse(c, hx - 7.8, hy, 1.6, 2.4, skin, lw * 0.7); A_.ellipse(c, hx + 7.8, hy, 1.6, 2.4, skin, lw * 0.7);
      A_.ellipse(c, hx, hy - 1, 7.6, 8.4, skin, lw * 1.3);
      A_.ellipse(c, hx + 2.6, hy + 2, 4, 5, A_.shade(skin, 0.86), 0);
    }
    if (iron >= 0.9 || stance) patchesFor(c, j, Object.assign({}, o, { iron: stance ? Math.max(iron, 0.4) : iron }), X, lw * 0.6, ['']);
    // Left arm (bare, the grey starts here)
    arm(c, j.shL, j.elL, j.haL, skin, X, lw);
    patchesFor(c, j, o, X, lw * 0.6, ['armL', 'shL']);
    // Towel over his right shoulder, then the right arm and the hammer
    if (o.pose !== 'iron') {
      const ty = j.shR[1];
      A_.blob(c, [[X(-11), ty - 4], [X(-19), ty - 3], [X(-19.5), ty + 24], [X(-11), ty + 25]], TOWEL, lw * 1.2);
    }
    arm(c, j.shR, j.elR, j.haR, skin, X, lw);
    patchesFor(c, j, o, X, lw * 0.6, ['armR', 'shR']);
    if (o.pose !== 'iron' && o.pose !== 'down') hammer(c, j, X, lw, o);
    if (stance) { // the heat in the iron: cracks of orange
      c.lineWidth = 1.2; c.strokeStyle = '#ff9a4a'; c.lineCap = 'round';
      c.beginPath();
      for (const q of [[-14, -74, -6, -66], [-6, -66, -10, -56], [8, -76, 14, -66], [14, -66, 8, -58], [0, -60, 3, -50]]) { c.moveTo(q[0], q[1]); c.lineTo(q[2], q[3]); }
      c.stroke();
    }
    c.restore();
  };

  // Bram on screen at x, y (between his feet), h tall. Uses the picture for his iron grade if there is one (art/REQUEST.md), otherwise code.
  const FRAME = { idle: 0, step: 1, wind: 2, swing: 3, iron: 4, hurt: 5, down: 6 };   // back view. The front view on the body icon has two: 0 standing, 1 Iron
  HD.ironGrade = iron => (iron < 0.25 ? 0 : iron < 0.5 ? 1 : iron < 0.8 ? 2 : 3);
  HD.drawBram = function (c, run, x, y, h, o) {
    const A_ = A(), iron = o.iron === undefined ? (run ? run.carry.iron || 0 : 0) : o.iron;
    const key = 'bram_' + (o.view === 'front' ? 'front' : 'back') + '_i' + HD.ironGrade(iron);
    const fr = o.view === 'front' ? (o.pose === 'iron' ? 1 : 0) : o.pose === 'swing' ? (o.u < 0.4 ? FRAME.wind : FRAME.swing) : o.pose === 'idle' && o.step ? FRAME.step : FRAME[o.pose] || 0;
    if (A_.draw(c, key, fr, x, y, h)) return;
    c.save(); c.translate(x, y); c.scale(h / 100, h / 100);
    HD.bramFigure(c, Object.assign({ iron }, o));
    c.restore();
  };
})();
