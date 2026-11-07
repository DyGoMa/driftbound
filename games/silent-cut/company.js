// Silent Cut: what goes on around him each step of the real run: salvage picked up, and Hush going ahead to the next safe place. Moved out of feedback.js to keep it short.
window.SC = window.SC || {};
(function () {
  const T = TUNE, A = () => Kit.art, au = n => Kit.audio.play(n);

  SC.coinsStep = function (run) {
    const w = run.w, s = w.s;
    for (const c of w.coins) {
      if (Math.abs(c.x - s.x) < T.grabRadius && !c.got) {
        c.got = true; run.addSalvage(T.coinValue); run.addScore(T.scoreCoin); au('pickup');
        A().floatText(s.x - w.cam + T.floatClear, T.groundY - c.alt - 10, '+' + T.coinValue, A().GOLD, 14);   // beside him, not over him
      }
    }
    if (w.coins.some(c => c.got)) w.coins = w.coins.filter(c => !c.got);
  };

  // Hush goes ahead to the next place that's safe and waits there.
  SC.nextCover = function (w, x) {
    for (const c of w.covers) if (c.x - c.w / 2 > x + 2) return c;
    return null;
  };
  SC.stepHush = function (run) {
    const w = run.w, s = w.s, h = w.hush, c = SC.nextCover(w, s.x);
    if (c) h.tx = c.x; else if (isFinite(w.exitX)) h.tx = w.exitX + 20; else if (w.boss) h.tx = w.boss.x - 90;
    if (h.swoop > 0) { h.swoop -= Kit.STEP; h.x = s.x + 40; return; }
    const d = h.tx - h.x;
    h.fly = Math.abs(d) > 3 ? 1 : 0;
    h.x += Math.sign(d) * Math.min(Math.abs(d), T.hushSpeed * Kit.STEP);
  };
})();
