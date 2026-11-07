// Tide Gap: Hekka's cutter. A state machine, logic only. Volleys of lances and pylons, then the keel plates glow and you Dive under, steer to one, and burst up.
window.TG = window.TG || {};
(function () {
  const T = TUNE, B = T.boss, W = () => TG.WORDS.boss;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  TG.bossNew = () => ({
    state: 'enter', t: 0, round: 0, cx: 180, y: B.startY, broken: [false, false, false], hits: 0, move: 0, moveT: B.firstMove, chains: [], pages: [], pageT: B.pageEvery, phase: 0, flash: 0, tilt: 0,
    returning: false, saidEmpty: false, nextChain: null, throwT: 0, sink: 0,
  });

  TG.plateAt = (b, i) => ({ x: b.cx + B.plates[i][0], y: b.y + B.plates[i][1] });
  // Can a Dive start? Any time but the fall: a Dive while she's shooting just buys you a dodge, at the same price.
  TG.bossDiveOK = w => w.boss.state !== 'fall' && w.boss.state !== 'enter' && !w.boss.returning;

  // Hauled forward while under. Only while the plates glow; otherwise a Dive is a plain dodge.
  TG.bossCharge = function (run, w, dt) {
    const b = w.boss;
    if (b.state === 'open') w.shipYNow = Math.max(b.y + B.reachLine - B.chargeStop, w.shipYNow - B.chargeSpeed * dt);
  };

  // Let go, or out of air, on the way up.
  TG.bossBurst = function (run, w) {
    const b = w.boss, A = Kit.art;
    if (b.state === 'open' && w.shipYNow <= b.y + B.reachLine) {
      let hit = -1;
      B.plates.forEach((p, i) => { if (!b.broken[i] && Math.abs(b.cx + p[0] - w.shipX) < B.plateNear) hit = i; });
      if (hit >= 0) {
        b.broken[hit] = true; b.hits++; b.round = Math.min(2, b.hits);
        run.addScore(T.scorePlate);
        Kit.audio.play('boom'); Kit.audio.play('crack');
        if (!run.dry) {
          const p = TG.plateAt(b, hit);
          A.shake(8, 0.45);
          A.burst(p.x, p.y, { n: 26, colors: ['#ffffff', '#35c4cc', '#6a7078', '#10121f'], speed: 240, life: 0.8, size: 5 });
          A.floatText(p.x, p.y - 20, 'PLATE!', A.GOLD, 22);
        }
        b.flash = 0.3;
        b.returning = true;
        // Her file on Sela shakes loose, but only when the book has nothing left to pay the next Dive with. Otherwise the plates cost their lines and those stay gone.
        if (b.hits < B.plates.length && TG.linesLeft(run) + TG.spareLeft(run) === 0) dropPage(run, b, clamp(TG.plateAt(b, hit).x, T.pageX[0], T.pageX[1]), TG.plateAt(b, hit).y + B.pageBelow);
        for (const l of w.lances) l.t = 99;
        w.lances = [];
        if (b.hits >= B.plates.length) { b.state = 'fall'; b.t = 0; TG.sayNow(run, W().fall); }
        else { b.state = 'stagger'; b.t = 0; TG.sayNow(run, W().hit[(b.hits - 1) % W().hit.length]); }
        return;
      }
      // Under the hull but not under a plate: a crack on the head, unless already past the side of it.
      if (Math.abs(b.cx - w.shipX) < B.cutterHalfW) { w.inv = 0; TG.knock(run, 'hull'); TG.sayNow(run, W().crash); }
      else TG.sayNow(run, W().miss);
    }
    b.returning = w.shipYNow < w.homeY - 1;
  };

  function dropPage(run, b, x, y) {
    b.pages.push({ x, y });
    Kit.audio.play('page');
    if (!b.saidLoose) { b.saidLoose = true; TG.sayOne(run, W().pageLoose); }
  }

  // The red lane is Sela's sense too: the thinner the book, the later she feels it coming.
  TG.bossWarn = (run, round) => B.warn[round] - B.warnPerLine * (T.bookRows - TG.linesLeft(run));

  function chainPlan(run, w) {
    const gap = B.chainGap;
    // The way through is on the far side from the hull more often than not, so it asks you to move.
    const leftOpen = run.rng() < (w.shipX > 180 ? B.chainFarOdds[0] : B.chainFarOdds[1]);
    const a = leftOpen ? TG.WALL_L + gap + B.chainPost : TG.WALL_L, c = leftOpen ? TG.WALL_R : TG.WALL_R - gap - B.chainPost;
    return { a, b: c, gap: leftOpen ? [TG.WALL_L, a] : [c, TG.WALL_R] };
  }
  function chainAcross(run, w) {
    const b = w.boss, c = b.nextChain || chainPlan(run, w);
    b.nextChain = null;
    b.chains.push(Object.assign(c, { y: b.y + B.cutterHalfLen }));
    Kit.audio.play('pylon');
  }
  // These are the boss's drift arrows: the fuller her book, the sooner she feels which way a chain's way through will lie. A blank book sees it when it drops. cutter.js draws it.
  function feelChain(run, w) {
    const b = w.boss;
    if (b.nextChain || B.volley[b.round][b.move] !== 'pylon') return;
    if (b.moveT <= TG.senseNow(run).lead) b.nextChain = chainPlan(run, w);
  }

  // One danger at a time on the water: a lance never lands while a chain is still coming, and a chain never drops with a cable up, so you can't be trapped behind one by the other.
  // And a new lance never lands until the old cables have been down for T.boss.cableClear seconds, or a fan could box the hull in with no way out but a Dive.
  function clearToFire(w, kind, warn) {
    const b = w.boss;
    if (kind === 'pylon') return !w.lances.length;
    if (b.chains.some(c => c.y < w.shipYNow + T.hullHalfLen + B.chainClear)) return false;
    return w.lances.every(l => (l.state === 'warn' ? l.warnLeft + l.stay : l.stay - l.t) <= warn - B.cableClear);
  }

  function fire(run, w) {
    const b = w.boss, list = B.volley[b.round], kind = list[b.move];
    if (!clearToFire(w, kind, TG.bossWarn(run, b.round))) { b.moveT = B.retryMove; return; }
    b.throwT = 0.5;
    const warn = TG.bossWarn(run, b.round);
    if (kind === 'lance') TG.addLance(run, w, w.shipX, warn);
    else if (kind === 'fan') { const off = B.fanSpread / 2; TG.addLance(run, w, w.shipX - off, warn); TG.addLance(run, w, w.shipX + off, warn); }
    else chainAcross(run, w);
    b.move++;
    b.moveT = B.gap[b.round];
  }

  TG.bossStep = function (run, w, dt) {
    const b = w.boss;
    b.t += dt; b.phase += dt;
    if (b.flash > 0) b.flash -= dt;
    if (b.throwT > 0) b.throwT -= dt;
    if (b.state !== 'fall') { b.sway = (b.sway || 0) + dt * Math.PI * 2 / B.strafeSecs[b.round]; b.cx = 180 + Math.sin(b.sway) * (B.strafe[1] - B.strafe[0]) / 2; }

    // The hull comes back to its place after a charge.
    if (w.dive.state !== 'down' && w.shipYNow < w.homeY) {
      w.shipYNow = Math.min(w.homeY, w.shipYNow + B.returnSpeed * dt);
      if (w.shipYNow >= w.homeY) b.returning = false;
    }
    if (b.state === 'enter') {
      b.y = B.startY + (B.cutterY - B.startY) * Math.min(1, b.t / B.enterSecs);
      if (b.t >= B.enterSecs) { b.state = 'volley'; b.t = 0; b.move = 0; b.moveT = B.firstMove; TG.sayNow(run, W().start); }
    } else if (b.state === 'volley') {
      b.moveT -= dt;
      feelChain(run, w);
      if (b.moveT <= 0) {
        if (b.move < B.volley[b.round].length) fire(run, w);
        else if (!w.lances.length && !b.chains.some(c => c.y < w.shipYNow + T.hullHalfLen + B.chainClear)) { b.state = 'open'; b.t = 0; Kit.audio.play('chime'); TG.sayNow(run, W().open); }
      }
    } else if (b.state === 'open') {
      if (b.t > B.open[b.round] && w.dive.state === 'up') { b.state = 'volley'; b.t = 0; b.move = 0; b.moveT = B.afterOpen; }
      else if (B.openLance[b.round] && w.dive.state === 'up') {
        b.openT = (b.openT === undefined ? B.openLanceFirst : b.openT) - dt;
        const warn = TG.bossWarn(run, b.round);
        if (b.openT <= 0 && clearToFire(w, 'lance', warn)) { b.openT = B.openLance[b.round]; b.throwT = 0.5; TG.addLance(run, w, w.shipX, warn); }
      }
    } else if (b.state === 'stagger') {
      if (b.t >= B.staggerSecs && !b.returning) { b.state = 'volley'; b.t = 0; b.move = 0; b.moveT = B.afterStagger; }
    } else if (b.state === 'fall') {
      b.sink = Math.min(1, b.t / B.fallSecs);
      b.tilt = b.sink * 0.35;
      w.tow += (Math.max(B.towLen, w.shipYNow - b.y) - w.tow) * Math.min(1, dt * 5);   // his head reaches the deck
      b.y += B.fallDrift * dt;
      if (!run.dry && Math.random() < 0.25) Kit.art.burst(b.cx + (Math.random() - 0.5) * 110, b.y + (Math.random() - 0.5) * 140, { n: 8, colors: ['#ff8a2a', '#f4c152', '#6a7078'], speed: 150, life: 0.6, size: 4 });
      if (Math.random() < 0.12) Kit.audio.play('boom');
      // The fight's over, so the crew get the last word: any scene still owed plays out while she sinks.
      if (b.t >= B.fallSecs && (!TG.talkBusy(w) || b.t >= B.fallTalkMax)) {
        run.addSalvage(run.stage.clearSalvage);
        run.addScore(T.scoreClear + T.scoreLine * TG.linesLeft(run));
        TG.setEnding(run);
        run.win();
        return;
      }
    }

    // Chains drift down with the water. Pylons and the chain between them knock a hull on the surface.
    for (const c of b.chains) {
      c.y += B.pylonSpeed * dt;
      if (b.state !== 'fall' && w.dive.state === 'up' && w.inv <= 0 && Math.abs(c.y - w.shipYNow) < T.hullHalfLen - B.chainGrace && w.shipX + T.hullHalfW - B.chainSideGrace > c.a && w.shipX - T.hullHalfW + B.chainSideGrace < c.b) TG.knock(run, 'pylon');
    }
    b.chains = b.chains.filter(c => c.y < w.homeY + B.pylonLand);

    // Loose pages. There's always one coming if the book is empty, so the fight can always be finished.
    const left = TG.linesLeft(run) + TG.spareLeft(run);
    if (left === 0 && b.state !== 'fall') {
      b.pageT -= dt;
      if (!b.saidEmpty) { b.saidEmpty = true; TG.sayOne(run, W().empty, 0, T.talkStaleLong); }
      if (b.pageT <= 0 && !b.pages.length) { b.pageT = B.pageEvery; dropPage(run, b, clamp(w.shipX + (w.shipX < 180 ? B.pageOffset : -B.pageOffset), T.pageX[0], T.pageX[1]), b.y + B.cutterHalfLen); }
    }
    for (const p of b.pages) {
      p.y += B.pageSpeed * dt;
      p.x += Math.sin(b.phase * 2.4 + p.y * 0.02) * B.pageDrift * dt;
      if (w.dive.state === 'up' && Math.abs(p.y - w.shipYNow) < T.hullHalfLen && Math.abs(p.x - w.shipX) < T.grabRadius + B.pageGrab) { p.got = true; if (TG.findPage(run)) TG.sayOne(run, run.pick(TG.WORDS.pageFound)); }
    }
    b.pages = b.pages.filter(p => !p.got && p.y < 640);

    // A jab from the file she stole, now and then, using what's really gone.
    if (b.state === 'volley' && !TG.talkBusy(w) && b.t > 1 && run.carry.lost.length) {
      b.jabT = (b.jabT === undefined ? B.jabFirst : b.jabT) - dt;
      if (b.jabT <= 0) { b.jabT = B.jabEvery; const m = TG.memory(run.pick(run.carry.lost)); if (m && m.jab) TG.sayOne(run, { who: 'hekka', text: m.jab }); }
    }
  };
})();
