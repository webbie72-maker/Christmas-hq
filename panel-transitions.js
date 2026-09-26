/* Christmas HQ — Directional Panel Transitions */
(() => {
  'use strict';
  if (window.__hqPanelTransitionsLoaded) return;
  window.__hqPanelTransitionsLoaded = true;

  let pendingDirection = null;
  let animating = false;

  const TAB_ORDER = [
    'home','gifts','plan','kitchen','magic','games','chat','explore','settings'
  ];

  function tabIndex(name){
    const i = TAB_ORDER.indexOf(String(name || ''));
    return i < 0 ? 0 : i;
  }

  function subDirection(button){
    const wrap = button?.closest('.subtabs');
    if (!wrap) return 'forward';

    const buttons = [...wrap.querySelectorAll('button')];
    const current = buttons.findIndex(btn =>
      btn.classList.contains('selected') ||
      btn.getAttribute('aria-selected') === 'true'
    );
    const target = buttons.indexOf(button);

    return target < current ? 'back' : 'forward';
  }

  function rememberDirection(event){
    if (event.target.closest('[data-action="back"],[data-hq-chat-back]')){
      pendingDirection = 'back';
      return;
    }

    const sub = event.target.closest('[data-action="sub"]');
    if (sub){
      pendingDirection = subDirection(sub);
      return;
    }

    const bottom = event.target.closest('[data-nav]');
    if (bottom && typeof ui !== 'undefined'){
      const from = tabIndex(ui.tab);
      const to = tabIndex(bottom.dataset.nav);
      if (from !== to) pendingDirection = to < from ? 'back' : 'forward';
      return;
    }

    if (event.target.closest(
      '[data-action="recipe"],' +
      '[data-action="familyOpen"],' +
      '[data-action="guestOpen"],' +
      '[data-action="settings"],' +
      '[data-hq-chat-category],' +
      '[data-hq-chat-thread]'
    )){
      pendingDirection = 'forward';
    }
  }

  document.addEventListener('click', rememberDirection, true);

  function animateScreen(direction){
    const screen = document.getElementById('screen');
    if (!screen || animating) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    animating = true;

    // Forward pages enter from the right. Back pages enter from the left.
    const startX = direction === 'back' ? '-44px' : '44px';

    const animation = screen.animate(
      [
        { transform:`translate3d(${startX},0,0)`, opacity:.18 },
        { transform:'translate3d(0,0,0)', opacity:1 }
      ],
      {
        duration:290,
        easing:'cubic-bezier(.22,.82,.32,1)',
        fill:'both'
      }
    );

    animation.onfinish = () => {
      animating = false;
      try { animation.cancel(); } catch(e) {}
    };

    animation.oncancel = () => {
      animating = false;
    };
  }

  if (typeof render === 'function'){
    const previousRender = render;

    render = function(top = true){
      previousRender(top);

      if (pendingDirection){
        const direction = pendingDirection;
        pendingDirection = null;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => animateScreen(direction));
        });
      }
    };
  }

  window.hqPanelTransition = function(direction = 'forward'){
    pendingDirection = direction === 'back' ? 'back' : 'forward';
  };
})();
