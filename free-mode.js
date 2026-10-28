/* Christmas HQ — Free mode (for visitors arriving from ads via /free).
   Off unless the free-mode flag is set. Existing users (no flag) see no change.
   App data stays in 'christmas-hq-rebuilt-v1'; this file only uses its own keys. */
(() => {
 'use strict';

 /* ===== CONFIG =====
    FREE_UNLOCK_MODE controls the "Unlock the full version" button:
      'open'       → friendly screen, then switches this phone to the full version (clears the free flag). No payment.
      'comingsoon' → button reads "Full version coming soon"; tapping it shows a friendly Coming soon note. Stays in free mode (nothing clears the flag except the admin rule).
      'payment'    → sends them to FREE_UNLOCK_URL (future checkout page); stays in free mode until that page clears the flag. */
 const FREE_UNLOCK_MODE = 'comingsoon';
 const FREE_UNLOCK_URL = '';
 const FREE_KEY = 'christmas-hq-free-mode-v1';
 const UNLOCKED_KEY = 'christmas-hq-free-unlocked-v1';
 const ADMINS = new Set(['7f41d607-bc14-4ba6-83ad-4b92a94be55c', '73683ed7-20f5-4fad-a508-1878c78325ff']);

 const MAX_GIFT_PEOPLE = 3;
 const FREE_TABS = { // per page: sub-tabs that stay open
  gifts: ['My gifts', 'Gift ideas'],
  plan: ['Checklist', 'Budget'],
  kitchen: ['Recipes', 'My menu'],
  magic: ['Advent', 'Activities', 'Music'],
  explore: ['Discover']
 };
 const FREE_RECIPES = new Set(['ham', 'prawns', 'turkey', 'potatoes', 'dish-gravy', 'pavlova', 'trifle', 'pudding', 'dish-mince-pies', 'ginger']);
 const FREE_IDEAS = new Set(['Photo book', 'Leather wallet', 'Coffee mug', 'Phone case', 'Travel tag', 'Jewellery box']);
 const FREE_ACTIVITIES = new Set(['1', '3']);
 const FREE_DISCOVER = new Set(['christmas-lights-drive', 'christmas-markets', 'santa-experiences']);
 const FREE_HUB_GAMES = new Set(['arcade', 'trivia']);
 const FREE_ARCADE_GAMES = ['catch', 'trivia'];

 const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
 };

 // Entry: /free (or ?free=1) turns free mode on, unless this phone already unlocked.
 try {
  const path = location.pathname.replace(/\/+$/, '');
  if (/\/free$/.test(path) || new URLSearchParams(location.search).get('free') === '1') {
   if (!ls.get(UNLOCKED_KEY)) ls.set(FREE_KEY, '1');
   history.replaceState(null, '', path.replace(/\/free$/, '/') || '/');
  }
 } catch (e) {}

 const uid = () => window.ChristmasHQFamilyCloud?.session?.user?.id || '';
 const isAdmin = () => ADMINS.has(uid());
 let active = ls.get(FREE_KEY) === '1';

 window.ChristmasHQFree = {
  FREE_UNLOCK_MODE,
  active: () => active,
  arcadeGames: FREE_ARCADE_GAMES.slice(),
  showLock: (what) => showLock(what),
  openUnlock: () => showLock('')
 };
 if (!active) return; // Full version: nothing else runs.

 const S = () => document.getElementById('screen');
 const M = () => document.querySelector('header.mast, .mast');
 const curTab = () => (typeof ui !== 'undefined' ? ui.tab : 'home');
 const curSub = () => {
  const sel = S()?.querySelector('.subtabs button[data-action="sub"].selected');
  return sel ? sel.dataset.value : (typeof ui !== 'undefined' ? ui.sub?.[ui.tab] : '');
 };
 const subLocked = (tab, sub) => !!FREE_TABS[tab] && !!sub && !FREE_TABS[tab].includes(sub);
 const norm = s => String(s || '').trim().toLowerCase();
 const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

 const css = document.createElement('style');
 css.textContent = `
 .fm-badge{position:absolute;top:10px;left:10px;z-index:6;display:inline-flex;align-items:center;gap:4px;box-shadow:0 2px 6px rgba(0,0,0,.25);padding:4px 9px;border-radius:999px;border:1px solid #e7c56a;background:#fff8df;color:#17614f;font:800 10px/1.1 system-ui,sans-serif;letter-spacing:.03em;white-space:nowrap;cursor:pointer;flex:0 0 auto}
 .fm-tab-lock{font-size:.85em;margin-left:3px;opacity:.85}
 .fm-locked{position:relative!important;overflow:hidden}
 .fm-locked>*:not(.fm-lock-tag){opacity:.45;filter:grayscale(.35)}
 .fm-lock-tag{position:absolute;right:8px;top:8px;padding:3px 8px;border-radius:999px;background:#17614f;color:#fff8df;font:800 10px/1.2 system-ui,sans-serif;border:1px solid #e7c56a;pointer-events:none;z-index:3;white-space:nowrap}
 .fm-inline{text-align:center}
 .fm-inline .fm-big{font-size:38px;line-height:1}
 .fm-inline p{color:#5f4b26!important}
 .fm-sheet .eyebrow{color:#e7c56a!important}
 .fm-lockcard{text-align:center;background:linear-gradient(145deg,#17614f,#0b463a)!important;border:2px solid #e7c56a!important;color:#fff8df!important}
 .fm-lockcard h3{color:#fff8df!important;margin:6px 0}
 .fm-lockcard p{color:#f3e2b0!important}
 .fm-lockcard .fm-big{font-size:38px;line-height:1}
 .fm-sheet{position:fixed;inset:0;z-index:100000;background:rgba(6,30,24,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}
 .fm-sheet .card{width:100%;max-width:440px;max-height:88vh;overflow:auto;margin:0;box-sizing:border-box}
 .fm-sheet ul{text-align:left;margin:10px 0;padding-left:20px;color:#fff8df}
 .fm-sheet li{margin:4px 0;font-size:14px}
 .fm-sheet .btn{width:100%;margin-top:10px;box-sizing:border-box}
 `;
 document.head.appendChild(css);

 const LABEL = {
  gifts: 'Secret Santa', plan: 'This planner tool', kitchen: 'This kitchen tool', magic: 'This bit of Christmas magic',
  explore: 'This explorer', chat: 'Family chat', games: 'This game', recipe: 'This recipe', idea: 'More gift ideas',
  activity: 'This activity', discover: 'This adventure', giftpeople: 'More than 3 people'
 };
 function lockCardHtml(title, msg) {
  return `<div class="card fm-inline" data-fm-lockcard="1"><div class="fm-big">🔒</div><div class="eyebrow">FREE VERSION</div><h3>${esc(title)}</h3><p class="muted-note">${esc(msg || 'Unlock the full version to open everything in Christmas HQ.')}</p><button class="btn" type="button" data-fm-unlock="1" style="background:#e7c56a;color:#0b463a">✨ Unlock the full version</button></div>`;
 }

 function showLock(what, extra) {
  closeSheet();
  const title = what ? (LABEL[what] || what) + ' is in the full version' : 'Unlock the full version';
  const msg = extra || 'You’re using the free version of Christmas HQ. The full version opens every tool, recipe and game.';
  const sh = document.createElement('div');
  sh.className = 'fm-sheet'; sh.id = 'fmSheet';
  sh.innerHTML = `<div class="card fm-lockcard" role="dialog" aria-modal="true" aria-label="Unlock the full version"><div class="fm-big">🎄</div><div class="eyebrow" style="color:#e7c56a">FREE VERSION</div><h3>${esc(title)}</h3><p class="muted-note">${esc(msg)}</p>
  <ul><li>🎁 Unlimited gift people, all gift ideas &amp; Secret Santa</li><li>📅 Calendar, family &amp; guest lists</li><li>🍽️ All recipes, groceries &amp; cook plan</li><li>🎅 Movie night, Santa letter, Elf on the Shelf</li><li>🎮 Every game &amp; family chat</li></ul>
  <button class="btn" type="button" data-fm-go="1" style="background:#e7c56a;color:#0b463a">${FREE_UNLOCK_MODE === 'comingsoon' ? '✨ Full version coming soon' : '✨ Unlock the full version'}</button><p class="muted-note" id="fmSoonNote" role="status" style="display:none;margin:10px 0 0;font-weight:700">🎄 Coming soon! We’ll let you know when the full version is ready.</p>
  <button class="btn alt" type="button" data-fm-close="1">Keep using the free version</button></div>`;
  document.body.appendChild(sh);
 }
 function closeSheet() { document.getElementById('fmSheet')?.remove(); }

 function unlockNow() {
  if (FREE_UNLOCK_MODE === 'payment' && FREE_UNLOCK_URL) { location.href = FREE_UNLOCK_URL; return; }
  if (FREE_UNLOCK_MODE === 'comingsoon') { const n = document.getElementById('fmSoonNote'); if (n) n.style.display = 'block'; return; }
  if (FREE_UNLOCK_MODE !== 'open') return;
  closeSheet();
  const sh = document.createElement('div');
  sh.className = 'fm-sheet'; sh.id = 'fmSheet';
  sh.innerHTML = `<div class="card fm-lockcard" role="dialog" aria-modal="true"><div class="fm-big">🎉</div><div class="eyebrow" style="color:#e7c56a">MERRY CHRISTMAS</div><h3>You’ve got the full Christmas HQ!</h3><p class="muted-note">Everything is now open on this phone — every recipe, game and planning tool. Your lists and plans are all still here.</p><button class="btn" type="button" data-fm-done="1" style="background:#e7c56a;color:#0b463a">Start exploring 🎄</button></div>`;
  document.body.appendChild(sh);
  deactivate(true);
 }

 function deactivate(markUnlocked) {
  ls.del(FREE_KEY);
  if (markUnlocked) ls.set(UNLOCKED_KEY, String(Date.now()));
  active = false;
  mo.disconnect();
  document.querySelectorAll('.fm-badge,.fm-tab-lock,.fm-lock-tag,[data-fm-lockcard]').forEach(e => e.remove());
  document.querySelectorAll('.fm-locked').forEach(e => e.classList.remove('fm-locked'));
  try { if (curTab() === 'games') { const f = document.getElementById('hqArcadeFrame'); if (f) f.contentWindow.location.reload(); } } catch (e) {}
  try { typeof render === 'function' && curTab() !== 'games' && render(false); } catch (e) {}
  try { if (curTab() === 'games') document.querySelector('#bottomNav [data-nav="games"]')?.click(); } catch (e) {}
 }

 // ----- Gifts: 3 people -----
 let allowedPeople = null;
 function giftPeople() { return new Set((typeof state !== 'undefined' ? state.gifts : []).map(g => norm(g.recipient)).filter(Boolean)); }
 function ensureAllowed() { if (!allowedPeople) allowedPeople = giftPeople(); return allowedPeople; }
 function canAddPerson(name) { const a = ensureAllowed(); const n = norm(name); return !n || a.has(n) || a.size < MAX_GIFT_PEOPLE; }
 const giftMsg = 'The free version plans gifts for up to 3 people. Unlock the full version to add everyone on your list.';
 if (typeof window.persist === 'function') {
  const orig = window.persist;
  window.persist = function (msg) {
   if (active && typeof state !== 'undefined' && Array.isArray(state.gifts)) {
    const a = ensureAllowed(); let blocked = false;
    // process oldest first so earlier people keep their place
    for (const g of [...state.gifts].reverse()) { const n = norm(g.recipient); if (!n || a.has(n)) continue; if (a.size < MAX_GIFT_PEOPLE) a.add(n); else { blocked = true; } }
    if (blocked) { state.gifts = state.gifts.filter(g => { const n = norm(g.recipient); return !n || a.has(n); }); setTimeout(() => showLock('giftpeople', giftMsg), 0); msg = ''; }
   }
   return orig.call(this, msg);
  };
 }
 document.addEventListener('submit', e => {
  if (!active) return;
  const f = e.target;
  if (f?.matches?.('form[data-form="gift"]')) {
   const r = f.querySelector('[name="recipient"]')?.value;
   if (!canAddPerson(r)) { e.preventDefault(); e.stopImmediatePropagation(); showLock('giftpeople', giftMsg); }
  }
 }, true);

 // ----- Clicks -----
 window.addEventListener('click', e => {
  const t = e.target;
  if (!t || !t.closest) return;
  if (t.closest('[data-fm-close]')) { closeSheet(); return; }
  if (t.closest('[data-fm-done]')) { closeSheet(); return; }
  if (t.closest('[data-fm-go]')) { e.preventDefault(); unlockNow(); return; }
  if (!active) return;
  const block = what => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); showLock(what); };
  if (t.closest('[data-fm-unlock],.fm-badge')) return block('');
  const locked = t.closest('.fm-locked');
  if (locked) return block(locked.dataset.fmWhat || '');
  const sub = t.closest('[data-action="sub"][data-tab]');
  if (sub && subLocked(sub.dataset.tab, sub.dataset.value)) return block(sub.dataset.tab === 'gifts' ? 'gifts' : sub.dataset.value);
  const tgt = t.closest('[data-target][data-value]');
  if (tgt && subLocked(tgt.dataset.target, tgt.dataset.value)) return block(tgt.dataset.value);
  if (t.closest('[data-nav="chat"]')) return block('chat');
  const g = t.closest('[data-hq-game]');
  if (g && !FREE_HUB_GAMES.has(g.dataset.hqGame)) return block('games');
  const r = t.closest('[data-action="recipe"][data-id]');
  if (r && !FREE_RECIPES.has(r.dataset.id)) return block('recipe');
  const id = t.closest('[data-action="idea"][data-name]');
  if (id && !FREE_IDEAS.has(id.dataset.name)) return block('idea');
 }, true);

 // ----- Decorate after each render -----
 function lockEl(el, what) { if (el && !el.classList.contains('fm-locked')) { el.classList.add('fm-locked'); el.dataset.fmWhat = what; el.insertAdjacentHTML('beforeend', '<span class="fm-lock-tag" aria-hidden="true">🔒 Full version</span>'); } }
 function replaceAfterSubtabs(title, msg) {
  const s = S(); if (!s) return;
  const tabs = s.querySelector('.subtabs button[data-action="sub"]')?.closest('.subtabs');
  if (s.querySelector('[data-fm-lockcard]')) {
   // remove anything other code added later
   let el = s.querySelector('[data-fm-lockcard]');
   while (el.nextElementSibling) el.nextElementSibling.remove();
   return;
  }
  let node = tabs || null;
  if (node) {
   let cur = node;
   while (cur && cur !== s) { while (cur.nextElementSibling) cur.nextElementSibling.remove(); cur = cur.parentElement; }
   (tabs.parentElement === s ? tabs : (function f(n) { while (n.parentElement !== s) n = n.parentElement; return n; })(tabs)).insertAdjacentHTML('afterend', lockCardHtml(title, msg));
  } else {
   s.innerHTML = lockCardHtml(title, msg);
  }
 }
 function decorate() {
  if (!active) return;
  if (isAdmin()) { deactivate(false); return; }
  mo.disconnect();
  try {
   const mast = M();
   if (mast && !mast.querySelector(':scope > .fm-badge')) {
    if (getComputedStyle(mast).position === 'static') mast.style.position = 'relative';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'fm-badge'; b.textContent = '✨ Free version'; b.setAttribute('aria-label', 'Free version — tap to unlock the full version');
    mast.prepend(b);
   }
   const s = S(); if (!s) return;
   const tab = curTab();
   s.querySelectorAll('.subtabs button[data-action="sub"][data-tab]').forEach(b => {
    if (subLocked(b.dataset.tab, b.dataset.value) && !b.querySelector('.fm-tab-lock')) b.insertAdjacentHTML('beforeend', '<span class="fm-tab-lock" aria-hidden="true">🔒</span>');
   });
   if (tab === 'chat') { if (!s.querySelector('[data-fm-lockcard]')) s.innerHTML = lockCardHtml('Family chat is in the full version', 'Chat with your family right inside Christmas HQ when you unlock the full version.'); }
   else if (tab === 'kitchen' && typeof ui !== 'undefined' && ui.recipe && !FREE_RECIPES.has(ui.recipe)) {
    if (!s.querySelector('[data-fm-lockcard]')) s.innerHTML = lockCardHtml('This recipe is in the full version', 'The free version includes 10 Christmas favourites. Unlock the full version for all 155 recipes.') + '<button class="btn alt full" data-action="sub" data-tab="kitchen" data-value="Recipes" style="margin-top:12px">← Back to free recipes</button>';
   }
   else if (subLocked(tab, curSub())) replaceAfterSubtabs((tab === 'gifts' ? 'Secret Santa' : curSub()) + ' is in the full version');
   s.querySelectorAll('.recipe-card[data-id]').forEach(c => { if (!FREE_RECIPES.has(c.dataset.id)) lockEl(c, 'recipe'); });
   // show the free recipes first within each list
   new Set([...s.querySelectorAll('.recipe-card[data-id]')].map(c => c.parentElement)).forEach(par => {
    if (par.dataset.fmSorted) return; par.dataset.fmSorted = '1';
    const free = [...par.children].filter(c => c.matches('.recipe-card[data-id]') && !c.classList.contains('fm-locked'));
    const first = [...par.children].find(c => c.matches('.recipe-card[data-id]'));
    free.reverse().forEach(c => { if (first && c !== first) par.insertBefore(c, par.querySelector('.recipe-card[data-id]')); });
   });
   s.querySelectorAll('[data-action="idea"][data-name]').forEach(b => { if (!FREE_IDEAS.has(b.dataset.name)) lockEl(b.closest('.catalog-card') || b, 'idea'); });
   if (tab === 'magic') s.querySelectorAll('[data-action="activity"][data-index]').forEach(b => { if (!FREE_ACTIVITIES.has(b.dataset.index)) lockEl(b.closest('.catalog-card') || b, 'activity'); });
   if (tab === 'explore') s.querySelectorAll('.tap-card[data-ed-id]').forEach(c => { if (!FREE_DISCOVER.has(c.dataset.edId)) lockEl(c, 'discover'); });
   if (tab === 'games') s.querySelectorAll('[data-hq-game]').forEach(c => { if (!FREE_HUB_GAMES.has(c.dataset.hqGame)) lockEl(c, 'games'); });
   document.querySelectorAll('#bottomNav [data-nav="chat"]').forEach(b => { if (!b.querySelector('.fm-tab-lock')) b.querySelector('span')?.insertAdjacentHTML('beforeend', '<span class="fm-tab-lock" aria-hidden="true">🔒</span>'); });
  } finally { observe(); }
 }
 let queued = false;
 const mo = new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; decorate(); }); });
 function observe() { if (!active) return; [S(), document.getElementById('bottomNav')].forEach(n => n && mo.observe(n, { childList: true, subtree: true })); const m = M(); m && mo.observe(m, { childList: true }); }
 decorate();
 let n = 0; const iv = setInterval(() => { if (!active || ++n > 60) return clearInterval(iv); if (isAdmin()) deactivate(false); }, 1000);
})();
