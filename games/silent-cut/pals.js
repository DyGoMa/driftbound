// Silent Cut: the two hidden pals. Tuftle only comes to someone sitting perfectly still in the dark. Lamplick is on one lantern: cut it down, then tap the dizzy moth to catch it.
window.SC = window.SC || {};
(function () {
  const T = TUNE, W = () => SC.WORDS;

  // Batch rule: pals are never in flirting or innuendo. While one is in the world, lines marked adult in words.js keep quiet. Lamplick is in the world from the start of an attempt until it's caught or flies off, on screen or not.
  SC.palAround = w => !!(w.moth || w.tuf);
  SC.palSafe = (w, list) => (SC.palAround(w) ? list.filter(l => !l.adult) : list);

  // Called when a stage starts. One lantern may have the moth on it, never one on screen at the start, because the talk scene plays over the frozen street.
  SC.palInit = function (run) {
    const w = run.w, first = SC.nextCover(w, w.s.x);
    if (first) w.hush.x = w.hush.tx = first.x;   // Hush is already waiting at the first safe place
    if (run.hasPal('lamplick') || run.boss || (!run.endless && run.index < T.lamplickFromStage)) return;
    const far = w.lanterns.filter(l => l.x - w.s.x >= T.mothOffStart);
    if (run.rng() < T.lamplickChance && far.length) w.moth = { id: 'lamplick', l: far[Math.floor(run.rng() * far.length)], state: 'lick', x: 0, alt: 0, t: 0, said: false };
  };

  // What a tap can catch: the dizzy moth, in the chain's reach, when nothing else has the TAP ring. Kept out of SC.target, so the rules and the test bot's plans never reach for it.
  SC.mothTarget = function (w) {
    const m = w.moth;
    return m && m.state === 'dizzy' && Math.abs(m.x - w.s.x) <= w.reach && !SC.target(w) ? { kind: 'moth', o: m } : null;
  };

  SC.palStep = function (run) {
    const w = run.w, s = w.s, dt = Kit.STEP;
    // Tuftle: frozen in cover a long while, with no alarm yet this stage. The eyes open once per cover; stay put and it climbs on.
    if (!run.hasPal('tuftle') && !run.boss && (run.endless || run.index >= T.tuftleFromStage)) {
      const c = s.hidden ? SC.coverAt(w, s.x) : null;
      if (w.tuf) {
        if (!s.hidden) { w.tuf = null; }
        else if ((w.tuf.t -= dt) <= 0) { w.tuf = null; run.catchPal('tuftle'); return; }
      } else if (c && c !== w.tufTried && w.alarms === 0 && s.still >= T.tuftleStill) {
        w.tufTried = c;
        if (run.rng() < T.tuftleChance) { w.tuf = { t: T.tuftleStay, x: s.x - T.tuftleEyesBack }; SC.say(run, W().palAppear.tuftle.who, W().palAppear.tuftle.text, T.talk.tuftle); }
      }
    }
    // Lamplick
    const m = w.moth;
    if (!m) return;
    if (m.state === 'lick') {
      if (run.hasPal('lamplick')) { w.moth = null; return; }
      // The clue leads to the moth: heard only from a lantern coming up, and gone once he's past where the chain can reach it, since he can't walk back.
      const ahead = m.l.x - s.x;
      if (ahead >= T.mothHear || ahead < -w.reach) return;
      if (!m.said && w.say <= 0) { m.said = true; SC.say(run, W().palAppear.lamplick.who, W().palAppear.lamplick.text, 3); }
      if (Math.floor(w.t * T.mothChirps) !== Math.floor((w.t - dt) * T.mothChirps)) Kit.audio.play('moth');
      return;
    }
    m.t -= dt;
    m.alt = Math.max(T.mothRestAlt, m.alt - T.mothFall * dt);
    if (m.x < s.x) m.x = Math.min(s.x, m.x + T.mothDrift * dt);   // he can't walk back, and the chain cuts from past it, so it wobbles after him: "catch it" can always be done
    // It takes a tap of his own, on the TAP ring. Walking under it or through it does nothing. And a Surge's first tap is no catch: it waits to see no second tap is coming.
    if (w.tapMoth && !m.tapT) m.tapT = T.strikeCalm;
    if (m.tapT > 0) {
      if (s.dash > 0) m.tapT = 0;
      else if ((m.tapT -= dt) <= 0) { w.moth = null; run.catchPal('lamplick'); return; }
      return;
    }
    if (m.t <= 0) w.moth = null;
  };
})();
