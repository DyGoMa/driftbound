// Tide Gap: lances and boulders on screen, on a stage or in the boss. Drawing only.
window.TG = window.TG || {};
(function () {
  const T = TUNE, B = T.boss, A = () => Kit.art;

  // ---- Lances: red lane first, with a bar that drains, then the strike, then the taut cable.
  TG.drawLances = function (ctx, run, view) {
    const w = run.w, A_ = A(), top = w.boss ? w.boss.y + B.cutterHalfLen * 0.6 : TG.bookBottom(run, view), bottom = view.bottom;
    for (const l of w.lances) {
      if (l.state === 'warn') {
        const u = 1 - l.warnLeft / l.warn, hw = T.lanceHalf + T.hullHalfW;
        ctx.globalAlpha = 0.14 + u * 0.28;
        A_.poly(ctx, [[l.x - hw, top], [l.x + hw, top], [l.x + hw, bottom], [l.x - hw, bottom]], '#ff3f2a', 0);
        ctx.globalAlpha = 0.9;
        [-1, 1].forEach(s => A_.line(ctx, l.x + s * hw, top, l.x + s * hw, bottom, 2, '#ff6a4a'));
        const dash = (run.time * 340) % 44;
        for (let y = top + dash - 44; y < bottom; y += 44) A_.poly(ctx, [[l.x - 9, y], [l.x, y + 10], [l.x + 9, y], [l.x + 9, y + 6], [l.x, y + 16], [l.x - 9, y + 6]], '#ff6a4a', 0);
        ctx.globalAlpha = 1;
        A_.bar(ctx, l.x - 22, w.shipYNow + 54, 44, 7, l.warnLeft / l.warn, '#ff6a4a');
      } else {
        const fade = l.t < 0.08 ? 1 : Math.max(0.4, 1 - l.t / l.stay);
        ctx.globalAlpha = fade;
        A_.line(ctx, l.x, top, l.x, bottom, 7, A_.INK);
        A_.line(ctx, l.x, top, l.x, bottom, 3.6, '#c2c6cc');
        A_.line(ctx, l.x, top, l.x, bottom, 1.2, '#ffffff');
        ctx.globalAlpha = 1;
        const y = w.shipYNow + 62;
        A_.poly(ctx, [[l.x, y + 16], [l.x - 8, y - 6], [l.x, y - 2], [l.x + 8, y - 6]], '#f4f8fb', 2);
        if (l.t < 0.1) { ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffffff'; ctx.fillRect(l.x - 14, top, 28, bottom - top); ctx.globalAlpha = 1; }
      }
    }
  };

  // ---- Boulders falling: a shadow that grows, and the stone coming down.
  TG.drawDrops = function (ctx, run) {
    const w = run.w, A_ = A();
    for (const d of w.drops) {
      const y = TG.yOf(w, d.at), u = Math.min(1, d.t / T.dropWarn);
      if (!d.landed) {
        A_.circle(ctx, d.x, y, T.dropRadius, 'rgba(16,18,31,' + (0.14 + u * 0.3) + ')', 2.2, '#ff8a3a');
        A_.circle(ctx, d.x, y, T.dropRadius * u, null, 1.6, '#ffc08a');
        const by = y - (1 - u) * 240, s = 7 + u * 7;
        A_.poly(ctx, [[d.x - s, by - s * 0.4], [d.x - s * 0.2, by - s], [d.x + s, by - s * 0.3], [d.x + s * 0.7, by + s * 0.7], [d.x - s * 0.5, by + s * 0.8]], '#5a4238', 2);
        A_.poly(ctx, [[d.x + s * 0.1, by - s * 0.7], [d.x + s, by - s * 0.3], [d.x + s * 0.7, by + s * 0.7], [d.x + s * 0.1, by + s * 0.5]], '#33252c', 0);
      } else {
        const r = T.dropRadius + (d.t - T.dropWarn) * 70;
        ctx.globalAlpha = Math.max(0, 1 - (d.t - T.dropWarn) * 2);
        A_.circle(ctx, d.x, y, r, null, 3, '#eaf8fa');
        ctx.globalAlpha = 1;
      }
    }
  };
})();
