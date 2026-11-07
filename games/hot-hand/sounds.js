// Hot Hand: this game's own effects, on top of the kit's. Every action has one. See the list in NOTES.md.
(function () {
  const a = Kit.audio.define;
  a('flick', [{ w: 'noise', f: [900, 2400], d: 0.1, v: 0.14 }, { w: 'triangle', f: [420, 700], d: 0.08, v: 0.08 }]);                       // a cold throw
  a('whump', [{ w: 'noise', f: [600, 1800], d: 0.18, v: 0.2 }, { w: 'sawtooth', f: [190, 90], d: 0.16, v: 0.11 }]);                        // a warm throw
  a('roar', [{ w: 'noise', f: [420, 2200], d: 0.3, v: 0.26 }, { w: 'sawtooth', f: [130, 60], d: 0.28, v: 0.16 }, { w: 'square', f: [620, 1240], d: 0.09, v: 0.06, at: 0.02 }]);   // a hot throw
  a('splat', [{ w: 'noise', f: [1600, 300], d: 0.12, v: 0.2 }]);                                                                           // a flame lands
  a('burnup', [{ w: 'noise', f: [2400, 500], d: 0.2, v: 0.18 }, { w: 'triangle', f: [760, 380], d: 0.12, v: 0.1 }]);                       // a thing in the air burns
  a('tink', [{ w: 'square', f: [2100, 1900], d: 0.07, v: 0.11 }, { w: 'noise', f: [6000, 4000], d: 0.03, v: 0.1 }]);                       // a cold throw bounces off a plate
  a('sizzle', [{ w: 'noise', f: [5200, 3600], d: 0.3, v: 0.08 }]);                                                                         // heat just went past the safe mark
  a('edge', [{ w: 'triangle', f: [990, 1320], d: 0.08, v: 0.1 }]);                                                                         // just came into HOT HAND
  a('blowout', [{ w: 'sine', f: [180, 34], d: 0.6, v: 0.36 }, { w: 'noise', f: [1500, 120], d: 0.55, v: 0.3 }, { w: 'sawtooth', f: [500, 60], d: 0.4, v: 0.12 }]);   // over the top
  a('locked', [{ w: 'sawtooth', f: [150, 110], d: 0.1, v: 0.14 }, { w: 'noise', f: [3000, 1800], d: 0.08, v: 0.06 }]);                     // tapping with locked hands
  a('unlock', [{ w: 'triangle', f: [420, 840], d: 0.12, v: 0.13 }, { w: 'noise', f: [2600, 4200], d: 0.14, v: 0.05 }]);                    // hands free again
  a('cry', [{ w: 'sawtooth', f: [1500, 2600], d: 0.08, v: 0.09 }, { w: 'sawtooth', f: [2300, 1300], d: 0.16, v: 0.09, at: 0.07 }]);        // Ashka marks a target
  a('vented', [{ w: 'noise', f: [3000, 900], d: 0.24, v: 0.14 }, { w: 'sine', f: [720, 360], d: 0.2, v: 0.09 }]);                          // she takes heat off
  a('tell', [{ w: 'square', f: [980, 980], d: 0.06, v: 0.1 }, { w: 'square', f: [980, 980], d: 0.06, v: 0.1, at: 0.1 }]);                  // a blade goes up
  a('hookwind', [{ w: 'triangle', f: [300, 900], d: 0.5, v: 0.1 }]);                                                                       // a hook winds up
  a('hookfly', [{ w: 'noise', f: [1400, 3400], d: 0.26, v: 0.12 }, { w: 'sine', f: [1200, 700], d: 0.26, v: 0.05 }]);                      // a hook in the air
  a('shutter', [{ w: 'noise', f: [1200, 700], d: 0.05, v: 0.14 }, { w: 'noise', f: [1000, 500], d: 0.05, v: 0.12, at: 0.08 }]);            // window opens
  a('fuse', [{ w: 'noise', f: [7000, 5000], d: 0.2, v: 0.09 }, { w: 'square', f: [1300, 1300], d: 0.05, v: 0.08, at: 0.02 }]);             // a powder cart's fuse
  a('keg', [{ w: 'sine', f: [120, 30], d: 0.7, v: 0.4 }, { w: 'noise', f: [1100, 90], d: 0.6, v: 0.34 }]);                                 // a powder cart goes up
  a('chips', [0, 0.05, 0.1, 0.16].map(t => ({ w: 'square', f: [1900 - t * 2000, 1700 - t * 2000], d: 0.035, v: 0.09, at: t })));           // a stake goes down
  a('payout', [[659, 0], [784, 0.07], [988, 0.14], [1319, 0.21], [988, 0.3], [1319, 0.37], [1568, 0.46]].map(n => ({ w: 'square', f: [n[0], n[0]], d: 0.09, v: 0.12, at: n[1] })));   // a bet won
  a('bust', [{ w: 'sawtooth', f: [330, 60], d: 0.7, v: 0.22 }, { w: 'noise', f: [2600, 300], d: 0.5, v: 0.16 }].concat([0.05, 0.12, 0.2, 0.3, 0.42].map(t => ({ w: 'square', f: [2200, 1500], d: 0.03, v: 0.08, at: t }))));   // a bet lost
  a('cash', [{ w: 'triangle', f: [880, 880], d: 0.05, v: 0.15 }, { w: 'triangle', f: [1175, 1175], d: 0.09, v: 0.15, at: 0.05 }]);         // cashed in, or the table pays
  a('whistle', [{ w: 'sine', f: [1500, 2300], d: 0.6, v: 0.09 }, { w: 'noise', f: [4200, 5400], d: 0.6, v: 0.05 }]);                       // a vent is about to open
  a('ventin', [{ w: 'noise', f: [800, 2600], d: 0.16, v: 0.16 }, { w: 'triangle', f: [280, 620], d: 0.12, v: 0.12 }]);                     // pressure into a vent
  a('overload', [{ w: 'sine', f: [200, 40], d: 0.7, v: 0.4 }, { w: 'noise', f: [2400, 200], d: 0.6, v: 0.3 }, { w: 'square', f: [980, 240], d: 0.26, v: 0.1 }]);   // a shield blows
  a('ram', [{ w: 'square', f: [130, 110], d: 0.4, v: 0.14 }, { w: 'square', f: [130, 110], d: 0.4, v: 0.14, at: 0.5 }, { w: 'sawtooth', f: [90, 70], d: 0.9, v: 0.14 }]);   // the line about to charge
  a('quench', [{ w: 'noise', f: [7000, 1200], d: 0.5, v: 0.2 }, { w: 'sine', f: [900, 200], d: 0.45, v: 0.14 }]);                          // a can lands: her heat goes
  a('squeak', [{ w: 'sine', f: [1200, 1800], d: 0.07, v: 0.13 }, { w: 'sine', f: [1500, 2100], d: 0.08, v: 0.13, at: 0.09 }]);             // a pal says hello
  a('dice', [0, 0.06, 0.14].map(t => ({ w: 'square', f: [1400 + t * 900, 1100], d: 0.03, v: 0.1, at: t })));                               // a wrong tap on Dicemite
})();
