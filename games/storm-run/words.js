// Storm Run: everything the crew says. Voices from CAST.md. Full flavour inside the World Bible hard rules. Pals stay out of the jokes.
window.SR = window.SR || {};
SR.WORDS = {
  tagline: 'Pinhold is being nailed in place. Run it, steal the chart, and pay for every Surge.',

  stages: [
    { name: 'The Pin Road', hint: 'Tap: short hop. Hold: full jump. Tap in the air: Surge.',
      talk: [
        { who: 'sela', text: 'Over the wall, down the road, take the survey chart from the tower, back to the ship. No heroics, pup.' },
        { who: 'kaito', text: 'Heroics? I\'m just gonna run really fast and yell at anyone in the way.' },
        { who: 'juno', text: 'Ten salvage says he\'s yelling before the first checkpoint.' },
        { who: 'kaito', text: 'HEY! ...Shit. That counts, doesn\'t it.' },
      ],
      radio: [{ at: 0.45, who: 'juno', text: 'Pay up, Bram. He yelled.' }, { at: 0.8, who: 'bram', text: 'I never took that bet, Juno.' }],
      winLine: { who: 'kaito', text: 'Ha! Not a scratch! ...Okay. Some scratches.' } },
    { name: 'Chain Yard', hint: 'Tall barricades take a Surge. Every Surge climbs the arm.',
      talk: [
        { who: 'ione', text: 'The barricades in the yard are taller than your legs. You\'ll need a Surge, and each one burns further up the arm.' },
        { who: 'kaito', text: 'Yeah, yeah. Scars are cool.' },
        { who: 'ione', text: 'At the top the nerve quits. Numb arm, no Surge. It\'s very common in excitable men.' },
        { who: 'silas', text: 'Pace yourself, darling. Nobody\'s impressed by how fast you finish.' },
      ],
      radio: [{ at: 0.5, who: 'sela', text: 'Mind the arm, pup. I can see it glowing from up here.' }],
      winLine: { who: 'silas', text: 'See? Pacing. I\'ll make a gentleman of you yet.' } },
    { name: 'Searchlight Row', hint: 'Hollows: stay down when they pass high, hop when they dive.',
      talk: [
        { who: 'bram', text: 'Those things in the air were somebody\'s partners once. Don\'t look at the eyes, lad. Just keep moving.' },
        { who: 'kaito', text: 'What if one swoops me?' },
        { who: 'bram', text: 'Then you stay low and you come home. I\'ve saved you a bowl.' },
        { who: 'skarn', text: 'A long growl from overhead. He doesn\'t like the smell of them either.' },
      ],
      radio: [{ at: 0.3, who: 'ione', text: 'Blank eyes, white core. That was my procedure. Keep running.' }, { at: 0.75, who: 'kaito', text: 'Got the chart! Who\'s a heroic bastard now?' }],
      winLine: { who: 'bram', text: 'That\'s my lad. Don\'t look back at them.' } },
    { name: 'Pylon Four',
      talk: [
        { who: 'sela', text: 'You\'ve got the chart. Now get off that rock before the last pylon bites home. We\'re at the far edge.' },
        { who: 'silas', text: 'Company behind you. Big hound, long coat, no face. I\'ve had worse dates, but not many.' },
        { who: 'silt', text: 'Brask. I\'ve followed the stink of that burnt arm across eleven islands.' },
        { who: 'kaito', text: 'You want a fight or a sniff, you creepy bastard? Pick one!' },
      ],
      radio: [{ at: 0.4, who: 'silt', text: 'You run loud. It\'s why you\'re still the fun one.' }, { at: 0.8, who: 'kaito', text: 'Quit talking in my ear, you freak!' }],
      winLine: { who: 'silt', text: 'End of the road, Brask. Turn around.' } },
    { name: 'The Long Drop', hint: 'Jump, then Surge into the white core when it opens.',
      talk: [
        { who: 'silt', text: 'Run. It\'s better when you run.' },
        { who: 'kaito', text: 'Get off the dog and say that, you masked prick!' },
        { who: 'ione', text: 'Its core is shielded. The plates part after it lunges. Jump, then Surge straight into the white. Three should do it.' },
        { who: 'juno', text: 'Three good thrusts, Kaito. Even you can last for three.' },
      ],
      loseLines: [
        { who: 'silt', text: 'Again. I like it when you get up.' },
        { who: 'silt', text: 'Eleven islands, for this?' },
        { who: 'sela', text: 'The core, pup. Not his teeth.' },
        { who: 'juno', text: 'I had money on you lasting longer. Story of my life.' },
      ] },
  ],

  ending: [
    { who: 'silt', text: 'Hm. You\'ve improved. Keep that arm warm for me, Brask. I\'ll be back for it.' },
    { who: 'kaito', text: 'I\'m gonna rip that mask off and draw your ugly face on my map!' },
    { who: 'sela', text: 'Chart, pup. Hand it up. ...You ran the whole island with that arm?' },
    { who: 'ione', text: 'The nerve is cooked. It will be numb for days. Try not to use it for anything important.' },
    { who: 'juno', text: 'Days? You poor thing. You\'ll have to learn to do everything left-handed.' },
    { who: 'kaito', text: 'What\'s that supposed to... SHUT UP, JUNO.' },
    { who: 'bram', text: 'Sit. Eat. All of you. I\'m not crying, it\'s the onions.' },
    { who: 'sela', text: 'Good run, pup. Pinhold\'s still nailed down, but now we know where they\'re pinning next.' },
  ],
  endingCard: { title: 'THE CHART IS OURS', text: 'Silt got away with a cracked mask. Kaito\'s arm stayed numb for days. And the Gullwake now holds the Empire\'s own survey chart: every island the Empire means to pin next.' },

  loseLines: [
    { who: 'sela', text: 'Up you get, pup. The island isn\'t going anywhere. That\'s rather the problem.' },
    { who: 'juno', text: 'Pay up, boys. I had him dying on that one.' },
    { who: 'silas', text: 'Darling, the idea is to go over them, not through.' },
    { who: 'bram', text: 'Slow breath, lad. Now go and break something.' },
    { who: 'ione', text: 'Cause of failure: you. I\'ll note it in the file.' },
    { who: 'kaito', text: 'Ow. OW. Okay. Again. AGAIN, you grey-coated shits!' },
    { who: 'skarn', text: 'Skarn lands beside you, sniffs once, and looks disappointed.' },
  ],
  numbLose: { who: 'ione', text: 'Numb arm, no Surge, and you still picked a fight. I\'ll call that the control group.' },

  numb: [
    { who: 'ione', text: 'That\'s the nerve gone. No Surge till it wakes up. Run like a normal idiot.' },
    { who: 'juno', text: 'Arm gone dead? Don\'t worry, Kaito. It happens to everyone.' },
    { who: 'sela', text: 'Easy, pup. Feet only for a bit.' },
    { who: 'skarn', text: 'Skarn whines overhead. The fin goes dim.' },
  ],

  boss: {
    start: { who: 'silt', text: 'You\'re the only one who keeps getting up. I do love that about you.' },
    hit: [
      { who: 'silt', text: 'Good. Again.' },
      { who: 'silt', text: 'Burning that arm for one dog. I admire the waste.' },
      { who: 'kaito', text: 'THAT\'S for the eleven islands, you creep!' },
    ],
    miss: { who: 'sela', text: 'You missed the opening, pup. It\'s coming back. Jump!' },
    numbOpen: { who: 'silt', text: 'Arm gone already? Pity. I wanted you awake for this.' },
  },

  palAppear: {
    fizzlet: { who: 'kaito', text: 'Is that cloud walking?' },
    boltnip: { who: 'juno', text: 'Kite up high, flying itself. Fifty says you can\'t reach it.' },
  },
  palLines: {
    fizzlet: { who: 'bram', text: 'It\'s raining on my stew, and I don\'t even mind. It can stay.' },
    boltnip: { who: 'kaito', text: 'It landed on me and zapped me! I love it. We\'re keeping it!' },
  },

  upgrades: [
    { id: 'cool', name: 'Cool Scars', blurb: 'The scars on the arm fade faster.' },
    { id: 'pull', name: 'Salvage Pull', blurb: 'Salvage flies to Kaito from further away.' },
    { id: 'catch', name: 'Skarn\'s Catch', blurb: 'Skarn snatches him out of one hit per run. One more each level.' },
  ],
};
