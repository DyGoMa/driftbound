// Kit art: sprite loader with silent fallback, ink-and-flat drawing helpers, particles, shake, HUD.
// The look: black ink outline, flat colour, one shadow tone. Figures are in figures.js.
(function () {
  const A = Kit.art = { INK: '#10121f', ORANGE: '#f0752b', GOLD: '#f4c152', PAPER: '#f5efe2', NAVY: '#141a38', NIGHT: '#0c1026', MUTED: '#b3b6cf' };
  const TITLE_FONT = 'Anton, Impact, "Arial Narrow", sans-serif', BODY_FONT = 'Barlow, system-ui, sans-serif';

  // ---- Sprites. art/sprites.js: window.DRIFT_SPRITES = { key: { src, frames, cols, fps, feet, cx, fill } }
  // src is relative to the game's page. A missing or broken image simply makes has() false and draw() return false.
  const sprites = {};
  function record(key) {
    if (sprites[key]) return sprites[key];
    const spec = (window.DRIFT_SPRITES || {})[key];
    if (!spec) return null;
    const rec = sprites[key] = Object.assign({ frames: 1, fps: 10, feet: 1, cx: 0.5, fill: 1 }, spec, { ok: false });
    rec.cols = spec.cols || rec.frames;
    const img = rec.img = new Image();
    img.onload = () => { rec.ok = img.naturalWidth > 0; };
    img.onerror = () => { rec.ok = false; };
    try { img.src = new URL(spec.src, location.href).href; } catch (e) { rec.ok = false; }
    return rec;
  }
  A.loadSprites = () => Object.keys(window.DRIFT_SPRITES || {}).forEach(record);
  A.has = key => { const r = record(key); return !!(r && r.ok); };
  A.frameAt = (key, t) => { const r = record(key); return r ? Math.floor(t * r.fps) : 0; };
  // x, y = the point between the feet. height = on-screen height of the character (fill = share of the frame it takes up).
  A.draw = function (ctx, key, frame, x, y, height, flip) {
    const r = record(key);
    if (!r || !r.ok) return false;
    const rows = Math.ceil(r.frames / r.cols);
    const fw = r.img.naturalWidth / r.cols, fh = r.img.naturalHeight / rows;
    const f = ((Math.floor(frame) % r.frames) + r.frames) % r.frames;
    const s = height / (fh * r.fill);
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(r.img, (f % r.cols) * fw, Math.floor(f / r.cols) * fh, fw, fh, -fw * s * r.cx, -fh * s * r.feet, fw * s, fh * s);
    ctx.restore();
    return true;
  };

  // ---- Colour
  const cache = {};
  // Darker (f < 1) or lighter (f > 1) version of a #rrggbb colour: the one shadow tone.
  A.shade = function (hex, f = 0.72) {
    const k = hex + f;
    if (cache[k]) return cache[k];
    const n = parseInt(hex.slice(1), 16);
    const c = v => Math.max(0, Math.min(255, Math.round(v * f)));
    return (cache[k] = '#' + ((1 << 24) + (c(n >> 16) << 16) + (c((n >> 8) & 255) << 8) + c(n & 255)).toString(16).slice(1));
  };

  // ---- Shapes. Every shape fills flat, then inks its edge. lw = 0 leaves the ink off.
  function finish(ctx, fill, lw, ink) {
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (lw !== 0) { ctx.lineWidth = lw || 2; ctx.strokeStyle = ink || A.INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
  }
  A.poly = function (ctx, pts, fill, lw, ink) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    finish(ctx, fill, lw, ink);
  };
  // The same, with soft corners: for cloth and hair. A point with a third value 1 stays sharp.
  A.blob = function (ctx, pts, fill, lw, ink) {
    const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const m0 = mid(pts[n - 1], pts[0]);
    ctx.beginPath(); ctx.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) {
      const p = pts[i], m = mid(p, pts[(i + 1) % n]);
      if (p[2]) ctx.lineTo(p[0], p[1]);
      ctx.quadraticCurveTo(p[0], p[1], m[0], m[1]);
    }
    ctx.closePath();
    finish(ctx, fill, lw, ink);
  };
  A.circle = function (ctx, x, y, r, fill, lw, ink) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); finish(ctx, fill, lw, ink); };
  A.ellipse = function (ctx, x, y, rx, ry, fill, lw, ink, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); finish(ctx, fill, lw, ink); };
  A.line = function (ctx, x1, y1, x2, y2, lw, color) {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.lineWidth = lw || 2; ctx.strokeStyle = color || A.INK; ctx.lineCap = 'round'; ctx.stroke();
  };
  // A slab with a flat shadow band along its bottom edge. For crates, plates, hulls, barricades.
  A.slab = function (ctx, x, y, w, h, fill, lw) {
    A.poly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, 0);
    A.poly(ctx, [[x, y + h * 0.68], [x + w, y + h * 0.68], [x + w, y + h], [x, y + h]], A.shade(fill), 0);
    A.poly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], null, lw);
  };
  // A tapered limb: two round ends joined, inked, with a shadow tone along one side.
  A.limb = function (ctx, x1, y1, x2, y2, r1, r2, fill, lw, noShade) {
    const hull = (ax, ay, bx, by, ra, rb) => {
      const an = Math.atan2(by - ay, bx - ax);
      ctx.beginPath();
      ctx.arc(ax, ay, ra, an + Math.PI / 2, an - Math.PI / 2);
      ctx.arc(bx, by, rb, an - Math.PI / 2, an + Math.PI / 2);
      ctx.closePath();
    };
    hull(x1, y1, x2, y2, r1, r2);
    finish(ctx, fill, lw);
    if (noShade) return;
    const an = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2, nx = Math.cos(an), ny = Math.sin(an);
    const side = nx < 0 ? 1 : -1;                 // the shadow always falls to the same side of the figure
    hull(x1 + nx * side * r1 * 0.45, y1 + ny * side * r1 * 0.45, x2 + nx * side * r2 * 0.45, y2 + ny * side * r2 * 0.45, r1 * 0.5, r2 * 0.5);
    finish(ctx, A.shade(fill), 0);
  };

  // ---- Text and HUD
  A.text = function (ctx, s, x, y, o = {}) {
    ctx.font = (o.body ? `800 ${o.size || 14}px ${BODY_FONT}` : `400 ${o.size || 18}px ${TITLE_FONT}`);
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'middle';
    if (o.ink !== false) { ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.inkColor || A.INK; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    ctx.fillStyle = o.color || A.PAPER;
    ctx.fillText(s, x, y);
  };
  A.bar = function (ctx, x, y, w, h, frac, color, back) {
    A.poly(ctx, [[x + 3, y], [x + w + 3, y], [x + w - 3, y + h], [x - 3, y + h]], back || A.NAVY, 2);
    const f = Math.max(0, Math.min(1, frac));
    if (f > 0) A.poly(ctx, [[x + 3, y + 1], [x + 3 + (w - 1) * f, y + 1], [x - 3 + (w - 1) * f, y + h - 1], [x - 3, y + h - 1]], color || A.GOLD, 0);
  };
  // The shared salvage pickup: a battered brass cog.
  A.salvage = function (ctx, x, y, r, spin = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
    const pts = [];
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? r * 0.74 : r; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    A.poly(ctx, pts, A.GOLD, Math.max(1.2, r * 0.2));
    A.circle(ctx, 0, 0, r * 0.34, A.NAVY, Math.max(1, r * 0.14));
    ctx.restore();
  };
  // Default corner read-out; a game may pass its own def.hud instead.
  A.hud = function (ctx, run, view) {
    const x = Math.max(view.left + 10, 8), y = Math.max(view.top + 18, 16);
    A.salvage(ctx, x + 7, y, 8, 0);
    A.text(ctx, String(Math.floor(run.salvage)), x + 20, y, { size: 18, color: A.GOLD });
    A.text(ctx, 'Score ' + Math.floor(run.score), x, y + 20, { size: 14 });
  };

  // ---- Backgrounds
  // Stormy dusk sky from edge to edge of the screen, with slow ink clouds.
  A.duskSky = function (ctx, view, t = 0, o = {}) {
    const g = ctx.createLinearGradient(0, view.top, 0, view.bottom);
    g.addColorStop(0, o.top || '#0c1026'); g.addColorStop(0.55, o.mid || '#2b2a5a'); g.addColorStop(0.85, o.low || '#b8502d'); g.addColorStop(1, o.base || '#f0752b');
    ctx.fillStyle = g; ctx.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top);
    const span = view.right - view.left + 240;
    for (let i = 0; i < 5; i++) {
      const x = view.left - 120 + ((i * 197 + t * (6 + i * 3)) % span), y = view.top + 30 + i * (view.bottom - view.top) * 0.09;
      for (let j = 0; j < 4; j++) A.ellipse(ctx, x + j * 26 - 40, y + (j % 2) * 5, 26, 10, o.cloud || '#1a1f49', 0);
    }
  };
  // A floating island: flat top, jagged rock hanging below.
  A.island = function (ctx, x, y, w, h, o = {}) {
    const rock = o.rock || '#2a2448', top = o.top || '#3f5a4a', seed = o.seed || 1, lw = o.lw === undefined ? 2 : o.lw;
    const pts = [[x, y], [x + w, y]], n = Math.max(4, Math.round(w / 24));
    for (let i = 1; i < n; i++) {
      const u = i / n, dip = Math.sin(u * Math.PI) * h, jag = Math.abs(Math.sin(seed * 12.9 + i * 78.2) * 437.5 % 1) * h * 0.2;
      pts.push([x + w * (1 - u), y + Math.max(4, dip + jag)]);
    }
    A.poly(ctx, pts, rock, lw);
    A.poly(ctx, [[x - 2, y - 3], [x + w + 2, y - 3], [x + w - 3, y + h * 0.1 + 2], [x + 3, y + h * 0.1 + 2]], top, lw);
  };

  // ---- Particles, floating words, shake. The kit steps and draws these for you.
  const parts = [], words = [];
  const MAX_PARTS = 220;   // PROVISIONAL: keeps weak phones steady
  A.burst = function (x, y, o = {}) {
    const n = o.n || 10, sp = o.speed || 90, colors = o.colors || [o.color || A.GOLD];
    for (let i = 0; i < n && parts.length < MAX_PARTS; i++) {
      const a = (o.angle === undefined ? Math.random() * Math.PI * 2 : o.angle + (Math.random() - 0.5) * (o.spread || 1));
      const v = sp * (0.4 + Math.random() * 0.8);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: (o.life || 0.5) * (0.6 + Math.random() * 0.6), age: 0,
        size: (o.size || 3) * (0.6 + Math.random() * 0.7), color: colors[i % colors.length], g: o.gravity === undefined ? 160 : o.gravity });
    }
  };
  A.floatText = function (x, y, s, color, size) { words.push({ x, y, s, color: color || A.GOLD, size: size || 16, age: 0 }); };
  let shakeT = 0, shakeLen = 1, shakeMag = 0;
  A.fxStep = function (dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
    for (let i = words.length - 1; i >= 0; i--) { const w = words[i]; w.age += dt; w.y -= 34 * dt; if (w.age > 0.9) words.splice(i, 1); }
    if (shakeT > 0) shakeT -= dt;
  };
  A.drawFx = function (ctx) {
    for (const p of parts) {
      const r = p.size * (1 - p.age / p.life) + 0.5;
      A.poly(ctx, [[p.x, p.y - r], [p.x + r, p.y], [p.x, p.y + r], [p.x - r, p.y]], p.color, 0);
    }
    for (const w of words) { ctx.globalAlpha = Math.max(0, Math.min(1, 1.6 - w.age * 1.8)); A.text(ctx, w.s, w.x, w.y, { size: w.size, color: w.color, align: 'center' }); ctx.globalAlpha = 1; }
  };
  A.clearFx = function () { parts.length = 0; words.length = 0; shakeT = 0; };

  const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  A.shake = function (mag = 5, secs = 0.25) { if (calm) return; shakeMag = mag; shakeT = shakeLen = secs; };
  A.shakeOffset = function () {
    if (shakeT <= 0) return { x: 0, y: 0 };
    const m = shakeMag * (shakeT / shakeLen);
    return { x: (Math.random() - 0.5) * 2 * m, y: (Math.random() - 0.5) * 2 * m };
  };
})();
