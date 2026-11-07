// Split Light: what sits round the board: the strip above it (level name and the one idea), the shots row, Ione's window, Vasch's window, the buttons.
// The talk box uses the strip above the board on small screens, so nothing there is needed while someone is talking, and the name and hint step aside.
window.SL = window.SL || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // Word-wraps a line of body text. Returns how many lines it took.
  function wrap(c, s, x, y, maxW, lh, o) {
    const a = A();
    c.font = '800 ' + o.size + 'px Barlow, system-ui, sans-serif';
    const words = s.split(' ');
    let line = '', n = 0;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (c.measureText(test).width > maxW && line) { a.text(c, line, x, y + n * lh, o); line = word; n++; }
      else line = test;
    }
    if (line) { a.text(c, line, x, y + n * lh, o); n++; }
    return n;
  }

  SL.topStrip = function (c, run, view) {
    const w = run.w, a = A(), roomy = view.top < -90;   // on tall phones the talk box sits above all this
    if (w.sayT > 0 && !roomy) return;
    const spec = w.boss ? SL.BOSS[w.boss.phase] : run.stage.level;
    a.poly(c, [[6, 8], [306, 8], [298, 86], [-2, 86]], 'rgba(12,16,38,.72)', 0);
    const title = w.boss ? 'DIRECTOR VASCH  ' + (w.boss.phase + 1) + ' OF 3' : (run.index + 1) + '. ' + (run.stage.name || '').toUpperCase();
    a.text(c, title, 12, 24, { size: 20, color: a.GOLD });
    const hint = Math.max(14, T.hintCss / view.scale);   // the scale follows the visible height: on short screens the hint keeps a size that can be read
    wrap(c, spec.idea, 12, 48, 282, hint * 1.28, { size: hint, body: true, color: a.PAPER, lw: 3 });
  };

  function hex(c, x, y, r, fill, lw) {
    const pts = [];
    for (let i = 0; i < 6; i++) { const an = Math.PI / 6 + i * Math.PI / 3; pts.push([x + Math.cos(an) * r, y + Math.sin(an) * r]); }
    A().poly(c, pts, fill, lw);
  }

  function shotsRow(c, run) {
    const w = run.w, a = A(), room = (w.boss ? T.bossRows : T.rows) * T.cell, y = T.top + room + T.hudH / 2 + 4, L = w.L;
    a.text(c, 'SHOTS', 8, y, { size: 15, color: a.PAPER });
    for (let i = 0; i < L.shots; i++) hex(c, 58 + i * 17, y, 7.5, i < w.S.shots ? '#8fd3f0' : '#2a2f4a', 1.7);
    const coresLeft = w.S.hp.filter(h => h > 0).length;
    if (w.boss) {
      a.text(c, 'NERVE', 268, y, { size: 15, color: a.PAPER, align: 'right' });
      for (let i = 0; i < T.bossNerve; i++) hex(c, 281 + i * 17, y, 7.5, i < w.boss.nerve ? a.ORANGE : '#2a2f4a', 1.7);
    } else {
      const used = w.fired + w.boardFired;   // every shot on this stage, Retry or not: it's what the pay goes by
      a.text(c, 'USED ' + used + '  PAR ' + L.par, 354, y, { size: 16, color: used <= L.par && !w.fired ? a.GOLD : a.ORANGE, align: 'right' });   // after a Retry with shots gone, par is out of reach
      a.circle(c, 150, y, 7, '#ffffff', 1.8);
      a.text(c, String(coresLeft), 162, y, { size: 16, color: a.PAPER });
    }
  }

  function button(c, b, pressed, t) {
    const a = A(), s = 7, off = pressed ? 2 : 0, y = b.y + off;
    const pts = [[b.x + s, y], [b.x + b.w, y], [b.x + b.w - s, y + b.h], [b.x, y + b.h]];
    const fill = !b.on ? '#232842' : b.main ? a.ORANGE : b.lit ? a.GOLD : '#2b3462';
    if (!pressed) a.poly(c, pts.map(p => [p[0], p[1] + 3]), a.INK, 0);
    a.poly(c, pts, fill, 2.4);
    a.poly(c, [[b.x + s, y], [b.x + b.w, y], [b.x + b.w - 1.5, y + 4], [b.x + s - 1.5, y + 4]], !b.on ? '#2c3254' : b.main ? '#ff9a55' : '#3d4880', 0);
    a.poly(c, pts, null, 2.4);
    const size = b.id === 'fire' ? 34 : b.w < 80 ? 16 : 20;
    a.text(c, b.label, b.x + b.w / 2, y + b.h / 2, { size, color: !b.on ? '#6d7290' : b.lit ? a.INK : a.PAPER, align: 'center', lw: b.on && !b.lit ? 3 : 0, ink: !!(b.on && !b.lit) });
    if (b.main && (b.id === 'retry' || b.pulse)) { c.globalAlpha = 0.45 + Math.sin(t * 6) * 0.35; a.poly(c, pts, null, 3.4, '#ffffff'); c.globalAlpha = 1; }
  }

  // His count of ten, on FIRE, where the thumb is. White as it climbs, flashing from the point it starts to tick.
  function countRow(c, run, t) {
    const w = run.w, a = A(), b = SL.buttons(run).find(x => x.id === 'fire');
    if (!w.L.spec.count || run.over) return;
    const n = Math.floor(SL.countOf(w)), y = b.y + b.h - 15, gap = (b.w - 30) / 9;
    a.text(c, 'HIS COUNT', b.x + b.w / 2, y - 15, { size: 13, color: b.on ? a.PAPER : '#6d7290', align: 'center' });
    for (let i = 0; i < 10; i++) {
      const lit = i < n, hot = n >= T.countLoudFrom && Math.floor(t * 6) % 2 === 0;
      hex(c, b.x + 13 + i * gap, y, 4.8, lit ? (hot ? a.GOLD : '#ffffff') : '#1a1f3c', 1.4);
    }
  }

  SL.hud = function (c, run, view) {
    const w = run.w, room = (w.boss ? T.bossRows : T.rows) * T.cell, panelY = T.top + room + T.hudH + T.panelGap, t = performance.now() / 1000;
    shotsRow(c, run);
    const rowY = T.screenBottom - SL.rowH();
    if (w.boss) {
      SL.ioneWindow(c, run, 4, panelY, 108, rowY - panelY - T.fireRowGap);
      SL.vaschWindow(c, run, 248, panelY, 108, rowY - panelY - T.fireRowGap);
    } else SL.ioneWindow(c, run, 6, panelY, 108, T.screenBottom - panelY);
    SL.buttons(run).forEach(b => button(c, b, w.press === 'b:' + b.id && b.on, t));
    countRow(c, run, t);
    if (w.scraping && !run.over) A().text(c, 'TAP A GROWTH TO SCRAPE IT', 180, T.top - 12, { size: 15, color: A().ORANGE, align: 'center' });
  };
})();
