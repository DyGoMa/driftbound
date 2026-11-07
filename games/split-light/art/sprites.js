// Pictures for Split Light, from art/REQUEST.md. Made with tools/key-sprite.js from art/raw/; feet and fill measured there.
// Anything missing or broken here falls back to the code art without a sound.
window.DRIFT_SPRITES = {
  // Square windows: the game draws the whole frame as a square as wide as the window and clips it, so fill and feet stay at 1.
  vasch_bust: { src: 'art/vasch-bust.webp', frames: 2, cols: 2, feet: 1, cx: 0.5, fill: 1 },
  ione_bust:  { src: 'art/ione-bust-v3.webp', frames: 3, cols: 3, feet: 1, cx: 0.5, fill: 1 },
  // Prism from above: the game turns these to face any of four ways, about the middle of her cell.
  prism_top:  { src: 'art/prism-top.webp', frames: 4, cols: 2, fps: 8, feet: 0.909, cx: 0.5, fill: 0.863 },
  prism_fire: { src: 'art/prism-fire.webp', frames: 1, feet: 0.895, cx: 0.5, fill: 0.829 },
  // The rooms, one per set: square paintings the game stretches to cover the screen, bottom edge on the bottom of the screen.
  room_0: { src: 'art/room-0.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_1: { src: 'art/room-1.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_2: { src: 'art/room-2.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_3: { src: 'art/room-3.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
  room_4: { src: 'art/room-4.webp', frames: 1, feet: 1, cx: 0.5, fill: 1 },
};
