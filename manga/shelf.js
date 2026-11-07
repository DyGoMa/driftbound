// The bookshelf: one book per issue in manga/catalog.js, spine-out, grouped on shelves by arc, side stories on a shelf of their own at the end.
(function () {
  const DM = window.DM, { el } = DM;
  let lastPer = 0;

  // Runs of issues that share a part and an arc, in order. Side stories always go last.
  function groups(list) {
    const main = list.filter(x => !DM.isSide(x)), side = list.filter(DM.isSide), out = [];
    main.forEach(x => {
      const g = out[out.length - 1];
      if (g && g.arc === x.arc && g.part === x.part) g.items.push(x);
      else out.push({ arc: x.arc, part: x.part, items: [x] });
    });
    if (side.length) out.push({ arc: 'filler', part: 'side', items: side });
    return out;
  }

  // Each book gets a slightly different height, fixed by its number, so the row looks like real books.
  const heightOf = n => 0.86 + ((n * 37) % 13) / 100;

  function book(issue) {
    const arc = DM.arcOf(issue.arc), p = DM.data.progress[issue.n];
    const b = el('button', 'bk');
    b.type = 'button';
    b.dataset.n = issue.n;
    b.style.setProperty('--c', arc.c);
    b.style.setProperty('--ink', arc.ink);
    b.style.setProperty('--hf', heightOf(issue.n));
    b.setAttribute('aria-label', `No. ${issue.n}, ${issue.title}` + (DM.done(issue.n) ? ', read' : p ? ', started' : ''));
    if (DM.done(issue.n)) b.classList.add('read');
    else if (p) b.classList.add('started');
    const spine = el('span', 'spine');
    spine.append(el('span', 'num', DM.two(issue.n)), el('span', 'ttl', issue.title), el('span', 'mark'));
    const face = el('span', 'face');
    face.append(el('span', 'face-no', 'No. ' + DM.two(issue.n)), el('span', 'face-title', issue.title));
    b.append(el('span', 'ribbon'), spine, face);
    return b;
  }

  // Biggest spine lettering that fits on one line; a long title drops to two thin lines.
  function fitSpines() {
    const max = window.innerWidth >= 700 ? 20 : 17;
    document.querySelectorAll('.ttl').forEach(t => {
      const room = t.parentNode.clientWidth - 8;   // the title column shrinks to its text, so measure against the spine
      const fits = () => t.scrollHeight <= t.clientHeight + 1 && t.scrollWidth <= room;
      t.classList.remove('wrap');
      for (let f = max; f >= 12; f--) { t.style.fontSize = f + 'px'; if (fits()) return; }
      t.classList.add('wrap');
      for (let f = 14; f >= 9; f--) { t.style.fontSize = f + 'px'; if (fits()) return; }
    });
  }

  function perRow() {
    const box = document.getElementById('case');
    const inner = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) * 2;
    const w = window.innerWidth >= 700 ? 54 : 44;
    return Math.max(3, Math.floor((inner - 30) / (w + 4)));
  }

  function heading(text, sub) {
    const h = el('h2', 'part');
    h.append(el('span', 'part-word', text));
    if (sub) h.append(el('span', 'part-name', sub));
    return h;
  }

  function render() {
    const box = document.getElementById('case'), list = DM.catalog();
    box.textContent = '';
    if (!list.length) {
      box.appendChild(el('p', 'empty', 'The shelf is empty for now. The first issues are being lettered.'));
      return;
    }
    const per = lastPer = perRow();
    let part = null;
    groups(list).forEach(g => {
      if (g.part !== part) {
        part = g.part;
        box.appendChild(g.part === 'side' ? heading('Side Stories', 'Off the main run') : heading(DM.PART_WORD[g.part] || 'Part ' + g.part, DM.PARTS[g.part]));
      }
      const arc = DM.arcOf(g.arc), sec = el('section', 'arc');
      sec.setAttribute('aria-label', arc.name);
      for (let i = 0; i < g.items.length; i += per) {
        const shelf = el('div', 'shelf'), row = el('div', 'row');
        g.items.slice(i, i + per).forEach(x => row.appendChild(book(x)));
        if (g.items.length - i < per) row.appendChild(el('span', 'bookend'));
        const plank = el('div', 'plank');
        if (i === 0) plank.appendChild(el('span', 'plate', arc.name));
        shelf.append(row, plank);
        sec.appendChild(shelf);
      }
      box.appendChild(sec);
    });
    fitSpines();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSpines);
  }

  function continueButton() {
    const a = document.getElementById('continue'), up = DM.nextUp();
    if (!up) return;
    const p = DM.data.progress[up.issue.n];
    const where = up.resume && p && p.leaf ? ' · back where you stopped' : '';
    a.textContent = (up.again ? 'Read again: ' : up.resume ? 'Continue reading: ' : 'Start reading: ') + 'No. ' + DM.two(up.issue.n) + where;
    a.href = 'read.html?i=' + up.issue.n;
    a.hidden = false;
  }

  function wire() {
    const box = document.getElementById('case');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const pick = b => DM.detail.show(Number(b.dataset.n), b);
    box.addEventListener('click', e => { const b = e.target.closest('.bk'); if (b) DM.detail.open(Number(b.dataset.n), b); });
    box.addEventListener('pointerover', e => { const b = e.target.closest('.bk'); if (b && hover.matches && DM.detail.docked()) pick(b); });
    box.addEventListener('focusin', e => { const b = e.target.closest('.bk'); if (b && DM.detail.docked()) pick(b); });
    let t = 0;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (perRow() !== lastPer) { render(); DM.detail.mark(); } }, 120); });
  }

  window.DriftGate.whenPassed(() => {
    render();
    continueButton();
    wire();
    DM.detail.init();
  });
})();
