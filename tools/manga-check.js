// Checks manga issue scripts, and writes the catalog the bookshelf reads.
//   node tools/manga-check.js 7        check one issue
//   node tools/manga-check.js          check all, print totals
//   node tools/manga-check.js --catalog  check all, write manga/catalog.js from the clean ones
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'manga', 'issues');
const { LAYOUTS } = require(path.join(ROOT, 'manga', 'layouts.js'));

const SPEAKERS = new Set('kaito sela juno silas bram ione skarn vesh ashka hush grist prism vasch hekka silt krell maro trooper otti tam tobias marisol wren dove kell nim yevka sorrel pike lucan bren hale sable regent oren corin crowd'.split(' '));
const KINDS = new Set(['say', 'shout', 'think', 'whisper', 'off']);
const SHOTS = new Set(['wide', 'medium', 'close', 'extreme-close', 'low-angle', 'high-angle', 'over-shoulder', 'silhouette', 'black']);
const ARCS = new Set(['pinhold', 'ashmarket', 'gaptooth', 'lanternreach', 'regatta', 'keelbreak', 'glassward', 'countoffive', 'deadwater', 'filler']);   // filler = side stories, shelved apart from the main run
// A blunt net for the World Bible fan service line. It catches slips; it does not replace the writer's judgment.
const BLOCK = /\b(nude|nudity|naked|topless|bottomless|nipples?|genitals?|groin|crotch|cleavage|upskirt|panty|panties|lingerie|see-?through|sheer|butt shot|ass shot|lingers?(ing)? on (her|his|their)|camera (lingers?|pans? (over|up|down))|seductive(ly)? pos|sexy pose|chibi|super-?deformed|loli|shota|schoolgirl|school uniform|childlike)\b/i;
const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;

