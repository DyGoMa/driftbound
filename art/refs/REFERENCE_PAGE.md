# References page

The one page that shows every locked picture, grouped by character or subject (leads, partners, villains, Hollows, walk-ons, ship), with the style block at the top and each picture's file name and prompt. Dylan asked for it 2026-11-12 ("make an artifact with all of the references for the characters and things we have"; "Every locked picture"). It is not the review page (`art/review/REVIEW_PAGE.md`); never make a second references page.

- Link: https://claude.ai/artifact/TEiFwDgQbytEvAzJGPLASa (private to Dylan; first published 2026-11-12)
- Built by `tools/reference-page.py` with `tools/reference-page.html`, into the session scratchpad (never into `art/refs/`): `python -I tools/reference-page.py <scratchpad>/refpage`. It makes about 1200-px-wide JPG copies in `img/` and copies each picture's prompt file to `prompts/`.
- Holds 287 files (143 pictures, 143 prompt files, the page). One publish sends at most 255 files, so it went up in two publishes to the same link: the page and `img/*.jpg`, then `prompts/*.txt`. The page holds at most 511 files.
- To update: add the newly locked picture to `SUBJ` or `FACES` in `tools/reference-page.py`, rebuild, read the page first with the Artifact tool (`action: "read"`) when in a new chat, then publish `index.html` with `url` set to the link above, `root` set to the build folder, and only the new or changed `img/` and `prompts/` files in `files`. Replaced takes: pass the old file as `null`.
