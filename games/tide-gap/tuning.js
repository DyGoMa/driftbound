// Tide Gap numbers. Every number the game plays by lives here, each marked PROVISIONAL or with its source.
// Spec: docs/FRIDAY_BATCH.md, "Tide Gap". Dylan's thumb has not tried any of these yet. The boss, the stages, endless and the bot's numbers are in tuning-stages.js.
window.TUNE = {
  // ---- Screen layout (logical 360 x 640, the kit's upright size)
  shipY: 468,           // PROVISIONAL: the hull's middle on screen. Room below it for the talk box
  hullHalfLen: 40,      // PROVISIONAL: bow to middle, px
  hullHalfW: 17,        // PROVISIONAL: half the beam, px
  towLen: 196,          // PROVISIONAL: Vesh's head, px ahead of the hull's middle
  minX: 30, maxX: 330,  // PROVISIONAL: how far the hull's middle can swing; the cliffs sit outside this
  wallL: 14, wallR: 346,  // PROVISIONAL: the cliffs' inner edges
  hintY: 540,           // PROVISIONAL: where hints sit, under the hull, so they never cover what's coming down the screen
  hintSecs: 7,          // PROVISIONAL: how long a stage's opening hint stays. The crew wait for it to go before they talk

  // ---- Steering. Drag anywhere; Vesh's head goes first and the hull swings after it
  dragGain: 1.6,        // PROVISIONAL: px of steering per px of thumb
  keySteer: 300,        // PROVISIONAL: px/s with arrows or A and D
  headRate: 12,         // PROVISIONAL: how quickly the head closes on the aim, per second
  headMax: 460,         // PROVISIONAL: px/s, the head's top sideways speed
  towDelay: 0.14,       // PROVISIONAL: seconds the hull follows the head by
  shipRate: 9,          // PROVISIONAL: how quickly the hull closes on that, per second
  shipMax: 300,         // PROVISIONAL: px/s, the hull's top sideways speed
  steerSoundGap: 0.5,   // PROVISIONAL: seconds between steer sounds
  steerSoundMove: 3,    // PROVISIONAL: px of thumb in one step that counts as a steer, for the sound

  // ---- The Dive. Spec says "Hold to Dive". Call (NOTES.md): pull the thumb DOWN, then hold. Steering only uses sideways, so a resting, jittering or pausing thumb can never spend a memory
  pullPx: 30,           // PROVISIONAL: logical px straight down that counts as a pull
  pullWindow: 0.6,      // PROVISIONAL: seconds that pull must happen in, so a slow wander never counts. Review: 0.25 meant anything under about 120 CSS px/s did nothing, and real touch at 48 CSS px in 445 ms failed 8 of 8. test/pull.js
  pullShowFrom: 0.3,    // PROVISIONAL: share of a pull done before the thin ring and soft sound start, so a thumb's small wander shows nothing
  pullSlant: 2,         // PROVISIONAL: the pull must be this many times more down than sideways. test/pull.js: 1.5 let a fast low sweep from a standing start fire
  pullQuiet: 0.14,      // PROVISIONAL: seconds before the pull in which the thumb must not have been travelling sideways. A steering sweep runs straight into its steep end, so it never qualifies. test/pull.js
  pullQuietPx: 7,       // PROVISIONAL: logical px of sideways wander allowed in that time
  diveWindup: 0.1,      // PROVISIONAL: seconds the thumb must stay on after the pull. Lifting in that moment costs nothing
  diveSecs: 2.6,        // PROVISIONAL: air. With riseSecs this clears the longest rock on the slowest stage, going straight, from any start in about the last 50 px. test/passable.js proves it
  divePerLevel: 0.4,    // PROVISIONAL: Longer Dive, extra air per level: a wider start, not the only way under
  diveWarn: 0.6,        // PROVISIONAL: seconds of air left when the warning sounds
  riseSecs: 0.2,        // PROVISIONAL: coming back up; still safe, and it must end in open water
  sinkSecs: 0.18,       // PROVISIONAL: looks only: how long the hull takes to go dark
  diveHintSecs: 6,      // PROVISIONAL: how long the "how to Dive" hint stays on stage 1
  diveHintAfter: 3.5,   // PROVISIONAL: seconds after Ione's line that the hint comes up, so the two aren't on screen at once

  // ---- The bond cost. Spec: each Dive drowns a line; every lost line weakens the arrows; at zero they're gone and Dives stop
  bookRows: 6,          // PROVISIONAL: lines in the book, and the rows on screen
  bookFont: 12,         // PROVISIONAL: logical size of the book's writing on a roomy screen
  bookFontMinCss: 12.5, // PROVISIONAL: the writing never shrinks below this on the real screen, in CSS px
  // Sense by lines left, 0 to 6. reach: px ahead of the bow the arrows show. ghost: the gold edge where a rock will stop. chev: most chevrons in an arrow.
  // miss: the share of gates she feels nothing for at all, so every line lost costs something from the first. lead: seconds ahead she feels which way a pylon chain's way through will lie, in the boss.
  sense: [
    { reach: 0, ghost: false, alpha: 0, flick: 0, chev: 0, miss: 1, lead: 0 },       // Spec: "at zero they're gone"
    { reach: 120, ghost: false, alpha: 0.4, flick: 0.55, chev: 1, miss: 0.7, lead: 0.15 },  // PROVISIONAL: about when a drift starts, so it warns too late for a fork
    { reach: 165, ghost: false, alpha: 0.6, flick: 0.3, chev: 1, miss: 0.5, lead: 0.3 },    // PROVISIONAL
    { reach: 225, ghost: false, alpha: 0.85, flick: 0, chev: 2, miss: 0.35, lead: 0.5 },    // PROVISIONAL
    { reach: 320, ghost: false, alpha: 1, flick: 0, chev: 2, miss: 0.2, lead: 0.7 },        // PROVISIONAL: the first thing you lose is knowing exactly where a rock will stop
    { reach: 400, ghost: true, alpha: 1, flick: 0, chev: 3, miss: 0.1, lead: 0.85 },        // PROVISIONAL
    { reach: 480, ghost: true, alpha: 1, flick: 0, chev: 3, miss: 0, lead: 1 },             // PROVISIONAL: past the top of the screen, so you know before you can see
  ],

  // ---- People on deck. Looks only: nothing hits at these sizes. Review: at 36 and 40 her steady, reading and empty poses were hard to tell apart on a phone
  selaH: 46,            // PROVISIONAL: Sela's height on the bow, logical px (was 36)
  selaFeet: -13,        // PROVISIONAL: where her feet stand, px from the hull's middle, so her head still ends about at the bow
  hekkaH: 51,           // PROVISIONAL: Hekka on the cutter (was 40). 193 cm against Sela's 175 (CAST.md) keeps the same ratio

  // ---- Getting hurt
  hull: 3,              // PROVISIONAL: knocks per attempt at a stage
  hullPerLevel: 1,      // PROVISIONAL: Tougher Hull (spec: "one more knock"), per level
  hullRepair: 0,        // PROVISIONAL: planks patched between stages. Call (NOTES.md): damage lasts through the story run, or a scrape costs nothing
  hullFloor: 2,         // PROVISIONAL: planks a stage always starts with at least, so none is a dead end. The boss always starts whole: on 2 planks a 0.5 s player couldn't beat it at all, whatever the book
  invuln: 1.35,         // PROVISIONAL: seconds of safety after a knock
  hurtSecs: 0.5,        // PROVISIONAL: Sela's flinch
  shunt: 340,           // PROVISIONAL: px/s, a knock throws the hull into open water at this speed
  rockInset: 3,         // PROVISIONAL: px the hit edge sits inside the drawn edge
  freeWaterStep: 6,     // PROVISIONAL: px between the spots checked when a knock looks for open water
  rockLoseChance: 0.35, // PROVISIONAL: looks only, how often a rock's knock-out gets its own lose line

  // ---- Shut teeth. Two rocks meet with no surface way through: Dive under it for a line, or scrape through the crack for a knock. Call (NOTES.md): this is what makes the book cost something on stages 1 to 4
  shutLen: [100, 130],  // PROVISIONAL: length along the course
  shutOpen: [40, 64],   // PROVISIONAL: px each rock starts back from the crack
  shutLane: 40,         // PROVISIONAL: px either side of the crack the hull is lined up in
  shutClear: 120,       // PROVISIONAL: extra open water before one, to read it and choose
  shutCrackMin: 100, shutCrackMax: 260,  // PROVISIONAL: where the crack may fall
  shutCallLead: 3.6,    // PROVISIONAL: seconds before the SHUT mark shows that the crew call the first on a stage, so the talk box has gone by the time the hint needs its place
  shutCueAt: 300,       // PROVISIONAL: px from the bow when the SHUT mark and pull cue show

  // ---- Rocks. moveFrom / moveTo: px from the bow to the rock's near end when its drift starts and stops
  rockLen: [90, 150],   // PROVISIONAL: length along the course. Longest kept inside what a Dive can clear
  rockFar: 460,         // PROVISIONAL: how far a side rock reaches behind the cliff
  rockJag: 7,           // PROVISIONAL: px of roughness in a rock's edge
  rockBulge: 70,        // PROVISIONAL: most a side rock's ends curve back, px
  lenJitter: 20,        // PROVISIONAL: px the far wall of a gate may differ in length
  shiftMin: 60, shiftMax: 120,  // PROVISIONAL: px a gap slides in a 'both walls move' gate
  shiftEdge: 50,        // PROVISIONAL: px a gap keeps from the cliff when choosing which way to slide
  gapEdge: 6,           // PROVISIONAL: px a gap keeps from the cliff
  gapWander: 150,       // PROVISIONAL: most a gap's middle moves from the last one, px
  closeAmt: [28, 56],   // PROVISIONAL: px each wall comes in on a closing gate
  loneW: [96, 136],     // PROVISIONAL: a lone island's width
  loneEnd: [34, 70],    // PROVISIONAL: px from the channel's middle where it ends up
  loneDrift: [50, 90],  // PROVISIONAL: px it drifts
  forkPost: [44, 66],   // PROVISIONAL: px the side rocks of a fork reach out from each side of the screen
  forkOpen: 18,         // PROVISIONAL: px a fork's gap is wider than the stage's gap
  forkGrind: 7,         // PROVISIONAL: px past closing the middle rock slides, so it really grinds
  forkLean: [0.62, 0.38],  // PROVISIONAL: chance a fork shuts the gap on your side, when you're left of the middle or right of it
  forkPostLen: 14,      // PROVISIONAL: px a fork's side rocks are longer than its middle
  slalomLen: [150, 200],   // PROVISIONAL: a slalom wall's length. Longest kept inside what a Dive can clear
  slalomAmt: [36, 64],  // PROVISIONAL: px it leans in
  slalomSlack: 16,      // PROVISIONAL: px of chance on how far it reaches
  firstGate: 620,       // PROVISIONAL: px of open water before the first gate
  endClear: 340,        // PROVISIONAL: px of open water after the last gate
  layFrom: 200,         // PROVISIONAL: px before firstGate the course starts counting
  layAhead: 900,        // PROVISIONAL: px ahead of the ship the course is laid
  layEnd: 300,          // PROVISIONAL: px kept clear of laying before endClear
  bandClearChance: 0.3, // PROVISIONAL: chance of more open water before a gate, on a stage with rips
  bandClear: 150,       // PROVISIONAL: how much more
  humanSpeed: 170,      // PROVISIONAL: px/s of sideways move the course may ask for; well under shipMax, and what the passable check uses
  reactSecs: 0.35,      // PROVISIONAL: reaction the course allows for after a drift starts, with no arrows
  gateSafety: 8,        // PROVISIONAL: px of room the check insists on each side of the hull

  // ---- Hazards
  dropWarn: 1.5,        // PROVISIONAL: seconds of shadow before a boulder lands. Review: 1.15 made stage 2 the wall for a slower player
  dropRadius: 20,       // PROVISIONAL: splash radius. Review, same reason
  dropEvery: 8.5,       // PROVISIONAL: seconds between boulders, stage 2 and endless. Review, same reason
  dropFirst: 3.5,       // PROVISIONAL: seconds before the first boulder
  dropJitter: [0.8, 1.25],  // PROVISIONAL: chance on that gap
  dropRetry: 0.4,       // PROVISIONAL: seconds before trying again when a rock is too close to dodge beside
  dropLaneBefore: 0.7,  // PROVISIONAL: the fairness check starts this long before a boulder lands
  dropLaneAfter: 0.2,   // PROVISIONAL: and ends this long after
  lanceWarn: 1.25,      // PROVISIONAL: red lane before a lance, stage 4 and endless (the boss's own are in boss.warn)
  lanceHalf: 8,         // PROVISIONAL: half width of the lance and its cable
  lanceStay: 1.1,       // PROVISIONAL: seconds the cable stays taut after it strikes, in the boss
  lanceEvery: 6,        // PROVISIONAL: seconds between lances, stage 4
  lanceFirst: 4,        // PROVISIONAL: seconds before the first lance
  lanceJitter: [0.8, 1.2],  // PROVISIONAL: chance on that gap
  lanceRetry: 0.3,      // PROVISIONAL: seconds before trying again when a lance wouldn't be fair
  lanceStageStay: 0.6,  // PROVISIONAL: the cable stays up less long on a stage than in the boss, with gaps to thread
  lanceCross: 0.9,      // PROVISIONAL: seconds allowed to cross where the cable was, before a lance can be fired in front of a gap on its other side
  lanceX: [26, 334],    // PROVISIONAL: how far out a lance may land
  lanceGrace: 2,        // PROVISIONAL: px a cable may brush the hull's side and not count
  bandForce: [60, 95],  // PROVISIONAL: px/s, how hard a rip current shoves
  bandLen: [150, 230],  // PROVISIONAL: length along the course
  bandChance: 0.6,      // PROVISIONAL: chance of a rip before a gate, if there's room
  bandMinRoom: 200,     // PROVISIONAL: px of open water a rip needs
  bandStartGap: 20,     // PROVISIONAL: px a rip keeps from the gates
  bandHullShare: 0.4,   // PROVISIONAL: how much of a rip's shove goes straight to the hull as well as the aim
  // ---- Talk during play (talk.js)
  talkBase: 1.4, talkPerChar: 0.028,  // PROVISIONAL: seconds a box stays: this, plus this per letter
  talkMin: 2, talkMax: 4.2,  // PROVISIONAL: and never less or more than these
  talkGap: 0.2,         // PROVISIONAL: seconds of nothing between boxes
  talkStale: 4,         // PROVISIONAL: seconds a remark may wait before it's dropped
  talkStaleLong: 6,     // PROVISIONAL: for the ones that say something big
  talkStaleShort: 1.5,  // PROVISIONAL: for a reply to a press
  talkCutShare: 0.4,    // PROVISIONAL: a scene line cut off with more than this share still to run is played again
  talkStartBoss: 0.6,   // PROVISIONAL: seconds into the boss before a scene carried in starts

  // ---- Salvage. Kit aim: a stage clear pays about 15 to 40 in all. A Dive for a cache pays over that on purpose: it's what a line buys
  cogValue: 1,          // PROVISIONAL
  cacheValue: 5,        // PROVISIONAL: the drowned ones under a rock, only reachable on a Dive. Three to a cache
  cacheSpread: 26,      // PROVISIONAL: px between the coins of a cache
  cacheInset: 30,       // PROVISIONAL: px a cache sits behind a side rock's edge
  grabRadius: 26,       // PROVISIONAL: px from the hull's middle line
  cacheChance: 0.28,    // PROVISIONAL: chance a gate hides a drowned cache. A shut tooth always does
  cacheMinW: 80,        // PROVISIONAL: a middle rock narrower than this hides nothing
  cogRunChance: 0.75,   // PROVISIONAL: chance of a line of cogs on the way to a gate
  cogGateChance: 0.6,   // PROVISIONAL: chance of a cog in the gap itself
  cogSpacing: 60,       // PROVISIONAL: px of open water per cog, before stage.cogs
  cogWobble: 26,        // PROVISIONAL: px the line of cogs bends off the straight
  pageExtra: 2,         // PROVISIONAL: salvage for a page when the book has no blank row
  pageOff: [70, 118],   // PROVISIONAL: px a page sits off the safe line
  pageBefore: [120, 170],  // PROVISIONAL: px a page sits before its gate
  itemX: [34, 326],     // PROVISIONAL: how far out a cog, cache or mop may sit
  pageX: [40, 320],     // PROVISIONAL: how far out a page may sit
  grabAhead: 8,         // PROVISIONAL: px past bow and stern that still picks a thing up

  // ---- Score
  scoreGate: 50,        // PROVISIONAL
  scoreClean: 25,       // PROVISIONAL: on top, if no knock since the last gate
  scoreCog: 5,          // PROVISIONAL
  scoreCache: 15,       // PROVISIONAL
  scorePage: 100,       // PROVISIONAL
  scoreClear: 200,      // PROVISIONAL
  scoreLine: 120,       // PROVISIONAL: per line left in the book at a clear. A kept line is worth more than a cache to a best score
  scorePlate: 500,      // PROVISIONAL
  scorePerMetre: 1,     // PROVISIONAL: endless only
  metre: 10,            // PROVISIONAL: px per metre on the distance count

  // ---- Pals
  bobbinCalm: 18,       // PROVISIONAL: seconds with no knock and no Dive before it may come up
  bobbinChance: 1,   // Dylan 2026-11-07 "Always when you do it" (was 0.25): chance, once per attempt, when that's met
  bobbinFromStage: 1,   // PROVISIONAL: index, 1 = stage 2
  bobbinSecs: 7,        // PROVISIONAL: how long it stays alongside
  bobbinNear: 52,       // PROVISIONAL: px from the hull that counts as alongside
  bobbinHold: 1.1,      // PROVISIONAL: seconds alongside to catch it
  bobbinOff: 110,       // PROVISIONAL: px from the hull where it comes up
  bobbinX: [50, 310],   // PROVISIONAL: how far out it may come up
  mopChance: 1,       // Dylan 2026-11-07 "Always when you do it" (was 0.4): chance, once per attempt, of a mop tuft on a rock
  mopFromStage: 2,      // PROVISIONAL: index, 2 = stage 3
  mopGate: 3,           // PROVISIONAL: which gate of the stage may hide it
  mopInset: 26,         // PROVISIONAL: px it sits behind a side rock's edge
  mopNear: 40,          // PROVISIONAL: px, how close on a Dive
  mopAlong: 30,         // PROVISIONAL: px past bow and stern that still reaches it
  mopCallAt: 640,       // PROVISIONAL: px ahead when the crew spot it
  palBot: false,        // Test only: 'bobbin' or 'mopclaw' forces the chance and sends the bot after it
};
