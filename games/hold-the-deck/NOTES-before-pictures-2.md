# Hold the Deck: notes

Status: built, not yet seen running by Dylan. All 20 pictures made and wired in (see "The pictures"); code art stays as the fallback. `live` is not set. Nothing has been played by a person's thumb.

These notes before the third review, word for word: `NOTES-before-review-3.md`.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, with this game's scripts at the end |
| `tuning.js`, `tuning-boss.js` | Every number, each marked PROVISIONAL or with its source. The bear's are in the second file, so neither passes 200 lines |
| `words.js`, `words-boss.js` | Everything anyone says: talk scenes, radio, lose lines, ending, meal text, pal lines, hints. What's said on the bear is in the second file |
| `game.js` | `Kit.start(...)`, the sounds this game defines, its two music loops, the order of one step. Read this first |
| `geom.js` | Where things are on the deck, which lane a tap means, and the two sums the iron slows |
| `bram.js`, `grist.js` | The thumb, walking, swinging, Iron, Guts; Grist's meter and charge |
| `story.js` | Why the grey can't be washed off from the stage list |
| `foes.js`, `hazards.js` | The boarders; everything that warns first (hooks, crates, ropes) and the rule that keeps warnings fair |
| `waves.js` | Beats, waves, the meal, clearing a stage |
| `boss.js`, `boss-step.js`, `pals.js` | What the bear does to Bram and he to it; its three phases, step by step; the two pals |
| `bot.js` | The test bot. Presses only through `input.sim` |
| `scene.js`, `title.js`, `bram-art.js`, `people.js`, `grist-art.js`, `bear-art.js`, `warn-art.js`, `draw.js`, `hud.js` | The drawing |
| `portraits.js`, `fit.js` | The trooper's talk portrait; two page styles for this game only |
| `art/sprites.js`, `art/REQUEST.md` | The 20 pictures with their measured numbers; what each picture had to show |
| `test/fairness.js`, `test/thumb.js` | The fairness proof, and the late-seeing thumb it plays with. `node games/hold-the-deck/test/fairness.js --seeds 16` |

## What was built
**What you do each second.** You look up three lanes from behind Bram and pick where the hammer goes next. Tap a lane: he walks there and swings when he arrives, as soon as the hammer's back, so a tap is never dropped. He hits anything past the gold line in that lane, so letting two bunch up pays more and costs a risk. A swing at nothing takes longer, says WHIFF and costs him his footing for a moment, more if he keeps doing it within 2.5 s, so sweeping the lanes without looking loses to reading them. A lit lane under him cancels that, so a dodge is never late because of it, and walking out of danger with nothing to hit doesn't swing at all. Keep your thumb down past 0.34 s and he turns to Iron, where he stands. With something in reach the press swings at once; with nothing there it waits for the thumb to lift, so a hold for Iron never says WHIFF and never counts as a miss.

