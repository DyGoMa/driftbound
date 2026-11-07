// Hold the Deck: everything that warns first. Hooks, crates, boarders on lines. Every warning lights its lane, and hits only when its time is up.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art, DANGER = { hook: 1, drop: 1, paw: 1, swipe: 1, charge: 1, volley: 1 };
  HD.litHere = w => w.warns.some(x => DANGER[x.kind] && HD.inLane(w, x.lane));
  HD.litAny = w => w.warns.some(x => DANGER[x.kind]);

  // True if a new warning on this lane leaves Bram a fair way out, as slow as he is right now. If it doesn't, the caller tries again a moment later.
  // Fair means: one lane stays dark, and he can walk to a dark lane with fairReact seconds to spare, before anything hits the lane he's in.
  HD.fairToWarn = function (run, lane, secs) {
    const w = run.w, lit = {}, here = Math.round(w.target);
    for (const x of w.warns) if (DANGER[x.kind]) lit[x.lane] = Math.min(lit[x.lane] === undefined ? 99 : lit[x.lane], x.total - x.t);
    lit[lane] = Math.min(lit[lane] === undefined ? 99 : lit[lane], secs);
    // A dark lane only counts if he can walk there without crossing a lit one.
    const open = l => { for (let k = Math.min(l, here) + 1; k < Math.max(l, here); k++) if (lit[k] !== undefined) return false; return true; };
    const safe = [0, 1, 2].filter(l => lit[l] === undefined && open(l));
    if (!safe.length) return false;
    if (lit[here] === undefined) return true;
    const walk = HD.stepTime(run) * Math.min(...safe.map(l => Math.max(Math.abs(l - here), Math.abs(l - w.lanePos))));   // he may be part way to the lane he's picked, so from wherever's further
    return lit[here] - walk >= T.fairReact;
  };

  // How long the walk to the nearest dark lane takes right now, if this lane were lit and he's in it. For the test report.
  HD.walkOut = function (run, lane) {
    const w = run.w, lit = { [lane]: 1 };
    for (const x of w.warns) if (x.kind !== 'wall' && x.kind !== 'rope') lit[x.lane] = 1;
    if (!lit[w.target]) return 0;   // already on his way to a dark lane: nothing to react to
    const dark = [0, 1, 2].filter(l => !lit[l]);
    return Math.round(HD.stepTime(run) * Math.min(...dark.map(l => Math.abs(l - Math.round(w.lanePos)))) * 1000) / 1000;
  };

  // Lights a lane. Returns false, and does nothing, if it wouldn't be fair just now.
  HD.warn = function (run, kind, lane, secs, data = {}) {
    const w = run.w, harmless = kind === 'wall' || kind === 'rope';
    if (!harmless && !HD.fairToWarn(run, lane, secs)) return false;
    const x = Object.assign({ kind, lane, t: 0, total: secs }, data);
    w.warns.push(x);
    w.warnLog.push({ kind, lane, at: Math.round(run.time * 100) / 100, total: secs, from: Math.round(w.lanePos), iron: Math.round((run.carry.iron || 0) * 100) / 100, need: harmless ? null : HD.walkOut(run, lane) });
    if (!harmless) Kit.audio.play('alarm');
    return true;
  };

  // Every lane at once. There's no walking out of this one: hold for Iron, or take it. It waits until nothing else is lit, so it never comes on top of another warning.
  HD.volley = function (run, what) {
    const w = run.w;
    if (HD.litAny(w)) return false;
    for (const lane of [0, 1, 2]) w.warns.push({ kind: 'volley', what, lane, t: 0, total: T.volleyWarn, d: T.bramD });
    w.volleys++; w.hintT = 0;
    w.warnLog.push({ kind: 'volley', lane: 1, at: Math.round(run.time * 100) / 100, total: T.volleyWarn, from: Math.round(w.lanePos), iron: Math.round((run.carry.iron || 0) * 100) / 100, need: T.holdSecs });
    Kit.audio.play('alarm');
    HD.first(run, HD.locked(run) ? 'volleyLocked' : 'volley', true);
    return true;
  };

  HD.stepWarns = function (run, dt) {
    const w = run.w;
    for (const x of w.warns.slice()) {
      x.t += dt;
      if (x.t >= x.total) {
        w.warns.splice(w.warns.indexOf(x), 1);
        fire(run, x);
        if (run.over) return;
      }
    }
    for (const c of w.splats) c.age += dt;
    w.splats = w.splats.filter(c => c.age < 0.6);
  };

  HD.cancelWarnsFrom = function (run, f) {
    const w = run.w;
    w.warns = w.warns.filter(x => x.from !== f);
  };

  function fire(run, x) {
    const w = run.w;
    if (x.kind === 'hook') fireHook(run, x);
    else if (x.kind === 'drop') fireDrop(run, x);
    else if (x.kind === 'wall') fireWall(run, x);
    else if (x.kind === 'rope') { HD.spawn(run, 'rope', x.lane, { d: x.d }); Kit.audio.play('land'); }
    else if (x.kind === 'volley') fireVolley(run, x);
    else HD.bossFire(run, x);
    if (x.from) moveOn(run, x.from);
  }

  // After a throw the cutter either takes his next aim or walks in.
  function moveOn(run, f) {
    f.throws++; f.warned = false;
    if (f.throws >= T.foes.cutter.throws) { f.state = 'walk'; f.t = 0; }
    else { f.state = 'aim'; f.aimIn = T.foes.cutter.every - T.hookWarn; }
  }

  function fireHook(run, x) {
    const w = run.w, y = HD.yOf(T.bramD);
    if (HD.inLane(w, x.lane)) {
      if (w.ironOn) {
        bounceBack(run, x.lane, T.temperIronBlock);
      } else HD.hurt(run, T.hookHurt, 'hook');
    } else {
      // It misses and buries itself in the counter.
      Kit.audio.play('crack');
      w.stuck.push({ lane: x.lane, age: 0, jig: run.rng() });
      if (w.stuck.length > 4) w.stuck.shift();
    }
  }

  // A hook off Iron goes back up the lane and takes the first boarder it meets.
  function bounceBack(run, lane, temper) {
    const w = run.w, y = HD.yOf(T.bramD);
    w.blocks++;
    Kit.audio.play('clang'); A().shake(4, 0.2);
    A().burst(HD.laneX(lane, y - 60), y - 90, { n: 12, colors: ['#ffffff', '#ffd9a0', '#ff9a4a'], speed: 220, life: 0.35, size: 3 });
    A().floatText(HD.laneX(lane, 380), 360, 'CLANG!', '#ffffff', 26);
    HD.addTemper(run, temper);
    const near = w.foes.filter(f => f.lane === lane && !f.dead).sort((a, b) => b.d - a.d)[0];
    if (near) { near.hp -= T.reflectDamage; near.flash = 0.2; if (near.hp <= 0) HD.kill(run, near, 'hook'); }
    w.bounces.push({ lane, d: T.bramD, to: near ? near.d : 0, t: 0 });
  }

  // One lane of a volley landing. what: hook, crate, claws (the bear's rake) or quake (the bear under the deck).
  function fireVolley(run, x) {
    const w = run.w, y = HD.yOf(T.bramD), cx = HD.laneX(x.lane, y), here = HD.inLane(w, x.lane), what = x.what;
    if (x.lane === 1) { Kit.audio.play(what === 'crate' ? 'crate' : what === 'hook' ? 'crack' : 'boom'); A().shake(6, 0.28); }
    if (what === 'crate') {
      w.splats.push({ x: cx, y, age: 0 });
      A().burst(cx, y - 18, { n: 18, colors: ['#a97a4a', '#6e4c2c', '#f5efe2'], speed: 220, life: 0.45, size: 3.4 });
      for (const f of w.foes) if (f.lane === x.lane && !f.dead && Math.abs(f.d - x.d) < T.dropKillD) HD.kill(run, f, 'crate');
    } else if (what === 'claws') w.boss.rakes.push({ lane: x.lane, t: 0 });
    else if (what === 'quake') A().burst(cx, y - 6, { n: 16, colors: ['#8a6a48', '#5a4030', '#ffffff'], speed: 240, life: 0.45, size: 3.4 });
    if (here && w.ironOn) {
      const temper = run.boss ? T.boss.temperBlock : T.temperVolley;
      if (what === 'hook') { bounceBack(run, x.lane, temper); return; }
      w.blocks++;
      Kit.audio.play('clang');
      A().floatText(cx, y - 80, 'CLANG!', '#ffffff', 26);
      HD.addTemper(run, temper);
      if (what === 'crate') HD.dropCog(run, cx, y - 40, T.dropSalvage);
    } else if (here) { w.tookVolley = w.tookVolley || !HD.locked(run); HD.hurt(run, HD.locked(run) ? T.volleyHurtLocked : T.volleyHurt, 'volley'); }
    else if (what === 'hook') { w.stuck.push({ lane: x.lane, age: 0, jig: run.rng() }); if (w.stuck.length > 4) w.stuck.shift(); }
    else if (what === 'crate') HD.dropCog(run, cx, y - 20, T.dropSalvage);
  }

  function fireDrop(run, x) {
    const w = run.w, y = HD.yOf(x.d), cx = HD.laneX(x.lane, y);
    Kit.audio.play('crate'); A().shake(5, 0.22);
    w.splats.push({ x: cx, y, age: 0 });
    A().burst(cx, y - 18, { n: 18, colors: ['#a97a4a', '#6e4c2c', '#f5efe2'], speed: 220, life: 0.45, size: 3.4 });
    if (HD.inLane(w, x.lane)) {
      if (w.ironOn) {
        w.blocks++;
        A().floatText(cx, y - 80, 'CLANG!', '#ffffff', 26);
        Kit.audio.play('clang');
        HD.addTemper(run, T.temperIronBlock);
        HD.dropCog(run, cx, y - 40, T.dropSalvage);
      } else HD.hurt(run, T.crateHurt, 'crate');
    } else HD.dropCog(run, cx, y - 20, T.dropSalvage);
    for (const f of w.foes) if (f.lane === x.lane && !f.dead && Math.abs(f.d - x.d) < T.dropKillD) HD.kill(run, f, 'crate');
  }

  function fireWall(run, x) {
    const w = run.w, y = HD.yOf(x.d), cx = HD.laneX(x.lane, y);
    Kit.audio.play('crate'); A().shake(3, 0.16);
    A().burst(cx, y - 8, { n: 10, color: '#c8bfae', speed: 110, life: 0.3, size: 3 });
    for (const f of w.foes) if (f.lane === x.lane && !f.dead && Math.abs(f.d - x.d) < T.wallKillD) HD.kill(run, f, 'crate');   // a boarder under it has had a bad day
    w.walls.push({ lane: x.lane, d: x.d, chew: 0, seed: run.int(0, 99) });
  }

  // ---- Walls: crates that land and stay. Boarders walk round them; a swing or Grist smashes them.
  HD.wallAhead = function (w, f) {
    for (const c of w.walls) if (c.lane === f.lane && c.d > f.d && c.d - f.d < T.wallAheadD) return c;
    return null;
  };
  // Which lane to step into to pass this wall, or null if every way is shut.
  HD.laneRound = function (run, lane, wall) {
    const w = run.w, open = l => l >= 0 && l <= 2 && !w.walls.some(c => c.lane === l && Math.abs(c.d - wall.d) < T.wallRoundD);
    const opts = [lane - 1, lane + 1].filter(open);
    if (!opts.length) return null;
    return opts.length === 1 ? opts[0] : opts[run.rng() < 0.5 ? 0 : 1];
  };
  HD.smashWall = function (run, c, paid) {
    const w = run.w, y = HD.yOf(c.d), x = HD.laneX(c.lane, y);
    w.walls.splice(w.walls.indexOf(c), 1);
    Kit.audio.play('crate');
    A().burst(x, y - 16, { n: 18, colors: ['#a97a4a', '#6e4c2c', '#f5efe2'], speed: 200, life: 0.45, size: 3.4 });
    w.splats.push({ x, y, age: 0 });
    if (paid) HD.dropCog(run, x, y - 24, T.wallSalvage);
  };
})();
