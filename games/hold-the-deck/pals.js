// Hold the Deck: the two hidden pals. Each asks for something a sensible player wouldn't do.
// Rivetling comes to iron: from stage 3, hold Iron longer than any block needs and it may shuffle over. Let go before it arrives and it rolls away.
// Spoonling comes to wasted food: from stage 2, cook a meal you don't need and it may creep out begging. Walk to its lane before it gives up.
window.HD = window.HD || {};
(function () {
  const T = TUNE, W = HD.WORDS;
  const can = (run, id, from) => (run.endless || run.index >= from) && !run.hasPal(id);

  HD.palIronStep = function (run) {
    const w = run.w;
    if (w.pal || w.rivetTried || w.ironT < T.rivetHold || !can(run, 'rivetling', T.rivetFromStage)) return;
    w.rivetTried = true;   // one chance per attempt
    if (T.palForce || run.rng() < T.rivetChance) {
      w.pal = { id: 'rivetling', lane: Math.round(w.lanePos), t: 0, secs: T.rivetWalk, side: run.rng() < 0.5 ? -1 : 1 };
      Kit.audio.play('chain');
      HD.sayForPal(run, W.palAppear.rivetling, T.palSay.rivetling);
    }
  };
  HD.palIronOff = function (run) {
    const w = run.w;
    if (w.pal && w.pal.id === 'rivetling') { w.pal = null; Kit.audio.play('back'); HD.sayClear(run); }   // it's gone, so nobody's still telling him to stay Iron for it
  };

  HD.palAfterMeal = function (run, wasted) {
    const w = run.w;
    if (!wasted || w.pal || !can(run, 'spoonling', T.spoonFromStage)) return;
    if (T.palForce || run.rng() < T.spoonChance) {
      const lanes = [0, 1, 2].filter(l => l !== Math.round(w.lanePos));
      w.pal = { id: 'spoonling', lane: lanes[run.int(0, 1)], t: 0, secs: T.spoonSecs };
      HD.sayForPal(run, W.palAppear.spoonling, T.palSay.spoonling);
    }
  };

  // Returns true if a catch moment stopped play.
  HD.palStep = function (run, dt) {
    const w = run.w, p = w.pal;
    if (!p) return false;
    p.t += dt;
    if (p.id === 'rivetling') {
      if (p.t >= p.secs) { w.pal = null; run.catchPal('rivetling'); w.caughtNow = 'rivetling'; return true; }
      return false;
    }
    if (w.lanePos === p.lane) { w.pal = null; run.catchPal('spoonling'); w.caughtNow = 'spoonling'; return true; }
    if (p.t >= p.secs) { w.pal = null; Kit.audio.play('back'); HD.sayClear(run); }
    return false;
  };
})();
