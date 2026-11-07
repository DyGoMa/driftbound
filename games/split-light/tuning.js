// Split Light numbers. Every number the game plays by lives here or in levels.js, each marked PROVISIONAL or with its source. Pixel sizes that only shape a drawing stay with that drawing.
// Answers are in docs/DECISIONS.md ("Friday batch") and docs/FRIDAY_BATCH.md ("Split Light"). Dylan's thumb has not tried any of these yet.
window.TUNE = {
  // ---- Screen layout (logical 360 x 640, the kit's upright size)
  cellBase: 54,         // PROVISIONAL: board cell, px. 48 CSS px at 320 x 568
  cellCss: 44,          // the 44 px tap rule (FRIDAY_BATCH.md: big targets): the canvas scale follows the visible height, so on a short screen (320 x 454, browser bars showing) the cell grows to keep this many CSS px, and what's under the board goes into one row (SL.shortRow in control.js)
  cellMax: 63,          // PROVISIONAL: the most it may grow: 7 rows of this still leave that one row its 44 px. Good down to about 447 CSS px tall
  get cell() { return Math.min(this.cellMax, Math.max(this.cellBase, Math.ceil(this.cellCss / Kit.view.scale - 1e-6))); },   // whole px, read live: a phone's browser bars can come and go in play
  top: 98,              // PROVISIONAL: top of the board. Above it is the strip the talk box uses, so it never covers the board or the read-outs
  shortEdge: 6,         // PROVISIONAL: on a short screen, the gap from the screen's edge to the one row under the board
  shortIoneW: 108,      // PROVISIONAL: Ione's window in that row
  shortButtonW: 70,     // PROVISIONAL: Retry, Undo and Scrape in that row, at most. 49 CSS px wide at 320 x 454. FIRE takes the rest
  rows: 7,              // PROVISIONAL: tallest board in the levels
  bossRows: 6,          // PROVISIONAL: tallest boss board, leaving room for Vasch's window beside Ione's
  hudH: 26,             // PROVISIONAL: the shots-and-par row under the board
  buttonRowH: 57,       // PROVISIONAL: the Retry, Undo, Scrape row. 50 CSS px at 320 x 568
  buttonRowCss: 44,     // the 44 px tap rule: on short screens the row grows to keep this many CSS px
  buttonRowMax: 66,     // PROVISIONAL: how tall that row may grow, logical px, before it starts to squeeze FIRE
  fireX: 120,           // PROVISIONAL: FIRE beside Ione's window on levels
  fireW: 234,           // PROVISIONAL
  bossFireX: 118,       // PROVISIONAL: FIRE between the two windows on the boss
  bossFireW: 124,       // PROVISIONAL
  fireRowGap: 5,        // PROVISIONAL: gap between FIRE and the row under it
  panelGap: 3,          // PROVISIONAL: gap between the shots row and the panel under it
  rowX0: 120,           // PROVISIONAL: left end of the Retry row on levels, beside Ione's window
  rowX1: 354,           // PROVISIONAL: its right end
  bossRowX0: 4,         // PROVISIONAL: left end of the Reset row on the boss, under both windows
  bossRowX1: 356,       // PROVISIONAL: its right end
  rowGap: 6,            // PROVISIONAL: gap between buttons in that row
  hintCss: 12,          // PROVISIONAL: the level's hint never draws smaller than this many CSS px
  screenBottom: 636,    // PROVISIONAL: bottom of the lowest button

  // ---- The shot
  beamCells: 17,        // PROVISIONAL: cells a second the beam travels on screen
  beamMinSecs: 0.3,     // PROVISIONAL: even a short shot lasts this long, so it can be seen
  beamTailSecs: 0.22,   // PROVISIONAL: the beam stays lit this long after it arrives
  popSecs: 0.5,         // PROVISIONAL: a burned core's ring
  coreFlashSecs: 0.6,   // PROVISIONAL: a core that shrugged the beam off flashes this long
  winceFireSecs: 0.3,   // PROVISIONAL: Ione's face as the shot leaves
  winceGrowSecs: 0.7,   // PROVISIONAL: Ione's face when a growth comes up
  turnSecs: 0.13,       // PROVISIONAL: a crystal's turn animation
  growSecs: 0.4,        // PROVISIONAL: a growth's birth animation
  slideSecs: 0.28,      // PROVISIONAL: a core sliding to its next stop. It counts as there from the first moment

  // ---- Clocked rails. Each level sets its own stop length (levels.js, clock:). Apart from these, only Vasch's count runs on time, on the boss (bossCount below).
  warnSecs: 1.0,        // PROVISIONAL: the last second of a stop: ring goes orange, ticks, next-stop arrow flashes. Proven readable in test/fair-timing.js
  warnTicksPerSec: 4,   // PROVISIONAL: how fast it ticks in that second

  // ---- Pay. FRIDAY_BATCH.md: "Salvage by fewest shots". Kit README aims for 15 to 40 a stage over 5 stages (about 75 to 200 a story); 16 levels share that here
  setPay: [8, 10, 10, 12], // PROVISIONAL: salvage for a clear at par, by set, so a hard board pays more than an easy one. Sums to the same 160 over 16 levels as the flat 10 did
  overParCost: 4,       // PROVISIONAL: less for each shot over par. Every shot fired on the stage counts, Retry or not. Was 2: firing without thinking only lost a third of the pay (NOTES.md)
  minPay: 1,            // PROVISIONAL: never less than this for a clear. Was 3
  replayShare: 0.2,     // PROVISIONAL: a stage already cleared pays this share, at least 1, so known boards can't outrun the other games' pay per minute
  bossPay: 28,          // PROVISIONAL: salvage for beating Vasch
  bossNervePay: 4,      // PROVISIONAL: and this for each point of nerve left
  scoreCore: 100,       // PROVISIONAL: score for each core burned
  scoreBounce: 10,      // PROVISIONAL: score for each bounce
  scorePar: 500,        // PROVISIONAL: bonus for a clear at par
  scoreOverPar: 150,    // PROVISIONAL: bonus lost per shot over par
  scoreBoss: 1500,      // PROVISIONAL: bonus for beating Vasch

  winBeatSecs: 1.1,     // PROVISIONAL: the beat on the cleared board before the result

  // ---- The boss
  bossNerve: 3,         // PROVISIONAL: resets of a boss board before the stage is lost. "boss takes a few tries": FRIDAY_BATCH.md
  resetConfirmSecs: 2.5,// PROVISIONAL: Reset on a board that still has a way through asks for a second tap within this time, so a slip off FIRE can't cost nerve
  bossSaySecs: 2.2,     // PROVISIONAL: when he corrects a crystal on a hit, the hit's line waits this long so his correction can be read first
  phaseGapSecs: 1.9,    // PROVISIONAL: the pause between boss boards
  bossEndSecs: 2.2,     // PROVISIONAL: the beat after the last hit
  resetGapSecs: 1.2,    // PROVISIONAL: the pause when shots run out on a boss board
  resetPressSecs: 0.5,  // PROVISIONAL: the pause when you press Reset yourself
  correctShowSecs: 1.6, // PROVISIONAL: how long a crystal he turned stays marked
  waitTalkSecs: 12,     // PROVISIONAL: seconds of no shot before Vasch remarks on it. Was 26: his count now takes over from there
  countReadSecs: 15,    // PROVISIONAL: extra seconds on his count for the first shot of an attempt at a board, to read it. Each board's own count: in levels.js
  countTo: 10,          // shared/stories.js: "a full count of ten". At this he fires for you; on a dead board he resets it, for a point of nerve, so a boss nobody plays is lost
  countTeachAt: 2,      // PROVISIONAL: the count he's at when he explains it, once per attempt
  countLoudFrom: 7,     // PROVISIONAL: from this count on it ticks, and he says so
  bossCount: 30,        // PROVISIONAL: seconds he takes to count to ten before he fires for you, on all three boards
  bossIntroAfter: 0.2,  // PROVISIONAL: seconds into the stage before his first line
  correctTurnTimes: 2,  // PROVISIONAL: a crystal he turns back takes this many times as long as your own turn, so it can be seen
  scarSaySecs: 0.35,    // PROVISIONAL: how long after a Retry the "that one came away" line waits, so it follows the Retry line

  // ---- Upgrades: per level of each, per board. FRIDAY_BATCH.md: Steady Hand (one undo per level), Shard Scraper (remove one growth), Second Look (show the first bounce)
  undoPerLevel: 1,      // PROVISIONAL: undos per board per upgrade level. On a level, a new attempt doesn't hand them back: only a win does. On the boss, per boss board
  scrapePerLevel: 1,    // PROVISIONAL: growths scraped per board per upgrade level. Same rule as undos
  lookPerLevel: 1,      // PROVISIONAL: bounces the aim line shows per upgrade level

  // ---- The arm (the bond cost on Ione herself)
  armOldPerShard: 3,    // PROVISIONAL: shots across the story run for one more old shard on the arm
  armOldMax: 10,        // PROVISIONAL: old shards the arm can show
  armNewMax: 7,         // PROVISIONAL: fresh shards from this board the arm can show
  neckPerShard: 8,      // PROVISIONAL: shots across the story run for one more shard up the neck
  neckMax: 6,           // PROVISIONAL: shards up the neck beyond the two she starts with (CAST.md base state)

  // ---- Shakes: [how far, px; how long, seconds]
  shakeGrow: [1.5, 0.12], // PROVISIONAL: a growth comes up
  shakeNerve: [5, 0.3],   // PROVISIONAL: a point of nerve lost
  shakeBossDown: [8, 0.7],// PROVISIONAL: the last board falls
  shakeCore: 3,           // PROVISIONAL: a core burned out, px
  shakeChamber: 6,        // PROVISIONAL: a hit on the core in his arm, px
  shakeHitSecs: 0.2,      // PROVISIONAL: how long either lasts

  // ---- Pals (FRIDAY_BATCH.md: rare, each with its own condition; the conditions and chances are Claude's calls)
  glimmickFromSet: 1,   // PROVISIONAL: Glimmick comes from Set 2 on, to anyone who waits
  glimmickWait: 24,     // PROVISIONAL: seconds with no shot before it can come
  glimmickChance: 0.3,  // PROVISIONAL: chance, once per attempt
  glimmickSecs: 22,     // PROVISIONAL: how long it takes to crawl across
  shardleFromSet: 2,    // PROVISIONAL: Shardle comes from Set 3 on, to a long shot
  shardleBounces: 5,    // PROVISIONAL: bounces in one shot that wake it
  shardleChance: 0.35,  // PROVISIONAL: chance each time
  shardleSecs: 9,       // PROVISIONAL: how long it hops around before it's gone
  shardleHops: 8,       // PROVISIONAL: hops in that time
  shardleStops: [0.2, 0.6], // PROVISIONAL: where along the bottom of the board it lands, as shares of the way across
  shardleHopH: 18,      // PROVISIONAL: how high it hops, px
  palRadius: 32,        // PROVISIONAL: how close a tap counts, logical px (over 44 CSS px across on every phone in the test)
  palTapUp: 14,         // PROVISIONAL: how far above a pal's feet its tap circle sits, px
  glimmickPad: 30,      // PROVISIONAL: how far off each side of the screen Glimmick starts and ends, px
  glimmickBelow: 8,     // PROVISIONAL: how far under the board it crawls, px
  shardleX0: 40,        // PROVISIONAL: the left end of Shardle's hops, px
  shardleX1Pad: 60,     // PROVISIONAL: how far from the right edge they end, px
  shardleBelow: 2,      // PROVISIONAL: how far under the board's bottom edge its feet land, px. Along the bottom, where no talk box ever goes (they sit in the strip above the board) and the thumb is near
  botPals: false,       // test only: the pal test turns this on

  // ---- Talk
  sayShort: 3.2,        // PROVISIONAL: seconds for a small talk line
  sayLong: 4.6,         // PROVISIONAL: seconds for a longer one
  growTalkChance: 0.35, // PROVISIONAL: chance Ione remarks on a growth

  // ---- The live "is there still a way?" check
  solverLimit: 3000,    // PROVISIONAL: shot results a live check may look at before giving up and calling the board "still fine". Worst case measured in test/levels-test.js

  // ---- The test bot
  botTapGap: 0.14,      // PROVISIONAL: seconds between the bot's taps. About 7 taps a second: quick, not superhuman
  botFireGap: 0.2,      // PROVISIONAL: seconds it waits after its last turn before firing
};
