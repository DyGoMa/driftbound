// Hot Hand: the two hidden pals. Each asks for what this game is about.
// Cinderbun comes to a hand kept hot, and has to be touched at the very top of the heat. Dicemite comes when real money is riding, and has to be caught on a six.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;

  function appear(run, id, side) {
    const w = run.w;
    w.pal = { id, kind: 'pal', x: w.jx + side * (run.stage.both ? T.palStartMid : T.palStart), y: id === 'dicemite' ? T.lanes[1].y : T.lanes[2].y, dir: -side, t: 0, secs: id === 'cinderbun' ? T.cinderSecs : T.diceSecs, pip: 1, pipT: 0, miss: 0, hop: 0, h: 50, w: 50 };
    HH.sfx(run, 'squeak');
    HH.sayForPal(run, W.palAppear[id]);
  }

  HH.tryCinderbun = function (run) {
    const w = run.w;
    if (w.pal || w.cinderTried || run.index < T.cinderFromStage && !run.endless || run.boss || run.hasPal('cinderbun') || w.hotTime < T.cinderHot) return;
    w.cinderTried = true;
    if (run.rng() < T.cinderChance) appear(run, 'cinderbun', run.stage.both && run.rng() < T.leftChance ? -1 : 1);
  };
  HH.tryDicemite = function (run) {
    const w = run.w;
    if (w.pal || run.index < T.diceFromStage && !run.endless || run.boss || run.hasPal('dicemite') || w.stake < T.diceStake) return;
    if (run.rng() < T.diceChance) appear(run, 'dicemite', run.stage.both && run.rng() < T.leftChance ? -1 : 1);
  };

  HH.stepPal = function (run, dt) {
    const w = run.w, p = w.pal;
    if (!p) { HH.tryCinderbun(run); return; }
    p.t += dt;
    p.x += p.dir * T.palSpeed * dt * (p.t > p.secs ? -T.palLeave : p.t > T.palWalkIn ? T.palLook : 1);
    if (p.hop > 0) p.hop -= dt;
    if (p.id === 'dicemite') { p.pipT += dt; if (p.pipT >= T.dicePipSecs) { p.pipT = 0; p.pip = p.pip % 6 + 1; } }
    if (p.t > p.secs + T.palGone || p.flee > T.palFlee) w.pal = null;
    if (p.flee !== undefined) p.flee += dt;
  };

  // A thumb on a pal. Costs no heat and no throw. Returns true if it stopped play for the catch moment.
  HH.tapPal = function (run, p) {
    const w = run.w;
    if (p.id === 'cinderbun') {
      if (w.heat >= T.cinderCatch) { w.pal = null; run.catchPal(p.id); return true; }
      HH.sfx(run, 'squeak'); p.hop = 0.3;
      HH.fx(run, A => A.floatText(p.x, p.y - 50, W.palCold, '#bfe1ff', 14));
      return false;
    }
    if (p.pip === 6) { w.pal = null; run.catchPal(p.id); return true; }
    p.miss++; p.hop = 0.3;
    HH.sfx(run, 'dice');
    HH.fx(run, A => A.floatText(p.x, p.y - 50, 'A ' + p.pip + '. NOT A SIX', '#ffe46a', 14));
    if (p.miss >= T.diceMisses) { p.flee = 0; p.t = p.secs; }
    return false;
  };
})();
