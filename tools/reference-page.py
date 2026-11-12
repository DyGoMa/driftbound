"""Build the references page: every locked picture in art/refs/STYLE.md, grouped by character.
Usage: python -I tools/reference-page.py <output folder>   (use the session scratchpad, never art/refs/)
When a picture is locked, add it to SUBJ or FACES below, rebuild, and publish to the link in
art/refs/REFERENCE_PAGE.md. Lead expression pages are picked as the newest version on disk."""
import os, re, glob, html, shutil, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.dirname(HERE)
REFS = os.path.join(R, "art", "refs")
OUT = sys.argv[1]
os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
os.makedirs(os.path.join(OUT, "prompts"), exist_ok=True)
style = open(os.path.join(REFS, "STYLE.md"), encoding="utf-8").read()
STYLE_BLOCK = re.search(r"## Style block \(copy exactly\)\n> (.+)\n", style).group(1)
notes = {}
for line in style.split("\n"):
    mm = re.match(r"\| ([^|]+) \| `([a-z0-9-]+)\.png` \| (.+) \|$", line)
    if mm:
        notes[mm.group(2)] = mm.group(3).strip()

def newest(prefix):
    vs = []
    for f in glob.glob(os.path.join(REFS, prefix + "-v*.png")):
        b = os.path.basename(f)
        m = re.fullmatch(re.escape(prefix) + r"-v(\d+)\.png", b)
        if m:
            vs.append((int(m.group(1)), b[:-4]))
    return max(vs)[1]

def lead_faces(n):
    return [newest(f"{n}-{p}-{a}") for p in ("faces", "faces2") for a in ("34l", "front", "34r")]

FACES = {
 "kaito": ["kaito-faces-v2", "kaito-faces-front-v2", "kaito-faces-34r-v2", "kaito-faces2-v1", "kaito-faces2-front-v1", "kaito-faces2-34r-v3"],
 "krell": ["krell-faces-34l-v1", "krell-faces-front-v1", "krell-faces-34r-v1", "krell-faces2-34l-v1", "krell-faces2-front-v1", "krell-faces2-34r-v2"],
 "nim": ["nim-faces-34l-v1", "nim-faces-front-v1", "nim-faces-34r-v1", "nim-faces2-34l-v4", "nim-faces2-front-v5", "nim-faces2-34r-v1"],
 "vasch": ["vasch-faces-34l-v1", "vasch-faces-front-v1", "vasch-faces-34r-v1", "vasch-faces2-34l-v1", "vasch-faces2-front-v1", "vasch-faces2-34r-v1"],
 "hekka": ["hekka-faces-34l-v2", "hekka-faces-front-v1", "hekka-faces-34r-v2", "hekka-faces2-34l-v1", "hekka-faces2-front-v2", "hekka-faces2-34r-v1"],
}
for n in ("sela", "juno", "bram", "ione", "silas"):
    FACES[n] = lead_faces(n)
FACE_LABELS = ["Page 1, 3/4 left", "Page 1, front", "Page 1, 3/4 right", "Page 2, 3/4 left", "Page 2, front", "Page 2, 3/4 right"]

def S(**k):
    return k

