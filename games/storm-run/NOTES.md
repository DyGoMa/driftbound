# Storm Run: notes

Status: built, not yet seen running by Dylan. This game is also the one the other five builders copy.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, as it comes, with this game's scripts at the end |
| `tuning.js` | Every number, each marked PROVISIONAL or with its source |
| `words.js` | Everything anyone says: talk scenes, radio, lose lines, ending, pal lines, upgrade blurbs, hints |
| `game.js` | `Kit.start(...)`: joins the words, numbers and rules. Short on purpose; read this first |
| `runner.js` | The rules: body, Surge, scars, numb, foes, salvage, hurt, the order of one step |
| `spawn.js` | What comes down the road, salvage patterns, radio lines, the two pals |
| `boss.js` | Silt and the hound: a state machine, logic only |
| `bot.js` | The test bot. Looks ahead using the game's own sums; presses through `input.sim` only |
| `sky.js`, `scene.js` | Sky, clouds, far islands, rain, lightning; Pinhold in layers: pylons and chains, yard, road |
| `beasts.js`, `hound.js`, `rider.js` | Skarn and the Hollow swooper; the hound; Silt in the saddle |
| `draw.js`, `hud.js`, `bake.js` | One frame of play; the arm and the rest of the top layer; drawing helpers |
| `art/sprites.js`, `art/REQUEST.md` | Empty for now; the exact pictures the game will use, and the lines to paste |

## What was built
- One-tap runner with five stages that grow by distance, then Silt on the Hollow hound, then the ending, which opens Endless. Dying restarts the stage.
- Quick tap = short hop (about 68 px), hold = full jump (about 120 px), tap in the air = Surge (about 80 px more).
- Low barricades take a hop, troopers a full jump, tall barricades a Surge. Hollows either pass high (stay down) or dive at the road (hop). A dive throws an orange mark on the road and tips nose-down.
- **The bond cost:** the arm in the corner, under the road. Scars from hand to elbow are always there (CAST.md base state). Each Surge burns a branch further toward the shoulder, and they fade slowly. At the shoulder the arm goes numb: grey, the word NUMB with a draining bar, the whole picture cools, Skarn's fin goes dim, Kaito's arm hangs limp, and there's no second jump for 5 seconds. A tall barricade or an open core can't be answered while it lasts. High salvage is the bait: it pays 3, and costs a Surge.
- **Boss:** Silt rides the hound behind Kaito, throwing cables (hop the low ones, stay down under the high ones). It crouches (a "WAIT" plate with a draining bar, then a gold "FULL JUMP!" plate and an alarm sound 0.37 s before it springs), lunges past him and rears up with the core open. Jump, then Surge: the Surge becomes a lightning dash into the core. Three hits. Miss it and it lunges back. Each round is faster, with more cables and a barricade from the front. Silt talks throughout.
- **Pals:** Fizzlet comes to a burnt arm: from stage 2, going numb has a 30% chance of bringing it trotting down the road; stay on the ground and run into it. Boltnip flies only when the arm has been clean for 14 s, from stage 3: a 25% chance once per attempt, flying too high for a full jump, so catching it costs the Surge you were saving.
- Upgrades: Cool Scars (fade faster), Salvage Pull (reach), Skarn's Catch (free hits per story run, Skarn swoops down and throws Kaito clear; spent ones stay spent across stages, and dying gives back only what that attempt spent).
- Original music: two loops made in code, one for the stages and one for the boss. Effects for every action, including `zap` and `numb` defined here.
- Pictures from the image tool for Kaito (run strip of 6; jump, Surge, hurt), the trooper (run strip of 6) and Skarn (glide strip of 4), checked against `kaito-sheet-v8.png`, `trooper-sheet-v1.png` and `skarn-sheet-v3.png` (see Art below). Everything else is code art. The title uses the existing Pinhold picture with Kaito and Skarn running over it; if that picture fails, the code island shows instead. If any picture is missing the code figure draws, and the game plays the same.

## What was checked, with the real results (2026-11-06)
`node tools/smoke.js storm-run`: **PASSED**, at phone 844x390, computer 1440x900, small phone 568x320. That covers gate first, every stage won by the bot on 3 seeds with no upgrades, every stage lost with nobody playing (stage 1 in 7.3 s, boss in 13.5 s), real touch and keys, pause, hidden tab, sound and mute, buying upgrades, the switch, catch moment, saved progress after reload, wrong-way phone prompt, no sideways scroll, no page errors.

