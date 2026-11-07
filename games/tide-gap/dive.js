// Tide Gap: the Dive. Pull the thumb down and keep it on: down you go. Let go to rise. Steering only uses sideways, so a resting, jittering or pausing thumb can never spend a memory.
window.TG = window.TG || {};
(function () {
  const T = TUNE, W = () => TG.WORDS;
  const KEYS = ['ArrowDown', 'KeyS', 'Space', 'Enter'];   // Space and Enter also act as the kit's thumb, so they hold it down too

  const keyHeld = input => KEYS.some(k => input.key(k));
  const keyFresh = input => KEYS.some(k => input.keyPressed(k));

  // Has the thumb just been pulled down? It adds up what the kit reports as movement, so a second finger taking over can't look like a pull.
  // A pull has to start from a thumb that wasn't travelling sideways. A thumb swinging on its natural arc turns steeply downward low on the glass, and the stretch alone looks just like a pull; what gives it away is the sideways travel leading into it.
  function pulled(w, input) {
    const p = w.pull;
    if (input.pressed || !input.down) { p.x = 0; p.y = 0; p.log.length = 0; if (!input.down) return false; }
    p.x += input.dx; p.y += input.dy;
    p.log.push(p.x, p.y);
    const window = Math.round(T.pullWindow * 60) * 2, before = Math.round(T.pullQuiet * 60) * 2;
    while (p.log.length > window + before) p.log.shift();
    // Walking back from now, 'across' is how wide the thumb has swung over the stretch, not just where it ended up, so a dodge left and right while sliding down isn't a pull however long the stretch.
    const first = Math.max(0, p.log.length - window);
    let lo = p.x, hi = p.x, best = 0;
    p.got = 0;
    for (let i = p.log.length - 2; i >= first; i -= 2) {
      lo = Math.min(lo, p.log[i]); hi = Math.max(hi, p.log[i]);
      const down = p.y - p.log[i + 1];
      if (down <= 0 || down < (hi - lo) * T.pullSlant) continue;
      let quiet = true, lo2 = lo, hi2 = hi;
      for (let j = Math.max(0, i - before); j < i; j += 2) { if (Math.abs(p.log[j] - p.log[i]) > T.pullQuietPx) quiet = false; lo2 = Math.min(lo2, p.log[j]); hi2 = Math.max(hi2, p.log[j]); }
      if (!quiet || down < (hi2 - lo2) * T.pullSlant) continue;
      if (down >= T.pullPx) { p.got = 1; return true; }
      best = Math.max(best, down / T.pullPx);
    }
    p.got = best;   // how much of a pull there is so far, 0 to 1: the HUD and a soft sound show it, so a gentle pull that hasn't got there yet doesn't feel dead
    return false;
  }
  TG.pulled = pulled;   // for test/pull.js

  // The kit forgets the thumb at a pause or a catch moment, with no real lift. A Dive under way carries on by itself: it isn't the player letting go.
  function noticeReset(w, input) {
    if (input.resets === w.resetsSeen) return;
    w.resetsSeen = input.resets;
    const d = w.dive;
    w.armed = false; w.windup = 0;
    if (d.state === 'down') d.thumbLost = true;
    else if (d.state === 'rising' && !w.boss && d.air > 0) { d.state = 'down'; d.thumbLost = true; }   // a thumb lifted in the same moment the tab hid
  }

  const overRock = w => w.rocks.some(r => TG.hullHits(r, r.x, w.shipX, w.dist, 0));

  // On the way up with what's left of the air, going straight: does the hull come up in open water? The HUD says "steer out" when it won't.
  TG.airClears = function (w) {
    const end = w.dist + w.speed * (Math.max(0, w.dive.air) + T.riseSecs);
    return !w.rocks.some(r => TG.hullHits(r, TG.rockX(r, end), w.shipX, end, T.rockInset));
  };

  TG.diveStep = function (run, w, input, dt) {
    const d = w.dive, holding = input.down || keyHeld(input);
    noticeReset(w, input);
    const wasPulled = pulled(w, input);
    // A pull on its way: only worth showing when the Dive could happen.
    const showing = d.state === 'up' && input.down && !w.armed && w.diveUnlocked && w.pull.got >= T.pullShowFrom;
    if (showing && !w.pullShow) Kit.audio.play('pulling');
    w.pullShow = showing ? w.pull.got : 0;
    if (d.state === 'up') {
      if (!holding) w.armed = false;
      else if (wasPulled || keyFresh(input)) w.armed = true;
      const ready = w.diveUnlocked && w.shuntTo === null && !(w.dist < w.scrapeTo) && (!run.boss || TG.bossDiveOK(w));
      if (w.armed && !ready) { w.armed = false; w.pull.log.length = 0; }
      if (w.armed) {
        if (w.windup === 0) Kit.audio.play('windup');
        w.windup += dt;
        if (w.windup >= T.diveWindup) {
          w.armed = false; w.windup = 0; w.pull.log.length = 0;
          if (TG.canDive(run)) startDive(run, w);
          else { Kit.audio.play('denied'); w.deadT = 0.6; TG.sayOne(run, W().deadPress, 0, T.talkStaleShort); }
        }
      } else w.windup = 0;
    } else if (d.state === 'down') {
      d.air -= dt; d.t += dt; w.downT += dt;
      if (d.air < T.diveWarn && !d.warned) { d.warned = true; Kit.audio.play('alarm'); }
      if (w.boss) TG.bossCharge(run, w, dt);
      if (holding) d.thumbLost = false;
      const letGo = !holding && !d.thumbLost, clearOfIt = d.thumbLost && !w.boss && !overRock(w);
      if (letGo || d.air <= 0 || clearOfIt) { d.state = 'rising'; d.t = 0; d.thumbLost = false; Kit.audio.play('splash'); if (w.boss) TG.bossBurst(run, w); }
    } else if (d.state === 'rising') {
      d.t += dt;
      if (d.t >= T.riseSecs) {
        d.state = 'up'; d.t = 0;
        if (!run.dry) Kit.art.burst(w.shipX, w.shipYNow, { n: 14, colors: ['#dff4f6', '#8fd3d8', '#ffffff'], speed: 120, life: 0.5, size: 3 });
        // Coming up under a rock is the worst way to stop.
        if (!w.boss) TG.surfaceHit(run, w, 0);
      }
    }
  };

  function startDive(run, w) {
    const d = w.dive, firstEver = !run.carry.lost.length && !run.carry.sparesUsed;
    d.state = 'down'; d.t = 0; d.air = w.airMax; d.warned = false; d.thumbLost = false;
    w.dives++; w.testInfo.dives++; w.calm = 0;
    Kit.audio.play('dive');
    if (!run.dry) Kit.art.burst(w.shipX, w.shipYNow, { n: 18, colors: ['#35c4cc', '#dff4f6', '#1f6f88'], speed: 140, life: 0.55, size: 4 });
    const row = TG.drown(run);
    if (row >= 0 && firstEver && !run.boss) TG.sayOne(run, W().firstDrown);
    if (TG.linesLeft(run) === 0 && !w.saidEmpty) { w.saidEmpty = true; TG.sayOne(run, W().radioEmpty, 0, T.talkStaleLong); }
    // A line is lost as soon as it drowns: quitting to the menu can't undo it either. Stage 1 is left out, since picking it starts a clean run anyway.
    if (!run.dry && !run.endless && run.index > 0) DriftSave.setStoryCarry('tide-gap', run.carry);
  }
})();
