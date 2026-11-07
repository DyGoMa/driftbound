// Hot Hand: the parts Ashmarket's streets are built from, after the island's picture (art/site/ashmarket-v1.png): dark timber, maroon gables, striped awnings, paper lanterns, smoke.
window.HH = window.HH || {};
(function () {
  const A = () => Kit.art;

  HH.sky = function (c, top, mid, low, base, y1) {
    const g = c.createLinearGradient(0, -130, 0, y1);
    g.addColorStop(0, top); g.addColorStop(0.45, mid); g.addColorStop(0.8, low); g.addColorStop(1, base);
    c.fillStyle = g; c.fillRect(-210, -130, 1060, y1 + 130);
  };
  // Flat clouds, dark above, lit below. No ink, like a painted sky.
  HH.clouds = function (c, rnd, y0, y1, n, body, lit) {
    for (let k = 0; k < n; k++) {
      const x = -200 + rnd() * 1040, y = y0 + rnd() * (y1 - y0), w = 70 + rnd() * 120, m = 4 + Math.floor(w / 28);
      for (let i = 0; i < m; i++) { const u = i / (m - 1), r = (7 + rnd() * 11) * (0.5 + Math.sin(u * Math.PI) * 0.8); A().ellipse(c, x + u * w, y - r * 0.4, r * 1.7, r, body, 0); }
      A().poly(c, [[x - 10, y], [x + w + 10, y], [x + w * 0.9, y + 5], [x + w * 0.1, y + 5]], lit, 0);
    }
  };
  HH.smoke = function (c, rnd, x, y, h, col, lit) {
    let cx = x, cy = y, r = 6;
    while (cy > y - h) { A().circle(c, cx + rnd() * 6, cy, r, col, 0); if (lit && rnd() < 0.35) A().circle(c, cx - r * 0.4, cy + r * 0.3, r * 0.5, lit, 0); cx += 2 + rnd() * 6; cy -= r * 0.8; r = Math.min(30, r * 1.12); }
  };
  HH.farIsle = function (c, x, y, w, rock, top) {
    const h = w * 0.5;
    A().poly(c, [[x, y], [x + w, y], [x + w * 0.74, y + h * 0.5], [x + w * 0.55, y + h * 0.42], [x + w * 0.44, y + h], [x + w * 0.3, y + h * 0.4], [x + w * 0.14, y + h * 0.36]], rock, 1);
    A().poly(c, [[x - 1, y - 2], [x + w + 1, y - 2], [x + w - 2, y + 3], [x + 2, y + 3]], top, 1);
  };

  // A timber house. x = left, base = where it meets the street, w, h = the wall. o: wall, frame, roof, windows, floors, gable, lit, awning, sign.
  HH.house = function (c, x, base, w, h, o = {}) {
    const A_ = A(), wall = o.wall || '#4a3430', frame = o.frame || '#241a1e', roof = o.roof || '#6d2a30', floors = o.floors || 2, top = base - h, shade = A_.shade(wall, 0.72);
    // Roof first, behind the wall's top edge
    if (o.gable !== false) {
      const rh = w * (o.pitch || 0.4), mid = x + w / 2;
      A_.poly(c, [[x - 7, top + 3], [mid, top - rh], [x + w + 7, top + 3], [x + w + 12, top + 8], [mid, top - rh + 7], [x - 12, top + 8]], roof, 1.8);
      A_.poly(c, [[x + 3, top + 3], [mid, top - rh + 9], [x + w - 3, top + 3]], A_.shade(wall, 0.82), 1.3);
      A_.line(c, mid, top - rh + 9, mid, top + 3, 1.4, frame);
      if (w > 60) { A_.poly(c, [[mid - 9, top - rh * 0.3], [mid + 9, top - rh * 0.3], [mid + 9, top - 2], [mid - 9, top - 2]], o.lit === false ? '#2a2638' : '#f0b95a', 1.3); A_.line(c, mid, top - rh * 0.3, mid, top - 2, 1, frame); }
    } else {
      A_.poly(c, [[x - 8, top - 8], [x + w + 8, top - 8], [x + w + 4, top + 2], [x - 4, top + 2]], roof, 1.8);
    }
    A_.poly(c, [[x, top], [x + w, top], [x + w, base], [x, base]], wall, 2);
    A_.poly(c, [[x + w * 0.72, top], [x + w, top], [x + w, base], [x + w * 0.72, base]], shade, 0);
    // Frame beams
    const fh = h / floors;
    for (let i = 0; i <= floors; i++) A_.line(c, x, top + fh * i, x + w, top + fh * i, 2.2, frame);
    const posts = Math.max(2, Math.round(w / 44));
    for (let i = 0; i <= posts; i++) A_.line(c, x + w * i / posts, top, x + w * i / posts, base, 1.8, frame);
    // Windows: gold where someone's in, dark where they've run
    const rnd = HH.scatter(Math.floor(x * 7 + h));
    for (let f = 0; f < floors; f++) for (let i = 0; i < posts; i++) {
      if (f === floors - 1 && o.awning) continue;
      const wx = x + w * (i + 0.28) / posts, ww = w * 0.44 / posts, wy = top + fh * (f + 0.24), wh = fh * 0.5;
      const lit = o.lit !== false && rnd() < (o.litChance === undefined ? 0.72 : o.litChance);
      A_.poly(c, [[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh]], lit ? '#f0b95a' : '#1d1b2e', 1.4);
      if (lit) A_.poly(c, [[wx, wy + wh * 0.6], [wx + ww, wy + wh * 0.6], [wx + ww, wy + wh], [wx, wy + wh]], '#d08a3a', 0);
      A_.line(c, wx + ww / 2, wy, wx + ww / 2, wy + wh, 1, frame);
    }
    if (o.awning) HH.awning(c, x + 4, base - fh + 2, w - 8, fh * 0.42, o.awning);
    if (o.door) { const dx = x + w * 0.4; A_.poly(c, [[dx, base], [dx, base - fh * 0.5], [dx + w * 0.2, base - fh * 0.5], [dx + w * 0.2, base]], '#1a1420', 1.5); }
    if (o.sign) o.sign(c, x + w / 2, base - fh - 2);
  };
  HH.awning = function (c, x, y, w, h, stripe) {
    const A_ = A(), n = Math.max(3, Math.round(w / 15)), sw = w / n;
    for (let i = 0; i < n; i++) A_.poly(c, [[x + i * sw, y], [x + (i + 1) * sw, y], [x + (i + 1) * sw + 2 - (n / 2 - i - 1) * 0, y + h], [x + i * sw + 2, y + h]], i % 2 ? '#efe6d2' : (stripe === true ? '#a92c2c' : stripe), 0);
    for (let i = 0; i < n; i++) { const px = x + i * sw + 2; c.beginPath(); c.arc(px + sw / 2, y + h, sw / 2, 0, Math.PI); c.fillStyle = i % 2 ? '#d8cdb6' : A_.shade(stripe === true ? '#a92c2c' : stripe, 0.8); c.fill(); }
    A_.poly(c, [[x, y], [x + w, y], [x + w + 2, y + h], [x + 2, y + h]], null, 1.6);
  };
  // A string of paper lanterns, sagging between two points. Glow is a flat disc: no gradients in the show's look.
  HH.lanterns = function (c, x1, y1, x2, y2, n, sag = 16) {
    const A_ = A(), pt = u => [x1 + (x2 - x1) * u, y1 + (y2 - y1) * u + Math.sin(u * Math.PI) * sag];
    c.beginPath(); for (let i = 0; i <= 16; i++) { const p = pt(i / 16); c[i ? 'lineTo' : 'moveTo'](p[0], p[1]); } c.lineWidth = 1.1; c.strokeStyle = '#1a1420'; c.stroke();
    for (let i = 1; i < n; i++) {
      const p = pt(i / n);
      A_.circle(c, p[0], p[1] + 6, 8.5, 'rgba(255,190,90,.22)', 0);
      A_.ellipse(c, p[0], p[1] + 6, 4, 5, '#ffd98a', 1.1);
      A_.ellipse(c, p[0] + 1, p[1] + 7, 2.2, 3.4, '#f3a94d', 0);
      A_.line(c, p[0], p[1], p[0], p[1] + 1.5, 1, '#1a1420');
    }
  };
  // Street: flat stone with a shadow tone, and lines that run down to Juno's corner so the lanes read. y0 = top of the street, y1 = bottom.
  HH.street = function (c, y0, y1, col, line, seed, vanishX) {
    const A_ = A(), rnd = HH.scatter(seed || 5);
    A_.poly(c, [[-210, y0], [850, y0], [850, y1], [-210, y1]], col, 0);
    A_.line(c, -210, y0, 850, y0, 2.2, A_.INK);
    A_.poly(c, [[-210, y0], [850, y0], [850, y0 + 7], [-210, y0 + 7]], A_.shade(col, 0.66), 0);
    for (let i = 0; i < 90; i++) {
      const u = rnd(), x = -200 + rnd() * 1040, y = y0 + 8 + u * u * (y1 - y0 - 8), w = 9 + u * 26, h = 2 + u * 4;
      A_.ellipse(c, x, y, w, h, rnd() < 0.5 ? A_.shade(col, 0.86) : A_.shade(col, 1.12), 0);
    }
    for (let i = -6; i < 14; i++) A_.line(c, (vanishX === undefined ? 300 : vanishX) + i * 30, y0 + 8, (vanishX === undefined ? 300 : vanishX) + (i - 2) * 118, y1 + 20, 1, line);
  };
  // Salt the stage with stuff: crates, barrels, sacks. Bold, in ink.
  HH.crates = function (c, x, y, s) {
    const A_ = A(), wood = '#7a5230';
    A_.slab(c, x - 22 * s, y - 26 * s, 44 * s, 26 * s, wood, 1.7);
    A_.line(c, x - 22 * s, y - 13 * s, x + 22 * s, y - 13 * s, 1.1, A_.INK);
    A_.slab(c, x - 10 * s, y - 44 * s, 26 * s, 18 * s, A_.shade(wood, 1.15), 1.7);
  };
  HH.barrel = function (c, x, y, s, col) {
    const A_ = A(), wood = col || '#6a4526';
    A_.blob(c, [[x - 10 * s, y], [x - 13 * s, y - 15 * s], [x - 10 * s, y - 30 * s], [x + 10 * s, y - 30 * s], [x + 13 * s, y - 15 * s], [x + 10 * s, y]], wood, 1.7);
    A_.line(c, x - 12.4 * s, y - 9 * s, x + 12.4 * s, y - 9 * s, 2, '#22202c'); A_.line(c, x - 12.4 * s, y - 21 * s, x + 12.4 * s, y - 21 * s, 2, '#22202c');
  };
  // A playing-card sign on a bracket. Plain pips, nothing from any real brand.
  HH.cardSign = function (c, x, y, s, pip) {
    const A_ = A();
    A_.line(c, x, y + 26 * s, x, y + 16 * s, 2, A_.INK);
    A_.poly(c, [[x - 11 * s, y - 16 * s], [x + 11 * s, y - 16 * s], [x + 11 * s, y + 16 * s], [x - 11 * s, y + 16 * s]], '#efe6d2', 1.8);
    if (pip === 'diamond') A_.poly(c, [[x, y - 10 * s], [x + 7 * s, y], [x, y + 10 * s], [x - 7 * s, y]], '#b32a2a', 0);
    else { A_.poly(c, [[x, y - 10 * s], [x + 8 * s, y + 2 * s], [x + 3 * s, y + 6 * s], [x + 2 * s, y + 10 * s], [x - 2 * s, y + 10 * s], [x - 3 * s, y + 6 * s], [x - 8 * s, y + 2 * s]], pip === 'heart' ? '#b32a2a' : '#17161f', 0); }
  };
  HH.dieSign = function (c, x, y, s, pips) {
    const A_ = A(), r = 13 * s;
    A_.line(c, x, y - r - 12 * s, x, y - r, 2, A_.INK);
    A_.poly(c, [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]], '#efe6d2', 2);
    A_.poly(c, [[x + r * 0.5, y - r], [x + r, y - r], [x + r, y + r], [x + r * 0.5, y + r]], '#cfc4ad', 0);
    A_.poly(c, [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]], null, 2);
    const at = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] }[pips];
    at.forEach(p => A_.circle(c, x + p[0] * r * 0.55, y + p[1] * r * 0.55, r * 0.17, '#b32a2a', 0));
  };
  // A Sever banner: grey, hanging, with the mark. They've hung these all over the market.
  HH.banner = function (c, x, y, w, h) {
    const A_ = A();
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x + w / 2, y + h - 10], [x, y + h]], '#5d6269', 1.8);
    A_.poly(c, [[x + w * 0.66, y], [x + w, y], [x + w, y + h], [x + w * 0.66, y + h - 7]], '#494d55', 0);
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x + w / 2, y + h - 10], [x, y + h]], null, 1.8);
    HH.badge(c, x + w / 2, y + h * 0.42, w * 0.2);
  };
})();
