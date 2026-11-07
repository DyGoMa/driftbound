// Silent Cut: the game's own sound effects, on top of the kit's. Volumes and pitches are looks, not rules.
(function () {
  Kit.audio.define('softstep', [{ w: 'noise', f: [520, 380], d: 0.04, v: 0.035 }]);
  Kit.audio.define('creak', [{ w: 'sawtooth', f: [190, 120], d: 0.22, v: 0.14 }, { w: 'sawtooth', f: [260, 150], d: 0.16, v: 0.08, at: 0.05 }]);
  Kit.audio.define('chain', [{ w: 'noise', f: [5200, 3000], d: 0.05, v: 0.14 }, { w: 'noise', f: [4400, 2600], d: 0.05, v: 0.12, at: 0.05 }, { w: 'noise', f: [3800, 2200], d: 0.05, v: 0.1, at: 0.1 }]);
  Kit.audio.define('cutdown', [{ w: 'noise', f: [1400, 400], d: 0.12, v: 0.2 }, { w: 'sine', f: [160, 70], d: 0.14, v: 0.22 }]);
  Kit.audio.define('glass', [{ w: 'square', f: [3200, 2400], d: 0.05, v: 0.08 }, { w: 'noise', f: [6400, 3800], d: 0.16, v: 0.16 }, { w: 'triangle', f: [2100, 1800], d: 0.2, v: 0.08, at: 0.05 }]);
  Kit.audio.define('windcut', [{ w: 'noise', f: [700, 3600], d: 0.2, v: 0.2 }, { w: 'sine', f: [300, 1100], d: 0.18, v: 0.06 }]);
  Kit.audio.define('wheeze', [{ w: 'noise', f: [2100, 700], d: 0.34, v: 0.13 }, { w: 'noise', f: [900, 1600], d: 0.3, v: 0.08, at: 0.34 }]);
  Kit.audio.define('gasp', [{ w: 'noise', f: [800, 2800], d: 0.3, v: 0.12 }]);
  Kit.audio.define('hide', [{ w: 'noise', f: [1100, 500], d: 0.09, v: 0.07 }]);
  Kit.audio.define('tell', [{ w: 'triangle', f: [520, 520], d: 0.09, v: 0.14 }, { w: 'triangle', f: [700, 700], d: 0.12, v: 0.14, at: 0.1 }]);
  Kit.audio.define('hear', [{ w: 'triangle', f: [420, 620], d: 0.14, v: 0.12 }]);
  Kit.audio.define('bell', [{ w: 'sine', f: [880, 860], d: 0.5, v: 0.26 }, { w: 'sine', f: [1320, 1290], d: 0.42, v: 0.14 }, { w: 'square', f: [440, 430], d: 0.28, v: 0.08 }]);
  Kit.audio.define('tick', [{ w: 'square', f: [1500, 1400], d: 0.03, v: 0.05 }]);
  Kit.audio.define('page', [{ w: 'noise', f: [3000, 900], d: 0.18, v: 0.1 }, { w: 'noise', f: [2400, 1200], d: 0.12, v: 0.07, at: 0.14 }]);
  Kit.audio.define('close', [{ w: 'sine', f: [1040, 1560], d: 0.12, v: 0.09 }]);
  Kit.audio.define('horn', [{ w: 'sawtooth', f: [130, 118], d: 0.7, v: 0.14 }, { w: 'sine', f: [196, 180], d: 0.7, v: 0.12 }]);
  Kit.audio.define('softtap', [{ w: 'noise', f: [1800, 2600], d: 0.05, v: 0.05 }]);
  Kit.audio.define('moth', [{ w: 'triangle', f: [1600, 2400], d: 0.06, v: 0.05 }, { w: 'triangle', f: [1800, 2600], d: 0.06, v: 0.05, at: 0.08 }]);
})();
