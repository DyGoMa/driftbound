// Storm Run: drawing helpers. Heavy drawings are made once on a hidden canvas at double size and stamped after that, for weak phones.
window.SR = window.SR || {};
(function () {
  const baked = new Map();
  const BAKE_SCALE = 2;   // sharp at the phones' usual 2x screens

  // Draws once, stamps ever after. ox, oy = where the drawing's origin sits inside the w x h box.
  SR.bake = function (key, w, h, ox, oy, paint) {
    let b = baked.get(key);
    if (!b) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(w * BAKE_SCALE); cv.height = Math.ceil(h * BAKE_SCALE);
      const c = cv.getContext('2d');
      c.scale(BAKE_SCALE, BAKE_SCALE); c.translate(ox, oy);
      paint(c);
      b = { cv, w, h, ox, oy };
      baked.set(key, b);
    }
    return b;
  };
  SR.stamp = function (ctx, b, x, y, flip, scale) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    if (scale && scale !== 1) ctx.scale(scale, scale);
    ctx.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    ctx.restore();
  };
  // A baked strip repeated across the screen, moving at its own speed. Slightly overlapped so no seam shows.
  SR.strip = function (ctx, b, view, off, y) {
    const W = b.w;
    let x = view.left - (((off % W) + W) % W);
    for (; x < view.right; x += W - 0.5) ctx.drawImage(b.cv, x, y, W, b.h);
  };

  // A fixed scatter for scenery (never run.rng: the road's look must not change the play).
  SR.scatter = function (seed) {
    let a = seed >>> 0;
    return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  };

  // A polygon with a torn, furry edge. amp = how long the tufts are; sweep leans them backward.
  SR.fur = function (c, pts, fill, lw, amp = 3, step = 9, sweep = -2) {
    const A = Kit.art, out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
      const n = Math.max(1, Math.round(len / step)), nx = dy / len, ny = -dx / len;
      for (let j = 0; j < n; j++) {
        const u = j / n;
        out.push([p[0] + dx * u, p[1] + dy * u]);
        const m = (j + 0.5) / n, s = j % 2 ? 0.45 : 1;
        out.push([p[0] + dx * m + nx * amp * s + sweep, p[1] + dy * m + ny * amp * s]);
      }
    }
    A.poly(c, out, fill, lw);
  };

  // A jagged lightning line: ink, then colour, then a white heart. Changes each frame, for the looks only.
  SR.bolt = function (c, x1, y1, x2, y2, o = {}) {
    const n = o.n || 7, jag = o.jag || 9, pts = [[x1, y1]];
    for (let i = 1; i < n; i++) {
      const u = i / n;
      pts.push([x1 + (x2 - x1) * u + (Math.random() - 0.5) * jag * 2, y1 + (y2 - y1) * u + (Math.random() - 0.5) * jag * 2]);
    }
    pts.push([x2, y2]);
    const path = (w, col) => {
      c.beginPath();
      pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
      c.lineWidth = w; c.strokeStyle = col; c.lineJoin = 'miter'; c.lineCap = 'round'; c.stroke();
    };
    path((o.w || 2) + 2.4, Kit.art.INK);
    path((o.w || 2) + 0.6, o.color || '#f2d21b');
    path(Math.max(0.8, (o.w || 2) - 1), '#ffffff');
  };

  // Sever badge: a straight line cutting a circle (CAST.md).
  SR.badge = function (c, x, y, s) {
    const A = Kit.art;
    A.circle(c, x, y, s, null, s * 0.34, A.PAPER);
    A.poly(c, [[x - s * 1.7, y - s * 0.26], [x + s * 1.7, y - s * 0.26], [x + s * 1.7, y + s * 0.26], [x - s * 1.7, y + s * 0.26]], A.INK, 0);
  };
})();
