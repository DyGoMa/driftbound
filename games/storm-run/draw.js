// Storm Run: one frame of play. Drawing only: nothing in the run changes here.
window.SR = window.SR || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  const KAITO_KEYS = { run: 'kaito_run', jump: 'kaito_jump', surge: 'kaito_surge', hurt: 'kaito_hurt', fall: 'kaito_jump', down: 'kaito_hurt' };

  const kaitoH = () => A().heightOf('kaito', T.pxPerCm);
  const SKARN_BACK = 86;   // looks only: px from the screen's left edge to Skarn's middle at his smallest room (his tail reaches about 80 back)

  function kaitoPose(run) {
    const w = run.w, k = w.k;
    if (run.over === 'lose') return 'down';
    if (w.hurtT > 0) return 'hurt';
    if (w.dash || w.surgeT > 0) return 'surge';
    if (k.air) return k.vy < -260 ? 'fall' : 'jump';
    return 'run';
  }
  // The numb arm hangs dead at his side, whatever the rest of him is doing.
  function numbPose(name, t) {
    const p = Object.assign({}, A().POSES[name](t));
    p.armN = [0.1 + Math.sin(t * 12) * 0.08, 0.1];
    return p;
  }
  function drawKaito(c, run, x, y) {
    const A_ = A(), w = run.w, t = run.time, pose = kaitoPose(run), h = kaitoH(), key = KAITO_KEYS[pose];
    if (A_.has(key)) {
      if (pose === 'down') { c.save(); c.translate(x, y - 15); c.rotate(-1.42); A_.draw(c, key, 0, 0, 0, h); c.restore(); return; }   // no picture of him lying down: the hurt one, laid flat
      A_.draw(c, key, pose === 'run' ? A_.frameAt(key, t) : 0, x, y, h);
      return;
    }
    if (pose === 'surge') A_.person(c, 'kaito', { x, y, h, pose, t, glow: 1.6 });
    else if (w.numb > 0 && pose !== 'down' && pose !== 'hurt') A_.person(c, 'kaito', { x, y, h, pose: numbPose(pose, t), t });
    else A_.personFast(c, 'kaito', { x, y, h, pose, t });
  }

  function barricade(c, tall, x) {
    const A_ = A(), g = T.groundY;
    if (A_.draw(c, tall ? 'barricade_tall' : 'barricade_low', 0, x, g, tall ? 132 : 36)) return;
    const b = tall ? SR.bake('tall', 80, 160, 40, 150, cc => paintTall(cc)) : SR.bake('low', 80, 60, 40, 50, cc => paintLow(cc));
    SR.stamp(c, b, x, g);
  }
  function stripes(c, x, y, w, h) {
    const A_ = A();
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], A_.GOLD, 0);
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    for (let i = -2; i < w / 8 + 2; i++) A_.poly(c, [[x + i * 8, y + h], [x + i * 8 + 4, y + h], [x + i * 8 + 4 + h, y], [x + i * 8 + h, y]], A_.INK, 0);
    c.restore();
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], null, 1.6);
  }
  function paintLow(c) { // a sawhorse with a hazard board: a hop clears it
    const A_ = A();
    A_.line(c, -14, 0, -6, -28, 4, A_.INK); A_.line(c, -14, 0, -6, -28, 2, '#6d6f7b');
    A_.line(c, 14, 0, 6, -28, 4, A_.INK); A_.line(c, 14, 0, 6, -28, 2, '#6d6f7b');
    A_.line(c, -18, 0, -3, -28, 4, A_.INK); A_.line(c, -18, 0, -3, -28, 2, '#595b66');
    A_.line(c, 18, 0, 3, -28, 4, A_.INK); A_.line(c, 18, 0, 3, -28, 2, '#595b66');
    stripes(c, -20, -32, 40, 9);
    A_.line(c, -18, -14, 18, -14, 3.4, A_.INK); A_.line(c, -18, -14, 18, -14, 1.6, '#6d6f7b');
    A_.ellipse(c, -19, -3, 5, 3.4, '#7d6f5a', 1.2); A_.ellipse(c, 19, -3, 5, 3.4, '#7d6f5a', 1.2);
  }
  function paintTall(c) { // stacked steel plates, spikes, a chain and the Sever's mark: takes a Surge
    const A_ = A(), steel = '#73767f';
    A_.slab(c, -18, -78, 36, 78, steel, 2);
    A_.slab(c, -14, -116, 28, 40, A_.shade(steel, 0.88), 2);
    stripes(c, -18, -20, 36, 9);
    stripes(c, -14, -88, 28, 7);
    SR.badge(c, 0, -52, 7);
    for (let i = -1; i <= 1; i++) A_.poly(c, [[i * 9 - 4, -116], [i * 9, -131], [i * 9 + 4, -116]], '#8e919a', 1.7);
    [[-14, -70], [14, -70], [-14, -30], [14, -30]].forEach(p => A_.circle(c, p[0], p[1], 1.4, A_.INK, 0));
    A_.poly(c, [[-24, 0], [-18, -18], [-18, 0]], '#55575f', 1.6); A_.poly(c, [[24, 0], [18, -18], [18, 0]], '#55575f', 1.6);
    A_.ellipse(c, -21, -3, 6, 3.6, '#7d6f5a', 1.2); A_.ellipse(c, 21, -3, 6, 3.6, '#7d6f5a', 1.2);
  }

  function drawFoes(c, run) {
    const A_ = A(), w = run.w, g = T.groundY, t = run.time, tH = A_.heightOf('trooper', T.pxPerCm);
    for (const f of w.foes) {
      if (f.x < Kit.view.left - 80 || f.x > Kit.view.right + 80) continue;
      if (f.type === 'low' || f.type === 'tall') barricade(c, f.type === 'tall', f.x);
      else if (f.type === 'trooper') {
        if (!A_.draw(c, 'trooper_run', A_.frameAt('trooper_run', t + f.x * 0.003), f.x, g, tH, true))
          A_.personFast(c, 'trooper', { x: f.x, y: g, h: tH, pose: 'run', t: t + f.x * 0.003, flip: true });
      } else if (f.type === 'swoop') {
        const b = SR.box(f, f.x), y = g - b.lo - 11, dives = f.low < T.swoopOverLow;
        // A dive throws a hot warning on the road, and the Hollow tips nose-down as it drops.
        A_.ellipse(c, f.x, g + 8, 22, 3.4, dives ? 'rgba(240,117,43,.8)' : 'rgba(12,14,30,.45)', 0);
        SR.drawSwoop(c, f.x, y, t + f.x * 0.002, (SR.swoopAlt(f, f.x + 12) - SR.swoopAlt(f, f.x)) / 12);
      } else if (f.type === 'cable') drawCable(c, run, f);
    }
  }

  // A hooked cable from Silt's hand, the hook glowing like a bond-cutter.
  function drawCable(c, run, f) {
    const A_ = A(), b = run.w.boss, g = T.groundY, y = g - (f.lo + f.hi) / 2, up = b.throwArm > 0, sx = b.x + (up ? -46 : 10), sy = g - b.alt - (up ? 138 : 92);   // from his hand
    if (f.x < sx) return;
    c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + f.x) / 2, y + 26, f.x - 8, y);
    c.lineWidth = 3.4; c.strokeStyle = A_.INK; c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = '#8a8f9b'; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(f.x, y, 11, 0, 7); c.fill();
    A_.poly(c, [[f.x - 10, y - 3], [f.x + 6, y - 5], [f.x + 12, y + 2], [f.x + 5, y + 7], [f.x + 7, y + 1], [f.x - 10, y + 3]], '#f1f4f8', 1.6);
  }

  function drawPal(c, run) {
    const p = run.w.pal;
    if (!p || !window.DRIFT_PALS) return;
    const pal = DRIFT_PALS.get(p.id), s = p.id === 'fizzlet' ? 0.46 : 0.36, bob = Math.sin(run.time * 6) * (p.id === 'fizzlet' ? 1 : 5);
    c.save();
    c.translate(p.x - 50 * s, T.groundY - p.alt - 92 * s + bob);
    c.scale(s, s);
    pal.draw(c);
    c.restore();
  }

  SR.render = function (c, run, view) {
    const A_ = A(), w = run.w, t = run.time, g = T.groundY, which = run.endless ? 2 : run.index;
    SR.drawScene(c, view, w.scroll, t, which, run.stage);
    const k = w.k, y = g - k.alt;

    // Silt, a long way off on the rooftops, keeping pace (stage 4).
    if (run.stage.silt) {
      const u = (run.time * 0.04) % 1, sx = view.left + 40 + u * 240;
      c.globalAlpha = 0.85;
      c.save(); c.translate(sx, g - 8 - Math.abs(Math.sin(t * 6)) * 4); c.scale(0.34, 0.34);
      SR.drawHound(c, { state: 'chase', x: 0, alt: TUNE.groundY, flip: false, throwArm: 0, flash: 0, t: 1, total: 1 }, t);
      c.restore();
      c.globalAlpha = 1;
    }

    for (const co of w.coins) if (co.x < view.right + 20) A_.salvage(c, co.x, g - co.alt, co.big ? 11 : 8, t * 3 + co.x * 0.02);
    // Skarn glides above and behind (Dylan's answer), dipping to catch him when Skarn's Catch fires.
    const dive = w.catchT > 0 ? Math.sin((w.catchT / T.catchSecs) * Math.PI) : 0;
    // He stays whole on screen, however little room there is behind Kaito, and clear of the score above him.
    const sx = Math.max(view.left + SKARN_BACK, w.kx - 82) + dive * 60, sy = g - 182 - k.alt * 0.12 + Math.sin(t * 2.2) * 6 + dive * (116 + k.alt * 0.12 - k.alt);
    if (w.boss && (w.boss.state === 'chase' || w.boss.state === 'enter' || w.boss.state === 'tell')) SR.drawHound(c, w.boss, t);
    A_.ellipse(c, w.kx, g + 7, 19 - k.alt * 0.05, 3.4, 'rgba(12,14,30,.45)', 0);
    drawFoes(c, run);
    drawPal(c, run);
    SR.drawSkarn(c, sx, sy, t, { dim: w.numb > 0 });
    if (w.surgeT > 0) SR.bolt(c, sx + 10, sy - 30, w.kx + 16, y - 50, { n: 6, jag: 10, w: 2 });

    // Echoes behind a Surge, then Kaito.
    for (const e of w.echoes) {
      c.globalAlpha = 0.34 * (1 - e.age / 0.24);
      if (!A_.draw(c, 'kaito_surge', 0, e.x - e.age * 300, g - e.alt, kaitoH())) A_.personFast(c, 'kaito', { x: e.x - e.age * 300, y: g - e.alt, h: kaitoH(), pose: 'surge', t });
      c.globalAlpha = 1;
    }
    if (!(w.inv > 0 && Math.floor(t * 18) % 2 && !w.dash)) drawKaito(c, run, w.kx, y);
    if (w.surgeT > 0) SR.bolt(c, w.kx + 16, y - 50, w.kx - 34, y - 34, { n: 4, jag: 5, w: 1 });
    if (w.numb > 0 && Math.random() < 0.3) SR.bolt(c, w.kx + 2, y - 50, w.kx + 10, y - 26, { n: 3, jag: 3, w: 1, color: '#9fb0e8' });

    // The hound in front of him when it's on him or past him.
    if (w.boss && !(w.boss.state === 'chase' || w.boss.state === 'enter' || w.boss.state === 'tell')) SR.drawHound(c, w.boss, t);
    if (w.boss && w.boss.state === 'fall') SR.drawThrownSilt(c, w.boss);
    if (w.boss && w.boss.state === 'open') {
      c.globalAlpha = 0.85 + Math.sin(t * 20) * 0.15;
      A_.text(c, w.numb > 0 ? 'ARM NUMB!' : (k.air && SR.canSurge(w) ? 'SURGE!' : 'JUMP, THEN SURGE!'), w.kx, y - 100, { size: 20, color: w.numb > 0 ? '#9fb0e8' : '#f2d21b', align: 'center', lw: 4 });
      c.globalAlpha = 1;
    }
    if (w.dash) SR.bolt(c, w.dash.x0, g - w.dash.alt0 - 40, w.kx, y - 30, { n: 8, jag: 12, w: 3 });
    // Warning line on the road before a lunge
    if (w.boss && (w.boss.state === 'tell' || w.boss.state === 'shut')) {
      const left = w.boss.state === 'tell';
      // The key warning, on a plate above his head, so the orange sky can't swallow it and it never covers his face. Clear of the boss's pips at the top.
      // WAIT with a draining bar through the crouch, then the plate flips to gold at the moment to jump (boss.js).
      const py = Math.max(30, y - 130), go = SR.jumpNow(w.boss), hw = go ? 70 : 42;
      c.globalAlpha = 0.94 + Math.sin(t * 24) * 0.06;
      A_.poly(c, [[w.kx - hw + 5, py], [w.kx + hw + 5, py], [w.kx + hw - 5, py + 30], [w.kx - hw - 5, py + 30]], go ? '#f2d21b' : A_.NIGHT, 2, go ? A_.INK : '#8d93b5');
      if (go) A_.text(c, 'FULL JUMP!', w.kx, py + 15, { size: 23, color: A_.NIGHT, align: 'center', ink: false });
      else {
        const wait = 64 * (w.boss.t - T.jumpCueSecs) / (w.boss.total - T.jumpCueSecs);
        A_.text(c, 'WAIT', w.kx, py + 12, { size: 18, color: A_.PAPER, align: 'center', lw: 3 });
        A_.poly(c, [[w.kx - 32, py + 23], [w.kx - 32 + wait, py + 23], [w.kx - 32 + wait, py + 27], [w.kx - 32, py + 27]], '#f2d21b', 0);
      }
      c.globalAlpha = 0.6 + Math.sin(t * 24) * 0.3;
      A_.poly(c, [[left ? 120 : view.w - 60, g + 3], [left ? view.w - 60 : 120, g + 3], [left ? view.w - 60 : 120, g + 8], [left ? 120 : view.w - 60, g + 8]], A_.ORANGE, 0);
      c.globalAlpha = 1;
    }
    SR.drawRain(c, view, run.stage, t);

    // The numb arm dulls the whole picture a little.
    if (w.numb > 0) { c.fillStyle = 'rgba(30,40,80,.18)'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); }
  };

  // The title screen: the Pinhold picture, with Kaito and Skarn running under it. If the picture can't load, the code island shows.
  let pic = null;
  SR.titleDraw = function (c, view, t) {
    const A_ = A();
    if (!pic) { pic = new Image(); pic.src = Kit.url('art/site/pinhold-v1-web.webp'); }
    if (pic.complete && pic.naturalWidth) {
      const W = view.right - view.left, H = view.bottom - view.top, s = Math.max(W / pic.naturalWidth, H / pic.naturalHeight);
      c.drawImage(pic, view.left + (W - pic.naturalWidth * s) / 2, view.top + (H - pic.naturalHeight * s) / 2, pic.naturalWidth * s, pic.naturalHeight * s);
    } else SR.drawScene(c, view, t * 200, t, 0, null);
    const g = view.bottom - 22, h = 74, kx = view.left + (view.right - view.left) * 0.38;
    SR.strip(c, SR.titleRoad(), view, t * 220, g);
    if (!A_.draw(c, 'kaito_run', A_.frameAt('kaito_run', t), kx, g, h)) A_.personFast(c, 'kaito', { x: kx, y: g, h, pose: 'run', t });
    SR.drawSkarn(c, kx - 136, g - 52 + Math.sin(t * 2.2) * 4, t, {});   // far enough behind that his front paw clears Kaito
  };
  SR.titleRoad = () => SR.bake('titleRoad', 320, 40, 0, 0, cc => {
    const A_ = A();
    A_.poly(cc, [[0, 0], [320, 0], [320, 40], [0, 40]], '#77737a', 0);
    for (let i = 0; i < 4; i++) A_.poly(cc, [[i * 80 + 8, 5], [i * 80 + 46, 5], [i * 80 + 45, 8], [i * 80 + 7, 8]], '#d9d3c4', 0);
    A_.poly(cc, [[0, 14], [320, 14], [320, 40], [0, 40]], '#493a48', 0);
    A_.line(cc, -2, 0, 322, 0, 2); A_.line(cc, -2, 14, 322, 14, 1.6);
  });
})();
