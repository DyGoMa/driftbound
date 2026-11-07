// The pages around the story: cover, letters column, title-page serial, back page, and a blank.
// Built on the hidden measuring box, at the same logical size as story pages, so text can be fitted.
(function () {
  const DM = window.DM, { el } = DM;

  function blankPage(cls) {
    const page = el('div', 'page ' + cls);
    DM.balloons.measureHost().appendChild(page);
    return page;
  }
  // Shrinks a box's text a step at a time until it stops overflowing.
  function fitText(box, max, min) {
    for (let f = max; f >= min; f--) {
      box.style.fontSize = f + 'px';
      if (box.scrollHeight <= box.clientHeight + 1) return;
    }
    box.dataset.overflow = '1';
  }
  function folio(page, leaf) { if (leaf.no) page.appendChild(el('div', 'folio', String(leaf.no))); }
  function partLine(issue) {
    if (DM.isSide(issue)) return 'Side Story';
    return (DM.PART_WORD[issue.part] || 'Part ' + issue.part) + ' · ' + (DM.PARTS[issue.part] || '');
  }

  function cover(issue) {
    const arc = DM.arcOf(issue.arc), page = blankPage('cover');
    page.style.setProperty('--arc', arc.c);
    page.style.setProperty('--arc-ink', arc.ink);
    page.appendChild(el('div', 'cv-bg'));
    const src = DM.art(DM.coverKey(issue.n));
    const frame = el('div', 'cv-frame');
    frame.appendChild(el('div', 'cv-stamp', 'COVER ART COMING'));
    frame.appendChild(el('p', 'cv-brief', (issue.cover && issue.cover.art) || ''));
    page.appendChild(frame);
    if (src) {
      const img = el('img', 'cv-art');
      img.alt = '';
      img.addEventListener('error', () => { img.remove(); frame.hidden = false; });
      img.src = src;
      frame.hidden = true;
      page.insertBefore(img, frame);
    }
    page.appendChild(el('div', 'cv-mast', 'DRIFTBOUND'));
    const no = el('div', 'cv-no');
    no.append(el('small', '', 'No.'), el('b', '', DM.two(issue.n)));
    page.appendChild(no);
    page.appendChild(el('div', 'cv-part', partLine(issue) + ' · ' + arc.name));
    const foot = el('div', 'cv-foot');
    const title = el('h2', 'cv-title', issue.title || '');
    foot.append(title, el('p', 'cv-tag', (issue.cover && issue.cover.tagline) || ''));
    page.appendChild(foot);
    for (let f = 112; f >= 52; f -= 4) {   // biggest size that keeps the title on two lines at most
      title.style.fontSize = f + 'px';
      if (title.scrollWidth <= title.clientWidth + 1 && title.offsetHeight <= f * 2.3) break;
    }
    return page;
  }

  function letters(issue, leaf) {
    const page = blankPage('back-matter letters');
    const head = el('header', 'bm-head');
    head.append(el('h2', '', 'LETTERS TO THE GULLWAKE'), el('p', '', 'You write in. The crew writes back. Nobody checks it first.'));
    page.appendChild(head);
    const list = el('div', 'bm-body lt-list');
    list.dataset.fitbox = 'letters';
    ((issue.extras && issue.extras.letters) || []).forEach(l => {
      const who = DM.speaker(l.who), card = el('article', 'lt');
      const q = el('p', 'lt-q');
      q.append(el('b', 'lt-from', (l.from || 'A reader') + ' writes:'), document.createTextNode(' ' + (l.q || '')));
      const a = el('p', 'lt-a');
      const tag = el('span', 'bal-tag inline', who.name);
      tag.style.setProperty('--who', who.colour);
      a.append(tag, document.createTextNode(' ' + (l.a || '')));
      card.append(q, a);
      list.appendChild(card);
    });
    page.appendChild(list);
    fitText(list, 27, 15);
    folio(page, leaf);
    return page;
  }

  function serial(issue, leaf) {
    const s = (issue.extras && issue.extras.serial) || {}, page = blankPage('back-matter serial');
    const head = el('header', 'sr-head');
    head.append(el('p', 'sr-kicker', 'Title-page serial · Part ' + issue.n), el('h2', '', "FIZZLET'S GRAND TOUR"));
    page.appendChild(head);
    const art = el('div', 'sr-art');
    art.appendChild(el('span', '', 'Title-page art coming'));
    page.appendChild(art);
    const body = el('div', 'bm-body sr-body');
    body.dataset.fitbox = 'serial';
    body.append(el('h3', 'sr-title', s.title || ''), el('p', 'sr-text', s.text || ''));
    page.appendChild(body);
    fitText(body, 30, 15);
    folio(page, leaf);
    return page;
  }

  function back(issue, leaf) {
    const page = blankPage('back-matter backpage');
    page.appendChild(el('div', 'bp-end', 'END OF ISSUE ' + issue.n));
    const tease = el('div', 'bp-next');
    tease.append(el('b', '', 'NEXT TIME'), el('p', '', (issue.extras && issue.extras.next) || ''));
    tease.dataset.fitbox = 'next';
    page.appendChild(tease);
    fitText(tease, 34, 18);
    const row = el('div', 'bp-buttons');
    const nxt = DM.nextIssue(issue.n, DM.isSide(issue));
    if (nxt) {
      const a = el('a', 'bp-btn', 'Read No. ' + DM.two(nxt.n) + ': ' + nxt.title);
      a.href = 'read.html?i=' + nxt.n;
      row.appendChild(a);
    } else row.appendChild(el('p', 'bp-wait', DM.isSide(issue) ? 'That was the last side story on the shelf.' : 'The next issue is not on the shelf yet.'));
    const shelf = el('a', 'bp-btn ghost', 'Back to the shelf');
    shelf.href = 'index.html';
    row.appendChild(shelf);
    page.appendChild(row);
    page.appendChild(el('div', 'bp-mark', 'DRIFTBOUND'));
    folio(page, leaf);
    return page;
  }

  function blank() {
    const page = blankPage('blank');
    page.appendChild(el('div', 'bl-mark', 'DRIFTBOUND'));
    return page;
  }

  // Builds the page for one leaf.
  function build(issue, leaf, dir) {
    if (!leaf) return blank();
    let page;
    if (leaf.type === 'cover') page = cover(issue);
    else if (leaf.type === 'letters') page = letters(issue, leaf);
    else if (leaf.type === 'serial') page = serial(issue, leaf);
    else if (leaf.type === 'back') page = back(issue, leaf);
    else {
      page = DM.panels.storyPage(issue, leaf.idx, dir);
      page.appendChild(el('div', 'folio', leaf.wide ? leaf.no + '-' + leaf.noEnd : String(leaf.no)));
    }
    return page;
  }

  DM.pages = { build };
})();
