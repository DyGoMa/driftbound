// Layout measured, and pictures for a person to look at: node games/split-light/test/review-shots.js [--shots folder]
const path = require('path'), os = require('os'), fs = require('fs');
const { start, check, finish, HELP } = require('./harness');
const OUT = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : path.join(os.tmpdir(), 'kcheck', 'split-light', 'review');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const h = await start();

  // ---- The stage list at every size: all of it clear of Back with no scrolling, and the buttons fill the column.
  const list = () => {
    const r = q => { const e = document.querySelector(q); return e ? e.getBoundingClientRect() : null; }, s = document.querySelector('.kit-screen');
    const boss = r('[data-stage="16"]'), four = r('[data-stage="3"]'), back = r('[data-kit="back"]');
    return { scroll: s.scrollHeight - s.clientHeight, bossBottom: Math.round(boss.bottom), backTop: Math.round(back.top), fourRight: Math.round(four.right), backRight: Math.round(back.right) };
  };
  for (const size of ['phone', 'small', 'short', 'computer']) {
    const { page, ctx } = await h.open(size);
    await page.locator('[data-kit="story"]').click();
    await page.waitForTimeout(150);
    const a = await page.evaluate(list);
    console.log(`     ${size} stage list: ${JSON.stringify(a)}`);
    check(a.scroll === 0 && a.bossBottom <= a.backTop, `${size}: all 17 stages fit, BOSS clear of Back`);
    check(Math.abs(a.fourRight - a.backRight) <= 2, `${size}: the row of 4 fills the column`);
    await page.screenshot({ path: path.join(OUT, `stages-${size}.png`) });
    // The longest it gets: a run carried, and the ending on offer.
    await page.evaluate(() => { DriftSave.setStoryCarry('split-light', { spent: 3 }); DriftSave.clearStage('split-light', 15); DriftSave.clearStage('split-light', 16); DriftSave.finishStory('split-light'); __kit.title(); });
    await page.waitForTimeout(100);
    await page.locator('[data-kit="story"]').click();
    await page.waitForTimeout(150);
    const b = await page.evaluate(list);
    console.log(`     ${size} longest: ${JSON.stringify(b)}`);
    check(b.scroll === 0, `${size}: still fits with a run carried and the ending on offer`);
    await page.screenshot({ path: path.join(OUT, `stages-${size}-long.png`) });
    await ctx.close();
  }

  // ---- Pictures.
  const { page: pa, ctx: ca } = await h.open('phone');
  await pa.evaluate(HELP);
  const clip = async (name, x, y, w, ht) => pa.screenshot({ path: path.join(OUT, name + '.png'), clip: { x, y, width: w, height: ht } });
  const winBox = await pa.evaluate(() => {
    __kit.jump(5, { fair: true, seed: 1 });
    const s = Kit.view.scale, c = Kit.canvas.getBoundingClientRect(), T = TUNE, panelY = T.top + T.rows * T.cell + T.hudH + T.panelGap;
    return { x: c.left + (0 - Kit.view.left) * s, y: c.top + (panelY - Kit.view.top) * s, w: 120 * s, h: (T.screenBottom - panelY) * s };
  });
  for (const n of [0, 8, 16, 24, 32, 40, 48]) {
    await pa.evaluate(k => { const r = __kit.run(); r.carry.spent = k; r.w.fired = 0; r.w.boardFired = 0; }, n);
    await pa.waitForTimeout(100);
    await clip('neck-' + n, winBox.x, winBox.y, winBox.w, winBox.h);
  }
  await pa.evaluate(() => { const r = __kit.run(); r.carry.spent = 42; r.w.boardFired = 4; });
  await pa.waitForTimeout(100);
  await pa.screenshot({ path: path.join(OUT, 'phone-play-arm.png') });
  await pa.evaluate(() => { __kit.jump(16, { fair: true, seed: 3 }); const r = __kit.run(); r.w.boss.opened = true; r.w.boss.phase = 1; SL.loadBoard(r, SL.BOSS[1]); });
  await pa.waitForTimeout(150);
  await pa.screenshot({ path: path.join(OUT, 'phone-boss2.png') });
  await pa.evaluate(() => { const r = __kit.run(); r.w.boss.phase = 2; SL.loadBoard(r, SL.BOSS[2]); });
  for (const [hp, name] of [[3, 'full'], [2, 'crack1'], [1, 'crack2']]) {
    await pa.evaluate(k => { const r = __kit.run(); r.w.boss.chamber = k / 3; r.w.S = Object.assign({}, r.w.S, { hp: [k] }); }, hp);
    await pa.waitForTimeout(80);
    await pa.screenshot({ path: path.join(OUT, 'phone-boss-' + name + '.png') });
  }
  await pa.evaluate(() => { __kit.title(); });
  await ca.close();
  const { page: pb, ctx: cb } = await h.open('phone');
  await pb.evaluate(() => __kit.jump(16, { talk: true, fair: true }));
  await pb.waitForTimeout(300);
  await pb.screenshot({ path: path.join(OUT, 'phone-talk-vasch.png') });
  await cb.close();
  const { page: pd, ctx: cd } = await h.open('short');
  await pd.evaluate(() => { __kit.jump(15, { fair: true }); });
  await pd.waitForTimeout(150);
  await pd.screenshot({ path: path.join(OUT, 'short-play16.png') });
  await pd.evaluate(() => { const r = __kit.run(); r.say('ione', 'It came up on my wrist too. Fascinating. Ow.', 30); r.w.sayT = 30; });
  await pd.waitForTimeout(150);
  await pd.screenshot({ path: path.join(OUT, 'short-say.png') });
  await cd.close();
  console.log('     screenshots: ' + OUT);

  await h.close();
  finish('review shots', h.errors);
})().catch(e => { console.error(e); process.exit(1); });
