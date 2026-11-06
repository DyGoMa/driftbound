# Driftbound

An adults-only (18+) anime site set in the Drift, a sea of floating islands: short browser games, and later a visual novel, motion-comic videos and a monster book. It all shares one cast and one save.

- World and hard rules: `docs/WORLD_BIBLE.md`
- Cast, partners and villains: `docs/CAST.md`
- Art style and locked sheets: `art/refs/STYLE.md`
- Current build step: `docs/STEP3_PLAN.md`
- Things waiting for a play-check: `docs/TEST_CHECKLIST.md`
- Every decision and who made it: `docs/DECISIONS.md`
- The old Hoshi Arcade code: `archive/v1-hoshi-arcade/`

Plain HTML + JavaScript, no build step. The homepage and every game load `shared/gate.js` first and keeps its content in `<template id="page">`. Shared save: `shared/save.js`.

The six games sit on the shared kit: `shared/kit/README.md`. Test one with `node tools/smoke.js <gameId>`; test the save with `node tools/test-save.js`.
