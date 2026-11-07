// Hold the Deck: the title. The Keelbreak picture, with Grist asleep on the slip and Bram beside him, in the room the menu leaves. If the picture can't load, the yard in code shows instead.
window.HD = window.HD || {};
(function () {
  const A = () => Kit.art;
  const BRAM_H = 106, GRIST_H_OF_BRAM = 0.92, MIN_ROOM = 64;   // looks only: Grist's picture lies low, so he's drawn nearly Bram's height for "the size of a truck" (CAST.md). Less room than this and neither is drawn

  // How much of the screen is left under the menu, in game units.
  function roomUnderMenu(view, ground) {
    const m = document.querySelector('#kit-ui .kit-menu');
    if (!m) return BRAM_H;
    return ground - Kit.toGame(0, m.getBoundingClientRect().bottom).y;
  }

  let pic = null;
  HD.titleDraw = function (c, view, t) {
    const A_ = A();
    if (!pic) { pic = new Image(); pic.src = Kit.url('art/site/keelbreak-v1-web.webp'); }
    if (pic.complete && pic.naturalWidth) {
      const W_ = view.right - view.left, H = view.bottom - view.top, s = Math.max(W_ / pic.naturalWidth, H / pic.naturalHeight);
      c.drawImage(pic, view.left + (W_ - pic.naturalWidth * s) / 2, view.top + (H - pic.naturalHeight * s) / 2, pic.naturalWidth * s, pic.naturalHeight * s);
    } else { HD.drawSky(c, view, 0); HD.drawDeck(c, 0); }
    const g = view.bottom - 12, mid = (view.left + view.right) / 2, room = roomUnderMenu(view, g) - 6;
    A_.poly(c, [[view.left, g - 6], [view.right, g - 6], [view.right, view.bottom], [view.left, view.bottom]], '#4a2f22', 2);
    if (room < MIN_ROOM) return;   // no figures at all is better than boots poking out from under a button
    const bh = Math.min(BRAM_H, room), k = bh / BRAM_H;
    HD.drawGristSide(c, mid + 46 * k, g - 4, (bh * GRIST_H_OF_BRAM) / 82, false, t);
    HD.drawBram(c, null, mid - 66 * k, g - 2, bh, { pose: 'idle', view: 'front', t, iron: 0 });
  };
})();
