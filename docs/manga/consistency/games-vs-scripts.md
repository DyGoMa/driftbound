# Games vs manga and anime: continuity check (2026-11-07)

Read-only pass over the six games, the shared site data, `docs/CAST.md`, `docs/FRIDAY_BATCH.md`, `docs/WORLD_BIBLE.md`, `docs/manga/SERIES_BIBLE.md` (sections 3, 4, 5, 8, 9, 10), `docs/manga/WRITER_HANDOFFS.md`, the matching manga issues (Storm Run 1-5, Tide Gap 11-13, Hot Hand 6-9, Silent Cut 15-18, Hold the Deck 28-32, Split Light 33-37) and anime episodes 1-20. Line numbers are from the files as they stand on `main` today. Quotes are word for word; `[...]` marks a cut.

Severity scale: **HARD** breaks a hard rule / **CANON** contradicts canon / **DRIFT** wording drift / **STYLE** style.

## Summary

**45 items: 1 HARD, 25 CANON, 11 DRIFT, 8 STYLE.** Plus 13 things the games establish that the manga never uses, 14 things the manga establishes that a game contradicts by leaving out, and 4 script-vs-CAST slips noticed on the way (not the games' fault).

The five worst:
1. **The whole crew is aboard in every game.** Juno, Silas and Ione talk on Pinhold (Storm Run), Ione and Silas talk at Gaptooth and are written into Sela's logbook ("You have known for two years"), Juno is already crew and bringing home "the keel money" during the Ashmarket raid, Ione talks through Lanternreach and the Keelbreak siege. In the manga Juno signs on in Issue 10, Silas in Issue 19 and Ione arrives on the last page of Issue 32. (A1, B2, C1, C2, D6, E5)
2. **Hold the Deck kills Hekka's bear and has her walk away without the chain**, and makes Grist the Sever's target. In Issues 31-32 the order is the keel, the bear lives, and Hekka leads it off by hand: "Come on. You don't know me. Come on anyway." (E1, E2, E3)
3. **Tide Gap gives Hekka all of Sela's old logbooks** ("twelve volumes", "Page forty, Vey"). In Issue 12 Hekka knows Sela's cost from "File says"; the logbooks are a trunk in Sela's own cabin (Issues 13-14). (B1)
4. **Silent Cut rewrites the eleven and burns the ledger.** In the game the eleven are cargos Silas carried for Maro, named in a book the Sever wants to buy, and Hush burns it. In Issues 15-18 the eleven are caged beasts Silas set free from a Sever pen (which is why he owes Maro "eleven head"), and Maro has three copies and knows the book by heart. The site's own story card agrees with the manga. Silas is also living in Lanternreach when the crew arrives, not returning "a year gone". (D1, D2, D3)
5. **Storm Run has several pylons on Pinhold ("Pylon Four", "the last pylon") and ends with the Gullwake holding "the Empire's own survey chart: every island the Empire means to pin next".** The manga has one Great Pylon per island and the pylon sites are the series' central secret, found by Kaito in Issue 35. (A2, A3)

Also high on the list: Vesh is "he" in the games and "she" in every script (B3); Vasch's reason for stopping at five is different (F1); Krell's voice is the opposite of the bible's (C3); two pals carry old names in the manga (G1).

---

## A. Storm Run vs Issues 1-5, Episodes 1-5

**A1. CANON. Juno, Ione and Silas are on the run.**
Game: `games/storm-run/words.js` L11 `juno` "Ten salvage says he's yelling before the first checkpoint."; L18 `ione` "The barricades in the yard are taller than your legs."; L21 `silas` "Pace yourself, darling."; L37, L47-48, L62-63 likewise.
Script: Issues 1-5 contain zero lines for `juno`, `silas` or `ione` (speaker count over `manga/issues/issue-01.js` to `issue-05.js`); Episodes 1-5 cast lists name none of them. `SERIES_BIBLE.md` L103 Juno "wins" a place on the crew in Issue 10; L116 Silas joins in Issue 19; L133 Ione arrives at the end of Issue 32.

**A2. CANON. Pinhold has several pylons.**
Game: `words.js` L34 stage name `'Pylon Four'`; L36 `sela` "get off that rock before the last pylon bites home."; `shared/games.js` L23 "nailed in place by giant steel pylons and chains".
Script: `manga/issues/issue-01.js` L988 "The Great Pylon blazes on the ridge, a mile high"; `issue-05.js` L96 "Pinhold with the Great Pylon at its heart"; `SERIES_BIBLE.md` L21 "ten Great Pylons, each planted on a chosen island". One pylon per island, and only ten in the world.

**A3. CANON. The stolen chart is the Empire's list of pinning sites.**
Game: `words.js` L4 tagline "Run it, steal the chart"; L9 `sela` "take the survey chart from the tower"; L66 `sela` "now we know where they're pinning next."; L68 ending card "the Gullwake now holds the Empire's own survey chart: every island the Empire means to pin next." `NOTES.md` L139 lists this as the story call.
Script: `issue-01.js` L468 `sela` "I want old Imperial survey sheets. From before the pylons."; L772 the sheets are Oren's, in a tin in Kaito's own tower ("a stack of yellowed Imperial survey sheets, soft with age [...] No name is legible anywhere."). `SERIES_BIBLE.md` L25 "Kaito finds this in Issue 35 because of his dream". The game hands the crew in Issue 4's slot what the whole first part is built to withhold.

**A4. CANON. Silt has chased Kaito across eleven islands.**
Game: `words.js` L38 `silt` "I've followed the stink of that burnt arm across eleven islands."; L52, L93 again.
Script: `issue-04.js` L92 `kaito` "Four years I've been running this roof!"; `issue-02.js` L743 "Pinhold's mine."; `WRITER_HANDOFFS.md` L28 "A teal ink trail led Silt to Kaito." Kaito has never left Pinhold; Silt found him there.

**A5. CANON. Silt's mask cracks at Pinhold.**
Game: `words.js` L68 ending card "Silt got away with a cracked mask."
Script: `issue-04.js` L562 what cracks is the hound's core ("The white glass core with one black crack across it"); L583 "Nothing about him has changed."; `SERIES_BIBLE.md` L156 the mask is cracked only in Issue 48.

**A6. DRIFT. "Pup" before the run.**
Game: `words.js` L9 `sela` "No heroics, pup." (stage 1); L23.
Script: `issue-04.js` L656 `sela` "Pup." is the first time, after Silt has gone (`WRITER_HANDOFFS.md` L44). The game's run is the Issue 4 run.

Agreement worth keeping: Episode 4 adopted the game's Silt lines word for word (`anime/episodes/ep-04.md` L414 "Run, then. It's better when you run.", L430-438 "Good. Again." / "You're burning that arm for one dog." / "I admire the waste.", L484 "Keep that arm warm for me, Brask."). The numb arm is 5 s in play by Dylan's answer (`tuning.js` L140) and the ending keeps "numb for days" (`words.js` L62), as `FRIDAY_BATCH.md` L35 asks.

## B. Tide Gap vs Issues 11-13, Episodes 11-13

**B1. CANON. Hekka has Sela's old logbooks.**
Game: `games/tide-gap/words.js` L72 `hekka` "I have all your old logbooks, you know."; L78 "I have twelve volumes."; L64 "Page forty, Vey. 'Stay left in the Slip.'"; L60 `sela` "Somebody's got hold of my old logs."; `ending.js` L242 `hekka` "Keep your book, Vey. Next time I'll read it to you."
Script: `manga/issues/issue-12.js` L368 `hekka` "File says you go deep, you pay in what you know. How much is left?"; `issue-13.js` L740 "The Captain owns a trunk full of herself"; `issue-14.js` L245 "A sea trunk lies open in the middle of the floor, packed with logbooks: dozens, spines numbered in her hand". Nothing has been stolen.

**B2. CANON. The logbook remembers Silas and Ione.**
Game: `games/tide-gap/memory.js` L10 "Silas owes me for a blue coat. He says he doesn't."; L22-23 "Ione checks my pulse while I sleep. I let her." / `ione` "You have known for two years."; `words.js` L158 Spare Logbook "A copy in Ione's hand."; Ione on the radio L20, L29, L51, L57, L80; Silas L30, L37, L65, L92, L103.
Script: Issues 11-13 have no `silas` or `ione` lines; `ep-14.md` L4 "Silas Moreau (24, new this episode, final scene only)"; `SERIES_BIBLE.md` L133 Ione arrives in Issue 32. "Two years" is impossible: the Gap is about twenty issues before she steps aboard.

**B3. CANON. Vesh's sex.**
Game: `words.js` L46 "the lamps along his back come on"; `memory.js` L30 "Vesh fit in a bait bucket once. I sang him to sleep."; `ending.js` L263 "He keeps looking back at me", L266 "Sing to him anyway."
Script: `issue-04.js` L391 "Vesh lowers her head to the pier"; `issue-13.js` L116 "Vesh pours over the edge like a river and takes the light with her."; anime: 4 "her", 0 "his". `docs/CAST.md` L36 gives no pronoun, so the scripts are the only ruling.

**B4. STYLE. One line per Dive against one year per Dive.**
Game: `memory.js` L3 "a Dive loses a line 'for good'"; six Dives, six lines. Script: `issue-14.js` L326 `kaito` "And the year? The one that's gone?"; `ep-14.md` L101 "It took a whole year off you". The game's version is the approved spec (`FRIDAY_BATCH.md` L38); listed so nobody reads the game as the scale of the cost.

**B5. DRIFT. The pup memory.**
Game: `memory.js` L26 "Kaito, first night aboard: sick on my boots. Called him pup."
Script: `issue-02.js` L683 first night is a hammock offer and no "pup"; the word first comes in `issue-04.js` L656.

**B6. STYLE. Sela says "darling".**
Game: `words.js` L73 `sela` "Hekka, darling. Still wearing your divorce on your ribs?"
Script: `SERIES_BIBLE.md` L61 "darling" is Silas's marker; Sela uses it once in all 51 issues, mimicking him (`issue-18.js` L360 "Lock's on the left, darling.").

**B9. STYLE. Spare copies and found pages soften "costs stay paid".**
Game: `words.js` L158 "Each level, one copy per run burns before a real line."; `memory.js` L98 a found page fills a blank row. Script: `SERIES_BIBLE.md` L34 "costs stay paid"; `issue-36.js` L398 `vasch` "I can't give one back. Nobody can; that bill is paid." `memory.js` L3 reconciles it (the page is a different line she forgot writing); the Spare Logbook is spec. Listed as a tone risk only.

Agreement: Hekka's cutter sinks in both (`words.js` L87; `issue-13.js` L516 "Hekka on her sinking cutter"); the ring scar, the count of ten standing up, and Hekka's "I only had to lose once" match `issue-12.js` L446 and `issue-32.js` L438.

## C. Hot Hand vs Issues 6-9, Episodes 6-9

**C1. CANON. Juno is already crew.**
Game: `games/hot-hand/words.js` L11 `sela` "You said ten minutes, Juno. The ship has been waiting an hour."; L12 `juno` "Tell Bram I'm bringing home the keel money".
Script: Juno meets the crew by beating Kaito at cards (`issue-06.js`); `issue-10.js` L913 Sela's log "J. Calloway signed on. Cheated the deckhand, took his bunk, opened a book on him. One day."; `SERIES_BIBLE.md` L103.

**C2. CANON. Ione and Silas talk through Ashmarket.**
Game: `words.js` L20 `ione` "Your temperature concerns me."; L30 `silas` "Ah, the Long Table."; L43 `ione` "I wrote that page of the manual."; L53-54, L61, L71-77, L86, L88, L93, L95, L101, L104.
Script: no `ione` or `silas` in Issues 6-9 or Episodes 6-9 (speaker counts). Juno has not met either.

**C3. CANON (voice). Krell is a bored clerk, not a drill sergeant.**
Game: `words.js` L57 `krell` "Get up, or don't. I have a form for both."; L58 "Everyone burns out, Calloway. I just keep the records."; L144 "Noted."; L145 "That's a fine. You'll pay it."; `NOTES.md` L293 "Krell's voice: a bored jailer who counts people like stock [...] He had no voice on paper."
Script: `SERIES_BIBLE.md` L65 "Krell: drill-sergeant bluster."; `issue-06.js` L815 `krell` "ON YOUR FEET, YOU DEGENERATES! THAT'S AN IMPERIAL SHIELD LINE AND IT DOES NOT WIPE ITS BOOTS!"; `issue-09.js` L872 "FALL BACK! That is NOT a retreat!"; `ep-09.md` L334 "(through his teeth, drill-sergeant even now)". He did have a voice on paper; the game's is the one the bible gave Maro.

**C4. DRIFT. Krell's face.**
Game: `shared/kit/cast.js` L105-107 helmet, `visor: false`, heavy brow, no moustache; `games/hot-hand/NOTES.md` L366 his sheet is Claude's working one, L378 the portrait "reads a little angrier than the 'bored' asked for".
Script: `ep-09.md` L33 "brush moustache, red drill-sergeant face"; `issue-09.js` L813 "heavy brow, open-faced grey helmet". Not checked against the picture itself.

**C5. DRIFT. Heat in two scales.**
Game: `words.js` L20 "Past forty-one degrees"; L101 "Forty-two degrees." (Celsius). Script: `issue-09.js` L986 `cap` "Heat: 107." (Fahrenheit; 107 F is 41.7 C). Same fever, two thermometers.

**C7. STYLE. "Sparky".**
Game: `words.js` L23 `juno` "Ten says you cry when I do, Sparky."; L70. Script: Juno's word is "sweetheart" (133 lines); nobody calls Kaito Sparky but Old Tam, once (`issue-29.js` L372).

Agreement: Krell survives both (`words.js` L66 "Count's... off."; `issue-09.js` L873 "I'll be back with more shields"); gloves off and scarred palms match `issue-08.js` L980; Juno quotes odds throughout.

## D. Silent Cut vs Issues 15-18, Episodes 15-18

**D1. CANON. What the eleven are.**
Game: `games/silent-cut/words.js` L13 `silas` "Maro kept a ledger, Captain. Every cargo I ever ran. Eleven of those cargos had teeth, and now the Sever wants to buy the book."; L40 "Eleven partners, and every captain who carried them."; L72 "Eleven names go up"; L80 ending card "Eleven partners and every captain who carried them are off the books."
Script: `issue-15.js` L594 `cap` "Eleven lots. For collection at the dead hour." (a Sever pen), L752 "eleven locks burst at the same instant"; `issue-16.js` L76 `kaito` "Eleven cages in a Sever pen, you opened every one. WHY?"; `issue-17.js` L440 `maro` "What I don't have, Captain, is eleven head. The Sever paid for them. I am short."; `ep-17.md` L98 "So I opened them. All eleven." The site's own card agrees with the manga: `shared/stories.js` L57 "Eleven monsters out of Empire pens, the night I stopped pretending I only did it for money." Silent Cut contradicts both.

**D2. CANON. Silas's timeline (and the script side of it is HARD).**
Game: `words.js` L18 `silas` "A year gone, and they still haven't fixed that bottom step."; L44 `maro` "Two years I paid you"; L69 "a line ready for me for a whole year"; L12 `sela` sends him from the ship. `NOTES.md` L185: "a year gone, two years paid, so 24 - 1 - 2 = 21 when he started, and no reading of the script has him under 21."
Script: Silas is a Lanternreach resident when the crew docks (`issue-15.js` L26; `SERIES_BIBLE.md` L112); `issue-17.js` L107 `cap` "Four years ago." over L105 "Silas (20 here, 24 now; [...])"; L215 "Three years of fours and sixes."; `ep-17.md` L4 "Silas (24; seen at 20 in flashback)". The game fixed his start to 21 to keep hard rule 1 (`WORLD_BIBLE.md` L6, `SERIES_BIBLE.md` L6 "Stated ages 21+"); the manga and anime show him at 20. **That is the one HARD item in this report**, and it sits on the script side. (Also `issue-36.js` L596 "Ione (20)" in a flashback captioned "Meridian. Six years ago.")

**D3. CANON. The ledger burns.**
Game: `words.js` L72 `hush` "The lamp tips over. Eleven names go up, and every captain's with them."; L80 "THE BOOK IS ASHES".
Script: `issue-17.js` L425 `maro` "I have a copy. I have three. I'm a careful man, Captain Vey."; `issue-18.js` L484 "Take it. I know it by heart."; L697 "A clean page, Hobb. Numbers are patient." Burning it would change nothing, and Maro says so.

**D4. DRIFT (voice). Maro shouts.**
Game: `words.js` L169 `maro` "Ow! You little shit! That was my good coat! Guards!"; L62 "Again? Do. I charge by the hour."
Script: `SERIES_BIBLE.md` L65 "Maro: tallies people as numbers, polite."; `issue-18.js` L485 "Numbers are patient, Silas." He never raises his voice in 102 lines.

**D5. DRIFT. The slate.**
Game: `words.js` L78 "(He takes the chalk from Bram's galley slate, and writes slowly, with a flourish.) MISS ME, DARLINGS?"
Script: `issue-18.js` L575 he wipes "LOT 6" off a pen slate; `SERIES_BIBLE.md` L115 "he writes on a slate: 'Darling, I was never going to' and rubs it out." Same device, opposite note: the manga's is the gut punch, the game's is the gag.

**D6. CANON. Ione talks him through it.**
Game: `words.js` L21 `ione` "Every Surge pulls breath through the bond."; L86, L97, L105, L137, L144, L148.
Script: no `ione` in Issues 15-18 or Episodes 15-18; she arrives in Issue 32.

Agreement: Maro's look (`shared/kit/cast.js` L119-121 stout, balding, plum coat, gold belt) matches `issue-15.js` L263 "stout, balding, plum coat, white collar, gold belt, half-moon spectacles"; Silas's rasp, Hush's silence, "...", and "Days, not hours" all hold; the duke's wife in a crate (`words.js` L33) was taken up by `ep-17.md` L19.

## E. Hold the Deck vs Issues 28-32

**E1. CANON. The bear dies and the chain stays.**
Game: `games/hold-the-deck/words-boss.js` L216 `bram` "It's done, love. Let it lie."; `words.js` L108-109 `kaito` "there's a full bowl out on the deck, by the big bear." / `bram` "That one's not for you."; L114 ending card "Hekka Dorn took her troopers home and left the chain behind. Bram kept it."
Script: `issue-32.js` L78 `hekka` "HEEL! Heel, damn you..."; L85 "There. Eat, then. Eat."; L452 "Hekka at the hole, feeding the chain through her fists, a lump of meat held out over the hold. The bear's great head comes up through the splintered deck"; L454 `hekka` "Come on. You don't know me. Come on anyway." She leaves with it, on the chain.

**E2. CANON. What the Sever came for.**
Game: `words.js` L57 `hekka` "Torvald. Give me the beetle and you keep your ship. I'd hate to scrap a good cook."; L89 "Keep your beetle, Torvald. [...] I'll collect him for free."; `NOTES.md` L179 "Sever after Grist".
Script: `issue-31.js` L368 `hekka` "I brought what I was sent with. Order's the keel. Ship never sails again, a crew's just a crowd on a dock."; L6 the bear is "going for the keel"; `issue-36.js` L181 `vasch` "I sent Captain Dorn for the ship."

**E3. CANON. "Cut the chain."**
Game: `words-boss.js` L208 `hekka` "Cut the chain. Let it go."
Script: `issue-31.js` L345-346 `hekka` "Then it stops coming to the hand at all." / "Coming to the hand is all it kept. I'm not taking that off it as well."

**E4. CANON. How far the iron has gone when the siege starts.**
Game: `NOTES.md` L29 "left shoulder and forearm at the start (the sheet's base state) [...] stage 1 starts clean"; `art/REQUEST.md` L24 "Iron: the sheet's base state only, left shoulder and left forearm".
Script: `issue-28.js` L671 (before the siege) "The grey has spread: left arm from fingers to shoulder, across the collarbone, down the left side of his ribs."; `issue-30.js` L8 "the left side of him grey iron to the collar". By Keelbreak the base state is long gone.

**E5. CANON. Ione on the radio during the siege.**
Game: `words.js` L27 `ione` "Bond-cutters on lines."; L29, L72, L79, L95, L99, L103, L127-148, L157; `words-boss.js` L201, L205, L212-213.
Script: `ione` appears 5 times in Issues 28-32, all on the last page of Issue 32 (`SERIES_BIBLE.md` L133 "End: Ione arrives on the deck, hands up"). Nobody aboard has met her.

**E6. DRIFT. The tonic pulls iron back.**
Game: `words.js` L157 "Ione's Tonic [...] Iron back ${n}%."; L161 `ione` "that's the iron flaking off."; `tuning.js` L121 `tonicIron: 0.06`.
Script: `docs/CAST.md` L71 "the iron never fully goes away"; `issue-31.js` L601 `hekka` "Torvald. That doesn't come back." The spec allows "pull back the iron a little" (`FRIDAY_BATCH.md` L47); the tonic is also attributed to Ione, see E5.

**E7. STYLE. Silas's third husband.**
Game: `words.js` L34 `silas` "They throw like my third husband." New fact: three marriages. Nothing in the bible or 51 issues gives Silas a husband.

Agreement: `words.js` L74 `hekka` "I did." (feeding the bear) and `words-boss.js` L209 `bram` "It doesn't know you any more, love." match `issue-31.js` L322; Hekka's "I paid mine in ten seconds. Standing up." (`issue-32.js` L438) is the Tide Gap boss line's twin.

## F. Split Light vs Issues 33-37

**F1. CANON. Why Vasch stopped at five.**
Game: `games/split-light/words.js` L25 `vasch` "You were taking notes, Doctor. Screaming, and taking notes, with your other hand. I wanted to see what you'd write."; L27 "I copied every page the night you ran. I only asked so you'd come home."; `NOTES.md` L214 lists this as a story call.
Script: `SERIES_BIBLE.md` L36 "Vasch stopped at five on Ione by accident."; `issue-37.js` L138 `vasch` "While you're asking. Ask her who stopped the count." (Prism, per `WRITER_HANDOFFS.md` L18 and `docs/manga/backstory/ione.md`). A deliberate stop undoes the spine's "half-cut bond lives and regrows" logic.

**F2. DRIFT. "Eleven years' work" in his arm.**
Game: `words.js` L23 `vasch` "Eleven years' work, in my own arm."; L98 `ione` "Eleven years' work. It cracks like anything else."
Script: `issue-36.js` L266 `vasch` "At thirty-three I built the first cutter and used it on myself."; he is 46 (`CAST.md` L94), so thirteen; L596 the glass forearm is already on him at 40.

**F3. CANON. How long the Ward has been dead.**
Game: `words-levels.js` L142 `sela` "Glass Ward. Dead two years".
Script: `issue-33.js` L417 `ione` "The Glass Ward. The Director's first laboratory. Dead for three years."; L928 "Day 1,106 since five."; `issue-34.js` L755 `kell` "Six years now." The handoffs (L19) already ask the register to pin 3 against 6; the game adds a third number.

**F4. CANON. How the Ward ends for Vasch.**
Game: `words.js` L30 `ione` "He left by the back with a broken arm."; L34 ending card "Director Vasch left by the back way with a cracked arm and a calm smile."
Script: `issue-37.js` L426 the glass hand closes on Kaito's fist, "He said you'd have his temper.", and it is the crew who get out in Issue 38 (`SERIES_BIBLE.md` L141 "They get out."). Vasch is the one who stays.

**F6. DRIFT. Ione has read Silas's letters.**
Game: `words-levels.js` L193 `ione` "I've also read your letters."; L194 `silas` "Those letters were private. ...Which one did you like best?"
Script: `SERIES_BIBLE.md` L154 "Ione's dry letters revealed as romance" is an Issue 46 beat; she has been aboard since Issue 33, four issues.

**F7. DRIFT. Juno and Kaito.**
Game: `words-levels.js` L221 `juno` "See that, Kaito? Patience. We talk about this sort of thing, you know."
Script: `SERIES_BIBLE.md` L145 their one fade-to-black is Issue 40, after the Ward; L73 "slow burn with a betting pool on it".

**F9. STYLE. Vasch keeps score.**
Game: `words.js` L110 `vasch` "Marked. See me after."; L113 "That's a point off your nerve."; L114 "Your hands are shaking. I can see them from here."
Script: `SERIES_BIBLE.md` L65 "Vasch: gentle, patient, 'mercy,' speaks like a good doctor. Never gloats." Borderline: `issue-36.js` L599 "Steady is kind, Doctor. Hesitation is cruelty. Again." is in the same teacher's register, so the game is on the edge rather than over it.

Agreement: "Five of ten" (`words.js` L8, L15) and the cracked hexagon match `issue-36.js` L306 "Three years, Ione. I learned it on you." and L725; the manga uses the site's letter card (`issue-36.js` L542 "He says the name the way his letter did."); "Count of three, Aurel" (`words.js` L120) matches his first name (`issue-36.js` L8).

## G. Shared site data and cross-cutting

**G1. CANON. Two pals carry their old names in the scripts.**
Site: `docs/FRIDAY_BATCH.md` L59 "Kindlekin (was Cinderbun, renamed 2026-11-07)", L65 "Prismule (was Glimmick, renamed 2026-11-07)"; `shared/pals.js` L141 `pal('cinderbun', 'Kindlekin', ...)`, L147 `pal('glimmick', 'Prismule', ...)`.
Script: "Glimmick" in `manga/issues/issue-34.js` to `issue-38.js` (e.g. L433 "Glimmick, the crystal snail from the grey rock"); "Cinderbun" in `issue-39.js`, `issue-40.js`, `issue-51.js` and `anime/episodes/ep-09.md` ("Cinderbun, a warm ember dumpling with tiny feet, asleep on Grist's anvil horn"). The looks match; the names were changed the day after the scripts were written. (The game words files only use `cinderbun`/`glimmick` as keys, `games/hot-hand/words.js` L183, `games/split-light/words.js` L124; the shown name comes from `pals.js`, so the games are fine.)

**G2. DRIFT (world). Radios and an intercom.**
Game: `games/hold-the-deck/words.js` L62 `sela` "I can hear you clanking over the radio, Bram."; `games/silent-cut/words.js` L73 `sela` "Gullwake to Silas. There's smoke over the warehouse."; `games/split-light/words-levels.js` L198 `ione` "Director Vasch. On the intercom."; every game's `radio:` lists have the crew talking to the lead in play.
Script: the words radio, intercom and wireless appear nowhere in 51 issues or 20 episodes; the Drift's long-distance word is paper (`SERIES_BIBLE.md` L123 "a telegram for the Director"; "telegraph" twice). The crew's running commentary is a game convention the scripts never adopted.

**G3. CANON. Why Sela says "pup".**
Site: `shared/stories.js` L47 `sela` "I call him pup because he hates it. I keep calling him pup because of the ears."
Script: `SERIES_BIBLE.md` L33 "Sela calls Kaito 'pup' and doesn't know why she likes the word. It was her name for Corin." The card gives her a reason the spine says she cannot have; a reader who meets the card first loses the Issue 19/41 payoff.

**G7. STYLE. Juno's jacket colour (site-internal).**
`shared/kit/cast.js` L88 `jacket: { color: '#5a6b3e' }` (olive) against `games/hot-hand/people.js` L6 "dark brown bomber, cream fur at the collar and cuffs [...] per her sheet (juno-sheet-v5.png)"; `CAST.md` L43 and `issue-06.js` L26 give no colour. Noted in `games/hot-hand/NOTES.md` L308 and L402.

**G9. STYLE. Sela's portrait skin (site-internal).**
`games/storm-run/NOTES.md` L168 "The crew portraits read a little orange on Sela's skin against CAST.md's 'dark brown skin'."; `shared/crew.js` L6-7 swaps in `sela-v3` for that reason. Not verified against the picture here.

Agreement: ages in `shared/crew.js` L4-16 (21, 28, 23, 24, 31, 26) and `shared/kit/cast.js` L70 (Krell 41, Maro 52) match `CAST.md` and every stated age in the scripts for the present day; islands and bosses in `shared/games.js` match `FRIDAY_BATCH.md` L27-32; the Sever symbol is "a straight line cutting a circle" / "black bar and white ring" in `CAST.md` L90, `games/tide-gap/cutter.js` L22, `games/hold-the-deck/portraits.js` L23-24, `shared/kit/speakers.js` L66-68 and across all 51 issues (Vasch's ring black in `issue-36.js` L96 as in `CAST.md` L96); Hekka's wavy black hair and ring scar are current everywhere; Standing Order 12 (`shared/stories.js` L61) is read word for word in Issue 3 and quoted in `issue-33.js` L214; Galley Rules, "I write everything down" and Bram's "lad" (22 manga lines) carry over.

## What the games establish that the manga never uses (free material)

1. Storm Run: the Pinhold stage names (The Pin Road, Chain Yard, Searchlight Row, Pylon Four, The Long Drop); Hollow swoopers (flying Hollows); Kaito's "I'm gonna rip that mask off and draw your ugly face on my map" (`words.js` L60). The "eleven islands" chase (A4) and the Empire's pinning chart (A3) are free in name only; they collide with canon.
2. Tide Gap: the Free Ports as the far side of the Reach (`words.js` L12, L87; the manga only says "the only way east", `issue-11.js` L6); the six logbook lines and eight found pages, including Sela winning the Gullwake at cards (`memory.js` L14) and her mother humming flat on purpose (`memory.js` L38; careful: the bible's hum belongs to the Cantors and Corin, `SERIES_BIBLE.md` L31); Vesh in a bait bucket; Hekka's "we'll talk about your mother" (`words.js` L119).
3. Hot Hand: Card Row, Dice Alley, the Long Table, the Pit, the Vault Steps (the manga's Ashmarket is Slag Row, the Burnt Penny, the Cinder Palace, Ember Night); every partner on the island caged in the Pit with "a portable cutting rig" (`words.js` L42-43); the Warden's own ledger of counted partners in the vault (`words.js` L80); the double-or-nothing table; Ashka's marks; "Sparky".
4. Silent Cut: The Wet Steps, Oil Row ("dark for the first time in forty years"), Crane Yard, the Long Boards; Silas as a former crane hand hiding in crates (`words.js` L31); the voice scarring in rags (`NOTES.md` L146). The duke's wife was picked up by the anime (`ep-17.md` L19).
5. Hold the Deck: the ram, the crane and the flour crates; the meals (Bone Broth, Pepper Stew, Ione's Tonic); the bear killed and the chain kept (E1); Silas's three husbands (E7).
6. Split Light: Ione's notes brought to burn on his desk, Vasch's copies and kept desk, the "Best Work" staff exam (`words-levels.js` L223), the cracked arm chamber; Vasch counting to ten and firing for her (`NOTES.md` L187).
7. Shared: Vasch's letter to Ione (`stories.js` L65) is used by Issue 36; the rest of the story cards (Juno's odds, Kaito's "Hand to elbow", Ione's field notes, Silas's cargo) are site-only but consistent with the voices.

## What the manga establishes that a game contradicts by leaving it out

1. Storm Run: Silt's planted question "Why do you run? It's the same sea." (`issue-04.js` L495; `SERIES_BIBLE.md` L168 pays it off in Issue 48). The game's Silt talks a lot and never asks it.
2. Storm Run: the island stops and "every chart on the wall is right" (`SERIES_BIBLE.md` L95); the game's ending card says "Pinhold's still nailed down" and moves on.
3. Storm Run: Bram and Grist holding the pier, Vesh rising from the harbour (`SERIES_BIBLE.md` L95). The crew is radio voices only.
4. Tide Gap: Kaito's right arm goes numb at the Gap, grabbing the cutter off Sela's mark (`issue-12.js` L560-600 "The fingers will not close."). In the game Kaito is unhurt and yelling.
5. Tide Gap: Hekka boards the Gullwake and duels Sela, telling the bear's story herself while fighting (`issue-12.js` L102-460). The game keeps her on her own deck.
6. Tide Gap: the Undersong heard at the bottom of the Dive and "a shape too big to be a shape" (`SERIES_BIBLE.md` L108). The game's Dive is a mechanic with no bottom.
7. Hot Hand: Nim Hadda, the Cinder Palace card duel, Ember Night and the marker (`issue-06.js` to `issue-08.js`). The game's raid starts at a flipped card table with none of them.
8. Hot Hand: Bram carries Juno into the harbour (`SERIES_BIBLE.md` L102). The game's Juno walks off to spend her winnings.
9. Silent Cut: Silas sells the crew to Maro and the crew is tied up in the warehouse he cuts through (`SERIES_BIBLE.md` L114-115; `issue-18.js` L47 "Skarn muzzled, Ashka hooded, Grist under a chain net"). In the game Sela sends him and the crew is on the radio.
10. Silent Cut: the Lantern Baths heist for the ledger (`SERIES_BIBLE.md` L113).
11. Hold the Deck: Old Tam Reed (138 lines in Issues 28-32) and her death; Otti (55 lines); the yard folk who "didn't sell anyone out" (`SERIES_BIBLE.md` L131). The game's Keelbreak is an empty yard that might "rob us" (`words.js` L11).
12. Split Light: the survey, which is the whole point of the Ward (`issue-35.js` L271 `ione` "The survey. The Director sited the pylons from it."); Oren's name (`issue-37.js`). Not a word of either in the game.
13. Split Light: Otti aboard (90 lines in Issues 33-37); Mother Kell and Cantor Isle on the way (`issue-34.js`).
14. Split Light: Vasch's temptation of each crew member, Bram's five years ("the iron reaches the mark at thirty-six", `issue-36.js` L434). The game's Vasch tempts only Ione.

## Noticed, not touched: scripts against CAST.md and the bible (not the games)

- `manga/issues/issue-01.js` L904 "At Sela's throat, a teal spiral glow shows through her scarf" against `CAST.md` L33 "just below her left collarbone" (Issue 2 L672 and every later issue have it right).
- `manga/issues/issue-17.js` L105 "Silas (20 here, 24 now)" and `anime/episodes/ep-17.md` L4, L69; `manga/issues/issue-36.js` L596 "Ione (20)": stated ages under 21 against hard rule 1 (`WORLD_BIBLE.md` L6, `SERIES_BIBLE.md` L6). Counted above as the HARD item under D2.
- Oren Brask is 56 in the manga (two issues) against 54 in `SERIES_BIBLE.md` L29.
- The handoffs' open items stand (Ten Count title, Pal serial order, Galley Rule numbering, the Ward's 3 vs 6 years, Otti saying "pup").

## Tallies

| Severity | Count | Items |
|---|---|---|
| HARD | 1 | D2 (script side: Silas and Ione shown at 20) |
| CANON | 25 | A1 A2 A3 A4 A5 B1 B2 B3 C1 C2 C3 D1 D2 D3 D6 E1 E2 E3 E4 E5 F1 F3 F4 G1 G3 |
| DRIFT | 11 | A6 B5 C4 C5 D4 D5 E6 F2 F6 F7 G2 |
| STYLE | 8 | B4 B6 B9 C7 E7 F9 G7 G9 |

Not checked: the pictures themselves (Krell's moustache, Sela's portrait skin, Juno's jacket) were read from the notes, not viewed; Issues 10, 14 and 19 were only grepped where a game pointed at them; `docs/manga/backstory/*.md` were not read.
