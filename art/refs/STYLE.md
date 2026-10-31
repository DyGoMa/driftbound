# Driftbound reference sheet style (locked 2026-10-30)

Set by the build step 2 style test. Dylan passed `kaito-sheet-v8.png` and `skarn-sheet-v3.png`; every later sheet matches them. Use the blocks below word for word in every generation prompt. Full history: `docs/DECISIONS.md`; prompts for every take: `art/refs/prompts/`.

## Locked sheets
| Who | File | Notes |
|---|---|---|
| Kaito Brask | `kaito-sheet-v8.png` | Take 7 plus the left-side eyebrow scar painted in by hand |
| Skarn | `skarn-sheet-v3.png` | Tail shows in the side views only (back view missed 3 times; Dylan accepted) |

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
