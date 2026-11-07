// Hold the Deck: Keelbreak and the Gullwake's deck, seen from the galley door. Heavy pictures are drawn once on a hidden canvas and stamped after that, for weak phones.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const baked = new Map(), SCALE = 2;

  HD.bake = function (key, w, h, ox, oy, paint, sharp = SCALE) {
    let b = baked.get(key);
    if (!b) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(w * sharp); cv.height = Math.ceil(h * sharp);
      const c = cv.getContext('2d');
      c.scale(sharp, sharp); c.translate(ox, oy);
      paint(c);
      b = { cv, w, h, ox, oy };
      baked.set(key, b);
      cv.addEventListener('contextlost', () => { if (baked.get(key) === b) baked.delete(key); });   // a browser short of memory can drop a canvas; forget it, and the next frame paints it again
    }
    return b;
  };
  HD.forget = key => baked.delete(key);
  HD.stamp = function (c, b, x, y, s = 1, flip = false) {
    c.save(); c.translate(x, y);
    if (flip) c.scale(-1, 1);
    if (s !== 1) c.scale(s, s);
    c.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    c.restore();
  };
  HD.scatter = function (seed) { let a = seed >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };
  HD.mix = function (a, b, u) {
    const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16), m = (x, y) => Math.round(x + (y - x) * u);
    return '#' + ((1 << 24) + (m(p >> 16, q >> 16) << 16) + (m((p >> 8) & 255, (q >> 8) & 255) << 8) + m(p & 255, q & 255)).toString(16).slice(1);
  };

  // Five looks, one per stage: golden dusk, blue evening with lamps, night rain with the crane working, the deck on fire, the broken deck with white light under it.
  const LOOKS = [
    { top: '#141a44', mid: '#4a3a6e', low: '#d0683a', base: '#f6b04e', far: '#3a2a4e', plank: '#a07a50', plank2: '#8e6a44', seam: '#54392a', wall: '#6a3f2c', cap: '#a8693f', lamp: '#ffd27a' },
    { top: '#0b1030', mid: '#25306a', low: '#6a3f7a', base: '#c8643e', far: '#1c2148', plank: '#7f6a5c', plank2: '#6f5c52', seam: '#3a2c2c', wall: '#4f3a38', cap: '#80604a', lamp: '#ffd27a' },
    { top: '#070a1e', mid: '#121a3e', low: '#232c56', base: '#4a4a70', far: '#0e1330', plank: '#5e5c66', plank2: '#524f5c', seam: '#26242e', wall: '#3a3440', cap: '#5a5058', lamp: '#bfe2ff' },
    { top: '#14080f', mid: '#3a1420', low: '#a43420', base: '#f07a24', far: '#260d14', plank: '#6e4c3a', plank2: '#5e4032', seam: '#2a1a16', wall: '#452820', cap: '#6a3d2a', lamp: '#ff9a4a' },
    { top: '#0c0a16', mid: '#22183a', low: '#4a2440', base: '#8c3a34', far: '#14101f', plank: '#5a4a44', plank2: '#4c3e3a', seam: '#1e1614', wall: '#33262a', cap: '#54403a', lamp: '#eef2ff' },
  ];
  HD.LOOKS = LOOKS;
  const P = (k, y) => [T.midX + k * HD.laneW(y), y];
  const EDGE = 1.72;   // the rail stands this many lane-widths out from the middle

  function paintDeck(c, L, n) {
    const A_ = A(), near = T.doorY + 40, rnd = HD.scatter(77 + n);
    const quad = (k0, k1, y0, y1, fill, lw) => A_.poly(c, [P(k0, y0), P(k1, y0), P(k1, y1), P(k0, y1)], fill, lw || 0);
    quad(-EDGE, EDGE, T.farY, near, L.plank);
    quad(-0.5, 0.5, T.farY, near, L.plank2);
    // Planks run with the lanes, seams stagger across them, and the one shadow tone sits on each far edge.
    const count = 16;
    for (let i = 0; i <= count; i++) {
      const k = -EDGE + (2 * EDGE * i) / count;
      c.beginPath(); c.moveTo(...P(k, T.farY)); c.lineTo(...P(k, near)); c.lineWidth = 0.9; c.strokeStyle = L.seam; c.stroke();
      for (let d = rnd() * 0.3; d < 1.15; d += 0.14 + rnd() * 0.22) {
        const y = HD.yOf(d), k2 = k + (2 * EDGE) / count;
        if (i < count) { c.beginPath(); c.moveTo(...P(k, y)); c.lineTo(...P(k2, y)); c.lineWidth = 0.9; c.stroke(); A_.circle(c, P(k + 0.03, y + 2)[0], y + 2, 0.7, L.seam, 0); }
      }
    }
    // The lanes: three wide strips, marked off with tarred rope.
    for (const k of [-1.5, -0.5, 0.5, 1.5]) {
      A_.poly(c, [P(k - 0.03, T.farY), P(k + 0.03, T.farY), P(k + 0.03, near), P(k - 0.03, near)], A_.INK, 0);
      A_.poly(c, [P(k - 0.012, T.farY), P(k + 0.012, T.farY), P(k + 0.012, near), P(k - 0.012, near)], '#c9a86a', 0);
    }
    // The gold line: past it, he can reach them.
    const ry = HD.yOf(T.reachD);
    for (let k = -1.5; k < 1.5; k += 0.2) {
      A_.poly(c, [P(k, ry - 2.5), P(k + 0.13, ry - 2.5), P(k + 0.13, ry + 2.5), P(k, ry + 2.5)], A_.GOLD, 1.2);
    }
    // The rails down each side, and across the far end, with a gap where the gangway comes aboard.
    for (const s of [-1, 1]) {
      const rail = y => [P(s * EDGE, y)[0] + s * 22 * HD.scaleAt(y) * 1.6, y - 92 * HD.scaleAt(y)];
      A_.poly(c, [P(s * EDGE, T.farY), rail(T.farY), rail(near), P(s * EDGE, near)], L.wall, 2);
      A_.poly(c, [rail(T.farY), [rail(T.farY)[0] + s * 5, rail(T.farY)[1]], [rail(near)[0] + s * 20, rail(near)[1]], rail(near)], L.cap, 2);
      for (let d = 0.04; d < 1.2; d += 0.16) {
        const y = HD.yOf(d), a = P(s * EDGE, y), b = rail(y), w = 3 * HD.scaleAt(y) * 3;
        A_.poly(c, [[a[0] - w / 2, a[1]], [a[0] + w / 2, a[1]], [b[0] + w / 2, b[1]], [b[0] - w / 2, b[1]]], A_.shade(L.wall, 1.25), 1.2);
      }
    }
    A_.poly(c, [[T.midX - 150, T.farY - 22], [T.midX - 62, T.farY - 22], [T.midX - 62, T.farY + 2], [T.midX - 150, T.farY + 2]], L.wall, 2);
    A_.poly(c, [[T.midX + 62, T.farY - 22], [T.midX + 150, T.farY - 22], [T.midX + 150, T.farY + 2], [T.midX + 62, T.farY + 2]], L.wall, 2);
    A_.poly(c, [[T.midX - 150, T.farY - 26], [T.midX - 60, T.farY - 26], [T.midX - 60, T.farY - 21], [T.midX - 150, T.farY - 21]], L.cap, 1.6);
    A_.poly(c, [[T.midX + 60, T.farY - 26], [T.midX + 150, T.farY - 26], [T.midX + 150, T.farY - 21], [T.midX + 60, T.farY - 21]], L.cap, 1.6);
    // Bits of a working deck against the rails, only ever beside the lanes.
    barrel(c, P(-1.62, HD.yOf(0.3))[0] - 2, HD.yOf(0.3), 0.55, L);
    barrel(c, P(1.62, HD.yOf(0.46))[0] + 2, HD.yOf(0.46), 0.7, L);
    if (n === 3) for (const q of [[-1.2, 0.2], [0.9, 0.42], [-0.1, 0.68], [1.1, 0.8], [-1.0, 0.86]]) A_.ellipse(c, P(q[0], HD.yOf(q[1]))[0], HD.yOf(q[1]), 22 * HD.scaleAt(HD.yOf(q[1])) * 2, 6 * HD.scaleAt(HD.yOf(q[1])) * 2, '#23150f', 0);   // scorch marks
    if (n === 4) for (const q of [[-1.1, 0.5], [0.4, 0.36], [1.05, 0.72], [-0.2, 0.9]]) crack(c, P(q[0], HD.yOf(q[1]))[0], HD.yOf(q[1]), 26 * HD.scaleAt(HD.yOf(q[1])) * 2, rnd);   // light through the split planks
  }
  function barrel(c, x, y, s, L) {
    const A_ = A(), w = 15 * s * 1.4, h = 42 * s * 1.4;
    A_.poly(c, [[x - w * 0.8, y], [x - w, y - h / 2], [x - w * 0.8, y - h], [x + w * 0.8, y - h], [x + w, y - h / 2], [x + w * 0.8, y]], L.cap, 1.6);
    A_.poly(c, [[x + w * 0.3, y], [x + w * 0.5, y - h / 2], [x + w * 0.3, y - h], [x + w * 0.8, y - h], [x + w, y - h / 2], [x + w * 0.8, y]], A_.shade(L.cap), 0);
    for (const u of [0.22, 0.78]) A_.line(c, x - w * 0.96, y - h * u, x + w * 0.96, y - h * u, 2.4, A_.INK);
    A_.ellipse(c, x, y - h, w * 0.8, h * 0.1, A_.shade(L.cap, 0.6), 1.4);
  }
  function crack(c, x, y, r, rnd) {
    const A_ = A(), pts = [];
    for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; pts.push([x + Math.cos(a) * r * (0.5 + rnd()), y + Math.sin(a) * r * 0.28 * (0.5 + rnd())]); }
    A_.poly(c, pts, '#14101c', 1.6);
    A_.poly(c, pts.map(p => [x + (p[0] - x) * 0.55, y + (p[1] - y) * 0.55]), '#eef2ff', 0);
  }

  // What's behind the ship: the sky, the yard's cranes, the slip's timber props to either side on wide screens.
  function paintFar(c, L, n) {
    const A_ = A(), rnd = HD.scatter(11 + n);
    // A far island, then the yard
    A_.island(c, -160, 56, 170, 60, { rock: L.far, top: A_.shade(L.far, 1.3), seed: 4, lw: 0 });
    A_.island(c, 280, 40, 200, 74, { rock: L.far, top: A_.shade(L.far, 1.3), seed: 7, lw: 0 });
    const ink = A_.shade(L.far, 0.7);
    // The big crane, standing over the ship from the right
    A_.poly(c, [[262, 96], [272, -80], [286, -80], [304, 96]], ink, 0);
    for (let y = 80; y > -80; y -= 26) A_.line(c, 268 - (y - 80) * 0.055, y, 296 + (y - 80) * 0.11, y - 26, 1.6, L.far);
    A_.poly(c, [[60, -46], [340, -60], [340, -50], [60, -38]], ink, 0);
    A_.poly(c, [[300, -80], [344, -86], [344, -46], [300, -46]], ink, 0);
    for (let x = 80; x < 300; x += 26) A_.line(c, x, -42 - (x - 60) * 0.03, x + 13, -50 - (x - 60) * 0.03, 1.4, L.far);
    // A far crane, left, smaller
    A_.poly(c, [[38, 96], [46, 4], [54, 4], [70, 96]], ink, 0);
    A_.poly(c, [[-40, 10], [92, 2], [92, 8], [-40, 16]], ink, 0);
    // Timber props and scaffold along both sides of the slip, for wide screens
    for (const s of [-1, 1]) for (let i = 0; i < 7; i++) {
      const x = T.midX + s * (230 + i * 46), y0 = 150 + rnd() * 60;
      A_.poly(c, [[x - 6, y0], [x + 6, y0], [x + 6 + s * 40, 700], [x - 6 + s * 40, 700]], ink, 0);
      A_.line(c, x + s * 5, y0 + 70, x + s * 56, y0 + 140, 5, ink);
      if (i % 2) A_.poly(c, [[x - 30, y0 - 12], [x + 30, y0 - 12], [x + 30, y0 - 2], [x - 30, y0 - 2]], ink, 0);
    }
    for (let i = 0; i < 6; i++) A_.circle(c, 40 + i * 60 + rnd() * 20, 86 - rnd() * 6, 1.8, L.lamp, 0);
  }

  // The galley counter along the bottom: the near edge of everything, and what the read-outs sit on.
  function paintCounter(c) {
    const A_ = A();
    A_.poly(c, [[-500, 0], [860, 0], [860, 12], [-500, 12]], '#a8744a', 2);
    A_.poly(c, [[-500, 12], [860, 12], [860, 400], [-500, 400]], '#4a2f22', 2);
    A_.poly(c, [[-500, 12], [860, 12], [860, 20], [-500, 20]], '#2f1d16', 0);
    for (let x = -480; x < 860; x += 58) A_.line(c, x, 22, x, 400, 1.4, '#35211a');
    for (let x = -480; x < 860; x += 58) A_.circle(c, x + 6, 28, 1.2, '#8e6a44', 0);
    // Under the read-outs, for tall phones and wide screens: the shelf with the galley's pots.
    A_.poly(c, [[-500, 196], [860, 196], [860, 206], [-500, 206]], '#7a5236', 2);
    const pot = (x, s) => {
      A_.poly(c, [[x - 26 * s, 196], [x - 30 * s, 160], [x + 30 * s, 160], [x + 26 * s, 196]], '#3f414a', 2);
      A_.poly(c, [[x + 8 * s, 196], [x + 12 * s, 160], [x + 30 * s, 160], [x + 26 * s, 196]], '#2d2f36', 0);
      A_.poly(c, [[x - 33 * s, 160], [x + 33 * s, 160], [x + 33 * s, 154], [x - 33 * s, 154]], '#5a5c66', 1.8);
      A_.circle(c, x, 150, 3.4 * s, '#8e919a', 1.4);
    };
    pot(60, 1); pot(300, 0.8); pot(-120, 1.1); pot(480, 1);
    A_.line(c, 180, 150, 180, 192, 4, A_.INK); A_.line(c, 180, 150, 180, 192, 2, '#a97a4a');   // a ladle on its hook
    A_.ellipse(c, 180, 193, 7, 4, '#8e919a', 1.4);
    for (const x of [130, 230]) { A_.circle(c, x, 176, 16, '#2d2f36', 2); A_.circle(c, x, 176, 11, '#3f414a', 0); A_.line(c, x, 160, x, 148, 3, A_.INK); }
  }

  HD.drawSky = function (c, view, n) {
    const L = LOOKS[n], g = c.createLinearGradient(0, view.top, 0, 180), g2 = c.createLinearGradient(0, 180, 0, 640);
    g.addColorStop(0, L.top); g.addColorStop(0.45, L.mid); g.addColorStop(0.8, L.low); g.addColorStop(1, L.base);
    g2.addColorStop(0, L.base); g2.addColorStop(0.5, L.low); g2.addColorStop(1, L.mid);   // below the horizon, seen only on wide screens
    c.fillStyle = g; c.fillRect(view.left, view.top, view.right - view.left, 180 - view.top);
    c.fillStyle = g2; c.fillRect(view.left, 180, view.right - view.left, view.bottom - 180);
    HD.stamp(c, HD.bake('far' + n, 1100, 800, 400, 100, cc => paintFar(cc, L, n), 1.5), 0, 0);
  };
  // Only one stage's big pictures are kept at a time, for weak phones.
  let kept = -1;
  HD.drawDeck = function (c, n) {
    if (kept !== n) { if (kept >= 0) { HD.forget('deck' + kept); HD.forget('far' + kept); } kept = n; }
    HD.stamp(c, HD.bake('deck' + n, 1000, 530, 320, -50, cc => paintDeck(cc, LOOKS[n], n)), 0, 0);
  };
  HD.drawCounter = function (c) {
    HD.stamp(c, HD.bake('counter', 1360, 400, 500, 2, paintCounter), 0, T.doorY + 4);
  };

  // Weather and fire: looks only, so Math.random is fine.
  const rain = []; for (let i = 0; i < 46; i++) rain.push([Math.random(), Math.random(), 0.7 + Math.random() * 0.6]);
  HD.drawWeather = function (c, view, n, t) {
    const W_ = view.right - view.left, H = view.bottom - view.top;
    if (n === 2) {
      c.strokeStyle = 'rgba(190,215,255,.34)'; c.lineWidth = 1.1; c.beginPath();
      for (const r of rain) { const x = view.left + ((r[0] * W_ + t * 90 * r[2]) % W_), y = view.top + ((r[1] * H + t * 620 * r[2]) % H); c.moveTo(x, y); c.lineTo(x - 3, y - 14); }
      c.stroke();
    }
    if (n === 3) {
      for (let i = 0; i < 16; i++) { const r = rain[i], y = view.top + H - (((r[1] * H) + t * 70 * r[2]) % H), x = view.left + ((r[0] * W_ + Math.sin(t + i) * 16) % W_); A().circle(c, x, y, 1.1 + r[2], i % 2 ? '#ffb24a' : '#ff7a2a', 0); }
      for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {   // fire on the rails
        const d = 0.3 + i * 0.22, y = HD.yOf(d), x = P(s * EDGE, y)[0] + s * 8, h = (26 + Math.sin(t * 9 + i) * 6) * HD.scaleAt(y) * 2.2, w = 9 * HD.scaleAt(y) * 2.2;
        A().poly(c, [[x - w, y], [x - w * 0.5, y - h * 0.6], [x, y - h], [x + w * 0.5, y - h * 0.55], [x + w, y]], '#f07a24', 1.2);
        A().poly(c, [[x - w * 0.5, y], [x, y - h * 0.55], [x + w * 0.5, y]], '#ffd27a', 0);
      }
    }
    if (n === 4) { for (let i = 0; i < 10; i++) { const r = rain[i], y = view.top + H - (((r[1] * H) + t * 40 * r[2]) % H), x = view.left + r[0] * W_; A().circle(c, x, y, 1, '#eef2ff', 0); } }
  };
})();
