// Hot Hand: the read-outs. Along the felt at the bottom: her palm, the heat bar, her hits. Along the top: the wave, the table, what's riding.
// The talk box in play sits at the bottom right (sayAt: 'corner'), so everything here keeps left of x = 318 at the bottom and clear of the middle at the top.
window.HH = window.HH || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const BAR = { x: 62, y: 321, w: 214, h: 15 };
  const heatX = h => BAR.x + BAR.w * Math.min(1, h / T.heatMax);

  // Her hand, in a fingerless glove, palm toward you: the bond cost, close up. Base state: scarred and blistered (CAST.md). The burns she's carrying this run stay on it.
  function paintPalm(c) {
    const A_ = A(), skin = '#dba475', glove = '#1c1a20';
    A_.joined(c, [
      { a: [-13, -12], b: [-15, -27], ra: 3.7, rb: 3.1, color: skin, noShade: true }, { a: [-4, -14], b: [-5, -32], ra: 3.9, rb: 3.2, color: skin, noShade: true },
      { a: [5, -14], b: [5, -31], ra: 3.9, rb: 3.2, color: skin, noShade: true }, { a: [14, -12], b: [15, -25], ra: 3.5, rb: 2.9, color: skin, noShade: true },
      { a: [18, 4], b: [28, -10], ra: 4.4, rb: 3.2, color: skin, noShade: true },
    ], 1.6);
    A_.blob(c, [[-18, -14], [20, -14], [22, 8], [15, 22], [-13, 22], [-20, 8]], glove, 1.8);
    A_.poly(c, [[-16, 15], [17, 15], [14, 22], [-13, 22]], '#ead9bd', 1.2);
    A_.poly(c, [[-12, -10], [14, -10], [15, 7], [8, 13], [-7, 13], [-13, 6]], '#c98a62', 1.2);   // the bare, scarred palm in the cut-out
    A_.line(c, -9, -3, 8, 3, 1.1, '#9a5f3e'); A_.line(c, -5, 7, 10, -5, 1.1, '#9a5f3e');
    A_.circle(c, -5, 2, 2.1, '#e8b89a', 0.7); A_.circle(c, 6, 7, 1.7, '#e8b89a', 0.7);   // old blisters
  }
  function drawPalm(c, w, t, burns) {
    const A_ = A(), x = 32, y = 336, locked = w.lockT > 0, heat = w.heat / T.heatMax, jolt = w.deadTap > 0 ? Math.sin(t * 60) * 2 : locked ? Math.sin(t * 44) * 1.2 : 0;
    if (locked) { c.save(); c.globalAlpha = 0.7; A_.circle(c, x + jolt, y - 6, 30, '#ff3a1e', 0); c.restore(); }
    c.save(); c.translate(x + jolt, y); c.scale(0.9, 0.9);
    HH.stamp(c, HH.bake('palm', 80, 80, 40, 44, paintPalm), 0, 0);
    const tier = HH.tier(w.heat);
    // The palm reddens, then cracks with ember light, as heat climbs
    if (heat > 0.2) { c.save(); c.globalAlpha = Math.min(0.75, heat * 0.8); A_.poly(c, [[-12, -10], [14, -10], [15, 7], [8, 13], [-7, 13], [-13, 6]], '#d8401a', 0); c.restore(); }
    if (tier >= 2 || locked) { A_.line(c, -9, -3, 8, 3, 1.6, '#ffe46a'); A_.line(c, -5, 7, 10, -5, 1.6, '#ffe46a'); }
    if (tier >= 3 || locked) { A_.line(c, 8, 3, 13, -8, 1.3, '#fff2b0'); A_.line(c, -9, -3, -11, 6, 1.3, '#fff2b0'); }
    // Burns carried this story run: each one a raw patch that stays
    [[-3, -6], [8, -3], [1, 9]].slice(0, burns).forEach(p => { A_.circle(c, p[0], p[1], 3.6, '#7a1c10', 0.9); A_.circle(c, p[0] - 0.6, p[1] - 0.6, 1.6, '#e8583a', 0); });
    c.restore();
  }

  function drawBar(c, w, t) {
    const A_ = A(), { x, y, w: bw, h } = BAR, top = HH.safeTop(), over = w.heat > top, tier = HH.tier(w.heat);
    A_.poly(c, [[x, y], [x + bw, y], [x + bw, y + h], [x, y + h]], '#10121f', 0);
    const zone = (a, b, col) => { c.fillStyle = col; c.fillRect(heatX(a), y + 2, heatX(b) - heatX(a), h - 4); };
    zone(0, T.warmAt, '#3a3142'); zone(T.warmAt, T.hotAt, '#4a3038'); zone(T.hotAt, T.edgeAt, '#5a2c26'); zone(T.edgeAt, top, '#7a6a22'); zone(top, T.heatMax, '#5a1416');
    if (w.lockT > 0) {
      c.fillStyle = '#d8281a'; c.fillRect(x + 2, y + 2, (bw - 4) * (w.lockT / w.lockFull), h - 4);
    } else {
      c.fillStyle = over ? '#ff3a1e' : HH.TIER_COLOURS[tier === 0 ? 0 : tier];
      c.fillRect(x + 2, y + 2, Math.max(0, heatX(w.heat) - x - 2), h - 4);
      // Where the next throw would take her. Red and flashing past the top: wait.
      const next = w.heat + T.throwHeat, nx = heatX(next);
      c.fillStyle = next > T.heatMax ? (Math.floor(t * 8) % 2 ? 'rgba(255,40,20,.85)' : 'rgba(255,255,255,.6)') : 'rgba(255,255,255,.34)';
      c.fillRect(heatX(w.heat), y + 2, Math.max(0, nx - heatX(w.heat)), h - 4);
    }
    [T.warmAt, T.hotAt, T.edgeAt, top].forEach(v => A_.line(c, heatX(v), y - 1, heatX(v), y + h + 1, 1.5, v === top ? '#ff3a1e' : A_.PAPER));
    A_.poly(c, [[x, y], [x + bw, y], [x + bw, y + h], [x, y + h]], null, 2);
    // The word for where she is, right over the bar's fill, big enough to read at a glance
    const label = w.lockT > 0 ? 'HANDS LOCKED' : over ? 'TOO HOT: WAIT' : w.quenchT > 0 ? 'QUENCHED' : HH.TIERS[tier];
    const col = w.lockT > 0 || over ? '#ff6a4a' : w.quenchT > 0 ? '#bfe1ff' : HH.TIER_COLOURS[tier];
    A_.text(c, label, x + 2, y + h + 13, { size: tier === 3 && !over ? 18 : 15, color: col, lw: 3 });
  }

  function drawHits(c, w) {
    const A_ = A();
    for (let i = 0; i < w.hpMax; i++) {
      const x = 268 - (w.hpMax - 1 - i) * 15, y = 345, on = i < w.hp;
      A_.poly(c, [[x, y - 7], [x + 4.6, y - 1], [x + 3, y + 4], [x, y + 8], [x - 3, y + 4], [x - 4.6, y - 1]], on ? '#ff8a2a' : '#2a2438', 1.5);
      if (on) A_.poly(c, [[x, y - 2], [x + 2, y + 1], [x, y + 5], [x - 2, y + 1]], '#ffe46a', 0);
    }
  }

  // Up top, in the middle: wave pips, and the money.
  function drawTop(c, run, t) {
    const A_ = A(), w = run.w, cx = 320;
    if (run.endless) A_.text(c, 'WAVE ' + (w.wave + 1), cx, 13, { size: 16, color: A_.GOLD, align: 'center' });
    else if (run.boss) {
      const b = w.boss, total = b.krell.hp + T.krellHp.slice(b.round + 1).reduce((s, v) => s + v, 0);
      A_.text(c, 'WARDEN KRELL', cx - 92, 13, { size: 14, color: '#dfe2ea', align: 'right' });
      A_.bar(c, cx - 86, 7, 172, 11, Math.max(0, total) / b.totalHp, '#ff5a1e');
      for (let i = 0; i < T.bossRounds; i++) A_.circle(c, cx + 100 + i * 14, 13, 4.5, i < b.round ? '#2a2438' : '#ff8a2a', 1.5);
    } else {
      const n = HH.waveCount(run);
      for (let i = 0; i < n; i++) { const x = cx - (n - 1) * 13 + i * 26; A_.poly(c, [[x - 10, 8], [x + 10, 8], [x + 8, 18], [x - 8, 18]], i < w.wave ? A_.GOLD : i === w.wave ? '#ff8a2a' : '#2a2438', 1.6); }
    }
    // Table and stake. The chips are real numbers: what's riding is what you can lose.
    const y = 34, riding = w.stake > 0;
    if (w.bustT > 0) { // A bet lost has to show: it fills the top of the screen and rattles
      const u = w.bustT / T.bustSecs, s = 1 + (1 - u) * 0.12, jit = u > 0.7 ? (Math.random() - 0.5) * 5 : 0;
      c.save(); c.globalAlpha = Math.min(1, u * 2.4);
      A_.poly(c, [[cx - 130 + jit, 22], [cx + 130 + jit, 22], [cx + 118 + jit, 76], [cx - 118 + jit, 76]], '#3a0c10', 2.6);
      c.translate(cx + jit, 49); c.scale(s, s);
      A_.text(c, 'BUST!  -' + w.lastBust, 0, 0, { size: 36, color: '#ff5a3a', align: 'center', lw: 5 });
      c.restore();
    } else if (w.winT > 0) {
      const u = w.winT / T.bustSecs;
      c.save(); c.globalAlpha = Math.min(1, u * 2.4);
      A_.poly(c, [[cx - 130, 22], [cx + 130, 22], [cx + 118, 76], [cx - 118, 76]], '#2a3a12', 2.6);
      A_.text(c, 'DOUBLED!  +' + w.wonLast, cx, 49, { size: 34, color: A_.GOLD, align: 'center', lw: 5 });
      c.restore();
    } else if (riding) {
      const pulse = 1 + Math.sin(t * 7) * 0.03;
      c.save(); c.translate(cx, y + 9); c.scale(pulse, pulse);
      A_.poly(c, [[-122, -12], [122, -12], [115, 12], [-115, 12]], '#3a1214', 2.2);
      drawChips(c, -106, 7, Math.min(5, 1 + Math.floor(w.stake / 6)));
      A_.text(c, 'RIDING ' + w.stake + ' FOR ' + Math.round(w.stake * HH.betX(run)), -92, 0, { size: 15, color: '#ffb35a' });
      A_.text(c, 'TABLE ' + HH.tableNow(run), 110, 0, { size: 13, color: A_.GOLD, align: 'right', lw: 3 });
      c.restore();
    } else if (w.phase === 'wave') A_.text(c, 'TABLE ' + HH.tableNow(run), cx, y - 3, { size: 14, color: A_.GOLD, align: 'center', lw: 3 });
  }
  function drawChips(c, x, y, n) {
    const A_ = A();
    for (let i = 0; i < n; i++) A_.ellipse(c, x, y - i * 4, 9, 4, i % 2 ? '#efe6d2' : '#b32a2a', 1.3);
  }

  // A hint too wide for the screen breaks in two at the space nearest its middle.
  function hintLines(c, hint) {
    if (c.measureText(hint).width + 30 <= T.hintWide) return [hint];
    const mid = hint.length / 2, a = hint.lastIndexOf(' ', mid), b = hint.indexOf(' ', mid), at = b < 0 || mid - a < b - mid ? a : b;
    return [hint.slice(0, at), hint.slice(at + 1)];
  }

  HH.hud = function (c, run, view) {
    const A_ = A(), w = run.w, t = run.time;
    A_.hud(c, run, view);
    const burns = Math.min(T.burnsMax, run.carry.burns || 0);
    drawPalm(c, w, t, burns);
    drawBar(c, w, t);
    drawHits(c, w);
    drawTop(c, run, t);
    if (w.bannerT > 0 && w.phase === 'wave' && !run.endless) {
      const u = Math.min(1, w.bannerT * 2);
      c.globalAlpha = u;
      A_.text(c, run.boss ? 'ROUND ' + (w.wave + 1) : 'WAVE ' + (w.wave + 1), 320, 118, { size: 34, color: A_.PAPER, align: 'center', lw: 5 });
      c.globalAlpha = 1;
    }
    if (w.phase === 'wave' && w.wave === 0 && run.stage.hint && t < T.hintSecs && w.bustT <= 0) {
      c.globalAlpha = Math.min(1, T.hintSecs - t);
      c.font = '800 ' + T.hintSize + 'px Barlow, system-ui, sans-serif';
      const lines = hintLines(c, run.stage.hint), tw = Math.max(...lines.map(l => c.measureText(l).width)) + 30, bh = 22 + (lines.length - 1) * (T.hintSize + 4);
      A_.poly(c, [[320 - tw / 2, 54], [320 + tw / 2, 54], [320 + tw / 2 - 6, 54 + bh], [320 - tw / 2 + 6, 54 + bh]], 'rgba(12,16,38,.82)', 0);
      lines.forEach((l, i) => A_.text(c, l, 320, 65 + i * (T.hintSize + 4), { size: T.hintSize, body: true, color: A_.PAPER, align: 'center', lw: 2.5 }));
      c.globalAlpha = 1;
    }
    // Stage 1: until she's thrown, point at the first trooper in reach.
    if (run.index === 0 && w.throws === 0 && w.foes.length) {
      const f = w.foes.filter(o => o.x < T.botEdge).sort((a, b) => a.d - b.d)[0];
      if (f) { const b = 8 + Math.sin(t * 7) * 5, y = HH.box(f).y0 - 8 - b; A_.poly(c, [[f.x - 8, y - 20], [f.x + 8, y - 20], [f.x + 8, y - 8], [f.x + 15, y - 8], [f.x, y + 6], [f.x - 15, y - 8], [f.x - 8, y - 8]], A_.GOLD, 2); A_.text(c, 'TAP', f.x, y - 30, { size: 18, color: A_.GOLD, align: 'center' }); }
    }
  };
})();
