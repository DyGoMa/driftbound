// Hold the Deck: Hekka's Hollow bear, in three phases. What it does to Bram and what he does to it. boss-step.js runs its phases; bear-art.js draws it.
// Phase 1 under the planks: paws burst through; hit them. Phase 2 chained on deck: rakes down the lanes; Grist knocks it down so Bram can reach the core.
// Phase 3 the chain goes: it charges down a lane; move and hit it as it skids, or stop it with Iron for longer at the core. Then Hekka speaks.
window.HD = window.HD || {};
(function () {
  const T = TUNE, B = T.boss, W = HD.WORDS.boss, A = () => Kit.art;

  HD.showHint = function (run, i) { run.w.hintText = (HD.locked(run) && HD.WORDS.bossHintLocked[i]) || HD.WORDS.bossHint[i]; run.w.hintT = T.hintSecs; };
  // It keeps its wounds from the tries lost on it: paws and core start short, and the BEAR bar (hud.js) shows it.
  const wound = run => 1 - B.woundPerLoss * Math.min(B.woundMax, HD.triesLost(run));
  HD.bossHp = (b, n) => Math.ceil(n * b.hpMul);
  HD.bossNew = run => ({ hpMul: wound(run), phase: 1, state: 'under', t: 0, pawHp: Math.ceil(B.pawHp * wound(run)), paw: null, nextPaw: B.firstPaw, trickle: B.firstTrickle, pawN: 0, attackN: 0, lane: 1, laneF: 1, d: B.standD, core: 0, round: 0, nextSwipe: B.firstRake, raised: 0, open: 0, flash: 0, holes: [], rakes: [], fallI: 0, chainOn: true, shake: 0 });
  const set = HD.bossSet = (b, state) => { b.state = state; b.t = 0; };
  const noAttacks = (w, keep) => { w.warns = w.warns.filter(x => !keep.includes(x.kind)); };

  HD.bossTarget = function (run, lane) {
    const b = run.w.boss;
    return !!((b.paw && b.paw.lane === lane) || (b.state === 'open' && b.lane === lane));
  };

  // A swing or a shed Iron reaching the paw or the core. Returns 1 if it hit something.
  HD.bossHitLane = function (run, lane, dmg) {
    const w = run.w, b = w.boss;
    if (b.paw && b.paw.lane === lane) {
      b.pawHp -= dmg; b.paw.flash = 0.14;
      run.addScore(B.scoreHit); HD.addTemper(run, B.temperHit);
      Kit.audio.play('hit'); A().shake(3, 0.12);
      const y = HD.yOf(b.paw.d);
      A().burst(HD.laneX(lane, y), y - 50, { n: 12, colors: ['#a89a98', '#ffffff', '#f4c152'], speed: 170, life: 0.35, size: 3 });
      if (b.pawHp <= 0) pawsDone(run);
      return 1;
    }
    if (b.state === 'open' && b.lane === lane) { hitCore(run, dmg); return 1; }
    return 0;
  };

  function hitCore(run, dmg) {
    const w = run.w, b = w.boss, y = HD.yOf(b.d);
    b.core -= dmg; b.flash = 0.16; w.hitStop = T.hitStopSecs;
    run.addScore(B.scoreHit * 2);   // no meter for this: if a hit on the core filled him, Grist could keep it down for good
    Kit.audio.play('clang'); A().shake(4, 0.16);
    A().burst(HD.laneX(b.lane, y), y - 110, { n: 16, colors: ['#ffffff', '#dfe8ff', '#f4c152'], speed: 220, life: 0.4, size: 3 });
    A().floatText(HD.laneX(b.lane, y), y - 150, 'CORE!', '#ffffff', 22);
    if (b.core <= 0) coreDone(run);
  }

  // Between phases the deck goes quiet, so the crew can be heard before the meal screen comes up.
  function clearDeck(run) { run.w.foes.forEach(f => { if (!f.dead) HD.kill(run, f, 'end'); }); }
  function pawsDone(run) {
    const w = run.w, b = w.boss;
    if (b.paw) b.holes.push({ lane: b.paw.lane, d: b.paw.d });
    b.paw = null;
    noAttacks(w, ['paw', 'volley']);
    clearDeck(run);
    Kit.audio.play('growl'); A().shake(8, 0.5);
    HD.say(run, W.meal1, B.diveSecs, true);
    set(b, 'dive');
  }
  function coreDone(run) {
    const w = run.w, b = w.boss;
    noAttacks(w, ['swipe', 'charge', 'volley']);
    clearDeck(run);
    if (b.phase === 2) { Kit.audio.play('growl'); HD.say(run, W.meal2, B.toMeal2Secs, true); set(b, 'toMeal2'); }
    else {
      if (w.sayQ) w.sayQ.length = 0;   // nobody talks over the end of it
      set(b, 'collapse');
      Kit.audio.play('boom'); A().shake(12, 0.8);
    }
  }

  // Grist's charge meets the bear. Phase 2: down it goes, in his lane. Phase 3: the same at the far end, and a good knock if the core's already open.
  HD.bossGrist = function (run, g) {
    const w = run.w, b = w.boss;
    if (b.paw && b.paw.lane === g.lane && !g.hitPaw && g.d <= b.paw.d + B.knockReach) {   // under the planks: he goes through the paw in his lane
      g.hitPaw = true;
      Kit.audio.play('boom');
      HD.bossHitLane(run, g.lane, B.gristPaw);
    }
    if (g.hitBear) return;
    if ((b.state === 'stand' || b.state === 'far' || b.state === 'run') && g.d <= b.d + B.knockReach) {   // 'run': sent while it was at the far end, and it set off before he got there. He meets it on the way
      g.hitBear = true;
      noAttacks(w, ['swipe', 'charge', 'volley']);
      b.dFrom = b.d;
      b.lane = g.lane; b.raised = 0; b.core = b.core || HD.bossHp(b, b.phase === 2 ? B.coreP2 : B.coreP3);
      w.hintT = 0;   // whatever the plate was saying, the bear's down now
      set(b, 'fallen');
      Kit.audio.play('boom'); A().shake(11, 0.6);
      A().burst(HD.laneX(1, HD.yOf(b.d)), HD.yOf(b.d) - 60, { n: 30, colors: ['#ff9a4a', '#f5efe2', '#a89a98'], speed: 260, life: 0.6, size: 4 });
      HD.say(run, W.knocked, B.say.knocked, true);
    } else if (b.state === 'open' && b.lane === g.lane && g.d <= b.d + B.coreReach) {
      g.hitBear = true;
      Kit.audio.play('boom');
      hitCore(run, B.gristCore);
    }
  };

  // ---- The warnings it throws, when their time is up (hazards.js calls this).
  HD.bossFire = function (run, x) {
    const w = run.w, b = w.boss, here = HD.inLane(w, x.lane), y = HD.yOf(0.88), cx = HD.laneX(x.lane, y);
    if (x.kind === 'paw') {
      b.paw = { lane: x.lane, d: B.pawD, t: 0, up: B.pawUp, flash: 0 };
      Kit.audio.play('boom'); A().shake(8, 0.35);
      const py = HD.yOf(B.pawD);
      A().burst(HD.laneX(x.lane, py), py, { n: 26, colors: ['#8a6a48', '#5a4030', '#ffffff'], speed: 260, life: 0.55, size: 4 });
      for (const f of w.foes) if (f.lane === x.lane && f.d > B.pawKillD && !f.dead) HD.kill(run, f, 'paw');
      if (here) { if (w.ironOn) { block(run, cx); b.paw.up += B.pawStun; } else HD.hurt(run, B.pawHurt, 'paw'); }
    } else if (x.kind === 'swipe') {
      b.rakes.push({ lane: x.lane, t: 0 });
      b.raised = 0;
      Kit.audio.play('slash');
      if (here) { if (w.ironOn) block(run, cx); else HD.hurt(run, B.swipeHurt, 'swipe'); }
    } else if (x.kind === 'charge') arrive(run);
  };
  function block(run, x) {
    const w = run.w;
    w.blocks++;
    Kit.audio.play('clang'); A().shake(5, 0.2);
    A().floatText(x, 330, 'CLANG!', '#ffffff', 26);
    HD.addTemper(run, B.temperBlock);
    if (!w.saidBlock) { w.saidBlock = true; HD.say(run, W.block, B.say.block); }
  }

  // It's come down the lane. What happens depends on where Bram is and what he's made of right now.
  function arrive(run) {
    const w = run.w, b = w.boss, here = HD.inLane(w, b.lane);
    A().shake(10, 0.4); Kit.audio.play('boom');
    if (here && w.ironOn) { block(run, HD.laneX(b.lane, 400)); b.open = B.openIron; }
    else if (here) {
      HD.hurt(run, B.chargeHurt, 'charge');
      w.target = b.lane === 1 ? (run.rng() < 0.5 ? 0 : 2) : 1; w.arriveSwing = false;   // thrown clear
      b.open = B.openHit;
    } else { b.open = B.openDodged + HD.stepTime(run) - T.stepSecs; if (!w.saidRun) { w.saidRun = true; HD.say(run, W.run, B.say.run); } }
    set(b, 'open');
  }
})();
