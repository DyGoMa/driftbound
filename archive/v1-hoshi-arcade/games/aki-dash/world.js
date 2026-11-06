// Aki Dash background: night sky over Hoshimachi, drawn in parallax layers.
(function () {
  const stars = Array.from({ length: 70 }, (_, i) => ({ x: (i * 137.5) % 1, y: ((i * 61.8) % 1) * 0.55, r: (i % 3) * 0.5 + 0.6 }));
  // Deterministic rooftops so the skyline repeats seamlessly every 900px.
  const roofs = Array.from({ length: 14 }, (_, i) => ({ x: i * 64, w: 50 + (i * 37) % 30, h: 40 + (i * 53) % 70, lamp: i % 3 === 0 }));

  function drawWorld(ctx, W, H, dist, t, groundY) {
    const g = ctx.createLinearGradient(0, 0, 0, groundY);
    g.addColorStop(0, '#120c33'); g.addColorStop(0.55, '#3b1e6e'); g.addColorStop(1, '#ff7aa8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of stars) { // stars twinkle
      ctx.globalAlpha = 0.5 + Math.sin(t * 2 + s.x * 40) * 0.4; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(((s.x * W * 1.3 - dist * 0.01) % W + W) % W, s.y * H, s.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff3d6'; ctx.shadowColor = '#ffe7a8'; ctx.shadowBlur = 30; // full moon
    ctx.beginPath(); ctx.arc(W * 0.78, 70, 34, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(230,210,190,0.6)'; ctx.beginPath(); ctx.arc(W * 0.78 - 10, 62, 7, 0, 7); ctx.arc(W * 0.78 + 12, 80, 5, 0, 7); ctx.fill();
    // far hills with the shrine on top
    ctx.fillStyle = '#4a2a7a'; const hOff = -(dist * 0.08) % 600;
    for (let x = hOff - 600; x < W + 600; x += 600) {
      ctx.beginPath(); ctx.moveTo(x, groundY - 40); ctx.quadraticCurveTo(x + 150, groundY - 150, x + 300, groundY - 70);
      ctx.quadraticCurveTo(x + 450, groundY - 120, x + 600, groundY - 40); ctx.lineTo(x + 600, groundY); ctx.lineTo(x, groundY); ctx.fill();
      // shrine gate sits on the hill peak (peak of this curve is ~102px above the ground)
      ctx.fillStyle = '#e2384f'; ctx.fillRect(x + 130, groundY - 118, 4, 22); ctx.fillRect(x + 158, groundY - 118, 4, 22);
      ctx.fillRect(x + 124, groundY - 122, 44, 5); ctx.fillRect(x + 128, groundY - 112, 36, 3); ctx.fillStyle = '#4a2a7a';
    }
    // town rooftops with lanterns
    const rOff = -(dist * 0.3) % 896;
    for (let k = -1; k < Math.ceil(W / 896) + 1; k++) for (const r of roofs) {
      const x = rOff + k * 896 + r.x, top = groundY - r.h;
      ctx.fillStyle = '#2a1652'; ctx.fillRect(x, top, r.w, r.h);
      ctx.beginPath(); ctx.moveTo(x - 8, top); ctx.lineTo(x + r.w / 2, top - 16); ctx.lineTo(x + r.w + 8, top); ctx.fill();
      ctx.fillStyle = 'rgba(255,215,94,0.8)'; ctx.fillRect(x + 10, top + 12, 7, 9); if (r.w > 60) ctx.fillRect(x + r.w - 18, top + 12, 7, 9);
      if (r.lamp) { ctx.fillStyle = '#ff5a5a'; ctx.shadowColor = '#ff5a5a'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.ellipse(x + r.w / 2, top + 4 + Math.sin(t * 3 + x) * 1.5, 5, 7, 0, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
    }
    // shrine path ground with stone tiles
    ctx.fillStyle = '#2b1b3d'; ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#ff9fc3'; ctx.fillRect(0, groundY, W, 3);
    ctx.fillStyle = '#3a2752'; const tOff = -dist % 48;
    for (let x = tOff; x < W; x += 48) { ctx.fillRect(x + 2, groundY + 8, 42, 14); ctx.fillRect(x + 26, groundY + 26, 42, 14); }
    // falling sakura petals in front
    ctx.fillStyle = 'rgba(255,183,213,0.85)';
    for (let i = 0; i < 10; i++) {
      const px = ((i * 97 - dist * 0.6 - t * 30) % (W + 40) + W + 40) % (W + 40) - 20, py = ((i * 53 + t * 40) % (groundY + 20));
      ctx.beginPath(); ctx.ellipse(px, py, 3, 1.6, t * 2 + i, 0, 7); ctx.fill();
    }
  }
  window.drawWorld = drawWorld;
})();
