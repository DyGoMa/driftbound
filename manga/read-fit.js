// Flows a panel's words in reading order and shrinks them a step at a time until they fit.
// Nothing is placed across a slanted edge or on top of another item: each spot is checked against the polygon.
(function () {
  const { geom: G, balloons: B } = window.DM;
  const MARGIN = 13, GAP = 8, STEP = 6, MIN_DROP = 22;   // logical px; MIN_DROP keeps each later item lower, so reading order stays clear
  const FONT_MAX = 24, FONT_MIN = 15;

  // Tries one font size and width. Returns placed items, or null if something doesn't fit.
  function flow(items, pts, font, factor, start, tight) {
    const box = G.bbox(pts), wide = G.widest(pts, MARGIN), other = start === 'right' ? 'left' : 'right';
    const maxW = Math.min(wide, Math.max(160, wide * factor));
    const placed = [], gap = tight ? 5 : GAP, drop = tight ? 10 : MIN_DROP;
    let minY = box.y + MARGIN;
    for (let i = 0; i < items.length; i++) {
      const m = B.measure(items[i], font, items[i].kind === 'sfx' ? wide : maxW, tight) || B.measure(items[i], font, wide, tight);
      if (!m) return null;
      const sides = i % 2 ? [other, start] : [start, other];
      let spot = null;
      for (let y = minY; !spot && y + m.h <= box.y + box.h - MARGIN + 0.5; y += STEP) {
        const s = G.span(pts, y, y + m.h, MARGIN);
        if (!s || s.r - s.l < m.w) continue;
        for (const side of sides) {
          const x = side === 'right' ? s.r - m.w : s.l;
          const hit = placed.some(p => x < p.x + p.m.w + gap && x + m.w + gap > p.x && y < p.y + p.m.h + gap && y + m.h + gap > p.y);
          if (!hit) { spot = { x, y }; break; }
        }
      }
      if (!spot) return null;
      placed.push({ item: items[i], m, x: spot.x, y: spot.y });
      minY = spot.y + drop;
    }
    return placed;
  }

  // The tail for an off-panel speaker runs to the nearest panel edge, and a bit past it, where the panel's clip cuts it clean.
  function offTail(p, pts) {
    const top = p.y + p.m.top, midY = top + p.m.bh / 2, g = G.rangeAt(pts, midY) || [p.x, p.x + p.m.w];
    const box = G.bbox(pts), dl = p.x - g[0], dr = g[1] - (p.x + p.m.bw), dt = top - box.y;
    const w = 13, by = p.m.top + p.m.bh / 2, bx = p.m.bw / 2;
    if (dt < dl && dt < dr) return `M${bx - w} ${by}L${bx + w} ${by}L${bx + w * 0.3} ${box.y - p.y - 10}Z`;
    if (dl < dr) return `M${bx} ${by - w}L${bx} ${by + w}L${g[0] - p.x - 10} ${by - 4}Z`;
    return `M${bx} ${by - w}L${bx} ${by + w}L${g[1] - p.x + 10} ${by - 4}Z`;
  }

  // Fits the items into the panel element, and records the result on it for the smoke test.
  function fit(panel, items, pts, start) {
    if (!items.length) { panel.dataset.fit = 'empty'; return; }
    let placed = null, used = FONT_MIN, tight = false;
    for (let font = FONT_MAX; font >= FONT_MIN && !placed; font--) {
      for (const factor of [0.62, 0.8, 1]) {
        placed = flow(items, pts, font, factor, start, false);
        if (placed) { used = font; break; }
      }
    }
    if (!placed) {   // Last try before admitting defeat: slimmer balloons, no tails, at the smallest size.
      placed = flow(items, pts, FONT_MIN, 1, start, true);
      tight = !!placed;
    }
    if (!placed) {   // Still too much for this panel. Stack it from the top anyway so no words are lost, and flag it.
      panel.dataset.overflow = '1';
      const wide = G.widest(pts, MARGIN), b = G.bbox(pts);
      let y = b.y + MARGIN;
      placed = items.map(item => {
        const m = B.measure(item, FONT_MIN, wide, true) || { w: wide, h: 40, tw: wide - 20, th: 20, bw: wide, bh: 31, tail: 0, top: 9, font: FONT_MIN };
        const s = G.span(pts, y, y + 1, MARGIN) || { l: b.x, r: b.x + b.w };
        const out = { item, m, x: start === 'right' ? s.r - m.w : s.l, y };
        y += m.h + 4;
        return out;
      });
    }
    panel.dataset.fit = used;
    if (tight) panel.dataset.tight = '1';
    const layer = panel.querySelector('.texts'), b = G.bbox(pts), mid = b.x + b.w / 2;
    placed.forEach(p => {
      const tail = p.item.kind === 'off' ? offTail(p, pts) : null;
      layer.appendChild(B.draw(p.item, p.m, Math.round(p.x), Math.round(p.y), tail, p.x + p.m.w / 2 < mid));
    });
  }

  window.DM.fit = fit;
})();
