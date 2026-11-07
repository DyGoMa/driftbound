// For fairness.js, not loaded by the game: a player with no look-ahead, a lazy one, and the dim-phone sums.
// The human-speed player knows only what the screen shows: a beam's place, way and marked turning points; each trooper's place, facing and "!"; Maro's facing and shut book; the meter.
// It sees all of that late by a reaction time it draws fresh for each decision (0.25 to 0.45 s), and it presses through input.sim like any thumb.
const source = `
(function () {
  const T = TUNE;
  // Where a beam will be, by eye: follow its visible motion and its marked turning points, starting from a late look, with a small error.
  function beamHits(w, x0, x1, tSeen, secs, err) {
    const stepsN = 16;
    let litTime = 0;
    for (let i = 0; i <= stepsN; i++) {
      const u = i / stepsN, now = tSeen + (secs + err) * u, me = x0 + (x1 - x0) * u;
      for (const sw of w.sweeps) if (Math.abs(me - SC.sweepAt(sw, now).x) < sw.r + T.halfW + 14) litTime += secs / stepsN;
    }
    return litTime;
  }
  function lanternOnPath(w, x0, x1) { return w.lanterns.filter(l => l.lit && l.x + l.r > x0 && l.x - l.r < x1); }
  function nextPlace(w) {
    const x = w.s.x;
    for (const c of w.covers) if (c.x > x + 6) return c.x;
    return isFinite(w.exitX) ? w.exitX + 1 : x + 300;
  }
  // Would a trooper, as seen now, catch him on the way to x1? Only looks at what shows: place, facing, the "!".
  function foeTrouble(w, x0, x1) {
    for (const f of w.foes) {
      if (f.state === 'down') continue;
      const dx = f.x - x0;
      const facingMe = f.dir * dx < 0;
      if (dx > -160 && dx < x1 - x0 + 130) {
        if (facingMe) return true;                  // he's looking my way, and he's near the path
        if (SC.foeTell(f) > 0 && dx > w.reach + 40) return true;   // he's about to turn and I couldn't get to him
      }
      if (f.state === 'hunt' && Math.abs(dx) < 300) return true;
      // These boards carry: he'd hear me unless I'm already on top of him.
      if (SC.boardsAt(w, x0 + 20) && Math.abs(dx) < w.creak && dx > w.reach + 30) return true;
    }
    return false;
  }
  // A flood gate, by eye: stop at its edge until there's breath for the dashes it plainly needs, then go. Part way across, dash again unless it's a short walk out.
  function gate(run, input, me, ahead, boss) {
    const w = run.w, s = w.s, x = 320, y = 150, floodHere = SC.floodAt(w, s.x);
    const f = w.floods.find(fl => ahead >= fl.a && ahead <= fl.b) || w.floods.find(fl => s.x >= fl.a && s.x <= fl.b);
    if (!f || (!floodHere && f.a - s.x >= 22)) return false;
    const release = () => { if (input.down && run.time - me.pressT > T.tapKit + 0.03) input.sim.release(); };
    if (floodHere) {
      if (f.b - s.x <= T.botGateWalk || !SC.canSurge(s)) return false;
    } else {
      const need = (f.b - f.a + 16 > T.surgeDist ? 2 : 1) + (SC.thumbCareful ? 1 : 0);   // careful: never spends the last one
      if (!SC.canSurge(s) || s.breath + 1e-6 < need * T.surgeCost || (!boss && foeTrouble(w, s.x, f.b + 50))) { release(); return true; }
    }
    if (input.down) input.sim.release();
    input.sim.tap(x, y); me.tap2 = 4;
    return true;
  }
  function think(run, input, me) {
    const w = run.w, s = w.s, x = 320, y = 150;
    const lag = 0.25 + Math.random() * 0.2, tSeen = w.t - lag;
    const release = () => { if (input.down && run.time - me.pressT > T.tapKit + 0.03) input.sim.release(); };
    const hold = () => { if (!input.down) { input.sim.press(x, y); me.pressT = run.time; } };
    const tap = () => { if (input.down) input.sim.release(); input.sim.tap(x, y); };

    const tg = SC.target(w);
    if (tg && (tg.kind !== 'cut' || tg.o.x > s.x - 20)) { me.acted = (me.acted || 0) + 1; tap(); return; }

    const inCover = !!SC.coverAt(w, s.x);
    const speed = w.creep * (s.winded ? T.windedSpeed : 1);

    // A trooper's coming at him in the open, close: Surge through him, then he's got his back turned.
    if (!inCover && !s.hidden) {
      const f = w.foes.find(o => o.state !== 'down' && o.dir * (o.x - s.x) < 0 && Math.abs(o.x - s.x) < T.lampLen + 26);
      if (f && f.x > s.x && SC.canSurge(s)) { if (input.down) input.sim.release(); input.sim.tap(x, y); me.tap2 = 4; return; }
    }

    // Boss: go only while his back is turned and the book's open. When it shuts, make for the nearest thing.
    const b = w.boss;
    if (b && b.hp > 0) {
      const to = Math.min(nextPlace(w), b.x - w.reach + T.maroReachLess + 6), secs = (to - s.x) / speed;
      if (gate(run, input, me, s.x + speed * (0.3 + lag), true)) return;
      if (b.state === 'run' || b.state === 'hit') { if (foeTrouble(w, s.x, to)) release(); else hold(); return; }
      const tell = SC.maroTell(b);
      if (b.state === 'face' || (tell > 0 && tell * T.maroTell < secs + 0.25)) {
        if (inCover) { release(); return; }
        const m = SC.maroLamp(b);
        if (m || tell > 0) { const near = secs < 1.6; if (near) hold(); else release(); return; }
      }
      if (foeTrouble(w, s.x, to) || beamHits(w, s.x, to, tSeen, secs, 0.2) > 0.55) { release(); return; }
      hold();
      return;
    }

    // A floodlit stretch ahead
    const ahead = s.x + speed * (0.3 + lag), floodHere = SC.floodAt(w, s.x), floodNext = SC.floodAt(w, ahead);
    const crane = w.cranes.find(c => ahead >= c.a - 30 && ahead <= c.b + 30);
    if (floodHere || floodNext) {
      if (crane) {
        // Keep under a crate, by eye: go if the patch ahead will be shaded when he gets there; if the shade's leaving him, go too.
        const shadeAhead = SC.craneShade(crane, ahead, w.t + 0.3);
        const shadeHere = SC.craneShade(crane, s.x, w.t + 0.3 + lag);
        if (floodNext && !shadeAhead && (shadeHere || !floodHere)) release(); else hold();
        return;
      }
      if (gate(run, input, me, ahead, false)) return;
    }

    const to = nextPlace(w), secs = Math.max(0.05, (to - s.x) / speed);
    let danger = foeTrouble(w, s.x, to);
    const beam = beamHits(w, s.x, to, tSeen, secs, 0.2);
    // A breath only if a gate's coming soon and the chest is low, and nothing's pressing.
    if (inCover && s.breath + 1e-6 < T.surgeCost && !s.moving) danger = true;
    const safe = T.fillMovingSecs * 0.55 / (w.alert || 1);
    if (danger || beam > safe) {
      if (inCover || !s.moving) { release(); return; }
      // Caught out in the open: run for it if close, otherwise freeze.
      if (secs < 0.9) hold(); else release();
      return;
    }
    hold();
  }
  SC.thumbBot = function (run, input) {
    const me = run.w.thumbMem || (run.w.thumbMem = { n: 0, pressT: -9, tap2: -1 });
    if (me.tap2 >= 0) { if (--me.tap2 < 0) input.sim.tap(320, 150); return; }
    if (run.w.s.dash > 0) return;
    if (me.n++ % 6 === 0) think(run, input, me);
  };
  SC.lazyBot = function (run, input) {
    const w = run.w, me = w.lazy || (w.lazy = { t: 0 });
    if (SC.target(w) && w.s.strikeT <= 0) { if (input.down) input.sim.release(); input.sim.tap(320, 150); return; }
    if (!input.down) input.sim.press(320, 150);
  };
  function runMany(index, n, bot) {
    const keep = Kit.def.bot; Kit.def.bot = bot;
    const out = { wins: 0, n, time: 0, alarms: 0, surges: 0, winds: 0, by: {} };
    const realRandom = Math.random; let a = 12345 + index;
    Math.random = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
    try {
      for (let s = 1; s <= n; s++) {
        const r = __kit.runStage(index, { bot: true, seed: s * 104729 + index, renderEvery: 0, maxSeconds: 400 });
        const i = r.info || {};
        if (r.result === 'win') out.wins++; else out.by[i.by || r.result] = (out.by[i.by || r.result] || 0) + 1;
        out.time += r.seconds; out.alarms += i.alarms || 0; out.surges += i.surges || 0; out.winds += i.winds || 0;
      }
    } finally { Kit.def.bot = keep; Math.random = realRandom; }
    out.time = Math.round(out.time / n); out.alarms = +(out.alarms / n).toFixed(1); out.surges = +(out.surges / n).toFixed(1); out.winds = +(out.winds / n).toFixed(1);
    return out;
  }
  SC.thumbRun = (i, n) => runMany(i, n, SC.thumbBot);
  SC.lazyRun = (i, n) => runMany(i, n, SC.lazyBot);
})();
`;

