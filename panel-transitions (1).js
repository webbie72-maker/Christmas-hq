/* Christmas HQ — Reliable Directional Panel Slides v3 */
(() => {
  'use strict';
  if (window.__hqPanelTransitionsV3Loaded) return;
  window.__hqPanelTransitionsV3Loaded = true;

  let pendingDirection = null;
  let slideTimer = null;

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
    if (event.target.closest('[data-action="back"],[data-hq-chat-back]')){
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
      if (from !== to) pendingDirection = to < from ? 'back' : 'forward';
      return;
    }

    if (event.target.closest(
      '[data-action="recipe"],' +
      '[data-action="recipeBack"],' +
      '[data-action="familyOpen"],' +
      '[data-action="familyEdit"],' +
      '[data-action="guestOpen"],' +
      '[data-action="settings"],' +
      '[data-hq-chat-category],' +
      '[data-hq-chat-thread]'
    )){
      pendingDirection = event.target.closest('[data-action="recipeBack"]')
        ? 'back' : 'forward';
    }
  }

  document.addEventListener('click', rememberDirection, true);

  function slide(direction){
    const screen = document.getElementById('screen');
    if (!screen) return;

    clearTimeout(slideTimer);
    const startX = direction === 'back' ? '-88vw' : '88vw';

    screen.getAnimations?.().forEach(a => {
      try { a.cancel(); } catch(e) {}
    });

    screen.style.willChange = 'transform, opacity';

    const animation = screen.animate(
      [
        { transform:`translate3d(${startX},0,0)`, opacity:.22 },
        { transform:'translate3d(0,0,0)', opacity:1 }
      ],
      {
        duration:430,
        easing:'cubic-bezier(.18,.82,.28,1)',
        fill:'both'
      }
    );

    const clean = () => {
      screen.style.willChange = '';
      try { animation.cancel(); } catch(e) {}
    };

    animation.onfinish = clean;
    slideTimer = setTimeout(clean, 600);
  }

  function watchScreen(){
    const screen = document.getElementById('screen');
    if (!screen) {
      setTimeout(watchScreen, 100);
      return;
    }

    const observer = new MutationObserver(() => {
      if (!pendingDirection) return;
      const direction = pendingDirection;
      pendingDirection = null;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => slide(direction));
      });
    });

    observer.observe(screen, {
      childList:true,
      subtree:false
    });
  }

  const style = document.createElement('style');
  style.id = 'hq-panel-slide-v3-css';
  style.textContent = `
    html, body{ overflow-x:hidden!important; }
    #screen{
      position:relative;
      backface-visibility:hidden;
      transform:translateZ(0);
      contain:paint;
    }
  `;
  document.head.appendChild(style);

  watchScreen();

  window.hqPanelTransition = function(direction='forward'){
    pendingDirection = direction === 'back' ? 'back' : 'forward';
  };
})();
