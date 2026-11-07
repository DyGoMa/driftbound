// Hot Hand: Warden Krell's shield line. A state machine, logic only. Three shields, one per lane, march on Juno. Each has a vent that opens on a cycle.
// Throw into an open vent to build pressure; a full one blows that shield. All three down and Krell's in the open. Beat him through his health for the round.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;

  function makeShield(lane, i) {
    const L = T.lanes[lane];
    return { kind: 'shield', lane, i, w: Math.max(T.minHalfW * 2, T.shieldW * L.s), h: T.shieldH * L.s, s: L.s, x: 0, y: L.y, gauge: 0, vent: 'shut', vt: T.ventFirst + i * T.ventStagger, down: false, downT: 0, mark: 0, flash: 0 };
  }

  HH.bossNew = () => ({
    round: 0, x: T.lineStart, state: 'march', t: 0, addT: T.bossAddFirst, quenchT: T.bossQuenchFirst, windT: 0, ramT: 0, totalHp: T.krellHp.reduce((a, b) => a + b, 0), lost: 0,
    shields: T.lanes.map((_, i) => makeShield(i, i)),
    krell: { kind: 'krell', x: 0, y: T.lanes[1].y, w: T.krellBox.w, h: T.krellBox.h, s: 1, hp: T.krellHp[0], exposed: false, exposeT: 0, flash: 0, mark: 0, hit: 0 },
  });

  HH.bossRound = function (run, i) {
    const b = run.w.boss, k = b.krell;
    b.round = i; b.x = T.lineStart; b.state = 'march'; b.warned = false; b.t = 0; b.addT = T.bossAddFirst; b.quenchT = T.quenchEvery[i] ? T.bossQuenchFirst : 1e9; b.windT = 0;
    b.shields = T.lanes.map((_, n) => makeShield(n, n));
    k.hp = T.krellHp[i]; k.exposed = false; k.exposeT = 0; k.down = false;
    HH.placeLine(b);
    if (i > 0) HH.say(run, W.boss.round[i - 1]);   // round 1's line waits for play to start (stepBoss): the talk scene is still up when this runs
  };

  HH.placeLine = function (b) {
    b.shields.forEach(s => { s.x = b.x + T.shieldOff[s.lane]; });
    b.krell.x = b.x + T.krellX * (b.krell.exposed ? 0.35 : 1);
    b.krell.y = T.lanes[1].y + (b.krell.exposed ? 10 : -6);
  };

  // A flame gets into an open vent.
  HH.ventHit = function (run, s, shot) {
    const b = run.w.boss, need = T.ventNeed[b.round];
    if (s.down) return;   // a second flame was already in the air: this shield has gone, and it pays once
    s.gauge += T.ventPush[shot.tier] + (shot.marked ? T.ventMark : 0);
    s.flash = 0.2;
    HH.sfx(run, 'ventin');
    HH.fx(run, A => A.floatText(s.x, s.y - s.h - 8, '+' + (T.ventPush[shot.tier] + (shot.marked ? T.ventMark : 0)), HH.TIER_COLOURS[shot.tier], 16));
    if (s.gauge < need) return;
    s.down = true; s.downT = 0; s.vent = 'shut'; s.mark = 0;
    run.addScore(T.shieldScore);
    HH.sfx(run, 'overload');
    HH.tableUp(run, T.shieldChip, s);
    HH.fx(run, A => { A.shake(9, 0.5); A.burst(s.x, s.y - s.h * 0.5, { n: 46, colors: ['#ffe46a', '#ff8a2a', '#ff3a1e', '#5d6269'], speed: 300, life: 0.8, size: 6 }); });
    run.w.rings.push({ x: s.x, y: s.y - s.h * 0.5, r: T.shieldBlastR, t: 0, col: '#ffb35a' });
    HH.burnAround(run, s.x, s.y - s.h * 0.5, T.shieldBlastR, T.shieldBlastDmg, 2, null);
    if (b.shields.every(o => o.down)) expose(run);
    else HH.sayOne(run, W.boss.overload, 'overI');
  };

  function expose(run) {
    const b = run.w.boss, k = b.krell;
    k.exposed = true; k.exposeT = T.exposeSecs[b.round]; b.state = 'open';
    HH.sfx(run, 'alarm');
    HH.say(run, W.boss.expose);
  }

  HH.krellHit = function (run, shot) {
    const b = run.w.boss, k = b.krell;
    if (!k.exposed || run.w.phase !== 'wave') return;
    k.hp -= shot.dmg; k.flash = 0.18;
    run.addScore(T.krellScore * T.scoreX[shot.tier]);
    if (shot.tier >= 3) HH.tableUp(run, T.edgeTable, k);
    HH.fx(run, A => A.floatText(k.x, k.y - k.h - 6, '-' + shot.dmg, HH.TIER_COLOURS[shot.tier], 20));
    if (k.hp <= 0) {
      k.exposed = false; k.down = true; b.state = 'beaten'; b.t = 0;
      HH.sfx(run, 'boom');
      HH.fx(run, A => { A.shake(10, 0.6); A.burst(k.x, k.y - 60, { n: 40, colors: ['#ffe46a', '#ff8a2a', '#5d6269'], speed: 240, life: 0.8, size: 5 }); });
      run.w.foes.forEach(f => { f.dead = true; });
      run.w.projs = [];
      run.addScore(T.krellDownScore);
      HH.waveCleared(run);
    } else if (run.rng() < T.krellTalks) HH.sayOne(run, W.boss.hit, 'hitI');
  };

  HH.bossBeat = function (run) { run.w.boss.krell.down = true; };   // on his knees until the next round starts

  // Krell gets his breath back: the line closes again, with some of the pressure still in the pipes.
  function reform(run) {
    const b = run.w.boss, k = b.krell, need = T.ventNeed[b.round];
    k.exposed = false; b.state = 'march'; b.warned = false; b.x = Math.max(b.x, T.ramBack);
    b.shields = T.lanes.map((_, n) => { const s = makeShield(n, n); s.gauge = need * T.reformGauge; return s; });
    HH.sfx(run, 'clang');
    HH.say(run, W.boss.reform);
  }

  function stepVents(run, dt) {
    const b = run.w.boss, r = b.round;
    for (const s of b.shields) {
      if (s.flash > 0) s.flash -= dt;
      if (s.down) { s.downT += dt; continue; }
      if (s.graceT > 0) s.graceT -= dt;
      s.vt -= dt;
      if (s.vt > 0) continue;
      if (s.vent === 'shut') { s.vent = 'tell'; s.vt = T.ventTell; HH.sfx(run, 'whistle'); }
      else if (s.vent === 'tell') { s.vent = 'open'; s.vt = T.ventOpen[r]; }
      else { s.vent = 'shut'; s.vt = T.ventShut[r]; s.graceT = T.ventGrace; }
    }
  }

  // The can that puts her out. It only takes heat, and heat you may be glad to lose.
  HH.quenched = function (run) {
    const w = run.w;
    w.heat = Math.max(0, w.heat - T.quenchHeat);
    w.quenchT = T.quenchedSecs;
    HH.sfx(run, 'quench');
    HH.fx(run, A => { A.burst(w.jx, T.frontY - 60, { n: 26, colors: ['#ffffff', '#bfe1ff', '#7fb4e8'], speed: 180, life: 0.6, size: 4 }); A.floatText(w.jx + 10, T.frontY - 112, 'QUENCHED', '#bfe1ff', 18); });
  };

  HH.stepBoss = function (run, dt) {
    const w = run.w, b = w.boss, k = b.krell, r = b.round;
    if (k.flash > 0) k.flash -= dt;
    b.t += dt;
    if (w.wave === 0 && !w.seen.bossStart && b.t >= 0.4) { w.seen.bossStart = 1; HH.say(run, W.boss.start); }
    if (b.state === 'open') {
      k.exposeT -= dt;
      stepVents(run, dt);
      if (k.exposeT <= 0) reform(run);
    } else if (b.state === 'march') {
      const speed = (T.lineStart - T.ramX) / T.marchSecs[r];
      b.x -= speed * dt;
      stepVents(run, dt);
      if (!b.warned && b.x <= T.ramX + speed * T.ramWarn) { b.warned = true; HH.say(run, W.boss.ramSoon); }   // said while there's still time to do it: the warning at ramTell is too late to reach a vent
      if (b.x <= T.ramX) { b.x = T.ramX; b.state = 'ramTell'; b.ramT = T.ramTell; b.warnAt = run.time; HH.sfx(run, 'ram'); HH.say(run, W.boss.ram); }
    } else if (b.state === 'ramTell') {
      stepVents(run, dt);
      b.ramT -= dt;
      if (b.ramT <= 0) {
        HH.hurt(run, T.ramHurt, { why: 'ram', warnAt: b.warnAt });
        HH.sfx(run, 'boom');
        HH.fx(run, A => A.shake(12, 0.5));
        b.x = T.ramBack; b.state = 'march'; b.warned = false;
      }
    }
    // Round the sides of the line
    b.addT -= dt;
    if (b.addT <= 0 && w.foes.length < T.addMax) {
      const types = T.addTypes[r];
      HH.addFoe(run, types[run.int(0, types.length - 1)]);
      b.addT = T.addEvery[r];
    }
    // Quench cans
    if (T.quenchEvery[r] && b.state !== 'open') {
      if (b.windT > 0) {
        b.windT -= dt;
        if (b.windT <= 0) { HH.addProj(run, 'quench', k.x - 10, k.y - k.h, T.quenchFly, 90, b.quenchWarn); HH.sfx(run, 'whoosh'); b.quenchT = T.quenchEvery[r]; }
      } else {
        b.quenchT -= dt;
        if (b.quenchT <= 0) { b.windT = T.quenchWind; b.quenchWarn = run.time; HH.sfx(run, 'alarm'); if (!w.seen.quench) { w.seen.quench = 1; HH.teach(run, 'quench', W.boss.quench); } }
      }
    }
    HH.placeLine(b);
  };
})();
