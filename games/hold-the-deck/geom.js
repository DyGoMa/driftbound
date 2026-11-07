// Hold the Deck: where things are on the deck. Plain sums, shared by the rules, the bot and the drawing.
// d runs from 0 (far end of a lane) to 1 (the galley door). Lanes are 0, 1, 2 from the left.
window.HD = window.HD || {};
(function () {
  const T = TUNE;
  const span = () => T.doorY - T.farY;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  HD.clamp = clamp;

  HD.yOf = d => T.farY + span() * (T.curveLin * d + T.curveSq * d * d);
  HD.laneW = y => T.laneFar + (T.laneNear - T.laneFar) * (y - T.farY) / span();
  HD.laneX = (lane, y) => T.midX + (lane - 1) * HD.laneW(y);
  HD.scaleAt = y => T.scaleFar + (T.scaleNear - T.scaleFar) * (y - T.farY) / span();
  HD.heightAt = (cm, y) => cm * HD.scaleAt(y);

  // Which lane a tap means. The lanes lean in toward the far end, so the sum uses the width at that height: tapping a far boarder picks his lane.
  HD.laneAt = function (x, y) {
    const k = (x - T.midX) / HD.laneW(clamp(y, T.farY, T.doorY));
    return k < -0.5 ? 0 : k > 0.5 ? 2 : 1;
  };
  HD.inBtn = (x, y) => x >= T.btn.x && x <= T.btn.x + T.btn.w && y >= T.btn.y && y <= T.btn.y + T.btn.h;

  // Walking and swinging times at this much iron, with Pepper Stew if it's working. The bond cost lives in these two sums.
  const pepper = run => (run.w.fastT > 0 ? run.w.fastMul : 1);
  HD.stepTime = run => T.stepSecs * (1 + T.ironStepSlow * (run.carry.iron || 0)) * pepper(run);
  HD.swingTime = run => T.swingCd * (1 + T.ironSwingSlow * (run.carry.iron || 0)) * pepper(run);
  // What a swing is worth. The greyer he is the harder he hits, smoothly, and never enough to pay for how much slower he's got.
  HD.hitPower = run => 1 + T.ironHeavy * (run.carry.iron || 0);
  // The bear's warnings are short, and a grey Bram gets the extra one lane's walk costs him, so what's left for a thumb's reaction stays the same at any grey.
  HD.greyWarn = run => Math.max(0, HD.stepTime(run) - T.stepSecs);
  HD.locked = run => (run.carry.iron || 0) >= 1;
  HD.pct = v => Math.round(v * 1000) / 10;   // 0.065 reads 6.5
  HD.inLane = (w, lane) => Math.abs(w.lanePos - lane) < 0.5;
  // The talk box. A line waits for the one before it, so nobody is talked over. now: true goes straight up, for the few that can't wait; what was waiting still comes after it.
  HD.say = function (run, line, secs, now) {
    if (!line) return;
    const w = run.w, q = w.sayQ || (w.sayQ = []), s = secs || T.saySecs;
    if (line.adult && w.pal) return;   // batch rule: pals are never in flirting or innuendo, so a joke keeps quiet while one's on deck
    if (now) w.sayT = 0;
    if (w.sayT > 0) { q.push({ line, s }); if (q.length > T.sayQueueMax) q.shift(); return; }
    run.say(line.who, line.text, s);
    w.sayT = s;
  };
  // A pal's come on deck: anything with a joke in it goes, waiting or showing, and the pal's line goes up at once.
  HD.sayForPal = function (run, line, secs) {
    const w = run.w;
    if (w.sayQ) w.sayQ = w.sayQ.filter(n => !n.line.adult);
    HD.say(run, line, secs, true);
  };
  HD.sayClear = function (run) {
    run.w.sayT = 0;
    if (!run.dry) Kit.ui.sayClear();
  };
  HD.stepSay = function (run, dt) {
    const w = run.w;
    if (w.sayT > 0) w.sayT -= dt;
    if (w.sayT <= 0 && w.sayQ && w.sayQ.length) { const n = w.sayQ.shift(); run.say(n.line.who, n.line.text, n.s); w.sayT = n.s; }
  };
  // Says a line once in this attempt.
  HD.first = function (run, id, now) {
    const w = run.w;
    if (w.saidFirst[id]) return;
    w.saidFirst[id] = true;
    HD.say(run, HD.WORDS.firsts[id], null, now);
  };
})();
