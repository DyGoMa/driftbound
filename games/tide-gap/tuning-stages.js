// Tide Gap numbers, part two: the boss, the five stages, endless and the test bot. Every number marked PROVISIONAL or with its source. The rest is in tuning.js.
Object.assign(window.TUNE, {
  // ---- The boss. Spec: "fires harpoon-lances and drops pylons; Dive under the hull and burst up through its weak plates"
  boss: {
    shipY: 490,         // PROVISIONAL: the hull sits lower here, so the cutter has room, and still clears the talk box
    towLen: 150,        // PROVISIONAL: Vesh is bunched up for the fight
    cutterY: 212,       // PROVISIONAL: middle of the cutter
    cutterHalfW: 64,    // PROVISIONAL
    cutterHalfLen: 92,  // PROVISIONAL
    startY: -160,       // PROVISIONAL: where the cutter comes on from
    strafe: [100, 260], // PROVISIONAL: where the cutter's middle swings between
    strafeSecs: [9, 7, 5.5],    // PROVISIONAL: seconds for one full swing and back, by round
    enterSecs: 2.2,     // PROVISIONAL
    plates: [[-34, -16], [34, -16], [0, 40]],   // PROVISIONAL: x, y from the cutter's middle
    plateNear: 30,      // PROVISIONAL: px sideways from a plate that counts as under it
    chargeSpeed: 250,   // PROVISIONAL: px/s, how fast Vesh hauls you under the hull
    reachLine: 108,     // PROVISIONAL: px below the cutter's middle where a burst can reach the plates
    chargeStop: 34,     // PROVISIONAL: px above that line where the haul stops
    returnSpeed: 170,   // PROVISIONAL: px/s, back to your place after a burst
    // By round (plates broken so far). warn is the red lane before a lance. volley is a list of moves, one every gap seconds. open is how long the plates glow.
    warn: [1.3, 1.14, 1.06],   // PROVISIONAL: with a full book. test/fairness.js. Fourth review: was 1.35, 1.2, 1.1, and the boss fell first try to a quick script. This is the most test/fairness.js lets through (1.3, 1.12, 1 made a 0.5 s player never win on 2 lines) and it's a small move: NOTES.md
    warnPerLine: 0.04,  // PROVISIONAL: seconds of red lane lost for each line gone from the book. With the chain arrows (sense[].lead), this is what a thin book costs here. A blank book's last round is 0.82, about the least a 0.5 s player can dodge
    gap: [1.5, 1.24, 1.06],     // PROVISIONAL: same review, was 1.55, 1.3, 1.1
    firstMove: 0.7,     // PROVISIONAL: seconds from the cutter arriving to its first shot
    afterOpen: 0.5,     // PROVISIONAL: seconds from the plates shutting to the next shot
    afterStagger: 0.8,  // PROVISIONAL: seconds from a stagger to the next shot
    retryMove: 0.12,    // PROVISIONAL: seconds before trying again when a shot wouldn't be fair
    volley: [['lance', 'lance', 'pylon'], ['lance', 'fan', 'pylon', 'lance', 'fan'], ['fan', 'lance', 'pylon', 'fan', 'lance', 'pylon']],  // PROVISIONAL
    open: [5.5, 5, 4.5],        // PROVISIONAL
    openLance: [0, 2.6, 2.1],   // PROVISIONAL: seconds between lances while the plates glow, by round; 0 is none. So the surface is never quite safe
    openLanceFirst: 1,  // PROVISIONAL: seconds into the glow before the first of those
    cableClear: 0.75,   // PROVISIONAL: seconds a lane must be free of cables before a new lance lands. At 0.5 every player under the book took the same hit from a fan into a lance, whatever the book said. Tested by test/fairness.js
    staggerSecs: 1.4,   // PROVISIONAL
    fallSecs: 2.4,      // PROVISIONAL
    fallTalkMax: 14,    // PROVISIONAL: most seconds she takes to sink while a scene still owed plays out
    fallDrift: 8,       // PROVISIONAL: px/s the wreck slides as it goes
    pylonSpeed: 112,    // PROVISIONAL: px/s down the screen. About 1.3 s from the cutter's bow to the hull, which is short of a full crossing with no warning: that's what the chain arrows are for
    pylonR: 11,         // PROVISIONAL: px, a pylon post
    pylonLand: 170,     // PROVISIONAL: px past the hull's place where a chain is gone
    chainGap: 112,      // PROVISIONAL: width of the way through a pylon chain
    chainPost: 4,       // PROVISIONAL: px from the way through to the pylon's post
    chainGrace: 6,      // PROVISIONAL: px of bow and stern a chain may brush and not count
    chainSideGrace: 2,  // PROVISIONAL: px of the hull's side a chain may brush and not count
    chainClear: 4,      // PROVISIONAL: px past the hull a chain must be before the next thing fires
    chainFarOdds: [0.7, 0.3],   // PROVISIONAL: chance the way through is on the left, when you're right of the middle or left of it
    fanSpread: 96,      // PROVISIONAL: px between the two lanes of a fan
    pageEvery: 8,       // PROVISIONAL: seconds between loose pages when the book is empty, so a boss can always be finished. A plate only shakes one loose then, too
    pageSpeed: 100,     // PROVISIONAL: px/s down the screen
    pageOffset: 80,     // PROVISIONAL: px from the hull where a loose page falls
    pageDrift: 22,      // PROVISIONAL: px/s a loose page wanders sideways
    pageBelow: 30,      // PROVISIONAL: px below a broken plate where its page starts
    pageGrab: 6,        // PROVISIONAL: px wider than a stage's page the grab is, since these move
    jabFirst: 5,        // PROVISIONAL: seconds of volley before Hekka's first jab
    jabEvery: 9,        // PROVISIONAL: seconds between jabs
  },

  // ---- The five stages. Words are in words.js. length in px of course; at speed about 40 to 60 s each. shut: where its shut teeth fall, as a share of the length. pagesAt: where its pages fall, the same way
  stages: [
    { length: 4400, speed: 105, gap: [130, 170], moveFrom: 250, moveTo: 70, spacing: [250, 330], mix: { shift: 4, close: 3, lone: 3 }, shut: [0.58], pagesAt: [0.78], cogs: 0.8, clearSalvage: 11, lockDive: true, look: 0 },  // PROVISIONAL: easy. Drifts start early enough that you barely need the arrows yet
    { length: 5600, speed: 118, gap: [100, 128], moveFrom: 125, moveTo: 40, spacing: [200, 270], mix: { fork: 6, shift: 2, close: 2 }, shut: [0.6], pagesAt: [0.8], cogs: 0.6, clearSalvage: 12, drops: true, look: 1 },      // PROVISIONAL: drifts now start too late to read by eye alone
    { length: 6400, speed: 130, gap: [92, 112], moveFrom: 112, moveTo: 30, spacing: [160, 220], mix: { slalom: 4, fork: 5, close: 1 }, shut: [0.55], shutPaid: 1, pagesAt: [0.6], cogs: 0.38, clearSalvage: 14, fog: { clear: 145, thick: 230 }, look: 2 },  // PROVISIONAL
    { length: 7000, speed: 140, gap: [92, 112], moveFrom: 165, moveTo: 40, spacing: [215, 285], mix: { fork: 3, shift: 3, close: 2, slalom: 2 }, shut: [0.35, 0.72], shutPaid: 1, pagesAt: [0.45], cogs: 0.4, clearSalvage: 16, bands: true, lances: true, look: 3 },  // PROVISIONAL: with planks that last, a story run with no Tougher Hull comes in on 2 and can't reach the boss without a Dive here. Five teeth in all with one on stage 3: the best no-upgrade run spends 4 lines including the boss, so the Kaito line can still be kept. shutPaid: the last teeth drop out if nothing can pay for a Dive, so a blank book still meets the fairness bar
    { boss: true, speed: 120, clearSalvage: 26, look: 4 },   // PROVISIONAL: "takes a few tries" (spec)
  ],
  endless: { speed: 118, ramp: 0.55, maxSpeed: 176, gap: [116, 134], gapMin: 86, gapShrink: 0.0016, moveFrom: 155, moveTo: 45, spacing: [205, 275], mix: { fork: 4, shift: 3, close: 3, slalom: 2, lone: 1 }, shutEvery: 3400, pagesEvery: 2600, cogs: 0.7, clearSalvage: 0, drops: true, bands: true, lances: true, look: 1 },   // PROVISIONAL

  endlessBandsFrom: 3000,   // PROVISIONAL: px before rip currents join in endless
  endlessLancesFrom: 6000,  // PROVISIONAL: px before lances join in endless
  endlessLooks: [1, 3, 0, 4],  // PROVISIONAL: the palette moves on as you get further
  endlessLookEvery: 5000,   // PROVISIONAL: px per palette

  // ---- Test bot only. None of these change the game. PROVISIONAL, all of them: they only shape how the scripts play
  botThumbY: 560,       // PROVISIONAL: px, where its thumb sits
  botMode: 'plan',      // PROVISIONAL: 'plan' uses the course's own sums; test/fairness.js sets 'react' for the no-foresight player in botfair.js
  botReact: 0.35,       // PROVISIONAL: seconds behind what it sees, in 'react' mode
  botThumb: 260,        // PROVISIONAL: px/s of steering it can ask for, in 'react' mode
  botEdge: 10,          // PROVISIONAL: px of room it wants, in 'react' mode
  botLead: 10,          // PROVISIONAL: tenths of a second ahead it allows for a rock it can see moving, in 'react' mode
  botSense: false,      // PROVISIONAL: 'react' mode: true believes the arrows the book still gives; test/fairness.js uses it to measure what a lost line costs
  botShut: 'weigh',     // PROVISIONAL: what the bots do at a shut tooth. 'weigh' Dives with a full book or a last plank and scrapes otherwise; 'dive' always Dives if it can; 'scrape' never does
  botWeighLines: 5,     // PROVISIONAL: 'weigh' Dives with at least this many lines
  botDiveAt: 64,        // PROVISIONAL: px from the bow to the rock when the bots start pulling. A pull needs a moment's quiet first (pullQuiet)
});
