// The six games. A card is playable only when live: true (a builder flips its own game when done).
// art: a card picture, site-relative. null falls back to the dusk islands picture.
// Names, islands and which boss goes where are Claude's calls (docs/FRIDAY_BATCH.md).
window.DRIFT_GAMES = [
  { id: 'storm-run', title: 'Storm Run', lead: 'kaito', leadName: 'Kaito', partner: 'Skarn', island: 'Pinhold', hold: 'sideways', live: true, status: 'live',
    art: 'art/site/pinhold-v1-web.webp', artAlt: 'Pinhold, a floating island nailed in place by giant steel pylons and chains, with a grey watchtower on top.',
    blurb: 'Pinhold is being nailed in place. Kaito and Skarn run the island, jumping Sever troopers and paying for every Surge.' },
  { id: 'tide-gap', title: 'Tide Gap', lead: 'sela', leadName: 'Sela', partner: 'Vesh', island: 'Gaptooth Reach', hold: 'upright', live: true, status: 'live',
    art: 'art/site/gaptooth-v1-web.webp', artAlt: 'Gaptooth Reach: two floating islands grinding past each other, shedding boulders and waterfalls, with a narrow gap of dusk sky between them.',
    blurb: 'Islands grind shut around the Gullwake. Sela feels which way they drift, but every deep Dive drowns another page of her life.' },
  { id: 'hot-hand', title: 'Hot Hand', lead: 'juno', leadName: 'Juno', partner: 'Ashka', island: 'Ashmarket', hold: 'sideways', live: true, status: 'live',
    art: 'art/site/ashmarket-v1-web.webp', artAlt: 'Ashmarket: a crowded floating market town of timber halls and paper lanterns, with two buildings on fire.',
    blurb: 'The Sever raid a gamblers\' island, and Juno bets on herself. The hotter her hands, the harder she throws, right up until they lock.' },
  { id: 'silent-cut', title: 'Silent Cut', lead: 'silas', leadName: 'Silas', partner: 'Hush', island: 'Lanternreach', hold: 'sideways', live: true, status: 'live',
    art: 'art/site/lanternreach-v1-web.webp', artAlt: 'Lanternreach: a smugglers\' port on a floating island at night, hung with hundreds of lanterns, with searchlights sweeping the mist.',
    blurb: 'A night in his old smuggling port, a debt to settle and every lamp hunting him. Run out of breath and the charming bastard runs out of words.' },
  { id: 'hold-the-deck', title: 'Hold the Deck', lead: 'bram', leadName: 'Bram', partner: 'Grist', island: 'Keelbreak', hold: 'upright', live: false, status: 'soon',
    art: 'art/site/keelbreak-v1-web.webp', artAlt: 'Keelbreak: a floating shipyard at dusk, with a battered wooden salvage ship propped up in dry dock under huge cranes.',
    blurb: 'The Gullwake is in dry dock and boarders want the galley. Bram turns to iron to stop them, and the iron doesn\'t all come back off.' },
  { id: 'split-light', title: 'Split Light', lead: 'ione', leadName: 'Ione', partner: 'Prism', island: 'The Glass Ward', hold: 'upright', live: true, status: 'live',
    art: 'art/site/glassward-v1-web.webp', artAlt: 'The Glass Ward: a dead laboratory on a floating island, its broken glass domes overgrown with huge crystals that split the light into rainbows.',
    blurb: 'Ione goes back to the dead lab she helped build. Bounce Prism\'s beam through Hollow cores, and mind the crystal each shot grows.' },
];
