/* =========================================================
   Christmas HQ: Christmas pattern lock (pin-lock.js v1)
   - Loaded synchronously in <head> so the app is hidden
     before anything paints.
   - Always on: first launch asks you to create a pattern
     (3x3 bauble grid, at least 4 dots, drawn twice), then
     every launch / return from background asks for it.
   - Stores only { salt, hash } (salted SHA-256 of the dot
     sequence) in localStorage "christmasHQ_pin". Never the
     pattern itself. Never sent to Family Cloud.
   - A local device lock to stop casual peeking, not account
     security.
   ========================================================= */
(function () {
  'use strict';

  var KEY = 'christmasHQ_pin';
  var ENABLE_KEY='christmasHQ_patternEnabled';
  var patternEnabled=false;
  try { var preference=localStorage.getItem(ENABLE_KEY); patternEnabled=preference===null?!!localStorage.getItem(KEY):preference==='on'; } catch(e) {}

  // A one-use handoff for a refresh of an already unlocked page.
  var REFRESH_KEY = 'christmasHQ_pin_refresh';
  var resumeRefresh = false;
  try {
    var refreshedAt = Number(sessionStorage.getItem(REFRESH_KEY));
    sessionStorage.removeItem(REFRESH_KEY);
    var navigation = performance.getEntriesByType('navigation')[0];
    resumeRefresh = navigation && navigation.type === 'reload' &&
      refreshedAt > 0 && Date.now() - refreshedAt >= 0 && Date.now() - refreshedAt < 30000;
  } catch (e) {}

  var MIN_DOTS = 4;
  var MAX_TRIES = 5;
  var LOCKOUT_MS = 30000;
  var root = document.documentElement;

  if (window.__hqPinLockLoaded) return;
  window.__hqPinLockLoaded = true;

  /* ---------- storage ---------- */
  var storageOk = (function () {
    try {
      var t = '__hq_pin_test__';
      localStorage.setItem(t, '1');
      localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  })();

  /* If this viewer blocks storage we cannot remember a pattern,
     so do not trap the user behind a lock they can never pass. */
  if (!storageOk) return;

  function readRecord() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var rec = JSON.parse(raw);
      if (!rec || rec.type !== 'pattern' || typeof rec.salt !== 'string' || typeof rec.hash !== 'string') return null;
      return rec;
    } catch (e) {
      return null;
    }
  }

  function writeRecord(rec) {
    try {
      localStorage.setItem(KEY, JSON.stringify(rec));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- hashing ---------- */
  function toHex(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length; i++) {
      out += ('0' + bytes[i].toString(16)).slice(-2);
    }
    return out;
  }

  function randomSalt() {
    var b = new Uint8Array(16);
    var c = window.crypto || window.msCrypto;
    try {
      c.getRandomValues(b);
    } catch (e) {
      /* Very old / locked-down viewer: weaker salt, but never block saving. */
      for (var i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256) ^ (Date.now() >> (i % 8)) & 255;
    }
    return toHex(b);
  }

  /* crypto.subtle only exists on secure (https / localhost) pages. Without it
     we fall back to the built-in SHA-256 below (same result, so a saved pattern
     still unlocks) and tell the user, instead of trapping them. */
  var secureHash = !!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest);
  var INSECURE_NOTE = 'This page is not on a secure (https) connection, so the phone\u2019s built-in security check is unavailable. Your pattern still works using Christmas HQ\u2019s backup check, and \u201cForgot pattern?\u201d is always available.';

  function utf8(str) {
    if (window.TextEncoder) return new TextEncoder().encode(str);
    var s = unescape(encodeURIComponent(str));
    var b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b;
  }

  /* Small pure-JS SHA-256, only used if crypto.subtle is missing
     (e.g. page opened from a non-HTTPS address). */
  function sha256Fallback(bytes) {
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var len = bytes.length;
    var total = ((len + 9 + 63) >> 6) << 6;
    var m = new Uint8Array(total);
    m.set(bytes);
    m[len] = 0x80;
    var bitLen = len * 8;
    m[total - 4] = (bitLen >>> 24) & 255;
    m[total - 3] = (bitLen >>> 16) & 255;
    m[total - 2] = (bitLen >>> 8) & 255;
    m[total - 1] = bitLen & 255;
    var w = new Array(64);
    for (var off = 0; off < total; off += 64) {
      for (var i = 0; i < 16; i++) {
        var j = off + i * 4;
        w[i] = (m[j] << 24) | (m[j + 1] << 16) | (m[j + 2] << 8) | m[j + 3];
      }
      for (i = 16; i < 64; i++) {
        var x = w[i - 15], y = w[i - 2];
        var s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
        var s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var mj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0;
        d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = new Uint8Array(32);
    for (i = 0; i < 8; i++) {
      out[i * 4] = (H[i] >>> 24) & 255;
      out[i * 4 + 1] = (H[i] >>> 16) & 255;
      out[i * 4 + 2] = (H[i] >>> 8) & 255;
      out[i * 4 + 3] = H[i] & 255;
    }
    return out;
  }

  function hashPattern(seq, salt) {
    try {
      var data = utf8('christmasHQ:pattern:' + salt + ':' + seq);
      var subtle = window.crypto && window.crypto.subtle;
      if (subtle && subtle.digest) {
        return Promise.resolve(subtle.digest('SHA-256', data)).then(
          function (buf) { return toHex(new Uint8Array(buf)); },
          function () { return toHex(sha256Fallback(data)); }
        );
      }
      return Promise.resolve(toHex(sha256Fallback(data)));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  function verifyPattern(seq) {
    var rec = readRecord();
    if (!rec) return Promise.resolve(false);
    return hashPattern(seq, rec.salt).then(function (h) { return h === rec.hash; });
  }

  function savePattern(seq) {
    var salt;
    try { salt = randomSalt(); } catch (e) { return Promise.reject(e); }
    return hashPattern(seq, salt).then(function (h) {
      return writeRecord({ v: 2, type: 'pattern', salt: salt, hash: h, fails: 0, lockUntil: 0, setAt: Date.now() });
    });
  }

  /* ---------- wrong-try lockout (persisted so relaunch does not skip it) ---------- */
  function lockoutRemaining() {
    var rec = readRecord();
    if (!rec || !rec.lockUntil) return 0;
    var left = rec.lockUntil - Date.now();
    if (left > LOCKOUT_MS) {            /* clock moved backwards: clamp */
      rec.lockUntil = Date.now() + LOCKOUT_MS;
      writeRecord(rec);
      left = LOCKOUT_MS;
    }
    return left > 0 ? left : 0;
  }

  function recordFailure() {
    var rec = readRecord();
    if (!rec) return { lockedOut: false, left: MAX_TRIES };
    rec.fails = (rec.fails || 0) + 1;
    var lockedOut = false;
    if (rec.fails >= MAX_TRIES) {
      rec.fails = 0;
      rec.lockUntil = Date.now() + LOCKOUT_MS;
      lockedOut = true;
    }
    writeRecord(rec);
    return { lockedOut: lockedOut, left: MAX_TRIES - (rec.fails || 0) };
  }

  function clearFailures() {
    var rec = readRecord();
    if (!rec) return;
    if (rec.fails || rec.lockUntil) {
      rec.fails = 0;
      rec.lockUntil = 0;
      writeRecord(rec);
    }
  }

  var reducedMotion = false;
  try {
    reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  /* Older / low-power phones get fewer particles. */
  var lowPower = false;
  try {
    lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      !!(navigator.connection && navigator.connection.saveData);
  } catch (e) {}

  /* ---------- CSS: injected at once so the app never shows ---------- */
  var css = [
    'html.hq-pin-locked,html.hq-pin-locked body{background:#0a1d33!important;overflow:hidden!important;overscroll-behavior:none!important}',
    'html.hq-pin-locked body>*:not(#hqPinLock){visibility:hidden!important}',
    '#hqPinLock{position:fixed;inset:0;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:2147483647;',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;overscroll-behavior:none;',
    'padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));',
    'box-sizing:border-box;visibility:visible!important;pointer-events:auto;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;',
    'color:#fff6df;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;',
    'background:radial-gradient(60% 34% at 50% 50%,rgba(255,206,110,.14),rgba(255,206,110,0) 70%),',
    'linear-gradient(180deg,rgba(5,12,34,.35) 0%,rgba(5,12,34,.25) 55%,rgba(5,12,34,0) 75%),',
    'url("./lock-village.jpg") center bottom/cover no-repeat,#07112a}',
    '#hqPinLock.hqpin-hidden{display:none!important}',
    '#hqPinLock *{box-sizing:border-box}',
    '#hqPinLock:focus{outline:none}',
    '#hqPinFx{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}',
    '.hqpat-holly{position:fixed;width:clamp(86px,26vw,130px);height:auto;pointer-events:none;z-index:1;opacity:.92;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))}',
    '.hqpat-holly.tl{top:calc(env(safe-area-inset-top) - 8px);left:-10px}',
    '.hqpat-holly.tr{top:calc(env(safe-area-inset-top) - 8px);right:-10px;transform:scaleX(-1)}',
    '.hqpat-holly.bl{bottom:-14px;left:-14px;transform:scaleY(-1);opacity:.6;width:clamp(70px,20vw,104px)}',
    '.hqpat-holly.br{bottom:-14px;right:-14px;transform:scale(-1,-1);opacity:.6;width:clamp(70px,20vw,104px)}',
    '.hqpin-inner{position:relative;z-index:2;width:100%;max-width:400px;display:flex;flex-direction:column;align-items:center;text-align:center;margin:auto}',
    '.hqpin-brand{margin:0;font-family:"Brush Script MT","Segoe Script","Snell Roundhand",cursive;font-weight:700;font-size:clamp(52px,16vw,76px);line-height:.9;letter-spacing:-1px;',
    'color:#ffe9a7;background:linear-gradient(180deg,#fffce9 0%,#ffe9a7 52%,#e4ad4e 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;padding:0 8px 4px;',
    'filter:drop-shadow(0 4px 2px rgba(0,0,0,.55)) drop-shadow(0 0 12px rgba(255,214,107,.28))}',
    '.hqpin-flourish{margin-top:6px;color:#f1cf74;font-size:14px;letter-spacing:4px;text-shadow:0 2px 6px rgba(0,0,0,.7)}',
    '.hqpin-star{display:block;font-size:22px;line-height:1;color:#ffe08a;text-shadow:0 0 12px rgba(255,224,138,.9);margin-bottom:4px}',
    '.hqpin-title{margin:8px 0 2px;font:600 18px/1.3 Georgia,"Times New Roman",serif;color:#fff6df}',
    '.hqpin-sub{margin:0;min-height:18px;font-size:13.5px;line-height:1.4;color:#cddfe0;max-width:320px}',
    '.hqpin-msg{margin:8px 0 6px;min-height:38px;font-size:14px;line-height:1.35;color:#ffe2a0;max-width:320px;display:flex;align-items:center;justify-content:center}',
    '.hqpin-msg.err{color:#ffb3a7}',
    '.hqpat-grid{--size:min(84vw,330px,50vh);position:relative;width:var(--size);height:var(--size);display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);touch-action:none}',
    '.hqpat-grid.disabled{opacity:.45;filter:grayscale(.4)}',
    '.hqpat-cell{display:flex;align-items:center;justify-content:center;position:relative;z-index:2}',
    '.hqpat-dot{position:relative;width:42%;height:42%;border-radius:50%;',
    'background:radial-gradient(circle at 34% 30%,#fffbe6 0%,#f6dc8a 18%,#d9ad52 48%,#9a6c22 82%,#6e4a12 100%);',
    'box-shadow:0 0 14px rgba(255,214,120,.45),0 4px 10px rgba(0,0,0,.35),inset 0 -4px 8px rgba(80,50,0,.35);transition:transform .15s,box-shadow .15s,background .15s}',
    '.hqpat-dot::before{content:"";position:absolute;left:50%;top:-11%;width:26%;height:16%;transform:translateX(-50%);border-radius:3px 3px 2px 2px;',
    'background:linear-gradient(90deg,#8d6a2c,#f6e3a6,#8d6a2c)}',
    '.hqpat-dot::after{content:"";position:absolute;left:50%;top:-22%;width:16%;height:14%;transform:translateX(-50%);border:2px solid #e8c878;border-bottom:0;border-radius:50% 50% 0 0}',
    '.hqpat-dot.on{transform:scale(1.14);box-shadow:0 0 22px 6px rgba(255,216,107,.75),0 0 4px rgba(255,255,255,.9),inset 0 -4px 8px rgba(80,50,0,.3);',
    'background:radial-gradient(circle at 34% 30%,#ffffff 0%,#fff0b8 22%,#f2c95a 52%,#b07c22 100%)}',
    '.hqpat-grid.err .hqpat-dot.on{background:radial-gradient(circle at 34% 30%,#ffe9e6 0%,#ff8a7a 25%,#d22d3d 60%,#7c1020 100%);box-shadow:0 0 22px 6px rgba(255,70,70,.7)}',
    '.hqpat-grid.ok .hqpat-dot.on{background:radial-gradient(circle at 34% 30%,#ffffff 0%,#d8ffd9 25%,#57c77a 60%,#1d6b3d 100%);box-shadow:0 0 22px 6px rgba(120,230,150,.7)}',
    '.hqpat-lines{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;overflow:visible;filter:drop-shadow(0 0 6px rgba(255,214,107,.95))}',
    '.hqpat-lines path{fill:none;stroke:#ffd86b;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}',
    '.hqpat-lines .live{stroke:rgba(255,232,160,.75);stroke-width:4}',
    '.hqpat-grid.err .hqpat-lines path{stroke:#ff5b5b}',
    '.hqpat-grid.ok .hqpat-lines path{stroke:#8cf0a8}',
    '.hqpat-grid.err{animation:hqpinShake .5s cubic-bezier(.36,.07,.19,.97) both}',
    '#hqPinLock.flash::after{content:"";position:fixed;inset:0;z-index:4;pointer-events:none;background:rgba(220,30,50,.28);animation:hqpinFlash .55s ease-out forwards}',
    '@keyframes hqpinFlash{from{opacity:1}to{opacity:0}}',
    '@keyframes hqpinShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(5px)}30%,50%,70%{transform:translateX(-10px)}40%,60%{transform:translateX(10px)}}',
    '.hqpat-santa{position:fixed;left:0;top:0;width:76px;height:52px;margin:-26px 0 0 -38px;z-index:5;pointer-events:none;opacity:0;transition:opacity .25s;will-change:transform}',
    '.hqpat-santa.show{opacity:1}',
    '.hqpat-santa-in{position:absolute;inset:0;transition:transform .18s}',
    '.hqpat-santa.left .hqpat-santa-in{transform:scaleX(-1)}',
    '.hqpat-santa svg{position:absolute;left:0;bottom:0;width:76px;height:51px;overflow:visible;filter:drop-shadow(0 3px 2.5px rgba(20,4,8,.55)) drop-shadow(0 0 6px rgba(255,214,107,.55))}',
    '.hqpin-links{display:flex;gap:10px;justify-content:center;margin-top:10px;min-height:44px}',
    '.hqpin-link{-webkit-appearance:none;appearance:none;min-height:44px;padding:10px 16px;border:0;background:transparent;color:#f1cf74;',
    'font:600 15px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-decoration:underline;text-underline-offset:3px;cursor:pointer;touch-action:manipulation}',
    '.hqpin-link[hidden]{display:none}',
    '.hqpin-note{margin:6px 0 0;max-width:330px;padding:8px 12px;border-radius:12px;background:rgba(255,216,107,.12);border:1px solid rgba(255,216,107,.35);color:#ffe7a8;font-size:12.5px;line-height:1.4}',
    '.hqpin-note[hidden]{display:none}',
    '.hqpin-link:focus-visible{outline:3px solid #f1cf74;outline-offset:2px;border-radius:8px}',
    '@media (max-height:640px){.hqpin-star{display:none}.hqpin-brand{font-size:42px}.hqpin-flourish{display:none}.hqpin-title{font-size:16px;margin-top:4px}.hqpin-msg{min-height:22px;margin:4px 0}.hqpin-links{margin-top:4px}}',
    '@media (prefers-reduced-motion:reduce){.hqpat-grid.err{animation:none}.hqpat-santa,.hqpat-santa-in,.hqpat-dot{transition:none}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.id = 'hqPinLockStyle';
  styleEl.textContent = css;
  (document.head || root).appendChild(styleEl);

  /* Lock immediately: the app is hidden from the very first paint. */
  if (patternEnabled && !resumeRefresh) root.classList.add('hq-pin-locked');

  /* ---------- overlay markup (plain strings, no code inside) ---------- */
  var HOLLY_SVG =
    '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
      '<path d="M6 30 C18 26 24 18 26 8 C32 16 40 18 48 14 C46 24 52 30 62 32 C54 38 52 46 56 56 C46 52 38 54 32 62 C30 52 22 46 12 46 C18 40 16 34 6 30 Z" fill="#1f7a45" stroke="#0f4a28" stroke-width="2"/>' +
      '<path d="M14 34 C26 36 40 40 54 50" stroke="#0f4a28" stroke-width="2" fill="none"/>' +
      '<path d="M40 64 C50 58 56 50 58 40 C64 48 72 50 80 48 C78 58 84 64 94 66 C86 72 84 80 88 90 C78 86 70 88 64 96 C62 86 54 80 44 80 C50 74 48 70 40 64 Z" fill="#2a8a52" stroke="#0f4a28" stroke-width="2"/>' +
      '<path d="M48 68 C60 70 72 76 84 86" stroke="#0f4a28" stroke-width="2" fill="none"/>' +
      '<circle cx="56" cy="56" r="8" fill="#d42a3c" stroke="#8e1626" stroke-width="1.5"/>' +
      '<circle cx="68" cy="50" r="7" fill="#e0384a" stroke="#8e1626" stroke-width="1.5"/>' +
      '<circle cx="62" cy="66" r="7" fill="#c8283c" stroke="#8e1626" stroke-width="1.5"/>' +
      '<circle cx="53" cy="53" r="2.2" fill="#fff" opacity=".75"/><circle cx="65.5" cy="47.5" r="2" fill="#fff" opacity=".75"/>' +
    '</svg>';

  /* Painted storybook Santa + sleigh (faces right; flipped via .left). */
  var SLEIGH_SVG =
    '<svg viewBox="0 0 96 64" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<radialGradient id="hqslGlow" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="#ffe7a0" stop-opacity=".55"/><stop offset=".6" stop-color="#f2c75c" stop-opacity=".18"/><stop offset="1" stop-color="#f2c75c" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="hqslRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8434f"/><stop offset=".45" stop-color="#b3192c"/><stop offset="1" stop-color="#5c0914"/></linearGradient>' +
        '<linearGradient id="hqslSuit" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ef4b55"/><stop offset=".6" stop-color="#c21f30"/><stop offset="1" stop-color="#7a0c1b"/></linearGradient>' +
        '<linearGradient id="hqslGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4c2"/><stop offset=".45" stop-color="#f2cf6b"/><stop offset="1" stop-color="#a8761f"/></linearGradient>' +
        '<linearGradient id="hqslSack" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#e9bd4c"/><stop offset="1" stop-color="#9a6a18"/></linearGradient>' +
        '<linearGradient id="hqslFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9e1ea"/></linearGradient>' +
      '</defs>' +
      '<ellipse cx="50" cy="38" rx="47" ry="24" fill="url(#hqslGlow)"/>' +
      /* gold runners + struts */
      '<path d="M26 47 V56 M60 46 V55" stroke="url(#hqslGold)" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M5 56.5 H70 C80 56.5 86 52 87 45 C87.6 40.5 84 39 82 41" fill="none" stroke="#7a5412" stroke-width="4.4" stroke-linecap="round"/>' +
      '<path d="M5 56.5 H70 C80 56.5 86 52 87 45 C87.6 40.5 84 39 82 41" fill="none" stroke="url(#hqslGold)" stroke-width="2.8" stroke-linecap="round"/>' +
      '<path d="M8 55.6 H66" stroke="#fffbe6" stroke-width=".8" stroke-linecap="round" opacity=".8"/>' +
      /* gold-wrapped gift sack */
      '<path d="M15 33 C11 25 15 17 22 15.5 C24 12 30 12 31.5 15.5 C38 17 41 26 37 33 Z" fill="url(#hqslSack)" stroke="#7a5412" stroke-width="1"/>' +
      '<path d="M21.5 16.5 Q26.5 19 32 16.5" fill="none" stroke="#c21f30" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M26.5 17 C23 12 21 14.5 24 16 M26.5 17 C30 12 32 14.5 29 16" fill="none" stroke="#c21f30" stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M19 22 C18 26 19 29 21 31" fill="none" stroke="#fffbe0" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>' +
      /* Santa: coat */
      '<path d="M39 34 C38 24 42.5 18 50 18 C57.5 18 61 24 61 34 Z" fill="url(#hqslSuit)" stroke="#5c0914" stroke-width=".9"/>' +
      /* face, beard, hat */
      '<circle cx="50.5" cy="13.6" r="4.7" fill="#f6c9a4"/>' +
      '<circle cx="53.8" cy="14.6" r="1.4" fill="#ee8f86" opacity=".8"/>' +
      '<circle cx="52.6" cy="12.6" r=".75" fill="#2a1410"/>' +
      '<circle cx="55.4" cy="13.8" r="1.1" fill="#e47d74"/>' +
      '<path d="M45 13.6 C44.5 22 48.5 26 53 25 C57.5 24 57.8 18.5 56.4 15 C54.5 17.5 48 17.6 45 13.6 Z" fill="url(#hqslFur)" stroke="#b9c3cf" stroke-width=".5"/>' +
      '<path d="M51 16.2 C52.5 15 54.5 15 56 16.4 C54.5 17.4 52.5 17.4 51 16.2 Z" fill="#fff"/>' +
      '<path d="M44.6 9.6 C44.6 4.4 47.6 1.4 51.2 1.8 C54.4 2.2 56.4 5.2 56.4 9.6 Z" fill="url(#hqslSuit)"/>' +
      '<path d="M48.5 2.6 C44.2 2 40.4 4.4 38.8 9.2" fill="none" stroke="#b3192c" stroke-width="3.4" stroke-linecap="round"/>' +
      '<circle cx="38.6" cy="10.2" r="2.6" fill="url(#hqslFur)"/>' +
      '<rect x="43.4" y="8.4" width="14.2" height="3.4" rx="1.7" fill="url(#hqslFur)"/>' +
      /* arm with fur cuff resting on the sleigh front */
      '<path d="M54 22.5 C59.5 23.5 63 26.5 65.5 29.5" fill="none" stroke="url(#hqslSuit)" stroke-width="4.6" stroke-linecap="round"/>' +
      '<circle cx="64.6" cy="28.6" r="2.5" fill="url(#hqslFur)"/>' +
      '<circle cx="67" cy="30.2" r="2" fill="#1e3a24"/>' +
      /* curved deep red sleigh body */
      '<path d="M11 22 C13 17.5 19.5 17.5 22 22 L26.5 32 H62 C70 32 73.5 26 76.5 19 C78.5 14 86 13 88 18 C89.2 21.8 86.2 25 83.2 23.2 C82 37 72 48 58 48 H22 C14 48 10 42 10 34 Z" fill="url(#hqslRed)" stroke="#4a0610" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<path d="M14 26 C15 36 18 42 24 44" fill="none" stroke="#ff9aa0" stroke-width="1.1" stroke-linecap="round" opacity=".45"/>' +
      /* gold scroll trim */
      '<path d="M25 32 H62 C70 32 73.5 26 76.5 19 C78.5 14 86 13 88 18 C89.2 21.8 86.2 25 83.2 23.2 C81.4 22 82.4 19.4 84.6 20.2" fill="none" stroke="url(#hqslGold)" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M22 22 C19.5 17.5 13 17.5 11 22 C10 25 13 27 15 25.4 C16.4 24.2 15.2 22.4 13.8 23.2" fill="none" stroke="url(#hqslGold)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M22 45.5 H58 C68 45.5 75 39 78.5 30" fill="none" stroke="url(#hqslGold)" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M30 40 C33 35.5 38 35.5 40 39 C41.4 41.6 38.6 43.4 37 41.6 M58 39 C55 35.5 50 35.5 48 39 C46.6 41.6 49.4 43.4 51 41.6" fill="none" stroke="url(#hqslGold)" stroke-width="1.5" stroke-linecap="round"/>' +
      /* holly sprig on the side */
      '<path d="M44 38.5 C41.5 35.8 38.8 37 38 38.6 C40.2 38.4 41.6 40 44 38.5 Z M44 38.5 C46.5 35.8 49.2 37 50 38.6 C47.8 38.4 46.4 40 44 38.5 Z" fill="#2a8a52" stroke="#0f4a28" stroke-width=".6"/>' +
      '<circle cx="43.2" cy="39.6" r="1.5" fill="#e0384a"/><circle cx="45.2" cy="39.8" r="1.3" fill="#c8283c"/>' +
      /* snow on the rim */
      '<path d="M30 32.2 C33 34 36 33.6 38 32.4 M64 31.6 C66 33.4 69 32.6 70.5 30.4" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>' +
    '</svg>';

  var DOTS_HTML = '';
  for (var di = 1; di <= 9; di++) {
    DOTS_HTML += '<div class="hqpat-cell"><div class="hqpat-dot" data-hqpat-dot="' + di + '"></div></div>';
  }

  var OVERLAY_HTML =
    '<canvas id="hqPinFx" aria-hidden="true"></canvas>' +
    '<div class="hqpat-holly tl">' + HOLLY_SVG + '</div>' +
    '<div class="hqpat-holly tr">' + HOLLY_SVG + '</div>' +
    '<div class="hqpat-holly bl">' + HOLLY_SVG + '</div>' +
    '<div class="hqpat-holly br">' + HOLLY_SVG + '</div>' +
    '<div class="hqpin-inner">' +
      '<span class="hqpin-star" aria-hidden="true">&#10022;</span>' +
      '<div class="hqpin-brand">Christmas HQ</div>' +
      '<div class="hqpin-flourish" aria-hidden="true">&#10022; &middot; &#10022;</div>' +
      '<h1 class="hqpin-title" id="hqPinTitle">Draw your Christmas pattern</h1>' +
      '<p class="hqpin-sub" id="hqPinSub"></p>' +
      '<p class="hqpin-msg" id="hqPinMsg" aria-live="polite"></p>' +
      '<div class="hqpat-grid" id="hqPatGrid" role="application" aria-label="Pattern grid. Draw across at least 4 baubles. Keyboard: type numbers 1 to 9, then press Enter.">' +
        '<svg class="hqpat-lines" id="hqPatLines" aria-hidden="true"><path id="hqPatPath" d=""/><path id="hqPatLive" class="live" d=""/></svg>' +
        DOTS_HTML +
      '</div>' +
      '<div class="hqpin-links">' +
        '<button type="button" class="hqpin-link" data-hqpin-key="cancel" id="hqPinCancel" hidden>Cancel</button>' +
        '<button type="button" class="hqpin-link" data-hqpin-key="forgot" id="hqPinForgot">Forgot pattern?</button>' +
      '</div>' +
      '<p class="hqpin-note" id="hqPinNote" role="note" hidden></p>' +
    '</div>' +
    '<div class="hqpat-santa" id="hqPatSanta" aria-hidden="true"><div class="hqpat-santa-in">' + SLEIGH_SVG + '</div></div>';

  var overlay = null;
  var el = {};

  var S = {
    mode: readRecord() ? 'unlock' : 'create1',
    seq: [],
    first: '',
    busy: false,
    locked: patternEnabled && !resumeRefresh,
    timer: null,
    drawing: false,
    pid: null,
    centers: [],
    hitR: 30,
    gridRect: null,
    fx: null,
    finger: null,
    santaDir: 1
  };

  var TEXT = {
    unlock:        ['Draw your Christmas pattern', 'to open Christmas HQ'],
    create1:       ['Create your pattern', 'Draw your Christmas pattern: join at least 4 baubles. You will draw it twice.'],
    create2:       ['Draw it again to confirm', 'Same pattern, one more time.'],
    'chg-verify':  ['Change pattern', 'Draw your current pattern.'],
    'chg-new':     ['Draw a new pattern', 'Join at least 4 baubles.'],
    'chg-confirm': ['Confirm new pattern', 'Draw the new pattern again.']
  };

  function isChangeMode() {
    return S.mode === 'chg-verify' || S.mode === 'chg-new' || S.mode === 'chg-confirm';
  }

  function isCheckMode() {
    return S.mode === 'unlock' || S.mode === 'chg-verify';
  }

  function mount() {
    if (overlay || !document.body) return;
    overlay = document.createElement('div');
    overlay.id = 'hqPinLock';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'hqPinTitle');
    overlay.setAttribute('tabindex', '-1');
    overlay.innerHTML = OVERLAY_HTML;
    document.body.appendChild(overlay);
    el.title = overlay.querySelector('#hqPinTitle');
    el.sub = overlay.querySelector('#hqPinSub');
    el.msg = overlay.querySelector('#hqPinMsg');
    el.grid = overlay.querySelector('#hqPatGrid');
    el.path = overlay.querySelector('#hqPatPath');
    el.live = overlay.querySelector('#hqPatLive');
    el.svg = overlay.querySelector('#hqPatLines');
    el.dots = overlay.querySelectorAll('[data-hqpat-dot]');
    el.cancel = overlay.querySelector('#hqPinCancel');
    el.forgot = overlay.querySelector('#hqPinForgot');
    el.santa = overlay.querySelector('#hqPatSanta');
    el.canvas = overlay.querySelector('#hqPinFx');
    el.note = overlay.querySelector('#hqPinNote');
    if (!secureHash && el.note) { el.note.textContent = INSECURE_NOTE; el.note.hidden = false; }
    if (!S.locked) overlay.classList.add('hqpin-hidden');
    paint();
    if (S.locked) {
      startCountdownIfNeeded();
      fxStart();
    }
  }

  /* Keep the overlay as the last child of <body> so nothing added
     later can stack above it at the same z-index. */
  function bringToFront() {
    if (overlay && document.body && overlay !== document.body.lastElementChild) {
      document.body.appendChild(overlay);
    }
  }

  function setMsg(text, isErr) {
    if (!el.msg) return;
    el.msg.textContent = text || '';
    el.msg.className = 'hqpin-msg' + (isErr ? ' err' : '');
  }

  function paint() {
    if (!overlay) return;
    var t = TEXT[S.mode] || TEXT.unlock;
    el.title.textContent = t[0];
    el.sub.textContent = t[1];
    el.cancel.hidden = !isChangeMode();
    el.forgot.hidden = !isCheckMode();
  }

  /* ---------- pattern drawing ---------- */
  function layoutDots() {
    if (!el.grid) return;
    S.gridRect = el.grid.getBoundingClientRect();
    S.centers = [];
    for (var i = 0; i < el.dots.length; i++) {
      var r = el.dots[i].getBoundingClientRect();
      S.centers.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    S.hitR = Math.max(26, (S.gridRect.width / 3) * 0.36);
    el.svg.setAttribute('viewBox', '0 0 ' + S.gridRect.width + ' ' + S.gridRect.height);
  }

  function localPt(p) {
    return (p.x - S.gridRect.left).toFixed(1) + ' ' + (p.y - S.gridRect.top).toFixed(1);
  }

  function drawLines() {
    if (!el.path || !S.gridRect) return;
    var d = '';
    for (var i = 0; i < S.seq.length; i++) {
      d += (i ? ' L ' : 'M ') + localPt(S.centers[S.seq[i] - 1]);
    }
    el.path.setAttribute('d', d);
    if (S.drawing && S.finger && S.seq.length) {
      el.live.setAttribute('d', 'M ' + localPt(S.centers[S.seq[S.seq.length - 1] - 1]) + ' L ' + localPt(S.finger));
    } else {
      el.live.setAttribute('d', '');
    }
  }

  function addDot(n) {
    if (S.seq.indexOf(n) !== -1) return;
    /* Like Android: passing straight over an unused middle dot picks it up. */
    if (S.seq.length) {
      var a = S.seq[S.seq.length - 1] - 1, b = n - 1;
      var ar = Math.floor(a / 3), ac = a % 3, br = Math.floor(b / 3), bc = b % 3;
      if ((ar + br) % 2 === 0 && (ac + bc) % 2 === 0) {
        var mid = ((ar + br) / 2) * 3 + (ac + bc) / 2 + 1;
        if (mid !== n && S.seq.indexOf(mid) === -1) {
          S.seq.push(mid);
          el.dots[mid - 1].classList.add('on');
        }
      }
    }
    S.seq.push(n);
    el.dots[n - 1].classList.add('on');
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
  }

  function hitTest(x, y) {
    for (var i = 0; i < S.centers.length; i++) {
      var c = S.centers[i];
      var dx = x - c.x, dy = y - c.y;
      if (dx * dx + dy * dy <= S.hitR * S.hitR) return i + 1;
    }
    return 0;
  }

  function clearPattern() {
    S.seq = [];
    S.finger = null;
    if (!el.grid) return;
    el.grid.classList.remove('err', 'ok');
    for (var i = 0; i < el.dots.length; i++) el.dots[i].classList.remove('on');
    if (el.path) el.path.setAttribute('d', '');
    if (el.live) el.live.setAttribute('d', '');
  }

  function canDraw() {
    return S.locked && !S.busy && !(isCheckMode() && lockoutRemaining());
  }

  function moveSanta(x, y, dx) {
    if (!el.santa) return;
    if (dx > 2) S.santaDir = 1;
    else if (dx < -2) S.santaDir = -1;
    el.santa.classList.toggle('left', S.santaDir < 0);
    /* Sit just above the fingertip so the thumb does not hide him. */
    el.santa.style.transform = 'translate3d(' + Math.round(x) + 'px,' + Math.round(y - 52) + 'px,0)';
  }

  function onPointerDown(e) {
    if (!overlayActive()) return;
    swallow(e);
    if (e.button && e.button !== 0) return;
    if (e.target && e.target.closest && e.target.closest('[data-hqpin-key]')) return;
    if (!canDraw()) return;
    layoutDots();
    var g = S.gridRect, pad = 24;
    if (e.clientX < g.left - pad || e.clientX > g.right + pad || e.clientY < g.top - pad || e.clientY > g.bottom + pad) return;
    e.preventDefault();
    clearPattern();
    if (!S.timer) setMsg('', false);
    S.drawing = true;
    S.pid = e.pointerId;
    try { el.grid.setPointerCapture(e.pointerId); } catch (err) {}
    S.finger = { x: e.clientX, y: e.clientY };
    S.lastFx = { x: e.clientX, y: e.clientY };
    moveSanta(e.clientX, e.clientY, 0);
    el.santa.classList.add('show');
    var n = hitTest(e.clientX, e.clientY);
    if (n) addDot(n);
    drawLines();
  }

  function onPointerMove(e) {
    if (!overlayActive()) return;
    swallow(e);
    if (!S.drawing || e.pointerId !== S.pid) return;
    e.preventDefault();
    var pts = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    if (!pts.length) pts = [e];
    for (var i = 0; i < pts.length; i++) {
      var x = pts[i].clientX, y = pts[i].clientY;
      var n = hitTest(x, y);
      if (n) addDot(n);
      emitTrail(S.lastFx.x, S.lastFx.y, x, y);
      S.lastFx = { x: x, y: y };
    }
    var last = pts[pts.length - 1];
    var dx = last.clientX - S.finger.x;
    S.finger = { x: last.clientX, y: last.clientY };
    moveSanta(last.clientX, last.clientY, dx);
    drawLines();
  }

  function onPointerUp(e) {
    if (!overlayActive()) return;
    swallow(e);
    if (!S.drawing || e.pointerId !== S.pid) return;
    S.drawing = false;
    S.pid = null;
    if (el.santa) el.santa.classList.remove('show');
    drawLines();
    if (e.type === 'pointercancel') { clearPattern(); return; }
    finishPattern();
  }

  function finishPattern() {
    if (!S.seq.length) return;
    if (S.seq.length < MIN_DOTS) {
      showError('Join at least ' + MIN_DOTS + ' baubles.', false);
      return;
    }
    S.busy = true;
    var seq = S.seq.join('');
    setTimeout(function () {
      try { complete(seq); } catch (err) { showError('Something went wrong. Please try again.', false); }
    }, 60);
  }

  function showError(text, flash) {
    S.busy = true;
    if (el.grid) {
      el.grid.classList.remove('err');
      void el.grid.offsetWidth;
      el.grid.classList.add('err');
    }
    if (flash && overlay) {
      overlay.classList.remove('flash');
      void overlay.offsetWidth;
      overlay.classList.add('flash');
    }
    try { if (navigator.vibrate) navigator.vibrate([70, 40, 70]); } catch (e) {}
    if (text) setMsg(text, true);
    setTimeout(function () {
      if (overlay) overlay.classList.remove('flash');
      clearPattern();
      S.busy = false;
    }, 700);
  }

  function showOk(text) {
    if (el.grid) el.grid.classList.add('ok');
    if (text) setMsg(text, false);
  }

  function stopCountdown() {
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
  }

  function startCountdownIfNeeded() {
    stopCountdown();
    if (!el.grid) return false;
    if (!isCheckMode() || !lockoutRemaining()) { el.grid.classList.remove('disabled'); return false; }
    el.grid.classList.add('disabled');
    var tick = function () {
      var ms = lockoutRemaining();
      if (ms <= 0) {
        stopCountdown();
        el.grid.classList.remove('disabled');
        setMsg('You can try again now.', false);
        return;
      }
      setMsg('Too many wrong tries. Try again in ' + Math.ceil(ms / 1000) + ' s.', true);
    };
    tick();
    S.timer = setInterval(tick, 250);
    return true;
  }

  /* ---------- festive canvas: snow, twinkling stars, sleigh trail ---------- */
  var FX = { raf: 0, ctx: null, w: 0, h: 0, dpr: 1, flakes: [], stars: [], parts: [], last: 0 };
  var MAX_PARTS = reducedMotion ? 24 : (lowPower ? 50 : 110);

  function fxResize() {
    if (!el.canvas) return;
    var w = window.innerWidth || root.clientWidth, h = window.innerHeight || root.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    FX.w = w; FX.h = h; FX.dpr = dpr;
    el.canvas.width = Math.round(w * dpr);
    el.canvas.height = Math.round(h * dpr);
    FX.ctx = el.canvas.getContext('2d');
    if (FX.ctx) FX.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var nFlakes = reducedMotion ? 12 : Math.min(lowPower ? 28 : 60, Math.round((w * h) / 8000));
    FX.flakes = [];
    for (var i = 0; i < nFlakes; i++) {
      FX.flakes.push({
        x: Math.random() * w, y: Math.random() * h,
        r: 0.8 + Math.random() * 2.2,
        vy: (reducedMotion ? 6 : 14) + Math.random() * (reducedMotion ? 6 : 26),
        sway: 6 + Math.random() * 14, ph: Math.random() * 6.28, a: 0.45 + Math.random() * 0.5
      });
    }
    FX.stars = [];
    var nStars = Math.min(lowPower ? 14 : 26, Math.round(w / 16));
    for (var j = 0; j < nStars; j++) {
      FX.stars.push({ x: Math.random() * w, y: Math.random() * h * 0.62, r: 0.8 + Math.random() * 1.6, sp: 0.6 + Math.random() * 1.8, ph: Math.random() * 6.28 });
    }
    if (S.locked) layoutDots();
  }

  function emitTrail(x0, y0, x1, y1) {
    if (!FX.ctx) return;
    /* Particles stream from behind the sleigh (which sits above the finger). */
    var back = S.santaDir > 0 ? -26 : 26;
    var dx = x1 - x0, dy = y1 - y0;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var step = reducedMotion ? 40 : 9;
    var n = Math.min(reducedMotion ? 1 : 6, Math.max(1, Math.floor(dist / step)));
    for (var i = 0; i < n; i++) {
      if (FX.parts.length >= MAX_PARTS) FX.parts.shift();
      var t = (i + 1) / n;
      FX.parts.push({
        x: x0 + dx * t + back + (Math.random() - 0.5) * 8,
        y: y0 + dy * t - 44 + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 30 - (S.santaDir * 12),
        vy: 10 + Math.random() * 30,
        life: 0, max: 0.6 + Math.random() * 0.6,
        r: 1 + Math.random() * 2.4,
        gold: Math.random() < 0.4
      });
    }
  }

  function fxFrame(ts) {
    FX.raf = 0;
    if (!overlayActive() || document.visibilityState === 'hidden') return;
    var ctx = FX.ctx;
    if (!ctx) return;
    var dt = FX.last ? Math.min(0.05, (ts - FX.last) / 1000) : 0.016;
    FX.last = ts;
    var w = FX.w, h = FX.h, t = ts / 1000, i, p;
    ctx.clearRect(0, 0, w, h);

    for (i = 0; i < FX.stars.length; i++) {
      p = FX.stars[i];
      var tw = reducedMotion ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(t * p.sp + p.ph));
      ctx.globalAlpha = tw;
      ctx.fillStyle = '#ffe08a';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.r * 3);
      ctx.lineTo(p.x + p.r * 0.7, p.y - p.r * 0.7);
      ctx.lineTo(p.x + p.r * 3, p.y);
      ctx.lineTo(p.x + p.r * 0.7, p.y + p.r * 0.7);
      ctx.lineTo(p.x, p.y + p.r * 3);
      ctx.lineTo(p.x - p.r * 0.7, p.y + p.r * 0.7);
      ctx.lineTo(p.x - p.r * 3, p.y);
      ctx.lineTo(p.x - p.r * 0.7, p.y - p.r * 0.7);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    for (i = 0; i < FX.flakes.length; i++) {
      p = FX.flakes[i];
      p.y += p.vy * dt;
      if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
      var x = p.x + Math.sin(t * 0.8 + p.ph) * p.sway;
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    }

    var alive = [];
    for (i = 0; i < FX.parts.length; i++) {
      p = FX.parts[i];
      p.life += dt;
      if (p.life >= p.max) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 40 * dt;
      var k = 1 - p.life / p.max;
      ctx.globalAlpha = k;
      ctx.fillStyle = p.gold ? '#ffd86b' : '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.6 + 0.4 * k), 0, 6.2832);
      ctx.fill();
      alive.push(p);
    }
    FX.parts = alive;
    ctx.globalAlpha = 1;
    FX.raf = requestAnimationFrame(fxFrame);
  }

  function fxStart() {
    if (!el.canvas) return;
    if (!FX.ctx || FX.w !== (window.innerWidth || root.clientWidth) || FX.h !== (window.innerHeight || root.clientHeight)) fxResize();
    if (!FX.raf) { FX.last = 0; FX.raf = requestAnimationFrame(fxFrame); }
  }

  function fxStop() {
    if (FX.raf) cancelAnimationFrame(FX.raf);
    FX.raf = 0;
    FX.parts = [];
    if (FX.ctx) FX.ctx.clearRect(0, 0, FX.w, FX.h);
  }

  window.addEventListener('resize', function () {
    if (overlayActive()) { fxResize(); drawLines(); }
  });

  /* ---------- show / hide ---------- */
  function showLock(mode) {
    if (!patternEnabled) return;
    S.mode = mode || (readRecord() ? 'unlock' : 'create1');
    S.first = '';
    S.busy = false;
    S.drawing = false;
    S.pid = null;
    S.locked = true;
    root.classList.add('hq-pin-locked');
    if (!overlay) mount();
    if (!overlay) return;
    bringToFront();
    overlay.classList.remove('hqpin-hidden', 'flash');
    if (el.santa) el.santa.classList.remove('show');
    clearPattern();
    setMsg('', false);
    paint();
    startCountdownIfNeeded();
    fxStart();
    try {
      if (document.activeElement && document.activeElement !== document.body && !overlay.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      overlay.focus({ preventScroll: true });
    } catch (e) {}
  }

  function hideLock(note) {
    stopCountdown();
    S.locked = false;
    S.first = '';
    S.busy = false;
    S.drawing = false;
    clearPattern();
    fxStop();
    if (overlay) overlay.classList.add('hqpin-hidden');
    root.classList.remove('hq-pin-locked');
    if (note) updateCardMsg(note);
    try { window.dispatchEvent(new CustomEvent('hq-pin-unlocked')); } catch (e) {}
  }

  function handleWrong() {
    var r = recordFailure();
    if (r.lockedOut) {
      showError('', true);
      startCountdownIfNeeded();
    } else {
      showError('Not quite. ' + r.left + (r.left === 1 ? ' try' : ' tries') + ' left before a 30 second wait.', true);
    }
  }

  function complete(seq) {
    var mode = S.mode;

    if (mode === 'unlock' || mode === 'chg-verify') {
      verifyPattern(seq).then(function (ok) {
        if (!S.locked || S.mode !== mode) { S.busy = false; return; }
        if (ok) {
          clearFailures();
          showOk(mode === 'unlock' ? 'Merry Christmas!' : '');
          if (mode === 'unlock') {
            setTimeout(function () { hideLock(); }, 380);
          } else {
            setTimeout(function () {
              S.mode = 'chg-new';
              S.busy = false;
              clearPattern();
              setMsg('', false);
              paint();
            }, 380);
          }
        } else {
          handleWrong();
        }
      }, function () {
        showError('Something went wrong. Please try again.', false);
      });
      return;
    }

    if (mode === 'create1' || mode === 'chg-new') {
      S.first = seq;
      showOk('');
      setTimeout(function () {
        S.mode = mode === 'create1' ? 'create2' : 'chg-confirm';
        S.busy = false;
        clearPattern();
        setMsg('', false);
        paint();
      }, 380);
      return;
    }

    if (mode === 'create2' || mode === 'chg-confirm') {
      if (seq !== S.first) {
        S.first = '';
        S.mode = mode === 'create2' ? 'create1' : 'chg-new';
        paint();
        showError('Those patterns did not match. Please start again.', true);
        return;
      }
      S.first = '';
      savePattern(seq).then(function (saved) {
        if (!saved) {
          S.mode = mode === 'create2' ? 'create1' : 'chg-new';
          paint();
          showError('Could not save the pattern on this device. Please try again.', false);
          return;
        }
        showOk(mode === 'create2' ? 'Pattern saved. Merry Christmas!' : 'New pattern saved.');
        setTimeout(function () {
          hideLock(mode === 'create2' ? 'Pattern created.' : 'Pattern changed.');
        }, 700);
      }, function () {
        showError('Could not save the pattern. Please try again.', false);
      });
    }
  }

  function cancelChange() {
    if (!isChangeMode()) return;
    hideLock('Pattern not changed.');
  }

  function forgot() {
    var ok = window.confirm(
      'Reset your Christmas HQ pattern?\n\n' +
      'This clears the lock pattern on this device only. Your gifts, lists, Secret Santa and other saved data are NOT deleted.\n\n' +
      'You will then create a new pattern straight away.\n\n' +
      'Note: this is a simple local lock to stop casual peeking, not account security.'
    );
    if (!ok) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    stopCountdown();
    showLock('create1');
    setMsg('Pattern cleared. Create a new one.', false);
  }

  /* ---------- event isolation ----------
     Window capture runs before every document listener in the app,
     so touches / keys on the lock screen never reach the app (or
     start the background music) while it is showing. The lock's own
     handlers run right here, then the event is stopped. */
  function overlayActive() {
    return !!(S.locked && overlay && !overlay.classList.contains('hqpin-hidden'));
  }

  function swallow(e) {
    if (!overlayActive()) return;
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  }

  function onClick(e) {
    if (!overlayActive()) return;
    var target = e.target && e.target.closest ? e.target.closest('[data-hqpin-key]') : null;
    swallow(e);
    e.preventDefault();
    if (!target || !overlay.contains(target) || target.hidden) return;
    var k = target.getAttribute('data-hqpin-key');
    if (k === 'cancel') cancelChange();
    else if (k === 'forgot') forgot();
  }

  /* Keyboard fallback (desktop / accessibility): 1-9 add dots, Enter submits. */
  function onKey(e) {
    if (!overlayActive()) return;
    var k = e.key;
    swallow(e);
    if (e.type !== 'keydown') {
      if (e.type === 'keyup' && (k === 'Enter' || k === ' ') && overlay.contains(document.activeElement) && document.activeElement.tagName === 'BUTTON') return;
      e.preventDefault();
      return;
    }
    if (/^[1-9]$/.test(k)) {
      e.preventDefault();
      if (!canDraw() || S.drawing) return;
      if (el.grid.classList.contains('err') || el.grid.classList.contains('ok')) clearPattern();
      layoutDots();
      addDot(Number(k));
      drawLines();
    } else if (k === 'Enter') {
      if (overlay.contains(document.activeElement) && document.activeElement.tagName === 'BUTTON') return;
      e.preventDefault();
      if (canDraw() && !S.drawing) finishPattern();
    } else if (k === 'Backspace' || k === 'Delete') {
      e.preventDefault();
      if (canDraw() && !S.drawing && S.seq.length) {
        var n = S.seq.pop();
        el.dots[n - 1].classList.remove('on');
        drawLines();
      }
    } else if (k === 'Escape') {
      e.preventDefault();
      cancelChange();
    } else if (k === 'Tab') {
      var f = overlay.querySelectorAll('button:not([hidden])');
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    } else if (k === ' ') {
      if (!(overlay.contains(document.activeElement) && document.activeElement.tagName === 'BUTTON')) e.preventDefault();
    } else {
      e.preventDefault();
    }
  }

  function onTouchMove(e) {
    if (!overlayActive()) return;
    swallow(e);
    if (e.cancelable) e.preventDefault();   /* no page scroll / rubber-band while drawing */
  }

  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('pointermove', onPointerMove, true);
  window.addEventListener('pointerup', onPointerUp, true);
  window.addEventListener('pointercancel', onPointerUp, true);
  window.addEventListener('click', onClick, true);
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('keyup', onKey, true);
  window.addEventListener('keypress', onKey, true);
  window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
  ['mousedown', 'mouseup', 'mousemove', 'dblclick', 'contextmenu', 'submit', 'input', 'change', 'focusin', 'gesturestart'].forEach(function (type) {
    window.addEventListener(type, swallow, true);
  });
  ['touchstart', 'touchend', 'touchcancel', 'wheel'].forEach(function (type) {
    window.addEventListener(type, swallow, { capture: true, passive: true });
  });

  /* ---------- relock whenever the app is hidden ----------
     Locking at hide time (not on return) means the app-switcher
     snapshot shows the lock screen, and there is no flash of
     content when the app comes back. */
  function relock() {
    if (!patternEnabled) return;
    if (S.locked && !isChangeMode()) {
      S.drawing = false;
      S.pid = null;
      S.busy = false;
      if (el.santa) el.santa.classList.remove('show');
      clearPattern();
      return;
    }
    showLock(readRecord() ? 'unlock' : 'create1');
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      relock();
    } else if (S.locked) {
      startCountdownIfNeeded();
      fxStart();
    }
  });

  window.addEventListener('beforeunload', function () {
    try {
      if (!S.locked && !isChangeMode()) sessionStorage.setItem(REFRESH_KEY, String(Date.now()));
      else sessionStorage.removeItem(REFRESH_KEY);
    } catch (e) {}
  });
  window.addEventListener('pagehide', relock);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) relock();
  });
  document.addEventListener('freeze', relock);

  /* ---------- mount as early as <body> exists ---------- */
  if (document.body) {
    mount();
  } else {
    var bodyWatch = new MutationObserver(function () {
      if (document.body) {
        bodyWatch.disconnect();
        mount();
      }
    });
    bodyWatch.observe(root, { childList: true });
  }

  var bodyGuard = null;
  function guardBody() {
    if (bodyGuard || !document.body || !window.MutationObserver) return;
    bodyGuard = new MutationObserver(function () {
      if (!S.locked || !overlay) return;
      if (overlay.parentNode !== document.body || overlay !== document.body.lastElementChild) {
        document.body.appendChild(overlay);
      }
    });
    bodyGuard.observe(document.body, { childList: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    mount();
    guardBody();
    if (S.locked) { bringToFront(); fxResize(); }
    watchSettings();
  });

  /* Lock changed in another tab (e.g. reset there). */
  window.addEventListener('storage', function (e) {
    if(e.key===ENABLE_KEY){patternEnabled=e.newValue==='on';if(patternEnabled)showLock();else hideLock();var box=document.getElementById('hqPatternEnabled');if(box)box.checked=patternEnabled;}
    if (e.key === KEY && !S.locked && patternEnabled) showLock();
  });

  /* ---------- Settings: "Change pattern" card (injected after render) ---------- */
  var CARD_HTML =
    '<h3>&#128274; Christmas pattern lock</h3>' +
    '<label class="switch-label" for="hqPatternEnabled"><input type="checkbox" id="hqPatternEnabled"> Use pattern lock</label>' +
    '<p class="muted-note" style="margin-top:10px">When on, draw your pattern when opening the app or returning from the background. Turn it off to open Christmas HQ directly.</p>' +
    '<div class="btnrow"><button class="btn" type="button" data-hq-pin-action="change">Change pattern</button></div>' +
    '<p class="muted-note" style="margin-top:10px">Your choice is saved on this device. Switching off keeps your saved pattern and Christmas lists. This is a local privacy lock, not your account password.</p>' +
    '<p class="pill green" id="hqPinCardMsg" aria-live="polite" style="display:none;margin-top:10px"></p>';

  var cardNote = '';

  function updateCardMsg(text) {
    cardNote = text || '';
    var m = document.getElementById('hqPinCardMsg');
    if (!m) return;
    m.textContent = cardNote;
    m.style.display = cardNote ? '' : 'none';
  }

  function isSettingsScreen(screen) {
    return !!(screen && screen.querySelector('[data-action="export"]') && screen.querySelector('[data-action="reset"]'));
  }

  function injectCard() {
    if (document.getElementById('hqPinCard')) return;
    var screen = document.getElementById('screen');
    if (!isSettingsScreen(screen)) return;
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'hqPinCard';
    card.innerHTML = CARD_HTML;
    card.querySelector('#hqPatternEnabled').checked=patternEnabled;
    card.querySelector('[data-hq-pin-action="change"]').disabled=!patternEnabled;
    var firstCard = screen.querySelector('.card');
    if (firstCard && firstCard.parentNode) {
      firstCard.parentNode.insertBefore(card, firstCard.nextSibling);
    } else {
      screen.appendChild(card);
    }
    if (cardNote) updateCardMsg(cardNote);
  }

  var settingsWatching = false;
  function watchSettings() {
    if (settingsWatching) return;
    var screen = document.getElementById('screen');
    if (!screen) return;
    settingsWatching = true;
    injectCard();
    new MutationObserver(function () {
      if (!document.getElementById('hqPinCard')) injectCard();
    }).observe(screen, { childList: true, subtree: true });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-hq-pin-action="change"]') : null;
    if (!btn) return;
    e.preventDefault();
    updateCardMsg('');
    showLock(readRecord() ? 'chg-verify' : 'create1');
  });

  document.addEventListener('change',function(e){
    if(e.target.id!=='hqPatternEnabled')return;
    var next=e.target.checked;
    try{localStorage.setItem(ENABLE_KEY,next?'on':'off');}catch(err){e.target.checked=patternEnabled;updateCardMsg('Could not save this setting on this device.');return;}
    patternEnabled=next;
    var change=document.querySelector('[data-hq-pin-action="change"]');if(change)change.disabled=!next;
    if(next)showLock(readRecord()?'unlock':'create1');else hideLock('Pattern lock is off on this device.');
  });

  /* Small API for debugging / other scripts (no secrets exposed). */
  window.ChristmasHQPin = {
    isLocked: function () { return !!S.locked; },
    hasPattern: function () { return !!readRecord(); },
    lock: function () { showLock(); },
    changePattern: function () { showLock(readRecord() ? 'chg-verify' : 'create1'); },
    fxStats: function () { return { flakes: FX.flakes.length, stars: FX.stars.length, maxParticles: MAX_PARTS, reducedMotion: reducedMotion, lowPower: !!lowPower, secureHash: secureHash }; }
  };
})();
