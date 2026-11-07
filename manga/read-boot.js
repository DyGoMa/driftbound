// Starts the reader after the 18+ gate: reads ?i=N, loads that issue's script with a script tag (works from file:// too), then opens the book.
(function () {
  const DM = window.DM;
  window.DriftManga = { issue(d) { DM.loaded = d; } };   // each issue file calls this

  function fail(title, text) {
    const box = document.getElementById('stage');
    box.textContent = '';
    const msg = DM.el('div', 'reader-msg');
    msg.append(DM.el('h2', '', title), DM.el('p', '', text));
    const a = DM.el('a', 'bp-btn', 'Back to the shelf');
    a.href = 'index.html';
    msg.appendChild(a);
    box.appendChild(msg);
    document.getElementById('count').textContent = '';
  }

  // Waits a moment for the lettering fonts, so the first fit uses the real letter widths. Never waits long.
  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const want = ['400 40px Anton', '700 24px Barlow', '800 24px Barlow', '500 18px Barlow'].map(f => document.fonts.load(f).catch(() => null));
    return Promise.race([Promise.all(want), new Promise(r => setTimeout(r, 1500))]);
  }

  function begin(issue) {
    const arc = DM.arcOf(issue.arc);
    document.title = 'No. ' + DM.two(issue.n) + ' ' + issue.title + ' · Driftbound';
    document.getElementById('issue-no').textContent = 'No. ' + DM.two(issue.n);
    document.getElementById('issue-title').textContent = issue.title;
    document.documentElement.style.setProperty('--arc', arc.c);
    DM.input.attach();
    DM.zoom.attach();
    DM.reader.start(issue);
    let late = false;
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => { if (!late) { late = true; setTimeout(() => DM.reader.refresh(), 50); } });
  }

  window.DriftGate.whenPassed(() => {
    const n = Number(new URLSearchParams(location.search).get('i'));
    if (!Number.isInteger(n) || n < 1 || n > 999) { fail('No issue picked', 'Pick a book from the shelf to start reading.'); return; }
    const s = document.createElement('script');
    s.src = 'issues/issue-' + DM.two(n) + '.js';
    s.onload = () => {
      const d = DM.loaded;
      if (!d || !Array.isArray(d.pages) || !d.pages.length) { fail('This issue is not ready', 'Its script did not load properly. Try the shelf.'); return; }
      fontsReady().then(() => begin(d));
    };
    s.onerror = () => fail('Not on the shelf yet', 'Issue ' + n + " hasn't been written yet. More are on the way.");
    document.body.appendChild(s);
  });
})();
