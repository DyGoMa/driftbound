// Batch rule: pals are never in flirting or innuendo, lose screens included. node games/tide-gap/test/pal-talk.js [folder for screenshots]
// The game's own spawn code brings Bobbin up (only the chance and the calm timer are set) and the kit's real result screen shows the line. Proves rules and wiring, not how it reads.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const OUT = process.argv[2] || path.join(os.tmpdir(), 'kcheck', 'final', 'tg-pals');
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('x'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
let fails = 0;
const check = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) fails++; };

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/games/tide-gap/index.html?test`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
  const wait = ms => page.waitForTimeout(ms);

  // A helper in the page: start a stage with open water, a recorder on the talk box, and maybe Bobbin brought up by the game's own code.
  await page.evaluate(() => {
    localStorage.clear(); DriftSave.load();
    window.__blank = () => ({ rows: TG.MEMORIES.map(m => ({ lost: m.id })), lost: TG.MEMORIES.map(m => m.id), pagesFound: 0, sparesUsed: 0 });
    window.__start = (index, o = {}) => {
      TUNE.bobbinChance = o.bobbin ? 1 : 0; TUNE.mopChance = 0;
      __kit.bot(false);
      __kit.jump(index, { fair: true, seed: 5, carry: o.carry });
      const r = __kit.run(), w = r.w;
      w.laid.end = 1e9; w.rocks = []; w.gates = []; w.items = []; w.scene = [];
      r.heard = []; const say = r.say; r.say = (who, text, secs, at) => { r.heard.push({ who, text }); say(who, text, secs, at); };
      if (o.bobbin) { w.calm = 99; w.bobbinTried = false; }
      return r;
    };
    window.__mop = (r) => { const w = r.w, rock = TG.makeRock({ side: 'M', x0: 60, w: 60, at: w.dist + 300, len: 120, from: 0, to: 0, drift: 0 }); rock.mop = true; w.rocks.push(rock); w.mop = { x: 60, at: rock.at, rock, said: true }; return rock; };
    window.__radio = (r, keep) => { const w = r.w; r.time = TUNE.hintSecs + 1; w.scene = []; w.say = []; w.sayGap = 0; w.radio = r.stage.radio.filter(keep); };
  });
  const untilBobbin = () => page.waitForFunction(() => { const b = __kit.run().w.bobbin; return b && !b.gone; }, null, { timeout: 8000 });
  const resultLine = async () => { await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 10000 }); return page.evaluate(() => { const b = document.querySelector('.kit-line'); return { who: (document.querySelector('.kit-who') || {}).textContent, text: b && b.textContent, bobbin: __kit.run().w.bobbin, mop: !!__kit.run().w.mop }; }); };

  // ---- Win screen, stage 2.
  await page.evaluate(() => { __start(1, { bobbin: true }); });
  await untilBobbin();
  await page.evaluate(() => { const r = __kit.run(); r.w.dist = r.stage.length - 40; });
  const winPal = await resultLine();
  await wait(500);
  await page.screenshot({ path: path.join(OUT, 'win-bobbin.png') });
  console.log('     ' + JSON.stringify(winPal));
  check(winPal.bobbin && !winPal.bobbin.gone && !/sore/.test(winPal.text) && winPal.text, 'stage 2 win, Bobbin out: a line, and not the joke');
  await page.evaluate(() => { const r = __start(1); r.w.dist = r.stage.length - 40; });
  const winNo = await resultLine();
  console.log('     ' + JSON.stringify(winNo));
  check(/sore/.test(winNo.text), 'stage 2 win, no pal: the joke still plays');

  // ---- Radio, stage 4: Bobbin out, then the line that follows it.
  const silas = l => /in love/.test(l.text);
  await page.evaluate(() => { const r = __start(3, { bobbin: true }); });
  await untilBobbin();
  await page.evaluate(() => { const r = __kit.run(), w = r.w; __radio(r, l => l.who === 'silas' || l.who === 'sela'); w.dist = r.stage.length * 0.56; w.lanceT = 1e9; w.bobbin.t = -30; });
  await wait(1500);
  const radio1 = await page.evaluate(() => { const r = __kit.run(), w = r.w; w.dist = r.stage.length * 0.86; w.bobbin.t = -30; return { heard: r.heard.slice(), left: w.radio.length, box: (document.querySelector('.kit-say') || {}).textContent, bobbin: w.bobbin }; });
  await page.screenshot({ path: path.join(OUT, 'radio-bobbin.png') });
  await wait(1500);
  const radio1b = await page.evaluate(() => __kit.run().heard.slice());
  console.log('     ' + JSON.stringify(radio1b.filter(h => h.who === 'silas' || h.who === 'sela')));
  check(!radio1.heard.some(silas) && !radio1b.some(silas), 'stage 4 radio, Bobbin out: Silas\'s line keeps quiet');
  check(radio1b.some(h => /last tooth/.test(h.text)), 'stage 4 radio, Bobbin out: the next radio line still plays');

  await page.evaluate(() => { const r = __start(3), w = r.w; w.lanceT = 1e9; __radio(r, l => l.who === 'silas'); w.dist = r.stage.length * 0.56; });
  await wait(800);
  check((await page.evaluate(() => __kit.run().heard)).some(silas), 'stage 4 radio, no pal: Silas\'s line still plays');

  // ---- A joke already waiting in the queue, and one already showing, when Bobbin comes up.
  const queued = await page.evaluate(() => { const r = __start(3), w = r.w; w.lanceT = 1e9; const line = r.stage.radio.find(l => l.who === 'silas'); w.sayGap = 1; TG.sayOne(r, line); return w.say.length; });
  await page.evaluate(() => { const r = __kit.run(), w = r.w; w.calm = 99; TUNE.bobbinChance = 1; });
  await untilBobbin();
  await page.evaluate(() => { __kit.run().w.bobbin.t = -30; });
  await wait(1500);
  const q = await page.evaluate(() => __kit.run().heard);
  check(queued === 1 && !q.some(silas), `a joke still waiting when Bobbin comes up is dropped: ${JSON.stringify(q.map(h => h.who))}`);

  await page.evaluate(() => { const r = __start(3), w = r.w; w.lanceT = 1e9; TG.sayNow(r, r.stage.radio.find(l => l.who === 'silas')); });
  await wait(300);
  const up = await page.evaluate(() => (document.querySelector('.kit-say') || {}).textContent);
  await page.evaluate(() => { __kit.run().w.calm = 99; TUNE.bobbinChance = 1; });
  await untilBobbin();
  await wait(100);
  const box = await page.evaluate(() => (document.querySelector('.kit-say') || {}).textContent);
  console.log(`     box before: ${up}\n     box after:  ${box}`);
  check(/in love/.test(up) && !/in love/.test(box) && /buoy/.test(box), 'a joke showing when Bobbin comes up is replaced by the crew spotting it');

  // ---- Mopclaw's tuft: laid by the game's own code it counts from the moment it exists, and stops once its rock has gone by.
  const laid = await page.evaluate(() => {
    TUNE.palBot = 'mopclaw'; __kit.bot(false); __kit.jump(2, { fair: true, seed: 5 }); const r = __kit.run(), w = r.w;
    for (let d = 0; d < 6000 && !w.mop; d += 50) { w.dist = d; TG.layAhead(r, w); }
    TUNE.palBot = false;
    const out = { ahead: w.mop ? w.mop.at - w.dist : null, around: w.mop && TG.palAround(w), view: TUNE.shipY, call: TUNE.mopCallAt };
    return out;
  });
  console.log('     ' + JSON.stringify(laid));
  check(laid.around === true && laid.ahead > laid.call, 'Mopclaw\'s tuft is laid and counted before the crew call it, and well before it can show');
  await page.evaluate(() => { const r = __start(3), w = r.w; w.lanceT = 1e9; __mop(r); __radio(r, l => l.who === 'silas'); w.dist = r.stage.length * 0.56; w.mop.at = w.dist + 200; w.mop.rock.at = w.mop.at; });
  await wait(700);
  const m1 = await page.evaluate(() => { const r = __kit.run(), w = r.w; return { heard: r.heard.slice(), around: TG.palAround(w), y: TG.yOf(w, w.mop.at) }; });
  await page.screenshot({ path: path.join(OUT, 'radio-mop.png') });
  check(m1.around && !m1.heard.some(silas), `stage 4 radio, mop tuft on screen: Silas keeps quiet (tuft at y ${Math.round(m1.y)})`);
  const gone = await page.evaluate(() => { const r = __kit.run(), w = r.w; w.dist = w.mop.at + w.mop.rock.len / 2 + 300; return new Promise(ok => setTimeout(() => ok(TG.palAround(w)), 200)); });
  check(gone === false, 'once its rock has gone by, the tuft no longer counts');

  // ---- Lose screens. The line itself is only a look, so sample it many times.
  const sample = await page.evaluate(() => {
    const out = {};
    const take = (name, r) => { const seen = {}; for (let i = 0; i < 300; i++) { const l = Kit.def.loseLine(r); const t = l ? l.text : '(kit picks)'; seen[t] = (seen[t] || 0) + 1; } out[name] = Object.keys(seen); };
    let r = __start(1, { carry: __blank() }); take('blank, no pal', r);
    r.w.bobbin = { x: 70, t: 0, hold: 0, gone: false }; take('blank, Bobbin', r);
    r.w.bobbin.gone = true; take('blank, Bobbin gone', r);
    r = __start(2, { carry: __blank() }); __mop(r); take('blank, tuft', r);
    r = __start(1); r.w.lastCause = 'rock'; take('book, no pal', r);
    r.w.bobbin = { x: 70, t: 0, hold: 0, gone: false }; take('book, Bobbin', r);
    r = __start(2); __mop(r); r.w.lastCause = 'lance'; take('book, tuft', r);
    out.adult = TG.WORDS.emptyLose.concat(TG.WORDS.loseLines).filter(l => l.adult).map(l => l.text);
    return out;
  });
  const joke = /marry|done this before\. Again|go between/;
  const bad = name => sample[name].filter(t => joke.test(t) && !/I've done this before/.test(t));
  for (const n of ['blank, Bobbin', 'blank, tuft', 'book, Bobbin', 'book, tuft']) {
    console.log(`     ${n}: ${sample[n].length} lines${sample[n].includes('(kit picks)') ? ', and the kit picks sometimes' : ''}`);
    check(!bad(n).length && !sample[n].includes('(kit picks)') && sample[n].length >= 3, `${n}: only clean lines, and the kit's unfiltered list is never used`);
  }
  check(bad('blank, no pal').length === 2 && bad('blank, Bobbin gone').length === 2, `blank book, no pal or Bobbin gone: the jokes still play (${bad('blank, no pal').length}, ${bad('blank, Bobbin gone').length})`);
  check(sample['book, no pal'].includes('(kit picks)'), 'ordinary lose, no pal: the kit\'s full list still plays');

  // Through the real result screen, on a blank book with Bobbin behind the panel.
  let saw = [];
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => { __start(1, { bobbin: true, carry: __blank() }); });
    await untilBobbin();
    await page.evaluate(() => { const r = __kit.run(), w = r.w; w.hullLeft = 1; w.inv = 0; TG.knock(r, 'lance'); });
    const l = await resultLine();
    saw.push(l.text);
    if (i === 0) { await wait(500); await page.screenshot({ path: path.join(OUT, 'lose-bobbin.png') }); }
  }
  console.log('     ' + saw.join('\n     '));
  check(saw.every(t => t && !joke.test(t)), 'blank book, Bobbin behind the real lose screen, 12 goes: no joke');

  check(!errs.length, `no page errors ${errs.join(' | ')}`);
  await browser.close(); server.close();
  console.log(fails ? `${fails} FAILED` : 'all passed');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
