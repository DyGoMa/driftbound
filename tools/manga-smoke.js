// Headless test of the manga shelf and reader: node tools/manga-smoke.js [--only 3] [--shots folder] [--overlay folder]
// Run `node tools/manga-check.js --catalog` first. Serves the site folder, answers the 18+ gate like a person, then at 375x812 and 1280x800:
//  1. the shelf: gate first, one book per catalog issue, a tap opens the detail with a READ link, no sideways scroll;
//  2. every issue in manga/catalog.js: walks every page with the arrow keys and checks each balloon sits inside its panel,
//     overlaps nothing, and that no panel or back-matter box is still overflowing after auto-fit;
//  3. collects page errors, console errors and missing files; takes screenshots of issue 1 (or --only).
// --overlay serves files from another folder first (a throwaway fixture), e.g. a test catalog. Exit code 0 only if all passed.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* try the next one */ } }
if (!playwright) { console.error('playwright-core not found. Tried: ' + PW.join(', ')); process.exit(2); }
const audit = require('./manga-smoke-audit.js');

const ROOT = path.resolve(__dirname, '..'), args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('shots', path.join(os.tmpdir(), 'kcheck', 'manga'))), OVERLAY = opt('overlay', '') && path.resolve(opt('overlay'));
const IGNORED_HOSTS = /fonts\.(googleapis|gstatic)\.com|\/favicon\.ico$/;   // no internet must not fail a page; the site has no favicon
fs.mkdirSync(OUT, { recursive: true });

