# Driftbound reference sheet style (locked 2026-10-30)

Set by the build step 2 style test. Dylan passed `kaito-sheet-v8.png` and `skarn-sheet-v3.png`; every later sheet matches them. Use the blocks below word for word in every generation prompt. Full history: `docs/DECISIONS.md`; prompts for every take: `art/refs/prompts/`.

## Locked sheets
| Who | File | Notes |
|---|---|---|
| Kaito Brask | `kaito-sheet-v8.png` | Take 7 plus the left-side eyebrow scar painted in by hand |
| Skarn | `skarn-sheet-v3.png` | Tail shows in the side views only (back view missed 3 times; Dylan accepted) |
| Juno Calloway | `juno-sheet-v5.png` | Mark below the right collarbone; no rifle or bandolier (removed from her design by Dylan) |
| Ashka | `ashka-sheet-v1.png` | Wings folded; tail plumes in all four views; yellow eyes and head crest are the model's additions |
| Sela Vey | `sela-sheet-v5.png` | Round whirlpool mark below the left collarbone (replaced the spiral wave, which read as a 2); jacket buttoned once under the high collar |
| Vesh | `vesh-sheet-v1.png` | Head raised over a coil, no legs; pose line swapped for this sheet only; horns are the model's addition |
| Silas Moreau | `silas-sheet-v4.png` | Take 3 with the front-view right eye painted by hand (mirrored from the clean left eye); feather marks read a little like petals; boots chunkier than "soft boots" |
| Hush | `hush-sheet-v2.png` | Wings folded; owl beak, lynx ear tufts and bobtail; back-view ears fixed by one edit |
| Bram Torvald | `bram-sheet-v3.png` | Left strap down; back bib buckled to the right strap, sagging on the left; dungarees read as canvas rather than leather |
| Grist | `grist-sheet-v2.png` | No tail (pose phrase swapped for this sheet); text-like squiggle on the front-view horn painted out by hand |
| Dr. Ione Raske | `ione-sheet-v11.png` | Coat on her shoulders; cropped V-neck; wrist mark reads as a broken zigzag rather than a clear cracked hexagon (accepted by Dylan); finger lines softened and eyes greyed by hand |
| Prism | `prism-sheet-v3.png` | Four walking legs; blades uncrossed on either side of the chest; wings folded; tail phrase swapped for a long abdomen |

## Style block (copy exactly)
> 2000s TV-anime cel-shaded style: clean black ink lines, flat cel shading with one shadow tone, slightly muted early-2000s colours.

## Background block (copy exactly)
> Plain flat mid-grey background. No floor, no cast shadows, no text, no labels, no numbers, no logos, no symbols, no emblems.

## Layout block, people (copy exactly)
> Four full-body views of the same person in one row, same scale, evenly spaced, not overlapping, feet on the same baseline, head tops level:
> (1) FRONT view, facing the viewer.
> (2) LEFT SIDE view: a true 90-degree profile facing the LEFT edge of the image, so their LEFT arm and LEFT side are nearest us.
> (3) RIGHT SIDE view: a true 90-degree profile facing the RIGHT edge of the image, so their RIGHT arm and RIGHT side are nearest us.
> (4) BACK view, seen from directly behind.
> In both side views the legs are in line: the far leg sits directly behind the near leg, so the far boot is mostly hidden. No three-quarter angles anywhere.
> Pose: A-POSE in every view: standing straight, feet about shoulder-width apart, arms straight and raised away from the body so each arm makes a 45-degree angle with the torso, hands out at hip height, a clear gap of grey background between each arm and the body. Neutral face, mouth closed.

## Layout block, creatures (copy exactly)
> Four full-body views of the same creature in one row, same scale, evenly spaced, not overlapping, all on the same baseline:
> (1) FRONT view, head-on, facing the viewer.
> (2) LEFT SIDE view: a true 90-degree profile facing the LEFT edge of the image.
> (3) RIGHT SIDE view: a true 90-degree profile facing the RIGHT edge of the image.
> (4) BACK view, seen from directly behind.
> In the side views the far legs sit directly behind the near legs and are mostly hidden. No three-quarter angles anywhere.
> Pose (neutral, for 3D modelling): standing square, legs straight and evenly spaced, head level facing ahead, mouth closed, tail held straight out behind.

Size: `--size 2048x1024` for every four-view sheet.

