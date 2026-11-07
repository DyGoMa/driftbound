// Split Light: everything anyone says. Voices from CAST.md; Vasch's history with Ione from shared/stories.js ("the work I began on you", the count of ten, "my best work").
// Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
window.SL = window.SL || {};
SL.WORDS = {
  tagline: 'Ione goes back to the lab she helped build. Bounce Prism\'s beam through every Hollow core, and live with what each shot grows.',

  boss: { name: 'Director Vasch', win: { who: 'vasch', text: 'Well. That will leave a mark. On both of us, I should think.' }, talk: [
    { who: 'vasch', text: 'Doctor Raske. Your hexagon is still cracked. Five of ten. Sit down and I\'ll finish the count, and the crystals stop. That is all mercy is.' },
    { who: 'ione', text: 'No.' },
    { who: 'vasch', text: 'Then show me what you learned. I\'d hate to have wasted the first five.' },
    { who: 'prism', text: 'Prism\'s wings open. All the light in the room goes to pieces.' },
  ],
  loseLines: [
    { who: 'vasch', text: 'Again. You always did your best work on the third draft.' },
    { who: 'vasch', text: 'Five of ten, Doctor. Shall I finish?' },
    { who: 'vasch', text: 'Sit. You\'re tired. I\'ve kept your chair.' },
    { who: 'sela', text: 'Get up, Ione. That bastard doesn\'t get to be right.' },
    { who: 'ione', text: 'Hypothesis: he talks because it works. Second attempt.' },
    { who: 'prism', text: 'Prism steps between you and the glass, blades up, and doesn\'t look back.' },
  ] },

  ending: [
    { who: 'vasch', text: 'There. You\'ve cracked the chamber. Eleven years\' work, in my own arm. I\'d mark that a distinction.' },
    { who: 'ione', text: 'Why did you stop at five?' },
    { who: 'vasch', text: 'You were taking notes, Doctor. Screaming, and taking notes, with your other hand. I wanted to see what you\'d write.' },
    { who: 'ione', text: 'And?' },
    { who: 'vasch', text: 'Your handwriting never improved. Burn them. I copied every page the night you ran. I only asked so you\'d come home.' },
    { who: 'sela', text: 'East dock, Doctor. Now. That dome\'s coming down, and I\'m not explaining it to Bram.' },
    { who: 'kaito', text: 'We got you! Did you burn the notes? Did you kill that bastard?' },
    { who: 'ione', text: 'The notes are ash. He left by the back with a broken arm. It\'s a good result. I\'ll write it up.' },
    { who: 'bram', text: 'You\'re shaking, Doc. Sit. There\'s soup. Give me that arm, and don\'t tell me it\'s nothing. I\'m not crying, it\'s the onions.' },
    { who: 'prism', text: 'Prism folds up against her side with her wings shut, and for once the whole ship goes without rainbows.' },
  ],
  endingCard: { title: 'THE WARD IS DARK', text: 'Every core in the Glass Ward burned out, and Ione\'s old notes with them. Director Vasch left by the back way with a cracked arm and a calm smile. He still hasn\'t said why he kept her desk.' },

  loseLines: [
    { who: 'ione', text: 'Result: negative. Repeat the experiment. That\'s what the word means.' },
    { who: 'juno', text: 'Out of shots already? Shit, Doctor, it happens to the best of them.' },
    { who: 'silas', text: 'Darling, nobody\'s counting. ...Ione\'s counting.' },
    { who: 'kaito', text: 'Just shoot the damn thing harder!' },
    { who: 'bram', text: 'Breathe, Doc. The crystals will keep. Try again when your hands stop.' },
    { who: 'sela', text: 'The Ward isn\'t going anywhere. That\'s rather the point of it.' },
    { who: 'prism', text: 'Prism taps a glass forearm on the floor, twice. Again.' },
  ],

  // Small talk during play. Short, so the box stays in the strip above the board.
  grow: [
    { who: 'ione', text: 'There\'s another one. Noted.' },
    { who: 'ione', text: 'Ow. That\'s data.' },
    { who: 'ione', text: 'It came up on my wrist too. Fascinating. Ow.' },
    { who: 'prism', text: 'Prism flinches when the crystal cracks.' },
    { who: 'ione', text: 'Growth logged. I\'ve stopped naming them.' },
  ],
  growFirst: { who: 'ione', text: 'A crystal grows where the beam stops. It leans /, and it won\'t turn.' },
  retryKept: [
    { who: 'ione', text: 'Crystals reset. Shots don\'t. What\'s in my way stays.' },
    { who: 'ione', text: 'New trial, same mess. Spent shots stay spent, and the count stands.' },
  ],
  scarGone: [
    { who: 'ione', text: 'Useful or fatal, it cracked off. What\'s in my way stays.' },
  ],
  crush: { who: 'ione', text: 'The rail crushed that growth. Small mercies.' },
  growTap: [
    { who: 'ione', text: 'That one doesn\'t turn. It isn\'t a tool. It\'s a symptom.' },
    { who: 'ione', text: 'Growths don\'t turn. Believe me, I\'ve tried.' },
  ],
  clamp: { who: 'ione', text: 'Clamped. It turns when I say. I said never.' },
  armourClang: { who: 'ione', text: 'Armour. Find the open side. It\'s the side with the gold marks.' },
  twinBack: { who: 'ione', text: 'One of a linked pair won\'t do it. Same shot, both of them.' },
  dead: [
    { who: 'ione', text: 'No way through now. Retry. A failed trial is still a result.' },
    { who: 'ione', text: 'That growth has shut it. Retry. I\'ll make a note of it.' },
  ],
  bossDead: { who: 'vasch', text: 'No way through. Reset the board, Doctor. It\'ll cost you.' },
  arm: [
    { at: 14, who: 'ione', text: 'That\'s past the wrist now. Carry on.' },
    { at: 28, who: 'bram', text: 'Doc. Your arm. Promise me you\'ll let me look at it.' },
    { at: 42, who: 'silas', text: 'Up the neck, darling. Very striking. Please stop.' },
  ],

  bossSay: {
    phaseStart: [
      { who: 'vasch', text: 'A demonstration. They move when you fire. Everything does.' },
      { who: 'vasch', text: 'Now the same on a metronome. Linked pair. Do keep time.' },
      { who: 'vasch', text: 'This one is mine. The opening turns. Each side you use, I seal.' },
    ],
    phaseWon: [
      { who: 'ione', text: 'One demonstration refuted. Next.' },
      { who: 'vasch', text: 'Good. Good. You still hold your breath before you fire.' },
    ],
    stockHit: [
      { who: 'vasch', text: 'One down. You still rush the fourth step.' },
      { who: 'ione', text: 'That one had a name once. I never asked it.' },
      { who: 'vasch', text: 'Competent. Do you remember when that was enough for you?' },
    ],
    hit: [
      { who: 'vasch', text: 'That was my arm, Doctor. A little rude.' },
      { who: 'ione', text: 'Eleven years\' work. It cracks like anything else.' },
      { who: 'vasch', text: 'I taught you that angle. I\'m almost proud.' },
    ],
    miss: [
      { who: 'vasch', text: 'A wasted shot, and a new shard. Why do this to yourself?' },
      { who: 'vasch', text: 'Look at your wrist. Then tell me it\'s love.' },
      { who: 'vasch', text: 'I can make that stop. Five more counts.' },
      { who: 'vasch', text: 'You rushed. You always rush the fourth step.' },
    ],
    corrected: [
      { who: 'vasch', text: 'I\'ve corrected one of yours. Do check your work.' },
      { who: 'vasch', text: 'That crystal was wrong. I\'ve fixed it for you.' },
      { who: 'vasch', text: 'Marked. See me after.' },
    ],
    reset: [
      { who: 'vasch', text: 'From the top, then. That\'s a point off your nerve.' },
      { who: 'vasch', text: 'Again. Your hands are shaking. I can see them from here.' },
    ],
    wait: { who: 'vasch', text: 'Take your time. You never did, but do.' },
    countTeach: { who: 'vasch', text: 'I count while you dither, Doctor. At ten, I fire for you.' },
    countLate: { who: 'vasch', text: 'Seven. Eight. Do keep up.' },
    countFire: { who: 'vasch', text: 'Ten. Allow me.' },
    down: { who: 'ione', text: 'Count of three, Aurel. I stopped when I was finished.' },
  },

  palAppear: {
    glimmick: { who: 'ione', text: 'Something is crawling along the frame. Very slowly. Tap it.' },
    shardle: { who: 'ione', text: 'That long shot woke something. Listen: it rings. Tap it!' },
  },
  palLines: {
    glimmick: { who: 'ione', text: 'A snail, with a crystal shell. No bond, no cost, no idea how. I\'m not crying. It\'s refraction.' },
    shardle: { who: 'bram', text: 'It rings every time it hops, and it\'s followed me to the galley. All right, little one. Have a crust.' },
  },

  upgrades: [
    { id: 'steady', name: 'Steady Hand', blurb: 'Undo one shot a board, Retry or not. One more each level.' },
    { id: 'scraper', name: 'Shard Scraper', blurb: 'Scrape one growth a board, Retry or not. One more each level.' },
    { id: 'look', name: 'Second Look', blurb: 'The aim line shows the beam\'s first bounce. One more bounce each level.' },
  ],
};
