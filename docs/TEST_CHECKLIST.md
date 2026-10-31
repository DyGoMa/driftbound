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

## Headless smoke test (for workers)
Serve the folder (`python3 -m http.server 8765`), open each page in Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` in the cloud workspace), collect page errors, and screenshot the title, play and game-over states.
