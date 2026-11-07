# Play-check list: v1 Hoshi Arcade (moved word for word from docs/TEST_CHECKLIST.md, 2026-11-05)

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

