// Silent Cut: the game as the kit sees it. Words in words.js, numbers in tuning.js and tuning-stages.js, rules in world.js, foes.js, boss.js and rules.js, sound and score in feedback.js, drawing in draw.js.
(function () {
  const T = TUNE, L = TUNE_STAGES, W = SC.WORDS;

  // Silas's lines between play answer to what the run has already cost him, in hoarse versions written so the replies to them still make sense. The stage object is this game's own copy, so it can be rewritten each attempt.
  function voiceLine(l, rasp) {
    if (l.who !== 'silas' || !rasp) return l;
    return { who: 'silas', text: (rasp >= T.raspMax ? l.rags : l.rough) || SC.brokenLine(l.text, rasp >= 2 ? T.voiceKeepWorse : T.voiceKeep) };
  }
  let lastLose = null;
  function pickLose(list) {
    let l = list[Math.floor(Math.random() * list.length)];
    if (l === lastLose) l = list[(list.indexOf(l) + 1) % list.length];
    lastLose = l;
    return l;
  }
  const stages = L.stages.map((s, i) => Object.assign({}, s, W.stages[i], { baseTalk: W.stages[i].talk, baseWin: W.stages[i].winLine, radio: (W.stages[i].radio || []).map((l, j) => Object.assign({}, l, { at: s.radioAt[j] })) }));

  // One thumb: a short press is a tap; two taps close together are a Surge; a longer press creeps. Keys: Right or D to creep, F to strike, E or Shift to Surge.
  // A tap is whatever the kit calls a tap, so a slow thumb still strikes. Two quick ones get the long window, from letting go of the first to pressing the second. If either ran slow, the window is short, so hold, let go, hold in a crate's shade doesn't Surge.
  function readThumb(w, input) {
    const me = w.thumb || (w.thumb = { lastUp: -9, gap: 9, lastQuick: false });
    const c = { hold: false, act: false, surge: false, late: false, creeping: false };
    c.hold = (input.down && input.held >= T.creepDelay) || input.key('ArrowRight') || input.key('KeyD');
    if (input.pressed && !input.down) me.gap = w.t - me.lastUp;   // pressed and lifted inside one step
    if (input.tap) {
      const quick = input.held <= T.tapMax;
      c.act = true;
      if (w.t - w.s.struckAt < T.strikeCalm) me.lastUp = -9;   // a worried second tap after a strike: it can cut someone else, but it's no Surge
      else if (me.gap <= (quick && me.lastQuick ? T.doubleGap : T.tapSlowGap)) { c.surge = true; me.lastUp = -9; }
      else {
        c.late = (quick || me.lastQuick) && me.gap <= T.doubleLate;
        c.creeping = !quick && !c.late;   // with nothing to act on, a slow press was just a short creep: no puff, no "QUICKER"
        me.lastUp = w.t; me.lastQuick = quick;
      }
    } else if (input.released) me.lastUp = -9;   // a long press isn't the first half of anything
    if (input.pressed && input.down) me.gap = w.t - me.lastUp;    // still down: measured now, judged when it lifts
    if (input.keyPressed('KeyF')) c.act = true;
    if (input.keyPressed('KeyE') || input.keyPressed('ShiftLeft') || input.keyPressed('ShiftRight')) c.surge = true;
    return c;
  }

  Kit.start({
    id: 'silent-cut', title: 'Silent Cut', island: 'Lanternreach', tagline: W.tagline,
    orientation: 'landscape',
    endless: true,
    stages,
    endlessStage: Object.assign({ name: 'Endless', lineV: L.endless.lineV, alert: L.endless.alert, fast: L.endless.fast, theme: L.endless.theme, tips: [{ x: 60, key: 'endless' }], clearSalvage: 0 }),
    ending: W.ending,
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    loseLine(run) {
      const w = run.w;
      if (w.s.winded) return pickLose(run.stage.windedLose || W.windedLose);   // only he goes blank; the rest have plenty to say about it
      if (w.lostBy === 'line' && !run.boss) return pickLose(W.lineLose);   // only when that's what lost it; the boss keeps his own list
      return voiceLine(pickLose(run.stage.loseLines || W.loseLines), w.rasp);
    },
    upgrades: W.upgrades,
    palLines: W.palLines,
    // A sneaking walk: plucked bass, a lamp-glass melody, brushes. Original.
    music: { bpm: 96, root: 45, scale: 'dorian', bassWave: 'triangle', leadWave: 'triangle',
      bass: '0 . . 0 . . 4 . 3 . . 3 . . 2 . 0 . . 0 . . 4 . 5 . 4 . 3 . 2 .',
      lead: '. . 7 . . 9 . . 10 . . 9 7 . . . . . 7 . . 5 . . 4 . 5 . 7 . . .',
      drums: 'k . h . . h s . k . h . . h s h k . h . . h s . k h . h . h s h' },
    bossMusic: { bpm: 112, root: 40, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'triangle',
      bass: '0 . 0 . 1 . 0 . 3 . 3 . 1 . 0 . 0 . 0 . 1 . 3 . 5 . 3 . 1 . 0 .',
      lead: '7 . . 8 . . 7 . . . 5 . 3 . . . 7 . . 8 . . 10 . 8 . . 7 . 5 . .',
      drums: 'K . h . s . h . k k h . s . h h K . h . s . h . k k h . s h s h' },
    titleDraw: SC.titleDraw,
    sayAt: 'corner',   // in the band under the street, clear of the play, Silas and the breath panel
    test: { maxSeconds: 420, idleSeconds: 200 },

    init(run) {
      run.w = SC.newWorld(run);
      SC.palInit(run);
      const rasp = run.w.rasp;
      if (run.stage.baseTalk) run.stage.talk = run.stage.baseTalk.map(l => voiceLine(l, rasp));
      if (run.stage.baseWin) run.stage.winLine = voiceLine(run.stage.baseWin, rasp);
      run.w.cam = run.w.s.x - T.camX;
    },
    update(dt, run, input) {
      const w = run.w, s = w.s, x0 = s.x;
      if (run.over) return;
      const c = readThumb(w, input);
      if (run.endless) {
        const E = L.endless;
        w.lineV = Math.min(E.lineMax, E.lineV + w.t * E.lineRamp);
        w.lineLead = Math.max(E.leadMin, T.lineLead - w.t * E.leadShrink);
        w.alert = Math.min(E.alertMax, E.alert + w.t * E.alertRamp);
        if (Math.floor(w.t) !== Math.floor(w.t - dt)) SC.growEndless(w, run.rng);
      }
      SC.step(w, dt, c);
      if (s.x > x0) run.addScore((s.x - x0) * T.scorePerPx);
      const wonNow = w.won;
      SC.feedback(run);
      if (w.lost) { run.lose(); }
      else if (wonNow) {
        if (run.stage.baseWin) run.stage.winLine = run.stage.baseWin.who === 'silas' && s.winded ? { who: 'silas', text: '...' } : voiceLine(run.stage.baseWin, w.rasp);
        run.addSalvage(run.stage.clearSalvage || 0);
        run.addScore(T.scoreClear + Math.max(0, (run.stage.par || 0) - run.time) * T.scoreTimePerSec);
        if (w.alarms === 0) {
          run.addSalvage(T.ghostSalvage); run.addScore(T.scoreGhost);
          if (!run.boss) Kit.art.floatText(T.camX, T.groundY - 110, 'GHOST', '#d9c8ff', 26);   // the boss's last frame stays behind the ending talk, and so would this
        }
        run.win(run.boss ? T.bossWinBeat : undefined);
      }
      w.testInfo = { alarms: w.alarms, strikes: w.strikes, cuts: w.cuts, surges: w.surges, winds: w.winds, closes: w.closes, x: Math.round(s.x), lineGap: Math.round(s.x - w.line), rasp: w.rasp, hp: w.boss ? w.boss.hp : null, by: w.lostBy || null };
    },
    render: SC.render,
    hud: SC.hud,
    bot: SC.bot,
  });
})();
