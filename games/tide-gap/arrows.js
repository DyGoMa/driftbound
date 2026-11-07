// Tide Gap: Sela's gold arrows on the rocks. Drawing only. The rocks themselves are in rockart.js.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;

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
