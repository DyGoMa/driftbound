"""More characters for tools/face-prompts.py (added 2026-11-09, skill driftbound-images).

Same shape as PEOPLE there: sides = (own side, what, is_bond_mark). Looks from each locked sheet and its
STYLE.md row. FULL get head + six expression pages; HEAD_ONLY get the head turnaround only (Dylan's tiers,
2026-11-08). CREATURES get a creature head turnaround (head and neck, five angles).
"""

FULL = {
  'vasch': dict(sheet='vasch-sheet-v4.png', who="Director Aurel Vasch", pro="his", Pro="His",
    look="an ADULT man of 46 with a thin, lightly lined adult face. Pale skin, pale grey eyes. Neat grey hair combed straight back, no parting. A tiny closed-mouth smile at rest. A plain white coat with a white stand-up collar; a flat black bar across the chest with a black ring at its centre.",
    crop="cut off just below the collarbones, so the top of the chest bar shows",
    sides=[], allow="The one exception is the black ring on his chest bar."),
  'hekka': dict(sheet='hekka-sheet-v6.png', who="Captain Hekka Dorn", pro="her", Pro="Her",
    look="an ADULT woman of 33 with a strong, attractive adult face. Light brown skin, blue-grey eyes, no scar on her lips. Thick wavy black hair swept back from her face, falling behind her shoulders. A white stand-up collar above a Sever-grey chest plate with shoulder plates; a black bar with a white ring across the chest plate.",
    crop="cut off just below the collarbones",
    sides=[], allow="The one exception is the white ring on her chest bar."),
  'krell': dict(sheet='krell-sheet-v3.png', who="Warden Krell", pro="his", Pro="His",
    look="an ADULT man of 41 with a hard, bored officer's face: a heavy brow, a square stubbled jaw, deep lines beside the mouth, dark eyes, tan skin, a thick neck. A dark grey helmet with no visor and a round ear cup on each side, so his brow, eyes and jaw all show. A dark grey coat with a white stand-up collar; heavy steel plates strapped on his upper arms.",
    crop="cut off just below the collarbones",
    sides=[], allow=""),
  'nim': dict(sheet='nim-sheet-v2.png', who="Nim Hadda", pro="his", Pro="His",
    look="an ADULT man of 30 with a gentle, a little tired adult face that reads 30. Pale skin with light freckles across the nose and cheeks, grey eyes, clean-shaven. A full head of short, slightly untidy sandy-blond hair. An off-white shirt collar under a buttoned brown waistcoat.",
    crop="cut off just below the collarbones",
    sides=[("RIGHT", "a short stub of white chalk tucked behind his RIGHT ear", False),
           ("LEFT", "the empty LEFT shirt sleeve folded up and pinned flat at his left shoulder (his left arm is missing)", False)],
    allow=""),
}

HEAD_ONLY = {
  'silt': dict(sheet='silt-sheet-v1.png', who="Silt", pro="his", Pro="His",
    look="an ADULT man of 29. One smooth, plain white mask covers his whole face from hairline to chin, with no mouth, no nose holes and no markings, held on by a thin black strap round the back of the head. Short, messy black hair above and behind the mask. Pale skin at the neck. A plain collar of a ragged black coat over a fitted black top.",
    crop="cut off just below the collarbones",
    sides=[("RIGHT", "ONE narrow horizontal eye slit in the mask over his RIGHT eye, solid black, no eye visible; in profile it is short and sits at the very front edge of the mask", False)],
    allow=""),
  'quint': dict(sheet='quint-sheet-v3.png', who="Lazare Quint", pro="his", Pro="His",
    look="an ADULT man of 61 with a round face, ruddy pale skin and pink cheeks, small pale-blue eyes, clean-shaven, a neutral face. Silver hair oiled flat and combed straight back. Small flat-topped reading glasses low on the nose: two small lenses, thin gold rims, clean, simple and the same size both sides. A white shirt with a black cravat, a charcoal waistcoat, an ember-red tailcoat collar.",
    crop="cut off just below the collarbones", sides=[], allow=""),
  'fenn': dict(sheet='fenn-sheet-v1.png', who="Mister Fenn", pro="his", Pro="His",
    look="an ADULT man of 51 with a calm, unreadable face and fine lines at the eyes. Light brown skin, dark brown eyes, clean-shaven. Short silver hair, neatly combed, a little longer on top. A crisp white shirt collar, a small black bow tie, a black waistcoat with thin ember-red piping.",
    crop="cut off just below the collarbones",
    sides=[("LEFT", "the side parting of his hair, on his LEFT side", False)], allow=""),
  'hob': dict(sheet='hob-sheet-v2.png', who="Hob Tarrow", pro="his", Pro="His",
    look="an ADULT man of 68 with an old man's sun-weathered tan face and deep lines, kind brown eyes, white stubble on his jaw, wispy white hair under a flat cloth cap of faded brown tweed. A collarless faded blue work shirt under a brown waistcoat.",
    crop="cut off just below the collarbones", sides=[], allow=""),
  'marta': dict(sheet='marta-sheet-v1.png', who="Marta Oake", pro="her", Pro="Her",
    look="an ADULT woman of 61 with an older woman's olive-skinned face, smile lines at the eyes and mouth, dark brown eyes, a small closed smile. Grey hair in a low bun mostly covered by a faded blue cotton headscarf knotted at the back of the neck. A cream blouse collar and a dark red cable-knit shawl over her shoulders.",
    crop="cut off just below the collarbones", sides=[], allow=""),
  'tull': dict(sheet='tull-sheet-v1.png', who="Mr. Tull", pro="his", Pro="His",
    look="an ADULT man of 27 with a slight, neat, a little nervous adult face. Pale skin, pale grey-green eyes behind small round wire-rimmed glasses, clean and the same size both sides. Thin mousy-brown hair, short, combed flat. Clean-shaven, bare head. A grey coat with a white stand-up collar; a flat black bar with a white ring across the chest.",
    crop="cut off just below the collarbones",
    sides=[("RIGHT", "the neat side parting of his hair, on his RIGHT side", False)],
    allow="The one exception is the white ring on his chest bar."),
}

