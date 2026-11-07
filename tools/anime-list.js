// Writes shared/anime.js (the episode list the Anime page shows) from anime/episodes/ep-NN.md.
// The anime folder itself stays off the public site (_config.yml), so the list lives in shared/.
//   node tools/anime-list.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'anime', 'episodes');
const out = [];
for (const f of fs.readdirSync(DIR).filter(f => /^ep-\d+\.md$/.test(f)).sort()) {
  const t = fs.readFileSync(path.join(DIR, f), 'utf8');
  const head = t.match(/^# Driftbound[^\n]*Episode (\d+):\s*"([^"\n]+)"/m);
  const adapts = t.match(/Adapts:\s*Manga Issue (\d+)/);
  const run = t.match(/Total runtime:\s*≈?\s*(\d{1,2}:\d{2})/) || t.match(/Target runtime:\s*(\d{1,2}:\d{2})/);
  const words = t.match(/words: total (\d+)/);
  if (!head) { console.log(f + ': no header found, skipped'); continue; }
  out.push({ n: Number(head[1]), title: head[2], issue: adapts ? Number(adapts[1]) : Number(head[1]), runtime: run ? run[1] : '', words: words ? Number(words[1]) : 0 });
}
fs.writeFileSync(path.join(ROOT, 'shared', 'anime.js'), '// Written by tools/anime-list.js from anime/episodes/. Do not edit by hand.\nwindow.DRIFT_ANIME = ' + JSON.stringify(out, null, 1) + ';\n');
console.log('wrote shared/anime.js with ' + out.length + ' episodes');
