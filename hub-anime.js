// Anime page: the episode list from shared/anime.js, each linking to the manga issue it adapts. Runs only after the 18+ gate.
DriftGate.whenPassed(function () {
  const list = document.getElementById('ep-list');
  if (!list) return;
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const have = new Set((window.DRIFT_MANGA_CATALOG || []).map(i => i.n));
  list.innerHTML = (window.DRIFT_ANIME || []).map(e => '<li class="ep">' +
    '<span class="ep-num">' + String(e.n).padStart(2, '0') + '</span>' +
    '<div class="ep-info"><h3>' + esc(e.title) + '</h3><p>' + (e.runtime ? 'About ' + esc(e.runtime) + ' · ' : '') + '<span class="tag soon">SCRIPT WRITTEN</span></p></div>' +
    (have.has(e.issue) ? '<a class="ep-read" href="manga/read.html?i=' + e.issue + '">Read issue ' + e.issue + '</a>' : '') +
    '</li>').join('');
});
