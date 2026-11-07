// Kit ui: title, upgrades, stage select, pause, results and ending. Plain page elements over the canvas, so text wraps and tap targets are real.
// Every screen's main action carries data-primary (the test presses it, and so does Enter). game.js owns the flow and passes callbacks in.
(function () {
  const UI = Kit.ui, esc = UI.esc;
  const on = (s, sel, fn) => { const b = s.querySelector(sel); if (b) b.addEventListener('click', fn); return b; };
  const soundLabel = () => (Kit.audio.isMuted() ? 'Sound: off' : 'Sound: on');
  function soundButton(s) {
    on(s, '[data-kit="sound"]', e => {
      Kit.audio.setMuted(!Kit.audio.isMuted());
      e.currentTarget.textContent = soundLabel();
      Kit.audio.play('tap');
    });
  }

  // h: { story, endless, upgrades, fairChanged }
  UI.title = function (def, h) {
    const save = DriftSave.load(), g = DriftSave.game(def.id);
    const pals = window.DRIFT_PALS ? DRIFT_PALS.byGame(def.id) : [];
    const palsGot = pals.filter(p => save.pals.includes(p.id)).length;
    const endless = def.endless !== false;
    const s = UI.show('title', `<div class="kit-title-in">
      <div>
        <div class="kit-island">${esc(def.island || '')}</div>
        <h1 class="kit-name">${esc(def.title)}</h1>
        <p class="kit-tagline">${esc(def.tagline || '')}</p>
        <div class="kit-stats">
          <span>Salvage <b data-kit="salvage">${Math.floor(save.salvage)}</b></span>
          <span>Best <b data-kit="best">${Math.floor(g.best)}</b></span>
          <span>Fair best <b data-kit="fair-best">${Math.floor(g.fairBest)}</b></span>
          ${pals.length ? `<span>Pals <b>${palsGot} of ${pals.length}</b></span>` : ''}
        </div>
      </div>
      <div class="kit-menu">
        <button type="button" class="kit-btn main wide" data-kit="story" data-primary>${g.cleared ? 'Story: carry on' : 'Story'}</button>
        ${endless ? `<button type="button" class="kit-btn wide" data-kit="endless" ${g.finished ? '' : 'disabled'}>${g.finished ? 'Endless' : 'Endless: finish the story first'}</button>` : ''}
        <button type="button" class="kit-btn" data-kit="upgrades">Upgrades</button>
        <button type="button" class="kit-btn" data-kit="fair" role="switch" aria-checked="${g.fair}">No upgrades: ${g.fair ? 'on' : 'off'}</button>
        <button type="button" class="kit-btn" data-kit="sound">${soundLabel()}</button>
        <a class="kit-btn" data-kit="back" href="${Kit.url('index.html')}">Back to Driftbound</a>
      </div>
    </div>`, 'kit-title');
    // def.titleArt: a picture behind the title, relative to the game's page. If it fails, the canvas sky shows through.
    if (def.titleArt) s.style.backgroundImage = `linear-gradient(90deg, rgba(12, 16, 38, .88), rgba(12, 16, 38, .25)), url("${def.titleArt}")`, s.style.backgroundSize = 'cover', s.style.backgroundPosition = 'center';
    on(s, '[data-kit="story"]', () => { Kit.audio.play('tap'); h.story(); });
    on(s, '[data-kit="endless"]', () => { Kit.audio.play('tap'); h.endless(); });
    on(s, '[data-kit="upgrades"]', () => { Kit.audio.play('tap'); h.upgrades(); });
    on(s, '[data-kit="fair"]', e => {
      const v = !DriftSave.game(def.id).fair;
      DriftSave.setFair(def.id, v);
      e.currentTarget.textContent = 'No upgrades: ' + (v ? 'on' : 'off');
      e.currentTarget.setAttribute('aria-checked', v);
      Kit.audio.play('tap');
    });
    soundButton(s);
  };

  UI.upgrades = function (def, back) {
    const prices = DRIFT_CONFIG.upgradePrices;
    function paint() {
      const save = DriftSave.load(), g = DriftSave.game(def.id);
      const rows = (def.upgrades || []).map(u => {
        const lvl = DriftSave.upgradeLevel(def.id, u.id), list = u.prices || prices, price = list[lvl], maxed = lvl >= list.length;
        const pips = list.map((_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
        return `<div class="kit-up">
          <div><h3>${esc(u.name)}<span class="kit-pips" aria-label="Level ${lvl} of ${list.length}">${pips}</span></h3><p>${esc(u.blurb || '')}</p></div>
          <button type="button" class="kit-btn" data-up="${esc(u.id)}" ${maxed || price > save.salvage ? 'disabled' : ''}>${maxed ? 'Full' : 'Buy ' + price}</button>
        </div>`;
      }).join('');
      const s = UI.show('upgrades', `<div class="kit-center">
        <h2 class="kit-head">UPGRADES</h2>
        <p class="kit-sub">Salvage to spend: <b data-kit="salvage" style="color:var(--gold)">${Math.floor(save.salvage)}</b></p>
        ${g.fair ? '<div class="kit-note">The No-upgrades switch is on, so these rest until you turn it off.</div>' : ''}
        ${rows}
        <button type="button" class="kit-btn main" data-kit="back" data-primary>Back</button></div>`);
      s.querySelectorAll('[data-up]').forEach(b => b.addEventListener('click', () => {
        const u = def.upgrades.find(x => x.id === b.dataset.up), list = u.prices || prices, lvl = DriftSave.upgradeLevel(def.id, u.id);
        const r = DriftSave.buyUpgrade(def.id, u.id, list[lvl], list.length);
        Kit.audio.play(r.ok ? 'buy' : 'denied');
        paint();
      }));
      on(s, '[data-kit="back"]', () => { Kit.audio.play('back'); back(); });
    }
    paint();
  };

  // A stage can carry set: 'Set 1' for a heading. Long lists become a tight grid of numbers.
  UI.stages = function (def, pick, back, ending, carrying) {
    const g = DriftSave.game(def.id), n = def.stages.length, many = n > 8;
    const next = g.finished ? -1 : Math.min(g.cleared, n - 1);   // once the story is done, the main button is its ending
    let lastSet = null;
    const btns = def.stages.map((st, i) => {
      const open = i <= g.cleared, done = i < g.cleared;
      const head = st.set && st.set !== lastSet ? `<div class="kit-set">${esc(st.set)}</div>` : '';
      lastSet = st.set || lastSet;
      const label = many ? (st.boss ? 'BOSS' : String(i + 1)) : `${i + 1}. ${esc(st.name || 'Stage ' + (i + 1))}`;
      return `${head}<button type="button" class="kit-btn ${i === next ? 'main' : ''} ${st.boss ? 'kit-boss-row' : ''}" data-stage="${i}" ${i === next ? 'data-primary' : ''} ${open ? '' : 'disabled'}>
        <span class="${st.boss ? 'kit-boss' : ''}">${label}</span>${done ? '<span class="kit-done" aria-label="cleared">✓</span>' : ''}</button>`;
    }).join('');
    const s = UI.show('stages', `<div class="kit-center" style="max-width:720px">
      <h2 class="kit-head">STORY</h2>
      ${carrying ? '<p class="kit-sub">What this run has cost you stays with you. Only stage 1 starts a new run.</p>' : ''}
      <div class="kit-stages ${many ? 'many' : ''} ${many && def.stageRows ? 'rows' : ''}">${btns}</div>
      ${g.finished ? '<button type="button" class="kit-btn main" data-kit="see-ending" data-primary>See how it ends</button>' : ''}
      <button type="button" class="kit-btn kit-back" data-kit="back">Back</button></div>`);
    s.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => { Kit.audio.play('tap'); pick(+b.dataset.stage); }));
    on(s, '[data-kit="see-ending"]', () => { Kit.audio.play('tap'); ending(); });
    on(s, '[data-kit="back"]', () => { Kit.audio.play('back'); back(); });
  };

  UI.pauseButton = function (show, onTap) {
    const hud = document.getElementById('kit-hud');
    let b = document.getElementById('kit-pause');
    if (!show) { if (b) b.remove(); return; }
    if (b) return;
    b = document.createElement('button');
    b.id = 'kit-pause'; b.type = 'button'; b.className = 'kit-pause'; b.setAttribute('aria-label', 'Pause'); b.dataset.kit = 'pause';
    b.textContent = 'II';
    b.addEventListener('click', () => { b.blur(); onTap(); });   // no focus left behind, or Enter would press it again
    hud.appendChild(b);
  };

  // h: { resume, restart, quit }
  UI.pauseMenu = function (h) {
    const s = UI.show('paused', `<div class="kit-center" style="max-width:360px">
      <h2 class="kit-head">PAUSED</h2>
      <button type="button" class="kit-btn main" data-kit="resume" data-primary>Back to it</button>
      <button type="button" class="kit-btn" data-kit="restart">Restart this stage</button>
      <button type="button" class="kit-btn" data-kit="sound">${soundLabel()}</button>
      <button type="button" class="kit-btn" data-kit="quit">Quit to menu</button></div>`);
    on(s, '[data-kit="resume"]', () => { Kit.audio.play('tap'); h.resume(); });
    on(s, '[data-kit="restart"]', () => { Kit.audio.play('tap'); h.restart(); });
    on(s, '[data-kit="quit"]', () => { Kit.audio.play('back'); h.quit(); });
    soundButton(s);
  };

  // r: { won, endless, last, score, earned, rec, line, fair }; h: { next, retry, menu, stages }
  UI.result = function (r, h) {
    const title = r.endless ? 'RUN OVER' : r.won ? (r.boss ? 'BOSS DOWN' : 'STAGE CLEAR') : 'DOWN';
    const primary = r.endless ? 'Run again' : r.won ? (r.last ? 'See how it ends' : 'Next stage') : 'Try again';
    const newBest = r.rec.newBest ? 'New best!' : r.rec.newFairBest ? 'New fair best!' : '';
    const s = UI.show('result', `<div class="kit-center">
      <h2 class="kit-head">${title}</h2>
      ${r.line ? `<div class="kit-box" style="--c1:${Kit.speakerColour(r.line.who)}"><div><div class="kit-who">${esc(Kit.speakerName(r.line.who))}</div><p class="kit-line">${esc(r.line.text)}</p></div></div>` : ''}
      <div class="kit-numbers">
        <div>Score<b data-kit="score">${Math.floor(r.score)}</b></div>
        <div>Salvage<b data-kit="earned">+${Math.floor(r.earned)}</b></div>
        <div>Total<b>${Math.floor(r.rec.total)}</b></div>
        <div>Best<b>${Math.floor(r.rec.best)}</b></div>
        ${r.fair ? `<div>Fair best<b>${Math.floor(r.rec.fairBest)}</b></div>` : ''}
      </div>
      ${newBest ? `<div class="kit-new">${newBest}</div>` : ''}
      <div class="kit-row">
        <button type="button" class="kit-btn main" data-kit="primary" data-primary>${primary}</button>
        <button type="button" class="kit-btn" data-kit="menu">Menu</button>
      </div></div>`);
    if (r.line) s.querySelector('.kit-box').prepend(Kit.portraitEl(r.line.who));
    UI.tapGuard(s);
    on(s, '[data-kit="primary"]', () => { Kit.audio.play('tap'); (r.endless || !r.won ? h.retry : h.next)(); });
    on(s, '[data-kit="menu"]', () => { Kit.audio.play('back'); h.menu(); });
  };

  // card: { title, text }. Shown after the ending talk.
  UI.ending = function (def, unlockedNow, done) {
    const card = def.endingCard || {};
    const s = UI.show('ending', `<div class="kit-center">
      <h2 class="kit-head">${esc(card.title || 'THE END, FOR NOW')}</h2>
      ${card.text ? `<p>${esc(card.text)}</p>` : ''}
      ${def.endless !== false ? `<p class="kit-unlock">${unlockedNow ? 'Endless is open now.' : 'Endless is open.'}</p>` : ''}
      <button type="button" class="kit-btn main" data-kit="done" data-primary>Back to the menu</button></div>`);
    on(s, '[data-kit="done"]', () => { Kit.audio.play('tap'); done(); });
  };

  // Enter or Space presses the main button on any screen, unless a button already has keyboard focus.
  addEventListener('keydown', e => {
    if ((Kit.active && !Kit.paused) || e.repeat || (e.code !== 'Enter' && e.code !== 'Space')) return;
    const el = document.getElementById('kit-ui');
    if (!el) return;
    const act = document.activeElement;
    if (act && (act.tagName === 'BUTTON' || act.tagName === 'A')) return;
    const b = el.querySelector('[data-primary]');
    // Stop here, so a key that starts a stage can't also count as a press in it (input.js listens after this).
    if (b && !b.disabled) { e.preventDefault(); e.stopImmediatePropagation(); b.click(); }
  });
})();
