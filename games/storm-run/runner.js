// Storm Run: the rules of the run. The body, the Surge and its scars, foes, salvage, getting hurt. No drawing here.
// Foe boxes and the body's fall are plain functions, so the test bot (bot.js) can look ahead with the same sums the game uses.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // ---- The body. alt = feet above the road.
  SR.newBody = () => ({ alt: 0, vy: 0, air: false, surged: false, jumpT: 0, hold: false, cut: false, buffer: 0 });
  SR.startJump = k => { k.air = true; k.vy = T.jumpSpeed; k.jumpT = 0; k.hold = true; k.cut = false; k.surged = false; };
  SR.startSurge = k => { k.vy = T.surgeSpeed; k.surged = true; k.cut = true; };
  // One step of the air. Returns true on landing. down = the thumb is still on the glass.
  SR.stepBody = function (k, dt, down) {
    if (!k.air) return false;
    k.jumpT += dt;
    if (!down) k.hold = false;
    if (!k.hold && !k.cut && k.vy > 0 && k.jumpT >= T.minHop) { k.vy *= T.hopCut; k.cut = true; }
    k.vy -= T.gravity * dt;
    k.alt += k.vy * dt;
    if (k.alt <= 0) { k.alt = 0; k.vy = 0; k.air = false; k.surged = false; return true; }
    return false;
  };

  // ---- Foes. box(f, x) gives { x0, x1, lo, hi } at any x, for the game and for the bot.
  SR.swoopAlt = function (f, x) {
    const u = Math.min(1, Math.abs(x - f.aim) / T.swoopSpan);
    return f.low + (T.swoopHigh - f.low) * u * u;
  };
  SR.box = function (f, x) {
    const d = T.foes[f.type];
    if (f.type === 'swoop') { const lo = SR.swoopAlt(f, x); return { x0: x - d.hw, x1: x + d.hw, lo, hi: lo + d.thick }; }
    if (f.type === 'cable') return { x0: x - T.cableHalfW, x1: x + T.cableHalfW, lo: f.lo, hi: f.hi };
    const s = f.scale || 1;   // stage 1's small barricades (spawn.js)
    return { x0: x - d.hw * s, x1: x + d.hw * s, lo: 0, hi: d.hi * s };
  };
  // Screen speed of a foe: left for everything on the road, right for Silt's cables.
  SR.foeVel = (f, w) => (f.type === 'cable' ? T.cableSpeed : -(w.speed + (T.foes[f.type].extra || 0)));
  SR.touches = (kx, alt, b, m = 0) => b.x1 + m > kx - T.kaitoHalfW && b.x0 - m < kx + T.kaitoHalfW && alt < b.hi + m && alt + T.kaitoTall > b.lo - m;

  // ---- The Surge and the arm
  SR.canSurge = w => !w.k.surged && w.numb <= 0;
  function surge(run) {
    const w = run.w;
    SR.startSurge(w.k);
    w.surges++; w.surgeT = T.surgeFxSecs; w.lastSurge = run.time;
    w.scar += T.scarPerSurge; w.scarFlash = 0.4;
    Kit.audio.play('surge'); Kit.audio.play('zap');
    A().burst(w.kx, T.groundY - w.k.alt - 30, { n: 14, colors: ['#f2d21b', '#fff3a8', '#ffffff'], speed: 170, life: 0.4, size: 3, gravity: 60 });
    if (w.scar >= 1) goNumb(run);
  }
  function goNumb(run) {
    const w = run.w;
    w.scar = 1; w.numb = T.numbSecs; w.numbCount++;
    Kit.audio.play('numb');
    A().shake(4, 0.25);
    A().floatText(w.kx, T.groundY - w.k.alt - 90, 'ARM NUMB', '#b9c4e6', 20);
    SR.say(run, SR.WORDS.numb[Math.floor(Math.random() * SR.WORDS.numb.length)], 2.6);
    SR.palOnNumb(run);
  }
  SR.say = (run, line, secs) => run.say(line.who, line.text, secs);
  function deadTap(run) {
    const w = run.w;
    w.deadTap = 0.3;
    Kit.audio.play('denied');
    A().burst(w.kx + 8, T.groundY - w.k.alt - 34, { n: 6, color: '#8d96b5', speed: 60, life: 0.3, size: 2, gravity: 40 });
  }
  function stepScars(w, dt) {
    if (w.scarFlash > 0) w.scarFlash -= dt;
    if (w.deadTap > 0) w.deadTap -= dt;
    if (w.numb > 0) { w.numb -= dt; if (w.numb <= 0) { w.numb = 0; w.scar = T.numbAfter; Kit.audio.play('chime'); } return; }
    w.scar = Math.max(0, w.scar - w.fade * dt);
  }

  // ---- The thumb
  function jump(run) {
    SR.startJump(run.w.k);
    Kit.audio.play('jump');
    A().burst(run.w.kx - 6, T.groundY, { n: 5, color: '#c8bfae', speed: 70, life: 0.25, size: 2.4, gravity: 120, angle: -2.6, spread: 1 });
  }
  SR.control = function (run, pressed, down, dt) {
    const w = run.w, k = w.k;
    if (w.dash) { SR.stepDash(run, dt); return; }
    if (pressed) {
      if (!k.air) jump(run);
      else if (SR.canSurge(w)) { if (!(run.boss && SR.tryCore(run))) surge(run); }
      else { k.buffer = T.bufferSecs; if (w.numb > 0) deadTap(run); }
    }
    if (k.buffer > 0) k.buffer -= dt;
    if (SR.stepBody(k, dt, down)) {
      Kit.audio.play('land');
      A().burst(w.kx, T.groundY, { n: 4, color: '#c8bfae', speed: 50, life: 0.2, size: 2, gravity: 90 });
      if (k.buffer > 0) { k.buffer = 0; jump(run); k.hold = down; }
    }
    if (w.kx !== w.homeX) { w.kx += (w.homeX - w.kx) * Math.min(1, T.returnRate * dt); if (Math.abs(w.homeX - w.kx) < 0.5) w.kx = w.homeX; }
  };
  SR.surge = surge;

  // ---- Getting hurt
  SR.hurt = function (run) {
    const w = run.w, k = w.k, y = T.groundY - k.alt - 34;
    if (w.inv > 0 || w.dash) return;
    if (w.catches > 0) { // Skarn's Catch: he snatches Kaito clear, and it costs nothing.
      w.catches--; run.carry.catchesUsed = (run.carry.catchesUsed || 0) + 1;   // spent for the story run (kit README, run.carry), not just this attempt
      w.catchT = T.catchSecs; w.inv = T.invuln + T.catchSafety;
      k.air = true; k.vy = T.catchBounce; k.cut = true; k.hold = false; k.surged = false;
      Kit.audio.play('growl'); Kit.audio.play('whoosh');
      A().burst(w.kx, y, { n: 12, colors: ['#f2d21b', '#8d93b5'], speed: 130, life: 0.4 });
      A().floatText(w.kx, y - 40, 'CAUGHT', '#f2d21b', 18);
      return;
    }
    w.hits--; w.inv = T.invuln; w.hurtT = T.hurtSecs; w.hitsTaken++;
    Kit.audio.play('hurt');
    A().shake(7, 0.3);
    A().burst(w.kx, y, { n: 18, colors: ['#f0752b', '#ffffff', '#f4c152'], speed: 170, life: 0.45, size: 3 });
    if (w.hits <= 0) run.lose();
  };

  // ---- Everything on the road moves and checks against Kaito.
  function stepFoes(run, dt) {
    const w = run.w, kx = w.kx, alt = w.k.alt;
    for (const f of w.foes) {
      f.x += SR.foeVel(f, w) * dt;
      if (f.done) continue;
      const b = SR.box(f, f.x);
      if (SR.touches(kx, alt, b)) { f.done = true; w.hitBy.push((f.low || '') + f.type + '@' + Math.round(alt)); SR.hurt(run); if (run.over) return; continue; }
      const passed = f.type === 'cable' ? b.x0 > kx + T.kaitoHalfW : b.x1 < kx - T.kaitoHalfW;
      if (passed) { f.done = true; run.addScore(T.scorePerFoe); if (f.type !== 'cable') A().floatText(kx, T.groundY - alt - 84, '+' + T.scorePerFoe, A().PAPER, 13); }
    }
    w.foes = w.foes.filter(f => f.x > -260 && f.x < 1000);
  }
  function stepCoins(run, dt) {
    const w = run.w, cx = w.kx, cy = w.k.alt + T.kaitoTall / 2;
    for (const c of w.coins) {
      c.x -= w.speed * dt;
      const d = Math.hypot(c.x - cx, c.alt - cy);
      if (d < w.reach && d > T.grabRadius && (!c.big || w.k.surged)) { // Salvage Pull. A big cog comes only to a Surge, so the high bait still costs one
        const s = T.pullSpeed * dt / d;
        c.x += (cx - c.x) * s; c.alt += (cy - c.alt) * s;
      }
      if (d < T.grabRadius) {
        c.got = true;
        const v = c.big ? T.bigCoinValue : T.coinValue;
        run.addSalvage(v); run.addScore(T.scorePerCoin * v);
        Kit.audio.play('pickup');
        A().floatText(c.x, T.groundY - c.alt - 8, '+' + v, A().GOLD, c.big ? 18 : 14);
      }
    }
    w.coins = w.coins.filter(c => !c.got && c.x > -60);
  }

  // One whole step of play, in order. Returns early if a catch moment stopped the game.
  SR.step = function (run, dt, pressed, down) {
    const w = run.w;
    SR.control(run, pressed, down, dt);
    stepScars(w, dt);
    if (w.inv > 0) w.inv -= dt;
    if (w.hurtT > 0) w.hurtT -= dt;
    if (w.catchT > 0) w.catchT -= dt;
    if (w.surgeT > 0) w.surgeT -= dt;
    // Echoes behind a Surge, for the look only.
    if (w.surgeT > 0 && (w.echoT -= dt) <= 0) { w.echoT = 0.05; w.echoes.push({ x: w.kx, alt: w.k.alt, age: 0 }); }
    for (const e of w.echoes) e.age += dt;
    w.echoes = w.echoes.filter(e => e.age < 0.24);
    if (w.deadT !== undefined) w.deadT += dt;

    w.speed = run.endless ? Math.min(T.endless.maxSpeed, run.stage.speed + T.endless.ramp * run.time) : run.stage.speed;
    const moved = w.speed * dt;
    w.scroll += moved;
    w.dist += moved / T.metre;
    run.addScore(moved / T.metre);

    // Footsteps
    if (!w.k.air && (w.stepT -= dt) <= 0) { w.stepT = T.stepSecs; Kit.audio.play('step'); }

    if (run.boss) SR.bossStep(run, dt); else SR.spawnStep(run, dt);
    if (run.over) return;
    stepFoes(run, dt);
    if (run.over) return;
    stepCoins(run, dt);
    SR.radioStep(run);
    if (SR.palStep(run, dt)) return;

    if (!run.boss && !run.endless && w.dist >= run.stage.length) {
      run.addSalvage(run.stage.clearSalvage); run.addScore(T.scorePerClear);
      A().burst(w.kx, T.groundY - w.k.alt - 40, { n: 24, colors: ['#f2d21b', '#f4c152', '#ffffff'], speed: 190, life: 0.6 });
      run.win();
    }
    w.testInfo = { hits: w.hits, surges: w.surges, numbCount: w.numbCount, dist: Math.floor(w.dist), hitsTaken: w.hitsTaken, hitBy: w.hitBy.join(' '), bossHp: w.boss ? w.boss.hp : null };
  };
})();
