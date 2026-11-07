// Split Light: the two hidden pals. Glimmick comes to whoever waits; Shardle wakes to a long shot. Each is caught by tapping it before it leaves. Logic only.
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, AU = () => Kit.audio;

  function spawn(run, id, secs) {
    const w = run.w, P = SL.place(run), L = w.L, bottom = P.oy + L.rows * T.cell;
    if (id === 'glimmick') w.pal = { id, secs, t: 0, x: -T.glimmickPad, y: bottom + T.glimmickBelow, x0: -T.glimmickPad, x1: Kit.view.w + T.glimmickPad };
    else w.pal = { id, secs, t: 0, x: T.shardleX0, y: bottom + T.shardleBelow, x0: T.shardleX0, x1: Kit.view.w - T.shardleX1Pad, hop: 0 };
    SL.say(run, W.palAppear[id], T.sayLong);
    AU().play(id === 'glimmick' ? 'whoosh' : 'chime');
  }

  SL.stepPals = function (run, dt) {
    const w = run.w, set = run.stage.level ? run.stage.level.set : 4;
    if (!w.pal && !w.glimmickTried && set >= T.glimmickFromSet && w.sinceShot > T.glimmickWait && !run.hasPal('glimmick') && !w.beam && !run.over) {
      w.glimmickTried = true;
      if (run.rng() < T.glimmickChance || T.botPals === 'glimmick') spawn(run, 'glimmick', T.glimmickSecs);
    }
    const p = w.pal;
    if (!p) return;
    p.t += dt;
    const u = p.t / p.secs;
    if (p.id === 'glimmick') p.x = p.x0 + (p.x1 - p.x0) * u;
    else {
      // Hops back and forth along the bottom of the board, ringing as it lands.
      const lo = T.shardleStops[0], hi = T.shardleStops[1], h = u * T.shardleHops, n = Math.floor(h), f = h - n, a = n % 2 ? 1 - (n % 4 === 1 ? lo : hi) : (n % 4 === 0 ? lo : hi);
      const next = (n + 1) % 2 ? 1 - ((n + 1) % 4 === 1 ? lo : hi) : ((n + 1) % 4 === 0 ? lo : hi);
      p.x = p.x0 + (p.x1 - p.x0) * (a + (next - a) * f);
      p.hop = Math.sin(f * Math.PI) * T.shardleHopH;
      if (n !== p.n) { p.n = n; AU().play('chime'); }
    }
    if (u >= 1) w.pal = null;
  };

  SL.palAfterShot = function (run, res) {
    const w = run.w, set = run.stage.level ? run.stage.level.set : 4;
    if (run.over || w.pal || res.bounces < T.shardleBounces || set < T.shardleFromSet || run.hasPal('shardle') || w.shardleSeen) return;   // run.over: that was the last shot, so "Tap it!" would be a promise the stage can't keep
    if (run.rng() < T.shardleChance || T.botPals === 'shardle') { w.shardleSeen = true; spawn(run, 'shardle', T.shardleSecs); }
  };

  // When the stage ends, a pal still out goes with a puff, so it's never behind the result screen. FRIDAY_BATCH.md: pals are never in flirting or innuendo, and the crew's last word there can be both. It couldn't be caught from here anyway: nothing is stepped once a stage is over.
  SL.palLeavesAtEnd = function (run) {
    ['win', 'lose'].forEach(k => {
      const end = run[k];
      run[k] = delay => {
        const p = run.w.pal;
        if (p) { Kit.art.burst(p.x, p.y - T.palTapUp, { n: 10, colors: ['#ffffff', '#bfe9ff'], speed: 90, life: 0.35, gravity: 0, size: 3 }); run.w.pal = null; }
        end(delay);
      };
    });
  };

  SL.palTapped = function (run) {
    const w = run.w, p = w.pal;
    if (!p) return;
    w.pal = null;
    w.testInfo.caught = p.id;
    run.catchPal(p.id);
  };
})();
