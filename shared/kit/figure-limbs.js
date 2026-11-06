// Kit figures, part 3: arms, legs, hands and boots. Each limb is drawn as one shape: all its parts are inked first, then filled,
// so no line crosses a joint. Muscle and cloth come from bowed sides, one shadow tone along the underside, and a few ink lines.
(function () {
  const A = Kit.art, sin = Math.sin, cos = Math.cos, PI = Math.PI;

  // A segment's path: round at both ends, its sides bowed out. front and back = how much extra at the middle.
  function geom(p) {
    const an = Math.atan2(p.b[1] - p.a[1], p.b[0] - p.a[0]), nx = -sin(an), ny = cos(an);
    return { an, nx, ny, mx: (p.a[0] + p.b[0]) / 2, my: (p.a[1] + p.b[1]) / 2, rm: (p.ra + p.rb) / 2 };
  }
  function segPath(c, p) {
    const g = geom(p), cb = 2 * (g.rm + (p.back || 0)) - g.rm, cf = 2 * (g.rm + (p.front || 0)) - g.rm;
    c.beginPath();
    c.arc(p.a[0], p.a[1], p.ra, g.an + PI / 2, g.an - PI / 2);
    c.quadraticCurveTo(g.mx - g.nx * cf, g.my - g.ny * cf, p.b[0] - g.nx * p.rb, p.b[1] - g.ny * p.rb);
    c.arc(p.b[0], p.b[1], p.rb, g.an - PI / 2, g.an + PI / 2);
    c.quadraticCurveTo(g.mx + g.nx * cb, g.my + g.ny * cb, p.a[0] + g.nx * p.ra, p.a[1] + g.ny * p.ra);
    c.closePath();
  }
  // The one shadow tone: a crescent along whichever side faces down and back.
  function segShade(c, p, shade) {
    const g = geom(p), s = (g.nx * -0.5 + g.ny * 0.85) >= 0 ? 1 : -1, bow = s > 0 ? (p.back || 0) : (p.front || 0);
    const co = (2 * (g.rm + bow) - g.rm) * 0.96, ci = g.rm * 0.5;
    const x0 = p.a[0] + g.nx * s * p.ra * 0.96, y0 = p.a[1] + g.ny * s * p.ra * 0.96;
    c.beginPath();
    c.moveTo(x0, y0);
    c.quadraticCurveTo(g.mx + g.nx * s * co, g.my + g.ny * s * co, p.b[0] + g.nx * s * p.rb * 0.96, p.b[1] + g.ny * s * p.rb * 0.96);
    c.quadraticCurveTo(g.mx + g.nx * s * ci, g.my + g.ny * s * ci, x0, y0);
    c.fillStyle = shade; c.fill();
  }
  // Parts: { a, b, ra, rb, front, back, color } or { path(c), color }. Ink under everything, then the colours, so joints have no lines.
  A.joined = function (c, parts, lw) {
    const draw = p => (p.path ? p.path(c) : segPath(c, p));
    c.lineJoin = 'round'; c.lineWidth = lw * 1.7; c.strokeStyle = A.INK;
    for (const p of parts) { draw(p); c.stroke(); }
    for (const p of parts) { draw(p); c.fillStyle = p.color; c.fill(); }
    for (const p of parts) if (!p.path && !p.noShade) segShade(c, p, A.shade(p.color));
  };
  const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  // An ink line for a crease: darker on light cloth, lighter on black cloth so it still shows.
  A.crease = function (hex) {
    const n = parseInt(hex.slice(1), 16), lum = 0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255);
    return lum < 55 ? A.shade(hex, 2.1) : A.shade(hex, 0.5);
  };
  function bend(c, x1, y1, qx, qy, x2, y2, lw, col) {
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(qx, qy, x2, y2);
    c.lineWidth = lw; c.strokeStyle = col; c.lineCap = 'round'; c.stroke();
  }

  // ---- Boots: a real shape with a heel, a sole and a raised toe. fx, fy = ankle; a = how far the foot tips.
  function bootPath(fx, fy, a, size) {
    const dx = cos(a), dy = -sin(a), P = (f, d) => [fx + f * size * dx + d * sin(a), fy + f * size * dy + d * cos(a)];
    return { P, path: c => {
      const p = [P(-3.4, -2), P(-3.9, 1), P(-3.5, 3), P(8.4, 3), P(9.6, 1.4), P(8.2, -0.8), P(3.6, -2.4)];
      c.beginPath(); c.moveTo(p[0][0], p[0][1]);
      c.quadraticCurveTo(p[1][0], p[1][1], p[2][0], p[2][1]);
      c.lineTo(p[3][0], p[3][1]);
      c.quadraticCurveTo(p[4][0], p[4][1], p[5][0], p[5][1]);
      c.quadraticCurveTo(p[6][0] + 1, p[6][1], p[6][0], p[6][1]);
      c.closePath();
    } };
  }

  A._leg = function (c, L, hx, hy, look, far, lw) {
    const t = far ? (x => A.shade(x, 0.8)) : (x => x), b = look.build, hip = [hx, hy];
    const thighR = 5.5 * b.leg, kneeR = 3.8 * b.leg, ankleR = (look.baggy ? 3.9 : 2.8) * b.leg;
    const a = Math.max(-0.5, Math.min(0.9, L.ang * 0.45)), size = Math.max(1, b.leg * 0.92);
    const boot = bootPath(L.f[0], L.f[1], a, size), top = look.bootTop, shaft = top ? lerp(L.k, L.f, top) : null;
    const shinEnd = shaft ? lerp(L.k, L.f, Math.min(1, top + 0.12)) : L.f;   // inside a boot the leg stops early, so nothing pokes out under the heel
    const parts = [
      { a: hip, b: L.k, ra: thighR, rb: kneeR, front: 0.8, back: 0.5, color: t(look.thigh) },
      { a: L.k, b: shinEnd, ra: kneeR, rb: ankleR, front: 0.1, back: look.baggy ? 0.5 : 1, color: t(look.shin) },
      { path: boot.path, color: t(look.boot) },
    ];
    if (shaft) parts.push({ a: shaft, b: L.f, ra: (kneeR + ankleR) / 2 * (look.baggy ? 0.8 : 1) + 0.3, rb: Math.min(2.7, 2.5 * b.leg), color: t(look.boot) });
    A.joined(c, parts, lw);
    // Sole, in the boot's shadow tone
    const s = boot.P, sole = [s(-3.5, 2), s(8.8, 2), s(8.4, 3), s(-3.5, 3)];
    A.poly(c, sole, A.shade(t(look.boot), 0.5), 0);
    const fold = A.crease(t(look.thigh)), thin = lw * 0.55;
    // A knee crease on the inside of the bend, and two creases where the cloth bunches
    const kx = L.k[0], ky = L.k[1];
    if (look.thigh !== look.skin) {
      const tx = (hx - kx) / 25, ty = (hy - ky) / 25;
      bend(c, kx - 2, ky + 0.2, kx + tx * 3, ky + ty * 3, kx + 1.6, ky - 1.2, thin, fold);
      bend(c, kx + tx * 12 - 2.4, ky + ty * 12, kx + tx * 15, ky + ty * 15, kx + tx * 15 + 3, ky + ty * 15, thin, fold);
      const mx = (kx + L.f[0]) / 2, my = (ky + L.f[1]) / 2;
      bend(c, mx - 2.2, my - 1.4, mx, my + 0.8, mx + 2.2, my + 0.3, thin, A.crease(t(look.shin)));
    }
    if (look.cargo && !far) { // A cargo pocket with a flap, on the side of the thigh
      const an = Math.atan2(L.k[1] - hy, L.k[0] - hx) - PI / 2;
      c.save(); c.translate(hx + (kx - hx) * 0.62, hy + (ky - hy) * 0.62); c.rotate(an);
      A.poly(c, [[-3.7, -3.4], [3.7, -3.4], [3.5, 3.9], [-3.5, 3.9]], A.shade(look.thigh, 0.86), thin);
      A.poly(c, [[-4, -4.1], [4, -4.1], [4, -1.8], [-4, -1.8]], A.shade(look.thigh, 1.1), thin);
      c.restore();
    }
    if (shaft) {
      if (look.baggy) { // The trouser cuff bunched over the boot
        const u = lerp(L.k, L.f, top - 0.04), r = ankleR * 1.08;
        A.ellipse(c, u[0], u[1], r, 1.8, t(look.shin), lw * 0.7, A.INK, -L.ang);
      }
      if (look.laces) { // Laces up the front, and a strap at the top of the boot
        const fx = cos(L.ang), fy = -sin(L.ang), r = 2.9 * b.leg;
        for (let i = 1; i <= 3; i++) {
          const q = lerp(shaft, L.f, i / 4);
          A.line(c, q[0] + fx * (r - 2), q[1] + fy * (r - 2), q[0] + fx * (r + 0.1), q[1] + fy * (r + 0.1), 0.55, look.laces);
        }
        const st = lerp(shaft, L.f, 0.1);
        A.line(c, st[0] - fx * (r + 0.3), st[1] - fy * (r + 0.3), st[0] + fx * (r + 0.3), st[1] + fy * (r + 0.3), 1, A.shade(t(look.boot), 0.55));
      }
    }
  };

  // ---- Arms and hands. Open hand or fist, with a thumb and fingers: never a ball.
  function handPath(w, ang, s, fist) {
    const dx = sin(ang), dy = cos(ang), px = cos(ang), py = -sin(ang);
    const P = (u, v) => [w[0] + (dx * u + px * v) * s, w[1] + (dy * u + py * v) * s];
    const pts = fist ? [P(0, -1.9), P(3, -2.8), P(6, -2.2), P(6.4, 0), P(5.8, 2.3), P(3, 2.8), P(0, 1.9)]
      : [P(0, -1.8), P(4.4, -2.4), P(9, -1.6), P(9.8, 0), P(8.8, 1.8), P(4.6, 2.4), P(0, 1.8)];
    return { P, path: c => {
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) { const q = pts[i], r = pts[i + 1]; c.quadraticCurveTo(q[0], q[1], (q[0] + r[0]) / 2, (q[1] + r[1]) / 2); }
      c.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]); c.closePath();
    } };
  }

  A._arm = function (c, Ar, sx, sy, look, side, far, lw, fist) {
    const t = far ? (x => A.shade(x, 0.8)) : (x => x), b = look.build, r = 3.7 * b.arm, m = 2.9 * b.arm, e = 2.15 * Math.max(1, b.arm * 0.9);
    const upper = side.upper || look.upper, lower = side.lower || look.lower, hand = side.hand || look.hand;
    const s = Math.max(0.9, b.arm * 0.82), H = handPath(Ar.w, Ar.ang, s, fist);
    const thumbA = H.P(1.6, 1.4), thumbB = fist ? H.P(4.6, 3) : H.P(5.2, 3.6);
    const parts = [
      { a: thumbA, b: thumbB, ra: 1.1 * s, rb: 0.85 * s, color: t(hand), noShade: true },
      { path: H.path, color: t(hand) },
      { a: [sx, sy], b: Ar.e, ra: r, rb: m, front: 0.9 * b.arm, back: 0.45 * b.arm, color: t(upper) },
      { a: Ar.e, b: Ar.w, ra: m, rb: e, front: 0.75 * b.arm, back: 0.3 * b.arm, color: t(lower) },
    ];
    A.joined(c, parts, lw);
    const thin = lw * 0.5, ink = A.crease(t(hand));
    if (fist) for (const v of [-0.9, 0.3, 1.4]) A.line(c, H.P(4.2, v)[0], H.P(4.2, v)[1], H.P(6, v)[0], H.P(6, v)[1], thin, ink);
    else for (const v of [-0.85, 0.05, 0.95]) A.line(c, H.P(5.2, v)[0], H.P(5.2, v)[1], H.P(9.2, v)[0], H.P(9.2, v)[1], thin, ink);
    if (upper !== lower) { // Where a sleeve ends
      const px = cos(Ar.ang - 0), py = -sin(Ar.ang - 0);
      A.line(c, Ar.e[0] - px * m, Ar.e[1] - py * m, Ar.e[0] + px * m, Ar.e[1] + py * m, thin * 1.4, A.INK);
    } else if (upper === look.skin) { // Bare arm: the line of the shoulder, the bicep and the forearm
      const muscle = A.shade(look.skin, 0.62), ex = Ar.e[0], ey = Ar.e[1], ux = (sx - ex) / 16.5, uy = (sy - ey) / 16.5;
      bend(c, ex + ux * 11 + uy * r * 0.8, ey + uy * 11 - ux * r * 0.8, ex + ux * 9, ey + uy * 9, ex + ux * 10 - uy * r * 0.7, ey + uy * 10 + ux * r * 0.7, thin, muscle);
      bend(c, ex + ux * 3, ey + uy * 3, ex + ux * 6 + uy * 1.2, ey + uy * 6 - ux * 1.2, ex + ux * 8.5, ey + uy * 8.5, thin, muscle);
    }
  };

  // Kaito's arm, on top of everything (kaito-sheet-v8.png): lightning scars from wrist to elbow, three separate bands on the bare forearm, the branching mark on the hand.
  const SCARS = [[[0.98, 0.4], [0.84, -0.5]], [[0.84, -0.5], [0.7, 0.45]], [[0.7, 0.45], [0.55, -0.35]], [[0.55, -0.35], [0.38, 0.4]], [[0.38, 0.4], [0.22, -0.3]], [[0.22, -0.3], [0.06, 0.2]], [[0.7, 0.45], [0.62, 0.85]], [[0.38, 0.4], [0.3, 0.85]], [[0.84, -0.5], [0.78, -0.9]]];
  A._gauntlet = function (c, P) {
    const { look, lw, armN, glow } = P, e = armN.e, w = armN.w, b = look.build, ang = armN.ang;
    const m = 2.9 * b.arm, end = 2.15 * Math.max(1, b.arm * 0.9), px = cos(ang), py = -sin(ang);
    const at = (u, v) => { const r = m + (end - m) * u; return [e[0] + (w[0] - e[0]) * u + px * v * r, e[1] + (w[1] - e[1]) * u + py * v * r]; };
    c.lineCap = 'round';
    c.beginPath();
    for (const s of SCARS) { const q = at(s[0][0], s[0][1]), z = at(s[1][0], s[1][1]); c.moveTo(q[0], q[1]); c.lineTo(z[0], z[1]); }
    if (glow) { c.lineWidth = 1.5; c.strokeStyle = 'rgba(242,210,27,.5)'; c.stroke(); }
    c.lineWidth = 0.6; c.strokeStyle = look.scarColor || '#f6d98a'; c.stroke();
    for (const u of [0.3, 0.52, 0.74]) {
      const half = 0.075, r = 1.14;
      A.poly(c, [at(u - half, -r), at(u + half, -r), at(u + half, r), at(u - half, r)], look.gauntlet, lw * 0.6);
      A.poly(c, [at(u - half * 0.5, -r), at(u + half * 0.5, -r), at(u + half * 0.5, -0.25), at(u - half * 0.5, -0.25)], A.shade(look.gauntlet, 1.25), 0);
      A.poly(c, [at(u - half * 1.1, r), at(u + half * 1.1, r), at(u + half * 1.1, r + 0.42), at(u - half * 1.1, r + 0.42)], A.shade(look.gauntlet, 0.7), lw * 0.45);
    }
    // The bond mark: a stem that forks into three points, on the back of the hand
    const s = Math.max(0.9, b.arm * 0.82), dx = sin(ang), dy = cos(ang), H = (u, v) => [w[0] + (dx * u + px * v) * s, w[1] + (dy * u + py * v) * s];
    const fork = [[[0.8, 0], [3, 0.15]], [[3, 0.15], [5.2, -1.3]], [[3, 0.15], [5.5, 0.1]], [[3, 0.15], [5, 1.5]]];
    c.beginPath();
    for (const f of fork) { const q = H(f[0][0], f[0][1]), z = H(f[1][0], f[1][1]); c.moveTo(q[0], q[1]); c.lineTo(z[0], z[1]); }
    if (glow) { c.lineWidth = 2.2; c.strokeStyle = 'rgba(242,210,27,.55)'; c.stroke(); }
    c.lineWidth = 0.85 + glow * 0.25; c.strokeStyle = look.markColor; c.stroke();
  };
})();
