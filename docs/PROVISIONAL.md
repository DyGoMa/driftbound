# Provisional numbers, for Dylan to confirm

Made by `node docs/make-provisional.js` from the game files; edit those, not this. **Nothing here has been tried by a person's thumb.** A number is on this list until you say it's right. To change one, tell Claude the game and what felt wrong; the name in `code` is only there so the number can be found.

**952 rows change how it plays, 118 only change looks or layout, and 25 only steer the test bot.** Under each game: the ones to try first, then every number by file.

## Storm Run

**Try these first** (the ones most likely to change):
- How high a held jump goes: **640** (`jumpSpeed`)
- How short a quick tap's hop is: **0.5** (`hopCut`)
- How much one Surge climbs the arm (1 is numb): **0.3** (`scarPerSurge`)
- How slowly the scars fade: **0.015** (`scarFade`)
- Hits you can take: **3** (`hits`)
- Warning before the hound springs: **0.37** (`jumpCueSecs`)

### `games/storm-run/tuning.js`: 102 play, 6 look or layout, 0 test bot


*The jump (quick tap = short hop, hold = full jump: FRIDAY_BATCH.md)*

- `gravity` **1700**. How fast Kaito falls after a jump.
- `jumpSpeed` **640**. A held jump peaks at about 120 px
- `minHop` **0.09**. Seconds of rise before letting go can cut the jump, so a real tap always hops about 68 px
- `hopCut` **0.5**. Speed kept when the thumb lets go while rising
- `surgeSpeed` **520**. The second jump adds about 80 px from wherever he is
- `surgeFxSecs` **0.34**. How long the Surge pose and echoes last
- `stepSecs` **0.26**. Seconds between footstep sounds
- `bufferSecs` **0.12**. A tap this close before landing still jumps
- `kaitoHalfW` **10**. Kaito's hit box, half width
- `kaitoTall` **68**. And height. A little under his 85 px, so the head can graze

*The bond cost (DECISIONS.md, build step 3)*

- `scarPerSurge` **0.3**. Four quick Surges reach the top. Was 0.26
- `scarFade` **0.015**. "scars fade slowly"; a full arm takes about 67 s to clear, longer than a stage, so Surges add up. Was 0.035 (28 s), when one Surge had gone before the next was needed and the arm hardly climbed
- `numbAfter` **0.6**. The scars left when the feeling comes back, so the next numb comes quicker
- `coolPerLevel` **0.35**. Cool Scars, extra fade speed per level

*Getting hurt*

- `hits` **3**. Hits per attempt at a stage, unless the stage sets its own (stage 1 does)
- `invuln` **1.1**. Seconds of safety after a hit
- `hurtSecs` **0.4**. Seconds of the hurt pose
- `catchPerLevel` **1**. Skarn's Catch, free hits per story run per level (FRIDAY_BATCH.md: "a free hit per run"). Dying gives back only what this attempt spent
- `catchBounce` **560**. How hard Skarn throws him back up
- `catchSecs` **0.9**. How long Skarn's swoop shows
- `catchSafety` **0.3**. Extra seconds of safety after Skarn's Catch, on top of invuln

*Foes. hw = half width, hi = top of the hit box above the road, extra = speed on top of the road's*

- `foes.low` **{ hw: 13, hi: 26, extra: 0 }**. A hop clears it. Box smaller than the 40 x 32 px drawing, so a new player's quick tap has room (0.20 s at stage 1 speed, 0.47 s for a hold). Was hw 16, hi 32: 0.13 s and 0.40 s
- `foes.trooper` **{ hw: 11, hi: 70, extra: 40 }**. A full jump clears it; runs at you
- `foes.tall` **{ hw: 18, hi: 124, extra: 0 }**. 4 px over a full jump's peak, so it takes a Surge
- `foes.swoop` **{ hw: 16, thick: 16, extra: 80 }**. A Hollow; flies faster than the road. Was hw 20, thick 22: a dive left a tap 0.10 s, a hold 0.40 s; now 0.17 s and 0.45 s at stage 3 speed
- `swoopHigh` **178**. Height a Hollow cruises at
- `swoopSpan` **300**. Px either side of Kaito over which it drops to its low point
- `swoopOverLow` **92**. Passes over a runner's head, but catches anyone who jumps
- `swoopDiveLow` **26**. Dives at the road; hop or jump over it
- `swoopDiveChance` **0.5**. Chance a Hollow dives instead of passing high
- `pairGap` **62**. Px between two troopers side by side
- `after` **{ low: 0.9, trooper: 1.15, tall: 1.8, swoop: 1.2, pair: 1.3 }**. Seconds of room after each, whatever the stage's gap
- `tallEvery` **5**. At least this many seconds between tall barricades, faster than the scars can fade. Was 7
- `firstArrival` **3.2**. Seconds of clear road at the start of a stage
- `endClear` **150**. Px of road left clear before the finish

*Salvage. Kit aim: a stage clear pays about 15 to 40 in all*

- `coinValue` **1**. Salvage for one cog.
- `bigCoinValue` **3**. The high ones that cost a Surge to reach
- `coinChance` **0.35**. Chance of a pattern with each foe (stages[].bait: chance that a low's or a trooper's pattern is the high bait instead)
- `grabRadius` **30**. Px from Kaito's middle
- `pullPerLevel` **34**. Salvage Pull, extra reach per level. Big cogs answer it only while Kaito has Surged (runner.js stepCoins), or a plain jump pulls the high bait down at no cost
- `pullSpeed` **520**. How fast pulled salvage flies in
- `coinRows` **{ low: [58, 70, 58], trooper: [108, 128, 108], pair: [100, 122, 134, 122, 100], tall: [204], swoop: [24, 24, 24], bait: [204, 204] }**. Heights of the salvage that comes with each foe. bait: out of reach of a full jump, so only an extra Surge gets it
- `baitAhead` **50**. Px past the foe the bait sits, where a jump Surged near its top is highest

*Score*

- `scorePerFoe` **25**. Score for getting past a foe.
- `scorePerCoin` **5**. Score for a cog.
- `scorePerClear` **200**. Score for clearing a stage.
- `scorePerCore` **500**. Score for a hit on the hound's core.

*Pals. Rare, and each asks the opposite thing of your arm*

- `fizzletChance` **0.15**. Chance each time the arm goes numb, from stage 2. Was 0.3, when going numb was unusual
- `fizzletFromStage` **1**. Index, 1 = stage 2
- `boltnipChance` **0.25**. Chance once per attempt, when the arm has been clean a while
- `boltnipCalm` **14**. Seconds with no Surge
- `boltnipScar` **0.1**. And the scars this low or lower, nearly back to base. Was 0: with the slower fade it almost never came
- `boltnipFromStage` **2**. Index, 2 = stage 3
- `boltnipAlt` **200**. Height it flies at; out of reach of a full jump, so catching it costs a Surge
- `palRadius` **20**. How close Kaito must get to a pal to catch it, px.
- `palCatchHeight` **30**. How far above a pal's height still counts as touching it
- `palSpawnBack` **120**. Px nearer than other foes that a pal starts
- `palSpeed` **{ fizzlet: 0.82, boltnip: 0.9 }**. Share of road speed; both move along a little, so you get longer to act

*The boss (FRIDAY_BATCH.md: "three times"). Lists run by core hits so far: first, second, third round*

- `bossSpeed` **300**. Road speed
- `chaseX` **76**. Where the hound runs behind him
- `landX` **520**. Where a lunge lands, past Kaito
- `chaseSecs` **[3.0, 3.2, 3.4]**. Seconds the hound chases before it crouches, by round.
- `cableAt` **[[1.2], [0.9, 2.1], [0.7, 2.1, 2.8]]**. Seconds into the chase when Silt throws. Nothing is thrown from about 1.2 to 2.0 s: the barricade passes at 1.9 to 2.1 s, and you must be back on the road before the next cable's height can be read and answered
- `tellSecs` **[0.95, 0.8, 0.65]**. Crouch before a lunge. WAIT shows, then the jump prompt for the last jumpCueSecs
- `jumpCueSecs` **0.37**. The jump prompt and its sound come this long before the lunge. Measured: a full jump started about 0.19 to 0.40 s after it clears (NOTES.md)
- `lungeSecs` **0.6**. Seconds the hound's lunge takes.
- `lungeArc` **18**. Px off the road at the top of a lunge. Was 26; with houndTall, sets how long the jump window is
- `houndHalfW` **50**. The hound's hit box, half width, px.
- `houndTall` **62**. A full jump clears it, a hop (about 68 px) doesn't: about 80 px with the arc. Was 70
- `openSecs` **[1.75, 1.5, 1.3]**. How long the core stays open
- `shutSecs` **0.5**. Warning before it lunges back if you missed
- `staggerSecs` **0.8**. Seconds the hound staggers after a core hit.
- `retreatSecs` **0.8**. Seconds it takes to drop back after that.
- `fallSecs` **1.5**. The last moment before the win
- `bossEnterSecs` **1.6**. How long the hound takes to run in
- `bossEnterX` **-220**. Where it starts, off the left edge
- `barricadeLead` **1.6**. Seconds of road ahead of Kaito for the boss's barricade
- `barricadeExtra` **120**. And px on top of that
- `landSecs` **0.28**. The pause when a lunge lands, before the core opens
- `retreatHeight` **170**. Px, the high bound back over Kaito's head
- `fallDrift` **0.2**. Share of road speed the fallen hound slides at
- `windupSecs` **0.45**. Silt's arm back before a cable flies
- `cableSpeed` **300**. Px/s, flying forward
- `cableHighChance` **0.5**. Chance a cable flies high instead of low
- `cableHalfW` **12**. A cable's hit box, half width
- `cableLow` **{ lo: 4, hi: 30 }**. Hop over it
- `cableHigh` **{ lo: 88, hi: 110 }**. Stay down, it goes over your head
- `dashSecs` **0.2**. The lightning dash into the core
- `dashSafety` **0.7**. Seconds of safety after the dash lands
- `coreReachX` **300**. How far the dash reaches
- `coreAlt` **96**. Height of the core above the road when the hound rears (matches hound.js)
- `coreAltArt` **112**. The same height with the reared picture on (measured: core 661 px above the feet in silt-hound-rear-v1.png, drawn at 0.17)
- `cableHandArt` **{ up: [0, 133], run: [47, 101], low: [42, 75] }**. Where Silt's cable starts with the pictures on, from the hound's middle: arm raised, galloping, crouched or lunging (measured on the pictures)
- `coreOffset` **16**. And how far in front of the hound's middle it is then (matches hound.js)
- `rebound` **420**. Bounce back off the core
- `returnRate` **3**. How fast Kaito drifts back to his spot

*The five stages. Words are in words.js. length in metres.*

- `stages[0]` **{ length: 700, speed: 225, gap: [1.5, 2.4], mix: { low: 5, trooper: 3 }, hits: 5, lowScale: 0.65, clearSalvage: 12, wash: 0 }**. About 31 s, easy
- `stages[1]` **{ length: 850, speed: 245, gap: [1.4, 2.2], mix: { low: 4, trooper: 4, tall: 3 }, bait: 0.5, clearSalvage: 12, wash: 0.06 }**. About 35 s
- `stages[2]` **{ length: 950, speed: 265, gap: [1.3, 2.1], mix: { low: 3, trooper: 4, tall: 2, swoop: 4 }, bait: 0.5, clearSalvage: 14, wash: 0.14, rain: 34 }**. About 36 s
- `stages[3]` **{ length: 1100, speed: 285, gap: [1.2, 1.9], mix: { low: 3, trooper: 4, tall: 3, swoop: 4, pair: 2 }, bait: 0.5, clearSalvage: 16, wash: 0.22, rain: 60, flash: 7, silt: true }**. About 39 s
- `stages[4]` **{ boss: true, speed: 300, clearSalvage: 26, wash: 0.1, rain: 70, flash: 5 }**. "takes a few tries" (spec)
- `endless` **{ speed: 240, ramp: 1.1, maxSpeed: 370, gap: [1.2, 2], gapMin: 0.55, gapShrink: 0.004, mix: { low: 3, trooper: 4, tall: 2, swoop: 4, pair: 2 }, bait: 0.5, clearSalvage: 0, wash: 0.14, rain: 40 }**. Endless: starting road speed, how fast it climbs, top speed, gaps between foes, and which foes come.

*Looks and layout: they change how it looks or fits, not the rules*

- `pxPerCm` **0.48**. Kaito's 178 cm (CAST.md) comes out about 85 px tall
- `groundY` **296**. Feet line. The rock below it holds the arm and the hints
- `playerX` **150**. Where Kaito runs, far enough in to see what's coming
- `bossX` **300**. Further in for the boss, so Silt fits behind him
- `spawnX` **900**. Foes start here, off the right edge of any screen up to 21:9
- `metre` **10**. Px of road per metre on the distance count

## Tide Gap

**Try these first** (the ones most likely to change):
- How far the thumb pulls down to Dive: **30** (`pullPx`)
- How quickly that pull must happen: **0.6** (`pullWindow`)
- How heavy the steering is: **1.6** (`dragGain`)
- How long the ship lags behind Vesh: **0.14** (`towDelay`)
- Planks on the hull: **3** (`hull`)
- Warning before a lance, by round: **[1.3, 1.14, 1.06]** (`boss.warn`)

### `games/tide-gap/tuning.js`: 153 play, 13 look or layout, 0 test bot


*Steering. Drag anywhere; Vesh's head goes first and the hull swings after it*

- `dragGain` **1.6**. Px of steering per px of thumb
- `keySteer` **300**. Px/s with arrows or A and D
- `headRate` **12**. How quickly the head closes on the aim, per second
- `headMax` **460**. Px/s, the head's top sideways speed
- `towDelay` **0.14**. Seconds the hull follows the head by
- `shipRate` **9**. How quickly the hull closes on that, per second
- `shipMax` **300**. Px/s, the hull's top sideways speed
- `steerSoundGap` **0.5**. Seconds between steer sounds
- `steerSoundMove` **3**. Px of thumb in one step that counts as a steer, for the sound

*The Dive. Spec says "Hold to Dive". Call (NOTES.md): pull the thumb DOWN, then hold. Steering only uses sideways, so a resting, jittering or pausing thumb can never spend a memory*

