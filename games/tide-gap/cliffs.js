// Tide Gap: the land either side of the channel. Stepped rock shelves with moss, spires and gullies, darkening into dusk away from the water. Left and right are painted apart, so they aren't a mirror.
// Painted once per palette to a hidden canvas and filled as a repeating pattern, so there's no join to show. Only as wide as this screen shows of it: a phone only ever pays for a thin strip.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const H = 600, CELL = 92, SCALE = 1.5;   // looks only: tile height; spacing of the shelves; bake scale
  const baked = new Map();

  // How far the rock's edge wanders from the wall line, down the tile. Whole waves only, so the tile's top meets its bottom.
  const edge = (y, seed) => Math.sin((y / H) * Math.PI * 2 * 5 + seed) * 5 + Math.sin((y / H) * Math.PI * 2 * 11 + seed * 2.3) * 3 + Math.sin((y / H) * Math.PI * 2 * 3 + seed * 0.7) * 3;

  function jag(rnd, cx, cy, rx, ry, n) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 0.66 + rnd() * 0.42; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    return pts;
  }

  // One shelf of rock, seen from high up: its short cliff, its top, a shadow edge, moss on it, and sometimes a clump of spires. dy lets the same shelf be drawn again past the tile's end.
  function shelf(c, A_, look, s, dy) {
    const y = s.y + dy, pts = s.pts.map(p => [p[0], p[1] + dy]);
    A_.poly(c, pts.map(p => [p[0] + 3, p[1] + 11]), A_.shade(look.wall, 0.55), 1.5);
    A_.poly(c, pts, A_.shade(look.wallHi, 0.74), 1.8);
    A_.poly(c, pts.map(p => [p[0] - 3, p[1] - 3]), look.wallHi, 0);
    A_.poly(c, pts, null, 1.8);
    s.moss.forEach(m => A_.poly(c, m.pts.map(p => [p[0], p[1] + dy]), m.hi ? look.mossHi : look.moss, 0));
    s.cracks.forEach(k => { c.beginPath(); k.forEach((p, i) => (i ? c.lineTo(p[0], p[1] + dy) : c.moveTo(p[0], p[1] + dy))); c.lineWidth = 1; c.strokeStyle = A_.INK; c.lineJoin = 'round'; c.stroke(); });
    s.spires.forEach(q => {
      const tip = [q[0] + q[4], q[1] + dy - q[2]], base = q[1] + dy;
      A_.poly(c, [[q[0] - q[3], base], tip, [q[0] + q[3], base], [q[0], base + 4]], look.rockHi, 1.5);
      A_.poly(c, [tip, [q[0] + q[3], base], [q[0], base + 4], [q[0] + q[4] * 0.3, base - q[2] * 0.3]], A_.shade(look.rockHi, 0.64), 0);
    });
    void y;
  }

  function paint(look, seed, wide) {
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(wide * SCALE); cv.height = H * SCALE;
    const c = cv.getContext('2d'), A_ = A(), rnd = TG.scatter(seed);
    c.scale(SCALE, SCALE);
    // Everything's laid out by d, the distance back from the water. The rock's edge is at the tile's right side.
    c.translate(wide, 0); c.scale(-1, 1);
    const steps = 48, line = [];
    for (let i = 0; i <= steps; i++) { const y = i / steps * H; line.push([6 + edge(y, seed), y]); }
    A_.poly(c, line.concat([[wide + 4, H + 2], [wide + 4, -2]]), look.wall, 0);
    // The shelves, on a jittered grid: never a row, never a clump
    const shelves = [];
    for (let d = 26; d < wide + CELL; d += CELL) for (let row = 0; row < Math.round(H / CELL); row++) {
      const cx = d + (rnd() - 0.5) * CELL * 0.6, cy = (row + 0.5) * (H / Math.round(H / CELL)) + (rnd() - 0.5) * CELL * 0.6, rx = 26 + rnd() * 26, ry = 16 + rnd() * 20;
      if (rnd() < 0.18) continue;
      const moss = [], cracks = [], spires = [], mn = 1 + Math.floor(rnd() * 3);
      for (let i = 0; i < mn; i++) moss.push({ pts: jag(rnd, cx + (rnd() - 0.5) * rx, cy + (rnd() - 0.6) * ry, rx * (0.3 + rnd() * 0.3), ry * (0.2 + rnd() * 0.24), 7), hi: i === 0 && rnd() < 0.5 });
      if (rnd() < 0.7) { const k = []; let px = cx + (rnd() - 0.5) * rx, py = cy - ry * 0.3; for (let i = 0; i < 4; i++) { k.push([px, py]); px += (rnd() - 0.5) * 10; py += 6 + rnd() * 6; } cracks.push(k); }
      if (rnd() < 0.34) { const n = 2 + Math.floor(rnd() * 2); for (let i = 0; i < n; i++) spires.push([cx + (i - (n - 1) / 2) * (9 + rnd() * 5), cy + (rnd() - 0.5) * 8, 12 + rnd() * 20, 5 + rnd() * 4, (rnd() - 0.5) * 3]); }
      shelves.push({ y: cy, pts: jag(rnd, cx, cy, rx, ry, 9 + Math.floor(rnd() * 3)), moss, cracks, spires });
    }
    shelves.sort((a, b) => a.y - b.y);
    // Under them, broad low benches of rock that nearly touch, so there's no flat ground between the shelves
    const benches = [], bigCell = CELL * 1.5;
    for (let d = 10; d < wide + bigCell; d += bigCell * 0.8) for (let row = 0; row < Math.round(H / bigCell); row++) {
      const cx = d + (rnd() - 0.5) * bigCell * 0.4, cy = (row + 0.5) * (H / Math.round(H / bigCell)) + (rnd() - 0.5) * bigCell * 0.4;
      benches.push({ y: cy, pts: jag(rnd, cx, cy, bigCell * 0.72, bigCell * 0.62, 11) });
    }
    benches.sort((a, b) => a.y - b.y);
    // Clip to the rock's own shape so shelves never spill into the water, and draw each past both ends of the tile so its top meets its bottom.
    c.save();
    c.beginPath(); line.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.lineTo(wide + 4, H + 2); c.lineTo(wide + 4, -2); c.closePath(); c.clip();
    const low = A_.shade(look.wallHi, 0.8), lower = A_.shade(look.wall, 0.8);
    benches.forEach((b, i) => { for (const dy of [-H, 0, H]) if (b.y + dy > -160 && b.y + dy < H + 160) { const pts = b.pts.map(p => [p[0], p[1] + dy]); A_.poly(c, pts.map(p => [p[0] + 2, p[1] + 8]), lower, 1.3); A_.poly(c, pts, i % 3 ? low : look.wall, 1.3); } });
    for (const dy of [-H, 0, H]) for (const s of shelves) if (s.y + dy > -80 && s.y + dy < H + 80) shelf(c, A_, look, s, dy);
    // Gullies
    for (let i = 0; i < Math.round(wide / 24); i++) {
      const x = 14 + rnd() * wide, y = rnd() * H;
      for (const dy of [-H, 0, H]) { c.beginPath(); c.moveTo(x, y + dy); c.lineTo(x + 10 + rnd() * 16, y + dy + (rnd() - 0.5) * 14); c.lineWidth = 1.1; c.strokeStyle = A_.INK; c.stroke(); }
    }
    // Away from the water it goes down into the dusk, so the eye stays on the channel
    const g = c.createLinearGradient(40, 0, Math.max(200, wide), 0);
    g.addColorStop(0, 'rgba(12,16,38,0)'); g.addColorStop(1, 'rgba(12,16,38,.72)');
    c.fillStyle = g; c.fillRect(0, -2, wide + 4, H + 4);
    c.restore();
    // The ink along the waterline, with foam against it
    const stroke = (lw, col, off) => { c.beginPath(); line.forEach((p, i) => (i ? c.lineTo(p[0] + off, p[1]) : c.moveTo(p[0] + off, p[1]))); c.lineWidth = lw; c.strokeStyle = col; c.lineJoin = 'round'; c.stroke(); };
    stroke(3, 'rgba(226,246,246,.5)', -3);
    stroke(2.4, A_.INK, 0);
    return { cv, wide };
  }

  function tile(look, seed, wide) {
    const key = look.wall + seed + '/' + wide;
    let b = baked.get(key);
    if (!b) { b = paint(look, seed, wide); baked.set(key, b); }
    return b;
  }

  TG.drawCliffs = function (ctx, run, view) {
    const w = run.w, look = TG.LOOKS[run.stage.look || 0], off = w.dist % H;
    // Enough width for what this screen shows, in steps, so resizing doesn't repaint for a pixel.
    const need = Math.max(T.wallL - view.left, view.right - T.wallR) + 12, wide = Math.ceil(need / 60) * 60;
    const one = (b, x, flip) => {
      ctx.save(); ctx.translate(x, off);
      if (flip) ctx.scale(-1, 1);
      ctx.scale(1 / SCALE, 1 / SCALE);
      ctx.fillStyle = TG.pattern(ctx, b.cv, 'repeat-y');
      ctx.fillRect(0, (view.top - 12 - off) * SCALE, b.cv.width, (view.bottom - view.top + 24) * SCALE);
      ctx.restore();
    };
    const left = tile(look, 53, wide), right = tile(look, 97, wide);
    one(left, T.wallL + 6 - wide, false);
    one(right, T.wallR - 6 + wide, true);
  };
})();
