// Extra checks for tools/smoke.js: real touch and keys, sound, upgrades, the catch moment, choices, hidden tab, and a read-through of the game's def.
const path = require('path');

// A real tap on the canvas reaches the game, in game coordinates. Space too, on a computer.
async function inputChecks(page, check, label, size) {
  await page.evaluate(() => { __kit.bot(false); __kit.jump(0); });
  await page.waitForTimeout(120);
  const before = await page.evaluate(() => Kit.input.presses);
  const x = size.w / 2, y = size.h / 2;
  if (size.touch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
  await page.waitForTimeout(150);
  const after = await page.evaluate(() => ({ n: Kit.input.presses, x: Kit.input.x, y: Kit.input.y, w: Kit.view.w, h: Kit.view.h }));
  check(after.n > before, `${label}: a real ${size.touch ? 'touch' : 'click'} reaches the game (presses ${before} to ${after.n})`);
  check(Math.abs(after.x - after.w / 2) < 3 && Math.abs(after.y - after.h / 2) < 3, `${label}: the tap lands where it should (${after.x.toFixed(1)}, ${after.y.toFixed(1)} of ${after.w} x ${after.h})`);
  if (!size.touch) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(150);
    check((await page.evaluate(() => Kit.input.presses)) > after.n, `${label}: Space counts as the thumb`);
    await page.keyboard.press('KeyP');
    check((await page.evaluate(() => __kit.state().screen)) === 'paused', `${label}: P pauses`);
    await page.keyboard.press('KeyP');
  }
  const css = await page.evaluate(() => getComputedStyle(Kit.canvas).touchAction);
  check(css === 'none', `${label}: canvas blocks browser zoom and scroll (touch-action ${css})`);
}

// Nothing plays before a tap; a tap starts it; every effect plays without error; mute is remembered.
async function soundChecks(page, check, label, base) {
  const fresh = await page.context().newPage();
  await fresh.goto(base, { waitUntil: 'domcontentloaded' });
  await fresh.waitForFunction(() => window.__kit, null, { timeout: 8000 });
  await fresh.waitForTimeout(200);
  check(!(await fresh.evaluate(() => Kit.audio.running())), `${label}: no sound before the first tap`);
  await fresh.close();

  await page.evaluate(() => __kit.title());
  const btn = page.locator('[data-kit="sound"]').first();
  await btn.click();
  check(await page.evaluate(() => DriftSave.getSetting('mute', false) === true && Kit.audio.isMuted()), `${label}: Sound button mutes and saves it`);
  await btn.click();
  check(await page.evaluate(() => DriftSave.getSetting('mute', true) === false), `${label}: Sound button unmutes`);
  await page.waitForTimeout(100);
  check(await page.evaluate(() => Kit.audio.running()), `${label}: sound is running after a tap`);
  const n = await page.evaluate(() => { const names = Kit.audio.names(); names.forEach(x => Kit.audio.play(x)); return names.length; });
  check(n > 20, `${label}: all ${n} effects play with no error`);
}

// Buying spends the balance only, and the No-upgrades switch turns upgrades off.
async function upgradeChecks(page, check, label, gameId) {
  await page.evaluate(() => __kit.title());
  await page.evaluate(() => { const d = DriftSave.load(); DriftSave.finishRun('smoke-bank', 0, 500); return d; });
  await page.locator('[data-kit="upgrades"]').click();
  const buy = page.locator('[data-up]:not([disabled])').first();
  if (await buy.count() === 0) { check(false, `${label}: an upgrade can be bought`); await page.evaluate(() => __kit.title()); return; }
  const id = await buy.getAttribute('data-up');
  const a = await page.evaluate(() => DriftSave.load());
  await buy.click();
  const b = await page.evaluate(() => DriftSave.load());
  check(b.salvage < a.salvage && b.lifetime === a.lifetime, `${label}: buying lowers the balance only (${a.salvage} to ${b.salvage}, lifetime ${b.lifetime})`);
  check(b.games[gameId].upgrades[id] === 1, `${label}: the upgrade went to level 1`);
  await page.locator('[data-kit="back"]').click();
  const seen = await page.evaluate(id => { __kit.jump(0, { fair: false }); return __kit.run().up(id); }, id);
  check(seen === 1, `${label}: a normal run sees the upgrade`);
  await page.evaluate(() => __kit.title());
  await page.locator('[data-kit="fair"]').click();
  const off = await page.evaluate(id => { __kit.jump(0); return { lvl: __kit.run().up(id), fair: __kit.run().fair }; }, id);
  check(off.lvl === 0 && off.fair, `${label}: the No-upgrades switch turns it off`);
  await page.evaluate(() => __kit.title());
  await page.locator('[data-kit="fair"]').click();
}

