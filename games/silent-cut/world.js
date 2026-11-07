// Silent Cut: the world's state and what's lit where. No drawing, no sound. Lights are plain functions of time, so the bot and fairness.js use the same sums as the game.
window.SC = window.SC || {};
(function () {
  const T = TUNE, L = TUNE_STAGES;

  // ---- Lights as functions of time
  // A searchlight swings between a and b at speed v, resting dwell seconds at each end.
  SC.sweepAt = function (sw, t) {
    const run = (sw.b - sw.a) / sw.v, P = 2 * (run + sw.dwell);
    const u = (((t + sw.ph) % P) + P) % P;
    if (u < run) return { x: sw.a + u * sw.v, dir: 1, rest: 0 };
    if (u < run + sw.dwell) return { x: sw.b, dir: 0, rest: run + sw.dwell - u, next: -1 };
    if (u < 2 * run + sw.dwell) return { x: sw.b - (u - run - sw.dwell) * sw.v, dir: -1, rest: 0 };
    return { x: sw.a, dir: 0, rest: P - u, next: 1 };
  };
  // A crane rail carries crates at a steady spacing, so their shadows cross the yard at a steady rate.
  SC.craneShade = function (cr, x, t) {
    if (x < cr.a - cr.w || x > cr.b + cr.w) return false;
    const d = (((x - cr.a - t * cr.v) % cr.gap) + cr.gap) % cr.gap;
    return d < cr.w / 2 || d > cr.gap - cr.w / 2;
  };
  function floodLit(w, f, x, t) {
    if (x < f.a || x > f.b) return false;
    for (const cr of w.cranes) if (SC.craneShade(cr, x, t)) return false;
    return true;
  }
  // Maro's lamp pool: out and back once while he faces you.
  SC.maroLamp = function (b) {
    if (!b || b.state !== 'face') return null;
    const i = Math.min(b.phase, 2), u = b.t / T.maroFace[i];
    const reach = T.maroLampNear + (T.maroLampFar[i] - T.maroLampNear) * (0.5 - 0.5 * Math.cos(u * Math.PI * 2));
    return { x: b.x - reach, r: T.maroLampR[i] };
  };
  SC.inMaroLamp = function (w, x) {
    const ml = SC.maroLamp(w.boss);
    return !!ml && Math.abs(x - ml.x) < ml.r + T.halfW;
  };
  // The pool of a trooper's lamp: from his hand to lampLen ahead of him. Null when he's down.
  SC.foeLamp = function (f) {
    if (f.state === 'down') return null;
    return f.dir > 0 ? { a: f.x + 6, b: f.x + 6 + T.lampLen } : { a: f.x - 6 - T.lampLen, b: f.x - 6 };
  };

  // What light is on point x at time t? 0 dark, 1 searchlight, flood or lantern, 2 somebody's own lamp, 3 the lamp line.
  SC.lightAt = function (w, x) {
    const t = w.t, hw = T.halfW;
    if (x - hw < w.line) return 3;
    for (const f of w.foes) { const l = SC.foeLamp(f); if (l && x + hw > l.a && x - hw < l.b) return 2; }
    if (SC.inMaroLamp(w, x)) return 2;
    if (SC.maroOpen(w.boss) && Math.abs(x - w.boss.x) < T.maroPool + hw) return 1;
    for (const sw of w.sweeps) if (Math.abs(x - SC.sweepAt(sw, t).x) < sw.r + hw) return 1;
    for (const l of w.lanterns) if (l.lit && Math.abs(x - l.x) < l.r + hw) return 1;
    for (const f of w.floods) if (floodLit(w, f, x, t)) return 1;
    return 0;
  };
  SC.floodAt = (w, x) => w.floods.some(f => x >= f.a && x <= f.b);
  SC.floodLit = (w, x) => w.floods.some(f => floodLit(w, f, x, w.t));
  SC.coverAt = function (w, x) {
    for (const c of w.covers) if (Math.abs(x - c.x) <= c.w / 2 + T.coverSlop) return c;
    return null;
  };
  SC.boardsAt = (w, x) => w.boards.some(b => x >= b.a && x <= b.b);

  // ---- Building a stage from chunks
  function addChunk(w, name, x0, fast, rng, id) {
    const ch = L.chunks[name];
    (ch.cover || []).forEach(c => w.covers.push(Object.assign({}, c, { x: c.x + x0 })));
    (ch.lantern || []).forEach(l => w.lanterns.push({ x: l.x + x0, r: l.r, lit: true, cutT: -9 }));
    (ch.sweep || []).forEach(s => {
      const span = s.b - s.a, v = s.v * fast, P = 2 * (span / v + s.dwell);
      w.sweeps.push({ a: s.a + x0, b: s.b + x0, r: s.r, v, dwell: s.dwell, ph: (s.ph || 0) + rng() * P });
    });
    (ch.flood || []).forEach(f => w.floods.push({ a: f.a + x0, b: f.b + x0 }));
    (ch.crane || []).forEach(c => w.cranes.push({ a: c.a + x0, b: c.b + x0, v: c.v * fast, w: c.w, gap: c.gap }));
    (ch.trooper || []).forEach(f => w.foes.push(SC.newFoe(f, x0, fast)));
    (ch.boards || []).forEach(b => w.boards.push({ a: b.a + x0, b: b.b + x0 }));
    (ch.coin || []).forEach(x => w.coins.push({ x: x + x0, alt: 20 + rng() * 22 }));
    return ch.len;
  }
  // Endless grows ahead of him, and forgets what's far behind so a long run stays cheap.
  SC.growEndless = function (w, rng) {
    const E = L.endless, f = Math.min(E.fastMax, E.fast + w.t * E.fastRamp);
    while (w.builtTo < w.s.x + E.buildAhead) {
      let name = E.pool[Math.floor(rng() * E.pool.length)];
      if (name === w.lastChunk) name = E.pool[(E.pool.indexOf(name) + 1) % E.pool.length];
      w.lastChunk = name;
      w.builtTo += addChunk(w, name, w.builtTo, f, rng);
    }
    const old = w.s.x - E.forgetBehind, keep = l => l.filter(o => (o.x !== undefined ? o.x : o.b) > old);
    ['covers', 'lanterns', 'floods', 'cranes', 'boards', 'coins'].forEach(k => { w[k] = keep(w[k]); });
    w.sweeps = w.sweeps.filter(o => o.b > old);
    w.foes = w.foes.filter(o => o.x > old);
  };

  SC.newWorld = function (run) {
    const st = run.stage, rng = run.rng, up = run.up;
    const rasp = Math.min(T.raspMax, run.carry.rasp || 0), chest = 1 + T.lungMax * up('lungs') - T.raspLoss * rasp;
    const w = {
      t: 0, sim: false, ev: [], alarms: 0, won: false, lost: false, rasp, boss: null,
      covers: [], lanterns: [], sweeps: [], floods: [], cranes: [], foes: [], boards: [], coins: [],
      s: { x: T.startX, dir: 1, moving: false, still: 1, breath: chest, chest, winded: false, seen: 0, grace: 0, dash: 0, strikeT: 0, hurtT: 0, hidden: false, stepT: 0, closeT: 0, lastLit: 0, struckAt: -9 },
      chestBonus: T.lungMax * up('lungs'), regen: T.breathRegen * (1 + T.lungRegen * up('lungs')), reach: T.reach + T.chainPerLevel * up('chain'),
      creep: T.creep + T.bootCreep * up('boots'), creak: T.creakR - T.bootCreak * up('boots'), fillSlow: 1 - T.bootFill * up('boots'),
      alert: st.alert || 1, line: -T.lineLead + T.startX, lineV: st.lineV, lineLead: T.lineLead, exitX: Infinity, minX: 0,
      // Everything below is for the show, not the rules: the game's own feedback reads and writes it.
      hush: { x: 200, y: 0, tx: 200, fly: 0 }, say: 0, tipI: 0, tip: null, tipT: 0, flash: 0, ring: [], fallen: [], pal: null, tufCover: null, tufT: 0, firstSurge: true,
      strikes: 0, cuts: 0, surges: 0, winds: 0, closes: 0, hitBy: {}, lastLineT: -9,
    };
    if (run.boss) {
      const B = L.boss;
      (B.cover || []).forEach(c => w.covers.push(Object.assign({}, c)));
      (B.lantern || []).forEach(l => w.lanterns.push({ x: l.x, r: l.r, lit: true, cutT: -9 }));
      (B.sweep || []).forEach(s => w.sweeps.push({ a: s.a, b: s.b, r: s.r, v: s.v * st.fast, dwell: s.dwell, ph: rng() * B.sweepPhase }));
      (B.flood || []).forEach(f => w.floods.push({ a: f.a, b: f.b }));
      (B.trooper || []).forEach(f => w.foes.push(SC.newFoe(f, 0, st.fast)));
      (B.coin || []).forEach(x => w.coins.push({ x, alt: 20 + rng() * 22 }));
      w.boss = SC.newBoss(B.desks);
    } else if (run.endless) {
      w.builtTo = 0;
      addChunk(w, 'firstLantern', 0, 1, rng);
      w.builtTo = L.chunks.firstLantern.len;
      SC.growEndless(w, rng);
    } else {
      let x = 0;
      st.seq.forEach(name => { x += addChunk(w, name, x, st.fast, rng); });
      w.exitX = x + 60;
    }
    w.covers.sort((a, b) => a.x - b.x);
    return w;
  };

  // A copy the bot can play forward. Only what changes is copied; layouts are shared.
  SC.cloneWorld = function (w) {
    const c = Object.assign({}, w);
    c.sim = true; c.ev = [];
    c.s = Object.assign({}, w.s);
    c.foes = w.foes.map(f => Object.assign({}, f));
    c.lanterns = w.lanterns.map(l => Object.assign({}, l));
    c.boss = w.boss ? Object.assign({}, w.boss) : null;
    return c;
  };
})();
