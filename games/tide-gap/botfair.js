// Tide Gap: the no-foresight player for test/fairness.js. It plays as a person with an empty book would: no arrows and no knowledge of where a rock will stop.
// It sees only what's on screen (and through the fog), and it sees it late by T.botReact seconds. It steers at a set thumb speed, through input.sim. If this player gets through, the warnings give real time.
window.TG = window.TG || {};
(function () {
  const T = TUNE, B = T.boss;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const SIGHT = 298;   // px from the bow on the smallest screen: the book's bottom to the bow

  function sees(run, w, r) {
    const nearGap = (r.at - r.len / 2) - (w.dist + T.hullHalfLen), fog = run.stage.fog, range = fog ? (fog.clear + fog.thick) / 2 : SIGHT;
    // The gold shows past the eye, and through fog: a rock with an arrow on it tells you that gate is coming.
    if (T.botSense && r.gate && TG.senseFeels(run, r) && r.gate.rocks.some(q => q.drift && (q.at - q.len / 2) - (w.dist + T.hullHalfLen) < TG.senseNow(run).reach)) return true;
    return nearGap < range;
  }

  // The world as it looked a moment ago.
  function remember(run, w) {
    const me = w.fair || (w.fair = { log: [], t: 0, tx: 180 });
    const seen = { rocks: [], drops: [], lances: [] };
    for (const r of w.rocks) if (sees(run, w, r) && r.at + r.len / 2 > w.dist - T.hullHalfLen) {
      // With T.botSense it believes the arrows it has: chevrons from one line up, the exact stopping place only when the book still gives the ghost edge. Without the ghost it guesses a typical drift the arrow's way.
      const nearGap = (r.at - r.len / 2) - (w.dist + T.hullHalfLen), sense = TG.senseNow(run), gold = T.botSense && r.drift && TG.senseFeels(run, r) && nearGap < sense.reach;
      const x = gold ? (sense.ghost ? TG.rockX(r, r.to + 1) : r.x + Math.sign(r.drift) * Math.min(Math.abs(TG.rockX(r, r.to + 1) - r.x), 50)) : r.x;
      seen.rocks.push({ r, x, gold, d: w.dist });
    }
    for (const d of w.drops) if (!d.landed) seen.drops.push(d);
    for (const l of w.lances) seen.lances.push(l);
    me.log.push(seen);
    const lag = Math.round(T.botReact * 60);
    while (me.log.length > lag + 8) me.log.shift();
    const at = Math.max(0, me.log.length - 1 - lag);
    return { me, view: me.log[at], prior: me.log[Math.max(0, at - 6)] };
  }

  // Free water at the rows of one group of rocks, from what was seen. A person watches a rock move and allows for it, a little.
  function freeIn(group, prior) {
    const blocks = [];
    for (const o of group) {
      const was = prior.rocks.find(p => p.r === o.r), v = was && !o.gold ? (o.x - was.x) : 0;
      const x = o.x + v * T.botLead;   // how far ahead it allows for what a rock is doing now (v is a tenth of a second's move)
      const lo = o.r.side === 'L' ? -999 : x + Math.min.apply(null, o.r.edgeL), hi = o.r.side === 'R' ? 999 : x + Math.max.apply(null, o.r.edgeR);
      blocks.push([lo, hi]);
    }
    blocks.sort((a, b) => a[0] - b[0]);
    const free = []; let at = TG.WALL_L;
    for (const b of blocks) { if (b[0] > at) free.push([at, b[0]]); at = Math.max(at, b[1]); }
    if (at < TG.WALL_R) free.push([at, TG.WALL_R]);
    return free;
  }
  const NEED = () => (T.hullHalfW + T.botEdge) * 2;
  function pickGap(free, x, stay) {
    let best = null, bestScore = -1e9;
    for (const f of free) {
      const wide = f[1] - f[0];
      if (wide < NEED()) continue;
      const lo = f[0] + NEED() / 2, hi = f[1] - NEED() / 2, near = clamp(x, lo, hi);
      const score = Math.min(wide, 170) * 1.2 - Math.abs(near - x) * (stay ? 3 : 0.9);
      if (score > bestScore) { bestScore = score; best = { lo, hi, mid: (lo + hi) / 2 }; }
    }
    return best;
  }

  // Looks at the next two groups of rocks it can see: lines up for the second while still inside the first, as anyone would.
  function aimAhead(view, prior, w) {
    const ahead = view.rocks.filter(o => o.r.at + o.r.len / 2 > w.dist - T.hullHalfLen);
    if (!ahead.length) return null;
    const gates = []; ahead.forEach(o => { if (!gates.includes(o.r.gate)) gates.push(o.r.gate); });
    gates.sort((a, b) => a.at - b.at);
    const inGate = g => ahead.filter(o => o.r.gate === g);
    if (gates[0].shut && (w.dist > gates[0].startAt - 60 || !pickGap(freeIn(inGate(gates[0]), prior), w.shipX, false))) return gates[0].crack;   // it's shutting: make for the crack
    const first = pickGap(freeIn(inGate(gates[0]), prior), w.shipX, w.dist > gates[0].startAt);
    if (!first) return null;
    const second = gates[1] ? pickGap(freeIn(inGate(gates[1]), prior), first.mid, false) : null;
    const close = gates[0].startAt - w.dist < 40;     // nearly there: settle into this gap, leaning toward the next
    if (close || w.dist > gates[0].startAt) return second ? clamp(second.mid, first.lo + 10, Math.max(first.lo + 10, first.hi - 10)) : first.mid;   // the margin allows for its own thumb overshooting
    return first.mid;
  }

  // Keep going where it wanted unless a danger it has seen is in the way; then the nearest clear spot on the same side.
  function avoid(w, view, want) {
    const ds = view.drops.map(d => ({ x: d.x, r: T.dropRadius + T.hullHalfW + 6, left: T.dropWarn - d.t })).concat(view.lances.map(l => ({ x: l.x, r: T.lanceHalf + T.hullHalfW + 6, left: l.state === 'warn' ? l.warnLeft : 0 })));
    if (!ds.length) return want;
    const crosses = x => ds.some(d => (x - d.x) * (w.shipX - d.x) < 0 && d.left < (Math.abs(d.x - w.shipX) + d.r) / (T.botThumb * 0.8));
    const bad = x => ds.some(d => Math.abs(x - d.x) < d.r - 0.01);
    if (!bad(want) && !crosses(want)) return want;
    let best = w.shipX, bestD = 1e9;
    const spots = [T.minX, T.maxX];
    ds.forEach(d => spots.push(d.x - d.r, d.x + d.r));
    for (const x of spots) {
      if (x < T.minX || x > T.maxX || bad(x) || crosses(x)) continue;
      const sc = Math.abs(x - want) + Math.abs(x - w.shipX) * 0.5;
      if (sc < bestD) { bestD = sc; best = x; }
    }
    return best;
  }

  function thumb(w, input, aim, keep, me) {
    const cap = T.botThumb / 60 / T.dragGain, err = TG.botBandAim(w, aim) - w.targetX;
    if (Math.abs(err) < 2 && !keep) { if (input.down) input.sim.release(); return; }
    if (!input.down) { me.tx = 180; input.sim.press(me.tx, T.botThumbY); return; }
    if ((me.tx > 340 && err > 0) || (me.tx < 20 && err < 0)) { if (!keep) { input.sim.release(); return; } me.tx = 180; }
    me.tx += clamp(err / T.dragGain, -cap, cap);
    input.sim.move(me.tx, T.botThumbY);
  }

  function boss(run, w, input, seen) {
    const b = w.boss, me = seen.me, view = seen.view;
    const plates = B.plates.map((p, i) => ({ i, x: b.cx + p[0] })).filter(p => !b.broken[p.i]).sort((p, q) => Math.abs(p.x - w.shipX) - Math.abs(q.x - w.shipX));
    if (w.dive.state === 'down') {
      if (plates[0]) thumb(w, input, clamp(plates[0].x, T.minX, T.maxX), true, me);
      const can = b.state === 'open' && w.shipYNow <= b.y + B.reachLine && plates[0] && Math.abs(plates[0].x - w.shipX) < B.plateNear - 8;
      if (can || w.dive.air < 0.1 || b.state !== 'open') input.sim.release();
      return;
    }
    if (w.dive.state === 'rising' || b.returning) { if (input.down) input.sim.release(); return; }
    let want = 180;
    const page = b.pages[0];
    if (b.state === 'open' && plates[0] && TG.canDive(run)) {
      if (TG.botStartDive(w, input, me, plates[0], view.lances)) return;
      want = plates[0].x;
    } else if (page) want = page.x;
    if (b.nextChain && T.botSense) want = (b.nextChain.gap[0] + b.nextChain.gap[1]) / 2;
    for (const c of b.chains) if (c.y < w.shipYNow + T.hullHalfLen + 10 && c.y > w.shipYNow - 230) { want = (c.gap[0] + c.gap[1]) / 2; break; }
    thumb(w, input, avoid(w, view, clamp(want, T.minX, T.maxX)), false, me);
  }

  TG.botReact = function (run, input) {
    const w = run.w, seen = remember(run, w);
    if (w.boss) return boss(run, w, input, seen);
    if (TG.botShut(run, w, input)) return;
    let aim = seen.me.aim === undefined ? 180 : seen.me.aim;
    const a = aimAhead(seen.view, seen.prior, w);
    if (a !== null) aim = a;
    seen.me.aim = aim;
    thumb(w, input, avoid(w, seen.view, aim), false, seen.me);
  };
})();
