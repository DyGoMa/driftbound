"""Writes head-turnaround and expression-page prompts for a character (skill driftbound-images).

Usage: python tools/face-prompts.py <id> [<id> ...]
Prompts go to art/refs/prompts/<id>-head-v1.txt and <id>-faces[2]-<angle>-v1.txt (never overwritten).
Layouts and expression lists are the ones Dylan passed on Kaito (2026-11-08, STYLE.md).
Add a character to PEOPLE below: one-sided details carry the character's OWN side; the
script writes where each lands in every view.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from face_people2 import FULL, HEAD_ONLY, CREATURES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'art', 'refs', 'prompts')
STYLE = "2000s TV-anime cel-shaded style: clean black ink lines, flat cel shading with one shadow tone, slightly muted early-2000s colours."
BG = "Plain flat mid-grey background. No floor, no cast shadows, no text, no labels, no numbers, no logos, no symbols, no emblems."
RULES = "Adults only, with adult faces and adult bodies. No nudity, no sexualized posing or framing. Nothing copied from any real anime or game. Nothing Pokémon-like."

PEOPLE = {
  'sela': dict(sheet='sela-sheet-v5.png', who="Sela Vey", pro="her", Pro="Her",
    look="an ADULT woman of 28 with an adult face and adult proportions. Dark brown skin, sea-green eyes, a calm teasing face. Long silver-blue hair pulled up in a high ponytail. Small gold hoop earrings in both ears. A deep-blue cropped navigator's jacket with a high collar and one brass button under the collar, open in a low V over a black bandeau top.",
    crop="cut off at mid-chest, so the bond mark below her left collarbone shows",
    sides=[("LEFT", "a small glowing deep-teal whirlpool bond mark on the bare skin just below her LEFT collarbone, inside the V of the jacket: one curved line winding inward two turns to a point, a ROUND coin-like outline with NO tail; it must not look like a letter or number", True)],
    allow="The one exception is her bond mark described above."),
  'juno': dict(sheet='juno-sheet-v5.png', who="Juno Calloway", pro="her", Pro="Her",
    look="an ADULT woman of 23 with an adult face and adult proportions. Tanned skin with freckles across the nose and cheeks, bright green eyes, a cocky face. Copper-orange hair, loose on top, in ONE thick braid. An open brown bomber jacket with a cream fur collar over a cropped white tank top.",
    crop="cut off at mid-chest, so the bond mark below her right collarbone shows",
    sides=[("LEFT", "her one thick copper braid, which comes forward over her LEFT shoulder and hangs straight down in front of it, ending in one tail under one dark tie", False),
           ("RIGHT", "a glowing fire-orange flame-shaped feather bond mark on her upper chest below her RIGHT collarbone, inside the open jacket, above the tank top; one feather whose tip curls up like a flame; it must not look like a letter or number", True)],
    allow="The one exception is her bond mark described above."),
  'silas': dict(sheet='silas-sheet-v4.png', who="Silas Moreau", pro="his", Pro="His",
    look="an ADULT man of 24 with an adult face and adult proportions, slim and graceful. Pale skin, violet eyes, a charming face. Long dark-teal hair tied low at the back of the neck in a ponytail. A white shirt unbuttoned low with a loose high collar falling open.",
    crop="cut off just below the collarbones",
    sides=[("LEFT", "a small dark beauty mark just under his LEFT eye", False),
           ("LEFT", "three short glowing violet feather-line bond marks running down the LEFT side of his neck; they must not look like letters or numbers", True)],
    allow="The one exception is his bond mark described above."),
  'bram': dict(sheet='bram-sheet-v3.png', who="Bram Torvald", pro="his", Pro="His",
    look="an ADULT man of 31 with an adult face and adult proportions, huge and broad. Light-brown skin, kind brown eyes, a thick black beard, a shaved head. Shirtless: thick black tribal-style tattoos of flowing curved bands with sharp points wrap round BOTH shoulders (pure pattern, no letters, faces or symbols). Heavy leather work-dungarees; only the RIGHT strap is up, running over his right shoulder; the left strap is down out of sight.",
    crop="cut off at mid-chest, so the bond mark over his heart shows",
    sides=[("LEFT", "a glowing rust-orange anvil-shaped bond mark on bare skin over his heart, on his LEFT chest: a flat wide top with a pointed horn to one side, a narrow waist and a wide base; it must not look like a letter or number", True),
           ("LEFT", "a dull grey iron patch on his LEFT shoulder, like a patch of metal skin, over the tattoo", False),
           ("RIGHT", "a white cook's towel draped over his RIGHT shoulder, over the strap", False)],
    allow="The one exception is his bond mark described above."),
  'ione': dict(sheet='ione-sheet-v11.png', who="Dr. Ione Raske", pro="her", Pro="Her",
    look="an ADULT woman of 26 with an adult face and adult proportions, slim. Pale skin, sharp grey eyes behind thin round wire-rimmed glasses (clean, even, the same size both sides). A messy chin-length black bob. A cropped black low-cut V-neck top with a white lab coat worn open on her shoulders.",
    crop="cut off just below the collarbones",
    sides=[("LEFT", "ONE crystal-white lock of hair on her LEFT side, from her left temple down past her left cheek to the jaw", False),
           ("LEFT", "a cluster of small sharp pale ice-blue crystal shards growing up the LEFT side of her neck, from the collarbone to just below her left ear", False)],
    allow=""),
}

P1 = ["NEUTRAL, mouth closed", "GRIN, a wide confident grin showing teeth", "SHOUT, mouth wide open yelling, brows down", "BLUSH, flustered, cheeks red, eyes wide, mouth a small wobbly line",
      "FEAR, eyes wide, small pupils, mouth open, sweat", "GRIEF, eyes squeezed and wet, brows up in the middle, mouth pulled down", "SMUG, half-lidded eyes, one corner of the mouth up", "GAG FACE, a 2000s-anime comedy face: eyes turned to simple flat white ovals or dots, a big sweat drop, mouth a wide wavy line"]
P2 = ["LAUGH, head tipped back a little, eyes squeezed into happy curves, mouth wide open laughing", "RAGE, teeth clenched and bared, brows slammed down, eyes narrowed and fierce", "PAIN, a hard wince, one eye shut, teeth gritted, sweat", "DISGUST, nose wrinkled, upper lip curled, eyes narrowed, leaning slightly away",
      "SURPRISED, eyebrows high, eyes round, mouth a small open circle", "TENDER, a soft small closed-mouth smile, eyes gentle and a little lowered", "EXHAUSTED, heavy half-closed eyes, dark under the eyes, mouth slack, a bead of sweat", "ASLEEP, eyes closed peacefully, mouth slightly open, head drooping a little"]

ANGLES = {
  'front': "FRONT: facing the viewer straight on",
  '34l': "THREE-QUARTER LEFT: turned 45 degrees toward the LEFT edge of the image, so the LEFT cheek and LEFT ear are nearer us",
  '34r': "THREE-QUARTER RIGHT: turned 45 degrees toward the RIGHT edge of the image, so the RIGHT cheek and RIGHT ear are nearer us",
  'pl': "PROFILE LEFT", 'pr': "PROFILE RIGHT",
}
KAITO_GUIDE = {'34l': ('kaito-faces-v2.png', 'kaito-faces2-v1.png'), 'front': ('kaito-faces-front-v2.png', 'kaito-faces2-front-v1.png'), '34r': ('kaito-faces-34r-v2.png', 'kaito-faces2-34r-v2.png')}

def where(side, angle):
    near = {'34l': 'LEFT', 'pl': 'LEFT', '34r': 'RIGHT', 'pr': 'RIGHT'}
    if angle == 'front':
        return 'on the RIGHT of the image' if side == 'LEFT' else 'on the LEFT of the image'
    if near[angle] == side:
        return 'clearly visible on the side nearest us'
    return 'on the far side: only a sliver shows, or it is hidden' if angle in ('34l', '34r') else 'hidden (far side)'

def sides_text(p, angles):
    if not p['sides']:
        return '- None: both sides of the head and outfit match.'
    lines = []
    for side, what, _ in p['sides']:
        per = '; '.join(f"{ANGLES[a].split(':')[0]}: {where(side, a)}" for a in angles)
        lines.append(f"- {what[0].upper() + what[1:]}. {per}. The other side has none of it.")
    return '\n'.join(lines)

def write(name, text):
    path = os.path.join(OUT, name)
    if os.path.exists(path):
        print('exists, kept:', name); return
    open(path, 'w', encoding='utf-8', newline='\n').write(text.strip() + '\n'); print('wrote', name)

def head(cid, p):
    write(f'{cid}-head-v1.txt', f"""Head turnaround reference sheet. Image 1 is this character's locked reference sheet: copy the face, hair, eyes, marks and clothes exactly. Draw only what is described below.

