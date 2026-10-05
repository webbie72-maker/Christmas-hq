/* Gift ideas: tap a card to open a detail sheet with "Find it online" links. */
(function () {
  'use strict';
  if (window.__giftDetailSheet) return;
  window.__giftDetailSheet = true;

  var css = document.createElement('style');
  css.textContent = [
    '#giftResults .catalog-card{cursor:pointer;position:relative;-webkit-tap-highlight-color:rgba(16,59,49,.12)}',
    '#giftResults .catalog-card:focus-visible{outline:3px solid #c9a227;outline-offset:2px}',
    '#giftResults .catalog-card .gd-chev{color:#103b31;opacity:.55;font-size:22px;font-weight:700;margin-left:4px;line-height:1;align-self:center}',
    '.gd-backdrop{position:fixed;inset:0;z-index:9000;background:rgba(10,30,24,.55);display:flex;align-items:flex-end;justify-content:center;animation:gdFade .18s ease}',
    '.gd-sheet{background:#fbf6ea;color:#103b31;width:100%;max-width:520px;max-height:88vh;overflow:auto;border-radius:24px 24px 0 0;padding:22px 20px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);border-top:4px solid #c9a227;animation:gdUp .22s ease;font-family:inherit}',
    '@media(min-width:700px){.gd-backdrop{align-items:center}.gd-sheet{border-radius:24px}}',
    '.gd-head{display:flex;gap:14px;align-items:center}',
    '.gd-em{font-size:42px;width:68px;height:68px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:18px;box-shadow:0 2px 8px rgba(16,59,49,.12);flex:none}',
    '.gd-sheet h2{margin:0;font-size:22px;color:#103b31}',
    '.gd-pill{display:inline-block;margin-top:6px;background:#103b31;color:#f4e3b0;border-radius:999px;padding:3px 11px;font-size:12px;font-weight:700}',
    '.gd-close{margin-left:auto;align-self:flex-start;border:0;background:#efe6d0;color:#103b31;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer;flex:none}',
    '.gd-desc{margin:16px 0;line-height:1.5;font-size:15px}',
    '.gd-add{width:100%;border:0;border-radius:14px;padding:13px;background:#103b31;color:#fff;font-weight:800;font-size:16px;cursor:pointer}',
    '.gd-sheet h3{margin:20px 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:#8a6d12}',
    '.gd-links{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.gd-links a{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e6dcc3;border-radius:14px;padding:11px 12px;color:#103b31;text-decoration:none;font-weight:700;font-size:14px}',
    '.gd-note{font-size:12px;opacity:.7;margin-top:10px}',
    '@keyframes gdFade{from{opacity:0}}@keyframes gdUp{from{transform:translateY(40px);opacity:0}}'
  ].join('\n');
  document.head.appendChild(css);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var STORES = [
    ['Google Shopping', 'https://www.google.com/search?tbm=shop&q='],
    ['Kmart AU', 'https://www.kmart.com.au/search/?searchTerm='],
    ['Big W', 'https://www.bigw.com.au/search?text='],
    ['Amazon AU', 'https://www.amazon.com.au/s?k='],
    ['Target AU', 'https://www.target.com.au/search?text=']
  ];

  function enhance() {
    var cards = document.querySelectorAll('#giftResults .catalog-card:not([data-gd])');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var name = c.querySelector('.body b');
      c.setAttribute('data-gd', '1');
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-haspopup', 'dialog');
      c.setAttribute('aria-label', 'View details for ' + (name ? name.textContent : 'gift idea'));
      var chev = document.createElement('span');
      chev.className = 'gd-chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.textContent = '›';
      c.appendChild(chev);
    }
  }

  var openEl = null, lastFocus = null;

  function close() {
    if (!openEl) return;
    openEl.remove();
    openEl = null;
    document.removeEventListener('keydown', onKey, true);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
  }

  function open(card) {
    close();
    var g = {
      em: (card.querySelector('.em') || {}).textContent || '🎁',
      name: (card.querySelector('.body b') || {}).textContent || '',
      desc: (card.querySelector('.body small') || {}).textContent || '',
      tag: (card.querySelector('.body .pill') || {}).textContent || ''
    };
    var q = encodeURIComponent(g.name);
    var links = STORES.map(function (s) {
      return '<a href="' + s[1] + q + '" target="_blank" rel="noopener noreferrer">' + esc(s[0]) + '<span aria-hidden="true">↗</span></a>';
    }).join('');
    lastFocus = card;
    var bd = document.createElement('div');
    bd.className = 'gd-backdrop';
    bd.innerHTML =
      '<div class="gd-sheet" role="dialog" aria-modal="true" aria-labelledby="gdTitle">' +
        '<div class="gd-head"><span class="gd-em" aria-hidden="true">' + esc(g.em) + '</span>' +
        '<div><h2 id="gdTitle">' + esc(g.name) + '</h2>' + (g.tag ? '<span class="gd-pill">' + esc(g.tag) + '</span>' : '') + '</div>' +
        '<button type="button" class="gd-close" aria-label="Close">×</button></div>' +
        '<p class="gd-desc">' + esc(g.desc) + '</p>' +
        '<button type="button" class="gd-add" data-action="idea" data-name="' + esc(g.name) + '">+ Add to my list</button>' +
        '<h3>Find it online</h3><div class="gd-links">' + links + '</div>' +
        '<p class="gd-note">Opens a store search in a new tab. Prices and stock vary by store.</p>' +
      '</div>';
    bd.addEventListener('click', function (e) {
      if (e.target === bd || e.target.closest('.gd-close')) { close(); return; }
      if (e.target.closest('.gd-add')) {
        // Let the app's document click handler run the 'idea' action, then remove the sheet.
        lastFocus = null;
        setTimeout(close, 0);
      }
    });
    document.body.appendChild(bd);
    openEl = bd;
    document.addEventListener('keydown', onKey, true);
    bd.querySelector('.gd-close').focus();
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('#giftResults .catalog-card');
    if (!card || e.target.closest('button, a, input')) return;
    open(card);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest && e.target.closest('#giftResults .catalog-card');
    if (!card || e.target !== card) return;
    e.preventDefault();
    open(card);
  });

  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
  enhance();
})();
