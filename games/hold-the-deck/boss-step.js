// Hold the Deck: one step of the bear, phase by phase. What it does to Bram is in boss.js.
window.HD = window.HD || {};
(function () {
  const T = TUNE, B = T.boss, W = HD.WORDS.boss, A = () => Kit.art;
  const inWarn = (w, kinds) => w.warns.some(x => kinds.includes(x.kind));
  const set = (b, state) => HD.bossSet(b, state);

  function trickle(run, dt) {
    const w = run.w, b = w.boss;
    if ((b.trickle -= dt) > 0 || w.foes.length >= B.maxBoarders) return;
    b.trickle = run.range(B.trickle2[0], B.trickle2[1]) * (1 + B.trickleIronEase * (run.carry.iron || 0));
    HD.spawn(run, b.phase === 1 ? 'grunt' : (run.rng() < B.runnerShare ? 'runner' : 'grunt'), run.int(0, 2));
  }

  // Returns true if a meal stopped play. Nothing attacks while the hint's plate is up: it's there to be read.
  HD.bossStep = function (run, dt) {
    const w = run.w, b = w.boss, plate = w.hintT > 0;
    b.t += dt;
    if (b.flash > 0) b.flash -= dt;
    for (const r of b.rakes) r.t += dt;
    b.rakes = b.rakes.filter(r => r.t < 0.45);
    if (b.paw && b.paw.flash > 0) b.paw.flash -= dt;
    const S = b.state;
    if (S === 'under') {
      if (!w.saidP1) { w.saidP1 = true; HD.say(run, W.p1, B.say.p1); HD.showHint(run, 0); return false; }
      if (plate) return false;
      trickle(run, dt);
      if (b.paw) {
        b.paw.t += dt;
        if (b.paw.t >= b.paw.up) { b.holes.push({ lane: b.paw.lane, d: b.paw.d }); b.paw = null; b.nextPaw = run.range(B.pawGap[0], B.pawGap[1]); Kit.audio.play('crack'); }
      } else if (!inWarn(w, ['paw', 'volley']) && (b.nextPaw -= dt) <= 0) {
        if ((b.pawN + 1) % B.quakeEvery === 0) {
          if (HD.volley(run, 'quake')) { b.pawN++; b.nextPaw = run.range(B.pawGap[0], B.pawGap[1]) + B.afterVolley; Kit.audio.play('growl'); } else b.nextPaw = T.beat.retry;
        } else {
          const lane = run.rng() < B.pawAimBram ? w.target : run.int(0, 2);
          if (HD.warn(run, 'paw', lane, B.pawWarn + HD.greyWarn(run), { d: B.pawD })) b.pawN++; else b.nextPaw = T.beat.retry;
        }
      }
    } else if (S === 'dive' && b.t > B.diveSecs) {
      set(b, 'burst');
      HD.serveMeal(run);
      return true;
    } else if (S === 'burst') {
      if (b.t < dt * 1.5) { Kit.audio.play('boom'); Kit.audio.play('roar'); A().shake(14, 0.9); HD.say(run, W.p2a, B.say.p2a); HD.say(run, W.p2b, B.say.p2b); }
      if (b.t >= B.burstSecs) { b.phase = 2; b.core = HD.bossHp(b, B.coreP2); set(b, 'stand'); b.d = B.standD; b.nextSwipe = B.firstRake; b.holes.push({ lane: 1, d: B.standD, breach: true }); w.temper = Math.max(w.temper, B.temperPhase2); HD.say(run, W.bram2, B.say.bram2); HD.showHint(run, 1); }
    } else if (S === 'stand') {
      if (plate) return false;
      trickle(run, dt);
      if (!inWarn(w, ['swipe', 'volley']) && (b.nextSwipe -= dt) <= 0) swipe(run);
    } else if (S === 'fallen') {
      b.laneF += (b.lane - b.laneF) * Math.min(1, dt * 6);
      b.d = b.dFrom + (B.openD - b.dFrom) * Math.min(1, b.t / B.fallSecs);
      if (b.t >= B.fallSecs) { b.open = (b.phase === 2 ? B.openSecs : B.openKnocked) + B.openGrey * Math.max(0, HD.swingTime(run) - T.swingCd); set(b, 'open'); Kit.audio.play('crack'); }
    } else if (S === 'open') {
      b.laneF += (b.lane - b.laneF) * Math.min(1, dt * 6);
      if (b.t >= b.open) { set(b, 'rear'); b.dFrom = b.d; HD.say(run, W.closed, B.say.closed); }
    } else if (S === 'rear') {
      b.laneF += (1 - b.laneF) * Math.min(1, dt * 4);
      b.d = b.dFrom + (B.standD - b.dFrom) * Math.min(1, b.t / B.rearSecs);
      if (b.t >= B.rearSecs) { b.d = B.standD; b.laneF = 1; if (b.phase === 2) { b.round++; b.nextSwipe = B.nextRake; set(b, 'stand'); } else { set(b, 'far'); } }
    } else if (S === 'toMeal2' && b.t > B.toMeal2Secs) {
      set(b, 'snap');
      b.dFrom = b.d;
      HD.serveMeal(run);
      return true;
    } else if (S === 'snap') {
      b.laneF += (1 - b.laneF) * Math.min(1, dt * 4);
      b.d = b.dFrom + (B.standD - b.dFrom) * Math.min(1, b.t / B.snapSlideSecs);
      if (b.t < dt * 1.5) { HD.say(run, W.p3, B.say.p3); Kit.audio.play('chain'); }
      if (b.chainOn && b.t > B.snapChainAt) { b.chainOn = false; Kit.audio.play('crack'); Kit.audio.play('roar'); A().shake(10, 0.6); HD.say(run, W.bram3, B.say.bram3); }
      if (b.t >= B.snapSecs) { b.phase = 3; b.core = HD.bossHp(b, B.coreP3); b.d = B.standD; b.laneF = 1; set(b, 'far'); HD.showHint(run, 2); }
    } else if (S === 'far') {
      if (plate) return false;
      trickle(run, dt);
      if (!inWarn(w, ['charge', 'volley']) && b.t >= B.chargeGap) {
        if ((b.attackN + 1) % B.rakeAllEvery === 0) {
          if (HD.volley(run, 'claws')) { b.attackN++; b.t = -B.afterVolley; Kit.audio.play('roar'); } else b.t = B.chargeGap - T.beat.retry;
        } else if (HD.warn(run, 'charge', w.target, B.chargeWarn + HD.greyWarn(run) + B.chargeRun, { runAt: B.chargeWarn + HD.greyWarn(run) })) { b.attackN++; b.lane = w.target; Kit.audio.play('roar'); } else b.t = B.chargeGap - T.beat.retry;
      }
      const going = w.warns.find(k => k.kind === 'charge');
      if (going) {
        b.laneF += (b.lane - b.laneF) * Math.min(1, dt * 5);
        if (going.t >= going.runAt) { b.dFrom = b.d; b.laneF = b.lane; set(b, 'run'); Kit.audio.play('charge'); Kit.audio.play('roar'); }
      }
    } else if (S === 'run') {
      b.laneF = b.lane;
      b.d = b.dFrom + (B.openD + B.skidPast - b.dFrom) * Math.min(1, b.t / B.chargeRun);
      if (Math.random() < 0.6) A().burst(HD.laneX(b.lane, HD.yOf(b.d)), HD.yOf(b.d), { n: 3, color: '#c8bfae', speed: 90, life: 0.3, size: 3 });
    } else if (S === 'collapse') collapse(run);
    return false;
  };

  // Two lanes lit, one left dark. Every so often, all three.
  function swipe(run) {
    const w = run.w, b = w.boss;
    if ((b.attackN + 1) % B.rakeAllEvery === 0) {
      if (HD.volley(run, 'claws')) { b.attackN++; b.nextSwipe = run.range(B.swipeGap[0], B.swipeGap[1]) + B.afterVolley; Kit.audio.play('growl'); } else b.nextSwipe = T.beat.retry;
      return;
    }
    const first = run.rng() < B.swipeAimBram ? w.target : run.int(0, 2), secs = B.swipeWarn + HD.greyWarn(run);
    if (!HD.warn(run, 'swipe', first, secs, {})) { b.nextSwipe = T.beat.retry; return; }
    b.attackN++;
    Kit.audio.play('growl');
    b.raised = first <= 1 ? -1 : 1;
    const rest = [0, 1, 2].filter(l => l !== first), pick = run.int(0, 1);
    if (!HD.warn(run, 'swipe', rest[pick], secs, {})) HD.warn(run, 'swipe', rest[1 - pick], secs, {});   // whichever leaves him a way out
    b.nextSwipe = run.range(B.swipeGap[0], B.swipeGap[1]) + secs;
  }

  function collapse(run) {
    const w = run.w, b = w.boss, lines = W.fall;
    b.laneF += (1 - b.laneF) * 0.02;
    if (b.fallI < lines.length && b.t >= B.fallAt[b.fallI]) { HD.say(run, lines[b.fallI], B.say.fall, true); b.fallI++; }
    if (b.t >= B.collapseSecs) HD.clearStage(run);
  }
})();
