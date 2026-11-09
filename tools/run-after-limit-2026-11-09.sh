#!/usr/bin/env bash
# The queue left when the ChatGPT limit hit on 2026-11-09 (resets about 12:05 PM). Run from the repo root:
#   bash tools/run-after-limit-2026-11-09.sh
# Dylan's yes for each: Sela two edits, Quint glasses, Tull profiles (2026-11-09 cards); the face sets are the
# planned next phase. Two at a time, one retry each. Review every picture before it is shown (skill step 4).
cd "$(dirname "$0")/.." || exit 1
bash tools/run-heads.sh tull-head-v2@edit quint-head-v2@edit
bash tools/run-body34.sh sela:v4            # step 1: mark removed
bash tools/run-body34.sh sela:v5            # step 2: spiral added on clean skin (check step 1 first if running by hand)
for p in faces-34r faces2-34l faces2-front faces2-34r; do rm -f "$TEMP/krell-$p-v1.log"; done
bash tools/run-faces.sh krell krell-sheet-v3.png krell-head-v1.png nim nim-sheet-v2.png nim-head-v1.png
bash tools/run-faces.sh vasch vasch-sheet-v4.png vasch-head-v2.png hekka hekka-sheet-v6.png hekka-head-v2.png
