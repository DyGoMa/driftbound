# The Driftbound kit

Everything six games share: the loop, input, menus, talk scenes, sound, music, sprites, orientation prompt, save flow, test hooks. A game supplies its words, its numbers and four functions. **Never copy or change kit files from a game.** If the kit lacks something, say so in your `NOTES.md`.

Read first: `docs/FRIDAY_BATCH.md` and the hard rules in `docs/WORLD_BIBLE.md`.
The smallest whole game on the kit, to copy from: `tools/kit-demo/` (`index.html`, `tuning.js`, `demo.js`, `art/sprites.js`).

## 1. The page
Copy `tools/kit-demo/index.html` to `games/<id>/index.html` as it is; change only your own script tags at the end. Leave `<title>` as `Driftbound`: the kit sets the game's name after the 18+ answer, so the browser tab shows no game before it. The gate is built in: `Kit.start` waits for the 18+ answer, and the page's `<template id="page">` stays empty. The order of the kit script tags matters.

## 2. A game
```js
Kit.start({
  id: 'tide-gap', title: 'Tide Gap', island: 'Gaptooth Reach', tagline: 'One line for the title screen.',
  orientation: 'portrait',            // or 'landscape'. Logical size 360x640 or 640x360 (or view: { w, h })
  stages: [                           // 5 stages, the last with boss: true. Anything else you add is yours to read as run.stage.xxx
    { name: 'The Narrows', boss: false, talk: [{ who: 'sela', text: 'Hold on to something, pup.' }, { who: 'kaito', text: 'I AM holding on.' }] },
    // ...
  ],
  ending: [{ who: 'sela', text: '...' }],            // talk scene after the boss
  endingCard: { title: 'THE REACH IS OPEN', text: 'Short story ending.' },
  endless: true,                                     // false hides the Endless button (Split Light)
  endlessStage: { name: 'Endless' /* your numbers */ },   // default: the stage before the boss
  loseLines: [{ who: 'sela', text: 'Again, pup.' }, /* at least 3 */],
  loseLine(run) { return null; },                    // optional: pick a line yourself, e.g. "..." when Silas is out of breath
  upgrades: [{ id: 'hull', name: 'Tougher Hull', blurb: 'One more knock per stage.' }, /* 3 in all */],  // prices: DRIFT_CONFIG.upgradePrices, or prices: [a, b, c]
  palLines: { bobbin: { who: 'sela', text: 'It thinks it works here now.' }, mopclaw: { who: 'bram', text: '...' } },
  music: { bpm: 132, root: 50, scale: 'minor', bass: '0 . 0 . 3 . 5 .', lead: '7 . . 9 . 7 5 .', drums: 'k h s h k h s h' },
  bossMusic: { /* optional */ },
  titleDraw(ctx, view, t) { },                       // optional animated title background
  titleArt: 'art/title.webp',                        // optional picture behind the title
  sayAt: 'top',                                      // optional: where run.say's box goes: 'top', 'bottom' or 'corner' (small, bottom right). Default: top when held sideways, bottom when upright. It stays up for seconds at a time, so keep your read-outs out from under it
  compactSay: true,                                  // optional: on phones 360 px wide and under, a talk box at the top takes the room left of Pause, tighter
  stageRows: true,                                   // optional: a stage list of more than 8 in rows of 4, a boss on its own row, packed to fit on a short phone
  test: { maxSeconds: 300, idleSeconds: 120, idleNeverLoses: false },   // see section 8

  init(run) { run.w = { x: 100, foes: [] }; },       // a fresh attempt: build your world in run.w
  update(dt, run, input) { },                        // always 1/60 s. Game logic only
  render(ctx, run, view) { },                        // drawing only; change nothing here
  hud(ctx, run, view) { },                           // optional; drawn on top. Default: salvage and score
  bot(run, input) { },                               // the test player: decides, then presses through input.sim
  botAsk(spec, run) { return 0; },                   // optional: which option the bot picks in run.ask
});
```
The kit handles the rest: title menu (Story, Endless, Upgrades, No-upgrades switch, Sound, Back to Driftbound, salvage and bests), stage select, talk before each stage, results, retry without the talk, ending (replayable from the stage list), endless unlock, saving, pause button, hidden-tab pause, wrong-way-phone prompt and pause.
Beating the last stage opens Endless at once, whatever the player taps next. A run counts as fair with the No-upgrades switch on, or when no upgrade for this game has been bought yet.

