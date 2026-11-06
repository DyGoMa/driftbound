// Pictures the game uses instead of code art, from art/REQUEST.md. Made with tools/key-sprite.js from art/raw/; feet, cx and fill measured there.
// Anything missing or broken here falls back to the code figure without a sound. Everything else on screen is code art.
window.DRIFT_SPRITES = {
  kaito_run:   { src: 'art/kaito-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.959, cx: 0.5, fill: 0.84 },
  kaito_jump:  { src: 'art/kaito-jump.webp', frames: 1, feet: 0.965, cx: 0.458, fill: 0.84 },
  kaito_surge: { src: 'art/kaito-surge.webp', frames: 1, feet: 0.91, cx: 0.505, fill: 0.84 },
  kaito_hurt:  { src: 'art/kaito-hurt.webp', frames: 1, feet: 0.963, cx: 0.475, fill: 0.84 },
  trooper_run: { src: 'art/trooper-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 0.84 },
  skarn_glide: { src: 'art/skarn-glide.webp', frames: 4, cols: 2, fps: 9, feet: 0.849, cx: 0.5025, fill: 0.783 },
  // The boss. The game draws these at height 150, so fill sets each picture's scale: chosen so hound and Silt stay about the same size from pose to pose (art/REQUEST.md).
  // _left pictures are drawn facing left from his sheet's left view: no blade, no eye slit, which is what that side shows. Flipping a right-facing one would put both on the wrong side.
  // silt_hound_rear_left: cx and fill put the core at TUNE.coreOffset and TUNE.coreAltArt, so the target stays where the rules have it.
  silt_hound_run:    { src: 'art/silt-hound-run.webp', frames: 6, cols: 3, fps: 13, feet: 0.925, cx: 0.451, fill: 0.979 },
  silt_hound_throw:  { src: 'art/silt-hound-throw.webp', frames: 6, cols: 3, fps: 13, feet: 0.925, cx: 0.451, fill: 0.979 },
  silt_hound_crouch: { src: 'art/silt-hound-crouch.webp', frames: 1, feet: 0.853, cx: 0.495, fill: 0.977 },
  silt_hound_crouch_left: { src: 'art/silt-hound-crouch-left.webp', frames: 1, feet: 0.861, cx: 0.482, fill: 0.977 },
  silt_hound_leap:   { src: 'art/silt-hound-leap.webp', frames: 1, feet: 0.784, cx: 0.52, fill: 0.957 },
  silt_hound_leap_left: { src: 'art/silt-hound-leap-left.webp', frames: 1, feet: 0.788, cx: 0.495, fill: 0.957 },
  silt_hound_rear_left: { src: 'art/silt-hound-rear.webp', frames: 1, feet: 0.963, cx: 0.3946, fill: 0.862 },
  silt_hound_yelp_left: { src: 'art/silt-hound-yelp.webp', frames: 1, feet: 0.961, cx: 0.328, fill: 0.814 },
  silt_hound_down_left: { src: 'art/silt-hound-down.webp', frames: 1, feet: 0.701, cx: 0.5, fill: 1.01 },
};