function readCatalog() {
  const file = [OVERLAY && path.join(OVERLAY, 'manga', 'catalog.js'), path.join(ROOT, 'manga', 'catalog.js')].find(f => f && fs.existsSync(f));
  if (!file) { console.error('No manga/catalog.js. Run: node tools/manga-check.js --catalog'); process.exit(2); }
  const box = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), box);
  return (box.window.DRIFT_MANGA_CATALOG || []).slice().sort((a, b) => a.n - b.n);
}
const catalog = readCatalog(), only = opt('only', '') ? Number(opt('only')) : 0;
const issues = only ? catalog.filter(x => x.n === only) : catalog;

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = [OVERLAY && path.resolve(OVERLAY, rel), path.resolve(ROOT, rel)].find(f => f && (f.startsWith(ROOT) || (OVERLAY && f.startsWith(OVERLAY))) && fs.existsSync(f) && !fs.statSync(f).isDirectory());
  if (!file) { res.writeHead(404); res.end('missing'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const fails = [], offenders = [], rows = [];
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails.push(what); return ok; };
const sideScroll = page => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const state = page => page.evaluate(() => window.__mangaReader && window.__mangaReader.state());

function listen(page, problems) {
  page.on('pageerror', e => problems.push('page error: ' + e.message));
  page.on('console', m => {
    const at = (m.location() || {}).url || '';
    if (m.type() === 'error' && !IGNORED_HOSTS.test(at) && !/ERR_(NAME|INTERNET|CONNECTION)/.test(m.text())) problems.push('console error: ' + m.text() + (at ? ' at ' + at : ''));
  });
  page.on('response', r => { if (r.status() >= 400 && !IGNORED_HOSTS.test(r.url())) problems.push('missing file: ' + r.url() + ' (' + r.status() + ')'); });
}

async function shelf(page, base, size, problems) {
  const L = size.name;
  await page.goto(base + 'manga/index.html', { waitUntil: 'domcontentloaded' });
  check(await page.locator('#drift-gate').count() === 1, `${L}: shelf: the 18+ gate comes first`);
  check(await page.locator('.bk').count() === 0, `${L}: shelf: no books behind the gate`);
  await page.waitForTimeout(600);
  await page.locator('#drift-gate .yes').click();
  await page.waitForSelector('.bk', { timeout: 8000 });
  await page.waitForTimeout(400);
  check(await page.locator('.bk').count() === catalog.length, `${L}: shelf shows ${catalog.length} books (${await page.locator('.bk').count()})`);
  const sw = await sideScroll(page);
  check(sw <= 0, `${L}: shelf has no sideways scroll (${sw}px extra)`);
  await page.screenshot({ path: path.join(OUT, `${L}-shelf.png`) });
  await page.screenshot({ path: path.join(OUT, `${L}-shelf-full.png`), fullPage: true });
  const first = page.locator('.bk').first();
  await first.click();
  await page.waitForTimeout(500);
  const href = await page.locator('#detail .dt-read').getAttribute('href');
  check(href === 'read.html?i=' + catalog[0].n, `${L}: tapping a book shows its detail with READ (${href})`);
  if (size.touch) check(await page.locator('#detail.open').count() === 1, `${L}: the detail sheet rises on a phone`);
  await page.screenshot({ path: path.join(OUT, `${L}-shelf-detail.png`) });
  const sw2 = await sideScroll(page);
  check(sw2 <= 0, `${L}: no sideways scroll with the detail open (${sw2}px extra)`);
  check(problems.length === 0, `${L}: shelf has no errors (${problems.length})`);
  problems.splice(0).slice(0, 8).forEach(p => console.log('     ' + p));
}

async function readIssue(page, base, size, issue, problems, shots) {
  const L = size.name;
  await page.goto(base + 'manga/read.html?i=' + issue.n, { waitUntil: 'domcontentloaded' });
  try { await page.waitForFunction(() => window.__mangaReader && window.__mangaReader.state().ready, null, { timeout: 10000 }); }
  catch (e) { check(false, `${L}: No.${issue.n} never opened`); return; }
  await page.evaluate(() => window.__mangaReader.go(0));
  const total = { views: 0, panels: 0, items: 0, flagged: 0, geom: 0, scroll: 0, fonts: {} };
  const st0 = await state(page), fwd = st0.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  for (let v = 0; v < st0.views; v++) {
    const r = await page.evaluate(audit.inPage);
    total.views++; total.panels += r.panels; total.items += r.items;
    Object.entries(r.fonts).forEach(([f, c]) => { total.fonts[f] = (total.fonts[f] || 0) + c; });
    r.problems.forEach(p => { offenders.push(`${L} No.${issue.n} ${p}`); if (/still overflowing|text box overflows/.test(p)) total.flagged++; else total.geom++; });
    const sw = await sideScroll(page);
    if (sw > 0) { total.scroll++; offenders.push(`${L} No.${issue.n} view ${v}: sideways scroll ${sw}px`); }
    if (shots && (shots.includes(v) || v >= st0.views - 3)) await page.screenshot({ path: path.join(OUT, `${L}-read-${issue.n}-v${String(v).padStart(2, '0')}.png`) });
    if (v < st0.views - 1) {
      await page.keyboard.press(fwd);
      try { await page.waitForFunction(n => window.__mangaReader.state().at === n, v + 1, { timeout: 4000, polling: 20 }); }
      catch (e) { check(false, `${L}: No.${issue.n} the ${fwd} key did not turn from view ${v}`); break; }
    }
  }
  const sizes = Object.keys(total.fonts).map(Number).sort((a, b) => b - a);
  const row = `${L.padEnd(8)} No.${String(issue.n).padStart(2, '0')}  ${String(total.views).padStart(2)} views ${String(total.panels).padStart(3)} panels ${String(total.items).padStart(3)} items  `
    + `overflowing ${total.flagged}  outside/overlap ${total.geom}  sideways ${total.scroll}  errors ${problems.length}  text sizes ${sizes.map(s => s + ':' + total.fonts[s]).join(' ')}`;
  rows.push(row);
  console.log(row);
  if (problems.length) { fails.push(`${L} No.${issue.n}: ${problems.length} errors`); problems.splice(0).slice(0, 6).forEach(p => console.log('     ' + p)); }
  if (total.flagged || total.geom || total.scroll) fails.push(`${L} No.${issue.n}: ${total.flagged} overflowing, ${total.geom} outside/overlap, ${total.scroll} sideways`);
}

async function runSize(browser, base, size) {
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, hasTouch: !!size.touch, isMobile: !!size.touch, deviceScaleFactor: size.touch ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage(), problems = [];
  listen(page, problems);
  await shelf(page, base, size, problems);
  for (const issue of issues) await readIssue(page, base, size, issue, problems, issue === issues[0] ? [0, 1, 2, 3, 6, 10] : null);
  await audit.extras(page, base, size, issues[0], check, OUT, problems);
  check(problems.length === 0, `${size.name}: no errors in the extra checks (${problems.length})`);
  problems.slice(0, 8).forEach(p => console.log('     ' + p));
  await ctx.close();
  // The reader keeps its own gate: a fresh visitor straight to an issue gets the question first.
  const fresh = await browser.newContext({ viewport: { width: size.w, height: size.h } });
  const fp = await fresh.newPage();
  await fp.goto(base + 'manga/read.html?i=' + issues[0].n, { waitUntil: 'domcontentloaded' });
  check(await fp.locator('#drift-gate').count() === 1 && await fp.locator('#stage').count() === 0, `${size.name}: reader asks the 18+ question first, nothing behind it`);
  await fresh.close();
}

(async () => {
  if (!issues.length) { console.error('No issues to test.'); process.exit(2); }
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const size of [{ name: 'phone', w: 375, h: 812, touch: true }, { name: 'computer', w: 1280, h: 800 }]) await runSize(browser, base, size);
  } catch (e) { check(false, 'the test itself stopped: ' + e.message); }
  await browser.close();
  server.close();
  console.log('\nPer issue:\n' + rows.join('\n'));
  console.log(`\nOffenders (${offenders.length}):` + (offenders.length ? '\n - ' + offenders.slice(0, 80).join('\n - ') : ' none'));
  console.log(`Screenshots: ${OUT}`);
  console.log(fails.length ? `FAILED ${fails.length}:\n - ${fails.join('\n - ')}` : `PASSED: shelf and ${issues.length} issue(s) at 375x812 and 1280x800`);
  process.exit(fails.length ? 1 : 0);
})();
