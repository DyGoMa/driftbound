// Tide Gap: the water, the cliffs either side, fog and rain. Heavy drawings are made once and stamped after that, for weak phones.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const baked = new Map();
  const BAKE_SCALE = 2;

  TG.bake = function (key, w, h, ox, oy, paint) {
    let b = baked.get(key);
    if (!b) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(w * BAKE_SCALE); cv.height = Math.ceil(h * BAKE_SCALE);
      const c = cv.getContext('2d');
      c.scale(BAKE_SCALE, BAKE_SCALE); c.translate(ox, oy);
      paint(c);
      b = { cv, w, h, ox, oy };
      baked.set(key, b);
    }
    return b;
  };
  // A repeating fill from a hidden canvas, kept so it's only made once.
  const patterns = new Map();
  TG.pattern = function (ctx, cv, mode) {
    let p = patterns.get(cv);
    if (!p) { p = ctx.createPattern(cv, mode); patterns.set(cv, p); }
    return p;
  };
  TG.stamp = function (ctx, b, x, y, rot, sx, sy) {
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    if (sx !== undefined) ctx.scale(sx, sy === undefined ? sx : sy);
    ctx.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    ctx.restore();
  };

  // One palette per stage: dusk going to storm, per FRIDAY_BATCH "stormy dusk" and the Gaptooth picture on the homepage.
  TG.LOOKS = [
    { deep: '#123a56', mid: '#1b5470', crest: '#3d86a0', glint: '#f2a65a', rock: '#5a4238', rockHi: '#7a5a48', rockLo: '#33252c', moss: '#6e7a3e', mossHi: '#8d9a4c', fall: '#7fd8d0', wall: '#2e2430', wallHi: '#4a3644' },
    { deep: '#102e50', mid: '#1a4466', crest: '#37708f', glint: '#ef7a3a', rock: '#553c38', rockHi: '#74523f', rockLo: '#2e2128', moss: '#5e6c3c', mossHi: '#7d8a48', fall: '#6fc8c4', wall: '#2a2030', wallHi: '#443140' },
    { deep: '#0e2a3c', mid: '#14404f', crest: '#2a6470', glint: null, rock: '#3e4648', rockHi: '#58625f', rockLo: '#222a30', moss: '#3f5a4e', mossHi: '#567462', fall: '#6fb8b8', wall: '#1c2630', wallHi: '#2e3c44' },
    { deep: '#0c1c34', mid: '#142c48', crest: '#2d4e6e', glint: null, rock: '#403a48', rockHi: '#5a5262', rockLo: '#221f30', moss: '#44503e', mossHi: '#5e6a50', fall: '#6da2b8', wall: '#1a1a2c', wallHi: '#2c2a40' },
    { deep: '#26183a', mid: '#3a2048', crest: '#6a3a5c', glint: '#f0552b', rock: '#4a2f38', rockHi: '#684044', rockLo: '#2a1a26', moss: '#5a4a3c', mossHi: '#7a6248', fall: '#d88a6a', wall: '#24162a', wallHi: '#3e2436' },
  ];

  // Flat crescent waves, two tones, the way the show draws water from above.
  function waves(look, n) {
    return TG.bake('waves' + n + look.crest, 360, 256, 0, 0, c => {
      const rnd = TG.scatter(n === 0 ? 91 : 173), A_ = A();
      for (let i = 0; i < (n === 0 ? 34 : 22); i++) {
        const x = rnd() * 360, y = rnd() * 256, r = 9 + rnd() * 16, col = n === 0 ? look.mid : look.crest;
        for (const dx of [0, -360, 360]) for (const dy of [0, -256, 256]) {
          c.beginPath(); c.moveTo(x + dx - r, y + dy); c.quadraticCurveTo(x + dx, y + dy - r * 0.5, x + dx + r, y + dy); c.quadraticCurveTo(x + dx, y + dy - r * 0.2, x + dx - r, y + dy);
          c.fillStyle = col; c.fill();
        }
      }
      if (n === 1) { c.fillStyle = 'rgba(255,255,255,.1)'; for (let i = 0; i < 10; i++) { const x = rnd() * 330, y = 2 + rnd() * 250; c.fillRect(x, y, 10 + rnd() * 18, 1.2); } }
      void A_;
    });
  }

  TG.drawSea = function (ctx, run, view) {
    const w = run.w, look = TG.LOOKS[run.stage.look || 0], A_ = A(), t = run.time;
    ctx.fillStyle = look.deep;
    ctx.fillRect(view.left - 12, view.top - 12, view.right - view.left + 24, view.bottom - view.top + 24);   // past the edges, so a screen shake never shows a gap
    // Long sunset light down the middle of the water, where there's a sun left to give it.
    if (look.glint) {
      const g = ctx.createLinearGradient(40, 0, 320, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, look.glint); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.14; ctx.fillStyle = g; ctx.fillRect(40, view.top, 280, view.bottom - view.top); ctx.globalAlpha = 1;
    }
    // Filled as repeating patterns, not stamped tile by tile: there's no join for a hairline to show in.
    const tile = (s, off, sway) => {
      ctx.save(); ctx.translate(sway, off); ctx.scale(0.5, 0.5);
      ctx.fillStyle = TG.pattern(ctx, s.cv, 'repeat');
      ctx.fillRect((T.wallL - 10 - sway) * 2, (view.top - 12 - off) * 2, (T.wallR - T.wallL + 20) * 2, (view.bottom - view.top + 24) * 2);
      ctx.restore();
    };
    tile(waves(look, 0), w.dist % 256, 0);
    tile(waves(look, 1), (w.dist * 1.12) % 256, (t * 9) % 360);
    if (look.glint) {
      const rnd = TG.scatter(5);
      for (let i = 0; i < 14; i++) {
        const y = view.top + ((rnd() * 700 + w.dist * 0.9) % (view.bottom - view.top)), x = 180 + (rnd() - 0.5) * (70 + (y - view.top) * 0.2);
        ctx.globalAlpha = 0.5; A_.poly(ctx, [[x - 10, y], [x, y - 1.6], [x + 10, y], [x, y + 1.6]], look.glint, 0); ctx.globalAlpha = 1;
      }
    }
  };

  // Rip currents: fast streaks across the channel, always visible.
  TG.drawBands = function (ctx, run) {
    const w = run.w, A_ = A();
    for (const b of w.bands) {
      if (!b.dir) continue;
      const y1 = TG.yOf(w, b.b), y2 = TG.yOf(w, b.a);
      if (y2 < Kit.view.top - 10 || y1 > Kit.view.bottom + 10) continue;
      ctx.globalAlpha = 0.28; A_.poly(ctx, [[0, y1], [360, y1], [360, y2], [0, y2]], '#0a1a2c', 0); ctx.globalAlpha = 1;
      const span = 360 + 60, n = Math.ceil((y2 - y1) / 22);
      for (let i = 0; i < n; i++) {
        const y = y1 + (i + 0.5) * 22, sp = 90 + (i * 37) % 60, off = (run.time * sp * b.dir + i * 83) % span;
        for (let k = 0; k < 3; k++) {
          const x = ((off + k * 140) % span + span) % span - 30, d = b.dir * 12;
          A_.poly(ctx, [[x - d, y - 5], [x + d * 0.2, y - 5], [x + d, y], [x + d * 0.2, y + 5], [x - d, y + 5], [x - d * 0.3, y]], 'rgba(160,226,240,.55)', 0);
        }
      }
    }
  };

  TG.drawWalls = function (ctx, run, view) { TG.drawCliffs(ctx, run, view); };

  // Fog: nothing readable past 'thick' px from the bow; clear inside 'clear'. Gold still shows through, because that's drawn after this.
  TG.drawFog = function (ctx, run, view) {
    const f = run.stage.fog, w = run.w;
    if (!f) return;
    const bow = w.shipYNow - T.hullHalfLen, y1 = bow - f.thick, y2 = bow - f.clear;
    const g = ctx.createLinearGradient(0, y1, 0, y2);
    g.addColorStop(0, 'rgba(118,146,152,1)'); g.addColorStop(1, 'rgba(118,146,152,0)');
    ctx.fillStyle = 'rgba(118,146,152,1)';
    ctx.fillRect(view.left, view.top, view.right - view.left, y1 - view.top + 1);
    ctx.fillStyle = g;
    ctx.fillRect(view.left, y1, view.right - view.left, y2 - y1);
    // Banks rolling across: each one flat, with a scalloped lip and one lighter tone, the way a show draws fog. Painted solid, then laid on see-through, so no puff shows inside another.
    const bank = TG.bake('fogbank', 360, 120, 0, 0, c => {
      const rnd = TG.scatter(9), puffs = [], lights = [];
      for (let i = 0; i < 26; i++) puffs.push([rnd() * 360, 42 + rnd() * 38, 24 + rnd() * 34]);
      for (let i = 0; i < 14; i++) lights.push([rnd() * 360, 30 + rnd() * 22, 18 + rnd() * 24]);
      const blot = (list, col, shrink) => { c.fillStyle = col; c.beginPath(); list.forEach(p => { for (const d of [0, -360, 360]) { c.moveTo(p[0] + d + p[2], p[1]); c.ellipse(p[0] + d, p[1], p[2], p[2] * shrink, 0, 0, Math.PI * 2); } }); c.fill(); };
      blot(puffs, 'rgb(150,176,180)', 0.42);
      blot(lights, 'rgb(186,206,208)', 0.36);
    });
    for (let i = 0; i < 4; i++) {
      const by = y1 - 110 + i * 52;
      ctx.save(); ctx.globalAlpha = 0.42; ctx.translate((run.time * (8 + i * 5) + i * 150) % 360, by); ctx.scale(0.5, 0.5);
      ctx.fillStyle = TG.pattern(ctx, bank.cv, 'repeat-x');
      ctx.fillRect((view.left - 360) * 2, 0, (view.right - view.left + 720) * 2, 240);
      ctx.restore();
    }
  };

  // The lamps along Vesh's back burn the fog back around him.
  TG.drawLampGlow = function (ctx, run, pts) {
    if (!run.stage.fog) return;
    const b = TG.lureGlow();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.16;
    for (let i = 0; i < pts.length; i += 6) ctx.drawImage(b.cv, pts[i].x - 60, pts[i].y - 60, 120, 120);
    ctx.restore();
  };

  TG.drawRain = function (ctx, run, view) {
    if (run.stage.look !== 3) return;
    const t = run.time, A_ = A(), h = view.bottom - view.top;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 46; i++) {
      const x = view.left + ((i * 97 + t * 90) % (view.right - view.left)), y = view.top + ((i * 173 + t * 620) % h);
      A_.line(ctx, x, y, x - 3, y + 16, 1, '#b7d2e4');
    }
    ctx.globalAlpha = 1;
    // Far lightning, looks only.
    const flash = Math.sin(t * 0.73) * Math.sin(t * 1.91) > 0.93 ? 0.16 : 0;
    if (flash) { ctx.fillStyle = 'rgba(220,235,255,' + flash + ')'; ctx.fillRect(view.left, view.top, view.right - view.left, h); }
  };
})();
