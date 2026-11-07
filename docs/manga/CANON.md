# Driftbound: Canon Register (v1, 2026-11-07)

The single register of facts every medium must agree on: website, games, manga, anime. Built from the files named in each row; nothing here is new. Where two files disagree, the disagreement is listed in section 0, not smoothed over.

**Who wins when files disagree (the order used in this register):**
1. `docs/WORLD_BIBLE.md` hard rules (everyone 21+; no nudity or sexualized framing; original only).
2. `docs/CAST.md` on looks, ages, heights, marks, costs. It wins over everything else on looks.
3. `art/refs/STYLE.md` on what each locked sheet actually shows (the picture artists copy).
4. `docs/FRIDAY_BATCH.md`, `shared/*.js`, `shared/kit/*.js` on the games, the site and the twelve Pals.
5. `docs/manga/SERIES_BIBLE.md` on plot beats, names, plants and payoffs.
6. The issue scripts (`manga/issues/issue-NN.js`) and episode scripts (`anime/episodes/ep-NN.md`) as written.
7. The backstory dossiers (`docs/manga/backstory/*.md`). Everything they mark **[new]** is Claude's invention, not yet on a page.
8. `docs/manga/NEW_CREW_PROPOSALS.md`: **PROPOSED only. Nothing from it is canon** (section 16).

Status words used below: **CANON** (in CAST, the bible or a shipped page), **DOSSIER** (only in a backstory file), **PROPOSED** (new-crew file), **CONFLICT** (see section 0).

---

## 0. Conflicts for Dylan

Each one quotes both sides with its file and ends with a one-line recommended pick. Items 1 to 15 are the ones `docs/manga/WRITER_HANDOFFS.md` already lists; 16 onward were found building this register.

