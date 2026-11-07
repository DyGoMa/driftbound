// Hold the Deck: everything anyone says. Voices from CAST.md. Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
// Bram calls people love and lad, and cries at onions. Grist doesn't talk; his lines say what he does.
window.HD = window.HD || {};
HD.WORDS = {
  tagline: 'Boarders want the galley. Bram turns to iron to stop them, and the iron doesn\'t all come back off.',

  stages: [
    { name: 'The Slipway',
      hint: 'Tap a lane: Bram goes and swings at anything past the gold line. Keep your thumb down for Iron, and that doesn\'t wash off.',
      talk: [
        { who: 'sela', text: 'Hull\'s patched by morning if the yard doesn\'t rob us. We\'re ashore for timber. Bram, the ship\'s yours.' },
        { who: 'juno', text: 'Ten salvage says somebody tries to rob the cook before we\'re back.' },
        { who: 'bram', text: 'Then they\'d best come hungry, love. There\'s stew on. Grist. Grist, get up.' },
        { who: 'grist', text: 'Grist opens one eye, looks at you, and shuts it again. The deck creaks.' },
      ],
      radio: [
        { wave: 0, at: 5, who: 'bram', text: 'Grey coats on my gangway. Boots on my clean deck.' },
        { wave: 1, at: 2, who: 'kaito', text: 'BRAM! The yard says there\'s Sever on the slip! You good?!' },
        { wave: 1, at: 7, who: 'bram', text: 'Busy, lad. Wipe your feet when you\'re back.' },
      ],
      winLine: { who: 'bram', text: 'That\'s the gangway swept. Mind, they\'ve tracked mud right through.' } },

    { name: 'Hook Lines',
      hint: 'A lit lane means something\'s coming down it. Move, or hold your thumb down for Iron. All three lit? You can\'t walk out: Iron, or take it.',
      hintLocked: 'A lit lane means something\'s coming down it. Move. All three lit? There\'s no Iron left: you take it, and being mostly anvil, it hurts less.',
      talk: [
        { who: 'ione', text: 'Bond-cutters on lines. They throw from range, pin you, then go for Grist. Leave the lane, or hold for Iron and it bounces back. When they all throw at once, there\'s no leaving.' },
        { who: 'bram', text: 'Bounces. Right. Good.' },
        { who: 'ione', text: 'And every Iron stays. Prolonged rigidity is not, in your case, good news. First you get slow. Then you get to be a statue.' },
        { who: 'silas', text: 'Most men go soft after a long day, darling. Trust you to go the other way, for good.' },
      ],
      radio: [
        { wave: 1, at: 3, who: 'juno', text: 'Twenty says you bounce the next one right back up his nose.' },
        { wave: 2, at: 3, who: 'silas', adult: true, text: 'They throw like my third husband. Hard, and not at the right thing.' },
      ],
      winLine: { who: 'juno', text: 'Still standing? Twenty says you feel that in the morning. Twenty more says you won\'t tell Ione.' } },

    { name: 'Crane Hour',
      hint: 'A shadow means a crate. Smash it for salvage, or leave it as a wall they must walk round.',
      talk: [
        { who: 'kaito', text: 'BRAM! They\'ve got the big crane! They\'re dropping cargo on the ship! On OUR ship!' },
        { who: 'bram', text: 'Whose cargo?' },
        { who: 'kaito', text: 'Who gives a shit whose cargo?!' },
        { who: 'juno', text: 'Smash a crate, there\'s salvage in it. Leave it, it\'s a wall. My money\'s on you smashing everything, big man.' },
      ],
      radio: [
        { wave: 0, at: 8, who: 'bram', text: 'That crate says flour. That\'s my flour.' },
        { wave: 1, at: 4, who: 'silas', text: 'The man on that crane is having a lovely time. I do hate to see it.' },
        { wave: 2, at: 4, who: 'kaito', text: 'We\'re coming! Sela says we\'re coming! Don\'t let them touch the good pot!' },
      ],
      winLine: { who: 'bram', text: 'Four crates of good flour. In the rain. On my deck. Now it\'s personal.' } },

    { name: 'The Ram',
      hint: 'A ram takes three swings, one Iron, or one Grist. If it gets to the door it hurts twice.',
      hintLocked: 'A ram takes three swings or one Grist. If it gets to the door it hurts twice.',
      talk: [
        { who: 'hekka', text: 'Torvald. Give me the beetle and you keep your ship. I\'d hate to scrap a good cook.' },
        { who: 'bram', text: 'I\'ve a stew on. Say please and you can have a bowl, love. Then get off my deck.' },
        { who: 'hekka', text: 'Bring up the ram.' },
        { who: 'sela', text: 'We\'re an hour out, Bram. Don\'t you dare do anything noble before I get there.' },
      ],
      talkHigh: { who: 'sela', text: 'We\'re an hour out. I can hear you clanking over the radio, Bram. How far has the grey gone?' },
      radio: [
        { wave: 0, at: 6, who: 'juno', adult: true, text: 'Biggest thing anyone\'s tried on your door, big man. Don\'t get excited.' },
        { wave: 1, at: 4, who: 'hekka', text: 'You\'re tired. I can hear the iron in your knees from here.' },
        { wave: 2, at: 3, who: 'bram', text: 'Grist, lad. If you\'ve anything to say to these people, now\'s the time.' },
      ],
      winLine: { who: 'hekka', text: 'Fine. Cut the chain to the deck. Let it up.' } },

    { name: 'What the Bear Was',
      talk: [
        { who: 'ione', text: 'That\'s a Hollow under your planks. A big one. Hit what comes through. Once it\'s up, only Grist can knock it down to where you can reach the core.' },
        { who: 'bram', text: 'Bears don\'t wear collars, Ione. Somebody put that on it. Somebody used to feed it.' },
        { who: 'hekka', text: 'I did.' },
        { who: 'grist', text: 'Grist gets up. All the way up. Nobody on the Gullwake has ever seen him do that without being bribed.' },
      ],
      loseLines: [
        { who: 'hekka', text: 'Good. Stay down. You\'ll want to be flat for the salvage crew.' },
        { who: 'ione', text: 'The paws, then Grist, then the core. In that order, Bram. Do try to be alive for it.' },
        { who: 'grist', text: 'Grist stands over you, snorting at the bear. He isn\'t going anywhere.' },
        { who: 'juno', text: 'I bet the whole boat on you, big man. Get up, or I\'ll have to sell Kaito.' },
        { who: 'bram', text: 'Aye. Aye, all right. Easy, old thing. Once more.' },
      ] },
  ],

  ending: {
    open: [
      { who: 'hekka', text: 'It had a name. You don\'t get to know it.' },
      { who: 'hekka', text: 'Keep your beetle, Torvald. I\'ve seen that grey before. Give it a year and you\'re a deck fitting, and I\'ll collect him for free.' },
      { who: 'sela', text: 'Late again, and you\'ve gone and saved the ship without me. Bram. Let me see the arm.' },
      { who: 'bram', text: 'Eat first.' },
    ],
    // Which one plays goes by the iron: tuning.js, endingMid and endingHigh.
    low: [
      { who: 'ione', text: 'Hardly any new grey. All that with a hammer and bad manners. As your doctor, I\'m almost impressed. As a scientist, I\'d want to repeat it.' },
      { who: 'juno', text: 'Not a new patch on him and still the softest man on the ship. There\'s a joke in that, and I\'ve got all night.' },
    ],
    mid: [
      { who: 'ione', text: 'New grey down the arm, and you paid for every patch of it. In most men, stiffness is a compliment. In you it\'s a chart. Sit.' },
      { who: 'juno', text: 'Stiff in places and still the nicest man on the ship. There\'s a joke in that, and I\'ve got all night.' },
    ],
    high: [
      { who: 'ione', text: 'Shoulder to hip, and it\'s in the joints. I can slow it. I can\'t shift it. You\'ll want to sit down.' },
      { who: 'bram', text: 'I\'ll stand, love. It\'s the getting up again that takes the time.' },
      { who: 'juno', text: 'Stiff all over and still the nicest man on the ship. There\'s a joke in that, and I\'ll save it.' },
    ],
    close: [
      { who: 'kaito', text: 'Hey, there\'s a full bowl out on the deck, by the big bear. Is that going spare?' },
      { who: 'bram', text: 'No, lad. Leave that one. That one\'s not for you.' },
      { who: 'kaito', text: 'Are you crying?' },
      { who: 'bram', text: 'There\'s onions in it.' },
    ],
  },
  endingCard: { title: 'THE GALLEY HOLDS', text: 'The Gullwake came off the slip with a new hull and scorch marks on the deck. Hekka Dorn took her troopers home and left the chain behind. Bram kept it. Nobody has asked him why.' },
  endingCardHigh: ' He ladles one-handed now, and nobody has asked about that either.',

  loseLines: [
    { who: 'juno', text: 'Ten salvage says the stew\'s still hot. Up, big man, I\'m not losing ten.' },
    { who: 'bram', text: 'Aye. All right. Up we get. Nobody touches the pot.' },
    { who: 'kaito', text: 'HEY! You don\'t get to die, you\'re the only one who can cook!' },
    { who: 'sela', text: 'On your feet, Bram. That\'s an order, and I never give you those.' },
    { who: 'silas', adult: true, text: 'Nobody lays you out but me, darling. Figuratively. Mostly.' },   // adult: left out while a pal's on deck (game.js, loseLine)
    { who: 'ione', text: 'You sound like a man who\'s been stabbed. Which you have. Stand up, please.' },
    { who: 'grist', text: 'Grist nudges you with the horn. When that doesn\'t work, he sits on your foot.' },
    { who: 'trooper', text: 'Galley\'s clear. Somebody find the beetle. And somebody try that stew.' },
  ],
  lockedLose: { who: 'ione', text: 'You\'ve gone a lovely shade of anvil and you\'re too slow to scratch your own arse. I did mention this.' },

  // The try took every volley on the chin and never held for Iron. Dying earned nothing this time.
  noHoldLose: { who: 'ione', text: 'You took every one of those on the chin. The Iron was right there, Bram. Dying isn\'t a cheaper option.' },

  mercy: { who: 'ione', text: 'Strap those ribs. I\'ll lie about it when I\'m back. One more Guts.' },

  // Said once each, when it first happens. adult: true means there's a joke in it, so it keeps quiet while a pal's on deck (batch rule).
  firsts: {
    iron: { who: 'ione', adult: true, text: 'That\'s the Iron. Check your shoulder. That kind of hardness stays.' },
    heavy: { who: 'ione', adult: true, text: 'You sound over half grey. Slower strokes, more mass behind each. Noted.' },
    locked: { who: 'bram', text: 'That\'s it. No more Iron. There\'s nothing left that isn\'t. Hammer it is.' },
    grist: { who: 'bram', text: 'There he is. Press the old lump in the corner. He goes up my lane.' },
    volley: { who: 'ione', text: 'All three lanes! No walking out of that. Hold for Iron, or take it.' },
    volleyLocked: { who: 'ione', text: 'All three lanes, and no Iron left. Brace. Anvils dent less than you do.' },
    through: { who: 'bram', text: 'Oi! Not in my galley!' },
  },

  meals: {
    title: 'BETWEEN WAVES',
    bossTitle: 'ONE BOWL, THEN BACK AT IT',
    text: (g, m, iron) => `One pot, one meal. Guts ${g} of ${m}. Iron ${Math.round(iron * 100)}%.`,
    broth: { label: 'Bone Broth', blurb: n => `Guts +${n}. Puts the marrow back.` },
    pepper: { label: 'Pepper Stew', blurb: n => `Next wave Bram walks and swings ${n}% quicker. Doesn't touch the iron.`, bossBlurb: n => `Till the next bowl, Bram walks and swings ${n}% quicker. Doesn't touch the iron.` },
    tonic: { label: 'Ione\'s Tonic', blurb: n => `Iron back ${n}%. Tastes like a lab accident.` },
    said: {
      broth: { who: 'bram', text: 'That\'s the stuff. You don\'t get this at the yard.' },
      pepper: { who: 'juno', adult: true, text: 'Look at him go! Whatever\'s in that pot, I want a bottle of it for later.' },
      tonic: { who: 'ione', adult: true, text: 'Swallow all of it. Yes, it fizzes. Yes, that\'s the iron flaking off.' },
    },
  },

  warn: { hook: 'HOOK', drop: 'CRATE', wall: 'CRATE', rope: 'BOARDER', paw: 'PAW', swipe: 'CLAWS', charge: 'BEAR', volley: 'ALL LANES: HOLD!', volleyHeld: 'BRACE!', volleyLocked: 'NOWHERE TO GO!' },
  waveName: (i, n) => `WAVE ${i + 1} OF ${n}`,
  endlessWave: i => `WAVE ${i + 1}`,

  palAppear: {
    rivetling: { who: 'bram', text: 'Something small and iron\'s shuffling up to me. Easy, lad. I\'ll stay Iron.' },
    spoonling: { who: 'juno', text: 'Bram, your stew\'s got a fan. Go and say hello before it robs you.' },
  },
  palLines: {
    rivetling: { who: 'bram', text: 'It\'s curled up in my toolbox. It thinks I\'m one of its own. ...It may be right.' },
    spoonling: { who: 'bram', text: 'Look at that tail. Go on, then, one bowl. One. ...Who am I kidding.' },
  },

  upgrades: [
    { id: 'apron', name: 'Thick Apron', blurb: 'One more Guts per stage, each level.' },
    { id: 'temper', name: 'Grist\'s Temper', blurb: 'His meter fills faster.' },
    { id: 'pot', name: 'Big Pot', blurb: 'Every meal does more.' },
  ],
};
