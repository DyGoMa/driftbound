// What's on screen and how it answers: node games/split-light/test/screen-checks.js
// Tap sizes and talk-box clearance on every size, including a 320 px phone with its browser bars showing; real presses, slow presses and slides; keys; pictures present and broken; speed on a slowed computer.
const { start, check, finish } = require('./harness');
const KEYS = ['ione_bust', 'vasch_bust', 'prism_top', 'prism_fire', 'room_0', 'room_1', 'room_2', 'room_3', 'room_4'];

(async () => {
  const h = await start();

  // ---- Tap targets and talk boxes, on all three sizes
  for (const size of ['phone', 'small', 'short', 'computer']) {
    const { page, ctx } = await h.open(size);
    await page.evaluate(() => { const d = DriftSave; d.finishRun('smoke-bank', 0, 2000); ['steady', 'scraper', 'look'].forEach(u => d.buyUpgrade('split-light', u, 20, 3)); });
    const sizes = await page.evaluate(() => {
      const s = Kit.view.scale, out = { scale: s, cell: TUNE.cell * s, smallest: 1e9, what: '', pal: TUNE.palRadius * 2 * s };
      [[15, null], [16, null]].forEach(([i]) => {
        __kit.jump(i, { fair: false });
        SL.buttons(__kit.run()).forEach(b => { const m = Math.min(b.w, b.h) * s; if (m < out.smallest) { out.smallest = m; out.what = b.id; } });
      });
      const p = document.querySelector('[data-kit="pause"]').getBoundingClientRect();
      out.pause = Math.min(p.width, p.height);
      return out;
    });
    check(sizes.cell >= 44, `${size}: board cell ${sizes.cell.toFixed(1)} CSS px`);
    check(sizes.smallest >= 44, `${size}: smallest button (${sizes.what}) ${sizes.smallest.toFixed(1)} CSS px across`);
    check(sizes.pal >= 44, `${size}: pal tap circle ${sizes.pal.toFixed(1)} CSS px across`);
    check(sizes.pause >= 40, `${size}: pause button ${sizes.pause.toFixed(1)} CSS px (the kit's own)`);
    const boxes = await page.evaluate(async () => {
      const W = SL.WORDS, B = W.bossSay, lines = [...W.grow, W.growFirst, ...W.retryKept, ...W.scarGone, W.crush, ...W.growTap, W.clamp, W.armourClang, W.twinBack, ...W.dead, W.bossDead, ...W.arm, ...B.phaseStart, ...B.phaseWon, ...B.stockHit, ...B.hit, ...B.miss, ...B.corrected, ...B.reset, B.wait, B.down, W.palAppear.glimmick, W.palAppear.shardle];
      __kit.jump(16, { fair: true });
      const r = __kit.run(), c = Kit.canvas.getBoundingClientRect();
      const res = { n: lines.length, worst: -1e9, worstText: '', topOfBoard: TUNE.top - 9, overPause: 0, overButtons: 0 };
      const pause = document.querySelector('[data-kit="pause"]').getBoundingClientRect();
      for (const l of lines) {
        r.say(l.who, l.text, 30);
        const b = document.querySelector('.kit-say').getBoundingClientRect();
        const low = Kit.toGame(0, b.bottom - c.top).y;
        if (low > res.worst) { res.worst = low; res.worstText = l.text; }
        if (b.right > pause.left && b.top < pause.bottom) res.overPause++;
      }
      Kit.ui.sayClear();
      __kit.title();
      return res;
    });
    check(boxes.worst <= boxes.topOfBoard, `${size}: ${boxes.n} talk lines all stay above the board: lowest edge at ${boxes.worst.toFixed(1)}, board frame starts at ${boxes.topOfBoard} ("${boxes.worstText}")`);
    check(boxes.overPause === 0, `${size}: no talk line covers the pause button`);
    await ctx.close();
  }

  // ---- Real thumbs: events that arrive across many steps, unlike the bot's tap. A crystal at (2,1) on board 1.
  {
    const { page: pt, ctx: ct } = await h.open('phone');
    await pt.evaluate(() => __kit.jump(0, { fair: true }));
    await pt.waitForTimeout(120);
    const where = await pt.evaluate(() => {
      const r = __kit.run(), s = Kit.view.scale, c = Kit.canvas.getBoundingClientRect(), P = SL.cellXY(r, 2, 1), F = SL.buttons(r).find(b => b.id === 'fire');
      const css = (x, y) => ({ x: c.left + (x - Kit.view.left) * s, y: c.top + (y - Kit.view.top) * s });
      return { cell: css(P.x, P.y), fire: css(F.x + F.w / 2, F.y + F.h / 2) };
    });
    const lean = () => pt.evaluate(() => __kit.run().w.lean[6]);
    await pt.touchscreen.tap(where.cell.x, where.cell.y);
    await pt.waitForTimeout(120);
    check((await lean()) === 1, 'a real touch on a crystal turns it');
    await pt.touchscreen.tap(where.cell.x, where.cell.y);
    await pt.waitForTimeout(120);
    check((await lean()) === 0, 'and a second touch turns it back');
    await pt.mouse.move(where.cell.x, where.cell.y); await pt.mouse.down(); await pt.waitForTimeout(600); await pt.mouse.up();
    await pt.waitForTimeout(120);
    check((await lean()) === 1, 'a slow press, 0.6 s, still turns it');
    await pt.mouse.move(where.cell.x, where.cell.y); await pt.mouse.down(); await pt.mouse.move(where.fire.x, where.fire.y); await pt.mouse.up();   // all inside one step
    await pt.waitForTimeout(120);
    await pt.mouse.move(where.cell.x, where.cell.y); await pt.mouse.down(); await pt.waitForTimeout(80); await pt.mouse.move(where.fire.x, where.fire.y); await pt.waitForTimeout(80); await pt.mouse.up();   // across several
    await pt.waitForTimeout(120);
    const after = await pt.evaluate(() => ({ lean: __kit.run().w.lean[6], fired: __kit.run().w.boardFired }));
    check(after.lean === 1 && after.fired === 0, 'pressing a crystal and sliding away cancels: nothing turns, nothing fires');
    await pt.touchscreen.tap(where.fire.x, where.fire.y);
    await pt.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 6000 });
    check(true, 'a real touch on FIRE fires, and clears board 1');
    await ct.close();
  }

  // ---- Keys, on a computer.
  {
    const { page: p2, ctx: c2 } = await h.open('computer');
    await p2.evaluate(() => __kit.jump(0, { fair: true }));
    await p2.waitForTimeout(100);
    for (const k of ['ArrowUp', 'ArrowUp']) { await p2.keyboard.press(k); await p2.waitForTimeout(80); }   // the first brings the cursor up mid-board, the second moves it onto the crystal
    await p2.waitForTimeout(120);
    const cur = await p2.evaluate(() => __kit.run().w.cursor);
    await p2.keyboard.press('Space');
    await p2.waitForTimeout(120);
    const turned = await p2.evaluate(() => __kit.run().w.lean[6]);
    await p2.keyboard.press('KeyF');
    await p2.waitForTimeout(100);
    const fired = await p2.evaluate(() => __kit.run().w.boardFired);
    check(cur && cur.x === 2 && cur.y === 1 && turned === 1, `arrows and Space turn the crystal under the cursor (cursor ${JSON.stringify(cur)}, lean ${turned})`);
    check(fired === 1, 'F fires');
    await p2.waitForFunction(() => __kit.state().screen === 'result', null, { timeout: 6000 });
    check(true, 'that shot, made from the keyboard, clears board 1');
    await c2.close();
  }

  // ---- Pictures: stand-ins for every key get drawn; broken ones fall back in silence.
  {
    const { page: p3, ctx: c3 } = await h.open('phone');
    const pics = await p3.evaluate(async keys => {
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
      const c = cv.getContext('2d'); c.fillStyle = '#ff00ff'; c.fillRect(0, 0, 64, 64);
      const url = cv.toDataURL('image/png'), drawn = new Set(), real = Kit.art.draw;
      window.DRIFT_SPRITES = {}; keys.forEach(k => { window.DRIFT_SPRITES[k] = { src: url, frames: 1 }; });
      Kit.art.loadSprites();
      await new Promise(r => setTimeout(r, 300));
      Kit.art.draw = function (ctx, key, f, x, y, hh, flip) { const ok = real.call(Kit.art, ctx, key, f, x, y, hh, flip); if (ok) drawn.add(key); return ok; };
      [0, 5, 9, 13, 16].forEach(i => { __kit.jump(i, { fair: true }); Kit.drawNow(); const r = __kit.run(); SL.fire(r); Kit.drawNow(); });
      Kit.art.draw = real;
      __kit.title();
      return [...drawn];
    }, KEYS);
    check(KEYS.every(k => pics.includes(k)), `all ${KEYS.length} picture keys get drawn (${pics.join(', ')})`);
    await c3.close();
    const { page: p4, ctx: c4 } = await h.open('phone');
    const broken = await p4.evaluate(async keys => {
      window.DRIFT_SPRITES = {}; keys.forEach(k => { window.DRIFT_SPRITES[k] = { src: 'art/does-not-exist.webp', frames: 1 }; });
      Kit.art.loadSprites();
      await new Promise(r => setTimeout(r, 300));
      __kit.jump(16, { fair: true }); Kit.drawNow(); __kit.jump(3, { fair: true }); Kit.drawNow(); __kit.title();
      return true;
    }, KEYS);
    check(broken, 'every picture broken on purpose: the game still draws and plays');
    await c4.close();
  }

  // ---- Speed on a slowed computer: drawing, and the live check on the hardest board.
  {
    const { page: p5, ctx: c5 } = await h.open('phone');
    const cdp = await c5.newCDPSession(p5);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
    const speed = await p5.evaluate(() => {
      const res = {};
      const time = (i, spec, label) => {
        __kit.jump(i, { fair: true });
        const r = __kit.run();
        if (spec) { r.w.boss.opened = true; SL.loadBoard(r, spec); }
        Kit.drawNow();
        const list = [];
        for (let n = 0; n < 200; n++) { const t = performance.now(); Kit.drawNow(); list.push(performance.now() - t); }
        list.sort((a, b) => a - b);
        res[label] = { median: list[100], p95: list[190], worst: list[199] };
      };
      time(15, null, 'best-work');
      time(16, SL.BOSS[2], 'the-arm');
      const L = SL.compile(SL.BOSS[2]), s = SL.survey(L, { keep: true });
      let worst = 0, n = 0;
      s.list.forEach(st => { if (n++ % 3) return; const S = Object.assign({}, st, { shots: L.shots }), t = performance.now(); SL.stillPossible(L, S); worst = Math.max(worst, performance.now() - t); });
      res.liveCheckWorst = worst;
      __kit.title();
      return res;
    });
    console.log('     CPU slowed 6 times, 390 x 844 at 2x: ' + JSON.stringify(speed, (k, v) => (typeof v === 'number' ? +v.toFixed(1) : v)));
    check(speed['the-arm'].p95 < 16, `drawing the busiest board: 95th percentile ${speed['the-arm'].p95.toFixed(1)} ms`);
    check(speed.liveCheckWorst < 400, `the live check after a shot, worst board: ${speed.liveCheckWorst.toFixed(0)} ms`);
    await c5.close();
  }

  await h.close();
  finish('screen checks', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
