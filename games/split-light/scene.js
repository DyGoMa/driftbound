// Split Light: the room behind the board. Inside the Glass Ward: a broken dome with the storm dusk coming through, rusted pipes, dead vats with Hollow shapes in them, and crystal taking over.
// Each set is a different part of the building, and the last is his wing. Made once per set and stamped. Drawing only. Never run.rng: the look must not change the play.
window.SL = window.SL || {};
(function () {
  const A = () => Kit.art;
  const ROOMS = [
    { sky: ['#141a38', '#3a2a5a', '#b8502d', '#f09a3a'], wall: '#1b2040', crystals: 3, vats: 3, pipe: '#7a4326', tint: null },                   // the Intake: dusk through broken glass
    { sky: ['#0f1a38', '#1f3a66', '#3a7a9a', '#8fd3f0'], wall: '#142238', crystals: 9, vats: 2, pipe: '#50483a', tint: 'rgba(120,200,240,.08)' },   // the Seed Beds: crystal has taken this room
    { sky: ['#1a1238', '#3a2060', '#a03a6a', '#ffb060'], wall: '#1e1a40', crystals: 6, vats: 4, pipe: '#6a3a50', tint: 'rgba(255,120,190,.05)' },   // the Split Ward: rainbows on everything
    { sky: ['#2a3040', '#4a5262', '#8a92a0', '#cfd5da'], wall: '#2a2f42', crystals: 1, vats: 5, pipe: '#5d6269', tint: null },                       // the Director's Wing: clean, white, wrong
    { sky: ['#080a18', '#1a1a34', '#4a2040', '#b0402a'], wall: '#12142a', crystals: 4, vats: 6, pipe: '#3a3f55', tint: 'rgba(255,255,255,.03)' },    // his office
  ];
  const scatter = seed => { let a = seed >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };

  function crystalCluster(c, rnd, x, y, h, flip) {
    const a = A(), n = 2 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const w = h * (0.14 + rnd() * 0.1), hh = h * (0.5 + rnd() * 0.5), lean = (rnd() - 0.5) * 0.7 + (flip ? -0.25 : 0.25), bx = x + (i - n / 2) * w * 1.1;
      c.save(); c.translate(bx, y); c.rotate(lean);
      a.poly(c, [[-w, 0], [-w * 0.8, -hh * 0.8], [0, -hh], [w * 0.8, -hh * 0.8], [w, 0]], '#7fc0e6', 2);
      a.poly(c, [[0, 0], [0, -hh], [w * 0.8, -hh * 0.8], [w, 0]], '#4a86b4', 0);
      a.poly(c, [[-w * 0.6, -hh * 0.2], [-w * 0.5, -hh * 0.72], [-w * 0.15, -hh * 0.85], [-w * 0.2, -hh * 0.3]], '#d9f4ff', 0);
      a.poly(c, [[-w, 0], [-w * 0.8, -hh * 0.8], [0, -hh], [w * 0.8, -hh * 0.8], [w, 0]], null, 2);
      c.restore();
    }
  }
  function vat(c, rnd, x, y, h, wall) {
    const a = A(), w = h * 0.42, broken = rnd() < 0.5;
    a.poly(c, [[x - w, y], [x + w, y], [x + w, y - h], [x - w, y - h]], 'rgba(140,210,220,.16)', 0);
    // A shape in the glass: a stripped beast's head and shoulders, plated brow, one blank eye, a dead white core. Nobody's partner any more.
    const body = A().shade(wall, 1.5);
    a.poly(c, [[x - w * 0.7, y], [x - w * 0.62, y - h * 0.42], [x - w * 0.2, y - h * 0.56], [x + w * 0.2, y - h * 0.56], [x + w * 0.62, y - h * 0.42], [x + w * 0.7, y]], body, 1.6);
    a.poly(c, [[x - w * 0.42, y - h * 0.5], [x - w * 0.3, y - h * 0.8], [x + w * 0.36, y - h * 0.8], [x + w * 0.5, y - h * 0.58], [x + w * 0.32, y - h * 0.46], [x - w * 0.24, y - h * 0.46]], body, 1.6);
    a.poly(c, [[x - w * 0.34, y - h * 0.72], [x - w * 0.22, y - h * 0.86], [x + w * 0.4, y - h * 0.86], [x + w * 0.44, y - h * 0.72]], '#7b828e', 1.4);
    a.circle(c, x + w * 0.16, y - h * 0.65, h * 0.028, '#f0f4f8', 0.8);
    a.circle(c, x, y - h * 0.26, h * 0.05, '#dfe6ee', 1);
    a.line(c, x - h * 0.05, y - h * 0.26, x - w * 0.6, y - h * 0.36, 1.2, A().INK); a.line(c, x + h * 0.05, y - h * 0.26, x + w * 0.6, y - h * 0.36, 1.2, A().INK);
    a.poly(c, [[x - w - 3, y - h - 8], [x + w + 3, y - h - 8], [x + w + 3, y - h], [x - w - 3, y - h]], '#3a3f55', 1.8);
    a.poly(c, [[x - w - 3, y], [x + w + 3, y], [x + w + 3, y + 10], [x - w - 3, y + 10]], '#3a3f55', 1.8);
    if (broken) {
      a.poly(c, [[x - w, y - h * 0.55], [x - w * 0.3, y - h * 0.8], [x + w * 0.2, y - h * 0.55], [x + w * 0.7, y - h * 0.7], [x + w, y - h * 0.5], [x + w, y - h], [x - w, y - h]], wall, 0);
      a.line(c, x - w, y - h * 0.55, x - w * 0.3, y - h * 0.8, 1.2, '#b9e6f0'); a.line(c, x - w * 0.3, y - h * 0.8, x + w * 0.2, y - h * 0.55, 1.2, '#b9e6f0'); a.line(c, x + w * 0.2, y - h * 0.55, x + w, y - h * 0.5, 1.2, '#b9e6f0');
    } else a.line(c, x - w * 0.6, y - h * 0.9, x - w * 0.6, y - h * 0.2, 2, 'rgba(255,255,255,.3)');
    a.line(c, x - w, y, x - w, y - h, 2, A().INK); a.line(c, x + w, y, x + w, y - h, 2, A().INK);
  }

  function paintRoom(c, W, H, room, set) {
    const a = A(), rnd = scatter(1234 + set * 77);
    const g = c.createLinearGradient(0, 0, 0, H * 0.55);
    room.sky.forEach((s, i) => g.addColorStop(i / 3, s));
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // The dome's ribs, with panes missing so the sky shows. The rest of the glass is dark.
    const cx = W / 2, cy = H * 0.62, R = Math.max(W, H) * 0.72;
    for (let i = 0; i < 90; i++) {
      const a0 = -Math.PI + i * Math.PI / 12, ring = 0.34 + (i % 6) * 0.13;
      if (rnd() < 0.34) continue;
      const a1 = a0 + Math.PI / 12, r0 = R * ring, r1 = r0 + R * 0.13;
      a.poly(c, [[cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0], [cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0], [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1], [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1]], a.shade(room.wall, 0.75 + rnd() * 0.4), 0);
    }
    for (let i = 0; i <= 12; i++) { const an = -Math.PI + i * Math.PI / 12; a.line(c, cx + Math.cos(an) * R * 0.3, cy + Math.sin(an) * R * 0.3, cx + Math.cos(an) * R * 1.2, cy + Math.sin(an) * R * 1.2, 4, a.INK); }
    for (let j = 0; j < 7; j++) { c.beginPath(); c.arc(cx, cy, R * (0.34 + j * 0.13), -Math.PI, 0); c.lineWidth = 3; c.strokeStyle = a.INK; c.stroke(); }
    // A rainbow through a missing pane: what Prism's kind of light does in here.
    const bow = ['rgba(255,110,160,.22)', 'rgba(255,220,100,.2)', 'rgba(120,240,160,.18)', 'rgba(120,200,255,.22)'];
    bow.forEach((col, i) => { const off = i * 13; a.poly(c, [[W * 0.86 + off, 0], [W * 0.86 + off + 13, 0], [W * 0.1 + off + 13, H * 0.72], [W * 0.1 + off, H * 0.72]], col, 0); });
    // The floor and back wall.
    const fy = H * 0.66;
    a.poly(c, [[0, fy], [W, fy], [W, H], [0, H]], room.wall, 0);
    a.poly(c, [[0, fy], [W, fy], [W, fy + 8], [0, fy + 8]], a.shade(room.wall, 1.5), 0);
    for (let i = 0; i < W; i += 64) a.line(c, i, fy + 8, i - 40, H, 1.5, a.shade(room.wall, 0.7));
    for (let i = 0; i < 6; i++) a.line(c, 0, fy + 26 + i * i * 12, W, fy + 26 + i * i * 12, 1.5, a.shade(room.wall, 0.7));
    // Pipes along the walls.
    [H * 0.46, H * 0.5].forEach((y, i) => { a.line(c, 0, y, W, y + (i ? 6 : -4), 11, a.INK); a.line(c, 0, y, W, y + (i ? 6 : -4), 7, room.pipe); a.line(c, 0, y - 2, W, y + (i ? 4 : -6), 1.5, a.shade(room.pipe, 1.5)); });
    // Dead vats along the back.
    // Spaced so none hides square behind a small board, and a phone's narrow view still catches one at each side.
    [0.385, 0.615, 0.25, 0.75, 0.12, 0.88].slice(0, room.vats).forEach(u => vat(c, rnd, W * u, fy + 4, 104 + rnd() * 30, room.wall));
    // Crystal taking the room.
    for (let i = 0; i < room.crystals; i++) { const left = i % 2 === 0, x = left ? W * (0.02 + rnd() * 0.3) : W * (0.68 + rnd() * 0.3); crystalCluster(c, rnd, x, fy + 12 + rnd() * 40, 90 + rnd() * 90, !left); }
    crystalCluster(c, rnd, W * 0.03, H * 0.98, 150 + room.crystals * 10, false);
    crystalCluster(c, rnd, W * 0.97, H * 0.98, 150 + room.crystals * 10, true);
    if (room.tint) { c.fillStyle = room.tint; c.fillRect(0, 0, W, H); }
    // The bottom falls to dark so the buttons stand out.
    const dark = c.createLinearGradient(0, H * 0.62, 0, H);
    dark.addColorStop(0, 'rgba(12,16,38,0)'); dark.addColorStop(0.5, 'rgba(12,16,38,.72)'); dark.addColorStop(1, 'rgba(12,16,38,.94)');
    c.fillStyle = dark; c.fillRect(0, H * 0.62, W, H * 0.38);
  }

  const ROOM_W = 1040, ROOM_H = 760;
  SL.drawRoom = function (c, view, set) {
    const vw0 = view.right - view.left, vh0 = view.bottom - view.top;
    if (A().draw(c, 'room_' + set, 0, (view.left + view.right) / 2, view.bottom, Math.max(vw0, vh0))) return;   // a square painting, feet at the bottom of the screen
    const room = ROOMS[Math.min(set, ROOMS.length - 1)], b = SL.bake('room' + set, ROOM_W, ROOM_H, 0, 0, cc => paintRoom(cc, ROOM_W, ROOM_H, room, set));
    // Cover the whole screen, whatever its shape, with the middle of the room behind the board.
    const vw = view.right - view.left, vh = view.bottom - view.top, s = Math.max(vw / ROOM_W, vh / ROOM_H), dw = ROOM_W * s, dh = ROOM_H * s;
    c.drawImage(b.cv, view.left + (vw - dw) / 2, view.top + (vh - dh) / 2, dw, dh);
  };

  // The title: the same room, with Prism up in the light. The kit puts the Glass Ward picture over this when it loads.
  SL.titleDraw = function (c, view, t) {
    SL.drawRoom(c, view, 2);
    c.save();
    SL.drawPrism(c, view.right - 62, view.top + 62, 'L', 0, t);
    c.restore();
  };
})();
