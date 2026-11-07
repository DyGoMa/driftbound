// Proof of the boards: node games/split-light/test/levels-test.js [--show id]
// For every level and boss phase: solvable with the shots given; par is the true fewest shots; firing without touching anything doesn't win;
// what the level says it needs, it needs; every board you can reach with shots left either has a way through or is one the game flags with NO WAY THROUGH and Retry.
const path = require('path'), vm = require('vm'), fs = require('fs');
const dir = path.resolve(__dirname, '..');
global.window = global;
['tuning.js', 'rules.js', 'solver.js', 'levels.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f }));
const SL = global.SL;
const show = process.argv.includes('--show') ? process.argv[process.argv.indexOf('--show') + 1] : null;
let fails = 0;
const check = (ok, what) => { if (!ok) { fails++; console.log('  FAIL ' + what); } return ok; };

function describe(L, plan) {
  const xy = i => `(${i % L.cols},${Math.floor(i / L.cols)})`, lean = v => (v ? '\\' : '/');
  return plan.map((p, n) => `   shot ${n + 1}: ${L.perches.length > 1 ? 'perch ' + p.perch + ', ' : ''}${L.mode === 'clock' ? 'at tick ' + p.tick + ', ' : ''}set ${Object.keys(p.assign).map(c => xy(+c) + lean(p.assign[c])).join(' ') || 'nothing'} -> hits ${p.hits.join(',') || 'none'}, grows ${p.growth.map(xy).join(' ') || 'nothing'}`).join('\n');
}

const seenIdeas = new Set(), GENTLE = ['split', 'armour', 'two-seeds', 'clockwork'];
function proveBoard(spec, label) {
  const L = SL.compile(spec), S0 = SL.startState(L);
  const t0 = Date.now(), r = SL.solve(L, S0);
  const name = `${label} ${spec.id}`;
  if (!check(!!r && !r.unknown, `${name}: solvable with ${L.shots} shots`)) return;
  check(r.shots === L.par, `${name}: par says ${L.par}, solver says ${r.shots}`);
  check(L.shots >= L.par, `${name}: shots ${L.shots} under par ${L.par}`);
  // Firing at once, touching nothing, must not clear it.
  const leans = SL.startLeans(L);
  const first = SL.after(L, S0, SL.shoot(L, S0, 0, leans));
  const alreadyWon = !SL.alive(first);
  check(!alreadyWon, `${name}: firing with no thought wins it`);
  // Touching nothing at all, whatever stop of the clock it fires on, must not clear it at par. One board is built that way on purpose (handsOff).
  let front = [S0], handsFree = 0;
  for (let n = 1; n <= L.par && !handsFree; n++) {
    const next = [];
    for (const s0 of front) for (const { s } of SL.waitsFrom(L, s0)) { const N = SL.after(L, s, SL.shoot(L, s, 0, leans)); if (!SL.alive(N)) handsFree = n; next.push(N); }
    front = next;
  }
  check(!handsFree === !spec.handsOff, `${name}: ${handsFree ? 'clears in ' + handsFree + ' shots without a single tap' : 'says handsOff, but needs a tap'}`);
  // The first board of a new idea: pressing FIRE to see what it does mustn't end the attempt.
  if (GENTLE.includes(spec.id)) check(!!SL.solve(L, first), `${name}: the first shot, untouched, leaves no way through`);
  if (spec.needs) {
    const o = spec.needs === 'growth' ? { noGrowth: true } : spec.needs === 'split' ? { noSplit: true } : { onePerch: true };
    const w = SL.solve(L, Object.assign({}, S0, { shots: 12 }), o);
    check(!w || w.shots > L.par, `${name}: claims it needs ${spec.needs}, but without it the solver gets ${w ? w.shots : 'nothing'}`);
  }
  check(!seenIdeas.has(spec.idea), `${name}: same idea as another level`);
  seenIdeas.add(spec.idea);
  const s = SL.survey(L, { keep: true }), ms = Date.now() - t0;
  check(s.minShots === L.par, `${name}: the full map says ${s.minShots} fewest shots`);
  if (spec.trap) check(s.deadWithShotsLeft > 0, `${name}: says it has a trap, but no shot kills the board`);
  // The game's own live check: the slowest it can be, from every board the survey can reach, is measured in the browser test.
  console.log(`${fails ? '    ' : 'ok  '} ${name.padEnd(26)} par ${L.par}/${L.shots} shots, ${String(s.boards).padStart(5)} boards, ${String(s.states).padStart(6)} states: ${String(s.stillPossible).padStart(5)} winnable, ${String(s.deadWithShotsLeft).padStart(5)} flagged dead, ${String(s.outOfShots).padStart(5)} out of shots, ${String(s.wins).padStart(4)} wins (${ms} ms)`);
  if (show === spec.id || show === 'all') console.log(describe(L, r.plan));
  // The game's live check, from every board you can reach: the slowest one, on this computer. test/play-checks.js times it on a slowed browser too.
  let worst = 0, longest = 0, gaveUp = 0;
  s.list.forEach(st => {
    [1, L.shots].forEach(n => {
      const S = Object.assign({}, st, { shots: n }), t = process.hrtime.bigint(), live = SL.stillPossible(L, S);
      worst = Math.max(worst, Number(process.hrtime.bigint() - t) / 1e6);
      if (live && !SL.solve(L, S)) gaveUp++;   // the phone's check said fine, but the board is dead: the player finds out when the shots run out
    });
    SL.outcomes(L, st).forEach(oc => { longest = Math.max(longest, oc.res.bounces); });
  });
  // A thumb with no idea: every crystal random, every perch random, any moment of the clock. Not a player, but it shows the difficulty rising.
  let wins = 0; const TRIES = 1500;
  let seed = 12345; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let k = 0; k < TRIES; k++) {
    let S = SL.startState(L);
    while (S.shots > 0 && SL.alive(S)) {
      if (L.mode === 'clock') for (let n = Math.floor(rnd() * L.cycle); n > 0; n--) S = SL.waited(L, S);
      const lean = {}; L.pieces.forEach((p, i) => { if (p && p.t !== 'p') lean[i] = p.t === 'f' ? p.o : rnd() < 0.5 ? 0 : 1; });
      S = SL.after(L, S, SL.shoot(L, S, Math.floor(rnd() * L.perches.length), lean));
    }
    if (!SL.alive(S)) wins++;
  }
  console.log(`       random thumb wins ${(wins / TRIES * 100).toFixed(1)}%, longest possible shot ${longest} bounces, live check worst ${worst.toFixed(1)} ms, gave up on ${gaveUp} dead boards`);
  // Failing can't shorten a board. A thumb that never clears it, shots at random, Retry at random, 8 attempts, 40 times: every fresh board needs par or more, and has a way through with the shots it gives.
  // Boss boards use the same growth rule, but full shots (nerve is their limit), so only the levels check the shot count.
  let lowest = Infinity, shortest = Infinity, starved = 0, fired = 0;
  const level = !label.startsWith('Boss');
  for (let k = 0; k < 40; k++) {
    let g = []; fired = 0;
    for (let a = 1; a <= 8; a++) {
      const S0 = SL.startState(L, SL.scarsAfter(L, g));
      if (level) S0.shots = SL.shotsFor(L, S0, fired);
      const need = SL.solve(L, Object.assign({}, S0, { shots: L.shots }));
      if (!need || !SL.solve(L, S0)) starved++;
      else { lowest = Math.min(lowest, need.shots); shortest = Math.min(shortest, S0.shots); }
      let S = S0, want = 1 + Math.floor(rnd() * S0.shots), guard = 0;
      while (want > 0 && S.shots > 0 && guard++ < 40) {
        if (L.mode === 'clock') for (let n = Math.floor(rnd() * L.cycle); n > 0; n--) S = SL.waited(L, S);
        const lean = {}; L.pieces.forEach((p, i) => { if (p && p.t !== 'p') lean[i] = p.t === 'f' ? p.o : rnd() < 0.5 ? 0 : 1; });
        const N = SL.after(L, S, SL.shoot(L, S, Math.floor(rnd() * L.perches.length), lean));
        if (!SL.alive(N)) continue;
        S = N; want--; fired++;
      }
      g = S.g;
    }
  }
  check(lowest >= L.par, `${name}: failing shortened the board to ${lowest}, par ${L.par}`);
  check(starved === 0, `${name}: ${starved} new attempts had no way through`);
  console.log(`       after 8 failed attempts, 40 times: fewest shots needed never under ${lowest} (par ${L.par}), shots given as low as ${shortest}, no way through ${starved}`);
  return { L, r, s };
}

SL.LEVELS.forEach((spec, i) => proveBoard(spec, `L${i + 1}`));
SL.BOSS.forEach((spec, i) => proveBoard(spec, `Boss${i + 1}`));
check(SL.LEVELS.length >= 15, `at least 15 levels (${SL.LEVELS.length})`);
check(new Set(SL.LEVELS.map(l => l.set)).size >= 4, 'at least 4 sets');
console.log(fails ? `\nFAILED ${fails}` : `\nPASSED: ${SL.LEVELS.length} levels and ${SL.BOSS.length} boss phases all proven`);
process.exit(fails ? 1 : 0);
