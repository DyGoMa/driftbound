// Kit cast: how each person looks when drawn in code. From CAST.md and the villain sheet notes there.
// Krell (age 41) and Ledger Maro (age 52) are new (docs/FRIDAY_BATCH.md); their looks and ages are Claude's calls. cm = height from CAST.md (Silt, Krell, Maro: Claude's calls).
(function () {
  const A = Kit.art;
  const Bm = { shoulder: 9.5, chest: 8, waist: 6.6, hip: 7, leg: 1, arm: 1 };                 // lean men
  const Bw = { shoulder: 8, chest: 7.6, waist: 5.4, hip: 7.2, leg: 0.98, arm: 0.86 };         // women
  const coat = '#7a8088', coatDark = '#5d6269';

  A.cast = {
    // Kaito (kaito-sheet-v8.png): he faces right on screen, so we see his right side: gauntlet arm, white lock, no eyebrow scar (that's on his left).
    kaito: { cm: 178, build: { shoulder: 9.8, chest: 8.6, waist: 6.8, hip: 7.2, leg: 1.08, arm: 1.18, neck: 1.2, head: 0.84 }, colour: '#f2d21b', skin: '#e4b48a', eye: '#c98a1e', brow: -0.5,
      hair: { style: 'shaggy', color: '#17161f', streak: '#f2f0ea' }, goggles: '#b98d3a',
      top: '#1b1c24', topTo: -4, collarTall: '#1b1c24', zip: '#9aa0a8', upper: '#e4b48a', lower: '#e4b48a', hand: '#e4b48a', pants: '#5f6368', thigh: '#5f6368', shin: '#5f6368', baggy: true, cargo: true,
      boot: '#6b4630', bootTop: 0.62, laces: '#c9b48a', waistJacket: '#b3262a', gauntlet: '#8d9199', scarColor: '#f6d98a', markColor: '#f2d21b' },
    sela: { cm: 175, build: Bw, colour: '#1f9aa3', skin: '#7a4a2e', eye: '#3aa890', earring: '#d9a93a',
      hair: { style: 'ponytail', color: '#b7cfe0' }, top: '#1d2f6a', topTo: -19, collar: '#1d2f6a', hipsFrom: -6, pants: '#17406a',
      upper: '#1d2f6a', lower: '#1d2f6a', hand: '#7a4a2e', thigh: '#7a4a2e', shin: '#7a4a2e', boot: '#6a4526', bootTop: 0.6,
      tail: { color: '#17406a', len: 22 }, markAt: 'chest', markY: -26, markColor: '#35d0d8' },
    juno: { cm: 165, build: Object.assign({}, Bw, { hip: 7.6, leg: 1.02 }), colour: '#ef6a1f', skin: '#dba475', eye: '#3fa04a', smile: 0.5,
      hair: { style: 'braid', color: '#c9581f' }, top: '#f2ece0', topTo: -17, jacket: { color: '#5a6b3e', to: -6, gap: -3 }, hipsFrom: -6, pants: '#3d5f8e',
      upper: '#5a6b3e', lower: '#5a6b3e', hand: '#2a2420', thigh: '#dba475', shin: '#4a3020', boot: '#4a3020', markAt: 'chest', markY: -28, markColor: '#ff8a2a' },
    silas: { cm: 183, build: Object.assign({}, Bm, { shoulder: 8.6, waist: 5.8, hip: 6.2 }), colour: '#7a4fc0', skin: '#ecd3c1', eye: '#7a4fc0', mole: true, neckMark: true, markColor: '#a78bf0',
      hair: { style: 'lowtie', color: '#17505a' }, top: '#efeae0', topTo: -6, collar: '#efeae0', sash: '#b02a2a', pants: '#191a22', hipsFrom: -5,
      upper: '#efeae0', lower: '#d9c2b0', hand: '#ecd3c1', thigh: '#191a22', shin: '#191a22', boot: '#2c2428' },
    bram: { cm: 198, build: { shoulder: 12.5, chest: 11, waist: 10, hip: 9, leg: 1.28, arm: 1.42, neck: 1.5 }, colour: '#7b828e', skin: '#b28054', eye: '#4a2c16',
      beard: '#15131a', upper: '#b28054', lower: '#b28054', hand: '#b28054',
      armFar: { upper: '#7a7f88', lower: '#7a7f88' }, top: '#b28054', topTo: -18, bib: '#5a3a22', strap: '#5a3a22', hipsFrom: -6, pants: '#5a3a22', belt: '#2d2118', beltAt: -5,
      thigh: '#5a3a22', shin: '#5a3a22', boot: '#2d2118', bootTop: 0.5 },
    ione: { cm: 168, build: Bw, colour: '#8fd3f0', skin: '#eadbcd', eye: '#6f7b86', glasses: true,
      hair: { style: 'bob', color: '#14141c', streak: '#eaf4fa' }, top: '#17171f', topTo: -16, jacket: { color: '#eef0ee', to: -1, gap: -2 }, hipsFrom: -8, pants: '#2b2f3e', belt: '#7c6a3e', beltAt: -8,
      upper: '#eef0ee', lower: '#eadbcd', hand: '#eadbcd', thigh: '#25252f', shin: '#25252f', boot: '#191a22', bootTop: 0.5,
      tail: { color: '#eef0ee', len: 20 } },

    trooper: { cm: 180, build: Bm, colour: coat, skin: '#c99f7d', helmet: '#6b7178',
      top: coat, topTo: 2, collar: '#efefe8', bar: true, belt: '#17181f', beltAt: -8, pants: coat, hipsFrom: -5,
      upper: coat, lower: coat, hand: '#17181f', thigh: '#3e4149', shin: '#3e4149', boot: '#17181f', bootTop: 0.55, tail: { color: coat, len: 21, closed: true }, blade: true },
    krell: { cm: 195, build: { shoulder: 13.5, chest: 11, waist: 9, hip: 8.6, leg: 1.22, arm: 1.34, neck: 1.5 }, colour: '#9aa0a8', skin: '#b9906e', eye: '#2a2a33', brow: -0.8,
      helmet: '#4e535b', visor: false, top: coatDark, topTo: 2, collar: '#efefe8', bar: true, belt: '#17181f', beltAt: -8, pants: coatDark, hipsFrom: -5,
      upper: '#8c929a', lower: coatDark, hand: '#17181f', thigh: '#34373f', shin: '#8c929a', boot: '#17181f', bootTop: 0.45, tail: { color: coatDark, len: 16 } },
    vasch: { cm: 188, build: Object.assign({}, Bm, { shoulder: 8.4, chest: 7, waist: 5.6, hip: 6 }), colour: '#e9edf0', skin: '#e6d6c8', eye: '#a7adb5', smile: 0.5,
      hair: { style: 'combed', color: '#8c9096' }, top: '#eef0f2', topTo: 2, collar: '#ffffff', bar: true, ring: '#17181f', belt: '#17181f', beltAt: -8, pants: '#eef0f2', hipsFrom: -5,
      upper: '#eef0f2', lower: '#eef0f2', armNear: { lower: '#a9d8e2', hand: '#a2a6ad' }, armFar: { lower: '#17181f', hand: '#17181f' }, hand: '#17181f',
      thigh: '#44474f', shin: '#44474f', boot: '#17181f', tail: { color: '#eef0f2', len: 24, closed: true }, core: true },
    hekka: { cm: 193, build: { shoulder: 11, chest: 9, waist: 6.8, hip: 8, leg: 1.16, arm: 1.12, neck: 1.1 }, colour: '#7b828e', skin: '#b78a64', eye: '#2a2230',
      hair: { style: 'wavy', color: '#131219' }, top: '#858b92', topTo: -18, collar: '#efefe8', bar: true, barAt: -26, hipsFrom: -6, pants: '#3a3d45', belt: '#17181f', beltAt: -6,
      upper: '#3a3d45', lower: '#858b92', hand: '#17181f', thigh: '#3a3d45', shin: '#858b92', boot: '#17181f', bootTop: 0.72 },
    // Silt (silt-sheet-v1.png): messy black hair above a strapped white mask, a long ragged coat past the knee, a hooked blade.
    silt: { cm: 175, build: Object.assign({}, Bm, { shoulder: 8.2, chest: 6.8, waist: 5.4, hip: 5.8, arm: 0.88, leg: 0.92 }), colour: '#4a4a5a', skin: '#c8b6a6', mask: '#f0f0ea',
      hair: { style: 'messy', color: '#15151c' }, top: '#20202a', topTo: 2, pants: '#20202a', hipsFrom: -5, collar: '#20202a', belt: '#0d0d13', beltAt: -9, blade: true,
      upper: '#20202a', lower: '#20202a', hand: '#15151c', thigh: '#3a3a46', shin: '#3a3a46', boot: '#15151c', bootTop: 0.5, tail: { color: '#20202a', len: 34, rag: true, closed: true } },
    maro: { cm: 172, build: { shoulder: 10, chest: 10, waist: 11, hip: 10, leg: 1.1, arm: 1.1, neck: 1.3 }, colour: '#7a3d6a', skin: '#d4a884', eye: '#2a2233', smile: 0.6,
      hair: { style: 'balding', color: '#3a342e' }, top: '#5e2f58', topTo: 2, collar: '#efefe8', pants: '#5e2f58', hipsFrom: -5, belt: '#c9a23c', beltAt: -9,
      upper: '#5e2f58', lower: '#5e2f58', hand: '#d4a884', thigh: '#2a2430', shin: '#2a2430', boot: '#17141c', tail: { color: '#5e2f58', len: 20 } },
  };
})();
