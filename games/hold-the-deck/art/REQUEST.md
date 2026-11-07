# Hold the Deck: pictures the game can use

**Made so far (2026-11-06):** all 20 keys below, wired in through `art/sprites.js`. Status: built, not yet seen running by Dylan. Raw takes in `art/raw/`, prompts word for word in `art/prompts/`. Takes used and their flaws are listed in `NOTES.md`, "The pictures". Every picture is optional: the game looks for these keys first, and a missing or broken one falls back to code without a sound. To switch one on, save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

**How these differ from the list below:** `grist_charge` is 2 columns, not 4, since the tool can't go wider than 3:1. `crate` keeps the stencilled word FLOUR the list asks for. The bear's core sits 0.45 of the way up on the picture, not 40/114: the sheet's own proportions put it there, so `HD.coreUp` in `bear-art.js` moved to match, as the list allows. Bram's strips were resettled with a throwaway script (feet on one line, centred on his boots) rather than `key-sprite.js --align`, whose band picks up his hammer; the keying is the same sums. `trooper_run_front` keeps the sheet's closed knee-length coat, not the "tied up or short" coat the list allows. `grist_sleep` is the awake picture with folded legs and a shut eye, horn upright. `bear_front` frames 1 and 2 have an angry face and the back of the paw, no palm pad. Beyond the list: `art/trooper-portrait.webp`, 216 px, the trooper's talk portrait, loaded by `portraits.js`. `art/hekka-portrait.webp`, 216 px, Hekka's talk portrait, a copy of Tide Gap's `hekka-talk-v2.webp`, also loaded by `portraits.js`.

Checked with stand-in pictures for all 20 keys in the list below: 20 of 20 load and all 20 get drawn in play (`NOTES.md`).

## Locked sheets to give the image tool
`C:\Users\Dylan\Documents\driftbound-villains\art\refs\`: `bram-sheet-v3.png`, `grist-sheet-v2.png`, `hollow-bear-sheet-v2.png`, `hekka-sheet-v6.png`, `trooper-sheet-v1.png`. Style block: `STYLE.md` in the same folder.

## How a strip must be made
- Equal frames on a **transparent background**. WebP or PNG. The image tool can't go wider than 3:1, so long strips are made as a grid and `cols` says how many across. It has no real transparency, so they're made on flat `#00FF00` and put through `tools/key-sprite.js`.
- About 512 px tall per frame is plenty. The biggest things on screen are the bear (290 px) and Grist (170 px), twice that on a phone.
- Every frame: the character the same size, feet on the same line, so a strip doesn't jitter. `feet` = where the feet sit down the frame (0 top, 1 bottom), `fill` = the share of the frame's height the character takes up, `cx` = where the middle is across the frame. Measure them and put them in the entry.
- Adult proportions and adult faces. No nudity, nothing sexualised, no posing for the camera. Hekka stands square and small in the distance.
- **Which way things face matters here, and it's not side-on:** the camera is in the galley door looking up the deck. Boarders and the bear walk **straight at the camera** (the sheets' front views). Bram and Grist's charge are **seen from directly behind** (the sheets' rear views), walking away from the camera. A 3/4 view won't line up with the lanes.

## The list
Priority 1 changes the look most. Keys are exact.

