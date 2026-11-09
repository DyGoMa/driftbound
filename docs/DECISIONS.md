# Decisions log

## Your words (2026-10-30)
- Request: "create a game collection website like miniclip.com, coffeebreak.com, addictinggames.com or newgrounds.com. The only thing is all of the games need to be made to be connected using the same characters/universe in all of the games. It should be anime style. I want you to make all of the calls on everything. You will set up the orchestrator for this project and have as many parallel workers running needed to get this done. We will be using our last usage every week to do this."
- Usage at start: "Ive got 10% or so usage"
- Where it lives: **GitHub repo**
- Weekly run: **I start it myself**
- Week 1 scope: **World, site, 1 game**
- Art: **Drawn in code**
- Play link: **Public repo + free link** (GitHub Pages)

## Your words (2026-10-30, v2 direction)
- Request: "Can we make the art style more 00's anime style like Naruto, one piece and full metal Alchemist. Make them more human like shapes. We will be adding a video section for a short anime stories and also a visual novel section. We want it to be more adult 18+ theme with fan service."
- Art: "Option 1 but I want you to make refinements and checks before getting me to check it." (AI images locked by ref sheets)
- Rating: Mature: violence, swearing, romance
- Cast: "Option 2 mix in a pokemon style world where there's some monsters/partners/pals" (brand-new adult cast)
- First up: New art and cast first
- World frame: Drop the arcade, one big world
- Partners: 1 partner each + collectible pals
- Cast size: 6 leads + villain group
- Fan service: "Option 2 plus they wear more revealing outfits for the woman and more innuendos" (Option 2 = stylish designs + flirty comedy + romance routes)
- Setting: Island frontier + strange science
- Power: Fight side by side, borrow its power
- Leads: 1 main hero + 5 crew; 3 women, 3 men
- Main hero: A hot-headed young man
- Villains: Empire unit hunting partners
- Name: Driftbound
- Videos: Motion comics
- VN engine: Small custom engine
- Monsters: Mostly cool beasts, some cute
- Next step: Save plan + fresh-chat starter
- Line Claude set (not your choice; your call to discuss): all characters clearly adult (21+); bold outfits but no nudity, sexualized framing or explicit scenes.

## Calls Claude made (v1, Hoshi Arcade; superseded where the v2 answers above differ) (you delegated these; change any of them)
| Call | Choice | Easy to change? |
|---|---|---|
| Site name | Hoshi Arcade ("hoshi" = star) | Yes, one line in each page title |
| World | A shrine arcade in the town of Hoshimachi; a glitch monster called The Static is eating the games | Medium |
| Cast | Aki (runner, hero), Mochi (fox spirit, mascot), Ren (swordsman), Yuzu (inventor), The Static + Glitchlings (villains) | Medium |
| Shared link between games | One shared Star Shard total; every game adds to it and it unlocks story cards on the homepage | Yes |
| Game 1 | Aki Dash, a one-tap endless runner (works on phone and keyboard) | Yes |
| Tech | Plain HTML + JavaScript, no build step, no add-ons; runs from any static host (GitHub Pages) | Hard later, so chosen early on purpose |
| Workers this week | None. Week 1 had ~10% usage, and workers cost the same as doing it directly. Workers start in week 2, one per game (see ORCHESTRATOR.md) | Yes |

## Your words (2026-10-30, build step 1)
- Request: "start build step 1: design the 6 adult leads, their partners and the Empire villain unit on paper, and list every call you made for my OK. Don't start images until I've said yes to the cast and to the image spend. Push only on my yes."
- Usage screenshot: mentioned, but it didn't come through in the chat. Needed before the image-spend ask.

