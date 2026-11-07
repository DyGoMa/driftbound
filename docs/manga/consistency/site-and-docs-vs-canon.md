# Site and docs vs canon: continuity check (2026-11-07)

Read-only pass over `main` at commit `7a24f72` (2026-11-07 09:56, "Site: one page per section"), working tree clean at the time of writing. The site was being split into one page per section while this check ran; where a line changed between `d25d1a1` and `7a24f72` the newer wording is quoted. Authority order used: `docs/CAST.md` (looks, ages, names) > `art/refs/STYLE.md` (what the locked sheets actually show) > `docs/WORLD_BIBLE.md` and `docs/manga/SERIES_BIBLE.md` (world and plot) > everything else. Line numbers are from the files as they stood.

Severity key: **HARD** breaks a hard rule · **CANON** contradicts CAST.md, the bible or a locked sheet · **DRIFT** wording drift, or two project documents telling one thing two ways · **STALE** a line that stopped being true after the merges.

## Summary

| Severity | Count |
|---|---|
| HARD | 1 (one name, six places) |
| CANON | 7 |
| DRIFT | 31 |
| STALE | 17 (plus 4 outside the file list, under "Noticed, not touched") |

### The ten worst
1. **HARD.** "Ten Count" is still the officer group's name and Issue 25's title, and it is a real published manga (rule 3, original only). Live on the shelf: `manga/catalog.js:247` `"title": "Ten Count"`; `docs/manga/SERIES_BIBLE.md:53,124`; `docs/manga/backstory/tencount.md:1`; `docs/manga/backstory/silas.md:39`; `docs/manga/NEW_CREW_PROPOSALS.md:50,93`. Already on Dylan's decision list (`WRITER_HANDOFFS.md:4`); nothing has changed yet.
2. **CANON.** Ione's crystal is drawn from the wrong arm on the Issue 38 cover: `manga/catalog.js:380` "right arm thrown out and a wall of faceted crystal blooming from her wrist" vs `docs/CAST.md:77` "a cracked hexagon on her left wrist" and `:82` "crystal growths on her left wrist".
3. **CANON.** Silt's mask slit sits over his right eye on the locked sheet (`art/refs/STYLE.md:24` "Slit over his right eye"), but the code portrait centres it: `shared/kit/speakers.js:77` "the mask with its one centred slit", `:90` the slit drawn from x=41 to 59 of 100.
4. **DRIFT.** The crew's name colours differ between the crew page, the talk scenes and the manga balloons (which read `Kit.speakers`): Sela `#1f9aa3` (`shared/crew.js:7`) vs `#35c4cc` (`speakers.js:142`); Silas `#7a4fc0` vs `#a78bf0`; Bram `#7b828e` vs `#d08a52`. Full table below.
5. **DRIFT.** Who captained the Gullwake when Corin Vale joined: `sela.md:20` Sela signs on at 19 as pilot under "Captain Hesper Lund" with Corin already first mate; `villains.md:91` "At 20 he signed onto the Gullwake as a hand under its 19-year-old captain, Sela Vey"; `allies.md:136` "at 20 he left to crew for a silver-haired girl of 19"; `allies.md:96` Marisol "saw Sela at 19... with a first mate on deck".
6. **DRIFT.** Oren's survey is told three ways: Oren found the pulse in the Tull well-ledgers and an Empire cutter took him (`kaito.md:72-73`); Oren found it on his instruments and "Vasch, then 31, had sent men for the survey" (`allies.md:208-214`); the survey "reached him from the Admiralty archive" when Vasch was 36 and *Vasch* "saw the pulse in it" (`villains.md:13`). The bible gives the pulse to Oren (`SERIES_BIBLE.md:29`).
7. **DRIFT.** Hekka's stripping is dated two ways: `ione.md:26` Ione 22, "Hekka Dorn (then 29)" (four years ago); `villains.md:52` "At 30 ... She walked into Ione's lab" and `:5` "3 Hekka strips Mallow, Ione's half-cut" (three years ago, same year as Ione's own cut).
8. **DRIFT.** The night of the eleven: `silas.md:21,41` is Issue 15 itself (Silas 24); `tencount.md:83` has Maro at "51: the night of the eleven. 52: Issue 15", up to a year earlier. The same line has Maro take on "Silas (21)" at 48, four years ago, when Silas was 20 and (per `silas.md:13-18`) had already worked for the house since 14.
9. **STALE.** Twelve files still send writers to a folder that was merged away this morning: `C:\Users\Dylan\Documents\driftbound-villains\docs\CAST.md` in `SERIES_BIBLE.md:3`, `FRIDAY_BATCH.md:5`, `ORCHESTRATOR.md:21`, `NEW_CREW_PROPOSALS.md:3` and all eight crew/villain dossiers (`kaito.md:3`, `sela.md:3`, `juno.md:3`, `silas.md:3`, `bram.md:3`, `ione.md:3`, `villains.md:3`, `world.md:3`). `README.md` was fixed in `7a24f72`.
10. **STALE.** The renamed pals still carry their old names in the spec and the world dossier: `FRIDAY_BATCH.md:41` "Pals: Cinderbun, Dicemite" and `:50` "Pals: Glimmick, Shardle" (the table at `:59,65` has Kindlekin and Prismule); `world.md:100,106,107` Cinderbun, Glimmick. The rename was made because the old names sit close to Pokémon names (`DECISIONS.md:677`), so this touches rule 3.

