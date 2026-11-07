// The zoom sheet: one panel shown large, with its full art note and every line of text spelled out.
(function () {
  const DM = window.DM, { el, geom: G } = DM;
  const SVG = 'http://www.w3.org/2000/svg';
  const VERB = { say: 'says', shout: 'shouts', think: 'thinks', whisper: 'whispers', off: 'says, out of shot' };
  let back = null;

  function frame(panel, pageW) {
    const pts = JSON.parse(panel.dataset.poly), b = G.bbox(pts);
    const wide = pageW > 800, maxW = Math.min(window.innerWidth - 32, 980), maxH = window.innerHeight * (wide ? 0.62 : 0.66);
    let s = Math.min(maxW / b.w, maxH / b.h);
    if (wide && window.innerWidth < 640) s = Math.max(s, maxH / b.h);   // a spread on a phone stays tall; it scrolls sideways in its own box
    const outer = el('div', 'zoom-art');
    const box = el('div', 'zoom-frame');
    box.style.cssText = `width:${b.w * s}px;height:${b.h * s}px`;
    const inner = el('div', 'zoom-inner');
    inner.style.cssText = `width:${pageW}px;height:${G.PAGE_H}px;transform:translate(${-b.x * s}px,${-b.y * s}px) scale(${s})`;
    const copy = panel.cloneNode(true);
    inner.appendChild(copy);
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'borders');
    svg.setAttribute('width', pageW); svg.setAttribute('height', G.PAGE_H);
    const poly = document.createElementNS(SVG, 'polygon');
    poly.setAttribute('points', pts.map(p => p.join(',')).join(' '));
    svg.appendChild(poly);
    inner.appendChild(svg);
    box.appendChild(inner);
    outer.appendChild(box);
    return outer;
  }

  function words(data) {
    const list = el('ol', 'zoom-lines');
    DM.panels.itemsOf(data).forEach(it => {
      const li = el('li', 'zl-' + it.kind);
      if (it.kind === 'cap') li.append(el('b', 'zl-who', 'Narration'), document.createTextNode(' ' + it.text));
      else if (it.kind === 'sfx') li.append(el('b', 'zl-who', 'Sound'), document.createTextNode(' ' + it.text));
      else {
        const tag = el('span', 'bal-tag inline', it.name);
        tag.style.setProperty('--who', it.colour);
        li.append(tag, el('i', 'zl-verb', ' ' + VERB[it.kind] + ' '), document.createTextNode(it.text));
      }
      list.appendChild(li);
    });
    if (!list.children.length) list.appendChild(el('li', 'zl-none', 'No words in this panel.'));
    return list;
  }

  function open(leaf, panel) {
    const R = DM.reader, li = Number(leaf.dataset.leaf), lf = R.leaves[li], idx = Number(panel.dataset.index);
    const data = R.issue.pages[lf.idx].panels[idx];
    const z = document.getElementById('zoom'), body = z.querySelector('.zoom-body');
    body.textContent = '';
    const head = el('header', 'zoom-head');
    head.appendChild(el('h2', '', `Page ${lf.wide ? lf.no + '-' + lf.noEnd : lf.no} · Panel ${idx + 1}`));
    head.appendChild(el('span', 'zoom-shot', String(data.shot || '').replace('-', ' ')));
    body.appendChild(head);
    body.appendChild(frame(panel, lf.wide ? 1600 : 800));
    if (lf.wide && window.innerWidth < 640) body.appendChild(el('p', 'zoom-tip', 'Swipe sideways inside the picture to see the whole spread.'));
    const brief = el('section', 'zoom-brief');
    brief.append(el('h3', '', 'Art note'), el('p', '', data.art || ''));
    body.appendChild(brief);
    const text = el('section', 'zoom-text');
    text.append(el('h3', '', 'Words'), words(data));
    body.appendChild(text);
    back = document.activeElement;
    z.hidden = false;
    document.documentElement.classList.add('zoomed');
    z.querySelector('.zoom-close').focus({ preventScroll: true });
  }

  function close() {
    const z = document.getElementById('zoom');
    if (z.hidden) return;
    z.hidden = true;
    document.documentElement.classList.remove('zoomed');
    if (back && back.focus) back.focus({ preventScroll: true });
  }

  function attach() {
    const z = document.getElementById('zoom');
    z.querySelector('.zoom-close').addEventListener('click', close);
    z.addEventListener('click', e => { if (e.target === z) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  DM.zoom = { open, close, attach };
})();
