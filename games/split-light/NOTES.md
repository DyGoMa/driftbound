# Split Light: notes

Status: built, not yet seen running by Dylan. Review fixes built today, also not yet seen running. `live: false` in `shared/games.js`. All 9 pictures in `art/REQUEST.md` made and wired in (see "The pictures" near the end); not yet seen by Dylan.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, as it comes, with this game's scripts at the end |
| `tuning.js` | Every number, each marked PROVISIONAL or with its source |
| `levels.js` | The 16 levels and 3 boss boards, as little maps, each with the one idea it teaches. Shots and clock lengths PROVISIONAL, par proven by the solver |
| `words.js`, `words-levels.js` | Everything anyone says; the talk before and after each level |
| `game.js` | `Kit.start(...)`: joins the words, numbers and rules; this game's own sounds. Read this first |
| `rules.js` | The board's rules with no drawing or timers: one shot, growths, twins, armour, rails |
| `solver.js` | Fewest shots from any board, the live "is there still a way?" check, and the full map of a level |
| `play.js`, `moves.js`, `beam.js`, `control.js` | Firing, win and lose; turning, undo, scrape, retry; the shot in flight; thumb, keys, the clock, the buttons |
| `tally.js` | What a stage costs and pays: the shots behind the salvage and the arm, the growths a stage keeps, and the score over a story run |
| `boss.js`, `palcatch.js`, `bot.js` | Vasch's three boards, his corrections and his count; the two pals; the test bot |
| `draw.js`, `draw-beam.js`, `hud.js`, `scene.js`, `art-pieces.js`, `art-cores.js`, `art-people.js`, `art-arms.js` | One frame of the board; the beam and aim line; windows and buttons; the five rooms; the pieces; the cores; Prism, Ione's window, Vasch's window; the two arm strips |
| `art/sprites.js`, `art/REQUEST.md` | The 9 pictures in use (see "The pictures"); what each one is, and how to swap one |
| `test/levels-test.js` | The solver proof. Runs in plain Node |
| `test/fair-timing.js`, `test/play-checks.js`, `test/screen-checks.js`, `test/review-checks.js`, `test/review-retry.js`, `test/review-boss.js`, `test/review-shots.js` | Timing fairness; what a person would trip over; what's on screen; what a stage costs; what a new attempt hands back; Vasch's rules and count; layout and pictures. Run in headless Chrome |