---

## 1. Section names: "Manga" and "Anime"

The split in `7a24f72` renamed the sections on the site (`shared/site.js:6-7` Games, Crew, Story, Manga, Anime, Book; `index.html` now only the hero and six hub cards; `anime.html` built) and fixed `README.md:3`, `docs/WORLD_BIBLE.md:3,30,31,41,42` (old lines archived at `:47-54`) and `docs/TEST_CHECKLIST.md:177`. What still says the old names:

| # | Sev | File:line | Says | Should match |
|---|---|---|---|---|
| 1.1 | STALE | `home.css:73` | `/* Visual novel and videos */`, then `.soon-pair`, `.soon-card`, `.soon-story`, `.soon-video` (`:74-80`) and `:118` `.soon-pair { grid-template-columns: 1fr 1fr; }` | No page uses these classes after the split; dead CSS under the old name |
| 1.2 | STALE | `docs/CAST.md:12` | "Signature colours (for UI, menus, VN name boxes)" | The VN is now "some manga issues"; the colours are used for talk scenes and manga balloons |
| 1.3 | STALE | `docs/CAST.md:120` | "Which leads have romance routes and how they play out: decided at build step 4 (visual novel)." | Build step 4 is now the manga (`WORLD_BIBLE.md:41`) |
| 1.4 | STALE | `docs/TEST_CHECKLIST.md:180` (H2) | "Tap each word in the top menu \| The page jumps to that section" | Each word now opens its own page (H1b, `:178`, says so) |
| 1.5 | STALE | `docs/TEST_CHECKLIST.md:24,27,34` (S1, S4, S11) | "Scroll the homepage to Games", "Look at Story cards on the homepage", "Go to the Monster book on the homepage" | Games, Story and Book are `games.html`, `story.html`, `book.html` |
| 1.6 | STALE | `docs/STEP3_PLAN.md:41` (outside the list) | "Banner placeholder, Storm Run card, Visual novel and Videos marked coming soon." | Historical plan; fine if read as history, wrong if read as the layout |

Checked and clean: `index.html`, `hub.js`, `hub-book.js`, `hub-home.js`, `hub-anime.js`, `anime.html`, `shared/site.js`, `manga/index.html`, `manga/shelf*.js`, `manga/read*.js`, `manga/catalog.js`, `manga/art/manifest.js`, `shared/crew.js`, `shared/games.js`, `shared/pals.js`, `shared/stories.js`, `docs/ORCHESTRATOR.md`, `docs/STARTER_PROMPT.md`, `docs/FRIDAY_BATCH.md`, `docs/PROVISIONAL.md` contain no "Visual novel", "Videos" or "motion comic" as a section name. `anime.html:23` "First episode as a motion comic" and `hub-home.js:22` "Some issues will play as visual novels later" match the new bible wording (`WORLD_BIBLE.md:30-31`).

## 2. Other stale statements

