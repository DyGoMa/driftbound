# Accounts, online count and high scores: the plan (v1, 2026-11-07)

Dylan: "Add for Friday plan a way for people to log in with a username and password. A way to reset with their email. Way to see number of people online on the website. High scores page to see the high score of each game (daily, weekly monthly and all time). Way to see high score in the games."

Dylan's answers (cards, 2026-11-07): **Supabase, free tier**; **sync the save** (progress, salvage, pals, story cards and the manga reading spot follow a login to other devices; guests keep the browser-only save); **account optional** (everything works as a guest; an account is needed only to post to the boards and sync).

The site stays plain files on GitHub Pages. Supabase gives it the four things it can't do alone: a login with email (and reset emails), a database for saves and scores, a live "who's online" count, and rules that stop one person writing another's data.

## What Dylan does first (about 15 minutes, no code)
1. Make a free Supabase account and a project named Driftbound (region nearest Vancouver). Claude can't sign up for you.
2. In the project: Authentication → Providers → Email on; "Confirm email" on; set the site URL to `https://dygoma.github.io/driftbound/` and add `https://dygoma.github.io/driftbound/account.html` to the redirect list (reset-password links come back there).
3. Copy the project URL and the **anon** key (the public one; it's meant to be in the page) into `shared/config.js`. The **service** key is never put anywhere in the site.
4. Later, when real people sign up: Supabase's built-in email sender is for testing and sends only a few an hour; a free SMTP sender (Resend, Brevo) is set in Authentication → SMTP when the site has users. Noted, not needed on day one.

## The build, in phases (each stops for Dylan's check)

### Phase A1: the database (Claude writes the SQL, Dylan pastes it once)
- `profiles`: one row per user: `id` (the auth user), `username` (3 to 20 letters, digits, underscores, unique, checked against a blocklist of slurs and the crew's own names), `created_at`.
- `saves`: `user_id`, `data` (the same JSON `shared/save.js` keeps in the browser), `updated_at`.
- `scores`: `user_id`, `game` (one of the six ids), `score`, `fair` (true when upgrades were off), `created_at`. One row per run that beats the player's own best for that game, so the table stays small.
- Views for the boards: best score per user per game for today, this week, this month and all time (`date_trunc` on `created_at`, in Pacific time).
- `presence`: nothing stored; Supabase Realtime presence counts the open tabs on the site.
- Row rules (RLS): anyone can read profiles' usernames and scores; a user can write only their own profile, save and scores. Scores go in through a database function that refuses anything outside each game's possible range (`tuning.js` max per stage times stages), which blunts the easiest cheating. A score posted from a browser can never be fully trusted; the boards say "as reported by players' browsers" in small type.
- **Done when:** the SQL runs clean, and a test user can sign up, write a save, post a score and read the boards from the Supabase dashboard.

### Phase A2: `shared/account.js` and `account.html` (the login)
- The Supabase JS client loaded from a pinned CDN version (one script tag; no build step, as the rest of the site).
- `account.html`: Sign up (username, email, password; the 18+ gate still comes first on every page), Log in, Forgot password (sends the reset email), Reset form (reached from the email link), Profile (change username, log out). Plain forms in the site's look; phone first.
- The top bar on every page: "Log in" or the username, and the online count ("12 aboard").
- Guests: nothing changes for them.
- **Done when:** sign up, log in, reset by email and log out all work on a phone against the real project, and a wrong password shows a plain message.

### Phase A3: save sync (`shared/save.js` grows, nothing else moves)
- On log in: if the cloud has no save, the browser's save goes up. If both exist, they merge: lifetime salvage and salvage take the larger; pals, story cards and game stage progress take the union; upgrades take the higher level; best scores take the higher; the manga reading spot takes the newer. The merged save is written both places. After that, every change writes to the browser at once and to the cloud a few seconds later (so games never wait on the network).
- Offline or logged out: exactly today's behaviour.
- **Done when:** `node tools/test-save.js` still passes, and a save made on the phone shows on the computer after log in.

### Phase A4: `scores.html` (the high scores page) and the nav
- New top-level page **Scores** (the nav becomes Games, Crew, Story, Manga, Anime, Scores, Book; check the seven links still fit at 320 px, else Scores moves under Games as a tab).
- One board per game; tabs Today, This week, This month, All time; a Fair-run switch (no upgrades) because the kit already records a fair best. Shows rank, username, score, date; your own row highlighted; top 50.
- Guests see the boards; a "Log in to post your score" line replaces the post button.
- **Done when:** the page reads the views, tabs switch without reloading, and the smoke test reports no sideways scroll at 375 px.

### Phase A5: scores inside the games (`shared/kit/ui.js`, one place for all six)
- The title screen already shows "Your best". It gains "Top today" and "All time" (username and score) read once at load; the results screen gains "Post score" (logged in, and only if it beats the player's own posted best) and shows where the run ranks ("8th today").
- Games keep working with no network: the lines just stay empty.
- **Done when:** `node tools/smoke.js <game>` passes for all six with the network blocked and with it allowed.

### Phase A6: online count
- Each open page joins one Realtime presence channel after the gate; the count of members shows in the top bar and on the home page ("12 aboard the Drift right now"). Leaves on close. Rounded wording below 5 ("a few aboard") so one visitor doesn't feel watched.
- **Done when:** two browsers show 2, closing one shows 1 within a few seconds.

## Hard rules that still apply
- The 18+ gate comes before the login and before any content; an account doesn't verify age, it only stores a tick-box answer and the date.
- Usernames are public; emails are never shown anywhere on the site.
- No passwords, keys or emails in the repo except the public anon key.
- Dylan's rule: nothing goes outward (push, publish) without his yes; the Supabase project is Dylan's account and Claude never changes its settings without asking.

## Calls Claude made (change any)
Supabase over Firebase (login, reset emails, database rules and presence in one free service; plain JS client; no server). Usernames 3 to 20 characters. Score posting through a range-checked function. "Newest wins, unions for collections" merge rule. Top 50 per board. Pacific time for the daily and weekly cut. Seven nav links with a fallback.

## Cost
Free tier. The limits that matter are the number of monthly users and database size; both are far above a small site's needs. Check Supabase's pricing page before launch day for the current numbers; nothing in this plan spends money.

## Size
About 6 Claude sessions of work (one per phase), Sonnet 5.5 at Medium for A2, A4, A5, A6 (clear specs), Opus 5.5 at High for A1 and A3 (data rules and the merge, where mistakes lose saves). No agents needed; each phase is one chat with the files it names.
