// Tiny synth sound effects (no audio files). Starts after the first tap, as browsers require.
(function () {
  let ac = null, muted = false;
  try { muted = localStorage.getItem('hoshi-muted') === '1'; } catch (e) {}
  function tone(f1, f2, dur, type, vol) {
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(), n = ac.currentTime;
      o.type = type; o.frequency.setValueAtTime(f1, n); o.frequency.exponentialRampToValueAtTime(f2, n + dur);
      g.gain.setValueAtTime(vol, n); g.gain.exponentialRampToValueAtTime(0.0001, n + dur);
      o.connect(g).connect(ac.destination); o.start(n); o.stop(n + dur);
    } catch (e) {}
  }
  window.SFX = {
    jump: () => tone(420, 760, 0.14, 'square', 0.06),
    jump2: () => tone(620, 1100, 0.14, 'square', 0.06),
    shard: () => { tone(1320, 1760, 0.08, 'triangle', 0.08); setTimeout(() => tone(1760, 2200, 0.1, 'triangle', 0.06), 60); },
    hit: () => tone(300, 50, 0.45, 'sawtooth', 0.1),
    toggle: () => { muted = !muted; try { localStorage.setItem('hoshi-muted', muted ? '1' : '0'); } catch (e) {} return muted; },
    isMuted: () => muted,
  };
})();