SUBJ = [
 ("leads", "Leads", "The six crew of the Gullwake.", [
  S(id="kaito", name="Kaito Brask", sheet="kaito-sheet-v8", body="kaito-body34-v2", head="kaito-head-v3", extras=[("Scar stages", "kaito-arm-v3")]),
  S(id="sela", name="Sela Vey", sheet="sela-sheet-v5", body="sela-body34-v5", head="sela-head-v1"),
  S(id="juno", name="Juno Calloway", sheet="juno-sheet-v5", body="juno-body34-v1", head="juno-head-v2"),
  S(id="silas", name="Silas Moreau", sheet="silas-sheet-v4", body="silas-body34-v2", head="silas-head-v3"),
  S(id="bram", name="Bram Torvald", sheet="bram-sheet-v3", body="bram-body34-v1", head="bram-head-v1"),
  S(id="ione", name="Dr. Ione Raske", sheet="ione-sheet-v11", body="ione-body34-v1", head="ione-head-v1")]),
 ("partners", "Partners", "Each lead's bonded partner.", [
  S(id="skarn", name="Skarn", tag="Kaito's partner", sheet="skarn-sheet-v3", body="skarn-body34-v2", head="skarn-head-v2"),
  S(id="vesh", name="Vesh", tag="Sela's partner", sheet="vesh-sheet-v1", body="vesh-body34-v1", head="vesh-head-v1"),
  S(id="ashka", name="Ashka", tag="Juno's partner", sheet="ashka-sheet-v1", body="ashka-body34-v1", head="ashka-head-v2"),
  S(id="hush", name="Hush", tag="Silas's partner", sheet="hush-sheet-v2", body="hush-body34-v1", head="hush-head-v1"),
  S(id="grist", name="Grist", tag="Bram's partner", sheet="grist-sheet-v2", body="grist-body34-v1", head="grist-head-v2"),
  S(id="prism", name="Prism", tag="Ione's partner", sheet="prism-sheet-v3", body="prism-body34-v2", head="prism-head-v1")]),
 ("villains", "Villains", "The Sever, and Warden Krell.", [
  S(id="vasch", name="Director Aurel Vasch", sheet="vasch-sheet-v4", body="vasch-body34-v1", head="vasch-head-v2"),
  S(id="hekka", name="Captain Hekka Dorn", sheet="hekka-sheet-v6", body="hekka-body34-v1", head="hekka-head-v2"),
  S(id="silt", name="Silt", sheet="silt-sheet-v1", body="silt-body34-v1", head="silt-head-v1"),
  S(id="trooper", name="Sever trooper", sheet="trooper-sheet-v1", body="trooper-body34-v1"),
  S(id="tull", name="Mr. Tull", tag="Vasch's aide", sheet="tull-sheet-v1", body="tull-body34-v1", head="tull-head-v2"),
  S(id="krell", name="Warden Krell", sheet="krell-sheet-v3", body="krell-body34-v1", head="krell-head-v1")]),
 ("hollows", "Hollows", "Bonded beasts turned into weapons.", [
  S(id="hollow-bear", name="Hekka's Hollow bear", sheet="hollow-bear-sheet-v2", body="hollow-bear-body34-v2", head="hollow-bear-head-v1"),
  S(id="hollow-hound", name="Silt's Hollow hound", sheet="hollow-hound-sheet-v3", body="hollow-hound-body34-v2", head="hollow-hound-head-v2"),
  S(id="thimble-hollow", name="Thimble as a Hollow", sheet="thimble-hollow-sheet-v2", body="thimble-hollow-body34-v1")]),
 ("walkons", "Walk-ons", "Side characters from the issues.", [
  S(id="nim", name="Nim Hadda", sheet="nim-sheet-v2", body="nim-body34-v1", head="nim-head-v1"),
  S(id="quint", name="Lazare Quint", sheet="quint-sheet-v3", body="quint-body34-v1", head="quint-head-v3"),
  S(id="fenn", name="Mister Fenn", sheet="fenn-sheet-v1", body="fenn-body34-v1", head="fenn-head-v1"),
  S(id="hob", name="Hob Tarrow", sheet="hob-sheet-v2", body="hob-body34-v2", head="hob-head-v1"),
  S(id="marta", name="Marta Oake", sheet="marta-sheet-v1", body="marta-body34-v1", head="marta-head-v1"),
  S(id="thimble", name="Thimble", tag="Hob's plough-beast", sheet="thimble-sheet-v1", body="thimble-body34-v1", head="thimble-head-v2")]),
 ("ship", "Ship", "The crew's salvage ship.", [
  S(id="gullwake", name="The Gullwake", sheet="gullwake-sheet-v3", body="gullwake-body34-v2", extras=[("Deck plan", "gullwake-deck-v2")])]),
]

