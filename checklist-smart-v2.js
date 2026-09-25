/* Christmas HQ — Smart Checklist Links v2 */
(() => {
  'use strict';

  function destination(task) {
    const text = String(task?.text || '').toLowerCase();

    const rules = [
      [/overall christmas budget/, ['plan', 'Budget']],
      [/gift recipient list|christmas wishlist|buying gifts|special presents|wrapping paper|wrap the presents|post gifts/, ['gifts', 'My gifts']],
      [/secret santa/, ['gifts', 'Secret Santa']],
      [/christmas menu/, ['kitchen', 'Menu']],
      [/food list|groceries|fresh-food shopping|desserts and cold food|leftovers/, ['kitchen', 'Shopping']],
      [/christmas playlist/, ['magic', 'Music']],
      [/christmas lights trail/, ['explore', 'Light trail']],
      [/santa photos/, ['explore', 'Discover']],
      [/colour\/theme|decorations and lights|christmas tree/, ['explore', 'Decor ideas']],
      [/guest numbers|food needs/, ['plan', 'Guests']],
      [/get-together times|holiday leave|host\/location/, ['plan', 'Calendar']],
      [/christmas cards|camera and devices/, ['plan', 'Checklist']],
      [/christmas eve family activities|enjoy christmas day/, ['magic', 'Activities']]
    ];

    for (const [re, dest] of rules) {
      if (re.test(text)) return dest;
    }

    switch (task?.category) {
      case 'Gifts': return ['gifts', 'My gifts'];
      case 'Food': return ['kitchen', 'Recipes'];
      case 'Decor': return ['explore', 'Decor ideas'];
      case 'Budget': return ['plan', 'Budget'];
      case 'Family': return ['plan', 'Family'];
      default: return ['plan', 'Checklist'];
    }
  }

  if (typeof miniTask === 'function' && !window.__smartChecklistV2) {
    window.__smartChecklistV2 = true;

    miniTask = function(t) {
      const icon =
        t.category === 'Food' ? '🍽️' :
        t.category === 'Gifts' ? '🎁' :
        t.category === 'Decor' ? '🎄' :
        t.category === 'Budget' ? '💰' : '⭐';

      const due = new Date(t.date + 'T12:00:00')
        .toLocaleDateString('en-AU', { day:'numeric', month:'short' });

      return `
        <div class="item smart-task ${t.done ? 'is-done' : ''}" data-smart-task="${esc(t.id)}">
          <input class="tick" type="checkbox"
            data-action="taskToggle"
            data-id="${esc(t.id)}"
            aria-label="Complete ${esc(t.text)}"
            ${t.done ? 'checked' : ''}>

          <span class="item-icon">${icon}</span>

          <div class="item-info">
            <b>${esc(t.text)}</b>
            <small>${esc(t.category)} · ${due}</small>
          </div>

          <button type="button"
            class="btn small alt smart-open"
            data-smart-open="${esc(t.id)}"
            aria-label="Open ${esc(t.text)}">
            Open →
          </button>

          ${!t.preset ? `
            <button class="icon-action"
              aria-label="Delete task"
              data-action="taskDelete"
              data-id="${esc(t.id)}">×</button>` : ''}
        </div>`;
    };

    const style = document.createElement('style');
    style.textContent = `
      .smart-task{cursor:pointer}
      .smart-task .smart-open{
        flex:0 0 auto;
        margin-left:7px;
        white-space:nowrap;
      }
      @media (max-width:430px){
        .smart-task .smart-open{
          padding:9px 11px;
          font-size:12px;
        }
      }
    `;
    document.head.appendChild(style);

    // Re-render immediately so all existing checklist rows get the Open button.
    if (typeof render === 'function') render(false);
  }

  // Capture the Open button before the app's original generic button handler.
  document.addEventListener('click', event => {
    const openBtn = event.target.closest('[data-smart-open]');
    if (openBtn) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const task = state.tasks.find(
        t => String(t.id) === String(openBtn.dataset.smartOpen)
      );
      if (!task) return;

      const [tab, sub] = destination(task);
      go(tab, sub);
      return;
    }

    // Also allow tapping the wording / card itself.
    const row = event.target.closest('[data-smart-task]');
    if (!row) return;
    if (event.target.closest('input, button, a, label, select, textarea')) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const task = state.tasks.find(
      t => String(t.id) === String(row.dataset.smartTask)
    );
    if (!task) return;

    const [tab, sub] = destination(task);
    go(tab, sub);
  }, true);
})();
