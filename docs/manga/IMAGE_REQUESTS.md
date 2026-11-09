# Pictures to make: the request list (v1, 2026-11-07)

Dylan: "For images that we need to create make a separate document that I can tell you reference what we need to make during the week to generate so we don't hit the chat gpt image gen limits. Make sure styles and characters are consistent across everything."

This is the hand-ordered list. The complete, generated list of every cover, splash and spread with its art note is `docs/manga/IMAGE_LIST_GENERATED.md` (rebuild it with `node tools/manga-image-list.js`). The reader shows a picture as soon as its key is added to `manga/art/manifest.js`, so pictures can land one at a time in any order.

## The rules that keep everything consistent (read before any batch)
1. **One style, everywhere.** Every prompt uses the locked style block from `art/refs/STYLE.md` word for word: "2000s TV-anime cel-shaded style: clean black ink lines, flat cel shading with one shadow tone, slightly muted early-2000s colours." The games, the site, the manga and the anime stills all share it. The manga is drawn in **colour** in this style, not black-and-white screentone, unless Dylan decides otherwise (decision 1 below).
2. **One sheet per character, and it is attached to every prompt that shows them.** The locked sheets are listed in `art/refs/STYLE.md`; a character with no locked sheet is not drawn in a panel until the sheet exists and Dylan has passed it. That is why the sheets come first below.
3. **Looks come from `docs/CAST.md`** (and `docs/manga/CANON.md` for everyone the cast file doesn't cover). A panel's art note never overrides a sheet: if an issue's note says something the sheet contradicts, the sheet wins and the note gets fixed.
4. **Hard rules in every prompt** (`docs/WORLD_BIBLE.md`): adults only, adult faces and bodies; no nudity, no sexualized posing or framing; nothing copied from real anime; no Pokémon-like designs. Bath and towel scenes are drawn shoulders-up with heavy steam, exactly as the art notes say.
5. **Known fixes** (`STYLE.md`, 26 of them) apply to every image, not only sheets: name sides per view, pin marks to bare skin, check pixel size, one or two changes per edit, compare against the previous take.
6. **Every take is kept**; a replacement is a new version number, never an overwrite. Files: sheets in `art/refs/`, manga pictures in `manga/art/` named by their key (`i01-cover.webp`, `i01-p03-2.webp`), site pictures in `art/site/`.
7. **Claude checks every picture against its sheet before Dylan sees it**, zoomed in on faces, hands, marks and text, and redoes failures on Dylan's yes.

## Budget
ChatGPT image generation has a rolling limit; the sheets so far cost about 3 to 5 messages each with redos (56 images for 16 sheets, plus timeouts). Dylan sets the number per day here: **15 images a day** (Dylan, 2026-11-07). Each batch below says how many it needs; Claude asks before each batch (what it makes, rough count, usage left) and stops when the day's number is reached, unless Dylan says to finish the batch. The `driftbound-images` skill (`.claude/skills/driftbound-images/SKILL.md`) runs every batch: self-review against `art/refs/REVIEW_CHECKLIST.md`, up to 3 automatic redos, then the review page (`art/review/REVIEW_PAGE.md`) and one approval card per picture.

## Order of work (each batch asks first)

### Batch A: sheets the first ten issues need (about 14 sheets, 40 to 60 images with redos)
These people appear in Issues 1 to 10 and have no sheet. Use the people layout block for humans and the creature block for monsters; one sheet per subject.
| Subject | Who | Needed from | Notes for the prompt | Status |
|---|---|---|---|---|
| Warden Krell | 41, 195 cm, heavy trooper officer (`docs/FRIDAY_BATCH.md`, `shared/kit/cast.js`) | Issue 6 | Already has game sprites (`games/hot-hand/art/`), so match them: open-faced helmet, heavier coat, shield line officer | Done: `krell-sheet-v3.png` (2026-11-08) |
| Nim Hadda | 30, one-armed bookmaker, Burnt Penny | Issue 6 | Left arm missing below the shoulder; sleeve pinned; gentle face | Done: `nim-sheet-v2.png` (2026-11-08) |
| Lazare Quint | 61, Cinder Palace owner | Issue 7 | Walk-on with lines on three pages; a head-and-shoulders bust is enough | Done: full sheet `quint-sheet-v3.png` (2026-11-08) |
| Fenn the dealer | 51 | Issue 8 | Bust | Done: full sheet `fenn-sheet-v1.png` (2026-11-08) |
| Hob Tarrow and Marta Oake | 68 and 61, Pinhold farmer and neighbour | Issue 3 | Busts; plain clothes; the plough-beast Thimble becomes a Hollow (see creatures) | Done: `hob-sheet-v2.png`, `marta-sheet-v1.png` (2026-11-08); one farmer (Dylan), Issue 1-2 scripts not yet renamed |
| Mr. Tull | Vasch's aide | Issue 5 | Bust; age to be set in the register | Done: `tull-sheet-v1.png`, age 27 from `issue-05.js` (2026-11-08) |
| Thimble (plough-beast, then Hollow) | a heavy farm beast | Issue 3 | Two states: alive, then Hollow with plates, cables and a white core, drawn like the bear and hound | Done: `thimble-sheet-v1.png`, `thimble-hollow-sheet-v2.png` (2026-11-08) |
| Part One Kaito, battle-damaged | scars to the elbow, then past it | Issues 2, 12 | Not a new sheet: an **expression and damage sheet** for Kaito, eight faces plus the arm at three scar stages | Not started |
| Expression sheets, the six leads | eight faces each: neutral, grin, shout, blush, fear, grief, smug, gag face | Issue 1 on | Adult faces only; gag faces exaggerated, never chibi | Not started |
| The Gullwake | the ship, four views plus a deck plan | Issue 2 | The tide-gap sprite (`games/tide-gap/art/gullwake.webp`) is the start; the dossier `backstory/world.md` has the deck-by-deck description | Done: `gullwake-sheet-v3.png`, deck plan `gullwake-deck-v2.png` (2026-11-08) |
| Pinhold, Ashmarket, Gaptooth Reach | establishing shots for the manga (wide, dusk, night) | Issues 1, 6, 11 | The site already has one picture of each (`art/site/*-v1.png`); the manga needs an interior or two per island, listed in the generated file's spreads | Not started |

### Batch A2: face sets and three-quarter body sheets (added 2026-11-08, Dylan's answers in DECISIONS.md)
- **Face sets.** Six leads: head turnaround plus two expression pages at three angles (7 pictures each; Kaito done). Vasch, Hekka, Krell, Nim: the same. Silt and the walk-ons (Quint, Fenn, Hob, Marta, Tull): head turnaround only. Partners and Hollows: head turnaround. Troopers: none. Prompts from `tools/face-prompts.py`.
- **Three-quarter body sheets.** A second full-body sheet for every locked sheet, people, creatures and the ship: three-quarter front-left, front-right, back-left, back-right. Kaito first as the layout test.
- **Status:** Kaito's face set done (2026-11-08); the other five leads' head turnarounds running.

### Batch B: the first issue, all of it (about 120 panels; the proof of the pipeline)
Issue 1 has 120 panels and 29 pages. Draw it completely, in order, cover first, from the art notes in `manga/issues/issue-01.js` with the sheets attached. This proves the style holds across a whole issue, settles the balloon lettering look, and gives Dylan one finished issue to judge before anything else is drawn. Count: 1 cover + 120 panels; with redos, budget 150.

### Batch C: covers for Issues 2 to 51 (50 images, budget 70)
Briefs are in the generated list. A cover is the one picture most people see; do all of them before more interior pages, so the shelf looks real.

### Batch D: sheets for the Regatta and Keelbreak arcs (about 16 sheets)
Otti Ferro (52) and her empty harness; Old Tam Reed (67); Tobias Quill (27) and Flint (sand kite-ray); Marisol Thane (35) and Gnash (coral hammerhead); Wren and Dove Aster (25, 27) and Pell (two-headed heron); Ledger Maro (52; game sprites exist in `games/silent-cut/art/`); the Ten Count officers (Deacon Sorrel 44, Doctor Pike 39, Lucan Ash 35, the Ostlers 31 and their stitched stags), Yevka Sorn (38). Looks from `docs/manga/backstory/allies.md` and `tencount.md` once the register has settled them. Hekka's lance and the bond-cutter get a prop sheet.

### Batch E: splash pages and spreads, Issues 2 to 51 (129 images, budget 170)
The big single-image pages: listed with their art notes in the generated file. Each is the emotional peak of its issue and carries the shelf's "preview" feel even while the small panels stay placeholders.

### Batch F: Part Two looks and the remaining sheets
The six leads two years older (the looks are fixed in `SERIES_BIBLE.md`, top of Arc 9), Mother Kell (71), Oren Brask (54), Sable Oriel (28), Regent Emeric Hale (63), the 12 pals (currently code-drawn on the site; `shared/pals.js` has each one's look), and any approved new crew (Petra and Alum, Reuben and his partner: `NEW_CREW_PROPOSALS.md`).

### Batch G: the rest of the panels, issue by issue (about 4,600 panels)
In reading order, Issue 2 onward. At 100 to 120 panels an issue this is the long tail; it goes at whatever daily number Dylan sets, and the reader shows each picture as it lands. The anime stills for Episode 1 come from Issue 1's finished panels, so the first motion comic needs no new pictures beyond Batch B.

## Decisions for Dylan
1. Colour or black-and-white manga? (Everything else on the site is colour; the shelf and reader can show either.)
2. The daily image number for the budget line above.
3. Whether Batch B (all of Issue 1) comes before Batch C (every cover), or the covers first so the shelf fills up sooner.
4. Lettering: hand-lettered balloons baked into the pictures, or the reader's own balloons over art with no text (the reader already draws balloons; keeping text out of the pictures means a line can be fixed without redrawing). Recommended: pictures with no text.

### Your words (2026-11-07)
1. Colour or black-and-white: "Colour (Recommended)"
2. Images per day: "15 a day (Recommended)"
3. Issue 1 or covers first: "Issue 1 first (Recommended)"
4. Lettering: "No text, reader balloons (Recommended)"
