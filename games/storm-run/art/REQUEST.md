# Storm Run: pictures the game can use

**Made so far (2026-11-06):** `kaito_run`, `kaito_jump`, `kaito_surge`, `kaito_hurt`, `trooper_run`, `skarn_glide`. Raw takes in `art/raw/`, the prompts word for word in `art/prompts/`, keyed with `tools/key-sprite.js`. Still code art, on purpose: the Hollow swooper, Silt and the hound (the core's position has to match the rules), barricades.

Every picture is optional. The game draws everything in code and looks for these keys first; a missing or broken picture falls back without a sound. To switch one on: save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

## How a strip must be made
- Equal frames on a **transparent background**. WebP or PNG. Keep the frame count below. The image tool can't go wider than 3:1, so 6 frames are made as a grid (3 columns, 2 rows, `cols: 3`), and it has no real transparency, so they're made on flat `#00FF00` and put through `tools/key-sprite.js`.
- About 512 px tall per frame is plenty (the game draws most of these 85 to 150 px tall, twice that on a phone).
- Kaito and everything he meets face the way listed. Same style block and locked sheets as every other image (`art/refs/STYLE.md`).
- Every frame: the character the same size, feet on the same line, so the strip doesn't jitter. `feet` is where the feet sit down the frame (0 top, 1 bottom), `fill` is the share of the frame's height the character takes up, `cx` is where his middle is across the frame. Measure them and put them in the entry.
- Kaito's hand mark, scars, goggles and white streak must match `kaito-sheet-v8.png` on the side you can see (facing right, we see his right side: gauntlet arm, mark on the back of the hand, scars hand to elbow). No nudity, nothing sexualised. Adult proportions.

## The list
Priority: 1 and 2 change the look most. Keys are exact.

| # | Key | File | Frames | fps | Faces | On screen | Each frame shows |
|---|---|---|---|---|---|---|---|
| 1 | `kaito_run` | `kaito-run.webp` | 6 | 12 | right | 85 px | A full run cycle: 1 right foot down, 2 passing, 3 right foot pushing off, 4 left foot down, 5 passing, 6 left foot pushing off. Leaning forward, jacket flapping |
| 2 | `kaito_jump` | `kaito-jump.webp` | 1 | - | right | 85 px | Rising: lead knee up, back leg trailing, arms pumping |
| 2 | `kaito_surge` | `kaito-surge.webp` | 1 | - | right | 85 px | The Surge: body stretched forward, gauntlet arm punched out, lightning crawling up that arm from hand to elbow, bond mark blazing |
| 2 | `kaito_hurt` | `kaito-hurt.webp` | 1 | - | right | 85 px | Knocked back: head snapped back, arms out, one foot off the road. Also used for lying down at the end of a failed run |
| 3 | `skarn_glide` | `skarn-glide.webp` | 4 | 9 | right | 72 px, fin top to paws (fill counts the body and fin height) | Gliding per `skarn-sheet-v3.png`: forelegs reaching, hind legs trailing, forked tail streaming. Frames differ in the fin's lightning crawling along the edge and the tail's sway |
| 4 | `trooper_run` | `trooper-run.webp` | 6 | 12 | right (the game flips it) | 86 px | Run cycle per `trooper-sheet-v1.png`; coat tails flying, bond-cutter at the hip |
| 5 | `hollow_swoop` | `hollow-swoop.webp` | 4 | 12 | left | 56 px | A stripped flyer, like the Hollow hound's sheet in hide, plates and cables: bat-like wings, plated skull, blank white eye, white core on the chest. 1 wings up, 2 level, 3 down, 4 level |
| 6 | `silt_hound_run` | `silt-hound-run.webp` | 6 | 13 | right | 150 px | Silt riding low on the hound (`silt-sheet-v1.png`, `hollow-hound-sheet-v1.png`), a full gallop |
| 6 | `silt_hound_crouch` | `silt-hound-crouch.webp` | 1 | - | right | 150 px | Haunches down, about to spring, Silt leaning forward |
| 6 | `silt_hound_leap` | `silt-hound-leap.webp` | 1 | - | right | 150 px | Stretched out flat in mid-lunge, legs reaching fore and aft |
| 6 | `silt_hound_rear` | `silt-hound-rear.webp` | 1 | - | right (the game flips it) | 150 px | Reared up on the hind legs, chest plates parted, **white core bare and blazing**, Silt clinging on. The core must sit about 96/150 of the way up the height and just in front of the hound's middle, or `coreAlt` and `coreOffset` in `tuning.js` move to match |
| 6 | `silt_hound_yelp` | `silt-hound-yelp.webp` | 1 | - | right (flipped) | 150 px | Hit: head thrown back, core flaring, legs buckling |
| 6 | `silt_hound_down` | `silt-hound-down.webp` | 1 | - | right (flipped) | 150 px | Collapsed on its side, core dark. **No Silt in this one**: he's thrown clear and drawn separately in code |
| 7 | `barricade_low` | `barricade-low.webp` | 1 | - | - | 36 px | A sawhorse with a hazard-striped board and sandbags. Waist high at most |
| 7 | `barricade_tall` | `barricade-tall.webp` | 1 | - | - | 132 px | Stacked steel plates with spikes on top, hazard stripes, the Sever mark (a bar cutting a ring). 1.5 times Kaito's height |

## Ready to paste into `art/sprites.js`
Change `feet`, `fill` and `cx` to the measured numbers. `fill` and `feet` below are starting guesses.
```js
window.DRIFT_SPRITES = {
  kaito_run:   { src: 'art/kaito-run.webp',   frames: 6, cols: 6, fps: 12, feet: 0.96, cx: 0.5, fill: 0.9 },
  kaito_jump:  { src: 'art/kaito-jump.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.9 },
  kaito_surge: { src: 'art/kaito-surge.webp', frames: 1, feet: 0.96, cx: 0.5, fill: 0.9 },
  kaito_hurt:  { src: 'art/kaito-hurt.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.9 },
  skarn_glide: { src: 'art/skarn-glide.webp', frames: 4, cols: 4, fps: 9, feet: 0.8, cx: 0.5, fill: 0.7 },
  trooper_run: { src: 'art/trooper-run.webp', frames: 6, cols: 6, fps: 12, feet: 0.96, cx: 0.5, fill: 0.9 },
  hollow_swoop: { src: 'art/hollow-swoop.webp', frames: 4, cols: 4, fps: 12, feet: 0.8, cx: 0.5, fill: 0.7 },
  silt_hound_run:    { src: 'art/silt-hound-run.webp',    frames: 6, cols: 6, fps: 13, feet: 0.97, cx: 0.5, fill: 0.95 },
  silt_hound_crouch: { src: 'art/silt-hound-crouch.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  silt_hound_leap:   { src: 'art/silt-hound-leap.webp',   frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  silt_hound_rear:   { src: 'art/silt-hound-rear.webp',   frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  silt_hound_yelp:   { src: 'art/silt-hound-yelp.webp',   frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  silt_hound_down:   { src: 'art/silt-hound-down.webp',   frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  barricade_low:  { src: 'art/barricade-low.webp',  frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  barricade_tall: { src: 'art/barricade-tall.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
};
```

## What stays in code, whatever pictures arrive
The arm in the corner (it has to show the scars climbing), the road, sky and Pinhold background, Silt's cables, the lightning, the pals (drawn by `shared/pals.js`, and only a Monster Book matter). With a picture on, Kaito's numb arm doesn't hang limp (that's a code pose); the numb state still shows in the corner arm, the dimmed fin and the picture's blue cast. There's no picture of him lying down: `kaito_hurt` is laid flat for that beat.
