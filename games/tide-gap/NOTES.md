# Tide Gap: notes

Status: built, not yet seen running by Dylan. Pictures on for all 12 keys in `art/REQUEST.md` (built, not yet seen by Dylan); the code art stays as the fallback. `live` not set.

## New pictures: Hekka at the sheet's proportions, Sela's bigger book (2026-11-06)
Built, not yet seen by Dylan. Replaces "Hekka's picture is left stocky" under the fourth review. Old files all kept; old numbers in a comment in `art/sprites.js`.
| Key | File in use | Raw take it's cut from |
|---|---|---|
| `hekka_stand` | `art/hekka-stand-v3.webp` | `raw/hekka-stand-v7.png` |
| `hekka_throw` | `art/hekka-throw-v3.webp` | `raw/hekka-throw-v8.png` |
| `hekka_hurt` | `art/hekka-hurt-v2.webp` | `raw/hekka-hurt-v4.png` |
| `sela_empty` | `art/sela-empty-v3.webp` | `raw/sela-empty-v3.png` |

The webp numbers are the ones asked for; raw numbers carry on from what was already in `raw/`. Seven new generated pictures: stand v4, throw v5, hurt v2, sela-empty v3, then one scar edit each (stand v5, throw v6, hurt v3). The edits turned Hekka's stand eyes brown and the scar too red, so the takes in use are the first takes with only the scar copied in and dulled by hand (`art/prompts/scar-merge-2026-11-06.txt`). Stand v6 and throw v7 are a first hand try that also touched her face lines; kept, not used.

Checked in headless Chrome at 390x844: all four keys decode, no page errors, no missing files; looked at each pose zoomed in on the cutter and Sela steady against empty on stage 1. `node tools/smoke.js tide-gap` passed.

Flaws left in: the blade reads as bright white steel, not glowing, the same as Hold the Deck's `hekka-front`. `hekka_hurt` has a graze on the cheek, sweat drops and a small mark at the collar that nobody asked for (the model's). Her ring is washed out in `hekka_hurt` while the hit flash is up. The book sits on the deck's wood, so it reads by its outline and cream pages more than by colour. Her raised lance crosses the corner of the right-hand plate in `hekka_throw`.

**Calls Claude made here (change any):** Hekka stands at 27 px from the cutter's middle, not 31, picture only, because the new wider boots hung over the hull's edge by about 3 to 4 px in throw and hurt (`cutter.js`; the code figure stays at 31). `hekka_hurt` is drawn about 47 px rather than 51, so her armour stays the same size as when standing. Book colour lighter than asked, tan with cream page edge, so it reads apart from her boots. Still a thumb's call: whether the pose change reads during play.

Play-check: reach the boss and watch Hekka stand, throw and get hit; then drown every line of the logbook and look for the book in Sela's right hand.

## How it's laid out
| File | What's in it |
|---|---|
| `index.html` | The kit's page, as it comes, with this game's scripts at the end |
| `tuning.js`, `tuning-stages.js` | Every number, each marked PROVISIONAL or with its source. The second file has the boss, the stages, endless and the bots' numbers |
| `words.js` | Talk scenes, radio, lose lines, pal lines, boss lines, upgrade blurbs, hints |
| `memory.js` | The logbook: the six memories and what the crew say when each goes, the found pages, what a Dive costs |
| `ending.js` | The ending, written from what's left in the book |
| `game.js` | `Kit.start(...)`: joins words, numbers and rules, own sound effects, music. Read this first |
| `course.js` | Rock shapes and hit edges, the five kinds of gate, laying the course. Runs under plain node too |
| `talk.js` | Talk in play: calls that play at once, remarks that go stale, scenes that are never dropped |
| `sail.js`, `steer.js` | One step: knocks, planks that last, shut teeth, gates passed, stage end. Steering is in the second file |
| `dive.js` | The Dive: the pull, the hold, the air, and what happens when the kit forgets the thumb |
| `hazards.js` | Salvage, drowned caches, pages, rip currents, boulders, lances, the fairness rule for where a danger may land, pals |
| `boss.js` | Hekka's cutter: a state machine, logic only |
| `bot.js`, `botfair.js` | The test bot (reads the course's sums) and the no-foresight player (sees late, sees only what's on screen) |
| `sea.js`, `cliffs.js`, `rockart.js`, `arrows.js`, `vesh.js`, `ship.js`, `cutter.js`, `dangers-art.js`, `hud.js`, `hud-book.js`, `draw.js` | All the drawing. Nothing in a run changes in these |
| `test/passable.js` | Proves every gap can be sailed with no Dive, and that a Dive with no upgrade gets under every rock. Plain node |
| `test/fairness.js` | Proves the warnings give real time, and measures what a lost line costs. Headless Chrome |
| `test/moments.js` | Real drag, real hold, keys, what carries, upgrades, empty book, ending, pals. Headless Chrome |
| `test/pull.js` | Can a steering sweep spend a memory, and does a real pull still Dive. Plain node |
| `test/talk.js` | Does talk arrive when it applies, and does every memory scene play. Headless Chrome |
| `test/prices.js` | Copies at the boss, gold on a wreck, Mopclaw's line, lose lines on a blank book, the strip against Pause, gentle pulls by real touch. Headless Chrome |
| `art/sprites.js`, `art/REQUEST.md`, `art/raw/`, `art/prompts/` | The pictures in use with their measured numbers, what was asked for and which take won, every take, every prompt |

