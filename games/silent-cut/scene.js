// Silent Cut: Lanternreach at night, in layers: violet sky and moon, far islands, the port's skyline, then a street front and a walkway for each stage. Baked once, stamped after that.
// Mid values on purpose: a night that goes black on a dim phone is unreadable. Colours from the Lanternreach picture (art/site/lanternreach-v1).
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => SC.sceneArt;   // thinner ink, so the street sits with the pictures' fine lines (bake.js)
  const FRONT_W = 960;
  // One palette per stage: wall, its shadow tone, walkway, walkway's edge.
  const THEMES = [
    { wall: '#4d4a8c', dark: '#3b3872', road: '#6b6a9c', edge: '#8d8cbc', band: '#22204e' },   // The Wet Steps: stone
    { wall: '#584482', dark: '#433368', road: '#6e5f8e', edge: '#9483ac', band: '#241c48' },   // Oil Row: timber
    { wall: '#46507e', dark: '#363e66', road: '#646c92', edge: '#8a92b4', band: '#1c2146' },   // Crane Yard: steel
    { wall: '#3f4a84', dark: '#30396a', road: '#79644e', edge: '#a88c6a', band: '#1b1c44' },   // The Long Boards
    { wall: '#5a3e5e', dark: '#452e4a', road: '#6f5240', edge: '#967258', band: '#20162c' },   // The Lamplit Warehouse: brick and floorboards
  ];
  SC.theme = i => THEMES[Math.max(0, Math.min(THEMES.length - 1, i))];

  function far() {
    return SC.bake('far', 1100, 130, 0, 0, c => {
      const A_ = A(), r = SC.scatter(9);
      [[60, 62, 120, 34], [330, 78, 80, 22], [560, 50, 150, 44], [850, 74, 110, 28]].forEach(p => {
        A_.island(c, p[0], p[1], p[2], p[3], { rock: '#332f6e', top: '#3d3880', seed: p[0], lw: 0 });
        for (let i = 0; i < 5; i++) A_.circle(c, p[0] + 8 + r() * (p[2] - 16), p[1] - 1, 1.2, '#f4c152', 0);
      });
      for (let i = 0; i < 9; i++) A_.ellipse(c, i * 130 + r() * 40, 116 + r() * 8, 90, 15, '#3a3480', 0);
    });
  }
  // The port behind the street: gabled warehouses and strings of lamps, in one flat tone.
  function skyline(theme) {
    return SC.bake('sky' + theme, 1040, 200, 0, 0, c => {
      const A_ = A(), r = SC.scatter(31 + theme * 7), base = theme === 2 ? '#2c3364' : '#2e2a68';
      let x = -20;
      while (x < 1040) {
        const w = 70 + r() * 90, h = 60 + r() * 96;
        A_.poly(c, [[x, 200], [x, 200 - h], [x + w / 2, 200 - h - 20 - r() * 12], [x + w, 200 - h], [x + w, 200]], base, 0);
        for (let i = 0; i < 4; i++) if (r() < 0.8) { const wx = x + 8 + r() * (w - 18), wy = 200 - h + 12 + r() * (h - 26); A_.poly(c, [[wx, wy], [wx + 6, wy], [wx + 6, wy + 9], [wx, wy + 9]], '#e9b04c', 0); }
        x += w - 4;
      }
      for (let i = 0; i < 16; i++) { const px = i * 66 + 10, py = 70 + Math.sin(i * 1.3) * 10; A_.circle(c, px, py, 1.7, '#ffd47a', 0); }
    });
  }

  // ---- Street fronts, one tile, world-locked to the walkway. Drawn up from the feet line (y = 0 is the ground).
  function blocks(c, w, h, col, line, bw, bh) {
    const A_ = A();
    A_.poly(c, [[0, 0], [w, 0], [w, -h], [0, -h]], col, 0);
    c.beginPath();
    for (let row = 1; row * bh < h; row++) {
      c.moveTo(0, -row * bh); c.lineTo(w, -row * bh);
      for (let x = (row % 2) * bw * 0.5; x < w; x += bw) { c.moveTo(x, -row * bh); c.lineTo(x, -(row - 1) * bh); }
    }
    c.lineWidth = 1.1; c.strokeStyle = line; c.stroke();
  }
  function arch(c, x, w, h, fill, lw) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, -h + w / 2); c.arc(x + w / 2, -h + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w, 0); c.closePath();
    c.fillStyle = fill; c.fill(); c.lineWidth = (lw || 2.4) * T.sceneInk; c.strokeStyle = A().INK; c.stroke();
  }
  function pane(c, x, y, w, h, lit) {
    const A_ = A();
    A_.poly(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], lit ? '#f0c060' : '#2a2650', 2);
    A_.line(c, x + w / 2, y, x + w / 2, y + h, 1.4); A_.line(c, x, y + h / 2, x + w, y + h / 2, 1.4);
  }
  const FRONTS = [
    function wet(c, k) { // harbour wall of big stone blocks, arches, mooring rings, a net
      const A_ = A();
      blocks(c, FRONT_W, 150, k.wall, k.dark, 54, 26);
      [90, 440, 780].forEach(x => { arch(c, x, 96, 110, k.dark); arch(c, x + 10, 76, 96, '#262252', 0); });
      [40, 300, 610, 900].forEach(x => { A_.circle(c, x, -60, 7, null, 3, A_.INK); A_.circle(c, x, -60, 7, null, 1.6, '#a9a4c8'); A_.line(c, x, -66, x, -74, 3, A_.INK); });
      A_.poly(c, [[0, -150], [FRONT_W, -150], [FRONT_W, -158], [0, -158]], k.edge, 2);
      for (let x = 12; x < FRONT_W; x += 72) A_.poly(c, [[x, -158], [x + 12, -158], [x + 12, -176], [x, -176]], k.dark, 1.8);
      c.beginPath(); c.moveTo(0, -172); c.lineTo(FRONT_W, -172); c.lineWidth = 3 * T.sceneInk; c.strokeStyle = A_.INK; c.stroke();
      c.lineWidth = 1.2; c.strokeStyle = '#2d2a5a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(560 + i * 8, -120); c.lineTo(548 + i * 12, -20); c.stroke(); c.beginPath(); c.moveTo(548, -110 + i * 16); c.lineTo(604, -112 + i * 16); c.stroke(); }
    },
    function oil(c, k) { // timber shopfronts: gables, awnings, hanging signs, lit shutters
      const A_ = A(), r = SC.scatter(77);
      for (let i = 0; i < 6; i++) {
        const x = i * 160, h = 150 + (i % 3) * 18;
        A_.poly(c, [[x, 0], [x, -h], [x + 80, -h - 34], [x + 160, -h], [x + 160, 0]], i % 2 ? k.wall : k.dark, 2.4);
        [x + 26, x + 134].forEach(px => A_.line(c, px, 0, px, -h + 8, 3, A_.shade(k.dark, 0.7)));
        A_.line(c, x, -96, x + 160, -96, 3, A_.shade(k.dark, 0.7));
        pane(c, x + 42, -146 - (i % 3) * 10, 28, 34, r() < 0.7); pane(c, x + 92, -146 - (i % 3) * 10, 28, 34, r() < 0.5);
        pane(c, x + 44, -82, 72, 44, i % 3 === 1);
        const col = ['#8a3a34', '#3f6a68', '#8a6a2e'][i % 3];
        A_.poly(c, [[x + 30, -100], [x + 130, -100], [x + 142, -80], [x + 18, -80]], col, 2);
        for (let s = 0; s < 6; s += 2) A_.poly(c, [[x + 30 + s * 16.6, -100], [x + 30 + (s + 1) * 16.6, -100], [x + 18 + (s + 1) * 20.6, -80], [x + 18 + s * 20.6, -80]], A_.shade(col, 0.72), 0);
      }
      [150, 470, 790].forEach(x => { A_.line(c, x, -118, x + 36, -118, 3, A_.INK); A_.line(c, x + 30, -118, x + 30, -106, 2, A_.INK); A_.poly(c, [[x + 18, -106], [x + 42, -106], [x + 42, -86], [x + 18, -86]], '#3a3040', 2); A_.circle(c, x + 30, -96, 5, '#d9a93a', 1.4); });
    },
    function crane(c, k) { // yard fence, stacked containers, the legs of the great cranes
      const A_ = A();
      A_.poly(c, [[0, 0], [FRONT_W, 0], [FRONT_W, -70], [0, -70]], k.dark, 0);
      c.lineWidth = 1; c.strokeStyle = 'rgba(16,18,31,.6)'; c.beginPath(); for (let x = -70; x < FRONT_W; x += 14) { c.moveTo(x, 0); c.lineTo(x + 70, -70); c.moveTo(x + 70, 0); c.lineTo(x, -70); } c.stroke();
      A_.line(c, 0, -70, FRONT_W, -70, 3);
      [[60, '#7a4238'], [60 + 98, '#35605e'], [100, '#70613a', 54]].forEach(q => { const y = q[2] ? -54 : 0; A_.poly(c, [[q[0], y], [q[0] + 94, y], [q[0] + 94, y - 54], [q[0], y - 54]], q[1], 2.2); for (let i = 1; i < 7; i++) A_.line(c, q[0] + i * 13.4, y - 3, q[0] + i * 13.4, y - 51, 1.3, A_.shade(q[1], 0.7)); });
      [[620, '#5b4a6c'], [620 + 98, '#7a4238']].forEach(q => { A_.poly(c, [[q[0], 0], [q[0] + 94, 0], [q[0] + 94, -54], [q[0], -54]], q[1], 2.2); for (let i = 1; i < 7; i++) A_.line(c, q[0] + i * 13.4, -3, q[0] + i * 13.4, -51, 1.3, A_.shade(q[1], 0.7)); });
      [360, 900].forEach(x => {
        const iron = '#7c4a2c';
        A_.poly(c, [[x - 50, 0], [x - 34, 0], [x + 8, -210], [x - 8, -210]], iron, 2.4);
        A_.poly(c, [[x + 50, 0], [x + 34, 0], [x - 8, -210], [x + 8, -210]], iron, 2.4);
        for (let i = 1; i < 6; i++) { const u = i / 6, h = -210 * u; A_.line(c, x - 42 + 42 * u, h, x + 42 - 42 * u, h - 30, 2, A_.INK); }
      });
    },
    function boards(c, k) { // a rail over open sky, with the clouds beyond, a warehouse here and there, washing on a line
      const A_ = A();
      [[120, 180, 138], [620, 220, 160]].forEach(q => {
        A_.poly(c, [[q[0], 0], [q[0], -q[2]], [q[0] + q[1] / 2, -q[2] - 34], [q[0] + q[1], -q[2]], [q[0] + q[1], 0]], k.wall, 2.4);
        for (let i = 1; i < 8; i++) A_.line(c, q[0] + i * q[1] / 8, -2, q[0] + i * q[1] / 8, -q[2] + 3, 1.2, k.dark);
        pane(c, q[0] + q[1] / 2 - 16, -q[2] + 8, 32, 30, true);
      });
      A_.poly(c, [[0, 0], [FRONT_W, 0], [FRONT_W, -4], [0, -4]], k.dark, 0);
      for (let x = 0; x < FRONT_W; x += 48) { A_.poly(c, [[x - 3, 0], [x + 3, 0], [x + 3, -52], [x - 3, -52]], '#5c4a3a', 2); A_.line(c, x, -36, x + 48, -24, 2, '#4a3a2e'); }
      A_.poly(c, [[0, -52], [FRONT_W, -52], [FRONT_W, -58], [0, -58]], '#6d5844', 2);
      A_.line(c, 340, -150, 590, -132, 2, A_.INK);
      [[372, '#c9c2b0'], [420, '#8a3a34'], [474, '#c9c2b0'], [530, '#3f6a68']].forEach(q => { const y = -148 + (q[0] - 340) * 0.072; A_.poly(c, [[q[0], y], [q[0] + 30, y + 2], [q[0] + 27, y + 34], [q[0] + 3, y + 32]], q[1], 1.8); });
    },
    function counting(c, k) { // Maro's warehouse: brick, a loading door, tall shelves of ledgers, moonlit arched windows, a beam with lamps hung from it
      const A_ = A(), r = SC.scatter(5);
      blocks(c, FRONT_W, 230, k.wall, k.dark, 30, 14);
      [150, 620].forEach(x => {
        c.beginPath(); c.moveTo(x, -90); c.lineTo(x, -180); c.arc(x + 40, -180, 40, Math.PI, 0); c.lineTo(x + 80, -90); c.closePath();
        c.fillStyle = '#4f62b4'; c.fill(); c.lineWidth = 3 * T.sceneInk; c.strokeStyle = A_.INK; c.stroke();
        A_.line(c, x + 40, -218, x + 40, -90, 2.4); A_.line(c, x, -150, x + 80, -150, 2.4);
      });
      [330, 800].forEach(x => {
        A_.poly(c, [[x, 0], [x + 130, 0], [x + 130, -190], [x, -190]], '#3a2620', 2.6);
        for (let row = 0; row < 5; row++) {
          const y = -18 - row * 36;
          A_.line(c, x + 2, y, x + 128, y, 3, '#25170f');
          let bx = x + 6;
          while (bx < x + 118) { const w = 6 + r() * 7, h = 20 + r() * 8, col = ['#7a3d3a', '#3f5a68', '#7a6a38', '#5e4a78'][Math.floor(r() * 4)]; A_.poly(c, [[bx, y], [bx + w, y], [bx + w, y - h], [bx, y - h]], col, 1.1); bx += w + 0.5; }
        }
      });
      // The loading door, on its rail
      A_.line(c, 462, -176, 618, -176, 4, A_.INK);
      A_.poly(c, [[472, 0], [608, 0], [608, -170], [472, -170]], '#4a3628', 2.6);
      for (let x = 490; x < 608; x += 18) A_.line(c, x, -2, x, -168, 1.4, '#2f2118');
      A_.line(c, 474, -86, 606, -86, 3, '#2f2118');
      A_.line(c, 0, -206, FRONT_W, -206, 6, A_.INK); A_.line(c, 0, -206, FRONT_W, -206, 3.4, '#8a6a4a');
      // Lamps on chains, the warehouse's only light but his
      [60, 290, 500, 760, 910].forEach(x => {
        A_.line(c, x, -204, x, -172, 2, A_.INK);
        A_.poly(c, [[x - 12, -160], [x - 5, -172], [x + 5, -172], [x + 12, -160]], '#2f2a3a', 2);
        A_.ellipse(c, x, -157, 6, 4.4, '#ffd47a', 1.6);
        A_.poly(c, [[x - 11, -155], [x + 11, -155], [x + 26, -112], [x - 26, -112]], 'rgba(255,212,122,.1)', 0);
      });
    },
  ];
  function front(i) { const k = THEMES[i]; return SC.bake('front' + i, FRONT_W, 270, 0, 262, c => FRONTS[i](c, k)); }

  function road(i) {
    const k = THEMES[i];
    return SC.bake('road' + i, 480, 100, 0, 0, c => {
      const A_ = A(), r = SC.scatter(11 + i);
      A_.poly(c, [[0, 0], [480, 0], [480, 16], [0, 16]], k.road, 0);
      A_.poly(c, [[0, 0], [480, 0], [480, 3], [0, 3]], k.edge, 0);
      A_.poly(c, [[0, 11], [480, 11], [480, 16], [0, 16]], A_.shade(k.road, 0.72), 0);
      c.beginPath(); for (let x = 0; x < 480; x += (i >= 3 ? 16 : 40)) { const w = (i >= 3 ? 0 : r() * 8); c.moveTo(x + w, 1); c.lineTo(x + w, 15); } c.lineWidth = i >= 3 ? 1.6 : 1.2; c.strokeStyle = A_.INK; c.stroke();
      A_.poly(c, [[0, 16], [480, 16], [480, 100], [0, 100]], k.band, 0);
      A_.line(c, -2, 0, 482, 0, 2.2); A_.line(c, -2, 16, 482, 16, 2);
      for (let x = 10; x < 480; x += 60) { A_.poly(c, [[x, 22], [x + 44, 22], [x + 44, 26], [x, 26]], A_.shade(k.band, 1.3), 0); }
    });
  }

  SC.drawScene = function (c, view, cam, t, theme) {
    const A_ = A(), g = T.groundY, L = view.left, R = view.right, B = view.bottom;
    const i = Math.max(0, Math.min(THEMES.length - 1, theme));
    const grad = c.createLinearGradient(0, view.top, 0, g);
    grad.addColorStop(0, '#16163f'); grad.addColorStop(0.55, '#2c2a72'); grad.addColorStop(1, '#4e3e96');
    c.fillStyle = grad; c.fillRect(L, view.top, R - L, B - view.top);
    // The crescent moon, as in the Lanternreach picture. Below the tips and the read-outs.
    A_.circle(c, 556, 92, 16, '#f5efe2', 0); A_.circle(c, 549, 87, 14.5, '#23225a', 0);
    SC.strip(c, far(), view, cam * 0.08 + t * 2, 56);
    SC.strip(c, skyline(i), view, cam * 0.35, g - 200);
    if (i === 4) { c.fillStyle = THEMES[4].dark; c.fillRect(L, view.top, R - L, g - 225 - view.top); A_.line(c, L, g - 226, R, g - 226, 3); }   // indoors: a ceiling, no sky
    SC.strip(c, front(i), view, cam, g - 262);
    SC.strip(c, road(i), view, cam, g);
    if (B > g + 100) { c.fillStyle = THEMES[i].band; c.fillRect(L, g + 100, R - L, B - g - 100); }
  };
})();
