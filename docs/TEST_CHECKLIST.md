# Play-check list

Mark each line **works** or **broken (what happened)**. Only you mark things confirmed.

The v1 Hoshi Arcade lines moved word for word to `archive/v1-hoshi-arcade/docs/TEST_CHECKLIST.md`.

## Friday batch: your play-check
Status of everything in this section: **built, not yet seen by Dylan.** Mark each line **works** or **broken (what happened)**. Stage 1 of each game should feel easy; a boss should take a few tries. Only your thumb can say.

Checked by Claude (automated, 2026-11-06, while writing this list, one seed each, bot and nobody-playing runs, at phone, computer and small-phone size). This proves logic and wiring only, never feel, sound or looks, and it wasn't a real phone:
```
storm-run: 165 ok, 0 failed. Last line: PASSED: storm-run
tide-gap: 165 ok, 0 failed. Last line: PASSED: tide-gap
hot-hand: 165 ok, 0 failed. Last line: PASSED: hot-hand
silent-cut: 165 ok, 0 failed. Last line: PASSED: silent-cut
hold-the-deck: 165 ok, 0 failed. Last line: PASSED: hold-the-deck
split-light: 228 ok, 0 failed. Last line: PASSED: split-light
```
`node tools/test-save.js`: 18 of 18 passed.

