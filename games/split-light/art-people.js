// Split Light: Prism from above, Ione's window with the bond cost on her neck, Vasch's window. Their arm strips are in art-arms.js. Drawing only.
// Pictures come first when they exist (art/REQUEST.md). Ione falls back to her homepage portrait, then the kit's bust. Vasch falls back to a tidy code bust from vasch-sheet-v4.
window.SL = window.SL || {};
(function () {
  const A = () => Kit.art, T = TUNE;

  // ---- Prism, seen from above and facing up: head, big faceted eyes, feather antennae, blade forearms folded forward, wings folded back with their rainbow rims. Per prism-sheet-v3.
  function wing(c, side, spread) {
    const a = A();
    c.save(); c.scale(side, 1); c.rotate(spread);
    const leaf = () => { c.beginPath(); c.moveTo(2, -4); c.quadraticCurveTo(22, 6, 15, 34); c.quadraticCurveTo(3, 26, 2, -4); c.closePath(); };
    leaf(); c.fillStyle = 'rgba(214,238,252,.92)'; c.fill();
    c.save(); leaf(); c.clip();
    [['#7fe8a0', 9], ['#ffe06a', 6], ['#ff7fb5', 3]].forEach(s => { c.beginPath(); c.moveTo(2, -4); c.quadraticCurveTo(22, 6, 15, 34); c.lineWidth = s[1]; c.strokeStyle = s[0]; c.stroke(); });
    c.restore();
    a.line(c, 3, 2, 14, 30, 1, '#7fa3cf'); a.line(c, 6, 8, 13, 12, 0.9, '#7fa3cf'); a.line(c, 7, 16, 13, 22, 0.9, '#7fa3cf');
    leaf(); c.lineWidth = 1.7; c.strokeStyle = a.INK; c.stroke();
    c.restore();
  }
  function paintPrism(c, spread) {
    const a = A(), body = '#a9c9ea', dark = '#7fa3cf';
    // legs
    [[-6, 4, -16, 2, -21, 11], [6, 4, 16, 2, 21, 11], [-5, 10, -15, 14, -19, 24], [5, 10, 15, 14, 19, 24]].forEach(l => {
      a.line(c, l[0], l[1], l[2], l[3], 3.4, a.INK); a.line(c, l[0], l[1], l[2], l[3], 1.6, body);
      a.line(c, l[2], l[3], l[4], l[5], 3, a.INK); a.line(c, l[2], l[3], l[4], l[5], 1.3, body);
    });
    wing(c, -1, spread); wing(c, 1, spread);
    a.poly(c, [[-5, 8], [5, 8], [3.5, 24], [0, 29], [-3.5, 24]], dark, 1.6);    // abdomen
    a.line(c, -4, 14, 4, 14, 1, a.INK); a.line(c, -3.5, 20, 3.5, 20, 1, a.INK);
    a.poly(c, [[0, -13], [5, -2], [4, 10], [-4, 10], [-5, -2]], body, 1.8);     // thorax
    a.poly(c, [[0, -13], [5, -2], [4, 10], [0, 10]], dark, 0);
    a.poly(c, [[0, -13], [5, -2], [4, 10], [-4, 10], [-5, -2]], null, 1.8);
    // blade forearms, folded forward, saw teeth inward
    [-1, 1].forEach(s => {
      c.save(); c.scale(s, 1);
      a.poly(c, [[4, -6], [11, -14], [10, -25], [7, -18], [5, -17], [6, -13]], '#d9eefc', 1.6);
      a.line(c, 6.5, -14, 9.5, -22, 0.8, dark);
      c.restore();
    });
    // antennae
    [-1, 1].forEach(s => {
      c.save(); c.scale(s, 1);
      a.line(c, 2, -21, 8, -29, 1.6, a.INK);
      c.beginPath(); c.moveTo(7, -28); c.quadraticCurveTo(14, -33, 18, -42); c.quadraticCurveTo(8, -40, 7, -28); c.closePath(); c.fillStyle = '#d9eefc'; c.fill(); c.lineWidth = 1.2; c.strokeStyle = a.INK; c.stroke();
      a.line(c, 9, -32, 16, -40, 1.1, '#ff9ed0');
      c.restore();
    });
    a.poly(c, [[0, -24], [5, -18], [0, -11], [-5, -18]], body, 1.8);            // head
    [-1, 1].forEach(s => {
      a.circle(c, s * 6.5, -18.5, 4.8, '#5fb4ee', 1.7);
      a.circle(c, s * 6, -19.5, 1.7, '#ffffff', 0);
      a.line(c, s * 3.5, -18.5, s * 9.5, -18.5, 0.7, '#2f6fa8');
    });
  }
  // x, y = the middle of her perch cell. heading: 'U' 'D' 'L' 'R'. firing: 0 to 1, wings flare and the eyes flash.
  SL.drawPrism = function (c, x, y, heading, firing, t) {
    const a = A(), rot = { U: 0, R: Math.PI / 2, D: Math.PI, L: -Math.PI / 2 }[heading];
    c.save(); c.translate(x, y + Math.sin(t * 2) * 0.8); c.rotate(rot);
    if (!a.draw(c, firing > 0 ? 'prism_fire' : 'prism_top', firing > 0 ? 0 : a.frameAt('prism_top', t), 0, 28, 58)) {
      const b = SL.bake('prism' + (firing > 0 ? 'F' : 'I'), 90, 96, 45, 50, cc => paintPrism(cc, firing > 0 ? -0.5 : 0));
      SL.stamp(c, b, 0, 0);
      if (firing > 0) { a.circle(c, 0, -24, 5 + firing * 6, 'rgba(255,255,255,.75)', 0); }
    }
    c.restore();
  };

  // ---- Windows. Slanted frames, like the rest of the UI.
  function frame(c, x, y, w, h, col) {
    const a = A(), s = 7;
    a.poly(c, [[x + s, y], [x + w, y], [x + w - s, y + h], [x, y + h]], '#1a2147', 2.4);
    return () => {
      a.poly(c, [[x + s, y], [x + w, y], [x + w - s, y + h], [x, y + h]], null, 2.4);
      a.line(c, x + s, y + 1.5, x + w, y + 1.5, 2, col);
    };
  }
  const clipFrame = (c, x, y, w, h) => { const s = 7; c.beginPath(); c.moveTo(x + s, y); c.lineTo(x + w, y); c.lineTo(x + w - s, y + h); c.lineTo(x, y + h); c.closePath(); c.clip(); };

  // Her homepage portrait, loaded once. The crystals up her neck are drawn over it: the state of the bond cost, whatever picture is under them.
  let ionePic = null, ioneOk = false;
  function ionePicture() {
    if (ionePic) return ioneOk ? ionePic : null;
    ionePic = new Image();
    ionePic.onload = () => { ioneOk = ionePic.naturalWidth > 0; };
    ionePic.onerror = () => { ioneOk = false; };
    ionePic.src = Kit.url('art/site/crew/ione-v2-small.webp');
    return null;
  }

  // The state of the cost, from what has actually been fired. Used by the windows and by test/fair-timing.js.
  SL.armState = function (run) {
    const w = run.w, story = run.carry.spent || 0, now = w.fired + w.boardFired;
    return { fresh: Math.min(T.armNewMax, now), old: Math.min(T.armOldMax, Math.floor(story / T.armOldPerShard)), neck: Math.min(T.neckMax, Math.floor((story + now) / T.neckPerShard)), spent: story + now };
  };

  // Her neck shards climb from the collarbone toward the jaw on her left (the right of the picture), as on ione-sheet-v11. x and y are shares of the square, then the way the shard points.
  // NECK fits her homepage portrait, the fallback. NECK_PIC fits ione_bust take 3: its two base growths are painted on, and her neck is short, as on her sheet, so at the top count these fill the skin between jaw and collarbone (NOTES.md).
  const NECK = [[0.63, 0.92, -2.2], [0.68, 0.9, -0.5], [0.6, 0.86, -2.5], [0.66, 0.84, -0.9], [0.59, 0.8, -2.1], [0.65, 0.78, -1.2], [0.6, 0.74, -2.4], [0.64, 0.72, -1.0]];
  const NECK_PIC = [null, null, [0.565, 0.79, -1.2], [0.55, 0.755, -1.35], [0.585, 0.825, -0.7], [0.535, 0.795, -1.45], [0.555, 0.825, -1.1], [0.525, 0.755, -1.6]];
  function ioneWindow(c, run, x, y, w, h) {
    const a = A(), W = run.w, st = SL.armState(run), strip = 34, ph = h - strip, end = frame(c, x, y, w, h, '#8fd3f0'), flare = W.wince > 0;
    c.save(); clipFrame(c, x, y, w, h);
    // The bust picture has a see-through background and empty space over her hair (top of hair 0.124 down it), so that space is cut: her whole head, neck and top stay in view, in the shorter boss window too.
    const hasPic = a.has('ione_bust'), size = hasPic ? Math.min(Math.max(w, ph), ph / 0.9) : Math.max(w, ph), px = x + (w - size) / 2, py = hasPic ? y - size * 0.1 : y;
    const frameI = flare ? 2 : W.beam ? 1 : 0;
    if (!a.draw(c, 'ione_bust', frameI, x + w / 2, py + size, size)) {   // the same square as the portrait below, so NECK fits either
      const pic = ionePicture();
      if (pic) c.drawImage(pic, px, py, size, size);
      else SL.stamp(c, SL.bake('ionebust', 144, 144, 0, 0, cc => a.bust(cc, 'ione', 144)), px + size / 2 - 72 * size / 144, py + size / 2 - 72 * size / 144, 0, size / 144);
    }
    const count = 2 + st.neck;
    const pic = a.has('ione_bust'), table = pic ? NECK_PIC : NECK;
    for (let i = pic ? 2 : 0; i < count && i < table.length; i++) {   // the bust picture already has the first two growths painted on
      const n = table[i], len = (pic ? 6 : i >= 2 ? 8 : 7) * size / 100;
      SL.shard(c, px + n[0] * size, py + n[1] * size, n[2], len, (pic ? 1.7 : 2.2) * size / 100, flare && i === count - 1);
    }
    if (flare) { c.globalAlpha = Math.min(0.4, W.wince); c.fillStyle = '#bfe9ff'; c.fillRect(x, y, w, ph); c.globalAlpha = 1; }
    c.restore();
    SL.armStrip(c, x, y + ph, w, strip, st, flare, run.time);
    end();
  }

  SL.ioneWindow = ioneWindow;

  // ---- Vasch, from the front, per vasch-sheet-v4: combed-back grey hair, tiny closed smile, high white collar, the black bar through a black ring.
  SL.paintVaschFace = function (c, s) {
    const a = A(), skin = '#ecdccf', shade = '#d3bfae', hair = '#8c9096', hairDark = '#5f6369';
    c.save(); c.scale(s / 100, s / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    a.poly(c, [[4, 100], [14, 82], [37, 74], [63, 74], [86, 82], [96, 100]], '#eef0f2', 1.7);                 // shoulders of the coat
    a.poly(c, [[63, 74], [86, 82], [96, 100], [68, 100]], '#c9ced6', 0);
    a.poly(c, [[4, 100], [14, 82], [37, 74], [63, 74], [86, 82], [96, 100]], null, 1.7);
    a.poly(c, [[10, 92], [90, 92], [91, 99], [9, 99]], '#14161f', 0);                                         // the bar through the ring
    a.circle(c, 50, 95, 7, null, 2.8, '#14161f');
    a.poly(c, [[43, 58], [57, 58], [58, 72], [42, 72]], shade, 1.3);                                          // neck
    a.poly(c, [[38, 76], [40, 62], [46, 66], [50, 74], [54, 66], [60, 62], [62, 76], [50, 80]], '#ffffff', 1.6);   // stand collar
    a.poly(c, [[33, 32], [30, 36], [33, 42], [36, 40]], skin, 1.3); a.poly(c, [[67, 32], [70, 36], [67, 42], [64, 40]], shade, 1.3);   // ears
    a.poly(c, [[50, 12], [64, 16], [67, 32], [65, 46], [56, 58], [50, 61], [44, 58], [35, 46], [33, 32], [36, 16]], skin, 0);   // a long, thin face
    a.poly(c, [[67, 32], [65, 46], [56, 58], [50, 61], [58, 44], [60, 30]], shade, 0);
    a.poly(c, [[50, 12], [64, 16], [67, 32], [65, 46], [56, 58], [50, 61], [44, 58], [35, 46], [33, 32], [36, 16]], null, 1.7);
    a.poly(c, [[33, 33], [31, 18], [38, 8], [50, 4], [63, 7], [70, 17], [67, 33], [65, 25], [60, 20], [50, 19], [41, 19], [36, 24]], hair, 1.7);   // combed straight back
    [[40, 19, 38, 9], [46, 18, 45, 6], [52, 18, 52, 5], [58, 19, 60, 7], [63, 22, 67, 13]].forEach(l => a.line(c, l[0], l[1], l[2], l[3], 1.1, hairDark));
    [[42.5, 35, 1], [57.5, 35, -1]].forEach(e => {
      a.line(c, e[0] - 6 * e[2], e[1] - 5.5, e[0] + 5 * e[2], e[1] - 4.5, 1.5, hairDark);
      a.poly(c, [[e[0] - 5, e[1]], [e[0], e[1] - 2], [e[0] + 5, e[1] - 0.5], [e[0] + 3, e[1] + 1.6], [e[0] - 3, e[1] + 1.6]], '#f7f6f2', 1);
      a.circle(c, e[0], e[1] - 0.2, 1.6, '#8e959e', 0);
      a.circle(c, e[0], e[1] - 0.2, 0.7, a.INK, 0);
    });
    a.line(c, 50, 36, 48.5, 45, 0.9, '#b39f90'); a.line(c, 48.5, 45, 51, 45.6, 0.9, '#b39f90');
    c.beginPath(); c.moveTo(45, 51); c.quadraticCurveTo(50, 53, 55, 50); c.lineWidth = 1.3; c.strokeStyle = a.INK; c.lineCap = 'round'; c.stroke();
    c.restore();
  };

  // His face in a talk box: the bust picture, zoomed to head and collar. Falls back to the code face.
  SL.paintVaschTalk = function (c, s) {
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, s, s);
    const zoom = 1.7;
    if (!A().draw(c, 'vasch_bust', 0, s / 2, s * (zoom - 0.03), s * zoom)) SL.paintVaschFace(c, s);
  };

  // His window: the face, and under it his right arm (art-arms.js).
  SL.vaschWindow = function (c, run, x, y, w, h) {
    const a = A(), b = run.w.boss, strip = 34, ph = h - strip, end = frame(c, x, y, w, h, '#e9edf0');
    c.save(); clipFrame(c, x, y, w, h);
    const size = Math.max(w, ph);
    const pic = Math.min(size, ph / 0.87);   // his picture is sized so the ring on his chest (0.865 down it) stays in the window and his hair clears the top
    if (!a.draw(c, 'vasch_bust', b.chamber < 1 ? 1 : 0, x + w / 2, y + pic, pic)) SL.stamp(c, SL.bake('vaschface', 144, 144, 0, 0, cc => SL.paintVaschFace(cc, 144)), x + w / 2 - size / 2, y - 4, 0, size / 144);
    c.restore();
    SL.vaschArm(c, x, y + ph, w, strip, b);
    end();
  };
})();
