// Tide Gap: everything the crew say, except the logbook itself (memory.js). Voices from CAST.md. Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
// A talk line can carry ifLost and instead: if that memory has drowned by the time the scene plays, the other line plays in its place (sail.js).
window.TG = window.TG || {};
TG.WORDS = {
  tagline: 'Two islands grinding shut, a serpent on the tow line, and every Dive drowns a line in her book.',

  stages: [
    { name: 'The Narrows', hint: 'Drag to steer. Gold arrows show where a rock will drift.',
      diveHint: 'PULL DOWN and hold to Dive under a rock. Let go to rise. It drowns a line.',
      talk: [
        { who: 'sela', text: 'Gaptooth Reach. Two islands the size of cities, grinding past each other, and the Free Ports on the far side. It\'s the one road the Empire isn\'t watching.' },
        { who: 'kaito', text: 'Because it eats ships?' },
        { who: 'sela', text: 'Because it eats ships, pup. Hold on to something. Vesh, take us in.' },
        { who: 'juno', text: 'Look at him hugging that mast. Five says it\'s the most action he\'s had all year.' },
      ],
      radio: [
        { at: 0.13, who: 'kaito', text: 'How\'d you know that rock was gonna move?!' },
        { at: 0.2, who: 'sela', text: 'I feel the Drift, pup. Same way you feel hungry.' },
        { at: 0.28, unlocksDive: true, who: 'ione', text: 'Reminder: Vesh can take us under, and it drowns a memory each time. I have asked you to stop.' },
        { at: 0.72, who: 'bram', text: 'Stew\'s still in the pot, Captain. Most of it.' },
      ],
      winLine: { who: 'bram', text: 'Nice steady hand, Captain. That\'s the easy bit, is it? ...It\'s the easy bit.' } },

    { name: 'The Grinders', hint: 'Two gaps, one shuts. The arrows say which. Boulders fall where the shadow grows.',
      talk: [
        { who: 'kaito', text: 'Those two rocks just closed like a goddamn mouth!' },
        { who: 'sela', text: 'So don\'t be in the mouth. Two gaps, one shuts. I\'ll tell you which, while I still can.' },
        { who: 'ione', text: '"While I still can" is doing a lot of work in that sentence.' },
        { who: 'silas', text: 'Two big rocks, one tight squeeze, a great deal of grinding and no way back. Darling, I\'ve paid good money for less.' },
      ],
      radio: [
        { at: 0.25, who: 'juno', text: 'Ten says we lose the paint on the left side.' },
        { at: 0.33, who: 'bram', text: 'We\'ve no paint on the left side, lass.' },
        { at: 0.7, who: 'sela', text: 'Read the arrows, trust the arrows. They\'re the best of me.', ifLost: 'pulse', instead: { who: 'ione', text: 'Your arrows are getting thin, Captain. I can see it from your face.' } },
      ],
      winLine: { who: 'silas', text: 'And out the other side, a little sore. Lovely. Same again?' } },

    { name: 'The Blind Shelf', hint: 'Fog. Gold shows through it. You won\'t get much else.',
      talk: [
        { who: 'juno', text: 'I can\'t see shit. I can\'t see my own hand, and I know where that\'s been.' },
        { who: 'bram', text: 'Fog you could slice and serve. Captain? You\'ve got the feel of it?',
          ifLost: 'soup', instead: { who: 'bram', text: 'Fog you could slice. Eat something when you get a minute, Captain. You used to like my cooking. I\'m nearly sure.' } },
        { who: 'sela', text: 'I\'ve got Vesh\'s lamps and whatever\'s left in my head, Bram. Everyone quiet.' },
        { who: 'vesh', text: 'Far up the line the lamps along his back come on, one by one, and the fog goes amber.' },
      ],
      radio: [
        { at: 0.28, who: 'kaito', text: 'Is it me or did that rock just... breathe?' },
        { at: 0.36, who: 'sela', text: 'That\'s two islands sighing, pup. Don\'t take it personally.' },
        { at: 0.75, who: 'ione', text: 'There are lights back there. Not ours. Regular spacing. That\'s military.' },
      ],
      winLine: { who: 'sela', text: 'Clear of it. Somebody tell me what I just said to Bram. ...No. Don\'t.' } },

    { name: 'The Slip', hint: 'Rips shove you sideways, so steer against them. Red lane: get out of it.',
      talk: [
        { who: 'ione', text: 'Every current in the Reach squeezes through the Slip. The water runs sideways here. And that\'s a Sever cutter behind the rain.' },
        { who: 'kaito', text: 'How\'s a Sever boat get in here?! NOBODY gets in here!',
          ifLost: 'pup', instead: { who: 'kaito', text: 'She called me Kaito again this morning. ...Nobody say anything. How\'s a Sever boat even get in here?' } },
        { who: 'sela', text: 'Because somebody reads, pup. Somebody\'s got hold of my old logs. Every way I ever came through, in my own hand.' },
        { who: 'juno', text: 'Hekka Dorn. Big girl, big stick, terrible attitude. Honestly? My type. Doesn\'t change the odds, we\'re dead.' },
      ],
      radio: [
        { at: 0.2, who: 'hekka', text: 'Page forty, Vey. "Stay left in the Slip." Thank you.' },
        { at: 0.55, who: 'silas', text: 'She\'s firing blind and still nearly parting my hair. I may be in love.' },
        { at: 0.85, who: 'sela', text: 'There\'s the last tooth. And there she is, sitting right in it.' },
      ],
      winLine: { who: 'hekka', text: 'Out of pages, Vey? Come and read the rest. I\'m not moving.' } },

    { name: 'The Last Tooth', boss: true,
      talk: [
        { who: 'hekka', text: 'Sela Vey. I have all your old logbooks, you know. Would you like me to tell you what you\'ve forgotten?' },
        { who: 'sela', text: 'Hekka, darling. Still wearing your divorce on your ribs?' },
        { who: 'hekka', text: 'I cut mine out standing up, in a count of ten. You pay yours off a line at a time and call it love.' },
        { who: 'sela', text: 'Vesh. Bite her boat.' },
      ],
      loseLines: [
        { who: 'hekka', text: 'Again? I have time. I have twelve volumes.' },
        { who: 'hekka', text: 'That\'s the difference between us, Vey. I only had to lose once.' },
        { who: 'ione', text: 'The plates, Captain. The soft part is underneath. It usually is.' },
        { who: 'juno', text: 'She\'s got a big lance and she knows it. Go on, show her what\'s under the waterline.' },
        { who: 'kaito', text: 'Get up! We\'re not done! I\'ll go over there and bite her myself!' },
      ] },
  ],

  // The ending is written fresh from what's left in the book (ending.js). This is only what the kit's checks read before any run.
  endingCard: { title: 'THE REACH IS OPEN', text: 'Hekka\'s cutter went down in the Last Tooth, the chart reached the Free Ports, and the Gaptooth still moves.' },

  loseLines: [
    { who: 'sela', text: 'Up, all of you. Again. I\'ve done this before. I\'m told.' },
    { who: 'juno', text: 'Pay up, boys. I said the rock would win.' },
    { who: 'silas', text: 'Darling, the idea is to go between them.' },
    { who: 'bram', text: 'I can patch that. Slow breath. Hand me the big hammer.' },
    { who: 'ione', text: 'Cause of failure: geology. Try being somewhere else.' },
    { who: 'kaito', text: 'That rock MOVED! I saw it! Shit. Okay. Again!' },
    { who: 'vesh', text: 'Vesh hauls the wreck back up the channel by the tow chain, and sighs a long line of bubbles.' },
  ],
  // A retry puts the empty book back, so these come round again and again.
  emptyLose: [
    { who: 'ione', text: 'No arrows, no Dives, and a blank book. You did that blind. Do it again, with your eyes open.' },
    { who: 'kaito', text: 'So you can\'t feel the rocks anymore. Fine. I\'ll yell when I see one. Get up!' },
    { who: 'juno', text: 'Blank book, blind helm, and you still took the bet. Shit, Captain, I\'d marry you. Again.' },
    { who: 'silas', text: 'Nothing left in the book, darling? Then nobody can say you\'ve done this before. Again.' },
    { who: 'bram', text: 'Empty book, full pot. Eat something, Captain, and we\'ll go at it again. It\'s the onions, shut up.' },
    { who: 'sela', text: 'I don\'t remember losing that one. Good. Again.' },
  ],
  rockLose: { who: 'sela', text: 'I felt that one coming, too. Bit late.' },

  radioEmpty: { who: 'sela', text: 'Nothing. I can\'t feel them. Whatever you\'ve got, Vesh, use it.' },
  deadPress: { who: 'sela', text: 'I\'ve nothing left to give him.' },
  firstDrown: { who: 'ione', text: 'That was a line, Captain. Read your book.' },
  pageFound: [
    { who: 'sela', text: 'That\'s my hand. I don\'t remember writing this.' },
    { who: 'kaito', text: 'There\'s a page in the water! Hey! That\'s yours!' },
    { who: 'sela', text: 'Huh. So that happened.' },
  ],

  boss: {
    start: { who: 'hekka', text: 'Lances first. Then we\'ll talk about your mother.' },
    open: { who: 'ione', text: 'Her keel plates are glowing. She\'s reloading. Under the hull, Captain, now!' },
    noCopies: { who: 'ione', text: 'My copies are no use here. Vesh is too close to her iron to be fooled. From now on he takes the real thing.' },
    hit: [
      { who: 'hekka', text: 'That was a good plate. You\'ll forget you did it.' },
      { who: 'kaito', text: 'THAT\'S how you read a book, you armoured bitch!' },
    ],
    pageLoose: { who: 'sela', text: 'Pages coming loose. Those are mine, I think. Vesh, again.' },
    miss: { who: 'hekka', text: 'Wrong plate. Check your notes.' },
    crash: { who: 'bram', text: 'That\'s her hull, not her keel! Mind my boat!' },
    empty: { who: 'hekka', text: 'Blank at last? Then you\'re no use to him, Vey. Here. Have a page.' },
    fall: { who: 'hekka', text: 'A count of ten... you wouldn\'t last a count of three...' },
  },

  bandLine: { who: 'sela', text: 'Rip! Steer against it!' },
  // The first shut tooth on a stage, by stage, last one repeating. Sela's words go through TG.voice like all her lines, so "pup" changes with the book.
  shutCall: [
    { who: 'sela', text: 'That one\'s shutting, pup. Under it costs me a line. Through it costs Bram a plank.' },
    { who: 'bram', text: 'Shut ahead, Captain. I\'ve planks to spare. You\'ve only the one head.' },
    { who: 'ione', text: 'Closed gap ahead. Dive and you lose a memory, scrape and you lose the hull. I have no recommendation I\'d enjoy.' },
    { who: 'juno', text: 'Another one shutting! Ten says you go through it. Twenty says you regret it.' },
  ],
  shutHint: 'Shut ahead. PULL DOWN and hold to Dive under it, for a line. Or scrape through, for a plank.',
  shutHintDead: 'Shut ahead, and no Dives left. It\'ll cost a knock.',
  scrapeLine: { who: 'bram', text: 'That was a plank! That was a GOOD plank!' },
  yardLine: { who: 'bram', text: 'I\'ve nothing to patch her with, Captain. What\'s gone is gone, so mind the rest. Please.' },
  yardBoss: { who: 'bram', text: 'That\'s every plank I own in her, Captain. The galley table too. There\'s no more after this.' },
  palAppear: {
    bobbin: { who: 'kaito', text: 'There\'s a buoy following us. Is it... is it WAVING?' },
    mopclaw: { who: 'bram', text: 'Look at that rock. There\'s a mop sticking out from under it. Who mops a rock?' },
  },
  palLines: {
    bobbin: { who: 'bram', text: 'It\'s bobbing by the galley hatch. I\'ve given it a bowl. It thinks it works here now, and I haven\'t the heart.' },
    mopclaw: { who: 'sela', text: 'Went under a rock and came back with a crab in a mop. It\'s done half the deck and won\'t look at me. Put that in the book.' },
  },

  upgrades: [
    { id: 'hull', name: 'Tougher Hull', blurb: 'Bram\'s patches. One more plank to lose.' },
    { id: 'dive', name: 'Longer Dive', blurb: 'More air under the rock.' },
    { id: 'spare', name: 'Spare Logbook', blurb: 'A copy in Ione\'s hand. Each level, one copy per run burns before a real line. Not at the boss.' },
  ],
};
