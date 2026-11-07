// Silent Cut: things on the street. Cover, lantern posts, crane crates, searchlight towers, the way out. World coordinates; feet line at TUNE.groundY.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => SC.sceneArt;   // thinner ink, so props sit with the pictures' fine lines (bake.js)

  function crate(c, x, y, w, h, col) {
    const A_ = A();
    A_.slab(c, x, y, w, h, col, 2.2);
    const d = A_.shade(col, 0.68);
    A_.line(c, x + 3, y + 3, x + w - 3, y + h - 3, 2.4, d); A_.line(c, x + w - 3, y + 3, x + 3, y + h - 3, 2.4, d);
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + 5], [x, y + 5]], A_.shade(col, 1.2), 1.2);
    A_.poly(c, [[x, y + h - 5], [x + w, y + h - 5], [x + w, y + h], [x, y + h]], d, 1.2);
  }
  function barrel(c, x, w, h, col) {
    const A_ = A();
    A_.blob(c, [[x, 0], [x - 4, -h / 2], [x, -h], [x + w, -h], [x + w + 4, -h / 2], [x + w, 0]], col, 2.2);
    A_.poly(c, [[x + w * 0.62, 0], [x + w + 3, -2], [x + w + 3, -h + 2], [x + w * 0.62, -h]], A_.shade(col, 0.74), 0);
    [-h * 0.2, -h * 0.8].forEach(y => A_.line(c, x - 3, y, x + w + 3, y, 2.6, '#2b2730'));
    A_.ellipse(c, x + w / 2, -h, w / 2, 3.4, A_.shade(col, 1.2), 1.8);
  }
  function sack(c, x, y, w, h, col) {
    const A_ = A();
    A_.blob(c, [[x, y], [x - 2, y - h * 0.7], [x + w * 0.3, y - h], [x + w * 0.8, y - h * 0.95], [x + w + 2, y - h * 0.5], [x + w, y]], col, 2.1);
    A_.line(c, x + w * 0.3, y - h * 0.9, x + w * 0.4, y - h * 0.6, 1.3, A_.shade(col, 0.6));
  }
  function ledgerStack(c, x, w, h, col) {
    const A_ = A();
    let y = 0, i = 0;
    while (y > -h) {
      const bh = 9 + (i % 3) * 3, ww = w - (i % 2) * 8, xx = x + (i % 3) * 3;
      A_.poly(c, [[xx, y], [xx + ww, y], [xx + ww, y - bh], [xx, y - bh]], ['#7a3d3a', '#3f5a68', '#7a6a38'][i % 3], 1.8);
      A_.poly(c, [[xx + ww - 8, y - 2], [xx + ww - 1, y - 2], [xx + ww - 1, y - bh + 2], [xx + ww - 8, y - bh + 2]], '#ddd2b4', 0);
      y -= bh; i++;
    }
    A_.poly(c, [[x - 2, 0], [x + w + 2, 0], [x + w + 2, -5], [x - 2, -5]], col, 1.8);
  }

  // The part of the cover in front of a hidden Silas. x = middle of the cover.
  const PAINT = {
    crates: c => { crate(c, -40, -38, 44, 38, '#8a6236'); crate(c, 2, -44, 38, 44, '#79552f'); crate(c, -24, -68, 34, 30, '#94703f'); },
    barrels: c => { barrel(c, -38, 28, 50, '#7c4e2e'); barrel(c, -6, 28, 54, '#6b4427'); barrel(c, -20, 22, 20, '#865634'); },
    tarp: c => { const A_ = A(); A_.blob(c, [[-42, 0], [-40, -44], [-14, -64], [20, -60], [40, -38], [42, 0]], '#4d6b5e', 2.4); A_.poly(c, [[6, -60], [20, -60], [40, -38], [42, 0], [14, 0]], '#3b5349', 0); A_.blob(c, [[-42, 0], [-40, -44], [-14, -64], [20, -60], [40, -38], [42, 0]], null, 2.4); [-26, 2, 28].forEach(x => A_.line(c, x, -3, x + 4, -56 + Math.abs(x) * 0.5, 2, '#2a2d30')); },
    sacks: c => { sack(c, -40, 0, 36, 26, '#a38f6a'); sack(c, -6, 0, 40, 28, '#8e7b5a'); sack(c, -24, -22, 40, 26, '#a38f6a'); sack(c, -8, -44, 26, 16, '#8e7b5a'); },
    door: c => { const A_ = A(); A_.poly(c, [[-38, 0], [38, 0], [38, -6], [-38, -6]], '#5a5460', 1.8); },
    ledgers: c => { ledgerStack(c, -40, 36, 56, '#3a2620'); ledgerStack(c, 2, 38, 66, '#3a2620'); },
  };
  // The dark that cover throws on the wall, so a safe place reads at a glance, and a doorway behind.
  function back(c, k) {
    const A_ = A();
    if (k.kind === 'door') {
      A_.poly(c, [[-38, 0], [-38, -112], [38, -112], [38, 0]], '#5e4a3a', 2.6);
      A_.poly(c, [[-30, 0], [-30, -104], [30, -104], [30, 0]], '#12122e', 2);
      A_.poly(c, [[-42, -112], [42, -112], [42, -120], [-42, -120]], '#6e5844', 2);
      return;
    }
    c.fillStyle = 'rgba(14,14,44,.42)';
    c.beginPath(); c.moveTo(-k.w / 2 - 12, 0); c.lineTo(-k.w / 2 - 2, -96); c.lineTo(k.w / 2 + 2, -96); c.lineTo(k.w / 2 + 12, 0); c.closePath(); c.fill();
  }
  // Painted once per kind, then stamped.
  SC.drawCoverBack = function (c, k) {
    const g = T.groundY, b = SC.bake('cb' + k.kind, 120, 140, 60, 130, cc => back(cc, k));
    SC.stamp(c, b, k.x, g);
    c.setLineDash([7, 5]); c.lineWidth = 2.2; c.strokeStyle = '#b79cff';
    c.beginPath(); c.moveTo(k.x - k.w / 2, g + 7); c.lineTo(k.x + k.w / 2, g + 7); c.stroke(); c.setLineDash([]);
  };
  SC.drawCoverFront = function (c, k) {
    const g = T.groundY, b = SC.bake('cf' + k.kind, 120, 100, 60, 90, cc => PAINT[k.kind](cc));
    SC.stamp(c, b, k.x, g);
  };

  // A lantern on an iron bracket. x = its light's middle.
  SC.LANTERN_ALT = 118;
  SC.drawLantern = function (c, l, t, licked) {
    const A_ = A(), g = T.groundY, ly = g - SC.LANTERN_ALT;
    const post = SC.bake('post', 60, 180, 40, 170, cc => {
      A_.line(cc, -14, 0, -14, -158, 5.4); A_.line(cc, -14, 0, -14, -158, 3, '#3a3a58');
      A_.line(cc, -14, -150, 8, -150, 4.4); A_.line(cc, -14, -150, 8, -150, 2.2, '#3a3a58');
      A_.line(cc, -14, -132, 2, -150, 3); A_.ellipse(cc, -14, 0, 8, 3, '#3a3a58', 1.6);
    });
    SC.stamp(c, post, l.x, g);
    if (l.lit) {
      A_.line(c, l.x + 8, g - 150, l.x + 8, ly - 10, 2.2);
      const flick = licked ? 0.55 + 0.45 * Math.abs(Math.sin(t * 3.1)) : 0.92 + Math.sin(t * 9 + l.x) * 0.08;
      A_.poly(c, [[l.x + 1, ly - 10], [l.x + 15, ly - 10], [l.x + 17, ly + 10], [l.x - 1, ly + 10]], '#ffe39a', 2.2);
      c.globalAlpha = flick; A_.ellipse(c, l.x + 8, ly + 1, 5, 7.5, '#ff9c2e', 0); c.globalAlpha = 1;
      A_.poly(c, [[l.x - 2, ly - 13], [l.x + 18, ly - 13], [l.x + 15, ly - 9], [l.x + 1, ly - 9]], '#2f2a3a', 1.8);
      A_.poly(c, [[l.x - 1, ly + 10], [l.x + 17, ly + 10], [l.x + 15, ly + 14], [l.x + 1, ly + 14]], '#2f2a3a', 1.8);
    } else {
      A_.line(c, l.x + 8, g - 150, l.x + 6, g - 132, 2.2);
      A_.poly(c, [[l.x - 6, g - 1], [l.x + 12, g - 1], [l.x + 18, g - 8], [l.x + 3, g - 11]], '#2f2a3a', 1.8);
      A_.poly(c, [[l.x - 12, g + 2], [l.x - 8, g - 2], [l.x - 5, g + 3]], '#ffe39a', 1); A_.poly(c, [[l.x + 20, g + 3], [l.x + 24, g - 1], [l.x + 26, g + 3]], '#ffe39a', 1);
    }
  };

  // A searchlight tower behind the street. Lamp head at (x, y), aimed at the point it's lighting.
  SC.towerHead = sw => ({ x: (sw.a + sw.b) / 2, y: T.groundY - 236 });
  SC.drawTower = function (c, sw, aimX) {
    const A_ = A(), g = T.groundY, h = SC.towerHead(sw);
    const b = SC.bake('tower', 90, 250, 45, 244, cc => {
      const iron = '#3b3a68';
      A_.poly(cc, [[-30, 0], [-20, 0], [-5, -232], [-13, -232]], iron, 2);
      A_.poly(cc, [[30, 0], [20, 0], [5, -232], [13, -232]], iron, 2);
      for (let i = 1; i < 8; i++) { const u = i / 8, y = -232 * u, wx = 25 - 16 * u; A_.line(cc, -wx, y, wx, y - 24, 1.6, A_.INK); }
      A_.poly(cc, [[-18, -232], [18, -232], [18, -226], [-18, -226]], '#55547c', 2);
    });
    SC.stamp(c, b, h.x, g);
    const an = Math.atan2(g - h.y, aimX - h.x);
    c.save(); c.translate(h.x, h.y); c.rotate(an - Math.PI / 2);
    A_.poly(c, [[-11, -10], [11, -10], [15, 12], [-15, 12]], '#6a6a8c', 2.2);
    A_.ellipse(c, 0, 13, 14, 4, '#fff6c8', 1.8);
    c.restore();
  };

  // Flood lamps: a rack on a mast at each end of a floodlit stretch.
  SC.drawFloodMast = function (c, x) {
    const A_ = A(), g = T.groundY;
    A_.line(c, x, g, x, g - 164, 6); A_.line(c, x, g, x, g - 164, 3.4, '#4a4a70');
    A_.poly(c, [[x - 20, g - 176], [x + 20, g - 176], [x + 20, g - 162], [x - 20, g - 162]], '#55547c', 2.2);
    [-13, 0, 13].forEach(d => A_.circle(c, x + d, g - 169, 5, '#fff6c8', 1.6));
  };

  // The crane rail and every crate on it. The crates' shadows are what's left dark in the flood (lights.js).
  SC.RAIL_ALT = 190;
  SC.CRATE_DROP = 76;   // from the rail to a crate's underside: its shadow starts there (lights.js)
  SC.drawCranes = function (c, cr, t, view, cam) {
    const A_ = A(), g = T.groundY, ry = g - SC.RAIL_ALT;
    A_.poly(c, [[cr.a - 40, ry], [cr.b + 40, ry], [cr.b + 40, ry + 7], [cr.a - 40, ry + 7]], '#7c4a2c', 2.2);
    const span = cr.gap, x0 = cr.a + t * cr.v;
    let k = Math.ceil((cam + view.left - 90 - x0) / span);
    for (; ; k++) {
      const x = x0 + k * span;
      if (x > cam + view.right + 90) break;
      if (x < cr.a - 40 || x > cr.b + 40) continue;
      const w = cr.w * 0.74, h = 36;
      A_.line(c, x - w * 0.3, ry + 7, x, ry + 40, 2); A_.line(c, x + w * 0.3, ry + 7, x, ry + 40, 2);
      A_.poly(c, [[x - w / 2, ry + 40], [x + w / 2, ry + 40], [x + w / 2, ry + 40 + h], [x - w / 2, ry + 40 + h]], '#8a6236', 2.4);
      A_.poly(c, [[x - w / 2, ry + 40 + h * 0.66], [x + w / 2, ry + 40 + h * 0.66], [x + w / 2, ry + 40 + h], [x - w / 2, ry + 40 + h]], '#6a4b28', 0);
      A_.line(c, x - w / 2, ry + 40, x + w / 2, ry + 40 + h, 2.2, '#5a3f22'); A_.line(c, x + w / 2, ry + 40, x - w / 2, ry + 40 + h, 2.2, '#5a3f22');
      A_.poly(c, [[x - w / 2, ry + 40], [x + w / 2, ry + 40], [x + w / 2, ry + 40 + h], [x - w / 2, ry + 40 + h]], null, 2.4);
    }
  };

  // The way out: a door with a lamp over it, gold, so it reads from far off.
  SC.drawExit = function (c, x, t) {
    const A_ = A(), g = T.groundY;
    A_.poly(c, [[x, g], [x, g - 130], [x + 92, g - 130], [x + 92, g]], '#5e4a3a', 2.8);
    A_.poly(c, [[x + 10, g], [x + 10, g - 118], [x + 82, g - 118], [x + 82, g]], '#10102a', 2.2);
    A_.circle(c, x + 46, g - 140, 7, '#ffcf6a', 2);
    c.globalAlpha = 0.5 + Math.sin(t * 4) * 0.2; A_.ellipse(c, x + 46, g - 60, 40, 58, '#f4c152', 0); c.globalAlpha = 1;
    A_.poly(c, [[x + 18, g - 44], [x + 54, g - 44], [x + 54, g - 56], [x + 76, g - 36], [x + 54, g - 16], [x + 54, g - 28], [x + 18, g - 28]], A_.GOLD, 2.2);
  };

  // Scattered ledger pages.
  SC.drawPage = function (c, x, y, a) {
    c.save(); c.translate(x, y); c.rotate(a);
    A().poly(c, [[-6, -8], [6, -8], [6, 8], [-6, 8]], '#efe6cc', 1.3);
    A().line(c, -4, -4, 4, -4, 0.9, '#6a5a4a'); A().line(c, -4, 0, 4, 0, 0.9, '#6a5a4a'); A().line(c, -4, 4, 2, 4, 0.9, '#6a5a4a');
    c.restore();
  };
})();
