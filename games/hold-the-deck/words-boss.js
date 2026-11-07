// Hold the Deck: what's said on the bear, and its hints. The rest of the words are in words.js. Voices from CAST.md.
HD.WORDS.bossHint = [
  'Paws burst up through a lit lane. Step out, then step back and hit them. All three lit: hold for Iron.',
  'It\'s out of reach. Press Grist to send him up a lane and knock it down, then hit the core.',
  'It charges the lit lane. Step out and hit the core as it skids. Hold for Iron and it stays down longer.',
];

// At full iron the hints stop telling him to do what he can't. Middle one's the same either way.
HD.WORDS.bossHintLocked = [
  'Paws burst up through a lit lane. Step out, then step back and hit them. All three lit: brace, there\'s no Iron left.',
  null,
  'It charges the lit lane. Step out and hit the core as it skids.',
];

HD.WORDS.boss = {
  p1: { who: 'hekka', text: 'Up through the planks. Start with the kitchen.' },
  paw: { who: 'bram', text: 'Hit the paw! Hit it, it\'s in my deck!' },
  meal1: { who: 'ione', text: 'It\'s coming up. Eat something. You\'ve got one bowl\'s worth of time.' },
  p2a: { who: 'hekka', text: 'There. Look at it, Torvald.' },
  p2b: { who: 'hekka', text: 'That\'s what a bond is for.' },
  bram2: { who: 'bram', text: 'Easy, old thing. Easy now. Grist, lad, I need you.' },
  knocked: { who: 'ione', text: 'Core\'s open! Hit it, Bram! Hit the white!' },
  closed: { who: 'hekka', text: 'Up. Get up. Again.' },
  meal2: { who: 'sela', text: 'We\'re alongside, Bram! Hold on! Eat something, you stubborn bastard!' },
  p3: { who: 'hekka', text: 'Cut the chain. Let it go.' },
  bram3: { who: 'bram', text: 'No chain now. It doesn\'t know you any more, love. It doesn\'t know anybody.' },
  block: { who: 'juno', text: 'CLANG! Did you hear that?! Twenty says that hurt the bear more!' },
  run: { who: 'kaito', text: 'It\'s turning round! BRAM, IT\'S TURNING ROUND!' },
  mercy: { who: 'ione', text: 'It kept the damage from your last go. So did your ribs, so I\'ve strapped them. More Guts, less bear.' },
  advice: { who: 'ione', text: 'That grey\'s the problem. Go again: it stays hurt. Or buy the Thick Apron. Or start over from the Slipway and hold less.' },
  fall: [
    { who: 'hekka', text: 'Get up.' },
    { who: 'hekka', text: 'I said get up.' },
    { who: 'bram', text: 'It\'s done, love. Let it lie.' },
  ],
};
