// Homepage: story cards (unlock by lifetime salvage) and the Monster book (real pals, mystery slot until caught). Runs only after the 18+ gate.
DriftGate.whenPassed(function () {
  fillBook();
  addEventListener('pageshow', e => { if (e.persisted) fillBook(); });   // Back from a game: see hub.js
});

function fillBook() {
  const save = DriftSave.load();
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const gameTitle = id => { const g = DRIFT_GAMES.find(x => x.id === id); return g ? g.title : ''; };

  // Story cards. A locked card shows only how far off it is. Open ones fold, so the list stays short on a phone.
  const name = who => {
    const c = DRIFT_CREW.find(x => x.id === who);
    return c ? c.name : { vasch: 'Director Vasch', trooper: 'Sever paperwork', hekka: 'Captain Hekka Dorn', silt: 'Silt' }[who] || who;
  };
  const stories = DRIFT_STORIES, open = stories.filter(s => save.lifetime >= s.at).length;
  const wasOpen = [...document.querySelectorAll('.story-card[open]')].map(d => d.dataset.story);   // cards unfolded before a game stay unfolded after Back
  document.getElementById('story-count').textContent = open + ' of ' + stories.length + ' open';
  document.getElementById('story-grid').innerHTML = stories.map(s => (save.lifetime >= s.at
    ? `<details class="story-card" data-story="${s.id}"${wasOpen.includes(s.id) ? ' open' : ''}><summary><b>${esc(s.title)}</b><span>${esc(name(s.who))}</span></summary><p>${esc(s.text)}</p></details>`
    : `<div class="story-card locked" data-story="${s.id}"><b>???</b><span>${Math.ceil(s.at - save.lifetime)} more salvage</span></div>`)).join('');

  // Monster book.
  const pals = DRIFT_PALS.list, caught = pals.filter(p => save.pals.includes(p.id));
  document.getElementById('book-count').textContent = caught.length + ' of ' + pals.length + ' found';
  const grid = document.getElementById('book-grid');
  grid.innerHTML = pals.map(p => (save.pals.includes(p.id)
    ? `<div class="pal caught" data-pal="${p.id}"><canvas width="200" height="200" role="img" aria-label="${esc(p.name)}"></canvas></div>`
    : '<div class="pal" aria-hidden="true"><span>?</span></div>')).join('');
  grid.querySelectorAll('canvas').forEach(cv => DRIFT_PALS.paint(cv, cv.parentNode.dataset.pal));

  document.getElementById('pal-notes').innerHTML = caught.map(p =>
    `<div class="pal-note"><canvas width="120" height="120" data-pal="${p.id}" aria-hidden="true"></canvas><div><h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p><p class="pal-game">Caught in ${esc(gameTitle(p.game))}</p></div></div>`).join('');
  document.querySelectorAll('.pal-note canvas').forEach(cv => DRIFT_PALS.paint(cv, cv.dataset.pal));
}
