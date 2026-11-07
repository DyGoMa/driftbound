// Site-wide numbers. Game numbers live in each game's own tuning.js.
window.DRIFT_CONFIG = {
  gateRememberDays: 30,  // Dylan's card answer 2026-11-05: "Remember for 30 days"
  gateTapGuardMs: 500,   // PROVISIONAL: taps ignored for this long after a gate screen changes (double-tap guard)
  monsterBookSlots: 12,  // PROVISIONAL (Dylan's card answer 2026-11-05: "12 slots"); matches the 12 pals in shared/pals.js
  upgradePrices: [20, 45, 80],  // PROVISIONAL (Claude's call, Friday batch): cost of levels 1, 2, 3; a stage clear pays about 15 to 40 salvage
};
