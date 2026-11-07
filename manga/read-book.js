// The running order of a book: cover, story, letters, serial, back page. And how it folds into what's on screen at once.
(function () {
  const DM = window.DM;

  // A leaf is one printed thing. no = its printed page number. A spread takes two numbers.
  function leavesOf(issue) {
    const out = [{ type: 'cover', no: 0, noEnd: 0 }];
    let no = 1;
    issue.pages.forEach((p, idx) => {
      const wide = p.layout === 'spread';
      out.push({ type: 'story', idx, no, wide, noEnd: wide ? no + 1 : no });
      no += wide ? 2 : 1;
    });
    ['letters', 'serial', 'back'].forEach(type => { out.push({ type, no, noEnd: no }); no++; });
    return out;
  }

  // A view is what's on screen at one time: leaf indexes in reading order (-1 is a blank page).
  // On a phone that's one leaf. On a computer it's two facing pages, the cover alone, and a spread across both.
  function viewsOf(leaves, double) {
    if (!double) return leaves.map((l, i) => ({ leaves: [i], wide: !!l.wide }));
    const views = [{ leaves: [0], solo: true }];
    let pending = null;
    for (let i = 1; i < leaves.length; i++) {
      if (leaves[i].wide) {
        if (pending !== null) { views.push({ leaves: [pending, -1] }); pending = null; }   // a blank page, so a spread opens flat
        views.push({ leaves: [i], wide: true });
      } else if (leaves[i].type === 'back') {
        if (pending !== null) { views.push({ leaves: [pending, -1] }); pending = null; }
        views.push({ leaves: [i], solo: true });   // the back page closes the book on its own, like a back cover
      } else if (pending === null) pending = i;
      else { views.push({ leaves: [pending, i] }); pending = null; }
    }
    if (pending !== null) views.push({ leaves: [pending, -1] });
    return views;
  }
  const viewOfLeaf = (views, leaf) => Math.max(0, views.findIndex(v => v.leaves.includes(leaf)));

  function label(view, leaves) {
    const shown = view.leaves.filter(i => i >= 0).map(i => leaves[i]);
    if (shown[0].type === 'cover') return 'Cover';
    const first = shown[0].no, last = shown[shown.length - 1].noEnd;
    return first === last ? String(first) : first + '-' + last;
  }

  DM.book = { leavesOf, viewsOf, viewOfLeaf, label };
})();