**The bond cost.** Every Iron adds 8% grey, held longer than 1.2 s adds more. It never goes away by itself. It slows his walk (0.17 s a lane at none, 0.44 s at full) and his swing (0.30 s, 0.69 s at full), and it spreads over him in the same order on the figure in the lane and the body icon: left shoulder and forearm at the start (the sheet's base state), then the arm, the back, the leg, the other side, the neck, the skull. His walk stiffens and his boots clank from 50%. It lives in `run.carry.iron`, so it survives Next stage, Menu and a reload; dying puts back what the stage began with; stage 1 starts clean.
- **Volleys make it a choice you can't skip.** From stage 2, now and then every lane lights at once: hooks all thrown together, crates all dropped, the bear raking everything. Nothing can be walked out of. Hold for Iron (8% for good, and Grist's meter jumps), or take 3 Guts, more than a bowl of broth gives back. Stages 2 to 4 each have more volleys than 5 Guts and the bowls can pay for, so each asks for some Iron: a thumb that never holds loses stage 2 on (section F).
- **The grey can't be washed off from the list.** Picking stage 1 starts a new run with no iron (kit rule, so nobody's stuck with a ruined one), but that run has to walk the stages to stay clean. Skipping ahead from the list takes on the grey of the run that last came this way; going back over a stage already passed is practice and can't lower it (`story.js`).
- **The greyer he is, the harder he hits**, smoothly: a swing is worth 1 at no grey, 1.5 at half, 2 at full. It's kept under what the slowness costs, so more grey never hits harder per second than less, and there's no point on the bar where one more Iron changes everything. (Till the review it doubled at 60%, which made one Iron the difference between nearly hopeless and easier than clean.)
- **At 100% there's no Iron left** ("ALL IRON" on the icon, "NO IRON LEFT" over him, the warning plate says MOVE!, Bram says so). He still walks and swings, and volleys only take 1 Guts, since he's mostly anvil. It's winnable: section C.
- **No grey is a wall.** Dying on a stage leaves one more Guts for the next try at it, up to 3, and Ione says so, unless that try took a volley on the chin and never held once: then Ione says why and there's no extra. On the bear Grist's meter fills up to 2.2 times as fast at full iron, the boarders come up to twice as far apart, the core stays open longer, every warning gets the extra one lane's walk costs him, and the bear skids long enough for the longer walk.

**Grist** sleeps in his button in the corner, snoring. Kills and Iron blocks fill his meter. Then he's awake, the button says CHARGE!, and pressing it sends him up the lane Bram is in, flattening everything in it, rams and walls included. He takes a moment to trudge back. Till the meter's full a tap there is a tap on the right lane. On the bear the charge also breaks through a paw in his lane; it says WAIT and keeps the meter whenever it couldn't land (the bear's rising, sliding, or open in another lane); and the meter is always full when the bear first stands up, so nothing spent under the planks can leave phase 2 with no way in.

**Meals.** One pot between waves: Bone Broth (Guts +2), Pepper Stew (28% quicker for the next wave, or on the bear till the next bowl), Ione's Tonic (iron back 6%, less than one Iron's worth). See section E below for what each does on the boss.

**What changes from stage to stage** (each stage's new thing changes what you're doing, not only how fast):
1. **The Slipway** (golden dusk, 55 s). Boarders and the odd runner. Learn the swing and Grist.
2. **Hook Lines** (blue evening, 76 s). Cutters stop at range and throw hooks down a lit lane, twice, then walk in. Leave the lane, or hold for Iron and it bounces back up and takes out the first boarder it meets. Others drop in part way down on ropes. Three volleys of hooks.
3. **Crane Hour** (night rain, 85 s). The crane drops crates. One kind is aimed at the lane you're standing in, so you can't stay put. The other lands just past the gold line, where the hammer reaches, and stays: boarders must walk round it into the next lane, so the traffic changes. Smash it for salvage, or keep it as a wall. Three abreast from here on. Four volleys of crates.
4. **The Ram** (deck on fire, 94 s). Plate-carriers take two hits. Rams take three swings, one Iron or one Grist; they shove you aside and hurt twice at the door. So you start saving Grist. Hekka watches from the far rail. Three volleys, five rams.
5. **What the Bear Was** (broken deck, white light under it). Phase 1: paws burst through a lit lane; step out, step back, hit them. Phase 2: it stands chained at the far end and rakes lit lanes, usually two at once; only Grist can knock it into reach, in his lane; hit the core. Phase 3: the chain goes, it charges down whichever lane you're in; step out and hit the core as it skids, or stop it with Iron and get more than twice as long at the core. Every fourth paw it shakes the whole deck, and every fifth attack after that it rakes all three lanes, with a breath after either. A meal between each phase, and the deck goes quiet first so the crew can be heard. Then it goes down and Hekka speaks.

