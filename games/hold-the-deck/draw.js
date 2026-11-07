// Hold the Deck: one frame of play. Drawing only: nothing in the run changes here.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const P = (k, y) => [T.midX + k * HD.laneW(y), y];

  // Everything standing on the deck, far to near.
  function drawThings(c, run, view, t) {
    const A_ = A(), w = run.w, b = w.boss, list = [];
    for (const f of w.foes) { const y = HD.yOf(f.d); list.push({ y, draw: () => { A_.ellipse(c, HD.laneX(f.laneF, y), y, 15 * HD.scaleAt(y) * 2, 4 * HD.scaleAt(y) * 2, 'rgba(10,8,18,.42)', 0); HD.drawFoe(c, f, y, HD.heightAt(T.foes[f.type].cm, y), t); } }); }
    for (const k of w.walls) { const y = HD.yOf(k.d); list.push({ y, draw: () => HD.drawCrate(c, HD.laneX(k.lane, y), y, HD.scaleAt(y) * 1.7) }); }
    if (w.grist) { const d = Math.max(0.02, w.grist.d), y = HD.yOf(d); list.push({ y, draw: () => HD.drawGristBack(c, HD.laneX(w.grist.lane, y), y, 150 * HD.scaleAt(y) * 1.9, t) }); }
    if (b) {
      if (b.paw) { const y = HD.yOf(b.paw.d); list.push({ y, draw: () => HD.drawPaw(c, HD.laneX(b.paw.lane, y), y, 112 * HD.scaleAt(y) * 2.2, b.paw.flash > 0) }); }
      if (b.state !== 'under' && b.state !== 'dive') { const y = bearY(b); list.push({ y, draw: () => drawBearNow(c, run, y, t) }); }
    }
    if (w.pal) list.push({ y: palY(w), draw: () => drawPal(c, run, t) });
    const by = HD.yOf(T.bramD);
    if (!talkBoxHidesBram()) list.push({ y: by, draw: () => drawBramNow(c, run, by, t) });
    list.sort((p, q) => p.y - q.y).forEach(i => i.draw());
    for (const k of w.debris) HD.drawFlung(c, k);
  }

  // On a short screen a talk scene's box covers all of Bram but the top of his head, which reads as a mistake. Leave him out of that shot. Looks only: measured at 320x568 and 375x553; 360x640 and up show enough of him.
  const talkBoxHidesBram = () => /talk/.test(Kit.ui.screen) && window.innerHeight < 640;

  function bearY(b) {
    if (b.state === 'burst') return HD.yOf(T.boss.standD);
    return HD.yOf(b.d);
  }
  function drawBearNow(c, run, y, t) {
    const w = run.w, b = w.boss, x = HD.laneX(b.laneF, y);
    const h = 150 * (HD.scaleAt(y) / HD.scaleAt(HD.yOf(T.boss.standD)));
    let pose = 'stand', yy = y;
    if (b.state === 'burst') {   // up through the deck, between the planks at the back of the hole and the planks at the front
      const u = Math.min(1, b.t / T.boss.burstSecs), s = HD.scaleAt(y) * 2.6;
      yy = y + (1 - u) * (1 - u) * 130; pose = 'roar';
      HD.drawBreachBack(c, x, y, s);
      c.save(); HD.clipBreach(c, x, y, s); HD.drawBear(c, x, yy, h, pose, {}); c.restore();
      HD.drawBreachFront(c, x, y, s);
      return;
    }
    const warned = w.warns.find(k => k.kind === 'swipe');
    if (w.warns.some(k => k.kind === 'volley')) pose = 'roar';
    else if (warned) pose = warned.lane === 0 ? 'left' : warned.lane === 2 ? 'right' : (b.raised < 0 ? 'left' : 'right');
    if (b.state === 'open' || b.state === 'fallen') pose = 'open';
    if (b.state === 'run' || w.warns.some(k => k.kind === 'charge')) pose = 'roar';
    if (b.state === 'collapse') pose = 'down';
    if (b.state === 'collapse') A().ellipse(c, x, y, h * 0.42, h * 0.08, 'rgba(10,8,18,.5)', 0);
    HD.drawBear(c, x, yy, h, pose, { flash: b.flash > 0, t });
    // The chain from the collar to the deck, until it goes (phase 3).
    if (b.chainOn && b.state !== 'burst' && b.state !== 'collapse') {
      const cy = yy - h * 0.58, ax = T.midX - 118, ay = HD.yOf(0.02);
      c.beginPath(); c.moveTo(x, cy); c.quadraticCurveTo((x + ax) / 2, Math.max(cy, ay) + 44, ax, ay);
      c.lineWidth = 4.4; c.strokeStyle = A().INK; c.stroke(); c.lineWidth = 2; c.strokeStyle = '#7b7e88'; c.setLineDash([5, 4]); c.stroke(); c.setLineDash([]);
    }
    if (b.state === 'open' && !w.ironOn) {   // the target. Plain to read: this lane, now.
      const u = b.t / b.open, py = Math.max(96, yy - h * 1.06), px = HD.laneX(b.lane, yy);
      const here = HD.inLane(w, b.lane);
      HD.plate(c, px, py, here ? 'HIT THE CORE!' : 'GET OVER THERE!', here, Math.max(0, 1 - u));
    }
  }

  // Bram, with everything he's doing and everything it's cost him.
  function drawBramNow(c, run, y, t) {
    const A_ = A(), w = run.w, iron = run.carry.iron || 0, h = HD.heightAt(198, y), x = HD.laneX(w.lanePos, y);
    let pose = 'idle', u = 0, lunge = 0, yy = y;
    if (run.over === 'lose') pose = 'down';
    else if (w.ironOn) pose = 'iron';
    else if (w.hurtT > 0) pose = 'hurt';
    else if (w.lungeT > 0) { const p = 1 - w.lungeT / T.lungeSecs; pose = 'swing'; u = p; lunge = Math.sin(p * Math.PI); yy = y - lunge * 18; }
    const moving = w.lanePos !== w.target, step = moving ? Math.sin(t * 18) : 0;
    // A slow, stiff walk shows the iron too: less bounce the greyer he gets, and a lurch at the end.
    const lean = moving ? (1 - iron * 0.7) : 0;
    A_.ellipse(c, x, y + 2, 38, 8, 'rgba(10,8,18,.45)', 0);
    if (!(w.inv > 0 && Math.floor(t * 16) % 2 && pose !== 'hurt' && !run.over)) {
      if (pose === 'swing') swoosh(c, x, yy - h * 0.72, h, u);
      HD.drawBram(c, run, x, yy, h * (1 - lunge * 0.05), { view: 'back', pose, u, step: step * lean, t, iron });
    }
    if (w.ironOn) {
      c.globalAlpha = 0.5 + 0.3 * Math.sin(t * 16);
      A_.ellipse(c, x, y - h * 0.5, h * 0.42, h * 0.6, null, 2.4, '#ff9a4a');
      c.globalAlpha = 1;
      A_.text(c, 'IRON', x, y - h - 12, { size: 18, color: '#ffb27a', align: 'center' });
    }
    if (w.eatT > 0) { c.globalAlpha = Math.min(1, w.eatT * 2); for (let i = 0; i < 3; i++) { const sy = y - h * 0.9 - ((t * 40 + i * 18) % 34); A_.ellipse(c, x - 10 + i * 10 + Math.sin(t * 5 + i) * 3, sy, 4, 6, 'rgba(255,255,255,.55)', 0); } c.globalAlpha = 1; }
    // The thumb's going down: a little ring shows Iron's about to take.
    const I = Kit.input;
    if (I.down && w.holdOk && !w.ironOn && !HD.locked(run) && !moving && I.held > 0.04) {
      const f = Math.min(1, I.held / T.holdSecs);
      c.beginPath(); c.arc(x, y - h * 0.55, 30, -1.57, -1.57 + f * 6.283); c.lineWidth = 3.4; c.strokeStyle = '#ff9a4a'; c.stroke();
    }
  }
  function swoosh(c, x, y, h, u) {   // the arc of the hammer
    const r = h * 0.55, a1 = -Math.PI * Math.min(1, u * 1.2);
    c.globalAlpha = (1 - u) * 0.9;
    c.beginPath(); c.arc(x, y + h * 0.12, r, 0, a1, true); c.lineWidth = 7; c.strokeStyle = '#ffffff'; c.lineCap = 'round'; c.stroke();
    c.globalAlpha = 1;
  }

  const palY = w => (w.pal.id === 'rivetling' ? HD.yOf(T.bramD - 0.01) : HD.yOf(T.bramD));
  function drawPal(c, run, t) {
    const w = run.w, p = w.pal, y = palY(w);
    if (!window.DRIFT_PALS) return;
    const pal = DRIFT_PALS.get(p.id), s = 0.5, u = Math.min(1, p.t / p.secs);
    const x = p.id === 'rivetling' ? HD.laneX(p.lane, y) + p.side * (1 - u) * 150 + p.side * 40 * (u) : HD.laneX(p.lane, y) + Math.sin(t * 3) * 5;
    c.save(); c.translate(x - 50 * s, y - 88 * s + Math.abs(Math.sin(t * (p.id === 'rivetling' ? 8 : 5))) * -3); c.scale(s, s); pal.draw(c); c.restore();
  }

  HD.render = function (c, run, view) {
    const A_ = A(), w = run.w, n = w.look, t = run.time, b = w.boss;
    HD.drawSky(c, view, n);
    if (run.stage.hekka && !run.over) HD.drawHekka(c, T.midX + 86, T.farY - 18, 62);   // on the far rail, left of the pause button
    HD.drawDeck(c, n);
    if (b && b.state === 'collapse') HD.drawHekka(c, T.midX + 40, HD.yOf(0.1), 60);
    if (b) for (const h of b.holes) { const y = HD.yOf(h.d), x = HD.laneX(h.lane, y); if (h.breach) { const s = HD.scaleAt(y) * 2.6; HD.drawBreachBack(c, x, y, s); HD.drawBreachFront(c, x, y, s); } else HD.drawHole(c, x, y, HD.scaleAt(y) * 1.8); }
    for (const x of w.warns) HD.drawWarn(c, run, x, t);
    if (b) for (const r of b.rakes) drawRake(c, r);
    for (const s of w.splats) { c.globalAlpha = 1 - s.age / 0.6; A_.ellipse(c, s.x, s.y, 32 * (0.6 + s.age), 8 * (0.6 + s.age), '#d8cdb6', 0); c.globalAlpha = 1; }
    drawThings(c, run, view, t);
    for (const x of w.warns) HD.drawWarnTop(c, run, x);
    if (w.slashT > 0) drawSlash(c, w);
    for (const k of w.bounces) { const u = Math.min(1, k.t / 0.32), d = k.d + (k.to - k.d) * u, y = HD.yOf(d); A_.circle(c, HD.laneX(k.lane, y), y - 34, 7, '#ffffff', 1.6); }
    HD.drawWeather(c, view, n, t);
    HD.drawCounter(c);
    for (const s of w.stuck) { const x = HD.laneX(s.lane, T.doorY) + s.jig * 30 - 15, a = Math.min(1, 8 * (1 - Math.min(1, s.age / 12))); if (a <= 0) continue; c.globalAlpha = a; A_.poly(c, [[x - 2, T.doorY + 4], [x + 2, T.doorY + 4], [x + 5, T.doorY - 18], [x + 12, T.doorY - 18], [x + 3, T.doorY - 25], [x - 2, T.doorY - 17]], '#f1f4f8', 1.3); c.globalAlpha = 1; }
    if (w.doorHit > 0) { c.globalAlpha = w.doorHit; A_.poly(c, [P(w.doorLane - 1 - 0.5, T.doorY - 16), P(w.doorLane - 1 + 0.5, T.doorY - 16), P(w.doorLane - 1 + 0.5, T.doorY + 6), P(w.doorLane - 1 - 0.5, T.doorY + 6)], '#ff5a22', 0); c.globalAlpha = 1; }
    // The wave's name
    if (Kit.ui.screen === 'play') {   // not behind a talk scene or a meal
      if (w.phase === 'banner' && !b) banner(c, w.bannerText, w.phaseT);
      if (w.hintT > 0 && !run.over) hint(c, w.hintText, w.hintT, b ? 214 : 104);
    }
    if (b && b.state === 'collapse') { c.globalAlpha = Math.min(0.32, b.t * 0.1); c.fillStyle = '#0c1026'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); c.globalAlpha = 1; }
  };
  // The hammer's reach, as a white crescent across the lane where it lands: he's swinging at what's ahead of him.
  function drawSlash(c, w) {
    const u = 1 - w.slashT / 0.16, y = HD.yOf(T.contactD - 0.02), x = HD.laneX(w.target, y), hw = HD.laneW(y) * 0.5;
    c.globalAlpha = (1 - u) * 0.85;
    const dir = u * 30;
    c.beginPath(); c.moveTo(x + hw, y - 72 + dir); c.quadraticCurveTo(x, y - 118 + dir, x - hw, y - 62 + dir); c.quadraticCurveTo(x, y - 92 + dir, x + hw, y - 72 + dir); c.closePath();
    c.fillStyle = '#ffffff'; c.fill();
    c.globalAlpha = 1;
  }
  function drawRake(c, r) {
    const A_ = A(), u = r.t / 0.45;
    c.globalAlpha = 1 - u;
    for (const k of [-0.28, 0, 0.28]) {
      const k1 = r.lane - 1 + k, y0 = HD.yOf(T.boss.standD), y1 = HD.yOf(1);
      A_.poly(c, [P(k1 - 0.05, y0), P(k1 + 0.05, y0), P(k1 + 0.02, y1), P(k1 - 0.02, y1)], '#ffffff', 1.4);
    }
    c.globalAlpha = 1;
  }
  function banner(c, s, left) {
    const A_ = A();
    c.globalAlpha = Math.min(1, left * 3);
    A_.poly(c, [[52, 198], [316, 198], [308, 242], [44, 242]], A_.NIGHT, 2.4, A_.ORANGE);
    A_.text(c, s, 180, 220, { size: 28, color: A_.GOLD, align: 'center', ink: false });
    c.globalAlpha = 1;
  }
  // The first few seconds of a stage: what's new here, in plain words. Word-wrapped, on its own plate over the far deck.
  function hint(c, s, left, y) {
    const A_ = A(), lines = [], words = s.split(' ');
    c.font = '800 15px Barlow, system-ui, sans-serif';
    let cur = '';
    for (const wd of words) { const next = cur ? cur + ' ' + wd : wd; if (c.measureText(next).width > 290) { lines.push(cur); cur = wd; } else cur = next; }
    lines.push(cur);
    c.globalAlpha = Math.min(1, left);
    const h = 12 + lines.length * 18;
    A_.poly(c, [[24, y], [336, y], [336, y + h], [24, y + h]], 'rgba(12,16,38,.9)', 2, A_.GOLD);
    lines.forEach((l, i) => A_.text(c, l, 180, y + 15 + i * 18, { size: 15, body: true, color: A_.PAPER, align: 'center', ink: false }));
    c.globalAlpha = 1;
  }
})();
