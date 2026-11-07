// Tide Gap: rocks and how a course is laid. Logic only, no drawing, and it runs under plain node for test/passable.js (no Kit needed here).
// A rock's sideways position depends only on how far the ship has come, so what a rock will do can be known exactly, and checked.
window.TG = window.TG || {};
(function () {
  const T = () => TUNE;
  const WALL_L = TUNE.wallL, WALL_R = TUNE.wallR, FAR = TUNE.rockFar;
  TG.WALL_L = WALL_L; TG.WALL_R = WALL_R;
  const smooth = u => u * u * (3 - 2 * u);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let nextId = 1;

  // A fixed scatter for shapes, so a rock's outline is the same in the rules and the drawing.
  function scatter(seed) { let a = seed >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; }
  TG.scatter = scatter;

  // side: 'L' or 'R' hangs off that cliff and x is its inner edge; 'M' stands free and x is its middle.
  TG.makeRock = function (o) {
    const r = Object.assign({ id: nextId++, drift: 0, from: 0, to: 0, x: o.x0 }, o);
    const n = Math.max(4, Math.ceil(r.len / 12)), rnd = scatter(r.seed || (r.id * 7919 + 13));
    r.edgeL = []; r.edgeR = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, prof = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1), 3)), 0.6);
      const jag = () => (rnd() - 0.5) * T().rockJag * prof;
      if (r.side === 'M') { const hw = r.w / 2; r.edgeL.push(-hw * prof + jag()); r.edgeR.push(hw * prof + jag()); }
      else {
        const bulge = Math.min(T().rockBulge, r.len * 0.5), inner = -(1 - prof) * bulge + Math.min(0, jag());
        if (r.side === 'L') { r.edgeL.push(-FAR); r.edgeR.push(inner); }
        else { r.edgeL.push(-inner); r.edgeR.push(FAR); }
      }
    }
    return r;
  };

  // Where a rock's anchor is, once the ship has come dist px.
  TG.rockX = function (r, dist) {
    if (!r.drift) return r.x0;
    const p = r.to === r.from ? 1 : clamp((dist - r.from) / (r.to - r.from), 0, 1);
    return r.x0 + r.drift * smooth(p);
  };
  TG.rockP = (r, dist) => (r.to === r.from ? 1 : clamp((dist - r.from) / (r.to - r.from), 0, 1));

  // Row is measured in course px. Returns { l, r } in screen x at that row, or null if the rock doesn't reach it.
  TG.rockSpan = function (r, x, row) {
    const t = (row - (r.at - r.len / 2)) / r.len;   // 0 at the near end, 1 at the far end
    if (t < 0 || t > 1) return null;
    const f = t * (r.edgeL.length - 1), i = Math.min(r.edgeL.length - 2, Math.floor(f)), u = f - i;
    return { l: x + r.edgeL[i] + (r.edgeL[i + 1] - r.edgeL[i]) * u, r: x + r.edgeR[i] + (r.edgeR[i + 1] - r.edgeR[i]) * u };
  };

  // The hull as a few points from the bow back: [sideways, forward of the hull's middle].
  const HULL = [[0, 38], [-9, 26], [9, 26], [-15, 6], [15, 6], [-17, -14], [17, -14], [-13, -36], [13, -36]];
  TG.HULL = HULL;
  // Does the hull at sideways x touch a rock, with the ship at dist? rowAt: the course px under the hull's middle.
  TG.hullHits = function (r, rx, shipX, rowAt, inset) {
    for (const p of HULL) {
      const s = TG.rockSpan(r, rx, rowAt + p[1]);
      if (s && shipX + p[0] > s.l + inset && shipX + p[0] < s.r - inset) return true;
    }
    return false;
  };

  // ---- Laying the course. Each gate leaves one safe gap [a, b] when its rocks have stopped: that's the gap the checks prove.
  const dims = (run, s, len, at) => ({ from: at - len / 2 - T().hullHalfLen - s.moveFrom, to: at - len / 2 - T().hullHalfLen - s.moveTo });

  function gapAt(run, s, width, prev, dt) {
    const lo = WALL_L + width / 2 + T().gapEdge, hi = WALL_R - width / 2 - T().gapEdge;
    const reach = T().humanSpeed * dt, c = prev + run.range(-1, 1) * Math.min(reach, T().gapWander);
    return clamp(c, lo, hi);
  }

  const MAKERS = {
    // Both walls slide the same way: the gap moves.
    shift(run, s, g, c, at) {
      const len = run.range(T().rockLen[0], T().rockLen[1]), a = c - g / 2, b = c + g / 2;
      let d = run.range(T().shiftMin, T().shiftMax) * (run.rng() < 0.5 ? -1 : 1);
      if (c - d < WALL_L + T().shiftEdge || c - d > WALL_R - T().shiftEdge) d = -d;
      const m = dims(run, s, len, at);
      return { kind: 'shift', len, safe: [a, b], rocks: [
        TG.makeRock({ side: 'L', x0: a - d, drift: d, at, len, ...m }),
        TG.makeRock({ side: 'R', x0: b - d, drift: d, at, len: len + run.range(-T().lenJitter, T().lenJitter), ...m }),
      ] };
    },
    // Both walls come in: the gap narrows to g.
    close(run, s, g, c, at) {
      const len = run.range(T().rockLen[0], T().rockLen[1]), a = c - g / 2, b = c + g / 2, amt = run.range(T().closeAmt[0], T().closeAmt[1]), m = dims(run, s, len, at);
      return { kind: 'close', len, safe: [a, b], rocks: [
        TG.makeRock({ side: 'L', x0: a - amt, drift: amt, at, len, ...m }),
        TG.makeRock({ side: 'R', x0: b + amt, drift: -amt, at, len: len + run.range(-T().lenJitter, T().lenJitter), ...m }),
      ] };
    },
    // One island in open water. It drifts across; go round the wide side.
    lone(run, s, g, c, at, prev) {
      const len = run.range(T().rockLen[0], T().rockLen[1]), w = run.range(T().loneW[0], T().loneW[1]), m = dims(run, s, len, at);
      const dir = prev < 180 ? 1 : -1;            // it ends up on the far side from you: you can stay put if you read it
      const end = 180 + dir * run.range(T().loneEnd[0], T().loneEnd[1]), d = run.range(T().loneDrift[0], T().loneDrift[1]) * dir;
      const l = end - w / 2, r = end + w / 2;
      const safe = l - WALL_L > WALL_R - r ? [WALL_L, l] : [r, WALL_R];
      return { kind: 'lone', len, safe, rocks: [TG.makeRock({ side: 'M', x0: end - d, drift: d, w, at, len, ...m })] };
    },
    // Two gaps, one shuts: the middle rock slides until it grinds against a wall rock. The other gap opens wide.
    fork(run, s, g, c, at, prev) {
      const len = run.range(T().rockLen[0], T().rockLen[1]), m = dims(run, s, len, at);
      const lx = run.range(T().forkPost[0], T().forkPost[1]), rx = 360 - run.range(T().forkPost[0], T().forkPost[1]), open = g + T().forkOpen;
      const mw = rx - lx - open, g0 = open / 2, mid = lx + g0 + mw / 2;
      const closeLeft = run.rng() < (prev < mid ? T().forkLean[0] : T().forkLean[1]);       // leans toward shutting the gap you're lined up with
      const d = (g0 + T().forkGrind) * (closeLeft ? -1 : 1), end = mid + d;
      const safe = closeLeft ? [end + mw / 2, rx] : [lx, end - mw / 2];
      return { kind: 'fork', len, safe, closes: closeLeft ? 'L' : 'R', rocks: [
        TG.makeRock({ side: 'L', x0: lx, at, len: len + T().forkPostLen, ...m }),
        TG.makeRock({ side: 'M', x0: mid, drift: d, w: mw, at, len, ...m, grinds: true }),
        TG.makeRock({ side: 'R', x0: rx, at, len: len + T().forkPostLen, ...m }),
      ] };
    },
    // A long wall reaching out from the cliff on your side and leaning further in, so you have to cross. The next one comes from the side that puts you on.
    slalom(run, s, g, c, at, prev) {
      const len = run.range(T().slalomLen[0], T().slalomLen[1]), m = dims(run, s, len, at), fromLeft = prev <= 180, amt = run.range(T().slalomAmt[0], T().slalomAmt[1]);
      const reach = WALL_R - WALL_L - g - run.range(0, T().slalomSlack);
      if (fromLeft) { const x = WALL_L + reach; return { kind: 'slalom', len, safe: [x, WALL_R], rocks: [TG.makeRock({ side: 'L', x0: x - amt, drift: amt, at, len, ...m })] }; }
      const x = WALL_R - reach;
      return { kind: 'slalom', len, safe: [WALL_L, x], rocks: [TG.makeRock({ side: 'R', x0: x + amt, drift: -amt, at, len, ...m })] };
    },
    // A shut tooth: two rocks meet at a crack, and there's no surface way through. Dive under for a line, or scrape through the crack for a knock (sail.js).
    shut(run, s, g, c, at) {
      const len = run.range(T().shutLen[0], T().shutLen[1]), amt = run.range(T().shutOpen[0], T().shutOpen[1]), m = dims(run, s, len, at);
      const crack = clamp(c, T().shutCrackMin, T().shutCrackMax);
      return { kind: 'shut', shut: true, crack, len, safe: [crack - T().shutLane, crack + T().shutLane], rocks: [
        TG.makeRock({ side: 'L', x0: crack - amt, drift: amt, at, len, ...m, grinds: true }),
        TG.makeRock({ side: 'R', x0: crack + amt, drift: -amt, at, len, ...m }),
      ] };
    },
  };

  function pickKind(run, mix) {
    const keys = Object.keys(mix); let total = 0;
    keys.forEach(k => { total += mix[k]; });
    let u = run.rng() * total;
    for (const k of keys) { u -= mix[k]; if (u <= 0) return k; }
    return keys[0];
  }

  // Lays the next gate past the course's end. c = { end, lane, last }. Pushes rocks and items onto w.
  TG.layGate = function (run, w, s, speed, gapWidth) {
    const c = w.laid;
    let kind = pickKind(run, s.mix);
    if (c.shuts === undefined) { c.shuts = (s.shut || []).map(f => f * s.length); c.nextShut = s.shutEvery || 0; }
    if (c.shuts.length && c.end >= c.shuts[0]) {
      // The last of a stage's teeth (s.shutPaid of them) only comes if a Dive can still pay for it, so a blank book is hard but never a dead end. No book to read in the plain-node check: it counts as full.
      const paid = c.shuts.length <= (s.shutPaid || 0);
      c.shuts.shift();
      if (!paid || !run.carry || !run.carry.rows || TG.canDive(run)) kind = 'shut';
    }
    else if (c.nextShut && c.end >= c.nextShut) { c.nextShut += s.shutEvery; kind = 'shut'; }
    let clear = run.range(s.spacing[0], s.spacing[1]);
    if (s.bands && run.rng() < T().bandClearChance) clear += T().bandClear;
    if (kind === 'shut') clear += T().shutClear;
    let at = c.end + clear + 100, gate;
    const dt = clear / speed;
    const centre = gapAt(run, s, gapWidth, c.lane, dt);
    gate = MAKERS[kind](run, s, gapWidth, centre, at, c.lane);
    // Push the gate back until a thumb moving at humanSpeed, a moment late, can get from anywhere in the last gap to this one.
    const half = T().hullHalfW + T().gateSafety;
    const lo = gate.safe[0] + half, hi = gate.safe[1] - half, plo = c.safe ? c.safe[0] + half : c.lane, phi = c.safe ? c.safe[1] - half : c.lane;
    const worst = Math.max(Math.max(0, lo - plo), Math.max(0, phi - hi));
    const room = (at - gate.len / 2) - c.end - T().hullHalfLen * 2;
    const need = (worst / T().humanSpeed + T().reactSecs) * speed;   // the thumb's travel, plus a moment to see it
    if (room < need) {
      const push = need - room;
      gate.rocks.forEach(r => { r.at += push; r.from += push; r.to += push; });
      at += push;
    }
    gate.at = at;
    gate.endAt = at + gate.len / 2 + T().hullHalfLen + 12;
    gate.startAt = at - gate.len / 2 - T().hullHalfLen - 12;
    gate.done = false;
    gate.feel = run.rng();   // how plainly she feels this one: a thin book misses the low ones first (TG.senseFeels)
    w.gates.push(gate);
    gate.rocks.forEach(r => { r.gate = gate; w.rocks.push(r); });
    const prevEnd = c.end, prevLane = c.lane, lane = (gate.safe[0] + gate.safe[1]) / 2;
    c.end = at + gate.len / 2; c.lane = lane; c.safe = gate.safe;
    if (TG.dressGate) TG.dressGate(run, w, s, gate, prevEnd, prevLane, lane);
    return gate;
  };

  // The free water for a hull's middle once a gate's rocks have stopped: { lo, hi }, as the checks and the bot use it.
  TG.safeRange = gate => ({ lo: gate.safe[0] + T().hullHalfW + T().gateSafety, hi: gate.safe[1] - T().hullHalfW - T().gateSafety });
})();
