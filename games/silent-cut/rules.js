// Silent Cut: the rules of one step, in order. Pure: no sound, no drawing, no salvage. Things worth showing go on w.ev, and feedback.js turns them into sound, score and words.
// The bot plays copies of the world through this same function, so what it foresees is what happens.
window.SC = window.SC || {};
(function () {
  const T = TUNE;
  const EPS = 1e-6, HANDS_OFF = { hold: false, act: false, surge: false };

  SC.outOfBreath = s => s.breath + EPS < T.surgeCost;
  SC.canSurge = s => !SC.outOfBreath(s) && s.dash <= 0 && s.strikeT <= 0 && s.hurtT <= 0;

  // Can he act on a tap right now? Strike first, then Maro, then a lantern.
  SC.target = function (w) {
    const f = SC.strikeTarget(w);
    if (f) return { kind: 'strike', o: f };
    const b = w.boss;
    if (SC.maroOpen(b) && b.x - w.s.x <= w.reach - T.maroReachLess) return { kind: 'maro', o: b };
    const l = SC.lanternTarget(w);
    if (l) return { kind: 'cut', o: l };
    return null;
  };

  function act(w, tg) {
    const s = w.s;
    s.lastAct = tg.kind;
    if (tg.kind === 'cut') {
      tg.o.lit = false; tg.o.cutT = w.t;
      s.strikeT = T.cutSecs;
      s.strikeX = tg.o.x + 8; s.strikeAlt = SC.LANTERN_ALT; s.dir = tg.o.x >= s.x ? 1 : -1;
      SC.noise(w, tg.o.x, T.cutNoise);
      w.ev.push({ k: 'cut', x: tg.o.x, l: tg.o, r: T.cutNoise });
      return;
    }
    s.strikeT = T.strikeSecs;
    s.dir = tg.o.x >= s.x ? 1 : -1;
    s.strikeX = tg.o.x; s.strikeAlt = 52;
    s.struckAt = w.t;   // game.js: a tap straight after this isn't half of a Surge
    if (tg.kind === 'strike') { tg.o.state = 'down'; tg.o.t = 0; tg.o.fellDir = tg.o.dir; w.ev.push({ k: 'strike', x: tg.o.x }); }
    else SC.cutMaro(w);
  }

  function surge(w) {
    const s = w.s;
    s.breath = Math.max(0, s.breath - T.surgeCost);
    s.dash = T.surgeSecs; s.dir = 1; s.moving = true; s.still = 0;
    w.ev.push({ k: 'surge', x: s.x });
    if (SC.outOfBreath(s)) goWinded(w);
  }
  function goWinded(w) {
    const s = w.s;
    s.winded = true;
    s.breath = 0;   // whatever was left under one Surge goes too, so a smaller chest never means a shorter silence
    w.windsHere = (w.windsHere || 0) + 1;
    const torn = w.windsHere >= T.raspFrom && w.rasp < T.raspMax;
    if (torn) { w.rasp++; s.chest -= T.raspLoss; }
    w.ev.push({ k: 'winded', rasp: w.rasp, torn, first: w.windsHere === 1 });
  }

  function raiseAlarm(w, how) {
    const s = w.s;
    w.alarms++;
    s.seen = 0; s.grace = T.graceSecs;
    w.line += T.lineJump;
    SC.huntAt(w, s.x);
    if (SC.maroOpen(w.boss)) { w.boss.state = 'face'; w.boss.t = 0; w.boss.dir = -1; w.boss.turns++; w.ev.push({ k: 'maroTurn' }); }   // the bell turns Maro round at once
    w.ev.push({ k: 'alarm', how, n: w.alarms, x: s.x });
    if (w.alarms >= T.maxAlarms) { w.lost = true; w.lostBy = how; }
  }
  SC.raiseAlarm = raiseAlarm;

  // c: { hold, act, surge, late }. One step of the world.
  SC.step = function (w, dt, c) {
    const s = w.s;
    w.t += dt;
    if (w.boss && w.boss.hp <= 0) c = HANDS_OFF;   // the third cut has landed: he stands and watches Maro fall, whatever the thumb does
    if (s.grace > 0) s.grace -= dt;
    if (s.strikeT > 0) s.strikeT -= dt;
    if (s.hurtT > 0) s.hurtT -= dt;

    // The thumb. A tap with someone in reach cuts him. A second quick tap Surges, even while the first tap's chain is out at a lantern, unless there's something else in reach to cut: tap, tap between two lanterns cuts both.
    if (c.surge && s.strikeT > 0 && s.lastAct === 'cut') s.strikeT = 0;
    let acted = false;
    if (c.act && s.strikeT <= 0 && s.hurtT <= 0 && s.dash <= 0) {
      const tg = SC.target(w);
      if (tg) { act(w, tg); acted = true; }
    }
    if (c.surge && !acted && s.strikeT <= 0) {
      if (SC.canSurge(s)) surge(w);
      else if (s.dash <= 0 && SC.outOfBreath(s)) w.ev.push({ k: 'noBreath', x: s.x });   // only when breath is why: a stumble just eats the tap
    }
    // A tap that does nothing still answers, so a double tap that came too slowly isn't silence.
    if (c.act && !c.surge && !c.creeping && !acted && s.strikeT <= 0 && s.hurtT <= 0 && s.dash <= 0) w.ev.push({ k: 'tapEmpty', late: !!c.late });

    // The body
    if (s.dash > 0) {
      const part = Math.min(dt, s.dash);   // exactly surgeDist, however the steps fall
      s.x += (T.surgeDist / T.surgeSecs) * part;
      s.dash -= part;
      if (s.dash <= 1e-9) { s.dash = 0; s.grace = Math.max(s.grace, T.surgeAfter); s.moving = false; s.still = 0; w.ev.push({ k: 'land', x: s.x }); }
    } else if (c.hold && s.strikeT <= 0 && s.hurtT <= 0) {
      s.moving = true; s.still = 0; s.dir = 1;
      s.x += w.creep * (s.winded ? T.windedSpeed : 1) * dt;
      if ((s.stepT -= dt) <= 0) {
        s.stepT = T.stepSecs;
        if (SC.boardsAt(w, s.x)) { SC.noise(w, s.x, w.creak); w.ev.push({ k: 'creak', x: s.x, r: w.creak }); }
        else w.ev.push({ k: 'step' });
      }
    } else {
      s.moving = false; s.still += dt;
    }
    s.x = Math.max(w.minX, Math.min(s.x, w.exitX));

    // Breath, only when frozen
    if (!s.moving && s.still >= T.regenDelay && s.breath < s.chest) {
      s.breath = Math.min(s.chest, s.breath + w.regen * (1 - T.raspRegenLoss * w.rasp) * dt);
      if (s.winded && !SC.outOfBreath(s)) { s.winded = false; w.ev.push({ k: 'breathBack' }); }
    }

    SC.stepFoes(w, dt);
    SC.stepBoss(w, dt);

    // The lamp line never falls too far behind
    w.line = Math.max(w.line + w.lineV * dt, s.x - w.lineLead);

    // Hidden?
    const wasHidden = s.hidden;
    s.hidden = !s.moving && s.dash <= 0 && s.still >= T.hideDelay && !!SC.coverAt(w, s.x);
    if (s.hidden && !wasHidden) w.ev.push({ k: 'hide', x: s.x });

    // The third cut has landed and Maro's falling: nothing can take the win away now.
    const fell = !!w.boss && w.boss.hp <= 0;

    // Contact
    if (!fell && s.dash <= 0 && s.grace <= 0 && !s.hidden) {
      for (const f of w.foes) {
        if (f.state !== 'down' && Math.abs(f.x - s.x) < T.contact) {
          raiseAlarm(w, 'bump');
          s.x = Math.max(w.minX, s.x - T.knockback); s.hurtT = T.hurtSecs; s.moving = false; s.still = 0;
          break;
        }
      }
      const b = w.boss;
      if (b && b.hp > 0 && b.state === 'face' && s.x >= b.x - T.maroBlock - 2) {
        raiseAlarm(w, 'bump');
        s.x = Math.max(w.minX, s.x - T.knockback); s.hurtT = T.hurtSecs; s.moving = false; s.still = 0;
      }
    }

    // The meter
    const lit = SC.lightAt(w, s.x);
    s.lastLit = lit;
    const countsLit = !fell && s.dash <= 0 && s.grace <= 0 && (lit === 3 || (lit && !s.hidden));
    if (countsLit) {
      let secs = lit === 3 ? T.lineFillSecs : (s.moving ? T.fillMovingSecs / w.fillSlow : T.fillFrozenSecs);
      if (lit === 2) secs = SC.inMaroLamp(w, s.x) ? T.maroLampSecs : secs / T.lampFactor;   // Maro's lamp is searching for him: freezing buys nothing in it, only cover does
      s.seen += dt * (lit === 3 ? 1 : w.alert) / secs;
      if (s.seen >= 1) raiseAlarm(w, lit === 3 ? 'line' : lit === 2 ? 'lamp' : 'light');
    } else {
      s.seen = Math.max(0, s.seen - dt / T.drainSecs);
    }

    // A close call: a searchlight passes within a hair of him while he keeps moving
    if (!w.sim && s.moving && !lit && w.t > s.closeT) {
      for (const sw of w.sweeps) {
        const d = Math.abs(s.x - SC.sweepAt(sw, w.t).x) - sw.r - T.halfW;
        if (d > 0 && d < T.closeGap) { s.closeT = w.t + T.closeEvery; w.ev.push({ k: 'close', x: s.x }); break; }
      }
    }

    if (s.x >= w.exitX) w.won = true;
  };
})();
