// Kit figures: code-drawn adults in the show's style (ink outline, flat colour, one shadow tone), about 6 to 7 heads tall.
// This file: poses, the skeleton, the bake cache. figure-limbs.js draws arms and legs; figure-parts.js the torso, coats, head and hair.
// Kit.art.person(ctx, 'trooper', { x, y, h, pose: 'run', t, flip, phase, glow }). x, y = between the feet; faces right unless flip.
// Looks live in cast.js. The poses are plain action poses; add new ones by passing an object in the same shape.
(function () {
  const A = Kit.art, sin = Math.sin, cos = Math.cos;
  const THIGH = 25, SHIN = 25, UPPER = 16.5, FORE = 15.5, SPINE = 31, FULL = 104;

  // Angles in radians. 0 hangs straight down, positive swings forward (the way the figure faces).
  // armN/armF: near and far arm [shoulder, elbow bend]; legN/legF: [hip, knee bend].
  const POSES = {
    idle: t => ({ lean: 0.03, armN: [0.1 + sin(t * 2) * 0.03, 0.35], armF: [-0.14, 0.3], legN: [0.14, 0.1], legF: [-0.12, 0.1] }),
    walk: t => { const p = t * 7, s = sin(p); return { lean: 0.06, armN: [-s * 0.5, 0.35], armF: [s * 0.5, 0.35], legN: [s * 0.5 + 0.05, 0.2 + Math.max(0, -cos(p)) * 0.6], legF: [-s * 0.5 + 0.05, 0.2 + Math.max(0, cos(p)) * 0.6] }; },
    run: t => { const p = t * 12, s = sin(p); return { fist: true, lean: 0.24, armN: [-s * 0.95, 1.4], armF: [s * 0.95, 1.4], legN: [s * 0.82 + 0.22, 0.35 + Math.max(0, -cos(p)) * 1.25], legF: [-s * 0.82 + 0.22, 0.35 + Math.max(0, cos(p)) * 1.25] }; },
    creep: t => { const p = t * 5, s = sin(p); return { lean: 0.5, armN: [0.75, 0.9], armF: [0.25, 1.0], legN: [0.75 + s * 0.3, 1.15 - s * 0.2], legF: [0.35 - s * 0.3, 1.0 + s * 0.2] }; },
    hide: () => ({ lean: 0.62, armN: [0.9, 1.25], armF: [0.6, 1.3], legN: [1.25, 2.0], legF: [0.85, 1.75] }),
    jump: () => ({ fist: true, air: true, lean: 0.14, armN: [-0.7, 0.9], armF: [1.2, 0.5], legN: [1.05, 1.35], legF: [-0.28, 0.8] }),
    surge: () => ({ air: true, lean: 0.4, armN: [1.55, 0.05], armF: [-1.1, 0.5], legN: [0.6, 1.25], legF: [-0.5, 0.6] }),
    fall: t => ({ air: true, lean: 0.02, armN: [2.3 + sin(t * 14) * 0.15, 0.3], armF: [-2.2 + sin(t * 14) * 0.15, 0.3], legN: [0.4, 0.45], legF: [-0.08, 0.3] }),
    hurt: () => ({ lean: -0.32, tilt: -0.2, armN: [1.25, 0.25], armF: [-0.9, 0.3], legN: [0.42, 0.25], legF: [-0.2, 0.4] }),
    brace: () => ({ fist: true, lean: 0.14, armN: [1.15, 1.7], armF: [0.85, 1.7], legN: [0.5, 0.45], legF: [-0.42, 0.25] }),
    aim: () => ({ lean: 0.05, armN: [1.5, 0.04], armF: [0.25, 0.7], legN: [0.3, 0.15], legF: [-0.3, 0.15] }),
    // One-shot moves: phase runs 0 (wind-up) to 1 (follow-through).
    throw: (t, ph) => { const u = ph === undefined ? 0.6 : ph; return { lean: -0.12 + u * 0.36, armN: [-2.0 + u * 3.5, 0.9 - u * 0.75], armF: [0.75 - u * 1.1, 0.5], legN: [0.46, 0.22], legF: [-0.36, 0.18] }; },
    swing: (t, ph) => { const u = ph === undefined ? 0.6 : ph; return { fist: true, lean: -0.05 + u * 0.3, armN: [2.3 - u * 1.9, 0.2], armF: [-0.6 + u * 0.8, 0.6], legN: [0.5, 0.35], legF: [-0.34, 0.2] }; },
    down: () => ({ air: true, rot: 1.48, lean: 0, tilt: 0.1, armN: [0.6, 0.2], armF: [-0.3, 0.2], legN: [0.12, 0.08], legF: [-0.05, 0.1] }),
  };
  A.POSES = POSES;

  function shoot(x, y, ang, len) { return [x + sin(ang) * len, y + cos(ang) * len]; }

  // One leg: knee and ankle from the hip. A knee only bends backwards.
  function legPts(hx, hy, leg) { const k = shoot(hx, hy, leg[0], THIGH), f = shoot(k[0], k[1], leg[0] - leg[1], SHIN); return { k, f, ang: leg[0] - leg[1] }; }
  function armPts(sx, sy, arm) { const e = shoot(sx, sy, arm[0], UPPER), w = shoot(e[0], e[1], arm[0] + arm[1], FORE); return { e, w, ang: arm[0] + arm[1] }; }

  // Everything is drawn in units (a standing figure is FULL units tall), scaled to the height asked for.
  A.person = function (ctx, id, o = {}) {
    const look = A.cast[id] || A.cast.trooper;
    const h = o.h || 80, k = h / FULL, t = o.t || 0;   // h is the true height, boots to crown
    const make = typeof o.pose === 'object' && o.pose ? () => o.pose : (POSES[o.pose] || POSES.idle);
    const p = make(t, o.phase);
    const hipH = THIGH + SHIN + 2;
    const hx = 0;
    let hy = -hipH;

    const near = legPts(hx, hy, p.legN), far = legPts(hx, hy, p.legF);
    if (!p.air) { const low = Math.max(near.f[1], far.f[1]) + 3; hy -= low; near.k[1] -= low; near.f[1] -= low; far.k[1] -= low; far.f[1] -= low; }
    const lean = p.lean || 0;
    const cx = hx + sin(lean) * SPINE, cy = hy - cos(lean) * SPINE;       // top of the spine
    const hd = look.build.head || 0.88;                                   // about 1 in 6 of the height, as on the sheets
    const hdx = cx + sin(lean) * 10, hdy = cy - cos(lean) * 10;
    const sN = [cx + cos(lean) * 2.4, cy + sin(lean) * 2.4 + 1], sF = [cx - cos(lean) * 2.4, cy - sin(lean) * 2.4 + 1];
    const armN = armPts(sN[0], sN[1], [p.armN[0] + lean * 0.5, p.armN[1]]);
    const armF = armPts(sF[0], sF[1], [p.armF[0] + lean * 0.5, p.armF[1]]);
    const lw = Math.max(1.05, h * 0.0115) / k;

    ctx.save();
    ctx.translate(o.x || 0, o.y || 0);
    if (o.flip) ctx.scale(-1, 1);
    if (p.rot) { ctx.rotate(p.rot); ctx.translate(-h * 0.34, -h * 0.03); }
    ctx.scale(k, k);

    const pack = { c: ctx, look, lw, lean, hx, hy, cx, cy, hdx, hdy, t, p, hd, glow: o.glow || 0, sN, sF, armN, armF, near, far, mood: o.mood };
    A._behind(pack);
    A._arm(ctx, armF, sF[0], sF[1], look, look.armFar || {}, true, lw, p.fist);
    A._leg(ctx, far, hx, hy, look, true, lw);
    A._tail(pack);
    A._leg(ctx, near, hx, hy, look, false, lw);
    A._coatFront(pack);
    A._torso(pack);
    A._head(pack);
    A._arm(ctx, armN, sN[0], sN[1], look, look.armNear || {}, false, lw, p.fist);
    A._front(pack);
    ctx.restore();
  };

  // Height to pass as h for a person so the cast stands true to scale. pxPerCm: the game's scale.
  A.heightOf = (id, pxPerCm) => ((A.cast[id] || A.cast.trooper).cm || 180) * pxPerCm;

  // The same figure from a cache of ready-drawn frames. The one to use by default, for weak phones:
  // far cheaper once drawn, 8 frames per walk or run cycle. glow, phase and custom poses fall back to A.person.
  const baked = new Map(), CYCLE = { walk: Math.PI * 2 / 7, run: Math.PI * 2 / 12, creep: Math.PI * 2 / 5 };
  A.personFast = function (ctx, id, o = {}) {
    if (o.glow || o.phase !== undefined || (o.pose && typeof o.pose === 'object')) return A.person(ctx, id, o);
    const pose = o.pose || 'idle', h = Math.round(o.h || 80), per = CYCLE[pose];
    const f = per ? Math.floor((((o.t || 0) / per) % 1 + 1) % 1 * 8) : 0, key = id + pose + f + '/' + h;
    let b = baked.get(key);
    if (!b) {
      if (baked.size > 200) baked.clear();
      b = document.createElement('canvas');
      b.width = h * 3.4; b.height = h * 2.7;
      const c = b.getContext('2d');
      c.scale(2, 2);
      A.person(c, id, { x: h * 0.85, y: h * 1.25, h, pose, t: per ? ((f + 0.5) / 8) * per : 0 });
      baked.set(key, b);
    }
    ctx.save();
    ctx.translate(o.x || 0, o.y || 0);
    if (o.flip) ctx.scale(-1, 1);
    ctx.drawImage(b, -h * 0.85, -h * 1.25, h * 1.7, h * 1.35);
    ctx.restore();
  };

  // Head and shoulders on a colour wedge, for talk scenes when a person has no picture yet.
  A.bust = function (ctx, id, size, o = {}) {
    const look = A.cast[id] || A.cast.trooper, col = look.colour || '#333c75';
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, size, size); ctx.clip();
    ctx.fillStyle = o.back || '#1f2650';
    ctx.fillRect(0, 0, size, size);
    A.poly(ctx, [[0, size], [0, size * 0.3], [size, size * 0.85], [size, size]], o.wedge || A.shade(col, 0.6), 0);
    const h = size * 2.7;
    A.person(ctx, id, { x: size * 0.46, y: size * 0.07 + h,  h, pose: { lean: 0, armN: [0.05, 0.1], armF: [-0.05, 0.1], legN: [0, 0], legF: [0, 0] } });
    ctx.restore();
  };
})();
