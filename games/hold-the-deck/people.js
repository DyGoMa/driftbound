// Hold the Deck: the boarders, walking at you, in code, per trooper-sheet-v1.png's front view. Hekka per hekka-sheet-v6.png's front view, small and far off.
// These are the simple, tidy fallback: pictures replace them through Kit.art (art/REQUEST.md). Each frame is drawn once and stamped.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const COAT = '#73767e', COAT_D = '#585b63', TROUS = '#4f5259', BOOT = '#17181f', HELM = '#7b7e86', HELM_D = '#5f6269', VISOR = '#0c0d13', SKIN = '#b98a66', COLLAR = '#efeee6', BLADE = '#f1f4f8', GLOVE = '#17181f';

  function head(c, x, y, s = 1, lw = 1) {
    const A_ = A();
    A_.poly(c, [[x - 4, y + 7], [x + 4, y + 7], [x + 5, y + 12], [x - 5, y + 12]], SKIN, lw);
    A_.poly(c, [[x - 6, y + 11], [x + 6, y + 11], [x + 7, y + 15], [x - 7, y + 15]], COLLAR, lw);   // the white collar
    A_.ellipse(c, x - 8.4, y + 1, 3, 3.6, HELM_D, lw);
    A_.ellipse(c, x + 8.4, y + 1, 3, 3.6, HELM_D, lw);
    A_.poly(c, [[x - 6.4, y + 3], [x + 6.4, y + 3], [x + 4, y + 9.4], [x, y + 10.4], [x - 4, y + 9.4]], SKIN, lw);
    A_.line(c, x - 1.8, y + 7.4, x + 1.8, y + 7.4, 0.9, '#6e4c36');
    c.beginPath(); c.arc(x, y + 1, 9, Math.PI, 0); c.lineTo(x + 8.6, y + 4); c.lineTo(x - 8.6, y + 4); c.closePath();
    c.fillStyle = HELM; c.fill(); c.lineWidth = lw * 1.5; c.strokeStyle = A_.INK; c.stroke();
    A_.line(c, x - 4, y - 7, x - 3.2, y - 1, 0.7, HELM_D); A_.line(c, x + 4, y - 7, x + 3.2, y - 1, 0.7, HELM_D);
    A_.poly(c, [[x - 8.8, y - 0.6], [x + 8.8, y - 0.6], [x + 7.6, y + 4.6], [x - 7.6, y + 4.6]], VISOR, lw);
    A_.line(c, x - 6, y + 0.8, x - 1, y + 0.8, 0.8, '#3a3d4a');
  }
  function bar(c, x, y) {   // the Sever mark: a bar cutting a ring
    const A_ = A();
    A_.circle(c, x, y, 4.6, null, 1.4, COLLAR);
    A_.poly(c, [[x - 11, y - 1.3], [x + 11, y - 1.3], [x + 11, y + 1.3], [x - 11, y + 1.3]], VISOR, 0);
  }
  function hook(c, x, y, flip) {
    const A_ = A(), s = flip ? -1 : 1;
    c.globalAlpha = 0.28; A_.circle(c, x + s * 2, y + 11, 6.5, '#ffffff', 0); c.globalAlpha = 1;
    A_.poly(c, [[x - s * 1.4, y], [x + s * 1.4, y], [x + s * 2.6, y + 14], [x + s * 6.5, y + 15], [x + s * 2, y + 19], [x - s * 1, y + 14]], BLADE, 0.9);
  }

  // kind: grunt, runner, shield, cutter. step 0..3 is the walk cycle, seen head-on: one boot forward, pass, the other boot, pass.
  function trooper(c, kind, step) {
    const A_ = A(), lift = step === 0 ? 1 : step === 2 ? -1 : 0, run = kind === 'runner', bob = (step % 2 ? -1 : 0), L = 1;
    const leg = (s, up) => {
      const y1 = -3 - up * 6;
      A_.joined(c, [{ a: [s * 7, -40], b: [s * 8.4, y1 - 8], ra: 6.4, rb: 5.2, color: TROUS }], L);
      A_.poly(c, [[s * 8.4 - 5.4, y1 - 13], [s * 8.4 + 5.4, y1 - 13], [s * 8.4 + 6.6, y1 + 2], [s * 8.4 - 6.6, y1 + 2]], BOOT, L);
      A_.poly(c, [[s * 8.4 - 6.8, y1], [s * 8.4 + 6.8, y1], [s * 8.4 + 6.8, y1 + 3], [s * 8.4 - 6.8, y1 + 3]], '#0a0a10', 0);
    };
    const up = v => Math.max(0, v);
    leg(-1, up(lift)); leg(1, up(-lift));
    const top = -80 + bob, hem = run ? -38 : -26 + bob, swing = lift * 2.2;
    // Sleeves behind the coat
    const handL = run ? [-16, -52 + lift * 6] : kind === 'cutter' ? [-19, -46] : [-20, -44 - lift * 3], handR = kind === 'cutter' ? [14, -112] : run ? [16, -52 - lift * 6] : [20, -44 + lift * 3];
    const elR = kind === 'cutter' ? [24, -92] : run ? [23, -62] : [20, -60];
    A_.joined(c, [{ a: [-13, top + 5], b: [-20, -60], ra: 5.2, rb: 4.6, color: COAT }, { a: [-20, -60], b: handL, ra: 4.6, rb: 3.8, color: COAT }], L);
    A_.joined(c, [{ a: [13, top + 5], b: elR, ra: 5.2, rb: 4.6, color: COAT }, { a: elR, b: handR, ra: 4.6, rb: 3.8, color: COAT }], L);
    A_.circle(c, handL[0], handL[1], 3.6, GLOVE, L);
    A_.circle(c, handR[0], handR[1], 3.6, GLOVE, L);
    // The coat: to the knee, closed, belted
    A_.poly(c, [[-14, top], [14, top], [12, -52], [18 + swing, hem], [-18 + swing, hem], [-12, -52]], COAT, L * 1.5);
    A_.poly(c, [[4, top + 1], [14, top], [12, -52], [18 + swing, hem], [5 + swing, hem]], COAT_D, 0);
    A_.line(c, 0, top + 2, swing, hem, 0.8, COAT_D);
    A_.poly(c, [[-13, -55], [13, -55], [13, -50], [-13, -50]], VISOR, 0.8);
    A_.poly(c, [[-3, -55.6], [3, -55.6], [3, -49.4], [-3, -49.4]], '#3a3d45', 0);
    bar(c, 0, top + 13);
    if (kind === 'cutter') { // arm up with a hook on a line, ready to throw
      hook(c, handR[0], handR[1] - 16, true);
      c.beginPath(); c.moveTo(handR[0], handR[1]); c.quadraticCurveTo(handR[0] - 18, handR[1] + 20, handL[0], handL[1]); c.lineWidth = 0.9; c.strokeStyle = '#d9dde4'; c.stroke();
    } else hook(c, handR[0], handR[1], false);
    head(c, 0, top - 15, 1, L);
    if (kind === 'shield') { // a torn-off bulkhead plate, held up in front
      A_.poly(c, [[-20, -80], [20, -80], [23, -18], [-23, -18]], '#62656e', L * 2);
      A_.poly(c, [[6, -80], [20, -80], [23, -18], [8, -18]], '#4c4f58', 0);
      A_.poly(c, [[-20, -80], [20, -80], [20.4, -74], [-20.4, -74]], '#8b8e97', 0);
      for (const q of [[-16, -74], [16, -74], [-18, -24], [18, -24], [0, -74], [0, -24]]) A_.circle(c, q[0], q[1], 1.5, '#b4b8c0', 0.7);
      bar(c, 0, -50);
    }
  }

  // Two troopers shoving a timber with an iron head, seen head-on.
  function ram(c, step) {
    const A_ = A(), lift = step === 0 ? 1 : step === 2 ? -1 : 0;
    c.save(); c.translate(-37, 0); c.scale(0.86, 0.86); trooper(c, 'grunt', step); c.restore();
    c.save(); c.translate(37, 0); c.scale(0.86, 0.86); trooper(c, 'grunt', (step + 2) % 4); c.restore();
    const y = -46 + lift;
    A_.poly(c, [[-32, y - 16], [32, y - 16], [36, y + 10], [-36, y + 10]], '#5c3f28', 1.8);   // the timber's butt, banded
    A_.poly(c, [[-26, y - 26], [26, y - 26], [34, y - 8], [34, y + 20], [-34, y + 20], [-34, y - 8]], '#4d505a', 2.2);
    A_.poly(c, [[-26, y - 26], [26, y - 26], [34, y - 8], [-34, y - 8]], '#70737d', 0);
    A_.poly(c, [[-26, y - 26], [26, y - 26], [34, y - 8], [34, y + 20], [-34, y + 20], [-34, y - 8]], null, 2.2);
    for (const q of [[-26, y - 2], [26, y - 2], [-26, y + 14], [26, y + 14], [0, y - 18]]) A_.circle(c, q[0], q[1], 2, '#b4b8c0', 0.9);
    bar(c, 0, y + 4);
    for (const s of [-1, 0, 1]) A_.poly(c, [[s * 22 - 5, y + 20], [s * 22 + 5, y + 20], [s * 22, y + 30]], '#8e919a', 1.2);
  }

  const size = kind => (kind === 'ram' ? { w: 130, h: 130, ox: 65, oy: 118 } : { w: 80, h: 136, ox: 40, oy: 124 });
  function frame(kind, step) {
    const s = size(kind);
    return HD.bake('p' + kind + step, s.w, s.h, s.ox, s.oy, c => {
      c.lineCap = 'round'; c.lineJoin = 'round';
      if (kind === 'ram') ram(c, step); else trooper(c, kind, step);
    });
  }
  // White flash of the same frame, when a swing lands.
  function flashFrame(kind, step) {
    const s = size(kind);
    return HD.bake('pw' + kind + step, s.w, s.h, s.ox, s.oy, c => {
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
      c.drawImage(frame(kind, step).cv, 0, 0);
      c.globalCompositeOperation = 'source-atop'; c.fillStyle = 'rgba(255,255,255,.82)'; c.fillRect(0, 0, c.canvas.width, c.canvas.height);
      c.restore();
    });
  }

  const KEY = { grunt: 'trooper_walk', rope: 'trooper_walk', runner: 'trooper_run_front', shield: 'trooper_shield', cutter: 'trooper_cutter', ram: 'ram_front' };
  HD.drawFoe = function (c, f, y, h, t) {
    const A_ = A(), x = HD.laneX(f.laneF, y), kind = f.type === 'rope' ? 'grunt' : (f.type === 'shield' && f.hp < T.foes.shield.hp ? 'grunt' : f.type);
    const rate = kind === 'runner' ? 9 : 5.5, moving = f.state === 'walk' || f.state === 'side', step = moving ? Math.floor(t * rate + f.seed) % 4 : 1;
    const key = f.type === 'shield' && kind === 'grunt' ? 'trooper_walk' : KEY[f.type];
    c.save();
    if (f.d < 0.05) c.globalAlpha = f.d / 0.05;
    if (f.state === 'stun') { c.translate(Math.sin(t * 40) * 1.2, 0); }
    if (A_.has(key)) {
      A_.draw(c, key, f.state === 'attack' ? 4 : step, x, y, h);   // frame 4 of a strip is him striking
      if (f.flash > 0) A_.circle(c, x, y - h * 0.55, h * 0.3, 'rgba(255,255,255,.5)', 0);
    } else {
      const k = h / 100;
      HD.stamp(c, f.flash > 0 ? flashFrame(kind, step) : frame(kind, step), x, y, k);
    }
    c.restore();
    if (f.state === 'attack' && !(A_.has(key) && f.type === 'ram')) { // a white glint: his blade's coming down. On a picture it's in his right hand, left of the picture, already raised; the ram's picture has no blade
      const u = Math.min(1, f.t / T.attackWindup), art = A_.has(key), gx = x + h * (art ? -0.17 : 0.22), gy = y - h * (art ? 0.86 + u * 0.14 : 0.42 + u * 0.3);
      c.globalAlpha = 0.4 + u * 0.6; A_.circle(c, gx, gy, 3 + u * 5, '#ffffff', 1.2); c.globalAlpha = 1;
    }
    if (f.state === 'stun') A_.text(c, '!', x, y - h - 8, { size: 14, color: '#c9ced8', align: 'center' });
    if (f.type === 'ram' && f.hp < T.foes.ram.hp) { for (let i = 0; i < T.foes.ram.hp; i++) A_.circle(c, x - 14 + i * 14, y - h - 8, 4, i < f.hp ? A_.GOLD : '#3a3d45', 1.4); }
    if (f.type === 'ram' && f.breakT > 0) A_.text(c, 'BREAKING', x, y - h - 18, { size: 14, color: '#ff9a4a', align: 'center' });
  };
  HD.drawFlung = function (c, k) {
    const A_ = A(), a = Math.max(0, 1 - k.age / 0.8), kind = k.type === 'rope' ? 'grunt' : k.type === 'shield' ? 'grunt' : k.type;
    c.save(); c.globalAlpha = a; c.translate(k.x, k.y); c.rotate(k.spin);
    if (!A_.draw(c, KEY[k.type] || 'trooper_walk', 1, 0, 0, k.h)) HD.stamp(c, frame(kind, 1), 0, 0, k.h / 100);
    c.restore();
  };

  HD.drawHekka = function (c, x, y, h) {
    const A_ = A();
    if (A_.draw(c, 'hekka_front', 0, x, y, h)) return;
    c.save(); c.translate(x, y); c.scale(h / 100, h / 100); c.lineCap = 'round'; c.lineJoin = 'round';
    const SK = '#a97a56', G = '#6f7178', D = '#34363d', HAIR = '#141319';
    A_.line(c, 28, 4, 28, -122, 2.6, A_.INK); A_.line(c, 28, 4, 28, -122, 1.2, '#70737c');
    A_.poly(c, [[24, -122], [32, -122], [33, -112], [36, -102], [28, -96], [24, -110]], BLADE, 1);   // the bond-cutter lance
    A_.blob(c, [[-13, -96], [0, -103], [13, -96], [16, -76], [17, -62], [-17, -62], [-16, -76]], HAIR, 1.4);
    for (const s of [-1, 1]) {
      A_.joined(c, [{ a: [s * 6, -46], b: [s * 8, -12], ra: 7, rb: 6, color: D }], 1);
      A_.poly(c, [[s * 8 - 5.5, -24], [s * 8 + 5.5, -24], [s * 8 + 5, -6], [s * 8 - 5, -6]], G, 1);
      A_.poly(c, [[s * 8 - 6, -6], [s * 8 + 6, -6], [s * 8 + 7, 0], [s * 8 - 7, 0]], BOOT, 1);
      A_.joined(c, [{ a: [s * 14, -76], b: [s * 20, -60], ra: 4, rb: 3.4, color: D }, { a: [s * 20, -60], b: [s * 23, -46], ra: 3.6, rb: 3.2, color: G }], 1);
      A_.circle(c, s * 23.4, -43, 3, GLOVE, 0.9);
      A_.poly(c, [[s * 10, -80], [s * 18, -80], [s * 20, -71], [s * 12, -70]], G, 1.1);
    }
    A_.poly(c, [[-9, -56], [9, -56], [10.6, -46], [-10.6, -46]], SK, 1);   // the bare waist
    A_.circle(c, 5, -51, 2, null, 0.7, '#d6a58e');                         // and the ring scar where her bond was
    A_.poly(c, [[-12, -80], [12, -80], [10, -56], [-10, -56]], G, 1.3);
    bar(c, 0, -71);
    A_.poly(c, [[-11, -47], [11, -47], [11, -44], [-11, -44]], BOOT, 0.7);
    A_.poly(c, [[-3.4, -86], [3.4, -86], [4, -80], [-4, -80]], COLLAR, 0.9);
    A_.ellipse(c, 0, -92, 6.4, 7.6, SK, 1.1);
    A_.poly(c, [[-7, -96], [-2, -101], [7, -100], [6, -95], [0, -97]], HAIR, 0);
    A_.line(c, -3.8, -92.6, -1.6, -92, 0.9, HAIR); A_.line(c, 1.6, -92, 3.8, -92.6, 0.9, HAIR);
    c.restore();
  };
})();
