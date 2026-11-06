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
    hekka: villain('Captain Hekka', '#c8ccd2', 'hekka'),
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
