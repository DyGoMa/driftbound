// Silent Cut: drawing helpers. Heavy drawings are made once on a hidden canvas at double size and stamped after that, for weak phones.
window.SC = window.SC || {};
(function () {
  const baked = new Map();
  const BAKE_SCALE = 2;   // sharp at the phones' usual 2x screens

  // Draws once, stamps ever after. ox, oy = where the drawing's origin sits inside the w x h box.
  SC.bake = function (key, w, h, ox, oy, paint) {
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
  SC.stamp = function (ctx, b, x, y, flip, scale) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    if (scale && scale !== 1) ctx.scale(scale, scale);
    ctx.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    ctx.restore();
  };
  // A baked strip repeated across the screen, moving at its own speed. Slightly overlapped so no seam shows.
  SC.strip = function (ctx, b, view, off, y) {
    const W = b.w;
    let x = view.left - (((off % W) + W) % W);
    for (; x < view.right; x += W - 0.5) ctx.drawImage(b.cv, x, y, W, b.h);
  };

  // The kit's shapes with thinner ink, for props and streets only (TUNE.sceneInk). lw 0 still means no ink.
  const thin = lw => (lw === 0 ? 0 : (lw || 2) * TUNE.sceneInk);
  SC.sceneArt = Object.assign(Object.create(Kit.art), {
    poly: (c, pts, fill, lw, ink) => Kit.art.poly(c, pts, fill, thin(lw), ink),
    blob: (c, pts, fill, lw, ink) => Kit.art.blob(c, pts, fill, thin(lw), ink),
    circle: (c, x, y, r, fill, lw, ink) => Kit.art.circle(c, x, y, r, fill, thin(lw), ink),
    ellipse: (c, x, y, rx, ry, fill, lw, ink, rot) => Kit.art.ellipse(c, x, y, rx, ry, fill, thin(lw), ink, rot),
    line: (c, x1, y1, x2, y2, lw, color) => Kit.art.line(c, x1, y1, x2, y2, thin(lw), color),
    slab: (c, x, y, w, h, fill, lw) => Kit.art.slab(c, x, y, w, h, fill, thin(lw)),
    island: (c, x, y, w, h, o) => Kit.art.island(c, x, y, w, h, Object.assign({}, o, { lw: thin(o && o.lw) })),
  });

  // A fixed scatter for scenery (never run.rng: the road's look must not change the play).
  SC.scatter = function (seed) {
    let a = seed >>> 0;
    return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  };
})();
