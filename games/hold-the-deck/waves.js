// Hold the Deck: what comes when. Waves and their beats, the meal between waves, radio lines, the end of a stage.
window.HD = window.HD || {};
(function () {
  const T = TUNE, W = HD.WORDS, A = () => Kit.art;

  HD.newWaves = function (run) {
    const w = run.w;
    w.wave = 0; w.phase = 'banner'; w.phaseT = run.stage.hint ? T.hintSecs : T.bannerSecs; w.waveT = 0; w.beatsLeft = 0; w.nextBeat = 0; w.beatNo = 0; w.laneMem = []; w.pending = []; w.radioDone = {};
    w.speedMul = run.stage.speed;
    startWave(run);
  };

  function waveSpec(run, i) {
    if (!run.endless) return run.stage.waves[i];
    const e = T.endless, g = Math.max(0, i * e.gapPerWave);
    return { volleyEvery: Math.max(e.volleyEveryMin, Math.round(e.volleyEvery - i * e.volleyEveryDrop)), beats: Math.min(e.beatsMax, e.beatsStart + i * e.beatsPerWave), gap: [Math.max(e.gapMin[0], e.gapStart[0] - g), Math.max(e.gapMin[1], e.gapStart[1] - g)], mix: e.mix[Math.min(e.mix.length - 1, Math.floor(i / 2))] };
  }

  function startWave(run) {
    const w = run.w, s = waveSpec(run, w.wave);
    w.spec = s; w.beatsLeft = s.beats; w.beatNo = 0; w.nextBeat = T.firstBeat; w.waveT = 0;
    if (run.endless) w.speedMul = Math.min(T.endless.speedMax, run.stage.speed + T.endless.speedPerWave * w.wave);
    w.bannerText = run.endless ? W.endlessWave(w.wave) : W.waveName(w.wave, run.stage.waves.length);
  }

  // Picks a lane, not the same one three times running and not one with somebody just setting off in it.
  function pickLane(run) {
    const w = run.w, mem = w.laneMem;
    let opts = [0, 1, 2].filter(l => !(mem.length >= 2 && mem[0] === l && mem[1] === l));
    const clear = opts.filter(l => !w.foes.some(f => f.lane === l && f.d < T.spacing * T.beat.laneClearMul));
    if (clear.length) opts = clear;
    const l = opts[run.int(0, opts.length - 1)];
    mem.unshift(l); mem.length = Math.min(mem.length, 2);
    return l;
  }
  const others = (run, l) => { const a = [0, 1, 2].filter(x => x !== l); return a[run.int(0, 1)]; };
  const R = T.beat;

  // Each beat returns false if it can't happen fairly just now, and tries again a moment later. A number is extra seconds of room after it.
  const BEATS = {
    grunt(run) { HD.spawn(run, 'grunt', pickLane(run)); },
    pair(run) { const l = pickLane(run); HD.spawn(run, 'grunt', l); HD.spawn(run, 'grunt', others(run, l)); return R.pairRoom; },
    file(run) { const l = pickLane(run); HD.spawn(run, 'grunt', l); run.w.pending.push({ in: R.fileAfter, type: 'grunt', lane: l }); return R.fileRoom; },
    line(run) { [0, 1, 2].forEach(l => HD.spawn(run, 'grunt', l)); return R.lineRoom; },   // three abreast: one swing can't do it, so somebody gets close
    flank(run) { const l = pickLane(run); HD.spawn(run, 'cutter', l); run.w.pending.push({ in: R.flankAfter, type: 'runner', lane: others(run, l) }); return R.flankRoom; },
    runner(run) { HD.spawn(run, 'runner', pickLane(run)); },
    rush(run) { const l = pickLane(run); HD.spawn(run, 'runner', l); run.w.pending.push({ in: R.rushAfter, type: 'runner', lane: others(run, l) }); return R.rushRoom; },
    shield(run) { HD.spawn(run, 'shield', pickLane(run)); return R.shieldRoom; },
    cutter(run) {
      if (run.w.foes.filter(f => f.type === 'cutter' && f.throws < T.foes.cutter.throws).length >= 2) return BEATS.grunt(run);
      HD.spawn(run, 'cutter', pickLane(run));
    },
    rope(run) { const l = pickLane(run); HD.warn(run, 'rope', l, T.ropeWarn, { d: run.range(R.ropeD[0], R.ropeD[1]) }); },
    wall(run) {
      const w = run.w;
      if (w.walls.length + w.warns.filter(x => x.kind === 'wall').length >= T.wallMax) return BEATS.grunt(run);
      const taken = l => w.walls.some(c => c.lane === l) || w.warns.some(x => x.kind === 'wall' && x.lane === l);
      const free = [0, 1, 2].filter(l => !taken(l));
      HD.warn(run, 'wall', free[run.int(0, free.length - 1)], T.wallWarn, { d: run.range(T.wallD[0], T.wallD[1]) });
    },
    drop(run) { return HD.warn(run, 'drop', run.w.target, T.dropWarn, { d: T.bramD }) ? R.dropRoom : false; },
    ram(run) {
      if (run.w.foes.some(f => f.type === 'ram')) return BEATS.shield(run);
      HD.spawn(run, 'ram', pickLane(run));
      return R.ramRoom;
    },
    volley(run) { return HD.volley(run, run.pick(run.stage.volley)) ? R.volleyRoom : false; },
  };

  function nextBeat(run) {
    const w = run.w, s = w.spec;
    if (s.ramsAt && s.ramsAt.includes(w.beatNo)) return 'ram';
    if (s.volleysAt && s.volleysAt.includes(w.beatNo)) return 'volley';
    if (s.volleyEvery && w.beatNo % s.volleyEvery === s.volleyEvery - 1) return 'volley';
    const names = Object.keys(s.mix), total = names.reduce((a, n) => a + s.mix[n], 0);
    let r = run.rng() * total;
    for (const n of names) { r -= s.mix[n]; if (r <= 0) return n; }
    return names[0];
  }

  // Returns true if a meal stopped play this step.
  HD.stepWaves = function (run, dt) {
    const w = run.w;
    if (w.phase === 'banner') {
      w.phaseT -= dt;
      if (w.phaseT <= 0) w.phase = 'fight';
      return false;
    }
    if (w.phase === 'fight') {
      w.waveT += dt;
      radio(run);
      for (const p of w.pending.slice()) { p.in -= dt; if (p.in <= 0) { w.pending.splice(w.pending.indexOf(p), 1); HD.spawn(run, p.type, p.lane); } }
      if (w.beatsLeft > 0 && (w.nextBeat -= dt) <= 0) {
        const name = w.retry || nextBeat(run), extra = BEATS[name](run);
        if (extra === false) { w.retry = name; w.nextBeat = R.retry; return false; }
        w.retry = null; w.beatsLeft--; w.beatNo++;
        w.nextBeat = run.range(w.spec.gap[0], w.spec.gap[1]) + (extra || 0);
      }
      if (w.beatsLeft <= 0 && !w.pending.length && !w.foes.length && !w.warns.length) { w.phase = 'calm'; w.phaseT = T.calmSecs; w.fastT = 0; }
      return false;
    }
    // calm
    w.phaseT -= dt;
    if (w.phaseT > 0) return false;
    const last = !run.endless && w.wave >= run.stage.waves.length - 1;
    if (last) { HD.clearStage(run); return false; }
    w.wave++;
    w.phase = 'banner'; w.phaseT = T.bannerSecs;
    startWave(run);
    if (run.endless && w.wave % T.endless.mealEvery) return false;   // endless: the pot comes out every so often, so a meal can't heal everything the flat pressure takes
    HD.serveMeal(run);
    return true;
  };

  HD.clearStage = function (run) {
    const w = run.w;
    run.addSalvage(run.stage.clearSalvage);
    run.addScore(T.scoreClear + T.scorePerGuts * w.guts);
    A().burst(HD.laneX(w.lanePos, 420), 400, { n: 24, colors: ['#f2d21b', '#f4c152', '#ffffff'], speed: 190, life: 0.6 });
    HD.stageWon(run);
    HD.storyCleared(run);
    if (run.boss) HD.rememberEnding(run.carry.iron || 0);
    run.win();
  };

  function radio(run) {
    const w = run.w, list = run.stage.radio;
    if (!list) return;
    list.forEach((l, i) => { if (l.wave === w.wave && w.waveT >= l.at && !w.radioDone[i]) { w.radioDone[i] = true; HD.say(run, l); } });
  }

  // ---- The meal. One pot between waves: heal, speed, or pull back the iron a little (spec).
  HD.mealNumbers = function (run) {
    const pot = run.up('pot');
    return { broth: T.brothGuts + pot * T.brothPerLevel, pepper: Math.max(T.pepperFloor, T.pepperMul - T.pepperPerLevel * pot), tonic: T.tonicIron + T.tonicPerLevel * pot };
  };
  HD.serveMeal = function (run) {
    const w = run.w, M = W.meals, n = HD.mealNumbers(run), iron = run.carry.iron || 0;
    w.mealsAsked++;
    if (w.sayQ) w.sayQ.length = 0;
    w.sayT = 0;   // the meal screen clears the talk box
    Kit.audio.play('eat');
    run.ask({
      title: run.boss ? M.bossTitle : M.title, text: M.text(w.guts, w.gutsMax, iron),
      options: [
        { label: M.broth.label, blurb: M.broth.blurb(n.broth), value: 'broth' },
        { label: M.pepper.label, blurb: (run.boss ? M.pepper.bossBlurb : M.pepper.blurb)(Math.round((1 - n.pepper) * 100)), value: 'pepper' },
        { label: M.tonic.label, blurb: M.tonic.blurb(HD.pct(n.tonic)), value: 'tonic' },
      ],
    }, opt => HD.eat(run, opt.value));
  };
  HD.eat = function (run, what) {
    const w = run.w, n = HD.mealNumbers(run), x = HD.laneX(w.lanePos, 440);
    const wasted = (what === 'broth' && w.guts >= w.gutsMax) || (what === 'tonic' && (run.carry.iron || 0) <= 0);
    w.meals[what] = (w.meals[what] || 0) + 1;
    w.fastT = 0;   // one pot, one meal: whatever the last bowl was doing is over
    w.eatT = 0.9;
    Kit.audio.play('eat');
    if (what === 'broth') { w.guts = Math.min(w.gutsMax, w.guts + n.broth); A().floatText(x, 370, 'GUTS +' + n.broth, '#ffb27a', 22); }
    if (what === 'pepper') { w.fastT = T.pepperSecs; w.fastMul = n.pepper; A().floatText(x, 370, 'QUICK!', '#ff9a4a', 22); }   // lasts until the wave ends (stepWaves) or the next bowl (above)
    if (what === 'tonic') { HD.pullIron(run, n.tonic); A().floatText(x, 370, 'IRON -' + HD.pct(n.tonic) + '%', '#c9ced8', 22); A().burst(x, 420, { n: 22, color: '#8e949d', speed: 130, life: 0.6, size: 3 }); }
    HD.say(run, W.meals.said[what], T.sayMealSecs);
    HD.palAfterMeal(run, wasted);
  };
  HD.botAsk = function (spec, run) {
    const w = run.w, iron = run.carry.iron || 0, B = T.bot;
    if (B.forceMeal) return { broth: 0, pepper: 1, tonic: 2 }[B.forceMeal];
    if (B.forcePal === 'spoonling' && w.guts >= w.gutsMax) return 0;
    if (w.guts <= w.gutsMax - 2) return 0;
    if (iron > 0.14) return 2;
    return 1;
  };
})();
