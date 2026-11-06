// Storm Run numbers. Every number the game plays by lives here, each marked PROVISIONAL or with its source.
// Answers are in docs/DECISIONS.md ("build step 3") and docs/FRIDAY_BATCH.md ("Storm Run"). Dylan's thumb has not tried any of these yet.
window.TUNE = {
  // ---- Screen layout (logical 640 x 360, the kit's sideways size)
  pxPerCm: 0.48,        // PROVISIONAL: Kaito's 178 cm (CAST.md) comes out about 85 px tall
  groundY: 296,         // PROVISIONAL: feet line. The rock below it holds the arm and the hints
  playerX: 150,         // PROVISIONAL: where Kaito runs, far enough in to see what's coming
  bossX: 300,           // PROVISIONAL: further in for the boss, so Silt fits behind him
  spawnX: 900,          // PROVISIONAL: foes start here, off the right edge of any screen up to 21:9
  metre: 10,            // PROVISIONAL: px of road per metre on the distance count

  // ---- The jump (quick tap = short hop, hold = full jump: FRIDAY_BATCH.md)
  gravity: 1700,        // PROVISIONAL
  jumpSpeed: 640,       // PROVISIONAL: a held jump peaks at about 120 px
  minHop: 0.09,         // PROVISIONAL: seconds of rise before letting go can cut the jump, so a real tap always hops about 68 px
  hopCut: 0.5,          // PROVISIONAL: speed kept when the thumb lets go while rising
  surgeSpeed: 520,      // PROVISIONAL: the second jump adds about 80 px from wherever he is
  surgeFxSecs: 0.34,    // PROVISIONAL: how long the Surge pose and echoes last
  stepSecs: 0.26,       // PROVISIONAL: seconds between footstep sounds
  bufferSecs: 0.12,     // PROVISIONAL: a tap this close before landing still jumps
  kaitoHalfW: 10,       // PROVISIONAL: Kaito's hit box, half width
  kaitoTall: 68,        // PROVISIONAL: and height. A little under his 85 px, so the head can graze

  // ---- The bond cost (DECISIONS.md, build step 3)
  scarPerSurge: 0.26,   // PROVISIONAL: four quick Surges reach the top
  scarFade: 0.035,      // PROVISIONAL: "scars fade slowly"; a full arm takes about 28 s to clear
  numbSecs: 5,          // Dylan's answer: "5 seconds in the game only" (the story keeps "for days")
  numbAfter: 0.6,       // PROVISIONAL: the scars left when the feeling comes back, so the next numb comes quicker
  coolPerLevel: 0.35,   // PROVISIONAL: Cool Scars, extra fade speed per level

  // ---- Getting hurt
  hits: 3,              // PROVISIONAL: hits per attempt at a stage
  invuln: 1.1,          // PROVISIONAL: seconds of safety after a hit
  hurtSecs: 0.4,        // PROVISIONAL: seconds of the hurt pose
  catchPerLevel: 1,     // PROVISIONAL: Skarn's Catch, free hits per story run per level (FRIDAY_BATCH.md: "a free hit per run"). Dying gives back only what this attempt spent
  catchBounce: 560,     // PROVISIONAL: how hard Skarn throws him back up
  catchSecs: 0.9,       // PROVISIONAL: how long Skarn's swoop shows
  catchSafety: 0.3,     // PROVISIONAL: extra seconds of safety after Skarn's Catch, on top of invuln

  // ---- Foes. hw = half width, hi = top of the hit box above the road, extra = speed on top of the road's
  foes: {
    low: { hw: 16, hi: 32, extra: 0 },       // PROVISIONAL: a hop clears it
    trooper: { hw: 11, hi: 70, extra: 40 },  // PROVISIONAL: a full jump clears it; runs at you
    tall: { hw: 18, hi: 124, extra: 0 },     // PROVISIONAL: 4 px over a full jump's peak, so it takes a Surge
    swoop: { hw: 20, thick: 22, extra: 80 }, // PROVISIONAL: a Hollow; flies faster than the road
  },
  swoopHigh: 178,       // PROVISIONAL: height a Hollow cruises at
  swoopSpan: 300,       // PROVISIONAL: px either side of Kaito over which it drops to its low point
  swoopOverLow: 92,     // PROVISIONAL: passes over a runner's head, but catches anyone who jumps
  swoopDiveLow: 26,     // PROVISIONAL: dives at the road; hop or jump over it
  swoopDiveChance: 0.5, // PROVISIONAL: chance a Hollow dives instead of passing high
  pairGap: 62,          // PROVISIONAL: px between two troopers side by side
  after: { low: 0.9, trooper: 1.15, tall: 1.8, swoop: 1.2, pair: 1.3 },   // PROVISIONAL: seconds of room after each, whatever the stage's gap
  tallEvery: 7,         // PROVISIONAL: seconds between tall barricades, about what the scars can fade
  firstArrival: 3.2,    // PROVISIONAL: seconds of clear road at the start of a stage
  endClear: 150,        // PROVISIONAL: px of road left clear before the finish

  // ---- Salvage. Kit aim: a stage clear pays about 15 to 40 in all
  coinValue: 1,         // PROVISIONAL
  bigCoinValue: 3,      // PROVISIONAL: the high ones that cost a Surge to reach
  coinChance: 0.35,     // PROVISIONAL: chance of a pattern with each foe
  grabRadius: 30,       // PROVISIONAL: px from Kaito's middle
  pullPerLevel: 34,     // PROVISIONAL: Salvage Pull, extra reach per level
  pullSpeed: 520,       // PROVISIONAL: how fast pulled salvage flies in
  coinRows: { low: [58, 70, 58], trooper: [108, 128, 108], pair: [100, 122, 134, 122, 100], tall: [204], swoop: [24, 24, 24] },   // PROVISIONAL: heights of the salvage that comes with each foe

  // ---- Score
  scorePerFoe: 25,      // PROVISIONAL
  scorePerCoin: 5,      // PROVISIONAL
  scorePerClear: 200,   // PROVISIONAL
  scorePerCore: 500,    // PROVISIONAL

  // ---- Pals. Rare, and each asks the opposite thing of your arm
  fizzletChance: 0.3,   // PROVISIONAL: chance each time the arm goes numb, from stage 2
  fizzletFromStage: 1,  // PROVISIONAL: index, 1 = stage 2
  boltnipChance: 0.25,  // PROVISIONAL: chance once per attempt, when the arm has been clean a while
  boltnipCalm: 14,      // PROVISIONAL: seconds with no Surge and no scars above base
  boltnipFromStage: 2,  // PROVISIONAL: index, 2 = stage 3
  boltnipAlt: 200,      // PROVISIONAL: height it flies at; out of reach of a full jump, so catching it costs a Surge
  palRadius: 20,        // PROVISIONAL
  palCatchHeight: 30,   // PROVISIONAL: how far above a pal's height still counts as touching it
  palSpawnBack: 120,    // PROVISIONAL: px nearer than other foes that a pal starts
  palSpeed: { fizzlet: 0.82, boltnip: 0.9 },   // PROVISIONAL: share of road speed; both move along a little, so you get longer to act

  // ---- The boss (FRIDAY_BATCH.md: "three times"). Lists run by core hits so far: first, second, third round
  bossHits: 3,          // Spec: "Surge into the hound's white core when it's open, three times"
  bossSpeed: 300,       // PROVISIONAL: road speed
  chaseX: 76,           // PROVISIONAL: where the hound runs behind him
  landX: 520,           // PROVISIONAL: where a lunge lands, past Kaito
  chaseSecs: [3.0, 3.2, 3.4],   // PROVISIONAL
  cableAt: [[1.2], [0.9, 2.1], [0.7, 2.1, 2.8]],   // PROVISIONAL: seconds into the chase when Silt throws. Nothing is thrown from about 1.2 to 2.0 s: the barricade passes at 1.9 to 2.1 s, and you must be back on the road before the next cable's height can be read and answered
  barricadeIn: [false, true, true],                // PROVISIONAL: a low barricade comes from the front too
  tellSecs: [0.95, 0.8, 0.65],  // PROVISIONAL: crouch before a lunge. WAIT shows, then the jump prompt for the last jumpCueSecs
  jumpCueSecs: 0.37,    // PROVISIONAL: the jump prompt and its sound come this long before the lunge. Measured: a full jump started about 0.19 to 0.40 s after it clears (NOTES.md)
  lungeSecs: 0.6,       // PROVISIONAL
  lungeArc: 18,         // PROVISIONAL: px off the road at the top of a lunge. Was 26; with houndTall, sets how long the jump window is
  houndHalfW: 50,       // PROVISIONAL
  houndTall: 62,        // PROVISIONAL: a full jump clears it, a hop (about 68 px) doesn't: about 80 px with the arc. Was 70
  openSecs: [1.75, 1.5, 1.3],   // PROVISIONAL: how long the core stays open
  shutSecs: 0.5,        // PROVISIONAL: warning before it lunges back if you missed
  staggerSecs: 0.8,     // PROVISIONAL
  retreatSecs: 0.8,     // PROVISIONAL
  fallSecs: 1.5,        // PROVISIONAL: the last moment before the win
  bossEnterSecs: 1.6,   // PROVISIONAL: how long the hound takes to run in
  bossEnterX: -220,     // PROVISIONAL: where it starts, off the left edge
  barricadeLead: 1.6,   // PROVISIONAL: seconds of road ahead of Kaito for the boss's barricade
  barricadeExtra: 120,  // PROVISIONAL: and px on top of that
  landSecs: 0.28,       // PROVISIONAL: the pause when a lunge lands, before the core opens
  retreatHeight: 170,   // PROVISIONAL: px, the high bound back over Kaito's head
  fallDrift: 0.2,       // PROVISIONAL: share of road speed the fallen hound slides at
  windupSecs: 0.45,     // PROVISIONAL: Silt's arm back before a cable flies
  cableSpeed: 300,      // PROVISIONAL: px/s, flying forward
  cableHighChance: 0.5, // PROVISIONAL: chance a cable flies high instead of low
  cableHalfW: 12,       // PROVISIONAL: a cable's hit box, half width
  cableLow: { lo: 4, hi: 30 },    // PROVISIONAL: hop over it
  cableHigh: { lo: 88, hi: 110 },  // PROVISIONAL: stay down, it goes over your head
  dashSecs: 0.2,        // PROVISIONAL: the lightning dash into the core
  dashSafety: 0.7,      // PROVISIONAL: seconds of safety after the dash lands
  coreReachX: 300,      // PROVISIONAL: how far the dash reaches
  coreAlt: 96,          // PROVISIONAL: height of the core above the road when the hound rears (matches hound.js)
  coreOffset: 16,       // PROVISIONAL: and how far in front of the hound's middle it is then (matches hound.js)
  rebound: 420,         // PROVISIONAL: bounce back off the core
  returnRate: 3,        // PROVISIONAL: how fast Kaito drifts back to his spot

  // ---- The five stages. Words are in words.js. length in metres.
  stages: [
    { length: 700, speed: 225, gap: [1.5, 2.4], mix: { low: 5, trooper: 3 }, clearSalvage: 12, wash: 0 },        // PROVISIONAL: about 31 s, easy
    { length: 850, speed: 245, gap: [1.4, 2.2], mix: { low: 4, trooper: 4, tall: 3 }, clearSalvage: 12, wash: 0.06 }, // PROVISIONAL: about 35 s
    { length: 950, speed: 265, gap: [1.3, 2.1], mix: { low: 3, trooper: 4, tall: 2, swoop: 4 }, clearSalvage: 14, wash: 0.14, rain: 34 }, // PROVISIONAL: about 36 s
    { length: 1100, speed: 285, gap: [1.2, 1.9], mix: { low: 3, trooper: 4, tall: 3, swoop: 4, pair: 2 }, clearSalvage: 16, wash: 0.22, rain: 60, flash: 7, silt: true },            // PROVISIONAL: about 39 s
    { boss: true, speed: 300, clearSalvage: 26, wash: 0.1, rain: 70, flash: 5 },                                      // PROVISIONAL: "takes a few tries" (spec)
  ],
  endless: { speed: 240, ramp: 1.1, maxSpeed: 370, gap: [1.2, 2], gapMin: 0.55, gapShrink: 0.004, mix: { low: 3, trooper: 4, tall: 2, swoop: 4, pair: 2 }, clearSalvage: 0, wash: 0.14, rain: 40 },  // PROVISIONAL

  // ---- Test bot only
  botLook: 1.6,         // seconds the bot looks ahead
  botMargin: 3,         // px of extra room it wants
  botPals: false,       // the pal test sets 'fizzlet' (the bot burns its arm on purpose) or 'boltnip' (it Surges up to the kite)
};
