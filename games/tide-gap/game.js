// Tide Gap: the game as the kit sees it. Words in words.js and memory.js, numbers in tuning.js, rules in sail.js, hazards.js and boss.js, drawing in draw.js and friends.
(function () {
  const T = TUNE, W = TG.WORDS;

  Kit.audio.define('steer', [{ w: 'noise', f: [500, 1400], d: 0.16, v: 0.05 }]);
  Kit.audio.define('pulling', [{ w: 'sine', f: [150, 210], d: 0.12, v: 0.07 }]);
  Kit.audio.define('windup', [{ w: 'sine', f: [180, 420], d: 0.3, v: 0.12 }]);
  Kit.audio.define('drown', [{ w: 'sine', f: [880, 110], d: 0.8, v: 0.2 }, { w: 'noise', f: [700, 160], d: 0.7, v: 0.14 }, { w: 'triangle', f: [523, 494], d: 0.5, v: 0.1, at: 0.25 }]);
  Kit.audio.define('page', [{ w: 'noise', f: [3000, 5200], d: 0.1, v: 0.12 }, { w: 'triangle', f: [988, 988], d: 0.14, v: 0.14, at: 0.08 }, { w: 'triangle', f: [1319, 1319], d: 0.2, v: 0.14, at: 0.18 }]);
  Kit.audio.define('lance', [{ w: 'noise', f: [5000, 900], d: 0.18, v: 0.26 }, { w: 'square', f: [1100, 200], d: 0.14, v: 0.14 }]);
  Kit.audio.define('pylon', [{ w: 'square', f: [240, 120], d: 0.18, v: 0.16 }, { w: 'noise', f: [1200, 500], d: 0.14, v: 0.14 }, { w: 'square', f: [400, 380], d: 0.1, v: 0.1, at: 0.16 }]);
  Kit.audio.define('grind', [{ w: 'sawtooth', f: [90, 60], d: 0.5, v: 0.2 }, { w: 'noise', f: [1800, 500], d: 0.5, v: 0.2 }]);

  // Talk boxes here carry long lines at the bottom of a narrow screen: let them use the width, so they stay short and clear of the hull.
  const style = document.createElement('style');
  style.textContent = '.kit-say.at-bottom { max-width: min(94%, 460px); }\n'
    // A very short screen: the kit's text size stays while the canvas shrinks, so the box has to get smaller to stay off the hull.
    + '@media (max-height: 500px) { .kit-say.at-bottom { padding: 2px 8px 2px 2px; gap: 6px; bottom: 4px; } .kit-say.at-bottom .kit-portrait { width: 30px; height: 30px; } .kit-say.at-bottom b { font-size: 12px; } .kit-say.at-bottom span { font-size: 12.5px; line-height: 1.12; } }';
  document.head.appendChild(style);

  // Hekka's talk portrait: from the front, per hekka-sheet-v6.png. Plain code until there's a picture (art/REQUEST.md), and better than the kit's general side-on bust for someone this much on screen.
  function hekkaFace(c, s) {
    const A = Kit.art, SKIN = '#b78a64', HAIR = '#131219', PLATE = '#858b92';
    c.save(); c.scale(s / 100, s / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    A.blob(c, [[50, 6], [76, 14], [84, 40], [88, 68], [80, 92], [64, 80], [36, 80], [20, 92], [12, 68], [16, 40], [24, 14]], HAIR, 1.8);
    A.poly(c, [[6, 100], [12, 84], [34, 76], [66, 76], [88, 84], [94, 100]], PLATE, 1.6);
    A.poly(c, [[0, 100], [0, 90], [12, 82], [18, 100]], '#6c727a', 1.4); A.poly(c, [[100, 100], [100, 90], [88, 82], [82, 100]], '#6c727a', 1.4);
    A.poly(c, [[42, 62], [58, 62], [60, 78], [40, 78]], SKIN, 1.3);
    A.poly(c, [[38, 76], [62, 76], [58, 84], [50, 80], [42, 84]], '#efefe8', 1.3);
    A.blob(c, [[50, 18], [66, 24], [69, 42], [64, 58], [50, 70, 1], [36, 58], [31, 42], [34, 24]], SKIN, 1.8);
    A.poly(c, [[50, 70], [64, 58], [69, 42], [60, 54]], A.shade(SKIN), 0);
    A.blob(c, [[50, 12], [68, 20], [71, 40], [64, 28], [50, 24], [36, 28], [29, 40], [32, 20]], HAIR, 1.4);
    [[-1, 40], [1, 60]].forEach(p => { A.poly(c, [[p[1] - 7, 42], [p[1] + 7, 42], [p[1] + 6, 46], [p[1] - 6, 46]], '#efefe8', 0.9); A.circle(c, p[1], 44, 2, '#39424c', 0); A.line(c, p[1] - 8, 39.5 + (p[0] < 0 ? 1.5 : 0), p[1] + 8, 39.5 + (p[0] > 0 ? 1.5 : 0), 1.8, A.INK); });
    A.line(c, 50, 46, 48, 53, 1, A.shade(SKIN, 0.6));
    A.line(c, 43, 60, 57, 60, 1.6, '#6e3f34');
    A.poly(c, [[20, 92], [80, 92], [80, 96], [20, 96]], A.INK, 0);
    A.circle(c, 50, 94, 6, null, 2, '#efefe8');
    c.restore();
  }
  const talkPic = (window.DRIFT_SPRITES || {}).hekka_talk;   // only asks for the file if art/sprites.js says it exists
  Kit.speakers.add('hekka', Object.assign({ name: 'Captain Hekka', colour: '#c8ccd2', person: 'hekka', paint: hekkaFace }, talkPic ? { img: 'games/tide-gap/' + talkPic.src } : {}));

  const selaPic = (window.DRIFT_SPRITES || {}).sela_talk;   // Sela in her sheet's skin colour, this game only; the kit's speaker stays the homepage picture
  if (selaPic) Kit.speakers.add('sela', Object.assign({}, Kit.speakers.sela, { img: 'games/tide-gap/' + selaPic.src }));

  // Talk lines that change with what's been lost, and the way Sela's own words change when "pup" has gone.
  function rewriteTalk(run, base) {
    if (!base || !run.stage.talk) return;
    const lost = run.carry.lost;
    run.stage.talk = base.map(l => {
      const use = l.ifLost && lost.includes(l.ifLost) ? l.instead : l;
      return { who: use.who, text: TG.voice(use.text, lost) };
    });
    const win = W.stages[run.index].winLine;
    if (win) run.stage.winLine = { who: win.who, text: TG.voice(win.text, lost) };
  }
  const BASE_TALK = W.stages.map(s => s.talk);
  let liveBook = null;   // the book as this attempt has left it, for Restart
  let lastLose = null;   // this game's own lose lines never repeat twice running; the kit's rule only covers its own list

  const stages = T.stages.map((s, i) => Object.assign({}, s, W.stages[i]));

  Kit.start({
    id: 'tide-gap', title: 'Tide Gap', island: 'Gaptooth Reach', tagline: W.tagline,
    orientation: 'portrait',
    endless: true,
    stages,
    endlessStage: Object.assign({ name: 'Endless' }, T.endless),
    ending: TG.buildEnding(['coat', 'cards', 'soup'], [{ k: 1 }, { k: 1 }, { k: 1 }, { lost: 1 }, { lost: 1 }, { lost: 1 }]).talk,
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    loseLine(run) {
      if (run.boss) return null;
      const pal = TG.palAround(run.w);   // a pal still out shows behind this screen, so the jokes stay out (batch rule)
      if (TG.linesLeft(run) === 0) { const fresh = W.emptyLose.filter(l => l !== lastLose && !(pal && l.adult)); return (lastLose = fresh[Math.floor(Math.random() * fresh.length)]); }
      if (run.w.lastCause === 'rock' && lastLose !== W.rockLose && Math.random() < T.rockLoseChance) return (lastLose = W.rockLose);
      lastLose = null;
      if (!pal) return null;
      const clean = W.loseLines.filter(l => !l.adult);
      return clean[Math.floor(Math.random() * clean.length)];
    },
    upgrades: W.upgrades,
    palLines: W.palLines,
    // An original shanty in D dorian: a rolling tow-line figure over a slow pull.
    music: { bpm: 118, root: 50, scale: 'dorian', bassWave: 'triangle', leadWave: 'triangle',
      bass: '0 . . 0 . . 4 . . 3 . . 0 . . 0 . . 5 . . 4 . . 3 . . 3 . . 0 . 4 3 . .',
      lead: '7 . 9 10 . 9 7 . 5 7 . . 9 . 10 12 . 10 9 . 7 5 . . 3 . 5 7 . 5 3 . 2 0 . .',
      drums: 'k . h s . h k . h s . h k . h s . h k . h s . h k . h s . h k . h s h h' },
    bossMusic: { bpm: 148, root: 43, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'square',
      bass: '0 . 0 0 . 0 1 . 0 . 0 0 . 0 3 1 0 . 0 0 . 0 1 . 5 . 3 . 1 . 0 .',
      lead: '7 . . 8 . 7 5 . 7 . . 8 . 10 8 . 12 . . 13 . 12 10 . 8 . 7 . 5 . 7 .',
      drums: 'K h k h s h k h K h k h s h k k K h k h s h k h K h s h K s s s' },
    titleDraw: TG.titleDraw,
    sayAt: 'bottom',   // under the hull: nothing comes at you from there, and the logbook and read-outs are at the top
    test: { maxSeconds: 240, idleSeconds: 150 },

    init(run) {
      // Restart from the pause menu isn't an undo: what's drowned stays drowned, and the attempt starts again from there. Dying still puts back what the stage began with.
      if (!run.dry && !run.endless && Kit.ui.screen === 'paused' && liveBook && liveBook.index === run.index) {
        run.carry = JSON.parse(JSON.stringify(liveBook.carry));
        run.carryAtStart = JSON.parse(JSON.stringify(liveBook.carry));
      }
      TG.bookIn(run);
      // Gold from a Dive waits for the clear (hazards.js). Leaving by Restart or Quit doesn't give the line back, so its gold comes along. Dying forfeits it, and so does quitting stage 1, since picking stage 1 starts a clean book.
      if (!run.dry && liveBook && liveBook.run && !liveBook.run.over && liveBook.run.w.heldSalvage && (Kit.ui.screen === 'paused' || liveBook.index > 0)) { run.addSalvage(liveBook.run.w.heldSalvage); liveBook.run.w.heldSalvage = 0; }
      if (!run.dry && !run.endless) {
        liveBook = { index: run.index, carry: run.carry, run };
        if (run.index > 0) DriftSave.setStoryCarry('tide-gap', run.carry);   // what a pick from the list carries follows this attempt
      }
      if (!run.endless && !run.dry) { const i = run.index; rewriteTalk(run, BASE_TALK[i]); }
      run.w = TG.newWorld(run);
      TG.talkStart(run, run.w);
    },
    update(dt, run, input) { TG.step(run, dt, input); },
    render: TG.render,
    hud: TG.hud,
    bot: TG.bot,
  });

  // The ending the stage list replays, whatever was last really played.
  DriftGate.whenPassed(() => { if (Kit.def) TG.applyEnding(TG.defaultEnding()); });
})();
