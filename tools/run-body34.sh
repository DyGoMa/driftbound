#!/usr/bin/env bash
# Runs three-quarter body sheets two at a time (skill driftbound-images).
# Usage: bash tools/run-body34.sh <id>[:vN] [<id>[:vN] ...]   (default v1)
# Prompt: art/refs/prompts/<id>-body34-vN.txt. Refs: from tools/body34-prompts.py --refs <id>,
# or, for an edit, a file art/refs/prompts/<id>-body34-vN.refs with one ref per line (Image 1 first).
# Each picture is retried once on a timeout (STYLE.md fix 26). Never overwrites an existing picture.
cd "$(dirname "$0")/.." || exit 1
gen() {
  local id="${1%%:*}" v="${1#*:}"; [ "$v" = "$1" ] && v=v1
  local name="$id-body34-$v" args=()
  [ -f "art/refs/$name.png" ] && { echo "$name: exists, skipped"; return; }
  if [ -f "art/refs/prompts/$name.refs" ]; then mapfile -t refs < "art/refs/prompts/$name.refs"
  else read -ra refs <<< "$(python tools/body34-prompts.py --refs "$id")"; fi
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
