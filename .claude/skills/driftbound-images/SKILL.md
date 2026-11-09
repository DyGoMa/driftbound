---
name: driftbound-images
description: Make Driftbound pictures in batches (reference sheets, manga panels and covers, site art) with the locked style, a self-review against Dylan's checklist, automatic redos, and one approval round per batch. Use whenever a Driftbound image needs making, redoing or reviewing, when Dylan says "next batch", "make the sheets", "make Issue N's panels", or gives feedback on a picture (which must be learned into the checklist).
---

# Driftbound pictures, batch by batch

Dylan asked for this (2026-11-08): "go through reviews with the things ive said in the past that are wrong ... make 5 sheets after youve reviews them for me to look at and approve. make it a skill so i can do it for any images for this project ... also ways learn from what i tell you to add to the reviews judment calls. also use the consistant art style across everything". His standing answers are in `docs/DECISIONS.md` under "Your words".

Pictures are made with `codex-imagegen` (the codex-bridge plugin, ChatGPT plan; see the `game-image-gen` skill for setup and errors). Never set `OPENAI_API_KEY`.

## 0. Read first, every time
1. `docs/manga/IMAGE_REQUESTS.md`: the batches, the status column, the daily number and Dylan's four decisions (colour; 15 a day; Issue 1 before covers; no text, reader balloons).
2. `art/refs/STYLE.md`: the style, background and layout blocks (copy word for word), the locked-sheet table and the known fixes. This is the art bible.
3. `art/refs/REVIEW_CHECKLIST.md`: the review lines and Dylan's calls.
4. `docs/CAST.md` (looks win over everything), `docs/manga/CANON.md` section 0 (open conflicts), `docs/WORLD_BIBLE.md` hard rules.
5. For a panel or cover: its art note in `manga/issues/issue-NN.js` or `docs/manga/IMAGE_LIST_GENERATED.md`.

