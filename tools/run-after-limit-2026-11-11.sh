#!/usr/bin/env bash
# The queue left when the ChatGPT limit hit on 2026-11-09 at 16:36 (resets Nov 11, 10:01 PM). Run from the repo root:
#   bash tools/run-after-limit-2026-11-11.sh
# Dylan's yes (2026-11-09 cards): the three one-cell fixes, then Vasch's and Hekka's six pages each.
# Two at a time, one retry each, never overwrites. Review every picture before it is shown (skill step 4).
cd "$(dirname "$0")/.." || exit 1
bash tools/run-redo-queue.sh krell-faces2-34r-v2 nim-faces2-front-v2 nim-faces2-34l-v2
bash tools/run-faces.sh vasch vasch-sheet-v4.png vasch-head-v2.png hekka hekka-sheet-v6.png hekka-head-v2.png
