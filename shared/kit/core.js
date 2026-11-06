// Kit core: the fixed-step loop, canvas scaling, pause state, orientation prompt. See README.md in this folder.
// The whole screen is one canvas. Games draw in a fixed logical size (Kit.view.w x h); extra room on odd screens
// shows as Kit.view.left/right/top/bottom, so a game can paint its sky edge to edge and keep play inside w x h.
(function () {
  const here = document.currentScript ? document.currentScript.src : location.href;
  const q = new URLSearchParams(location.search);
  const STEP = 1 / 60;
  const PHONE_SHORT_SIDE = 600;  // PROVISIONAL: the short side (CSS px) below which a device counts as a phone
  const MAX_STEPS = 8;           // catch-up limit per screen frame in normal play

  const Kit = window.Kit = {
    STEP,
    test: q.has('test'),
    seed: Number(q.get('seed')) || 1,
    timeScale: Number(q.get('speed')) || 1,   // whole-game speed; raised by the headless test
    rootUrl: new URL('../../', here).href,
    url(p) { return new URL(p, Kit.rootUrl).href; },
    view: { w: 640, h: 360, left: 0, right: 640, top: 0, bottom: 360, scale: 1, landscape: true },
    active: false,    // true while a run is being stepped
    paused: false,    // the pause menu is up, or the tab is hidden
    blocked: false,   // the phone is held the wrong way
    steps: 0,         // fixed steps run so far
    onStep: null, onDraw: null, onHidden: null, onVisible: null, onBlocked: null,
    canvas: null, ctx: null, root: null,
  };

  let cssW = 1, cssH = 1, dpr = 1, ox = 0, oy = 0, turnEl = null;

  // Builds the screen. Called by Kit.start; a game never calls this itself.
  Kit.mount = function (def) {
    const wide = def.orientation !== 'portrait';
    const v = Kit.view;
    v.w = (def.view && def.view.w) || (wide ? 640 : 360);
    v.h = (def.view && def.view.h) || (wide ? 360 : 640);
    v.landscape = v.w > v.h;

    const root = Kit.root = document.createElement('div');
    root.id = 'kit-root';
    root.className = v.landscape ? 'kit-wide' : 'kit-tall';
    root.innerHTML = '<canvas id="kit-canvas"></canvas><div id="kit-hud"></div><div id="kit-ui"></div>' +
      '<div id="kit-turn" hidden><div class="kit-phone" aria-hidden="true"></div><p>' +
      (v.landscape ? 'Turn your phone sideways' : 'Hold your phone upright') + '</p></div>';
    document.body.appendChild(root);
    document.documentElement.classList.add('kit-page');
    Kit.canvas = root.querySelector('#kit-canvas');
    Kit.ctx = Kit.canvas.getContext('2d');
    turnEl = root.querySelector('#kit-turn');

    Kit.input.bind(Kit.canvas);
    addEventListener('resize', fit);
    addEventListener('orientationchange', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(root);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (Kit.onHidden) Kit.onHidden(); }
      else if (Kit.onVisible) Kit.onVisible();
    });
    addEventListener('pagehide', () => { if (Kit.onHidden) Kit.onHidden(); });
    // No browser zoom, callouts or selection anywhere on a game page.
    document.addEventListener('gesturestart', e => e.preventDefault());
    document.addEventListener('contextmenu', e => { if (e.target === Kit.canvas) e.preventDefault(); });
    fit();
    requestAnimationFrame(t => { last = t; requestAnimationFrame(frame); });
  };

  function fit() {
    const root = Kit.root, v = Kit.view;
    if (!root) return;
    cssW = Math.max(1, root.clientWidth); cssH = Math.max(1, root.clientHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.round(cssW * dpr), bh = Math.round(cssH * dpr);
    if (Kit.canvas.width !== bw) Kit.canvas.width = bw;
    if (Kit.canvas.height !== bh) Kit.canvas.height = bh;
    const s = v.scale = Math.min(cssW / v.w, cssH / v.h);
    ox = (cssW - v.w * s) / 2; oy = (cssH - v.h * s) / 2;
    v.left = -ox / s; v.right = v.w + ox / s; v.top = -oy / s; v.bottom = v.h + oy / s;
    checkTurn();
  }

  function checkTurn() {
    const coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    const phone = Math.min(innerWidth, innerHeight) < PHONE_SHORT_SIDE;
    const wrong = !!coarse && phone && (innerWidth > innerHeight) !== Kit.view.landscape;
    if (wrong && !Kit.blocked && Kit.onBlocked) Kit.onBlocked();   // so turning back opens on the pause menu, not straight into play
    Kit.blocked = wrong;
    if (turnEl) turnEl.hidden = !wrong;
  }

  // Screen position (CSS px, relative to the canvas) to logical game position.
  Kit.toGame = function (cx, cy) { const s = Kit.view.scale; return { x: (cx - ox) / s, y: (cy - oy) / s }; };

  let last = 0, acc = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const real = Math.min(Math.max(0, now - last) / 1000, 0.25);
    last = now;
    if (Kit.active && !Kit.paused && !Kit.blocked) {
      acc += real * Kit.timeScale;
      const max = Kit.test ? 4000 : MAX_STEPS;
      let n = 0;
      while (acc >= STEP && n < max && Kit.active && !Kit.paused) { Kit.steps++; if (Kit.onStep) Kit.onStep(STEP); acc -= STEP; n++; }
      if (n >= max || !Kit.active) acc = 0;
    } else acc = 0;
    draw(real);
  }

  function draw(real) {
    const c = Kit.ctx;
    if (!c || !Kit.onDraw) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = '#0c1026';
    c.fillRect(0, 0, cssW, cssH);
    const s = Kit.view.scale, off = Kit.art.shakeOffset();
    c.setTransform(dpr * s, 0, 0, dpr * s, dpr * (ox + off.x * s), dpr * (oy + off.y * s));
    Kit.onDraw(c, Kit.view, real);
  }
  Kit.drawNow = () => draw(0);
})();