| # | Key | File | Frames | fps | On screen | Each frame shows |
|---|---|---|---|---|---|---|
| 1 | `bram_back_i0` | `bram-back-i0.webp` | 7 (cols 4) | - | 119 px | **Seen from directly behind**, per the rear view of `bram-sheet-v3.png`. Iron: the sheet's base state only, left shoulder and left forearm (on the left of the picture, seen from behind). 0 standing, feet apart, hammer in his right hand (right of the picture). 1 mid-step, one boot lifted. 2 hammer cocked out wide to his right at shoulder height. 3 hammer swept across at shoulder height to his left, follow-through, body turning. 4 **Iron**: braced, feet wide, forearms up in front of his head, skin and face all dull iron grey with orange heat cracks, no hammer. 5 hurt: thrown back, arms out. 6 down on both knees, head low, hands on the deck |
| 1 | `bram_back_i1` | `bram-back-i1.webp` | 7 (cols 4) | - | 119 px | The same seven, grey spread: whole left arm and shoulder, starting across the left shoulder blade. Shown from 25% to 49% iron |
| 1 | `bram_back_i2` | `bram-back-i2.webp` | 7 (cols 4) | - | 119 px | The same seven, grey spread: left arm, across the upper back to the spine, bursting through the left trouser leg. Shown from 50% to 79% |
| 1 | `bram_back_i3` | `bram-back-i3.webp` | 7 (cols 4) | - | 119 px | The same seven, grey nearly everywhere: both arms, whole back, both legs through the cloth, neck, patches on the skull. Same man, same dungarees and towel. Shown from 80% up |
| 2 | `bram_front_i0` to `bram_front_i3` | `bram-front-i0.webp` to `-i3.webp` | 2 each | - | 66 px on the body icon, 106 px on the title (i0) | **From the front**, per the sheet's front view, in the same four grades. Iron is on the **right of the picture** here (his left). Anvil mark glowing orange on his chest. 0 standing, hammer in hand. 1 Iron stance, all grey, orange cracks |
| 3 | `trooper_walk` | `trooper-walk.webp` | 5 (cols 3) | - | 50 to 100 px | **Straight at the camera**, per the front view of `trooper-sheet-v1.png`: visor, jaw showing, bar and ring on the chest, hooked blade in his right hand. 0 left boot forward. 1 feet passing. 2 right boot forward. 3 feet passing. 4 striking: blade raised, glowing white |
| 3 | `trooper_run_front` | `trooper-run-front.webp` | 5 (cols 3) | - | 50 to 100 px | The same man **sprinting** at the camera: coat tied up or short, leaning in, arms pumping, blade low. Frames as above |
| 3 | `trooper_shield` | `trooper-shield.webp` | 5 (cols 3) | - | 50 to 100 px | Walking at the camera behind a torn-off iron bulkhead plate held in both hands, chest to knee, riveted, with the Sever bar and ring. Helmet showing over it. Frames as above. When the plate breaks, the game uses `trooper_walk` |
| 3 | `trooper_cutter` | `trooper-cutter.webp` | 5 (cols 3) | - | 50 to 100 px | Walking at the camera with his right arm straight up, a glowing white hook on a line in that hand, the line looped in the other. Frames as above; in 4 the arm is coming forward to throw |
| 4 | `ram_front` | `ram-front.webp` | 5 (cols 3) | - | 54 to 110 px, about twice as wide as a man | **Head on**: an iron-capped timber ram with three spikes and the Sever mark, a trooper shoving on each side. Frames as above; in 4 they're straining |
| 4 | `crate` | `crate.webp` | 1 | - | 30 to 62 px | A wooden cargo crate seen from a little above, stencilled FLOUR, one diagonal brace |
| 5 | `grist_charge` | `grist-charge.webp` | 4 (cols 4) | 12 | 90 to 170 px | **From directly behind**, per the rear view of `grist-sheet-v2.png`: dome of riveted dark iron plates, top of the anvil horn just showing over it, six stubby clawed legs, rust. A gallop in four beats |
| 5 | `grist_sleep`, `grist_awake` | `grist-sleep.webp`, `grist-awake.webp` | 1 each | - | 43 px on his button, 60 px on the title | Facing right, per the sheet's side view. Sleep: head down, eye shut. Awake: horn up, eye blazing orange |
| 6 | `bear_front` | `bear-front.webp` | 6 (cols 3) | - | 150 to 290 px | **Straight at the camera**, per the front view of `hollow-bear-sheet-v2.png`: ash-grey fur, blank white eyes, brow plate, collar with a short chain end, shoulder plates, cables to the white core in its steel ring. 0 on all fours. 1 its foreleg on the left of the picture raised high, claws spread. 2 the other one raised. 3 roaring, head up, core blazing. 4 slumped forward, core blazing, nothing guarding it. 5 flat on the deck, core dark. **The core must sit 40/114 of the way up from the feet, in the middle**, in frames 0 to 4, or the numbers in `bear-art.js` move to match |
| 6 | `bear_paw` | `bear-paw.webp` | 1 | - | about 112 to 140 px | One foreleg bursting straight up through broken deck planks, claws open at the top, splinters round a dark hole. Hole at the bottom of the frame |
| 7 | `hekka_front` | `hekka-front.webp` | 1 | - | 60 px, far off | Per the front view of `hekka-sheet-v6.png`, standing square, holding her lance upright, taller than she is (CAST.md; the sheet leaves the lance for a prop sheet, so keep it plain: a pole with a hooked white blade). Standing there, arms down. No posing |

