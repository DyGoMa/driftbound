// Pictures the game uses instead of code art, from art/REQUEST.md. Made with tools/key-sprite.js from art/raw/; feet, cx and fill measured there.
// fill is set from the size of the head in each picture, so a person stays one size from pose to pose even when they crouch or lie down.
// Anything missing or broken falls back to the code figure without a sound.
window.DRIFT_SPRITES = {
  juno_idle:  { src: 'art/juno-idle.webp',  frames: 4, cols: 2, fps: 6,  feet: 0.975, cx: 0.5,  fill: 0.95 },
  juno_hot:   { src: 'art/juno-hot.webp',   frames: 4, cols: 2, fps: 8,  feet: 0.965, cx: 0.5,  fill: 1.06 },
  juno_throw: { src: 'art/juno-throw.webp', frames: 3, cols: 3, feet: 0.97,  cx: 0.46, fill: 0.95 },
  juno_lock:  { src: 'art/juno-lock.webp',  frames: 1, feet: 0.972, cx: 0.483, fill: 0.95 }, // One frame: the code already shakes her while locked. Take's second frame had a stray stripe.
  juno_hurt:  { src: 'art/juno-hurt.webp',  frames: 1, feet: 0.939, cx: 0.47, fill: 0.95 },
  juno_down:  { src: 'art/juno-down.webp',  frames: 1, feet: 0.938, cx: 0.55, fill: 0.95 },
  trooper_walk:  { src: 'art/trooper-walk.webp',  frames: 6, cols: 3, fps: 10, feet: 0.966, cx: 0.5, fill: 0.935 },
  trooper_run:   { src: 'art/trooper-run.webp',   frames: 6, cols: 3, fps: 12, feet: 0.97,  cx: 0.5, fill: 1.1 }, // Copied from Storm Run, as REQUEST.md suggests.
  trooper_swing: { src: 'art/trooper-swing.webp', frames: 3, cols: 3, feet: 0.98,  cx: 0.5, fill: 0.86 },
  trooper_throw: { src: 'art/trooper-throw.webp', frames: 2, cols: 2, feet: 0.972, cx: 0.5, fill: 0.94 }, // Hand empty; the game draws the hook.
  trooper_plate: { src: 'art/trooper-plate.webp', frames: 6, cols: 3, fps: 10, feet: 0.97, cx: 0.5, fill: 0.935 },
  trooper_lean:  { src: 'art/trooper-lean.webp',  frames: 1, feet: 0.958, cx: 0.45, fill: 0.885 }, // Faces left; drawn unflipped.
  trooper_down:  { src: 'art/trooper-down.webp',  frames: 1, feet: 0.98,  cx: 0.5,  fill: 0.97 },
  krell_stand: { src: 'art/krell-stand.webp', frames: 4, cols: 2, fps: 6, feet: 0.98, cx: 0.47, fill: 0.96 }, // All of Krell's face left, drawn unflipped: his left side, as on his sheet.
  krell_throw: { src: 'art/krell-throw.webp', frames: 1, feet: 0.971, cx: 0.47, fill: 1.04 },
  krell_hurt:  { src: 'art/krell-hurt.webp',  frames: 1, feet: 0.973, cx: 0.58, fill: 1.0 },
  krell_down:  { src: 'art/krell-down.webp',  frames: 1, feet: 0.977, cx: 0.55, fill: 1.04 },
  shield_man:  { src: 'art/shield-man.webp',  frames: 1, feet: 0.921, cx: 0.253, fill: 0.82 }, // Faces left, drawn unflipped.
  ashka_fly:   { src: 'art/ashka-fly.webp',   frames: 4, cols: 2, fps: 12, feet: 0.69, cx: 0.55, fill: 0.558 },
  hollow_leap:   { src: 'art/hollow-leap.webp',   frames: 1, feet: 0.75,  cx: 0.5, fill: 0.592 },
  hollow_open:   { src: 'art/hollow-open.webp',   frames: 1, feet: 0.842, cx: 0.5, fill: 0.592 },
  hollow_crouch: { src: 'art/hollow-crouch.webp', frames: 1, feet: 0.841, cx: 0.5, fill: 0.592 },
  powder_cart: { src: 'art/powder-cart.webp', frames: 1, feet: 0.927, cx: 0.55, fill: 0.75 },
  cover_table: { src: 'art/cover-table.webp', frames: 1, feet: 0.933, cx: 0.36, fill: 0.838 },
};
