// Can a steering sweep spend a memory, and does a real pull still Dive? Plain node, no browser: node games/tide-gap/test/pull.js
// Feeds the game's own pull check (dive.js) thumb paths at 60 steps a second, on a phone 390 CSS px wide. Sweeps follow a circle about a thumb's base, right or left. This is a model of a thumb: no real thumb was measured.
const path = require('path'), fs = require('fs'), vm = require('vm');
global.window = global;
const dir = path.resolve(__dirname, '..');
['tuning.js', 'dive.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(dir, f), 'utf8'), { filename: f }));
const T = TUNE, TG = global.TG, SCALE = 390 / 360;

// A path is a list of [x, y] in CSS px, one a step. Does the check fire anywhere along it, and at which step?
function fires(points) {
  const w = { pull: { x: 0, y: 0, log: [] } };
  for (let i = 0; i < points.length; i++) {
    const a = points[i - 1] || points[i], b = points[i];
    if (TG.pulled(w, { pressed: i === 0, down: true, dx: (b[0] - a[0]) / SCALE, dy: (b[1] - a[1]) / SCALE })) return i;
  }
  return -1;
}
const sweep = (bx, by, R, x0, x1, secs) => {
  const n = Math.max(2, Math.round(secs * 60)), out = [];
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; out.push([x, by - Math.sqrt(Math.max(0, R * R - (bx - x) * (bx - x)))]); }
  return out;
};
const hold = (p, secs) => Array.from({ length: Math.round(secs * 60) }, () => p.slice());
const line = (a, b, secs) => { const n = Math.max(2, Math.round(secs * 60)), out = []; for (let i = 1; i <= n; i++) out.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); return out; };

// ---- Sweeps must not fire. Every arc that stays on a 390x844 screen and crosses at least minAcross CSS px.
const BASES = [[430, 884], [450, 900], [410, 860], [430, 920], [-40, 884], [-60, 900], [-20, 860], [-40, 920]];
const SECS = [0.15, 0.2, 0.28, 0.35, 0.5, 0.7, 0.9, 1.2, 1.5];
let tried = 0, fired = 0, firstBad = [], softTried = 0, softFired = 0;
for (const [bx, by] of BASES) for (let R = 220; R <= 460; R += 20) for (let x0 = 20; x0 <= 370; x0 += 20) for (let x1 = 20; x1 <= 370; x1 += 20) {
  const across = Math.abs(x1 - x0);
  if (across < 60 || Math.abs(bx - x0) > R || Math.abs(bx - x1) > R) continue;
  const yA = by - Math.sqrt(R * R - (bx - x0) * (bx - x0)), yB = by - Math.sqrt(R * R - (bx - x1) * (bx - x1));
  if (yA < 80 || yA > 840 || yB < 80 || yB > 840) continue;
  // A move this much more down than across isn't a steer, whatever made it. Those count as pulls, and are out of this list.
  if (yB - yA > across * T.pullSlant) continue;
  for (const secs of SECS) {
    const hit = fires(sweep(bx, by, R, x0, x1, secs)) >= 0;
    if (across >= 100) { tried++; if (hit) { fired++; if (firstBad.length < 6) firstBad.push(`base ${bx},${by} R ${R} x ${x0}->${x1} y ${yA.toFixed(0)}->${yB.toFixed(0)} in ${secs}s`); } }
    else { softTried++; if (hit) softFired++; }
  }
}
console.log(`Steering sweeps, 100 CSS px across or more: ${fired} of ${tried} fired`);
firstBad.forEach(b => console.log('  ' + b));
console.log(`Short sweeps, 60 to 100 CSS px across: ${softFired} of ${softTried} fired (noted, not a failure)`);

// ---- Real pulls must fire. Rest, then down.
let pullsTried = 0, pullsFired = 0; const missed = [], slow = [];
for (const dist of [45, 60, 80, 110]) for (const secs of [0.08, 0.12, 0.18, 0.24]) for (const lean of [0, 0.15, 0.3, -0.15, -0.3, 0.4, -0.4]) {
  if (dist / secs < T.pullPx * SCALE / T.pullWindow) continue;   // too slow to be a pull at all: the old rule's limit, unchanged
  const start = [195, 560], end = [195 + dist * lean, 560 + dist], p = hold(start, 0.2).concat(line(start, end, secs), hold(end, 0.1));
  pullsTried++;
  if (fires(p) >= 0) pullsFired++; else missed.push(`${dist} px in ${secs} s, lean ${lean}`);
}
console.log(`Pulls from a thumb at rest, leaning up to 0.4 sideways per px down: ${pullsFired} of ${pullsTried} fired`);
missed.slice(0, 8).forEach(m => console.log('  missed ' + m));

