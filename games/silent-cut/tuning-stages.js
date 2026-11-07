// Silent Cut layouts. Every number in this file is PROVISIONAL. Px along the street; each chunk's x's count from where the chunk starts.
// A chunk's lists: cover { x, w, kind }, lantern { x, r }, sweep { a, b, r, v, dwell, ph }, flood { a, b }, crane { a, b, v, w, gap }, trooper { a, b, v, dir, at }, boards { a, b }, coin [x, ...].
// A stage is chunks in a row. "fast" speeds searchlights, cranes and troopers; "alert" speeds the meter's filling. What changes from stage to stage is in the comments.
window.TUNE_STAGES = {
  chunks: {
    // Stage 1's lessons, one at a time
    firstLantern: { len: 500, cover: [{ x: 50, w: 84, kind: 'crates' }, { x: 440, w: 84, kind: 'barrels' }], lantern: [{ x: 300, r: 46 }], coin: [300] },
    beam: { len: 560, cover: [{ x: 40, w: 84, kind: 'tarp' }, { x: 280, w: 84, kind: 'crates' }, { x: 500, w: 84, kind: 'barrels' }], sweep: [{ a: 130, b: 440, r: 58, v: 125, dwell: 0.5 }], coin: [200, 390] },
    walker: { len: 620, cover: [{ x: 40, w: 84, kind: 'door' }, { x: 300, w: 84, kind: 'sacks' }, { x: 560, w: 84, kind: 'crates' }], trooper: [{ a: 150, b: 470, v: 40, dir: 1, at: 170 }], coin: [430] },
    twoLanterns: { len: 520, cover: [{ x: 40, w: 84, kind: 'barrels' }, { x: 460, w: 84, kind: 'tarp' }], lantern: [{ x: 190, r: 48 }, { x: 310, r: 48 }], coin: [250] },

    // Stage 2: cut your own dark, and Surge what you can't cut
    floodGate: { len: 400, cover: [{ x: 60, w: 84, kind: 'crates' }, { x: 340, w: 84, kind: 'door' }], flood: [{ a: 130, b: 280 }], coin: [205] },
    longGate: { len: 540, cover: [{ x: 50, w: 84, kind: 'sacks' }, { x: 480, w: 84, kind: 'door' }], flood: [{ a: 130, b: 400 }], coin: [265] },   // too wide for one dash: two Surges back to back, so the chest has to be ready for it
    oilRow: { len: 760, cover: [{ x: 40, w: 84, kind: 'door' }, { x: 340, w: 84, kind: 'barrels' }, { x: 700, w: 84, kind: 'door' }], lantern: [{ x: 160, r: 44 }, { x: 250, r: 44 }, { x: 440, r: 44 }, { x: 530, r: 44 }, { x: 620, r: 44 }], trooper: [{ a: 420, b: 640, v: 42, dir: -1, at: 600 }], coin: [250, 530] },
    crossfire: { len: 700, cover: [{ x: 40, w: 84, kind: 'sacks' }, { x: 240, w: 84, kind: 'crates' }, { x: 440, w: 84, kind: 'barrels' }, { x: 640, w: 84, kind: 'tarp' }], sweep: [{ a: 110, b: 400, r: 60, v: 135, dwell: 0.45 }, { a: 300, b: 590, r: 60, v: 115, dwell: 0.45, ph: 1.4 }], coin: [340, 540] },
    gateGuard: { len: 660, cover: [{ x: 40, w: 84, kind: 'crates' }, { x: 300, w: 84, kind: 'tarp' }, { x: 600, w: 84, kind: 'door' }], flood: [{ a: 110, b: 250 }], trooper: [{ a: 360, b: 540, v: 44, dir: 1, at: 380 }], coin: [180, 470] },

    // Stage 3: the crates' shadows cross a floodlit yard, and you keep pace under one
    crane: { len: 700, cover: [{ x: 40, w: 84, kind: 'crates' }, { x: 640, w: 84, kind: 'tarp' }], flood: [{ a: 100, b: 580 }], crane: [{ a: 100, b: 580, v: 72, w: 128, gap: 370 }], coin: [240, 440] },
    craneRest: { len: 760, cover: [{ x: 40, w: 84, kind: 'sacks' }, { x: 350, w: 84, kind: 'crates' }, { x: 700, w: 84, kind: 'door' }], flood: [{ a: 100, b: 290 }, { a: 410, b: 640 }], crane: [{ a: 100, b: 640, v: 72, w: 120, gap: 330 }], coin: [200, 520] },
    craneGuard: { len: 780, cover: [{ x: 40, w: 84, kind: 'tarp' }, { x: 500, w: 84, kind: 'crates' }, { x: 720, w: 84, kind: 'barrels' }], flood: [{ a: 100, b: 360 }], crane: [{ a: 100, b: 360, v: 72, w: 124, gap: 320 }], trooper: [{ a: 430, b: 640, v: 44, dir: 1, at: 450 }], coin: [230, 560] },

    // Stage 4: the boards tell on you, and a sound can pull a trooper's back toward you
    boards: { len: 660, cover: [{ x: 40, w: 84, kind: 'barrels' }, { x: 320, w: 84, kind: 'crates' }, { x: 600, w: 84, kind: 'door' }], boards: [{ a: 90, b: 550 }], trooper: [{ a: 240, b: 520, v: 44, dir: -1, at: 500 }], coin: [190, 450] },
    boardsPair: { len: 800, cover: [{ x: 40, w: 84, kind: 'sacks' }, { x: 300, w: 84, kind: 'tarp' }, { x: 520, w: 84, kind: 'crates' }, { x: 740, w: 84, kind: 'door' }], boards: [{ a: 100, b: 680 }], trooper: [{ a: 170, b: 420, v: 44, dir: 1, at: 230 }, { a: 450, b: 680, v: 46, dir: -1, at: 640 }], lantern: [{ x: 410, r: 42 }], coin: [400, 610] },
    boardsBeam: { len: 760, cover: [{ x: 40, w: 84, kind: 'crates' }, { x: 290, w: 84, kind: 'barrels' }, { x: 520, w: 84, kind: 'tarp' }, { x: 700, w: 84, kind: 'crates' }], boards: [{ a: 340, b: 480 }], sweep: [{ a: 100, b: 470, r: 62, v: 140, dwell: 0.4 }], lantern: [{ x: 620, r: 44 }], trooper: [{ a: 350, b: 640, v: 46, dir: 1, at: 400 }], coin: [175, 610] },
  },

  // Start at x = 30; each stage ends at a door a little past its last chunk.
  stages: [
    // radioAt: how far along the street, 0 to 1, each of the stage's radio lines in words.js comes in. A question and its answer sit close, and the answer waits its turn if someone's talking.
    { seq: ['firstLantern', 'beam', 'walker', 'twoLanterns', 'floodGate'], radioAt: [0.42, 0.5, 0.8], fast: 1, alert: 1, lineV: 11, par: 50, clearSalvage: 10, theme: 0,   // about 2600 px. Easy: one idea at a time, ending on one Surge so the breath panel means something from the start
      tips: [{ x: 0, key: 'hold' }, { x: 170, key: 'cut' }, { x: 500, key: 'beam' }, { x: 1060, key: 'strike' }, { x: 1690, key: 'two' }, { x: 2210, key: 'flood' }] },
    { seq: ['twoLanterns', 'floodGate', 'oilRow', 'crossfire', 'gateGuard', 'longGate'], radioAt: [0.3, 0.33], fast: 1.04, alert: 1.12, lineV: 14, par: 80, clearSalvage: 13, theme: 1,   // about 3580 px. Surge gets dear
      tips: [{ x: 540, key: 'floodAgain' }, { x: 900, key: 'row' }, { x: 3050, key: 'longGate' }] },
    { seq: ['crane', 'gateGuard', 'floodGate', 'craneRest', 'crossfire', 'longGate', 'craneGuard'], radioAt: [0.35, 0.38], fast: 1.06, alert: 1.22, lineV: 16, par: 100, clearSalvage: 15, theme: 2,   // about 4540 px. The moving shadow, and gates that eat the chest it needs
      tips: [{ x: 60, key: 'crane' }, { x: 1770, key: 'windedCrane' }, { x: 3120, key: 'longGate' }] },
    { seq: ['boards', 'floodGate', 'crossfire', 'boardsPair', 'longGate', 'craneRest', 'boardsBeam'], radioAt: [0.25, 0.75], fast: 1.1, alert: 1.34, lineV: 18, par: 115, clearSalvage: 18, theme: 3,   // about 4620 px. Everything, on boards that creak
      tips: [{ x: 60, key: 'boards' }, { x: 1800, key: 'lure' }, { x: 2460, key: 'longGate' }] },
    { boss: true, fast: 1.1, alert: 1.55, lineV: 16, par: 90, clearSalvage: 14, theme: 4, tips: [{ x: 40, key: 'maro' }] },
  ],

  // Maro's lamplit warehouse: three bays in a row, with a floodlit loading gate between them. He stands at each desk's x until cut, then runs to the next. Layout counts from the street's start.
  boss: {
    desks: [640, 1320, 2020],
    flood: [{ a: 680, b: 770 }, { a: 1360, b: 1450 }],
    sweepPhase: 4,   // the room beams start somewhere within this many seconds of their swing
    cover: [
      { x: 90, w: 84, kind: 'ledgers' }, { x: 280, w: 84, kind: 'sacks' }, { x: 450, w: 84, kind: 'ledgers' },
      { x: 780, w: 84, kind: 'ledgers' }, { x: 960, w: 84, kind: 'crates' }, { x: 1130, w: 84, kind: 'ledgers' },
      { x: 1460, w: 84, kind: 'crates' }, { x: 1650, w: 84, kind: 'ledgers' }, { x: 1830, w: 84, kind: 'sacks' },
    ],
    lantern: [{ x: 870, r: 42 }, { x: 1050, r: 42 }, { x: 1555, r: 42 }],
    trooper: [{ a: 760, b: 1120, v: 42, dir: -1, at: 1040 }, { a: 1450, b: 1650, v: 44, dir: 1, at: 1500 }, { a: 1700, b: 1900, v: 44, dir: -1, at: 1860 }],
    sweep: [{ a: 760, b: 1180, r: 50, v: 115, dwell: 0.5 }],
    coin: [200, 400, 900, 1080, 1560, 1760],
  },

  // Endless: random chunks from this list, getting quicker as the lamp line closes.
  endless: { pool: ['beam', 'walker', 'twoLanterns', 'floodGate', 'oilRow', 'crossfire', 'gateGuard', 'crane', 'craneRest', 'craneGuard', 'boards', 'boardsPair', 'boardsBeam'], lineV: 18, lineRamp: 0.2, lineMax: 80, leadMin: 480, leadShrink: 1.2, fast: 1, fastRamp: 0.0015, fastMax: 1.35, alert: 1.2, alertRamp: 0.002, alertMax: 1.5, theme: 3, buildAhead: 1400, forgetBehind: 1000 },   // buildAhead, forgetBehind: px of street kept made ahead of him, and kept behind him
};