My own extra runs (scripts in `%TEMP%\kcheck`, `sr-bot.js`, `sr-extra.js`, `sr-shots.js`; not part of the repo):
- Bot on 40 more seeds per stage, no upgrades: **200 wins of 200**. Average Surges 0 / 2.6 / 1.9 / 2.5 / 3.9, going numb never, hits taken 0. So a careful run never has to go numb. That bot looks ahead, so see the next line for what a player gets.
- A second script that plays the boss by the game's own rule, with no look-ahead (hop what's low when it gets close, stay down under high cables, jump on JUMP!, 40 seeds, reaction times spread over 100 ms): before the round 3 fix, 32 cable hits, because the barricade and Silt's second cable arrived about 0.05 s apart; after it, **0 hits, 40 wins of 40**. Of the 208 ms you can tap to hop the barricade, a clean pass was left with 25 ms (high cable) or 75 ms (low); now the full 208 ms in every round, either height. Round 3's throws moved from 0.7, 1.6, 2.6 s to 0.7, 2.1, 2.8 s.
- **Correction to the line above (third review, 2026-11-06):** that 40 of 40 did not hold for jumping when the old JUMP! plate appeared. A scan through the real input path found a full jump cleared the lunge only if started 0.15 to 0.017 s before it, and a script jumping 0.15 to 0.35 s after the plate won 4 of 40. Fixed: the plate now says WAIT until 0.37 s before the lunge, then FULL JUMP! with a sound, and the hound's hit box is lower (`houndTall` 70 to 62, `lungeArc` 26 to 18). Results after the fix, same method, 40 seeds, full hold, no Surge, low foes hopped by script, core answered by script:
  - A full jump clears if started 0.183 to 0.05 s before the lunge (rounds 1 and 3) or 0.2 to 0.033 s before it (round 2), so about 0.19 to 0.40 s after FULL JUMP! shows. A hop still never clears.
  - Jumping 0.15 to 0.35 s after FULL JUMP!: 40 wins of 40, 15 hound hits in all. 0.25 to 0.45 s: 40 of 40, 45 hound hits. 0.10 to 0.25 s: 40 of 40, 36 hound hits. Ignoring WAIT and jumping 0.15 to 0.35 s into the crouch: 9 of 40, 111 hound hits.
- Bot after the fix, 40 seeds per stage: **200 wins of 200**, 0 hits, going numb never, average Surges 0 / 2.7 / 1.9 / 2.5 / 3.5. Nobody playing still loses the boss.
- Skarn's Catch across stages at level 2, in headless Chrome: stage 1 starts with 2, spending one leaves 1, stage 2 carries 1, spending it leaves 0, the next hit is a real one, retrying stage 2 gives back the 1 it began with, picking stage 1 starts a new run with 2, Endless starts with 2, a fair run has 0.
- Chains: looked at 1440x900 and 1024x768 (view.top -20 and -60), with the layer's seam and second pylon on screen at 1024x768 and 844x390: no chain stops in mid-air. The layer is only taller than before on screens that need it.
- Skarn's picture blocked on purpose: the code Skarn draws, the boss still plays, no page errors.
- Salvage per clear, including the clear bonus: stage 1 15-39, stage 2 21-42, stage 3 16-43, stage 4 21-52, boss 26. The kit asks for about 15 to 40, so stage 4's top end is a little over, for a player who picks up nearly everything.
- Numb through the real input path: a Surge sets the speed (136 to 492), scars +0.26, blocked while numb, feeling comes back after 5 s with scars at 0.6, fade 0.035 per second.
- Fizzlet with its chance forced to 100% and the bot burning its arm: caught 12 of 12. Boltnip forced and the bot Surging for it: caught 9 of 12. Fizzlet walked into in real play shows the real catch moment and saves.
- Upgrades at level 3: fade 0.035 to 0.072, reach 30 to 132, catches 0 to 3. A fair run sees the base numbers. Skarn's Catch on a real hit: catches 3 to 2, hits stay at 3, Kaito thrown up.
- Pictures: stand-ins served for all 15 keys in `art/REQUEST.md`: 15 of 15 load, all 15 get drawn during a story and a lost run.
- Draw time with the CPU slowed 6 times, 844x390 at 2x: stage 4 median 1.2 ms, 95th percentile 2.2 ms; boss median 1.2 ms, 95th percentile 4.1 ms. Worst single frame 59.8 ms, once, when the big background layers are first made. This measures issuing the drawing, not the graphics chip.
- Draw time again after the second review's redraw, same conditions: boss median 1 ms, 95th percentile 2.7 ms. The test steps frames without letting the browser rest, and a few frames show 40 to 190 ms at no particular moment; those look like the browser catching up on its queue, not a pose, but that's my reading, not measured. All the hound's poses are now drawn before the boss's talk scene (about 95 ms with the slowed CPU). The graphics chip is still unmeasured.
- Homepage: Storm Run's card is a link with PLAY and opens the game with no second gate; the other five stay COMING SOON.
- Screenshots looked at: title, talk, play on three sizes, tall barricade, Surge, numb, 70% scars, Hollow, stage 4 with Silt in the distance, boss chase, lunge, open core, dash, fall, result, ending, upgrades.

