// Tide Gap: Vesh, per vesh-sheet-v1.png: dark navy scales in a net, a pale belly, glossy blue-grey fins, a line of gold lamps down the spine, a long snout, a great spined frill, teal eyes.
// Seen from above and behind, as the back view on the sheet. His body is a ribbon through the head's path, so it stays code whatever pictures arrive; only the head can be a picture.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const SCALE = '#2d3553', SHADOW = '#20263f', NET = '#171b30', BELLY = '#aebcd6', FIN = '#7f96c4', FIN_HI = '#c3d2ec', FIN_LO = '#566b9c', LAMP = '#ffcf5a', EYE = '#5fe8e0';
  const SEGS = 40, BEHIND = 124;   // segments; how far his tail runs past the hull's middle, px

  TG.lureGlow = () => TG.bake('lureglow', 120, 120, 60, 60, c => {
    const g = c.createRadialGradient(0, 0, 2, 0, 0, 60);
    g.addColorStop(0, 'rgba(255,214,120,.8)'); g.addColorStop(0.35, 'rgba(255,190,90,.28)'); g.addColorStop(1, 'rgba(255,170,70,0)');
    c.fillStyle = g; c.fillRect(-60, -60, 120, 120);
  });
  // One kind of lamp, the head picture's: pale hot in the middle, orange at the rim, a fine dark edge, no ring.
  const lamp = () => TG.bake('lamp', 20, 20, 10, 10, c => {
    const g = c.createRadialGradient(-0.7, -0.7, 0.3, 0, 0, 3.4);
    g.addColorStop(0, '#fff4cf'); g.addColorStop(0.55, LAMP); g.addColorStop(1, '#e8892e');
    c.beginPath(); c.arc(0, 0, 3.3, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 0.7; c.strokeStyle = 'rgba(40,24,16,.85)'; c.stroke();
  });

  // A fin like the sheet's: three dark spines, a scalloped web between them. Points out to the +x side from the body.
  const fin = () => TG.bake('fin', 44, 44, 4, 22, c => {
    const A_ = A();
    A_.poly(c, [[0, -7], [17, -18], [14, -7], [31, -4], [22, 2], [30, 15], [14, 9], [0, 8]], FIN, 1.5);
    A_.poly(c, [[0, 1], [22, 2], [30, 15], [14, 9], [0, 8]], FIN_LO, 0);
    A_.poly(c, [[3, -5], [14, -13], [12, -6]], FIN_HI, 0);
    [[0, -6, 17, -18], [0, 0, 31, -4], [0, 6, 30, 15]].forEach(s => A_.line(c, s[0], s[1], s[2], s[3], 1.4, SCALE));
  });

  // The head from above, pointing up. Long snout, swept horns, and the frill fanning out either side.
  const head = () => TG.bake('veshhead', 150, 120, 75, 72, c => {
    const A_ = A();
    const frill = s => {
      const out = [[s * 7, -16], [s * 26, -38], [s * 28, -24], [s * 48, -40], [s * 43, -22], [s * 62, -28], [s * 50, -10], [s * 66, -6], [s * 50, 4], [s * 60, 18], [s * 42, 16], [s * 44, 32], [s * 26, 22], [s * 8, 14]];
      A_.poly(c, out, FIN, 2);
      A_.poly(c, [[s * 8, 2], [s * 50, 4], [s * 60, 18], [s * 42, 16], [s * 44, 32], [s * 26, 22], [s * 8, 14]], FIN_LO, 0);
      A_.poly(c, [[s * 12, -12], [s * 30, -30], [s * 36, -22], [s * 22, -8]], FIN_HI, 0);
      [[26, -38], [48, -40], [62, -28], [66, -6], [60, 18], [44, 32]].forEach(p => A_.line(c, s * 8, 0, s * p[0], p[1], 1.5, SCALE));
    };
    frill(-1); frill(1);
    // Neck into the skull and snout, as one shape
    A_.blob(c, [[-11, 34], [-12, 8], [-15, -8], [-10, -26], [-5, -44, 1], [-2, -60], [2, -60], [5, -44, 1], [10, -26], [15, -8], [12, 8], [11, 34]], SCALE, 2.2);
    A_.poly(c, [[0, 30], [10, 30], [13, -6], [8, -26], [3, -56], [0, -56]], SHADOW, 0);
    // Horns, swept back past the frill
    [-1, 1].forEach(s => { A_.poly(c, [[s * 6, -22], [s * 13, -22], [s * 21, 12], [s * 15, -6]], '#161f3b', 1.7); });
    // Scale net on the skull
    for (let y = -36; y < 28; y += 8) A_.line(c, -6, y + 3, 0, y, 0.8, NET), A_.line(c, 6, y + 3, 0, y, 0.8, NET);
    // Eyes and the lamp chain over the crown
    [-1, 1].forEach(s => { A_.ellipse(c, s * 7.6, -25, 3.4, 2, EYE, 1.1, A_.INK, s * 0.5); A_.circle(c, s * 7.6, -25, 0.9, '#effffe', 0); });
    [-1, 1].forEach(s => A_.circle(c, s * 1.6, -52, 0.8, A_.INK, 0));
    [[0, -12], [0, -2], [0, 8], [0, 18]].forEach(p => { A_.line(c, p[0], p[1] + 3, p[0], p[1] - 2, 1.2, A_.INK); A_.circle(c, p[0], p[1] - 3, 2.8, LAMP, 1.1); });
  });

  // Where each bit of him is, this frame. Head at index 0. The path is the head's history, so the whole length follows the turn.
  TG.veshPath = function (w, t) {
    const pts = [], total = w.tow + BEHIND, headY = w.shipYNow - w.tow, delay = T.towDelay * 60 / w.tow;
    const squash = w.boss ? 1.25 : 1;
    for (let i = 0; i <= SEGS; i++) {
      const dy = (i / SEGS) * total, u = i / SEGS, idx = Math.min(w.trail.length - 1, dy * delay);
      const i0 = Math.floor(idx), f = idx - i0, tx = w.trail[i0] + (w.trail[Math.min(w.trail.length - 1, i0 + 1)] - w.trail[i0]) * f;
      const amp = (3 + 21 * Math.sin(Math.min(1, u * 1.35) * Math.PI / 2)) * squash * (u > 0.86 ? 1.25 : 1);
      const wave = Math.sin(t * 3.1 - dy * 0.029) * amp, drift = Math.sin(t * 1.3 - dy * 0.011) * amp * 0.3;
      pts.push({ x: tx + wave + drift, y: headY + dy + (w.dive.state === 'down' ? 0 : 0), u });
    }
    return pts;
  };

  // He grows out of the neck: as wide as the head picture's neck where it ends, then filling out over the first stretch.
  const NECK_END = 34, NECK_HW = 6.6, NECK_OPEN = 70;   // looks only: px from the head to the end of its neck; half the neck's width as measured on vesh-head-v1.png; px until he's full width
  function halfWidth(u, total, hasPic) {
    const body = u < 0.05 ? 12 + u * 40 : u < 0.55 ? 14 + Math.sin((u - 0.05) / 0.5 * Math.PI) * 5 : Math.max(1.5, 14 * Math.pow(1 - (u - 0.55) / 0.45, 0.7));
    if (!hasPic) return body;
    const px = u * total, k = Math.max(0, Math.min(1, (px - NECK_END) / NECK_OPEN));
    return NECK_HW + (body - NECK_HW) * k * k * (3 - 2 * k);
  }

  TG.drawVesh = function (ctx, run, dark) {
    const w = run.w, t = run.time, A_ = A(), pts = TG.veshPath(w, t), n = pts.length;
    const norms = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      return { nx: dy / l, ny: -dx / l, ang: Math.atan2(dy, dx) };
    });
    const total = w.tow + BEHIND, hasPic = A_.has('vesh_head'), first = hasPic ? Math.floor((NECK_END - 3) / (total / SEGS)) : 0;
    const hw = pts.map(p => halfWidth(p.u, total, hasPic));
    const side = s => pts.map((p, i) => [p.x + norms[i].nx * hw[i] * s, p.y + norms[i].ny * hw[i] * s]);
    const L = side(1), R = side(-1);
    if (dark) ctx.globalAlpha = 0.62;
    // Dark water under him, and the V of his wake
    ctx.save(); ctx.globalAlpha = (dark ? 0.2 : 0.3);
    A_.poly(ctx, L.map(p => [p[0] + 3, p[1] + 5]).concat(R.slice().reverse().map(p => [p[0] + 3, p[1] + 5])), '#081424', 0);
    ctx.restore();
    // Fins, under the body
    const F = fin();
    [5, 10, 15, 20, 25, 30, 34].forEach((i, k) => {
      const flap = 0.85 + Math.sin(t * 4 + k) * 0.18, size = (1.1 - i / 50);
      [1, -1].forEach(s => {
        const p = pts[i], nn = norms[i], x = p.x + nn.nx * hw[i] * s, y = p.y + nn.ny * hw[i] * s;
        ctx.save(); ctx.translate(x, y); ctx.rotate(nn.ang - Math.PI / 2 + (s > 0 ? Math.PI : 0) + s * 0.5);
        ctx.scale(size * flap, size * (s > 0 ? -1 : 1));
        ctx.drawImage(F.cv, -F.ox, -F.oy, F.w, F.h);
        ctx.restore();
      });
    });
    // The head goes first, so the body lies over the cut end of its neck.
    const ang = Math.atan2(pts[0].y - pts[first + 1].y, pts[0].x - pts[first + 1].x) + Math.PI / 2, breath = 1 + Math.sin(t * 2.2) * 0.04;
    if (!hasPic || !drawHeadPicture(ctx, pts[0], ang, t)) { const H = head(); TG.stamp(ctx, H, pts[0].x, pts[0].y, ang, breath, 1); }
    // The body: one flat shape, one shadow tone, ink down both sides and none across the neck
    const body = L.slice(first).concat(R.slice(first).reverse());
    A_.poly(ctx, body, SCALE, 0);
    // Pale belly showing on the outside of each bend, as the body rolls
    const belly = [];
    for (let i = Math.max(2, first + 4); i < n - 3; i++) {
      const roll = Math.sin(t * 3.1 - (pts[i].y - pts[0].y) * 0.029 + 1.1), next = Math.sin(t * 3.1 - (pts[i + 1].y - pts[0].y) * 0.029 + 1.1), s = roll > 0 ? 1 : -1, wid = Math.abs(roll) * hw[i] * 0.42;
      if (wid > 1) belly.push([next * s > 0 ? Math.abs(next) * hw[i + 1] * 0.42 : 0, s, wid, i]);
    }
    for (const b of belly) {
      const i = b[3], s = b[1], nn = norms[i], mm = norms[i + 1], p = pts[i], q = pts[i + 1], h = hw[i], h2 = hw[i + 1];
      A_.poly(ctx, [[p.x + nn.nx * s * h, p.y + nn.ny * s * h], [q.x + mm.nx * s * h2, q.y + mm.ny * s * h2], [q.x + mm.nx * s * (h2 - b[0]), q.y + mm.ny * s * (h2 - b[0])], [p.x + nn.nx * s * (h - b[2]), p.y + nn.ny * s * (h - b[2])]], BELLY, 0.01, BELLY);
    }
    // Shadow down one side
    const sh = [];
    for (let i = first; i < n; i++) sh.push([pts[i].x - norms[i].nx * hw[i] * 0.15, pts[i].y - norms[i].ny * hw[i] * 0.15]);
    A_.poly(ctx, sh.concat(R.slice(first).reverse()).map(p => [p[0], p[1]]), SHADOW, 0);
    // Scale net down his whole length, the same diamond lattice as the head picture's neck and the sheet
    const LANES = [-0.94, -0.62, -0.31, 0, 0.31, 0.62, 0.94];
    const at = (f, v) => { const i = Math.min(n - 2, Math.floor(f)), u = f - i, a = pts[i], b = pts[i + 1], na = norms[i], nb = norms[i + 1], ha = hw[i] * v, hb = hw[i + 1] * v; return [a.x + na.nx * ha + (b.x + nb.nx * hb - a.x - na.nx * ha) * u, a.y + na.ny * ha + (b.y + nb.ny * hb - a.y - na.ny * ha) * u]; };
    ctx.beginPath();
    for (let row = first * 2; row < (n - 2) * 2; row++) {
      for (let k = 0; k < LANES.length - 1; k++) {
        const flip = (k + row) % 2, from = at(row / 2, LANES[k + (flip ? 1 : 0)]), to = at((row + 1) / 2, LANES[k + (flip ? 0 : 1)]);
        ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]);
      }
    }
    ctx.lineWidth = 0.65; ctx.strokeStyle = NET; ctx.lineCap = 'round'; ctx.stroke();
    ctx.beginPath();
    for (let i = first; i < n; i++) { if (i === first) ctx.moveTo(L[i][0], L[i][1]); else ctx.lineTo(L[i][0], L[i][1]); }
    for (let i = n - 1; i >= first; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.lineWidth = 1.7; ctx.strokeStyle = A_.INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    // Lamps down the spine: every other segment, each on its short stalk, glowing
    const G = TG.lureGlow(), LP = lamp();
    ctx.save();
    const bright = w.dive.state === 'down' ? 1 : 0.65;
    for (let i = first + 2 + (first % 2); i < n - 3; i += 2) {
      const p = pts[i], sway = Math.sin(t * 2 + i) * 1.2, size = 0.86 - p.u * 0.3;
      ctx.globalAlpha = bright * (dark ? 0.7 : 1);
      ctx.drawImage(G.cv, p.x - 15 * size, p.y - 15 * size, 30 * size, 30 * size);
      ctx.globalAlpha = dark ? 0.8 : 1;
      A_.line(ctx, p.x, p.y, p.x + sway, p.y - 3, 1, A_.INK);
      ctx.drawImage(LP.cv, p.x + sway - 10 * size, p.y - 3 - 10 * size, 20 * size, 20 * size);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    return pts;
  };
  // In fog, his head and first lamps are drawn again over the murk: you always know where he is, even when you don't know where anything else is.
  TG.drawVeshOverFog = function (ctx, run, pts) {
    const t = run.time, A_ = A(), G = TG.lureGlow(), LP = lamp(), ang = Math.atan2(pts[0].y - pts[4].y, pts[0].x - pts[4].x) + Math.PI / 2;
    ctx.save();
    ctx.globalAlpha = 0.82;
    if (!A_.has('vesh_head') || !drawHeadPicture(ctx, pts[0], ang, t)) TG.stamp(ctx, head(), pts[0].x, pts[0].y, ang, 1 + Math.sin(t * 2.2) * 0.04, 1);
    for (let i = 3; i < 15; i += 2) { const p = pts[i]; ctx.globalAlpha = 0.7; ctx.drawImage(G.cv, p.x - 24, p.y - 24, 48, 48); ctx.globalAlpha = 1; ctx.drawImage(LP.cv, p.x - 10, p.y - 13, 20, 20); }
    ctx.restore();
  };

  function drawHeadPicture(c, p, ang, t) {
    const A_ = A();
    c.save(); c.translate(p.x, p.y); c.rotate(ang);
    const ok = A_.draw(c, 'vesh_head', A_.frameAt('vesh_head', t), 0, 34, 108);
    c.restore();
    return ok;
  }

  // The tow: two chains from the bow to the collar around his middle.
  TG.drawTow = function (ctx, w, pts) {
    const A_ = A(), bowY = w.shipYNow - T.hullHalfLen + 6;
    let col = pts[0];
    for (const p of pts) { if (p.y > bowY - 62) { col = p; break; } }
    const hw = halfWidth(col.u, w.tow + BEHIND, A_.has('vesh_head'));
    A_.ellipse(ctx, col.x, col.y, hw + 3, 4.2, '#8a6a36', 1.8);
    A_.ellipse(ctx, col.x, col.y, hw + 3, 1.4, '#d2a860', 0);
    [-1, 1].forEach(s => {
      const x0 = w.shipX + s * 7, y0 = bowY, x1 = col.x + s * (hw + 1), y1 = col.y;
      const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 7));
      A_.line(ctx, x0, y0, x1, y1, 3.6, A_.INK);
      for (let i = 0; i < n; i++) { const u = (i + 0.5) / n; A_.circle(ctx, x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, 2, i % 2 ? '#b2b6bf' : '#7b8089', 0.9); }
    });
  };
})();
