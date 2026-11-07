// Turning pages: taps on the sides, swipes, arrow keys, the slider. Plus the settings menu and the first-time hint.
// Right to left (the default): forward is the LEFT side, a swipe to the right, and the left arrow key.
(function () {
  const DM = window.DM, R = DM.reader;
  const EDGE = 0.12;   // the outer 12% of the screen always turns the page, even over a panel

  const fwdSign = () => (R.dir === 'rtl' ? 1 : -1);   // +1 when "forward" is towards the left
  function turnTowards(left) { hideHint(); R.turn(left ? fwdSign() : -fwdSign()); }

  // The panel whose middle zone is under this point, if any. Only a modest centre of each panel opens the zoom.
  function panelAt(x, y) {
    for (const leaf of document.querySelectorAll('#stage .leaf:not(.leaving)')) {
      const r = leaf.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const s = parseFloat(leaf.dataset.s), lx = (x - r.left) / s, ly = (y - r.top) / s;
      const whole = leaf.classList.contains('wide') && !R.double;   // a spread on a phone: tap anywhere to zoom
      for (const panel of leaf.querySelectorAll('.panel')) {
        const pts = JSON.parse(panel.dataset.poly), b = DM.geom.bbox(pts);
        const zx = whole ? b.w / 2 : Math.min(b.w * 0.22, 150), zy = whole ? b.h / 2 : Math.min(b.h * 0.26, 170);
        if (Math.abs(lx - (b.x + b.w / 2)) <= zx && Math.abs(ly - (b.y + b.h / 2)) <= zy) return { leaf, panel };
      }
    }
    return null;
  }

  function onTap(e) {
    if (e.target.closest('a, button, input')) return;
    if (Date.now() < suppressUntil) return;
    const st = document.getElementById('stage').getBoundingClientRect(), x = e.clientX - st.left;
    const edge = x < st.width * EDGE || x > st.width * (1 - EDGE);
    if (!edge) {
      const hit = panelAt(e.clientX, e.clientY);
      if (hit) { R.finishAnim(); DM.zoom.open(hit.leaf, hit.panel); return; }
    }
    turnTowards(x < st.width / 2);
  }

  let touch = null, suppressUntil = 0;
  function onTouchStart(e) { touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() } : null; }
  function onTouchEnd(e) {
    if (!touch || e.changedTouches.length !== 1) { touch = null; return; }
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - touch.t < 800) {
      suppressUntil = Date.now() + 400;
      turnTowards(dx > 0);   // dragging the page to the right brings in the page on its left
    }
    touch = null;
  }

  function onKey(e) {
    if (document.querySelector('.zoom:not([hidden])') || e.target.matches('input')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); turnTowards(true); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); turnTowards(false); }
    else if (e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); hideHint(); R.turn(1); }
    else if (e.key === 'PageUp') { e.preventDefault(); R.turn(-1); }
  }

  function hint() {
    const h = document.getElementById('hint');
    if (DM.data.hintSeen) { h.hidden = true; return; }
    h.hidden = false;
    h.querySelector('b').textContent = R.dir === 'rtl' ? 'This book reads right to left' : 'This book reads left to right';
    h.querySelector('span').textContent = R.dir === 'rtl' ? 'Tap the left side or swipe right to turn the page.' : 'Tap the right side or swipe left to turn the page.';
    h.classList.toggle('go-right', R.dir === 'ltr');
  }
  function hideHint() {
    const h = document.getElementById('hint');
    if (h.hidden) return;
    h.hidden = true;
    DM.data.hintSeen = true;
    DM.save();
  }

  function settings() {
    const btn = document.getElementById('settings-btn'), menu = document.getElementById('settings');
    const sync = () => {
      menu.querySelectorAll('[data-dir]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.dir === R.dir)));
      menu.querySelectorAll('[data-notes]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.notes === 'on') === DM.data.notes)));
    };
    const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => { menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); sync(); });
    menu.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.dir && b.dataset.dir !== R.dir) { R.setDir(b.dataset.dir); hint(); }
      if (b.dataset.notes) { DM.data.notes = b.dataset.notes === 'on'; DM.save(); notes(); }
      if (b.dataset.close) close();
      sync();
    });
    document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#settings, #settings-btn')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  const notes = () => document.documentElement.classList.toggle('no-notes', !DM.data.notes);

  function attach() {
    const stage = document.getElementById('stage'), slider = document.getElementById('slider');
    stage.addEventListener('click', onTap);
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKey);
    slider.addEventListener('input', () => { hideHint(); R.show(Number(slider.value), 0); });
    document.getElementById('hint').addEventListener('click', hideHint);
    settings();
    notes();
    hint();
  }

  DM.input = { attach };
})();
