# The plan for Friday 2026-11-13 (v2, written 2026-11-07)

Dylan: "put it in for a plan for friday so i can use it to use up the last of my usage"; then on 2026-11-07: merge to main, check consistency across main + games + pals + anime + manga, manga instead of visual novel, videos called anime, each section its own page, an image list for the week, accounts with login and email reset, an online count, high scores (daily, weekly, monthly, all time) on a page and inside the games.

Everything is on branch **main** in `C:\Users\Dylan\Documents\driftbound`, committed, **not pushed**. The free link still serves the old branch `site/step-3-homepage` (Phase 6 moves it).

## Where it stands (real numbers, 2026-11-07)
- **Site:** home hub plus Games, Crew, Story, Manga (shelf), Anime (20 episodes listed), Monster Book, each its own page with one shared header. Checked at 375 px: no console errors, no sideways scroll. Not yet seen by Dylan.
- **Manga:** 51 issues, `node tools/manga-check.js`: 51 clean, 1,230 pages, 4,871 panels, 56,005 words. Shelf and reader smoke test passed (50 issues at the time; rerun after fixes).
- **Anime:** 20 episode scripts, 13:00 to 14:40 by their own headers (Ep 14 adds up to about 16:20 by its scene sums).
- **Backstories:** 10 dossiers. **New crew:** 2 proposals, not canon. **Side stories:** Issues 49 to 51.
- **Canon register:** `docs/manga/CANON.md` (11,256 words) with **33 conflicts for Dylan** at the top.
- **Consistency reports** (`docs/manga/consistency/`): games-vs-scripts (45 items: 1 hard, 25 canon, 11 drift, 8 style, plus 13 free-material and 14 omissions), manga-vs-canon (261 items: 4 hard, 61 canon, 136 drift, 60 style), anime-vs-manga (0 hard, 32 canon, 8 drift, 24 format, 32 style), site-and-docs-vs-canon (1 hard, 7 canon, 31 drift, 17 stale).
- **Audits still owed:** Issues 1 to 24 and all 20 episodes were never audited by a second pass (the weekly limit hit on 2026-11-06).
- **Images:** none made for the manga yet. The list: `docs/manga/IMAGE_REQUESTS.md` (ordered batches) and `IMAGE_LIST_GENERATED.md` (51 covers, 129 splash pages, 4,871 panels).
- **Accounts:** planned, not built: `docs/ACCOUNTS_PLAN.md` (Supabase free tier, synced saves, account optional; Dylan's card answers 2026-11-07).

## Decisions for Dylan (the Friday chat asks these as cards before running anything)
1. **Rename "the Ten Count"**: it's a real manga's title. Register's pick: "the Full Count". Touches the bible, Issue 25, the dossiers, the catalog.
2. **Games and the manga timeline.** Every game puts all six crew aboard from the start; the manga adds them one arc at a time, and three game bosses end differently (Hold the Deck kills the bear; Tide Gap hands Hekka the logbooks; Silent Cut burns a ledger Maro has copies of). Pick one: (a) the games are **later missions**, set after Issue 38 when everyone is aboard, and their intros say so in one line (smallest change; recommended); (b) rewrite each game's talk scenes to its arc's crew; (c) the games are their own telling and the site says so.
3. **Vesh is "he" in the games and "she" in the scripts.** Pick one; the loser gets fixed everywhere.
4. **Otti's partner Merrow:** gale-skate (Issue 51, allies dossier) or sea-ox (Issues 33, 40).
5. **The stripped Pinhold farmer** is three different people across Issues 1, 2 and 3 (Tolly Marsh / unnamed / Hob Tarrow). Register's pick: one man, Hob Tarrow, beast Thimble.
6. **Episode walk-ons** don't match their issues (Ep 1, 5, 7, 8, 14). Register's pick: the issues' names win, episodes get fixed.
7. **Galley Rules**: let the register's single numbering stand and fix every issue to it? (Yes is assumed unless you say no.)
8. **"Yolo"** (a partner's name, Issue 26): rename.
9. **Petra Marlowe and Reuben Fell** (new crew): approve, change or drop; if Petra, join at 27 to 28 or 38 to 39.
10. **Side stories 52 to 54:** which of the three premises, if any.
11. **Manga in colour or black-and-white?** Everything else on the site is colour.
12. **Images per day** for the week (the budget line in IMAGE_REQUESTS.md), and whether all of Issue 1 (Batch B) comes before the 50 covers (Batch C).
13. **Lettering:** pictures without text, balloons drawn by the reader (recommended), or text baked in.
14. **Supabase:** Dylan creates the free project before Friday (ACCOUNTS_PLAN.md, "What Dylan does first"), or accounts wait.
15. **Publishing:** after Friday's fixes, push main and point the free link at main?

## Phase 0: before Friday (Dylan, no usage)
- Create the Supabase project and paste the URL and anon key into `shared/config.js` (or decide to wait).
- Set the images-per-day number.
- Read Issue 1 on the shelf and `anime/episodes/ep-01.md` and say whether the voice is right.
- Answer the 15 decisions above, or let the Friday chat ask them.

## Phase 1: apply the register (Opus 5.5 High; 5 agents, then checks)
- Put Dylan's answers into `CANON.md` (v2: conflicts resolved, each with the answer and date) and into `SERIES_BIBLE.md` and `CAST.md` where they change a fact (old lines archived word for word).
- Four fixer agents, one per consistency report, applying only the **hard-rule** and **contradicts-canon** items (not drift or style) with the smallest edits: manga issues, anime episodes, games and shared site data, site and docs. Each reruns its checks: `node tools/manga-check.js --catalog`, `node tools/manga-smoke.js`, `node tools/anime-list.js`, `node tools/smoke.js <game>` for any game touched, `node tools/test-save.js`.
- A fifth agent re-runs the four sweeps on the result and reports what's left (expected: drift and style only).
- **Done when:** checker 51 clean; every smoke test passes; the re-sweep shows zero hard-rule and zero canon items. Stop for Dylan's check.

## Phase 2: the audits that were cut off (Fable; about 44 agents, two at a time per script)
- Issues 1 to 24: one audit agent each (the prompt in the 2026-11-06 workflow `driftbound-anime-and-issues`, run id `wf_db07434a-b3f`, script at `C:\Users\Dylan\.claude\projects\C--Users-Dylan-Documents-hoshi-arcade\7b319a48-abcd-4fb4-a7ba-f017b70e300d\workflows\scripts\driftbound-anime-and-issues-wf_db07434a-b3f.js`); resuming replays the 27 finished writes from cache. Change the five "write" prompts for Issues 16, 21 to 24 to "read the existing file and finish it" first, or they get rewritten.
- Episodes 1 to 20: same resume covers the audits; add the anime report's format items (Ep 14 runtime, Eps 13 and 18 over 3,600 words, Ep 11 dialogue under 1,300, Bram narrating 9 of 19 recaps).
- **Done when:** every audit returned; `WRITER_HANDOFFS.md` holds each audit's unfixed list; checker and smoke tests clean. Stop for Dylan's check.

## Phase 3: accounts, online count, high scores (`docs/ACCOUNTS_PLAN.md`, phases A1 to A6, one chat each)
A1 database (Opus High), A2 login page (Sonnet Medium), A3 save sync (Opus High), A4 scores page (Sonnet Medium), A5 scores in the games (Sonnet Medium), A6 online count (Sonnet Medium). Each has its own "done when" in that file. Needs the Supabase project from Phase 0.

## Phase 4: pictures, through the week (`docs/manga/IMAGE_REQUESTS.md`)
Batch A (sheets the first ten issues need), then B (all of Issue 1) or C (the 50 covers) per decision 12, at the daily number. Each image asks first, is checked against its sheet, and lands in `manga/art/` with its key in `manifest.js`. The reader shows it at once.

## Phase 5: more script, if usage remains (Fable, 2 agents per script)
Episodes 21 to 30; side stories 52 to 54 (decision 10); nothing past Issue 48 until Dylan extends the outline.

## Phase 6: publish (main session only, on Dylan's yes; see memory: helpers can't push)
- `git push origin main`.
- Point the free link at main: `gh api -X PUT repos/DyGoMa/driftbound/pages -f source[branch]=main -f source[path]=/`, then `gh api -X POST repos/DyGoMa/driftbound/pages/builds`.
- Open https://dygoma.github.io/driftbound/ on a phone: gate, home hub, each page, the shelf, Issue 1. Update `docs/TEST_CHECKLIST.md` with what Dylan should try.

## Starter prompt for the Friday chat
**Model:** Opus 5.5, effort **High** (judgment across 100+ files, runs workflows, applies Dylan's answers to the canon). **Cheaper option:** Sonnet 5.5 at Medium could run Phases 2 and 3's clear-spec sub-phases and would do them well; it would make worse calls applying the register in Phase 1, so start with Opus and hand A2, A4, A5, A6 to Sonnet chats. Agents inside the workflows: **Fable 5.1** as Dylan chose. **New chat.** Attach nothing; everything is in the repo.

```
Continue Driftbound in C:\Users\Dylan\Documents\driftbound on branch main (committed, not pushed). Read docs/manga/FRIDAY_PLAN.md first, then docs/manga/CANON.md section 0 and the four reports in docs/manga/consistency/. Ask me the 15 decisions in the plan as cards before running anything, write my answers into CANON.md v2, then run Phase 1 (apply the register with four fixer agents and a re-sweep) and stop for my check. Then Phase 2 (resume the audit workflow by its run id so finished writes replay from cache; fix the five part-written issues by reading what exists). Report real checker and smoke-test output after each phase. Push nothing until I say.
```
