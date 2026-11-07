// Split Light: the game as the kit sees it. Words in words.js, numbers in tuning.js, boards in levels.js, rules in rules.js and solver.js, play in play.js and control.js, Vasch in boss.js, drawing in draw.js, hud.js, art-*.js and scene.js.
(function () {
  const T = TUNE, W = SL.WORDS, AU = Kit.audio;

  // Sounds of the glass. All original, made in code.
  AU.define('turn', [{ w: 'triangle', f: [1500, 2100], d: 0.05, v: 0.14 }, { w: 'noise', f: [7000, 5000], d: 0.02, v: 0.07 }]);
  AU.define('turnsplit', [{ w: 'triangle', f: [1250, 1900], d: 0.05, v: 0.13 }, { w: 'sine', f: [2500, 3100], d: 0.09, v: 0.07 }]);
  [0, 1, 2, 3, 4, 5].forEach(n => AU.define('bounce' + n, [{ w: 'sine', f: [880 * Math.pow(2, n * 2 / 12), 880 * Math.pow(2, n * 2 / 12)], d: 0.16, v: 0.16 }, { w: 'sine', f: [1760 * Math.pow(2, n * 2 / 12), 1760 * Math.pow(2, n * 2 / 12)], d: 0.08, v: 0.06 }]));
  AU.define('split', [{ w: 'sine', f: [1319, 1319], d: 0.22, v: 0.14 }, { w: 'sine', f: [1661, 1661], d: 0.22, v: 0.12 }, { w: 'noise', f: [6000, 3000], d: 0.06, v: 0.1 }]);
  AU.define('burn', [{ w: 'noise', f: [3000, 400], d: 0.26, v: 0.2 }, { w: 'sine', f: [420, 90], d: 0.3, v: 0.2 }, { w: 'sine', f: [2093, 2093], d: 0.2, v: 0.08, at: 0.04 }]);
  AU.define('chamber', [{ w: 'noise', f: [5000, 700], d: 0.3, v: 0.26 }, { w: 'square', f: [240, 60], d: 0.32, v: 0.14 }, { w: 'sine', f: [1760, 880], d: 0.3, v: 0.08, at: 0.03 }]);
  AU.define('grow', [{ w: 'noise', f: [5200, 2400], d: 0.11, v: 0.16 }, { w: 'triangle', f: [340, 980], d: 0.2, v: 0.12 }, { w: 'noise', f: [6400, 4000], d: 0.04, v: 0.12, at: 0.13 }]);
  AU.define('perch', [{ w: 'noise', f: [900, 3400], d: 0.13, v: 0.12 }, { w: 'triangle', f: [880, 1320], d: 0.08, v: 0.09, at: 0.05 }]);
  AU.define('rail', [{ w: 'square', f: [130, 92], d: 0.08, v: 0.13 }, { w: 'noise', f: [1200, 600], d: 0.07, v: 0.08 }]);
  AU.define('tick', [{ w: 'square', f: [1250, 1250], d: 0.025, v: 0.1 }]);
  AU.define('undo', [{ w: 'sine', f: [1000, 380], d: 0.2, v: 0.17 }, { w: 'noise', f: [1800, 5000], d: 0.14, v: 0.06 }]);
  AU.define('scrape', [{ w: 'noise', f: [3600, 900], d: 0.26, v: 0.22 }, { w: 'sawtooth', f: [320, 150], d: 0.2, v: 0.08 }]);
  AU.define('retry', [{ w: 'triangle', f: [500, 780], d: 0.08, v: 0.15 }, { w: 'triangle', f: [780, 500], d: 0.08, v: 0.13, at: 0.08 }]);
  AU.define('deadend', [{ w: 'sawtooth', f: [190, 120], d: 0.3, v: 0.16 }, { w: 'sine', f: [660, 440], d: 0.28, v: 0.1, at: 0.04 }]);
  AU.define('nerve', [{ w: 'sawtooth', f: [300, 80], d: 0.36, v: 0.2 }, { w: 'noise', f: [1400, 300], d: 0.26, v: 0.14 }]);
  AU.define('count', [{ w: 'square', f: [210, 180], d: 0.07, v: 0.16 }, { w: 'sine', f: [840, 840], d: 0.05, v: 0.07 }]);
  AU.define('correct',[{ w: 'square', f: [1900, 1900], d: 0.03, v: 0.12 }, { w: 'square', f: [1500, 1500], d: 0.03, v: 0.12, at: 0.09 }, { w: 'triangle', f: [1250, 1600], d: 0.08, v: 0.12, at: 0.17 }]);

  // His face in the talk scenes, on this game's page only: the bust picture, zoomed to head and collar. The code face is only for when the picture can't load.
  Kit.speakers.add('vasch', Object.assign({}, Kit.speakers.vasch, { paint: SL.paintVaschTalk }));

  const stages = SL.LEVELS.map((level, i) => {
    const w = W.levels[i];
    return { name: w.name, set: SL.SETS[level.set], boss: false, level, talk: w.talk, winLine: w.win, winClean: w.win, winOver: w.winOver };
  });
  stages.push({ name: W.boss.name, set: SL.SETS[4], boss: true, level: null, talk: W.boss.talk, loseLines: W.boss.loseLines, winLine: W.boss.win });

  Kit.start({
    id: 'split-light', title: 'Split Light', island: 'The Glass Ward', tagline: W.tagline,
    orientation: 'portrait',
    endless: false,   // FRIDAY_BATCH.md: puzzle levels and a final boss puzzle, no endless
    stages,
    ending: W.ending,
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    upgrades: W.upgrades,
    palLines: W.palLines,
    music: { bpm: 96, root: 57, scale: 'dorian', bassWave: 'triangle', leadWave: 'sine',
      bass: '0 . . 0 . . 4 . 2 . . 2 . . 5 . 0 . . 0 . . 4 . 3 . 2 . 1 . 4 .',
      lead: '7 9 11 . 9 . 7 . 11 . 9 7 . 4 . . 4 7 9 . 7 . 4 . 2 . 4 7 . . . .',
      drums: 'k . h . s . h h k . h . s . h . k k h . s . h h k . h s s . h .' },
    bossMusic: { bpm: 120, root: 45, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'triangle',
      bass: '0 . 0 . 1 . 0 . 0 . 0 . 3 . 1 . 0 . 0 . 1 . 0 . 5 . 3 . 1 . 0 .',
      lead: '14 . . 13 . 11 . . 14 . . 15 . 13 . . 11 . . 10 . 8 . . 7 . 8 . 10 . 11 .',
      drums: 'K h h h s h h h k h h h s h h k K h h h s h h h k h k h s s s h' },
    titleDraw: SL.titleDraw,
    titleArt: '../../art/site/glassward-v1-web.webp',
    sayAt: 'top',   // the strip above the board, clear of the board, the shots row, Ione's window and the buttons
    compactSay: true,   // the kit's tighter talk box on the narrowest phones, so it stays in that strip and clear of Pause
    stageRows: true,    // the 17 stages are 4 to a set: rows of 4, the boss on its own row
    test: { maxSeconds: 200, idleSeconds: 60, idleNeverLoses: true },   // a puzzle waits for you: with nobody playing, nothing happens on a level. On the boss Vasch's count fires for you at about 45 s, which never wins it; 60 s here so the smoke test sees that

    init(run) {
      SL.newWorld(run);
      SL.openTally(run);   // the score adds up over a story run, each stage counted once, so Best means a whole run
    },
    update(dt, run, input) { SL.step(run, dt, input); },
    render: SL.render,
    hud: SL.hud,
    bot: SL.bot,
  });
})();
