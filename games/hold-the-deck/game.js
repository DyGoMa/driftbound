// Hold the Deck: the game as the kit sees it. Words in words.js, numbers in tuning.js, rules in bram.js, foes.js, hazards.js, waves.js, boss.js; drawing in draw.js and hud.js.
(function () {
  const T = TUNE, W = HD.WORDS;

  // Effects of its own. Every action has a sound; the rest are the kit's.
  const au = Kit.audio;
  au.define('stomp', [{ w: 'noise', f: [500, 260], d: 0.06, v: 0.1 }, { w: 'sine', f: [110, 60], d: 0.06, v: 0.12 }]);
  au.define('clunk', [{ w: 'noise', f: [1400, 500], d: 0.05, v: 0.12 }, { w: 'square', f: [240, 150], d: 0.08, v: 0.1 }, { w: 'sine', f: [90, 50], d: 0.1, v: 0.16 }]);
  au.define('ironOn', [{ w: 'square', f: [520, 1040], d: 0.1, v: 0.1 }, { w: 'sine', f: [140, 80], d: 0.3, v: 0.22 }, { w: 'noise', f: [3000, 5000], d: 0.14, v: 0.08 }]);
  au.define('charge', [{ w: 'sawtooth', f: [70, 150], d: 0.7, v: 0.22 }, { w: 'noise', f: [300, 800], d: 0.7, v: 0.18 }]);
  au.define('pot', [{ w: 'square', f: [1300, 1100], d: 0.09, v: 0.1 }, { w: 'square', f: [760, 680], d: 0.16, v: 0.1, at: 0.05 }, { w: 'noise', f: [4200, 1500], d: 0.2, v: 0.16 }]);
  au.define('snore', [{ w: 'sawtooth', f: [70, 95], d: 0.3, v: 0.12 }, { w: 'noise', f: [500, 300], d: 0.25, v: 0.06 }]);
  au.define('chain', [{ w: 'square', f: [1800, 1500], d: 0.05, v: 0.07 }, { w: 'square', f: [1500, 1300], d: 0.05, v: 0.07, at: 0.07 }, { w: 'square', f: [1700, 1400], d: 0.05, v: 0.07, at: 0.14 }]);
  au.define('roar', [{ w: 'sawtooth', f: [190, 70], d: 0.7, v: 0.26 }, { w: 'noise', f: [700, 180], d: 0.7, v: 0.2 }]);
  au.define('slash', [{ w: 'noise', f: [5000, 900], d: 0.2, v: 0.26 }, { w: 'sawtooth', f: [600, 120], d: 0.14, v: 0.12 }]);
  au.define('whiff', [{ w: 'noise', f: [1800, 600], d: 0.12, v: 0.1 }, { w: 'sine', f: [220, 140], d: 0.1, v: 0.08 }]);
  au.define('crate', [{ w: 'noise', f: [1500, 300], d: 0.2, v: 0.28 }, { w: 'sine', f: [160, 50], d: 0.2, v: 0.28 }]);

  function talkFor(run) {
    // Sela hears the iron in stage 4 if it's got that far.
    const s = W.stages[run.index];
    if (!s || !s.talkHigh || !s.talk) return;
    run.stage.talk = s.talk.slice(0, -1).concat([(run.carry.iron || 0) >= T.ironLineAt ? s.talkHigh : s.talk[s.talk.length - 1]]);
  }

  // The ending says how far the grey went: low, mid or high. Remembered in the save, so "See how it ends" shows the same story.
  function endingFor(band) {
    const E = W.ending;
    Kit.def.ending = E.open.concat(E[band], E.close);
    Kit.def.endingCard = band === 'high' ? { title: W.endingCard.title, text: W.endingCard.text + W.endingCardHigh } : W.endingCard;
  }

  Kit.start({
    id: 'hold-the-deck', title: 'Hold the Deck', island: 'Keelbreak', tagline: W.tagline,
    orientation: 'portrait',
    endless: true,
    stages: T.stages.map((s, i) => Object.assign({}, s, W.stages[i])),
    endlessStage: Object.assign({ name: 'Endless' }, T.endless),
    ending: W.ending.open.concat(W.ending.low, W.ending.close),
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    loseLine(run) {
      const w = run.w;
      if (!HD.foughtTry(run)) return W.noFightLose;   // says why this try earned nothing
      if (w.tookVolley && !w.ironUses && !HD.locked(run)) return W.noHoldLose;   // took them all on the chin: says why this try earned nothing
      if (w.chinned >= T.volleyChinMax && !HD.locked(run)) return W.ribsLose;   // down with Guts to spare: says why
      if (run.boss && HD.triesLost(run) >= T.boss.adviceFrom && HD.triesLost(run) % 2 === 0 && (run.carry.iron || 0) >= T.ironLineAt) return W.boss.advice;   // deep in the grey and stuck on the bear: says what can be done, every other try
      if (!run.boss && HD.locked(run)) return W.lockedLose;
      if (!w.pal) return null;
      const clean = (run.stage.loseLines || W.loseLines).filter(l => !l.adult);   // batch rule: pals are never in flirting or innuendo, and one's still on deck behind this screen. Math.random: which line is only a look
      return clean[Math.floor(Math.random() * clean.length)];
    },
    upgrades: W.upgrades,
    palLines: W.palLines,
    // A work song: a stomp, a hornpipe over it, in D dorian. Made for this game.
    music: { bpm: 124, root: 50, scale: 'dorian', bassWave: 'triangle', leadWave: 'square',
      bass: '0 . . . 4 . . . 0 . . . 4 . 3 . 0 . . . 4 . . . 5 . . . 4 . 2 .',
      lead: '7 . 9 . 11 . 9 7 8 . 7 . 5 . 4 . 7 . 9 . 11 . 12 . 11 9 8 . 7 . . . 11 . 12 . 14 . 12 11 9 . 11 . 9 . 7 . 8 . 9 . 11 . 9 8 7 . 4 . 7 . . .',
      drums: 'k . h . s . h . k k h . s . h h k . h . s . h . k k h . s h s s' },
    // The bear: slow iron steps in E phrygian, and a line that keeps falling back.
    bossMusic: { bpm: 138, root: 40, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'sawtooth',
      bass: '0 0 . 0 . 0 1 . 0 0 . 0 . 3 1 . 0 0 . 0 . 0 1 . 5 . 3 . 1 . 0 .',
      lead: '7 . . . 8 . 7 . 5 . . . 3 . 1 . 7 . . . 8 . 10 . 8 . 7 . 5 . 3 .',
      drums: 'K . h . k . s . K k h . s . k k K . h . k . s . K s k s K s s s' },
    titleDraw: HD.titleDraw,
    sayAt: 'top',   // above the far end of the deck, away from the read-outs and from Bram. Danger is warned on the lane itself, below it
    test: { maxSeconds: 400, idleSeconds: 200 },

    init(run) {
      if (run.carry.iron === undefined) run.carry.iron = 0;
      run.w = Object.assign(HD.newBram(run), {
        foes: [], debris: [], walls: [], warns: [], splats: [], stuck: [], bounces: [], cogs: [], warnLog: [],
        saidFirst: {}, hurtBy: {}, hitLog: [], meals: {}, pal: null, rivetTried: false,
        kills: 0, throughs: 0, hitsTaken: 0, ironUses: 0, charges: 0, blocks: 0, volleys: 0, mealsAsked: 0, doorHit: 0, doorLane: 1,
        speedMul: run.stage.speed || 1, boss: run.boss ? HD.bossNew(run) : null, look: run.stage.look || 0,
      });
      HD.storyStart(run);   // before anything reads the iron: a stage picked out of order takes on the grey of the run that got there
      if (run.boss) { run.w.phase = 'boss'; run.w.bannerText = ''; } else HD.newWaves(run);
      run.w.hintText = (HD.locked(run) && run.stage.hintLocked) || run.stage.hint || ''; run.w.hintT = run.stage.hint ? T.hintSecs : 0;
      if (!run.dry) talkFor(run);
    },

    update(dt, run, input) {
      const w = run.w;
      HD.control(run, input, dt);
      HD.stepSay(run, dt);
      if (w.mercy && !w.saidMercy) { w.saidMercy = true; HD.say(run, run.boss ? W.boss.mercy : W.mercy); }
      if (HD.locked(run)) HD.first(run, 'locked');   // told as soon as it's true, including a stage that starts that way
      if (w.hitStop > 0) { w.hitStop -= dt; return; }   // a few frames' weight on a big hit. The thumb above still counts
      HD.stepBram(run, dt);
      if (w.doorHit > 0) w.doorHit -= dt;
      if (w.hintT > 0) w.hintT -= dt;
      for (const c of w.cogs) c.age += dt;
      w.cogs = w.cogs.filter(c => c.age < 0.7);
      for (const s of w.stuck) s.age += dt;
      for (const b of w.bounces) b.t += dt;
      w.bounces = w.bounces.filter(b => b.t < 0.32);
      HD.stepWarns(run, dt);
      if (run.over) return;
      HD.stepFoes(run, dt);
      if (run.over) return;
      if (run.boss ? HD.bossStep(run, dt) : HD.stepWaves(run, dt)) return;
      if (run.over) return;
      if (HD.palStep(run, dt)) return;
      const b = w.boss;
      w.testInfo = { guts: w.guts, gutsMax: w.gutsMax, iron: Math.round((run.carry.iron || 0) * 1000) / 1000, ironUses: w.ironUses, chinned: w.chinned, swingsHit: w.swingsHit, kills: w.kills, throughs: w.throughs, hitsTaken: w.hitsTaken, hurtBy: w.hurtBy, hitLog: w.hitLog, charges: w.charges, blocks: w.blocks, meals: w.meals, wave: w.wave, phase: b ? b.phase : null, bear: b ? b.state : null, warnLog: w.warnLog, caught: w.caughtNow || null };
    },

    render: HD.render,
    hud: HD.hud,
    bot: HD.bot,
    botAsk: HD.botAsk,
  });

  // After a win on the last stage, the ending knows how much grey there is. The kit reads def.ending when the talk starts.
  const remember = () => { if (window.DriftSave && Kit.def) endingFor(DriftSave.getSetting('hd_ending_band', 'low')); };
  DriftGate.whenPassed(() => setTimeout(remember, 0));
  HD.rememberEnding = function (iron) {
    const band = iron >= T.endingHigh ? 'high' : iron >= T.endingMid ? 'mid' : 'low';
    DriftSave.setSetting('hd_ending_band', band);
    endingFor(band);
  };
})();
