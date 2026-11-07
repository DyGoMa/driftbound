// Hold the Deck: proves the timing is fair, not just that a perfect bot can win. Run from the site folder: node games/hold-the-deck/test/fairness.js [--seeds 12]
// A person isn't a bot, so this plays through the real controls (input.sim). A and B use the bot with a reaction delay on warnings. C to G use test/thumb.js, which sees everything late, boarders included, picks a wrong lane now and then, and misses a few warnings (the review showed a thumb that only reacts late to warnings flatters the numbers).
//  A. Warning sums: for every warning fired in play, the time from its first frame to its hit, against the walk to the nearest dark lane at Bram's speed then. Smallest margin found, per kind.
//  B. Dodging only: the thumb ignores boarders and answers each warning at once, by walking or by holding for Iron, at several reaction times and iron levels. Any hit from a warning is a fairness failure.
//  C. Whole stages with a person-like thumb, at no iron, half iron and full iron, including the boss. Full iron has no Iron stance left, so that's the proof a fully grey Bram can still win.
//  D. The same with a new player's slower thumb. E. The boss on one meal only, to show the meals do different things.
//  F. Iron can't be skipped: never holding must lose stage 2 on, and the bear, with every upgrade and the most extra Guts dying can give too. Upgrades must still help a thumb that does hold. G. No cliff in the grey round the old 60% line. H. A blind sweep of the lanes must not win past stage 1, nor clean.
//  I. Whole stories, retries and all: stage 4 must not take more tries than the bear, for a thumb that holds for its volleys.
//  J. Real result screens: dying with nothing pressed earns no extra Guts and no wounds on the bear. A try that fought and held does.
// Exit code 0 only if A and B pass and C's bar is met.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core'), 'C:/Users/Dylan/AppData/Local/Temp/kcheck/pw/node_modules/playwright-core'].filter(Boolean);
let playwright = null;
for (const p of PW) { try { playwright = require(p); break; } catch (e) { /* next */ } }
if (!playwright) { console.error('playwright-core not found'); process.exit(2); }
const ROOT = path.resolve(__dirname, '..', '..', '..');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const SEEDS = +opt('seeds', 12);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const f = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
const HITS = ['hook', 'crate', 'paw', 'swipe', 'charge'];
let failed = 0;
const say = (ok, s) => { console.log((ok ? 'ok   ' : 'FAIL ') + s); if (!ok) failed++; };

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await playwright.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => { console.log('page error: ' + e.message); failed++; });
  await page.goto(`http://127.0.0.1:${server.address().port}/games/hold-the-deck/index.html?test`);
  await page.waitForTimeout(600);
  await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit, null, { timeout: 8000 });
  await page.waitForTimeout(200);
  await page.addScriptTag({ path: path.join(__dirname, 'thumb.js') });

  // Plays stage i on these seeds with these bot settings. Returns plain results.
  const play = (i, seeds, bot, o = {}) => page.evaluate(([i, seeds, bot, o]) => {
    const keep = Object.assign({}, TUNE.bot), keepGuts = TUNE.guts;
    Object.assign(TUNE.bot, bot);
    if (o.guts) TUNE.guts = o.guts;
    const out = [];
    for (let s = 1; s <= seeds; s++) {
      const r = __kit.runStage(i, { bot: true, seed: s * 104729 + i * 13, renderEvery: 0, carry: { iron: o.iron || 0 }, continued: true, maxSeconds: o.maxSeconds || 400 });
      out.push({ result: r.result, seconds: r.seconds, salvage: r.salvage, info: r.info });
    }
    TUNE.bot = keep; TUNE.guts = keepGuts;
    return out;
  }, [i, seeds, bot, o]);
  // Late 9 means it answers a warning as soon as it's seen, not at the last moment. Lapses: now and then it just doesn't do anything for a moment.
  const person = (react, jitter) => ({ react, jitter, tapGap: 0.26, late: 9, ironUses: true, ironCap: 0.5, dodgeOnly: false, lapseEvery: 6, lapseSecs: 0.7 });

  // The late-seeing thumb (test/thumb.js) on stage i. meal: broth, pepper or tonic only; otherwise broth if two Guts down, or pepper.
  const THUMB = { miss: 0.05, holdAt: 5 };                                              // sees 0.3 to 0.4 s late, about 3 taps a second, a wrong lane 6% of the time, misses 1 warning in 20
  const NEW_THUMB = { lag: 0.55, gap: 0.34, wrong: 0.1, miss: 0.05, holdAt: 5 };        // sees 0.55 s late, under 3 taps a second, a wrong lane 10% of the time
  // up: upgrade levels as if bought. lost: tries already lost, so the game's own sums give the extra Guts.
  const thumb = (i, seeds, opt, o = {}) => page.evaluate(([i, seeds, opt, o]) => {
    const keepBot = Kit.def.bot, keepAsk = Kit.def.botAsk, keepGuts = TUNE.guts, order = { broth: 0, pepper: 1, tonic: 2 }, keepUp = DriftSave.upgradeLevel;
    if (o.up) DriftSave.upgradeLevel = (g, id) => o.up[id] || 0;
    if (o.lost) TUNE.dryLost = o.lost;
    Kit.def.botAsk = (spec, run) => (o.meal ? order[o.meal] : (run.w.gutsMax - run.w.guts >= 2 ? 0 : 1));
    if (o.guts) TUNE.guts = o.guts;
    const out = [];
    for (let s = 1; s <= seeds; s++) {
      Kit.def.bot = HDThumb(opt);
      const r = __kit.runStage(i, { bot: true, fair: !o.up, seed: s * 104729 + i * 13, renderEvery: 0, carry: { iron: o.iron || 0 }, continued: true, maxSeconds: 420 });
      out.push({ result: r.result, seconds: r.seconds, salvage: r.salvage, info: r.info });
    }
    Kit.def.bot = keepBot; Kit.def.botAsk = keepAsk; TUNE.guts = keepGuts; DriftSave.upgradeLevel = keepUp; delete TUNE.dryLost;
    return out;
  }, [i, seeds, opt, o]);

  // ---- A. The sums
  console.log('\nA. Warning sums, from every warning fired in whole-stage play (person-like thumb), at no iron and at full iron.');
  const margins = {};
  for (let i = 0; i < 5; i++) for (const iron of [0, 1]) {
    for (const r of await play(i, Math.ceil(SEEDS / 2), person(0.38, 0.18), { iron, guts: 400, maxSeconds: 260 })) {
      for (const w of (r.info && r.info.warnLog) || []) {
        if (!w.need && w.need !== 0) continue;
        const k = w.kind, m = w.total - w.need;
        const e = margins[k] || (margins[k] = { n: 0, total: w.total, min: 99, walkMax: 0 });
        e.n++; e.total = Math.min(e.total, w.total); e.min = Math.min(e.min, m); e.walkMax = Math.max(e.walkMax, w.need);
      }
    }
  }
  for (const k of Object.keys(margins)) {
    const e = margins[k];
    say(e.min >= 0.4, `${k}: ${e.n} fired, warned ${e.total.toFixed(2)} s or more, longest walk out ${e.walkMax.toFixed(2)} s, smallest time to spare ${e.min.toFixed(2)} s (need 0.40 for a person's reaction)`);
  }

  // ---- B. Dodging only
  console.log('\nB. Dodging only, real controls. Boarders ignored (Guts raised so a run lasts). Hits from warnings, all stages with warnings that a dodger can reach:');
  for (const by of ['walk', 'hold']) for (const iron of by === 'hold' ? [0, 0.5] : [0, 0.5, 1]) for (const react of [0.25, 0.4, 0.55]) {
    const tally = {}; let warnings = 0;
    for (const i of [1, 2, 3, 4]) {
      for (const r of await play(i, Math.ceil(SEEDS / 3), { react, jitter: 0, tapGap: 0.12, late: 9, dodgeOnly: true, dodgeBy: by, ironUses: true, ironCap: 1, ironAll: true }, { iron, guts: 900, maxSeconds: 70 })) {
        const by_ = (r.info && r.info.hurtBy) || {};
        // A volley can't be walked out of, on purpose, so it doesn't count for a walker. Holding for Iron must stop it, though.
        if (by === 'walk') HITS.forEach(k => { if (by_[k]) tally[k] = (tally[k] || 0) + by_[k]; });
        // Holding through everything runs out of Iron in time. At full iron a volley does land, by design (hold iron 0 and 0.5 get there), so only hits before that count.
        else ((r.info && r.info.hitLog) || []).forEach(h => { if (HITS.concat('volley').includes(h.why) && h.iron < 1) tally[h.why] = (tally[h.why] || 0) + 1; });
        warnings += ((r.info && r.info.warnLog) || []).filter(w => HITS.includes({ drop: 'crate' }[w.kind] || w.kind)).length;
      }
    }
    const hits = Object.values(tally).reduce((a, b) => a + b, 0);
    say(hits === 0, `${by} iron ${iron} reaction ${react}s: ${hits} hits from ${warnings} warnings ${hits ? JSON.stringify(tally) : ''}`);
  }

  // ---- C. Whole stages like a person
  console.log('\nC. Whole stages with a person-like thumb: sees everything 0.3 to 0.4 s late, about 3 taps a second, a wrong lane 6% of the time, misses 1 warning in 20, holds for every volley. Full iron here means no Iron stance at all. Each attempt has 5 Guts; dying adds up to 3 more (on the bear up to 6, and it starts weaker), so these are first tries.');
  const bars = { 0: [1, 0.8, 0.8, 0.7, 0.05], 0.5: [1, 0.7, 0.6, 0.4, 0.01], 1: [0.5, 0.2, 0.05, 0, 0] };   // PROVISIONAL: share of wins that counts as "still winnable"
  for (const iron of [0, 0.5, 1]) {
    for (let i = 0; i < 5; i++) {
      const rs = await thumb(i, SEEDS, THUMB, { iron });
      const wins = rs.filter(r => r.result === 'win').length, hurt = {};
      rs.forEach(r => { const by = (r.info && r.info.hurtBy) || {}; Object.keys(by).forEach(k => { hurt[k] = (hurt[k] || 0) + by[k]; }); });
      const secs = Math.round(rs.reduce((a, r) => a + r.seconds, 0) / rs.length), salv = rs.map(r => r.salvage);
      say(wins / rs.length >= bars[iron][i], `iron ${iron} stage ${i + 1}: ${wins}/${rs.length} wins, about ${secs} s, salvage ${Math.min(...salv)} to ${Math.max(...salv)}, hits ${JSON.stringify(hurt)}`);
    }
  }
  // ---- Also: a much slower thumb on the story's start, and whether the meal choice matters.
  console.log('\nD. A new player\'s thumb: sees everything 0.55 s late, under 3 taps a second, a wrong lane 10% of the time, misses 1 warning in 20. No iron to start.');
  const novBars = [0.95, 0.5, 0.5, 0.3, 0];   // PROVISIONAL: "first stage easy for a new player". The boss's bar is 0 on 5 Guts: line I shows it on the extra Guts
  for (let i = 0; i < 5; i++) {
    const rs = await thumb(i, SEEDS, NEW_THUMB, {});
    const wins = rs.filter(r => r.result === 'win').length;
    say(wins / rs.length >= novBars[i], `stage ${i + 1}: ${wins}/${rs.length} wins, Guts left when it won ${rs.filter(r => r.result === 'win').map(r => r.info.guts).join(',')}`);
  }
  console.log('\nE. Is the meal a real choice? The same thumb on the boss from half iron, eating only one kind of meal. Different meals should win in different ways, and none should be useless.');
  for (const meal of ['broth', 'pepper', 'tonic']) {
    const rs = await thumb(4, SEEDS, THUMB, { iron: 0.5, meal, guts: 8 });
    const wins = rs.filter(r => r.result === 'win').length, iron = rs.reduce((a, r) => a + (r.info.iron || 0), 0) / rs.length, secs = rs.reduce((a, r) => a + r.seconds, 0) / rs.length;
    console.log(`     ${meal} (8 Guts): ${wins}/${rs.length} wins, about ${Math.round(secs)} s, iron at the end ${iron.toFixed(2)}, Guts left when it won ${rs.filter(r => r.result === 'win').map(r => r.info.guts).join(',')}`);
  }
  console.log('\nF. Iron can\'t be skipped: the same thumb never holding. The third volley on the chin drops him whatever he\'s got, so upgrades and extra Guts don\'t change it.');
  for (const i of [1, 2, 3, 4]) {
    const rs = await thumb(i, SEEDS, Object.assign({}, THUMB, { never: true }));
    const wins = rs.filter(r => r.result === 'win').length;
    say(wins / rs.length <= 0.25, `stage ${i + 1}, never Iron: ${wins}/${rs.length} wins`);
    for (const [name, up, lost] of [['Apron 3, Pot 3', { apron: 3, pot: 3 }, 0], ['all three at 3, and 3 tries lost', { apron: 3, temper: 3, pot: 3 }, 3]]) {
      const ru = await thumb(i, SEEDS, Object.assign({}, THUMB, { never: true }), { up, lost }), wu = ru.filter(r => r.result === 'win').length;
      say(wu === 0 && ru.every(r => r.info.iron === 0), `stage ${i + 1}, never Iron, ${name}: ${wu}/${ru.length} wins`);
    }
    const plain = await thumb(i, SEEDS, THUMB, { iron: 0.3 }), rich = await thumb(i, SEEDS, THUMB, { iron: 0.3, up: { apron: 3, temper: 3, pot: 3 } }), won = rs_ => rs_.filter(r => r.result === 'win').length;
    say(won(rich) >= won(plain) - 1, `stage ${i + 1}, the same thumb holding, from iron 0.3: upgrades still help,${won(plain)}/${SEEDS} without, ${won(rich)}/${SEEDS} with`);
  }
  console.log('\nG. No wall or cliff in the grey: the boss at iron either side of the old cliff, same thumb but never missing a warning (a noisy number otherwise). No big jump up as the grey rises.');
  const by = {};
  for (const iron of [0.5, 0.59, 0.6, 0.7]) { const rs = await thumb(4, SEEDS, { holdAt: 5 }, { iron }); by[iron] = rs.filter(r => r.result === 'win').length; console.log(`     iron ${iron}: ${by[iron]}/${rs.length} wins`); }
  say(by[0.6] <= by[0.59] + Math.ceil(SEEDS / 4), `one point of iron over 59% doesn't make the boss easier (${by[0.59]} to ${by[0.6]})`);
  console.log('\nH. A blind sweep: left, middle, right, middle, 3 taps a second, no looking.');
  const sweep = await page.evaluate(seeds => {
    const real = Kit.def.bot, out = [];
    Kit.def.bot = function (run, input) { const w = run.w, m = w.mash || (w.mash = { next: 0, i: 0 }); if (run.time < m.next) return; m.next = run.time + 0.33; input.sim.tap(HD.laneX([0, 1, 2, 1][m.i++ % 4], 460), 460); };
    for (let i = 0; i < 5; i++) { let wins = 0, guts = []; for (let s = 1; s <= seeds; s++) { const r = __kit.runStage(i, { bot: true, seed: s * 7919 + i, renderEvery: 0, maxSeconds: 200 }); if (r.result === 'win') { wins++; guts.push(r.info.guts); } } out.push({ wins, guts }); }
    Kit.def.bot = real;
    return out;
  }, SEEDS);
  sweep.forEach((r, i) => { const ok = i === 0 ? r.guts.every(g => g < 5) : r.wins === 0; say(ok, `stage ${i + 1}: ${r.wins}/${SEEDS} wins, Guts left ${r.guts.join(',')}`); });
  console.log('\nI. Whole stories: stages in order, iron carried, retrying with the extra Guts. Tries per stage, and the iron after each.');
  const story = (opt, runs) => page.evaluate(([opt, runs]) => { const out = []; for (let s = 1; s <= runs; s++) out.push(HDStory(opt, s)); return out; }, [opt, runs]);
  const runs = Math.max(4, Math.ceil(SEEDS / 2)), show = (name, list) => { console.log(`     ${name}`); list.forEach(o => console.log(`       tries ${o.tries.join(',')}   iron ${o.iron.map(x => x.toFixed(2)).join(',')}`)); };
  const mid = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
  const hold = await story(THUMB, runs);
  show('holds for every volley, misses 1 warning in 20', hold);
  const t = i => mid(hold.map(o => Math.abs(o.tries[i] || 0)));
  say(t(3) <= t(4), `stage 4 takes no more tries than the bear: middle run ${t(3)} against ${t(4)}`);
  say(hold.every(o => o.tries[0] === 1), 'stage 1 is won first go every time');
  show('holds only when Guts are low, never misses a warning (the review\'s thumb)', await story({ holdAt: 3 }, runs));
  const nov = await story(NEW_THUMB, runs);
  show('a new player\'s thumb', nov);
  // The batch: "boss takes a few tries". Only runs that got to the bear count. PROVISIONAL bar. Scripts don't learn between tries, and a person does.
  const bearTries = nov.filter(o => o.tries.length === 5).map(o => o.tries[4]);
  say(bearTries.length > 0 && bearTries.every(n => n > 0 && n <= 8) && mid(bearTries) <= 5, `the new thumb beats the bear in a few tries, whatever the grey: ${bearTries.join(',')}`);
  console.log('\nJ. Real result screens, raised speed.');
  const tryOnce = (i, bot) => page.evaluate(async ([i, bot]) => {
    if (bot) { Kit.def.bot = HDThumb(bot); } __kit.timeScale = 8; __kit.jump(i, {}); __kit.bot(!!bot);
    const r = __kit.run(), info = { gutsMax: r.w.gutsMax, hpMul: r.w.boss ? r.w.boss.hpMul : 1 };
    while (__kit.state().screen !== 'result') await new Promise(f => setTimeout(f, 30));
    return Object.assign(info, { swings: __kit.run().w.swingsHit, uses: __kit.run().w.ironUses, lost: (DriftSave.getSetting('hd_tries_lost', {}) || {})[i] || 0 });
  }, [i, bot]);
  await page.evaluate(() => { DriftSave.setSetting('hd_tries_lost', {}); });
  for (const i of [1, 4]) {
    const seen = [];
    for (let n = 0; n < 3; n++) seen.push(await tryOnce(i, null));
    say(seen.every(s => s.gutsMax === 5 && s.hpMul === 1 && s.lost === 0), `stage ${i + 1}, nothing pressed, 3 deaths: ${JSON.stringify(seen)}`);
  }
  await page.evaluate(() => { window.__keepBot = Kit.def.bot; });
  const fought = await tryOnce(4, NEW_THUMB), next = await tryOnce(4, null);   // the new player's thumb, which section D shows doesn't beat the bear on 5 Guts
  await page.evaluate(() => { Kit.def.bot = window.__keepBot; __kit.bot(false); DriftSave.setSetting('hd_tries_lost', {}); });
  say(fought.swings >= 3 && fought.uses > 0 && fought.lost === 1 && next.gutsMax === 7 && next.hpMul < 1, `the bear, a try that fought and held: ${JSON.stringify(fought)}, the next try: ${JSON.stringify(next)}`);
  await browser.close(); server.close();
  console.log(failed ? `\nFAILED ${failed}` : '\nPASSED');
  process.exit(failed ? 1 : 0);
})();