used, missing = [], []

def pic(name, label):
    src = os.path.join(REFS, name + ".png")
    if not os.path.exists(src):
        missing.append(name)
        return ""
    used.append(name)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    tw = 1200 if w >= h else 600
    im = im.resize((tw, round(h * tw / w)), Image.LANCZOS)
    im.save(os.path.join(OUT, "img", name + ".jpg"), quality=86, optimize=True)
    pt = os.path.join(REFS, "prompts", name + ".txt")
    has = os.path.exists(pt)
    if has:
        shutil.copyfile(pt, os.path.join(OUT, "prompts", name + ".txt"))
    plink = (f'<a class="plink" href="prompts/{name}.txt" target="_blank" rel="noopener">Prompt</a>' if has
             else '<span class="plink none">No prompt file</span>')
    tall = " tall" if h > w else ""
    return (f'<figure class="pic{tall}"><a class="im" href="img/{name}.jpg" target="_blank" rel="noopener">'
            f'<img src="img/{name}.jpg" alt="{html.escape(label)}, {name}" loading="lazy" width="{im.size[0]}" height="{im.size[1]}"></a>'
            f'<figcaption><span class="lab">{html.escape(label)}</span><code>{name}.png</code>{plink}</figcaption></figure>')

nav, body = [], []
for sid, title, blurb, subs in SUBJ:
    nav.append(f'<a href="#{sid}">{title} <span>{len(subs)}</span></a>')
    cards = []
    for s in subs:
        note = re.sub(r"\*\*(.+?)\*\*", r"\1", notes.get(s["sheet"], "")).replace("`", "")
        parts = [pic(s["sheet"], "Main sheet")]
        if s.get("body"):
            parts.append(pic(s["body"], "3/4 body"))
        if s.get("head"):
            parts.append(pic(s["head"], "Head turnaround"))
        for lab, f in s.get("extras", []):
            parts.append(pic(f, lab))
        faces = ""
        if s["id"] in FACES:
            faces = ('<h4>Expressions <span>16 faces on 2 pages, each at 3 angles</span></h4><div class="faces">'
                     + "".join(pic(f, l) for f, l in zip(FACES[s["id"]], FACE_LABELS)) + "</div>")
        gaps = [{"body": "3/4 body sheet", "head": "head turnaround"}[k] for k in ("body", "head") if not s.get(k)]
        gap = f'<p class="gap">No locked {" or ".join(gaps)} yet.</p>' if gaps else ""
        tag = f'<span class="tag">{html.escape(s["tag"])}</span>' if s.get("tag") else ""
        cards.append(f'<article class="subj" id="{s["id"]}"><header><h3>{html.escape(s["name"])}</h3>{tag}</header>'
                     f'<p class="note">{html.escape(note)}</p>{gap}<div class="sheets">{"".join(parts)}</div>{faces}</article>')
    body.append(f'<section class="grp" id="{sid}"><div class="ghead"><h2>{title}</h2><p>{blurb}</p></div>{"".join(cards)}</section>')

tpl = open(os.path.join(HERE, "reference-page.html"), encoding="utf-8").read()
page = (tpl.replace("{{STYLE}}", html.escape(STYLE_BLOCK)).replace("{{NAV}}", "".join(nav))
        .replace("{{BODY}}", "".join(body)).replace("{{COUNT}}", str(len(used))))
open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page)
print("pictures", len(used), "unique", len(set(used)), "missing", missing)
print("prompts copied", len(os.listdir(os.path.join(OUT, "prompts"))))
for sid, title, _, subs in SUBJ:
    print(title, [s["name"] for s in subs])
print({k: v for k, v in FACES.items() if k in ("sela", "juno", "bram", "ione", "silas")})
print("style:", STYLE_BLOCK)