## Known fixes (failure → what worked)
1. **Marks or hair swap sides between views.** Name the character's own side AND where it lands on the image in each view (e.g. "his RIGHT side; in the BACK view on the RIGHT of the image").
2. **Arm scars climb past where they should stop.** Say "STOP AT THE ELBOW; the upper arm is clean skin in every view".
3. **A body mark reads as a letter.** Describe the shape plainly and add "it must not look like a letter or any written character".
4. **A-pose ignored** when asked in a fresh generation. An edit with "45-degree angle, hands at hip height, clear gap between arm and body" worked.
5. **Hair streak changes size between views.** Pin where it starts and ends, then say per view what shows (long / edge only / hidden).
6. **Faint lines read as extra scars** (Kaito's right-side forehead). Say "forehead and eyebrow are clean skin, no scar, line or crease" for the views that must stay clean.
7. **Tiny face details fade during edits** (eyebrow scar). After two misses, paint it by hand on a copy of the take and save it as a new take. Do crops and paint work under a short path (`%TEMP%\kcheck`): GDI+ fails to save on the long scratchpad path.
8. **"Sail-like fin" comes out as bare spines.** Say "a solid membrane stretched between the spines, like a sailfish's sail".
9. **Quadruped tail missing from the back view.** Failed 3 times (edit and fresh). Accept side views, or ask Dylan before trying again.
10. **Edits that ask for many changes drift.** Fix one or two things per edit and list everything that must stay identical.
11. **Edits sometimes return an almost unchanged picture.** Compare against the previous take before calling it fixed.
12. **Props slung across the body (rifle on a strap, bandolier) come out floating or tangled** (Juno takes 1–3). Dylan removed them from her design. Keep big slung props off body sheets; give them their own prop sheet if needed. Removing items edits cleanly in one pass (Juno take 4).
13. **A braid over one shoulder drifts in the side views.** Say per view: on the braid's side it falls straight down in front of the shoulder, ending in one tail under one tie; on the far side it is hidden. Otherwise it wraps behind the neck or splits into two tails.
14. **A detail on one sleeve gets copied onto both** (bomber pocket). Name the one sleeve, and say the other sleeve is plain in the view where it is nearest.
15. **Clothing can cover a bond mark.** Before the first take, check the outfit against where the mark sits (Juno's shoulder mark vs. her jacket). Dylan's fix there: move the mark to bare skin (below the collarbone, inside the open jacket).
16. **The requested size is not always honoured** (Sela take 1 came out 1774x887). Read the pixel size of every take; an edit of it with `--size 2048x1024` came back at the right size.
17. **A curl with a tail reads as the number 2, and edits keep copying an existing mark** (Sela takes 1-3, even after the shape was renamed). Give marks a closed, round outline with no tail. To replace a stuck mark: one edit that removes it completely, then a second edit that adds the new shape on clean skin (Sela takes 4-5).
18. **A smudged eye in the front view survives edits** (Silas takes 1-3: a grey smudge and a hair lock over one eye; the third edit came back almost unchanged). Paint it by hand: mirror the clean eye across the face's centre line with a soft oval blend, masking out any one-sided mark like a beauty mark (Silas take 4).
19. **Back views can show the insides of the ears**, as if they face backwards (Hush take 1). One edit that names the back view only and says "we see the backs of both ears; the pale inner ear is not visible" fixed it (Hush take 2).
20. **Overalls with one strap down come out wrong in the back view** (Bram take 1: a wide diagonal panel instead of a strap; take 2: straps but no back bib). Describe the back bib panel, which corner is hooked to the strap with a buckle, and which corner sags with the loose strap hanging from it (Bram take 3).
21. **Tiny text-like squiggles can appear on flat surfaces** (Grist's horn top). Zoom in on flat faces in every view; a small one paints out cleanly by blending the colours just above and below.
22. **Back-view hands can read as front views** (Ione takes 3-9). Dylan's standard is Sela's back-view hands: "easily distinguished that we are looking at them from behind". Pass `sela-sheet-v5.png` as the hand guide and describe it: one smooth back of the hand, fingers together, short thumb behind the hand on the inner side. Do not spread the fingers or move the thumb to the outer edge (take 7). Zoom in on the back-view hands of every person sheet before showing Dylan.
23. **Asking for cracks can overshoot** (Ione take 6: a hexagon became zigzags that differ per view). Ask for "two thin cracks, the outline stays whole", and zoom in on marks for their described damage, not only their side and place.
24. **Edits can drift colours they were told to keep** (Ione's grey eyes went blue in take 8). Compare eye colour after every edit. Taking the blue out by hand worked.
25. **Never add a pose detail nobody asked for** (the prompt said Prism's blades "crossed"; Dylan rejected it). Keep limbs on their own side unless the design says otherwise.
26. **`codex-imagegen` sometimes hangs until its time limit** (5 timeouts on this step, with no file saved). Use `--timeout 1200`, run it in the background, and retry the same prompt on Dylan's yes; every timed-out edit here worked on a later try, apart from a shorter prompt that also hung.
