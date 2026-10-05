/* Christmas HQ — first-time welcome tour (after pin unlock). */
(function () {
  'use strict';
  if (window.__hqWelcomeTour) return;
  window.__hqWelcomeTour = true;

  var STORE_KEY = 'christmas-hq-welcome-tour-v2';
  var ROOT_ID = 'hqWelcomeTour';
  var STYLE_ID = 'hqWelcomeTourStyle';
  var CARD_ID = 'hqWelcomeTourCard';
  var Z = 2147482000;

  var reducedMotion = false;
  try {
    reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  var active = false;
  var stepIndex = 0;
  var openedNav = false;
  var prevFocus = null;
  var waitTimer = null;
  var replayRequested = false;

  /* Selectors tried in order; first visible hit wins. */
  var STEPS = [
    {
      id: 'welcome',
      emoji: '🎄',
      title: 'Welcome to Christmas HQ',
      body: 'Your Christmas, sorted. A quick tour of the festive bits — skip anytime.',
      selectors: []
    },
    {
      id: 'home',
      emoji: '🏠',
      title: 'Home',
      body: 'Your countdown to Christmas lives here, with gentle reminders so nothing important sneaks up on you.',
      selectors: ['#hqReminderCard', '#screen .hero', '#bottomNav button[data-nav="home"]'],
      openNav: true,
      nav: 'home'
    },
    {
      id: 'gifts',
      emoji: '🎁',
      title: 'Gifts',
      body: 'My gifts, gift ideas, and Secret Santa — keep every present on track without the panic.',
      selectors: ['#bottomNav button[data-nav="gifts"]'],
      openNav: true,
      nav: 'gifts'
    },
    {
      id: 'plan',
      emoji: '✅',
      title: 'Plan',
      body: 'Checklist, budget, and your family list — the planning centre for a calmer Christmas.',
      selectors: ['#bottomNav button[data-nav="plan"]'],
      openNav: true,
      nav: 'plan'
    },
    {
      id: 'kitchen',
      emoji: '🍽️',
      title: 'Kitchen',
      body: 'Recipes, your menu, and groceries — plus a print list when you’re ready to shop.',
      selectors: ['#bottomNav button[data-nav="kitchen"]'],
      openNav: true,
      nav: 'kitchen'
    },
    {
      id: 'games-magic',
      emoji: '🎅',
      title: 'Games & Magic',
      body: 'Family Games for party fun, and Magic for advent, movies, music, and festive extras.',
      selectors: ['#bottomNav button[data-nav="games"]', '#bottomNav button[data-nav="magic"]'],
      openNav: true,
      nav: 'games'
    },
    {
      id: 'explore',
      emoji: '✨',
      title: 'Explore',
      body: 'Decor ideas and Discover cards live here. Tap a card for steps and a checklist, add it to your plans, or show places near us.',
      selectors: ['#bottomNav button[data-nav="explore"]'],
      openNav: true,
      nav: 'explore'
    },
    {
      id: 'chat-tree',
      emoji: '💬',
      title: 'Chat & the tree button',
      body: 'Chat has Family and Community threads. Tap the 🎄 tree (left) for the icon tower — Sound mute, tabs, and Settings. The ‹ button on the right takes you back.',
      selectors: ['#navToggle', '#bottomNav button[data-nav="chat"]', '#hqBackFab', '#soundToggle'],
      openNav: true,
      nav: 'chat'
    },
    {
      id: 'settings',
      emoji: '⚙️',
      title: 'Settings',
      body: 'In the tree menu: change your pattern lock, connect Family Cloud, export or import a backup, install the app, and replay this tour anytime.',
      selectors: ['#bottomNav button[data-nav="settings"]', 'button.circle-btn[data-action="settings"]', '.hq-settings-btn'],
      openNav: true,
      nav: 'settings'
    }
  ];

  function seen() {
    try { return localStorage.getItem(STORE_KEY) === '1'; } catch (e) { return false; }
  }

  function markSeen() {
    try { localStorage.setItem(STORE_KEY, '1'); } catch (e) {}
  }

  function clearSeen() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
  }

  function isUnlocked() {
    /* DOM is source of truth (matches pin-lock hideLock / test harness). */
    var html = document.documentElement;
    if (html.classList.contains('hq-pin-locked')) return false;
    var lock = document.getElementById('hqPinLock');
    if (!lock) {
      /* Pin script present but overlay not mounted yet — wait. */
      if (window.__hqPinLockLoaded) return false;
      return true;
    }
    if (lock.classList.contains('hqpin-hidden')) return true;
    try {
      var st = window.getComputedStyle(lock);
      if (st && (st.display === 'none' || st.visibility === 'hidden')) return true;
    } catch (e) {}
    return false;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = [
      '#' + ROOT_ID + '{position:fixed;inset:0;z-index:' + Z + ';pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}',
      '#' + ROOT_ID + ' *{box-sizing:border-box}',
      '#' + ROOT_ID + '.hqwt-on{pointer-events:auto}',
      '#' + ROOT_ID + ' .hqwt-dim{position:absolute;inset:0;background:rgba(8,28,22,.58);' +
        (reducedMotion ? '' : 'transition:opacity .28s ease;') + 'opacity:0}',
      '#' + ROOT_ID + '.hqwt-on .hqwt-dim{opacity:1}',
      '#' + ROOT_ID + ' .hqwt-spot{position:fixed;pointer-events:none;border-radius:16px;' +
        'box-shadow:0 0 0 3px #efc85a,0 0 0 8px rgba(239,200,90,.28),0 0 0 9999px rgba(8,28,22,.55);' +
        'outline:2px solid rgba(255,248,223,.35);z-index:1;' +
        (reducedMotion ? '' : 'transition:top .25s ease,left .25s ease,width .25s ease,height .25s ease,opacity .2s ease;') +
        'opacity:0}',
      '#' + ROOT_ID + ' .hqwt-spot.hqwt-show{opacity:1}',
      '#' + ROOT_ID + ' .hqwt-sparkles{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}',
      '#' + ROOT_ID + ' .hqwt-flake{position:absolute;color:#fff8df;opacity:.55;font-size:12px;' +
        (reducedMotion ? 'display:none;' : 'animation:hqwtFall linear infinite;') + '}',
      '@keyframes hqwtFall{0%{transform:translateY(-8vh) rotate(0deg);opacity:0}12%{opacity:.7}100%{transform:translateY(105vh) rotate(280deg);opacity:0}}',
      '#' + ROOT_ID + ' .hqwt-sheet{position:absolute;left:50%;bottom:0;transform:translateX(-50%) translateY(110%);' +
        'width:min(100%,420px);z-index:2;padding:0 12px calc(14px + env(safe-area-inset-bottom));' +
        (reducedMotion ? '' : 'transition:transform .32s cubic-bezier(.2,.8,.2,1);') + '}',
      '#' + ROOT_ID + '.hqwt-on .hqwt-sheet{transform:translateX(-50%) translateY(0)}',
      '#' + ROOT_ID + ' .hqwt-card{background:linear-gradient(160deg,#134538 0%,#103b31 55%,#0b2f28 100%);' +
        'color:#fff8df;border:2px solid #efc85a;border-radius:22px 22px 18px 18px;' +
        'box-shadow:0 -4px 0 #b28a34,0 12px 36px rgba(0,0,0,.35);padding:18px 16px 14px;position:relative;overflow:hidden}',
      '#' + ROOT_ID + ' .hqwt-card::before{content:"❄  ✦  ❄";display:block;text-align:center;letter-spacing:4px;' +
        'font-size:11px;color:#f2cf78;margin:0 0 8px;opacity:.9}',
      '#' + ROOT_ID + ' .hqwt-emoji{font-size:28px;line-height:1;margin:0 0 6px;text-align:center}',
      '#' + ROOT_ID + ' .hqwt-title{font:700 20px Georgia,"Times New Roman",serif;margin:0 0 6px;text-align:center;color:#fff8df}',
      '#' + ROOT_ID + ' .hqwt-body{margin:0 0 14px;font-size:13px;line-height:1.5;color:#e4f0e6;text-align:center}',
      '#' + ROOT_ID + ' .hqwt-progress{display:flex;justify-content:center;gap:6px;margin:0 0 14px}',
      '#' + ROOT_ID + ' .hqwt-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,248,223,.28);border:1px solid rgba(239,200,90,.45)}',
      '#' + ROOT_ID + ' .hqwt-dot.hqwt-on{background:#efc85a;box-shadow:0 0 8px rgba(239,200,90,.55)}',
      '#' + ROOT_ID + ' .hqwt-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
      '#' + ROOT_ID + ' .hqwt-actions .hqwt-grow{flex:1;min-width:0}',
      '#' + ROOT_ID + ' .hqwt-btn{appearance:none;-webkit-appearance:none;border-radius:12px;min-height:44px;' +
        'padding:10px 14px;font-size:13px;font-weight:850;cursor:pointer;border:1px solid transparent;' +
        'display:inline-flex;align-items:center;justify-content:center;gap:6px;-webkit-tap-highlight-color:transparent}',
      '#' + ROOT_ID + ' .hqwt-btn:focus-visible{outline:3px solid #efc85a;outline-offset:2px}',
      '#' + ROOT_ID + ' .hqwt-btn-primary{background:#efc85a;color:#103b31;border-color:#d4a84a;flex:1}',
      '#' + ROOT_ID + ' .hqwt-btn-alt{background:rgba(255,255,255,.1);color:#fff8df;border-color:rgba(255,248,223,.28)}',
      '#' + ROOT_ID + ' .hqwt-btn-ghost{background:transparent;color:#d2e2d7;border-color:transparent;font-size:12px;min-height:36px;padding:6px 8px}',
      '#' + ROOT_ID + ' .hqwt-btn:active{transform:scale(.98)}',
      '#' + ROOT_ID + ' .hqwt-skiprow{display:flex;justify-content:center;margin-top:6px}',
      '@media(prefers-reduced-motion:reduce){#' + ROOT_ID + ' .hqwt-flake{display:none!important}#' + ROOT_ID + ' .hqwt-dim,#' + ROOT_ID + ' .hqwt-sheet,#' + ROOT_ID + ' .hqwt-spot{transition:none!important}}'
    ].join('');
    document.head.appendChild(st);
  }

  function ensureRoot() {
    injectStyle();
    var root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML =
      '<div class="hqwt-dim" data-hqwt="dim"></div>' +
      '<div class="hqwt-spot" id="hqwtSpot" hidden></div>' +
      '<div class="hqwt-sparkles" id="hqwtSparkles" aria-hidden="true"></div>' +
      '<div class="hqwt-sheet">' +
        '<div class="hqwt-card" role="dialog" aria-modal="true" aria-labelledby="hqwtTitle" aria-describedby="hqwtBody" tabindex="-1">' +
          '<div class="hqwt-emoji" id="hqwtEmoji" aria-hidden="true"></div>' +
          '<h2 class="hqwt-title" id="hqwtTitle"></h2>' +
          '<p class="hqwt-body" id="hqwtBody"></p>' +
          '<div class="hqwt-progress" id="hqwtProgress" role="presentation"></div>' +
          '<div class="hqwt-actions">' +
            '<button type="button" class="hqwt-btn hqwt-btn-alt" data-hqwt="back">Back</button>' +
            '<button type="button" class="hqwt-btn hqwt-btn-primary" data-hqwt="next">Next</button>' +
          '</div>' +
          '<div class="hqwt-skiprow">' +
            '<button type="button" class="hqwt-btn hqwt-btn-ghost" data-hqwt="skip">Skip tour</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    root.addEventListener('click', onRootClick);
    return root;
  }

  function fillSparkles() {
    if (reducedMotion) return;
    var box = document.getElementById('hqwtSparkles');
    if (!box || box.childElementCount) return;
    var glyphs = ['❄', '✦', '❄', '✧', '❅'];
    var i;
    for (i = 0; i < 14; i++) {
      var f = document.createElement('span');
      f.className = 'hqwt-flake';
      f.textContent = glyphs[i % glyphs.length];
      f.style.left = (4 + (i * 7) % 92) + '%';
      f.style.animationDuration = (7 + (i % 5) * 1.4) + 's';
      f.style.animationDelay = (i * 0.45) + 's';
      f.style.fontSize = (10 + (i % 4) * 3) + 'px';
      box.appendChild(f);
    }
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.bottom < 0 || r.right < 0 || r.top > (window.innerHeight || 0) || r.left > (window.innerWidth || 0)) return false;
    try {
      var st = window.getComputedStyle(el);
      if (!st || st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return false;
    } catch (e) {}
    return true;
  }

  function openNavTower() {
    var nav = document.getElementById('bottomNav');
    var toggle = document.getElementById('navToggle');
    if (!nav) return;
    if (!nav.classList.contains('nav-open')) {
      nav.classList.add('nav-open');
      openedNav = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
  }

  function closeNavTowerIfWeOpened() {
    if (!openedNav) return;
    var nav = document.getElementById('bottomNav');
    var toggle = document.getElementById('navToggle');
    if (nav) nav.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    openedNav = false;
  }

  function findTarget(step) {
    if (!step || !step.selectors) return null;
    var i;
    for (i = 0; i < step.selectors.length; i++) {
      var el = document.querySelector(step.selectors[i]);
      if (isVisible(el)) return el;
    }
    /* Retry after opening nav */
    if (step.openNav) {
      openNavTower();
      for (i = 0; i < step.selectors.length; i++) {
        var el2 = document.querySelector(step.selectors[i]);
        if (isVisible(el2)) return el2;
      }
    }
    return null;
  }

  function placeSpotlight(el) {
    var spot = document.getElementById('hqwtSpot');
    if (!spot) return;
    if (!el) {
      spot.hidden = true;
      spot.classList.remove('hqwt-show');
      return;
    }
    var r = el.getBoundingClientRect();
    var pad = 8;
    spot.hidden = false;
    spot.style.top = Math.max(4, r.top - pad) + 'px';
    spot.style.left = Math.max(4, r.left - pad) + 'px';
    spot.style.width = Math.min((window.innerWidth || r.width) - 8, r.width + pad * 2) + 'px';
    spot.style.height = Math.min((window.innerHeight || r.height) - 8, r.height + pad * 2) + 'px';
    spot.style.borderRadius = (el.id === 'navToggle' || el.id === 'hqBackFab' || (el.tagName === 'BUTTON' && el.closest('#bottomNav'))) ? '14px' : '18px';
    requestAnimationFrame(function () { spot.classList.add('hqwt-show'); });
  }

  function renderStep() {
    var root = ensureRoot();
    var step = STEPS[stepIndex];
    if (!step) { finish(true); return; }

    if (step.openNav) openNavTower();
    else closeNavTowerIfWeOpened();

    var emoji = document.getElementById('hqwtEmoji');
    var title = document.getElementById('hqwtTitle');
    var body = document.getElementById('hqwtBody');
    var prog = document.getElementById('hqwtProgress');
    var backBtn = root.querySelector('[data-hqwt="back"]');
    var nextBtn = root.querySelector('[data-hqwt="next"]');

    if (emoji) emoji.textContent = step.emoji || '🎄';
    if (title) title.textContent = step.title || '';
    if (body) body.textContent = step.body || '';

    if (prog) {
      var dots = '';
      var i;
      for (i = 0; i < STEPS.length; i++) {
        dots += '<span class="hqwt-dot' + (i === stepIndex ? ' hqwt-on' : '') + '"></span>';
      }
      prog.innerHTML = dots;
    }

    if (backBtn) {
      backBtn.disabled = stepIndex === 0;
      backBtn.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
      nextBtn.textContent = stepIndex === STEPS.length - 1 ? "Let's go! 🎄" : 'Next';
    }

    var target = findTarget(step);
    placeSpotlight(target);

    root.classList.add('hqwt-on');
    root.setAttribute('aria-hidden', 'false');

    try {
      var focusEl = nextBtn || root.querySelector('.hqwt-card');
      if (focusEl) focusEl.focus({ preventScroll: true });
    } catch (e) {}
  }

  function onRootClick(e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-hqwt]') : null;
    if (!btn) return;
    var act = btn.getAttribute('data-hqwt');
    if (act === 'next') {
      e.preventDefault();
      if (stepIndex >= STEPS.length - 1) finish(true);
      else { stepIndex += 1; renderStep(); }
    } else if (act === 'back') {
      e.preventDefault();
      if (stepIndex > 0) { stepIndex -= 1; renderStep(); }
    } else if (act === 'skip' || act === 'dim') {
      e.preventDefault();
      finish(true);
    }
  }

  function onKey(e) {
    if (!active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      finish(true);
      return;
    }
    if (e.key !== 'Tab') return;
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var focusables = root.querySelectorAll('button:not([disabled]):not([style*="visibility: hidden"])');
    var list = [];
    var i;
    for (i = 0; i < focusables.length; i++) {
      if (focusables[i].style.visibility === 'hidden') continue;
      list.push(focusables[i]);
    }
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onResize() {
    if (!active) return;
    placeSpotlight(findTarget(STEPS[stepIndex]));
  }

  function startTour(force) {
    if (!force && seen()) return;
    if (!isUnlocked()) return;
    if (active) {
      if (!force) return;
      stepIndex = 0;
      openedNav = false;
      renderStep();
      return;
    }
    ensureRoot();
    fillSparkles();
    active = true;
    stepIndex = 0;
    openedNav = false;
    prevFocus = document.activeElement;
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    renderStep();
  }

  function finish(mark) {
    if (!active && !document.getElementById(ROOT_ID)) {
      if (mark) markSeen();
      return;
    }
    active = false;
    if (mark) markSeen();
    closeNavTowerIfWeOpened();
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    var root = document.getElementById(ROOT_ID);
    if (root) {
      root.classList.remove('hqwt-on');
      root.setAttribute('aria-hidden', 'true');
      var spot = document.getElementById('hqwtSpot');
      if (spot) {
        spot.classList.remove('hqwt-show');
        spot.hidden = true;
      }
      /* Remove after transition */
      setTimeout(function () {
        var r = document.getElementById(ROOT_ID);
        if (r && !active) r.remove();
      }, reducedMotion ? 0 : 340);
    }
    try {
      if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true });
    } catch (e) {}
    prevFocus = null;
  }

  function tryStart() {
    if (replayRequested) {
      if (!isUnlocked()) return;
      replayRequested = false;
      startTour(true);
      return;
    }
    if (seen()) return;
    if (!isUnlocked()) return;
    startTour(false);
  }

  function waitForUnlock() {
    if (waitTimer) return;
    tryStart();
    if (active || (seen() && !replayRequested)) return;

    window.addEventListener('hq-pin-unlocked', function onUnlock() {
      window.removeEventListener('hq-pin-unlocked', onUnlock);
      setTimeout(tryStart, 420);
    });

    var tries = 0;
    waitTimer = setInterval(function () {
      tries += 1;
      if (isUnlocked()) {
        clearInterval(waitTimer);
        waitTimer = null;
        setTimeout(tryStart, 280);
      } else if (tries > 240) {
        clearInterval(waitTimer);
        waitTimer = null;
      }
    }, 500);

    /* Also watch html class / lock overlay */
    try {
      var obs = new MutationObserver(function () {
        if (isUnlocked()) {
          setTimeout(tryStart, 280);
        }
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      var lock = document.getElementById('hqPinLock');
      if (lock) obs.observe(lock, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {}
  }

  /* ---------- Settings: "Replay welcome tour" card ---------- */
  var CARD_HTML =
    '<h3>🎄 Welcome tour</h3>' +
    '<p class="muted-note">New here? Take a quick festive stroll through Home, Gifts, Plan, Kitchen, Games &amp; Magic, Explore, Chat, Settings, and the Christmas tree menu.</p>' +
    '<div class="btnrow" style="margin-top:12px"><button class="btn" type="button" data-hq-welcome-action="replay">✨ Replay welcome tour</button></div>' +
    '<p class="muted-note" style="margin-top:10px">The tour shows once on this phone after you unlock. Replay anytime you like a refresher.</p>';

  function isSettingsScreen(screen) {
    return !!(screen && screen.querySelector('[data-action="export"]') && screen.querySelector('[data-action="reset"]'));
  }

  function injectCard() {
    if (document.getElementById(CARD_ID)) return;
    var screen = document.getElementById('screen');
    if (!isSettingsScreen(screen)) return;
    var card = document.createElement('div');
    card.className = 'card';
    card.id = CARD_ID;
    card.innerHTML = CARD_HTML;
    var pinCard = document.getElementById('hqPinCard');
    if (pinCard && pinCard.parentNode) {
      pinCard.parentNode.insertBefore(card, pinCard.nextSibling);
    } else {
      var firstCard = screen.querySelector('.card');
      if (firstCard && firstCard.parentNode) {
        firstCard.parentNode.insertBefore(card, firstCard.nextSibling);
      } else {
        screen.appendChild(card);
      }
    }
  }

  var settingsWatching = false;
  function watchSettings() {
    if (settingsWatching) return;
    var screen = document.getElementById('screen');
    if (!screen) return;
    settingsWatching = true;
    injectCard();
    new MutationObserver(function () {
      if (!document.getElementById(CARD_ID)) injectCard();
    }).observe(screen, { childList: true, subtree: true });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-hq-welcome-action="replay"]') : null;
    if (!btn) return;
    e.preventDefault();
    clearSeen();
    if (!isUnlocked()) {
      replayRequested = true;
      return;
    }
    startTour(true);
  });

  function boot() {
    watchSettings();
    waitForUnlock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ChristmasHQWelcomeTour = {
    start: function () { clearSeen(); startTour(true); },
    reset: function () { clearSeen(); },
    isActive: function () { return !!active; }
  };
})();
