// Tide Gap: the logbook. The bond cost itself: what's written, what drowns, what a found page gives back. Rules only; the drawing is in hud.js.
// Lines live in run.carry, so a story run keeps its losses through Next stage, Menu and a reload (kit README, run.carry).
// The spec says a Dive loses a line "for good" and a page "restores a line". Read together: the drowned memory never comes back, the page gives the row a different line she'd forgotten writing.
window.TG = window.TG || {};
(function () {
  const T = TUNE;

  // In the order they drown. after: what the crew say once it's gone. witness: who can tell her at the end. jab: Hekka, who has read the old logs.
  TG.MEMORIES = [
    { id: 'coat', text: 'Silas owes me for a blue coat. He says he doesn\'t.',
      after: [{ who: 'silas', text: 'About that blue coat, Captain.' }, { who: 'sela', text: 'What blue coat?' }, { who: 'silas', text: '...Nothing, darling. I\'ll buy you another anyway.' }],
      witness: { who: 'silas', text: 'That one was mine. A blue coat. I swore I never owed you, and I lied, and I\'d give a great deal to go on lying.' },
      jab: 'Says here Moreau owes you for a coat. Did he pay? Do you know?' },
    { id: 'cards', text: 'Won the Gullwake at cards off a liar. Cheated better.',
      after: [{ who: 'juno', text: 'Tell it again, how you won the ship.' }, { who: 'sela', text: 'I won the ship?' }, { who: 'juno', text: '...Shit. Forget it. No bet.' }],
      witness: { who: 'juno', text: 'You won this tub at cards, Captain. Off a liar. You cheated better. It\'s my favourite thing about you, and you can\'t even brag about it now.' },
      jab: 'You won that wreck at cards. It\'s in your own hand. Whose ship do you think you\'re on?' },
    { id: 'soup', text: 'Bram wept into his first soup here. We ate it anyway.',
      after: [{ who: 'bram', text: 'Captain. My first soup aboard. You\'d remember that.' }, { who: 'sela', text: 'Was it good?' }, { who: 'bram', text: '...Aye. It was grand.' }],
      witness: { who: 'bram', text: 'That\'s the soup, Captain. My first night. I wept in the pot and you had two bowls. It was the worst soup ever made. It\'s the onions, shut up.' },
      jab: 'Your cook cried in his soup, and you wrote it down. Why would anyone write that down?' },
    { id: 'pulse', text: 'Ione checks my pulse while I sleep. I let her.',
      after: [{ who: 'ione', text: 'Your pulse was steady last night.' }, { who: 'sela', text: 'You take my pulse?' }, { who: 'ione', text: 'You have known for two years. ...Noted.' }],
      witness: { who: 'ione', text: 'I check your pulse while you sleep. You knew. You let me. I am recording that as the kindest thing anyone has done for me, since you can\'t.' },
      jab: 'Raske takes your pulse at night. Did you know? You did, once.' },
    { id: 'pup', text: 'Kaito, first night aboard: sick on my boots. Called him pup.',
      after: [{ who: 'sela', text: 'Steady there, Kaito.' }, { who: 'kaito', text: '...Kaito? You never... Sela. What do you call me?' }, { who: 'sela', text: 'Your name. Why?' }],
      witness: null,
      jab: 'And the boy? The loud one? You had a name for him. It\'s on page nine.' },
    { id: 'song', text: 'Vesh fit in a bait bucket once. I sang him to sleep.',
      after: [{ who: 'vesh', text: 'Far up the line the great head turns back toward the deck, and waits for a song that doesn\'t come.' }],
      witness: null,
      jab: 'You used to sing to it. That\'s the last page. Now you\'re the same as me, Vey, only slower.' },
  ];

  // Found pages, in the order they turn up. Lines she wrote and forgot writing; they never bring back what drowned.
  TG.PAGES = [
    'Mum hummed flat on purpose so I\'d correct her.',
    'Never let Juno deal. Never let Juno hold the deck.',
    'Best day: rain, no Empire, Bram\'s bread, nobody bleeding.',
    'Ask him about the song. He\'ll say you made it up.',
    'Silas cried at a wedding once. Pay him to deny it.',
    'If you\'re scared reading this: you\'ve done it before.',
    'Bottom locker, left side. Don\'t open it sober.',
    'You\'re Sela Vey. You\'re good at this. Keep writing.',
  ];

  const byId = id => TG.MEMORIES.find(m => m.id === id);
  TG.memory = byId;

  // The book as carried: rows top to bottom. Each row is { id, text } or { lost: id }.
  TG.bookIn = function (run) {
    const c = run.carry;
    if (!c.rows) {
      c.rows = TG.MEMORIES.map(m => ({ id: m.id, text: m.text }));
      c.lost = []; c.pagesFound = 0; c.sparesUsed = 0;
    }
    return c;
  };
  TG.linesLeft = run => run.carry.rows.filter(r => !r.lost).length;
  TG.spareLeft = run => Math.max(0, run.up('spare') - run.carry.sparesUsed);
  TG.senseNow = run => T.sense[Math.min(T.sense.length - 1, TG.linesLeft(run))];
  TG.senseFeels = (run, r) => !r.gate || r.gate.feel >= TG.senseNow(run).miss;
  TG.hasLost = (run, id) => run.carry.lost.includes(id);
  TG.canDive = run => TG.linesLeft(run) > 0 || TG.spareLeft(run) > 0;

  // Sela's own words change once a memory has gone: she has no idea what she used to call him.
  TG.voice = function (text, lost) { return lost && lost.includes('pup') ? String(text).replace(/\bpup\b/g, 'Kaito') : text; };

  // What one Dive costs. Returns the row index that drowned, or -1 if a spare copy paid.
  TG.drown = function (run) {
    const c = run.carry, w = run.w;
    if (TG.spareLeft(run) > 0) { c.sparesUsed++; w.bookFx = { kind: 'spare', t: 0 }; Kit.audio.play('crack'); return -1; }
    // Originals go first, in the order of the list; pages she found last of all.
    let i = -1;
    for (const m of TG.MEMORIES) { i = c.rows.findIndex(r => r.id === m.id); if (i >= 0) break; }
    if (i < 0) i = c.rows.findIndex(r => !r.lost);
    if (i < 0) return -1;
    const row = c.rows[i], mem = byId(row.id);
    w.bookFx = { kind: 'drown', row: i, text: row.text, t: 0 };
    c.rows[i] = { lost: row.id || 'page' };
    if (mem) { c.lost.push(mem.id); TG.queueLines(run, mem.after, 2.2); }
    Kit.audio.play('drown');
    return i;
  };

  // A page fills the first blank row with a line she'd forgotten. No blank row: it's kept for what it's worth.
  TG.findPage = function (run) {
    const c = run.carry, w = run.w, i = c.rows.findIndex(r => r.lost);
    run.addScore(T.scorePage);
    Kit.audio.play('page');
    if (i < 0) {
      run.addSalvage(T.pageExtra);
      w.bookFx = { kind: 'full', t: 0 };
      if (Kit.art) Kit.art.floatText(w.shipX, T.shipY - 70, 'BOOK\'S FULL  +' + T.pageExtra, Kit.art.GOLD, 15);
      return false;
    }
    const text = TG.PAGES[c.pagesFound % TG.PAGES.length];
    c.pagesFound++;
    c.rows[i] = { page: c.pagesFound, text };
    w.bookFx = { kind: 'page', row: i, t: 0 };
    return true;
  };
})();
