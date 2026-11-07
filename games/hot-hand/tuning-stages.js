// Hot Hand numbers, part two: the boss, what's in each stage, and Endless. Part one is tuning.js. Each marked PROVISIONAL or with its source.
// Spec: docs/FRIDAY_BATCH.md, "Hot Hand". Dylan's thumb has not tried any of these yet.
Object.assign(window.TUNE, {
  // ---- The boss (FRIDAY_BATCH.md: "Warden Krell's shield line, with heat-vents to overload"). Lists run by round: first, second, third
  bossRounds: 3,        // PROVISIONAL
  krellBox: { w: 60, h: 113 },   // PROVISIONAL: his tap box. h is 195 cm (FRIDAY_BATCH.md) at pxPerCm
  ventFirst: 1.2,       // PROVISIONAL: seconds until the far shield's vent first whistles
  ventStagger: 2.4,     // PROVISIONAL: and each next shield's vent that much later
  bossAddFirst: 3.5,    // PROVISIONAL: seconds into a round before the first grunt round the side
  bossQuenchFirst: 4,   // PROVISIONAL: seconds into a round before the first quench can
  shieldScore: 150,     // PROVISIONAL: score for blowing a shield
  shieldChip: 1,        // PROVISIONAL: salvage it puts on the table
  shieldBlastR: 90,     // PROVISIONAL: px of blast when one blows
  shieldBlastDmg: 3,    // PROVISIONAL: and how hard it hits
  krellScore: 40,       // PROVISIONAL: score per hit on him, times the tier's multiplier
  krellDownScore: 500,  // PROVISIONAL: score for taking him through a round
  krellTalks: 0.4,      // PROVISIONAL: chance he says something when hit
  lineStart: 412,       // PROVISIONAL: x of the near shield when a round begins: far enough left that Krell, at lineStart + krellX, stands whole on a 16:9 screen with no spare width (he reaches 47 px either side)
  ramX: 216,            // PROVISIONAL: x where the line charges
  marchSecs: [17, 15, 16.5],    // PROVISIONAL: seconds from start to ram. The third is longer than the second because its vents are open for less time and more comes round the side: a clean thumb gets all three shields down at about 15 s there. Runs in NOTES.md
  ramWarn: 4.5,         // PROVISIONAL: seconds of march left when Sela calls the line closing: time for one more go at every vent (2.4 shut, 0.8 whistle, 1.7 open is 4.9 s, plus ramTell)
  ramTell: 1.6,         // PROVISIONAL: warning before it lands
  ramHurt: 3,           // PROVISIONAL: hits to Juno: half of her 6, so a second charge in a fight is the end. This is the line's own threat
  ramBack: 402,         // PROVISIONAL: x the line falls back to afterward
  shieldOff: [130, 65, 0],       // PROVISIONAL: px each shield stands behind the near one, far to near
  shieldW: 66,          // PROVISIONAL: width at the near lane
  shieldH: 104,         // PROVISIONAL: height at the near lane of the shield and the man behind it: his head and top hand show over the plate. Also the tap box
  shieldPlate: 84,      // PROVISIONAL: height of the steel plate itself at the near lane (looks only)
  shieldManX: 4,        // PROVISIONAL: px the man stands behind the plate's middle (looks only)
  ventMid: 44,          // PROVISIONAL: height of the vent's middle at the near lane
  ventNeed: [9, 11, 11],  // PROVISIONAL: pressure that blows a shield. At about 0.75 throws a second at 3 pressure, 33 in all takes about 15 s. The third round was 13, and 39 in all couldn't be done before its charge
  ventPush: [1, 2, 3, 4],       // PROVISIONAL: pressure per throw by tier: cold, warm, hot, hot hand
  ventMark: 2,          // PROVISIONAL: extra pressure when Ashka has marked the vent
  ventShut: [2.6, 2.6, 2.4],    // PROVISIONAL: seconds shut
  ventTell: 0.8,        // PROVISIONAL: whistle and glow before it opens
  ventOpen: [2.4, 2.0, 1.7],    // PROVISIONAL: seconds open
  ventGrace: 0.25,      // PROVISIONAL: seconds after it shuts that a tap still gets in, for a thumb that arrives late
  exposeSecs: [7, 6.5, 6],      // PROVISIONAL: Krell in the open once all three shields are blown
  krellHp: [12, 14, 16],  // PROVISIONAL: damage to take him through a round
  reformGauge: 0.5,     // PROVISIONAL: share of pressure re-raised shields start with if he isn't beaten in time
  krellX: 170,          // PROVISIONAL: px he stands behind the near shield
  addEvery: [2.6, 2.3, 2],  // PROVISIONAL: seconds between grunts slipping round the line
  addTypes: [['grunt', 'grunt', 'runner'], ['grunt', 'runner', 'hook'], ['grunt', 'runner', 'hook', 'plate']],  // PROVISIONAL
  quenchEvery: [0, 9, 7],       // PROVISIONAL: seconds between quench cans. 0 = none
  quenchWind: 1.0,      // PROVISIONAL: his arm back and QUENCH showing
  quenchFly: 1.5,       // PROVISIONAL: in the air. Can be burned
  quenchHeat: 55,       // PROVISIONAL: heat it takes off. It doesn't hurt: it isn't damage, and can't bust a bet
  addMax: 6,            // PROVISIONAL: the most round the sides at once
  bossPurse: 5,         // PROVISIONAL: the table per round

  // ---- The stages. Words are in words.js. mix: how many of each in a wave; gap: seconds between arrivals; cool: multiplies cooling
  stages: [
    { hp: 6, cool: 1, betLimit: 4, lanes: [0, 1, 2], look: 'row', waves: [   // PROVISIONAL: hits, cooling. Low stakes while you learn: hardly anyone gets hit here, so the bet is small
      { mix: { grunt: 6 }, gap: [1.9, 2.6] },                                 // PROVISIONAL: easy: one flame kills, and only the plates ask for heat
      { mix: { grunt: 8, plate: 1 }, gap: [1.5, 2.1] },                       // PROVISIONAL
      { mix: { grunt: 9, plate: 4 }, gap: [1.05, 1.5] },                      // PROVISIONAL: the last wave asks for quicker hands and some heat, so Dice Alley isn't a wall
    ] },
    { hp: 5, cool: 1, tough: 2, lanes: [1, 2], look: 'alley', waves: [        // PROVISIONAL. A narrow street: 2 lanes, so they bunch. Tough 2: a WARM throw no longer kills, a HOT one does, so this is where the heat starts to pay
      { tough: 1, mix: { grunt: 7, runner: 3 }, gap: [1.35, 1.9] },           // PROVISIONAL: tough 1 for this first wave: two cold throws or one warm, a step up from Card Row
      { mix: { plate: 3, hook: 3, squad: 2 }, gap: [1.8, 2.5] },              // PROVISIONAL
      { mix: { grunt: 5, runner: 4, plate: 2, hook: 2, squad: 2 }, gap: [1.2, 1.7] },   // PROVISIONAL
    ] },
    { hp: 5, cool: 1.25, tough: 2, lanes: [0, 1, 2], look: 'table', rain: 110, waves: [   // PROVISIONAL. Rain: she cools 1.25 times as fast, so holding the top takes quick hands, and they come faster than in the alley
      { mix: { grunt: 10, sniper: 3 }, gap: [1.0, 1.4] },                     // PROVISIONAL
      { mix: { grunt: 7, plate: 3, sniper: 4, cart: 1, squad: 2 }, gap: [0.95, 1.3] },   // PROVISIONAL
      { mix: { grunt: 6, plate: 3, hook: 3, sniper: 4, cart: 2, squad: 3 }, gap: [0.8, 1.1] },   // PROVISIONAL
    ] },
    { hp: 5, cool: 0.7, tough: 1, both: true, lanes: [0, 1, 2], look: 'pit', waves: [   // PROVISIONAL. The Pit: fire all round, she cools slowly, they come from both sides
      { mix: { grunt: 9, hollow: 3 }, gap: [1.2, 1.7] },                      // PROVISIONAL
      { mix: { grunt: 6, runner: 6, hollow: 4, cart: 2 }, gap: [1.0, 1.5] },  // PROVISIONAL
      { mix: { grunt: 5, plate: 4, hook: 3, hollow: 5, squad: 4, cart: 2 }, gap: [1.0, 1.4] },  // PROVISIONAL
    ] },
    { boss: true, hp: 6, cool: 1, tough: 1, lanes: [0, 1, 2], look: 'vault' },  // PROVISIONAL: "takes a few tries" (spec)
  ],
  endless: { hp: 6, cool: 1, lanes: [0, 1, 2], look: 'row', isEndless: true },  // PROVISIONAL
  endlessBase: 7,       // PROVISIONAL: foes in the first Endless wave
  endlessGrow: 1.6,     // PROVISIONAL: more each wave
  endlessGap: [1.6, 2.2],       // PROVISIONAL: seconds between arrivals, first wave
  endlessGapMin: 0.7,   // PROVISIONAL: the fastest it gets
  endlessShrink: 0.08,  // PROVISIONAL: taken off the gap each wave
  endlessMods: [1, 1.5, 0.7],   // PROVISIONAL: the cooling cycles through plain, rain, fire
  aliveMax: 12,          // PROVISIONAL: arrivals wait when this many are up
  endlessToughEvery: 3, // PROVISIONAL: Endless: foes take one more damage every this many waves
  endlessToughMax: 3,   // PROVISIONAL: and no more than this
});
