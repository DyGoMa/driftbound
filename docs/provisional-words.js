// Words for docs/make-provisional.js: which numbers to try first, and plain words for numbers with no note beside them in their file.
const GAMES = [
  { id: 'storm-run', title: 'Storm Run', files: ['games/storm-run/tuning.js'] },
  { id: 'tide-gap', title: 'Tide Gap', files: ['games/tide-gap/tuning.js', 'games/tide-gap/tuning-stages.js'] },
  { id: 'hot-hand', title: 'Hot Hand', files: ['games/hot-hand/tuning.js', 'games/hot-hand/tuning-stages.js'] },
  { id: 'silent-cut', title: 'Silent Cut', files: ['games/silent-cut/tuning.js'], extra: ['silent'] },
  { id: 'hold-the-deck', title: 'Hold the Deck', files: ['games/hold-the-deck/tuning.js', 'games/hold-the-deck/tuning-boss.js'] },
  { id: 'split-light', title: 'Split Light', files: ['games/split-light/tuning.js'], extra: ['split'] },
];

// Plain sentence, then the number's name. The script stops if a name no longer exists, and fills in today's value.
const FIRST = {
  'storm-run': [
    ['How high a held jump goes', 'jumpSpeed'], ['How short a quick tap\'s hop is', 'hopCut'], ['How much one Surge climbs the arm (1 is numb)', 'scarPerSurge'],
    ['How slowly the scars fade', 'scarFade'], ['Hits you can take', 'hits'], ['Warning before the hound springs', 'jumpCueSecs'],
  ],
  'tide-gap': [
    ['How far the thumb pulls down to Dive', 'pullPx'], ['How quickly that pull must happen', 'pullWindow'], ['How heavy the steering is', 'dragGain'],
    ['How long the ship lags behind Vesh', 'towDelay'], ['Planks on the hull', 'hull'], ['Warning before a lance, by round', 'boss.warn'],
  ],
  'hot-hand': [
    ['Heat each throw adds', 'throwHeat'], ['Heat lost per second', 'cool'], ['Heat where a throw becomes a HOT HAND', 'edgeAt'],
    ['How long locked hands last', 'lockSecs'], ['Seconds before Krell\'s line charges, by round', 'marchSecs'], ['Hits the charge does', 'ramHurt'],
  ],
  'silent-cut': [
    ['Creeping speed', 'creep'], ['Seconds lit before an alarm, moving', 'fillMovingSecs'], ['Seconds lit before an alarm, frozen', 'fillFrozenSecs'],
    ['Delay before he starts moving', 'creepDelay'], ['Double-tap gap for a slow thumb', 'tapSlowGap'], ['How fast breath comes back', 'breathRegen'],
  ],
  'hold-the-deck': [
    ['How long a press must last to turn to Iron', 'holdSecs'], ['Grey added by each Iron', 'ironPerUse'], ['Guts lost to a volley on the chin', 'volleyHurt'],
    ['Warning before the bear rakes', 'boss.swipeWarn'], ['Hits on the core, phase 2', 'boss.coreP2'], ['Hits on the core, phase 3', 'boss.coreP3'],
  ],
  'split-light': [
    ['Seconds for each step of Vasch\'s count', 'bossCount'], ['Boss resets you get', 'bossNerve'], ['Salvage lost per shot over par', 'overParCost'],
    ['Lowest salvage a level can pay', 'minPay'], ['Chance Glimmick comes', 'glimmickChance'], ['Chance Shardle wakes', 'shardleChance'],
  ],
};

