// Split Light: the light on the board: the shot in flight, where the last one went, and the aim line. Drawing only.
window.SL = window.SL || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const lerp = (a, b, u) => a + (b - a) * u;

  function pathOf(c, run, segs, upTo) {
    const P = SL.place(run);
    c.beginPath();
    segs.forEach(s => {
      if (upTo <= s.t0) return;
      const u = s.t1 > s.t0 ? Math.min(1, (upTo - s.t0) / (s.t1 - s.t0)) : 1;
      c.moveTo(P.ox + (s.x1 + 0.5) * T.cell, P.oy + (s.y1 + 0.5) * T.cell);
      c.lineTo(P.ox + (lerp(s.x1, s.x2, u) + 0.5) * T.cell, P.oy + (lerp(s.y1, s.y2, u) + 0.5) * T.cell);
    });
  }

  // The beam: a soft blue glow, a split-light fringe, a white heart. Square ends, flat colour, no gradients: it should read like a drawn beam.
  SL.drawBeam = function (c, run, b) {
    const t = b.t, res = b.res, fade = b.t >= res.length ? Math.max(0, b.tail / T.beamTailSecs) : 1;
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.globalAlpha = fade;
    const layer = (lw, col, ox, oy) => { c.save(); c.translate(ox || 0, oy || 0); pathOf(c, run, res.segs, t); c.lineWidth = lw; c.strokeStyle = col; c.stroke(); c.restore(); };
    layer(13, 'rgba(120,205,250,.3)');
    layer(4, 'rgba(255,110,170,.85)', -2.6, 2.6);
    layer(4, 'rgba(255,225,110,.85)', 2.6, -2.6);
    layer(6, '#bdeeff');
    layer(2.6, '#ffffff');
    c.restore();
    // A bright head on each beam still travelling.
    if (b.t < res.length) {
      const P = SL.place(run);
      res.segs.forEach(s => {
        if (t <= s.t0 || t >= s.t1) return;
        const u = (t - s.t0) / (s.t1 - s.t0), x = P.ox + (lerp(s.x1, s.x2, u) + 0.5) * T.cell, y = P.oy + (lerp(s.y1, s.y2, u) + 0.5) * T.cell;
        A().poly(c, [[x, y - 9], [x + 3, y - 3], [x + 9, y], [x + 3, y + 3], [x, y + 9], [x - 3, y + 3], [x - 9, y], [x - 3, y - 3]], '#ffffff', 0);
      });
    }
  };

  // Where the last shot went, faint, until something changes. Useful: it's the only look at the light you get.
  SL.drawGhost = function (c, run) {
    const g = run.w.ghost;
    if (!g) return;
    c.save();
    pathOf(c, run, g.segs, 1e9);
    c.setLineDash([3, 7]); c.lineCap = 'round';
    c.lineWidth = 2.4; c.strokeStyle = g.stale ? 'rgba(255,255,255,.14)' : 'rgba(191,233,255,.5)';
    c.stroke();
    c.restore();
  };

  // The aim line: straight out of Prism to the first thing in the way. Second Look adds bounces.
  SL.drawAim = function (c, run, t) {
    const w = run.w;
    if (w.beam || w.dead || !SL.alive(w.S) || w.gap > 0) return;
    const res = SL.shoot(w.L, w.S, w.perch, w.lean, { maxBounces: w.look });
    c.save();
    pathOf(c, run, res.segs, 1e9);
    c.setLineDash([8, 7]); c.lineDashOffset = -t * 26; c.lineCap = 'butt';
    c.lineWidth = 3; c.strokeStyle = w.look ? 'rgba(244,193,82,.92)' : 'rgba(244,193,82,.65)';
    c.stroke();
    c.restore();
  };
})();
