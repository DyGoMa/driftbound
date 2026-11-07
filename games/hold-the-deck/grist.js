// Hold the Deck: Grist's meter and his charge. No drawing here.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  HD.addTemper = function (run, n) {
    const w = run.w, was = w.temper;
    w.temper = Math.min(1, w.temper + n * w.temperFill);
    if (was < 1 && w.temper >= 1) { Kit.audio.play('growl'); if (HD.canCharge(w)) HD.first(run, 'grist'); }
  };
  HD.canCharge = w => w.temper >= 1 && !w.grist && w.gristAway <= 0 && HD.gristUseful(w);
  // On the bear the button only spends the meter when the charge can land. Anything else keeps the meter and says WAIT (hud.js).
  // At the far end it always can: if the bear sets off first, he meets it on the way (HD.bossGrist). An open core shuts, so that needs the time he takes to get there.
  HD.gristUseful = function (w) {
    const b = w.boss;
    if (!b) return true;
    if (b.state === 'under' || b.state === 'stand' || b.state === 'far') return true;
    return b.state === 'open' && Math.round(w.lanePos) === b.lane && b.open - b.t > (T.gristFromD - b.d - T.boss.coreReach) / T.gristSpeed;
  };
  HD.tryCharge = function (run) {
    const w = run.w;
    if (!HD.canCharge(w)) {
      Kit.audio.play('snore');
      w.zzzT = 0.8;
      return false;
    }
    w.temper = 0; w.charges++;
    w.grist = { lane: Math.round(w.lanePos), d: T.gristFromD, t: 0 };
    Kit.audio.play('charge'); Kit.audio.play('growl');
    A().shake(5, 0.5);
    return true;
  };
  HD.stepGrist = function (run, dt) {
    const w = run.w, g = w.grist;
    if (!g) return;
    g.t += dt;
    g.d -= T.gristSpeed * dt;
    HD.gristHits(run, g);
    if (Math.random() < 0.5) { const y = HD.yOf(Math.max(0, g.d)); A().burst(HD.laneX(g.lane, y), y, { n: 2, color: '#c8bfae', speed: 70, life: 0.3, size: 3, gravity: 80 }); }
    if (g.d < T.gristToD) { w.grist = null; w.gristAway = T.gristBack; }
  };
})();
