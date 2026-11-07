// Split Light: the solver. Used by the test (every level, every boss phase, every state you can reach), by the bot, and by the game itself to spot a dead board.
// Turning crystals is free between shots, so a state is only: the clock's tick, the growths, the cores' health. Shots left decide the rest.
(function (root) {
  const SL = root.SL = root.SL || {};

  // States reachable from S by waiting (clocked levels only), with how many ticks each takes.
  function waits(L, S) {
    const list = [{ s: S, waits: 0 }];
    if (L.mode !== 'clock') return list;
    const seen = new Set([SL.stateKey(S)]);
    let cur = S, n = 0;
    while (n < L.cycle * 2) {
      cur = SL.waited(L, cur); n++;
      const k = SL.stateKey(cur);
      if (seen.has(k)) break;
      seen.add(k);
      list.push({ s: cur, waits: n });
    }
    return list;
  }
  SL.waitsFrom = waits;

  // A quick no: some core needs more hits than there are shots, or more than it has sides left to take them through.
  function hopeless(L, S, left) {
    return L.cores.some((c, k) => S.hp[k] > left || (c.sides && S.hp[k] > c.sides.length - S.sealed.length));
  }

  // Fewest shots to clear the board from S, or null if it can't be done with the shots left. Returns the plan too.
  // o: noGrowth, noSplit, onePerch (what-ifs), limit (give up and return { unknown: true }).
  SL.solve = function (L, S0, o = {}) {
    if (!SL.alive(S0)) return { shots: 0, plan: [] };
    let frontier = [{ s: S0, prev: null, act: null }], used = 0, nodes = 0;
    const seen = new Set([SL.stateKey(S0)]), limit = o.limit || Infinity;
    const finish = (node, last) => {
      const plan = [last];
      for (let n = node; n.act; n = n.prev) plan.unshift(n.act);
      return { shots: plan.length, plan };
    };
    while (frontier.length && used < S0.shots) {
      const next = [];
      used++;
      for (const node of frontier) {
        for (const { s, waits: w } of waits(L, node.s)) {
          for (const oc of SL.outcomes(L, s, o)) {
            if (++nodes > limit) return { unknown: true };
            const after = SL.after(L, s, oc.res);
            const act = { waits: w, tick: s.tick, perch: oc.perch, assign: oc.assign, hits: oc.res.hits, growth: oc.res.growth };
            if (!SL.alive(after)) return finish(node, act);
            const k = SL.stateKey(after);
            if (hopeless(L, after, S0.shots - used)) { seen.add(k); continue; }
            if (!seen.has(k)) { seen.add(k); next.push({ s: after, prev: node, act }); }
          }
        }
      }
      frontier = next;
    }
    return null;
  };

  // The live check after a shot: true if there's still a way through with the shots left. A check too big for the phone says true.
  SL.stillPossible = function (L, S, limit) {
    if (!SL.alive(S)) return true;
    if (S.shots <= 0) return false;
    return !!SL.solve(L, S, { limit: limit || TUNE.solverLimit });
  };

  // What a Retry or a Reset leaves behind: the growths that are in the way. One breaks off if it sits where a core starts, if it would leave the fresh board impossible with the shots it gives, or if it would let the fresh board be cleared in fewer shots than par.
  // So failing can never make a board shorter: a plant is only good for the attempt that planted it.
  // A board too big to prove within the limit drops the growth: the safe way round, since nobody can be left on a board with no way through.
  SL.scarsAfter = function (L, grown, limit) {
    const kept = [], starts = L.cores.map(c => SL.coreCell(L, c, 0));
    grown.forEach(i => {
      if (starts.includes(i) || L.pieces[i] || L.perchAt[i]) return;   // the last two can only come from a save older than the map
      const r = SL.solve(L, SL.startState(L, kept.concat(i)), { limit: limit || TUNE.solverLimit });
      if (r && !r.unknown && r.shots >= L.par) kept.push(i);
    });
    return kept.sort((a, b) => a - b);
  };

  // The shots a new attempt at a level gets. A level's shots are for the whole stage, not for each attempt: a Retry gives back what's left of them, and never fewer than this board needs, so nobody is left with no way through.
  SL.shotsFor = function (L, S, fired) {
    const left = L.shots - fired;
    if (left >= L.shots) return L.shots;
    const r = SL.solve(L, Object.assign({}, S, { shots: L.shots }), { limit: TUNE.solverLimit });
    return r && !r.unknown ? Math.max(left, r.shots) : L.shots;
  };

  // The whole map of a level: every state you can reach with the shots allowed, and for each, the fewest shots still needed.
  // Counts the states where shots remain but no way through: those get the game's NO WAY THROUGH banner and Retry.
  SL.survey = function (L, o = {}) {
    const S0 = SL.startState(L), nodes = new Map();
    const add = s => {
      const k = SL.stateKey(s);
      let n = nodes.get(k);
      if (!n) { n = { s, out: [], dist: Infinity, won: !SL.alive(s), done: false }; nodes.set(k, n); }
      return n;
    };
    const root = add(S0);
    let frontier = [root];
    for (let depth = 0; depth < L.shots && frontier.length; depth++) {
      const next = [];
      for (let q = 0; q < frontier.length; q++) {
        const n = frontier[q];
        if (n.won || n.done) continue;
        n.done = true;
        if (L.mode === 'clock') { const m = add(SL.waited(L, n.s)); n.out.push({ to: m, cost: 0 }); if (!m.done) frontier.push(m); }
        for (const oc of SL.outcomes(L, n.s)) {
          const m = add(SL.after(L, n.s, oc.res));
          n.out.push({ to: m, cost: 1 });
          if (!m.done) next.push(m);
        }
      }
      frontier = next;
    }
    // Fewest shots still needed: relax until nothing changes.
    nodes.forEach(n => { if (n.won) n.dist = 0; });
    for (let changed = true; changed;) {
      changed = false;
      nodes.forEach(n => { n.out.forEach(e => { if (e.to.dist + e.cost < n.dist) { n.dist = e.to.dist + e.cost; changed = true; } }); });
    }
    let dead = 0, alive = 0, spent = 0, wins = 0;
    const seen = new Set();
    // Walk again, this time keeping shots left: the same board with fewer shots may be out of reach.
    const walk = [{ n: root, left: L.shots }];
    while (walk.length) {
      const { n, left } = walk.pop(), k = SL.stateKey(n.s) + '#' + left;
      if (seen.has(k)) continue;
      seen.add(k);
      if (n.won) { wins++; continue; }
      if (left <= 0) { spent++; continue; }
      if (n.dist <= left) alive++; else dead++;
      n.out.forEach(e => walk.push({ n: e.to, left: left - e.cost }));
    }
    return { list: o.keep ? [...nodes.values()].map(n => n.s) : null, boards: nodes.size, states: seen.size, wins, stillPossible: alive, deadWithShotsLeft: dead, outOfShots: spent, minShots: root.dist };
  };
})(typeof window !== 'undefined' ? window : globalThis);
