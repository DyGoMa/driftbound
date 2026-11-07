# Silent Cut: pictures the game can use

**Made so far (2026-11-06): all 19 keys below.** Raw takes in `art/raw/`, prompts word for word in `art/prompts/`, keyed with `tools/key-sprite.js`, numbers in `art/sprites.js`. Status: built, not yet seen by Dylan. Which take each comes from, and each picture's flaws, are in `NOTES.md`.

**How it differs from the list below:** Ledger Maro had no sheet, so `art/raw/maro-sheet-v1.png` was made first and kept here with this game (not locked, not in the villains' `art/refs`). With his pictures on, `people.js` no longer draws his pole and lamp, and only draws the shut book over the picture's open one for the warning; `lights.js` starts his cone at the picture's lantern. `silas_winded` is take 2. `silas_strike`'s chain starts from the hand in each frame (`STRIKE_HAND` in `people.js`). `silas_strike` is take 2 (`silas-strike-v2.webp`): the sheath is empty, because the game draws the knife thrown.

Every picture is optional. The game looks for these keys first; a missing or broken picture falls back to code without a sound. To switch one on: save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

## How a strip must be made
- Same rules as `games/storm-run/art/REQUEST.md`: equal frames on a **transparent background**, WebP or PNG. The image tool can't go wider than 3:1, so 6 frames are made as a grid (3 columns, 2 rows, `cols: 3`), and it has no real transparency, so they're made on flat `#00FF00` and put through `tools/key-sprite.js`.
- About 512 px tall per frame is plenty (these draw 60 to 84 px tall, twice that on a phone).
- Every frame: the character the same size, feet on the same line. `feet` is where the feet sit down the frame (0 top, 1 bottom), `fill` is the share of the frame's height the character takes up when **standing** (so a crouch keeps the same scale), `cx` is where his middle is across the frame. Measure them and put them in the entry.
- Locked sheets, in `C:\Users\Dylan\Documents\driftbound-villains\art\refs\`, style block in `STYLE.md` there: **`silas-sheet-v4.png`, `hush-sheet-v2.png`, `trooper-sheet-v1.png`**. Ledger Maro has no sheet: his look is in `shared/kit/cast.js` (52, 172 cm, stout, balding, plum satin coat, gold belt, smiling). Make one first, or match the code figure.
- Silas details that must hold: dark teal hair tied low and straight down his back; white shirt open to the stomach, loose collar; wide red sash, **chain wound round it**, knife sheathed at his right hip; black trousers; wrapped forearms and ankles; violet eyes, beauty mark under his left eye. Three violet feather marks on the **left** side of his neck: he faces right in play, so we see his right side and **no marks**, as on the sheet's right-hand view. Adult proportions, no sexualised posing.
- Silas and the troopers face right in the picture; the game flips them.

## The list
Priority 1 changes the look most. Keys are exact. Height = how tall it draws on screen, standing, at the game's scale.

| # | Key | File | Frames | fps | Height | Each frame shows |
|---|---|---|---|---|---|---|
| 1 | `silas_creep` | `silas-creep.webp` | 6 | 8 | 84 px | A low sneaking walk, knees bent, torso leaning forward, weight rolling heel to toe, one hand low ahead, sash ends trailing. 1 right foot down, 2 passing, 3 right foot pushing off, 4 left foot down, 5 passing, 6 left foot pushing off. Quiet, not a run |
| 1 | `silas_freeze` | `silas-freeze.webp` | 1 | - | 84 px | Dead still in the open: a low crouch on one knee, head turned to look, one hand flat toward the ground. Same scale as standing |
| 1 | `silas_hide` | `silas-hide.webp` | 1 | - | 84 px | Tucked tight behind cover: squatting, arms in, shoulder turned, looking out. Everything below the chest will be behind a crate, so keep the head and shoulders clean |
| 1 | `silas_surge` | `silas-surge.webp` | 1 | - | 84 px | The wind dash: stretched flat forward, one arm trailing, hair and sash streaming behind, wind streaks round the body in pale violet, eyes bright |
| 1 | `silas_strike` | `silas-strike.webp` | 3 | - | 84 px | The throw. 1 wind-up, chain-blade drawn back overhead. 2 arm whipping forward, chain leaving the hand. 3 follow-through, arm out straight, weight on the front foot. **No blade or long chain in frame**: the game draws the chain to its target in code. A few links at the hand are fine |
| 1 | `silas_winded` | `silas-winded.webp` | 4 | 6 | 84 px | **Out of breath**: bent over, one hand at his throat, the other hanging, mouth open, hair falling forward, no glow at all. A slow shuffle: 1 and 3 feet apart, 2 and 4 passing. Frame 1 is also used standing still. Must read as the worst moment of his life |
| 1 | `trooper_walk` | `trooper-walk.webp` | 6 | 8 | 83 px | Per `trooper-sheet-v1.png`: an unhurried patrol walk, coat swinging, bond-cutter at the right hip, one arm forward holding nothing (the game draws his hand lamp). Same six-beat cycle as above |
| 1 | `trooper_stand` | `trooper-stand.webp` | 1 | - | 83 px | Stopped, looking ahead, lamp arm a little forward |
| 1 | `trooper_down` | `trooper-down.webp` | 1 | - | 83 px of body length | Face down on the ground, one arm out, helmet still on. Nothing gory. `fill` here counts his length; lying flat, feet line at the ground |
| 2 | `trooper_run` | `trooper-run.webp` | 6 | 12 | 83 px | Copy from `games/storm-run/art/trooper-run.webp` (same sheet, same key). Used when they hunt after an alarm |
| 2 | `hush_perch` | `hush-perch.webp` | 1 | - | 62 px, ear tip to paw | Per `hush-sheet-v2.png`, the right-facing side view, standing, wings folded |
| 2 | `hush_glide` | `hush-glide.webp` | 4 | 6 | 62 px, wing tip to paw | Gliding silently, facing right: wings spread, legs trailing, frames differ in the wings' slow beat: 1 up, 2 level, 3 down, 4 level. No motion lines |
| 3 | `maro_book` | `maro-book.webp` | 1 | - | 79 px | **His back to Silas, for the moment you can cut him.** Facing right, head down over an open ledger held in the left hand, the right hand holding a long pole with a lantern at the top. The game draws the book and lamp in code on top for now; once this picture is in, tell whoever does it to take those two out of `people.js` (`drawKit`) for this key |
| 3 | `maro_lamp` | `maro-lamp.webp` | 1 | - | 79 px | Facing right (the game flips him to face you), lantern pole held out in front, chin up, a wide unpleasant smile, ledger under his arm |
| 3 | `maro_hurt` | `maro-hurt.webp` | 1 | - | 79 px | Reeling back, one hand to a cut on his shoulder, coat torn, mouth open in outrage. Nothing gory |
| 3 | `maro_run` | `maro-run.webp` | 6 | 12 | 79 px | A stout man running badly, coat flapping, pages falling from the book under his arm |
| 3 | `maro_down` | `maro-down.webp` | 1 | - | 79 px of body length | On his back, winded, holding his hand up to bargain |
| 4 | `silas_hurt` | `silas-hurt.webp` | 1 | - | 84 px | Shoved back, stumbling, arms out |
| 4 | `silas_down` | `silas-down.webp` | 1 | - | 84 px of body length | Flat on the ground, caught. Hair across his face |

## Ready to paste into `art/sprites.js`
Change `feet`, `fill` and `cx` to the measured numbers. These are starting guesses.
```js
window.DRIFT_SPRITES = {
  silas_creep:   { src: 'art/silas-creep.webp', frames: 6, cols: 3, fps: 8, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_freeze:  { src: 'art/silas-freeze.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_hide:    { src: 'art/silas-hide.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_surge:   { src: 'art/silas-surge.webp', frames: 1, feet: 0.9, cx: 0.5, fill: 0.84 },
  silas_strike:  { src: 'art/silas-strike.webp', frames: 3, cols: 3, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_winded:  { src: 'art/silas-winded.webp', frames: 4, cols: 2, fps: 6, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_hurt:    { src: 'art/silas-hurt.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.84 },
  silas_down:    { src: 'art/silas-down.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.84 },
  trooper_walk:  { src: 'art/trooper-walk.webp', frames: 6, cols: 3, fps: 8, feet: 0.97, cx: 0.5, fill: 0.84 },
  trooper_run:   { src: 'art/trooper-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 0.84 },
  trooper_stand: { src: 'art/trooper-stand.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  trooper_down:  { src: 'art/trooper-down.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  hush_perch:    { src: 'art/hush-perch.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  hush_glide:    { src: 'art/hush-glide.webp', frames: 4, cols: 2, fps: 6, feet: 0.85, cx: 0.5, fill: 0.7 },
  maro_book:     { src: 'art/maro-book.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  maro_lamp:     { src: 'art/maro-lamp.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  maro_hurt:     { src: 'art/maro-hurt.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
  maro_run:      { src: 'art/maro-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 0.84 },
  maro_down:     { src: 'art/maro-down.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.84 },
};
```

## What stays in code, whatever pictures arrive
The light (it has to match the rules to the pixel), cover, lanterns, towers, cranes, the street, the breath panel and bells, the warning marks, the chain, the salvage, the lamp-line glow, the pals (drawn by `shared/pals.js`). Someone could later paint the cover and the street fronts; the game doesn't look for those keys yet.

## Notes for whoever makes them
- Ledger Maro's talk portrait is made: `art/maro-portrait.webp`, set by `img` in his `Kit.speakers.add` in `people.js` (no kit file changed). It comes from `maro-sheet-v1.png`, which isn't locked; if that sheet changes, make a new portrait. Old wording of this note: "The kit gives Ledger Maro a code talk portrait. A proper head-and-shoulders picture for the talk scenes would lift the two scenes he leads. `Kit.speakers.maro` takes an `img`, as `silt` does in `shared/kit/speakers.js`, but that's a kit file: do it through the foundation, not from this game."
- The trooper's talk portrait is made: `art/trooper-portrait.webp`, set by `img` in his `Kit.speakers.add` in `people.js` (no kit file changed), from `trooper-sheet-v1.png`.
- With a picture on, the hand lamp and Maro's book and pole still draw in code at fixed hand heights (`people.js`). Check them against the strip and nudge if a lamp floats.
