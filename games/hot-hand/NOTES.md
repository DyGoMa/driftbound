# Hot Hand: notes

Status: built, not yet seen running by Dylan. All 24 pictures in `art/REQUEST.md` are made and on (see "The pictures" below), and `live` is still false.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, as it comes, with this game's scripts at the end |
| `tuning.js`, `tuning-stages.js` | Every number, each marked PROVISIONAL or with its source. The second holds the boss, what's in each stage, and Endless |
| `words.js` | Everything anyone says: talk scenes, radio, lose lines, ending, bet card, hints, pal lines, upgrade blurbs |
| `sounds.js` | This game's 30 effects, on top of the kit's |
| `game.js` | `Kit.start(...)`: joins the words, numbers and rules, and the two music loops. Short on purpose; read this first |
| `fire.js` | The bond cost: heat, tiers, throws, going over the top, what a flame does when it lands, getting hurt |
| `foes.js`, `air.js` | Lanes and depth, tap boxes, every foe's behaviour; things in the air |
| `ashka.js` | Ashka picks and marks targets |
| `table.js` | Waves, the table, the bet, Endless's waves |
| `boss.js` | Krell's shield line: a state machine, logic only |
| `pals.js`, `play.js` | The two pals' conditions; one attempt's world, what a tap touches, the order of one step |
| `bot.js` | The test bot, with the human limits the fairness script uses. Presses through `input.sim` only |
| `tools/fairness.js`, `tools/fair-*.js` | The fairness script, in four parts. `node games/hot-hand/tools/fairness.js` |
| `bake.js`, `street.js`, `scenes.js` | Drawing helpers; Ashmarket's parts; the five places |
| `people.js`, `beasts.js`, `props.js`, `line.js`, `hud.js`, `draw.js` | Juno and troopers; Ashka and the Hollows; flames, hooks, carts, cover, warnings; the shield line and Krell; the read-outs; one frame and the title |
| `art/sprites.js`, `art/REQUEST.md` | The 24 pictures in use, keyed; the list of what each one is and how it was made |

