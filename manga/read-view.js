// The reader's core: which pages are on screen, scaling them to fit, the page turn, and saving your place.
(function () {
  const DM = window.DM, { el, book: Bk } = DM;
  const R = DM.reader = { issue: null, leaves: [], views: [], at: 0, dir: DM.data.dir === 'ltr' ? 'ltr' : 'rtl', double: false, cache: new Map(), anim: null, ready: false };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stage = () => document.getElementById('stage');
  // Two facing pages when the screen is wider than tall (a computer, or a phone turned sideways).
  const wantsDouble = () => window.innerWidth > window.innerHeight && window.innerWidth >= 640;

  function leafEl(i) {
    if (i < 0) { const w = el('div', 'leaf blank-leaf'); w.appendChild(DM.pages.build(R.issue, null, R.dir)); return w; }
    if (R.cache.has(i)) return R.cache.get(i);
    const w = el('div', 'leaf' + (R.leaves[i].wide ? ' wide' : ''));
    w.dataset.leaf = i;
    w.appendChild(DM.pages.build(R.issue, R.leaves[i], R.dir));
    R.cache.set(i, w);
    return w;
  }

  // Scales the view's pages to the stage and puts them side by side, the first-read page on the right in right-to-left mode.
  function place(els, view) {
    const st = stage(), W = st.clientWidth, H = st.clientHeight;
    const padX = R.double ? 20 : 0, padY = R.double ? 12 : 4;
    const pw = view.wide || els.length === 2 ? 1600 : 800;
    const s = Math.min((W - padX * 2) / pw, (H - padY * 2) / 1200);
    const left = (W - pw * s) / 2, top = Math.max(padY, (H - 1200 * s) / 2) - (view.wide && !R.double ? 18 : 0);
    els.forEach((leaf, k) => {
      let x = left;
      if (els.length === 2) x = (k === 0) === (R.dir === 'rtl') ? left + 800 * s : left;
      const w = (leaf.classList.contains('wide') ? 1600 : 800) * s;
      leaf.style.cssText = `left:${x}px;top:${top}px;width:${w}px;height:${1200 * s}px`;
      leaf.firstChild.style.transform = `scale(${s})`;
      leaf.dataset.s = s;
      leaf.classList.toggle('gut-l', els.length === 2 && x > left + 1);
      leaf.classList.toggle('gut-r', els.length === 2 && x <= left + 1);
    });
    const note = document.getElementById('spread-note');
    if (note) {
      note.hidden = !(view.wide && !R.double);
      note.style.top = (st.offsetTop + top + 1200 * s + 12) + 'px';
    }
  }
  const shown = () => [...stage().querySelectorAll('.leaf:not(.leaving)')];
  function relayout() { const v = R.views[R.at]; if (v) place(shown(), v); }

  function finishAnim() {
    if (!R.anim) return;
    clearTimeout(R.anim.timer);
    R.anim.old.forEach(o => o.remove());
    stage().querySelectorAll('.leaf').forEach(l => l.classList.remove('flip-out', 'flip-in', 'hinge-l', 'hinge-r', 'fade-out', 'z0', 'z1', 'z2', 'z3'));
    stage().classList.remove('turning');
    R.anim = null;
  }

  // A small page-flip: the turning page swings up on its spine and the next one swings down. Off under reduced motion.
  function animate(old, now, step, wasWide, view) {
    const toRight = (step > 0) === (R.dir === 'rtl'), byX = a => a.slice().sort((p, q) => parseFloat(p.style.left) - parseFloat(q.style.left));
    old.forEach(o => o.classList.add('leaving', 'z1'));
    now.forEach(n => n.classList.add('z0'));
    if (old.length === 1 && now.length === 1 && !wasWide && !view.wide) old[0].classList.add('flip-out', toRight ? 'hinge-r' : 'hinge-l', 'z3');
    else if (old.length === 2 && now.length === 2) {
      const [oL, oR] = byX(old), [nL, nR] = byX(now);
      (toRight ? oL : oR).classList.add('flip-out', toRight ? 'hinge-r' : 'hinge-l', 'z3');
      (toRight ? nR : nL).classList.add('flip-in', toRight ? 'hinge-l' : 'hinge-r', 'z2');
    } else old.forEach(o => o.classList.add('fade-out', 'z3'));
    stage().classList.add('turning');
    R.anim = { old, timer: setTimeout(finishAnim, 460) };
  }

  function save() {
    const v = R.views[R.at], n = R.issue.n, firstLeaf = Math.max(0, Math.min(...v.leaves.filter(i => i >= 0)));
    const p = DM.data.progress[n] || {};
    p.leaf = firstLeaf;
    p.total = R.leaves.length;
    if (v.leaves.includes(R.leaves.length - 1)) p.done = true;
    DM.data.progress[n] = p;
    DM.data.last = n;
    DM.save();
  }

  function chrome() {
    const v = R.views[R.at], total = R.leaves[R.leaves.length - 1].noEnd;
    document.getElementById('count').textContent = Bk.label(v, R.leaves) + ' / ' + total;
    const slider = document.getElementById('slider');
    slider.max = R.views.length - 1;
    slider.value = R.at;
    slider.dir = R.dir;
    slider.style.setProperty('--fill', (R.views.length > 1 ? R.at / (R.views.length - 1) * 100 : 100) + '%');
    slider.setAttribute('aria-valuetext', 'Page ' + Bk.label(v, R.leaves) + ' of ' + total);
  }

  function preload() {
    const later = window.requestIdleCallback || (fn => setTimeout(fn, 60));
    later(() => [R.at + 1, R.at - 1, R.at + 2].forEach(v => { if (R.views[v]) R.views[v].leaves.forEach(i => { if (i >= 0) leafEl(i); }); }));
  }

  function show(v, step) {
    v = Math.max(0, Math.min(R.views.length - 1, v));
    finishAnim();
    const wasWide = !!(R.views[R.at] && R.views[R.at].wide);
    const view = R.views[v], els = view.leaves.map(leafEl);
    const old = shown().filter(o => !els.includes(o));
    R.at = v;
    els.forEach(e => stage().appendChild(e));
    place(els, view);
    if (step && old.length && !reduce.matches) animate(old, els, step, wasWide, view);
    else old.forEach(o => o.remove());
    chrome();
    save();
    preload();
    document.dispatchEvent(new CustomEvent('manga:view', { detail: { at: v, step } }));
  }

  function rebuildViews(keepLeaf) {
    R.double = wantsDouble();
    document.documentElement.classList.toggle('double', R.double);
    R.views = Bk.viewsOf(R.leaves, R.double);
    finishAnim();
    shown().forEach(o => o.remove());
    show(Bk.viewOfLeaf(R.views, keepLeaf), 0);
  }
  const currentLeaf = () => Math.max(0, ...R.views[R.at].leaves);
  function firstLeafShown() { return Math.max(0, Math.min(...R.views[R.at].leaves.filter(i => i >= 0))); }

  function setDir(dir) {
    R.dir = dir === 'ltr' ? 'ltr' : 'rtl';
    DM.data.dir = R.dir;
    DM.save();
    document.documentElement.classList.toggle('ltr', R.dir === 'ltr');
    const keep = firstLeafShown();
    finishAnim();
    shown().forEach(o => o.remove());
    R.cache.clear();
    rebuildViews(keep);
  }
  // Fonts that arrive late change text widths, so the pages are drawn again once they're in.
  function refresh() {
    if (!R.ready) return;
    const keep = firstLeafShown();
    DM.balloons.clearCache();
    shown().forEach(o => o.remove());
    R.cache.clear();
    rebuildViews(keep);
  }

  function start(issue) {
    R.issue = issue;
    R.leaves = Bk.leavesOf(issue);
    document.documentElement.classList.toggle('ltr', R.dir === 'ltr');
    const saved = DM.data.progress[issue.n], last = R.leaves.length - 1;
    const leaf = saved && saved.leaf > 0 && saved.leaf < last ? saved.leaf : 0;   // a finished issue opens on its cover again
    R.ready = true;
    rebuildViews(leaf);
    let t = 0;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => { if (wantsDouble() !== R.double) rebuildViews(firstLeafShown()); else relayout(); }, 80);
    });
  }

  Object.assign(R, { start, show, turn: step => { if (R.views[R.at + step]) show(R.at + step, step); }, setDir, refresh, relayout, currentLeaf, finishAnim });
  window.__mangaReader = {   // for tools/manga-smoke.js
    state: () => ({ ready: R.ready, at: R.at, views: R.views.length, double: R.double, dir: R.dir, label: R.views[R.at] && Bk.label(R.views[R.at], R.leaves), animating: !!R.anim }),
    go: v => show(v, 0),
  };
})();
