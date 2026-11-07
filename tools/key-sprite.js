// Turns a picture on a flat #00FF00 background (what the image tool can make) into a game sprite with a see-through background.
// node tools/key-sprite.js in.png out.webp --cols 3 --rows 2 --cell 384 [--align] [--split a.webp,b.webp,c.webp]
//   --align lines every frame up on the character's body, so a strip doesn't jitter from side to side.
//   --split writes each cell as its own file instead of one strip.
// Prints where the feet and top of the character sit in each frame, for art/sprites.js. Needs Chrome and playwright-core, like tools/smoke.js.
const fs = require('fs'), path = require('path'), os = require('os');
const PW = [process.env.PW_PATH, 'playwright-core', path.join(os.tmpdir(), 'kcheck', 'pw', 'node_modules', 'playwright-core')].filter(Boolean);
let pw = null;
for (const p of PW) { try { pw = require(p); break; } catch (e) { /* try the next one */ } }
if (!pw) { console.error('playwright-core not found'); process.exit(2); }
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const [input, output] = args, cols = +opt('cols', 1), rows = +opt('rows', 1), cell = +opt('cell', 384), align = args.includes('--align'), split = opt('split', '');

(async () => {
  const b = await pw.chromium.launch({ channel: 'chrome', headless: true });
  const p = await b.newPage();
  const data = 'data:image/png;base64,' + fs.readFileSync(input).toString('base64');
  const out = await p.evaluate(async ({ data, cols, rows, cell, align, split }) => {
    const img = new Image(); img.src = data; await img.decode();
    const cw = img.naturalWidth / cols, ch = img.naturalHeight / rows, scale = cell / ch, frames = [], info = [];
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      const c = cv.getContext('2d', { willReadFrequently: true }); c.drawImage(img, -q * cw, -r * ch);
      const d = c.getImageData(0, 0, cw, ch), px = d.data;
      let top = ch, bottom = -1, left = cw, right = -1, sum = 0, n = 0;
      for (let i = 0, y = 0; y < ch; y++) for (let x = 0; x < cw; x++, i += 4) {
        const g = px[i + 1], other = Math.max(px[i], px[i + 2]), spill = g - other;
        // Green goes: fully where it's plainly green, partly along the soft edge, and any green tint is taken off what stays.
        const a = spill >= 110 ? 0 : spill <= 25 ? 1 : 1 - (spill - 25) / 85;
        if (spill > 0) px[i + 1] = other;
        px[i + 3] = Math.round(a * 255);
        if (a > 0.5) { top = Math.min(top, y); bottom = Math.max(bottom, y); left = Math.min(left, x); right = Math.max(right, x); }
      }
      // The body's middle: the opaque pixels in the band below the head.
      const y0 = top + (bottom - top) * 0.2, y1 = top + (bottom - top) * 0.45;
      for (let i = 0, y = 0; y < ch; y++) for (let x = 0; x < cw; x++, i += 4) if (px[i + 3] > 128 && y >= y0 && y <= y1) { sum += x; n++; }
      c.putImageData(d, 0, 0);
      const mid = n ? sum / n : cw / 2;
      frames.push({ cv, mid });
      info.push({ feet: +(bottom / ch).toFixed(3), top: +(top / ch).toFixed(3), left: +(left / cw).toFixed(3), right: +(right / cw).toFixed(3), mid: +(mid / cw).toFixed(3) });
    }
    const cellW = Math.round(cw * scale);
    function put(c, f, x, y) {
      const dx = align ? cw / 2 - f.mid : 0;
      c.imageSmoothingQuality = 'high';
      c.drawImage(f.cv, x + dx * scale, y, cw * scale, ch * scale);
    }
    if (split) return { info, files: frames.map(f => { const cv = document.createElement('canvas'); cv.width = cellW; cv.height = cell; put(cv.getContext('2d'), f, 0, 0); return cv.toDataURL('image/webp', 0.92); }) };
    const cv = document.createElement('canvas'); cv.width = cellW * cols; cv.height = cell * rows;
    const c = cv.getContext('2d');
    frames.forEach((f, i) => {
      c.save(); c.beginPath(); c.rect((i % cols) * cellW, Math.floor(i / cols) * cell, cellW, cell); c.clip();
      put(c, f, (i % cols) * cellW, Math.floor(i / cols) * cell);
      c.restore();
    });
    return { info, files: [cv.toDataURL('image/webp', 0.92)] };
  }, { data, cols, rows, cell, align, split });
  await b.close();
  const names = split ? split.split(',') : [output];
  out.files.forEach((f, i) => { const name = split ? path.join(path.dirname(output), names[i]) : names[i]; fs.writeFileSync(name, Buffer.from(f.split(',')[1], 'base64')); console.log(name, fs.statSync(name).size + ' bytes'); });
  out.info.forEach((f, i) => console.log('frame ' + (i + 1), JSON.stringify(f)));
})();
