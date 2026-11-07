// Hold the Deck numbers. Every number the rules play by lives here or in tuning-boss.js, each marked PROVISIONAL or with its source. Numbers that only change how a thing looks (particles, flashes, sizes on screen) stay beside the drawing.
// Spec: docs/FRIDAY_BATCH.md, "Hold the Deck". Heights from CAST.md and the sheets. Dylan's thumb has not tried any of these yet.
window.TUNE = {
  // ---- The deck on screen (logical 360 x 640, the kit's upright size). d = how far down a lane: 0 far end, 1 the galley door.
  farY: 92,             // PROVISIONAL: top of the deck. A talk box of up to 2 lines stays above it on the 320 px phone; NOTES.md has the measured sizes
  doorY: 532,           // PROVISIONAL: the galley counter's edge. Everything under it is read-outs
  midX: 180,            // the middle of the 360 px screen
  laneFar: 62,          // PROVISIONAL: lane width at the far end. 62 logical is 55 CSS px on a 320 px phone, so a far lane is still a good tap target
  laneNear: 114,        // PROVISIONAL: and at the door
  curveLin: 0.62,       // PROVISIONAL: how d maps to the screen; things speed up on screen as they come near
  curveSq: 0.38,        // PROVISIONAL: the two must add to 1
  scaleFar: 0.28,       // PROVISIONAL: px per cm at the far end
  scaleNear: 0.61,      // PROVISIONAL: and at the door. Bram's 198 cm (CAST.md) comes out about 119 px tall on his row
  bramD: 0.965,         // PROVISIONAL: where he stands
  reachD: 0.66,         // PROVISIONAL: the gold line. A swing hits anything from here down, in his lane
  contactD: 0.84,       // PROVISIONAL: where a boarder stops to fight him
  spacing: 0.07,        // PROVISIONAL: the gap boarders keep from the one in front
  btn: { x: 282, y: 556, w: 72, h: 76 },   // PROVISIONAL: Grist's button. 72 x 76 logical is 64 x 67 CSS px at the smallest phone (44 px minimum). Kept small because a one-handed thumb rests in this corner

  // ---- Bram. Base numbers at no iron
  stepSecs: 0.17,       // PROVISIONAL: seconds to walk one lane
  swingCd: 0.3,        // PROVISIONAL: seconds between swings that hit
  whiffMul: 1.4,        // PROVISIONAL: a swing at nothing takes this much longer, so hammering the glass isn't the best play
  whiffStagger: 0.28,   // PROVISIONAL: a swing at nothing costs him his footing: he can't set off for another lane for this long. A lit lane under him cancels it, so a dodge is never late because of it
  whiffRunAdd: 0.14,    // PROVISIONAL: and this much more for each swing at nothing in a row, so sweeping the lanes without looking gets slower and slower
  whiffRunMax: 3,       // PROVISIONAL: counted up to this many
  whiffForget: 2.5,     // PROVISIONAL: seconds without a miss before the streak starts again from nothing
  swingWindup: 0.07,    // PROVISIONAL: from the tap to the hit
  swingBuffer: 0.14,    // PROVISIONAL: a tap on his own lane this close before he's ready still counts. A tap on another lane always swings on arrival, however long the hammer takes to come back
  lungeSecs: 0.22,      // PROVISIONAL: how long the lunge forward looks (looks only)
  hurtSecs: 0.4,        // PROVISIONAL: hurt pose
  hitStopSecs: 0.05,    // PROVISIONAL: the freeze on a hit on the core, or two boarders in one swing
  invuln: 0.7,          // PROVISIONAL: seconds of safety after a hit on him. Boarders who get through the door ignore it
  guts: 5,              // PROVISIONAL: Guts at the start of each stage
  apronPerLevel: 1,     // PROVISIONAL: Thick Apron, Guts per level
  mercyPerLoss: 1,      // PROVISIONAL: dying on a stage leaves one more Guts for the next try at it, so grey is never a wall you can only escape by starting the story again
  mercyMax: 3,          // PROVISIONAL: up to this many. Back to none once the stage is won

  // ---- Iron: the bond cost. Lasts the whole story run through run.carry.iron, 0 to 1
  holdSecs: 0.34,       // PROVISIONAL: how long a thumb stays down before Iron starts. Above the kit's 0.28 s tap (shared/kit/input.js), so a press can't be both a tap and an Iron; short enough for every warning (test/fairness.js)
  ironPerUse: 0.08,     // PROVISIONAL: every use spreads this much (spec: "every use spreads grey iron")
  ironFreeHold: 1.2,    // PROVISIONAL: seconds of a hold that cost nothing more
  ironPerSec: 0.05,     // PROVISIONAL: and after that
  ironStepSlow: 1.6,    // PROVISIONAL: at full iron a lane takes 0.17 x (1 + 1.6) = 0.44 s
  ironSwingSlow: 1.3,   // PROVISIONAL: at full iron a swing takes 0.3 x (1 + 1.3) = 0.69 s
  ironHeavy: 1.0,       // PROVISIONAL: at full iron a swing hits this much harder than bare (at 50%, half this), on anything with more than 1 point in it. Kept under ironSwingSlow, so more grey never hits harder per second than less
  ironLineAt: 0.5,      // PROVISIONAL: past this Ione says so, the boots clank, the read-out turns orange, Sela hears it in stage 4
  swingRecover: 0.5,    // PROVISIONAL: letting go of Iron leaves the hammer down for this share of a swing
  shedScore: 15,        // PROVISIONAL: score per boarder knocked away when Iron is let go
  reflectDamage: 2,     // PROVISIONAL: a hook bounced off Iron goes back up the lane and hits the first boarder this hard
  shedHit: 1,           // PROVISIONAL: what letting go of Iron does to whatever piled up on him

  // ---- Grist
  temperPerKill: 0.085, // PROVISIONAL: about 12 boarders fill him
  temperChain: 0.05,    // PROVISIONAL: on top, for each extra boarder in one swing
  temperPerLevel: 0.25, // PROVISIONAL: Grist's Temper, extra fill per level
  temperIronBlock: 0.2, // PROVISIONAL: stopping a hook, crate or claw with Iron riles him up
  temperPerSec: 0.006,  // PROVISIONAL: he slowly wakes up by himself
  gristSpeed: 2.2,      // PROVISIONAL: d per second up the lane
  gristBack: 1.1,       // PROVISIONAL: seconds he takes to trudge back before he can go again
  gristFromD: 1.12,     // PROVISIONAL: where he sets off, behind the door
  gristToD: -0.15,      // PROVISIONAL: where he's run past the far end
  gristWidth: 0.09,     // PROVISIONAL: how far ahead of his nose he flattens things

  // ---- Boarders. speed in d per second, before the stage's multiplier
  foes: {
    grunt:  { speed: 0.15, hp: 1, cm: 180, score: 20, drop: 0.2 },   // PROVISIONAL: cm from trooper-sheet-v1. About 6.7 s from far end to door
    runner: { speed: 0.27, hp: 1, cm: 176, score: 30, drop: 0.2 },   // PROVISIONAL: about 3.7 s
    shield: { speed: 0.125, hp: 2, cm: 180, score: 40, drop: 0.25 },   // PROVISIONAL: the plate takes one swing, the man another
    cutter: { speed: 0.15, hp: 1, cm: 180, score: 40, drop: 0.25, stopAt: 0.32, every: 3.4, throws: 2, firstAim: 0.2 },   // PROVISIONAL: throws twice from range, then walks in
    rope:   { speed: 0.15, hp: 1, cm: 180, score: 25, drop: 0.2 },   // PROVISIONAL: drops in from a crane line, part way down a lane
    ram:    { speed: 0.105, hp: 3, cm: 180, score: 90, drop: 0.5 },      // PROVISIONAL: three swings, one Iron or one Grist
  },
  bladeHurt: 1,         // PROVISIONAL: Guts a boarder's blade takes
  doorHurt: 1,          // PROVISIONAL: Guts a boarder through the door takes
  ramShoveHurt: 1,      // PROVISIONAL: Guts a ram takes shoving him aside
  attackWindup: 0.45,   // PROVISIONAL: seconds a boarder squares up to Bram before his blade lands. Shown by a white glint
  attackRecoil: 0.1,    // PROVISIONAL: how far he stumbles back after landing it
  hitKnock: 0.05,       // PROVISIONAL: how far a boarder who survives a swing is knocked back
  sideSecs: 0.5,        // PROVISIONAL: seconds to step round a crate into the next lane
  sideWalkMul: 0.4,     // PROVISIONAL: how fast he comes on while he's stepping round it
  wallAheadD: 0.06,     // PROVISIONAL: how near a wall he gets before he steps round
  wallRoundD: 0.08,     // PROVISIONAL: a wall in the next lane this close shuts that way
  wallChewSecs: 1.6,    // PROVISIONAL: with every way shut, he hacks through in this long
  wallChewStop: 0.05,   // PROVISIONAL: and waits this far short of it
  ramContactD: 0.86,    // PROVISIONAL: where a ram reaches Bram
  ramDoorHurt: 2,       // PROVISIONAL: Guts a ram takes when it reaches the door
  ramIronSecs: 0.8,     // PROVISIONAL: how long Iron takes to break a ram that's run into it
  ramCogs: 3,           // PROVISIONAL: salvage when a ram drops any

  // ---- Warnings. Everything thrown or dropped warns first, on the lane: seconds from the warning's first frame to the hit
  hookWarn: 1.3,        // PROVISIONAL: last hookFly of it is the hook in the air
  hookFly: 0.32,        // PROVISIONAL
  dropWarn: 1.35,       // PROVISIONAL: a crate aimed at the lane Bram stands in when it starts
  hookHurt: 1,          // PROVISIONAL: Guts a hook takes
  crateHurt: 1,         // PROVISIONAL: Guts a dropped crate takes
  wallWarn: 1.2,        // PROVISIONAL: a crate that lands part way down and stays
  ropeWarn: 1.0,        // PROVISIONAL: a boarder dropping in. No harm in the landing
  wallD: [0.68, 0.78],  // PROVISIONAL: where a wall crate can land. All past the gold line (reachD), so the hint's "smash it" is always true
  wallMax: 2,           // PROVISIONAL: at most this many walls at once, so there's always a way through
  wallSalvage: 1,       // PROVISIONAL: every crate can be reached now, so this and stage 3's clear are down, to keep a clear near the kit's 15 to 40
  dropSalvage: 1,       // PROVISIONAL: a crate that bursts on Iron, or on the bare deck
  fairReact: 0.4,       // PROVISIONAL: a new warning waits unless this much time is left after the walk to a safe lane, however slow he's got. Checked in test/fairness.js
  dropKillD: 0.08,      // PROVISIONAL: a crate landing this near a boarder takes him out
  wallKillD: 0.06,      // PROVISIONAL: and a wall crate this near
  // A volley: every lane lit at once, so walking can't save him. Only Iron stops it, or he takes it. This is what makes the bond cost a choice you can't skip: Guts now, or grey for good.
  volleyWarn: 1.5,      // PROVISIONAL: reaction, then holdSecs, with time to spare (test/fairness.js)
  volleyHurt: 3,        // PROVISIONAL: Guts if it lands. More than a bowl of broth pays back, and more volleys come in a stage than 5 Guts and the bowls can pay for, so stages 2 to 4 each ask for some Iron
  volleyHurtLocked: 1,  // PROVISIONAL: at full iron there's no Iron stance, but he's mostly anvil, so it hurts less. Keeps a fully grey Bram winnable
  temperVolley: 0.3,    // PROVISIONAL: stopping a volley riles Grist up

  // ---- Meals
  brothGuts: 2,         // PROVISIONAL: Bone Broth
  brothPerLevel: 1,     // PROVISIONAL: Big Pot adds this per level
  pepperMul: 0.72,      // PROVISIONAL: Pepper Stew: walk and swing times for the next wave, or the next phase of the bear
  pepperPerLevel: 0.04, // PROVISIONAL: Big Pot takes this much more off
  pepperFloor: 0.5,     // PROVISIONAL: never quicker than this
  pepperSecs: 9999,     // it's stopped by the end of the wave or the next bowl (waves.js), not by this
  tonicIron: 0.06,      // PROVISIONAL: Ione's Tonic: iron pulled back. "a little" (spec): less than one Iron's worth (ironPerUse), so the grey only ever creeps one way
  tonicPerLevel: 0.005, // PROVISIONAL: Big Pot adds this per level. Level 3 gives 7.5%, still under one Iron's 8%
  calmSecs: 0.9,        // PROVISIONAL: the beat after a wave before the pot comes out
  bannerSecs: 1.5,      // PROVISIONAL: the wave's name on screen, before the first boarder sets off
  hintSecs: 4.2,        // PROVISIONAL: the plain-words plate at the start of a stage or boss phase. Nothing sets off while it's up, so it never hides anything that matters
  sayQueueMax: 3,       // PROVISIONAL: lines waiting their turn in the talk box; older ones are dropped
  saySecs: 3.4,         // PROVISIONAL: how long a line stays up unless it says otherwise
  sayMealSecs: 2.0,     // PROVISIONAL: the crew's word after a meal
  palSay: { rivetling: 2.0, spoonling: 2.6 },   // PROVISIONAL: how long a pal's line stays up. Rivetling's walk is 2.0 s (rivetWalk), so its line ends as it arrives
  firstBeat: 0.2,       // PROVISIONAL: seconds into a wave before its first beat
  // How much room each kind of beat leaves after it (seconds), and how long the second man waits.
  beat: { pairRoom: 0.5, fileAfter: 0.75, fileRoom: 0.4, lineRoom: 1.0, flankAfter: 1.0, flankRoom: 0.4, rushAfter: 0.7, rushRoom: 0.8, shieldRoom: 0.3, dropRoom: 0.3, ramRoom: 1.2, volleyRoom: 1.0, retry: 0.25, ropeD: [0.34, 0.52], laneClearMul: 1.4 },   // PROVISIONAL

  // ---- The ending: how much grey picks which words
  endingMid: 0.12,      // PROVISIONAL: under this, "hardly any new grey" is true. One Iron is 8%
  endingHigh: 0.5,      // PROVISIONAL: from here, it's in the joints

  // ---- Salvage. Kit aim: a stage clear pays about 15 to 40 in all
  cogValue: 1,          // PROVISIONAL
  // ---- Score
  scoreClear: 200,      // PROVISIONAL
  scorePerSalvage: 5,   // PROVISIONAL
  scorePerGuts: 50,     // PROVISIONAL: Guts left at a clear
  chainScore: 15,       // PROVISIONAL: for each extra boarder in one swing

  // ---- The first four stages, and the boss's place. Words are in words.js. gap = seconds between beats; beats = how many; mix = weights of what a beat can be.
  // speed multiplies boarders' speed. look = which palette and props scene.js paints.
  stages: [
    { look: 0, speed: 1.0, clearSalvage: 13, waves: [   // PROVISIONAL: "first stage easy for a new player". About 55 s. Whether it's calm or dull needs Dylan's thumb
      { beats: 9, gap: [1.9, 2.5], mix: { grunt: 1 } },
      { beats: 12, gap: [1.4, 1.9], mix: { grunt: 5, pair: 2, file: 1, runner: 1 } },
    ] },
    { look: 1, speed: 1.08, clearSalvage: 11, volley: ['hook'], waves: [   // PROVISIONAL: cutters and ropes bring Iron in. Boarders come quicker than stage 1. About 75 s
      { beats: 9, gap: [1.4, 1.85], mix: { grunt: 4, cutter: 2, pair: 1, rope: 2 }, volleysAt: [6] },
      { beats: 12, gap: [1.1, 1.5], mix: { grunt: 3, runner: 2, cutter: 3, pair: 3, rope: 2 }, volleysAt: [6] },
      { beats: 14, gap: [0.9, 1.3], mix: { grunt: 3, runner: 3, cutter: 3, pair: 3, rope: 2, rush: 2, flank: 1 }, volleysAt: [8] },
    ] },
    { look: 2, speed: 1.08, clearSalvage: 5, crane: true, volley: ['crate'], waves: [   // PROVISIONAL: the crane: walls change the traffic, drops chase him. About 80 s
      { beats: 10, gap: [1.5, 2.0], mix: { grunt: 4, wall: 3, drop: 3, pair: 2 }, volleysAt: [6] },
      { beats: 14, gap: [1.05, 1.5], mix: { grunt: 3, runner: 3, wall: 3, drop: 4, cutter: 1, pair: 3, line: 1 }, volleysAt: [7] },
      { beats: 18, gap: [0.8, 1.2], mix: { grunt: 3, runner: 3, wall: 3, drop: 5, cutter: 2, pair: 4, rush: 2, line: 2 }, volleysAt: [5, 13] },
    ] },
    { look: 3, speed: 1.05, clearSalvage: 6, hekka: true, volley: ['hook', 'crate'], waves: [   // PROVISIONAL: shields and rams: three ways to stop a ram, and the meter to save for it. Eased in the review: it was harder than the bear. About 90 s
      { beats: 10, gap: [1.5, 2.0], mix: { grunt: 3, shield: 4, runner: 2, pair: 2 }, ramsAt: [5], volleysAt: [8] },
      { beats: 13, gap: [1.1, 1.5], mix: { grunt: 3, shield: 3, runner: 2, cutter: 2, pair: 2, flank: 1 }, ramsAt: [3, 9], volleysAt: [7] },
      { beats: 15, gap: [1.0, 1.35], mix: { grunt: 3, shield: 3, runner: 2, cutter: 2, drop: 2, pair: 3, rush: 2, line: 1, flank: 1 }, ramsAt: [4, 10], volleysAt: [8] },
    ] },
    { look: 4, boss: true, speed: 1.3, clearSalvage: 26 },   // PROVISIONAL: "boss takes a few tries" (spec)
  ],
  endless: { look: 2, speed: 1.0, speedPerWave: 0.05, speedMax: 2.4, beatsStart: 8, beatsPerWave: 1, beatsMax: 30, gapStart: [1.9, 2.5], gapPerWave: 0.08, gapMin: [0.45, 0.75], clearSalvage: 0, mealEvery: 2, volley: ['hook', 'crate'], volleyEvery: 9, volleyEveryDrop: 0.25, volleyEveryMin: 4,
    mix: [ { grunt: 5, pair: 1 }, { grunt: 4, runner: 2, cutter: 2, rope: 1, pair: 1 }, { grunt: 3, runner: 2, wall: 2, drop: 3, cutter: 2, pair: 2 }, { grunt: 2, runner: 3, shield: 3, cutter: 2, drop: 3, wall: 1, ram: 1, rush: 2, pair: 3, line: 1 } ] },   // PROVISIONAL

  // ---- Pals. Each asks something odd of the player
  rivetChance: 0.4,     // PROVISIONAL: chance once per attempt from stage 3, when Iron has been held rivetHold seconds
  rivetHold: 1.3,       // PROVISIONAL: longer than any block needs. With the walk, a hold for Rivetling costs about 18% iron
  rivetFromStage: 2,    // PROVISIONAL: index, 2 = stage 3
  rivetWalk: 2.0,       // PROVISIONAL: seconds it takes to shuffle over to him. Let go before that and it rolls away
  spoonChance: 0.6,     // PROVISIONAL: chance when a meal is wasted (broth at full Guts, tonic with no iron to shift). From stage 2
  spoonFromStage: 1,    // PROVISIONAL: index, 1 = stage 2
  spoonSecs: 7,         // PROVISIONAL: how long it begs before it gives up
  palForce: false,      // the pal test sets true

  // ---- Test bot only. test/fairness.js changes these to play like a person
  bot: { react: 0.1, jitter: 0, tapGap: 0.12, late: 0.25, ironCap: 0.3, ironUses: true, dodgeOnly: false, forcePal: false, forceMeal: null, lapseEvery: 0, lapseSecs: 0, volleySpare: 2 },   // volleySpare is how the bot decides: it holds for a volley once taking it would leave this little Guts or less
};
