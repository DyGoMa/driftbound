// Driftbound shared save: one Salvage total across every game.
// Lives in this browser only (localStorage). Every read/write is guarded so private windows still work.
// Fresh start (Dylan 2026-11-05): the old 'hoshi-arcade-save-v1' is never read, changed or removed.
(function () {
  const KEY = 'driftbound-save-v1';
  function blank() { return { salvage: 0, games: {}, pals: [] }; } // pals: empty until pals are designed
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return d && typeof d.salvage === 'number' && d.games && typeof d.games === 'object' ? d : blank();
    } catch (e) { return blank(); }
  }
  function store(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* storage blocked: progress lasts this visit only */ } }

  // Call once at the end of every run. Returns the updated record for that game.
  function finishRun(gameId, score, salvage) {
    const d = load();
    const g = d.games[gameId] || (d.games[gameId] = { best: 0, plays: 0, salvage: 0 });
    g.plays += 1; g.salvage += salvage; d.salvage += salvage;
    const newBest = score > g.best; if (newBest) g.best = score;
    store(d);
    return { best: g.best, newBest, total: d.salvage };
  }
  window.DriftSave = { load, finishRun };
})();
