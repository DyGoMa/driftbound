"""Writes three-quarter body sheet prompts (skill driftbound-images; layout passed on Kaito 2026-11-09).

Usage: python tools/body34-prompts.py <id> [<id> ...]
Prompts go to art/refs/prompts/<id>-body34-v1.txt (never overwritten).
The layout copies art/refs/prompts/kaito-body34-v1.txt. Each one-sided detail carries the character's OWN
side and which face of the body it sits on (front, back or round = arm, hip, shoulder, sleeve); the script
writes what shows in every view and where it lands on the image (STYLE.md fix 1).
Data for people lives in body34_data.py.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from body34_data import PEOPLE
from body34_creatures import CREATURES, SHIP

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art', 'refs', 'prompts')
STYLE = "2000s TV-anime cel-shaded style: clean black ink lines, flat cel shading with one shadow tone, slightly muted early-2000s colours."
BG = "Plain flat mid-grey background. No floor, no cast shadows, no text, no labels, no numbers, no logos, no symbols, no emblems."
RULES = "Adults only, with adult faces and adult bodies. No nudity, no sexualized posing or framing. Nothing copied from any real anime or game. Nothing Pokémon-like."
LAYOUT_GUIDE = 'kaito-body34-v2.png'
HAND_GUIDE = 'sela-sheet-v5.png'

# view number, side nearest us, whether we see the front, where the character's LEFT side lands on the image
VIEWS = [(1, 'LEFT', True), (2, 'RIGHT', True), (3, 'LEFT', False), (4, 'RIGHT', False)]

def img_side(side, front):
    # Seen from the front, the character's left is on the right of the image; seen from behind, on the left.
    if front:
        return 'RIGHT' if side == 'LEFT' else 'LEFT'
    return side

def where(side, face, view):
    n, near, front = view
    at = f"on the {img_side(side, front)} of the image"
    if face == 'front' and not front:
        return 'not visible (we see the back)'
    if face == 'back' and front:
        return 'not visible (we see the front)'
    if near == side:
        return f"clearly visible on the side nearest us, {at}"
    if face == 'round':
        return f"on the far side, partly hidden behind the body, {at}"
    return f"on the far side, smaller and turned away but still there, {at}"

def details(p):
    lines = []
    for d in p['sides']:
        side, face, what = d[:3]
        per = d[3] if len(d) > 3 else [where(side, face, v) for v in VIEWS]
        views = '; '.join(f"({n}) {t}" for (n, _, _), t in zip(VIEWS, per))
        on = 'In the centre' if side == 'CENTRE' else f"On {p['pro']} {side} side"
        lines.append(f"- {on}: {what}. Per view: {views}.")
    lines.append(f"- Back-view hands in (3) and (4) are seen from behind as in Image {p['hand_img']}.")
    return '\n'.join(lines)

def prompt(cid, p):
    pro, he = p['pro'], p['he']
    refs = (f"Image 1 is this character's locked reference sheet: copy {pro} face, hair, eyes, marks, outfit and proportions exactly. "
            f"Image 2 is the house three-quarter sheet (another character, Kaito): use it ONLY for the four angles, the A-pose, the spacing and the framing; do NOT copy his face, hair, clothes or marks.")
    if p['hand_img'] == 3:
        refs += " Image 3 is a guide ONLY for how hands look from behind: one smooth back of the hand, fingers together, a short thumb behind the hand on the inner side; do NOT copy anything else from it."
    else:
        refs += " Image 1 also shows how this character's hands look from behind in its BACK view: one smooth back of the hand, fingers together, a short thumb behind the hand on the inner side."
    return f"""Three-quarter turnaround reference sheet for building a 3D model, to sit beside the four-view sheet in Image 1. {refs}

{STYLE}

Four full-body views of the same person in one row, same scale, evenly spaced, not overlapping, feet on the same baseline, head tops level:
(1) THREE-QUARTER FRONT LEFT: turned 45 degrees from the front toward the LEFT edge of the image, so we see the front and {pro} LEFT side.
(2) THREE-QUARTER FRONT RIGHT: turned 45 degrees from the front toward the RIGHT edge of the image, so we see the front and {pro} RIGHT side.
(3) THREE-QUARTER BACK LEFT: turned so we see {pro} back and {pro} LEFT side, {pro} face turned away toward the LEFT edge of the image.
(4) THREE-QUARTER BACK RIGHT: turned so we see {pro} back and {pro} RIGHT side, {pro} face turned away toward the RIGHT edge of the image.
Pose: A-POSE in every view: standing straight, feet about shoulder-width apart, arms straight and raised away from the body so each arm makes a 45-degree angle with the torso, hands out at hip height, a clear gap of grey background between each arm and the body. {p.get('face', 'Neutral face, mouth closed.')}

