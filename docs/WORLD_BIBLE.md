# Driftbound: World Bible (v2, 2026-10-30)

Replaces the Hoshi Arcade bible (kept word for word in `archive/v1-hoshi-arcade/docs/`). Every game, visual novel scene, video and image must match this file. Workers read it before building anything.

## Hard rules (never broken)
1. **Every character is an adult.** Stated ages 21+, adult faces and bodies in every image. No school settings and no childlike designs for anyone in a romance or fan-service moment.
2. **Fan service line:** bold 2000s-anime outfits (crop tops, open jackets, short shorts, shirtless men), innuendo, flirty banter and gag scenes that cut away. **No** nudity, no sexualized posing or camera framing, no explicit scenes. Romance routes fade to black.
3. **Original only:** inspired by 2000s anime (Naruto, One Piece, Fullmetal Alchemist era), but no copied characters, symbols, outfits or names from any show, and no Pokémon designs.
4. Mature tone is fine: violence, injury, death, swearing.
5. The site shows an 18+ gate before any content.

## The world
A sea of drifting and floating islands, the **Drift**. Islands move, so maps go stale; crews, smugglers and a military **Empire** compete over routes. People can **bond** with monsters. Bonding is a science with a price: the human fights beside the partner and borrows its element, and pushing too far costs them (pain, scars, lost memories, to be set per character).

## Cast (to be designed in the next build chat)
- **The hero:** a hot-headed 21-year-old man. He is the face of the series.
- **5 crew members:** 3 women and 2 men, so the leads are 3 women and 3 men overall.
- **Partners:** each lead has one signature partner monster.
- **Villains:** a secret Empire unit that hunts partners and strips their bonds to build weapons.

Names, looks, ages, partners and the cost of each bond are Claude's calls, made and listed in the build chat.

## Monsters
They're mostly cool 2000s-style beasts with sharp lines and some menace, plus a few cute pals for comedy. **Pals** are collectible across every game, and each one you catch is shown in the **monster book** on the homepage.

## Site sections
| Section | What it is | How it's made |
|---|---|---|
| Games | Short browser games, each set on a different island | Plain HTML + JavaScript |
| Visual novel | Story with romance routes for the leads | Small custom engine, tied to the shared save and pals |
| Videos | Short anime stories | Motion comics: AI stills, camera moves, subtitles, music |
| Monster book | Collected pals | Reads the shared save |

## Art
AI images through the game-image-gen skill (ChatGPT plan), locked to one reference sheet per character and partner. Claude checks every image against its reference sheet and redoes failures **before** showing Dylan, and asks before each batch (what it makes, rough cost, usage left).

## Build order
1. The cast, partners and villains on paper (names, looks, ages, bonds), then Dylan's OK.
2. Reference sheets for each character and partner, self-checked and redone where needed, then Dylan's check.
3. Rebuild the homepage as Driftbound with the 18+ gate, and remake Aki Dash in the new style. The v1 code moves to `archive/v1-hoshi-arcade/`.
4. A visual novel prototype: engine plus one short scene.
5. The first motion-comic episode.
6. More games, one per island.