## What it is: what you do each second
You stand behind an upturned card table and tap whatever you want burned. There's no aiming beyond the tap: the choice is **what**, and **when**.
- **Heat is the rhythm.** Each throw adds 16 heat, and she loses 12 a second. So at any heat, one throw every 1.33 s holds steady; faster climbs. The bar has marks: COLD under 35 (1 damage), WARM 35 up (2, gets through a plate), HOT 70 up (3, burns who's standing near), HOT HAND 78 to 84 (3, wider burn, best score and table pay). Above 84 the next throw goes over the top. So the best band is half a second wide, and playing well means tapping just as the bar falls back into it. A ghost chunk on the bar shows where the next throw will land; it flashes red if that's over the top, and sounds mark the edges of the band, so it can be played by ear.
- **Going over the top.** That throw still flies, even at a shut vent, as a blowout that does 1 damage to everything within 110 px. Then her hands lock for 1.8 s, she takes a burn hit with no moment of safety after it, any bet riding is lost, and when the lock lets go she's still at heat 74: no cooler than if she'd waited. Now and then that's worth it, on purpose. Each burn leaves a raw patch on the palm in the corner, lasts the story run through `run.carry` (Next stage, Menu and reload keep it; picking stage 1 clears it), and makes later locks 0.1 s longer.
- **Ashka** marks a target every 4.5 to 6.5 s. A throw at a mark adds no heat and hits a tier harder, and when it lands she takes 12 heat off. So in the red, you look for her mark.
- **It shows on her** (the bond cost): nothing when cold; fire in the gloves when warm; tongues of flame rising off her and smoke when hot; her mark burning brighter all the way; red, shaking, arms clamped in and smoking when locked. The palm in the corner reddens, then cracks with ember light. All that's code, drawn over any picture.
- **The bet.** Between waves the card offers: Cash in, Bet half, or Let it ride. Take no damage in the next wave and what's riding pays double. One hit or one burn and it's gone, at once: BUST and the amount fill the top of the screen with a sound and flying chips, and the next card says so again. A hot, clean wave pays more onto the table, so the game is pushing you hot at the moment a burn would cost you most.

**The bet can't trap anyone or go below zero, because it never touches your saved salvage.** It stakes the table: what this wave has earned, not paid out until you cash in. So someone with 0 salvage bets the same as anyone, Cash in is always there, and salvage once paid is never taken back. **The house takes 6 at most on one bet, and 4 on Card Row, where hardly anyone gets hit.** When the table holds more, the card says so and the rest is paid out safe, so a bet always pays exactly what the card and the top of the screen promise. That keeps a stage inside the kit's 15 to 40, and stops Endless doubling for ever. A hot wave puts up to 7 on the table against a cold wave's 4, so the heat pays on the table.

### What changes from stage to stage
| Stage | What's different | What it asks of you |
|---|---|---|
| 1 Card Row | Three lanes, troopers die to one cold throw, plates at the end, a quicker last wave, small bets | Learn to tap; plates teach that cold fire bounces. Easy on purpose, but the last wave asks for quicker hands and a little heat, so Dice Alley isn't a wall |
| 2 Dice Alley | Two lanes, runners, hook-men, squads. First wave: every foe takes 1 more damage. Then 2 more | The first wave is two cold throws or one warm. After that a trooper takes two WARM throws but one HOT one, so this is where the heat starts to pay. Bunched squads make the burn pay. Burn hooks in the air |
| 3 The Long Table | Rain: she cools 1.25 times as fast. As tough as the alley, and they come faster. Shooters in the top windows. Powder carts | Quick hands to stay hot. Windows open and shut. Light a cart when his mates are near it, or kill the pusher and leave it as a bomb |
| 4 The Pit | Juno in the middle, foes from both sides, fire: she cools at 0.7 times. Hollow hounds | Slow cooling makes every throw count, and marks matter most. Hollows can only be hit when they stop and the core shows |
| 5 The Vault Steps | Krell's line of three shields marching on her | Three vents open in turn. Feed each with fire (hot fills fastest) until it blows. All three down, and Krell's in the open for 6 to 7 s. Three rounds, with a bet between them. Quench cans take your heat from round 2. If the line reaches you it charges: 3 hits, half of her 6 |

## What was checked after the boss's third round was fixed (2026-11-06, night)
Only the boss changed, so the sections below still hold for stages 1 to 4 and everything else. Status: built, not yet seen running by Dylan.

The review was right: a human bot could not blow all three shields before round 3's charge (13 s march + 1.6 s warning = 14.6 s; 39 pressure at about 0.75 throws a second). Re-run before any change, 40 seeds, it matched: clean thumb 31/40, charges by round [0, 9, 40]; patient 0/40.

Boss, no upgrades, default betting, using the review's own bot settings. Before is 40 seeds; after is 200 new seeds (the same 40 seeds as before gave clean 40, steady 29, average 22, patient 9).

| Player | Wins before | Wins after | Deaths by round, after | Charges by round, after |
|---|---|---|---|---|
| plain bot | 40/40 | 200/200 | 0, 0, 0 | 0, 3, 1 |
| fast clean (0.3 s, 4 taps/s) | 33/40 | 200/200 | 0, 0, 0 | 0, 30, 2 |
| clean (0.45 s, 2.8 taps/s) | 31/40 | 191/200 | 0, 0, 9 | 0, 80, 20 |
| steady | 11/40 | 155/200 | 0, 4, 41 | 1, 83, 32 |
| average | 2/40 | 72/200 | 1, 36, 91 | 6, 82, 27 |
| patient (0.6 s, 2 taps/s) | 0/40 | 37/200 | 0, 15, 148 | 13, 192, 151 |

Average time to all three shields down in round 3, clean thumb: 15.4 s against a charge at 18.1 s (was 21 s against 14.6 s). This average only counts runs that got there. Stage 4 to boss, same seeds, 40 runs: clean 39 to 38, steady 35 to 32, average 33 to 22, patient 29 to 10.

The bet with Let it ride forced, 200 seeds, won/lost. The second boss card is now about as good as the first:

| Player | First card (into round 2) | Second card (into round 3) | Second card before (40 seeds, from the review) |
|---|---|---|---|
| plain bot | 184/16 | 183/17 | 10/30 |
| fast clean | 156/44 | 168/32 | 8/32 |
| clean | 109/91 | 150/50 | 0/40 |
| steady | 54/146 | 51/135 | 0/39 |
| average | 23/177 | 14/148 | not in the review |
| patient | 2/198 | 16/165 | not in the review |

No change to `table.js`: every bet already paid what it promised, and the trouble was how rarely this one could win. Salvage per boss run, clean thumb, 40 seeds: 25.3, and 31.5 with every upgrade at level 3 (kit aim 15 to 40).

Blowing the last shield during the warning does stop a charge: across 1,200 runs of six bots, 269 in round 3, with about 230 charges landing there. So Sela's line at the warning still tells the truth about that.

`node tools/smoke.js hot-hand`: PASSED. `node games/hot-hand/tools/fairness.js --seeds 20`: PASSED, including never above WARM, never above COLD and the masher all 0/20 at the boss, and every hit with at least 0.8 s of warning. Both lines timed and seen on screen at 568x320 and 844x390, in `%TEMP%\kcheck\hot-hand\fix-r3`: the first at 12 to 13 s into round 3, the second at 16.5 s. Scripts are there too (`after.js`, `sweep1.js` to `sweep3.js`).

These bots don't learn and read the bar perfectly, so none of this says how many tries a person needs. That still needs Dylan's thumb.

## What was checked after the second review's fixes (2026-11-06, evening)
**The section after this one was measured before these fixes.** Its tables are kept as they were, so read this one first for the current numbers.

`node tools/smoke.js hot-hand`: PASSED. `storm-run`, `silent-cut`, `tide-gap`, `hold-the-deck`, `split-light`, because `shared/kit/kit.css` changed: all PASSED, with other agents working in the folder at the time.

Who wins, `tools/fairness.js --seeds 20 --only players`, no upgrades (hits a run in brackets):
| | S1 | S2 | S3 | S4 | Boss |
|---|---|---|---|---|---|
| Plain bot, perfect timing | 20/20 (0) | 20/20 (0) | 20/20 (0) | 20/20 (0.3) | 19/20 (0.9) |
| Clean thumb: 0.45 s, 0.15 s lag, never goes red | 20/20 (0) | 20/20 (0.1) | 20/20 (0) | 20/20 (0.9) | 10/20 (1.8) |
| Quick thumb: 0.3 s, 0.1 s lag, some slips | 20/20 (0) | 20/20 (0.8) | 20/20 (0.9) | 20/20 (1.1) | 3/20 (3.5) |
| Steady: 0.45 s, few slips | 20/20 (0) | 20/20 (0.6) | 19/20 (1.1) | 20/20 (1.6) | 10/20 (2.8) |
| Average: 0.45 s, more slips | 20/20 (0) | 20/20 (1.4) | 18/20 (2.4) | 20/20 (2.0) | 1/20 (3.9) |
| Slow: 0.6 s, most slips | 20/20 (0) | 20/20 (1.6) | 20/20 (2.5) | 12/20 (3.5) | 1/20 (3.2) |
| Refuses to go above heat 53 (WARM) | 20/20 (0) | 11/20 (2.7) | 16/20 (1.7) | 3/20 (3.8) | 0/20 (2.0) |
| Refuses to go above COLD | 20/20 (0.5) | 0/20 | 0/20 | 0/20 | 0/20 |
| Button masher, ignores the bar | 20/20 (0) | 11/20 (3.5) | 1/20 (4.0) | 3/20 (4.0) | 0/20 (5.0) |

That table ran before the plain bot's one change (below). Larger runs, 40 seeds (the plain bot and the boss vary a lot, so 20 is rough): masher at 3 taps a second, 0.45 s: stage 2 31/40 with 16.5 salvage against the clean thumb's 40/40 with 36.4; stage 3 8/40; stage 4 12/40 against 38/40; boss 0/40. Clean thumb on the boss 25/40, steady 14/40, average 3/40, slow 2/40. Plain bot on the boss, 120 seeds: 119/120.

Honest limits on those. **Stage 2 is still forgiving of mashing:** the masher wins about 3 in 4 at that speed, though it earns less than half. **A robot with no reaction delay still beats the boss most times:** the reviewer's simple rule, real mouse clicks at normal speed, 1440x900: 3 wins of 3 (72 s with 1 charge taken, 65 s with 1, 74 s with 1 and a plate), headless 39/40. Nobody has zero reaction. With 0.45 s and 0.15 s lag it's 25/40 and 10/20, so about 2 tries for someone who reads the bar perfectly, about 3 for steady hands, and many for the average bot, which doesn't learn. Whether that's "a few tries" needs Dylan's thumb.

A relaxed tap rate, 0.8 s reaction, 40 seeds. Before: 1 tap a second died in wave 1 of stage 2 every time, at 1.5 it was flawless. Now:
```
1 tap/s    S1 35/40 (1.7 hits, plates)   S2 0/40, dies in wave 2 at 51 s
1.2 tap/s  S1 40/40                      S2 5/40, dies in wave 3 at 72 s
1.5 tap/s  S1 40/40                      S2 40/40 (0.3 hits)
```
So stage 1's last wave now warns you, and the wall has become a slope, but a steep one, and only over about half a tap a second. A panicking person speeds up, and the bot doesn't, so this needs a thumb. (The review says heat can't climb below 1.33 taps a second. The sums say 0.75: one throw every 1.33 s holds steady. The measured results it gives are right.)

Salvage per stage clear, plain bot, 10 seeds, no upgrades (stages 1 to 5):
```
Cash in every time:  16.6, 23.7, 27.0, 26.7, 24.9
Bet half every time: 20.6, 29.3, 33.0, 30.3, 27.2
Let it ride always:  24.6, 35.2, 39.0, 32.7, 29.6
```
All inside the kit's 15 to 40. The clean thumb, default betting, 40 seeds: 30, 36, 38, 30, 19 (it takes more hits at the boss). Every upgrade at level 3, Let it ride, plain bot, 12 seeds: 31.4, 45.9, 48.8, 48.4, 43.8 (the review's was 48.8, 63.8, 66.7, 65.5, 55.5). Still over 40 with all upgrades bought; I left that as what they buy.

Keys, real presses in the real page, 1440x900: lone plate, Space x10 at 350 ms: 5 throws, plate dead (was 0 throws). Marked plate, cold, Space once: dead, no heat (was nothing). Whole of stage 1, Space only, about every 345 ms of game time at 3x: won, 0 hits. Stage 2 the same: lost to 5 burns, as it should be: that's mashing. Space only while the bar doesn't say wait: stages 2, 3, 4 won with no hits; boss 2 wins in 7 attempts. Game speed was 3x, as in the review's run, so this isn't a person's fingers.

A tap on a grunt in front of a shut shield, the review's cases, 75 taps each, all 9: 75 to the grunt, 0 to the shield (was 15 to 20 to the shield). A shut shield on its own still takes the tap.

A marked shut vent through `HH.throwAt`: heat stays 30, mark stays 5, it clangs. Vent state the moment Ashka marked it, clean bot, 10 boss runs: open 63, whistling 21, shut 0.

The tab hidden between a wave clearing and the card, 6 riding: table 19 pays at once, 19 banked (was 0). Coming back the card reads "You walked away from the table, so Juno scooped it up: +19 safe. Nothing rides on the next one.", and its button goes on with nothing riding.

A first-time line queued, then dropped as stale: not marked as taught; said again next attempt: marked. Checked by stepping those states, not by repeating the review's 40 runs.

Lose lines after a burn, 400 draws: street stages Kaito 68, Bram 77, Ione 82, Juno 80, Silas 93. Boss: 192 to the kit's list (Krell's five), the rest shared among the five burn lines.

