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
