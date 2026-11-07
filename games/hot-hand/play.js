// Hot Hand: one attempt's world and the order of one step. Rules only.
window.HH = window.HH || {};
(function () {
  const T = TUNE;

  HH.newWorld = function (run) {
    const s = run.stage, jx = s.both ? T.junoMidX : T.junoX;
    return {
      jx, face: 1, heat: 0, heatWas: 0, coolMul: HH.baseCool(run), lockT: 0, lockFull: 1, throwT: 0, hurtT: 0, inv: 0, quenchT: 0, deadTap: 0, flash: 0, overAt: -1,
      hp: s.hp || T.hpStages, hpMax: s.hp || T.hpStages, lastHurt: null,
      foes: [], projs: [], shots: [], corpses: [], rings: [], ashka: HH.ashkaNew(jx + 30),
      phase: 'wave', wave: 0, deck: [], gap: [2, 3], spawnIn: 1, gapT: 0, waveT: 0, bannerT: 0, hitWave: false,
      table: 0, extra: 0, stake: 0, bustAmount: 0, bustT: 0, winT: 0, lastBust: 0, wonLast: 0, lostLast: 0, bets: 0, betsWon: 0, betsLost: 0,
      sayQ: [], sayNext: 0, kills: 0, hotKills: 0, throws: 0, overCount: 0, hotTime: 0, seen: {}, hitLog: [], pal: null, cinderTried: false,
      boss: run.boss ? HH.bossNew() : null,
    };
  };

  // What a thumb at x, y touches. Things in the air first (they're the urgent ones), then the nearest body, or a pal if it's nearer. A flame already on its way to kill something doesn't count it twice.
  HH.pick = function (run, x, y) {
    const w = run.w;
    let best = null, bestD = 1e9;
    for (const p of w.projs) {
      if (p.doomed) continue;
      const d = HH.projMiss(p, x, y);
      if (d <= T.projReach && d < bestD) { best = p; bestD = d; }
    }
    if (best) return best;
    const list = HH.targets(run), tier = HH.tier(w.heat);
    let doomed = null, shut = null, shutD = 1e9;
    for (const t of list) {
      const b = HH.box(t), dx = Math.max(b.x0 - x, 0, x - b.x1), dy = Math.max(b.y0 - y, 0, y - b.y1), d = Math.hypot(dx, dy);
      if (d > T.tapReach) continue;
      const cd = Math.hypot(t.x - x, HH.midY(t) - y);
      if (t.kind === 'foe' && t.pending >= t.hp) { doomed = t; continue; }
      // Anything a flame can't get into right now (a shut vent, a Hollow's shut plates) only gets the tap if nothing else is under the thumb: a grunt walking past a shut shield stays the target.
      if (HH.absorb(t, tier) === 'clang') { if (cd < shutD) { shut = t; shutD = cd; } continue; }
      if (cd < bestD) { best = t; bestD = cd; }
    }
    if (!best && shut) { best = shut; bestD = shutD; }
    // A pal only gets the tap if it's nearer the thumb than the body it's walking past, so a tap meant for a trooper stays a throw.
    const p = w.pal;
    if (p && Math.abs(p.x - x) <= T.palHalfW && y >= p.y - (p.id === 'dicemite' ? T.palTallDice : T.palTall) && y <= p.y + T.palBelow && (!best || Math.hypot(p.x - x, p.y - T.palTall / 2 - y) < bestD)) return p;
    return best || (doomed ? 'doomed' : null);
  };
  // Everything on the ground or in a window that can be thrown at right now.
  HH.targets = function (run) {
    const w = run.w, out = w.foes.filter(f => !f.dead && !(f.type === 'sniper' && f.state === 'hide'));
    if (w.boss && w.phase === 'wave') {
      if (w.boss.krell.exposed) out.push(w.boss.krell);
      else if (w.boss.state !== 'beaten') w.boss.shields.forEach(s => { if (!s.down) out.push(s); });
    }
    return out;
  };

  // The key on a computer: the most urgent thing there is.
  function nearest(run) {
    const w = run.w;
    const air = w.projs.filter(p => !p.doomed);
    if (air.length) return air.sort((a, b) => (b.t / b.dur) - (a.t / a.dur))[0];
    const heat = HH.tier(w.heat), through = (t, how) => HH.absorb(t, t.mark > 0 ? Math.min(3, heat + 1) : heat) === how;   // a mark hits a tier harder, so a marked plate gets through even cold
    const live = HH.targets(run).filter(t => (t.kind !== 'foe' || t.pending < t.hp) && t.x > -30 && t.x < 700);
    const list = live.filter(t => through(t, 'ok'));
    if (w.boss) { const o = list.filter(t => t.kind !== 'foe'); if (o.length && !list.some(t => t.kind === 'foe' && t.state === 'tell')) return o[0]; }
    // Nothing a flame gets through right now: a plate still takes the throw. It bounces, but that's how cold hands warm up, as a tap on it would.
    const pool = list.length ? list : live.filter(t => through(t, 'bounce'));
    pool.sort((a, b) => (a.d === undefined ? 1e6 : a.d) - (b.d === undefined ? 1e6 : b.d));
    return pool[0] || null;
  }

  function handleTap(run, input) {
    const w = run.w;
    const key = input.keyPressed('Space') || input.keyPressed('Enter');
    if (!input.pressed && !key) return false;
    if (w.phase === 'done') return false;
    let t = key ? nearest(run) : HH.pick(run, input.x, input.y);
    if (!t || t === 'doomed') return false;
    if (t.kind === 'pal') return HH.tapPal(run, t);
    if (w.lockT > 0) { w.deadTap = T.deadTapSecs; HH.sfx(run, 'locked'); return false; }
    HH.throwAt(run, t);
    return false;
  }

  // In tests only: the smallest tap target that has been on screen, in logical px.
  function noteBoxes(run) {
    const w = run.w;
    for (const t of HH.targets(run)) { const b = HH.box(t); w.minBoxW = Math.min(w.minBoxW === undefined ? 1e9 : w.minBoxW, b.x1 - b.x0); w.minBoxH = Math.min(w.minBoxH === undefined ? 1e9 : w.minBoxH, b.y1 - b.y0); }
  }

  HH.step = function (run, dt, input) {
    const w = run.w;
    for (const k of ['throwT', 'hurtT', 'inv', 'quenchT', 'deadTap', 'flash']) if (w[k] > 0) w[k] -= dt;
    if (w.hp > 0 && handleTap(run, input)) return;
    if (run.over) return;
    HH.stepSay(run);
    HH.stepHeat(run, dt);
    HH.stepAshka(run, dt);
    HH.stepShots(run, dt);
    HH.stepFoes(run, dt);
    HH.stepProjs(run, dt);
    if (run.over) return;
    HH.stepPal(run, dt);
    HH.stepWave(run, dt);
    w.heatSum = (w.heatSum || 0) + w.heat * dt;
    if (Kit.test) noteBoxes(run);
    w.testInfo = { avgHeat: Math.round(w.heatSum / run.time), minBoxW: w.minBoxW, minBoxH: w.minBoxH, table: w.table, stake: w.stake,  hp: w.hp, hits: w.hitLog.length, hitLog: w.hitLog, throws: w.throws, over: w.overCount, kills: w.kills, bets: w.bets, won: w.betsWon, lost: w.betsLost, burns: run.carry.burns || 0, hotTime: Math.round(w.hotTime * 10) / 10, wave: w.wave };
  };
})();