// Fresh press, then down straight away.
const fresh = fires([[195, 500]].concat(line([195, 500], [195, 560], 0.12), hold([195, 560], 0.1)));
console.log('Press and pull at once: ' + (fresh >= 0 ? 'fired' : 'MISSED'));

// Steer, stop, pull: how long a stop does it take, and what a pull with no stop at all costs.
const STOPS = [0, 0.05, 0.1, 0.15, 0.2, 0.3], stops = [];
let stopFails = 0;
for (const stop of STOPS) {
  const a = [300, 560], b = [190, 560], c = [190, 660];
  const first = line(a, b, 0.25), p = [a].concat(first, hold(b, stop), line(b, c, 0.25), hold(c, 0.1)), at = fires(p), pullStart = 1 + first.length + Math.round(stop * 60);
  stops.push(`${stop}s: ${at < 0 ? 'no Dive' : `fired ${(at - pullStart)} steps into the pull`}`);
  if (at < 0) stopFails++;
}
console.log('Steer, stop, then pull 100 CSS px in 0.25 s, by length of the stop: ' + stops.join(', '));

// ---- Gentle pulls from a resting thumb. The review's list, in CSS px and seconds: all did nothing at a 0.25 s window from 40 px in 0.3 s down.
const GENTLE = [[60, 0.1], [40, 0.15], [40, 0.25], [40, 0.3], [48, 0.445], [40, 0.4], [60, 0.5], [80, 0.7], [120, 1]];
const gentleMissed = GENTLE.filter(([dist, secs]) => { const a = [195, 560], b = [195, 560 + dist]; return fires(hold(a, 0.3).concat(line(a, b, secs), hold(b, 0.1))) < 0; });
console.log(`Gentle pulls from rest: ${GENTLE.length - gentleMissed.length} of ${GENTLE.length} fired` + (gentleMissed.length ? ', missed ' + JSON.stringify(gentleMissed) : ''));

// ---- A thumb dodging left and right while it slides slowly down the glass isn't a pull, and neither is a resting thumb creeping or trembling.
let dodgeTried = 0, dodgeFired = 0, quick = 0; const dodgeBad = [];
for (const amp of [25, 40, 60, 90]) for (const period of [0.4, 0.6, 0.8, 1.2, 1.6]) for (const slide of [20, 40, 60, 90]) {
  const p = []; for (let i = 0; i < 3 * 60; i++) { const t = i / 60; p.push([195 + amp * Math.sin(t * Math.PI * 2 / period), 500 + slide * t]); }
  const hit = fires(p) >= 0;
  if (slide === 90) { if (hit) quick++; continue; }   // 90 px/s down is nearly a gentle pull itself (48 px in 0.445 s is 108): noted, not a failure
  dodgeTried++; if (hit) { dodgeFired++; if (dodgeBad.length < 6) dodgeBad.push(`${amp} px, every ${period} s, sliding ${slide} px/s`); }
}
console.log(`Dodging while sliding down at up to 60 px/s: ${dodgeFired} of ${dodgeTried} fired. Sliding at 90 px/s: ${quick} of 20 fired (noted, not a failure)`); dodgeBad.forEach(b => console.log('  ' + b));
const rest = []; for (let i = 0; i < 5 * 60; i++) rest.push([195 + Math.sin(i * 0.9) * 3, 560 + Math.sin(i * 0.37) * 3 + i * 0.05]);   // trembling, and creeping 3 CSS px a second
const restFired = fires(rest) >= 0;
console.log('A resting thumb trembling and creeping for 5 s: ' + (restFired ? 'FIRED' : 'nothing'));

const fails = [];
if (gentleMissed.length) fails.push(`${gentleMissed.length} gentle pulls did nothing`);
if (dodgeFired) fails.push(`${dodgeFired} dodges spent a memory`);
if (restFired) fails.push('a resting thumb spent a memory');
if (fired) fails.push(`${fired} steering sweeps spent a memory`);
if (pullsFired < pullsTried) fails.push(`${pullsTried - pullsFired} real pulls did nothing`);
if (fresh < 0) fails.push('press and pull missed');
if (stopFails) fails.push('a steer, stop and pull gave no Dive');
console.log(fails.length ? 'FAILED: ' + fails.join('; ') : 'PASSED');
process.exit(fails.length ? 1 : 0);
