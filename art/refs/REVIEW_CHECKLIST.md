# Picture review checklist (v1, 2026-11-08)

Every Driftbound picture is checked against this list, zoomed in, before Dylan sees it. It is built from the 36 known fixes in `art/refs/STYLE.md` and from what Dylan has said was wrong (his words are in `docs/DECISIONS.md`). The `driftbound-images` skill (`.claude/skills/driftbound-images/SKILL.md`) runs it.

**How to use it.** Make zoom crops with `tools/zoom-crops.ps1` (faces, hands, marks, props, back view). Go down the list. A **FAIL** line means redo; a **NOTE** line is reported but is not a redo on its own. Name the line number in every report ("fails 4: back-view hands").

**How it grows.** Whenever Dylan rejects or accepts something, add or change a line in "Dylan's calls" below, quoting him and the date, in the same turn. When a new failure is found and fixed, it also becomes a known fix in `STYLE.md`.

## A. Every picture
1. **FAIL** Pixel size is what was asked (`--size`). Read it from the file (fix 16). A sheet is 2048x1024.
2. **FAIL** No text, letters, numbers, labels, logos or stray symbols anywhere. Zoom on flat surfaces: horns, plates, caps, walls, sails (fix 21). A tweed or wood grain is fine if it does not read as writing.
3. **FAIL** Hard rules (`docs/WORLD_BIBLE.md`): adult faces and adult bodies; no nudity; no sexualized posing or framing; bath and towel scenes shoulders-up in heavy steam; nothing copied from a real anime or game; nothing Pokémon-like.
4. **FAIL** The locked style: clean black ink lines, flat cel shading with one shadow tone, slightly muted early-2000s colours. Not painterly, not 3D, not glossy.
5. **FAIL** Every character shown matches their locked sheet in the `STYLE.md` table (hair, eyes, skin, outfit, marks and their sides). The sheet wins over an art note.
6. **FAIL** The age reads right (Nim take 1 read mid-40s at 30 because "thinning" overshot to bald). Adjectives about hair loss, wrinkles or weight overshoot: use mild words and check the face.
7. **FAIL** Nothing was added that nobody asked for: no extra props, crossed limbs, poses or symbols (fix 25). Model additions that are harmless (a belt buckle, ear cups) are a NOTE.

