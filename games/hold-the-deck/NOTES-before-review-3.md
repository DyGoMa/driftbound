# Hold the Deck: notes

Status: built, not yet seen running by Dylan. All 20 pictures made and wired in (see "The pictures"); code art stays as the fallback. `live` is not set. Nothing has been played by a person's thumb.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, with this game's scripts at the end |
| `tuning.js` | Every number, each marked PROVISIONAL or with its source |
| `words.js` | Everything anyone says: talk scenes, radio, lose lines, ending, meal text, pal lines, hints |
| `game.js` | `Kit.start(...)`, the sounds this game defines, its two music loops, the order of one step. Read this first |
| `geom.js` | Where things are on the deck, which lane a tap means, and the two sums the iron slows |
| `bram.js` | The thumb, walking, swinging, Iron, Guts, Grist's charge |
| `foes.js`, `hazards.js` | The boarders; everything that warns first (hooks, crates, ropes) and the rule that keeps warnings fair |
| `waves.js` | Beats, waves, the meal, clearing a stage |
| `boss.js`, `boss-step.js`, `pals.js` | What the bear does to Bram and he to it; its three phases, step by step; the two pals |
| `bot.js` | The test bot. Presses only through `input.sim` |
| `scene.js`, `title.js`, `bram-art.js`, `people.js`, `grist-art.js`, `bear-art.js`, `warn-art.js`, `draw.js`, `hud.js` | The drawing |
| `art/sprites.js`, `art/REQUEST.md` | The 20 pictures with their measured numbers; what each picture had to show |
| `test/fairness.js` | The fairness proof. `node games/hold-the-deck/test/fairness.js --seeds 16` |

## What was built
**What you do each second.** You look up three lanes from behind Bram and pick where the hammer goes next. Tap a lane: he walks there and swings when he arrives, as soon as the hammer's back, so a tap is never dropped. He hits anything past the gold line in that lane, so letting two bunch up pays more and costs a risk. A swing at nothing takes longer, says WHIFF and costs him his footing for a moment, more if he keeps doing it, so sweeping the lanes without looking loses to reading them. A lit lane under him cancels that, so a dodge is never late because of it, and walking out of danger with nothing to hit doesn't swing at all. Keep your thumb down past 0.34 s and he turns to Iron, where he stands.

**The bond cost.** Every Iron adds 8% grey, held longer than 1.2 s adds more. It never goes away by itself. It slows his walk (0.17 s a lane at none, 0.44 s at full) and his swing (0.30 s, 0.69 s at full), and it spreads over him in the same order on the figure in the lane and the body icon: left shoulder and forearm at the start (the sheet's base state), then the arm, the back, the leg, the other side, the neck, the skull. His walk stiffens and his boots clank from 50%. It lives in `run.carry.iron`, so it survives Next stage, Menu and a reload; dying puts back what the stage began with; stage 1 starts clean.
- **Volleys make it a choice you can't skip.** From stage 2, now and then every lane lights at once: hooks all thrown together, crates all dropped, the bear raking everything. Nothing can be walked out of. Hold for Iron (8% for good, and Grist's meter jumps), or take 2 Guts, more than a bowl of broth gives back. A thumb that never holds can scrape through stages 2 to 4 with 1 Guts left, and can't beat the bear: section F below.
- **The greyer he is, the harder he hits**, smoothly: a swing is worth 1 at no grey, 1.5 at half, 2 at full. It's kept under what the slowness costs, so more grey never hits harder per second than less, and there's no point on the bar where one more Iron changes everything. (Till the review it doubled at 60%, which made one Iron the difference between nearly hopeless and easier than clean.)
- **At 100% there's no Iron left** ("ALL IRON" on the icon, "NO IRON LEFT" over him, the warning plate says MOVE!, Bram says so). He still walks and swings, and volleys only take 1 Guts, since he's mostly anvil. It's winnable: section C.
- **No grey is a wall.** Dying on a stage leaves one more Guts for the next try at it, up to 3, and Ione says so. On the bear Grist's meter fills up to half as fast again at full iron, the boarders come up to half as far apart, and the bear skids long enough for the longer walk.

