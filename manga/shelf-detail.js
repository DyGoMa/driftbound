// The detail card for one book: placeholder cover, blurb, page count, READ.
// On a computer it sits beside the shelf and follows the mouse. On a phone it rises as a sheet when a book is tapped.
(function () {
  const DM = window.DM, { el } = DM;
  const wide = window.matchMedia('(min-width: 1000px)');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, opener = null, timer = 0;

  function cover(issue) {
    const arc = DM.arcOf(issue.arc), c = el('div', 'dt-cover');
    c.style.setProperty('--c', arc.c);
    c.style.setProperty('--ink', arc.ink);
    const src = DM.art(DM.coverKey(issue.n));
    if (src) {
      const img = el('img', 'dt-art');
      img.alt = '';
      img.addEventListener('error', () => { img.remove(); c.classList.remove('has-art'); });
      img.src = src;
      c.classList.add('has-art');
      c.appendChild(img);
    }
    c.append(el('span', 'dt-mast', 'DRIFTBOUND'), el('span', 'dt-no', DM.two(issue.n)), el('span', 'dt-stamp', 'COVER ART COMING'));
    const foot = el('span', 'dt-foot');
    foot.append(el('span', 'dt-title', issue.title), el('span', 'dt-tag', issue.tagline || ''));
    c.appendChild(foot);
    return c;
  }

  function status(issue) {
    const p = DM.data.progress[issue.n];
    if (DM.done(issue.n)) return 'Read';
    if (p && p.leaf) return 'Started';
    return 'New';
  }

  function fill(n) {
    const issue = DM.catalog().find(x => x.n === n), box = document.getElementById('detail');
    if (!issue) return;
    current = n;
    const arc = DM.arcOf(issue.arc);
    box.textContent = '';
    box.style.setProperty('--c', arc.c);
    const close = el('button', 'dt-close', 'Close');
    close.type = 'button';
    close.addEventListener('click', shut);
    box.appendChild(close);
    const top = el('div', 'dt-top');
    const info = el('div', 'dt-info');
    const where = DM.isSide(issue) ? 'Side Story' : (DM.PART_WORD[issue.part] || 'Part ' + issue.part) + ' · ' + arc.name;
    info.append(el('p', 'dt-meta', where), el('h2', 'dt-h', issue.title), el('p', 'dt-num', 'No. ' + DM.two(issue.n) + ' · ' + issue.pages + ' pages'));
    const state = status(issue);
    info.appendChild(el('p', 'dt-state s-' + state.toLowerCase(), state));
    top.append(cover(issue), info);
    box.appendChild(top);
    box.appendChild(el('p', 'dt-blurb', issue.blurb || ''));
    const read = el('a', 'btn dt-read', state === 'Started' ? 'READ · pick up where you left off' : state === 'Read' ? 'READ AGAIN' : 'READ');
    read.href = 'read.html?i=' + issue.n;
    box.appendChild(read);
    const brief = el('div', 'dt-brief');
    brief.append(el('b', '', 'Cover art coming'), el('p', '', issue.coverArt || ''));
    box.appendChild(brief);
    mark();
  }

  // Marks which book is pulled out.
  function mark() {
    document.querySelectorAll('.bk.out').forEach(b => b.classList.remove('out'));
    const b = document.querySelector(`.bk[data-n="${current}"]`);
    if (b) b.classList.add('out');
  }

  function show(n) { if (n !== current) fill(n); }

  // Tap or click: on a phone the book slides out, then the sheet rises.
  function open(n, btn) {
    fill(n);
    if (docked()) { document.querySelector('#detail .dt-read').focus({ preventScroll: true }); return; }
    opener = btn;
    btn.classList.add('pulling');
    clearTimeout(timer);
    timer = setTimeout(() => {
      const box = document.getElementById('detail');
      box.classList.add('open');
      document.getElementById('backdrop').hidden = false;
      document.documentElement.classList.add('sheet-open');
      box.querySelector('.dt-close').focus({ preventScroll: true });
    }, still.matches ? 0 : 220);
  }
  function shut() {
    const box = document.getElementById('detail');
    if (!box.classList.contains('open')) return;
    box.classList.remove('open');
    document.getElementById('backdrop').hidden = true;
    document.documentElement.classList.remove('sheet-open');
    document.querySelectorAll('.bk.out, .bk.pulling').forEach(b => b.classList.remove('out', 'pulling'));
    if (opener) opener.focus({ preventScroll: true });
  }
  const docked = () => wide.matches;

  function init() {
    document.getElementById('backdrop').addEventListener('click', shut);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
    wide.addEventListener('change', () => { shut(); if (docked() && current) mark(); });
    const up = DM.nextUp();
    if (up) fill(up.issue.n);
    if (!docked()) document.querySelectorAll('.bk.out').forEach(b => b.classList.remove('out'));
  }

  DM.detail = { show, open, shut, docked, init, mark };
})();
