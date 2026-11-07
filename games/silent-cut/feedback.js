// Silent Cut: everything the rules' events turn into: sounds, score, salvage, words, sparks. Only the real run comes through here; the bot's look-ahead doesn't. Sound definitions are in sounds.js, salvage and Hush in company.js.
window.SC = window.SC || {};
(function () {
  const T = TUNE, S = TUNE.talk, A = () => Kit.art, W = () => SC.WORDS, au = n => Kit.audio.play(n);
  const G = () => T.groundY;

  // ---- Silas's voice: only his lines change, because only he's out of breath.
  SC.brokenLine = function (text, keep) {
    const words = text.split(' ');
    return words.slice(0, Math.max(1, Math.ceil(words.length * keep))).join(' ').replace(/[.,!?]+$/, '') + '...';
  };
  SC.voice = function (w, text) {
    const s = w.s, low = T.raspyBelow * Math.min(1, s.chest);
    if (s.winded) return '...';
    if (w.rasp >= T.raspMax) return SC.brokenLine(text, T.voiceKeepWorst);
    if (w.rasp >= 2 || s.breath < low * T.raspyWorse) return SC.brokenLine(text, T.voiceKeepWorse);
    if (w.rasp === 1 || s.breath < low) return SC.brokenLine(text, T.voiceKeep);
    return text;
  };
  // whole: a line written around the moment his breath goes or comes back, or already written hoarse. It's said as written.
  SC.say = function (run, who, text, secs, whole) {
    const w = run.w, t = who !== 'silas' || whole ? text : SC.voice(w, text);
    if (run.dry) return;
    w.say = secs || S.say;
    if (who === 'silas' && t === '...') A().floatText(w.s.x - w.cam, G() - 104, '...', '#d9c8ff', 22);
    run.say(who, t, secs || S.say);   // the kit's talkFilter rewrites everyone, so it stays unset: this game filters here, by speaker
  };
  // A quip only when nobody's talking, unless it matters.
  const pick = list => list[Math.floor(Math.random() * list.length)];
  // His flirting stays out of it while a pal is in the world (batch rule).
  const quipsFor = (run, kind) => (SC.palAround(run.w) ? W().quips[kind] : W().quips[kind].concat(W().quipsAdult[kind]));
  function quip(run, kind, whole) {
    if (run.w.say > 0 || Math.random() > T.quips[kind]) return;
    const list = quipsFor(run, kind);
    if (list.length) SC.say(run, 'silas', pick(list), S.quip, whole);
  }

  // Next line of the stage's own radio, by how far along the street he is.
  function radio(run) {
    const w = run.w, list = run.stage.radio;
    if (!list || !isFinite(w.exitX) || w.radioI >= list.length) return;
    const l = list[w.radioI || 0];
    if (!l) return;
    if (w.s.x / w.exitX >= l.at && w.say <= 0) {
      w.radioI = (w.radioI || 0) + 1;
      // A joke skipped for a pal stays skipped, and so does its answer, even if the pal has gone by then.
      if (l.adult && (SC.palAround(w) || w.radioHushed)) w.radioHushed = true;
      else SC.say(run, l.who, l.text, S.radio);
    }
  }

  function tips(run) {
    const w = run.w;
    if (w.tipT > 0) w.tipT -= Kit.STEP;
    const list = run.stage.tips;
    // A new tip takes over once the last has had time to be read.
    if (list && w.tipI < list.length && w.s.x >= list[w.tipI].x && w.tipT <= S.tipNext) { w.tip = W().tips[list[w.tipI].key]; w.tipT = S.tipSecs; w.tipI++; }
  }

  // Turns this step's events into everything a person sees and hears.
  SC.feedback = function (run) {
    const w = run.w, s = w.s, g = G();
    w.cam = s.x - T.camX;
    for (const e of w.ev) {
      switch (e.k) {
        case 'step': au('softstep'); break;
        case 'creak':
          au('creak'); w.ring.push({ x: e.x, r: 0, max: e.r, age: 0 });
          A().floatText(e.x - w.cam - T.floatClear, g - 8, 'creak', '#e7b98a', 12);   // behind him, not across him
          break;
        case 'hide': au('hide'); break;
        case 'turn': au('hide'); break;
        case 'hear': au('hear'); break;
        case 'land': au('land'); A().burst(s.x - w.cam, g, { n: 8, colors: ['#c9b6ff', '#ffffff'], speed: 90, life: 0.3, size: 2.4, gravity: 40 }); break;
        case 'close':
          au('close'); run.addScore(T.scoreClose); w.closes++;
          A().floatText(s.x - w.cam, g - 96, 'CLOSE +' + T.scoreClose, '#c9b6ff', 14);
          quip(run, 'close');
          break;
        case 'cut':
          au('cutdown'); au('glass'); au('chain'); run.addScore(T.scoreCut); w.cuts++;
          w.ring.push({ x: e.x, r: 0, max: e.r, age: 0 });
          A().burst(e.x - w.cam, g - 8, { n: 16, colors: ['#ffe39a', '#ffffff', '#f0752b'], speed: 150, life: 0.45, size: 2.6, gravity: 240, angle: -1.57, spread: 2.4 });
          A().shake(1.5, 0.12);
          if (w.moth && w.moth.l === e.l) { w.moth.state = 'dizzy'; w.moth.x = e.x; w.moth.alt = T.mothStartAlt; w.moth.t = T.lamplickSecs; SC.say(run, W().palAppear.lamplickDizzy.who, W().palAppear.lamplickDizzy.text, S.moth); }
          else quip(run, 'cut');
          break;
        case 'strike':
          au('chain'); au('hit'); run.addScore(T.scoreStrike); run.addSalvage(T.strikeSalvage); w.strikes++;
          w.streak = w.t - (w.lastStrike === undefined ? -99 : w.lastStrike) <= T.streakSecs ? (w.streak || 1) + 1 : 1; w.lastStrike = w.t;
          if (w.streak > 1) run.addScore(T.scoreStreak * (w.streak - 1));
          A().burst(e.x - w.cam, g - 50, { n: 14, colors: ['#f4c152', '#ffffff', '#b02a2a'], speed: 120, life: 0.35, size: 2.6 });
          A().floatText(e.x - w.cam, g - 96, w.streak > 1 ? 'SILENT x' + w.streak : '+' + T.scoreStrike, w.streak > 1 ? '#d9c8ff' : A().PAPER, w.streak > 1 ? 19 : 15);
          quip(run, 'strike');
          break;
        case 'surge':
          au('windcut'); w.surges++;
          A().burst(e.x - w.cam, g - 40, { n: 12, colors: ['#a78bf0', '#ffffff'], speed: 120, life: 0.35, size: 2.4, gravity: 0, angle: 3.14, spread: 1 });
          w.hush.swoop = 0.7;
          if (!s.winded) quip(run, 'surge');
          break;
        case 'tapEmpty':
          au('softtap');
          A().burst(s.x - w.cam, g - 50, { n: 4, colors: ['#c9b6ff'], speed: 50, life: 0.22, size: 2, gravity: 0 });
          if (e.late) A().floatText(s.x - w.cam, g - 100, 'QUICKER', '#d9c8ff', 15);
          break;
        case 'noBreath':
          au('wheeze'); A().floatText(s.x - w.cam, g - 104, '...', '#d9c8ff', 24);
          break;
        case 'winded':
          au('wheeze'); w.winds++;
          run.carry.rasp = e.rasp;   // the bond's cost lasts the story run (kit README, run.carry)
          A().floatText(s.x - w.cam, g - 110, e.torn ? 'VOICE TORN' : 'NO BREATH', e.torn ? '#ff8a6a' : '#d9c8ff', e.torn ? 22 : 18);
          if (e.torn) { au('crack'); A().shake(3, 0.2); }
          else if (e.first && !run.endless && w.rasp < T.raspMax) { w.tip = W().tips.scar; w.tipT = S.tipSecs; }   // says what the next one costs, while it can still be avoided
          SC.say(run, 'silas', W().windedCurse, S.curse, true);
          w.crewAfter = S.crewAfter; w.crewTorn = e.torn ? e.rasp : 0;
          break;
        case 'breathBack':
          au('gasp');
          if (!run.boss) quip(run, 'breathBack', true);
          break;
        case 'alarm':
          au('bell'); au('alarm'); A().shake(5, 0.3); w.flash = 0.7;
          A().floatText(s.x - w.cam, g - 112, 'ALARM ' + e.n + ' OF ' + T.maxAlarms, '#ff7a5a', 22);
          if (Math.random() < T.quips.alarmSilas) SC.say(run, 'silas', pick(quipsFor(run, 'alarm')), S.alarm);
          else { const l = pick(W().alarmCrew); SC.say(run, l.who, l.text, S.alarm); }
          break;
        case 'maroTurn': au('page'); if (w.say <= 0 && Math.random() < T.quips.maroTurn) { const l = pick(W().maro.turn); SC.say(run, l.who, l.text, S.maroTurn); } break;
        case 'maroBack': au('page'); break;
        case 'maroDesk': au('bell'); break;
        case 'maroHit': {
          const last = e.hp <= 0;
          au('chain'); au('hit'); au('boom'); au('page'); A().shake(6, 0.35); w.flash = 0;
          run.addScore(T.scoreMaroHit);
          // On the way to his next desk, where Silas goes next. After the last cut there's no next: it's in his pocket.
          if (!last) for (let i = 0; i < T.maroCoins; i++) w.coins.push({ x: e.x + T.maroCoinAhead + i * T.maroCoinGap, alt: 22 + i * 7 });
          else { run.addSalvage(T.maroCoins * T.coinValue); run.addScore(T.maroCoins * T.scoreCoin); au('pickup'); A().floatText(s.x - w.cam, g - 100, '+' + T.maroCoins * T.coinValue, A().GOLD, 16); }
          A().burst(e.x - w.cam, g - 50, { n: 26, colors: ['#f5efe2', '#c98ac0', '#f4c152'], speed: 170, life: 0.6, size: 3 });
          w.pagesT = T.pagesSecs; w.pagesX = e.x;
          SC.say(run, 'silas', s.winded ? '...' : W().maro[w.rasp >= 2 ? 'silasHitRags' : 'silasHit'][T.maroHits - e.hp - 1], last ? S.maroCutLast : S.maroCut, true);
          // The third line never finishes: his voice goes on it, and the ending's silence starts here.
          if (last) { au('wheeze'); if (!s.winded) A().floatText(s.x - w.cam, g - 104, '...', '#d9c8ff', 24); w.crewAfter = 0; }
          w.maroAfter = last ? W().maro.fall : W().maro.hit[T.maroHits - e.hp - 1];
          w.maroAfterT = last ? S.maroAfterLast : S.maroAfter;
          break;
        }
        default: break;
      }
    }
    w.ev.length = 0;

    // A warning coming up on a trooper or Maro gets one sound, the moment it shows.
    for (const f of w.foes) { const on = SC.foeTell(f) > 0; if (on && !f.told) { f.told = true; au('tell'); } else if (!on) f.told = false; }
    const mt = SC.maroTell(w.boss) > 0;
    if (mt && !w.maroTold) { au('tell'); au('page'); } w.maroTold = mt;

    // The meter ticks while it fills
    if (s.seen > 0.05 && s.lastLit && !s.hidden) { w.tickT = (w.tickT || 0) - Kit.STEP; if (w.tickT <= 0) { w.tickT = T.tickSlow - s.seen * T.tickFast; au('tick'); } }

    // Delayed lines
    if (w.say > 0) w.say -= Kit.STEP;
    if (w.crewAfter > 0 && (w.crewAfter -= Kit.STEP) <= 0) {
      // In the light, "stand still" would lose him the stage: there they tell him to get out of it first.
      const lit = s.winded && s.lastLit && !s.hidden;
      const l = w.crewTorn ? W().tornCrew[w.crewTorn - 1] : run.boss ? W().maro.winded : pick(SC.palSafe(w, lit ? W().windedCrewLit : W().windedCrew));
      SC.say(run, l.who, l.text, S.crew);
    }
    if (w.maroAfterT > 0 && (w.maroAfterT -= Kit.STEP) <= 0 && w.maroAfter) SC.say(run, w.maroAfter.who, w.maroAfter.text, S.maroLine);
    if (w.pagesT > 0) w.pagesT -= Kit.STEP;
    if (w.flash > 0) w.flash -= Kit.STEP;

    // The lamp line closing in gets one warning, once per attempt.
    const lineGap = s.x - w.line;
    if (lineGap < T.lineWarnAt && !w.lineWarned) { w.lineWarned = true; au('horn'); const l = run.boss ? W().lineNearMaro : W().lineNear; SC.say(run, l.who, l.text, S.lineWarn); }
    if (lineGap > T.lineWarnReset) w.lineWarned = false;

    for (const r of w.ring) { r.age += Kit.STEP; r.r = r.max * Math.min(1, r.age / 0.4); }
    w.ring = w.ring.filter(r => r.age < 0.55);

    if (run.boss && !w.maroGreeted && w.t > S.maroGreetAt) { w.maroGreeted = true; const l = W().maro.start; SC.say(run, l.who, l.text, S.maroStart); }
    radio(run);
    tips(run);
    SC.stepHush(run);
    SC.coinsStep(run);
    SC.palStep(run);
  };
})();