`tools/fairness.js --only bet`: PASSED; 85 bets won, 0 paid other than the promise (biggest stake 6, fullest table 20). `--only threats`: PASSED, every warning at least 0.8 s, on screen, and a tap at 95% of it still stops it.

Screenshots looked at, in `%TEMP%\kcheck\hot-hand\fix2`, at 568x320, 844x390 and 1440x900: boss start and open vents (helmets and a hand over each plate, Krell whole with both feet in frame at 568x320), boss talk, stage talk (chips clear of the box), the two-line hint at 568x320, a kill paying COG and TABLE and a number (all three read), a hurt number beside her with Ashka on the other side, Ashka over Juno in the Pit (her hair is clear), the bet card at 1440x900 (small lines 16 px, was 12).

Not checked: a real phone, feel, motion, sound, and Endless after these numbers beyond the smoke test.

## What was checked, with the real results (2026-11-06, after the review fixes)
The numbers from before the review fixes are in the archive at the end of this file.

`node tools/smoke.js hot-hand`: **PASSED, 165 checks ok, 0 failed**, at phone 844x390, computer 1440x900, small phone 568x320. `node tools/smoke.js storm-run`, because `shared/kit/kit.css` changed: PASSED, 165 ok.

**The fairness script, `tools/fairness.js`,** drives the game's real tap handling, with all 24 pictures in the folder (rules don't read them). "Reaction" bots can't act on a thing until it has been showing that long, tap at a person's rate, miss their spot by a few px, sometimes pick badly, and now and then tap when the bar says wait. New since the review: their thumb arrives late (`lag`, 0.1 to 0.2 s), landing where the thing was seen.

Who wins, 20 seeds a stage, no upgrades, default betting (hits a run in brackets):
| | S1 | S2 | S3 | S4 | Boss |
|---|---|---|---|---|---|
| Plain bot, perfect timing | 20/20 (0) | 20/20 (0) | 20/20 (0) | 20/20 (0.2) | 20/20 (0.9) |
| Clean thumb: 0.45 s, 0.15 s lag, never goes red | 20/20 (0) | 20/20 (0) | 20/20 (0) | 20/20 (1.1) | 18/20 (2.2) |
| Quick thumb: 0.3 s, 0.1 s lag, some slips | 20/20 (0) | 20/20 (0.9) | 20/20 (0.8) | 20/20 (1.0) | 12/20 (3.4) |
| Steady: 0.45 s, few slips | 20/20 (0) | 20/20 (0.5) | 20/20 (1.0) | 19/20 (1.6) | 9/20 (3.5) |
| Average: 0.45 s, more slips | 20/20 (0) | 20/20 (1.3) | 20/20 (2.6) | 20/20 (1.9) | 3/20 (4.0) |
| Slow: 0.6 s, most slips | 20/20 (0) | 20/20 (1.6) | 19/20 (2.1) | 10/20 (3.1) | 3/20 (4.0) |
| Refuses to go above heat 53 (WARM) | 20/20 (0) | 14/20 (3.1) | 16/20 (1.7) | 2/20 (3.8) | 0/20 (3.0) |
| Refuses to go above COLD | 20/20 (0) | 0/20 | 0/20 | 0/20 | 0/20 |
| Button masher, ignores the bar | 20/20 (0) | 20/20 (2.8) | 8/20 (3.8) | 20/20 (3.2) | 0/20 (5.0) |

Salvage a run, same order of bots, for the three that show the reward best:
| | S2 | S3 | S4 | Boss |
|---|---|---|---|---|
| Clean thumb, playing near the top (average heat 54 to 69) | 44 | 46 | 37 | 23 |
| Refuses to go above heat 53 | 25 | 31 | 15 | 11 |
| Average, near the top with slips | 28 | 23 | 29 | 11 |

So staying out of HOT no longer pays on stages 2 and 3: it costs about 3 and 2 hits a run and earns about two thirds or less of what a clean run near the top does. The risk is real too: the average bot's burns cost it a third to a half of that salvage on those two stages. Stage 1 stays easy on purpose, and every bot still takes 0 hits there. **Not as clean as I wanted:** the bot that refuses to go above 53 does no worse on stage 3 than on stage 2 (14/20 and 16/20), though most others do (average 1.3 to 2.6 hits, masher 20/20 to 8/20), and it still falls off sharply at stage 4 (2/20), because the Pit's slow cooling needs the top of the bar. A real person changes how they play, and that bot doesn't, so only a thumb can say if it's a cliff.

The boss: about 9 in 10 for a clean thumb that never goes red, about 1 in 2 for steady hands, about 1 in 7 for average. Burns are still a big part of what kills the average bot (2.8 a run). A clean player will still often win first try. Whether that's "a few tries" needs Dylan's thumb.

Warnings, each threat on its own, tapped through the real input at 25%, 50%, 75% and 95% of the way through the warning:
```
trooper swing                      warned   0.9 s  starts at x 134  all four: stopped
plate swing                        warned   0.9 s  starts at x 134  all four: stopped
hook wind-up and flight            warned  2.38 s  starts at x 313  all four: stopped
window bolt                        warned  3.02 s  starts at x 348  all four: stopped
powder cart fuse                   warned   1.4 s  starts at x 170  all four: stopped
Hollow bite                        warned   0.8 s  starts at x 418  all four: stopped
the charge                         warned  1.62 s  (and the line walks at you in plain sight for 17 s first)
quench can (heat only, no damage)  warned  2.52 s
```
Those tap the exact current position, which is why the review found they proved less than they seemed to. Things in the air now have their own check, below. (Plate, hook-man and Hollow cases are with her hot enough for the throw to get through; a cold throw at a plate bounces by rule, and that hit does land.)

