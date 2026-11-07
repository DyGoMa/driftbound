// Tide Gap test bot. Reads the course's own sums for where each gap will end up, and presses only through input.sim, like a thumb.
// On a stage it only Dives at a shut tooth (T.botShut says when) or if a pal test asks it to.
window.TG = window.TG || {};
(function () {
  const T = TUNE, B = T.boss;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Thumb work: drag toward an aim, let go when there.
  TG.botThumb = function (w, input, aim, keep) {
    const me = w.botMem || (w.botMem = { tx: 180 }), err = TG.botBandAim(w, aim) - w.targetX;
    if (Math.abs(err) < 1.5 && !keep) { if (input.down) input.sim.release(); return; }
    if (!input.down) { me.tx = 180; input.sim.press(me.tx, T.botThumbY); return; }
    if ((me.tx > 340 && err > 0) || (me.tx < 20 && err < 0)) { if (!keep) { input.sim.release(); return; } me.tx = 180; }
    me.tx += clamp(err / T.dragGain, -6, 6);
    input.sim.move(me.tx, T.botThumbY);
  };

  // In a rip the hull sits a little downstream of the aim: a thumb allows for it, so a bot does too.
  TG.botBandAim = function (w, aim) {
    const b = TG.bandHere(w);
    return b ? aim - b.dir * b.force / T.shipRate * 1.4 : aim;
  };

  // Pull the thumb down to Dive: a real pull through the same queue a person's goes through. Keep calling it until the hull is under.
  TG.botPull = function (w, input) {
    const me = w.botMem || (w.botMem = { tx: 180 });
    if (!input.down) { me.tx = 180; me.ty = T.botThumbY; input.sim.press(me.tx, me.ty); return; }
    me.ty = (me.ty || T.botThumbY) + T.pullPx / 3 + 1;
    input.sim.move(me.tx, me.ty);
  };

  // A shut tooth: line up on the crack, then Dive under it or scrape through it. Returns true while it has the thumb. Shared with the no-foresight player.
  TG.botShutWants = function (run, w) {
    if (!TG.canDive(run) || T.botShut === 'scrape') return false;
    return T.botShut === 'dive' || TG.linesLeft(run) >= T.botWeighLines || w.hullLeft <= 1;
  };
  TG.botShut = function (run, w, input) {
    const g = w.gates.find(q => q.shut && !q.scraped && q.endAt > w.dist);
    if (!g) return false;
    const near = Math.min(...g.rocks.map(r => r.at - r.len / 2)), far = Math.max(...g.rocks.map(r => r.at + r.len / 2)), bow = near - (w.dist + T.hullHalfLen);
    if (w.dive.state === 'down') { if (w.dist - T.hullHalfLen > far + 2) input.sim.release(); return true; }
    if (w.dive.state === 'rising') { if (input.down) input.sim.release(); return true; }
    if (bow < T.botDiveAt && bow > -T.hullHalfLen && TG.botShutWants(run, w) && w.shuntTo === null) { TG.botPull(w, input); return true; }
    return false;
  };

  function dangers(w) {
    const out = [];
    for (const d of w.drops) if (!d.landed) out.push({ x: d.x, r: T.dropRadius + T.hullHalfW + 6, left: T.dropWarn - d.t });
    for (const l of w.lances) out.push({ x: l.x, r: T.lanceHalf + T.hullHalfW + 6, left: l.state === 'warn' ? l.warnLeft : 0 });
    return out;
  }
  // The nearest spot to want that's in the range and not in a danger.
  function pick(w, want, lo, hi) {
    const ds = dangers(w);
    if (!ds.length) return clamp(want, lo, hi);
    let best = clamp(w.shipX, lo, hi), bestD = 1e9;
    const spots = [lo, hi];
    ds.forEach(d => spots.push(d.x - d.r, d.x + d.r));
    for (let x = lo; x <= hi; x += 8) spots.push(x);
    for (const x of spots) {
      if (x < lo || x > hi || ds.some(d => Math.abs(x - d.x) < d.r - 0.01)) continue;
      // A taut cable is a wall until it drops, and a lane about to strike can't be crossed in time.
      if (ds.some(d => (x - d.x) * (w.shipX - d.x) < 0 && d.left < (Math.abs(d.x - w.shipX) + d.r) / (T.shipMax * 0.55))) continue;
      const score = Math.abs(x - want) + Math.abs(x - w.shipX) * 0.6;
      if (score < bestD) { bestD = score; best = x; }
    }
    return best;
  }

  function stageAim(run, w) {
    const gs = w.gates.filter(g => !g.done && g.endAt > w.dist);
    let lo = T.minX, hi = T.maxX, want = 180;
    if (gs.length) {
      const g = gs[0], r = TG.safeRange(g);
      const inside = w.dist > g.startAt - 34;    // about to enter or in it: stay inside its gap
      if (inside) {
        lo = r.lo; hi = r.hi;
        want = gs[1] ? (gs[1].safe[0] + gs[1].safe[1]) / 2 : (r.lo + r.hi) / 2;
      } else want = (r.lo + r.hi) / 2;
    }
    return { want, lo, hi };
  }

  function bossBot(run, w, input) {
    const b = w.boss, me = w.botMem || (w.botMem = { tx: 180 });
    // On the way under: steer to the plate, let go in reach of it.
    const plates = B.plates.map((p, i) => ({ i, x: b.cx + p[0] })).filter(p => !b.broken[p.i]).sort((p, q) => Math.abs(p.x - w.shipX) - Math.abs(q.x - w.shipX));
    if (w.dive.state === 'down') {
      const p = plates[0];
      if (p) TG.botThumb(w, input, clamp(p.x, T.minX, T.maxX), true);
      const can = b.state === 'open' && w.shipYNow <= b.y + B.reachLine && p && Math.abs(p.x - w.shipX) < B.plateNear - 8;
      if (can || w.dive.air < 0.1 || b.state !== 'open') input.sim.release();
      return;
    }
    if (w.dive.state === 'rising' || b.returning) { if (input.down) input.sim.release(); return; }
    // Loose page in reach and the book isn't full: go and get it, if nothing is about to hit.
    const blanks = TG.linesLeft(run) < T.bookRows;
    const page = b.pages[0];
    let want = 180, lo = T.minX, hi = T.maxX;
    if (b.state === 'open' && plates[0] && TG.canDive(run)) {
      if (TG.botStartDive(w, input, me, plates[0], w.lances)) return;
      want = plates[0].x;
    } else if (page && (blanks || !TG.canDive(run))) want = page.x;
    me.diving = false;
    for (const c of b.chains) if (c.y < w.shipYNow + T.hullHalfLen + 10 && c.y > w.shipYNow - 210) { lo = c.gap[0] + T.hullHalfW + 10; hi = c.gap[1] - T.hullHalfW - 10; want = (lo + hi) / 2; break; }
    TG.botThumb(w, input, pick(w, want, Math.max(lo, T.minX), Math.min(hi, T.maxX)));
  }

  function palBot(run, w, input) {
    if (T.palBot === 'bobbin' && w.bobbin && !w.bobbin.gone) { TG.botThumb(w, input, w.bobbin.x); return true; }
    const m = w.mop;
    if (T.palBot === 'mopclaw' && m && !m.caught) {
      const bowGap = m.rock.at - m.rock.len / 2 - T.hullHalfLen - w.dist;
      if (w.dive.state === 'down') { TG.botThumb(w, input, m.x, true); if (m.at + m.rock.len / 2 - w.dist < -T.hullHalfLen) input.sim.release(); return true; }
      if (bowGap < 340 && bowGap > 0) {
        if (Math.abs(w.targetX - m.x) > 6) { TG.botThumb(w, input, m.x); return true; }
        if (bowGap < 70) { TG.botPull(w, input); return true; }
        if (input.down) input.sim.release();
        return true;
      }
    }
    return false;
  }

  // Plates are open: pull down to Dive, unless a lance would land on the hull first. Under water it can steer the rest of the way, so it needn't be lined up yet. Returns true while it's pulling.
  TG.botStartDive = function (w, input, me, plate, lances) {
    const room = T.diveWindup + 0.1;
    const threat = lances.some(l => Math.abs(l.x - w.shipX) < T.lanceHalf + T.hullHalfW + 4 && (l.state === 'strike' || l.warnLeft < room));
    if (threat || Math.abs(plate.x - w.shipX) > 110) { if (me.diving && input.down) { input.sim.release(); me.diving = false; return true; } return false; }
    TG.botPull(w, input); me.diving = true;
    return true;
  };

  TG.bot = function (run, input) {
    if (T.botMode === 'react') return TG.botReact(run, input);
    const w = run.w;
    if (w.boss) return bossBot(run, w, input);
    if (T.palBot && palBot(run, w, input)) return;
    if (TG.botShut(run, w, input)) return;
    const a = stageAim(run, w);
    TG.botThumb(w, input, pick(w, a.want, Math.max(a.lo, T.minX), Math.min(a.hi, T.maxX)));
  };
})();