## Ready to paste into `art/sprites.js`
Change `feet`, `fill` and `cx` to the measured numbers. These are starting guesses.
```js
window.DRIFT_SPRITES = {
  bram_back_i0: { src: 'art/bram-back-i0.webp', frames: 7, cols: 4, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_back_i1: { src: 'art/bram-back-i1.webp', frames: 7, cols: 4, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_back_i2: { src: 'art/bram-back-i2.webp', frames: 7, cols: 4, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_back_i3: { src: 'art/bram-back-i3.webp', frames: 7, cols: 4, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_front_i0: { src: 'art/bram-front-i0.webp', frames: 2, cols: 2, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_front_i1: { src: 'art/bram-front-i1.webp', frames: 2, cols: 2, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_front_i2: { src: 'art/bram-front-i2.webp', frames: 2, cols: 2, feet: 0.97, cx: 0.5, fill: 0.92 },
  bram_front_i3: { src: 'art/bram-front-i3.webp', frames: 2, cols: 2, feet: 0.97, cx: 0.5, fill: 0.92 },
  trooper_walk: { src: 'art/trooper-walk.webp', frames: 5, cols: 3, feet: 0.97, cx: 0.5, fill: 0.92 },
  trooper_run_front: { src: 'art/trooper-run-front.webp', frames: 5, cols: 3, feet: 0.97, cx: 0.5, fill: 0.92 },
  trooper_shield: { src: 'art/trooper-shield.webp', frames: 5, cols: 3, feet: 0.97, cx: 0.5, fill: 0.92 },
  trooper_cutter: { src: 'art/trooper-cutter.webp', frames: 5, cols: 3, feet: 0.97, cx: 0.5, fill: 0.8 },
  ram_front: { src: 'art/ram-front.webp', frames: 5, cols: 3, feet: 0.97, cx: 0.5, fill: 0.7 },
  crate: { src: 'art/crate.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.9 },
  grist_charge: { src: 'art/grist-charge.webp', frames: 4, cols: 4, fps: 12, feet: 0.97, cx: 0.5, fill: 0.9 },
  grist_sleep: { src: 'art/grist-sleep.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.8 },
  grist_awake: { src: 'art/grist-awake.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.8 },
  bear_front: { src: 'art/bear-front.webp', frames: 6, cols: 3, feet: 0.97, cx: 0.5, fill: 0.92 },
  bear_paw: { src: 'art/bear-paw.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.92 },
  hekka_front: { src: 'art/hekka-front.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.92 },
};
```

## What stays in code, whatever pictures arrive
The deck, sky, cranes, rails, fire and rain (they carry the lanes and the gold line, and have to line up with the rules); the galley counter and all read-outs; every warning (lit lanes, plates, countdown band); hooks in the air; rakes of the claws; holes in the deck; the chain from the bear's collar; the pals (drawn by `shared/pals.js`).

## Why Bram is four strips, not one
The bond cost has to show on him (spec, and the Storm Run review). A code overlay on a picture won't follow his arms through a swing, so the picture itself carries the grey, in four grades. The body icon uses the same grades, so the two always agree. Between grades the icon's percentage still moves; a grade is only what's painted on him.