Burning things in the air with a thumb that arrives late. Share of each flight where a tap at the seen position still connects, through the real `HH.pick`:
```
hook from far     312 px/s  lag 0.1 s 100%, 0.15 s 100%, 0.25 s 100%, 0.35 s 100%   (the review measured 1%, 1%, 1% at 0.1, 0.15, 0.25)
hook from near    213 px/s  100% at all four                                        (84%, 3%, 3%)
bolt, window 3    310 px/s  100% at all four                                        (29%, 3%, 3%)
bolt, window 6    516 px/s  100% at all four                                        (0%, 0%, 0%)
quench can        362 px/s  100% at all four                                        (0%, 0%, 0%)
```
Played with the average bot on the boss, 10 seeds: things in the air burned 26 of 33 at 0 s lag, 26 of 38 at 0.1, 30 of 37 at 0.15, 30 of 40 at 0.2, 22 of 36 at 0.25. The misses that remain are it choosing something else or being locked, not taps missing. This is a bot's thumb on a computer; a real thumb still needs trying.

The clean bot's boss wins dropped with lag even after that: flames were clanging off vents that had just shut. So a vent now takes a tap for 0.25 s after shutting. Wins at 0, 0.1, 0.15, 0.2, 0.25 s lag, 30 seeds: before 30, 28, 24, 21, 22; after 30, 29, 29, 29, 26.

Nobody playing, 10 seeds a stage: every stage lost, and every hit that landed had at least 0.8 s of warning. A hit can't land twice inside 0.6 s.

Tap targets: smallest seen 50 x 54 logical px, **44.4 x 47.9 CSS px on a 568x320 phone**. Things in the air 60 logical px, 53.3 CSS px. Kit buttons at 568x320 measured with `getBoundingClientRect`: 44 on the title, upgrades, stage list and pause in Hot Hand, Storm Run and Silent Cut, with no screen overflowing (the upright games were already 44 or more).

Talk box in play: 47 lines, longest 59 characters, and it clears Juno's feet and the heat bar at all four screen sizes. Lines shown on real runs in story order on a new save with the average bot, stages 1 to 5, then a retry of 2: 7, 9, 7, 6, 20 and 5, with **none** replaced within 2 s (the review counted 13 of 26 on stage 5). First-time lines said: 2, 4, 2, 1, 1, 0, so each is said once, ever.

The bet, through the real screens, starting at 0 salvage: 3 choices offered with an empty bank (`Cash in +4 safe`, `Bet half +2 safe, 2 rides for 4`, `Let it ride 4 rides for 8`); a hit while riding shows BUST for 1.8 s with 4 gone; bank stays at 0; next card says "Bet lost: 4 gone."; Cash in pays at once; a clean wave pays 4 into 8, table 12; a later bust leaves paid salvage alone. **86 bets won across all stages and Endless, 0 paid anything but the promise** (biggest stake 8, fullest table 25). A card with more on the table than the house takes, as shown: `Cash in +23 safe`, `Bet half +19 safe, 4 rides for 8`, `Let it ride +15 safe, 8 rides for 16`, and the text says "The house takes 8 at most: the rest is paid out safe." A hidden tab with the card up banks the table straight away, and the card comes back reading "You walked away from the table, so Juno scooped it up: +23 safe. Nothing rides on the next one." with one button; pressing it bets nothing and goes on.

Salvage per stage clear, plain bot, 10 seeds, no upgrades (stages 1 to 5, average):
```
Cash in every time:  16, 28, 30, 29, 28
Bet half every time: 23, 36, 38, 35, 29
Let it ride always:  29, 44, 46, 43, 30
```
The kit asks for about 15 to 40. The top end goes a little over, for someone who rides every bet and takes no damage. On a win, Let it ride now pays more than Bet half, and Bet half more than Cash in, at every step.

Other runs:
- A burn taken on stage 1 is still there on stage 2 after Menu, Story, stage 2 (1 to 1).
- Upgrades at level 3 against a fair run: cooling 1 to 1.45, bet 2 to 2.75 times, hot burn 58 to 101.5 px, warm burn 0 to 44 px, hot damage 3 to 4, lock 1.5 to 1.05 s. A fair run sees the base numbers.
- Pals with their chances forced to 100%, real taps: Cinderbun caught 10 of 10, Dicemite 10 of 10. At their real chances, average bot, nothing caught, attempts of 20 a stage where one came: stage 2 Cinderbun 2, Dicemite 3; stage 3 1 and 3; stage 4 3 and 3. That's 15 of 60, against the review's 39 of 60 (a different bot and betting, so a rough comparison).
- Stand-in pictures served for all 24 keys in `art/REQUEST.md`: 24 load, and all 24 get drawn across a win, a burn-out and a lost run on every stage. A missing picture falls back to code without a sound; the 24 real ones are on as of today.
- Endless, plain bot, 3 seeds: wave 15, 12 and 15, then lost. No stall. Salvage 144 to 180 a run.
- Space and Enter each throw at the most urgent target.
- Draw time with the CPU slowed 6 times, 844x390, pictures on: stage 4 median 3.4 ms, 95th percentile 5.9 ms, worst 139 ms; boss median 3.3 ms, 95th percentile 4.4 ms, worst 23 ms. This measures issuing the drawing, not the graphics chip, and other games were being tested on the same machine, so the worst frame is rough.
- Screenshots looked at for the review fixes, at 844x390, 568x320 and 1440x900 where it matters: title with the ledge, stage talk with Juno whole above the box, boss talk, Krell's portrait, ending talk, the card over the limit, the card after a hidden tab, hit flash on trooper, plate, Hollow, shooter and Krell, chips in the throw, hot and down poses, Ashka beside a mark and a shield.
- Reviewer's probes re-run: a throw at heat 80 is safe (heat after 96, no burn), two flames at a nearly full vent pay 150 and 1 chip once, over the top at a shut vent burns Juno 6 to 5 and kills a grunt 138 px off. Ashka still flies near signs at times (stage 1: 12 of 340 warning frames), but she's drawn under them now, so they stay on top.

## What a test can't tell, and needs Dylan's thumb
- **Whether holding the top of the bar is fun.** It's the whole game. The band is half a second wide on purpose; it may want to be wider. `edgeAt`, `throwHeat` and `cool` are the three numbers.
- Whether a thumb covering the screen hides what it's about to tap, and whether foes in the far lane are easy to hit.
- Difficulty. Whether stage 1 is easy for a new player, whether stages 2 and 3 are too easy, whether the boss takes "a few tries". The bots only prove it can be done.
- Whether the bet feels like a real temptation, now that it's honest. Only 8 of a 23 table can ride, so the rest is always safe. A person has to want to press Let it ride.
- Whether the warnings can be seen in the thick of it. A script proves there's time, not that an eye finds them. The "!" signs overlap when two foes stand side by side.
- The music and effects. Checked that they play without error, not that they sound good. The music is meant to be a dirty saloon shuffle; that's an intention, not something I've heard.
- Motion: Ashka's flight, the Hollows' bounds, the fire. Checked in still frames only.
- The dialogue's timing in play.
- A real phone: only Chrome pretending to be one has run this. Weakest-device speed and touch delay are unmeasured.

## Provisional numbers to confirm
All in `tuning.js`, marked PROVISIONAL. The ones most likely to change: `throwHeat`, `cool`, `warmAt`, `hotAt`, `edgeAt`, `lockSecs`, `afterLock`, `blowoutR`, `blowoutDmg`, `ramHurt`, `burnHurt`, `markEvery`, `markRefund`, `tellSecs`, `foes` speeds, every stage's `waves`, `tough` and `cool`, `ventNeed`, `ventOpen`, `ventShut`, `marchSecs`, `krellHp`, `addEvery`, `quenchEvery`, `purse`, `purseMaxExtra`, `betLimit`, `cogEvery`, `cinderChance`, `diceChance`. Sourced, not provisional: `betX` 2 (spec: double or nothing), `minHalfW` and `minTall` (the 44 px rule), heights (`CAST.md`, `FRIDAY_BATCH.md`).

