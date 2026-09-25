/* Christmas HQ — checklist smart links */
(() => {
  'use strict';

  function checklistDestination(task) {
    const text = String(task?.text || '').toLowerCase();

    const exactRules = [
      [/secret santa/, ['gifts', 'Secret Santa']],
      [/christmas playlist/, ['magic', 'Music']],
      [/christmas lights trail/, ['explore', 'Light trail']],
      [/santa photos/, ['explore', 'Discover']],
      [/colour\/theme|decorations and lights|christmas tree/, ['explore', 'Decor ideas']],
      [/christmas menu/, ['kitchen', 'Menu']],
      [/food list|groceries|fresh-food shopping|desserts and cold food|leftovers/, ['kitchen', 'Shopping']],
      [/guest numbers|food needs/, ['plan', 'Guests']],
      [/get-together times|holiday leave|host\/location/, ['plan', 'Calendar']],
      [/gift recipient list|wishlist|buying gifts|special presents|wrapping paper|wrap the presents|post gifts/, ['gifts', 'My gifts']],
      [/christmas eve family activities|enjoy christmas day/, ['magic', 'Activities']]
    ];

    for (const [pattern, dest] of exactRules) {
      if (pattern.test(text)) return dest;
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

  document.addEventListener('click', event => {
    if (event.target.closest('input, button, a, label, select, textarea')) return;

    const row = event.target.closest('.item');
    if (!row) return;

    const check = row.querySelector('[data-action="taskToggle"]');
    if (!check) return;

    const task = typeof state !== 'undefined'
      ? state.tasks.find(t => String(t.id) === String(check.dataset.id))
      : null;

    if (!task || typeof go !== 'function') return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const [tab, sub] = checklistDestination(task);
    go(tab, sub);
  }, true);

  const style = document.createElement('style');
  style.textContent = `.item:has([data-action="taskToggle"]){cursor:pointer}`;
  document.head.appendChild(style);
})();
