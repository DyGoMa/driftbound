// Shared header, nav and footer for every top-level page (Dylan 2026-11-07: "each section as its own page not one long page").
// A page marks itself with <body data-page="games"> and leaves <div id="site-header"></div> and <div id="site-footer"></div> in its template.
// Runs only after the 18+ gate, like everything else.
(function () {
  const PAGES = [
    ['games.html', 'games', 'Games'], ['crew.html', 'crew', 'Crew'], ['story.html', 'story', 'Story'],
    ['manga/index.html', 'manga', 'Manga'], ['anime.html', 'anime', 'Anime'], ['book.html', 'book', 'Book'],
  ];
  function render() {
    const here = document.body.dataset.page || 'home';
    const slot = document.getElementById('site-header');
    if (slot) slot.outerHTML = `<header class="topbar"><div class="topbar-row"><a class="logo" href="index.html">DRIFTBOUND</a><div class="salvage">Salvage <b id="total">0</b></div></div>
      <div class="nav-wrap"><nav class="nav" aria-label="Sections">${PAGES.map(p => `<a href="${p[0]}"${p[1] === here ? ' class="on" aria-current="page"' : ''}>${p[2]}</a>`).join('')}</nav></div></header>`;
    const foot = document.getElementById('site-footer');
    if (foot) foot.outerHTML = '<footer>Driftbound · adults only · original characters · progress is saved in this browser</footer>';
    salvage();
    addEventListener('pageshow', e => { if (e.persisted) salvage(); });   // Back from a game can restore the page without running it again
  }
  function salvage() { const b = document.getElementById('total'); if (b && window.DriftSave) b.textContent = Math.floor(DriftSave.load().salvage); }
  DriftGate.whenPassed(render);
})();
