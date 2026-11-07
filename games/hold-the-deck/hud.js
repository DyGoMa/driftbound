// Hold the Deck: the read-outs, on the galley counter along the bottom. The body icon shows the iron spreading; Grist's button shows his temper; anvils are Guts.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  function anvil(c, x, y, on) {
    const A_ = A(), col = on ? '#ff7a2a' : '#2f2230';
    A_.poly(c, [[x - 8, y - 6], [x + 8, y - 6], [x + 5, y - 2], [x + 3, y - 2], [x + 3, y + 1], [x + 6, y + 6], [x - 6, y + 6], [x - 3, y + 1], [x - 3, y - 2], [x - 5, y - 2]], col, 1.4);
  }

  // The body icon: Bram from the front, with the same grey in the same places as the figure in the lane, and the number under it.
  function bodyIcon(c, run, t) {
    const A_ = A(), w = run.w, iron = run.carry.iron || 0, x = 8, y = 542, W = 74, H = 92;
    A_.poly(c, [[x, y], [x + W, y], [x + W - 4, y + H], [x - 4, y + H]], w.ironOn ? '#3d2a22' : '#1a1c30', 2, iron >= 1 ? '#c9ced8' : '#ff9a4a');
    c.save();
    c.beginPath(); c.rect(x - 4, y, W + 4, H - 16); c.clip();
    HD.drawBram(c, run, x + W / 2 - 2, y + H - 20, 66, { view: 'front', pose: w.ironOn ? 'iron' : 'idle', t: 0, iron, heat: w.ironOn });
    c.restore();
    const col = iron >= 1 ? '#ffffff' : iron >= T.ironLineAt ? '#ffb27a' : '#c9ced8';
    A_.text(c, iron >= 1 ? 'ALL IRON' : 'IRON ' + Math.round(iron * 100) + '%', x + W / 2 - 2, y + H - 9, { size: 16, color: col, align: 'center' });
  }

  function gristButton(c, run, t) {
    const A_ = A(), w = run.w, B = T.btn, ready = HD.canCharge(w), away = w.grist || w.gristAway > 0, waiting = !ready && !away && w.temper >= 1;
    const pulse = ready ? 0.5 + 0.5 * Math.sin(t * 8) : 0;
    A_.poly(c, [[B.x + 4, B.y], [B.x + B.w, B.y], [B.x + B.w - 4, B.y + B.h], [B.x, B.y + B.h]], ready ? '#5a2a14' : '#1a1c30', ready ? 2.4 + pulse * 1.4 : 2, ready ? A_.GOLD : '#556');
    c.save();
    c.beginPath(); c.rect(B.x + 2, B.y + 2, B.w - 4, B.h - 22); c.clip();
    if (!away) HD.drawGristSide(c, B.x + B.w / 2 - 4, B.y + B.h - 28, 0.52, ready || waiting, t);
    c.restore();
    if (away) A_.text(c, 'GONE', B.x + B.w / 2, B.y + 32, { size: 18, color: '#8d93b5', align: 'center' });
    if (!ready && !away && !waiting && (w.zzzT > 0 || Math.sin(t * 1.4) > 0.2)) A_.text(c, 'z', B.x + 16 + Math.sin(t) * 2, B.y + 18 - ((t * 6) % 6), { size: 15, color: '#c9ced8', align: 'center' });
    // Temper: the meter along the bottom, and the word when he's up.
    if (ready) A_.text(c, 'CHARGE!', B.x + B.w / 2, B.y + B.h - 11, { size: 18, color: A_.GOLD, align: 'center' });
    else if (waiting) A_.text(c, 'WAIT', B.x + B.w / 2, B.y + B.h - 11, { size: 18, color: '#c9ced8', align: 'center' });
    else A_.bar(c, B.x + 8, B.y + B.h - 16, B.w - 16, 9, w.temper, '#ff8a2a');
  }

  // Guts, the wave, and what you've earned, between the icon and the button.
  function middle(c, run) {
    const A_ = A(), w = run.w, x = 92, top = 552, n = w.gutsMax, gap = Math.min(21, 160 / Math.max(1, n));
    A_.text(c, 'GUTS', x, top - 4, { size: 15, color: '#ffb27a' });
    for (let i = 0; i < n; i++) anvil(c, x + 8 + i * gap, top + 14, i < w.guts);
    if (w.fastT > 0) A_.text(c, 'PEPPER STEW', x + 62, top - 4, { size: 15, color: '#ff8a2a' });
    if (run.boss) bossBar(c, run, x, top + 34);
    else if (run.endless) A_.text(c, 'WAVE ' + (w.wave + 1), x, top + 34, { size: 15, color: A_.PAPER });
    else {
      const total = run.stage.waves.length;
      A_.text(c, 'WAVE', x, top + 34, { size: 15, color: A_.PAPER });
      for (let i = 0; i < total; i++) A_.circle(c, x + 42 + i * 15, top + 34, 5, i <= w.wave ? A_.GOLD : '#2f2230', 1.4);
    }
    A_.salvage(c, x + 8, top + 58, 8, 0);
    A_.text(c, String(Math.floor(run.salvage)), x + 21, top + 58, { size: 18, color: A_.GOLD });
    A_.text(c, 'Score ' + Math.floor(run.score), x + 58, top + 58, { size: 14 });
    if (!HD.locked(run) && (run.boss || run.stage.volley)) ribs(c, w, x + 132, top + 58);
  }

  // Volleys taken on the chin this try. The last mark is the one that drops him.
  function ribs(c, w, x, y) {
    const A_ = A();
    A_.text(c, 'RIBS', x, y, { size: 14, color: w.chinned ? '#ff8a6a' : '#8d93b5' });
    for (let i = 0; i < T.volleyChinMax; i++) A_.line(c, x + 32 + i * 7, y + 5, x + 36 + i * 7, y - 5, 3, i < w.chinned ? '#ff5a3a' : '#8d93b5');
  }

  // The bear's strength, in three parts, one per phase.
  function bossBar(c, run, x, y) {
    const A_ = A(), b = run.w.boss, B = T.boss;
    let f = 0;
    if (b.state === 'collapse') f = 0;
    else if (b.phase === 1) f = (Math.max(0, b.pawHp) / B.pawHp) / 3 + 2 / 3;
    else if (b.phase === 2) f = (Math.max(0, b.core) / B.coreP2) / 3 + 1 / 3;
    else f = (Math.max(0, b.core) / B.coreP3) / 3;
    A_.text(c, 'BEAR', x, y, { size: 15, color: A_.PAPER });
    A_.bar(c, x + 38, y - 6, 128, 12, f, '#ffffff', '#1a1c30');
    [1 / 3, 2 / 3].forEach(u => A_.line(c, x + 38 + 128 * u, y - 6, x + 38 + 128 * u, y + 6, 1.4, A_.INK));
  }

  HD.hud = function (c, run, view) {
    const t = run.time;
    bodyIcon(c, run, t);
    middle(c, run);
    gristButton(c, run, t);
  };
})();
