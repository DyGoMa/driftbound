// Shared by this game's browser tests: serves the site, opens the game at a size, answers the 18+ gate like a person. Needs Chrome and playwright-core, as tools/smoke.js does.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core')].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
if (!playwright) { console.error('playwright-core not found'); process.exit(2); }

const ROOT = path.resolve(__dirname, '..', '..', '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const SIZES = { phone: { w: 390, h: 844, touch: true }, small: { w: 320, h: 568, touch: true }, short: { w: 320, h: 454, touch: true }, computer: { w: 1440, h: 900 } };

async function start() {
  const server = http.createServer((req, res) => {
    const file = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/games/split-light/index.html?test`;
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  async function open(size) {
    const s = SIZES[size];
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, hasTouch: !!s.touch, isMobile: !!s.touch, deviceScaleFactor: s.touch ? 2 : 1 });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(size + ': ' + e.message));
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);
    await page.locator('#drift-gate .yes').click();
    await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title', null, { timeout: 8000 });
    return { ctx, page };
  }
  return { open, errors, close: async () => { await browser.close(); server.close(); } };
}

// Real taps and real steps, for the tests that play a board through the input.
const HELP = `
  window.__step = (r, n = 1) => { for (let i = 0; i < n; i++) { Kit.input._begin(1 / 60); if (!r.over) { r.time += 1 / 60; SL.step(r, 1 / 60, Kit.input); } Kit.input._end(); } };
  window.__tapB = (r, id) => { const b = SL.buttons(r).find(x => x.id === id); Kit.input.sim.tap(b.x + b.w / 2, b.y + b.h / 2); __step(r, 2); };
  window.__tapC = (r, i) => { const L = r.w.L, P = SL.cellXY(r, i % L.cols, Math.floor(i / L.cols)); Kit.input.sim.tap(P.x, P.y); __step(r, 2); };
  window.__land = r => { let g = 0; while (r.w.beam && g++ < 900) __step(r); };
  window.__shot = (r, oc) => { const w = r.w; if (w.perch !== oc.perch) __tapC(r, w.L.perches[oc.perch].i); Object.keys(oc.assign).forEach(k => { if (w.lean[k] !== oc.assign[k]) __tapC(r, +k); }); __tapB(r, 'fire'); __land(r); };
  window.__solve = r => { let g = 0; while (!r.over && g++ < 12) { const w = r.w, p = SL.solve(w.L, w.S); if (!p || !p.plan.length) return false; const st = p.plan[0]; let c = 0; while (w.L.mode === 'clock' && w.S.tick !== st.tick && c++ < 2000) __step(r); __shot(r, st); if (w.gap > 0) { let q = 0; while (w.gap > 0 && q++ < 400) __step(r); return true; } } return true; };
  window.__deadLine = (L, S0) => { let line = null; const seek = (S, path) => { if (line || S.shots <= 0) return; for (const oc of SL.outcomes(L, S)) { const N = SL.after(L, S, oc.res); if (!SL.alive(N)) continue; const p = path.concat([oc]); if (N.shots > 0 && !SL.solve(L, N)) { line = p; return; } seek(N, p); } }; seek(S0, []); return line; };
`;

const fails = [];
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails.push(what); return ok; };
function finish(name, errors) {
  check(errors.length === 0, `no page errors (${errors.length})`);
  errors.slice(0, 10).forEach(e => console.log('     ' + e));
  console.log(fails.length ? `\nFAILED ${fails.length}:\n - ${fails.join('\n - ')}` : `\nPASSED: ${name}`);
  process.exit(fails.length ? 1 : 0);
}
module.exports = { start, check, finish, SIZES, HELP };