Endless: waves with everything mixed in, a meal after every second wave, volleys coming closer together, speed and gaps tightening well past where a thumb can keep up, unlocked by the ending. Ended in 156 to 293 s on 6 seeds with the person-like thumb, 91 to 234 s with the new player's: wave 6 to 10, and 4 to 8.

**The story.** The Gullwake's on the slip, the crew's ashore for timber, Sever come for Grist. Bram holds his galley. The scene before stage 4 and the ending both change with how grey he is (the ending has three versions: under 12%, under 50%, 50% and up). The last thing in the game is a bowl left out on the deck by the bear. Every line is written to the voices in `CAST.md`; Grist doesn't talk, his lines say what he does.

**Pals.** While a pal's on deck, any line with a joke in it keeps quiet (`adult: true` in the words), and its own line goes up at once, so batch rule "pals are never in flirting or innuendo" holds. Rivetling comes to iron: from stage 3, hold Iron for 1.3 s (longer than any block needs), 40% chance once per attempt; it shuffles over for 2 s, and if you let go it rolls away. The whole hold costs about 18% iron. Spoonling comes to wasted food: from stage 2, cook broth at full Guts or tonic with no iron, 60% chance; it begs in another lane for 7 s, walk to it.

**Upgrades.** Thick Apron (+1 Guts per stage per level), Grist's Temper (meter fills 25% faster per level), Big Pot (every level: broth +1, pepper 4% quicker, tonic 0.5% more). Output of `HD.mealNumbers`: level 0 broth 2, pepper 0.72, tonic 0.060; level 1 3, 0.68, 0.065; level 2 4, 0.64, 0.070; level 3 5, 0.60, 0.075. One Iron is 0.08 at every level. Guts 5 to 8, meter fill x1 to x1.75.

**Sound.** Effects for every action, 11 defined in `game.js` (stomp, clunk, ironOn, charge, pot, snore, chain, roar, slash, whiff, crate), the rest the kit's. Two original loops: a stomping hornpipe in D dorian, and slow iron steps in E phrygian for the bear.

## What was checked, with the real results (2026-11-06, after the third review's fixes)
`node tools/smoke.js hold-the-deck --seeds 5`: **PASSED**, 165 checks ok, at phone 390x844, computer 1440x900, small phone 320x568. No kit file changed in these fixes; `node tools/smoke.js storm-run --seeds 1` **PASSED** anyway. Test bot on 60 more seeds, no upgrades: stages 1 to 5 all 60/60.

**Fairness**: `node games/hold-the-deck/test/fairness.js --seeds 16`: **PASSED**, 53 checks ok. The review showed the old "person-like" bot flattered the numbers: it delayed only warnings, and read boarders live. Sections C to I now use `test/thumb.js`, which is the review's real-time thumb moved into a test run. Before any fix it gave stage 4 1/8 wins, 1 to 5 tries, and hurts on the bear almost all from the door, the same picture the review got by hand.

A. The warning sums, from every warning fired in whole-stage play at no iron and full iron. "Spare" is the warning minus the walk to a dark lane (or for a volley, the hold), which is what's left for a person's reaction:
```
volley: warned 1.50 s or more, smallest time to spare 1.16 s
hook:   warned 1.30 s or more, smallest time to spare 0.86 s
drop:   warned 1.35 s or more, smallest time to spare 0.91 s
paw:    warned 0.95 s or more, smallest time to spare 0.78 s
swipe:  warned 0.95 s or more, smallest time to spare 0.78 s
charge: warned 0.95 s or more, smallest time to spare 0.78 s
```
The bear's warnings came down from 1.15, 1.05 and 1.35 s. 0.85 s failed section B for a slow thumb holding for Iron (17 paw hits at reaction 0.55 s), so they went back up to 0.95.

B. Dodging only, boarders ignored, at reaction 0.25, 0.4 and 0.55 s: walking at iron 0, 0.5 and 1; holding for Iron at iron 0 and 0.5. **0 hits from warnings in all 15 settings.**

