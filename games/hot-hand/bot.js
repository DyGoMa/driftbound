// Hot Hand test bot. It presses only through input.sim, at a real spot on the screen, so a bot win proves the real tap targets work.
// The plain bot has perfect timing. With TUNE.botHuman = { react, taps, jitter, sloppy } it plays like a thumb: it can't act on anything until it has been on show for `react` seconds,
// it taps no faster than `taps` a second, it misses its spot by up to `jitter` px, `sloppy` is the chance it doesn't pick the best target, `slip` is the chance, each time the bar goes red, that it throws anyway,
// and `lag` is how many seconds its thumb takes to arrive: the tap lands where it saw the thing, that long ago. tools/fairness.js uses that.
window.HH = window.HH || {};
(function () {
  const T = TUNE;

  // Has this thing been showing, in this state, for long enough for a person to have seen it?
  function seen(me, run, thing, key) {
    const H = T.botHuman;
    if (!H) return true;
    let r = me.seen.get(thing);
    if (!r || r.key !== key) { r = { key, at: run.time }; me.seen.set(thing, r); }
    return run.time - r.at >= H.react;
  }

  function foeKey(f) { return f.type === 'hollow' ? (HH.hollowOpen(f) ? 'open' : 'shut') : f.type === 'sniper' ? (f.state === 'hide' ? 'hide' : 'show') : 'on'; }

  // Worth a flame right now, and how urgent. Bigger is sooner. 0 = leave it.
  function want(run, f) {
    const w = run.w, tier = HH.tier(w.heat);
    if (f.dead || f.pending >= f.hp || f.x > T.botEdge || f.x < 20) return 0;
    if (f.type === 'sniper') return f.state === 'hide' ? 0 : 70;
    if (f.type === 'hollow') return HH.hollowOpen(f) ? 75 : 0;
    if (f.type === 'cart') {
      const mates = w.foes.filter(o => o !== f && o.type !== 'sniper' && Math.hypot(o.x - f.x, o.y - f.y) < T.cartR).length;
      return f.state === 'fuse' ? 95 : f.d < 190 ? 85 : mates >= 2 ? 80 : 0;
    }
    if (f.state === 'tell' || f.state === 'rest') return 90 - f.d * 0.05 + (f.state === 'tell' ? 5 : 0);
    if (f.type === 'hook') return f.state === 'walk' ? 40 : 72;
    if (T.foes[f.type].armour && tier < T.foes[f.type].armour) return 12;   // bounces, but warms her up
    return 50 - f.d * 0.05 + (f.type === 'runner' ? 20 : 0) + (f.mark > 0 ? 25 : 0);
  }

  function aimOf(t) { return t.kind === 'proj' ? { x: t.x, y: t.y } : { x: t.x, y: HH.midY(t) }; }

  function bossTargets(run, me) {
    const w = run.w, b = w.boss, out = [];
    if (!b || w.phase !== 'wave') return out;
    const heatOk = HH.tier(w.heat);
    if (b.krell.exposed) { if (seen(me, run, b.krell, 'open')) out.push({ t: b.krell, u: 88 }); return out; }
    for (const s of b.shields) {
      if (s.down || s.vent !== 'open') continue;
      if (!seen(me, run, s, 'open')) continue;
      // Hot throws fill a vent fastest, so it waits to get hot if the vent's going to stay open long enough. Warm is worth it if it's about to shut.
      const left = s.vt;
      if (heatOk >= 2 || left < 0.9 || s.mark > 0 || b.state === 'ramTell' || (!T.botHuman && b.x < T.ramX + T.botRushX)) out.push({ t: s, u: 78 + s.gauge });
    }
    return out;
  }

  function palTap(run, input, me) {
    const w = run.w, p = w.pal;
    if (!p || !T.botPals || T.botPals !== p.id) return false;
    if (p.x < 30 || p.x > 610) return false;
    if (p.id === 'cinderbun' ? w.heat >= T.cinderCatch : p.pip === 6 && p.pipT < 0.2) { input.sim.tap(p.x, p.y - 22); me.next = run.time + 0.25; return true; }
    return false;
  }

  HH.bot = function (run, input) {
    const w = run.w, H = T.botHuman, me = w.botMem || (w.botMem = { next: 0, seen: new Map(), thumb: [] });
    if (me.thumb.length && run.time >= me.thumb[0].at) { const q = me.thumb.shift(); input.sim.tap(q.x, q.y); return; }
    if (run.over || w.hp <= 0 || w.phase === 'done' || run.time < me.next) return;
    if (palTap(run, input, me)) return;
    if (w.lockT > 0) return;
    const safe = T.botIgnoreHeat || w.heat <= (typeof T.botCap === 'number' ? T.botCap : HH.safeTop());
    const list = [];
    for (const p of w.projs) if (!p.doomed && p.x < T.botEdge && seen(me, run, p, 'air')) list.push({ t: p, u: p.type === 'quench' ? (w.heat > 40 ? 88 : 0) : 100 });
    for (const f of w.foes) { const u = want(run, f); if (u > 0 && seen(me, run, f, foeKey(f))) list.push({ t: f, u }); }
    bossTargets(run, me).forEach(o => list.push(o));
    let pick = null;
    // A person misreads the bar now and then: one roll each time the bar goes red.
    if (safe) me.slipped = null; else if (me.slipped === null || me.slipped === undefined) me.slipped = !!(H && H.slip && run.rng() < H.slip);
    const slip = !safe && me.slipped;
    const usable = list.filter(o => o.u > 0 && (safe || slip || o.t.mark > 0));
    if (!usable.length) return;
    if (H && H.sloppy && run.rng() < H.sloppy) pick = usable[run.int(0, usable.length - 1)];
    else pick = usable.reduce((a, b) => (b.u > a.u ? b : a));
    const at = aimOf(pick.t), j = H ? H.jitter || 0 : 0;
    const tx = at.x + (j ? run.range(-j, j) : 0), ty = at.y + (j ? run.range(-j, j) : 0);
    if (H && H.lag) me.thumb.push({ at: run.time + H.lag, x: tx, y: ty });
    else input.sim.tap(tx, ty);
    me.next = run.time + (H ? 1 / H.taps : T.botRate);
  };

  // The card between waves. Plain bot: rides when it's healthy, cashes in when it isn't, takes half in the middle, so every branch gets played.
  HH.botAsk = function (spec, run) {
    const mode = T.botBet;
    if (mode === 'cash') return 0;
    if (mode === 'half') return 1;
    if (mode === 'all') return 2;
    const w = run.w, spare = w.hp / w.hpMax;
    return spare > 0.8 ? 2 : spare > 0.5 ? 1 : 0;
  };
})();