## 1. Plan the batch (one message, then cards)
- List the subjects, the reference sheets each will attach, and the rough count (1 take each, up to 3 automatic redos).
- Say the images used today (count the "image N of today" lines in `DECISIONS.md` for today's date) and the daily number. Dylan's standing answer: if the number runs out mid-batch, finish the batch ("Finish the batch today", 2026-11-08). Ask again if a batch would pass about 25 in a day.
- **Conflicts:** if a subject's look is in a CANON section 0 conflict, or two sources disagree, quote both and ask before drawing.
- **Gaps:** collect every unset look (height, skin, hair, eyes, colours, a missing detail) for every subject and ask them all in one set of option cards before anything runs (Dylan: "Ask me all at once first"). Recommended option first. Then write the answers in his words in `DECISIONS.md`.
- Show the batch's prompts (or, for many alike, one full prompt and the per-subject character lines) and get one yes for the whole batch. That yes covers the first take and up to 3 automatic redos per subject.

## 2. Write each prompt
Every prompt stands on its own (Codex cannot see the chat) and has, in this order:
1. What each attached image is for. A new sheet: Image 1 = `kaito-sheet-v8.png` "for ART STYLE ONLY ... do NOT copy that character", Image 2 = `sela-sheet-v5.png` "a guide ONLY for how hands look from behind in the BACK view". A panel: each character's locked sheet, "copy this character exactly". An edit: Image 1 is the take being edited; say "change only ..." and list everything that must stay identical.
2. The style block, word for word.
3. The layout block that fits (people or creatures, word for word), or for a panel the shot from its art note.
4. The subject: adult age stated, adult face and body, every look from CAST.md or the cast answers.
5. Every one-sided detail named per view: the character's own side AND where it lands on the image (fix 1). For a mark: which face of the limb, the height, which views show it whole and which a sliver (fixes 27, 36).
6. The background block, word for word, plus any one allowed exception (a chest ring, a bond mark).
7. The hard-rules line: "Adults only, with adult faces and adult bodies. No nudity, no sexualized posing or framing. Nothing copied from any real anime or game. Nothing Pokémon-like." Bath or towel scenes add: "shoulders-up only, heavy steam".
Save each prompt as `art/refs/prompts/<name>-vN.txt` (sheets) or next to the picture's key in `manga/art/prompts/` (panels) before running it.

## 3. Run
```bash
codex-imagegen "$(cat <prompt file>)" ./art/refs/<name>-vN.png --ref <ref1> --ref <ref2> --size 2048x1024 --timeout 1200
```
Run in the background with its output to `$TEMP/<name>-vN.log`; two at a time at most. Never overwrite: every take is a new version number. A timeout (exit 124, no file) is retried once with the same prompt and logged; a second timeout on the same take stops that subject and goes in the report (fix 26). Log each run in `DECISIONS.md` as "image N of today".

## 4. Review (before Dylan sees anything)
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/zoom-crops.ps1 <picture> <short-prefix>
```
Read the full picture and the crops (heads, mid, low, each view). Go down `REVIEW_CHECKLIST.md` line by line and the subject's own prompt point by point. Write the result in `DECISIONS.md`: what passed, each FAIL with its checklist line, each NOTE.

**Redo rules.** A FAIL gets an automatic redo, up to 3 per subject (Dylan, 2026-11-08: "Up to 3 redos"). Prefer an edit of the best take with one or two changes and a keep-identical list (fix 10); a fresh take only when the edit can't reach it (wrong species, wrong style, more than two FAILs). Compare each redo with the take it came from (fixes 11, 16, 24). Size-only failures are fixed on this PC with a resize, which is not a picture (Krell take 3). Never hand-paint without asking. After 3 redos, stop and report the best take with its open FAILs.

## 5. Show the batch: the review page, then the cards
Dylan (2026-11-08): "make an artifact with the pictures and zoomed in pictures of the areas of interest/where things can go wrong after it completes the batch and updates it with the current batch ... and links it for easier access. than give me a toast choice cards for each character/sheet/image to approve/deny/other".
1. **Batch file.** Write `art/review/batch-<date>-<letter>.json` (copy the shape of the newest one there): title, summary, date, pictures this batch, images today, daily limit, and per subject its id, name, file, take, size, verdict (`review`, `passed`, `redo`, `failed`), `zooms` (label, what to look at, box as fractions `[x, y, w, h]` of the picture), `fails`, `notes` and `passed` with checklist line numbers. Pick zooms where this subject can go wrong: faces, back-view hands, every one-sided mark in every view, chest symbols, props, tails, small accessories.
2. **Build.** Into this session's scratchpad folder `review/`:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File tools/review-images.ps1 art/review/<batch>.json <scratchpad>/review
   node tools/review-page.js art/review/<batch>.json <scratchpad>/review
   ```
3. **Publish to the same page every time**: the URL is in `art/review/REVIEW_PAGE.md`. Read it first with the Artifact tool (`action: "read"`), then publish `index.html` with `url` set to it, `root` set to the review folder and every `img/*.jpg` in `files` (old images left out are kept, so reuse ids only for the same subject). In the session that first published it, publishing the same file path again is enough. Give Dylan the link.
   **File limits.** One publish sends at most 255 files and the page holds at most 512. Before a big batch, list the page's files (`action: "list"`, `scope: "files"`) and remove the old batch's images by passing them as `null` in `files`; split a batch over 255 files into two publishes of the same page.
   **Cross-character sets** (Dylan 2026-11-09: "we should have kaitos expressions to compare next to the other"): for any lead's expressions, one item per expression with Kaito's three views first, then each lead's three views (`art/review/batch-2026-11-09-b.json`).
   **Grouped sets** (Dylan 2026-11-08: "group the expressions together with all of their views ... we dont need the picture with the full panel of expressions"): for expression pages and anything drawn at several angles, give each expression its own item with `cells` (label, file, box) instead of `file` and `zooms`; the page shows the views side by side and no full page.
4. **Cards.** One card per subject, up to four per card set, more sets if needed. Options, recommended first: "Passes" (when it passed review), one or two named redos built from its NOTEs (one change each), and "Show me earlier takes". "Other" stays for his own words. If he passes several at once in his own words, take that as the answer for each.
5. After his answers, set each subject's verdict in the batch file, rebuild and republish, so the page shows what passed.

## 6. Learn from Dylan's answer (same turn, every time)
1. Write his exact words in `DECISIONS.md`.
2. If he rejects something the review passed, or accepts something it failed, add or change a line in "Dylan's calls" in `REVIEW_CHECKLIST.md`, quoting him with the date, and say in the reply which line changed. If it is a new kind of failure, also add a known fix to `STYLE.md`.
3. If he gives a redo instruction, that is his yes for one picture; show the prompt's changed part in one line and run it.

## 7. Lock and file
- A passed sheet: add a row to the `STYLE.md` locked-sheet table (file, "Passed by Dylan <date>", notes, Claude's calls). Earlier takes stay.
- A passed manga picture: save as `manga/art/<key>.webp` (Dylan: "named by their key"), add `"<key>": "art/<key>.webp"` to `manga/art/manifest.js`, run `node tools/manga-smoke.js` and paste its result.
- Update the status column in `IMAGE_REQUESTS.md`, commit with a clear message, and push nothing unless Dylan says (the site is live).

## 8. Report
What needs his answer first; what was made and passed (each picture by path); what to check; images used today; anything noticed and not touched.
