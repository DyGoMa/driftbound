// Homepage: fills in the salvage total, the game cards and the crew cards. Runs only after the 18+ gate.
// Story cards and the Monster book are in hub-book.js.
DriftGate.whenPassed(function () {
  fillFromSave();
  // Back from a game can bring this page out of the browser's memory without running it again, so what the save says goes back in.
  addEventListener('pageshow', e => { if (e.persisted) fillFromSave(); });
  document.getElementById('crew').innerHTML = DRIFT_CREW.map(c => `
    <article class="crew-card" style="--c1:${c.colour};--c2:${c.colour2}">
      <div class="crew-art"><img src="art/site/crew/${crewPic(c.id)}.webp" width="720" height="720" loading="lazy" alt="Portrait of ${c.name}"></div>
      <div class="crew-info">
        <h3>${c.name}</h3>
        <p class="crew-role">${c.role} · ${c.age}</p>
        <p class="crew-line">${c.line}</p>
        <p class="crew-partner">Partner: ${c.partner}</p>
      </div>
    </article>`).join('');
});

// A lead's picture file: their own if they have a newer version (crew.js, pic), otherwise v2.
function crewPic(id) {
  const c = DRIFT_CREW.find(x => x.id === id);
  return (c && c.pic) || id + '-v2';
}

function fillFromSave() {
  const save = DriftSave.load();
  const leads = Object.fromEntries(DRIFT_CREW.map(c => [c.id, c]));

  document.getElementById('total').textContent = Math.floor(save.salvage);

  document.getElementById('game-grid').innerHTML = DRIFT_GAMES.map(g => {
    const rec = save.games[g.id], lead = leads[g.lead];
    const tag = g.live ? '<span class="tag">PLAY</span>' : `<span class="tag soon">${g.status === 'in-the-works' ? 'IN THE WORKS' : 'COMING SOON'}</span>`;
    const best = rec && rec.best ? `<span class="game-best">Your best: ${Math.floor(rec.best)}${rec.fairBest ? ` · fair ${Math.floor(rec.fairBest)}` : ''}</span>` : '';
    const art = g.art || 'art/site/dusk-islands.svg';
    const alt = g.artAlt || `Floating islands at dusk. ${g.island} is still being drawn.`;
    const body = `
      <img class="game-art" src="${art}" width="1200" height="600" loading="lazy" alt="${alt}" onerror="this.onerror=null;this.src='art/site/dusk-islands.svg'">
      <div class="game-info">
        <div class="game-lead"><img src="art/site/crew/${crewPic(g.lead)}.webp" width="48" height="48" loading="lazy" alt=""><span>${g.leadName} and ${g.partner} · ${g.island}</span></div>
        <h3>${g.title}</h3>
        <p>${g.blurb}</p>
        ${tag}${best}
      </div>`;
    const style = lead ? `style="--c1:${lead.colour}"` : '';
    return g.live
      ? `<a class="game-card" ${style} href="games/${g.id}/index.html" data-game="${g.id}">${body}</a>`
      : `<div class="game-card off" ${style} data-game="${g.id}">${body}</div>`;
  }).join('');
}
