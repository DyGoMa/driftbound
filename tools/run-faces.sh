#!/usr/bin/env bash
# Runs a lead's six expression pages two at a time (skill driftbound-images).
# Usage: bash tools/run-faces.sh <id> <sheet.png> <head.png> [<id> <sheet> <head> ...]
# Prompts come from tools/face-prompts.py; each page is retried once on a timeout (STYLE.md fix 26).
# Never overwrites: a page whose -v1.png exists is skipped. Prints one result line per page.
cd "$(dirname "$0")/.." || exit 1
gen() { # id tag angle sheet head
  local name="$1-$2-$3-v1" guide
  case "$2-$3" in
    faces-34l) guide=kaito-faces-v2.png ;; faces-front) guide=kaito-faces-front-v2.png ;; faces-34r) guide=kaito-faces-34r-v2.png ;;
    faces2-34l) guide=kaito-faces2-v1.png ;; faces2-front) guide=kaito-faces2-front-v1.png ;; faces2-34r) guide=kaito-faces2-34r-v3.png ;;
  esac
  [ -f "art/refs/$name.png" ] && { echo "$name: exists, skipped"; return; }
  for try in 1 2; do
    codex-imagegen "$(cat art/refs/prompts/$name.txt)" "./art/refs/$name.png" --ref "./art/refs/$4" --ref "./art/refs/$guide" --ref "./art/refs/$5" --size 2048x1024 --timeout 1200 > "$TEMP/$name.log" 2>&1
    rc=$?; [ $rc -eq 0 ] && break
  done
  echo "$name: exit $rc (try $try)"
}
while [ $# -ge 3 ]; do
  id=$1 sheet=$2 head=$3; shift 3
  for tag in faces faces2; do
    gen "$id" "$tag" 34l "$sheet" "$head" & gen "$id" "$tag" front "$sheet" "$head" & wait
    gen "$id" "$tag" 34r "$sheet" "$head"
  done
done
