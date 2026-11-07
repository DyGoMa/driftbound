// Hot Hand: waves, the table and the bet. Rules only.
// The money at stake is never your saved balance: it's the table, what this wave has earned, not paid out until you cash in. So nothing can go below zero,
// a new player with no salvage bets the same as anyone, and once salvage is paid (run.addSalvage) it's never taken back.
window.HH = window.HH || {};
(function () {
  const T = TUNE, W = HH.WORDS;

  // A shuffled list of who arrives. A squad or a cart counts as one arrival.
  function deckOf(run, mix) {
    const deck = [];
    Object.keys(mix).forEach(k => { for (let i = 0; i < mix[k]; i++) deck.push(k); });
    for (let i = deck.length - 1; i > 0; i--) { const j = run.int(0, i), t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    return deck;
  }
  function endlessMix(n, wave) {
    const pool = ['grunt', 'grunt', 'runner'];
    if (wave >= 1) pool.push('plate', 'squad');
    if (wave >= 2) pool.push('hook');
    if (wave >= 3) pool.push('cart', 'hollow');
    const mix = {};
    for (let i = 0; i < n; i++) { const k = pool[(i * 7 + wave * 3) % pool.length]; mix[k] = (mix[k] || 0) + 1; }
    return mix;
  }
  // One wave's list, whichever mode we're in.
  HH.waveSpec = function (run, i) {
    if (run.stage.isEndless) {
      const shrink = T.endlessShrink * i, g = T.endlessGap.map(v => Math.max(T.endlessGapMin, v - shrink));
      return { mix: endlessMix(Math.round(T.endlessBase + T.endlessGrow * i), i), gap: g };
    }
    return run.stage.waves[i];
  };
  HH.waveCount = run => (run.boss ? T.bossRounds : run.stage.isEndless ? Infinity : run.stage.waves.length);

  HH.startWave = function (run, i) {
    const w = run.w;
    w.wave = i; w.phase = 'wave'; w.hitWave = false; w.waveT = 0; w.bannerT = T.bannerSecs;
    w.table = 0; w.extra = 0;
    if (run.stage.isEndless) w.coolMul = HH.baseCool(run) * T.endlessMods[i % T.endlessMods.length];
    if (run.boss) { HH.bossRound(run, i); }
    else {
      const spec = HH.waveSpec(run, i);
      w.deck = deckOf(run, spec.mix); w.gap = spec.gap;
      w.spawnIn = i === 0 ? T.firstWave : T.nextWave;
    }
    HH.tryDicemite(run);
  };

  function spawnNext(run) {
    const w = run.w, k = w.deck.pop();
    if (k === 'squad') HH.addSquad(run);
    else if (k === 'cart') HH.addCart(run);
    else HH.addFoe(run, k);
    w.spawnIn = run.range(w.gap[0], w.gap[1]);
  }

  const aliveCount = w => w.foes.filter(f => !(f.type === 'cart' && !f.pusher && f.state !== 'fuse')).length;

  HH.stepWave = function (run, dt) {
    const w = run.w;
    if (w.bannerT > 0) w.bannerT -= dt;
    if (w.bustT > 0) w.bustT -= dt;
    if (w.winT > 0) w.winT -= dt;
    if (w.phase === 'wave') {
      w.waveT += dt;
      (run.stage.radio || []).forEach((r, i) => { if (r.wave === w.wave && !w.seen['r' + i] && w.waveT >= r.at) { w.seen['r' + i] = 1; HH.say(run, r); } });
      if (run.boss) { HH.stepBoss(run, dt); return; }
      if (w.deck.length) {
        w.spawnIn -= dt;
        if (w.spawnIn <= 0 && w.foes.length < T.aliveMax) spawnNext(run);
      } else if (aliveCount(w) === 0 && w.projs.length === 0 && w.shots.length === 0) HH.waveCleared(run);
    } else if (w.phase === 'cleared') {
      w.gapT -= dt;
      if (w.gapT <= 0) settle(run);
    } else if (w.phase === 'gap') {
      w.gapT -= dt;
      if (w.gapT <= 0) HH.startWave(run, w.wave + 1);
    }
  };

  // What the table holds right now, for the read-out.
  HH.tableNow = run => { const w = run.w; return w.phase === 'wave' ? (run.boss ? T.bossPurse : run.stage.isEndless ? T.endlessPurse : T.purse) + w.extra : w.table; };
  HH.baseCool = run => (1 + T.coolPerLevel * run.up('cool')) * (run.stage.cool || 1);
  HH.betX = run => T.betX + T.betXPerLevel * run.up('deck');
  HH.betLimit = run => (run.stage.betLimit || T.betLimit) + T.betLimitPerLevel * run.up('deck');   // the most the house takes on one bet. A stage may set its own. The card says so, and what's over it is paid out safe, so a bet always pays what it promises

  // What this wave has earned goes on the table as it's earned, with a small limit so it can't run away.
  HH.tableUp = function (run, n, at) {
    const w = run.w, room = T.purseMaxExtra - w.extra, got = Math.max(0, Math.min(room, n));
    if (!got) return;
    w.extra += got;
    HH.fx(run, A => A.floatText(at ? at.x : 320, at ? HH.box(at).y0 - T.floatTable : 60, '+' + got + ' TABLE', A.GOLD, 15));
  };

  HH.waveCleared = function (run) {
    const w = run.w;
    w.phase = 'cleared'; w.gapT = T.clearBeat;
    w.foes.forEach(f => { if (f.type === 'cart') { f.dead = true; HH.fx(run, A => A.burst(f.x, f.y - 20, { n: 8, colors: ['#5d6269', '#8a6a42'], speed: 80, life: 0.4 })); } });   // a cart nobody lit or pushed: the crew roll it away
    run.addScore(T.scoreWave * (w.wave + 1) + (w.hitWave ? 0 : T.scoreClean));
    const base = run.boss ? T.bossPurse : run.stage.isEndless ? T.endlessPurse : T.purse;
    let table = base + w.extra;
    w.wonLast = 0; w.lostLast = w.bustAmount || 0; w.bustAmount = 0;
    if (w.stake > 0) { // the wave ended clean: the bet pays
      const pays = Math.round(w.stake * HH.betX(run));
      table += pays; w.wonLast = pays; w.betsWon++;
      w.stake = 0; w.winT = T.bustSecs;
      HH.sfx(run, 'payout');
      HH.fx(run, A => { A.burst(320, 44, { n: 26, colors: [A.GOLD, '#fff2b0', '#e0483a'], speed: 190, life: 0.8, size: 4 }); });
      HH.sayOne(run, W.betWin, 'winI');
    }
    w.table = table;
    if (w.boss) HH.bossBeat(run);
    HH.sfx(run, 'cash');
  };

  // A hit with a bet riding. It shows at once, and stays on screen, and the next card says so again.
  HH.bust = function (run) {
    const w = run.w;
    if (!(w.stake > 0)) return;
    w.bustAmount = w.stake; w.lastBust = w.stake; w.stake = 0; w.bustT = T.bustSecs; w.betsLost++;
    HH.sfx(run, 'bust');
    HH.fx(run, A => { A.shake(7, 0.4); A.burst(320, 44, { n: 30, colors: ['#e0483a', '#f5efe2', '#2a2448', '#f4c152'], speed: 240, life: 0.9, size: 5, gravity: 420 }); });
    if (w.hp > 0) { if (run.boss) HH.say(run, W.bustBoss); else HH.sayOne(run, W.bust, 'bustI'); }
  };

  // The tab is being hidden while the wave's money is on the table (the card is up, or the wave has just been won and the card is about to come): it's earned, so it's paid now, before the kit banks. Then the card has to change: there's nothing left to bet, and it says so. Restart and Quit in that beat pay through here too (game.js), and then there's no card.
  function hiddenCard(run, paid) {
    run.ask({ title: W.bet.hiddenTitle, text: W.bet.hiddenBody(paid), options: [{ label: W.bet.hiddenGo, value: 0 }] }, o => placeBet(run, o));
  }
  HH.cashOnHide = function (run) {
    const w = run && run.w;
    if (!w || (w.phase !== 'asking' && w.phase !== 'cleared') || w.cashedOnHide || run.dry) return;
    const paid = w.table;
    run.addSalvage(paid); w.table = 0; w.cashedOnHide = true; w.cashedPaid = paid;
    if (w.phase === 'asking') hiddenCard(run, paid);   // in 'cleared' the card isn't up yet: settle shows this one when play comes back
  };

  // The answer to the card, whichever card it was. Only what's still on the table can be paid or bet.
  function placeBet(run, o) {
    const w = run.w, stake = Math.min(w.table, Math.max(0, o.value || 0)), pay = w.table - stake;
    w.cashedOnHide = false;
    if (pay > 0) run.addSalvage(pay);
    w.stake = stake; w.table = 0; w.bets++;
    w.phase = 'gap'; w.gapT = T.gapSecs;
    HH.sfx(run, stake ? 'chips' : 'cash');
    HH.fx(run, A => { if (pay) A.floatText(90, 58, '+' + pay, A.GOLD, 20); if (stake) A.floatText(320, 66, stake + ' RIDES', '#ffb35a', 20); });
  }

  // Between waves: the card. Always offers cashing in, so it never traps anyone. There's always something on the table to bet.
  function settle(run) {
    const w = run.w, table = w.table, last = w.wave + 1 >= HH.waveCount(run);
    if (last) {
      if (table > 0) { run.addSalvage(table); HH.sfx(run, 'cash'); HH.fx(run, A => A.floatText(320, 90, '+' + table + ' SALVAGE', A.GOLD, 24)); }
      w.table = 0;
      w.phase = 'done';
      if (w.pal && run.stage.winLineClean) run.stage = Object.assign({}, run.stage, { winLine: run.stage.winLineClean });   // the pal shows behind the win screen, so no joke there (batch rule)
      run.win(run.boss ? T.bossWinBeat : undefined);
      return;
    }
    if (w.cashedOnHide) { w.phase = 'asking'; hiddenCard(run, w.cashedPaid); return; }
    const x = HH.betX(run), limit = HH.betLimit(run), all = Math.min(table, limit), half = Math.floor(all / 2);
    const quips = w.pal ? W.bet.quips : W.bet.quips.concat(W.bet.adultQuips);   // a pal still out shows behind the card (batch rule)
    w.quipI = (w.quipI === undefined ? run.int(0, quips.length - 1) : w.quipI + 1);
    const body = (w.wonLast ? W.bet.won(w.wonLast) : '') + (w.lostLast ? W.bet.lost(w.lostLast) : '') + W.bet[run.boss ? 'last' : 'body'](table, x) + (table > limit ? ' ' + W.bet.limit(limit) : '') + ' ' + quips[w.quipI % quips.length];
    const opts = [
      { label: W.bet.cash, blurb: W.bet.cashBlurb(table), value: 0 },
      { label: W.bet.half, blurb: W.bet.ridesBlurb(table - half, half, Math.round(half * x)), value: half, disabled: half < 1 },
      { label: W.bet.all, blurb: W.bet.ridesBlurb(table - all, all, Math.round(all * x)), value: all },
    ];
    w.phase = 'asking';
    run.ask({ title: W.bet.title, text: body, options: opts }, o => placeBet(run, o));
  }
})();
