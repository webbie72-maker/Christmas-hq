/* Christmas HQ — gift extras: Australia Post posting dates + full backup/restore.
   Everything is guarded: if anything here fails, the original screens still render. */
(function () {
  'use strict';
  if (window.__hqGiftExtras) return;
  window.__hqGiftExtras = true;

  var DISMISS_KEY = 'christmas-hq-posting-dismissed-v1';
  var SOURCE_URL = 'https://auspost.com.au/personal/sending/christmas-sending-dates';
  var BACKUP_APP = 'christmas-hq-backup';
  var LAST_KEY = 'christmas-hq-last-backup-v1';

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

    var more = !!(typeof ui !== 'undefined' && ui.hqPostMore);
    var visible = POSTING.filter(function (row) {
      return showAll || !dismissed[row.id];
    });
    var extra = 0;
    if (!more && visible.length > 3) { extra = visible.length - 3; visible = visible.slice(0, 3); }
    var rows = visible.map(function (row) {
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

    var moreBtn = (extra || (more && POSTING.length > 3))
      ? '<button type="button" class="hq-post-link" data-hq-post-more>' + (more ? 'Show fewer dates' : 'Show ' + extra + ' more date' + (extra === 1 ? '' : 's')) + '</button>'
      : '';
    return '<div class="card hq-post-card" id="hqPostingCard">' +
      '<div class="eyebrow">POSTING GIFTS</div>' +
      '<h3>📮 Last posting dates · Perth &amp; WA</h3>' +
      '<p class="muted-note" style="margin:4px 0 10px">Last days to post from a Perth metro Post Office for Christmas. ' +
      'Over-the-counter items by 2.30pm; regional or remote areas need extra days.</p>' +
      '<div class="hq-post-list">' + rows + '</div>' + empty + moreBtn + toggle +
      '<p class="hq-post-foot">Dates are a guide only and can change. Check ' +
      '<a href="' + SOURCE_URL + '" target="_blank" rel="noopener">Australia Post’s Christmas dates ↗</a> before you post. ' +
      'Checked 23 Oct 2026.</p></div>';
  }

  /* ---------------- 2. Backup & restore ---------------- */
  var EXCLUDE = /([-_:]pin|pin[-_:]|pin$|pattern|[-_:]lock|lock[-_:]|auth|session|token|supabase|password|secret|family-id|cloud|draft|refresh|welcome-tour|terms-ack|last-backup)/i;

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
    markBackedUp();
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
      markBackedUp();
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

  function lastBackupText() {
    var raw = safe(function () { return localStorage.getItem(LAST_KEY); }, null);
    var d = raw ? new Date(raw) : null;
    if (!d || isNaN(d.getTime())) return 'Last backed up: not yet';
    return 'Last backed up: ' + d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
  }

  function markBackedUp() {
    try { localStorage.setItem(LAST_KEY, new Date().toISOString()); } catch (_) {}
    var el = document.getElementById('hqLastBackup');
    if (el) el.textContent = lastBackupText();
  }

  function backupCard() {
    var share = canShareFiles()
      ? '<button type="button" class="btn alt full" data-hq-backup-share style="margin-top:10px">📤 Share backup file…</button>'
      : '';
    var saving = (typeof storageAvailable !== 'undefined' && !storageAvailable)
      ? '<p class="pill">⚠ Local saving blocked by this viewer</p>'
      : '<p class="pill green">✓ Local saving available</p>';
    return '<div class="card hq-backup-card" id="hqBackupCard">' +
      '<h3>💾 Back up &amp; restore</h3>' +
      '<p class="muted-note">One file with everything saved on this phone: gifts and notes, per-person budgets, ' +
      'plans and settings. Your pattern lock and sign-in details are never included. Keep the file private.</p>' +
      saving +
      '<p class="muted-note" id="hqLastBackup" style="margin:8px 0 12px;font-weight:800">' + escHtml(lastBackupText()) + '</p>' +
      '<button type="button" class="btn full" data-hq-backup-download>⬇ Back up my Christmas HQ</button>' + share +
      '<label class="btn alt full" for="importFile" style="margin-top:10px;cursor:pointer">⬆ Restore from backup file</label>' +
      '<input id="importFile" type="file" accept="application/json,.json,text/plain" style="display:none">' +
      '<p class="muted-note" id="hqBackupMsg" role="status" style="margin:10px 0 0">Works with new backups and with older exported files.</p>' +
      '<details class="hq-backup-more"><summary>More backup options</summary>' +
      '<p class="muted-note">Full backup: your plan plus a saved copy of Family HQ lists, the Elf planner and any songs stored on this phone. ' +
      'Audio can make the file large, and it includes food needs and Secret Santa draws, so keep it private.</p>' +
      '<button type="button" class="btn alt full" data-action="export">⬇ Full backup (with music &amp; Elf)</button>' +
      '<label class="hq-backup-scope">When restoring a full backup, restore<select class="field" id="backupRestoreScope">' +
      '<option value="personal">My personal plan</option><option value="family">Saved Family HQ lists into my personal plan</option></select></label>' +
      '</details></div>';
  }

  function isIOS() {
    return safe(function () {
      var ua = navigator.userAgent || '';
      return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }, false);
  }

  function installParagraph() {
    var ios = isIOS();
    var other = !!(typeof ui !== 'undefined' && ui.hqInstallOther);
    var and = '<b>Android / Samsung:</b> tap the green Install app button below when it appears, or Chrome menu → Add to Home screen / Install app.';
    var iph = '<b>iPhone / iPad:</b> open Christmas HQ in Safari → tap Share → Add to Home Screen → Add.';
    var main = ios ? iph : and;
    var alt = ios ? and : iph;
    return '<p class="muted-note">' + main + (other ? '<br><br>' + alt : '') + '</p>' +
      '<button type="button" class="hq-post-link" style="margin:0 0 10px;padding:2px 0" data-hq-install-other>' +
      (other ? 'Hide other phone' : (ios ? 'Show Android steps' : 'Show iPhone steps')) + '</button>';
  }

  function tidySettings(html) {
    // 1) one merged backup card
    var start = html.indexOf('<div class="card"><h3>💾 Save your Christmas plan</h3>');
    var endMarker = '<input id="importFile" type="file" accept="application/json,.json" style="display:none"></div></div>';
    var end = start >= 0 ? html.indexOf(endMarker, start) : -1;
    var card = safe(backupCard, '');
    if (start >= 0 && end > start && card) {
      html = html.slice(0, start) + card + html.slice(end + endMarker.length);
    } else if (card) {
      var marker = '<div class="card"><h3>Fresh start</h3>';
      var at = html.indexOf(marker);
      html = at >= 0 ? html.slice(0, at) + card + html.slice(at) : html + card;
    }
    // 2) only the install steps for this phone
    var a = html.indexOf('<p class="muted-note"><b>Android / Samsung:</b>');
    var aEnd = a >= 0 ? html.indexOf('</p>', a) : -1;
    if (a >= 0 && aEnd > a) html = html.slice(0, a) + installParagraph() + html.slice(aEnd + 4);
    // 3) shorter "What's included?"
    var w = html.indexOf("<div class=\"card\"><h3>What's included?</h3>");
    var wEnd = w >= 0 ? html.indexOf('</div>', w) : -1;
    if (w >= 0 && wEnd > w) {
      html = html.slice(0, w) + '<div class="card"><h3>What\'s included?</h3>' +
        '<p class="muted-note">Gifts, planner, kitchen, Magic, Explore, games and chat — all in one place. Your plan stays on this phone; sign in to Family Cloud to share lists with family. ' +
        'You can delete your account at any time from the account deletion page.</p>' + html.slice(wEnd);
    }
    return html;
  }

  /* Home: next gift to buy + posting pointer */
  function nextPostingRow() {
    var dismissed = readDismissed();
    var rows = POSTING.filter(function (r) { return !dismissed[r.id] && daysUntil(r.date) >= 0; });
    // Perth is the home base: show the WA parcel date when it is still ahead
    var wa = rows.filter(function (r) { return r.id === 'wa-parcel'; })[0];
    return wa || rows[0] || null;
  }

  function homePointer() {
    if (new Date().getFullYear() !== 2026 || typeof state === 'undefined') return '';
    var out = '';
    var next = (state.gifts || []).filter(function (g) { return !g.bought; })[0];
    if (next) {
      out += '<button type="button" class="hq-home-line" data-action="shortcut" data-target="gifts"><span>🎁</span><span><b>Next gift to buy:</b> ' +
        escHtml(next.name || 'a gift') + (next.recipient ? ' for ' + escHtml(next.recipient) : '') + '</span><i>›</i></button>';
    }
    var row = nextPostingRow();
    if (row) {
      var d = row.date;
      var dt = new Date(d[0], d[1] - 1, d[2]);
      var n = daysUntil(d);
      out += '<button type="button" class="hq-home-line" data-hq-go-posting><span>📮</span><span><b>Post by ' + DAYS[dt.getDay()] + ' ' + d[2] + ' ' + MONTHS[d[1] - 1] +
        '</b> (' + (n === 0 ? 'today' : n + ' day' + (n === 1 ? '' : 's')) + ')</span><i>›</i></button>';
    }
    return out ? '<div class="hq-home-lines">' + out + '</div>' : '';
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
      return safe(function () { return tidySettings(html); }, html);
    };
  }

  if (typeof home === 'function') {
    var baseHome = home;
    home = function () {
      var html = baseHome.apply(this, arguments);
      return safe(function () {
        var extra = homePointer();
        if (!extra) return html;
        var at = html.indexOf('<div class="section-line"><h2>Your Christmas toolkit');
        return at >= 0 ? html.slice(0, at) + extra + html.slice(at) : html;
      }, html);
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

    if (target.closest('[data-hq-post-more]')) {
      ui.hqPostMore = !ui.hqPostMore;
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
      return;
    }

    if (target.closest('[data-hq-install-other]')) {
      ui.hqInstallOther = !ui.hqInstallOther;
      safe(function () { render(false); });
      return;
    }

    if (target.closest('[data-hq-go-posting]')) {
      safe(function () {
        ui.hqGiftPerson = '';
        ui.hqEditGiftId = '';
        go('gifts', 'My gifts');
        setTimeout(function () {
          var card = document.getElementById('hqPostingCard');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      });
    }
  });

  /* One restore input. New-format backups are handled here; anything else (older
     exports) is passed on untouched to the app's original import handler. */
  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || input.id !== 'importFile') return;
    if (input.__hqLegacyPass) { input.__hqLegacyPass = false; return; }

    var file = input.files && input.files[0];
    if (!file) return;
    event.stopImmediatePropagation();

    var msg = document.getElementById('hqBackupMsg');
    var say = function (text) { if (msg) msg.textContent = text; };

    var passOn = function () {
      // older export file: hand it to the original importer
      input.__hqLegacyPass = true;
      try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (_) { input.__hqLegacyPass = false; }
    };

    var done = function (text) {
      var parsed = null;
      try { parsed = JSON.parse(text); } catch (_) {}
      if (!parsed || parsed.app !== BACKUP_APP) { passOn(); return; }
      try {
        restoreFromText(text);
      } catch (err) {
        say(err && err.message ? err.message : 'Could not read that file.');
        window.notice && window.notice('Restore did not run');
      }
      try { input.value = ''; } catch (_) {}
    };

    if (file.size > 60 * 1024 * 1024) {
      say('That file is too large to be a Christmas HQ backup.');
      try { input.value = ''; } catch (_) {}
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
  }, true);

  /* Remember when a full (older-style) backup was downloaded too */
  if (typeof download === 'function') {
    var baseDownload = download;
    download = function (name) {
      try { if (/^christmas-hq-backup/i.test(String(name))) markBackedUp(); } catch (_) {}
      return baseDownload.apply(this, arguments);
    };
  }

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
    '.hq-post-row.tone-past .hq-post-days{color:#6c776e}' +
    '.hq-backup-more{margin-top:14px;border-top:1px dashed #d9ccaa;padding-top:10px}' +
    '.hq-backup-more summary{cursor:pointer;font-weight:900;font-size:13px;color:#2c7554;padding:4px 0}' +
    '.hq-backup-scope{display:block;margin-top:10px;font-size:12px;font-weight:800;color:#103b31}' +
    '.hq-backup-scope select{margin-top:6px}' +
    '.hq-home-lines{display:grid;gap:8px;margin:12px 0 4px}' +
    '.hq-home-line{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid #e4d3a6;background:#fffdf6;border-radius:14px;padding:10px 12px;font:600 13px/1.35 system-ui,sans-serif;color:#103b31;cursor:pointer}' +
    '.hq-home-line b{font-weight:900}' +
    '.hq-home-line span:nth-child(2){flex:1;min-width:0;overflow-wrap:anywhere}' +
    '.hq-home-line i{font-style:normal;font-size:20px;opacity:.5}';
  document.head.appendChild(css);
})();