## 3. The `run` object (one attempt at one stage)
"Run" in a game's spec ("for the rest of the run") means **a story run**: stages played one after another through Next stage. Each attempt is a new `run` object, and `run.carry` is what crosses between them.
| | |
|---|---|
| `run.stage`, `run.index`, `run.boss`, `run.endless`, `run.fair`, `run.time` | what is being played; `index` is -1 in endless |
| `run.w` | your world state. Yours alone |
| `run.carry` | what lasts for the rest of the story run: plain data only (numbers, strings, lists). Read it in `init`, write to it any time. **Next stage** takes it on as it stands. **Dying or Restart** puts back what it held when this stage began. **Winning a stage saves it**, so it survives Menu, a closed tab and a reload: **picking stage 2 or later from the list** carries on with it. **Picking stage 1** starts it empty, and that new run replaces the old one once stage 1 is won (so nobody is stuck with a ruined run). **Beating the last stage** ends the run and clears it. **Endless** starts it empty and leaves the saved run alone |
| `run.continued` | true if this attempt carried something in (Next stage, or stage 2 or later from the list), or is a retry of one that did |
| `run.score`, `run.salvage`, `run.addScore(n)`, `run.addSalvage(n)` | banked when the run ends, **win or lose**, and also on Restart, Quit to menu and a hidden tab (a choice or catch moment included), so nothing earned is lost. Never add salvage back to take it away later: what has been banked stays banked |
| `run.win()`, `run.lose()` | ends the stage after a short beat. Safe to call twice |
| `run.up('hull')` | the upgrade level, 0 to 3. Always 0 with the No-upgrades switch on, so just use it |
| `run.rng()`, `run.range(a, b)`, `run.int(a, b)`, `run.pick(list)` | seeded. **Use these for anything that affects play**, or the test can't repeat. `Math.random` only for looks |
| `run.hasPal(id)`, `run.catchPal(id)` | spawn only `if (!run.hasPal(id))`. Catch saves it and plays the catch moment once |
| `run.say(who, text, secs, at)` | small talk box, play goes on. For a boss who talks. `at` is `'top'`, `'bottom'` or `'corner'`, default `def.sayAt` |
| `run.talkFilter = t => '...'` | rewrites what `run.say` shows (Silas out of breath) |
| `run.ask({ title, text, options: [{ label, blurb, value }] }, opt => {})` | stops play for a choice (bets, meals). `return` from `update` right after calling it |

Salvage rate to aim for, so story cards and upgrades pace evenly across games: **a stage clear pays about 15 to 40 salvage in all.**

## 4. Input (read in `update`, in logical game coordinates)
`input.down`, `.pressed`, `.released`, `.tap`, `.doubleTap`, `.held` (seconds), `.x`, `.y`, `.dx`, `.dy`, `.startX`, `.startY`, `.axisX`, `.axisY` (arrows and WASD, -1 to 1), `.key('KeyP')`, `.keyPressed('KeyP')`, `.resets` (counts each time the kit forgot the thumb at a pause, catch or choice, so a game can tell that from a real lift).
- One thumb at a time, but two thumbs on the glass still work: a new finger ends the old press and is a fresh press. When it lifts, a finger still down takes over as `.down` at its own position with no new `.pressed` and `.held` from 0, and it can't make a `.tap`. Space and Enter act as the thumb, pressing at its last position.
- A double tap also fires `.tap` on its first tap, and `.tap` again with `.doubleTap` on the second. A game using both must wait a moment on a single tap, or make the first tap harmless.
- Tapping a thing in the world: compare `input.x, input.y` when `input.tap` is true.

**The bot presses only through** `input.sim.press(x, y)`, `.move(x, y)`, `.release()`, `.tap(x, y)`, `.drag(x, y)`. It may read `run.w`. That way a bot win proves the real controls work.

## 5. Drawing: `Kit.view` and `Kit.art`
Logical play area: `view.w` x `view.h`. The canvas fills the whole screen, so on odd screens there is extra room: **paint your background from `view.left` to `view.right` and `view.top` to `view.bottom`**, and keep play and HUD inside `w` x `h`. The top-right 46 px is the pause button.

Look: black ink outline, flat colour, one shadow tone. Never bare rectangles or capsules. `A.limb` is for beasts' tails and props; for your own shapes, `A.joined(ctx, parts, lw)` inks several segments as one shape with no lines across the joints, and `A.blob` is `A.poly` with soft corners, for cloth.
- **People, already in style:** `A.person(ctx, 'trooper', { x, y, h, pose: 'run', t, flip, phase, glow })`. `x, y` = between the feet, `h` = true height, `t` = time for the walk cycle, facing right unless `flip`. Ids: `kaito sela juno silas bram ione trooper krell vasch hekka silt maro`. Poses: `idle walk run creep hide jump surge fall hurt brace aim down`, and one-shots `throw swing` (`phase` 0 to 1). Or your own object: `{ air, lean, tilt, armN: [shoulder, elbow], armF, legN: [hip, knee], legF }`. `A.heightOf('bram', 0.45)` gives the height at a pixels-per-cm scale so the cast stands true to scale. **Use `A.personFast` (same call) by default, and `A.person` only for one-shot moves, `glow` and custom poses.** Measured with a CPU slowed 6 times, 20 figures per frame: `person` 86 ms, `personFast` 0.9 ms, and a frame has 16.7 ms.
- **Pictures over code:** `if (!A.draw(ctx, key, frame, x, y, height, flip)) A.person(...)`. Feet-aligned. Returns false silently if the picture is missing or broken. `A.has(key)`, `A.frameAt(key, t)`. Your `art/sprites.js`: `window.DRIFT_SPRITES = { kaito_run: { src: 'art/kaito-run.webp', frames: 6, cols: 6, fps: 12, feet: 0.97, cx: 0.5, fill: 0.9 } }`. `src` is relative to the page; `feet` = where the feet sit down the frame (0 to 1); `fill` = share of the frame's height the character takes up. Start it as `window.DRIFT_SPRITES = {};`.
- **Shapes:** `A.poly(ctx, pts, fill, lw)`, `A.circle`, `A.ellipse`, `A.line`, `A.limb(ctx, x1, y1, x2, y2, r1, r2, fill, lw)`, `A.slab(ctx, x, y, w, h, fill, lw)`, `A.shade(hex, 0.72)` for the shadow tone. `lw = 0` leaves the ink off.
- **Scenery and UI:** `A.duskSky(ctx, view, t, { top, mid, low, base, cloud })`, `A.island(ctx, x, y, w, h, { rock, top, seed })`, `A.text(ctx, str, x, y, { size, color, align, body })`, `A.bar(ctx, x, y, w, h, frac, color)`, `A.salvage(ctx, x, y, r, spin)` (the shared salvage pickup), colours `A.INK A.ORANGE A.GOLD A.PAPER A.NAVY A.NIGHT`.
- **Juice:** `A.burst(x, y, { n, color, colors, speed, life, size, gravity, angle, spread })`, `A.floatText(x, y, '+5', color, size)`, `A.shake(mag, secs)`. The kit steps and draws these after your `render`.

