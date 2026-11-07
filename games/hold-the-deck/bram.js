// Hold the Deck: Bram. The thumb, walking, swinging, Iron, Guts. Grist's in grist.js. No drawing here.
window.HD = window.HD || {};
(function () {
  const T = TUNE, A = () => Kit.art;

  // Tries lost on each stage since it was last won. In the save's settings, so a reload or a night's sleep doesn't put the wall back. Test runs (dry) don't count; they read TUNE.dryLost, for test/thumb.js.
  const KEY = 'hd_tries_lost', losses = () => DriftSave.getSetting(KEY, {}) || {};
  HD.triesLost = run => (run.endless ? 0 : run.dry ? (T.dryLost || 0) : losses()[run.index] || 0);
  const mercy = run => (run.boss ? Math.min(T.boss.mercyMax, T.boss.mercyPerLoss * HD.triesLost(run)) : T.mercyPerLoss * Math.min(T.mercyMax, HD.triesLost(run)));
  // A try only earns the extra Guts if it paid something: a volley taken on the chin with Iron never once held earns nothing, so dying can't stand in for the grey. Full iron has no Iron to hold, so it always counts.
  const earnedMercy = run => !run.w.tookVolley || run.w.ironUses > 0 || HD.locked(run);
  HD.stageWon = run => {
    if (run.dry) return;
    const l = losses();
    if (l[run.index]) { l[run.index] = 0; DriftSave.setSetting(KEY, l); }
  };
  function lostATry(run) {
    if (run.dry || run.endless) return;
    const l = losses();
    l[run.index] = (l[run.index] || 0) + 1;
    DriftSave.setSetting(KEY, l);
  }

  HD.newBram = function (run) {
    const guts = T.guts + T.apronPerLevel * run.up('apron') + mercy(run);
    return { mercy: mercy(run), lanePos: 1, target: 1, arriveSwing: false, cd: 0, swingBuf: 0, swingT: 0, lungeT: 0, stepT: 0,
      ironOn: false, ironT: 0, holdOk: true, thumbDown: false, swingOnLift: false, liftFrom: 0, lastWhiff: -99, tookVolley: false, lockTold: false, hurtT: 0, inv: 0, fastT: 0, fastMul: 1, eatT: 0, flakeT: 0, hitStop: 0, staggerT: 0, whiffRun: 0,
      guts, gutsMax: guts,
      temper: 0, temperFill: 1 + T.temperPerLevel * run.up('temper'), grist: null, gristAway: 0, slashT: 0, zzzT: 0 };
  };

  // ---- The thumb. A press acts at once, so it never feels late. Keep the thumb down and it turns into Iron.
  HD.control = function (run, input, dt) {
    const w = run.w, keyThumb = input.keyPressed('Space') || input.keyPressed('Enter');
    if (input.pressed) {
      if (keyThumb) { w.holdOk = true; send(run, Math.round(w.target), input); }   // Space: swing here, hold for Iron
      else if (HD.inBtn(input.x, input.y) && w.temper >= 1) { w.holdOk = false; HD.tryCharge(run); }   // the button only takes the press when his meter's full; before that a low tap on the right is the right lane, like the other two sides
      else { w.holdOk = true; send(run, HD.laneAt(input.x, input.y), input); }
    }
    w.thumbDown = input.down && w.holdOk;
    // Keys: left and right walk a lane and swing, down swings here, up sends Grist, 1 2 3 pick a lane.
    if (input.keyPressed('ArrowLeft') || input.keyPressed('KeyA')) send(run, Math.max(0, w.target - 1));
    if (input.keyPressed('ArrowRight') || input.keyPressed('KeyD')) send(run, Math.min(2, w.target + 1));
    if (input.keyPressed('ArrowDown') || input.keyPressed('KeyS')) send(run, w.target);
    if (input.keyPressed('ArrowUp') || input.keyPressed('KeyW')) HD.tryCharge(run);
    ['Digit1', 'Digit2', 'Digit3'].forEach((k, i) => { if (input.keyPressed(k)) send(run, i); });

    const arrived = w.lanePos === w.target;
    if (w.ironOn) {
      if (!input.down) ironOff(run); else ironHold(run, dt);
    } else if (input.down && w.holdOk && arrived && input.held >= T.holdSecs) ironOn(run);
    if (!input.down) {
      w.lockTold = false;
      // A press with nothing to hit waited to see if it was a hold. It wasn't, so it's a swing. A press the kit forgot (a menu came up) is neither.
      if (w.swingOnLift) { w.swingOnLift = false; if (w.liftFrom === input.resets && !w.ironOn) w.swingBuf = w.cd + T.swingBuffer; }
    }
  };

  // thumb: the input if a thumb is on the glass, so the press might still turn into Iron. Keys that only swing leave it out.
  function send(run, lane, thumb) {
    const w = run.w;
    if (w.ironOn) return;
    if (lane === w.target && w.lanePos === lane) {
      if (thumb && !HD.anythingInReach(run, lane)) { w.swingOnLift = true; w.liftFrom = thumb.resets; return; }   // nothing to hit: no WHIFF yet, this may be a hold
      w.swingBuf = T.swingBuffer;
      return;
    }
    w.target = lane; w.arriveSwing = true;
  }

  // ---- Walking and swinging
  HD.stepBram = function (run, dt) {
    const w = run.w;
    for (const k of ['cd', 'swingBuf', 'lungeT', 'hurtT', 'inv', 'fastT', 'eatT', 'flakeT', 'slashT', 'zzzT', 'staggerT']) if (w[k] > 0) w[k] = Math.max(0, w[k] - dt);
    if (w.lanePos !== w.target && (w.staggerT <= 0 || HD.litHere(w))) {   // off balance after a swing at nothing, unless his lane's lit: a dodge is never late because of it
      const move = dt / HD.stepTime(run), gap = w.target - w.lanePos;
      w.lanePos = Math.abs(gap) <= move ? w.target : w.lanePos + Math.sign(gap) * move;
      if ((w.stepT -= dt) <= 0) { w.stepT = HD.stepTime(run) * 0.6; Kit.audio.play((run.carry.iron || 0) >= T.ironLineAt ? 'clunk' : 'stomp'); }
      if (w.lanePos === w.target && w.arriveSwing) {
        w.arriveSwing = false;
        // He swings when he gets there, as soon as the hammer's back, so a tap is never dropped. Only walking out of danger with nothing to hit leaves the hammer alone.
        const reach = HD.anythingInReach(run, w.target);
        if (!reach && w.thumbDown) { if (!HD.litAny(w)) { w.swingOnLift = true; w.liftFrom = Kit.input.resets; } }   // thumb still down: this may be a hold, so no WHIFF yet
        else if (reach || !HD.litAny(w)) w.swingBuf = w.cd + T.swingBuffer;
      }
    }
    if (w.swingBuf > 0 && w.cd <= 0 && !w.ironOn && w.lanePos === w.target) startSwing(run);
    if (w.swingT > 0) { w.swingT -= dt; if (w.swingT <= 0) landSwing(run); }
    // Grist's meter. He's asleep till it fills.
    const fill = run.boss ? T.boss.temperPerSec * (1 + T.boss.temperIronMul * (run.carry.iron || 0)) : T.temperPerSec;
    if (!w.grist && w.gristAway <= 0) HD.addTemper(run, fill * dt);
    if (w.gristAway > 0) w.gristAway -= dt;
    HD.stepGrist(run, dt);
    sparks(w);
  };
  // Looks only: heat off the iron, pepper steam, flakes of iron coming off after the tonic. Math.random is fine for these.
  function sparks(w) {
    const y = HD.yOf(T.bramD), x = HD.laneX(w.lanePos, y), h = HD.heightAt(198, y), r = Math.random, puff = (dx, top, o) => A().burst(x + (r() - 0.5) * dx, y - top, Object.assign({ n: 1 }, o));
    if (w.ironOn && r() < 0.3) puff(70, r() * h, { color: '#ff9a4a', speed: 40, life: 0.3, size: 2, gravity: -60 });
    if (w.fastT > 0 && r() < 0.25) puff(60, h * 0.3 + r() * h * 0.5, { color: '#ff8a2a', speed: 24, life: 0.45, size: 1.8, gravity: -130 });
    if (w.flakeT > 0 && r() < 0.6) puff(50, r() * h, { color: '#8e949d', speed: 40, life: 0.5, size: 2, gravity: 120 });
  }

  function startSwing(run) {
    const w = run.w;
    w.swingBuf = 0; w.swingT = T.swingWindup; w.lungeT = T.lungeSecs;
    w.cd = HD.swingTime(run);
    Kit.audio.play('swing');
  }
  function landSwing(run) {
    const w = run.w, lane = w.target, n = HD.hitLane(run, lane, HD.hitPower(run), 'swing');
    w.slashT = 0.16;
    if (n) { w.whiffRun = 0; return; }
    w.cd = Math.max(w.cd, HD.swingTime(run) * T.whiffMul - T.swingWindup);
    if (run.time - w.lastWhiff > T.whiffForget) w.whiffRun = 0;   // the streak is about sweeping the lanes blind, not one miss a while ago
    w.staggerT = T.whiffStagger + T.whiffRunAdd * Math.min(T.whiffRunMax, w.whiffRun);
    w.whiffRun++; w.lastWhiff = run.time;
    Kit.audio.play('whiff');
    A().floatText(HD.laneX(lane, 420), 400, 'WHIFF', '#c9ced8', 16);
  }

  // ---- Iron
  function ironOn(run) {
    const w = run.w;
    w.swingOnLift = false;   // it was a hold after all: never a swing
    if (HD.locked(run)) {
      if (!w.lockTold) { w.lockTold = true; Kit.audio.play('denied'); A().floatText(HD.laneX(w.target, 400), 380, 'NO IRON LEFT', '#c9ced8', 18); HD.first(run, 'locked'); }
      return;
    }
    w.ironOn = true; w.ironT = 0; w.swingBuf = 0;
    addIron(run, T.ironPerUse);
    w.ironUses++;
    w.flakeT = 0;
    Kit.audio.play('ironOn'); Kit.audio.play('surge');
    A().burst(HD.laneX(w.target, 470), 440, { n: 16, colors: ['#c9ced8', '#8e949d', '#ff9a4a'], speed: 150, life: 0.4, size: 3 });
    A().shake(3, 0.15);
    if ((run.index >= 0 && run.index <= 2) || run.endless) HD.first(run, 'iron');
  }
  function ironHold(run, dt) {
    const w = run.w;
    w.ironT += dt;
    if (w.ironT > T.ironFreeHold) { addIron(run, T.ironPerSec * dt); if (HD.locked(run)) ironOff(run); }
    HD.palIronStep(run, dt);
  }
  function ironOff(run) {
    const w = run.w;
    w.ironOn = false;
    w.cd = Math.max(w.cd, HD.swingTime(run) * T.swingRecover);
    // Letting go shakes off whatever piled up on him.
    const n = HD.hitLane(run, w.target, T.shedHit, 'shed');
    if (n) { Kit.audio.play('hit'); A().shake(4, 0.2); }
    Kit.audio.play('crack');
    A().burst(HD.laneX(w.target, 470), 430, { n: 12, colors: ['#8e949d', '#c9ced8'], speed: 170, life: 0.35, size: 3 });
    HD.palIronOff(run);
  }
  function addIron(run, n) {
    const was = run.carry.iron || 0, now = Math.min(1, was + n);
    run.carry.iron = now;   // run.carry: this stays for the rest of the story run (kit README)
    if (was < T.ironLineAt && now >= T.ironLineAt) HD.first(run, 'heavy');
    if (was < 1 && now >= 1) HD.first(run, 'locked', true);   // says so when it happens, not after a hold that does nothing
  }
  HD.pullIron = function (run, n) {
    run.carry.iron = Math.max(0, (run.carry.iron || 0) - n);
    run.w.flakeT = 1.0;
  };

  // ---- Getting hurt. why is a short word for the test report.
  HD.hurt = function (run, n, why) {
    const w = run.w;
    if (why !== 'door' && (w.ironOn || w.inv > 0)) return false;
    w.guts = Math.max(0, w.guts - n);
    w.hitsTaken++; w.hurtBy[why] = (w.hurtBy[why] || 0) + 1;
    if (w.hitLog.length < 40) w.hitLog.push({ why, at: Math.round(run.time * 100) / 100, pos: Math.round(w.lanePos * 100) / 100, target: w.target, iron: Math.round((run.carry.iron || 0) * 100) / 100, warns: w.warns.map(x => x.kind + x.lane + '@' + Math.round(x.t * 100) / 100 + '/' + x.total) });
    if (why !== 'door') { w.inv = T.invuln; w.hurtT = T.hurtSecs; }
    Kit.audio.play('hurt');
    A().shake(7, 0.3);
    const x = why === 'door' ? null : HD.laneX(w.lanePos, 440);
    if (x !== null) A().burst(x, 440, { n: 18, colors: ['#f0752b', '#ffffff', '#f4c152'], speed: 170, life: 0.45, size: 3 });
    if (w.guts <= 0) { if (!run.over && earnedMercy(run)) lostATry(run); run.lose(); }
    return true;
  };
})();