- `pullPx` **30**. Logical px straight down that counts as a pull
- `pullWindow` **0.6**. Seconds that pull must happen in, so a slow wander never counts. Review: 0.25 meant anything under about 120 CSS px/s did nothing, and real touch at 48 CSS px in 445 ms failed 8 of 8. test/pull.js
- `pullShowFrom` **0.3**. Share of a pull done before the thin ring and soft sound start, so a thumb's small wander shows nothing
- `pullSlant` **2**. The pull must be this many times more down than sideways. test/pull.js: 1.5 let a fast low sweep from a standing start fire
- `pullQuiet` **0.14**. Seconds before the pull in which the thumb must not have been travelling sideways. A steering sweep runs straight into its steep end, so it never qualifies. test/pull.js
- `pullQuietPx` **7**. Logical px of sideways wander allowed in that time
- `diveWindup` **0.1**. Seconds the thumb must stay on after the pull. Lifting in that moment costs nothing
- `diveSecs` **2.6**. Air. With riseSecs this clears the longest rock on the slowest stage, going straight, from any start in about the last 50 px. test/passable.js proves it
- `divePerLevel` **0.4**. Longer Dive, extra air per level: a wider start, not the only way under
- `diveWarn` **0.6**. Seconds of air left when the warning sounds
- `riseSecs` **0.2**. Coming back up; still safe, and it must end in open water
- `diveHintSecs` **6**. How long the "how to Dive" hint stays on stage 1
- `diveHintAfter` **3.5**. Seconds after Ione's line that the hint comes up, so the two aren't on screen at once

*The bond cost. Spec: each Dive drowns a line; every lost line weakens the arrows; at zero they're gone and Dives stop*

- `bookRows` **6**. Lines in the book, and the rows on screen
- `bookFont` **12**. Logical size of the book's writing on a roomy screen
- `bookFontMinCss` **12.5**. The writing never shrinks below this on the real screen, in CSS px
- `sense[1]` **{ reach: 120, ghost: false, alpha: 0.4, flick: 0.55, chev: 1, miss: 0.7, lead: 0.15 }**. About when a drift starts, so it warns too late for a fork
- `sense[2]` **{ reach: 165, ghost: false, alpha: 0.6, flick: 0.3, chev: 1, miss: 0.5, lead: 0.3 }**. What Sela can sense with 2 lines left: how far ahead the arrows show, and how many gates she misses.
- `sense[3]` **{ reach: 225, ghost: false, alpha: 0.85, flick: 0, chev: 2, miss: 0.35, lead: 0.5 }**. What Sela can sense with 3 lines left: how far ahead the arrows show, and how many gates she misses.
- `sense[4]` **{ reach: 320, ghost: false, alpha: 1, flick: 0, chev: 2, miss: 0.2, lead: 0.7 }**. The first thing you lose is knowing exactly where a rock will stop
- `sense[5]` **{ reach: 400, ghost: true, alpha: 1, flick: 0, chev: 3, miss: 0.1, lead: 0.85 }**. What Sela can sense with 5 lines left: how far ahead the arrows show, and how many gates she misses.
- `sense[6]` **{ reach: 480, ghost: true, alpha: 1, flick: 0, chev: 3, miss: 0, lead: 1 }**. Past the top of the screen, so you know before you can see

*Getting hurt*

- `hull` **3**. Knocks per attempt at a stage
- `hullPerLevel` **1**. Tougher Hull (spec: "one more knock"), per level
- `hullRepair` **0**. Planks patched between stages. Call (NOTES.md): damage lasts through the story run, or a scrape costs nothing
- `hullFloor` **2**. Planks a stage always starts with at least, so none is a dead end. The boss always starts whole: on 2 planks a 0.5 s player couldn't beat it at all, whatever the book
- `invuln` **1.35**. Seconds of safety after a knock
- `hurtSecs` **0.5**. Sela's flinch
- `shunt` **340**. Px/s, a knock throws the hull into open water at this speed
- `rockInset` **3**. Px the hit edge sits inside the drawn edge
- `freeWaterStep` **6**. Px between the spots checked when a knock looks for open water

*Shut teeth. Two rocks meet with no surface way through: Dive under it for a line, or scrape through the crack for a knock. Call (NOTES.md): this is what makes the book cost something on stages 1 to 4*

- `shutLen` **[100, 130]**. Length along the course
- `shutOpen` **[40, 64]**. Px each rock starts back from the crack
- `shutLane` **40**. Px either side of the crack the hull is lined up in
- `shutClear` **120**. Extra open water before one, to read it and choose
- `shutCrackMin` **shutCrackMin: 100, shutCrackMax: 260**. Where the crack may fall
- `shutCallLead` **3.6**. Seconds before the SHUT mark shows that the crew call the first on a stage, so the talk box has gone by the time the hint needs its place
- `shutCueAt` **300**. Px from the bow when the SHUT mark and pull cue show

*Rocks. moveFrom / moveTo: px from the bow to the rock's near end when its drift starts and stops*

- `rockLen` **[90, 150]**. Length along the course. Longest kept inside what a Dive can clear
- `rockFar` **460**. How far a side rock reaches behind the cliff
- `rockJag` **7**. Px of roughness in a rock's edge
- `rockBulge` **70**. Most a side rock's ends curve back, px
- `lenJitter` **20**. Px the far wall of a gate may differ in length
- `shiftMin` **shiftMin: 60, shiftMax: 120**. Px a gap slides in a 'both walls move' gate
- `shiftEdge` **50**. Px a gap keeps from the cliff when choosing which way to slide
- `gapEdge` **6**. Px a gap keeps from the cliff
- `gapWander` **150**. Most a gap's middle moves from the last one, px
- `closeAmt` **[28, 56]**. Px each wall comes in on a closing gate
- `loneW` **[96, 136]**. A lone island's width
- `loneEnd` **[34, 70]**. Px from the channel's middle where it ends up
- `loneDrift` **[50, 90]**. Px it drifts
- `forkPost` **[44, 66]**. Px the side rocks of a fork reach out from each side of the screen
- `forkOpen` **18**. Px a fork's gap is wider than the stage's gap
- `forkGrind` **7**. Px past closing the middle rock slides, so it really grinds
- `forkLean` **[0.62, 0.38]**. Chance a fork shuts the gap on your side, when you're left of the middle or right of it
- `forkPostLen` **14**. Px a fork's side rocks are longer than its middle
- `slalomLen` **[150, 200]**. A slalom wall's length. Longest kept inside what a Dive can clear
- `slalomAmt` **[36, 64]**. Px it leans in
- `slalomSlack` **16**. Px of chance on how far it reaches
- `firstGate` **620**. Px of open water before the first gate
- `endClear` **340**. Px of open water after the last gate
- `layFrom` **200**. Px before firstGate the course starts counting
- `layAhead` **900**. Px ahead of the ship the course is laid
- `layEnd` **300**. Px kept clear of laying before endClear
- `bandClearChance` **0.3**. Chance of more open water before a gate, on a stage with rips
- `bandClear` **150**. How much more
- `humanSpeed` **170**. Px/s of sideways move the course may ask for; well under shipMax, and what the passable check uses
- `reactSecs` **0.35**. Reaction the course allows for after a drift starts, with no arrows
- `gateSafety` **8**. Px of room the check insists on each side of the hull

*Hazards*

