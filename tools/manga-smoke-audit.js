// Helpers for tools/manga-smoke.js: the in-page balloon audit, and the one-off reader checks (taps, zoom, settings, spread, file://).
const path = require('path');

// Runs inside the page. Checks every item on the pages now on screen, in logical page units.
function inPage() {
  const out = { panels: 0, items: 0, fonts: {}, problems: [] };
  const inside = (pts, x, y) => {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (Math.abs(c) < 1e-3) continue;
      if (!s) s = Math.sign(c); else if (Math.sign(c) !== s) return false;
    }
    return true;
  };
  document.querySelectorAll('#stage .leaf:not(.leaving)').forEach(leaf => {
    const page = leaf.firstElementChild;
    const where = page.dataset.pageIndex !== undefined ? 'page entry ' + (Number(page.dataset.pageIndex) + 1) : page.className.replace('page ', '');
    page.querySelectorAll('.panel').forEach(panel => {
      out.panels++;
      const pts = JSON.parse(panel.dataset.poly), at = where + ' panel ' + (Number(panel.dataset.index) + 1), rects = [];
      if (panel.dataset.overflow) out.problems.push(at + ': still overflowing after auto-fit');
      panel.querySelectorAll('.item').forEach(it => {
        out.items++;
        out.fonts[it.dataset.font] = (out.fonts[it.dataset.font] || 0) + 1;
        const x = parseFloat(it.style.left), y = parseFloat(it.style.top), w = it.offsetWidth, h = it.offsetHeight;
        rects.push({ x, y, w, h, kind: it.dataset.item });
        if (![[x, y], [x + w, y], [x + w, y + h], [x, y + h]].every(p => inside(pts, p[0], p[1]))) out.problems.push(at + ': ' + it.dataset.item + ' goes outside the panel');
        const t = it.querySelector('.bal-txt, .cap-txt, .sfx-txt');
        if (t && t.scrollWidth > t.clientWidth + 1) out.problems.push(at + ': text box overflows (' + it.dataset.item + ')');
      });
      rects.forEach((a, i) => rects.slice(i + 1).forEach(b => {
        if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) out.problems.push(at + ': ' + a.kind + ' overlaps ' + b.kind);
      }));
    });
    page.querySelectorAll('[data-fitbox]').forEach(b => {
      if (b.dataset.overflow || b.scrollHeight > b.clientHeight + 1) out.problems.push(where + ': ' + b.dataset.fitbox + ' still overflowing after auto-fit');
    });
  });
  return out;
}

const st = page => page.evaluate(() => window.__mangaReader.state());
const waitAt = (page, n) => page.waitForFunction(v => window.__mangaReader.state().at === v, n, { timeout: 4000 }).then(() => true, () => false);

async function open(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__mangaReader && window.__mangaReader.state().ready, null, { timeout: 10000 });
}

