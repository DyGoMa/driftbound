// Panel geometry for the reader. Pages are drawn at a fixed logical size; everything here is in those units.
(function () {
  const PAGE_W = 800, PAGE_H = 1200, SCALE_Y = PAGE_H / 150;

  // Panel polygon in logical px. A spread is 1600 wide. Left-to-right reading mirrors x.
  function poly(layoutId, index, dir) {
    const raw = window.DriftMangaLayouts.LAYOUTS[layoutId][index];
    const w = layoutId === 'spread' ? PAGE_W * 2 : PAGE_W, sx = w / 100;
    const pts = raw.map(([x, y]) => [x * sx, y * SCALE_Y]);
    return dir === 'ltr' ? pts.map(([x, y]) => [w - x, y]) : pts;
  }
  const clip = pts => 'polygon(' + pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',') + ')';
  function bbox(pts) {
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  }
  // Left and right edge of a convex polygon at one height, or null if the height misses it.
  function rangeAt(pts, y) {
    let lo = Infinity, hi = -Infinity;
    pts.forEach((a, i) => {
      const b = pts[(i + 1) % pts.length], y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
      if (y < y0 - 0.001 || y > y1 + 0.001) return;
      if (a[1] === b[1]) { lo = Math.min(lo, a[0], b[0]); hi = Math.max(hi, a[0], b[0]); return; }
      const x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]);
      lo = Math.min(lo, x); hi = Math.max(hi, x);
    });
    return lo === Infinity ? null : [lo, hi];
  }
  // The x range that stays inside the polygon, by margin m, for the whole band y0..y1. This keeps text off a slanted edge.
  function span(pts, y0, y1, m) {
    const ys = [y0 - m, y1 + m];
    pts.forEach(p => { if (p[1] > y0 - m && p[1] < y1 + m) ys.push(p[1]); });
    let l = -Infinity, r = Infinity;
    for (const y of ys) {
      const g = rangeAt(pts, y);
      if (!g) return null;
      l = Math.max(l, g[0]); r = Math.min(r, g[1]);
    }
    l += m; r -= m;
    return r > l ? { l, r } : null;
  }
  // The biggest upright box that fits, found by sampling. Used for the art note and the faint panel number.
  const innerCache = new Map();
  function inner(pts, m) {
    const key = m + '|' + pts.join(';');
    if (innerCache.has(key)) return innerCache.get(key);
    const b = bbox(pts), N = 14;
    let best = { x: b.x + m, y: b.y + m, w: Math.max(0, b.w - 2 * m), h: 0 }, area = 0;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j <= N; j++) {
        const y0 = b.y + b.h * i / N, y1 = b.y + b.h * j / N, s = span(pts, y0, y1, m);
        if (!s) continue;
        const a = (s.r - s.l) * (y1 - y0);
        if (a > area) { area = a; best = { x: s.l, y: y0, w: s.r - s.l, h: y1 - y0 }; }
      }
    }
    innerCache.set(key, best);
    return best;
  }
  // The widest a single line of balloons can be anywhere in the panel.
  function widest(pts, m) {
    const b = bbox(pts);
    let w = 0;
    for (let y = b.y + m; y < b.y + b.h - m; y += 8) { const s = span(pts, y, y + 1, m); if (s) w = Math.max(w, s.r - s.l); }
    return w;
  }

  window.DM.geom = { PAGE_W, PAGE_H, poly, clip, bbox, span, inner, widest, rangeAt };
})();