## Art (2026-11-06, after review)
- 3 images made (`art/raw/`, prompts in `art/prompts/`): `kaito-run-v1.png`, `kaito-poses-v1.png`, `trooper-run-v1.png`. All first takes, no redos. Looked at each one against its sheet: Kaito's gauntlet stays on the near arm in all 9 frames, three separate bands, gold scars stopping at the elbow, fork mark on the hand, white lock and brass goggles on the near side, jacket knotted at the front. The trooper's flat chest bar shows in only 2 of 6 frames; too small to read at play size, so no redo.
- The kit's code figures were redrawn too, since all six games use them and any picture can be missing: limbs drawn as one shape with no joint lines, real hands and boots, folds, about 1 in 6 head on Kaito, the tied jacket, three bands and scars on the arm, a strapped mask, hair and a ragged coat on Silt.
- Kaito's eyebrow scar isn't drawn: it's on his left, and he faces right, so we see his right side (as on the sheet's right-hand view).
- Second review (2026-11-06): still code art, redrawn against the sheets. The arm: a muscled bare arm in a slanted close-up frame that it runs off at the shoulder, clasped bands, an open hand with the thumb on the correct side, the fork mark branching across the back of the hand. Skarn: layered fur tufts, slate upper legs going pale and furry below, big paws with black claws, a heavy two-part tail with pale tips, a scalloped sail on curved spines. The hound: thick continuous legs with clawed paws, heavy cable veins from the core along the neck, belly and legs. Silt: redrawn in the saddle with a bold torn coat, belt, hooked blade, white mask with slit and strap, and a warm rim of light so his dark shape separates from the pylons.
- Silt's talk portrait is cut from the front view of `silt-sheet-v1.png` with the grey taken away (`art/site/villains/silt-v1-small.webp`), so it's the locked drawing, no new image made. If it can't load, a front-on code version of the mask draws instead.

- Third review (2026-11-06): Skarn's gliding picture made, the one Dylan chose in "3 strips of poses" that had been swapped for the trooper strip. 1 image, first take, no redo (`art/raw/skarn-glide-v1.png`, prompt in `art/prompts/`), 4 frames keyed to `art/skarn-glide.webp`. Looked at against `skarn-sheet-v3.png`: fin spines and solid membrane, broken lightning along the top moving front to back, forked tail with pale tips, pale ruff, blue-grey over the shoulder, yellow eye, fang, black claws. A wash over the picture puts out the fin and eye while the arm is numb. The code Skarn stays as the fallback.

