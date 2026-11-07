// Hot Hand fairness script, part: who wins what, the warning-time audit, tap targets. Run through tools/fairness.js.
module.exports = async function ({ page, ctx, SEEDS, ONLY, STAGE, stages, check, runMany, line, sum, PLAYERS, MIN_LEAD, SMALL_SCALE, SHOTS, path, fs }) {
  if (!ONLY || ONLY === 'players') {
    console.log('\n== Who wins what, ' + SEEDS + ' seeds a stage, no upgrades ==');
    for (let i = 0; i < stages; i++) {
      if (STAGE && +STAGE !== i + 1) continue;
      console.log('Stage ' + (i + 1));
      for (const name of Object.keys(PLAYERS)) console.log('  ' + line(name, await runMany(page, i, SEEDS, PLAYERS[name])));
    }
  }

  if (!ONLY || ONLY === 'audit') {
    console.log('\n== Warning-time audit: nobody playing, every hit logged with its warning ==');
    let leastAll = 1e9;
    for (let i = 0; i < stages; i++) {
      const list = await runMany(page, i, Math.min(SEEDS, 10), { __idle: true });
      const by = {};
      list.forEach(r => (r.hitLog || []).forEach(h => { const k = h.why; by[k] = by[k] || { n: 0, min: 1e9, max: 0 }; by[k].n++; by[k].min = Math.min(by[k].min, h.lead); by[k].max = Math.max(by[k].max, h.lead); }));
      console.log(`Stage ${i + 1}: ` + Object.keys(by).map(k => `${k} x${by[k].n} warned ${by[k].min} to ${by[k].max} s`).join('; '));
      Object.keys(by).forEach(k => { if (k !== 'burn') leastAll = Math.min(leastAll, by[k].min); });
      check(list.every(r => r.result === 'lose'), `stage ${i + 1}: nobody playing loses`);
    }
    check(leastAll >= MIN_LEAD, `every hit had at least ${MIN_LEAD} s of warning (least: ${leastAll} s)`);

    console.log('\n== Reaction sweep: 10 seeds a stage at each reaction time, 3 taps a second, no bad picks ==');
    for (const react of [0.3, 0.45, 0.6, 0.8]) {
      const per = [];
      for (let i = 0; i < stages; i++) {
        const list = await runMany(page, i, Math.min(SEEDS, 10), { botHuman: { react, taps: 3, jitter: 8, sloppy: 0 } });
        per.push(`S${i + 1} ${list.filter(r => r.result === 'win').length}/${list.length} wins, ${(sum(list, r => r.hits || 0) / list.length).toFixed(1)} hits`);
      }
      console.log(`react ${react} s: ` + per.join(' | '));
    }
  }

  if (!ONLY || ONLY === 'targets') {
    console.log('\n== Tap targets ==');
    let minW = 1e9, minH = 1e9;
    for (let i = 0; i < stages; i++) {
      const list = await runMany(page, i, 3, { botHuman: { react: 0.45, taps: 2.8, jitter: 8, sloppy: 0.1 } });
      list.forEach(r => { minW = Math.min(minW, r.minBoxW); minH = Math.min(minH, r.minBoxH); });
    }
    const air = await page.evaluate(() => TUNE.projReach * 2);
    console.log(`smallest box seen ${minW} x ${minH} logical px, which is ${(minW * SMALL_SCALE).toFixed(1)} x ${(minH * SMALL_SCALE).toFixed(1)} CSS px at 568 x 320. In the air: ${air} logical px, ${(air * SMALL_SCALE).toFixed(1)} CSS px.`);
    check(minW * SMALL_SCALE >= 44 && minH * SMALL_SCALE >= 44 && air * SMALL_SCALE >= 44, 'every tap target is at least 44 CSS px on the smallest phone');
  }
};
