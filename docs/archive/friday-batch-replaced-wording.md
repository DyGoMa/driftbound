# Wording replaced by the Friday batch docs update (2026-11-06), word for word

## docs/ORCHESTRATOR.md: the worker brief, section 4

> You are building cabinet "<NAME>" for Hoshi Arcade, in `games/<id>/`. Read `docs/WORLD_BIBLE.md` and follow every "Rules for every game" item.
> Use `shared/cast.js` for all characters (do not draw characters yourself; if you need a new pose or character, add it to cast.js in the same style and say so) and `HoshiSave.finishRun('<id>', score, shards)` at the end of each run.
> Copy the file layout of `games/aki-dash/` (index.html, tuning.js, one or more ~200-line scripts). All tuning numbers go in tuning.js marked PROVISIONAL.
> Only touch `games/<id>/` and, if needed, add to `shared/cast.js`. Do not edit other games or the homepage.
> Before reporting: run `node --check` on every script and the headless smoke test (see TEST_CHECKLIST.md), and look at the screenshots. Report: files made, what you checked (with real output), what you could not check, and the provisional numbers.

## docs/ORCHESTRATOR.md: after workers finish, step 2

2. Add the cabinet to `CABINETS` in `hub.js` (set `live: true`) and update the roadmap table in the bible.

## README.md: the opening line

An adults-only (18+) anime site set in the Drift, a sea of floating islands: short browser games, and later a visual novel, motion-comic videos and a monster book. It all shares one cast and one save.

## README.md: the cast line

- Cast, partners and villains: `docs/CAST.md`

## README.md: the two closing paragraphs

Plain HTML + JavaScript, no build step. The homepage and every game load `shared/gate.js` first and keeps its content in `<template id="page">`. Shared save: `shared/save.js`.

The six games sit on the shared kit: `shared/kit/README.md`. Test one with `node tools/smoke.js <gameId>`; test the save with `node tools/test-save.js`.

## docs/STEP3_PLAN.md: the status paragraph

Status: approved by Dylan 2026-11-05 ("Start Phase 1"). Phase 1 confirmed by Dylan ("Works"). Phase 3 (the homepage) was moved ahead of Phase 2 on Dylan's request and is built, not yet seen by Dylan; its banner and Pinhold art, 2 of Phase 4's 4 images, are made. Phase 2 is next, then Phase 4's 3 pose strips. Storm Run's card says "IN THE WORKS" until Phase 2 changes it to a play button. Answers behind this plan: `docs/DECISIONS.md`, heading "build step 3".

## docs/STEP3_PLAN.md: the small call about pals

- No pals to catch in Storm Run yet, since CAST.md says pals are designed later. The save keeps a space for them.

## docs/TEST_CHECKLIST.md: line H5

| H5 | Tap **Enter the Drift**, then the Storm Run card | Jumps to Games, then opens the stand-in page saying the game isn't built yet | |

## docs/TEST_CHECKLIST.md: the smoke test for workers

## Headless smoke test (for workers)
Serve the folder (`python3 -m http.server 8765`), open each page in Playwright Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` in the cloud workspace), collect page errors, and screenshot the title, play and game-over states.
