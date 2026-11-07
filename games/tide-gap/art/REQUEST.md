# Tide Gap: pictures the game can use

**Made so far (2026-11-06): all 12 keys below.** Raw takes in `art/raw/`, the prompts word for word in `art/prompts/`, keyed with `tools/key-sprite.js`; measured numbers in `art/sprites.js`. Takes in use: `sela-bow-v1`, `sela-read-v3` (v1 and v2 kept), `sela-empty-v2` (v1 kept), `sela-surge-v1`, `sela-hurt-v1`, `vesh-head-v1`, `gullwake-v1`, `hekka-stand-v1`, `hekka-throw-v1`, `hekka-hurt-v1`, `cutter-v1`. `hekka_talk` is cut from the front view of `hekka-sheet-v6.png`, not a new drawing, on the sheet's grey.

**Second pass (2026-11-06), which replaces the takes named above for these keys:** `hekka_stand` uses `hekka-stand-v3` (v2 plus a hand colour fix), `hekka_throw` uses `hekka-throw-v4` (v2 plus a hand colour fix), `hekka_talk` is `hekka-talk-v2.webp` (same cut, grey taken out), and `sela_talk` is new, this game only, from `sela-talk-v2`. Details in `NOTES.md`.

**Known flaws, all accepted for now:** the Sela and Hekka strips came out closer to a level back or front view than the "high up" camera asked for (the lean shows least at 36 to 40 px). Sela's spyglass in `sela_bow` points to the right, not ahead. `sela_read` holds the book up at shoulder height, where v2's lower book was nearly hidden. The cutter's deck is plain, on purpose, and there's a small funnel shadow. Hekka's feet shift about 1 px between the two throw frames. `hekka_throw` came back larger than asked (1774x887).

Every picture is optional: the game looks for these keys first, and a missing or broken picture falls back to code without a sound. To switch one on, save the file in this folder and add its line to `art/sprites.js`. Nothing else needs changing.

Locked sheets: `sela-sheet-v5.png`, `vesh-sheet-v1.png`, `hekka-sheet-v6.png`, in `C:\Users\Dylan\Documents\driftbound-villains\art\refs\`, with `STYLE.md` there.

**Fourth review (2026-11-06):** Sela is now drawn 46 px tall and Hekka 51 (`selaH`, `hekkaH` in `tuning.js`), not the 36 and 40 in the table below. Wanted, not made: `hekka_stand`, `hekka_throw` and `hekka_hurt` again at the sheet's proportions. The current ones read about 1 head to 5.5 bodies against about 1 to 7.5 on `hekka-sheet-v6.png` and in Hold the Deck's `hekka-front.webp`, by eye. Keep the old files as they are.

**Made (2026-11-06, after the fourth review):** `hekka_stand`, `hekka_throw`, `hekka_hurt` at the sheet's proportions, and `sela_empty` with a bigger book: `hekka-stand-v3.webp`, `hekka-throw-v3.webp`, `hekka-hurt-v2.webp`, `sela-empty-v3.webp`. Old files kept. Takes and flaws in `NOTES.md`. These Hekka pictures use a camera only a little above her, not the "high up" one below, because that view is what shortened her legs.

## How a strip must be made
- Equal frames on a **transparent background**, WebP or PNG. The image tool can't go wider than 3:1 and has no real transparency, so make wide strips as a grid, on flat `#00FF00`, and put them through `tools/key-sprite.js` (same way as `games/storm-run/art/`).
- About 512 px tall per frame is plenty.
- **The camera is unusual here: high up and behind, looking down the channel, the way a helmsman on a mast would see it.** People are small and seen from above and behind or above and in front. Not a side view. The hull and Vesh's head point **up the picture**; the cutter's bow points **down the picture**.
- Every frame: same size, feet on the same line, so the strip doesn't jitter. Measure `feet`, `fill` and `cx` and put them in the entry.
- Adult proportions and faces. No nudity, no sexualised posing or framing: Sela's bare midriff and slit skirt and Hekka's open midriff are as on their sheets and no more, and nothing is framed on them.

## The list
Priority: 1 changes the look most. Keys are exact. "On screen" is the height the game draws it, in game pixels (about twice that on a phone).

