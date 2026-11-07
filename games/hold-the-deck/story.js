// Hold the Deck: the grey can't be washed off from the stage list. The kit rule stands: picking stage 1 starts a new run with no iron, so nobody is stuck with a ruined one.
// But a new run has to walk the stages to stay clean. It keeps count of the last stage it cleared in order (carry.through), and the save remembers how grey Bram was when he last cleared each one.
// - Skipping ahead from the list takes on the grey of the run that last came this way. Playing them in order earns your own number, and that replaces the remembered one.
// - Going back over a stage already passed is practice: it can't lower the grey or lose your place.
window.HD = window.HD || {};
(function () {
  const KEY = 'hd_grey_at';   // stage index to iron when it was last cleared in order. In the save's settings, beside hd_ending_band
  const greyAt = () => DriftSave.getSetting(KEY, {}) || {};

  HD.storyStart = function (run) {
    const w = run.w, c = run.carry;
    w.greyFloor = null;
    if (run.dry || run.endless || run.index <= 0) return;
    const through = c.through === undefined ? (run.continued ? run.index - 1 : -1) : c.through;   // a save from before this rule carries on as it stands
    if (through < run.index - 1) c.iron = Math.max(c.iron || 0, greyAt()[run.index - 1] || 0);
    else if (through >= run.index) w.greyFloor = c.iron || 0;
  };

  HD.storyCleared = function (run) {
    const w = run.w, c = run.carry;
    if (run.dry || run.endless) return;
    if (w.greyFloor !== null) { c.iron = Math.max(c.iron || 0, w.greyFloor); return; }   // practice: the tonic he ate doesn't count, and his place in the run stays
    c.through = run.index;
    const at = greyAt();
    at[run.index] = c.iron || 0;
    DriftSave.setSetting(KEY, at);
  };
})();
