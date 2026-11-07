// Hot Hand: Ashka (ashka-sheet-v1.png) and the small Hollow hounds of the Pit (hollow-hound-sheet-v1.png). Bold code art, baked per wing beat and per stance, for weak phones.
window.HH = window.HH || {};
(function () {
  const A = () => Kit.art;
  const RED = '#c13a22', DEEP = '#8f2618', BLACK = '#1b1518', FIRE = '#ffb33a', HOT = '#ffe46a', LEG = '#2e2a2e';

  function plume(c, x, y, len, ang) {
    const A_ = A(), ca = Math.cos(ang), sa = Math.sin(ang), p = (u, v) => [x + ca * len * u - sa * v, y + sa * len * u + ca * v];
    A_.poly(c, [p(0, -2.6), p(0.62, -4.4), p(1, 0), p(0.62, 4), p(0, 2.6)], DEEP, 1.3);
    A_.poly(c, [p(0.46, -3.8), p(1, 0), p(0.46, 3.4), p(0.6, 0)], FIRE, 0);
    A_.poly(c, [p(0.72, -1.8), p(1, 0), p(0.72, 1.6)], HOT, 0);
  }
  // One feather along an angle from a root. Long, pointed.
  function feather(c, x, y, len, ang, wide, col, lw, tip) {
    const A_ = A(), ca = Math.cos(ang), sa = Math.sin(ang), p = (u, v) => [x + ca * len * u - sa * v, y + sa * len * u + ca * v];
    A_.poly(c, [p(0, -wide * 0.5), p(0.55, -wide), p(1, 0), p(0.55, wide), p(0, wide * 0.5)], col, lw);
    if (tip) A_.poly(c, [p(0.62, -wide * 0.85), p(1, 0), p(0.62, wide * 0.85), p(0.72, 0)], tip, 0);
  }
  // A wing as on the sheet: red shoulder, a broad band of black flight feathers, red at the trailing edge with fire at the tips. flap: 1 up, -1 down.
  function wing(c, flap, far) {
    const r = far ? '#9e2e1c' : RED, k = far ? '#120e10' : BLACK, base = -2.55 - flap * 0.75 + (far ? 0.12 : 0), sx = 3, sy = -4;
    for (let i = 0; i < 7; i++) feather(c, sx - 8, sy + 2, 40 - i * 2.6, base + 0.86 - i * 0.2 + 0.0, 3.8, k, 1.2, i < 4 ? (far ? '#a03a18' : '#e8642a') : DEEP);
    for (let i = 0; i < 6; i++) feather(c, sx - 4, sy + 1, 25 - i * 1.5, base + 0.72 - i * 0.2, 3.6, DEEP, 1.1, k);
    for (let i = 0; i < 5; i++) feather(c, sx, sy, 15 - i * 0.6, base + 0.66 - i * 0.28, 3.8, r, 1.1);
  }

  function paintAshka(c, flap) {
    const A_ = A();
    // Tail plumes behind, glowing at the tips
    plume(c, -11, 3, 30, Math.PI + 0.1); plume(c, -11, 5, 36, Math.PI - 0.08); plume(c, -11, 6, 26, Math.PI - 0.3);
    wing(c, flap * 0.9, true);
    // Legs tucked back
    A_.line(c, -2, 9, -10, 14, 3, A_.INK); A_.line(c, -2, 9, -10, 14, 1.8, LEG); A_.line(c, -10, 14, -15, 12, 1.5, LEG);
    // Body: ember red, ruffled along the breast, a fierce head
    A_.poly(c, [[-14, 2], [-6, -5], [6, -7], [13, -8], [15, -3], [14, 3], [8, 8], [5, 11], [2, 8], [0, 12], [-3, 9], [-6, 11], [-9, 7]], RED, 1.7);
    A_.poly(c, [[-10, 6], [-4, 4], [6, 2], [8, 8], [5, 11], [2, 8], [0, 12], [-3, 9], [-6, 11], [-9, 7]], DEEP, 0);
    A_.poly(c, [[-14, 2], [-6, -5], [6, -7], [13, -8], [15, -3], [14, 3], [8, 8], [5, 11], [2, 8], [0, 12], [-3, 9], [-6, 11], [-9, 7]], null, 1.7);
    // Crest swept back, black with fire at the ends
    A_.poly(c, [[11, -10], [1, -18], [5, -12], [-4, -18], [3, -9], [7, -7]], BLACK, 1.3);
    A_.poly(c, [[1, -18], [5, -13], [2, -13]], FIRE, 0); A_.poly(c, [[-4, -18], [1, -12], [-2, -12]], FIRE, 0);
    // Head
    A_.poly(c, [[8, -7], [11, -12], [18, -12], [22, -8], [21, -3], [14, -1], [8, -3]], RED, 1.5);
    A_.poly(c, [[19, -11], [27, -8], [29, -3], [25, -4], [21, -4]], '#3c3a42', 1.3);
    A_.poly(c, [[19, -11], [24, -9.4], [21, -7]], '#c8bfa8', 0);
    A_.circle(c, 17, -8, 2, HOT, 0.9); A_.circle(c, 17.4, -8, 0.8, A_.INK, 0);
    A_.line(c, 13.6, -11, 19, -9.6, 1.3, A_.INK);
    wing(c, flap, false);
  }

  const PHASES = [1, 0.35, -0.8, 0.1];
  HH.drawAshka = function (c, a) {
    const A_ = A(), flip = a.vx < -0.2, f = Math.floor(a.flap * 12) % 4;
    if (A_.draw(c, 'ashka_fly', f, a.x, a.y + 16, 44, flip)) { return; }
    const b = HH.bake('ashka' + f, 110, 90, 62, 50, cc => paintAshka(cc, PHASES[f]));
    HH.stamp(c, b, a.x, a.y, flip);
  };
  // For the title, big.
  HH.drawAshkaBig = function (c, x, y, s, t) {
    const f = Math.floor(t * 8) % 4;
    const b = HH.bake('ashka' + f, 110, 90, 62, 50, cc => paintAshka(cc, PHASES[f]));
    HH.stamp(c, b, x, y, false, s);
  };

  // ---- The Hollow hound: lean grey hide, dark plates on neck, shoulder and hip, cables, blank white eye, white core in the chest. Faces right; flipped when coming from the right.
  const HIDE = '#a79e9c', HIDEDK = '#7d7674', PLATE = '#3e3c44', CABLE = '#2a282e';
  function legP(c, x, y, x2, y2, x3, y3, far) {
    const A_ = A(), col = far ? HIDEDK : HIDE;
    A_.joined(c, [{ a: [x, y], b: [x2, y2], ra: 6, rb: 3.6, color: col }, { a: [x2, y2], b: [x3, y3], ra: 3.6, rb: 2.8, color: col }, { a: [x3, y3], b: [x3 + 7, y3 + 1], ra: 3, rb: 2.4, color: col }], 1.5);
    A_.line(c, x3 + 6, y3 + 3, x3 + 10, y3 + 4, 1.3, A_.INK);
    A_.line(c, x3 + 3, y3 + 3, x3 + 7, y3 + 4.6, 1.3, A_.INK);
  }
  function plate(c, x, y, r) {
    const A_ = A(), p = [];
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i / 5 * Math.PI * 2; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r * 1.1]); }
    A_.poly(c, p, PLATE, 1.5);
    A_.poly(c, [p[0], p[1], p[2], [x, y]], A_.shade(PLATE, 0.76), 0);
    A_.poly(c, p, null, 1.5);
    p.forEach(q => A_.circle(c, q[0] * 0.8 + x * 0.2, q[1] * 0.8 + y * 0.2, 0.9, '#17151a', 0));
  }
  function paintHollow(c, stance) {
    const A_ = A(), open = stance === 'open' || stance === 'crouch', crouch = stance === 'crouch', drop = crouch ? 7 : 0;
    const leap = stance === 'leap';
    c.save();
    if (leap) c.rotate(-0.12);
    // Tail, thin, straight back
    A_.limb(c, -31, -40 + drop, -60, -44 + drop, 3, 0.8, HIDEDK, 1.3);
    // Far legs
    if (leap) { legP(c, -24, -34, -36, -20, -52, -14, true); legP(c, 22, -34, 40, -22, 50, -18, true); }
    else { legP(c, -24, -34 + drop, -30, -18 + drop * 0.5, -22, -2, true); legP(c, 24, -34 + drop, 28, -18 + drop * 0.5, 26, -2, true); }
    // Body: deep chest, hollow belly, ribs showing
    A_.blob(c, [[-34, -46 + drop], [-10, -50 + drop], [16, -50 + drop], [31, -54 + drop], [34, -38 + drop], [26, -27 + drop], [6, -26 + drop], [-14, -32 + drop], [-30, -30 + drop]], HIDE, 1.8);
    A_.blob(c, [[-30, -36 + drop], [-14, -32 + drop], [6, -26 + drop], [26, -27 + drop], [32, -34 + drop], [14, -36 + drop], [-10, -38 + drop]], HIDEDK, 0);
    for (let i = 0; i < 4; i++) A_.line(c, -4 + i * 6, -46 + drop, -8 + i * 6, -33 + drop, 1, '#6a6462');
    // Neck and head
    A_.poly(c, [[20, -48 + drop], [33, -67 + drop], [42, -65 + drop], [36, -38 + drop]], HIDE, 1.6);
    A_.poly(c, [[33, -67 + drop], [42, -74 + drop], [58, -63 + drop], [59, -59 + drop], [44, -56 + drop], [36, -58 + drop]], HIDE, 1.6);
    A_.poly(c, [[34, -68 + drop], [32, -86 + drop], [41, -71 + drop]], HIDE, 1.5); A_.poly(c, [[35, -71 + drop], [34, -81 + drop], [39, -71 + drop]], PLATE, 0);
    A_.circle(c, 58.5, -60.5 + drop, 1.7, A_.INK, 0);
    A_.poly(c, [[43, -66.5 + drop], [50, -65 + drop], [44, -63.5 + drop]], '#ffffff', 0.9);   // the blank white eye
    A_.line(c, 44, -56 + drop, 56, -58.5 + drop, 1, '#4a4444');
    plate(c, 26, -60 + drop, 8); plate(c, 19, -49 + drop, 8.5);
    // Cables, heavy, from core to shoulder and belly
    c.lineCap = 'round'; c.strokeStyle = CABLE; c.lineWidth = 2;
    c.beginPath(); c.moveTo(30, -36 + drop); c.quadraticCurveTo(18, -40 + drop, 6, -33 + drop); c.quadraticCurveTo(-8, -28 + drop, -20, -40 + drop); c.stroke();
    c.beginPath(); c.moveTo(30, -37 + drop); c.quadraticCurveTo(30, -48 + drop, 26, -54 + drop); c.stroke();
    // Near legs
    if (leap) { legP(c, -22, -36, -38, -26, -56, -22); legP(c, 20, -34, 36, -28, 52, -28); }
    else { legP(c, -22, -36 + drop, -18, -20 + drop * 0.5, -28, -2); legP(c, 18, -34 + drop, 16, -18 + drop * 0.5, 18, -2); }
    plate(c, -24, -44 + drop, 11); plate(c, 12, -41 + drop, 11);
    // The chest: plates shut over the core, or parted around it
    if (open) {
      A_.circle(c, 31, -36 + drop, 11, 'rgba(255,255,255,.28)', 0);
      A_.poly(c, [[22, -30 + drop], [18, -42 + drop], [25, -46 + drop], [27, -38 + drop]], PLATE, 1.3);
      A_.poly(c, [[39, -30 + drop], [42, -42 + drop], [36, -46 + drop], [35, -38 + drop]], PLATE, 1.3);
      A_.circle(c, 31, -36 + drop, 7, '#ffffff', 1.6);
    } else {
      A_.poly(c, [[23, -44 + drop], [39, -44 + drop], [40, -30 + drop], [31, -24 + drop], [22, -30 + drop]], PLATE, 1.5);
      A_.line(c, 31, -44 + drop, 31, -25 + drop, 1.3, '#17151a');
    }
    c.restore();
  }
  const FRAMES = { bound: 'leap', open: 'open', tell: 'crouch', rest: 'open' };
  HH.drawHollow = function (c, f, t) {
    const A_ = A(), flip = f.side > 0, stance = f.state === 'bound' ? 'leap' : FRAMES[f.state] || 'open', k = f.s * 0.8;
    const hop = f.state === 'bound' ? Math.sin(Math.min(1, f.t / TUNE.hollowBound) * Math.PI) * 26 * f.s : 0;
    const key = 'hollow_' + (stance === 'leap' ? 'leap' : stance === 'crouch' ? 'crouch' : 'open');
    const body = o => { if (!A_.draw(o, key, 0, f.x, f.y - hop, 70 * f.s, flip)) HH.stamp(o, HH.bake('hollow' + stance, 170, 120, 90, 106, cc => paintHollow(cc, stance)), f.x, f.y - hop, flip, k); };
    body(c);
    if (f.flash > 0) HH.flashFigure(c, f.x - 110 * f.s, f.y - hop - 110 * f.s, 220 * f.s, 125 * f.s, body);
  };
  HH.drawHollowDown = function (c, b) {
    const k = b.s * 0.8, p = HH.bake('hollowopen', 170, 120, 90, 106, cc => paintHollow(cc, 'open'));
    c.save(); c.translate(b.x, b.y - 10); c.rotate((b.side > 0 ? -1 : 1) * 0.5); c.translate(-b.x, -b.y); HH.stamp(c, p, b.x, b.y, b.side > 0, k); c.restore();
  };
})();
