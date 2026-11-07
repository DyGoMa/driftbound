// Hot Hand: the five places. Each is baked once. What moves (flames, rain, embers, smoke) is in draw.js.
window.HH = window.HH || {};
(function () {
  const A = () => Kit.art, T = TUNE;
  const W0 = 1060, H0 = 610, OX = 210, OY = 130;   // room for any screen shape: x from -210 to 850, y from -130 to 480

  function felt(c, col) { // The near edge: a long gambling table runs under the read-outs.
    const A_ = A();
    A_.poly(c, [[-210, 298], [850, 298], [850, 480], [-210, 480]], col || '#1d4034', 0);
    A_.poly(c, [[-210, 298], [850, 298], [850, 304], [-210, 304]], '#c29a4a', 0);
    A_.line(c, -210, 298, 850, 298, 2, A_.INK); A_.line(c, -210, 304, 850, 304, 1.6, A_.INK);
    A_.poly(c, [[-210, 355], [850, 355], [850, 480], [-210, 480]], A_.shade(col || '#1d4034', 0.74), 0);
  }

  const LOOKS = {
    // Stage 1: the market street at dusk, still in one piece, awnings and lanterns.
    row(c) {
      const rnd = HH.scatter(11);
      HH.sky(c, '#0c1026', '#2b2a5a', '#b85430', '#f4a03a', 214);
      HH.clouds(c, rnd, -60, 120, 11, '#1a1e4a', 'rgba(190,90,70,.55)');
      HH.farIsle(c, 510, 44, 62, '#3a2c52', '#5b5f6c'); HH.farIsle(c, 120, 78, 42, '#3a2c52', '#5b5f6c');
      HH.smoke(c, rnd, 470, 90, 110, '#3a2d3a', 'rgba(255,140,60,.3)');
      HH.house(c, -180, 200, 96, 104, { wall: '#3f2e30', roof: '#5d2730', floors: 2, awning: '#3a6a58' });
      HH.house(c, -70, 200, 102, 122, { floors: 3, awning: true, sign: (cc, x, y) => HH.cardSign(cc, x + 34, y - 8, 0.9, 'spade') });
      HH.house(c, 44, 200, 118, 96, { wall: '#56393a', roof: '#7a3030', floors: 2, awning: '#3a6a58', sign: (cc, x, y) => HH.cardSign(cc, x + 40, y - 8, 0.9, 'heart') });
      HH.house(c, 174, 200, 92, 138, { wall: '#3f2e30', floors: 3, awning: true, pitch: 0.55 });
      HH.house(c, 278, 200, 126, 100, { wall: '#533734', roof: '#6d2a30', floors: 2, awning: '#a97a2c', sign: (cc, x, y) => HH.cardSign(cc, x + 44, y - 8, 0.9, 'diamond') });
      HH.house(c, 416, 200, 96, 128, { wall: '#3f2e30', roof: '#5d2730', floors: 3, awning: true, pitch: 0.5 });
      HH.house(c, 524, 200, 118, 96, { wall: '#56393a', floors: 2, awning: '#3a6a58' });
      HH.house(c, 654, 200, 110, 124, { wall: '#3f2e30', floors: 3, awning: true });
      HH.house(c, 776, 200, 90, 96, { floors: 2, awning: '#a97a2c' });
      HH.lanterns(c, -70, 90, 44, 110, 5); HH.lanterns(c, 162, 100, 278, 102, 6, 22); HH.lanterns(c, 404, 100, 524, 106, 6, 22); HH.lanterns(c, 642, 104, 776, 104, 6);
      HH.street(c, 200, 310, '#6e6462', '#5a504f', 3);
      HH.barrel(c, 268, 206, 0.7); HH.crates(c, 520, 206, 0.62); HH.barrel(c, 600, 206, 0.7, '#7a5230');
      felt(c);
    },
    // Stage 2: narrow and close, walls right up over you, two lanes only. Darker, steam from the grates, dice on brackets, washing overhead.
    alley(c) {
      const rnd = HH.scatter(23);
      HH.sky(c, '#0a0d20', '#1d1d44', '#6e2f3e', '#a84a30', 90);
      HH.clouds(c, rnd, -80, 40, 6, '#14173a', 'rgba(150,70,70,.4)');
      const walls = [[-200, 150], [-92, 124], [18, 170], [130, 140], [246, 176], [352, 130], [470, 168], [586, 136], [700, 170], [800, 120]];
      walls.forEach((p, i) => HH.house(c, p[0], 232, 116, 240 - 0 - (i % 2 ? 44 : 10), { wall: i % 2 ? '#3a2a2e' : '#47302f', roof: '#4d2228', floors: 4, gable: i % 3 === 1, pitch: 0.28, litChance: 0.55, awning: i % 2 ? '#7a2424' : false }));
      for (let i = 0; i < 7; i++) { // washing on lines overhead
        const x = -140 + i * 150, y = 42 + (i % 2) * 22;
        A().line(c, x, y, x + 130, y + 6, 1, '#141220');
        [[18, '#c9b48a'], [52, '#7a3030'], [88, '#c0c4c8']].forEach(q => A().poly(c, [[x + q[0], y + 2], [x + q[0] + 20, y + 3], [x + q[0] + 18, y + 26], [x + q[0] + 2, y + 25]], q[1], 1.2));
      }
      HH.dieSign(c, 120, 152, 1, 5); HH.dieSign(c, 326, 142, 1.1, 3); HH.dieSign(c, 552, 154, 1, 6);
      HH.lanterns(c, 40, 122, 240, 120, 6, 12); HH.lanterns(c, 370, 116, 620, 120, 7, 14);
      HH.street(c, 232, 310, '#4e4a52', '#3f3b44', 7);
      [150, 410, 590].forEach(x => { A().ellipse(c, x, 244, 26, 5, '#1c1a26', 1.4); for (let i = -2; i <= 2; i++) A().line(c, x + i * 9, 240, x + i * 9, 248, 1.2, '#3f3b44'); });
      HH.crates(c, 40, 236, 0.72); HH.barrel(c, 280, 238, 0.8); HH.barrel(c, 300, 238, 0.8, '#7a5230'); HH.crates(c, 500, 236, 0.72);
      felt(c, '#3a2030');
    },
    // Stage 3: night and rain. The long gaming hall, three floors, shuttered top windows: the shooters' floor. The street's long table runs along it.
    table(c) {
      const A_ = A(), rnd = HH.scatter(31);
      HH.sky(c, '#060818', '#141a3a', '#242a52', '#3a3a64', 200);
      HH.clouds(c, rnd, -90, 30, 12, '#0d1028', 'rgba(90,100,150,.35)');
      // The hall: one long wall
      A_.poly(c, [[-210, 30], [850, 30], [850, 204], [-210, 204]], '#2e2630', 0);
      A_.poly(c, [[-210, 18], [850, 18], [850, 34], [-210, 34]], '#3d1d26', 1.8);
      for (let i = 0; i < 28; i++) { A_.poly(c, [[-210 + i * 40, 18], [-190 + i * 40, 8], [-170 + i * 40, 18]], '#4a2430', 1.4); }
      A_.line(c, -210, 148, 850, 148, 3, '#17121a'); A_.line(c, -210, 34, 850, 34, 3, '#17121a');
      for (let x = -200; x < 850; x += 35) A_.line(c, x, 34, x, 204, 2, '#1c161e');
      T.windows.forEach(p => HH.windowFrame(c, p[0], p[1]));
      for (let x = -170; x < 840; x += 70) if (!T.windows.some(p => Math.abs(p[0] - x) < 40)) { A_.poly(c, [[x - 9, 66], [x + 9, 66], [x + 9, 96], [x - 9, 96]], '#16141f', 1.5); }
      for (let x = -160; x < 850; x += 92) { A_.poly(c, [[x, 160], [x + 44, 160], [x + 44, 192], [x, 192]], rnd() < 0.5 ? '#c98f42' : '#1a1826', 1.8); A_.line(c, x + 22, 160, x + 22, 192, 1.3, '#17121a'); A_.line(c, x, 176, x + 44, 176, 1.3, '#17121a'); }
      HH.banner(c, 148, 40, 34, 56); HH.banner(c, 452, 40, 34, 56);
      HH.lanterns(c, -100, 150, 240, 152, 8, 10); HH.lanterns(c, 240, 152, 620, 150, 9, 10); HH.lanterns(c, 620, 150, 860, 150, 5, 10);
      HH.street(c, 204, 310, '#3e4154', '#32344a', 9);
      for (let i = 0; i < 26; i++) A_.ellipse(c, -180 + rnd() * 1000, 216 + rnd() * 88, 18 + rnd() * 30, 2 + rnd() * 2, 'rgba(160,180,230,.14)', 0);   // puddles
      // The Long Table itself: runs along the back of the street with cards and overturned stools.
      A_.poly(c, [[-210, 188], [850, 188], [850, 197], [-210, 197]], '#2d6a4d', 1.6);
      A_.poly(c, [[-210, 197], [850, 197], [850, 202], [-210, 202]], '#5a3a22', 1.6);
      for (let x = -180; x < 850; x += 130) { A_.line(c, x, 202, x + 3, 210, 3, '#3a2616'); A_.line(c, x + 90, 202, x + 87, 210, 3, '#3a2616'); A_.poly(c, [[x + 30, 190], [x + 40, 188], [x + 42, 194], [x + 32, 196]], '#efe6d2', 0.8); }
      felt(c, '#1a2a44');
    },
    // Stage 4: the fighting pit. Sand, a ring of fire, stands packed behind bars, and the cages hung over it all. Juno in the middle.
    pit(c) {
      const A_ = A(), rnd = HH.scatter(47);
      HH.sky(c, '#100a18', '#3a1d2e', '#8e3a22', '#e8702a', 110);
      HH.smoke(c, rnd, 60, 90, 180, '#2a1f28', 'rgba(255,120,50,.28)'); HH.smoke(c, rnd, 560, 90, 180, '#2a1f28', 'rgba(255,120,50,.28)');
      // Tiers of the stand, curving round
      [[40, '#2a1d20'], [80, '#35241f'], [118, '#40291f']].forEach((r, i) => {
        A_.poly(c, [[-210, r[0] + 30], [80, r[0]], [320, r[0] - 8], [560, r[0]], [850, r[0] + 30], [850, 210], [-210, 210]], r[1], 1.8);
        for (let k = 0; k < 44; k++) { const x = -200 + k * 24 + (i % 2) * 12, y = r[0] + 12 + Math.abs(x - 320) * 0.06, h = 13 + rnd() * 4; A_.circle(c, x, y, 4.2, rnd() < 0.5 ? '#6a4a44' : '#4e3a3a', 0); A_.poly(c, [[x - 6, y + 4], [x + 6, y + 4], [x + 8, y + h], [x - 8, y + h]], rnd() < 0.3 ? '#54402f' : '#33272a', 0); }
      });
      // Posts and rail
      for (let x = -200; x < 860; x += 80) A_.poly(c, [[x - 4, 34], [x + 4, 34], [x + 4, 204], [x - 4, 204]], '#1c1418', 1.3);
      A_.poly(c, [[-210, 158], [850, 158], [850, 166], [-210, 166]], '#5a3a22', 1.5);
      // Hanging cages, with shapes inside
      [[86, 22, 0], [200, 44, 1], [442, 44, 2], [556, 22, 3]].forEach(p => HH.cage(c, p[0], p[1], p[2]));
      A_.poly(c, [[-210, 200], [850, 200], [850, 212], [-210, 212]], '#1c1418', 1.6);
      HH.banner(c, 300, 60, 40, 66);
      HH.street(c, 208, 310, '#b08a5e', '#9a764e', 13, 320);
      felt(c, '#3a1414');
    },
    // Boss: the vault steps. Grey stone, columns, the great round door behind, Sever banners, the market burning either side.
    vault(c) {
      const A_ = A(), rnd = HH.scatter(59);
      HH.sky(c, '#0b0a1c', '#2c1b40', '#94302c', '#ee6a28', 210);
      HH.clouds(c, rnd, -70, 70, 10, '#17132e', 'rgba(220,90,60,.5)');
      HH.smoke(c, rnd, -60, 120, 200, '#2a1f28', 'rgba(255,120,50,.3)'); HH.smoke(c, rnd, 690, 120, 200, '#2a1f28', 'rgba(255,120,50,.3)');
      HH.house(c, -190, 196, 110, 110, { wall: '#2f2428', floors: 2, litChance: 0.2 }); HH.house(c, 740, 196, 120, 120, { wall: '#2f2428', floors: 2, litChance: 0.2 });
      // The bank
      A_.poly(c, [[-60, 44], [720, 44], [720, 196], [-60, 196]], '#6e7078', 2);
      A_.poly(c, [[-80, 44], [330, -8], [740, 44]], '#585a64', 2);
      A_.poly(c, [[20, 40], [330, 2], [640, 40]], '#6e7078', 1.6);
      HH.badge(c, 330, 25, 9, '#efe6d2', '#17161f');
      A_.poly(c, [[-72, 44], [732, 44], [732, 54], [-72, 54]], '#7e8088', 1.8);
      for (let x = -40; x < 720; x += 74) { if (x > 240 && x < 400) continue; A_.poly(c, [[x, 54], [x + 22, 54], [x + 22, 196], [x, 196]], '#868890', 1.6); A_.poly(c, [[x + 14, 54], [x + 22, 54], [x + 22, 196], [x + 14, 196]], '#6a6c75', 0); A_.poly(c, [[x - 4, 54], [x + 26, 54], [x + 24, 62], [x - 2, 62]], '#9a9ca4', 1.2); }
      // The vault door, round, with its wheel
      A_.circle(c, 330, 128, 66, '#3d3f48', 2.4); A_.circle(c, 330, 128, 54, '#5a5c66', 2); A_.circle(c, 330, 128, 40, '#74767e', 1.8);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; A_.circle(c, 330 + Math.cos(a) * 60, 128 + Math.sin(a) * 60, 2.6, '#22222a', 0); }
      A_.circle(c, 330, 128, 11, '#c29a4a', 1.6);
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI; A_.line(c, 330 - Math.cos(a) * 30, 128 - Math.sin(a) * 30, 330 + Math.cos(a) * 30, 128 + Math.sin(a) * 30, 4, '#c29a4a'); }
      HH.banner(c, 196, 62, 36, 74); HH.banner(c, 428, 62, 36, 74); HH.banner(c, 40, 62, 36, 74); HH.banner(c, 590, 62, 36, 74);
      // Steps
      HH.street(c, 196, 310, '#74767e', '#62646c', 17);
      for (let i = 0; i < 4; i++) { const y = 196 + [0, 6, 14, 26][i]; A_.line(c, -210, y, 850, y, i < 3 ? 1.8 : 2, '#34353e'); }
      felt(c, '#22242e');
    },
  };

  // A shuttered window for the Long Table's shooters. Shutters are drawn closed here; draw.js opens them when someone's in it.
  HH.windowFrame = function (c, x, y) {
    const A_ = A(), w = 56, h = 62, top = y - h;
    A_.poly(c, [[x - w / 2 - 4, top - 4], [x + w / 2 + 4, top - 4], [x + w / 2 + 4, y + 6], [x - w / 2 - 4, y + 6]], '#17121a', 0);
    A_.poly(c, [[x - w / 2, top], [x + w / 2, top], [x + w / 2, y], [x - w / 2, y]], '#3a3050', 1.8);
    A_.poly(c, [[x - w / 2, top], [x, top], [x, y], [x - w / 2, y]], '#524036', 1.6);
    A_.poly(c, [[x, top], [x + w / 2, top], [x + w / 2, y], [x, y]], '#463630', 1.6);
    for (let i = 1; i < 6; i++) { A_.line(c, x - w / 2 + 2, top + i * h / 6, x - 2, top + i * h / 6, 1, '#2a2020'); A_.line(c, x + 2, top + i * h / 6, x + w / 2 - 2, top + i * h / 6, 1, '#2a2020'); }
    A_.poly(c, [[x - w / 2 - 5, y], [x + w / 2 + 5, y], [x + w / 2 + 5, y + 6], [x - w / 2 - 5, y + 6]], '#6a5a4a', 1.5);
  };
  HH.cage = function (c, x, y, kind) {
    const A_ = A();
    A_.line(c, x, -130, x, y, 2, '#141018');
    const r = 26;
    A_.poly(c, [[x - r, y], [x + r, y], [x + r, y + 44], [x - r, y + 44]], 'rgba(20,14,22,.55)', 0);
    // A partner inside, in shadow: sad shapes, nothing to read but a big shape and an eye
    A_.ellipse(c, x, y + 32, 15, 11, '#3a2a30', 0); A_.circle(c, x + (kind % 2 ? -10 : 10), y + 22, 7, '#3a2a30', 0);
    A_.circle(c, x + (kind % 2 ? -12 : 12), y + 21, 1.6, ['#ffd25e', '#7fe0d0', '#f08ae0', '#ff8a4a'][kind], 0);
    for (let i = 0; i <= 5; i++) A_.line(c, x - r + i * 2 * r / 5, y, x - r + i * 2 * r / 5, y + 44, 1.6, '#17121a');
    A_.poly(c, [[x - r - 3, y - 3], [x + r + 3, y - 3], [x + r + 3, y + 2], [x - r - 3, y + 2]], '#3d3f48', 1.3);
    A_.poly(c, [[x - r - 3, y + 42], [x + r + 3, y + 42], [x + r + 3, y + 47], [x - r - 3, y + 47]], '#3d3f48', 1.3);
  };

  let current = null;
  HH.drawScene = function (c, view, look) {
    if (current && current !== look) HH.forget('scene' + current);
    current = look;
    const b = HH.bake('scene' + look, W0, H0, OX, OY, cc => LOOKS[look](cc));
    c.drawImage(b.cv, -OX, -OY, W0, H0);
  };
  HH.lookOf = stage => stage.look || 'row';
})();
