// The 18+ gate. Load in <head> on every page, right after config.js.
// Page content sits inside <template id="page"> and is only added after a Yes,
// so its text, images and game never reach the screen first. Page scripts wait with DriftGate.whenPassed(fn).
// This is a tap-to-confirm gate: it asks, it cannot verify anyone's age.
(function () {
  const KEY = 'driftbound-age-ok-until', DAY_MS = 86400000;
  const days = window.DRIFT_CONFIG.gateRememberDays;
  const waiting = [];
  let passed = false, swappedAt = 0;

  // Ignore taps just after the screen changes, so a double tap can't land on a button that has only just appeared.
  function answered(fn) {
    return () => { if (Date.now() - swappedAt >= window.DRIFT_CONFIG.gateTapGuardMs) fn(); };
  }
  // Focus the text, not a button: a stray Enter answers nothing, and a screen reader reads the new screen.
  function settle(gate) { const box = gate.querySelector('.box'); box.tabIndex = -1; box.focus({ preventScroll: true }); }

  // Storage can be blocked (some private windows). Then the answer lasts this tab, or only this page.
  function stores() {
    const out = [];
    for (const name of ['localStorage', 'sessionStorage']) { try { if (window[name]) out.push(window[name]); } catch (e) { /* blocked */ } }
    return out;
  }
  function remembered() {
    const now = Date.now(), latest = now + days * DAY_MS;
    return stores().some(s => {
      try { const until = Number(s.getItem(KEY)); return until > now && until <= latest; } catch (e) { return false; }
    });
  }
  function remember() { // First store that accepts the answer wins, so it runs out after the same 30 days everywhere.
    const until = String(Date.now() + days * DAY_MS);
    for (const s of stores()) { try { s.setItem(KEY, until); return; } catch (e) { /* try the next one */ } }
  }

  const css = `
    #drift-gate { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; overflow: auto;
      padding: 24px 16px; background: #14171c; color: #f2f2f2; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-align: center; }
    #drift-gate .box { width: 100%; max-width: 360px; outline: none; }
    #drift-gate h1 { margin: 0 0 20px; font-size: 38px; font-weight: 900; font-style: italic; letter-spacing: 2px; color: #f2d21b; }
    #drift-gate p { margin: 0 0 8px; font-size: 20px; font-weight: 700; }
    #drift-gate .row { display: flex; gap: 12px; margin-top: 24px; }
    #drift-gate button.answer { flex: 1; min-height: 56px; border: 0; border-radius: 6px; font: inherit; font-size: 20px; font-weight: 900; cursor: pointer; }
    #drift-gate .yes { background: #f2d21b; color: #14171c; }
    #drift-gate .no { background: #3a404a; color: #f2f2f2; }
    #drift-gate button.mistake { margin-top: 24px; padding: 12px; border: 0; background: none; color: #b8bec8; font: inherit; font-size: 16px; text-decoration: underline; cursor: pointer; }
  `;

  function showQuestion(gate) {
    gate.innerHTML = `<div class="box"><h1>DRIFTBOUND</h1><p>Adults only.</p><p>Are you 18 or older?</p>
      <div class="row"><button type="button" class="answer yes">Yes</button><button type="button" class="answer no">No</button></div></div>`;
    gate.querySelector('.yes').addEventListener('click', answered(() => { remember(); reveal(gate); }));
    gate.querySelector('.no').addEventListener('click', answered(() => { swappedAt = Date.now(); showStop(gate); }));
    settle(gate);
  }
  function showStop(gate) { // A No isn't saved: the question comes back on the next visit.
    gate.innerHTML = `<div class="box"><h1>DRIFTBOUND</h1><p>Driftbound is for adults.</p><p>Come back when you're 18.</p>
      <button type="button" class="mistake">I tapped by mistake</button></div>`;
    gate.querySelector('.mistake').addEventListener('click', answered(() => { swappedAt = Date.now(); showQuestion(gate); }));
    settle(gate);
  }
  function reveal(gate) {
    if (gate) gate.remove();
    const tpl = document.getElementById('page');
    if (tpl) tpl.replaceWith(tpl.content.cloneNode(true));
    passed = true;
    waiting.splice(0).forEach(fn => fn());
    const title = gate && document.querySelector('h1');
    if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (remembered()) return reveal(null);
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    const gate = document.createElement('div');
    gate.id = 'drift-gate'; gate.setAttribute('role', 'dialog'); gate.setAttribute('aria-modal', 'true'); gate.setAttribute('aria-label', 'Age check');
    document.body.appendChild(gate);
    showQuestion(gate);
  });

  window.DriftGate = { whenPassed(fn) { if (passed) fn(); else waiting.push(fn); } };
})();
