// Split Light: the rules of the board, with no drawing and no timers, so the solver, the bot and the game all use the same sums.
// Coordinates: x across, y down. A crystal's lean: 0 = "/", 1 = "\". Growths always lean "/" and can't be turned (the bond grows how it grows).
(function (root) {
  const SL = root.SL = root.SL || {};
  const HEAD = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
  const ENTER = { N: [0, 1], S: [0, -1], E: [-1, 0], W: [1, 0] };   // an opening on the north side takes a beam travelling south, and so on
  const OPEN_TOKENS = { '^': 'N', '>': 'E', '<': 'W', _: 'S' };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a), lcm = (a, b) => a * b / gcd(a, b);

  // Map characters: . floor, / \ crystals, f g clamped crystals (/ and \), S s splitters (/ and \), # plate,
  // o core, T twin core (all die together or not at all), ^ > < _ armoured core open on that side, U D L R Prism's perch firing that way.
  SL.compile = function (spec) {
    const rows = spec.map.length, cols = spec.map[0].length, n = rows * cols;
    const L = { spec, id: spec.id, cols, rows, n, pieces: new Array(n).fill(null), perchAt: new Array(n).fill(false), perches: [], cores: [],
      shots: spec.shots, par: spec.par, clock: spec.clock || 0, corrects: !!spec.corrects, cycle: 1 };
    spec.map.forEach((row, y) => {
      if (row.length !== cols) throw new Error(spec.id + ': row ' + y + ' is not ' + cols + ' wide');
      [...row].forEach((ch, x) => {
        const i = y * cols + x;
        if (ch === '/' || ch === '\\') L.pieces[i] = { t: 'c', o: ch === '/' ? 0 : 1 };
        else if (ch === 'f' || ch === 'g') L.pieces[i] = { t: 'f', o: ch === 'f' ? 0 : 1 };
        else if (ch === 'S' || ch === 's') L.pieces[i] = { t: 's', o: ch === 'S' ? 0 : 1 };
        else if (ch === '#') L.pieces[i] = { t: 'p' };
        else if (ch === 'o') L.cores.push({ i, hp: 1 });
        else if (ch === 'T') L.cores.push({ i, hp: 1, twin: 1 });
        else if (OPEN_TOKENS[ch]) L.cores.push({ i, hp: 1, open: OPEN_TOKENS[ch] });
        else if (HEAD[ch]) { L.perchAt[i] = true; L.perches.push({ i, x, y, dx: HEAD[ch][0], dy: HEAD[ch][1], head: ch }); }
        else if (ch !== '.') throw new Error(spec.id + ': unknown map character ' + ch);
      });
    });
    (spec.rails || []).forEach(r => {
      const rail = r.cells.map(c => c[1] * cols + c[0]);
      L.cores.push({ i: rail[0], hp: r.hp || 1, rail, at: r.at || 0, twin: r.twin ? 1 : 0, open: r.open || null, sides: r.sides || null });
    });
    (spec.fixedCores || []).forEach(r => L.cores.push({ i: r.at[1] * cols + r.at[0], hp: r.hp || 1, sides: r.sides || null, open: r.open || null, big: !!r.big }));
    L.cores.forEach(c => { if (c.rail) L.cycle = lcm(L.cycle, c.rail.length); if (c.sides) L.cycle = lcm(L.cycle, c.sides.length); });
    L.moves = L.cores.some(c => c.rail || c.sides);
    L.mode = L.clock ? 'clock' : L.moves ? 'shot' : 'still';
    return L;
  };

  // g: growths the board starts with (what a Retry leaves behind: SL.scarsAfter in solver.js).
  SL.startState = (L, g) => ({ tick: 0, g: g ? g.slice().sort((a, b) => a - b) : [], hp: L.cores.map(c => c.hp), shots: L.shots, sealed: '' });
  SL.coreCell = (L, c, tick) => (c.rail ? c.rail[(c.at + tick) % c.rail.length] : c.i);
  // A core whose opening turns (c.sides) seals each side once it has been hit through it: 'X' means no way in at this moment.
  SL.coreOpen = (c, tick, sealed) => { if (!c.sides) return c.open || null; const s = c.sides[tick % c.sides.length]; return sealed && sealed.includes(s) ? 'X' : s; };
  SL.alive = S => S.hp.some(h => h > 0);
  SL.coreAt = function (L, S, cell) {
    for (let k = 0; k < L.cores.length; k++) if (S.hp[k] > 0 && SL.coreCell(L, L.cores[k], S.tick) === cell) return k;
    return -1;
  };

  // One shot. perch: index in L.perches. orient: lean of each turnable piece by cell (a missing one means "not chosen yet", and the shot stops to ask).
  // o.noGrowth, o.noSplit: the solver's what-ifs, to prove a level really needs its idea. o.maxBounces: the Second Look preview.
  SL.shoot = function (L, S, perch, orient, o = {}) {
    const P = L.perches[perch], grown = new Set(S.g), segs = [], events = [], rawHits = new Map(), ends = [], seen = new Set();
    const stack = [{ x: P.x, y: P.y, dx: P.dx, dy: P.dy, t: 0, path: [], used: 0 }];
    let bounces = 0, clangs = 0;
    const cap = o.maxBounces === undefined ? Infinity : o.maxBounces;
    while (stack.length) {
      const b = stack.pop();
      let x = b.x, y = b.y, dx = b.dx, dy = b.dy, t = b.t, sx = x, sy = y, t0 = t, used = b.used;
      const path = b.path.slice();
      const seg = (x2, y2, t1) => segs.push({ x1: sx, y1: sy, x2, y2, t0, t1 });
      for (let guard = 0; guard < 400; guard++) {
        const nx = x + dx, ny = y + dy, i = ny * L.cols + nx;
        const off = nx < 0 || ny < 0 || nx >= L.cols || ny >= L.rows;
        const piece = off ? null : L.pieces[i];
        const key = i + ':' + dx + ',' + dy;
        if (!off && seen.has(key)) { seg(x, y, t); break; }   // a closed loop: the light just goes round
        if (off || L.perchAt[i] || (piece && piece.t === 'p')) {
          seg(x + dx * 0.5, y + dy * 0.5, t + 0.5);
          ends.push({ path, x, y });
          events.push({ t: t + 0.5, type: 'stop', x: x + dx * 0.5, y: y + dy * 0.5 });
          break;
        }
        seen.add(key);
        const k = SL.coreAt(L, S, i);
        if (k >= 0) {
          const c = L.cores[k], open = SL.coreOpen(c, S.tick, S.sealed);
          if (open && (open === 'X' || ENTER[open][0] !== dx || ENTER[open][1] !== dy)) {   // armour: the beam stops dead on a closed side
            seg(x + dx * 0.5, y + dy * 0.5, t + 0.5);
            ends.push({ path, x, y });
            events.push({ t: t + 0.5, type: 'clang', x: x + dx * 0.5, y: y + dy * 0.5, core: k });
            clangs++;
            break;
          }
          if (!rawHits.has(k)) { rawHits.set(k, t + 1); events.push({ t: t + 1, type: 'hit', x: nx, y: ny, core: k }); }
          x = nx; y = ny; t += 1; path.push(i);
          continue;
        }
        const grew = grown.has(i);
        if (piece || grew) {
          let lean;
          if (grew) lean = 0;
          else if (piece.t === 'f') lean = piece.o;
          else {
            lean = orient ? orient[i] : undefined;
            if (lean === undefined) return { need: i };
          }
          seg(nx, ny, t + 1);
          t += 1; x = nx; y = ny; sx = x; sy = y; t0 = t; used++; path.length = 0;   // growth only comes up on the beam's last straight run
          const ndx = lean === 0 ? -dy : dy, ndy = lean === 0 ? -dx : dx;
          bounces++;
          const splits = piece && piece.t === 's' && !o.noSplit;
          events.push({ t, type: splits ? 'split' : 'bounce', x, y, grew });
          if (used > cap) break;
          if (splits) stack.push({ x, y, dx, dy, t, path: [], used });   // the straight-on half
          dx = ndx; dy = ndy;
          continue;
        }
        x = nx; y = ny; t += 1; path.push(i);
      }
    }
    // Twin cores die together or not at all.
    const hits = [], relinked = [];
    const allTwins = L.cores.every((c, k) => !c.twin || S.hp[k] <= 0 || rawHits.has(k));
    rawHits.forEach((at, k) => { if (L.cores[k].twin && !allTwins) relinked.push(k); else hits.push(k); });
    const dies = new Set(hits.filter(k => S.hp[k] <= 1));
    // A crystal grows on the last free cell of each beam's last straight run. Stopped right after a bounce, with nothing free: no growth.
    const growth = [];
    if (!o.noGrowth) ends.forEach(e => {
      for (let j = e.path.length - 1; j >= 0; j--) {
        const i = e.path[j];
        if (L.pieces[i] || grown.has(i) || growth.includes(i)) continue;
        const k = SL.coreAt(L, S, i);
        if (k >= 0 && !dies.has(k)) continue;
        growth.push(i);
        break;
      }
    });
    return { hits, relinked, growth, segs, events: events.sort((a, b) => a.t - b.t), bounces, clangs, length: segs.reduce((m, s) => Math.max(m, s.t1), 0) };
  };

  // A core on the move crushes any growth it arrives on.
  function crush(L, S) {
    if (!S.g.length) return;
    L.cores.forEach((c, k) => {
      if (c.rail && S.hp[k] > 0) { const i = SL.coreCell(L, c, S.tick), at = S.g.indexOf(i); if (at >= 0) S.g.splice(at, 1); }
    });
  }
  SL.after = function (L, S, res) {
    const N = { tick: S.tick, g: S.g.slice(), hp: S.hp.slice(), shots: S.shots - 1, sealed: S.sealed };
    res.hits.forEach(k => {
      N.hp[k] = Math.max(0, N.hp[k] - 1);
      const c = L.cores[k];
      if (c.sides) N.sealed = (N.sealed + c.sides[S.tick % c.sides.length]).split('').sort().join('');
    });
    res.growth.forEach(i => N.g.push(i));
    N.g.sort((a, b) => a - b);
    if (L.mode === 'shot') { N.tick = (N.tick + 1) % L.cycle; crush(L, N); }
    return N;
  };
  // The clock ticked with no shot.
  SL.waited = function (L, S) {
    const N = { tick: (S.tick + 1) % L.cycle, g: S.g.slice(), hp: S.hp.slice(), shots: S.shots, sealed: S.sealed };
    crush(L, N);
    return N;
  };
  // Everything a player can do with one shot from here: each different result once, with the leans and perch that cause it.
  SL.outcomes = function (L, S, o = {}) {
    const out = new Map();
    const perches = o.onePerch ? [0] : L.perches.map((_, i) => i);
    for (const perch of perches) {
      const walk = assign => {
        const res = SL.shoot(L, S, perch, assign, o);
        if (res.need !== undefined) {
          walk(Object.assign({}, assign, { [res.need]: 0 }));
          walk(Object.assign({}, assign, { [res.need]: 1 }));
          return;
        }
        const key = res.hits.slice().sort().join(',') + '|' + res.growth.slice().sort().join(',');
        if (!out.has(key)) out.set(key, { perch, assign, res });
      };
      walk({});
    }
    return [...out.values()];
  };
  SL.stateKey = S => S.tick + '|' + S.g.join(',') + '|' + S.hp.join('') + '|' + S.sealed;
  // The leans a level starts with, by cell.
  SL.startLeans = function (L) {
    const a = {};
    L.pieces.forEach((p, i) => { if (p && p.t !== 'p') a[i] = p.o; });
    return a;
  };
})(typeof window !== 'undefined' ? window : globalThis);
