// Kit test hooks. Only with ?test in the address (and ?speed=8, ?seed=3 if wanted). tools/smoke.js drives these.
// window.__kit: state(), timeScale, bot(on), jump(stage, {endless, fair, talk}), runStage(stage, {bot, fair, seed, maxSeconds}), catchPal(id), title(), ending().
(function () {
  if (!Kit.test) return;
  Kit._testReady = function (hooks) {
    window.__kit = Object.assign({}, hooks);
    Object.defineProperty(window.__kit, 'timeScale', { get() { return Kit.timeScale; }, set(v) { Kit.timeScale = v; } });
  };
})();