- Fourth pass (Friday batch, 2026-11-06): the boss got pictures. 9 images, all first takes, no redos (`art/raw/silt-hound-*-v1.png`, prompts in `art/prompts/`), from `silt-sheet-v1.png` and `hollow-hound-sheet-v3.png`. One Codex timeout on the first try of the run strip; the same prompt worked on the retry. Status: built, not yet seen by Dylan.
  - Right-facing (blade and eye slit on his right, as on the sheet): `silt_hound_run`, `silt_hound_throw`, `silt_hound_crouch`, `silt_hound_leap`. Left-facing (blank mask side, no blade, as on the sheet's left view): `silt_hound_crouch_left`, `silt_hound_leap_left`, `silt_hound_rear_left`, `silt_hound_yelp_left`, `silt_hound_down_left` (no Silt).
  - Boss timings and hit boxes are unchanged. One number moved, with the picture only: the core sits at `coreAltArt` 112 px instead of `coreAlt` 96 (the reared hound stands taller). The code hound still uses 96 when the picture is missing. Silt's cable starts at his hand in the pictures (`cableHandArt`).
  - The core is drawn in code on top of the reared picture: shut with a white slit while it lands, bare and pulsing when it can be hit.
  - Checked: `tools/smoke.js storm-run` passed; 40 bot wins of 40 on the boss with the pictures on (all about 22 s, so the seeds barely change this fight and it's weak proof of fairness); every boss state except the run-in looked at in still shots at 844x390, with hit boxes drawn on some; a missed core (crouch and lunge back, facing left); stage 4's distant Silt; pictures blocked, so the code hound and Silt draw and the boss still plays; no page errors. Sprites looked at on flat colour: no green fringe, nothing cut off.
  - Not checked: how the gallop looks moving. I looked at stills and all 6 frames side by side, not at it playing. The fair-timing script from the third review wasn't rerun. No real phone.
  - Known flaws: the reared picture is drawn at about 80% of the other poses' scale so the core stays in reach and on screen; the crouch has a low, slightly rat-like head; the core shows as a crack in the yelp from the first hit on; a thin sliver of core shows on the chest in the gallop even though the plates are shut; Silt thrown clear at the end is still the code figure, flatter than the pictures.
  - Silt's talk portrait stays as it was: it's already a head-and-shoulders picture cut from his sheet, with the slit on his right. No new image needed.

- Fifth pass (final review, 2026-11-06). Status: built, not yet seen by Dylan. Where this differs from anything above, this is the current game; the older lines stay as the record of what was true then.
  - **Hints:** stage 1 now says "Hold to jump: safest. Quick tap: short hop. Tap in the air: Surge." Stage 3 says "Hollows: stay down if they pass high. Hold to jump if they dive." A low barricade or a dive can still be hopped, but the hints no longer teach the hard way.
  - **Hit boxes:** low barricade `hw` 16 to 13, `hi` 32 to 26; Hollow `hw` 20 to 16, `thick` 22 to 16. A quick tap's room over a low at stage 1 speed went from 0.133 s to 0.2 s (hold 0.4 to 0.467), over a dive at stage 3 speed from 0.1 to 0.167 s (hold 0.4 to 0.45). A trooper and the hound are unchanged, so a hop still clears neither.
  - **The bond cost:** `scarPerSurge` 0.26 to 0.3, `scarFade` 0.035 to 0.015 (a full arm now takes 67 s to clear, not 28), `tallEvery` 7 to 5. New bait: on stages 2 to 4 and Endless, half of the salvage patterns over a low or a trooper are two big cogs (3 each) at height 204, which a full jump misses by about 63 px and a jump with a Surge takes (`coinRows.bait`, `baitAhead`, `stages[].bait`). A pair of troopers can be cleared by a full jump in 0.167 s, or by a Surge in 0.583 s, so stage 4 asks which you can afford.
  - **Pals:** `fizzletChance` 0.3 to 0.15, since going numb is no longer unusual. Boltnip's clean arm is now `boltnipScar` 0.1 instead of 0, or the slower fade would almost stop it coming. Any pal still on the road bolts with a small puff the moment a stage ends, win or lose (`SR.palLeaves`), so a result line can't play with one in the world.
  - **Looks:** the boss's hint moved up under the pips, clear of Silt's talk box. Stage 4 has a far row of rooftops with Silt running along them, behind the yard and under the stage's haze, always left of Kaito. With the title picture blocked there's one road, with Skarn and Kaito on the same line.
  - **Troopers:** the game looks for `trooper_run_left` first. That picture doesn't exist yet (`art/REQUEST.md`), so troopers still show the flipped strip, with the blade on the wrong hip, until it's made.
  - Checked: `tools/smoke.js storm-run` passed. Bot, 40 seeds per stage, no upgrades: 200 wins of 200, never numb, 0 hits, average Surges 0 / 2.77 / 1.9 / 2.48 / 3.6. Nobody playing still loses every stage.
  - Scripted player in the page, not a thumb (150 attempts per stage, from the review's model, changed to hold on dives as the new hint says). Before, then after, stage 1 wins: novice tapping lows 6% to 17%, average tapping lows 45% to 64%, novice holding 81% to 88%, average holding 99% to 100%. So tapping is still the hard way; the hint now says so. Real time, real touch at 667x375, 6 tries: stage 1 tapping lows 4 wins (3 before), holding 6 (6 before). A full story in real time: stages 1 to 4 on the first try, boss on the second.
  - Arm, average player Surging only on tall barricades and trooper pairs, numb per attempt and average peak scars: stage 2 0.01 / 0.54, stage 3 0 / 0.43, stage 4 1.0 / 0.94, boss 0 / 0.66 (before: 0 / 0.26, 0 / 0.25, 0.07 / 0.6, 0 / 0.27). Taking every bait: stage 2 0.76 / 0.88, stage 3 0.43 / 0.75, stage 4 1.53 / 0.98, about 12 more salvage on stages 2 and 3 and 7 on stage 4, wins 97%, 95%, 84% against 98%, 95%, 91%. On stage 4, full-jumping pairs instead of Surging: numb 0.01, wins 80%. Stage 2 Surging on every jump: wins 25%. Boss Surging on every jump: wins 5%, numb 4.2. Cool Scars at level 3, stage 4: numb 0.49, wins 94%.
  - Novice who holds, by stage: 88%, 67%, 67%, 56%, 42%. Salvage per clear, average player: 18 / 18 / 21 / 24 / 24 without bait, about 30 taking all of it, top single run 57 on stage 4; the kit asks for about 15 to 40, so that top end is over.
  - Pals in the same 150 attempts: Fizzlet 17 on stage 4 for a player taking no bait, 16 on stage 2 and 36 on stage 4 taking all of it. Boltnip 20 on stage 3 and 6 on stage 4. With a pal placed by hand and the real `run.win()`, or a real finish line, or a real last hit: no pal in the world at the result. A pal walked into still shows the catch moment.
  - Looked at: stage 1 and 3 hints at 667x375 and 568x320, the boss's hint with Silt's line up, the rooftops at 667x375 and 844x390, the bait, pictures blocked (title at 667x375 and 1024x768, stage 4), the title with its picture. With pictures blocked the bot still wins stage 1 and the boss.
  - Not checked: a real phone or thumb; motion; how the bait feels; Boltnip caught by a player under the new arm.
  - **Troopers, later the same day:** `trooper_run_left` now exists (`art/raw/trooper-run-left-v1.png`, first take, prompt in `art/prompts/`), so the line above about the flipped strip no longer holds: troopers show their left side, with no blade. Drawn in the game beside the flipped strip, frame by frame: same top row, same feet row, 94 to 95 px tall in both. That is taller than the 86 px asked for, because `trooper_run`'s fill of 0.84 already draws him so and "same size as `trooper_run`" was the ask. Frames 1 to 3 and 4 to 6 look almost alike (near and far leg hard to tell apart), as in `trooper_run`. Checked: `tools/smoke.js storm-run` passed, stills looked at in stage 1. Not checked: motion, feel, a real phone.

## What a test can't tell, and needs Dylan's thumb
- Whether "Hold to jump" feels right, or whether thumbs tap anyway. A scripted novice who taps lows still mostly loses stage 1.
- Whether the bait tempts, and whether the arm climbing that much feels like pressure or like a punishment on stage 4.
- Whether the WAIT then FULL JUMP! timing feels fair and can be hit by a real thumb. A script can only prove the 0.19 to 0.40 s window exists; a phone adds its own touch delay. If it feels late, `jumpCueSecs` is the one number to change.
- Whether the alarm sound on FULL JUMP! is right. Checked that it plays without error, not how it sounds.
- Whether hop against full jump feels right, and whether a real thumb hits them reliably (a bot's tap is the shortest possible).
- Whether stage 1 is easy for a new player and the boss takes "a few tries". The bot only proves it can be done.
- Whether high and low cables can be read in time. They give about a second from Silt's wind-up, and that's the likeliest thing to feel unfair. A script proves the timing leaves room; only a thumb can say if it feels fair.
- How the redrawn arm, Skarn, the hound and Silt look in motion. Checked in still frames at 667x375 and 1440x900 only.
- Whether a dive and a pass-over Hollow can be told apart in time.
- The music and effects. Checked that they play without error, not that they sound good.
- Motion: gallop, wing beats, whether Skarn's position distracts.
- A real phone: only Chrome pretending to be one has run this. Weakest-device speed is unmeasured on a real device.

## Provisional numbers to confirm
All in `tuning.js`, marked PROVISIONAL. The ones most likely to change: `jumpSpeed`, `gravity`, `hopCut`, `surgeSpeed`, `scarPerSurge`, `scarFade`, `hits`, `stages[].speed`, `stages[].gap`, `tellSecs`, `jumpCueSecs`, `houndTall`, `lungeArc`, `openSecs`, `cableSpeed`, `fizzletChance`, `boltnipChance`, `coinChance`. Not provisional: `numbSecs` 5 (Dylan's answer), `bossHits` 3 (spec).

## Calls Claude made (change any)
- The story: the crew send Kaito to steal the Empire's survey chart from Pinhold's tower, so the Gullwake knows where the Empire will pin next. Stage names: The Pin Road, Chain Yard, Searchlight Row, Pylon Four, The Long Drop. Every line of dialogue.
- 3 hits per attempt, shown as forks beside the arm. Skarn's Catch adds grey ones.
- What each foe takes (hop, full jump, Surge), and the two kinds of Hollow pass.
- The Hollow swooper's design: original, in the hound's hide, plates and cables.
- Surge into the core is a short automatic dash once you're in the air and the core is open, since one thumb can't aim.
- Missing the open core makes the hound lunge back at you.
- Silt seen in the distance on stage 4; radio lines during stages.
- The talk box during play sits small in the bottom right, in the rock under the road (`sayAt: 'corner'`), clear of the arm, the forks, the boss's pips and the progress bar.
- Fizzlet's and Boltnip's catch conditions and chances.
- The hound stayed in code for the boss at first: shoulder height and its proportions come from the sheet; the rider's seat and the throw are mine. Pictures replaced it in the fourth pass; this code version is now the fallback.
- Boss pictures (Friday batch): an extra throw strip so the cable wind-up still shows; left-facing takes instead of flipping; Silt's cable hook and how he holds it; each pose's scale.
- Salvage: 1 per cog, 3 for the high ones.
- Numb in the game keeps 0.6 of the scars afterwards, so the next numb comes sooner.
- The trooper run strip took the third image slot first, in place of the Skarn gliding strip Dylan chose. Both exist now, so that's 4 strips where the answer said 3; the Friday answer on pictures is "As many as you need to".
- The boss's prompt: the words WAIT and FULL JUMP! (it used to say JUMP!, but a hop never clears the hound), the alarm sound, the draining bar, and the lower hit box. Kaito's boots brush Silt's hair at the top of a clean jump, because Silt rides taller than the hit box.
- "Per run" for Skarn's Catch means a story run, as the kit's README defines it. It first read per attempt.
- Fifth pass: the new hint wording; hit boxes smaller than the drawings of the low barricade and the Hollow; the arm's numbers, so going numb is now an ordinary event on stage 4; two high cogs as bait over lows and troopers, none on stage 1; pals bolting when a stage ends; the rooftops on stage 4; the boss's hint under the pips.

## Kit notes
Nothing was forked. One thing a later kit version could add: a way to tell how far a picture's `fill` should be for a beast, which `art/REQUEST.md` handles by listing a height for each key.

## Noticed, not touched
- `docs/TEST_CHECKLIST.md` and `docs/STEP3_PLAN.md` still describe Storm Run as not built.
- On the boss, Silt's opening line sits over the end of the bottom hint for about 3 of its 7 seconds. The talk scene just before says the same thing.
- At 568x320, the smallest phone, a three-line talk box comes up to 3.5 px over the feet line on the right of the screen. At 667x375 and up it stays below that line, sampled every 0.1 s over stages 3, 4 and the boss, and never touches the top read-outs, the arm or the forks at any size.
- The other villains' talk portraits (`vasch hekka krell maro trooper`) still use the kit's plain code bust that Silt's was reviewed down for. The later games will show them; Vasch, Hekka and the trooper could be cut from their sheets the same way, Krell and Maro have no sheet.
- The crew portraits read a little orange on Sela's skin against CAST.md's "dark brown skin". They're the homepage pictures; not changed here.