// Choices between waves, small talk boxes, the catch moment, and a hidden tab.
async function momentChecks(page, check, label, gameId, shot) {
  await page.evaluate(() => { __kit.bot(false); __kit.jump(0); window.__picked = null;
    __kit.run().ask({ title: 'A choice', text: 'Pick one.', options: [{ label: 'First', blurb: 'The safe one', value: 1 }, { label: 'Second', value: 2 }] }, o => { window.__picked = o.value; }); });
  check((await page.evaluate(() => __kit.state().screen)) === 'ask', `${label}: a choice stops play and shows`);
  await shot('ask');
  await page.waitForTimeout(500);   // the screen's tap guard
  await page.locator('[data-opt="1"]').click();
  const picked = await page.evaluate(() => ({ v: window.__picked, s: __kit.state() }));
  check(picked.v === 2 && picked.s.active && picked.s.screen === 'play', `${label}: answering it goes back to play`);

  await page.evaluate(() => __kit.run().say('vasch', 'You were always my best work.', 30));
  await page.waitForTimeout(150);
  await shot('say');

  const pal = await page.evaluate(id => { const own = window.DRIFT_PALS ? DRIFT_PALS.byGame(id) : []; return own.length ? own[0].id : 'fizzlet'; }, gameId);
  const first = await page.evaluate(id => __kit.run().catchPal(id), pal);
  check(first && (await page.evaluate(() => __kit.state().screen)) === 'catch', `${label}: catching ${pal} shows the catch moment`);
  await page.waitForTimeout(500);
  await shot('catch');
  await page.locator('[data-kit="catch-ok"]').click();
  const second = await page.evaluate(id => ({ again: __kit.run().catchPal(id), saved: DriftSave.hasPal(id), s: __kit.state().screen }), pal);
  check(!second.again && second.saved && second.s === 'play', `${label}: a pal is saved and caught once only`);

  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  check((await page.evaluate(() => __kit.state().paused)), `${label}: hiding the tab pauses`);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); __kit.title(); });

  // A phone can kill a hidden tab on any screen of a run, so what's earned must be saved during a choice too.
  const banked = await page.evaluate(() => {
    __kit.jump(0); const r = __kit.run(), before = DriftSave.load().salvage;
    r.addSalvage(7); r.ask({ title: 'A choice', options: [{ label: 'First' }] }, () => {});
    Kit.onHidden(); Kit.onVisible();
    const got = DriftSave.load().salvage - before; __kit.title(); return got;
  });
  check(banked === 7, `${label}: a hidden tab during a choice saves what the run earned (${banked} of 7)`);

  // A bond cost lasts the story run: leaving to the menu must not wipe it.
  await page.evaluate(() => { __kit.jump(0); const r = __kit.run(); r.carry.smoke = 1; r.win(0); });
  await page.waitForFunction(() => __kit.state().screen === 'result');
  await page.waitForTimeout(500);   // the screen's tap guard
  await page.locator('[data-kit="menu"]').click();
  await page.locator('[data-kit="story"]').click();
  await page.locator('[data-stage="1"]').click();
  const carried = await page.evaluate(() => { const v = __kit.run().carry.smoke; DriftSave.setStoryCarry(Kit.def.id, null); __kit.title(); return v; });
  check(carried === 1, `${label}: what a run carries survives Menu, Story, next stage`);
}

// Reads the game's def against docs/FRIDAY_BATCH.md. Real games must pass; the demo only gets notes.
async function lint(page, gameId, strict, check, note) {
  const d = await page.evaluate(id => {
    const def = Kit.def, pals = window.DRIFT_PALS ? DRIFT_PALS.byGame(id) : [];
    return { stages: def.stages.length, boss: def.stages.filter(s => s.boss).length, lastBoss: !!(def.stages[def.stages.length - 1] || {}).boss,
      talk: def.stages.map(s => (s.talk || []).length), ending: (def.ending || []).length, lose: (def.loseLines || []).length, ups: (def.upgrades || []).length,
      endless: def.endless !== false, music: !!def.music, pals: pals.map(p => p.id), palLines: Object.keys(def.palLines || {}), bot: !!def.bot, titleSet: !!def.title && !!def.island };
  }, gameId);
  const say = strict ? check : (ok, what) => note((ok ? 'ok   ' : 'would fail for a real game: ') + what);
  say(d.lastBoss && d.boss >= 1, `def: the last of ${d.stages} stages is the boss`);
  say(d.stages >= 5, `def: at least 5 stages (${d.stages})`);
  // A puzzle game with many levels talks before each set, not each level.
  const talks = d.stages > 8 ? d.talk.filter(n => n > 0) : d.talk;
  say(talks.length > 0 && talks.every(n => n >= 2 && n <= 4), `def: 2 to 4 talk lines before each ${d.stages > 8 ? 'set' : 'stage'} (${d.talk.join(', ')})`);
  say(d.ending >= 2, `def: an ending scene (${d.ending} lines)`);
  say(d.lose >= 3, `def: varied lose lines (${d.lose})`);
  say(d.ups === 3, `def: 3 upgrades (${d.ups})`);
  say(d.music, 'def: has a music loop');
  say(d.pals.length === 2 && d.pals.every(p => d.palLines.includes(p)), `def: a crew line for both pals (${d.pals.join(', ') || 'none'}; lines for ${d.palLines.join(', ') || 'none'})`);
  say(d.titleSet, 'def: title and island set');
}

module.exports = { inputChecks, soundChecks, upgradeChecks, momentChecks, lint, path };