{STYLE}

Five head-and-shoulders portraits of the same person in one row, same scale, evenly spaced, not overlapping, chins on the same line, head tops level, {p['crop']}:
(1) FRONT: facing the viewer.
(2) THREE-QUARTER LEFT: head and shoulders turned 45 degrees toward the LEFT edge of the image, so their LEFT cheek and LEFT ear are nearer us and the far eye is partly hidden by the nose bridge.
(3) PROFILE LEFT: a true 90-degree profile facing the LEFT edge of the image, so their LEFT side is nearest us.
(4) THREE-QUARTER RIGHT: head and shoulders turned 45 degrees toward the RIGHT edge of the image, so their RIGHT cheek and RIGHT ear are nearer us.
(5) PROFILE RIGHT: a true 90-degree profile facing the RIGHT edge of the image, so their RIGHT side is nearest us.
Neutral face, mouth closed, eyes looking straight ahead in the direction the head faces. Same lighting in every portrait.

Character: {p['who']}, exactly as in Image 1: {p['look']}

One-sided details, in every portrait:
{sides_text(p, ['front', '34l', 'pl', '34r', 'pr'])}

{BG} {p['allow']}

{RULES}""")

def faces(cid, p, page, angle):
    rows = P1 if page == 1 else P2
    tag = 'faces' if page == 1 else 'faces2'
    grid = '\n'.join([
        'Top row, left to right: ' + ' '.join(f'({i + 1}) {rows[i]}.' for i in range(4)),
        'Bottom row, left to right: ' + ' '.join(f'({i + 1}) {rows[i]}.' for i in range(4, 8))])
    write(f'{cid}-{tag}-{angle}-v1.txt', f"""Expression reference sheet. Image 1 is this character's locked reference sheet: copy the face, hair, eyes, marks and clothes exactly. Image 2 is the house expression guide (another character, Kaito): use it ONLY for which expression goes in which cell, the angle, framing and layout. Each cell must be the SAME TYPE of expression as the same cell in Image 2; this character may show it a little bigger or smaller to suit their personality, but never a different expression. Do NOT copy Kaito's face, hair or clothes. Image 3 is this character's own head turnaround: use it for how the head looks at this angle.

