// Homepage: cabinets, cast cards and lore, all drawn with the shared cast art.
(function () {
  const Cast = HoshiCast, save = HoshiSave.load();
  const CABINETS = [
    { id: 'aki-dash', name: 'Aki Dash', hero: 'aki', blurb: 'One-tap runner', live: true },
    { id: 'mochi-pop', name: 'Mochi Pop', hero: 'mochi', blurb: 'Bubble puzzle' },
    { id: 'one-cut', name: 'One Cut', hero: 'ren', blurb: 'Reflex slicing' },
    { id: 'yuzu-launch', name: "Yuzu's Launcher", hero: 'yuzu', blurb: 'Physics launch' },
    { id: 'glitch-siege', name: 'Glitch Siege', hero: 'glitch', blurb: 'Tower defense' },
    { id: 'static-showdown', name: 'Static Showdown', hero: 'glitch', blurb: 'Final boss' },
  ];
  const CREW = [
    { who: 'aki', line: 'Fastest kid in Hoshimachi. "Full speed!"' },
    { who: 'mochi', name: 'Mochi', line: 'Fox spirit guardian of the arcade. "Kyu!"' },
    { who: 'ren', line: 'Calm swordsman, Aki\'s rival. "...One cut."' },
    { who: 'yuzu', line: 'Inventor of the Dive Rig. "Science time!"' },
    { who: 'glitch', name: 'Glitchlings', line: 'Minions of The Static. They want your shards.' },
  ];
  const LORE = [
    [0, 'The Arcade under the Shrine', 'Below the hilltop shrine sits an arcade where every cabinet holds a tiny living world, powered by Star Shards.'],
    [25, 'Aki: The Fastest Kid in Hoshimachi', 'Aki has never once walked to school. When the first cabinet glitched, she was already running toward it.'],
    [75, 'Mochi: The Guardian Who Fell Asleep', 'Mochi was meant to guard the shards. One long nap later, The Static had slipped out of cabinet #13.'],
    [150, 'Yuzu and the Dive Rig', 'Yuzu built the Dive Rig from a karaoke machine and a rice cooker. It lets the crew jump inside any game.'],
    [300, "Ren's Promise", 'Ren lost a match to Aki years ago and swore not to lose again. Fighting beside her is the next best thing.'],
    [500, 'What The Static Wants', 'The Static is not eating shards out of hunger. It is building something from them, deep inside the last cabinet.'],
  ];

  function sized(cv) { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * d; cv.height = r.height * d; const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return [c, r.width, r.height]; }
  function sky(c, w, h) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a1240'); g.addColorStop(1, '#ff7aa8');
    c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#2b1b3d'; c.fillRect(0, h * 0.82, w, h); }
  function drawWho(c, who, x, y, s, t) {
    if (who === 'mochi') Cast.drawMochi(c, x, y - 22 * s, s * 1.4, t);
    else if (who === 'glitch') { Cast.drawGlitchling(c, x - 14 * s, y, s * 1.1, t, 1); Cast.drawGlitchling(c, x + 18 * s, y, s * 0.8, t, 4); }
    else Cast.drawBust(c, who, x, y, s, t);
  }

  document.getElementById('total').textContent = '★ ' + save.shards + ' Star Shards';
  const cab = document.getElementById('cabinets'), crew = document.getElementById('cast'), live = [];
  for (const g of CABINETS) {
    const el = document.createElement(g.live ? 'a' : 'div'); el.className = 'card' + (g.live ? '' : ' locked');
    if (g.live) el.href = 'games/' + g.id + '/index.html';
    const best = save.games[g.id] ? 'Best ' + save.games[g.id].best : g.blurb;
    el.innerHTML = `<canvas></canvas><div class="info"><b>${g.name}</b><small>${g.live ? best : g.blurb}</small><br>
      <span class="tag ${g.live ? 'live' : 'soon'}">${g.live ? 'PLAY' : 'COMING SOON'}</span></div>`;
    cab.appendChild(el); live.push({ cv: el.querySelector('canvas'), who: g.hero, kind: 'cab' });
  }
  for (const m of CREW) {
    const el = document.createElement('div'); el.className = 'card';
    const name = m.name || Cast.CAST[m.who].name;
    el.innerHTML = `<canvas></canvas><div class="info"><b>${name}</b><small>${m.line}</small></div>`;
    crew.appendChild(el); live.push({ cv: el.querySelector('canvas'), who: m.who, kind: 'crew' });
  }
  document.getElementById('lore').innerHTML = LORE.map(([need, title, body]) => save.shards >= need
    ? `<div><b>${title}</b>${body}</div>` : `<div class="lock"><b>🔒 ${title}</b>Unlocks at ${need} Star Shards (you have ${save.shards}).</div>`).join('');

  const banner = document.getElementById('banner'); let B;
  function resizeAll() { B = sized(banner); for (const L of live) L.s = sized(L.cv); }
  addEventListener('resize', resizeAll); resizeAll();
  function frame(ms) {
    const t = ms / 1000;
    const [bc, bw, bh] = B; sky(bc, bw, bh);
    for (let i = 0; i < 40; i++) { bc.fillStyle = 'rgba(255,255,255,' + (0.4 + Math.sin(t * 2 + i) * 0.3) + ')'; bc.fillRect((i * 97) % bw, (i * 41) % (bh * 0.6), 2, 2); }
    const run = (t * 120) % (bw + 200) - 100;
    const hs = bw < 600 ? 1.6 : 1.9, hx = bw < 600 ? bw * 0.5 : bw * 0.7;
    Cast.drawHero(bc, 'aki', hx + Math.sin(t) * 10, bh * 0.82, hs, t, 'run');
    Cast.drawMochi(bc, hx - 80, bh * 0.35, 1.2, t);
    Cast.drawGlitchling(bc, bw + 60 - run, bh * 0.82, 1.3, t, 2);
    for (const L of live) { const [c, w, h] = L.s; sky(c, w, h);
      drawWho(c, L.who, w / 2, h * (L.kind === 'crew' ? 0.95 : 0.9), h / (L.kind === 'crew' ? 72 : 92), t); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
