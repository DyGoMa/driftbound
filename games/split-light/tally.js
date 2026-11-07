// Split Light: what a stage costs and pays. The count of shots behind the salvage and Ione's arm, the growths a stage keeps, and the score that adds up over one story run. Logic only.
window.SL = window.SL || {};
(function () {
  const T = TUNE;

  // What a stage has cost since it was last won, by stage: the shots fired, and on levels the growths left on the board (the boss keeps its own within one attempt: boss.js).
  // Retry, running out of shots, Restart, Menu and a reload all start a new attempt, and none of them takes either back: only a win clears them. Kept in the shared save, so closing the tab doesn't forget them.
  const KEY = 'split-light-unfinished';
  const book = () => Object.assign({ aids: {} }, DriftSave.getSetting(KEY, null) || { spent: {}, scars: {} });
  const write = change => { const b = book(); change(b); DriftSave.setSetting(KEY, b); };
  // The undos and scrapes used on a level since it was last won: "one undo per level", so no new attempt hands them back. Not on the boss, where they're per board and a Reset costs nerve.
  SL.aidsLogged = run => Object.assign({ undo: 0, scrape: 0 }, run.dry || run.boss ? null : book().aids[run.index]);
  SL.noteAid = function (run, kind) {
    const w = run.w;
    if (w.boss) return;
    w.aids[kind]++;
    if (!run.dry) write(b => { b.aids[run.index] = w.aids; });
  };
  SL.shotsAlready = run => (run.dry ? 0 : book().spent[run.index] || 0);
  SL.noteShots = function (run) { if (!run.dry) write(b => { b.spent[run.index] = run.w.fired + run.w.boardFired; }); };
  SL.noteScars = function (run, g) { if (!run.dry && !run.w.boss) write(b => { b.scars[run.index] = (g || run.w.S.g).slice(); }); };
  SL.scarsLogged = run => (run.dry || run.w.boss ? [] : book().scars[run.index] || []);
  SL.forgetShots = () => DriftSave.setSetting(KEY, { spent: {}, scars: {} });   // tests only: a clean page
  SL.replaying = run => !run.dry && run.index < DriftSave.game(run.def.id).cleared;

  // What each stage won in this story run left behind, by stage: its own score and its shots. The run's total counts each stage once, up to the one being played, so playing a stage again replaces that stage's part and can't stack up.
  SL.openTally = function (run) {
    const c = run.carry, w = run.w, marks = c.marks || {};
    let score = 0, spent = 0;
    Object.keys(marks).forEach(k => { if (+k < run.index) { score += marks[k].score; spent += marks[k].shots; } });
    if (c.marks) c.spent = spent;
    run.score = run.fair && c.unfair ? 0 : score;   // a run that used upgrades can't feed the fair best
    w.startScore = run.score;
  };
  // What the win leaves behind for the rest of the story run: the shots stay on her arm, the score adds up.
  SL.settle = function (run) {
    const c = run.carry, w = run.w, shots = w.fired + w.boardFired;
    (c.marks = c.marks || {})[run.index] = { score: run.score - w.startScore, shots };
    c.spent = (c.spent || 0) + shots;
    if (!run.fair) c.unfair = 1;
    if (!run.dry) write(b => { delete b.spent[run.index]; delete b.scars[run.index]; delete b.aids[run.index]; });
  };

  // Salvage for a clear: fewest shots pays most, and a stage already cleared pays only a share.
  const replayCut = (run, pay) => (run.w.replay ? Math.max(1, Math.round(pay * T.replayShare)) : pay);
  SL.levelPay = (run, over) => replayCut(run, Math.max(T.minPay, T.setPay[run.stage.level.set] - over * T.overParCost));
  SL.bossPay = (run, nerve) => replayCut(run, T.bossPay + nerve * T.bossNervePay);
})();
