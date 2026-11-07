// Kit game: Kit.start(def). Owns the flow: title, stages, talk, play, boss, ending, endless, salvage, pals, pause.
// A game supplies only def: its words and numbers, plus init, update, render and bot. See README.md.
(function () {
  let def = null, run = null, botOn = false, lastLine = null;
  const STEP = Kit.STEP, UI = () => Kit.ui, A = () => Kit.art, I = () => Kit.input;
  const END_DELAY = 0.7;   // PROVISIONAL: seconds the last moment of a stage stays on screen

  Kit.start = function (d) { DriftGate.whenPassed(() => boot(d)); };

  function boot(d) {
    def = Object.assign({ stages: [], upgrades: [], loseLines: [], ending: [] }, d);
    Kit.def = def;
    Kit.audio.load();
    Kit.mount(def);
    if (def.compactSay) document.documentElement.classList.add('kit-compact-say');
    Kit.art.loadSprites();
    Kit.onStep = onStep;
    Kit.onDraw = onDraw;
    document.title = def.title + ' \u00b7 Driftbound';   // set here, so the tab names no game before the 18+ answer
    // A hidden tab may never come back on a phone, so what the run has earned so far is saved at once, on any screen of the run (a choice, a catch).
    Kit.onHidden = () => { if (run && !run.dry) bank(run); if (run && Kit.active && !Kit.paused) pause(); Kit.audio.suspend(); };
    Kit.onBlocked = () => { if (run && Kit.active && !Kit.paused) pause(); };   // phone turned the wrong way
    Kit.onVisible = () => { Kit.audio.resume(); };
    addEventListener('keydown', e => {
      if (run && UI().screen === 'play' && (e.code === 'Escape' || e.code === 'KeyP')) pause();
      else if (UI().screen === 'paused' && (e.code === 'Escape' || e.code === 'KeyP')) resume();
    });
    Kit.audio.music(def.music || null);
    title();
    // Browser Back or Forward can bring this page out of memory without running it again. The save may have moved on since (another game, a spend), so the menus read it again.
    addEventListener('pageshow', e => {
      if (!e.persisted) return;
      const on = UI().screen;
      if (on === 'title') title();
      else if (on === 'stages') stages();
      else if (on === 'upgrades') UI().upgrades(def, title);
    });
    if (Kit._testReady) Kit._testReady(hooks);
  }

  // ---- Runs. One attempt at one stage. This object is what the game's hooks work with.
  function mulberry(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const clone = x => JSON.parse(JSON.stringify(x || {}));
  // A run counts as fair with the switch on, or when nothing has been bought for this game yet: both play the base numbers.
  function switchOrNoUpgrades() {
    const g = DriftSave.game(def.id);
    return g.fair || !Object.values(g.upgrades).some(v => v > 0);
  }
  function makeRun(index, o = {}) {
    const endless = !!o.endless;
    const stage = endless ? (def.endlessStage || def.stages[Math.max(0, def.stages.length - 2)] || {}) : def.stages[index];
    const fair = o.fair === undefined ? switchOrNoUpgrades() : !!o.fair;
    const seed = o.seed !== undefined ? o.seed : (Kit.test ? Kit.seed * 1000 + (endless ? 999 : index) : (Date.now() ^ (Math.random() * 1e9)));
    const rng = mulberry(seed);
    const r = {
      def, stage, index: endless ? -1 : index, endless, fair, boss: !endless && !!stage.boss, dry: !!o.dry,
      time: 0, score: 0, salvage: 0, over: null, overIn: 0, seed, talkFilter: null, caught: [], w: {},
      carry: clone(o.carry), carryAtStart: clone(o.carry), continued: !!o.continued, banked: 0, bankedOnce: false, hadNewBest: false,
      rng, range: (a, b) => a + rng() * (b - a), int: (a, b) => a + Math.floor(rng() * (b - a + 1)), pick: arr => arr[Math.floor(rng() * arr.length)],
      up: id => (fair ? 0 : DriftSave.upgradeLevel(def.id, id)),
      addScore(n) { r.score = Math.max(0, r.score + n); },
      addSalvage(n) { r.salvage = Math.max(0, r.salvage + n); },
      win(delay) { if (!r.over) { r.over = 'win'; r.overIn = r.dry ? 0 : (delay === undefined ? END_DELAY : delay); } },
      lose(delay) { if (!r.over) { r.over = 'lose'; r.overIn = r.dry ? 0 : (delay === undefined ? END_DELAY : delay); } },
      hasPal: id => DriftSave.hasPal(id) || r.caught.includes(id),
      catchPal(id) { return catchPal(r, id); },
      say(who, text, secs, at) { if (r.dry) return; UI().say(who, r.talkFilter ? r.talkFilter(text) : text, secs, at || def.sayAt); },
      ask(spec, done) { return ask(r, spec, done); },
    };
    A().clearFx();
    I().reset();
    if (def.init) def.init(r);
    return r;
  }

  function ask(r, spec, done) {
    // The bot answers straight away. A dry test run with no bot takes the first option.
    if (botOn || r.dry) {
      const i = def.botAsk ? def.botAsk(spec, r) : 0;
      done(spec.options[Math.max(0, Math.min(spec.options.length - 1, i || 0))]);
      return;
    }
    Kit.active = false;
    I().reset();
    UI().ask(spec, opt => { backToPlay(); done(opt); });
  }

  function catchPal(r, id) {
    if (r.hasPal(id)) return false;
    r.caught.push(id);
    if (r.dry) return true;
    DriftSave.catchPal(id);
    const pal = window.DRIFT_PALS && DRIFT_PALS.get(id);
    if (!pal) return true;
    const line = (def.palLines || {})[id];
    Kit.active = false;
    I().reset();
    UI().catchMoment(pal, line, backToPlay);
    return true;
  }

  function backToPlay() { UI().clear('play'); I().reset(); Kit.active = true; }

  function stepRun(r, bot) {
    const inp = I();
    if (bot && def.bot) def.bot(r, inp);
    inp._begin(STEP);
    if (!r.over) { r.time += STEP; if (def.update) def.update(STEP, r, inp); }
    else r.overIn -= STEP;
    inp._end();
  }
  function onStep(dt) {
    if (!run) return;
    stepRun(run, botOn);
    A().fxStep(dt);
    UI().sayStep(dt);
    if (run.over && run.overIn <= 0 && Kit.active) endRun();
  }

  function onDraw(ctx, view, real) {
    if (run && UI().screen !== 'title') {
      if (def.render) def.render(ctx, run, view);
      A().drawFx(ctx);
      if (!/talk/.test(UI().screen)) (def.hud || A().hud)(ctx, run, view);   // no play read-outs behind a talk scene
    } else {
      idle += real;
      if (def.titleDraw) def.titleDraw(ctx, view, idle);
      else A().duskSky(ctx, view, idle);
    }
  }
  let idle = 0;

  // ---- Flow
  function title() {
    run = null; Kit.active = false; Kit.paused = false;
    A().clearFx(); UI().pauseButton(false); UI().sayClear();
    Kit.audio.music(def.music || null);
    UI().title(def, { story: stages, endless: () => play(0, { endless: true }), upgrades: () => UI().upgrades(def, title) });
  }
  // Picking from the list: stage 1 is a new story run; any later stage carries on with what the run has cost so far (see README, run.carry).
  function pickStage(i) {
    const saved = i > 0 ? DriftSave.storyCarry(def.id) : null;
    beginStage(i, saved ? { carry: saved, continued: true } : undefined);
  }
  function stages() { UI().stages(def, pickStage, title, () => ending(), !!DriftSave.storyCarry(def.id)); }

  // Talk scene first (over the frozen stage), then play.
  function beginStage(i, o) {
    Kit.active = false; Kit.paused = false;
    run = makeRun(i, o);
    const lines = run.stage.talk;
    if (lines && lines.length) UI().talk(lines, () => startPlaying());
    else startPlaying();
  }
  function play(i, o) { Kit.active = false; Kit.paused = false; UI().sayClear(); run = makeRun(i, o); startPlaying(); }
  // Another attempt at the same stage: what carried in comes back as it was when the stage began.
  const again = r => ({ endless: r.endless, carry: r.carryAtStart, continued: r.continued });
  function startPlaying() {
    UI().clear('play');
    UI().pauseButton(true, pause);
    I().reset();
    Kit.active = true;
    Kit.audio.music((run.boss && def.bossMusic) || def.music || null);
  }

  function pause() {
    if (!run || !Kit.active || Kit.paused) return;
    Kit.paused = true;
    I().reset();
    UI().pauseMenu({
      resume,
      restart: () => { const r = run; bank(r); Kit.paused = false; play(r.index, again(r)); },
      quit: () => { bank(run); Kit.paused = false; title(); },
    });
  }
  function resume() { Kit.paused = false; UI().clear('play'); I().reset(); }

  function pickLine(r) {
    if (def.loseLine) { const l = def.loseLine(r); if (l) return l; }
    const list = (r.stage && r.stage.loseLines) || def.loseLines;
    if (!list.length) return null;
    let l = list[Math.floor(Math.random() * list.length)];
    if (l === lastLine && list.length > 1) l = list[(list.indexOf(l) + 1) % list.length];
    lastLine = l;
    return l;
  }

  // Saves what the run has earned so far. Safe to call more than once: only what's new since the last call is added,
  // and one attempt counts as one play. A stage already won counts as cleared, and beating the last one opens Endless,
  // whatever the player taps next or even if the page closes.
  function bank(r) {
    const total = Math.floor(r.salvage), score = Math.floor(r.score);
    if (!r.bankedOnce && !total && !score && !r.over) return null;
    const rec = DriftSave.finishRun(def.id, score, Math.max(0, total - r.banked), { fair: r.fair, sameRun: r.bankedOnce });
    r.bankedOnce = true; r.banked = total;
    r.hadNewBest = r.hadNewBest || rec.newBest; rec.newBest = r.hadNewBest;
    if (r.over === 'win' && !r.endless) {
      DriftSave.clearStage(def.id, r.index);
      const lastStage = r.index === def.stages.length - 1;
      DriftSave.setStoryCarry(def.id, lastStage ? null : r.carry);   // the story run is over at the end; until then its costs stay, through the menu and a reload
      if (lastStage && !DriftSave.game(def.id).finished) { DriftSave.finishStory(def.id); r.openedStory = true; }
    }
    return rec;
  }

  function endRun() {
    const r = run, won = r.over === 'win';
    Kit.active = false;
    UI().pauseButton(false); UI().sayClear();
    const earned = Math.floor(r.salvage);
    const rec = bank(r);
    const last = !r.endless && r.index === def.stages.length - 1;
    Kit.audio.play(won ? 'win' : 'lose');
    UI().result({ won, endless: r.endless, boss: r.boss, last, score: r.score, earned, rec, fair: r.fair, line: won ? (r.stage.winLine || null) : pickLine(r) }, {
      next: () => (last ? ending(r.openedStory) : beginStage(r.index + 1, { carry: r.carry, continued: true })),
      retry: () => play(r.index, again(r)),   // dying restarts the current stage, without the talk again
      menu: title,
    });
  }

  function ending(openedNow) {
    const before = DriftSave.game(def.id).finished;
    DriftSave.finishStory(def.id);
    Kit.audio.music(def.music || null);   // the fight is over: the boss theme stops here, not at the title
    UI().talk(def.ending,() => UI().ending(def, !!openedNow || !before, title), 'ending-talk');
  }

  // ---- Test hooks. Only installed under ?test (test.js).
  const hooks = {
    state() {
      return { game: def.id, screen: UI().screen, active: Kit.active, paused: Kit.paused, blocked: Kit.blocked, steps: Kit.steps, timeScale: Kit.timeScale, bot: botOn,
        stageCount: def.stages.length, index: run ? run.index : null, endless: run ? run.endless : null, fair: run ? run.fair : null, boss: run ? run.boss : null,
        time: run ? run.time : 0, score: run ? run.score : 0, salvage: run ? run.salvage : 0, over: run ? run.over : null, hasBot: !!def.bot, orientation: def.orientation || 'landscape' };
    },
    bot(on) { botOn = !!on; return botOn; },
    jump(i, o = {}) { if (o.talk) beginStage(i); else play(i, o); return hooks.state(); },
    title,
    ending,
    run: () => run,
    catchPal(id) { if (!run) play(0, {}); return run.catchPal(id); },
    // Plays one stage to the end in one go, with no screens and nothing saved. Same steps as real play, as fast as the machine can.
    runStage(i, o = {}) {
      const wasBot = botOn, keepRun = run, keepActive = Kit.active, keepScreen = UI().screen;
      Kit.active = false;
      botOn = o.bot !== false;
      const limit = (o.maxSeconds || (def.test && def.test.maxSeconds) || 600) / STEP;
      const every = o.renderEvery === undefined ? 30 : o.renderEvery;
      let r, n = 0, result = 'timeout';
      try {
        r = run = makeRun(i, { dry: true, fair: o.fair === undefined ? true : o.fair, seed: o.seed, endless: o.endless, carry: o.carry, continued: o.continued });
        for (; n < limit; n++) {
          stepRun(r, botOn);
          A().fxStep(STEP);
          if (every && n % every === 0) { UI().screen = 'test'; Kit.drawNow(); }
          if (r.over) { result = r.over; break; }
        }
      } finally { botOn = wasBot; run = keepRun; Kit.active = keepActive; I().reset(); A().clearFx(); UI().screen = keepScreen; }
      return { result, seconds: Math.round(n * STEP * 10) / 10, score: Math.floor(r.score), salvage: Math.floor(r.salvage), caught: r.caught, info: r.w && r.w.testInfo };
    },
  };
})();
