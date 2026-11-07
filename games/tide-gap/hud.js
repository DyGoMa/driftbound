// Tide Gap: the logbook at the top of the screen and everything else on top of play. The book is the bond cost on show: real lines, in her hand, drowning for good.
// Rows are drawn once and redrawn only when they change. It sits under the read-outs and above the world, and the pause button keeps its corner.
// The writing never shrinks below T.bookFontMinCss on the real screen: the rows grow instead. On a short screen the boss gets a strip of tabs, so the whole cutter shows.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;
  const BOOK_Y = 42, BOOK_PAD = 5, SPINE = 15, SHORT_VIEW = 700, PAUSE_CSS = 52, STRIP_H = 24;
  const INK_BLUE = '#1f2f58', PAPER = '#eee2c4', PATCH = '#f5ecd2';
  let cache = null, cacheKey = '';

  function font(size) { return `italic 700 ${size}px Barlow, system-ui, sans-serif`; }

  // Sizes for this screen. Everything here is logical px.
  TG.bookLayout = function (run, view) {
    const k = view.scale, size = Math.max(T.bookFont, T.bookFontMinCss / k), row = size * 1.13;
    const w = Math.max(350, Math.min(view.right - view.left - BOOK_PAD * 2, Math.max(350, size * 29)));
    const x = view.left < 0 && w > 350 ? view.left + BOOK_PAD : BOOK_PAD;
    const strip = !!run.boss && view.bottom - view.top < SHORT_VIEW;
    const h = strip ? STRIP_H : 6 + row * T.bookRows + 3;
    return { size, row, w, x, y: view.top + BOOK_Y, h, strip, pauseLeft: view.right - PAUSE_CSS / k, pauseBottom: view.top + PAUSE_CSS / k };
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

  // Sense meter: how much of the arrows are left. Sits on the read-out line.
  function drawSense(c, run, x, y) {
    const A_ = A(), left = TG.linesLeft(run);
    A_.text(c, 'DRIFT', x, y, { size: 12, color: left ? A_.GOLD : '#7a7f94' });
    for (let i = 0; i < T.bookRows; i++) {
      const px = x + 36 + i * 9;
      A_.poly(c, [[px, y - 5], [px + 5, y], [px, y + 5], [px - 2, y + 5], [px + 3, y], [px - 2, y - 5]], i < left ? '#ffe28a' : '#3a3550', 1);
    }
  }

  // A keel plate in small, the same shape as on the ship.
  function plateMark(c, x, y, broken) {
    const A_ = A();
    A_.poly(c, [[x - 8, y - 3], [x - 4, y - 6], [x + 5, y - 6], [x + 8, y - 2], [x + 8, y + 3], [x + 4, y + 6], [x - 5, y + 6], [x - 8, y + 2]], broken ? '#20222e' : '#6fd8de', 1.5);
    if (broken) A_.poly(c, [[x - 3, y - 3], [x + 1, y - 1], [x - 1, y + 3]], '#3a3550', 0);
    else A_.line(c, x - 4, y + 1, x + 3, y - 2, 1.2, '#e6feff');
  }

  function drawTop(c, run, view) {
    const w = run.w, A_ = A(), y = view.top + 13, y2 = view.top + 30;
    A_.salvage(c, 15, y, 8, 0);
    A_.text(c, String(Math.floor(run.salvage)), 28, y, { size: 16, color: A_.GOLD });
    A_.text(c, String(Math.floor(run.score)), 62, y, { size: 14 });
    // Hull: patched planks
    for (let i = 0; i < w.hullMax; i++) {
      const x = 10 + i * 15;
      A_.poly(c, [[x, y2 - 6], [x + 11, y2 - 6], [x + 9, y2 + 6], [x + 2, y2 + 6]], i < w.hullLeft ? '#c98f4e' : '#3a3550', 1.5);
    }
    drawSense(c, run, 10 + w.hullMax * 15 + 8, y2);
    if (run.boss) {
      const b = w.boss, cx = 228;
      A_.text(c, 'HEKKA', cx - 12, y, { size: 14, color: '#dfe2ea', align: 'right' });
      for (let i = 0; i < T.boss.plates.length; i++) plateMark(c, cx + 7 + i * 22, y, b.broken[i]);
    } else if (!run.endless) {
      A_.bar(c, 130, y - 5, 130, 9, w.dist / run.stage.length, A_.GOLD);
      A_.text(c, Math.max(0, Math.ceil((run.stage.length - w.dist) / T.metre)) + ' m', 270, y, { size: 12 });
    } else A_.text(c, Math.floor(w.dist / T.metre) + ' m', 180, y, { size: 16, color: A_.GOLD, align: 'center' });
  }

  // Down-pointing chevrons beside the hull: "pull down now".
  function pullCue(c, run, x, y) {
    const A_ = A(), slide = (run.time * 1.8) % 1;
    for (let i = 0; i < 2; i++) {
      const py = y + i * 12 + slide * 8;
      c.globalAlpha = i ? 0.55 + (1 - slide) * 0.45 : 0.55 + slide * 0.45;
      A_.poly(c, [[x - 11, py - 5], [x - 7, py - 7], [x, py], [x + 7, py - 7], [x + 11, py - 5], [x, py + 6]], '#a8f6f8', 1.6);
    }
    c.globalAlpha = 1;
  }

  // The next shut tooth in reach, if any.
  function shutNear(w) {
    return w.gates.find(g => g.shut && !g.scraped && g.startAt - w.dist < T.shutCueAt && g.endAt > w.dist) || null;
  }

  // On the hull: the ring that winds up a Dive, and the air left once you're under.
  function drawDiveBits(c, run, view) {
    const w = run.w, A_ = A(), d = w.dive, x = w.shipX, y = w.shipYNow;
    if (w.windup > 0) {
      const u = w.windup / T.diveWindup;
      c.beginPath(); c.arc(x, y, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * u);
      c.lineWidth = 7; c.strokeStyle = A_.INK; c.lineCap = 'round'; c.stroke();
      c.lineWidth = 4; c.strokeStyle = TG.canDive(run) ? '#7feaf0' : '#7a7f94'; c.stroke();
      A_.text(c, TG.canDive(run) ? 'DIVE' : 'NOTHING LEFT', x, y - 58, { size: 15, color: TG.canDive(run) ? '#a8f6f8' : '#c0c4d0', align: 'center' });
    }
    if (d.state === 'down') {
      const low = d.air < T.diveWarn, clears = TG.airClears(w);
      A_.bar(c, x - 34, y + 50, 68, 8, d.air / w.airMax, low || !clears ? '#ff6a4a' : '#7feaf0');
      // Won't come up in open water going straight: say so while there's time to steer out sideways.
      A_.text(c, !clears ? 'STEER OUT!' : low ? 'UP!' : 'AIR', x, y + 66, { size: 13, color: low || !clears ? '#ff9a7a' : '#a8f6f8', align: 'center' });
    }
    const g = shutNear(w);
    if (g && d.state === 'up' && w.dist < g.startAt && !w.boss) {
      A_.text(c, 'SHUT', g.crack, Math.max(TG.bookBottom(run, view) + 12, TG.yOf(w, g.at + g.len / 2) - 6), { size: 15, color: '#ffe28a', align: 'center', lw: 3 });
      if (TG.canDive(run) && w.diveUnlocked) pullCue(c, run, Math.min(x + 44, T.maxX + 6), y - 8);
    }
  }

  // A plate you can reach: the marker that tells you to let go. Plates open: pull down works with a thumb already on the glass, and the words say so.
  function drawBossBits(c, run) {
    const w = run.w, b = w.boss, A_ = A(), B = T.boss;
    if (!b || b.state !== 'open') return;
    const y = b.y + B.cutterHalfLen + 34;
    if (w.dive.state === 'up') {
      if (TG.canDive(run)) {
        A_.text(c, 'PLATES OPEN', 180, y - 9, { size: 15, color: '#a8f6f8', align: 'center', lw: 4 });
        A_.text(c, 'PULL DOWN AND HOLD TO DIVE', 180, y + 9, { size: 15, color: '#a8f6f8', align: 'center', lw: 4 });
        pullCue(c, run, Math.min(w.shipX + 44, T.maxX + 6), w.shipYNow - 8);
      } else A_.text(c, 'PLATES OPEN: FIND A PAGE TO DIVE', 180, y, { size: 15, color: '#ffe28a', align: 'center', lw: 4 });
    } else if (w.dive.state === 'down') {
      const near = B.plates.some((p, i) => !b.broken[i] && Math.abs(b.cx + p[0] - w.shipX) < B.plateNear) && w.shipYNow <= b.y + B.reachLine;
      A_.text(c, near ? 'LET GO!' : 'STEER UNDER A PLATE', 180, y, { size: near ? 24 : 15, color: near ? '#ffe28a' : '#a8f6f8', align: 'center', lw: 4 });
    }
  }

  // What the hint line says now, and how solid it is. Hints sit under the hull: nothing comes at you from there.
  const coarse = () => window.matchMedia && matchMedia('(pointer: coarse)').matches;
  function hintNow(run) {
    const w = run.w, s = run.stage;
    if (w.diveHintT > 0) return { text: s.diveHint + (coarse() ? '' : ' Keyboard: hold the down arrow.'), a: Math.min(1, w.diveHintT), dive: true };
    const g = !run.boss && shutNear(w);
    if (g && w.dive.state === 'up' && w.dist < g.startAt && !w.scrapeTo) return { text: TG.canDive(run) ? (w.diveUnlocked ? TG.WORDS.shutHint : '') : TG.WORDS.shutHintDead, a: 1, dive: true };
    if (s.hint && run.time < T.hintSecs) return { text: s.hint, a: Math.min(1, T.hintSecs - run.time), dive: false };
    return null;
  }

  // A talk box on top of the hint's place, on a short screen: the words would only ghost through it, so the hint waits for the box to go.
  function talkCovers(view, y) {
    const box = document.querySelector('.kit-say.at-bottom');
    return !!box && view.top + box.getBoundingClientRect().top / view.scale < y;
  }

  TG.hud = function (c, run, view) {
    const w = run.w, A_ = A(), inPlay = /play|test/.test(Kit.ui.screen || '');
    drawDiveBits(c, run, view);
    drawBossBits(c, run);
    // The top band is solid, so the read-outs always read
    c.fillStyle = 'rgba(12,16,38,.82)';
    c.fillRect(view.left - 12, view.top - 12, view.right - view.left + 24, BOOK_Y + 12);
    drawTop(c, run, view);
    if (inPlay) drawBook(c, run, view);   // not behind a result or menu: the heading there would sit on top of its bright rows
    const hint = hintNow(run), lines = hint && hint.text ? wrap(hint.text, 42) : [], y0 = T.hintY;
    if (lines.length && inPlay && !talkCovers(view, y0 + lines.length * 18)) {
      c.globalAlpha = hint.a;
      c.fillStyle = 'rgba(12,16,38,.6)'; c.fillRect(view.left, y0 - 12, view.right - view.left, lines.length * 18 + 6);
      lines.forEach((l, i) => A_.text(c, l, 180, y0 + i * 18, { size: 14, body: true, color: hint.dive ? '#a8f6f8' : A_.PAPER, align: 'center', lw: 3 }));
      c.globalAlpha = 1;
    }
  };
  function wrap(s, n) {
    const out = []; let line = '';
    s.split(' ').forEach(word => { if ((line + ' ' + word).trim().length > n) { out.push(line); line = word; } else line = (line + ' ' + word).trim(); });
    if (line) out.push(line);
    return out;
  }
})();
