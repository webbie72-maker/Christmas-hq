/* Christmas HQ — Full Page Slide Transitions v2 */
(() => {
  'use strict';

  if (window.__hqPanelTransitionsV2Loaded) return;
  window.__hqPanelTransitionsV2Loaded = true;

  let pendingDirection = null;
  let transitionBusy = false;

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

    if (current < 0 || target < 0) return 'forward';
    return target < current ? 'back' : 'forward';
  }

  function rememberDirection(event){
    const back = event.target.closest('[data-action="back"],[data-hq-chat-back]');
    if (back){
      pendingDirection = 'back';
      return;
    }

    const sub = event.target.closest('[data-action="sub"]');
    if (sub){
      pendingDirection = subDirection(sub);
      return;
    }

    const navButton = event.target.closest('[data-nav]');
    if (navButton && typeof ui !== 'undefined'){
      const from = tabIndex(ui.tab);
      const to = tabIndex(navButton.dataset.nav);
      if (from !== to){
        pendingDirection = to < from ? 'back' : 'forward';
      }
      return;
    }

    const forward = event.target.closest(
      '[data-action="recipe"],' +
      '[data-action="familyOpen"],' +
      '[data-action="guestOpen"],' +
      '[data-action="settings"],' +
      '[data-hq-chat-category],' +
      '[data-hq-chat-thread]'
    );

    if (forward){
      pendingDirection = 'forward';
    }
  }

  document.addEventListener('click', rememberDirection, true);

  function slideIn(direction){
    const screen = document.getElementById('screen');
    if (!screen) return;

    // Cancel any transition already running.
    screen.style.transition = 'none';
    screen.style.willChange = 'transform, opacity';

    const start = direction === 'back' ? '-100vw' : '100vw';

    screen.style.transform = `translate3d(${start},0,0)`;
    screen.style.opacity = '0.35';

    // Force the browser to apply the starting position first.
    void screen.offsetWidth;

    transitionBusy = true;

    requestAnimationFrame(() => {
      screen.style.transition =
        'transform 420ms cubic-bezier(.20,.80,.20,1), opacity 260ms ease-out';
      screen.style.transform = 'translate3d(0,0,0)';
      screen.style.opacity = '1';
    });

    const finish = () => {
      transitionBusy = false;
      screen.style.transition = '';
      screen.style.transform = '';
      screen.style.opacity = '';
      screen.style.willChange = '';
      screen.removeEventListener('transitionend', finish);
    };

    screen.addEventListener('transitionend', finish);

    // Safety cleanup in case transitionend is missed.
    setTimeout(() => {
      if (!transitionBusy) return;
      finish();
    }, 650);
  }

  const style = document.createElement('style');
  style.id = 'hq-panel-slide-v2-css';
  style.textContent = `
    html,body{
      overflow-x:hidden!important;
    }

    #screen{
      position:relative;
      backface-visibility:hidden;
      transform:translateZ(0);
    }
  `;
  document.head.appendChild(style);

  if (typeof render === 'function'){
    const previousRender = render;

    render = function(top = true){
      previousRender(top);

      if (!pendingDirection) return;

      const direction = pendingDirection;
      pendingDirection = null;

      requestAnimationFrame(() => {
        slideIn(direction);
      });
    };
  }

  // Other feature files can request a direction before calling render().
  window.hqPanelTransition = function(direction = 'forward'){
    pendingDirection = direction === 'back' ? 'back' : 'forward';
  };
})();
