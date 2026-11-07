# Hot Hand: pictures the game can use

**Made so far (2026-11-06):** all 24 keys, listed below. Raw takes in `art/raw/`, prompts word for word in `art/prompts/`, keyed with `tools/key-sprite.js`. Built, not yet seen by Dylan. How it differs from the list: `juno_lock` is 1 frame, as the code already shakes her; `trooper_run` is Storm Run's own picture; Krell, `shield_man` and `trooper_lean` face left and the game draws them unflipped (it used to flip them, which would have turned them away from Juno); Krell got a working sheet, `art/raw/krell-sheet-v1.png`, kept here and not in `art/refs`, for Dylan to check; `trooper_throw`'s hand is empty, so the game's hook is the only one. Takes with a figure across a cell line were cut at the real gap between figures first. Every picture below is optional: the game looks for each key first, and a missing or broken picture falls back to code without a sound. To switch one on, save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

**Added later the same day:** Krell's front-facing talk portrait, `krell-portrait.webp`, from `art/raw/krell-portrait-v1.png`. It's set by `img` in `game.js`, not in `art/sprites.js`, because talk portraits don't go through `Kit.art`. It comes from his working sheet: if that sheet changes, make a new portrait.

Lesson from Storm Run: people drawn in code look like jointed mannequins. So **everyone on screen is on this list first**; beasts and scenery are good enough in code and come later.

## How a strip must be made
- Equal frames on a **transparent background**. WebP or PNG. Keep the frame count below. The image tool can't go wider than 3:1, so 6 frames are made as a grid (3 columns, 2 rows, `cols: 3`), and it has no real transparency, so they're made on flat `#00FF00` and put through `tools/key-sprite.js`.
- About 512 px tall per frame is plenty (the game draws most of these 60 to 113 px tall, twice that on a phone).
- Every frame: the character the same size, feet on the same line, so the strip doesn't jitter. `feet` is where the feet sit down the frame (0 top, 1 bottom), `fill` is the share of the frame's height the character takes up, `cx` is where the middle is across the frame. Measure them and put them in the entry.
- Same style block and locked sheets as every other image (`art/refs/STYLE.md`). No nudity, nothing sexualised, no sexualised posing or camera framing. Adult proportions and adult faces.
- Locked sheets: `juno-sheet-v5.png`, `ashka-sheet-v1.png`, `trooper-sheet-v1.png`, `hollow-hound-sheet-v3.png`. Krell has no sheet: use his lines in `docs/FRIDAY_BATCH.md` and `shared/kit/cast.js` (195 cm, age 41, heavy steel arm and shin plates over the grey Sever coat, helmet with no visor, jaw and heavy brow showing, white collar, black bar and ring on the chest), and make him a sheet first if he's going to be seen often.

**Juno, every frame:** copper-orange thick braid over her shoulder, freckles, green eyes, dark brown bomber jacket with cream fur collar and cuffs, cropped white tank top, denim cut-off shorts, tall laced brown boots, **black fingerless gloves**, flame-feather bond mark just below her right collarbone. **No gun, no bandolier.** She throws fire from her gloved hands. Don't draw fire in her hands in these pictures: the game draws the fire and the mark's glow on top, and it changes with her heat. She faces right; on screen that shows her right side, with the mark at her chest.

## The list
Priority: 1 changes the look most. Keys are exact.

