// Pictures the game uses instead of code art: see art/REQUEST.md for the list. Made with tools/key-sprite.js from art/raw/; prompts in art/prompts/.
// Anything missing or broken here falls back to the code figure without a sound.
// feet and cx measured on the keyed pictures. fill sets each picture's scale: Silas's are matched on the size of his head from pose to pose, so a crouch keeps the scale of a stand.
window.DRIFT_SPRITES = {
  silas_creep:   { src: 'art/silas-creep.webp', frames: 6, cols: 3, fps: 8, feet: 0.945, cx: 0.5, fill: 0.99 },
  silas_freeze:  { src: 'art/silas-freeze.webp', frames: 1, feet: 0.918, cx: 0.46, fill: 0.62 },
  silas_hide:    { src: 'art/silas-hide.webp', frames: 1, feet: 0.912, cx: 0.45, fill: 0.62 },
  silas_surge:   { src: 'art/silas-surge.webp', frames: 1, feet: 0.78, cx: 0.5, fill: 0.6 },   // feet below his lowest point, so the dash floats clear of the road
  silas_strike:  { src: 'art/silas-strike-v2.webp', frames: 3, cols: 3, feet: 0.978, cx: 0.5, fill: 0.95 },
  silas_winded:  { src: 'art/silas-winded.webp', frames: 4, cols: 2, fps: 6, feet: 0.965, cx: 0.5, fill: 1.03 },
  silas_hurt:    { src: 'art/silas-hurt.webp', frames: 1, feet: 0.93, cx: 0.45, fill: 0.87 },
  silas_down:    { src: 'art/silas-down.webp', frames: 1, feet: 0.906, cx: 0.486, fill: 0.87 },
  trooper_walk:  { src: 'art/trooper-walk.webp', frames: 6, cols: 3, fps: 8, feet: 0.934, cx: 0.5, fill: 0.889 },
  trooper_run:   { src: 'art/trooper-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.97, cx: 0.5, fill: 1.1 },   // copied from games/storm-run/art, same picture; fill matched to the walk's helmet size
  trooper_stand: { src: 'art/trooper-stand.webp', frames: 1, feet: 0.959, cx: 0.55, fill: 0.875 },
  trooper_down:  { src: 'art/trooper-down.webp', frames: 1, feet: 0.943, cx: 0.49, fill: 0.875 },
  hush_perch:    { src: 'art/hush-perch.webp', frames: 1, feet: 0.907, cx: 0.5, fill: 0.825 },
  hush_glide:    { src: 'art/hush-glide.webp', frames: 4, cols: 2, fps: 6, feet: 0.805, cx: 0.5, fill: 0.58 },
  // Ledger Maro. The pole, lantern and book are in the pictures: people.js only adds the shut book for the warning, lights.js starts the cone at this lantern.
  maro_book:     { src: 'art/maro-book.webp', frames: 1, feet: 0.981, cx: 0.5, fill: 0.826 },
  maro_lamp:     { src: 'art/maro-lamp.webp', frames: 1, feet: 0.981, cx: 0.367, fill: 0.826 },
  maro_hurt:     { src: 'art/maro-hurt.webp', frames: 1, feet: 0.983, cx: 0.45, fill: 0.826 },
  maro_run:      { src: 'art/maro-run.webp', frames: 6, cols: 3, fps: 12, feet: 0.96, cx: 0.5, fill: 0.95 },
  maro_down:     { src: 'art/maro-down.webp', frames: 1, feet: 0.945, cx: 0.5, fill: 1.55 },
};
