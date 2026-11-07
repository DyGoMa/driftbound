// Storm Run test bot. It looks ahead with the game's own sums (SR.stepBody, SR.box, SR.houndBoxAt), and presses only through input.sim, like a thumb.
// When something would hit a runner standing still, it picks the cheapest way over (hop, full jump, then a jump with a Surge) and the best moment to start it.
window.SR = window.SR || {};
(function () {
  const T = TUNE, STEP = 1 / 60;

  // Plays a plan forward. Returns the seconds until the first hit, or Infinity if clear for the whole look-ahead.
  // plan: { jump, delay, hold, surgeAt } in seconds; hold and surgeAt count from the moment of the jump. surgeAt -1 = no Surge.
  function firstHit(w, plan, margin) {
    const k = Object.assign({}, w.k);
    const foes = w.foes.filter(f => !f.done);
    const start = plan.delay || 0;
    let jumped = !plan.jump, surged = k.surged, landedAt = -1;
    for (let i = 0, t = 0; t < T.botLook; i++, t = i * STEP) {
      if (!jumped && t >= start && !k.air) { SR.startJump(k); jumped = true; }
      const since = t - start;
      if (plan.surgeAt >= 0 && since >= plan.surgeAt && !surged) { SR.startSurge(k); surged = true; }
      const landed = SR.stepBody(k, STEP, since < plan.hold);
      if (landed && plan.jump) { landedAt = t; }
      if (landedAt >= 0 && t > landedAt + 0.14) return Infinity;   // landed with a moment to spare: what comes next gets its own jump
      const ahead = t + STEP;
      for (const f of foes) {
        const b = SR.box(f, f.x + SR.foeVel(f, w) * ahead);
        if (SR.touches(w.kx, k.alt, b, margin)) return t;
      }
      if (w.boss) {
        const h = SR.houndBoxAt(w.boss, ahead);
        if (h && SR.touches(w.kx, k.alt, h, margin)) return t;
      }
    }
    return Infinity;
  }

  // Cheapest first. lead = how long before the foe reaches him this way over goes best.
  const OPTIONS = [
    { jump: true, hold: 0, surgeAt: -1, lead: 0.2 },
    { jump: true, hold: 0.45, surgeAt: -1, lead: 0.28 },
    { jump: true, hold: 0.45, surgeAt: 0.3, lead: 0.46 },
    { jump: true, hold: 0.45, surgeAt: 0.42, lead: 0.56 },
    { jump: true, hold: 0.45, surgeAt: 0.2, lead: 0.36 },
  ];
  const NUDGES = [0, 0.04, -0.04, 0.08, -0.08, 0.12, -0.12, 0.18, -0.18];

  function choose(w, idle, margin) {
    for (const o of OPTIONS) {
      if (o.surgeAt >= 0 && w.numb > 0) continue;
      for (const n of NUDGES) {
        const delay = Math.max(0, idle - o.lead + n);
        const plan = Object.assign({ delay }, o);
        if (firstHit(w, plan, margin) === Infinity) return plan;
      }
    }
    return null;
  }

  SR.bot = function (run, input) {
    const w = run.w, k = w.k, b = w.boss, me = w.botMem || (w.botMem = { release: -1, surgeAt: -1, plan: null });
    const now = run.time, x = w.kx, y = 100;
    const tap = () => { if (input.down) input.sim.release(); input.sim.tap(x, y); };

    // Finish what's under way.
    if (me.release >= 0 && now >= me.release) { input.sim.release(); me.release = -1; }
    if (me.surgeAt >= 0 && now >= me.surgeAt && k.air && SR.canSurge(w)) { tap(); me.surgeAt = -1; me.release = -1; return; }
    if (w.dash) return;

    // The core is open: jump, then Surge straight in.
    if (b && b.state === 'open' && b.t > 0.1 && w.numb <= 0) {
      if (!k.air) { tap(); return; }
      if (SR.canSurge(w) && k.alt > 6) { tap(); return; }
    }
    if (T.botPals && palBot(run, input, x, y)) return;

    if (k.air) {
      // Something will truly hit him before he lands: Surge if that saves it.
      if (SR.canSurge(w) && me.surgeAt < 0 && firstHit(w, { jump: false, hold: me.release >= 0 ? 1 : 0, surgeAt: -1 }, 0) < 0.25
        && firstHit(w, { jump: false, hold: 0, surgeAt: 0 }, 0) === Infinity) tap();
      return;
    }

    if (me.plan) {
      if (now < me.at) {
        // Something new since the plan was made (a cable, say)? Then think again.
        if (firstHit(w, Object.assign({}, me.plan, { delay: me.at - now }), 0) !== Infinity) me.plan = null;
        return;
      }
      const o = me.plan;
      me.plan = null;
      if (firstHit(w, Object.assign({}, o, { delay: 0 }), 0) === Infinity) {
        if (o.hold > 0) { input.sim.press(x, y); me.release = now + o.hold; } else input.sim.tap(x, y);
        me.surgeAt = o.surgeAt >= 0 ? now + o.surgeAt : -1;
        return;
      }
    }
    const idle = firstHit(w, { jump: false, hold: 0, surgeAt: -1 }, T.botMargin);
    if (idle === Infinity || idle > 1.05) return;
    const plan = choose(w, idle, T.botMargin * 2) || choose(w, idle, 0);
    if (plan) { me.plan = plan; me.at = now + plan.delay; }
  };

  // Only for the pal test: burn the arm on purpose, and go after Boltnip when it shows.
  function palBot(run, input, x, y) {
    const w = run.w, k = w.k, p = w.pal;
    if (p && p.id === 'boltnip') {
      const dist = p.x - w.kx;
      if (!k.air && dist < 190 && dist > 0) { input.sim.press(x, y); w.botMem.release = run.time + 0.45; w.botMem.surgeAt = run.time + 0.4; return true; }
      return false;
    }
    if (p && p.id === 'fizzlet') return false;   // stay down and let it run into you (the normal logic still jumps foes)
    if (T.botPals === 'fizzlet' && !p && w.numb <= 0) {
      if (k.air && SR.canSurge(w) && k.vy < 120) { input.sim.tap(x, y); return true; }
    }
    return false;
  }
})();