## What was built
**What you do each second.** You look at a board of crystals, and trace the light in your head. Tap a crystal to turn it (each is `/` or `\`). When you think it's right, FIRE. There's no beam preview unless you buy one, so the shot is the moment of truth: it races round the board, chiming higher on each bounce, burning through every core it crosses. Then a crystal grows where it stopped, on the board and on Ione's arm, and you read the board again. It's a game of reading, then a payoff, then living with the mess.

**The bond cost.** Every shot grows a crystal on the last free cell of the beam's last straight run. Growths always lean `/`, and can't be turned. So a growth is either a stepping stone you planted on purpose, or a permanent bend in a lane you needed. Salvage comes from fewest shots. **A level's shots are for the whole stage, not each attempt, and they last until you win it.** Retry, running out of shots, Pause and Restart, Menu, and a reload all give you the crystals back as they started, but only the shots you haven't spent, and never fewer than the board needs, so there's always a way through. The spent ones show as dark hexagons in the shots row, and stay in the USED count beside PAR, in the pay and the score bonus, and on her arm. **On a new attempt the growths in your way stay, and the ones you could use break off** (with a burst and a line): the solver drops any growth that would let the fresh board be cleared under par, and any that would leave it with no way through. So failing can't shorten a board: a plant is only good for the attempt that planted it. A win clears all of it. Only Undo really takes a shot back, and that's what Steady Hand buys, once per level per upgrade level. Scrape does the same for a growth. A first miss on stage 1 can stay there too, if it's in the way. You can always try again, one shot at a time if that's all that's left; what you can't do is get anything back for it. On Ione herself: her window shows her left forearm with the cracked hexagon, a fresh bright shard for each shot on this stage, older ones from the story run, and shards climbing her neck. That count uses `run.carry`, so it lasts through Next, Menu and a reload, playing a stage again replaces that stage's part of the count, and stage 1 starts clean. What a stage has cost since it was last won is kept in the shared save (settings, `split-light-unfinished`), so closing the tab doesn't forget it.

**What changes from stage to stage** (16 levels over 4 sets, one idea each):
| # | Level | The one idea |
|---|---|---|
| 1 | First Light | Tap to turn, then fire |
| 2 | Two Turns | Read the whole path |
| 3 | Through and Through | The beam burns through and keeps going |
| 4 | Clamps | Clamped crystals don't turn; plates stop the beam |
| 5 | It Grows | Nothing to turn, the one board like that (`handsOff` in `levels.js`). A crystal grows where it stops, and leans `/` |
| 6 | Plant It | Aim to plant, not to hit |
| 7 | Stepping Stones | One growth to reach the next |
| 8 | Mind the Lane | A growth can kill your lane: order matters |
| 9 | Split Light | Splitter: two beams, two growths |
| 10 | Both at Once | Linked cores die in one shot or not at all |
| 11 | Two Seeds | One split plants two; the next shot uses both. The splitter starts wrong, so you have to read which way it sends the second seed |
| 12 | Armour | Open on one side only: go round |
| 13 | Perches | Tap a brass perch to move Prism |
| 14 | Moving Stock | Rails move after each shot: stop chasing |
| 15 | Clockwork | Rails on a clock: one crystal to turn, plant, then wait for one stop in three. Two crystals are clamped, so the clock is the new thing |
| 16 | Best Work | Everything; order matters |

**Boss: Director Vasch.** Three boards in one stage, with 3 points of nerve. Out of shots or pressing Reset costs a point and resets that board with full shots and the growths that are in the way (the same rule as Retry: any that would shut it or shorten it break off), and takes back what that board scored; no nerve left loses the stage. Reset asks for a second tap within 2.5 s, because it sits right under FIRE; on a dead board with no Undo or Scrape to try, one tap does it.
1. A demonstration: three cores on rails that move when you fire.
2. The metronome: a linked pair on a clock, in line for only one stop of four, plus a plain core.
3. His arm: one core, three hits, an opening that turns every 3 seconds. A side you've used is sealed for good, so Prism has to hop between three perches. A growth from one route can block another. After every shot he turns one of your crystals back, with a white ring, a CORRECTED label, a sound and a line; on a hit, the hit's line follows 2.2 s later. After a shot that touched no crystal, he turns one that's already right for your next best shot.
His glass arm in the window cracks as the core takes hits. He talks throughout: phase starts, hits, misses, corrections, resets, and if you stand still too long.

**His count.** On all three boards Vasch counts to ten while you stand there, shown as HIS COUNT on the FIRE button: 30 s a count, plus 15 s for the first shot of an attempt at a board. It says so at two, ticks and flashes from seven, and at ten he fires for you with the crystals as they stand: it costs the shot and grows like any other. A shot or an Undo starts it again. It waits while the beam flies and on a dead board. So the boss, unlike every level, does have a time limit on thinking. Levels have none: clocked rails only change what you're aiming at.

**No stuck states.** After every shot the game runs the solver. If no way through remains, it says NO WAY THROUGH, FIRE turns off and Retry becomes the big pulsing button. Out of shots loses the level, or costs nerve on the boss, unless an Undo is left, which it then offers (Scrape turns off at 0 shots, since it couldn't help). Retry is instant on levels, and costs what's described under the bond cost. A new attempt always has the shots its board needs, and the board always has a way through. Score isn't banked until a level or the whole boss is won, so a lost attempt can't set a best. A rail core landing on a growth crushes it, with a burst, a sound, a CRUSHED label and a line the first time.

**Upgrades** (per board): Steady Hand (undo a shot), Shard Scraper (tap, then tap a growth), Second Look (the aim line shows 1, 2, 3 bounces). The buttons only appear once bought. On a level, undos and scrapes come back only when you win it: not on Retry, a loss, Restart, Menu or a reload (kept in the shared save with the rest of what a stage costs). On the boss they're per boss board, and a Reset, which refills them, costs a point of nerve.

**Pals.** Glimmick: from Set 2, with no shot for 24 s, a 30% chance once per attempt that it crawls along the bottom of the board for 22 s. Shardle: from Set 3, a single shot of 5+ bounces has a 35% chance of waking it to hop along the top for 9 s. Tap to catch. Neither is on any solver's path: you have to dawdle, or take a showy shot.

**Story.** Ione goes back to the lab she helped build, to burn out the cores, carrying the old notes that Vasch's letter in `shared/stories.js` told her to bring, to burn on his desk. Vasch comes in on the intercom at level 11. His history with her carries it: "the work I began on you" and the count of ten (`shared/stories.js`) become five of ten, and the ending answers why he stopped.

**Sound.** Own effects for turn, split turn, six rising bounces, split, burn, grow, perch, rail, clock tick, undo, scrape, retry, dead end, nerve and correction, plus kit effects. Original loops for play and boss.

## The retry fixes (2026-11-06, from the latest review; built, not yet seen running by Dylan)
All four findings were real. Played through real taps on the code as it was, level 8, Steady Hand 1, five times FIRE, UNDO, RETRY: every loop `{"afterFireG":[23],"undosAfterUndo":0,"undosAfterRetry":1,"used":0}`, then a clear at `salvage 10, score 770`. Shard Scraper 1: `{"scraped":5,"left":[23],"scrapes":0}` then Retry `{"scrapes":1,"left":[]}`. A failing thumb on the old rule, fewest shots on the fresh board after 8 attempts: Stepping Stones 3 to 1, Split Light 2 to 1, Two Seeds 2 to 1, Best Work 3 to 1.1, Clockwork 2 to 1, Both at Once 2 to 1.

What changed: undos and scrapes on a level are per level (`SL.aidsLogged`, `SL.noteAid` in `tally.js`). Spent shots stay spent, down to what the board needs (`SL.shotsFor` in `solver.js`, called from `SL.loadBoard`). A new attempt drops any growth that would make the board shorter than par (`SL.scarsAfter`). A clear's over-par count now uses the shots actually fired (`play.js`), since an attempt no longer starts full. New words for Retry, the broken-off line, level 8's scene and the two upgrade blurbs.

**`node games/split-light/test/review-retry.js`: PASSED**, through real taps and, where it matters, the real saved screens:
- Level 8 with Steady Hand 1, the same six cycles: the first undo works, then `{"undoOn":false,"undos":0,"fired":5,"shots":2}` by cycle 6. Clear: `salvage 1, score 270, used 7` (a clean solve pays 10 and scores 770).
- Shard Scraper 1: one growth scraped, Retry leaves `scrapes 0` and the button off.
- Level 16 with no upgrades: shots 5, 4, 3, 3, 3 as shots are fired and retried; no board along the way under par 3. Retry with no shot fired changes nothing.
- Level 7, the review's replay, three wasted shots then Retry: `{"had":[4,17],"g":[4],"shots":3,"fired":3,"minShotsNow":3}`, where it used to need 2. A real stepping stone needs 2 more in its own attempt, and is gone after Retry. Planting within one attempt still clears at par for 10.
- Level 1 saved: one undo and one scrape used, then Pause and Restart, Menu and back, and a reload: `{"undos":0,"scrapes":0,"shots":2,"fired":1}` each time. A real Retry after another shot leaves 1 shot of 3. A win clears it all, and the replay has them back.
- Boss: a Reset costs a point of nerve and gives full shots and that board's undo.
- A save from before this rule loads.

**`node games/split-light/test/levels-test.js`** now also plays a thumb that never clears each board, 8 failed attempts, 40 times: on all 19 boards the fewest shots needed never drops under par, and no new attempt has no way through. A failing thumb on the new rule (a throwaway script, 60 runs a level, a random thumb's win rate on the fresh board with the shots it's given, first attempt then 8 attempts in): Stepping Stones 51% to 24%, Split Light 51% to 22%, Two Seeds 46% to 27%, Best Work 9% to 1%, Clockwork 20% to 7%, Both at Once 12% to 12%, Mind the Lane 3% to 1%. It Grows stays 100% (nothing to turn).

Looked at (`%TEMP%\kcheck\split-light\retry`): level 1 after a real Retry at 390x844 (1 of 3 hexagons lit, USED 2 PAR 1, UNDO 0 and SCRAPE 0 greyed, Ione's line in the box, a growth still on the board), after a Restart, level 8's longer line at 320x454 (fits, covers the board as other lines do), the upgrades screen at 320x454 (fits).

Not checked: how any of this feels. Nobody has played it. See "What a test can't tell".

## What was checked, with the real results (2026-11-06, after the review fixes)
Run from the repo root. All numbers are pasted from the last runs of each script. The fixes are built, not yet seen running by Dylan. `smoke.js`, `levels-test.js`, `review-checks.js`, `play-checks.js`, `review-boss.js`, `screen-checks.js`, `review-shots.js` and `fair-timing.js --seeds 8` were all rerun after the retry fixes and PASSED; the numbers below that a Retry changes are updated, and the rest are from the earlier runs of the same scripts.

**`node tools/smoke.js split-light`: PASSED**, 228 checks, 0 failed, at phone 390x844, computer 1440x900, small phone 320x568. That covers gate first, every one of the 17 stages won by the bot on 3 seeds with no upgrades, nobody playing never wins (idle check now 60 s, long enough to see Vasch's count fire), the whole story through the real screens (clears 17, deaths 0), real touch and keys, pause, hidden tab, sound and mute, buying upgrades, the switch, catch moment, saved progress after reload, wrong-way phone prompt, no sideways scroll, no page errors. Boss with the bot: 27.9 s. `node tools/smoke.js storm-run` also PASSED after the kit additions below.

**`node games/split-light/test/levels-test.js`: PASSED**, 16 levels and 3 boss boards. For each: solvable with the shots given; par is the true fewest shots (found twice, by search and by the full map); firing with no thought doesn't win; **touching nothing and only waiting can't clear it at par, except It Grows**; **on boards 9, 11, 12 and 15 the first shot untouched leaves a way through**; `needs:` is real (without growth, splitters or perches it can't be done in par); `trap:` is real; no two levels share an idea. Every board you can reach:
| Board | Par/shots | States with shots left: winnable | flagged dead | Random thumb wins |
|---|---|---|---|---|
| 1 First Light | 1/3 | 3 | 0 | 87.7% |
| 2 Two Turns | 1/3 | 6 | 0 | 57.5% |
| 3 Through | 1/3 | 6 | 0 | 57.9% |
| 4 Clamps | 1/3 | 3 | 5 | 44.4% |
| 5 It Grows | 2/3 | 2 | 0 | 100% (nothing to turn) |
| 6 Plant It | 2/4 | 6 | 1 | 67.5% |
| 7 Stepping Stones | 3/4 | 5 | 1 | 49.0% |
| 8 Mind the Lane | 2/4 | 61 | 61 | 4.5% |
| 9 Split Light | 2/3 | 4 | 1 | 49.1% |
| 10 Both at Once | 2/3 | 2 | 10 | 12.7% |
| 11 Two Seeds | 2/3 | 4 | 1 | 49.1% |
| 12 Armour | 2/4 | 13 | 2 | 25.6% |
| 13 Perches | 2/3 | 8 | 1 | 26.6% |
| 14 Moving Stock | 2/3 | 15 | 3 | 28.1% |
| 15 Clockwork | 2/3 | 16 | 3 | 17.6% |
| 16 Best Work | 3/5 | 51 | 11 | 10.5% |
| Boss 1 | 3/4 | 19 | 29 | 0.9% |
| Boss 2 | 2/3 | 36 | 16 | 14.5% |
| Boss 3 | 3/4 | 108 | 300 | 0.0% |
The random thumb sets every crystal at random each shot. It isn't a person, but it shows the shape. Before these fixes board 15 was 1.4% and the hardest before the boss, board 9 had no spare shot, and board 10 was 6.9%. Still not a smooth line: board 8 is the sharpest step (4.5%), and Set 3 goes up and down. Only a thumb can say if that matters. Boss 2 at 14.5% is easier than its neighbours on this measure.

**No stuck states:** every state with shots left is either winnable or dead, and the game runs the same solver after each shot. The live check stops at 3,000 results so a phone doesn't stall, and calls the board fine if it hasn't finished. On today's boards it never needed to: `gave up on 0 dead boards` on all 19.

**`node games/split-light/test/fair-timing.js --seeds 8`: PASSED.** (The script's own default is 20 seeds; run at 8 here.)
- 15 boards with no clock: 10 minutes idle changes nothing. This is the levels only: the boss's count is measured in `review-boss.js`.
- Clocked boards, measured from the running game: Clockwork 18 stops, shortest 3.22 s, round every 9.6 s; boss 2, 22 stops, shortest 2.62 s, round every 10.4 s; boss 3, 18 stops, shortest 3.02 s, round every 12.0 s. Warning (orange ring, ticks, flashing next-stop arrow) at least 1.00 s before each move. On levels a missed moment comes back and costs nothing; on the boss his count keeps running.
- A press at any moment of a stop, including during the slide and the last steps, hits what's on screen: 280 presses through real input, 0 wrong. The clock holds while the beam flies.
- A slow player with no look-ahead at the clock, one tap per 0.45 s, who only fires a set delay after seeing the stop it wants, 8 seeds each, 0 resets:
  - reacting in 0.4 to 0.7 s: Clockwork 8/8 (10 to 10.4 s), boss 8/8 (31.7 to 32.1 s)
  - 0.7 to 1.2 s: 8/8 (10.7 to 11.4 s), 8/8 (33.7 to 34.3 s)
  - 1.2 to 1.8 s: 8/8 (11.7 to 12.5 s), 8/8 (36.5 to 37.1 s)
  - 1.8 to 2.4 s: 8/8 (12.9 to 13.7 s), 8/8 (39.5 to 49.4 s)
  This proves the timing, not the thinking: that player gets the plan from the solver. How long a person takes to read a board is for a thumb to find out.
- Vasch turns exactly 1 crystal per shot, marked for 1.6 s, and it never closes the way through.

**`node games/split-light/test/play-checks.js`: PASSED.**
- Boards where a shot can leave no way through: 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, boss (clocked boards are covered by the map in `levels-test.js`). Each reached through real taps: NO WAY THROUGH shows, FIRE off, Retry big, and a real tap gives the shots not yet spent (full on the boss) and a board with a way through. On the boss, Reset on a dead board costs 1 nerve.
- A thumb tapping at random, 204 games over all 17 stages: 67 wins, 109 losses, 1522 retries from a dead board, 0 stuck moments, 0 errors. It also caught pals for real along the way.
- Upgrades through real taps: level 2 gives 2 undos, 2 scrapes, 2 bounces; Undo takes the shot and growth back; Scrape removes the growth; Second Look draws 1, 2, 3 segments for 0, 1, 2 bounces; the No-upgrades switch takes all three away.
- The arm through real screens: two shots on stage 1 saved; Menu, Story, stage 2 still shows 2; a shot adds a fresh shard at once; Retry gives the shots back but the shot stays on the arm; stage 1 starts clean.
- Pals, chance forced to 100%: Glimmick caught 8 of 8 after waiting, stays out of Set 1; Shardle 8 of 8 with its bounce count lowered to 1.
- Every sound the game asks for is defined.

**`node games/split-light/test/screen-checks.js`: PASSED.**
- Tap sizes, CSS px: cell 58.5 phone, 47.9 small phone, 75.9 computer; smallest button 61.7, 50.6, 80.2; pal circle 69.3, 56.8, 90.0; Pause 46 (the kit's). At 320 x 454: smallest button 44.0, pal circle 45.4, cell **38.3, still under 44**: 7 rows, Ione's window and the buttons don't fit any bigger on that screen without a new layout.
- All 44 in-play talk lines stay above the board and clear of Pause: lowest edge 0.8 phone, 79.4 small phone, 83.8 short phone (320 x 454), 59.9 computer, board frame at 89.
- Real presses: touch turns a crystal, a 0.6 s press still counts, pressing and sliding away cancels, touch on FIRE clears board 1. Keys: arrows, Space, F clear board 1 from the keyboard.
- Pictures: stand-ins for all 9 keys get drawn; all 9 broken on purpose, the game still draws and plays.
- CPU slowed 6 times, 390x844 at 2x: Best Work median 2 ms, 95th percentile 4.4 ms; boss 3 median 2.1 ms, 95th percentile 3.6 ms; a few single frames at 200 to 330 ms. I didn't find out why; the test steps frames without letting the browser rest. Live check, worst sampled: 50 ms, as a shot lands. This measures issuing the drawing, not the graphics chip.

**`node games/split-light/test/review-checks.js`: PASSED.** What a stage costs, through real taps and real screens:
- Level 8, two wasted shots, Retry, then the fewest shots from what's left: growths had 5, 23, kept 5 (23 would have shut it), 2 shots of 4, arm 2 after Retry. Clear: salvage 2 (a clean par pays 10), score 470 (clean 770), USED 4, arm 4, and the line is the over-par one.
- Level 1 lost: "DOWN ... Score 0 ... Best 0 Fair best 0", no New best. Try again, Pause and Restart, Menu and back, and a reload all keep fired 3 and growths [3, 7]. A 4-shot clear pays the floor of 1. The win clears what the stage kept.
- Stage 2 replayed 5 times through the real screens: best and fair best stay at 1230, the arm's count stays at 2, salvage +2 a replay.
- Boss, flawless, logged: over 0, 0, 0; board bonus +500, +500, then +2000 with the boss bonus; final score 4090 (the review saw 950 points lost here). A boss attempt lost after winning a board banks no best.

**`node games/split-light/test/review-boss.js`: PASSED.**
- Level 1 at 0 shots with an Undo: Undo on, Scrape off, Undo gets the shot back. Boss 1 on a dead board: Scrape leaves the Undo working, and the scraped growth stays gone through it.
- Boss 3, hit then Undo: chamber 0.667 back to 1, score 120 back to 0, ring gone. Failed boss board: score 230 back to 0, 0 banked.
- His count, nobody playing: fires at 45 s, then every 30 s. Undo at count 9.01 goes back to 0.01, and he doesn't fire again in the next 9 s. Nobody playing for 900 s doesn't win the boss (result: timeout, score 0).
- Boss 1: the crush found by search and played through taps: CRUSHED and the line up.
- One real touch near the top of Reset: nerve stays 3, the button asks; 2.8 s later it stops asking; two touches cost 1 nerve. On a dead board with nothing else to try, one tap resets.
- Boss 3 with the bot: "That crystal was wrong. I've fixed it for you." at 3.55 s, "I taught you that angle. I'm almost proud." at 5.77 s.

**`node games/split-light/test/review-shots.js`: PASSED.** Stage list, BOSS bottom against Back top, CSS px, no scrolling: 390x844 623 / 633, 320x568 422 / 425, 320x454 365 / 368, 1440x900 682 / 696. The row of 4 ends level with Back at every size (376, 306, 306, 1083). Also fits with a run carried and the ending on offer.

**The boss, a simulated player:** the numbers that used to be here (error rate against wins) are from older boards and weren't rerun, so they're gone. No measure of how many tries a person takes exists.

**Screenshots looked at** (`%TEMP%\kcheck\split-light\lookfix`, `%TEMP%\kcheck\split-light\review`, `%TEMP%\kcheck\smoke\split-light`), after these fixes: level 16 at 390x844 and 320x454, her window at 0 to 48 shots, the arm strip zoomed at three counts, boss board 3 and the chamber zoomed 2.5 times, the board-won banner in real bot play, stage lists at 320x454 and 390x844 with the longest list. Earlier passes, not all repeated: title, talk, boards 1 to 16, mid-beam, dead banner, upgrades on, result, catch, ending. Checked against the sheets: Vasch's combed-back hair, stand collar, bar and ring; Prism's eyes, antennae, blades, rainbow-rimmed wings.

## What a test can't tell, and needs Dylan's thumb
- **The big one: whether having no beam preview is fun or just annoying.** It follows from the spec (Second Look is an upgrade that shows the first bounce), and the slack in `shots` is my guess at how many mistakes a person needs. If it feels mean, the cheap fix is more shots in `levels.js`, or one free bounce in `lookPerLevel`'s base.
- Whether level 1 is easy for a new player and the boss takes "a few tries". The bot plays perfectly; the random thumb only shows difficulty rising.
- Whether "growths always lean /" is understood from the talk and the first boards.
- **Whether the bond cost now bites too hard.** After the shots are spent, every attempt has only what the board needs, so on the par 1 boards of Set 1 each miss is the DOWN screen, Try again, one shot. That's the opposite worry from the last review, and level 1 is meant to be easy for a new player. A wrong shot on a tight board also shows NO WAY THROUGH at once, which tells you it was wrong. If it's mean, the cheap fix is more `shots` in `levels.js`, or sparing Set 1 in `SL.shotsFor`. 4 of the 16 levels are par 1 (all Set 1), so a clean solve there never lives with a growth.
- Whether a growth breaking off because it would have helped reads as fair or as the game cheating. Only Ione's line and level 8's scene explain it.
- You can still fire one shot, Retry, fire one shot, as long as you like. After the pay reaches its floor that costs score, shards, and a board filling with growths in the way, not salvage. I didn't add a hard stop: "Dying restarts the current stage", and nobody should be locked out of a stage.
- Whether the boss now takes "a few tries". There's no measure of a person. His count does press you: whether 30 s (45 s for the first shot) is tense or unfair.
- Whether the boss's 3-second turning opening feels tense or tedious. The whole round repeats every 12 s, and his count runs meanwhile.
- Whether the new level order feels right: L9 now forgives one look at the splitter, L15 is gentler, L10 and L12 are softer.
- Whether her arm strip now reads as crystal growing out of her, at the size it's drawn. Code art, seen in stills only.
- The music and effects. Checked that they play without error, not that they sound good.
- How the turn, beam and growth animations feel. Checked in still frames only.
- Whether Prism reads as Prism from above. The sheet has no top view; mine is built from its parts.
- A real phone: only Chrome pretending to be one has run this. The graphics chip is unmeasured.

## Provisional numbers to confirm
All in `tuning.js` and `levels.js`, marked. Most likely to change: each level's `shots`, the `clock` lengths, `warnSecs`, `bossNerve`, `bossCount`, `countReadSecs`, the boss boards' `shots`, `setPay`, `overParCost`, `minPay`, `replayShare`, `resetConfirmSecs`, `glimmickChance`, `shardleBounces`, `shardleChance`.

## Calls Claude made (change any)
- **Growths in the way outlast everything but a win: Retry, losing, Restart, Menu and a reload. This is the biggest rules call in the game**, and it stretches the batch line "Dying restarts the current stage": the stage restarts, but its board keeps what's in your way. A growth that would shut the board, or let it be cleared under par, breaks off, so nobody can be stuck and failing can't shorten a board. A board can come back clean if nothing you grew was in the way. To go back to clean boards: pass `null` instead of the kept growths in `SL.retry` (`moves.js`) and `SL.newWorld` (`play.js`), and change Retry's lines in `words.js` and Mind the Lane's in `words-levels.js`.
- **A level's shots are for the whole stage.** The batch says "shots are limited" and doesn't say per attempt. A new attempt gets the shots not yet spent, and never fewer than its board needs. To go back: remove the `SL.shotsFor` line in `SL.loadBoard` (`play.js`). The boss keeps full shots per attempt: nerve is its limit.
- **Undo and Scrape last the whole level on levels, and come back on a win.** The batch's "one undo per level" read literally; the boss keeps one per boss board, since Reset costs nerve there.
- **Vasch's count: at ten he fires for you.** The spec only says he talks throughout and has moving cores; a count of ten comes from his history with her in `shared/stories.js`. So the boss has a time limit and levels don't. To turn it off, remove `count` from the three boards in `levels.js`.
- **Costs survive a reload** (`tally.js`, shared save). Closing the tab no longer forgets them: not the spent shots, the growths in the way, or the undos and scrapes already used.
- **A lost attempt scores nothing.** The score stays out of `run.score` until a level, or the whole boss, is won. The DOWN screen shows the run's score so far, 0 on stage 1.
- Boss bonus at par is per board, counting failed attempts on that board but not boards already beaten, and not lost attempts at the boss.
- Board changes to answer the review, all PROVISIONAL: L9 3 shots (was 2); L10 one crystal clamped; L11 splitter starts leaning the wrong way, so FIRE twice no longer clears it; L12 4 shots (was 3); L15 two of its three crystals clamped, so it asks for one turn and one moment.
- Set 2 is now The Seed Beds, not The Nursery, and Ione says "I ran these beds". Nothing broke a hard rule, but that word sat beside Juno's joke. The room painting's prompt in `art/prompts/room-1-v1.txt` still says Nursery: it's a record of what was asked, not on screen.
- New lines for a clear over par on L3, L7, L8, L11, L16, where the old line praised a clean solve.
- `ione_bust` is back on take 1, with a code-drawn black top: see "The pictures".
- **Growths can't be turned, and always lean `/`.** The spec says "tap crystals to turn them" and that growths "can block or help". A turnable growth hardly ever blocks anything: a beam that stopped on that cell can always be sent along the lane. So I fixed them. This is the biggest rules call.
- A growth comes up only on the beam's last straight run. Stopped right after a bounce with no free cell, nothing grows.
- The beam passes through cores and carries on. Beams cross without touching.
- Added pieces the spec didn't list, to give each level a new idea: clamped crystals, plates, splitters (from the name and Prism's wings), linked cores, armoured cores, brass perches.
- "Moving cores" means both kinds: rails that step per shot, and rails on a clock. The clock stops while the beam flies.
- Boss nerve (3 resets), a board resets rather than the whole stage, and the side-sealing rule on board 3.
- Vasch's corrections are in board 3 only.
- Retry on levels is instant, with no lose screen, and keeps the shots fired in the count; running out of shots gives the lose screen with a line. Coming back from a loss, Restart, Menu or a reload, Ione gives the same line as a Retry, since fewer shots come back.
- On the board a growth lasts until a win, a Scrape, a rail, or a new attempt where it would shut the board or shorten it. The words say so ("Crystals reset. Shots don't. What's in my way stays.", "Useful or fatal, it cracked off.", and level 8's scene).
- A rail crushing a growth stays in the rules (boards were proven with it), now shown on screen rather than removed.
- 16 levels get a 2 to 4 line scene each (the lint would allow only one per set). Skip works, and retries skip them.
- **Salvage: at par 8, 10, 10, 12 by set, 4 less per shot over, never under 1; boss 28 plus 4 per nerve left; a stage already cleared pays a fifth of that, at least 1.** The kit asks for 15 to 40 a stage, for 5 stages. With 17 stages that would pay 3 times what other games do, so I kept the whole story at about the same total: 200 at most for a perfect first run. Measured per second of bot play, a first run is still far above the other games, but a bot doesn't have to read the boards; for a puzzle that reading is the time. The replay cut is what stops known boards being farmed. The result screen shows the lower pay and doesn't say why.
- Score adds up across a story run via `run.carry`, each stage counted once (`tally.js`), so Best means a whole run and a replay only replaces that stage's part. Best can still grow by replaying a stage for a better score: only ever up to one score per stage. A run that used upgrades doesn't feed the fair best.
- The arm's count works the same way: a replay replaces that stage's shots, so replays don't grow it.
- Boss board shots 4, 3, 4. Vasch's correction after a no-crystal shot turns one you'd want left alone.
- The link between linked cores is now a slack steel cable with brass ties, drawn in a curve, so it can't read as a beam.
- The story: she brings the notes because he told her to, to burn them on his desk; he copied them the night she ran, and only asked so she'd come home. Prism folds up against her side at the end, since she's the size of a large dog.
- Swearing added to Kaito, Juno and Sela, in their voices: damn, hell, shit, screw, bastard. Ione and Bram stay clean; it fits them.
- The arm's count across the story is a look and a talk trigger only; it doesn't change later boards. The spec's bond cost is the board growth, and that's per attempt.
- Story calls: Ione burns her notes; Vasch began the strip at the count and stopped at five of ten, because she was still taking notes; he keeps her desk; he escapes with a cracked arm. Level and set names, and every line of dialogue.
- The tighter talk box at 360 px wide and under is now the kit's `compactSay` option, so it stays above the board and clear of Pause (see "Kit notes").
- Vasch's talk portrait on this page is his bust picture zoomed to head and collar (through `Kit.speakers.add`). My code bust from `vasch-sheet-v4.png` is only the fallback if the picture can't load.
- Ione's window uses `ione_bust`, and her homepage portrait only if that can't load, with the crystals drawn over either.
- Prism is drawn from above so she can face any way. Picture keys for it are in `art/REQUEST.md`.
- Keys: arrows move a cursor, Space or Enter turns (or fires with no cursor), F fires, R retries, U undoes, X scrapes.
- Pal conditions and chances.

## The pictures (2026-11-06)
9 images, all first takes: `vasch-bust-v1`, `prism-top-v1`, `prism-fire-v1`, `ione-bust-v1`, `room-0-v1` to `room-4-v1` in `art/raw/`, prompts in `art/prompts/`. Each looked at zoomed in against its locked sheet and in the running game at 3 sizes. Flaws kept, for Dylan to judge:
- `vasch_bust`: faint blush on the cheeks in the calm frame, as on his sheet (the prompt asked for none). The ring and bar are a little big for the chest.
- `prism_top` is built from the sheet's parts; the sheet has no top view, so that it reads as her is a guess until Dylan sees it. The rainbow shimmer is faint at 58 px. The wings are painted opaque so the green key couldn't eat them, so they read less like clear glass.
- `prism_fire`: she looks a touch smaller than `prism_top` in the body (the wide wings needed room), so the swap has a small jump. It lasts only for the shot's first moment.
- `ione_bust`: bigger hair with more stray locks than the sheet, nearer her homepage portrait, which was passed as the framing guide. The picture stops at the collarbones, so the top's neckline is out of frame on purpose. Calm frame's brows read a bit stern.
- `room_3` reads as cold grey rather than white (kept dark so the pieces read), and has some pale crystals behind the railings though the prompt said nothing out of place.
- `room_4`: the core is a small spiky shard, not a round glow, and the glass chamber is cracked. On a phone most of the room is behind the talk box and the board, so the core barely shows there.
Code changes for the pictures, in `art-people.js`: busts drawn as whole squares (see `art/REQUEST.md`); her later neck shards have their own positions for this picture (`NECK_PIC`), under the jaw on the side of the neck. Her neck is short in this picture, so at 6 extra shards they crowd: more neck would need a redone picture. Vasch's talk box uses `vasch_bust`, frame 1.

**`ione_bust` take 2 (the same day): more neck.** `art/raw/ione-bust-v2.png` is an edit of take 1 (prompt `art/prompts/ione-bust-v2.txt`), keyed to `art/ione-bust-v2.webp` at the same 512 px cells; `art/sprites.js` now points there. Take 1 and `art/ione-bust.webp` are kept. `NECK_PIC` moved to fit: the shards now climb the neck and spread across it, off her chin and mouth. To go back to take 1, point `art/sprites.js` at the old file and restore its table: `[null, null, [0.6, 0.815, -0.42], [0.58, 0.79, -0.72], [0.605, 0.77, -0.3], [0.565, 0.825, -0.85], [0.585, 0.75, -0.55], [0.555, 0.785, -0.95]]`. Flaws: the neck is too long for her head, with bare skin from chin to collarbones and below and none of her black top.

**Back on take 1 (the same day, from the review).** Take 2's neck was as long as her face, and in the window she read as bare under the coat. `art/sprites.js` points at `art/ione-bust.webp` again, whose neck is much nearer her sheet; `NECK_PIC` is take 1's table again; take 2 and its webp are kept. No picture has her top in frame, so `ioneTop` in `art-people.js` draws a black V-neck between the coat's edges, and the window shows a little more of the picture (`ph / 0.97`, was `0.92`). Flaws kept: the top is flat code art over a painted picture; the collarbones show through its V; at the top count the neck shards sit close together in a block under her jaw, with heavier ink than the two painted ones; the bigger hair and stern brows of take 1.

**NEEDS PICTURE:** `ione_bust` take 3: short neck, her cropped black V-neck top in frame just below the collarbones, a smaller bob with a thinner lock, per `ione-sheet-v11.png`. Then remove `ioneTop`.

**`ione_bust` take 3 (the same day): done, status built, Dylan's check pending.** `art/raw/ione-bust-v3.png` (first take, prompt `art/prompts/ione-bust-v3.txt`, 3072x1024), keyed to `art/ione-bust-v3.webp` at 512 px cells; `art/sprites.js` points there. Takes 1 and 2 and their webps are kept. `ioneTop` is gone: the top is in the picture. `NECK_PIC` has a new table for this picture. To go back to take 1, point `art/sprites.js` at `art/ione-bust.webp` and use its table, given above; the code top would need restoring from git. Her window now cuts the empty space over her hair (`ph / 0.9`, picture moved up by a tenth of its size), so her face is back to about its old size with the top still in view: this replaces the `ph / 0.97` above. Flaws kept: at the top count the 6 extra shards sit in one tight clump between jaw and collarbone, heavier in ink than the two painted ones (the neck is short, as on her sheet); the calm frame's brows are still a bit stern; in frames 2 and 3 her glasses tilt slightly compared with frame 1; strands of hair fall over the lens on the left of the picture in all three frames. The V of the top shows bare skin below the collarbones and closes at the bottom edge, with no cleavage in frame.

## Kit notes
Nothing is forked, and `game.js` no longer styles the kit's classes. Two small additions to the kit, both opt-in, so other games are untouched; `tools/smoke.js storm-run` PASSED after them. `def.compactSay` (`game.js`, `kit.css`): the tighter talk box on narrow phones, the same rules that used to live in this game's page. `def.stageRows` (`ui.js`, `kit.css`): a long stage list in rows of 4, boss on its own row, packed on screens 640 px tall or less so all of it fits above Back; uses `:has()`, so a browser too old for it just gets a roomier list that scrolls under Back. Both are in the kit's README. Still something a later kit could offer: a stage-select background option (the title's picture isn't carried behind the stage list).

## Noticed, not touched
- `art/C:/Users/Dylan/Documents/` is a stray empty folder path inside `art/`, from an earlier save with a bad path. It holds no files as far as `ls` shows.
- Boss 2 at 14.5% on the random thumb is easier than boards around it, and Boss 3 at 0.0% never wins by chance. Not changed: the review didn't ask, and the bot and the slow player beat them.
- The README's talk lint allows long puzzle games one scene a set; the batch rules say each stage. I wrote one for every level.

## Review fixes (2026-11-06, the pal, nobody-playing and short-phone review)
Status: built, not yet seen by Dylan. These lines take over from what older sections say about the same things (kept above as written): Shardle "along the top" (Pals), "still under 44" (tap sizes), and the count stopping on a dead board. `node games/split-light/test/review-pals-fixes.js` covers all of this with real taps and steps; `test/review-boss.js` now requires the idle boss to lose, and `test/screen-checks.js` no longer excuses the short phone.
- **Shardle hops along the bottom of the board, not the top.** It was hidden behind the talk box on phones 375 px wide and under. Talk boxes stay in the strip above the board, so nothing covers it now. `shardleBelow` in `tuning.js`.
- **A pal still out when the stage ends goes with a small puff** (`SL.palLeavesAtEnd`, `palcatch.js`), so none is behind a result screen with Juno's or Silas's lines on it. It couldn't be caught at that point before either. Silas's "Up the neck, darling" line waits for the next shot with no pal out.
- **No Shardle on a last shot.** `palAfterShot` now runs after `checkWay` and won't spawn once the stage is over, so "Tap it!" is never a promise the stage can't keep.
- **The boss now loses if nobody plays.** His count also runs on a dead board, and at ten he resets it for the same point of nerve Reset costs. Seed 7, nobody playing: nerve 2 at 106.2 s, 1 at 213.6 s, lost at 321.1 s. A dead board with Undo or Scrape left has the same 30 s. Levels still wait forever (`test.idleNeverLoses`).
- **Reset's second-tap label is on two lines**, "AGAIN" and "-1 NERVE", at every button width.
- **A shot's growth is saved when it leaves**, with the shot, so a Restart, Menu or closed tab with the beam in the air doesn't dodge it. A new attempt then treats it as any other growth: one that's useful cracks off, one in the way stays (`SL.scarsAfter`).
- **Short phones keep the 44 px rule on the board.** `T.cell` is now worked out live: 54 px unless that falls under 44 CSS px, then it grows, up to `cellMax` (63). Good down to about 447 CSS px tall. 320 x 454: 44.7 CSS px a cell. Pieces stay their usual size in the bigger cells. On a level the space under the board becomes one row: Ione's window, FIRE, Retry, any upgrade buttons, using the screen's extra width (`SL.shortRow`, `control.js`). Her face is small there on the shortest screens; her arm still shows. On the boss, FIRE is shorter and drops the words "HIS COUNT" when it's under 108 px tall; the row of ten stays. Screens tall enough for 44 px at 54 px keep the old layout.
- **`countTo` in `tuning.js`** replaces the bare 10s in `boss.js` and `hud.js`.
Still needs a person's thumb: whether Shardle at the bottom is easy to spot, whether the puff reads, whether the short phone's row feels cramped, and whether 30 s on a dead board feels fair.
