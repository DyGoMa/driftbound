// Hot Hand fairness script, part: pictures, Endless, keys, the talk box, pals, upgrades, draw time. Run through tools/fairness.js.
module.exports = async function ({ page, ctx, SEEDS, ONLY, STAGE, stages, check, runMany, line, sum, PLAYERS, MIN_LEAD, SMALL_SCALE, SHOTS, path, fs }) {
  if (!ONLY || ONLY === 'pics') {
    console.log('\n== Stand-in pictures for every key in art/REQUEST.md: do they load, and does the game use each one? ==');
    const keys = [...fs.readFileSync(path.join(__dirname, '..', 'art', 'REQUEST.md'), 'utf8').matchAll(/^  (\w+):\s+\{ src:/gm)].map(m => m[1]);
    const r = await page.evaluate(async keys => {
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; const c = cv.getContext('2d'); c.fillStyle = '#ff00ff'; c.fillRect(8, 8, 48, 48);
      const data = cv.toDataURL('image/png'), A = Kit.art, specs = {};
      keys.forEach(k => { specs[k] = { src: data, frames: 1, feet: 0.9, fill: 0.8 }; });
      window.DRIFT_SPRITES = specs; A.loadSprites();
      await new Promise(res => setTimeout(res, 400));
      const ready = keys.filter(k => A.has(k)).length, drawn = {}, real = A.draw;
      A.draw = function (ctx, key) { const ok = real.apply(A, arguments); if (ok) drawn[key] = (drawn[key] || 0) + 1; return ok; };
      const T = TUNE, keepH = T.botHuman, keepI = T.botIgnoreHeat;
      for (let i = 0; i < 5; i++) {
        T.botHuman = null; T.botIgnoreHeat = false; __kit.runStage(i, { bot: true, seed: 7 + i, fair: true, renderEvery: 3 });
        T.botHuman = { react: 0.15, taps: 6, jitter: 10, sloppy: 0.35 }; T.botIgnoreHeat = true; __kit.runStage(i, { bot: true, seed: 11 + i, fair: true, renderEvery: 3 });
        T.botHuman = keepH; T.botIgnoreHeat = keepI;
        __kit.runStage(i, { bot: false, seed: 13 + i, fair: true, renderEvery: 3, maxSeconds: 60 });
      }
      A.draw = real;
      window.DRIFT_SPRITES = {};
      return { ready, total: keys.length, missing: keys.filter(k => !drawn[k]) };
    }, keys);
    console.log(`${r.ready} of ${r.total} load. Never drawn in these runs: ${r.missing.join(', ') || 'none'}`);
    check(r.ready === r.total, 'all the keys load');
    check(r.missing.length === 0, 'every key gets drawn');
    await page.reload(); await page.waitForTimeout(600);
    await page.waitForFunction(() => window.__kit && __kit.state().screen === 'title');
  }

  if (!ONLY || ONLY === 'endless') {
    console.log('\n== Endless ==');
    const list = await page.evaluate(() => [1, 2, 3].map(s => { const r = __kit.runStage(0, { bot: true, endless: true, seed: s * 97, fair: true, maxSeconds: 600, renderEvery: 0 }); return { result: r.result, secs: r.seconds, score: r.score, salvage: r.salvage, wave: r.info.wave, hits: r.info.hits }; }));
    list.forEach(r => console.log(`plain bot: ${r.result} after ${r.secs} s, reached wave ${r.wave + 1}, score ${r.score}, salvage ${r.salvage}, hits ${r.hits}`));
    check(list.every(r => r.wave >= 3), 'Endless keeps going past wave 4 with no stall');
  }

  if (!ONLY || ONLY === 'keys') {
    console.log('\n== On a computer, Space or Enter throws at the most urgent target ==');
    await page.evaluate(() => { __kit.title(); __kit.bot(false); __kit.jump(0, { fair: true }); const r = __kit.run(); HH.addFoe(r, 'grunt', { lane: 2, d: 300 }); HH.addFoe(r, 'grunt', { lane: 1, d: 500 }); });
    await page.waitForTimeout(100);
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    const k = await page.evaluate(() => { const w = __kit.run().w; return { throws: w.throws, near: w.shots[0] ? Math.round(w.shots[0].t.d) : null, kills: w.kills }; });
    check(k.throws === 1, `Space threw (throws ${k.throws}, kills ${k.kills})`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const k2 = await page.evaluate(() => __kit.run().w.throws);
    check(k2 === 2, `Enter threw (throws ${k2})`);
    await page.evaluate(() => __kit.title());
  }

  if (!ONLY || ONLY === 'say') {
    console.log('\n== Talk box in play: never over the read-outs or Juno ==');
    const lines = await page.evaluate(() => {
      const W = HH.WORDS, out = [];
      const add = l => { if (l && l.text) out.push(l); };
      W.stages.forEach(s => (s.radio || []).forEach(add));
      [W.lock, W.bust, W.betWin, W.boss.overload, W.boss.hit, W.boss.round].forEach(l => l.forEach(add));
      [W.bustBoss, W.boss.start, W.boss.expose, W.boss.reform, W.boss.quench, W.boss.ramSoon, W.boss.ram].forEach(add);
      Object.values(W.first).forEach(add); Object.values(W.palAppear).forEach(add);
      return out;
    });
    const longest = lines.slice().sort((a, b) => b.text.length - a.text.length)[0];
    console.log(lines.length + ' lines said during play. Longest is ' + longest.text.length + ' characters: ' + longest.text);
    for (const size of [{ w: 844, h: 390 }, { w: 667, h: 375 }, { w: 568, h: 320 }, { w: 1440, h: 900 }]) {
      await page.setViewportSize({ width: size.w, height: size.h });
      await page.waitForTimeout(200);
      const r = await page.evaluate(l => {
        __kit.jump(3, { fair: true }); __kit.timeScale = 0; const run = __kit.run();
        run.say(l.who, l.text, 30, 'corner');
        const el = document.querySelector('.kit-say'), b = el.getBoundingClientRect(), a = Kit.toGame(b.left, b.top);
        const out = { x: a.x, y: a.y, feet: TUNE.frontY }; el.remove(); __kit.timeScale = 1; __kit.title();
        return out;
      }, longest);
      check(r.y >= r.feet + 3 && r.x > 276, `${size.w}x${size.h}: longest line's box starts at x ${r.x.toFixed(0)}, y ${r.y.toFixed(0)}: below Juno's feet (${r.feet}) and right of the heat bar (276)`);
    }
    await page.setViewportSize({ width: 844, height: 390 });
  }

  if (!ONLY || ONLY === 'pals') {
    console.log('\n== Pals, with their chances forced to 100%, caught through the real tap handling ==');
    const cinder = await runMany(page, 1, 10, { botPals: 'cinderbun', cinderChance: 1, cinderHot: 4 });
    check(cinder.every(r => r.result === 'win'), 'Cinderbun runs still win');
    const cc = await page.evaluate(() => { const keep = [TUNE.botPals, TUNE.cinderChance, TUNE.cinderHot]; TUNE.botPals = 'cinderbun'; TUNE.cinderChance = 1; TUNE.cinderHot = 4; let n = 0; for (let s = 1; s <= 10; s++) { if (__kit.runStage(1, { bot: true, seed: s * 31, fair: true, renderEvery: 0 }).caught.includes('cinderbun')) n++; } [TUNE.botPals, TUNE.cinderChance, TUNE.cinderHot] = keep; return n; });
    const dc = await page.evaluate(() => { const keep = [TUNE.botPals, TUNE.diceChance, TUNE.botBet]; TUNE.botPals = 'dicemite'; TUNE.diceChance = 1; TUNE.botBet = 'all'; let n = 0; for (let s = 1; s <= 10; s++) { if (__kit.runStage(1, { bot: true, seed: s * 37, fair: true, renderEvery: 0 }).caught.includes('dicemite')) n++; } [TUNE.botPals, TUNE.diceChance, TUNE.botBet] = keep; return n; });
    check(cc >= 8, `Cinderbun caught on ${cc} of 10`);
    check(dc >= 8, `Dicemite caught on ${dc} of 10`);
  }

  if (!ONLY || ONLY === 'ups') {
    console.log('\n== Upgrades at level 3, against a fair run ==');
    const u = await page.evaluate(() => {
      __kit.jump(1, { fair: true }); const r0 = __kit.run();
      const fair = { cool: HH.baseCool(r0), x: HH.betX(r0), burnHot: HH.burnReach(r0, 2), burnWarm: HH.burnReach(r0, 1), dmg: HH.flameDmg(r0, 2) };
      __kit.title();
      __kit.jump(1, { fair: false }); const r = __kit.run(); r.up = id => 3;
      const full = { cool: HH.baseCool(r), x: HH.betX(r), burnHot: HH.burnReach(r, 2), burnWarm: HH.burnReach(r, 1), dmg: HH.flameDmg(r, 2) };
      r.carry.burns = 0; r.w.heat = 100; HH.goOver(r); full.lock = r.w.lockFull;
      __kit.title();
      return { fair, full };
    });
    console.log(JSON.stringify(u));
    check(u.full.cool > u.fair.cool && u.full.x === 2.75 && u.fair.x === 2 && u.full.burnHot > u.fair.burnHot && u.full.burnWarm > 0 && u.fair.burnWarm === 0 && u.full.dmg === 4 && u.fair.dmg === 3, 'each upgrade changes what it says, and a fair run sees the base numbers');
  }

  if (!ONLY || ONLY === 'perf') {
    console.log('\n== Draw time with the CPU slowed 6 times ==');
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    for (const st of [3, 4]) {
      const r = await page.evaluate(async st => {
        __kit.title(); __kit.bot(true); __kit.timeScale = 1; __kit.jump(st, { fair: true });
        const times = [], draw = Kit.onDraw;
        Kit.onDraw = function (c, v, real) { const a = performance.now(); draw(c, v, real); times.push(performance.now() - a); };
        await new Promise(res => setTimeout(res, 9000));
        Kit.onDraw = draw; __kit.bot(false); __kit.title();
        times.sort((x, y) => x - y);
        return { n: times.length, median: times[times.length >> 1], p95: times[Math.floor(times.length * 0.95)], worst: times[times.length - 1] };
      }, st);
      console.log(`stage ${st + 1}: ${r.n} frames, median ${r.median.toFixed(1)} ms, 95th percentile ${r.p95.toFixed(1)} ms, worst ${r.worst.toFixed(1)} ms`);
    }
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  if (!ONLY || ONLY === 'palrate') {
    console.log('\n== How rare the pals are: attempts (of 20 a stage) where one came, average bot, default betting, nothing caught ==');
    const r = await page.evaluate(() => {
      const T = TUNE, keep = T.botHuman, say = HH.say, W = HH.WORDS, out = [], palKey = 'hhPalTest';
      T.botHuman = { react: 0.45, taps: 2.8, jitter: 12, sloppy: 0.18, slip: 0.2, lag: 0.15 };
      for (let st = 1; st <= 3; st++) {
        const n = { cinderbun: 0, dicemite: 0 }; let which = {};
        HH.say = function (run, l, s) { if (l === W.palAppear.cinderbun) which.cinderbun = 1; if (l === W.palAppear.dicemite) which.dicemite = 1; return say.apply(HH, arguments); };
        for (let s = 1; s <= 20; s++) { which = {}; __kit.runStage(st, { bot: true, seed: s * 131 + st, fair: true, renderEvery: 0 }); n.cinderbun += which.cinderbun || 0; n.dicemite += which.dicemite || 0; }
        out.push('stage ' + (st + 1) + ': Cinderbun ' + n.cinderbun + ', Dicemite ' + n.dicemite);
      }
      HH.say = say; T.botHuman = keep;
      return out;
    });
    console.log(r.join('\n'));
  }
};
