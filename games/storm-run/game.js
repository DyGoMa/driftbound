// Storm Run: the game as the kit sees it. Words in words.js, numbers in tuning.js, rules in runner.js, spawn.js and boss.js, drawing in draw.js.
(function () {
  const T = TUNE, W = SR.WORDS;

  Kit.audio.define('zap', [{ w: 'square', f: [1800, 240], d: 0.08, v: 0.1 }, { w: 'noise', f: [6000, 2000], d: 0.06, v: 0.1, at: 0.02 }]);
  Kit.audio.define('numb', [{ w: 'sawtooth', f: [420, 60], d: 0.5, v: 0.2 }, { w: 'noise', f: [2600, 300], d: 0.4, v: 0.12 }]);

  Kit.start({
    id: 'storm-run', title: 'Storm Run', island: 'Pinhold', tagline: W.tagline,
    orientation: 'landscape',
    endless: true,
    stages: T.stages.map((s, i) => Object.assign({}, s, W.stages[i])),
    endlessStage: Object.assign({ name: 'Endless' }, T.endless),
    ending: W.ending,
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    loseLine(run) { return !run.boss && run.w.numb > 0 ? W.numbLose : null; },
    upgrades: W.upgrades,
    palLines: W.palLines,
    music: { bpm: 152, root: 45, scale: 'minor', bassWave: 'sawtooth', leadWave: 'square',
      bass: '0 . 0 0 . 0 7 . 5 . 5 5 . 5 3 . 0 . 0 0 . 0 7 . 3 . 3 5 . 3 2 .',
      lead: '7 . 9 10 . 9 7 . 5 . 7 8 . 7 5 . 7 . 9 10 . 12 14 . 12 . 10 9 . 7 . .',
      drums: 'k h s h k k s h k h s h k k s s k h s h k k s h k h s h k s k s' },
    bossMusic: { bpm: 172, root: 40, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'sawtooth',
      bass: '0 0 . 0 1 . 0 . 0 0 . 0 3 . 1 . 0 0 . 0 1 . 0 . 5 . 3 . 1 . 0 .',
      lead: '7 . . 8 7 . 5 . 7 . . 8 10 . 8 . 12 . . 13 12 . 10 . 8 . 7 . 5 . 7 .',
      drums: 'K h s h k h s k K h s h k k s k K h s h k h s k K s k s K s s s' },
    titleDraw: SR.titleDraw,
    sayAt: 'corner',   // in the rock under the road, clear of the play, the boss's pips and the progress bar
    test: { maxSeconds: 240, idleSeconds: 120 },

    init(run) {
      const boss = run.boss, home = boss ? T.bossX : T.playerX;
      if (boss && !run.dry && !Kit.art.has('silt_hound_run')) SR.prebakeHound();
      run.w = {
        k: SR.newBody(), kx: home, homeX: home,
        scar: 0, numb: 0, scarFlash: 0, deadTap: 0, lastSurge: 0, surges: 0, numbCount: 0, surgeT: 0, dash: null, echoes: [], echoT: 0,
        fade: T.scarFade * (1 + T.coolPerLevel * run.up('cool')), reach: T.grabRadius + T.pullPerLevel * run.up('pull'),
        hits: T.hits, hitsTaken: 0, hitBy: [], catches: Math.max(0, T.catchPerLevel * run.up('catch') - (run.carry.catchesUsed || 0)), inv: 0, hurtT: 0, catchT: 0,
        speed: run.stage.speed, scroll: 0, dist: 0, stepT: 0,
        foes: [], coins: [], pal: null, boltTried: false, pending: null, nextArrival: T.firstArrival, lastTall: -99, radioI: 0,
        boss: boss ? SR.bossNew() : null,
      };
    },
    update(dt, run, input) {
      const pressed = input.pressed || input.keyPressed('ArrowUp') || input.keyPressed('KeyW');
      const down = input.down || input.key('ArrowUp') || input.key('KeyW');
      SR.step(run, dt, pressed, down);
    },
    render: SR.render,
    hud: SR.hud,
    bot: SR.bot,
  });
})();
