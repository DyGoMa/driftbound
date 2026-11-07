// One story page: each panel's image or placeholder, then its words, then the black borders over the top.
(function () {
  const DM = window.DM, { el, geom: G } = DM;
  const SVG = 'http://www.w3.org/2000/svg';

  // Turns the script's text list into items the balloon code can draw.
  function itemsOf(panel) {
    return (panel.text || []).filter(Array.isArray).map(t => {
      if (t[0] === 'cap' || t[0] === 'sfx') return { kind: t[0], text: String(t[1]) };
      const who = DM.speaker(t[1]);
      return { kind: t[0], who: t[1], name: who.name, colour: who.colour, text: String(t[2]) };
    });
  }

  function placeholder(data, number, pts) {
    const ph = el('div', 'ph');
    ph.appendChild(el('div', 'tone'));
    const safe = G.inner(pts, 18), note = el('div', 'note');
    note.style.cssText = `left:${safe.x}px;top:${safe.y}px;width:${safe.w}px;height:${safe.h}px`;
    note.appendChild(el('div', 'pn', 'PANEL ' + number));
    note.appendChild(el('div', 'brief', data.art || ''));
    ph.appendChild(note);
    return ph;
  }

  function image(panel, ph, src, pts) {
    const b = G.bbox(pts), img = el('img', 'panel-art');
    img.alt = '';
    img.style.cssText = `left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`;
    img.addEventListener('error', () => { img.remove(); panel.classList.remove('has-art'); ph.hidden = false; });
    img.src = src;
    panel.insertBefore(img, panel.firstChild);
  }

  function panelEl(issueN, pageIndex, panelIndex, data, layoutId, dir) {
    const pts = G.poly(layoutId, panelIndex, dir), number = panelIndex + 1;
    const panel = el('div', 'panel shot-' + String(data.shot || 'medium').replace(/[^a-z-]/g, ''));
    panel.style.clipPath = G.clip(pts);
    panel.dataset.poly = JSON.stringify(pts.map(p => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]));
    panel.dataset.index = panelIndex;
    if (data.shot === 'black') panel.classList.add('black');
    const ph = placeholder(data, number, pts);
    panel.appendChild(ph);
    const src = DM.art(DM.panelKey(issueN, pageIndex + 1, number));
    if (src) { ph.hidden = true; panel.classList.add('has-art'); image(panel, ph, src, pts); }
    panel.appendChild(el('div', 'texts'));
    return { panel, pts };
  }

  // The borders go over the top of the panels, so clipping can't cut them.
  function borders(page, polys, w) {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'borders');
    svg.setAttribute('width', w); svg.setAttribute('height', G.PAGE_H);
    svg.setAttribute('viewBox', `0 0 ${w} ${G.PAGE_H}`);
    polys.forEach(pts => {
      const p = document.createElementNS(SVG, 'polygon');
      p.setAttribute('points', pts.map(q => q.map(v => v.toFixed(1)).join(',')).join(' '));
      svg.appendChild(p);
    });
    page.appendChild(svg);
  }

  // The whole story page. It's attached to the hidden measuring box first, because fitting measures text.
  function storyPage(issue, pageIndex, dir) {
    const data = issue.pages[pageIndex], wide = data.layout === 'spread', w = wide ? G.PAGE_W * 2 : G.PAGE_W;
    const page = el('div', 'page story' + (wide ? ' wide' : ''));
    page.style.width = w + 'px';
    page.dataset.pageIndex = pageIndex;
    DM.balloons.measureHost().appendChild(page);
    const polys = [];
    (data.panels || []).forEach((p, i) => {
      if (!window.DriftMangaLayouts.LAYOUTS[data.layout] || !window.DriftMangaLayouts.LAYOUTS[data.layout][i]) return;
      const { panel, pts } = panelEl(issue.n, pageIndex, i, p, data.layout, dir);
      page.appendChild(panel);
      polys.push(pts);
      DM.fit(panel, itemsOf(p), pts, dir === 'ltr' ? 'left' : 'right');
    });
    borders(page, polys, w);
    return page;
  }

  DM.panels = { storyPage, itemsOf };
})();
