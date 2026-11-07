// Tide Gap: one frame of play, and the title's moving background. Drawing only: nothing in the run changes here.
window.TG = window.TG || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  TG.render = function (ctx, run, view) {
    const w = run.w, d = w.dive, under = d.state !== 'up';
    TG.drawSea(ctx, run, view);
    TG.drawBands(ctx, run);
    TG.drawItems(ctx, run, true);
    TG.drawMopUnder(ctx, w);
    // Vesh runs under the rocks: he's deep water's animal, and his lamps show him going in and out. The hull runs under them only on a Dive.
    const pts = TG.drawVesh(ctx, run, under);
    if (under) { TG.drawTow(ctx, w, pts); TG.drawShip(ctx, run); }
    TG.drawRocks(ctx, run, view);
    TG.drawWalls(ctx, run, view);
    TG.drawItems(ctx, run, false);
    if (!under) { TG.drawTow(ctx, w, pts); TG.drawShip(ctx, run); }
    TG.drawBobbin(ctx, w, run.time);
    TG.drawDrops(ctx, run);
    if (under) { // the world over a Dive goes the colour of deep water
      ctx.fillStyle = 'rgba(8,36,66,' + (d.state === 'down' ? 0.32 : 0.16) + ')';
      ctx.fillRect(view.left, view.top, view.right - view.left, view.bottom - view.top);
    }
    TG.drawCutter(ctx, run);
    TG.drawLances(ctx, run, view);
    TG.drawFog(ctx, run, view);
    TG.drawLampGlow(ctx, run, pts);
    if (run.stage.fog) TG.drawVeshOverFog(ctx, run, pts);
    // "Vesh. Bite her boat." The last plate goes and the whole length of him comes up over the hull.
    if (w.boss && w.boss.state === 'fall') { TG.drawVesh(ctx, run, false); TG.drawTow(ctx, w, pts); TG.drawShip(ctx, run); }
    TG.drawSense(ctx, run, view);
    TG.drawRain(ctx, run, view);
  };

  // ---- The title: the Gaptooth picture from the homepage, with the sea below it and Vesh hauling the ship up the screen. If the picture fails, the code sea stays.
  let pic = null, picTried = false;
  function picture() {
    if (!picTried) { picTried = true; const im = new Image(); im.onload = () => { pic = im; }; im.src = Kit.url('art/site/gaptooth-v1-web.webp'); }
    return pic;
  }
  const fakeRun = (t, view) => {
    const w = fake.w; w.dist = t * 60; w.shipYNow = view.bottom - 96; w.tow = 150;
    for (let i = 0; i < w.trail.length; i++) w.trail[i] = 200 + Math.sin(t * 0.7 - i * 0.04) * 50;
    w.shipX = w.trail[8]; w.headX = w.trail[0];
    fake.time = t;
    return fake;
  };
  const fake = { stage: { look: 0 }, time: 0, carry: { rows: [{}, {}, {}, {}, {}, {}], lost: [], sparesUsed: 0 }, up: () => 0, w: { dist: 0, speed: 100, trail: new Array(90).fill(180), dive: { state: 'up', t: 0 }, windup: 0, hurtT: 0, inv: 0, lean: 0, hullMax: 3, hullLeft: 3, items: [], bands: [], rocks: [] } };

  // The picture with its lower part faded out to nothing, so it melts into whatever is under it, sea or cliff, with no edge. Made once per screen size.
  let faded = null, fadedKey = '';
  function fadedPicture(im, W, h, k) {
    const key = [W, h, k].join();
    if (faded && fadedKey === key) return faded;
    fadedKey = key;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * k); cv.height = Math.ceil(h * k);
    const c = cv.getContext('2d'), scale = Math.max(cv.width / im.naturalWidth, cv.height / im.naturalHeight), iw = im.naturalWidth * scale, ih = im.naturalHeight * scale;
    c.drawImage(im, (cv.width - iw) / 2, (cv.height - ih) / 2, iw, ih);
    c.globalCompositeOperation = 'destination-in';
    const g = c.createLinearGradient(0, 0, 0, cv.height);
    g.addColorStop(0, '#000'); g.addColorStop(0.62, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, cv.width, cv.height);
    return (faded = cv);
  }

  TG.titleDraw = function (ctx, view, t) {
    const r = fakeRun(t, view);
    TG.drawSea(ctx, r, view);
    TG.drawWalls(ctx, r, view);
    const pts = TG.drawVesh(ctx, r, false);
    TG.drawTow(ctx, r.w, pts);
    TG.drawShip(ctx, r);
    const im = picture(), W = view.right - view.left;
    if (im) {
      const h = Math.min(330, (view.bottom - view.top) * 0.5);
      ctx.drawImage(fadedPicture(im, W, h, view.scale), view.left, view.top, W, h);
    }
    ctx.fillStyle = 'rgba(12,16,38,.1)';
    ctx.fillRect(view.left, view.top, W, view.bottom - view.top);
  };
})();
