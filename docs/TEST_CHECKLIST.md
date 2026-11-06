# Play-check list

Mark each line **works** or **broken (what happened)**. Only you mark things confirmed.

The v1 Hoshi Arcade lines moved word for word to `archive/v1-hoshi-arcade/docs/TEST_CHECKLIST.md`.

## Checked by Claude (automated, 2026-11-05, build step 3, phase 1)
- All new scripts pass a syntax check (`node --check`).
- Headless Chrome through Playwright, 73 checks passed: wording, No, mistake link, Yes, 30-day memory and expiry, direct game link, fresh save, old save left untouched, storage blocked, JavaScript off, five screen sizes with no sideways scroll, v1 still running from the archive when served locally, and double taps and stray keys never answering the gate (faults an independent review found and Claude fixed).
- Clicked through No, the mistake link and Yes by hand in a phone-size browser (375x812).
- Not checkable by Claude: a real phone, and whether the archive stays off the public site (needs the free link live).

## Waiting for your play-check (build step 3, phase 1)
| # | Try this | Expect | Result |
|---|---|---|---|
| G1 | Open the site on your phone for the first time | Only "DRIFTBOUND / Adults only. / Are you 18 or older?" with Yes and No; nothing behind it | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G2 | Tap **No** | "Driftbound is for adults. Come back when you're 18." and a small "I tapped by mistake" link | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G3 | Tap **I tapped by mistake** | The question comes back | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G4 | Tap **Yes** | The bare homepage: Salvage 0, Storm Run, and the other three sections marked coming soon | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G5 | Close the browser, reopen the site | Goes straight to the homepage, no question | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G6 | Open the Storm Run page's address directly in a private window | The question comes first | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G7 | Add `/archive/v1-hoshi-arcade/index.html` to the site's address | Page not found (the old game stays at the old link) | works (Dylan 2026-11-05, one answer for all of G1-G7) |

## Waiting for your play-check (build step 3, new homepage)
Checked by Claude in headless Chrome (2026-11-05): no sideways scroll and no errors at six sizes from 320 wide to 1920 wide; six crew cards and twelve book slots; no pictures load before Yes; screenshots looked at for phone and computer. Tests don't prove how it looks to you.

| # | Try this | Expect | Result |
|---|---|---|---|
| H1 | Open the homepage on your phone and scroll down | Kaito and Skarn banner, DRIFTBOUND title, Storm Run with the Pinhold picture, six crew cards, Visual novel and Videos marked coming soon, 12 mystery slots | |
| H2 | Tap each word in the top menu | The page jumps to that section, and the section title isn't hidden under the bar | |
| H3 | Check each crew card against what you know of them | Right face, name, age, role and partner | |
| H4 | Look at the banner | Kaito and Skarn look right to you; hand mark reads well enough | |
| H5 | Tap **Enter the Drift**, then the Storm Run card | Jumps to Games, then opens the stand-in page saying the game isn't built yet | |
| H6 | Open the site in a private window | The gate now uses the new navy and gold | |
| H7 | Open it on a computer too | Same sections, wider layout, nothing cut off | |

## Waiting for your check: reference sheets (build step 2, crew)
| # | Look at | Check | Result |
|---|---|---|---|
| R1 | `art/refs/juno-sheet-v5.png` | Mark on her upper chest below the right collarbone (left of the picture in front view); braid down in front of her left shoulder, hidden in the right-side view; jacket on both shoulders; burns at glove edges; no gun or ammo belt | passed by Dylan 2026-10-30 |
| R2 | `art/refs/ashka-sheet-v1.png` | Wings folded; glowing tail plumes in all four views (including the back); hooked beak closed; ember-red and black feathers with sparks | passed by Dylan 2026-10-30 |
| R3 | `art/refs/sela-sheet-v5.png` | Round teal whirlpool mark (no tail) just below her left collarbone, right of the picture in the front view, hidden in the right-side and back views; jacket buttoned once under the high collar with a low V; spyglass on her right hip, logbook pouch on her left hip; skirt slit on her left leg | passed by Dylan 2026-10-31 |
| R4 | `art/refs/vesh-sheet-v1.png` | No legs; head raised over a tight coil; glowing teal eyes; frilled jaw; paired side fins; gold lure ridge down the back; horns are the model's addition | passed by Dylan 2026-10-31 |
| R5 | `art/refs/silas-sheet-v4.png` | Three small violet feather marks down the left side of his neck (right of the picture in the front view, hidden in the right-side view); beauty mark under his left eye only; dark-teal hair in a low ponytail down his back; collar open and falling back; chain round the red sash, knife at his right hip; front-view eyes painted by hand | passed by Dylan 2026-10-31 |
| R6 | `art/refs/hush-sheet-v2.png` | Owl face with beak and ear tufts; violet eyes; smoky grey-violet; wings folded with blade-tipped feathers; bobtail; back-view ears show their dark backs | passed by Dylan 2026-10-31 |
| R7 | `art/refs/bram-sheet-v3.png` | Glowing anvil on his bare left chest; left strap down, right strap up; back view: back bib buckled to the right strap, sagging on the left with the loose strap at his hip; towel on his right shoulder; iron patches on his left shoulder and forearm only; flowing tattoos, the left one under the iron | passed by Dylan 2026-10-31 |
| R8 | `art/refs/grist-sheet-v2.png` | Iron-plated beetle; one anvil-shaped horn; six legs on the ground; glowing rust-orange eyes; no tail; no text on the horn | passed by Dylan 2026-10-31 |
| R9 | `art/refs/ione-sheet-v11.png` | Broken zigzag mark with crystals on the back of her left wrist; crystals on bare skin up the left side of her neck; white lock on her left; cropped black low-cut V-neck; coat on both shoulders, sleeves rolled | passed by Dylan 2026-11-05 |
| R10 | `art/refs/prism-sheet-v3.png` | Ice-blue glass mantis-moth; four walking legs (two in each side view); blade forearms folded; clear wings folded flat with rainbow edges; glowing ice-blue eyes; feathery antennae | passed by Dylan 2026-11-05 |

## Headless smoke test (for workers)
Serve the folder (`python3 -m http.server 8765`), open each page in Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` in the cloud workspace), collect page errors, and screenshot the title, play and game-over states.
