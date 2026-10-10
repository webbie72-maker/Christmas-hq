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
      [/christmas menu/, ['kitchen', 'My menu']],
      [/desserts and cold food/, ['kitchen', 'Recipes']],
      [/food list|groceries|fresh-food shopping/, ['kitchen', 'Groceries']],
      [/cards\/messages/, ['chat', null]],
      [/charge camera and devices/, ['guide', null]],
      [/leftovers/, ['kitchen', 'Recipes']],
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

  // Wait briefly before navigation so the second tap can complete the task.
  const DOUBLE_TAP_MS = 360;
  let pending = null;
  function taskRow(target) {
    if (target.closest('input, button, a, label, select, textarea')) return null;
    const row = target.closest('.item');
    const check = row?.querySelector('[data-action="taskToggle"]');
    return check ? {row, check} : null;
  }
  function cancelPending() {
    if (pending) clearTimeout(pending.timer);
    pending = null;
  }
  function openTask(task) {
    const [tab, sub] = checklistDestination(task);
    if (tab !== 'guide') {
      // Set the subpanel explicitly, then scroll after all render decorators finish.
      go(tab, sub);
      if (sub && ui.sub[tab] !== sub) { ui.sub[tab] = sub; render(false); }
      if (tab === 'kitchen' && sub === 'Recipes') {
        ui.search = '';
        ui.category = /desserts and cold food/i.test(task.text) ? 'Desserts' : /leftovers/i.test(task.text) ? 'Leftovers' : 'All';
        render(false);
      }
      const selectors = {
        'plan:Budget': '[data-form="budget"]',
        'plan:Calendar': '[data-form="event"]',
        'plan:Guests': '[data-form="guest"]',
        'plan:Checklist': '[data-form="task"]',
        'gifts:My gifts': '[data-form="gift"]',
        'kitchen:Recipes': '#recipeLibrary',
        'kitchen:Groceries': '[data-form="shopping"]',
        'kitchen:Cook plan': '[data-form="cookSchedule"]',
        'magic:Music': '#christmasSongForm, #christmasSongList'
      };
      const route = tab + ':' + sub;
      const finish = () => {
        if (ui.tab !== tab || (sub && ui.sub[tab] !== sub)) return;
        const container = document.getElementById('screen');
        let destination = selectors[route] ? container.querySelector(selectors[route]) : null;
        if (!destination) {
          const selected = [...container.querySelectorAll('[data-action="sub"][data-tab]')]
            .find(button => button.dataset.tab === tab && button.dataset.value === sub);
          destination = selected?.closest('.subtabs')?.nextElementSibling;
        }
        if (!destination) destination = container.querySelector('.catalog, .hq-chat-shell, .card, .list');
        if (!destination) return;
        destination.classList.add('hq-checklist-destination');
        destination.scrollIntoView({block: 'start', behavior: 'instant'});
        setTimeout(() => destination.classList.remove('hq-checklist-destination'), 1800);
      };
      requestAnimationFrame(() => requestAnimationFrame(finish));
      // Rendering music/chat and the family scope banner can finish asynchronously.
      setTimeout(finish, 200);
      setTimeout(finish, 450);
      return;
    }
    // This practical task has no app section, so give it its own useful guide.
    const dialog = document.createElement('dialog');
    dialog.className = 'hq-task-guide';
    const heading = document.createElement('h3');
    heading.textContent = task.text;
    const text = document.createElement('p');
    text.textContent = 'Charge your phone, camera and spare batteries. Check storage space, pack the chargers and take a test photo before Christmas Eve.';
    const close = document.createElement('button');
    close.type = 'button'; close.className = 'btn'; close.textContent = 'Back to checklist';
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove());
    dialog.append(heading, text, close); document.body.appendChild(dialog); dialog.showModal();
  }
  function activate(event, immediate = false) {
    const found = taskRow(event.target);
    if (!found || typeof state === 'undefined' || typeof go !== 'function') return;
    const task = state.tasks.find(t => String(t.id) === String(found.check.dataset.id));
    if (!task) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (immediate) { cancelPending(); openTask(task); return; }
    if (pending && pending.task === task && pending.tasks === state.tasks) {
      cancelPending();
      // Use the existing checkbox change path, including shared-family saving.
      found.check.checked = !task.done;
      found.check.dispatchEvent(new Event('change', {bubbles: true}));
      if (typeof notice === 'function') notice(task.done ? 'Task marked done ✓' : 'Task marked to do');
      return;
    }
    cancelPending();
    const tasks = state.tasks;
    const tab = ui.tab;
    const sub = ui.sub[tab];
    pending = {task, tasks, timer: setTimeout(() => {
      pending = null;
      if (state.tasks === tasks && tasks.includes(task) && ui.tab === tab && ui.sub[tab] === sub) openTask(task);
    }, DOUBLE_TAP_MS)};
  }
  document.addEventListener('click', activate, true);
  document.addEventListener('dblclick', event => {
    if (taskRow(event.target)) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.repeat && event.target.matches('.hq-task-open')) activate(event, true);
  }, true);
  document.addEventListener('change', event => {
    if (event.target.matches('[data-action="taskToggle"]')) cancelPending();
  }, true);
  function decorate() {
    document.querySelectorAll('.item:has([data-action="taskToggle"]) .item-info').forEach(info => {
      if (info.classList.contains('hq-task-open')) return;
      info.classList.add('hq-task-open'); info.tabIndex = 0; info.setAttribute('role', 'button');
      info.setAttribute('aria-label', 'Open ' + (info.querySelector('b')?.textContent || 'task'));
    });
    if (typeof ui !== 'undefined' && ui.tab === 'plan' && ui.sub.plan === 'Checklist') {
      const list = document.querySelector('#screen .list');
      if (list && !document.getElementById('hqTaskTapHint')) {
        const hint = document.createElement('p'); hint.id = 'hqTaskTapHint'; hint.className = 'muted-note';
        hint.textContent = 'Tap a task to open it · Double tap to mark done or undo · Or use the checkbox';
        list.before(hint);
      }
    }
  }
  const style = document.createElement('style');
  style.textContent = '.item:has([data-action="taskToggle"]){cursor:pointer;touch-action:manipulation}.hq-checklist-destination{scroll-margin-top:18px;outline:2px solid #c4984d;outline-offset:5px}.hq-task-open{user-select:none}.hq-task-open:focus-visible{outline:3px solid #c4984d;outline-offset:4px;border-radius:6px}.hq-task-guide{max-width:420px;width:calc(100% - 36px);border:2px solid #c4984d;border-radius:20px;padding:24px;background:#fff8e5;color:#103b31}.hq-task-guide::backdrop{background:#103b3188}';
  document.head.appendChild(style);
  new MutationObserver(decorate).observe(document.getElementById('screen'), {childList: true, subtree: true});
  decorate();
})();
