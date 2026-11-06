// Kit audio: code-made effects and music. Nothing starts until the first tap. Mute is remembered across games.
(function () {
  let ac = null, master = null, musicBus = null, noiseBuf = null, muted = false, song = null, timer = null, nextAt = 0, stepNo = 0, wanted = null;
  const lastPlayed = {};
  const REPEAT_GAP = 0.03;         // the same effect can't stack closer than this
  const MUSIC_LEVEL = 0.24;        // PROVISIONAL
  const SCALES = { minor: [0, 2, 3, 5, 7, 8, 10], major: [0, 2, 4, 5, 7, 9, 11], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], pent: [0, 3, 5, 7, 10] };

  // An effect is a list of layers. w: wave (or 'noise'); f: [start, end] Hz; d: seconds; v: volume; at: delay.
  const FX = {
    tap: [{ w: 'square', f: [660, 880], d: 0.05, v: 0.12 }],
    back: [{ w: 'square', f: [520, 360], d: 0.07, v: 0.12 }],
    buy: [{ w: 'square', f: [660, 660], d: 0.06, v: 0.16 }, { w: 'square', f: [990, 990], d: 0.09, v: 0.16, at: 0.06 }],
    denied: [{ w: 'sawtooth', f: [170, 130], d: 0.16, v: 0.16 }],
    jump: [{ w: 'square', f: [300, 720], d: 0.12, v: 0.16 }],
    surge: [{ w: 'sawtooth', f: [180, 1400], d: 0.2, v: 0.2 }, { w: 'noise', f: [4000, 4000], d: 0.16, v: 0.12 }],
    land: [{ w: 'noise', f: [500, 300], d: 0.07, v: 0.14 }],
    step: [{ w: 'noise', f: [900, 700], d: 0.03, v: 0.05 }],
    hit: [{ w: 'noise', f: [1800, 500], d: 0.1, v: 0.24 }, { w: 'square', f: [240, 90], d: 0.1, v: 0.14 }],
    hurt: [{ w: 'sawtooth', f: [340, 90], d: 0.26, v: 0.22 }, { w: 'noise', f: [1200, 300], d: 0.14, v: 0.14 }],
    pickup: [{ w: 'triangle', f: [880, 880], d: 0.05, v: 0.18 }, { w: 'triangle', f: [1320, 1320], d: 0.08, v: 0.18, at: 0.05 }],
    throw: [{ w: 'noise', f: [800, 3200], d: 0.14, v: 0.16 }],
    fire: [{ w: 'noise', f: [600, 1800], d: 0.22, v: 0.22 }, { w: 'sawtooth', f: [160, 70], d: 0.2, v: 0.12 }],
    swing: [{ w: 'noise', f: [2600, 700], d: 0.12, v: 0.18 }],
    clang: [{ w: 'square', f: [980, 930], d: 0.2, v: 0.12 }, { w: 'square', f: [1490, 1420], d: 0.14, v: 0.08 }, { w: 'noise', f: [5000, 3000], d: 0.04, v: 0.16 }],
    whoosh: [{ w: 'noise', f: [500, 2600], d: 0.22, v: 0.14 }],
    splash: [{ w: 'noise', f: [1300, 300], d: 0.34, v: 0.22 }],
    dive: [{ w: 'sine', f: [420, 90], d: 0.36, v: 0.24 }, { w: 'noise', f: [900, 200], d: 0.3, v: 0.12 }],
    beam: [{ w: 'sawtooth', f: [1500, 900], d: 0.2, v: 0.12 }, { w: 'sine', f: [2200, 2600], d: 0.2, v: 0.1 }],
    chime: [{ w: 'sine', f: [1568, 1568], d: 0.26, v: 0.16 }, { w: 'sine', f: [2349, 2349], d: 0.3, v: 0.1, at: 0.05 }],
    crack: [{ w: 'noise', f: [4200, 1400], d: 0.08, v: 0.22 }, { w: 'square', f: [1700, 400], d: 0.05, v: 0.08 }],
    alarm: [{ w: 'square', f: [760, 760], d: 0.14, v: 0.16 }, { w: 'square', f: [560, 560], d: 0.14, v: 0.16, at: 0.16 }],
    boom: [{ w: 'sine', f: [150, 34], d: 0.5, v: 0.34 }, { w: 'noise', f: [900, 120], d: 0.4, v: 0.26 }],
    bet: [{ w: 'triangle', f: [420, 420], d: 0.05, v: 0.14 }, { w: 'triangle', f: [560, 560], d: 0.05, v: 0.14, at: 0.07 }, { w: 'triangle', f: [700, 700], d: 0.07, v: 0.14, at: 0.14 }],
    eat: [{ w: 'triangle', f: [240, 320], d: 0.06, v: 0.16 }, { w: 'triangle', f: [240, 360], d: 0.07, v: 0.16, at: 0.11 }],
    growl: [{ w: 'sawtooth', f: [95, 72], d: 0.36, v: 0.2 }, { w: 'noise', f: [300, 160], d: 0.36, v: 0.08 }],
    win: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]].map(n => ({ w: 'square', f: [n[0], n[0]], d: 0.16, v: 0.15, at: n[1] })),
    lose: [[392, 0], [330, 0.14], [262, 0.28]].map(n => ({ w: 'triangle', f: [n[0], n[0] * 0.96], d: 0.2, v: 0.2, at: n[1] })),
    catch: [[784, 0], [988, 0.08], [1175, 0.16], [1568, 0.24], [1175, 0.34], [1568, 0.42]].map(n => ({ w: 'triangle', f: [n[0], n[0]], d: 0.14, v: 0.18, at: n[1] })),
  };

  function setup() {
    if (ac) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      ac = new Ctx();
      master = ac.createGain(); master.gain.value = muted ? 0 : 1; master.connect(ac.destination);
      musicBus = ac.createGain(); musicBus.gain.value = MUSIC_LEVEL; musicBus.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
  }

  function layer(l, dest, when) {
    const t = when + (l.at || 0), g = ac.createGain();
    g.gain.setValueAtTime(l.v, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + l.d);
    g.connect(dest);
    if (l.w === 'noise') {
      const src = ac.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
      const fl = ac.createBiquadFilter(); fl.type = 'bandpass'; fl.Q.value = 1.1;
      fl.frequency.setValueAtTime(l.f[0], t); fl.frequency.exponentialRampToValueAtTime(Math.max(30, l.f[1]), t + l.d);
      src.connect(fl); fl.connect(g); src.start(t, Math.random() * 0.8); src.stop(t + l.d + 0.02);
    } else {
      const o = ac.createOscillator(); o.type = l.w;
      o.frequency.setValueAtTime(l.f[0], t); o.frequency.exponentialRampToValueAtTime(Math.max(20, l.f[1]), t + l.d);
      o.connect(g); o.start(t); o.stop(t + l.d + 0.02);
    }
  }

  // ---- Music: 16 or 32 steps of space-separated tokens. Numbers are scale degrees above root, '.' is a rest.
  const parse = s => (Array.isArray(s) ? s : String(s || '').trim().split(/\s+/)).filter(x => x !== '');
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);
  function degree(sg, d) { const n = sg.scale.length, o = Math.floor(d / n); return sg.root + sg.scale[((d % n) + n) % n] + o * 12; }
  function playStep(sg, i, t) {
    const beat = 60 / sg.bpm / 4, tok = arr => (arr.length ? arr[i % arr.length] : '.');
    const bass = tok(sg.bass), lead = tok(sg.lead), hit = tok(sg.drums);
    if (bass !== '.') { const f = freq(degree(sg, +bass) - 12); layer({ w: sg.bassWave, f: [f, f], d: beat * 1.7, v: 0.5 }, musicBus, t); }
    if (lead !== '.') { const f = freq(degree(sg, +lead) + 12); layer({ w: sg.leadWave, f: [f, f], d: beat * 1.5, v: 0.26 }, musicBus, t); }
    if (hit === 'k' || hit === 'K') layer({ w: 'sine', f: [130, 44], d: 0.12, v: 0.8 }, musicBus, t);
    if (hit === 's' || hit === 'K') layer({ w: 'noise', f: [2200, 1400], d: 0.1, v: 0.45 }, musicBus, t);
    if (hit === 'h') layer({ w: 'noise', f: [7000, 6000], d: 0.03, v: 0.22 }, musicBus, t);
  }
  function schedule() {
    if (!ac || !song || ac.state !== 'running') return;
    while (nextAt < ac.currentTime + 0.25) {
      if (nextAt < ac.currentTime) nextAt = ac.currentTime + 0.02;
      playStep(song, stepNo++, nextAt);
      nextAt += 60 / song.bpm / 4;
    }
  }
  function startSong(m) {
    song = { bpm: m.bpm || 120, root: m.root || 50, scale: SCALES[m.scale] || m.scale || SCALES.minor, bass: parse(m.bass), lead: parse(m.lead), drums: parse(m.drums),
      leadWave: m.leadWave || 'square', bassWave: m.bassWave || 'sawtooth' };
    stepNo = 0; nextAt = ac.currentTime + 0.05;
    if (!timer) timer = setInterval(schedule, 70);
  }

  const Au = Kit.audio = {
    // Called by the kit on the first tap or key press.
    unlock() {
      setup();
      if (!ac) return;
      if (ac.state !== 'running' && ac.resume) ac.resume();
      if (wanted && !song) startSong(wanted);
    },
    play(name) {
      if (!ac || muted || ac.state !== 'running') return;
      const fx = FX[name]; if (!fx) return;
      const now = ac.currentTime;
      if (now - (lastPlayed[name] === undefined ? -1 : lastPlayed[name]) < REPEAT_GAP) return;
      lastPlayed[name] = now;
      fx.forEach(l => layer(l, master, now));
    },
    define(name, layers) { FX[name] = layers; },
    names() { return Object.keys(FX); },
    // music({ bpm, root, scale, bass, lead, drums, leadWave, bassWave }); music(null) stops it. Same song again keeps playing.
    music(m) {
      if (m === wanted) return;
      wanted = m; song = null;
      if (m && ac) startSong(m);
    },
    setMuted(v) {
      muted = !!v;
      if (master) master.gain.value = muted ? 0 : 1;
      if (window.DriftSave) DriftSave.setSetting('mute', muted);
    },
    isMuted: () => muted,
    suspend() { if (ac && ac.state === 'running') ac.suspend(); },
    resume() { if (ac && ac.state === 'suspended') ac.resume(); },
    running: () => !!ac && ac.state === 'running',
    load() { muted = !!(window.DriftSave && DriftSave.getSetting('mute', false)); },
  };

  // iPhones only count some of these as a real tap, so listen for all of them.
  const first = () => Au.unlock();
  ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach(n => addEventListener(n, first, { capture: true }));
})();
