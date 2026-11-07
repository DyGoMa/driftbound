// Home page: the six section cards with live counts from the save and the catalogs. Runs only after the 18+ gate.
DriftGate.whenPassed(function () {
  fillHome();
  addEventListener('pageshow', e => { if (e.persisted) fillHome(); });
});
function fillHome() {
  const box = document.getElementById('hub-cards');
  if (!box) return;
  const save = DriftSave.load();
  const live = DRIFT_GAMES.filter(g => g.live).length;
  const open = DRIFT_STORIES.filter(s => save.lifetime >= s.at).length;
  const caught = DRIFT_PALS.list.filter(p => save.pals.includes(p.id)).length;
  const issues = window.DRIFT_MANGA_CATALOG || [], main = issues.filter(i => i.arc !== 'filler').length, side = issues.length - main;
  const eps = (window.DRIFT_ANIME || []).length;
  let read = 0;
  try { const m = JSON.parse(localStorage.getItem('driftbound-manga-v1') || '{}'); read = Object.keys(m.progress || {}).length; } catch (e) { /* storage blocked: show none opened */ }
  const selaPic = (DRIFT_CREW.find(c => c.id === 'sela') || {}).pic || 'sela-v2';
  const cards = [
    ['games.html', 'games', 'GAMES', live + ' islands to play', 'Six short games, one for each lead and their partner. Salvage from any of them counts everywhere.', 'art/site/pinhold-v1-web.webp'],
    ['crew.html', 'crew', 'THE CREW', 'Six leads, six partners', 'Who sails the Gullwake, what each one borrows from their monster, and what it costs them.', 'art/site/crew/' + selaPic + '.webp'],
    ['story.html', 'story', 'STORY CARDS', open + ' of ' + DRIFT_STORIES.length + ' open', 'Short pieces in the crew\'s own words. Salvage opens them; spending never closes one.', 'art/site/gaptooth-v1-web.webp'],
    ['manga/index.html', 'manga', 'MANGA', main + ' issues' + (side ? ' and ' + side + ' side stories' : '') + (read ? ' · ' + read + ' opened' : ''), 'The crew\'s story as a weekly manga, on a shelf, read page by page. Some issues will play as visual novels later.', 'art/site/lanternreach-v1-web.webp'],
    ['anime.html', 'anime', 'ANIME', eps + ' episodes scripted', 'Short episodes, one per issue. The scripts are written; the pictures and video come next.', 'art/site/ashmarket-v1-web.webp'],
    ['book.html', 'book', 'MONSTER BOOK', caught + ' of ' + DRIFT_PALS.list.length + ' pals found', 'Every game hides two pals. Catch one and it stays here for good.', 'art/site/glassward-v1-web.webp'],
  ];
  box.innerHTML = cards.map(c => '<a class="hub-card hub-' + c[1] + '" href="' + c[0] + '">' +
    '<img class="hub-art" src="' + c[5] + '" width="600" height="300" loading="lazy" alt="" onerror="this.onerror=null;this.src=\'art/site/dusk-islands.svg\'">' +
    '<div class="hub-info"><h2>' + c[2] + '</h2><p class="hub-count">' + c[3] + '</p><p>' + c[4] + '</p></div></a>').join('');
}
