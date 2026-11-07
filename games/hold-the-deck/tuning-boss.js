// Hold the Deck numbers: the boss. The rest of the numbers are in tuning.js; split off because that file passed the batch's 200 lines. Each marked PROVISIONAL or with its source. Dylan's thumb has not tried any of these yet.
// ---- The boss (spec: "breaks through the deck in phases; Hekka speaks at the end"). Three phases, a meal between each.
TUNE.boss = {
  pawHp: 16,   // PROVISIONAL: phase 1, swings on the paws. Three to five paws' worth
  pawWarn: 0.95,       // PROVISIONAL: planks lift and the lane lights before a paw bursts through. Plus the extra time one lane's walk takes him at his grey (HD.greyWarn), so the bear's warnings are short but never out of reach
  pawHurt: 2,         // PROVISIONAL: Guts if it comes up under him
  firstPaw: 0.6,      // PROVISIONAL: seconds after the hint before the first one
  firstTrickle: 0.5,  // PROVISIONAL: and before the first boarder
  quakeEvery: 4,      // PROVISIONAL: every this many paws it shakes the whole deck instead: a volley
  maxBoarders: 3,     // PROVISIONAL: it stops sending them at this many on deck
  runnerShare: 0.3,   // PROVISIONAL: share of runners in the trickle from phase 2
  diveSecs: 2.8,      // PROVISIONAL: the deck goes quiet before the first meal, long enough for Ione's line
  toMeal2Secs: 2.8,   // PROVISIONAL: and before the second, long enough for Sela's
  pawUp: 1.6,         // PROVISIONAL: seconds a paw stays up to be hit
  pawStun: 1.2,       // PROVISIONAL: extra if it broke on Iron
  pawGap: [0.3, 0.6], // PROVISIONAL: seconds until the next one
  pawD: 0.74,         // PROVISIONAL: where it comes up
  pawAimBram: 0.85,    // PROVISIONAL: chance it comes up in the lane he's in
  trickle2: [2.0, 2.8],   // PROVISIONAL: seconds between boarders while it's attacking. Fewer than before the review: the door was doing the bear's job, and a slow thumb never got to the bear
  trickleIronEase: 1.0, // PROVISIONAL: at full iron the gap between boarders is this much longer (at 50%, half this). The grey still costs, but a slow Bram isn't simply swamped, which is what made high grey a wall
  pawKillD: 0.55,     // PROVISIONAL: a boarder this far down the lane is under a paw when it comes up
  burstSecs: 2.0,     // PROVISIONAL: the bear coming up through the far deck
  standD: 0.42,       // PROVISIONAL: where it stands, chained, in phase 2. Far enough down that its head clears a two-line talk box on a phone with no spare height (y 86 to 130)
  swipeWarn: 0.95,    // PROVISIONAL: a paw raised and two lanes lit, before the claws rake them. Plus HD.greyWarn
  swipeAimBram: 0.6,  // PROVISIONAL: chance the first lit lane is the one he's in
  swipeGap: [0.2, 0.5], // PROVISIONAL: seconds between rakes
  swipeHurt: 3,       // PROVISIONAL: Guts if it catches him
  rakeAllEvery: 5,    // PROVISIONAL: every this many attacks (rakes, then charges), it rakes all three lanes: a volley
  firstRake: 0.4,     // PROVISIONAL: seconds after the hint before the first rake
  nextRake: 1.0,      // PROVISIONAL: and after it's got back up
  temperPerSec: 0.035, // PROVISIONAL: Grist's meter in phases 2 and 3 fills this fast by itself
  temperIronMul: 1.2, // PROVISIONAL: and at full iron this much faster again (at 50%, half this). He feels it through the bond. A locked Bram can't block for meter, and only Grist can knock the bear down
  temperHit: 0.05,    // PROVISIONAL: per hit on a paw
  temperKillMul: 0.5, // PROVISIONAL: boarders are worth this share of their usual meter here, there are so many of them
  temperBlock: 0.35,  // PROVISIONAL: for a rake stopped with Iron
  knockReach: 0.14,   // PROVISIONAL: how close Grist gets before he hits it
  coreReach: 0.05,    // PROVISIONAL: the same, at an open core in phase 3
  fallSecs: 0.5,      // PROVISIONAL: its slide down the deck when Grist knocks it over
  openD: 0.69,        // PROVISIONAL: where it ends up, inside the gold line
  openSecs: 2.0,   // PROVISIONAL: the core is open this long after Grist. About seven swings at most with no iron, so it takes three knocks
  rearSecs: 1.0,      // PROVISIONAL: its way back up the deck
  coreP2: 20,         // PROVISIONAL: hits on the core in phase 2
  coreP3: 26,         // PROVISIONAL: hits on the core in phase 3
  snapSecs: 2.0,      // PROVISIONAL: the chain breaking
  snapChainAt: 1.0,   // PROVISIONAL: when in that it goes
  snapSlideSecs: 0.8, // PROVISIONAL: its way back to the far end first
  chargeWarn: 0.45,   // PROVISIONAL: it rears at the far end, the lane lit. The lane stays lit through chargeRun too, so the warning is 0.95 s in all, plus HD.greyWarn
  afterVolley: 0.7,   // PROVISIONAL: extra seconds after it shakes or rakes everything, before its next attack. Coming off Iron and straight into a charge was the worst place on the bar to be, and it made half grey harder than nearly full
  chargeGap: 0.2,     // PROVISIONAL: seconds at the far end between charges
  chargeRun: 0.5,     // PROVISIONAL: seconds it takes to come down the lane
  chargeHurt: 3,      // PROVISIONAL: Guts if it runs Bram over without Iron
  skidPast: 0.09,     // PROVISIONAL: how far past the core's spot it skids
  openDodged: 0.9,   // PROVISIONAL: core open after it skids past a Bram who moved. Plus the extra time one lane's walk takes him at his grey, so getting there stays possible
  openHit: 0.9,       // PROVISIONAL: after it ran him over
  openKnocked: 1.8,  // PROVISIONAL: after Grist knocked it down in phase 3
  openGrey: 1.5,       // PROVISIONAL: after Grist, it stays open this many of his grey's extra swing-time longer, so a slow Bram gets his swings in. It's what keeps deep grey from being a wall in phase 2
  openIron: 2.6,      // PROVISIONAL: after it ran into Iron
  gristCore: 3,       // PROVISIONAL: hits Grist does to an open core in phase 3
  gristPaw: 4,        // PROVISIONAL: what Grist does to a paw in his lane, so a charge pressed in phase 1 is never wasted
  temperPhase2: 1,    // PROVISIONAL: his meter when the bear comes up. Only Grist can knock it into reach, so phase 2 never starts on an empty meter, whatever was spent under the planks
  collapseSecs: 5.2,  // PROVISIONAL: the bear going down and Hekka's last words, before the win
  fallAt: [0.4, 2.0, 3.6],   // PROVISIONAL: when each of those words comes
  mercyPerLoss: 2,    // PROVISIONAL: dying on the bear leaves this many more Guts for the next try. Stages 1 to 4 keep tuning.js's one. The batch asks for "a few tries", and one a go left a slow thumb at 3 wins in 20 at best, on its full 8 Guts
  mercyMax: 6,        // PROVISIONAL: up to this many
  woundPerLoss: 0.12, // PROVISIONAL: and the bear keeps its wounds: it starts the next try this share weaker, paws and core alike. The BEAR bar starts short by the same, so it shows. The grey is the bond cost and stays; this is what eases instead
  woundMax: 4,        // PROVISIONAL: for up to this many tries lost. The bear never starts under 52%
  adviceFrom: 2,      // PROVISIONAL: tries lost on it, from half grey (ironLineAt), before Ione says what can be done about the grey
  scoreHit: 40,       // PROVISIONAL
  say: { p1: 3, p2a: 2, p2b: 2.2, bram2: 3, knocked: 2.4, block: 2.6, run: 2, closed: 2, p3: 2.2, bram3: 3, fall: 1.6 },   // PROVISIONAL: how long each of its lines stays up in play
};
