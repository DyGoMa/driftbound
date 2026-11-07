// Tide Gap: the rules of one step. Steering, knocks, shut teeth, the course rolling in, talk lines. The Dive is in dive.js, hazards in hazards.js, the boss in boss.js.
window.TG = window.TG || {};
(function () {
  const T = TUNE, W = () => TG.WORDS;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const HISTORY = 90;   // steps of the head's path kept; Vesh's body and the hull both read it

  TG.yOf = (w, at) => w.shipYNow - (at - w.dist);

  TG.newWorld = function (run) {
    const s = run.stage, boss = run.boss, shipY = boss ? T.boss.shipY : T.shipY;
    const speed = s.speed;
    const w = {
      dist: 0, speed, shipX: 180, shipYNow: shipY, homeY: shipY, targetX: 180, headX: 180, lean: 0, trail: new Array(HISTORY).fill(180),
      tow: boss ? T.boss.towLen : T.towLen,
      dive: { state: 'up', t: 0, air: 0, warned: false }, pull: { x: 0, y: 0, log: [] }, armed: false, airMax: T.diveSecs + T.divePerLevel * run.up('dive'), windup: 0, downT: 0,
      hullMax: T.hull + T.hullPerLevel * run.up('hull'), hullLeft: 0, inv: 0, hurtT: 0, shuntTo: null, cleanGate: true, scrapeTo: 0, scrapeX: 0,
      rocks: [], gates: [], items: [], bands: [], drops: [], lances: [], laid: { end: T.firstGate - T.layFrom, lane: 180, safe: null },
      dropT: T.dropFirst, lanceT: T.lanceFirst, calm: 0, bobbin: null, bobbinTried: false, mop: null, mopDone: false, pagesGot: 0, dives: 0, knocks: 0,
      pagesLeft: (s.pagesAt || []).length, pageAt: (s.pagesAt || []).map(f => f * s.length), nextPage: s.pagesEvery || 0, say: [], scene: [], showing: null, sayGap: 0, radioI: 0, radio: (s.radio || []).slice(), wash: 0, lastSteer: 0, diveUnlocked: !s.lockDive,
      boss: boss ? TG.bossNew() : null, bookFx: null, deadT: 0, testInfo: { dives: 0, knocks: 0, lines: 0 },
    };
    w.hullLeft = hullAtStart(run, w.hullMax);
    return w;
  };

  // What a stage knocks off stays off through the story run: that's what a scrape really costs. Bram keeps her floating on T.hullFloor planks, so no stage starts on its last one and none is a dead end, and he puts everything he has into her for the boss.
  function hullAtStart(run, max) {
    if (run.boss) return max;
    return Math.min(max, Math.max(T.hullFloor, max - Math.max(0, (run.carry.hullLost || 0) - T.hullRepair)));
  }

  // The crew on the radio, by how far along the stage you are. Only when nothing else is talking. Talk itself is in talk.js.
  function stepRadio(run, w) {
    if (run.endless || run.boss || !w.radio.length || run.time < T.hintSecs) return;
    if (w.dist / run.stage.length < w.radio[0].at || TG.talkBusy(w)) return;
    const r = w.radio.shift();
    const use = r.ifLost && run.carry.lost.includes(r.ifLost) ? r.instead : r;
    TG.sayOne(run, use);
    // The Dive opens as Ione explains it; the how-to follows her line, so the two aren't on screen at once.
    if (r.unlocksDive) { w.diveUnlocked = true; w.diveHintDelay = T.diveHintAfter; }
  }

  // ---- The course keeps rolling in as long as the stage has road left.
  function layAhead(run, w) {
    const s = run.stage;
    if (run.boss) return;
    const horizon = w.dist + T.layAhead;
    while (w.laid.end < horizon && (run.endless || w.laid.end < s.length - T.endClear - T.layEnd)) {
      const gw = run.endless ? Math.max(s.gapMin, run.range(s.gap[0], s.gap[1]) - w.dist * s.gapShrink) : run.range(s.gap[0], s.gap[1]);
      TG.layGate(run, w, s, w.speed, gw);
      TG.layBands(run, w);
      TG.placePages(run, w);
    }
  }

  TG.layAhead = layAhead;

  // ---- A knock. The hull is thrown into the nearest open water, so one mistake isn't three.
  TG.freeWater = function (w) {
    const row = w.dist;
    let best = w.shipX, bestD = 1e9;
    for (let x = T.minX; x <= T.maxX; x += T.freeWaterStep) {
      let blocked = false;
      for (const r of w.rocks) if (TG.hullHits(r, r.x, x, row, 0)) { blocked = true; break; }
      if (!blocked && Math.abs(x - w.shipX) < bestD) { bestD = Math.abs(x - w.shipX); best = x; }
    }
    return best;
  };
  TG.knock = function (run, cause) {
    const w = run.w, A = Kit.art;
    if (w.inv > 0 || run.over) return;
    w.hullLeft--; w.knocks++; w.testInfo.knocks++;
    (w.testInfo.causes = w.testInfo.causes || []).push(cause);
    w.inv = T.invuln; w.hurtT = T.hurtSecs; w.cleanGate = false; w.calm = 0; w.lastCause = cause;
    Kit.audio.play('crack'); Kit.audio.play('hurt');
    if (!run.dry) {
      A.shake(6, 0.3);
      A.burst(w.shipX, w.shipYNow - 20, { n: 16, colors: ['#8a6a48', '#c9a776', '#10121f'], speed: 170, life: 0.6, size: 4 });
    }
    const to = TG.freeWater(w);
    if (to !== w.shipX) w.shuntTo = to;
    if (w.hullLeft <= 0) {
      run.lose();
      // Dying puts back what the stage began with, so what a pick from the list carries must too.
      if (!run.dry && !run.endless && run.index > 0) DriftSave.setStoryCarry('tide-gap', run.carryAtStart);
    }
  };

  // A shut tooth on the surface: thrown into the crack, it costs one knock, and the hull grinds through with no second charge.
  TG.scrape = function (run, w, gate) {
    gate.scraped = true;
    w.inv = 0;
    TG.knock(run, 'shut');
    if (run.over) return;
    w.shuntTo = gate.crack; w.scrapeTo = gate.endAt; w.scrapeX = gate.crack;
    w.inv = Math.max(w.inv, (gate.endAt - w.dist) / w.speed);
    Kit.audio.play('grind');
    if (!w.saidScrape) { w.saidScrape = true; TG.sayNow(run, W().scrapeLine); }
  };
  // What the surface hits. A shut gate that's been scraped already has no more to charge.
  function rockHit(run, w, inset) {
    for (const r of w.rocks) {
      if (r.gate && r.gate.scraped) continue;
      if (TG.hullHits(r, r.x, w.shipX, w.dist, inset)) return r;
    }
    return null;
  }
  TG.surfaceHit = function (run, w, inset) {
    const r = rockHit(run, w, inset);
    if (!r) return false;
    if (r.gate && r.gate.shut) TG.scrape(run, w, r.gate);
    else { if (w.inv > 0 && inset === 0) w.inv = 0; if (w.inv <= 0) TG.knock(run, 'rock'); }
    return true;
  };

  // The crew call the first shut tooth on a stage.
  function stepShut(run, w) {
    if (w.saidShut) return;
    for (const g of w.gates) if (g.shut && g.startAt - w.dist < T.shutCueAt + T.shutCallLead * w.speed) {
      w.saidShut = true;
      const list = W().shutCall, i = run.endless ? list.length - 1 : Math.min(run.index, list.length - 1);
      TG.sayOne(run, list[i], 0, T.shutCallLead);
      return;
    }
  }

  // ---- Steering. The thumb moves an aim; the head chases it; the hull follows the head's path a moment later.
  function steer(run, w, input, dt) {
    if (input.down && !input.pressed) w.targetX += input.dx * T.dragGain;
    if (input.axisX) w.targetX += input.axisX * T.keySteer * dt;
    if ((Math.abs(input.dx) > T.steerSoundMove || input.axisX) && run.time - w.lastSteer > T.steerSoundGap) { w.lastSteer = run.time; Kit.audio.play('steer'); }
    const band = TG.bandHere(w);
    if (band) {
      w.targetX += band.dir * band.force * dt; w.headX += band.dir * band.force * dt;
      if (!w.saidBand) { w.saidBand = true; TG.sayNow(run, W().bandLine); }
    }
    if (w.dist < w.scrapeTo) w.targetX = w.scrapeX;
    w.targetX = clamp(w.targetX, T.minX, T.maxX);
    const dh = clamp((w.targetX - w.headX) * T.headRate, -T.headMax, T.headMax);
    w.headX = clamp(w.headX + dh * dt, T.minX - 6, T.maxX + 6);
    w.trail.pop(); w.trail.unshift(w.headX);
    const lagged = w.trail[Math.min(HISTORY - 1, Math.round(T.towDelay * 60))];
    const before = w.shipX;
    if (w.shuntTo !== null) {
      const d = w.shuntTo - w.shipX, step = Math.sign(d) * Math.min(Math.abs(d), T.shunt * dt);
      w.shipX += step;
      if (Math.abs(d) < 2) { w.targetX = w.headX = w.shipX; w.trail.fill(w.shipX); w.shuntTo = null; }
    } else {
      w.shipX += clamp((lagged - w.shipX) * T.shipRate, -T.shipMax, T.shipMax) * dt;
      if (band) w.shipX += band.dir * band.force * dt * T.bandHullShare;
    }
    w.shipX = clamp(w.shipX, T.minX, T.maxX);
    w.lean += (((w.shipX - before) / dt) / T.shipMax - w.lean) * Math.min(1, dt * 7);
  }

  // ---- One whole step.
  TG.step = function (run, dt, input) {
    const w = run.w;
    if (run.endless) {
      w.speed = Math.min(run.stage.maxSpeed, run.stage.speed + run.time * run.stage.ramp);
      run.stage.look = T.endlessLooks[Math.floor(w.dist / T.endlessLookEvery) % T.endlessLooks.length];
    }
    w.dist += w.speed * dt;
    layAhead(run, w);
    for (const r of w.rocks) {
      r.x = TG.rockX(r, w.dist);
      if (r.grinds && !r.ground && TG.rockP(r, w.dist) >= 1) { r.ground = true; Kit.audio.play('grind'); if (!run.dry) TG.grindFx(w, r); }
    }
    w.rocks = w.rocks.filter(r => r.at + r.len / 2 > w.dist - 260);
    w.gates = w.gates.filter(g => g.endAt > w.dist - 400);
    if (w.inv > 0) w.inv -= dt;
    if (w.hurtT > 0) w.hurtT -= dt;
    if (w.deadT > 0) w.deadT -= dt;
    if (w.bookFx) w.bookFx.t += dt;
    if (w.diveHintDelay > 0) { w.diveHintDelay -= dt; if (w.diveHintDelay <= 0) w.diveHintT = T.diveHintSecs; }
    if (w.diveHintT > 0) w.diveHintT -= dt;
    steer(run, w, input, dt);
    TG.diveStep(run, w, input, dt);
    if (w.dive.state === 'up') TG.surfaceHit(run, w, T.rockInset);
    if (run.w !== w || run.over) return;
    if (w.dist < w.scrapeTo && !run.dry && Math.random() < 0.45) Kit.art.burst(w.shipX + (Math.random() < 0.5 ? -T.hullHalfW : T.hullHalfW), w.shipYNow - 10, { n: 3, colors: ['#f4c152', '#ffffff', '#6a5a50'], speed: 150, life: 0.4, size: 3 });
    stepShut(run, w);
    // Gates passed
    for (const g of w.gates) if (!g.done && w.dist > g.endAt) {
      g.done = true;
      run.addScore(T.scoreGate + (w.cleanGate ? T.scoreClean : 0));
      w.cleanGate = true;
      Kit.audio.play('whoosh');
    }
    TG.stepDrops(run, w, dt);
    TG.stepLances(run, w, dt);
    TG.stepItems(run, w);
    if (run.w !== w || run.over) return;
    TG.stepPals(run, w, dt);
    if (w.boss) TG.bossStep(run, w, dt);
    stepRadio(run, w);
    TG.stepTalk(run, w, dt);
    if (run.endless) { const m = Math.floor(w.dist / T.metre); if (m > (w.mScored || 0)) { run.addScore((m - (w.mScored || 0)) * T.scorePerMetre); w.mScored = m; } }
    else if (!run.boss && w.dist >= run.stage.length) finishStage(run, w);
    w.testInfo.lines = TG.linesLeft(run);
  };

  function finishStage(run, w) {
    run.carry.hullLost = w.hullMax - w.hullLeft;
    TG.talkKeep(run, w);
    run.addSalvage(run.stage.clearSalvage);
    run.addScore(T.scoreClear + T.scoreLine * TG.linesLeft(run));
    Kit.audio.play('splash');
    run.win();
  }
})();
