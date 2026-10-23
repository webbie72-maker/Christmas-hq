/* Christmas HQ — small polish pass: gift idea blurbs + a few shared styles.
   Everything is guarded; if anything here fails the app carries on as before. */
(function () {
  'use strict';
  if (window.__hqPolish) return;
  window.__hqPolish = true;

  var BLURB = {
    'personal': 'A personal touch',
    'under $50': 'Under $50 · easy on the budget',
    'kids': 'One for the kids',
    'experience': 'Memories over things',
    'foodie': 'For the food lover',
    'tech': 'For the gadget fan',
    'fitness': 'To keep them moving',
    'home': 'For around the house',
    'practical': 'Useful every day',
    'outdoors': 'For outdoor adventures'
  };

  function fixIdeaLines(html) {
    // Generic filler like "A photo book — a personal gift." / "A insulated cup — a under $50 gift."
    return String(html).replace(/<small>[^<]*? — an? ([^<]*?) gift\.<\/small>/g, function (all, cat) {
      var key = String(cat).trim().toLowerCase();
      var text = BLURB[key];
      if (!text) text = key ? key.charAt(0).toUpperCase() + key.slice(1) + ' idea' : 'Gift idea';
      return '<small>' + text + '</small>';
    });
  }

  try {
    if (typeof giftResults === 'function') {
      var baseResults = giftResults;
      giftResults = function () {
        var html = baseResults.apply(this, arguments);
        try { return fixIdeaLines(html); } catch (err) { return html; }
      };
    }
  } catch (err) {}

  try {
    var css = document.createElement('style');
    css.id = 'hqPolishStyle';
    css.textContent =
      '#screen .hq-open-link{display:block;margin:3px 0 0;padding:2px 0;border:0;background:none;color:#2c7554;font:900 12px system-ui,sans-serif;text-decoration:underline;cursor:pointer;text-align:left}' +
      '#screen .hq-list-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:16px 0 6px}' +
      '#screen .hq-quiet-btn{border:1px solid #d9ccaa;background:transparent;color:#735f3a;border-radius:12px;font:800 12px system-ui,sans-serif;padding:8px 12px;cursor:pointer}' +
      '#screen .hq-quiet-btn.danger{color:#972639;border-color:#e3b4b9}' +
      '#screen .hq-show-all{margin-top:12px}' +
      '#screen .advent button.future{opacity:.45}';
    document.head.appendChild(css);
  } catch (err) {}
})();
