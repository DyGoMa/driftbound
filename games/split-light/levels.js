// Split Light: the boards. Each level teaches one idea (idea:), and test/levels-test.js proves it: solvable, its par is the true fewest shots, and what it claims to need, it needs.
// Map key is in rules.js. shots = what the level gives you, for all attempts together, and a new attempt always has at least what its board needs (SL.shotsFor in solver.js); par = fewest possible, proven by the solver. Both are play numbers: shots and clock: (seconds a stop lasts, proven fair in test/fair-timing.js) are PROVISIONAL, par is sourced from the solver.
// needs: 'growth' | 'split' | 'perch': without that thing the level can't be done in par. trap: true: some shots leave a board with no way through. handsOff: true: nothing to decide, on purpose; levels-test fails any other board you can clear at par without touching it.
window.SL = window.SL || {};
SL.SETS = ['Set 1: The Intake', 'Set 2: The Seed Beds', 'Set 3: The Split Ward', 'Set 4: The Director\'s Wing', 'The Director'];
SL.LEVELS = [
  // ---- Set 1: reading the crystals. Growths happen, but nothing needs them yet.
  { id: 'first-light', set: 0, idea: 'Tap a crystal to turn it, then fire', shots: 3, par: 1, map: [
    '....',
    'o./.',
    '....',
    '..U.',
  ] },
  { id: 'two-turns', set: 0, idea: 'Light keeps bouncing: read the whole path', shots: 3, par: 1, map: [
    '.....',
    '..\\.o',
    '.....',
    '.....',
    'R.\\..',
  ] },
  { id: 'through', set: 0, idea: 'The beam burns through a core and keeps going', shots: 3, par: 1, map: [
    '.....',
    '.\\../',
    '.....',
    '.o..o',
    '.....',
    '.U...',
  ] },
  { id: 'clamps', set: 0, idea: 'Clamped crystals never turn. Plates stop the beam', shots: 3, par: 1, map: [
    '......',
    '.f...o',
    '......',
    './.\\.#',
    '......',
    'R..f..',
  ] },

  // ---- Set 2: the bond cost. Every shot grows a crystal where the beam stopped, and growths always lean the same way.
  { id: 'it-grows', set: 1, idea: 'A crystal grows where the beam stops. It always leans /', shots: 3, par: 2, needs: 'growth', handsOff: true, map: [
    '..#..',
    '....o',
    '.....',
    '.....',
    '.....',
    '..U..',
  ] },
  { id: 'plant-it', set: 1, idea: 'Aim to plant: pick where the next crystal grows', shots: 4, par: 2, needs: 'growth', map: [
    '.....o',
    '......',
    '......',
    'R.\\...',
    '......',
    '.....#',
  ] },
  { id: 'stones', set: 1, idea: 'Stepping stones: one growth to reach the next', shots: 4, par: 3, needs: 'growth', map: [
    '.....D',
    '......',
    '....\\.',
    '.....#',
    '......',
    '.o....',
    '....#.',
  ] },
  { id: 'lane', set: 1, idea: 'A growth can bend your lane for good: order matters', shots: 4, par: 2, trap: true, map: [
    '......',
    '...//.',
    '....o.',
    '/....o',
    '....#.',
    '\\.\\/..',
    '..U...',
  ] },

  // ---- Set 3: splitters. Two beams, two stops, two growths.
  // From here every level makes you live with a growth even on a clean solve, and has a wrong shot that hurts. Par 1 is only for Set 1, where you're still learning to read.
  { id: 'split', set: 2, idea: 'A splitter sends the beam two ways, and grows two crystals', shots: 3, par: 2, needs: 'split', trap: true, map: [
    '......',
    '..o...',
    '.....o',
    '..s...',
    '......',
    '..U...',
  ] },
  { id: 'both', set: 2, idea: 'Linked cores die in the same shot or not at all', shots: 3, par: 2, needs: 'split', trap: true, map: [
    '.....T',
    '......',
    '......',
    '..s.\\.',
    '.../..',
    'R.f.T.',
  ] },
  { id: 'two-seeds', set: 2, idea: 'One split plants two seeds. The next shot uses both', shots: 3, par: 2, needs: 'growth', map: [
    '......',
    '..#.T.',
    '.....T',
    '......',
    '..s..#',
    '......',
    '..U...',
  ] },
  { id: 'armour', set: 2, idea: 'Armoured cores only open on one side. Go round', shots: 4, par: 2, trap: true, map: [
    '...\\..',
    '......',
    '......',
    'R\\.^..',
    '......',
    'o../..',
  ] },

  // ---- Set 4: he built this wing to test people.
  { id: 'perches', set: 3, idea: 'Tap a brass perch to move Prism there', shots: 3, par: 2, needs: 'perch', map: [
    'D.....',
    '......',
    '/.o#..',
    '......',
    '...o..',
    '.../.L',
  ] },
  { id: 'rails', set: 3, idea: 'A core on a rail moves one stop after every shot', shots: 3, par: 2, map: [
    '......',
    '.\\....',
    '......',
    'R/....',
    '......',
    './....',
  ], rails: [{ cells: [[2, 1], [2, 5]] }, { cells: [[4, 5], [4, 1]] }] },
  { id: 'clockwork', set: 3, idea: 'These rails run on a clock. Wait for your moment', shots: 3, par: 2, trap: true, clock: 3.2, map: [
    '.f../.',
    '......',
    '......',
    'Rf....',
    '......',
    '......',
  ], rails: [{ cells: [[2, 1], [2, 3], [2, 5]] }, { cells: [[0, 5], [5, 5], [0, 5]] }] },
  { id: 'best-work', set: 3, idea: 'All of it at once: his final exam for new staff', shots: 5, par: 3, trap: true, map: [
    'D.....',
    '...#./',
    '......',
    '/.ST..',
    '......',
    '..T.^.',
    '.....U',
  ] },
];

