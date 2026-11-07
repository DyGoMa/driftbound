// Pictures the game uses instead of code art, from art/REQUEST.md. Made with tools/key-sprite.js from art/raw/; feet, cx and fill measured there.
// Anything missing or broken here falls back to the code figure without a sound. Everything else on screen is code art.
// Sela: fill is head top to feet, so hair and raised arms may stick out above it and she stays one size from pose to pose. Same for Hekka and her lance.
window.DRIFT_SPRITES = {
  sela_bow:   { src: 'art/sela-bow.webp', frames: 4, cols: 2, fps: 6, feet: 0.957, cx: 0.5, fill: 0.926 },
  sela_read:  { src: 'art/sela-read.webp', frames: 4, cols: 2, fps: 6, feet: 0.932, cx: 0.5, fill: 0.891 },
  sela_empty: { src: 'art/sela-empty.webp', frames: 4, cols: 2, fps: 6, feet: 0.936, cx: 0.5, fill: 0.903 },
  sela_surge: { src: 'art/sela-surge.webp', frames: 2, cols: 2, fps: 10, feet: 0.89, cx: 0.5, fill: 0.564 },
  sela_hurt:  { src: 'art/sela-hurt.webp', frames: 1, feet: 0.972, cx: 0.5, fill: 0.9 },
  vesh_head:  { src: 'art/vesh-head.webp', frames: 4, cols: 2, fps: 8, feet: 0.941, cx: 0.5, fill: 0.892 },
  gullwake:   { src: 'art/gullwake.webp', frames: 1, feet: 0.992, cx: 0.498, fill: 0.985 },
  hekka_stand: { src: 'art/hekka-stand-v2.webp', frames: 2, cols: 2, fps: 3, feet: 0.846, cx: 0.5, fill: 0.722 },
  hekka_throw: { src: 'art/hekka-throw-v2.webp', frames: 2, cols: 2, fps: 8, feet: 0.96, cx: 0.5, fill: 0.827 },
  hekka_hurt:  { src: 'art/hekka-hurt.webp', frames: 1, feet: 0.96, cx: 0.483, fill: 0.83 },
  cutter:     { src: 'art/cutter.webp', frames: 1, feet: 0.999, cx: 0.5, fill: 0.985 },
  hekka_talk: { src: 'art/hekka-talk-v2.webp', frames: 1 },
  sela_talk: { src: 'art/sela-talk.webp', frames: 1 },   // this game only; the homepage's picture is left as it is. Take this line out to go back to it.
};