## Calls Claude made (v2 cast, approved 2026-10-30) (full detail in `docs/CAST.md`)
| Call | Choice | Easy to change? |
|---|---|---|
| Ship and crew name | The Gullwake | Yes |
| Bond mark | Glowing mark on the skin, unique shape per lead, partner's colour | Yes now; hard after ref sheets |
| Surge | Name for borrowing power; each lead has one cost with a visible "base state" for the ref sheet | Yes now |
| Elements | Storm, Tide, Fire, Wind, Iron, Crystal (one per lead) | Yes now |
| Hero | Kaito Brask, 21; storm wolf Skarn; cost = lightning scars up his right arm (base: hand to elbow) | Yes now |
| Captain | Sela Vey, 28; sea serpent-dragon Vesh tows the ship; cost = lost memories (keeps a logbook) | Yes now |
| Sharpshooter | Juno Calloway, 23; fire raptor Ashka; cost = burning heat (scarred palms under gloves) | Yes now |
| Duelist | Silas Moreau, 24; wind owl-lynx Hush; cost = loses his voice | Yes now |
| Shipwright / cook | Bram Torvald, 31; iron rhino-beetle Grist; cost = turning to iron (grey patches) | Yes now |
| Scientist | Dr. Ione Raske, 26, Empire defector; glass mantis-moth Prism; cost = crystal growths from a half-stripped bond | Yes now |
| Empire name | Meridian Empire; wants to pin islands in place with anchor pylons | Yes now |
| Villain unit | The Sever; strips bonds and rebuilds monsters into Hollows | Yes now |
| Villains | Director Aurel Vasch (46, leader, Ione's mentor), Captain Hekka Dorn (33, enforcer, Sela's rival), Silt (29, masked hunter, Kaito's rival), faceless troopers | Yes now |
| Sever symbol | A straight line cutting a circle | Yes now |
| Heights | In cm with feet/inches | Yes |
| Not decided yet | Pals, romance routes (step 4) | — |

## Your words (2026-10-30, cast check)
- Cast: "Lock it in"
- Hero power: "Storm wolf"
- Bond costs: "Yes, visible" (each ref sheet shows the base state)
- Villains: "Keep the trio"

## Your words (2026-10-30, after the cast)
- Push: "Push now"
- Images: "Style test first" (Kaito + Skarn only, 2 sheets, ~3 images with a redo)

## Your words (2026-10-30, build step 2 style test)
- Request: "Make reference sheets for Kaito Brask and his partner Skarn only (2 sheets, about 3 images with one redo) using game-image-gen. Original 2000s-anime look: four views (front/back/side/3-4), grey background, no text, no Naruto symbols. Kaito's base state: lightning scars from hand to elbow, bond mark on the back of his right hand. Check each sheet against CAST.md and redo failures before showing me. Save as new files in art/refs/ (never overwrite). Ask before each image. Push only on my yes."
- Usage screenshots: mentioned again, but didn't come through in the chat.
- Gauntlet vs. scars (both on the right forearm): "Open bracer" (bands and plates with gaps; scars show through and around it)
- Image 1 (Kaito): "Yes, make Kaito"
- Branch: `art/style-test-kaito-skarn`
- Kaito take 1 failed Claude's check (scars past the elbow, hair streak swapped sides in the back view, eyebrow scar faint, hand mark looked like a "K"). Redo: "Yes, redo Kaito"
- After take 2 passed Claude's check, before Skarn: "we should do front/left side/right side/back views incase we want to do a 3d model of the character. other than that he looks pretty good. side view does show both of the feet/boots. also should we do an a or t pose instead of the pose we have now"
  - This changes the views in the original request ("four views (front/back/side/3-4)") to front / left side / right side / back.
- Pose: "A-pose"
- Side views: "Make true profile"
- Order: "Kaito first, then Skarn" (Kaito remade in the new layout as image 3; ask before Skarn as image 4; one redo each only on Dylan's yes)
- Kaito take 3 failed Claude's check (no A-pose; white streak missing in the right-side view). Redo: "Yes, redo Kaito"
- Kaito take 4: shown to Dylan (A-pose and streak fixed; eyebrow scar faded from the left-side view).
- Kaito take 4: "Fix the scar"
- Skarn (image 5): "Yes, make Skarn"
- Kaito take 5 (image 6): the eyebrow scar still did not appear in the left-side view; the image came back almost the same as take 4. Second failed try on the same fix, so Claude stopped on it.
- Skarn take 1 failed Claude's check (bare spines with no sail membrane; tail missing from the back view).
- Kaito scar: "Paint it in by hand" → take 6 = take 4 with a scar line painted through his left eyebrow in the left-side view, and (Claude's call) also in the front view, where take 4's scar was only a faint line above the brow.
- Skarn redo (image 7): "Yes, redo Skarn"
- Skarn take 2: sail membrane fixed; tail still missing from the back view (second miss on that point, so Claude stopped). Shown to Dylan with Kaito take 6.
- Skarn tail: "One fresh try" (image 8 = Skarn take 3)
- Dylan's check of Kaito take 6: "kaito scar is still showing on both side views. streak in hair looks inconsistent in the views as well"
  - Scar: "Right side has a mark" (a faint line on the forehead above the brow in the right-side view)
  - Streak: "Yes, fix the streak" (image 9 = Kaito take 7; one lock from above the right temple to the jaw in front of the right ear)
- Push: "Commit and push" (pushed branch `art/style-test-kaito-skarn` at d890de0, takes up to Kaito 6 / Skarn 2)
- Kaito take 7: streak matches in all views and the right-side forehead is clean; the left-side eyebrow scar came back faint. Take 8 = take 7 with that scar repainted by hand.
- Skarn take 3: tail still missing from the back view (third miss); otherwise the same as take 2.
- Kaito: "Kaito passes" → locked sheet `art/refs/kaito-sheet-v8.png`
- Skarn: "Take 3, as is" → locked sheet `art/refs/skarn-sheet-v3.png` (tail shown in the side views only)
- Push: "Commit and push"
- Images used in this step: 9 Codex images (Kaito takes 1–5 and 7, Skarn takes 1–3); Kaito takes 6 and 8 were painted by hand (no Codex use).

## Your words (2026-10-30, build step 2: crew sheets)
- Request: "Driftbound, build step 2: reference sheets for the other five leads and their partners." Scope: Sela + Vesh, Juno + Ashka, Silas + Hush, Bram + Grist, Ione + Prism (10 sheets); villains not in this step. One pair at a time, stop after each pair for Dylan's check. Ask before each image; redo failures before showing, each redo with its own yes. Push only on Dylan's yes.
- Usage screenshots: mentioned again, but didn't come through in the chat. "Go ahead without them"
- First pair: "Juno + Ashka"
- Branch: `art/ref-sheets-crew` (off `art/style-test-kaito-skarn` at b1f8c65)
- Juno palms vs. gloves: "Burns peek out" (gloves on; red blistered skin shows at the glove edges, fingers and wrists)
- Juno shoulder mark vs. open bomber (a clash Claude found; not on Dylan's list): "Jacket off both shoulders" (bomber slipped down to her elbows)
- Ashka pose: "Wings folded"
- Juno braid: "Over her left shoulder" (Claude's call to go with it: bandolier and rifle strap also over her left shoulder, keeping the right-shoulder mark clear)
- Image 1 (Juno take 1): "Yes, make Juno"
- Juno take 1 passed Claude's check (mark on her right shoulder on the correct image side in front, right-side and back views, hidden in the left-side view; braid, bandolier and rifle strap over her left shoulder; burns at glove edges on both hands; jacket off both shoulders; faint freckles). Notes: the mark reads as a plain feather with only a slight flame tip; it is a soft glow in the front view.
- Image 2 (Ashka): "Fix Juno first"
- Juno take 1 fix: "move the mark to her collarbone and put the jacket on properly. it also isnt on properly in the back view"
  - This changes CAST.md ("a flame-shaped feather on her right shoulder") and the earlier answer "Jacket off both shoulders".
  - Mark side: "Right collarbone" (Sela's is on her left collarbone)
  - CAST.md: "Yes, update CAST.md" (old line kept word for word in CAST.md's archive)
  - Image 2 (Juno take 2, an edit of take 1): "Yes, make Juno take 2"
- Juno take 2 passed Claude's check (jacket on both shoulders in every view, including the back; mark crisp on her right collarbone in the front view, a small glimpse at the neck in the right-side view, not shown in the left-side or back views; everything else matches take 1). Slip: Kaito's sheet was not passed as the style reference for this edit (only take 1 was); the style still matches take 1.
- Image 3 (Ashka): "Fix Juno again first"
- Juno take 2 fix: "left side view braid isnt in front of neck. pocket on jacket shouldnt be on right side view. shotgun is free floating on her back. make the makr closer to her chest so its more visible"
  - CAST.md calls the gun "a long-barrelled rifle"; Claude kept it a rifle.
  - How: "Two edits, two images" (edit 1 = braid + sleeve pocket; edit 2 = gun strap + mark)
  - Mark spot: "Just below the collarbone" (CAST.md updated; old line archived)
  - Image 3 (Juno take 3, edit 1 of 2): "Yes, make Juno take 3"
- Juno take 3 passed Claude's check (left-side braid now in front of her neck and chest; right sleeve plain, pocket on the left sleeve only; other views unchanged). Note: in the left-side view the braid's end splits into two loose tails below the tie.
- Image 4 (Juno take 4, sling + mark): "Fix take 3 first"
- Juno take 3 fix: "lower the mark closer to her chest. side view hair braid still isnt correct. take away the gun and ammo belt its too complicated of a detail and is messed up."
  - This clashes with CAST.md ("ammo bandolier across her chest", "a long-barrelled rifle on her back"; she is "the sharpshooter").
  - Gun and belt: "Remove both from her design" (CAST.md outfit line archived word for word; her gun is decided later)
  - Side braid: "Left: hangs straight down; right: hidden" (left-side view: falls straight down in front of her shoulder, one tail; right-side view: hidden, only the tip peeking past her chest)
  - How: "Two edits, two images" (edit 1 = remove gun and ammo belt; edit 2 = side braid + mark lower)
  - Image 4 (Juno take 4, edit 1 of 2): "Yes, make Juno take 4"
- Juno take 4 passed Claude's check (rifle and bandolier gone from all four views, no leftover straps; everything else unchanged from take 3).
- Image 5 (Juno take 5, edit 2 of 2: side braid + mark lower): "Yes, make Juno take 5"
- Juno take 5 passed Claude's check (mark on her upper chest below the right collarbone, larger, feather with a flame-curl tip, small glow in the right-side view, hidden in the left-side and back views; left-side braid hangs down in front of the shoulder with one tail; right-side braid hidden; everything else unchanged from take 4).
- Image 6 (Ashka take 1): "Yes, make Ashka"
- Ashka take 1 passed Claude's check (four true views; wings folded; tail plumes show in all four views, including the back; hooked beak closed; ember-red and black feathers with sparks). Not in CAST.md, the model's own additions: yellow eyes and a tall spiky head crest. In the back view the dark feather patch on the back of the head could be misread as a beak at a glance.
- Images used so far in this step: 6 Codex images (Juno takes 1–5, Ashka take 1).
- Pair check: "Both pass" → locked sheets `art/refs/juno-sheet-v5.png` and `art/refs/ashka-sheet-v1.png`
- Push: "Commit and push after you pass them"

## Your words (2026-10-30, build step 2 continued: remaining four pairs)
- Request: "reference sheets for the remaining four leads and partners." Scope: Sela + Vesh, Silas + Hush, Bram + Grist, Ione + Prism (8 sheets); Juno + Ashka done; villains not in this step. One pair at a time, stop after each pair.
- Usage screenshots: didn't come through again. "Go ahead without them"
- First pair: "Sela + Vesh"
- Juno's power line (CAST.md said she "loads Ashka's fire into her bullets", but her rifle was removed): "Fire from her hands" (CAST.md updated; old line archived word for word)
- Sela mark vs. collar (CAST.md: "short cropped navigator's jacket (deep blue, brass buttons, high collar)" and "a spiral wave on her left collarbone"): "Move the mark lower"
  - Jacket front: "Buttoned, low neckline" (top button done up under the high collar, a V opening low enough to show the mark)
  - CAST.md: "Yes, update CAST.md" (mark now "just below her left collarbone"; old line archived word for word)
- Sela props (Claude found; fix 12): "Spyglass right, book left" (spyglass holstered on her right hip, logbook in a strapped belt pouch on her left hip, no slung straps)
- Sela skirt slit (Claude found): "Left leg"
- Vesh fit ("long as the ship"): "Raised head, coiled body" (head and neck up, body coiled tight beneath like a cobra; size lives in the notes)
- Vesh limbs (CAST.md doesn't say): "No legs, side fins"
- Image 7 (Sela take 1): "Yes, make Sela"
- Sela take 1 failed Claude's check: (a) the mark reads as the number "2" (fix 3 wording was in the prompt); (b) the jacket hangs fully open, not buttoned at the top as chosen; (c) the file came out 1774x887, not 2048x1024 (new: the size was passed but not honoured). Passed: mark below her left collarbone on the correct image side in the front view, visible in the left-side view, hidden in the right-side and back views; spyglass on her right hip and logbook pouch on her left hip in every view; slit on her left leg; high ponytail; hoop earrings.
- Image 8 (Sela take 2, edit of take 1: top button + mark shape): "Yes, make take 2"
- Sela take 2: jacket now buttoned once under the high collar with the low V below (fixed); file is 2048x1024 (fixed); everything else unchanged from take 1. The mark still reads as the number "2" in the front view (in the left-side view it is a looser spiral). Second miss on the mark shape, so Claude stopped and asked.
- Sela mark (spiral wave read as "2" twice): "Change it to a whirlpool" (a round spiral curling inward, no tail; CAST.md updated, old line archived word for word)
- Image 9 (Sela take 3, edit of take 2: whirlpool mark): "Yes, make take 3"
- Sela take 3: 2048x1024; the edit came back almost unchanged (fix 11). The mark is still the same 2-like curl with a tail, not a round whirlpool. Everything else unchanged from take 2. Third miss on the mark (first with the whirlpool wording), so Claude stopped and asked.
- Mark fix after take 3: "Remove, then re-add" (edit 1 erases the mark; edit 2 adds the whirlpool on clean skin; each with its own yes)
- Image 10 (Sela take 4, edit 1 of 2: remove mark): "Yes, make take 4"
- Sela take 4 passed Claude's check: 2048x1024; mark gone from every view, clean skin with no leftover glow or lines; everything else unchanged from take 3.
- Image 11 (Sela take 5, edit 2 of 2: add whirlpool mark): "Yes, make take 5"
- Sela take 5 passed Claude's check: 2048x1024; a round teal whirlpool spiral with no tail just below her left collarbone (front view on the right of the image; left-side view an oval seen edge-on at the front of the chest; hidden in the right-side and back views); no 2-like shape; everything else unchanged from take 4. Note: the mark is fairly small.
- Vesh pose vs. STYLE.md's creature pose line ("standing square, legs straight and evenly spaced, head level facing ahead, mouth closed, tail held straight out behind"): "Swap only the pose line" (rest of the creature block word for word)
- Vesh lures (colour not in CAST.md): "Gold"
- Vesh eyes (not in CAST.md): "Glowing teal"
- Image 12 (Vesh take 1): "Yes, make Vesh"
- Vesh take 1 passed Claude's check: 2048x1024; four true views; no legs or arms; head and neck raised over a tight coil, mouth closed; glowing teal eyes; fan-shaped frills on the jaw; paired webbed side fins along the body; one ridge of gold lure bulbs on stalks from the head down the back and along the coil; navy scales with a pale blue-grey belly. Not in CAST.md, the model's own additions: two swept-back horns. Notes: the lures fan out a little over the top of the head in the side views but form a single column above the head in the front view; along the coil they look a bit like a string of lights.
- Images used so far in this step: 12 Codex images (Juno takes 1-5, Ashka take 1, Sela takes 1-5, Vesh take 1); 21 counting the style test.
- Pair check: "Both pass" → locked sheets `art/refs/sela-sheet-v5.png` and `art/refs/vesh-sheet-v1.png`
- Push: "Yes, push"
- Next pair: "Not at my PC so will use compact and use this chat"
- Next pair: "Silas + Hush"
- Silas mark vs. collar (CAST.md: "white shirt unbuttoned to the stomach with a loose high collar" and "three short feather lines down the left side of his neck"): "Collar open, falls back" (CAST.md wording stays)
- Silas hair (Claude found: low tie vs. neck mark): "Straight down his back"
- Silas chain-blade (Claude found; fix 12): "Chain wound round the sash" (sheathed knife at his right hip; nothing crosses his chest)
- Silas mark shape (Claude found; fix 17 risk of reading as III): "Three tiny feathers"
- Image 13 (Silas take 1): "Yes, make Silas"
- Silas take 1 failed Claude's check: (a) hair is blue-black, not dark teal; (b) in the front view a dark smudge rings his RIGHT eye (left of the picture), like a bruise or eyeliner. Passed: 2048x1024; three violet marks down the left side of his neck (front view on the right of the picture, clear in the left-side view, hidden in the right-side and back views); beauty mark under his left eye; collar open and falling back; ponytail down the middle of his back; chain wound round the red sash, sheathed knife at his right hip in every view; forearm and ankle wraps. Notes, not redone: the feathers read more like petals; the boots are chunky lace-ups rather than "soft boots".
- Image 14 (Silas take 2, edit of take 1: hair colour + eyes): "Option 1 but also his left eye in front view looks like there is something on it" (Claude folded both eyes into one eye clean-up change: only one beauty mark below the outer corner of his left eye)
- Silas take 2: hair now dark teal in all four views (fixed); 2048x1024; everything else unchanged. Eyes: his right eye (left of the picture) still has a grey smudge, now partly a hair lock falling across it, and his left eye still shows a faint speck beside the beauty mark. Second miss on the eyes, so Claude stopped and asked.
- Silas eyes after take 2: "One more edit"
- Image 15 (Silas take 3, edit of take 2: front-view eyes only): "Yes, make take 3"
- Silas take 3: came back almost unchanged from take 2 (fix 11): hair lock still over his right eye, grey smudge still there, faint speck by the left eye still there. 2048x1024; nothing else changed. Third miss on the eyes, so Claude stopped and asked.
- Silas eyes after take 3: "I paint them by hand" → take 4 = take 3 with his clean left eye mirrored onto his right eye in the front view (smudge and hair lock gone; one beauty mark, under his left eye). No Codex use.
- Hush size (CAST.md: "a big cat's body"): "Leopard-sized"
- Hush colour: "Smoky grey-violet" (pale owl face disc, darker wing tips)
- Hush wings: "Folded"
- Hush eyes: "Glowing violet"
- Image 16 (Hush take 1): "Yes, make Hush"
- Hush take 1 passed Claude's check on CAST.md and your answers: 2048x1024; four true views; big-cat body on four legs; flat round owl face with pale disc, hooked beak, lynx ear tufts; glowing violet eyes; smoky grey-violet with pale belly and darker wing tips; wings folded along both sides with long blade-pointed flight feathers; short bobtail in the side and back views. Notes: in the back view the ears show their pale insides, as if facing backwards (they should show the dark backs); it reads more soft than menacing; size can't be judged on its own sheet.
- Images used so far in this step: 16 Codex images (Juno 1-5, Ashka 1, Sela 1-5, Vesh 1, Silas 1-3, Hush 1); 25 counting the style test. Silas take 4 was painted by hand (no Codex use).
- Pair check (Silas take 4 + Hush take 1): "Fix Hush's back-view ears"
- Silas: "Silas passes" → locked sheet `art/refs/silas-sheet-v4.png`
- Image 17 (Hush take 2, edit of take 1: back-view ears): "Yes, make take 2"
- Hush take 2 passed Claude's check: 2048x1024; back-view ears now show their dark furry backs with tufts, no pale insides; everything else unchanged from take 1.
- Hush: "Hush passes" → locked sheet `art/refs/hush-sheet-v2.png`
- Push: "Yes, push after locking"
- Images used so far in this step: 17 Codex images (Juno 1-5, Ashka 1, Sela 1-5, Vesh 1, Silas 1-3, Hush 1-2); 26 counting the style test. Silas take 4 painted by hand.
- Next pair: "Bram + Grist"
- Bram strap vs. mark (CAST.md: "heavy leather work-dungarees with one strap down" and "a square anvil shape over his heart"): "Left strap down" (that corner of the bib folds down so the mark is bare; right strap up)
- Bram towel (Claude found): "Right shoulder"
- Bram tattoos vs. iron patch (Claude found): "Iron spreads over the ink" (left-shoulder tattoo partly covered by the iron patch; right shoulder whole)
- Bram tattoo style (Claude found; STYLE.md no-symbols rule): "Flowing bands and points"
- Grist size ("the size of a truck"): "Notes only"
- Grist tail vs. STYLE.md's creature pose line ("tail held straight out behind"): "No tail, swap that phrase" (rest of the pose line word for word)
- Grist legs: "All six on the ground"
- Grist accent: "Glowing rust-orange eyes"
- Image 18 (Bram take 1): "Yes, make Bram"
- Bram take 1 passed Claude's check: 2048x1024; glowing rust-orange anvil (clear solid silhouette, not a T) on his bare left chest (front view on the right of the picture, visible in the left-side view, hidden in the right-side and back views); left strap down with that bib corner folded; right strap up; white towel over his right shoulder in the front, right-side and back views; grey iron patches on his left shoulder and left forearm in the front, left-side and back views, none on the right; flowing black tattoo bands on both shoulders and upper back, the left one disappearing under the iron; shaved head, thick black beard; hammer and tool pouches on the belt. Notes: the dungarees read as heavy canvas with cargo pockets rather than leather.
- Grist take 1 card: "Change something first" → "No Bram's I strapped suspenders in the back view isn't proper" (Claude missed it: in the back view a wide triangular back panel runs diagonally from his waist up to his right shoulder instead of a strap, and the loose left strap does not show)
- Image 19 (Bram take 2, edit of take 1: back-view straps): "Yes, make take 2"
- Bram take 2 passed Claude's check: 2048x1024; back view now has bare back above the waistband, one narrow strap from the middle of the back waistband up over his right shoulder under the towel, and the loose left strap hanging down his left hip with a buckle; other three views unchanged from take 1.
- Bram take 2 check: "His back view completely exposes his back and doesn't have the back part of the overalls hanging or hooked up to the one strap correctly"
- Image 20 (Bram take 3, edit of take 2: back bib): "Yes, make take 3"
- Bram take 3 passed Claude's check: 2048x1024; back view now has the back bib: its top-right corner hooked by a buckle to the strap over his right shoulder (under the towel), its top-left corner folded down and sagging, with the loose left strap hanging from it down his left hip to a buckle; other three views unchanged.
- Bram take 3: "Bram's right now"
- Image 21 (Grist take 1): "Yes, make Grist"
- Grist take 1: 2048x1024; four true views; dark iron plate shell with rivets and rust scuffs; one anvil-shaped horn (flat top, forward point) clear in both side views, rising up the middle in the front view and showing above the shell in the back view; glowing rust-orange eyes; closed mandibles; six stubby legs on the ground (three per side); no tail, rounded rear plate. Failed Claude's check on one point: a tiny engraved squiggle like text on the top face of the horn in the front view (no-text rule).
- Grist squiggle: "Paint it out by hand" → take 2 = take 1 with the squiggle covered in the horn's own grey; checked zoomed in: clean. No Codex use.
- Pair check: "Both pass" → locked sheets `art/refs/bram-sheet-v3.png` and `art/refs/grist-sheet-v2.png`
- Push: "Yes, push after locking"
- Images used so far in this step: 21 Codex images (Juno 1-5, Ashka 1, Sela 1-5, Vesh 1, Silas 1-3, Hush 1-2, Bram 1-3, Grist 1); 30 counting the style test. Silas take 4 and Grist take 2 painted by hand.
- Next pair: Ione + Prism (the last one)
- Ione wrist (CAST.md: "a cracked hexagon on her left wrist" and "small crystal growths on her left wrist and up the side of her neck"): "Crystals grow from the mark"
- Ione neck (CAST.md: "a cropped black turtleneck" vs. crystals "up the side of her neck"): "Crystals break through" (left side of the collar, fabric torn around them)
- Ione coat sleeves (Claude found: coat off her shoulders would cover her wrists): "Rolled up to the elbow"
- Ione white lock (Claude found; fix 5): "Left side, by the face"
- Ione mark spot (Claude found: A-pose hides the inner wrist): "Back of the wrist"
- Prism wings: "Folded flat over the back"
- Prism body: "Ice-blue glass" (clear wings with rainbow edges, glowing ice-blue eyes)
- Prism pose vs. STYLE.md's creature pose line: "Four legs down, blades folded" (tail phrase becomes "long slim abdomen held straight out behind")
- Image 22 (Ione take 1): "Yes, make Ione"
- Ione take 1: passed Claude's check on every CAST.md point and your answers (cracked hexagon with crystals on the back of her left wrist: front view right of the picture, clear in the left-side view, back view left of the picture, hidden in the right-side view; crystals breaking through the left side of the collar up to below the ear, right side of the collar whole; white lock on her left by the face, hidden in the right-side view, edge showing in the back view; coat off both shoulders, sleeves rolled, forearms bare; glasses; vial belt; stockings; buckled boots). Failed on size again: 1774x887, not 2048x1024 (fix 16). Note: the model made the turtleneck sleeveless.
- Ione size: "Option Q but also fix her lab coat so its sitting on her shoulders, looks weird." (clashes with CAST.md: "a lab coat worn open and loose off her shoulders")
- Lab coat: "Yes, coat on her shoulders" (CAST.md updated; old line archived word for word)
- Image 23 (Ione take 2, edit of take 1: coat on shoulders, at 2048x1024): "Yes, make take 2"
- Image 23 attempt timed out after 600s ("codex-imagegen: timed out after 600s. Raise --timeout or simplify the prompt."); no file was saved. Unknown whether it used Plus allowance.
- Ione take 2 retry: "Retry, wait up to 20 min"
- Ione take 2 passed Claude's check: 2048x1024; lab coat on both shoulders in all four views, open at the front, sleeves rolled to the elbow, forearms and wrists bare; everything else unchanged from take 1 (wrist mark, neck crystals, white lock all on her left, on the correct image side per view).
- Prism take 1 card: "Change something first" → Ione: "Her shirt doesn't look right make it a low cut v neck instead" (clashes with CAST.md: "a cropped black turtleneck", and the earlier answer "Crystals break through" the collar)
- Top: "Yes, cropped black V-neck" (CAST.md updated; old line archived word for word; crystals now on bare skin up the left side of her neck)
- Image 24 (Ione take 3, edit of take 2: V-neck top): "Yes, make take 3"
- Image 24 attempt (Ione take 3) timed out after 1200s ("codex-imagegen: timed out after 1200s. Raise --timeout or simplify the prompt."); no file saved.
- Codex hanging: "One retry with a shorter prompt" (Ione take 3, retry 1)
- Ione take 3 retry 1 (short prompt) timed out after 1200s too; no file saved. Third hang in a row on this edit, so Claude stopped image work.
- After the 3 hangs: "Option 1 use compact and use this chat" (stay here; retry Ione take 3 when Codex usage looks fine)
- Ione take 3 retry 2: "Usage is fine, retry now"
- Ione take 3 passed Claude's check: 2048x1024; cropped black low-cut V-neck top in all four views, neck bare; crystals on bare skin up the left side of her neck (front view right of the picture, clear in the left-side view, a few tips on the left in the back view), right side of the neck clean; everything else unchanged from take 2.
- Image 25 (Prism take 1): "Yes, make Prism"
- Prism take 1 failed Claude's check: (a) in both side views only ONE walking leg shows (under the thorax); the rear pair under the body is missing, though the front and back views show four legs; (b) the file came out 1774x887 (fix 16). Passed: ice-blue glass body; glowing ice-blue faceted eyes; feathery antennae; blade forearms folded against the chest; clear wings folded flat with rainbow edges; four legs in the front and back views.
- Image 26 (Prism take 2, edit of take 1: side-view rear legs): "Yes, make take 2"
- Prism take 2 passed Claude's check: 2048x1024; both side views now show two near walking legs (front under the thorax, rear under the abdomen), matching the four legs in the front and back views; everything else unchanged from take 1.
- Pair check (Ione take 3 + Prism take 2): "Ione back view hands are not correct and look glitched out. prism front view the front claw things are crossed"
- Claude's zoom confirms both. Ione take 3, back view: both hands have fused, mitten-like fingers, about three digits instead of five (Claude's earlier check missed it). Prism take 2, front view: the blade forearms cross over each other; that was Claude's own wording in the prompt ("crossed in front of the chest"), not Dylan's.
- Image 27 (Ione take 4, edit of take 3: back-view hands): "Yes, make Ione take 4"
- Image 28 (Prism take 3, edit of take 2: front-view blades uncrossed): "Yes, make Prism take 3"
- Ione take 4: 2048x1024; back-view hands redrawn with clean, separate fingers and knuckles, no melting; hexagon still on her left wrist (left of the picture), right hand clean; other views look unchanged. Not fully met: only FOUR digits show on each back-view hand, not the five the prompt asked for (the fifth could be read as hidden behind the hand).
- Prism take 3 passed Claude's check: 2048x1024; front-view blades uncrossed, one on each side of the chest pointing down, clear gap showing the body between them; other three views look unchanged. Note: the blades now hold slightly away from the chest rather than tight against it.
- Ione take 4: "her hand without crystals still isnt right" (her right hand in the back view)
- Prism: "Prism passes" → locked sheet `art/refs/prism-sheet-v3.png`
- Push: "Yes, push after locking"
- Ione right hand: "One more Codex edit"
- Image 29 (Ione take 5, edit of take 4: right hand in the back view): "Yes, make take 5"
- Ione take 5: 2048x1024; right hand in the back view now slim and clean, a mirror of her left, four digits showing (same as the left); other views look unchanged. New finding on zoom, missed by Claude on takes 1-4: the wrist mark has NO cracks; it is a whole hexagon with a small leaf-shaped shard inside (CAST.md: "a cracked hexagon ... (broken, because her bond was half-stripped)").
- Ione take 5 hand: "still off thumb kinda looks liek a front view" (second miss on that hand)
- Ione take 6: "Yes, make take 6" (crack the hexagon)
- Thumb fix: "Add it to take 6" (image 30: crack the hexagon + turn the thumb away)
- Image 30 attempt (Ione take 6) timed out after 1200s ("codex-imagegen: timed out after 1200s. Raise --timeout or simplify the prompt."); no file saved. Fourth timeout overall in this step.
- Ione take 6 retry: "Retry the same edit"
- Ione take 6: 2048x1024; right back-view hand improved (no thumbnail, thumb narrower). Failed Claude's check on the mark: the cracking went too far; it is now broken zigzag lines that no longer read as a hexagon and differ between views. First miss on cracking it.
- Ione take 6 mark: "looks ok" (Dylan accepts the zigzag-cracked mark as it is; no paint fix)
- Ione take 6 hand: "other hand thumb still loooks backwards" and "Still off" (third miss on her right hand in the back view). Claude's cause: its own prompts for takes 5 and 6 put the thumb on the side nearest her body; seen from behind, a hand showing its back has the thumb on the outer side, or hidden. Her left hand in the back view has the same inner digit.
- Image 31 (Ione take 7, edit of take 6: back-view thumbs): "Codex edit, both hands"
- Ione take 7 passed Claude's check: 2048x1024; both back-view hands now show four fingers plus a thumb on the outer side, mirror images, no fingernails on the thumbs. The blue wrist mark in the back view shifted a little (smaller, still the broken zigzag). Other views compared by eye only: look unchanged.
- Ione take 7: "You fucked her hands look weird and angled they should look like the other characters hands" (fourth miss on her back-view hands; Ione not locked)
- Ione hands fix: "Codex edit using Silas as the guide" (image 32; Claude edits from take 6, whose hands and accepted mark are closest, rather than take 7)
- Image 32 attempt (Ione take 8) timed out after 1200s ("codex-imagegen: timed out after 1200s. Raise --timeout or simplify the prompt."); no file saved. Fifth timeout overall in this step.
- Ione take 8 retry: "Retry the same edit"
- Ione take 8: 2048x1024; back-view hands now match the crew (fingers together, thumb on the inner side; compared side by side with Silas); mark looks like take 6. Failed on one drift: her eyes went from grey to blue (CAST.md: "sharp grey eyes"; seen in the front view, side views not zoomed).
- Ione take 8 hands: "No they still look backwards in the back view" (fifth miss. Take 6 inner thumb: "backwards". Take 7 outer thumb, spread fingers: "weird and angled ... should look like the other characters hands". Take 8 inner thumb, crew shape: "backwards". Claude stopped to ask rather than guess.)
- Ione hands: "it should look like sela's hands, they have the best looking view from the back for hands, easily distinguished that we are looking at them from behind."
- Other sheets' back-view hands: "Leave them as they are"
- Claude's comparison: Sela's thumb sits BEHIND the hand in the darker shadow tone, short, no nail, and the back of her hand is one smooth plane; take 8's thumb is the same bright tone as the hand, in front, with a nail.
- Image 33 (Ione take 9, edit of take 8: Sela-style back hands + grey eyes): "Yes, make take 9"
- Ione take 9: 2048x1024; back-view hands closer to Sela's (fingers together, thumb shorter on the inner side, no clear nail), but the thumb is still the bright skin tone, not shadow, and thin lines remain between the fingers. Eyes less blue but still blue-grey in the front view. Other views look unchanged by eye.
- Ione finish: "I paint the last bits" → take 10 = take 9 with both back-view thumbs in a warm shadow tone, finger lines softened, eyes grey. No Codex use. Checked zoomed in against Sela: reads the same way; a faint streak remains where the finger lines were.
- Ione take 10: "you used too dark of acolour. it should be a couple shade lighter than her normal hand colour. just undo that and ill accept what we have" → take 11 = take 10 without the darkened thumbs (finger lines softened, eyes grey). No Codex use. Claude read "undo that" as the thumbs only.
- Locked sheets: `art/refs/ione-sheet-v11.png` and `art/refs/prism-sheet-v3.png`. All 8 crew sheets in this step are done.
- Left as is: CAST.md still says "a cracked hexagon"; the accepted mark reads as a broken zigzag (noted in STYLE.md).
- Images used in this step: 33 Codex images, counting Juno 1-5, Ashka 1, Sela 1-5, Vesh 1, Silas 1-3, Hush 1-2, Bram 1-3, Grist 1, Ione 1-9, Prism 1-3 (42 counting the style test), plus 5 timed-out tries that may or may not have used allowance. Silas 4, Grist 2 and Ione 10-11 painted by hand.
- Next step: "can we do both in parallel on different branches?" (villain sheets and step 3)
- Repo: "i created a new repo for the new name. its driftbound. we should use that from now on and not hoshi-arcade."
- Move: "Yes, move it" (full history pushed to DyGoMa/driftbound; its main starts from art/ref-sheets-crew; new local folder Documents\driftbound; hoshi-arcade left untouched)

## Your words (2026-11-05, build step 3: homepage and game remake)
- Request: "Driftbound, build step 3: rebuild the homepage as Driftbound with the 18+ gate, and remake Aki Dash in the new style." Work in `Documents\driftbound-site`, branch `site/step-3-homepage`; don't touch `art/refs/` or `docs/CAST.md`. Push and merge only on Dylan's yes. Stop after each phase.
- Who runs (bible: "remake Aki Dash in the new style"; CAST.md has no Aki; v1: "Fastest kid in Hoshimachi"; bible: "Every character is an adult."): "Kaito, with Skarn"
- Game name: "Storm Run"
- Island and foes (bible: "set on a different island"; CAST.md: Sever troopers "Used in games as the common enemy"): "Empire island, with Hollows" (an island being pinned by anchor pylons; jump troopers and barricades; a Hollow swoops in mid-air. Rough stand-ins until the villain sheets are locked)
- What he grabs: "Salvage" (replaces Star Shards; one total across every game)
- Game art: "New poses from the image tool"
- Skarn's spot (CAST.md: "the size of a horse", "Glides on updrafts"): "Glides above and behind"
- How it plays: "Add the scar cost" (every second jump is a Surge; a small arm in the corner shows the scars climbing)
- Scar cost (CAST.md: "every big Surge burns a branching lightning-shaped scar further up his right arm", "Push too far and the arm goes numb for days."; the card cut that second quote off before "for days"): "Numb for a few seconds" (scars fade slowly when not Surging; at the top you lose the second jump for about 5 seconds)
- Upright phone (found by Claude: v1 cuts off its title and shows about 0.28 seconds of warning at start): "Ask to turn sideways"
- Pose images: "3 strips of poses" (Kaito run frames; Kaito jump, Surge and hurt; Skarn gliding)
- Image timing: "Rough game first, then images"
- Home art: "Crew cards plus a new banner" (six crew cards cropped from copies of the locked sheets; one new action picture of Kaito and Skarn)
- Gate words: "Shortest" ("DRIFTBOUND / Adults only. / Are you 18 or older? / [Yes] [No]")
- If they say No: "Polite stop screen" (no content loads; a small "I tapped by mistake" link brings the question back)
- Remember Yes: "Remember for 30 days"
- Unbuilt parts: "Coming soon, plus empty book" (Visual novel and Videos marked coming soon; the Monster book shows a grid of mystery silhouettes)
- Old saves (`shared/save.js`: 'hoshi-arcade-save-v1', HoshiSave): "New name, fresh start" (the old save stays where it is, untouched)
- v1 archive (bible: "The v1 code moves to archive/v1-hoshi-arcade/"; only 2 old docs there before this step): "Move, keep off the public site" (10 files, word for word; still playable at the old link)
- Hosting (log: "Public repo + free link"): "Free link, from this branch" (dygoma.github.io/driftbound/; switches to main on merge; each push and switch-on still gets its own yes)
- Old site (dygoma.github.io/hoshi-arcade/): "Leave it alone for now"
- Plan (`docs/STEP3_PLAN.md`): "Start Phase 1"
- Book size (CAST.md: pals "designed later"): "12 slots" (a stand-in number)
- Sheets and docs on the free link: "Publish everything" (the card said "No extra setting", but that was wrong: keeping the v1 archive off the site, as answered above, still needs one. Claude read this answer as covering sheets and docs only; the archive stays off. Dylan to overrule if he meant the archive too.)
- Found after Phase 1: the free link was already on, from main (published 2026-11-06 05:52:30 UTC under DyGoMa, not by this chat), showing old Hoshi Arcade with no gate. Live link: "Push and point link here"
- Sheets and docs (bible: "The site shows an 18+ gate before any content."; earlier answer: "Publish everything"): "Keep publishing them" (a logged exception to that rule: sheets and docs keep their own web addresses with no gate; the v1 archive stays off)
- Numb time (CAST.md: "Push too far and the arm goes numb for days."; earlier answer: about 5 seconds): "5 seconds in the game only" (the story and CAST.md keep "for days")
- Phase 1 check: "Works, Phase 2 in a fresh chat" (one answer for all of G1-G7, not marked line by line)
- Homepage request (moves Phase 3 ahead of Phase 2): "can you also redesign the layout of the website. its really plain right now. if you need to put place holders for things and you can use the codex image creator to make images when needed"
- Layout: "Anime show site"
- Colours: "Stormy dusk: navy, orange, gold" (the gate changes to match)
- New images (earlier answer: "Rough game first, then images", which still holds for Storm Run's poses): "Banner, plus Storm Run card" (2 images: Kaito and Skarn action banner, Pinhold island art)
- Banner take 1 (`art/site/banner-v1.png`, refs: Kaito and Skarn sheets): passed Claude's check, zoomed in on the face and hands: adult face, white streak and goggles on his right side, five fingers, glowing mark on the back of his right hand, scars stop at the elbow, four legs and forked tail on Skarn, no text. Came out 1774x887, not 2048x1024 (fix 16); no effect, because the page uses a 1600-wide copy. No redo. Note: the hand mark reads more as branching lightning than a clean three-point fork.
- Pinhold take 1 (`art/site/pinhold-v1.png`, style ref: the banner): 2048x1024; floating island with four steel pylons through it, chains, barricades, watchtower, cranes, searchlights, a road across the top; no people, no text. Looked at the full picture, not zoomed in. No redo.
- Images used so far: 2 in this chat. With the villain chat's 8 logged by 2026-11-05 (trooper, Vasch 1-4, Hekka and others), that's 52 in all, plus the 5 earlier timed-out tries.
- Publish the new homepage: "Push it live"
- Homepage check: "looks good on my phone. on my computer the banner takes up the whole page should only be like 1/4 to a 1/3 of it. also the character pictures are blurry."
- Calls Claude made for the homepage (change any): fonts Anton and Barlow from Google Fonts; the tagline and the Storm Run blurb; the crew one-liners in `shared/crew.js`, shortened from CAST.md; ages shown on the crew cards; "More islands, more games" tile; the Enter the Drift button; banner placed above the title, so the art isn't covered. Crew portraits are small crops from the 2048-wide sheets, so they look a little soft at computer size.

## Your words (2026-11-06, Friday batch: finish the game, make more, fully automated)
- Request: "It's Friday and I want you to finish the current game we created and make another 2-5. I want you to fully automate it and ask all questions before starting so you can fish it in one go. You will do a review of it before telling me it's done." This replaces "stop after each phase" and the one-yes-per-image rule for this job only.
- New games: "All 5" (one each for Sela, Juno, Silas, Bram, Ione)
- Pictures: "As many as you need to. If you hit the limit continue making the game and try again later"
- Going live: "Live game by game" (main stays as it is until Dylan says otherwise)
- Homepage fix left in the old chat: "Finish it here" (that chat stopped; its files kept)
- Pals: "Yes, 12 pals"
- Salvage: "Both" (unlocks story cards and buys upgrades)
- Upgrades: "3 per game" (plus a no-upgrades switch for fair high scores)
- Crew talk: "Short and full flavour"
- Sound: "Effects plus music"
- Game shape: "Stages, boss, endless" (Ione's game: puzzle levels with a final boss puzzle)
- Phone: "Best for each game" (Storm Run stays sideways)
- Silt and the Hollow hound sheets: "Finish them here" (Claude checks them; that chat stopped; Dylan checks them after they're in use)
- Images made while fixing the Storm Run review (Friday batch, first takes, no redos, each looked at against its sheet): `games/storm-run/art/raw/` kaito-run-v1, kaito-poses-v1, trooper-run-v1; `art/site/` gaptooth-v1, ashmarket-v1, lanternreach-v1, keelbreak-v1, glassward-v1. 8 images. Prompts beside them.
- Image made while fixing the third Storm Run review (Friday batch, first take, no redo, looked at against its sheet): `games/storm-run/art/raw/skarn-glide-v1.png`. 1 image, the Skarn gliding strip Dylan chose under "3 strips of poses". Prompt beside it.
- Run stopped at the weekly limit. Dylan's later message: "Try again" (taken as: pick the batch back up where it stopped). Logged from the build run's own record; the message itself wasn't in the chat that wrote this line.

### Waiting on Dylan, found in the notes
Not decided. Each needs his word; nothing was changed for them.
- Hold the Deck's crate: `games/hold-the-deck/NOTES.md` says the picture is "waiting on Dylan's choice about the word FLOUR". The batch has no record of that question being asked.
- Voice scars and other run costs can be wiped for free: win stage 1 again and a new run replaces the old one. It's the kit's written rule for every game (`games/silent-cut/NOTES.md`, "For Dylan").
- Small edits made to the shared kit, against its "never change" rule, to accept or undo: Hekka's code portrait (Hold the Deck), `.kit-btn` height (Hot Hand), `.kit-unlock` (Silent Cut), `Kit.input.resets` and an upright title width (Tide Gap), `compactSay` and `stageRows` (Split Light).
- Tide Gap's Dive is "pull down and hold", against the spec's "Hold to Dive".
- Krell's and Maro's sheets aren't locked.

### Claude's calls, game by game (change any)
Copied word for word from each game's `NOTES.md`. "Above" and "below" in them mean that file. Calls about the spec, names, prices and salvage rates are at the end of `docs/FRIDAY_BATCH.md`. Picture-by-picture notes stay in each `NOTES.md`.

**Storm Run**
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
- Sixth pass: big cogs fly to Salvage Pull only after a Surge, and the upgrade's wording says so ("Big cogs come only to a Surge."). That also covers the big cog over a tall barricade, which takes a Surge anyway. Stage 1 gets 5 hits, smaller low barricades and the word HOLD! on its troopers; the spec's "Quick tap is a short hop, hold is a full jump" is unchanged on every stage.

**Tide Gap**
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

Fourth review:
- Copies don't pay at the boss, and Ione's new line saying so. Other ways to do this: copies pay only one plate, or a copy costs more.
- Cache gold waits for the clear. The count on screen can drop on a wreck. The other way was keeping the line drowned when a cache was taken, but a tooth always hides a cache, so a stuck player's book would drain on retries.
- Quit from stage 1 forfeits held gold. Quit from a later stage pays it into the next attempt; closing the tab loses it, and the line stays gone.
- Salvage for a Dive still pays over the kit's 15 to 40 on stages 3 and 4 (the review saw 72 to 73). Not changed: it's the call below, and a wreck no longer pays it.
- **Plain hold stays off, against the spec's "Hold to Dive".** An earlier review showed a plain hold spending memories by accident. If Dylan wants it, the middle way is a long hold only while a Dive is being asked for (SHUT or plates open), at the risk of a thumb resting there.
- Five new lose lines, in the crew's voices.
- Sela and Hekka's new sizes. Sela's head now ends about at the bow. Hit edges don't change.
- Hekka's picture is left stocky until a new picture exists.

Pictures:
**Calls Claude made here (change any):** Hekka stands at 27 px from the cutter's middle, not 31, picture only, because the new wider boots hung over the hull's edge by about 3 to 4 px in throw and hurt (`cutter.js`; the code figure stays at 31). `hekka_hurt` is drawn about 47 px rather than 51, so her armour stays the same size as when standing. Book colour lighter than asked, tan with cream page edge, so it reads apart from her boots. Still a thumb's call: whether the pose change reads during play.

**Hot Hand**
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

Fixing the review:
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

Fixing the second review:
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

Fixing the boss's third round:
- **Round 3's march is 16.5 s (was 13), and its vents need 11 (was 13).** Picked from about 150 combinations of `marchSecs`, `ventNeed`, `ventOpen`, `addEvery` and `ramHurt`. 16.5 is the shortest where the patient bot wins at all often: at 16 it won 5 of 60, at 16.5 12 of 60. So the third march is longer than the second's 15 s. Round 3 is still the longest and busiest round, but round 2 now has the most charges.
- **Left alone:** `ramHurt` 3 (at 2 the patient bot won 141/200 and the clean bot 199/200, which took the bite out of the charge), `addEvery`, and `ventOpen` (longer windows didn't help the clean bot, though that may be its wait-for-heat rule).
- **Sela now warns earlier.** "Line's closing, Juno. Blow those vents before they charge!" comes 4.5 s before the warning starts (`ramWarn`), once per march, when there's time to act. At the warning itself she says "They're charging! Finish those vents or brace, Juno!"
- **Rounds 1 and 2 keep their length,** about 40 s for a retry, and "dying restarts the current stage" stands. The difference is that round 2 now holds real danger, so a retry isn't just a walk to the only hard part. Average bot's deaths in round 2 went from 5 of 38 to 36 of 128.
- **The trade-off:** a thumb that never goes red now almost always wins first try (clean 191/200). The number to change if that's too easy: `marchSecs`, third value. At 15.5, 200 seeds: clean 175, steady 123, average 56, patient 14.

Fixing the final review:
- **What counts as a joke while a pal is out.** Besides the two lines the review caught: every line where Silas says "darling" (he flirts with everyone), Kaito's "Happens to the best of us", Juno's "feel my hands", Ione's "your pulse says you're enjoying this", "something kind about your hands" and "a very large dose", Silas's "hold 'em". Swearing stays, as the rule doesn't name it. The list is the `adult: true` marks in `words.js`.
- **A joke that gets skipped isn't said later that attempt.** That includes Silas's first-time "Top windows, darling" tip, which comes back next attempt as it was never marked as taught. Bram's and Sela's warnings aren't affected.
- **One new line:** Silas on the stage 3 win screen with a pal out: "Soaked to the skin and still smoking. Very nicely done."
- **A pal's arrival takes down a joke that's showing,** even if it has only just gone up. Same as Hold the Deck.
- **Restart and Quit pay the table in the beat after a wave is cleared,** through the same function as a hidden tab. Quit in the beat after the last wave pays too, but the stage doesn't count as won, as it hasn't happened yet. Mid-wave, walking out still forfeits, as above.
- **Done from `game.js`, with no kit change:** a click listener in the capture phase runs before the kit's button handler banks, the same trick as the hidden-tab listener. So the kit's `def.onBank` idea in "Kit notes" would now cover both.
- **Cool Palms is weaker:** 1.1, 1.2, 1.3 times (was 1.15, 1.3, 1.45), same price, same blurb. A level is smaller for anyone who bought it, and it's the review's bar-skipping players it's aimed at. Back to `coolPerLevel: 0.15` if it stops feeling worth buying.
- **The boss's numbers stayed,** see above.

Pictures:
- Made Krell a working sheet first, since he has six pictures. It stays in `art/raw/`. His face, plates and helmet ear cups are Claude's reading of the description; the ear cups come from the trooper's sheet.
- Baton, not whistle, for `krell_stand`. Crossbow for `trooper_lean`, as REQUEST.md says.
- Code changes to fit the pictures, this game's files only: the fire and mark's glow now sit at places measured per picture (`picHands`, `picMark` in `tuning.js`, throw per frame); with a picture on, only the glow is drawn, as the picture has the mark; the flames are 0.7 times the size and the smoke rises ahead of her face, because her hands are close under it; Krell, `shield_man` and `trooper_lean` draw unflipped; Krell draws in front of the shields once exposed or down; the title uses the `ashka_fly` picture when it's there.
- `fill` is set from head size, so a person stays one size between poses. `cover_table` and `shield_man` have `cx` moved so her shins and his hands stay clear.
- Calls: made fresh rather than cut from the sheet, because the sheet's head is only about 120 px tall; made without waiting for his sheet to be locked.

**Silent Cut**
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

Sixth pass:
- **Lamplick's catch is a tap on a TAP ring.** Spec only says "a rare catch with a game-specific condition". A player who sees the ring will likely tap it, so the moth is still found by anyone who cuts that lantern; it's just no longer free. For harder: take the ring off, or shorten `lamplickSecs`.
- **The moth is never on the first lanterns of a stage.** Endless can start with none far enough along: 2 of 12 seeds had no moth with the chance forced to 1. Stage 3 has no lanterns, so no moth there, as before.
- **Which lines count as flirting is my reading.** Marked: "darling" and "handsome" lines, "Lovely coat", "Not my best angle", "I'm flattered", "mood lighting", the crate and "from behind" jokes, the shirt lines, "Pretty doesn't count as cover". Left as they are: Kaito's "pretty boy", "Ah. They've noticed me. They always do.", "Don't all cheer at once."
- With a pal about, a close call gets no line from Silas: all three were flirting and I didn't write a new one.
- Stage win lines and stage talk are not gated: none of the win lines on stages with pals flirts, and the moth is off screen during talk.

Fifth pass:
- Fixed by moving the numbers, not changing a rule. Dropping `maroReachLess` to 0 and narrowing the pool was my pick over keeping the 14 and shrinking the pool to 30, which hardly showed round him. Other way: raise `maroPool` for a tighter last step; above 58 the ring shows inside the light.
- `maroReachLess` stays in the code at 0, so the number can come back without touching the rules.
- The knife is drawn about twice its size on the sheet, or it doesn't read at play size. At the sheet's scale it would be about 13 px; it's drawn about 30 px with the pommel.
- `chainWindup`, `chainFly`: looks only, provisional. The cut lands on the tap, as it did, so Maro reels a moment before the blade gets there (about 0.13 s).

Fourth pass:
- **Deep Lungs is strong at the top.** Human-speed player, 30 seeds, times out of breath on stages 2, 3, 4 at each level: level 0 1, 1.8, 1.4; level 1 0.1, 1, 0.8; level 2 0, 0.4, 0.1; level 3 0, 0, 0. So a player who buys all three (145 salvage) rarely goes silent unless he's careless. It's the plainest way to give a feather per level, and the No-upgrades switch still plays the real cost. If it should still bite at level 3, lower `lungMax`, but then some level pays for no feather.
- A press up to 0.28 s beside a lantern cuts it, even if it was meant as a little creep. Beside a trooper, it strikes.
- Two presses under 0.28 s with a gap of 0.16 s or less Surge. A fast hold, let go, hold that happens to be that tight would spend a feather. 0.17 s was fine in the test; a person's thumb is the real check.
- Silas's third line breaking off, and Maro's new opening line, are my writing, one of the two ways the review offered.
- Silas no longer appears on the title when the picture is there.
- `sceneInk` 0.55 is my eye, and it was a judgement call in the review anyway. Hand-drawn lines are still heavier than the pictures' at computer size.
- Tuftle's line goes to Hush; the five new lamp-line lose lines and three lit crew lines are mine.

Third pass:
**Calls made (change any):** the scar rule and its numbers, all provisional; `rough` and `rags` lines, `windedLose`, `tornCrew`, the panel labels and the tip are my writing; a scarred Silas keeps talking, where he used to go blank at rasp 3; a deliberate Surge within 0.56 s of a strike needs waiting that long; tap, tap beside two lanterns now takes two more taps to Surge.

Portraits:
- Calls: the crop stops above the chest, so the black bar and white ring are not in it.
- Calls: made without waiting for the sheet to be locked, so a changed sheet means a new portrait; he faces the viewer like the crew's portraits, while the code drawing stays side-on.

**Hold the Deck**
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
- **The extra Guts have conditions:** a try that landed under 3 swings earns none, nor does one that took a volley on the chin and never held once, and Ione says why each time.
- **Endless changes the spec's meal rule.** Spec: "Between waves, cook one meal." Endless serves one after every second wave (`endless.mealEvery`), so a bowl can't heal everything the flat pressure takes. Story stages keep the rule as written.
- **One more Guts per lost try on a stage, up to 3**, with Ione's line. Mine, so grey is never a wall. It's in the save, so a reload keeps it. It does let a fair run's clear bonus grow slightly, since Guts left pay score.
- The bear stands further down the deck (`standD` 0.42, was 0.30) so its head clears the talk box on phones with no spare height. Its numbers are harder: paws and rakes hurt more, warnings shorter. Boarders fewer. For a thumb that misses some warnings its hits now come from the bear about as much as from the door; for one that never misses, the door still does most of it.
- At the claw warning the bear raises the paw on the side of the lit lane; the middle lane takes the side the game already picked (`b.raised`). Plates and lit lanes say which lanes. Roar stays for volleys and charges.
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

Fourth review:
- The bear keeps its wounds, and more Guts per try than other stages. New rule; the batch only says "a few tries". The grey does not come down between tries, because that's the bond cost.
- The try count moved into the save (`hd_tries_lost`). Starting a new story from stage 1 doesn't clear the bear's count.
- Ione's two new lines, `boss.mercy` and `boss.advice` in `words-boss.js`.
- Copying Tide Gap's portrait rather than asking for a picture. If that picture is redone, this copy won't follow it.

Fifth review:
- **The third volley on the chin ends the try.** New rule, mine. Other ways I weighed: making volleys hurt more per upgrade level (a player with Pot 1 who took two volleys would be worse off than with no Pot, 5, 1, 4, 0 against 5, 2, 4, 1), or taking broth out of Big Pot (Apron alone still leaves room, as 8 Guts did). In `tuning.js`: 2 would be harsher, and it would change no-upgrade play; 4 would give stage 2 and stage 4 back to anyone with enough Guts.
- A volley that lands in the 0.7 s of safety after another hit does no Guts but does count as a rib.
- It also applies in Endless, for the whole run.
- 3 swings as the bar for a real try. `mercyMinSwings`.
- Ione's three lines. RIBS as the word; it's her word already ("Strap those ribs").

**Split Light**
- **Growths in the way outlast everything but a win: Retry, losing, Restart, Menu and a reload. This is the biggest rules call in the game**, and it stretches the batch line "Dying restarts the current stage": the stage restarts, but its board keeps what's in your way. A growth that would shut the board, or let it be cleared under par, breaks off, so nobody can be stuck and failing can't shorten a board. A board can come back clean if nothing you grew was in the way. To go back to clean boards: pass `null` instead of the kept growths in `SL.retry` (`moves.js`) and `SL.newWorld` (`play.js`), and change Retry's lines in `words.js` and Mind the Lane's in `words-levels.js`.
- **A level's shots are for the whole stage.** The batch says "shots are limited" and doesn't say per attempt. A new attempt gets the shots not yet spent, and never fewer than its board needs. To go back: remove the `SL.shotsFor` line in `SL.loadBoard` (`play.js`). The boss keeps full shots per attempt: nerve is its limit.
- **Undo and Scrape last the whole level on levels, and come back on a win.** The batch's "one undo per level" read literally; the boss keeps one per boss board, since Reset costs nerve there.
- **Vasch's count: at ten he fires for you.** The spec only says he talks throughout and has moving cores; a count of ten comes from his history with her in `shared/stories.js`. So the boss has a time limit and levels don't. To turn it off, remove `count` from the three boards in `levels.js`.
- **Costs survive a reload** (`tally.js`, shared save). Closing the tab no longer forgets them: not the spent shots, the growths in the way, or the undos and scrapes already used.
- **A lost attempt scores nothing.** The score stays out of `run.score` until a level, or the whole boss, is won. The DOWN screen shows the run's score so far, 0 on stage 1.
- Boss bonus at par is per board, counting failed attempts on that board but not boards already beaten, and not lost attempts at the boss.
- Board changes to answer the review, all PROVISIONAL: L9 3 shots (was 2); L10 one crystal clamped; L11 splitter starts leaning the wrong way, so FIRE twice no longer clears it; L12 4 shots (was 3); L15 two of its three crystals clamped, so it asks for one turn and one moment.
- Set 2 is now The Seed Beds, not The Nursery, and Ione says "I ran these beds". Nothing broke a hard rule, but that word sat beside Juno's joke. The room painting's prompt in `art/prompts/room-1-v1.txt` still says Nursery: it's a record of what was asked, not on screen.
- New lines for a clear over par on L3, L7, L8, L11, L16, where the old line praised a clean solve.
- `ione_bust` is back on take 1, with a code-drawn black top: see "The pictures".
- **Growths can't be turned, and always lean `/`.** The spec says "tap crystals to turn them" and that growths "can block or help". A turnable growth hardly ever blocks anything: a beam that stopped on that cell can always be sent along the lane. So I fixed them. This is the biggest rules call.
- A growth comes up only on the beam's last straight run. Stopped right after a bounce with no free cell, nothing grows.
- The beam passes through cores and carries on. Beams cross without touching.
- Added pieces the spec didn't list, to give each level a new idea: clamped crystals, plates, splitters (from the name and Prism's wings), linked cores, armoured cores, brass perches.
- "Moving cores" means both kinds: rails that step per shot, and rails on a clock. The clock stops while the beam flies.
- Boss nerve (3 resets), a board resets rather than the whole stage, and the side-sealing rule on board 3.
- Vasch's corrections are in board 3 only.
- Retry on levels is instant, with no lose screen, and keeps the shots fired in the count; running out of shots gives the lose screen with a line. Coming back from a loss, Restart, Menu or a reload, Ione gives the same line as a Retry, since fewer shots come back.
- On the board a growth lasts until a win, a Scrape, a rail, or a new attempt where it would shut the board or shorten it. The words say so ("Crystals reset. Shots don't. What's in my way stays.", "Useful or fatal, it cracked off.", and level 8's scene).
- A rail crushing a growth stays in the rules (boards were proven with it), now shown on screen rather than removed.
- 16 levels get a 2 to 4 line scene each (the lint would allow only one per set). Skip works, and retries skip them.
- **Salvage: at par 8, 10, 10, 12 by set, 4 less per shot over, never under 1; boss 28 plus 4 per nerve left; a stage already cleared pays a fifth of that, at least 1.** The kit asks for 15 to 40 a stage, for 5 stages. With 17 stages that would pay 3 times what other games do, so I kept the whole story at about the same total: 200 at most for a perfect first run. Measured per second of bot play, a first run is still far above the other games, but a bot doesn't have to read the boards; for a puzzle that reading is the time. The replay cut is what stops known boards being farmed. The result screen shows the lower pay and doesn't say why.
- Score adds up across a story run via `run.carry`, each stage counted once (`tally.js`), so Best means a whole run and a replay only replaces that stage's part. Best can still grow by replaying a stage for a better score: only ever up to one score per stage. A run that used upgrades doesn't feed the fair best.
- The arm's count works the same way: a replay replaces that stage's shots, so replays don't grow it.
- Boss board shots 4, 3, 4. Vasch's correction after a no-crystal shot turns one you'd want left alone.
- The link between linked cores is now a slack steel cable with brass ties, drawn in a curve, so it can't read as a beam.
- The story: she brings the notes because he told her to, to burn them on his desk; he copied them the night she ran, and only asked so she'd come home. Prism folds up against her side at the end, since she's the size of a large dog.
- Swearing added to Kaito, Juno and Sela, in their voices: damn, hell, shit, screw, bastard. Ione and Bram stay clean; it fits them.
- The arm's count across the story is a look and a talk trigger only; it doesn't change later boards. The spec's bond cost is the board growth, and that's per attempt.
- Story calls: Ione burns her notes; Vasch began the strip at the count and stopped at five of ten, because she was still taking notes; he keeps her desk; he escapes with a cracked arm. Level and set names, and every line of dialogue.
- The tighter talk box at 360 px wide and under is now the kit's `compactSay` option, so it stays above the board and clear of Pause (see "Kit notes").
- Vasch's talk portrait on this page is his bust picture zoomed to head and collar (through `Kit.speakers.add`). My code bust from `vasch-sheet-v4.png` is only the fallback if the picture can't load.
- Ione's window uses `ione_bust`, and her homepage portrait only if that can't load, with the crystals drawn over either.
- Prism is drawn from above so she can face any way. Picture keys for it are in `art/REQUEST.md`.
- Keys: arrows move a cursor, Space or Enter turns (or fires with no cursor), F fires, R retries, U undoes, X scrapes.
- Pal conditions and chances.

### New minor villain facts added by the Friday batch (all Claude's calls; change any)
None of this is in `CAST.md`, and `CAST.md` was not touched. Where it lives is in brackets.

**Warden Krell, new** (boss of Hot Hand)
- Man, 41, 195 cm, a heavy trooper officer (`docs/FRIDAY_BATCH.md`, `shared/kit/cast.js`).
- Huge and heavy, thick neck, heavy brow, square stubbled jaw, deep lines beside the mouth, dark eyes, tan skin. Dark grey helmet with no visor, long dark grey coat, steel plates on upper arms, forearms and shins. Carries a baton (`games/hot-hand/art/prompts/`, `NOTES.md`). His sheet is a working one, not locked: `games/hot-hand/art/raw/krell-sheet-v1.png`.
- Voice: a bored jailer who counts people like stock, with a form for everything.
- Runs the Sever's raid on Ashmarket, with every partner on the island caged in the Pit for stripping.
- Keeps a ledger in the vault: "every partner the Sever has counted, and where they were sent" (ending card). A hook for later.
- Beaten, not stated dead: his line is scrap, and his last words are "Count's... off."

**Ledger Maro, new** (boss of Silent Cut)
- Man, 52, 172 cm, stout (`docs/FRIDAY_BATCH.md`, `shared/kit/cast.js`). Round belly, thick neck, soft jowls, balding with short grey-brown hair at the sides, warm light-tan skin, small dark eyes. Long plum satin coat, wide gold belt (`games/silent-cut/art/prompts/maro-sheet-v1.txt`). His sheet is not locked: `games/silent-cut/art/raw/maro-sheet-v1.png`.
- Silas's old boss in Lanternreach. Paid Silas for two years, starting when Silas was 21; that ended a year ago. Nothing about them is romantic.
- Says "dear fellow", talks in book-keeping. Carries a lantern on a long pole. Keeps his books in the lamplit warehouse.
- His ledger names the eleven partners Silas smuggled out and every captain who carried them, and he's selling it to the Sever. Hush burns it in the ending.
- Survives: "last seen counting what was left".

**New facts about villains already in `CAST.md`** (from each game's words; worth checking against the story)
- **Silt:** 175 cm (`shared/kit/cast.js`). Has followed Kaito "across eleven islands". Gets away from Storm Run with a cracked mask, and says he'll be back for the arm.
- **Hekka Dorn, Tide Gap:** commands a Sever cutter. Has all of Sela's old logbooks, twelve volumes, and uses them to find her. Says she cut out her own bond standing up, in a count of ten. Sela taunts her with "Still wearing your divorce on your ribs?", which the notes explain as "the ring scar". Hekka opens the boss with "Then we'll talk about your mother", so she knows something about Sela's mother. Her cutter goes down in the Last Tooth; she lives.
- **Hekka and her bear, Hold the Deck:** she offers Bram a deal for Grist. **The Hollow bear falls and doesn't get up**; she says "Get up" and "I said get up", then goes home and leaves the chain, and Bram keeps it. This changes a character in `CAST.md` and affects later stories, so it's the one to check first.
- **Vasch:** began stripping Ione himself, at a count of ten, and stopped at five because she was taking notes. Kept her desk and chair. Copied her notes the night she ran, and asked her to bring them only so she'd come home. His arm's chamber is "eleven years' work". Ione's game cracks it; he leaves by the back way, alive.
- **Sever troopers:** standing order 12, a bond-cutter held at the bond mark for a full count of ten (`shared/stories.js`).
- **New kinds of foe:** a Hollow flyer in Storm Run; small Hollow hounds in Hot Hand; hook-men, plate-carriers, runners, window shooters, powder carts and rams across the games.

## Your words (2026-11-07, after the Friday batch report)
Card answers, word for word:
- Main branch: "Wait until I've played (Recommended)". Main stays at c37f11f; the live link keeps serving `site/step-3-homepage`.
- Silt and hound sheets: "Show me them first (Recommended)". The villain branch is not uploaded until you approve them.
- Pal names Glimmick and Cinderbun (close to Glimmet and Cinderace): "Rename both (Recommended)". Looks stay the same; you pick the new names.
- Winning stage 1 again wipes lasting damage: "Keep it for now (Recommended)". Judge it after your play-check.
- New pal names, your picks: snail "Prismule (Recommended)", ember dumpling "Kindlekin". Only the shown names changed; the save ids stay `glimmick` and `cinderbun`, so caught pals are kept. Older notes keep the old names word for word.
- Pal check: after seeing the hints, "Make pals easier to find", then "Always when you do it (Recommended)". All 12 chances are now 1 (old values kept in each tuning.js comment). Each pal still needs its own condition and still comes once per attempt. Side effect: Silent Cut's Tuftle comes to anyone who sits still 18 s in cover, so a player who does nothing will catch it; the shared test now taps OK on that catch.
- Pals by hand: "I got prismule so it works and I see them in the book", then "If one work the others should I don't have time to test". Prismule and the monster book are marked works. The other 11 pals are not hand-tested, on your call; the automated tests catch each one through the game's own code.
- Villain sheets: "Vikram sheets look good", "Meant villian". Silt take 1 and hound take 3 passed (logged on the villain branch). Upload: "Upload them (Recommended)"; branch `art/ref-sheets-villains` pushed at 02213ca.

## Build step 2: villain sheets, the Sever (2026-11-05)
Branch `art/ref-sheets-villains`, folder `Documents\driftbound-villains`.
- Usage screenshots (they did not come through): "Carry on without them"
- First sheet: "Sever trooper"
- Chest symbol (CAST.md: "a black bar across the chest (an original symbol: a straight line cutting a circle)" vs. STYLE.md: "no logos, no symbols, no emblems"): "Yes, as the one exception"
- Symbol shape: "Bar runs flat across, white ring at centre" (back of the coat plain)
- Bond-cutter on the trooper sheet: "On the belt at the right hip"
- Trooper coat (CAST.md: "long grey coats"): "To the knee, closed and belted"
- Trooper head (CAST.md: "faceless grunts", "visored helmets" vs. the pose line "Neutral face, mouth closed"): "Visor over the eyes, jaw showing" (pose line stays word for word)
- Trooper build: "Average adult man, medium skin"
- Trooper hands and legs: "Black gloves, belt, boots; dark grey trousers"
- Image 1 of this step (trooper take 1): "Yes, make the trooper"
- Trooper take 1 passed Claude's check: 2048x1024; four true views; A-pose with a clear gap in the front and back views; grey helmet, black visor hiding the eyes, adult jaw and closed mouth below it; white collar; closed coat to the knee with a black belt; black bar with a white ring cut by it in the front view, only the bar's end in the side views, back plain; hooked blade on his right hip (left of the picture in front, near us in the right-side view, right of the picture in back, hidden in the left-side view); back-view gloves compared side by side with Sela: smooth back of the hand, fingers together, thumb on the inner side, no nails. Notes: the coat is close to the background grey; the blade reads more as bright steel than a white glow; the model added ear cups on the helmet, a grey belt buckle and a metal clip for the blade; plainer to look at than the crew because the outfit is plain.
- Trooper: "Trooper passes" → locked sheet `art/refs/trooper-sheet-v1.png`
- Images used so far in this step: 1 Codex image (trooper 1); 43 counting everything before it, plus the 5 earlier timed-out tries.
- Next sheet: "Director Vasch"
- Vasch hands (CAST.md: "gloves" vs. "a mechanical right arm with a glass chamber"): "Left hand gloved, metal hand bare"
- Vasch arm: "Forearm only, sleeve rolled up"
- Vasch symbol (the white ring would vanish on a white coat): "Black bar, black ring"
- Vasch coat: "Same knee-length cut, black belt and boots, grey trousers"
- Vasch face (CAST.md: "a calm smile" vs. the pose line "Neutral face, mouth closed"): "Tiny closed-mouth smile" (that one phrase swapped for this sheet)
- Vasch look: "188 cm, pale skin, pale grey eyes, hair combed back"
- Vasch arm look: "Dark steel, white core on the outer forearm"
- Vasch glove and cuff: "Black glove, white cuff"
- Image 2 of this step (Vasch take 1): "Yes, make Vasch"
- Vasch take 1 failed Claude's check on three points: (a) the file came out 1774x887 (fix 16); (b) his skin reads tan, not "pale"; (c) the chamber reads as a solid white strip, not a glass chamber holding a core. Passed: four true views; grey hair combed back; grey eyes; tiny closed smile; knee-length white belted coat; black bar and black ring in the front view, bar end in the side views, back plain; left hand black glove; right sleeve rolled, dark steel forearm and bare metal fingers on the correct image side per view; back-view glove reads from behind (smooth back of the hand, fingers together, thumb on the inner side).
- Image 3 of this step (Vasch take 2, edit of take 1: pale skin + chamber with a core, at 2048x1024): "Yes, make take 2"
- Vasch take 2 passed Claude's check: 2048x1024; skin now pale in all views; chamber now a dark glass window with one glowing white oval core in the front, right-side and back views; eyes still pale grey and hair still grey beside take 1 (compared by eye, zoomed); bar, ring, glove, rolled cuff and metal fingers on the same sides as take 1; back-view glove and metal hand zoomed in. Notes: the skin leans slightly pink; the metal hand's thumb is on the inner side in the back view but its jointed plates show more detail than a plain back of the hand.
- Vasch take 2: "both sleeves rolled up, one only looks weird"
- Image 4 of this step (Vasch take 3, edit of take 2: left sleeve rolled to match): "Yes, long black glove to the elbow"
- Vasch take 3 passed Claude's check: 2048x1024; both sleeves rolled with matching cuffs; long black glove from the left cuff to the fingers, no skin on that arm; back-view left hand still reads from behind (smooth back, fingers together, thumb on the inner side); eyes still pale grey, hair still grey; metal arm, chest bar and ring look unchanged by eye.
- Vasch take 3: "the arm mechanical arm looks different in all of the views with where the white light is"
- Claude's side-by-side: the window faces us straight on in the front, right-side and back views, which one window on one side of an arm cannot do. Cause: Claude's own prompt asked for it to show fully in all three.
- Image 5 of this step (Vasch take 4, edit of take 3: chamber as a see-through tube): "Yes, see-through glass tube"
- Vasch take 4 passed Claude's check: 2048x1024; clear glass tube between steel rings in the front, right-side and back views; one white core at the same height, halfway along the tube, in all three (compared side by side). Other parts look unchanged by eye. Drift found on zoom: a faint blush on the front-view cheeks; eyes still pale grey, perhaps slightly bluer; hair still grey. Notes: the metal below the tube now stops at a wrist ring, so the forearm is almost all glass; the model doubled the rings (two thin bands each end).
- Vasch take 4: "Vasch passes as is" → locked sheet `art/refs/vasch-sheet-v4.png`
- Images used so far in this step: 5 Codex images (trooper 1, Vasch 1-4); 47 counting everything before it, plus the 5 earlier timed-out tries.
- Next pair: "Captain Hekka + bear"
- Hekka lance (CAST.md: "a bond-cutter lance taller than she is" vs. the A-pose and fix 12): "Its own prop sheet later"
- Hekka uniform (CAST.md: "long grey coats with a white collar and a black bar across the chest" vs. "heavy grey armour with an open midriff"): "Armour only, bar and ring on the chest plate"
- Hekka old bond (Claude found; she stripped her own partner): "A dead grey scar on her bare midriff" (left side, no glow)
- Hekka look: "193 cm, light brown skin, steel-grey eyes"
- Hekka armour: "Plate on top and shins, dark cloth between"
- Hekka lip scar: "Straight up and down, left of centre"
- Image 6 of this step (Hekka take 1): "Yes, make Hekka"
- Hekka take 1 failed Claude's check: (a) the file came out 1774x887 (fix 16); (b) the lip scar runs from the forehead through the eye to the chin and misses the lips in the front view (CAST.md: "a scar across her lips"); (c) she reads as a man in face and body (CAST.md: "woman"); (d) the hair is tufted rather than an even buzz cut; (e) baggy trousers. Passed: four true views; bar and white ring on the chest plate, bar end in the side views, back plate plain; ring scar on her left (right of the picture in front, visible in the left-side view, hidden in the others); charcoal cloth and grey plate as asked; back-view gloves read from behind.
- Hekka look: "can you make her look more conventally attractive with longer hair" (clashes with CAST.md: "buzzed white hair")
- Hekka hair: "black long hair think of The tracker from Avatar: The Last Airbender who rides a giant creature with a long tongue is June, a professional bounty hunter" (CAST.md updated; old line archived word for word. Claude's prompt uses the general idea only, long straight black hair on a striking adult woman, and does not name or copy that character: World Bible rule 3.)
- Image 7 of this step (Hekka take 2, fresh): "Yes, make take 2"
- Hekka hair, clarified while take 2 was running: "take inspiration from The tracker from Avatar: The Last Airbender who rides a giant creature with a long tongue is June, a professional bounty hunter not copy. i like th hair thats why i mentioned it"
- Hekka take 2: 2048x1024; four true views; reads clearly as an adult woman; long black hair behind the shoulders; chest bar, white ring, armour layout and ring scar sides all correct; back-view gloves read from behind. Failed Claude's check: (a) second miss on the lip scar: two short lines under the mouth, one each side, like tear tracks, and they do not cross the lips (a faint one also shows in the right-side view, which should be clean); (b) Claude's word "fitted" overshot: skin-tight leg cloth with exaggerated hips and rear, which goes against the World Bible's no-sexualized-framing rule. Notes: the ring scar is reddish, not dull grey; the eyes look grey-brown in the front view; the hair is tidier than the style Dylan described.
- Hekka lip scar: "Paint it by hand last"
- Hekka hair style: "Thick and loose, swept back from the face"
- Image 8 of this step (Hekka take 3, edit of take 2: straight trousers and natural hips + hair): "Yes, make take 3"
- Hekka take 3 passed Claude's check on the two changes: 2048x1024; loose straight trousers, natural hips; thick, wavy black hair swept back with a lock at each temple. Armour, bar, ring and ring scar look unchanged by eye. Eyes moved from grey-brown to blue-grey (fix 24); take 3's lip lines were faded smudges.
- Hekka take 4 = take 3 with the lip scar painted by hand: one thin pale line through the lips on her left (front and left-side views) and stray chin lines blended out (front and right-side views). No Codex use. First paint attempt was too bright and thick (seen zoomed in, not saved); repainted thinner. Short dark jaw marks remain in the front view.
- Hekka take 4: "scar on the lip looks weird just remove it" (CAST.md updated; old line archived word for word) → take 5 = take 3 with only the stray chin lines blended out. No Codex use.
- Hekka take 5: "her chin on the front view looks smudged"
- Claude's side-by-side with take 3: Claude's own paint boxes crossed her jaw outline and broke it (also in take 4). Take 6 = take 3 with smaller boxes that stop above the jaw; jaw outline whole in the front and right-side views, zoomed in. No Codex use.
- Hekka take 6: "She's right, on to the bear" (held for the pair check; not locked yet)
- Bear size: "Bigger than a real bear, shoulder above Hekka's head" (notes only; about 2.2 m at the shoulder)
- Bear colours: "Ash-grey faded fur, Sever-grey plates"
- Bear core and armour: "Core in the chest, plates on head, shoulders and back"
- Bear chains (CAST.md: "a chained Hollow"): "Iron collar with one short chain end"
- Image 9 of this step (bear take 1): "Yes, make the bear"
- Bear take 1: 2048x1024; four true views; brow, shoulder and spine plates only; cables; iron collar; blank white eyes; closed mouth. Failed Claude's check: (a) the core reads as a pendant hanging from the chain, sticking out in front of the chest in the side views, not "where the bond used to be"; (b) the stub tail is a round fluffy ball, which looks cute. Notes: fur leans warm grey-brown rather than pure ash-grey; eyes have a slight glow.
- Image 10 of this step (bear take 2, edit of take 1: core built in + stub tail): "Yes, make take 2"
- Bear take 2 passed Claude's check: 2048x1024; core and frame now set into the chest, with only an edge and a sliver of glow in the side views; chain short, ending above the frame, not touching it; tail now a rough spiky stub in the side and back views. Head, plates, collar, cables, legs and claws look unchanged by eye. Notes: the tail is a little longer than the "about as long as a paw" asked for; fur still leans warm grey-brown; eyes keep a slight glow; size can't be judged on its own sheet.
- Pair check (Hekka take 6 + bear take 2): "Both pass" → locked sheets `art/refs/hekka-sheet-v6.png` and `art/refs/hollow-bear-sheet-v2.png`
- Images used so far in this step: 10 Codex images (trooper 1, Vasch 1-4, Hekka 1-3, bear 1-2); 52 counting everything before it, plus the 5 earlier timed-out tries. Hekka 4-6 painted by hand.
- Push: "Yes, push the branch"
- Silt coat (CAST.md: "long ragged black coat"): "To the knee, open at the front, torn hem"
- Silt weapon (none listed in CAST.md): "One bond-cutter at his right hip"
- Silt head: "Messy black hair, slit over his right eye, no Sever marks"
- Silt build: "178 cm, pale skin, black gloves"
- Silt under the coat: "Black fitted top, dark grey trousers, black boots"
- Whether to finish the two sheets a previous agent left unchecked: "Finish them here". How many images: "As many as you need to". "As many as you need to. If you hit the limit continue making the game and try again later"
- Image 11 of this step (Silt take 1): passed Claude's check, no redo. 2048x1024; four true views; adult face height and adult proportions; slit on the left of the picture in the front view (his right), showing in the right-side view, none in the left-side view; blade on the left of the picture in front, near hip in the right-side view, right of the picture in back, hidden in the left-side view; back-view gloves match the Sela standard by zoom (smooth back of the hand, fingers together, short thumb on the inner side); no text. Flaws: in the right-side view the slit is drawn flat on the side of the mask, as long as in the front view, and the mask reads as a flat plate rather than wrapping round; in the back view the blade is seen edge-on, so the hook does not show; the coat reads closed in the side views; the coat and gloves are nearly the same black.
- Image 12 of this step (hound take 1): failed Claude's check against the bear. 2048x1024; plates, core and blank eyes correct, but thin smooth lines against the bear's rough heavy ones, a mild jackal or greyhound face, and thin vein-like cables: no menace, not the same line of monster. Tail in the back view hung down between the legs and read as doubled.
- Image 13 of this step (hound take 2, fresh, not an edit, with the bear as the guide for how a Hollow is drawn): passed on menace and on style. 2048x1024. Tail in the back view now a round end seen head-on. New fault on zoom: a long shaded shape under the tail, between the back legs, that could read as anatomy.
- Image 14 of this step (hound take 3, edit of take 2: that one area only): passed Claude's check. 2048x1024; the shape is gone, plain fur, tail end now a small spiky tuft. Compared per view with take 2 by pixel difference: pixels changed by more than 40 levels: front 0.53%, left side 0.20%, right side 0.32%, back 2.61%, so the edit stayed mostly in the back view. Flaws: fur leans warm grey-brown like the bear; eyes keep a slight glow; the torn ear (his left) shows clearly in the front and back views only; ribs read as dark stripes; cables end at the neck plates, not the brow plate; the back-view tail tuft is a little sun-shaped; dark paw pads show in the back view; size cannot be judged on its own sheet.
- Marked "checked by Claude, Dylan's check pending" in `art/refs/STYLE.md`: `silt-sheet-v1.png` and `hollow-hound-sheet-v3.png`. Dylan has not seen either. All takes kept (hound 1-3).
- Images used so far in this step: 14 Codex images (trooper 1, Vasch 1-4, Hekka 1-3, bear 1-2, Silt 1, hound 1-3); 56 counting everything before it, plus the 5 earlier timed-out tries. Counted from the files; any timed-out tries by the earlier agent on Silt or hound take 1 left no record.
- Added by Claude, not asked for by Dylan (all easy to change on his check):
  - Hound size: shoulder level with Silt's chest, about 1.3 m (provisional, notes only; "rides a Hollow hound-beast" in CAST.md gives no size, and the sheet does not show a scale).
  - Hound colours: ash-grey fur matching the bear (take 1 used a paler bone grey), Sever-grey plates, black nose, lips and claws, blank white eyes.
  - Hound body: wolf-like head, two long upper fangs showing with the mouth closed, short torn ears, ribs showing, big bony shoulders, long tail with a rough tuft. No collar or chain.
  - Hound armour: plates on brow, back of the neck, shoulders and hips only, with the middle of the back left bare so a rider can sit there; no saddle. Thick cables with clamps, copied from the bear; CAST.md says cable "veins", and take 1's thin veins read weak.
  - Silt: black belt holding the coat shut at the waist only, above the V of his top (Dylan's answer was "open at the front"); thin black strap holding the mask on; a plain collar. Square belt buckle and blade clip are the model's own additions.
- Dylan's check (2026-11-07): "Vikram sheets look good", then "Meant villian". Silt take 1 (`silt-sheet-v1.png`) and hound take 3 (`hollow-hound-sheet-v3.png`) are passed, along with everything Claude added above. Hound takes 1-2 stay kept.

## Your words (2026-11-07, pictures: the four decisions in `docs/manga/IMAGE_REQUESTS.md`)
- Colour or black-and-white manga: "Colour (Recommended)"
- Images per day: "15 a day (Recommended)"
- Batch B (all of Issue 1) before or after Batch C (the 50 covers): "Issue 1 first (Recommended)"
- Lettering: "No text, reader balloons (Recommended)"

## Batch A: sheets for Issues 1 to 10 (2026-11-07)
- First subject: Warden Krell. His working sheet from Hot Hand (`games/hot-hand/art/raw/krell-sheet-v1.png`, never passed) copied to `art/refs/krell-sheet-v1.png` as take 1, with its prompt. Claude's check of take 1: 1774x887 (fix 16); back-view hands read as palms, thumbs on the outer edge (fix 22); arms at about 30 degrees, not 45.
- Krell take 2 (edit of take 1: back-view hands and size): "Yes, make the edit (Recommended)"
- Image 1 of today (Krell take 2): 2048x1024; back-view gloves smooth, fingers together, thumb inner side; everything else unchanged by eye. Flaws in both takes: no bar end in the side views; arms at about 30 degrees.
- Krell take 2: "second take hands look worse. take 1 looked fine."
- Krell size: "Resize on this PC (Recommended)" → take 3 = take 1 scaled to 2048x1024 on this PC (no Codex use) → locked sheet `art/refs/krell-sheet-v3.png`. Take 2 kept.
- Next subject: Nim Hadda. Source clash quoted to Dylan: `issue-06.js` "chalk stub behind his ear, shirtsleeves" vs `backstory/allies.md` "Waistcoat, pinned left sleeve, pencil behind the ear".
- Nim behind the ear: "Chalk stub (Recommended)"
- Nim outfit: "Waistcoat over shirtsleeves (Recommended)" (rolled shirtsleeves, buttoned waistcoat, left sleeve pinned up at the shoulder, dark trousers, worn shoes)
- Nim looks: "Pale, sandy hair" (pale freckled skin, thinning sandy hair, grey eyes, clean-shaven)
- Nim build: "176 cm, lean, soft-shouldered (Recommended)"
- Nim take 1: "Yes, make Nim (Recommended)" (image 2 of today)
- Nim take 1 failed Claude's check: 1774x887 (fix 16); "thinning" overshot to a bald crown and comb-over with dark under-eye rings, reads mid-40s, not 30. Passed: one-arm layout and sides in all four views; chalk behind the right ear; back-view hand reads from behind; outfit and colours; no text. Minor: chalk reads long.
- Nim take 2 (edit of take 1: fuller hair and younger face, size): "Yes, make take 2 (Recommended)" (image 3 of today)
- Nim take 2 timed out after 1200s, no file saved (fix 26). Counted as a try, not an image: images today 2 made + 1 timed out.

## Batch A continued (2026-11-08)
- Day count reset: 2026-11-07 used 2 images (Krell take 2, Nim take 1) plus 1 timed-out try (Nim take 2). Krell take 3 was a resize on this PC.
- Nim take 2 retry: "Retry the same edit (Recommended)" (image 1 of today)
- Nim take 2 passed Claude's check: 2048x1024; full sandy hair in all four views, no bald patch; face reads about 30; one-arm layout, sides, chalk behind the right ear, outfit and colours unchanged by eye; back-view hand reads from behind; no text. Minor: faint forehead lines in the front view; chalk still a little long.
- Nim take 2: "He passes (Recommended)" → locked sheet `art/refs/nim-sheet-v2.png`. Take 1 kept.
- Next subject: Lazare Quint. Look from `issue-07.js`: "short, round, immaculate ember-red tailcoat, white gloves, silver hair oiled flat, half-moon spectacles, a smile like a cat in a dairy."
- Quint sheet type: "Full four-view sheet (Recommended)"
- Quint looks: "Ruddy pale, pale blue, 160 cm (Recommended)"
- Quint face: "Neutral, mouth closed"
- Quint take 1: "Yes, make Quint (Recommended)" (image 2 of today)
- Quint take 1: 2048x1024; four true views; short and round, ruddy cheeks, pale-blue eyes, silver hair oiled back, neutral closed mouth; tailcoat, cravat, waistcoat, white gloves, tails behind in side and back views; no text. Failed Claude's check: (a) spectacles are full oval lenses at eye level, not half-moon low on the nose; (b) back-view gloves show thumbs on the outer edge (fix 22; Dylan accepted the same on Krell take 1). Minor: tails reach mid-calf, not the backs of the knees; coat reads deep crimson more than ember-red.
- Quint take 2 (edit of take 1): "Edit: half-moon glasses only (Recommended)" (image 3 of today)
- Quint take 2 passed Claude's check: 2048x1024; front view now flat-topped half-moon lenses lower on the nose with the eyes above; side views show the lens low by the nose tip with a gold arm to the ear; back view shows the gold arms at the ears; rest unchanged by eye. Still as take 1: back-view gloves with thumbs on the outer edge; tails to mid-calf; deep crimson red.
- Quint take 2: "gloves are fine in this picture, glasses are not they look weird and distorted"
- Quint glasses: "Try half-moon again" → take 3, a fresh edit of take 1 with simpler wording (image 4 of today)
- Quint take 3 timed out after 1200s, no file saved (fix 26). Today: 3 images made + 1 timed out.
- Quint take 3 retry: "Retry the same edit (Recommended)"
- Quint take 3 (image 4 of today) passed Claude's check: 2048x1024; front-view lenses small, symmetrical, flat-topped, just under the eyes with the eyes above, thin gold rims, clean lines (a white glint on his left lens); side views show a small lens low by the nose and a straight arm to the ear; back view shows the arms at the ears; rest unchanged by eye.
- Quint take 3: "He passes (Recommended)" → locked sheet `art/refs/quint-sheet-v3.png`. Takes 1-2 kept.
- Next subject: Mister Fenn, the dealer. Look from `issue-08.js`: "51, thin and silver-haired, white sleeve garters, has the most beautiful hands in the room".
- Fenn sheet type: "Full four-view sheet (Recommended)"
- Fenn looks: "Light brown, dark eyes, 185 cm (Recommended)"
- Fenn outfit: "House dealer's uniform (Recommended)" (white shirt with the garters, black waistcoat with ember-red trim, black bow tie, black trousers, black shoes)
- Fenn hair: "Neat side part, short (Recommended)"
- Fenn take 1: "Yes, make Fenn (Recommended)" (image 5 of today)
- Fenn take 1 passed Claude's check, no redo: 2048x1024; four true views, full A-pose; light brown skin, dark eyes, short silver hair parted on his left (right of the picture in front); white garters above both elbows, shirt puffing above them; black waistcoat with red piping, bow tie, black trousers and shoes; back-view hands read from behind (smooth back, fingers together, thumb hidden); bare hands, no rings; no text. Minor: front-view face reads mid-40s rather than 51 (fine lines show in the side views); the back of the head has a short darker underlayer at the nape.
- Fenn take 1: "He passes (Recommended)" → locked sheet `art/refs/fenn-sheet-v1.png`.
- Next subjects: Hob Tarrow and Marta Oake. CANON.md conflict 16 (Tolly Marsh and Bess in `issue-01.js`; an unnamed farmer, 68, in `issue-02.js`; Hob Tarrow and Thimble in `issue-03.js`) put to Dylan before drawing.
- Farmer, first ask: "are they 2 seperate people in both issues or the same person? that decides what we make"
- Claude's answer: the scripts never say; Issue 1 names Tolly and Bess, Issue 2 has an unnamed farmer of 68 who sets up Issue 3, Issue 3 names Hob and Thimble and strips them.
- Farmer: "One man: Hob and Thimble (Recommended)" (Issue 1's Tolly and Bess become Hob and Thimble, Issue 2's farmer is Hob; one sheet in Issue 3's look). The scripts are not changed in this step.
- Hob's mark on the sheet: "Before: glowing green (Recommended)" (moss-green ploughshare, left forearm, from `issue-03.js`)
- Hob looks: "Weathered tan, white stubble (Recommended)" (sun-weathered tan skin, wispy white hair, white stubble, brown eyes)
- Marta looks: "Sturdy, grey bun, headscarf (Recommended)" (160 cm, sturdy, olive skin, grey hair in a bun under a faded headscarf, long skirt, apron, shawl)
- Hob take 1: "Yes, make Hob (Recommended)" (image 6 of today)
- Hob take 1: 2048x1024; four true views, A-pose; reads 68 (lined tan face, white stubble, wispy white hair under a brown tweed cap); collarless blue shirt rolled below the elbow, patched brown waistcoat, baggy trousers, scuffed boots; mark sides all correct (right of the picture in front, nearest arm in the left-side view, hidden in the right-side view, left of the picture in back); right forearm clean; no text (the cap tweed is a zigzag weave, not text, by zoom). Flaws: the mark is bright lime green, not moss-green, and bigger than "small" (about a third of the forearm); it reads as a teardrop or leaf more than a ploughshare; back-view thumbs sit on the outer edge (fix 22, as Krell take 1).
- Hob take 1: "the mark doesnt read as being in the same spot from the different views, it moves. make it more consistent and make it moss-green and smaller"
- Hob take 2 (edit of take 1: mark removed and redrawn, moss-green, small, outer left forearm, same height per view; fix 27 and 17): "Outer forearm, this prompt (Recommended)" (image 7 of today)
- Hob take 2 passed Claude's check: 2048x1024; old lime mark gone; new mark muted moss-green and about half the size; whole mark in the left-side view, a thin sliver at the outer edge in the front view (right of the picture) and back view (left of the picture), all at about the same height in the upper half of the forearm (a little nearer the elbow than halfway); right forearm clean; rest unchanged by eye. Still a teardrop shape more than a plough blade.
- Hob take 2: "He passes (Recommended)" → locked sheet `art/refs/hob-sheet-v2.png`. Take 1 kept. Added known fix 36 to STYLE.md.
- Marta take 1 approval card answered instead with: "any way to automate this? go through reviews with the things ive said in the past that are wrong like the mark not being consistent in all the views, the hands looking the wrong way from the back etc. would like you to make 5 sheets after youve reviews them for me to look at and approve. make it a skill so i can do it for any images for this project that need to get made. also ways learn from what i tell you to add to the reviews judment calls. also use the consistant art style across everything that we have in the art bible." (Marta not made yet.)
- Automation, auto redos before Dylan sees a sheet: "Up to 3 redos"
- First automated batch: "Marta, Tull, Thimble x2, Gullwake (Recommended)"
- Budget if 15 runs out mid-batch: "Finish the batch today"
- Unset looks: "Ask me all at once first (Recommended)"
- Gap answers for the automated batch:
  - Mr. Tull: "Slight, neat, nervous (Recommended)" (170 cm, slight; thin mousy-brown hair parted flat; pale grey-green eyes; round wire glasses; bar and ring on his coat like the troopers; no helmet or weapon; telegrams left out of the sheet)
  - Hollow Thimble: "Like the bear, bell gone (Recommended)" (plates on brow, shoulders and spine; cables from a white core in the chest; blank white eyes; moss-green hair gone dull grey-green; brass bell removed)
  - Gullwake masts (game sprite shows one; `backstory/world.md` and CANON.md say three with the aftermost a stump, the Post): "Three masts, Post stump (Recommended)"
  - Gullwake layout: "Two pictures (Recommended)" (a four-view sheet: bow, left side, right side, stern; and a deck plan from above; Vesh and crew left out)
  - Thimble tail: "Short, shaggy tuft (Recommended)"
- Automated batch (Marta, Tull, Thimble, Hollow Thimble, Gullwake sheet, Gullwake deck): "Yes, run the batch (Recommended)". Marta take 1 = image 8 of today, Tull take 1 = image 9.
- Thimble take 1 = image 10 of today, Gullwake sheet take 1 = image 11.
- Marta take 1 (image 8) passed Claude's review against REVIEW_CHECKLIST.md: 2048x1024 (1); no text, the shawl's cable knit is a knit pattern (2); adult woman reading about 60 (3, 6); four true views (8); back-view hands read from behind (12); scarf knot and bun at the back of the head (13). NOTES: a small closed smile rather than a flat neutral mouth; boots are lace-up rather than plain ankle boots.
- Tull take 1 (image 9) passed Claude's review: 2048x1024 (1); no text (2); bar and ring front only, bar ends in both side views, back plain (9); hair parted on his right, left of the picture in front (9); round wire glasses even and clean (14); back-view hands read from behind (12); bare head, bare hands, no weapon (7). NOTE: a youthful face, reads mid-20s (he is 27).
- Fixed a bug in `tools/zoom-crops.ps1` found on first use (PowerShell ignores case, so $W overwrote $w and the crops came out half black).
- Thimble take 1 (image 10) passed Claude's review: 2048x1024 (1); no text (2); four true views (8); shaggy moss-green hair with moss on the back, pillar legs, stub horns, kind brown eyes, cracked brass bell on a strap in all four views (bell under the chin in front and both sides, strap over the neck in back) (9); no armour or glow (7). NOTES: the snout reads as a broad cow or hippo muzzle more than a spade; the eyes have heavy, human-looking lids; the back-view tail hangs down over the rump as a stub and tuft instead of pointing at us (19).
- Gullwake sheet take 1 (image 11): 1774x887 (FAIL 1). Otherwise passed: four true views, bow left in the left-side view and right in the right-side view (8); fore mast, taller main mast with crosstrees, the Post stump at the quarterdeck; towing post and rope at the bow; tub and canvas screen on the foredeck; hatches; quarterdeck with wheel, awning and table; salvage crane with hook at the stern; stern windows and lantern; cream sails with a red patch; no lettering (2); no creatures (7). NOTE: the red patch sits on a different yard in the bow view than in the side views.
- Gullwake sheet take 2 = take 1 resized on this PC to 2048x1024 (skill step 4: size-only fix, not a picture).
- Hollow Thimble take 1 = image 12 of today (made from Thimble take 1), Gullwake deck take 1 = image 13.
- Hollow Thimble take 1 (image 12): 1774x887 (FAIL 1); take 2 = take 1 resized on this PC to 2048x1024. Otherwise passed: four true views (8); same body as Thimble take 1; blank white eyes; core set into the chest in a steel frame, a sliver of glow at the chest front in both side views, none in back (9, 10); brow plate between the horns, shoulder plates, a row of spine plates; cables with clamps from the core to the shoulder plates; bell and strap gone (7); no text (2). NOTES: hair reads dull grey-beige more than grey-green; less menace and finer lines than the bear (18: she reads sad, which the prompt asked for); back-view tail hangs over the rump as on Thimble.
- Gullwake deck take 1 (image 13) passed Claude's review: 1024x2048 (1); straight top-down, bow at the top; towing post with chain and rope, tub and canvas screen, fore hatch, fore mast and yard, main hatch, main mast with the widest yard and the red sail patch, the Post stump, quarterdeck with awning, table, wheel and cutlass rack, salvage crane at the stern; stern cabin roof and lantern; no lettering (2); no creatures (7). NOTES: portholes are drawn on the deck inside the rail (they belong on the hull sides); a chain as well as rope at the towing post.
- Batch total: 6 Codex images (8 to 13 of today), no redos needed beyond two size fixes on this PC. Today: 13 images.
- Dylan, instead of answering the batch cards: "can you make the skill make an artifact with the pictures and zoomed in pictures of the areas of interest/where things can go wrong after it completes the batch and updates it with the current batch so i can see them and links it for easier access. than give me a toast choice cards for each character/sheet/image to approve/deny/other or any other options you can think of to make it easier and more automated"
- Built: `tools/review-images.ps1` and `tools/review-page.js` (page from `art/review/batch-*.json`), skill step 5 rewritten, page published once to https://claude.ai/artifact/FKxuBtti8WDyTxsMsb7tUU (recorded in `art/review/REVIEW_PAGE.md`). No Codex use.
- Marta take 1: "Approve (Recommended)" → locked `art/refs/marta-sheet-v1.png`
- Tull take 1: "Approve (Recommended)" → locked `art/refs/tull-sheet-v1.png`
- Thimble take 1: "Approve (Recommended)" → locked `art/refs/thimble-sheet-v1.png`
- Hollow Thimble take 2: "Approve (Recommended)" → locked `art/refs/thimble-hollow-sheet-v2.png`
- Gullwake sheet take 2: "the way the masts that hold the sails that are rolled up display differently in each view and need to be fixed so they are all the same and at the right angle to be used if the sails were to be put down. also match the red patch to the same spot on all views."
- Gullwake deck take 1: "redo no deck portholes. also what is the canvas screen on the deck for? get rid of it if no legitimate use"
- Claude's answer on the screen: it is the bath screen from Issue 2 ("The sail-screen hides the tub completely; only steam drifts over the top", `issue-02.js` line 569; `backstory/world.md` §7), so it stays. Checklist line 18b and calls D7-D8 added.
- Gullwake sheet take 3 (edit of take 1: square yards matching in every view, red patch in one place) = image 14 of today; deck take 2 (edit of take 1: deck portholes removed) = image 15.
- Gullwake sheet take 3 (image 14) passed Claude's review: 2048x1024; yards square across the ship: bow and stern views show three yards full width (fore, main lower, main upper), side views show them end-on as stubs (one on the fore mast, two on the main, none on the Post); red patch on the main lower yard's starboard end (left of the picture in the bow view, right in the stern view, near end in the right-side view, hidden in the left-side view); hull and deck unchanged by eye. NOTE: the fore yard in the bow and stern views sits a little higher than its side-view stub.
- Gullwake deck take 2 (image 15) passed Claude's review: 1024x2048; deck portholes gone, planks painted in; everything else unchanged by eye; screen kept.
- Gullwake sheet take 3: "Approve (Recommended)" → locked `art/refs/gullwake-sheet-v3.png`
- Gullwake deck take 2: "Approve (Recommended)" → locked `art/refs/gullwake-deck-v2.png`
- Images used 2026-11-08: 15 Codex images (Nim 2; Quint 1-3; Fenn 1; Hob 1-2; Marta 1; Tull 1; Thimble 1; Hollow Thimble 1; Gullwake sheet 1 and 3; deck 1-2) plus 1 timed-out try (Quint 3, first run). Resizes on this PC (Gullwake sheet 2, Hollow Thimble 2) used no images.

## Your words (2026-11-08, the farmer rename)
- Rename Tolly and Bess in the scripts: "Yes, rename now"
- The rename plan (Issues 1 and 2, Episode 3, the canon register, old lines archived): "Yes, apply it (Recommended)"
- Applied: `issue-01.js` (Tolly Marsh and Bess → Hob Tarrow and Thimble, looks from the locked sheets, spelling joke now "T, H, I, M, B, L, E"), `issue-02.js` (the unnamed farmer → Hob, speaker "Hob"), `ep-03.md` (Hob Anser and Tamble → Hob Tarrow and Thimble; look and the ploughshare mark from the sheets), CANON.md conflict 16 marked decided. Old lines word for word in `docs/manga/archive/renames-2026-11-08.md`. `node tools/manga-smoke.js`: "PASSED: shelf and 51 issue(s) at 375x812 and 1280x800"; `node tools/manga-check.js`: "51 clean, 0 with problems".
- Found while renaming: Thimble is "she" in `issue-03.js` and "he" in `ep-03.md`. Dylan: "She, fix Episode 3 (Recommended)" → three Episode 3 lines changed, archived.

## Your words (2026-11-08, next batch: faces and Kaito's arm)
- Batch: "Kaito first, then the other five (Recommended)"
- Kaito arm stages: "Three (Recommended)" (hand to elbow; up the upper arm, Issue 12; past the shoulder onto the chest, Part Two, scars only, no rig)
- Faces layout: "should we do 4 3/4 views instead to get a true reference for for any angle they are facing? or whats the best layout best amount of views to get everything right for any angle we need to draw"
- When: "well keep going until we hit the limit dont ask anymore" (standing answer: no more go-ahead cards for spending pictures; run until the ChatGPT limit; approval cards stay)
- Faces layout, Claude's recommendation (the body sheets already lock front, profiles and back; one fixed 3/4 angle keeps eight expressions the same person): "Head turnaround + 3/4 expressions (Recommended)" (per lead: 5 neutral heads, front, both 3/4s, both profiles; 8 expressions at one 3/4 left angle)
- Claude's calls on Kaito's arm sheet (easy to change): gauntlet off and jacket not at the waist so the scars show; scars wrap all the way round the arm (fix 27); three waist-up front views.
- Kaito head take 1 = image 16 of today, faces take 1 = image 17, arm take 1 = image 18.
- Dylan, mid-batch: "and should we add that retroactively to the past sheets?" Claude's tiers: leads both pictures; Vasch, Hekka, Krell, Nim both; Silt and walk-ons (Quint, Fenn, Hob, Marta, Tull) head turnaround only; partners and Hollows (Skarn, Vesh, Ashka, Hush, Grist, Prism, bear, hound, Thimble) head turnaround; troopers none.
- Past sheets: "Yes, by the tiers above (Recommended)" (about 26 pictures, after the leads)
- Kaito head take 1 (image 16): 2048x1024; five true angles; streak on his right in every view; scar right in the 3/4-left and profile-left views; faces adult. FAIL 9: in the FRONT portrait the eyebrow scar is on his RIGHT eyebrow (left of the picture), the streak's side. Auto redo: take 2, edit of the front portrait only.
- Kaito faces take 1 (image 17): 1774x887 (FAIL 1) → take 2 = take 1 resized on this PC. Otherwise passed: one 3/4-left angle in all eight; scar on his nearer (left) eyebrow, streak at the far front hairline; eight distinct adult expressions; gag face exaggerated but adult; the blush hatching and gag-face gloom lines are drawing marks, not text.
- Kaito arm take 1 timed out after 1200s, no file (fix 26). Auto retry with the same prompt.
- Kaito head take 2 (image 18): came back almost unchanged (fix 11); the front-view scar is still on his right eyebrow. Auto redo 2: take 3, edit with the arm sheet's correct front face as Image 2.
- Kaito arm take 1 retry (image 19): 1774x887 (FAIL 1) → take 2 = resized on this PC. Otherwise passed: three waist-up front views; scars on the right arm only, left arm clean; (1) hand to elbow and stop, (2) up the upper arm to just below the shoulder, (3) over the shoulder onto the right side of the chest, stopping before the middle; glowing yellow fork on the right hand; eyebrow scar on his left (right of the picture); scars are branching shapes, no text.
- Kaito head take 3 = image 20 of today.
- Kaito head take 3 timed out after 1200s, no file (fix 26). Auto retry once.
- Kaito head take 3 retry (image 21) passed Claude's review: 2048x1024; front portrait scar now on his left eyebrow (right of the picture), right eyebrow clean; the other four portraits unchanged by eye.
- Images today: 21 Codex images, plus 3 timed-out tries (Quint 3 first run, Kaito arm first run, Kaito head 3 first run).
- Kaito head take 3: "approve and make sure that you compare the others to this sheets expressions so they all get the same expressions and not something totally different. characters can have more or less extreme facial movements as long as its the same type of expression. should there also be a front and other side view to get more details for the references?" → locked `art/refs/kaito-head-v3.png`; layout passed for every lead.
- Kaito faces take 2: "add more expressions if you think more are needed. see from the summaries of the manga/anime/lore if possible."
- Claude's count of emotion words in the art notes of all 51 issues (`manga/issues/*.js`): sleep 217, grin 214, laugh 120, disgust 61, furious 46, pain 44, rage 39, drunk 29, tired 28, hungry 26, tears 25, angry 24, deadpan 23, awe 23, tender 20, sly 20, glare 20, worried 19, proud 19, surprised 17. Already covered: grin, grief/tears, shout, smug/sly, blush, fear, gag. Claude's pick for a second expression sheet (Claude's call, easy to change): LAUGH, RAGE (gritted teeth), PAIN (wince), DISGUST, SURPRISED, TENDER smile, EXHAUSTED, ASLEEP.
- Kaito arm take 2: "redo with gauntlet and make the yellow go further up the scar with each stage" → take 3, edit of take 1 (image 22 of today). Kaito second expression sheet take 1 = image 23.
- Expression angles per lead: "Front and 3/4 right" (each lead: head turnaround + two expression pages at 3/4 left, front and 3/4 right = 7 pictures)
- Kaito arm take 3 (image 22) passed Claude's review: 2048x1024; gauntlet back on, three metal bands matching `kaito-sheet-v8.png`; glow climbs per stage (hand and wrist; to the elbow; the whole arm to the chest); scars still show around the gauntlet; left arm clean; eyebrow scar on his left.
- Kaito faces page 2 take 1 (image 23) passed Claude's review: 2048x1024; one 3/4-left angle; scar on the nearer (left) eyebrow, checked zoomed in on the rage cell and against the head turnaround; eight distinct adult faces matching the asked list; the anger cross on the rage forehead is a drawing mark, not text.
- Kaito front pages (faces, faces2) = images 24-25; 3/4-right pages = 26-27.
- Kaito front page 1 (image 24): 1774x887 (FAIL 1) → v2 resized on this PC. Passed otherwise: all eight face front, scar on his left eyebrow (right of the picture), streak left of the picture, same expressions as the 3/4-left page cell for cell (D9).
- Kaito front page 2 (image 25) passed: 2048x1024; front; scar and streak sides right; same eight expressions as page 2 at 3/4 left.
- Kaito 3/4-right page 1 (image 26): 1774x887 (FAIL 1) → v2 resized. Scar hidden on the far side, as on the approved head turnaround's 3/4-right portrait; streak near; same expressions cell for cell.
- Kaito 3/4-right page 2 (image 27): FAIL 9: the scar is drawn on the NEAR (right) eyebrow beside the streak. Auto redo: v2, edit removing it so the scar is hidden as on the head turnaround (image 28).
- Kaito 3/4-right page 2 redo timed out after 1200s, no file (fix 26). Auto retry once.
- Kaito 3/4-right page 2 v2 retry (image 28) passed Claude's review: 2048x1024; the scar is gone from the near eyebrow in all eight, hidden as on the head turnaround; expressions and everything else unchanged by eye. Today: 28 Codex images plus 5 timed-out tries.
- Kaito expression pages (all six): "group the expressions together with all of their views to make it easier to judge that they are all the same expression. we dont need the picture with the full panel of expressions just the grouped together views/expressions" → the review page now shows each expression as one row of its three views (3/4 left, front, 3/4 right), no full pages.
- Kaito arm take 3: "Approve (Recommended)" → locked `art/refs/kaito-arm-v3.png`
- Kaito's 16 expressions, each judged in its three views: all 16 ticked as passing (Neutral, Grin, Shout, Blush, Fear, Grief, Smug, Gag face, Laugh, Rage, Pain, Disgust, Surprised, Tender, Exhausted, Asleep) → locked `kaito-faces-v2`, `kaito-faces-front-v2`, `kaito-faces-34r-v2`, `kaito-faces2-v1`, `kaito-faces2-front-v1`, `kaito-faces2-34r-v2`.
- Built `tools/face-prompts.py` (writes each lead's head and six expression prompts from one data table, sides per view worked out from each detail's own side). Leads' head turnarounds = images 29-33 of today.
- Dylan, mid-batch: "we should do that with their body views and any other reference sheets weve made"
- Body views: "Add 3/4 body views (Recommended)" (a second full-body sheet for every locked sheet: three-quarter front-left, front-right, back-left, back-right; creatures and the ship too). Kaito's goes first as the layout test, then the queue.
- Head turnarounds: Sela (image 29) and Silas (image 30) made; Juno, Bram and Ione timed out after 1200s, no files (fix 26). Auto retry once each; Kaito 3/4 body take 1 runs with them.
- Sela head take 1 (image 29) passed Claude's review: 2048x1024; five true angles; whirlpool mark below her LEFT collarbone, right of the picture in front, near side in 3/4 left and profile left, hidden in 3/4 right and profile right; round spiral, no tail (zoomed); hoops in both ears; ponytail; no text. NOTE: the low V and bandeau make the chest prominent in the side views, as on her locked sheet.
- Silas head take 1 (image 30): 1774x887 (FAIL 1) and FAIL 9: a beauty mark under BOTH eyes in the front portrait (he has one, under his left eye). Neck marks on his left in every view, correct. Auto redo: take 2, edit (one mark removed, size).
- Juno head (image 31), Bram head (32), Ione head (33), Kaito 3/4 body (34) landed on retry. Silas head take 2 = image 35.
- Juno head (image 31): 1774x887 (FAIL 1) → v2 resized. Passed otherwise: braid over her LEFT shoulder (right of the picture in front, near in 3/4 left and profile left, hidden on the right); feather mark below her RIGHT collarbone (left of the picture in front, near on the right, hidden on the left); freckles, green eyes, fur collar. NOTE: chest prominent in the side views, as on her sheet.
- Bram head (image 32) passed: 2048x1024; anvil mark on his left chest, iron patch on his left shoulder, towel and strap on his right shoulder, each on the right side per view; tattoos on both shoulders as pattern only; shaved head, beard.
- Ione head (image 33) passed: 2048x1024; white lock and neck crystals on her LEFT per view (right of the picture in front; sliver of the lock in 3/4 right; hidden in profile right); round glasses even; V-neck and coat.
- Kaito 3/4 body (image 34): 1774x887 (FAIL 1) and FAIL 9: no gauntlet on his right arm in the 3/4-back-left view. Passed otherwise: four 3/4 views, A-pose, streak and gauntlet sides right in the other three, back-view hands from behind. Auto redo: take 2, edit (image 36).
- Lead expression pages start: Sela, Juno, Bram, Ione (6 each), then Silas once his head passes.
- Silas head take 2 (image 35) passed Claude's review: 2048x1024; one beauty mark, under his left eye (right of the picture in front); neck marks on his left; the other four portraits unchanged by eye.
- Kaito 3/4 body take 2 = image 36; Sela and Juno expression pages = images 37-48 (no timeouts). Bram, Ione, Silas pages start (images 49 on).
- Kaito 3/4 body take 2 (image 36) passed Claude's review: 2048x1024; gauntlet, scars and hand mark now on his right arm in the 3/4-back-left view too; the other three views unchanged by eye.
- Sela's six expression pages and Juno's six (images 37-48) passed Claude's review, checked as a montage per lead (`tools/montage.ps1`) and one full page each zoomed: every cell the same type of expression as Kaito's (D9); Sela's mark below her left collarbone shows in front and 3/4 left and is hidden at 3/4 right; Juno's braid on her left and feather mark on her right per angle; adult faces, gag faces not chibi. Four pages came out 1774x887 (FAIL 1) and were resized on this PC as v2: `juno-faces2-34l`, `juno-faces2-front`, `sela-faces-34r`, `sela-faces2-34r`. NOTE: both women's chests read prominent in the low necklines, as on their sheets.
- Bram's, Ione's and Silas's six expression pages each (images 49-66, run across midnight into 2026-11-09; no timeouts) passed Claude's review by montage: every cell matches Kaito's expression type (D9); Bram's anvil and iron patch on his left and towel on his right per angle; Ione's lock and neck crystals on her left (hidden or a sliver at 3/4 right); Silas's neck marks and one beauty mark on his left. Eight came out 1774x887 (FAIL 1) and were resized on this PC as v2: `bram-faces-front`, `bram-faces2-34r`, `ione-faces-34l`, `ione-faces-front`, `ione-faces2-34r`, `silas-faces-34r`, `silas-faces2-34r`, `silas-faces2-front`.
- Count since the 2026-11-08 morning start: 66 Codex images plus 8 timed-out tries.
- Kaito 3/4 body take 2: "Approve (Recommended)" → locked `art/refs/kaito-body34-v2.png`; the layout for every three-quarter body sheet.
- Heads and expressions of the five leads: "we should have kaitos expressions to compare next to the other" → review page rebuilt: one item per expression, Kaito's three views first as the guide, then each lead's three views underneath.
- Heads: "Sela and Juno pass", "Bram passes", "Ione passes" → locked `sela-head-v1`, `juno-head-v2`, `bram-head-v1`, `ione-head-v1`. Silas: "why is silas missing his shoulders redo so its like the others."
- Expressions 1-8: "ShoutSilas, 3/4 left missing shoulders, Blush Juno, 3/4 right missing ponytail on shoulder, Blush Silas, 3/4 left missing shoulders, Fear Silas, 3/4 left missing shoulders, Grief Silas, 3/4 left missing shoulders, Smug Silas, 3/4 left missing shoulders, Gag face Silas, 3/4 left missing shoulders, Laugh Silas, 3/4 right missing shoulders, Rage Silas, 3/4 right missing shoulders, Pain all characters 3/4 views has eye opened/closed inconsistancies and silas missing dhould on 3/4 right, Disgust Silas, 3/4 right missing shoulders, Surprised  Silas, 3/4 right missing shgoulders, Tender Silas, 3/4 right missing shoulders, Exhausted Silas, 3/4 right missing shoulders, Asleep Silas, 3/4 right missing shoulders"
- Expressions 9-16: "All 8 match"
- Read as: every other expression passes for every lead. Redos: Silas head and his page-1 3/4-left and page-2 3/4-right pages (shoulders cut off); Juno's page-1 3/4-right blush (braid missing on her shoulder); the PAIN cell's shut eye on every character's 3/4 pages (which eye is shut changes between views).
- Claude's look at the PAIN cells side by side: every FRONT view shuts the character's LEFT eye; most 3/4-right views shut the near (right) eye instead, and Silas's and Ione's 3/4-left views shut the far eye. Rule set: the LEFT eye is shut in every view (checklist D11).
- Redo edits (11 pictures, Dylan's redo answers are the yes): pain eye on `kaito`, `sela`, `juno`, `bram`, `ione` 3/4-right page 2 and `ione`, `silas` 3/4-left page 2; Silas head, page-1 3/4-left and page-2 3/4-right (shoulders; the last also the pain eye); Juno page-1 3/4-right blush braid.
- Redo results (2026-11-09): passed Claude's review, zoomed on the pain cell: `kaito-faces2-34r-v3`, `juno-faces2-34r-v2`, `ione-faces2-34r-v3` (near right eye open, far left eye shut), `silas-faces2-34l-v2` (near left eye shut, far right eye open); `silas-faces-34l-v2` now shows full shoulders and shirt in all eight, neck marks on his left, one beauty mark. Six timed out twice each, no files (fix 26): `sela-faces2-34r-v3`, `bram-faces2-34r-v3`, `ione-faces2-34l-v2`, `silas-head-v3`, `silas-faces2-34r-v3`, `juno-faces-34r-v2`. One more try each, one at a time.
- Third tries (2026-11-09, one at a time): all six timed out again after 1200s, no files: `sela-faces2-34r-v3`, `bram-faces2-34r-v3`, `ione-faces2-34l-v2`, `silas-head-v3`, `silas-faces2-34r-v3`, `juno-faces-34r-v2`. Read as the ChatGPT picture limit reached; the queue stops here (Dylan: "keep going until we hit the limit"). Their prompts stay in `art/refs/prompts/` for the next run.
- Count since the 2026-11-08 morning start: 71 Codex images plus 26 timed-out tries.
- Review page rebuilt from `art/review/batch-2026-11-09-c.json`: the Pain row with the redone views, and Silas's page-1 expressions beside Kaito's (old Sela and Silas cell images from the first layout removed from the page).
- Redos: Pain eye: "All four pass (Recommended)" → locked `kaito-faces2-34r-v3`, `juno-faces2-34r-v2`, `ione-faces2-34r-v3`, `silas-faces2-34l-v2`. Silas page 1 at 3/4 left: "Passes (Recommended)" → locked `silas-faces-34l-v2`. Also locked in STYLE.md from earlier answers: `kaito-body34-v2`, the four leads' heads, and the leads' expression pages.
- Next run: "Try one now" → one test: the Silas head redo (`silas-head-v3`).
- Test (image 72 since the 2026-11-08 start): `silas-head-v3` landed, so the limit had reset. Passed Claude's review: 2048x1024; full shoulders and open white shirt in all five portraits, framed like `sela-head-v1`; three violet neck marks on his left (right of the picture in front, near in 3/4 left and profile left, hidden in profile right); one beauty mark under his left eye.
- The other five redos run now, two at a time (one retry each): `silas-faces2-34r-v3`, `juno-faces-34r-v2`, `sela-faces2-34r-v3`, `bram-faces2-34r-v3`, `ione-faces2-34l-v2`.
- The five redos (images 73-77) all landed on the first try at 2048x1024 and passed Claude's review, zoomed: Pain shuts the LEFT eye in `sela-faces2-34r-v3`, `bram-faces2-34r-v3`, `silas-faces2-34r-v3` (near right eye open, far left shut) and `ione-faces2-34l-v2` (drawn facing the right edge like her other 3/4-left cells; right eye open, left shut); `silas-faces2-34r-v3` shows full shoulders and shirt in all eight; `juno-faces-34r-v2` Blush shows her braid over her far (left) shoulder down the jacket front. NOTES: in Silas's 3/4-right Laugh face his beauty mark sits under the near (right) eye, and it was already there in v2 (checklist 9); Juno's other 3/4-right faces and her head turnaround hide the braid behind her.
- Count since the 2026-11-08 morning start: 77 Codex images plus 26 timed-out tries. Review page: `batch-2026-11-09-d.json`.
- Silas head take 3: "Passes (Recommended)" → locked `silas-head-v3`. Pain row: "All pass (Recommended)" → locked `sela-faces2-34r-v3`, `bram-faces2-34r-v3`, `ione-faces2-34l-v2`, `silas-faces2-34r-v3` (Pain cell).
- Juno 3/4-right braid: "Show it in all eight" → redo `juno-faces-34r-v3` (edit: braid over her far shoulder in the other seven, as in Blush). Checklist D12 already covers this (front-hanging hair shows at the far 3/4); the review missed applying it to the other seven cells.
- Silas 3/4-right Laugh mark: "Redo: move the mark (Recommended)" → redo `silas-faces2-34r-v4` (edit: remove the mark under the near eye).
- Images 78-79 landed first try at 2048x1024 and passed Claude's review: `juno-faces-34r-v3` shows her braid over her far (left) shoulder down the jacket front in all eight faces, faces unchanged by eye; `silas-faces2-34r-v4` Laugh has no mark under the near eye (zoomed), the rest unchanged by eye. Review page: `batch-2026-11-09-e.json`. Count since the 2026-11-08 morning start: 79 Codex images plus 26 timed-out tries.
- Juno 3/4-right braid: "Passes (Recommended)" → locked `juno-faces-34r-v3`. Silas Laugh mark: "Passes (Recommended)" → locked `silas-faces2-34r-v4`. All six leads' face sets are locked.

## Your words (2026-11-09, next phase: three-quarter body sheets)
- "Goal: a three-quarter body sheet for every locked sheet in STYLE.md, the five leads first (Sela, Juno, Silas, Bram, Ione), then the other people, then creatures and the ship. Batches of about 5; review each picture against the checklist; up to 3 automatic redos; publish each batch to the same review page ... then approval cards per sheet. Keep going until the ChatGPT limit (repeated 1200s timeouts); don't ask me to approve the spending. After the bodies: face sets for Vasch, Hekka, Krell and Nim, then head turnarounds for Silt, the walk-ons, and the partners and Hollows (extend tools/face-prompts.py). Log every answer and count in docs/DECISIONS.md, commit each batch, and end with a phone-readable report."
- "The site is live ... so push nothing unless I say."
- Read as: no go-ahead cards for spending or for each batch's prompts (this message is the yes for every batch and up to 3 redos each); the 15-a-day number is set aside for this run; approval cards per sheet stay.
- Claude's calls (easy to change): new `tools/body34-prompts.py` + `tools/body34_data.py` write every three-quarter body prompt from one data table, sides per view worked out from each detail's own side and which face of the body it sits on (front, back, or round); `tools/run-body34.sh` runs them two at a time with one retry. Every prompt attaches the character's locked sheet as Image 1, `kaito-body34-v2.png` as Image 2 (angles, pose and framing only), and `sela-sheet-v5.png` as Image 3 (back-view hands; Sela's own prompt uses her sheet). D12 applied: Juno's braid shows over her far shoulder in the 3/4-front-right view.
- No look gaps or CANON conflicts for the five leads: every look comes from the locked sheets (CANON 0.7, Bram's towel on the right, already matches his sheet).

### Batch 1: the five leads' three-quarter bodies (2026-11-09)
- Prompts: `art/refs/prompts/{sela,juno,silas,bram,ione}-body34-v1.txt`. Count restarts at 0 for this run (79 Codex images before it since the 2026-11-08 morning start).
- Sela body34 take 1 = image 1 of this run, Juno take 1 = image 2 (both first try, about 2 minutes).
- Juno body34 take 1 (image 2) passed Claude's review: 2048x1024; four 3/4 views, A-pose; braid on her LEFT in every view (near shoulder in 1 and 3, over the far shoulder in 2 per D12, the top of it in 4); feather mark below her RIGHT collarbone (far side in 1, near in 2, hidden in 3-4); pocket on the LEFT sleeve only; burn skin at both glove edges; no rifle or bandolier. NOTE: the back views show her short shorts from behind, as on her locked sheet's back view; neutral A-pose, not posed. Fingerless-glove back hands read from behind (D1).
- Sela body34 take 1 (image 1): FAIL 11: the bond mark is drawn as rings inside rings (a target), not the whirlpool spiral on her locked sheet. Passed otherwise: mark on her LEFT (right of the picture in 1 and 2), hidden in 3-4; spyglass on her RIGHT hip and logbook on her LEFT in every view; skirt slit on her LEFT leg in 1 and 2; hoops, ponytail; back-view hands from behind. Auto redo 1: `sela-body34-v2`, an edit of the mark only, with her locked sheet as the shape guide.
- Silas take 1 = image 3, Bram take 1 = image 4 (first try). Sela redo `sela-body34-v2` = image 6 (after Ione, image 5).
- Bram body34 take 1 (image 4) passed Claude's review: 2048x1024; anvil on his LEFT chest (near in 1, far in 2, hidden in 3-4), anvil shape, not a T; iron patches on his LEFT shoulder and forearm in every view; towel and the one strap up on his RIGHT shoulder; back bib buckled to the right strap, left corner sagging with the loose strap at his left hip; hammer at his RIGHT hip, tool pouch at his LEFT; tattoos are pattern only; back-view hands from behind.
- Silas body34 take 1 (image 3): FAIL 9: a small dark dot below the NEAR (right) eye in the 3/4-front-right view; he has one beauty mark, under his left eye. Passed otherwise: beauty mark under his left eye in view 1; three violet neck marks on his LEFT (near in 1 and 3, hidden in 2 and 4); knife at his RIGHT hip in every view; ponytail down the middle of the back; back-view hands from behind. NOTE: the neck marks read a little like petals, as on his locked sheet. Auto redo 1: `silas-body34-v2`, edit removing the dot.
- Sela body34 take 2 (image 6): 2048x1024; the mark now has a small inward swirl but still sits inside a closed outer ring (zoomed beside the locked sheet's mark, which is one line spiralling in). Still FAIL 11. Everything else unchanged by eye. Auto redo 2: `sela-body34-v3`, edit of take 2 (no closed outer circle; one line from the outside in).
- Ione body34 take 1 (image 5) passed Claude's review: 2048x1024; white lock on her LEFT (near in 1 and 3, the far side of her hair in 2, hidden in 4); neck crystals on her LEFT; broken-hexagon wrist mark with crystals on her LEFT wrist in every view (reads as zigzags, as on her accepted sheet); round glasses even; grey eyes; coat open on her shoulders, sleeves rolled; back-view hands from behind (zoomed). NOTE: in view 2 the lock shows wider than a sliver at the far side of her hair.
- Silas redo `silas-body34-v2` = image 7, Vasch take 1 = image 8 (first try).
- Silas body34 take 2 (image 7) passed Claude's review: 2048x1024; no mark under the near eye in view 2 (zoomed); everything else unchanged by eye from take 1.

### Batch 2: the villains' three-quarter bodies (2026-11-09)
- Prompts: `art/refs/prompts/{vasch,hekka,silt,trooper,krell}-body34-v1.txt` (data added to `tools/body34_data.py`). Silt's height is left out of his prompt: his sheet prompt said 178 cm, `shared/kit/cast.js` says 175 (CANON 0.33, provisional).
- Vasch body34 take 1 (image 8) passed Claude's review: 2048x1024; black bar and black ring on the front only, back plain white; mechanical RIGHT forearm with the see-through glass tube and one white core in every view (far side, image left, in 1; near in 2; image right in 3 and 4); long black glove on his LEFT arm in every view; both sleeves rolled; tiny closed smile; grey hair combed back. NOTE: gloved and metal back-view hands (D1).
- Hekka take 1 = image 9, Silt take 1 = image 10 (first try).
- Hekka body34 take 1 (image 9) passed Claude's review: 2048x1024; black bar and white ring on the chest plate front only, back plate plain; ring scar on her LEFT midriff, near in view 1 and hidden in the others; thick wavy black hair behind her shoulders; no lip scar; loose trousers; plates on shoulders, forearms and shins. NOTE: the scar reads reddish, as on her locked sheet; gloved back hands (D1).
- Silt body34 take 1 (image 10) passed Claude's review: 2048x1024; one eye slit over his RIGHT eye (the far half of the mask in 1, near and short in 2, hidden in 3-4 where only the strap, hair and mask edge show); bond-cutter at his RIGHT hip in every view; ragged knee-length coat open below the belt. NOTE: in view 1 the mask is turned only a little; gloved back hands (D1).
- Krell take 1 = image 11, trooper take 1 = image 12 (first try).
- Trooper body34 take 1 (image 12) passed Claude's review: 2048x1024; black bar and white ring on the front only, back plain grey; bond-cutter at his RIGHT hip in every view (image left in 1-2, image right in 3-4); visor hides the eyes; ear cups both sides; gloved back hands (D1).
- Krell body34 take 1 (image 11) passed Claude's review: 2048x1024; bar and ring front only; open-faced helmet with ear cups; strapped plates on both upper arms, forearms and shins in every view; no weapon. NOTE (15): arms at about 30 degrees, as on his locked sheet.
- Sela redo 2 `sela-body34-v3` = image 13. 2048x1024; came back almost unchanged (fix 11): the mark is still a closed outer ring with a small swirl inside; the rest unchanged by eye. Still FAIL 11. Stopped here for Dylan's call rather than spend redo 3: the known fix for a stuck mark (STYLE fix 17) takes two edits (remove it, then add the spiral on clean skin), which would pass the 3-redo limit. Options for the card: the two-edit fix, painting her locked sheet's mark in by hand, or accepting it.

### Batch 3: the walk-ons' three-quarter bodies (2026-11-09)
- Prompts: `art/refs/prompts/{nim,quint,fenn,hob,marta,tull}-body34-v1.txt`. Nim = image 14, Quint = image 15, Hob = image 16 (first tries).
- Nim body34 take 1 (image 14) passed Claude's review: 2048x1024; LEFT arm missing, sleeve pinned at the left shoulder in every view (near in 1 and 3, far in 2 and 4); only the right arm out in the A-pose; chalk behind his RIGHT ear (visible in 2 and 4, hidden in 1 and 3); full sandy hair, reads about 30; back-view hand from behind.
- Quint body34 take 1 (image 15) passed Claude's review: 2048x1024; small flat-topped gold glasses, even and clean (D5); tails to mid-calf, edges only in front, whole from behind; white gloves (D1); round, short build.
- Hob body34 take 1 (image 16): 1774x887 (FAIL 1) → take 2 = take 1 resized on this PC (`hob-body34-v2.png`). Passed otherwise: moss-green ploughshare mark on the OUTER side of his LEFT forearm at the same halfway height in views 1 and 3, hidden in 2 and 4 (D6); tweed cap, white stubble, patched waistcoat; back-view hands from behind. NOTE: the mark reads a little brighter green than "muted".
- Fenn = image 17, Tull = image 18, Marta = image 19 (first tries).
- Fenn body34 take 1 (image 17) passed Claude's review: 2048x1024; white garters above both elbows in every view; black waistcoat with ember-red piping, bow tie; bare hands from behind; silver hair. NOTE: his face reads a little young, as on his locked sheet.
- Tull body34 take 1 (image 18) passed Claude's review: 2048x1024; bar and white ring front only, back plain; round wire glasses even; bare head and hands, no weapon; parting on his right.
- Marta body34 take 1 (image 19) passed Claude's review: 2048x1024; scarf knot and bun at the back of the head and the apron bow at the back of the waist in views 3-4; red cable-knit shawl crossed and tucked; small closed smile; lace-up boots.

### Batch 4: creatures and the ship, three-quarter bodies (2026-11-09)
- Prompts: `art/refs/prompts/<id>-body34-v1.txt` from `tools/body34_creatures.py` (Claude's creature layout: four 3/4 views, the sheet's own pose phrase; no human layout guide, so only the locked sheet is attached). Skarn = image 20, Ashka = image 21.
- Ashka body34 take 1 (image 21) passed Claude's review: 2048x1024; wings folded in every view; glowing tail plumes in all four; head crest and yellow eyes as on her sheet; hooked beak closed.
- Skarn body34 take 1 (image 20): 1774x887 (FAIL 1) and FAIL 18b: a tall thin lightning spike stands up behind his head in every view besides the angled fin, so the fin is doubled (the spike is how the fin looks edge-on in the locked sheet's front and back views). Passed otherwise: forked tail with two tips, glowing yellow eyes, fin membrane with lightning along the top. Auto redo 1: `skarn-body34-v2`, edit removing the spike, at 2048x1024.
- Hush = image 22, Vesh = image 23 (first tries).
- Hush body34 take 1 (image 22) passed Claude's review: 2048x1024; flat owl face with violet eyes and beak; lynx ear tufts; in the back views we see the backs of the ears (fix 19); wings folded with blade-like tips; bobtail in every view.
- Vesh body34 take 1 (image 23) passed Claude's review: 2048x1024; coiled with the head raised, no legs; frilled jaw, horns, teal eyes; belly plates up the front of the neck in 1-2; gold lure ridge down the middle of the back in 3-4; the lure strand above the head matches her locked sheet's front view. NOTE: the lures read like a string of lights, as on her sheet.
- Prism = image 24, Grist = image 25 (first tries).
- Grist body34 take 1 (image 25) passed Claude's review: 2048x1024; domed riveted shell with rust scuffs; anvil horn (flat top, forward point) at an angle in 1-2 and its top above the shell in 3-4; six armoured legs; glowing rust-orange eyes; no tail; no text-like squiggles on the flat plates (zoomed). NOTE: with legs on both sides at 3/4, the count is hard to read at a glance.
- Prism body34 take 1 (image 24): 1774x887 (FAIL 1) → take 2 = take 1 resized on this PC (`prism-body34-v2.png`). Passed otherwise: four walking legs; blade forearms on their own sides, never crossed (fix 25); clear wings folded with rainbow edges; long abdomen; faceted eyes and antennae.
- Hollow bear = image 26, Hollow hound = image 27 (first tries).
- Hollow bear body34 take 1 (image 26): 1774x887 (FAIL 1) → take 2 = resized on this PC (`hollow-bear-body34-v2.png`). Passed otherwise: brow plate, shoulder plates and spine plates; white core in its frame on the chest with cables to the shoulders, visible in 1-2, hidden in 3-4; iron collar with a short chain; stub tail; blank white eyes. NOTE: the fur leans pinkish grey-brown.
- Hollow hound body34 take 1 (image 27): FAIL 13 (fix 34): a round spiky tuft on the side of the rump in both back views, besides the real tail. Passed otherwise: monster, not a pet; fangs, torn ears, blank eyes; plates on brow, neck, shoulders and hips with the back bare; core in 1-2; cables with clamps; ribs; tail straight out. Auto redo 1: `hollow-hound-body34-v2`, edit removing the tuft.
- Thimble Hollow = image 28, Thimble = image 29 (first tries).
- Thimble body34 take 1 (image 29) passed Claude's review: 2048x1024; shaggy moss-green hair with moss patches on the back; stub horns; heavy-lidded kind eyes; strap with the cracked brass bell under the chin in 1-2, the strap over the neck in 3-4; tail hanging over the rump, nothing else between the back legs.
- Thimble Hollow body34 take 1 (image 28) passed Claude's review: 2048x1024; dull grey-beige matted hair, no moss; blank white eyes; core flush in the chest with cables to the shoulder plates in 1-2; brow, shoulder and spine plates; no strap or bell; tail tuft over the rump.
- Gullwake = image 30 (first try).
- Gullwake body34 take 1 (image 30): FAIL 18b/9: the red patch on the main lower yard sits on the PORT end in both bow views (image right; the starboard end is image left there), correct in both stern views. Passed otherwise: 2048x1024; fore mast one yard, main mast two yards and crosstrees, the Post stump; yards the same count in every view; towing post, tub, bath screen, quarterdeck with wheel, awning, table and crane; no lettering. NOTE: yards read near-horizontal rather than strictly across the deck in perspective. Auto redo 1: `gullwake-body34-v2`, edit moving the patch in views 1-2.

### Next phase: face sets and head turnarounds (2026-11-09)
- Prompts from `tools/face-prompts.py` (extended: `tools/face_people2.py` holds Vasch, Hekka, Krell, Nim (full sets), Silt and the walk-ons (head only) and the partners and Hollows (creature head turnaround, Claude's layout: five head-and-neck portraits)); runner `tools/run-heads.sh`. Hollow Thimble has no head prompt: the tiers list "Thimble" once (Claude's reading; easy to add).
- Vasch head = image 31, Hekka head = image 32, Krell head = image 33, Nim head = image 34 (first tries).
- Krell head take 1 (image 33) passed Claude's review: 2048x1024; five true angles; open-faced helmet with ear cups both sides; stubble, heavy brow, lined mouth; white collar; arm plates at the bottom edge.
- Nim head take 1 (image 34) passed Claude's review: 2048x1024; chalk behind his RIGHT ear (image left in front, near at 3/4 right and profile right, hidden on the left); pinned LEFT sleeve at the shoulder (image right in front, near on the left); freckles, grey eyes, full sandy hair. NOTE: faint forehead lines, as on his sheet.
- Vasch head take 1 (image 31) and Hekka head take 1 (image 32): 1774x887 (FAIL 1) and FAIL 10: both profile portraits show the whole chest ring flat, as if seen from the front (their sheets show only the bar's end in side views). Passed otherwise: Vasch's smile, grey eyes and combed-back hair; Hekka's wavy hair, blue-grey eyes, no lip scar. Auto redo 1 each: `vasch-head-v2`, `hekka-head-v2`, edits of the profiles at 2048x1024.
- Silt head = image 35, Quint head = image 36, Fenn head = image 37, Hob head = image 38 (first tries, all 2048x1024).
- Silt head take 1 (image 35) passed Claude's review: one slit over his RIGHT eye (image left in front, near at 3/4 right, short at the front edge in profile right, none on the left side); strap round the back of the head; no mouth or nose holes.
- Quint head take 1 (image 36) passed Claude's review: round face, pink cheeks, pale-blue eyes, oiled silver hair, cravat and red tailcoat collar. NOTE (5): his glasses are small gold ovals, not the flat-topped pair on his locked sheet; clean and even (D5). Offered as a redo on his card.
- Fenn head take 1 (image 37) passed Claude's review: silver hair, brown eyes, fine lines, bow tie and red-piped waistcoat. NOTE: the hair is parted on his RIGHT (image left in front), as on his locked sheet, though his description says left; the sheet wins (line 5). Worth one line in CAST or the sheet notes.
- Hob head take 1 (image 38) passed Claude's review: tweed cap, wispy white hair, white stubble, deep lines, blue shirt and brown waistcoat; reads 68.
- Marta head = image 39, Tull head = image 40 (first tries, 2048x1024).
- Marta head take 1 (image 39) passed Claude's review: blue headscarf knotted at the back with the grey bun, smile lines, small closed smile, red cable-knit shawl over a cream blouse; reads about 60.
- Tull head take 1 (image 40): FAIL 10: both profiles show the white ring flat at the chest's edge (front-only symbol). Passed otherwise: round wire glasses even in every view; mousy-brown hair parted on his right; pale grey-green eyes. Auto redo 1: `tull-head-v2`, the same profile edit as Vasch and Hekka.
- Note: `tools/run-heads.sh` was edited while a run was reading it; bash printed a syntax error after the loop's last picture. All ten heads had landed; the file itself checks clean (`bash -n`).
- Creature heads: Ashka = image 41, Skarn = image 42 (first tries). Both 1774x887 (FAIL 1) → v2 resized on this PC (new `tools/resize-take.ps1`). Passed otherwise: Skarn's fin is edge-on as one spike from the front and angled (one fin, not doubled) at 3/4 and in profile; yellow eyes, scowl, fangs. Ashka: crest, yellow eyes, hooked beak closed, sparks at the feather tips.
- Hush head = image 43, Vesh head = image 44 (first tries, 2048x1024), both passed Claude's review. Vesh: frills both sides, horns, teal eyes, belly plates up the throat, lures on stalks along the back of the neck in every view. Hush: round owl facial disc, violet eyes, hooked beak, lynx ear tufts; head at five true angles.
- Grist head = image 45, Prism head = image 46 (first tries).
- Prism head take 1 (image 46) passed Claude's review: 2048x1024; triangular glass head, faceted blue eyes, feathery antennae with rainbow tips (as on her body sheets), the tops of the blade forearms on their own sides.
- Grist head take 1 (image 45): 1774x887 (FAIL 1) → v2 resized on this PC. Passed otherwise: anvil horn (flat top, flared ends), riveted plates with rust, glowing orange eyes, closed mandibles; no squiggles on the flat faces. NOTE: the 3/4 and profile portraits on each side look nearly alike.
- Hound head = image 47, bear head = image 48 (first tries).
- Hollow bear head take 1 (image 48) passed Claude's review: 2048x1024; bolted brow plate, blank white eyes with a slight glow, small round ears, studded iron collar with the short chain at the front of the throat in every view.
- Hollow hound head take 1 (image 47): 1774x887 (FAIL 1) → v2 resized on this PC. Passed otherwise: brow and muzzle plate, neck plates, torn ears, fangs over the lip, blank eyes, cables with clamps up the neck; a monster, not a pet.
- Thimble head = image 49 (first try): 1774x887 (FAIL 1) → v2 resized on this PC. Passed otherwise: shaggy moss-green hair, pale stub horns, heavy-lidded kind eyes, blunt snout, strap with the buckle at the back of the neck and the cracked brass bell under the chin in every view.
