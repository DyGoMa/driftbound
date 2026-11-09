#!/usr/bin/env bash
# Runs edit redos one per line from a queue file: <name> (prompt art/refs/prompts/<name>.txt, refs <name>.refs, Image 1 first).
# Usage: bash tools/run-redo-queue.sh <name> [<name> ...]   Two at a time; one retry each; never overwrites.
cd "$(dirname "$0")/.." || exit 1
gen() {
  local name="$1" args=()
  [ -f "art/refs/$name.png" ] && { echo "$name: exists, skipped"; return; }
  mapfile -t refs < "art/refs/prompts/$name.refs"
  for r in "${refs[@]}"; do r="${r%$'\r'}"; [ -n "$r" ] && args+=(--ref "./art/refs/$r"); done
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