const S = 'Score for ';
const BARE = {
  'storm-run/gravity': 'How fast Kaito falls after a jump.',
  'storm-run/coinValue': 'Salvage for one cog.',
  'storm-run/scorePerFoe': S + 'getting past a foe.', 'storm-run/scorePerCoin': S + 'a cog.', 'storm-run/scorePerClear': S + 'clearing a stage.', 'storm-run/scorePerCore': S + 'a hit on the hound\'s core.',
  'storm-run/palRadius': 'How close Kaito must get to a pal to catch it, px.',
  'storm-run/chaseSecs': 'Seconds the hound chases before it crouches, by round.',
  'storm-run/lungeSecs': 'Seconds the hound\'s lunge takes.',
  'storm-run/houndHalfW': 'The hound\'s hit box, half width, px.',
  'storm-run/staggerSecs': 'Seconds the hound staggers after a core hit.',
  'storm-run/retreatSecs': 'Seconds it takes to drop back after that.',
  'storm-run/endless': 'Endless: starting road speed, how fast it climbs, top speed, gaps between foes, and which foes come.',
  'tide-gap/cogValue': 'Salvage for one cog.',
  'tide-gap/scoreGate': S + 'a gate passed.', 'tide-gap/scoreCog': S + 'a cog.', 'tide-gap/scoreCache': S + 'a cache under a rock.', 'tide-gap/scorePage': S + 'a logbook page.', 'tide-gap/scoreClear': S + 'clearing a stage.', 'tide-gap/scorePlate': S + 'breaking a keel plate.',
  'tide-gap/boss.cutterHalfW': 'The cutter\'s size, half width, px.',
  'tide-gap/boss.cutterHalfLen': 'The cutter\'s size, half length, px.',
  'tide-gap/boss.enterSecs': 'Seconds the cutter takes to come on.',
  'tide-gap/boss.open': 'Seconds the keel plates glow, by round.',
  'tide-gap/boss.staggerSecs': 'Seconds the cutter reels after a plate breaks.',
  'tide-gap/boss.fallSecs': 'Seconds the cutter takes to go down.',
  'tide-gap/endless': 'Endless: starting speed, how fast it climbs, top speed, gap sizes and how fast they shrink, how soon rocks drift.',
  'hot-hand/foes.grunt': 'Plain trooper: health, speed, score, height in cm.',
  'hot-hand/foes.runner': 'Runner: health, speed, score, height in cm.',
  'hot-hand/hotKillChip': 'Extra salvage on the table for a hot kill.',
  'hot-hand/scoreWave': S + 'clearing a wave.',
  'hot-hand/bossRounds': 'Rounds in the fight with Krell.',
  'hot-hand/endless': 'Endless: hits you can take, cooling and lanes.',
  'silent-cut/coinValue': 'Salvage for one cog.',
  'silent-cut/scorePerPx': S + 'each px of street covered.', 'silent-cut/scoreStrike': S + 'a strike.', 'silent-cut/scoreCut': S + 'cutting a lantern.', 'silent-cut/scoreClose': S + 'a close call.', 'silent-cut/scoreCoin': S + 'a cog.', 'silent-cut/scoreClear': S + 'clearing a stage.', 'silent-cut/scoreGhost': S + 'clearing a stage with no alarm.', 'silent-cut/scoreMaroHit': S + 'a cut on Maro.',
  'silent-cut/quips': 'Chance Silas says something at each of these moments, 0 to 1.',
  'silent-cut/talk': 'Seconds each kind of line stays up.',
  'silent-cut/talk.maroLine': 'Seconds one of Maro\'s lines stays up.',
  'hold-the-deck/hookFly': 'Seconds a thrown hook is in the air.',
  'hold-the-deck/beat': 'How much room each kind of beat leaves after it, in seconds, and how long the second man waits.',
  'hold-the-deck/cogValue': 'Salvage for one cog.',
  'hold-the-deck/scoreClear': S + 'clearing a stage.', 'hold-the-deck/scorePerSalvage': S + 'each salvage picked up.', 'hold-the-deck/boss.scoreHit': S + 'a hit on the bear.',
  'hold-the-deck/endless.mix': 'Endless: what comes in each wave, as the waves go on.',
  'split-light/fireW': 'How wide FIRE is on levels, px.',
  'split-light/bossFireW': 'How wide FIRE is on the boss, px.',
  '*/MUSIC_LEVEL': 'How loud the music is, 0 to 1.',
  '*/palRadius': 'How close counts as touching a pal, px.',
};
module.exports = { GAMES, FIRST, BARE };
