/* Christmas HQ — make green summary metric tiles tappable shortcuts. */
(function () {
  'use strict';
  if (window.__metricLinks) return;
  window.__metricLinks = true;

  var css = document.createElement('style');
  css.textContent = [
    '#screen .summary .metric.ml-link{cursor:pointer;position:relative;-webkit-tap-highlight-color:rgba(16,59,49,.12);transition:transform .12s ease,box-shadow .12s ease}',
    '#screen .summary .metric.ml-link:active{transform:scale(.97)}',
    '#screen .summary .metric.ml-link:focus-visible{outline:3px solid #c9a227;outline-offset:2px}',
    '#screen .summary .metric .ml-chev{position:absolute;right:8px;top:50%;transform:translateY(-50%);color:#103b31;opacity:.5;font-size:16px;font-weight:700;line-height:1;pointer-events:none}',
    '#screen .summary .metric.ml-link{padding-right:22px}',
    '.ml-flash{outline:3px solid #c9a227!important;box-shadow:0 0 0 6px rgba(201,162,39,.38)!important;border-radius:16px;transition:box-shadow .25s ease,outline-color .25s ease}',
    '@media(prefers-reduced-motion:reduce){#screen .summary .metric.ml-link{transition:none}#screen .summary .metric.ml-link:active{transform:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function labelOf(metric) {
    var span = metric.querySelector('span:not(.ml-chev)');
    return span ? span.textContent.trim() : '';
  }

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function resolve(label) {
    var L = norm(label);

    if (L === 'family members') {
      return {
        tab: 'plan',
        sub: 'Family',
        find: findFamilyTarget,
        focus: focusFamilyNameIfEmpty
      };
    }
    if (L === 'in secret santa') {
      return { tab: 'gifts', sub: 'Secret Santa', find: findSantaIntro };
    }
    if (L === 'christmas guests') {
      return { tab: 'plan', sub: 'Guests', find: findGuestsSection };
    }
    if (L === 'tasks done') {
      return { tab: 'plan', sub: 'Checklist', find: findChecklistSection };
    }
    if (L === 'gifts bought' || L === 'gifts planned' || L === 'already bought') {
      return { tab: 'gifts', sub: 'My gifts', find: findGiftList };
    }
    if (L === 'budget left' || L === 'estimated cost') {
      return { tab: 'plan', sub: 'Budget', find: findBudgetSection };
    }
    if (L === 'taking part') {
      return { tab: 'gifts', sub: 'Secret Santa', find: findSantaParticipants };
    }
    if (L === 'gift limit') {
      return { tab: 'gifts', sub: 'Secret Santa', find: findSantaRules, focus: focusSantaBudget };
    }
    if (L.indexOf('draw ') === 0 || L === 'draw ready' || L === 'draw not made') {
      return { tab: 'gifts', sub: 'Secret Santa', find: findSantaDraw };
    }

    return { tab: null, sub: null, find: findNearestSection, samePage: true };
  }

  function screenRoot() {
    return document.getElementById('screen') || document;
  }

  function headingNext(root, re) {
    var headings = root.querySelectorAll('.section-line h2, h2, h3');
    for (var i = 0; i < headings.length; i++) {
      if (re.test(headings[i].textContent || '')) {
        var line = headings[i].closest('.section-line') || headings[i];
        return line.nextElementSibling || line;
      }
    }
    return null;
  }

  function findFamilyTarget() {
    var root = screenRoot();
    var form = root.querySelector('form[data-form="family"]');
    var nameInput = form && form.querySelector('input[name="name"]');
    var hasMembers = !!root.querySelector('.family-card');
    if (nameInput && !String(nameInput.value || '').trim()) return form;
    if (hasMembers) {
      var card = root.querySelector('.family-card');
      return (card && card.closest('.list')) || card;
    }
    return form || root.querySelector('.family-banner');
  }

  function focusFamilyNameIfEmpty(el) {
    var form = el && el.matches && el.matches('form[data-form="family"]')
      ? el
      : screenRoot().querySelector('form[data-form="family"]');
    var input = form && form.querySelector('input[name="name"]');
    if (input && !String(input.value || '').trim()) {
      try { input.focus(); } catch (e) {}
    }
  }

  function findSantaIntro() {
    var root = screenRoot();
    return root.querySelector('.santa-frosted') || root.querySelector('h3');
  }

  function findSantaParticipants() {
    var root = screenRoot();
    var list = root.querySelector('.list');
    if (list && list.querySelector('.item')) return list;
    return root.querySelector('.empty') || findSantaIntro();
  }

  function findSantaRules() {
    return screenRoot().querySelector('form[data-form="santaRules"]');
  }

  function focusSantaBudget(el) {
    var input = el && el.querySelector && el.querySelector('input[name="budget"]');
    if (input) {
      try { input.focus(); } catch (e) {}
    }
  }

  function findSantaDraw() {
    var btn = screenRoot().querySelector('[data-action="santaDraw"]');
    return (btn && btn.closest('.card')) || btn;
  }

  function findGuestsSection() {
    var root = screenRoot();
    var form = root.querySelector('form[data-form="guest"]');
    return (form && form.closest('.card')) || form || root.querySelector('h3');
  }

  function findChecklistSection() {
    var root = screenRoot();
    return root.querySelector('form[data-form="task"]') ||
      root.querySelector('.list') ||
      root.querySelector('.card');
  }

  function findGiftList() {
    var root = screenRoot();
    var byHeading = headingNext(root, /your gift list/i);
    if (byHeading) return byHeading;
    var person = root.querySelector('.hq-person-gift-card');
    if (person) return person.closest('.list') || person.parentElement || person;
    return root.querySelector('.list') ||
      root.querySelector('.empty') ||
      root.querySelector('form[data-form="gift"]') ||
      root.querySelector('.summary');
  }

  function findBudgetSection() {
    var root = screenRoot();
    return root.querySelector('form[data-form="budget"]') ||
      root.querySelector('form[data-form="expense"]') ||
      root.querySelector('.card');
  }

  function findNearestSection(metric) {
    var root = screenRoot();
    var summary = metric && metric.closest && metric.closest('.summary');
    /* Prefer live summary on screen if the clicked metric was detached by another handler. */
    if (!summary || !root.contains(summary)) {
      summary = root.querySelector('.summary');
    }
    if (summary) {
      var sib = summary.nextElementSibling;
      while (sib) {
        if (sib.matches && (sib.matches('.card, form, .list, .section-line, .family-banner, .santa-frosted, .empty') || sib.querySelector('.card, form, .list'))) {
          return sib;
        }
        sib = sib.nextElementSibling;
      }
    }
    return root.querySelector('.card, form, .list, .family-banner, .santa-frosted, .empty');
  }

  var flashTimer = null;

  function highlight(el) {
    if (!el) return;
    var prev = document.querySelectorAll('.ml-flash');
    for (var i = 0; i < prev.length; i++) prev[i].classList.remove('ml-flash');
    el.classList.add('ml-flash');
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(function () {
      el.classList.remove('ml-flash');
      flashTimer = null;
    }, 1600);
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function scrollAndFlash(el) {
    if (!el) return;
    try {
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } catch (e) {
      try { el.scrollIntoView(true); } catch (e2) {}
    }
    highlight(el);
  }

  function needsNav(dest) {
    if (!dest || dest.samePage || !dest.tab) return false;
    if (typeof go !== 'function' || typeof ui === 'undefined') return false;
    if (ui.tab !== dest.tab) return true;
    if (dest.sub && ui.sub && ui.sub[dest.tab] !== dest.sub) return true;
    return false;
  }

  function runDest(dest, metric) {
    if (!dest) return;

    if (needsNav(dest)) {
      go(dest.tab, dest.sub);
    } else if (dest.tab && typeof go === 'function' && typeof ui !== 'undefined') {
      if (dest.sub && ui.sub && ui.sub[dest.tab] !== dest.sub) {
        go(dest.tab, dest.sub);
      }
    }

    var attempt = 0;
    function finish() {
      attempt += 1;
      var el = null;
      try {
        el = dest.find ? dest.find(metric) : null;
      } catch (e) {
        el = null;
      }
      if (!el && attempt < 10) {
        setTimeout(finish, 40);
        return;
      }
      if (el) {
        scrollAndFlash(el);
        if (typeof dest.focus === 'function') {
          setTimeout(function () { dest.focus(el); }, 120);
        }
      }
    }
    requestAnimationFrame(function () { setTimeout(finish, 40); });
  }

  function enhance() {
    var metrics = document.querySelectorAll('#screen .summary .metric:not([data-ml])');
    for (var i = 0; i < metrics.length; i++) {
      markMetric(metrics[i]);
    }
  }

  function markMetric(m) {
    m.setAttribute('data-ml', '1');
    m.classList.add('ml-link');
    m.setAttribute('role', 'button');
    m.setAttribute('tabindex', '0');
    var label = labelOf(m);
    if (label) {
      m.setAttribute('aria-label', label + ' — open related section');
    }
    if (!m.querySelector('.ml-chev')) {
      var chev = document.createElement('span');
      chev.className = 'ml-chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.textContent = '›';
      m.appendChild(chev);
    }
  }

  function activate(metric) {
    if (!metric) return;
    runDest(resolve(labelOf(metric)), metric);
  }

  function metricFromEvent(e) {
    var t = e.target;
    if (!t || !t.closest) return null;
    /* Do not require #screen in the selector — another capture handler may have
       already called go()/render and detached the clicked metric from #screen. */
    var metric = t.closest('.metric');
    if (!metric) return null;
    if (!metric.closest('.summary')) return null;
    if (metric.closest('.ed-backdrop, .gd-backdrop')) return null;
    return metric;
  }

  document.addEventListener(
    'click',
    function (e) {
      var metric = metricFromEvent(e);
      if (!metric) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      activate(metric);
    },
    true
  );

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var metric = e.target.closest && e.target.closest('.summary .metric');
    if (!metric || e.target !== metric) return;
    e.preventDefault();
    activate(metric);
  });

  new MutationObserver(enhance).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  enhance();
})();
