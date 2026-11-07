// Silent Cut test bot. Plays copies of the world forward through the game's own SC.step, and presses only through input.sim, like a thumb.
// It works in hops: from one safe place to the next. It leaves only when a played-forward hop gets there with the meter low. fairness.js has a second player with no look-ahead.
window.SC = window.SC || {};
(function () {
  const T = TUNE, DT = T.botStep, THINK = T.botThink;

  // What a sensible thumb does along the way: strike anything it can, cut a lantern about to shine on it, and keep under a crate.
  function policy(w, plan) {
    const s = w.s, c = { hold: false, act: false, surge: false };
    if (s.dash > 0 || s.strikeT > 0) return c;
    const tg = SC.target(w);
    if (tg && (tg.kind !== 'cut' || tg.o.x > s.x - T.botLanternBack)) c.act = true;
    if (plan.surgeNow && !plan.surged) { plan.surged = true; c.surge = !c.act; return c; }
    if (plan.stay) return c;
    const hop = plan.toX;
    if (s.x >= hop) return c;

    // Under a crate in a floodlit yard: hold only while the next stretch stays dark, unless he's about to be lit where he stands.
    const ahead = s.x + w.creep * T.botLead, floodAhead = SC.floodAt(w, ahead), inFlood = SC.floodAt(w, s.x);
    if (floodAhead || inFlood) {
      if (litIn(w, ahead, T.botLead)) {
        // A flood gate only a Surge can cross: go when he's at its edge, with the breath for it. A wide one takes a second dash from where the first lands.
        const end = gateEnd(w, ahead);
        if (end && SC.canSurge(s) && (!inFlood || end - s.x > T.botGateWalk)) { c.surge = true; return c; }
        c.hold = litIn(w, s.x, T.botLead);
      } else c.hold = true;
      return c;
    }
    c.hold = true;
    return c;
  }
  // Will this point be flood-lit in a moment? Only cranes make that change, so a small look ahead is enough.
  function litIn(w, x, secs) {
    const t = w.t + secs;
    return w.floods.some(f => x >= f.a && x <= f.b && !w.cranes.some(cr => SC.craneShade(cr, x, t)));
  }
  // The far end of a flood with no crane over it.
  function gateEnd(w, x) {
    for (const f of w.floods) if (x >= f.a - 4 && x <= f.b && !w.cranes.some(cr => cr.a <= f.a && cr.b >= f.b)) return f.b;
    return 0;
  }

  // Plays a plan forward. Returns how it went.
  function play(w0, plan0, secs) {
    const w = SC.cloneWorld(w0), plan = Object.assign({}, plan0), a0 = w.alarms, hp0 = w.boss ? w.boss.hp : 0, x0 = w.s.x;
    let peak = w.s.seen, arrived = false, n = Math.round(secs / DT);
    for (let i = 0; i < n; i++) {
      SC.step(w, DT, policy(w, plan));
      w.ev.length = 0;
      peak = Math.max(peak, w.s.seen);
      if (w.alarms > a0 || w.won || w.lost) break;
      if (w.boss && w.boss.hp < hp0) { arrived = true; break; }
      if (w.s.x >= plan.toX - 1 && !arrived) { arrived = true; n = Math.min(n, i + Math.round(T.botArrive / DT)); }
    }
    return { alarms: w.alarms - a0, peak, arrived: arrived || w.won, x: w.s.x, gain: w.s.x - x0, hidden: w.s.hidden, won: w.won };
  }

  // Next place to stop: the middle of the next cover, or the way out, or Maro's back.
  function nextStop(w) {
    const x = w.s.x;
    let c = null;
    for (const k of w.covers) if (k.x > x + 6) { c = k; break; }
    const b = w.boss;
    if (b && b.hp > 0) { const reach = b.x - w.reach + T.maroReachLess + T.botMaroClose; if (!c || c.x > reach || reach - x < T.botNearMaro) return reach; }
    if (c) return c.x;
    return isFinite(w.exitX) ? w.exitX + 1 : x + 400;
  }

  function decide(w) {
    const toX = nextStop(w), s = w.s;
    const go = play(w, { toX }, T.botLook);
    const inCover = !!SC.coverAt(w, s.x);
    if (go.alarms === 0 && go.arrived && go.peak < T.botSafe) return { hold: true, toX };
    // In the open and the plan's gone bad: compare waiting here with a Surge.
    const stay = play(w, { toX, stay: true }, T.botStay);
    if (inCover || (stay.alarms === 0 && stay.peak < T.botSafe)) {
      // Waited too long for a clean window: accept a tighter one.
      if (w.botWait > T.botWaitSome && go.alarms === 0) return { hold: true, toX };
      if (w.botWait > T.botWaitLong && SC.canSurge(s)) { const dash = play(w, { toX, surgeNow: true }, T.botLook); if (dash.alarms === 0) return { surge: true, toX }; }
      return { hold: false, toX, waiting: true };
    }
    if (SC.canSurge(s)) { const dash = play(w, { toX, surgeNow: true }, T.botLook); if (dash.alarms <= go.alarms && dash.peak <= go.peak + 0.1) return { surge: true, toX }; }
    if (stay.alarms < go.alarms || (stay.alarms === go.alarms && stay.peak < go.peak)) return { hold: false, toX };
    return { hold: true, toX };
  }

  SC.bot = function (run, input) {
    const w = run.w, s = w.s, x = 320, y = 150;
    const me = w.botMem || (w.botMem = { n: 0, plan: null, pressT: -9, tap2: -1 });
    const now = run.time;
    w.botWait = w.botWait || 0;

    // The second tap of a Surge.
    if (me.tap2 >= 0) { if (--me.tap2 < 0) input.sim.tap(x, y); return; }
    if (s.dash > 0 || s.strikeT > 0) { if (input.down) input.sim.release(); return; }

    const release = () => { if (input.down) { input.sim.release(); me.relT = now; } };
    const tapNow = () => { if (input.down) input.sim.release(); input.sim.tap(x, y); };

    if (T.botPals && SC.botPal(run, input, me, tapNow)) return;

    // Strike is always right. A lantern only if it's ahead, or he'd be standing in its light.
    const tg = SC.target(w);
    if (tg && (tg.kind !== 'cut' || tg.o.x > s.x - T.botLanternBack)) { tapNow(); return; }

    if (me.n++ % THINK === 0) me.plan = decide(w);
    const p = me.plan || { hold: false };
    w.botWait = p.waiting ? w.botWait + THINK / 60 / THINK : 0;
    if (p.surge) { me.plan = null; if (input.down) input.sim.release(); input.sim.tap(x, y); me.tap2 = 3; return; }
    if (p.hold) {
      // In a crate's shadow the thumb has to pulse; policy says when, using the same sums the look-ahead did.
      const c = policy(w, { toX: p.toX });
      if (c.surge) { if (input.down) input.sim.release(); input.sim.tap(x, y); me.tap2 = 3; return; }
      if (c.hold) { if (!input.down) { input.sim.press(x, y); me.pressT = now; } }
      else if (input.down && now - me.pressT > T.tapKit + 0.03) release();   // a press shorter than that is a tap, and two close together a Surge
    } else if (input.down && now - me.pressT > T.tapKit + 0.03) release();
  };

  SC.botPolicy = policy;   // fairness.js plays hops with the same thumb

  // Only for the pal test: sit still and wait for the eyes, or go for the moth's lantern.
  SC.botPal = function (run, input, me, tapNow) {
    const w = run.w, s = w.s;
    if (T.botPals === 'tuftle' && s.hidden && !w.tufTried) { if (input.down) input.sim.release(); return true; }
    if (T.botPals === 'tuftle' && w.tuf) { if (input.down) input.sim.release(); return true; }
    if (T.botPals === 'lamplick' && w.moth && w.moth.state === 'lick' && Math.abs(w.moth.l.x - s.x) <= w.reach) { tapNow(); return true; }
    if (T.botPals === 'lamplick' && SC.mothTarget(w)) { tapNow(); return true; }
    return false;
  };
})();
