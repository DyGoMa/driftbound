// Hot Hand fairness script, part: each threat alone, and burning things in the air. Run through tools/fairness.js.
module.exports = async function ({ page, ctx, SEEDS, ONLY, STAGE, stages, check, runMany, line, sum, PLAYERS, MIN_LEAD, SMALL_SCALE, SHOTS, path, fs }) {
  if (!ONLY || ONLY === 'threats' || ONLY === 'audit') {
    console.log('\n== Each threat alone: how long its warning shows, whether it starts on screen, and whether a tap late in the warning still stops it (real input path) ==');
    const rows = await page.evaluate(() => {
      const T = TUNE, I = Kit.input, out = [];
      const step = r => { I._begin(1 / 60); r.time += 1 / 60; HH.step(r, 1 / 60, I); I._end(); };
      const fresh = i => { __kit.title(); __kit.bot(false); __kit.jump(i, { fair: true }); __kit.timeScale = 0; const r = __kit.run(); r.w.deck = []; r.w.spawnIn = 1e9; r.w.hp = 99; r.w.hpMax = 99; r.w.ashka.wait = 1e9; if (r.w.boss) { r.w.boss.addT = 1e9; r.w.boss.quenchT = 1e9; } return r; };
      const threats = {
        'trooper swing': { stage: 0, make: r => HH.addFoe(r, 'grunt', { lane: 2, d: 90 }), warn: f => f.warnAt >= 0 },
        'plate swing': { stage: 0, heat: 40, make: r => HH.addFoe(r, 'plate', { lane: 2, d: 80 }), warn: f => f.warnAt >= 0 },
        'hook wind-up and flight': { stage: 1, heat: 72, make: r => HH.addFoe(r, 'hook', { lane: 1, d: 300 }), warn: f => f.warnAt >= 0, target: (r, f) => r.w.projs[0] || f },
        'window bolt': { stage: 2, heat: 40, make: r => { const f = HH.addFoe(r, 'sniper'); f.t = 0; return f; }, warn: f => f.warnAt >= 0, target: (r, f) => r.w.projs[0] || (f.state !== 'hide' ? f : null) },
        'powder cart fuse': { stage: 2, make: r => { const c = HH.addCart(r); c.d = T.cartReach + 2; c.pusher.d = c.d + 34; return c; }, warn: f => f.warnAt >= 0 },
        'Hollow bite': { stage: 3, heat: 72, make: r => HH.addFoe(r, 'hollow', { lane: 2, side: 1, d: 100 }), warn: f => f.warnAt >= 0 && f.state === 'tell' },
      };
      for (const name of Object.keys(threats)) {
        const th = threats[name];
        // First: untouched. How long from the first warning to the hit?
        let r = fresh(th.stage), f = th.make(r); if (th.heat) r.w.heat = th.heat;
        let n = 0, onScreen = null, x = null;
        while (!r.w.hitLog.length && n++ < 1800) { step(r); if (onScreen === null && th.warn(f)) { x = f.x; onScreen = f.x > 0 && f.x < 640; } }
        const lead = r.w.hitLog.length ? r.w.hitLog[0].lead : null;
        // Then: tap at a share of the warning, through the real input.
        const results = [];
        for (const share of [0.25, 0.5, 0.75, 0.95]) {
          r = fresh(th.stage); f = th.make(r); if (th.heat) r.w.heat = th.heat;
          let t0 = -1, tapped = false; n = 0;
          while (n++ < 900) {
            if (th.heat && !tapped) r.w.heat = th.heat;   // she's kept at this heat until the tap: enough that the throw gets through
            if (t0 < 0 && th.warn(f)) t0 = r.time;
            if (t0 >= 0 && !tapped && r.time - t0 >= lead * share) {
              const t = th.target ? th.target(r, f) : f;
              if (t) { I.sim.tap(t.x, t.kind === 'proj' ? t.y : HH.midY(t)); tapped = true; }
            }
            step(r);
            if (f.dead && !r.w.projs.length && !r.w.shots.length) break;
            if (r.w.hitLog.length) break;
            if (t0 >= 0 && r.time - t0 > lead + 0.3) break;   // past the moment it would have landed: this one was stopped (a live hook-man throws again later, which is another warning)
          }
          results.push(share + ': ' + (r.w.hitLog.length ? 'HIT' : 'stopped'));
        }
        out.push({ name, lead, onScreen, x: Math.round(x), results });
      }
      // The charge, and the quench can, which aren't foes.
      let r = fresh(4); r.w.boss.x = T.ramX + 1; let n = 0, warnAt = null;
      while (!r.w.hitLog.length && n++ < 900) { step(r); if (r.w.boss.state === 'ramTell' && warnAt === null) warnAt = r.time; }
      out.push({ name: 'the charge', lead: r.w.hitLog[0].lead, onScreen: true, x: Math.round(r.w.boss.x), results: ['the line is in plain sight walking at you for ' + T.marchSecs[0] + ' s before this'] });
      r = fresh(4); r.w.wave = 1; r.w.boss.round = 1; r.w.boss.quenchT = 0.01; r.w.heat = 70; const h0 = r.w.heat; n = 0; let t0 = null, tLand = null;
      while (tLand === null && n++ < 900) { step(r); if (t0 === null && r.w.boss.windT > 0) t0 = r.time; if (r.w.quenchT > 0) tLand = r.time; }
      out.push({ name: 'quench can (heat only, no damage)', lead: Math.round((tLand - t0) * 100) / 100, onScreen: true, x: Math.round(r.w.boss.krell.x), results: ['heat went from ' + h0 + ' to ' + Math.round(r.w.heat)] });
      __kit.timeScale = 1; __kit.title();
      return out;
    });
    rows.forEach(r => console.log(`${r.name.padEnd(34)} warned ${String(r.lead).padStart(5)} s  starts at x ${String(r.x).padStart(3)}  tap at share of warning: ${r.results.join(', ')}`));
    let worst = 1e9; rows.forEach(r => { worst = Math.min(worst, r.lead); });
    check(worst >= MIN_LEAD, `every threat warns for at least ${MIN_LEAD} s (least ${worst} s)`);
    check(rows.every(r => r.onScreen), 'every warning starts on screen');
    check(rows.every(r => !r.results.some(x => /HIT/.test(x))), 'a tap at any point in the warning, up to 95% through, still stops it');
  }

  if (!ONLY || ONLY === 'air') {
    console.log('\n== Burning things in the air with a thumb that arrives late: the share of each flight where a tap at the seen position still connects, through HH.pick ==');
    const rows = await page.evaluate(() => {
      const T = TUNE, out = [];
      __kit.title(); __kit.bot(false); __kit.jump(1, { fair: true }); __kit.timeScale = 0;
      const r = __kit.run(), w = r.w; w.deck = []; w.foes = []; w.spawnIn = 1e9; w.ashka.wait = 1e9;
      const k = HH.bossNew().krell, jx = w.jx, footY = HH.laneAt(1, 340).y, body = T.foes.hook.cm * T.pxPerCm * HH.laneAt(1, 340).s;
      const paths = {
        'hook from far': [jx + T.foes.hook.throwD[1], footY - body * 0.8, T.hookFly, T.hookArc],
        'hook from near': [jx + T.foes.hook.throwD[0], HH.laneAt(1, T.foes.hook.throwD[0]).y - body * 0.8, T.hookFly, T.hookArc],
        'bolt, window 3': [T.windows[2][0], T.windows[2][1] - 40, T.sniperFly, 16],
        'bolt, window 6': [T.windows[5][0], T.windows[5][1] - 40, T.sniperFly, 16],
        'quench can': [T.lineStart + T.krellX - 10, k.y - k.h, T.quenchFly, 90],
      };
      for (const name of Object.keys(paths)) {
        const q = paths[name], row = { name, speed: Math.round(Math.hypot(q[0] - jx, q[1] - (T.frontY - 55)) / q[2]), shares: {} };
        for (const lag of [0.1, 0.15, 0.25, 0.35]) {
          let yes = 0, all = 0;
          for (let at = lag; at <= q[2]; at += 1 / 60) {
            w.projs = []; const p = HH.addProj(r, 'hook', q[0], q[1], q[2], q[3], 0), then = HH.projAt(p, at - lag), now = HH.projAt(p, at);
            p.t = at; p.x = now.x; p.y = now.y; all++;
            if (HH.pick(r, then.x, then.y) === p) yes++;
          }
          row.shares[lag] = Math.round(yes / all * 100);
        }
        out.push(row);
      }
      w.projs = []; __kit.timeScale = 1; __kit.title();
      return out;
    });
    rows.forEach(r => console.log(`${r.name.padEnd(16)} ${String(r.speed).padStart(4)} px/s  lag 0.1 s ${r.shares[0.1]}%, 0.15 s ${r.shares[0.15]}%, 0.25 s ${r.shares[0.25]}%, 0.35 s ${r.shares[0.35]}%`));
    check(rows.every(r => r.shares[0.1] >= 95 && r.shares[0.15] >= 95 && r.shares[0.25] >= 95), 'a tap at what you saw, up to 0.25 s late, connects for at least 95% of every flight');
    console.log('\nPlayed: the average bot, how many things in the air got burned, by thumb lag (10 seeds a stage):');
    for (const st of [1, 2, 4]) {
      for (const lag of [0, 0.1, 0.15, 0.2, 0.25]) {
        const res = await page.evaluate(([st, lag]) => {
          const T = TUNE, keepH = T.botHuman, addP = HH.addProj, thr = HH.throwAt; let made = 0, burned = 0, wins = 0, air = 0;
          HH.addProj = function () { made++; return addP.apply(HH, arguments); };
          HH.throwAt = function (run, t) { if (t.kind === 'proj') burned++; return thr.apply(HH, arguments); };
          T.botHuman = { react: 0.45, taps: 2.8, jitter: 12, sloppy: 0.18, slip: 0.2, lag };
          for (let s = 1; s <= 10; s++) { const q = __kit.runStage(st, { bot: true, seed: s * 7919 + st * 13, fair: true, renderEvery: 0 }); if (q.result === 'win') wins++; air += q.info.hitLog.filter(h => h.why === 'hook' || h.why === 'bolt').length; }
          HH.addProj = addP; HH.throwAt = thr; T.botHuman = keepH;
          return { made, burned, wins, air };
        }, [st, lag]);
        console.log(`  stage ${st + 1}, lag ${lag} s: burned ${res.burned} of ${res.made}, hits from the air ${res.air}, wins ${res.wins}/10`);
      }
    }
  }
};
