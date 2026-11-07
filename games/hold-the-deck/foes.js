// Hold the Deck: the boarders. How they walk, fight, step round crates and go down. No drawing here.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  HD.spawn = function (run, type, lane, o = {}) {
    const w = run.w, s = T.foes[type];
    const f = { type, lane, laneF: lane, d: o.d || 0, hp: s.hp, state: 'walk', t: 0, flash: 0, sideFrom: lane, throws: 0, aimIn: 0, seed: run.int(0, 9999), breakT: 0 };
    w.foes.push(f);
    return f;
  };
  const speedOf = (run, f) => T.foes[f.type].speed * run.w.speedMul;
  HD.foeSpeed = speedOf;

  // ---- One step of every boarder.
  HD.stepFoes = function (run, dt) {
    const w = run.w;
    // Front of the queue first, so those behind can keep their distance.
    const order = w.foes.slice().sort((a, b) => b.d - a.d);
    const front = [null, null, null];
    for (const f of order) {
      if (f.dead) continue;
      if (f.flash > 0) f.flash -= dt;
      f.t += dt;
      stepOne(run, f, dt, front[f.lane]);
      if (run.over) return;
      if (!f.dead) front[f.lane] = f;
    }
    w.foes = w.foes.filter(f => !f.dead);
    for (const k of w.debris) { k.age += dt; k.x += k.vx * dt; k.y += k.vy * dt; k.vy += 620 * dt; k.spin += k.vs * dt; }
    w.debris = w.debris.filter(k => k.age < 0.8);
  };

  function stepOne(run, f, dt, ahead) {
    const w = run.w, v = speedOf(run, f), here = HD.inLane(w, f.lane);
    if (f.state === 'side') {
      const u = Math.min(1, f.t / T.sideSecs);
      f.laneF = f.sideFrom + (f.lane - f.sideFrom) * u;
      if (u >= 1) { f.state = 'walk'; f.laneF = f.lane; }
    }
    if (f.type === 'ram') return stepRam(run, f, dt, ahead, here);
    if (f.state === 'attack') {
      if (!here) { f.state = 'walk'; f.t = 0; }
      else if (w.ironOn) { f.state = 'stun'; f.t = 0; }
      else if (f.t >= T.attackWindup) { HD.hurt(run, T.bladeHurt, f.type); f.d -= T.attackRecoil; f.state = 'walk'; f.t = 0; Kit.audio.play('hit'); }
      return;
    }
    if (f.state === 'stun') {
      if (!w.ironOn || !here) { f.state = 'walk'; f.t = 0; }
      return;
    }
    if (f.type === 'cutter' && f.state === 'walk' && f.throws < T.foes.cutter.throws && f.d >= T.foes.cutter.stopAt) { f.state = 'aim'; f.aimIn = T.foes.cutter.firstAim; f.t = 0; return; }
    if (f.state === 'aim') {
      f.aimIn -= dt;
      if (f.aimIn <= 0 && !f.warned && HD.warn(run, 'hook', f.lane, T.hookWarn, { from: f })) f.warned = true;
      return;   // hazards.js moves him on after the throw
    }
    // Walking
    let want = f.d + v * dt;
    if (ahead && ahead.lane === f.lane) want = Math.min(want, ahead.d - T.spacing);
    if (f.state === 'side') want = f.d + v * dt * T.sideWalkMul;
    f.d = Math.max(f.d, want);
    const wall = HD.wallAhead(w, f);
    if (wall && f.state === 'walk') {
      const to = HD.laneRound(run, f.lane, wall);
      if (to === null) { f.d = Math.min(f.d, wall.d - T.wallChewStop); wall.chew += dt; if (wall.chew > T.wallChewSecs) HD.smashWall(run, wall, false); }
      else { f.sideFrom = f.lane; f.lane = to; f.state = 'side'; f.t = 0; }
    }
    if (here && f.d >= T.contactD && f.state === 'walk') { f.state = w.ironOn ? 'stun' : 'attack'; f.t = 0; return; }
    if (f.d >= 1) through(run, f, T.doorHurt);
  }

  function stepRam(run, f, dt, ahead, here) {
    const w = run.w, v = speedOf(run, f);
    let want = f.d + v * dt;
    if (ahead && ahead.lane === f.lane) want = Math.min(want, ahead.d - T.spacing);
    if (here && w.ironOn && want >= T.ramContactD) {
      f.d = T.ramContactD; f.breakT += dt;
      if (Math.random() < 0.2) A().burst(HD.laneX(f.lane, 440), 440, { n: 3, colors: ['#ff9a4a', '#ffd9a0'], speed: 120, life: 0.25, size: 2 });
      if (f.breakT >= T.ramIronSecs) { Kit.audio.play('boom'); A().shake(8, 0.3); HD.kill(run, f, 'iron'); }
      return;
    }
    f.breakT = 0;
    if (here && !w.ironOn && f.d < T.ramContactD && want >= T.ramContactD) {   // shoved out of the way, and it keeps coming
      HD.hurt(run, T.ramShoveHurt, 'ram');
      const side = w.target === 1 ? (run.rng() < 0.5 ? 0 : 2) : 1;
      w.target = side; w.arriveSwing = false;
    }
    f.d = Math.max(f.d, want);
    if (f.d >= 1) through(run, f, T.ramDoorHurt);
  }

  function through(run, f, n) {
    const w = run.w, x = HD.laneX(f.lane, T.doorY);
    f.dead = true; w.throughs++;
    Kit.audio.play('pot');
    A().burst(x, T.doorY - 8, { n: 14, colors: ['#f5efe2', '#c8ccd2', '#f0752b'], speed: 190, life: 0.45, size: 3 });
    A().floatText(x, T.doorY - 40, 'THROUGH!', A().ORANGE, 20);
    w.doorHit = 0.5; w.doorLane = f.lane;
    HD.first(run, 'through');
    HD.hurt(run, n, 'door');
  }

  HD.anythingInReach = function (run, lane) {
    const w = run.w;
    if (w.foes.some(f => f.lane === lane && !f.dead && f.d >= T.reachD)) return true;
    if (w.walls.some(c => c.lane === lane && c.d >= T.reachD)) return true;
    return !!(w.boss && HD.bossTarget(run, lane));
  };

  // A swing, or Iron being let go. Hits everyone in reach in this lane; a chain of them is worth more. Returns how many it hit.
  HD.hitLane = function (run, lane, dmg, how) {
    const w = run.w;
    let n = 0, kills = 0;
    const list = w.foes.filter(f => f.lane === lane && !f.dead && f.d >= T.reachD);
    for (const f of list) {
      n++;
      const hit = how === 'shed' ? Math.max(1, dmg) : dmg;
      if (how === 'shed') run.addScore(T.shedScore);
      if (f.type === 'ram' && dmg === 1 && how === 'shed') continue;
      f.hp -= hit; f.flash = 0.12;
      if (f.hp <= 0) { HD.kill(run, f, how); kills++; }
      else {
        Kit.audio.play(f.type === 'shield' || f.type === 'ram' ? 'clang' : 'hit');
        if (f.type !== 'ram') { f.d = Math.max(0, f.d - T.hitKnock); f.state = 'walk'; f.t = 0; }
        const y = HD.yOf(f.d);
        A().burst(HD.laneX(f.lane, y), y - 30, { n: 10, colors: ['#ffd9a0', '#ffffff', '#8e949d'], speed: 150, life: 0.3, size: 3 });
      }
    }
    for (const c of w.walls.filter(c => c.lane === lane && c.d >= T.reachD)) { n++; if (how === 'swing') { HD.smashWall(run, c, true); } }
    if (w.boss) n += HD.bossHitLane(run, lane, dmg, how);
    if (kills > 1) {
      run.addScore(T.chainScore * (kills - 1)); HD.addTemper(run, T.temperChain * (kills - 1));
      A().floatText(HD.laneX(lane, 330), 300, kills + ' IN ONE!', A().GOLD, 22);
      w.hitStop = T.hitStopSecs;
    }
    if (kills) A().shake(2 + kills, 0.14);
    return n;
  };

  // A boarder goes down. The body flies for the look only; the score, the meter and the cog are real.
  HD.kill = function (run, f, how) {
    const w = run.w, s = T.foes[f.type], y = HD.yOf(f.d);
    if (f.dead) return;
    f.dead = true; w.kills++;
    run.addScore(s.score);
    HD.addTemper(run, T.temperPerKill * (run.boss ? T.boss.temperKillMul : 1));
    if (f.warned) HD.cancelWarnsFrom(run, f);
    Kit.audio.play(f.type === 'ram' ? 'boom' : 'hit');
    const side = f.lane === 0 ? -1 : f.lane === 2 ? 1 : (run.rng() < 0.5 ? -1 : 1);
    w.debris.push({ type: f.type, x: HD.laneX(f.laneF, y), y, h: HD.heightAt(s.cm, y), age: 0, vx: side * (70 + run.rng() * 70), vy: -(190 + run.rng() * 70), spin: 0, vs: side * 7, seed: f.seed });
    A().burst(HD.laneX(f.lane, y), y - 34, { n: 9, colors: ['#ffffff', '#f4c152', '#8e949d'], speed: 160, life: 0.32, size: 3 });
    if (run.rng() < s.drop) HD.dropCog(run, HD.laneX(f.lane, y), y - 30, f.type === 'ram' ? T.ramCogs : T.cogValue);
  };
  HD.dropCog = function (run, x, y, n) {
    run.addSalvage(n); run.addScore(T.scorePerSalvage * n);
    run.w.cogs.push({ x, y, age: 0, n });
    Kit.audio.play('pickup');
    A().floatText(x, y - 8, '+' + n, A().GOLD, 16);
  };

  // Grist's charge: flattens everything at his nose, in his lane, whatever it is.
  HD.gristHits = function (run, g) {
    const w = run.w;
    for (const f of w.foes) {
      if (f.dead || f.lane !== g.lane || f.d < g.d - T.gristWidth) continue;
      HD.kill(run, f, 'grist');
    }
    for (const c of w.walls.slice()) if (c.lane === g.lane && c.d >= g.d - T.gristWidth) HD.smashWall(run, c, true);
    if (w.boss) HD.bossGrist(run, g);
  };
})();
