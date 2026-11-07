// Hot Hand: drawing helpers. Heavy drawings are made once on a hidden canvas and stamped after that, for weak phones. The scenery is big, so only the stage in use is kept.
window.HH = window.HH || {};
(function () {
  const baked = new Map();
  const BAKE_SCALE = 2;   // sharp at the phones' usual 2x screens

  // Draws once, stamps ever after. ox, oy = where the drawing's origin sits inside the w x h box.
  HH.bake = function (key, w, h, ox, oy, paint, scale) {
    let b = baked.get(key);
    if (!b) {
      const s = scale || BAKE_SCALE, cv = document.createElement('canvas');
      cv.width = Math.ceil(w * s); cv.height = Math.ceil(h * s);
      const c = cv.getContext('2d');
      c.scale(s, s); c.translate(ox, oy);
      paint(c);
      b = { cv, w, h, ox, oy };
      baked.set(key, b);
    }
    return b;
  };
  HH.forget = key => baked.delete(key);
  HH.stamp = function (ctx, b, x, y, flip, scale) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    if (scale && scale !== 1) ctx.scale(scale, scale);
    ctx.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    ctx.restore();
  };
  // A hit: the figure itself goes white for a moment, the anime way, not a shape laid over it. paint(ctx) draws the figure at its place in the world; x, y, w, h is a box round it.
  let flashCv = null, flashC = null;
  HH.flashFigure = function (c, x, y, w, h, paint) {
    const s = BAKE_SCALE, W = Math.ceil(w * s), H = Math.ceil(h * s);
    if (!flashCv) { flashCv = document.createElement('canvas'); flashC = flashCv.getContext('2d'); }
    if (flashCv.width < W || flashCv.height < H) { flashCv.width = Math.max(flashCv.width, W); flashCv.height = Math.max(flashCv.height, H); }
    flashC.setTransform(1, 0, 0, 1, 0, 0); flashC.globalCompositeOperation = 'source-over'; flashC.clearRect(0, 0, W, H);
    flashC.setTransform(s, 0, 0, s, -x * s, -y * s);
    paint(flashC);
    flashC.setTransform(1, 0, 0, 1, 0, 0); flashC.globalCompositeOperation = 'source-atop'; flashC.fillStyle = '#ffffff'; flashC.fillRect(0, 0, W, H);
    c.save(); c.globalAlpha = TUNE.flashWhite; c.drawImage(flashCv, 0, 0, W, H, x, y, w, h); c.restore();
  };
  // A fixed scatter for scenery (never run.rng: the look must not change the play).
  HH.scatter = function (seed) {
    let a = seed >>> 0;
    return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  };
  // A flame shape, base at x, y, pointing up: three tongues. size = height. Flat colours, in ink. Changes with t.
  HH.flame = function (c, x, y, size, t, cols, ink) {
    const A = Kit.art, cs = cols || ['#d8401a', '#ff8a2a', '#ffe46a'], w = size * 0.42, wob = i => Math.sin(t * 13 + i * 2.4) * size * 0.07;
    const shape = (k, col, lw) => {
      const s = size * k, h = w * k;
      A.poly(c, [[x - h, y], [x - h * 1.05, y - s * 0.3], [x - h * 0.4 + wob(1), y - s * 0.56], [x - h * 0.55 + wob(2), y - s * 0.78], [x - h * 0.05 + wob(3), y - s * 0.62], [x + h * 0.1 + wob(4), y - s], [x + h * 0.5 + wob(5), y - s * 0.6], [x + h * 0.85 + wob(6), y - s * 0.68], [x + h * 1.05, y - s * 0.28], [x + h, y]], col, lw);
    };
    shape(1, cs[0], ink === false ? 0 : 1.4);
    shape(0.68, cs[1], 0);
    shape(0.36, cs[2], 0);
  };
  // The Sever's mark: a straight bar cutting a ring (CAST.md).
  HH.badge = function (c, x, y, s, ring, bar) {
    const A = Kit.art;
    A.circle(c, x, y, s, null, s * 0.42, ring || A.PAPER);
    A.poly(c, [[x - s * 1.8, y - s * 0.28], [x + s * 1.8, y - s * 0.28], [x + s * 1.8, y + s * 0.28], [x - s * 1.8, y + s * 0.28]], bar || A.INK, 0);
  };
})();