C. First tries on 5 Guts, a thumb that sees everything 0.3 to 0.4 s late, taps about 3 times a second, picks a wrong lane 6% of the time, misses 1 warning in 20 and holds for every volley, 16 seeds:
```
iron 0:   16/16, 16/16, 15/16, 15/16,  9/16
iron 0.5: 16/16, 15/16, 16/16, 12/16,  6/16
iron 1:   16/16,  9/16,  5/16,  3/16,  4/16    (no Iron stance at all)
```

D. A new player's thumb (sees everything 0.55 s late, under 3 taps a second, wrong lane 10%, misses 1 in 20), from no iron: 16/16, 15/16, 16/16, 13/16, 0/16 on 5 Guts. It needs the extra Guts for the bear: section I.

E. The meals on the boss from half iron at 8 Guts: broth 11/16, about 132 s, iron at the end 0.88. Pepper 9/16, about 135 s, 0.93. Tonic 9/16, about 128 s, 0.84. Which feels right is Dylan's call.

F. Never holding, same thumb: stages 2, 3, 4 and the boss all 0/16 on 5 Guts. A try that never held earns no extra Guts, so dying doesn't get round it. If it did have 8 Guts, a no-miss thumb that never holds would win stage 2 15/16, stage 3 0/16, stage 4 9/16, boss 0/16.

G. The grey, boss, 32 seeds per level, my own script (`fix2\bossgrid.js` under `%TEMP%\kcheck\hold-the-deck`, not in the repo), first tries on 5 Guts:
```
iron            0    0.3   0.5   0.6   0.7   0.8   0.9   1
never misses   30    28    16    14    17    16    17    12
misses 1 in 20 12    12     8     9     8    11    11     2
```
So it gets harder with grey, then flat, and at full iron harder again, with no point where more grey is easier. (Until a late fix there was a dip: half grey won 13/48 and 0.8 won 33/48, because coming off Iron straight into a charge was the worst place to be. `afterVolley` fixed that.) The fairness run's own section G on 16 seeds: 0.5 13/16, 0.59 7/16, 0.6 3/16, 0.7 8/16, so these numbers are noisy.

H. A blind sweep (left, middle, right, middle, 3 taps a second, 16 seeds): stage 1 6/16 with 1 to 3 Guts left, stages 2 to 5 0/16.

I. Whole stories, stage after stage with iron carried, retrying with the extra Guts. Tries per stage:
- Holds for every volley, misses 1 warning in 20: 1,1,1,1,1 / 1,1,1,2,5 / 1,1,1,1,1 / 1,1,1,1,4 / 1,1,1,1,3 / 1,1,1,1,4 / 1,1,2,1,1 / 1,1,1,1,1. Iron 0.72 to 0.87 going into the bear, 0.88 to 1 after it.
- The review's rule, holds only at 3 Guts or fewer, never misses a warning: stage 4 1 to 6 tries, boss 1 to 3; iron 0.24 to 0.39 going in. **So for this thumb stage 4 is still the harder one.** It's taking volleys on the chin to stay clean, and that's now what it costs. It's a real choice, not a bug, but it's the case to look at if Dylan's thumb finds stage 4 a wall.
- New player's thumb: stage 4 1 to 8 tries, boss 1 to 7, and 2 runs of 8 hit the test's limit of 14 tries on the bear at full iron. A slow thumb that holds for everything can still get stuck there. Its way out is the tonic and Grist's Temper; the test thumb never takes either.

The review's busy measure (share of moments with a boarder past the gold line or a lit lane under Bram), and how often a kill comes, thumb holding for every volley:
```
         stage 1       stage 2       stage 3       stage 4       boss
busy     16%           28%           30%           30%           23%
a kill   every 2.2 s   every 1.9 s   every 2.5 s   every 2.3 s   every 7.9 s
```
The review measured 15%, 21 to 22%, 22%, 36%, 45% with its own thumb and polling, so the two last columns aren't like for like. Stages 1 and 2 are a little fuller, and stage 2 now goes quicker than stage 1. Whether that's calm or dull is still Dylan's thumb.

