// Unit test for shared/save.js. Run: node tools/test-save.js
const assert = require('assert'), fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', 'shared', 'save.js'), 'utf8');
const KEY = 'driftbound-save-v1';

function fakeStore(start) {
  const m = new Map(Object.entries(start || {}));
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), _m: m };
}
function boot(storage) {
  const box = { window: {} };
  if (storage === 'throw-on-access') Object.defineProperty(box, 'localStorage', { get() { throw new Error('blocked'); } });
  else if (storage) box.localStorage = storage;
  vm.runInNewContext(src, box);
  return box.window.DriftSave;
}
function clean(x) { return JSON.parse(JSON.stringify(x)); }

const tests = {
  'fresh save': () => {
    const d = boot(fakeStore()).load();
    assert.deepStrictEqual(clean(d), { version: 2, salvage: 0, lifetime: 0, games: {}, pals: [], settings: {} });
  },
  'old save upgrades: lifetime starts at the current total, nothing lost': () => {
    const old = { salvage: 137, games: { 'storm-run': { best: 900, plays: 4, salvage: 137 } }, pals: [], oddField: 'keep me' };
    const st = fakeStore({ [KEY]: JSON.stringify(old) }), s = boot(st), d = s.load();
    assert.strictEqual(d.salvage, 137); assert.strictEqual(d.lifetime, 137);
    assert.strictEqual(d.oddField, 'keep me');
    assert.strictEqual(d.games['storm-run'].best, 900); assert.strictEqual(d.games['storm-run'].plays, 4);
    assert.strictEqual(d.games['storm-run'].cleared, 0); assert.strictEqual(d.games['storm-run'].fairBest, 0);
    s.finishRun('storm-run', 10, 3);
    const after = JSON.parse(st.getItem(KEY));
    assert.strictEqual(after.salvage, 140); assert.strictEqual(after.lifetime, 140); assert.strictEqual(after.oddField, 'keep me');
    assert.strictEqual(after.games['storm-run'].best, 900);
  },
  'the old Hoshi save is never read or changed': () => {
    const st = fakeStore({ 'hoshi-arcade-save-v1': '{"shards":5}' }), s = boot(st);
    s.finishRun('a', 1, 1);
    assert.strictEqual(st.getItem('hoshi-arcade-save-v1'), '{"shards":5}');
    assert.strictEqual(s.load().salvage, 1);
  },
  'old finishRun call still works and returns best, newBest, total': () => {
    const s = boot(fakeStore());
    let r = s.finishRun('a', 50, 7);
    assert.strictEqual(r.best, 50); assert.strictEqual(r.newBest, true); assert.strictEqual(r.total, 7);
    r = s.finishRun('a', 20, 3);
    assert.strictEqual(r.best, 50); assert.strictEqual(r.newBest, false); assert.strictEqual(r.total, 10);
    assert.strictEqual(s.load().games.a.plays, 2); assert.strictEqual(s.load().games.a.salvage, 10);
  },
  'fair runs keep their own best; upgraded runs do not touch it': () => {
    const s = boot(fakeStore());
    s.finishRun('a', 500, 0);
    assert.strictEqual(s.game('a').fairBest, 0);
    const r = s.finishRun('a', 100, 0, { fair: true });
    assert.strictEqual(r.fairBest, 100); assert.strictEqual(r.newFairBest, true); assert.strictEqual(r.best, 500); assert.strictEqual(r.newBest, false);
  },
  'spending lowers the balance only': () => {
    const s = boot(fakeStore());
    s.finishRun('a', 1, 100);
    assert.strictEqual(s.spend(30), true);
    assert.strictEqual(s.load().salvage, 70); assert.strictEqual(s.load().lifetime, 100);
    assert.strictEqual(s.spend(71), false); assert.strictEqual(s.load().salvage, 70);
    assert.strictEqual(s.spend(-5), false); assert.strictEqual(s.spend(NaN), false); assert.strictEqual(s.load().salvage, 70);
  },
  'upgrades cost salvage, cap at 3 levels, and refuse when short': () => {
    const s = boot(fakeStore());
    s.finishRun('a', 1, 100);
    assert.strictEqual(s.buyUpgrade('a', 'x', 150).ok, false);
    assert.strictEqual(s.upgradeLevel('a', 'x'), 0);
    for (let i = 1; i <= 3; i++) assert.strictEqual(s.buyUpgrade('a', 'x', 10).level, i);
    const r = s.buyUpgrade('a', 'x', 10);
    assert.strictEqual(r.ok, false); assert.strictEqual(r.level, 3); assert.strictEqual(r.total, 70);
    assert.strictEqual(s.load().lifetime, 100);
  },
  'stage progress only goes up; story finish sticks': () => {
    const s = boot(fakeStore());
    assert.strictEqual(s.clearStage('a', 2), 3);
    assert.strictEqual(s.clearStage('a', 0), 3);
    assert.strictEqual(s.game('a').finished, false);
    s.finishStory('a');
    assert.strictEqual(s.game('a').finished, true);
    assert.strictEqual(s.game('never-played').cleared, 0);
  },
  'pals are caught once only': () => {
    const s = boot(fakeStore());
    assert.strictEqual(s.catchPal('fizzlet'), true);
    assert.strictEqual(s.catchPal('fizzlet'), false);
    assert.strictEqual(s.hasPal('fizzlet'), true); assert.strictEqual(s.hasPal('bobbin'), false);
    assert.strictEqual(s.load().pals.length, 1);
  },
  'settings remember (mute carries across games)': () => {
    const st = fakeStore(), s = boot(st);
    assert.strictEqual(s.getSetting('mute', false), false);
    s.setSetting('mute', true);
    assert.strictEqual(boot(st).getSetting('mute', false), true);
  },
  'bad numbers cannot poison the totals': () => {
    const s = boot(fakeStore());
    s.finishRun('a', NaN, Infinity); s.finishRun('a', -5, -5); s.finishRun('a', '9', '9');
    const d = s.load();
    assert.strictEqual(d.salvage, 0); assert.strictEqual(d.lifetime, 0); assert.strictEqual(d.games.a.best, 0); assert.strictEqual(d.games.a.plays, 3);
  },
  'damaged save: starts blank and keeps a copy of the damage once': () => {
    const st = fakeStore({ [KEY]: '{not json' }), s = boot(st);
    assert.strictEqual(s.load().salvage, 0);
    assert.strictEqual(st.getItem(KEY + '-damaged'), '{not json');
    s.finishRun('a', 1, 5);
    assert.strictEqual(JSON.parse(st.getItem(KEY)).salvage, 5);
    assert.strictEqual(st.getItem(KEY + '-damaged'), '{not json');
  },
  'wrong-shape data does not crash': () => {
    for (const bad of ['null', '[]', '5', '{"salvage":"x","games":{}}', '{"salvage":3}']) {
      assert.strictEqual(boot(fakeStore({ [KEY]: bad })).load().salvage, 0, bad);
    }
    const s = boot(fakeStore({ [KEY]: JSON.stringify({ salvage: 3, games: { a: 'nope', b: { best: 'x' } }, pals: [1, 'bobbin'], settings: 7 }) }));
    const d = s.load();
    assert.strictEqual(d.games.a.best, 0); assert.strictEqual(d.games.b.best, 0);
    assert.deepStrictEqual(clean(d.pals), ['bobbin']); assert.deepStrictEqual(clean(d.settings), {});
  },
  'lifetime is never below the balance': () => {
    assert.strictEqual(boot(fakeStore({ [KEY]: JSON.stringify({ salvage: 50, lifetime: 10, games: {} }) })).load().lifetime, 50);
  },
  'storage blocked (reading localStorage throws): progress lasts this page': () => {
    const s = boot('throw-on-access');
    assert.strictEqual(s.load().salvage, 0);
    s.finishRun('a', 10, 5); s.catchPal('bobbin'); s.buyUpgrade('a', 'x', 2);
    const d = s.load();
    assert.strictEqual(d.salvage, 3); assert.strictEqual(d.lifetime, 5); assert.strictEqual(d.pals[0], 'bobbin'); assert.strictEqual(d.games.a.upgrades.x, 1);
  },
  'storage full (writes throw, reads work): progress lasts this page': () => {
    const st = fakeStore({ [KEY]: JSON.stringify({ salvage: 9, games: {} }) });
    st.setItem = () => { throw new Error('full'); };
    const s = boot(st);
    s.finishRun('a', 1, 1);
    assert.strictEqual(s.load().salvage, 10);
  },
  'a story run\'s carry is saved, per game, and can be cleared': () => {
    const st = fakeStore({});
    let s = boot(st);
    assert.strictEqual(s.storyCarry('a'), null);
    s.setStoryCarry('a', { iron: 3 });
    s = boot(st);
    assert.deepStrictEqual(clean(s.storyCarry('a')), { iron: 3 });
    assert.strictEqual(s.storyCarry('b'), null);
    s.setStoryCarry('a', {});
    assert.strictEqual(s.storyCarry('a'), null);
    s.setStoryCarry('a', { iron: 1 }); s.setStoryCarry('a', null);
    assert.strictEqual(s.storyCarry('a'), null);
  },
  'no localStorage at all': () => {
    const s = boot(null);
    s.finishRun('a', 1, 2);
    assert.strictEqual(s.load().salvage, 2);
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try { fn(); console.log('ok   ' + name); }
  catch (e) { failed++; console.log('FAIL ' + name + '\n     ' + e.message); }
}
console.log(`${Object.keys(tests).length - failed} of ${Object.keys(tests).length} passed`);
process.exit(failed ? 1 : 0);
