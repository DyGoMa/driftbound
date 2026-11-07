// Tide Gap: the logbook on screen. Rows are drawn once and redrawn only when they change. The rest of the read-outs are in hud.js.
// The writing never shrinks below T.bookFontMinCss on the real screen: the rows grow instead. On a short screen the boss gets a strip of tabs, so the whole cutter shows.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const BOOK_Y = 42, BOOK_PAD = 5, SPINE = 15, SHORT_VIEW = 700, PAUSE_CSS = 52, STRIP_H = 24;
  const INK_BLUE = '#1f2f58', PAPER = '#eee2c4', PATCH = '#f5ecd2';
  let cache = null, cacheKey = '';
  TG.BOOK_Y = BOOK_Y;

  function font(size) { return `italic 700 ${size}px Barlow, system-ui, sans-serif`; }

  // Sizes for this screen. Everything here is logical px.
  TG.bookLayout = function (run, view) {
    const k = view.scale, size = Math.max(T.bookFont, T.bookFontMinCss / k), row = size * 1.13;
    const w = Math.max(350, Math.min(view.right - view.left - BOOK_PAD * 2, Math.max(350, size * 29)));
    const x = view.left < 0 && w > 350 ? view.left + BOOK_PAD : BOOK_PAD;
    const strip = !!run.boss && view.bottom - view.top < SHORT_VIEW, pauseLeft = view.right - PAUSE_CSS / k;
    const h = strip ? STRIP_H : 6 + row * T.bookRows + 3;
    // The boss's strip stops short of the pause button, so its sixth tab, the last line, is never under it.
    return { size, row, w: strip ? Math.min(w, pauseLeft - x - 3) : w, x, y: view.top + BOOK_Y, h, strip, pauseLeft, pauseBottom: view.top + PAUSE_CSS / k };
  };
  // How far down the screen the book reaches. Arrows and lanes start below this.
  TG.bookBottom = (run, view) => { const L = TG.bookLayout(run, view); return L.y + L.h + 4; };

  function torn(A_, c, w, h) {
    const pts = [[0, 0], [w, 0], [w, h - 2]];
    for (let i = 14; i >= 0; i--) pts.push([w * i / 14, h - 2 + (i % 2 ? 3 : 0)]);
    A_.poly(c, pts, PAPER, 2);
    A_.poly(c, [[0, 0], [SPINE, 0], [SPINE, h + 1], [0, h + 1]], '#7a4e2c', 1.6);
  }

  function paintBook(rows, spares, L) {
    const A_ = A(), { w, h, row, size } = L;
    const cv = cache || (cache = document.createElement('canvas'));
    cv.width = Math.ceil(w * 2); cv.height = Math.ceil((h + 6) * 2);
    const c = cv.getContext('2d');
    c.setTransform(2, 0, 0, 2, 0, 0);
    torn(A_, c, w, h);
    TG.spiral(c, SPINE / 2, 12, 4.5, '#35d0d8');
    if (L.strip) {
      // A short screen in the boss: one tab per row, ink or a smear. The drowning line still shows in words, over the strip.
      const tw = (w - SPINE - 8) / rows.length;
      rows.forEach((r, i) => {
        const x0 = SPINE + 4 + i * tw, mid = h / 2;
        if (i) A_.line(c, x0, 3, x0, h - 3, 0.8, 'rgba(70,96,150,.4)');
        if (r.lost) { c.globalAlpha = 0.55; A_.blob(c, [[x0 + 4, mid - 5], [x0 + tw - 5, mid - 6], [x0 + tw - 4, mid + 5], [x0 + 5, mid + 6]], '#6d8cc0', 0); c.globalAlpha = 1; }
        else for (let k = 0; k < 3; k++) A_.line(c, x0 + 5, mid - 5 + k * 5, x0 + tw - 6 - (k === 2 ? tw * 0.3 : 0), mid - 5 + k * 5, 1.5, r.page ? '#6a3a1e' : INK_BLUE);
      });
    } else rows.forEach((r, i) => {
      const y = 6 + row * i, mid = y + row / 2;
      A_.line(c, SPINE + 4, y + row - 0.5, w - 5, y + row - 0.5, 0.7, 'rgba(70,96,150,.34)');
      if (r.lost) {
        // Where a line was: a blue smear, running down the page
        c.globalAlpha = 0.5;
        const sx = w / 350;
        A_.blob(c, [[24, mid - 3], [110 * sx, mid - 4], [200 * sx, mid - 2], [262 * sx, mid - 4], [270 * sx, mid + 2], [150 * sx, mid + 4], [30, mid + 3]], '#6d8cc0', 0);
        c.globalAlpha = 1;
        for (let k = 0; k < 5; k++) { const x = 40 + k * 44 * sx + (i * 17) % 20; A_.line(c, x, mid, x + 1, mid + 5 + (k % 3), 1, 'rgba(90,120,180,.55)'); }
      } else {
        if (r.page) A_.poly(c, [[SPINE + 2, y], [w - 3, y + 0.5], [w - 3, y + row - 0.5], [SPINE + 2, y + row]], PATCH, 0.8, 'rgba(120,96,60,.8)');
        c.font = font(size); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = r.page ? '#6a3a1e' : INK_BLUE;
        c.fillText(r.text, SPINE + 6, mid + 0.5, rowWidth(L, i));
      }
    });
    // Spare copies, tucked into the spine as little grey books
    for (let i = 0; i < spares; i++) A_.poly(c, [[2.5, h - 12 - i * 8], [12.5, h - 12 - i * 8], [12.5, h - 6 - i * 8], [2.5, h - 6 - i * 8]], '#b9bfd4', 1);
  }
  // A row under the pause button stops short of it.
  function rowWidth(L, i) {
    const full = L.w - SPINE - 15, top = L.y + 6 + L.row * i;
    return top < L.pauseBottom ? Math.min(full, L.pauseLeft - L.x - SPINE - 10) : full;
  }

  function drawBook(c, run, view) {
    const w = run.w, A_ = A(), rows = run.carry.rows, spares = TG.spareLeft(run), L = TG.bookLayout(run, view), y0 = L.y;
    const key = JSON.stringify(rows) + spares + '|' + [L.size, L.w, L.strip].join();
    if (key !== cacheKey || !cache) { cacheKey = key; paintBook(rows, spares, L); }
    const shake = (w.deadT > 0 ? Math.sin(run.time * 60) * 2 : 0);
    const fx = w.bookFx;
    c.drawImage(cache, L.x + shake, y0, cache.width / 2, cache.height / 2);
    if (!fx) return;
    const X = L.x + SPINE + 6;
    // The line drowning: the words go first, sliding and running down over the page, a second and a half you can read.
    if (fx.kind === 'drown' && fx.t < 1.6) {
      const y = L.strip ? y0 + L.h / 2 : y0 + 6 + L.row * fx.row + L.row / 2, u = fx.t / 1.6, width = L.strip ? L.w - SPINE - 15 : rowWidth(L, fx.row);
      c.save();
      if (L.strip) { c.globalAlpha = Math.min(1, (1 - u) * 3); c.fillStyle = PAPER; c.fillRect(L.x + SPINE, y0, L.w - SPINE, L.h); }
      c.font = font(L.size); c.textAlign = 'left'; c.textBaseline = 'middle';
      c.fillStyle = u < 0.2 ? '#c0281e' : '#2f4f8f';
      c.globalAlpha = 1 - u;
      c.fillText(fx.text, X, y + u * 9, width);
      c.globalAlpha = (1 - u) * 0.5;
      c.fillText(fx.text, X + u * 4, y + u * 19, width);
      c.restore();
      if (u < 0.45 && !L.strip) { c.globalAlpha = (0.45 - u) * 2; c.fillStyle = 'rgba(53,196,204,.5)'; c.fillRect(L.x, y - L.row / 2, L.w, L.row); c.globalAlpha = 1; }
    } else if (fx.kind === 'page' && fx.t < 1.4 && !L.strip) {
      const y = y0 + 6 + L.row * fx.row;
      c.globalAlpha = (1.4 - fx.t) * 0.6; c.fillStyle = '#ffe28a'; c.fillRect(L.x, y, L.w, L.row); c.globalAlpha = 1;
    } else if (fx.kind === 'spare' && fx.t < 1.2) {
      c.globalAlpha = 1.2 - fx.t;
      A_.text(c, 'A COPY BURNS, NOT A LINE', view.w / 2, y0 + L.h / 2, { size: 18, color: '#ffe28a', align: 'center', lw: 4 });
      c.globalAlpha = 1;
    }
  }

  TG.drawBook = drawBook;
})();
