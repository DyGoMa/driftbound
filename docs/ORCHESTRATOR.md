# Orchestrator: how each weekly build session runs

You (Dylan) start each session with the starter prompt in `STARTER_PROMPT.md` plus a fresh usage screenshot. The orchestrator (the main Claude in that chat) then follows these steps.

## 1. Size the week from the usage screenshot
| Usage left | Plan |
|---|---|
| under 10% | Fix play-check bugs only, or 1 small game, no workers |
| 10–25% | 1 new game, built by 1 worker while the orchestrator fixes bugs |
| 25–50% | 2 games in parallel (2 workers) + 1 reviewer |
| over 50% | Up to 3 games in parallel + 1 reviewer |
Workers make it faster, not cheaper: each one costs about what doing it directly would. Never start more workers than the usage covers.

## 2. Read first, always
`docs/WORLD_BIBLE.md` → `docs/TEST_CHECKLIST.md` (Dylan's "works / broken" marks) → `docs/DECISIONS.md`. Broken items from the checklist come before new games.

## 3. Ask Dylan only what the rules say to ask
Anything he'd notice that the bible doesn't settle (a new mechanic, a change to something built). Everything else the orchestrator decides and logs in DECISIONS.md.

## 4. Worker brief (copy this into each worker's prompt)
> You are building the game "<NAME>" for Driftbound, in `games/<id>/`. Read first: `docs/WORLD_BIBLE.md` hard rules, `docs/FRIDAY_BATCH.md` (the shared rules for every game, and this game's spec if it has one), `shared/kit/README.md`, and the cast in `docs/CAST.md` (until the villains branch is merged, the newer copy is `Documents\driftbound-villains\docs\CAST.md`; read it, never edit it). Locked sheets are in `art/refs/`; never touch them.
> Build on the shared kit: `Kit.start(def)`. The smallest whole game to copy from is `tools/kit-demo/`. The kit handles the menus, talk scenes, sound, salvage, upgrades, pals and saving. Never copy or change kit files; if the kit lacks something, say so in your `NOTES.md`.
> Layout: `games/<id>/index.html` (the kit's page as it is, with your scripts at the end), `tuning.js` (every number, each marked PROVISIONAL or with its source), small scripts of around 200 lines, `art/` (`art/sprites.js` starts as `window.DRIFT_SPRITES = {};`), and `NOTES.md` (what was built, what was checked, provisional numbers, calls made, what needs a person's thumb). The game must still work if any picture is missing.
> Only touch `games/<id>/`. Do not edit other games, the homepage or the shared files. `shared/games.js` shows a game as playable only with `live: true`; flip it only when told.
> Before reporting: run `node --check` on every script and `node tools/smoke.js <id>`, which must end in `PASSED`, and look at the screenshots in `%TEMP%\kcheck\smoke\<id>`. Report: files made, what you checked (with real output), what you could not check, and the provisional numbers. A test proves logic only, never feel.

## 5. Orchestrator after workers finish
1. Review each game against the bible (look at its screenshots).
2. Set the game to `live: true` in `shared/games.js` when Dylan has said it goes live (Friday batch answer: "Live game by game"), then run `node docs/make-provisional.js` to bring `docs/PROVISIONAL.md` up to date.
3. Add play-check steps to `TEST_CHECKLIST.md`.
4. Commit, then push only after Dylan says yes.
5. Report in phone-sized form: needs your answer → what changed → what to play-check.
