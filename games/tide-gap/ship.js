// Tide Gap: the Gullwake from above, battered and patched, and Sela at the bow. Sela's look follows the book: head up with a full one, reading a thin one, the book hanging from her hand when it's empty.
// She's a picture when art exists (art/REQUEST.md). The code version is small and plain on purpose: a tidy figure seen from behind, per sela-sheet-v5.png.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  const hull = () => TG.bake('gullwake', 80, 124, 40, 62, c => {
    const A_ = A(), WOOD = '#6a4a30', DECK = '#ab865a', DECK_LO = '#8c6c48';
    const outer = [[0, -46, 1], [10, -34], [17, -14], [18, 14], [15, 34], [10, 42], [-10, 42], [-15, 34], [-18, 14], [-17, -14], [-10, -34]];
    A_.blob(c, outer, WOOD, 2.6);
    A_.blob(c, outer.map(p => [p[0] * 0.8, p[1] * 0.88, p[2]]), DECK, 1.6);
    // Planks
    c.save(); A_.blob(c, outer.map(p => [p[0] * 0.8, p[1] * 0.88]), null, 0); c.clip();
    A_.poly(c, [[2, -44], [20, -44], [20, 44], [2, 44]], DECK_LO, 0);
    for (let x = -12; x <= 12; x += 4) A_.line(c, x, -44, x, 44, 0.8, 'rgba(16,18,31,.45)');
    c.restore();
    // Iron patches, riveted on the hull
    [[-16, 4, 7, 14, '#6e625e'], [11, 20, 7, 12, '#7a5a46'], [-13, -22, 6, 10, '#5e5a60']].forEach(p => { A_.poly(c, [[p[0], p[1]], [p[0] + p[2], p[1] + 1], [p[0] + p[2], p[1] + p[3]], [p[0], p[1] + p[3] - 1]], p[4], 1.2); });
    // The bow winch the tow chains run to
    A_.poly(c, [[-9, -36], [9, -36], [7, -28], [-7, -28]], '#55504e', 1.6);
    A_.line(c, -6, -32, 6, -32, 2, '#b2b6bf');
    // Crates and the salvage derrick
    A_.slab(c, 5, -22, 8, 8, '#8a6236', 1.4);
    A_.slab(c, -13, -15, 7, 7, '#74552f', 1.4);
    // Stern cabin
    A_.poly(c, [[-11, 18], [11, 18], [10, 37], [-10, 37]], '#3a4f6a', 2);
    A_.poly(c, [[-11, 18], [11, 18], [10, 23], [-10, 23]], '#54708f', 0);
    A_.poly(c, [[-11, 18], [11, 18], [10, 37], [-10, 37]], null, 2);
    A_.circle(c, 6, 31, 2, A_.ORANGE, 1);
    // Grist, asleep across the stern deck
    A_.blob(c, [[-13, 8], [-4, 3], [8, 4], [13, 9], [11, 16], [-9, 17]], '#3d4048', 1.8);
    A_.poly(c, [[-9, 7], [-3, 4], [-1, 15], [-8, 15]], '#4f535c', 1);
    A_.poly(c, [[1, 5], [8, 5], [10, 14], [2, 15]], '#4f535c', 1);
    A_.poly(c, [[-14, 11], [-19, 7], [-18, 13]], '#5a5e68', 1.2);
    // The mast with its yard and furled, patched sail, stood up above the deck
    A_.poly(c, [[-22, -4], [22, -4], [24, 1], [-24, 1]], '#d2c19a', 2);
    A_.poly(c, [[-24, 1], [24, 1], [22, 3], [-22, 3]], '#a69468', 1.2);
    A_.poly(c, [[8, -4], [16, -4], [17, 1], [9, 1]], '#c86a2a', 1);
    A_.circle(c, 0, -1, 3, '#5a3d27', 1.6);
  });

  // ---- Sela, code version, from behind. x, y = between her feet. Faces up the screen.
  function selaCode(c, x, y, s, st, t, lean) {
    const A_ = A(), SKIN = '#7a4a2e', JACKET = '#1f2f66', SKIRT = '#1f6a68', HAIR = '#b7c9e0', BOOT = '#6a4526';
    c.save(); c.translate(x, y); c.scale(s, s);
    if (st === 'hurt') c.rotate(0.3);
    A_.ellipse(c, 0, 0, 9, 3, 'rgba(16,18,31,.35)', 0);
    A_.poly(c, [[-6, -1], [-2, -1], [-2, -8], [-6, -8]], BOOT, 1.1); A_.poly(c, [[2, -1], [6, -1], [6, -8], [2, -8]], BOOT, 1.1);
    A_.blob(c, [[-7, -24], [7, -24], [8, -7], [3, -8], [0, -6], [-3, -8], [-8, -7]], SKIRT, 1.3);
    A_.poly(c, [[-5, -26], [5, -26], [6, -23], [-6, -23]], SKIN, 1);
    A_.poly(c, [[-6.5, -25], [6.5, -25], [6.5, -23], [-6.5, -23]], '#5a3a20', 0.8);
    A_.blob(c, [[-8, -38], [8, -38], [7, -26], [-7, -26]], JACKET, 1.4);
    // Arms, by what the book has left her
    const bookCol = '#c9a26a', book = (bx, by, open) => { A_.poly(c, open ? [[bx - 5, by - 2], [bx + 5, by - 2], [bx + 5, by + 3], [bx - 5, by + 3]] : [[bx - 2.5, by - 3], [bx + 2.5, by - 3], [bx + 2.5, by + 3], [bx - 2.5, by + 3]], bookCol, 1.2); if (open) A_.line(c, bx, by - 2, bx, by + 3, 0.9, A_.INK); };
    if (st === 'surge') {
      A_.limb(c, -8, -36, -13, -46, 2.5, 2, JACKET, 1.2, true); A_.limb(c, 8, -36, 13, -46, 2.5, 2, JACKET, 1.2, true);
      A_.circle(c, -13, -47, 1.8, SKIN, 1); A_.circle(c, 13, -47, 1.8, SKIN, 1);
    } else if (st === 'read') {
      A_.limb(c, -8, -36, -5, -29, 2.5, 2, JACKET, 1.2, true); A_.limb(c, 8, -36, 5, -29, 2.5, 2, JACKET, 1.2, true);
      book(0, -29, true);
    } else if (st === 'empty') {
      A_.limb(c, -8, -36, -10, -24, 2.5, 2, JACKET, 1.2, true); A_.limb(c, 8, -36, 10, -24, 2.5, 2, JACKET, 1.2, true);
      A_.circle(c, -10, -22.5, 1.9, SKIN, 1); A_.circle(c, 10, -22.5, 1.9, SKIN, 1);
      book(10, -19, false);
    } else {
      A_.limb(c, -8, -36, -11, -26, 2.5, 2, JACKET, 1.2, true); A_.limb(c, 8, -36, 12, -30, 2.5, 2, JACKET, 1.2, true);
      A_.circle(c, -11, -24.5, 1.9, SKIN, 1); A_.line(c, 12, -30, 18, -36, 2.4, '#c9a24a');   // spyglass up
    }
    // Head and that ponytail, whipping behind her with the steering
    const dip = st === 'read' ? 1.5 : st === 'empty' ? 3 : 0, sway = -lean * 12 + Math.sin(t * 5) * 1.6;
    A_.blob(c, [[-2, -46 + dip], [2, -46 + dip], [3 + sway * 0.5, -36], [2 + sway, -26], [-1 + sway, -22], [-3 + sway * 0.5, -32]], HAIR, 1.2);
    A_.circle(c, 0, -43 + dip, 5, HAIR, 1.3);
    A_.circle(c, 0, -46.5 + dip, 2, HAIR, 1);
    c.restore();
  }

  const POSE = { steady: 'sela_bow', read: 'sela_read', empty: 'sela_empty', surge: 'sela_surge', hurt: 'sela_hurt' };
  TG.selaState = function (run) {
    const w = run.w, left = TG.linesLeft(run);
    if (w.hurtT > 0) return 'hurt';
    if (w.dive.state !== 'up' || w.windup > 0) return 'surge';
    if (left === 0) return 'empty';
    return left <= 3 ? 'read' : 'steady';
  };

  TG.drawShip = function (ctx, run) {
    const w = run.w, A_ = A(), d = w.dive, t = run.time, x = w.shipX, y = w.shipYNow;
    const under = d.state !== 'up';
    const sink = d.state === 'down' ? Math.min(1, d.t / T.sinkSecs) : d.state === 'rising' ? 1 - d.t / T.riseSecs : 0;
    const blink = w.inv > 0 && Math.floor(t * 12) % 2 === 0;
    // Wake: two lines of foam peeling off the stern, thinning to nothing, with a broken scatter behind
    if (!under) {
      const sl = -w.lean * 26;
      [-1, 1].forEach(s => {
        A_.poly(ctx, [[x + s * 15, y + 26], [x + s * 18.5, y + 26], [x + s * 40 + sl, y + 104]], 'rgba(236,250,250,.7)', 0);
        for (let i = 0; i < 4; i++) { const u = ((t * 0.8 + i / 4) % 1), fy = y + 40 + u * 76, fx = x + s * (19 + u * 24) + sl * u; ctx.globalAlpha = (1 - u) * 0.85; A_.ellipse(ctx, fx, fy, 4.5 - u * 2.5, 1.6, '#eef9f9', 0); ctx.globalAlpha = 1; }
      });
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(w.lean * 0.22);
    if (sink > 0) ctx.globalAlpha = 1 - sink * 0.55;
    if (blink) ctx.globalAlpha = 0.55;
    const s = 1 - sink * 0.08;
    ctx.scale(s, s);
    if (!A_.draw(ctx, 'gullwake', 0, 0, 54, 110)) {
      const H = hull(); ctx.drawImage(H.cv, -H.ox, -H.oy, H.w, H.h);
    }
    // Knocks show on the hull: a split plank for each one taken
    ctx.lineCap = 'round';
    const taken = w.hullMax - w.hullLeft;
    [[-9, -24, -4, -12, -8, -6], [6, -8, 12, 2, 7, 10], [-12, 22, -6, 28, -10, 36], [2, -34, 6, -24, 1, -18]].slice(0, taken).forEach(p => {
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2], p[3]); ctx.lineTo(p[4], p[5]); ctx.lineWidth = 2; ctx.strokeStyle = A_.INK; ctx.stroke();
    });
    // Sela at the bow
    const st = TG.selaState(run);
    if (!A_.draw(ctx, POSE[st], A_.frameAt(POSE[st], t), 0, T.selaFeet, T.selaH)) selaCode(ctx, 0, T.selaFeet, T.selaH * 0.74 / 36, st, t, w.lean);
    ctx.restore();
    ctx.globalAlpha = 1;
    // Under water: a dome of held-back sea, her Surge, and the mark blazing teal.
    if (sink > 0) {
      ctx.globalAlpha = 0.25 + sink * 0.35;
      A_.ellipse(ctx, x, y, 38, 62, 'rgba(53,196,204,.18)', 2.6, '#7feaf0');
      ctx.globalAlpha = 1;
      TG.spiral(ctx, x, y - 32, 7, '#a8f6f8');
      for (let i = 0; i < 6; i++) { const u = (t * 1.4 + i / 6) % 1; A_.circle(ctx, x + Math.sin(i * 2.4 + t * 3) * 30, y + 60 - u * 120, 1.6 + (i % 3), 'rgba(214,246,250,.7)', 0); }
    }
  };

  TG.spiral = function (c, x, y, r, col) {
    c.beginPath();
    for (let i = 0; i <= 26; i++) { const a = i * 0.46, q = r * (1 - i / 30); const px = x + Math.cos(a) * q, py = y + Math.sin(a) * q; if (i) c.lineTo(px, py); else c.moveTo(px, py); }
    c.lineWidth = 3.4; c.strokeStyle = Kit.art.INK; c.lineCap = 'round'; c.stroke();
    c.lineWidth = 1.7; c.strokeStyle = col; c.stroke();
  };

  TG.drawItems = function (ctx, run, under) {
    const w = run.w, A_ = A(), t = run.time, down = w.dive.state === 'down';
    for (const it of w.items) {
      const y = TG.yOf(w, it.at);
      if (y < Kit.view.top - 20 || y > Kit.view.bottom + 20) continue;
      if (it.type === 'cache') {
        if (under && (down || w.dive.state === 'rising')) A_.salvage(ctx, it.x, y, 9, t * 2);
      } else if (under) continue;
      else if (it.type === 'cog') A_.salvage(ctx, it.x, y + Math.sin(t * 3 + it.at) * 2, 7, t * 2 + it.at);
      else if (it.type === 'page') drawPage(ctx, it.x, y, t + it.at);
    }
  };
  function drawPage(c, x, y, t) {
    const A_ = A(), bob = Math.sin(t * 3) * 2;
    A_.circle(c, x, y + bob, 19, 'rgba(255,232,150,.24)', 0);
    c.save(); c.translate(x, y + bob); c.rotate(Math.sin(t * 2) * 0.16);
    A_.poly(c, [[-9, -12], [8, -11], [10, 11], [5, 8], [1, 12], [-4, 9], [-9, 12]], '#efe4c8', 1.8);
    for (let i = 0; i < 4; i++) A_.line(c, -6, -7 + i * 4.6, 6, -7 + i * 4.6, 1, '#6a7ea8');
    c.restore();
    A_.text(c, 'PAGE', x, y - 22 + bob, { size: 12, color: A_.GOLD, align: 'center' });
  }

  TG.drawBobbin = function (ctx, w, t) {
    const b = w.bobbin;
    if (!b || b.gone) return;
    const y = w.shipYNow + 6 + Math.sin(t * 2.4) * 5, p = window.DRIFT_PALS && DRIFT_PALS.get('bobbin');
    if (p) { ctx.save(); ctx.translate(b.x - 21, y - 21); ctx.scale(0.42, 0.42); p.draw(ctx); ctx.restore(); }
    if (b.hold > 0) { const A_ = A(); ctx.beginPath(); ctx.arc(b.x, y, 28, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * b.hold / T.bobbinHold); ctx.lineWidth = 4; ctx.strokeStyle = A_.GOLD; ctx.stroke(); }
  };
  TG.drawMopUnder = function (ctx, w) {
    const m = w.mop;
    if (!m || m.caught || w.dive.state === 'up') return;
    const y = TG.yOf(w, m.at), p = window.DRIFT_PALS && DRIFT_PALS.get('mopclaw');
    if (p && y > -30 && y < 680) { ctx.save(); ctx.translate(m.x - 20, y - 20); ctx.scale(0.4, 0.4); p.draw(ctx); ctx.restore(); }
  };
})();