- `dropWarn` **1.5**. Seconds of shadow before a boulder lands. Review: 1.15 made stage 2 the wall for a slower player
- `dropRadius` **20**. Splash radius. Review, same reason
- `dropEvery` **8.5**. Seconds between boulders, stage 2 and endless. Review, same reason
- `dropFirst` **3.5**. Seconds before the first boulder
- `dropJitter` **[0.8, 1.25]**. Chance on that gap
- `dropRetry` **0.4**. Seconds before trying again when a rock is too close to dodge beside
- `dropLaneBefore` **0.7**. The fairness check starts this long before a boulder lands
- `dropLaneAfter` **0.2**. And ends this long after
- `lanceWarn` **1.25**. Red lane before a lance, stage 4 and endless (the boss's own are in boss.warn)
- `lanceHalf` **8**. Half width of the lance and its cable
- `lanceStay` **1.1**. Seconds the cable stays taut after it strikes, in the boss
- `lanceEvery` **6**. Seconds between lances, stage 4
- `lanceFirst` **4**. Seconds before the first lance
- `lanceJitter` **[0.8, 1.2]**. Chance on that gap
- `lanceRetry` **0.3**. Seconds before trying again when a lance wouldn't be fair
- `lanceStageStay` **0.6**. The cable stays up less long on a stage than in the boss, with gaps to thread
- `lanceCross` **0.9**. Seconds allowed to cross where the cable was, before a lance can be fired in front of a gap on its other side
- `lanceX` **[26, 334]**. How far out a lance may land
- `lanceGrace` **2**. Px a cable may brush the hull's side and not count
- `bandForce` **[60, 95]**. Px/s, how hard a rip current shoves
- `bandLen` **[150, 230]**. Length along the course
- `bandChance` **0.6**. Chance of a rip before a gate, if there's room
- `bandMinRoom` **200**. Px of open water a rip needs
- `bandStartGap` **20**. Px a rip keeps from the gates
- `bandHullShare` **0.4**. How much of a rip's shove goes straight to the hull as well as the aim

*Talk during play (talk.js)*

- `talkBase` **talkBase: 1.4, talkPerChar: 0.028**. Seconds a box stays: this, plus this per letter
- `talkMin` **talkMin: 2, talkMax: 4.2**. And never less or more than these
- `talkGap` **0.2**. Seconds of nothing between boxes
- `talkStale` **4**. Seconds a remark may wait before it's dropped
- `talkStaleLong` **6**. For the ones that say something big
- `talkStaleShort` **1.5**. For a reply to a press
- `talkCutShare` **0.4**. A scene line cut off with more than this share still to run is played again
- `talkStartBoss` **0.6**. Seconds into the boss before a scene carried in starts

*Salvage. Kit aim: a stage clear pays about 15 to 40 in all. A Dive for a cache pays over that on purpose: it's what a line buys*

- `cogValue` **1**. Salvage for one cog.
- `cacheValue` **5**. The drowned ones under a rock, only reachable on a Dive. Three to a cache
- `cacheSpread` **26**. Px between the coins of a cache
- `cacheInset` **30**. Px a cache sits behind a side rock's edge
- `grabRadius` **26**. Px from the hull's middle line
- `cacheChance` **0.28**. Chance a gate hides a drowned cache. A shut tooth always does
- `cacheMinW` **80**. A middle rock narrower than this hides nothing
- `cogRunChance` **0.75**. Chance of a line of cogs on the way to a gate
- `cogGateChance` **0.6**. Chance of a cog in the gap itself
- `cogSpacing` **60**. Px of open water per cog, before stage.cogs
- `cogWobble` **26**. Px the line of cogs bends off the straight
- `pageExtra` **2**. Salvage for a page when the book has no blank row
- `pageOff` **[70, 118]**. Px a page sits off the safe line
- `pageBefore` **[120, 170]**. Px a page sits before its gate
- `itemX` **[34, 326]**. How far out a cog, cache or mop may sit
- `pageX` **[40, 320]**. How far out a page may sit
- `grabAhead` **8**. Px past bow and stern that still picks a thing up

*Score*

- `scoreGate` **50**. Score for a gate passed.
- `scoreClean` **25**. On top, if no knock since the last gate
- `scoreCog` **5**. Score for a cog.
- `scoreCache` **15**. Score for a cache under a rock.
- `scorePage` **100**. Score for a logbook page.
- `scoreClear` **200**. Score for clearing a stage.
- `scoreLine` **120**. Per line left in the book at a clear. A kept line is worth more than a cache to a best score
- `scorePlate` **500**. Score for breaking a keel plate.
- `scorePerMetre` **1**. Endless only
- `metre` **10**. Px per metre on the distance count

*Pals*

- `bobbinCalm` **18**. Seconds with no knock and no Dive before it may come up
- `bobbinChance` **0.25**. Chance, once per attempt, when that's met
- `bobbinFromStage` **1**. Index, 1 = stage 2
- `bobbinSecs` **7**. How long it stays alongside
- `bobbinNear` **52**. Px from the hull that counts as alongside
- `bobbinHold` **1.1**. Seconds alongside to catch it
- `bobbinOff` **110**. Px from the hull where it comes up
- `bobbinX` **[50, 310]**. How far out it may come up
- `mopChance` **0.4**. Chance, once per attempt, of a mop tuft on a rock
- `mopFromStage` **2**. Index, 2 = stage 3
- `mopGate` **3**. Which gate of the stage may hide it
- `mopInset` **26**. Px it sits behind a side rock's edge
- `mopNear` **40**. Px, how close on a Dive
- `mopAlong` **30**. Px past bow and stern that still reaches it
- `mopCallAt` **640**. Px ahead when the crew spot it

*Looks and layout: they change how it looks or fits, not the rules*

- `shipY` **468**. The hull's middle on screen. Room below it for the talk box
- `hullHalfLen` **40**. Bow to middle, px
- `hullHalfW` **17**. Half the beam, px
- `towLen` **196**. Vesh's head, px ahead of the hull's middle
- `minX` **minX: 30, maxX: 330**. How far the hull's middle can swing; the cliffs sit outside this
- `wallL` **wallL: 14, wallR: 346**. The cliffs' inner edges
- `hintY` **540**. Where hints sit, under the hull, so they never cover what's coming down the screen
- `hintSecs` **7**. How long a stage's opening hint stays. The crew wait for it to go before they talk
- `sinkSecs` **0.18**. Looks only: how long the hull takes to go dark
- `selaH` **46**. Sela's height on the bow, logical px (was 36)
- `selaFeet` **-13**. Where her feet stand, px from the hull's middle, so her head still ends about at the bow
- `hekkaH` **51**. Hekka on the cutter (was 40). 193 cm against Sela's 175 (CAST.md) keeps the same ratio
- `rockLoseChance` **0.35**. Looks only, how often a rock's knock-out gets its own lose line

### `games/tide-gap/tuning-stages.js`: 58 play, 0 look or layout, 7 test bot


*The boss. Spec: "fires harpoon-lances and drops pylons; Dive under the hull and burst up through its weak plates"*

- `boss.shipY` **490**. The hull sits lower here, so the cutter has room, and still clears the talk box
- `boss.towLen` **150**. Vesh is bunched up for the fight
- `boss.cutterY` **212**. Middle of the cutter
- `boss.cutterHalfW` **64**. The cutter's size, half width, px.
- `boss.cutterHalfLen` **92**. The cutter's size, half length, px.
- `boss.startY` **-160**. Where the cutter comes on from
- `boss.strafe` **[100, 260]**. Where the cutter's middle swings between
- `boss.strafeSecs` **[9, 7, 5.5]**. Seconds for one full swing and back, by round
- `boss.enterSecs` **2.2**. Seconds the cutter takes to come on.
- `boss.plates` **[[-34, -16], [34, -16], [0, 40]]**. X, y from the cutter's middle
- `boss.plateNear` **30**. Px sideways from a plate that counts as under it
- `boss.chargeSpeed` **250**. Px/s, how fast Vesh hauls you under the hull
- `boss.reachLine` **108**. Px below the cutter's middle where a burst can reach the plates
- `boss.chargeStop` **34**. Px above that line where the haul stops
- `boss.returnSpeed` **170**. Px/s, back to your place after a burst
- `boss.warn` **[1.3, 1.14, 1.06]**. With a full book. test/fairness.js. Fourth review: was 1.35, 1.2, 1.1, and the boss fell first try to a quick script. This is the most test/fairness.js lets through (1.3, 1.12, 1 made a 0.5 s player never win on 2 lines) and it's a small move: NOTES.md
- `boss.warnPerLine` **0.04**. Seconds of red lane lost for each line gone from the book. With the chain arrows (sense[].lead), this is what a thin book costs here. A blank book's last round is 0.82, about the least a 0.5 s player can dodge
- `boss.gap` **[1.5, 1.24, 1.06]**. Same review, was 1.55, 1.3, 1.1
- `boss.firstMove` **0.7**. Seconds from the cutter arriving to its first shot
- `boss.afterOpen` **0.5**. Seconds from the plates shutting to the next shot
- `boss.afterStagger` **0.8**. Seconds from a stagger to the next shot
- `boss.retryMove` **0.12**. Seconds before trying again when a shot wouldn't be fair
- `boss.open` **[5.5, 5, 4.5]**. Seconds the keel plates glow, by round.
- `boss.openLance` **[0, 2.6, 2.1]**. Seconds between lances while the plates glow, by round; 0 is none. So the surface is never quite safe
- `boss.openLanceFirst` **1**. Seconds into the glow before the first of those
- `boss.cableClear` **0.75**. Seconds a lane must be free of cables before a new lance lands. At 0.5 every player under the book took the same hit from a fan into a lance, whatever the book said. Tested by test/fairness.js
- `boss.staggerSecs` **1.4**. Seconds the cutter reels after a plate breaks.
- `boss.fallSecs` **2.4**. Seconds the cutter takes to go down.
- `boss.fallTalkMax` **14**. Most seconds she takes to sink while a scene still owed plays out
- `boss.fallDrift` **8**. Px/s the wreck slides as it goes
- `boss.pylonSpeed` **112**. Px/s down the screen. About 1.3 s from the cutter's bow to the hull, which is short of a full crossing with no warning: that's what the chain arrows are for
- `boss.pylonR` **11**. Px, a pylon post
- `boss.pylonLand` **170**. Px past the hull's place where a chain is gone
- `boss.chainGap` **112**. Width of the way through a pylon chain
- `boss.chainPost` **4**. Px from the way through to the pylon's post
- `boss.chainGrace` **6**. Px of bow and stern a chain may brush and not count
- `boss.chainSideGrace` **2**. Px of the hull's side a chain may brush and not count
- `boss.chainClear` **4**. Px past the hull a chain must be before the next thing fires
- `boss.chainFarOdds` **[0.7, 0.3]**. Chance the way through is on the left, when you're right of the middle or left of it
- `boss.fanSpread` **96**. Px between the two lanes of a fan
- `boss.pageEvery` **8**. Seconds between loose pages when the book is empty, so a boss can always be finished. A plate only shakes one loose then, too
- `boss.pageSpeed` **100**. Px/s down the screen
- `boss.pageOffset` **80**. Px from the hull where a loose page falls
- `boss.pageDrift` **22**. Px/s a loose page wanders sideways
- `boss.pageBelow` **30**. Px below a broken plate where its page starts
- `boss.pageGrab` **6**. Px wider than a stage's page the grab is, since these move
- `boss.jabFirst` **5**. Seconds of volley before Hekka's first jab
- `boss.jabEvery` **9**. Seconds between jabs

*The five stages. Words are in words.js. length in px of course; at speed about 40 to 60 s each. shut: where its shut teeth fall, as a share of the length. pagesAt: where its pages fall, the same way*

- `stages[0]` **{ length: 4400, speed: 105, gap: [130, 170], moveFrom: 250, moveTo: 70, spacing: [250, 330], mix: { shift: 4, close: 3, lone: 3 }, shut: [0.58], pagesAt: [0.78], cogs: 0.8, clearSalvage: 11, lockDive: true, look: 0 }**. Easy. Drifts start early enough that you barely need the arrows yet
- `stages[1]` **{ length: 5600, speed: 118, gap: [100, 128], moveFrom: 125, moveTo: 40, spacing: [200, 270], mix: { fork: 6, shift: 2, close: 2 }, shut: [0.6], pagesAt: [0.8], cogs: 0.6, clearSalvage: 12, drops: true, look: 1 }**. Drifts now start too late to read by eye alone
- `stages[2]` **{ length: 6400, speed: 130, gap: [92, 112], moveFrom: 112, moveTo: 30, spacing: [160, 220], mix: { slalom: 4, fork: 5, close: 1 }, shut: [0.55], shutPaid: 1, pagesAt: [0.6], cogs: 0.38, clearSalvage: 14, fog: { clear: 145, thick: 230 }, look: 2 }**. Stage 3: its length, speed, gaps and pay.
- `stages[3]` **{ length: 7000, speed: 140, gap: [92, 112], moveFrom: 165, moveTo: 40, spacing: [215, 285], mix: { fork: 3, shift: 3, close: 2, slalom: 2 }, shut: [0.35, 0.72], shutPaid: 1, pagesAt: [0.45], cogs: 0.4, clearSalvage: 16, bands: true, lances: true, look: 3 }**. With planks that last, a story run with no Tougher Hull comes in on 2 and can't reach the boss without a Dive here. Five teeth in all with one on stage 3: the best no-upgrade run spends 4 lines including the boss, so the Kaito line can still be kept. shutPaid: the last teeth drop out if nothing can pay for a Dive, so a blank book still meets the fairness bar
- `stages[4]` **{ boss: true, speed: 120, clearSalvage: 26, look: 4 }**. "takes a few tries" (spec)
- `endless` **{ speed: 118, ramp: 0.55, maxSpeed: 176, gap: [116, 134], gapMin: 86, gapShrink: 0.0016, moveFrom: 155, moveTo: 45, spacing: [205, 275], mix: { fork: 4, shift: 3, close: 3, slalom: 2, lone: 1 }, shutEvery: 3400, pagesEvery: 2600, cogs: 0.7, clearSalvage: 0, drops: true, bands: true, lances: true, look: 1 }**. Endless: starting speed, how fast it climbs, top speed, gap sizes and how fast they shrink, how soon rocks drift.
- `endlessBandsFrom` **3000**. Px before rip currents join in endless
- `endlessLancesFrom` **6000**. Px before lances join in endless
- `endlessLooks` **[1, 3, 0, 4]**. The palette moves on as you get further
- `endlessLookEvery` **5000**. Px per palette

*Test bot only, nothing to confirm:* `botThumbY`, `botReact`, `botThumb`, `botEdge`, `botLead`, `botWeighLines`, `botDiveAt`.

## Hot Hand

**Try these first** (the ones most likely to change):
- Heat each throw adds: **16** (`throwHeat`)
- Heat lost per second: **12** (`cool`)
- Heat where a throw becomes a HOT HAND: **78** (`edgeAt`)
- How long locked hands last: **1.8** (`lockSecs`)
- Seconds before Krell's line charges, by round: **[17, 15, 16.5]** (`marchSecs`)
- Hits the charge does: **3** (`ramHurt`)

### `games/hot-hand/tuning.js`: 118 play, 36 look or layout, 3 test bot


*Tap targets. 44 px on a 568 x 320 phone is 49.6 logical px (the kit's scale there is 0.8875)*

- `tapReach` **10**. Px outside a target that still counts as touching it
- `projReach` **30**. Radius for tapping something in the air: 60 logical px across
- `projLag` **0.35**. A tap counts if it lands where a thing in the air was this many seconds ago, because a thumb arrives late at something moving 200 to 500 px/s
- `projLagStep` **0.05**. How finely that path is checked

*The bond cost (FRIDAY_BATCH.md: each throw raises heat; too hot locks the hands and burns; heat makes throws stronger)*

- `heatMax` **100**. The top of the bar
- `throwHeat` **16**. Heat per throw
- `cool` **12**. Heat lost per second. So at the top, one throw every 1.33 s holds steady
- `warmAt` **35**. Heat where throws turn WARM: 2 damage, goes through a plate
- `hotAt` **70**. Heat where throws turn HOT: 3 damage, burns what stands near the target
- `edgeAt` **78**. Heat where a throw is a HOT HAND: as HOT, wider burn, the best score and table pay
- `dmg` **[1, 2, 3, 3]**. Damage by tier: cold, warm, hot, hot hand
- `scoreX` **[1, 2, 3, 5]**. Score multiplier by tier
- `burnR` **[0, 0, 58, 82]**. Px of burn around the target by tier
- `burnDmg` **1**. Damage to others in the burn
- `flySpeed` **1100**. Px/s of a thrown flame

*Going over the top*

- `lockSecs` **1.8**. "her hands lock for a moment" (FRIDAY_BATCH.md)
- `lockPerBurn` **0.1**. A little longer for each burn already carried this story run
- `lockMin` **0.5**. The shortest a lock can be, whatever the upgrades
- `burnsMax` **3**. How many burns the palm can show and count
- `afterLock` **74**. Heat when the lock lets go. No cooler than waiting it out would have left her (72 to 77 from 90), so going over the top never buys relief
- `burnHurt` **1**. "she takes burn damage" (FRIDAY_BATCH.md)
- `blowoutR` **110**. The throw that goes over the top still flies, and blows out this far round the target
- `blowoutDmg` **1**. And hits everything there this hard: a parting shot, not a way to clear the screen

*Ashka (FRIDAY_BATCH.md: "spots and marks weak targets for bonus")*

- `markFirst` **3**. Seconds into an attempt before her first mark
- `markEvery` **[4.5, 6.5]**. Seconds between marks
- `markRetry` **0.4**. Seconds before she looks again if nothing was there to mark
- `markSecs` **5**. How long a mark lasts
- `markRefund` **12**. Heat she takes off when a marked target is hit. A throw at a mark also adds no heat
- `markTable` **1**. Extra salvage on the table per marked kill
- `picHands` **{ idle: [[0.1, 0.53], [0.19, 0.6]], hot: [[0.1, 0.6], [0.21, 0.615]], throw: [[[-0.185, 0.94]], [[0.366, 0.9]], [[0.475, 0.775]]], locked: [[0.06, 0.637], [0.085, 0.61]], hurt: [[-0.235, 0.48], [0.226, 0.62]] }**. Measured from art/: [across, up] as shares of her height from between her feet, near hand first. throw is one list per frame
- `picMark` **{ idle: [0.025, 0.77], hot: [0.05, 0.63], throw: [[0.02, 0.755], null, null], locked: [0.11, 0.745], hurt: [-0.012, 0.74] }**. Measured from art/: where the bond mark is in each picture, for the glow. null: her back is to us in that frame

*Juno*

- `hpStages` **5**. Hits per attempt, where the stage doesn't say
- `invuln` **0.6**. Seconds of safety after being hit, so two swings can't land together
- `hurtSecs` **0.45**. How long her hurt pose shows

*Foes. hp, speed px/s; armour = lowest tier that gets through*

- `foes.grunt` **{ hp: 1, speed: 55, score: 20, cm: 180 }**. Plain trooper: health, speed, score, height in cm.
- `foes.plate` **{ hp: 2, speed: 42, armour: 1, score: 40, cm: 180 }**. A cold throw bounces
- `foes.runner` **{ hp: 1, speed: 110, score: 30, cm: 180 }**. Runner: health, speed, score, height in cm.
- `foes.hook` **{ hp: 1, speed: 55, score: 40, cm: 180, throwD: [230, 340], throwDMid: [170, 240] }**. Stops this far off and throws
- `foes.sniper` **{ hp: 1, score: 40, cm: 180, s: 0.62 }**. In the upper windows. s: his size up there
- `foes.cart` **{ hp: 1, speed: 30, score: 10, cm: 120 }**. A powder cart. Pusher's in the rules below
- `foes.hollow` **{ hp: 2, speed: 150, score: 60, cm: 110 }**. Speed during a bound
- `stops` **[122, 94, 68]**. Px from Juno each lane stops at, far to near
- `queueGap` **32**. Px kept between foes in a lane when they queue up
- `swingHurt` **1**. Hits to Juno from a blade or a bite
- `airHurt` **1**. Hits to Juno from a hook or a bolt
- `airScore` **15**. Score for burning something in the air
- `tellSecs` **0.9**. "!" and the blade up, before a swing lands. Kill him in this time and it never lands
- `swingGap` **1.1**. Seconds after a swing before the next "!"
- `hookWind` **1.3**. Arm back and ring closing before a hook flies
- `hookFly` **1.1**. Seconds in the air. Can be burned on the way
- `hookRest` **2.8**. Before he winds up again
- `hookArc` **70**. Px high at mid-flight
- `sniperStart` **0.5**. At most this many seconds behind the shutters when he arrives
- `sniperShutter` **0.4**. Shutters open
- `sniperAim` **1.6**. He's aiming, ring closing
- `sniperFly` **1.0**. Bolt in the air. Can be burned
- `sniperHide` **2.6**. Behind the shutters before the next window
- `windows` **[[208, 144], [278, 118], [348, 144], [418, 118], [488, 144], [558, 118]]**. Where they lean out, feet-line x, y on the Long Table's upper floor. Clear of the top read-outs and the pause button
- `cartPushBack` **34**. Px the pusher walks behind the cart
- `cartR` **120**. Blast radius
- `cartDmg` **3**. To everything in it
- `cartHurt` **2**. Hits to Juno if it gets to her
- `cartReach` **104**. Px from Juno it goes up at
- `cartFuse` **1.4**. Seconds of sparks and warning before it goes up on arrival
- `hollowBound` **0.55**. Seconds of a bound. Plates shut: throws clang
- `hollowOpen` **1.2**. Seconds stopped with its plates parted: core open
- `hollowStopExtra` **30**. Px further off a Hollow stops, being longer than a man
- `hollowTell` **0.8**. Crouch before it bites
- `hollowBite` **1.2**. Before the next crouch
- `squadSize` **3**. A squad is this many grunts close together, so a burn pays
- `squadGap` **36**. Px apart

*Salvage. Kit aim: a stage clear pays about 15 to 40 in all*

- `cogEvery` **10**. Every this many kills drops a cog: paid at once, whatever happens next. So a lost attempt still earns
- `cogValue` **1**. What a cog pays
- `leftChance` **0.5**. In the Pit, the chance a foe or pal comes from the left
- `sniperToughMax` **1**. A window shooter takes at most this much of a stage's extra toughness
- `purse` **4**. The table pays this much for each wave at least. So cashing in every time clears a stage for 12 and the cogs at the very least, and more with what a good wave adds (kit aim: 15 to 40; measured in NOTES.md)
- `hotKillsPerChip` **2**. Every this many kills at HOT or better puts hotKillChip more on the table
- `hotKillChip` **1**. Extra salvage on the table for a hot kill.
- `edgeTable` **1**. And a HOT HAND kill adds 1 on top
- `purseMaxExtra` **3**. The most those can add in one wave, so playing hot pays: this is the heat's reward on the table
- `betXPerLevel` **0.25**. Loaded Deck, extra payout per level: 2.25, 2.5, 2.75
- `betLimit` **6**. The most the house will take on one bet, and the card says so. Keeps a perfect stage inside the kit's 40, and stops Endless doubling for ever. What's over it is paid out safe. A stage can set its own (Card Row: 4)
- `betLimitPerLevel` **0**. Loaded Deck: a bigger bet per level. 0: it pays better on the same bet (the spec's "better bet payout"), which keeps a full set of upgrades near the kit's aim
- `endlessPurse` **2**. The table's floor in Endless, per wave

*Upgrades*

- `coolPerLevel` **0.1**. Cool Palms: extra cooling per level. Was 0.15, which let a bought-up player mostly ignore the bar. Runs in NOTES.md
- `lockPerLevel` **0.15**. Cool Palms: seconds off the lock per level
- `flamePerLevel` **0.25**. Bigger Flame: wider burn per level
- `warmBurn` **44**. Bigger Flame, level 2 up: WARM throws burn this far too
- `hotDmg3` **1**. Bigger Flame, level 3: extra damage for HOT and HOT HAND

*Score*

- `scoreWave` **100**. Score for clearing a wave.
- `scoreClean` **150**. Wave taken with no damage

*Timing between waves*

- `firstWave` **1.6**. Seconds of calm before the first wave's first foe
- `nextWave` **0.6**. And before the first foe of any later wave
- `clearBeat` **1.1**. Wave cleared, before the bet
- `gapSecs` **1.4**. Bet placed, before the next wave
- `bustSecs` **1.8**. How long BUST stays on screen

*Pals. Rare, and each asks for the thing the game is about*

- `cinderHot` **14**. Seconds at HOT or better in one attempt before Cinderbun comes to the warmth
- `cinderChance` **0.12**. Chance when that happens, once per attempt
- `cinderCatch` **78**. The heat it must be touched at: the HOT HAND band (edgeAt) or above, so it can't be caught by accident
- `cinderFromStage` **1**. Index, 1 = stage 2
- `cinderSecs` **9**. How long it stays before it wanders off
- `diceStake` **6**. At least this riding when a wave starts: the house's whole limit...
- `diceChance` **0.12**. ...and this chance Dicemite comes for a look
- `diceFromStage` **1**. Index, 1 = stage 2
- `diceSecs` **9**. How long it stays
- `dicePipSecs` **0.42**. Its shell rolls a new number this often. Tap on a six
- `diceMisses` **3**. Wrong tries before it runs off
- `palSpeed` **42**. Px/s
- `palStart` **400**. Px from Juno a pal comes in
- `palStartMid` **240**. The same in the Pit
- `palWalkIn` **1**. Seconds at full speed, before it slows to look around
- `palLook` **0.25**. Its speed then, as a share
- `palLeave` **2.4**. Its speed going away, as a share
- `palGone` **2.5**. Seconds after leaving until it's gone
- `palFlee` **2**. Seconds until a scared Dicemite is gone
- `palTall` **56**. How far above its feet a tap counts
- `palTallDice` **76**. Dicemite's, which takes in the number over it
- `palBelow` **8**. And how far under them

*Looks and layout: they change how it looks or fits, not the rules*

- `pxPerCm` **0.58**. Juno's 165 cm (CAST.md) is 96 px, a trooper's 180 cm is 104 px, Krell's 195 cm is 113 px
- `frontY` **288**. Feet line of the nearest lane. The felt below it holds the read-outs and the talk box
- `lanes` **[{ y: 212, s: 0.62 }, { y: 250, s: 0.8 }, { y: 288, s: 1 }]**. Far, middle, near: feet line and size
- `funnelFar` **280**. Px from Juno where the lanes start running together
- `funnelNear` **70**. And where they have become one
- `junoX` **66**. Juno's spot, stages 1, 2, 3 and the boss
- `junoMidX` **320**. Her spot in the Pit, with foes coming from both sides
- `spawnD` **664**. Px from Juno that foes start: x = 730, just off a 19.5:9 phone's right edge
- `spawnDMid` **420**. The same in the Pit: x = 740 and x = -100
- `talkClear` **13**. Px Juno's feet stand above the talk box in a talk scene, enough to clear her chips too (looks only)
- `hurtNumSide` **34**. Px to the side of Juno her hurt number starts, away from Ashka (looks only)
- `hurtNumUp` **84**. Px above her feet it starts (looks only)
- `ashkaClearX` **62**. Px either side of Juno where Ashka has to fly above her head (looks only)
- `ashkaClearY` **124**. And how far above Juno's feet that is: her 96 px, plus the drawn bird's reach below her centre (looks only)
- `floatTable` **20**. Px over a target's box that "+1 TABLE" starts; its damage number sits right on the box (looks only)
- `floatCog` **38**. And the same for "+1 COG", one line higher again (looks only)
- `hintSize` **15**. Logical px of the first-wave hint: 13.3 CSS px on a 568 x 320 phone, the kit's scale there being 0.8875
- `hintWide` **590**. Logical px wide before a hint breaks onto two lines
- `hintSecs` **9**. Seconds into a stage the hint stays up, while the first troopers walk in
- `bannerSecs` **1.5**. "WAVE 1" stays up this long (looks only)
- `quenchedSecs` **0.9**. How long the screen stays cold-blue and the bar says QUENCHED (looks only)
- `deadTapSecs` **0.3**. How long the palm jolts at a tap while her hands are locked (looks only)
- `loseBeat` **1.1**. Seconds between her going down and the lose screen
- `bossWinBeat` **1.4**. Seconds between Krell's last round and the win screen
- `krellGetsBurnLoss` **0.5**. Chance a burn-out at the boss gets one of his own lose lines, not a burn line
- `chipsBack` **50**. Px behind Juno that her chips sit, clear of her feet in every pose (looks only)
- `chipsNear` **8**. Px nearer us than her feet, so she can lie down without lying on them (looks only)
- `krellPortrait` **{ x: 0.24, y: 3.95, h: 4 }**. Where his picture sits in the talk portrait's square: across, feet line and his height, as shares of the square (looks only)
- `flashWhite` **0.85**. How white a figure goes when hit, for its 0.14 s (looks only)
- `saySecs` **3.4**. How long a line stays up in play (looks only)
- `sayHold` **2**. Seconds a line is safe from being replaced by the next (looks only)
- `sayStale` **3**. Seconds a waiting line can wait before it gives way to a newer one (looks only)
- `flyHome` **{ x: 96, y: 150 }**. Where she circles when not spotting (looks only)
- `ashkaBeside` **54**. Px to the side of her target she hovers (looks only)
- `ashkaDrop` **14**. Px under the top of its box (looks only)
- `throwSecs` **0.26**. Length of the throw pose (looks only)

*Test bot only, nothing to confirm:* `botEdge`, `botRushX`, `botRate`.

### `games/hot-hand/tuning-stages.js`: 69 play, 2 look or layout, 0 test bot


*The boss (FRIDAY_BATCH.md: "Warden Krell's shield line, with heat-vents to overload"). Lists run by round: first, second, third*

- `bossRounds` **3**. Rounds in the fight with Krell.
- `krellBox` **{ w: 60, h: 113 }**. His tap box. h is 195 cm (FRIDAY_BATCH.md) at pxPerCm
- `ventFirst` **1.2**. Seconds until the far shield's vent first whistles
- `ventStagger` **2.4**. And each next shield's vent that much later
- `bossAddFirst` **3.5**. Seconds into a round before the first grunt round the side
- `bossQuenchFirst` **4**. Seconds into a round before the first quench can
- `shieldScore` **150**. Score for blowing a shield
- `shieldChip` **1**. Salvage it puts on the table
- `shieldBlastR` **90**. Px of blast when one blows
- `shieldBlastDmg` **3**. And how hard it hits
- `krellScore` **40**. Score per hit on him, times the tier's multiplier
- `krellDownScore` **500**. Score for taking him through a round
- `krellTalks` **0.4**. Chance he says something when hit
- `lineStart` **412**. X of the near shield when a round begins: far enough left that Krell, at lineStart + krellX, stands whole on a 16:9 screen with no spare width (he reaches 47 px either side)
- `ramX` **216**. X where the line charges
- `marchSecs` **[17, 15, 16.5]**. Seconds from start to ram. The third is longer than the second because its vents are open for less time and more comes round the side: a clean thumb gets all three shields down at about 15 s there. Runs in NOTES.md
- `ramWarn` **4.5**. Seconds of march left when Sela calls the line closing: time for one more go at every vent (2.4 shut, 0.8 whistle, 1.7 open is 4.9 s, plus ramTell)
- `ramTell` **1.6**. Warning before it lands
- `ramHurt` **3**. Hits to Juno: half of her 6, so a second charge in a fight is the end. This is the line's own threat
- `ramBack` **402**. X the line falls back to afterward
- `shieldOff` **[130, 65, 0]**. Px each shield stands behind the near one, far to near
- `shieldW` **66**. Width at the near lane
- `shieldH` **104**. Height at the near lane of the shield and the man behind it: his head and top hand show over the plate. Also the tap box
- `ventMid` **44**. Height of the vent's middle at the near lane
- `ventNeed` **[9, 11, 11]**. Pressure that blows a shield. At about 0.75 throws a second at 3 pressure, 33 in all takes about 15 s. The third round was 13, and 39 in all couldn't be done before its charge
- `ventPush` **[1, 2, 3, 4]**. Pressure per throw by tier: cold, warm, hot, hot hand
- `ventMark` **2**. Extra pressure when Ashka has marked the vent
- `ventShut` **[2.6, 2.6, 2.4]**. Seconds shut
- `ventTell` **0.8**. Whistle and glow before it opens
- `ventOpen` **[2.4, 2.0, 1.7]**. Seconds open
- `ventGrace` **0.25**. Seconds after it shuts that a tap still gets in, for a thumb that arrives late
- `exposeSecs` **[7, 6.5, 6]**. Krell in the open once all three shields are blown
- `krellHp` **[12, 14, 16]**. Damage to take him through a round
- `reformGauge` **0.5**. Share of pressure re-raised shields start with if he isn't beaten in time
- `krellX` **170**. Px he stands behind the near shield
- `addEvery` **[2.6, 2.3, 2]**. Seconds between grunts slipping round the line
- `quenchEvery` **[0, 9, 7]**. Seconds between quench cans. 0 = none
- `quenchWind` **1.0**. His arm back and QUENCH showing
- `quenchFly` **1.5**. In the air. Can be burned
- `quenchHeat` **55**. Heat it takes off. It doesn't hurt: it isn't damage, and can't bust a bet
- `addMax` **6**. The most round the sides at once
- `bossPurse` **5**. The table per round

*The stages. Words are in words.js. mix: how many of each in a wave; gap: seconds between arrivals; cool: multiplies cooling*

- `stages[0]` **{ hp: 6, cool: 1, betLimit: 4, lanes: [0, 1, 2], look: 'row' }**. Hits, cooling. Low stakes while you learn: hardly anyone gets hit here, so the bet is small
- `stages[0].waves[0]` **{ mix: { grunt: 6 }, gap: [1.9, 2.6] }**. Easy: one flame kills, and only the plates ask for heat
- `stages[0].waves[1]` **{ mix: { grunt: 8, plate: 1 }, gap: [1.5, 2.1] }**. Stage 1, wave 2: how many of each foe, and the seconds between them.
- `stages[0].waves[2]` **{ mix: { grunt: 9, plate: 4 }, gap: [1.05, 1.5] }**. The last wave asks for quicker hands and some heat, so Dice Alley isn't a wall
- `stages[1]` **{ hp: 5, cool: 1, tough: 2, lanes: [1, 2], look: 'alley' }**. A narrow street: 2 lanes, so they bunch. Tough 2: a WARM throw no longer kills, a HOT one does, so this is where the heat starts to pay
- `stages[1].waves[0]` **{ tough: 1, mix: { grunt: 7, runner: 3 }, gap: [1.35, 1.9] }**. Tough 1 for this first wave: two cold throws or one warm, a step up from Card Row
- `stages[1].waves[1]` **{ mix: { plate: 3, hook: 3, squad: 2 }, gap: [1.8, 2.5] }**. Stage 2, wave 2: how many of each foe, and the seconds between them.
- `stages[1].waves[2]` **{ mix: { grunt: 5, runner: 4, plate: 2, hook: 2, squad: 2 }, gap: [1.2, 1.7] }**. Stage 2, wave 3: how many of each foe, and the seconds between them.
- `stages[2]` **{ hp: 5, cool: 1.25, tough: 2, lanes: [0, 1, 2], look: 'table', rain: 110 }**. Rain: she cools 1.25 times as fast, so holding the top takes quick hands, and they come faster than in the alley
- `stages[2].waves[0]` **{ mix: { grunt: 10, sniper: 3 }, gap: [1.0, 1.4] }**. Stage 3, wave 1: how many of each foe, and the seconds between them.
- `stages[2].waves[1]` **{ mix: { grunt: 7, plate: 3, sniper: 4, cart: 1, squad: 2 }, gap: [0.95, 1.3] }**. Stage 3, wave 2: how many of each foe, and the seconds between them.
- `stages[2].waves[2]` **{ mix: { grunt: 6, plate: 3, hook: 3, sniper: 4, cart: 2, squad: 3 }, gap: [0.8, 1.1] }**. Stage 3, wave 3: how many of each foe, and the seconds between them.
- `stages[3]` **{ hp: 5, cool: 0.7, tough: 1, both: true, lanes: [0, 1, 2], look: 'pit' }**. The Pit: fire all round, she cools slowly, they come from both sides
- `stages[3].waves[0]` **{ mix: { grunt: 9, hollow: 3 }, gap: [1.2, 1.7] }**. Stage 4, wave 1: how many of each foe, and the seconds between them.
- `stages[3].waves[1]` **{ mix: { grunt: 6, runner: 6, hollow: 4, cart: 2 }, gap: [1.0, 1.5] }**. Stage 4, wave 2: how many of each foe, and the seconds between them.
- `stages[3].waves[2]` **{ mix: { grunt: 5, plate: 4, hook: 3, hollow: 5, squad: 4, cart: 2 }, gap: [1.0, 1.4] }**. Stage 4, wave 3: how many of each foe, and the seconds between them.
- `stages[4]` **{ boss: true, hp: 6, cool: 1, tough: 1, lanes: [0, 1, 2], look: 'vault' }**. "takes a few tries" (spec)
- `endless` **{ hp: 6, cool: 1, lanes: [0, 1, 2], look: 'row', isEndless: true }**. Endless: hits you can take, cooling and lanes.
- `endlessBase` **7**. Foes in the first Endless wave
- `endlessGrow` **1.6**. More each wave
- `endlessGap` **[1.6, 2.2]**. Seconds between arrivals, first wave
- `endlessGapMin` **0.7**. The fastest it gets
- `endlessShrink` **0.08**. Taken off the gap each wave
- `endlessMods` **[1, 1.5, 0.7]**. The cooling cycles through plain, rain, fire
- `aliveMax` **12**. Arrivals wait when this many are up
- `endlessToughEvery` **3**. Endless: foes take one more damage every this many waves
- `endlessToughMax` **3**. And no more than this

*Looks and layout: they change how it looks or fits, not the rules*

- `shieldPlate` **84**. Height of the steel plate itself at the near lane (looks only)
- `shieldManX` **4**. Px the man stands behind the plate's middle (looks only)

## Silent Cut

**Try these first** (the ones most likely to change):
- Creeping speed: **92** (`creep`)
- Seconds lit before an alarm, moving: **1.2** (`fillMovingSecs`)
- Seconds lit before an alarm, frozen: **2.6** (`fillFrozenSecs`)
- Delay before he starts moving: **0.14** (`creepDelay`)
- Double-tap gap for a slow thumb: **0.16** (`tapSlowGap`)
- How fast breath comes back: **0.035** (`breathRegen`)

### `games/silent-cut/tuning.js`: 123 play, 17 look or layout, 13 test bot


*Moving (spec: "Hold to creep forward, let go to freeze")*

- `creep` **92**. Px per second
- `creepDelay` **0.14**. Seconds a press must last before he moves, so a tap can't walk him out of hiding
- `tapMax` **0.18**. A press up to this long is a quick tap: two of them within doubleGap are a Surge
- `tapSlowGap` **0.16**. When either press ran longer than tapMax, the second must follow this fast to Surge. A slow thumb's double tap has a short gap (real presses of 250, 100, 250 ms). Hold, let go, hold in a crate's shade has a longer one, so it doesn't spend breath
- `doubleGap` **0.36**. Seconds from letting go of the first quick tap to pressing the second. Measured gap only, so how long the press lasts doesn't eat into it
- `halfW` **8**. Half his width, for light and contact
- `hideDelay` **0.12**. Seconds of stillness before cover counts as hiding
- `coverSlop` **10**. Px past a cover's edge that still counts as behind it
- `grabRadius` **26**. Reach for salvage

*Being seen (spec: "being lit for too long raises an alarm, and three alarms fail the stage")*

- `fillMovingSecs` **1.2**. Seconds of light to an alarm while moving, before the stage's alert factor
- `fillFrozenSecs` **2.6**. And while frozen in the open. Freezing buys time; it doesn't hide you
- `drainSecs` **1.8**. Seconds in the dark for a full meter to empty
- `lampFactor` **1.4**. A trooper's or Maro's own lamp fills the meter this much faster
- `graceSecs` **2**. Seconds after an alarm in which the meter can't fill, time to run for it
- `knockback` **46**. Px he's shoved back when a trooper bumps into him
- `hurtSecs` **0.35**. Seconds he stumbles after that
- `closeGap` **16**. Px from a searchlight's edge that counts as a close call
- `closeEvery` **1.6**. Seconds between close calls

*The Surge and the bond cost (spec: "a silent wind dash through light, which uses breath")*

- `surgeDist` **165**. Px per dash
- `surgeSecs` **0.2**. Length of the dash; no light can fill the meter during it, and it goes through a trooper
- `surgeAfter` **0.25**. Seconds of cover after landing
- `surgeCost` **1 / 3**. Three Surges from a full chest
- `breathRegen` **0.035**. Breath per second, frozen only (spec: "returns slowly when frozen"). About 9.5 s for one Surge, so a stage's gates cost more than its waits give back
- `regenDelay` **0.25**. Seconds of stillness before breath starts to come back
- `windedSpeed` **0.6**. Out of breath he moves at this share of creep (spec: "moves slower"). 55 px/s, so he can't keep up with a crane's 72
- `raspyBelow` **0.5**. Under this share of his chest, Silas's lines start breaking up
- `raspFrom` **2**. Which time out of breath in one attempt at a stage starts to scar his voice for the story run. The first of a stage he gets over; a wide gate on a scarred chest forces that one, so only the next is the player's doing
- `raspLoss` **0.1**. Breath lost from the top of his chest with each scar. Lasts the story run (run.carry). At the worst (raspMax) that leaves 0.7, still two Surges, so a wide gate can always be crossed after a long wait
- `raspRegenLoss` **0.12**. Share of breath's return lost with each scar. A silence lasts about 9.7, 11, 12.7, 15 s at rasp 0 to 3, so the cost keeps growing after the Surges have stopped falling
- `raspMax` **3**. The most scars there are. It's the floor, so the run stays winnable. He still talks at it, in rags (words.js); only being out of breath blanks him (spec)
- `voiceKeep` **0.7**. Share of a line left when his voice starts to break up
- `voiceKeepWorse` **0.4**. And when it's worse: rasp 2, or breath under half of raspyBelow
- `voiceKeepWorst` **0.25**. And at raspMax, for lines in play. Scene lines are written out by hand in words.js
- `raspyWorse` **0.5**. That "half"

*The chain-blade (spec: "Tap when close behind a trooper to strike")*

- `reach` **66**. Px, for a strike and for cutting a lantern
- `strikeSecs` **0.3**. How long he stands still to throw the chain
- `strikeCalm` **0.56**. Seconds after a strike or a cut on Maro in which a tap can't start or finish a Surge. Just over doubleGap + tapMax, the latest a double tap's second tap can lift. Also how long a tap on the dizzy moth waits before it's a catch, for the same reason
- `cutSecs` **0.18**. And to cut a lantern
- `cutNoise` **170**. Troopers this close hear a lantern fall

*Troopers*

- `contact` **14**. Px, walking into one raises the alarm
- `waitSecs` **1.5**. He stops this long at the end of his beat before turning
- `tellSecs` **1.0**. The turn warning, the last part of that wait: "!" with a ring that closes (checked by fairness.js)
- `hearSecs` **0.45**. "?" before he turns to a sound
- `goSpeed` **60**. Walking to a sound
- `huntSpeed` **104**. Running to where he last saw you, after an alarm
- `huntRange` **420**. Troopers this close join the hunt
- `lookSecs` **1.5**. How long he stands and looks, before turning back with the same warning
- `lampLen` **95**. Length of his lamp's pool, px ahead of him

*Noise*

- `stepSecs` **0.42**. Seconds between footsteps
- `creakR` **130**. Px a creaking board carries

*The lamp line behind you: why waiting isn't safe, and why doing nothing loses*

- `lineLead` **780**. It never falls further than this behind him
- `lineJump` **110**. Px it gains on every alarm
- `lineFillSecs` **0.8**. Seconds to an alarm once it reaches him; cover doesn't help against a whole line of lamps
- `lineWarnAt` **300**. Px away that the horn and the warning line play, once
- `lineWarnReset` **420**. Px he has to get away for that warning to play again

*Upgrades*

- `lungMax` **1 / 3**. Deep Lungs, extra chest per level: one whole Surge, so every level you pay for puts a new feather on the panel
- `lungRegen` **0.15**. Deep Lungs, faster breath per level
- `chainPerLevel` **22**. Longer Chain, extra reach per level
- `bootCreep` **7**. Softer Boots, extra creep speed per level, px per second
- `bootCreak` **30**. Softer Boots, less carry on a creaking board per level
- `bootFill` **0.07**. Softer Boots, share slower that light fills the meter while moving, per level

*Salvage and score. Kit aim: a stage clear pays about 15 to 40 in all*

- `coinValue` **1**. Salvage for one cog.
- `strikeSalvage` **1**. A trooper's pockets
- `ghostSalvage` **6**. Extra for a stage with no alarm
- `scorePerPx` **0.1**. Score for each px of street covered.
- `scoreStrike` **60**. Score for a strike.
- `scoreCut` **15**. Score for cutting a lantern.
- `scoreClose` **20**. Score for a close call.
- `scoreCoin` **5**. Score for a cog.
- `scoreClear` **250**. Score for clearing a stage.
- `scoreGhost` **300**. Score for clearing a stage with no alarm.
- `scoreTimePerSec` **6**. For every second under the stage's par, so being quick pays
- `scoreMaroHit` **400**. Score for a cut on Maro.
- `scoreStreak` **40**. Extra per trooper when strikes come in a row
- `streakSecs` **5**. Seconds a strike keeps a streak going

*Pals. Each takes something done on purpose, so they stay rare*

- `tuftleFromStage` **1**. Index, 1 = stage 2
- `tuftleStill` **18**. Seconds frozen in cover, with no alarm so far this stage, before the eyes may open. Longer than waiting for one Surge or two, so it's a choice to sit on, not something that happens while getting breath back
- `tuftleChance` **0.25**. Chance when that happens; once per cover
- `tuftleStay` **2.4**. Stay frozen this much longer and it climbs on
- `lamplickFromStage` **1**. Index, 1 = stage 2
- `lamplickChance` **0.15**. Chance one lantern per attempt has the moth on it
- `lamplickSecs` **5**. Cut that lantern, then tap the dizzy moth within this many seconds. It gets a TAP ring while it's in the chain's reach
- `mothOffStart` **700**. Its lantern is at least this far from where he starts, so it's off screen during the talk scene, even on a wide phone (the street shows to about 590 px)
- `mothHear` **340**. Px ahead of him the moth's lantern starts to chirp and gets its line. It stops once he can't reach the lantern any more
- `mothDrift` **150**. Px per second a dizzy moth wobbles after him if he cut its lantern from past it, since he can't walk back. Faster than the quickest creep (113, with Softer Boots), so it always gets to him inside lamplickSecs
- `mothStartAlt` **90**. Px up it falls from when its lantern's cut
- `mothRestAlt` **16**. Px up it settles at, in reach
- `mothFall` **40**. Px per second it sinks
- `mothChirps` **3**. Chirps per second while it's in earshot

*Ledger Maro (spec: "strike when his back is turned, and dodge his sweeping lamp and guards"). Lists run by hits so far: first, second, third round*

- `maroHits` **3**. Three cuts
- `maroBlock` **22**. Silas can't walk through him
- `maroReachLess` **0**. How much closer the chain has to be for Maro than for a trooper. Was 14. 0: the same reach as anyone
- `maroPool` **44**. Half width of the lamplight he stands in while reading; it's ordinary light. Was 74. With no upgrades the TAP ring shows 14 px (0.15 s of walking) before his light can touch Silas, and a lift up to about 0.7 s after the ring still cuts first (checked by fairness.js)
- `maroBack` **[4.2, 3.6, 3.2]**. Seconds his back stays turned, last part of it the warning
- `maroVary` **[1, 0.85, 1.2, 0.9, 1.1]**. And each turn differs by these, so he can't be counted; the warning stays the same length
- `maroTell` **1.1**. The warning that he's about to turn: ledger shuts, "!" with a closing ring (checked by fairness.js)
- `maroLampSecs` **0.6**. Seconds of his lamp to an alarm, before the stage's alert factor, frozen or not. Short enough that one pass finds a man frozen in the open: only cover beats it
- `maroFace` **[3.0, 3.4, 3.8]**. Seconds he faces you, his lamp sweeping out and back once
- `maroLampNear` **50**. The sweep starts this far in front of him
- `maroLampFar` **[380, 430, 480]**. And reaches this far
- `maroLampR` **[66, 72, 80]**. Half width of the pool
- `maroHitSecs` **0.8**. He reels
- `maroRun` **210**. Px per second, running to his next desk
- `maroFallSecs` **3**. The last moment before the win, long enough for Silas's broken line and Maro's last one
- `bossWinBeat` **0.6**. Seconds the boss's last moment stays up after the win, before the result
- `maroCoins` **3**. Salvage he drops per cut. The first two cuts drop it on the way to his next desk; the last cut banks it, since the stage is over
- `maroCoinAhead` **40**. Px past him the first coin lands, where Silas is walking next
- `maroCoinGap` **26**. Px between coins
- `tickSlow` **0.28**. Sound only. Seconds between meter ticks when it starts to fill
- `tickFast` **0.2**. Sound only. How much quicker they get by the time it's full

*How often someone speaks. A chance, 0 to 1, each time it could happen*

- `quips` **{ close: 0.2, cut: 0.4, strike: 0.55, surge: 0.25, breathBack: 1, alarmSilas: 0.5, maroTurn: 0.5 }**. Chance Silas says something at each of these moments, 0 to 1.

*How long words stay up, in seconds. All PROVISIONAL*

- `talk` **say: 2.8, quip: 2.4, radio: 3, moth: 3, alarm: 2.4, lineWarn: 3.4**. Seconds each kind of line stays up.
- `talk.tipSecs` **5.5**. A tip stays up this long
- `talk.tipNext` **3**. And the next one may take over when this much is left
- `talk.curse` **1.6**. "Oh, for f"
- `talk.crewAfter` **1.7**. Then the crew's line this long after his breath goes
- `talk.crew` **3.2**. And it stays this long
- `talk` **tuftle: 2.4, maroStart: 3.4, maroGreetAt: 0.8, maroTurn: 2.4**. Seconds each kind of line stays up.
- `talk.maroCut` **1.8**. Silas's line on a cut
- `talk.maroAfter` **1.9**. Maro answers this long after a cut
- `talk.maroCutLast` **1**. The third cut's line is cut off short
- `talk.maroAfterLast` **1.1**. So Maro's last line comes in soon enough to be read before maroFallSecs ends
- `talk.maroLine` **2.8**. Seconds one of Maro's lines stays up.

*Looks and layout: they change how it looks or fits, not the rules*

- `pxPerCm` **0.46**. Silas's 183 cm (CAST.md) comes out about 84 px tall
- `groundY` **268**. Feet line. High enough that the talk box on the smallest phone (top edge at logical y 292) clears the walkway and the marks under it (to feet + 24)
- `hudY` **288**. Looks only. The band the breath panel and the alarms sit in, counted from here
- `startX` **30**. Where Silas starts each stage, px along the street
- `camX` **190**. Where Silas stands on screen, so at least 450 px of what's coming shows
- `doubleLate` **0.8**. Looks only. A second tap this soon that was too slow gets a "QUICKER", so a missed Surge isn't silence
- `downDrop` **11**. Px to lower the kit's lying-down figure so it rests on the walkway, looks only
- `chainWindup` **0.2**. Looks only. Share of a strike with the knife wound up behind his hand
- `chainFly` **0.25**. Looks only. Share of a strike or cut the knife takes to reach its target
- `lineShowAt` **460**. Looks only. px away that "LAMP LINE n m" shows
- `lineUrgentAt` **220**. Looks only. px away that it flashes
- `tuftleEyesBack` **22**. Looks only. px behind him the eyes open
- `hideLiftArt` **20**. Looks only. px the hiding picture, or the code figure if the picture's missing, is raised behind cover, so his head shows over crates up to 68 px high
- `hushSpeed` **260**. Looks only. px per second Hush flies to the next safe place
- `sceneInk` **0.55**. Looks only. Ink on code-drawn props and streets, as a share of the kit's, so they sit nearer the pictures' fine lines. 1 puts the old heavy lines back. For Dylan's eye
- `floatClear` **42**. Looks only. px beside him that "creak" and "+1" float, so they don't cover him
- `pagesSecs` **1.4**. Looks only. How long the ledger's pages fly after a cut

*Test bot only, nothing to confirm:* `botLook`, `botSafe`, `botGateWalk`, `botStep`, `botThink`, `botLead`, `botArrive`, `botStay`, `botWaitSome`, `botWaitLong`, `botNearMaro`, `botMaroClose`, `botLanternBack`.

### `games/silent-cut/tuning-stages.js`: 22 rows, every number on them provisional

- `chunks.firstLantern` **500 px**. A stretch of street, 500 px long, with 2 cover, 1 lantern, 1 coin.
- `chunks.beam` **560 px**. A stretch of street, 560 px long, with 3 cover, 1 sweep, 2 coin.
- `chunks.walker` **620 px**. A stretch of street, 620 px long, with 3 cover, 1 trooper, 1 coin.
- `chunks.twoLanterns` **520 px**. A stretch of street, 520 px long, with 2 cover, 2 lantern, 1 coin.
- `chunks.floodGate` **400 px**. A stretch of street, 400 px long, with 2 cover, 1 flood, 1 coin.
- `chunks.longGate` **540 px**. A stretch of street, 540 px long, with 2 cover, 1 flood, 1 coin.
- `chunks.oilRow` **760 px**. A stretch of street, 760 px long, with 3 cover, 5 lantern, 1 trooper, 2 coin.
- `chunks.crossfire` **700 px**. A stretch of street, 700 px long, with 4 cover, 2 sweep, 2 coin.
- `chunks.gateGuard` **660 px**. A stretch of street, 660 px long, with 3 cover, 1 flood, 1 trooper, 2 coin.
- `chunks.crane` **700 px**. A stretch of street, 700 px long, with 2 cover, 1 flood, 1 crane, 2 coin.
- `chunks.craneRest` **760 px**. A stretch of street, 760 px long, with 3 cover, 2 flood, 1 crane, 2 coin.
- `chunks.craneGuard` **780 px**. A stretch of street, 780 px long, with 3 cover, 1 flood, 1 crane, 1 trooper, 2 coin.
- `chunks.boards` **660 px**. A stretch of street, 660 px long, with 3 cover, 1 trooper, 2 coin.
- `chunks.boardsPair` **800 px**. A stretch of street, 800 px long, with 4 cover, 1 lantern, 2 trooper, 2 coin.
- `chunks.boardsBeam` **760 px**. A stretch of street, 760 px long, with 4 cover, 1 lantern, 1 sweep, 1 trooper, 2 coin.
- `stages[0]` **fast 1, alert 1, lineV 11, par 50, clearSalvage 10**. Stage 1: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.
- `stages[1]` **fast 1.04, alert 1.12, lineV 14, par 80, clearSalvage 13**. Stage 2: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.
- `stages[2]` **fast 1.06, alert 1.22, lineV 16, par 100, clearSalvage 15**. Stage 3: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.
- `stages[3]` **fast 1.1, alert 1.34, lineV 18, par 115, clearSalvage 18**. Stage 4: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.
- `stages[4]` **fast 1.1, alert 1.55, lineV 16, par 90, clearSalvage 14**. Stage 5: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.
- `boss` **desks 640, 1320, 2020**. Maro's warehouse: where his three desks stand, with 9 covers, 3 lanterns, 3 troopers, 6 cogs and his room beam laid out around them.
- `endless` **13 stretches**. Which stretches of street Endless picks from, and how it speeds up.

## Hold the Deck

**Try these first** (the ones most likely to change):
- How long a press must last to turn to Iron: **0.34** (`holdSecs`)
- Grey added by each Iron: **0.08** (`ironPerUse`)
- Guts lost to a volley on the chin: **3** (`volleyHurt`)
- Warning before the bear rakes: **0.95** (`boss.swipeWarn`)
- Hits on the core, phase 2: **20** (`boss.coreP2`)
- Hits on the core, phase 3: **26** (`boss.coreP3`)

### `games/hold-the-deck/tuning.js`: 127 play, 14 look or layout, 0 test bot


*Bram. Base numbers at no iron*

- `stepSecs` **0.17**. Seconds to walk one lane
- `swingCd` **0.3**. Seconds between swings that hit
- `whiffMul` **1.4**. A swing at nothing takes this much longer, so hammering the glass isn't the best play
- `whiffStagger` **0.28**. A swing at nothing costs him his footing: he can't set off for another lane for this long. A lit lane under him cancels it, so a dodge is never late because of it
- `whiffRunAdd` **0.14**. And this much more for each swing at nothing in a row, so sweeping the lanes without looking gets slower and slower
- `whiffRunMax` **3**. Counted up to this many
- `whiffForget` **2.5**. Seconds without a miss before the streak starts again from nothing
- `swingWindup` **0.07**. From the tap to the hit
- `swingBuffer` **0.14**. A tap on his own lane this close before he's ready still counts. A tap on another lane always swings on arrival, however long the hammer takes to come back
- `hurtSecs` **0.4**. Hurt pose
- `hitStopSecs` **0.05**. The freeze on a hit on the core, or two boarders in one swing
- `invuln` **0.7**. Seconds of safety after a hit on him. Boarders who get through the door ignore it
- `guts` **5**. Guts at the start of each stage
- `apronPerLevel` **1**. Thick Apron, Guts per level
- `mercyPerLoss` **1**. Dying on a stage leaves one more Guts for the next try at it, so grey is never a wall you can only escape by starting the story again
- `mercyMax` **3**. Up to this many. Back to none once the stage is won
- `mercyMinSwings` **3**. A try only earns the extra Guts (and on the bear, its wounds) if this many swings landed on something, so standing idle till he drops buys nothing. Kept low: slow thumbs' losing tries land 1 to 5 at the least, and they're who the Guts are for (NOTES.md)

*Iron: the bond cost. Lasts the whole story run through run.carry.iron, 0 to 1*

- `holdSecs` **0.34**. How long a thumb stays down before Iron starts. Above the kit's 0.28 s tap (shared/kit/input.js), so a press can't be both a tap and an Iron; short enough for every warning (test/fairness.js)
- `ironPerUse` **0.08**. Every use spreads this much (spec: "every use spreads grey iron")
- `ironFreeHold` **1.2**. Seconds of a hold that cost nothing more
- `ironPerSec` **0.05**. And after that
- `ironStepSlow` **1.6**. At full iron a lane takes 0.17 x (1 + 1.6) = 0.44 s
- `ironSwingSlow` **1.3**. At full iron a swing takes 0.3 x (1 + 1.3) = 0.69 s
- `ironHeavy` **1.0**. At full iron a swing hits this much harder than bare (at 50%, half this), on anything with more than 1 point in it. Kept under ironSwingSlow, so more grey never hits harder per second than less
- `ironLineAt` **0.5**. Past this Ione says so, the boots clank, the read-out turns orange, Sela hears it in stage 4
- `swingRecover` **0.5**. Letting go of Iron leaves the hammer down for this share of a swing
- `shedScore` **15**. Score per boarder knocked away when Iron is let go
- `reflectDamage` **2**. A hook bounced off Iron goes back up the lane and hits the first boarder this hard
- `shedHit` **1**. What letting go of Iron does to whatever piled up on him

*Grist*

- `temperPerKill` **0.085**. About 12 boarders fill him
- `temperChain` **0.05**. On top, for each extra boarder in one swing
- `temperPerLevel` **0.25**. Grist's Temper, extra fill per level
- `temperIronBlock` **0.2**. Stopping a hook, crate or claw with Iron riles him up
- `temperPerSec` **0.006**. He slowly wakes up by himself
- `gristSpeed` **2.2**. D per second up the lane
- `gristBack` **1.1**. Seconds he takes to trudge back before he can go again
- `gristFromD` **1.12**. Where he sets off, behind the door
- `gristToD` **-0.15**. Where he's run past the far end
- `gristWidth` **0.09**. How far ahead of his nose he flattens things

*Boarders. speed in d per second, before the stage's multiplier*

- `foes.grunt` **{ speed: 0.15, hp: 1, cm: 180, score: 20, drop: 0.2 }**. Cm from trooper-sheet-v1. About 6.7 s from far end to door
- `foes.runner` **{ speed: 0.27, hp: 1, cm: 176, score: 30, drop: 0.2 }**. About 3.7 s
- `foes.shield` **{ speed: 0.125, hp: 2, cm: 180, score: 40, drop: 0.25 }**. The plate takes one swing, the man another
- `foes.cutter` **{ speed: 0.15, hp: 1, cm: 180, score: 40, drop: 0.25, stopAt: 0.32, every: 3.4, throws: 2, firstAim: 0.2 }**. Throws twice from range, then walks in
- `foes.rope` **{ speed: 0.15, hp: 1, cm: 180, score: 25, drop: 0.2 }**. Drops in from a crane line, part way down a lane
- `foes.ram` **{ speed: 0.105, hp: 3, cm: 180, score: 90, drop: 0.5 }**. Three swings, one Iron or one Grist
- `bladeHurt` **1**. Guts a boarder's blade takes
- `doorHurt` **1**. Guts a boarder through the door takes
- `ramShoveHurt` **1**. Guts a ram takes shoving him aside
- `attackWindup` **0.45**. Seconds a boarder squares up to Bram before his blade lands. Shown by a white glint
- `attackRecoil` **0.1**. How far he stumbles back after landing it
- `hitKnock` **0.05**. How far a boarder who survives a swing is knocked back
- `sideSecs` **0.5**. Seconds to step round a crate into the next lane
- `sideWalkMul` **0.4**. How fast he comes on while he's stepping round it
- `wallAheadD` **0.06**. How near a wall he gets before he steps round
- `wallRoundD` **0.08**. A wall in the next lane this close shuts that way
- `wallChewSecs` **1.6**. With every way shut, he hacks through in this long
- `wallChewStop` **0.05**. And waits this far short of it
- `ramContactD` **0.86**. Where a ram reaches Bram
- `ramDoorHurt` **2**. Guts a ram takes when it reaches the door
- `ramIronSecs` **0.8**. How long Iron takes to break a ram that's run into it
- `ramCogs` **3**. Salvage when a ram drops any

*Warnings. Everything thrown or dropped warns first, on the lane: seconds from the warning's first frame to the hit*

- `hookWarn` **1.3**. Last hookFly of it is the hook in the air
- `hookFly` **0.32**. Seconds a thrown hook is in the air.
- `dropWarn` **1.35**. A crate aimed at the lane Bram stands in when it starts
- `hookHurt` **1**. Guts a hook takes
- `crateHurt` **1**. Guts a dropped crate takes
- `wallWarn` **1.2**. A crate that lands part way down and stays
- `ropeWarn` **1.0**. A boarder dropping in. No harm in the landing
- `wallD` **[0.68, 0.78]**. Where a wall crate can land. All past the gold line (reachD), so the hint's "smash it" is always true
- `wallMax` **2**. At most this many walls at once, so there's always a way through
- `wallSalvage` **1**. Every crate can be reached now, so this and stage 3's clear are down, to keep a clear near the kit's 15 to 40
- `dropSalvage` **1**. A crate that bursts on Iron, or on the bare deck
- `fairReact` **0.4**. A new warning waits unless this much time is left after the walk to a safe lane, however slow he's got. Checked in test/fairness.js
- `dropKillD` **0.08**. A crate landing this near a boarder takes him out
- `wallKillD` **0.06**. And a wall crate this near
- `volleyWarn` **1.5**. Reaction, then holdSecs, with time to spare (test/fairness.js)
- `volleyHurt` **3**. Guts if it lands. More than a bowl of broth pays back, and more volleys come in a stage than 5 Guts and the bowls can pay for, so stages 2 to 4 each ask for some Iron
- `volleyChinMax` **3**. The third volley taken on the chin in one try drops him, however many Guts he has. It's where the no-upgrades sums already put it (5 Guts, two bowls of 2, 3 a volley), so Thick Apron and Big Pot help with everything except buying the grey off. Full iron doesn't count
- `volleyHurtLocked` **1**. At full iron there's no Iron stance, but he's mostly anvil, so it hurts less. Keeps a fully grey Bram winnable
- `temperVolley` **0.3**. Stopping a volley riles Grist up

*Meals*

- `brothGuts` **2**. Bone Broth
- `brothPerLevel` **1**. Big Pot adds this per level
- `pepperMul` **0.72**. Pepper Stew: walk and swing times for the next wave, or the next phase of the bear
- `pepperPerLevel` **0.04**. Big Pot takes this much more off
- `pepperFloor` **0.5**. Never quicker than this
- `tonicIron` **0.06**. Ione's Tonic: iron pulled back. "a little" (spec): less than one Iron's worth (ironPerUse), so the grey only ever creeps one way
- `tonicPerLevel` **0.005**. Big Pot adds this per level. Level 3 gives 7.5%, still under one Iron's 8%
- `calmSecs` **0.9**. The beat after a wave before the pot comes out
- `bannerSecs` **1.5**. The wave's name on screen, before the first boarder sets off
- `hintSecs` **4.2**. The plain-words plate at the start of a stage or boss phase. Nothing sets off while it's up, so it never hides anything that matters
- `sayQueueMax` **3**. Lines waiting their turn in the talk box; older ones are dropped
- `saySecs` **3.4**. How long a line stays up unless it says otherwise
- `sayMealSecs` **2.0**. The crew's word after a meal
- `palSay` **{ rivetling: 2.0, spoonling: 2.6 }**. How long a pal's line stays up. Rivetling's walk is 2.0 s (rivetWalk), so its line ends as it arrives
- `firstBeat` **0.2**. Seconds into a wave before its first beat
- `beat` **{ pairRoom: 0.5, fileAfter: 0.75, fileRoom: 0.4, lineRoom: 1.0, flankAfter: 1.0, flankRoom: 0.4, rushAfter: 0.7, rushRoom: 0.8, shieldRoom: 0.3, dropRoom: 0.3, ramRoom: 1.2, volleyRoom: 1.0, retry: 0.25, ropeD: [0.34, 0.52], laneClearMul: 1.4 }**. How much room each kind of beat leaves after it, in seconds, and how long the second man waits.

*The ending: how much grey picks which words*

- `endingMid` **0.12**. Under this, "hardly any new grey" is true. One Iron is 8%
- `endingHigh` **0.5**. From here, it's in the joints

*Salvage. Kit aim: a stage clear pays about 15 to 40 in all*

- `cogValue` **1**. Salvage for one cog.

*Score*

- `scoreClear` **200**. Score for clearing a stage.
- `scorePerSalvage` **5**. Score for each salvage picked up.
- `scorePerGuts` **50**. Guts left at a clear
- `chainScore` **15**. For each extra boarder in one swing

*The first four stages, and the boss's place. Words are in words.js. gap = seconds between beats; beats = how many; mix = weights of what a beat can be.*

- `stages[0]` **{ look: 0, speed: 1.0, clearSalvage: 13 }**. "first stage easy for a new player". About 55 s. Whether it's calm or dull needs Dylan's thumb
- `stages[0].waves[0]` **{ beats: 9, gap: [1.9, 2.5], mix: { grunt: 1 } }**. Stage 1, wave 1: how many of each foe, and the seconds between them.
- `stages[0].waves[1]` **{ beats: 12, gap: [1.4, 1.9], mix: { grunt: 5, pair: 2, file: 1, runner: 1 } }**. Stage 1, wave 2: how many of each foe, and the seconds between them.
- `stages[1]` **{ look: 1, speed: 1.08, clearSalvage: 11, volley: ['hook'] }**. Cutters and ropes bring Iron in. Boarders come quicker than stage 1. About 75 s
- `stages[1].waves[0]` **{ beats: 9, gap: [1.4, 1.85], mix: { grunt: 4, cutter: 2, pair: 1, rope: 2 }, volleysAt: [6] }**. Stage 2, wave 1: how many of each foe, and the seconds between them.
- `stages[1].waves[1]` **{ beats: 12, gap: [1.1, 1.5], mix: { grunt: 3, runner: 2, cutter: 3, pair: 3, rope: 2 }, volleysAt: [6] }**. Stage 2, wave 2: how many of each foe, and the seconds between them.
- `stages[1].waves[2]` **{ beats: 14, gap: [0.9, 1.3], mix: { grunt: 3, runner: 3, cutter: 3, pair: 3, rope: 2, rush: 2, flank: 1 }, volleysAt: [8] }**. Stage 2, wave 3: how many of each foe, and the seconds between them.
- `stages[2]` **{ look: 2, speed: 1.08, clearSalvage: 5, crane: true, volley: ['crate'] }**. The crane: walls change the traffic, drops chase him. About 80 s
- `stages[2].waves[0]` **{ beats: 10, gap: [1.5, 2.0], mix: { grunt: 4, wall: 3, drop: 3, pair: 2 }, volleysAt: [6] }**. Stage 3, wave 1: how many of each foe, and the seconds between them.
- `stages[2].waves[1]` **{ beats: 14, gap: [1.05, 1.5], mix: { grunt: 3, runner: 3, wall: 3, drop: 4, cutter: 1, pair: 3, line: 1 }, volleysAt: [7] }**. Stage 3, wave 2: how many of each foe, and the seconds between them.
- `stages[2].waves[2]` **{ beats: 18, gap: [0.8, 1.2], mix: { grunt: 3, runner: 3, wall: 3, drop: 5, cutter: 2, pair: 4, rush: 2, line: 2 }, volleysAt: [5, 13] }**. Stage 3, wave 3: how many of each foe, and the seconds between them.
- `stages[3]` **{ look: 3, speed: 1.05, clearSalvage: 6, hekka: true, volley: ['hook', 'crate'] }**. Shields and rams: three ways to stop a ram, and the meter to save for it. Eased in the review: it was harder than the bear. About 90 s
- `stages[3].waves[0]` **{ beats: 10, gap: [1.5, 2.0], mix: { grunt: 3, shield: 4, runner: 2, pair: 2 }, ramsAt: [5], volleysAt: [8] }**. Stage 4, wave 1: how many of each foe, and the seconds between them.
- `stages[3].waves[1]` **{ beats: 13, gap: [1.1, 1.5], mix: { grunt: 3, shield: 3, runner: 2, cutter: 2, pair: 2, flank: 1 }, ramsAt: [3, 9], volleysAt: [7] }**. Stage 4, wave 2: how many of each foe, and the seconds between them.
- `stages[3].waves[2]` **{ beats: 15, gap: [1.0, 1.35], mix: { grunt: 3, shield: 3, runner: 2, cutter: 2, drop: 2, pair: 3, rush: 2, line: 1, flank: 1 }, ramsAt: [4, 10], volleysAt: [8] }**. Stage 4, wave 3: how many of each foe, and the seconds between them.
- `stages[4]` **{ look: 4, boss: true, speed: 1.3, clearSalvage: 26 }**. "boss takes a few tries" (spec)
- `endless.mix` **[ { grunt: 5, pair: 1 }, { grunt: 4, runner: 2, cutter: 2, rope: 1, pair: 1 }, { grunt: 3, runner: 2, wall: 2, drop: 3, cutter: 2, pair: 2 }, { grunt: 2, runner: 3, shield: 3, cutter: 2, drop: 3, wall: 1, ram: 1, rush: 2, pair: 3, line: 1 } ] }**. Endless: what comes in each wave, as the waves go on.

*Pals. Each asks something odd of the player*

- `rivetChance` **0.4**. Chance once per attempt from stage 3, when Iron has been held rivetHold seconds
- `rivetHold` **1.3**. Longer than any block needs. With the walk, a hold for Rivetling costs about 18% iron
- `rivetFromStage` **2**. Index, 2 = stage 3
- `rivetWalk` **2.0**. Seconds it takes to shuffle over to him. Let go before that and it rolls away
- `spoonChance` **0.6**. Chance when a meal is wasted (broth at full Guts, tonic with no iron to shift). From stage 2
- `spoonFromStage` **1**. Index, 1 = stage 2
- `spoonSecs` **7**. How long it begs before it gives up

*Looks and layout: they change how it looks or fits, not the rules*

- `farY` **92**. Top of the deck. A talk box of up to 2 lines stays above it on the 320 px phone; NOTES.md has the measured sizes
- `doorY` **532**. The galley counter's edge. Everything under it is read-outs
- `laneFar` **62**. Lane width at the far end. 62 logical is 55 CSS px on a 320 px phone, so a far lane is still a good tap target
- `laneNear` **114**. And at the door
- `curveLin` **0.62**. How d maps to the screen; things speed up on screen as they come near
- `curveSq` **0.38**. The two must add to 1
- `scaleFar` **0.28**. Px per cm at the far end
- `scaleNear` **0.61**. And at the door. Bram's 198 cm (CAST.md) comes out about 119 px tall on his row
- `bramD` **0.965**. Where he stands
- `reachD` **0.66**. The gold line. A swing hits anything from here down, in his lane
- `contactD` **0.84**. Where a boarder stops to fight him
- `spacing` **0.07**. The gap boarders keep from the one in front
- `btn` **{ x: 282, y: 556, w: 72, h: 76 }**. Grist's button. 72 x 76 logical is 64 x 67 CSS px at the smallest phone (44 px minimum). Kept small because a one-handed thumb rests in this corner
- `lungeSecs` **0.22**. How long the lunge forward looks (looks only)

*No mark and no source in the file, so counted as provisional:*

- `endless` **{ look: 2, speed: 1.0, speedPerWave: 0.05, speedMax: 2.4, beatsStart: 8, beatsPerWave: 1, beatsMax: 30, gapStart: [1.9, 2.5], gapPerWave: 0.08, gapMin: [0.45, 0.75], clearSalvage: 0, mealEvery: 2, volley: ['hook', 'crate'], volleyEvery: 9, volleyEveryDrop: 0.25, volleyEveryMin: 4**. No note in the file.

### `games/hold-the-deck/tuning-boss.js`: 66 play, 0 look or layout, 0 test bot


*The boss (spec: "breaks through the deck in phases; Hekka speaks at the end"). Three phases, a meal between each.*

- `boss.pawHp` **16**. Phase 1, swings on the paws. Three to five paws' worth
- `boss.pawWarn` **0.95**. Planks lift and the lane lights before a paw bursts through. Plus the extra time one lane's walk takes him at his grey (HD.greyWarn), so the bear's warnings are short but never out of reach
- `boss.pawHurt` **2**. Guts if it comes up under him
- `boss.firstPaw` **0.6**. Seconds after the hint before the first one
- `boss.firstTrickle` **0.5**. And before the first boarder
- `boss.quakeEvery` **4**. Every this many paws it shakes the whole deck instead: a volley
- `boss.maxBoarders` **3**. It stops sending them at this many on deck
- `boss.runnerShare` **0.3**. Share of runners in the trickle from phase 2
- `boss.diveSecs` **2.8**. The deck goes quiet before the first meal, long enough for Ione's line
- `boss.toMeal2Secs` **2.8**. And before the second, long enough for Sela's
- `boss.pawUp` **1.6**. Seconds a paw stays up to be hit
- `boss.pawStun` **1.2**. Extra if it broke on Iron
- `boss.pawGap` **[0.3, 0.6]**. Seconds until the next one
- `boss.pawD` **0.74**. Where it comes up
- `boss.pawAimBram` **0.85**. Chance it comes up in the lane he's in
- `boss.trickle2` **[2.0, 2.8]**. Seconds between boarders while it's attacking. Fewer than before the review: the door was doing the bear's job, and a slow thumb never got to the bear
- `boss.trickleIronEase` **1.0**. At full iron the gap between boarders is this much longer (at 50%, half this). The grey still costs, but a slow Bram isn't simply swamped, which is what made high grey a wall
- `boss.pawKillD` **0.55**. A boarder this far down the lane is under a paw when it comes up
- `boss.burstSecs` **2.0**. The bear coming up through the far deck
- `boss.standD` **0.42**. Where it stands, chained, in phase 2. Far enough down that its head clears a two-line talk box on a phone with no spare height (y 86 to 130)
- `boss.swipeWarn` **0.95**. A paw raised and two lanes lit, before the claws rake them. Plus HD.greyWarn
- `boss.swipeAimBram` **0.6**. Chance the first lit lane is the one he's in
- `boss.swipeGap` **[0.2, 0.5]**. Seconds between rakes
- `boss.swipeHurt` **3**. Guts if it catches him
- `boss.rakeAllEvery` **5**. Every this many attacks (rakes, then charges), it rakes all three lanes: a volley
- `boss.firstRake` **0.4**. Seconds after the hint before the first rake
- `boss.nextRake` **1.0**. And after it's got back up
- `boss.temperPerSec` **0.035**. Grist's meter in phases 2 and 3 fills this fast by itself
- `boss.temperIronMul` **1.2**. And at full iron this much faster again (at 50%, half this). He feels it through the bond. A locked Bram can't block for meter, and only Grist can knock the bear down
- `boss.temperHit` **0.05**. Per hit on a paw
- `boss.temperKillMul` **0.5**. Boarders are worth this share of their usual meter here, there are so many of them
- `boss.temperBlock` **0.35**. For a rake stopped with Iron
- `boss.knockReach` **0.14**. How close Grist gets before he hits it
- `boss.coreReach` **0.05**. The same, at an open core in phase 3
- `boss.fallSecs` **0.5**. Its slide down the deck when Grist knocks it over
- `boss.openD` **0.69**. Where it ends up, inside the gold line
- `boss.openSecs` **2.0**. The core is open this long after Grist. About seven swings at most with no iron, so it takes three knocks
- `boss.rearSecs` **1.0**. Its way back up the deck
- `boss.coreP2` **20**. Hits on the core in phase 2
- `boss.coreP3` **26**. Hits on the core in phase 3
- `boss.snapSecs` **2.0**. The chain breaking
- `boss.snapChainAt` **1.0**. When in that it goes
- `boss.snapSlideSecs` **0.8**. Its way back to the far end first
- `boss.chargeWarn` **0.45**. It rears at the far end, the lane lit. The lane stays lit through chargeRun too, so the warning is 0.95 s in all, plus HD.greyWarn
- `boss.afterVolley` **0.7**. Extra seconds after it shakes or rakes everything, before its next attack. Coming off Iron and straight into a charge was the worst place on the bar to be, and it made half grey harder than nearly full
- `boss.chargeGap` **0.2**. Seconds at the far end between charges
- `boss.chargeRun` **0.5**. Seconds it takes to come down the lane
- `boss.chargeHurt` **3**. Guts if it runs Bram over without Iron
- `boss.skidPast` **0.09**. How far past the core's spot it skids
- `boss.openDodged` **0.9**. Core open after it skids past a Bram who moved. Plus the extra time one lane's walk takes him at his grey, so getting there stays possible
- `boss.openHit` **0.9**. After it ran him over
- `boss.openKnocked` **1.8**. After Grist knocked it down in phase 3
- `boss.openGrey` **1.5**. After Grist, it stays open this many of his grey's extra swing-time longer, so a slow Bram gets his swings in. It's what keeps deep grey from being a wall in phase 2
- `boss.openIron` **2.6**. After it ran into Iron
- `boss.gristCore` **3**. Hits Grist does to an open core in phase 3
- `boss.gristPaw` **4**. What Grist does to a paw in his lane, so a charge pressed in phase 1 is never wasted
- `boss.temperPhase2` **1**. His meter when the bear comes up. Only Grist can knock it into reach, so phase 2 never starts on an empty meter, whatever was spent under the planks
- `boss.collapseSecs` **5.2**. The bear going down and Hekka's last words, before the win
- `boss.fallAt` **[0.4, 2.0, 3.6]**. When each of those words comes
- `boss.mercyPerLoss` **2**. Dying on the bear leaves this many more Guts for the next try. Stages 1 to 4 keep tuning.js's one. The batch asks for "a few tries", and one a go left a slow thumb at 3 wins in 20 at best, on its full 8 Guts
- `boss.mercyMax` **6**. Up to this many
- `boss.woundPerLoss` **0.12**. And the bear keeps its wounds: it starts the next try this share weaker, paws and core alike. The BEAR bar starts short by the same, so it shows. The grey is the bond cost and stays; this is what eases instead
- `boss.woundMax` **4**. For up to this many tries lost. The bear never starts under 52%
- `boss.adviceFrom` **2**. Tries lost on it, from half grey (ironLineAt), before Ione says what can be done about the grey
- `boss.scoreHit` **40**. Score for a hit on the bear.
- `boss.say` **{ p1: 3, p2a: 2, p2b: 2.2, bram2: 3, knocked: 2.4, block: 2.6, run: 2, closed: 2, p3: 2.2, bram3: 3, fall: 1.6 }**. How long each of its lines stays up in play

## Split Light

**Try these first** (the ones most likely to change):
- Seconds for each step of Vasch's count: **30** (`bossCount`)
- Boss resets you get: **3** (`bossNerve`)
- Salvage lost per shot over par: **4** (`overParCost`)
- Lowest salvage a level can pay: **1** (`minPay`)
- Chance Glimmick comes: **0.3** (`glimmickChance`)
- Chance Shardle wakes: **0.35** (`shardleChance`)

### `games/split-light/tuning.js`: 70 play, 30 look or layout, 2 test bot


*The shot*

- `beamCells` **17**. Cells a second the beam travels on screen
- `beamMinSecs` **0.3**. Even a short shot lasts this long, so it can be seen
- `beamTailSecs` **0.22**. The beam stays lit this long after it arrives
- `popSecs` **0.5**. A burned core's ring
- `coreFlashSecs` **0.6**. A core that shrugged the beam off flashes this long
- `winceFireSecs` **0.3**. Ione's face as the shot leaves
- `winceGrowSecs` **0.7**. Ione's face when a growth comes up
- `turnSecs` **0.13**. A crystal's turn animation
- `growSecs` **0.4**. A growth's birth animation
- `slideSecs` **0.28**. A core sliding to its next stop. It counts as there from the first moment

*Clocked rails. Each level sets its own stop length (levels.js, clock:). Apart from these, only Vasch's count runs on time, on the boss (bossCount below).*

- `warnSecs` **1.0**. The last second of a stop: ring goes orange, ticks, next-stop arrow flashes. Proven readable in test/fair-timing.js
- `warnTicksPerSec` **4**. How fast it ticks in that second

*Pay. FRIDAY_BATCH.md: "Salvage by fewest shots". Kit README aims for 15 to 40 a stage over 5 stages (about 75 to 200 a story); 16 levels share that here*

- `setPay` **[8, 10, 10, 12]**. Salvage for a clear at par, by set, so a hard board pays more than an easy one. Sums to the same 160 over 16 levels as the flat 10 did
- `overParCost` **4**. Less for each shot over par. Every shot fired on the stage counts, Retry or not. Was 2: firing without thinking only lost a third of the pay (NOTES.md)
- `minPay` **1**. Never less than this for a clear. Was 3
- `replayShare` **0.2**. A stage already cleared pays this share, at least 1, so known boards can't outrun the other games' pay per minute
- `bossPay` **28**. Salvage for beating Vasch
- `bossNervePay` **4**. And this for each point of nerve left
- `scoreCore` **100**. Score for each core burned
- `scoreBounce` **10**. Score for each bounce
- `scorePar` **500**. Bonus for a clear at par
- `scoreOverPar` **150**. Bonus lost per shot over par
- `scoreBoss` **1500**. Bonus for beating Vasch
- `winBeatSecs` **1.1**. The beat on the cleared board before the result

*The boss*

- `bossNerve` **3**. Resets of a boss board before the stage is lost. "boss takes a few tries": FRIDAY_BATCH.md
- `resetConfirmSecs` **2.5**. Reset on a board that still has a way through asks for a second tap within this time, so a slip off FIRE can't cost nerve
- `bossSaySecs` **2.2**. When he corrects a crystal on a hit, the hit's line waits this long so his correction can be read first
- `phaseGapSecs` **1.9**. The pause between boss boards
- `bossEndSecs` **2.2**. The beat after the last hit
- `resetGapSecs` **1.2**. The pause when shots run out on a boss board
- `resetPressSecs` **0.5**. The pause when you press Reset yourself
- `correctShowSecs` **1.6**. How long a crystal he turned stays marked
- `waitTalkSecs` **12**. Seconds of no shot before Vasch remarks on it. Was 26: his count now takes over from there
- `countReadSecs` **15**. Extra seconds on his count for the first shot of an attempt at a board, to read it. Each board's own count: in levels.js
- `countTeachAt` **2**. The count he's at when he explains it, once per attempt
- `countLoudFrom` **7**. From this count on it ticks, and he says so
- `bossCount` **30**. Seconds he takes to count to ten before he fires for you, on all three boards
- `bossIntroAfter` **0.2**. Seconds into the stage before his first line
- `correctTurnTimes` **2**. A crystal he turns back takes this many times as long as your own turn, so it can be seen
- `scarSaySecs` **0.35**. How long after a Retry the "that one came away" line waits, so it follows the Retry line

*Upgrades: per level of each, per board. FRIDAY_BATCH.md: Steady Hand (one undo per level), Shard Scraper (remove one growth), Second Look (show the first bounce)*

- `undoPerLevel` **1**. Undos per board per upgrade level. On a level, a new attempt doesn't hand them back: only a win does. On the boss, per boss board
- `scrapePerLevel` **1**. Growths scraped per board per upgrade level. Same rule as undos
- `lookPerLevel` **1**. Bounces the aim line shows per upgrade level

*The arm (the bond cost on Ione herself)*

- `armOldPerShard` **3**. Shots across the story run for one more old shard on the arm
- `armOldMax` **10**. Old shards the arm can show
- `armNewMax` **7**. Fresh shards from this board the arm can show
- `neckPerShard` **8**. Shots across the story run for one more shard up the neck
- `neckMax` **6**. Shards up the neck beyond the two she starts with (CAST.md base state)

*Pals (FRIDAY_BATCH.md: rare, each with its own condition; the conditions and chances are Claude's calls)*

- `glimmickFromSet` **1**. Glimmick comes from Set 2 on, to anyone who waits
- `glimmickWait` **24**. Seconds with no shot before it can come
- `glimmickChance` **0.3**. Chance, once per attempt
- `glimmickSecs` **22**. How long it takes to crawl across
- `shardleFromSet` **2**. Shardle comes from Set 3 on, to a long shot
- `shardleBounces` **5**. Bounces in one shot that wake it
- `shardleChance` **0.35**. Chance each time
- `shardleSecs` **9**. How long it hops around before it's gone
- `shardleHops` **8**. Hops in that time
- `shardleStops` **[0.2, 0.6]**. Where along the bottom of the board it lands, as shares of the way across
- `shardleHopH` **18**. How high it hops, px
- `palRadius` **32**. How close a tap counts, logical px (over 44 CSS px across on every phone in the test)
- `palTapUp` **14**. How far above a pal's feet its tap circle sits, px
- `glimmickPad` **30**. How far off each side of the screen Glimmick starts and ends, px
- `glimmickBelow` **8**. How far under the board it crawls, px
- `shardleX0` **40**. The left end of Shardle's hops, px
- `shardleX1Pad` **60**. How far from the right edge they end, px
- `shardleBelow` **2**. How far under the board's bottom edge its feet land, px. Along the bottom, where no talk box ever goes (they sit in the strip above the board) and the thumb is near

*Talk*

- `sayShort` **3.2**. Seconds for a small talk line
- `sayLong` **4.6**. Seconds for a longer one
- `growTalkChance` **0.35**. Chance Ione remarks on a growth

*The live "is there still a way?" check*

- `solverLimit` **3000**. Shot results a live check may look at before giving up and calling the board "still fine". Worst case measured in test/levels-test.js

*Looks and layout: they change how it looks or fits, not the rules*

- `cellBase` **54**. Board cell, px. 48 CSS px at 320 x 568
- `cellMax` **63**. The most it may grow: 7 rows of this still leave that one row its 44 px. Good down to about 447 CSS px tall
- `top` **98**. Top of the board. Above it is the strip the talk box uses, so it never covers the board or the read-outs
- `shortEdge` **6**. On a short screen, the gap from the screen's edge to the one row under the board
- `shortIoneW` **108**. Ione's window in that row
- `shortButtonW` **70**. Retry, Undo and Scrape in that row, at most. 49 CSS px wide at 320 x 454. FIRE takes the rest
- `rows` **7**. Tallest board in the levels
- `bossRows` **6**. Tallest boss board, leaving room for Vasch's window beside Ione's
- `hudH` **26**. The shots-and-par row under the board
- `buttonRowH` **57**. The Retry, Undo, Scrape row. 50 CSS px at 320 x 568
- `buttonRowMax` **66**. How tall that row may grow, logical px, before it starts to squeeze FIRE
- `fireX` **120**. FIRE beside Ione's window on levels
- `fireW` **234**. How wide FIRE is on levels, px.
- `bossFireX` **118**. FIRE between the two windows on the boss
- `bossFireW` **124**. How wide FIRE is on the boss, px.
- `fireRowGap` **5**. Gap between FIRE and the row under it
- `panelGap` **3**. Gap between the shots row and the panel under it
- `rowX0` **120**. Left end of the Retry row on levels, beside Ione's window
- `rowX1` **354**. Its right end
- `bossRowX0` **4**. Left end of the Reset row on the boss, under both windows
- `bossRowX1` **356**. Its right end
- `rowGap` **6**. Gap between buttons in that row
- `hintCss` **12**. The level's hint never draws smaller than this many CSS px
- `screenBottom` **636**. Bottom of the lowest button
- `shakeGrow` **[1.5, 0.12]**. A growth comes up
- `shakeNerve` **[5, 0.3]**. A point of nerve lost
- `shakeBossDown` **[8, 0.7]**. The last board falls
- `shakeCore` **3**. A core burned out, px
- `shakeChamber` **6**. A hit on the core in his arm, px
- `shakeHitSecs` **0.2**. How long either lasts

*Test bot only, nothing to confirm:* `botTapGap`, `botFireGap`.

### `games/split-light/levels.js`: 19 rows, every number on them provisional

- `first-light` **3 shots**. Level 1, First Light: shots you get for the whole level. Par 1 is proved by the solver, not provisional.
- `two-turns` **3 shots**. Level 2, Two Turns: shots you get for the whole level. Par 1 is proved by the solver, not provisional.
- `through` **3 shots**. Level 3, Through and Through: shots you get for the whole level. Par 1 is proved by the solver, not provisional.
- `clamps` **3 shots**. Level 4, Clamps: shots you get for the whole level. Par 1 is proved by the solver, not provisional.
- `it-grows` **3 shots**. Level 5, It Grows: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `plant-it` **4 shots**. Level 6, Plant It: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `stones` **4 shots**. Level 7, Stepping Stones: shots you get for the whole level. Par 3 is proved by the solver, not provisional.
- `lane` **4 shots**. Level 8, Mind the Lane: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `split` **3 shots**. Level 9, Split Light: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `both` **3 shots**. Level 10, Both at Once: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `two-seeds` **3 shots**. Level 11, Two Seeds: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `armour` **4 shots**. Level 12, Armour: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `perches` **3 shots**. Level 13, Perches: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `rails` **3 shots**. Level 14, Moving Stock: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `clockwork` **3 shots, 3.2 s a stop**. Level 15, Clockwork: shots you get for the whole level. Par 2 is proved by the solver, not provisional.
- `best-work` **5 shots**. Level 16, Best Work: shots you get for the whole level. Par 3 is proved by the solver, not provisional.
- `demonstration` **4 shots**. Boss board 1: shots per attempt at this board. Par 3 is proved by the solver.
- `metronome` **3 shots, 2.6 s a stop**. Boss board 2: shots per attempt at this board. Par 2 is proved by the solver.
- `the-arm` **4 shots, 3 s a stop**. Boss board 3: shots per attempt at this board. Par 3 is proved by the solver.

## Shared by every game

### `shared/config.js`

- `gateTapGuardMs` **500**. Taps ignored for this long after a gate screen changes (double-tap guard
- `monsterBookSlots` **12**. Dylan's card answer 2026-11-05: "12 slots"); matches the 12 pals in shared/pals.js
- `upgradePrices` **[20, 45, 80]**. Claude's call, Friday batch): cost of levels 1, 2, 3; a stage clear pays about 15 to 40 salvage

### `shared/stories.js`: when each story card opens

- `logbook-1` **0 salvage**. Lifetime salvage that opens the card "First line of the logbook".
- `pup` **25 salvage**. Lifetime salvage that opens the card "How to make a pup blush".
- `house-rules` **60 salvage**. Lifetime salvage that opens the card "Galley rules".
- `odds` **100 salvage**. Lifetime salvage that opens the card "Juno gives you the odds".
- `scars` **150 salvage**. Lifetime salvage that opens the card "Hand to elbow".
- `field-notes` **220 salvage**. Lifetime salvage that opens the card "Field notes: on bonding".
- `cargo` **300 salvage**. Lifetime salvage that opens the card "Things I have smuggled".
- `missing-line` **400 salvage**. Lifetime salvage that opens the card "A page in my own hand".
- `order` **550 salvage**. Lifetime salvage that opens the card "Sever standing order 12".
- `bear` **700 salvage**. Lifetime salvage that opens the card "What Hekka did".
- `mercy` **900 salvage**. Lifetime salvage that opens the card "A letter to Dr. Raske".
- `map` **1200 salvage**. Lifetime salvage that opens the card "The map that stays right".

### `shared/kit/input.js`

- `TAP_SECONDS` **0.28**. A press shorter than this is a tap
- `TAP_MOVE` **14**. Logical px a tap may wander
- `DOUBLE_SECONDS` **0.32**. Gap allowed between the taps of a double tap
- `DOUBLE_MOVE` **48**. Logical px between those two taps

### `shared/kit/talk.js`

- `TAP_GUARD_MS` **450**. The gate uses 500

### `shared/kit/game.js`

- `END_DELAY` **0.7**. Seconds the last moment of a stage stays on screen

### `shared/kit/audio.js`

- `MUSIC_LEVEL` **0.24**. How loud the music is, 0 to 1.

### `shared/kit/core.js`

- `PHONE_SHORT_SIDE` **600**. The short side (CSS px) below which a device counts as a phone

### `shared/kit/art.js`

- `MAX_PARTS` **220**. Keeps weak phones steady

## How this list was counted

One line in a file is one row, even when that line holds several numbers (a stage's row holds many). Every result from the last run of the script:

```
ok   games/storm-run/tuning.js: 110 lines with the word = 108 numbers + 2 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 4. Left out, test bot with no mark: 0.
ok   games/tide-gap/tuning.js: 167 lines with the word = 166 numbers + 1 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 1. Left out, test bot with no mark: 0.
ok   games/tide-gap/tuning-stages.js: 71 lines with the word = 65 numbers + 6 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 0. Left out, test bot with no mark: 0.
ok   games/hot-hand/tuning.js: 157 lines with the word = 155 numbers + 2 heading lines. Also listed: 2 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 4. Left out, test bot with no mark: 0.
ok   games/hot-hand/tuning-stages.js: 73 lines with the word = 71 numbers + 2 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 0. Left out, test bot with no mark: 0.
ok   games/silent-cut/tuning.js: 131 lines with the word = 128 numbers + 3 heading lines. Also listed: 25 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 2. Left out, test bot with no mark: 0.
note games/silent-cut/tuning-stages.js: the file says every number is provisional in its heading, so 22 rows are summed up here, not one per line.
ok   games/hold-the-deck/tuning.js: 131 lines with the word = 130 numbers + 1 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 11 rows inside a marked stage, 1 with no mark at all. Left out, with a source or a note and no mark: 3. Left out, test bot with no mark: 0.
ok   games/hold-the-deck/tuning-boss.js: 67 lines with the word = 66 numbers + 1 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 0. Left out, test bot with no mark: 0.
ok   games/split-light/tuning.js: 103 lines with the word = 102 numbers + 1 heading lines. Also listed: 0 under an "all PROVISIONAL" heading, 0 rows inside a marked stage, 0 with no mark at all. Left out, with a source or a note and no mark: 4. Left out, test bot with no mark: 0.
note games/split-light/levels.js: the file says every number is provisional in its heading, so 19 rows are summed up here, not one per line.
note shared: 24 rows (config 3, story cards 12, kit 9).
left out on purpose: PROVISIONAL marks in test scripts (games/hold-the-deck/test/fairness.js, games/hot-hand/tools/fairness.js). They are pass marks for the tests, not numbers anyone plays.
```
