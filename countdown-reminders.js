/* Christmas HQ — friendly in-app countdown reminders (no push). */
(function () {
  'use strict';
  if (window.__countdownReminders) return;
  window.__countdownReminders = true;

  var STORE_KEY = 'christmas-hq-reminders-v1';
  var CARD_ID = 'hqReminderCard';
  var SHEET_ID = 'hqReminderSheet';

  /* atDays = become due when days-until-Christmas <= this value (local time). */
  var TIMELINE = [
    {
      id: 'gift-budget',
      atDays: 70,
      icon: '🎁',
      title: 'Start your gift list & budget',
      body: 'Christmas is about 10 weeks away — jot who you’re buying for and set a spending limit.',
      actionLabel: 'Open gifts & budget',
      tab: 'gifts',
      sub: 'My gifts',
      skip: function (st) {
        if (!st) return false;
        var hasGifts = Array.isArray(st.gifts) && st.gifts.length > 0;
        var budgetDone = taskDone(st, /overall christmas budget|set your overall/i);
        return hasGifts || budgetDone;
      }
    },
    {
      id: 'venue-decor',
      atDays: 56,
      icon: '🏡',
      title: 'Lock in Christmas Day plans',
      body: 'About 8 weeks out — book your venue or host, confirm guests, and check the decorations box.',
      actionLabel: 'Open guests & checklist',
      tab: 'plan',
      sub: 'Guests',
      skip: function (st) {
        if (!st) return false;
        var guestsOk = Array.isArray(st.guests) && st.guests.length > 0;
        var decorDone = taskDone(st, /decorations|host|location|venue/i);
        return guestsOk && decorDone;
      }
    },
    {
      id: 'secret-santa',
      atDays: 42,
      icon: '🎲',
      title: 'Time for Secret Santa',
      body: 'Six weeks to go — add the family and draw names so everyone can start shopping.',
      actionLabel: 'Open Secret Santa',
      tab: 'gifts',
      sub: 'Secret Santa',
      skip: function (st) {
        return !!(st && st.santa && Array.isArray(st.santa.assignments) && st.santa.assignments.length > 0);
      }
    },
    {
      id: 'order-gifts',
      atDays: 35,
      icon: '📦',
      title: 'Order online gifts soon',
      body: 'Five weeks left — Aussie shipping can slow down. Get online orders in while there’s time.',
      actionLabel: 'Review my gifts',
      tab: 'gifts',
      sub: 'My gifts',
      skip: function (st) {
        if (!st || !Array.isArray(st.gifts) || !st.gifts.length) return false;
        return st.gifts.every(function (g) { return g.bought; });
      }
    },
    {
      id: 'tree-lights',
      atDays: 28,
      icon: '🎄',
      title: 'Tree up & lights trail',
      body: 'Four weeks — first Sunday of Advent vibes. Put up the tree and plan a summer lights drive.',
      actionLabel: 'Open checklist',
      tab: 'plan',
      sub: 'Checklist',
      skip: function (st) {
        return taskDone(st, /put up the christmas tree|christmas lights trail/i);
      }
    },
    {
      id: 'order-food',
      atDays: 21,
      icon: '🍖',
      title: 'Order the feast',
      body: 'Three weeks out — lock in the ham, seafood or turkey and sketch the Christmas menu.',
      actionLabel: 'Open kitchen',
      tab: 'kitchen',
      sub: 'Recipes',
      skip: function (st) {
        return !!(st && Array.isArray(st.menu) && st.menu.length > 0) ||
          taskDone(st, /christmas menu|food list|ham|turkey|seafood/i);
      }
    },
    {
      id: 'postage-wrap',
      atDays: 14,
      icon: '✉️',
      title: 'Postage & wrapping',
      body: 'Two weeks left — check Australia Post’s Christmas postage dates, then wrap what’s ready.',
      actionLabel: 'Open gift list',
      tab: 'gifts',
      sub: 'My gifts',
      skip: function (st) {
        return taskDone(st, /post gifts|wrap the presents|wrapping/i);
      }
    },
    {
      id: 'week-out',
      atDays: 7,
      icon: '☀️',
      title: 'One week — summer ready',
      body: 'Shopping list, cold drinks & ice, sunscreen, and backyard cricket gear. Hot Christmas vibes!',
      actionLabel: 'Open groceries',
      tab: 'kitchen',
      sub: 'Groceries',
      skip: function (st) {
        return taskDone(st, /grocery|drinks|fresh-food|shopping/i) ||
          !!(st && Array.isArray(st.shopping) && st.shopping.length > 0);
      }
    },
    {
      id: 'two-days',
      atDays: 2,
      icon: '🍮',
      title: 'Almost there',
      body: 'Two days to go — prep desserts tonight and defrost the turkey if that’s your centrepiece.',
      actionLabel: 'Open kitchen',
      tab: 'kitchen',
      sub: 'My menu',
      skip: function (st) {
        return taskDone(st, /desserts|defrost|cold food/i);
      }
    },
    {
      id: 'eve',
      atDays: 1,
      icon: '🥕',
      title: 'Merry Christmas Eve',
      body: 'Carols on, carrots out for the reindeer, and soak up the magic.',
      actionLabel: 'Open Magic',
      tab: 'magic',
      sub: 'Advent',
      skip: null
    },
    {
      id: 'day',
      atDays: 0,
      icon: '🎅',
      title: 'Merry Christmas!',
      body: 'Wishing you a warm, sunny, joyful Christmas Day. You’ve got this.',
      actionLabel: 'Celebrate at home',
      tab: 'home',
      sub: null,
      skip: null
    },
    {
      id: 'boxing',
      atDays: -1,
      icon: '💝',
      title: 'Happy Boxing Day',
      body: 'Send a few thank-yous, enjoy the leftovers, and put your feet up.',
      actionLabel: 'Open family hub',
      tab: 'plan',
      sub: 'Family',
      skip: null
    }
  ];

  var css = document.createElement('style');
  css.id = 'hqReminderStyle';
  css.textContent = [
    '#' + CARD_ID + '{margin:12px 0 4px;position:relative;background:linear-gradient(145deg,#fffdf6 0%,#f7f0de 55%,#eaf3e8 100%);border:1px solid #e4d7b4;border-radius:20px;padding:16px 16px 14px;box-shadow:0 8px 28px #2547330b;overflow:hidden}',
    '#' + CARD_ID + '::before{content:"✦";position:absolute;right:10px;top:6px;font-size:28px;color:#c4984d;opacity:.55;pointer-events:none}',
    '#' + CARD_ID + ' .cr-kicker{font-size:10px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase;color:#9d742e;margin:0 0 6px}',
    '#' + CARD_ID + ' .cr-row{display:flex;gap:12px;align-items:flex-start}',
    '#' + CARD_ID + ' .cr-icon{width:44px;height:44px;min-width:44px;border-radius:14px;background:#103b31;color:#f4e3b0;display:grid;place-items:center;font-size:22px;box-shadow:0 4px 0 #0b2a22}',
    '#' + CARD_ID + ' .cr-copy{flex:1;min-width:0}',
    '#' + CARD_ID + ' .cr-copy h3{margin:0 0 4px;font:700 16px Georgia,serif;color:#103b31}',
    '#' + CARD_ID + ' .cr-copy p{margin:0;font-size:12px;color:#5f6b61;line-height:1.45}',
    '#' + CARD_ID + ' .cr-meta{margin-top:6px;font-size:10px;font-weight:800;color:#8c6b33}',
    '#' + CARD_ID + ' .cr-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '#' + CARD_ID + ' .cr-actions .btn{flex:1;min-width:90px}',
    '#' + CARD_ID + ' .cr-all{display:inline-block;margin-top:10px;font-size:11px;font-weight:800;color:#103b31;text-decoration:underline;text-underline-offset:2px;background:none;border:0;padding:0;cursor:pointer}',
    '#' + CARD_ID + '.cr-enter{animation:crPop .28s ease}',
    '@keyframes crPop{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '#' + SHEET_ID + '{position:fixed;inset:0;z-index:9100;background:rgba(10,30,24,.55);display:flex;align-items:flex-end;justify-content:center;animation:crFade .18s ease}',
    '#' + SHEET_ID + ' .cr-sheet{background:#fbf6ea;color:#103b31;width:100%;max-width:520px;max-height:88vh;overflow:auto;border-radius:24px 24px 0 0;padding:20px 18px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);border-top:4px solid #c9a227;animation:crUp .22s ease}',
    '@media(min-width:700px){#' + SHEET_ID + '{align-items:center}#' + SHEET_ID + ' .cr-sheet{border-radius:24px}}',
    '#' + SHEET_ID + ' .cr-sheet-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}',
    '#' + SHEET_ID + ' .cr-sheet-head h2{margin:0;font:700 22px Georgia,serif;color:#103b31}',
    '#' + SHEET_ID + ' .cr-sheet-head p{margin:4px 0 0;font-size:12px;color:#6c776e}',
    '#' + SHEET_ID + ' .cr-close{margin-left:auto;border:0;background:#efe6d0;color:#103b31;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer;flex:none}',
    '#' + SHEET_ID + ' .cr-item{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:16px;background:#fff;border:1px solid #e6dcc3;margin-bottom:8px}',
    '#' + SHEET_ID + ' .cr-item.is-done{opacity:.72;background:#f4f8f1}',
    '#' + SHEET_ID + ' .cr-item.is-done .cr-item-title{text-decoration:line-through;color:#6c776e}',
    '#' + SHEET_ID + ' .cr-tick{width:28px;height:28px;min-width:28px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:900;background:#eaf3e7;color:#2a6148;border:1px solid #cfe0c8}',
    '#' + SHEET_ID + ' .cr-item.is-done .cr-tick{background:#103b31;color:#f4e3b0;border-color:#103b31}',
    '#' + SHEET_ID + ' .cr-item-title{display:block;font-size:13px;font-weight:800;color:#103b31;margin-bottom:2px}',
    '#' + SHEET_ID + ' .cr-item-body{display:block;font-size:11px;color:#6c776e;line-height:1.4}',
    '#' + SHEET_ID + ' .cr-item-date{display:block;margin-top:4px;font-size:10px;font-weight:800;color:#8c6b33}',
    '@keyframes crFade{from{opacity:0}}@keyframes crUp{from{transform:translateY(40px);opacity:0}}',
    '@media(prefers-reduced-motion:reduce){#' + CARD_ID + '.cr-enter,#' + SHEET_ID + ',#' + SHEET_ID + ' .cr-sheet{animation:none!important}}'
  ].join('\n');
  document.head.appendChild(css);

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function todayLocal() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function christmasYear() {
    var d = todayLocal();
    /* Keep “this Christmas” through Boxing Day; roll after 26 Dec (matches festive season). */
    if (d.getMonth() === 11 && d.getDate() > 26) return d.getFullYear() + 1;
    return d.getFullYear();
  }

  function christmasDate() {
    return new Date(christmasYear(), 11, 25);
  }

  function daysUntilChristmas() {
    var t = todayLocal();
    var y = t.getFullYear();
    /* Prefer this year’s Christmas through Boxing Day (-1), even though app YEAR rolls after 25 Dec. */
    if (t.getMonth() === 11 && t.getDate() === 26) return -1;
    if (t.getMonth() === 11 && t.getDate() === 25) return 0;
    var c = new Date(christmasYear(), 11, 25, 0, 0, 0).getTime();
    return Math.max(0, Math.floor((c - Date.now()) / 86400000));
  }

  function dateForDaysUntil(days) {
    var c = christmasDate();
    var d = new Date(c.getFullYear(), c.getMonth(), c.getDate() - days);
    return d;
  }

  function formatAuDate(d) {
    try {
      return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return d.toDateString();
    }
  }

  function ymd(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function tomorrowYmd() {
    var t = todayLocal();
    t.setDate(t.getDate() + 1);
    return ymd(t);
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { done: {}, snooze: {} };
      var v = JSON.parse(raw);
      return {
        done: (v && v.done && typeof v.done === 'object') ? v.done : {},
        snooze: (v && v.snooze && typeof v.snooze === 'object') ? v.snooze : {}
      };
    } catch (e) {
      return { done: {}, snooze: {} };
    }
  }

  function saveStore(store) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) {}
  }

  function appState() {
    try {
      if (typeof state !== 'undefined' && state) return state;
    } catch (e) {}
    try {
      var raw = localStorage.getItem('christmas-hq-rebuilt-v1');
      if (raw) return JSON.parse(raw);
    } catch (e2) {}
    return null;
  }

  function taskDone(st, re) {
    if (!st || !Array.isArray(st.tasks)) return false;
    for (var i = 0; i < st.tasks.length; i++) {
      var t = st.tasks[i];
      if (t && t.done && re.test(String(t.text || ''))) return true;
    }
    return false;
  }

  function isSnoozed(store, id) {
    var until = store.snooze[id];
    if (!until) return false;
    return ymd(todayLocal()) < String(until);
  }

  function isDone(store, id) {
    return !!store.done[id];
  }

  function isSkipped(item, st) {
    if (!item.skip) return false;
    try {
      return !!item.skip(st);
    } catch (e) {
      return false;
    }
  }

  function isDue(item, daysLeft) {
    if (item.atDays < 0) {
      /* Boxing Day: show when daysLeft is -1 (26 Dec) */
      return daysLeft === -1;
    }
    if (item.atDays === 0) return daysLeft === 0;
    if (item.atDays === 1) return daysLeft === 1;
    /* Phase reminders: due once daysLeft crosses the threshold, until a tighter one takes over */
    return daysLeft <= item.atDays;
  }

  function pickCurrent(daysLeft, store, st) {
    var due = [];
    var i;
    for (i = 0; i < TIMELINE.length; i++) {
      var item = TIMELINE[i];
      if (!isDue(item, daysLeft)) continue;
      if (isDone(store, item.id)) continue;
      if (isSnoozed(store, item.id)) continue;
      if (isSkipped(item, st)) continue;
      due.push(item);
    }
    if (due.length) {
      /* Most recently activated = smallest atDays among due */
      due.sort(function (a, b) { return a.atDays - b.atDays; });
      return { item: due[0], kind: 'due' };
    }

    /* Soft preview: only the single nearest upcoming threshold (not a cascade). */
    var nearest = null;
    for (i = 0; i < TIMELINE.length; i++) {
      var u = TIMELINE[i];
      if (u.atDays < 0) continue;
      if (daysLeft <= u.atDays) continue;
      if (isSkipped(u, st)) continue;
      if (!nearest || u.atDays > nearest.atDays) nearest = u;
    }
    if (nearest && !isDone(store, nearest.id) && !isSnoozed(store, nearest.id)) {
      return { item: nearest, kind: 'upcoming' };
    }
    return null;
  }

  function screenRoot() {
    return document.getElementById('screen');
  }

  function onHome() {
    try {
      return typeof ui !== 'undefined' && ui && ui.tab === 'home';
    } catch (e) {
      return false;
    }
  }

  function removeCard() {
    var el = document.getElementById(CARD_ID);
    if (el) el.remove();
  }

  function buildCardHtml(picked, daysLeft) {
    var item = picked.item;
    var when = dateForDaysUntil(item.atDays);
    var kicker = picked.kind === 'upcoming' ? 'Coming up' : 'Gentle nudge';
    var meta = picked.kind === 'upcoming'
      ? ('Around ' + formatAuDate(when) + ' · ' + daysLeft + ' days to Christmas')
      : (daysLeft <= 0
        ? (daysLeft === 0 ? 'It’s Christmas Day!' : 'Boxing Day')
        : (daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + ' to Christmas'));

    return '' +
      '<div class="cr-kicker">' + esc(kicker) + ' · Christmas HQ</div>' +
      '<div class="cr-row">' +
        '<div class="cr-icon" aria-hidden="true">' + esc(item.icon) + '</div>' +
        '<div class="cr-copy">' +
          '<h3>' + esc(item.title) + '</h3>' +
          '<p>' + esc(item.body) + '</p>' +
          '<div class="cr-meta">' + esc(meta) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-actions">' +
        '<button type="button" class="btn small" data-cr="action">' + esc(item.actionLabel) + '</button>' +
        '<button type="button" class="btn small tint" data-cr="done">Done</button>' +
        '<button type="button" class="btn small alt" data-cr="later">Later</button>' +
      '</div>' +
      '<button type="button" class="cr-all" data-cr="all">See all reminders</button>';
  }

  function ensureCard() {
    if (!onHome()) {
      removeCard();
      return;
    }
    var root = screenRoot();
    if (!root) return;

    var daysLeft = daysUntilChristmas();
    var store = loadStore();
    var st = appState();
    var picked = pickCurrent(daysLeft, store, st);

    if (!picked) {
      removeCard();
      return;
    }

    var card = document.getElementById(CARD_ID);
    var html = buildCardHtml(picked, daysLeft);
    var fresh = false;
    if (!card) {
      card = document.createElement('div');
      card.id = CARD_ID;
      card.setAttribute('role', 'region');
      card.setAttribute('aria-label', 'Christmas reminder');
      fresh = true;
    }
    card.dataset.crId = picked.item.id;
    card.dataset.crKind = picked.kind;
    card.innerHTML = html;

    /* Place below countdown/music: after hidden hero if present, else at top of #screen */
    var hero = root.querySelector(':scope > .hero');
    var summary = root.querySelector(':scope > .summary');
    if (!card.parentElement) {
      if (hero && hero.parentElement === root) {
        hero.insertAdjacentElement('afterend', card);
      } else if (summary && summary.parentElement === root) {
        summary.insertAdjacentElement('beforebegin', card);
      } else {
        root.insertAdjacentElement('afterbegin', card);
      }
    } else if (card.parentElement !== root) {
      if (hero && hero.parentElement === root) {
        hero.insertAdjacentElement('afterend', card);
      } else {
        root.insertAdjacentElement('afterbegin', card);
      }
    }

    if (fresh && !prefersReducedMotion()) {
      card.classList.add('cr-enter');
    }
  }

  function runAction(item) {
    if (!item) return;
    if (typeof go === 'function') {
      if (item.tab === 'home') {
        go('home');
      } else if (item.sub) {
        go(item.tab, item.sub);
      } else {
        go(item.tab);
      }
    }
  }

  function markDone(id) {
    var store = loadStore();
    store.done[id] = true;
    delete store.snooze[id];
    saveStore(store);
    ensureCard();
  }

  function markLater(id) {
    var store = loadStore();
    store.snooze[id] = tomorrowYmd();
    saveStore(store);
    ensureCard();
  }

  function closeSheet() {
    var el = document.getElementById(SHEET_ID);
    if (el) el.remove();
    document.removeEventListener('keydown', onSheetKey, true);
  }

  function onSheetKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    }
  }

  function openSheet() {
    closeSheet();
    var daysLeft = daysUntilChristmas();
    var store = loadStore();
    var st = appState();
    var year = christmasYear();

    var itemsHtml = TIMELINE.map(function (item) {
      var done = isDone(store, item.id) || isSkipped(item, st);
      var when = dateForDaysUntil(item.atDays);
      var dateLabel = formatAuDate(when);
      if (item.atDays === 0) dateLabel = '25 Dec ' + year;
      if (item.atDays === -1) dateLabel = '26 Dec ' + year;
      var tick = done ? '✓' : '·';
      var cls = 'cr-item' + (done ? ' is-done' : '');
      return '' +
        '<div class="' + cls + '">' +
          '<div class="cr-tick" aria-hidden="true">' + tick + '</div>' +
          '<div>' +
            '<span class="cr-item-title">' + esc(item.icon + ' ' + item.title) + '</span>' +
            '<span class="cr-item-body">' + esc(item.body) + '</span>' +
            '<span class="cr-item-date">' + esc(dateLabel) +
              (item.atDays >= 0 ? ' · ' + item.atDays + ' days out' : '') +
            '</span>' +
          '</div>' +
        '</div>';
    }).join('');

    var bd = document.createElement('div');
    bd.id = SHEET_ID;
    bd.setAttribute('role', 'presentation');
    bd.innerHTML =
      '<div class="cr-sheet" role="dialog" aria-modal="true" aria-labelledby="crSheetTitle">' +
        '<div class="cr-sheet-head">' +
          '<div>' +
            '<h2 id="crSheetTitle">Christmas reminders</h2>' +
            '<p>' + esc(daysLeft + ' days to Christmas ' + year + ' · Perth summer vibes') + '</p>' +
          '</div>' +
          '<button type="button" class="cr-close" aria-label="Close">×</button>' +
        '</div>' +
        itemsHtml +
      '</div>';

    bd.addEventListener('click', function (e) {
      if (e.target === bd || e.target.closest('.cr-close')) closeSheet();
    });
    document.body.appendChild(bd);
    document.addEventListener('keydown', onSheetKey, true);
    var closeBtn = bd.querySelector('.cr-close');
    if (closeBtn) closeBtn.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var allBtn = t.closest('[data-cr="all"]');
    if (allBtn) {
      e.preventDefault();
      e.stopPropagation();
      openSheet();
      return;
    }

    var card = t.closest('#' + CARD_ID);
    if (!card) return;
    var btn = t.closest('[data-cr]');
    if (!btn) return;
    var action = btn.getAttribute('data-cr');
    var id = card.dataset.crId;
    var item = null;
    for (var i = 0; i < TIMELINE.length; i++) {
      if (TIMELINE[i].id === id) { item = TIMELINE[i]; break; }
    }

    if (action === 'action') {
      e.preventDefault();
      e.stopPropagation();
      runAction(item);
      return;
    }
    if (action === 'done') {
      e.preventDefault();
      e.stopPropagation();
      markDone(id);
      return;
    }
    if (action === 'later') {
      e.preventDefault();
      e.stopPropagation();
      markLater(id);
    }
  }, true);

  var refreshTimer = null;
  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      ensureCard();
    }, 40);
  }

  new MutationObserver(function () {
    if (!onHome()) {
      removeCard();
      return;
    }
    if (!document.getElementById(CARD_ID) || !screenRoot() || !screenRoot().contains(document.getElementById(CARD_ID))) {
      scheduleRefresh();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleRefresh);
  } else {
    scheduleRefresh();
  }

  window.__hqReminders = {
    refresh: ensureCard,
    openSheet: openSheet,
    timeline: TIMELINE,
    daysUntilChristmas: daysUntilChristmas,
    pickCurrent: function () {
      return pickCurrent(daysUntilChristmas(), loadStore(), appState());
    },
    _test: {
      markDone: markDone,
      markLater: markLater,
      loadStore: loadStore,
      saveStore: saveStore,
      STORE_KEY: STORE_KEY
    }
  };
})();
