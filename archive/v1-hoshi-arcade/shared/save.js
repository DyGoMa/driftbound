// Hoshi Arcade shared save: one Star Shard total across every cabinet.
// Lives in this browser only (localStorage). Every read/write is guarded so private windows still work.
(function () {
  const KEY = 'hoshi-arcade-save-v1';
  function blank() { return { shards: 0, games: {} }; }
  function load() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); return d && typeof d.shards === 'number' ? d : blank(); }
    catch (e) { return blank(); }
  }
  function store(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* storage blocked: progress lasts this visit only */ } }

  // Call once at the end of every run. Returns the updated record for that game.
  function finishRun(gameId, score, shards) {
    const d = load();
    const g = d.games[gameId] || (d.games[gameId] = { best: 0, plays: 0, shards: 0 });
    g.plays += 1; g.shards += shards; d.shards += shards;
    const newBest = score > g.best; if (newBest) g.best = score;
    store(d);
    return { best: g.best, newBest, total: d.shards };
  }
  window.HoshiSave = { load, finishRun };
})();
