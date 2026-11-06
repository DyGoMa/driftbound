// Aki Dash game loop: run, double-jump over Glitchlings, grab Star Shards.
(function () {
  const T = window.TUNING, Cast = window.HoshiCast, cv = document.getElementById('game'), ctx = cv.getContext('2d');
  let W = 640, H = 360, k = 1, state = 'title', stateT = 0, t = 0;
  let hero, obs, shards, parts, speed, dist, elapsed, runShards, spawnIn, shake, result, held;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; k = cv.height / H; W = cv.width / k;
  }
  function reset() {
    hero = { y: T.groundY, vy: 0, jumps: 0, onGround: true, mochiY: T.groundY - 80 };
    obs = []; shards = []; parts = []; speed = T.startSpeed; dist = 0; elapsed = 0; runShards = 0; spawnIn = 1.2; shake = 0;
  }
  function setState(s) { state = s; stateT = 0; }

  function press() {
    if (state === 'title') { reset(); setState('play'); return; }
    if (state === 'over') { if (stateT > 0.6) { reset(); setState('play'); } return; }
    if (state !== 'play' || hero.jumps >= T.maxJumps) return;
    hero.vy = -(hero.jumps === 0 ? T.jumpSpeed : T.doubleJumpSpeed);
    (hero.jumps === 0 ? SFX.jump : SFX.jump2)(); hero.jumps++; hero.onGround = false;
    if (hero.jumps === 2) burst(T.heroX, hero.y, '#2ec4b6', 8);
  }
  function release() { if (state === 'play' && hero.vy < 0) hero.vy *= T.jumpCut; }

  function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 220, life: 0.5, color });
  }

  function spawn() {
    const x = W + 40, roll = Math.random();
    let type = 'glitch';
    if (elapsed > T.flyerAfter && roll < 0.25) type = 'flyer';
    else if (elapsed > T.tallStackAfter && roll < 0.5) type = 'stack';
    obs.push({ type, x, seed: Math.random() * 10, phase: Math.random() * 6 });
    if (Math.random() < T.shardChance) { // arc of shards over the obstacle
      const n = 3 + Math.floor(Math.random() * 3), top = type === 'stack' ? 150 : 105;
      for (let i = 0; i < n; i++) { const f = n === 1 ? 0.5 : i / (n - 1);
        shards.push({ x: x - 40 + f * 80, y: T.groundY - 40 - Math.sin(f * Math.PI) * (top - 40), got: false }); }
    }
    const gap = T.spawnGapMax - (T.spawnGapMax - T.spawnGapMin) * Math.min(1, (speed - T.startSpeed) / (T.maxSpeed - T.startSpeed));
    spawnIn = gap * (0.8 + Math.random() * 0.5);
  }
  function obsBox(o) { // returns [left, top, right, bottom] and the draw base y
    const s = T.hitboxShrink;
    if (o.type === 'flyer') { const by = T.groundY - 62 + Math.sin(t * 2.4 + o.phase) * 26; return { by, b: [o.x - 14 * s, by - 30 + 8 * (1 - s), o.x + 14 * s, by - 2] }; }
    const h = o.type === 'stack' ? 58 : 30;
    return { by: T.groundY, b: [o.x - 14 * s, T.groundY - h + 6 * (1 - s), o.x + 14 * s, T.groundY] };
  }
  function heroBox() { const s = T.hitboxShrink; return [T.heroX - 10 * s, hero.y - 66 * T.heroScale * (0.55 + s * 0.45), T.heroX + 10 * s, hero.y - 4]; }
  function overlap(a, b) { return a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1]; }

  function update(dt) {
    t += dt; stateT += dt;
    if (state === 'dying') { hero.vy += T.gravity * dt; hero.y = Math.min(T.groundY, hero.y + hero.vy * dt); if (stateT > 0.9) { setState('over'); } }
    parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 600 * dt; p.life -= dt; }); parts = parts.filter(p => p.life > 0);
    shake = Math.max(0, shake - dt * 3);
    if (state !== 'play') return;
    elapsed += dt; speed = Math.min(T.maxSpeed, speed + T.speedRamp * dt); const dx = speed * dt; dist += dx;
    hero.vy += T.gravity * dt; hero.y += hero.vy * dt;
    if (hero.y >= T.groundY) { if (!hero.onGround) burst(T.heroX, T.groundY, '#ff9fc3', 4); hero.y = T.groundY; hero.vy = 0; hero.jumps = 0; hero.onGround = true; }
    hero.mochiY += ((hero.y - 82) - hero.mochiY) * Math.min(1, dt * 4);
    spawnIn -= dt; if (spawnIn <= 0) spawn();
    obs.forEach(o => o.x -= dx); obs = obs.filter(o => o.x > -60);
    shards.forEach(s => s.x -= dx); shards = shards.filter(s => s.x > -30 && !s.got);
    const hb = heroBox();
    for (const s of shards) if (overlap(hb, [s.x - 10, s.y - 10, s.x + 10, s.y + 10])) { s.got = true; runShards++; SFX.shard(); burst(s.x, s.y, '#ffd75e', 6); }
    for (const o of obs) if (overlap(hb, obsBox(o).b)) { die(); break; }
  }
  function score() { return Math.floor(dist * T.scorePerPixel + runShards * T.scorePerShard); }
  function die() {
    SFX.hit(); shake = 1; hero.vy = -380; burst(T.heroX, hero.y - 30, '#ff2e9a', 14);
    result = HoshiSave.finishRun('aki-dash', score(), runShards); setState('dying');
  }

  function text(str, x, y, size, color, align) {
    ctx.font = `900 ${size}px "M PLUS Rounded 1c", system-ui, sans-serif`; ctx.textAlign = align || 'center';
    ctx.lineWidth = size / 5; ctx.strokeStyle = '#1d1430'; ctx.strokeText(str, x, y); ctx.fillStyle = color; ctx.fillText(str, x, y);
  }
  function render() {
    ctx.setTransform(k, 0, 0, k, 0, 0);
    if (shake > 0) ctx.translate((Math.random() - 0.5) * 10 * shake, (Math.random() - 0.5) * 10 * shake);
    drawWorld(ctx, W, H, dist || t * 40, t, T.groundY);
    if (state === 'title') return drawTitle();
    for (const s of shards) Cast.drawShard(ctx, s.x, s.y, 1, t);
    for (const o of obs) { const { by } = obsBox(o); Cast.drawGlitchling(ctx, o.x, by, 1, t, o.seed);
      if (o.type === 'stack') Cast.drawGlitchling(ctx, o.x, by - 28, 1, t, o.seed + 3); }
    Cast.drawMochi(ctx, T.heroX - 46, hero.mochiY, 0.8, t);
    const pose = state === 'play' ? (hero.onGround ? 'run' : 'jump') : 'hurt';
    Cast.drawHero(ctx, 'aki', T.heroX, hero.y, T.heroScale, t, pose);
    for (const p of parts) { ctx.globalAlpha = Math.max(0, p.life * 2); ctx.fillStyle = p.color; ctx.fillRect(p.x - 2, p.y - 2, 4, 4); } ctx.globalAlpha = 1;
    text(String(score()), 16, 36, 26, '#ffffff', 'left');
    Cast.drawShard(ctx, W - 70, 27, 0.9, t); text('× ' + runShards, W - 16, 36, 22, '#ffd75e', 'right');
    if (state === 'over') drawOver();
  }
  function drawTitle() {
    ctx.fillStyle = 'rgba(18,12,51,0.35)'; ctx.fillRect(0, 0, W, H);
    text('AKI DASH', W / 2, 92, 54, '#ff8c2e');
    text('Cabinet #1 · Hoshi Arcade', W / 2, 122, 16, '#ffffff');
    Cast.drawHero(ctx, 'aki', W / 2 - 20, T.groundY, 1.5, t, 'idle');
    Cast.drawMochi(ctx, W / 2 + 50, T.groundY - 110, 1.1, t);
    Cast.drawGlitchling(ctx, W / 2 + 140, T.groundY, 1.2, t, 1);
    text('"The Static got into this cabinet! Run, Aki!" — Mochi', W / 2, 156, 13, '#ffd1e3');
    if (Math.sin(t * 5) > -0.3) text('TAP / SPACE TO RUN', W / 2, 344, 18, '#ffd75e');
  }
  function drawOver() {
    ctx.fillStyle = 'rgba(18,12,51,0.7)'; ctx.fillRect(0, 0, W, H);
    text(result.newBest ? 'NEW BEST!' : 'GLITCHED!', W / 2, 90, 44, result.newBest ? '#ffd75e' : '#ff2e9a');
    text('Score ' + score() + '   ·   Best ' + result.best, W / 2, 140, 20, '#ffffff');
    text('+' + runShards + ' Star Shards  (arcade total ' + result.total + ')', W / 2, 172, 17, '#ffd75e');
    Cast.drawBust(ctx, 'aki', W / 2, 290, 1.7, t);
    if (stateT > 0.6 && Math.sin(t * 5) > -0.3) text('TAP TO RUN AGAIN', W / 2, 340, 18, '#ffd75e');
  }

  let last = performance.now();
  function frame(now) { const dt = Math.min(0.033, (now - last) / 1000); last = now; update(dt); render(); requestAnimationFrame(frame); }
  addEventListener('resize', resize); resize(); reset();
  cv.addEventListener('pointerdown', e => { e.preventDefault(); held = true; press(); });
  addEventListener('pointerup', () => { if (held) release(); held = false; });
  addEventListener('keydown', e => { if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); if (!e.repeat) press(); } });
  addEventListener('keyup', e => { if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) release(); });
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  window.__akiDash = { get state() { return state; }, press, release, score, get hero() { return hero; } }; // test hook
  requestAnimationFrame(frame);
})();
