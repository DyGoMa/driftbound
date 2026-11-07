# Anime vs manga: continuity check, Episodes 1 to 20 (2026-11-07)

Read-only audit of `anime/episodes/ep-01.md` … `ep-20.md` against `manga/issues/issue-01.js` … `issue-20.js`, `docs/CAST.md`, `docs/WORLD_BIBLE.md`, `docs/manga/SERIES_BIBLE.md` (sections 1, 3, 5, 6, 8, 9) and `docs/manga/ANIME_FORMAT.md`. No episode file was changed. Line numbers are from the files as they stood on branch `main` today.

**What was checked:** every episode read in full beside its issue; walk-on names and ages; ending states; beats from bible section 8; secrets in section 3; plants in section 9; voices in section 5; partners' lines; header, cards, scene estimates and totals; word counts recounted with `wc -w` (total) and a script (dialogue = words after the speaker's colon, parentheticals and SFX/MUSIC/INSERT cues removed).
**What was only assumed:** runtime "truth" is the sum of the files' own scene estimates plus OP 1:30, ED 1:00 and the stated preview; I did not time anything. Dialogue counts depend on my counting rule; a different rule moves them ~10 %, which is why only Ep 11 is called under range.

## Summary

| Severity | Count |
|---|---|
| Breaks a hard rule | **0** |
| Contradicts canon (CAST, bible, the issue, or an earlier episode) | **32** |
| Wording drift | **8** |
| Format (ANIME_FORMAT.md) | **24** |
| Style | **32** |

No episode breaks a hard rule: every named new character is 21+, every bath/swim scene is shoulders-up or eye-level, no nudity, no camera on a body, nothing sexual near a hurt or frightened person or a Pal, the one childhood flashback (Ep 3) is plain, partners never speak words, and I found no names, symbols or lines lifted from real anime or manga.

### The ten worst

