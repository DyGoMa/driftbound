// Page layouts for the Driftbound manga. Works in the browser and in node (tools/manga-check.js).
// Each panel is a polygon of [x, y] points on a page 100 wide and 150 tall, listed in reading order:
// the book reads right to left, so panel 1 is at the top right. The reader mirrors these for left-to-right reading.
(function (root) {
  const R = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const M = 3, W = 94, H = 144;           // page margin, usable width and height
  const G = 1.6;                          // gap between panels
  // Rows: each row is [height share, [panel width shares, in reading order, right to left]].
  function rows(spec) {
    const total = spec.reduce((s, r) => s + r[0], 0), out = [];
    const free = H - G * (spec.length - 1);
    let y = M;
    spec.forEach(([share, cols]) => {
      const h = free * share / total, sum = cols.reduce((a, b) => a + b, 0), wFree = W - G * (cols.length - 1);
      let right = M + W;
      cols.forEach(c => { const w = wFree * c / sum; out.push(R(right - w, y, w, h)); right -= w + G; });
      y += h + G;
    });
    return out;
  }
  // Slanted slices: top to bottom, with diagonal gaps. Each cut is [left edge y, right edge y].
  function slices(cuts) {
    const out = [], L = M, Rt = M + W, gap = G / 2;
    let prev = [M, M];
    cuts.concat([[M + H, M + H]]).forEach((c, i, all) => {
      const last = i === all.length - 1;
      out.push([[L, prev[0] + (i ? gap : 0)], [Rt, prev[1] + (i ? gap : 0)], [Rt, c[1] - (last ? 0 : gap)], [L, c[0] - (last ? 0 : gap)]]);
      prev = c;
    });
    return out;
  }
  const LAYOUTS = {
    full: [R(M, M, W, H)],
    spread: [R(M, M, W, H)],              // drawn across two pages by the reader
    '2h': rows([[1, [1]], [1, [1]]]),
    '2v': rows([[1, [1, 1]]]),
    '3h': rows([[1, [1]], [1, [1]], [1, [1]]]),
    '3a': rows([[3, [1]], [2, [1, 1]]]),
    '3b': rows([[2, [1, 1]], [3, [1]]]),
    '3c': [R(M + W * .5 + G / 2, M, W * .5 - G / 2, H), R(M, M, W * .5 - G / 2, H * .5 - G / 2), R(M, M + H * .5 + G / 2, W * .5 - G / 2, H * .5 - G / 2)],
    '3s': slices([[48, 62], [108, 94]]),
    '4g': rows([[1, [1, 1]], [1, [1, 1]]]),
    '4a': rows([[3, [1]], [3, [1, 1]], [3, [1]]]),
    '4b': [R(M + W * .55 + G / 2, M, W * .45 - G / 2, H), R(M, M, W * .55 - G / 2, H / 3 - G), R(M, M + H / 3, W * .55 - G / 2, H / 3 - G), R(M, M + H * 2 / 3, W * .55 - G / 2, H / 3)],
    '4s': slices([[32, 44], [74, 62], [100, 114]]),
    '4i': [R(M, M, W, H * .7), R(M + W * 2 / 3 + G / 2, M + H * .7 + G, W / 3 - G / 2, H * .3 - G), R(M + W / 3 + G / 2, M + H * .7 + G, W / 3 - G, H * .3 - G), R(M, M + H * .7 + G, W / 3 - G / 2, H * .3 - G)],
    '5a': rows([[3, [1]], [3, [1, 1]], [3, [1, 1]]]),
    '5b': rows([[3, [1, 1]], [3, [1]], [3, [1, 1]]]),
    '5c': rows([[3, [1, 1]], [3, [1, 1]], [3, [1]]]),
    '6a': rows([[1, [1, 1]], [1, [1, 1]], [1, [1, 1]]]),
    '6b': rows([[3, [1, 1]], [3, [1]], [3, [1, 1, 1]]]),
    '7a': rows([[1, [1, 1]], [1, [1, 1, 1]], [1, [1, 1]]]),
  };
  const api = { LAYOUTS, PAGE_W: 100, PAGE_H: 150 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DriftMangaLayouts = api;
})(typeof window !== 'undefined' ? window : globalThis);