| # | Sev | File:line | Says | What is true now |
|---|---|---|---|---|
| 2.1 | STALE | `SERIES_BIBLE.md:3`, `FRIDAY_BATCH.md:5`, `ORCHESTRATOR.md:21`, `NEW_CREW_PROPOSALS.md:3`, eight dossiers at line 3 | "the authoritative cast at `C:\Users\Dylan\Documents\driftbound-villains\docs\CAST.md`" / "until the villains branch is merged, the newer copy is..." / "Locked sheets: `...driftbound-villains\art\refs\`" | Villain sheets merged in `a82300a`; `docs/CAST.md` and `art/refs/` on `main` are the copy |
| 2.2 | STALE | `docs/CAST.md:3` | "approved by Dylan 2026-10-30 (cast locked; images not started)" | All 19 sheets are locked (`STYLE.md:6-25`) |
| 2.3 | STALE | `docs/CAST.md:118-121` | "Not in this step: Pals ... designed later. Which leads have romance routes ... build step 4 (visual novel). Reference sheet prompts: build step 2, after Dylan's OK" | Pals are designed (`FRIDAY_BATCH.md:56-68`, `shared/pals.js`); sheets are done; step 4 is the manga |
| 2.4 | STALE | `docs/WORLD_BIBLE.md:15-21` | "## Cast (to be designed in the next build chat) ... Names, looks, ages, partners and the cost of each bond are Claude's calls, made and listed in the build chat." | Designed and approved in `docs/CAST.md`; the bible should point there |
| 2.5 | STALE | `docs/STARTER_PROMPT.md:4-5` | "Then start build step 1: design the 6 adult leads, their partners and the Empire villain unit on paper ... Don't start images until I've said yes to the cast" | Steps 1 to 3 are done and merged; the prompt would restart the project |
| 2.6 | STALE | `README.md:9` | "`docs/manga/CANON.md` (the register every medium follows)" | The file does not exist (`FRIDAY_PLAN.md:12`: "Not done at all: the canon register `docs/manga/CANON.md`") |
| 2.7 | STALE | `README.md:15` | "Current build step: `docs/STEP3_PLAN.md`" | Step 3 is merged; `STEP3_PLAN.md:11` still says "Not done ... merging to main" |
| 2.8 | STALE | `docs/TEST_CHECKLIST.md:8` | "Status of everything in this section: built, not yet seen by Dylan." | S11 (`:34`) and SL11 (`:145`) are marked **works** by Dylan |
| 2.9 | STALE | `docs/TEST_CHECKLIST.md:149-153` and `:199-207` | Two tables both numbered V1, V2 ("New villain pictures" Krell/Maro, and the villain reference sheets) | Duplicate ids; a "V1 works" answer is ambiguous |
| 2.10 | STALE | `docs/FRIDAY_BATCH.md:41,50` | "Pals: Cinderbun, Dicemite" / "Pals: Glimmick, Shardle" | Same file, `:59,65`: "Kindlekin (was Cinderbun, renamed 2026-11-07)", "Prismule (was Glimmick...)"; `shared/pals.js:140,146` show Kindlekin and Prismule |
| 2.11 | STALE | `docs/manga/backstory/world.md:100,106,107` | "**Cinderbun** (Hot Hand)", "**Glimmick** (Split Light)", "follows Glimmick's trail" | Renamed 2026-11-07 |
| 2.12 | STALE | `docs/PROVISIONAL.md:583,1225,1299-1313` | "before Cinderbun comes", "Chance Glimmick comes", "Glimmick comes from Set 2 on" | Generated from code ids (`cinderbun`, `glimmick`, kept on purpose per `DECISIONS.md:679`); the prose names should read Kindlekin/Prismule when the list is next rebuilt |
| 2.13 | STALE | `docs/ORCHESTRATOR.md:21` | "(until the villains branch is merged, the newer copy is `Documents\driftbound-villains\docs\CAST.md`; read it, never edit it)" | Merged; the brief now sends workers to a folder that may not exist on another machine |
| 2.14 | STALE | `docs/manga/SERIES_BIBLE.md:1` / `WRITER_HANDOFFS.md:1` | Both dated 2026-11-06 and written for the `driftbound-manga` folder | Merged to `main` in `d25d1a1`; no pointer to the merge |
| 2.15 | STALE | `docs/manga/NEW_CREW_PROPOSALS.md:9` | "one entry in `shared/kit/cast.js`" | Fine (file exists); but `:3` path is stale (2.1) |
| 2.16 | STALE | `docs/manga/backstory/world.md:111` | "The site never reveals the Sleeper, the Count or the symbol before the manga does." | The manga is now on the site with Issues 1 to 51 readable, so this rule has no teeth; the story cards already carry Order 12 and "a wound with a name" (`stories.js:61,65`), which is fine, but the rule should say what it now means |
| 2.17 | STALE | `docs/TEST_CHECKLIST.md:167` (G4) | "the other three sections marked coming soon" | Historical result (works, 2026-11-05); fine as history, no longer a thing to check |

## 3. Colours, side by side

