// Shared by the shelf and the reader: arcs, saved progress, speaker colours, art lookups, small DOM helpers.
(function () {
  window.Kit = window.Kit || {};   // shared/kit/speakers.js hangs its table on Kit; the manga only reads names and colours from it.

  // Each arc has its own spine colour (c) and lettering colour (ink). Picked for this shelf; easy to change here.
  const ARCS = {
    pinhold: { name: 'Pinhold', c: '#2c6a6e', ink: '#f5efe2' },
    ashmarket: { name: 'Ashmarket', c: '#a8432a', ink: '#f8e7c8' },
    gaptooth: { name: 'Gaptooth Reach', c: '#6d6a34', ink: '#f6edc4' },
    lanternreach: { name: 'Lanternreach', c: '#d4942f', ink: '#20142a' },
    regatta: { name: 'The Longwake Regatta', c: '#27558f', ink: '#f4c152' },
    keelbreak: { name: 'Keelbreak', c: '#5b3a80', ink: '#f2e4ff' },
    glassward: { name: 'The Glass Ward', c: '#8db4bf', ink: '#10223a' },
    countoffive: { name: 'Count of Five', c: '#7f1c2b', ink: '#f4c152' },
    deadwater: { name: 'Deadwater', c: '#262b3d', ink: '#8fd3f0' },
    filler: { name: 'Side Stories', c: '#d9cfb4', ink: '#2a2238', side: true },   // one-off issues, 49 and up, shelved apart
  };
  const PARTS = { 1: 'The Map That Lies', 2: 'The Long Wake' };
  const PART_WORD = { 1: 'Part One', 2: 'Part Two' };
  const DEFAULT_COLOUR = '#a4a9b4';
  const isSide = issue => !!issue && issue.arc === 'filler';

  // Saved settings and progress. Storage can be blocked: everything still works for this page, it just isn't kept.
  const KEY = 'driftbound-manga-v1';
  let data = { dir: 'rtl', notes: true, hintSeen: false, last: 0, progress: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) data = Object.assign(data, JSON.parse(raw));
  } catch (e) { /* blocked or broken: keep the defaults */ }
  if (!data.progress || typeof data.progress !== 'object') data.progress = {};
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* blocked */ } }

  function speaker(id) {
    const s = String(id || '');
    if (s.startsWith('extra:')) return { name: s.slice(6), colour: DEFAULT_COLOUR };
    const table = window.Kit.speakers || {}, hit = table[s];
    if (hit) return { name: hit.name, colour: hit.colour };
    return { name: s.charAt(0).toUpperCase() + s.slice(1), colour: DEFAULT_COLOUR };
  }

  const two = n => String(n).padStart(2, '0');
  function art(key) { const m = window.DRIFT_MANGA_ART; return (m && m[key]) || null; }
  const panelKey = (n, page, panel) => `i${two(n)}-p${two(page)}-${panel}`;
  const coverKey = n => `i${two(n)}-cover`;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function catalog() {
    const c = Array.isArray(window.DRIFT_MANGA_CATALOG) ? window.DRIFT_MANGA_CATALOG : [];
    return c.slice().sort((a, b) => a.n - b.n);
  }
  function arcOf(id) { return ARCS[id] || { name: id || 'Unknown', c: '#3a4068', ink: '#f5efe2' }; }
  // The next issue in the catalog, if there is one. The main run never leads into a side story.
  function nextIssue(n, side) {
    const list = catalog(), hit = list.find(x => x.n === n + 1);
    return hit && isSide(hit) === !!side ? hit : null;
  }
  const done = n => !!(data.progress[n] && data.progress[n].done);

  // Where "Continue reading" goes: the unfinished issue last opened, else the first unread one of the main run.
  function nextUp() {
    const list = catalog(), main = list.filter(x => !isSide(x));
    if (!list.length) return null;
    const last = list.find(x => x.n === data.last);
    if (last && data.progress[last.n] && !done(last.n)) return { issue: last, resume: true };
    const pool = main.length ? main : list;
    const after = last && !isSide(last) ? pool.find(x => x.n > last.n && !done(x.n)) : null;
    const first = after || pool.find(x => !done(x.n));
    return first ? { issue: first, resume: !!data.progress[first.n] } : { issue: pool[0], resume: false, again: true };
  }

  window.DM = { ARCS, PARTS, PART_WORD, DEFAULT_COLOUR, data, save, speaker, two, art, panelKey, coverKey, el, catalog, arcOf, isSide, nextIssue, done, nextUp };
})();
