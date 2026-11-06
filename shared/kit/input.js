// Kit input: one thumb at a time (or mouse) plus keyboard, read once per fixed step in logical game coordinates.
// Two thumbs on the glass still work: a new finger becomes the thumb, as a fresh press. When it lifts, a finger still down takes over with no new press.
// Real touches and the test bot go through the same queue, so a bot run proves the real controls work.
// All timing is counted in game steps, so raised test speed changes nothing.
(function () {
  const TAP_SECONDS = 0.28;       // PROVISIONAL: a press shorter than this is a tap
  const TAP_MOVE = 14;            // PROVISIONAL: logical px a tap may wander
  const DOUBLE_SECONDS = 0.32;    // PROVISIONAL: gap allowed between the taps of a double tap
  const DOUBLE_MOVE = 48;         // PROVISIONAL: logical px between those two taps

  const queue = [], keys = new Set(), fresh = new Set();
  let moved = 0, sinceTap = 99, lastTapX = 0, lastTapY = 0, prevX = 0, prevY = 0, thumb = null;
  const fingers = new Map();   // every finger on the glass: id to its last game position, oldest first

  const I = Kit.input = {
    down: false, pressed: false, released: false, tap: false, doubleTap: false,
    x: 0, y: 0, dx: 0, dy: 0, startX: 0, startY: 0, held: 0, axisX: 0, axisY: 0, presses: 0,
    key: code => keys.has(code),
    keyPressed: code => fresh.has(code),
  };

  I._begin = function (dt) {
    sinceTap += dt;
    while (queue.length) {
      const e = queue.shift();
      if (e.t === 'down') {
        I.pressed = true; I.down = true; I.held = 0; moved = 0; I.presses++;
        I.x = I.startX = prevX = e.x; I.y = I.startY = prevY = e.y;
      } else if (e.t === 'takeover') { // the finger still down becomes the thumb: no press, and it can't count as a tap when it lifts
        I.down = true; I.held = 0; moved = TAP_MOVE;
        I.x = I.startX = prevX = e.x; I.y = I.startY = prevY = e.y;
      } else if (e.t === 'move') {
        I.x = e.x; I.y = e.y;
        moved = Math.max(moved, Math.hypot(I.x - I.startX, I.y - I.startY));
      } else if (e.t === 'up') {
        if (!I.down) continue;
        I.released = true; I.down = false;
        if (I.held < TAP_SECONDS && moved < TAP_MOVE) {
          I.tap = true;
          if (sinceTap < DOUBLE_SECONDS && Math.hypot(I.x - lastTapX, I.y - lastTapY) < DOUBLE_MOVE) { I.doubleTap = true; sinceTap = 99; }
          else sinceTap = 0;
          lastTapX = I.x; lastTapY = I.y;
        }
      }
    }
    I.dx = I.x - prevX; I.dy = I.y - prevY; prevX = I.x; prevY = I.y;
    if (I.down && !I.pressed) I.held += dt;
    I.axisX = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    I.axisY = (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0) - (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0);
  };
  I._end = function () {
    I.pressed = I.released = I.tap = I.doubleTap = false;
    I.dx = I.dy = 0;
    fresh.clear();
  };
  // Forget everything: used whenever play starts or resumes, so a menu tap can never leak into the game.
  I.reset = function () {
    queue.length = 0; keys.clear(); fresh.clear(); fingers.clear(); thumb = null;
    I.down = false; I.held = 0; I._end(); sinceTap = 99;
  };

  // What a test bot presses. Same queue as a real thumb.
  I.sim = {
    press(x, y) { queue.push({ t: 'down', x, y }); },
    move(x, y) { queue.push({ t: 'move', x, y }); },
    release() { queue.push({ t: 'up' }); },
    tap(x, y) { queue.push({ t: 'down', x, y }, { t: 'up' }); },
    drag(x, y) { if (I.down) queue.push({ t: 'move', x, y }); else queue.push({ t: 'down', x, y }); },
  };

  I.bind = function (canvas) {
    const at = e => { const r = canvas.getBoundingClientRect(); return Kit.toGame(e.clientX - r.left, e.clientY - r.top); };
    canvas.addEventListener('pointerdown', e => {
      if (thumb !== null) queue.push({ t: 'up' });   // the old thumb's press ends here, and this finger's begins
      thumb = e.pointerId;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointers can't be captured */ }
      const p = at(e);
      fingers.set(e.pointerId, p);
      queue.push({ t: 'down', x: p.x, y: p.y });
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', e => {
      if (!fingers.has(e.pointerId)) return;
      const p = at(e);
      fingers.set(e.pointerId, p);
      if (e.pointerId === thumb) queue.push({ t: 'move', x: p.x, y: p.y });
    });
    const up = e => {
      if (!fingers.delete(e.pointerId) || e.pointerId !== thumb) return;
      queue.push({ t: 'up' });
      thumb = null;
      let left = null;
      for (const [id, p] of fingers) { thumb = id; left = p; }   // the newest finger left on the glass, if any
      if (left) queue.push({ t: 'takeover', x: left.x, y: left.y });
    };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    addEventListener('keydown', e => {
      if (!Kit.active || Kit.paused) return;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      keys.add(e.code); fresh.add(e.code);
      // Space and Enter count as the thumb, pressing where it last was (the middle of the screen at the start).
      if (e.code === 'Space' || e.code === 'Enter') {
        const x = I.x || Kit.view.w / 2, y = I.y || Kit.view.h / 2;
        queue.push({ t: 'down', x, y });
      }
    });
    addEventListener('keyup', e => {
      keys.delete(e.code);
      if (e.code === 'Space' || e.code === 'Enter') queue.push({ t: 'up' });
    });
    addEventListener('blur', () => { keys.clear(); if (I.down) queue.push({ t: 'up' }); fingers.clear(); thumb = null; });
  };
})();
