// Hot Hand: the bond cost and the flames. Heat, tiers, throws, what a flame does when it lands, getting hurt. Rules only; drawing is in draw.js and friends.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;

  // Looks and sound are skipped in a dry test run.
  HH.fx = (run, fn) => { if (!run.dry) fn(Kit.art); };
  HH.sfx = (run, name) => { if (!run.dry) Kit.audio.play(name); };
  // The talk box in play shows one line at a time and a new one wipes the old, so lines wait their turn: each gets sayHold seconds up, and one that has waited too long gives way to what's newer.
  HH.say = (run, l, secs, teachKey) => { if (l) { run.w.sayQ.push({ l, secs, at: run.time, teachKey }); HH.stepSay(run); } };
  HH.stepSay = function (run) {
    const w = run.w, q = w.sayQ;
    if (!q.length || run.time < w.sayNext) return;
    while (q.length > 1 && run.time - q[0].at > T.sayStale) q.shift();
    const e = q.shift();
    w.sayNext = run.time + T.sayHold;
    run.say(e.l.who, e.l.text, e.secs || T.saySecs, 'corner');
    if (e.teachKey) { const taught = DriftSave.getSetting('hotHandTaught', {}); taught[e.teachKey] = 1; DriftSave.setSetting('hotHandTaught', taught); }
  };
  // A first-time line is said once, ever, not once an attempt, so it stops crowding out the story talk. Remembered in the shared save, but only once it has really been shown: one dropped from the queue, or lost when the attempt ends, comes back next attempt.
  HH.teach = function (run, key, line) {
    if (run.dry || !line) return;
    if (DriftSave.getSetting('hotHandTaught', {})[key]) return;
    HH.say(run, line, undefined, key);
  };

  // Tier: 0 cold, 1 warm, 2 hot, 3 hot hand. The hotter she is when she throws, the harder it hits.
  HH.TIERS = ['COLD', 'WARM', 'HOT', 'HOT HAND'];
  HH.TIER_COLOURS = ['#ffb35a', '#ff8a2a', '#ff5a1e', '#ffe46a'];
  HH.tier = h => (h >= T.edgeAt ? 3 : h >= T.hotAt ? 2 : h >= T.warmAt ? 1 : 0);
  HH.safeTop = () => T.heatMax - T.throwHeat;   // above this, the next throw goes over the top
  HH.hand = w => ({ x: w.jx + w.face * 24, y: T.frontY - 62 });
  HH.flameDmg = (run, tier) => T.dmg[tier] + (tier >= 2 && run.up('flame') >= 3 ? T.hotDmg3 : 0);
  HH.burnReach = (run, tier) => {
    const lv = run.up('flame');
    if (tier === 1) return lv >= 2 ? T.warmBurn : 0;
    return T.burnR[tier] * (1 + T.flamePerLevel * lv);
  };

  // Will this flame get through, right now? Decided at the moment of the throw, so a thumb that's right when it taps is right.
  HH.absorb = function (t, tier) {
    if (t.kind === 'proj') return 'ok';
    if (t.kind === 'shield') return t.vent === 'open' || t.graceT > 0 ? 'ok' : 'clang';   // a thumb that tapped an open vent arrives a moment late: that still counts
    if (t.kind === 'krell') return t.exposed ? 'ok' : 'clang';
    if (t.type === 'hollow' && !HH.hollowOpen(t)) return 'clang';
    const armour = T.foes[t.type] && T.foes[t.type].armour;
    return armour && tier < armour ? 'bounce' : 'ok';
  };

  HH.throwAt = function (run, t) {
    const w = run.w, marked = t.mark > 0;
    const over = !marked && w.heat > HH.safeTop();
    const base = over ? 3 : HH.tier(w.heat), tier = marked ? Math.min(3, base + 1) : base;
    const how = over && t.kind !== 'shield' && t.kind !== 'krell' ? 'ok' : HH.absorb(t, tier);
    const dmg = how === 'ok' ? HH.flameDmg(run, tier) : 0;
    if (t.kind === 'foe') t.pending += dmg;
    if (marked && how === 'ok') { t.mark = 0; t.markedHit = true; }   // a mark is good for one throw that gets through. One that clangs off a shut vent or shut plates costs nothing and leaves it there
    if (t.kind === 'proj') t.doomed = true;
    w.face = t.x < w.jx ? -1 : 1;
    const h = HH.hand(w);
    w.shots.push({ x: h.x, y: h.y, t, tier, how, dmg, marked, blow: over, trail: 0 });
    w.throwT = T.throwSecs; w.throws++;
    if (!marked) w.heat += T.throwHeat;
    HH.sfx(run, over ? 'blowout' : ['flick', 'whump', 'roar', 'roar'][tier]);
    if (over) HH.goOver(run);
  };

  // Over the top: the throw still flies, as a blowout. Then her hands lock, and she burns. Burns last the story run.
  HH.goOver = function (run) {
    const w = run.w;
    w.overCount++;
    w.lockT = w.lockFull = Math.max(T.lockMin, T.lockSecs - T.lockPerLevel * run.up('cool') + T.lockPerBurn * (run.carry.burns || 0));
    w.heat = T.afterLock;
    run.carry.burns = Math.min(T.burnsMax, (run.carry.burns || 0) + 1);
    HH.hurt(run, T.burnHurt, { why: 'burn', warnAt: w.overAt < 0 ? run.time : w.overAt });
    HH.fx(run, A => { A.shake(9, 0.5); const h = HH.hand(w); A.burst(h.x, h.y, { n: 26, colors: ['#ffe46a', '#ff8a2a', '#ff3a1e'], speed: 240, life: 0.7, size: 5 }); });
    if (w.hp > 0) HH.sayOne(run, W.lock, 'lockI');
  };
  HH.sayOne = (run, list, key) => { const w = run.w; w[key] = (w[key] === undefined ? run.int(0, list.length - 1) : w[key] + 1); HH.say(run, list[w[key] % list.length]); };

  // Everything that hurts Juno comes through here. src: { why, warnAt } so the fairness script can read how long the warning was.
  HH.hurt = function (run, n, src) {
    const w = run.w;
    if (run.over) return false;
    if (w.inv > 0 && src.why !== 'burn') return false;
    w.hp = Math.max(0, w.hp - n);
    w.hitLog.push({ t: run.time, why: src.why, lead: Math.round((run.time - src.warnAt) * 100) / 100, n, wave: w.wave });
    w.lastHurt = src.why;
    if (src.why !== 'burn') w.inv = T.invuln;   // a burn is her own doing: it buys no safety from the blades
    w.hurtT = T.hurtSecs;
    w.hitWave = true;
    HH.sfx(run, src.why === 'burn' ? 'hurt' : 'hit');
    // The number floats up beside her, on the side Ashka isn't, so red never lands on those red feathers.
    HH.fx(run, A => { A.shake(6, 0.3); A.burst(w.jx, T.frontY - 55, { n: 12, colors: ['#ffffff', '#ff5a3a'], speed: 150, life: 0.4 }); A.floatText(w.jx + (w.ashka.x > w.jx ? -1 : 1) * T.hurtNumSide, T.frontY - T.hurtNumUp, '-' + n, '#ff6a4a', 22); });
    HH.bust(run);
    if (w.hp <= 0) { HH.sfx(run, 'hurt'); run.lose(T.loseBeat); }
    return true;
  };

  // A flame reaches what it was thrown at.
  function land(run, s) {
    const w = run.w, t = s.t, x = t.x, y = t.kind === 'foe' || t.kind === 'shield' || t.kind === 'krell' ? HH.midY(t) : t.y;
    const col = HH.TIER_COLOURS[s.tier];
    HH.fx(run, A => A.burst(x, y, { n: 8 + s.tier * 7, colors: [col, '#fff2b0', '#d8401a'], speed: 70 + s.tier * 55, life: 0.32 + s.tier * 0.08, size: 2.6 + s.tier }));
    if (s.marked && s.how === 'ok') { w.heat = Math.max(0, w.heat - T.markRefund); HH.sfx(run, 'vented'); HH.fx(run, A => A.floatText(w.jx, T.frontY - 112, 'ASHKA -' + T.markRefund, '#ffb35a', 15)); }
    if (t.kind === 'proj') {
      HH.sfx(run, 'burnup'); t.gone = true; run.addScore(T.airScore);
      if (s.blow) { HH.burnAround(run, x, y, T.blowoutR, T.blowoutDmg, s.tier, null); w.rings.push({ x, y, r: T.blowoutR, t: 0, col }); }
      return;
    }
    if (s.how !== 'ok') {
      HH.sfx(run, s.how === 'bounce' ? 'tink' : 'clang'); HH.fx(run, A => A.floatText(x, y - 26, s.how === 'bounce' ? 'TOO COLD' : 'SHUT', '#bfe1ff', 15));
      if (s.blow) { // Gone over the top at a shut vent: she's paid for it, so it still blows out round the target
        HH.burnAround(run, x, y, T.blowoutR, T.blowoutDmg, s.tier, null); w.rings.push({ x, y, r: T.blowoutR, t: 0, col }); w.flash = Math.max(w.flash, 0.3);
        HH.fx(run, A => { A.burst(x, y, { n: 40, colors: ['#ffe46a', '#ff8a2a', '#ff3a1e', '#fff2b0'], speed: 300, life: 0.7, size: 6 }); A.shake(8, 0.4); });
      }
      return;
    }
    HH.sfx(run, 'splat');
    if (t.kind === 'shield') HH.ventHit(run, t, s);
    else if (t.kind === 'krell') HH.krellHit(run, s);
    else { t.pending = Math.max(0, t.pending - s.dmg); if (!t.dead) HH.hitFoe(run, t, s.dmg, s.tier); }
    const r = s.blow ? T.blowoutR : HH.burnReach(run, s.tier);
    if (r > 0) HH.burnAround(run, x, y, r, s.blow ? T.blowoutDmg : T.burnDmg, s.tier, t);
    if (s.blow) HH.fx(run, A => { A.burst(x, y, { n: 40, colors: ['#ffe46a', '#ff8a2a', '#ff3a1e', '#fff2b0'], speed: 300, life: 0.7, size: 6 }); A.shake(8, 0.4); });
    w.flash = Math.max(w.flash, s.blow ? 0.3 : s.tier >= 2 ? 0.08 : 0);
    if (r > 0) w.rings.push({ x, y, r, t: 0, col });
  }

  HH.burnAround = function (run, x, y, r, dmg, tier, skip) {
    for (const f of run.w.foes.slice()) {
      if (f === skip || f.dead || (f.type === 'sniper' && f.state === 'hide')) continue;
      if (f.type === 'hollow' && !HH.hollowOpen(f)) continue;
      if (Math.hypot(f.x - x, HH.midY(f) - y) <= r) HH.hitFoe(run, f, dmg, tier);
    }
  };

  HH.stepShots = function (run, dt) {
    const w = run.w;
    for (let i = w.shots.length - 1; i >= 0; i--) {
      const s = w.shots[i], t = s.t;
      if (t.kind !== 'proj' && t.kind !== 'krell' && t.kind !== 'shield' && t.dead) { // what it was flying at has already gone: it flies on and bursts there
        s.gx = s.gx === undefined ? t.x : s.gx; s.gy = s.gy === undefined ? HH.midY(t) : s.gy;
      }
      const gx = s.gx !== undefined ? s.gx : t.x, gy = s.gx !== undefined ? s.gy : (t.kind === 'proj' ? t.y : HH.midY(t));
      const dx = gx - s.x, dy = gy - s.y, d = Math.hypot(dx, dy), step = T.flySpeed * dt;
      if (d <= step) {
        if (s.gx !== undefined) HH.fx(run, A => A.burst(gx, gy, { n: 5, color: HH.TIER_COLOURS[s.tier], speed: 70, life: 0.25 }));
        else land(run, s);
        w.shots.splice(i, 1);
      } else { s.x += dx / d * step; s.y += dy / d * step; }
    }
    for (let i = w.rings.length - 1; i >= 0; i--) { w.rings[i].t += dt; if (w.rings[i].t > 0.32) w.rings.splice(i, 1); }
  };

  // Heat falls every step. The moment it crosses a line, a sound says so, so an ear can play the bar too.
  HH.stepHeat = function (run, dt) {
    const w = run.w, was = w.heatWas;
    if (w.lockT > 0) {
      w.lockT -= dt;
      if (w.lockT <= 0) { w.lockT = 0; HH.sfx(run, 'unlock'); }
    } else w.heat = Math.max(0, w.heat - T.cool * w.coolMul * dt);
    const top = HH.safeTop();
    if (w.heat > top && was <= top) { HH.sfx(run, 'sizzle'); w.overAt = run.time; if (!w.seen.over && w.lockT <= 0) { w.seen.over = 1; HH.teach(run, 'over', W.first.over); } }
    if (w.heat <= top) w.overAt = -1;
    if (w.heat >= T.edgeAt && w.heat <= top && !(was >= T.edgeAt && was <= top)) { HH.sfx(run, 'edge'); if (!w.seen.edge) { w.seen.edge = 1; HH.teach(run, 'edge', W.first.edge); } }
    if (w.heat >= T.hotAt) w.hotTime += dt;
    w.heatWas = w.heat;
  };
})();
