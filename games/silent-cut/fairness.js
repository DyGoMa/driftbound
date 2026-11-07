// Silent Cut: proves the timing is fair, through the game's own rules, and that the night stays readable. Not loaded by the page.
//   node games/silent-cut/fairness.js [--seeds 30] [--out folder]
// 1. Warnings: how long each warning shows before the thing it warns of, and whether a slow thumb can answer it.
// 2. Hops: for every pair of neighbouring safe places on every stage, start creeping at every moment of a long stretch: how often does it work, how long is the longest wait, how wide are the windows?
// 3. A human-speed player: no look-ahead at all, sees the world 0.25 to 0.45 s late, plays by what's on screen. Wins and alarms per stage.
// 4. Lazy players: one who never lets go, one who never moves. Stealth should be needed, and waiting shouldn't be safe.
// 5. Silas's voice: only his lines go blank when he's out of breath.
// 6. Dim phone: lightness differences that matter, with the screen at 35% brightness, plus pictures to look at.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const pw = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core')].filter(Boolean).map(p => { try { return require(p); } catch (e) { return null; } }).find(Boolean);
const ROOT = path.resolve(__dirname, '..', '..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const SEEDS = +arg('seeds', 30), OUT = arg('out', path.join(os.tmpdir(), 'kcheck', 'silent-cut'));
const only = arg('only', 'warn,hops,human,lazy,voice,dim').split(',');
fs.mkdirSync(OUT, { recursive: true });
const thumb = require('./fairness-thumb.js');

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const f = path.resolve(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
let failed = 0;
const say = (ok, line) => { console.log((ok === null ? '     ' : ok ? 'ok   ' : 'FAIL ') + line); if (ok === false) failed++; };

// ---- 1. Warnings. Everything here plays through SC.step.
const warnings = () => {
  const T = TUNE, out = {};
  const blank = () => ({ t: 0, sim: true, ev: [], alarms: 0, covers: [], lanterns: [], sweeps: [], floods: [], cranes: [], foes: [], boards: [], coins: [], boss: null, rasp: 0, line: -1e6, lineV: 0, lineLead: 1e6, alert: TUNE_STAGES.stages[3].alert, exitX: 1e6, minX: -1e6, reach: T.reach, creep: T.creep, creak: T.creakR, fillSlow: 1, regen: T.breathRegen,
    s: { x: 0, dir: 1, moving: false, still: 1, breath: 1, chest: 1, winded: false, seen: 0, grace: 0, dash: 0, strikeT: 0, hurtT: 0, hidden: false, stepT: 0, closeT: 0, lastLit: 0 } });
  // A trooper at the end of his beat, Silas somewhere behind him when the warning shows. The thumb answers late: if he can get into reach before the turn it goes and cuts, otherwise it lets go.
  // What's proved: at the moment he turns, Silas has either cut him or is outside his lamp.
  const rows = [];
  for (const late of [0.2, 0.35, 0.5]) {
    let litAtTurn = 0, hits = 0, stopped = 0, n = 0;
    for (let d = 20; d <= 240; d += 2) {
      const w = blank();
      w.foes.push({ a: -1000, b: 1000, x: 1000, dir: 1, v: 44, state: 'wait', t: T.waitSecs - T.tellSecs, goal: 0 });
      w.s.x = 1000 - d; n++;
      const go = (d - T.reach) / T.creep <= T.tellSecs - late - 0.1;
      let turned = false;
      for (let i = 0; i < 90; i++) {
        const now = i / 60, f = w.foes[0], can = SC.strikeTarget(w);
        SC.step(w, 1 / 60, { hold: go && now >= late && !can, act: now >= late && !!can, surge: false });
        if (f.state === 'down') { hits++; break; }
        if (f.dir < 0 && !turned) { turned = true; if (SC.lightAt(w, w.s.x)) litAtTurn++; else stopped++; break; }
      }
    }
    rows.push({ late, litAtTurn, hits, stopped, of: n });
  }
  out.troopers = rows;
  // How long the warning stays up, measured from the machine: trooper and Maro in each round.
  const f = { a: 0, b: 40, x: 0, dir: 1, v: 44, state: 'walk', t: 0, goal: 0 }, w = blank();
  w.foes.push(f);
  let on = -1, turnAt = -1;
  for (let i = 0; i < 1200 && turnAt < 0; i++) { w.s.x = -5000; const d0 = f.dir; SC.step(w, 1 / 60, {}); if (SC.foeTell(f) > 0 && on < 0) on = w.t; if (f.dir !== d0) turnAt = w.t; }
  out.trooperTell = +(turnAt - on).toFixed(2);
  out.maro = [0, 1, 2].map(ph => {
    const v = blank(); v.boss = Object.assign(SC.newBoss([2000, 3000, 4000]), { phase: ph });
    let m0 = -1, m1 = -1, face = 0, back = 0;
    v.s.x = -9000;
    for (let i = 0; i < 1200 && m1 < 0; i++) { SC.step(v, 1 / 60, {}); if (SC.maroTell(v.boss) > 0 && m0 < 0) m0 = v.t; if (v.boss.state === 'face') { m1 = v.t; } }
    back = T.maroBack[ph]; face = T.maroFace[ph];
    return { tell: +(m1 - m0).toFixed(2), back, face };
  });
  // The last step to Maro: walk at his back in the dark, hold on a while after the TAP ring shows, lift, then a tap 0.23 s later. The cut must land before his reading light raises the alarm, or the bell turns him round and the tap does nothing.
  out.ring = [0, 0.3, 0.5, 0.6, 0.7].map(R => {
    const v = blank(); v.alert = TUNE_STAGES.stages[4].alert; v.boss = SC.newBoss([640, 1320, 2020]); v.s.x = 400;
    let ringAt = -1, seenAtRing = 0;
    for (let i = 0; i < 480 && !v.alarms && v.boss.hp === T.maroHits; i++) {
      v.boss.t = 0;   // he stays turned: this is only about the light
      if (ringAt < 0 && SC.target(v)) { ringAt = i; seenAtRing = v.s.seen; }
      const since = ringAt < 0 ? -1 : (i - ringAt) / 60;
      SC.step(v, 1 / 60, { hold: ringAt < 0 || since < R, act: ringAt >= 0 && since >= R + 0.23, surge: false });
    }
    return { R, seenAtRing: +seenAtRing.toFixed(2), cut: v.boss.hp < T.maroHits };
  });
  // A sweeping lamp seen coming: how long from the first moment it's on screen to reaching a man at the screen's standing spot, at the fastest stage's speed.
  const fast = TUNE_STAGES.stages.reduce((m, s) => Math.max(m, s.fast || 1), 1), v = Math.max(...Object.values(TUNE_STAGES.chunks).flatMap(c => (c.sweep || []).map(s => s.v))) * fast;
  out.sweep = { v: +v.toFixed(0), aheadSecs: +((640 - T.camX) / v).toFixed(2), passFrozen: +(120 / v).toFixed(2) };
  return out;
};

// ---- 2. Hops
const hops = (index, seed, span) => {
  const res = [];
  const run = Kit.def.stages[index];
  const fakeRun = { stage: run, rng: mulberry(seed), up: () => 0, carry: {}, boss: !!run.boss, endless: false };
  const w0 = SC.newWorld(fakeRun);
  const places = w0.covers.map(c => c.x).filter(x => !w0.boss || x < w0.boss.desks[2]);
  if (isFinite(w0.exitX)) places.push(w0.exitX);
  for (let i = 0; i + 1 < places.length; i++) {
    const ok = [];
    for (let k = 0; k < span * 5; k++) {
      const at = k / 5;
      // Copy the world, stand him in cover, let the street run until "at", then go.
      const w = SC.cloneWorld(w0);
      w.line = -1e6; w.lineV = 0;
      w.s.x = places[i]; w.s.still = 1; w.s.hidden = true;
      let toX = places[i + 1];
      if (w.boss) { const ph = w.boss.desks.findIndex(d => d > places[i]); w.boss.phase = ph; w.boss.hp = TUNE.maroHits - ph; w.boss.x = w.boss.desks[ph]; toX = Math.min(toX, w.boss.x - w.reach + TUNE.maroReachLess + 6); }
      const steps = Math.round(at * 30);
      for (let n = 0; n < steps; n++) { SC.step(w, 1 / 30, {}); w.ev.length = 0; }
      const a0 = w.alarms, plan = { toX };
      let peak = 0, got = false;
      for (let n = 0; n < 30 * 14; n++) {
        SC.step(w, 1 / 30, SC.botPolicy(w, plan));
        w.ev.length = 0;
        peak = Math.max(peak, w.s.seen);
        if (w.alarms > a0) break;
        if (w.s.x >= plan.toX - 1 || w.won) { got = true; break; }
      }
      ok.push(got && w.alarms === a0 ? 1 : 0);
    }
    // Longest wait: the longest stretch with no working start. Windows: runs of working starts.
    let wait = 0, run0 = 0, win = 0, wins = [], cur = 0;
    ok.forEach(v => { if (v) { if (run0 > wait) wait = run0; run0 = 0; cur++; } else { run0++; if (cur) { wins.push(cur); cur = 0; } } });
    if (cur) wins.push(cur);
    if (run0 > wait) wait = run0;
    wins = wins.map(n => n / 5);
    res.push({ from: places[i], to: places[i + 1], share: Math.round(100 * ok.reduce((a, b) => a + b, 0) / ok.length), wait: wait / 5, minWin: wins.length ? Math.min(...wins) : 0 });
  }
  return res;
  function mulberry(s) { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
};

// ---- 5. The voice
const voice = () => {
  const said = [], stage = Kit.def.stages[1];
  const r = { dry: false, w: { s: { winded: false, breath: 1, chest: 1, x: 0 }, rasp: 0, cam: 0, say: 0 }, say: (who, text) => said.push(who + ': ' + text) };
  SC.say(r, 'silas', 'Hello, darling.', 1);
  r.w.s.breath = 0.4; SC.say(r, 'silas', 'Hello there, my darling, how are you tonight.', 1);
  r.w.s.winded = true; r.w.s.breath = 0;
  SC.say(r, 'silas', 'Hello, darling.', 1);
  SC.say(r, 'sela', 'Silas? Say something.', 1);
  SC.say(r, 'maro', 'Nothing to say, dear fellow?', 1);
  const seen = {};
  for (let i = 0; i < 60; i++) { const l = Kit.def.loseLine({ w: r.w, stage: {} }); seen[l.who + ': ' + l.text] = 1; }
  return { said, lose: Object.keys(seen), filter: 'talkFilter stays unset: ' + !stage.talkFilter };
};

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/games/silent-cut/index.html?test`;
  const browser = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', e => { console.log('PAGE ERROR ' + e.message); failed++; });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.locator('#drift-gate .yes').click();
  await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');

  if (only.includes('warn')) {
    console.log('\n1. WARNINGS');
    const w = await page.evaluate(warnings);
    say(w.trooperTell >= 0.9, `a trooper's "!" shows ${w.trooperTell} s before he turns`);
    w.maro.forEach((m, i) => say(m.tell >= 1, `round ${i + 1}: Maro's book shuts ${m.tell} s before he turns (back turned ${m.back} s, facing ${m.face} s)`));
    w.ring.forEach(r => say(r.cut && r.seenAtRing === 0, `Maro's TAP ring, no upgrades: holding on ${r.R} s after it shows, then lift and tap: ${r.cut ? 'the cut lands' : 'ALARM first'}; meter when the ring shows ${r.seenAtRing}`));
    say(null, `fastest searchlight ${w.sweep.v} px/s: at least ${w.sweep.aheadSecs} s on screen before it reaches him; it passes over a frozen man in about ${w.sweep.passFrozen} s`);
    w.troopers.forEach(r => say(r.late > 0.35 ? null : r.litAtTurn === 0, `behind a trooper when his "!" shows, 20 to 240 px back, answering ${r.late} s late: of ${r.of} tries, cut him ${r.hits}, stopped safely ${r.stopped}, caught in his lamp at the turn ${r.litAtTurn}`));
  }

  if (only.includes('hops')) {
    console.log('\n2. HOPS: every pair of neighbouring safe places, starting at each 0.2 s over 40 s, no upgrades, seed 1');
    for (let i = 0; i < 5; i++) {
      const rows = await page.evaluate(([src, i]) => eval('(' + src + ')')(i, 1, 40), [hops.toString(), i]);
      const worstWait = Math.max(...rows.map(r => r.wait)), minShare = Math.min(...rows.map(r => r.share));
      say(worstWait <= 12 && minShare > 0, `stage ${i + 1}: ${rows.length} hops, worst wait ${worstWait} s, lowest share of starts that work ${minShare}%`);
      rows.filter(r => r.wait > 6 || r.share < 40).forEach(r => say(null, `  ${r.from} to ${r.to}: ${r.share}% of starts work, longest wait ${r.wait} s, narrowest window ${r.minWin} s`));
    }
  }

  if (only.includes('human')) {
    console.log(`\n3. A HUMAN-SPEED PLAYER: no look-ahead, sees 0.25 to 0.45 s late, ${SEEDS} seeds per stage, no upgrades`);
    await page.addScriptTag({ content: thumb.source });
    for (let i = 0; i < 5; i++) {
      const r = await page.evaluate(([i, n]) => SC.thumbRun(i, n), [i, SEEDS]);
      say(i === 4 ? r.wins >= SEEDS * 0.3 : r.wins >= SEEDS * 0.5, `stage ${i + 1}: won ${r.wins} of ${SEEDS}; average ${r.time} s, ${r.alarms} alarms, ${r.surges} Surges, went out of breath ${r.winds} times; lost by: ${JSON.stringify(r.by)}`);
    }
  }

  if (only.includes('lazy')) {
    console.log('\n4. LAZY PLAYERS');
    await page.addScriptTag({ content: thumb.source });
    for (let i = 0; i < 5; i++) {
      const r = await page.evaluate(([i, n]) => SC.lazyRun(i, n), [i, Math.min(SEEDS, 20)]);
      say(i === 0 ? null : r.wins <= 2, `stage ${i + 1}: never lets go of the thumb (taps only to strike and cut): won ${r.wins} of ${r.n}, average ${r.alarms} alarms, ${r.time} s`);
      const idle = await page.evaluate(i => __kit.runStage(i, { bot: false, seed: 99 + i, maxSeconds: 400, renderEvery: 0 }), i);
      say(idle.result === 'lose', `stage ${i + 1}: never moves: ${idle.result} after ${idle.seconds} s, by ${idle.info && idle.info.by}`);
    }
  }

  if (only.includes('voice')) {
    console.log('\n5. THE VOICE');
    const v = await page.evaluate(voice);
    v.said.forEach(l => say(null, l));
    say(v.said[2] === 'silas: ...' && v.said[3].startsWith('sela: Silas?') && v.said[4].startsWith('maro: Nothing'), 'out of breath, only Silas goes blank');
    say(v.lose.includes('silas: ...') && v.lose.length >= 4 && v.lose.every(l => !l.startsWith('silas') || l === 'silas: ...'), `lose like that and the one-liners still vary; his own is blank: ${v.lose.length} different in 60`);
  }

  if (only.includes('dim')) {
    console.log('\n6. DIM PHONE');
    await thumb.dim(page, say, OUT);
  }

  await browser.close(); server.close();
  console.log(failed ? `\nFAILED ${failed}` : '\nFAIR: everything above held');
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
