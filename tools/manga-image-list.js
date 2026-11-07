// Writes the picture list for the manga from the scripts themselves: every cover, every splash and spread, with the art note.
//   node tools/manga-image-list.js   → docs/manga/IMAGE_LIST_GENERATED.md (the hand-written priorities are in IMAGE_REQUESTS.md)
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), DIR = path.join(ROOT, 'manga', 'issues');
const rows = [], big = [];
let panels = 0;
for (const f of fs.readdirSync(DIR).filter(f => /^issue-\d+\.js$/.test(f)).sort()) {
  let d = null; vm.runInNewContext(fs.readFileSync(path.join(DIR, f), 'utf8'), { DriftManga: { issue(x) { d = x; } } });
  if (!d) continue;
  const id = 'i' + String(d.n).padStart(2, '0');
  rows.push(`| ${d.n} | ${d.title} | \`${id}-cover\` | ${d.cover.art.replace(/\|/g, '/')} |`);
  d.pages.forEach((p, pi) => p.panels.forEach((q, qi) => {
    panels++;
    if (p.layout === 'full' || p.layout === 'spread') big.push(`| ${d.n} | ${pi + 1} | ${p.layout} | \`${id}-p${String(pi + 1).padStart(2, '0')}-${qi + 1}\` | ${q.art.replace(/\|/g, '/')} |`);
  }));
}
const out = `# Manga picture list, generated (${new Date().toISOString().slice(0, 10)})

Written by \`node tools/manga-image-list.js\` from the issue scripts. The key in each row is the name to use in \`manga/art/manifest.js\` so the reader swaps the placeholder for the picture. Priorities and the character sheets that must exist first are in \`IMAGE_REQUESTS.md\`.

Counts: ${rows.length} covers, ${big.length} splash or spread pages, ${panels} panels in all.

## Covers (${rows.length})
| Issue | Title | Key | Cover brief |
|---|---|---|---|
${rows.join('\n')}

## Splash pages and spreads (${big.length})
| Issue | Page | Layout | Key | Art note |
|---|---|---|---|---|
${big.join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'docs', 'manga', 'IMAGE_LIST_GENERATED.md'), out);
console.log(`${rows.length} covers, ${big.length} splash/spread pages, ${panels} panels`);