| # | Key | File | Frames | fps | Faces | On screen | Each frame shows |
|---|---|---|---|---|---|---|---|
| 1 | `juno_idle` | `juno-idle.webp` | 4 | 6 | right | 96 px | Standing in a loose gambler's stance, weight back, cocky grin, hands low and open in front of her, breathing. Frames differ only in the breath and the braid's sway |
| 1 | `juno_hot` | `juno-hot.webp` | 4 | 8 | right | 96 px | Leaning forward, knees bent, both hands up in front of her chest ready to throw, teeth showing, hair lifting a little as if in a hot draught, a sheen of sweat. Also used on the title. Frames differ in the breath and the hair |
| 1 | `juno_throw` | `juno-throw.webp` | 3 | - | right | 96 px | 1 wind-up: near arm back and high, body turned. 2 mid-throw: near arm whipping past the shoulder, weight going forward. 3 follow-through: near arm straight out, open palm, back heel lifting. Shown in that order over 0.26 s |
| 1 | `juno_lock` | `juno-lock.webp` | 2 | 14 | right | 96 px | Her hands have locked: hunched forward, knees bent, both forearms clamped in against her chest with the gloved hands turned in and clawed stiff, jaw clenched, face in pain. 2 is 1 shaken a little |
| 1 | `juno_hurt` | `juno-hurt.webp` | 1 | - | right | 96 px | Knocked back: head snapped back, arms out, one heel off the ground |
| 1 | `juno_down` | `juno-down.webp` | 1 | - | right | 96 px, lying | On her back on the ground, one arm flung out, braid across the street. Feet line is the ground under her. Not posed: dropped |
| 2 | `trooper_walk` | `trooper-walk.webp` | 6 | 10 | right (the game flips it) | 64 to 104 px | Walking per `trooper-sheet-v1.png`: visored helmet, jaw showing, long coat, bond-cutter hook at the hip, gloves |
| 2 | `trooper_run` | `trooper-run.webp` | 6 | 12 | right (flipped) | 64 to 104 px | Sprinting, coat tails flying. Storm Run has one (`games/storm-run/art/trooper-run.webp`, 3 x 2 grid, same keys): copy it as a start |
| 2 | `trooper_swing` | `trooper-swing.webp` | 3 | - | right (flipped) | 64 to 104 px | Bond-cutter out, glowing white. 1 blade drawn and rising. 2 blade high over the head, ready: this is the warning pose, it must read at a glance. 3 blade down and through, follow-through |
| 2 | `trooper_throw` | `trooper-throw.webp` | 2 | - | right (flipped) | 64 to 104 px | 1 arm back and high with a white hook in the hand. 2 arm thrown forward, empty hand. The game draws the hook in the hand on top of frame 1; leave the hook in as well if that reads better and say so |
| 2 | `trooper_plate` | `trooper-plate.webp` | 6 | 10 | right (flipped) | 64 to 104 px | Walking behind a tall steel riot plate held in the near hand: narrow, pointed at the bottom, the Sever mark (a bar cutting a ring) on it. With this picture on, the code plate isn't drawn |
| 2 | `trooper_lean` | `trooper-lean.webp` | 1 | - | left | 92 px, cut off at the sill | Waist up shooting pose, leaning forward to fire a short crossbow, for the Long Table's windows. Full figure, the game clips the legs at the window sill |
| 2 | `trooper_down` | `trooper-down.webp` | 1 | - | right (flipped) | 64 to 104 px, lying | On his back, burnt coat, helmet still on. The game adds the flames |
| 3 | `krell_stand` | `krell-stand.webp` | 4 | 6 | left | 113 px | Standing behind his line, feet wide, heavy, one arm out pointing forward, the other holding a whistle or a wooden baton. Bored. Breath only between frames |
| 3 | `krell_throw` | `krell-throw.webp` | 1 | - | left | 113 px | Arm back to lob a metal can, the can in his hand |
| 3 | `krell_hurt` | `krell-hurt.webp` | 1 | - | left | 113 px | Exposed: staggered, one arm across his face against the heat, coat smoking |
| 3 | `krell_down` | `krell-down.webp` | 1 | - | left | 113 px | Down on one knee, head low, a hand on the ground, still furious |
| 3 | `shield_man` | `shield-man.webp` | 1 | - | left | 104 to 62 px | A trooper braced forward from behind, boots dug in, one shoulder down, seen from the side. A code shield is drawn over his front half, so only his back half, helmet and boots show |
| 4 | `ashka_fly` | `ashka-fly.webp` | 4 | 12 | right | 44 px, beak to tail not counted: see note | Flying per `ashka-sheet-v1.png`: ember-red and black feathers, black band across the wing, hooked grey beak, swept crest with fire at the tips, glowing tail plumes. 1 wings up, 2 level going down, 3 wings down, 4 level going up. `y` passed is the bottom of the frame's bird: set `feet` to about 0.8 |
| 5 | `hollow_leap` | `hollow-leap.webp` | 1 | - | right (flipped) | 70 px | The Hollow hound of `hollow-hound-sheet-v3.png`, smaller: stretched out in a bound, **plates shut over the chest core** |
| 5 | `hollow_open` | `hollow-open.webp` | 1 | - | right (flipped) | 70 px | Standing, chest plates parted, **white core bare and blazing** |
| 5 | `hollow_crouch` | `hollow-crouch.webp` | 1 | - | right (flipped) | 70 px | Crouched to bite, head low, teeth bare, chest plates parted, core blazing |
| 6 | `powder_cart` | `powder-cart.webp` | 1 | - | right (flipped) | 66 px | A two-wheeled barrow with three kegs marked with a red warning triangle, handles back. The game adds the fuse and its flame on top: leave a little room on the top of the middle keg |
| 6 | `cover_table` | `cover-table.webp` | 1 | - | right | 70 px | A round-cornered card table tipped on its side as cover: green felt top facing the enemy on the right, brass edge, wooden legs toward Juno, a card or two stuck to it |

