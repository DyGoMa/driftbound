// Tide Gap: talk during play. One box at a time, and three kinds of talk, so what's urgent is never late and what matters is never lost.
// A call is about right now: it plays at once, over whatever is showing (TG.sayNow).
// A remark is worth hearing only soon: it waits its turn, ahead of any scene, and goes stale if it can't play in time (TG.sayOne).
// A scene is what the crew say when a memory drowns. That's the payoff of the bond cost, so it's never dropped: it plays between calls, and what a stage's end cuts off opens the next stage (TG.queueLines).
window.TG = window.TG || {};
(function () {
  const T = TUNE;

  const secsFor = line => Math.max(T.talkMin, Math.min(T.talkMax, T.talkBase + String(line.text).length * T.talkPerChar));

  function show(run, w, n) {
    run.say(n.line.who, TG.voice(n.line.text, run.carry.lost), n.secs);
    w.sayGap = n.secs + T.talkGap;
    w.showing = n.scene ? { n, ends: run.time + n.secs } : null;
  }

  TG.sayNow = function (run, line, secs) {
    const w = run.w;
    if (!line) return;
    // A scene line cut off before most of it has been read goes back to the front.
    if (w.showing && w.showing.ends - run.time > w.showing.n.secs * T.talkCutShare) w.scene.unshift(w.showing.n);
    show(run, w, { line, secs: secs || secsFor(line) });
  };

  TG.sayOne = function (run, line, secs, stale) {
    if (line) run.w.say.push({ line, secs: secs || secsFor(line), until: run.time + (stale || T.talkStale) });
  };

  TG.queueLines = function (run, lines, delay) {
    (lines || []).forEach((line, i) => run.w.scene.push({ line, secs: secsFor(line), scene: true, wait: i === 0 ? delay || 0 : 0 }));
  };

  TG.talkBusy = w => w.say.length > 0 || w.scene.length > 0 || w.sayGap > 0;

  TG.stepTalk = function (run, w, dt) {
    const n = w.scene[0];
    w.sayGap -= dt;
    if (n && n.wait > 0) n.wait -= dt;
    if (w.say.length) w.say = w.say.filter(k => run.time <= k.until && !(k.line.adult && TG.palAround(w)));   // a joke never plays with a pal out; the pal's own call has already replaced one showing (hazards.js)
    if (w.sayGap > 0) return;
    if (w.say.length) show(run, w, w.say.shift());
    else if (n && n.wait <= 0) { w.scene.shift(); show(run, w, n); }
  };

  // A new attempt: Bram on the state of the hull, then whatever scene the last stage's end cut off. The scene plays once only: a retry doesn't hear it again.
  TG.talkStart = function (run, w) {
    const lines = [];
    if (!run.endless && w.hullLeft < w.hullMax) lines.push(TG.WORDS.yardLine);
    else if (run.boss && run.carry.hullLost) lines.push(TG.WORDS.yardBoss);
    TG.queueLines(run, lines.concat(run.carry.talkLeft || []), run.boss ? T.talkStartBoss : T.hintSecs);
    delete run.carry.talkLeft;
    if (run.carryAtStart) delete run.carryAtStart.talkLeft;
  };

  // A stage won: the rest of any scene goes with her.
  TG.talkKeep = function (run, w) {
    const rest = w.scene.map(n => n.line);
    if (w.showing && w.showing.ends - run.time > w.showing.n.secs * T.talkCutShare) rest.unshift(w.showing.n.line);
    if (rest.length) run.carry.talkLeft = rest;
  };
})();
