// The 12 pals (docs/FRIDAY_BATCH.md; all Claude's designs, cute and comic, never in flirting or innuendo).
// DRIFT_PALS.list, .get(id), .byGame(gameId), .paint(canvas, id). Set image to a site-relative path to use a picture; if it fails, the code portrait stays.
// Portraits are drawn in a 100 x 100 box: black ink, flat colour, one shadow tone.
(function () {
  const INK = '#10121f';
  function ink(c, fill, lw) { if (fill) { c.fillStyle = fill; c.fill(); } if (lw !== 0) { c.lineWidth = lw || 2.6; c.strokeStyle = INK; c.lineJoin = c.lineCap = 'round'; c.stroke(); } }
  function ball(c, x, y, rx, ry, fill, lw) { c.beginPath(); c.ellipse(x, y, rx, ry === undefined ? rx : ry, 0, 0, 7); ink(c, fill, lw); }
  function poly(c, pts, fill, lw) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); ink(c, fill, lw); }
  function line(c, pts, lw, col) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.lineWidth = lw || 2.6; c.strokeStyle = col || INK; c.lineCap = c.lineJoin = 'round'; c.stroke(); }
  // Big round pal eyes. Pals are the one thing allowed to look like plush toys.
  function eyes(c, x1, x2, y, r) { for (const x of [x1, x2]) { ball(c, x, y, r, r * 1.12, INK, 0); ball(c, x + r * 0.3, y - r * 0.4, r * 0.36, r * 0.36, '#fff', 0); } }
  function smile(c, x, y, w) { c.beginPath(); c.arc(x, y - w * 0.4, w, 0.4, Math.PI - 0.4); c.lineWidth = 2.2; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(); }
  function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function legs(c, xs, y, col, h) { xs.forEach(x => { c.beginPath(); rr(c, x - 5, y, 10, h || 11, 4); ink(c, col); }); }
  function zap(c, x, y, s, col) { poly(c, [[x, y], [x + 5 * s, y], [x + 2 * s, y + 5 * s], [x + 6 * s, y + 5 * s], [x - 2 * s, y + 14 * s], [x, y + 7 * s], [x - 4 * s, y + 7 * s]], col || '#f2d21b', 1.6); }

  const ART = {
    fizzlet(c) { // a fluffy storm cloud on two stubby legs
      legs(c, [39, 61], 72, '#59608a');
      [[30, 50, 18], [50, 40, 22], [70, 50, 18], [40, 62, 16], [60, 62, 16]].forEach(b => ball(c, b[0], b[1], b[2], b[2], '#8d93b5'));
      [[30, 50, 16.6], [50, 40, 20.6], [70, 50, 16.6], [40, 62, 14.6], [60, 62, 14.6], [50, 54, 18]].forEach(b => ball(c, b[0], b[1], b[2], b[2], '#8d93b5', 0));
      ball(c, 50, 66, 16, 8, '#6d7399', 0);
      eyes(c, 41, 59, 50, 5); smile(c, 50, 60, 5);
      zap(c, 14, 16, 1.1); zap(c, 82, 20, 0.9);
    },
    boltnip(c) { // a tiny gecko with a kite-tail that sparks
      line(c, [[34, 66], [18, 58], [14, 40]], 3.2);
      poly(c, [[14, 20], [22, 32], [14, 44], [6, 32]], '#f2d21b'); poly(c, [[14, 20], [14, 44], [6, 32]], '#c8a212', 0); poly(c, [[14, 20], [22, 32], [14, 44], [6, 32]], null);
      zap(c, 24, 8, 0.8, '#fff3a8');
      [[38, 82], [66, 82]].forEach(p => ball(c, p[0], p[1], 8, 4.5, '#3fae74'));
      ball(c, 52, 66, 21, 17, '#58cf8d'); ball(c, 52, 73, 13, 8, '#c9f3d6', 0);
      ball(c, 58, 38, 21, 18, '#58cf8d'); ball(c, 46, 44, 7, 7, '#3fae74', 0);
      eyes(c, 50, 68, 35, 5.4); smile(c, 60, 47, 4.5);
    },
    bobbin(c) { // a jellyfish shaped like a striped buoy
      [28, 40, 50, 60, 72].forEach((x, i) => line(c, [[x, 58], [x + (i % 2 ? 4 : -4), 72], [x, 90]], 3.4, '#f5a6b0'));
      c.beginPath(); c.moveTo(16, 60); c.quadraticCurveTo(16, 12, 50, 12); c.quadraticCurveTo(84, 12, 84, 60); c.closePath(); ink(c, '#f5efe2');
      c.save(); c.beginPath(); c.moveTo(16, 60); c.quadraticCurveTo(16, 12, 50, 12); c.quadraticCurveTo(84, 12, 84, 60); c.closePath(); c.clip();
      c.fillStyle = '#e0483a'; c.fillRect(0, 12, 100, 11); c.fillRect(0, 44, 100, 16);
      c.fillStyle = 'rgba(16,18,31,.14)'; c.fillRect(66, 0, 34, 70); c.restore();
      c.beginPath(); c.moveTo(16, 60); c.quadraticCurveTo(16, 12, 50, 12); c.quadraticCurveTo(84, 12, 84, 60); c.closePath(); ink(c, null);
      eyes(c, 41, 59, 34, 5); smile(c, 50, 42, 4.5);
    },
    mopclaw(c) { // a shy crab wearing a mop-head as a shell
      legs(c, [30, 44, 56, 70], 74, '#c9602b', 10);
      poly(c, [[6, 52], [18, 40], [26, 52], [18, 60]], '#e8763a'); poly(c, [[94, 52], [82, 40], [74, 52], [82, 60]], '#e8763a');
      ball(c, 50, 68, 27, 14, '#e8763a'); ball(c, 50, 74, 20, 6, '#c9602b', 0);
      c.beginPath(); c.moveTo(18, 66); c.quadraticCurveTo(14, 14, 50, 12); c.quadraticCurveTo(86, 14, 82, 66); c.closePath(); ink(c, '#d9d6c6');
      for (let x = 24; x <= 76; x += 8) line(c, [[x + (50 - x) * 0.3, 22], [x, 64]], 2, '#a9a693');
      c.beginPath(); rr(c, 44, 2, 12, 14, 3); ink(c, '#8a6a42');
      ball(c, 38, 62, 7.5, 7.5, '#f5efe2', 2); ball(c, 62, 62, 7.5, 7.5, '#f5efe2', 2); eyes(c, 39, 61, 63, 4);
    },
    cinderbun(c) { // a warm ember dumpling with tiny feet
      legs(c, [39, 61], 76, '#7a2f18', 9);
      c.beginPath(); c.moveTo(14, 66); c.quadraticCurveTo(10, 28, 50, 22); c.quadraticCurveTo(90, 28, 86, 66); c.quadraticCurveTo(84, 82, 50, 82); c.quadraticCurveTo(16, 82, 14, 66); c.closePath(); ink(c, '#f28a3a');
      ball(c, 50, 76, 26, 6, '#c9602b', 0);
      [[34, 30], [42, 25], [50, 24], [58, 25], [66, 30]].forEach(p => line(c, [[50, 12], [p[0], p[1] + 7]], 2.2));
      ball(c, 50, 12, 5, 5, '#ffd25e');
      ball(c, 26, 62, 6, 4, '#ff5a3a', 0); ball(c, 74, 62, 6, 4, '#ff5a3a', 0);
      eyes(c, 39, 61, 54, 5.4); smile(c, 50, 64, 5);
      ball(c, 15, 22, 2.6, 2.6, '#ffd25e', 0); ball(c, 86, 18, 2, 2, '#ffd25e', 0); ball(c, 82, 34, 1.6, 1.6, '#ff8a3a', 0);
    },
    dicemite(c) { // a beetle-mite with a lucky pip-marked shell
      [[20, 56, 10, 66], [80, 56, 90, 66], [22, 70, 12, 82], [78, 70, 88, 82], [34, 80, 28, 90], [66, 80, 72, 90]].forEach(l => line(c, [[l[0], l[1]], [l[2], l[3]]], 3.2));
      line(c, [[42, 28], [34, 12]], 2.6); line(c, [[58, 28], [66, 12]], 2.6); ball(c, 34, 11, 3, 3, '#e0483a'); ball(c, 66, 11, 3, 3, '#e0483a');
      c.beginPath(); rr(c, 20, 40, 60, 44, 16); ink(c, '#f5efe2');
      c.beginPath(); rr(c, 62, 42, 16, 40, 10); ink(c, '#cfcabb', 0);
      [[34, 54], [66, 54], [50, 66], [34, 76], [66, 76]].forEach(p => ball(c, p[0], p[1], 4.4, 4.4, '#e0483a', 0));
      c.beginPath(); rr(c, 30, 22, 40, 24, 12); ink(c, '#2a2448');
      eyes(c, 42, 58, 33, 4.6); smile(c, 50, 40, 3);
    },
    tuftle(c) { // a puff of shadow fur with two big eyes
      const pts = [];
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r = i % 2 ? 30 : 39; pts.push([50 + Math.cos(a) * r, 54 + Math.sin(a) * r * 0.92]); }
      poly(c, pts, '#2c2750'); ball(c, 50, 68, 22, 12, '#211d3e', 0);
      ball(c, 38, 48, 12, 13.5, '#f5efe2', 2.4); ball(c, 62, 48, 12, 13.5, '#f5efe2', 2.4);
      eyes(c, 39, 61, 50, 7.4);
      ball(c, 50, 62, 2.6, 2, '#8d7cc0', 0);
    },
    lamplick(c) { // a moth that licks lantern glass
      c.beginPath(); rr(c, 68, 40, 26, 38, 6); ink(c, '#ffe39a');
      ball(c, 81, 58, 8, 11, '#ffb43a', 0); line(c, [[68, 40], [94, 40]], 5, '#5e4a2a'); line(c, [[68, 78], [94, 78]], 5, '#5e4a2a'); line(c, [[81, 40], [81, 32]], 3, '#5e4a2a');
      poly(c, [[34, 44], [6, 18], [4, 46], [20, 56]], '#c9a2e8'); poly(c, [[34, 56], [8, 62], [14, 82], [32, 70]], '#a884cc');
      poly(c, [[34, 44], [46, 12], [58, 30], [46, 54]], '#c9a2e8'); ball(c, 13, 38, 4, 4, '#ffe39a', 0); ball(c, 48, 28, 3.4, 3.4, '#ffe39a', 0);
      ball(c, 40, 62, 11, 16, '#e8dcc0'); ball(c, 42, 44, 13, 13, '#f5efe2');
      line(c, [[38, 33], [30, 20]], 2.2); line(c, [[46, 32], [52, 20]], 2.2);
      eyes(c, 41, 51, 42, 3.8);
      c.beginPath(); c.moveTo(53, 49); c.quadraticCurveTo(60, 56, 68, 54); c.lineWidth = 3.4; c.strokeStyle = '#ef6a8a'; c.lineCap = 'round'; c.stroke();
    },
    rivetling(c) { // a little iron hedgehog studded with rivets
      legs(c, [34, 62], 74, '#4a505c', 9);
      const pts = [];
      for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI, r = i % 2 ? 36 : 43; pts.push([50 + Math.cos(a) * r, 74 + Math.sin(a) * r * 1.1]); }
      poly(c, pts, '#6b7280');
      c.beginPath(); c.moveTo(14, 76); c.quadraticCurveTo(50, 90, 86, 76); c.lineTo(86, 70); c.lineTo(14, 70); c.closePath(); ink(c, '#4a505c', 0);
      [[28, 52], [44, 38], [62, 40], [76, 56], [38, 62]].forEach(p => { ball(c, p[0], p[1], 4.4, 4.4, '#c8ccd2', 2); ball(c, p[0] - 1, p[1] - 1, 1.4, 1.4, '#fff', 0); });
      ball(c, 60, 64, 17, 14, '#e6c9a0'); ball(c, 74, 66, 3.6, 3, INK, 0);
      eyes(c, 54, 66, 60, 3.8); smile(c, 62, 70, 3.2);
    },
    spoonling(c) { // a begging stowaway with a ladle tail
      c.beginPath(); c.moveTo(66, 74); c.quadraticCurveTo(88, 76, 84, 40); c.lineWidth = 7; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke();
      c.beginPath(); c.moveTo(66, 74); c.quadraticCurveTo(88, 76, 84, 40); c.lineWidth = 3; c.strokeStyle = '#c8ccd2'; c.stroke();
      ball(c, 83, 30, 11, 12, '#c8ccd2'); ball(c, 83, 32, 6.6, 7.4, '#8d939e', 0);
      legs(c, [36, 56], 76, '#a87a4c', 9);
      ball(c, 46, 62, 22, 22, '#d9a56c'); ball(c, 46, 68, 13, 12, '#f5e3c8', 0);
      ball(c, 28, 24, 7, 9, '#d9a56c'); ball(c, 62, 24, 7, 9, '#d9a56c');
      ball(c, 45, 36, 21, 18, '#d9a56c');
      eyes(c, 36, 54, 34, 6.4);
      ball(c, 45, 43, 2.6, 2, INK, 0); smile(c, 45, 47, 3);
      ball(c, 34, 56, 5, 7, '#d9a56c'); ball(c, 56, 56, 5, 7, '#d9a56c');
    },
    glimmick(c) { // a snail with a faceted crystal shell
      c.beginPath(); c.moveTo(10, 82); c.quadraticCurveTo(10, 66, 26, 64); c.lineTo(84, 66); c.quadraticCurveTo(94, 76, 90, 84); c.closePath(); ink(c, '#e8c9a8');
      line(c, [[10, 64], [8, 46]], 3); line(c, [[24, 62], [26, 46]], 3);
      ball(c, 16, 62, 13, 13, '#e8c9a8', 0);
      poly(c, [[30, 66], [24, 44], [40, 20], [66, 14], [84, 34], [84, 58], [68, 70]], '#8fd3f0');
      poly(c, [[40, 20], [52, 42], [30, 66], [24, 44]], '#b9e6f7', 0); poly(c, [[66, 14], [84, 34], [62, 42], [52, 42]], '#6db9dc', 0);
      poly(c, [[52, 42], [62, 42], [68, 70], [30, 66]], '#a3dcf3', 0); poly(c, [[62, 42], [84, 34], [84, 58], [68, 70]], '#5ea9cc', 0);
      poly(c, [[30, 66], [24, 44], [40, 20], [66, 14], [84, 34], [84, 58], [68, 70]], null);
      eyes(c, 8, 26, 44, 4.6); smile(c, 17, 72, 4);
    },
    shardle(c) { // a round glass chick that chimes
      legs(c, [40, 60], 80, '#e0a23c', 8);
      ball(c, 50, 52, 32, 32, '#c7ecf7');
      poly(c, [[50, 20], [72, 32], [60, 52], [40, 52], [28, 32]], '#e6f7fc', 0); poly(c, [[60, 52], [80, 56], [66, 78], [48, 84]], '#a4d7e8', 0);
      line(c, [[50, 20], [60, 52], [48, 84]], 1.2, '#7fbdd3'); line(c, [[28, 32], [40, 52], [60, 52], [72, 32]], 1.2, '#7fbdd3'); line(c, [[20, 58], [40, 52]], 1.2, '#7fbdd3'); line(c, [[80, 56], [60, 52]], 1.2, '#7fbdd3');
      ball(c, 50, 52, 32, 32, null);
      poly(c, [[50, 8], [55, 20], [45, 20]], '#8fd3f0');
      eyes(c, 40, 60, 46, 5.2);
      poly(c, [[44, 56], [56, 56], [50, 64]], '#f4c152');
      line(c, [[10, 32], [4, 28]], 2.2, '#f4c152'); line(c, [[12, 22], [8, 14]], 2.2, '#f4c152'); line(c, [[90, 32], [96, 28]], 2.2, '#f4c152'); line(c, [[88, 22], [92, 14]], 2.2, '#f4c152');
    },
  };

  const pal = (id, name, game, what, blurb) => ({ id, name, game, what, blurb, image: null, draw: ART[id] });
  const list = [
    pal('fizzlet', 'Fizzlet', 'storm-run', 'a fluffy storm cloud on two stubby legs', 'Sneezes thunder. Apologises by raining on your boots.'),
    pal('boltnip', 'Boltnip', 'storm-run', 'a tiny gecko with a kite-tail that sparks', 'Flies its own tail in a gale and is always surprised where it lands.'),
    pal('bobbin', 'Bobbin', 'tide-gap', 'a jellyfish shaped like a striped buoy', 'Bobs next to any boat and expects to be counted as crew.'),
    pal('mopclaw', 'Mopclaw', 'tide-gap', 'a shy crab wearing a mop-head as a shell', 'Hides under its mop. Leaves the deck very clean by accident.'),
    pal('cinderbun', 'Kindlekin', 'hot-hand', 'a warm ember dumpling with tiny feet', 'Toasty to hold. Trots after anyone who smells of soup.'),
    pal('dicemite', 'Dicemite', 'hot-hand', 'a beetle-mite with a lucky pip-marked shell', 'Rolls over to show a new number. It is always the number you needed yesterday.'),
    pal('tuftle', 'Tuftle', 'silent-cut', 'a puff of shadow fur with two big eyes', 'You only find it by the eyes. It has been behind you for an hour, being friendly.'),
    pal('lamplick', 'Lamplick', 'silent-cut', 'a moth that licks lantern glass', 'Gets dizzy on lamp oil fumes. Harbour keepers blame it for every dim light.'),
    pal('rivetling', 'Rivetling', 'hold-the-deck', 'a little iron hedgehog studded with rivets', 'Curls up in the toolbox and gets used as a mallet. Seems pleased.'),
    pal('spoonling', 'Spoonling', 'hold-the-deck', 'a begging stowaway with a ladle tail', 'Sits up by the pot and holds its tail out for seconds. Then thirds.'),
    pal('glimmick', 'Prismule', 'split-light', 'a snail with a faceted crystal shell', 'Throws tiny rainbows on the wall, very slowly, for anyone who waits.'),
    pal('shardle', 'Shardle', 'split-light', 'a round glass chick that chimes', 'Rings when it hops. Cannot sneak, and has never once tried.'),
  ];

  function paint(cv, id) {
    const p = list.find(x => x.id === id), c = cv.getContext && cv.getContext('2d');
    if (!p || !c) return;
    c.setTransform(cv.width / 100, 0, 0, cv.height / 100, 0, 0);
    c.clearRect(0, 0, 100, 100);
    p.draw(c);
    if (p.image) { // A picture, when one exists, replaces the code portrait once it has loaded.
      const img = new Image();
      img.onload = () => { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(img, 0, 0, cv.width, cv.height); };
      img.src = (window.Kit ? Kit.url(p.image) : p.image);
    }
  }

  window.DRIFT_PALS = { list, get: id => list.find(p => p.id === id) || null, byGame: game => list.filter(p => p.game === game), paint };
})();