**Grist** sleeps in his button in the corner, snoring. Kills and Iron blocks fill his meter. Then he's awake, the button says CHARGE!, and pressing it sends him up the lane Bram is in, flattening everything in it, rams and walls included. He takes a moment to trudge back.

**Meals.** One pot between waves: Bone Broth (Guts +2), Pepper Stew (28% quicker for the next wave, or on the bear till the next bowl), Ione's Tonic (iron back 6%, less than one Iron's worth). See section E below for what each does on the boss.

**What changes from stage to stage** (each stage's new thing changes what you're doing, not only how fast):
1. **The Slipway** (golden dusk, 57 s). Boarders and the odd runner. Learn the swing and Grist.
2. **Hook Lines** (blue evening, 82 s). Cutters stop at range and throw hooks down a lit lane, twice, then walk in. Leave the lane, or hold for Iron and it bounces back up and takes out the first boarder it meets. Others drop in part way down on ropes. Three volleys of hooks.
3. **Crane Hour** (night rain, 85 s). The crane drops crates. One kind is aimed at the lane you're standing in, so you can't stay put. The other lands part way down and stays: boarders must walk round it into the next lane, so the traffic changes. Smash it for salvage, or keep it as a wall. Three abreast from here on. Four volleys of crates.
4. **The Ram** (deck on fire, 100 s). Plate-carriers take two hits. Rams take three swings, one Iron or one Grist; they shove you aside and hurt twice at the door. So you start saving Grist. Hekka watches from the far rail. Four volleys.
5. **What the Bear Was** (broken deck, white light under it). Phase 1: paws burst through a lit lane; step out, step back, hit them. Phase 2: it stands chained at the far end and rakes lit lanes, usually two at once; only Grist can knock it into reach, in his lane; hit the core. Phase 3: the chain goes, it charges down whichever lane you're in; step out and hit the core as it skids, or stop it with Iron and get more than twice as long at the core. Every fourth paw it shakes the whole deck, and every fourth attack after that it rakes all three lanes. A meal between each phase, and the deck goes quiet first so the crew can be heard. Then it goes down and Hekka speaks.

Endless: waves with everything mixed in, a meal after every second wave, volleys coming closer together, speed and gaps tightening well past where a thumb can keep up, unlocked by the ending. A run ends in about 4 to 7 minutes, with the grey as the clock: 218 to 437 s on 4 seeds each for the perfect bot, the person-like thumb and the new player's thumb.

**The story.** The Gullwake's on the slip, the crew's ashore for timber, Sever come for Grist. Bram holds his galley. The scene before stage 4 and the ending both change with how grey he is (the ending has three versions: under 12%, under 50%, 50% and up). The last thing in the game is a bowl left out on the deck by the bear. Every line is written to the voices in `CAST.md`; Grist doesn't talk, his lines say what he does.

**Pals.** Rivetling comes to iron: from stage 3, hold Iron for 1.3 s (longer than any block needs), 40% chance once per attempt; it shuffles over for 2 s, and if you let go it rolls away. The whole hold costs about 18% iron. Spoonling comes to wasted food: from stage 2, cook broth at full Guts or tonic with no iron, 60% chance; it begs in another lane for 7 s, walk to it.

**Upgrades.** Thick Apron (+1 Guts per stage per level), Grist's Temper (meter fills 25% faster per level), Big Pot (every level: broth +1, pepper 4% quicker, tonic 0.5% more). Output of `HD.mealNumbers`: level 0 broth 2, pepper 0.72, tonic 0.060; level 1 3, 0.68, 0.065; level 2 4, 0.64, 0.070; level 3 5, 0.60, 0.075. One Iron is 0.08 at every level. Guts 5 to 8, meter fill x1 to x1.75.

**Sound.** Effects for every action, 11 defined in `game.js` (stomp, clunk, ironOn, charge, pot, snore, chain, roar, slash, whiff, crate), the rest the kit's. Two original loops: a stomping hornpipe in D dorian, and slow iron steps in E phrygian for the bear.

