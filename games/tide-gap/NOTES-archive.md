# Tide Gap: old wording, kept word for word

Moved here on 2026-11-06, fourth review.

## From NOTES.md
- "pull the thumb DOWN and keep it on (30 logical px inside 0.25 s, at least twice as much down as across, from a thumb that hasn't been travelling sideways for the last 0.14 s), with a ring and DIVE on the hull for 0.1 s."
- "Dying puts back what the stage began with. Pause then Restart doesn't: what's drowned stays drowned."
- "Spare Logbook (each level, the sea burns one copy per story run before a real line; a burned copy stays burned across stages)."
- " Quit and pick stage 1 still starts clean, so a stage 1 Dive for salvage can still be repeated that way; that's the kit's rule, left alone."
- "| `tuning.js` | Every number, each marked PROVISIONAL or with its source |"
- "| `sail.js` | One step: steering, knocks, planks that last, shut teeth, gates passed, stage end |"
- "| `sea.js`, `cliffs.js`, `rockart.js`, `vesh.js`, `ship.js`, `cutter.js`, `hud.js`, `draw.js` | All the drawing. Nothing in a run changes in these |"

## From words.js
- Spare Logbook's blurb: "A copy in Ione's hand. Each level, the sea takes one copy per run before it takes a real line."

## From tuning.js
- `pullWindow: 0.25,     // PROVISIONAL: seconds that pull must happen in, so a slow wander never counts`
- `warn: [1.35, 1.2, 1.1],    // PROVISIONAL: with a full book. test/fairness.js`
- `gap: [1.55, 1.3, 1.1],      // PROVISIONAL`
- From `warnPerLine`'s comment: "A blank book's last round is 0.86, about the least a 0.5 s player can dodge"

## From hud.js
- "// Tide Gap: the logbook at the top of the screen and everything else on top of play. The book is the bond cost on show: real lines, in her hand, drowning for good."
- "// Rows are drawn once and redrawn only when they change. It sits under the read-outs and above the world, and the pause button keeps its corner."
