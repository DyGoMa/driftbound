// Split Light: one step of play. Thumb and keys in, then the beam, the clock, the pals. Also where the buttons are, since a tap has to find them.
window.SL = window.SL || {};
(function () {
  const T = TUNE, AU = () => Kit.audio;

  // The bottom row's height: taller on short screens, where the scale would take it under the 44 px rule.
  SL.rowH = () => Math.max(T.buttonRowH, Math.min(T.buttonRowMax, T.buttonRowCss / Kit.view.scale));

  // The buttons, with where they are. The first row is FIRE beside Ione; under it, Retry and any upgrade buttons.
  SL.buttons = function (run) {
    const w = run.w, L = w.L, boss = !!w.boss, room = (boss ? T.bossRows : T.rows) * T.cell;
    const rowH = SL.rowH(), panelY = T.top + room + T.hudH + T.panelGap, rowY = T.screenBottom - rowH, list = [];
    const dead = w.dead;
    if (boss) list.push({ id: 'fire', label: 'FIRE', x: T.bossFireX, y: panelY, w: T.bossFireW, h: rowY - panelY - T.fireRowGap, on: SL.canFire(w), main: !dead });
    else list.push({ id: 'fire', label: 'FIRE', x: T.fireX, y: panelY, w: T.fireW, h: rowY - panelY - T.fireRowGap, on: SL.canFire(w), main: !dead, pulse: run.index === 0 && w.touched && !w.boardFired });
    const row = [{ id: 'retry', label: !boss ? 'RETRY' : w.resetArm > 0 ? 'AGAIN: -1 NERVE' : 'RESET', on: !boss || w.boardFired > 0, main: dead, lit: w.resetArm > 0 }];
    if (w.undoTotal) row.push({ id: 'undo', label: 'UNDO ' + w.undos, on: w.undos > 0 && w.history.length > 0 });
    if (w.scrapeTotal) row.push({ id: 'scrape', label: 'SCRAPE ' + w.scrapes, on: w.scrapes > 0 && w.S.g.length > 0 && w.S.shots > 0, lit: w.scraping });
    const x0 = boss ? T.bossRowX0 : T.rowX0, x1 = boss ? T.bossRowX1 : T.rowX1, gap = T.rowGap, bw = (x1 - x0 - gap * (row.length - 1)) / row.length;
    row.forEach((b, i) => list.push(Object.assign(b, { x: x0 + i * (bw + gap), y: rowY, w: bw, h: rowH })));
    return list;
  };
  const inside = (b, x, y) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  SL.buttonAt = (run, x, y) => SL.buttons(run).find(b => inside(b, x, y)) || null;

  // What a thumb at (x, y) is on: a pal first, then a button, then a cell.
  function targetAt(run, x, y) {
    const w = run.w;
    if (w.pal && Math.hypot(x - w.pal.x, y - (w.pal.y - T.palTapUp)) < T.palRadius) return 'pal';
    const b = SL.buttonAt(run, x, y);
    if (b) return 'b:' + b.id;
    const c = SL.cellOf(run, x, y);
    return c >= 0 ? 'c:' + c : null;
  }
  function act(run, t) {
    const w = run.w;
    if (!t) return;
    if (t === 'pal') { SL.palTapped(run); return; }
    if (t[0] === 'c') { SL.tapCell(run, +t.slice(2)); return; }
    const b = SL.buttons(run).find(x => 'b:' + x.id === t);
    if (!b) return;
    if (!b.on) { AU().play('denied'); return; }
    if (b.id === 'fire') SL.fire(run);
    else if (b.id === 'retry') {
      // Reset costs nerve, and it sits right under FIRE. It asks twice, so a slip can't cost anything. One tap only on a dead board with nothing else left to try.
      const stuck = w.dead && !(w.undos > 0 && w.history.length) && !(w.scrapes > 0 && w.S.g.length && w.S.shots > 0);
      if (w.boss && !stuck && !(w.resetArm > 0)) { w.resetArm = T.resetConfirmSecs; AU().play('tap'); return; }
      w.resetArm = 0;
      SL.retry(run);
    }
    else if (b.id === 'undo') SL.undo(run);
    else if (b.id === 'scrape') { w.scraping = !w.scraping; AU().play('tap'); }
  }

  // A real press-and-release button: a slow thumb still counts, and sliding off cancels. A quick tap arrives as press and release in one step.
  function thumb(run, input) {
    const w = run.w, busy = SL.busy(w);
    if (w.kb) { if (input.released) { w.kb = false; w.press = null; } return false; }
    let skip = false;
    if (input.released && !input.pressed) {
      if (w.press && !busy && targetAt(run, input.x, input.y) === w.press) act(run, w.press);
      w.press = null;
    }
    if (input.pressed) {
      if (w.beam) skip = true;   // a tap during the beam hurries it along
      const t = targetAt(run, input.startX, input.startY);   // where the thumb landed, even if a slide arrived in the same step
      if (input.down) w.press = busy ? null : t;
      else { w.press = null; if (!busy && t === targetAt(run, input.x, input.y)) act(run, t); }
    }
    if (input.pressed) w.cursor = null;
    return skip;
  }

  // Keys: arrows move a cursor over the board, Space or Enter turns what's under it (or fires, with no cursor), F fires, R retries, U undoes, X scrapes.
  function keys(run, input) {
    const w = run.w, L = w.L;
    const move = (dx, dy) => {
      if (!w.cursor) { w.cursor = { x: Math.floor(L.cols / 2), y: Math.floor(L.rows / 2) }; AU().play('tap'); return; }
      w.cursor.x = Math.max(0, Math.min(L.cols - 1, w.cursor.x + dx));
      w.cursor.y = Math.max(0, Math.min(L.rows - 1, w.cursor.y + dy));
      AU().play('tap');
    };
    if (input.keyPressed('ArrowLeft') || input.keyPressed('KeyA')) move(-1, 0);
    if (input.keyPressed('ArrowRight') || input.keyPressed('KeyD')) move(1, 0);
    if (input.keyPressed('ArrowUp') || input.keyPressed('KeyW')) move(0, -1);
    if (input.keyPressed('ArrowDown') || input.keyPressed('KeyS')) move(0, 1);
    if (input.keyPressed('Space') || input.keyPressed('Enter')) {
      w.kb = true;   // the kit also counts these as a thumb press: this keeps it from landing on whatever was tapped last
      if (w.pal) SL.palTapped(run);
      else if (w.cursor) { if (!SL.busy(w)) SL.tapCell(run, w.cursor.y * L.cols + w.cursor.x); }
      else if (SL.canFire(w)) SL.fire(run);
      else AU().play('denied');
    }
    if (SL.busy(w)) return;
    if (input.keyPressed('KeyF')) act(run, 'b:fire');
    if (input.keyPressed('KeyR')) act(run, 'b:retry');
    if (input.keyPressed('KeyU')) act(run, 'b:undo');
    if (input.keyPressed('KeyX')) act(run, 'b:scrape');
  }

  // Rails on a clock. It stops while the beam is in the air and when the board is dead.
  function stepClock(run, dt) {
    const w = run.w, L = w.L;
    if (L.mode !== 'clock' || w.beam || w.dead || run.over || !SL.alive(w.S)) return;
    w.clockT += dt;
    if (!w.warned && w.clockT >= L.clock - T.warnSecs) { w.warned = true; AU().play('tick'); }
    if (w.warned) { const before = (w.clockT - dt) * T.warnTicksPerSec, now = w.clockT * T.warnTicksPerSec; if (Math.floor(before) !== Math.floor(now)) AU().play('tick'); }
    if (w.clockT >= L.clock) {
      w.clockT = 0; w.warned = false;
      w.fromTick = w.S.tick; w.slideT = 0;
      const had = w.S.g;
      w.S = SL.waited(L, w.S);
      AU().play('rail');
      SL.noteCrush(run, had, w.S);
      if (w.ghost) w.ghost.stale = true;
    }
  }

  SL.step = function (run, dt, input) {
    const w = run.w;
    w.sayT = Math.max(0, w.sayT - dt);
    w.wince = Math.max(0, w.wince - dt);
    w.slideT += dt;
    w.sinceShot += dt;
    Object.keys(w.turnT).forEach(k => { const v = w.turnT[k]; if (v > 0) w.turnT[k] = Math.max(0, v - dt); else if (v < 0) w.turnT[k] = Math.min(0, v + dt); });
    Object.keys(w.growT).forEach(k => { w.growT[k] = Math.max(0, w.growT[k] - dt); });
    Object.keys(w.popT).forEach(k => { w.popT[k] = Math.max(0, w.popT[k] - dt); });
    Object.keys(w.flashCore).forEach(k => { w.flashCore[k] = Math.max(0, w.flashCore[k] - dt); });
    if (w.corrected) { w.corrected.t -= dt; if (w.corrected.t <= 0) w.corrected = null; }
    if (w.resetArm > 0) w.resetArm = Math.max(0, w.resetArm - dt);
    if (w.sayQ) { w.sayQ.t -= dt; if (w.sayQ.t <= 0) { const q = w.sayQ; w.sayQ = null; SL.sayFrom(run, q.pool, q.key); } }
    if (w.gap > 0) { w.gap -= dt; if (w.gap <= 0) SL.bossGapDone(run); return; }
    keys(run, input);
    const skip = thumb(run, input);
    if (w.beam) SL.stepBeam(run, dt, skip);
    stepClock(run, dt);
    SL.stepPals(run, dt);
    if (w.boss) SL.bossStep(run, dt);
  };
})();
