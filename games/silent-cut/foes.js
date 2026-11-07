// Silent Cut: troopers. A small state machine with no sound or drawing; things worth showing go on w.ev.
window.SC = window.SC || {};
(function () {
  const T = TUNE;

  SC.newFoe = (f, x0, fast) => ({ a: f.a + x0, b: f.b + x0, x: (f.at === undefined ? f.a : f.at) + x0, dir: f.dir || 1, v: f.v * fast, state: 'walk', t: 0, goal: 0 });

  // "walk" to the end of his beat, "wait" there (the last tellSecs show the warning), turn. A sound: "hear", then "go" to it, then "look".
  // After an alarm: "hunt" to where he last saw Silas, then "look". Looking ends with the same warning, then back to his beat.
  function resumeTurn(f) { f.state = 'wait'; f.t = T.waitSecs - T.tellSecs; }

  function stepFoe(w, f, dt) {
    f.t += dt;
    switch (f.state) {
      case 'walk':
        f.x += f.dir * f.v * dt;
        if ((f.dir > 0 && f.x >= f.b) || (f.dir < 0 && f.x <= f.a)) { f.state = 'wait'; f.t = 0; }
        break;
      case 'wait':
        if (f.t >= T.waitSecs) { f.dir = -f.dir; f.state = 'walk'; f.t = 0; w.ev.push({ k: 'turn', x: f.x }); }
        break;
      case 'hear':
        if (f.t >= T.hearSecs) { f.dir = f.goal >= f.x ? 1 : -1; f.state = 'go'; f.t = 0; }
        break;
      case 'go':
      case 'hunt': {
        const v = f.state === 'hunt' ? T.huntSpeed : T.goSpeed;
        f.x += f.dir * v * dt;
        if ((f.dir > 0 && f.x >= f.goal) || (f.dir < 0 && f.x <= f.goal)) { f.state = 'look'; f.t = 0; }
        break;
      }
      case 'look':
        if (f.t >= T.lookSecs) resumeTurn(f);
        break;
      default: break;
    }
  }
  SC.stepFoes = function (w, dt) { for (const f of w.foes) if (f.state !== 'down') stepFoe(w, f, dt); };

  // A trooper's warning is showing: he'll turn round when it closes. The bot's ring and the drawn ring both read this.
  SC.foeTell = f => (f.state === 'wait' && f.t >= T.waitSecs - T.tellSecs ? (T.waitSecs - f.t) / T.tellSecs : 0);

  // A sound at x carries r px. Anyone hunting stays hunting.
  SC.noise = function (w, x, r) {
    for (const f of w.foes) {
      if (f.state === 'down' || f.state === 'hunt' || Math.abs(f.x - x) > r) continue;
      if (f.state === 'go' || f.state === 'hear') { f.goal = x; continue; }
      f.state = 'hear'; f.t = 0; f.goal = x;
      w.ev.push({ k: 'hear', x: f.x });
    }
  };

  // Everyone close runs to where Silas was seen.
  SC.huntAt = function (w, x) {
    for (const f of w.foes) {
      if (f.state === 'down' || Math.abs(f.x - x) > T.huntRange) continue;
      f.state = 'hunt'; f.t = 0; f.goal = x; f.dir = x >= f.x ? 1 : -1;
    }
  };

  // Who he can cut right now: a standing trooper within reach, with his back to Silas. Nearest first.
  SC.strikeTarget = function (w) {
    const s = w.s;
    let best = null, bd = 1e9;
    for (const f of w.foes) {
      if (f.state === 'down') continue;
      const dx = f.x - s.x, d = Math.abs(dx);
      if (d <= w.reach && f.dir * dx > 0 && d < bd) { best = f; bd = d; }
    }
    return best;
  };
  // Which lantern he can cut right now: a lit one within reach, nearest first.
  SC.lanternTarget = function (w) {
    const s = w.s;
    let best = null, bd = 1e9;
    for (const l of w.lanterns) {
      if (!l.lit) continue;
      const d = Math.abs(l.x - s.x);
      if (d <= w.reach && d < bd) { best = l; bd = d; }
    }
    return best;
  };
})();