## What was checked, with the real results (2026-11-06, after the review fixes)
`node tools/smoke.js hold-the-deck --seeds 5`: **PASSED**, at phone 390x844, computer 1440x900, small phone 320x568. `node tools/smoke.js storm-run --seeds 1`: **PASSED** (the kit changed by one portrait). Test bot on 60 more seeds, no upgrades: stage 2 60/60, stage 3 60/60, stage 4 60/60, boss 60/60.

**Fairness**: `node games/hold-the-deck/test/fairness.js --seeds 16`: **PASSED**. It plays through the real controls with a thumb that can only act after a reaction delay.

A. The warning sums, from every warning fired in whole-stage play at no iron and full iron. "Spare" is the warning minus the walk to a dark lane (or for a volley, the hold), which is what's left for a person's reaction. Numbers from the run of the same code before the final bot tweak; the log's FAIL/ok lines all passed on the last run. Smallest kept:
```
volley: warned 1.50 s, hold 0.34 s, smallest time to spare 1.16 s
hook: warned 1.30 s or more, smallest time to spare 0.45 s
drop: warned 1.35 s or more, smallest time to spare 0.91 s
paw: warned 1.15 s or more, smallest time to spare 0.71 s
charge: warned 1.35 s or more, smallest time to spare 0.91 s
swipe: warned 1.05 s or more; passes at the 0.40 bar
```
A new warning waits if it would leave less than 0.4 s to spare (`fairReact`), or no dark lane he can reach without crossing a lit one (`HD.fairToWarn`). The sum now measures from wherever's further, the lane he's picked or where he is. A volley waits until nothing else is lit, and nothing else is lit until it's landed.

B. Dodging only, boarders ignored, at reaction 0.25, 0.4 and 0.55 s: walking at iron 0, 0.5 and 1; holding for Iron at iron 0 and 0.5. **0 hits from warnings in all 15 settings**, about 150 to 180 warnings each. Volleys don't count for a walker (they can't be walked out of, on purpose), and for a holder only up to the moment he runs out of Iron.

C. Whole stages with a person-like thumb (reaction 0.38 to 0.56 s, 4 taps a second, a 0.7 s lapse about every 6 s), 16 seeds:
```
iron 0:   16/16, 16/16, 16/16, 16/16, 13/16
iron 0.5: 16/16, 16/16, 16/16, 15/16, 11/16
iron 1:   16/16, 16/16, 14/16,  8/16,  6/16    (no Iron stance at all)
```

D. A new player's thumb (reaction 0.5 to 0.7 s, under 3 taps a second, a 0.9 s lapse about every 4 s), from no iron: 16/16, 16/16, 15/16, 15/16, 2/16. Guts left on stage 1: 5 every time.

E. The meals on the boss from half iron, same thumb, one kind only:
```
broth: 12/16 wins, about 89 s, iron at the end 0.74
pepper: 15/16 wins, about 74 s, iron at the end 0.67
tonic: 9/16 wins, about 80 s, iron at the end 0.61
```
Pepper's now the strongest of the three on the bear for this thumb. Which feels right is Dylan's call.

F. Never holding, person-like thumb: stage 2 16/16 with 2 or 3 Guts left, stage 3 16/16 with 1 left, stage 4 11/16 with 1 left, **boss 0/16**.

G. The old cliff, boss, person-like thumb: iron 0.5 11/16, 0.59 13/16, 0.6 12/16, 0.7 9/16. The same on 24 other seeds, my own script (`%TEMP%\kcheck\hold-the-deck\fx-measure.js boss 24`, not in the repo), person then new player: iron 0 24, 6. 0.3 13, 7. 0.5 24, 5. 0.59 20, 8. 0.6 16, 4. 0.7 16, 1. 0.85 12, 0. 1 10, 0. So no jump up, but the rates are noisy: a thumb's result is chaotic from seed to seed, and 13 at 0.3 next to 24 at 0.5 is that noise, not a rule. Holding for every volley from no iron: person 18/24, new player 9/24, ending at about 0.5 iron.

