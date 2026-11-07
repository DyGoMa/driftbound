// Split Light: Director Vasch. Three boards in one stage. Logic only. He talks all the way through.
// Phase 1: rails that move when you fire. Phase 2: a linked pair on a clock. Phase 3: the core in his arm, its opening turning on a clock, each side sealed once used; and he turns one of your crystals back after every shot.
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, AU = () => Kit.audio, A = () => Kit.art;

  SL.bossNew = () => ({ phase: 0, nerve: T.bossNerve, shake: 0, chamber: 1, gapDo: null, wonT: 0 });

  SL.bossIntro = function (run) { SL.say(run, W.bossSay.phaseStart[0], T.sayLong); };

  // After a shot that didn't finish the board.
  SL.bossAfterShot = function (run, res) {
    const w = run.w, b = w.boss, B = W.bossSay;
    if (w.L.corrects) correct(run, res);
    if (res.hits.length) {
      const pool = b.phase === 2 ? B.hit : B.stockHit;
      if (w.L.corrects) w.sayQ = { t: T.bossSaySecs, pool, key: 'bhit' };   // his correction is on screen first; a second line in the same frame would wipe it
      else SL.sayFrom(run, pool, 'bhit');
      if (b.phase === 2) b.chamber = Math.max(0, w.S.hp[0] / w.L.cores[0].hp);
    }
    else if (!w.L.corrects) SL.sayFrom(run, B.miss, 'bmiss');
  };

  // A shot that touched no crystal: he turns one that's already right for your next best shot, so a correction never does your work for you.
  function notYourWay(run) {
    const w = run.w, L = w.L, plan = SL.solve(L, w.S, { limit: T.solverLimit }), need = (plan && plan.plan && plan.plan[0] && plan.plan[0].assign) || {};
    const all = [], right = [], spare = [];
    L.pieces.forEach((p, i) => {
      if (!p || p.t !== 'c') return;
      all.push(i);
      if (need[i] === undefined) spare.push(i); else if (w.lean[i] === need[i]) right.push(i);
    });
    return right.length ? right : spare.length ? spare : all;
  }

  // He turns one crystal you just used. It flashes white and stays marked for a moment, with a sound and a line, and you have as long as you want to turn it back.
  function correct(run, res) {
    const w = run.w, L = w.L, used = [];
    res.events.forEach(e => {
      if (e.type !== 'bounce' && e.type !== 'split') return;
      const i = e.y * L.cols + e.x, p = L.pieces[i];
      if (p && (p.t === 'c' || p.t === 's') && !used.includes(i)) used.push(i);
    });
    if (!used.length) used.push(...notYourWay(run));
    if (!used.length) return;
    const i = used[Math.floor(run.rng() * used.length)];
    w.lean[i] = w.lean[i] ? 0 : 1;
    w.turnT[i] = T.turnSecs * T.correctTurnTimes;
    w.corrected = { cell: i, t: T.correctShowSecs };
    if (w.ghost) w.ghost.stale = true;
    AU().play('correct');
    SL.sayFrom(run, W.bossSay.corrected, 'bcorrect');
  }

  // A board cleared.
  SL.bossBoardWon = function (run, used, over) {
    const w = run.w, b = w.boss;
    w.held += Math.max(0, T.scorePar - over * T.scoreOverPar);
    w.fired += w.boardFired; w.boardFired = 0; w.boardScore = w.held; b.firedDone = w.fired;
    if (b.phase >= SL.BOSS.length - 1) {
      b.chamber = 0;
      SL.say(run, W.bossSay.down, T.sayLong);
      run.addSalvage(SL.bossPay(run, b.nerve));
      w.held += T.scoreBoss;
      run.addScore(w.held); w.held = 0;
      SL.settle(run);
      A().shake(T.shakeBossDown[0], T.shakeBossDown[1]);
      AU().play('boom');
      b.wonT = T.bossEndSecs;
      run.win(T.bossEndSecs);
      return;
    }
    SL.say(run, W.bossSay.phaseWon[b.phase], T.sayLong);
    b.phase++;
    b.gapDo = 'next';
    w.gap = T.phaseGapSecs;
  };

  // Out of shots on a board, or the player pressed Reset: a point of nerve, and the same board again. No nerve left: the stage is lost.
  SL.bossFail = function (run, pressed) {
    const w = run.w, b = w.boss;
    b.nerve--;
    b.keep = w.S.g.slice();   // the same board again, with the growths still on it
    w.fired += w.boardFired; w.boardFired = 0;
    w.held = w.boardScore;   // a failed board scores nothing: its cores can be burned again
    w.testInfo.retries++;
    AU().play('nerve');
    A().shake(T.shakeNerve[0], T.shakeNerve[1]);
    if (b.nerve <= 0) { run.lose(); return; }
    SL.sayFrom(run, W.bossSay.reset, 'breset', T.sayShort);
    b.gapDo = 'same';
    w.gap = pressed ? T.resetPressSecs : T.resetGapSecs;
  };

  SL.bossGapDone = function (run) {
    const w = run.w, b = w.boss, next = b.gapDo;
    b.gapDo = null;
    w.gap = 0;
    SL.loadBoard(run, SL.BOSS[b.phase], next === 'same' ? b.keep : null);
    if (next === 'next') SL.say(run, W.bossSay.phaseStart[b.phase], T.sayLong);
    if (b.phase === 2) b.chamber = 1;
  };

  // His count: how far he has got, 0 to 10. The first shot of an attempt gets longer, to read the board.
  SL.countOf = function (w) {
    const spec = w.L.spec;
    return spec.count ? Math.min(10, w.countT / (spec.count + (w.boardFired ? 0 : T.countReadSecs)) * 10) : 0;
  };

  // He counts while you stand there. At ten he fires for you, with the crystals as they stand: it costs the shot and grows like any other. The clock's rules still hold: it waits while the beam flies and on a dead board.
  function stepCount(run, dt) {
    const w = run.w, B = W.bossSay;
    if (!w.L.spec.count || SL.busy(w) || w.dead || run.over || !SL.alive(w.S) || w.S.shots <= 0) return;
    const before = Math.floor(SL.countOf(w));
    w.countT += dt;
    const now = Math.floor(SL.countOf(w));
    if (now === before) return;
    if (now >= 10) { SL.say(run, B.countFire); SL.fire(run); return; }
    if (now >= T.countLoudFrom) AU().play('count');
    if (now === T.countTeachAt && !w.boss.countTaught) { w.boss.countTaught = true; SL.say(run, B.countTeach); }
    if (now === T.countLoudFrom) SL.say(run, B.countLate);
  }

  // Standing still: he notices.
  SL.bossStep = function (run, dt) {
    const w = run.w;
    if (!w.waitSaid && w.sinceShot > T.waitTalkSecs) { w.waitSaid = true; SL.say(run, W.bossSay.wait); }
    if (!w.boss.opened && run.time > T.bossIntroAfter) { w.boss.opened = true; SL.bossIntro(run); }
    stepCount(run, dt);
  };
})();
