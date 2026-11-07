// Silent Cut: Hush, in code, after hush-sheet-v2.png: a big cat's body and owl wings. A pale flat owl face with a violet eye and a small hooked beak, lynx ears with black tufts,
// a dark lilac ruff and back, a pale bib, long pale legs with big clawed paws, folded wings ending in dark knife-sharp feathers, a short bobtail with a pale band and a dark tip.
// Drawn facing right in a box about 150 x 165 units, feet at (0, 0). Baked once; a picture takes over if art/sprites.js has one.
window.SC = window.SC || {};
(function () {
  const A = () => Kit.art;
  const DARK = '#544f66', LILAC = '#716b86', PALE = '#c4b9b6', WING = '#4a4559', WINGD = '#2b2938', CLAW = '#23212c', EYE = '#8a5cff';

  // A shape with a torn, furry edge, so nothing reads as smooth plastic.
  function fur(c, pts, fill, lw, amp) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1, n = Math.max(1, Math.round(len / 8));
      for (let j = 0; j < n; j++) { const u = j / n; out.push([p[0] + dx * u, p[1] + dy * u]); out.push([p[0] + dx * (u + 0.5 / n) + (dy / len) * amp - 1.5, p[1] + dy * (u + 0.5 / n) - (dx / len) * amp]); }
    }
    A().poly(c, out, fill, lw);
  }
  function blade(c, bx, by, tx, ty, wide, fill) {
    const dx = tx - bx, dy = ty - by, len = Math.hypot(dx, dy) || 1, nx = -dy / len * wide, ny = dx / len * wide;
    A().poly(c, [[bx + nx, by + ny], [bx + dx * 0.55 + nx * 0.9, by + dy * 0.55 + ny * 0.9], [tx, ty], [bx + dx * 0.5 - nx * 0.7, by + dy * 0.5 - ny * 0.7], [bx - nx, by - ny]], fill, 1.3);
  }
  function leg(c, x, near) {
    const A_ = A(), up = near ? LILAC : DARK, low = near ? PALE : A_.shade(PALE, 0.74);
    A_.limb(c, x + 2, -68, x, -30, 14, 9.5, up, 1.8, true);
    A_.limb(c, x, -34, x + 1, -8, 9.5, 8.5, low, 1.8, true);
    A_.ellipse(c, x + 6, -5, 12, 6.5, low, 1.8);
    [2, 8, 14].forEach(d => A_.poly(c, [[x + d - 1, -3], [x + d + 5, 1], [x + d - 3, 1]], CLAW, 0.8));
  }
  function head(c, hx, hy) {
    const A_ = A();
    // Tall lynx ears with black tufts
    A_.poly(c, [[hx - 15, hy - 12], [hx - 21, hy - 34], [hx - 25, hy - 48], [hx - 17, hy - 39], [hx - 14, hy - 47], [hx - 10, hy - 34], [hx - 3, hy - 17]], WINGD, 1.5);
    A_.poly(c, [[hx - 13, hy - 15], [hx - 16, hy - 29], [hx - 8, hy - 17]], PALE, 0);
    A_.poly(c, [[hx - 2, hy - 17], [hx + 1, hy - 37], [hx, hy - 50], [hx + 6, hy - 41], [hx + 11, hy - 48], [hx + 11, hy - 32], [hx + 13, hy - 14]], DARK, 1.6);
    A_.poly(c, [[hx + 2, hy - 18], [hx + 4, hy - 31], [hx + 10, hy - 17]], PALE, 0);
    // The ruff: dark lilac over the crown and down the neck
    fur(c, [[hx - 24, hy + 18], [hx - 27, hy - 2], [hx - 16, hy - 19], [hx + 4, hy - 23], [hx + 17, hy - 17], [hx + 22, hy + 2], [hx + 14, hy + 24], [hx - 6, hy + 30]], DARK, 1.8, 3.6);
    // The flat owl face: a big pale disc, one violet eye, a small hooked beak
    A_.ellipse(c, hx + 5, hy + 2, 17.5, 21, PALE, 1.8);
    A_.ellipse(c, hx + 9, hy - 3, 5.6, 6, '#17151f', 0);
    A_.ellipse(c, hx + 9.6, hy - 3, 4, 4.4, EYE, 0);
    A_.circle(c, hx + 10.4, hy - 4.6, 1.2, '#ffffff', 0);
    A_.poly(c, [[hx + 1, hy - 10], [hx + 17, hy - 6], [hx + 15, hy - 2.5], [hx + 2, hy - 6]], PALE, 0);   // a flat brow, so the stare is an owl's, not a toy's
    A_.line(c, hx + 2, hy - 6.5, hx + 16, hy - 3.4, 1.5);
    A_.poly(c, [[hx + 19, hy + 2], [hx + 27, hy + 6], [hx + 25, hy + 14], [hx + 21, hy + 10], [hx + 17, hy + 10]], '#4d4856', 1.4);
  }
  function tail(c) {
    const A_ = A();
    A_.limb(c, -46, -82, -66, -86, 11, 12, LILAC, 1.8, true);
    A_.limb(c, -68, -86, -78, -87, 12, 11, PALE, 1.8, true);
    A_.limb(c, -80, -87, -90, -88, 11, 6, WINGD, 1.8, true);
  }

  function perch(c) {
    const A_ = A();
    tail(c);
    leg(c, -30, false); leg(c, 26, false);
    // Body and neck
    fur(c, [[-52, -60], [-56, -84], [-30, -92], [0, -94], [16, -112], [40, -102], [44, -68], [30, -52], [-8, -48]], LILAC, 2, 2.6);
    fur(c, [[40, -92], [46, -68], [34, -48], [20, -46], [14, -66], [24, -90]], PALE, 0, 3);   // the pale bib
    leg(c, -40, true); leg(c, 18, true);
    // The folded wing: knife-sharp dark primaries, mid feathers, a pale bar at the shoulder
    [[-14, -74, -88, -30], [-8, -70, -78, -22], [-2, -66, -64, -18], [4, -62, -48, -20]].forEach(b => blade(c, b[0], b[1], b[2], b[3], 7, WINGD));
    for (let i = 0; i < 5; i++) blade(c, 8 - i * 9, -80 + i * 1.5, -22 - i * 8, -44 + i * 2, 8, WING);
    for (let i = 0; i < 5; i++) blade(c, 12 - i * 10, -88 + i * 1.5, -6 - i * 10, -60 + i, 7, i % 2 ? PALE : A_.shade(PALE, 0.86));
    A_.blob(c, [[16, -92], [-20, -92], [-34, -80], [-14, -74], [16, -76]], DARK, 1.6);
    head(c, 28, -112);
  }

  // Gliding: wings spread, legs trailing. flap = -1 up, 0 level, 1 down.
  function glide(c, flap) {
    const A_ = A(), tip = flap * 30;
    [[-16, -84, -104, -112 + tip], [-10, -86, -92, -128 + tip], [-4, -88, -74, -140 + tip]].forEach(b => blade(c, b[0], b[1], b[2], b[3], 8, WINGD));
    tail(c);
    A_.limb(c, -36, -62, -62, -42, 10, 7, PALE, 1.8, true); A_.limb(c, 14, -62, 2, -38, 10, 7, PALE, 1.8, true);
    fur(c, [[-52, -62], [-56, -84], [-30, -92], [0, -94], [16, -112], [40, -102], [42, -72], [26, -58], [-8, -56]], LILAC, 2, 2.6);
    fur(c, [[40, -92], [44, -72], [30, -58], [20, -58], [14, -72], [24, -90]], PALE, 0, 3);
    [[10, -86, -52, -146 + tip], [14, -84, -26, -158 + tip], [18, -82, 0, -162 + tip]].forEach(b => blade(c, b[0], b[1], b[2], b[3], 9, WINGD));
    for (let i = 0; i < 4; i++) blade(c, 14 - i * 8, -88, -8 - i * 10, -128 + tip * 0.5, 8, i % 2 ? PALE : WING);
    head(c, 30, -112);
  }

  const KEY = 0.42;   // about 160 units, ear tip to paw, comes out 66 px
  SC.drawHush = function (c, x, y, t, o = {}) {
    const fly = !!o.fly, h = o.h || 66, flip = !!o.flip;
    if (fly) { if (A().draw(c, 'hush_glide', A().frameAt('hush_glide', t), x, y, h, flip)) return; }
    else if (A().draw(c, 'hush_perch', 0, x, y, h, flip)) return;
    const frame = fly ? Math.floor(((t * 6) % 3 + 3) % 3) : -1, key = fly ? 'hg' + frame : 'hp';
    const b = SC.bake(key, 200, 140, 90, 110, cc => { cc.scale(KEY, KEY); if (fly) glide(cc, frame - 1); else perch(cc); });
    SC.stamp(c, b, x, y, flip, h / 66);
  };
})();