The pals need nothing here: they're drawn by `shared/pals.js`. Optional keys `pal_cinderbun` and `pal_dicemite` work if anyone wants them (44 px).

## Ready to paste into `art/sprites.js`
Change `feet`, `fill` and `cx` to the measured numbers. `fill` and `feet` below are starting guesses. Grids of 6 use `cols: 3`.
```js
window.DRIFT_SPRITES = {
  juno_idle:  { src: 'art/juno-idle.webp',  frames: 4, cols: 2, fps: 6,  feet: 0.96, cx: 0.5, fill: 0.88 },
  juno_hot:   { src: 'art/juno-hot.webp',   frames: 4, cols: 2, fps: 8,  feet: 0.96, cx: 0.5, fill: 0.88 },
  juno_throw: { src: 'art/juno-throw.webp', frames: 3, cols: 3, feet: 0.96, cx: 0.5, fill: 0.88 },
  juno_lock:  { src: 'art/juno-lock.webp',  frames: 2, cols: 2, fps: 14, feet: 0.96, cx: 0.5, fill: 0.88 },
  juno_hurt:  { src: 'art/juno-hurt.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.88 },
  juno_down:  { src: 'art/juno-down.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.3 },
  trooper_walk:  { src: 'art/trooper-walk.webp',  frames: 6, cols: 3, fps: 10, feet: 0.96, cx: 0.5, fill: 0.88 },
  trooper_run:   { src: 'art/trooper-run.webp',   frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 0.84 },
  trooper_swing: { src: 'art/trooper-swing.webp', frames: 3, cols: 3, feet: 0.96, cx: 0.5, fill: 0.8 },
  trooper_throw: { src: 'art/trooper-throw.webp', frames: 2, cols: 2, feet: 0.96, cx: 0.5, fill: 0.8 },
  trooper_plate: { src: 'art/trooper-plate.webp', frames: 6, cols: 3, fps: 10, feet: 0.96, cx: 0.5, fill: 0.88 },
  trooper_lean:  { src: 'art/trooper-lean.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.88 },
  trooper_down:  { src: 'art/trooper-down.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.3 },
  krell_stand: { src: 'art/krell-stand.webp', frames: 4, cols: 2, fps: 6, feet: 0.96, cx: 0.5, fill: 0.88 },
  krell_throw: { src: 'art/krell-throw.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.88 },
  krell_hurt:  { src: 'art/krell-hurt.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.88 },
  krell_down:  { src: 'art/krell-down.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.7 },
  shield_man:  { src: 'art/shield-man.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.88 },
  ashka_fly:   { src: 'art/ashka-fly.webp',   frames: 4, cols: 2, fps: 12, feet: 0.8, cx: 0.5, fill: 0.6 },
  hollow_leap:   { src: 'art/hollow-leap.webp',   frames: 1, feet: 0.95, cx: 0.5, fill: 0.7 },
  hollow_open:   { src: 'art/hollow-open.webp',   frames: 1, feet: 0.95, cx: 0.5, fill: 0.85 },
  hollow_crouch: { src: 'art/hollow-crouch.webp', frames: 1, feet: 0.95, cx: 0.5, fill: 0.7 },
  powder_cart: { src: 'art/powder-cart.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.9 },
  cover_table: { src: 'art/cover-table.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.9 },
};
```

## After Juno's pictures are in: one more number to set
Her fire is drawn by code at her hands. For a picture, the hands' places are in `tuning.js` as `picHands`: for each state, `[across, up]` as shares of her height from between her feet, near hand first. They hold starting guesses. Look at her on screen, in the COLD, HOT and HANDS LOCKED states and mid-throw, and move them until the flames sit in the gloves.

## What stays in code, whatever pictures arrive
The fire, her heat aura, the mark's glow, the palm in the corner (it has to show the heat and the burns), the heat bar, the shields and their vents (the vent has to line up with the rules), Krell's and the line's warnings, flames, hooks, bolts, quench cans, the five backgrounds, all warning signs and Ashka's mark.
