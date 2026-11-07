// Driftbound shared save: one Salvage total across every game.
// Lives in this browser only (localStorage). Every read/write is guarded so private windows still work:
// if storage is blocked, progress lasts for this page (kept in memory).
// Fresh start (Dylan 2026-11-05): the old 'hoshi-arcade-save-v1' is never read, changed or removed.
// Upgrades in place: an older 'driftbound-save-v1' keeps every field, and its lifetime salvage starts at its current total.
(function () {
  const KEY = 'driftbound-save-v1';
  let memory = null; // Only set after a write fails.

  const count = v => (typeof v === 'number' && isFinite(v) && v > 0 ? v : 0);
  const whole = v => Math.floor(count(v));

  function blank() { return { version: 2, salvage: 0, lifetime: 0, games: {}, pals: [], settings: {} }; }
  function blankGame() { return { best: 0, plays: 0, salvage: 0, fairBest: 0, cleared: 0, finished: false, fair: false, upgrades: {} }; }

  // Brings any readable save up to date. Unknown fields are kept, so nothing is ever lost.
  function upgrade(d) {
    d.version = 2;
    d.salvage = count(d.salvage);
    d.lifetime = typeof d.lifetime === 'number' && isFinite(d.lifetime) ? Math.max(d.lifetime, d.salvage) : d.salvage;
    d.pals = Array.isArray(d.pals) ? d.pals.filter(p => typeof p === 'string') : [];
    if (!d.settings || typeof d.settings !== 'object') d.settings = {};
    for (const id of Object.keys(d.games)) d.games[id] = fixGame(d.games[id]);
    return d;
  }
  function fixGame(g) {
    const o = Object.assign(blankGame(), g && typeof g === 'object' ? g : {});
    o.best = count(o.best); o.plays = count(o.plays); o.salvage = count(o.salvage);
    o.fairBest = count(o.fairBest); o.cleared = whole(o.cleared);
    o.finished = !!o.finished; o.fair = !!o.fair;
    if (!o.upgrades || typeof o.upgrades !== 'object') o.upgrades = {};
    return o;
  }

  function load() {
    if (memory) return JSON.parse(memory);
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return blank(); }
    if (raw === null) return blank();
    try {
      const d = JSON.parse(raw);
      if (d && typeof d === 'object' && typeof d.salvage === 'number' && d.games && typeof d.games === 'object') return upgrade(d);
    } catch (e) { /* unreadable: handled below */ }
    // Damaged. Keep a copy once, in case it can be repaired by hand, before the next write replaces it.
    try { if (localStorage.getItem(KEY + '-damaged') === null) localStorage.setItem(KEY + '-damaged', raw); } catch (e) { /* blocked */ }
    return blank();
  }
  function store(d) {
    const text = JSON.stringify(d);
    try { localStorage.setItem(KEY, text); memory = null; } catch (e) { memory = text; /* storage blocked: progress lasts this visit only */ }
  }
  function gameOf(d, id) { return d.games[id] || (d.games[id] = blankGame()); }

  // Call once at the end of every run. Returns the updated record for that game.
  // opts.fair: this run used no upgrades, so it also counts for the fair best.
  // opts.sameRun: an attempt already counted, saved again with what it has earned since (not another play).
  function finishRun(gameId, score, salvage, opts) {
    const d = load(), g = gameOf(d, gameId), s = count(score), earned = count(salvage);
    if (!(opts && opts.sameRun)) g.plays += 1;
    g.salvage += earned; d.salvage += earned; d.lifetime += earned;
    const newBest = s > g.best; if (newBest) g.best = s;
    const fair = !!(opts && opts.fair), newFairBest = fair && s > g.fairBest; if (newFairBest) g.fairBest = s;
    store(d);
    return { best: g.best, newBest, fairBest: g.fairBest, newFairBest, total: d.salvage, lifetime: d.lifetime };
  }

  // Spending lowers the balance only. Lifetime salvage (which unlocks story cards) never goes down.
  function spend(amount) {
    const d = load();
    if (!(typeof amount === 'number' && isFinite(amount) && amount >= 0) || amount > d.salvage) return false;
    d.salvage -= amount; store(d);
    return true;
  }

  function game(gameId) { return load().games[gameId] || blankGame(); }

  // Stage progress. cleared = how many stages are beaten, in order; the next one to play is that number.
  function clearStage(gameId, index) {
    const d = load(), g = gameOf(d, gameId);
    g.cleared = Math.max(g.cleared, whole(index) + 1); store(d);
    return g.cleared;
  }
  function finishStory(gameId) { const d = load(); gameOf(d, gameId).finished = true; store(d); }

  // What the story run in progress carries between stages (the kit's run.carry). Plain data; null when there is nothing to carry.
  function storyCarry(gameId) { const v = game(gameId).carry; return v && typeof v === 'object' && Object.keys(v).length ? v : null; }
  function setStoryCarry(gameId, carry) {
    const d = load(), g = gameOf(d, gameId);
    if (carry && Object.keys(carry).length) g.carry = carry; else delete g.carry;
    store(d);
  }
  function setFair(gameId, on) { const d = load(); gameOf(d, gameId).fair = !!on; store(d); }

  function upgradeLevel(gameId, upId) { return whole(game(gameId).upgrades[upId]); }
  function buyUpgrade(gameId, upId, price, maxLevel) {
    const d = load(), g = gameOf(d, gameId), level = whole(g.upgrades[upId]), cap = maxLevel === undefined ? 3 : maxLevel;
    if (level >= cap || !(typeof price === 'number' && isFinite(price) && price >= 0) || price > d.salvage) return { ok: false, level, total: d.salvage };
    d.salvage -= price; g.upgrades[upId] = level + 1; store(d);
    return { ok: true, level: level + 1, total: d.salvage };
  }

  // Pals: caught once only. Returns true the first time.
  function hasPal(palId) { return load().pals.includes(palId); }
  function catchPal(palId) {
    const d = load();
    if (typeof palId !== 'string' || d.pals.includes(palId)) return false;
    d.pals.push(palId); store(d);
    return true;
  }

  function getSetting(name, fallback) { const v = load().settings[name]; return v === undefined ? fallback : v; }
  function setSetting(name, value) { const d = load(); d.settings[name] = value; store(d); }

  window.DriftSave = { load, finishRun, spend, game, clearStage, finishStory, storyCarry, setStoryCarry, setFair, upgradeLevel, buyUpgrade, hasPal, catchPal, getSetting, setSetting };
})();