## 6. Talk
`{ who, text }`. Speakers: `kaito sela juno silas bram ione` (their homepage portraits), `skarn vesh ashka hush grist prism` (their bond mark), `silt` (cut from his sheet), `hekka` (a code portrait from her sheet), `vasch krell maro trooper` (code bust). New one: `Kit.speakers.add('deckhand', { name: 'Deckhand', colour: '#c05a22', person: 'trooper' })`. Lines must match the voices in `CAST.md`. Pals are never in flirting or innuendo.

## 7. Sound
`Kit.audio.play(name)`: `tap back buy denied jump surge land step hit hurt pickup throw fire swing clang whoosh splash dive beam chime crack alarm boom bet eat growl win lose catch`. Your own: `Kit.audio.define('zap', [{ w: 'square', f: [800, 200], d: 0.1, v: 0.2, at: 0 }])` (`w` a wave or `'noise'`; `f` start and end Hz; `d` seconds; `v` volume). Every action needs an effect. Starts after the first tap; mute is remembered across games; both handled.

Music is steps of tokens: numbers are scale degrees above `root` (a MIDI note), `.` is a rest. `drums`: `k` kick, `s` snare, `h` hat, `K` both. `scale`: `minor major dorian phrygian pent`, or your own list. `leadWave`, `bassWave` change the voices. Make it your game's own tune.

## 8. Testing: `node tools/smoke.js <gameId>`
Options: `--seeds 3`, `--speed 12`, `--out folder`. Screenshots go to `%TEMP%\kcheck\smoke\<gameId>`; **look at them.** It serves the site, answers the gate, and at phone, computer and small-phone size:
checks the gate comes first; walks every real screen with your bot; plays every stage with the bot (**must win on every seed, with no upgrades**) and with nobody (**must lose**, or set `test.idleNeverLoses: true` for a puzzle that simply never ends, with `test.idleSeconds`); checks real touch and keys, pause, hidden tab, sound and mute, buying upgrades, the switch, choices, the catch moment, saved progress after reload, the wrong-way phone prompt, screens that don't fit without scrolling, sideways scroll; collects page errors and missing files; and reads your def against the batch rules (5+ stages, boss last, 2 to 4 talk lines, ending, 3+ lose lines, 3 upgrades, music, crew lines for both pals).

By hand, add `?test` to the address (and `&speed=8`, `&seed=3`). Then in the console, `window.__kit`: `state()`, `timeScale`, `bot(true)`, `jump(i, { endless, fair, talk })`, `runStage(i, { bot, fair, seed, maxSeconds, endless, renderEvery })` (returns `{ result, seconds, score, salvage, caught, info }`; plays at once, saves nothing), `run()`, `catchPal(id)`, `title()`, `ending()`. Put anything useful for the report in `run.w.testInfo`; it comes back as `info`.

A test can't judge feel. Every game's `NOTES.md` says what still needs a person's thumb.

## 9. The rest of the shared files
- `DriftSave` (`shared/save.js`): `load finishRun spend game clearStage finishStory storyCarry setStoryCarry setFair upgradeLevel buyUpgrade hasPal catchPal getSetting setSetting`. The kit calls these; a game rarely needs to.
- `DRIFT_PALS` (`shared/pals.js`): `list get byGame paint(canvas, id)`. To draw a pal hiding in your world: `const p = DRIFT_PALS.get('bobbin'); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); p.draw(ctx); ctx.restore();` (a 100 x 100 box). Keep it small and rare.
- `DRIFT_GAMES` (`shared/games.js`): flip your game to `live: true` only when told to.
- `DRIFT_STORIES` (`shared/stories.js`): the homepage's story cards.
