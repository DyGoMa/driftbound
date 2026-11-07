// Tide Gap: the ending, written from what's left in the book. There's one for a kept pup, one for a lost one, and one for a book with nothing of hers in it.
// The kit reads def.ending and def.endingCard when the ending plays, so they're filled in place when the boss falls, and the last ending is saved so "See how it ends" replays it.
window.TG = window.TG || {};
(function () {
  const lostOf = names => TG.MEMORIES.filter(m => names.includes(m.id));

  // The crew tell her what she's lost, up to two of them, newest first: that's who she can no longer thank.
  const SMEARS = ['Next one\'s just a blue smear.', 'Another smear. This one ran right down the page.'];
  function witnesses(lost, limit) {
    const out = [];
    lostOf(lost).filter(m => m.witness).slice(-limit).reverse().forEach((m, i) => {
      out.push({ who: 'kaito', text: SMEARS[i % SMEARS.length] });
      out.push(m.witness);
    });
    return out;
  }

  TG.buildEnding = function (lost, rows) {
    const keptPup = !lost.includes('pup'), keptSong = !lost.includes('song'), name = keptPup ? 'pup' : 'Kaito';
    const lines = [
      { who: 'hekka', text: 'Keep your book, Vey. Next time I\'ll read it to you.' },
      { who: 'sela', text: 'You do that. Somebody should.' },
      { who: 'sela', text: 'The Free Ports. Look at that, they\'re still moving. ' + (keptPup ? 'Sit down, pup.' : 'Sit down, Kaito.') + ' Read me the book. All of it, out loud.' },
    ];
    let last;
    if (keptPup) {
      lines.push(...witnesses(lost, 1));
      lines.push({ who: 'kaito', text: '"Kaito, first night aboard: sick on my boots. Called him pup." ...Seriously? THAT\'S the one you kept? You wrote that DOWN?' });
      lines.push({ who: 'sela', text: 'First thing I\'d save from a fire, pup.' });
      lines.push({ who: 'juno', text: 'Look at the ears on him. Pay up, Silas.' });
      last = 'Through the Gaptooth. Kept the pup. Lucky him.';
    } else {
      lines.push(...witnesses(lost, 2));
      lines.push({ who: 'kaito', text: 'This one\'s gone too. Sela. What do you call me?' });
      lines.push({ who: 'sela', text: 'Kaito. It\'s your name. What else would I call you?' });
      lines.push({ who: 'kaito', text: '...You call me pup. My first night aboard I was sick on your boots and you called me pup, and I\'ve hated it every damn day since.' });
      if (keptSong) {
        lines.push({ who: 'sela', text: 'Pup. ...It suits you. Hold still, I\'m writing that down.' });
        lines.push({ who: 'bram', text: 'It\'s the onions. Everybody shut up.' });
        last = 'I call Kaito pup. He says he hates it. He doesn\'t.';
      } else {
        lines.push({ who: 'sela', text: 'Pup. Hold still, I\'m writing that down. And Vesh. He keeps looking back at me, every night, like I owe him something. What does he want?' });
        lines.push({ who: 'ione', text: 'A song. You used to sing to him. It is the last thing you wrote about him, and no one aboard knows the tune.' });
        lines.push({ who: 'vesh', text: 'The great head comes up over the rail and rests on the deck at her feet. She doesn\'t know any songs. She hums something anyway, flat.' });
        last = 'Vesh wants a song. I used to know it. Sing to him anyway.';
      }
    }
    const kept = rows.filter(r => !r.lost).length;
    const words = ['nothing', 'one line', 'two lines', 'three lines', 'four lines', 'five lines', 'six lines'][kept] || (kept + ' lines');
    return { talk: lines, card: { title: 'THE REACH IS OPEN', text: `Hekka's cutter went down in the Last Tooth. The chart reached the Free Ports, and the Gaptooth still moves. Sela's book came through with ${words} in it. That night she wrote one more: "${last}"` }, name };
  };

  // Fills the kit's ending from the run that just beat the boss, and remembers it.
  TG.setEnding = function (run) {
    const e = TG.buildEnding(run.carry.lost, run.carry.rows);
    TG.applyEnding(e);
    if (!run.dry) DriftSave.setSetting('tide-gap-ending', { lost: run.carry.lost, rows: run.carry.rows.map(r => (r.lost ? { lost: 1 } : { k: 1 })) });
  };
  TG.applyEnding = function (e) {
    const d = Kit.def;
    if (!d) return;
    d.ending = e.talk;
    d.endingCard = e.card;
  };
  // What shows before any story has been finished, or on replay: the last one that was really played, else the kept-line version with the boss's three Dives paid.
  TG.defaultEnding = function () {
    const s = window.DriftSave ? DriftSave.getSetting('tide-gap-ending', null) : null;
    return s ? TG.buildEnding(s.lost, s.rows) : TG.buildEnding(['coat', 'cards', 'soup'], [{ k: 1 }, { k: 1 }, { k: 1 }, { lost: 1 }, { lost: 1 }, { lost: 1 }]);
  };
})();