### Shared by all six games
| # | Try this | Expect | Result |
|---|---|---|---|
| S1 | Scroll the homepage to Games | Six cards, each with its island picture. Each one opens its game | |
| S2 | Open a game's address in a private window | The 18+ question comes first, before any game name or picture | |
| S3 | Play a stage in any game, then go Back to Driftbound | The salvage total at the top of the homepage has gone up | |
| S4 | Look at Story cards on the homepage | The first card opens from the start. Locked ones say how much more salvage they need. They open as you earn | |
| S5 | Read a few story cards | Sound like the crew. Nothing wrong for the characters | |
| S6 | Buy an upgrade in a game, then go back to the homepage | Salvage goes down. No story card closes again | |
| S7 | Buy an upgrade, close the browser, reopen the game | The upgrade is still bought, and it works in the next stage | |
| S8 | Open a different game's Upgrades | The same salvage total to spend, and that game's own three upgrades | |
| S9 | Turn the No-upgrades switch on, then play | Your upgrades do nothing, and a score counts as Fair best | |
| S10 | Catch any pal (how: each game's list below) | A catch moment and a crew line, and the title says 1 of 2 | |
| S11 | Go to the Monster book on the homepage | That pal is shown, with the count going up out of 12. The rest stay mystery slots | |
| S12 | Replay where you caught it | It never comes back | |
| S13 | Turn Sound off in one game, then open another | Still off. Turn it on: sound comes back, and only after a tap | |
| S14 | Close the browser partway through a story, then reopen | The stages you've won are still open | |
| S15 | Lose a stage | It restarts that stage, with a one-liner from the crew that changes from time to time | |
| S16 | Look at Endless before and after the ending | Locked at first, open straight after the ending. Split Light has no Endless | |
| S17 | Pause in a game, then switch to another app and back | The Pause button works. A hidden game pauses itself | |
| S18 | Hold the phone the wrong way round | It asks you to turn the phone, and waits | |
| S19 | Tap, swipe and pinch around during play | The page doesn't zoom, scroll or select text | |

### Storm Run (hold sideways)
| # | Try this | Expect | Result |
|---|---|---|---|
| SR1 | Play The Pin Road: quick tap, then hold, then tap in the air | A short hop, a full jump, a Surge. Tell me whether a real thumb hits them reliably | |
| SR2 | Get past low barricades and troopers marked HOLD! | Hop the low ones, full jump the troopers. HOLD! comes in time, and doesn't nag | |
| SR3 | Surge a few times quickly and watch the arm in the corner | Scars climb toward the shoulder, then fade slowly | |
| SR4 | Keep Surging until the arm is full | The arm goes grey, NUMB shows with a draining bar, and there's no second jump for about 5 seconds | |
| SR5 | Play Chain Yard | Tall barricades need a Surge. It doesn't feel like a wall after stage 1 | |
| SR6 | Play Searchlight Row | You can tell a Hollow that passes high from one that dives at you, in time | |
| SR7 | Reach the boss on The Long Drop | Silt on the hound throws cables. WAIT, then FULL JUMP!, then jump and Surge into the white core. Three hits win. The timing feels fair | |
| SR8 | Finish the ending | The ending plays and Endless opens | |
| SR9 | Try the upgrades: Cool Scars, Salvage Pull, Skarn's Catch | Each does what it says. Skarn snatches you out of a hit | |
| SR10 | Find Fizzlet: from stage 2, go numb, stay on the ground and run into it if it comes | Rare. Caught | |
| SR11 | Find Boltnip: from stage 3, no Surges for a while, then Surge up to it if it comes | Rare. Caught | |
| SR12 | Watch and listen | Kaito, Skarn, Silt and the hound move well. Music and effects sound right | |

### Tide Gap (hold upright)
| # | Try this | Expect | Result |
|---|---|---|---|
| TG1 | Play The Narrows: drag to steer | Vesh goes first and the hull swings after. Heavy in a good way | |
| TG2 | Watch the gold arrows on the rocks | They show which way a rock will drift, before it moves | |
| TG3 | Pull your thumb down and keep it on, to Dive. **The spec said "Hold to Dive"; this is Claude's change** | The ship goes under. A thumb that is only steering or resting never Dives by accident | |
| TG4 | Watch the logbook at the top after a Dive | A line drowns for good, and the crew notice | |
| TG5 | Dive a few more times | Arrows get shorter and weaker, and some gates have none. At zero lines Dives stop | |
| TG6 | Meet a rock marked SHUT | A real choice: Dive for a line, or scrape through for a plank | |
| TG7 | Pick up a logbook page | It fills a smeared line with a memory she'd forgotten, not the old one | |
| TG8 | Lose planks, then go on to the next stage | Lost planks stay lost, with at least 2 at a stage's start, and whole again for the boss | |
| TG9 | Play The Grinders, The Blind Shelf and The Slip | Each feels different: falling boulders, fog, rain with currents and red lanes | |
| TG10 | Beat The Last Tooth: when the plates glow, Dive, steer under one, let go | Three plates. Every plate costs a line. The lances and chains can be read in time | |
| TG11 | Finish with different lines lost, if you can | The ending changes with what she lost | |
| TG12 | Try the upgrades: Tougher Hull, Longer Dive, Spare Logbook | Each does what it says. Copies don't pay at the boss | |
| TG13 | Find Bobbin: from stage 2, go a while with no knock and no Dive, then stay beside it if it comes | Rare. Caught | |
| TG14 | Find Mopclaw: from stage 3, Dive at a rock with a mop tuft showing | Rare. Caught, and it costs a line | |
| TG15 | Watch and listen | Vesh swims well, Sela and Hekka read from above. Music and effects sound right | |

### Hot Hand (hold sideways)
| # | Try this | Expect | Result |
|---|---|---|---|
| HH1 | Play Card Row: tap a trooper | Juno throws fire. Your thumb doesn't hide what you're tapping | |
| HH2 | Throw faster and watch the heat bar and Juno | It climbs through cold, warm and hot. She shows it, and hot throws hit harder | |
| HH3 | Try to stay in the gold band at the top | The whole game. Fun, or too thin? | |
| HH4 | Go over the top | A blowout, hands locked for a moment, a burn, and the palm in the corner stays marked | |
| HH5 | Tap a target Ashka has marked | A harder hit with no added heat, and it cools her | |
| HH6 | Between waves, try Cash in, Bet half and Let it ride | Take no hit and it pays double. One hit and BUST. Your saved salvage is never at risk. Tempting? | |
| HH7 | Play Dice Alley, The Long Table and The Pit | Each feels different: narrow street, rain with window shooters and carts, fire on both sides with Hollows | |
| HH8 | Beat Krell on The Vault Steps: throw into each vent when it opens | Shields blow, Krell is open for a few seconds. Three rounds. The line charges if it reaches you | |
| HH9 | Finish the ending | The ending plays and Endless opens | |
| HH10 | Try the upgrades: Cool Palms, Bigger Flame, Loaded Deck | Each does what it says | |
| HH11 | Find Kindlekin (was Cinderbun): from stage 2, stay hot for a while, then tap it with the bar at gold if it comes | Rare. Caught. Too cold says so | |
| HH12 | Find Dicemite: from stage 2, start a wave with the most the house takes on the bet, then tap it on a six | Rare. Caught. Three wrong tries and it runs | |
| HH13 | Watch and listen | Juno, Ashka and the fire move well. Krell looks right to you. Music and effects sound right | |

### Silent Cut (hold sideways)
| # | Try this | Expect | Result |
|---|---|---|---|
| SC1 | Play The Wet Steps: hold to creep, let go to freeze | Stop and go. Feels like stealth, not waiting. No lag before he moves | |
| SC2 | Tap something with a TAP ring: a lantern, a trooper's back | The chain cuts it. A slow tap still counts | |
| SC3 | Stand in the light too long | The eye over his head fills. Three alarms lose the stage. Cover hides you when frozen | |
| SC4 | Double tap to Surge through light | A silent dash that uses a feather. It doesn't misfire, and a slow double tap still takes | |
| SC5 | Spend all your breath | No Surge, slower, and Silas's talk boxes go "...". The crew react. Do you feel the loss? | |
| SC6 | Go out of breath twice in a stage | His voice stays rough for the rest of the run | |
| SC7 | Hang back | The lamp line behind you closes in, so waiting isn't safe | |
| SC8 | Play Oil Row, Crane Yard and The Long Boards | Each feels different: cutting your own dark, keeping under a moving crate's shadow, creaking boards that draw troopers | |
| SC9 | Beat Maro in The Lamplit Warehouse: cut his back when he reads, hide when the book shuts | Three cuts. Only cover beats his lamp. The third cut breaks off Silas's line | |
| SC10 | Finish the ending | Silas has no breath for his big line, then writes on the slate. Endless opens | |
| SC11 | Try the upgrades: Deep Lungs, Longer Chain, Softer Boots | Each does what it says. Is Deep Lungs at level 3 too strong? | |
| SC12 | Find Tuftle: from stage 2, with no alarm yet, stay frozen in cover a long while, and keep still if eyes open | Rare. Caught | |
| SC13 | Find Lamplick: from stage 2, cut a flickering lantern with a moth on it, then tap the dizzy moth | Rare. Caught. Walking under it does nothing | |
| SC14 | Watch and listen, in a dim room if you can | Silas, Hush and Maro move well. You can still see in the dark. Music and effects sound right | |

### Hold the Deck (hold upright)
| # | Try this | Expect | Result |
|---|---|---|---|
| HD1 | Play The Slipway: tap a lane | Bram walks there and swings. Heavy and good. A swing at nothing stumbles him: fair, or sticky? | |
| HD2 | Hold to turn to Iron | Comes on fast enough to trust. He blocks everything | |
| HD3 | Watch him and the body icon after each Iron | Grey spreads for good, and he gets slower. Heavier hits too | |
| HD4 | When Grist's button says CHARGE!, press it | Grist flattens the lane Bram is in. Before it's full, a tap there just goes to the right lane | |
| HD5 | Between waves, try each meal | Broth heals, Pepper Stew speeds him up, Tonic pulls back a little grey | |
| HD6 | On Hook Lines, take a volley on the chin (every lane lit at once), three times in one try | Three Guts each, RIBS marks, and the third drops him however many Guts are left. **This is Claude's new rule.** Fair, or a cheat? | |
| HD7 | Play Crane Hour and The Ram | Crates that stay as walls, then shields and rams. Each feels different | |
| HD8 | Beat the bear on What the Bear Was | Paws through the deck, then it stands chained and only Grist can knock it into reach, then the chain goes and it charges. Warnings read in the fight. Takes a few tries | |
| HD9 | Lose to the bear a few times | It stays hurt and you get more Guts, and Ione says so | |
| HD10 | Finish the ending, with little and with a lot of grey if you can | The ending changes with the grey, and the bowl on the deck lands. Endless opens | |
| HD11 | Try the upgrades: Thick Apron, Grist's Temper, Big Pot | Each does what it says | |
| HD12 | Find Rivetling: from stage 3, keep holding Iron well past a block, and don't let go if it comes | Rare. Caught, at about 18% grey | |
| HD13 | Find Spoonling: from stage 2, cook broth at full Guts, then walk to its lane if it comes | Rare. Caught | |
| HD14 | Watch and listen | The stiff walk, Grist's gallop, the bear and its fur look right. Music and effects sound right. Read the crate that "says flour" | |

### Split Light (hold upright)
| # | Try this | Expect | Result |
|---|---|---|---|
| SL1 | Play First Light: tap a crystal to turn it, then FIRE | The beam bounces and burns through cores. Easy for a new player | |
| SL2 | Fire and watch where the beam stops | A crystal grows there, and on Ione's arm. It can't be turned and always leans the same way | |
| SL3 | Play with no aiming line. **This is the big one** | Fun, or just annoying? No preview unless you buy Second Look | |
| SL4 | Fire a wrong shot on a tight board | NO WAY THROUGH shows, and Retry is the big button. You're never stuck | |
| SL5 | Retry a level after growing crystals in the way | Shots spent stay spent, and growths in your way stay. A growth that would help you cheat breaks off. Fair, or the game cheating? | |
| SL6 | Play Set 2 to Set 4 | Growths, splitters, linked cores, armour, perches and rails each bring one new idea you can follow | |
| SL7 | Finish a level in fewer and more shots | Fewest shots pays the most salvage | |
| SL8 | Beat Director Vasch's three boards | He talks throughout and counts to ten: at ten he fires for you. Resets use your 3 points of nerve. Tense, not unfair. Takes a few tries | |
| SL9 | Finish the ending | The ending plays. There is no Endless button in this game | |
| SL10 | Try the upgrades: Steady Hand, Shard Scraper, Second Look | Each button shows only once bought, and does what it says | |
| SL11 | Find Prismule (was Glimmick): from Set 2, don't fire for a good while, then tap it if it crawls by | Rare. Caught | |
| SL12 | Find Shardle: from Set 3, fire one shot of 5 or more bounces, then tap it if it hops | Rare. Caught | |
| SL13 | Watch and listen | Prism reads as Prism from above, Ione's arm reads as crystal growing, Vasch looks right. Music and effects sound right | |

### New villain pictures (not locked)
| # | Try this | Expect | Result |
|---|---|---|---|
| V1 | Look at `games/hot-hand/art/raw/krell-sheet-v1.png` | Warden Krell looks right to you. His sheet is Claude's own and not locked | |
| V2 | Look at `games/silent-cut/art/raw/maro-sheet-v1.png` | Ledger Maro looks right to you. His sheet is Claude's own and not locked | |

## Checked by Claude (automated, 2026-11-05, build step 3, phase 1)
- All new scripts pass a syntax check (`node --check`).
- Headless Chrome through Playwright, 73 checks passed: wording, No, mistake link, Yes, 30-day memory and expiry, direct game link, fresh save, old save left untouched, storage blocked, JavaScript off, five screen sizes with no sideways scroll, v1 still running from the archive when served locally, and double taps and stray keys never answering the gate (faults an independent review found and Claude fixed).
- Clicked through No, the mistake link and Yes by hand in a phone-size browser (375x812).
- Not checkable by Claude: a real phone, and whether the archive stays off the public site (needs the free link live).

## Waiting for your play-check (build step 3, phase 1)
| # | Try this | Expect | Result |
|---|---|---|---|
| G1 | Open the site on your phone for the first time | Only "DRIFTBOUND / Adults only. / Are you 18 or older?" with Yes and No; nothing behind it | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G2 | Tap **No** | "Driftbound is for adults. Come back when you're 18." and a small "I tapped by mistake" link | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G3 | Tap **I tapped by mistake** | The question comes back | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G4 | Tap **Yes** | The bare homepage: Salvage 0, Storm Run, and the other three sections marked coming soon | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G5 | Close the browser, reopen the site | Goes straight to the homepage, no question | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G6 | Open the Storm Run page's address directly in a private window | The question comes first | works (Dylan 2026-11-05, one answer for all of G1-G7) |
| G7 | Add `/archive/v1-hoshi-arcade/index.html` to the site's address | Page not found (the old game stays at the old link) | works (Dylan 2026-11-05, one answer for all of G1-G7) |

## Waiting for your play-check (build step 3, new homepage)
Checked by Claude in headless Chrome (2026-11-05): no sideways scroll and no errors at six sizes from 320 wide to 1920 wide; six crew cards and twelve book slots; no pictures load before Yes; screenshots looked at for phone and computer. Tests don't prove how it looks to you.

| # | Try this | Expect | Result |
|---|---|---|---|
| H1 | Open the homepage on your phone and scroll down | Kaito and Skarn banner, DRIFTBOUND title, Storm Run with the Pinhold picture, six crew cards, Visual novel and Videos marked coming soon, 12 mystery slots | |
| H2 | Tap each word in the top menu | The page jumps to that section, and the section title isn't hidden under the bar | |
| H3 | Check each crew card against what you know of them | Right face, name, age, role and partner | |
| H4 | Look at the banner | Kaito and Skarn look right to you; hand mark reads well enough | |
| H5 | Tap **Enter the Drift**, then the Storm Run card | Jumps to Games, then Storm Run's title screen opens | |
| H6 | Open the site in a private window | The gate now uses the new navy and gold | |
| H7 | Open it on a computer too | Same sections, wider layout, nothing cut off | |

## Waiting for your check: reference sheets (build step 2, crew)
| # | Look at | Check | Result |
|---|---|---|---|
| R1 | `art/refs/juno-sheet-v5.png` | Mark on her upper chest below the right collarbone (left of the picture in front view); braid down in front of her left shoulder, hidden in the right-side view; jacket on both shoulders; burns at glove edges; no gun or ammo belt | passed by Dylan 2026-10-30 |
| R2 | `art/refs/ashka-sheet-v1.png` | Wings folded; glowing tail plumes in all four views (including the back); hooked beak closed; ember-red and black feathers with sparks | passed by Dylan 2026-10-30 |
| R3 | `art/refs/sela-sheet-v5.png` | Round teal whirlpool mark (no tail) just below her left collarbone, right of the picture in the front view, hidden in the right-side and back views; jacket buttoned once under the high collar with a low V; spyglass on her right hip, logbook pouch on her left hip; skirt slit on her left leg | passed by Dylan 2026-10-31 |
| R4 | `art/refs/vesh-sheet-v1.png` | No legs; head raised over a tight coil; glowing teal eyes; frilled jaw; paired side fins; gold lure ridge down the back; horns are the model's addition | passed by Dylan 2026-10-31 |
| R5 | `art/refs/silas-sheet-v4.png` | Three small violet feather marks down the left side of his neck (right of the picture in the front view, hidden in the right-side view); beauty mark under his left eye only; dark-teal hair in a low ponytail down his back; collar open and falling back; chain round the red sash, knife at his right hip; front-view eyes painted by hand | passed by Dylan 2026-10-31 |
| R6 | `art/refs/hush-sheet-v2.png` | Owl face with beak and ear tufts; violet eyes; smoky grey-violet; wings folded with blade-tipped feathers; bobtail; back-view ears show their dark backs | passed by Dylan 2026-10-31 |
| R7 | `art/refs/bram-sheet-v3.png` | Glowing anvil on his bare left chest; left strap down, right strap up; back view: back bib buckled to the right strap, sagging on the left with the loose strap at his hip; towel on his right shoulder; iron patches on his left shoulder and forearm only; flowing tattoos, the left one under the iron | passed by Dylan 2026-10-31 |
| R8 | `art/refs/grist-sheet-v2.png` | Iron-plated beetle; one anvil-shaped horn; six legs on the ground; glowing rust-orange eyes; no tail; no text on the horn | passed by Dylan 2026-10-31 |
| R9 | `art/refs/ione-sheet-v11.png` | Broken zigzag mark with crystals on the back of her left wrist; crystals on bare skin up the left side of her neck; white lock on her left; cropped black low-cut V-neck; coat on both shoulders, sleeves rolled | passed by Dylan 2026-11-05 |
| R10 | `art/refs/prism-sheet-v3.png` | Ice-blue glass mantis-moth; four walking legs (two in each side view); blade forearms folded; clear wings folded flat with rainbow edges; glowing ice-blue eyes; feathery antennae | passed by Dylan 2026-11-05 |

## Headless smoke test (for workers)
`node tools/smoke.js <gameId>`. It serves the site itself; how it works and what it checks are in `README.md` and `shared/kit/README.md`, section 8. Look at the screenshots it saves.
