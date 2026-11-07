# Split Light: pictures the game can use

**Made so far (2026-11-06):** all 9 keys in the list below, first takes, in `art/sprites.js`. Raw takes in `art/raw/`, the prompts word for word in `art/prompts/`, keyed with `tools/key-sprite.js` (the rooms only converted to WebP, no keying). The homepage card `art/site/glassward-v1-web.webp` is the title picture (`titleArt` in `game.js`). Without these files the game falls back as before: Ione to her homepage portrait, Vasch and Prism to code.

**How the windows differ from the list below:** the game draws each bust as a whole square and clips it, so `fill` and `feet` stay 1. Ione's square is `ph / 0.97` (at most the window's width), so her neck and the code-drawn top show in the shorter boss window too. Vasch's is `ph / 0.87`, so the ring on his chest stays in view. The two neck growths are painted on Ione's picture, so `NECK_PIC` (the positions used with the picture on, in `art-people.js`) leaves its first two empty. `ione_bust` is back on take 1 (`ione-bust.webp`, shorter neck, see `NOTES.md`); take 2 stays in this folder. A take 3 is wanted: see NEEDS PICTURE in `NOTES.md`.

**Update, the same day:** take 3 exists and is in use (`ione-bust-v3.webp`, her top in the picture, the code top removed). Ione's square is now `ph / 0.9`, moved up by a tenth of its size to cut the space over her hair, and `NECK_PIC` fits take 3. This replaces the Ione details in the paragraph above; `NOTES.md` has the rest.

Every picture is optional. The game looks for these keys first; a missing or broken picture falls back without a sound (tested: `test/play-checks.js`). To switch one on: save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

Locked sheets: `ione-sheet-v11.png`, `prism-sheet-v3.png`, `vasch-sheet-v4.png` (in `C:\Users\Dylan\Documents\driftbound-villains\art\refs\`), style block in `STYLE.md` there.

## How a strip must be made
- Equal frames on a **transparent background**, WebP or PNG, keyed with `tools/key-sprite.js` as Storm Run's were. The image tool can't go wider than 3:1, so 4 frames are made as a grid (2 columns, 2 rows, `cols: 2`).
- About 512 px per frame is plenty. These are drawn small: 100 to 130 px wide on a phone, twice that in real pixels.
- Same framing in every frame, so a strip doesn't jump. No nudity, nothing sexualised, no sexualised camera framing. Adult faces.

## The list
Priority: 1 changes the look most. Keys are exact.

| # | Key | File | Frames | fps | On screen | Each frame shows |
|---|---|---|---|---|---|---|
| 1 | `vasch_bust` | `vasch-bust.webp` | 2 | - | window 108 wide x 96 tall, bottom right beside FIRE, on the boss only | Head and shoulders, front on, per `vasch-sheet-v4.png`: combed-back grey hair, pale grey eyes, the white stand collar, black bar through a black ring on the chest, all inside the frame. **1** calm, tiny closed-mouth smile. **2** the same, smile thinner, one strand of hair out of place (shown once the core in his arm has been hit). No arm in the picture: the glass arm is drawn by the game underneath |
| 2 | `prism_top` | `prism-top.webp` | 4 | 8 | about 58 px long, on her perch cell, **turned to face any of four ways by the game** | Prism **from directly above, facing up the picture**, per `prism-sheet-v3.png`: faceted blue eyes, feather antennae forward, blade forearms folded forward, wings folded back along the body with rainbow rims, thin legs out to the sides. The sheet has no top view, so check parts and colours against it. Frames differ only in the rainbow shimmering along the wing rims, and a very slight antenna sway |
| 2 | `prism_fire` | `prism-fire.webp` | 1 | - | about 58 px long, as above | The same view, wings flared out to both sides, forearms raised, a white flash at the head. Shown for the moment the beam leaves |
| 3 | `ione_bust` | `ione-bust.webp` | 3 | - | window 108 wide x about 100 tall, bottom left | Same framing as `art/site/crew/ione-v2-small.webp` (head and shoulders, front on, square), per `ione-sheet-v11.png`. **1** calm. **2** focused, chin down, looking along the beam (while it flies). **3** teeth gritted, eyes narrowed (a growth just came up). **Only the two small base growths on the neck**: the game draws the rest over the picture, along the side of her neck under the jaw. If a new picture's neck sits somewhere else, change `NECK_PIC` in `art-people.js` |
| 4 | `room_0` to `room_4` | `room-0.webp` to `room-4.webp` | 1 each | - | fills the whole screen behind the board; the board covers most of the middle | Inside the Glass Ward, square, 1024 x 1024, in the show's style. Low contrast and dark enough that pieces read on top; the bottom third nearly black under the buttons. No people. **0** The Intake: broken dome, storm dusk through the panes, dead vats. **1** The Nursery: crystal overgrowing everything, cold blue. **2** The Split Ward: rainbows across the walls. **3** The Director's Wing: clean, white and wrong. **4** His office: dark, one white core glowing behind glass |

## Ready to paste into `art/sprites.js`
`fill` and `feet` are starting guesses: measure them, as `art/REQUEST.md` in Storm Run says.
```js
window.DRIFT_SPRITES = {
  vasch_bust: { src: 'art/vasch-bust.webp', frames: 2, cols: 2, feet: 1, cx: 0.5, fill: 1 },
  prism_top:  { src: 'art/prism-top.webp', frames: 4, cols: 2, fps: 8, feet: 0.97, cx: 0.5, fill: 0.95 },
  prism_fire: { src: 'art/prism-fire.webp', frames: 1, feet: 0.97, cx: 0.5, fill: 0.95 },
  ione_bust:  { src: 'art/ione-bust.webp', frames: 3, cols: 3, feet: 1, cx: 0.5, fill: 1 },
  room_0: { src: 'art/room-0.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_1: { src: 'art/room-1.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_2: { src: 'art/room-2.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_3: { src: 'art/room-3.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_4: { src: 'art/room-4.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
};
```

## What stays in code, whatever pictures arrive
The pieces on the board (crystals, splitters, growths, plates, cores, rails, perches), because a crystal's lean and a core's open side are the rules and have to read exactly. The beam. Ione's arm strip and the crystals on her neck, because they show the bond cost as it stands. Vasch's glass arm, because it cracks as his core takes hits. The pals (drawn by `shared/pals.js`).
