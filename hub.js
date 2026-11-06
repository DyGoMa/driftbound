// Homepage: fills in the save numbers, the crew cards and the Monster book. Runs only after the 18+ gate.
DriftGate.whenPassed(function () {
  const save = DriftSave.load(), slots = DRIFT_CONFIG.monsterBookSlots;

  document.getElementById('total').textContent = save.salvage;

  const run = save.games['storm-run'];
  if (run) document.getElementById('best').textContent = 'Your best: ' + run.best;

  document.getElementById('crew').innerHTML = DRIFT_CREW.map(c => `
    <article class="crew-card" style="--c1:${c.colour};--c2:${c.colour2}">
      <div class="crew-art"><img src="art/site/crew/${c.id}-v2.webp" width="720" height="720" loading="lazy" alt="Portrait of ${c.name}"></div>
      <div class="crew-info">
        <h3>${c.name}</h3>
        <p class="crew-role">${c.role} · ${c.age}</p>
        <p class="crew-line">${c.line}</p>
        <p class="crew-partner">Partner: ${c.partner}</p>
      </div>
    </article>`).join('');

  document.getElementById('book-count').textContent = save.pals.length + ' of ' + slots + ' found';
  document.getElementById('book-grid').innerHTML = Array.from({ length: slots }, () => '<div class="pal" aria-hidden="true"><span>?</span></div>').join('');
});
