# Decisions log

## Your words (2026-10-30)
- Request: "create a game collection website like miniclip.com, coffeebreak.com, addictinggames.com or newgrounds.com. The only thing is all of the games need to be made to be connected using the same characters/universe in all of the games. It should be anime style. I want you to make all of the calls on everything. You will set up the orchestrator for this project and have as many parallel workers running needed to get this done. We will be using our last usage every week to do this."
- Usage at start: "Ive got 10% or so usage"
- Where it lives: **GitHub repo**
- Weekly run: **I start it myself**
- Week 1 scope: **World, site, 1 game**
- Art: **Drawn in code**

## Calls Claude made (you delegated these; change any of them)
| Call | Choice | Easy to change? |
|---|---|---|
| Site name | Hoshi Arcade ("hoshi" = star) | Yes, one line in each page title |
| World | A shrine arcade in the town of Hoshimachi; a glitch monster called The Static is eating the games | Medium |
| Cast | Aki (runner, hero), Mochi (fox spirit, mascot), Ren (swordsman), Yuzu (inventor), The Static + Glitchlings (villains) | Medium |
| Shared link between games | One shared Star Shard total; every game adds to it and it unlocks story cards on the homepage | Yes |
| Game 1 | Aki Dash, a one-tap endless runner (works on phone and keyboard) | Yes |
| Tech | Plain HTML + JavaScript, no build step, no add-ons; runs from any static host (GitHub Pages) | Hard later, so chosen early on purpose |
| Workers this week | None. Week 1 had ~10% usage, and workers cost the same as doing it directly. Workers start in week 2, one per game (see ORCHESTRATOR.md) | Yes |