`docs/CAST.md` gives words only; every hex value is a site call. The manga reader takes speaker name colours from `Kit.speakers` (`manga/common.js:36-37`), so a crew member shows one colour on the crew page and another on every balloon and talk scene.

| Who | CAST.md (words) | `shared/crew.js` colour / colour2 | `shared/kit/cast.js` colour / markColor | `shared/kit/speakers.js` (person and partner) |
|---|---|---|---|---|
| Kaito / Skarn | electric yellow + red (`:24`) | `#f2d21b` / `#c8302c` (`:4`) | `#f2d21b` / `#f2d21b` (`:11,14`) | `#f2d21b` (`:141,147`) |
| Sela / Vesh | deep teal + gold (`:35`) | `#1f9aa3` / `#d9a93a` (`:7`) | `#1f9aa3` / `#35d0d8` (`:15,18`) | **`#35c4cc`** (`:142,148`) |
| Juno / Ashka | fire orange + white (`:46`) | `#ef6a1f` / `#f5f0e6` (`:9`) | `#ef6a1f` / `#ff8a2a` (`:19,21`) | `#ef6a1f` (`:143,149`) |
| Silas / Hush | violet + red (`:57`) | `#7a4fc0` / `#c8302c` (`:11`) | `#7a4fc0` / `#a78bf0` (`:22`) | **`#a78bf0`** (`:144,150`) |
| Bram / Grist | iron grey + rust orange (`:68`) | `#7b828e` / `#c05a22` (`:13`) | `#7b828e` / (none) (`:25`) | **`#d08a52`** (`:145,151`) |
| Ione / Prism | ice blue + black (`:79`) | `#8fd3f0` / `#11141c` (`:15`) | `#8fd3f0` / (none) (`:29`) | `#8fd3f0` (`:146,152`) |
| Vasch | white coat (`:95`) | — | `#e9edf0` (`:40`) | `#e9edf0` (`:153`) |
| Hekka | grey armour (`:101`) | — | **`#7b828e`** (`:44`, the same hex as Bram) | `#c8ccd2` (`:154`) |
| Silt | — | — | `#4a4a5a` (`:48`) | `#c8ccd2` (`:155`) |
| Krell | — (`FRIDAY_BATCH.md:300`: Claude's call) | — | `#9aa0a8` (`:37`) | `#c8ccd2` (`:156`) |
| Maro | — | — | `#7a3d6a` (`:51`) | `#c98ac0` (`:157`) |
| Trooper | grey coats (`:113`) | — | `#7a8088` (`:7,34`) | `#9aa0a8` (`:158`) |

- 3.1 **DRIFT.** Sela, Silas and Bram have one colour on the crew page and another in talk scenes and manga balloons (bold above). Bram's talk colour is his *secondary* (rust) and not close to his crew.js primary; Kaito's crew.js colour2 and Silas's colour2 are the same red `#c8302c`.
- 3.2 **DRIFT.** Hekka, Silt and Krell share `#c8ccd2` in `speakers.js:154-156`, so three villains have one name colour in every talk scene and balloon; `cast.js` gives them three different colours.
- 3.3 **DRIFT.** `cast.js:44` gives Hekka Bram's exact crew colour `#7b828e`.
- 3.4 Pal colours are not in CAST; `shared/pals.js` is the only source. No conflict found.

## 4. Looks against CAST.md and the locked sheets

| # | Sev | Where | Says | Canon |
|---|---|---|---|---|
| 4.1 | CANON | `manga/catalog.js:380` (Issue 38 cover) | "right arm thrown out and a wall of faceted crystal blooming from her wrist" | `CAST.md:77,82` left wrist; `TEST_CHECKLIST.md:196` (R9) "crystals on the back of her left wrist" |
| 4.2 | CANON | `shared/kit/speakers.js:77,90` | "the mask with its one centred slit"; slit drawn centred | `STYLE.md:24` "Slit over his right eye, drawn flat on the side of the mask in the right-side view"; `TEST_CHECKLIST.md:206` (V5) "one black slit over his right eye" |
| 4.3 | CANON | `shared/kit/cast.js:44` | Hekka `eye: '#2a2230'` (near black) | `STYLE.md:22` "blue-grey eyes" on the locked `hekka-sheet-v6.png`; `speakers.js:123` paints them `#5d7180` (blue-grey), so the two code portraits disagree with each other too |
| 4.4 | CANON | `manga/catalog.js:310` (Issue 31 cover) | "grey iron spreading from the anvil mark over his heart up his throat" | `CAST.md:71` the iron spreads from "his left shoulder and forearm"; the anvil is the bond mark, not the iron's source; `WRITER_HANDOFFS.md:12` already flags Issue 30/31 iron order |
| 4.5 | CANON (minor) | `docs/manga/backstory/sela.md:128` | Burr, "long-bodied, grey-brown, sail-like ears"; `:128` "The hound Silt rides is what is left of Burr" | The locked hound sheet is "ash-grey rough fur ... torn ears" (`STYLE.md:25`, `TEST_CHECKLIST.md:207`); `villains.md:122` says "lean, long-jawed, grey-brindled". If the hound is Burr, one coat colour has to win |
| 4.6 | CANON (minor) | `docs/manga/backstory/villains.md:13` | Vasch "saw the pulse in it" | `SERIES_BIBLE.md:29` "Oren Brask ... surveyed the Drift and found the pulse" |
| 4.7 | CANON (minor) | `shared/games.js:39` | "Ione goes back to the dead lab she helped build" | `ione.md:25` she was posted to the Glass Ward at 21 "as keeper of its records"; `SERIES_BIBLE.md:136` "a dead lab where the Director's first experiments are". She wrote the procedure (`stories.js:63`), not the building |
| 4.8 | DRIFT | `docs/manga/backstory/ione.md:33` | "woke with a whole ice-blue hexagon on the back of her left hand" | Same file `:6` and `CAST.md:77`: left wrist |
| 4.9 | DRIFT | `docs/manga/backstory/kaito.md:6` | "white lock in front of the right ear" | `CAST.md:20` gives no side; `cast.js:10` comment agrees (right). Not a clash, but the side lives only in a dossier and a code comment, not in CAST |
| 4.10 | DRIFT | `docs/manga/backstory/juno.md:8` | "braid over her left shoulder" listed under "Fixed facts (do not change)" | `CAST.md:42` "one thick braid over her shoulder" (no side); `TEST_CHECKLIST.md:188` (R1) agrees left. Same note as 4.9 |
| 4.11 | DRIFT | `docs/manga/backstory/kaito.md:119` vs `silas.md:111-124` | Hush is "her" ("cannot hear her coming") | Hush is "it" throughout `silas.md`; `CAST.md:58` uses no pronoun |
| 4.12 | DRIFT | `shared/games.js:26` | Gaptooth Reach: "two floating islands grinding past each other" | `SERIES_BIBLE.md:106` and `world.md:60` "two island chains" |

Checked and matching CAST.md: every age, name, role and partner in `shared/crew.js:4-16`; `hub.js` crew card fields; the six island names in `shared/games.js` against `FRIDAY_BATCH.md:25-32`; the arc names in `manga/common.js:7-16` against `SERIES_BIBLE.md:91-149`; `shared/kit/cast.js` heights (178, 175, 165, 183, 198, 168, 188, 193, 180) against `CAST.md`; Krell and Maro in `tencount.md:69,105` against `cast.js:37-39,51-53`; pal names and one-line looks in `shared/pals.js:137-148` against `FRIDAY_BATCH.md:58-70`; the story cards in `shared/stories.js` against CAST voices and the bible (Order 12, the bear, the letter, the missing line); dossier "fixed facts" blocks for Kaito, Sela, Juno, Silas, Bram, Ione against CAST.md (hair, eyes, outfit, mark position, height) all agree, including the accepted sheet flaws (`STYLE.md:9-25`).

## 5. Dossiers against each other

### 5.1 The eleven freed monsters
- `shared/stories.js:57`: "Eleven monsters out of Empire pens, the night I stopped pretending I only did it for money."
- `SERIES_BIBLE.md:112`: "Silas let eleven caged monsters out of a Sever pen for no one." (Issue 15.)
- `silas.md:42-44`: "the Sever's cutter-ship ties up at Tallow Dock to collect a lot of eleven partners, four of them brokered by Silas ... He cuts eleven locks" from "Maro's holding pens at Tallow Dock" (`:26`), on the night of Issue 15, Silas 24 (`:21`).
- `tencount.md:83`: Maro "51: the night of the eleven. 52: Issue 15."; `:85` "Fifty-one: eleven empty cages, the pen stopping, then writing their names anyway."
- **DRIFT 5.1a**: whose pens (Empire / Sever / Maro's) is told three ways. **DRIFT 5.1b**: tencount puts the night at Maro 51, before Issue 15; silas.md and the bible make it Issue 15's last page. **DRIFT 5.1c**: `tencount.md:83` "48: takes on Silas (21)" vs `silas.md:13-18` (messenger for the house at 14, employed at 17, Lanternreach at 18) and the arithmetic (Maro 52 − 48 = 4 years ago, when Silas was 20). **DRIFT 5.1d**: `silas.md:39` Lucan Ash "never once looked at Silas ... does not remember him" vs `tencount.md:173` "Silas: his vulgar mirror; he can't stop watching."
- Note: `kaito.md:125` 'Silt's "eleven islands"' is Storm Run's eleven, a different eleven; two "elevens" in one world invite confusion.

### 5.2 Hekka's stripping
- `CAST.md:102`: "She stripped it herself to prove her loyalty."
- `stories.js:63` (Ione): "She walked into my lab with the bear at her heel, put the cutter in my hand, thought better of it, and took it back. Then she did it herself, standing up. It took the full count of ten."
- `ione.md:26`: at Ione 22, "Captain Hekka Dorn (then 29) walks into her lab ... does it herself, standing, by Ione's procedure." (Four years ago.)
- `villains.md:52`: "At 30 Vasch told her the cost would reach her heart in two years and, the same week, offered her a Sever captaincy ... She walked into Ione's lab"; `:5` timeline "3 Hekka strips Mallow, Ione's half-cut" (three years ago, the same year as Ione's cut at 23).
- `SERIES_BIBLE.md:107`: told by Hekka herself in Issue 12. `villains.md:74`: "She stripped Mallow herself, unordered (Issue 12)."
- **DRIFT 5.2**: Hekka 29 vs 30, and a year apart from Ione's own cut (ione.md) vs the same year (villains.md). The events agree; the dates do not. The bear's name Mallow exists only in `villains.md`.

### 5.3 Otti's partner Merrow
- `SERIES_BIBLE.md:44`: "Her partner was stripped; she keeps its empty harness"; `:121` "her partner **Merrow** whom the Sever cut."
- `allies.md:9`: bonded at 19 to Merrow, "a gale-skate (wide grey wing-finned glider, Wind)"; "Raced at 24 (fourth), won at 31, 38 and 45"; cut when she was 49.
- Consistent, and the wins fit the seven-year Regatta (`SERIES_BIBLE.md:119`): 28, 21, 14 and 7 years ago.
- **DRIFT 5.3a**: `bram.md:125` "37 (thirty years ago): builds the racing hull that wins Otti Ferro (then 22) her first Regatta" vs `allies.md:9` first race at 24 (fourth), first win at 31. Thirty years ago is not a Regatta year on the seven-year cycle; 28 is.
- **DRIFT 5.3b**: `sela.md:24` "Age 25 ... One short, loud Regatta-season affair with Marisol Thane" is three years ago; the Regattas fall seven and fourteen years ago.
- **DRIFT 5.3c**: `allies.md:9` gives Merrow the element Wind, which `CAST.md:11` reserves for Hush ("One per lead, so no two partners overlap"); `world.md:31` reconciles this as "the labs count six ... the sea has more", which the bible has not said.

### 5.4 Oren's survey
- `SERIES_BIBLE.md:29`: Oren "surveyed the Drift and found the pulse. He left when Kaito was small ... Vasch sited the pylons with Oren's survey."
- `kaito.md:72`: "Oren found the pulse in the Tull well-ledgers"; `:73` "the survey office summoned him with the sheets ... he went up the point that night to bury the master sheets under the cairn ... At dawn an Empire cutter was in the harbour. He went with it so it would leave without searching the house."
- `allies.md:210`: "Vasch, then 31, had sent men for the survey. Oren went with them so the family wouldn't be taken"; `:214` "The first pulse on his instruments."
- `villains.md:13`: "At 36 Oren Brask's survey reached him from the Admiralty archive and he saw the pulse in it." (Ten years ago; Oren left fifteen years ago, `villains.md:5`.)
- **DRIFT 5.4**: where the pulse was found (ledgers / instruments / by Vasch in the archive), who came for Oren (an Empire cutter / Vasch's men), and when Vasch got the survey (the night Oren left / five years later). `world.md:114` already lists "Vasch's age at Oren's survey (36 / 31)".

### 5.5 The Cantors and Corin Vale
- **DRIFT 5.5a** (kin): `allies.md:136` Kell is "Great-aunt of Corin Vale"; `villains.md:89` "Taught ... by Mother Kell, no kin." (`world.md:114` lists it.)
- **DRIFT 5.5b** (when he left, who was captain): `sela.md:124` "Corin left at 17 and shipped as a deckhand under no name"; `:20` he was first mate under Captain Hesper Lund when Sela joined at 19; `:21` Sela became captain at 20. `villains.md:91` "At 20 he signed onto the Gullwake as a hand under its 19-year-old captain, Sela Vey"; `allies.md:136` "at 20 he left [Cantor Isle] to crew for a silver-haired girl of 19"; `allies.md:96` Marisol "saw Sela at 19 ... with a first mate on deck". The bible (`:31`) says only "Sela's first mate and lover eight years ago."
- **DRIFT 5.5c** ("pup"): `sela.md:126` "he called her that while teaching her, and she stole the word and used it on him"; `villains.md:91` "called her nothing, and she called him pup." Bible `:33`: "It was her name for Corin. She got it from him."
- **DRIFT 5.5d** (Burr): `sela.md:128` "a Cantor song-hound, long-bodied, grey-brown, sail-like ears"; `villains.md:91,122` "a knell-hound pup found under the Cantor bell-house ... lean, long-jawed, grey-brindled ... element Echo", bonded when Corin was 16. (`world.md:114` lists knell/song.)
- **DRIFT 5.5e** (Vasch finds him): `villains.md:91` "At 22 Vasch found him on a Lanternreach pier" (`:5` "7 Vasch finds Corin"); `tencount.md:155` Lucan at 27 "sent to a Cantor dock for Corin Vale (21), who sits with a hound and does not draw" (eight years ago); `:175` "He brought Corin Vale to Vasch."
- Consistent across files: Cantor Isle emptied as charts replaced singers; the Sever took its last partners six years ago (`allies.md:138`, `world.md:21`); Kell 71, blind; "names are what we pay"; Corin 29 and 21 at the Surge (`sela.md:124`, `villains.md:91`, bible `:31`).

### 5.6 Other dossier-vs-dossier clashes
| # | Sev | A | B |
|---|---|---|---|
| 5.6a | DRIFT | `bram.md:21` the first pinning was "the harbour island of Lowmoor"; `:33` "The harbour wall at Lowmoor" | `villains.md:5` "9 first pinning (Tallis Bank; Bram's ship)" (`world.md:114` lists it) |
| 5.6b | DRIFT | `villains.md:11` Vasch born on "Lowmark, a hospital island in the inner ring" | `allies.md:7` Otti born on "Lowmark Shoals, a kelp-cutting island of long sea walls"; `:9` "At 49 the Sever took Lowmark's partners". Two different islands under one name (plus Lowmoor and Lowmass Skerry, `tencount.md:9`) |
| 5.6c | DRIFT | `bram.md:119` Tam "Widowed at 30: her husband **Joss Reed**, a caulker, fell from a scaffold" | `allies.md:31` "Wife **Hesper**, sailmaker, died of fever when Tam was 55" |
| 5.6d | DRIFT | `bram.md:169` Tam's one rude word, "Suggested ... 'Bastards.'" | `allies.md:41` "'Bollocks.' (Issue 32, her last word.)" |
| 5.6e | DRIFT | `bram.md:144` Tam calls Kaito "the shouting one", Silas "that shirt" | `allies.md:43` "the loud one", "the shirt" |
| 5.6f | DRIFT | `juno.md:24,29` Nim was "her partner in crime from 17 to 19", before the stake at 19 | `allies.md:162` "Met Juno when she was 19 (he 26): two years of a rigged dice table to pay her marker faster" (19 to 21, after the stake) |
| 5.6g | DRIFT | `ione.md:24` joins the labs at 20 (six years ago) | `villains.md:5` "5 Ione joins the labs" (`world.md:114` lists it) |
| 5.6h | DRIFT | `tencount.md:3` "count-names came with the Great Pylon plan (Issue 25)" | Same file dates the seats years back: Sorrel "41 Two" (`:11`), Lucan "29: Six" (`:155`); `villains.md:52` Hekka "At 31 she took the Seventh seat", `:91` Silt "Nine of the Ten Count by 27" |
| 5.6i | DRIFT | `bram.md:21` the Empire "drives its first-ever anchor pylon" nine years ago | `villains.md:136` Meridian "the first island anchored by ordinary pylons forty years ago"; `world.md:48` patches it ("the Empire says 'anchored for forty years'; old Admiralty charts show it was simply the slowest island") |
| 5.6j | DRIFT | `ione.md:47` "Doctor Pike held her shoulders" | `tencount.md:119` Pike "holds the clock for Ione (23) ... Pike is reaching for the cutter". Small, but the Issue 36/37 writer will draw one of them |
| 5.6k | DRIFT | `WRITER_HANDOFFS.md:18` "Issue 36's flashback shows Prism stopping the count, which backstory/ione.md saves for Issue 37" | `ione.md:96` "Issue 37: it was Prism that stopped the count." Still open |

### 5.7 Name collisions (one name, two people)
All DRIFT; none is marked as deliberate.
- **Maren** ×3: Kaito's mother Maren Brask, born Tull (`kaito.md:14`); Ione's mother Maren Raske (`ione.md:12`); Silt's mother Maren Vale (`villains.md:89`).
- **Teodor** ×2: Silas's father Teodor Moreau (`silas.md:9`); Ione's father Teodor Raske (`ione.md:11`).
- **Odile** ×2: Silas's mother Odile Moreau (`silas.md:9`); Maro's wife Odile (`tencount.md:81`).
- **Hesper** ×2: Captain Hesper Lund (`sela.md:20`, `world.md:80`); Tam's wife Hesper (`allies.md:31`).
- **Marit** ×2: Sela's sister Marit Vey (`sela.md:12`); Marit Sund, the reed-fisher (`silas.md:49`).
- **Tull** ×2: the Tull well-keepers (`kaito.md:14-15`); Vasch's aide Mr. Tull (`WRITER_HANDOFFS.md:54`, Issue 5).
- **Hobb / Hob** ×3: Auntie Hobb (`silas.md:17`); Hobb Varley, Keelbreak foreman (`WRITER_HANDOFFS.md:14`); Hob Tarrow, the stripped farmer (`WRITER_HANDOFFS.md:39`).
- **Hale** ×2: Regent Emeric Hale and Ostler Hale (`villains.md:140` notes it: "no relation ... writers should not imply kinship").

## 6. Hard rules

- 6.1 **HARD** (rule 3, original only): "Ten Count" (see worst #1). Six places; the one readers see is `manga/catalog.js:247`.
- 6.2 Rule 3 adjacent, graded STALE: the old pal names Cinderbun and Glimmick, renamed on 2026-11-07 as too close to Pokémon names (`DECISIONS.md:677`), remain in `FRIDAY_BATCH.md:41,50`, `world.md:100,106,107`, `PROVISIONAL.md:583,1225,1299-1313` and `anime/episodes/ep-09.md:205` (outside the list).
- Checked and clean against rules 1, 2, 4, 6 and 7 of `SERIES_BIBLE.md:5-12`: every named person in the ten dossiers has a stated age of 21 or more today; every childhood memory is marked plain/sad/spoken-only; no fan service is placed near a Pal, a child, or anyone hurt or held; the fan-service wardrobe lists stay at outfits, steam and cutaways. `juno.md:5` and `bram.md:3` are stricter than the bible (never drawn under 21/22), which is allowed.

## 7. Noticed, not touched (outside the file list)
- `docs/STEP3_PLAN.md:11` "Not done ... merging to main, pointing the free link at main" and `:41` old section names: the plan reads as current but is finished.
- `docs/manga/FRIDAY_PLAN.md:36` proposes "a `anime/index.html` list"; the site built `anime.html` instead.
- `games/hold-the-deck/art/REQUEST.md:10` still points at `C:\Users\Dylan\Documents\driftbound-villains\art\refs\`.
- `anime/episodes/ep-09.md:205` "[EYECATCH: a Cinderbun ...]" uses the old pal name.
- `WRITER_HANDOFFS.md:19` pairs Kell's "six years" (the Sever on Cantor Isle, `allies.md:138`) with Ione's "Day 1,106 since five" (her own cut, three years ago) as one Glass Ward date; they are two different events, and both fit the dossiers.

## 8. What was not checked, and why
- The 51 issue scripts in `manga/issues/` and the 20 episode scripts in `anime/episodes/`: not in the list; only `manga/catalog.js` (their generated covers and blurbs) was read.
- Pixel colours on the locked sheets: `STYLE.md` and `TEST_CHECKLIST.md` were taken as the record of what each sheet shows; no image was opened.
- `docs/DECISIONS.md` and `docs/STEP3_PLAN.md`: read only where a grep hit them.
- `docs/PROVISIONAL.md`: grepped for names and section words, not read in full (1,453 generated lines).
