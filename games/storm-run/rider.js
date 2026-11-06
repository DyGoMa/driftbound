// Storm Run: Silt in the saddle, in code (silt-sheet-v1.png): messy black hair, the white strapped mask with its one eye slit, a long torn coat,
// belt, hooked blade. Riding low, one arm on the reins or thrown back for a cable. A warm rim of storm light keeps his dark shape off the dark pylons behind him.
window.SR = window.SR || {};
(function () {
  const A = () => Kit.art;
  const COAT = '#23232d', COAT_D = '#17171f', FOLD = '#454553', SLEEVE = '#2f2f3b', PANTS = '#474753', BLACK = '#0f0f15', MASK = '#f2f1ec', RIM = '#f3a266';
  const W = 170, H = 180, OX = 100, OY = 120;   // the box he's drawn in. Origin = where he sits

  function arm(c, up) {
    const A_ = A(), s = up ? [2, -28] : [5, -26], e = up ? [-9, -38] : [15, -11], h = up ? [-21, -52] : [31, -14];
    A_.joined(c, [{ a: s, b: e, ra: 6, rb: 4.4, front: 1, color: SLEEVE }, { a: e, b: h, ra: 4.4, rb: 3.4, color: SLEEVE }], 1.3);
    A_.circle(c, h[0], h[1], 3.6, BLACK, 1.2);
    if (up) { // the cable's hook in his fist, glowing like a bond-cutter
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(h[0] - 3, h[1] - 5, 7, 0, 7); c.fill();
      A_.poly(c, [[h[0] - 1, h[1] - 1], [h[0] - 6, h[1] - 10], [h[0] - 1, h[1] - 13], [h[0] - 4, h[1] - 9], [h[0] + 2, h[1] - 3]], '#f6f8fb', 1.1);
    }
  }

  function paint(c, up) {
    const A_ = A();
    // Far arm on the reins
    A_.joined(c, [{ a: [9, -26], b: [20, -13], ra: 5, rb: 3.8, color: COAT_D }, { a: [20, -13], b: [36, -17], ra: 3.8, rb: 3, color: COAT_D }], 1.2);
    // The long coat streaming back over the flank, its hem in rags
    A_.poly(c, [[10, -30], [0, -30], [-6, -14], [-13, 0], [-30, 8], [-58, 12], [-49, 17], [-62, 26], [-46, 26], [-50, 38], [-33, 31], [-30, 44], [-17, 34], [-11, 47], [-3, 35], [4, 44], [9, 30], [14, 6], [15, -20]], COAT, 1.7);
    A_.poly(c, [[-13, 2], [-30, 12], [-45, 20], [-33, 24], [-18, 27], [-3, 28], [8, 26], [12, 6]], COAT_D, 0);
    [[-3, 2, -24, 13, -38, 25], [1, 4, -8, 18, -13, 34], [6, 5, 4, 18, 1, 33]].forEach(l => { c.beginPath(); c.moveTo(l[0], l[1]); c.quadraticCurveTo(l[2], l[3], l[4], l[5]); c.lineWidth = 1.4; c.strokeStyle = FOLD; c.lineCap = 'round'; c.stroke(); });
    // Near leg astride the barrel: dark grey trousers, a big black boot
    A_.joined(c, [{ a: [3, 3], b: [21, 15], ra: 7.4, rb: 5.6, front: 1, back: 1, color: PANTS }, { a: [21, 15], b: [15, 34], ra: 5.6, rb: 4.6, color: PANTS }], 1.4);
    A_.poly(c, [[10, 28], [20, 30], [20, 40], [29, 43], [29, 47], [9, 47], [8, 40]], BLACK, 1.2);
    A_.line(c, 10, 46, 28, 46, 1.2, '#3a3a44');
    A_.line(c, 11, 30, 19, 32, 1, '#3a3a44');
    // Torso, closed down to the belt, leaning into the ride
    A_.blob(c, [[0, -30], [15, -30], [17, -18], [13, -2], [-3, -1], [-5, -14]], COAT, 1.6);
    A_.poly(c, [[9, -30], [15, -29], [15, -20], [11, -6], [8, -14]], BLACK, 0);   // the shirt where the coat falls open
    A_.line(c, 9, -29, 8, -5, 1.2, FOLD);
    // Belt and square buckle, the hooked blade hanging at his hip
    A_.poly(c, [[-5, -5], [14, -6], [14, 0], [-5, 1]], BLACK, 1.1);
    A_.poly(c, [[7, -6.4], [12, -6.6], [12, -0.2], [7, 0]], null, 1.1, '#9a9eaa');
    c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.arc(-4, 16, 9, 0, 7); c.fill();
    A_.poly(c, [[-1, 0], [2, 1], [0, 9], [-3, 21], [-8, 26], [-5, 19], [-9, 18], [-4, 13]], '#f6f8fb', 1.1);
    // Standing collar
    A_.poly(c, [[3, -35], [13, -33], [16, -28], [5, -27], [0, -29]], COAT, 1.3);
    A_.line(c, 5, -33, 7, -28, 1, FOLD);
    // Hair behind the mask: messy spikes
    A_.poly(c, [[6, -40], [-2, -41], [3, -46], [-3, -50], [4, -53], [1, -59], [8, -57], [11, -62], [15, -58], [21, -61], [25, -56], [21, -46], [14, -36], [8, -33], [8, -37], [3, -35]], '#14141b', 1.3);
    // The mask, side-on, facing front: smooth, white, one black slit, a strap round the head
    A_.blob(c, [[13, -55], [21, -55], [27, -49], [27.5, -42], [25, -36], [20, -31, 1], [15, -35], [12.5, -45]], MASK, 1.5);
    c.save(); c.beginPath(); c.moveTo(13, -40); c.lineTo(22, -38); c.lineTo(28, -40); c.lineTo(25, -30); c.lineTo(13, -30); c.closePath(); c.fillStyle = '#c9c8c6'; c.fill(); c.restore();
    A_.blob(c, [[13, -55], [21, -55], [27, -49], [27.5, -42], [25, -36], [20, -31, 1], [15, -35], [12.5, -45]], null, 1.5);
    A_.poly(c, [[19.5, -46.6], [26.5, -46.6], [26.5, -44.2], [19.5, -44.2]], BLACK, 0);
    A_.poly(c, [[3, -46], [13, -47.5], [13, -44.5], [4, -43]], '#3b2a20', 1);
    arm(c, up);
  }

  SR.drawRider = function (c, x, y, up) {
    const name = up ? 'u' : 'r';
    const fig = SR.bake('rider' + name, W, H, OX, OY, cc => paint(cc, up));
    const rim = SR.bake('riderRim' + name, W, H, OX, OY, cc => {
      cc.drawImage(fig.cv, -OX, -OY, W, H);
      cc.globalCompositeOperation = 'source-in';
      cc.fillStyle = RIM; cc.fillRect(-OX, -OY, W, H);
    });
    for (let i = 0; i < 8; i++) SR.stamp(c, rim, x + Math.cos(i * 0.785) * 1.3, y + Math.sin(i * 0.785) * 1.3);
    A().line(c, x + 36, y - 17, x + 70, y - 28, 1.5, BLACK);   // the rein to the hound's neck
    SR.stamp(c, fig, x, y);
  };
})();
