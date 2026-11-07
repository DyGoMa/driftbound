// Tide Gap: Hekka's Sever cutter, her figure, the lances and the pylon chains. Drawing only.
// Hekka per hekka-sheet-v6.png and CAST.md: grey plates, bare midriff with the ring scar, dark trousers, long black hair, a lance taller than she is. Small and plain in code; a picture when art exists.
window.TG = window.TG || {};
(function () {
  const T = TUNE, B = T.boss, A = () => Kit.art;
  const STEEL = '#737a84', STEEL_LO = '#555b65', STEEL_HI = '#9aa1ab', WHITE = '#e9edf0';

  const hull = () => TG.bake('cutter', 170, 230, 85, 110, c => {
    const A_ = A(), HW = B.cutterHalfW, HL = B.cutterHalfLen;
    // Bow points down the screen, at you. A hard angular wedge, nothing like the Gullwake's patched curves.
    const out = [[-HW * 0.72, -HL], [HW * 0.72, -HL], [HW, -HL * 0.45], [HW, HL * 0.2], [HW * 0.55, HL * 0.72], [0, HL + 12], [-HW * 0.55, HL * 0.72], [-HW, HL * 0.2], [-HW, -HL * 0.45]];
    A_.poly(c, out.map(p => [p[0] + 5, p[1] + 9]), 'rgba(8,16,30,.4)', 0);
    A_.poly(c, out, STEEL_LO, 2.8);
    const deck = out.map(p => [p[0] * 0.86, p[1] * 0.9]);
    A_.poly(c, deck, STEEL, 2);
    c.save(); A_.poly(c, deck, null, 0); c.clip();
    A_.poly(c, [[6, -HL], [HW, -HL], [HW, HL + 12], [6, HL + 12]], STEEL_LO, 0);
    for (let y = -HL; y < HL; y += 22) A_.line(c, -HW, y, HW, y, 1, 'rgba(16,18,31,.5)');
    A_.line(c, 0, -HL, 0, HL + 12, 1, 'rgba(16,18,31,.5)');
    for (let y = -HL + 8; y < HL; y += 22) for (const x of [-40, -20, 20, 40]) A_.circle(c, x, y, 0.9, A_.INK, 0);
    c.restore();
    // White collar stripe and the Sever mark on the deck: a bar cutting a ring (CAST.md)
    A_.poly(c, [[-HW * 0.8, -6], [HW * 0.8, -6], [HW * 0.8, 1], [-HW * 0.8, 1]], WHITE, 1.4);
    A_.circle(c, 0, -30, 13, null, 3.4, WHITE);
    A_.poly(c, [[-26, -33], [26, -33], [26, -27], [-26, -27]], A_.INK, 0);
    // Bridge and funnel at the stern
    A_.poly(c, [[-26, -HL + 12], [26, -HL + 12], [22, -HL + 42], [-22, -HL + 42]], '#3c4048', 2.2);
    A_.poly(c, [[-22, -HL + 34], [22, -HL + 34], [20, -HL + 40], [-20, -HL + 40]], '#a9d8e2', 1.2);
    A_.circle(c, 0, -HL + 20, 8, '#22242c', 2);
    // Racked pylons along each side
    [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { const y = 8 + i * 14; A_.poly(c, [[s * 44 - 5, y - 4], [s * 44 + 5, y - 4], [s * 44 + 5, y + 4], [s * 44 - 5, y + 4]], '#3c4048', 1.3); A_.line(c, s * 44 - 3, y, s * 44 + 3, y, 1.6, '#d6dae0'); } });
    // Harpoon gun at the bow
    A_.circle(c, 0, HL * 0.62, 11, '#3c4048', 2.2);
  });

  // ---- Hekka, code version, from the front. x, y = between her feet.
  function hekkaCode(c, x, y, s, pose, t) {
    const A_ = A(), SKIN = '#b78a64', PLATE = '#858b92', DARK = '#26272f', HAIR = '#131219';
    c.save(); c.translate(x, y); c.scale(s, s);
    A_.ellipse(c, 0, 0, 10, 3, 'rgba(16,18,31,.35)', 0);
    if (pose === 'hurt') c.rotate(0.22);
    // The hair behind her, thick and swept back
    A_.blob(c, [[-8, -50], [8, -50], [11, -38], [9, -27], [-9, -27], [-11, -38]], HAIR, 1.3);
    A_.poly(c, [[-6, -1], [-2, -1], [-2, -11], [-7, -11]], PLATE, 1.1); A_.poly(c, [[2, -1], [6, -1], [7, -11], [2, -11]], PLATE, 1.1);
    A_.blob(c, [[-7, -24], [7, -24], [8, -10], [2, -10], [0, -15], [-2, -10], [-8, -10]], DARK, 1.3);
    A_.poly(c, [[-6, -29], [6, -29], [6.5, -24], [-6.5, -24]], SKIN, 1.1);
    A_.circle(c, 3, -26, 1.2, null, 0.7, '#e0a0a0');   // the ring scar on her left side
    A_.poly(c, [[-7, -38], [7, -38], [6.5, -29], [-6.5, -29]], PLATE, 1.3);
    A_.poly(c, [[-7, -34.5], [7, -34.5], [7, -33], [-7, -33]], A_.INK, 0);
    A_.limb(c, -8, -37, -10, -25, 2.5, 2, DARK, 1.2, true);
    // The lance arm: raised when she throws
    const up = pose === 'throw';
    A_.limb(c, 8, -37, up ? 11 : 11, up ? -46 : -28, 2.5, 2, PLATE, 1.2, true);
    const lx = 12, ty = up ? -68 : -58, by = up ? -8 : 2;
    A_.line(c, lx, ty, lx, by, 2.6, A_.INK); A_.line(c, lx, ty, lx, by, 1.2, '#8c9098');
    A_.poly(c, [[lx - 3, ty + 2], [lx, ty - 9], [lx + 4, ty + 3], [lx + 1, ty + 6]], '#f8fbff', 1);
    A_.circle(c, 0, -43, 4.4, SKIN, 1.2);
    A_.blob(c, [[-5, -44], [-4.5, -49], [4.5, -49], [5, -44], [2, -47], [-2, -47]], HAIR, 1);
    A_.poly(c, [[-3, -39], [3, -39], [3, -37.5], [-3, -37.5]], WHITE, 0.6);
    c.restore();
  }

  // A keel plate, once: cut steel in two tones with a ragged edge around it. The glow and the cracks go on when it's drawn.
  const plateArt = () => TG.bake('keelplate', 44, 30, 22, 15, c => {
    const A_ = A(), edge = [[-15, -6], [-10, -10], [7, -10], [14, -7], [16, 2], [11, 9], [-8, 10], [-15, 6]];
    A_.poly(c, edge.map(p => [p[0] * 1.14, p[1] * 1.2]), '#1b2030', 1.2);
    A_.poly(c, edge, '#7fa6ae', 1.6);
    A_.poly(c, [[1, -10], [7, -10], [14, -7], [16, 2], [11, 9], [1, 10]], '#5a8088', 0);
    A_.poly(c, edge, null, 1.6);
    [[-11, -5], [10, -6], [-10, 6], [10, 5]].forEach(p => A_.circle(c, p[0], p[1], 1.1, '#2a3844', 0));
  });
  TG.lureGlowCold = () => TG.bake('coldglow', 120, 120, 60, 60, c => {
    const g = c.createRadialGradient(0, 0, 4, 0, 0, 60);
    g.addColorStop(0, 'rgba(150,246,250,.85)'); g.addColorStop(0.4, 'rgba(90,220,235,.3)'); g.addColorStop(1, 'rgba(70,200,220,0)');
    c.fillStyle = g; c.fillRect(-60, -60, 120, 120);
  });

  TG.drawCutter = function (ctx, run) {
    const w = run.w, b = w.boss, A_ = A(), t = run.time;
    if (!b) return;
    ctx.save();
    ctx.translate(b.cx, b.y);
    ctx.rotate(b.tilt || 0);
    const s = 1 - (b.sink || 0) * 0.14;
    ctx.scale(s, s);
    if (b.sink) ctx.globalAlpha = 1 - b.sink * 0.5;
    if (!A_.draw(ctx, 'cutter', 0, 0, B.cutterHalfLen + 16, B.cutterHalfLen * 2 + 26)) { const H = hull(); ctx.drawImage(H.cv, -H.ox, -H.oy, H.w, H.h); }
    if (b.flash > 0) {
      ctx.globalAlpha = Math.min(0.5, b.flash * 2);
      // The flash follows the hull: the picture's outline, measured from cutter-v1.png, when the picture is on.
      A_.poly(ctx, A_.has('cutter')
        ? [[-25, -102], [25, -102], [60, -14], [54, 16], [0, 108], [-54, 16], [-60, -14]]
        : [[-B.cutterHalfW, -B.cutterHalfLen], [B.cutterHalfW, -B.cutterHalfLen], [B.cutterHalfW, B.cutterHalfLen * 0.4], [0, B.cutterHalfLen + 8], [-B.cutterHalfW, B.cutterHalfLen * 0.4]], WHITE, 0);
      ctx.globalAlpha = 1;
    }
    // The keel plates, seen through the deck when she reloads, and broken holes after
    B.plates.forEach((p, i) => {
      if (b.broken[i]) {
        A_.poly(ctx, [[p[0] - 15, p[1] - 9], [p[0] + 8, p[1] - 13], [p[0] + 15, p[1] + 3], [p[0] + 5, p[1] + 12], [p[0] - 12, p[1] + 10]], '#16171f', 2);
        A_.circle(ctx, p[0] - 3 + Math.sin(t * 3 + i) * 3, p[1] - 4, 2.4, A_.ORANGE, 0);
      } else if (b.state === 'open') {
        // The keel plate showing through a torn seam in the deck: steel with rivets, lit from under, its cracks glowing. Part of the ship, not a marker.
        const pulse = 0.65 + Math.sin(t * 9) * 0.35;
        ctx.globalAlpha = pulse;
        const G = TG.lureGlowCold();
        ctx.drawImage(G.cv, p[0] - 30, p[1] - 30, 60, 60);
        ctx.globalAlpha = 1;
        const P = plateArt();
        ctx.drawImage(P.cv, p[0] - P.ox, p[1] - P.oy, P.w, P.h);
        ctx.globalAlpha = pulse;
        A_.line(ctx, p[0] - 10, p[1] - 2, p[0] - 2, p[1] + 2, 1.5, '#d8fbfc');
        A_.line(ctx, p[0] - 2, p[1] + 2, p[0] + 3, p[1] - 3, 1.5, '#d8fbfc');
        A_.line(ctx, p[0] + 3, p[1] - 3, p[0] + 11, p[1] + 1, 1.5, '#d8fbfc');
        ctx.globalAlpha = 1;
      }
    });
    // Hekka stands at the bow, by her gun
    const pose = (b.sink || b.flash > 0) ? 'hurt' : b.throwT > 0 ? 'throw' : 'stand';
    const key = { stand: 'hekka_stand', throw: 'hekka_throw', hurt: 'hekka_hurt' }[pose];
    if (!A_.draw(ctx, key, A_.frameAt(key, t), 27, B.cutterHalfLen * 0.5, T.hekkaH)) hekkaCode(ctx, 31, B.cutterHalfLen * 0.5, T.hekkaH * 0.78 / 40, pose, t);
    ctx.restore();
    ctx.globalAlpha = 1;
    drawSmoke(ctx, b, t);
    // Chains and loose pages sit on the water in front of her
    for (const c of b.chains) drawChain(ctx, c, run);
    drawChainFelt(ctx, run, b);
    for (const p of b.pages) TG.pageAt(ctx, p.x, p.y, t + p.y * 0.01);
  };
  function drawSmoke(c, b, t) {
    const A_ = A(), funnel = A_.has('cutter') ? -B.cutterHalfLen - 1 : -B.cutterHalfLen + 20;   // the picture's funnel sits further back than the code one
    for (let i = 0; i < 4; i++) { const u = (t * 0.5 + i / 4) % 1; c.globalAlpha = (1 - u) * 0.5; A_.circle(c, b.cx + Math.sin(i * 2 + t) * 4 - u * 14, b.y + funnel - u * 46, 5 + u * 12, '#2e3038', 0); }
    c.globalAlpha = 1;
  }
  TG.pageAt = function (c, x, y, t) {
    const A_ = A(), bob = Math.sin(t * 3) * 2;
    A_.circle(c, x, y + bob, 19, 'rgba(255,232,150,.28)', 0);
    c.save(); c.translate(x, y + bob); c.rotate(Math.sin(t * 2) * 0.2);
    A_.poly(c, [[-9, -12], [8, -11], [10, 11], [5, 8], [1, 12], [-4, 9], [-9, 12]], '#efe4c8', 1.8);
    for (let i = 0; i < 4; i++) A_.line(c, -6, -7 + i * 4.6, 6, -7 + i * 4.6, 1, '#6a7ea8');
    c.restore();
  };

  // The boss's drift arrows: gold chevrons sliding toward where a chain's way through will lie, before it drops. They go with the book.
  function drawChainFelt(c, run, b) {
    if (!b.nextChain || b.state !== 'volley') return;
    const A_ = A(), sense = TG.senseNow(run), m = (b.nextChain.gap[0] + b.nextChain.gap[1]) / 2, y = b.y + B.cutterHalfLen + 16, dir = m < b.cx ? -1 : 1;
    const flick = sense.flick && Math.sin(run.time * 11) + Math.sin(run.time * 17.3) < -sense.flick * 2 ? 0.25 : 1;
    c.globalAlpha = sense.alpha * flick;
    const slide = ((run.time * 1.6) % 1) * 7 * dir;
    for (let i = 0; i < Math.max(1, sense.chev); i++) {
      const x = b.cx + dir * 30 + slide + i * 15 * dir;
      A_.poly(c, [[x - dir * 5.5, y - 11], [x, y - 11], [x + dir * 6.8, y], [x, y + 11], [x - dir * 5.5, y + 11], [x + dir, y]], i === sense.chev - 1 ? '#ffe28a' : A_.GOLD, 2);
    }
    [-1, 1].forEach(s => A_.poly(c, [[m + s * 24, y - 10], [m + s * 12, y], [m + s * 24, y + 10], [m + s * 28, y + 10], [m + s * 16, y], [m + s * 28, y - 10]], '#ffe28a', 1.2));
    c.globalAlpha = 1;
  }

  function drawChain(c, ch, run) {
    const A_ = A(), r = B.pylonR, sense = TG.senseNow(run);
    const n = Math.round((ch.b - ch.a) / 11);
    A_.line(c, ch.a, ch.y, ch.b, ch.y, 5, A_.INK);
    for (let i = 0; i < n; i++) { const x = ch.a + (i + 0.5) * (ch.b - ch.a) / n; A_.ellipse(c, x, ch.y, 5.6, i % 2 ? 2.6 : 3.6, i % 2 ? '#8c9098' : '#c2c6cc', 1.1); }
    [ch.a, ch.b].forEach(x => {
      if (x <= TG.WALL_L + 1 || x >= TG.WALL_R - 1) return;
      A_.circle(c, x, ch.y + 2, r + 3, 'rgba(236,250,250,.55)', 0);
      A_.circle(c, x, ch.y, r, '#3c4048', 2.2);
      A_.circle(c, x, ch.y - 3, r * 0.56, '#858b92', 1.4);
      A_.circle(c, x, ch.y - 3, 2.4, '#ffffff', 0);
    });
    if (sense.ghost && ch.gap) {
      const m = (ch.gap[0] + ch.gap[1]) / 2;
      c.globalAlpha = 0.9;
      [-1, 1].forEach(s => A_.poly(c, [[m + s * 24, ch.y - 10], [m + s * 12, ch.y], [m + s * 24, ch.y + 10], [m + s * 28, ch.y + 10], [m + s * 16, ch.y], [m + s * 28, ch.y - 10]], '#ffe28a', 1.2));
      c.globalAlpha = 1;
    }
  }

})();
