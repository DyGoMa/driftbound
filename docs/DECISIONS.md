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

## Calls Claude made (v2 cast, DRAFT, waiting for your OK) (full detail in `docs/CAST.md`)
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
