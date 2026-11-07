// The review fixes of 2026-11-06, each with real taps and real steps: node games/split-light/test/review-pals-fixes.js [screenshot folder]
// Shardle clear of the talk box; no pal behind a result; no Shardle on a last shot; the growth booked as the shot leaves; his count ending a dead board; Reset's label inside its button; cells at the tap rule on a short screen.
const path = require('path'), os = require('os'), fs = require('fs');
const { start, check, finish, HELP } = require('./harness');
const OUT = process.argv[2] || path.join(os.tmpdir(), 'kcheck', 'final', 'sl');
fs.mkdirSync(OUT, { recursive: true });

const SIZES = [[320, 568], [360, 640], [375, 667], [390, 844], [412, 915], [320, 454]];

(async () => {
  const h = await start();
  const browser = await (async () => { const { page, ctx } = await h.open('phone'); await ctx.close(); return page; })();

  async function at(w, ht) {
    const pw = require('./harness');
    const { page, ctx } = await h.open('phone');
    await page.setViewportSize({ width: w, height: ht });
    await page.waitForTimeout(150);
    await page.evaluate(HELP);
    return { page, ctx };
  }

  // ---- 1. Shardle and the talk box: over the whole 9 s, with Ione's line and then each of Vasch's lines, on the boards the review measured.
  for (const [vw, vh] of SIZES) {
    const { page, ctx } = await at(vw, vh);
    for (const stage of [8, 15, 16]) {
      const res = await page.evaluate(i => {
        SL.forgetShots();
        TUNE.botPals = 'shardle';
        __kit.jump(i, { fair: true, seed: 5 });
        const r = __kit.run(), w = r.w, c = Kit.canvas.getBoundingClientRect(), W = SL.WORDS;
        SL.palAfterShot(r, { bounces: 99 });
        const s = Kit.view.scale, out = { samples: 0, overHalf: 0, worst: 0, firstLow: 0, pal: w.pal && w.pal.id };
        const lines = [W.palAppear.shardle, ...W.grow, ...W.bossSay.miss, ...W.bossSay.stockHit];
        for (let t = 0; w.pal; t++) {
          if (t % 15 === 0) {
            const l = lines[Math.floor(t / 15) % lines.length];
            r.say(l.who, l.text, 30);
            const b = document.querySelector('.kit-say').getBoundingClientRect();
            const P = { l: (w.pal.x - 25 - Kit.view.left) * s + c.left, t: (w.pal.y - 44 - (w.pal.hop || 0) - Kit.view.top) * s + c.top, sz: 50 * s };
            const ox = Math.max(0, Math.min(b.right, P.l + P.sz) - Math.max(b.left, P.l)), oy = Math.max(0, Math.min(b.bottom, P.t + P.sz) - Math.max(b.top, P.t));
            const share = ox * oy / (P.sz * P.sz);
            out.samples++; if (share > 0.5) out.overHalf++; if (share > out.worst) out.worst = +share.toFixed(2);
          }
          __step(r);
          if (t > 1000) break;
        }
        Kit.ui.sayClear();
        TUNE.botPals = false;
        return out;
      }, stage);
      check(res.pal === 'shardle' && res.worst === 0, `${vw}x${vh} stage ${stage + 1}: Shardle under a talk box in ${res.overHalf} of ${res.samples} samples, worst share ${res.worst}`);
    }
    await ctx.close();
  }
  {
    const { page, ctx } = await at(360, 640);
    await page.evaluate(() => { SL.forgetShots(); TUNE.botPals = 'shardle'; __kit.jump(15, { fair: true, seed: 5 }); const r = __kit.run(); SL.palAfterShot(r, { bounces: 99 }); });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, 'fix-shardle-360x640.png') });
    const caught = await page.evaluate(() => {
      const r = __kit.run(), w = r.w, p = w.pal, c = Kit.canvas.getBoundingClientRect(), s = Kit.view.scale;
      return { x: (p.x - Kit.view.left) * s + c.left, y: (p.y - TUNE.palTapUp - Kit.view.top) * s + c.top };
    });
    await page.mouse.click(caught.x, caught.y);
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({ screen: __kit.state().screen, has: DriftSave.hasPal('shardle') }));
    check(after.screen === 'catch' && after.has, `a real tap on it at 360x640 catches it: ${JSON.stringify(after)}`);
    await page.evaluate(() => { TUNE.botPals = false; });
    await ctx.close();
  }

  // ---- 2. No pal in the world or on screen behind a result. Every line of the lose and win pools is then fine, whatever it says.
  for (const [pal, how, name] of [['glimmick', 'lose', 'lose-glimmick'], ['shardle', 'win', 'win-shardle'], ['glimmick', 'win', 'win-glimmick'], ['shardle', 'lose', 'lose-shardle']]) {
    const { page, ctx } = await at(390, 844);
    const res = await page.evaluate(([pal, how]) => {
      SL.forgetShots();
      TUNE.botPals = pal; TUNE.glimmickWait = 0;
      __kit.jump(how === 'win' ? 8 : 8, { fair: true, seed: 3 });
      const r = __kit.run(), w = r.w;
      if (pal === 'glimmick') { w.sinceShot = 99; SL.stepPals(r, 1 / 60); } else SL.palAfterShot(r, { bounces: 99 });
      const had = w.pal && w.pal.id;
      r[how]();
      return { had, right: w.pal };
    }, [pal, how]);
    await page.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 8000 });
    await page.waitForTimeout(250);
    const seen = await page.evaluate(() => ({ pal: __kit.run().w.pal, text: document.querySelector('#kit-ui').innerText.replace(/\s+/g, ' ').slice(0, 110) }));
    await page.screenshot({ path: path.join(OUT, 'fix-result-' + name + '.png') });
    check(res.had === pal && !res.right && !seen.pal, `${how} with ${pal} out: had ${res.had}, in world at result ${seen.pal}. "${seen.text}"`);
    await page.evaluate(() => { TUNE.botPals = false; TUNE.glimmickWait = 24; });
    await ctx.close();
  }
  {
    // The one flirting line in play waits while a pal is out.
    const { page, ctx } = await at(390, 844);
    const res = await page.evaluate(() => {
      SL.forgetShots();
      __kit.jump(8, { fair: true, seed: 3 });
      const r = __kit.run(), w = r.w, said = [], keep = r.say;
      r.say = (who, text, a, b) => { said.push(text); keep(who, text, a, b); };
      r.carry.spent = 41; r.carry.armSaid = 2; TUNE.botPals = 'shardle'; SL.palAfterShot(r, { bounces: 99 }); said.length = 0;
      __shot(r, SL.solve(w.L, w.S).plan[0]);
      const during = said.some(t => /darling/.test(t));
      TUNE.botPals = false;
      return { during, armSaid: r.carry.armSaid, palOut: !!w.pal };
    });
    check(res.palOut && !res.during && res.armSaid === 2, `Silas's neck line waits while a pal is out: ${JSON.stringify(res)}`);
    await ctx.close();
  }

  // ---- 3. A 5-bounce last shot: no Shardle, no "Tap it!". And a 5-bounce shot with shots left still wakes it.
  {
    const { page, ctx } = await at(360, 640);
    const res = await page.evaluate(() => {
      SL.forgetShots();
      const shot = (shots, label) => {
        __kit.jump(11, { fair: true, seed: 5 });
        const r = __kit.run(), w = r.w, said = [], keep = r.say;
        r.say = (who, text, a, b) => { said.push(text); keep(who, text, a, b); };
        w.S = Object.assign({}, w.S, { shots });
        TUNE.botPals = 'shardle'; TUNE.shardleBounces = 0;
        // A shot that clears nothing: every core is out of its path, or the board stays alive anyway.
        let oc = SL.outcomes(w.L, w.S).find(o => !o.res.hits.length) || SL.outcomes(w.L, w.S)[0];
        if (w.perch !== oc.perch) __tapC(r, w.L.perches[oc.perch].i);
        Object.keys(oc.assign).forEach(k => { if (w.lean[k] !== oc.assign[k]) __tapC(r, +k); });
        __tapB(r, 'fire'); __land(r);
        const out = { label, pal: w.pal && w.pal.id, over: r.over, shots: w.S.shots, tapIt: said.some(t => /Tap it/.test(t)) };
        TUNE.botPals = false; TUNE.shardleBounces = 5; SL.forgetShots();
        return out;
      };
      return [shot(1, 'last'), shot(3, 'not last')];
    });
    console.log('     ' + JSON.stringify(res));
    check(res[0].over === 'lose' && !res[0].pal && !res[0].tapIt, 'last shot: the stage ends with no Shardle and no "Tap it!"');
    check(!res[1].over && res[1].pal === 'shardle' && res[1].tapIt, 'a long shot with shots left still wakes it');
    await ctx.close();
  }

  // ---- 4. Pause and Restart with the beam in the air: the same growth as a shot that landed.
  {
    const { page, ctx } = await at(360, 640);
    // A growth that stays for a new attempt is one in the way (SL.scarsAfter); a useful one cracks off, so on some shots there's nothing to dodge. Finds a level and a first shot whose growth stays, so the check can't pass on two empty lists.
    const pick = await page.evaluate(() => {
      SL.forgetShots();
      for (let i = 4; i < 16; i++) {
        __kit.jump(i, { fair: true, seed: 5 });
        const w = __kit.run().w;
        for (const oc of SL.outcomes(w.L, w.S)) {
          const N = SL.after(w.L, w.S, oc.res);
          if (SL.alive(N) && SL.scarsAfter(w.L, N.g).length) return { i, perch: oc.perch, assign: oc.assign };
        }
      }
      return null;
    });
    console.log('     board and shot: ' + JSON.stringify(pick));
    const landed = await page.evaluate(p => {
      SL.forgetShots();
      __kit.jump(p.i, { fair: true, seed: 5 });
      const r = __kit.run(), w = r.w;
      __shot(r, p);
      const g = w.S.g.slice();
      __tapB(r, 'retry');
      return { landedG: g, afterRetry: w.S.g.slice(), shots: w.S.shots, fired: w.fired };
    }, pick);
    const flying = await page.evaluate(p => {
      SL.forgetShots();
      __kit.jump(p.i, { fair: true, seed: 5 });
      const r = __kit.run(), w = r.w;
      if (w.perch !== p.perch) __tapC(r, w.L.perches[p.perch].i);
      Object.keys(p.assign).forEach(k => { if (w.lean[k] !== p.assign[k]) __tapC(r, +k); });
      __tapB(r, 'fire');
      return { beam: !!w.beam, g: w.S.g.slice(), shots: w.S.shots };
    }, pick);
    await page.evaluate(() => { document.querySelector('[data-kit="pause"]').click(); });
    await page.waitForTimeout(150);
    await page.locator('[data-kit="restart"]').click();
    await page.waitForTimeout(250);
    const after = await page.evaluate(() => { const w = __kit.run().w; return { g: w.S.g.slice(), shots: w.S.shots, fired: w.fired, board: w.boardFired }; });
    console.log('     landed then Retry ' + JSON.stringify(landed) + '; in the air ' + JSON.stringify(flying) + '; after Restart ' + JSON.stringify(after));
    check(flying.beam && flying.g.length === 0, 'the beam really was in the air, with nothing grown yet on screen');
    check(after.fired === 1 && JSON.stringify(after.g) === JSON.stringify(landed.afterRetry), `Restart in flight leaves the same growths as landing and Retry: ${JSON.stringify(after.g)} and ${JSON.stringify(landed.afterRetry)}`);
    check(landed.afterRetry.length > 0, 'and that is a real growth, not two empty lists');
    await page.reload(); await ctx.close();
  }
  {
    // A reload with the beam in the air: same.
    const { page, ctx } = await at(360, 640);
    await page.evaluate(() => { SL.forgetShots(); __kit.jump(7, { fair: true, seed: 5 }); const r = __kit.run(); __tapB(r, 'fire'); });
    const book = await page.evaluate(() => DriftSave.getSetting('split-light-unfinished', null).scars[7]);
    check(book && book.length > 0, `the save has the growth while the beam flies: ${JSON.stringify(book)}`);
    await page.evaluate(() => SL.forgetShots());
    await ctx.close();
  }

  // ---- 5. His count on a dead board: real flow, nobody touching anything.
  {
    const { page, ctx } = await at(390, 844);
    const log = await page.evaluate(() => {
      SL.forgetShots();
      __kit.jump(16, { fair: true, seed: 7 });
      const r = __kit.run(), w = r.w, out = [];
      w.boss.opened = true;
      let last = '', steps = 0;
      while (!r.over && steps++ < 60 * 1500) {
        __step(r);
        const k = [w.boss.phase, w.boss.nerve, w.S.shots, w.dead].join();
        if (k !== last) { last = k; out.push({ t: +r.time.toFixed(1), nerve: w.boss.nerve, shots: w.S.shots, dead: w.dead, gap: w.gap > 0 }); }
      }
      return { out, over: r.over, t: +r.time.toFixed(1) };
    });
    log.out.forEach(l => console.log('     ' + JSON.stringify(l)));
    check(log.over === 'lose', `seed 7, nobody playing: ${log.over} at ${log.t} s`);
    check(log.out.some(l => l.dead) && log.out[log.out.length - 1].nerve === 0, 'it went through a dead board and down to no nerve');
    await ctx.close();
  }
  {
    // A person on a dead board who acts in time pays nothing extra.
    const { page, ctx } = await at(390, 844);
    const res = await page.evaluate(() => {
      SL.forgetShots();
      __kit.jump(16, { fair: true, seed: 3 });
      const r = __kit.run(), w = r.w; w.boss.opened = true;
      __deadLine(w.L, w.S).forEach(oc => __shot(r, oc));
      const dead = w.dead, n = w.boss.nerve;
      for (let i = 0; i < 60 * (TUNE.bossCount - 1); i++) __step(r);
      const before = w.boss.nerve, count = SL.countOf(w);
      for (let i = 0; i < 60 * 2; i++) __step(r);
      return { dead, n, before, count: +count.toFixed(1), after: w.boss.nerve, gap: w.gap > 0, sinceDeadStillOn: w.dead };
    });
    check(res.dead && res.before === res.n && res.after === res.n - 1, `dead board: nerve holds until his count reaches ten (${res.n} at count ${res.count}), then ${res.after}`);
    await ctx.close();
  }

  // ---- 6. Reset's second-tap label, with every upgrade bought: inside the button, at each size.
  for (const [vw, vh] of [[320, 568], [360, 640], [390, 844], [320, 454]]) {
    const { page, ctx } = await at(vw, vh);
    const m = await page.evaluate(() => {
      SL.forgetShots();
      ['steady', 'scraper', 'look'].forEach(u => { DriftSave.finishRun('smoke-bank', 0, 2000); DriftSave.buyUpgrade('split-light', u, 20, 3); });
      __kit.jump(16, { fair: false, seed: 3 });
      const r = __kit.run(), w = r.w; w.boss.opened = true;
      __shot(r, SL.solve(w.L, w.S).plan[0]);
      __tapB(r, 'retry');
      const b = SL.buttons(r).find(x => x.id === 'retry'), c = Kit.ctx;
      const lines = b.label.split('\n').map(s => { Kit.art.text(c, s, -999, -999, { size: 20 }); return { s, w: +c.measureText(s).width.toFixed(1) }; });
      return { armed: w.resetArm > 0, bw: +b.w.toFixed(1), bh: +b.h.toFixed(1), lines };
    });
    await page.waitForTimeout(120);
    await page.screenshot({ path: path.join(OUT, `fix-resetarmed-${vw}x${vh}.png`) });
    check(m.armed && m.lines.every(l => l.w <= m.bw - 14), `${vw}x${vh}: button ${m.bw} wide, label ${JSON.stringify(m.lines)}`);
    await ctx.close();
  }

  // ---- 7. Short screen: every cell and button at the tap rule, nothing overlapping, a real tap landing on the right cell.
  for (const [vw, vh] of [[320, 454], [320, 480], [360, 500], [320, 520], [320, 568], [360, 640]]) {
    const { page, ctx } = await at(vw, vh);
    const m = await page.evaluate(() => {
      SL.forgetShots();
      ['steady', 'scraper', 'look'].forEach(u => { DriftSave.finishRun('smoke-bank', 0, 2000); DriftSave.buyUpgrade('split-light', u, 20, 3); });
      const s = Kit.view.scale, out = [];
      [[6, 'level 7 rows'], [0, 'level 4 rows'], [15, 'level 7 rows'], [16, 'boss']].forEach(([i, name]) => {
        __kit.jump(i, { fair: false, seed: 3 });
        const r = __kit.run(), bs = SL.buttons(r), P = SL.place(r), L = r.w.L;
        const smallest = Math.min(...bs.map(b => Math.min(b.w, b.h))) * s;
        const boardBottom = P.bottom, top = Math.min(...bs.map(b => b.y));
        const overlaps = bs.some((a, k) => bs.some((b, j) => j > k && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h));
        const inside = bs.every(b => b.x >= Kit.view.left && b.x + b.w <= Kit.view.right && b.y + b.h <= Kit.view.bottom);
        out.push({ name, cell: +(TUNE.cell * s).toFixed(1), smallest: +smallest.toFixed(1), clear: top - boardBottom, overlaps, inside, ids: bs.map(b => b.id + ':' + Math.round(b.w) + 'x' + Math.round(b.h)).join(' ') });
      });
      return out;
    });
    m.forEach(x => {
      check(x.cell >= 44 && x.smallest >= 44 && !x.overlaps && x.inside && x.clear >= 0, `${vw}x${vh} ${x.name}: cell ${x.cell}, smallest button ${x.smallest}, ${x.clear} px clear of the board, ${x.ids}`);
    });
    await ctx.close();
  }
  {
    const { page, ctx } = await at(320, 454);
    for (const [i, name] of [[6, 'level7'], [0, 'level1'], [15, 'level16'], [16, 'boss']]) {
      await page.evaluate(k => { SL.forgetShots(); __kit.jump(k, { fair: false, seed: 3 }); const w = __kit.run().w; if (w.boss) w.boss.opened = true; }, i);
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(OUT, `fix-short-320x454-${name}.png`) });
    }
    await page.evaluate(() => { ['steady', 'scraper', 'look'].forEach(u => { DriftSave.finishRun('smoke-bank', 0, 2000); DriftSave.buyUpgrade('split-light', u, 20, 3); }); SL.forgetShots(); __kit.jump(15, { fair: false, seed: 3 }); });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, 'fix-short-320x454-level16-upgrades.png') });
    await page.setViewportSize({ width: 320, height: 520 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, 'fix-short-320x520-level16-upgrades.png') });
    await page.evaluate(() => { __kit.jump(16, { fair: false, seed: 3 }); const w = __kit.run().w; w.boss.opened = true; w.countT = 40; });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, 'fix-short-320x520-boss.png') });
    await page.setViewportSize({ width: 320, height: 454 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(OUT, 'fix-short-320x454-boss-count.png') });
    // Real taps: a turnable crystal on stage 16 turns, FIRE fires.
    await page.evaluate(() => { SL.forgetShots(); __kit.jump(15, { fair: false, seed: 3 }); });
    const where = await page.evaluate(() => {
      const r = __kit.run(), w = r.w, L = w.L, s = Kit.view.scale, c = Kit.canvas.getBoundingClientRect(), to = (x, y) => ({ x: (x - Kit.view.left) * s + c.left, y: (y - Kit.view.top) * s + c.top });
      const i = L.pieces.findIndex(p => p && p.t === 'c'), P = SL.cellXY(r, i % L.cols, Math.floor(i / L.cols)), f = SL.buttons(r).find(b => b.id === 'fire');
      return { i, before: w.lean[i], cell: to(P.x, P.y), fire: to(f.x + f.w / 2, f.y + f.h / 2) };
    });
    await page.mouse.click(where.cell.x, where.cell.y); await page.waitForTimeout(120);
    const turned = await page.evaluate(i => __kit.run().w.lean[i], where.i);
    await page.mouse.click(where.fire.x, where.fire.y); await page.waitForTimeout(120);
    const fired = await page.evaluate(() => __kit.run().w.boardFired);
    check(turned !== where.before && fired === 1, `320x454, real clicks: crystal turned ${where.before} to ${turned}, FIRE fired ${fired}`);
    await ctx.close();
  }

  finish('review-pals-fixes', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
