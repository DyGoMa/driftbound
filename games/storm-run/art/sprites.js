// Pictures the game uses instead of code art, from art/REQUEST.md. Made with tools/key-sprite.js from art/raw/; feet, cx and fill measured there.
// Anything missing or broken here falls back to the code figure without a sound. Everything else on screen is code art.
window.DRIFT_SPRITES = {
  kaito_run:   { src: 'art/kaito-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.959, cx: 0.5, fill: 0.84 },
  kaito_jump:  { src: 'art/kaito-jump.webp', frames: 1, feet: 0.965, cx: 0.458, fill: 0.84 },
  kaito_surge: { src: 'art/kaito-surge.webp', frames: 1, feet: 0.91, cx: 0.505, fill: 0.84 },
  kaito_hurt:  { src: 'art/kaito-hurt.webp', frames: 1, feet: 0.963, cx: 0.475, fill: 0.84 },
  trooper_run: { src: 'art/trooper-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 0.84 },
  skarn_glide: { src: 'art/skarn-glide.webp', frames: 4, cols: 2, fps: 9, feet: 0.849, cx: 0.5025, fill: 0.783 },
};
