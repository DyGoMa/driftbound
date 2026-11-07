// Proves every gap can be sailed, with no Dives, except a shut tooth, which costs a knock (it's left out of the sweep). And proves a Dive can get under every rock. Plain node, no browser: node games/tide-gap/test/passable.js [seeds]
// For each stage and seed it lays the real course with the game's own code, then sweeps every sideways position the hull could be in, step by step, moving no faster than a thumb at TUNE.humanSpeed, shoved by the rip currents.
// Then a harder one: from either edge of each gap, can you make the next gap with no foresight past the moment its rocks start to drift?
const path = require('path'), fs = require('fs'), vm = require('vm');
global.window = global;
const dir = path.resolve(__dirname, '..');
['tuning.js', 'words.js', 'memory.js', 'course.js', 'hazards.js', 'dive.js', 'sail.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f }));
const T = TUNE, TG = global.TG, SEEDS = +process.argv[2] || 300, STEP = 1 / 60;

function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeRun(stage, index, seed) {
  const rng = mulberry(seed);
  const r = { stage, index, endless: index < 0, boss: false, dry: true, carry: {}, w: {}, rng, range: (a, b) => a + rng() * (b - a), pick: l => l[Math.floor(rng() * l.length)], up: () => 0, hasPal: () => true };
  r.w = TG.newWorld(r);
  return r;
}
function layAll(run, length) {
  const w = run.w;
  const st = run.stage;
  for (let d = 0; d < length; d += 400) { w.dist = d; if (run.endless) w.speed = Math.min(st.maxSpeed, st.speed + d / st.speed * st.ramp); TG.layAhead(run, w); w.keep = (w.keep || []).concat(w.gates.filter(g => !(w.keep || []).includes(g))); }
  w.dist = 0;
  w.gates = w.keep; w.rocks = [];
  w.gates.forEach(g => g.rocks.forEach(r => w.rocks.push(r)));
}
const GRID = 2, xs = []; for (let x = T.minX; x <= T.maxX; x += GRID) xs.push(x);

// All positions reachable from a start set. Returns the first dist where nothing is left, or null.
function sweep(run, length, speedAt, startSet, from, stopAt) {
  const w = run.w, bands = w.bands.filter(b => b.dir);
  let on = new Set(startSet), dist = from;
  while (dist < stopAt) {
    const v = speedAt(dist); dist += v * STEP;
    const b = bands.find(q => dist > q.a && dist < q.b), shift = b ? b.dir * b.force * STEP : 0, reach = T.humanSpeed * STEP + GRID;
    const near = w.rocks.filter(r => !r.gate.shut && r.at - r.len / 2 - T.hullHalfLen < dist && r.at + r.len / 2 + T.hullHalfLen > dist);
    const next = new Set();
    for (const x of xs) {
      let ok = false;
      for (const q of on) if (Math.abs(q + shift - x) <= reach) { ok = true; break; }
      if (!ok) continue;
      if (!near.some(r => TG.hullHits(r, TG.rockX(r, dist), x, dist, T.rockInset))) next.add(x);
    }
    if (!next.size) return dist;
    on = next;
  }
  return null;
}

// Can a Dive get under this gate's rocks? For every sideways spot its rocks block, going straight with the game's own hit check: the widest run of bow positions a Dive can start from and come up clear.
function diveWindow(g, x, speed, air) {
  const rocks = g.rocks, reach = speed * (air + T.riseSecs);   // course px a whole Dive covers, up to the moment it surfaces
  const near = Math.min(...rocks.map(r => r.at - r.len / 2)), far = Math.max(...rocks.map(r => r.at + r.len / 2));
  const hitAt = d => rocks.some(r => TG.hullHits(r, TG.rockX(r, d), x, d, 0));
  // A start counts if the hull is clear going down, and clear coming up. Only ones where it really passed under matter.
  let best = 0, run = 0;
  for (let bow = 0; bow < 120; bow += 2) {
    const start = near - bow - T.hullHalfLen, end = start + reach;
    const under = end - T.hullHalfLen > far - 1;
    if (!hitAt(start) && !hitAt(end) && under) { run += 2; best = Math.max(best, run); } else run = 0;
  }
  return best;
}
function diveReport(name, stage, index, length) {
  let cols = 0, passed = 0, tight = 1e9, longest = 0;
  for (let s = 1; s <= Math.min(SEEDS, 40); s++) {
    const run = makeRun(stage, index, s * 7919 + 13 + (index + 1));
    layAll(run, length);
    for (const g of run.w.gates) {
      longest = Math.max(longest, ...g.rocks.map(r => r.len));
      for (let x = T.minX; x <= T.maxX; x += 6) {
        if (!g.rocks.some(r => { const d = r.at; return TG.hullHits(r, TG.rockX(r, d), x, d, 0); })) continue;
        cols++;
        const w = diveWindow(g, x, stage.speed, T.diveSecs);
        if (w > 0) passed++;
        tight = Math.min(tight, w);
      }
    }
  }
  console.log(`${name.padEnd(16)} blocked columns ${cols}: a Dive with no upgrade gets under ${passed} (${(passed / cols * 100).toFixed(1)}%), going straight; tightest start window ${tight} px; longest rock ${Math.round(longest)} px`);
  return cols - passed;
}

function report(name, stage, index, length) {
  let fails = 0, gateFails = 0, gates = 0, minGap = 1e9, maxMove = 0, minClear = 1e9, firstFail = null;
  for (let s = 1; s <= SEEDS; s++) {
    const run = makeRun(stage, index, s * 7919 + 13 + (index + 1));
    layAll(run, length);
    const speed = d => (index < 0 ? Math.min(stage.maxSpeed, stage.speed + d / stage.speed * stage.ramp) : stage.speed);
    const stop = sweep(run, length, speed, [180], 0, length);
    if (stop !== null) { fails++; firstFail = firstFail || { seed: s, at: Math.round(stop) }; }
    const gs = run.w.gates;
    gs.forEach((g, i) => {
      gates++;
      if (!g.shut) minGap = Math.min(minGap, g.safe[1] - g.safe[0]);
      if (i) {
        const p = gs[i - 1], r0 = TG.safeRange(p), r1 = TG.safeRange(g), clear = (g.at - g.len / 2) - (p.at + p.len / 2);
        if (g.shut || p.shut) { minClear = Math.min(minClear, clear); return; }
        minClear = Math.min(minClear, clear);
        maxMove = Math.max(maxMove, Math.max(0, r1.lo - r0.lo, r0.hi - r1.hi));
        // From each edge of the last gap: can the next gap be made?
        if (s <= Math.min(SEEDS, 60)) for (const x0 of [r0.lo, r0.hi]) {
          const from = p.endAt, st = xs.filter(x => Math.abs(x - x0) <= GRID);
          if (sweep(run, length, speed, st.length ? st : [Math.round(x0)], from, g.endAt) !== null) gateFails++;
        }
      }
    });
  }
  console.log(`${name.padEnd(16)} seeds ${SEEDS}: no way through ${fails}; gate-to-gate from an edge, stuck ${gateFails}; gates ${gates}; narrowest final gap ${Math.round(minGap)} px (hull is ${T.hullHalfW * 2}); biggest forced move ${Math.round(maxMove)} px; least open water between gates ${Math.round(minClear)} px`);
  if (firstFail) console.log('  first failure', JSON.stringify(firstFail));
  return fails + gateFails;
}

let bad = 0;
T.stages.forEach((s, i) => { if (!s.boss) bad += report('Stage ' + (i + 1), s, i, s.length); });
bad += report('Endless, 12 km', T.endless, -1, 12000);
T.stages.forEach((s, i) => { if (!s.boss) bad += diveReport('Dive, stage ' + (i + 1), s, i, s.length); });
console.log(bad ? 'FAILED: ' + bad : 'PASSED: every gap on every seed can be sailed with no Dive, at a thumb speed of ' + T.humanSpeed + ' px/s, and a Dive gets under every rock with no upgrade');
process.exit(bad ? 1 : 0);
