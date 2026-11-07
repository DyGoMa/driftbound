// Split Light: the talk before each level, and the line after it. Everything else anyone says is in words.js.
// winOver: said instead of win when the clear went over par, where win would praise a clean solve that didn't happen.
SL.WORDS.levels = [
  { name: 'First Light', talk: [
    { who: 'sela', text: 'Glass Ward. Dead two years, and every light on the top floor is burning. Why is that, Doctor?' },
    { who: 'ione', text: 'Because nobody shut off the cores. I know. It was on my list.' },
    { who: 'juno', text: 'Ten salvage says some damn thing in there is still twitching.' },
    { who: 'ione', text: 'Nothing twitches. Prism aims, I turn the crystals, we burn them out. Gently at first. That\'s just good technique.' },
  ], win: { who: 'ione', text: 'One core out. It didn\'t even flicker. I built them well.' } },
  { name: 'Two Turns', talk: [
    { who: 'silas', text: 'Two mirrors, darling? I had no idea you liked to watch.' },
    { who: 'ione', text: 'Angle in equals angle out. It\'s the only honest relationship I\'ve ever had.' },
  ], win: { who: 'silas', text: 'And she finishes without looking up. I\'m taking notes.' } },
  { name: 'Through and Through', talk: [
    { who: 'kaito', text: 'So the beam goes through the core and just keeps going? Hell yeah! Does it hurt them?' },
    { who: 'ione', text: 'They stopped feeling things when I removed what they felt with. Fire through. Be thorough.' },
  ], win: { who: 'kaito', text: 'Two with one shot! ...Ione? You okay? You went really quiet.' },
     winOver: { who: 'kaito', text: 'Got them both! Took a few, who cares! ...Ione? You okay? You went really quiet.' } },
  { name: 'Clamps', talk: [
    { who: 'bram', text: 'Some of these are bolted down, Doc. Someone was scared of them moving.' },
    { who: 'ione', text: 'Me. I bolted them. I don\'t like it when things turn without asking. It\'s come up.' },
  ], win: { who: 'bram', text: 'That\'s the intake clear. I\'ve kept a bowl warm. Come home after, yeah?' } },

  { name: 'It Grows', talk: [
    { who: 'ione', text: 'You\'ve seen them come up where the beam stops. From here on, they\'re the job. Everything I borrow from Prism comes back as crystal: on this floor, and on my skin.' },
    { who: 'kaito', text: 'Wait, it grows ON you too? Damn. I thought it was just the floor. Does it hurt?' },
    { who: 'ione', text: 'Constantly. It can\'t be turned, and it always leans the same way, which is more than I can say for Silas.' },
    { who: 'silas', text: 'Darling, I lean wherever I\'m wanted.' },
  ], win: { who: 'ione', text: 'So now you know the cost. It\'s also a tool. Nothing about that is comforting.' } },
  { name: 'Plant It', talk: [
    { who: 'juno', text: 'So you shoot, and something grows wherever it finishes? I\'ve met men like that.' },
    { who: 'ione', text: 'Unlike them, this is useful. Choose where it stops. Plant first, use it second.' },
  ], win: { who: 'juno', text: 'Plant first, use it second. I\'m having that put on a shirt.' } },
  { name: 'Stepping Stones', talk: [
    { who: 'bram', text: 'You\'ve gone quiet, Doc. Is it the arm?' },
    { who: 'ione', text: 'It\'s the room. I ran these beds. We grew the first bond crystals right here and called it progress.' },
    { who: 'prism', text: 'Prism folds one wing over her wrist. The glass is cold. It helps.' },
  ], win: { who: 'ione', text: 'Three shots to walk across a room. Science is mostly this.' },
     winOver: { who: 'ione', text: 'More shots than it takes to walk across a room. Science is mostly this.' } },
  { name: 'Mind the Lane', talk: [
    { who: 'sela', text: 'They don\'t come out, Ione? Not ever?' },
    { who: 'ione', text: 'Not off me. Scrap the trial and the useful ones crack off this floor, and the rest stay. One in the wrong lane bends every shot after it, and spent shots stay spent. So we think before we fire.' },
    { who: 'kaito', text: 'That\'s what I always...' },
    { who: 'sela', text: 'No it isn\'t, pup.' },
  ], win: { who: 'sela', text: 'Clean. You read that room like a chart, Doctor.' },
     winOver: { who: 'sela', text: 'Not pretty, but you\'re through. I\'ve come into port worse, Doctor.' } },

  { name: 'Split Light', talk: [
    { who: 'ione', text: 'Prism\'s wings can split a beam. Two lines, two stops, two growths. Do it twice, pay twice. That was this ward\'s whole thesis.' },
    { who: 'juno', text: 'Two at once? Doctor, you dirty genius.' },
    { who: 'ione', text: 'It\'s optics, Juno. Mostly.' },
  ], win: { who: 'juno', text: 'And she didn\'t even take her glasses off. Respect.' } },
  { name: 'Both at Once', talk: [
    { who: 'ione', text: 'See the cable? Those cores share one stripped bond. Burn just one and the other feeds it back.' },
    { who: 'silas', text: 'So they have to go together. How romantic.' },
    { who: 'ione', text: 'Synchronised finishes are rarer than you\'d think, Silas. I\'ve read the literature. I\'ve also read your letters.' },
  ], win: { who: 'silas', text: 'Those letters were private. ...Which one did you like best?' } },
  { name: 'Two Seeds', talk: [
    { who: 'vasch', text: 'You always did over-plant, Doctor. Two seeds, where one would teach you more.' },
    { who: 'kaito', text: 'WHO THE HELL IS THAT?' },
    { who: 'ione', text: 'Director Vasch. On the intercom. He\'ll have been listening since the door.' },
  ], win: { who: 'vasch', text: 'Tidy. A little greedy. You may carry on.' },
     winOver: { who: 'vasch', text: 'Untidy, and still greedy. You may carry on.' } },
  { name: 'Armour', talk: [
    { who: 'vasch', text: 'Armour on three sides. I added it after you left. You taught me to expect a clever woman at the front door.' },
    { who: 'ione', text: 'So I go round the back.' },
    { who: 'juno', text: 'Now THAT I\'d pay to hear again.' },
  ], win: { who: 'ione', text: 'Everything he builds has one way in. He thinks that\'s a virtue.' } },

  { name: 'Perches', talk: [
    { who: 'sela', text: 'Ione, get the hell out. He knows you\'re there. I can have the ship at the east dock in ten.' },
    { who: 'ione', text: 'He wrote and told me to bring my old notes, Sela, so I brought them. I\'m burning them on his desk. Prism, take the perches. Move when I say.' },
    { who: 'vasch', text: 'Come up, then. I kept your desk.' },
  ], win: { who: 'sela', text: 'Ten minutes, Doctor. Then I\'m coming in, and I\'m not wiping my feet.' } },
  { name: 'Moving Stock', talk: [
    { who: 'vasch', text: 'Hollows on rails. They move after you fire. You always aimed at where a thing was, Doctor, never where it was going.' },
    { who: 'ione', text: 'And you always talk through the procedure.' },
  ], win: { who: 'vasch', text: 'There. You see? Once you stop chasing, they come to you. Most things do.' } },
  { name: 'Clockwork', talk: [
    { who: 'kaito', text: 'Why\'s it ticking? Ione? Why is the whole damn room ticking?' },
    { who: 'ione', text: 'He\'s put them on a clock. You can\'t rush a clock, Kaito. You wait for the moment. I realise that\'s new to you.' },
    { who: 'juno', text: 'Oh, it\'s new to him.' },
    { who: 'kaito', text: 'HEY! Screw you both!' },
  ], win: { who: 'juno', text: 'See that, Kaito? Patience. We talk about this sort of thing, you know.' } },
  { name: 'Best Work', talk: [
    { who: 'vasch', text: 'This was the final exam for new staff. You finished it in an hour, and then you corrected my marking.' },
    { who: 'ione', text: 'You\'d miscounted.' },
    { who: 'vasch', text: 'Yes. I have thought about that a great deal.' },
  ], win: { who: 'ione', text: 'Full marks. His door is open. Of course it is.' },
     winOver: { who: 'ione', text: 'Marks off for working. His door is open. Of course it is.' } },
];