function load(file) {
  let got = null;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { DriftManga: { issue(d) { got = d; } } }, { filename: file });
  return got;
}
function check(d) {
  const e = [];
  if (!d) return ['file never called DriftManga.issue'];
  for (const k of ['n', 'part', 'arc', 'title', 'blurb']) if (d[k] === undefined || d[k] === '') e.push('missing ' + k);
  if (!ARCS.has(d.arc)) e.push('unknown arc ' + d.arc);
  if (!d.cover || !d.cover.art || !d.cover.tagline) e.push('cover needs art and tagline');
  else if (BLOCK.test(d.cover.art)) e.push('cover art: blocked word: ' + d.cover.art.match(BLOCK)[0]);
  if (!Array.isArray(d.pages)) return e.concat('pages missing');
  let count = 0, spreads = 0, longs = 0;
  d.pages.forEach((p, i) => {
    const at = 'page index ' + (i + 1) + ': ';
    const L = LAYOUTS[p.layout];
    if (!L) { e.push(at + 'bad layout ' + p.layout); return; }
    if (p.layout === 'spread') { spreads++; count += 2; } else count++;
    if (!Array.isArray(p.panels) || p.panels.length !== L.length) e.push(at + 'layout ' + p.layout + ' needs ' + L.length + ' panels, has ' + (p.panels || []).length);
    (p.panels || []).forEach((q, j) => {
      const pat = at + 'panel ' + (j + 1) + ': ';
      if (!SHOTS.has(q.shot)) e.push(pat + 'bad shot ' + q.shot);
      if (words(q.art || '') < 8) e.push(pat + 'art under 8 words');
      if (BLOCK.test(q.art || '')) e.push(pat + 'blocked word in art: ' + q.art.match(BLOCK)[0]);
      if (q.long) longs++;
      let balloons = 0, total = 0;
      (q.text || []).forEach(t => {
        if (!Array.isArray(t)) { e.push(pat + 'text entry is not a list'); return; }
        const kind = t[0];
        if (kind === 'cap' || kind === 'sfx') { if (t.length !== 2) e.push(pat + kind + ' takes one string'); if (kind === 'cap') total += words(t[1]); return; }
        if (!KINDS.has(kind)) { e.push(pat + 'bad text kind ' + kind); return; }
        if (t.length !== 3) { e.push(pat + kind + ' needs speaker and text'); return; }
        if (!SPEAKERS.has(t[1]) && !/^extra:/.test(t[1])) e.push(pat + 'unknown speaker ' + t[1]);
        balloons++; total += words(t[2]);
        if (!q.long && words(t[2]) > 25) e.push(pat + 'balloon over 25 words: ' + t[2].slice(0, 40));
      });
      if (!q.long && balloons > 4) e.push(pat + balloons + ' balloons (max 4)');
      if (!q.long && total > 35) e.push(pat + total + ' words (max 35)');
    });
  });
  if (count < 22 || count > 30) e.push(count + ' pages (22 to 26, specials to 30)');
  if (spreads > 2) e.push(spreads + ' spreads (max 2)');
  if (longs > 2) e.push(longs + ' long panels (max 2)');
  const x = d.extras || {};
  if (!x.serial || !x.serial.title || !x.serial.text) e.push('extras.serial missing');
  if (!Array.isArray(x.letters) || x.letters.length < 2 || x.letters.length > 4) e.push('extras.letters needs 2 to 4');
  else x.letters.forEach((l, i) => { if (!l.from || !l.q || !l.who || !l.a) e.push('letter ' + (i + 1) + ' needs from, q, who, a'); });
  if (!x.next) e.push('extras.next missing');
  return e;
}
function stats(d) {
  let pages = 0, panels = 0, spoken = 0;
  (d.pages || []).forEach(p => { pages += p.layout === 'spread' ? 2 : 1; (p.panels || []).forEach(q => { panels++; (q.text || []).forEach(t => { if (t[0] !== 'sfx') spoken += words(t[t.length - 1]); }); }); });
  return { pages, panels, spoken };
}
const arg = process.argv[2];
const files = fs.readdirSync(DIR).filter(f => /^issue-\d+\.js$/.test(f)).sort();
const pick = arg && arg !== '--catalog' ? files.filter(f => Number(f.match(/\d+/)[0]) === Number(arg)) : files;
if (arg && arg !== '--catalog' && !pick.length) { console.log('no file for issue ' + arg); process.exit(1); }
let bad = 0, sum = { pages: 0, panels: 0, spoken: 0 };
const clean = [];
for (const f of pick) {
  let d, e;
  try { d = load(path.join(DIR, f)); e = check(d); } catch (err) { e = ['does not parse: ' + err.message]; }
  const num = Number(f.match(/\d+/)[0]);
  if (d && d.n !== num) e.push('n is ' + d.n + ' but the file is ' + f);
  if (e.length) { bad++; console.log(f + ': ' + e.length + ' problem(s)'); e.slice(0, 40).forEach(x => console.log('  ' + x)); continue; }
  const s = stats(d);
  Object.keys(sum).forEach(k => sum[k] += s[k]);
  clean.push({ n: d.n, part: d.part, arc: d.arc, title: d.title, blurb: d.blurb, tagline: d.cover.tagline, coverArt: d.cover.art, pages: s.pages });
  console.log(f + ': clean, ' + s.pages + ' pages, ' + s.panels + ' panels, ' + s.spoken + ' words of text');
}
console.log(`${clean.length} clean, ${bad} with problems. Totals for clean issues: ${sum.pages} pages, ${sum.panels} panels, ${sum.spoken} words of text.`);
if (arg === '--catalog') {
  fs.writeFileSync(path.join(ROOT, 'manga', 'catalog.js'), '// Written by tools/manga-check.js --catalog. Do not edit by hand.\nwindow.DRIFT_MANGA_CATALOG = ' + JSON.stringify(clean, null, 1) + ';\n');
  console.log('wrote manga/catalog.js with ' + clean.length + ' issues');
}
process.exit(bad ? 1 : 0);
