// Split Light: the two hidden pals. Glimmick comes to whoever waits; Shardle wakes to a long shot. Each is caught by tapping it before it leaves. Logic only.
window.SL = window.SL || {};
(function () {
  const T = TUNE, W = SL.WORDS, AU = () => Kit.audio;

  function spawn(run, id, secs) {
    const w = run.w, P = SL.place(run), L = w.L, top = P.oy, bottom = P.oy + L.rows * T.cell;
    if (id === 'glimmick') w.pal = { id, secs, t: 0, x: -T.glimmickPad, y: bottom + T.glimmickBelow, x0: -T.glimmickPad, x1: Kit.view.w + T.glimmickPad };
    else w.pal = { id, secs, t: 0, x: T.shardleX0, y: top - T.shardleAbove, x0: T.shardleX0, x1: Kit.view.w - T.shardleX1Pad, hop: 0 };
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
      // Hops back and forth along the top of the board, ringing as it lands.
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
    if (w.pal || res.bounces < T.shardleBounces || set < T.shardleFromSet || run.hasPal('shardle') || w.shardleSeen) return;
    if (run.rng() < T.shardleChance || T.botPals === 'shardle') { w.shardleSeen = true; spawn(run, 'shardle', T.shardleSecs); }
  };

  SL.palTapped = function (run) {
    const w = run.w, p = w.pal;
    if (!p) return;
    w.pal = null;
    w.testInfo.caught = p.id;
    run.catchPal(p.id);
  };
})();
