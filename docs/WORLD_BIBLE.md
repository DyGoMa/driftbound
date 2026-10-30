# Hoshi Arcade: World Bible

Every game, page and piece of art must match this file. Workers read it before building anything.

## The setting
Hoshi Arcade is a small, old arcade built under a hilltop shrine in the seaside town of **Hoshimachi**. Each cabinet holds a tiny world, kept alive by **Star Shards**. One night a broken cabinet leaked **The Static**, a glitch creature that eats shards and corrupts games. The friends below "dive" into each cabinet with Yuzu's Dive Rig to win the shards back.

**One cabinet = one game.** Every game is a different cabinet, so styles can differ, but the cast, colours and Star Shards always carry over.

## Cast (art is drawn in code in `shared/cast.js`; never redraw a character by hand in a game)
| Character | Role | Look | Personality | Line |
|---|---|---|---|---|
| **Aki Hoshino** | Hero. Fastest kid in town | Spiky red-orange hair with ponytail, amber eyes, navy jacket with orange trim, teal scarf | Loud, brave, never walks | "Full speed!" |
| **Mochi** | Arcade guardian fox spirit, mascot | Round white fox, pink ear tips, floats, one fluffy tail | Cheerful, gives hints, a bit dramatic | "Kyu!" |
| **Ren Kurogane** | Calm swordsman, Aki's rival | Sleek navy hair over one eye, grey eyes, white jacket, wooden sword | Few words, precise | "...One cut." |
| **Yuzu Kiri** | Inventor, built the Dive Rig | Yellow twin tails, green eyes, goggles on forehead, orange overalls | Fast talker, loves gadgets | "Science time!" |
| **Granny Sumi** | Arcade owner (side character) | Not drawn yet | Knows the old stories | - |
| **The Static** | Main villain | Not drawn yet (final boss) | Silent, hungry | - |
| **Glitchlings** | The Static's minions, standard enemies in every game | Dark purple jagged blob, one magenta eye, colour-split flicker | Mischief | - |

## Palette (from `shared/cast.js` COLORS)
Ink outline `#1d1430` · Night sky `#1a1240` → `#ff7aa8` horizon · Star gold `#ffd75e` · Glitch purple `#3a1a5c` with magenta `#ff2e9a` and cyan `#2ee6ff` split.

## Rules for every game
1. Uses `shared/cast.js` for characters and `shared/save.js` to add Star Shards.
2. Works with one finger on a phone and with a keyboard.
3. Has a title screen with the cabinet name and a one-line story hook.
4. Has a "Back to arcade" button.
5. Tuning numbers live in that game's `tuning.js`, each marked with where it came from or PROVISIONAL.
6. Story beat in one sentence, added to the Lore list below when shipped.

## Game roadmap (cabinets)
| # | Cabinet | Hero | Type | Status |
|---|---|---|---|---|
| 1 | Aki Dash | Aki | One-tap endless runner | built, not yet seen running |
| 2 | Mochi Pop | Mochi | Bubble-match puzzle | planned |
| 3 | One Cut | Ren | Reflex slicing | planned |
| 4 | Yuzu's Launcher | Yuzu | Physics launch | planned |
| 5 | Glitch Siege | Everyone | Tower defense | planned |
| 6 | Static Showdown | Everyone | Boss fight (finale) | planned |

## Lore (unlocked on the homepage by total Star Shards)
- 0: The Arcade under the Shrine
- 25: Aki: The Fastest Kid in Hoshimachi
- 75: Mochi: The Guardian Who Fell Asleep
- 150: Yuzu and the Dive Rig
- 300: Ren's Promise
- 500: What The Static Wants
