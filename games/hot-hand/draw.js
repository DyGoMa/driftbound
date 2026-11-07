// Hot Hand: one frame of play, and the title. Drawing only: nothing in the run changes here.
window.HH = window.HH || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  function rain(c, view, n, t) {
    if (!n) return;
    c.strokeStyle = 'rgba(190,205,240,.3)'; c.lineWidth = 1;
    c.beginPath();
    const W = view.right - view.left + 60, H = view.bottom - view.top;
    for (let i = 0; i < n; i++) {
      const sx = (i * 73.3) % 1, sy = (i * 41.7) % 1;
      const x = view.left + ((sx * W - t * 240 + 4000 * W) % W), y = view.top + ((sy * H + t * 720) % H);
      c.moveTo(x, y); c.lineTo(x - 5, y + 14);
    }
    c.stroke();
  }
  // Embers rising, from the time alone.
  function embers(c, view, n, t, y0) {
    const A_ = A(), W = view.right - view.left;
    for (let i = 0; i < n; i++) {
      const sx = (i * 0.618) % 1, sp = 14 + (i * 37 % 19), life = ((t * sp / 200 + i * 0.137) % 1);
      const x = view.left + sx * W + Math.sin(t * 1.3 + i) * 12, y = y0 - life * 240;
      c.globalAlpha = (1 - life) * 0.9;
      A_.poly(c, [[x, y - 1.8], [x + 1.8, y], [x, y + 1.8], [x - 1.8, y]], i % 3 ? '#ff8a2a' : '#ffe46a', 0);
    }
    c.globalAlpha = 1;
  }
  // Fires that stay lit in the Pit and at the Vault.
  const FIRES = {
    pit: [[-120, 212, 44], [-60, 214, 30], [20, 212, 50], [96, 214, 36], [176, 212, 42], [260, 214, 30], [380, 214, 30], [464, 212, 42], [544, 214, 36], [620, 212, 50], [700, 214, 30], [760, 212, 44]],
    vault: [[-90, 200, 60], [-40, 202, 40], [670, 202, 44], [720, 200, 60], [770, 202, 40]],
    row: [[470, 120, 30]],
    alley: [],
    table: [],
  };

  function sorted(w) {
    const list = [];
    for (const f of w.foes) list.push({ y: f.type === 'sniper' ? 0 : f.y, draw: 'foe', f });
    for (const b of w.corpses) if (b.type !== 'sniper') list.push({ y: b.y - 0.1, draw: 'corpse', f: b });
    if (w.boss) {
      for (const s of w.boss.shields) list.push({ y: s.y, draw: 'shield', f: s });
      list.push({ y: w.boss.krell.exposed || w.boss.krell.down ? 1e4 : w.boss.krell.y, draw: 'krell', f: w.boss.krell }); // In the open: nothing in front of him
    }
    if (w.pal) list.push({ y: w.pal.y, draw: 'pal', f: w.pal });
    list.push({ y: T.frontY - 0.5, draw: 'juno' });
    list.sort((a, b) => a.y - b.y);
    return list;
  }

  function drawPal(c, p, t) {
    const A_ = A(), pal = window.DRIFT_PALS && DRIFT_PALS.get(p.id), s = 0.44, hop = p.hop > 0 ? Math.sin(p.hop * 10) * 8 : Math.abs(Math.sin(t * 7)) * 3;
    if (!pal) return;
    if (!A_.draw(c, 'pal_' + p.id, 0, p.x, p.y - hop, 44)) {
      c.save(); c.translate(p.x - 22, p.y - 44 - hop); c.scale(s, s); pal.draw(c); c.restore();
    }
    if (p.id === 'dicemite') { // the number on its shell, big enough to read: tap on a six
      const on = p.pip === 6;
      A_.circle(c, p.x, p.y - 60 - hop, 13, on ? '#ffe46a' : '#efe6d2', 2);
      A_.text(c, String(p.pip), p.x, p.y - 59 - hop, { size: 18, color: on ? '#b32a2a' : '#17161f', align: 'center', ink: false });
    }
    if (p.id === 'cinderbun') { c.globalAlpha = 0.25 + Math.sin(t * 5) * 0.1; A_.circle(c, p.x, p.y - 22 - hop, 30, '#ffb33a', 0); c.globalAlpha = 1; }
  }

  function warnings(c, f, t) {
    if (f.dead || (f.type === 'sniper' && f.state === 'hide')) return;
    HH.drawPips(c, f);
    const b = HH.box(f), top = b.y0 - 16, cx = f.x;
    if (f.state === 'tell' && f.type !== 'cart') HH.warnBang(c, cx, top, Math.min(1, f.t / (f.type === 'hollow' ? T.hollowTell : T.tellSecs)), 1.15);
    else if (f.state === 'wind') HH.warnBang(c, cx, top, Math.min(1, f.t / T.hookWind), 1);
    else if (f.state === 'aim' || f.state === 'shutter') HH.warnBang(c, cx + 34, f.y - 56, f.state === 'aim' ? 1 - f.t / T.sniperAim : 0, 1);
    else if (f.type === 'cart' && f.state === 'fuse') { HH.warnBang(c, cx, top, Math.min(1, f.t / T.cartFuse), 1.3); }
    if (f.type === 'hollow' && HH.hollowOpen(f)) { const y = HH.midY(f); A().circle(c, f.x + (f.side > 0 ? -24 : 24) * f.s, y, 15 + Math.sin(t * 9) * 2, null, 1.8, '#ffffff'); }
    if (f.mark > 0) HH.drawMark(c, f, t);
  }

  // In a talk scene the box covers the bottom of the screen, so the street is lifted until Juno's feet clear its top: a whole person above the box, not a head poking over it.
  function talkLift() {
    if (!/talk/.test(Kit.ui.screen || '')) return 0;
    const box = document.querySelector('.kit-talk .kit-box');
    return box ? Math.max(0, T.frontY + T.talkClear - Kit.toGame(0, box.getBoundingClientRect().top).y) : 0;
  }

  HH.render = function (c, run, view) {
    const lift = talkLift();
    if (!lift) { frame(c, run, view); return; }
    c.fillStyle = '#10121f'; c.fillRect(view.left, view.bottom - lift - 1, view.right - view.left, lift + 1);   // under the lifted street
    c.save(); c.translate(0, -lift);
    frame(c, run, view);
    c.restore();
  };
  function frame(c, run, view) {
    const A_ = A(), w = run.w, t = run.time, look = HH.lookOf(run.stage);
    HH.drawScene(c, view, look);
    (FIRES[look] || []).forEach((p, i) => HH.flame(c, p[0], p[1], p[2], t + i * 1.3));
    if (look === 'pit' || look === 'vault') embers(c, view, 22, t, 210);
    if (look === 'row') embers(c, view, 7, t, 180);
    const heatGlow = w.flash > 0;
    if (w.boss) HH.drawLine(c, run, t);
    for (const f of w.foes) if (f.type === 'sniper') HH.drawSniper(c, f, t);
    for (const it of sorted(w)) {
      if (it.draw === 'juno') { HH.drawCover(c, w); HH.drawJuno(c, run, w.jx, T.frontY); }
      else if (it.draw === 'corpse') HH.drawCorpse(c, it.f);
      else if (it.draw === 'shield') HH.drawShield(c, it.f, t);
      else if (it.draw === 'krell') HH.drawKrell(c, w.boss, t);
      else if (it.draw === 'pal') drawPal(c, it.f, t);
      else if (it.draw === 'foe') {
        const f = it.f;
        if (f.type === 'sniper') continue;
        if (f.type === 'cart') HH.drawCart(c, f, t);
        else if (f.type === 'hollow') HH.drawHollow(c, f, t);
        else HH.drawTrooper(c, f, t);
      }
    }
    for (const r of w.rings) {
      const u = r.t / 0.32;
      c.globalAlpha = 1 - u;
      A_.circle(c, r.x, r.y, r.r * (0.4 + u * 0.6), null, 3 + (1 - u) * 5, r.col);
      c.globalAlpha = 1;
    }
    HH.drawAshka(c, w.ashka);
    // Warnings, marks and gauges go over every body and over Ashka, so nothing hides them
    for (const f of w.foes) warnings(c, f, t);
    if (w.boss) {
      w.boss.shields.forEach(s => { if (!s.down) HH.drawGauge(c, s); if (s.mark > 0 && !s.down) HH.drawMark(c, s, t); });
      if (w.boss.krell.mark > 0 && w.boss.krell.exposed) HH.drawMark(c, w.boss.krell, t);
      if (run.w.boss.state === 'ramTell') HH.drawLine(c, run, t);
    }
    for (const p of w.projs) HH.drawProj(c, p, t);
    for (const s of w.shots) HH.drawShot(c, s, t);
    if (run.stage.rain) rain(c, view, run.stage.rain, t);
    if (run.stage.isEndless && w.coolMul < HH.baseCool(run)) embers(c, view, 18, t, 240);
    if (run.stage.isEndless && w.coolMul > HH.baseCool(run)) rain(c, view, 60, t);
    if (heatGlow) { c.fillStyle = 'rgba(255,190,90,' + Math.min(0.3, w.flash) + ')'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); }
    if (w.quenchT > 0) { c.fillStyle = 'rgba(180,220,255,' + Math.min(0.28, w.quenchT * 0.4) + ')'; c.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top); }
  }

  // A broken corner of Ashmarket's boardwalk for her to stand on: planks over rock.
  function ledge(c, x, y) {
    const A_ = A(), b = HH.bake('titleLedge', 290, 76, 136, 8, cc => {
      A_.poly(cc, [[-120, 2], [128, 2], [136, 22], [118, 30], [104, 66], [-66, 66], [-92, 34], [-126, 22]], '#2a2038', 2.2);
      A_.poly(cc, [[-92, 34], [-70, 28], [-40, 40], [-10, 30], [30, 42], [70, 30], [118, 30], [104, 66], [-66, 66]], '#1d1730', 0);
      A_.poly(cc, [[-124, -3], [132, -3], [136, 8], [-128, 8]], '#6e4a2c', 2.2);
      A_.poly(cc, [[-126, 3.5], [134, 3.5], [136, 8], [-128, 8]], '#4f3420', 0);
      for (let px = -100; px < 130; px += 34) A_.line(cc, px, -3, px - 2, 8, 1.4, A_.INK);
      A_.poly(cc, [[-124, -3], [132, -3], [136, 8], [-128, 8]], null, 2.2);
    });
    HH.stamp(c, b, x, y + 3);
    c.save(); c.globalAlpha = 0.35; A_.ellipse(c, x, y + 1, 30, 3.4, '#10121f', 0); c.restore();
  }

  // The title: the Ashmarket picture if it loads, the code street if not, with Juno and Ashka in front.
  let pic = null;
  HH.titleDraw = function (c, view, t) {
    const A_ = A();
    if (!pic) { pic = new Image(); pic.src = Kit.url('art/site/ashmarket-v1-web.webp'); }
    if (pic.complete && pic.naturalWidth) {
      const W = view.right - view.left, H = view.bottom - view.top, s = Math.max(W / pic.naturalWidth, H / pic.naturalHeight);
      c.drawImage(pic, view.left + (W - pic.naturalWidth * s) / 2, view.top + (H - pic.naturalHeight * s) / 2, pic.naturalWidth * s, pic.naturalHeight * s);
    } else HH.drawScene(c, view, 'row');
    if (/talk|ending/.test(Kit.ui.screen || '')) return;   // the talk box and the ending card would cut her in half: the painting alone is the backdrop there
    // In the free corner under the title's words, clear of the menu, on a ledge of her own
    const x = view.left + (view.right - view.left) * 0.3, y = view.bottom - 18, h = 96;
    ledge(c, x, y);
    HH.dressJuno();
    if (!A_.draw(c, 'ashka_fly', A_.frameAt('ashka_fly', t), x - 66, y - 68 + Math.sin(t * 2) * 5, 44)) HH.drawAshkaBig(c, x - 66, y - 84 + Math.sin(t * 2) * 5, 0.9, t);
    if (!A_.draw(c, 'juno_hot', A_.frameAt('juno_hot', t), x, y, h)) A_.personFast(c, 'juno', { x, y, h, pose: 'aim' });
    const pic2 = A_.has('juno_hot');
    HH.flame(c, x + (pic2 ? 20 : 37), y - (pic2 ? 59 : 68), 16, t, ['#ffb35a', '#ffe46a', '#ffffff']);
  };
})();
