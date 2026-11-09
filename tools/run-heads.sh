#!/usr/bin/env bash
# Runs head turnarounds two at a time (skill driftbound-images). Prompts from tools/face-prompts.py.
# Usage: bash tools/run-heads.sh <id>:<sheet.png> [<id>:<sheet.png> ...]
# Writes art/refs/<id>-head-v1.png from art/refs/prompts/<id>-head-v1.txt with the sheet as Image 1.
# Retried once on a timeout (STYLE.md fix 26); never overwrites.
cd "$(dirname "$0")/.." || exit 1
gen() {
  # <id>:<sheet.png> for a first take, or <name>@edit (e.g. vasch-head-v2@edit) for an edit whose
  # refs are listed one per line in art/refs/prompts/<name>.refs (Image 1 first).
  local name args=()
  if [ "${1%@edit}" != "$1" ]; then
    name="${1%@edit}"; mapfile -t refs < "art/refs/prompts/$name.refs"
    for r in "${refs[@]}"; do r="${r%$'\r'}"; [ -n "$r" ] && args+=(--ref "./art/refs/$r"); done
  else
    name="${1%%:*}-head-v1"; args=(--ref "./art/refs/${1#*:}")
  fi
  [ -f "art/refs/$name.png" ] && { echo "$name: exists, skipped"; return; }
  for try in 1 2; do
    codex-imagegen "$(cat art/refs/prompts/$name.txt)" "./art/refs/$name.png" "${args[@]}" --size 2048x1024 --timeout 1200 > "$TEMP/$name.log" 2>&1
    rc=$?; [ $rc -eq 0 ] && [ -f "art/refs/$name.png" ] && break
  done
  echo "$name: exit $rc (try $try) $(date +%H:%M)"
}
while [ $# -gt 0 ]; do
  if [ $# -ge 2 ]; then gen "$1" & gen "$2" & wait; shift 2
  else gen "$1"; shift; fi
done
