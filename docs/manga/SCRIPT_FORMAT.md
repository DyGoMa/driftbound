# Issue script format

One file per issue: `manga/issues/issue-NN.js` (two digits). It's a plain JavaScript call, so strings use normal JS escaping. Use double quotes for any string with an apostrophe. Only the writer of an issue touches that file.

```js
DriftManga.issue({
  n: 1,                     // issue number
  part: 1,                  // 1 = The Map That Lies, 2 = The Long Wake
  arc: "pinhold",           // arc id: pinhold, ashmarket, gaptooth, lanternreach, regatta, keelbreak, glassward, countoffive, deadwater, filler (side stories, numbered from 49; blurb says where they sit)
  title: "The Islands Move",
  blurb: "One or two sentences for the back of the book. A hook, no spoilers.",
  cover: { art: "Full cover painting brief: who, what, mood, colours.", tagline: "Short line printed on the cover." },
  pages: [
    {
      layout: "5a",         // a layout id from the table below
      panels: [
        {
          shot: "wide",     // wide | medium | close | extreme-close | low-angle | high-angle | over-shoulder | silhouette | black
          art: "What the artist draws: who, where, action, expression, background, mood. 15 to 45 words. Name people. First appearance of anyone new: age, look, outfit.",
          text: [
            ["cap", "Narration caption."],
            ["say", "kaito", "Normal speech."],
            ["shout", "juno", "Loud jagged balloon!"],
            ["think", "sela", "Cloud thought."],
            ["whisper", "silas", "Small dashed balloon."],
            ["off", "bram", "Spoken from outside the panel."],
            ["sfx", "KRAK"]
          ]
        }
      ]
    }
  ],
  extras: {
    serial: { title: "Title-page serial, part title", text: "40 to 80 words. A running comic mini-story told across issues on title pages." },
    letters: [
      { from: "Reader's silly pen name", q: "A reader's question.", who: "juno", a: "The crew member's answer, in voice." }
    ],
    next: "One-line editor's tease for the next issue, in the style of a weekly magazine margin note."
  }
});
```

## Text kinds
`cap` and `sfx` have no speaker: `["cap", "text"]`. The others are `[kind, speaker, text]`. Empty balloon for Silas's lost voice: `["say", "silas", "..."]`.

Speaker ids (lowercase): `kaito sela juno silas bram ione skarn vesh ashka hush grist prism vasch hekka silt krell maro trooper otti tam tobias marisol wren dove kell nim yevka sorrel pike lucan bren hale sable regent oren corin crowd`. For a one-off walk-on use `extra:Name`, for example `["say", "extra:Dockhand", "Line."]`.

Partners don't speak in words. Only sound lines such as "Grrr" or "...", or better, art.

## Layouts
Panels are listed in reading order. The book reads right to left, so panel 1 is at the top right. Panel count must match the layout.

| id | panels | shape | use for |
|---|---|---|---|
| `full` | 1 | full page | title page, big moment |
| `spread` | 1 | two facing pages as one image (counts as 2 pages) | the peak of the issue; at most 2 per issue |
| `2h` | 2 | two wide rows | quiet, wide beats |
| `2v` | 2 | two tall columns | face-off |
| `3h` | 3 | three wide rows | slow-motion, a sequence, a silent beat |
| `3a` | 3 | wide top, two below | establish, then talk |
| `3b` | 3 | two on top, wide below | talk, then reveal |
| `3c` | 3 | tall right, two stacked left | a figure and their reactions |
| `3s` | 3 | three slanted slices | action |
| `4g` | 4 | 2 by 2 | back-and-forth talk |
| `4a` | 4 | wide, two, wide | general |
| `4b` | 4 | tall right, three stacked left | action and reactions |
| `4s` | 4 | four slanted slices | fast action |
| `4i` | 4 | big main panel with 3 small insets along the bottom | a big image, detail shots |
| `5a` | 5 | wide, two, two | general |
| `5b` | 5 | two, wide, two | general |
| `5c` | 5 | two, two, wide | ends on a reveal or a beat |
| `6a` | 6 | three rows of two | talk heavy |
| `6b` | 6 | two, wide, three | talk with a turn |
| `7a` | 7 | two, three, two | comic rhythm, rapid gag; rare |

Roughly: most pages `4a`, `5a`, `5b`, `5c`, `6a`, `3a`, `3b`, with slants for action. Use a variety. Never three of the same layout in a row.

## Limits the checker enforces (`node tools/manga-check.js NN`)
- 22 to 26 pages (a `spread` counts as 2). A longer special may go to 30.
- At most 4 balloons per panel, 35 words per panel, 25 words per balloon, unless the panel has `long: true`, which marks a rare monologue (at most 2 in an issue).
- At most 2 spreads.
- Every panel has `art` of at least 8 words. Layout ids and speaker ids must be valid. Panel count must match.
- Art notes can't use words that break the fan service line (see the bible, section 6). The checker has a blocklist, but it can't judge for you: you must follow the line.
- Back matter must be there: a `serial`, 2 to 4 `letters`, and a `next` (the last issue of a run too).

Run the checker. Fix anything it reports. A clean run is required before you report back.

## Title-page serial
Like a long-running cover story: a tiny separate comic thread over many issues. The running serial is **"Fizzlet's Grand Tour"**, in which the small cloud-pal Fizzlet (`shared/pals.js`) has wandered away from Pinhold and keeps stumbling across the Drift, adding pals one by one. It's sweet and funny, and contains **no** flirting or innuendo: no fan service of any kind. Advance it a little each issue, part number equal to the issue number; each issue's outline doesn't name the serial, so invent one small event, and keep it self-contained.

## Letters column
"Letters to the Gullwake": silly reader questions answered by the crew, in voice. This is a natural home for innuendo between adults (never about Pals). Keep it fun and short. Writers may use it to foreshadow, never to spoil.
