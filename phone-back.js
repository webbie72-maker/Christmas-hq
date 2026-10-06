/* Share in-app navigation with Android Back and iPhone/iPad browser Back. */
(() => {
  'use strict';
  if (window.ChristmasHQPhoneBack || !window.history?.pushState) return;
  const KEY = 'christmasHQNavigation';
  const clone = value => JSON.parse(JSON.stringify(value));
  const overlays = [
    ['#hqDirectChatModal', '[data-hq-dm-close]'],
    ['#hqFamilyLeaveModal', '[data-hq-exit-close]'],
    ['#hqBarcodeModal', '[data-hq-barcode-close]'],
    ['#hqChatModal', '[data-hq-chat-modal-close]'],
    ['.gd-backdrop', '.gd-close'], ['.ed-backdrop', '.ed-close'],
    ['#bottomNav.nav-open', '#navToggle']
  ];
  let restoring = false, pendingBack = false;
  function overlay() { return overlays.find(([selector]) => document.querySelector(selector))?.[0] || ''; }
  function snapshot() {
    return { ...navSnapshot(), hqGiftPerson: ui.hqGiftPerson || '', hqEditGiftId: ui.hqEditGiftId || '',
      game: ui.tab === 'games' ? window.ChristmasHQGamesNavigation?.snapshot() || 'hub' : null,
      chat: ui.tab === 'chat' ? window.ChristmasHQChatNavigation?.snapshot() || null : null,
      overlay: overlay() };
  }
  function signature(view) {
    return JSON.stringify([view.tab, view.sub?.[view.tab] || '', view.recipe || '',
      view.tab === 'gifts' ? view.hqGiftPerson : '', view.tab === 'gifts' ? view.hqEditGiftId : '',
      view.chat, view.game, view.overlay]);
  }
  const previous = history.state?.[KEY];
  const valid = value => value?.version === 1 && typeof value.session === 'string' &&
    Number.isInteger(value.depth) && value.depth >= 0 && value.view && ['home','gifts','plan','kitchen','magic','explore','games','chat','settings'].includes(value.view.tab);
  let current = valid(previous) ? previous : {
    version: 1, session: Date.now().toString(36) + Math.random().toString(36).slice(2),
    depth: 0, view: snapshot(), appStack: clone(navStack)
  };
  function write(push) {
    const state = { ...(history.state || {}), [KEY]: clone(current) };
    history[push ? 'pushState' : 'replaceState'](state, '');
  }
  function record() {
    if (restoring || pendingBack) return;
    const next = snapshot();
    const changed = signature(next) !== signature(current.view);
    // Closing a sheet using its X should consume the same entry as phone Back.
    if (changed && current.view.overlay && !next.overlay &&
        signature({ ...current.view, overlay: '' }) === signature(next)) {
      pendingBack = true; history.back(); return;
    }
    const replaceMenu = changed && current.view.overlay === '#bottomNav.nav-open' && !next.overlay;
    if (changed && !replaceMenu) current = { ...current, depth: current.depth + 1 };
    current.view = next; current.appStack = clone(navStack);
    try { write(changed && !replaceMenu); } catch (err) { console.warn('Phone Back history unavailable', err); }
  }
  function restore(view, stack) {
    restoring = true;
    try {
      // Use each sheet's own close control so scanners, focus and listeners are cleaned up.
      for (const [selector, closeSelector] of overlays) {
        const element = document.querySelector(selector);
        if (!element || selector === view.overlay) continue;
        const close = element.querySelector(closeSelector) || document.querySelector(closeSelector);
        close?.click();
      }
      Object.assign(ui, { tab: view.tab, sub: { ...ui.sub, ...view.sub }, recipe: view.recipe || '',
        category: view.category || 'All', search: view.search || '', allergyOpen: !!view.allergyOpen,
        hqGiftPerson: view.hqGiftPerson || '', hqEditGiftId: view.hqEditGiftId || '', secretRevealId: '' });
      navStack.splice(0, navStack.length, ...(Array.isArray(stack) ? clone(stack) : []));
      if (ui.tab === 'games') window.ChristmasHQGamesNavigation?.restore(view.game);
      if (ui.tab === 'chat' && view.chat) window.ChristmasHQChatNavigation?.restore(view.chat);
      render(true);
    } finally { restoring = false; }
    // Forward/reload cannot reconstruct a dismissed sheet; retain its underlying page.
    current.view = snapshot();
    try { write(false); } catch (err) { console.warn('Phone Back history unavailable', err); }
  }
  window.ChristmasHQPhoneBack = { record, get canBack() { return current.depth > 0; } };
  const previousRender = render;
  render = function (...args) { const result = previousRender.apply(this, args); record(); return result; };
  const previousBack = back;
  back = function () {
    if (pendingBack) return;
    if (current.depth > 0) { pendingBack = true; history.back(); }
    else previousBack();
  };
  window.addEventListener('popstate', event => {
    pendingBack = false;
    const entry = event.state?.[KEY];
    if (!valid(entry) || entry.session !== current.session) return; // Allow normal exit at the first page.
    current = entry;
    restore(current.view, current.appStack);
  });
  if (valid(previous)) restore(current.view, current.appStack);
  else { try { write(false); } catch (err) { console.warn('Phone Back history unavailable', err); } }
  new MutationObserver(record).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();
