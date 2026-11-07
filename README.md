# Driftbound

An adults-only (18+) anime site set in the Drift, a sea of floating islands. Six short browser games, one for each lead and partner, with story cards and a monster book of 12 hidden pals on the homepage. A visual novel and motion-comic videos come later. It all shares one cast and one save, and salvage earned in any game counts everywhere.

The games: Storm Run (`storm-run`), Tide Gap (`tide-gap`), Hot Hand (`hot-hand`), Silent Cut (`silent-cut`), Hold the Deck (`hold-the-deck`), Split Light (`split-light`).

- World and hard rules: `docs/WORLD_BIBLE.md`
- Cast, partners and villains: `docs/CAST.md` (until the villains branch is merged, the newer copy is in `Documents\driftbound-villains\docs\`)
- The six games' spec: `docs/FRIDAY_BATCH.md`
- Numbers waiting for Dylan to confirm: `docs/PROVISIONAL.md`
- How a build session runs: `docs/ORCHESTRATOR.md`
- Art style and locked sheets: `art/refs/STYLE.md`
- Current build step: `docs/STEP3_PLAN.md`
- Things waiting for a play-check: `docs/TEST_CHECKLIST.md`
- Every decision and who made it: `docs/DECISIONS.md`
- The old Hoshi Arcade code: `archive/v1-hoshi-arcade/`

Plain HTML + JavaScript, no build step. The homepage and every game load `shared/gate.js` first, so the 18+ question comes before any content. Shared save: `shared/save.js`. The six games sit on the shared kit: `shared/kit/README.md`. Each game's own file is `games/<id>/NOTES.md`.

## Testing a game
You need Node, Chrome, and `playwright-core` (the script looks in `%TEMP%\kcheck\pw`, or set `PW_PATH`). From this folder:

```
node tools/smoke.js <gameId>
node tools/smoke.js storm-run --seeds 1
```

It starts its own small web server, answers the 18+ question, and at phone, computer and small-phone size walks the real screens, plays every stage with the test bot (must win) and with nobody at the controls (must lose), and checks touch, keys, pause, sound, upgrades, pals, saving and sideways scroll. Each check prints `ok` or `FAIL`. The last line is `PASSED: <gameId>`, and the exit code is 0 only if everything passed. Screenshots go to `%TEMP%\kcheck\smoke\<gameId>`; look at them.

Options: `--seeds 3` (how many runs of each stage), `--speed 12` (game speed), `--out folder` (where the screenshots go).

Test the save with `node tools/test-save.js`. Bring the list of provisional numbers up to date with `node docs/make-provisional.js`.

A test proves the logic and the wiring. It can't tell whether a game feels good: that's `docs/TEST_CHECKLIST.md`.