## Calls Claude made (change any)
- **The story:** Juno was winning at cards for the Gullwake's keel money when the raid flipped her table. Up Card Row, Dice Alley and the Long Table to the Pit, where the Sever has every partner on the island caged for stripping, then Krell's vault steps. The ledger in the vault is a hook for later. Stage names and every line of dialogue. Ione's "I wrote that page of the manual" uses her backstory in `CAST.md`.
- **Krell's voice:** a bored jailer who counts people like stock, with a form for everything. He had no voice on paper.
- **The stake is the table, not your saved salvage.** This is the big call on the bet; the reasons are above.
- **Going over the top still throws, as a blowout.** The spec only asks for a lock and a burn. I added this so that going over can be a choice, not only a mistake.
- **Burns last the story run**, showing on the palm and lengthening the lock a little. The spec doesn't ask for this. It's small, and easy to take out (`lockPerBurn`).
- A hit with a bet riding loses it at once. Walking out mid-wave (Restart, Quit) forfeits that wave's table and anything riding; dying does too. Salvage already cashed always stays. Cogs (1 salvage per 10 kills, paid at once) mean a lost attempt still earns something.
- Hiding the tab with the card up, or in the moment between a wave clearing and the card, counts as cashing in, because a phone may never come back. Coming back, the card has changed to say so, with one button and nothing to bet.
- Tiers, including the HOT HAND band and its name on the bar. Hits per attempt (6 on stages 1 and 5, 5 otherwise).
- What a mark does: no heat, one tier harder, 12 heat off.
- The foes beyond the spec's troopers: plate-carriers, runners, hook-men, window shooters, powder carts, squads, small Hollow hounds (cut down from `hollow-hound-sheet-v3.png`, whose look they follow).
- Rain, fire and Juno in the middle of the Pit as what changes between stages.
- The boss's details: three shields one per lane, the pressure gauge over each, re-raised shields keeping half their pressure, the charge, quench cans (heat only, no damage, so you might want one to land).
- Cinderbun: from stage 2, after 14 s at HOT or better in one attempt, a 12% chance once per attempt; touch it at the very top of the heat (78 or more). Dicemite: from stage 2, when a wave starts with 6 or more riding (the house's whole limit), a 12% chance; tap on a six, 3 wrong tries and it runs. Bosses have neither. Catching costs no heat. A pal only takes a tap if it's nearer the thumb than the body it's walking past.
- Upgrade detail: Cool Palms also shortens the lock. Bigger Flame: level 2 lets WARM burn too, level 3 adds 1 hot damage. Loaded Deck pays 2.25, 2.5, 2.75 times on the same size of bet.
- On a computer, Space or Enter throws at the most urgent target, as a click needs a mouse.
- The title uses the existing Ashmarket picture, with Juno and Ashka in front of it, on a ledge of code-drawn planks and rock. If the picture fails, the code street shows. On the talk and ending screens the painting shows alone.
- Juno's jacket: `shared/kit/cast.js` has it olive, her locked sheet has it dark brown with cream fur. This game sets her colours to the sheet, on its own page only (`people.js`). Nothing in the kit was touched.

### Calls made fixing the review (2026-11-06)
- **The house limit moved from the table to the bet.** The old one quietly cut winnings after the card promised them. Now the most that can ride is 8, the card says so when it applies, and what's over it is paid out safe. Bet half is half of what the house would take, so Let it ride always pays more than Bet half on a win. Other ways out were telling people about the old cap, which leaves the last bet not worth making, or no limit at all, which lets Endless double for ever.
- **Stage numbers changed.** Stages 2 and 3 are `tough: 2` (was 1), so WARM takes two throws and HOT one. Stage 2 has fewer foes with wider gaps to make up for it. Stage 3's rain is 1.25 (was 1.5, which made it easier by giving more throws), with more foes, closer together. The purse is 4 with up to 4 more for hot play (was 5 and 3), and a cog is every 10 kills (was 8).
- **The boss's charge comes sooner:** 17, 15, 13 s (was 24, 21, 18). Nothing else about him changed, so that his danger comes more from him. I tried more hits per charge, more health and stronger vents too: they either barely moved the clean bot or started to beat the plain bot.
- **A tap on a thing in the air counts for where it was in the last 0.35 s.** So a tap on a trooper a bolt has just flown past burns the bolt, not the trooper. It's still a threat stopped. Slowing them down was the other way; this keeps the speed.
- **A vent takes a tap for 0.25 s after it shuts.** The review didn't ask for this. It's the same late thumb, and the measured win drop came from it.
- **Lines in play wait their turn:** each gets 2 s up, and one that has waited 3 s gives way to a newer one. The first-time lines are remembered in the shared save, as `hotHandTaught` in settings, so a new save hears them again.
- **Cinderbun needs the very top of the heat,** not just HOT, which is what stops an accidental catch. Bram's line says so. Chances are provisional.
- **Ashka hovers 54 px to the side of her target,** toward Juno, and all signs and gauges draw over her.
- **In a talk scene the street is lifted** until Juno's feet clear the box, with dark ground under it. So the sky gets cut off at the top, and on a small phone about a quarter of the street goes.
- **A hit makes the figure itself go white** for its 0.14 s. The shield's own flash is still a rectangle: see "Noticed, not touched".
- **Krell's portrait faces front,** like the crew's: `art/krell-portrait.webp`, made fresh from his working sheet (see "Krell's portrait" below). The live cut from `krell_stand` stays as the fallback.
- Her chips moved to 50 px behind her and a little nearer us, so nothing stands or lies on them.
- First-time line at the top of the bar: "Gold on the bar: the hot hand. Best throw I've got. Throw!". Ending card: "...and her palms back under her gloves."
- `tuning.js` was over 200 lines with the numbers it was missing, so the boss, stages and Endless went to `tuning-stages.js`. `foes.js` split the same way (`air.js`), and `tools/fairness.js` into four parts.

### Calls made fixing the second review (2026-11-06, evening)
- **Going over the top is no longer a good deal.** Lock 1.8 s (was 1.5), heat 74 when it lets go (was 56), blowout 110 px and 1 damage (was 170 and 2), and a burn gives no moment of safety (other hits still do). So "a hit can't land twice inside 0.6 s" now has one exception: a swing right after a burn. All this only changes things for someone who goes red: the never-red bots hardly moved.
- **The charge does 3 hits, not 2,** and grunts come round the line a bit quicker (2.6, 2.3, 2 s; were 3, 2.6, 2.2). Picked between runs of several options, because more pressure in the vents also hit the plain bot and the slips bots hard. The numbers to change if he's wrong: `ramHurt`, `addEvery`.
- **Dice Alley's first wave has its own `tough: 1`,** and Card Row's last wave is quicker with one more trooper and one more plate. Dice Alley stays 2 after that.
- **Bets:** 6 at most (was 8), 4 on Card Row, table's hot extra 3 (was 4). **Loaded Deck no longer raises the limit**, only the payout. So its blurb lost "and the house takes a bigger bet". Dicemite's stake went from 8 to 6 to stay "the house's whole limit".
- **Space and Enter:** when nothing a flame can get through is on screen, the key throws at a plate anyway (it bounces and warms her, as a tap would). A shut vent or a Hollow's shut plates still get no key throw: a tap can do it if someone wants, but a key shouldn't waste heat for them.
- **Ashka only marks a vent that's open or whistling,** not a shut one. A marked throw that clangs costs nothing and leaves the mark, so the first-time line stays as it was. That also covers a Hollow marked with its plates shut.
- **A tap goes to anything a flame can get into before a shut vent or shut Hollow,** whichever centre is nearer.
- **The shields are now chest high (84 px, were 122), with the man behind them in view.** `shield_man`'s `fill` went from 0.66 to 0.82, which also brings him down to a trooper's size; he'd been drawn larger than the troopers. No new picture. The tap box is his and the plate's 104 px.
- **The whole line starts 28 px further left** (`lineStart` 412, `ramBack` 402), so Krell stands whole on a 16:9 screen, rather than moving him nearer his far shield.
- **Her hurt number starts beside her,** on whichever side Ashka isn't. **"+1 TABLE" and "+1 COG" stack over the target's box,** each on its own line above the damage number.
- **Ashka aims above Juno's head** whenever she's within 62 px of her, heading there, or on her way past.
- **The first-wave hint is 15 logical px** (13.3 CSS px on a 568x320 phone; was 11.1) and stays 9 s (was 7). The longest two hints break onto two lines. That band comes down to about y 95, just above "WAVE 1".
- **`.kit-small` in the kit's big-screen block: 16 px at 95% (was 12 px at 85%).** Every game's choice cards, on a computer only. It's the only thing in the kit that uses that class, in `talk.js`.
- **The earlier `.kit-btn` edit stays.** The review is right that `README.md` line 3 says not to edit the kit. Today's batch instructions allow the smallest additive edit if it's noted and storm-run still passes, and taking it out would drop the small-phone buttons below 44 px. All six games now pass smoke with it. Dylan can overrule.
- **Burn lose lines:** 5 (was 1), never the same twice running. A burn-out at the boss gets a burn line half the time and Krell's list the other half. Bram's Cinderbun cue is now "An ember dumpling, lass! Get the bar to gold, then tap it." and the cold tap floats "TOO COLD".
- **The plain test bot** stops waiting for heat once the line is within 140 px of charging (`botRushX`, plain bot only). The batch asks that a bot beats every boss: it went from 113 to 119 of 120. No person's game changes.

### Calls made fixing the boss's third round (2026-11-06, night)
- **Round 3's march is 16.5 s (was 13), and its vents need 11 (was 13).** Picked from about 150 combinations of `marchSecs`, `ventNeed`, `ventOpen`, `addEvery` and `ramHurt`. 16.5 is the shortest where the patient bot wins at all often: at 16 it won 5 of 60, at 16.5 12 of 60. So the third march is longer than the second's 15 s. Round 3 is still the longest and busiest round, but round 2 now has the most charges.
- **Left alone:** `ramHurt` 3 (at 2 the patient bot won 141/200 and the clean bot 199/200, which took the bite out of the charge), `addEvery`, and `ventOpen` (longer windows didn't help the clean bot, though that may be its wait-for-heat rule).
- **Sela now warns earlier.** "Line's closing, Juno. Blow those vents before they charge!" comes 4.5 s before the warning starts (`ramWarn`), once per march, when there's time to act. At the warning itself she says "They're charging! Finish those vents or brace, Juno!"
- **Rounds 1 and 2 keep their length,** about 40 s for a retry, and "dying restarts the current stage" stands. The difference is that round 2 now holds real danger, so a retry isn't just a walk to the only hard part. Average bot's deaths in round 2 went from 5 of 38 to 36 of 128.
- **The trade-off:** a thumb that never goes red now almost always wins first try (clean 191/200). The number to change if that's too easy: `marchSecs`, third value. At 15.5, 200 seeds: clean 175, steady 123, average 56, patient 14.

## The pictures (2026-11-06)
20 images made with Codex on the ChatGPT plan, 15 keyed into use, plus `trooper_run` copied from Storm Run. Superseded takes kept: `juno-idle-v1` (stiff), `juno-poses-v1` (raised knee looked posed), `krell-stand-v1` (feet together).
One short usage limit hit at about 1:01 PM; it had already cleared by the retry, nothing lost.

Calls Claude made on them (change any):
- Made Krell a working sheet first, since he has six pictures. It stays in `art/raw/`. His face, plates and helmet ear cups are Claude's reading of the description; the ear cups come from the trooper's sheet.
- Baton, not whistle, for `krell_stand`. Crossbow for `trooper_lean`, as REQUEST.md says.
- Code changes to fit the pictures, this game's files only: the fire and mark's glow now sit at places measured per picture (`picHands`, `picMark` in `tuning.js`, throw per frame); with a picture on, only the glow is drawn, as the picture has the mark; the flames are 0.7 times the size and the smoke rises ahead of her face, because her hands are close under it; Krell, `shield_man` and `trooper_lean` draw unflipped; Krell draws in front of the shields once exposed or down; the title uses the `ashka_fly` picture when it's there.
- `fill` is set from head size, so a person stays one size between poses. `cover_table` and `shield_man` have `cx` moved so her shins and his hands stay clear.

Flaws left in, all small:
- Troopers are drawn flipped when walking at Juno, as REQUEST.md asked, so their blade shows on the left hip, not the right as on the sheet. Storm Run does the same. Fixing it means a second set of left-facing pictures.
- Juno's braid shows little in the right-side pictures, which matches her sheet (it's on her far shoulder).
- `juno_lock`'s take had a stray stripe on frame 2, so only frame 1 is used.
- Krell's chest bar is missing from the side views of his working sheet, and shows as a short end in his pictures.
- `juno_idle`, `juno_hot`, `krell_stand`: frames differ very little, so the breath is slight.
- The table reads as a round table more than the round-cornered one asked for.
- Krell's talk portrait (`krell-portrait-v1`): he reads a little angrier than the "bored" asked for, and his eyes are mid-brown, not dark.
- `krell-sheet-v1` came back 1774x887, not the 2048x1024 asked for. It is only a working reference, so it was left.

Checked: smoke (165 checks, PASSED), all 24 sprites load, no page errors or missing files, every picture looked at zoomed in on a colour that shows holes, and screenshots of each stage, each Juno state, each foe stance and each boss state. Foe stances were caught with foes spawned by the test and nobody playing. Not checked: `krell_down` was only caught under the hit flash; motion, in that I looked at frames in order and on a ground line, not at it moving: that needs Dylan's eye. `tools/fairness.js` wasn't re-run then: pictures change no rules, and tap boxes come from the rules, not the picture. It was re-run after the review fixes, above.

## Kit notes
One edit in `shared/kit`: in `kit.css`, on screens under 340 px tall, `.kit-btn` goes from `min-height: 42px` to `44px`, the tap size this game's notes and the batch use. It changes every sideways game on a small phone by 2 px a button. Checked: Hot Hand and Storm Run smoke pass, and Hot Hand, Storm Run and Silent Cut's title, upgrades, stage list and pause fit with no overflow. All six games were smoke-tested after the second review (see below). One thing a later kit version could add: `def.onBank`, a hook just before the kit banks, which `game.js` currently gets by adding its own hidden-tab listener before `Kit.start`.

## Known limits
- Krell has a working sheet but no locked one (`art/raw/krell-sheet-v1.png`, for Dylan to check). His talk portrait (`art/krell-portrait.webp`) comes from that sheet, so a changed sheet means a new portrait. If the picture is missing, a side-view cut of `krell_stand` shows, and if that's missing too, the kit's code bust.

## Krell's portrait
`art/krell-portrait.webp` (216 px, as the crew's small portraits) from `art/raw/krell-portrait-v1.png`, first take, no redo, prompt in `art/prompts/krell-portrait-v1.txt` (the same wording as Silent Cut's Maro portrait, with his look). References: `art/raw/krell-sheet-v1.png` for him, `art/site/crew/bram-v2-raw.png` for style and crop. Wired by `img` in his `Kit.speakers.add` in `game.js`, not `art/sprites.js`, because talk portraits don't go through `Kit.art`; no kit file changed. Status: built, not yet seen by Dylan. Calls: made fresh rather than cut from the sheet, because the sheet's head is only about 120 px tall; made without waiting for his sheet to be locked. Checked: `tools/smoke.js hot-hand` passed; screenshots of the boss talk at 844x390, 568x320 and 1440x900, the in-play line, and with the picture blocked (the `krell_stand` cut shows, no page errors).
- At 568x320, a two-line talk box comes down to y 292: clear of Juno's feet and the table, by about a pixel at the table's foot.
- A flame's fire position over Juno's pictures is measured from the pictures (`picHands`), for frame 1 of each strip; a person may want to nudge it.

## Noticed, not touched
- "ASHKA -12" floats at a fixed spot over Juno, so it can land on Ashka, orange on her red. Same kind of thing as the hurt number; the review didn't name it. Seen in `fix2\p568-pit-ashka.png`.
- Two or three "+1 TABLE" from one kill (a marked, hot, hot-hand kill) start on the same spot, so they read as one.
- `art/REQUEST.md` still lists `shield_man` with the first numbers it was asked for; `art/sprites.js` is what the game uses.
- Stage 1's "TAP" arrow, shown until the first throw, draws over the "!" of the trooper it points at. It's only until the first throw.
- A shield's hit flash (`line.js`) is still a plain rectangle, a little outside its cut corners, for 0.2 s. The review named the ovals, not this.
- The title's ledge and the talk scene's lift are code art made today; they need Dylan's eye.
- `shared/kit/cast.js` has Juno's jacket olive against `juno-sheet-v5.png`'s dark brown with cream fur. Worth fixing there if she appears in another game.
- `docs/FRIDAY_BATCH.md` lists Hot Hand's shape as 5 stages and waves but doesn't say how many waves; 3 each was my call.
- Cool Palms at level 3 drops the patient bot at the boss from 4 of 40 to 0 of 40 (average heat 52 to 26), while it helps steady and average. It may only be the bot, which waits to get hot before feeding a vent, but a slow player could feel it too: the upgrade cools her below the heat the vents reward. Not checked with a thumb.

## Archive: wording and numbers replaced by the review fixes (word for word)
### The results as they stood before them. They used the old numbers, and every run was played on the rules as they were then
## What was checked, with the real results (2026-11-06)
`node tools/smoke.js hot-hand`: **PASSED, 165 checks ok, 0 failed**, at phone 844x390, computer 1440x900, small phone 568x320. That covers gate first, every stage won by the bot on 3 seeds with no upgrades, every stage lost with nobody playing, real touch and keys, pause, hidden tab, sound and mute, buying upgrades, the switch, catch moment, saved progress after reload, wrong-way phone prompt, no sideways scroll, no page errors.

**The fairness script, `tools/fairness.js`,** drives the game's real tap handling. "Reaction" bots can't act on a thing until it has been showing that long, tap at a person's rate, miss their spot by a few px, sometimes pick badly, and now and then tap when the bar says wait.

Who wins, 20 seeds a stage, no upgrades (`average` means reaction 0.45 s, 2.8 taps a second):
| | S1 | S2 | S3 | S4 | Boss |
|---|---|---|---|---|---|
| Plain bot, perfect timing | 20/20 | 20/20 | 20/20 | 20/20 | 20/20 |
| Quick thumb, 0.3 s | 20/20 | 20/20 | 20/20 | 20/20 | 19/20 |
| Average, 0.45 s | 20/20 | 20/20 | 20/20 | 20/20 | 19/20 |
| Slow, 0.6 s | 20/20 | 20/20 | 20/20 | 20/20 | 11/20 |
| Refuses to go above WARM | 20/20 | 20/20 | 20/20 | **1/20** | **3/20** |
| Refuses to go above COLD | 20/20 | **0/20** | **1/20** | **0/20** | **0/20** |
| Button masher, ignores the bar | 20/20 | 20/20 | 20/20 | 17/20 | **0/20** |

Average heat for the plain bot: 10, 56, 36, 67, 79. So playing hot is required from stage 4, cold fails from stage 2, and mashing kills you at the boss with 5 burns a run. **The bots are better than people at this** (they read the bar perfectly), so these numbers say it can be done and heat matters, not how hard it feels. Stage 2 and 3 look on the easy side for anyone who holds the bar; only a thumb can say.

Warnings, each threat on its own, tapped through the real input at 25%, 50%, 75% and 95% of the way through the warning:
```
trooper swing                      warned   0.9 s  starts at x 134  all four: stopped
plate swing                        warned   0.9 s  starts at x 134  all four: stopped
hook wind-up and flight            warned  2.38 s  starts at x 365  all four: stopped
window bolt                        warned  3.02 s  starts at x 278  all four: stopped
powder cart fuse                   warned   1.4 s  starts at x 170  all four: stopped
Hollow bite                        warned   0.8 s  starts at x 418  all four: stopped
the charge                         warned  1.62 s  (and the line walks at you in plain sight for 24 s first)
quench can (heat only, no damage)  warned  2.52 s
```
This found two real bugs, both fixed: a hook-man or shooter killed by a flame already in the air could still throw, and a tapped cart could still go up on her. A flame on its way now counts: if the tap was in time, it's in time. (Plate and Hollow cases are with her hot enough for the throw to get through; a cold throw at a plate bounces by rule, and that hit does land.)

Nobody playing, 10 seeds a stage: every stage lost, and every hit that landed had at least 0.8 s of warning (troopers and runners 0.9, Hollows 0.8, bolts 3.02). A hit can't land twice inside 0.6 s.

Reaction sweep, 10 seeds a stage, 3 taps a second, no bad picks and no misreads: at 0.3, 0.45, 0.6 and 0.8 s, stages 1 to 3 and the boss won 10/10 with at most 0.5 hits a run. The Pit is the one that reaction time bites: 10, 9, 10 and 8 of 10.

Tap targets: smallest seen 50 x 54 logical px, **44.4 x 47.9 CSS px on a 568x320 phone**. Things in the air 60 logical px, 53.3 CSS px.

Talk box in play: 47 lines, longest 59 characters. Measured at four screen sizes with the longest line: it starts at y 292 or lower and x 311 or further right, so below Juno's feet (288) and right of the heat bar (276). Tightest is the 568x320 phone, where the cover table's foot ends at about y 291.

The bet, through the real screens, starting at 0 salvage: 3 choices offered with an empty bank (`Cash in +5 safe`, `Bet half +3 safe, 2 rides for 4`, `Let it ride 5 rides for 10`); a hit while riding shows BUST for 1.8 s with 5 gone; bank stays at 0, not below; next card says "Bet lost: 5 gone."; Cash in pays at once; a clean wave pays 5 into 10, table 15; a later bust leaves paid salvage alone (15 to 15). A hidden tab with the card up banks the table straight away (5 of 5).

Salvage per stage clear, plain bot, 10 seeds, no upgrades (stages 1 to 5):
```
Cash in every time:  20-21, 28-29, 27-31, 23-32, 25-26
Bet half every time: 27-29, 38-39, 36-43, 27-44, 37-38
Let it ride always:  37-37, 40-40, 41-41, 16-42, 35-36   (16 is a run where a bet was lost)
```
The kit asks for about 15 to 40. The top end goes a little over, for someone who takes no damage.

Other runs:
- A burn taken on stage 1 is still there on stage 2 after Menu, Story, stage 2 (1 to 1).
- Upgrades at level 3 against a fair run: cooling 1 to 1.45, bet 2 to 2.75 times, hot burn 58 to 101.5 px, warm burn 0 to 44 px, hot damage 3 to 4, lock 1.5 to 1.05 s. A fair run sees the base numbers.
- Pals with their chances forced to 100%, real taps: Cinderbun caught 10 of 10, Dicemite 8 of 10 (it has to be a six).
- Stand-in pictures served for all 24 keys in `art/REQUEST.md`: 24 load, and all 24 get drawn across a win, a burn-out and a lost run on every stage. With none, everything draws in code (that's how it is now, and how all the runs above were played).
- Endless, plain bot, 3 seeds: wave 18, 12 and 15, then lost. No stall.
- Space and Enter each throw at the most urgent target.
- Draw time with the CPU slowed 6 times, 844x390: stage 4 median 4.4 ms, 95th percentile 7 ms, worst 76 ms; boss median 4.4 ms, 95th percentile 6.7 ms, worst 35 ms. This measures issuing the drawing, not the graphics chip.
- Screenshots looked at: title (three sizes), talk, ask card, bust, doubled, result, ending, upgrades, each of the five stages in play, HOT HAND, TOO HOT, locked, tells, hook in the air, shooters in windows, cart, Hollows in all three stances, the line with vents shut, whistling and open, quench can, CHARGE, Krell exposed, Dicemite, three burns on the palm, Juno down.

### Single lines replaced
- | `tuning.js` | Every number, each marked PROVISIONAL or with its source |
- | `foes.js` | Lanes and depth, tap boxes, every foe's behaviour, things in the air |
- | `tools/fairness.js` | The fairness script. `node games/hot-hand/tools/fairness.js` |
- | `art/sprites.js`, `art/REQUEST.md` | Empty for now; the exact pictures the game will use, and the lines to paste |
- - **Going over the top.** That throw still flies, as a blowout that burns everything within 170 px.
- **The bet can't trap anyone or go below zero, because it never touches your saved salvage.** It stakes the table: what this wave has earned, not paid out until you cash in. So someone with 0 salvage bets the same as anyone, Cash in is always there, and salvage once paid is never taken back. The table is capped by a house limit so a stage stays near the kit's 15 to 40.
- | 2 Dice Alley | Two lanes, every foe takes more damage, runners, hook-men, squads | Cold stops being enough. Bunched squads make the burn pay. Burn hooks in the air |
- | 3 The Long Table | Rain: she cools 1.5 times as fast. Shooters in the top windows. Powder carts |
- - Whether the bet feels like a real temptation. I think yes, but a person has to want to press Let it ride.
- `purse`, `houseLimit`, `cogEvery`,
- - Hiding the tab with the card up counts as cashing in, because a phone may never come back. Coming back, the card is still up but nothing's left to bet.
- small Hollow hounds (cut down from `hollow-hound-sheet-v1.png`, whose look they follow).
- - Cinderbun: from stage 2, after 8 s at HOT or better in one attempt, a 40% chance once per attempt; tap it while HOT. Dicemite: from stage 2, when a wave starts with 10 or more riding, a 40% chance; tap on a six, 3 wrong tries and it runs. Bosses have neither. Catching costs no heat.
- Loaded Deck pays 2.25, 2.5, 2.75 times and raises the house limit by 5 a level.
- - The title uses the existing Ashmarket picture, with Juno and Ashka in code in front of it. If it fails, the code street shows.
- `tools/fairness.js` wasn't re-run: pictures change no rules, and tap boxes come from the rules, not the picture.
- Nothing was forked or changed in `shared/kit`, so `tools/smoke.js storm-run` wasn't re-run for this game. One thing
- - Krell's talk portrait is the kit's plain code bust, and he has no reference sheet (see `REQUEST.md`).
- - Krell's talk portrait is still the code bust.
- - **Krell's portrait is cut live from `krell_stand`,** so no new image file. A proper front-facing cut from his working sheet would look more like the crew's: listed for the picture job.
- - Krell's talk portrait is cut from `krell_stand`, not drawn for the job, so it's a side view.
- - Krell has a working sheet but no locked one (`art/raw/krell-sheet-v1.png`, for Dylan to check). His talk portrait is cut at draw time from his own `krell_stand` picture, so he's in side view where the crew face front. If the picture is missing, the kit's code bust shows.

### Lines replaced by the second review's fixes (2026-11-06, evening)
- - **Going over the top.** That throw still flies, even at a shut vent, as a blowout that burns everything within 170 px. Then her hands lock for 1.5 s, she takes a burn hit, and any bet riding is lost. Sometimes that's worth it, on purpose. Each burn
- **The house takes 8 at most on one bet** (2 more per Loaded Deck level). When the table holds more, the card says so and the rest is paid out safe, so a bet always pays exactly what the card and the top of the screen promise. That keeps a stage near the kit's 15 to 40, and stops Endless doubling for ever. A hot wave puts up to 8 on the table against a cold wave's 4, so the heat pays on the table.
- | 1 Card Row | Three lanes, troopers die to one cold throw, plates at the end | Learn to tap; plates teach that cold fire bounces. Easy on purpose: heat barely matters yet |
- | 2 Dice Alley | Two lanes, every foe takes 2 more damage, runners, hook-men, squads | A trooper now takes two WARM throws but one HOT one, so this is where the heat starts to pay. Bunched squads make the burn pay. Burn hooks in the air |
- Three rounds, with a bet between them. Quench cans take your heat from round 2. If the line reaches you it charges: 2 hits |
- Salvage already cashed always stays. Cogs (1 salvage per 8 kills, paid at once) mean a lost attempt still earns something.
- - Hiding the tab with the card up counts as cashing in, because a phone may never come back. Coming back, the card has changed to say so, with one button and nothing to bet.
- Dicemite: from stage 2, when a wave starts with 8 or more riding (the house's whole limit), a 12% chance;
- Loaded Deck pays 2.25, 2.5, 2.75 times and raises the most the house will take by 2 a level.
- Other games weren't smoke-tested for it, as they're being worked on at the same time.

### Lines replaced fixing the boss's third round (2026-11-06, night)
- `marchSecs: [17, 15, 13],      // PROVISIONAL: seconds from start to ram`
- `ventNeed: [9, 11, 13],  // PROVISIONAL: pressure that blows a shield`
- `ram: { who: 'sela', text: 'They\'re about to charge! Blow those vents!' },`
