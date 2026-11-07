// Storm Run: the Hollow hound (hollow-hound-sheet-v1.png), in code, the fallback for art/silt-hound-*.webp; Silt on its back is in rider.js.
// Poses: run (6 frames), crouch, leap, rear (core shows), yelp, down. Faces right; origin = on the road under its middle.
window.SR = window.SR || {};
(function () {
  const A = () => Kit.art;
  const HIDE = '#a59c97', HIDE_D = '#827a76', PLATE = '#3d3e48', CABLE = '#15161d';
  const sin = Math.sin, cos = Math.cos;

  // A vein: a black cable with a dull shine down its middle, thick enough to read at phone size. trace draws its path.
  function cable(c, trace, thick) {
    const t = thick || 3.2;
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); trace(c); c.lineWidth = t; c.strokeStyle = CABLE; c.stroke();
    c.beginPath(); trace(c); c.lineWidth = t * 0.32; c.strokeStyle = '#5b5c69'; c.stroke();
  }

  // A long leg, thick and continuous from the body to a big clawed paw. a = swing, b = knee bend.
  function leg(c, hx, hy, a, b, far, hind) {
    const A_ = A(), col = far ? HIDE_D : HIDE, L1 = hind ? 27 : 24, L2 = 26, L3 = 15;
    const a2 = a - b, a3 = a2 + (hind ? 0.75 : 0.3);
    const kx = hx + sin(a) * L1, ky = hy + cos(a) * L1;
    const sx = kx + sin(a2) * L2, sy = ky + cos(a2) * L2;
    const fx = sx + sin(a3) * L3, fy = sy + cos(a3) * L3 - 1.5;
    const paw = cc => { cc.beginPath(); cc.moveTo(fx - 6.5, fy - 4); cc.quadraticCurveTo(fx + 2, fy - 7.5, fx + 8, fy - 3.5); cc.quadraticCurveTo(fx + 14, fy - 1, fx + 14.5, fy + 4.8); cc.lineTo(fx - 5.5, fy + 4.8); cc.closePath(); };
    A_.joined(c, [
      { a: [hx, hy], b: [kx, ky], ra: hind ? 15.5 : 12.5, rb: 7.6, front: 1.5, back: hind ? 3 : 1.5, color: col },
      { a: [kx, ky], b: [sx, sy], ra: 7.6, rb: 5.2, back: 0.8, color: col },
      { a: [sx, sy], b: [fx, fy], ra: 5.2, rb: 5.4, color: col },
      { path: paw, color: col },
    ], 1.15);
    const dark = A_.shade(col, 0.55);
    [2.5, 6.5, 10].forEach(d => A_.line(c, fx + d, fy - 2 + d * 0.25, fx + d + 1, fy + 2.4, 1.1, dark));
    [3.6, 8, 12.2].forEach(d => A_.poly(c, [[fx + d, fy + 2.4], [fx + d + 5.4, fy + 4.8], [fx + d + 2, fy + 5.2], [fx + d - 1.4, fy + 4.6]], PLATE, 0.9));
    if (!far) { // cable veins down the leg, forking at the joint
      cable(c, cc => { cc.moveTo(hx + 3, hy + 2); cc.quadraticCurveTo(kx + 5, ky - 6, (kx + sx) / 2 + 1, (ky + sy) / 2); cc.quadraticCurveTo(sx - 2, sy - 2, fx - 1, fy - 5); }, 2.4);
      cable(c, cc => { cc.moveTo((hx + kx) / 2 + 3, (hy + ky) / 2); cc.quadraticCurveTo(kx - 7, ky - 2, kx - 3.5, ky + 8); }, 1.9);
    }
  }

  function plate(c, x, y, r, rot) {
    const A_ = A(), pts = [];
    for (let i = 0; i < 5; i++) { const an = rot + i / 5 * Math.PI * 2; pts.push([x + cos(an) * r, y + sin(an) * r]); }
    A_.poly(c, pts, PLATE, 1.6);
    A_.poly(c, pts.map(p => [p[0] * 0.75 + x * 0.25, p[1] * 0.75 + y * 0.25]).slice(0, 3), A_.shade(PLATE, 1.25), 0);
    for (let i = 0; i < 5; i++) A_.circle(c, pts[i][0] * 0.78 + x * 0.22, pts[i][1] * 0.78 + y * 0.22, 0.95, '#73757f', 0);
  }

  // open: 0 = plates shut over the core, 1 = core bare and blazing.
  function core(c, x, y, open, pulse) {
    const A_ = A();
    if (open > 0) {
      c.fillStyle = 'rgba(255,255,255,' + (0.28 + pulse * 0.22) + ')';
      c.beginPath(); c.arc(x, y, 15 + pulse * 4, 0, 7); c.fill();
    }
    A_.circle(c, x, y, 10, PLATE, 1.8);
    A_.circle(c, x, y, 6.8, open > 0 ? '#ffffff' : '#cfd2d8', 1);
    for (let i = 0; i < 8; i++) { const an = i / 8 * Math.PI * 2; A_.circle(c, x + cos(an) * 8.4, y + sin(an) * 8.4, 0.7, '#8a8c96', 0); }
    if (open < 1) { // two round shutters over it, a white slit showing between
      c.beginPath(); c.arc(x, y - 1.2, 8, Math.PI, 0); c.closePath(); c.fillStyle = PLATE; c.fill(); c.lineWidth = 1.1; c.strokeStyle = A_.INK; c.stroke();
      c.beginPath(); c.arc(x, y + 1.2, 8, 0, Math.PI); c.closePath(); c.fill(); c.stroke();
    }
  }

  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  function soft(c, pts) { // a soft-cornered path through pts
    const n = pts.length, m0 = mid(pts[n - 1], pts[0]);
    c.beginPath(); c.moveTo(m0[0], m0[1]);
    pts.forEach((p, i) => { const m = mid(p, pts[(i + 1) % n]); c.quadraticCurveTo(p[0], p[1], m[0], m[1]); });
    c.closePath();
  }

  // Everything that sits behind the near legs: tail, neck and barrel as one shape, head.
  function body(c) {
    const A_ = A();
    // A deep chest, a tucked waist, a long neck rising out of the shoulders. Inked as one, so no line crosses the neck.
    const trunk = [[-70, -60], [-66, -72], [-40, -76], [-8, -72], [24, -80], [40, -96], [56, -114], [74, -108], [76, -92], [66, -74], [64, -56], [46, -35], [12, -36], [-20, -48], [-50, -49]];
    A_.joined(c, [
      { a: [-62, -68], b: [-98, -72], ra: 5.5, rb: 2.8, color: HIDE, noShade: true },
      { a: [-98, -72], b: [-136, -68], ra: 2.8, rb: 0.7, color: HIDE, noShade: true },
      { path: cc => soft(cc, trunk), color: HIDE },
    ], 1.2);
    // The one shadow tone, under the belly and the neck
    c.save(); soft(c, trunk); c.clip();
    A_.poly(c, [[-76, -48], [-50, -56], [-20, -55], [8, -45], [30, -43], [50, -46], [60, -30], [-76, -30]], HIDE_D, 0);
    A_.poly(c, [[80, -110], [68, -92], [58, -72], [54, -60], [72, -50], [90, -90]], HIDE_D, 0);
    c.restore();
    // Ribs
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-10 + i * 8, -69 + i); c.quadraticCurveTo(-3 + i * 8, -58 + i, -10 + i * 8, -44 + i * 2); c.lineWidth = 1.3; c.strokeStyle = A_.shade(HIDE, 0.6); c.lineCap = 'round'; c.stroke(); }
    // Head: long muzzle, flat skull plate, tall ears
    A_.poly(c, [[62, -116], [76, -116], [90, -106], [114, -99], [115, -94], [92, -89], [72, -88], [60, -98]], HIDE, 1.8);
    A_.poly(c, [[72, -88], [92, -89], [112, -94], [92, -96], [76, -96]], HIDE_D, 0);
    A_.poly(c, [[112, -100], [117, -98], [116, -93.6], [111, -94.6]], A_.INK, 0);
    A_.line(c, 90, -91.5, 112, -94.6, 1);
    A_.poly(c, [[62, -114], [58, -150], [75, -116]], HIDE, 1.6); A_.poly(c, [[64.5, -116], [61, -141], [71.6, -117]], PLATE, 0);
    A_.poly(c, [[71, -116], [71, -152], [84, -111]], HIDE, 1.6); A_.poly(c, [[73.4, -116], [73.6, -143], [80.8, -113]], PLATE, 0);
    // Plate down the brow, blank white eye
    A_.poly(c, [[61, -114], [78, -113], [94, -103], [82, -104], [66, -104]], PLATE, 1.2);
    c.fillStyle = 'rgba(255,255,255,.32)'; c.beginPath(); c.arc(83, -101, 5.5, 0, 7); c.fill();
    A_.poly(c, [[77, -103], [88, -99.6], [78, -98]], '#ffffff', 0.8);
  }

  // What's bolted on over the near legs: the cable veins from the core, plates, the core itself.
  function armour(c, open, pulse) {
    // Veins first, so they run in under the plates: up the neck, along the belly to the hip, forks onto the ribs.
    cable(c, cc => { cc.moveTo(52, -54); cc.bezierCurveTo(58, -68, 70, -82, 68, -100); });
    cable(c, cc => { cc.moveTo(52, -54); cc.bezierCurveTo(46, -66, 54, -82, 58, -94); }, 2.6);
    cable(c, cc => { cc.moveTo(60, -74); cc.quadraticCurveTo(70, -82, 74, -94); }, 2);
    cable(c, cc => { cc.moveTo(52, -54); cc.bezierCurveTo(30, -34, 12, -56, -14, -52); cc.bezierCurveTo(-28, -50, -36, -54, -44, -60); }, 3.4);
    cable(c, cc => { cc.moveTo(34, -44); cc.quadraticCurveTo(22, -40, 16, -38); }, 2.2);
    cable(c, cc => { cc.moveTo(8, -50); cc.quadraticCurveTo(-1, -60, -2, -70); }, 2.2);
    cable(c, cc => { cc.moveTo(-14, -52); cc.quadraticCurveTo(-24, -60, -22, -72); }, 2);
    // Neck plates, shoulder and hip plates, as on the sheet
    plate(c, 54, -103, 9, 0.3); plate(c, 44, -91, 10, 0.9); plate(c, 35, -78, 10.5, 1.5);
    plate(c, 26, -62, 17, 0.4); plate(c, -50, -64, 16, 1.2);
    core(c, 52, -54, open, pulse);
  }

  // Each pose: leg swings, and how the body sits. px, py = the point it rocks around.
  const FRAMES = {
    run: f => { const p = f / 6 * Math.PI * 2; return { rot: sin(p) * 0.05, y: -2 - Math.abs(cos(p)) * 6, fn: [sin(p) * 0.85 + 0.15, 0.25 + Math.max(0, -sin(p)) * 1.0], ff: [sin(p + 0.7) * 0.85 + 0.15, 0.25 + Math.max(0, -sin(p + 0.7)) * 1.0], hn: [-sin(p + 0.4) * 0.8 + 0.35, 0.65 + Math.max(0, sin(p + 0.4)) * 0.6], hf: [-sin(p + 1.1) * 0.8 + 0.35, 0.65 + Math.max(0, sin(p + 1.1)) * 0.6] }; },
    crouch: () => ({ rot: 0.12, y: 16, fn: [1.79, 2.45], ff: [1.79, 2.48], hn: [1.25, 2.0], hf: [1.4, 2.05] }),   // all four paws on the road
    leap: () => ({ rot: -0.1, y: -2, fn: [1.25, 0.15], ff: [1.05, 0.2], hn: [-1.0, 0.1], hf: [-0.8, 0.15] }),
    rear: () => ({ rot: -0.52, y: 0, px: -48, py: -6, fn: [1.4, 1.55], ff: [0.95, 1.45], hn: [0.62, 0.6], hf: [0.3, 0.45] }),
    yelp: () => ({ rot: -0.16, y: 0, px: -48, py: -6, fn: [1.05, 0.9], ff: [0.6, 0.7], hn: [0.3, 0.45], hf: [-0.1, 0.3] }),
    down: () => ({ rot: 0.28, y: 12, fn: [1.3, -0.1], ff: [1.1, -0.1], hn: [1.2, 0.1], hf: [1.0, 0.1] }),
  };

  function paint(c, name, f, o) {
    const P = FRAMES[name](f);
    c.save();
    c.translate(0, P.y);
    if (P.px !== undefined) { c.translate(P.px, P.py); c.rotate(P.rot); c.translate(-P.px, -P.py); } else c.rotate(P.rot);
    leg(c, 30, -52, P.ff[0], P.ff[1], true, false);
    leg(c, -46, -56, P.hf[0], P.hf[1], true, true);
    body(c);
    leg(c, 24, -52, P.fn[0], P.fn[1], false, false);
    leg(c, -52, -56, P.hn[0], P.hn[1], false, true);
    armour(c, o.open, o.pulse);
    if (o.rider) SR.drawRider(c, -22, -76, o.armUp);
    c.restore();
  }

  const bakePose = (name, f, armUp, riding, open, pulse) => SR.bake('hound' + name + f + (armUp ? 'u' : '') + (riding ? 'r' : '') + open + pulse, 300, 240, 150, 190, cc => paint(cc, name, f, { open, pulse, rider: riding, armUp }));
  // Every pose drawn up front, before the boss's talk scene, so no pose costs a stutter the first time it shows on a weak phone.
  SR.prebakeHound = function () {
    for (let f = 0; f < 6; f++) { bakePose('run', f, false, true, 0, 0); bakePose('run', f, true, true, 0, 0); }
    ['crouch', 'leap', 'yelp'].forEach(n => bakePose(n, 0, false, true, 0, 0));
    bakePose('rear', 0, false, true, 0, 0); bakePose('rear', 0, false, true, 1, 0); bakePose('rear', 0, false, true, 1, 1);
    bakePose('down', 0, false, false, 0, 0);
  };

  // Draws the hound for the boss's current state. Pictures (art/REQUEST.md), when they exist, take over.
  SR.drawHound = function (c, b, t) {
    const name = b.state === 'tell' || b.state === 'shut' ? 'crouch'
      : b.state === 'lunge' || b.state === 'back' || b.state === 'retreat' ? 'leap'
        : b.state === 'open' || b.state === 'land' ? 'rear'
          : b.state === 'stagger' ? 'yelp' : b.state === 'fall' ? 'down' : 'run';
    const y = TUNE.groundY - b.alt, open = b.state === 'open' ? 1 : 0, f = name === 'run' ? Math.floor(t * 13) % 6 : 0;
    const armUp = b.throwArm > 0, pulse = open ? Math.round(sin(t * 12) * 0.5 + 0.5) : 0;
    let key = 'silt_hound_' + (name === 'run' && armUp ? 'throw' : name), flip = b.flip;
    if (b.flip && Kit.art.has(key + '_left')) { key += '_left'; flip = false; }   // drawn from his left side, so his blade and eye slit never swap sides
    if (Kit.art.draw(c, key, name === 'run' ? Kit.art.frameAt(key, t) : 0, b.x, y, 150, flip)) {
      if (name === 'rear') core(c, SR.coreX(b), TUNE.groundY - SR.coreAlt(), open, pulse);   // the target: drawn by the rules, shut until it can really be hit
    } else if (!(name === 'run' && armUp && Kit.art.draw(c, 'silt_hound_run', Kit.art.frameAt('silt_hound_run', t), b.x, y, 150, flip))) {
      SR.stamp(c, bakePose(name, f, armUp, b.state !== 'fall', open, pulse), b.x, y, b.flip);
    }
    if (b.state === 'open') SR.ringPrompt(c, SR.coreX(b), TUNE.groundY - SR.coreAlt(), t);
    if (b.flash > 0) { c.fillStyle = 'rgba(255,255,255,' + Math.min(0.6, b.flash) + ')'; c.beginPath(); c.arc(SR.coreX(b), TUNE.groundY - SR.coreAlt(), 70 * (1 - b.flash), 0, 7); c.fill(); }
  };

  // When Silt is thrown clear at the end.
  SR.drawThrownSilt = function (c, b) {
    const u = 1 - b.t / b.total, x = b.x + 40 + u * 130, y = TUNE.groundY - 30 - Math.sin(u * Math.PI) * 90 + u * 28;
    Kit.art.person(c, 'silt', { x, y, h: Kit.art.heightOf('silt', TUNE.pxPerCm), pose: 'down', t: 0 });
  };
})();
