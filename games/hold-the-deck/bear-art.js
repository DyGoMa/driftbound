// Hold the Deck: Hekka's Hollow bear in code, per hollow-bear-sheet-v2.png's front view: ash-grey fur, blank white eyes, plates on the brow and shoulders, an iron collar with a short chain end,
// cables from the shoulder plates to a white core in a steel ring on the chest. Drawn bold, once per pose, and stamped.
window.HD = window.HD || {};
(function () {
  const A = () => Kit.art;
  const FUR = '#a59796', FUR_D = '#7d7170', FUR_L = '#bdb0ae', PLATE = '#47464e', PLATE_L = '#62616a', CLAW = '#2b2931', RIVET = '#85848d', INK = '#10121f';

  // A shape with a torn, furry edge.
  function fur(c, pts, fill, lw, amp = 3, step = 8) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1, n = Math.max(1, Math.round(len / step));
      for (let j = 0; j < n; j++) {
        const u = j / n, m = (j + 0.5) / n, s = j % 2 ? 0.5 : 1;
        out.push([p[0] + dx * u, p[1] + dy * u]);
        out.push([p[0] + dx * m + (dy / len) * amp * s * 0.8, p[1] + dy * m - (dx / len) * amp * s * 0.8 + 1.6]);
      }
    }
    A().poly(c, out, fill, lw);
  }
  function paw(c, x, y, s, claws = true, up = false) {
    const A_ = A(), d = up ? -1 : 1;
    fur(c, [[x - 15 * s, y - 16 * s * d], [x + 15 * s, y - 16 * s * d], [x + 18 * s, y - 2 * s * d], [x - 18 * s, y - 2 * s * d]], FUR, 1.6, 2, 7);
    if (claws) for (const k of [-1.5, -0.5, 0.5, 1.5]) {
      const cx = x + k * 8.5 * s;
      A_.poly(c, [[cx - 3.4 * s, y - 4 * s * d], [cx + 3.4 * s, y - 4 * s * d], [cx + 1.5 * s, y + 7 * s * d], [cx, y + 10 * s * d], [cx - 1.5 * s, y + 7 * s * d]], CLAW, 1.2);
      A_.line(c, cx - 1 * s, y - 2 * s * d, cx - 0.4 * s, y + 5 * s * d, 0.8, '#6c6a74');
    }
  }
  function plateHex(c, x, y, w, h) {
    const A_ = A(), pts = [[x - w * 0.7, y - h], [x + w * 0.7, y - h], [x + w, y - h * 0.3], [x + w * 0.8, y + h], [x - w * 0.8, y + h], [x - w, y - h * 0.3]];
    A_.poly(c, pts, PLATE, 1.8);
    A_.poly(c, [[x - w * 0.7, y - h], [x + w * 0.7, y - h], [x + w, y - h * 0.3], [x - w, y - h * 0.3]], PLATE_L, 0);
    A_.poly(c, pts, null, 1.8);
    for (const q of [[-0.55, -0.6], [0.55, -0.6], [-0.55, 0.6], [0.55, 0.6]]) A_.circle(c, x + q[0] * w, y + q[1] * h, 1.5, RIVET, 0.7);
  }
  function head(c, roar) {
    const A_ = A(), hy = roar ? -2 : 0;
    for (const s of [-1, 1]) { // ears
      A_.circle(c, s * 17, -104 + hy, 7.5, FUR, 1.6);
      A_.circle(c, s * 17, -103 + hy, 4, FUR_D, 0);
    }
    fur(c, [[-22, -100 + hy], [-16, -110 + hy], [16, -110 + hy], [22, -100 + hy], [24, -84], [12, -72], [-12, -72], [-24, -84]], FUR, 1.8, 2.6, 7);
    fur(c, [[-11, -88], [11, -88], [10, -74], [-10, -74]], FUR_L, 0, 1, 6);    // muzzle
    if (roar) {
      A_.poly(c, [[-9, -83], [9, -83], [7, -70], [-7, -70]], '#2a1a22', 1.4);
      for (const s of [-1, 1]) A_.poly(c, [[s * 7, -83], [s * 4, -83], [s * 5.5, -77]], '#f5efe2', 0.7);
      A_.poly(c, [[-6, -74], [6, -74], [4, -71], [-4, -71]], '#6e3844', 0);
    } else {
      A_.line(c, -5, -77, 0, -75.5, 1.1, INK); A_.line(c, 5, -77, 0, -75.5, 1.1, INK);
    }
    A_.poly(c, [[-4.6, -88], [4.6, -88], [2.8, -83.6], [-2.8, -83.6]], INK, 0);   // nose
    // Brow plate, with the blank white eyes under it
    for (const s of [-1, 1]) {
      c.globalAlpha = 0.5; A_.circle(c, s * 10.5, -93.4 + hy, 6, '#ffffff', 0); c.globalAlpha = 1;
      A_.poly(c, [[s * 5.5, -95 + hy], [s * 15, -95 + hy], [s * 14, -91.6 + hy], [s * 7, -91 + hy]], '#ffffff', 0.9);
    }
    A_.poly(c, [[0, -94 + hy], [-5, -96 + hy], [-20, -99 + hy], [-18, -109 + hy], [-8, -113 + hy], [8, -113 + hy], [18, -109 + hy], [20, -99 + hy], [5, -96 + hy]], PLATE, 1.8);
    A_.poly(c, [[-8, -113 + hy], [8, -113 + hy], [18, -109 + hy], [0, -102 + hy], [-18, -109 + hy]], PLATE_L, 0);
    A_.line(c, 0, -113 + hy, 0, -94 + hy, 1.1, INK);
    for (const q of [[-13, -103], [13, -103]]) A_.circle(c, q[0], q[1] + hy, 1.4, RIVET, 0.7);
  }

  // pose: stand, left (his paw raised on screen left), right, roar, open, down
  function bear(c, pose) {
    const A_ = A(), lifted = pose === 'left' ? -1 : pose === 'right' ? 1 : 0;
    // Forelegs
    for (const s of [-1, 1]) {
      if (s === lifted) continue;
      fur(c, [[s * 15, -58], [s * 43, -62], [s * 47, -22], [s * 44, -6], [s * 16, -6], [s * 14, -26]], FUR, 2, 3, 8);
      fur(c, [[s * 15, -32], [s * 26, -36], [s * 26, -8], [s * 16, -8]], FUR_D, 0, 2, 7);
      paw(c, s * 30, -1, 1.02);
    }
    // Body: broad and shaggy, the one shadow tone low down
    fur(c, [[-44, -80], [44, -80], [47, -46], [36, -24], [16, -20], [0, -14], [-16, -20], [-36, -24], [-47, -46]], FUR, 2.2, 3, 10);
    fur(c, [[-30, -40], [30, -40], [18, -21], [0, -15], [-18, -21]], FUR_D, 0, 2.6, 6);
    fur(c, [[-20, -70], [20, -70], [14, -54], [0, -46], [-14, -54]], FUR_L, 0, 2.4, 6);
    for (const q of [[-34, -44], [-24, -34], [34, -44], [24, -34]]) A_.poly(c, [[q[0] - 3, q[1] - 7], [q[0] + 3, q[1] - 7], [q[0], q[1] + 4]], FUR_D, 0);
    if (lifted) { // the raised foreleg, claws out, about to come down
      const s = lifted;
      fur(c, [[s * 26, -74], [s * 48, -70], [s * 60, -104], [s * 42, -112]], FUR, 2, 3, 8);
      fur(c, [[s * 32, -80], [s * 44, -78], [s * 54, -102], [s * 46, -106]], FUR_L, 0, 2, 7);
      c.save(); c.translate(s * 51, -110); c.rotate(s * 0.4); paw(c, 0, 0, 1.08, true, true); c.restore();
    }
    // Cables, shoulder plate to core
    for (const s of [-1, 1]) {
      if (s === lifted) { plateHex(c, s * 38, -74, 11, 11); } else plateHex(c, s * 37, -66, 11.5, 14);
      const px = s * 30, py = lifted === s ? -66 : -54;
      c.beginPath(); c.moveTo(px, py); c.quadraticCurveTo(s * 24, -44, s * 9, -37); c.lineWidth = 4; c.strokeStyle = INK; c.stroke();
      c.lineWidth = 2; c.strokeStyle = '#55545c'; c.stroke();
      c.beginPath(); c.moveTo(px + s * 4, py + 2); c.quadraticCurveTo(s * 28, -40, s * 11, -33); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
      c.lineWidth = 1.2; c.strokeStyle = '#55545c'; c.stroke();
    }
    // The core in its steel ring
    const hot = pose === 'open' || pose === 'roar';
    if (hot) { c.globalAlpha = 0.34; A_.circle(c, 0, -40, 24, '#ffffff', 0); c.globalAlpha = 1; }
    A_.circle(c, 0, -40, 12.5, '#3a3940', 2);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; A_.circle(c, Math.cos(a) * 10.4, -40 + Math.sin(a) * 10.4, 0.9, RIVET, 0); }
    A_.circle(c, 0, -40, 8.5, pose === 'down' ? '#55565e' : '#ffffff', 1.2);
    // Collar and the short chain end
    A_.poly(c, [[-25, -80], [25, -80], [23, -71], [-23, -71]], PLATE, 1.8);
    for (let x = -20; x <= 20; x += 8) A_.circle(c, x, -75.5, 1.4, RIVET, 0.7);
    for (let i = 0; i < 3; i++) A_.ellipse(c, 0, -67 + i * 5.2, 2.2, 3.4, PLATE_L, 1.2);
    head(c, pose === 'roar');
  }

  const POSES = ['stand', 'left', 'right', 'roar', 'open', 'down'];
  HD.drawBear = function (c, x, y, h, pose, o = {}) {
    const A_ = A(), key = 'bear_front';
    c.save();
    if (o.flash) { c.translate(Math.sin(o.t * 70) * 3, 0); }
    if (!A_.draw(c, key, POSES.indexOf(pose), x, y, h)) {
      if (pose === 'down') { c.translate(x, y); c.scale(1, 0.62); c.translate(-x, -y); }   // the code bear goes flat by being squashed; a picture draws it lying down
      HD.stamp(c, HD.bake('bear' + pose, 180, 170, 90, 150, cc => { cc.lineCap = 'round'; cc.lineJoin = 'round'; bear(cc, pose); }, 4), x, y, h / 114);
    }
    if (o.flash) { c.globalAlpha = 0.4; A_.circle(c, x, y - HD.coreUp(h), h * 0.16, '#ffffff', 0); c.globalAlpha = 1; }
    c.restore();
  };
  // How far up the bear its core sits: 40/114 on the code bear, 0.45 on the picture (measured on bear-front.webp, frames 0 to 4; the sheet's own proportions put it higher).
  HD.coreUp = h => h * (A().has('bear_front') ? 0.45 : 40 / 114);

  // A foreleg up through a hole in the deck, claws open at the top.
  function pawUp(c) {
    const A_ = A();
    A_.ellipse(c, 0, -2, 36, 11, '#120c10', 2);
    fur(c, [[-19, -2], [19, -2], [22, -44], [24, -66], [-24, -66], [-22, -44]], FUR, 2, 3, 8);
    fur(c, [[-19, -2], [-4, -2], [-6, -60], [-22, -60]], FUR_L, 0, 2, 7);
    fur(c, [[8, -2], [19, -2], [22, -60], [10, -60]], FUR_D, 0, 2, 7);
    c.save(); c.translate(0, -72); paw(c, 0, 0, 1.3, true, true); c.restore();
    // Splintered planks round the edge
    for (const q of [[-34, 0, -44, -18], [-20, 6, -28, -14], [34, 0, 46, -20], [18, 7, 30, -12], [0, 9, -6, -8]]) A_.poly(c, [[q[0] - 7, q[1]], [q[0] + 7, q[1]], [q[2], q[3]]], '#8a6a48', 1.6);
  }
  HD.drawPaw = function (c, x, y, h, flash) {
    const A_ = A();
    if (!A_.draw(c, 'bear_paw', 0, x, y, h)) HD.stamp(c, HD.bake('bearPaw', 130, 124, 65, 104, cc => { cc.lineCap = 'round'; cc.lineJoin = 'round'; pawUp(cc); }, 4), x, y, h / 92);
    if (flash) { c.globalAlpha = 0.5; A_.ellipse(c, x, y - h * 0.55, h * 0.3, h * 0.4, '#ffffff', 0); c.globalAlpha = 1; }
  };
  // Where the bear came up: a torn hole with planks standing round it. Drawn in two parts, so the bear comes up between them: what's behind it, then what's in front.
  const WIDE = 62;
  HD.drawBreachBack = function (c, x, y, s) {
    const A_ = A();
    A_.ellipse(c, x, y, WIDE * s, 17 * s, '#120c10', 2);
    c.globalAlpha = 0.6; A_.ellipse(c, x, y + 2 * s, WIDE * 0.62 * s, 8 * s, '#eef2ff', 0); c.globalAlpha = 1;
    for (const q of [[-0.92, -3, -1.1, -24], [-0.55, -14, -0.66, -33], [-0.16, -17, -0.1, -30], [0.3, -16, 0.4, -36], [0.74, -11, 0.88, -30], [1.0, -2, 1.16, -20]]) splinter(c, x, y, s, q);
  };
  HD.drawBreachFront = function (c, x, y, s) {
    for (const q of [[-1.0, 4, -1.2, -12], [-0.74, 11, -0.86, -9], [-0.4, 15, -0.34, -7], [-0.08, 17, -0.16, -4], [0.24, 16, 0.3, -9], [0.58, 13, 0.68, -7], [0.92, 7, 1.12, -10]]) splinter(c, x, y, s, q);
  };
  function splinter(c, x, y, s, q) {
    const A_ = A(), bx = x + q[0] * WIDE * s, by = y + q[1] * s, tx = x + q[2] * WIDE * s, ty = y + q[3] * s, w = 8 * s;
    A_.poly(c, [[bx - w, by], [bx + w, by], [tx + w * 0.3, ty], [tx - w * 0.2, ty + 3 * s]], '#7a5c42', 1.6);
    A_.poly(c, [[bx + w * 0.2, by], [bx + w, by], [tx + w * 0.3, ty]], '#54392a', 0);
  }
  // The clip for a bear coming up through it: everything above the hole's near edge. A curve with a torn edge, never a straight line.
  HD.clipBreach = function (c, x, y, s) {
    c.beginPath();
    c.moveTo(x - 500, -500); c.lineTo(x + 500, -500); c.lineTo(x + 500, y); c.lineTo(x + WIDE * s, y);
    const n = 14;
    for (let i = 1; i <= n; i++) { const u = i / n, a = u * Math.PI, jag = i % 2 ? 3.5 * s : 0; c.lineTo(x + Math.cos(a) * WIDE * s, y + Math.sin(a) * (17 * s + jag)); }
    c.lineTo(x - 500, y); c.closePath(); c.clip();
  };
  HD.drawHole = function (c, x, y, s) {
    const A_ = A();
    A_.ellipse(c, x, y, 30 * s, 9 * s, '#120c10', 1.6);
    c.globalAlpha = 0.5; A_.ellipse(c, x, y + 1, 18 * s, 4 * s, '#eef2ff', 0); c.globalAlpha = 1;
  };
})();
