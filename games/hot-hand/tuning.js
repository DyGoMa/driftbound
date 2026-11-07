// Hot Hand numbers. Every number the game plays by lives here or, for the boss, the stages and Endless, in tuning-stages.js, each marked PROVISIONAL or with its source.
// Spec: docs/FRIDAY_BATCH.md, "Hot Hand". Heights: CAST.md and docs/FRIDAY_BATCH.md. Dylan's thumb has not tried any of these yet.
window.TUNE = {
  // ---- The street (logical 640 x 360, the kit's sideways size). Three lanes in depth, which run together toward Juno.
  pxPerCm: 0.58,        // PROVISIONAL: Juno's 165 cm (CAST.md) is 96 px, a trooper's 180 cm is 104 px, Krell's 195 cm is 113 px
  frontY: 288,          // PROVISIONAL: feet line of the nearest lane. The felt below it holds the read-outs and the talk box
  lanes: [{ y: 212, s: 0.62 }, { y: 250, s: 0.8 }, { y: 288, s: 1 }],   // PROVISIONAL: far, middle, near: feet line and size
  funnelFar: 280,       // PROVISIONAL: px from Juno where the lanes start running together
  funnelNear: 70,       // PROVISIONAL: and where they have become one
  junoX: 66,            // PROVISIONAL: Juno's spot, stages 1, 2, 3 and the boss
  junoMidX: 320,        // PROVISIONAL: her spot in the Pit, with foes coming from both sides
  spawnD: 664,          // PROVISIONAL: px from Juno that foes start: x = 730, just off a 19.5:9 phone's right edge
  spawnDMid: 420,       // PROVISIONAL: the same in the Pit: x = 740 and x = -100
  botEdge: 620,         // PROVISIONAL: the bot waits for a foe to be this far in, so it's on screen at any size

  talkClear: 13,        // PROVISIONAL: px Juno's feet stand above the talk box in a talk scene, enough to clear her chips too (looks only)
  hurtNumSide: 34,      // PROVISIONAL: px to the side of Juno her hurt number starts, away from Ashka (looks only)
  hurtNumUp: 84,        // PROVISIONAL: px above her feet it starts (looks only)
  ashkaClearX: 62,      // PROVISIONAL: px either side of Juno where Ashka has to fly above her head (looks only)
  ashkaClearY: 124,     // PROVISIONAL: and how far above Juno's feet that is: her 96 px, plus the drawn bird's reach below her centre (looks only)
  floatTable: 20,       // PROVISIONAL: px over a target's box that "+1 TABLE" starts; its damage number sits right on the box (looks only)
  floatCog: 38,         // PROVISIONAL: and the same for "+1 COG", one line higher again (looks only)
  hintSize: 15,         // PROVISIONAL: logical px of the first-wave hint: 13.3 CSS px on a 568 x 320 phone, the kit's scale there being 0.8875
  hintWide: 590,        // PROVISIONAL: logical px wide before a hint breaks onto two lines
  hintSecs: 9,          // PROVISIONAL: seconds into a stage the hint stays up, while the first troopers walk in
  bannerSecs: 1.5,      // PROVISIONAL: "WAVE 1" stays up this long (looks only)
  quenchedSecs: 0.9,    // PROVISIONAL: how long the screen stays cold-blue and the bar says QUENCHED (looks only)
  deadTapSecs: 0.3,     // PROVISIONAL: how long the palm jolts at a tap while her hands are locked (looks only)
  loseBeat: 1.1,        // PROVISIONAL: seconds between her going down and the lose screen
  bossWinBeat: 1.4,     // PROVISIONAL: seconds between Krell's last round and the win screen
  krellGetsBurnLoss: 0.5, // PROVISIONAL: chance a burn-out at the boss gets one of his own lose lines, not a burn line
  chipsBack: 50,        // PROVISIONAL: px behind Juno that her chips sit, clear of her feet in every pose (looks only)
  chipsNear: 8,         // PROVISIONAL: px nearer us than her feet, so she can lie down without lying on them (looks only)
  krellPortrait: { x: 0.24, y: 3.95, h: 4 },  // PROVISIONAL: where his picture sits in the talk portrait's square: across, feet line and his height, as shares of the square (looks only)
  flashWhite: 0.85,     // PROVISIONAL: how white a figure goes when hit, for its 0.14 s (looks only)

  saySecs: 3.4,         // PROVISIONAL: how long a line stays up in play (looks only)
  sayHold: 2,           // PROVISIONAL: seconds a line is safe from being replaced by the next (looks only)
  sayStale: 3,          // PROVISIONAL: seconds a waiting line can wait before it gives way to a newer one (looks only)

  // ---- Tap targets. 44 px on a 568 x 320 phone is 49.6 logical px (the kit's scale there is 0.8875)
  minHalfW: 25,         // Task rule: every tap target at least 44 px on phones. Half width, so 50 logical px across
  minTall: 50,          // Task rule, as above
  tapReach: 10,         // PROVISIONAL: px outside a target that still counts as touching it
  projReach: 30,        // PROVISIONAL: radius for tapping something in the air: 60 logical px across
  projLag: 0.35,        // PROVISIONAL: a tap counts if it lands where a thing in the air was this many seconds ago, because a thumb arrives late at something moving 200 to 500 px/s
  projLagStep: 0.05,    // PROVISIONAL: how finely that path is checked

  // ---- The bond cost (FRIDAY_BATCH.md: each throw raises heat; too hot locks the hands and burns; heat makes throws stronger)
  heatMax: 100,         // PROVISIONAL: the top of the bar
  throwHeat: 16,        // PROVISIONAL: heat per throw
  cool: 12,             // PROVISIONAL: heat lost per second. So at the top, one throw every 1.33 s holds steady
  warmAt: 35,           // PROVISIONAL: heat where throws turn WARM: 2 damage, goes through a plate
  hotAt: 70,            // PROVISIONAL: heat where throws turn HOT: 3 damage, burns what stands near the target
  edgeAt: 78,           // PROVISIONAL: heat where a throw is a HOT HAND: as HOT, wider burn, the best score and table pay
  // A throw above heatMax - throwHeat (84) goes over the top. So HOT HAND is the band from 78 to 84: about half a second wide when cooling at 12 a second.
  dmg: [1, 2, 3, 3],    // PROVISIONAL: damage by tier: cold, warm, hot, hot hand
  scoreX: [1, 2, 3, 5], // PROVISIONAL: score multiplier by tier
  burnR: [0, 0, 58, 82],// PROVISIONAL: px of burn around the target by tier
  burnDmg: 1,           // PROVISIONAL: damage to others in the burn
  flySpeed: 1100,       // PROVISIONAL: px/s of a thrown flame

  // ---- Going over the top
  lockSecs: 1.8,        // PROVISIONAL: "her hands lock for a moment" (FRIDAY_BATCH.md)
  lockPerBurn: 0.1,     // PROVISIONAL: a little longer for each burn already carried this story run
  lockMin: 0.5,         // PROVISIONAL: the shortest a lock can be, whatever the upgrades
  burnsMax: 3,          // PROVISIONAL: how many burns the palm can show and count
  afterLock: 74,        // PROVISIONAL: heat when the lock lets go. No cooler than waiting it out would have left her (72 to 77 from 90), so going over the top never buys relief
  burnHurt: 1,          // PROVISIONAL: "she takes burn damage" (FRIDAY_BATCH.md)
  blowoutR: 110,        // PROVISIONAL: the throw that goes over the top still flies, and blows out this far round the target
  blowoutDmg: 1,        // PROVISIONAL: and hits everything there this hard: a parting shot, not a way to clear the screen

  // ---- Ashka (FRIDAY_BATCH.md: "spots and marks weak targets for bonus")
  markFirst: 3,         // PROVISIONAL: seconds into an attempt before her first mark
  markEvery: [4.5, 6.5],// PROVISIONAL: seconds between marks
  markRetry: 0.4,       // PROVISIONAL: seconds before she looks again if nothing was there to mark
  markSecs: 5,          // PROVISIONAL: how long a mark lasts
  markRefund: 12,       // PROVISIONAL: heat she takes off when a marked target is hit. A throw at a mark also adds no heat
  markTable: 1,         // PROVISIONAL: extra salvage on the table per marked kill
  flyHome: { x: 96, y: 150 }, // PROVISIONAL: where she circles when not spotting (looks only)
  ashkaBeside: 54,      // PROVISIONAL: px to the side of her target she hovers (looks only)
  ashkaDrop: 14,        // PROVISIONAL: px under the top of its box (looks only)
  // Where Juno's hands are in each picture: [across, up], as shares of her height from between the feet, near hand first. PROVISIONAL starting guesses: measure them when the pictures exist (art/REQUEST.md)
  picHands: { idle: [[0.1, 0.53], [0.19, 0.6]], hot: [[0.1, 0.6], [0.21, 0.615]], throw: [[[-0.185, 0.94]], [[0.366, 0.9]], [[0.475, 0.775]]], locked: [[0.06, 0.637], [0.085, 0.61]], hurt: [[-0.235, 0.48], [0.226, 0.62]] }, // Measured from art/: [across, up] as shares of her height from between her feet, near hand first. throw is one list per frame
  picMark: { idle: [0.025, 0.77], hot: [0.05, 0.63], throw: [[0.02, 0.755], null, null], locked: [0.11, 0.745], hurt: [-0.012, 0.74] }, // Measured from art/: where the bond mark is in each picture, for the glow. null: her back is to us in that frame

  // ---- Juno
  hpStages: 5,          // PROVISIONAL: hits per attempt, where the stage doesn't say
  invuln: 0.6,          // PROVISIONAL: seconds of safety after being hit, so two swings can't land together
  hurtSecs: 0.45,       // PROVISIONAL: how long her hurt pose shows
  throwSecs: 0.26,      // PROVISIONAL: length of the throw pose (looks only)

  // ---- Foes. hp, speed px/s; armour = lowest tier that gets through
  foes: {
    grunt: { hp: 1, speed: 55, score: 20, cm: 180 },                 // PROVISIONAL
    plate: { hp: 2, speed: 42, armour: 1, score: 40, cm: 180 },      // PROVISIONAL: a cold throw bounces
    runner: { hp: 1, speed: 110, score: 30, cm: 180 },                // PROVISIONAL
    hook: { hp: 1, speed: 55, score: 40, cm: 180, throwD: [230, 340], throwDMid: [170, 240] }, // PROVISIONAL: stops this far off and throws
    sniper: { hp: 1, score: 40, cm: 180, s: 0.62 },                  // PROVISIONAL: in the upper windows. s: his size up there
    cart: { hp: 1, speed: 30, score: 10, cm: 120 },                  // PROVISIONAL: a powder cart. Pusher's in the rules below
    hollow: { hp: 2, speed: 150, score: 60, cm: 110 },               // PROVISIONAL: speed during a bound
  },
  stops: [122, 94, 68], // PROVISIONAL: px from Juno each lane stops at, far to near
  queueGap: 32,         // PROVISIONAL: px kept between foes in a lane when they queue up
  swingHurt: 1,         // PROVISIONAL: hits to Juno from a blade or a bite
  airHurt: 1,           // PROVISIONAL: hits to Juno from a hook or a bolt
  airScore: 15,         // PROVISIONAL: score for burning something in the air
  tellSecs: 0.9,        // PROVISIONAL: "!" and the blade up, before a swing lands. Kill him in this time and it never lands
  swingGap: 1.1,        // PROVISIONAL: seconds after a swing before the next "!"
  hookWind: 1.3,        // PROVISIONAL: arm back and ring closing before a hook flies
  hookFly: 1.1,         // PROVISIONAL: seconds in the air. Can be burned on the way
  hookRest: 2.8,        // PROVISIONAL: before he winds up again
  hookArc: 70,          // PROVISIONAL: px high at mid-flight
  sniperStart: 0.5,     // PROVISIONAL: at most this many seconds behind the shutters when he arrives
  sniperShutter: 0.4,   // PROVISIONAL: shutters open
  sniperAim: 1.6,       // PROVISIONAL: he's aiming, ring closing
  sniperFly: 1.0,       // PROVISIONAL: bolt in the air. Can be burned
  sniperHide: 2.6,      // PROVISIONAL: behind the shutters before the next window
  windows: [[208, 144], [278, 118], [348, 144], [418, 118], [488, 144], [558, 118]],  // PROVISIONAL: where they lean out, feet-line x, y on the Long Table's upper floor. Clear of the top read-outs and the pause button
  cartPushBack: 34,     // PROVISIONAL: px the pusher walks behind the cart
  cartR: 120,           // PROVISIONAL: blast radius
  cartDmg: 3,           // PROVISIONAL: to everything in it
  cartHurt: 2,          // PROVISIONAL: hits to Juno if it gets to her
  cartReach: 104,       // PROVISIONAL: px from Juno it goes up at
  cartFuse: 1.4,        // PROVISIONAL: seconds of sparks and warning before it goes up on arrival
  hollowBound: 0.55,    // PROVISIONAL: seconds of a bound. Plates shut: throws clang
  hollowOpen: 1.2,      // PROVISIONAL: seconds stopped with its plates parted: core open
  hollowStopExtra: 30,  // PROVISIONAL: px further off a Hollow stops, being longer than a man
  hollowTell: 0.8,      // PROVISIONAL: crouch before it bites
  hollowBite: 1.2,      // PROVISIONAL: before the next crouch
  squadSize: 3,         // PROVISIONAL: a squad is this many grunts close together, so a burn pays
  squadGap: 36,         // PROVISIONAL: px apart

  // ---- Salvage. Kit aim: a stage clear pays about 15 to 40 in all
  cogEvery: 10,         // PROVISIONAL: every this many kills drops a cog: paid at once, whatever happens next. So a lost attempt still earns
  cogValue: 1,          // PROVISIONAL: what a cog pays
  leftChance: 0.5,      // PROVISIONAL: in the Pit, the chance a foe or pal comes from the left
  sniperToughMax: 1,    // PROVISIONAL: a window shooter takes at most this much of a stage's extra toughness
  purse: 4,             // PROVISIONAL: the table pays this much for each wave at least. So cashing in every time clears a stage for 12 and the cogs at the very least, and more with what a good wave adds (kit aim: 15 to 40; measured in NOTES.md)
  hotKillsPerChip: 2,   // PROVISIONAL: every this many kills at HOT or better puts hotKillChip more on the table
  hotKillChip: 1,       // PROVISIONAL
  edgeTable: 1,         // PROVISIONAL: and a HOT HAND kill adds 1 on top
  purseMaxExtra: 3,     // PROVISIONAL: the most those can add in one wave, so playing hot pays: this is the heat's reward on the table
  betX: 2,              // Spec: double or nothing
  betXPerLevel: 0.25,   // PROVISIONAL: Loaded Deck, extra payout per level: 2.25, 2.5, 2.75
  betLimit: 6,          // PROVISIONAL: the most the house will take on one bet, and the card says so. Keeps a perfect stage inside the kit's 40, and stops Endless doubling for ever. What's over it is paid out safe. A stage can set its own (Card Row: 4)
  betLimitPerLevel: 0,  // PROVISIONAL: Loaded Deck: a bigger bet per level. 0: it pays better on the same bet (the spec's "better bet payout"), which keeps a full set of upgrades near the kit's aim
  endlessPurse: 2,      // PROVISIONAL: the table's floor in Endless, per wave

  // ---- Upgrades
  coolPerLevel: 0.1,    // PROVISIONAL: Cool Palms: extra cooling per level. Was 0.15, which let a bought-up player mostly ignore the bar. Runs in NOTES.md
  lockPerLevel: 0.15,   // PROVISIONAL: Cool Palms: seconds off the lock per level
  flamePerLevel: 0.25,  // PROVISIONAL: Bigger Flame: wider burn per level
  warmBurn: 44,         // PROVISIONAL: Bigger Flame, level 2 up: WARM throws burn this far too
  hotDmg3: 1,           // PROVISIONAL: Bigger Flame, level 3: extra damage for HOT and HOT HAND

  // ---- Score
  scoreWave: 100,       // PROVISIONAL
  scoreClean: 150,      // PROVISIONAL: wave taken with no damage

  // ---- Timing between waves
  firstWave: 1.6,       // PROVISIONAL: seconds of calm before the first wave's first foe
  nextWave: 0.6,        // PROVISIONAL: and before the first foe of any later wave
  clearBeat: 1.1,       // PROVISIONAL: wave cleared, before the bet
  gapSecs: 1.4,         // PROVISIONAL: bet placed, before the next wave
  bustSecs: 1.8,        // PROVISIONAL: how long BUST stays on screen

  // ---- Pals. Rare, and each asks for the thing the game is about
  cinderHot: 14,        // PROVISIONAL: seconds at HOT or better in one attempt before Cinderbun comes to the warmth
  cinderChance: 0.12,   // PROVISIONAL: chance when that happens, once per attempt
  cinderCatch: 78,      // PROVISIONAL: the heat it must be touched at: the HOT HAND band (edgeAt) or above, so it can't be caught by accident
  cinderFromStage: 1,   // PROVISIONAL: index, 1 = stage 2
  cinderSecs: 9,        // PROVISIONAL: how long it stays before it wanders off
  diceStake: 6,         // PROVISIONAL: at least this riding when a wave starts: the house's whole limit...
  diceChance: 0.12,     // PROVISIONAL: ...and this chance Dicemite comes for a look
  diceFromStage: 1,     // PROVISIONAL: index, 1 = stage 2
  diceSecs: 9,          // PROVISIONAL: how long it stays
  dicePipSecs: 0.42,    // PROVISIONAL: its shell rolls a new number this often. Tap on a six
  diceMisses: 3,        // PROVISIONAL: wrong tries before it runs off
  palSpeed: 42,         // PROVISIONAL: px/s
  palStart: 400,        // PROVISIONAL: px from Juno a pal comes in
  palStartMid: 240,     // PROVISIONAL: the same in the Pit
  palWalkIn: 1,         // PROVISIONAL: seconds at full speed, before it slows to look around
  palLook: 0.25,        // PROVISIONAL: its speed then, as a share
  palLeave: 2.4,        // PROVISIONAL: its speed going away, as a share
  palGone: 2.5,         // PROVISIONAL: seconds after leaving until it's gone
  palFlee: 2,           // PROVISIONAL: seconds until a scared Dicemite is gone
  palHalfW: 25,         // Task rule (44 px on phones): half the width of a pal's tap box
  palTall: 56,          // PROVISIONAL: how far above its feet a tap counts
  palTallDice: 76,      // PROVISIONAL: Dicemite's, which takes in the number over it
  palBelow: 8,          // PROVISIONAL: and how far under them

  // ---- Test bot only. Reaction and rate are what it's allowed; see tools/fairness.js
  botHuman: null,       // the fairness script sets { react, taps, sloppy }. null = the plain bot
  botPals: false,       // the pal test sets 'cinderbun' or 'dicemite'
  botBet: null,         // the tests set 'cash', 'half' or 'all'. null = decides by how hurt it is
  botCap: null,         // the fairness script's cautious bots: the highest heat it will throw at
  botIgnoreHeat: false, // the fairness script's button masher
  botRushX: 140,        // PROVISIONAL (test bot only): the plain bot stops waiting for heat once the line is this close to charging
  botRate: 0.2,         // PROVISIONAL (test bot only): seconds between the plain bot's taps: 5 a second
};
