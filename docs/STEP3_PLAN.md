# Build step 3 plan: Driftbound homepage and Storm Run

Status: approved by Dylan 2026-11-05 ("Start Phase 1"). Phase 1 built, not yet seen running by Dylan. Answers behind this plan: `docs/DECISIONS.md`, heading "build step 3".
Claude stops after each phase. The next phase starts only on Dylan's word.

## Phase 1: Clear out v1, add the gate
- Move the 10 v1 files to `archive/v1-hoshi-arcade/`, word for word.
- New `shared/gate.js`, on every page: the shortest wording, the polite stop screen with the "I tapped by mistake" link, a Yes remembered for 30 days. Nothing behind it shows until Yes.
- New `shared/save.js`: new name, fresh start. The old save is left untouched.
- A bare homepage with the Driftbound name and the four sections as plain text.
- A setting that keeps the archive off the public site.

**Done when:** the gate, stop screen, 30-day memory and fresh save all pass in a phone-size browser, and syntax checks are clean.
**You can try:** on your yes, I push the branch and switch on the free link. On your phone: tap No, tap the mistake link, tap Yes, close and reopen (not asked again).

## Phase 2: Rough Storm Run with stand-ins
- New `games/storm-run/`, same layout as the old game: `tuning.js` plus small scripts.
- Plain adult-shaped stand-in figures for Kaito, Skarn, troopers, barricades and a Hollow.
- A code-drawn Empire island with anchor pylons. Salvage pickups.
- Scar cost: every second jump is a Surge. A corner arm shows the scars climbing and fading. At the top, no second jump for about 5 seconds.
- Upright phones get a "turn your phone" message.
- Salvage total and best score show on the homepage.

**Done when:** headless run reaches play and game over with no errors, numb state triggers and recovers, the save reads back on the homepage.
**You can try:** the jump, the Surge, going numb on purpose, a game over, the return to the homepage. This phase is for judging feel; tell me which numbers to change.

## Phase 3: The real homepage
- 2000s-anime look (no more pink arcade).
- Banner placeholder, Storm Run card, Visual novel and Videos marked coming soon.
- Monster book grid of mystery silhouettes.
- Six crew cards: head-and-shoulders crops from copies of the locked sheets, with name, partner and a one-liner. Saved outside `art/refs/`, which stays untouched.

**Done when:** phone and computer widths have no sideways scroll, all six crops match their sheets, coming-soon parts can't be tapped.
**You can try:** scroll the homepage on your phone; check each crew card.

## Phase 4: The new pictures (each image asks first)
- 4 images: Kaito run strip, Kaito jump/Surge/hurt strip, Skarn gliding strip, one banner.
- About 3 to 5 Codex messages each, so about 12 to 20 of your Plus allowance plus redos, no extra dollars.
- Count so far: 42 images plus 5 timeouts; I recheck the villain chat's count and warn you before each one.
- I check each picture against its sheet and redo failures on your yes before showing you. Enemies stay stand-ins until the villain sheets are locked.

**Done when:** the poses animate in the game and the banner is on the homepage, with every take kept.
**You can try:** the look and movement of Kaito and Skarn. Only you can judge those.

## Phase 5: Finish
- Update the README and the checklist; archive old wording first.
- Update the out-of-date worker brief in `ORCHESTRATOR.md`.
- List every provisional number for you to confirm.
- On your yes: merge to main and point the free link at main.
- Give you the prompt for build step 4, with model and effort above it.

**You can try:** the live link, top to bottom.

## Small calls Claude made (change any)
- Island name: **Pinhold** (shown on the Storm Run title screen).
- Folders: `games/storm-run/`, save code named `DriftSave`.
- Numbers: game numbers in `games/storm-run/tuning.js` (the existing pattern); the two site numbers (30 days, book size) in `shared/config.js`.
- Sound mute setting gets a new Driftbound name too.
- No pals to catch in Storm Run yet, since CAST.md says pals are designed later. The save keeps a space for them.
