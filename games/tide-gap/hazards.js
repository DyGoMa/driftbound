// Tide Gap: what rides along with the rocks. Salvage, drowned caches, pages, boulders, rip currents, lances, and the two pals. Logic only.
window.TG = window.TG || {};
(function () {
  const T = () => TUNE;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Called by TG.layGate for each new gate.
  TG.dressGate = function (run, w, s, gate, prevEnd, prevLane, lane) {
    // Salvage along the line a good helm would sail: from the last gap to the middle of this one.
    const near = gate.at - gate.len / 2, count = Math.round((near - prevEnd) / T().cogSpacing * s.cogs);
    if (run.rng() < T().cogRunChance) for (let i = 0; i < count; i++) {
      const u = (i + 1) / (count + 1), wob = Math.sin(u * Math.PI) * T().cogWobble * (lane > prevLane ? -1 : 1);
      w.items.push({ type: 'cog', at: prevEnd + (near - prevEnd) * u, x: clamp(prevLane + (lane - prevLane) * u + wob, T().itemX[0], T().itemX[1]) });
    }
    if (run.rng() < T().cogGateChance && !gate.shut) w.items.push({ type: 'cog', at: gate.at, x: lane });

    // A drowned cache: gold under a rock, reachable only by going under, so salvage is one more thing a Dive can buy.
    // A shut tooth always hides one, in the crack: that's the pay for going under it.
    const under = gate.rocks.filter(r => r.side !== 'M' || r.w > T().cacheMinW), wantCache = run.rng() < T().cacheChance;
    if (gate.shut) { const r = gate.rocks[0]; r.cache = true; for (let i = -1; i <= 1; i++) w.items.push({ type: 'cache', at: r.at + i * T().cacheSpread, x: gate.crack, rock: r }); }
    else if (under.length && wantCache) {
      const r = run.pick(under), fx = TG.rockX(r, r.to + 1), x = r.side === 'M' ? fx : r.side === 'L' ? clamp(fx - T().cacheInset, T().itemX[0], T().itemX[1]) : clamp(fx + T().cacheInset, T().itemX[0], T().itemX[1]);
      if (x > T().minX && x < T().maxX) { r.cache = true; for (let i = -1; i <= 1; i++) w.items.push({ type: 'cache', at: r.at + i * T().cacheSpread, x, rock: r }); }
    }

    // The mop tuft: from stage 3, once per attempt, a rock with something scrubbing underneath. Only a Dive reaches it.
    if (!w.mopDone && !run.boss && !run.endless && run.index >= T().mopFromStage && !run.hasPal('mopclaw') && !gate.rocks[0].mop) {
      w.mopTries = (w.mopTries || 0) + 1;
      if (w.mopTries === T().mopGate) {
        w.mopDone = true;
        if (T().palBot === 'mopclaw' || run.rng() < T().mopChance) {
          const r = gate.rocks.find(q => q.side !== 'M') || gate.rocks[0], fx = TG.rockX(r, r.to + 1);
          r.mop = true;
          w.mop = { x: r.side === 'M' ? fx : r.side === 'L' ? clamp(fx - T().mopInset, T().itemX[0], T().itemX[1]) : clamp(fx + T().mopInset, T().itemX[0], T().itemX[1]), at: r.at, rock: r, said: false };
        }
      }
    }
  };

  // Pages sit off the safe line in the open water before a gate, so fetching one means a detour you then have to recover from.
  TG.placePages = function (run, w) {
    const s = run.stage;
    if (s.pagesEvery) { if (w.laid.end > w.nextPage) { const g = w.gates[w.gates.length - 1]; addPage(run, w, g); w.nextPage += s.pagesEvery; } return; }
    while (w.pagesLeft > 0 && w.laid.end > w.pageAt[0]) { w.pageAt.shift(); w.pagesLeft--; addPage(run, w, w.gates[w.gates.length - 1]); }
  };
  function addPage(run, w, g) {
    const lane = (g.safe[0] + g.safe[1]) / 2, off = run.range(T().pageOff[0], T().pageOff[1]) * (lane < 180 ? 1 : -1);
    w.items.push({ type: 'page', at: g.at - g.len / 2 - run.range(T().pageBefore[0], T().pageBefore[1]), x: clamp(lane + off, T().pageX[0], T().pageX[1]) });
  }

  // ---- Rip currents (stage 4). They run across the whole channel and you can see them; no sense needed.
  TG.layBands = function (run, w) {
    const g = w.gates[w.gates.length - 1], s = run.stage;
    if (!s.bands || w.bands.some(b => b.gate === g) || (run.endless && w.dist < T().endlessBandsFrom)) return;
    const prev = w.gates[w.gates.length - 2];
    const start = prev ? prev.at + prev.len / 2 + T().bandStartGap : T().firstGate / 2, room = g.at - g.len / 2 - start - T().bandStartGap;
    if (room < T().bandMinRoom || run.rng() > T().bandChance) { w.bands.push({ gate: g, a: 0, b: 0, dir: 0, force: 0 }); return; }
    const len = Math.min(room, run.range(T().bandLen[0], T().bandLen[1]));
    w.bands.push({ gate: g, a: start, b: start + len, dir: run.rng() < 0.5 ? -1 : 1, force: run.range(T().bandForce[0], T().bandForce[1]) });
  };
  TG.bandHere = function (w) {
    for (const b of w.bands) if (b.dir && w.dist > b.a && w.dist < b.b) return b;
    return null;
  };

  // ---- Is a danger aimed at sideways x, landing at time 'when' from now and lasting until 'until', fair? The hull must have somewhere to go.
  // Every gate in that time must leave the hull room on the same side of it, or a cable could stand between one gap and the next.
  TG.laneOK = function (w, x, halfW, when, until, speed) {
    const room = (T().hullHalfW + T().gateSafety) * 2;
    let left = true, right = true;
    for (const g of w.gates) {
      const inFrom = g.startAt - w.dist, inTo = g.endAt - w.dist;   // px until the hull enters and leaves this gate
      if (inFrom > until * speed || inTo < when * speed) continue;
      if ((x - halfW) - g.safe[0] < room) left = false;
      if (g.safe[1] - (x + halfW) < room) right = false;
    }
    return left || right;
  };

  // ---- Boulders (the Grinders). A shadow grows where the hull is now; move and it misses. Skipped if a rock is too close to dodge beside.
  TG.stepDrops = function (run, w, dt) {
    if (!run.stage.drops) return;
    w.dropT -= dt;
    if (w.dropT <= 0) {
      if (TG.laneOK(w, w.shipX, T().dropRadius, T().dropWarn - T().dropLaneBefore, T().dropWarn + T().dropLaneAfter, w.speed)) {
        w.dropT = T().dropEvery * run.range(T().dropJitter[0], T().dropJitter[1]);
        w.drops.push({ x: w.shipX, at: w.dist + w.speed * T().dropWarn, t: 0 });
        Kit.audio.play('crack');
      } else w.dropT = T().dropRetry;
    }
    for (const d of w.drops) {
      d.t += dt;
      if (!d.landed && d.t >= T().dropWarn) {
        d.landed = true;
        Kit.audio.play('splash');
        if (!run.dry) { Kit.art.burst(d.x, TG.yOf(w, d.at), { n: 14, colors: ['#dff4f6', '#8fd3d8', '#ffffff'], speed: 130, life: 0.5, size: 4 }); Kit.art.shake(2, 0.15); }
        if (w.dive.state === 'up' && w.inv <= 0 && Math.abs(d.x - w.shipX) < T().dropRadius + T().hullHalfW && Math.abs(d.at - w.dist) < T().dropRadius + T().hullHalfLen) TG.knock(run, 'drop');
      }
    }
    w.drops = w.drops.filter(d => d.t < T().dropWarn + 0.5);
  };

  // ---- Lances. A red lane, then a lance down it, then the cable stays taut for a moment. Shared with the boss.
  TG.addLance = function (run, w, x, warn, stay) {
    w.lances.push({ x: clamp(x, T().lanceX[0], T().lanceX[1]), warn, warnLeft: warn, stay: stay === undefined ? T().lanceStay : stay, t: 0, state: 'warn' });
    Kit.audio.play('alarm');
  };
  TG.stepLances = function (run, w, dt) {
    const s = run.stage;
    if (s.lances && !w.boss && (!run.endless || w.dist > T().endlessLancesFrom)) {
      w.lanceT -= dt;
      if (w.lanceT <= 0) {
        if (TG.laneOK(w, w.shipX, T().lanceHalf, 0, T().lanceWarn + T().lanceStageStay + T().lanceCross, w.speed)) { w.lanceT = T().lanceEvery * run.range(T().lanceJitter[0], T().lanceJitter[1]); TG.addLance(run, w, w.shipX, T().lanceWarn, T().lanceStageStay); }
        else w.lanceT = T().lanceRetry;
      }
    }
    for (const l of w.lances) {
      if (l.state === 'warn') {
        l.warnLeft -= dt;
        if (l.warnLeft <= 0) { l.state = 'strike'; l.t = 0; Kit.audio.play('lance'); if (!run.dry) { Kit.art.shake(3, 0.16); Kit.art.burst(l.x, w.shipYNow + 60, { n: 10, colors: ['#ffffff', '#ff6a4a'], speed: 120, life: 0.35, size: 3 }); } }
      } else {
        l.t += dt;
        if (w.dive.state === 'up' && w.inv <= 0 && Math.abs(l.x - w.shipX) < T().lanceHalf + T().hullHalfW - T().lanceGrace) TG.knock(run, 'lance');
      }
    }
    w.lances = w.lances.filter(l => l.state === 'warn' || l.t < l.stay);
  };

  // ---- Pickups
  TG.stepItems = function (run, w) {
    const reach = T().grabRadius, down = w.dive.state === 'down';
    for (const it of w.items) {
      if (it.done) continue;
      if (Math.abs(it.at - w.dist) > T().hullHalfLen + T().grabAhead || Math.abs(it.x - w.shipX) > reach) continue;
      if (it.type === 'cache') {
        if (!down) continue;
        it.done = true; run.addSalvage(T().cacheValue); run.addScore(T().scoreCache); Kit.audio.play('pickup');
        Kit.art.floatText(it.x, w.shipYNow - 30, '+' + T().cacheValue, Kit.art.GOLD, 15);
      } else if (it.type === 'cog') {
        if (w.dive.state !== 'up') continue;
        it.done = true; run.addSalvage(T().cogValue); run.addScore(T().scoreCog); Kit.audio.play('pickup');
        if (!run.dry) Kit.art.burst(it.x, w.shipYNow - 20, { n: 4, color: Kit.art.GOLD, speed: 60, life: 0.3, size: 2 });
      } else if (it.type === 'page') {
        if (w.dive.state !== 'up') continue;
        it.done = true;
        if (TG.findPage(run)) { TG.sayOne(run, run.pick(TG.WORDS.pageFound)); w.pagesGot++; }
      }
    }
    w.items = w.items.filter(it => !it.done && it.at > w.dist - 200);
  };

  // ---- Pals. Bobbin comes to a clean helm: no knock and no Dive for a while, then stay alongside it. Mopclaw hides under a rock with a mop tuft: only a Dive reaches it.
  TG.stepPals = function (run, w, dt) {
    if (w.boss) return;
    w.calm += dt;
    const b = w.bobbin;
    if (!b && !w.bobbinTried && !run.endless && run.index >= T().bobbinFromStage && !run.hasPal('bobbin') && w.calm > T().bobbinCalm) {
      w.bobbinTried = true;
      if (T().palBot === 'bobbin' || (run.rng() < T().bobbinChance && !w.botMem && !w.fair)) {   // a test bot only meets it when a test asks
        w.bobbin = { x: clamp(w.shipX + (w.shipX < 180 ? T().bobbinOff : -T().bobbinOff), T().bobbinX[0], T().bobbinX[1]), t: 0, hold: 0, gone: false };
        TG.sayNow(run, TG.WORDS.palAppear.bobbin);
        Kit.audio.play('chime');
      }
    }
    if (b && !b.gone) {
      b.t += dt;
      const near = Math.abs(b.x - w.shipX) < T().bobbinNear && w.dive.state === 'up';
      if (near) b.hold += dt;
      if (b.hold >= T().bobbinHold) { b.gone = true; run.catchPal('bobbin'); return; }
      if (b.t > T().bobbinSecs || w.dive.state !== 'up') b.gone = true;
    }
    const m = w.mop;
    if (m && !m.caught) {
      if (!m.said && m.at - w.dist < T().mopCallAt) { m.said = true; TG.sayNow(run, TG.WORDS.palAppear.mopclaw); }
      if (w.dive.state === 'down' && Math.abs(m.at - w.dist) < T().hullHalfLen + T().mopAlong && Math.abs(m.x - w.shipX) < T().mopNear) { m.caught = true; run.catchPal('mopclaw'); }
    }
  };
})();
