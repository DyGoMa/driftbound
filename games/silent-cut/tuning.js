// Silent Cut numbers. Every rule number and talk timing lives here, each marked PROVISIONAL or with its source. Stage layouts are in tuning-stages.js. Left in the drawing files, as looks only: where things are drawn on screen, sparks and shakes.
// Spec: docs/FRIDAY_BATCH.md, "Silent Cut". Dylan's thumb has not tried any of these yet.
window.TUNE = {
  // ---- Screen layout (logical 640 x 360, the kit's sideways size)
  pxPerCm: 0.46,        // PROVISIONAL: Silas's 183 cm (CAST.md) comes out about 84 px tall
  groundY: 268,         // PROVISIONAL: feet line. High enough that the talk box on the smallest phone (top edge at logical y 292) clears the walkway and the marks under it (to feet + 24)
  hudY: 288,            // PROVISIONAL: looks only. The band the breath panel and the alarms sit in, counted from here
  startX: 30,           // PROVISIONAL: where Silas starts each stage, px along the street
  camX: 190,            // PROVISIONAL: where Silas stands on screen, so at least 450 px of what's coming shows

  // ---- Moving (spec: "Hold to creep forward, let go to freeze")
  creep: 92,            // PROVISIONAL: px per second
  creepDelay: 0.14,     // PROVISIONAL: seconds a press must last before he moves, so a tap can't walk him out of hiding
  tapMax: 0.18,         // PROVISIONAL: a press up to this long is a quick tap: two of them within doubleGap are a Surge
  tapKit: 0.28,         // Source: TAP_SECONDS in shared/kit/input.js. Any press under this, with the thumb hardly moving, is a tap: it acts on whatever has the TAP ring, and with no ring it was just a short creep
  tapSlowGap: 0.16,     // PROVISIONAL: when either press ran longer than tapMax, the second must follow this fast to Surge. A slow thumb's double tap has a short gap (real presses of 250, 100, 250 ms). Hold, let go, hold in a crate's shade has a longer one, so it doesn't spend breath
  doubleGap: 0.36,      // PROVISIONAL: seconds from letting go of the first quick tap to pressing the second. Measured gap only, so how long the press lasts doesn't eat into it
  doubleLate: 0.8,      // PROVISIONAL: looks only. A second tap this soon that was too slow gets a "QUICKER", so a missed Surge isn't silence
  halfW: 8,             // PROVISIONAL: half his width, for light and contact
  hideDelay: 0.12,      // PROVISIONAL: seconds of stillness before cover counts as hiding
  coverSlop: 10,        // PROVISIONAL: px past a cover's edge that still counts as behind it
  grabRadius: 26,       // PROVISIONAL: reach for salvage
  downDrop: 11,         // PROVISIONAL: px to lower the kit's lying-down figure so it rests on the walkway, looks only

  // ---- Being seen (spec: "being lit for too long raises an alarm, and three alarms fail the stage")
  maxAlarms: 3,         // Spec
  fillMovingSecs: 1.2,  // PROVISIONAL: seconds of light to an alarm while moving, before the stage's alert factor
  fillFrozenSecs: 2.6,  // PROVISIONAL: and while frozen in the open. Freezing buys time; it doesn't hide you
  drainSecs: 1.8,       // PROVISIONAL: seconds in the dark for a full meter to empty
  lampFactor: 1.4,      // PROVISIONAL: a trooper's or Maro's own lamp fills the meter this much faster
  graceSecs: 2,         // PROVISIONAL: seconds after an alarm in which the meter can't fill, time to run for it
  knockback: 46,        // PROVISIONAL: px he's shoved back when a trooper bumps into him
  hurtSecs: 0.35,       // PROVISIONAL: seconds he stumbles after that
  closeGap: 16,         // PROVISIONAL: px from a searchlight's edge that counts as a close call
  closeEvery: 1.6,      // PROVISIONAL: seconds between close calls

  // ---- The Surge and the bond cost (spec: "a silent wind dash through light, which uses breath")
  surgeDist: 165,       // PROVISIONAL: px per dash
  surgeSecs: 0.2,       // PROVISIONAL: length of the dash; no light can fill the meter during it, and it goes through a trooper
  surgeAfter: 0.25,     // PROVISIONAL: seconds of cover after landing
  surgeCost: 1 / 3,     // PROVISIONAL: three Surges from a full chest
  breathRegen: 0.035,   // PROVISIONAL: breath per second, frozen only (spec: "returns slowly when frozen"). About 9.5 s for one Surge, so a stage's gates cost more than its waits give back
  regenDelay: 0.25,     // PROVISIONAL: seconds of stillness before breath starts to come back
  windedSpeed: 0.6,     // PROVISIONAL: out of breath he moves at this share of creep (spec: "moves slower"). 55 px/s, so he can't keep up with a crane's 72
  raspyBelow: 0.5,      // PROVISIONAL: under this share of his chest, Silas's lines start breaking up
  raspFrom: 2,          // PROVISIONAL: which time out of breath in one attempt at a stage starts to scar his voice for the story run. The first of a stage he gets over; a wide gate on a scarred chest forces that one, so only the next is the player's doing
  raspLoss: 0.1,        // PROVISIONAL: breath lost from the top of his chest with each scar. Lasts the story run (run.carry). At the worst (raspMax) that leaves 0.7, still two Surges, so a wide gate can always be crossed after a long wait
  raspRegenLoss: 0.12,  // PROVISIONAL: share of breath's return lost with each scar. A silence lasts about 9.7, 11, 12.7, 15 s at rasp 0 to 3, so the cost keeps growing after the Surges have stopped falling
  raspMax: 3,           // PROVISIONAL: the most scars there are. It's the floor, so the run stays winnable. He still talks at it, in rags (words.js); only being out of breath blanks him (spec)
  voiceKeep: 0.7,       // PROVISIONAL: share of a line left when his voice starts to break up
  voiceKeepWorse: 0.4,  // PROVISIONAL: and when it's worse: rasp 2, or breath under half of raspyBelow
  voiceKeepWorst: 0.25, // PROVISIONAL: and at raspMax, for lines in play. Scene lines are written out by hand in words.js
  raspyWorse: 0.5,      // PROVISIONAL: that "half"

  // ---- The chain-blade (spec: "Tap when close behind a trooper to strike")
  reach: 66,            // PROVISIONAL: px, for a strike and for cutting a lantern
  strikeSecs: 0.3,      // PROVISIONAL: how long he stands still to throw the chain
  strikeCalm: 0.56,     // PROVISIONAL: seconds after a strike or a cut on Maro in which a tap can't start or finish a Surge. Just over doubleGap + tapMax, the latest a double tap's second tap can lift. Also how long a tap on the dizzy moth waits before it's a catch, for the same reason
  cutSecs: 0.18,        // PROVISIONAL: and to cut a lantern
  chainWindup: 0.2,     // PROVISIONAL: looks only. Share of a strike with the knife wound up behind his hand
  chainFly: 0.25,       // PROVISIONAL: looks only. Share of a strike or cut the knife takes to reach its target
  cutNoise: 170,        // PROVISIONAL: troopers this close hear a lantern fall

  // ---- Troopers
  contact: 14,          // PROVISIONAL: px, walking into one raises the alarm
  waitSecs: 1.5,        // PROVISIONAL: he stops this long at the end of his beat before turning
  tellSecs: 1.0,        // PROVISIONAL: the turn warning, the last part of that wait: "!" with a ring that closes (checked by fairness.js)
  hearSecs: 0.45,       // PROVISIONAL: "?" before he turns to a sound
  goSpeed: 60,          // PROVISIONAL: walking to a sound
  huntSpeed: 104,       // PROVISIONAL: running to where he last saw you, after an alarm
  huntRange: 420,       // PROVISIONAL: troopers this close join the hunt
  lookSecs: 1.5,        // PROVISIONAL: how long he stands and looks, before turning back with the same warning
  lampLen: 95,          // PROVISIONAL: length of his lamp's pool, px ahead of him

  // ---- Noise
  stepSecs: 0.42,       // PROVISIONAL: seconds between footsteps
  creakR: 130,          // PROVISIONAL: px a creaking board carries

  // ---- The lamp line behind you: why waiting isn't safe, and why doing nothing loses
  lineLead: 780,        // PROVISIONAL: it never falls further than this behind him
  lineJump: 110,        // PROVISIONAL: px it gains on every alarm
  lineFillSecs: 0.8,    // PROVISIONAL: seconds to an alarm once it reaches him; cover doesn't help against a whole line of lamps
  lineShowAt: 460,      // PROVISIONAL: looks only. px away that "LAMP LINE n m" shows
  lineUrgentAt: 220,    // PROVISIONAL: looks only. px away that it flashes
  lineWarnAt: 300,      // PROVISIONAL: px away that the horn and the warning line play, once
  lineWarnReset: 420,   // PROVISIONAL: px he has to get away for that warning to play again

  // ---- Upgrades
  lungMax: 1 / 3,       // PROVISIONAL: Deep Lungs, extra chest per level: one whole Surge, so every level you pay for puts a new feather on the panel
  lungRegen: 0.15,      // PROVISIONAL: Deep Lungs, faster breath per level
  chainPerLevel: 22,    // PROVISIONAL: Longer Chain, extra reach per level
  bootCreep: 7,         // PROVISIONAL: Softer Boots, extra creep speed per level, px per second
  bootCreak: 30,        // PROVISIONAL: Softer Boots, less carry on a creaking board per level
  bootFill: 0.07,       // PROVISIONAL: Softer Boots, share slower that light fills the meter while moving, per level

  // ---- Salvage and score. Kit aim: a stage clear pays about 15 to 40 in all
  coinValue: 1,         // PROVISIONAL
  strikeSalvage: 1,     // PROVISIONAL: a trooper's pockets
  ghostSalvage: 6,      // PROVISIONAL: extra for a stage with no alarm
  scorePerPx: 0.1,      // PROVISIONAL
  scoreStrike: 60,      // PROVISIONAL
  scoreCut: 15,         // PROVISIONAL
  scoreClose: 20,       // PROVISIONAL
  scoreCoin: 5,         // PROVISIONAL
  scoreClear: 250,      // PROVISIONAL
  scoreGhost: 300,      // PROVISIONAL
  scoreTimePerSec: 6,   // PROVISIONAL: for every second under the stage's par, so being quick pays
  scoreMaroHit: 400,    // PROVISIONAL
  scoreStreak: 40,      // PROVISIONAL: extra per trooper when strikes come in a row
  streakSecs: 5,        // PROVISIONAL: seconds a strike keeps a streak going

  // ---- Pals. Each takes something done on purpose, so they stay rare
  tuftleFromStage: 1,   // PROVISIONAL: index, 1 = stage 2
  tuftleStill: 18,      // PROVISIONAL: seconds frozen in cover, with no alarm so far this stage, before the eyes may open. Longer than waiting for one Surge or two, so it's a choice to sit on, not something that happens while getting breath back
  tuftleChance: 1,   // Dylan 2026-11-07 "Always when you do it" (was 0.25): chance when that happens; once per cover
  tuftleStay: 2.4,      // PROVISIONAL: stay frozen this much longer and it climbs on
  lamplickFromStage: 1, // PROVISIONAL: index, 1 = stage 2
  lamplickChance: 1, // Dylan 2026-11-07 "Always when you do it" (was 0.15): chance one lantern per attempt has the moth on it
  lamplickSecs: 5,      // PROVISIONAL: cut that lantern, then tap the dizzy moth within this many seconds. It gets a TAP ring while it's in the chain's reach
  mothOffStart: 700,    // PROVISIONAL: its lantern is at least this far from where he starts, so it's off screen during the talk scene, even on a wide phone (the street shows to about 590 px)
  tuftleEyesBack: 22,   // PROVISIONAL: looks only. px behind him the eyes open
  mothHear: 340,        // PROVISIONAL: px ahead of him the moth's lantern starts to chirp and gets its line. It stops once he can't reach the lantern any more
  mothDrift: 150,       // PROVISIONAL: px per second a dizzy moth wobbles after him if he cut its lantern from past it, since he can't walk back. Faster than the quickest creep (113, with Softer Boots), so it always gets to him inside lamplickSecs
  mothStartAlt: 90,     // PROVISIONAL: px up it falls from when its lantern's cut
  mothRestAlt: 16,      // PROVISIONAL: px up it settles at, in reach
  mothFall: 40,         // PROVISIONAL: px per second it sinks
  mothChirps: 3,        // PROVISIONAL: chirps per second while it's in earshot

  // ---- Ledger Maro (spec: "strike when his back is turned, and dodge his sweeping lamp and guards"). Lists run by hits so far: first, second, third round
  maroHits: 3,          // PROVISIONAL: three cuts
  maroBlock: 22,        // PROVISIONAL: Silas can't walk through him
  maroReachLess: 0,     // PROVISIONAL: how much closer the chain has to be for Maro than for a trooper. Was 14. 0: the same reach as anyone
  maroPool: 44,         // PROVISIONAL: half width of the lamplight he stands in while reading; it's ordinary light. Was 74. With no upgrades the TAP ring shows 14 px (0.15 s of walking) before his light can touch Silas, and a lift up to about 0.7 s after the ring still cuts first (checked by fairness.js)
  maroBack: [4.2, 3.6, 3.2],    // PROVISIONAL: seconds his back stays turned, last part of it the warning
  maroVary: [1, 0.85, 1.2, 0.9, 1.1],   // PROVISIONAL: and each turn differs by these, so he can't be counted; the warning stays the same length
  maroTell: 1.1,        // PROVISIONAL: the warning that he's about to turn: ledger shuts, "!" with a closing ring (checked by fairness.js)
  maroLampSecs: 0.6,    // PROVISIONAL: seconds of his lamp to an alarm, before the stage's alert factor, frozen or not. Short enough that one pass finds a man frozen in the open: only cover beats it
  maroFace: [3.0, 3.4, 3.8],    // PROVISIONAL: seconds he faces you, his lamp sweeping out and back once
  maroLampNear: 50,     // PROVISIONAL: the sweep starts this far in front of him
  maroLampFar: [380, 430, 480], // PROVISIONAL: and reaches this far
  maroLampR: [66, 72, 80],      // PROVISIONAL: half width of the pool
  maroHitSecs: 0.8,     // PROVISIONAL: he reels
  maroRun: 210,         // PROVISIONAL: px per second, running to his next desk
  maroFallSecs: 3,      // PROVISIONAL: the last moment before the win, long enough for Silas's broken line and Maro's last one
  bossWinBeat: 0.6,     // PROVISIONAL: seconds the boss's last moment stays up after the win, before the result
  maroCoins: 3,         // PROVISIONAL: salvage he drops per cut. The first two cuts drop it on the way to his next desk; the last cut banks it, since the stage is over
  maroCoinAhead: 40,    // PROVISIONAL: px past him the first coin lands, where Silas is walking next
  maroCoinGap: 26,      // PROVISIONAL: px between coins

  hideLiftArt: 20,      // PROVISIONAL: looks only. px the hiding picture, or the code figure if the picture's missing, is raised behind cover, so his head shows over crates up to 68 px high
  hushSpeed: 260,       // PROVISIONAL: looks only. px per second Hush flies to the next safe place
  sceneInk: 0.55,       // PROVISIONAL: looks only. Ink on code-drawn props and streets, as a share of the kit's, so they sit nearer the pictures' fine lines. 1 puts the old heavy lines back. For Dylan's eye
  floatClear: 42,       // PROVISIONAL: looks only. px beside him that "creak" and "+1" float, so they don't cover him
  pagesSecs: 1.4,       // PROVISIONAL: looks only. How long the ledger's pages fly after a cut
  tickSlow: 0.28,       // PROVISIONAL: sound only. Seconds between meter ticks when it starts to fill
  tickFast: 0.2,        // PROVISIONAL: sound only. How much quicker they get by the time it's full

  // ---- How often someone speaks. A chance, 0 to 1, each time it could happen
  quips: { close: 0.2, cut: 0.4, strike: 0.55, surge: 0.25, breathBack: 1, alarmSilas: 0.5, maroTurn: 0.5 },   // PROVISIONAL

  // ---- How long words stay up, in seconds. All PROVISIONAL
  talk: {
    say: 2.8, quip: 2.4, radio: 3, moth: 3, alarm: 2.4, lineWarn: 3.4,
    tipSecs: 5.5,        // a tip stays up this long
    tipNext: 3,          // and the next one may take over when this much is left
    curse: 1.6,          // "Oh, for f"
    crewAfter: 1.7,      // then the crew's line this long after his breath goes
    crew: 3.2,           // and it stays this long
    tuftle: 2.4, maroStart: 3.4, maroGreetAt: 0.8, maroTurn: 2.4,
    maroCut: 1.8,        // Silas's line on a cut
    maroAfter: 1.9,      // Maro answers this long after a cut
    maroCutLast: 1,      // the third cut's line is cut off short
    maroAfterLast: 1.1,  // so Maro's last line comes in soon enough to be read before maroFallSecs ends
    maroLine: 2.8,
  },

  // ---- Test bot only. None of it is a rule of the game, and all of it is PROVISIONAL
  botLook: 7,           // seconds the bot plays forward when it decides
  botSafe: 0.72,        // the fullest the meter may get in a plan it trusts
  botGateWalk: 30,      // px of flood left that it walks out of, where another Surge would be wasted
  botStep: 1 / 30,      // seconds per step of its look-ahead
  botThink: 6,          // real steps between decisions
  botLead: 0.25,        // seconds ahead it judges a floodlit stretch
  botArrive: 1.4,       // seconds it keeps looking after a planned hop arrives, in case the place turns bad
  botStay: 2.5,         // seconds it plays forward to judge waiting where it is
  botWaitSome: 9,       // seconds of waiting before it accepts a tighter window
  botWaitLong: 16,      // and before it will Surge to get moving
  botNearMaro: 80,      // px from Maro's reach at which it stops making for cover first
  botMaroClose: 8,      // px inside the chain's reach it stands to cut him
  botLanternBack: 10,   // px behind him that a lantern is still worth cutting
};