// The boss: three boards in one stage. Fail one and it resets for a point of nerve; run out of nerve and the stage is lost.
// Each board has a best shot that's a mistake, so someone who just takes the most hits on offer can lose it (measured in NOTES.md and test/levels-test.js):
//  1. A shot that burns two at once spends the spare. Par burns them one at a time.
//  2. The plain core takes one shot, but two plants set up a single shot that burns all three, on his beat.
//  3. A plate shuts the south side, so the third way in needs a growth planted by the second hit. Turn the crystal wrong on that hit and nothing grows, and the arm is out of reach.
// shots and clock are PROVISIONAL. count: seconds he takes to count to ten before he fires for you, from tuning.js with the extra for reading a board.
SL.BOSS = [
  { id: 'demonstration', set: 4, shots: 4, par: 3, count: TUNE.bossCount, trap: true, idea: 'His cores move after each shot', map: [
    '......',
    '..\\..\\',
    '......',
    'R.\\...',
    '......',
    '......',
  ], rails: [{ cells: [[4, 1], [4, 0]] }, { cells: [[4, 4], [4, 5]] }, { cells: [[5, 0], [0, 0]] }] },
  { id: 'metronome', set: 4, shots: 3, par: 2, clock: 2.6, count: TUNE.bossCount, trap: true, idea: 'Linked cores on his clock', map: [
    '......',
    '..\\..o',
    '......',
    'R.S...',
    '......',
    '......',
  ], rails: [{ cells: [[4, 0], [4, 2], [4, 3], [4, 2]], twin: true }, { cells: [[0, 5], [1, 5], [1, 5], [1, 5]], twin: true }] },
  { id: 'the-arm', set: 4, shots: 4, par: 3, clock: 3, count: TUNE.bossCount, corrects: true, trap: true, idea: 'The opening turns and seals behind you. He corrects your crystals', map: [
    '.....D',
    '..#\\.\\',
    '..\\..L',
    '...#..',
    '......',
    'R..\\..',
  ], fixedCores: [{ at: [3, 2], hp: 3, big: true, sides: ['W', 'N', 'E', 'S'] }] },
];