One real-time run of the review's own script, normal speed, real mouse, real talk, meal and result screens (it holds only at 3 Guts or fewer): stage 1 1 try, stage 2 1, stage 3 1, stage 4 **5** (iron 0.32 to 0.40), then its time ran out at the bear. The review got 1, 2, 1, 5. Three of those stage 4 losses never held once and were down in about 45 s, so no extra Guts: that thumb's rule is what the volleys now punish, and a person told "the Iron was right there" may not keep it up, but that's a guess. A separate real-time run of the bear from no iron: won first try in 134.7 s, 6 Iron uses, iron 0.55, `hurtBy {"door":4}`, the ending card showed. One sample, and that thumb never misses a warning.

My own checks through the real page with a real mouse (`%TEMP%\kcheck\hold-the-deck\fix2\rules.js`, `rules2.js`, not in the repo):
- Three holds in a row with nothing in reach, 450 ms in: whiffRun 0, stagger 0, iron 0.08, 0.16, 0.24. A press on another lane held: walks there, Iron, whiffRun 0. A quick tap at nothing: no whiff while the thumb's down, whiffRun 1 after the lift. A miss 2.9 s later: streak back to 1. Thumb down as a meal comes up: no swing left behind. Space held: Iron, no whiff. ArrowDown at nothing: whiffs at once.
- Taps with the meter empty, from the middle lane: (60,600) lane 0, (180,600) lane 1, (250,600) lane 2, (310,600) lane 2, (310,520) lane 2, (310,540) lane 2. With the meter full, (310,600): Grist goes, target stays 1.
- Charge on a paw in his lane: paw 16 to 12. Pressed in rear, run, fallen, snap, burst, dive, toMeal2: refused, meter stays 1. Meter when phase 2 starts, spent to 0 beforehand: 1, can charge.
- The list, with saved iron 0.84: boss from the list 0.84. Stage 1 from the list: 0. Cleared it, saved `{iron:0,through:0}`. Boss from the list after that: **0.84**. Stage 3 from the list: 0.3 (the grey remembered for stage 2). Stage 2 as practice at 0.84 with iron pulled back 0.12 in play: saved 0.84 again, place in the run kept.
- Mercy on real screens: gutsMax 5, 5 after two tries that took volleys and never held (Ione's line on each DOWN screen), then 6, 7, 8, 8.
- Rivetling, stage 3: at 1.65 s `{"say":"Bram Something small and iron's shuffling up to me. Easy, lad. I'll stay Iron.","pal":"rivetling","q":[]}`. After the catch: nothing waiting. Let go early: box clear, nothing waiting.
- Spoonling after a wasted tonic: `{"say":"Juno Bram, your stew's got a fan...","pal":"spoonling","q":[]}`, no "swallow". Silas's "third husband" line sent while it begs: dropped.
- Full iron, stage 2: hint reads "...There's no Iron left: you take it...", Bram's "No more Iron" goes up at the start, the volley line is "All three lanes, and no Iron left. Brace...". The boss and stage 4 hints have no Iron in them.
- Crates: 77 landings in 12 bot runs, d 0.68 to 0.78, none short of the gold line. A real tap on a crate at d 0.68: gone, +2 salvage, no whiff.
- In-play lines: longest 74 characters, none over.
- 1440x900 talk box: 19 px text, box 12 to 94 px, the deck starts at 129. 320x568 upgrades: all three rows' pips on their own line, no scrolling (568 of 568).
- A talk scene at 320x568 and 375x553: Bram left out. At 360x640 and 390x664: head and shoulders show above the box, reading as a framed shot. At 390x844 as before.

Screenshots looked at (`%TEMP%\kcheck\hold-the-deck\fix2\`): hold with no whiff, Rivetling and Spoonling lines, full-iron volley, HUD at 390 and 320, WAIT button, bear warning, crates on the gold line, trooper portrait, title with Grist close up, talk at 5 sizes, upgrades at 320, talk box at 1440.

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
| `trooper_run_front` | `-v1` | Sheet's coat comes out as a short jacket here. The list allows it; the locked sheet doesn't. Needs redoing |
| `trooper_shield` | `-v1` | Frame 4 (strike) moves the plate to one side |
| `ram_front` | `ram-front-v2` (v1's spikes hung off the lower edge; its strain frame was too big) | The three spikes read as round studs head on. Strain frame still a bit wider and sits slightly higher |
| `crate` | `crate-v1` | Square, so narrower than the code crate |
| `grist_charge` | `grist-charge-v1` | The lifted foot is a rounded ball. Sheet's back view shows four legs, plus the middle pair underneath |
| `grist_sleep`, `grist_awake` | `-v1` | Sleep's horn is a forward spike, not the sheet's anvil, so it isn't drawn any more: he sleeps as the awake picture with his eye painted shut in code, so he stands while asleep till the picture's redone. Awake's legs are longer than the sheet's |
| `bear_front` | `bear-front-v1` | Tool gave 1536x1024, not the 2304x1536 asked for, so a little soft at its biggest on a sharp phone. Fur leans warm grey-brown, as on the sheet. The raised-arm frames 1 and 2 show a calm face and a soft palm, which reads as a wave, so with the picture on the claw warning uses the roar frame till they're redone |
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
- **Whether the bear takes a few tries.** Measured above with a script, and it depends heavily on how many warnings a thumb misses: 1 in 20 misses is my guess at a person, not a measurement. If it's too hard or easy, in `tuning-boss.js`: `coreP2`, `coreP3`, `rakeAllEvery`, `swipeWarn`, `trickle2`, `openSecs`, `openGrey`, and `volleyHurt` in `tuning.js`. Stage 1 hasn't been tuned against a real first-timer's whiffs either.
- **Whether stages 1 and 2 feel calm or dull.** They're a little fuller. A thumb has to say.
- **A tap at nothing.** It now swings as the thumb lifts, so a quick tap on an empty lane feels a moment later than one with a boarder in reach. A real thumb has to say if that's noticed.
- **The WHIFF stumble.** Whether a real miss feels fair or sticky: `whiffStagger`, `whiffRunAdd`.
- **Whether the warnings read in the middle of a fight.** Lit lane, plate, band, alarm. Proved long enough; not proved noticed.
- **The music and effects.** Checked that they play without error, not that they sound good.
- **Motion.** The swing, the stiff walk, boarders walking at the camera, Grist's gallop, the bear's slide. Stills only, so far. Bram's swing is a sideways sweep because a chop forward can't be read from behind; a person may want it heavier.
- **The bear's look in motion, and the fur.** Drawn from the sheet's front view. I'd call the code bear bold and on-model in stills; Dylan's eye decides.
- **A real phone.** Only Chrome pretending to be one has run this. Weakest-device speed is unmeasured on a real device.

## Provisional numbers to confirm
All in `tuning.js` and `tuning-boss.js`, marked PROVISIONAL. Most likely to change: `holdSecs`, `stepSecs`, `swingCd`, `whiffStagger`, `whiffForget`, `ironPerUse`, `ironStepSlow`, `ironSwingSlow`, `ironHeavy`, `volleyHurt`, `stages[].waves[].volleysAt`, `mercyMax`, `reachD`, `wallD`, `tonicIron`, `pepperMul`, `brothGuts`, `foes.*.speed`, `stages[].speed`, `stages[].waves`, `temperPerKill`, `endless.*`, and from `boss`: `pawWarn`, `swipeWarn`, `chargeWarn`, `afterVolley`, `trickle2`, `coreP2`, `coreP3`, `openSecs`, `openGrey`, `openDodged`, `rakeAllEvery`, `quakeEvery`, `gristPaw`. Every number the rules play by is in those two files, the hits and in-play line times included; numbers that only change a look stay beside the drawing. Not provisional: Bram's 198 cm (CAST.md), the trooper's 180 cm (sheet).

## Calls Claude made (change any)
- The whole story: the crew ashore for timber, Sever after Grist, Hekka offering a deal, flour, the bowl on the deck at the end. Stage names: The Slipway, Hook Lines, Crane Hour, The Ram, What the Bear Was. Every line.
- The view: from the galley door up the deck, with Bram seen from behind, so the grey shows on his back and arm. So all the pictures it wants are front and rear views, not side-on (`art/REQUEST.md`).
- Tap acts at once, on the press, if there's something in reach. With nothing in reach, it swings on the lift, so a hold is never a miss. A tap on another lane walks there and swings on arrival, whatever's there, unless a lane's lit and nothing's in reach. A swing at nothing costs him his footing, and the streak forgets after 2.5 s.
- He holds a lane: a boarder stops to fight him and squares up for 0.45 s before his blade lands. One in a lane Bram isn't in walks on to the door.
- Guts: one number for hits on him and boarders through the door, 5 per stage, full again at each stage. Only iron carries.
- Grist goes up the lane Bram is in, from a button in the corner, since a one-thumb swipe would be hard to find. Spec says "charges down a lane"; he charges *up* it, away from the galley, which is where the boarders are.
- The button is smaller (72 x 76, was 86 x 88) and only takes the press when his meter's full. Before that a low tap on the right is the right lane, like the other two sides. So pressing it just before it fills walks Bram to the right lane. When it's full, a thumb aiming low for the right lane still sends Grist: read, not run in a real hand.
- On the bear: the charge does 4 to a paw in his lane; the button says WAIT and keeps the meter when it couldn't land; the meter is full when the bear first stands up.
- The talk box in play sits at the top (`sayAt: 'top'`), above the far end of the deck. Warnings are on the lanes below it. Lines take turns instead of cutting each other off; in-play lines are kept to 74 characters.
- **Volleys** (all three lanes at once, Iron or 3 Guts) are mine, to make the bond cost unskippable. So is the rule that a thumb that never holds loses from stage 2 on, and hurts of 1 Guts at full iron. The spec's "Hold to turn to Iron" doesn't ask for any of it. A new player who never works out the hold will stick on stage 2; the plate and Ione both say to hold.
- **The grey follows the run, not the list.** Skipping ahead from the stage list takes on the grey of the run that last came this way, and going back over a passed stage can't lower it. A new run from stage 1 starts clean and earns its own numbers by walking the stages. The kit's rule stands; it's kept in `story.js`, using the save's settings. Still open by kit rule: dying or Restart gives back that stage's grey.
- **The extra Guts have a condition:** a try that took a volley on the chin and never held once earns none, and Ione says why.
- **Endless changes the spec's meal rule.** Spec: "Between waves, cook one meal." Endless serves one after every second wave (`endless.mealEvery`), so a bowl can't heal everything the flat pressure takes. Story stages keep the rule as written.
- **One more Guts per lost try on a stage, up to 3**, with Ione's line. Mine, so grey is never a wall. It isn't saved, so a reload forgets it. It does let a fair run's clear bonus grow slightly, since Guts left pay score.
- The bear stands further down the deck (`standD` 0.42, was 0.30) so its head clears the talk box on phones with no spare height. Its numbers are harder: paws and rakes hurt more, warnings shorter. Boarders fewer. For a thumb that misses some warnings its hits now come from the bear about as much as from the door; for one that never misses, the door still does most of it.
- At the claw warning the bear roars instead of raising its paw, because the picture's raised-paw frames read as a wave. Plates and lit lanes say which lanes.
- Bram is left out of a talk scene on screens under 640 px high, where the box left only the top of his head showing.
- Nothing attacks while a hint's plate is up (4.2 s), so a stage starts with 4 quiet seconds, and retries do too. That's how the plate stopped hiding things.
- Grist is drawn nearly Bram's height on the title, for "the size of a truck", and neither is drawn if the menu leaves under 64 px, as at 320x460.
- Hekka on the rail moved left of the pause button.
- Lines changed in the third review: Rivetling's arrival is Bram's now, "Let me see" gone. Ione's mercy and stabbed lines are said from the radio, since the crew's ashore till the bear. Her half-grey line is by the sound of him. New: her no-hold line, her full-iron volley line, hints with no Iron in them at full iron.
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
Nothing was forked, and the third review's fixes changed no kit file. **One earlier change in `shared/kit` needs accepting or undoing by Dylan or whoever owns the kit:** Hekka got a code portrait in `speakers.js` (`hekkaFace`, front-facing, grey plate, black bar, white ring, per hekka-sheet-v6), set the same way as Silt's, because the plain bust turned her away with a grey blob on her chest. `shared/kit/README.md` says a game shouldn't change the kit. It's additive: every other speaker is untouched, Tide Gap's Hekka gets it too, and README section 6 says so. I didn't undo it, since Tide Gap would lose it.

Things the kit could take over:
- `fit.js`: the top talk box growing on big screens, as the corner box does, and upgrade pips lining up at 320 px. Both are kit CSS, set here for this game only so no other game's layout moved. Other upright games may want them.
- `portraits.js`: `Kit.speakers.add` overrides the trooper's bust for this game only. Other games still show the side-on bust.
- `run.stage.talk` is read after `init`, so changing it there is how the talk scene follows the iron. Works; not documented.
- `HD.rememberEnding` writes `Kit.def.ending` for the same reason, and uses `DriftSave.setSetting('hd_ending_band')`. `hd_grey_at` sits beside it.
- A game can't lock stages in the kit's list, which is why `story.js` does what it does in `init`.

## Pictures this game still wants (none made in the review fixes)
- `grist-sleep`: the horn should be the sheet's flat, two-tipped anvil, upright. The player sees this one most. He's drawn from the awake picture with a code eyelid till then, so he stands while asleep.
- `trooper-run-front`: closed knee-length coat, per trooper-sheet-v1; it has a waist-length jacket.
- `bear-front` frames 1 and 2 (the raised paw): an angry face, claws out, no soft palm pad. Not `bear-paw.webp`: that's the paw through the deck, and it wasn't what the review's crop showed. Roar stands in.
- Sever trooper talk portrait, painted or cut from the sheet. A code portrait from the sheet stands in (`portraits.js`).
- Hekka's talk portrait, painted or cut from `hekka-sheet-v6.png` as Silt's was. The code portrait stands in.

## Noticed, not touched
- A swing lands in the lane Bram's headed for, not the one he started it in, so a second tap inside its 0.07 s wind-up moves the hit (`landSwing`, `w.target`).
- Salvage per clear, my thumb, wins only: stage 1 16 to 22, stage 2 16 to 23, stage 3 33 to 44, stage 4 18 to 34, boss 28 to 34. So stage 3 is a touch over the kit's 40 at the top, from crates bursting in volleys.
- At 320 px wide, a full-width talk box comes up to 6 CSS px over the pause button's left edge (`.kit-say` and `.kit-pause`, in `kit.css`). The button still works. All upright games will share this.
- The smoke test's wrong-way-phone shot failed the title screen by 19 px on my first, longer tagline. A portrait game's title has about 3 lines of tagline to spend when held the wrong way. Other upright games may hit it.
- In test runs, every retry of a stage uses the same seed (`Kit.seed * 1000 + index`, `makeRun` in `shared/kit/game.js`), so a bot that loses once in a story walk loses the same way until the test times out. It caught me once while tuning.
- `shared/games.js` has this game's `live: false`, which I left.