// Lightness (L*) of a colour with the screen dimmed to a share of full brightness.
const lstar = (r, g, b, dimTo) => {
  const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const Y = (0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)) * dimTo;
  return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
};

async function dim(page, say, OUT) {
  const DIM = 0.35;   // like a phone turned well down at night
  const shots = [[0, 11], [1, 16], [2, 6], [3, 14], [4, 10]];
  await page.evaluate(() => { TUNE.lamplickChance = 0; TUNE.tuftleChance = 0; });
  for (const [i, sec] of shots) {
    await page.evaluate(i => { __kit.title(); __kit.bot(true); __kit.timeScale = 6; __kit.jump(i, { fair: true }); }, i);
    await page.waitForFunction(s => { const r = __kit.run(); return !r || r.time >= s || __kit.state().screen !== 'play'; }, sec, { polling: 16 });
    await page.evaluate(() => { __kit.timeScale = 0; });
    await page.waitForTimeout(100);
    // Sample the real canvas. The walkway is sorted into lit and dark by the game's own light sums, then each thing's colour is read where it's drawn.
    const got = await page.evaluate(() => {
      const r = __kit.run(), w = r.w, c = Kit.canvas, ctx = c.getContext('2d'), v = Kit.view, S = v.scale * c.width / c.getBoundingClientRect().width;
      const at = (wx, wy) => { const d = ctx.getImageData(Math.round((wx - w.cam - v.left) * S), Math.round((wy - v.top) * S), 1, 1).data; return [d[0], d[1], d[2]]; };
      const g = TUNE.groundY, dark = [], lit = [];
      for (let x = w.cam + 0; x < w.cam + 640; x += 6) { if (Math.abs(x - w.s.x) < 30) continue; (SC.lightAt(w, x) ? lit : dark).push(at(x, g + 11)); }
      const box = (x0, x1, y0, y1) => { const o = []; for (let x = x0; x <= x1; x += 2) for (let y = y0; y <= y1; y += 2) o.push(at(x, y)); return o; };
      const foe = w.foes.find(f => f.state !== 'down' && f.x > w.cam + 20 && f.x < w.cam + 620);
      return { hidden: w.s.hidden, glow: box(w.s.x - 14, w.s.x + 14, g + 5, g + 9), dark, lit, shirt: box(w.s.x - 12, w.s.x + 12, g - 70, g - 34), around: box(w.s.x - 44, w.s.x - 26, g - 80, g - 30),
        coat: foe ? box(foe.x - 5, foe.x + 5, g - 56, g - 34) : null, coatBg: foe ? box(foe.x - 40, foe.x - 28, g - 90, g - 50).concat(box(foe.x + 28, foe.x + 40, g - 90, g - 50)) : null };
    });
    await page.screenshot({ path: `${OUT}/dim-bright-s${i + 1}.png` });
    await page.evaluate(() => { document.documentElement.style.filter = 'brightness(0.35)'; });
    await page.waitForTimeout(60);
    await page.screenshot({ path: `${OUT}/dim-s${i + 1}.png` });
    await page.evaluate(() => { document.documentElement.style.filter = ''; __kit.timeScale = 1; __kit.bot(false); __kit.title(); });
    const L = p => lstar(p[0], p[1], p[2], DIM), med = l => { const s = l.map(L).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; }, top = l => { const s = l.map(L).sort((x, y) => y - x); return s[Math.floor(s.length * 0.1)]; };
    const road = med(got.dark), lit = med(got.lit), shirt = top(got.shirt), around = med(got.around);
    if (lit !== null) say(lit - road >= 15, `stage ${i + 1}, screen at ${DIM * 100}%: lit walkway L* ${lit.toFixed(0)}, dark walkway ${road.toFixed(0)}: ${(lit - road).toFixed(0)} apart (want 15 or more)`);
    if (got.hidden) { const gl = top(got.glow); say(gl - road >= 12, `stage ${i + 1}: Silas is hidden, so the violet under him is what finds him: L* ${gl.toFixed(0)}, walkway ${road.toFixed(0)}: ${(gl - road).toFixed(0)} apart (want 12 or more)`); }
    else say(shirt - around >= 20, `stage ${i + 1}: Silas's shirt L* ${shirt.toFixed(0)}, what's behind him ${around.toFixed(0)}: ${(shirt - around).toFixed(0)} apart (want 20 or more)`);
    if (got.coat) { const co = med(got.coat), bg = med(got.coatBg); say(null, `stage ${i + 1}: trooper's coat L* ${co.toFixed(0)}, behind him ${bg.toFixed(0)}`); }
  }
  say(null, `pictures: ${OUT}\\dim-s1..5.png (dimmed), dim-bright-s1..5.png`);
}

module.exports = { source, dim };
