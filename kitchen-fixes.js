/* Christmas HQ — Kitchen fixes + print lists (grocery & gifts)
   Loaded after countdown-reminders.js. Delegated handlers like tap-fixes.js.
   Flip nothing global; small targeted UI fixes only.
*/
(function () {
  'use strict';
  if (window.__kitchenFixes) return;
  window.__kitchenFixes = true;

  var FOREST = '#103b31';
  var GOLD = '#c9a227';
  var CREAM = '#fbf6ea';

  var css = document.createElement('style');
  css.id = 'hq-kitchen-fixes-css';
  css.textContent = [
    /* Keep list/recipe content clear of tree (BL) and back (BR) fabs */
    'html.hq-kitchen-pad #screen{padding-bottom:calc(72px + env(safe-area-inset-bottom))!important}',
    'html.hq-kitchen-pad .app{padding-bottom:calc(110px + env(safe-area-inset-bottom))!important}',
    /* Print action row */
    '.hq-print-row{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 12px}',
    '.hq-print-row .btn{flex:1;min-width:140px}',
    /* On-screen print preview (also used for @media print) */
    '#hqPrintRoot{display:none}',
    'html.hq-printing,#hqPrintRoot.hq-print-show{background:#fff!important}',
    'html.hq-printing body{background:#fff!important;overflow:auto!important}',
    'html.hq-printing body>*:not(#hqPrintRoot){display:none!important}',
    'html.hq-printing #hqPrintRoot,#hqPrintRoot.hq-print-show{display:block!important;position:relative;z-index:2147483000;min-height:100vh;background:#fff;color:#103b31;padding:28px 22px 48px;font-family:Georgia,"Times New Roman",serif}',
    '#hqPrintRoot .hq-print-chrome{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}',
    '#hqPrintRoot .hq-print-chrome button{font-family:system-ui,-apple-system,sans-serif}',
    
    '#hqPrintRoot .hq-print-holly{font-size:22px;letter-spacing:2px;color:#103b31}',
    '#hqPrintRoot .hq-print-brand{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#8a6d12;margin:6px 0 2px}',
    '#hqPrintRoot h1{font-size:26px;margin:0 0 4px;color:#103b31;border-bottom:3px solid #c9a227;padding-bottom:8px}',
    '#hqPrintRoot .hq-print-date{font-size:13px;color:#5a6b60;margin:0 0 18px;font-family:system-ui,-apple-system,sans-serif}',
    '#hqPrintRoot h2{font-size:15px;margin:18px 0 8px;color:#103b31;font-family:system-ui,-apple-system,sans-serif;text-transform:uppercase;letter-spacing:.06em;border-left:4px solid #c9a227;padding-left:10px}',
    '#hqPrintRoot ul{list-style:none;margin:0;padding:0}',
    '#hqPrintRoot li{display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid #eee6d4;font-size:14px;line-height:1.35;font-family:system-ui,-apple-system,sans-serif}',
    '#hqPrintRoot .hq-print-box{flex:none;width:16px;height:16px;margin-top:2px;border:2px solid #103b31;border-radius:3px;background:#fff}',
    '#hqPrintRoot .hq-print-box.done{background:#103b31;box-shadow:inset 0 0 0 2px #fff}',
    '#hqPrintRoot .hq-print-meta{display:block;font-size:12px;color:#6a776e;margin-top:2px}',
    '#hqPrintRoot .hq-print-empty{padding:24px 12px;text-align:center;color:#5a6b60;border:1px dashed #d9ccaa;border-radius:14px;background:#fbf6ea;font-family:system-ui,-apple-system,sans-serif}',
    '#hqPrintRoot .hq-print-foot{margin-top:22px;font-size:11px;color:#8a6d12;text-align:center;font-family:system-ui,-apple-system,sans-serif}',
    '@media print{',
    '  #hqPrintRoot .hq-print-chrome{display:none!important}',
    '  html.hq-printing body>*:not(#hqPrintRoot){display:none!important}',
    '  html.hq-printing #hqPrintRoot{display:block!important;position:static;padding:12mm;min-height:0;box-shadow:none}',
    '  #hqBackFab,#navToggle,.nav,#hqMusicDock,#hqPinLock{display:none!important}',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function money(n) {
    try {
      if (typeof currency === 'function') return currency(n);
      return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(n) || 0);
    } catch (e) {
      return '$' + (Number(n) || 0);
    }
  }

  function todayLabel() {
    try {
      return new Date().toLocaleDateString('en-AU', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        timeZone: 'Australia/Perth'
      });
    } catch (e) {
      return new Date().toLocaleDateString('en-AU');
    }
  }

  function guessAisle(name) {
    var n = String(name || '').toLowerCase();
    if (/milk|cream|butter|cheese|yoghurt|yogurt|egg/.test(n)) return 'Dairy & eggs';
    if (/chicken|turkey|beef|lamb|pork|ham|bacon|sausage|mince/.test(n)) return 'Meat & poultry';
    if (/prawn|salmon|fish|oyster|seafood|tuna/.test(n)) return 'Seafood';
    if (/apple|banana|berry|fruit|lemon|lime|orange|mango|watermelon|salad|lettuce|rocket|spinach|carrot|onion|garlic|potato|pumpkin|cabbage|cucumber|tomato|herb|mint|dill|parsley|sage|thyme|rosemary|celery|avocado/.test(n)) return 'Fruit & veg';
    if (/bread|bun|roll|wrap|bagel|pastry|flour|yeast/.test(n)) return 'Bakery & baking';
    if (/rice|pasta|noodle|oil|vinegar|sauce|stock|spice|salt|pepper|sugar|honey|jam|mustard|mayo|soy/.test(n)) return 'Pantry';
    if (/wine|beer|juice|soda|soft drink|water|tea|coffee|milk\.|ice /.test(n)) return 'Drinks';
    if (/ice cream|chocolate|biscuit|cookie|cake|pudding|dessert|cream /.test(n)) return 'Frozen & sweets';
    if (/napkin|foil|wrap|bag|paper|cleaner|detergent/.test(n)) return 'Household';
    return 'Other groceries';
  }

  function groupShopping(items) {
    var map = {};
    (items || []).forEach(function (x) {
      var key = guessAisle(x.name);
      if (!map[key]) map[key] = [];
      map[key].push(x);
    });
    var order = ['Fruit & veg', 'Meat & poultry', 'Seafood', 'Dairy & eggs', 'Bakery & baking', 'Pantry', 'Frozen & sweets', 'Drinks', 'Household', 'Other groceries'];
    var keys = order.filter(function (k) { return map[k] && map[k].length; });
    Object.keys(map).forEach(function (k) {
      if (keys.indexOf(k) < 0) keys.push(k);
    });
    return keys.map(function (k) { return { title: k, items: map[k] }; });
  }

  function groupGifts(gifts) {
    var map = {};
    (gifts || []).forEach(function (g) {
      var key = String(g.recipient || 'Someone special').trim() || 'Someone special';
      if (!map[key]) map[key] = [];
      map[key].push(g);
    });
    return Object.keys(map).sort(function (a, b) {
      return a.localeCompare(b, 'en', { sensitivity: 'base' });
    }).map(function (k) { return { title: k, items: map[k] }; });
  }

  function buildGroceryHtml() {
    var items = (typeof state !== 'undefined' && Array.isArray(state.shopping)) ? state.shopping : [];
    var body;
    if (!items.length) {
      body = '<div class="hq-print-empty"><div class="hq-print-holly" aria-hidden="true">🎄 ❄ 🎄</div><p><b>Your grocery list is empty</b></p><p>Add ingredients from a recipe or type a grocery item, then print again.</p></div>';
    } else {
      body = groupShopping(items).map(function (g) {
        return '<h2>' + esc(g.title) + '</h2><ul>' + g.items.map(function (x) {
          return '<li><span class="hq-print-box' + (x.bought ? ' done' : '') + '" aria-hidden="true"></span><span><b>' + esc(x.name) + '</b>' +
            (x.from ? '<span class="hq-print-meta">' + esc(x.from) + '</span>' : '') + '</span></li>';
        }).join('') + '</ul>';
      }).join('');
    }
    return wrapPrint('Christmas grocery list', body, items.length ? items.length + ' item' + (items.length === 1 ? '' : 's') : '');
  }

  function buildGiftHtml() {
    var gifts = (typeof state !== 'undefined' && Array.isArray(state.gifts)) ? state.gifts : [];
    var body;
    if (!gifts.length) {
      body = '<div class="hq-print-empty"><div class="hq-print-holly" aria-hidden="true">🎁 ❄ 🎁</div><p><b>Your gift list is empty</b></p><p>Add a present under My gifts, then print again.</p></div>';
    } else {
      body = groupGifts(gifts).map(function (g) {
        return '<h2>' + esc(g.title) + '</h2><ul>' + g.items.map(function (x) {
          return '<li><span class="hq-print-box' + (x.bought ? ' done' : '') + '" aria-hidden="true"></span><span><b>' + esc(x.name) + '</b>' +
            '<span class="hq-print-meta">' + esc(money(x.price)) + (x.bought ? ' · Bought ✓' : ' · Still shopping') + (x.wrapped ? ' · Wrapped 🎀' : '') + (x.delivered ? ' · Delivered 📦' : '') + '</span></span></li>';
        }).join('') + '</ul>';
      }).join('');
    }
    return wrapPrint('Christmas gift list', body, gifts.length ? gifts.length + ' gift' + (gifts.length === 1 ? '' : 's') : '');
  }

  function wrapPrint(title, body, countNote) {
    return (
      '<div class="hq-print-holly" aria-hidden="true">❄ 🎄 ❄</div>' +
      '<div class="hq-print-brand">Christmas HQ</div>' +
      '<h1>' + esc(title) + '</h1>' +
      '<p class="hq-print-date">' + esc(todayLabel()) + (countNote ? ' · ' + esc(countNote) : '') + '</p>' +
      body +
      '<p class="hq-print-foot">Christmas HQ · Perth · Happy printing</p>'
    );
  }

  function ensurePrintRoot() {
    var root = document.getElementById('hqPrintRoot');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'hqPrintRoot';
    root.setAttribute('role', 'document');
    document.body.appendChild(root);
    return root;
  }

  function closePrintView() {
    document.documentElement.classList.remove('hq-printing');
    var root = document.getElementById('hqPrintRoot');
    if (root) {
      root.classList.remove('hq-print-show');
      root.innerHTML = '';
    }
  }

  function openPrintView(kind) {
    var root = ensurePrintRoot();
    var inner = kind === 'gifts' ? buildGiftHtml() : buildGroceryHtml();
    root.innerHTML =
      '<div class="hq-print-chrome">' +
      '<button type="button" class="btn" data-hq-print-do>🖨️ Print / Save PDF</button>' +
      '<button type="button" class="btn alt" data-hq-print-close>Close</button>' +
      '</div>' + inner;
    root.classList.add('hq-print-show');
    document.documentElement.classList.add('hq-printing');
    window.scrollTo(0, 0);
    // Give layout a tick, then open the system print sheet (Save as PDF on phones).
    setTimeout(function () {
      try { window.print(); } catch (e) {}
    }, 120);
  }

  function injectPrintButtons() {
    try {
      if (typeof ui === 'undefined') return;
      var screen = document.getElementById('screen');
      if (!screen) return;

      if (ui.tab === 'kitchen' && ui.sub && ui.sub.kitchen === 'Groceries') {
        if (!screen.querySelector('[data-action="printGroceryList"]')) {
          var gLine = screen.querySelector('.section-line');
          var anchor = null;
          // Prefer just above the shopping list heading
          var headings = screen.querySelectorAll('.section-line h2, h3');
          for (var i = 0; i < headings.length; i++) {
            if (/shopping list/i.test(headings[i].textContent || '')) {
              anchor = headings[i].closest('.section-line') || headings[i];
              break;
            }
          }
          var row = document.createElement('div');
          row.className = 'hq-print-row';
          row.innerHTML = '<button type="button" class="btn alt" data-action="printGroceryList">🖨️ Print list</button><button type="button" class="btn alt" data-hq-share-list="grocery">📤 Share list</button>';
          if (anchor && anchor.parentNode) {
            if (anchor.classList && anchor.classList.contains('section-line')) {
              anchor.parentNode.insertBefore(row, anchor);
            } else {
              anchor.parentNode.insertBefore(row, anchor);
            }
          } else {
            var form = screen.querySelector('form[data-form="shopping"]');
            if (form && form.parentNode) form.parentNode.insertBefore(row, form.nextSibling);
            else screen.appendChild(row);
          }
        }
      }

      if (ui.tab === 'gifts' && ui.sub && ui.sub.gifts === 'My gifts') {
        if (!screen.querySelector('[data-action="printGiftList"]')) {
          var row2 = document.createElement('div');
          row2.className = 'hq-print-row';
          row2.innerHTML = '<button type="button" class="btn alt" data-action="printGiftList">🖨️ Print list</button><button type="button" class="btn alt" data-hq-share-list="gifts">📤 Share list</button>';
          var giftHead = null;
          var hs = screen.querySelectorAll('.section-line h2, h3');
          for (var j = 0; j < hs.length; j++) {
            if (/gift list|your gift/i.test(hs[j].textContent || '')) {
              giftHead = hs[j].closest('.section-line') || hs[j];
              break;
            }
          }
          if (giftHead && giftHead.parentNode) {
            giftHead.parentNode.insertBefore(row2, giftHead);
          } else {
            var list = screen.querySelector('.list');
            if (list && list.parentNode) list.parentNode.insertBefore(row2, list);
            else screen.appendChild(row2);
          }
        }
      }
    } catch (e) {}
  }

  function syncKitchenPad() {
    try {
      var on =
        typeof ui !== 'undefined' &&
        (ui.tab === 'kitchen' || ui.tab === 'gifts' || ui.tab === 'games');
      document.documentElement.classList.toggle('hq-kitchen-pad', !!on);
    } catch (e) {}
  }

  /* Recipe detail: ensure photo upgrade ran (kitchen-v5 observer can miss a race). */
  function ensureRecipePhoto() {
    try {
      if (typeof ui === 'undefined' || ui.tab !== 'kitchen' || !ui.recipe) return;
      if (typeof RECIPES === 'undefined' || typeof hqRecipeImagePath !== 'function') return;
      var back = document.querySelector('[data-action="recipeBack"]');
      if (!back) return;
      var card = back.nextElementSibling;
      if (!card || card.querySelector('.hq-v6-detail-photo')) return;
      var r = RECIPES.find(function (x) { return x.id === ui.recipe; });
      if (!r) return;
      var first = card.firstElementChild;
      if (!first) return;
      var photo = document.createElement('div');
      photo.className = 'hq-v6-detail-photo';
      var src = hqRecipeImagePath(r);
      photo.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(r.name) + '" onerror="hqRecipeImageMissing && hqRecipeImageMissing(this)">';
      first.replaceWith(photo);
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var printBtn = e.target.closest('[data-action="printGroceryList"], [data-action="printGiftList"]');
    if (printBtn) {
      e.preventDefault();
      e.stopPropagation();
      openPrintView(printBtn.getAttribute('data-action') === 'printGiftList' ? 'gifts' : 'grocery');
      return;
    }
    var doPrint = e.target.closest('[data-hq-print-do]');
    if (doPrint) {
      e.preventDefault();
      try { window.print(); } catch (err) {}
      return;
    }
    var close = e.target.closest('[data-hq-print-close]');
    if (close) {
      e.preventDefault();
      closePrintView();
    }
  }, true);

  window.addEventListener('afterprint', closePrintView);

  /* ---- Share list (plain text): navigator.share, else WhatsApp link + Copy ---- */
  function listText(kind) {
    var out = [];
    if (kind === 'gifts') {
      var gifts = (typeof state !== 'undefined' && Array.isArray(state.gifts)) ? state.gifts : [];
      out.push('🎁 My Christmas gift list', '');
      if (!gifts.length) out.push('(no gifts added yet)');
      groupGifts(gifts).forEach(function (g) {
        out.push(g.title);
        g.items.forEach(function (x) {
          var price = Number(x.price) > 0 ? ' – ' + money(x.price) : '';
          var flags = [x.bought ? 'bought' : '', x.wrapped ? 'wrapped 🎀' : '', x.delivered ? 'delivered 📦' : ''].filter(Boolean).join(', ');
          out.push((x.bought ? '☑ ' : '☐ ') + x.name + price + (flags ? ' (' + flags + ')' : ''));
        });
        out.push('');
      });
      var total = gifts.reduce(function (n, x) { return n + (Number(x.price) || 0); }, 0);
      if (total > 0) out.push('Total: ' + money(total));
    } else {
      var items = (typeof state !== 'undefined' && Array.isArray(state.shopping)) ? state.shopping : [];
      out.push('🛒 Christmas grocery list', '');
      if (!items.length) out.push('(no items yet)');
      groupShopping(items).forEach(function (g) {
        out.push(g.title);
        g.items.forEach(function (x) { out.push((x.bought ? '☑ ' : '☐ ') + x.name); });
        out.push('');
      });
    }
    out.push('— Christmas HQ');
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function closeShareSheet() {
    var el = document.getElementById('hqShareSheet');
    if (el) el.remove();
  }

  function openShareSheet(title, text) {
    closeShareSheet();
    var box = document.createElement('div');
    box.id = 'hqShareSheet';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
      '<div class="hq-share-card"><h3>' + esc(title) + '</h3>' +
      '<textarea readonly rows="8" aria-label="List text">' + esc(text) + '</textarea>' +
      '<div class="hq-share-actions">' +
      '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(text) + '">💬 WhatsApp</a>' +
      '<button type="button" class="btn alt" data-hq-share-copy>📋 Copy</button>' +
      '<button type="button" class="btn alt" data-hq-share-close>Close</button></div>' +
      '<p class="hq-share-msg" role="status"></p></div>';
    document.body.appendChild(box);
  }

  function shareList(kind) {
    var text = listText(kind);
    var title = kind === 'gifts' ? 'Christmas gift list' : 'Christmas grocery list';
    if (navigator.share) {
      navigator.share({ title: title, text: text }).catch(function (err) {
        if (err && err.name === 'AbortError') return;
        openShareSheet(title, text);
      });
    } else {
      openShareSheet(title, text);
    }
  }

  function copyText(text, done) {
    var fallback = function () {
      try {
        var ta = document.querySelector('#hqShareSheet textarea');
        ta.focus(); ta.select();
        done(document.execCommand('copy'));
      } catch (e) { done(false); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  document.addEventListener('click', function (e) {
    try {
      var t = e.target;
      if (!t || !t.closest) return;
      var sh = t.closest('[data-hq-share-list]');
      if (sh) { e.preventDefault(); e.stopPropagation(); shareList(sh.getAttribute('data-hq-share-list')); return; }
      if (t.closest('[data-hq-share-close]') || t.id === 'hqShareSheet') { e.preventDefault(); closeShareSheet(); return; }
      if (t.closest('[data-hq-share-copy]')) {
        e.preventDefault();
        var ta = document.querySelector('#hqShareSheet textarea');
        copyText(ta ? ta.value : '', function (ok) {
          var m = document.querySelector('#hqShareSheet .hq-share-msg');
          if (m) m.textContent = ok ? 'Copied ✓ — paste it into any message.' : 'Could not copy. Press and hold the text to copy it.';
        });
      }
    } catch (err) {}
  }, true);

  (function () {
    var st = document.createElement('style');
    st.textContent =
      '#hqShareSheet{position:fixed;inset:0;z-index:2147482000;background:#103b3199;display:flex;align-items:flex-end;justify-content:center;padding:12px}' +
      '#hqShareSheet .hq-share-card{width:100%;max-width:440px;background:#fff8e5;border:2px solid #c4984d;border-radius:20px;padding:16px;color:#103b31;max-height:90vh;overflow:auto}' +
      '#hqShareSheet h3{margin:0 0 8px}' +
      '#hqShareSheet textarea{width:100%;box-sizing:border-box;border:2px solid #d6a638;border-radius:12px;padding:10px;font:13px/1.45 system-ui,sans-serif;background:#fffdf9;color:#103b31;resize:none}' +
      '#hqShareSheet .hq-share-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}' +
      '#hqShareSheet .hq-share-actions .btn{flex:1;min-width:100px;text-align:center;text-decoration:none}' +
      '#hqShareSheet .hq-share-msg{margin:8px 0 0;font-size:12px;font-weight:800;color:#2c7554;min-height:16px}';
    document.head.appendChild(st);
  })();


  /* Add Snacks filter (recipes use type Snacks but the chip row omitted it). */
  function ensureCategoryChips() {
    try {
      if (typeof ui === 'undefined' || ui.tab !== 'kitchen' || ui.sub?.kitchen !== 'Recipes' || ui.recipe) return;
      var cats = document.querySelectorAll('#screen [data-action="recipeCategory"]');
      if (!cats.length) return;
      var parent = cats[0].parentNode;
      if (!parent) return;
      var hasSnacks = false;
      for (var i = 0; i < cats.length; i++) {
        if ((cats[i].dataset.value || cats[i].textContent.trim()) === 'Snacks') { hasSnacks = true; break; }
      }
      if (!hasSnacks) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = cats[0].className.replace(/\bselected\b/g, '').trim();
        btn.setAttribute('data-action', 'recipeCategory');
        btn.setAttribute('data-value', 'Snacks');
        btn.setAttribute('aria-pressed', ui.category === 'Snacks' ? 'true' : 'false');
        if (ui.category === 'Snacks') btn.classList.add('selected');
        btn.textContent = 'Snacks';
        parent.appendChild(btn);
      }
    } catch (e) {}
  }

  function tick() {
    syncKitchenPad();
    injectPrintButtons();
    ensureRecipePhoto();
    ensureCategoryChips();
  }

  var screen = document.getElementById('screen') || document.body;
  new MutationObserver(function () { tick(); }).observe(screen, { childList: true, subtree: true });
  tick();
  setTimeout(tick, 400);
})();