## What a player does
Every second you're dragging: Vesh's head goes where you steer, the hull swings after it a moment later, so you steer ahead of yourself. You're reading gold arrows on rocks that haven't moved yet and lining up for a gap that isn't there yet, with cogs along the good line and pages off to one side.

- **The Dive:** pull the thumb DOWN and keep it on (30 logical px inside 0.6 s, at least twice as much down as the thumb has swung across, from a thumb that hasn't been travelling sideways for the last 0.14 s), with a thin ring and a soft sound on the way down, then a ring and DIVE on the hull for 0.1 s. Steering only uses sideways, so a resting, jittering or pausing thumb can never spend a memory, a steering sweep on the thumb's natural arc doesn't either, and it works from a thumb already on the glass. Air lasts 2.6 s. Let go to rise. Come up under a rock and it's a knock; "STEER OUT!" shows while there's time to do something about it. On stage 1 it opens when Ione explains it, about a third of the way in, and the how-to follows her line.
- **Shut teeth:** two rocks meet with no surface way through, marked SHUT, called by the crew first time on each stage. Dive under it for a line (and the 15 salvage hidden in the crack), or scrape through for a plank. Stages 1, 2 and 3 have one, stage 4 two. A blank book isn't asked: stage 3's tooth and stage 4's last only come if something can pay for a Dive.
- **Planks last:** what a stage knocks off the hull stays off for the rest of the story run, so a scrape costs something you'll miss. Bram keeps her on at least 2 planks at the start of a stage, and puts everything back for the boss. A story run with no Tougher Hull can scrape 4 teeth at most, each stage after the first on thinner margin, and it can't reach the boss without a Dive on stage 4.
- **The bond cost:** the logbook at the top of the screen, six real lines in her hand. Each Dive drowns one: the words slide down the page and run, a blue smear stays, and a moment later the crew find out. Bram asks about the soup. Silas starts on the coat and thinks better of it. When the line about Kaito goes, she calls him Kaito from then on, in talk scenes and radio, and he notices.
- **Every lost line weakens the arrows:** how far ahead they show goes 480, 400, 320, 225, 165, 120, then nothing (px from the bow, 6 lines down to 0). With 5 or 6 lines you also get a dashed gold edge showing exactly where the rock will stop. Under 3 lines the arrows thin to one chevron and start to flicker. Each lost line also makes her miss more gates altogether, with no arrow at all: none at 6 lines, 1 in 10 at 5, 2 at 4, 35% at 3, half at 2, 70% at 1. At zero they're gone, Dives stop, and pressing gets "I've nothing left to give him." In the boss each lost line takes 0.04 s off the red lanes' warning, and the chain arrows come later (below).
- **Sela on the deck follows the book:** spyglass up with 4 to 6 lines, reading with her head bent at 1 to 3, the closed book hanging from her hand at 0, arms up in a Dive.
- **Pages** off the safe line fill a smear with a line she'd forgotten writing. What drowned stays drowned, and it stays in `run.carry`, so it lasts through Next stage, Menu and reload. Dying puts back what the stage began with, except the line that caught Mopclaw, and it leaves any cache gold from that attempt on the bottom. Pause then Restart doesn't: what's drowned stays drowned, and its gold comes along.

**What changes stage to stage:**
1. *The Narrows:* wide, slow, gaps that slide and close, one island drifting across. Dive explained partway.
2. *The Grinders:* two gaps, one shuts. The middle rock slides until it grinds against a wall, with sparks. Boulders fall where a shadow grows on your hull.
3. *The Blind Shelf:* fog. Rocks start moving almost as they come into view, and gold shows through. Vesh's lamps light the murk.
4. *The Slip:* rain, rip currents you steer against, and red lanes as Hekka fires blind from behind the rain, quoting your old logs.
5. *The Last Tooth:* the cutter. Lances down red lanes (the cable stays taut for 1.1 s and is a wall), pylon chains with one way through (gold arrows show which way it will lie before it drops: 1 s ahead with a full book, 0.5 s at 3 lines, nothing when blank), a new attack mix each round, then the keel plates glow. Pull down and hold to Dive, Vesh hauls you under the hull, steer under a plate, let go to burst up. Three plates, and each costs its line for good; a page only falls when the book has nothing left to pay the next Dive with. On the last, Vesh comes up over the whole hull: "Vesh. Bite her boat."

**The ending** is written from what's left. Keep the Kaito line and she says "First thing I'd save from a fire, pup." Lose it and he has to tell her what she calls him. Lose the last line too and she still knows his name, and asks what Vesh keeps looking back at her for. The crew who can tell her what she lost do, and the ending card quotes the new line she writes that night. The boss takes three Dives and her own lines drown before any found page. The best no-upgrade run spends 4 lines in all, 1 before the boss and 3 in it, so it keeps the Kaito line and the song, and only by sailing stages 2, 3 and 4 down to the last plank.

**Pals:** Bobbin comes to a clean helm: from stage 2, after 18 s with no knock and no Dive, a 25% chance once per attempt; it bobs alongside for 7 s and you stay within 52 px for 1.1 s. Mopclaw hides under a rock with a mop tuft showing: from stage 3, a 40% chance once per attempt, and only a Dive reaches it, so catching it costs a line.

**Upgrades:** Tougher Hull (one more plank, each level, and planks last, so it's worth more than it was), Longer Dive (0.4 s more air, each level: a wider start, not the only way under), Spare Logbook (each level, the sea burns one copy per story run before a real line; a burned copy stays burned across stages; no copy pays at the boss).

## Fourth review: what a Dive costs, the pull, the ramp (2026-11-06)
Built, not yet seen running by Dylan. Scripts and headless Chrome only; no person has played it. Output: `%TEMP%\kcheck\final\tg-fix\` (`base-*.txt` before, `after-*.txt` after), shots in `shots\`. The review's own human-like player for this game wasn't kept, so `tg-fix\human.js` is my rebuild of it: `botfair.js`, plus thumb wobble and attention lapses. Its numbers are close in shape, not equal.

**Spare Logbook.** No copy pays at the boss. The review's script (Hull 3, Spare 3, scrape every tooth), before: every finished run `lines 6 lost[] copies 3`. After: `wwwww tries 11111 lines 3 lost[coat,cards,soup] copies 0`. Runs that still show 6 are `wwwl`: that script never Dives, so it can stick on stage 4, before and after. Ione says so once as the cutter arrives, if you have copies left. Copies still pay on stages 1 to 4 and in endless. Cost left alone: 145 + 145 salvage.

**Wrecking to keep the prize.** Cache gold now waits for the stage clear. The salvage count shows it at once, but dying leaves it behind and gives the line back. Restart and Quit don't give the line back, so its gold comes along, paid into the next attempt. The line that catches Mopclaw stays gone after a wreck. Real screens, `test/prices.js`: Dive 5 held, wreck banks only the 4 from cogs, try again 6 lines and no gold; catch, wreck, try again: 5 lines, pal kept.

**The pull.** `pullWindow` 0.25 to 0.6. A thin ring and a soft sound show a pull on its way. 'Across' is now how wide the thumb swung over the stretch, not just where it ended, so a longer window doesn't let a dodge through. `test/pull.js`: long sweeps 0 of 90,450 fire (same), short sweeps 27 of 37,872 (was 54), pulls from rest 112 of 112, the review's nine gentle pulls 9 of 9 (from 40 px in 0.3 s down they did nothing), dodging while sliding at up to 60 px/s 0 of 60, sliding at 90 px/s 2 of 20 (noted, that's nearly a pull). Real CDP touch, 48 CSS px in 482 ms: Dived 8 of 8 (the review: 0 of 8). Held still 2.5 s: up, 6 lines, no ring. Slower than about 50 CSS px/s still doesn't fire, but the ring shows. **A plain hold still never Dives**: see the calls.

**The ramp: only partly fixed.** `boss.warn` 1.35, 1.2, 1.1 to 1.3, 1.14, 1.06 and `boss.gap` 1.55, 1.3, 1.1 to 1.5, 1.24, 1.06. That's the most `test/fairness.js` lets through: 1.3, 1.12, 1 made a 0.5 s player never win on 2 lines. It's a small move, close to script noise. Tries over 8 story runs, stages 1 to 5, my rebuilt player, no upgrades, before and after these two numbers. Two runs of the same code can differ this much: at 0.30 s, stage 4 gave 13 and 19.
```
         before            after
0.30 s   8,8,8,19,8        8,8,8,18,9
0.35 s   8,8,8,13,11       8,8,9,17,12
0.40 s   8,8,9,13,14       8,8,9,22,21
0.45 s   8,8,8,14,13       8,8,9,22,15
0.50 s   8,8,12,19,24      8,8,10,23,15
```
**At 0.30 s the boss still falls first try, and it's still easier than stage 4.** I could not fix that with numbers. Everything that made a 0.30 s script lose walled a 0.5 s one. Boss wins of 16 by lines coming in: `pylonSpeed` 175 gives 0.30 s 16, 12, 10, 5, 7 for 6, 4, 3, 1, 0 lines, but 0.50 s 3, 1, 0, 0, 0. Longer volleys gave 0.50 s about 10 boss tries a run and left 0.30 s at 1. A script with a fixed delay is a cliff, and it never lets go under the wrong spot, never misreads, never panics. Stage 3's dip is left as it is: tighter numbers barely moved it (20, 20, 19 wins of 20), and the script hardly feels fog. Dylan's thumb decides; knobs: `boss.pylonSpeed`, `boss.warn`, `boss.gap`, `boss.warnPerLine`.

**Also:** the boss's strip stops short of Pause (320x568 edge 265.3, Pause 268; 375x667 319.9, Pause 323). Sela drawn 46 px (was 36) and Hekka 51 (was 40), `selaH`, `selaFeet`, `hekkaH`. A blank book has six lose lines with no repeat running (8 deaths: 5 different, 0 running). Scripts split with lines moved word for word, checked by comparing every line before and after: `tuning.js` 200, `hud.js` 147, `rockart.js` 198, `cutter.js` 178, `sail.js` about 184. `test/moments.js` stays at 293, test only.

**Calls Claude made here (change any):**
- Copies don't pay at the boss, and Ione's new line saying so. Other ways to do this: copies pay only one plate, or a copy costs more.
- Cache gold waits for the clear. The count on screen can drop on a wreck. The other way was keeping the line drowned when a cache was taken, but a tooth always hides a cache, so a stuck player's book would drain on retries.
- Quit from stage 1 forfeits held gold. Quit from a later stage pays it into the next attempt; closing the tab loses it, and the line stays gone.
- Salvage for a Dive still pays over the kit's 15 to 40 on stages 3 and 4 (the review saw 72 to 73). Not changed: it's the call below, and a wreck no longer pays it.
- **Plain hold stays off, against the spec's "Hold to Dive".** An earlier review showed a plain hold spending memories by accident. If Dylan wants it, the middle way is a long hold only while a Dive is being asked for (SHUT or plates open), at the risk of a thumb resting there.
- Five new lose lines, in the crew's voices.
- Sela and Hekka's new sizes. Sela's head now ends about at the bow. Hit edges don't change.
- Hekka's picture is left stocky until a new picture exists.

## Third review: bond cost, talk, arc (2026-11-06)
Built, not yet seen running by Dylan. All three findings were checked first by re-running the review's own scripts on the old code; each one held, with the same numbers. Everything here is scripts and headless Chrome. No person has played it. Full output: `%TEMP%\kcheck\tide-gap\fix3\` (before: `base-*.txt`, after: `after-*.txt`, `fair2.txt`).

**The steering sweep that fired a Dive.** The pull check looked only at the recent stretch of the path, and a thumb's arc really is steep low on the glass. Now the thumb must not have been travelling sideways in the 0.14 s before the pull, and the pull must be twice as much down as across (was 1.5). `test/pull.js`, a modelled thumb, no real one: 0 of 90,450 sweeps of 100 CSS px or more fire; 54 of 37,872 shorter ones (60 to 100 px) do; 112 of 112 pulls from rest fire, leaning up to 0.4 sideways; press-and-pull fires. Steer then pull with no stop still fires, 11 steps (0.18 s) into the pull rather than 4. The review's `g-arc.js`, real mouse in real time: 8 of 18 sweeps spent a line before, 0 of 18 now.

**Talk that came late.** `talk.js` splits it three ways. Calls about right now play at once over anything (plates open, plate hit, the fall, rips, scrapes, pals). Remarks wait their turn and go stale. Memory scenes are never dropped: they play between calls, a line cut off is played again, what the end of a stage cuts off opens the next stage, and the cutter takes up to 14 s to sink while a scene still owed plays out. Boxes now stay 2 to 4.2 s by length (was a flat 3.2), so a scene is about 7 s rather than 10.5. `test/talk.js 8`: open call and plate reaction within 0.1 s of the plate on every seed, no open call while shut, final line plays, every scene plays, through stage 4 into the boss too.

**The bond cost.** Four changes: planks last (above); each lost line makes her miss more gates; drifts start closer on stages 2 and 3, so eyes alone don't get a quick player through (`moveFrom` 150 to 125 and 125 to 112); and the boss now has arrows to lose (chain arrows, a wider red-lane range). Five teeth rather than seven, or no run could keep any original line.
Rock knocks a run by lines left, no teeth, hull not limiting (`test/fairness.js 20`: PASSED):
```
                 6     5     4     3     2     1     0 lines
0.35 s stage 2  0.90  0.30  0.25  0.45  0.60  0.75  0.65
0.35 s stage 3  0.00  0.20  0.20  0.40  0.70  1.15  1.30
0.35 s stage 4  0.00  0.20  0.80  1.05  1.00  1.70  2.15
0.5 s  stage 2  0.25  0.30  0.55  1.15  1.50  2.25  2.40
0.5 s  stage 3  0.00  0.25  0.60  1.00  1.70  3.75  4.20
0.5 s  stage 4  0.00  0.35  0.95  1.20  1.55  1.80  2.70
Stage 1 stays 0.00 at every count, on purpose (spec: easy first stage), and the only way to thin the book there is one tooth.
Empty book, clears out of 20, 0.35 s: stage 1 20, stage 2 15, stage 3 15, stage 4 8. At 0.5 s: 20, 12, 6, 7.
Boss by lines coming in, 0.5 s, 200 px/s, wins of 20: 6 lines 15, 4 lines 20, 2 lines 9, 1 line 18, 0 lines 9. It's noisy: a script with a fixed reaction lines up or doesn't with the volleys. Lower is harder on the whole, not line by line.
```
Whole story runs, 8 seeds, tries per stage, then lines and planks at the boss (bots here never fetch a page): keep lines, 0.5 s: `11212 5L 1p`, `12111 5L 1p`, `11111 4L 1p`. Dive every tooth, 0.5 s: `11113 2L 3p`, `11122 1L 1p`, `11111 3L 3p`. Before and after, the review's own measure at 0.5 s, 200 px/s, teeth in:
```
stage 3 before: 0.00 0.00 0.00 0.00 0.00 (5 to 2 lines all flat) then 1.87 at 1 line
stage 3 after:  0.00 0.37 0.67 0.87 1.43 2.40 (6 to 1 lines)
Ignoring every arrow with a full book, 0.35 s reaction, against using them:
stage 2 before 0.47 against 0.57, after 0.83 against 0.57. Stage 3 before 0.00 against 0.00, after 1.23 against 0.00. Stage 4 before 0.97 against 0.00, after 1.17 against 0.00.
```
A whole story run, the review's `d-bond.js`, 0.5 s, 200 px/s:
```
Keep every line: S1 winx1 k1 d0 L6 | S2 winx1 k1 d0 L6 | S3 winx1 k1 d0 L6 | S4 winx1 k1 d1 L5 | S5 winx1 k2 d3 L2 (lines end at 1 or 2; a few retries)
Dive every tooth: S1 winx1 d1 L5 | S2 winx1 d1 L5 | S3 winx1 d1 L4 | S4 winx1 d2 L2 | S5 winx3 d3 L0 (book blank at the end, 1 to 3 tries at the boss)
```
What that does and doesn't show. A bot that keeps every line reads its full arrows so well it almost never hits a rock, so it still takes no Dive on stages 1 to 3 and clears first try. The price it pays is sailing stages 2, 3 and 4 on its last plank after one scrape, where one rock ends the attempt. A bot can't feel that; a thumb will. The salvage gap is smaller but still there: about $50 against $35 on stage 3. That's kept as what a line buys.
At a 0.35 s reaction the boss hardly changes with the book (all win; the bot takes one lance hit at most lines). The cost there shows from about 0.5 s down.

Noticed while measuring: at six lines on stage 2 the script takes more rock knocks than at five (0.94 against 0.19 at 0.35 s). Traced in `dbg2.js`: it leans toward the next gate too early, seeing further than a person would. That's the script, not the game, so the fairness check for that stage measures from five.

## What was checked, with the real results (2026-11-06)
These figures are from before the third review; the shape of the tests is the same, the numbers aren't. All after the review fixes. These are script numbers and headless Chrome; no person and no real phone has run this.

`node tools/smoke.js tide-gap`: **PASSED**, 165 checks, at phone 390x844, computer 1440x900, small phone 320x568. Bot wins every stage on 3 seeds with no upgrades. Nobody playing loses: stage 1 in 21 s, stage 2 in 9 s, stage 3 in 7.4 s, stage 4 in 12.9 s, boss in 8.5 s. `node tools/smoke.js storm-run --seeds 1`: **PASSED** (the kit's two small additions).

`node games/tide-gap/test/passable.js 200`: **PASSED**, no way through 0 and stuck 0 on all five courses, and:
```
Dive, stage 1: gets under 100.0% of blocked columns, going straight, no upgrade; tightest start window 48 px; longest rock 167 px
Dive, stage 2: 100.0%; 88 px; 164 px
Dive, stage 3: 100.0%; 86 px; 200 px
Dive, stage 4: 100.0%; 114 px; 200 px
```
`node games/tide-gap/test/fairness.js 20`: **PASSED**.
```
1. What a line costs. Rock knocks a run, 0.5 s reaction, 200 px/s thumb, never Diving:
   stage 2: 6 lines 0.35, 5 lines 0.00, 4 lines 0.05, 3 lines 0.40, 2 lines 1.10, 1 lines 1.25, 0 lines 1.30
   stage 3: 6 lines 0.00, 5 lines 0.00, 4 lines 0.00, 3 lines 0.00, 2 lines 0.00, 1 lines 1.95, 0 lines 2.10
   stage 4: 6 lines 0.00, 5 lines 0.05, 4 lines 0.25, 3 lines 0.35, 2 lines 0.65, 1 lines 0.70, 0 lines 1.25
2. An empty book, 260 px/s thumb:
   reaction 0.25s: stage 1 20/20 | stage 2 18/20 | stage 3 20/20 | stage 4 18/20
   reaction 0.35s: stage 1 20/20 | stage 2 15/20 | stage 3 20/20 | stage 4 11/20
   reaction 0.5s: stage 1 20/20 | stage 2 8/20 | stage 3 5/20 | stage 4 7/20
   reaction 0.7s: stage 1 20/20 | stage 2 8/20 | stage 3 2/20 | stage 4 2/20
3. A full book, weighing up shut teeth:
   reaction 0.35s, 260 px/s: stage 1 20/20 | stage 2 20/20 | stage 3 20/20 | stage 4 20/20 | boss 20/20
   reaction 0.5s, 200 px/s: stage 1 20/20 | stage 2 20/20 | stage 3 20/20 | stage 4 20/20 | boss 20/20
   reaction 0.7s, 200 px/s: stage 1 20/20 | stage 2 20/20 | stage 3 20/20 | stage 4 20/20 | boss 0/20
4. What you do at a shut tooth, 0.5 s and 200 px/s, full book at the start of each stage:
   scrape: stage 1 20/20, 6.0 lines left | stage 2 20/20, 6.0 | stage 3 20/20, 6.0 | stage 4 0/20, 6.0
   dive  : stage 1 20/20, 5.0 lines left | stage 2 20/20, 5.4 | stage 3 20/20, 4.8 | stage 4 20/20, 3.4
   weigh : stage 1 20/20, 5.0 lines left | stage 2 20/20, 5.3 | stage 3 20/20, 4.8 | stage 4 20/20, 4.0
   The boss by lines coming in: 6 lines 20/20 | 4 lines 20/20 | 2 lines 0/20 | 1 line 19/20 | 0 lines 20/20
```
Two things in there I did not explain. The boss at 2 lines (0/20, while 1 and 0 lines are fine) looks like the script's timing lining up, not a fact about the game, but it could be a real wall for a slower player. And the 0.35 at six lines on stage 2 against 0.00 at five. Both need a thumb. The boss's warning cost is a cliff in the script: 0.02 per line is what's in, 0.03 made a 0.5 s player lose every run from 4 lines down.

`node games/tide-gap/test/moments.js`: **PASSED**, 51 checks, through real mouse and keys or the kit's real screens.

The review's own gestures, replayed with a real mouse in real time (throwaway script, `%TEMP%\kcheck\tide-gap\r2\prove.js`):
```
pause before dragging 200, 260, 300, 340, 400, 500, 900 ms: dive up, lines 6 every time
jitter about 4 CSS px for 1.5 s: dive up, lines 6
press, nudge 5 CSS px, rest 1.5 s: aim 184, dive up, lines 6
stage 1, thumb resting since 26%: unlocked at 0.28; 2.5 s on: dive up, lines 6
boss, press held still in a volley: lines 6, still 'volley', dive up
boss, dragged 30 px as a dodge, plates open, resting 1 s: dive up, lines 6. Pulled down: dive down, lines 5. Let go under a plate: boss stagger, knocks 0
stage 1 rock lengths 100, 130, 150, 167, 170, Dive begun 11 px off, thumb on till the air ran out: hull 3 each, stern 117, 86, 68, 50, 47 px past the far end
pause mid-Dive under a rock, thumb on, resume: dive up, hull 2, no knock
Pause then Restart on stage 2: lines 5 stays 5, salvage banked 0 to 9
real catch moment at 1 hull: dive down hull 1; tapped on: dive up, hull 1, no knock, not over
```
Talk boxes, every line that can play in the stage or the boss (50 and 45 lines), tallest box against the hull's bottom, CSS px: 320x460 clear by 20 and 4; 320x568 by 22 and 3; 360x560 by 21 and 1; 375x553 by 19 and 0; 390x664 by 42 and 19. The book's writing is 12.5 CSS px or more at all those sizes (the longest line and any row beside the pause button get squeezed a little to fit).

Draw time with the CPU slowed 6 times, 390x844 at 2x (`perf.js`), median / 95th / worst single frame in ms: stage 1 4.5 / 11.3 / 157; stage 3 4.2 / 13.6 / 98; stage 4 3.8 / 11.1 / 70; boss 4.0 / 8.5 / 509. Stage 2 wasn't in that script. The worst frames are most likely first draws to a hidden canvas, which is my reading, not measured. This is issuing the drawing, not the graphics chip.

Screenshots looked at, with the fixes in, at 390x844, 1440x900, 320x568, 320x460 and 375x553: title, talk, stages 1 to 4, fog, shut tooth with hint, boss with plates open, result. Still frames only. Close crops of a fall and of Vesh's neck. Looks are my judgement from stills.

Found and fixed earlier, so they don't get re-learned: a fan of two lances could box the hull in with a third landing inside (a new lance waits for old cables to be down 0.5 s, and lances and chains don't overlap); a lance could be fired in front of a gap on its far side (every gate in that time must leave room on the same side); the first fairness numbers were wrong because the no-foresight player had two bugs of its own.

## What a test can't tell, and needs Dylan's thumb
- **Whether pull-down-and-hold is right.** This is the likeliest thing to feel wrong, and it isn't quite the spec's "Hold to Dive". `pullPx`, `pullWindow`, `pullSlant`, `diveWindup` are the numbers. A thumb right at the bottom of the glass has less room to pull. A real thumb's habits are unmeasured: a steer with a downward flick that stays on the glass could still fire a Dive, though the slant and the short window are there to stop it.
- **Whether the choice at a shut tooth feels like a choice,** or just a toll. Whether sailing on your last plank feels like a price you chose. Whether a gate with no arrow reads as "she missed that one" or as a bug: nothing on screen says so except the DRIFT meter.
- Whether the chain arrows in the boss can be read at all while dodging, and whether the sinking wreck holds for up to 14 s while a scene plays. Seen in still frames only.
- Whether the new pull still feels right. A thumb that has just been steering has to go 0.18 s further before it fires; a real thumb's arc is modelled, not measured.
- Whether steering feels heavy in a good way. `dragGain`, `towDelay`, `shipRate`.
- Whether stage 1 is easy for a new player and the boss takes "a few tries". The scripts see every shape perfectly. Note stage 3 is the easiest of 2 to 4 for the script until reaction gets slow, because nothing knocks it off line. A person in fog may find it the hardest, or not. I can't tell.
- Whether the Dive at the boss can be done under pressure: pull, hold, steer, let go.
- Whether a player cares about the lines. Whether they read them at all at speed. That's the whole game, and no script can say.
- How a line drowning reads in motion (1.6 s), and whether you can look at it while steering.
- Vesh in motion: the swim wave, fin flap, the body at speed. Checked in still frames only.
- Red lane against a red-purple boss sea: looked readable in stills.
- Music and effects: checked that they play without error, not how they sound.
- A real phone: only Chrome pretending to be one has run this. Weakest-device speed is unmeasured on a real device.

## Provisional numbers to confirm
All in `tuning.js`, marked PROVISIONAL. Talk-box seconds, effect sizes and looks-only numbers stay beside their drawing; they don't touch play. New in the fourth review: `pullWindow` (0.6), `pullShowFrom`, `selaH`, `selaFeet`, `hekkaH`, `boss.warn` (1.3, 1.14, 1.06), `boss.gap` (1.5, 1.24, 1.06). New in the third review: `pullQuiet`, `pullQuietPx`, `pullSlant` (2), `hullRepair` (0), `hullFloor` (2), `sense[].miss`, `sense[].lead`, `boss.warn` (1.35, 1.2, 1.1), `boss.warnPerLine` (0.04), `boss.pylonSpeed` (112), `boss.cableClear` (0.75), `boss.fallTalkMax` (14), the `talk*` numbers, stage 2 and 3 `moveFrom`, `shut` and `shutPaid`. Likeliest to change: `pullPx`, `pullWindow`, `diveWindup`, `diveSecs`, `shut` per stage, `shutPaid`, `boss.warnPerLine`, `dropWarn`, `dragGain`, `towDelay`, `hull`, `sense`, `stages[].speed`, `gap`, `moveFrom`, `spacing`, `bandForce`, `boss.warn`, `boss.gap`, `boss.open`, `boss.openLance`, `boss.chainGap`, `bobbinChance`, `mopChance`. Spec-sourced: "at zero they're gone" (`sense[0]`); nothing else is a number Dylan has given.

## Calls Claude made (change any)
- **"For good" and "restore a line".** The spec says a Dive loses a line for good and a page restores a line. I read them together: the drowned memory never comes back; a page fills the row with a *different* memory she'd forgotten writing. Original lines drown first, in a fixed order; found pages go last. This is the one to check.
- All six memories and eight pages, and which matters most. The Kaito line is fifth to go, Vesh's last. One page quotes the "Ask him about the song" story card.
- Sela's words change when "pup" drowns (Kaito from then on), and some talk lines swap with what's gone.
- Spare Logbook means copies that burn first, in Ione's hand, rather than extra rows, since six rows is what fits.
- **Pull down and hold for the Dive, against the spec's "Hold to Dive".** A plain hold spent memories by accident: the review showed a pause, jitter or a resting thumb all did it. Space and down arrow on a computer.
- **Shut teeth are a new mechanic,** added because no stage needed a Dive. One each on stages 1, 2 and 3, two on 4. Scrape for a plank or Dive for a line. Each hides 15 salvage.
- **Planks last through the story run (third review).** This is a new rule and the biggest call of that pass: the review showed a knock healed every stage, so scraping was free. No repair between stages, never fewer than 2 planks at a stage's start, whole again for the boss, which on 2 planks a 0.5 s player couldn't beat at all. Bram says so in a new line, and another before the boss. Dying and Restart put the planks back as the stage began, like the book.
- **She can miss a gate altogether (third review).** "Weakens the arrows" now includes no arrow at all on some gates, so a thin book costs from the first line. It's new to the spec's wording.
- **The boss's drift arrows (third review).** The spec's arrows are about islands and the boss has none, so here they're gold chevrons for where a chain's way through will lie, and the red lanes' warning. Chains fall a little faster (100 to 112 px/s) so the arrows matter. A full book's red lanes are a bit longer than before, a blank book's a bit shorter.
- **Fan into lance (third review).** Lanes now clear 0.75 s before the next lance lands (was 0.5). At 0.5 every script player took the same hit there whatever the book said.
- **Who hears what when (third review).** Which lines are calls, remarks or scenes is mine (`talk.js` and its callers). The cutter sinking for up to 14 s while a scene plays is mine.
- **Salvage for a Dive kept.** The review named it as part of the problem. I left the 15 per tooth as what a line buys, now that a line costs more. Stage 3 and 4 clears with a Dive still pay over the kit's 15 to 40.
- **Pause then Restart no longer undoes a line,** against the kit's README, which says Restart puts back what the stage began with. Dying still does. Quit and pick stage 1 still starts a clean book (the kit's rule), but since the fourth review the gold from that quit attempt is forfeited, so it can't be farmed. Old wording: `NOTES-archive.md`.
- The Dive opens with Ione's line on stage 1, about a third of the way in. A resting thumb costs nothing at any point now.
- Air went from 1.5 s to 2.6 s and long rocks got shorter, so a Dive really does get under any rock. Longer Dive buys a wider start.
- A page in the boss only falls when the book can't pay for the next Dive, so the three Dives cost three lines that stay gone.
- Boulders: warning 1.5 s, radius 20, every 8.5 s, so stage 2 stops being the wall for a slower player.
- On a short screen the boss's book is a strip of six tabs, with the drowning line still in words, so the whole cutter shows. That includes a computer at 1440x900.
- A hint waits while a talk box is covering its place.
- Vesh runs under the rocks and only the hull can hit them. He's about 320 px long on screen against a hull of about 90. CAST.md says "long as the ship"; the brief for this game says long and impressive, so I went with that.
- Top-down view from high behind, so the water, ship and serpent all read. It means Sela and Hekka are small and seen from above.
- Grist asleep on the stern deck, a small touch.
- The story: the crew carry the stolen chart from Storm Run to the Free Ports through the Gaptooth, the one road the Empire doesn't watch; Hekka has Sela's old logs and knows the way. Stage names. Every line of dialogue. Hekka's "Still wearing your divorce on your ribs" for the ring scar. Hekka escapes alive.
- A loose page falls after a plate only when the book is empty, and one keeps coming while it is, so the boss can't dead-end. It's justified as her stolen file on Sela shaking loose.
- A Dive during a volley works as a plain dodge, at the same price. It only hauls you under the hull while the plates glow.
- Boss: 3 plates, 3 knocks. Vesh's bite on the last plate is my addition, paying off the line in the talk scene.
- Bots never meet Bobbin unless a test asks, because the smoke test needs the first catch for itself. So its natural 25% is by reading the code, not by test; the catch itself is tested with the chance forced.
- Endless: rips from 3,000 px, lances from 6,000, the palette moves on every 5,000. A fresh book each time.
- Salvage: 1 per cog, 5 under a rock; a page with a full book pays 2. Score adds 120 per line left at a clear, more than a cache is worth to a best score.

## Kit notes
Two small additions, both backward-compatible, and `tools/smoke.js storm-run` still passes: `Kit.input.resets` counts the times the kit forgot the thumb (pause, catch, choice), so a game can tell that from a real lift; and `.kit-tall .kit-title-in { max-width: 620px }` keeps an upright game's title menu near its play area on a computer. That one changes every upright game's title. From the game's side: a small style tag widens `.kit-say.at-bottom` and shrinks it on very short screens, and `Kit.speakers.add` gives Hekka a front-on code face if her picture goes missing.

## Pictures (2026-11-06)
14 takes for 11 pictures, plus `hekka_talk` cut from her sheet. Two small code changes, both only with the cutter picture on: the funnel smoke starts at the picture's funnel, and the hit flash follows the picture's outline (the code polygon stuck out past the wedge). The title's Gaptooth picture was already in use (`draw.js`), and so is the homepage card (`shared/games.js`). Screenshots of stages, boss and talk looked at with the pictures on, on a 390x844 phone at 2x; they're stills, so the ponytail and the frill in motion still need a person's eye.

## Picture fixes (2026-11-06, second pass)
Built, not yet seen by Dylan. Old files and takes kept; `art/sprites.js` points at the new ones.
- `hekka_stand`, `hekka_throw`: new strips `hekka-stand-v2.webp`, `hekka-throw-v2.webp`, keyed at 384 px a frame, from `raw/hekka-stand-v3.png` and `raw/hekka-throw-v4.png`. The ring was already in the v1 raw takes, but thin and close to skin colour, so it vanished at sprite size. It's now a thicker dull brown-red ring on her left side (image right), and skin is measured against the sheet (`art/prompts/hand-tone-2026-11-06.txt`). **Flaw: at 40 px on a 2x phone it's still only a faint mark, seen if you look for it.** It's also thicker and darker than the sheet's pale ring, on purpose. Stand v2 frames shifted nothing else I could see; the figure came back smaller in its cell, so `feet` and `fill` were re-measured and she's the same size on screen (about 85 device px, stand and throw).
- `hekka_talk`: `hekka-talk-v2.webp`, the same cut from the sheet with the grey taken out, so the kit's navy shows behind it like the crew's. Still soft, because it's 1:1 from the sheet, next to the crew's crisper drawings.
- `sela_talk`, new: **this game only.** The homepage portrait's skin is 212, 113, 54; the sheet's is 173, 99, 57. Mine is 178, 98, 54 (`raw/sela-talk-v2.png`), registered in `game.js` over the kit's speaker. The shared picture is outside this folder and untouched, so Sela still looks brighter on the homepage and in other games. Taking the `sela_talk` line out of `art/sprites.js` goes back to it.
- Not redone: `hekka_hurt`. Its ring shows in the raw take; its skin wasn't measured.

## Pictures after the third review (2026-11-06)
No new pictures: the third review's report says "NEEDS PICTURE: none", and its new things (dark planks, chain chevrons, Bram's lines) are code art or a portrait already in use. Nothing made, nothing changed in `art/`. Checked in the running game: all 13 keys in `art/sprites.js` decode, no missing files, no page errors. Skin in `hekka_hurt`, warm-pixel average, is 174, 110, 79 against 175, 116, 82 for `hekka_stand`, so it wasn't redone. Screenshots: `%TEMP%\kcheck\tide-gap\art-retry\`.

## Pictures still wanted (not made here) (older note; see the fixes above)
- `hekka-stand`, `hekka-throw`: the dull ring scar on her left side is missing, and it's in `CAST.md`, the sheet and `art/REQUEST.md`. Her midriff also looks brighter than the sheet, by eye. At 40 px it hardly shows.
- `hekka-talk`: sits on the sheet's flat grey where the crew's sit on navy.
- Sela's talk portrait is brighter orange than her sheet. It's the shared homepage portrait, not a Tide Gap file.

## Noticed, not touched
- With the pictures on, Hekka's lance is in her right hand (image left), per `art/REQUEST.md`. The code figure in `cutter.js` holds it on image right, her left, if the picture ever goes missing.
- On 320x568 the pause button sits over the top-right corner of the book. The top row's text is kept clear of it. (On stages. The boss's strip no longer runs under it, since the fourth review.)
- Vasch, the trooper, Krell and Maro still use the kit's side-on bust in talk scenes.
- The title's dim overlay comes from the kit's own title style; the Gaptooth picture is much darker there than on the talk screens.
- `CAST.md` says the logbook is her signature prop; Sela's belt pouch for it is on the sheet, but at 36 px it can't be seen.
