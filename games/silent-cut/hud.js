// Silent Cut: what's on top of play. The breath panel is the bond cost: three feather marks from his neck (CAST.md), one Surge each. It sits in the band under the street with the alarm bells; the talk box has the right of the band.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // A feather mark, as on Silas's neck: a short teardrop with a spine.
  function feather(c, x, y, s, fill, ink) {
    const A_ = A();
    A_.blob(c, [[x, y - 11 * s], [x + 6 * s, y - 3 * s], [x + 4 * s, y + 7 * s], [x, y + 11 * s, 1], [x - 4 * s, y + 7 * s], [x - 6 * s, y - 3 * s]], fill, 1.7, ink);
    A_.line(c, x, y - 7 * s, x, y + 9 * s, 1.1, A_.INK);
  }

  function bell(c, x, y, rung) {
    const A_ = A(), col = rung ? '#ff5a3a' : '#39345c';
    A_.blob(c, [[x - 9, y + 8], [x - 7, y - 3], [x - 4, y - 9], [x + 4, y - 9], [x + 7, y - 3], [x + 9, y + 8]], col, 2);
    A_.poly(c, [[x - 11, y + 7], [x + 11, y + 7], [x + 11, y + 10], [x - 11, y + 10]], rung ? '#ffae6a' : '#4b4670', 1.6);
    A_.circle(c, x, y + 12, 2.2, rung ? '#ffe39a' : '#4b4670', 1.2);
  }

  function breathPanel(c, w, t) {
    const A_ = A(), s = w.s, x = 10, y = T.hudY + 22, panelW = 160, cost = T.surgeCost;
    A_.poly(c, [[x + 6, y], [x + panelW + 6, y], [x + panelW - 6, y + 44], [x - 6, y + 44]], 'rgba(12,16,38,.82)', 2, s.winded ? '#ff8a6a' : '#6c5fa8');
    // One feather for each Surge the chest holds, lit while there's breath for it.
    const n = Math.floor((s.chest + 1e-6) / cost), glow = s.dash > 0 ? 1 : 0, gap = n > 4 ? 76 / (n - 1) : 19;   // Deep Lungs can make six: they close up to stay clear of the label
    for (let i = 0; i < n; i++) {
      const full = s.breath + 1e-6 >= (i + 1) * cost, part = !full && s.breath > i * cost;
      const col = full ? (glow ? '#ffffff' : '#b190ff') : part ? '#5a4c94' : '#2b2850';
      feather(c, x + 16 + i * gap, y + 16, 1, col);
    }
    // The bar under them. Grey hatching at the far end is chest he's lost for this run.
    const bx = x + 6, by = y + 32, bw = 130;
    const base = 1 + (w.chestBonus || 0), frac = s.breath / Math.max(s.chest, base), used = s.chest / Math.max(s.chest, base);
    A_.bar(c, bx, by, bw, 8, frac, s.winded ? '#8d7cc0' : '#a78bf0');
    if (used < 0.999) { A_.poly(c, [[bx + bw * used, by + 1], [bx + bw, by + 1], [bx + bw - 3, by + 7], [bx + bw * used - 3, by + 7]], '#5c5c70', 0); }
    if (s.winded) {
      c.globalAlpha = 0.8 + Math.sin(t * 8) * 0.2;
      A_.text(c, '...', x + 80, y + 14, { size: 26, color: '#ffffff', align: 'center', lw: 4 });
      c.globalAlpha = 1;
      A_.text(c, 'NO BREATH', x + panelW - 6, y + 12, { size: 15, color: '#ff8a6a', align: 'right', lw: 2.5 });
    } else A_.text(c, SC.WORDS.voiceLabel[w.rasp] || 'BREATH', x + panelW - 6, y + 11, { size: 13, color: w.rasp ? '#ff8a6a' : '#cdbcff', align: 'right', lw: 2.5 });
  }

  function progress(c, run, view) {
    const A_ = A(), w = run.w, cx = view.w / 2, s = w.s;
    if (w.boss) {
      A_.text(c, 'MARO', cx - 56, 16, { size: 16, color: '#e2bcd8', align: 'right' });
      for (let i = 0; i < T.maroHits; i++) { A_.circle(c, cx - 38 + i * 26, 16, 9, '#3d3048', 2); A_.circle(c, cx - 38 + i * 26, 16, 5, i < w.boss.hp ? '#e2bcd8' : '#20182a', 0); }
      return;
    }
    if (run.endless) { A_.text(c, Math.floor(s.x / 10) + ' m', cx, 16, { size: 18, color: A_.GOLD, align: 'center' }); return; }
    A_.bar(c, cx - 90, 11, 180, 10, s.x / w.exitX, A_.GOLD);
  }

  SC.hud = function (c, run, view) {
    const A_ = A(), w = run.w, s = w.s, t = run.time;
    A_.hud(c, run, view);
    progress(c, run, view);
    breathPanel(c, w, t);
    // Alarms: three bells beside the breath panel
    A_.text(c, 'ALARMS', 186, T.hudY + 30, { size: 12, color: '#cdbcff', lw: 2.5 });
    for (let i = 0; i < T.maxAlarms; i++) bell(c, 196 + i * 26, T.hudY + 50, i < w.alarms);

    // The lamp line coming up: a warning on the left edge, as soon as it's near.
    const gap = s.x - w.line;
    if (gap < T.lineShowAt) {
      const urgent = gap < T.lineUrgentAt;
      c.globalAlpha = urgent ? 0.75 + Math.sin(t * 12) * 0.25 : 1;
      A_.text(c, 'LAMP LINE ' + Math.max(0, Math.round((gap - T.halfW) / 10)) + ' m', Math.max(view.left + 10, 8), 70, { size: 15, color: urgent ? '#ff8a4a' : '#f4c152', lw: 3 });
      c.globalAlpha = 1;
    }

    // A tip along the top, clear of the street, the read-outs and the pause button. Out of breath in the light is the moment that matters most, so it takes the place over, for as long as it lasts and in every mode.
    const hot = s.winded && s.lastLit && !s.hidden, tip = hot ? SC.WORDS.tips.windedLit : w.tipT > 0 ? w.tip : null;
    if (tip) {
      c.globalAlpha = hot ? 1 : Math.min(1, w.tipT);
      c.font = '800 14px Barlow, system-ui, sans-serif';
      const tw = Math.min(view.w - 120, c.measureText(tip).width + 26), cx = view.w / 2;
      A_.poly(c, [[cx - tw / 2 + 6, 28], [cx + tw / 2 + 6, 28], [cx + tw / 2 - 6, 52], [cx - tw / 2 - 6, 52]], 'rgba(12,16,38,.86)', 2, hot ? '#ff8a6a' : '#6c5fa8');
      A_.text(c, tip, cx, 40, { size: 14, body: true, color: A_.PAPER, align: 'center', ink: false });
      c.globalAlpha = 1;
    }
  };
})();
