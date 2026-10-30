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
> You are building cabinet "<NAME>" for Hoshi Arcade, in `games/<id>/`. Read `docs/WORLD_BIBLE.md` and follow every "Rules for every game" item.
> Use `shared/cast.js` for all characters (do not draw characters yourself; if you need a new pose or character, add it to cast.js in the same style and say so) and `HoshiSave.finishRun('<id>', score, shards)` at the end of each run.
> Copy the file layout of `games/aki-dash/` (index.html, tuning.js, one or more ~200-line scripts). All tuning numbers go in tuning.js marked PROVISIONAL.
> Only touch `games/<id>/` and, if needed, add to `shared/cast.js`. Do not edit other games or the homepage.
> Before reporting: run `node --check` on every script and the headless smoke test (see TEST_CHECKLIST.md), and look at the screenshots. Report: files made, what you checked (with real output), what you could not check, and the provisional numbers.

## 5. Orchestrator after workers finish
1. Review each game against the bible (look at its screenshots).
2. Add the cabinet to `CABINETS` in `hub.js` (set `live: true`) and update the roadmap table in the bible.
3. Add play-check steps to `TEST_CHECKLIST.md`.
4. Commit, then push only after Dylan says yes.
5. Report in phone-sized form: needs your answer → what changed → what to play-check.
