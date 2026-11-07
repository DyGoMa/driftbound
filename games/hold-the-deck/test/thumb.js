// Hold the Deck test only: a thumb that sees everything late, not just warnings. Not loaded by the game; test/fairness.js adds it to the page.
// It's the review's scripted thumb (real-time, real mouse) moved into a test run so it can play many seeds: it sees the world 0.3 to 0.4 s ago, taps about 3 times a second, picks a wrong lane 6% of the time,
// always dodges first, uses Grist simply, and holds for a volley only once Guts are low (holdAt), or always on the bear. It's still a script, not a person: it doesn't panic, get bored or learn.
window.HDThumb = function (opt) {
  const o = Object.assign({ lag: null, gap: 0.24, wrong: 0.06, holdAt: 3, never: false, press: [0.05, 0.1], poll: 3, tapY: 460, stats: null, miss: 0 }, opt);
  const HIT = { hook: 1, drop: 1, paw: 1, swipe: 1, charge: 1, volley: 1 };
  // miss: the share of warnings it never notices, for a thumb that isn't a perfect dodger. 0 unless a test asks.
  const snap = (run, rnd) => {
    const w = run.w, b = w.boss;
    for (const x of w.warns) if (x.missed === undefined) x.missed = rnd() < o.miss;
    return { at: run.time, warns: w.warns.filter(x => !x.missed).map(x => ({ k: x.kind, l: x.lane })), foes: w.foes.map(f => ({ l: f.lane, d: f.d, t: f.type, s: f.state })), walls: w.walls.map(c => ({ l: c.lane, d: c.d })), boss: b ? { st: b.state, lane: b.lane, paw: b.paw ? b.paw.lane : null } : null };
  };
  return function (run, input) {
    const w = run.w, T = TUNE, now = run.time;
    if (run.over) return;
    const m = w.thumb || (w.thumb = { hist: [], last: -9, holding: false, up: 0, n: 0, r: (run.seed >>> 0) || 1 });
    const rnd = () => { m.r = (m.r * 1664525 + 1013904223) >>> 0; return m.r / 4294967296; };
    if (m.lag === undefined) m.lag = o.lag === null ? 0.3 + rnd() * 0.1 : o.lag;
    if (m.up && now >= m.up) { input.sim.release(); m.up = 0; m.last = now; }
    if ((m.n++ % o.poll) !== 0) return;
    m.hist.push(snap(run, rnd));
    while (m.hist.length > 2 && m.hist[1].at < now - m.lag) m.hist.shift();
    const v = m.hist[0];
    const litNow = l => w.warns.some(x => HIT[x.kind] && !x.missed && x.lane === l);
    const lit = l => v.warns.some(x => HIT[x.k] && x.l === l);
    const volley = v.warns.some(x => x.k === 'volley'), stillVolley = w.warns.some(x => x.kind === 'volley');
    const reach = v.foes.filter(f => f.d + (f.s === 'walk' ? 0.05 : 0) >= T.reachD);
    if (o.stats) { const here = litNow(w.target); o.stats[here || w.foes.some(f => f.d >= T.reachD) ? 'busy' : 'idle']++; }
    if (m.up) return;
    if (m.holding) { if (!litNow(w.target)) { input.sim.release(); m.holding = false; m.last = now; } return; }
    if (now - m.last < o.gap) return;
    const tapAt = (x, y) => { input.sim.press(x, y); m.up = now + o.press[0] + rnd() * (o.press[1] - o.press[0]); m.last = now; };
    const tap = l => tapAt(T.midX + (l - 1) * 100, o.tapY);
    const grist = () => tapAt(T.btn.x + T.btn.w / 2, T.btn.y + T.btn.h / 2);
    const ready = HD.canCharge(w), iron = run.carry.iron || 0;
    if (volley && stillVolley && iron < 1 && !o.never && (w.guts <= o.holdAt || v.boss)) { input.sim.press(T.midX + (w.target - 1) * 100, o.tapY); m.holding = true; m.last = now; return; }
    if (lit(w.target) && !volley) { const opts = [0, 1, 2].filter(l => !lit(l)).sort((a, b) => Math.abs(a - w.target) - Math.abs(b - w.target)); if (opts.length) tap(opts[0]); return; }
    if (ready && v.boss && (v.boss.st === 'stand' || v.boss.st === 'far') && !lit(w.target)) { grist(); return; }
    if (ready && !v.boss && v.foes.filter(f => f.l === w.target && f.d > 0.05).length >= 2) { grist(); return; }
    if (ready && !v.boss && v.foes.some(f => f.t === 'ram' && f.l === w.target)) { grist(); return; }
    let goal = null;
    if (v.boss && v.boss.st === 'open' && !lit(v.boss.lane)) goal = v.boss.lane;
    else if (v.boss && v.boss.paw !== null && !lit(v.boss.paw)) goal = v.boss.paw;
    const near = reach.filter(f => !lit(f.l)).sort((a, b) => b.d - a.d)[0];
    if (near && (goal === null || near.d > 0.84)) goal = near.l;
    if (goal === null && v.walls.some(c => c.d >= T.reachD && c.l === w.target && !lit(w.target))) goal = w.target;
    if (goal !== null) { if (rnd() < o.wrong) goal = (goal + 1 + Math.floor(rnd() * 2)) % 3; if (!lit(goal)) tap(goal); }
  };
};

// One whole story with this thumb: stages in order, iron carried, retrying each stage with the extra Guts dying gives. Returns tries per stage and iron after each.
window.HDStory = function (opt, seed, maxTries = 14) {
  const keepBot = Kit.def.bot, keepAsk = Kit.def.botAsk, keepGuts = TUNE.guts, base = keepGuts;
  // The review's meal rule: broth if two Guts down, otherwise pepper.
  Kit.def.botAsk = (spec, run) => (run.w.gutsMax - run.w.guts >= 2 ? 0 : 1);
  const out = { tries: [], iron: [], hurt: [], uses: [], secs: [] };
  let iron = 0;
  try {
    for (let st = 0; st < 5; st++) {
      let tries = 0, paid = 0, res = null;
      while (tries < maxTries) {
        tries++;
        TUNE.dryLost = paid;   // the game's own sums turn this into extra Guts, and on the bear its wounds
        Kit.def.bot = HDThumb(opt);
        res = __kit.runStage(st, { bot: true, seed: seed * 7907 + st * 131 + tries * 17, renderEvery: 0, carry: { iron }, continued: true, maxSeconds: 420 });
        if (res.result === 'win') break;
        const i = res.info || {};
        if (i.ironUses > 0 || !(i.hurtBy && i.hurtBy.volley) || iron >= 1) paid++;
      }
      out.tries.push(res.result === 'win' ? tries : -tries);
      out.hurt.push(res.info && res.info.hurtBy); out.uses.push(res.info && res.info.ironUses); out.secs.push(res.seconds);
      iron = res.info ? res.info.iron : iron;
      out.iron.push(iron);
      if (res.result !== 'win') break;
    }
  } finally { Kit.def.bot = keepBot; Kit.def.botAsk = keepAsk; TUNE.guts = keepGuts; delete TUNE.dryLost; }
  return out;
};
