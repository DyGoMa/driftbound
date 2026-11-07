// Silent Cut: the light, drawn from the same sums the rules use (world.js), so what you see lit is exactly what's lit.
// Warm and high value on a mid-value street, so a dim phone still shows where the light is.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const WARM = 'rgba(255,226,140,', HOT = '#ffe48f';
  let floodGrad = null;

  // A pool on the walkway with a bright edge. Its edge is the exact edge of the light.
  function pool(c, x0, x1, alpha) {
    const g = T.groundY;
    c.fillStyle = WARM + (alpha || 0.78) + ')';
    c.fillRect(x0, g + 1, x1 - x0, 13);
    c.fillStyle = HOT; c.fillRect(x0, g + 1, x1 - x0, 2.4);
    c.fillStyle = '#10121f'; c.fillRect(x0 - 1.5, g, 3, 16); c.fillRect(x1 - 1.5, g, 3, 16);
  }
  function cone(c, hx, hy, x0, x1, alpha) {
    const g = T.groundY;
    c.globalCompositeOperation = 'screen';
    c.fillStyle = 'rgba(255,196,90,' + (alpha || 0.34) + ')';
    c.beginPath(); c.moveTo(hx - 3, hy); c.lineTo(x0, g); c.lineTo(x1, g); c.lineTo(hx + 3, hy); c.closePath(); c.fill();
    c.globalCompositeOperation = 'source-over';
  }

  SC.drawSweep = function (c, sw, t) {
    const g = T.groundY, p = SC.sweepAt(sw, t), h = SC.towerHead(sw), A_ = A();
    cone(c, h.x, h.y, p.x - sw.r, p.x + sw.r);
    pool(c, p.x - sw.r, p.x + sw.r);
    // Which way it's going: chevrons in the pool. At rest, they point the way it goes next and pulse.
    const dir = p.dir || p.next;
    c.globalAlpha = p.dir ? 1 : 0.5 + 0.5 * Math.sin(t * 16);
    for (let i = -1; i <= 1; i++) {
      const cx = p.x + i * 20 + dir * ((t * 40) % 8);
      A_.poly(c, [[cx - dir * 5, g + 3], [cx + dir * 4, g + 8], [cx - dir * 5, g + 13]], '#a8461e', 0);
    }
    c.globalAlpha = 1;
    return p;
  };
  // Its reach, marked on the walkway: an orange dashed line with a stop at each end. Knowing where it turns is how you plan.
  SC.drawSweepTrack = function (c, sw) {
    const g = T.groundY + 19;
    c.setLineDash([9, 7]); c.lineWidth = 2.2; c.strokeStyle = '#f0a040';
    c.beginPath(); c.moveTo(sw.a - sw.r, g); c.lineTo(sw.b + sw.r, g); c.stroke(); c.setLineDash([]);
    A().line(c, sw.a - sw.r, g - 5, sw.a - sw.r, g + 5, 3, '#f0a040'); A().line(c, sw.b + sw.r, g - 5, sw.b + sw.r, g + 5, 3, '#f0a040');
  };

  SC.drawLanternLight = function (c, l) {
    if (!l.lit) return;
    const ly = T.groundY - SC.LANTERN_ALT;
    cone(c, l.x + 8, ly + 12, l.x - l.r, l.x + l.r, 0.32);
    pool(c, l.x - l.r, l.x + l.r);
  };

  // A flood, minus whatever the crates are shading right now.
  SC.floodParts = function (w, f) {
    const parts = [];
    let on = false, start = f.a;
    for (let x = f.a; x <= f.b; x += 4) {
      const shaded = w.cranes.some(cr => SC.craneShade(cr, x, w.t));
      if (!shaded && !on) { on = true; start = x; }
      if (shaded && on) { on = false; parts.push([start, x]); }
    }
    if (on) parts.push([start, f.b]);
    return parts;
  };
  // Light from a flood's two lamps: a beam from each mast (draw.js, props.js) down to the far end of the pool, fading on the way. Where they cross is brightest. The pool on the walkway is still the exact edge of the light.
  const LAMP_ALT = 169, LAMP_OFF = 14, LAMP_W = 13;
  function floodBeams(c, f) {
    const g = T.groundY;
    c.globalCompositeOperation = 'screen';
    if (!floodGrad) { floodGrad = c.createLinearGradient(0, g - LAMP_ALT, 0, g); floodGrad.addColorStop(0, 'rgba(255,196,90,.5)'); floodGrad.addColorStop(1, 'rgba(255,196,90,.18)'); }
    c.fillStyle = floodGrad;
    [f.a - LAMP_OFF, f.b + LAMP_OFF].forEach(lx => { c.beginPath(); c.moveTo(lx - LAMP_W, g - LAMP_ALT); c.lineTo(lx + LAMP_W, g - LAMP_ALT); c.lineTo(f.b, g); c.lineTo(f.a, g); c.closePath(); c.fill(); });
    c.globalCompositeOperation = 'source-over';
  }
  SC.drawFlood = function (c, w, f) {
    const g = T.groundY, parts = SC.floodParts(w, f);
    const crs = w.cranes.filter(cr => cr.a <= f.b && cr.b >= f.a);
    if (!crs.length) floodBeams(c, f);
    else {
      // Under cranes the beams stop where a crate's shadow falls. Each stretch still opens out to its lamp at the ends.
      c.save(); c.beginPath();
      for (const p of parts) { const x0 = p[0] <= f.a ? f.a - LAMP_OFF - LAMP_W : p[0], x1 = p[1] >= f.b ? f.b + LAMP_OFF + LAMP_W : p[1]; c.rect(x0, g - LAMP_ALT, x1 - x0, LAMP_ALT); }
      c.clip(); floodBeams(c, f); c.restore();
    }
    for (const p of parts) pool(c, p[0], p[1]);
    // The shade itself gets a dark band from the crate down and a violet edge, so "stay in here" is plain.
    if (crs.length) {
      const top = SC.RAIL_ALT - SC.CRATE_DROP;
      let prev = f.a;
      parts.concat([[f.b, f.b]]).forEach(p => {
        if (p[0] - prev > 8) { c.fillStyle = 'rgba(16,14,50,.55)'; c.fillRect(prev, g - top, p[0] - prev, top + 14); c.fillStyle = '#b79cff'; c.fillRect(prev, g + 13, p[0] - prev, 3); }
        prev = p[1];
      });
    }
  };

  // A trooper's hand lamp. Its pool is exactly the stretch his lamp fills the meter on.
  SC.drawFoeLamp = function (c, f) {
    const l = SC.foeLamp(f), g = T.groundY;
    if (!l) return;
    const hx = f.x + f.dir * 15, hy = g - 40;
    c.globalCompositeOperation = 'screen';
    c.fillStyle = 'rgba(255,214,130,.42)';
    c.beginPath(); c.moveTo(hx, hy - 4); c.lineTo(f.dir > 0 ? l.b : l.a, g); c.lineTo(f.dir > 0 ? l.a : l.b, g); c.lineTo(hx, hy + 4); c.closePath(); c.fill();
    c.globalCompositeOperation = 'source-over';
    pool(c, l.a, l.b, 0.7);
  };

  // Ledger Maro's lamp: a wide pool sweeping out and back.
  SC.drawMaroLamp = function (c, b) {
    const m = SC.maroLamp(b);
    if (!m) return;
    const pic = Kit.art.has('maro_lamp');   // the picture holds its lantern further out and lower than the code figure's pole
    const g = T.groundY, hx = b.x - (pic ? 44 : 22), hy = g - (pic ? 81 : 92);
    cone(c, hx, hy, m.x - m.r, m.x + m.r, 0.4);
    pool(c, m.x - m.r, m.x + m.r, 0.85);
  };

  // The lamplight he reads by, while his back's turned: ordinary light. The chain reaches him from just outside it, and walking on past the TAP ring takes Silas into it.
  SC.drawMaroPool = function (c, b) {
    if (!SC.maroOpen(b)) return;
    const g = T.groundY;
    cone(c, b.x + 18, g - 96, b.x - T.maroPool, b.x + T.maroPool, 0.28);
    pool(c, b.x - T.maroPool, b.x + T.maroPool, 0.6);
  };

  // The lamp line: everything behind it is light. Drawn over the street at its own x.
  SC.drawLine = function (c, w, view, cam, t) {
    const A_ = A(), g = T.groundY, x = w.line, left = cam + view.left;
    if (x < left - 60) return;
    const grad = c.createLinearGradient(x - 180, 0, x + 10, 0);
    grad.addColorStop(0, 'rgba(255,190,90,.72)'); grad.addColorStop(1, 'rgba(255,190,90,.12)');
    c.fillStyle = grad; c.fillRect(left, view.top, Math.max(0, x + 10 - left), view.bottom - view.top);
    pool(c, left, x + 8, 0.8);
    const h = A_.heightOf('trooper', T.pxPerCm);
    [-92, -48, 0].forEach((d, i) => {
      const px = x + d - i * 4;
      if (px < left - 40) return;
      if (!A_.draw(c, 'trooper_walk', A_.frameAt('trooper_walk', t + i * 0.3), px, g, h)) A_.personFast(c, 'trooper', { x: px, y: g, h, pose: 'walk', t: t + i * 0.3 });
      SC.handLamp(c, px + 15, g - 42, t + i);
    });
  };
  SC.handLamp = function (c, x, y, t) {
    const A_ = A();
    A_.poly(c, [[x - 5, y - 7], [x + 5, y - 7], [x + 6, y + 6], [x - 6, y + 6]], '#ffe39a', 1.8);
    A_.ellipse(c, x, y, 2.6, 4, '#ff9c2e', 0);
    A_.line(c, x - 4, y - 8, x + 4, y - 8, 2.4, '#2f2a3a');
  };
})();