## B. Sheets (four views)
8. **FAIL** Four true views in one row: FRONT, LEFT SIDE facing the left edge, RIGHT SIDE facing the right edge, BACK. No three-quarter views. Same scale, feet on one baseline.
9. **FAIL** Every one-sided detail (mark, scar, missing limb, pinned sleeve, blade, hair parting, chalk behind an ear) is on the right side in every view, as the prompt named it per view (fix 1).
10. **FAIL** A mark stays in ONE place on the body across views: the same height on the limb, on the same face of the limb (Hob take 1: "the mark doesnt read as being in the same spot from the different views, it moves"). It shows whole only in the views that face it and as a sliver or hidden in the others (fixes 27, 36).
11. **FAIL** Marks are the asked colour, size and shape, a closed outline with no tail, and do not read as a letter or number (fixes 3, 17, 23). Hob take 1's lime was wrong for "moss-green"; check the shade, not only "green".
12. **FAIL** Bare back-view hands read from behind: one smooth back of the hand, fingers together, thumb on the inner side (fix 22; Sela's sheet is the standard). See Dylan's call D1 for gloves.
13. **FAIL** Back of the head and ears seen from behind, not their insides (fix 19). Creature rumps carry no shape that reads as anatomy (fix 34).
14. **FAIL** Accessories are clean and symmetrical: glasses the same size both sides, not warped (Quint take 2: "they look weird and distorted").
15. **NOTE** A-pose at about 45 degrees with a gap at each arm. Narrower is a note, not a redo, when everything else passes (Krell take 1 passed at about 30 degrees).
16. **NOTE** Colours drifted after an edit (fix 24: eyes went blue). Compare the edit with the take it came from.
17. **FAIL** An edit changed only what it was asked to change (fixes 10, 11). Compare per view with the earlier take.

18b. **FAIL** Repeated parts match across every view: the same count, height, angle and place for yards, sails, masts, plates, straps and patches (Gullwake take 2: "the masts that hold the sails that are rolled up display differently in each view ... also match the red patch to the same spot on all views"). A ship's yards sit square across the ship, at right angles to the keel, ready for the sail to drop: full width in the bow and stern views and the deck plan, end-on in the side views.

## C. Creatures
18. **FAIL** Hollows are monsters, not pets: heavy head, menace, plates, cables, blank white eyes, a white core where the bond was; the bear is the house line for how a Hollow is drawn (fix 32).
19. **NOTE** Back-view tail: end-on works (fix 33); a missing back-view tail is accepted (fix 9).

## D. Manga pictures and other art
20. **FAIL** No text at all in panels and covers: the reader draws the balloons (Dylan, 2026-11-07: "No text, reader balloons").
21. **FAIL** Colour, not black-and-white (Dylan, 2026-11-07: "Colour").
22. **FAIL** The panel matches its art note in `manga/issues/issue-NN.js`, except where a sheet disagrees (the sheet wins; report the note to fix).
23. **FAIL** File named by its key (`i01-p03-2`) with a line in `manga/art/manifest.js`, and `node tools/manga-smoke.js` passes.

## Dylan's calls (judgement lines learned from his answers; newest last)
- **D1 (2026-11-07, 2026-11-08).** Gloved back-view hands with the thumb on the outer edge are fine. Krell: "second take hands look worse. take 1 looked fine."; Quint: "gloves are fine in this picture". Do not spend a redo on gloves alone; never edit hands that already read as hands. Bare hands still follow line 12.
- **D2 (2026-11-05).** Tiny face scars are not worth many takes: ask before trying (Hekka: "scar on the lip looks weird just remove it"; fix 29).
- **D3 (2026-11-05).** Hand paint-overs must not cross ink lines (Hekka: "her chin on the front view looks smudged"; fix 30).
- **D4 (2026-10-30).** Keep big slung props off body sheets (Juno's rifle and bandolier: "too complicated of a detail"; fix 12).
- **D5 (2026-11-08).** Glasses and similar small accessories: a clean simple shape beats an exact but warped one; if two edits fail, offer the simpler shape (Quint).
- **D6 (2026-11-08).** A mark must read as in one spot across views (Hob, line 10).
- **D7 (2026-11-08).** Ships and props are checked like characters: every repeated part the same in every view, and rigging that would really work (Gullwake yards and red patch). Line 18b.
- **D8 (2026-11-08).** Keep a prop only if it has a use in the story; say what it is for when asked (Gullwake deck screen: Issue 2's bath screen, kept). Dylan: "what is the canvas screen on the deck for? get rid of it if no legitimate use".
- **D9 (2026-11-08).** Every lead's expression sheets are compared cell by cell with Kaito's (`kaito-faces-v2.png` and his second sheet): the same TYPE of expression in the same cell. Intensity may differ per character (Ione's shout can be smaller than Kaito's), the kind of face may not. Pass Kaito's sheet as the expression guide in every lead's prompt. Dylan: "compare the others to this sheets expressions so they all get the same expressions and not something totally different. characters can have more or less extreme facial movements as long as its the same type of expression".
- **D10 (2026-11-09).** Framing matches across a set: every portrait in a head turnaround or expression page shows the shoulders the same way as the other leads' (Silas's 3/4 pages and head cut off at the neck: "why is silas missing his shoulders redo so its like the others"). Compare each new page's crop with an approved page.
- **D11 (2026-11-09).** One-eye expressions (pain wince, wink) shut the SAME eye of the character in every view; name it ("his LEFT eye shut") per angle in the prompt and check it zoomed. Dylan: "Pain all characters 3/4 views has eye opened/closed inconsistancies".
- **D12 (2026-11-09).** Hair that hangs in front of the body (Juno's braid over her left shoulder) still shows at the far three-quarter view, across the chest or at the shoulder; it is not hidden like a mark on the far side. Dylan: "Blush Juno, 3/4 right missing ponytail on shoulder".