{STYLE}

Eight head-and-shoulders portraits of the same person in a grid of 4 across and 2 down, same scale, evenly spaced, not overlapping, {p['crop']}. In EVERY portrait the head is at the same angle: {ANGLES[angle]}. Only the expression changes; the face shape, hair, eyes, marks and clothes stay identical. Same lighting in every portrait.
{grid}
Still an adult face with adult proportions in every portrait, NOT chibi.

Character: {p['who']}, exactly as in Image 1: {p['look']}

One-sided details, the same in all eight portraits:
{sides_text(p, [angle])}

{BG} {p['allow']}

{RULES}""")

def creature_head(cid, c):
    write(f'{cid}-head-v1.txt', f"""Head turnaround reference sheet of an ORIGINAL creature. Image 1 is this creature's locked reference sheet: copy its head, eyes, colours, plates and markings exactly. Draw only the head and neck.

{STYLE}

Five head-and-neck portraits of the same creature in one row, same scale, evenly spaced, not overlapping, the base of the neck on the same line, head tops level, cut off at the base of the neck:
(1) FRONT: head-on, facing the viewer.
(2) THREE-QUARTER LEFT: turned 45 degrees toward the LEFT edge of the image, so its LEFT side is nearer us.
(3) PROFILE LEFT: a true 90-degree profile facing the LEFT edge of the image.
(4) THREE-QUARTER RIGHT: turned 45 degrees toward the RIGHT edge of the image, so its RIGHT side is nearer us.
(5) PROFILE RIGHT: a true 90-degree profile facing the RIGHT edge of the image.
Head level, mouth closed, eyes looking straight ahead in the direction the head faces. Same lighting in every portrait. Every detail is the same size, colour and place in all five.

Creature: {c['who']}, exactly as in Image 1: {c['look']}

{BG}

{RULES}""")

if __name__ == '__main__':
    # python tools/face-prompts.py <id> ...  (leads, FULL: head + six pages; HEAD_ONLY and CREATURES: head only)
    for cid in sys.argv[1:] or PEOPLE:
        if cid in CREATURES:
            creature_head(cid, CREATURES[cid]); continue
        p = PEOPLE.get(cid) or FULL.get(cid) or HEAD_ONLY[cid]
        head(cid, p)
        if cid in HEAD_ONLY:
            continue
        for page in (1, 2):
            for angle in ('34l', 'front', '34r'):
                faces(cid, p, page, angle)
