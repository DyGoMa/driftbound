# Manga and anime: the plan for Friday (written 2026-11-06, 17:35)

Dylan: "continue what was in progress and let it finish and than the rest of it put it in for a plan for friday so i can use it to use up the last of my usage." Everything below is what's left after today's run. Nothing is committed yet; it all sits uncommitted on branch `manga/series-1` in `C:\Users\Dylan\Documents\driftbound-manga`.

## Where it stands (real numbers, checked 17:30)
- **Manga:** 51 issue files (1 to 48 of the main run, 49 to 51 side stories). `node tools/manga-check.js`: all 51 clean after five hand trims to Issues 16, 21, 22 and 24 (a few words over the panel limits; the writers were cut off before their fix loop). Totals are in the checker's last line; rerun it for the current numbers.
- **Audited** (a second Fable agent read it against the bible, fixed hard-rule, beat and voice problems): Issues 25 to 51. **Not audited** (writer only; the limit hit before the audit ran): Issues 1 to 24.
- **Anime:** 20 episode scripts, `anime/episodes/ep-01.md` to `ep-20.md`, 3,220 to 3,630 words each, 1,311 to 1,783 words of dialogue, 13:00 to 14:40 runtime. **None audited.**
- **Bookshelf and reader:** built; `node tools/manga-smoke.js` passed: shelf and 50 issues at 375x812 and 1280x800, 0 overflows, 0 errors. Seen by me in the browser on a phone-size view (cover, hint, page 2). **Not seen by Dylan.**
- **Backstory dossiers:** 10 files in `docs/manga/backstory/` (kaito, sela, juno, silas, bram, ione, villains, tencount, allies, world), about 3,000 words each.
- **New crew proposals:** `docs/manga/NEW_CREW_PROPOSALS.md` (Petra Marlowe the surgeon, Salt; Reuben Fell the grower, Root), status PROPOSED.
- **Not done at all:** the canon register `docs/manga/CANON.md` and the four consistency sweeps (games, manga, anime, site) all failed on the limit. The cross-issue conflicts the auditors found are listed in `docs/manga/WRITER_HANDOFFS.md`.

## Decisions for Dylan first (cards in the Friday chat)
1. **Rename "the Ten Count."** It's the title of a real published manga. Touches the bible (sections 4 and 8), Issue 25's title, `backstory/tencount.md`, and any issue that says it.
2. **Otti's partner Merrow:** gale-skate (Issue 51 and the allies dossier) or sea-ox (Issue 33, Issue 40 "She'd pull till I said stop"). Pick one; the loser gets fixed.
3. **Galley Rules:** number them once in the register (today's run has Rule One rewritten in Issue 29, "Forty" in five different wordings, "Six" and "Sixty" as new rules).
4. **Petra and Reuben:** approve, change or drop; where Petra joins (27 to 28 or 38 to 39).
5. **Fillers 52 to 54:** which of the three premises in `NEW_CREW_PROPOSALS.md`, if any.
6. Smaller calls the auditors left: "Yolo" as a partner's name (Issue 26); Vasch saying "Halfway" (Issue 39); Ione's fourth-wall footnote (39); spontaneous bonding lore for the eleven freed monsters (39).

## Phase 1: Finish the checks (about 45 agents; a Fable workflow, same shape as today)
- **Audit Issues 1 to 24** (24 agents). Resume today's workflow so nothing already done is paid for twice: `Workflow({scriptPath: "C:\Users\Dylan\.claude\projects\C--Users-Dylan-Documents-hoshi-arcade\7b319a48-abcd-4fb4-a7ba-f017b70e300d\workflows\scripts\driftbound-anime-and-issues-wf_db07434a-b3f.js", resumeFromRunId: "wf_db07434a-b3f"})`: the 27 finished writes replay from cache; the failed audits and the writes of 16, 21 to 24 run live (those five files already exist, so the writer prompt should be changed to "read the existing file and finish it" before resuming, or the five will be rewritten).
- **Audit Episodes 1 to 20** (20 agents): same resume covers them.
- **Done when:** checker says 51 clean; every audit returned; `WRITER_HANDOFFS.md` gets each audit's unfixed list.

## Phase 2: Canon register and consistency sweeps (5 agents, Fable, effort high)
- Resume `driftbound-backstories-fillers-canon-wf_d0e60592-884` (same scriptPath pattern, run id `wf_d0e60592-884`): dossiers, fillers and proposals replay from cache; the register and the four sweeps run live. Before resuming, add `docs/manga/WRITER_HANDOFFS.md` to the register prompt's reading list and the decisions from the cards above as fixed facts.
- Then one fixer per sweep report (4 agents) that applies only the "breaks a hard rule" and "contradicts canon" items, smallest fixes, and reruns the checker.
- **Done when:** `CANON.md` exists with a "Conflicts for Dylan" section, the four reports exist, and the fixers' diffs are listed for Dylan.

## Phase 3: More script, if usage remains (any size; 2 agents per script)
In order of value: Episodes 21 to 30 (adapting Issues 21 to 30, same ANIME_FORMAT); Issues 52 to 54 (the chosen fillers); Issues 49 onward of the main run only after Dylan extends the outline in the bible (writers never invent past their beats). Each script is one write agent plus one audit agent, about 10 to 13 minutes a pair, 10 at a time.

## Phase 4: The site (Claude, no agents needed)
- Add the anime scripts to the site behind the gate: a `anime/index.html` list and a reader for the Markdown (or keep them repo-only until there's video). Dylan's call.
- Put the new homepage section and nav link in front of Dylan on the free link (branch `manga/series-1` would need Pages pointed at it, or merge to `site/step-3-homepage`).
- Commit in chunks (bible and formats; issues 1 to 24; 25 to 51; episodes; dossiers; site) so each is reviewable. Push only on Dylan's yes.

## Play-check for Dylan now (no usage needed)
1. Run the local server and open the shelf: `node tools/static-server.js 8787` then `http://localhost:8787/manga/` on the phone (same wifi: use the computer's address instead of localhost).
2. Tap a book, Read, turn pages by tapping the left side or swiping; flip reading direction in the settings; tap the middle of a panel for the zoomed art note.
3. Read Issue 1 and Episode 1 side by side (`anime/episodes/ep-01.md`) and say whether the voice is right before Friday's audits run.

## Starter prompt for the Friday chat
**Model:** Opus 5.5, effort **High** (it runs workflows and makes judgment calls across 70 files). **Cheaper option:** Sonnet 5.5 at Medium could run the resume commands and the checker, but it would judge the audit conflicts worse and it can't pick the register's answers; it could still do Phase 1 alone. The agents inside the workflows run on **Fable 5.1** as Dylan chose today. **New chat.** Attach nothing; everything is in the worktree.

```
Continue the Driftbound manga and anime build in C:\Users\Dylan\Documents\driftbound-manga (branch manga/series-1, uncommitted). Read docs/manga/FRIDAY_PLAN.md first, then docs/manga/WRITER_HANDOFFS.md, and ask me the six decisions at the top of the plan as cards before running anything. Then run Phase 1 and Phase 2 of the plan as Fable workflows (resume the run ids in the plan so finished agents replay from cache), fix the five part-written issues by reading what exists rather than rewriting, and report real checker and smoke-test output after each phase. Stop after each phase for my check. Commit nothing until I say.
```
