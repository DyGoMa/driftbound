// Hold the Deck test bot. It reads run.w and presses only through input.sim, like a thumb.
// TUNE.bot.react is how long after a warning first shows the bot can act on it, so test/fairness.js can make it play like a person instead of a machine.
window.HD = window.HD || {};
(function () {
  const T = TUNE, HIT = { hook: 1, drop: 1, paw: 1, swipe: 1, charge: 1, volley: 1 };
  const tapY = 460;
  const pressAt = lane => [HD.laneX(lane, tapY), tapY];

  // Warnings the bot has "seen" yet, with what each will hit and when.
  function seenWarns(w, B, me) {
    return w.warns.filter(x => {
      if (!HIT[x.kind]) return false;
      if (x.seenAfter === undefined) x.seenAfter = B.react + B.jitter * rnd(me);
      return x.t >= x.seenAfter;
    });
  }
  function rnd(me) { me.r = (me.r * 1664525 + 1013904223) >>> 0; return me.r / 4294967296; }

  // Seconds until this lane has a problem, as long as Bram is the one who must deal with it, for each lane. Infinity if nothing's coming.
  function deadline(run, lane) {
    const w = run.w;
    let best = Infinity;
    for (const f of w.foes) {
      if (f.dead || f.lane !== lane) continue;
      const v = HD.foeSpeed(run, f);
      const left = f.state === 'attack' ? Math.max(0, T.attackWindup - f.t) : (f.type === 'ram' ? 1 - f.d : T.contactD + 0.1 - f.d) / v;
      const extra = f.type === 'ram' ? -1.2 : 0;
      best = Math.min(best, left + extra);
    }
    return best;
  }
  const whenInReach = (run, lane) => {
    let best = Infinity;
    for (const f of run.w.foes) if (!f.dead && f.lane === lane) best = Math.min(best, Math.max(0, (T.reachD - f.d) / HD.foeSpeed(run, f)));
    return best;
  };

  HD.bot = function (run, input) {
    const w = run.w, B = T.bot, me = w.botMem || (w.botMem = { r: (run.seed >>> 0) || 1, nextTap: 0, holding: false, wantHold: 0 }), now = run.time;
    if (run.over) return;
    const iron = run.carry.iron || 0, locked = HD.locked(run) || B.neverIron, step = HD.stepTime(run);   // neverIron: test/fairness.js, a thumb that never holds
    const tap = lane => { const p = pressAt(lane); if (input.down) input.sim.release(); input.sim.tap(p[0], p[1]); me.nextTap = now + B.tapGap; };
    const hold = lane => { const p = pressAt(lane); if (input.down) input.sim.release(); input.sim.press(p[0], p[1]); me.holding = true; me.nextTap = now + B.tapGap; };
    const letGo = () => { input.sim.release(); me.holding = false; };
    const seen = seenWarns(w, B, me), here = w.target;
    const litFor = lane => seen.filter(x => x.lane === lane).reduce((a, x) => Math.min(a, x.total - x.t), Infinity);
    // A volley can't be walked out of. It holds for one unless it can afford the Guts with a bowl still to come. A locked Bram has no choice.
    const noMoreBowls = w.boss ? w.boss.phase === 3 : (!run.endless && w.wave >= run.stage.waves.length - 1);
    const takeVolley = seen.some(x => x.kind === 'volley') && (locked || (!B.ironAll && !noMoreBowls && w.guts > T.volleyHurt + B.volleySpare));
    const danger = takeVolley ? Infinity : litFor(here);

    // The pal test: stay Iron until Rivetling arrives, or walk to Spoonling.
    if (B.forcePal === 'rivetling' && !run.hasPal('rivetling')) {
      if (me.holding) { if (w.ironOn && (w.ironT < T.rivetHold + 0.1 || w.pal)) return; if (!w.ironOn && input.held < T.holdSecs + 0.1) return; letGo(); return; }
      if (!locked && run.time > 3 && run.index >= 0) { hold(here); return; }
    }
    if (w.pal && w.pal.id === 'spoonling' && now >= me.nextTap && litFor(w.pal.lane) === Infinity) { tap(w.pal.lane); return; }

    // Holding the glass: stay Iron for as long as there's a reason.
    if (me.holding) {
      if (!w.ironOn && input.held < T.holdSecs + 0.05 && !locked) return;
      const ramHere = w.foes.some(f => f.type === 'ram' && f.lane === here && f.d >= T.ramContactD - 0.06);
      const need = litFor(here) < 0.9 || ramHere || w.warns.some(x => HIT[x.kind] && x.lane === here);
      if (!need || locked) letGo();
      return;
    }
    if (input.down) input.sim.release();
    if (now < me.nextTap) return;
    if (B.lapseEvery && now >= (me.nextLapse || (me.nextLapse = B.lapseEvery * (0.5 + rnd(me))))) { me.nextLapse = now + B.lapseEvery * (0.5 + rnd(me)); me.nextTap = now + B.lapseSecs; return; }
    if (B.dodgeOnly) { // the fairness script: answer the warning, ignore everything else
      if (danger === Infinity || w.lanePos !== w.target) return;
      if (B.dodgeBy === 'hold' && !locked) { hold(here); return; }
      const out = [0, 1, 2].filter(l => litFor(l) === Infinity && !w.warns.some(x => HIT[x.kind] && x.lane === l)).sort((a, b) => Math.abs(a - here) - Math.abs(b - here))[0];
      if (out !== undefined) tap(out);
      return;
    }

    // 1. Something's about to land on him. Walk out, or Iron if walking won't make it (or a hook could go back up the lane at somebody).
    if (danger < Infinity) {
      const safe = [0, 1, 2].filter(l => litFor(l) === Infinity && !w.warns.some(x => HIT[x.kind] && x.lane === l));
      const options = safe.map(l => ({ l, dist: Math.abs(l - here), need: deadline(run, l) })).sort((a, b) => a.dist - b.dist || a.need - b.need);
      const best = options[0], walk = best ? best.dist * step : Infinity;
      const hook = seen.find(x => x.lane === here && x.kind === 'hook');
      const worthIron = B.ironUses && !locked && iron < B.ironCap && ((B.ironAll && danger <= T.holdSecs + 0.3) || (w.ironUses < 3 && hook && hook.from && !w.foes.some(f => f.lane === here && f.d >= T.contactD - 0.12)));   // ironAll: a player who holds for everything (the story test)
      if (worthIron && danger <= T.holdSecs + 0.22) { hold(here); return; }
      if (!worthIron && best && danger <= walk + B.late) { tap(best.l); return; }
      if (!best && !locked && danger <= T.holdSecs + 0.2) { hold(here); return; }
      if (best && danger < walk && !locked) { hold(here); return; }
    }

    // 2. A ram that Grist can't take: Iron stops it dead, if we can spare it.
    const ram = w.foes.find(f => f.type === 'ram' && f.lane === here && f.d >= T.ramContactD - 0.05 && f.hp > 1);
    if (ram && !locked && iron < B.ironCap && !w.grist && !HD.canCharge(w)) { hold(here); return; }

    // 3. Grist's up. Send him where he does the most good.
    if (HD.canCharge(w) && w.lanePos === w.target) {
      let bestLane = here, bestScore = -1;
      for (let l = 0; l < 3; l++) {
        const s = w.foes.filter(f => f.lane === l && !f.dead).reduce((a, f) => a + ({ ram: 5, shield: 2, cutter: 2 }[f.type] || 1) * (f.d > 0.05 ? 1 : 0), 0) - (litFor(l) < Infinity ? 3 : 0);
        if (s > bestScore) { bestScore = s; bestLane = l; }
      }
      const bossWants = w.boss && (w.boss.state === 'stand' || w.boss.state === 'far' || (w.boss.state === 'open' && w.boss.phase === 3) || (w.boss.paw && w.boss.paw.lane === here));
      if (bossWants && litFor(here) === Infinity) { const p = [T.btn.x + 30, T.btn.y + 30]; input.sim.tap(p[0], p[1]); me.nextTap = now + B.tapGap; return; }
      if (!w.boss && bestScore >= 3) {
        if (bestLane === here) { const p = [T.btn.x + 30, T.btn.y + 30]; input.sim.tap(p[0], p[1]); me.nextTap = now + B.tapGap; return; }
        if (litFor(bestLane) === Infinity) { tap(bestLane); return; }
      }
    }

    // 4. Something to hit right here: hit it.
    if (w.lanePos === here && w.cd <= 0 && danger === Infinity && HD.anythingInReach(run, here)) { tap(here); return; }

    // 5. Where next? The lane with the nearest deadline. A paw or an open core comes first.
    if (w.lanePos !== w.target) return;
    let goal = -1, soonest = Infinity;
    for (let l = 0; l < 3; l++) {
      if (litFor(l) < 1.2 && l !== here) continue;
      if (w.warns.some(x => HIT[x.kind] && x.lane === l && x.total - x.t < 0.9) && l !== here) continue;
      let dl = deadline(run, l);
      if (w.boss && HD.bossTarget(run, l)) dl = Math.min(dl, -1);
      if (dl < soonest) { soonest = dl; goal = l; }
    }
    if (goal < 0 || goal === here) return;
    const walk = Math.abs(goal - here) * step, inReachIn = whenInReach(run, goal), bossGoal = w.boss && HD.bossTarget(run, goal);
    const hereBusy = HD.anythingInReach(run, here) && deadline(run, here) < soonest + 0.3;
    if (!hereBusy && (bossGoal || inReachIn <= walk)) tap(goal);
  };
})();
