// Hot Hand: Juno and the troopers. A person on screen uses a picture when there is one (art/REQUEST.md). The code figure underneath is kept plain and tidy.
window.HH = window.HH || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // Juno as her sheet has her (juno-sheet-v5.png): dark brown bomber, cream fur at the collar and cuffs, white crop top, denim shorts, tall brown boots, black gloves.
  // Set here for this game's page only. The kit's own entry has her jacket olive; see NOTES.md.
  function dress() {
    const j = A().cast.juno;
    if (j.dressed) return;
    Object.assign(j, { dressed: true, jacket: { color: '#55392a', to: -6, gap: -3 }, upper: '#55392a', lower: '#55392a', collar: '#ead9bd', top: '#f2ece0', pants: '#4f7fb5', thigh: '#dba475', shin: '#4a3020', boot: '#4a3020', hand: '#1c1a20', markColor: '#ff8a2a' });
  }

  HH.dressJuno = dress;
  HH.junoH = () => A().heightOf('juno', T.pxPerCm);

  const POSE = {
    calm: t => ({ lean: 0.05, armN: [0.5 + Math.sin(t * 2) * 0.05, 1.2], armF: [0.32, 1.1], legN: [0.3, 0.12], legF: [-0.28, 0.12] }),
    ready: t => ({ lean: 0.12, armN: [0.9 + Math.sin(t * 4) * 0.05, 1.5], armF: [0.55, 1.5], legN: [0.42, 0.28], legF: [-0.36, 0.2] }),
    locked: t => { const s = Math.sin(t * 40) * 0.05; return { lean: 0.32, tilt: 0.1, armN: [0.42 + s, 2.05], armF: [0.28 - s, 2.05], legN: [0.46, 0.5], legF: [-0.3, 0.3] }; },
  };

  function junoState(run) {
    const w = run.w;
    if (run.over === 'lose' || w.hp <= 0) return 'down';
    if (w.lockT > 0) return 'locked';
    if (w.hurtT > 0) return 'hurt';
    if (w.throwT > 0) return 'throw';
    return w.heat >= T.hotAt ? 'hot' : 'idle';
  }
  const KEYS = { idle: 'juno_idle', hot: 'juno_hot', throw: 'juno_throw', locked: 'juno_lock', hurt: 'juno_hurt', down: 'juno_down' };

  // Where a figure's hands are for this pose: the same sums as the kit's figure (figures.js), so the fire sits in the gloves. Returns near hand, far hand.
  function handsOf(p, x, y, h, flip) {
    const sin = Math.sin, cos = Math.cos, k = h / 104, dir = flip ? -1 : 1;
    const leg = l => cos(l[0]) * 25 + cos(l[0] - l[1]) * 25;
    let hy = -52; hy -= (Math.max(hy + leg(p.legN), hy + leg(p.legF)) + 3);
    const lean = p.lean || 0, cx = sin(lean) * 31, cy = hy - cos(lean) * 31;
    const hand = (sx, sy, arm) => {
      const a = arm[0] + lean * 0.5, ex = sx + sin(a) * 16.5, ey = sy + cos(a) * 16.5, b = a + arm[1];
      return [x + dir * (ex + sin(b) * 18.5) * k, y + (ey + cos(b) * 18.5) * k];
    };
    return [hand(cx + cos(lean) * 2.4, cy + sin(lean) * 2.4 + 1, p.armN), hand(cx - cos(lean) * 2.4, cy - sin(lean) * 2.4 + 1, p.armF)];
  }
  function poseOf(state, t, u) {
    if (state === 'throw') return A().POSES.throw(t, u);
    if (state === 'locked') return POSE.locked(t);
    if (state === 'hurt') return A().POSES.hurt(t);
    return state === 'hot' ? POSE.ready(t) : POSE.calm(t);
  }

  HH.drawJuno = function (c, run, x, y) {
    dress();
    const A_ = A(), w = run.w, t = run.time, state = junoState(run), h = HH.junoH(), flip = w.face < 0, key = KEYS[state];
    const u = state === 'throw' ? 1 - w.throwT / T.throwSecs : 0, jolt = state === 'locked' ? Math.sin(t * 60) * 1.2 : 0;
    const heat = w.heat / T.heatMax, tier = HH.tier(w.heat), locked = w.lockT > 0;
    // The heat she's giving off, behind her: the stronger, the wider. It's her bond cost, so it shows on her.
    if ((tier >= 2 || locked) && state !== 'down') { // Fire rising off her, separate tongues, more the hotter she is
      const n = locked ? 7 : tier === 3 ? 6 : 4, cols = locked ? ['#8a1c10', '#c8301a', '#ff6a2a'] : ['#d8401a', '#ff8a2a', '#ffc35a'];
      c.save(); c.globalAlpha = locked ? 0.85 : 0.7;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1), px = x + (u - 0.5) * 44, life = (t * 1.6 + i * 0.37) % 1, base = y - 4 - h * (0.12 + 0.6 * ((i * 0.53) % 1));
        HH.flame(c, px, base - life * 16, (locked ? 26 : 18 + tier * 3) * (1 - life * 0.6), t * 0.7 + i, cols, false);
      }
      c.restore();
    }
    let drew = false;
    if (state === 'throw') drew = A_.draw(c, key, Math.min(2, Math.floor(u * 3)), x + jolt, y, h, flip);
    else if (state === 'down') { if (A_.has(key)) { A_.draw(c, key, 0, x, y, h, flip); drew = true; } }
    else drew = A_.draw(c, key, A_.frameAt(key, t), x + jolt, y, h, flip);
    if (!drew) {
      if (state === 'throw') A_.person(c, 'juno', { x, y, h, pose: 'throw', phase: u, flip });
      else if (state === 'hurt') A_.personFast(c, 'juno', { x, y, h, pose: 'hurt', flip });
      else if (state === 'down') A_.personFast(c, 'juno', { x: x + (flip ? 10 : -10), y, h, pose: 'down', flip: !flip });   // she falls away from the throw, not onto her cover
      else A_.person(c, 'juno', { x: x + jolt, y, h, pose: state === 'locked' ? POSE.locked(t) : state === 'hot' ? POSE.ready(t) : POSE.calm(t), flip });
    }
    if (state === 'down') return;
    // Her mark burns brighter with the heat: the flame feather below her right collarbone.
    const throwFrame = Math.min(2, Math.floor(u * 3)), mp = drew && (state === 'throw' ? T.picMark.throw[throwFrame] : T.picMark[state]), g = 0.3 + heat * 0.7, onPic = !!drew;
    const mx = x + (flip ? -1 : 1) * (mp ? mp[0] * h : 7), my = y - (mp ? mp[1] * h : h * 0.72);
    // A picture has the mark on it already, so it only gets the glow; the code figure gets the shape too.
    if (mp || !onPic) { c.save(); c.globalAlpha = mp ? 0.1 + heat * 0.6 : 0.25 + g * 0.5; A_.circle(c, mx, my, mp ? 2 + heat * 5 : 3 + g * 6, '#ff8a2a', 0); c.restore(); }
    if (!onPic) A_.poly(c, [[mx, my - 4], [mx + 2.6, my - 0.8], [mx + 1.6, my + 2], [mx, my + 4.2], [mx - 1.6, my + 2], [mx - 2.6, my - 0.8]], g > 0.7 ? '#fff2b0' : '#ffb35a', 0.6);
    // Her hands: fire in the gloves. Nothing when she's cold, a lick when warm, a blaze when hot, red and shaking and smoking when locked.
    const spots = drew && (state === 'throw' ? T.picHands.throw[throwFrame] : T.picHands[state]), dir = flip ? -1 : 1;
    const list = state === 'down' ? [] : spots ? spots.map(p => [x + dir * p[0] * h, y - p[1] * h]) : handsOf(poseOf(state, t, u), x + jolt, y, h, flip);
    list.forEach((p, i) => {
      if (locked) {
        HH.flame(c, p[0] + jolt, p[1] + 2, 12, t + i, ['#a02a14', '#d8401a', '#ff8a2a'], false);
        for (let k = 0; k < 3; k++) { const a = ((t * 0.9 + k * 0.33 + i * 0.2) % 1); c.globalAlpha = (1 - a) * 0.6; A_.circle(c, p[0] + (onPic ? dir * 20 : 0) + Math.sin(k * 3 + a * 5) * 7, p[1] - 8 - a * 38, 3 + a * 6, '#6a6470', 0); c.globalAlpha = 1; }
      } else if (tier > 0 || heat > 0.12) {
        const size = (5 + tier * 4 + (tier === 3 ? 3 : 0)) * (onPic ? 0.7 : 1);   // A picture's hands are close under her face; the code figure's aren't
        HH.flame(c, p[0], p[1] + 2, size, t + i * 0.7, tier === 3 ? ['#ffb35a', '#ffe46a', '#ffffff'] : ['#d8401a', '#ff8a2a', '#ffe46a'], tier > 0);
        if (tier >= 2) for (let k = 0; k < 2; k++) { const a = ((t * 1.2 + k * 0.5 + i * 0.3) % 1); c.globalAlpha = (1 - a) * 0.4; A_.circle(c, p[0] + (onPic ? dir * 14 : 0) + Math.sin(k * 3 + a * 6) * 4, p[1] - size - a * 26, 2 + a * 4, '#7a7480', 0); c.globalAlpha = 1; }
      }
    });
  };

  // ---- Troopers
  HH.TROOP_KEYS = { walk: 'trooper_walk', run: 'trooper_run', swing: 'trooper_swing', aim: 'trooper_throw', plate: 'trooper_plate', down: 'trooper_down' };

  function plateShield(c, x, y, h, flip, cracked) {
    const A_ = A(), s = h / 104, dir = flip ? -1 : 1, px = x + dir * 15 * s;
    const pts = [[px - 9 * s, y - h * 0.86], [px + 9 * s, y - h * 0.86], [px + 11 * s, y - h * 0.3], [px, y - h * 0.15], [px - 11 * s, y - h * 0.3]];
    A_.poly(c, pts, '#8c929a', 1.9);
    A_.poly(c, [[px + 2 * s, y - h * 0.86], [px + 9 * s, y - h * 0.86], [px + 11 * s, y - h * 0.3], [px, y - h * 0.15], [px + 2 * s, y - h * 0.3]], '#6d7279', 0);
    A_.poly(c, pts, null, 1.9);
    HH.badge(c, px, y - h * 0.6, 4.6 * s, '#efefe8', '#17181f');
    if (cracked) { A_.line(c, px - 7 * s, y - h * 0.72, px + 2 * s, y - h * 0.58, 1.6, A_.INK); A_.line(c, px + 2 * s, y - h * 0.58, px - 3 * s, y - h * 0.42, 1.6, A_.INK); }
  }
  function hookInHand(c, x, y, s, t) {
    const A_ = A();
    c.save(); c.translate(x, y); c.rotate(t);
    c.beginPath(); c.arc(0, -6 * s, 8 * s, -0.4, Math.PI * 1.1); c.lineWidth = 6.5 * s; c.strokeStyle = A_.INK; c.lineCap = 'round'; c.stroke();
    c.lineWidth = 3.4 * s; c.strokeStyle = '#ffffff'; c.stroke();
    A_.line(c, 0, 2 * s, 0, 12 * s, 3.5 * s, '#17181f');
    c.restore();
  }

  // Draws one trooper of any kind at its place, in its stance.
  HH.drawTrooper = function (c, f, t) {
    trooperBody(c, f, t);
    if (f.flash > 0) { const h = 104 * f.s; HH.flashFigure(c, f.x - h, f.y - h * 1.3, h * 2, h * 1.4, o => trooperBody(o, f, t)); }
  };
  function trooperBody(c, f, t) {
    const A_ = A(), h = 104 * f.s, flip = f.side > 0, x = f.x, y = f.y, wt = t + f.seed;
    const tell = f.state === 'tell', fast = f.type === 'runner';
    if (f.type === 'plate' && A_.has('trooper_plate')) { A_.draw(c, 'trooper_plate', A_.frameAt('trooper_plate', wt), x, y, h, flip); return; }
    if (tell) {
      if (!A_.draw(c, 'trooper_swing', Math.min(1, Math.floor(f.t / T.tellSecs * 2)), x, y, h, flip)) A_.person(c, 'trooper', { x, y, h, pose: 'swing', phase: 0.05 + 0.1 * (f.t / T.tellSecs), flip });
    } else if (f.state === 'wind' || f.state === 'wait') {
      if (!A_.draw(c, 'trooper_throw', f.state === 'wind' ? 0 : 1, x, y, h, flip)) A_.person(c, 'trooper', { x, y, h, pose: 'throw', phase: f.state === 'wind' ? 0.05 + 0.08 * Math.min(1, f.t / T.hookWind) : 0.85, flip });
    } else if (f.state === 'rest') {
      if (!A_.draw(c, 'trooper_swing', 2, x, y, h, flip)) A_.person(c, 'trooper', { x, y, h, pose: 'swing', phase: 0.85, flip });
    } else {
      const key = fast ? 'trooper_run' : 'trooper_walk';
      if (!A_.draw(c, key, A_.frameAt(key, wt), x, y, h, flip)) A_.personFast(c, 'trooper', { x, y, h, pose: fast ? 'run' : 'walk', t: wt, flip });
    }
    if (f.type === 'plate') plateShield(c, x, y, h, flip, f.hp < T.foes.plate.hp);
    if (f.state === 'wind') hookInHand(c, x + (flip ? 13 : -13) * f.s, y - h * 1.03, f.s, wt * 6);
  }
  // How much a foe has left, when it takes more than one good throw: little pips over the head.
  HH.drawPips = function (c, f) {
    if (f.hp <= 1 || f.type === 'cart') return;
    const A_ = A(), b = HH.box(f), n = f.hp, x0 = f.x - (n - 1) * 5, y = b.y0 + 2;
    for (let i = 0; i < n; i++) A_.poly(c, [[x0 + i * 10, y - 4], [x0 + i * 10 + 4, y], [x0 + i * 10, y + 4], [x0 + i * 10 - 4, y]], '#ff8a2a', 1.3);
  };

  // A shooter leaning out of the Long Table's top windows. Shutters swing open; cut off at the sill.
  HH.drawSniper = function (c, f, t) {
    const A_ = A(), wN = T.windows[f.win];
    if (!wN || f.state === 'hide') return;
    const x = wN[0], sill = wN[1], open = f.state === 'shutter' ? 1 - f.t / T.sniperShutter : 1, W = 56, H = 62, top = sill - H;
    A_.poly(c, [[x - W / 2, top], [x + W / 2, top], [x + W / 2, sill], [x - W / 2, sill]], '#d08a3a', 1.6);
    c.save(); c.beginPath(); c.rect(x - W / 2, top, W, H); c.clip();
    const key = 'trooper_lean', h = 92, body = o => { if (!A_.draw(o, key, 0, x, sill + 40, h)) A_.personFast(o, 'trooper', { x, y: sill + 44, h, pose: 'aim', flip: true }); };
    body(c);
    c.restore();
    if (f.flash > 0) HH.flashFigure(c, x - W / 2, top, W, H, body);   // the box stops at the window, as the clip does
    A_.poly(c, [[x - W / 2 - 5, sill], [x + W / 2 + 5, sill], [x + W / 2 + 5, sill + 6], [x - W / 2 - 5, sill + 6]], '#6a5a4a', 1.5);
    const sw = (1 - open) * (W / 2) + 7;
    A_.poly(c, [[x - W / 2 - sw + 7, top], [x - W / 2 + 7 * 0 + (1 - open) * W / 2, top], [x - W / 2 + (1 - open) * W / 2, sill], [x - W / 2 - sw + 7, sill]], '#524036', 1.5);
    A_.poly(c, [[x + W / 2 - (1 - open) * W / 2, top], [x + W / 2 + sw - 7, top], [x + W / 2 + sw - 7, sill], [x + W / 2 - (1 - open) * W / 2, sill]], '#463630', 1.5);
  };

  // Something that has just been killed: down, and on fire. Fades.
  HH.drawCorpse = function (c, b) {
    const A_ = A(), u = b.t / 1.1, h = 104 * b.s;
    c.save(); c.globalAlpha = Math.max(0, 1 - u * u);
    if (b.type === 'hollow') { HH.drawHollowDown(c, b); }
    else if (b.type !== 'cart' && b.type !== 'sniper') { if (!A_.draw(c, 'trooper_down', 0, b.x, b.y, h, b.side > 0)) A_.personFast(c, 'trooper', { x: b.x, y: b.y, h, pose: 'down', flip: b.side > 0 }); }
    if (b.type !== 'cart') { HH.flame(c, b.x - 8 * b.s, b.y - 4, (18 + b.tier * 6) * b.s, b.t + b.seed); HH.flame(c, b.x + 12 * b.s, b.y - 4, (14 + b.tier * 5) * b.s, b.t + b.seed + 2); }
    c.restore();
  };
})();
