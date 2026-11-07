// Hot Hand: the Sever on the street. Rules only. A foe's place is its distance from Juno, so the Pit's two sides need no extra code.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // The lanes run together as they near her. Far lanes get bigger as they come: the street has depth.
  HH.laneAt = function (lane, d) {
    const L = T.lanes[lane], u = clamp((T.funnelFar - d) / (T.funnelFar - T.funnelNear), 0, 1), e = u * u * (3 - 2 * u);
    const y = L.y + (T.frontY - L.y) * e;
    return { y, s: L.s + (1 - L.s) * e };
  };
  HH.bodyH = f => T.foes[f.type].cm * T.pxPerCm * f.s;
  HH.midY = t => (t.kind === 'foe' ? t.y - HH.bodyH(t) * (t.type === 'cart' ? 0.42 : 0.55) : t.kind === 'shield' ? t.y - T.ventMid * t.s : t.kind === 'krell' ? t.y - t.h * 0.6 : t.y);
  // The box a thumb has to touch. Never smaller than the 44 px rule, however far off the foe is.
  HH.box = function (t) {
    const h = t.kind === 'foe' ? HH.bodyH(t) : t.h, wide = t.kind === 'foe' ? (t.type === 'hollow' || t.type === 'cart' ? h * 0.8 : h * 0.26) : t.w / 2;
    const hw = Math.max(T.minHalfW, wide), tall = Math.max(T.minTall, h);
    return { x0: t.x - hw, x1: t.x + hw, y0: t.y - tall, y1: t.y + 4 };
  };

  HH.place = function (w, f) {
    if (f.type === 'sniper') return;
    f.x = w.jx + f.side * f.d;
    const p = HH.laneAt(f.lane, f.d);
    f.y = p.y; f.s = p.s;
  };

  // Foes get tougher stage by stage, so cold fire stops being enough. A cart always goes up at a touch.
  HH.foeHp = function (run, type, spec) {
    if (type === 'cart') return 1;
    const add = run.stage.isEndless ? Math.min(T.endlessToughMax, Math.floor(run.w.wave / T.endlessToughEvery)) : HH.toughNow(run);
    return spec.hp + (type === 'sniper' ? Math.min(T.sniperToughMax, add) : add);
  };
  // A stage's toughness, unless this wave says otherwise (Dice Alley's first wave eases you in).
  HH.toughNow = function (run) {
    const wave = run.stage.waves && run.stage.waves[run.w.wave];
    return wave && wave.tough !== undefined ? wave.tough : run.stage.tough || 0;
  };
  let uid = 0;
  HH.addFoe = function (run, type, o = {}) {
    const w = run.w, spec = T.foes[type], lanes = run.stage.lanes;
    let lane = o.lane;
    if (lane === undefined) { lane = lanes[run.int(0, lanes.length - 1)]; if (lane === w.lastLane) lane = lanes[(lanes.indexOf(lane) + 1) % lanes.length]; w.lastLane = lane; }
    const both = run.stage.both, side = o.side !== undefined ? o.side : (both ? (run.rng() < T.leftChance ? -1 : 1) : 1);
    const f = { id: ++uid, kind: 'foe', type, lane, side, d: o.d !== undefined ? o.d : (both ? T.spawnDMid : T.spawnD), hp: HH.foeHp(run, type, spec), pending: 0, mark: 0, state: 'walk', t: 0, warnAt: -1, flash: 0, x: 0, y: 0, s: 1, seed: run.rng() * 100, born: run.time };
    if (type === 'hook') { const r = both ? spec.throwDMid : spec.throwD; f.throwD = run.range(r[0], r[1]); }
    if (type === 'hollow') { f.state = 'bound'; f.t = 0; }
    if (type === 'sniper') { f.state = 'hide'; f.t = run.range(0, T.sniperStart); f.win = -1; f.s = spec.s; }
    HH.place(w, f);
    w.foes.push(f);
    if (W.first[type] && !w.seen[type]) { w.seen[type] = 1; HH.teach(run, type, W.first[type]); }
    return f;
  };
  // A powder cart and the trooper who pushes it.
  HH.addCart = function (run) {
    const c = HH.addFoe(run, 'cart'), p = HH.addFoe(run, 'grunt', { lane: c.lane, side: c.side, d: c.d + T.cartPushBack });
    c.pusher = p; p.pushes = c;
    return c;
  };
  HH.addSquad = function (run) {
    const lead = HH.addFoe(run, 'grunt');
    for (let i = 1; i < T.squadSize; i++) HH.addFoe(run, 'grunt', { lane: lead.lane, side: lead.side, d: lead.d + T.squadGap * i });
  };

  HH.hollowOpen = f => f.state !== 'bound';

  // A foe takes damage, from a flame or a burn. Kills pay score and the table.
  HH.hitFoe = function (run, f, dmg, tier) {
    const w = run.w;
    if (f.dead) return;
    f.hp -= dmg; f.flash = 0.14;
    HH.fx(run, A => A.floatText(f.x + (Math.random() - 0.5) * 12, HH.box(f).y0 - 4, String(dmg), HH.TIER_COLOURS[tier], 13 + tier * 3));
    if (f.hp > 0) return;
    f.dead = true; w.kills++;
    if (w.kills % T.cogEvery === 0) { run.addSalvage(T.cogValue); HH.sfx(run, 'pickup'); HH.fx(run, A => A.floatText(f.x, HH.box(f).y0 - T.floatCog, '+' + T.cogValue + ' COG', A.GOLD, 14)); }
    run.addScore(T.foes[f.type].score * T.scoreX[tier]);
    w.corpses.push({ type: f.type, x: f.x, y: f.y, s: f.s, side: f.side, t: 0, tier, seed: f.seed });
    HH.fx(run, A => A.burst(f.x, HH.midY(f), { n: 7, colors: ['#3a3d45', '#7a8088', '#ff8a2a'], speed: 110, life: 0.5 }));
    if (f.markedHit) HH.tableUp(run, T.markTable, f);
    if (tier >= 2) { w.hotKills++; if (w.hotKills % T.hotKillsPerChip === 0) HH.tableUp(run, T.hotKillChip, f); }
    if (tier >= 3) HH.tableUp(run, T.edgeTable, f);
    if (f.type === 'cart') HH.blowCart(run, f, false);
    if (f.pushes) f.pushes.pusher = null;
    if (f.pusher) f.pusher.pushes = null;
  };

  // Up it goes. Everything near burns, Juno too if it reached her.
  HH.blowCart = function (run, c, atJuno) {
    const w = run.w;
    c.dead = true;
    HH.sfx(run, 'keg');
    HH.fx(run, A => { A.shake(8, 0.45); A.burst(c.x, c.y - 20, { n: 40, colors: ['#fff2b0', '#ffb35a', '#ff5a1e', '#3a2c2c'], speed: 280, life: 0.8, size: 6 }); });
    w.rings.push({ x: c.x, y: c.y - 20, r: T.cartR, t: 0, col: '#ffb35a' });
    if (c.pusher) { c.pusher.pushes = null; }
    for (const f of w.foes.slice()) {
      if (f.dead || f === c || f.type === 'sniper') continue;
      if (Math.hypot(f.x - c.x, f.y - c.y) <= T.cartR) HH.hitFoe(run, f, T.cartDmg, 1);
    }
    if (atJuno) HH.hurt(run, T.cartHurt, { why: 'cart', warnAt: c.warnAt });
  };

  function tell(run, f) { f.warnAt = run.time; HH.sfx(run, 'tell'); }

  // Walk up, stop at the barricade, raise the blade, swing. Killed in the "!" and the swing never lands.
  function melee(run, f, dt) {
    if (f.state === 'tell') {
      f.t += dt;
      if (f.t >= T.tellSecs) {
        if (f.pending < f.hp) { HH.hurt(run, T.swingHurt, { why: f.type, warnAt: f.warnAt }); HH.sfx(run, 'swing'); }
        f.state = 'rest'; f.t = 0;
      }
    } else if (f.state === 'rest') {
      f.t += dt;
      if (f.t >= T.swingGap) { f.state = 'tell'; f.t = 0; tell(run, f); }
    }
  }
  function walk(run, f, dt, speed) {
    const w = run.w, stop = T.stops[f.lane];
    if (f.pushes) { f.d = f.pushes.d + T.cartPushBack; return; }
    let hold = false;
    for (const o of w.foes) if (o !== f && !o.dead && o.lane === f.lane && o.side === f.side && o.type !== 'sniper' && o.type !== 'cart' && !o.pushes && o.d < f.d && f.d - o.d < T.queueGap) { hold = true; break; }
    if (!hold) f.d -= speed * dt;
    if (f.d <= stop) { f.d = stop; f.state = 'tell'; f.t = 0; tell(run, f); }
  }
  function stepHook(run, f, dt) {
    if (f.state === 'walk') { if (f.d <= f.throwD) { f.state = 'wind'; f.t = 0; f.warnAt = run.time; HH.sfx(run, 'hookwind'); } else walk(run, f, dt, T.foes.hook.speed); return; }
    if (f.state === 'wind') {
      f.t += dt;
      if (f.t >= T.hookWind && f.pending < f.hp) { HH.addProj(run, 'hook', f.x, f.y - HH.bodyH(f) * 0.8, T.hookFly, T.hookArc, f.warnAt); f.state = 'wait'; f.t = 0; HH.sfx(run, 'hookfly'); }
    } else if (f.state === 'wait') {
      f.t += dt;
      if (f.t >= T.hookRest) { f.state = 'wind'; f.t = 0; f.warnAt = run.time; HH.sfx(run, 'hookwind'); }
    }
  }
  function stepSniper(run, f, dt) {
    f.t -= dt;
    if (f.state === 'hide' && f.t <= 0) {
      const free = T.windows.map((_, i) => i).filter(i => i !== f.win && !run.w.foes.some(o => o !== f && o.type === 'sniper' && o.win === i && o.state !== 'hide'));
      f.win = free[run.int(0, free.length - 1)];
      f.x = T.windows[f.win][0]; f.y = T.windows[f.win][1];
      f.state = 'shutter'; f.t = T.sniperShutter; f.warnAt = run.time; HH.sfx(run, 'shutter');
    } else if (f.state === 'shutter' && f.t <= 0) { f.state = 'aim'; f.t = T.sniperAim; }
    else if (f.state === 'aim' && f.t <= 0 && f.pending < f.hp) {
      HH.addProj(run, 'bolt', f.x, f.y - 40, T.sniperFly, 16, f.warnAt);
      HH.sfx(run, 'hookfly');
      f.state = 'hide'; f.t = T.sniperHide; HH.sfx(run, 'shutter');
    }
  }
  function stepCart(run, f, dt) {
    if (f.state === 'fuse') {
      const was = f.t; f.t += dt;
      if (Math.floor(f.t * 4) !== Math.floor(was * 4)) HH.sfx(run, 'fuse');
      if (f.t >= T.cartFuse) HH.blowCart(run, f, f.pending < f.hp);   // a flame already on its way counts: the tap was in time
      return;
    }
    if (!f.pusher || f.pusher.dead) return;   // nobody pushing: it sits where it is, a bomb on the street, until you light it or the wave ends
    f.d -= T.foes.cart.speed * dt;
    if (f.d <= T.cartReach) { f.d = T.cartReach; f.state = 'fuse'; f.t = 0; f.warnAt = run.time; HH.sfx(run, 'alarm'); }
  }
  function stepHollow(run, f, dt) {
    const stop = T.stops[f.lane] + T.hollowStopExtra;
    f.t += dt;
    if (f.state === 'bound') {
      f.d -= T.foes.hollow.speed * dt;
      if (f.d <= stop) { f.d = stop; f.state = 'tell'; f.t = 0; tell(run, f); HH.sfx(run, 'growl'); }
      else if (f.t >= T.hollowBound) { f.state = 'open'; f.t = 0; HH.sfx(run, 'land'); }
    } else if (f.state === 'open') { if (f.t >= T.hollowOpen) { f.state = 'bound'; f.t = 0; HH.sfx(run, 'growl'); } }
    else if (f.state === 'tell') {
      if (f.t >= T.hollowTell) { if (f.pending < f.hp) { HH.hurt(run, T.swingHurt, { why: 'hollow', warnAt: f.warnAt }); HH.sfx(run, 'crack'); } f.state = 'rest'; f.t = 0; }
    } else if (f.state === 'rest' && f.t >= T.hollowBite) { f.state = 'tell'; f.t = 0; tell(run, f); HH.sfx(run, 'growl'); }
  }

  HH.stepFoes = function (run, dt) {
    const w = run.w;
    for (const f of w.foes) {
      if (f.dead) continue;
      if (f.flash > 0) f.flash -= dt;
      if (f.mark > 0) f.mark -= dt;
      switch (f.type) {
        case 'hook': stepHook(run, f, dt); break;
        case 'sniper': stepSniper(run, f, dt); break;
        case 'cart': stepCart(run, f, dt); break;
        case 'hollow': stepHollow(run, f, dt); break;
        default:
          if (f.state === 'walk') walk(run, f, dt, T.foes[f.type].speed);
          else melee(run, f, dt);
      }
      HH.place(w, f);
    }
    w.foes = w.foes.filter(f => !f.dead);
    for (let i = w.corpses.length - 1; i >= 0; i--) { w.corpses[i].t += dt; if (w.corpses[i].t > 1.1) w.corpses.splice(i, 1); }
  };
})();
