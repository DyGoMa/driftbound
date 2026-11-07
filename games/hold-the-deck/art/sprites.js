// Pictures the game uses instead of code art, from art/REQUEST.md. Keyed from art/raw/; feet, cx and fill measured there. Anything missing here falls back to the code figure without a sound.
// fill is head-to-foot share of the frame, so people stay true to scale: the raised arm and hook on the cutter and Hekka's lance sit above it, on purpose.
window.DRIFT_SPRITES = {
  bram_back_i0: { src: 'art/bram-back-i0.webp', frames: 7, cols: 4, feet: 0.96, cx: 0.5, fill: 0.935 },
  bram_back_i1: { src: 'art/bram-back-i1.webp', frames: 7, cols: 4, feet: 0.96, cx: 0.5, fill: 0.935 },
  bram_back_i2: { src: 'art/bram-back-i2.webp', frames: 7, cols: 4, feet: 0.96, cx: 0.5, fill: 0.935 },
  bram_back_i3: { src: 'art/bram-back-i3.webp', frames: 7, cols: 4, feet: 0.96, cx: 0.5, fill: 0.935 },
  bram_front_i0: { src: 'art/bram-front-i0.webp', frames: 2, cols: 2, feet: 0.969, cx: 0.5, fill: 0.946 },
  bram_front_i1: { src: 'art/bram-front-i1.webp', frames: 2, cols: 2, feet: 0.969, cx: 0.5, fill: 0.946 },
  bram_front_i2: { src: 'art/bram-front-i2.webp', frames: 2, cols: 2, feet: 0.969, cx: 0.5, fill: 0.946 },
  bram_front_i3: { src: 'art/bram-front-i3.webp', frames: 2, cols: 2, feet: 0.969, cx: 0.5, fill: 0.946 },
  trooper_walk: { src: 'art/trooper-walk.webp', frames: 5, cols: 3, feet: 0.965, cx: 0.5, fill: 0.92 },
  trooper_run_front: { src: 'art/trooper-run-front.webp', frames: 5, cols: 3, feet: 0.965, cx: 0.5, fill: 0.92 },
  trooper_shield: { src: 'art/trooper-shield.webp', frames: 5, cols: 3, feet: 0.964, cx: 0.5, fill: 0.918 },
  trooper_cutter: { src: 'art/trooper-cutter.webp', frames: 5, cols: 3, feet: 0.951, cx: 0.5, fill: 0.736 },
  ram_front: { src: 'art/ram-front.webp', frames: 5, cols: 3, feet: 0.955, cx: 0.5, fill: 0.861 },
  crate: { src: 'art/crate.webp', frames: 1, feet: 0.966, cx: 0.5, fill: 0.918 },
  grist_charge: { src: 'art/grist-charge.webp', frames: 4, cols: 2, fps: 12, feet: 0.905, cx: 0.5, fill: 0.835 },
  grist_sleep: { src: 'art/grist-sleep.webp', frames: 1, feet: 0.883, cx: 0.48, fill: 0.806 },
  grist_awake: { src: 'art/grist-awake.webp', frames: 1, feet: 0.895, cx: 0.48, fill: 0.806 },
  bear_front: { src: 'art/bear-front.webp', frames: 6, cols: 3, feet: 0.952, cx: 0.5, fill: 0.9 },
  bear_paw: { src: 'art/bear-paw.webp', frames: 1, feet: 0.86, cx: 0.5, fill: 0.84 },
  hekka_front: { src: 'art/hekka-front.webp', frames: 1, feet: 0.943, cx: 0.503, fill: 0.824 },
};
