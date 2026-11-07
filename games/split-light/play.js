// Split Light: one attempt at a board. Rules are in rules.js; this file holds the shot, win and lose. Turning, Retry, Undo and Scrape are in moves.js.
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, A = () => Kit.art, AU = () => Kit.audio;
  const compiled = {};
  const boardOf = spec => compiled[spec.id] || (compiled[spec.id] = SL.compile(spec));

  // Screen positions. Boards shorter than the tallest sit in the middle of the board space.
  SL.place = function (run) {
    const w = run.w, L = w.L, room = (w.boss ? T.bossRows : T.rows) * T.cell;
    return { ox: (Kit.view.w - L.cols * T.cell) / 2, oy: T.top + (room - L.rows * T.cell) / 2, bottom: T.top + room };
  };
  SL.cellXY = function (run, x, y) { const p = SL.place(run); return { x: p.ox + (x + 0.5) * T.cell, y: p.oy + (y + 0.5) * T.cell }; };
  SL.cellOf = function (run, px, py) {
    const p = SL.place(run), L = run.w.L, x = Math.floor((px - p.ox) / T.cell), y = Math.floor((py - p.oy) / T.cell);
    return x >= 0 && y >= 0 && x < L.cols && y < L.rows ? y * L.cols + x : -1;
  };

  // held: the score of this attempt, not banked until it's won, because the kit banks run.score on a loss, a Restart and a closed tab too (tally.js).
  SL.newWorld = function (run) {
    run.w = { boss: run.boss ? SL.bossNew() : null, sayT: 0, fired: SL.shotsAlready(run), replay: SL.replaying(run), held: 0, lastLine: {}, cursor: null, kb: false, press: null, flash: 0, wince: 0, seen: {}, pal: null, glimmickTried: false, sinceShot: 0, testInfo: { shotsUsed: 0, par: 0, retries: 0, bounces: 0 } };
    run.w.look = run.up('look') * T.lookPerLevel;
    run.w.aids = SL.aidsLogged(run);
    if (run.w.boss) run.w.boss.firedDone = run.w.fired;
    SL.loadBoard(run, run.boss ? SL.BOSS[run.w.boss.phase] : run.stage.level, SL.scarsLogged(run));
    if (!run.w.boss && run.w.fired && !run.w.sayQ) run.w.sayQ = { t: T.scarSaySecs, pool: W.retryKept, key: 'retry' };   // back from a loss, a Restart, Menu or a reload: the same word a Retry gets, since fewer shots come back
  };

  // A new attempt at a board: crystals back as they started, the growths of the last attempt that are in the way (scarsAfter in solver.js), and on a level only the shots not yet spent (shotsFor there). Also what Retry does. The boss gives full shots: its limit is nerve.
  // Undo and Scrape are per level, so a new attempt doesn't hand them back (w.aids, kept in tally.js). On the boss they're per board, and a Reset costs nerve.
  SL.loadBoard = function (run, spec, keep) {
    const w = run.w, L = w.L = boardOf(spec), scars = keep && keep.length ? SL.scarsAfter(L, keep) : [];
    w.S = SL.startState(L, scars);
    if (!w.boss) w.S.shots = SL.shotsFor(L, w.S, w.fired);
    w.lean = SL.startLeans(L);
    w.perch = 0;
    w.beam = null; w.ghost = null; w.history = []; w.dead = false; w.clockT = 0; w.warned = false;
    w.turnT = {}; w.growT = {}; w.popT = {}; w.flashCore = {}; w.corrected = null;
    w.slideT = T.slideSecs; w.fromTick = 0; w.press = null; w.scraping = false; w.sealT = 0;
    w.undoTotal = run.up('steady') * T.undoPerLevel;
    w.scrapeTotal = run.up('scraper') * T.scrapePerLevel;
    w.undos = Math.max(0, w.undoTotal - w.aids.undo);
    w.scrapes = Math.max(0, w.scrapeTotal - w.aids.scrape);
    w.boardFired = 0; w.sinceShot = 0; w.countT = 0; w.waitSaid = false; w.gap = 0; w.resetArm = 0; w.sayQ = null; w.boardScore = w.held;
    scars.forEach(i => { w.growT[i] = T.growSecs; });
    const gone = (keep || []).filter(i => !scars.includes(i));
    gone.forEach(i => {
      const P = SL.cellXY(run, i % L.cols, Math.floor(i / L.cols));
      A().burst(P.x, P.y, { n: 14, colors: ['#ffffff', '#bfe9ff'], speed: 110, life: 0.4, gravity: 200, size: 3 });
    });
    if (gone.length) w.sayQ = { t: T.scarSaySecs, pool: W.scarGone, key: 'scar' };
    SL.noteScars(run);
  };

  SL.say = function (run, line, secs) {
    if (!line) return;
    run.say(line.who, line.text, secs || T.sayShort);
    run.w.sayT = secs || T.sayShort;
  };
  // A line from a pool, never the same one twice running.
  SL.sayFrom = function (run, pool, key, secs) {
    const w = run.w, n = pool.length, i = ((w.lastLine[key] === undefined ? Math.floor(Math.random() * n) : w.lastLine[key]) + 1) % n;
    w.lastLine[key] = i;
    SL.say(run, pool[i], secs);
  };
  SL.busy = w => !!w.beam || w.gap > 0;

  SL.canFire = w => !SL.busy(w) && w.S.shots > 0 && !w.dead && SL.alive(w.S);
  SL.fire = function (run) {
    const w = run.w;
    if (!SL.canFire(w)) { AU().play('denied'); return; }
    w.scraping = false; w.resetArm = 0; w.sayQ = null;
    const res = SL.shoot(w.L, w.S, w.perch, w.lean);
    w.history.push({ S: w.S, lean: Object.assign({}, w.lean), perch: w.perch, clockT: w.clockT, fired: w.boardFired, score: w.held, chamber: w.boss ? w.boss.chamber : 0 });
    w.beam = { res, t: 0, next: 0, speed: T.beamCells, n: 0, tail: T.beamTailSecs };
    if (res.length / w.beam.speed < T.beamMinSecs) w.beam.speed = res.length / T.beamMinSecs;
    w.slideT = T.slideSecs;   // anything mid-slide is at its stop now
    w.ghost = null;
    w.wince = T.winceFireSecs;
    w.boardFired++;
    SL.noteShots(run);
    w.sinceShot = 0;
    w.countT = 0;
    w.testInfo.bounces += res.bounces;
    AU().play('beam');
  };

  SL.finishShot = function (run) {
    const w = run.w, b = w.beam, res = b.res, L = w.L, before = w.S;
    w.beam = null;
    w.S = SL.after(L, before, res);
    SL.noteScars(run);
    if (L.mode === 'shot') { w.fromTick = before.tick; w.slideT = 0; AU().play('rail'); }
    w.clockT = 0; w.warned = false;
    w.ghost = { segs: res.segs, stale: false };
    res.growth.forEach(i => {
      w.growT[i] = T.growSecs;
      const P = SL.cellXY(run, i % L.cols, Math.floor(i / L.cols));
      A().burst(P.x, P.y, { n: 12, colors: ['#ffffff', '#bfe9ff', '#ff9ed0'], speed: 90, life: 0.4, gravity: 0, size: 3 });
    });
    w.held += res.hits.length * T.scoreCore + res.bounces * T.scoreBounce;
    if (!SL.alive(w.S)) { boardCleared(run); return; }
    if (res.growth.length) {
      w.wince = T.winceGrowSecs;
      AU().play('grow');
      A().shake(T.shakeGrow[0], T.shakeGrow[1]);
    }
    if (res.relinked.length && !w.seen.twin) { w.seen.twin = 1; SL.say(run, W.twinBack); }
    else if (w.boss) SL.bossAfterShot(run, res);
    else if (res.growth.length) {
      if (!w.seen.growFirst && !run.carry.grewOnce) { w.seen.growFirst = 1; run.carry.grewOnce = 1; SL.say(run, W.growFirst, T.sayLong); }
      else if (Math.random() < T.growTalkChance) SL.sayFrom(run, W.grow, 'grow');   // talk only, so it doesn't touch the seeded play
    }
    SL.noteCrush(run, before.g.concat(res.growth), w.S);
    armLine(run);
    SL.palAfterShot(run, res);
    SL.checkWay(run);
  };

  // A core on a rail crushes any growth it lands on (rules.js). Growths never just vanish: this is the crunch, the burst and the word for it.
  SL.noteCrush = function (run, had, S) {
    const w = run.w, L = w.L, gone = had.filter(i => !S.g.includes(i));
    if (!gone.length) return;
    gone.forEach(i => {
      const P = SL.cellXY(run, i % L.cols, Math.floor(i / L.cols));
      A().burst(P.x, P.y, { n: 14, colors: ['#ffffff', '#bfe9ff', '#d9a93a'], speed: 110, life: 0.4, gravity: 200, size: 3 });
      A().floatText(P.x, P.y - 22, 'CRUSHED', A().PAPER, 15);
    });
    AU().play('crack');
    if (!w.seen.crush) { w.seen.crush = 1; SL.say(run, W.crush, T.sayLong); }
  };

  // Is there still a way through? If not, say so, and Retry is the big button.
  SL.checkWay = function (run) {
    const w = run.w;
    if (w.S.shots <= 0) {
      if (w.undos > 0 && w.history.length) { setDead(run); return; }
      if (w.boss) SL.bossFail(run); else run.lose();
      return;
    }
    if (!SL.stillPossible(w.L, w.S)) setDead(run);
    else w.dead = false;
  };
  function setDead(run) {
    const w = run.w;
    if (w.dead) return;
    w.dead = true;
    w.sayQ = null;
    AU().play('deadend');
    if (w.boss) SL.say(run, W.bossDead, T.sayLong);
    else SL.sayFrom(run, W.dead, 'dead', T.sayLong);
  }

  function armLine(run) {
    const spent = (run.carry.spent || 0) + run.w.fired + run.w.boardFired;
    const said = run.carry.armSaid || 0, next = W.arm[said];
    if (next && spent >= next.at) { run.carry.armSaid = said + 1; SL.say(run, next, T.sayLong); }
  }

  function boardCleared(run) {
    const w = run.w, used = w.boardFired;
    // Every shot fired on this level counts, in earlier attempts too. On the boss, par is per board: shots on boards already beaten don't count against this one.
    const earlier = w.boss ? w.fired - w.boss.firedDone : w.fired, over = Math.max(0, earlier + used - w.L.par);
    w.testInfo.shotsUsed += used; w.testInfo.par += w.L.par;
    AU().play('chime');
    if (w.boss) { SL.bossBoardWon(run, used, over); return; }
    run.addSalvage(SL.levelPay(run, over));
    w.held += Math.max(0, T.scorePar - over * T.scoreOverPar);
    run.addScore(w.held); w.held = 0;
    // A line that praises a clean solve has a plainer one for a clear that went over.
    if (run.stage.winOver) run.stage.winLine = over ? run.stage.winOver : run.stage.winClean;
    const P = SL.place(run);
    A().floatText(Kit.view.w / 2, P.oy + w.L.rows * T.cell / 2 - 12, over ? over + ' OVER PAR' : 'PAR!', over ? A().PAPER : A().GOLD, over ? 22 : 34);
    SL.settle(run);
    run.win(T.winBeatSecs);
  }
})();
