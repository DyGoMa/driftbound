// Split Light: what the thumb can do between shots: turn a crystal, move Prism, retry, undo, scrape. The shot itself and winning and losing are in play.js.
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, A = () => Kit.art, AU = () => Kit.audio;

  SL.tapCell = function (run, i) {
    const w = run.w, L = w.L, piece = L.pieces[i], grew = w.S.g.includes(i);
    if (w.scraping) {
      w.scraping = false;
      if (grew) SL.scrape(run, i); else AU().play('back');
      return;
    }
    const perch = L.perches.findIndex(p => p.i === i);
    if (perch >= 0) {
      if (perch !== w.perch) { w.perch = perch; AU().play('perch'); w.ghost = null; const P = SL.cellXY(run, L.perches[perch].x, L.perches[perch].y); A().burst(P.x, P.y, { n: 6, colors: ['#ff9ed0', '#ffe06a', '#7fe8a0', '#8fd3f0'], speed: 70, life: 0.35, gravity: 0 }); }
      return;
    }
    if (grew) {
      AU().play('denied');
      w.turnT[i] = -T.turnSecs;
      if (!w.seen.growTap) { w.seen.growTap = 1; SL.sayFrom(run, W.growTap, 'growTap'); }
      return;
    }
    if (!piece || piece.t === 'p') { AU().play(piece ? 'land' : 'step'); return; }
    if (piece.t === 'f') {
      AU().play('clang');
      w.turnT[i] = -T.turnSecs;
      if (!w.seen.clamp) { w.seen.clamp = 1; SL.say(run, W.clamp); }
      return;
    }
    w.lean[i] = w.lean[i] ? 0 : 1;
    w.turnT[i] = T.turnSecs;
    w.touched = true;
    if (w.ghost) w.ghost.stale = true;
    AU().play(piece.t === 's' ? 'turnsplit' : 'turn');
  };

  SL.retry = function (run) {
    const w = run.w;
    if (SL.busy(w)) return;
    if (w.boss) { if (!w.boardFired) return; SL.bossFail(run, true); return; }
    w.testInfo.retries++;
    AU().play('retry');
    if (w.boardFired) SL.sayFrom(run, W.retryKept, 'retry');   // crystals back, but the shots stay spent, on her arm and in the pay, and the growths in the way stay on the board
    w.fired += w.boardFired;
    w.held = 0;
    SL.loadBoard(run, run.stage.level, w.S.g);
  };

  SL.undo = function (run) {
    const w = run.w, h = w.history.pop();
    if (!h || w.undos <= 0 || SL.busy(w)) { if (h) w.history.push(h); AU().play('denied'); return; }
    w.undos--;
    SL.noteAid(run, 'undo');
    w.S = h.S; w.lean = h.lean; w.perch = h.perch; w.clockT = h.clockT; w.boardFired = h.fired;
    w.held = h.score; if (w.boss) w.boss.chamber = h.chamber;
    w.ghost = null; w.dead = false; w.slideT = T.slideSecs; w.scraping = false; w.corrected = null; w.sayQ = null;
    w.countT = 0;   // his count starts over, as it does after a shot, or he'd fire the same shot straight back
    SL.noteShots(run);
    SL.noteScars(run);
    AU().play('undo');
  };

  SL.scrape = function (run, i) {
    const w = run.w;
    if (w.scrapes <= 0) return;
    w.scrapes--;
    SL.noteAid(run, 'scrape');
    w.S = Object.assign({}, w.S, { g: w.S.g.filter(c => c !== i) });
    const P = SL.cellXY(run, i % w.L.cols, Math.floor(i / w.L.cols));
    A().burst(P.x, P.y, { n: 14, colors: ['#ffffff', '#bfe9ff'], speed: 120, life: 0.4, gravity: 200, size: 3 });
    AU().play('scrape');
    w.history = w.history.map(h => Object.assign({}, h, { S: Object.assign({}, h.S, { g: h.S.g.filter(c => c !== i) }) }));   // it stays gone through an Undo, and the Undo stays
    w.ghost = null;
    SL.noteScars(run);
    if (SL.alive(w.S)) { w.dead = false; SL.checkWay(run); }
  };
})();