The slowest thumb at deep grey: it wins 0/24 at 5 Guts, but with the 3 extra Guts it has after three lost tries, 10/24 at 0.7, 6/24 at 0.85, 5/24 at 1.

H. A blind sweep (left, middle, right, middle, no looking), 3 taps a second, 16 seeds: stage 1 8/16 with 1 to 4 Guts left, stages 2 to 5 0/16. By my script at 4 taps a second: stage 1 3/16 (5/16 with random Grist), stages 2 to 5 0/16. At 2 taps a second: 0/16 everywhere.

Whole story runs, stage after stage with iron carried, retrying on death with the extra Guts, 6 runs each (my own script). Tries per stage, and the iron at the end:
- Test bot: 1,1,1,1,1 every time; iron 0.72 to 0.92.
- Person-like thumb that holds for every volley: boss 1 to 4 tries, iron 1.00 at the end.
- New player's thumb: stage 4 up to 4 tries, boss 2 to 9; iron 0.64 to 0.99.

My own extra checks (`%TEMP%\kcheck\hold-the-deck\fx-verify.js`, not in the repo), through the real page:
- Real pointer presses on stage 1, 3 tries each: 120, 180, 240, 280, 300, 320, 340 ms: Iron 0 of 3. 380, 450 ms: Iron 3 of 3, iron 0 to 0.08.
- A tap on another lane with a target in reach, after a hit or a whiff, 0.09, 0.2 or 0.3 s later, at iron 0, 0.5, 0.75, 1: it hit every time, 24 of 24. Slowest: 0.95 s after the tap, at full iron just after a whiff.
- Pepper then broth on the boss: walk step 0.170 before, 0.122 after pepper, back to normal for his grey at the second bowl (0.192 at that iron).
- The ending: iron 0 to 0.11 "Hardly any new grey", 0.12 to 0.49 "New grey down the arm", 0.5 and up "Shoulder to hip". Juno's "Stiff" line is gone from the low one.
- A real boss run with the real meal screens, talk box log: Ione's meal line up 2.8 s before the screen, Sela's too; each reaction line shows for 2 s, then Hekka's. If Grist knocks it down straight away, "Core's open!" goes up at once and the waiting lines come after it, not lost. Meal screen title: "ONE BOWL, THEN BACK AT IT", pepper reads "Till the next bowl".
- Talk box bottom in logical px, at the longest line in play (74 characters), deck starting at 92: 320x568 105, 360x640 93, 375x553 108, 390x664 90, 320x460 129, 390x844 16. So a three-line box covers the first bit of the far deck for a few seconds on small phones, down to about 3% of the lane at 320x568 and 12% at 320x460. Hekka's two lines at the bear's reveal: 69 at 320x568, 85 at 320x460, and its head now starts at 86.
- `contextlost` on a baked canvas: the next frame paints it again. The event was sent by hand. Whether a real browser fires it for the blank pictures seen in the review is unproven; I never reproduced them.

