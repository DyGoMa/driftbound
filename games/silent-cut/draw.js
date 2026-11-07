// Silent Cut: one frame of play. Drawing only: nothing in the run changes here.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  const near = (x, cam, view, m) => x > cam + view.left - m && x < cam + view.right + m;

  // The warning over a trooper's or Maro's head: a plate with a ring that closes at the moment he turns. Sits above the head so it never covers a face.
  function warnMark(c, x, y, frac, sym, col) {
    const A_ = A();
    A_.circle(c, x, y, 15, A_.NIGHT, 2.2);
    if (frac > 0) { c.beginPath(); c.arc(x, y, 15, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.lineWidth = 4.2; c.strokeStyle = col; c.stroke(); }
    A_.text(c, sym, x, y + 0.5, { size: 20, color: col, align: 'center', lw: 2 });
  }

  // The meter over Silas: an open eye that fills with red; a shut violet one when he's hidden.
  function eye(c, x, y, seen, hidden, grace) {
    const A_ = A();
    if (hidden) {
      A_.circle(c, x, y, 11, 'rgba(12,16,38,.85)', 1.8, '#b79cff');
      c.beginPath(); c.moveTo(x - 7, y - 1); c.quadraticCurveTo(x, y + 6, x + 7, y - 1); c.lineWidth = 2.2; c.strokeStyle = '#d9c8ff'; c.stroke();
      return;
    }
    if (seen <= 0.01) return;
    A_.circle(c, x, y, 13, 'rgba(12,16,38,.9)', 2);
    c.beginPath(); c.arc(x, y, 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, seen)); c.lineWidth = 4.4; c.strokeStyle = seen > 0.6 ? '#ff5a3a' : '#f4c152'; c.stroke();
    A_.ellipse(c, x, y, 7.5, 4.6, '#f5efe2', 1.3); A_.circle(c, x, y, 2.6, seen > 0.6 ? '#c9281a' : '#10121f', 0);
  }

  // What a tap would do now, marked on the thing itself.
  function targetMark(c, tg, s, t) {
    const A_ = A(), g = T.groundY, pulse = 1 + Math.sin(t * 12) * 0.1;
    let x, y, col;
    if (tg.kind === 'cut') { x = tg.o.x + 8; y = g - SC.LANTERN_ALT; col = '#ffe39a'; }
    else if (tg.kind === 'maro') { x = tg.o.x; y = g - 56; col = '#ff8a4a'; }
    else { x = tg.o.x; y = g - 50; col = '#ff8a4a'; }
    A_.circle(c, x, y, 19 * pulse, null, 3.4, A_.INK); A_.circle(c, x, y, 19 * pulse, null, 2, col);
    A_.text(c, 'TAP', x, y - 28, { size: 15, color: col, align: 'center', lw: 3 });
  }

  // The ledger's pages burst out of his book where he was cut and scatter ahead of him, away from Silas, each on its own path and fall.
  const PAGES = [[-6, 150, -26, 1.1], [30, 95, -60, 2.3], [4, 60, -92, 1.7], [42, 165, -44, 2.9], [14, 118, -110, 0.8], [-2, 34, -70, 2.0], [26, 142, -128, 2.6], [36, 72, -24, 1.4]];   // start x, drift px/s, start speed up px/s, spin
  function drawPages(c, x0, g, u, t) {
    PAGES.forEach((p, i) => {
      const x = x0 + p[0] + p[1] * u + Math.sin(u * (3 + p[3]) + i) * 7, y = g - 74 + p[2] * u + 95 * u * u;
      SC.drawPage(c, x, y, t * p[3] + i * 1.7);
    });
  }

  SC.render = function (c, run, view) {
    const A_ = A(), w = run.w, s = w.s, t = w.t, g = T.groundY;
    const theme = run.stage.theme || 0, cam = w.cam === undefined ? s.x - T.camX : w.cam;
    SC.drawScene(c, view, cam, t, theme);

    c.save();
    c.translate(-cam, 0);
    const on = (x, m) => near(x, cam, view, m === undefined ? 90 : m);

    // Behind the lane: towers, masts, the lights themselves
    for (const sw of w.sweeps) if (sw.b + 200 > cam + view.left && sw.a - 200 < cam + view.right) { SC.drawTower(c, sw, SC.sweepAt(sw, t).x); SC.drawSweepTrack(c, sw); }
    for (const f of w.floods) { if (on(f.a, 120)) SC.drawFloodMast(c, f.a - 14); if (on(f.b, 120)) SC.drawFloodMast(c, f.b + 14); }
    for (const k of w.covers) if (on(k.x)) SC.drawCoverBack(c, k);
    for (const b of w.boards) if (b.b > cam + view.left && b.a < cam + view.right) { c.fillStyle = 'rgba(16,14,30,.3)'; c.fillRect(b.a, g + 2, b.b - b.a, 12); c.strokeStyle = '#e7b98a'; c.lineWidth = 1.5; c.beginPath(); for (let x = b.a; x < b.b; x += 26) { c.moveTo(x, g + 3); c.lineTo(x + 7, g + 13); } c.stroke(); }
    for (const f of w.floods) if (f.b > cam + view.left && f.a < cam + view.right) SC.drawFlood(c, w, f);
    for (const l of w.lanterns) if (on(l.x)) { SC.drawLanternLight(c, l); SC.drawLantern(c, l, t, !!(w.moth && w.moth.l === l)); }
    for (const sw of w.sweeps) if (sw.b + 90 > cam + view.left && sw.a - 90 < cam + view.right) SC.drawSweep(c, sw, t);
    for (const cr of w.cranes) if (cr.b + 90 > cam + view.left && cr.a - 90 < cam + view.right) SC.drawCranes(c, cr, t, view, cam);
    for (const f of w.foes) if (on(f.x, 140)) SC.drawFoeLamp(c, f);
    if (w.boss) { SC.drawMaroLamp(c, w.boss); SC.drawMaroPool(c, w.boss); }
    if (isFinite(w.exitX) && on(w.exitX)) SC.drawExit(c, w.exitX - 40, t);

    // Salvage
    for (const co of w.coins) if (on(co.x, 20)) A_.salvage(c, co.x, g - co.alt, 8, t * 3 + co.x * 0.02);

    // A violet glow under him in the dark, so a dim screen can always find him
    if (s.hidden || !s.lastLit) A_.ellipse(c, s.x, g + 7, 26, 5, '#b79cff', 0);

    // Silas, then the cover in front of him if he's hidden, then troopers walk in front of both
    if (s.hidden) {
      SC.drawSilas(c, run, s.x);
    }
    for (const k of w.covers) if (on(k.x)) SC.drawCoverFront(c, k);
    // Tuftle: all you ever see is the eyes, looking out of the dark at the edge of the cover
    if (w.tuf) { const ex = w.tuf.x - 18, ey = g - 22, blink = Math.sin(t * 2.3) > 0.97 ? 0.2 : 1; [0, 15].forEach(d => { A_.ellipse(c, ex + d, ey, 6.5, 7.5 * blink, '#f5efe2', 1.6); A_.circle(c, ex + d + 1, ey + 1, 3.4 * blink, A_.INK, 0); }); }
    for (const f of w.foes) if (f.state === 'down' && on(f.x)) SC.drawTrooper(c, f, t);
    for (const f of w.foes) if (f.state !== 'down' && on(f.x)) SC.drawTrooper(c, f, t);
    if (w.boss) SC.drawMaro(c, w.boss, t);
    if (!s.hidden) SC.drawSilas(c, run, s.x);

    // Hush waits where it's safe
    const h = w.hush, hk = SC.coverAt(w, h.x), atDoor = isFinite(w.exitX) && h.x > w.exitX - 60, hy = h.fly ? g - 150 : atDoor ? g - 130 : (hk ? g - (hk.kind === 'door' ? 120 : 62) : g);
    if (h.swoop > 0) SC.drawHush(c, s.x + 40, g - 130, t, { fly: true, h: 60 });
    else if (on(h.x, 60)) SC.drawHush(c, h.x, hy, t, { fly: !!h.fly, h: 62 });

    // Pals
    if (w.moth) {
      const pal = window.DRIFT_PALS && DRIFT_PALS.get('lamplick');
      if (pal) {
        const m = w.moth, ms = 0.34, mx = m.state === 'lick' ? m.l.x - 12 + Math.sin(t * 2) * 2 : m.x + Math.sin(t * 7) * 10, my = m.state === 'lick' ? g - SC.LANTERN_ALT - 22 + Math.sin(t * 3) * 3 : g - m.alt - 20;
        if (on(mx)) { c.save(); c.translate(mx - 50 * ms, my - 40 * ms); c.scale(ms, ms); pal.draw(c); c.restore(); }
      }
    }

    // Marks over the world
    for (const f of w.foes) {
      if (f.state === 'down' || !on(f.x)) continue;
      const tell = SC.foeTell(f), head = g - 104;
      if (tell > 0) warnMark(c, f.x, head, tell, '!', '#ff8a2a');
      else if (f.state === 'hear') warnMark(c, f.x, head, 0, '?', '#f4c152');
      else if (f.state === 'hunt') warnMark(c, f.x, head, 0, '!', '#ff5a3a');
      else if (f.state === 'look') warnMark(c, f.x, head, 0, '?', '#f4c152');
    }
    if (w.boss && w.boss.hp > 0) {
      const tell = SC.maroTell(w.boss);
      if (tell > 0) warnMark(c, w.boss.x, g - 110, tell, '!', '#ff8a2a');
    }
    for (const r of w.ring) { c.globalAlpha = 1 - r.age / 0.55; A_.ellipse(c, r.x, g + 8, r.r, Math.max(2, r.r * 0.09), null, 2.6, '#e7b98a'); c.globalAlpha = 1; }
    if (w.pagesT > 0 && w.boss) drawPages(c, w.pagesX, g, T.pagesSecs - w.pagesT, t);
    if (!run.over) {
      const tg = SC.target(w);
      if (tg && s.strikeT <= 0) targetMark(c, tg, s, t);
      eye(c, s.x, g - 108, s.seen, s.hidden, s.grace);
    }

    SC.drawLine(c, w, view, cam, t);
    c.restore();

    // A cool wash while he has no breath, so the whole picture says it.
    if (s.winded) { c.fillStyle = 'rgba(30,24,70,.2)'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); }
    if (w.flash > 0) { c.globalAlpha = Math.min(1, w.flash) * 0.32; c.fillStyle = '#d0301c'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); c.globalAlpha = 1; }
  };

  // The title: the Lanternreach picture, with Hush gliding low over the clouds under the island. The picture has no ground for anyone to stand on, so Silas only shows if it can't load: then he creeps along the code street's own walkway.
  let pic = null;
  SC.titleDraw = function (c, view, t) {
    const A_ = A();
    if (!pic) { pic = new Image(); pic.src = Kit.url('art/site/lanternreach-v1-web.webp'); }
    const W = view.right - view.left, H = view.bottom - view.top, hasPic = pic.complete && pic.naturalWidth;
    if (hasPic) {
      const s = Math.max(W / pic.naturalWidth, H / pic.naturalHeight);
      c.drawImage(pic, view.left + (W - pic.naturalWidth * s) / 2, view.top + (H - pic.naturalHeight * s) / 2, pic.naturalWidth * s, pic.naturalHeight * s);
    } else SC.drawScene(c, view, t * 30, t, 0);
    if (/talk|ending/.test(Kit.ui.screen)) return;   // the ending plays over this: they're on the ship by then, not out creeping under the talk box
    const x = view.left + W * (0.3 + ((t * 0.018) % 0.5));
    if (hasPic) { SC.drawHush(c, x, view.bottom - 44 + Math.sin(t * 1.4) * 4, t, { fly: true, h: 40 }); return; }
    const g = T.groundY, h = 66;
    if (!A_.draw(c, 'silas_creep', A_.frameAt('silas_creep', t), x, g, h)) A_.personFast(c, 'silas', { x, y: g, h, pose: 'creep', t });
    SC.drawHush(c, x + 80, g - 72 + Math.sin(t * 1.4) * 5, t, { fly: true, h: 52 });
  };
})();