1. **Ep 4, Kaito's scars reach the shoulder.** `ep-04.md:426` "Under his sleeve the scar forks past the elbow", `:444` "The scar climbs to his shoulder", `:528` Bram: "All the way up, lad." CAST base state is hand to elbow; Issue 4 (p. 21 inset) says the new fork "reaches the crook of his elbow and stops"; the bible reserves the shoulder for Issue 42. Later episodes quietly revert: `ep-05.md:20` "bandaged wrist to elbow", `ep-06.md:326` "Hand to elbow, so far", `ep-20.md:159` Otti: "Hand to elbow."
2. **The Cinder Palace owner has three names.** `ep-07.md:350` "OSSIAN BRAND (49, owner of the Cinder Palace)"; `ep-08.md:24` "HOLLIS LUSK, 61, owner of the Cinder Palace"; `ep-14.md:185` Juno: "Lazare Quint doesn't know he's lost it yet" (Quint is the manga's name, Issues 7 and 8).
3. **Ep 14 runs over 15:00 and the total is wrong.** Scene estimates: 1:20 + 1:45 + 3:00 + 1:15 + 2:45 + 1:15 + 1:15 + 0:50 = 13:25 of scenes; Part B alone is 7:20 (the file says 6:05, `ep-14.md:415`). With OP, ED and preview the episode is about 16:20, not the stated 13:30.
4. **Ep 5 shows the whole warning early.** `ep-05.md:319` "Ask him about the song. He will say you made it up. You did not." Issue 5 (p. 26) shows only "Ask him about the song."; the full three sentences first appear in Issue 14. Section 3 of the bible pays "You made it up" off in Issue 41.
5. **Sela learns who Oren is in Ep 3.** `ep-03.md:153-162`: Kaito tells Sela his father went to sea, the sheet's corner says "O.B.", and she tells him to bring it. Ep 1 already puts a "MERIDIAN SURVEY OFFICE" stamp on the parcel sheets and has Sela say "You know the mark" (`ep-01.md:245-251`); `ep-05.md:81` "My sheets. My father's—". In the manga Kaito hides it: Issue 1 p. 12 "He's dead. He won't haggle."; Issue 3 p. 12 "Nothing. Surveyors tick their margins." The link is the Issue 37/47 payoff (bible section 9).
6. **The Lanternreach cargo changes three times.** `ep-15.md:79-85` four crates of Gaptooth brass; `ep-16.md:44` "Forty crates of ours", `:249` "Forty crates. Lamp oil, rope, salt pork."; `ep-17.md:94` "stolen your copper", `:148` "Their copper goes back on their deck." Issue 15 makes it a single drowned bell.
7. **Kaito's home moves.** `ep-01.md:159` Hask: "You live in a lighthouse that isn't a lighthouse"; `ep-02.md:244` "I've got a tower."; but `ep-05.md:75-81` his room is over Rooke's cooperage ("This is home… My stuff's up there").
8. **Ep 19 drops Silt's ring scar.** `ep-19.md:433` "A bare hand, nothing remarkable about it, which is the point." Issue 19 p. 25: "on the back of it is a dull ring-shaped scar, old and healed flat", the mark of his own stripped bond (bible section 3: "His partner, the hound Burr, he stripped himself").
9. **Ep 20 gives Otti medals instead of the empty harness.** `ep-20.md:128` "three gold Regatta medals hung off her chair-back on a chain"; `:183` "touching the medals". Bible section 4: "Her partner was stripped; she keeps its empty harness"; Issue 20 p. 7 draws the harness on her hip; section 9 plants it (Issues 22, 40) for Issue 41.
10. **Recaps are nearly always Bram.** ANIME_FORMAT: "a 20 s recap spoken by a crew member in voice (a different one each time)". Bram narrates Eps 2, 3, 4, 5, 6, 8, 9, 11, 12; Silas does 15, 16, 17, 19, 20; Kaito 13 and 18; Juno 7 and 10; Sela 14.

Runners-up: Ep 6 lists Juno's markers at about 344 plus a tab (`ep-06.md:357`) and Ep 7 calls it "four thousand one hundred" (`ep-07.md:20`; Issue 7: forty thousand chits); Ep 9 makes Krell's shields "forge-iron" (`ep-09.md:29`) where Issue 9 makes them Hollow ember-newt hide, a Sever plot detail; Ep 11's spoken dialogue recounts at 1,118 words (floor 1,300); Eps 13 and 18 are over the 3,600-word ceiling by `wc -w` (3,604; 3,701); eleven headers still say "no issue file existed" although every issue now exists.

### Per-episode table

Runtime "recount" = scenes + OP 1:30 + ED 1:00 + preview (Ep 1's ED overlaps its last scene). Words by `wc -w`; dialogue by my recount (file's own figure in brackets where it differs by more than 5 %).

| Ep | Hard rule | Canon | Drift | Format | Style | Runtime stated / recount | Words total / dialogue |
|---|---|---|---|---|---|---|---|
| 01 | 0 | 2 | 1 | 0 | 2 | 13:35 / 13:30 | 3572 / 1312 |
| 02 | 0 | 2 | 1 | 0 | 2 | 13:15 / 13:15 | 3596 / 1337 |
| 03 | 0 | 3 | 0 | 0 | 2 | 14:30 / 14:30 | 3549 / 1336 |
| 04 | 0 | 3 | 0 | 0 | 1 | 14:05 / 14:05 | 3511 / 1300 |
| 05 | 0 | 3 | 0 | 1 | 2 | none / 13:15 | 3577 / 1327 |
| 06 | 0 | 2 | 0 | 0 | 3 | 13:45 / 13:45 | 3591 / 1379 |
| 07 | 0 | 2 | 0 | 0 | 1 | 14:30 / 14:30 | 3581 / 1641 |
| 08 | 0 | 2 | 0 | 0 | 1 | 14:30 / 14:30 | 3355 / 1378 |
| 09 | 0 | 1 | 0 | 0 | 3 | 14:00 / 14:00 | 3515 / 1334 |
| 10 | 0 | 0 | 2 | 1 | 1 | 13:00 / 13:00 | 3244 / 1405 |
| 11 | 0 | 0 | 0 | 2 | 1 | 14:40 / 14:40 | 3576 / **1118** (file: 1338) |
| 12 | 0 | 0 | 1 | 2 | 1 | 14:05 / 14:10 (target 14:00) | 3583 / 1321 |
| 13 | 0 | 0 | 0 | 3 | 2 | 14:20 / 14:20 (target 14:00) | **3604** / 1311 |
| 14 | 0 | 1 | 0 | 2 | 2 | 13:30 / **16:20** | 3509 / 1364 |
| 15 | 0 | 2 | 0 | 3 | 1 | 14:15 / 14:15 | 3565 / 1390 (file: 1783) |
| 16 | 0 | 2 | 0 | 3 | 1 | 13:55 / 13:55 | 3568 / 1352 (file: 1542) |
| 17 | 0 | 2 | 0 | 2 | 1 | 13:40 / 13:40 | 3426 / 1366 (file: 1448) |
| 18 | 0 | 2 | 0 | 2 | 2 | 14:25 / 14:25 | **3701** / 1341 |
| 19 | 0 | 1 | 1 | 1 | 2 | 14:10 / 14:10 | 3571 / 1337 |
| 20 | 0 | 2 | 2 | 2 | 1 | 13:50 / 13:50 | 3585 / 1348 (file: 1619) |

### Plants (bible section 9), Episodes 1 to 20

All plants due by Issue 20 are present: Sever symbol (every ep); charts "finally right" (Eps 1, 4); "Ask him about the song" (Eps 5, 14; Ep 5 over-reveals, item 4); "Pup" (Ep 4 on); Silt's torn page (Ep 19); "Why do you run?" (Ep 4, `ep-04.md:394-398`); Undersong hum (Eps 1, 13; also added in Eps 3 and 10); father's survey sheets (Eps 1, 3); Standing Order 12 read in full (`ep-03.md:203`); Vasch "One" / "Two" (`ep-05.md:164`, `ep-10.md:325`); Bram's towel (Ep 2, via Sela, see Ep 2); betting pool (Ep 10 on); Juno's gloves off (Ep 8); the eleven freed monsters (Ep 15). Otti's harness (due Issue 22) has been pre-empted by medals (item 9).

### Cross-episode style notes (counted once per episode below)

- **Galley Rule numbers repeat with different rules:** rule six = nobody fights (`ep-03.md:197`), deckhands eat a vegetable (`ep-05.md:225`), don't stake what I'd wash (`ep-06.md:304`), nobody stands in my door hungry (`ep-07.md:57`), nobody fights in formalwear (`ep-09.md:64`); rule seven (`ep-07.md:245`, `ep-09.md:402`); rule nine (`ep-10.md:29`, `ep-19.md:125`); rule thirty-three (`ep-13.md:64`, `ep-14.md:189`); rule thirty-four (`ep-13.md:347`, `ep-20.md:221`). The bible gag is "a new rule each time".
- **Episodes 10 to 20 have no `## COLD OPEN`, `## PART A`, `## PART B` headings** (Eps 1 to 9 have them); the OP, eyecatch and ED cards still mark the shape, so the structure survives, but the format asks for "the five shape sections".
- **Stale header notes:** Eps 1, 2, 6, 10, 13, 14, 15, 16, 17, 18, 19, 20 say the issue file did not exist; all twenty do now.

---

## Episode 1, "The Islands Move" (vs Issue 1)

**Canon**
- Walk-ons and parcel differ. Issue 1: Sergeant Dole (52), Officer Pym (24), Mrs. Odell (61, landlady), Tolly Marsh (68) and Bess, Hanne Brill (55), Dov (40s, at the well); the parcel is twelve bottles of **ink** (p. 10). Episode: Dov Linnet, 24, customs runner (`ep-01.md:29`), Harbour-Clerk Teodor Hask, 44 (`:36`), Ama Kettle, 70 (`:86`); the parcel is **medicine** and survey sheets (`:89`, `:228`). "Dov" is a different person in each. (The bible beat says medicine; the issue departed from it; the episode follows the bible.)
- Oren's sheets are in Sela's parcel and stamped: `:245` "A stamp in one corner: MERIDIAN SURVEY OFFICE… Kaito goes still." `:249-251` SELA: "You know the mark." / "Everybody knows the mark." / "No. They don't." Issue 1 p. 20: Kaito's own tin of sheets, "No name is legible anywhere." See item 5.

**Drift**
- `:325` "SFX: a hum. Not heard. Felt. Below hearing: three slow pulses, long apart. (The Undersong. The same cue every time it returns.)" attached to the pylon being switched on. Issue 1 p. 24 and Issue 2 p. 1 keep the pylon hum ("MMMM", block letters) separate from the Undersong (three wavy lines over the ink bottle and the sill).

**Style**
- `:5` "Source: no `issue-01.js` existed" (it does).
- `:355` "[ENDING: "Logbook" — 60 s, held over the following scene]" — permitted for Ep 1, but the card text is not the exact string.

Good: Sela's mark "just below her left collarbone" (`:184`) matches CAST; "pup" is correctly absent; Silt's "Found you." lands as in the issue.

## Episode 2, "Ears Go Red First" (vs Issue 2)

**Canon**
- New scar passes the elbow in Ep 2: `ep-02.md:138-142` "Then it passes the elbow… A new branch burns into the skin above the elbow, inside the upper arm, smoking." Issue 2 p. 10: "reaching the elbow"; CAST base state: hand to elbow; the bible beat: "sees scars at the elbow". `ep-03.md:22` repeats "fresh lightning-scar running past the elbow".
- Walk-ons and beats: Issue 2 has Old Dace, Widow Hask (74), a fisherman, a carter, an old farmer (68) with a braided plough-beast; the Hollow is a tow-otter in the Gullwake's hold whose core dies (pp. 21-22); Bram's net pulls Kaito out; wages are twelve eggs. Episode: Daskel (58) and the Hollow shore-ox Tulip chained in the shallows (`:442-470`); Vesh pulls Kaito out (`:272`); wages twelve to fourteen coin a week (`:318-364`).

**Drift**
- The towel warning is Sela's line, not Bram's: `:418` SELA: "If he ever goes quiet and puts that towel down, you get behind Grist." Issue 2 p. 13 gives it to Bram ("If I go quiet and put it down, you get behind Grist. Bring the pot."); bible section 5 makes it Bram's.

**Style**
- `:6` "no `issue-02.js` existed".
- Running time line format differs from other episodes (fine, but inconsistent).

Good: tub scene is shoulders-up with the cut to Skarn (`:288-298`); the mast gag, "Vegetable", Galley Rule one and the dawn notice all match.

## Episode 3, "Standing Order 12" (vs Issue 3)

**Canon**
- Walk-ons renamed: Hob **Anser** and the moss-ox **Tamble** (`ep-03.md:176`), Maren Tull, 44, baker (`:176`), Sergeant Audric Dask, 36 (`:201`). Issue 3: Hob **Tarrow** (68) and **Thimble**, Marta Oake (61, egg-seller), an unnamed trooper. Hob's mark is "two parallel lines, a furrow" (`:188`) vs a "moss-green ploughshare-shaped bond mark" (Issue 3 p. 15).
- The flashback's numbers: `:60` "FIFTEEN YEARS AGO", `:64` "OREN BRASK (39 here; 54 now)", `:66` "Kaito at six". Issue 3 p. 5: "Thirteen years back", "Oren Brask (41 here)", "a small boy of about eight". Both fit Oren at 54 but not each other. The episode also shows Oren's face ("same jaw as his son", `:64`); the issue never does ("I can't get his face anymore").
- Sela learns of Oren and the O.B. sheet (`:153-162`). See item 5.

**Style**
- Bram's recap again (`:14`); the recap contains the sail-screen quip ("that's between him, the Captain and the sail-screen") in the scene immediately before the childhood flashback. Bible rule 6 asks for zero innuendo on the page or facing page; the OP card is the only buffer.
- Galley rule six = nobody fights (`:197`); Ep 2 made that rule one.

Good: Standing Order 12 is read aloud in full (`:203`), the count of ten is shown on the beast and the farmer's face empties, "Screw your mercy." closes it.

## Episode 4, "Run" (vs Issue 4)

**Canon**
- Scar to the shoulder: `ep-04.md:426`, `:444`, `:528`. Item 1.
- Walk-ons: Harl **Dunning**, 38, well-digger with the burrowing beast **Spade** (`:78`); Issue 4: Harl, 44, well-digger with the toad **Duchess** (p. 2, p. 10). Abel Finch, 58, chart-seller (`:78`) vs Ansel Rook, 73 (Issue 4 p. 26). Maud Pellow, 63, and Yolk (`:62`) vs Nan Hask (71) with the terns Ink, Stamp, Late and Mrs Teal (58) with Bosun.
- Sela gives a reason for "pup": `:516` "You've got the ears for it." Issue 4 p. 24: "I like it. Can't think why." / "No idea where I got it." Bible section 3: she "doesn't know why she likes the word".

**Style**
- Bram's recap again (`:14`).

Good: Silt's "Why do you run? … It's the same sea." (`:394-398`), three hits crack the core, "PUP!" from the ship (`:492`), the island stops and every chart is right (`:602-612`).

## Episode 5, "First Count" (vs Issue 5)

**Canon**
- `ep-05.md:319` shows the full three-sentence warning. Item 4.
- Kaito's home is a room over Rooke's cooperage (`:75-81`); Eps 1 and 2 made it the signal tower. Item 7.
- Walk-ons: Adjutant Corren, 38 (`:152`) vs Mr. Tull, 27 (Issue 5 p. 11); Dannel Rooke, 34, and Hesper Rooke, 61 (`:77`) vs Mrs. Oake, 63, and Dunn Hollis, 44; Fenna Dray, 44 (`:59`) has no counterpart. The roster beat drops "SKARN, SHIP'S DOG".

**Format**
- No total runtime line at the end (the format requires "a total at the end"); scenes add to 13:15, matching the header target.

**Style**
- Bram's recap again (`:12`).
- Galley rule six = "Deckhands eat a vegetable" (`:225`), a different rule six from Ep 3.

Good: Vasch's look and voice match CAST and section 5 (`:150-165`); the far-island bear looks up; the uniform gag; the torn edge under her thumb.

## Episode 6, "Ten to One" (vs Issue 6)

**Canon**
- Walk-ons and set: Lieutenant Garrow, 34 (`ep-06.md:99`) vs Adjutant Prewitt, 36; the Slag Bucket (`:85`) vs the Burnt Penny; the "Steady" coin game (`:164`) vs the chalk-ring bout; Juno's debts are four named markers (`:357`) vs eleven houses.
- Debt total: `:357` "two hundred and six… thirty… ninety… eighteen and a bar tab"; `ep-07.md:20` "Marker for four thousand one hundred"; Issue 7 p. 1: "Forty thousand chits".

**Style**
- Bram's recap again (`:12`); `:4` "no issue-06.js yet"; Galley "Rule six. You don't stake anything I'd have to wash." (`:304`).

Good: Kaito bets her first, loses boots, jacket, shirt; the goggles deposit; the gloves beat; Krell's look (41, 195 cm) and bluster; the bought markers.

## Episode 7, "The House Always Wins" (vs Issue 7)

**Canon**
- Palace owner: Ossian Brand, 49 (`ep-07.md:350`). Item 2.
- Cover identities and the makeover: "Mister and Missus Toller. From Gaptooth." (`:355`) vs Lady Ondine Hask / Perpetua Hask / fiancé; a salvage trunk (`:178`) replaces Madame Crake's tailor shop and the sketches that betray them. The ending state is the same (owner has their pictures).

**Style**
- Galley Rule six again (`:57`) and seven (`:245`).

Good: backless midnight gown with a slit as the bible asks (`:209`), Juno's red gown and long gloves, Bram's vest, Kaito's waistcoat, Grist as coffee table (`:178`), "comedy, not heat" staging note (`:256`).

## Episode 8, "High Table" (vs Issue 8)

**Canon**
- Palace owner now Hollis Lusk, 61 (`ep-08.md:24`), contradicting Ep 7's Brand. Item 2.
- Dealer Fennick, 36 (`:68`) vs Mister Fenn, 51; the game "Cinders" (`:70`) vs "Last Ember" (Ash/Ember cards). Different rules, same function.

**Style**
- Bram's recap again (`:12`).

Good: reckless bluff that stops the room, Krell's "Cheat" and the table flipped, gloves off showing burned palms, fire from bare hands.

## Episode 9, "Hot Hand" (vs Issue 9)

**Canon**
- `ep-09.md:29` KRELL: "Forge-iron, cheat. Burn it all night." Issue 9 p. 7: the shields are faced with stripped ember-newt hide ("A stripped beast doesn't take fire"), bought from debtors by the plate.

**Style**
- Bram's recap again (`:14`); Galley rule six = "Nobody fights in formalwear" (`:64`); preview "Galley rule seven. Nobody dies in my galley." (`:402-404`) after Ep 7's rule seven; `:118-120` "Sela's slit skirt flicks aside as she high-kicks… 'That's what the slit's for, pup.'" is an action beat, not a lingering shot, but it is the closest any episode comes to the section 6 line.

Good: Juno's numbers rising on screen, the vents, Bram walking into the harbour, Krell scorched and sworn to return, Vesh holding the water cold.

## Episode 10, "Marker Paid" (vs Issue 10)

**Drift**
- `ep-10.md:4` "Nim Hadda (30, new this episode)": Nim has been on screen since `ep-06.md:103`.
- `:308` the Undersong's "Three small wavy lines" at the Gaptooth quake; Issue 10 has none there (the section 9 plant list is Issues 1, 13, 34).

**Format**
- No `## COLD OPEN` / `## PART A` / `## PART B` headings (first episode to drop them).

**Style**
- `:4` "No manga issue file existed for Issue 10".

Good: Juno's backstory spoken only, no flirting in that scene (`:94-122`); Nim tears the marker; she cheats Kaito for a berth and gives the goggles back; bath night cut to Grist and the kettle; "KAITO AND WHO?" chalked; Vasch "Two."

## Episode 11, "Gaptooth" (vs Issue 11)

Near line-for-line adaptation; no canon findings.

**Format**
- Dialogue recounts at 1,118 words (floor 1,300); the file's comment says 1,338 (`ep-11.md:481`).
- No shape headings.

**Style**
- Bram's recap again (`:12`).

Good: Hekka's description (`:446`) matches CAST (no lip scar).

## Episode 12, "Rival" (vs Issue 12)

Near line-for-line adaptation.

**Drift**
- `ep-12.md:12` BRAM (recap): "Captain read her own book to find out she likes dumplings. She does. I made dumplings." Ep 11 and Issue 11 make it eel pie with too much pepper, a plot detail for her memory loss. Recaps are licensed to be unreliable, but this one muddies a plant.

**Format**
- Header target 14:00 (`:3`) vs total 14:05 (`:564`); the parts as listed (1:15 + 1:30 + 4:30 + 5:30 + 1:00 + 0:25) add to 14:10.
- No shape headings.

**Style**
- Bram's recap again.

Good: Hekka's ring scar on the left side shown "as a wound" (`:247`), the doctor's crystal wrist in the memory, "I'll let you know. If I remember."

## Episode 13, "The Bill" (vs Issue 13)

Beats match (dive, Undersong, the shape, up through the cutter, "Who taught me to make that stew?", the Mag Tolliver page read as a stranger's).

**Format**
- `wc -w` 3,604 words (ceiling 3,600); the comment says 3,586 (`ep-13.md:447`).
- Header target 14:00 vs total 14:20.
- No shape headings.

**Style**
- `:4` "No issue-13.js existed".
- Galley Rule Thirty-Three (`:64`) and Thirty-Four (`:347`) are both reused later.

## Episode 14, "Reading It Back" (vs Issue 14)

**Canon**
- `ep-14.md:185` "Lazare Quint doesn't know he's lost it yet." Third name for the Palace owner. Item 2.

**Format**
- Runtime: Part B scenes 1:15 + 2:45 + 1:15 + 1:15 + 0:50 = 7:20, stated 6:05 (`:415`); the episode is about 16:20 against a 15:00 ceiling and a stated 13:30. Item 3.
- No shape headings.

**Style**
- `:4` "No manga file exists for Issue 14 yet".
- `:189` "Rule Thirty-Three. Nobody drinks on an empty stomach" reuses Ep 13's number.

Good: trunk of logbooks, the lobster joke twice, Vesh ringing the ship, Juno's dance, Bram's keel song, "Old tear." (`:350`), Silas's "Well. That's inconvenient, darling." (`:384`), Silas's look matches CAST.

## Episode 15, "Port of Lamps" (vs Issue 15)

**Canon**
- Cargo and walk-ons: four crates of Gaptooth brass (`ep-15.md:79`) vs a drowned bell; the collector Lem (`:69`, `:288`), a lamp-seller, a docker, a fence, a knife-woman vs Petra Dunne (31), Tollo Vance (44), Ansel Rook (36), the Tallyman (58), Auntie Hobb (63).
- Ending state: the episode ends with Silas voiced ("The rasp in his breathing is louder now", `:361`) and no alarm raised; Issue 15 ends with him voiceless after a Surge and the troopers roused (pp. 19-24). The episode is closer to the bible (voice goes in Issues 17-18), so this is noted, not blamed.

**Format**
- Dialogue comment 1,783 (`:392`); recount 1,390 (both in range, the comment is wrong).
- Extras given decades, not ages: "a docker (man, forties)… a fence (man, sixties)… a knife-woman (woman, thirties)" (`:20`), "collector… (man, forties)" (`:69`). All adult, but the format asks for an age.
- No shape headings.

**Style**
- `:4` "No issue-15.js exists".

Good: three creditors in an alley, flirts with Kaito on sight and Bram on purpose, love-letter rooftop chase, eleven cages opened for no one (`:333-363`); Maro matches the bible (52, 172 cm, soft-spoken, account books).

## Episode 16, "The Steam Ledger" (vs Issue 16)

**Canon**
- `ep-16.md:44` SELA: "Forty crates of ours sit in his warehouse"; `:249` "Forty crates. Lamp oil, rope, salt pork." Ep 15 had four crates of brass. Item 6.
- Keeper of the book: the Pen, 45, and the Door, 44 (`:4`, `:151`, `:203`) vs Mother Hesper Dunne (61) and a doorkeeper (38); Maro sits in the baths (`:278`), which he never does in the issue.

**Format**
- Dialogue comment 1,542 (`:476`); recount 1,352.
- `:4` reads "Cast:" not "Cast in this episode:".
- No shape headings.

**Style**
- `:4` "No manga script for Issue 16 yet".

Good: "Everything here is faces, shoulders and steam. We never see more than that." (`:205`); kettle and steam-whistle cutaways; Silas's "put the towel down" lands and is corrected (`:115-126`); page one is Moreau.

## Episode 17, "Ledger" (vs Issue 17)

**Canon**
- The stolen cargo is now "copper": `ep-17.md:94`, `:135`, `:148`, `:163`. Item 6.
- `:4` "Ledger Maro (52, new this episode)": Maro appears at `ep-15.md:283` and `ep-16.md:278`.

**Format**
- Dialogue comment 1,448 (`:373`); recount 1,366.
- No shape headings.

**Style**
- `:4` "No manga issue file exists yet for Issue 17".

Good: Silas sells them out on screen and we believe it (`:277-319`); no Lucan; he walks away, "I KNEW it", the long slow Surge on the stair (`:337-347`).

## Episode 18, "…" (vs Issue 18)

**Canon**
- Walk-ons: Tull, 44, and Ansel, 37 (`ep-18.md:52`, `:182`) vs Auntie Hobb (63) and Tams.
- `:140` SELA: "Fourth night out of Gaptooth. I saw it through the galley hatch. He gave Grist a sausage" — Silas was not aboard until Lanternreach (Ep 14 puts the crossing at three days, Ep 15 meets him on arrival).

**Format**
- `wc -w` 3,701 words (ceiling 3,600). The comment (`:518`) claims 3,572 by excluding the header.
- No shape headings.

**Style**
- `:4` "no manga file for Issue 18 yet".
- Kaito narrates the recap for the second time (also Ep 13).

Good: Silas has no spoken word (`:30`, `:216-220`); lamps cut, no one killed, Maro's "So. Who will you tell?" (`:370`), the smash cut, the slate "Darling, I was never going to" rubbed out, "Your handwriting's shit." / "Get on the boat." (`:460-464`).

## Episode 19, "Pup" (vs Issue 19)

**Canon**
- `ep-19.md:433` Silt's bare hand "nothing remarkable about it, which is the point" vs Issue 19's ring-shaped scar. Item 8.

**Drift**
- `:402` JUNO: "New book. 'Who's under the mask.' Ten to one it's somebody's ex." A joke, but it points straight at the section 3 secret (Silt was Sela's lover). The issue's equivalent (p. 22) is Silas's slate "Who called him that?", which points at the word, not the relationship.

**Format**
- No shape headings.

**Style**
- `:4` "No manga file exists for Issue 19".
- `:125` "Galley rule nine. Nobody sits on the flour." reuses Ep 10's rule nine.

Good: slate innuendo at the stove, voice back for one filthy line and gone (`:177`), "PUP, LEFT!" (`:313`), the hook stopping, "What did she call you?" in a cracked voice (`:323`), the torn page with his face unseen.

## Episode 20, "Everyone's Invited" (vs Issue 20)

**Canon**
- Otti's medals instead of the harness (`ep-20.md:128`, `:183`). Item 9.
- Regatta Master Adaire Fenn, 64, woman (`:303`) vs the Truce Marshal, 63, man, and a Clerk, 45 (Issue 20 pp. 6, 20).

**Drift**
- `:12` SILAS: "I lost my voice for nine days"; Ep 19's preview has it back on "Day six!" (`ep-19.md:459`), and Ep 19 calls nine days his earlier record (`:112`).
- `:388` "The islands move, pup. Try to keep up." — the series tag with a word inserted.

**Format**
- Dialogue comment 1,619 (`:394`); recount 1,348.
- No shape headings.

**Style**
- `:4` "No manga file for Issue 20 yet".

Good: Otti tries Bram, then Silas, then Kaito; Tobias and Flint, Marisol and Gnash match the bible; beach party staged at eye level with the crew in charge (`:259-272`), Bram's tiny suit "Tam made it" (`:217`), Kaito's burned nose; rules read, Hekka signs; Hekka's look matches CAST (`:335`).

---

## Noticed, not touched (manga side, outside this audit's question)

- Issue 1's landlady is Mrs. Odell (61); Issue 4's Mrs. Oake is a 54-year-old baker; Issue 5's Mrs. Oake is 63 and Kaito's landlady. The surname Hask is used for a widow (Issue 2), a postmistress (Issue 4) and a cover identity (Issue 7).
- Issue 15 has Silas lose his voice two issues before the bible says so (Issues 17-18); Issue 16 then has him speak.
- Issue 1 makes the parcel ink and Issue 2 the wages eggs; the bible beat says medicine.

## Not checked

- I did not run `node tools/manga-check.js`; the issues were read, not linted.
- Nothing was timed; runtimes are the files' own estimates added up.
- "Copied from real anime or manga" was judged by reading; no external search was made.
