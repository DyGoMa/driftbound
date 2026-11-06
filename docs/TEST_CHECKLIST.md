# Play-check list

Mark each line **works** or **broken (what happened)**. Only you mark things confirmed.

## Checked by Claude (automated, 2026-10-30)
- All scripts pass a syntax check (`node --check`).
- In a headless Chrome (phone and landscape sizes): no script errors on the homepage or in Aki Dash; title screen, first jump and game-over screen render; running without jumping ends the run on the first Glitchling (score 76).
- A run saves to the shared save; the homepage reads it back (30 test shards → counter shows 30, 2 stories unlocked).
- Not checkable by Claude: how the jump *feels*, difficulty, sound, real-phone touch, frame rate on a weak phone.

## Waiting for your play-check
| # | Try this | Expect | Result |
|---|---|---|---|
| 1 | Open the homepage on your phone | Logo, shard counter, animated Aki banner, 6 cabinets (1 playable), 5 crew cards, 6 stories (1 open) | |
| 2 | Tap **Play now**, then tap the screen | Title screen, then Aki starts running | |
| 3 | Tap once | Normal jump | |
| 4 | Tap, then tap again in the air | Higher double jump with a teal sparkle | |
| 5 | Quick tap vs. holding the tap | Quick tap = short hop, hold = full jump | |
| 6 | Grab yellow stars | Shard counter goes up with a chime | |
| 7 | Play ~30 seconds | Speeds up; double-stacks appear after ~15 s, floating Glitchlings after ~25 s | |
| 8 | Hit a Glitchling | Shake, "GLITCHED!" or "NEW BEST!" screen with score and shards | |
| 9 | Tap **Back to arcade** | Homepage shows your new shard total and best score on the Aki Dash card | |
| 10 | Tap **Sound: on** | Switches to off, and stays off after reload | |
| 11 | On a computer: Space / Up arrow | Same as tapping | |
| 12 | Feel | Too easy / too hard / jump too floaty? Tell me, and I'll change the numbers in `games/aki-dash/tuning.js` | |

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

## Waiting for your check: reference sheets (build step 2, villains)
| # | Look at | Check | Result |
|---|---|---|---|
| V1 | `art/refs/trooper-sheet-v1.png` | Grey helmet, black visor over the eyes, jaw showing; white collar; closed grey coat to the knee, black belt; flat black chest bar with a white ring (front only); hooked blade at his right hip; black gloves and boots; dark grey trousers | passed by Dylan 2026-11-05 |
| V2 | `art/refs/vasch-sheet-v4.png` | Pale skin, pale grey eyes, grey hair combed back, tiny closed smile; white knee-length belted coat; black bar with a black ring (front only); both sleeves rolled; long black glove on his left arm; steel rings and bare metal fingers on his right arm; forearm is a see-through glass tube with one glowing white core, the same in the front, right-side and back views | passed by Dylan 2026-11-05 |
| V3 | `art/refs/hekka-sheet-v6.png` | Adult woman, very tall and muscular; thick wavy black hair swept back; no lip scar; grey plates with dark cloth on upper arms and legs; loose trousers; white collar; black bar and white ring on the chest plate; bare midriff with a ring scar on her left; no lance | passed by Dylan 2026-11-06 |
| V4 | `art/refs/hollow-bear-sheet-v2.png` | Big ash-grey bear on all fours; blank white eyes; plates on brow, shoulders and spine only; cables; white core set into the chest (edge only in the side views, hidden from behind); iron collar with a short chain ending above the core; rough stub tail | passed by Dylan 2026-11-06 |
| V5 | `art/refs/silt-sheet-v1.png` | Adult man, wiry; smooth white mask with one black slit over his right eye (left of the picture in the front view, shows in the right-side view, none in the left-side view); messy black hair; black coat to the knee, open below the belt, torn hem; black top, dark grey trousers, black boots and gloves; hooked glowing blade at his right hip only; back-view hands read from behind. Does the slit look right on the side of the mask? | checked by Claude, Dylan's check pending |
| V6 | `art/refs/hollow-hound-sheet-v3.png` | Same line of monster as the bear, and frightening; ash-grey rough fur, ribs showing; blank white eyes; two fangs; torn ears; plates on brow, back of neck, shoulders and hips only, bare back for a rider; white core in the chest; thick cables with clamps; no collar or chain; long tail straight out in the side views, small tuft in the back view. Are the fangs, torn ears and colours what you want? | checked by Claude, Dylan's check pending |

## Headless smoke test (for workers)
Serve the folder (`python3 -m http.server 8765`), open each page in Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` in the cloud workspace), collect page errors, and screenshot the title, play and game-over states.
