// Split Light: the pieces on the board, in ink and flat colour. A crystal's lean has to read at a glance, so every shard runs corner to corner of its cell. Drawing only.
window.SL = window.SL || {};
(function () {
  const A = () => Kit.art, T = TUNE;
  const baked = new Map(), SCALE = 2;

  SL.bake = function (key, w, h, ox, oy, paint) {
    let b = baked.get(key);
    if (!b) {
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(w * SCALE); cv.height = Math.ceil(h * SCALE);
      const c = cv.getContext('2d');
      c.scale(SCALE, SCALE); c.translate(ox, oy);
      paint(c);
      b = { cv, w, h, ox, oy };
      baked.set(key, b);
    }
    return b;
  };
  SL.stamp = function (c, b, x, y, rot, scale) {
    if (!rot && (!scale || scale === 1)) { c.drawImage(b.cv, x - b.ox, y - b.oy, b.w, b.h); return; }
    c.save(); c.translate(x, y);
    if (rot) c.rotate(rot);
    if (scale) c.scale(scale, scale);
    c.drawImage(b.cv, -b.ox, -b.oy, b.w, b.h);
    c.restore();
  };
  const cellBake = (key, paint) => SL.bake(key, 70, 70, 35, 35, paint);

  // ---- Turnable crystal: a thick faceted shard, on a brass pivot so it reads as something you can turn.
  function paintPivot(c) {
    const a = A();
    a.circle(c, 0, 0, 20, '#141a38', 2);
    a.circle(c, 0, 0, 16.5, null, 1.6, '#b98d3a');
    [[0, -20], [20, 0], [0, 20], [-20, 0]].forEach(p => a.circle(c, p[0], p[1], 2.1, '#d9a93a', 1.2));
  }
  function paintCrystal(c, col, light, dark, ink) {
    const a = A();
    const out = [[-23, 23], [-8.5, 21], [21, -8.5], [23, -23], [8.5, -21], [-21, 8.5]];
    a.poly(c, out, col, 0);
    a.poly(c, [[-23, 23], [23, -23], [8.5, -21], [-21, 8.5]], light, 0);
    a.poly(c, [[-23, 23], [23, -23], [21, -8.5], [-8.5, 21]], dark, 0);
    a.poly(c, [[-13, 13], [-1, 6], [6, -1], [13, -13], [1, -6], [-6, 1]], col, 0);
    a.line(c, -23, 23, 23, -23, 1.3, 'rgba(255,255,255,.75)');
    a.poly(c, out, null, ink || 2.4);
    a.poly(c, [[8, -19], [15, -17], [17, -13], [11, -15]], '#ffffff', 0);
  }
  // ---- Clamped crystal: darker, on a square steel base, with brass brackets at both tips.
  function paintClamped(c) {
    const a = A();
    a.poly(c, [[-22, -22], [22, -22], [22, 22], [-22, 22]], '#2a3050', 2);
    [[-18, -18], [18, 18]].forEach(p => a.circle(c, p[0], p[1], 2.2, '#8d919e', 1));
    paintCrystal(c, '#6f93b3', '#9fbcd2', '#486a8c');
    [[-16, 16], [16, -16]].forEach(p => {
      c.save(); c.translate(p[0], p[1]); c.rotate(Math.PI / 4);
      a.poly(c, [[-13, -5], [13, -5], [13, 5], [-13, 5]], '#d9a93a', 2);
      a.poly(c, [[-13, 1], [13, 1], [13, 5], [-13, 5]], '#a87f2a', 0);
      a.poly(c, [[-13, -5], [13, -5], [13, 5], [-13, 5]], null, 2);
      a.circle(c, -8, 0, 1.6, '#10121f', 0); a.circle(c, 8, 0, 1.6, '#10121f', 0);
      c.restore();
    });
  }
  // ---- Splitter: a shard of Prism's own wing, a thin leaf with a rainbow rim. It is see-through because half the light goes straight on.
  function paintSplitter(c) {
    const a = A();
    const leaf = (r) => { c.beginPath(); c.moveTo(-24 * r, 24 * r); c.quadraticCurveTo(4 * r, 8 * r, 24 * r, -24 * r); c.quadraticCurveTo(-8 * r, -4 * r, -24 * r, 24 * r); c.closePath(); };
    leaf(1); c.fillStyle = 'rgba(214,240,255,.72)'; c.fill();
    [['#ff7fb5', 3.6, 1], ['#ffe06a', 2.4, 0.9], ['#7fe8a0', 1.8, 0.8]].forEach(s => { leaf(s[2]); c.lineWidth = s[1]; c.strokeStyle = s[0]; c.stroke(); });
    a.line(c, -20, 20, 20, -20, 1.1, '#ffffff');
    a.line(c, -6, 6, -1, -6, 0.9, '#7fa3cf'); a.line(c, 4, -4, 11, 1, 0.9, '#7fa3cf');
    leaf(1); c.lineWidth = 2.2; c.strokeStyle = a.INK; c.lineJoin = 'round'; c.stroke();
  }
  // ---- Growth: no pivot, jagged, sore: raw blue shards round a hot pink root. Always "/". This is the bond cost, on the floor.
  function paintGrowth(c) {
    const a = A(), R = Math.SQRT1_2;
    const at = (u, v) => [(u + v) * R, (-u + v) * R];
    const out = [[-35, 0], [-24, 7], [-21, 15], [-13, 8], [-4, 11], [0, 20], [6, 10], [16, 9], [22, 16], [25, 6], [35, 0], [25, -6], [21, -15], [14, -8], [4, -11], [-1, -20], [-6, -10], [-16, -9], [-22, -16], [-25, -6]].map(p => at(p[0], p[1]));
    a.poly(c, out, '#a9e2f7', 0);
    a.poly(c, [[-35, 0], [-24, 7], [-21, 15], [-13, 8], [-4, 11], [0, 20], [6, 10], [16, 9], [22, 16], [25, 6], [35, 0]].map(p => at(p[0], p[1])), '#5fa9d6', 0);
    a.poly(c, [[-25, -6], [-22, -16], [-16, -9], [-10, -3], [-22, -3]].map(p => at(p[0], p[1])), '#e8faff', 0);
    a.poly(c, [[-1, -20], [4, -11], [12, -4], [-6, -4], [-6, -10]].map(p => at(p[0], p[1])), '#e8faff', 0);
    a.poly(c, [[21, -15], [25, -6], [31, -2], [16, -3], [14, -8]].map(p => at(p[0], p[1])), '#e8faff', 0);
    a.line(c, ...at(-33, 0), ...at(33, 0), 1.5, '#ffffff');
    a.poly(c, out, null, 2.5);
    a.poly(c, [[-11, 0], [-5, -6], [6, -6], [12, 0], [5, 7], [-6, 6]].map(p => at(p[0], p[1])), '#ff7fb8', 1.6);    // the sore root
    a.poly(c, [[-5, -3], [1, -4], [4, 0], [-1, 1]].map(p => at(p[0], p[1])), '#ffc2dd', 0);
  }
  // ---- Plate: a riveted Sever slab: the bar cutting the ring (CAST.md).
  function paintPlate(c) {
    const a = A();
    a.slab(c, -26, -26, 52, 52, '#6b7178', 2.4);
    a.poly(c, [[-26, -26], [26, -26], [20, -20], [-20, -20]], '#8d939b', 0);
    a.poly(c, [[-26, -26], [26, -26], [26, 26], [-26, 26]], null, 2.4);
    a.circle(c, 0, 0, 10, null, 3.4, '#14161f');
    a.poly(c, [[-16, -3], [16, -3], [16, 3], [-16, 3]], '#14161f', 0);
    [[-20, -20], [20, -20], [-20, 20], [20, 20]].forEach(p => a.circle(c, p[0], p[1], 2, '#b8bcc4', 1));
  }

  const bakeFor = {
    pivot: () => cellBake('pivot', paintPivot),
    crystal: () => cellBake('crystal', c => paintCrystal(c, '#a9e2f7', '#dcf5ff', '#62aed8')),
    clamped: () => cellBake('clamped', paintClamped),
    splitter: () => cellBake('splitter', paintSplitter),
    growth: () => cellBake('growth', paintGrowth),
    plate: () => cellBake('plate', paintPlate),
  };
  const turnAngle = (lean, turnT, secs) => {
    const end = lean ? Math.PI / 2 : 0;
    if (turnT > 0) return end - (lean ? 1 : -1) * (turnT / secs) * Math.PI / 2;
    if (turnT < 0) return end + Math.sin(turnT * 90) * 0.1;   // a refusal: it shakes and stays
    return end;
  };
  // kind: 'c' crystal, 'f' clamped, 's' splitter, 'p' plate, 'g' growth
  SL.drawPiece = function (c, kind, x, y, lean, turnT, growU) {
    if (kind === 'p') { SL.stamp(c, bakeFor.plate(), x, y); return; }
    if (kind === 'g') {
      const s = growU === undefined ? 1 : Math.min(1, 0.2 + growU * 1.1);
      SL.stamp(c, bakeFor.growth(), x, y, turnT ? Math.sin(turnT * 90) * 0.08 : 0, s);
      return;
    }
    if (kind === 'c' || kind === 's') SL.stamp(c, bakeFor.pivot(), x, y);
    const rot = turnAngle(lean, turnT || 0, T.turnSecs);
    SL.stamp(c, kind === 'f' ? bakeFor.clamped() : kind === 's' ? bakeFor.splitter() : bakeFor.crystal(), x, y, rot);
  };

  // ---- Prism's empty perch: a brass ring that says which way she'd fire from it. Tap to move her there.
  SL.drawPerch = function (c, x, y, dx, dy, t, ready) {
    const a = A();
    c.save(); c.translate(x, y); c.rotate(Math.atan2(dy, dx) + Math.PI / 2);
    a.circle(c, 0, 0, 21, '#2a2448', 2.2);
    a.circle(c, 0, 0, 17, null, 2.4, '#d9a93a');
    a.poly(c, [[0, -14], [8, -3], [3, -3], [3, 7], [-3, 7], [-3, -3], [-8, -3]], '#f4c152', 1.6);
    if (ready) { c.globalAlpha = 0.4 + Math.sin(t * 4) * 0.25; a.circle(c, 0, 0, 24, null, 2, '#f4c152'); c.globalAlpha = 1; }
    c.restore();
  };

  // ---- The board's frame and floor, made once for each size.
  SL.boardBake = function (cols, rows) {
    const W = cols * T.cell, H = rows * T.cell;
    return SL.bake('board' + cols + 'x' + rows + '@' + T.cell, W + 24, H + 24, 12, 12, c => {
      const a = A();
      a.poly(c, [[-9, -9], [W + 9, -9], [W + 9, H + 9], [-9, H + 9]], '#3a3f55', 2.6);
      a.poly(c, [[-9, H + 3], [W + 9, H + 3], [W + 9, H + 9], [-9, H + 9]], '#262a3f', 0);
      a.poly(c, [[-9, -9], [W + 9, -9], [W + 9, H + 9], [-9, H + 9]], null, 2.6);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const X = x * T.cell, Y = y * T.cell;
        a.poly(c, [[X, Y], [X + T.cell, Y], [X + T.cell, Y + T.cell], [X, Y + T.cell]], (x + y) % 2 ? '#1a2147' : '#20285a', 0);
        a.poly(c, [[X + 5, Y + T.cell - 5], [X + T.cell * 0.48, Y + 5], [X + T.cell * 0.66, Y + 5], [X + 19, Y + T.cell - 5]], 'rgba(255,255,255,.028)', 0);
        c.strokeStyle = 'rgba(8,10,28,.85)'; c.lineWidth = 1.2; c.strokeRect(X, Y, T.cell, T.cell);
      }
      a.poly(c, [[0, 0], [W, 0], [W, H], [0, H]], null, 2.4);
      for (let i = 0; i <= cols; i += 2) { a.circle(c, i * T.cell, -5, 1.7, '#b8bcc4', 0.8); a.circle(c, i * T.cell, H + 5, 1.7, '#b8bcc4', 0.8); }
      for (let i = 1; i < rows; i += 2) { a.circle(c, -5, i * T.cell, 1.7, '#b8bcc4', 0.8); a.circle(c, W + 5, i * T.cell, 1.7, '#b8bcc4', 0.8); }
    });
  };
})();
