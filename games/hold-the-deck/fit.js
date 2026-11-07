// Hold the Deck: two page sizes the kit's shared styles don't suit this game, set for this game's page only, so no other game moves. NOTES.md "Kit notes" says these could move into the kit.
(function () {
  const css = `
    /* A big screen draws the deck 1.4 times larger, so the talk box in play (sayAt: 'top') grows with it, the way the kit grows its corner box. It stays above the deck. */
    @media (min-width: 1000px) and (min-height: 640px) {
      .kit-say { max-width: min(60%, 620px); gap: 10px; padding: 4px 12px 4px 4px; }
      .kit-say .kit-portrait { width: 60px; height: 60px; }
      .kit-say b { font-size: 18px; }
      .kit-say span { font-size: 19px; }
    }
    /* At 320 px wide the upgrade level pips wrap on two rows out of three. On their own line, all three match. */
    @media (max-width: 340px) {
      .kit-up .kit-pips { display: flex; margin: 4px 0 0; }
    }`;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();
