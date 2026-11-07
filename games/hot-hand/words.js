// Hot Hand: everything anyone says. Voices from CAST.md. Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
// adult: true means flirting or innuendo, so the line keeps quiet while a pal is out (batch rule). fire.js, game.js and table.js check it.
window.HH = window.HH || {};
HH.WORDS = {
  tagline: 'Ashmarket is under raid and they flipped her table. Throw fire, hold the top of the heat, and bet on yourself.',

  stages: [
    { name: 'Card Row', hint: 'Tap a trooper to throw. The hotter your hands, the harder it hits.',
      talk: [
        { who: 'juno', text: 'Full house, kings over nines. Best hand of my life, three hundred salvage on the felt. And some grey coat flips my table.' },
        { who: 'sela', text: 'You said ten minutes, Juno. The ship has been waiting an hour.' },
        { who: 'juno', text: 'I said ten minutes and a sure thing, Captain. Got the sure thing. Tell Bram I\'m bringing home the keel money, and a few of these boys, well done.' },
        { who: 'ashka', text: 'Ashka lands on your shoulder, drops a burnt playing card, and stares at the nearest trooper.' },
      ],
      radio: [{ wave: 0, at: 6, who: 'juno', adult: true, text: 'Come on, boys. Who wants to feel my hands?' }, { wave: 1, at: 2, who: 'juno', text: 'Hotter hands, harder throws. Just stay off the red.' }, { wave: 2, at: 3, who: 'sela', text: 'Keep them warm. The plates don\'t care about cold fire.' }],
      winLine: { who: 'juno', text: 'Three waves, one singed eyebrow, and I\'m still up on the night.' } },

    { name: 'Dice Alley', hint: 'Narrow street: they bunch up. A HOT throw burns whoever stands next to the target.',
      talk: [
        { who: 'ione', text: 'Your temperature concerns me. Past forty-one degrees, the proteins in your hands begin making poor decisions.' },
        { who: 'juno', text: 'Doc, I\'ve made my worst decisions way hotter than that.' },
        { who: 'kaito', text: 'Ten says you cook your own hands before the end of the alley!' },
        { who: 'juno', text: 'Ten says you cry when I do, Sparky. Make it twenty. You\'re adorable when you\'re broke.' },
      ],
      radio: [{ wave: 1, at: 7, who: 'kaito', text: 'That\'s my ten looking safer every second!' }, { wave: 2, at: 8, who: 'ione', adult: true, text: 'Your pulse says you\'re enjoying this. That\'s not ideal.' }],
      winLine: { who: 'kaito', text: 'Okay, you still have hands. Doesn\'t mean I\'m paying!' } },

    { name: 'The Long Table', hint: 'Rain cools you fast, so throw fast. Watch the top windows.',
      talk: [
        { who: 'silas', text: 'Ah, the Long Table. I lost a boat here once, and a very nice man, on the same evening.' },
        { who: 'juno', text: 'What am I looking at, smuggler?' },
        { who: 'silas', text: 'Shooters behind the top-floor shutters, darling, and rain coming in. It will cool you off faster than you\'d like.' },
        { who: 'juno', text: 'Nothing\'s ever cooled me off faster than you saying "darling".' },
      ],
      radio: [{ wave: 0, at: 8, who: 'silas', adult: true, text: 'A little more wrist, darling. People are watching.' }, { wave: 2, at: 6, who: 'bram', text: 'Powder carts near the kegs, lass! Mind your eyebrows!' }],
      winLine: { who: 'silas', adult: true, text: 'Soaked to the skin and still smoking. I have never been more jealous of a jacket.' },
      winLineClean: { who: 'silas', text: 'Soaked to the skin and still smoking. Very nicely done.' } },

    { name: 'The Pit', hint: 'They come from both sides. It\'s all on fire: you cool slowly here.',
      talk: [
        { who: 'juno', text: 'What\'s all that noise? ...Aw, no. No, no, no.' },
        { who: 'bram', text: 'Cages, lass. Every partner on this island, down in the fighting pit, with their people made to watch.' },
        { who: 'ione', text: 'That\'s a portable cutting rig. They strip the first one in front of everyone, and the rest come quietly. I wrote that page of the manual.' },
        { who: 'juno', text: 'Ashka. Mark everything that moves. I\'m all in.' },
      ],
      radio: [{ wave: 0, at: 5, who: 'krell', text: 'You\'re on my count now, Calloway. Keep burning.' }, { wave: 2, at: 9, who: 'ione', adult: true, text: 'Finish this and I\'ll say something kind about your hands.' }],
      winLine: { who: 'bram', text: 'That\'s the last of the cages, lass. You look awful. I\'m so proud I could weep.' } },

    { name: 'The Vault Steps', hint: 'Shields are solid. Throw into a vent when it opens, as hot as you dare.',
      talk: [
        { who: 'krell', text: 'Calloway, Juno. Bonded, fire. Nineteen counts of open flame, one count of illegal gambling. Step into line.' },
        { who: 'juno', text: 'Warden, you\'re holding my winnings. And you\'re standing awful close to a woman with a hot hand.' },
        { who: 'ione', text: 'His shield line runs off a boiler. The vents open on a cycle. Feed them enough heat, and it stops being a line and becomes shrapnel.' },
        { who: 'juno', text: 'Doc, that\'s the sexiest thing you\'ve ever said to me.' },
      ],
      loseLines: [
        { who: 'krell', text: 'Count\'s still right. Get up, or don\'t. I have a form for both.' },
        { who: 'krell', text: 'Everyone burns out, Calloway. I just keep the records.' },
        { who: 'juno', text: 'Ow. Okay. Double or nothing, you big grey bastard.' },
        { who: 'sela', text: 'The vents, Juno. Not his face. I know. It\'s a very good face to hit.' },
        { who: 'ione', text: 'Boilers respond to pressure. So, I\'m told, do wardens. Again.' },
      ] },
  ],

  ending: [
    { who: 'krell', text: 'Count\'s... off.' },
    { who: 'juno', text: 'Yeah it is. Read \'em and weep, Warden. House pays out.' },
    { who: 'bram', text: 'Every cage is open, lass. Folk are crying and hugging their beasts, and I\'m not crying, it\'s the smoke.' },
    { who: 'kaito', text: 'You did all that with your bare hands? ...Okay. That was kind of cool.' },
    { who: 'juno', text: 'Kind of? Sparky, I could have boiled you from across the street. Pay up.' },
    { who: 'ione', text: 'Gloves off. Show me your hands.' },
    { who: 'juno', text: 'Buy me dinner first, Doc.' },
    { who: 'ione', text: 'Juno. Hands.' },
    { who: 'juno', text: '...It\'s fine. It always looks like this. It looks worse than it is.' },
    { who: 'ione', text: 'It looks exactly as bad as it is. Salve, twice a day. Don\'t bet on it healing.' },
    { who: 'juno', text: 'Ten says it scars.' },
    { who: 'ione', text: 'It already has.' },
    { who: 'juno', text: 'Then I win. Come on, bird. Let\'s go spend it.' },
  ],
  endingCard: { title: 'THE HOUSE PAYS OUT', text: 'Krell\'s line is scrap and every cage in the Pit stands open. Juno walked off with her winnings, a bird on her shoulder and her palms back under her gloves. And in the vault, the Warden\'s own ledger: every partner the Sever has counted, and where they were sent.' },

  loseLines: [
    { who: 'juno', text: 'Ow. Okay. Double or nothing.' },
    { who: 'sela', text: 'Up, Juno. You still owe me for the last time.' },
    { who: 'kaito', text: 'Ha! You owe me ten! ...You okay? You\'re okay. TEN.' },
    { who: 'silas', adult: true, text: 'When they say "hold \'em", darling, they don\'t mean the blade.' },
    { who: 'bram', text: 'Come on, lass. There\'s stew. You can\'t eat lying down.' },
    { who: 'ione', adult: true, text: 'Cause of failure: confidence. It\'s often fatal, and yours is a very large dose.' },
    { who: 'ashka', text: 'Ashka lands on your chest, screams in your face, and doesn\'t stop until you get up.' },
    { who: 'juno', text: 'I meant to do that. Nobody look at me.' },
  ],
  burnLose: [
    { who: 'ione', text: 'You cooked yourself. There wasn\'t a scratch from the enemy on that one. I\'ll note the temperature.' },
    { who: 'bram', text: 'You\'ve gone and cooked yourself, lass. That\'s my job, and I use a pot.' },
    { who: 'silas', adult: true, text: 'Nobody laid a finger on you, darling. All your own work.' },
    { who: 'kaito', text: 'You set YOURSELF on fire?! Ha! ...That\'s still ten you owe me.' },
    { who: 'juno', text: 'Okay. That one was me. My hands, my fault, my eyebrows.' },
  ],

  lock: [
    { who: 'ione', text: 'Forty-two degrees. Your hands have stopped taking orders.' },
    { who: 'kaito', adult: true, text: 'Hands gone? Ha! Happens to the best of us! Not me, though.' },
    { who: 'juno', text: 'Shit shit shit HOT. Ow. Worth it. Ow.' },
    { who: 'silas', adult: true, text: 'Too much, too soon, darling. We don\'t talk about it.' },
    { who: 'ashka', text: 'Ashka shrieks and beats her wings over your hands.' },
  ],
  bust: [
    { who: 'juno', text: 'Shit. There goes the pot.' },
    { who: 'kaito', text: 'HA! Bust! Tell me that didn\'t hurt!' },
    { who: 'silas', adult: true, text: 'Never mind, darling. It was only money.' },
    { who: 'ashka', text: 'Ashka looks at the chips. Ashka looks at you.' },
    { who: 'sela', text: 'That was the keel money, Juno. I was counting.' },
  ],
  bustBoss: { who: 'krell', text: 'Forfeit. The house keeps that.' },
  betWin: [
    { who: 'juno', text: 'Read \'em and weep!' },
    { who: 'sela', text: 'You\'re insufferable when you win. Well done.' },
    { who: 'bram', text: 'Put some by for the galley, lass.' },
    { who: 'kaito', text: 'How?! Nobody\'s that lucky! Are you cheating?' },
  ],

  first: {
    plate: { who: 'juno', text: 'Plate! Cold fire just bounces. Get your hands WARM first.' },
    runner: { who: 'sela', text: 'Runners! They don\'t stop for a chat.' },
    hook: { who: 'sela', text: 'Hook-man! When it flies, tap it in the air and burn it.' },
    sniper: { who: 'silas', adult: true, text: 'Top windows, darling. Tap them while the shutters are open.' },
    cart: { who: 'bram', text: 'Powder cart! Light it when his mates are close, lass.' },
    hollow: { who: 'ione', text: 'A Hollow. Plates shut when it moves. Tap when it stops.' },
    mark: { who: 'ashka', text: 'Ashka marks one: hit it for no heat, and she cools you.' },
    edge: { who: 'juno', text: 'Gold on the bar: the hot hand. Best throw I\'ve got. Throw!' },
    over: { who: 'ione', text: 'Red on the bar: the next throw goes over the top. Wait.' },
  },

  boss: {
    start: { who: 'krell', text: 'Shields front. March. Nobody bets on my line.' },
    overload: [
      { who: 'juno', text: 'That\'s one! Who\'s next?' },
      { who: 'krell', text: 'Replace that man.' },
      { who: 'ione', text: 'Lovely. It\'s all about the pressure.' },
    ],
    expose: { who: 'juno', text: 'There\'s my boy! Nothing in front of you now, Warden!' },
    reform: { who: 'krell', text: 'Close the line. Again.' },
    hit: [
      { who: 'krell', text: 'Noted.' },
      { who: 'krell', text: 'That\'s a fine. You\'ll pay it.' },
    ],
    round: [
      { who: 'krell', text: 'Second line. Bring the quench. Put that woman out.' },
      { who: 'krell', text: 'All of it. Everything we have. Count them later.' },
    ],
    quench: { who: 'sela', text: 'He\'s throwing water! Burn the can, or it takes your heat!' },
    ramSoon: { who: 'sela', text: 'Line\'s closing, Juno. Blow those vents before they charge!' },
    ram: { who: 'sela', text: 'They\'re charging! Finish those vents or brace, Juno!' },
  },

  bet: {
    title: 'DOUBLE OR NOTHING',
    won: n => 'Bet won: +' + n + '. ',
    lost: n => 'Bet lost: ' + n + ' gone. ',
    body: (table, x) => 'The table holds ' + table + '. No damage next wave and your bet pays ' + x + ' times. One hit or one burn and it\'s gone.',
    last: (table, x) => 'The table holds ' + table + '. No damage next round and your bet pays ' + x + ' times. One hit or one burn and it\'s gone.',
    quips: [
      'Juno: "You didn\'t come here to be careful."',
      'Juno: "Ten says you flinch."',
      'Sela: "Juno. The keel money." Juno: "I heard you."',
      'Juno: "Nobody ever got rich cashing in."',
      'Kaito: "Don\'t do it!" Juno: "Now I have to."',
      'Bram: "There\'s stew either way, lass."',
    ],
    adultQuips: ['Silas: "Quit while you\'re pretty, darling."'],   // left out while a pal is out (table.js)
    cash: 'Cash in',
    half: 'Bet half',
    all: 'Let it ride',
    cashBlurb: n => '+' + n + ' safe, right now',
    ridesBlurb: (keep, stake, pays) => (keep > 0 ? '+' + keep + ' safe, ' : '') + stake + ' rides for ' + pays,
    limit: n => 'The house takes ' + n + ' at most: the rest is paid out safe.',
    hiddenTitle: 'CASHED IN',
    hiddenBody: n => 'You walked away from the table, so Juno scooped it up: +' + n + ' safe. Nothing rides on the next one.',
    hiddenGo: 'Back to it',
  },

  palAppear: {
    cinderbun: { who: 'bram', text: 'An ember dumpling, lass! Get the bar to gold, then tap it.' },
    dicemite: { who: 'juno', text: 'A bug rolling its own shell! Tap it on a six.' },
  },
  palCold: 'TOO COLD',
  palLines: {
    cinderbun: { who: 'bram', text: 'Warmer than my stove and it hasn\'t touched the soup yet. It can stay.' },
    dicemite: { who: 'juno', text: 'A six on the shell! You\'re coming with me, you lucky little bug.' },
  },

  upgrades: [
    { id: 'cool', name: 'Cool Palms', blurb: 'Her hands cool faster, and a lock lets go sooner.' },
    { id: 'flame', name: 'Bigger Flame', blurb: 'Hot throws burn wider. Level 2: warm throws burn too. Level 3: hot throws hit harder.' },
    { id: 'deck', name: 'Loaded Deck', blurb: 'A won bet pays more: ' + (TUNE.betX + TUNE.betXPerLevel) + ', ' + (TUNE.betX + 2 * TUNE.betXPerLevel) + ', then ' + (TUNE.betX + 3 * TUNE.betXPerLevel) + ' times.' },
  ],
};