Character: {p['who']}, exactly as in Image 1: {p['look']}

One-sided details per view:
{details(p)}

{BG} {p['allow']}

{RULES}
"""

def creature_prompt(cid, c):
    notes = '\n'.join(f'- {n}' for n in c['notes'])
    return f"""Three-quarter turnaround reference sheet for building a 3D model of an ORIGINAL creature, to sit beside the four-view sheet in Image 1. Image 1 is this creature's locked reference sheet: copy its body, head, colours, markings, plates and proportions exactly; only the viewing angles change.

{STYLE}

Four full-body views of the same creature in one row, same scale, evenly spaced, not overlapping, all on the same baseline:
(1) THREE-QUARTER FRONT LEFT: turned 45 degrees from head-on toward the LEFT edge of the image, so we see its face, its chest and its LEFT side.
(2) THREE-QUARTER FRONT RIGHT: turned 45 degrees from head-on toward the RIGHT edge of the image, so we see its face, its chest and its RIGHT side.
(3) THREE-QUARTER BACK LEFT: turned so we see its back end and its LEFT side, its head facing away toward the LEFT edge of the image.
(4) THREE-QUARTER BACK RIGHT: turned so we see its back end and its RIGHT side, its head facing away toward the RIGHT edge of the image.
The far legs sit partly hidden behind the near legs. Pose (neutral, for 3D modelling): {c['pose']}

Creature: {c['who']}, exactly as in Image 1: {c['look']}

Per view:
{notes}
- Every detail is the same size, colour and place in all four views.

{BG}

{RULES}
"""

def ship_prompt(s):
    return f"""Three-quarter reference sheet of a ship for building a 3D model, to sit beside the four-view sheet in Image 1. Image 1 is this ship's locked four-view sheet and Image 2 its locked deck plan (bow at the top): copy the hull, masts, yards, deck fittings, colours and proportions exactly; only the viewing angles change.

{STYLE}

Four views of the same ship in one row, same scale, evenly spaced, not overlapping, the waterline of every view on the same baseline, drawn as if the ship sits on calm, invisible water (the hull is cut off flat at the waterline, no water drawn), seen from a little above deck height so the deck shows:
(1) THREE-QUARTER BOW LEFT: the bow toward us and turned toward the LEFT edge of the image, so we see the bow and the ship's LEFT (port) side.
(2) THREE-QUARTER BOW RIGHT: the bow toward us and turned toward the RIGHT edge of the image, so we see the bow and the RIGHT (starboard) side.
(3) THREE-QUARTER STERN LEFT: the stern toward us, so we see the stern and the port side, the bow pointing away toward the LEFT edge of the image.
(4) THREE-QUARTER STERN RIGHT: the stern toward us, so we see the stern and the starboard side, the bow pointing away toward the RIGHT edge of the image.
No people, no animals, no creatures anywhere on or near the ship.

Ship: {s['who']}, exactly as in Images 1 and 2: {s['look']}

Per view:
- Every yard sits square across the ship, at right angles to the keel, so in all four views each yard is seen at the same 45-degree angle as the deck beneath it; the same count of yards on each mast in every view.
- The red patch on the starboard end of the main lower yard: (1) on the far end of that yard, small; (2) on the near end, clearly visible; (3) on the far end, small; (4) on the near end, clearly visible.
- Every repeated part (masts, yards, crosstrees, crane, rails) is the same height, size and place in all four views.

{BG}

{RULES}
"""

def refs(cid):
    if cid in CREATURES:
        return [CREATURES[cid]['sheet']]
    if cid == 'gullwake':
        return [SHIP['sheet'], SHIP['deck']]
    p = PEOPLE[cid]
    r = [p['sheet'], LAYOUT_GUIDE]
    if p['hand_img'] == 3:
        r.append(HAND_GUIDE)
    return r

if __name__ == '__main__':
    if sys.argv[1:2] == ['--refs']:  # used by tools/run-body34.sh
        print(' '.join(refs(sys.argv[2]))); sys.exit()
    for cid in sys.argv[1:] or PEOPLE:
        name = f'{cid}-body34-v1.txt'
        path = os.path.join(OUT, name)
        if os.path.exists(path):
            print('exists, kept:', name); continue
        text = (creature_prompt(cid, CREATURES[cid]) if cid in CREATURES
                else ship_prompt(SHIP) if cid == 'gullwake' else prompt(cid, PEOPLE[cid]))
        open(path, 'w', encoding='utf-8', newline='\n').write(text)
        print('wrote', name, 'refs:', ' '.join(refs(cid)))
