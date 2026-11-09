// Builds the batch review page (an Artifact) from a batch file.
// Usage: node tools/review-page.js <batch.json> <outDir>
// Run tools/review-images.ps1 first: it writes <outDir>/img/<id>.jpg and <id>-<n>.jpg.
// Writes <outDir>/index.html. Publish it with the img/ files (skill step 5).
const fs = require('fs');
const path = require('path');

const [batchPath, outDir] = process.argv.slice(2);
if (!batchPath || !outDir) { console.error('usage: node tools/review-page.js <batch.json> <outDir>'); process.exit(1); }
const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const VERDICT = {
  review: ['Waiting for you', 'wait'],
  passed: ['Passed by Dylan', 'ok'],
  redo: ['Redo asked', 'bad'],
  failed: ['Open fail', 'bad'],
};

function list(cls, title, items) {
  if (!items || !items.length) return '';
  return `<div class="notes ${cls}"><h4>${title}</h4><ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
}

function item(it) {
  const [vText, vCls] = VERDICT[it.verdict] || VERDICT.review;
  const zooms = (it.zooms || []).map((z, i) => `
      <figure class="zoom">
        <button class="shot" data-full="img/${esc(it.id)}-${i + 1}.jpg" aria-label="Open ${esc(z.label)} full size">
          <img src="img/${esc(it.id)}-${i + 1}.jpg" alt="${esc(it.name)}: ${esc(z.label)}" loading="lazy">
        </button>
        <figcaption><b>${esc(z.label)}</b><span>${esc(z.why)}</span></figcaption>
      </figure>`).join('');
  return `
  <section class="item" id="${esc(it.id)}">
    <header class="item-head">
      <div>
        <h2>${esc(it.name)}</h2>
        <p class="meta">${esc(it.file)} · ${esc(it.take)} · ${esc(it.size)}</p>
      </div>
      <span class="chip ${vCls}">${vText}</span>
    </header>
    <button class="shot hero" data-full="img/${esc(it.id)}.jpg" aria-label="Open ${esc(it.name)} full size">
      <img src="img/${esc(it.id)}.jpg" alt="${esc(it.name)}, whole picture">
    </button>
    <div class="zooms">${zooms}</div>
    <div class="lists">
      ${list('fail', 'Fails (red pencil)', it.fails)}
      ${list('note', 'Notes (blue pencil)', it.notes)}
      ${list('pass', 'Checked and passed', it.passed)}
    </div>
  </section>`;
}

const waiting = batch.items.filter((i) => (i.verdict || 'review') === 'review').length;
const html = `<title>Driftbound Picture Review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600&family=IBM+Plex+Mono:wght@400&display=swap">
<style>
/* Layout: an animation-desk check sheet. One column of subjects; each shows the whole picture, then its zooms, then red-pencil fails and blue-pencil notes. */
:root {
  --paper: #eef0f2; --card: #f9fafb; --ink: #1b1f24; --muted: #59616b; --line: #d3d8de;
  --red: #c8372d; --blue: #2f62b5; --ok: #2c7a4b; --wait: #a86a12;
  --display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --body: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --paper: #15181c; --card: #1d2126; --ink: #e8ebee; --muted: #9aa3ad; --line: #2e343b;
  --red: #f06a5f; --blue: #7aa6f0; --ok: #5cc38a; --wait: #e0a64a; color-scheme: dark } }
:root[data-theme="dark"] {
  --paper: #15181c; --card: #1d2126; --ink: #e8ebee; --muted: #9aa3ad; --line: #2e343b;
  --red: #f06a5f; --blue: #7aa6f0; --ok: #5cc38a; --wait: #e0a64a; color-scheme: dark }
body { background: var(--paper); color: var(--ink); font: 16px/1.5 var(--body); }
.wrap { max-width: 1100px; margin: 0 auto; padding-block: 20px 64px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 28px; }
.top h1 { font: 700 2.2rem/1.05 var(--display); letter-spacing: .01em; margin: 0; text-wrap: balance; }
.top p { margin: 6px 0 0; color: var(--muted); }
.stats { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 12px; font: .9rem var(--mono); font-variant-numeric: tabular-nums; }
.stats b { color: var(--ink); font-weight: 400; }
.stats span { color: var(--muted); }
nav.jump { display: flex; flex-wrap: wrap; gap: 8px; }
nav.jump a { color: var(--ink); text-decoration: none; border: 1px solid var(--line); background: var(--card); padding: 4px 10px; border-radius: 999px; font-size: .9rem; }
nav.jump a:focus-visible, .shot:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }
.item { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 18px; display: grid; gap: 14px; min-width: 0; }
.item-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: start; gap: 10px; }
.item h2 { font: 700 1.6rem/1.1 var(--display); margin: 0; }
.meta { margin: 4px 0 0; font: .82rem var(--mono); color: var(--muted); overflow-wrap: anywhere; }
.chip { font: 600 .85rem var(--body); letter-spacing: .03em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; border: 1.5px solid currentColor; white-space: nowrap; }
.chip.wait { color: var(--wait); } .chip.ok { color: var(--ok); } .chip.bad { color: var(--red); }
.shot { display: block; padding: 0; border: 0; background: none; cursor: zoom-in; width: 100%; }
.shot img { display: block; width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--line); background: #6b6b6b; }
.zooms { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 14px; }
.zoom { margin: 0; display: grid; gap: 6px; min-width: 0; }
.zoom figcaption { display: grid; gap: 2px; font-size: .92rem; }
.zoom figcaption span { color: var(--muted); }
.lists { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 14px; }
.notes h4 { margin: 0 0 4px; font: 700 1rem var(--display); letter-spacing: .04em; text-transform: uppercase; }
.notes ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; }
.notes.fail h4 { color: var(--red); } .notes.note h4 { color: var(--blue); } .notes.pass h4 { color: var(--ok); }
.notes.pass li { color: var(--muted); }
dialog { border: 0; padding: 0; background: transparent; max-width: 100vw; max-height: 100vh; }
dialog::backdrop { background: rgba(0,0,0,.82); }
dialog img { display: block; max-width: 96vw; max-height: 92vh; width: auto; height: auto; }
dialog button { position: fixed; top: calc(12px + env(safe-area-inset-top, 0px)); right: calc(12px + env(safe-area-inset-right, 0px)); font: 600 1rem var(--body); padding: 6px 14px; border-radius: 999px; border: 0; cursor: pointer; }
</style>
<div class="wrap">
  <header class="top">
    <h1>${esc(batch.title)}</h1>
    <p>${esc(batch.summary)}</p>
    <div class="stats">
      <span>Date <b>${esc(batch.date)}</b></span>
      <span>Pictures this batch <b>${esc(batch.picturesThisBatch)}</b></span>
      <span>Used today <b>${esc(batch.imagesToday)} of ${esc(batch.dailyLimit)}</b></span>
      <span>Waiting for you <b>${waiting}</b></span>
    </div>
  </header>
  <nav class="jump" aria-label="Subjects">${batch.items.map((i) => `<a href="#${esc(i.id)}">${esc(i.name)}</a>`).join('')}</nav>
  ${batch.items.map(item).join('')}
</div>
<dialog id="big"><button type="button" id="close">Close</button><img id="bigimg" alt=""></dialog>
<script>
const dlg = document.getElementById('big'), big = document.getElementById('bigimg');
document.querySelectorAll('.shot').forEach((b) => b.addEventListener('click', () => {
  big.src = b.dataset.full; big.alt = b.querySelector('img').alt;
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
}));
document.getElementById('close').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
</script>
`;
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('wrote', path.join(outDir, 'index.html'), 'with', batch.items.length, 'subjects');