| # | Key | File | Frames | fps | Faces | On screen | Each frame shows |
|---|---|---|---|---|---|---|---|
| 1 | `sela_bow` | `sela-bow.webp` | 4 | 6 | away from us, up the picture | 36 px | **Full or nearly full book (4 to 6 lines).** Sela standing at the bow, seen from above and behind: high silver-blue ponytail, navy cropped jacket, teal wrap skirt, strapped sandal-boots, brass spyglass raised in her right hand, book in its pouch on her left hip. Frames differ only in the ponytail and skirt blowing: 1 ponytail left, 2 centre, 3 right, 4 centre |
| 1 | `sela_read` | `sela-read.webp` | 4 | 6 | away | 36 px | **Thin book (1 to 3 lines).** Same view, head bent, both hands holding the worn logbook open in front of her. No spyglass in hand. Same ponytail frames |
| 1 | `sela_empty` | `sela-empty.webp` | 4 | 6 | away | 36 px | **Empty book (0 lines).** Same view, head low, shoulders down, the closed logbook hanging from her right hand at her side. Same ponytail frames |
| 1 | `sela_surge` | `sela-surge.webp` | 2 | 10 | away | 36 px | **The Dive.** Same view, both arms raised and spread, jacket and skirt blown upward, a faint teal glow. Frame 2 the glow brighter. Her mark is on her front, so it doesn't show here; the game draws the teal spiral and dome in code |
| 1 | `sela_hurt` | `sela-hurt.webp` | 1 | - | away | 36 px | **Knocked.** Same view, thrown sideways, one arm out for balance, ponytail flung across |
| 2 | `vesh_head` | `vesh-head.webp` | 4 | 8 | up the picture | 108 px | Vesh's head from directly above, per the back view of `vesh-sheet-v1.png`: long dark snout up, two teal eyes, four swept horns, the great spined frill spread out wide on both sides, gold lamps on stalks down the crown. Cut off clean at the neck, about 12 px wide. Frames: the frill slowly opening and closing. `cx` on the neck's middle. Its neck joins code at the point the game draws at (`feet`), so measure `feet` at the neck's cut end |
| 3 | `gullwake` | `gullwake.webp` | 1 | - | up the picture | 110 px | The Gullwake from above, a little from behind. Battered, patched wooden salvage ship, bow up: plank deck, iron patches, a winch at the bow where two chains run forward, crates, one mast with a furled patched sail across it, a small blue-roofed cabin at the stern, Grist asleep on the deck in front of the cabin (`grist-sheet-v2.png`). **No people aboard**: Sela is drawn on top. Keep a clear patch of deck behind the winch, about a third of the way down |
| 4 | `hekka_stand` | `hekka-stand.webp` | 2 | 3 | toward us, down the picture | 40 px | Hekka standing on her deck, seen from above and in front, per `hekka-sheet-v6.png`: thick wavy black hair, grey plates, white collar, black bar and white ring on the chest plate, bare midriff with the dull ring scar on her left side, dark trousers, grey shin plates. A bond-cutter lance taller than she is, white-glowing hooked tip, held upright in her right hand. Frame 2 a slight shift of weight |
| 4 | `hekka_throw` | `hekka-throw.webp` | 2 | 8 | toward us | 40 px | Same view: 1 lance arm back and up, 2 arm flung forward |
| 4 | `hekka_hurt` | `hekka-hurt.webp` | 1 | - | toward us | 40 px | Staggering, lance grounded to hold herself up, hair across her face |
| 5 | `cutter` | `cutter.webp` | 1 | - | bow down the picture | 210 px | Hekka's Sever cutter from above: a hard angular grey steel wedge, about 128 wide by 196 long at this size. White stripe across the deck, the Sever mark on the deck (a straight black bar cutting a white ring), bridge and funnel at the far end, racked pylons along each side, a harpoon gun on the bow. **No people, no glowing plates, no damage**: those are drawn on top in code. Keep the deck clear at these spots, from the cutter's middle: 34 left and 16 up, 34 right and 16 up, 40 straight down. `feet` at the bow's tip |
| 6 | `hekka_talk` | `hekka-talk.webp` | 1 | - | front | talk portrait, square | Head and shoulders from the front, cut from the front view of `hekka-sheet-v6.png` the way Silt's portrait was cut from his. Square, about 216 px. Not a new drawing if it can be avoided |

## Ready to paste into `art/sprites.js`
Change `feet`, `fill` and `cx` to the measured numbers. These are starting guesses.
```js
window.DRIFT_SPRITES = {
  sela_bow:   { src: 'art/sela-bow.webp',   frames: 4, cols: 2, fps: 6, feet: 0.96, cx: 0.5, fill: 0.9 },
  sela_read:  { src: 'art/sela-read.webp',  frames: 4, cols: 2, fps: 6, feet: 0.96, cx: 0.5, fill: 0.9 },
  sela_empty: { src: 'art/sela-empty.webp', frames: 4, cols: 2, fps: 6, feet: 0.96, cx: 0.5, fill: 0.9 },
  sela_surge: { src: 'art/sela-surge.webp', frames: 2, cols: 2, fps: 10, feet: 0.96, cx: 0.5, fill: 0.9 },
  sela_hurt:  { src: 'art/sela-hurt.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.9 },
  vesh_head:  { src: 'art/vesh-head.webp',  frames: 4, cols: 2, fps: 8, feet: 0.8, cx: 0.5, fill: 0.9 },
  gullwake:   { src: 'art/gullwake.webp',   frames: 1, feet: 0.96, cx: 0.5, fill: 0.96 },
  hekka_stand: { src: 'art/hekka-stand.webp', frames: 2, cols: 2, fps: 3, feet: 0.96, cx: 0.5, fill: 0.9 },
  hekka_throw: { src: 'art/hekka-throw.webp', frames: 2, cols: 2, fps: 8, feet: 0.96, cx: 0.5, fill: 0.9 },
  hekka_hurt:  { src: 'art/hekka-hurt.webp',  frames: 1, feet: 0.96, cx: 0.5, fill: 0.9 },
  cutter:     { src: 'art/cutter.webp',     frames: 1, feet: 0.98, cx: 0.5, fill: 0.96 },
  hekka_talk: { src: 'art/hekka-talk.webp', frames: 1 },
};
```

## What stays in code, whatever pictures arrive
The hit edges have to match what's drawn, and these move with the rules, so they stay code: **Vesh's body** (a ribbon through the head's path: he has to bend wherever you steer, with his lamps and fins on it), the tow chains and collar, the rocks and their waterfalls, the gold arrows and ghost edges, the logbook (real text that changes), the sea, cliffs, fog, rain, rip currents, lances and cables, pylon chains, boulders, the glowing plates and broken holes on the cutter, the wake, the teal dome on a Dive. The pals are drawn by `shared/pals.js`.
