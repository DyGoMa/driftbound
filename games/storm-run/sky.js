// Storm Run: the sky behind Pinhold, and the weather. Painted gradient, clouds lit from below, far free islands, rain, far lightning.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const SKIES = [
    { top: '#0c1026', mid: '#2b2a5a', low: '#c05a2e', base: '#f4a03a' },
    { top: '#0b0f24', mid: '#2a2552', low: '#a84632', base: '#e87f2e' },
    { top: '#090c1e', mid: '#20224a', low: '#7a3440', base: '#c0602e' },
    { top: '#070918', mid: '#171a3a', low: '#4a2850', base: '#8e4038' },
    { top: '#0b0a1c', mid: '#2c1b40', low: '#94302c', base: '#ee6a28' },
  ];

  // The sky: a flat painted gradient, hotter toward the horizon than the kit's default, as in the Pinhold picture.
  function sky(c, view, which) {
    const k = SKIES[Math.min(which, SKIES.length - 1)], g = c.createLinearGradient(0, view.top, 0, T.groundY);
    g.addColorStop(0, k.top); g.addColorStop(0.42, k.mid); g.addColorStop(0.76, k.low); g.addColorStop(1, k.base);
    c.fillStyle = g; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top);
  }

  // Clouds: dark overhead, lit from below by the sunset. Flat shapes, no ink, like a painted anime sky.
  function cloudBank(c, rnd, x, y, w, body, lit) {
    const n = Math.max(4, Math.round(w / 26));
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), r = (10 + rnd() * 14) * (0.5 + Math.sin(u * Math.PI) * 0.7);
      Kit.art.ellipse(c, x + u * w, y - r * 0.4, r * 1.7, r, body, 0);
    }
    Kit.art.poly(c, [[x - 12, y], [x + w + 12, y], [x + w * 0.9, y + 7], [x + w * 0.1, y + 7]], lit, 0);
    for (let i = 0; i < n - 1; i++) Kit.art.ellipse(c, x + (i + 0.5) / n * w, y + 1, 18 + rnd() * 12, 3.4, lit, 0);
  }
  function clouds() {
    return SR.bake('clouds', 1400, 250, 0, 0, c => {
      const rnd = SR.scatter(41);
      for (let i = 0; i < 9; i++) cloudBank(c, rnd, i * 156 + rnd() * 60, 24 + rnd() * 120, 110 + rnd() * 120, '#181c46', 'rgba(150,70,70,.55)');
      for (let i = 0; i < 8; i++) cloudBank(c, rnd, i * 180 + rnd() * 70, 180 + rnd() * 54, 130 + rnd() * 140, '#4a2f55', 'rgba(244,150,90,.75)');
    });
  }

  // ---- Far: free islands drifting behind everything, little and hazed.
  function farIsle(c, rnd, x, y, w) {
    const A_ = A(), h = w * 0.5, low = [];
    const n = 6;
    for (let i = 0; i <= n; i++) { const u = i / n, d = Math.sin(u * Math.PI) * h * (0.7 + rnd() * 0.5); low.push([x + w * (1 - u), y + 3 + d]); }
    A_.poly(c, [[x, y], [x + w, y]].concat(low), '#3a2c52', 1.1);
    low.slice(1, -1).forEach((p, i) => { if (i % 2 === 0) A_.poly(c, [[p[0] - w * 0.1, y + 5 + h * 0.2], [p[0] + w * 0.08, y + 5 + h * 0.2], p], '#7d4a58', 0); });
    A_.poly(c, [[x - 1, y - 2], [x + w + 1, y - 2], [x + w - 2, y + 4], [x + 2, y + 4]], '#5c5f6e', 1.1);
    if (rnd() < 0.6) { A_.line(c, x + w * 0.4, y, x + w * 0.42, y - h * 0.45, 1.2, '#2a2740'); A_.poly(c, [[x + w * 0.36, y - h * 0.45], [x + w * 0.42, y - h * 0.62], [x + w * 0.48, y - h * 0.45]], '#3a3650', 0.8); }
  }
  function far() {
    return SR.bake('far', 1200, 200, 0, 0, c => {
      const rnd = SR.scatter(7);
      for (let i = 0; i < 6; i++) farIsle(c, rnd, 30 + i * 196 + rnd() * 70, 36 + rnd() * 110, 26 + rnd() * 54);
    });
  }

  function rain(c, view, n, t) {
    if (!n) return;
    c.strokeStyle = 'rgba(190,205,240,.28)'; c.lineWidth = 1;
    c.beginPath();
    const W = view.right - view.left + 60, H = view.bottom - view.top;
    for (let i = 0; i < n; i++) {
      const sx = (i * 73.3) % 1, sy = (i * 41.7) % 1;
      const x = view.left + ((sx * W - t * 240 + 4000 * W) % W), y = view.top + ((sy * H + t * 720) % H);
      c.moveTo(x, y); c.lineTo(x - 5, y + 14);
    }
    c.stroke();
  }

  // Lightning far off, from the time alone, so it doesn't need any state.
  function flash(c, view, every, t) {
    if (!every) return;
    const u = t % every;
    if (u > 0.22) return;
    const a = (u < 0.06 || (u > 0.12 && u < 0.16)) ? 0.14 : 0.05;
    c.fillStyle = 'rgba(210,220,255,' + a + ')';
    c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top);
    const n = Math.floor(t / every), x = view.left + ((n * 271) % (view.right - view.left));
    SR.bolt(c, x, view.top, x + 40, T.groundY - 80, { n: 6, jag: 16, w: 1.6, color: '#dfe6ff' });
  }

  // Everything behind the island. off = road scrolled so far; which = stage number.
  SR.drawSky = function (c, view, off, t, which, stage) {
    sky(c, view, which);
    SR.strip(c, clouds(), view, off * 0.03 + t * 3, 20);
    SR.strip(c, far(), view, off * 0.07 + t * 2, 40);
    flash(c, view, stage && stage.flash, t);
  };
  SR.drawRain = (c, view, stage, t) => rain(c, view, stage && stage.rain, t);
})();
