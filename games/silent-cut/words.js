// Silent Cut: everything anyone says. Voices from CAST.md. Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
// Silas's lines go through SC.voice when he speaks in play: they break up as his breath runs low, and go blank at empty. Nobody else's do.
// Between play, a line's rough (rasp 1 or 2) and rags (rasp 3) are what he says once the run has scarred his voice. They keep whatever the next speaker answers. Blank is only for out of breath, and for the ending.
window.SC = window.SC || {};
SC.WORDS = {
  tagline: 'Every lamp in Lanternreach is hunting him. Run out of breath and the charming bastard runs out of words.',

  stages: [
    { name: 'The Wet Steps',
      talk: [
        { who: 'sela', text: 'Your old port, your old boss, your bad idea. Say it plainly, Silas, before I let you off my ship.' },
        { who: 'silas', text: 'Maro kept a ledger, Captain. Every cargo I ever ran. Eleven of those cargos had teeth, and now the Sever wants to buy the book.' },
        { who: 'juno', text: 'So he\'s sneaking off alone at night to go through his old boss\'s books. Five says he flirts with the first guard.' },
        { who: 'silas', text: 'Darling, I\'ll flirt with the first guard and then I\'ll cut him. Come along, Hush.' },
      ],
      radio: [{ who: 'juno', text: 'Well? Did you flirt with him yet?' }, { who: 'silas', text: 'Patience. I like to get to know a man from behind first.' }, { who: 'bram', text: 'Are you eating, lad? There\'s a stall on the second steps does a fair fish.' }],
      winLine: { who: 'silas', text: 'A year gone, and they still haven\'t fixed that bottom step. Sentimental, really.', rough: 'A year gone... still haven\'t fixed that step. Sentimental.', rags: 'Still... that step. Sentimental.' } },
    { name: 'Oil Row',
      talk: [
        { who: 'ione', text: 'Every Surge pulls breath through the bond. Empty the chest and your voice goes with it. You recover by standing still, which I realise isn\'t your gift.' },
        { who: 'silas', text: 'Doctor, I can stand perfectly still. Ask anyone who\'s woken up next to me.', rough: 'Doctor, I can stand... perfectly still. Ask anyone who\'s woken up... next to me.', rags: 'Still, Doctor? Ask anyone... who\'s woken up... next to me.' },
        { who: 'ione', text: 'I did ask. The reports mostly mention the talking.' },
        { who: 'kaito', text: 'Why does HE get the sneaking job? I can sneak! I\'m a GREAT sneak!' },
      ],
      radio: [{ who: 'sela', text: 'I can see Oil Row from here. It\'s getting darker one lamp at a time. Subtle.' }, { who: 'silas', text: 'A little mood lighting never hurt anyone, Captain.' }],
      winLine: { who: 'silas', text: 'Oil Row, dark for the first time in forty years. The landlords will be livid.', rough: 'Oil Row, dark... first time in forty years. Landlords will be livid.', rags: 'Oil Row... dark. Landlords... livid.' } },
    { name: 'Crane Yard',
      talk: [
        { who: 'bram', text: 'They run those cranes all night? Then you stay under the cargo, lad, and you don\'t stop for anything. And eat something after. You\'ve gone thin.' },
        { who: 'silas', text: 'Bram, my love, I ran these cranes. I\'ve hidden under every crate in this yard, and inside a few of them. With company.', rough: 'Bram, my love, I ran these cranes. Hid under... every crate in this yard. Inside a few. With company.', rags: 'Ran these cranes, love. Hid in... the crates. With... company.' },
        { who: 'juno', text: 'Bullshit. Who\'d climb in a crate with you?' },
        { who: 'silas', text: 'A duke\'s wife. Her idea. She tipped.', rough: 'A duke\'s wife... Her idea. She tipped.', rags: 'Duke\'s wife. She... tipped.' },
      ],
      radio: [{ who: 'juno', text: 'How much did she tip? I\'m running a book on it.' }, { who: 'silas', text: 'Enough to buy the crate, darling. I kept it.' }],
      winLine: { who: 'silas', text: 'Keep up with the cargo, they said. I was the cargo.', rough: 'Keep up with the cargo, they said... I was the cargo.', rags: 'Keep up... they said. I was... the cargo.' } },
    { name: 'The Long Boards',
      talk: [
        { who: 'maro', text: 'Silas, dear fellow. I can hear you on my boards. You always did walk like you owed somebody.' },
        { who: 'silas', text: 'Ledger. You sold us to the Sever. Eleven partners, and every captain who carried them.', rough: 'Ledger. You sold us... to the Sever. Eleven partners. Every captain who carried them.', rags: 'You sold us... Ledger. Eleven... every captain.' },
        { who: 'maro', text: 'Sold? I balanced the book. Come up and I\'ll show you the figures. Mind the third board. It still tells on you.' },
        { who: 'hush', text: 'Hush lands on the rail without a sound. Looks at the boards. Looks at you.' },
      ],
      radio: [{ who: 'maro', text: 'Creak, creak. There you are. Four men on this walk and every one of them on my payroll.' }, { who: 'maro', text: 'Two years I paid you, and you never once learned to take your boots off.' }],
      winLine: { who: 'maro', text: 'There he is, at my door. Do come in. I\'ve left you a lamp on.' } },
    { name: 'The Lamplit Warehouse',
      talk: [
        { who: 'maro', text: 'In you come. Wipe your feet. I taught you everything you know, and I kept the receipts.' },
        { who: 'silas', text: 'You taught me to count the exits, Ledger. There\'s one left, and you\'re standing on it.', rough: 'You taught me... to count the exits, Ledger. One left. You\'re standing on it.', rags: 'Count the exits... you taught me. One left. You\'re... on it.' },
        { who: 'sela', text: 'Burn the book, Silas. Then come home. That\'s an order, and I don\'t give you many.' },
        { who: 'silas', text: 'Captain. You say the sweetest things.', rough: 'Captain... You say the sweetest things.', rags: 'Captain... sweetest things.' },
      ],
      windedLose: [
        { who: 'silas', text: '...' },
        { who: 'maro', text: 'Speechless? I\'ll put that in the book. I may have it framed.' },
        { who: 'maro', text: 'No last words, dear fellow? I\'d ruled a column for them.' },
        { who: 'sela', text: 'Silas? Say something. Say anything. ...Silas.' },
      ],
      loseLines: [
        { who: 'maro', text: 'Carry the one, dear fellow. That\'s you, being carried out.' },
        { who: 'maro', text: 'I\'ve written you off before. It balances nicely.' },
        { who: 'maro', text: 'Again? Do. I charge by the hour.' },
        { who: 'sela', text: 'His back, Silas. Not his lamp.' },
        { who: 'juno', text: 'Beaten by an accountant. I\'m having that embroidered.' },
      ] },
  ],

  ending: [
    { who: 'maro', text: 'Well, then. That last one stuck in your throat, didn\'t it? You\'ve had a line ready for me for a whole year, dear fellow. I know you. Let\'s hear it.' },
    { who: 'silas', text: '...' },
    { who: 'maro', text: 'Nothing? All that way, all those lamps, and nothing to say to me? Ha. Oh, that\'s worth the whole book.' },
    { who: 'hush', text: 'Hush lands on the open ledger without a sound. The lamp tips over. Eleven names go up, and every captain\'s with them.' },
    { who: 'sela', text: 'Gullwake to Silas. There\'s smoke over the warehouse. Is that you? ...Silas, say something.' },
    { who: 'juno', text: 'Say something filthy. I\'ll pay you. ...Shit. He always gets it back by now.' },
    { who: 'bram', text: 'Here he is. Here\'s the lad. Sit down. Don\'t you dare try to talk. There\'s soup. It\'s the onions, I\'m fine.' },
    { who: 'ione', text: 'Days, not hours. Every breath he borrowed tonight came due at once. I\'m noting that the patient regards this as the worst thing that has ever happened to him.' },
    { who: 'kaito', text: 'So he can\'t insult me? For DAYS? ...This sucks. Get better, pretty boy.' },
    { who: 'silas', text: '(He takes the chalk from Bram\'s galley slate, and writes slowly, with a flourish.) MISS ME, DARLINGS?' },
  ],
  endingCard: { title: 'THE BOOK IS ASHES', text: 'Eleven partners and every captain who carried them are off the books. Ledger Maro was last seen counting what was left. Silas couldn\'t speak for days, and the Gullwake has never been so quiet. Juno is running a book on his first word.' },

  loseLines: [
    { who: 'sela', text: 'Three alarms, Silas. The whole port\'s up. Come back and do it quietly.' },
    { who: 'juno', text: 'Pay up, boys. He got caught with his shirt open.' },
    { who: 'silas', text: 'Ah. I\'ve been noticed. In fairness, darling, who wouldn\'t look?' },
    { who: 'ione', text: 'The shadow was working perfectly. You left it.' },
    { who: 'bram', text: 'Back you come, lad. Nobody\'s cross. Try it slower.' },
    { who: 'kaito', text: 'HA! Even I could\'ve... no, okay. No, I couldn\'t.' },
    { who: 'hush', text: 'Hush lands beside you, blinks once, and says nothing. As usual, it hurts.' },
    { who: 'trooper', text: 'Stop right there! ...Is that shirt regulation?' },
  ],
  // Lost to the lamp line itself. The boss's list covers it there.
  lineLose: [
    { who: 'juno', text: 'You stood about so long the whole lamp line caught up. Pretty doesn\'t count as cover, Silas.' },
    { who: 'sela', text: 'That line only walks, Silas. You had the whole street to stay ahead of it.' },
    { who: 'bram', text: 'They walked right up on you, lad. Can\'t stand about, not on that street.' },
    { who: 'ione', text: 'A row of men walking at a steady pace caught a man who was supposed to be walking. I\'ll want that explained.' },
    { who: 'kaito', text: 'They were WALKING, Silas! You got caught by WALKING!' },
  ],
  windedLose: [
    { who: 'silas', text: '...' },
    { who: 'sela', text: 'Three bells and not one smart remark. That\'s how I know it\'s bad.' },
    { who: 'juno', text: 'Caught, and he can\'t even talk his way out. I\'d pay to see that twice.' },
    { who: 'bram', text: 'No running on no breath, lad. Out of the light, then stand still. Please.' },
    { who: 'ione', text: 'Caught out of breath. The bond takes the voice first, then the legs. Noted.' },
    { who: 'kaito', text: 'He got caught and didn\'t even say anything cool? What is HAPPENING?' },
  ],
  voiceLabel: ['BREATH', 'HOARSE', 'RAGGED', 'IN RAGS'],   // the breath panel, by rasp

  // Silas in play. Breath low, and these break up; breath gone, and they're "...".
  quips: {
    strike: ['Shh. There we are, darling.', 'Sleep well, handsome.', 'Nothing personal. Lovely coat.', 'You\'ve a beautiful back. I do mean that.', 'Don\'t get up. I\'ll see myself out.', 'Quiet, now. That\'s the way.', 'Call me.'],
    cut: ['Lights down. So much more flattering.', 'There. Now it\'s a proper evening.', 'Forty years that lamp\'s been up. Rude of it.', 'Nobody looks their best in lamplight, darling.'],
    surge: ['Excuse me, passing through.', 'And gone, darling.', 'Mm. That one cost me.'],
    alarm: ['Ah. They\'ve noticed me. They always do.', 'Not my best angle.', 'All right, all right, I\'m flattered.'],
    close: ['Close enough to kiss.', 'Missed me, darling.', 'That was almost romantic.'],
    breathBack: ['...there it is. Did you miss me?', 'Where was I? Oh yes. Handsome.', 'Don\'t all cheer at once.'],
  },

  // The last thing out of him before his voice goes. Cut off on purpose.
  windedCurse: 'Oh, for f',

  // The crew's turn to talk, when his voice goes.
  windedCrew: [
    { who: 'sela', text: 'Silas? ...He\'s gone quiet. Nobody panic. Silas, stop moving and breathe.' },
    { who: 'juno', text: 'Say something filthy. Come on. ...Shit, he really can\'t.' },
    { who: 'bram', text: 'Stand still, lad. Stand still and breathe. Please.' },
    { who: 'ione', text: 'Bond debt. He\'ll have his voice back if he stops moving. He won\'t enjoy the silence.' },
    { who: 'kaito', text: 'Hey! HEY, pretty boy! ...Why isn\'t he insulting me? I don\'t like this.' },
  ],
  // The same, when his breath goes while he's standing in the light. Standing still there rings all three bells before a Surge comes back; walking out costs one.
  windedCrewLit: [
    { who: 'sela', text: 'Silas? You\'ve gone quiet, and you\'re lit up like a shopfront. Walk out of it, then breathe.' },
    { who: 'bram', text: 'Not there, lad! Out of the light first. Then stand still and breathe.' },
    { who: 'ione', text: 'Bond debt. Stillness brings his voice back, but not in that light. Walk, Silas.' },
  ],
  // When going out of breath again scars his voice for the run: one for each scar.
  tornCrew: [
    { who: 'ione', text: 'That wheeze is new. That\'s the bond taking its cut, Silas. It stays with you for the rest of the job.' },
    { who: 'bram', text: 'That\'s not breathing, lad, that\'s a saw. No more dashes. Please.' },
    { who: 'sela', text: 'You sound like a dead man on my radio, Silas. Whatever\'s left, save it for the book.' },
  ],
  alarmCrew: [
    { who: 'sela', text: 'That\'s a bell, Silas. Move.' },
    { who: 'juno', text: 'Ha! Called it. Pay up.' },
    { who: 'bram', text: 'They\'ve seen you, lad. Get under something.' },
  ],
  lineNear: { who: 'sela', text: 'Lamp line right behind you, Silas. Whatever you\'re waiting for, stop.' },
  lineNearMaro: { who: 'maro', text: 'My porters are bolting the doors behind you. Do keep moving, dear fellow.' },

  maro: {
    start: { who: 'maro', text: 'Let me just finish this column. Do sit. Oh, you\'re hiding. Force of habit.' },
    turn: [
      { who: 'maro', text: 'Now, where did I put you?' },
      { who: 'maro', text: 'I can smell that cheap sash from here.' },
      { who: 'maro', text: 'Eleven names. Do you know what the Sever pays per name?' },
      { who: 'maro', text: 'Come out, come out. I do so hate an open account.' },
    ],
    hit: [
      { who: 'maro', text: 'Ow! You little shit! That was my good coat! Guards!' },
      { who: 'maro', text: 'Two years of wages and this is the thanks. Put him in the book!' },
    ],
    // The third never finishes. His voice goes on it, as it did on "Oh, for f", and the ending picks up from that.
    silasHit: ['First instalment, Ledger.', 'Second instalment. I do hope you kept the receipt.', 'Paid in f'],
    silasHitRags: ['First... instalment.', 'Second. Keep... the receipt.', 'Paid... in f'],
    winded: { who: 'maro', text: 'Nothing to say, dear fellow? Two years, and I finally get a word in.' },
    fall: { who: 'maro', text: 'Wait. Wait, wait. We can come to an arrangement. We always do.' },
  },

  palAppear: {
    tuftle: { who: 'hush', text: 'Hush looks at the dark beside you. Two big eyes look back. Stay still.' },
    lamplick: { who: 'ione', text: 'That lantern\'s dimming on a rhythm. Something\'s licking it. Cut it down.' },
    lamplickDizzy: { who: 'bram', text: 'Little moth\'s gone wobbly on the fumes. Catch it, lad, before it lands in the street.' },
  },
  palLines: {
    tuftle: { who: 'bram', text: 'It\'s got into the flour bin. All I can see is eyes. I\'ve given it a spoon.' },
    lamplick: { who: 'ione', text: 'It licks the lamp and falls over. Then it does it again. I have worked with researchers like this.' },
  },

  upgrades: [
    { id: 'lungs', name: 'Deep Lungs', blurb: 'One more feather each level, and breath comes back faster when frozen.' },
    { id: 'chain', name: 'Longer Chain', blurb: 'Strike and cut lanterns from further away.' },
    { id: 'boots', name: 'Softer Boots', blurb: 'Creep faster, boards carry less, light finds you slower on the move.' },
  ],
};
