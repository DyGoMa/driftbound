// Hold the Deck: how a warning looks. The lane lights, a band runs down it to count the time, and a plate says what's coming. Crates and hooks in the air, too.
window.HD = window.HD || {};
(function () {
  const T = TUNE, W = HD.WORDS, A = () => Kit.art;
  const P = (k, y) => [T.midX + k * HD.laneW(y), y];
  const VOLLEY_FROM = 0.1;   // looks only: where a volley's hooks seem to come from

  // A warning on the lane: the whole lane lights, a band of fire runs down it to show the time left, and a plate says what's coming.
  HD.drawWarn = function (c, run, x, t) {
    const A_ = A(), w = run.w, u = Math.min(1, x.t / x.total), left = x.total - x.t;
    // Harmless drops light only as far as they land. Anything that can hit him lights the lane right down to the door, so what's lit is what's dangerous.
    const from = x.kind === 'swipe' || x.kind === 'charge' || x.what === 'claws' ? T.boss.standD : 0.02, to = x.kind === 'wall' || x.kind === 'rope' ? Math.min(1, x.d + 0.08) : 1;
    const k0 = x.lane - 1 - 0.47, k1 = x.lane - 1 + 0.47, y0 = HD.yOf(from), y1 = HD.yOf(to), yu = y0 + (y1 - y0) * u;
    const hot = x.kind !== 'wall' && x.kind !== 'rope';
    const col = hot ? '#ff5a22' : '#f4c152';
    c.globalAlpha = 0.16 + 0.1 * Math.sin(t * 22);
    A_.poly(c, [P(k0, y0), P(k1, y0), P(k1, y1), P(k0, y1)], col, 0);
    c.globalAlpha = 0.5;
    A_.poly(c, [P(k0, y0), P(k1, y0), P(k1, yu), P(k0, yu)], col, 0);
    c.globalAlpha = 1;
    A_.poly(c, [P(k0, yu - 2), P(k1, yu - 2), P(k1, yu + 2), P(k0, yu + 2)], '#ffffff', 0);
  };
  // What's falling or flying, and the plate that says so, over the people, so nothing hides it.
  HD.drawWarnTop = function (c, run, x) {
    const w = run.w, left = x.total - x.t, u = Math.min(1, x.t / x.total);
    if (x.kind === 'hook') drawHook(c, run, x);
    if (x.kind === 'drop' || x.kind === 'wall') drawFallingCrate(c, x, u, left);
    if (x.kind === 'rope') drawRopeMan(c, x, u);
    if (x.kind === 'wall' || x.kind === 'rope') return;
    if (x.kind === 'volley') {
      if (x.what === 'hook') drawHook(c, run, x);
      if (x.what === 'crate') drawFallingCrate(c, x, u, left);
      if (x.lane === 1) HD.plate(c, 180, HD.yOf(0.55) - 20, HD.locked(run) ? W.warn.volleyLocked : w.ironOn ? W.warn.volleyHeld : W.warn.volley, !w.ironOn, left / x.total);
      return;
    }
    const here = HD.inLane(w, x.lane), py = HD.yOf(0.55), px = HD.laneX(x.lane, py);
    HD.plate(c, px, py - 20, here ? (HD.locked(run) ? 'MOVE!' : 'MOVE OR HOLD') : W.warn[x.kind], here, left / x.total);
  };
  HD.plate = function (c, x, y, s, loud, frac) {
    const A_ = A(), big = 17;
    c.font = `400 ${big}px Anton, Impact, sans-serif`;
    const hw = Math.max(c.measureText(s).width / 2 + 6, 26), cx = HD.clamp(x, hw + 3, 360 - hw - 3);
    A_.poly(c, [[cx - hw + 4, y], [cx + hw + 4, y], [cx + hw - 4, y + 26], [cx - hw - 4, y + 26]], loud ? '#f4c152' : A_.NIGHT, 2, loud ? A_.INK : '#ff7a3a');
    A_.text(c, s, cx, y + 13, { size: big, color: loud ? A_.NIGHT : '#ffb27a', align: 'center', ink: false });
    A_.poly(c, [[cx - hw + 2, y + 27], [cx - hw + 2 + (hw * 2 - 4) * frac, y + 27], [cx - hw + 2 + (hw * 2 - 4) * frac, y + 31], [cx - hw + 2, y + 31]], '#ffffff', 1);
  };
  // The hook: in the cutter's hand through the warning, then in the air for the last hookFly seconds.
  function drawHook(c, run, x) {
    const A_ = A(), left = x.total - x.t;
    if (left > T.hookFly || (!x.from && x.kind !== 'volley')) return;
    const f = x.from || { d: VOLLEY_FROM }, u = 1 - left / T.hookFly, d = f.d + (T.bramD - f.d) * u, y = HD.yOf(d), px = HD.laneX(x.lane, y), s = 0.6 + d * 0.9;
    c.beginPath(); c.moveTo(HD.laneX(x.lane, HD.yOf(f.d)), HD.yOf(f.d) - 30); c.lineTo(px, y - 34 * s); c.lineWidth = 1.6; c.strokeStyle = '#d9dde4'; c.stroke();
    c.globalAlpha = 0.5; A_.circle(c, px, y - 30 * s, 11 * s, '#ffffff', 0); c.globalAlpha = 1;
    A_.poly(c, [[px - 3 * s, y - 42 * s], [px + 3 * s, y - 42 * s], [px + 5 * s, y - 28 * s], [px + 12 * s, y - 27 * s], [px + 3 * s, y - 20 * s], [px - 2 * s, y - 28 * s]], '#f1f4f8', 1.4);
  }
  const crate = HD.drawCrate = function (c, x, y, s) {
    const A_ = A(), w = 36 * s, h = 44 * s, top = 13 * s;
    if (A_.draw(c, 'crate', 0, x, y, h + top)) return;
    A_.poly(c, [[x - w, y], [x + w, y], [x + w, y - h], [x - w, y - h]], '#a97a4a', 2);
    A_.poly(c, [[x + w * 0.4, y], [x + w, y], [x + w, y - h], [x + w * 0.4, y - h]], '#8a6238', 0);
    A_.poly(c, [[x - w, y - h], [x + w, y - h], [x + w * 0.72, y - h - top], [x - w * 0.72, y - h - top]], '#c29560', 2);
    A_.poly(c, [[x - w, y], [x + w, y], [x + w, y - h], [x - w, y - h]], null, 2);
    A_.line(c, x - w, y, x + w, y - h, 3 * s + 1.2, A_.INK); A_.line(c, x - w, y, x + w, y - h, 3 * s, '#c29560');
    for (const q of [[-0.95, -0.95], [0.95, -0.95], [-0.95, -0.05], [0.95, -0.05]]) A_.circle(c, x + q[0] * w, y + q[1] * h, 2 * s, '#3a3940', 0);
    A_.text(c, 'FLOUR', x - w * 0.42, y - h * 0.22, { size: 8 * s + 3, color: '#3a2a1a', align: 'center', ink: false, body: true });
  };
  function drawFallingCrate(c, x, u, left) {
    const A_ = A(), y = HD.yOf(x.d), cx = HD.laneX(x.lane, y), s = HD.scaleAt(y) * 1.7, fall = Math.max(0, left / 0.5), top = y - fall * 500;
    c.globalAlpha = 0.3 + u * 0.4;
    A_.ellipse(c, cx, y, 38 * s * (0.5 + u * 0.5), 12 * s * (0.5 + u * 0.5), '#0c0d16', 0);
    c.globalAlpha = 1;
    A_.line(c, cx, top - 70, cx, -200, 2.4, A_.INK); A_.line(c, cx, top - 70, cx, -200, 1, '#8e919a');
    const hold = left > 0.5 ? -60 - 40 * (1 - u) : top;
    if (left <= 0.5) crate(c, cx, top, s);
    else crate(c, cx, hold, Math.min(s, 0.8));
  }
  function drawRopeMan(c, x, u) {
    const A_ = A(), y = HD.yOf(x.d), cx = HD.laneX(x.lane, y), h = HD.heightAt(180, y), top = y - (1 - u) * (1 - u) * 420;
    c.globalAlpha = 0.35; A_.ellipse(c, cx, y, 18 * (0.4 + u * 0.6), 5, '#0c0d16', 0); c.globalAlpha = 1;
    A_.line(c, cx, top - h, cx, -200, 2, A_.INK); A_.line(c, cx, top - h, cx, -200, 0.9, '#c9a86a');
    HD.drawFoe(c, { type: 'grunt', laneF: x.lane, d: 1, state: 'hang', seed: 1, flash: 0, hp: 1 }, top, h, 0);
  }
})();
