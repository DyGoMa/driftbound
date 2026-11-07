// Hold the Deck: the talk portraits. The Sever trooper, from the front per trooper-sheet-v1.png: art/trooper-portrait.webp, and this code face if it won't load. Captain Hekka: art/hekka-portrait.webp. Through Kit.speakers.add, so the kit and the other games keep theirs.
(function () {
  function trooperFace(c, s) {
    const A = Kit.art, COAT = '#6f7076', COAT_D = '#55565c', HELM = '#74757b', HELM_D = '#5b5c62', HELM_L = '#8a8b91', SK = '#b58a66', SK_D = '#92694b', WHITE = '#f1f2f0', BLACK = '#0f0f15';
    c.save(); c.scale(s / 100, s / 100);
    c.fillStyle = '#1f2650'; c.fillRect(0, 0, 100, 100);
    A.poly(c, [[2, 100], [8, 80], [32, 68], [68, 68], [92, 80], [98, 100]], COAT, 1.7);                  // the coat's shoulders
    A.poly(c, [[64, 68], [92, 80], [98, 100], [70, 100]], COAT_D, 0);                                     // the one shadow tone
    A.poly(c, [[2, 100], [8, 80], [32, 68], [68, 68], [92, 80], [98, 100]], null, 1.7);
    A.line(c, 50, 70, 50, 100, 1.1, A.INK);                                                               // the closed front
    A.poly(c, [[43, 64], [57, 64], [57, 72], [43, 72]], SK_D, 1.1);                                       // neck
    A.poly(c, [[37, 72], [38, 62], [50, 67], [62, 62], [63, 72], [50, 76]], WHITE, 1.5);                  // white collar
    A.blob(c, [[30, 36], [70, 36], [68, 52], [60, 62], [50, 65, 1], [40, 62], [32, 52]], SK, 1.7);        // the jaw, all that shows of his face
    A.poly(c, [[50, 65], [60, 62], [68, 52], [69, 44], [60, 52]], SK_D, 0);
    A.line(c, 43, 56, 57, 56, 1.3, '#5a2f2c');                                                            // a flat mouth
    A.line(c, 49, 47, 48, 51, 0.9, SK_D); A.line(c, 48, 51, 51, 51.5, 0.9, SK_D);                         // nose
    A.blob(c, [[50, 6], [68, 11], [77, 26], [78, 44], [70, 46], [70, 34], [30, 34], [30, 46], [22, 44], [23, 26], [32, 11]], HELM, 1.8);   // helmet
    A.poly(c, [[50, 6], [68, 11], [77, 26], [78, 44], [70, 46], [66, 24], [50, 17]], HELM_D, 0);
    A.poly(c, [[36, 12], [50, 9], [50, 14], [38, 18]], HELM_L, 0);
    A.blob(c, [[50, 6], [68, 11], [77, 26], [78, 44], [70, 46], [70, 34], [30, 34], [30, 46], [22, 44], [23, 26], [32, 11]], null, 1.8);
    A.line(c, 50, 6, 50, 27, 1, A.INK); A.line(c, 30, 15, 50, 21, 0.9, A.INK); A.line(c, 70, 15, 50, 21, 0.9, A.INK);   // plate seams, as on the sheet
    A.poly(c, [[27, 28], [73, 28], [71, 41], [29, 41]], BLACK, 1.2);                                      // the black visor
    A.poly(c, [[20, 87], [80, 87], [80, 94], [20, 94]], BLACK, 0);                                        // the flat black bar
    c.beginPath(); c.arc(50, 90.5, 9, 0, 6.283); c.lineWidth = 2.8; c.strokeStyle = WHITE; c.stroke();    // and the white ring at its centre, cut by the bar
    A.poly(c, [[36, 87], [64, 87], [64, 94], [36, 94]], BLACK, 0);
    c.restore();
  }
  Kit.speakers.add('trooper', Object.assign({}, Kit.speakers.trooper, { img: 'games/hold-the-deck/art/trooper-portrait.webp', paint: trooperFace }));   // the code face stays as the fallback if the picture fails
  // Hekka: the same picture of her that Tide Gap shows, cut to match hekka-sheet-v6.png. A copy, so the two games don't tie to each other's folders. The kit's code face is the fallback.
  Kit.speakers.add('hekka', Object.assign({}, Kit.speakers.hekka, { img: 'games/hold-the-deck/art/hekka-portrait.webp' }));
})();
