// Hot Hand: flames in the air, hooks, powder carts, the barricade, Ashka's mark and the warning signs. Warnings are big on purpose: they have to read on a phone at arm's length.
window.HH = window.HH || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // A thrown flame: gets bigger and hotter with the tier. HOT HAND has a white heart.
  HH.drawShot = function (c, s, t) {
    const A_ = A(), r = [6, 9, 13, 15][s.tier] * (s.blow ? 1.5 : 1), col = HH.TIER_COLOURS[s.tier], gx = s.gx !== undefined ? s.gx : s.t.x, gy = s.gx !== undefined ? s.gy : (s.t.kind === 'proj' ? s.t.y : HH.midY(s.t));
    const an = Math.atan2(gy - s.y, gx - s.x), back = (u, v) => [s.x - Math.cos(an) * u - Math.sin(an) * v, s.y - Math.sin(an) * u + Math.cos(an) * v];
    A_.poly(c, [back(-r * 0.9, 0), back(0, -r), back(r * 1.2, -r * 0.5), back(r * 2.6, 0), back(r * 1.2, r * 0.5), back(0, r)], '#d8401a', 1.6);
    A_.poly(c, [back(-r * 0.6, 0), back(0, -r * 0.62), back(r * 1.5, 0), back(0, r * 0.62)], col, 0);
    A_.circle(c, s.x, s.y, r * 0.36, s.tier >= 3 || s.blow ? '#ffffff' : '#fff2b0', 0);
  };

  // A hook, a bolt or a quench can in the air. White-hot edge, a big ring round it: this is the thing to tap.
  HH.drawProj = function (c, p, t) {
    const A_ = A();
    if (p.doomed) return;
    const pulse = 21 + Math.sin(t * 14) * 3;
    A_.circle(c, p.x, p.y, pulse, 'rgba(255,255,255,.14)', 2.4, p.type === 'quench' ? '#bfe1ff' : '#ff5a3a');
    c.save(); c.translate(p.x, p.y); c.rotate(p.spin);
    if (p.type === 'hook') {
      c.beginPath(); c.arc(0, -4, 10, -0.5, Math.PI * 1.15); c.lineWidth = 7.5; c.strokeStyle = A_.INK; c.lineCap = 'round'; c.stroke();
      c.lineWidth = 4; c.strokeStyle = '#ffffff'; c.stroke();
      A_.line(c, 0, 6, 0, 14, 4.4, A_.INK); A_.line(c, 0, 6, 0, 14, 2.4, '#3e4149');
    } else if (p.type === 'bolt') {
      A_.poly(c, [[-14, -2.5], [8, -2.5], [8, -6], [16, 0], [8, 6], [8, 2.5], [-14, 2.5]], '#ffffff', 2);
      A_.poly(c, [[-14, -5], [-8, -2], [-8, 2], [-14, 5]], '#3e4149', 1.5);
    } else {
      A_.poly(c, [[-8, -12], [8, -12], [8, 12], [-8, 12]], '#dfe8f0', 2);
      A_.poly(c, [[2, -12], [8, -12], [8, 12], [2, 12]], '#a9b9c9', 0);
      A_.poly(c, [[-8, -12], [8, -12], [8, 12], [-8, 12]], null, 2);
      A_.poly(c, [[-8, -3], [8, -3], [8, 3], [-8, 3]], '#3a7ac0', 1.2);
      A_.poly(c, [[-4, -17], [4, -17], [4, -12], [-4, -12]], '#5d6269', 1.4);
    }
    c.restore();
  };

  // The powder cart: a two-wheeled barrow of kegs, with a fuse that spits when it's about to go.
  HH.drawCart = function (c, f, t) {
    const A_ = A(), s = f.s;
    if (A_.draw(c, 'powder_cart', 0, f.x, f.y, 66 * s, f.side > 0)) { fuse(c, f, t); return; }
    const b = HH.bake('cart', 130, 90, 65, 80, cc => {
      const wood = '#7a5230';
      A_.circle(cc, -22, -9, 11, '#3a2616', 2); A_.circle(cc, -22, -9, 3, '#c29a4a', 1.2); A_.circle(cc, 22, -9, 11, '#3a2616', 2); A_.circle(cc, 22, -9, 3, '#c29a4a', 1.2);
      A_.poly(cc, [[-40, -30], [40, -30], [36, -12], [-36, -12]], wood, 2);
      A_.poly(cc, [[-38, -19], [38, -19], [36, -12], [-36, -12]], A_.shade(wood), 0);
      A_.line(cc, 40, -30, 58, -24, 3, A_.INK);
      [-22, 0, 22].forEach((x, i) => {
        A_.blob(cc, [[x - 10, -30], [x - 13, -44], [x - 10, -58], [x + 10, -58], [x + 13, -44], [x + 10, -30]], '#5c3a20', 1.8);
        A_.line(cc, x - 12, -38, x + 12, -38, 2, '#22202c'); A_.line(cc, x - 12, -50, x + 12, -50, 2, '#22202c');
        A_.poly(cc, [[x - 7, -49], [x + 7, -49], [x + 7, -39], [x - 7, -39]], '#e0d6c0', 1);
        A_.poly(cc, [[x, -47.5], [x + 3.4, -41], [x - 3.4, -41]], '#c03020', 0);
      });
    });
    HH.stamp(c, b, f.x, f.y, f.side > 0, s);
    fuse(c, f, t);
  };
  function fuse(c, f, t) {
    const A_ = A(), s = f.s, x = f.x, y = f.y - 58 * s;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 6 * s, y - 12 * s, x - 3 * s, y - 15 * s); c.lineWidth = 2; c.strokeStyle = A_.INK; c.stroke();
    if (f.pusher || f.state === 'fuse') HH.flame(c, x - 3 * s, y - 14 * s, (f.state === 'fuse' ? 16 : 9) * s, t * 2);
  }

  // Upturned card tables, between Juno and the street. Her cover: tops toward the enemy, felt green, legs in the air.
  function table(c, dir) {
    const A_ = A();
    A_.line(c, -10 * dir, -58, -19 * dir, -74, 4, A_.INK); A_.line(c, -10 * dir, -58, -19 * dir, -74, 2.2, '#5a3a22');
    A_.line(c, -10 * dir, -14, -22 * dir, -5, 4, A_.INK); A_.line(c, -10 * dir, -14, -22 * dir, -5, 2.2, '#5a3a22');
    A_.poly(c, [[-5 * dir, 0], [-13 * dir, -3], [-13 * dir, -60], [-5 * dir, -66], [12 * dir, -66], [12 * dir, -2]].map(p => p), '#2d6a4d', 2.2);
    A_.poly(c, [[-5 * dir, 0], [-5 * dir, -66], [-13 * dir, -60], [-13 * dir, -3]], '#5a3a22', 2);
    A_.poly(c, [[3 * dir, -60], [12 * dir, -60], [12 * dir, -6], [3 * dir, -6]], '#1f5240', 0);
    A_.poly(c, [[-5 * dir, -66], [12 * dir, -66], [12 * dir, -60], [-5 * dir, -60]], '#c29a4a', 1.4);
    A_.poly(c, [[-5 * dir, -4], [12 * dir, -4], [12 * dir, 0], [-5 * dir, 0]], '#c29a4a', 1.4);
    A_.poly(c, [[-2 * dir, -40], [6 * dir, -44], [8 * dir, -33], [0, -29]], '#efe6d2', 1.1);
  }
  HH.drawCover = function (c, w) {
    const A_ = A(), one = HH.bake('coverR', 70, 90, 35, 82, cc => table(cc, 1)), other = HH.bake('coverL', 70, 90, 35, 82, cc => table(cc, -1));
    if (A_.draw(c, 'cover_table', 0, w.jx + 40, T.frontY + 3, 70)) { /* picture */ }
    else HH.stamp(c, one, w.jx + 40, T.frontY + 3);
    if (w.jx > 200) { if (!A_.draw(c, 'cover_table', 0, w.jx - 40, T.frontY + 3, 70, true)) HH.stamp(c, other, w.jx - 40, T.frontY + 3); }
    // The chips she's playing with, a stack on the ground
    [0, 1, 2].forEach(i => A_.ellipse(c, w.jx - T.chipsBack, T.frontY + T.chipsNear - i * 3, 7, 3, i % 2 ? '#efe6d2' : '#b32a2a', 1.1));
  };

  // "!" over a foe's head with a closing ring. tellLeft and tellAll say how far along it is. Big, red, on a white plate.
  HH.warnBang = function (c, x, y, u, s) {
    const A_ = A(), r = (s || 1) * 13, ring = r + 3 + (1 - u) * 15;
    A_.circle(c, x, y, ring, null, 2.4, '#ff5a3a');
    A_.circle(c, x, y, r, '#fff6e0', 2);
    A_.poly(c, [[x - 2.6 * (s || 1), y - 8.5 * (s || 1)], [x + 2.6 * (s || 1), y - 8.5 * (s || 1)], [x + 1.6 * (s || 1), y + 2.5 * (s || 1)], [x - 1.6 * (s || 1), y + 2.5 * (s || 1)]], '#d8281a', 0);
    A_.circle(c, x, y + 6 * (s || 1), 2.2 * (s || 1), '#d8281a', 0);
  };

  // Ashka's mark: a ring of flame feathers turning round the target, and an arrow straight down at it.
  HH.drawMark = function (c, t, time) {
    const A_ = A(), b = HH.box(t), x = t.x, y = b.y0 - 10, left = t.mark, blink = left < 1 && Math.floor(time * 8) % 2 === 0;
    if (blink) return;
    A_.poly(c, [[x - 11, y - 14], [x + 11, y - 14], [x + 11, y - 6], [x + 17, y - 6], [x, y + 7], [x - 17, y - 6], [x - 11, y - 6]], '#ff8a2a', 2);
    A_.poly(c, [[x - 6, y - 12], [x + 6, y - 12], [x + 6, y - 5], [x + 10, y - 5], [x, y + 3], [x - 10, y - 5], [x - 6, y - 5]], '#ffe46a', 0);
    const midY = HH.midY(t), rx = Math.max(24, (b.x1 - b.x0) * 0.52), ry = Math.max(24, (b.y1 - b.y0) * 0.56);
    for (let i = 0; i < 5; i++) {
      const a = time * 1.8 + i / 5 * Math.PI * 2, fx = x + Math.cos(a) * rx, fy = midY + Math.sin(a) * ry;
      c.save(); c.translate(fx, fy); c.rotate(a + 1.57);
      A_.poly(c, [[0, -6], [3.2, -1], [2, 3], [0, 6], [-2, 3], [-3.2, -1]], i % 2 ? '#ff8a2a' : '#ffb35a', 1.1);
      c.restore();
    }
  };
})();
