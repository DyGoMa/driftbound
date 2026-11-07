// Balloons: measuring text, and drawing each kind at its final size. All sizes are logical px.
(function () {
  const SVG = 'http://www.w3.org/2000/svg', { el } = window.DM;
  // sx, sy scale the text box up to the bubble; px, py add fixed padding. These leave room for the rounded corners.
  const SHAPES = {
    say: { sx: 1.13, px: 26, sy: 1.16, py: 22, tail: 15 },
    off: { sx: 1.13, px: 26, sy: 1.16, py: 22, tail: 0 },
    whisper: { sx: 1.12, px: 22, sy: 1.14, py: 20, tail: 0 },
    think: { sx: 1.14, px: 38, sy: 1.18, py: 34, tail: 22 },
    shout: { sx: 1.2, px: 42, sy: 1.26, py: 42, tail: 0 },
  };
  const TAG_LIFT = 9;   // the name tag sits on the balloon's top edge and pokes this far above it
  let host = null;
  const cache = new Map();
  function measureHost() {
    if (!host || !host.isConnected) {
      host = el('div', 'measure');
      host.setAttribute('aria-hidden', 'true');
      document.body.appendChild(host);
    }
    return host;
  }
  function clearCache() { cache.clear(); }

  // The narrowest box that keeps the text on as few lines as it has at maxW. Null if one word alone is wider than maxW.
  function textBox(cls, text, font, maxW) {
    const key = [cls, font, Math.round(maxW), text].join('|');
    if (cache.has(key)) return cache.get(key);
    const t = el('div', cls, text);
    t.style.fontSize = font + 'px';
    t.style.width = maxW + 'px';
    measureHost().appendChild(t);
    let out = null;
    if (t.scrollWidth <= maxW + 0.5) {
      const h = t.offsetHeight;
      let lo = Math.min(maxW, font), hi = maxW;
      for (let i = 0; i < 7 && hi - lo > 3; i++) {
        const mid = (lo + hi) / 2;
        t.style.width = mid + 'px';
        if (t.offsetHeight <= h && t.scrollWidth <= mid + 0.5) hi = mid; else lo = mid;
      }
      out = { w: Math.ceil(hi) + 1, h };
    }
    t.remove();
    cache.set(key, out);
    return out;
  }
  function tagWidth(name) {
    const key = 'tag|' + name;
    if (cache.has(key)) return cache.get(key);
    const t = el('span', 'bal-tag', name);
    measureHost().appendChild(t);
    const w = t.offsetWidth + 1;
    t.remove();
    cache.set(key, w);
    return w;
  }

  // Works out one item's size at a font size. Returns null if it can't fit in maxW.
  function measure(item, font, maxW, tight) {
    if (item.kind === 'cap') {
      const pad = tight ? 18 : 26, box = textBox('cap-txt', item.text, font, Math.max(40, maxW - pad));
      return box && { w: box.w + pad, h: box.h + (tight ? 12 : 16), tw: box.w, th: box.h, font };
    }
    if (item.kind === 'sfx') {
      // One line if it fits, else wrapped onto two or more; shrinking from big to 22 px.
      const size = b => { const slant = b.w + b.h * 0.14; return [slant * 0.996 + b.h * 0.087 + 12, slant * 0.087 + b.h * 0.996 + 10]; };   // skew, then a 5 degree tilt (see .sfx-txt)
      for (let f = Math.round(font * 2.2); f >= 22; f -= 2) {
        for (const wrap of [false, true]) {
          const box = wrap ? textBox('sfx-txt wrap', item.text, f, Math.max(40, maxW * 0.86 - 12)) : textBox('sfx-txt', item.text, f, 4000);
          if (!box) continue;
          const [W, H] = size(box);
          if (W <= maxW) return { w: Math.ceil(W), h: Math.ceil(H), tw: box.w, th: box.h, font: f, wrap };
        }
      }
      return null;
    }
    const sh = SHAPES[item.kind] || SHAPES.say;
    const f = item.kind === 'whisper' ? Math.max(15, Math.round(font * 0.86)) : font;
    const k = tight ? 0.55 : 1, sx = tight ? 1.05 : sh.sx, sy = tight ? 1.07 : sh.sy, px = sh.px * k, py = sh.py * k;
    const box = textBox('bal-txt k-' + item.kind, item.text, f, Math.max(30, (maxW - px) / sx));
    if (!box) return null;
    const tagW = tagWidth(item.name) + 10, bw = Math.ceil(Math.max(box.w * sx + px, tagW)), bh = Math.ceil(box.h * sy + py);
    const tail = tight ? 0 : sh.tail;
    if (bw > maxW) return null;
    return { w: bw, h: bh + TAG_LIFT + tail, tw: box.w, th: box.h, bw, bh, tail, top: TAG_LIFT, font: f };
  }

  // A rounder rectangle than an ellipse (a superellipse), so text corners stay inside. Returns points around it.
  function oval(cx, cy, a, b, n, count) {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const t = i / count * Math.PI * 2 - Math.PI / 2, c = Math.cos(t), s = Math.sin(t);
      pts.push([cx + a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), cy + b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]);
    }
    return pts;
  }
  const line = pts => 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z';
  function bubblePath(kind, m, seed) {
    const a = m.bw / 2, b = m.bh / 2, cx = a, cy = m.top + b;
    if (kind === 'shout') {
      const n = Math.max(14, Math.round((m.bw + m.bh) / 22)), pts = oval(cx, cy, a, b, 3, n * 2);
      return line(pts.map((p, i) => {
        const r = i % 2 ? 0.8 - ((seed + i) % 3) * 0.02 : 1 - ((seed * 7 + i) % 4) * 0.012;
        return [cx + (p[0] - cx) * r, cy + (p[1] - cy) * r];
      }));
    }
    if (kind === 'think') {
      const n = Math.max(9, Math.round((m.bw + m.bh) / 34));
      const pts = oval(cx, cy, a - 8, b - 8, 2.4, n);
      const r = Math.max(12, (m.bw + m.bh) / n / 2.4);
      return 'M' + pts[0].map(v => v.toFixed(1)).join(' ') + pts.map((p, i) => { const q = pts[(i + 1) % n]; return `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }).join('') + 'Z';
    }
    return line(oval(cx, cy, a, b, 2.6, 64));
  }
  function path(svg, d, fill, stroke, width, dash) {
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', fill);
    if (stroke) { p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', width); p.setAttribute('stroke-linejoin', 'round'); }
    if (dash) p.setAttribute('stroke-dasharray', dash);
    svg.appendChild(p);
  }
  function textEl(cls, text, m, left, top) {
    const t = el('div', cls, text);
    t.style.cssText = `font-size:${m.font}px;width:${m.tw}px;left:${left}px;top:${top}px`;
    return t;
  }

  // Draws an item at x, y on the page. tail (optional) is an extra path in the item's own coordinates, drawn as one shape with the bubble.
  function draw(item, m, x, y, tail, tailRight) {
    const plain = item.kind === 'cap' || item.kind === 'sfx';
    const box = el('div', 'item ' + (plain ? item.kind : 'bal k-' + item.kind));
    box.dataset.item = item.kind;
    box.dataset.font = m.font;
    box.style.cssText = `left:${x}px;top:${y}px;width:${m.w}px;height:${m.h}px`;
    if (plain) { box.appendChild(textEl(item.kind + '-txt' + (m.wrap ? ' wrap' : ''), item.text, m, (m.w - m.tw) / 2, (m.h - m.th) / 2)); return box; }
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'bal-shape');
    svg.setAttribute('width', m.w); svg.setAttribute('height', m.h);
    const d = bubblePath(item.kind, m, item.text.length);
    let extra = tail || '';
    if (m.tail && item.kind === 'say') {   // a short tail pointing down, towards the middle of the panel
      const bx = tailRight ? m.bw * 0.66 : m.bw * 0.34, base = m.top + m.bh - 8, drift = tailRight ? 10 : -10;
      extra = `M${bx - 11} ${base}L${bx + 11} ${base}L${bx + drift} ${m.h - 2}Z`;
    }
    if (item.kind === 'whisper') path(svg, d, '#fff', '#111', 3, '11 8');
    else {
      path(svg, d, '#111', '#111', 7);
      if (extra) path(svg, extra, '#111', '#111', 7);
      path(svg, d, '#fff');
      if (extra) path(svg, extra, '#fff');
    }
    box.appendChild(svg);
    if (item.kind === 'think' && m.tail) {
      const cx = tailRight ? m.bw * 0.68 : m.bw * 0.32, base = m.top + m.bh;
      [[cx, base + 5, 6], [cx + (tailRight ? 10 : -10), base + 16, 3.5]].forEach(([a, b, r]) => {
        const c = el('i', 'think-dot');
        c.style.cssText = `left:${a - r}px;top:${b - r}px;width:${r * 2}px;height:${r * 2}px`;
        box.appendChild(c);
      });
    }
    box.appendChild(textEl('bal-txt k-' + item.kind, item.text, m, (m.bw - m.tw) / 2, m.top + (m.bh - m.th) / 2));
    const tag = el('span', 'bal-tag', item.name);
    tag.style.setProperty('--who', item.colour);
    tag.style.left = (m.bw / 2) + 'px';
    box.appendChild(tag);
    return box;
  }

  window.DM.balloons = { measure, draw, clearCache, measureHost };
})();
