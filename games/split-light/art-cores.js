// Split Light: the Hollow cores: plain, linked, armoured, and the big one in Vasch's arm. Drawing only.
window.SL = window.SL || {};
(function () {
  const A = () => Kit.art;
  const cellBake = (key, paint) => SL.bake(key, 70, 70, 35, 35, paint);

  // ---- Cores. A stripped bond in a steel collar, trailing cut cables. White, because that's where the bond used to be. Everything stays inside its cell, the big one too (its clock ring is 25 in draw.js), so neighbours stay clear.
  function paintCollar(c, ring) {
    const a = A();
    a.line(c, -14, 12, -24, 22, 4, a.INK); a.line(c, -14, 12, -24, 22, 2, '#5d6269');
    a.line(c, 15, 11, 25, 15, 4, a.INK); a.line(c, 15, 11, 25, 15, 2, '#5d6269');
    a.line(c, 10, -15, 15, -25, 4, a.INK); a.line(c, 10, -15, 15, -25, 2, '#5d6269');
    const pts = [];
    for (let i = 0; i < 8; i++) { const an = (i + 0.5) / 8 * Math.PI * 2; pts.push([Math.cos(an) * 20, Math.sin(an) * 20]); }
    a.poly(c, pts, ring, 2.4);
    a.poly(c, pts.map(p => [p[0] * 0.72, p[1] * 0.72]), '#10121f', 0);
    [0.4, 2, 3.6, 5.2].forEach(an => a.circle(c, Math.cos(an) * 17, Math.sin(an) * 17, 1.5, '#d7dbe4', 0.8));
  }
  const collar = key => cellBake('collar' + key, c => paintCollar(c, key === 'twin' ? '#c99a3a' : key === 'big' ? '#8d939b' : '#5d6269'));
  function orb(c, x, y, r, t, flash) {
    const a = A(), p = 0.5 + Math.sin(t * 3.4) * 0.5;
    a.circle(c, x, y, r * (1.25 + p * 0.25), flash ? 'rgba(255,210,120,.6)' : 'rgba(255,255,255,.28)', 0);
    a.circle(c, x, y, r, '#ffffff', 0);
    a.circle(c, x - r * 0.15, y - r * 0.15, r * 0.55, '#eaf6ff', 0);
    a.circle(c, x, y, r * 0.28, flash ? '#f4c152' : '#bfe9ff', 0);
  }
  // The plates of an armoured core: heavy on three sides, gold marks at the way in.
  const SIDE_ANG = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };
  function plateArc(c, ang, col, big) {
    const a = A(), R = big ? 21 : 24, r = big ? 14.5 : 16.5, half = 0.62;
    c.save(); c.rotate(ang);
    const pts = [];
    for (let i = 0; i <= 4; i++) { const u = -half + (i / 4) * half * 2; pts.push([Math.sin(u) * R, -Math.cos(u) * R]); }
    for (let i = 4; i >= 0; i--) { const u = -half + (i / 4) * half * 2; pts.push([Math.sin(u) * r, -Math.cos(u) * r]); }
    a.poly(c, pts, col, 2.2);
    c.restore();
  }
  function chevrons(c, ang, col, off, s) {
    const a = A();
    c.save(); c.rotate(ang); c.translate(0, -(off || 25)); if (s) c.scale(s, s);
    a.poly(c, [[-8, -5], [0, 1], [8, -5], [8, 0], [0, 6], [-8, 0]], col, 1.5);
    c.restore();
  }
  SL.drawCore = function (c, x, y, core, t, o = {}) {
    const a = A();
    c.save(); c.translate(x, y);
    const big = !!core.big;
    SL.stamp(c, collar(core.twin ? 'twin' : big ? 'big' : 'plain'), 0, 0, 0, big ? 0.9 : 1);
    orb(c, 0, 0, big ? 9.5 + (o.hp || 1) * 0.5 : 10.5, t, o.flash > 0);
    if (big || core.open) {
      if (big) {
        ['N', 'E', 'S', 'W'].forEach(s => {
          const isOpen = o.open === s, sealed = (o.sealed || '').includes(s);
          if (!isOpen) plateArc(c, SIDE_ANG[s], sealed ? '#c9472b' : '#7b828e', true);
          if (sealed) { c.save(); c.rotate(SIDE_ANG[s]); a.line(c, -5, -17.7, 5, -17.7, 2, '#ffd9a0'); c.restore(); }
        });
        if (o.open && o.open !== 'X') chevrons(c, SIDE_ANG[o.open], a.GOLD, 17, 0.8);
        if (o.nextOpen && !(o.sealed || '').includes(o.nextOpen)) { c.save(); if (!o.warn) c.globalAlpha = 0.45; chevrons(c, SIDE_ANG[o.nextOpen], o.warn ? '#f0752b' : '#b3b6cf', 17, 0.8); c.restore(); }
        // The hits it can still take, on the core itself: dark while they last.
        for (let h = 0; h < core.hp; h++) { const px = (h - (core.hp - 1) / 2) * 5.6; a.poly(c, [[px, -2.8], [px + 2.2, 0], [px, 2.8], [px - 2.2, 0]], h < (o.hp || 0) ? '#1a2147' : '#cfd9ea', 0); }
      } else {
        const open = core.open;
        Object.keys(SIDE_ANG).forEach(s => { if (s !== open) plateArc(c, SIDE_ANG[s], o.flash > 0 ? '#c8ced8' : '#7b828e'); });
        chevrons(c, SIDE_ANG[open], a.GOLD, 24);
      }
    }
    c.restore();
  };
  SL.drawDeadCore = function (c, x, y, core, popU) {
    const a = A();
    c.save(); c.translate(x, y); c.globalAlpha = 0.55;
    const pts = [];
    for (let i = 0; i < 8; i++) { const an = (i + 0.5) / 8 * Math.PI * 2; pts.push([Math.cos(an) * 13, Math.sin(an) * 13]); }
    a.poly(c, pts, '#22263c', 1.6);
    a.line(c, -6, -5, 2, 2, 1.2, '#10121f'); a.line(c, 2, 2, 7, -3, 1.2, '#10121f');
    c.globalAlpha = 1;
    if (popU > 0) a.circle(c, 0, 0, 12 + (1 - popU) * 26, null, 3 * popU + 0.5, '#ffffff');
    c.restore();
  };
})();