# Creature heads: what the head and neck look like (from body34_creatures.py and the locked sheets).
CREATURES = {
  'skarn': dict(sheet='skarn-sheet-v3.png', who="Skarn, a storm wolf the size of a horse",
    look="a huge wolf's head on a thick neck, slate-grey fur shaggier at the neck, glowing yellow eyes under a grumpy, scowling brow, mouth closed with a few fang tips showing; the front of the tall darker-grey spine fin rises from the back of the neck with small yellow lightning arcs on its edge."),
  'ashka': dict(sheet='ashka-sheet-v1.png', who="Ashka, a fire raptor the size of a large eagle",
    look="a fierce bird-of-prey head: ember-red feathers with black tips, a small head crest, yellow eyes, a sharp hooked beak (closed), tiny glowing orange sparks drifting off the feather edges."),
  'vesh': dict(sheet='vesh-sheet-v1.png', who="Vesh, a deep-sea serpent-dragon",
    look="a dragon-like serpent head with a long snout, two horns, glowing teal eyes, dark navy-blue scales and a paler blue-grey throat of wide belly plates; a fan-shaped frill of webbed spines on each side of the jaw; the first gold lantern lures on short stalks running down the middle of the back of the neck; mouth closed."),
  'hush': dict(sheet='hush-sheet-v2.png', who="Hush, a silent wind owl-lynx",
    look="a flat round OWL FACE: a pale round facial disc framed by darker feathers, large round glowing violet eyes, a short hooked owl beak (closed), lynx ear tufts; smoky grey-violet feathers on the head and neck. Seen from behind, we see the backs of the ears, not their insides."),
  'grist': dict(sheet='grist-sheet-v2.png', who="Grist, an iron rhino-beetle beast",
    look="a short armoured beetle head under the front edge of a domed shell of dark gunmetal iron plates, two small glowing rust-orange eyes, small closed mandibles, and ONE huge horn rising from the front of the head shaped like a blacksmith's anvil seen from the side (a thick flat-topped block with a pointed tip sticking forward). Plain metal, no marks or squiggles."),
  'prism': dict(sheet='prism-sheet-v3.png', who="Prism, a glass mantis-moth",
    look="a triangular mantis head of clear ice-blue crystal glass with two large faceted eyes and two thin antennae, on a slim glass neck; the tops of the folded blade forearms show at the bottom edge, each on its own side, never crossed."),
  'hollow-bear': dict(sheet='hollow-bear-sheet-v2.png', who="Hekka's Hollow bear, a stripped monster",
    look="a broad bear head with small round ears, rough ash-grey fur leaning warm grey-brown, blank white eyes with a slight glow and no pupils, a bolted Sever-grey brow plate between the ears, a heavy dark iron collar with a short chain end at the throat, mouth closed. It looks empty and wrong."),
  'hollow-hound': dict(sheet='hollow-hound-sheet-v3.png', who="Silt's Hollow hound, a stripped war-hound",
    look="a big wedge-shaped wolf-like head with a heavy jaw and a low angry brow, short torn swept-back ears, two long fangs over the lower lip on each side, blank white narrow eyes, dull ash-grey rough fur spiky at the neck, a heavy riveted Sever-grey plate from between the ears down the top of the muzzle, plates down the back of the neck, thick dark cables with clamps up the neck. NOT a pet dog: a monster."),
  'thimble': dict(sheet='thimble-sheet-v1.png', who="Thimble, an old, gentle farm plough-beast",
    look="a broad, blunt snout with dark grey-brown skin at the muzzle, small kind brown eyes with heavy lids, two short worn pale stub horns, long shaggy moss-green hair, a worn leather strap round the neck holding one cracked brass bell under the chin. Calm and old, no armour, no glow."),
}