Screenshots looked at (`%TEMP%\kcheck\hold-the-deck\fx\`, 320x568, 390x664, 320x460, 390x844): title at each, Hekka's portrait, hint before anything sets off, a whiff, volley of hooks and crates, Hekka on the rail clear of the pause button, long radio line, bear coming up through planks, bear standing with both Hekka lines above its head, boss meal, core open with the right words, rake on all lanes, read-outs. Smoke's story shot ended with the "He ladles one-handed" card at iron 84%.

## The pictures (2026-11-06)
24 image-tool runs on the ChatGPT plan, no limit hit, no timeouts; 6 more takes are hand fixes on copies. 30 files in `art/raw/`, 1.5 MB of sprites in all. Each take looked at against its locked sheet.

| Key | Take used | Flaws left in |
|---|---|---|
| `bram_back_i0` | `bram-back-i0-v2` (v1 had the hammer in the wrong hand on the follow-through) | On the follow-through his right arm is hidden behind him and only the fist shows past the left shoulder |
| `bram_back_i1` | `bram-back-i1-v1` | Left tattoo partly under the grey, as it should be; cloth a touch redder than i0 |
| `bram_back_i2` | `bram-back-i2-v2` (v1 with the cloth colour matched to i0 by hand) | The grey's edge down the spine is very straight |
| `bram_back_i3` | `bram-back-i3-v3` (v1 with the cloth colour matched by hand; v2 was a redo and came out redder, not used) | Grey is more cracked than the earlier grades; towel a little pink |
| `bram_front_i0`, `i1` | `-v1` | None seen. All four front strips come from the same hammer and pose |
| `bram_front_i2`, `i3` | `-v3` (v1 with a text-like squiggle above the anvil painted out; v2 was a worse paint job) | A faint smudge where the squiggle was, invisible at 66 px. Grey hand on the hammer in i3 |
| `trooper_walk`, `trooper_cutter` | `-v1` | Cutter's hook line is a bit bright |
| `trooper_run_front` | `-v1` | Sheet's coat comes out as a short jacket here, which the list allows |
| `trooper_shield` | `-v1` | Frame 4 (strike) moves the plate to one side |
| `ram_front` | `ram-front-v2` (v1's spikes hung off the lower edge; its strain frame was too big) | The three spikes read as round studs head on. Strain frame still a bit wider and sits slightly higher |
| `crate` | `crate-v1` | Square, so narrower than the code crate |
| `grist_charge` | `grist-charge-v1` | The lifted foot is a rounded ball. Sheet's back view shows four legs, plus the middle pair underneath |
| `grist_sleep`, `grist_awake` | `-v1` | Sleep's horn tips down and reads more like a spike than an anvil. Awake's legs are longer than the sheet's |
| `bear_front` | `bear-front-v1` | Tool gave 1536x1024, not the 2304x1536 asked for, so a little soft at its biggest on a sharp phone. Fur leans warm grey-brown, as on the sheet |
| `bear_paw` | `bear-paw-v2` (v1 showed cute paw pads) | Reads as a furred four-fingered hand; fur pinker than the bear |
| `hekka_front` | `hekka-front-v1` | Lance design is Claude's (a plain pole with a hooked white blade), in her right hand; the sheet leaves the lance for a prop sheet |

Code changed for the pictures: the bear's flash follows `HD.coreUp`, which is 0.45 with the picture on. A boarder's strike glint moves to his right hand, left of the picture, and the ram's picture has none.

Checked: all 20 load; `node tools/smoke.js hold-the-deck --seeds 5` **PASSED** with 165 checks ok. Screenshots looked at with pictures on: title, stage 1, swing, Iron, hooks, iron at 30, 60, 70, 90, 100%, crate, ram, plate-carrier, Grist's charge, Hekka on the rail, paw, bear coming up, rake, open core, charge, collapse, hurt, Bram down. Eight shots 90 ms apart on stages 2 and 4, so stills in order, not motion. With every picture blocked: 0 of 20 load, the bot still won stage 1 and the boss on code art, no page errors.

Draw time with the CPU slowed 6 times at 390x844, 2x: stage 4 median 2.0 ms, 95th percentile 2.9, worst 94; boss median 1.9, 95th percentile 3.3, worst 312. This measures issuing the drawing, not the graphics chip. **The 312 ms is one frame, and I assume but didn't prove it's the bear picture being unpacked the first time it's drawn.** It may show as a hitch when the bear first comes up on a slow phone.

Still needs Dylan's eye: whether the walk and swing look right moving, since these strips have few frames and the boarders walk straight at the camera. `fps` isn't used on Bram or the boarders: the game picks their frames.

## What a test can't tell, and needs Dylan's thumb
- **Everything about feel.** Whether tap-and-swing feels heavy and good, whether a lane walk feels right, whether the gold line is easy to read as "now". Bot wins say it can be done, not that it's fun.
- **Difficulty.** The "person-like" thumb never misreads a lane or panics, so real players will do worse than those numbers. Stage 1 should be easy, the boss should take a few tries. Both are guesses until someone plays. The likeliest numbers to change are in the provisional list below.
- **Holding for Iron.** A press has to last 0.34 s, past the kit's 0.28 s tap. Short enough to trust when a volley's coming? A real thumb on a real phone adds its own delay.
- **Whether the bear takes a few tries.** Measured above, but these thumbs never misread a lane. If it's too hard or easy, in `tuning.js`: `boss.coreP2`, `boss.coreP3`, `boss.rakeAllEvery`, `boss.swipeWarn`, `boss.trickle2`, `volleyHurt`. Stage 1 hasn't been tuned against a real first-timer's whiffs either.
- **The WHIFF stumble.** Whether a real miss feels fair or sticky: `whiffStagger`, `whiffRunAdd`.
- **Whether the warnings read in the middle of a fight.** Lit lane, plate, band, alarm. Proved long enough; not proved noticed.
- **The music and effects.** Checked that they play without error, not that they sound good.
- **Motion.** The swing, the stiff walk, boarders walking at the camera, Grist's gallop, the bear's slide. Stills only, so far. Bram's swing is a sideways sweep because a chop forward can't be read from behind; a person may want it heavier.
- **The bear's look in motion, and the fur.** Drawn from the sheet's front view. I'd call the code bear bold and on-model in stills; Dylan's eye decides.
- **A real phone.** Only Chrome pretending to be one has run this. Weakest-device speed is unmeasured on a real device.

## Provisional numbers to confirm
All in `tuning.js`, marked PROVISIONAL. Most likely to change: `holdSecs`, `stepSecs`, `swingCd`, `whiffStagger`, `ironPerUse`, `ironStepSlow`, `ironSwingSlow`, `ironHeavy`, `volleyHurt`, `stages[].waves[].volleysAt`, `mercyMax`, `reachD`, `tonicIron`, `pepperMul`, `brothGuts`, `foes.*.speed`, `stages[].speed`, `stages[].waves`, `temperPerKill`, `endless.*`, and from `boss`: `trickle2`, `coreP2`, `coreP3`, `openSecs`, `openDodged`, `chargeWarn`, `swipeWarn`, `rakeAllEvery`, `quakeEvery`. Every number the rules play by is in `tuning.js` now; numbers that only change a look stay beside the drawing. It's 234 lines, past the 200, because it's all there: the batch asks for one file. Not provisional: Bram's 198 cm (CAST.md), the trooper's 180 cm (sheet).

## Calls Claude made (change any)
- The whole story: the crew ashore for timber, Sever after Grist, Hekka offering a deal, flour, the bowl on the deck at the end. Stage names: The Slipway, Hook Lines, Crane Hour, The Ram, What the Bear Was. Every line.
- The view: from the galley door up the deck, with Bram seen from behind, so the grey shows on his back and arm. So all the pictures it wants are front and rear views, not side-on (`art/REQUEST.md`).
- Tap acts at once, on the press. A tap on another lane walks there and swings on arrival, whatever's there, unless a lane's lit and nothing's in reach. A swing at nothing costs him his footing.
- He holds a lane: a boarder stops to fight him and squares up for 0.45 s before his blade lands. One in a lane Bram isn't in walks on to the door.
- Guts: one number for hits on him and boarders through the door, 5 per stage, full again at each stage. Only iron carries.
- Grist goes up the lane Bram is in, from a button in the corner, since a one-thumb swipe would be hard to find. Spec says "charges down a lane"; he charges *up* it, away from the galley, which is where the boarders are.
- The talk box in play sits at the top (`sayAt: 'top'`), above the far end of the deck. Warnings are on the lanes below it. Lines take turns instead of cutting each other off; in-play lines are kept to 74 characters.
- **Volleys** (all three lanes at once, Iron or 2 Guts) are mine, to make the bond cost unskippable. So is the rule that a thumb that never holds can't beat the bear, and hurts of 1 Guts at full iron. The spec's "Hold to turn to Iron" doesn't ask for any of it.
- **One more Guts per lost try on a stage, up to 3**, with Ione's line. Mine, so grey is never a wall. It isn't saved, so a reload forgets it. It does let a fair run's clear bonus grow slightly, since Guts left pay score.
- The bear stands further down the deck (`standD` 0.42, was 0.30) so its head clears the talk box on phones with no spare height. Its numbers are harder: paws and rakes hurt more, warnings shorter. Boarders fewer. Hits now come from the bear more than from the door.
- Nothing attacks while a hint's plate is up (4.2 s), so a stage starts with 4 quiet seconds, and retries do too. That's how the plate stopped hiding things.
- Grist is drawn nearly Bram's height on the title, for "the size of a truck", and neither is drawn if the menu leaves under 64 px, as at 320x460.
- Hekka on the rail moved left of the pause button.
- New and changed lines for Ione's deadpan science innuendo (stage 2 talk, first Iron, half grey, tonic, ending low and mid), Sela's ending line (she was already on the radio, so no "we saw the smoke"), Juno's ending line by grey.
- Iron also bounces hooks and shakes boarders off when let go, so it's tempting, not just a tax. Full iron has no Iron stance. Heavier hands as the grey spreads. None of these are in the spec.
- Tonic at 6%, so "pull back the iron a little" stays a little, and Big Pot at every level stays under one Iron's 8%. It was 12%, then 7%.
- Pepper Stew lasts one wave, or on the bear till the next bowl. Broth and tonic are instant.
- Hazards the spec doesn't name: ropes, crate drops and walls, rams, plate-carriers. Bear attacks: paws, rakes, charges.
- The third phase, where the chain breaks. Spec says "breaks through the deck in phases".
- Hekka watches from the far rail on stage 4. Her figure carries a plain lance; the sheet leaves it for later.
- Both pals' catch conditions and chances.
- The ending has three versions, split at 12% and 50% iron.

## Kit notes
Nothing was forked. One change in `shared/kit`: Hekka got a code portrait in `speakers.js` (`hekkaFace`, front-facing, grey plate, black bar, white ring, per hekka-sheet-v6), set the same way as Silt's, because the plain bust turned her away with a grey blob on her chest. It's additive: every other speaker is untouched, and Tide Gap's Hekka gets it too. `README.md` section 6 says so. `tools/smoke.js storm-run --seeds 1` passed afterwards. Two things the kit could offer:
- `run.stage.talk` is read after `init`, so changing it there is how the talk scene follows the iron. Works; not documented.
- `HD.rememberEnding` writes `Kit.def.ending` for the same reason, and uses `DriftSave.setSetting('hd_ending_band')`.

## Pictures this game still wants (none made in the review fixes)
- Hekka's talk portrait, painted or cut from `hekka-sheet-v6.png` as Silt's was. The code portrait stands in.
- `grist-sleep`: the horn reads as a small forward spike; the sheet has a huge upright anvil. The player sees this one most, on the corner button. Grist is drawn larger on the title now, but the picture itself still needs redoing.

## Noticed, not touched
- A swing lands in the lane Bram's headed for, not the one he started it in, so a second tap inside its 0.07 s wind-up moves the hit (`landSwing`, `w.target`).
- Salvage per clear is a touch over the kit's 40 at the top of stage 3 (42) and stage 4 (45).
- At 320 px wide, a full-width talk box comes up to 6 CSS px over the pause button's left edge (`.kit-say` and `.kit-pause`, in `kit.css`). The button still works. All upright games will share this.
- The smoke test's wrong-way-phone shot failed the title screen by 19 px on my first, longer tagline. A portrait game's title has about 3 lines of tagline to spend when held the wrong way. Other upright games may hit it.
- In test runs, every retry of a stage uses the same seed (`Kit.seed * 1000 + index`, `makeRun` in `shared/kit/game.js`), so a bot that loses once in a story walk loses the same way until the test times out. It caught me once while tuning.
- `shared/games.js` has this game's `live: false`, which I left.
