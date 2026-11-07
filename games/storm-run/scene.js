// Storm Run: Pinhold, in layers (art/site/pinhold-v1-web.webp sets the look). The great pylons and their chains, the tower and cranes,
// then the near yard and the road on its cracked rock. Each layer is baked once and scrolls at its own speed. Sky and weather are in sky.js.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  // A chain from a to b: big links, in ink and flat steel.
  function chain(c, x1, y1, x2, y2, s, col) {
    const len = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(len / (s * 1.5)), an = Math.atan2(y2 - y1, x2 - x1);
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, x = x1 + (x2 - x1) * u, y = y1 + (y2 - y1) * u;
      c.save(); c.translate(x, y); c.rotate(an);
      if (i % 2) { A().poly(c, [[-s, -s * 0.2], [s, -s * 0.2], [s, s * 0.2], [-s, s * 0.2]], A().shade(col, 0.7), 1); }
      else { A().ellipse(c, 0, 0, s, s * 0.55, null, s * 0.34, col); A().ellipse(c, 0, 0, s + s * 0.16, s * 0.72, null, 1, A().INK); A().ellipse(c, 0, 0, s - s * 0.16, s * 0.36, null, 0.8, A().INK); }
      c.restore();
    }
  }

  // A great anchor pylon: spike, collar, tapered shaft, flared struts. x, base = where it meets the island.
  function pylon(c, x, base, h, col) {
    const A_ = A(), dark = A_.shade(col, 0.72), rim = '#c98a5e', w = h * 0.075;
    // Struts
    [[-1, 0.2], [1, 0.2]].forEach(([s]) => {
      A_.poly(c, [[x + s * w * 2.6, base], [x + s * w * 0.8, base - h * 0.34], [x + s * w * 0.45, base - h * 0.34], [x + s * w * 1.8, base]], s < 0 ? col : dark, 1.4);
    });
    // Shaft, lit from the sunset side
    A_.poly(c, [[x - w, base], [x - w * 0.62, base - h * 0.72], [x + w * 0.62, base - h * 0.72], [x + w, base]], col, 1.6);
    A_.poly(c, [[x - w * 0.1, base], [x - w * 0.1, base - h * 0.72], [x - w * 0.62, base - h * 0.72], [x - w, base]], dark, 0);
    A_.poly(c, [[x + w * 0.86, base], [x + w * 0.54, base - h * 0.72], [x + w * 0.62, base - h * 0.72], [x + w, base]], rim, 0);
    for (let i = 1; i < 5; i++) { const y = base - h * 0.72 * i / 5, t = 1 - i / 5 * 0.38; A_.line(c, x - w * t, y, x + w * t, y, 1.2); }
    // Collars and spike
    const cy = base - h * 0.72;
    A_.poly(c, [[x - w * 1.15, cy + 5], [x - w * 1.15, cy - 7], [x + w * 1.15, cy - 7], [x + w * 1.15, cy + 5]], col, 1.6);
    A_.poly(c, [[x - w * 1.15, cy + 5], [x - w * 1.15, cy - 7], [x - w * 0.1, cy - 7], [x - w * 0.1, cy + 5]], dark, 0);
    A_.poly(c, [[x - w * 1.15, cy + 5], [x - w * 1.15, cy - 7], [x + w * 1.15, cy - 7], [x + w * 1.15, cy + 5]], null, 1.6);
    A_.poly(c, [[x - w * 0.8, cy - 7], [x, base - h], [x + w * 0.8, cy - 7]], col, 1.6);
    A_.poly(c, [[x - w * 0.8, cy - 7], [x, base - h], [x - w * 0.05, cy - 7]], dark, 0);
    A_.poly(c, [[x - w * 0.8, cy - 7], [x, base - h], [x + w * 0.8, cy - 7]], null, 1.6);
    for (let i = 0; i < 5; i++) A_.circle(c, x - w + i * w * 0.5, cy - 1, 1.2, A_.INK, 0);
  }

  function tower(c, x, base, h, col) {
    const A_ = A(), w = h * 0.2, cabin = base - h * 0.78;
    [[-1], [1]].forEach(([s]) => A_.line(c, x + s * w, base, x + s * w * 0.42, cabin, 2.6, A_.shade(col, 0.6)));
    for (let i = 0; i < 4; i++) {
      const a = base - (i / 4) * h * 0.78, b = base - ((i + 1) / 4) * h * 0.78, wa = w * (1 - i / 4 * 0.58), wb = w * (1 - (i + 1) / 4 * 0.58);
      A_.line(c, x - wa, a, x + wb, b, 1.4, A_.shade(col, 0.6)); A_.line(c, x + wa, a, x - wb, b, 1.4, A_.shade(col, 0.6)); A_.line(c, x - wb, b, x + wb, b, 1.4, A_.shade(col, 0.6));
    }
    A_.slab(c, x - w * 0.72, cabin - 16, w * 1.44, 16, col, 1.5);
    for (let i = 0; i < 4; i++) A_.slab(c, x - w * 0.6 + i * w * 0.32, cabin - 13, w * 0.2, 6, '#f6d67a', 0);
    A_.poly(c, [[x - w * 0.85, cabin - 16], [x, cabin - 28], [x + w * 0.85, cabin - 16]], A_.shade(col, 0.72), 1.5);
    A_.line(c, x, cabin - 28, x, cabin - 42, 1.2);
  }

  function crane(c, x, base, h, col, dir) {
    const A_ = A(), dk = A_.shade(col, 0.66), top = base - h * 0.7;
    A_.slab(c, x - 12, base - 12, 24, 12, dk, 1.2);
    A_.poly(c, [[x - 4, base - 12], [x + 4, base - 12], [x + 3, top], [x - 3, top]], col, 1.3);
    A_.poly(c, [[x - 12 * dir, top - 2], [x + h * 0.6 * dir, base - h], [x + h * 0.62 * dir, base - h + 6], [x - 12 * dir, top + 5]], col, 1.3);
    A_.line(c, x, top, x + h * 0.32 * dir, base - h * 0.83, 1, dk);
    const hx = x + h * 0.56 * dir, hy = base - h * 0.4;
    A_.line(c, hx, base - h + 4, hx, hy, 1, A_.INK);
    A_.poly(c, [[hx - 3, hy], [hx + 3, hy], [hx + 2, hy + 6], [hx - 2, hy + 6]], dk, 1);
  }

  // ---- The big things, far off and hazed by the dusk.
  const PYLONS = { w: 1500, h: 300, towerX: 610, towerH: 170 };
  // The layer is as tall as this screen needs (only taller than 16:9 screens need more), and the chains run off its top, so none ends in mid-air.
  function pylons(view) {
    const H = Math.max(PYLONS.h, Math.ceil(T.groundY - view.top) + 6);
    return SR.bake('pylons' + H, PYLONS.w, H, 0, 0, c => {
      const base = H - 6, steel = '#5a5f78';
      // From a pylon's collar up and along (dx, dy per unit of length) until past the top of the layer. The left-going chain wraps round the layer's seam.
      const up = (x, dx, dy) => { const u = (base - 196 + 12) / dy; chain(c, x, base - 196, x + dx * u, base - 196 - dy * u, 7, '#6b7088'); };
      // The island's far shelf, so everything stands on something.
      A().poly(c, [[0, base - 6], [PYLONS.w, base - 6], [PYLONS.w, H], [0, H]], '#3a3550', 0);
      up(200, -260, 114);
      up(200 + PYLONS.w, -260, 114);
      up(200, 260, 134);
      up(1030, -250, 134);
      up(1030, 260, 134);
      pylon(c, 200, base, 272, steel);
      pylon(c, 1030, base, 272, steel);
      crane(c, 420, base, 130, '#4d5068', 1);
      crane(c, 1320, base, 150, '#4d5068', -1);
      tower(c, PYLONS.towerX, base, PYLONS.towerH, '#4f5270');
      A().slab(c, 830, base - 18, 70, 18, '#494b63', 1.2);
      A().slab(c, 50, base - 14, 60, 14, '#494b63', 1.2);
    });
  }

  // ---- The near yard: bunkers, fence, lamps.
  function yard() {
    return SR.bake('yard', 1000, 110, 0, 0, c => {
      const A_ = A(), base = 104, rnd = SR.scatter(11);
      A_.poly(c, [[0, base - 2], [1000, base - 2], [1000, 110], [0, 110]], '#3a3346', 0);
      // Chain-link fence
      for (let x = 0; x < 1000; x += 44) { A_.line(c, x, base, x, base - 38, 1.6, '#2a2c3e'); }
      A_.line(c, 0, base - 37, 1000, base - 37, 1, '#2a2c3e');
      A_.line(c, 0, base - 22, 1000, base - 22, 0.8, '#2a2c3e');
      // Bunkers and sandbags
      [[70, 84, 40], [330, 60, 30], [560, 96, 46], [820, 70, 34]].forEach(([x, w, h]) => {
        A_.slab(c, x, base - h, w, h, '#74747e', 1.6);
        A_.slab(c, x + w * 0.12, base - h * 0.72, w * 0.26, h * 0.2, '#16182a', 1);
        A_.slab(c, x + w * 0.6, base - h * 0.72, w * 0.26, h * 0.2, '#f0c868', 1);
        A_.poly(c, [[x - 3, base - h], [x + w + 3, base - h], [x + w + 1, base - h - 4], [x - 1, base - h - 4]], '#8c8b92', 1.3);
      });
      for (let i = 0; i < 18; i++) {
        const x = rnd() * 980, n = 2 + Math.floor(rnd() * 3);
        for (let j = 0; j < n; j++) A_.ellipse(c, x + j * 9, base - 4, 5.5, 3.6, '#7d6f5a', 1);
        if (n > 2) A_.ellipse(c, x + 4.5, base - 10, 5.5, 3.6, '#8b7d66', 1);
      }
      // Lamps, lit
      [240, 480, 720, 960].forEach(x => {
        A_.line(c, x, base, x, base - 74, 2.4, '#23253a');
        A_.line(c, x, base - 74, x + 10, base - 74, 2, '#23253a');
        c.fillStyle = 'rgba(255,230,160,.22)';
        c.beginPath(); c.moveTo(x + 10, base - 74); c.lineTo(x + 28, base); c.lineTo(x - 8, base); c.closePath(); c.fill();
        A_.slab(c, x + 6, base - 77, 9, 4, '#ffe9a8', 1);
      });
    });
  }

  // ---- The road on its cracked rock, as in the Pinhold picture: lit tops, dark faces.
  function road() {
    return SR.bake('road', 640, 120, 0, 0, c => {
      const A_ = A(), rnd = SR.scatter(23), roadH = 15;
      A_.poly(c, [[0, roadH], [640, roadH], [640, 120], [0, 120]], '#2a2233', 0);
      let x = -10;
      while (x < 640) {
        const w = 46 + rnd() * 50, d = 8 + rnd() * 14, h = 42 + rnd() * 50;
        A_.poly(c, [[x, roadH], [x + w, roadH], [x + w - 5, roadH + h], [x + w * 0.5, roadH + h + 10], [x + 6, roadH + h - 4]], '#493a48', 1.6);
        A_.poly(c, [[x + w * 0.55, roadH], [x + w, roadH], [x + w - 5, roadH + h], [x + w * 0.5, roadH + h + 10]], '#35293a', 0);
        A_.poly(c, [[x, roadH], [x + w, roadH], [x + w - 3, roadH + d], [x + 3, roadH + d]], '#a97a58', 1.6);
        A_.poly(c, [[x + w * 0.62, roadH], [x + w, roadH], [x + w - 3, roadH + d], [x + w * 0.58, roadH + d]], '#8a6048', 0);
        x += w;
      }
      // The road surface.
      A_.poly(c, [[0, 0], [640, 0], [640, roadH], [0, roadH]], '#77737a', 0);
      A_.poly(c, [[0, roadH - 5], [640, roadH - 5], [640, roadH], [0, roadH]], '#55525c', 0);
      for (let i = 0; i < 8; i++) A_.poly(c, [[i * 80 + 8, 5.5], [i * 80 + 46, 5.5], [i * 80 + 45, 8], [i * 80 + 7, 8]], '#d9d3c4', 0);
      for (let i = 0; i < 12; i++) { const px = rnd() * 640; A_.line(c, px, 2 + rnd() * 6, px + 7 + rnd() * 10, 3 + rnd() * 8, 0.8, '#55525c'); }
      A_.line(c, -2, 0, 642, 0, 2);
      A_.line(c, -2, roadH, 642, roadH, 1.6);
    });
  }

  // Search beams from the tower: moving, so drawn each frame, thin and cheap.
  function beams(c, view, off, t) {
    const x0 = PYLONS.towerX - (((off % PYLONS.w) + PYLONS.w) % PYLONS.w) + view.left;
    for (const x of [x0, x0 + PYLONS.w]) {
      if (x < view.left - 260 || x > view.right + 260) continue;
      const y = T.groundY - 6 - PYLONS.towerH * 0.78 - 24;
      [[-0.5, 1.3], [0.7, 0.9]].forEach(([ph, sp]) => {
        const an = Math.PI * 0.5 + Math.sin(t * 0.6 * sp + ph) * 1.15, len = 280, sp2 = 0.11;
        c.fillStyle = 'rgba(255,238,180,.10)';
        c.beginPath(); c.moveTo(x, y);
        c.lineTo(x + Math.sin(an - sp2) * len, y - Math.cos(an - sp2) * len);
        c.lineTo(x + Math.sin(an + sp2) * len, y - Math.cos(an + sp2) * len);
        c.closePath(); c.fill();
      });
      A().circle(c, x, y, 2.6, '#fff3c4', 0);
    }
  }

  // ---- Stage 4: a far row of rooftops, with Silt a long way off along them, keeping pace behind Kaito. In the scene, so the yard stands in front and the stage's haze falls over him. Sizes are looks only.
  const ROOF_H = 62, ROOF_BACK = 22, SILT_SCALE = 0.24;   // height of the flat roofs he runs along; room above them for the peaks behind
  function roofs() {
    return SR.bake('roofs', 720, ROOF_BACK + ROOF_H, 0, ROOF_BACK, c => {
      const A_ = A(), wall = '#3c3d58', back = '#34354f', top = '#55567a', rnd = SR.scatter(31);
      for (let x = 0; x < 720; x += 120) { // pitched roofs and chimneys further back, so it reads as a town and not a wall
        A_.poly(c, [[x + 8, 1], [x + 30, -16], [x + 88, -16], [x + 110, 1]], back, 1);
        A_.slab(c, x + 96, -21, 8, 14, back, 1);
      }
      A_.poly(c, [[0, 0], [720, 0], [720, ROOF_H], [0, ROOF_H]], wall, 0);
      for (let x = 0; x < 720; x += 120) { // one building to each 120 px, with a few lit windows
        A_.line(c, x, 0, x, ROOF_H, 1.2);
        for (let i = 0; i < 5; i++) if (rnd() < 0.6) A_.slab(c, x + 14 + i * 20, 12 + (i % 2) * 14, 7, 5, 'rgba(240,200,104,.55)', 0);
      }
      A_.poly(c, [[0, 0], [720, 0], [720, 4], [0, 4]], top, 0);
      A_.line(c, 0, 0, 720, 0, 1.4);
    });
  }
  function farSilt(c, view, off, t) {
    const y = T.groundY - ROOF_H, x = view.left + 72 + Math.sin(t * 0.22) * 25;
    SR.strip(c, roofs(), view, off * 0.3, y - ROOF_BACK);
    c.save(); c.translate(x, y - Math.abs(Math.sin(t * 6)) * 2); c.scale(SILT_SCALE, SILT_SCALE);
    SR.drawHound(c, { state: 'chase', x: 0, alt: T.groundY, flip: false, throwArm: 0, flash: 0, t: 1, total: 1 }, t);
    c.restore();
  }

  // The whole background. off = road scrolled so far; which = stage number.
  SR.drawScene = function (c, view, off, t, which, stage) {
    const A_ = A(), g = T.groundY;
    SR.drawSky(c, view, off, t, which, stage);
    const far = pylons(view);
    SR.strip(c, far, view, off * 0.18, g - far.h);
    beams(c, view, off * 0.18, t);
    if (stage && stage.silt) farSilt(c, view, off, t);
    SR.strip(c, yard(), view, off * 0.5, g - 104);
    if (stage && stage.wash) { c.fillStyle = 'rgba(10,12,40,' + stage.wash + ')'; c.fillRect(view.left, view.top, view.right - view.left, g - view.top); }
    SR.strip(c, road(), view, off, g);
    if (view.bottom > g + 120) { c.fillStyle = '#2a2233'; c.fillRect(view.left, g + 118, view.right - view.left, view.bottom - g - 118); }
  };
})();
