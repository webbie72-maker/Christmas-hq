/* Christmas HQ — first-time welcome tour (after pin unlock). */
(function () {
  'use strict';
  if (window.__hqWelcomeTour) return;
  window.__hqWelcomeTour = true;

  var STORE_KEY = 'christmas-hq-welcome-tour-v3';
  var ROOT_ID = 'hqWelcomeTour';
  var STYLE_ID = 'hqWelcomeTourStyle';
  var CARD_ID = 'hqWelcomeTourCard';
  var Z = 2147482000;
  /* Leave the left icon tower (~8+46+padding) clear of the tour card. */
  var TOWER_CLEAR_PX = 96;

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

  /*
   * Tower visual order is bottom→top (column-reverse): Sound nearest the tree,
   * then Home…Settings at the top. Tour: welcome → tree → each tower icon →
   * music dock + back (if present) → finish.
   */
  var STEPS = [
    {
      id: 'welcome',
      emoji: '🎄',
      title: 'Welcome to Christmas HQ',
      body: 'Your Christmas, sorted. A quick stroll through every icon in the tree menu — skip anytime.',
      selectors: []
    },
    {
      id: 'tree',
      emoji: '🎄',
      title: 'The Christmas tree menu',
      body: 'Tap the 🎄 tree (bottom left) anytime to open the icon tower. Drag it up or down if you need more reach.',
      selectors: ['#navToggle']
    },
    {
      id: 'sound',
      emoji: '🔔',
      title: 'Sound',
      body: 'Mute or play the festive ambient music that floats behind Christmas HQ. Tap again whenever you need quiet.',
      selectors: ['#soundToggle'],
      openNav: true
    },
    {
      id: 'home',
      emoji: '🏠',
      title: 'Home',
      body: 'Your countdown to Christmas lives here, with gentle reminders and shortcuts so nothing important sneaks up on you.',
      selectors: ['#bottomNav button[data-nav="home"]'],
      openNav: true
    },
    {
      id: 'gifts',
      emoji: '🎁',
      title: 'Gifts',
      body: 'Track My gifts, browse Gift ideas, and run Secret Santa — keep every present on track without the panic.',
      selectors: ['#bottomNav button[data-nav="gifts"]'],
      openNav: true
    },
    {
      id: 'plan',
      emoji: '✅',
      title: 'Plan',
      body: 'Checklist, budget, calendar, family list, and guests — the planning centre for a calmer Christmas.',
      selectors: ['#bottomNav button[data-nav="plan"]'],
      openNav: true
    },
    {
      id: 'kitchen',
      emoji: '🍽️',
      title: 'Kitchen',
      body: 'Recipes, your menu, groceries, and a cook plan — plus a print list when you’re ready to shop.',
      selectors: ['#bottomNav button[data-nav="kitchen"]'],
      openNav: true
    },
    {
      id: 'magic',
      emoji: '🎅',
      title: 'Magic',
      body: 'Advent calendar, activities, movie night, and Santa letters — the festive extras that make memories.',
      selectors: ['#bottomNav button[data-nav="magic"]'],
      openNav: true
    },
    {
      id: 'games',
      emoji: '🎮',
      title: 'Family Games',
      body: 'Trivia, bingo, memory match, and more for party fun — solo here, or live together with Family Cloud.',
      selectors: ['#bottomNav button[data-nav="games"]'],
      openNav: true
    },
    {
      id: 'chat',
      emoji: '💬',
      title: 'Chat',
      body: 'Community Christmas topics and private Family threads — keep the festive chatter in one place.',
      selectors: ['#bottomNav button[data-nav="chat"]'],
      openNav: true
    },
    {
      id: 'explore',
      emoji: '✨',
      title: 'Explore',
      body: 'Discover cards, your light trail, and decor ideas. Tap a card for steps, a checklist, or places near you.',
      selectors: ['#bottomNav button[data-nav="explore"]'],
      openNav: true
    },
    {
      id: 'settings',
      emoji: '⚙️',
      title: 'Settings',
      body: 'Change your pattern lock, connect Family Cloud, export or import a backup, install the app, and replay this tour.',
      selectors: ['#bottomNav button[data-nav="settings"]'],
      openNav: true
    },
    {
      id: 'music-dock',
      emoji: '🎶',
      title: 'Music dock',
      body: 'Your song library lives in the music dock — pick a track, set the volume, and keep carols playing while you plan.',
      selectors: ['.hq-music-dock', '#hqMusicDock']
    },
    {
      id: 'back',
      emoji: '‹',
      title: 'Back button',
      body: 'The ‹ button on the right takes you back a page. Handy after you dive into a recipe, gift, or chat thread.',
      selectors: ['#hqBackFab']
    },
    {
      id: 'finish',
      emoji: '✨',
      title: 'You’re all set',
      body: 'That’s the tour! Open the tree anytime, explore at your pace, and replay from Settings if you want a refresher. Merry Christmas!',
      selectors: []
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
      '#' + ROOT_ID + ' .hqwt-dim{position:absolute;inset:0;background:rgba(8,28,22,.52);' +
        (reducedMotion ? '' : 'transition:opacity .28s ease,clip-path .2s ease;') + 'opacity:0}',
      '#' + ROOT_ID + '.hqwt-on .hqwt-dim{opacity:1}',
      /* Keep the left tower strip undimmed so icons stay readable while lit. */
      '#' + ROOT_ID + '.hqwt-tower-clear .hqwt-dim{clip-path:inset(0 0 0 ' + TOWER_CLEAR_PX + 'px)}',
      '#' + ROOT_ID + ' .hqwt-spot{position:fixed;pointer-events:none;border-radius:16px;' +
        'box-shadow:0 0 0 3px #efc85a,0 0 0 8px rgba(239,200,90,.32),0 0 0 9999px rgba(8,28,22,.48);' +
        'outline:2px solid rgba(255,248,223,.4);z-index:1;' +
        (reducedMotion ? '' : 'transition:top .25s ease,left .25s ease,width .25s ease,height .25s ease,opacity .2s ease;') +
        'opacity:0}',
      '#' + ROOT_ID + '.hqwt-tower-clear .hqwt-spot{' +
        'box-shadow:0 0 0 3px #efc85a,0 0 0 10px rgba(239,200,90,.4),0 0 24px 6px rgba(239,200,90,.55)}',
      '#' + ROOT_ID + ' .hqwt-spot.hqwt-show{opacity:1}',
      '#' + ROOT_ID + ' .hqwt-sparkles{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1}',
      '#' + ROOT_ID + ' .hqwt-flake{position:absolute;color:#fff8df;opacity:.55;font-size:12px;' +
        (reducedMotion ? 'display:none;' : 'animation:hqwtFall linear infinite;') + '}',
      '@keyframes hqwtFall{0%{transform:translateY(-8vh) rotate(0deg);opacity:0}12%{opacity:.7}100%{transform:translateY(105vh) rotate(280deg);opacity:0}}',
      /* Card sits on the right, clearing the left tower (~0–90px). */
      '#' + ROOT_ID + ' .hqwt-sheet{position:absolute;left:' + TOWER_CLEAR_PX + 'px;right:10px;bottom:0;' +
        'width:auto;max-width:min(320px,calc(100% - ' + (TOWER_CLEAR_PX + 20) + 'px));margin-left:auto;' +
        'z-index:2;padding:0 0 calc(12px + env(safe-area-inset-bottom));transform:translateY(110%);' +
        (reducedMotion ? '' : 'transition:transform .32s cubic-bezier(.2,.8,.2,1),top .25s ease,bottom .25s ease;') + '}',
      '#' + ROOT_ID + '.hqwt-on .hqwt-sheet{transform:translateY(0)}',
      '#' + ROOT_ID + ' .hqwt-sheet.hqwt-top{bottom:auto;top:calc(10px + env(safe-area-inset-top));transform:translateY(-110%)}',
      '#' + ROOT_ID + '.hqwt-on .hqwt-sheet.hqwt-top{transform:translateY(0)}',
      '#' + ROOT_ID + ' .hqwt-card{background:linear-gradient(160deg,rgba(19,69,56,.92) 0%,rgba(16,59,49,.94) 55%,rgba(11,47,40,.95) 100%);' +
        'color:#fff8df;border:2px solid #efc85a;border-radius:20px;' +
        'box-shadow:0 -3px 0 #b28a34,0 12px 36px rgba(0,0,0,.32);padding:14px 14px 12px;position:relative;overflow:hidden;' +
        'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
      '#' + ROOT_ID + ' .hqwt-card::before{content:"❄  ✦  ❄";display:block;text-align:center;letter-spacing:4px;' +
        'font-size:10px;color:#f2cf78;margin:0 0 6px;opacity:.9}',
      '#' + ROOT_ID + ' .hqwt-emoji{font-size:24px;line-height:1;margin:0 0 4px;text-align:center}',
      '#' + ROOT_ID + ' .hqwt-title{font:700 17px Georgia,"Times New Roman",serif;margin:0 0 5px;text-align:center;color:#fff8df}',
      '#' + ROOT_ID + ' .hqwt-body{margin:0 0 10px;font-size:12px;line-height:1.45;color:#e4f0e6;text-align:center}',
      '#' + ROOT_ID + ' .hqwt-progress{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin:0 0 10px;max-width:100%}',
      '#' + ROOT_ID + ' .hqwt-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,248,223,.28);border:1px solid rgba(239,200,90,.45)}',
      '#' + ROOT_ID + ' .hqwt-dot.hqwt-on{background:#efc85a;box-shadow:0 0 8px rgba(239,200,90,.55)}',
      '#' + ROOT_ID + ' .hqwt-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
      '#' + ROOT_ID + ' .hqwt-actions .hqwt-grow{flex:1;min-width:0}',
      '#' + ROOT_ID + ' .hqwt-btn{appearance:none;-webkit-appearance:none;border-radius:12px;min-height:42px;' +
        'padding:9px 12px;font-size:12px;font-weight:850;cursor:pointer;border:1px solid transparent;' +
        'display:inline-flex;align-items:center;justify-content:center;gap:6px;-webkit-tap-highlight-color:transparent}',
      '#' + ROOT_ID + ' .hqwt-btn:focus-visible{outline:3px solid #efc85a;outline-offset:2px}',
      '#' + ROOT_ID + ' .hqwt-btn-primary{background:#efc85a;color:#103b31;border-color:#d4a84a;flex:1}',
      '#' + ROOT_ID + ' .hqwt-btn-alt{background:rgba(255,255,255,.12);color:#fff8df;border-color:rgba(255,248,223,.28)}',
      '#' + ROOT_ID + ' .hqwt-btn-ghost{background:transparent;color:#d2e2d7;border-color:transparent;font-size:11px;min-height:32px;padding:5px 8px}',
      '#' + ROOT_ID + ' .hqwt-btn:active{transform:scale(.98)}',
      '#' + ROOT_ID + ' .hqwt-skiprow{display:flex;justify-content:center;margin-top:4px}',
      '@media(max-width:380px){#' + ROOT_ID + ' .hqwt-title{font-size:16px}#' + ROOT_ID + ' .hqwt-body{font-size:11px}#' + ROOT_ID + ' .hqwt-card{padding:12px 11px 10px}}',
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
        '<div class="hqwt-card" id="' + CARD_ID + 'Dialog" role="dialog" aria-modal="true" aria-labelledby="hqwtTitle" aria-describedby="hqwtBody" tabindex="-1">' +
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
    if (!step || !step.selectors || !step.selectors.length) return null;
    var i;
    for (i = 0; i < step.selectors.length; i++) {
      var el = document.querySelector(step.selectors[i]);
      if (isVisible(el)) return el;
    }
    if (step.openNav) {
      openNavTower();
      for (i = 0; i < step.selectors.length; i++) {
        var el2 = document.querySelector(step.selectors[i]);
        if (isVisible(el2)) return el2;
      }
    }
    return null;
  }

  function rectsOverlap(a, b, pad) {
    var p = pad || 0;
    return !(a.right + p <= b.left || a.left - p >= b.right || a.bottom + p <= b.top || a.top - p >= b.bottom);
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

  function positionSheet(target) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var sheet = root.querySelector('.hqwt-sheet');
    var card = root.querySelector('.hqwt-card');
    if (!sheet || !card) return;

    /* Default: bottom-right (clears left tower via CSS left offset). */
    sheet.classList.remove('hqwt-top');
    /* Force layout so we can measure and flip if needed. */
    void sheet.offsetWidth;

    if (!target) return;

    var t = target.getBoundingClientRect();
    var vh = window.innerHeight || 740;
    var cardH = Math.max(card.getBoundingClientRect().height || 200, 160);
    /* If the target sits where a bottom card would live, flip to top. */
    var bottomZoneTop = vh - cardH - 28;
    var placeTop = t.bottom > bottomZoneTop || t.top > vh * 0.52;

    if (placeTop) sheet.classList.add('hqwt-top');
    else sheet.classList.remove('hqwt-top');

    void sheet.offsetWidth;
    var c = card.getBoundingClientRect();
    if (rectsOverlap(t, c, 10)) {
      /* Still overlapping — flip the other way. */
      if (sheet.classList.contains('hqwt-top')) sheet.classList.remove('hqwt-top');
      else sheet.classList.add('hqwt-top');
    }
  }

  function setTowerClear(on) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.classList.toggle('hqwt-tower-clear', !!on);
  }

  function renderStep() {
    var root = ensureRoot();
    var step = STEPS[stepIndex];
    if (!step) { finish(true); return; }

    if (step.openNav) openNavTower();
    else closeNavTowerIfWeOpened();

    setTowerClear(!!step.openNav);

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
    /* Optional steps (music dock / back) — skip if target missing. */
    if (!target && (step.id === 'music-dock' || step.id === 'back')) {
      if (stepIndex >= STEPS.length - 1) { finish(true); return; }
      stepIndex += 1;
      renderStep();
      return;
    }

    placeSpotlight(target);
    positionSheet(target);

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
    var step = STEPS[stepIndex];
    var target = findTarget(step);
    placeSpotlight(target);
    positionSheet(target);
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
    setTowerClear(false);
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

  var CARD_HTML =
    '<h3>🎄 Welcome tour</h3>' +
    '<p class="muted-note">New here? Take a quick festive stroll through every icon in the Christmas tree menu — Sound, Home, Gifts, Plan, Kitchen, Magic, Games, Chat, Explore, and Settings.</p>' +
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
    isActive: function () { return !!active; },
    steps: function () { return STEPS.slice(); }
  };
})();