1. **"Ten Count" is a real manga's title.** `SERIES_BIBLE.md` §4: "**The Ten Count** (the Sever's ten officers...)"; Issue 25 is titled "Ten Count" (`issue-25.js`). `WRITER_HANDOFFS.md`: "the title of a real published manga (Rihito Takarai's 'Ten Count'). Needs a new name (ideas: 'the Tally', 'the Decade', 'the Full Count', 'the Ten')." Recommended: **"the Full Count"** (keeps Order 12's "full count of ten" and the Ten/Five motif; "the Tally" clashes with the Red Tally and the Tally House).
2. **"Yolo."** `issue-26.js` line 202: a racer shouts "Yolo? Yolo, sit. SIT." at a partner. `SERIES_BIBLE.md` §1.3 "original only... no famous lines". Recommended: rename the partner (modern slang breaks the world); "Yarrow" keeps the shout's shape.
3. **Galley Rule One.** `shared/stories.js` ("house-rules" card) and `anime/episodes/ep-02.md` line 252: "One. Nobody fights in my galley." `issue-29.js` line 554: "GALLEY RULE ONE: TAM EATS FIRST." Issues 30, 31 and 45 ("Galley Rule One now?") still use "nobody fights". Recommended: Rule One stays "Nobody fights in my galley" (site, anime and four issues agree); Issue 29's board becomes a one-day chalk joke Bram rubs out, not a rewrite.
4. **Galley Rule Forty (and every other doubled number).** `issue-25.js`: "Forty: nobody watches a fight on an empty stomach." `issue-37.js`: "Galley rule forty. Ask first." `issue-41.js`: "Galley Rule Forty. Everyone comes back for stew." `issue-31.js` has "Forty-Five". Thirty-One, Thirty-Two, Thirty-Three, Thirty-Six, Six and Nine are each used for two to five different rules (full list in section 14). Recommended: adopt the numbering in section 14 (one number per rule, first-written wording keeps the number) and renumber the later duplicates on the next pass.
5. **The Longwake Chart's place.** `issue-20.js` line 170: "fills a wall the size of a mainsail... Kaito stands at the bottom of the steps" and line 856 "in its glass"; `issue-26.js` line 411: "under glass on a dais, bunting on fire overhead"; `issue-27.js` line 187: "behind cracked glass in a brass frame" on "the far wall" of the truce-house. Recommended: one wall-sized chart in a brass frame behind glass in the Saltlight truce-house (Issues 20 and 27); fix Issue 26's dais.
6. **Fizzlet's serial meets the same Pal several times.** `WRITER_HANDOFFS.md`: "Rivetling is 'met for the first time' in Issues 29, 30 and 31; Mopclaw in 3, 4, 11, 12; Dicemite in 6, 9, 10; Egg appears in 25 and vanishes in 26." The serial text confirms it (section 12). Recommended: the first-meeting table in section 12 is canon; later parts are re-meetings ("Mopclaw again") and get a one-word fix each.
7. **Bram's iron, and his towel.** `WRITER_HANDOFFS.md`: "Issue 30 already makes his left side grey hip to ear before Issue 31's 'won't come back' beat; Issue 32 keeps 31's state. Issue 26 has his towel on the left shoulder." `backstory/bram.md`: "cook's towel over the right shoulder"; locked prompt `art/refs/prompts/bram-sheet-v3.txt`: "towel draped over his RIGHT shoulder"; `CAST.md` says only "a cook's towel over his shoulder". Recommended: towel on the **right** shoulder everywhere (the locked sheet); iron reaches the ear only in Issue 31, and Issue 30 is pulled back to shoulder-and-forearm plus the knee.
8. **Hekka at the Keelbreak siege.** `WRITER_HANDOFFS.md`: "Issue 30 ends with her saying 'I don't board houses' at morning; Issue 31 opens at night, 'fourth hour of the siege', with her stepping aboard; Issue 32 opens with her on deck hauling the chain while 31 ends with her in the hold. The bear's chain is 'short' in CAST.md but runs two floors in 32." `CAST.md`: "iron collar with a short chain end". Recommended: the bear wears a short chain end (CAST); Hekka hauls a separate long yard chain hooked to the collar in 31 to 32; Issue 31 opens the same morning Issue 30 ends.
9. **Keelbreak's foreman has three names.** `issue-28.js` line 127: "foreman Hob Ollery (58, man, barrel-shaped, grey queue, leather apron)"; `issue-29.js` line 506: "Dace Holloway (44, man, the yard foreman, broad, tar-stained apron, pencil behind his ear)"; `issue-30.js` line 631: "Hobb Varley (45, man, bald, tar-blackened forearms, leather apron, a maul as long as his leg), and beside him Dace Holloway, the fo[reman]". Recommended: **Dace Holloway (44)** is the foreman (two issues); Hob Ollery becomes the dock master in 28; Hobb Varley stays a yard hand in 30.
10. **Otti says "pup".** `issue-33.js` has Otti call Kaito "pup" and a "You're twenty-one" joke that `issue-34.js` repeats; `backstory/allies.md` gives Otti the line "Short bursts, pup. Like kissing." `SERIES_BIBLE.md` §3: "'Pup.' Sela calls Kaito 'pup' and doesn't know why she likes the word. It was her name for Corin." Recommended: "pup" is Sela's word only (it is a plot key for Issues 19, 41 and 46); Otti says "moron"; cut one of the two twenty-one jokes.
11. **Ione's bowl and the survey sheet.** `WRITER_HANDOFFS.md`: "Issue 34 may hand Ione a bowl before Issue 38's soup trial, and has her holding 'the survey sheet' when 33 says only copies left the Ward." `SERIES_BIBLE.md` Issue 38: "Ione's signed on by Bram with a bowl of soup, which is the whole trial." Recommended: no bowl for Ione before Issue 38 (she eats standing, from the pot lid); in 34 she holds "her copy".
12. **Dusk into dawn.** `WRITER_HANDOFFS.md`: "Issue 35 ends at dusk; Issue 36 opens 'an hour before dawn' at the same place." Recommended: Issue 36 opens "the same night" (Vasch has been sitting there since dusk, which is his way).
13. **Who stopped the count, and when the reader learns it.** `issue-36.js` flashback shows Prism breaking the case at five; `backstory/ione.md` §11: "Issue 37: it was Prism that stopped the count. Vasch tells the crew mid-fight, 'Ask her who stopped the count'." Recommended: the issue as written wins (36); Vasch's Issue 37 line becomes "You saw who stopped the count."
14. **The Glass Ward's dates.** `issue-33.js` line 928, Ione's log: "Day 1,106 since five" (about three years); `issue-36.js` line 130: "six years. I thought it was a badge." `backstory/ione.md`: posted to the Ward at 21, half-cut at 23, now 26 (three years since five; six since she joined the labs at 20). Recommended: both numbers are right about different things; pin them: **five was 3 years ago; she joined the labs 6 years ago; the Ward closed 2 years ago** (Pike "37: the Ward closes", `tencount.md`).
15. **The hooded woman's mark shown early.** `WRITER_HANDOFFS.md`: "Issue 27 shows the hooded woman's cracked hexagon mark (Issue 33's reveal); drop the words 'and beneath them a cracked hexagon mark'." `SERIES_BIBLE.md` Issue 23: "a crystal on her neck". Recommended: drop the words; Issue 27 shows only the crystal at her neck.
16. **The stripped farmer is three people.** `issue-01.js`: "Tolly Marsh (68, farmer, bow-legged, straw hat, patched dungarees)", plough-beast Bess; `issue-02.js`: "an old farmer (68) braiding his plough-beast's ruff with red twine"; `issue-03.js`: "Farmer Hob Tarrow (68), stripped, left in the square; his plough-beast Thimble is now a Hollow"; `anime/episodes/ep-03.md` cast: "Hob Anser". Recommended: one farmer, **Hob Tarrow (68)** and **Thimble** (Issue 3 is the horror peak and already drawn around them); Tolly Marsh keeps Bess as a different Pinhold farmer in Issue 1; ep-03 renames Anser to Tarrow.
17. **Episode walk-ons do not match the issues they adapt.** `ep-01.md`: "Harbour-Clerk Teodor Hask (44), Customs Runner Dov Linnet (24)" vs `issue-01.js`: "Sergeant Dole (52) and Officer Pym (24)". `ep-05.md`: "Adjutant Corren" vs `issue-05.js`: "Vasch's aide is Mr. Tull". `ep-07.md`: "Ossian Brand (owner of the Cinder Palace)" and `ep-08.md`: "Hollis Lusk (61), owner of the Cinder Palace" vs `issue-07.js`/`issue-08.js`: "owner Lazare Quint (61)". `ep-08.md`: dealer "Fennick (36)" vs `issue-08.js`: "the dealer, Mister Fenn, 51". Recommended: the issue names win (the manga is the source the anime adapts); episodes 1, 5, 7 and 8 take Dole, Pym, Mr. Tull, Lazare Quint and Fenn (51).
18. **Kaito's mother.** `backstory/kaito.md` §1.1: "Maren Brask, born Maren Tull... Died when Kaito was 17... Would be 49" and "Oren is 33, Maren 28" at his birth (so 34 on the cliff night). `anime/episodes/ep-03.md` line 176: "MAREN TULL (44; the baker, flour still i[n]...)" alive in the present. `issue-37.js` line 290: "Maren Brask (36 then), never shown." Recommended: Maren Brask (née Tull) is dead before Issue 1 and never drawn (kaito.md, Issue 37); she was **34** on the cliff night; ep-03's living baker gets another name.
19. **Old Tam's spouse and last word.** `backstory/bram.md` §4: "her husband Joss Reed, a caulker, fell from a scaffold" and suggests her last word "Bastards"; `backstory/allies.md`: "Wife Hesper, sailmaker, died of fever when Tam was 55" and last word "Bollocks"; `issue-32.js` line 124 as written: Tam's last line is **"Shit."** Recommended: Issue 32 wins on the word ("Shit."); the spouse is Joss Reed (bram.md is the fuller Tam file); allies.md's Hesper line is struck.
20. **Corin Vale's road to the Gullwake.** `backstory/sela.md` §3: "Corin left at 17 and shipped as a deckhand under no name... He was first mate when Sela came aboard at 19" under Captain Hesper Lund, and Sela became captain at 20; `backstory/villains.md`: "At 20 he signed onto the Gullwake as a hand under its 19-year-old captain, Sela Vey"; `backstory/allies.md` (Kell): "at 20 he left to crew for a silver-haired girl of 19 with a battered ship." Recommended: sela.md's version (Lund is captain until Sela is 20; it is why she inherits the ship and why Lund's crew leave).
21. **Where and when Vasch found Corin.** `backstory/villains.md`: "At 22 Vasch found him on a Lanternreach pier"; `backstory/tencount.md` (Lucan Ash): "27: escorting Vasch's unit, sent to a Cantor dock for Corin Vale (21), who sits with a hound and does not draw." Recommended: a Lanternreach pier, Corin 22, with Lucan the officer sent (keeps Lucan's "one lost duel" and the bible's Issue 41 line).
22. **Burr's kind, and Kell's kinship.** `backstory/villains.md`: "a knell-hound pup found under the Cantor bell-house... element Echo"; `backstory/sela.md`: "a Cantor song-hound, long-bodied, grey-brown, sail-like ears". `backstory/allies.md`: Kell is "Great-aunt of Corin Vale"; `backstory/villains.md`: "taught... by Mother Kell, no kin." Recommended: knell-hound (villains.md is the fuller file); no kin (Kell's "ask no names" works better with no blood tie).
23. **The first pinned island.** `backstory/villains.md` timeline: "9 first pinning (Tallis Bank; Bram's ship)"; `backstory/bram.md`: "the Lowmoor pinning... the Empire drives its first-ever anchor pylon at the harbour island of Lowmoor". Neither name is in any issue (`issue-29.js` says only "nine years"). Recommended: **Lowmoor** (bram.md carries the whole scene).
24. **Oren and Vasch do not line up.** `backstory/allies.md` (Oren): "What he ran from (Issue 37): Vasch, then 31, had sent men for the survey" (15 years ago); `backstory/villains.md`: "At 33 he built the first bond-cutter... At 35 Regent Hale... funded the Sever. At 36 Oren Brask's survey reached him from the Admiralty archive" (10 years ago), and its own timeline "15 Oren leaves Pinhold". `backstory/world.md` lists "Vasch's age at Oren's survey (36 / 31)" as unresolved. Recommended: the **Admiralty survey office** took Oren 15 years ago; Vasch read the archived survey at 36 and asked for the surveyor. Vasch's line "He said you'd have his temper" still stands.
25. **When Hekka stripped her bear.** `backstory/villains.md`: "At 30 Vasch told her... the same week, offered her a Sever captaincy... She walked into Ione's lab with the bear" (3 years ago); `backstory/ione.md`: "Age 22... Captain Hekka Dorn (then 29) walks into her lab" (4 years ago). Recommended: 4 years ago, Hekka 29, Ione 22 (ione.md's sequence is tied to Order 12's writing, which Issue 33 relies on).
26. **Nim and Juno's two years.** `backstory/allies.md`: "Met Juno when she was 19 (he 26): two years of a rigged dice table"; `backstory/juno.md`: "partner in crime from 17 to 19" and "19 to 22. The furnaces." Recommended: 17 to 19 (juno.md; she cannot be at a dice table and in the furnaces at once).
27. **Hekka's seat.** `backstory/villains.md`: "At 31 she took the Seventh seat"; `backstory/tencount.md`: "count-names came with the Great Pylon plan (Issue 25)." Recommended: she was made Captain at 31; the seat-numbers are new in Issue 25.
28. **Egg and Skrit are not in the Monster Book.** The serial introduces "Skrit, a tern-pal with a crooked beak" (`issue-13.js` line 712, never seen again) and "Egg" (`issue-05.js`, then 23 to 25: "The egg chimes once, very softly, like a glass bell"). `docs/FRIDAY_BATCH.md` lists twelve Pals and "Shardle, a round glass chick that chimes" first hops out in `issue-38.js`. Recommended: Egg is Shardle's egg (carried 24 to 38; add it to 26 to 37's serial text); cut Skrit.
29. **Pal display names.** `docs/DECISIONS.md` (2026-11-07): "New pal names, your picks: snail 'Prismule', ember dumpling 'Kindlekin'. Only the shown names changed; the save ids stay glimmick and cinderbun." `issue-34.js` to `issue-38.js` and `ep-09.md` say "Glimmick"; `issue-39.js`, `issue-40.js`, `issue-51.js`, `ep-09.md` say "Cinderbun". Recommended: the manga and anime use Prismule and Kindlekin on the next pass; code ids stay.
30. **Ledger Maro has no black bar.** `CAST.md`: the Sever uniform is "long grey coats with a white collar and a black bar across the chest"; `shared/kit/cast.js` and `backstory/tencount.md` draw Maro in "plum coat, white collar, gold belt, no black bar: bought, not sworn", yet `SERIES_BIBLE.md` §4 makes him Four of the ten officers. Recommended: keep him bar-less (a buyer, not a trooper) and say so once in Issue 25.
31. **Hekka's eyes.** `art/refs/STYLE.md`: "blue-grey eyes"; `shared/kit/cast.js` hekka `eye: '#2a2230'` (near black); `shared/kit/speakers.js` hekkaFace uses `#5d7180` (blue-grey). Recommended: blue-grey (the locked sheet); fix cast.js.
32. **Names used twice or more** (collisions, not plot conflicts; the dossier-only ones can be renamed before they reach a page): **Maren** ×3 (Kaito's mother, kaito.md; Ione's mother Maren Raske, ione.md; Silt's mother Maren Vale, villains.md). **Teodor** ×3 (Silas's father, silas.md; Ione's father, ione.md; Teodor Hask, ep-01). **Odile** ×2 (Silas's mother, silas.md; Maro's wife, tencount.md). **Hanne** ×3 (Bram's wife Hanne Aske, bram.md; Hanne Brill barkeep, issue-01; Hanne Wick, issue-45). **Dov** ×4 (Sela's father, sela.md; Dov (40s), issue-01; Dov Marrick, issue-45; Dov Linnet, ep-01). **Marit** ×2 (Sela's sister, sela.md; Marit Sund, silas.md). **Hesper** ×5 (Captain Hesper Lund, sela.md; Tam's wife, allies.md; Mother Hesper, issue-16; Hesper, issues 39 and 43; Hesper Rooke, ep-05). **Tull** ×4 (Kaito's mother's family and Tull Lane, kaito.md; Mr. Tull, Vasch's aide, issue-05; Maren Tull, ep-03; Tull (44), ep-18). **Fenn** ×4 (dealer Fenn 51, issue-08; Fenn Ollery 24, issue-28; Fennick 36, ep-08; Regatta Master Adaire Fenn 64, ep-20). **Hob/Hobb** ×5 (Hob Tarrow, issue-03; Hob Anser, ep-03; Hob Ollery, issue-28; Auntie Hobb, issues 15 and 18; Hobb Varley, issue-30). **Finch** ×3 (Abel, ep-04; Dory, issue-43; Ada, issue-45). **Dace** ×2 (Juno's father, juno.md; Dace Holloway, issue-29). **Lowmark** ×2 (Otti's Lowmark Shoals, allies.md; Vasch's Lowmark hospital island, villains.md). **Hale** ×2 is intentional (villains.md: "no relation"). Recommended: rename the dossier-only Marens, Teodors, Odile, Hanne Aske, Dov Vey and Marit Vey, and one Lowmark; keep every name already on a page.
33. **Silt's height.** `shared/kit/cast.js`: "Silt, Krell, Maro: Claude's calls", silt `cm: 175`; `CAST.md` gives Silt no height ("Wiry"). Not a conflict, an unconfirmed number: Silt 175 cm is PROVISIONAL until Dylan says so.

---

## 1. People (the crew)

Ages: Part One (Issues 1 to 42) / Part Two (Issues 43 on, two years later, `SERIES_BIBLE.md` §8). Heights from `CAST.md`. Element, power, cost, base state: `CAST.md`. Introductions: game `docs/FRIDAY_BATCH.md`; issue and episode from the scripts.

| Person | Age P1 / P2 | Height | Bond mark and where | Signature colour | Partner | Element | Borrowed power | Cost; base state | Introduced | Source |
|---|---|---|---|---|---|---|---|---|---|---|
| Kaito Brask, the hero | 21 / 23 | 178 cm | jagged three-point lightning fork, back of the right hand | electric yellow + red (`#f2d21b`, `#c8302c`) | Skarn | Storm | speed bursts; lightning through his right gauntlet | scars: each big Surge burns a fork further up the right arm; base: hand to elbow; too far and the arm is numb for days | Storm Run; Issue 1; Ep 1 | CAST.md; crew.js; FRIDAY_BATCH |
| Sela Vey, the captain | 28 / 30 | 175 cm | round whirlpool spiral (curls inward, no tail), just below the left collarbone | deep teal + gold (`#1f9aa3`, `#d9a93a`) | Vesh | Tide | water-pressure blasts; feels which way islands drift | memories: each deep Surge (a Dive) drowns one memory; base: no body mark; the logbook | Tide Gap; Issue 1; Ep 1 | CAST.md; STYLE.md |
| Juno Calloway, the sharpshooter | 23 / 25 | 165 cm | flame-shaped feather, upper chest just below the right collarbone | fire orange + white (`#ef6a1f`, `#f5f0e6`) | Ashka | Fire | throws Ashka's fire from her gloved hands (no gun; "decided later") | heat: each Surge raises body heat; too much and she burns inside; base: scarred, blistered palms under fingerless gloves | Hot Hand; Issue 6; Ep 6 | CAST.md |
| Silas Moreau, the duelist | 24 / 26 | 183 cm | three short feather lines down the left side of the neck | violet + red (`#7a4fc0`, `#c8302c`) | Hush | Wind | wind cuts along his chain-blade; near-silent movement | voice: each Surge steals breath; too much and he cannot speak for days; base: a faint rasp, no body mark | Silent Cut; Issue 14 (last page) / 15; Ep 14 (last scene) / 15 | CAST.md; SERIES_BIBLE |
| Bram Torvald, shipwright and cook | 31 / 33 | 198 cm | square anvil over the heart | iron grey + rust orange (`#7b828e`, `#c05a22`) | Grist | Iron | skin hardens to iron | turning to stone: grey iron spreads and stiffens joints; base: left shoulder and left forearm | Hold the Deck; Issue 2; Ep 2 | CAST.md |
| Dr. Ione Raske, the bond scientist | 26 / 28 | 168 cm | cracked hexagon, left wrist (half-stripped bond) | ice blue + black (`#8fd3f0`, `#11141c`) | Prism | Crystal | light beams and crystal shields, short bursts only | crystal growths: each Surge grows painful shards; base: small growths on the left wrist and up the side of the neck | Split Light; hooded in Issues 23 and 27, named Issue 32 (last page), joins 38 | CAST.md; SERIES_BIBLE |

**Part Two looks (mandatory, `SERIES_BIBLE.md` §8 Arc 9):** Kaito: longer hair tied back, red coat worn properly, right arm in a brass-and-leather rig worked with the left, Surges only in short beats, scars past the shoulder onto the chest. Sela: silver hair cut to the jaw, officer's long coat open over the bandeau, a trunk of logbooks she no longer fully trusts. Juno: long open duster, crop top, hair cropped, pit-boss of the *Second Chance*. Silas: voice almost gone, scarf, still no buttons. Bram: half-iron, left side grey to the jaw, walks with a stick, runs a soup kitchen. Ione: crystal up the neck to the jaw, hair longer, still in a coat; her mark is growing back.

**Other look details fixed by the locked sheets (`art/refs/STYLE.md`, `docs/CAST.md`):** Kaito: amber eyes, scar through the **left** eyebrow, white streak on his **right** side; black sleeveless zip top half unzipped, red flight jacket tied at the waist, grey cargo pants, scuffed boots, brass goggles on the forehead, fingerless metal gauntlet on the right forearm. Sela: dark brown skin, sea-green eyes, gold hoops, silver-blue high ponytail; cropped deep-blue navigator's jacket buttoned once under the high collar over a black bandeau, wrap skirt with a high side slit, strapped sandal-boots, brass spyglass. Juno: tanned, freckled, green eyes, copper braid over the **left** shoulder; cropped white tank, open fur-collared bomber, denim shorts, knee boots; no rifle, no bandolier. Silas: pale, violet eyes, beauty mark under the left eye, long dark-teal hair tied low; white shirt open to the stomach, red sash, loose black trousers, wrapped forearms and ankles; chain-blade. Bram: light-brown skin, brown eyes, thick black beard, shaved head, tribal-style original tattoos on the shoulders; shirtless under dungarees with the **left** strap down (the sheet reads canvas, not leather; accepted), tool belt, towel (right shoulder, see conflict 7). Ione: pale, sharp grey eyes, thin round glasses, messy black bob with one crystal-white lock; lab coat on the shoulders, sleeves rolled, cropped black low-cut V-neck, high-waisted shorts with a vial belt, dark stockings, buckled boots; the wrist mark on the sheet "reads as a broken zigzag rather than a clear cracked hexagon (accepted by Dylan)".

---

## 2. Partners

| Partner | Of | What it is | Size | Look fixed by CAST.md / STYLE.md | Source |
|---|---|---|---|---|---|
| Skarn | Kaito | storm wolf | horse | slate-grey fur, tall sail-like fin down the spine that crackles, glowing yellow eyes, forked tail (tail shows in side views only on `skarn-sheet-v3.png`); glides on updrafts; grumpy, loyal; "the disgusted face" | CAST.md; STYLE.md; SERIES_BIBLE §10 |
| Vesh | Sela | deep-sea serpent-dragon | as long as the Gullwake | dark blue scales, ridge of glowing lantern lures along the back, frilled jaw; no legs; horns are the model's addition on `vesh-sheet-v1.png`; tows the ship by a jaw harness | CAST.md; STYLE.md |
| Ashka | Juno | fire raptor | large eagle | ember-red and black feathers trailing sparks, hooked beak, glowing tail plumes; yellow eyes and head crest are the model's additions; rides Juno's shoulder or flies spotter | CAST.md; STYLE.md |
| Hush | Silas | silent wind owl-lynx | big cat (dossier: leopard-sized) | big cat's body, owl wings, flat owl face, feathers sharp as knives; owl beak, lynx ear tufts, bobtail on `hush-sheet-v2.png`; moves without a sound | CAST.md; STYLE.md |
| Grist | Bram | iron rhino-beetle beast | truck | dark iron plates, one huge anvil-shaped horn, six thick legs, no tail; slow, stubborn, sleeps on deck | CAST.md; STYLE.md |
| Prism | Ione | glass mantis-moth | large dog | clear crystal wings that split light into rainbows, thin legs, blade forearms (uncrossed); four walking legs and a long abdomen on `prism-sheet-v3.png` | CAST.md; STYLE.md |
| Mallow (Hekka's Hollow bear) | Hekka Dorn | stripped ridgeback bear, now a Hollow | about 2.2 m at the shoulder | ash-grey fur (leans warm grey-brown on the sheet), blank white eyes with a slight glow, plates on brow, shoulders and spine, cables from core to shoulder plates, white core set into the chest, iron collar with a short chain end, rough stub tail. Name "Mallow" is DOSSIER only (`villains.md`); never said aloud (Order 12) | CAST.md; STYLE.md |
| Burr (Silt's Hollow hound) | Silt | stripped hound, now a Hollow | about 1.3 m at the shoulder (PROVISIONAL) | ash-grey fur, cable "veins", white core in the chest, plates on brow, neck, shoulders and hips, back left bare for a rider, fangs and torn ears. Name "Burr" is DOSSIER only (`villains.md`, `sela.md`; kind in conflict 22) | CAST.md; STYLE.md |
| Vesper | Vasch (gone) | salt bell-jelly; its core is in his glass forearm | bucket-sized bell | DOSSIER (`villains.md`) | villains.md |
| Flint | Tobias Quill | sand kite-ray | huge | flat diamond body, sawtooth tail, grit-coloured | SERIES_BIBLE §4; allies.md |
| Gnash | Marisol Thane | coral hammerhead | boat-length | rose-and-bone coral plates, teeth like broken reef | SERIES_BIBLE §4; allies.md |
| Pell | Wren and Dove Aster (one head each) | two-headed heron | man-tall | grey-white, one neck, two heads | SERIES_BIBLE §4; allies.md |
| Merrow | Otti Ferro (cut 3 years ago) | gale-skate | wide glider | DOSSIER; only the empty harness is on the page | SERIES_BIBLE Issue 22; allies.md |
| Hollin | Mother Kell (died of age) | bell-whale | | DOSSIER | allies.md |
| Even | Deacon Sorrel (cut; now Pike's Hollow) | slate tortoise | cartwheel | DOSSIER | tencount.md |
| Stile and Furrow | the Ostlers' Hollow stags, stitched flank to flank | red moor-stags | 1.9 m | DOSSIER | tencount.md |
| The Orderly | Pike's Hollow (a river-hog with two surgical arms) | | ox-sized | DOSSIER | tencount.md |
| Fetch | Sable Oriel | mimic-salamander (lends her the face of whoever you trust) | forearm-long | DOSSIER | tencount.md |
| Wick | Maren Raske (Ione's mother) | lamp-heron | | DOSSIER | ione.md |

---

## 3. Villains: the Sever and its officers

| Who | Age P1 | Height | Look | Partner / Hollow | Role, where seen | Source |
|---|---|---|---|---|---|---|
| Director Aurel Vasch | 46 | 188 cm | pale skin, pale grey eyes, neat grey hair combed back, tiny closed-mouth smile; knee-length **white** coat, closed and belted in black, both sleeves rolled; flat black bar with a **black** ring (front only); long black glove on the left arm; right forearm a see-through glass tube holding one white core between steel rings, bare metal fingers; dark grey trousers, black boots | the core is his own stripped partner (Vesper, DOSSIER) | invented bond stripping; Ione's mentor; the Count's "One" (Issue 5), Two (10), Three (27), Four and Five (39); Split Light boss; first seen Issue 5 / Ep 5 | CAST.md; STYLE.md; SERIES_BIBLE |
| Captain Hekka Dorn | 33 | 193 cm | light brown skin, thick wavy black hair swept back, blue-grey eyes (conflict 31), no lip scar; grey plates on chest, back, shoulders, forearms and shins, dark cloth on the upper arms, loose work trousers, white collar, black bar and white ring on the chest plate; bare midriff with a dull ring scar on her **left** side where her bond was; black gloves, belt, boots; a bond-cutter lance taller than she is (separate prop sheet, not yet made) | the chained Hollow bear (she stripped it herself, standing, full count: `stories.js` "What Hekka did") | the Sever's muscle; Sela's rival; Tide Gap boss; Hold the Deck boss; first seen Issue 11 / Ep 11 (last scene); calls the retreat herself Issue 32 | CAST.md; STYLE.md |
| Silt (real name Corin Vale, 29) | 29 | 175 cm PROVISIONAL (cast.js) | wiry; smooth white mask with one eye slit over his **right** eye; messy black hair; long ragged black coat to the knee, belted, open below the belt; hooked blade at the right hip | rides the Hollow hound (Burr, DOSSIER) | tracks bonded humans; Kaito's rival; Storm Run boss; "Found you" Issue 1 / Ep 1; "Why do you run?" Issue 4; breaks at "pup" Issue 19; "You made it up" and hums Issue 41; rides a half-cut Skarn Issue 48 | CAST.md; STYLE.md; SERIES_BIBLE §3 |
| Warden Krell (first name Dunstan, DOSSIER) | 41 | 195 cm | heavy trooper officer; open-faced helmet, dark grey coat, plated forearms and shins, shield line faced with unburnable glaze | none | Ashmarket; Hot Hand boss; Three of the officers; dies burning Issue 41 | FRIDAY_BATCH; cast.js; SERIES_BIBLE |
| Ledger Maro | 52 | 172 cm | stout, balding, plum coat, white collar, gold belt, **no black bar** (conflict 30); soft-spoken, lamp-lit, account books | none | Lanternreach's lender; Silas's old boss; sold out to the Sever; Silent Cut boss; Four of the officers; Issues 15 to 18 / Eps 15 to 19 | FRIDAY_BATCH; cast.js; SERIES_BIBLE |
| Deacon Sorrel | 44 | 170 cm (DOSSIER) | Sever chaplain, soft-voiced, gives last rites before cutting | Even (cut) | Two; Issues 25, 26, 27, 45 | SERIES_BIBLE §4; tencount.md |
| Doctor Pike (first name Ambrose, DOSSIER) | 39 | 180 cm (DOSSIER) | Hollow surgeon, cheerful, loves his work; his notes are in the Glass Ward (Issue 35) | the Orderly (a Hollow) | Five; Issues 25, 26, 35 | SERIES_BIBLE §4; tencount.md |
| Lucan Ash | 35 | 185 cm (DOSSIER) | elegant duelist, grey coat buttoned to the throat, white gloves, straight cutter-sabre; never Surges | none | Six; Silas's opposite; Issues 25, 26, 27, 36, 41 | SERIES_BIBLE §4; tencount.md |
| The Ostlers, Bren and Hale | 31 and 31 | 183 cm (DOSSIER) | twins, ride a stitched pair of Hollow stags | Stile and Furrow | Eight; Issues 25, 26, 27, 41 | SERIES_BIBLE §4; tencount.md |
| Sable Oriel | 28 | 165 cm (DOSSIER) | the Regent's envoy; looks like whoever you trust; true look: slight, mid-brown skin, cropped dark hair, flat grey eyes, unmarked grey coat | Fetch | Ten; unseen until Issue 46, where she wears Sela's face | SERIES_BIBLE §4; tencount.md |
| Sever troopers | adult men, about 180 cm | | grey helmet with black visor, jaw showing; grey coat to the knee, closed and belted, white collar; flat black bar with a white ring cut by the bar (front only); hooked bond-cutter at the right hip; black gloves, belt, boots | none | the common enemy in every game; Issue 2 on | CAST.md; STYLE.md |
| Regent Emeric Hale | 63 | | rules the Meridian Empire; old, tired, thinks he is buying peace from Vasch | none | §4; Issues 46 to 48 through Sable and the records barge | SERIES_BIBLE §4; villains.md |

**The officers' count-names** (`SERIES_BIBLE.md` §4; group name in conflict 1): One Vasch, Two Sorrel, Three Krell, Four Maro, Five Pike, Six Lucan Ash, Seven Hekka, Eight the Ostlers, Nine Silt, Ten Sable Oriel.

---

## 4. Allies and rivals

| Who | Age P1 | Look | Partner | Arc | Fate | Source |
|---|---|---|---|---|---|---|
| Ottoline "Otti" Ferro | 52 | broad, sun-lined, short grey curls, sleeveless racing coat, flask; three-time Regatta champion; shameless flirt, drinks, sees everything; Kaito's teacher (the Short Surge, Issue 22) | Merrow, stripped; keeps the empty harness | Issue 20 on / Ep 20 | dies Issue 41 holding a gap, flask raised | SERIES_BIBLE §4 |
| Tamsin "Old Tam" Reed | 67 | small, leather-skinned, foul-mouthed master shipwright of Keelbreak; took Bram in at 22 | never bonded | Issue 28 on | dies Issue 32; last word as written "Shit." (conflict 19) | SERIES_BIBLE §4; issue-32.js |
| Tobias Quill | 27 | cocky racer, gold tooth, long blond tail of hair, sash of race ribbons; skiff the *Brag* (Issue 51) | Flint | Issue 20 on / Ep 20 | Kaito's friendly rival, then loyal | SERIES_BIBLE §4 |
| Captain Marisol Thane | 35 | captain of the *Red Tally*; big laugh, red coat over a corset-style vest, tattooed forearms, one gold eye-patch | Gnash | Issue 20 on / Ep 20 | Sela's ex-rival and flirting partner; ally | SERIES_BIBLE §4 |
| Wren and Dove Aster | 25 and 27 | sisters, acrobat-racers, matching striped race suits with short jackets; never joked about as a couple | Pell (shared) | Issue 21 on | comic and deadly; allies | SERIES_BIBLE §4 |
| Mother Kell | 71 | last Cantor elder, blind, tiny, layered sea-grey shawls; knows the Undersong and who Corin was | Hollin (dead, DOSSIER) | Issue 34 | never names Corin on the page (`issue-34.js` has no "Corin") | SERIES_BIBLE §4; allies.md |
| Nim Hadda | 30 | one-armed Ashmarket bookmaker at the Burnt Penny (Issue 6); Juno's old partner in crime; gentle cynic | none | Issue 6 on / Ep 6 | forgives Juno's debt Issue 10; runs the "Kaito and who?" book | SERIES_BIBLE §4; issue-06.js |
| Commander Yevka Sorn | 38 | Empire naval commander with a conscience; stiff uniform, neat braid | none | Issue 39 on | sees Pylon Six's truth Issue 40; defected by Issue 45 | SERIES_BIBLE §4 |
| Oren Brask | 54 / 56 | Kaito's father, Empire surveyor; grey prisoner's coat, chart-weights for cufflinks, glasses on a cord | none | signature Issue 37; seen Issue 47 (`issue-48.js`: "Oren Brask (56) through the glass") | alive, under guard in Meridian | SERIES_BIBLE §3; issue-48.js |
| Mag Tolliver | 70 | pilot of Sorrow Point; taught Sela navigation at 18 to 19 | | Issues 11, 13 / Eps 11, 13, 14 (memory only) | the year Sela loses in Issue 13 | issue-11.js; sela.md |

---

## 5. Walk-ons with names (per issue, with stated age where the script gives one)

Episode-only names are marked (ep). Where an episode renames an issue's walk-on, see conflict 17.

| Issue | Name (age), role | Source |
|---|---|---|
| 1 | Sergeant Dole (52) and Officer Pym (24), Empire customs; Tolly Marsh (68), farmer, plough-beast Bess; Hanne Brill (55), barkeep; Widow Hask (74); Dov (40s); Nan the baker (50s); Mrs. Odell. (ep-01: Ama Kettle (70); Harbour-Clerk Teodor Hask (44); Customs Runner Dov Linnet (24); Pylon Officer (47)) | issue-01.js; ep-01.md |
| 2 | an old farmer (68) braiding his beast's ruff with red twine. (ep-02: Daskel (58) and his stripped partner, the Hollow "Tulip") | issue-02.js; ep-02.md |
| 3 | Hob Tarrow (68), farmer, plough-beast Thimble (stripped on the page); Marta Oake (61), neighbour. (ep-03: Hob Anser; Maren Tull (44, baker); Sergeant Audric Dask) | issue-03.js; ep-03.md |
| 4 | Mrs. Oake (54), baker; Mrs. Teal (58); Nan Hask (71), postmistress; Dunmore (48); Harl; Ansel Rook. (ep-04: Maud Pellow, Harl Dunning, Abel Finch) | issue-04.js; ep-04.md |
| 5 | Mr. Tull, Vasch's aide; Moll; Dunn; a Clerk. (ep-05: Adjutant Corren; Fenna Dray; Dannel and Hesper Rooke) | issue-05.js; ep-05.md |
| 6 | Nim Hadda (30); Prewitt. (ep-06: Lieutenant Garrow) | issue-06.js; ep-06.md |
| 7 | Lazare Quint (61), owner of the Cinder Palace; Crake (74). (ep-07: Ossian Brand, owner) | issue-07.js; ep-07.md |
| 8 | Mister Fenn (51), the dealer; the card game is "Last Ember". (ep-08: Hollis Lusk (61), owner; Fennick (36), dealer) | issue-08.js; ep-08.md |
| 9 | Gus Tallow (58), baker | issue-09.js |
| 11 | Mag Tolliver (70) | issue-11.js |
| 15 | the Tallyman (58), Maro's harbour clerk; Auntie Hobb, doorkeeper. (ep-15: Lem the collector) | issue-15.js; ep-15.md |
| 16 | Mother Hesper, the Lantern Baths; a Doorkeeper. (ep-16: Pen (45); the Door (44)) | issue-16.js; ep-16.md |
| 17 | Hob; Silas at 21 and 22 in flashback | issue-17.js |
| 18 | Auntie Hobb; Hobb. (ep-18: Tull (44); Ansel (37)) | issue-18.js; ep-18.md |
| 20 to 25 | the Marshal (63), Regatta official; the Judge; a Clerk; Rafe (22, 26); Audun (23); Bellkeeper (25). (ep-20: Regatta Master Adaire Fenn (64)) | issue-20.js to 25; ep-20.md |
| 26 | Marn; a racer's partner "Yolo" (conflict 2) | issue-26.js |
| 28 | Hob Ollery (58), foreman (conflict 9); Fenn Ollery (24), yard hand | issue-28.js |
| 29 | Dace Holloway (44), yard foreman | issue-29.js |
| 30 | Hobb Varley (45), yard hand with a maul; Dorrit Kane (39), caulker; Sgt. Coyle (Sever, also 32) | issue-30.js |
| 32 | Harl Dunmore (58), yard hand | issue-32.js |
| 37 | Maren Brask ("36 then", never shown; conflict 18) | issue-37.js |
| 43 | Crane (50); Dory Finch (29); Hollis; Hesper | issue-43.js |
| 44 | Mallory (45), salvage captain; Varr; a dealer (33, woman) | issue-44.js |
| 45 | Ada Finch (72); Peg Hollin (58); Dov Marrick (61) and his cart-goat Barley; Hanne Wick (34) and her bird Pip (stripped) | issue-45.js |
| 46 | a Surgeon | issue-46.js |
| 51 | Ulla | issue-51.js |

---

## 6. Places

| Place | What it is | Game | Issues (first) | Episodes | Source |
|---|---|---|---|---|---|
| Pinhold | Empire island being pinned; grey soil, dead wells; every chart on every wall now right; Great Pylon One (Issue 5); greeting "Still here." | Storm Run (stages: Pin Road, Chain Yard, Searchlight Row, Pylon Four, Long Drop) | 1 to 5 | 1 to 5 | FRIDAY_BATCH; issue-01.js; world.md |
| Ashmarket | gamblers' island on a volcanic crag; Cinder Palace and the High Table; the Burnt Penny (Nim's); Ember Night | Hot Hand | 6 to 10 | 6 to 10 | FRIDAY_BATCH; SERIES_BIBLE |
| Gaptooth Reach | two island chains grinding past each other; the only way east; Great Pylon Two (Issue 10); "the Molar" (Issue 11) | Tide Gap | 10 to 14 | 11 to 14 | FRIDAY_BATCH; issue-11.js |
| Lanternreach | smugglers' port at night; nobody uses names; everyone owes Maro; the Lantern Baths (16), Tallow Dock (15), the Tally House (17); flooded in Part Two (46) | Silent Cut | 14 (last page) to 19 | 14 to 19 | FRIDAY_BATCH; issue-15.js, 17 |
| Saltlight | neutral coral atoll; the Longwake Regatta every seven years under a truce; the Longwake Chart in the truce-house; Great Pylon Three under the reef (27) | none | 20 to 27 | 20 | SERIES_BIBLE; issue-20.js |
| Keelbreak | shipyard island, Bram's home; Old Tam's yard; the Gullwake in dry dock | Hold the Deck | 28 to 32 | none yet | FRIDAY_BATCH |
| Cantor Isle | ghost village of the drift-singers; Mother Kell's hut; the bell-house (DOSSIER) | none | 34 | none | SERIES_BIBLE |
| The Glass Ward | dead bond lab, greenhouse island grown through with crystal; once charted as Tern Hatch (35) | Split Light | 33 to 38 | none | FRIDAY_BATCH; issue-35.js |
| Anvil Rock | iron sea-stack where pylon segments are forged; Great Pylon Six, wrecked (42) | none | 38 to 42 | none | SERIES_BIBLE |
| Dunmarrow | collapsed farming island of Part Two; Bram's soup kitchen, board reads TAM'S (DOSSIER); first mercy clinic | none | 45 (named 11, 44) | none | SERIES_BIBLE; bram.md |
| Meridian | the capital; the Regent; the records barge where Oren is chained (47); "Six is at Meridian" (48) | none | 36, 37, 47, 48 | 1, 3, 18 (named) | SERIES_BIBLE |
| Sorrow Point | Mag Tolliver's harbour; Sela's lost year | none | 11, 13 | 11, 13, 14 | issue-11.js |
| Tarrow | where Pinhold's rescued partners went by ferry | none | 3, 5 | none | issue-05.js |
| Lowmark (Shoals) | Otti's home island (the Sever took its partners) | none | 22 | none | issue-22.js; allies.md (conflict 32) |
| Ninefathom; Hallam Stair | Sela's and Ione's birth islands (DOSSIER; each named once in Issue 47 / 37) | none | 47; 37, 47 | none | sela.md; ione.md |
| Brittlemere, Kestle, Lowmoor, Hobnail, Gullsand Bar, Corrow Dock, Harrowmere, Wallmarch, Lowmass Skerry, Quiet Shoals, the Still Room, Harrow Bank, the Tithe Stair | DOSSIER only: birthplaces and sites not yet on any page (Gullsand named once in Issue 51) | | | | backstory/*.md |
| The hot-spring island | filler Issue 51, between Issues 27 and 28; unnamed | none | 51 | none | issue-51.js |

**Great Pylon sites so far:** One Pinhold (Issue 5), Two Gaptooth Reach (10), Three Saltlight (27), Four and Five unnamed (39; world.md proposes Harrow Bank and the Tithe Stair, PROVISIONAL), Six Anvil Rock, wrecked (42), then Meridian (48). `SERIES_BIBLE.md` §3, §8; `backstory/world.md` §5.

---

## 7. Ships

| Ship | What | Source |
|---|---|---|
| the *Gullwake* | the crew's battered salvage ship, towed by Vesh; three masts, the aftermost a stump called the Post where the betting pool and the Galley Rules are chalked (DOSSIER); torn apart at Anvil Rock, Issue 42 | CAST.md; SERIES_BIBLE Issue 42; world.md §7 |
| the *Red Tally* | Marisol Thane's ship; red tally marks on the mast | SERIES_BIBLE §4; issue-20.js |
| the *Brag* | Tobias Quill's skiff | allies.md; issue-51.js |
| the *Second Chance* | Juno's floating casino hulk in Part Two, full of refugees | SERIES_BIBLE Issues 43 to 44 |
| Hekka's cutter | Sever cutter-ship with harpoon-lances and pylons; unnamed on every page | FRIDAY_BATCH (Tide Gap); issue-11.js |
| the Sever cutter-ship at Tallow Dock | collects lots of partners | silas.md; issue-15.js |
| the *Patience* | the Torvalds' lost iron-hauling barge; its keel plank is the galley table until Issue 42 (DOSSIER) | bram.md |
| the Meridian records barge | Oren Brask chained to its chart table | SERIES_BIBLE Issue 47 |
| the stolen hull | the crew's ship at the end of Issue 48 | SERIES_BIBLE Issue 48 |

---

## 8. Objects and props

| Prop | Owner | What it does in the story | First on page | Payoff | Source |
|---|---|---|---|---|---|
| the logbook(s) | Sela | her life, kept in a trunk because her head is not a safe place; first line "Ask him about the song" in her own hand after a torn page | Issue 1 / Ep 1 (Issue 5: thumb on the torn edge) | 14 ("Old tear"), 41, 47 | CAST.md; SERIES_BIBLE §3, §9 |
| the chart | Kaito | blank in Issue 5 (Pinhold dot); the real chart by 35; half map, half stave by 48 | Issue 1 (shouted), 5 (started) | 35 ("The whole goddamn sea is a bond mark"), 48 | SERIES_BIBLE §3, §8 |
| survey sheets | Oren's, carried by Kaito to Sela | the Empire sited the pylons from them | Issue 1 | 37 (signature), 47 | SERIES_BIBLE §9; issue-01.js |
| brass flight goggles | Kaito; Juno holds them Issues 6 to 10 ("deposit"), one lens cracked (9) | | Issue 1 | 10 (returned) | CAST.md; issue-06.js, 09, 10 |
| the towel | Bram | the cook; "Towel's down" means somebody is about to die | Issue 2 | 26, 32 | SERIES_BIBLE §5, §9 |
| the flask | Otti | | Issue 20 | 41 (raised as she dies) | SERIES_BIBLE §4, Issue 41 |
| the empty harness | Otti (Merrow's) | | Issue 22 | 40, 41 | SERIES_BIBLE §9 |
| the slate | Silas (when Surged out) | "Darling, I was never going to", rubbed out | Issue 18 | 19 (slate-flirting), 46 | SERIES_BIBLE Issue 18 |
| bond-cutter | Sever troopers | hooked blade that glows white; held on the mark for a full count of ten | Issue 2 (seen), 3 (used) | 36, 42 | CAST.md; SERIES_BIBLE §9 |
| the lance | Hekka | bond-cutter lance taller than she is; scorched after Issue 12 | Issue 11 / Ep 11 | 25 | CAST.md; issue-12.js |
| the chain-blade | Silas | curved knife on a long chain | Issue 15 | 18 | CAST.md |
| the gauntlet | Kaito | fingerless metal gauntlet, right forearm; lightning arcs through it | Issue 1 | 42 | CAST.md |
| Juno's gloves | Juno | hide the palms; off only to fight (8, 9, 41) and once for Kaito (40) | Issue 6 | 8, 40 | SERIES_BIBLE §9 |
| the Longwake Chart | Saltlight's prize | the best map in the world; burns in 27, Kaito keeps a piece | Issue 19 (named), 20 | 27 | SERIES_BIBLE Issue 20; conflict 5 |
| the Steam Ledger | Maro | every smuggler who sold to the Sever; Silas's name on page one | Issue 16 | 17, 18 | SERIES_BIBLE Issue 16 |
| the torn page | Silt | the page with his name from Sela's logbook | Issue 19 | 41 | SERIES_BIBLE §9 |
| Vasch's chart | Vasch | the count: "One" (5), "Two" (10), "Three" (27), "Four", "Five" (39) | Issue 5 | 42 | SERIES_BIBLE §9 |
| the betting pool | the crew, chalked on the mast; Nim's book | "Kaito and who?" | Issue 10 | 40 (Juno bet on herself) | SERIES_BIBLE §9, §10 |
| Tam's caulking mallet | Tam, then Bram (DOSSIER) | | Issue 29 | 32 | bram.md |

---

## 9. The Sever symbol and uniform

- **Symbol:** a straight line cutting a circle. A cut bond, and (Issue 35) the map: the ten Great Pylon sites draw it across the Drift. On the chest since Issue 1. `CAST.md`; `SERIES_BIBLE.md` §3, §9.
- **On cloth (locked by `trooper-sheet-v1.png`, `art/refs/STYLE.md`):** a flat black bar across the chest with a white ring at its centre, cut by the bar; **front only, back plain**. It is "the one allowed symbol".
- **Vasch:** black bar and **black** ring on the white coat (white would vanish on white). **Hekka:** black bar and white ring on the grey chest plate. **Troopers:** black bar, white ring, grey coat. **Maro:** no bar (conflict 30).
- **Uniform:** long grey coat to the knee, closed and belted, white collar; grey helmet with a black visor over the eyes, jaw showing; black gloves, belt and boots; dark grey trousers; bond-cutter on the belt at the right hip. White coat for the Director only. `CAST.md`; `STYLE.md`.
- **Hollows:** stripped monsters fitted with armour plates, cables and a glowing white core where the bond was; blank eyes. `CAST.md`.
- **Standing Order 12** is canon in full, word for word from `shared/stories.js` ("order" card) and read aloud in `issue-03.js`: "A bond-cutter is to be held at the bond mark for a full count of ten. Subjects will scream. Partners will scream louder. Do not stop at the count of five; a half-cut bond does not make a Hollow, it makes a problem. Do not speak to the subject. Do not name the monster. Report any trooper who names the monster. By order of the Director, who reminds you that this is mercy." Orders 7 and 9 are DOSSIER (`villains.md`).
- **Structure (DOSSIER, `villains.md`):** Director; the ten officers; Captains, Wardens, Deacons, Ledgers, Doctors, Hunters, Ostlers; troopers. Founded eleven years ago by the Regent's warrant.

---

## 10. Pals (twelve; the Monster Book)

Looks from `docs/FRIDAY_BATCH.md` and `shared/pals.js`; "first met" is the Fizzlet's Grand Tour serial part that first introduces it (section 12; conflict 6). Save ids in brackets where they differ from the shown name.

| Pal | Look | Game | Serial first meets it | Source |
|---|---|---|---|---|
| Fizzlet | a fluffy storm cloud on two stubby legs; sneezes thunder, apologises by raining | Storm Run | Part 1 (Issue 1): the tour's hero | FRIDAY_BATCH; pals.js |
| Boltnip | a tiny gecko with a kite-tail that sparks | Storm Run | Part 21 (Issue 21) | |
| Bobbin | a jellyfish shaped like a striped buoy; wants to be counted as crew | Tide Gap | Part 2 (Issue 2) | |
| Mopclaw | a shy crab wearing a mop-head as a shell | Tide Gap | Part 3 (Issue 3); re-met 4, 11, 12 | |
| Kindlekin [cinderbun] | a warm ember dumpling with tiny feet | Hot Hand | Part 39 (Issue 39); issues still say "Cinderbun" (conflict 29) | DECISIONS 2026-11-07 |
| Dicemite | a beetle-mite with a lucky pip-marked shell | Hot Hand | Part 6 (Issue 6); re-met 7, 8, 10 | |
| Tuftle | a puff of shadow fur with two big eyes | Silent Cut | Part 15 (Issue 15) | |
| Lamplick | a moth that licks lantern glass | Silent Cut | Part 16 (Issue 16); re-met 18, 20 | |
| Rivetling | a little iron hedgehog studded with rivets | Hold the Deck | Part 28 (Issue 28); re-met 29 to 32 | |
| Spoonling | a begging stowaway with a ladle tail | Hold the Deck | Part 45 (Issue 45) | |
| Prismule [glimmick] | a snail with a faceted crystal shell | Split Light | Part 34 (Issue 34); issues say "Glimmick" (conflict 29) | DECISIONS 2026-11-07 |
| Shardle | a round glass chick that chimes | Split Light | Part 38 (Issue 38); its egg from Part 24 if conflict 28 is taken | |

Rules: Pals are never in flirting, innuendo or a bath gag; no bonds, marks or costs; caught once only, two hidden per game, shown in the Monster Book from the shared save. `FRIDAY_BATCH.md`; `SERIES_BIBLE.md` §1.5; `world.md` §8. Not Pals: Skrit (Issue 13) and Egg (conflict 28).

---

## 11. Terms

| Term | Meaning | Source |
|---|---|---|
| the Drift | the sea of drifting and floating islands; maps go stale | WORLD_BIBLE |
| a bond | human and monster bound; the human borrows its element and pays a price | WORLD_BIBLE; CAST.md |
| bond mark | a glowing simple shape in the partner's colour on the skin where the bond sits; brighter in a Surge; "the one thing that must match on every image" | CAST.md |
| Surge | borrowing the partner's power; small ones are safe, big or long ones cost | CAST.md |
| the Short Surge | small bursts on the beat, Otti's teaching (Issue 22); the beat is the Undersong | SERIES_BIBLE Issue 22; world.md §3 |
| Dive | Sela's deep Surge under an island; drowns a memory (in Tide Gap, a logbook line for the run only) | FRIDAY_BATCH; SERIES_BIBLE Issue 13 |
| Hollow | a stripped monster rebuilt as a weapon: plates, cables, white core, blank eyes | CAST.md |
| the Sever | the Meridian Empire's secret unit that hunts partners and cuts bonds | CAST.md |
| the Meridian Empire | wants to stop the Drift by pinning islands with anchor pylons | CAST.md |
| a pinning / pylons | steel anchors driven through an island; the island stops and its charts become right; birds go, wells die, soil greys | SERIES_BIBLE Issue 1; world.md §5 |
| the Great Pylons | ten, one per chosen island, together one bond-cutter the size of the sea; their sites draw the Sever symbol | SERIES_BIBLE §3 |
| Anchor Day | the day a Great Pylon is planted on an island (bunting on the chains, Issue 48) | SERIES_BIBLE §3; issue-48.js |
| the Count | Vasch's tally of Great Pylons: "One" (5) to "Five" (39); stopped at five in Issue 42 | SERIES_BIBLE §3, §9 |
| the Sleeper | the sleeping world-sized being that carries the islands; the First Bond | SERIES_BIBLE §3 |
| the Undersong | the Sleeper's slow pulse heard as a very low hum; drawn as three small wavy lines, never words (Issues 1, 13, 34; 41, 48) | SERIES_BIBLE §3, §9 |
| the Cantors | drift-singers of Cantor Isle who steered by the Undersong; "pup" is their word for the youngest voice (DOSSIER) | SERIES_BIBLE §3; sela.md |
| the Problem | what a half-cut world does in the two-year gap: islands collide, currents reverse, monsters go mad | SERIES_BIBLE §3 |
| the half-cut | a bond cut to five: unstable, regrows wrong (Ione's crystal; Skarn's one blank eye) | SERIES_BIBLE §3; issue-48 |
| mercy clinics | Part Two: free strips for the starving, and they work | SERIES_BIBLE Issue 45 |
| salvage | the games' currency, earned in every game; story cards unlock from lifetime salvage | FRIDAY_BATCH |
| the Monster Book | the homepage list of caught Pals | WORLD_BIBLE |
| the Regatta | the Longwake Regatta, every seven years on Saltlight under a truce | SERIES_BIBLE Issue 20; issue-20.js |
| Ember Night | Ashmarket's festival when every lantern is relit from one flame; Krell's deadline | SERIES_BIBLE Issue 7; juno.md |
| "Last Ember" | the High Table card game | issue-08.js |

---

## 12. Rules of bonding

1. Every bonded human has a glowing mark where the bond sits, a unique simple shape in the partner's colour. `CAST.md`.
2. Six lab elements, one per lead: Storm, Tide, Fire, Wind, Iron, Crystal; no two partners overlap. `CAST.md`. (Dossiers add Brine, Frost, Echo, Sand, Salt, Light for others: DOSSIER.)
3. Small Surges are safe; big or long ones cost one thing per person: scars, memory, heat, breath, iron, crystal. Each cost has a base state and gets worse. `CAST.md`.
4. **Costs stay paid.** No memory returns; iron never softens; a stripped mark goes to a dull ring. The one exception is Ione's wrong-shaped regrowth. `SERIES_BIBLE.md` §3; `world.md` §3.
5. Stripping: a bond-cutter held on the mark for a full count of ten (Order 12). At ten the mark goes dark and scars to a ring; the monster is left with a white core and becomes a Hollow. `stories.js`; `CAST.md`.
6. Stopping at five makes a half-cut bond: it does not make a Hollow, "it makes a problem"; re-cutting kills the subject; it regrows wrong. `stories.js`; `SERIES_BIBLE.md` §3.
7. Every bond is a thread of the First Bond with the Sleeper; pin ten points and cut, and every bond strips at once. `SERIES_BIBLE.md` §3.
8. Partners do not talk. They act, grumble and judge. `SERIES_BIBLE.md` §5.
9. The bond takes; it is not made: every bond on record began with a person sitting down beside a hurt or trapped creature and staying. DOSSIER rule drawn from every dossier (`world.md` §3).
10. Bonded humans and partners feel a worldquake at once (Issue 5). `SERIES_BIBLE.md` Issue 5.

---

## 13. Timeline (years before Issue 1 as negative numbers; Part Two is +2)

CANON rows are in the bible or an issue; DOSSIER rows are only in backstory files (ages still add up to CAST.md's).

| Year | Event | Status | Source |
|---|---|---|---|
| about -300 | the Longwake Chart begun ("Three hundred years of every captain") | CANON | issue-20.js |
| -40 | Meridian "anchored for forty years" by ordinary pylons (Empire's claim) | DOSSIER | world.md §5; villains.md |
| -20 | the Anchor Seat empty; Emeric Hale made Regent; Anchor Day begins as a day of mourning | DOSSIER | villains.md; world.md |
| -15 | the cliff night: Kaito (6) struck by lightning, the white streak; Oren gone by morning | CANON | SERIES_BIBLE Issue 3 |
| -13 | Vasch (33) builds the first bond-cutter and uses it on himself | DOSSIER | villains.md |
| -11 | Sela (17) bonds Vesh on Ninefathom; the first logbook | DOSSIER | sela.md |
| -11 | the Sever founded on Vasch's paper | DOSSIER | villains.md |
| -10 | Oren's survey reaches Vasch (36) (conflict 24) | DOSSIER | villains.md |
| -9 | the Empire's first pinning; Bram (22) loses the Patience, his father and his wife; Tam (58) hands him a hammer (Lowmoor vs Tallis Bank: conflict 23) | CANON (bible Issue 29) / DOSSIER (names) | SERIES_BIBLE Issue 29; bram.md |
| -9 | Sela (19) signs on the Gullwake under Captain Hesper Lund; Corin Vale is first mate (conflict 20) | DOSSIER | sela.md |
| -8 | Sela (20) inherits the Gullwake; her deepest Dive saves the ship and drowns every memory of Corin; he tears out his page and walks away | CANON | SERIES_BIBLE §3 |
| -8 | Bram (23) finds Grist in Keelbreak's slag heap; bonds at 24 (-7) | DOSSIER | bram.md |
| -7 | Vasch finds Corin; Corin strips Burr himself, full count (conflict 21) | CANON (bible) / DOSSIER (year) | SERIES_BIBLE §3; villains.md |
| -7 | Ione (19) meets Vasch on Hallam Stair; joins the labs at 20 (-6) | DOSSIER | ione.md |
| -6 | the Sever takes Cantor Isle's partners | DOSSIER | allies.md; world.md |
| -5 | Bram (26) joins Sela's (23) crew at Keelbreak | DOSSIER | bram.md; sela.md |
| -5 | Ione (21) posted to the Glass Ward; Silas (19) makes his first partner sale for Maro | DOSSIER | ione.md; silas.md |
| -4 | Ione (22) bonds Prism; writes Order 12's field text; Hekka (29) strips her bear in Ione's lab (conflict 25) | DOSSIER | ione.md |
| -4 | Juno (19) staked by her father; works the furnaces to 22 | CANON (spoken, Issue 10) | SERIES_BIBLE Issue 10 |
| -3 | Vasch stops at five on Ione (23); her white lock | CANON | SERIES_BIBLE Issue 36 |
| -3 | Juno (20) bonds Ashka at Furnace Six | DOSSIER | juno.md |
| -3 | Silas (21) bonds Hush at Tallow Dock; nine days without a voice | DOSSIER | silas.md |
| -3 | the Sever takes Lowmark's partners; Otti (49) loses Merrow | DOSSIER | allies.md |
| -2 | Kaito (19) bonds Skarn on the Strikes | DOSSIER | kaito.md |
| -1 | Ione (25) walks out of the Meridian labs with Prism; a year on the run | DOSSIER | ione.md |
| -1 | Kaito's first scar (20) | DOSSIER | kaito.md |
| 0 | Issue 1: Pinhold; Great Pylon One; "One" (Issue 5). The night of the eleven is Issue 15 | CANON | SERIES_BIBLE |
| 0 | Part One, Issues 1 to 42 (Issues 49 to 51 are fillers set between 10 and 11, 19 and 20, 27 and 28) | CANON | issue-49.js to 51 |
| 0, Issue 42 | the Sixth Pylon wrecked; the count stops at five; the Gullwake torn apart; "TWO YEARS LATER" | CANON | SERIES_BIBLE Issue 42 |
| +2 | Part Two, Issues 43 on: everyone two years older | CANON | SERIES_BIBLE §8 Arc 9 |

---

## 14. Running gags, catchphrases, Galley Rules

**Running gags** (`SERIES_BIBLE.md` §10): Kaito walks into things; the betting pool chalked on the mast and Juno's odds; Grist asleep where he isn't wanted; Skarn's disgusted face; Bram's Galley Rules (a new rule each time); Silas's shirt (Hush eats the buttons: DOSSIER); Ione's starred footnotes; Sela's logbook entry on what just happened as the punchline; "Vegetable."

**Catchphrases and who owns them** (`SERIES_BIBLE.md` §5; `stories.js`; `crew.js`):

| Line | Owner | Source |
|---|---|---|
| "Screw that." / "Screw your mercy." | Kaito | SERIES_BIBLE §5, Issue 3 |
| "Pup" (first said Issue 4, after Silt has gone); "Mr. Brask" before that | Sela only (conflict 10) | SERIES_BIBLE §3; WRITER_HANDOFFS Issues 1, 4 |
| "The ears go red first." | Sela, about Kaito | stories.js "pup" |
| "Five to one you're about to do something stupid." / "sweetheart" | Juno | SERIES_BIBLE §5 |
| "darling" / "the stew is sultry" | Silas | SERIES_BIBLE §5; stories.js |
| "Towel's down." / "Vegetable." / "You're two ladles." | Bram | SERIES_BIBLE §5; issue-05.js |
| "I can be very thorough." / footnotes | Ione | SERIES_BIBLE §5; stories.js |
| "Mercy" / "I can wait." / "He said you'd have his temper." | Vasch | SERIES_BIBLE §5, Issues 36, 37 |
| "Found you." / "Why do you run? It's the same sea." / "You made it up." / "Six is at Meridian. Bring the song." | Silt | SERIES_BIBLE Issues 1, 4, 41, 48 |
| "Still here." | Pinhold's greeting | WRITER_HANDOFFS Issue 1 |
| "You beautiful moron." / "Drink, swim, regret." / "You're out of booze. I'm fixing that." | Otti | SERIES_BIBLE Issues 21, 27, 39 |
| "Who will you tell?" | Maro | SERIES_BIBLE Issue 18 |
| "Numbers are patient." | Maro (DOSSIER) | silas.md |

**Galley Rules, numbered once.** Rules 1 to 5 are canon word for word from `shared/stories.js` ("house-rules" card). From 6 on, the register keeps each number's first-written wording and lists the clashes to renumber (conflicts 3 and 4).

| No. | Wording | Where | Clashes to renumber on the next pass |
|---|---|---|---|
| 1 | Nobody fights in my galley. | stories.js; ep-02; Issues 19, 30, 31, 45 | Issue 29 "TAM EATS FIRST" (one-day chalk joke) |
| 2 | Juno, cards are not a food group. | stories.js | |
| 3 | Silas, stop calling the stew "sultry". | stories.js | |
| 4 | Kaito, you will eat a vegetable if I have to hold you down. | stories.js; Issues 5, 24 | |
| 5 | If I go quiet and put the towel down, get behind Grist, and bring the pot. | stories.js | |
| 6 | Nobody feeds Grist from the table. He doesn't stop. | Issue 39 (chalked on the oven); ep-05 "a fresh 6" | ep-03/05/07/09 "Nobody stands in my door looking hungry", "Deckhands eat a vegetable", "Nobody fights in formalwear"; juno.md's "Galley Rule Six" about Ashka's hoard |
| 7 | Grist is not furniture. | ep-07, ep-09 | |
| 9 | Nobody sits on the flour. | Issue 5 | ep-10 "No betting on the table while you're on the table"; Issue 10 "Quiet after midnight" |
| 10 | Bath night. Everybody. | ep-10 | |
| 11 | Nobody argues on an empty stomach. | Issue 3 | |
| 31 | Knock. | Issue 12 | Issue 20 "Nobody races hungry"; Issue 23 "Look where the beetle is" |
| 32 | Nobody races on an empty stomach, and nobody races on a full one. Half a bowl. | Issue 21 | Issue 23 "Nobody fights before porridge"; Issue 24 "Don't run with—" |
| 33 | Nobody wakes Grist for a drowning. | Issue 13 | Issue 22 "Nobody asks the cook for odds"; later "Nobody watches a man suffer on an empty stomach" |
| 34 | Nobody courts the cook mid-stew. | Issue 22 | |
| 35 | Nobody drinks alone past midnight without soup. | Issue 22 | |
| 36 | Forty runs earns a second bowl. | Issue 16 | Issue 22 "Waste nothing" |
| 37 | Nobody flirts with the cook till the cook's eaten. | Issue 16 | |
| 39 | Nobody skips a meal for a feeling. | Issue 18 | |
| 40 | Nobody watches a fight on an empty stomach. | Issue 25 | Issue 37 "Ask first"; Issue 41 "Everyone comes back for stew" |
| 41 | Taste before you talk. | Issue 25 | |
| 42 | (Issue 27; wording not quoted in the script's text field) | Issue 27 | |
| 43 | Nobody mends a hull hungry. | Issue 29 | |
| 45 | (Issue 31; renumbered from Forty by its auditor) | Issue 31 | |
| 52 | Nobody asks the cook what he will and won't do while the bowl's still full. | Issue 43 | |
| 60 | (Issue 45; wording not quoted) | Issue 45 | |
| 63 | A boat with a pot in it is a galley. | Issue 46 | |

---

## 15. Plants and payoffs (from `SERIES_BIBLE.md` §9; plant exactly as shown)

| Plant | Where planted | Payoff |
|---|---|---|
| Sever symbol, line through a circle | everywhere from Issue 1 | Issue 35 |
| Charts "finally right" on a pinned island | Issues 1, 4 | Issues 35, 37, 48 |
| "Ask him about the song" | Issues 5, 14 | Issue 41 |
| "Pup" | Issues 4+ | Issues 19, 41, 46 |
| Silt's torn page | Issue 19 | Issue 41 |
| Silt's question "Why do you run?" | Issue 4 | Issue 48 |
| Sound of the Undersong (three small wavy lines, no words) | Issues 1, 13, 34 | Issues 41, 48 |
| Kaito's father's survey sheets | Issues 1, 3 | Issues 37, 47 |
| Bond-cutter "do not stop at five" | Issue 3 (read aloud in full) | Issues 36, 42 |
| Vasch counting on his chart | Issue 5 ("One"), 10 ("Two"), 27 ("Three"), 39 ("Four", "Five") | Issue 42 |
| Otti's empty harness | Issues 22, 40 | Issue 41 |
| Bram's towel | Issues 2, 26 | Issue 32 |
| Betting pool "Kaito and who?" | Issue 10 onward | Issue 40 |
| Juno's gloves off | Issue 8 | Issue 40 (she takes them off for him; only the hands are shown) |
| Eleven monsters Silas freed | Issue 15 | Issue 39: they come back with new humans |
| Juno's sealed pool bet under her glove cuff | Issue 10 | Issue 40 (WRITER_HANDOFFS) |
| Tunnel tally marks under Ashmarket | Issue 9 | open thread (WRITER_HANDOFFS) |

---

## 16. PROPOSED, not canon (`docs/manga/NEW_CREW_PROPOSALS.md`)

Everything in this section is **PROPOSED** and waits on Dylan. Nothing from it appears in CAST.md, the site, the games or any issue.

- **Petra Marlowe ("Doc")**, 34, 170 cm, ship's surgeon; mark a hollow diamond on the inner right forearm, coral pink; partner **Alum**, a salt moray; element **Salt**; power salt-crusting; cost drying out (chapped lips, salt-crusted knuckles, tile-pattern cracks). Proposed join: between Issues 27 and 28 (or 38 and 39). Proposed game `salt-line` (Saltlight; boss Doctor Pike); proposed Pals **Brinelet**, **Gauzewig**. Running gag: calls everyone by their injury.
- **Reuben Fell**, 34, 185 cm, the grower; mark a seed with one shoot on the right cheekbone, moss green; partner **Fallow**, a bark-scaled pangolin; element **Root**; power growing; cost years (he ages). Proposed join: between Issues 45 and 46 (Part Two). Proposed game `fallow-ground` (Dunmarrow; boss Deacon Sorrel); proposed Pals **Peatling**, **Twigget**. Running gag: things sprout where he sat.
- Proposed filler premises: "Portrait Day", "Where's Grist", "Three Birthdays".
- Open decisions listed in that file: approve, change or drop each; where Petra joins; whether a Part Two island can be a game; romance routes; which fillers become Issues 52 to 54.

---

## 17. Hard rules this register keeps (from `docs/WORLD_BIBLE.md`)

Every character is an adult with a stated age of 21 or more (the youngest named person in any file is Kaito at 21; walk-ons and flashback adults are 21+; children appear only in Kaito's Issue 3 and 37 flashbacks, drawn plain and sad). No nudity, no sexualized posing or camera framing, no explicit scenes; romance fades to black; nothing of that kind near a Pal, a childhood memory or anyone hurt or frightened. Original only: no copied characters, names, symbols, outfits or lines from any show (conflicts 1 and 2 are the two places that rule is currently at risk). Mature tone (violence, injury, death, swearing) is fine.
