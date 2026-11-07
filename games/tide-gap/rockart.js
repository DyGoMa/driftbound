// Tide Gap: the islands, and Sela's gold. A rock is drawn once on its own hidden canvas: cliffs in two tones, stepped ledges, jagged moss, spires and broken falls, the way the Gaptooth picture is built. The waterline is where it hits.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const RISE = 20;      // looks only: how far the rock's top stands above its waterline
  const SCALE = 2;
  const SHOW = 240;     // looks only: how far back from a side rock's edge is worth dressing; the cliff covers the rest

  // The hit outline, in the rock's own space, far end up, near end down. A side rock's two long straight ends get broken up here, for looks only.
  function outline(r, rnd) {
    const n = r.edgeL.length - 1, right = [], left = [];
    for (let i = 0; i <= n; i++) { const y = r.len / 2 - (i / n) * r.len; right.push([r.edgeR[i], y]); left.push([r.edgeL[i], y]); }
    if (r.side === 'M') return left.concat(right.reverse());
    const edge = r.side === 'L' ? right : left, dir = r.side === 'L' ? -1 : 1, back = dir * 310;
    const end = (p, sign) => {   // from the far-back corner in to the rock's tip, along one end
      const out = [], steps = 14;   // in hard steps, a pair of points to each, so a long end never reads as a ruled line. Looks only: it reaches a little past the hit edge, never short of it
      let v = 0;
      for (let i = 0; i <= steps; i++) { if (i % 2 === 0) v = rnd(); const u = i / steps, x = back + (p[0] - back) * u; out.push([x, p[1] + sign * v * 12 * Math.pow(Math.sin(u * Math.PI), 0.6)]); }
      return out;
    };
    return end(edge[0], 1).concat(edge.slice(1, n), end(edge[n], -1).reverse());
  }

  // A hard-cornered patch: a blob of the given size with a bitten edge. Rocks are never ovals.
  function patch(rnd, cx, cy, rx, ry, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, k = 0.62 + rnd() * 0.5, bite = i % 2 ? 0.8 : 1;
      pts.push([cx + Math.cos(a) * rx * k * bite, cy + Math.sin(a) * ry * k * bite]);
    }
    return pts;
  }
  const zigzag = (c, A_, rnd, x, y, len, col, lw) => {
    c.beginPath(); c.moveTo(x, y);
    let px = x, py = y;
    for (let i = 0; i < 3; i++) { px += (rnd() - 0.5) * 8; py += len / 3; c.lineTo(px, py); }
    c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  };

  // A spire with a lit face and a shadow face, and a broken ridge.
  function spire(c, A_, rnd, x, y, h, b, look) {
    const lean = (rnd() - 0.5) * b * 0.5, tip = [x + lean, y - h], lit = look.rockHi, dark = A_.shade(look.rockHi, 0.64);
    const out = [[x - b, y + 5], [x - b * 0.55, y - h * 0.38], [x - b * 0.25, y - h * 0.46], tip, [x + b * 0.32, y - h * 0.5], [x + b * 0.62, y - h * 0.3], [x + b, y + 5], [x + b * 0.2, y + 8]];
    A_.poly(c, out, lit, 1.7);
    A_.poly(c, [tip, [x + b * 0.32, y - h * 0.5], [x + b * 0.62, y - h * 0.3], [x + b, y + 5], [x + b * 0.2, y + 8], [x + lean * 0.3 + b * 0.1, y - h * 0.3]], dark, 0);
    A_.poly(c, out, null, 1.7);
  }

  // A stream on the rock's top, running to the lip: a bending ribbon that widens as it goes, no heavy line round it.
  function stream(c, A_, rnd, x, lip, wide, look) {
    const segs = 3 + Math.floor(rnd() * 2), mid = [[x, lip + 1]];
    let px = x, py = lip + 1;
    for (let i = 0; i < segs; i++) { px += (rnd() - 0.5) * 13; py -= 5 + rnd() * 5; mid.push([px, py]); }
    const half = i => wide * 0.36 * (1 - i / segs) + 0.5;
    const left = mid.map((p, i) => [p[0] - half(i), p[1]]), right = mid.map((p, i) => [p[0] + half(i), p[1]]);
    A_.poly(c, left.concat(right.reverse()), look.fall, 0.9);
    A_.poly(c, mid.map((p, i) => [p[0] + half(i) * 0.1, p[1]]).concat(mid.map((p, i) => [p[0] + half(i), p[1]]).reverse()), A_.shade(look.fall, 0.74), 0);
  }

  // One fall over the cliff, drawn as water: it spreads as it drops, its sides wander, its foot breaks into uneven tongues, white runs down it, and foam piles up where it lands.
  function fall(c, A_, rnd, x, top, foot, wide, look) {
    const h = foot - top, rows = 5, L = [], R = [];
    for (let i = 0; i <= rows; i++) {
      const u = i / rows, half = wide * (0.36 + u * u * 0.36);
      L.push([x - half + (rnd() - 0.5) * wide * 0.18, top + h * u]);
      R.push([x + half + (rnd() - 0.5) * wide * 0.18, top + h * u]);
    }
    const n = 4 + Math.floor(rnd() * 2), tongues = [];
    for (let k = 1; k < n; k++) tongues.push([L[rows][0] + (R[rows][0] - L[rows][0]) * k / n, foot + (k % 2 ? -2.5 - rnd() * 2.5 : 1 + rnd() * 1.5)]);
    A_.poly(c, L.concat(tongues, R.slice().reverse()), look.fall, 1);
    A_.poly(c, L.map((p, i) => [x + (R[i][0] - x) * 0.22, p[1]]).concat(R.slice().reverse()), A_.shade(look.fall, 0.74), 0);
    const runs = 3 + Math.floor(rnd() * 2);
    for (let s = 0; s < runs; s++) {
      const sx = x + ((s + 0.5) / runs - 0.5) * wide * 0.95 + (rnd() - 0.5) * 1.5, y0 = top + rnd() * h * 0.35, y1 = Math.min(foot - 1, y0 + h * (0.35 + rnd() * 0.45)), out = (sx - x) * 0.35;
      A_.poly(c, [[sx - 0.5, y0], [sx + 0.5, y0], [sx + out + 0.9, y1 - 2], [sx + out, y1], [sx + out - 0.9, y1 - 2]], 'rgba(255,255,255,.9)', 0);
    }
    // Where the water bends over the lip
    const lip = wide * 0.42;
    A_.poly(c, [[x - lip, top + 0.8], [x - lip * 0.2, top - 0.8], [x + lip, top + 0.6], [x + lip * 0.6, top + 2.8], [x, top + 1.8], [x - lip * 0.7, top + 3]], '#e8fbfa', 0);
    for (let i = 0; i < 9; i++) {
      const fx = x + (rnd() - 0.5) * wide * 2.7, fy = foot + rnd() * 3.4 - 0.6, s = 1.8 + rnd() * 3;
      A_.poly(c, patch(rnd, fx, fy + 1, s * 1.4, s * 0.8, 6), '#b4dfe4', 0);
      A_.poly(c, patch(rnd, fx, fy, s * 1.2, s * 0.66, 6), '#f2fbfb', 0);
    }
  }

  function paintRock(c, r, look) {
    const A_ = A(), rnd = TG.scatter(r.id * 31 + 7), pts = outline(r, rnd), top = pts.map(p => [p[0], p[1] - RISE]);
    const side = r.side, dir = side === 'L' ? -1 : side === 'R' ? 1 : 0;   // which way "back" is, from the rock's edge
    const wide = side === 'M' ? r.w : SHOW, cx = side === 'M' ? 0 : dir * wide * 0.5, cy = -RISE;
    // Shadow and foam on the water
    c.save(); c.globalAlpha = 0.28; A_.poly(c, pts.map(p => [p[0] + 5, p[1] + 9]), '#081424', 0); c.restore();
    A_.poly(c, pts, null, 6, 'rgba(226,246,246,.72)');

    // The cliff, facet by facet from the waterline up, lit from the left: far ones first, so the near ones overlap them.
    A_.poly(c, pts, look.rockLo, 2.4);
    const lit = A_.shade(look.rock, 0.82), dark = look.rockLo, order = pts.map((p, i) => i).sort((a, b) => pts[a][1] - pts[b][1]);
    for (const i of order) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) < 1) continue;
      const leftFacing = (a[0] + b[0]) / 2 < (side === 'M' ? 0 : side === 'L' ? -40 : 40);
      A_.poly(c, [a, b, [b[0], b[1] - RISE], [a[0], a[1] - RISE]], leftFacing ? lit : dark, 0);
      if (rnd() < 0.5) { const u = rnd(), x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u; zigzag(c, A_, rnd, x, y - RISE + 2, RISE - 3, A_.INK, 0.9); }
    }
    A_.poly(c, pts, null, 2.4);

    // The top, with one shadow tone down its right and near edges
    A_.poly(c, top, A_.shade(look.rock, 0.72), 2.4);
    c.save();
    c.beginPath(); top.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.clip();
    A_.poly(c, top.map(p => [p[0] - 5, p[1] - 6]), look.rock, 0);

    // Stepped ledges, each with its own short cliff, so the top reads as terraces rather than a flat lid
    const ledges = 3;
    for (let k = 0; k < ledges; k++) {
      const f = 0.8 - k * 0.22, lx = cx + (rnd() - 0.5) * wide * 0.14, ly = cy + (rnd() - 0.5) * r.len * 0.1;
      const rx = (side === 'M' ? r.w / 2 : wide * 0.52) * f, ry = r.len / 2 * f;
      const shape = patch(rnd, lx, ly, rx * 1.15, ry * 1.15, 11 + k);
      A_.poly(c, shape.map(p => [p[0], p[1] + 5]), A_.shade(look.rock, 0.66), 0);
      A_.poly(c, shape, k % 2 ? look.rock : look.rockHi, 1.3);
      if (rnd() < 0.8) { const m = patch(rnd, lx + (rnd() - 0.5) * rx, ly - ry * 0.35, rx * 0.5, ry * 0.3, 8); A_.poly(c, m, look.moss, 0); A_.poly(c, patch(rnd, lx + (rnd() - 0.5) * rx * 0.8, ly - ry * 0.45, rx * 0.26, ry * 0.15, 7), look.mossHi, 0); }
    }
    // Moss that hangs along the far lip and runs down the gullies, in bitten patches
    const mossN = Math.max(2, Math.round(wide * r.len / 5200));
    for (let i = 0; i < mossN; i++) {
      const mx = side === 'M' ? (rnd() - 0.5) * r.w * 0.8 : dir * (8 + rnd() * (wide - 16)), my = cy + (rnd() - 0.55) * r.len * 0.82, s = 10 + rnd() * 14;
      A_.poly(c, patch(rnd, mx, my, s * 1.2, s * 0.62, 8), i % 3 ? look.moss : look.mossHi, 0);
    }
    // Loose stones and broken slabs near the lip, in small hard clusters
    const stones = Math.max(3, Math.round(wide * r.len / 3400));
    for (let i = 0; i < stones; i++) {
      const sx = side === 'M' ? (rnd() - 0.5) * r.w * 0.86 : dir * (6 + rnd() * (wide - 10)), sy = cy + (rnd() - 0.5) * r.len * 0.86, sz = 2.4 + rnd() * 3.6;
      A_.poly(c, patch(rnd, sx, sy + 1.5, sz * 1.1, sz * 0.8, 6), A_.shade(look.rock, 0.6), 0);
      A_.poly(c, patch(rnd, sx, sy, sz, sz * 0.72, 6), look.rockHi, 0.8);
    }
    // Cracks
    const cracks = Math.max(2, Math.round(wide * r.len / 6000));
    for (let i = 0; i < cracks; i++) zigzag(c, A_, rnd, side === 'M' ? (rnd() - 0.5) * r.w * 0.7 : dir * rnd() * wide, cy + (rnd() - 0.5) * r.len * 0.7, 10 + rnd() * 16, A_.INK, 1);
    // Spires, in clumps: the teeth of the Gaptooth
    const clumps = Math.max(1, Math.round(wide * r.len / (side === 'M' ? 9000 : 11000)));
    const list = [];
    for (let i = 0; i < clumps; i++) {
      const sx = side === 'M' ? (rnd() - 0.5) * r.w * 0.5 : dir * (26 + rnd() * (wide - 40)), sy = cy + (rnd() - 0.55) * r.len * 0.6, n = 2 + Math.floor(rnd() * 3);
      for (let k = 0; k < n; k++) list.push([sx + (k - (n - 1) / 2) * (10 + rnd() * 5), sy + (rnd() - 0.5) * 7, 14 + rnd() * 24 - k * 2, 6 + rnd() * 5]);
    }
    list.sort((a, b) => a[1] - b[1]).forEach(s => spire(c, A_, rnd, s[0], s[1], s[2], s[3], look));
    c.restore();

    // Falls, off the near edge where a stream reaches it.
    const nearEdge = x => { let best = r.len / 2; for (let i = 0; i < pts.length; i++) if (Math.abs(pts[i][0] - x) < 12 && pts[i][1] > 0) best = Math.min(best, pts[i][1]); return best; };
    const falls = side === 'M' ? 1 : (r.len > 120 ? 2 : 1);
    for (let k = 0; k < falls; k++) {
      const x = side === 'M' ? (rnd() - 0.5) * r.w * 0.45 : dir * (22 + k * 56 + rnd() * 18), foot = nearEdge(x), lip = foot - RISE, wf = 8 + rnd() * 6;
      stream(c, A_, rnd, x, lip, wf, look);
      fall(c, A_, rnd, x, lip, foot + 1, wf, look);
    }
    if (r.cache) { for (let i = 0; i < 3; i++) A_.circle(c, (side === 'M' ? 0 : dir * 12) + (i - 1) * 8, r.len / 2 + 3, 1.8, A_.GOLD, 0); }
  }

  function rockBake(r, look) {
    if (r.bake) return r.bake;
    const pad = 16, x0 = r.side === 'L' ? -300 : r.side === 'R' ? -pad : -r.w / 2 - pad, x1 = r.side === 'L' ? pad : r.side === 'R' ? 300 : r.w / 2 + pad;
    const w = x1 - x0, h = r.len + RISE + 54;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(w * SCALE); cv.height = Math.ceil(h * SCALE);
    const c = cv.getContext('2d');
    c.scale(SCALE, SCALE); c.translate(-x0, r.len / 2 + RISE + 34);
    paintRock(c, r, look);
    r.bake = { cv, w, h, ox: -x0, oy: r.len / 2 + RISE + 34 };
    return r.bake;
  }

  TG.drawRocks = function (ctx, run, view) {
    const w = run.w, look = TG.LOOKS[run.stage.look || 0];
    for (const r of w.rocks) {
      const y = TG.yOf(w, r.at);
      if (y + r.len / 2 + 20 < view.top || y - r.len / 2 - 40 > view.bottom) continue;
      const b = rockBake(r, look);
      ctx.drawImage(b.cv, r.x - b.ox, y - b.oy, b.w, b.h);
      if (r.mop) drawMop(ctx, r, y);
    }
  };

  function drawMop(c, r, y) { // the tuft that gives Mopclaw away
    const A_ = A(), x = r.side === 'L' ? r.x - 6 : r.side === 'R' ? r.x + 6 : r.x;
    const ey = y + r.len / 2 + 2;
    for (let i = -3; i <= 3; i++) A_.line(c, x, ey - 6, x + i * 3.2, ey + 4 + Math.abs(i % 2), 2.6, '#d9d6c6');
    A_.line(c, x - 3, ey - 6, x + 3, ey - 6, 3, '#9a8a6a');
  }

  // ---- Grinding rocks throw sparks and spit stones.
  TG.grindFx = function (w, r) {
    const A_ = A(), y = TG.yOf(w, r.at), x = r.side === 'M' ? r.x + (r.drift < 0 ? -r.w / 2 : r.w / 2) : r.x;
    A_.shake(3, 0.25);
    A_.burst(x, y, { n: 18, colors: ['#f4c152', '#ffffff', '#6a5a50'], speed: 170, life: 0.6, size: 4 });
  };

  // ---- Sela's sense. Gold chevrons on a rock that's about to move, reaching further ahead the fuller her book.
  function chevron(c, x, y, dir, s, col) {
    const A_ = A();
    A_.poly(c, [[x - dir * s * 0.5, y - s], [x + dir * s * 0.02, y - s], [x + dir * s * 0.62, y], [x + dir * s * 0.02, y + s], [x - dir * s * 0.5, y + s], [x + dir * s * 0.1, y]], col, 2);
  }
  TG.drawSense = function (ctx, run, view) {
    const w = run.w, sense = TG.senseNow(run), A_ = A();
    if (!sense.reach) return;
    const top = TG.bookBottom(run, view) + 4;
    const flick = sense.flick && Math.sin(run.time * 11) + Math.sin(run.time * 17.3) < -sense.flick * 2 ? 0.25 : 1;
    ctx.save();
    ctx.beginPath(); ctx.rect(TG.WALL_L, view.top, TG.WALL_R - TG.WALL_L, view.bottom - view.top); ctx.clip();   // gold stays in the channel on a wide screen
    for (const r of w.rocks) {
      if (!r.drift || !TG.senseFeels(run, r)) continue;
      const p = TG.rockP(r, w.dist);
      if (p >= 0.98) continue;
      const nearY = TG.yOf(w, r.at - r.len / 2), bowGap = (w.shipYNow - T.hullHalfLen) - nearY;
      if (bowGap > sense.reach || bowGap < -10) continue;
      const fade = Math.min(1, (sense.reach - bowGap) / 40);
      const dir = Math.sign(r.drift), y0 = TG.yOf(w, r.at);
      const edge = r.side === 'M' ? r.x : r.side === 'L' ? r.x - 26 : r.x + 26;
      const x = Math.max(24, Math.min(336, edge)), y = Math.max(top, Math.min(nearY - 22, y0));
      const big = Math.abs(r.drift), n = Math.max(1, Math.min(sense.chev, big > 78 ? 3 : big > 44 ? 2 : 1));
      ctx.globalAlpha = sense.alpha * fade * flick;
      const slide = ((run.time * 1.6) % 1) * 7 * dir;
      for (let i = 0; i < n; i++) chevron(ctx, x + slide + (i - (n - 1) / 2) * 15 * dir, y, dir, 11, i === n - 1 ? '#ffe28a' : A_.GOLD);
      // The ghost edge: exactly where this rock will stop. The fullest books get this.
      if (sense.ghost && y0 > top - 40) {
        const end = TG.rockX(r, r.to + 1);
        ctx.globalAlpha = 0.85 * fade;
        ctx.setLineDash([7, 6]); ctx.lineWidth = 2.4; ctx.strokeStyle = '#ffe28a'; ctx.lineCap = 'butt';
        const n2 = r.edgeL.length - 1, side = (arr) => { ctx.beginPath(); arr.forEach((e, i) => { const py = y0 + r.len / 2 - (i / n2) * r.len, px = end + e; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }); ctx.stroke(); };
        if (r.side !== 'R') side(r.edgeR);
        if (r.side !== 'L') side(r.edgeL);
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  };
})();
