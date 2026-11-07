// Hot Hand: the game as the kit sees it. Words in words.js, numbers in tuning.js, rules in fire.js, foes.js, ashka.js, table.js, boss.js, pals.js and play.js, drawing in draw.js and friends.
(function () {
  const T = TUNE, W = HH.WORDS;
  let current = null, lastBurnLine = null;
  // Added before Kit.start so these run before the kit banks what the run has earned.
  document.addEventListener('visibilitychange', () => { if (document.hidden) HH.cashOnHide(current); });
  addEventListener('pagehide', () => HH.cashOnHide(current));
  // Restart or Quit in the beat after a wave is cleared: that wave's table is earned, so it's paid the same way. Capture, so this runs before the kit's button handler banks.
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-kit="restart"],[data-kit="quit"]')) HH.cashOnHide(current); }, true);

  // Krell's talk portrait: art/krell-portrait.webp, facing front like the crew's (img is from the site root, as the kit's are).
  // If it can't load: head and shoulders of his own picture (krell_stand), cut at draw time. If that isn't there either, the kit's code bust.
  const krellSpeaker = Kit.speakers.krell;
  Kit.speakers.add('krell', Object.assign({}, krellSpeaker, { img: 'games/hot-hand/art/krell-portrait.webp', paint(c, s) {
    const A = Kit.art, P = T.krellPortrait;
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, s, s);
    if (!A.has('krell_stand')) { A.bust(c, 'krell', s); return; }
    A.draw(c, 'krell_stand', 0, s * P.x, s * P.y, s * P.h);
  } }));

  Kit.start({
    id: 'hot-hand', title: 'Hot Hand', island: 'Ashmarket', tagline: W.tagline,
    orientation: 'landscape',
    endless: true,
    stages: T.stages.map((s, i) => Object.assign({}, s, W.stages[i])),
    endlessStage: Object.assign({ name: 'Endless' }, T.endless),
    ending: W.ending,
    endingCard: W.endingCard,
    loseLines: W.loseLines,
    // A burn gets its own lines, never the same one twice running. At the boss only some of the time, so Krell's own lines still come up. null: the kit picks from the usual lists.
    // A pal still out shows behind this screen, so then the jokes stay out (batch rule). Bosses have no pals, so the street's list is the one to filter.
    loseLine(run) {
      const pal = run.w.pal;
      if (run.w.lastHurt !== 'burn' || (run.boss && Math.random() < T.krellGetsBurnLoss)) {
        if (!pal) return null;
        const clean = W.loseLines.filter(l => !l.adult);
        return clean[Math.floor(Math.random() * clean.length)];
      }
      const list = W.burnLose.filter(l => l !== lastBurnLine && !(pal && l.adult));
      lastBurnLine = list[Math.floor(Math.random() * list.length)];
      return lastBurnLine;
    },
    upgrades: W.upgrades,
    palLines: W.palLines,
    // An original loop: a dirty saloon shuffle, walking bass, the lead stabbing on the off-beats.
    music: { bpm: 136, root: 45, scale: 'dorian', bassWave: 'triangle', leadWave: 'square',
      bass: '0 . 2 . 4 . 2 . 3 . 5 . 6 . 5 . 0 . 2 . 4 . 2 . 4 . 3 . 1 . 0 .',
      lead: '. 7 . 9 . 7 . . . 8 . 10 . 8 7 . . 7 . 9 . 11 . 9 . 7 . 6 4 . . .',
      drums: 'k . h s . h k h k . h s . h k s k . h s . h k h k h h s k h s s' },
    bossMusic: { bpm: 158, root: 40, scale: 'phrygian', bassWave: 'sawtooth', leadWave: 'sawtooth',
      bass: '0 0 . 0 . 0 1 . 0 0 . 0 . 3 1 . 0 0 . 0 . 0 1 . 4 . 3 . 1 . 0 .',
      lead: '. . 7 . . 8 7 . . . 7 . 10 8 7 . . . 12 . . 13 12 . 10 . 8 . 7 . 5 .',
      drums: 'K . h s k . s h K . h s k k s h K . h s k . s h K h s h K s s s' },
    titleDraw: HH.titleDraw,
    sayAt: 'corner',   // on the felt at the bottom right, clear of the heat bar, the top read-outs and Juno
    test: { maxSeconds: 400, idleSeconds: 180 },

    init(run) { if (!run.dry) current = run; run.w = HH.newWorld(run); HH.startWave(run, 0); },
    update(dt, run, input) { HH.step(run, dt, input); },
    render: HH.render,
    hud: HH.hud,
    bot: HH.bot,
    botAsk: HH.botAsk,
  });
})();
