// Writes docs/PROVISIONAL.md from the numbers files, and checks the count against a plain search for the word PROVISIONAL.
// Run: node docs/make-provisional.js        Exit code 1 if the counts don't add up. Words for unexplained numbers: provisional-words.js.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const { BARE, FIRST, GAMES } = require('./provisional-words.js');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// The code part and the comment part of a line, ignoring // inside strings.
function split(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') q = c;
    else if (c === '/' && line[i + 1] === '/') return [line.slice(0, i), line.slice(i + 2).trim()];
  }
  return [line, ''];
}
const shown = s => s.replace(/^\s*(get\s+)?/, '').replace(/^[\w$]+\s*:\s*/, '').replace(/^\{\s*(?=.*\[\s*$)/, '{ ').replace(/,\s*$/, '').replace(/,?\s*waves:\s*\[\s*$/, ' }').trim();

// Walks one numbers file. Every line ends up as an entry, a header, or nothing.
function walk(file) {
  const out = { file, entries: [], headers: [], sourced: 0, botNoMark: 0, unmarked: [] };
  const stack = []; let section = '', block = false, openProvisional = 0;
  read(file).split(/\r?\n/).forEach((raw, n) => {
    const [code, comment] = split(raw), marked = /PROVISIONAL/.test(comment), line = n + 1;
    if (!code.trim()) {
      if (/^----/.test(comment)) { section = comment.replace(/^-+\s*/, ''); block = /PROVISIONAL/.test(comment); }
      else if (marked && n > 0 && /^(Where|shots and clock)/.test(comment)) block = true;
      else if (!comment) block = false;
      if (marked) out.headers.push(line);
      return;
    }
    const key = (code.match(/^\s*(?:get\s+)?([\w$]+)\s*[:(]/) || [])[1];
    const top = stack[stack.length - 1];
    const here = stack.map(s => s.arr ? `${s.key}[${s.i}]` : s.key).filter(Boolean);
    const inArr = top && top.arr && !key;
    if (inArr && /^\s*[{[]/.test(code)) top.i++;
    if (inArr && /^\s*[{[]/.test(code)) here[here.length - 1] = `${top.key}[${top.i}]`;
    const wholeTree = (code.match(/^\s*TUNE\.([\w$]+)\s*=/) || [])[1];
    const name = wholeTree || [...here, key].filter(Boolean).join('.');
    const hasNumber = /\d/.test(code);
    const inherited = openProvisional > 0;
    if (hasNumber && name) {
      const words = comment.replace(/^PROVISIONAL\s*[.:]?\s*/, '');
      const many = !/[{[]/.test(code) && (code.match(/[\w$]+\s*:/g) || []).length > 1;
      const e = { line, name: many ? here.join('.') || name : name, value: many ? code.trim().replace(/,\s*$/, '') : shown(code), words, section };
      if (marked || block || inherited) { e.how = marked ? 'marked' : block ? 'block' : 'row'; out.entries.push(e); }
      else if (comment) out.sourced++;
      else if (kind(e) === 'bot') out.botNoMark++;
      else out.unmarked.push(e);
    } else if (marked) { out.headers.push(line); if (process.argv[2] === 'bare') console.log('HEADER', file, line, code.trim().slice(0, 70)); }
    // Keep the path up to date: open and close brackets, strings ignored.
    const bare = code.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, "''");
    const isRoot = /^\s*(window\.TUNE|window\.TUNE_STAGES|Object\.assign)/.test(code);
    for (let i = 0; i < bare.length; i++) {
      const ch = bare[i];
      if (ch === '{' || ch === '[') {
        const parent = stack[stack.length - 1];
        const k = (bare.slice(0, i).match(/([\w$]+)\s*:\s*$/) || [])[1] || '';
        stack.push({ key: isRoot ? '' : (wholeTree && !stack.length ? wholeTree : k), arr: ch === '[', i: -1, prov: (marked && !isRoot) || (parent && parent.prov) });
      } else if (ch === '}' || ch === ']') stack.pop();
    }
    openProvisional = stack.some(s => s.prov) ? 1 : 0;
  });
  return out;
}

const kind = e => {
  if (/^bot|\.bot|^bot\b/i.test(e.name) || /test bot|the test bot|test only/i.test(e.section + ' ' + e.words) || /\bbot\b/.test(e.name)) return 'bot';
  if (/looks only|just looks|^look/i.test(e.words) || /Screen layout|Looks only|Shakes|The deck on screen|^The street/i.test(e.section)) return 'looks';
  return 'play';
};
const auto = (e) => {
  let m = e.name.match(/^stages\[(\d+)\]\.waves\[(\d+)\]$/);
  if (m) return `Stage ${+m[1] + 1}, wave ${+m[2] + 1}: how many of each foe, and the seconds between them.`;
  m = e.name.match(/^stages\[(\d+)\]$/);
  if (m) return `Stage ${+m[1] + 1}: its length, speed, gaps and pay.`;
  m = e.name.match(/^sense\[(\d+)\]$/);
  if (m) return `What Sela can sense with ${m[1]} lines left: how far ahead the arrows show, and how many gates she misses.`;
  return '';
};
const words = (game, e) => e.words || auto(e) || BARE[`${game}/${e.name}`] || BARE[`*/${e.name}`] || BARE[`${game}/${e.name.replace(/\[\d+\]/g, '[]')}`] || `${e.section || 'No note'} (no note beside this number in the file).`;

// Silent Cut's layouts and Split Light's boards are whole maps, so they're summed up, not copied.
function silentLayouts() {
  const box = { window: {} }; vm.runInNewContext(read('games/silent-cut/tuning-stages.js'), box);
  const S = box.window.TUNE_STAGES, rows = [];
  const count = c => ['cover', 'lantern', 'sweep', 'flood', 'crane', 'trooper', 'board', 'coin'].filter(k => c[k]).map(k => `${c[k].length} ${k}`).join(', ');
  Object.entries(S.chunks).forEach(([k, c]) => rows.push({ name: `chunks.${k}`, value: `${c.len} px`, words: `A stretch of street, ${c.len} px long, with ${count(c)}.` }));
  S.stages.forEach((s, i) => { const { seq, radioAt, tips, theme, boss, ...nums } = s; rows.push({ name: `stages[${i}]`, value: Object.entries(nums).map(([a, b]) => `${a} ${b}`).join(', '), words: `Stage ${i + 1}: fast = how quick beams, cranes and troopers are; alert = how quick the meter fills; lineV = the lamp line's speed; par and clearSalvage = pay.` }); });
  rows.push({ name: 'boss', value: `desks ${S.boss.desks.join(', ')}`, words: `Maro's warehouse: where his three desks stand, with ${S.boss.cover.length} covers, ${S.boss.lantern.length} lanterns, ${S.boss.trooper.length} troopers, ${S.boss.coin.length} cogs and his room beam laid out around them.` });
  rows.push({ name: 'endless', value: `${S.endless.pool.length} stretches`, words: 'Which stretches of street Endless picks from, and how it speeds up.' });
  return rows;
}
function splitBoards() {
  const box = { window: {}, TUNE: { bossCount: 'his count' } }; box.SL = {}; box.window.SL = box.SL;
  vm.runInNewContext(read('games/split-light/levels.js').replace(/\[([\s\S]*?)\]\.forEach[\s\S]*$/, m => m), box);
  const titles = read('games/split-light/words-levels.js').match(/\{ name: '[^']+'/g).map(s => s.slice(9, -1));
  const rows = box.SL.LEVELS.map((l, i) => ({ name: l.id, value: `${l.shots} shots${l.clock ? `, ${l.clock} s a stop` : ''}`, words: `Level ${i + 1}, ${titles[i] || l.id}: shots you get for the whole level. Par ${l.par} is proved by the solver, not provisional.` }));
  box.SL.BOSS.forEach((l, i) => rows.push({ name: l.id, value: `${l.shots} shots${l.clock ? `, ${l.clock} s a stop` : ''}`, words: `Boss board ${i + 1}: shots per attempt at this board. Par ${l.par} is proved by the solver.` }));
  return rows;
}
function storyThresholds() {
  const box = { window: {} }; vm.runInNewContext(read('shared/stories.js'), box);
  return box.window.DRIFT_STORIES.map(s => ({ name: s.id, value: `${s.at} salvage`, words: `Lifetime salvage that opens the card "${s.title}".` }));
}
function constants(file) {
  const rows = [], headers = [];
  read(file).split(/\r?\n/).forEach((raw, i) => {
    const [code, comment] = split(raw);
    if (!/PROVISIONAL/.test(comment) && !/PROVISIONAL/.test(raw)) return;
    const m = code.match(/(?:const\s+)?([\w$]+)\s*[:=]\s*(.+?)[,;]?\s*$/);
    if (m && /\d/.test(m[2])) rows.push({ line: i + 1, name: m[1], value: m[2], words: comment.replace(/^PROVISIONAL\s*[:(]?\s*/, '').replace(/\)$/, '') });
    else headers.push(i + 1);
  });
  return { rows, headers };
}

const lines = [], check = [];
const say = s => lines.push(s);
const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
const row = (e, game) => say(`- \`${e.name}\` **${e.value}**. ${cap(e.words || words(game, e))}`);
let grandPlay = 0, grandLooks = 0, grandBot = 0, ok = true;

say('# Provisional numbers, for Dylan to confirm');
say('');
say('Made by `node docs/make-provisional.js` from the game files; edit those, not this. **Nothing here has been tried by a person\'s thumb.** A number is on this list until you say it\'s right. To change one, tell Claude the game and what felt wrong; the name in `code` is only there so the number can be found.');
say('');
say('@@SUMMARY@@');
say('');
GAMES.forEach(g => {
  const files = g.files.map(walk);
  say(`## ${g.title}`);
  say('');
  if (FIRST[g.id]) {
    say('**Try these first** (the ones most likely to change):');
    const all = files.flatMap(f => f.entries);
    FIRST[g.id].forEach(([plain, n]) => { const e = all.find(x => x.name === n); if (!e) throw new Error(`${g.id}: no number called ${n}`); say(`- ${plain}: **${e.value}** (\`${n}\`)`); });
    say('');
  }
  files.forEach(f => {
    const play = f.entries.filter(e => kind(e) === 'play'), looks = f.entries.filter(e => kind(e) === 'looks'), bot = f.entries.filter(e => kind(e) === 'bot');
    say(`### \`${f.file}\`: ${play.length} play, ${looks.length} look or layout, ${bot.length} test bot`);
    say('');
    let section = null;
    play.forEach(e => { if (e.section !== section) { section = e.section; say(''); say(`*${section.replace(/\*/g, '')}*`); say(''); } row(e, g.id); });
    if (looks.length) { say(''); say('*Looks and layout: they change how it looks or fits, not the rules*'); say(''); looks.forEach(e => row(e, g.id)); }
    if (bot.length) { say(''); say(`*Test bot only, nothing to confirm:* ${bot.map(e => '`' + e.name + '`').join(', ')}.`); }
    if (f.unmarked.length) { say(''); say('*No mark and no source in the file, so counted as provisional:*'); say(''); f.unmarked.forEach(e => { e.words = e.words || 'No note in the file.'; row(e, g.id); }); }
    say('');
    grandPlay += play.length + f.unmarked.filter(e => kind(e) === 'play').length; grandLooks += looks.length; grandBot += bot.length;
    const text = read(f.file).split(/\r?\n/).filter(l => /PROVISIONAL/.test(l)).length;
    const markedEntries = f.entries.filter(e => e.how === 'marked').length, sum = markedEntries + f.headers.length;
    const good = sum === text; ok = ok && good;
    check.push(`${good ? 'ok  ' : 'FAIL'} ${f.file}: ${text} lines with the word = ${markedEntries} numbers + ${f.headers.length} heading lines. Also listed: ${f.entries.filter(e => e.how === 'block').length} under an "all PROVISIONAL" heading, ${f.entries.filter(e => e.how === 'row').length} rows inside a marked stage, ${f.unmarked.length} with no mark at all. Left out, with a source or a note and no mark: ${f.sourced}. Left out, test bot with no mark: ${f.botNoMark}.`);
  });
  (g.extra || []).forEach(x => {
    const rows = x === 'silent' ? silentLayouts() : splitBoards();
    const file = x === 'silent' ? 'games/silent-cut/tuning-stages.js' : 'games/split-light/levels.js';
    say(`### \`${file}\`: ${rows.length} rows, every number on them provisional`);
    say('');
    rows.forEach(e => row(e, g.id));
    say('');
    grandPlay += rows.length;
    check.push(`note ${file}: the file says every number is provisional in its heading, so ${rows.length} rows are summed up here, not one per line.`);
  });
});

say('## Shared by every game');
say('');
const cfg = constants('shared/config.js'); say('### `shared/config.js`'); say(''); cfg.rows.forEach(e => row(e, '*')); say('');
const st = storyThresholds(); say('### `shared/stories.js`: when each story card opens'); say(''); st.forEach(e => row(e, '*')); say('');
let shared = cfg.rows.length + st.length;
['shared/kit/input.js', 'shared/kit/talk.js', 'shared/kit/game.js', 'shared/kit/audio.js', 'shared/kit/core.js', 'shared/kit/art.js'].forEach(f => {
  const c = constants(f); say(`### \`${f}\``); say(''); c.rows.forEach(e => { e.words = e.words || BARE[`*/${e.name}`] || ''; row(e, '*'); }); say(''); shared += c.rows.length;
});
grandPlay += shared;
check.push(`note shared: ${shared} rows (config ${cfg.rows.length}, story cards ${st.length}, kit ${shared - cfg.rows.length - st.length}).`);
check.push('left out on purpose: PROVISIONAL marks in test scripts (games/hold-the-deck/test/fairness.js, games/hot-hand/tools/fairness.js). They are pass marks for the tests, not numbers anyone plays.');

say('## How this list was counted');
say('');
say('One line in a file is one row, even when that line holds several numbers (a stage\'s row holds many). Every result from the last run of the script:');
say('');
say('```');
check.forEach(c => say(c));
say('```');
const text = lines.join('\n').replace('@@SUMMARY@@', `**${grandPlay} rows change how it plays, ${grandLooks} only change looks or layout, and ${grandBot} only steer the test bot.** Under each game: the ones to try first, then every number by file.`) + '\n';
fs.writeFileSync(path.join(__dirname, 'PROVISIONAL.md'), text);
console.log(check.join('\n'));
if (process.argv[2] === 'bare') console.log(lines.filter(l => /no note beside/.test(l)).map(l => l.slice(0, 110)).join('\n'));
console.log(`play ${grandPlay}, looks ${grandLooks}, bot ${grandBot}`);
const noWords = (text.match(/no note beside this number/g) || []).length;
console.log('rows with no plain words: ' + noWords);
process.exit(ok ? 0 : 1);
