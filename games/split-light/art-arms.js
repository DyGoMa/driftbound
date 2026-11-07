// Split Light: the two arm strips under the portraits, which show the story's state. Ione's left forearm with the bond cost on it, per ione-sheet-v11. Vasch's glass arm with the core in it, per vasch-sheet-v4. Drawing only.
window.SL = window.SL || {};
(function () {
  const A = () => Kit.art;

  // A crystal growing out of the skin: inked, with one lit face. hot = just came up.
  function shard(c, x, y, ang, len, wid, hot) {
    const a = A(), cs = Math.cos(ang), sn = Math.sin(ang), nx = -sn * wid, ny = cs * wid, mx = x + cs * len * 0.45, my = y + sn * len * 0.45, tx = x + cs * len, ty = y + sn * len;
    a.poly(c, [[x + nx * 0.6, y + ny * 0.6], [mx + nx, my + ny], [tx, ty], [mx - nx, my - ny], [x - nx * 0.6, y - ny * 0.6]], hot ? '#d7f4ff' : '#74c4e6', 1.1);
    a.poly(c, [[x, y], [mx, my], [tx, ty], [mx - nx, my - ny], [x - nx * 0.6, y - ny * 0.6]], hot ? '#ffffff' : '#c6edfb', 0);
  }
  SL.shard = shard;

  // Crystals don't grow alike: lengths and lean, repeating so a shard keeps its look as the count grows.
  const LONG = [1, 0.62, 0.84, 0.5, 0.95, 0.7, 0.56];
  const SPLAY = [0.1, -0.2, 0.26, -0.08, 0.18, -0.26, 0.04];

  // A growth on the arm: rooted in the skin, wide at the root, with a dark split in the skin round it, so it reads as coming out of her and not lying near her.
  function growth(c, x, y, ang, len, wid, hot) {
    const a = A(), cs = Math.cos(ang), sn = Math.sin(ang), nx = -sn * wid, ny = cs * wid, rx = x - cs * 2.6, ry = y - sn * 2.6;
    a.line(c, rx + nx * 1.3, ry + ny * 1.3, rx - nx * 1.3, ry - ny * 1.3, 1.5, '#9c4f43');
    const mx = x + cs * len * 0.5, my = y + sn * len * 0.5, tx = x + cs * len, ty = y + sn * len;
    a.poly(c, [[rx + nx, ry + ny], [mx + nx * 1.05, my + ny * 1.05], [tx, ty], [mx - nx * 1.05, my - ny * 1.05], [rx - nx, ry - ny]], hot ? '#d7f4ff' : '#74c4e6', 1.15);
    a.poly(c, [[rx, ry], [mx, my], [tx, ty], [mx - nx * 1.05, my - ny * 1.05], [rx - nx, ry - ny]], hot ? '#ffffff' : '#c6edfb', 0);
  }

  // Ione's left forearm, across the strip: her open hand at the left, the sleeve rolled to the elbow at the right. The arm tapers and bows like an arm. The hexagon sits on the wrist with jagged cracks running out of it, per ione-sheet-v11; small growths on the wrist always, more up the arm for every shot.
  SL.armStrip = function (c, x, y, w, h, st, flare, t) {
    const a = A(), skin = '#f6d3bf', dark = '#dcae98', ink = a.INK, mid = y + h / 2 + 1, sleeve = x + w - 24, wrist = x + 29;
    c.save();
    c.beginPath(); c.moveTo(x + 2, y); c.lineTo(x + w, y); c.lineTo(x + w - 7, y + h); c.lineTo(x - 2, y + h); c.closePath(); c.clip();
    c.fillStyle = '#10152f'; c.fillRect(x - 4, y, w + 8, h);
    // How far along the arm a point is, 0 at the wrist and 1 at the elbow; the arm's middle there; how far its edge is from that middle.
    const along = u => Math.max(0, Math.min(1, (u - wrist) / (sleeve - wrist)));
    const line = u => mid - Math.sin(along(u) * Math.PI) * 1.8 - along(u) * 1.5;
    const half = u => 4.8 + Math.sin(Math.pow(along(u), 0.8) * Math.PI * 0.72) * 3.6;
    const edge = (u, side) => line(u) + side * half(u);
    // the fingers, curled a little and apart, each a tapered stroke with its own ink, and the thumb under them
    const fingers = [[-5.2, -7.4, 0], [-1.8, -3.2, -2], [1.6, 0.8, -2.4], [4.8, 5, -0.6]];
    fingers.forEach(f => {
      const bx = x + 15, by = mid + f[0], ex = x + 4 + f[2] + 2, ey = mid + f[1];
      a.line(c, bx, by, ex, ey, 4.6, ink); a.line(c, bx, by, ex, ey, 2.7, skin);
    });
    a.line(c, x + 22, mid + 4.5, x + 13, mid + 11, 5.2, ink); a.line(c, x + 22, mid + 4.5, x + 13, mid + 11, 3.2, skin);
    // the back of the hand and the forearm, inked as one soft shape, with one shadow tone along the lower edge
    const top = [], low = [];
    for (let i = 0; i <= 8; i++) { const u = wrist + (sleeve + 2 - wrist) * i / 8; top.push([u, edge(u, -1)]); low.unshift([u, edge(u, 1)]); }
    const armPts = [[x + 14, mid - 6.6], [x + 21, mid - 7.2]].concat(top, low, [[x + 21, mid + 7], [x + 14, mid + 6.4]]);
    a.blob(c, armPts, skin, 1.5);
    const shadeTop = low.map(p => [p[0], p[1] - 3]).reverse();
    a.poly(c, shadeTop.concat(low), dark, 0);
    // skin over the ink where each finger and the thumb join the hand, so they grow out of it
    fingers.forEach(f => a.line(c, x + 12.5, mid + f[0] * 0.98, x + 17, mid + f[0] * 0.9, 2.7, skin));
    a.line(c, x + 20, mid + 5.8, x + 18.5, mid + 3.6, 3, skin);
    [-4.4, -1.1, 2.2].forEach(o => a.line(c, x + 16.5, mid + o, x + 20, mid + o * 0.9, 0.8, dark));
    // the rolled sleeve: a square cuff with its fold, then the coat going out of the strip
    a.poly(c, [[sleeve + 8, mid - 14], [x + w + 8, mid - 17], [x + w + 8, mid + 17], [sleeve + 8, mid + 14]], '#d9dce1', 1.6);
    a.poly(c, [[sleeve, mid - 12.5], [sleeve + 11, mid - 14.5], [sleeve + 11, mid + 14.5], [sleeve, mid + 12.5]], '#f3f4f2', 1.7);
    a.line(c, sleeve + 5, mid - 11.5, sleeve + 5, mid + 11.5, 0.9, '#b9bec7');
    // the cracked hexagon on the wrist, and the jagged cracks running out of it across the skin
    const hx = wrist - 3, on = flare ? 1 : 0.75 + Math.sin(t * 3) * 0.2;
    c.globalAlpha = on;
    c.lineWidth = 1.7; c.strokeStyle = '#3fb6ec'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(hx + 1, mid - 5); c.lineTo(hx + 4.6, mid - 2.5); c.lineTo(hx + 4.6, mid + 2.5); c.lineTo(hx, mid + 5); c.lineTo(hx - 4.6, mid + 2.5); c.lineTo(hx - 4.6, mid - 2.5); c.lineTo(hx - 2, mid - 4.2); c.stroke();
    c.lineWidth = 1.1;
    c.beginPath(); c.moveTo(hx - 0.5, mid - 5); c.lineTo(hx + 1, mid - 1.6); c.lineTo(hx - 1.3, mid); c.lineTo(hx + 0.5, mid + 2.4); c.stroke();
    const slots = 2 + st.old + st.fresh, reach = hx + 7 + along(hx + 12 + Math.min(slots, 12) * 4.6) * (sleeve - hx - 10);
    c.beginPath(); c.moveTo(hx + 4.6, mid - 1); let jag = 0;
    for (let u = hx + 8; u < reach; u += 4.4) { jag = jag > 0 ? -1.9 : 1.9; c.lineTo(u, line(u) + jag); }
    c.stroke();
    c.globalAlpha = 1;
    // base growths at the wrist, then the old shards from this run, then this board's fresh ones. Alternating edges, thick near the wrist, leaning away from the hand.
    const from = hx + 5, room = sleeve - 4 - from;
    for (let i = 0; i < slots; i++) {
      const u = from + (i + 0.3) / Math.max(slots, 6) * room, side = i % 2 ? 1 : -1, fresh = i >= 2 + st.old, k = i % LONG.length;
      const ang = side * (Math.PI / 2 - 0.62) + SPLAY[k];
      growth(c, u, edge(u, side) - side * 0.9, ang, (fresh ? 12 : 9.5) * LONG[k] + 2, fresh ? 2.8 : 2.2, fresh);
    }
    c.restore();
  };

  // Vasch's right forearm, across the strip: bare metal fingers at the left, then the wrist ring, the see-through glass tube with the white core, the elbow ring and the rolled sleeve. The glass cracks as the core in the last board takes hits.
  SL.vaschArm = function (c, x, y, w, h, b) {
    const a = A(), mid = y + h / 2, steel = '#7b828e', dark = '#4d525c', x0 = x + 30, x1 = x + w - 26;
    c.save();
    c.beginPath(); c.moveTo(x + 2, y); c.lineTo(x + w, y); c.lineTo(x + w - 7, y + h); c.lineTo(x - 2, y + h); c.closePath(); c.clip();
    c.fillStyle = '#10152f'; c.fillRect(x - 4, y, w + 8, h);
    // the metal hand: a plated back of the hand, jointed fingers, and a thumb
    a.poly(c, [[x + 19, mid + 4], [x + 13, mid + 8], [x + 9, mid + 10], [x + 7, mid + 8], [x + 12, mid + 3]], dark, 1.4);
    [-5.4, -1.8, 1.8].forEach(o => {
      a.poly(c, [[x + 15, mid + o - 1.7], [x + 9, mid + o - 1.5], [x + 8, mid + o + 1.6], [x + 15, mid + o + 1.7]], steel, 1.3);
      a.poly(c, [[x + 9, mid + o - 1.4], [x + 3, mid + o - 0.9], [x + 2, mid + o + 1.2], [x + 8, mid + o + 1.5]], dark, 1.3);
    });
    a.poly(c, [[x + 24, mid - 8], [x + 15, mid - 7.5], [x + 13, mid - 3], [x + 13, mid + 3.5], [x + 16, mid + 6.5], [x + 24, mid + 8]], steel, 1.6);
    a.line(c, x + 16, mid - 4, x + 22, mid - 2, 0.9, dark); a.line(c, x + 16, mid + 3, x + 22, mid + 1, 0.9, dark);
    // the glass tube: see-through, so the dark shows through it, with a lit edge along the top
    const tube = [[x0, mid - 8.5], [x1, mid - 10.5], [x1, mid + 10.5], [x0, mid + 8.5]];
    a.poly(c, tube, 'rgba(190,222,236,.2)', 0);
    const cx = (x0 + x1) / 2, glow = b.chamber;
    if (glow > 0) { a.ellipse(c, cx, mid, 13 * glow + 2, 6.5 * glow + 2, 'rgba(255,255,255,.28)', 0); a.ellipse(c, cx, mid, 9 * glow + 1, 3.8 * glow + 1, '#ffffff', 0); }
    a.line(c, x0 + 2, mid - 6, x1 - 2, mid - 7.6, 1.3, 'rgba(255,255,255,.65)');
    a.line(c, x0 + 3, mid + 6, x1 - 2, mid + 7.6, 1, 'rgba(120,160,185,.7)');
    a.poly(c, tube, null, 1.8);
    // the cracks: jagged and branching, one more for each hit
    const cracks = glow >= 1 ? 0 : glow > 0.5 ? 1 : glow > 0 ? 2 : 3;
    const jag = pts => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(cx + p[0], mid + p[1]) : c.moveTo(cx + p[0], mid + p[1]))); c.lineWidth = 1.3; c.strokeStyle = '#10121f'; c.lineJoin = 'miter'; c.stroke(); };
    if (cracks > 0) { jag([[-15, -8], [-11, -3], [-14, 0], [-8, 5], [-9, 9]]); jag([[-11, -3], [-6, -4], [-4, -8]]); }
    if (cracks > 1) { jag([[14, -9], [10, -4], [13, -1], [6, 3], [8, 9]]); jag([[6, 3], [1, 2], [-2, 6]]); }
    if (cracks > 2) { jag([[-4, -8], [-1, -3], [3, -5], [5, 1], [1, 2]]); jag([[-1, -3], [-6, 1], [-4, 4]]); }
    // the steel rings at each end of the glass
    [[x0 - 5, 12], [x1 - 1, 13]].forEach(r => {
      a.poly(c, [[r[0], mid - r[1]], [r[0] + 6, mid - r[1]], [r[0] + 6, mid + r[1]], [r[0], mid + r[1]]], steel, 1.7);
      a.line(c, r[0] + 3, mid - r[1] + 2, r[0] + 3, mid + r[1] - 2, 1, dark);
    });
    // the rolled white sleeve
    a.blob(c, [[x1 + 6, mid - 14], [x1 + 13, mid - 16], [x + w + 8, mid - 17], [x + w + 8, mid + 17], [x1 + 13, mid + 16], [x1 + 6, mid + 14], [x1 + 4, mid + 6], [x1 + 4, mid - 6]], '#eef0f2', 1.7);
    a.line(c, x1 + 11, mid - 10, x1 + 13, mid + 10, 0.9, '#b9bec7');
    c.restore();
  };
})();
