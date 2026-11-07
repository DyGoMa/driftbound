// Split Light: the shot in flight. Effects fire as the beam reaches them; the board only changes when it's done (play.js, SL.finishShot).
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, A = () => Kit.art, AU = () => Kit.audio;

  // The beam on screen. Effects fire as it reaches them; the board changes when it's done.
  SL.stepBeam = function (run, dt, skip) {
    const w = run.w, b = w.beam, res = b.res;
    if (b.t < res.length) {
      b.t = skip ? res.length : Math.min(res.length, b.t + b.speed * dt);
      while (b.next < res.events.length && res.events[b.next].t <= b.t) beamEvent(run, res.events[b.next++], b);
    } else {
      b.tail -= skip ? b.tail : dt;
      if (b.tail <= 0) SL.finishShot(run);
    }
  };
  function beamEvent(run, e, b) {
    const w = run.w, P = SL.cellXY(run, e.x, e.y), A_ = A();
    if (e.type === 'bounce' || e.type === 'split') {
      AU().play(e.type === 'split' ? 'split' : 'bounce' + Math.min(5, b.n));
      b.n++;
      A_.burst(P.x, P.y, { n: e.type === 'split' ? 12 : 5, colors: ['#ffffff', '#8fd3f0', '#ff9ed0', '#ffe06a'], speed: 80, life: 0.3, gravity: 0, size: 3 });
    } else if (e.type === 'hit') {
      const real = b.res.hits.includes(e.core);
      if (real) {
        const dying = w.S.hp[e.core] <= 1;
        w.popT[e.core] = T.popSecs;
        AU().play(dying ? 'burn' : 'chamber');
        A_.burst(P.x, P.y, { n: 18, colors: ['#ffffff', '#ffe9b0', '#8fd3f0'], speed: 150, life: 0.5, gravity: 40, size: 4 });
        A_.shake(dying ? T.shakeCore : T.shakeChamber, T.shakeHitSecs);
      } else { w.flashCore[e.core] = T.coreFlashSecs; AU().play('crack'); A_.burst(P.x, P.y, { n: 6, color: '#f4c152', speed: 60, life: 0.3, gravity: 0 }); }
    } else if (e.type === 'clang') {
      AU().play('clang');
      w.flashCore[e.core] = T.coreFlashSecs;
      A_.burst(P.x, P.y, { n: 8, colors: ['#ffffff', '#9aa0a8'], speed: 110, life: 0.25, gravity: 200 });
      if (!w.seen.armour) { w.seen.armour = 1; SL.say(run, W.armourClang); }
    } else A_.burst(P.x, P.y, { n: 4, colors: ['#ffffff', '#8fd3f0'], speed: 60, life: 0.2, gravity: 0 });
  }
})();
