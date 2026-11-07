# Driftbound, the anime: episode script format (v1, 2026-11-06)

Dylan: "write the script of the first 10 or 20 anime episodes too? i want them to be about 10-15 mins long." The anime adapts the manga one issue per episode: **Episode N adapts Issue N**, its beats from `docs/manga/SERIES_BIBLE.md` section 8, with the same hard rules (section 1), voices (section 5) and fan service line (section 6). If the manga issue file `manga/issues/issue-NN.js` exists, read it and adapt it faithfully (same jokes, same lines where they work spoken). If it doesn't exist yet, write from the bible's beats alone.

## File
`anime/episodes/ep-NN.md`, two digits. Markdown. One writer per file.

## Length
10 to 15 minutes on screen. Estimate 1 minute per 110 to 130 words of dialogue plus action, so **2,400 to 3,600 words total**, with **1,300 to 2,000 words of spoken dialogue**. Put a running time estimate at the end of every scene heading, `(≈ 1:40)`, and a total at the end.

## Shape (how a weekly anime episode is built)
1. **Cold open** (30 to 90 s): straight into something: a chase, a joke, a dread. Episode 2 onward starts with a 20 s recap spoken by a crew member in voice (a different one each time, in character, unreliable and funny).
2. **OP card**: `[OPENING: "Drift Line" — 90 s]` as a single line; the song itself is never written out.
3. **Part A** (4 to 6 min), **eyecatch** (`[EYECATCH: ...]`, one line describing the little still: a Pal doing something, no fan service), **Part B** (4 to 6 min).
4. **ED card**: `[ENDING: "Logbook" — 60 s]`. Episode 1 may hold the ending over a final scene.
5. **Next-episode preview** (20 to 30 s): the crew talk over clips of the next episode, in character, bickering; ends with the next title and one of them saying the series tag "The islands move. Try to keep up." Preview follows the bible's next issue beats without spoiling its reveals.

## Screenplay style
```
## SCENE 3 — EXT. PINHOLD ROOFTOPS — DUSK (≈ 1:30)

Wide: Kaito runs the ridgeline, Skarn's shadow crossing him. Parcel under one arm.

KAITO: (not slowing) First map of the Drift that stays right. Mine. Say it back.
SKARN: (a grumble)
KAITO: You never say it back.

SFX: tiles cracking under a boot
MUSIC: brass, running
```
- Scene headings as above. Action in short present-tense paragraphs. Speaker in caps, parentheticals sparingly. `SFX:` and `MUSIC:` cues as lines. `CUT TO:` and `SMASH CUT:` where they matter. Partners never speak words.
- Camera in plain words, only when it matters. Never a camera that lingers on a body, never a pose for the viewer: see bible section 6. Fan service is outfits, banter, innuendo, cutaway gags; all adults; no nudity; nothing sexual near anyone frightened or hurt.
- Flashbacks to childhood: plain and sad, no jokes in the scene before or after.
- Every episode: a laugh, a heart beat, a turn, and a hook into the next one.

## Header (top of every file)
```
# Driftbound — Episode NN: "Title"
Adapts: Manga Issue NN ("Issue title"). Arc: Pinhold. Part One: The Map That Lies.
Target runtime: 12:30. Written: 2026-11-06. Status: script only, not seen running.
Cast in this episode: Kaito, Sela, ... (each new character with age on first mention in the action)
```

## Done means
The header, the five shape sections in order, time estimates on scenes and a total between 10:00 and 15:00, the word counts inside the ranges above (say your count at the end of the file, in a `<!-- words: total X, dialogue Y -->` comment), and nothing that breaks the hard rules.
