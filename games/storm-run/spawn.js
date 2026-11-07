// Storm Run: what comes down the road. Foes arrive at Kaito's spot on a schedule (so a fast Hollow never lands on top of a trooper),
// salvage patterns come with them, plus radio lines and the two hidden pals.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  function pickType(run) {
    const w = run.w, mix = Object.assign({}, run.stage.mix);
    if (run.time - w.lastTall < T.tallEvery) delete mix.tall;
    const names = Object.keys(mix), total = names.reduce((a, n) => a + mix[n], 0);
    let r = run.rng() * total;
    for (const n of names) { r -= mix[n]; if (r <= 0) return n; }
    return names[0];
  }
  const extraOf = type => (T.foes[type === 'pair' ? 'trooper' : type].extra || 0);

  function addFoe(run, type, x) {
    const w = run.w, f = { type, x, done: false, aim: w.kx };
    if (type === 'swoop') {
      f.low = run.rng() < T.swoopDiveChance ? T.swoopOverLow : T.swoopDiveLow;
      Kit.audio.play('whoosh');
    }
    if (type === 'low' && run.stage.lowScale) f.scale = run.stage.lowScale;
    w.foes.push(f);
    return f;
  }

  // Salvage is placed so that it reaches Kaito together with the foe, whatever their speeds.
  function coinsFor(run, type, foeX) {
    const w = run.w, v = w.speed, vf = w.speed + extraOf(type);
    if (run.rng() > T.coinChance) return;
    const x = w.kx + (foeX - w.kx) * (v / vf);
    // The bait: over a foe a plain jump clears, high salvage that only an extra Surge reaches. Past the foe, where a Surged jump is at its top.
    const bait = (type === 'low' || type === 'trooper') && run.rng() < (run.stage.bait || 0);
    const row = T.coinRows[bait ? 'bait' : type];
    row.forEach((alt, i) => w.coins.push({ x: x + (bait ? T.baitAhead : 0) + (i - (row.length - 1) / 2) * 24, alt, big: bait || type === 'tall' }));
  }

  SR.spawnStep = function (run) {
    const w = run.w, st = run.stage;
    if (!run.endless && (st.length - w.dist) * T.metre < T.endClear + (T.spawnX - w.kx)) return;
    if (!w.pending) w.pending = pickType(run);
    const type = w.pending, travel = (T.spawnX - w.kx) / (w.speed + extraOf(type));
    if (run.time + travel < w.nextArrival) return;
    if (type === 'pair') { addFoe(run, 'trooper', T.spawnX); addFoe(run, 'trooper', T.spawnX + T.pairGap); }
    else addFoe(run, type, T.spawnX);
    if (type === 'tall') w.lastTall = run.time;
    coinsFor(run, type, T.spawnX);
    const shrink = run.endless ? Math.max(T.endless.gapMin, 1 - run.time * T.endless.gapShrink) : 1;
    w.nextArrival = run.time + travel + Math.max(T.after[type], run.range(st.gap[0], st.gap[1]) * shrink);
    w.pending = null;
  };

  // Crew on the radio, at set points along the stage.
  SR.radioStep = function (run) {
    const w = run.w, list = run.stage.radio;
    if (!list || !run.stage.length || w.radioI >= list.length) return;
    const l = list[w.radioI];
    if (w.dist / run.stage.length >= l.at) { w.radioI++; SR.say(run, l, 2.8); }
  };

  // ---- Pals. Fizzlet comes to a burnt arm: going numb can bring it trotting down the road, and you catch it by staying on the ground.
  // Boltnip only flies when the arm has been clean a long while, up where only a Surge can reach it.
  function spawnPal(run, id, alt) {
    const w = run.w;
    w.pal = { id, x: T.spawnX - T.palSpawnBack, alt };
    SR.say(run, SR.WORDS.palAppear[id], 2.6);
  }
  // A pal stays out of the crew's jokes (FRIDAY_BATCH.md), and the result panel's line can be one: any pal still on the road bolts when the stage ends.
  SR.palLeaves = function (run) {
    const p = run.w.pal;
    if (!p) return;
    run.w.pal = null;
    A().burst(p.x, T.groundY - p.alt - 18, { n: 10, color: '#d9d3c4', speed: 90, life: 0.3, size: 2.4, gravity: 60 });
  };
  SR.palOnNumb = function (run) {
    const w = run.w;
    if (run.boss || w.pal || run.hasPal('fizzlet')) return;
    if (!run.endless && run.index < T.fizzletFromStage) return;
    if (run.rng() < T.fizzletChance) spawnPal(run, 'fizzlet', 0);
  };
  SR.palStep = function (run, dt) {
    const w = run.w;
    if (!run.boss && !w.pal && !w.boltTried && !run.hasPal('boltnip') && (run.endless || run.index >= T.boltnipFromStage)
      && w.scar <= T.boltnipScar && run.time - w.lastSurge >= T.boltnipCalm && run.time >= T.boltnipCalm) {
      w.boltTried = true;
      if (run.rng() < T.boltnipChance) spawnPal(run, 'boltnip', T.boltnipAlt);
    }
    const p = w.pal;
    if (!p) return false;
    p.x -= w.speed * T.palSpeed[p.id] * dt;
    if (p.id === 'boltnip' && Math.random() < 0.3) A().burst(p.x - 14, T.groundY - p.alt - 2, { n: 1, color: '#fff3a8', speed: 30, life: 0.3, size: 2, gravity: 20 });
    const reach = T.palRadius + T.kaitoHalfW;
    const hit = Math.abs(p.x - w.kx) < reach && w.k.alt < p.alt + T.palCatchHeight && w.k.alt + T.kaitoTall > p.alt;
    if (hit) { w.pal = null; A().burst(w.kx, T.groundY - w.k.alt - 30, { n: 20, colors: ['#f4c152', '#ffffff'], speed: 160 }); run.catchPal(p.id); return true; }
    if (p.x < -80) w.pal = null;
    return false;
  };
})();
