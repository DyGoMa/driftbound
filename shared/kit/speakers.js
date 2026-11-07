// Kit speakers: who can talk in a scene, their name colour and portrait.
// Crew use their homepage pictures. Everyone else is drawn in code until a picture exists: people as a bust, partners as their bond mark.
// To add one from a game: Kit.speakers.add('deckhand', { name: 'Deckhand', colour: '#c05a22', person: 'trooper' }).
(function () {
  const crew = (name, colour, id) => ({ name, colour, img: 'art/site/crew/' + id + '-v2-small.webp', person: id });   // 216 px copies of the homepage pictures, stepped down so small portraits stay clean
  const partner = (name, colour, mark) => ({ name, colour, mark });
  const villain = (name, colour, person) => ({ name, colour, person });

  // Silt from the front, if his picture can't load: the mask with its one centred slit, messy hair, a standing collar, as on his sheet.
  function siltFace(c, s) {
    const A = Kit.art;
    c.save(); c.scale(s / 100, s / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    A.poly(c, [[6, 100], [14, 82], [36, 72], [64, 72], [86, 82], [94, 100]], '#1c1c25', 1.6);          // shoulders
    A.poly(c, [[43, 100], [38, 72], [50, 66], [62, 72], [57, 100]], '#0f0f15', 0);                      // the shirt where the coat falls open
    A.poly(c, [[36, 72], [34, 60], [44, 66], [46, 84]], '#26262f', 1.3); A.poly(c, [[64, 72], [66, 60], [56, 66], [54, 84]], '#26262f', 1.3);   // collar
    A.poly(c, [[44, 62], [56, 62], [56, 70], [50, 74], [44, 70]], '#a8927f', 1);                        // neck
    A.poly(c, [[26, 44], [20, 36], [26, 30], [22, 20], [31, 20], [32, 10], [41, 14], [47, 4], [54, 12], [63, 7], [66, 17], [76, 18], [73, 28], [80, 36], [74, 45], [70, 54], [30, 54]], '#14141b', 1.6);   // hair
    A.blob(c, [[50, 12], [66, 16], [71, 32], [68, 48], [50, 66, 1], [32, 48], [29, 32], [34, 16]], '#f2f1ec', 1.8);   // mask
    A.poly(c, [[50, 66], [68, 48], [70, 38], [62, 50]], '#c9c8c6', 0);
    A.blob(c, [[50, 12], [66, 16], [71, 32], [68, 48], [50, 66, 1], [32, 48], [29, 32], [34, 16]], null, 1.8);
    A.poly(c, [[41, 30], [59, 30], [59, 33], [41, 33]], '#0f0f15', 0);                                  // the one eye slit
    c.restore();
  }

  // Hekka from the front, per hekka-sheet-v6.png, until a picture exists: swept-back wavy black hair, grey chest plate with the black bar and white ring, white collar.
  function hekkaFace(c, s) {
    const A = Kit.art, SK = '#b07d58', SK_D = '#8d5f42', HAIR = '#16151b', HAIR_L = '#2b2a33', G = '#70727a', G_L = '#878992', D = '#33343b';
    c.save(); c.scale(s / 100, s / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    const curl = (x, y, dx, n, step) => {   // one thick wave of hair, swinging side to side as it falls
      c.beginPath(); c.moveTo(x, y);
      for (let i = 0; i < n; i++) c.quadraticCurveTo(x + (i % 2 ? -dx : dx), y + step * (i + 0.5), x, y + step * (i + 1));
      c.lineWidth = 1.3; c.lineCap = 'round'; c.strokeStyle = HAIR_L; c.stroke();
    };
    A.blob(c, [[50, 3], [66, 5], [77, 12], [83, 25], [79, 34], [88, 44], [83, 54], [93, 65], [85, 74], [88, 82], [70, 80], [30, 80], [12, 82], [15, 74], [7, 65], [17, 54], [12, 44], [21, 34], [17, 25], [23, 12], [34, 5]], HAIR, 1.6);   // the hair behind: thick waves to the shoulders, stepping out on each side
    for (const q of [[22, 34, 5, 3, 13], [78, 34, -5, 3, 13], [14, 50, 4, 2, 13], [86, 50, -4, 2, 13], [29, 56, 4, 2, 10], [71, 56, -4, 2, 10]]) curl(q[0], q[1], q[2], q[3], q[4]);
    A.poly(c, [[0, 100], [3, 84], [18, 76], [82, 76], [97, 84], [100, 100]], D, 1.6);                     // dark cloth on the upper arms
    A.poly(c, [[3, 88], [8, 76], [24, 73], [26, 89], [14, 94]], G, 1.5); A.poly(c, [[97, 88], [92, 76], [76, 73], [74, 89], [86, 94]], G, 1.5);   // shoulder plates
    A.poly(c, [[8, 76], [24, 73], [24, 79], [8, 81]], G_L, 0); A.poly(c, [[92, 76], [76, 73], [76, 79], [92, 81]], G_L, 0);
    A.poly(c, [[24, 100], [26, 75], [40, 70], [60, 70], [74, 75], [76, 100]], G, 1.6);                    // the chest plate
    A.poly(c, [[40, 70], [60, 70], [64, 76], [36, 76]], G_L, 0);
    A.poly(c, [[43, 72], [41, 63], [50, 66], [59, 63], [57, 72], [50, 75]], '#f1f2f0', 1.3);              // white collar
    A.poly(c, [[45, 66], [55, 66], [55, 56], [45, 56]], SK_D, 1);                                         // neck
    A.blob(c, [[50, 16], [64, 21], [67, 36], [64, 50], [50, 62, 1], [36, 50], [33, 36], [36, 21]], SK, 1.7);   // a long adult face, strong jaw
    A.poly(c, [[50, 62], [64, 50], [67, 38], [67, 26], [61, 28], [62, 42], [57, 52]], SK_D, 0);           // the one shadow tone, down the cheek and jaw
    A.poly(c, [[36, 25], [64, 25], [66, 30], [60, 26], [50, 24], [40, 26], [34, 30]], SK_D, 0);           // and under the hairline
    A.blob(c, [[50, 7], [64, 9], [73, 18], [74, 32], [71, 44], [67, 49], [68, 34], [62, 23], [50, 19, 1], [38, 23], [32, 34], [33, 49], [29, 44], [26, 32], [27, 18], [36, 9]], HAIR, 1.3);   // hair swept back off the brow, with a lock down each temple
    for (const q of [[50, 18, 50, 7, 52, 12], [44, 19, 37, 9, 40, 13], [56, 19, 63, 9, 60, 13], [37, 24, 29, 15, 32, 18], [63, 24, 71, 15, 68, 18], [31, 31, 29, 42, 28, 36], [69, 31, 71, 42, 72, 36]]) {   // the strands, combed back
      c.beginPath(); c.moveTo(q[0], q[1]); c.quadraticCurveTo(q[4], q[5], q[2], q[3]); c.lineWidth = 1.1; c.lineCap = 'round'; c.strokeStyle = HAIR_L; c.stroke();
    }
    for (const k of [-1, 1]) {
      A.poly(c, [[50 + k * 4, 33], [50 + k * 15, 28], [50 + k * 15.5, 30.5], [50 + k * 5, 36]], HAIR, 0);   // heavy brows, angled down to the nose
      A.poly(c, [[50 + k * 5, 38.5], [50 + k * 9, 35.8], [50 + k * 14, 35.5], [50 + k * 14.5, 37.5], [50 + k * 10, 40], [50 + k * 6.5, 40]], '#eef1f3', 0.6);   // narrow eyes
      A.circle(c, 50 + k * 9.6, 37.6, 2.3, '#5d7180', 0.5);
      A.circle(c, 50 + k * 9.6, 37.6, 1.05, A.INK, 0);
      A.circle(c, 50 + k * 9.2, 36.9, 0.5, '#ffffff', 0);
      A.poly(c, [[50 + k * 4.5, 39], [50 + k * 9, 35], [50 + k * 15, 34.6], [50 + k * 15, 35.9], [50 + k * 9, 36.3], [50 + k * 5, 39.6]], A.INK, 0);   // the upper lid, thick and straight
      A.line(c, 50 + k * 7, 41.6, 50 + k * 12, 41.4, 0.6, SK_D);                                          // the crease under it: an adult's eyes
    }
    A.poly(c, [[52, 36], [54, 45.5], [51.5, 47.5], [49, 47.5], [51, 45]], SK_D, 0);                        // the nose: its shadow side, not an outline
    A.line(c, 47.5, 47.6, 52.5, 47.6, 0.8, '#6e4530');
    A.poly(c, [[43.5, 53], [47.5, 51.6], [50, 52.3], [52.5, 51.6], [56.5, 53], [50, 53.6]], '#7c4438', 0.5);   // lips: flat and unimpressed
    A.poly(c, [[45, 53.4], [55, 53.4], [52.5, 55.6], [47.5, 55.6]], '#99594a', 0.5);
    A.line(c, 47, 58, 53, 58, 0.7, SK_D);
    A.poly(c, [[26, 80], [74, 80], [74, 86], [26, 86]], '#0f0f15', 0);                                     // the black bar
    c.beginPath(); c.arc(50, 83, 8, 0, 6.283); c.lineWidth = 2.6; c.strokeStyle = '#f1f2f0'; c.stroke();   // and the white ring, cut by the bar
    A.poly(c, [[38, 80], [62, 80], [62, 86], [38, 86]], '#0f0f15', 0);
    c.restore();
  }

  const S = Kit.speakers = {
    kaito: crew('Kaito', '#f2d21b', 'kaito'),
    sela: crew('Sela', '#35c4cc', 'sela'),
    juno: crew('Juno', '#ef6a1f', 'juno'),
    silas: crew('Silas', '#a78bf0', 'silas'),
    bram: crew('Bram', '#d08a52', 'bram'),
    ione: crew('Ione', '#8fd3f0', 'ione'),
    skarn: partner('Skarn', '#f2d21b', 'fork'),
    vesh: partner('Vesh', '#35c4cc', 'spiral'),
    ashka: partner('Ashka', '#ef6a1f', 'feather'),
    hush: partner('Hush', '#a78bf0', 'lines'),
    grist: partner('Grist', '#d08a52', 'anvil'),
    prism: partner('Prism', '#8fd3f0', 'hexagon'),
    vasch: villain('Director Vasch', '#e9edf0', 'vasch'),
    hekka: Object.assign(villain('Captain Hekka', '#c8ccd2', 'hekka'), { paint: hekkaFace }),
    silt: Object.assign(villain('Silt', '#c8ccd2', 'silt'), { img: 'art/site/villains/silt-v1-small.webp', paint: siltFace }),   // cut from silt-sheet-v1.png
    krell: villain('Warden Krell', '#c8ccd2', 'krell'),
    maro: villain('Ledger Maro', '#c98ac0', 'maro'),
    trooper: villain('Sever trooper', '#9aa0a8', 'trooper'),
  };
  Object.defineProperty(S, 'add', { enumerable: false, value(id, spec) { S[id] = spec; } });

  // The bond marks from CAST.md, for partners' portraits.
  function mark(c, kind, s, col) {
    const A = Kit.art, lw = s * 0.05;
    c.save(); c.translate(s / 2, s / 2); c.scale(s / 100, s / 100);
    if (kind === 'fork') A.poly(c, [[-6, -34], [10, -34], [2, -10], [20, -10], [10, 6], [24, 6], [-8, 36], [0, 10], [-16, 10], [-4, -6], [-18, -6]], col, lw * 100 / s);
    else if (kind === 'spiral') {
      c.beginPath();
      for (let i = 0; i <= 60; i++) { const a = i * 0.28, r = 34 - i * 0.5; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
      c.lineWidth = 7; c.strokeStyle = col; c.lineCap = 'round'; c.stroke();
    } else if (kind === 'feather') A.poly(c, [[0, -36], [18, -10], [14, 12], [4, 24], [2, 36], [-2, 36], [-4, 24], [-14, 12], [-18, -10]], col, lw * 100 / s);
    else if (kind === 'lines') { [-20, 0, 20].forEach(y => A.poly(c, [[-26, y + 5], [14, y - 8], [26, y - 5], [-14, y + 8]], col, lw * 100 / s)); }
    else if (kind === 'anvil') A.poly(c, [[-30, -22], [30, -22], [14, -6], [10, 8], [24, 24], [-24, 24], [-10, 8], [-14, -6]], col, lw * 100 / s);
    else if (kind === 'hexagon') {
      A.poly(c, [[-28, -16], [0, -32], [28, -16], [28, 16], [0, 32], [-28, 16]], null, 0);
      c.lineWidth = 7; c.strokeStyle = col; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(4, -30); c.lineTo(28, -16); c.lineTo(28, 16); c.lineTo(0, 32); c.lineTo(-28, 16); c.lineTo(-28, -16); c.lineTo(-8, -28); c.stroke();
      c.lineWidth = 4; c.beginPath(); c.moveTo(-2, -30); c.lineTo(4, -12); c.lineTo(-6, 0); c.lineTo(2, 12); c.stroke();
    }
    c.restore();
  }

  function codePortrait(sp, id) {
    const size = 144, cv = document.createElement('canvas');
    cv.width = cv.height = size;
    cv.className = 'kit-portrait';
    const c = cv.getContext('2d');
    if (sp.paint) sp.paint(c, size);
    else if (sp.person) Kit.art.bust(c, sp.person, size);
    else {
      c.fillStyle = '#1f2650'; c.fillRect(0, 0, size, size);
      if (sp.mark) mark(c, sp.mark, size, sp.colour);
      else Kit.art.text(c, (sp.name || id || '?').charAt(0), size / 2, size / 2, { size: 70, color: sp.colour, align: 'center' });
    }
    cv.setAttribute('aria-hidden', 'true');
    return cv;
  }

  // Portrait element for any speaker: their picture if there is one and it loads, otherwise code art. Never fails.
  Kit.portraitEl = function (who) {
    const sp = S[who] || { name: who, colour: '#f4c152' };
    if (!sp.img) return codePortrait(sp, who);
    const img = new Image();
    img.className = 'kit-portrait'; img.alt = '';
    img.onerror = () => { if (img.parentNode) img.replaceWith(codePortrait(sp, who)); };
    img.src = sp.img.includes('//') ? sp.img : Kit.url(sp.img);
    return img;
  };
  Kit.speakerName = who => (S[who] ? S[who].name : who);
  Kit.speakerColour = who => (S[who] ? S[who].colour : '#f4c152');
})();
