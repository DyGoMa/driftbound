// Silent Cut: Ledger Maro. A state machine, logic only. He stands at a desk, back turned, reading the book. The book shuts (warning), he turns and sweeps his lamp out and back, then turns away again.
// Cut him while his back is turned and he reels, then runs to the next desk. Three cuts. His guards and the room's lights are ordinary world things (world.js).
window.SC = window.SC || {};
(function () {
  const T = TUNE;

  SC.newBoss = desks => ({ desks, hp: T.maroHits, phase: 0, x: desks[0], state: 'back', t: 0, dir: 1, turns: 0 });
  const backLen = b => T.maroBack[Math.min(b.phase, 2)] * T.maroVary[b.turns % T.maroVary.length];
  SC.maroBackLen = backLen;

  // Seconds left before he turns round, while the warning is showing; 0 otherwise.
  SC.maroTell = function (b) {
    if (!b || b.state !== 'back') return 0;
    const left = backLen(b) - b.t;
    return left <= T.maroTell ? left / T.maroTell : 0;
  };
  SC.maroOpen = b => !!b && b.state === 'back' && b.hp > 0;   // his back is to Silas

  SC.stepBoss = function (w, dt) {
    const b = w.boss;
    if (!b) return;
    b.t += dt;
    const i = Math.min(b.phase, 2);
    switch (b.state) {
      case 'back':
        if (b.t >= backLen(b)) { b.state = 'face'; b.t = 0; b.dir = -1; b.turns++; w.ev.push({ k: 'maroTurn' }); }
        break;
      case 'face':
        if (b.t >= T.maroFace[i]) { b.state = 'back'; b.t = 0; b.dir = 1; w.ev.push({ k: 'maroBack' }); }
        break;
      case 'hit':
        if (b.t >= T.maroHitSecs) { b.state = 'run'; b.t = 0; b.dir = 1; }
        break;
      case 'run': {
        const to = b.desks[b.phase];
        b.x += T.maroRun * dt;
        if (b.x >= to) { b.x = to; b.state = 'back'; b.t = 0; w.ev.push({ k: 'maroDesk' }); }
        break;
      }
      case 'fall':
        if (b.t >= T.maroFallSecs) w.won = true;
        break;
      default: break;
    }
    // Silas can never walk or dash through him. Bumping into him while he's looking is an alarm (rules.js).
    const s = w.s;
    if (b.hp > 0 && s.x > b.x - T.maroBlock) s.x = b.x - T.maroBlock;
  };

  // The cut. Returns nothing; the world's own alarm rules carry on.
  SC.cutMaro = function (w) {
    const b = w.boss;
    b.hp--; b.phase++; b.t = 0; b.dir = -1;
    w.ev.push({ k: 'maroHit', hp: b.hp, x: b.x });
    b.state = b.hp > 0 ? 'hit' : 'fall';
  };
})();
