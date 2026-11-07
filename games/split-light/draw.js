// Split Light: one frame of the board. Drawing only: nothing in the run changes here. The windows, buttons and read-outs are in hud.js.
window.SL = window.SL || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const now = () => performance.now() / 1000;
  const lerp = (a, b, u) => a + (b - a) * u;

  function corePosition(run, k, t) {
    const w = run.w, L = w.L, core = L.cores[k], cell = SL.coreCell(L, core, w.S.tick);
    const xy = i => ({ x: i % L.cols, y: Math.floor(i / L.cols) });
    const to = xy(cell);
    if (core.rail && w.slideT < T.slideSecs && !run.over) {
      const from = xy(SL.coreCell(L, core, w.fromTick)), u = w.slideT / T.slideSecs, e = u * u * (3 - 2 * u);
      return SL.cellXY(run, lerp(from.x, to.x, e), lerp(from.y, to.y, e));
    }
    return SL.cellXY(run, to.x, to.y);
  }

  // Rails: a brass track, a mark on each stop, and an arrow on the next one.
  function drawRails(c, run, t) {
    const w = run.w, L = w.L, a = A();
    L.cores.forEach((core, k) => {
      if (!core.rail || w.S.hp[k] <= 0) return;
      const pts = core.rail.map(i => SL.cellXY(run, i % L.cols, Math.floor(i / L.cols)));
      c.save();
      c.beginPath();
      pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.closePath();
      c.lineWidth = 7; c.strokeStyle = a.INK; c.lineJoin = 'round'; c.stroke();
      c.lineWidth = 3.6; c.strokeStyle = '#a87f2a'; c.stroke();
      c.restore();
      pts.forEach(p => a.circle(c, p.x, p.y, 6, '#d9a93a', 1.8));
      // The next stop: a ring and an arrow head, flashing in the last second of a clocked stop.
      const here = SL.coreCell(L, core, w.S.tick), nextCell = SL.coreCell(L, core, (w.S.tick + 1) % L.cycle);
      if (nextCell !== here) {
        const n = SL.cellXY(run, nextCell % L.cols, Math.floor(nextCell / L.cols)), h = SL.cellXY(run, here % L.cols, Math.floor(here / L.cols));
        const warn = L.mode === 'clock' && w.warned, on = !warn || Math.floor(t * 8) % 2 === 0, col = warn ? a.ORANGE : a.GOLD;
        if (on) {
          a.circle(c, n.x, n.y, 15, null, 2.6, col);
          const an = Math.atan2(n.y - h.y, n.x - h.x);
          c.save(); c.translate(n.x - Math.cos(an) * 19, n.y - Math.sin(an) * 19); c.rotate(an);
          a.poly(c, [[-7, -7], [5, 0], [-7, 7]], col, 1.6);
          c.restore();
        }
      }
    });
  }

  // The link between linked cores: a slack steel cable with brass ties, hanging in a curve. Beams only ever run straight and bright, so it can't be read as one.
  function drawTwinCable(c, run, t) {
    const w = run.w, L = w.L, a = A(), pts = [];
    L.cores.forEach((core, k) => { if (core.twin && w.S.hp[k] > 0) pts.push(corePosition(run, k, t)); });
    if (pts.length < 2) return;
    c.save();
    c.lineCap = 'round';
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i], mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 + Math.min(90, 14 + Math.hypot(q.x - p.x, q.y - p.y) * 0.34);
      const curve = () => { c.beginPath(); c.moveTo(p.x, p.y); c.quadraticCurveTo(mx, my, q.x, q.y); };
      curve(); c.lineWidth = 6.4; c.strokeStyle = a.INK; c.stroke();
      curve(); c.lineWidth = 3.4; c.strokeStyle = '#59606b'; c.stroke();
      [0.25, 0.5, 0.75].forEach(u => {
        const v = 1 - u, x = v * v * p.x + 2 * v * u * mx + u * u * q.x, y = v * v * p.y + 2 * v * u * my + u * u * q.y;
        a.circle(c, x, y, 3.2, '#c99a3a', 1.5);
      });
    }
    c.restore();
  }

  // The clock: a ring round a core on a clocked rail or with a turning opening, draining over the stop. Orange for the last second.
  function drawClockRing(c, x, y, r, frac, warn) {
    const a = A();
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.lineWidth = 5; c.strokeStyle = a.INK; c.stroke();
    c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.lineWidth = 3; c.strokeStyle = warn ? a.ORANGE : '#f5efe2'; c.stroke();
  }

  SL.render = function (c, run, view) {
    const w = run.w, L = w.L, t = now(), a = A(), P = SL.place(run), set = w.boss ? 4 : run.stage.level.set;
    SL.drawRoom(c, view, set);
    SL.topStrip(c, run, view);
    SL.stamp(c, SL.boardBake(L.cols, L.rows), P.ox, P.oy);
    if (w.gap > 0) { c.globalAlpha = 0.5; }
    SL.drawGhost(c, run);
    drawRails(c, run, t);
    drawTwinCable(c, run, t);
    SL.drawAim(c, run, t);

    // Pieces.
    L.pieces.forEach((p, i) => {
      if (!p) return;
      const X = P.ox + (i % L.cols + 0.5) * T.cell, Y = P.oy + (Math.floor(i / L.cols) + 0.5) * T.cell;
      if (p.t === 'p') { SL.drawPiece(c, 'p', X, Y); return; }
      const kind = p.t === 'c' ? 'c' : p.t;
      SL.drawPiece(c, kind, X, Y, kind === 'f' ? p.o : w.lean[i], w.turnT[i] || 0);
      // The very first board shows where the thumb goes.
      if (run.index === 0 && !w.touched && kind === 'c') { c.globalAlpha = 0.5 + Math.sin(t * 5) * 0.4; a.circle(c, X, Y, 25, null, 3, a.GOLD); c.globalAlpha = 1; }
      if (w.corrected && w.corrected.cell === i) {
        const u = w.corrected.t;
        a.circle(c, X, Y, 24 + (T.correctShowSecs - u) * 6, null, 3, '#ffffff');
        a.text(c, 'CORRECTED', X, Y - 30, { size: 12, color: '#ffffff', align: 'center', lw: 3 });
      }
    });
    w.S.g.forEach(i => {
      const X = P.ox + (i % L.cols + 0.5) * T.cell, Y = P.oy + (Math.floor(i / L.cols) + 0.5) * T.cell;
      const g = w.growT[i] || 0;
      SL.drawPiece(c, 'g', X, Y, 0, w.turnT[i] || 0, g > 0 && !run.over ? 1 - g / T.growSecs : undefined);
      if (w.scraping) { c.globalAlpha = 0.6 + Math.sin(t * 8) * 0.3; a.circle(c, X, Y, 24, null, 3, a.ORANGE); c.globalAlpha = 1; }
    });

    // Cores.
    L.cores.forEach((core, k) => {
      const pos = corePosition(run, k, t);
      if (w.S.hp[k] <= 0) { SL.drawDeadCore(c, pos.x, pos.y, core, run.over ? 0 : (w.popT[k] || 0) / T.popSecs); return; }
      const open = SL.coreOpen(core, w.S.tick, w.S.sealed);
      SL.drawCore(c, pos.x, pos.y, core, t, { flash: w.flashCore[k] || 0, open, nextOpen: core.sides ? core.sides[(w.S.tick + 1) % core.sides.length] : null, sealed: w.S.sealed, hp: w.S.hp[k], warn: w.warned });
      if (L.mode === 'clock' && (core.rail || core.sides) && !w.dead) {
        drawClockRing(c, pos.x, pos.y, core.big ? 25 : 24, Math.max(0, 1 - w.clockT / L.clock), w.warned);
      }
    });

    // Prism and her perches.
    L.perches.forEach((p, i) => {
      const X = P.ox + (p.x + 0.5) * T.cell, Y = P.oy + (p.y + 0.5) * T.cell;
      if (i !== w.perch) SL.drawPerch(c, X, Y, p.dx, p.dy, t, !SL.busy(w));
    });
    const here = L.perches[w.perch], px = P.ox + (here.x + 0.5) * T.cell, py = P.oy + (here.y + 0.5) * T.cell;
    a.circle(c, px, py, 21, '#2a2448', 2.2);
    a.circle(c, px, py, 17, null, 2.4, '#d9a93a');
    SL.drawPrism(c, px, py, here.head, w.beam && w.beam.t < 3 ? 1 - w.beam.t / 3 : 0, t);
    c.globalAlpha = 1;

    if (w.beam) SL.drawBeam(c, run, w.beam);

    if (w.cursor) { const C = SL.cellXY(run, w.cursor.x, w.cursor.y); c.strokeStyle = a.GOLD; c.lineWidth = 3; c.strokeRect(C.x - T.cell / 2 + 2, C.y - T.cell / 2 + 2, T.cell - 4, T.cell - 4); }

    // A pal, if one has come.
    if (w.pal && window.DRIFT_PALS) {
      const def = DRIFT_PALS.get(w.pal.id), s = 0.5, up = w.pal.hop || 0;
      c.save(); c.translate(w.pal.x - 25, w.pal.y - 44 - up); c.scale(s, s); def.draw(c); c.restore();
    }

    // The dead-board banner, across the board's middle.
    if (w.dead && !run.over) {
      const y = P.oy + L.rows * T.cell / 2;
      a.poly(c, [[10, y - 30], [350, y - 30], [342, y + 30], [2, y + 30]], 'rgba(12,16,38,.94)', 2.6);
      a.line(c, 10, y - 29, 350, y - 29, 2.4, a.ORANGE);
      a.text(c, 'NO WAY THROUGH', 180, y - 9, { size: 24, color: a.ORANGE, align: 'center' });
      const opts = [w.undos > 0 && w.history.length ? 'undo' : null, w.scrapes > 0 && w.S.g.length && w.S.shots > 0 ? 'scrape' : null, w.boss ? 'reset' : 'retry'].filter(Boolean).join(', ');
      a.text(c, opts.charAt(0).toUpperCase() + opts.slice(1) + (w.boss ? ' (costs nerve)' : ''), 180, y + 15, { size: 14, body: true, color: a.PAPER, align: 'center' });
    }
    if (w.gap > 0 && w.boss && w.boss.gapDo === 'next') {
      const y = P.oy + L.rows * T.cell / 2;
      a.poly(c, [[6, y - 30], [354, y - 30], [346, y + 30], [-2, y + 30]], 'rgba(12,16,38,.94)', 2.6);
      a.text(c, 'BOARD ' + w.boss.phase + ' OF 3 DOWN', 180, y - 9, { size: 24, color: a.GOLD, align: 'center' });   // phase has already moved on to the next board
      a.text(c, 'Next board', 180, y + 15, { size: 14, body: true, color: a.PAPER, align: 'center' });
    }
  };
})();
