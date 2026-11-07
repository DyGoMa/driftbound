// Silent Cut: everyone with a body. A picture if art/sprites.js has one, the kit's code figure if not. Keep the code version plain and tidy: the pictures are the plan.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const silasH = () => A().heightOf('silas', T.pxPerCm), trooperH = () => A().heightOf('trooper', T.pxPerCm), maroH = () => A().heightOf('maro', T.pxPerCm);

  // Out of breath: bent over, one hand at his throat. The look matches the state, in code and in the picture (art/REQUEST.md).
  const WINDED = t => ({ lean: 0.52, tilt: 0.32, armN: [0.75 + Math.sin(t * 5) * 0.05, 2.5], armF: [0.5, 0.4], legN: [0.42, 0.5], legF: [-0.1, 0.32] });
  const WINDED_WALK = t => { const s = Math.sin(t * 5); return { lean: 0.5, tilt: 0.32, armN: [0.75, 2.5], armF: [0.4 - s * 0.3, 0.5], legN: [0.45 + s * 0.4, 0.5 + Math.max(0, -s) * 0.5], legF: [0.05 - s * 0.4, 0.5 + Math.max(0, s) * 0.5] }; };

  // Tucked behind cover, arms in, so nothing pokes out past the crate.
  const TUCKED = { lean: 0.62, armN: [0.5, 2.1], armF: [0.3, 2.1], legN: [1.25, 2], legF: [0.85, 1.75] };
  // A low sneak with the arms kept in: the kit's creep reaches forward, which reads as a sleepwalker.
  const CREEP = t => { const p = t * 5, s = Math.sin(p); return { lean: 0.46, armN: [0.42 + s * 0.14, 1.25], armF: [0.1 - s * 0.14, 1.1], legN: [0.75 + s * 0.3, 1.15 - s * 0.2], legF: [0.35 - s * 0.3, 1 + s * 0.2] }; };

  const STRIKE_HAND = [[-16, 81], [35, 69], [34, 61]];   // measured on silas-strike.webp at 84 px: how far ahead of and above his feet the hand is, frame by frame
  const STEEL = '#c9ced6', STEEL_DARK = '#858d9a', HILT = '#3a2a24';
  // The knife from silas-sheet-v4: dark wooden hilt, curled steel pommel, steel collar, curved blade. Tip at 0,0, pointing along +x. About twice its size on the sheet, so it reads at play size.
  function drawKnife(c, x, y, ang) {
    const A_ = A();
    c.save(); c.translate(x, y); c.rotate(ang);
    if (Math.cos(ang) < 0) c.scale(1, -1);   // the curve stays the same way up, whichever way it flies
    A_.poly(c, [[-16, -2.8], [-11, -5], [-5, -4.2], [0, 0], [-6, -0.8], [-11, 0], [-16, 2.6]], STEEL, 1);
    A_.poly(c, [[-16, 2.6], [-16, -0.2], [-11, -2.2], [-5, -2], [0, 0], [-6, -0.8], [-11, 0]], STEEL_DARK, 0);
    A_.poly(c, [[-25, -2.2], [-17, -2.6], [-17, 2.8], [-25, 2.4]], HILT, 1);
    A_.poly(c, [[-18, -3.8], [-15.6, -3.8], [-15.6, 3.9], [-18, 3.9]], STEEL, 1);
    A_.poly(c, [[-25, -2.2], [-28.4, -3.4], [-29.6, -0.8], [-27.6, 2.4], [-25, 2.4]], STEEL, 1);
    c.restore();
  }
  // The chain, link by link: a flat link, then one seen edge-on.
  function drawLinks(c, hx, hy, mx, my, ex, ey) {
    const A_ = A(), at = u => [(1 - u) * (1 - u) * hx + 2 * u * (1 - u) * mx + u * u * ex, (1 - u) * (1 - u) * hy + 2 * u * (1 - u) * my + u * u * ey];
    c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo(mx, my, ex, ey);
    c.lineWidth = 2.4; c.strokeStyle = A_.INK; c.lineCap = 'round'; c.stroke();
    const n = Math.max(2, Math.round(Math.hypot(mx - hx, my - hy) * 2 / 4.6));
    c.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const p = at((i + 0.5) / n), a = Math.atan2(at((i + 1) / n)[1] - at(i / n)[1], at((i + 1) / n)[0] - at(i / n)[0]);
      c.beginPath();
      if (i % 2) c.ellipse(p[0], p[1], 2.5, 1.5, a, 0, Math.PI * 2);
      else { c.moveTo(p[0] - Math.cos(a) * 2, p[1] - Math.sin(a) * 2); c.lineTo(p[0] + Math.cos(a) * 2, p[1] + Math.sin(a) * 2); }
      c.strokeStyle = i % 2 ? STEEL : STEEL_DARK; c.stroke();
    }
  }
  const KNIFE_LEN = 29.6;   // pommel to tip, as drawn above: the chain ties on at the pommel
  function drawChain(c, s, x, y, t) {
    const A_ = A(), g = T.groundY, isCut = s.lastAct === 'cut', u = 1 - Math.max(0, s.strikeT) / (isCut ? T.cutSecs : T.strikeSecs);
    const pic = A_.has('silas_strike') ? STRIKE_HAND[Math.min(2, Math.floor((1 - s.strikeT / T.strikeSecs) * 3))] : [16, 52];   // from the hand in the picture
    const hx = x + s.dir * pic[0], hy = y - pic[1];
    // A strike starts wound up: the knife swung out behind his raised hand, clear of his head. A lantern cut has no wind-up, and nor does the code figure, whose hand isn't raised.
    const from = isCut || !A_.has('silas_strike') ? 0 : T.chainWindup, thrown = Math.min(1, Math.max(0, u - from) / T.chainFly);
    const rest = [hx - s.dir * 29, hy + 17];   // tip, wound up
    if (u < from) { drawLinks(c, hx, hy, hx - s.dir * 3, hy + 6, hx - s.dir * 5, hy + 3); drawKnife(c, rest[0], rest[1], Math.atan2(0.5, -s.dir * 0.85)); return; }
    // The tip lands on the target. A target closer than his outstretched hand gets the blade held forward of the hand, never pointing back at him.
    const reachX = s.dir > 0 ? Math.max(s.strikeX, hx + KNIFE_LEN) : Math.min(s.strikeX, hx - KNIFE_LEN), ty = g - (s.strikeAlt || 52);
    const ex = hx + (reachX - hx) * thrown, ey = hy + (ty - hy) * thrown, ang = Math.atan2(ey - hy, Math.abs(ex - hx) < 1 ? s.dir : ex - hx);
    const px = ex - Math.cos(ang) * KNIFE_LEN, py = ey - Math.sin(ang) * KNIFE_LEN;
    drawLinks(c, hx, hy, (hx + px) / 2, (hy + py) / 2 - 12 * (1 - u), px, py);
    drawKnife(c, ex, ey, ang);
  }

  SC.drawSilas = function (c, run, x) {
    const A_ = A(), w = run.w, s = w.s, t = run.time, g = T.groundY, h = silasH(), flip = s.dir < 0;
    let pose, key, frame = 0;
    if (run.over === 'lose') { pose = 'down'; key = 'silas_down'; }
    else if (s.hurtT > 0) { pose = 'hurt'; key = 'silas_hurt'; }
    else if (s.dash > 0) { pose = 'surge'; key = 'silas_surge'; }
    else if (s.strikeT > 0) { pose = 'throw'; key = 'silas_strike'; frame = Math.min(2, Math.floor((1 - s.strikeT / T.strikeSecs) * 3)); }
    else if (s.winded) { pose = s.moving ? WINDED_WALK(t) : WINDED(t); key = 'silas_winded'; frame = s.moving ? A_.frameAt('silas_winded', t) : 0; }
    else if (s.moving) { pose = CREEP(t); key = 'silas_creep'; frame = A_.frameAt('silas_creep', t); }
    else if (s.hidden) { pose = TUCKED; key = 'silas_hide'; }
    else { pose = TUCKED; key = 'silas_freeze'; }

    // Echoes of the dash
    if (s.dash > 0) for (let i = 1; i <= 3; i++) {
      c.globalAlpha = 0.34 - i * 0.08;
      if (!A_.draw(c, 'silas_surge', 0, x - i * 34, g, h, flip)) A_.personFast(c, 'silas', { x: x - i * 34, y: g, h, pose: 'surge', t });
      c.globalAlpha = 1;
    }
    if (s.grace > 0 && Math.floor(t * 14) % 2) c.globalAlpha = 0.55;
    // The squat picture is lower than most cover: lifted so his head and shoulders show over it. His feet are behind the cover. Not in a doorway, which hides nothing.
    const cov = key === 'silas_hide' && SC.coverAt(w, x), lift = cov && cov.kind !== 'door' ? T.hideLiftArt : 0;
    if (!A_.draw(c, key, frame, x, g - lift, h, flip)) {
      if (pose === 'surge') A_.person(c, 'silas', { x, y: g, h, pose, t, glow: 1.2 });
      else if (pose === 'throw') A_.person(c, 'silas', { x, y: g, h, pose, t, flip, phase: 1 - Math.max(0, s.strikeT) / T.strikeSecs });
      else if (typeof pose === 'object') A_.person(c, 'silas', { x, y: g, h, pose, t, flip });
      else A_.personFast(c, 'silas', { x, y: pose === 'down' ? g + T.downDrop : g, h, pose, t, flip });
    }
    c.globalAlpha = 1;
    if (s.strikeT > 0 && s.strikeX !== undefined) drawChain(c, s, x, g, t);
    // Out of breath: the empty talk bubble follows him, the thing he dreads most, and short breaths come out.
    if (s.winded && run.over !== 'lose') {
      const bx = x + 42, by = g - 104;
      A_.blob(c, [[bx - 20, by - 13], [bx + 20, by - 13], [bx + 24, by + 10], [bx - 6, by + 11], [bx - 18, by + 19, 1], [bx - 14, by + 10], [bx - 24, by + 9]], '#f5efe2', 2.2);
      A_.text(c, '...', bx, by - 2, { size: 22, color: A_.INK, align: 'center', ink: false });
    }
    if (s.winded && Math.floor(t * 2.4) % 2) A_.ellipse(c, x + (flip ? -1 : 1) * (A_.has('silas_winded') ? 36 : 22), g - (A_.has('silas_winded') ? 58 : 62) - ((t * 2.4) % 1) * 8, 3 + ((t * 2.4) % 1) * 4, 2.4, 'rgba(220,214,255,.6)', 0);
  };

  let glow = null;
  function lampGlow(c, x, y) {
    if (!glow) { glow = c.createRadialGradient(0, 0, 4, 0, 0, 62); glow.addColorStop(0, 'rgba(255,214,130,.26)'); glow.addColorStop(1, 'rgba(255,214,130,0)'); }
    c.save(); c.translate(x, y); c.globalCompositeOperation = 'screen'; c.fillStyle = glow;
    c.beginPath(); c.arc(0, 0, 62, 0, Math.PI * 2); c.fill(); c.restore();
  }

  SC.drawTrooper = function (c, f, t) {
    const A_ = A(), g = T.groundY, h = trooperH(), flip = f.dir < 0;
    if (f.state === 'down') {
      if (!A_.draw(c, 'trooper_down', 0, f.x, g, h, f.fellDir < 0)) A_.personFast(c, 'trooper', { x: f.x, y: g + T.downDrop, h, pose: 'down', flip: f.fellDir < 0 });
      return;
    }
    // His own lamp lights him a little, fading out with no edge, so grey on a dark wall still reads on a dim phone.
    lampGlow(c, f.x + f.dir * 15, g - 40);
    const moving = f.state === 'walk' || f.state === 'go', run = f.state === 'hunt';
    if (run) { if (!A_.draw(c, 'trooper_run', A_.frameAt('trooper_run', t), f.x, g, h, flip)) A_.personFast(c, 'trooper', { x: f.x, y: g, h, pose: 'run', t, flip }); }
    else if (moving) { if (!A_.draw(c, 'trooper_walk', A_.frameAt('trooper_walk', t + f.x * 0.01), f.x, g, h, flip)) A_.personFast(c, 'trooper', { x: f.x, y: g, h, pose: 'walk', t: t + f.x * 0.01, flip }); }
    else if (!A_.draw(c, 'trooper_stand', 0, f.x, g, h, flip)) A_.personFast(c, 'trooper', { x: f.x, y: g, h, pose: 'idle', flip });
    SC.handLamp(c, f.x + f.dir * 15, g - 40, t);
  };

  // Ledger Maro: round, satin coat, a lantern on a pole in one hand, the book in the other.
  SC.drawMaro = function (c, b, t) {
    const A_ = A(), g = T.groundY, h = maroH(), flip = b.dir < 0, st = b.state, lean = flip ? -1 : 1;
    let key, frame = 0;
    if (st === 'fall') key = 'maro_down'; else if (st === 'hit') key = 'maro_hurt'; else if (st === 'run') { key = 'maro_run'; frame = A_.frameAt('maro_run', t); }
    else key = st === 'face' ? 'maro_lamp' : 'maro_book';
    if (!A_.draw(c, key, frame, b.x, g, h, flip)) {
      const pose = st === 'fall' ? 'down' : st === 'hit' ? 'hurt' : st === 'run' ? 'run' : 'idle';
      A_.personFast(c, 'maro', { x: b.x, y: st === 'fall' ? g + T.downDrop : g, h, pose, t, flip });
      if (st !== 'fall') drawKit(c, b, t, lean, st);
    } else if (st === 'back' && SC.maroTell(b) > 0) { // The pictures carry the pole, lamp and open book. Only the warning's shut book goes on top, big enough to cover the open one.
      const bx = b.x + lean * 18, by = g - 57;
      A_.poly(c, [[bx - lean * 9, by - 5], [bx + lean * 8, by - 9], [bx + lean * 10, by + 4], [bx - lean * 7, by + 8]], '#6a2f2c', 1.6);
    }
  };
  // His talk portrait in code, used only if art/maro-portrait.webp can't load: as he looks in play and on maro-sheet-v1, side-on like his pictures, stout, bald on top, grey at the back, a pleased smirk, plum coat.
  function maroFace(c, size) {
    const A_ = A(), skin = '#e6ba90', dark = '#c28f68', hair = '#6b6764', hairDark = '#4b4846', coat = '#5c2c50', coatDark = '#431f3b', ink = A_.INK;
    const stroke = (pts, lw, col) => { c.beginPath(); pts.forEach((q, i) => (i ? (q.length > 2 ? c.quadraticCurveTo(q[0], q[1], q[2], q[3]) : c.lineTo(q[0], q[1])) : c.moveTo(q[0], q[1]))); c.lineWidth = lw; c.strokeStyle = col || ink; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); };
    c.save(); c.scale(size / 100, size / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    A_.poly(c, [[0, 100], [0, 40], [100, 88], [100, 100]], '#3a2348', 0);
    A_.poly(c, [[-2, 102], [-2, 88], [14, 74], [38, 66], [66, 70], [84, 80], [94, 102]], coat, 1.8);                   // a heavy back and shoulder
    A_.poly(c, [[-2, 102], [-2, 88], [14, 74], [26, 70], [34, 102]], coatDark, 0);
    A_.poly(c, [[42, 62], [68, 66], [64, 76], [46, 74]], '#c9b9c0', 1.2);                                              // shirt collar
    A_.poly(c, [[36, 64], [46, 74], [52, 92], [38, 84], [28, 70]], coatDark, 1.5);                                     // coat collar, standing behind his neck
    A_.poly(c, [[60, 74], [70, 68], [82, 80], [70, 88]], coatDark, 1.5);
    A_.poly(c, [[42, 50], [66, 66], [62, 72], [44, 66]], dark, 1.4);                                                   // neck, under the jowl
    const head = [[48, 8], [60, 8], [70, 15], [74, 26], [75, 34], [78, 40], [85, 50, 1], [79, 54], [78, 57], [80, 60], [77, 64], [76, 68], [70, 74], [58, 74], [46, 66], [38, 52], [34, 34], [36, 18]];
    A_.blob(c, head, skin, 0);
    A_.poly(c, [[70, 74], [58, 74], [46, 66], [40, 56], [50, 58], [60, 66]], dark, 0);                                  // the one shadow tone, under the jaw
    A_.blob(c, head, null, 1.9);
    A_.poly(c, [[36, 16], [29, 22], [31, 28], [24, 33], [29, 38], [25, 45], [32, 47], [31, 54], [39, 52], [45, 56], [48, 42], [46, 26], [42, 18]], hair, 1.7);   // grey at the back and side, bald on top
    A_.poly(c, [[31, 42], [39, 44], [40, 52], [32, 47]], hairDark, 0);
    A_.blob(c, [[46, 38], [51, 36], [53, 42], [50, 49], [46, 48]], skin, 1.5); stroke([[48, 40], [50.5, 43], [48, 46]], 1, '#8a5e42');   // ear
    stroke([[58, 34], [66, 29, 76, 32]], 3, hairDark);                                                                 // a heavy brow
    A_.poly(c, [[64, 37], [75, 36], [74, 41], [66, 42]], '#f5efe2', 0);
    A_.circle(c, 71, 38.6, 2.2, '#2a2233', 0);
    stroke([[62, 38], [68, 34.5, 76, 36]], 2, ink);                                                                    // heavy lid: a narrow, pleased eye
    stroke([[65, 43], [70, 44.5, 74, 42.5]], 1, '#8a5e42');
    stroke([[60, 16], [66, 15, 70, 18]], 1, '#b5835e'); stroke([[60, 22], [67, 21, 72, 24]], 1, '#b5835e');            // lines on the brow
    stroke([[80, 60], [72, 62.5, 64, 58]], 1.8, ink); stroke([[64, 58], [62, 57, 61, 54]], 1.2, '#8a5e42');            // the smirk
    stroke([[72, 47], [66, 49, 62, 55]], 1.1, '#a87a57');                                                               // the cheek pushed up by it
    stroke([[52, 68], [60, 72, 70, 70]], 1.1, '#8a5e42');                                                               // the second chin
    c.restore();
  }
  Kit.speakers.add('maro', { name: 'Ledger Maro', colour: '#c98ac0', person: 'maro', img: 'games/silent-cut/art/maro-portrait.webp', paint: maroFace });   // img is from the site root, as the kit's are
  Kit.speakers.add('trooper', { name: 'Sever trooper', colour: '#9aa0a8', person: 'trooper', img: 'games/silent-cut/art/trooper-portrait.webp' });   // from trooper-sheet-v1; the kit's code bust still shows if it can't load

  function drawKit(c, b, t, lean, st) {
    const A_ = A(), g = T.groundY, m = SC.maroLamp(b);
    const px = b.x + lean * 14, py = g - 40;
    const swing = m ? Math.max(-0.5, Math.min(0.5, (m.x - b.x + 180) / 400)) : 0;
    const tipX = px + lean * (st === 'face' ? 30 : 18) + swing * 10, tipY = g - 106;
    if (st !== 'hit') {
      A_.line(c, px, py, tipX, tipY, 4); A_.line(c, px, py, tipX, tipY, 2, '#6d5844');
      SC.handLamp(c, tipX + lean * 4, tipY + 10, t);
    }
    if (st === 'back') { // The ledger, open. It shuts when the warning shows.
      const shut = SC.maroTell(b) > 0, bx = b.x + lean * 18, by = g - 52;
      if (shut) A_.poly(c, [[bx - 7, by - 9], [bx + 7, by - 9], [bx + 7, by + 7], [bx - 7, by + 7]], '#6a2f2c', 1.6);
      else {
        A_.poly(c, [[bx - 13, by - 8], [bx, by - 5], [bx + 13, by - 8], [bx + 13, by + 5], [bx, by + 8], [bx - 13, by + 5]], '#efe6cc', 1.6);
        A_.line(c, bx, by - 5, bx, by + 8, 1.2, '#6a5a4a');
      }
    }
  }
})();
