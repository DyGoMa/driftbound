// Kit demo: the smallest whole game on the kit. Tap to jump over troopers until the distance runs out.
// It exists to test the kit (tools/smoke.js kit-demo) and for builders to copy from. It is not on the public site.
const TALL = location.search.includes('tall');   // ?tall tries the other shape: upright, many levels in sets, no endless (as Split Light will use)
const tallStages = () => Array.from({ length: 16 }, (_, i) => ({ name: 'Level ' + (i + 1), set: 'Set ' + (Math.floor(i / 5) + 1), length: 11, gap: [1.2, 1.6], boss: i === 15 }));
Kit.start(Object.assign({
  id: 'kit-demo', title: 'Kit Demo', island: 'Test deck', tagline: 'The smallest whole game on the shared kit.',
  orientation: 'landscape',
  endless: true,
  stages: [
    { name: 'First hop', length: 16, gap: [1.6, 2.4], talk: [{ who: 'kaito', text: 'Troopers on the deck. Do I jump them or punch them?' }, { who: 'sela', text: 'Jump, pup. Your fists write cheques your face has to cash.' }] },
    { name: 'A bit quicker', length: 18, gap: [1.3, 2.1], talk: [{ who: 'juno', text: 'Two to one you trip on the next one.' }] },
    { name: 'A question', length: 18, gap: [1.2, 2], ask: true, talk: [{ who: 'bram', text: 'Eat something first.' }] },
    { name: 'Dusk', length: 20, gap: [1.1, 1.8], talk: [{ who: 'ione', text: 'Statistically you are still alive. I would not get attached to that.' }] },
    { name: 'The big one', length: 24, gap: [1, 1.5], boss: true, talk: [{ who: 'silt', text: '...' }, { who: 'kaito', text: 'Oh, good. He brought his mask.' }] },
  ],
  endlessStage: { name: 'Endless', length: Infinity, gap: [0.9, 1.5] },
  ending: [{ who: 'sela', text: 'That is the demo. Nothing here is story.' }, { who: 'kaito', text: 'Can I go again?' }],
  endingCard: { title: 'DEMO CLEAR', text: 'The whole flow ran: title, stages, talk, boss, ending, endless.' },
  loseLines: [{ who: 'sela', text: 'Up you get, pup.' }, { who: 'juno', text: 'Pay up, I had money on that.' }, { who: 'silas', text: 'Darling, the idea is to go over them.' }],
  upgrades: [
    { id: 'spring', name: 'Spring Boots', blurb: 'Jump a little higher.' },
    { id: 'pull', name: 'Salvage Pull', blurb: 'More salvage from every pickup.' },
    { id: 'grit', name: 'Grit', blurb: 'One more hit per stage at level 3.' },
  ],
  palLines: { fizzlet: { who: 'kaito', text: 'It sneezed on me. I think we are friends now.' } },
  music: { bpm: 132, root: 50, scale: 'minor', bass: '0 . 0 . 0 . 3 . 5 . 5 . 3 . 2 .', lead: '7 . . 9 . 7 . 5 . . 7 . 5 3 . .', drums: 'k h h h s h k h k h h h s h h h' },
  test: { maxSeconds: 120 },

  init(run) {
    const T = TUNE;
    run.w = { y: T.groundY, vy: 0, air: false, lives: T.lives + (run.up('grit') >= 3 ? 1 : 0), foes: [], coins: [], next: 1.4, hit: 0, asked: false };
  },

  update(dt, run, input) {
    const T = TUNE, w = run.w, len = run.stage.length;
    if (input.pressed && !w.air) {
      w.vy = -(T.jumpSpeed + run.up('spring') * 20); w.air = true;
      Kit.audio.play('jump');
    }
    w.vy += T.gravity * dt; w.y += w.vy * dt;
    if (w.y >= T.groundY) { if (w.air) Kit.audio.play('land'); w.y = T.groundY; w.vy = 0; w.air = false; }
    if (w.hit > 0) w.hit -= dt;

    w.next -= dt;
    if (w.next <= 0) {
      w.next = run.range(run.stage.gap[0], run.stage.gap[1]);
      w.foes.push({ x: Kit.view.right + 30 });
      if (run.rng() < 0.6) w.coins.push({ x: Kit.view.right + 90, y: T.groundY - 70 - run.rng() * 60 });
    }
    for (const f of w.foes) {
      f.x -= T.scroll * dt;
      if (!f.done && Math.abs(f.x - T.playerX) < 18 && w.y > T.groundY - 62 && w.hit <= 0) {
        f.done = true; w.hit = 0.8; w.lives--;
        Kit.art.shake(6); Kit.art.burst(T.playerX, w.y - 40, { color: '#f0752b', n: 14 }); Kit.audio.play('hurt');
        if (w.lives <= 0) { run.lose(); return; }
      } else if (!f.done && f.x < T.playerX - 18) { f.done = true; run.addScore(10); }
    }
    w.foes = w.foes.filter(f => f.x > Kit.view.left - 40);
    for (const c of w.coins) {
      c.x -= T.scroll * dt;
      if (!c.got && Math.abs(c.x - T.playerX) < 22 && Math.abs(c.y - (w.y - 40)) < 46) {
        c.got = true; run.addSalvage(T.salvagePerPickup + run.up('pull')); Kit.art.floatText(c.x, c.y, '+' + T.salvagePerPickup); Kit.audio.play('pickup');
      }
    }
    w.coins = w.coins.filter(c => !c.got && c.x > Kit.view.left - 20);

    if (run.stage.ask && !w.asked && run.time > 6) {
      w.asked = true;
      run.say('juno', 'Double or nothing?', 2);
      run.ask({ title: 'A BET', text: 'Double your salvage or leave it?', options: [{ label: 'Leave it', value: 0 }, { label: 'Double it', blurb: 'Just this once', value: 1 }] }, o => { if (o.value) run.addSalvage(run.salvage); });
      return;
    }
    if (!run.endless) {
      w.testInfo = { lives: w.lives };
      if (run.time >= len) { run.addSalvage(T.salvagePerClear); Kit.art.burst(T.playerX, w.y - 50, { n: 20 }); run.win(); }
    }
  },

  render(c, run, view) {
    const T = TUNE, w = run.w, A = Kit.art;
    A.duskSky(c, view, run.time);
    A.island(c, view.left + 70, 150, 120, 60, { seed: 2 });
    A.island(c, view.right - 210, 110, 170, 70, { seed: 3, top: '#4b4f63' });
    c.fillStyle = '#3a2f4f'; c.fillRect(view.left, T.groundY, view.right - view.left, view.bottom - T.groundY);
    A.line(c, view.left, T.groundY, view.right, T.groundY, 3);
    for (const co of w.coins) A.salvage(c, co.x, co.y, 9, run.time * 3);
    for (const f of w.foes) A.personFast(c, 'trooper', { x: f.x, y: T.groundY, h: 70, pose: 'walk', t: run.time + f.x * 0.01, flip: true });
    const pose = w.hit > 0.5 ? 'hurt' : w.air ? 'jump' : 'run', h = A.heightOf('kaito', 0.42);
    if (!A.draw(c, 'missing_on_purpose', 0, T.playerX, w.y, h)) A.person(c, 'kaito', { x: T.playerX, y: w.y, h, pose, t: run.time });
    if (!run.endless) A.bar(c, view.w / 2 - 80, 40, 160, 10, run.time / run.stage.length, A.GOLD);
    for (let i = 0; i < w.lives; i++) A.circle(c, view.w - 90 - i * 18, 24, 6, A.ORANGE);
  },

  // Plays with the same input a thumb has: press to jump.
  bot(run, input) {
    const w = run.w, T = TUNE;
    const near = w.foes.find(f => !f.done && f.x > T.playerX && f.x - T.playerX < T.botJumpAt);
    if (near && !w.air) input.sim.tap(T.playerX, 100);
  },
  botAsk() { return 1; },
}, TALL ? { id: 'kit-demo-tall', orientation: 'portrait', endless: false, stages: tallStages() } : {}));
