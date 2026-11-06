// Storm Run boss: Silt on the Hollow hound. One round goes: chase and cables, crouch, lunge past Kaito, rear up with the core open.
// Surge into the core while it's open and the hound staggers; miss it and it lunges back. Three hits (spec). Logic only; hound.js draws it.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const round = b => Math.min(T.bossHits - b.hp, T.bossHits - 1);
  const lerp = (a, b, u) => a + (b - a) * u;

  SR.bossNew = () => ({ hp: T.bossHits, state: 'enter', t: T.bossEnterSecs, total: T.bossEnterSecs, x: T.bossEnterX, alt: 0, flip: false, open: 0, windup: 0, throws: [], throwArm: 0, flash: 0, chaseT: 0 });
  function go(b, state, t) { b.state = state; b.t = t; b.total = t; b.cued = false; }
  // The moment to jump: late in the crouch, so a jump made on the prompt is still in the air when the hound passes.
  SR.jumpNow = b => b.t <= T.jumpCueSecs;
  function cue(b) { if (!b.cued && SR.jumpNow(b)) { b.cued = true; Kit.audio.play('alarm'); } }

  function startChase(run) {
    const b = run.w.boss, r = round(b);
    go(b, 'chase', T.chaseSecs[r]);
    b.chaseT = 0; b.flip = false;
    b.throws = T.cableAt[r].slice();
    if (T.barricadeIn[r]) run.w.foes.push({ type: 'low', x: run.w.kx + run.w.speed * T.barricadeLead + T.barricadeExtra, done: false, aim: run.w.kx });
  }
  function throwCable(run) {
    const w = run.w, b = w.boss, high = run.rng() < T.cableHighChance, c = high ? T.cableHigh : T.cableLow;
    w.foes.push({ type: 'cable', x: b.x + 40, lo: c.lo, hi: c.hi, done: false, aim: 0 });
    Kit.audio.play('throw');
  }

  // Where the hound's hit box is, dt seconds ahead, if it's on a lunge by then. Used by the game and by the bot.
  SR.houndBoxAt = function (b, dt = 0) {
    let from, to, u;
    if (b.state === 'tell' || b.state === 'lunge') { from = T.chaseX; to = T.landX; }
    else if (b.state === 'shut' || b.state === 'back') { from = T.landX; to = T.chaseX; }
    else return null;
    const flying = b.state === 'lunge' || b.state === 'back';
    u = flying ? 1 - (b.t - dt) / b.total : (dt - b.t) / T.lungeSecs;
    if (u < 0 || u > 1) return null;
    const x = lerp(from, to, u), alt = Math.sin(u * Math.PI) * T.lungeArc;
    return { x0: x - T.houndHalfW, x1: x + T.houndHalfW, lo: alt, hi: alt + T.houndTall };
  };

  // Called when the thumb Surges in the air: true if that Surge went into the core.
  SR.tryCore = function (run) {
    const w = run.w, b = w.boss;
    if (b.state !== 'open' || Math.abs(b.x - w.kx) > T.coreReachX) return false;
    SR.surge(run);
    w.dash = { t: 0, x0: w.kx, alt0: w.k.alt, x1: SR.coreX(b) - 14, alt1: SR.coreAlt() - T.kaitoTall / 2 };
    w.inv = Math.max(w.inv, T.dashSecs + T.dashSafety);
    Kit.audio.play('whoosh');
    return true;
  };
  SR.coreX = b => b.x + (b.flip ? -T.coreOffset : T.coreOffset);
  SR.coreAlt = () => Kit.art.has('silt_hound_rear_left') ? T.coreAltArt : T.coreAlt;   // the reared picture stands taller than the code hound

  SR.stepDash = function (run, dt) {
    const w = run.w, d = w.dash, k = w.k;
    d.t += dt;
    const u = Math.min(1, d.t / T.dashSecs);
    w.kx = lerp(d.x0, d.x1, u); k.alt = lerp(d.alt0, d.alt1, u); k.air = true; k.vy = 0;
    if (u >= 1) { w.dash = null; k.vy = T.rebound; k.cut = true; k.hold = false; hitCore(run); }
  };

  function hitCore(run) {
    const w = run.w, b = w.boss, line = SR.WORDS.boss.hit[T.bossHits - b.hp];
    b.hp--; b.flash = 0.5; b.open = 0;
    run.addScore(T.scorePerCore);
    Kit.audio.play('boom'); Kit.audio.play('growl');
    A().shake(10, 0.45);
    A().burst(SR.coreX(b), T.groundY - SR.coreAlt(), { n: 36, colors: ['#ffffff', '#f2d21b', '#fff3a8'], speed: 300, life: 0.6, size: 4 });
    A().floatText(SR.coreX(b), T.groundY - SR.coreAlt() - 40, b.hp ? 'CORE HIT' : 'CORE BROKEN', '#ffffff', 22);
    if (line) SR.say(run, line, 2.4);
    if (b.hp <= 0) go(b, 'fall', T.fallSecs); else go(b, 'stagger', T.staggerSecs);
  }

  SR.bossStep = function (run, dt) {
    const w = run.w, b = w.boss, r = round(b);
    b.t -= dt;
    if (b.flash > 0) b.flash -= dt;
    if (b.throwArm > 0) b.throwArm -= dt;
    const done = b.t <= 0, u = b.total ? 1 - Math.max(0, b.t) / b.total : 1;
    switch (b.state) {
      case 'enter':
        b.x = lerp(T.bossEnterX, T.chaseX, u);
        if (u > 0.3 && !b.spoke) { b.spoke = true; SR.say(run, SR.WORDS.boss.start, 2.8); }
        if (done) startChase(run);
        break;
      case 'chase':
        b.chaseT += dt;
        b.x = T.chaseX + Math.sin(run.time * 2.2) * 10;
        if (b.throws.length && b.chaseT >= b.throws[0] - T.windupSecs && b.windup <= 0) { b.windup = T.windupSecs; b.throwArm = T.windupSecs + 0.25; }
        if (b.windup > 0 && (b.windup -= dt) <= 0) { b.windup = 0; b.throws.shift(); throwCable(run); }
        if (done) { go(b, 'tell', T.tellSecs[r]); b.x = T.chaseX; Kit.audio.play('growl'); }
        break;
      case 'tell':
        cue(b);
        if (done) { go(b, 'lunge', T.lungeSecs); Kit.audio.play('whoosh'); }
        break;
      case 'lunge': case 'back': {
        const box = SR.houndBoxAt(b, 0);
        if (box) { b.x = (box.x0 + box.x1) / 2; b.alt = box.lo; if (SR.touches(w.kx, w.k.alt, box)) SR.hurt(run); }
        if (run.over) return;
        if (done) {
          b.alt = 0;
          if (b.state === 'lunge') { b.x = T.landX; b.flip = true; go(b, 'land', T.landSecs); Kit.audio.play('land'); A().shake(4, 0.2); }
          else { b.x = T.chaseX; startChase(run); }
        }
        break;
      }
      case 'land':
        if (done) { go(b, 'open', T.openSecs[r]); Kit.audio.play('clang'); if (w.numb > 0) SR.say(run, SR.WORDS.boss.numbOpen, 2.2); }
        break;
      case 'open':
        b.open = Math.min(1, b.open + dt * 6);
        if (done) { go(b, 'shut', T.shutSecs); b.open = 0; Kit.audio.play('clang'); SR.say(run, SR.WORDS.boss.miss, 2); }
        break;
      case 'shut':
        cue(b);
        if (done) { go(b, 'back', T.lungeSecs); Kit.audio.play('whoosh'); Kit.audio.play('growl'); }
        break;
      case 'stagger':
        if (done) { go(b, 'retreat', T.retreatSecs); Kit.audio.play('whoosh'); }
        break;
      case 'retreat':   // a high bound over Kaito's head, back to the chase; no hit box
        b.x = lerp(T.landX, T.chaseX, u); b.alt = Math.sin(u * Math.PI) * T.retreatHeight;
        if (done) { b.alt = 0; b.x = T.chaseX; startChase(run); }
        break;
      case 'fall':
        b.x -= w.speed * T.fallDrift * dt;
        if (done) {
          run.addSalvage(run.stage.clearSalvage); run.addScore(T.scorePerClear);
          run.win();
        }
        break;
    }
  };
})();
