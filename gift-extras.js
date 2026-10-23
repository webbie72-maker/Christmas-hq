/* Christmas HQ — gift extras: Australia Post posting dates + full backup/restore.
   Everything is guarded: if anything here fails, the original screens still render. */
(function () {
  'use strict';
  if (window.__hqGiftExtras) return;
  window.__hqGiftExtras = true;

  var DISMISS_KEY = 'christmas-hq-posting-dismissed-v1';
  var SOURCE_URL = 'https://auspost.com.au/personal/sending/christmas-sending-dates';
  var BACKUP_APP = 'christmas-hq-backup';

  function safe(fn, fallback) {
    try { return fn(); } catch (err) {
      try { console.warn('Christmas HQ extras', err); } catch (_) {}
      return fallback;
    }
  }

  function escHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- 1. Last posting dates (Perth / WA, metro) ----------------
     Source: Australia Post "Christmas cut-off dates" page, checked 23 Oct 2026.
     Over-the-counter items must be lodged by 2.30pm; regional/remote needs longer. */
  var POSTING = [
    { id: 'wa-parcel', icon: '📦', label: 'Parcel Post within WA', date: [2026, 12, 22] },
    { id: 'wa-cards',  icon: '💌', label: 'Cards & letters within WA', date: [2026, 12, 21] },
    { id: 'wa-express', icon: '🚀', label: 'Express Post from WA', date: [2026, 12, 22] },
    { id: 'east-parcel', icon: '📦', label: 'Parcel Post to NSW, ACT, Vic & SA', date: [2026, 12, 18] },
    { id: 'east-cards', icon: '💌', label: 'Cards & letters interstate', date: [2026, 12, 18] },
    { id: 'qld-parcel', icon: '📦', label: 'Parcel Post to Queensland', date: [2026, 12, 17] },
    { id: 'tas-parcel', icon: '📦', label: 'Parcel Post to Tasmania', date: [2026, 12, 16] },
    { id: 'nt-parcel', icon: '📦', label: 'Parcel Post to Northern Territory', date: [2026, 12, 14] }
  ];

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function readDismissed() {
    return safe(function () {
      var parsed = JSON.parse(localStorage.getItem(DISMISS_KEY) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    }, {});
  }

  function writeDismissed(map) {
    try { localStorage.setItem(DISMISS_KEY, JSON.stringify(map)); } catch (_) {}
  }

  function daysUntil(parts) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var target = new Date(parts[0], parts[1] - 1, parts[2]);
    return Math.round((target - today) / 86400000);
  }

  function togo(days) {
    if (days < 0) return 'passed';
    if (days === 0) return 'today!';
    if (days === 1) return '1 day to go';
    return days + ' days to go';
  }

  function postingCard() {
    var today = new Date();
    if (today.getFullYear() !== 2026) return '';

    var dismissed = readDismissed();
    var showAll = !!(typeof ui !== 'undefined' && ui.hqPostShowAll);
    var hidden = POSTING.filter(function (row) { return dismissed[row.id]; }).length;

    var rows = POSTING.filter(function (row) {
      return showAll || !dismissed[row.id];
    }).map(function (row) {
      var d = row.date;
      var days = daysUntil(d);
      var dt = new Date(d[0], d[1] - 1, d[2]);
      var tone = days < 0 ? 'past' : days <= 7 ? 'soon' : 'ok';
      var done = !!dismissed[row.id];
      return '<div class="hq-post-row tone-' + tone + (done ? ' is-done' : '') + '">' +
        '<button type="button" class="hq-post-tick' + (done ? ' on' : '') + '" data-hq-post-tick="' + escHtml(row.id) + '"' +
        ' aria-pressed="' + (done ? 'true' : 'false') + '"' +
        ' aria-label="' + (done ? 'Show again: ' : 'Done, hide: ') + escHtml(row.label) + '">' + (done ? '✓' : '') + '</button>' +
        '<div class="hq-post-info"><b>' + row.icon + ' ' + escHtml(row.label) + '</b>' +
        '<small>' + DAYS[dt.getDay()] + ' ' + d[2] + ' ' + MONTHS[d[1] - 1] +
        ' · <span class="hq-post-days">' + escHtml(togo(days)) + '</span></small></div></div>';
    }).join('');

    var empty = rows ? '' : '<p class="muted-note" style="margin:6px 0 0">All ticked off — nice work! 🎄</p>';
    var toggle = hidden
      ? '<button type="button" class="hq-post-link" data-hq-post-toggle>' +
        (showAll ? 'Hide ticked items' : 'Show ' + hidden + ' ticked item' + (hidden === 1 ? '' : 's')) + '</button>'
      : '';

    return '<div class="card hq-post-card" id="hqPostingCard">' +
      '<div class="eyebrow">POSTING GIFTS</div>' +
      '<h3>📮 Last posting dates · Perth &amp; WA</h3>' +
      '<p class="muted-note" style="margin:4px 0 10px">Last days to post from a Perth metro Post Office for Christmas. ' +
      'Over-the-counter items by 2.30pm; regional or remote areas need extra days.</p>' +
      '<div class="hq-post-list">' + rows + '</div>' + empty + toggle +
      '<p class="hq-post-foot">Dates are a guide only and can change. Check ' +
      '<a href="' + SOURCE_URL + '" target="_blank" rel="noopener">Australia Post’s Christmas dates ↗</a> before you post. ' +
      'Checked 23 Oct 2026.</p></div>';
  }

  /* ---------------- 2. Backup & restore ---------------- */
  var EXCLUDE = /([-_:]pin|pin[-_:]|pin$|pattern|[-_:]lock|lock[-_:]|auth|session|token|supabase|password|secret|family-id|cloud|draft|refresh|welcome-tour|terms-ack)/i;

  function isBackupKey(key) {
    return typeof key === 'string' && /^christmas-?hq/i.test(key) && !EXCLUDE.test(key);
  }

  function collectBackup() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (isBackupKey(key)) data[key] = localStorage.getItem(key);
    }
    return { app: BACKUP_APP, version: 1, createdAt: new Date().toISOString(), data: data };
  }

  function backupFileName() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return 'christmas-hq-backup-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json';
  }

  function makeBackupFile() {
    var json = JSON.stringify(collectBackup(), null, 2);
    return { json: json, name: backupFileName() };
  }

  function downloadBackup() {
    var file = makeBackupFile();
    var blob = new Blob([file.json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 4000);
    window.notice && window.notice('Backup saved to your Downloads ✓');
  }

  function canShareFiles() {
    return safe(function () {
      if (!navigator.canShare || !navigator.share || typeof File !== 'function') return false;
      return navigator.canShare({ files: [new File(['{}'], 'x.json', { type: 'application/json' })] });
    }, false);
  }

  function shareBackup() {
    var file = makeBackupFile();
    var f = new File([file.json], file.name, { type: 'application/json' });
    navigator.share({ files: [f], title: 'Christmas HQ backup' }).then(function () {
      window.notice && window.notice('Backup shared ✓');
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return;
      window.notice && window.notice('Could not share. Try “Back up my Christmas HQ”.');
    });
  }

  function validateBackup(parsed) {
    if (!parsed || typeof parsed !== 'object' || parsed.app !== BACKUP_APP || parsed.version !== 1 ||
        !parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
      throw new Error('That file is not a Christmas HQ backup.');
    }
    var keys = Object.keys(parsed.data).filter(isBackupKey);
    if (!keys.length) throw new Error('That backup has no saved data in it.');
    keys.forEach(function (key) {
      if (typeof parsed.data[key] !== 'string') throw new Error('The backup file looks damaged.');
    });
    var main = parsed.data['christmas-hq-rebuilt-v1'];
    var summary = { gifts: 0, tasks: 0 };
    if (main != null) {
      var obj;
      try { obj = JSON.parse(main); } catch (_) { throw new Error('The main Christmas data in this backup is damaged.'); }
      if (!obj || typeof obj !== 'object' || !Array.isArray(obj.tasks) || !Array.isArray(obj.gifts)) {
        throw new Error('The main Christmas data in this backup is damaged.');
      }
      summary.gifts = obj.gifts.length;
      summary.tasks = obj.tasks.length;
    }
    return { keys: keys, summary: summary };
  }

  function restoreFromText(text) {
    var parsed;
    try { parsed = JSON.parse(text); } catch (_) { throw new Error('That file is not valid JSON.'); }
    var info = validateBackup(parsed);
    var when = parsed.createdAt ? new Date(parsed.createdAt) : null;
    var whenText = when && !isNaN(when.getTime()) ? ' from ' + when.toLocaleDateString('en-AU') : '';
    var ok = confirm('Replace everything saved on this phone with the backup' + whenText + '?\n\n' +
      info.summary.gifts + ' gifts and ' + info.summary.tasks + ' tasks.\n' +
      'Your current Christmas HQ data here will be overwritten. Your pattern lock and sign-in are not touched.');
    if (!ok) return false;

    var existing = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (isBackupKey(k)) existing.push(k);
    }
    var previous = {};
    existing.forEach(function (k) { previous[k] = localStorage.getItem(k); });

    try {
      existing.forEach(function (k) { localStorage.removeItem(k); });
      info.keys.forEach(function (k) { localStorage.setItem(k, parsed.data[k]); });
    } catch (err) {
      // roll back so a failed restore never leaves the phone half-restored
      try {
        info.keys.forEach(function (k) { localStorage.removeItem(k); });
        Object.keys(previous).forEach(function (k) { localStorage.setItem(k, previous[k]); });
      } catch (_) {}
      throw new Error('This phone could not store the backup. Nothing was changed.');
    }
    window.notice && window.notice('Backup restored — reloading…');
    setTimeout(function () { location.reload(); }, 500);
    return true;
  }

  function backupCard() {
    var share = canShareFiles()
      ? '<button type="button" class="btn alt full" data-hq-backup-share style="margin-top:10px">📤 Share backup file…</button>'
      : '';
    return '<div class="card hq-backup-card" id="hqBackupCard">' +
      '<h3>🎁 Back up my Christmas HQ</h3>' +
      '<p class="muted-note">One file with everything saved on this phone: gifts and notes, per-person budgets, ' +
      'plans and settings. Your pattern lock and sign-in details are never included. Keep the file private.</p>' +
      '<button type="button" class="btn full" data-hq-backup-download>⬇ Back up my Christmas HQ</button>' + share +
      '<label class="btn alt full" for="hqRestoreFile" style="margin-top:10px;cursor:pointer">⬆ Restore from backup</label>' +
      '<input id="hqRestoreFile" type="file" accept="application/json,.json,text/plain" style="display:none">' +
      '<p class="muted-note" id="hqBackupMsg" role="status" style="margin-top:10px"></p></div>';
  }

  /* ---------------- hook into screens ---------------- */
  if (typeof gifts === 'function') {
    var baseGifts = gifts;
    gifts = function () {
      var html = baseGifts.apply(this, arguments);
      return html + safe(function () {
        if (typeof ui !== 'undefined' && ui.tab === 'gifts' && ui.sub.gifts === 'My gifts' && !ui.hqGiftPerson && !ui.hqEditGiftId) {
          return postingCard();
        }
        return '';
      }, '');
    };
  }

  if (typeof settings === 'function') {
    var baseSettings = settings;
    settings = function () {
      var html = baseSettings.apply(this, arguments);
      var card = safe(backupCard, '');
      if (!card) return html;
      var marker = '<div class="card"><h3>Fresh start</h3>';
      var at = html.indexOf(marker);
      return at >= 0 ? html.slice(0, at) + card + html.slice(at) : html + card;
    };
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var tick = target.closest('[data-hq-post-tick]');
    if (tick) {
      var map = readDismissed();
      var id = tick.getAttribute('data-hq-post-tick');
      if (map[id]) delete map[id]; else map[id] = 1;
      writeDismissed(map);
      safe(function () { render(false); });
      return;
    }

    if (target.closest('[data-hq-post-toggle]')) {
      ui.hqPostShowAll = !ui.hqPostShowAll;
      safe(function () { render(false); });
      return;
    }

    if (target.closest('[data-hq-backup-download]')) {
      safe(function () {
        if (!('download' in document.createElement('a')) && canShareFiles()) shareBackup();
        else downloadBackup();
      });
      return;
    }

    if (target.closest('[data-hq-backup-share]')) {
      safe(shareBackup);
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || input.id !== 'hqRestoreFile') return;

    var file = input.files && input.files[0];
    var msg = document.getElementById('hqBackupMsg');
    var say = function (text) { if (msg) msg.textContent = text; };
    if (!file) return;

    var done = function (text) {
      try {
        restoreFromText(text);
      } catch (err) {
        say(err && err.message ? err.message : 'Could not read that file.');
        window.notice && window.notice('Restore did not run');
      }
      try { input.value = ''; } catch (_) {}
    };

    if (file.size > 25 * 1024 * 1024) {
      say('That file is too large to be a Christmas HQ backup.');
      return;
    }

    if (typeof file.text === 'function') {
      file.text().then(done).catch(function () { say('Could not read that file.'); });
    } else {
      var reader = new FileReader();
      reader.onload = function () { done(String(reader.result || '')); };
      reader.onerror = function () { say('Could not read that file.'); };
      reader.readAsText(file);
    }
  });

  /* ---------------- styles ---------------- */
  var css = document.createElement('style');
  css.id = 'hqGiftExtrasStyle';
  css.textContent =
    '.hq-post-card{margin-top:16px}' +
    '.hq-post-list{display:grid;gap:8px}' +
    '.hq-post-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid #e4d3a6;border-radius:14px;background:#fffdf6}' +
    '.hq-post-row.tone-soon{background:#fff4de;border-color:#d89a1d}' +
    '.hq-post-row.tone-past{opacity:.6}' +
    '.hq-post-row.is-done{opacity:.55}' +
    '.hq-post-tick{flex:0 0 auto;width:30px;height:30px;padding:0;border-radius:50%;border:2px solid #c4984d;background:#fffaf0;color:#fff;font:900 16px/1 system-ui,sans-serif;display:grid;place-items:center;cursor:pointer}' +
    '.hq-post-tick.on{background:#2c7554;border-color:#2c7554}' +
    '.hq-post-info{flex:1 1 auto;min-width:0}' +
    '.hq-post-info b{display:block;font-size:13px;color:#103b31;line-height:1.3;overflow-wrap:anywhere}' +
    '.hq-post-info small{display:block;margin-top:2px;font-size:12px;font-weight:800;color:#735f3a}' +
    '.hq-post-days{font-weight:900;color:#2c7554;white-space:nowrap}' +
    '.hq-post-row.tone-soon .hq-post-days{color:#b4730a}' +
    '.hq-post-link{display:block;margin:10px auto 0;border:0;background:none;color:#2c7554;font-weight:900;font-size:12px;text-decoration:underline;cursor:pointer;padding:6px}' +
    '.hq-post-foot{margin:10px 0 0;font-size:11px;line-height:1.5;color:#6c776e}' +
    '.hq-post-foot a{color:#2c7554;font-weight:800}' +
    '.hq-post-row.tone-past .hq-post-days{color:#6c776e}';
  document.head.appendChild(css);
})();