// Real taps, the zoom sheet, the hint, both settings (and that they're remembered), a spread, the back page, and file://.
async function extras(page, base, size, issue, check, OUT, problems) {
  const L = size.name, url = base + 'manga/read.html?i=' + issue.n, shot = n => page.screenshot({ path: path.join(OUT, `${L}-${n}.png`) });
  await page.evaluate(() => { try { localStorage.removeItem('driftbound-manga-v1'); } catch (e) { /* blocked */ } });
  await open(page, url);
  check(await page.locator('#hint').isVisible(), `${L}: first visit shows the which-way hint`);
  await shot('hint');
  const box = await page.locator('#stage').boundingBox();
  await page.mouse.click(box.x + 12, box.y + box.height / 2);
  check(await waitAt(page, 1), `${L}: a tap on the LEFT edge turns forward (right to left)`);
  check(!(await page.locator('#hint').isVisible()), `${L}: the hint goes after the first turn`);
  await page.mouse.click(box.x + box.width - 12, box.y + box.height / 2);
  check(await waitAt(page, 0), `${L}: a tap on the right edge turns back`);

  // Zoom: the middle of the first panel on the first story page.
  await page.evaluate(() => window.__mangaReader.go(1));
  const target = await page.evaluate(() => {
    const leaf = [...document.querySelectorAll('#stage .leaf')].find(l => l.querySelector('.panel'));
    const panel = leaf.querySelector('.panel'), pts = JSON.parse(panel.dataset.poly), r = leaf.getBoundingClientRect(), s = parseFloat(leaf.dataset.s);
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return { x: r.left + s * (Math.min(...xs) + Math.max(...xs)) / 2, y: r.top + s * (Math.min(...ys) + Math.max(...ys)) / 2 };
  });
  await page.mouse.click(target.x, target.y);
  await page.waitForTimeout(200);
  check(await page.locator('#zoom').isVisible(), `${L}: a tap in a panel's middle opens the zoom sheet`);
  check((await st(page)).at === 1, `${L}: ...and doesn't turn the page`);
  await shot('zoom');
  const zs = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(zs <= 0, `${L}: no sideways scroll with the zoom open (${zs}px)`);
  await page.keyboard.press('Escape');
  check(!(await page.locator('#zoom').isVisible()), `${L}: Escape closes the zoom`);

  // Settings: left to right mirrors the panels; hide art notes; both remembered after a reload.
  const before = await page.evaluate(() => document.querySelector('#stage .panel').dataset.poly);
  await page.locator('#settings-btn').click();
  await page.locator('[data-dir="ltr"]').click();
  await page.locator('[data-notes="off"]').click();
  await page.locator('.set-done').click();
  const after = await page.evaluate(() => document.querySelector('#stage .panel').dataset.poly);
  const mirrored = JSON.parse(before).every((p, i) => Math.abs(JSON.parse(after)[i][0] - (800 - p[0])) < 0.2 || Math.abs(JSON.parse(after)[i][0] - (1600 - p[0])) < 0.2);
  check(mirrored, `${L}: left-to-right mirrors the panel shapes`);
  check(!(await page.locator('#stage .brief').first().isVisible()), `${L}: Hide art notes hides the notes`);
  await shot('ltr-notes-off');
  await open(page, url);
  const s2 = await st(page);
  check(s2.dir === 'ltr' && s2.at === 1, `${L}: direction and page are remembered (${s2.dir}, view ${s2.at})`);
  check(await page.evaluate(() => document.documentElement.classList.contains('no-notes')), `${L}: hidden notes are remembered`);
  await page.locator('#settings-btn').click();
  await page.locator('[data-dir="rtl"]').click();
  await page.locator('[data-notes="on"]').click();
  await page.locator('.set-done').click();

  // A spread, if this issue has one, and the back page.
  const wideAt = await page.evaluate(() => { const r = window.DM.reader; return r.views.findIndex(v => v.wide); });
  if (wideAt >= 0) { await page.evaluate(v => window.__mangaReader.go(v), wideAt); await page.waitForTimeout(150); await shot('spread'); }
  const last = (await st(page)).views - 1;
  await page.evaluate(v => window.__mangaReader.go(v), last);
  await page.waitForTimeout(150);
  await shot('backpage');
  check(await page.locator('#stage .bp-btn[href="index.html"]').count() === 1, `${L}: the back page has a button back to the shelf`);
  const nextHref = await page.locator('#stage .bp-btn[href^="read.html"]').getAttribute('href').catch(() => null);
  const expect = await page.evaluate(n => { const x = window.DM.nextIssue(n, window.DM.isSide(window.DM.reader.issue)); return x ? 'read.html?i=' + x.n : null; }, issue.n);
  check(nextHref === expect, `${L}: next-issue button only when the next issue is on the shelf (${nextHref})`);
  await page.locator('#stage .bp-btn[href="index.html"]').click();
  await page.waitForSelector('.bk', { timeout: 8000 });
  check(await page.locator(`.bk[data-n="${issue.n}"].read`).count() === 1, `${L}: the shelf shows No.${issue.n} as read`);
  await shot('shelf-after');

  if (L === 'phone') {   // Straight from the files, as a static copy would be opened.
    const fileUrl = 'file:///' + path.resolve(__dirname, '..', 'manga', 'read.html').replace(/\\/g, '/') + '?i=' + issue.n;
    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    if (await page.locator('#drift-gate .yes').count()) { await page.waitForTimeout(600); await page.locator('#drift-gate .yes').click(); }
    const ok = await page.waitForFunction(() => window.__mangaReader && window.__mangaReader.state().ready, null, { timeout: 10000 }).then(() => true, () => false);
    check(ok, `${L}: the reader works from file://`);
  }
}

module.exports = { inPage, extras };
