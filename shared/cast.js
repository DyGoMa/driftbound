// Hoshi Arcade shared cast. Every game draws characters through this file only.
// All draw functions: (ctx, x, y, scale, t) with (x, y) at the character's feet / base.
(function () {
  const C = {
    ink: '#1d1430', skin: '#ffe3d0', blush: 'rgba(255,110,140,0.45)', white: '#ffffff',
    star: '#ffd75e', glitch: '#3a1a5c', magenta: '#ff2e9a', cyan: '#2ee6ff',
  };
  const CAST = {
    aki:  { name: 'Aki Hoshino', hair: '#ff5a36', shine: '#ffa07a', iris: '#e8930c', style: 'spiky', coat: '#2b3a67', trim: '#ff8c2e', scarf: '#2ec4b6', eyeH: 6.2 },
    ren:  { name: 'Ren Kurogane', hair: '#24305e', shine: '#5468a8', iris: '#8a93a6', style: 'sleek', coat: '#f1f1f6', trim: '#24305e', eyeH: 4.4 },
    yuzu: { name: 'Yuzu Kiri', hair: '#ffd23f', shine: '#fff0a8', iris: '#3fae6a', style: 'twin', coat: '#ff9f43', trim: '#5a3d2b', eyeH: 6.4 },
  };

  function line(ctx, w) { ctx.lineWidth = w; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; }
  function poly(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); }

  function eye(ctx, x, y, h, iris, blink) {
    if (blink) { line(ctx, 1.4); ctx.beginPath(); ctx.moveTo(x - 3.5, y); ctx.quadraticCurveTo(x, y + 2, x + 3.5, y); ctx.stroke(); return; }
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.ellipse(x, y, 3.6, h * 0.55, 0, 0, 7); ctx.fill();
    ctx.fillStyle = iris; ctx.beginPath(); ctx.ellipse(x + 0.5, y + 0.6, 2.7, h * 0.48, 0, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink; ctx.beginPath(); ctx.ellipse(x + 0.6, y + 0.9, 1.3, h * 0.26, 0, 0, 7); ctx.fill();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(x - 0.6, y - h * 0.18, 1.1, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 1.4, y + h * 0.25, 0.55, 0, 7); ctx.fill();
    line(ctx, 1.8); ctx.beginPath(); ctx.moveTo(x - 4, y - h * 0.42); ctx.quadraticCurveTo(x, y - h * 0.68, x + 4.2, y - h * 0.38); ctx.stroke();
  }

  // Head centred at (0,0), radius ~16. t drives hair sway and blinking.
  function head(ctx, c, t, mood) {
    const sway = Math.sin(t * 9) * 3, blink = (t % 3.2) > 3.08;
    ctx.fillStyle = c.hair; line(ctx, 1.4);
    if (c.style === 'spiky') { // ponytail behind
      ctx.beginPath(); ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-30, -14 + sway, -34, -2 + sway);
      ctx.quadraticCurveTo(-26, -4 + sway, -14, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (c.style === 'twin') for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(15 * s, -8); ctx.quadraticCurveTo(26 * s, 2, 20 * s + sway * 0.6, 22);
      ctx.quadraticCurveTo(14 * s, 10, 11 * s, -2); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, -3, 17.5, 0, 7); ctx.fill(); ctx.stroke(); // back hair
    ctx.fillStyle = C.skin; ctx.beginPath(); ctx.moveTo(-14, -2);
    ctx.quadraticCurveTo(-14, 11, 0, 16); ctx.quadraticCurveTo(14, 11, 14, -2);
    ctx.quadraticCurveTo(14, -15, 0, -15); ctx.quadraticCurveTo(-14, -15, -14, -2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.blush; ctx.beginPath(); ctx.ellipse(-8, 8, 3, 1.6, 0, 0, 7); ctx.ellipse(10, 8, 3, 1.6, 0, 0, 7); ctx.fill();
    eye(ctx, -5, 2, c.eyeH, c.iris, blink); eye(ctx, 7, 2, c.eyeH, c.iris, blink);
    line(ctx, 1.3); ctx.beginPath(); // mouth
    if (mood === 'hurt') { ctx.moveTo(-1, 11); ctx.lineTo(4, 10); }
    else if (mood === 'calm') { ctx.moveTo(0, 11); ctx.lineTo(3, 11); }
    else { ctx.moveTo(-1, 10); ctx.quadraticCurveTo(1.5, 13, 4, 10); }
    ctx.stroke();
    ctx.fillStyle = c.hair; line(ctx, 1.4); // bangs
    if (c.style === 'spiky') poly(ctx, [-17, 0, -14, -9, -10, -2, -7, -11, -3, -4, 1, -12, 4, -4, 8, -11, 10, -2, 17, -5, 16, -14, 8, -21, -5, -22, -15, -15]);
    else if (c.style === 'sleek') poly(ctx, [-17, 2, -15, -12, -4, -20, 10, -19, 17, -10, 16, 0, 12, -6, 6, 6, 2, -5, -8, -8, -12, 0]);
    else poly(ctx, [-16, 0, -16, -13, -6, -20, 8, -20, 16, -13, 16, 0, 12, -5, 8, -4, 4, -6, 0, -4, -4, -6, -8, -4, -12, -5]);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = c.shine; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -6, 12, 3.6, 4.6); ctx.stroke();
    if (c.style === 'twin') { // goggles
      ctx.fillStyle = '#5a3d2b'; ctx.fillRect(-17, -15, 34, 4);
      for (const gx of [-6, 6]) { ctx.fillStyle = '#9be7ff'; line(ctx, 1.6); ctx.beginPath(); ctx.arc(gx, -14, 4.5, 0, 7); ctx.fill(); ctx.stroke(); }
    }
  }

  function limb(ctx, x1, y1, a, len, color, w) { // two-part limb with simple bend
    const kx = x1 + Math.sin(a) * len, ky = y1 + Math.cos(a) * len;
    const fx = kx + Math.sin(a * 0.4 - 0.2) * len, fy = ky + Math.cos(a * 0.4 - 0.2) * len;
    ctx.strokeStyle = C.ink; ctx.lineWidth = w + 2.4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    return [fx, fy];
  }

  // Full-body chibi hero. pose: 'run' | 'jump' | 'idle' | 'hurt'
  function drawHero(ctx, who, x, y, s, t, pose) {
    const c = CAST[who];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
    const run = pose === 'run' ? Math.sin(t * 16) : 0;
    const bob = pose === 'run' ? Math.abs(run) * -2 : pose === 'idle' ? Math.sin(t * 3) : 0;
    ctx.translate(0, bob);
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, -bob + 1, 13, 3, 0, 0, 7); ctx.fill();
    const legA = pose === 'jump' ? [0.9, 0.3] : pose === 'hurt' ? [-0.6, 0.6] : [run * 0.9, -run * 0.9];
    for (const a of legA) {
      const f = limb(ctx, 0, -18, a, 9, '#1d1430', 4.5);
      ctx.fillStyle = c.trim; line(ctx, 1.2); ctx.beginPath(); ctx.ellipse(f[0] + 2, f[1], 4.5, 2.6, 0, 0, 7); ctx.fill(); ctx.stroke();
    }
    if (c.scarf) { // scarf tail streams behind
      ctx.fillStyle = c.scarf; line(ctx, 1.2); const w = Math.sin(t * 12) * 3;
      ctx.beginPath(); ctx.moveTo(-4, -37); ctx.quadraticCurveTo(-18, -38 + w, -28, -32 - w);
      ctx.lineTo(-26, -28 - w); ctx.quadraticCurveTo(-16, -33 + w, -4, -33); ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = c.coat; line(ctx, 1.4); ctx.beginPath(); ctx.roundRect(-8, -38, 16, 22, 5); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = c.trim; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1, -36); ctx.lineTo(1, -17); ctx.stroke();
    const armA = pose === 'jump' ? [-2.4, -2.0] : pose === 'hurt' ? [-2.6, 2.6] : [-run * 1.1, run * 1.1];
    for (const a of armA) limb(ctx, 0, -34, a + Math.PI * 0, 7, c.coat, 4);
    if (c.scarf) { ctx.fillStyle = c.scarf; line(ctx, 1.2); ctx.beginPath(); ctx.roundRect(-9, -40, 18, 6, 3); ctx.fill(); ctx.stroke(); }
    ctx.translate(2, -54); head(ctx, c, t, pose === 'hurt' ? 'hurt' : c.style === 'sleek' ? 'calm' : 'happy');
    ctx.restore();
  }

  // Head-and-shoulders portrait for menus and cards.
  function drawBust(ctx, who, x, y, s, t) {
    const c = CAST[who];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = c.coat; line(ctx, 1.4); ctx.beginPath(); ctx.moveTo(-20, 0); ctx.quadraticCurveTo(-18, -18, 0, -19); ctx.quadraticCurveTo(18, -18, 20, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (c.scarf) { ctx.fillStyle = c.scarf; ctx.beginPath(); ctx.roundRect(-11, -22, 22, 7, 3); ctx.fill(); ctx.stroke(); }
    if (who === 'ren') { ctx.strokeStyle = '#a0703a'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(16, -34); ctx.stroke(); }
    ctx.translate(0, -36); head(ctx, c, t, who === 'ren' ? 'calm' : 'happy');
    ctx.restore();
  }

  function drawMochi(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 4) * 3); ctx.scale(s, s);
    const wag = Math.sin(t * 6) * 0.4;
    ctx.save(); ctx.rotate(wag); ctx.fillStyle = C.white; line(ctx, 1.4);
    ctx.beginPath(); ctx.moveTo(-8, 2); ctx.quadraticCurveTo(-26, -2, -24, -16); ctx.quadraticCurveTo(-16, -6, -6, -4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffb3cf'; ctx.beginPath(); ctx.arc(-24, -15, 3, 0, 7); ctx.fill(); ctx.restore();
    ctx.fillStyle = C.white; line(ctx, 1.4);
    for (const sx of [-1, 1]) { poly(ctx, [7 * sx, -9, 13 * sx, -22, 2 * sx, -12]); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffb3cf'; poly(ctx, [8 * sx, -12, 12 * sx, -19, 5 * sx, -13]); ctx.fill(); ctx.fillStyle = C.white; }
    ctx.beginPath(); ctx.ellipse(0, 0, 14, 12, 0, 0, 7); ctx.fill(); ctx.stroke();
    line(ctx, 1.4); for (const ex of [-5, 5]) { ctx.beginPath(); ctx.arc(ex, -1, 2.4, 3.6, 5.8); ctx.stroke(); }
    ctx.fillStyle = C.blush; ctx.beginPath(); ctx.ellipse(-8, 3, 2.6, 1.4, 0, 0, 7); ctx.ellipse(8, 3, 2.6, 1.4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff7aa8'; ctx.beginPath(); ctx.arc(0, 3, 1.3, 0, 7); ctx.fill();
    ctx.fillStyle = '#ff3d6e'; ctx.beginPath(); ctx.arc(0, -12, 2.2, 0, 7); ctx.fill(); // shrine charm
    ctx.restore();
  }

  function drawGlitchling(ctx, x, y, s, t, seed) {
    seed = seed || 0;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const pts = []; for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, r = 13 + (i % 2 ? 3 : -1) + Math.sin(t * 10 + i + seed) * 1.6;
      pts.push(Math.cos(a) * r, -14 + Math.sin(a) * r * 0.95);
    }
    const jit = (Math.sin(t * 23 + seed) > 0.7) ? 2.5 : 1;
    ctx.globalAlpha = 0.7; ctx.fillStyle = C.cyan; ctx.save(); ctx.translate(-jit, 0); poly(ctx, pts); ctx.fill(); ctx.restore();
    ctx.fillStyle = C.magenta; ctx.save(); ctx.translate(jit, 0); poly(ctx, pts); ctx.fill(); ctx.restore();
    ctx.globalAlpha = 1; ctx.fillStyle = C.glitch; line(ctx, 1.4); poly(ctx, pts); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.ellipse(2, -16, 6, 6.5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = C.magenta; ctx.beginPath(); ctx.arc(3.5, -15.5, 3.6, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillRect(2.6, -18.5, 1.8, 6);
    ctx.restore();
  }

  function drawShard(ctx, x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (0.8 + Math.abs(Math.sin(t * 3)) * 0.2), s); ctx.rotate(Math.sin(t * 2) * 0.2);
    ctx.shadowColor = C.star; ctx.shadowBlur = 10; ctx.fillStyle = C.star; line(ctx, 1.2);
    poly(ctx, [0, -10, 3, -3, 10, 0, 3, 3, 0, 10, -3, 3, -10, 0, -3, -3]); ctx.fill(); ctx.shadowBlur = 0; ctx.stroke();
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(-1.5, -3, 1.4, 0, 7); ctx.fill();
    ctx.restore();
  }

  window.HoshiCast = { COLORS: C, CAST, drawHero, drawBust, drawMochi, drawGlitchling, drawShard };
})();
