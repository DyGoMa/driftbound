#!/usr/bin/env bash
# Runs head turnarounds two at a time (skill driftbound-images). Prompts from tools/face-prompts.py.
# Usage: bash tools/run-heads.sh <id>:<sheet.png> [<id>:<sheet.png> ...]
# Writes art/refs/<id>-head-v1.png from art/refs/prompts/<id>-head-v1.txt with the sheet as Image 1.
# Retried once on a timeout (STYLE.md fix 26); never overwrites.
cd "$(dirname "$0")/.." || exit 1
gen() {
  local id="${1%%:*}" sheet="${1#*:}" name="${1%%:*}-head-v1"
  [ -f "art/refs/$name.png" ] && { echo "$name: exists, skipped"; return; }
  for try in 1 2; do
    codex-imagegen "$(cat art/refs/prompts/$name.txt)" "./art/refs/$name.png" --ref "./art/refs/$sheet" --size 2048x1024 --timeout 1200 > "$TEMP/$name.log" 2>&1
    rc=$?; [ $rc -eq 0 ] && [ -f "art/refs/$name.png" ] && break
  done
  echo "$name: exit $rc (try $try) $(date +%H:%M)"
}
while [ $# -gt 0 ]; do
  if [ $# -ge 2 ]; then gen "$1" & gen "$2" & wait; shift 2
  else gen "$1"; shift; fi
done
