# Silent Cut: notes

Status: built, not yet seen running by Dylan. Pictures are in for all 19 keys (see "Pictures" further down); built, not yet seen by Dylan. Switched on in the shared game list (`shared/games.js`: `live: true`, `status: 'live'`). The old wording of this line is in `NOTES-archive.md`.

## Review fixes (2026-11-06, sixth pass: pal gate, Lamplick, small ones)
6 findings, each reproduced first; all held up. 5 fixed in this folder. The scar reset is in `shared/kit/game.js`, so it's left for Dylan, below. No kit file changed. No images made. This section wins over the older ones below, including the Lamplick lines in "What was built" and "Calls", and the `tornCrew` note in the fourth pass.

**Pal gate (blocker).** Silas's flirting could fire with Lamplick on screen. Now, while a pal is in the world, flirting and innuendo keep quiet: in play, on the radio, in the crew's out-of-breath lines and on the lose screen. "In the world" means from the start of an attempt until the moth is caught or flies off, on screen or not, and while Tuftle's eyes are open.
- `words.js`: `quips` holds his clean lines; his flirting moved word for word to `quipsAdult`. `adult: true` marks the rest: 3 lose lines, 1 lamp-line lose line, Juno's "Say something filthy" out-of-breath line, and the radio pairs. No line was reworded for this.
- `pals.js`: `SC.palAround`, `SC.palSafe`. A radio joke skipped for a pal stays skipped, and so does its answer.
- Also found while checking: stage talk scenes play over the frozen street, and the moth could sit on a lantern in view behind "Ask anyone who's woken up next to me" (stage 2's first two lanterns are at x 190 and 310). The moth's lantern is now always at least 700 px from where he starts (`mothOffStart`), so it's off screen until play starts.

**Lamplick takes a tap now.** Before, walking through the dizzy moth caught it. Now the dizzy moth gets a TAP ring while it's in the chain's reach, and a tap on it catches it. Walking under it does nothing. Same 15% chance, same 5 s, same lines. The catch comes 0.56 s after the tap (`strikeCalm`), because that's how long it takes to know a tap wasn't a Surge's first half. I tried "stand still and it lands on you" first and dropped it: the human-like player stands about anyway on stage 2, so it still caught it 21 of 40 at a 1.5 s stand and 21 of 40 at 3 s, and a player trying for it got caught out more (40, then 18 of 40). `palRadius` is gone, nothing reads it.

**Smaller.** `tornCrew`'s first line shortened to two lines on the smallest phone. Was: "That wheeze is new. That's the bond taking its cut, Silas. It stays with you for the rest of the job." Now: "That wheeze is new. That's the bond's cut, Silas, and it stays for the rest of the job." With a picture missing, the code figure hiding behind cover is lifted by the same `hideLiftArt` as the picture, so his head shows.

### What was checked, real output
`node tools/smoke.js silent-cut`: exit 0, `PASSED: silent-cut`. `node games/silent-cut/fairness.js --seeds 40`: exit 0, `FAIR: everything above held`. Scripts in `%TEMP%\kcheck\final\scfix\`, not part of the repo.
```
Before: { say: 'Silas\nClose enough to kiss.', moth: 'lamplick' }
After, every quip chance forced to 1, 60 draws of each moment plus the crew's out-of-breath lines: no pal 28 lines, 16 of them flirting. Moth 12 lines, 0 flirting. Tuftle 12 lines, 0 flirting
Radio. Stage 2, moth: Sela's line only, no "mood lighting". Stage 3, Tuftle: neither of the crate pair, also when he's gone after the first would have played. No pal: all of them
Lose lines, 400 draws. No pal: normal 8, lamp line 5, out of breath 6 lines. Moth or Tuftle: 5, 4, 6, none flirting. Real lose screen with the moth in the world, 3 tries: Hush, Ione, Bram, then Kaito in the screenshot; none flirting
Lamplick, human-like player and the reviewer's seeds. Ignores pals, caught: stage 2 2 of 40 (was 40), stage 4 5 of 40 (was 24). Taps 0.4 s after the ring: stage 2 40 of 40, stage 4 24 of the 24 that cut its lantern. Moth placed, stage 2: x 1080, 1170, 1360, 1450, 1540 only
Wins with the moth about, same player: stage 2 26 of 40 ignoring, 28 going for it, 23 of 40 with no moth at all on the same seeds; stage 4 19, 19, 16. So it costs nothing
Real mouse, normal speed, 844x390 and 568x320, chance forced to 1: tap cuts its lantern, ring on, Bram's line. Walk on 2.2 s: moth keeps up, not caught, ring still on. Tap: catch screen 660 and 646 ms later, saved. Tap, 350 ms, double tap beside it: 1 Surge, not caught. Left alone: flies off after 5 s
Talk box, all 60 play lines. Worst top edge: 568x320 CSS 259.81, logical 292 (was 246, logical 277). 667x375 logical 300, 844x390 logical 302
```
Screenshots looked at (`%TEMP%\kcheck\final\scfix\`): TAP ring on the moth at both sizes, the talk scene with the moth placed, the catch screen, a lose screen, the torn line in the box at 568x320, the code figure hiding at the start crates and in crates, tarp and sacks at the left, middle and right, pictures and code side by side at the edges.

Not checked: a real phone or thumb. Whether the moth's ring reads, whether 0.56 s from tap to catch feels like lag, whether people notice the chirp and flicker. Sound by ear. Motion: still frames only.

**Calls made (change any):**
- **Lamplick's catch is a tap on a TAP ring.** Spec only says "a rare catch with a game-specific condition". A player who sees the ring will likely tap it, so the moth is still found by anyone who cuts that lantern; it's just no longer free. For harder: take the ring off, or shorten `lamplickSecs`.
- **The moth is never on the first lanterns of a stage.** Endless can start with none far enough along: 2 of 12 seeds had no moth with the chance forced to 1. Stage 3 has no lanterns, so no moth there, as before.
- **Which lines count as flirting is my reading.** Marked: "darling" and "handsome" lines, "Lovely coat", "Not my best angle", "I'm flattered", "mood lighting", the crate and "from behind" jokes, the shirt lines, "Pretty doesn't count as cover". Left as they are: Kaito's "pretty boy", "Ah. They've noticed me. They always do.", "Don't all cheer at once."
- With a pal about, a close call gets no line from Silas: all three were flirting and I didn't write a new one.
- Stage win lines and stage talk are not gated: none of the win lines on stages with pals flirts, and the moth is off screen during talk.

**For Dylan, not changed: voice scars can be wiped for free.** `shared/kit/game.js`, `pickStage` and `bank`. Reproduced: saved run with rasp 3, boss picked, chest and rasp `[0.7, 3]`. Stage 1, win, Menu, stage 5: `[1, 0]`, saved carry `undefined`. Kit README section 3 describes this on purpose ("so nobody is stuck with a ruined run"), and it's the same rule for every game, so it isn't this game's to change. See "calls" in the batch report.

**Noticed, not touched:** at the far edge of a low cover (sacks, barrels), the hiding figure floats about 20 px off the road. It's the lift, and the picture has always done the same; the code figure now matches it.

## Picture: `silas_strike` with an empty sheath (2026-11-06)
Answers the "NEEDS PICTURE" note in the fifth pass below. Status: built, not yet seen by Dylan.

- `art/raw/silas-strike-v2.png`, an edit of take 1, one try, prompt in `art/prompts/silas-strike-v2.txt`. The knife is gone in all three frames: no hilt, pommel or collar, the sash chain now runs unbroken over where the hilt was, the sheath stays where it was. Keyed to `art/silas-strike-v2.webp`, 1152x384 like the old strip. `art/sprites.js` now points there. Take 1 and `art/silas-strike.webp` are kept.
- No code changed. `feet`, `fill` and `STRIKE_HAND` stay: the top, feet, left, right and middle of each frame moved by at most 0.002 of a cell against take 1, and the chain still leaves the hand in the screenshots.
- Flaws: the sheath's mouth is a flat steel cap rather than an open slit, so at zoom it reads as a capped sheath; at play size it reads as a plain dark sheath. The studs down the sheath's face have mostly faded. Cloth creases on the sash shifted slightly. Eyes read blue-grey at this size, as in take 1.
- Only the strike is changed. Every other Silas picture still shows the knife sheathed, which is right: it's back in the sheath when he isn't throwing. So the knife pops back as the strike ends, about as fast as it pops out.
- Checked: `node tools/smoke.js silent-cut` passed with this picture on. Frozen frames of a real tap looked at: Maro, trooper. Sash and hands zoomed on the raw take; sash zoomed in play. Strike picture blocked: the code figure still shows, no page errors. Not checked: how it feels in motion, a real phone.

## Review fixes (2026-11-06, fifth pass: the last step to Maro, the chain-blade)
Both findings checked first and both held up. No kit file changed. No images made. This section wins over the older ones below, including "Longer Chain ... Maro takes 14 px closer" further down.

**The last step to Maro.** Measured before the change: the meter was at 0.43 the moment the TAP ring showed (the review's 0.45, a step's rounding), holding on 0.35 s with a 0.15 s gap raised the alarm first. Now `maroReachLess` is 0 (was 14) and `maroPool` is 44 (was 74). With no upgrades the ring shows at 66 px and his light starts at 52 px, so the ring comes 0.15 s of walking before the light. Walking on past the ring still lights him: alarm 0.92 s after the ring. Standing at the ring and not tapping is safe from the reading light, until the book shuts. `fairness.js` now checks this.

**The chain-blade.** `people.js`: the white polygon and dashed line are gone. It is now the knife from `silas-sheet-v4`: dark wooden hilt, curled steel pommel, steel collar, curved blade with one shadow tone, on a chain drawn link by link and tied on at the pommel. A strike starts wound up, with the knife behind his raised hand and clear of his head. Also fixed, because it was why the arrow showed at his hand mid-strike: the old code changed its timing when `strikeT` passed the lantern cut's length, so the blade jumped back to the hand and threw again. It now goes by what the tap did (`s.lastAct`).

### What was checked, real output
`node tools/smoke.js silent-cut`: exit 0, `PASSED: silent-cut`. `node games/silent-cut/fairness.js --seeds 40`: exit 0, `FAIR: everything above held`. No kit edit, so storm-run wasn't re-run.
```
Rules, dark room, back turned, meter when the ring shows: before 0.43, after 0
  Held on after the ring, then lift, 0.15 s gap, 0.08 s press. Before: cut at 0.3 s (peak 0.97), ALARM first from 0.35 s. After: cut up to 0.7 s (peak 0.88), ALARM first at 0.8 s
Real mouse, normal speed, 5 tries each, press 80 ms. Lift 150, 250, 300, 400, 500, 600, 700 ms after the ring, gap 100: cut 5 of 5 each. Lift 300 and 400, gap 150: cut 5 of 5 each. Lift 900, gap 100: alarm1 5 of 5
Late player (fairness-thumb's player, answers the ring late), stage 5, 40 seeds, won. Lag 0 / 0.2-0.3 / 0.3-0.5 / 0.4-0.6 / 0.6-0.8 s:
  A. Close to the review's player: sets off whatever the time, tap as soon as it lifts. Before: 40 / 32 / 0 / 0 / 0. After: 40 / 14 / 15 / 7 / 3
  B. Won't set off from the last cover unless the trip and his own lag fit, tap as soon as it lifts. Before: 40 / 39 / 0 / 0 / 0. After: 40 / 40 / 40 / 38 / 30, 1.3 to 1.9 alarms a run at any lag above 0
  C. Same as B, with 0.15 s between lifting and the tap. Before: 40 / 0 / 0 / 0 / 0, lost mostly by "light". After: 40 / 37 / 36 / 34 / 10
Player B, lag 0.3-0.5, 30 seeds, after: none 29; Longer Chain 1, 2, 3: 30, 28, 27; Softer Boots 3: 30; Deep Lungs 3: 30
Human-speed player in fairness.js (taps the moment the ring shows), stage 5: won 40 of 40, 0.1 alarms, 62 s. Stage 5 hops: worst wait 8.4 s, lowest share 21%
```
Read that this way: player A walks on when the book shuts and on into Maro's face, so it still loses most runs, but now by a bump or his lamp, rarely by his reading light. A real person may be nearer A than B on a first try. Whether a person plays like that row or the other one, only a thumb can say. Stage 3 came out 39 of 40 in the fairness run and 40 of 40 in a separate run with the old and new numbers each; the two numbers are read only on the boss, so that's run-to-run variation.

Screenshots looked at (`%TEMP%\kcheck\silent-cut\fix5\look\`), real tap, frozen: Maro strike at 844x390, 568x320, 1440x900, at four moments; trooper strike; lantern cut; a cut from 26 px; strike with the picture blocked; the ring at 66 px with Silas outside the pool; a zoomed crop of the knife (`fix5\zoom.png`). No page errors.

Not checked: a real phone or thumb, motion (still frames only, so whether the throw reads at speed needs Dylan's eye), sound. Whether the boss still "takes a few tries": it should be easier now for anyone who was getting caught by the reading light; his lamp, guards and the turn are unchanged.

**Calls made (change any):**
- Fixed by moving the numbers, not changing a rule. Dropping `maroReachLess` to 0 and narrowing the pool was my pick over keeping the 14 and shrinking the pool to 30, which hardly showed round him. Other way: raise `maroPool` for a tighter last step; above 58 the ring shows inside the light.
- `maroReachLess` stays in the code at 0, so the number can come back without touching the rules.
- The knife is drawn about twice its size on the sheet, or it doesn't read at play size. At the sheet's scale it would be about 13 px; it's drawn about 30 px with the pommel.
- `chainWindup`, `chainFly`: looks only, provisional. The cut lands on the tap, as it did, so Maro reels a moment before the blade gets there (about 0.13 s).

**NEEDS PICTURE (not urgent, left as is):** `silas_strike` still shows the knife in its sheath at his sash while the code draws the same knife thrown, so he seems to have two. A new take with an empty sheath would settle it. The knife itself stays code art; no picture is planned for it.

**Noticed, not touched:** a trooper goes down the moment you tap, before the blade arrives, so for about 0.1 s the knife flies at where his back was, over him lying down.

## Review fixes (2026-11-06, fourth pass: controls, story, looks)
24 findings read against the code. All held up, none was wrong. Two were the same finding (Lamplick's catch), so 23 fixes or decisions. No images made. This section wins over the older ones below.

**What changed for the player**
- **A slow tap works now.** Any press the kit calls a tap (under 0.28 s, `tapKit`) acts on whatever has the TAP ring. It was 0.18 s. A double tap with a press over 0.18 s also Surges, if the second follows within 0.16 s (`tapSlowGap`). Two quick taps keep their 0.36 s. Longer gaps with slow presses stay a creep, with no puff, so hold, let go, hold under a crate spends nothing.
- **Out of breath in the light.** A box with a red edge says "Too bright to rest. Keep walking, then freeze in the dark." for as long as it's true, in every mode. The crew's line after 1.7 s is chosen from `windedCrewLit` if he's still lit. The `row` tip and Bram's `windedLose` line now say the dark. Bram's torn line was "Stop. Please stop now.", now "No more dashes. Please." `longGate` tip added to stages 3 and 4.
- **Deep Lungs:** one new feather per level (`lungMax` 1/3, was 0.2): 3, 4, 5, 6 feathers. Blurb changed to say so. The panel closes the feathers up past four. See the call below: at level 3 the bond cost nearly stops biting.
- **Lamplick:** a dizzy moth behind him wobbles after him at 150 px/s (`mothDrift`), so a cut from anywhere the chain reaches can be caught. "Catch it, lad" is always true now.
- **The third cut.** Silas stops: no walking, Surge or strike while Maro falls, whatever the thumb does. His line breaks off at "Paid in f" with a wheeze and a "...", so the ending's silence starts there. Maro's "Wait. Wait, wait..." now plays, 1.1 s after the cut, and the fall lasts 3 s (`maroFallSecs`, was 1.8) so it can be read. Maro's first ending line now opens "That last one stuck in your throat, didn't it?". It was "Well, then. You've had a line ready for me for a whole year, dear fellow. I know you. Let's hear it."; the rest of it stays.
- **Lose lines:** the lamp line's own list (5) shows only when the line is what lost the stage. The boss always uses his list. `byLine` is gone.
- **"GHOST"** no longer floats on the boss, because its last frame stays behind the ending talk.
- **Words.** Tuftle's appear line is Hush now: "Hush looks at the dark beside you. Two big eyes look back. Stay still." (was Silas, "Who's that behind me? ...Stay very still, Silas."). "Nine men" is "Four men" (stage 4 has four). Radio question-and-answer pairs sit close: stage 2 at 0.3, 0.33 and stage 3 at 0.35, 0.38 of the street.
- **Looks.** The title has no strip across the sky and no Silas: only Hush, gliding low over the clouds. If the picture can't load, Silas walks the code street's own walkway. Flood light is now two beams, one from each mast's lamps, fading to the ground; the pool on the walkway is still the exact edge. A crate's shade starts under the crate. "creak" floats behind him and "+1" ahead of him. Scenery and props have thinner ink (`sceneInk` 0.55; 1 is the old look), through `SC.sceneArt` in `bake.js`.
- **Numbers and files.** `feedback.js` is 180 lines: sounds moved to `sounds.js`, salvage and Hush to `company.js`, tips to `words-tips.js`. Talk timing moved to `tuning.js` (`talk`), radio positions to `tuning-stages.js` (`radioAt`), endless distances to `L.endless`, bot numbers to `tuning.js`, each marked. What stays in drawing files is where things are drawn on screen, sparks and shakes.

**Kit change (small, additive):** `shared/kit/ui.js` and `kit.css`: "Endless is open." on the ending card is plain gold words (`.kit-unlock`), not a filled bar that looks like a button. Every game with Endless gets this. `.kit-note` is untouched and the upgrades screen still uses it.

### What was checked, real output
`node tools/smoke.js silent-cut`: `PASSED: silent-cut`. `node tools/smoke.js storm-run`: `PASSED: storm-run`, because of the kit edit. `node games/silent-cut/fairness.js --seeds 40`: exit 0, `FAIR: everything above held`.
```
Real mouse, normal speed. Trooper's back in reach, press 80, 140, 170, 190, 220, 250, 260 ms: strikes 1 every time, x 950 to 960.7
Lantern in reach, press 80, 140, 190, 220, 250, 260 ms: cuts 1 every time
Double tap, press/gap/press ms, surges: 100/120/100 1; 170/120/170 1; 190/120/190 1; 210/120/210 1; 250/100/250 1; 100/120/210 1; 210/120/100 1; 100/300/100 1
  Not a Surge: 100/500/100 (QUICKER, 2 soft taps); 100/300/250 and 250/300/100 (QUICKER); 250/300/250 (silent creep, 18 px); 100/900/100
Pulses, 6 in a row, held/gap ms: 270/200, 270/170, 220/200, 200/250, 260/300: surges 0, breath 1, moved 32 to 66 px, no soft tap
Deep Lungs, Surges from full, unscarred: level 0 3, level 1 4, level 2 5, level 3 6. Rasp 1: 2, 3, 4, 5. Rasp 3: 2, 3, 4, 5
Moth, cut then held forward, px past the lantern: -60, -20, 0, 20, 24, 30, 50, 60, 66: caught every time. Longer Chain, 130 px past, creep 92 and 113, held or standing: caught
Boss, third cut then thumb held, live: x stays 1970, Maro 'fall'. Said: 0.33 s silas "Paid in f", 1.42 s maro "Wait. Wait, wait...", still up at 3.33 s when the win fires
Lose lines, 16 draws each: stage 2 lost by a bump after a line alarm: 7 different lines, no line-only line. Lost to the line: 4 of the 5 line lines. Boss lost to the line: all 5 of his own
Out of breath in the wide gate, rules unchanged: stage 2 freeze lost in 11 s, 3 alarms; walk 1 alarm. Stage 4 freeze lost in 9.8 s, 3 alarms; walk 1 alarm
Live: last feather spent at the gate: "Oh, for f", then 1.7 s later Sela or Ione's lit line; walking out, alarms 1
Human-speed player, 40 seeds, won / Surges / out of breath / alarms: s1 40 / 1 / 0 / 0; s2 40 / 4 / 1 / 0; s3 40 / 5.4 / 1.7 / 0.1; s4 40 / 5.5 / 1.4 / 0.4; s5 40 / 2.1 / 0 / 0
Dim phone, lit walkway against dark, stages 1 to 5: 32, 33, 42, 33, 36 apart (want 15). Silas's shirt or glow: all above target
Tips: widest 464 px, box limit 520. Talk box, new lines at 568x320: top edge 259.8 or lower, road mark 259.4
```
Screenshots looked at (`%TEMP%\kcheck\silent-cut\fix4\`): title at 1440x900 and 568x320, title with its picture blocked, floods at all three sizes, crane shade, creak and +1 on the boards, winded in the gate with the red box and Ione's line, six feathers full and empty, Maro falling with his line, BOSS DOWN (no GHOST), the ending's first line, the ending card. Stage 1 and the warehouse at 1440x900 for the ink.

Not checked: a real phone or thumb, so how often real presses land where is still unmeasured; sound by ear, including the wheeze on the third cut; motion. The ending's first line was reached by the real button; the ending card by `__kit.ending()`. The earlier slip players still aren't in the repo, so not re-run. With longer minimum presses in the bot and the human-speed player (0.31 s, because shorter is now a tap), their stage 3 and 4 runs are a little different from earlier tables: same wins, about the same breath.

**Calls made (change any):**
- **Deep Lungs is strong at the top.** Human-speed player, 30 seeds, times out of breath on stages 2, 3, 4 at each level: level 0 1, 1.8, 1.4; level 1 0.1, 1, 0.8; level 2 0, 0.4, 0.1; level 3 0, 0, 0. So a player who buys all three (145 salvage) rarely goes silent unless he's careless. It's the plainest way to give a feather per level, and the No-upgrades switch still plays the real cost. If it should still bite at level 3, lower `lungMax`, but then some level pays for no feather.
- A press up to 0.28 s beside a lantern cuts it, even if it was meant as a little creep. Beside a trooper, it strikes.
- Two presses under 0.28 s with a gap of 0.16 s or less Surge. A fast hold, let go, hold that happens to be that tight would spend a feather. 0.17 s was fine in the test; a person's thumb is the real check.
- Silas's third line breaking off, and Maro's new opening line, are my writing, one of the two ways the review offered.
- Silas no longer appears on the title when the picture is there.
- `sceneInk` 0.55 is my eye, and it was a judgement call in the review anyway. Hand-drawn lines are still heavier than the pictures' at computer size.
- Tuftle's line goes to Hush; the five new lamp-line lose lines and three lit crew lines are mine.

**NEEDS PICTURE:** the Sever trooper's talk portrait. It's still the kit's code bust, the only unfinished-looking portrait in the game, on the lose screen and in play lines. Same crop and style as `art/maro-portrait.webp`, from `trooper-sheet-v1`. Add it with `img` through `Kit.speakers.add`, or in the kit's `speakers.js` so Hot Hand and the others get it too. Left as code art.

**The trooper's portrait picture (later the same day):** now made. `art/trooper-portrait.webp` (216 px, as Maro's) from `art/raw/trooper-portrait-v1.png`, first take, no redo, prompt in `art/prompts/trooper-portrait-v1.txt` (Maro's portrait prompt with the trooper's look). References: `trooper-sheet-v1.png` for him, `art/site/crew/silas-v2-raw.png` for style and crop. Wired by `img` in `Kit.speakers.add('trooper', ...)` in `people.js`, so this game only: other games still show the kit's code bust, and moving it to the kit's `speakers.js` would give it to them. If it can't load, the code bust shows (checked with the picture blocked). Seen on the lose screen at 844x390, 568x320 and 1280x720, and in a play talk box forced by test at 568x320; in this game his one line is a lose line. Status: built, not yet seen by Dylan. Calls: the crop stops above the chest, so the black bar and white ring are not in it. Flaws: helmet rounder and larger than the sheet's, ear cups bigger, visor deeper so it covers the bridge of his nose; helmet and coat are a little warmer than the sheet's grey.

**Noticed, not touched:** `shared/pals.js:143`, Tuftle's card, "It has been behind you for an hour, being friendly." It isn't in this game's folder. With the play line gone it no longer echoes Silas's jokes on screen, but it's a cheap line to change if it still reads wrong. `tornCrew`'s first line (101 characters) runs to three lines at 568x320, 13 px over the lowest road mark; it was already so.

## Review fixes (2026-11-06, third pass: the voice cost)
All 5 findings were re-measured with the reviewer's own scripts before any change, and all 5 held. No kit file changed. No images made or needed. This section wins over the older ones below.

**Lasting voice loss was close to automatic and blanked the story.** The second time out of breath in one attempt at a stage, and each time after, is what scars him now (`raspFrom` 2). The first he gets over, and a tip says what the next will cost. A scar shows: "VOICE TORN", a crack, a line from the crew (`tornCrew`), and the panel's label changes to HOARSE, RAGGED, IN RAGS. Rasp 3 is the floor, on purpose, so the run stays winnable: past it there's no further lasting loss, only the longest silence.

**Blank is now only what the spec asks for.** Silas goes "..." while out of breath, and in the ending. A scarred voice no longer blanks anything. His scene and win lines have hand-written `rough` (rasp 1 or 2) and `rags` (rasp 3) versions that keep whatever the next speaker answers; "First instalment" and the others have `silasHitRags`. Lines in play break up further at rasp 3 (`voiceKeepWorst`), but aren't blank.

**The penalty grows now.** Going out of breath takes whatever was left under one Surge, and each scar slows breath's return by 12% (`raspRegenLoss`). The Surge count stays 3, 2, 2, 2: wide gates need two, so it can't go lower.

**Lose lines vary at every rasp.** Out of breath, it's one of six (`windedLose`; the boss has its own four), one being his "...". Otherwise it's the stage's normal list, and his own line there goes hoarse. (Fourth pass: this wasn't true for a stage with a lamp-line alarm. It is now.)

**Double tap.** No tap within 0.56 s of a strike or a cut on Maro can start or finish a Surge (`strikeCalm`). Keys are untouched, since E and Shift can only mean Surge. Also found chasing the reviewer's "repeated taps" note: tap, tap between two lanterns in reach used to cut one and Surge, 8 of 8 gaps. Now it cuts both.

**Script.** The ending had to be true on any run, so two lines changed. Juno was `Say something filthy. I'll pay you. ...Shit. He's never not answered.`, now ends `...Shit. He always gets it back by now.` Ione was `Days, not hours. No speech at all. I'm noting that the patient regards this as the worst thing that has ever happened to him.`, now `Days, not hours. Every breath he borrowed tonight came due at once. I'm noting...`, the same from there. `blankLose` is gone from `words.js`; it was `{ who: 'silas', text: '...' }`, and that line is in `windedLose`.

### What was checked, real output
`node tools/smoke.js silent-cut`: exit 0, `PASSED: silent-cut`, 165 ok, 0 failed. `node games/silent-cut/fairness.js --seeds 40`: exit 0, `FAIR: everything above held`. (One earlier run stopped on a 30 s screenshot timeout in the dim-phone part, with other games' tests running; it passed when run again.)
```
Boss lose lines, real result screen, rasp 3, 8 in a row: Maro, Maro, Sela, Maro, Maro, Maro, Sela, Juno (was Silas "..." 8 of 8)
Whole story, carrying rasp, rasp at the start of stages 1 to 5, counts for rasp 0/1/2/3, 30 runs. Every stage won on the first try:
  human-speed:                 s3 29/1/0/0   s4 14/10/5/1   s5 8/9/8/5    (was s4 0/0/1/29, s5 0/0/0/30)
  same, keeps its last Surge:  s3 30/0/0/0   s4 30/0/0/0    s5 29/1/0/0
  test bot (12 runs):          rasp 0 throughout
Times out of breath, human-speed, stages 2, 3, 4: 1, 1.7, 1.4 (before these fixes 1, 1.85, 1.6). So he still runs out as often; it just scars less
Rasp 3 carried in, won: human-speed 40 of 40 on stages 2 to 5 (average 91, 124, 144, 64 s; normal run 69, 85, 108, 62 s). Test bot 20 of 20 each
Every Surge spent from a full chest, then frozen: rasp 1 to 3, breath left 0, silence 11, 12.7, 15 s (was 3, 5.8, 8.7 s); rasp 0 9.7 s as before
Strike, then a second tap, gaps 0.1, 0.2, 0.25, 0.3 s: breath stays 1, no dash, x 1180 (was Surge and x 1345 at 0.25 and 0.3). Beside Maro, 0.25 s: hp 2, no Surge, breath 1
Two lanterns in reach, tap, tap, gaps 0.03 to 0.34 s: both cut, no Surge, 8 of 8
The reviewer's real-mouse stage 1 (test bot's decisions, real mouse, normal speed), 4 runs: Surges 1, 3, 3, 1; out of breath 0, 1, 1, 0; rasp 0 every time, no alarms (reviewer's run: 4 Surges, 2 out of breath, rasp 2)
```
In the real-mouse runs I logged, the one Surge the bot planned was the flood gate. The extra ones came after a lantern cut or an empty tap, when the bot tapped again on its next poll, so they're real double taps. See "Noticed, not touched".
Screenshots looked at, at 568x320 and 844x390 (`%TEMP%\kcheck\silent-cut\fix3\`): first time out of breath with the tip, VOICE TORN, Ione's line, RAGGED on the panel, Silas at rasp 3 in the boss scene reached by the real Next stage button, a lose line out of breath, Juno's and Ione's ending lines. All fit their boxes.

Not checked: a real phone or a real thumb. The human-speed player is my stand-in, so how often a person gets scarred is an estimate. Whether "first one's free, second one scars" reads as fair, whether the tip is noticed in the middle of trouble, the crack by ear, and whether the hoarse lines read as hoarse or as typos need Dylan. Deep Lungs with scars wasn't measured separately. Not re-run: the slip players of the second pass, whose script isn't in the repo.

**Calls made (change any):** the scar rule and its numbers, all provisional; `rough` and `rags` lines, `windedLose`, `tornCrew`, the panel labels and the tip are my writing; a scarred Silas keeps talking, where he used to go blank at rasp 3; a deliberate Surge within 0.56 s of a strike needs waiting that long; tap, tap beside two lanterns now takes two more taps to Surge.

**Noticed, not touched:** tapping twice on one lantern still cuts and Surges, so a worried double tap there can spend a feather. That's the listed call, because a deliberate double tap beside a lantern has to work and the two can't be told apart.

## Review fixes (2026-11-06, second pass)
All 20 findings of the review were read against the code and held up; nothing was refused. No kit file was changed (Maro's portrait goes through `Kit.speakers.add`, in `people.js`). No images made.

**Age and story (blocker).** The old numbers ("four years gone", "five years I paid you") put Silas in Maro's pay from 15, with "old flame" and the crate story on top. Now: a year gone, two years paid, so 24 - 1 - 2 = 21 when he started, and no reading of the script has him under 21. "Old flame" is gone (Juno says "his old boss's books"). Maro's "dear boy" is now "dear fellow". Left as they are, all non-sexual: Bram's "lad", Kaito's "pretty boy", and "A duke's wife" (which is also in `shared/stories.js`, with no age).

**The bond cost now bites.** `breathRegen` halved to 0.035 (9.5 s per Surge). Every stage asks for more: stage 1 ends on one flood gate, and a new `longGate` chunk (270 px of flood, two Surges back to back) is in stages 2 to 4, plus extra gates in stages 3 and 4 and two between the boss's bays. `raspLoss` is 0.1, so a ruined run (rasp 3, chest 0.7) still holds two Surges and a wide gate can always be crossed after a wait; the chest stops shrinking at rasp 3. Stages are longer to fit (about 2600, 3580, 4540, 4620 px).

**The Surge's double tap.** The window now runs from letting go of the first tap to pressing the second (`doubleGap` 0.36), so press length doesn't eat it. `creepDelay` 0.14, `tapMax` 0.18. Two short presses close together still Surge: that is what a double tap is, and no rule can tell them apart. Longer presses never do. A tap that does nothing now gives a soft sound and a puff, and a too-slow second tap shows "QUICKER".

**The boss.** Maro's lamp has its own fill (`maroLampSecs` 0.6, then the alert factor), frozen or not: one pass finds anyone frozen in the open, and only cover beats it, as the tip says. To keep it fair, the last room lost its beam and second lantern, and his back stays turned a little longer in rounds 2 and 3 (`maroBack` 3.6, 3.2). The third cut can no longer be lost: alarms and bumps stop once he's falling. Spec's "lamplit warehouse" now is one: stage name, Sela's line, a loading door, a beam with lamps hung on it, floodlit loading gates. The ledger shelves stay.

**Small ones.** Maro's coins land ahead of Silas, and the last cut's three are banked at once (`clearSalvage` 14 on stage 5 keeps the clear under 40). The moth chirps only from `mothHear` ahead until the lantern is out of chain reach. A double tap in a stumble no longer plays the out-of-breath wheeze. "Oh, for f" and the three breath-back quips now show as written (`SC.say(..., whole)`), unless his voice is gone for the run. Tips no longer lie: cover hides you, not shadow; cut both lanterns; a feather is one Surge. The trooper's oval is now a soft glow from his lamp. "NO BREATH" sits inside the panel, at size 15. The ledger pages scatter ahead of Maro from where he was cut. Silas and Hush leave the title scene when the ending is replayed. The feet line moved up 20 px (`groundY` 268) so the talk box clears the walkway and its marks on the smallest phone; the HUD band stayed where it was (`hudY`). Rule numbers moved to `tuning.js`: lantern cut time, start x, beam phase, Maro's coins, voice shares, line warnings, moth, Hush's speed, quip chances, the boss tip. `tuftleStill` went 5 to 18 s and `tuftleChance` 0.35 to 0.25, because waiting for breath was catching Tuftle by accident.

**Left outside `tuning.js`, as looks, not rules:** coin heights, and how the chain and pages are drawn. (Fourth pass: talk timing moved to `tuning.js`.)

**Maro's portrait** is a new code drawing that matches his pictures: side-on, stout, bald on top, grey at the back, plum coat. It still doesn't have the finish of the crew's anime portraits. A picture is what's needed, and it's listed for the next round: cut from `art/raw/maro-sheet-v1.png` once Dylan locks that sheet.

**Maro's portrait picture (later the same day):** now made. `art/maro-portrait.webp` (216 px, as the crew's small portraits) from `art/raw/maro-portrait-v1.png`, first take, no redo, prompt in `art/prompts/maro-portrait-v1.txt` (the crew portrait prompt, `art/site/prompts/portrait-template.txt`, with his look and a small pleased smile). References: `art/raw/maro-sheet-v1.png` for him, `art/site/crew/silas-v2-raw.png` for style and crop. Wired by `img` in his `Kit.speakers.add` in `people.js`, not `art/sprites.js`, because talk portraits don't go through `Kit.art`. If it can't load, the code drawing above still shows (checked with the picture blocked). Status: built, not yet seen by Dylan. Calls: made without waiting for the sheet to be locked, so a changed sheet means a new portrait; he faces the viewer like the crew's portraits, while the code drawing stays side-on. Flaws: rounder and softer than the crew's angular faces (true to his sheet); the smile reads a little friendlier than "crooked" at small size; coat a touch redder than the sheet's plum.

### What was checked after the fixes, real output
`node tools/smoke.js silent-cut`: exit 0, `PASSED: silent-cut`, 165 ok, 0 failed.
`node games/silent-cut/fairness.js --seeds 40`: `FAIR: everything above held`.
```
HOPS  stage 1: worst wait 7.6 s, lowest share 62%; 2: 10.2 s, 22%; 3: 7.8 s, 38%; 4: 11 s, 17%; 5: 8.4 s, 21%
Human-speed player, 40 seeds. Surges / out of breath per stage / lowest breath / share of time under one Surge:
  stage 1: won 40; 1 / 0 / 0.667 / 0
  stage 2: won 40; 4.05 / 1 / 0.096 / 0.109
  stage 3: won 40; 5.45 / 1.85 / 0.051 / 0.177
  stage 4: won 40; 5.53 / 1.6 / 0.036 / 0.121
  stage 5: won 40; 2.15 / 0.05 / 0.631 / 0.01
The same player, never spending its last Surge at a gate (it waits instead):
  won 40, 40, 40, 35, 40; out of breath 0, 0, 0.8, 0.3, 0; stage 4's 5 losses are to the lamp line. Waiting costs something
With slips, keeping going or stopping at the wrong moment, won of 40, stages 1 to 5:
  every 12 s or so, for 0.5 s: 40, 40, 39, 34, 35
  every 8 s or so, for 0.6 s: 40, 40, 37, 32, 32
  every 5 s or so, for 0.7 s: 40, 35, 30, 20, 14
Carrying a ruined run (rasp 3): human-speed won 40 of 40 on stages 2 to 5. Test bot won 20 of 20 on each
Test bot, 40 seeds: won every stage; salvage per clear 23, 30, 35, 40, 38
Crude boss player who never looks for cover: 0 of 40, with or without Surge
Frozen in the open for one lamp sweep: alarm in 20 of 21 tries (round 1 at 480 px is out of his reach)
Last blow with 2 alarms and a guard hunting 150 px behind: win, alarms stay 2
Two lanterns, alarms: cut none 1, first 1, second 1, both 0
Moth, walking past it uncut: 14 chirps, the first 339 px ahead, the last 51 px past it
Double tap in a stumble, full breath: no wheeze. Same tap with an empty chest: wheeze
Voice: "Oh, for f" when breath goes, "...there it is. Did you miss me?" when it comes back
Real mouse, press and gap in ms: 70/100, 100/150, 100/200 twice, 120/240, 150/150, 180/120, 100/300, 150/250 all Surge. 100/400 and 100/600 don't, and 100/500 shows "QUICKER" with a sound.
Six 270 ms pulses: 69 px, no breath used. Real touch, tap, 130 ms, tap: Surge
Talk box, all 54 lines said in play. Top edge against the lowest road mark, in CSS px: 568x320 259.8 / 259.4; 640x360 297.5 / 292; 667x375 312.5 / 304.2; 844x390 327.5 / 316.3
```
Seen in screenshots at 568x320 and 844x390 (`%TEMP%\kcheck\silent-cut\fix\`): Maro's talk box, trooper's glow, talk box over the beam's track, out of breath, the warehouse, his cone, pages at three moments, the fall, the ending replay, the dim-phone pictures for stage 5.

Not checked: a real phone, iOS Safari, notch safe areas; motion as a person sees it (still frames only, so the pages and the glow need Dylan's eye); sound by ear. The slip player is my stand-in for a real thumb, so "boss takes a few tries" and "first stage easy" are estimates until Dylan plays. The earlier section below keeps its older numbers, marked as earlier; this section wins.

## Pictures (2026-11-06)
14 images made with `codex-imagegen` on the ChatGPT plan, no limit hit, no timeouts: 13 first takes and 1 redo. Raw in `art/raw/`, prompts in `art/prompts/`. Every take was looked at against its sheet.

| Keys | Take | Flaws left in |
|---|---|---|
| `silas_creep` | `silas-creep-v1` | Sash ends are more torn than the sheet's. Eyes read blue-grey more than violet at this size |
| `silas_freeze`, `silas_hide`, `silas_surge` | `silas-poses-v1` | Low resolution: the crouches are about 230 px tall in the raw take (fine at play size). The surge's wind streaks came out nearly white, not pale violet. One arm trails behind him as asked, but the hand reads a little oddly |
| `silas_strike` | `silas-strike-v1` | Prompt asked for no blade: it has a few links in the hand only, as the game wants |
| `silas_winded` | `silas-winded-v2` | Take 1 had a rounded patch of skin at the chest that read as a bust; one edit fixed it (take 1 kept). The hand at his throat now reads skin on skin, less clearly than take 1. Eye colour is pale, not clearly violet |
| `silas_hurt`, `silas_down` | `silas-hurt-down-v1` | The cells overlapped by 7 px, so they were cut out by hand before keying. The hurt pose's raised leg looks a bit like a kick |
| `trooper_walk` | `trooper-walk-v1` | None seen. The hand lamp is still code and hangs from his fist |
| `trooper_stand`, `trooper_down` | `trooper-poses-v1` | Cells overlapped, cut by hand. Lying flat, his blade shows on his back side |
| `trooper_run` | copied from `games/storm-run/art` | Same picture, new `fill` so his helmet matches the walk's |
| `hush_perch` | `hush-perch-v1` | None seen against the sheet's right-side view |
| `hush_glide` | `hush-glide-v1` | Only the near wing shows; the far wing is hidden. Back legs stay stretched in every frame, as asked |
| `maro_book`, `maro_lamp`, `maro_hurt` | `maro-poses-v1`, from `maro-sheet-v1` | Ledger is under his near arm, where the prompt said far. He's reading with a slight smile. His sheet is my own and not locked by Dylan |
| `maro_run` | `maro-run-v1` | Sweat drops on his head, which I didn't ask for. Falling pages stay beside him in every frame, so they look carried along, not falling |
| `maro_down` | `maro-down-v1` | Reclined rather than flat, with the belt at an odd angle. It's the funniest of the lot, so I kept it |

Code changed to fit the pictures, all in this game's folder:
- `people.js`: with a picture on, Maro's pole, lamp and open book aren't drawn in code, and the warning draws only a shut book over the picture's open one. `STRIKE_HAND` starts the chain from the hand in each frame. The dash's echoes use the picture. The breath puff moved to his mouth. The hiding picture is lifted (`hideLiftArt` in `tuning.js`, provisional, looks only) so his head shows over cover, but not in a doorway.
- `lights.js`: Maro's cone starts at the picture's lantern.
- None of this changes a rule: the bot's times on stage 5 are the same as before the pictures (59.4, 46.4, 46.3 s).

Checked: `node tools/smoke.js silent-cut` after the last change: `PASSED: silent-cut`, 165 ok, 0 failed. Screenshots looked at, with pictures on, at 844x390 x2: stage 1 play, hiding on crates, barrels, sacks and a door, out of breath, Maro reading, warning with the shut book, facing with the cone, hit, the fall with Silas striking, plus every picture side by side at game scale x3 (`%TEMP%\kcheck\silent-cut\artsheet.png`, `states.png`, `pics\`, `pics2\`).

Not checked: motion as a person sees it. I looked at consecutive still frames only, so whether the walk slides or the strike reads needs Dylan's eye. Running with pictures missing: not re-run since this change; the code-figure branch itself wasn't touched, and the earlier stand-in test covers it. Fairness script not re-run because no rule changed. Real phone not tried.

Noticed, not touched: the kit's code Maro (`cast.js`) still reads slimmer than his pictures, which only shows if a picture fails to load.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, as it comes, with this game's scripts at the end |
| `tuning.js`, `tuning-stages.js` | Every number: the rules, then the stage layouts. Each marked PROVISIONAL or sourced (`tuning-stages.js` says so once at the top, all of it provisional) |
| `words.js`, `words-tips.js` | Everything anyone says; the tips along the top |
| `game.js` | `Kit.start(...)` and the thumb. Read this first |
| `world.js`, `foes.js`, `boss.js`, `rules.js` | The rules, with no sound or drawing: lights as functions of time, troopers, Ledger Maro, one step of play |
| `sounds.js`, `feedback.js`, `company.js`, `pals.js` | The game's sound effects; what the rules' events turn into: sound, score, salvage, words, sparks; salvage pickups and Hush going ahead; the two pals |
| `bot.js` | The test bot. Plays copies of the world forward through the game's own `SC.step`; presses only through `input.sim` |
| `bake.js`, `scene.js`, `props.js`, `lights.js`, `hush.js`, `people.js`, `draw.js`, `hud.js` | Drawing only |
| `fairness.js`, `fairness-thumb.js` | The fairness script, run with node. The page doesn't load them |
| `art/REQUEST.md`, `art/sprites.js` | The 19 picture keys, all filled |

## What was built
**What a player does each second.** Hold to creep, let go to freeze: it's a stop-go rhythm against things that move at their own pace. While frozen you're not just waiting: you're reading which way a beam is going (its range is marked on the road, chevrons show its way), cutting a lantern in reach, or letting a trooper walk past so you can cut him from behind your crate. Tap acts on whatever has the TAP ring on it, anywhere on the glass. Two taps close together Surge.

**Light.** Being lit fills an eye over Silas's head: 1.2 s to an alarm moving, 2.6 s frozen, both sped up by each stage's alert number, and it drains in the dark. Frozen behind cover (violet dashes on the road) nothing can see you. Three alarms lose the stage. An alarm also brings near troopers running to where you were and pulls the lamp line 110 px closer.

**The lamp line** is my addition: a row of lantern men behind you, never more than 780 px back, creeping at 11 to 18 px/s by stage. It's why waiting isn't safe and why doing nothing loses. Off screen unless you dawdle; "LAMP LINE n m" shows when it's within 46 m.

**What changes from stage to stage:**
1. The Wet Steps: one idea at a time. A lantern, a beam, a trooper walking away, then two lanterns you have to cut both of, then one flood gate and the first Surge. A careless player can still win it.
2. Oil Row: cutting your own dark, Surge gates (a flood only a dash clears), crossfire beams, and a wide gate that takes two Surges. Glass makes noise, so cutting near a trooper turns him: that's a lure if he's between you and the lantern.
3. Crane Yard: floodlit stretches you can only cross under a passing crate's shadow, keeping pace with hold, let go, hold, with gates between that eat the breath. Out of breath you walk 55 px/s and the crates do 72+: you fall out of the shade.
4. The Long Boards: boards creak, each step on them carries 130 px, and a trooper who hears walks to the sound. Makes him turn his back on you, or walks him into you. Everything else, faster.
5. The Lamplit Warehouse: Ledger Maro reads with his back turned, lit by his own lamp. Book shuts, "!" with a closing ring for 1.1 s, he turns and sweeps a big lamp out and back: only cover beats it. Cut his back three times; each cut he runs to the next bay, past a floodlit gate, with more guards. His turns vary by up to 20% so he can't be counted. The bell turns him round at once. He talks throughout.

**The bond cost.** Three violet feather marks in the panel under the street, one Surge each; breath returns only when frozen (about 9.5 s for one Surge). Out of breath: no Surge, 60% speed, bent over with a hand at his throat, an empty talk bubble over his head, a cool wash on the picture, and his talk boxes go "...". His lines start breaking up below half a chest. The crew react, because he's stopped answering them. **Only Silas's lines go blank**: the kit's `run.talkFilter` rewrites everyone, so it stays unset and `SC.say` filters by speaker. The second time out of breath in one attempt at a stage, and each time after, scars his voice **for the rest of the story run** (`run.carry.rasp`, 3 at most): 0.1 less chest, breath back 12% slower, hoarser lines, and the panel reads HOARSE, RAGGED, IN RAGS. Dying puts it back as it was when the stage began.

**The story.** Maro's ledger names the eleven monsters Silas smuggled out (`shared/stories.js`, "Things I have smuggled") and every captain who carried them, and he's selling it to the Sever. Silas goes in alone to burn it. The last cut: his voice breaks off on "Paid in f". The ending: Maro asks for the line Silas has saved for a year, and Silas has no breath to say it. Then he writes on Bram's slate.

**Upgrades.** Deep Lungs (one more feather per level, 3 to 6; breath 45% faster at level 3), Longer Chain (reach 66 to 132 px; Maro takes 14 px closer), Softer Boots (creep 92 to 113 px/s, board carry 130 to 40 px, light fills 21% slower on the move).

**Pals.** Tuftle: from stage 2, frozen in cover for 18 s with no alarm yet this stage, a 25% chance per cover that eyes open beside you; stay frozen 2.4 s more. Lamplick: from stage 2, a 15% chance per attempt that one lantern flickers with a moth on it; cut that lantern, then reach the dizzy moth within 5 s (if it's behind him, it wobbles after him). Rewards for the opposite of hurrying, and neither is on the boss.

**Endless** strings random chunks from all stages, the line getting faster and closer, and the beams and meter quicker. Score is mostly distance, strikes, cuts, close calls.

**Sound.** Own effects for footstep, creak, chain, lantern down, glass, wind dash, wheeze, gasp, hiding, trooper's warning, "?", bell, meter tick, ledger pages, close call, moth, lamp-line horn, plus kit effects. Two original loops, a sneaking one and Maro's.

## What was checked before the review fixes (2026-11-06; the numbers here are older, see "Review fixes" at the top)
`node tools/smoke.js silent-cut`, last run after the last rule change: **PASSED**, 165 checks ok, 0 failed (`PASSED: silent-cut`). Bot on stage 5, 3 seeds: win 59.4 s, 46.4 s, 46.3 s. Nobody playing: stage 1 loses after 76.6 s, stage 5 after 54.6 s. It covers gate first, every stage won by the bot on 3 seeds with no upgrades, every stage lost with nobody playing, real touch and keys, pause, hidden tab, sound and mute, buying upgrades, the switch, catch moment, saved progress after reload, wrong-way prompt, no sideways scroll, no page errors, at phone 844x390, computer 1440x900, small phone 568x320.

`node games/silent-cut/fairness.js --seeds 40` (set `PW_PATH` if playwright isn't found). Real output, after the last change to any rule:
```
a trooper's "!" shows 1 s before he turns
round 1, 2, 3: Maro's book shuts 1.1 s before he turns (back turned 4.2, 3.4, 2.8 s before the +/- variation; facing 3, 3.4, 3.8 s)
fastest searchlight 154 px/s: at least 2.92 s on screen before it reaches him; it passes over a frozen man in about 0.78 s
behind a trooper when his "!" shows, 20 to 240 px back, answering 0.2 s late: of 111 tries, cut him 56, stopped safely 55, caught in his lamp at the turn 0
  answering 0.35 s late: cut him 49, stopped safely 62, caught 0
  answering 0.5 s late: cut him 42, stopped safely 66, caught 3
Hops (start creeping at each 0.2 s over 40 s, every pair of neighbouring safe places, seed 1):
  stage 1: 10 hops, worst wait 7.6 s, lowest share of starts that work 62%
  stage 2: 14 hops, worst wait 10.2 s, 22%
  stage 3: 15 hops, worst wait 7.8 s, 38%
  stage 4: 18 hops, worst wait 11 s, 17%
  stage 5: 8 hops, worst wait 11.4 s, 9%
Human-speed player (no look-ahead, sees 0.25 to 0.45 s late, no upgrades, 40 seeds):
  stage 1: won 40 of 40; average 32 s, 0 alarms, 0 Surges
  stage 2: won 40 of 40; average 56 s, 0 alarms, 2.1 Surges
  stage 3: won 40 of 40; average 60 s, 0.1 alarms, 1.4 Surges
  stage 4: won 40 of 40; average 78 s, 0.1 alarms, 3 Surges
  stage 5: won 38 of 40; average 67 s, 0.8 alarms, 1.3 Surges, out of breath 0.1 times; lost by bumping a guard, twice
Never lets go of the thumb (tapping only to strike and cut), 20 seeds: stage 1 won 20 of 20 with 1.1 alarms; stages 2 to 5 won 0 of 20
Never moves: loses by the lamp line after 76.6, 61.5, 54.6, 49.3, 54.6 s
Voice: "silas: ...", "sela: Silas? Say something.", "maro: Nothing to say, dear boy?"; lose line when out of breath: "..."
```
How to read that. The hops count only a plain hold from one safe place to the next, with no lure and no waiting for a trooper to pass and cutting him from cover, so the longer waits have other answers. Some windows in the boss rooms and on boards are only one 0.2 s sample wide, which no thumb can use; those hops have other, wider windows, or the share of working starts would be near zero. The human-speed player follows simple rules without slips, so it's not a measure of how hard the game feels; it proves the warnings and gaps can be answered at a human reaction time. The boss numbers were tightened to get it from 30 of 30 and 0.1 alarms to 38 of 40 and 0.8.

Dim phone, same script, screen at 35% brightness (L* differences, last run; a shot lands at a slightly different moment each run, so these move by a few points; pictures `dim-s1..5.png` looked at from an earlier run of the same script, stages 2, 3 and 5 by eye; the numbers cover all five):
- Lit walkway against dark walkway: 32, 33, 42, 33, 36 apart, stages 1 to 5. Target 15.
- Silas's shirt against what's behind him: 27, 40, 36, 35 apart on stages 1, 3, 4, 5. Target 20. Hidden on stage 2, the violet under him is 27 apart from the walkway. Target 12.
- A trooper's coat against the wall is nearly level at 35% (21 against 20 on stage 2, 20 against 16 on stage 5). He reads by his ink outline, his lamp and the faint glow it throws on him, not by colour. I can see him in the pictures; a picture of him later should keep a pale edge.

My own extra runs (scripts in `%TEMP%\kcheck\silent-cut`, not part of the repo):
- Real input path, stepped by hand: one tap does nothing, x stays 30, breath 1. Second tap: breath 0.667, dash on, lands at x 195, exactly `surgeDist` on (a fix: it was overshooting to 179 px). Six 0.27 s pulses: moved 74 px, no breath lost, no Surge. Creep measured 90 px/s (92 less rounding at the start of the press). Three Surges: breath empty, winded, rasp 1, `run.carry.rasp` 1, chest 0.88. Winded speed 54 px/s, Surge refused.
- One tap beside a lantern cuts it; a second quick tap Surges even with the chain still out.
- `run.carry.rasp` 2 at stage start: chest 0.76, Silas's stage 2 line reads "Doctor, I can stand perfectly still...". At 3: chest 0.64, his talk and win lines are "...". At 0: lines back whole. The kit's own carry test (survives Menu, Story, next stage) is in the smoke test.
- Pals with their chance forced to 100%: Lamplick 12 of 12, Tuftle 12 of 12. Natural chances on stage 2, bot playing normally: 5 of 40 runs caught something.
- Upgrades at level 3 read back: chest 1 to 1.6, regen 0.07 to 0.102, reach 66 to 132, creep 92 to 113, creak 130 to 40, fill factor 1 to 0.79. The fair run reads the base numbers.
- Salvage per clear with a clean run (bot, 20 seeds): 22, 29, 33, 38, 30 to 36. With an alarm, 6 less. The kit asks for about 15 to 40.
- Endless, bot, 6 seeds: ends by the lamp line at 202 to 308 s, score 2353 to 3940.
- Pictures: stand-ins for all 19 keys in `art/REQUEST.md`: all load, all 19 get drawn across a pass through every state.
- Talk box: all 57 lines said in play, measured in the real box at 568x320, 667x375, 844x390. It always stays right of x 311 (the bells end at about x 260). Top edge no higher than y 292.5 on the small phone, the feet line is 288. Two longer lines were shortened to get there.
- Draw time with the CPU slowed 6 times, 844x390 at 2x: stage 3 median 3.2 ms, 95th percentile 8.4; stage 4 3.0 and 7.1; boss 3.8 and 6.4. Worst single frames 46 to 144 ms, when a stage's baked pictures are first made. Measured before the last small rule changes, none of them to drawing. This measures issuing the drawing, not the graphics chip.
- Every number in `tuning.js` is read by a script: a search found none unused.
- Screenshots looked at: title, talk, play on three sizes, lantern, beam, crate shade, strike, TAP ring, trooper's warning, hidden, Surge, out of breath, lamp line close, boards ring, Maro reading, warning, facing, hit, Tuftle's eyes, catch moment, paused, say box on the small phone.

## What a test can't tell, and needs Dylan's thumb
- Whether it feels like stealth or waiting. The numbers say waits are mostly under 8 s and the stage rewards speed, but that's the thing to feel first.
- Whether the first stage is easy for a new player, and whether the boss takes "a few tries". The rules-following player at human speed now wins the boss 40 of 40, with no slips; a person will do worse, by how much I can't measure.
- Whether the tap is forgiving enough: any press under 0.28 s acts on what has the TAP ring. A double tap Surges with 0.36 s between two presses of 0.18 s or less, or 0.16 s if either is longer. Real tap lengths on a phone are unmeasured; if Surges misfire, `tapSlowGap` is the number to change. If a slow double tap doesn't take, raise it.
- Whether hold, let go under a crate is fun or fiddly, and whether a quick one ever spends a feather by accident.
- The 0.14 s before he starts moving. It stops a tap walking him out of hiding, but it might feel like lag. A press of 0.2 s strikes after moving him a few px.
- The third cut in motion: Silas stops, Maro falls, the line breaks off. Whether 3 s feels like a beat or a wait.
- Flood beams and the thinner scenery ink: stills look right to me, but it's your eye.
- Sound and music: checked that they play without error, not that they sound good. The two loops especially.
- All motion: Hush's flight, the chain, code figures walking. Checked in still frames only.
- The dim-phone test is a browser's brightness filter, not a real screen in a real dark room.
- A real phone: only Chrome pretending to be one has run this. Weakest-device speed is unmeasured on a real device. The `screen` blend used for light beams is the first suspect if a phone struggles.

## Provisional numbers to confirm
All in `tuning.js` and `tuning-stages.js`, marked. The ones most likely to change: `creep`, `fillMovingSecs`, `fillFrozenSecs`, `drainSecs`, `surgeDist`, `breathRegen`, `raspLoss`, `tapMax`, `creepDelay`, `reach`, `tellSecs`, `lampLen`, `maroBack`, `maroFace`, `maroLampFar`, `lineLead`, stage `alert`, `lineV` and `fast`, `tuftleChance`, `lamplickChance`. Sourced from the spec, not provisional: `maxAlarms` 3.

## Calls Claude made (change any)
- **New mechanics the spec doesn't name:** cutting lanterns with the chain (permanent dark, noisy); the lamp line behind you; moving crate shadows; creaking boards and sounds that draw troopers; freezing in the open slowing the meter rather than hiding you; striking a trooper who's turned his back from either side, so Surging through one then cutting him is a move; streak bonus for strikes in a row ("SILENT x2"); close-call bonus.
- **Voice scars for the run** (`rasp`). The spec says breath returns when frozen, and CAST.md says too much costs him his voice for days. I made going out of breath twice in a stage leave a lasting mark on the run. Blank talk stays for out of breath, as the spec says, and for the ending.
- **Double tap beside a lantern:** the first tap cuts it, the second Surges, unless another lantern is in reach: then it cuts that. Beside a trooper or Maro, it's a strike only, and no tap for 0.56 s after a strike can Surge.
- **The moth wobbles after him** when he cuts its lantern from past it, so the catch always can be done.
- Every stage's name and layout; Lanternreach's streets; the ledger, eleven names and the story; every line of dialogue; the ending; "a year gone" and "two years I paid you" as Silas's time with Maro. Silas is 24, so he was 21 when he started. Nothing about him and Maro goes back further, and nothing about them is romantic.
- The boss is a warehouse with ledger shelves and desks in it, per the spec's "lamplit warehouse". Maro keeps his books there.
- Maro's lamp is the one light that freezing buys nothing against. Wide gates and stage 1's single gate are mine too.
- Maro carries a lantern on a long pole, and is cut three times.
- A warning for a trooper is a stop at the end of his beat, then "!" with a ring. Hush goes ahead to the next safe place, as a hint with no rule to it.
- The bot's plan is hops between safe places; the human-speed player's rules are mine.
- Talk box in the band under the street (`sayAt: 'corner'`), tips along the top. Tips show in story only.
- Keys: Right or D creeps, F strikes, E or Shift Surges, Space is the thumb.
- Prices are the kit's.

## Kit notes
One small kit change, in the fourth pass above (`.kit-unlock`). Worth knowing for the kit's next version: `run.talkFilter` only gets the text, so it can't do "only Silas goes blank"; that's why this game filters in `SC.say` and leaves it unset. `input.tap` fires for any press under 0.28 s; this game now uses that tap for acting, and counts its own double tap on top. `TUNE.tapKit` has to match `TAP_SECONDS` in `input.js`. Effects aren't cleared before the ending, so a float text spawned on the last step stays frozen behind the ending talk; this game just doesn't spawn one there.

## Noticed, not touched
- The kit's lying-down pose floats about 11 px over the ground at this scale; this game lowers it (`downDrop`).
- The kit's Maro figure (`shared/kit/cast.js`) reads slim, where the brief calls him stout and I've written him round. Pictures will settle it, but `art/REQUEST.md` asks for stout.
- Silas's code figure has no chain or knife at the sash (sheet has both) and draws small neck marks though he faces right, where the sheet's right-hand view shows none. Too small to read at play size; pictures will settle it.
- The trooper's talk portrait is still the kit's plain code bust. Listed as NEEDS PICTURE in the fourth pass.
- Hush's talk portrait is the bond mark, as the kit does for all partners.
