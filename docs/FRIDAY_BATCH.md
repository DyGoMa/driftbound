# Friday batch spec (2026-11-06)

Dylan's answers are in `docs/DECISIONS.md`, heading "Friday batch". Everything here that those answers don't state is Claude's call, listed at the end for Dylan to change. Everyone building from this file also reads `docs/WORLD_BIBLE.md` hard rules.

Authoritative cast: `C:\Users\Dylan\Documents\driftbound-villains\docs\CAST.md` (newer than this branch's copy; do not edit it from a game). Locked sheets: `C:\Users\Dylan\Documents\driftbound-villains\art\refs\` and `STYLE.md` there.

## Shared rules for every game
- Plain HTML and JavaScript, no build step, no libraries. Runs on a phone browser first, computer second. Scripts around 200 lines; split when bigger. Every page uses the 18+ gate exactly as `games/storm-run/index.html` does (content in `<template id="page">`, code starts in `DriftGate.whenPassed`).
- Layout: `games/<id>/index.html`, `tuning.js` (every number, each marked PROVISIONAL or with its source), small scripts, `art/` (`art/sprites.js` starts empty), `NOTES.md` (what was built, what was checked, provisional numbers, calls made).
- Use the shared kit (`shared/kit/`) for the loop, input, menus, talk scenes, sound, music, sprites, orientation prompt, save. Extend the kit only through the foundation; a game never forks it.
- Shape: 5 stages, the 5th a boss, then a short story ending, which unlocks endless mode. Split Light is the exception: puzzle levels and a final boss puzzle, no endless. Dying restarts the current stage. Stage progress is saved.
- Menu on every title screen: Story, Endless (locked until the ending), Upgrades, No-upgrades switch, Sound, Back to Driftbound, and the game's salvage and best score. A fair run (no upgrades) records its own best score.
- Upgrades: 3 per game, 3 levels each, paid from the shared salvage total.
- Salvage: earned in every game. Spending lowers the balance only; story cards unlock from lifetime salvage, so spending never relocks them.
- Pals: 2 hidden per game, as a rare catch with a game-specific condition, shown with a catch moment and a line from the crew. A caught pal goes in the shared save and the Monster Book. Caught once only.
- Crew talk: a short scene before each stage (2 to 4 lines), an ending scene, and a varied one-liner when you lose. Full flavour: swearing, innuendo and teasing that fit each character. Hard limits: no nudity, no sexualized posing or camera framing, no explicit scenes, nothing sexual involving anything childlike. Pals are never in flirting or innuendo. Lines must match each person's voice in CAST.md.
- The bond cost is the heart of each game: it must change how you play and be visible on screen.
- Look: 2000s TV-anime: black ink outlines, flat colour with one shadow tone, stormy dusk UI (navy, orange, gold; Anton and Barlow fonts, as on the homepage). Code-drawn art must already look finished, with human proportions and adult faces; never bare rectangles or capsules. Pictures replace code art through `Kit.art` when they exist, and the game must still work if any picture is missing.
- Sound: every action has an effect, plus a short original music loop for each game made in code. Mute remembered across games. Audio starts only after a tap.
- Touch: all controls one-thumb where the game allows, big targets, no accidental browser zoom, scroll or text selection. Keyboard works on computer. Pause when the tab is hidden, with a pause button.
- Fair and winnable: a test bot must beat every stage and boss in the headless test (at raised game speed), and must lose when it does nothing. Difficulty aims for: first stage easy for a new player, boss takes a few tries.
- Original only: no copied characters, names, symbols, music or Pokémon-like designs.

## The six games
| id | Game | Lead and partner | Island | Hold phone | Boss |
|---|---|---|---|---|---|
| `storm-run` | Storm Run | Kaito, Skarn | Pinhold (Empire island being pinned by pylons) | sideways | Silt on his Hollow hound |
| `tide-gap` | Tide Gap | Sela, Vesh | Gaptooth Reach (islands grinding past each other) | upright | Hekka Dorn's Sever cutter |
| `hot-hand` | Hot Hand | Juno, Ashka | Ashmarket (a gamblers' island under Sever raid) | sideways | Warden Krell (new heavy trooper officer) |
| `silent-cut` | Silent Cut | Silas, Hush | Lanternreach (smugglers' port at night) | sideways | Ledger Maro (Silas's old boss, sold out to the Sever) |
| `hold-the-deck` | Hold the Deck | Bram, Grist | Keelbreak (the Gullwake in dry dock) | upright | Hekka's Hollow bear, Hekka at the end |
| `split-light` | Split Light | Ione, Prism | The Glass Ward (a dead bond lab) | upright | Director Vasch |

### Storm Run
One-tap runner, already answered by Dylan (`DECISIONS.md`, build step 3; `STEP3_PLAN.md` Phase 2). Tap to jump, tap in the air to Surge (second jump). Quick tap is a short hop, hold is a full jump. Skarn glides above and behind. A small arm in the corner shows lightning scars climbing with each Surge and fading slowly. At the top the arm goes numb: no second jump for about 5 seconds (in the game only; the story keeps "for days"). Jump troopers and barricades; a Hollow swoops in mid-air. Stages grow by distance. Boss: Silt and the hound chase Kaito, lunging and throwing cables; Surge into the hound's white core when it's open, three times. Upgrades: Cool Scars (fade faster), Salvage Pull, Skarn's Catch (a free hit per run). Pals: Fizzlet, Boltnip.

### Tide Gap
Drag to steer the Gullwake, towed by Vesh, up through gaps as islands drift sideways and close. Arrows ahead show which way each island will drift: that's Sela's sense of the Drift. Hold to Dive (Surge), passing under an island. Each Dive drowns a memory: the logbook on screen loses a line for good in this run, and every lost line weakens the drift arrows, until at zero they're gone and Dives stop. Logbook pages found on the way restore a line. Boss: Hekka's cutter fires harpoon-lances and drops pylons; Dive under the hull and burst up through its weak plates. Upgrades: Tougher Hull, Longer Dive, Spare Logbook. Pals: Bobbin, Mopclaw.

### Hot Hand
Sideways target-throwing. Tap a Sever trooper to throw fire from Juno's gloved hands; Ashka spots and marks weak targets for bonus. Each throw raises her heat. Too hot: her hands lock for a moment and she takes burn damage. Heat also makes throws stronger, so playing near the top is the skill. Between waves, a double-or-nothing bet on salvage: take no damage in the next wave to win it. Boss: Warden Krell's shield line, with heat-vents to overload. Upgrades: Cool Palms, Bigger Flame, Loaded Deck (better bet payout). Pals: Cinderbun, Dicemite.

### Silent Cut
Side-on stealth. Hold to creep forward, let go to freeze in shadow. Searchlights and patrols sweep; being lit for too long raises an alarm, and three alarms fail the stage. Tap when close behind a trooper to strike with the chain-blade. Double tap to Surge: a silent wind dash through light, which uses breath. Out of breath, Silas can't Surge, moves slower, and his talk boxes go blank: "...", the worst thing that can happen to him. Breath returns slowly when frozen. Boss: Ledger Maro's lamplit warehouse; strike when his back is turned, and dodge his sweeping lamp and guards. Upgrades: Deep Lungs, Longer Chain, Softer Boots. Pals: Tuftle, Lamplick.

### Hold the Deck
Upright lane defence. Boarders come down 3 lanes toward the galley. Tap a lane to send Bram there and swing. Hold to turn to Iron (Surge): he blocks everything, and every use spreads grey iron on a body icon and slows him for the rest of the run. Grist charges down a lane when his meter fills. Between waves, cook one meal: heal, speed, or pull back the iron a little. Boss: Hekka's chained Hollow bear breaks through the deck in phases; Hekka speaks at the end. Upgrades: Thick Apron, Grist's Temper, Big Pot. Pals: Rivetling, Spoonling.

### Split Light
Upright puzzle, at least 15 levels over 4 sets, then the boss. Tap crystals to turn them and bounce Prism's beam to hit every Hollow core. Shots are limited, and each shot grows a new crystal on the board where the beam stopped, which can block or help: her bond cost changes the puzzle. Salvage by fewest shots. Every level must be proven solvable by a solver in the test. Boss: Vasch, a multi-phase puzzle with moving cores; he talks throughout. Upgrades: Steady Hand (one undo per level), Shard Scraper (remove one growth), Second Look (show the beam's first bounce). Pals: Glimmick, Shardle. Deadpan science innuendo from Ione.

## Pals (12, Claude's designs; all cute, comic, original, never in fan service)
| Pal | What it is | Game |
|---|---|---|
| Fizzlet | a fluffy storm cloud on two stubby legs | Storm Run |
| Boltnip | a tiny gecko with a kite-tail that sparks | Storm Run |
| Bobbin | a jellyfish shaped like a striped buoy | Tide Gap |
| Mopclaw | a shy crab wearing a mop-head as a shell | Tide Gap |
| Cinderbun | a warm ember dumpling with tiny feet | Hot Hand |
| Dicemite | a beetle-mite with a lucky pip-marked shell | Hot Hand |
| Tuftle | a puff of shadow fur with two big eyes | Silent Cut |
| Lamplick | a moth that licks lantern glass | Silent Cut |
| Rivetling | a little iron hedgehog studded with rivets | Hold the Deck |
| Spoonling | a begging stowaway with a ladle tail | Hold the Deck |
| Glimmick | a snail with a faceted crystal shell | Split Light |
| Shardle | a round glass chick that chimes | Split Light |

## Shared kit contract (built first, used by all)
`shared/kit/`: `core.js` (fixed-step loop, canvas scaling, input, pause, orientation prompt, `Kit.timeScale`), `ui.js` (title, upgrades, stage select, talk scene with crew portraits, results, ending), `audio.js` (effects, music loop, mute), `art.js` (sprite loader with code-art fallback, ink-and-flat drawing helpers, particles, shake), `game.js` (`Kit.start(def)`, the stage, boss, ending, endless and salvage flow). `shared/save.js` grows: lifetime salvage, spend, per-game stage progress, upgrade levels, fair best, pals, without losing any existing save. `shared/pals.js`, `shared/stories.js`, `shared/games.js` (the list of six; a game shows as playable only when `live: true`). `tools/smoke.js` runs a game in headless Chrome: errors, screenshots, the bot, phone sizes.

## Calls Claude made (change any)
Game names other than Storm Run; island names; new minor villains Warden Krell and Ledger Maro; which boss goes where; all pals' names and looks; upgrade names and prices; the Silt and hound details the sheets don't settle; 5 stages per game; "dying restarts the current stage"; salvage rates.
