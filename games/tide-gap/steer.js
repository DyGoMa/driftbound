// Tide Gap: steering. The rest of one step is in sail.js.
window.TG = window.TG || {};
(function () {
  const T = TUNE, W = () => TG.WORDS;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---- Steering. The thumb moves an aim; the head chases it; the hull follows the head's path a moment later.
  TG.steer = function (run, w, input, dt) {
    if (input.down && !input.pressed) w.targetX += input.dx * T.dragGain;
    if (input.axisX) w.targetX += input.axisX * T.keySteer * dt;
    if ((Math.abs(input.dx) > T.steerSoundMove || input.axisX) && run.time - w.lastSteer > T.steerSoundGap) { w.lastSteer = run.time; Kit.audio.play('steer'); }
    const band = TG.bandHere(w);
    if (band) {
      w.targetX += band.dir * band.force * dt; w.headX += band.dir * band.force * dt;
      if (!w.saidBand) { w.saidBand = true; TG.sayNow(run, W().bandLine); }
    }
    if (w.dist < w.scrapeTo) w.targetX = w.scrapeX;
    w.targetX = clamp(w.targetX, T.minX, T.maxX);
    const dh = clamp((w.targetX - w.headX) * T.headRate, -T.headMax, T.headMax);
    w.headX = clamp(w.headX + dh * dt, T.minX - 6, T.maxX + 6);
    w.trail.pop(); w.trail.unshift(w.headX);
    const lagged = w.trail[Math.min(w.trail.length - 1, Math.round(T.towDelay * 60))];
    const before = w.shipX;
    if (w.shuntTo !== null) {
      const d = w.shuntTo - w.shipX, step = Math.sign(d) * Math.min(Math.abs(d), T.shunt * dt);
      w.shipX += step;
      if (Math.abs(d) < 2) { w.targetX = w.headX = w.shipX; w.trail.fill(w.shipX); w.shuntTo = null; }
    } else {
      w.shipX += clamp((lagged - w.shipX) * T.shipRate, -T.shipMax, T.shipMax) * dt;
      if (band) w.shipX += band.dir * band.force * dt * T.bandHullShare;
    }
    w.shipX = clamp(w.shipX, T.minX, T.maxX);
    w.lean += (((w.shipX - before) / dt) / T.shipMax - w.lean) * Math.min(1, dt * 7);
  };

})();
