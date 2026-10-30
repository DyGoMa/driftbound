// Aki Dash tuning. Every number is PROVISIONAL (first guess, not yet play-checked) unless noted.
// Units: logical pixels (screen is always 360 tall) and seconds.
window.TUNING = {
  groundY: 300,            // PROVISIONAL: where Aki's feet land
  heroX: 90,               // PROVISIONAL: Aki's distance from the left edge
  heroScale: 0.95,         // PROVISIONAL: sprite size
  gravity: 1900,           // PROVISIONAL
  jumpSpeed: 640,          // PROVISIONAL: first jump
  doubleJumpSpeed: 560,    // PROVISIONAL: second jump in the air
  jumpCut: 0.45,           // PROVISIONAL: letting go early keeps this share of upward speed (short hops)
  maxJumps: 2,             // design: double jump is Aki's signature move
  startSpeed: 270,         // PROVISIONAL: run speed at start
  speedRamp: 7,            // PROVISIONAL: speed added per second
  maxSpeed: 640,           // PROVISIONAL
  spawnGapMin: 0.85,       // PROVISIONAL: seconds between obstacles at top speed
  spawnGapMax: 1.7,        // PROVISIONAL: seconds between obstacles at start
  shardChance: 0.65,       // PROVISIONAL: chance a gap gets a shard trail
  hitboxShrink: 0.62,      // PROVISIONAL: smaller = more forgiving collisions
  scorePerPixel: 0.05,     // PROVISIONAL
  scorePerShard: 25,       // PROVISIONAL
  tallStackAfter: 15,      // PROVISIONAL: seconds before double-height stacks appear
  flyerAfter: 25,          // PROVISIONAL: seconds before floating Glitchlings appear
};
