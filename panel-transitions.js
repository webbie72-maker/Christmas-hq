/* Christmas HQ - Panel Transitions v3
   Slides the current page out BEFORE Christmas HQ replaces #screen,
   then slides the new page in. Designed for the existing global render/go/back functions.
*/
(function () {
  'use strict';

  const OUT_MS = 170;
  const IN_MS = 260;
  const DISTANCE = '102vw';
  const TAB_ORDER = ['home', 'gifts', 'plan', 'kitchen', 'magic', 'explore'];

  let pendingDirection = null; // 'forward' | 'back'
  let busy = false;
  let queuedRender = null;

  function currentTabFromNav() {
    const current = document.querySelector('#bottomNav button.current, #bottomNav button[aria-current="page"]');
    return current && current.dataset ? current.dataset.nav : null;
  }

  function directionForTab(target) {
    const current = currentTabFromNav();
    const a = TAB_ORDER.indexOf(current);
    const b = TAB_ORDER.indexOf(target);
    if (a < 0 || b < 0 || a === b) return 'forward';
    return b > a ? 'forward' : 'back';
  }

  function markDirectionFromButton(btn) {
    if (!btn) return;

    if (btn.dataset.nav) {
      pendingDirection = directionForTab(btn.dataset.nav);
      return;
    }

    const action = btn.dataset.action || '';
    if (action === 'back' || action === 'recipeBack') {
      pendingDirection = 'back';
      return;
    }

    if (
      action === 'settings' ||
      action === 'shortcut' ||
      action === 'sub' ||
      action === 'recipe' ||
      action === 'recipeJump'
    ) {
      pendingDirection = 'forward';
    }
  }

  // Run before Christmas HQ's normal click handler so render() knows the direction.
  document.addEventListener('click', function (event) {
    markDirectionFromButton(event.target.closest('button'));
  }, true);

  function resetElement(el) {
    if (!el) return;
    el.getAnimations().forEach(function (a) { try { a.cancel(); } catch (_) {} });
    el.style.transform = '';
    el.style.opacity = '';
    el.style.willChange = '';
  }

  function animate(el, keyframes, options) {
    if (!el || typeof el.animate !== 'function') return Promise.resolve();
    try {
      const a = el.animate(keyframes, options);
      return a.finished.catch(function () {});
    } catch (_) {
      return Promise.resolve();
    }
  }

  function install() {
    if (typeof window.render !== 'function') {
      setTimeout(install, 50);
      return;
    }

    if (window.__christmasHQPanelTransitionsV3) return;
    window.__christmasHQPanelTransitionsV3 = true;

    const originalRender = window.render;

    // Prevent horizontal scrollbars while a full-width page is moving.
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    window.render = function (top) {
      const args = arguments;
      const direction = pendingDirection;
      pendingDirection = null;

      // Ordinary re-renders (typing, filters, tick boxes, saves) stay instant.
      if (!direction) {
        return originalRender.apply(this, args);
      }

      const run = () => {
        const screen = document.getElementById('screen');
        if (!screen) return originalRender.apply(this, args);

        if (busy) {
          queuedRender = { ctx: this, args: Array.from(args), direction: direction };
          return;
        }

        busy = true;
        screen.style.willChange = 'transform, opacity';

        const exitX = direction === 'back' ? DISTANCE : '-' + DISTANCE;
        const enterX = direction === 'back' ? '-' + DISTANCE : DISTANCE;

        animate(screen, [
          { transform: 'translate3d(0,0,0)', opacity: 1 },
          { transform: 'translate3d(' + exitX + ',0,0)', opacity: 0.94 }
        ], {
          duration: OUT_MS,
          easing: 'cubic-bezier(.4,0,1,1)',
          fill: 'forwards'
        }).then(function () {
          resetElement(screen);

          // NOW swap the page, after the old page has visibly left.
          originalRender.apply(null, args);

          const fresh = document.getElementById('screen');
          if (!fresh) {
            busy = false;
            return;
          }

          fresh.style.willChange = 'transform, opacity';
          return animate(fresh, [
            { transform: 'translate3d(' + enterX + ',0,0)', opacity: 0.94 },
            { transform: 'translate3d(0,0,0)', opacity: 1 }
          ], {
            duration: IN_MS,
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'forwards'
          }).then(function () {
            resetElement(fresh);
            busy = false;

            if (queuedRender) {
              const q = queuedRender;
              queuedRender = null;
              pendingDirection = q.direction;
              window.render.apply(q.ctx, q.args);
            }
          });
        }).catch(function () {
          resetElement(screen);
          try { originalRender.apply(null, args); } catch (_) {}
          busy = false;
        });
      };

      // Let the click event complete before starting the page motion.
      requestAnimationFrame(run);
    };
  }

  install();
})();
