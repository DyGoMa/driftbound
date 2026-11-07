// Kit talk: the talk scene before each stage and for endings, the small talk box during play, the catch moment and between-wave choices.
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const UI = Kit.ui = Kit.ui || {};
  UI.esc = esc;

  function panel() { return document.getElementById('kit-ui'); }

  // Screen helper: replaces whatever overlay is showing. name is reported to the test hook as the screen.
  UI.show = function (name, html, cls) {
    const el = panel();
    UI.screen = name;
    el.innerHTML = html === null ? '' : `<div class="kit-screen ${cls || ''}" data-screen="${name}">${html}</div>`;
    return el.firstElementChild;
  };
  // Taps are ignored just after a screen appears, so a player still tapping at the game can't dismiss it unseen. Keys go through click, so they wait too.
  const TAP_GUARD_MS = 450;   // PROVISIONAL (the gate uses 500)
  UI.tapGuard = function (s) {
    const until = performance.now() + TAP_GUARD_MS;
    s.classList.add('kit-wait');
    s.addEventListener('click', e => { if (performance.now() < until) { e.stopPropagation(); e.preventDefault(); } }, true);
    setTimeout(() => s.classList.remove('kit-wait'), TAP_GUARD_MS);
  };
  UI.clear = function (name) { panel().innerHTML = ''; UI.screen = name || 'play'; };

  // lines: [{ who: 'sela', text: '...' }]. done runs after the last line or Skip. An empty list goes straight to done.
  UI.talk = function (lines, done, screen) {
    const list = (lines || []).filter(l => l && l.text);
    if (!list.length) { done(); return; }
    let i = 0;
    const s = UI.show(screen || 'talk', `
      <div class="kit-box"></div>
      <div class="kit-talk-tools"><span>Tap to go on</span><button type="button" class="kit-skip" data-kit="skip">Skip</button></div>
      <button type="button" data-primary data-kit="talk-next" hidden></button>`, 'kit-talk');
    const box = s.querySelector('.kit-box');
    function paint() {
      const l = list[i];
      box.style.setProperty('--c1', Kit.speakerColour(l.who));
      box.innerHTML = `<div><div class="kit-who">${esc(Kit.speakerName(l.who))}</div><p class="kit-line">${esc(l.text)}</p></div>`;
      box.prepend(Kit.portraitEl(l.who));
    }
    function next() {
      Kit.audio.play('tap');
      i++;
      if (i >= list.length) done(); else paint();
    }
    s.addEventListener('click', e => {
      if (e.target.closest('[data-kit="skip"]')) { Kit.audio.play('back'); done(); return; }
      next();
    });
    paint();
  };

  // The small talk box during play. Time runs in game steps so raised test speed changes nothing.
  let sayT = 0, sayEl = null;
  // at: 'top', 'bottom', or 'corner' (small, bottom right, for a game with its read-outs along the top and a band of ground under the play).
  // Default: top when held sideways, bottom when upright, where danger comes from the top of the screen.
  UI.say = function (who, text, secs, at) {
    const hud = document.getElementById('kit-hud');
    if (!hud) return;
    if (sayEl) sayEl.remove();
    sayEl = document.createElement('div');
    const where = at || (Kit.view.landscape ? 'top' : 'bottom');
    sayEl.className = 'kit-say' + (where === 'top' ? '' : ' at-' + where);
    sayEl.style.setProperty('--c1', Kit.speakerColour(who));
    sayEl.innerHTML = `<div><b>${esc(Kit.speakerName(who))}</b><span>${esc(text)}</span></div>`;
    sayEl.prepend(Kit.portraitEl(who));
    hud.appendChild(sayEl);
    sayT = secs || 2.6;
  };
  UI.sayStep = function (dt) { if (sayEl && (sayT -= dt) <= 0) { sayEl.remove(); sayEl = null; } };
  UI.sayClear = function () { if (sayEl) { sayEl.remove(); sayEl = null; } };

  // A pal was caught: the catch moment.
  UI.catchMoment = function (pal, line, done) {
    Kit.audio.play('catch');
    UI.sayClear();
    const s = UI.show('catch', `<div class="kit-center">
      <div class="kit-catch-tag">NEW PAL CAUGHT</div>
      <canvas class="kit-catch-pic" width="360" height="360" aria-hidden="true"></canvas>
      <h2 class="kit-catch-name">${esc(pal.name)}</h2>
      <p class="kit-catch-blurb">${esc(pal.blurb)}</p>
      ${line ? `<div class="kit-box" style="--c1:${Kit.speakerColour(line.who)}"><div><div class="kit-who">${esc(Kit.speakerName(line.who))}</div><p class="kit-line">${esc(line.text)}</p></div></div>` : ''}
      <p class="kit-sub kit-catch-book" style="text-align:center">It's in the Monster Book now.</p>
      <button type="button" class="kit-btn main" data-primary data-kit="catch-ok">Back to it</button></div>`);
    if (line) s.querySelector('.kit-box').prepend(Kit.portraitEl(line.who));
    DRIFT_PALS.paint(s.querySelector('canvas'), pal.id);
    UI.tapGuard(s);
    s.querySelector('[data-kit="catch-ok"]').addEventListener('click', () => { Kit.audio.play('tap'); done(); });
  };

  // A choice between waves. spec: { title, text, options: [{ label, blurb, value, disabled }] }. done(option).
  UI.ask = function (spec, done) {
    UI.sayClear();
    const opts = spec.options.map((o, i) => `<button type="button" class="kit-btn kit-option ${i === 0 ? 'main' : ''}" data-opt="${i}" ${i === 0 ? 'data-primary' : ''} ${o.disabled ? 'disabled' : ''}>
      ${esc(o.label)}${o.blurb ? `<span class="kit-small">${esc(o.blurb)}</span>` : ''}</button>`).join('');
    const s = UI.show('ask', `<div class="kit-center">
      <h2 class="kit-head">${esc(spec.title || '')}</h2>
      ${spec.text ? `<p class="kit-sub">${esc(spec.text)}</p>` : ''}
      <div class="kit-row">${opts}</div></div>`);
    UI.tapGuard(s);
    s.addEventListener('click', e => {
      const b = e.target.closest('[data-opt]');
      if (!b || b.disabled) return;
      Kit.audio.play('tap');
      done(spec.options[+b.dataset.opt]);
    });
  };
})();
