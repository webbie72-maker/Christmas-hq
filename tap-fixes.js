/* Christmas HQ — fix lookalike tappables that previously did nothing. */
(function () {
  'use strict';
  if (window.__tapFixes) return;
  window.__tapFixes = true;

  var css = document.createElement('style');
  css.textContent = [
    /* Page intro banners look like big green buttons — make the affordance honest */
    '#screen .gift-intro.tf-tap{cursor:pointer;position:relative;-webkit-tap-highlight-color:rgba(201,162,39,.2);transition:transform .12s ease}',
    '#screen .gift-intro.tf-tap:active{transform:scale(.985)}',
    '#screen .gift-intro.tf-tap:focus-visible{outline:3px solid #c9a227;outline-offset:3px}',
    '#screen .gift-intro .tf-hint{display:block;margin-top:6px;font-size:11px;font-weight:800;letter-spacing:.04em;color:#f2cf78;opacity:.9}',
    /* Music dock body (not the play/⋯ buttons) */
    '#hqMusicDock.tf-ready .hq-music-info,#hqMusicDock.tf-ready .hq-music-icon{cursor:pointer;-webkit-tap-highlight-color:rgba(201,162,39,.18)}',
    '#hqMusicDock.tf-ready .hq-music-mini{cursor:pointer}',
    /* Magic activity cards (shell) */
    '#screen .list > .catalog-card.tf-act{cursor:pointer;position:relative;-webkit-tap-highlight-color:rgba(16,59,49,.12)}',
    '#screen .list > .catalog-card.tf-act:focus-visible{outline:3px solid #c9a227;outline-offset:2px}',
    '#screen .list > .catalog-card .tf-chev{color:#103b31;opacity:.55;font-size:22px;font-weight:700;margin-left:4px;line-height:1;align-self:center}',
    /* Home feature card body */
    '#screen .card.feature.tf-feat{cursor:pointer;-webkit-tap-highlight-color:rgba(201,162,39,.18)}',
    '#screen .card.feature.tf-feat:active{transform:scale(.99)}',
    /* Home hero — delightful tap */
    '#screen .hero.tf-hero{cursor:pointer;-webkit-tap-highlight-color:rgba(201,162,39,.15)}',
    /* Status pills are badges, not buttons */
    '#screen .pill{cursor:default!important;-webkit-user-select:none;user-select:none}',
    /* Tip toast + sparkle */
    '.tf-tip{position:fixed;left:50%;bottom:calc(102px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9200;max-width:min(92vw,420px);background:#103b31;color:#fff8df;border:2px solid #c9a227;border-radius:16px;padding:12px 14px;box-shadow:0 10px 28px rgba(0,0,0,.28);font-size:13px;line-height:1.45;text-align:center;animation:tfPop .22s ease}',
    '.tf-tip b{display:block;color:#f2cf78;font-size:11px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}',
    '.tf-burst{position:fixed;inset:0;pointer-events:none;z-index:9150;overflow:hidden}',
    '.tf-burst span{position:absolute;left:50%;top:40%;font-size:18px;animation:tfSpark .95s ease-out forwards}',
    '@keyframes tfSpark{0%{transform:translate(-50%,-50%) scale(.4);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1);opacity:0}}',
    '@keyframes tfPop{from{opacity:0;transform:translateX(-50%) translateY(10px)}}',
    /* Activity detail sheet — cream / forest / gold */
    '.tf-backdrop{position:fixed;inset:0;z-index:9000;background:rgba(10,30,24,.55);display:flex;align-items:flex-end;justify-content:center;animation:tfFade .18s ease}',
    '.tf-sheet{background:#fbf6ea;color:#103b31;width:100%;max-width:520px;max-height:90vh;overflow:auto;border-radius:24px 24px 0 0;padding:0 0 calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);border-top:4px solid #c9a227;animation:tfUp .22s ease;font-family:inherit}',
    '@media(min-width:700px){.tf-backdrop{align-items:center}.tf-sheet{border-radius:24px;max-height:85vh}}',
    '.tf-hero-band{position:relative;overflow:hidden;padding:26px 20px 20px;background:linear-gradient(135deg,#103b31 0%,#1a5c48 45%,#c9a227 140%);color:#fff;border-radius:20px 20px 0 0;text-align:center}',
    '.tf-hero-band .tf-em{font-size:56px;line-height:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,.25))}',
    '.tf-close{position:absolute;top:12px;right:12px;z-index:2;border:0;background:rgba(255,255,255,.22);color:#fff;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}',
    '.tf-body{padding:18px 20px 8px}',
    '.tf-sheet h2{margin:0 0 6px;font-size:22px;color:#103b31}',
    '.tf-pill{display:inline-block;margin:0 0 10px;background:#103b31;color:#f4e3b0;border-radius:999px;padding:3px 11px;font-size:12px;font-weight:700}',
    '.tf-intro{margin:0 0 12px;line-height:1.5;font-size:15px;color:#2a4438}',
    '.tf-sheet h3{margin:16px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#8a6d12}',
    '.tf-steps{margin:0;padding:0;list-style:none;counter-reset:tfstep}',
    '.tf-steps li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #ebe3cf;font-size:14px;line-height:1.45;counter-increment:tfstep}',
    '.tf-steps li:last-child{border-bottom:0}',
    '.tf-steps li::before{content:counter(tfstep);flex:none;width:28px;height:28px;border-radius:50%;background:#103b31;color:#f4e3b0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}',
    '.tf-tipbox{background:#fff;border:1px solid #e6dcc3;border-left:4px solid #c9a227;border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.45;margin:0}',
    '.tf-actions{display:grid;gap:8px;margin-top:16px}',
    '.tf-btn{width:100%;border:0;border-radius:14px;padding:13px;font-weight:800;font-size:15px;cursor:pointer}',
    '.tf-btn-primary{background:#103b31;color:#fff}',
    '.tf-btn-alt{background:#efe6d0;color:#103b31;border:1px solid #d9ccaa}',
    '@keyframes tfFade{from{opacity:0}}@keyframes tfUp{from{transform:translateY(40px);opacity:0}}',
    '@media(prefers-reduced-motion:reduce){.tf-burst,.tf-tip{animation:none}#screen .gift-intro.tf-tap,#screen .card.feature.tf-feat{transition:none}}'
  ].join('\n');
  document.head.appendChild(css);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function sparkle(atX, atY) {
    if (prefersReducedMotion()) return;
    var burst = document.createElement('div');
    burst.className = 'tf-burst';
    burst.setAttribute('aria-hidden', 'true');
    var glyphs = ['✨', '❄', '⭐', '🎄', '💫', '🎁', '★'];
    var n = 10;
    for (var i = 0; i < n; i++) {
      var sp = document.createElement('span');
      sp.textContent = glyphs[i % glyphs.length];
      var angle = (Math.PI * 2 * i) / n;
      var dist = 70 + Math.random() * 90;
      sp.style.left = (atX != null ? atX : window.innerWidth / 2) + 'px';
      sp.style.top = (atY != null ? atY : window.innerHeight * 0.38) + 'px';
      sp.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      sp.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      sp.style.animationDelay = i * 0.02 + 's';
      burst.appendChild(sp);
    }
    document.body.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 1100);
  }

  var tipTimer = null;
  function showTip(title, body, atX, atY) {
    sparkle(atX, atY);
    var old = document.querySelector('.tf-tip');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'tf-tip';
    el.setAttribute('role', 'status');
    el.innerHTML = '<b>' + esc(title) + '</b>' + esc(body);
    document.body.appendChild(el);
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(function () {
      el.remove();
      tipTimer = null;
    }, 3200);
  }

  var BANNER_TIPS = [
    'Put the Christmas playlist on before the to-do list — joy first, then jobs.',
    'One thoughtful present beats five rushed ones. Quality over quantity.',
    'Snap a “before decorations” photo so you can smile at the glow-up later.',
    'Keep a tiny “done for today” list — Christmas is a season, not a sprint.',
    'Leave one surprise tradition unplanned. The unexpected ones become legends.',
    'Serve something cold and fizzy alongside the hot food — summer Christmas win.',
    'Write three things you’re grateful for on a scrap of wrapping paper.',
    'Let kids invent the name of this year’s Christmas Day dessert.',
    'Text a cousin a silly Christmas emoji. Instant family warmth.',
    'Hide a spare roll of tape before wrapping day. Future-you will cheer.'
  ];
  var tipIndex = Math.floor(Math.random() * BANNER_TIPS.length);

  function nextBannerTip() {
    var t = BANNER_TIPS[tipIndex % BANNER_TIPS.length];
    tipIndex += 1;
    return t;
  }

  var ACTIVITY_HOW = {
    'Write a letter to Santa': {
      steps: [
        'Find paper, a pencil, and a comfy writing spot.',
        'Start with “Dear Santa” and a cheerful hello.',
        'Share one kind thing you did this year, then your wishlist.',
        'Add a drawing or a joke for Santa’s elves.',
        'Sign your name, fold it neatly, and tuck it somewhere special — or open Santa letter in Magic.'
      ],
      tip: 'Keep the wishlist short and sweet — Santa loves manners almost as much as cookies.'
    },
    'Decorate gingerbread': {
      steps: [
        'Bake or buy plain gingerbread shapes and let them cool.',
        'Mix icing a little thick so it holds its shape.',
        'Pipe outlines first, then flood the middle.',
        'Add sprinkles while the icing is still wet.',
        'Let them set, then share (or hide one for Christmas Eve).'
      ],
      tip: 'A zip-lock bag with the corner snipped off makes a perfect no-fuss piping bag.'
    },
    'Make a Christmas lights trail': {
      steps: [
        'Open Light trail in Explore and note a few neighbourhood favourites.',
        'Pack water, a light jumper, and a phone charger.',
        'Drive or stroll slowly — no rushing the sparkle.',
        'Vote on the “best display” as a family.',
        'Finish with a treat at home and tick it off your list.'
      ],
      tip: 'Go just after dusk — lights look brightest and kids are still cheerful.'
    },
    'Christmas charades': {
      steps: [
        'Write festive words on scraps of paper and fold them into a bowl.',
        'Split into teams (or go free-for-all).',
        'Act it out — no talking, no pointing at objects that spell it.',
        'First to guess wins the scrap; play to a set score.',
        'Crown a Charades Champion with a paper crown.'
      ],
      tip: 'Mix easy words (“reindeer”) with trickier ones (“fruit mince”) for all ages.'
    },
    'Wrap-a-present race': {
      steps: [
        'Give everyone the same size box and a length of paper.',
        'Ready, set, wrap — neatness counts as much as speed.',
        'Add a bow or tag for bonus style points.',
        'Judge on tidy corners and festive flair.',
        'Loser chooses the next Christmas movie.'
      ],
      tip: 'Pre-cut paper and have tape strips ready so little hands stay in the game.'
    },
    'Christmas movie & popcorn night': {
      steps: [
        'Open Movie night and pick a film everyone can enjoy.',
        'Pop corn (or pour chips) and dim the main lights.',
        'Phones in a bowl until the credits.',
        'Pause once for a stretch and a refill.',
        'Mark it watched and note a favourite line.'
      ],
      tip: 'Blankets + fairy lights beat a perfect cinema setup every time.'
    },
    'Make Christmas Eve boxes': {
      steps: [
        'Find a shoe box or gift bag for each child.',
        'Add PJs, a small snack, and a short story or activity.',
        'Tuck in one tiny surprise (sticker, ornament, crayon).',
        'Wrap or decorate the box together.',
        'Open after dinner on Christmas Eve.'
      ],
      tip: 'The magic is the ritual — keep the contents simple and special.'
    },
    'DIY ornaments': {
      steps: [
        'Gather plain baubles, paint markers, or salt dough.',
        'Write names and the year on each one.',
        'Add dots, stripes, or fingerprints for kids’ art.',
        'Let them dry fully before hanging.',
        'Hang on the tree with a story about who made which.'
      ],
      tip: 'Date every ornament — future Christmases will thank you.'
    },
    'Family carols karaoke': {
      steps: [
        'Open Magic → Music or queue a carol playlist.',
        'Print or jot a lyric sheet for shy singers.',
        'Pass a wooden-spoon mic around the room.',
        'Award silly prizes: Loudest Harmony, Best Dance Moves.',
        'End with one quiet favourite sung together.'
      ],
      tip: 'Volume down, hearts up — harmony optional, enthusiasm mandatory.'
    },
    'Send thank-you cards': {
      steps: [
        'List people who helped, hosted, or gifted this year.',
        'Write one specific sentence about why you’re grateful.',
        'Add a doodle or photo if you like.',
        'Post, hand-deliver, or send a photo of the card.',
        'Tick them off with a little cheer.'
      ],
      tip: 'Specific beats fancy — “thanks for the coffee chat” means more than perfect handwriting.'
    },
    'Make rocky road': {
      steps: [
        'Melt chocolate gently, then cool slightly.',
        'Stir in biscuits, marshmallows, and dried fruit.',
        'Press into a lined tin and chill until firm.',
        'Cut into squares with a warm knife.',
        'Bag a few for gifts, keep a few for “quality control.”'
      ],
      tip: 'A pinch of salt on top makes the chocolate taste even richer.'
    },
    'Family silly Christmas photos': {
      steps: [
        'Raid the house for hats, tinsel, and silly props.',
        'Set a 10-second timer and pile in.',
        'Do one serious pose and three ridiculous ones.',
        'Pick a favourite for the fridge or chat group.',
        'Print one later for the Christmas memory box.'
      ],
      tip: 'The blink / laugh shots are always the keepers.'
    },
    'Christmas scavenger hunt': {
      steps: [
        'Write 8–12 festive clues or object names.',
        'Hide them around the house or garden.',
        'Hand out the first clue and start the clock.',
        'Cheer every find — no spoilers from adults.',
        'Finish with a shared snack as the “treasure.”'
      ],
      tip: 'Picture clues work brilliantly for pre-readers.'
    },
    'Decorate a mini tree': {
      steps: [
        'Pick a small tree, branch in a vase, or tabletop tree.',
        'Let kids own the colour theme.',
        'Hang lightweight ornaments and a paper star.',
        'Add a short string of warm lights if you have them.',
        'Place it somewhere they can admire daily.'
      ],
      tip: 'Ownership is the gift — resist re-arranging their masterpiece.'
    },
    'A Christmas picnic': {
      steps: [
        'Pack cold meats, salad, fruit, and something sweet.',
        'Choose a shady park, beach, or backyard spot.',
        'Bring a picnic rug, sunscreen, and a speaker for carols.',
        'Play a quick game after eating.',
        'Leave the place tidier than you found it.'
      ],
      tip: 'Frozen grapes double as snacks and mini ice packs.'
    },
    'Create a new family tradition': {
      steps: [
        'Brainstorm three tiny ideas that feel joyful, not heavy.',
        'Vote on one to try this year.',
        'Write it on the calendar so it actually happens.',
        'Do it once, then ask: keep, tweak, or retire?',
        'Name the tradition so it feels official.'
      ],
      tip: 'The best traditions are repeatable on a busy day — keep them light.'
    }
  };

  var ACTIVITY_ROUTES = {
    'Write a letter to Santa': ['magic', 'Santa letter'],
    'Make a Christmas lights trail': ['explore', 'Light trail'],
    'Christmas movie & popcorn night': ['magic', 'Movie night']
  };

  var openSheetEl = null;
  var lastFocus = null;

  function closeSheet() {
    if (!openSheetEl) return;
    openSheetEl.remove();
    openSheetEl = null;
    document.removeEventListener('keydown', onSheetKey, true);
    if (lastFocus && document.contains(lastFocus)) {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function onSheetKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
    }
  }

  function openActivitySheet(card) {
    closeSheet();
    var titleEl = card.querySelector('.body b, b');
    var descEl = card.querySelector('.body small, small');
    var pillEl = card.querySelector('.pill');
    var emEl = card.querySelector('.em');
    var title = titleEl ? titleEl.textContent.trim() : 'Christmas activity';
    var desc = descEl ? descEl.textContent.trim() : '';
    var type = pillEl ? pillEl.textContent.trim() : 'Activity';
    var em = emEl ? emEl.textContent.trim() : '🎄';
    var how = ACTIVITY_HOW[title] || {
      steps: [
        'Gather everyone who wants to join.',
        'Set a playful mood — carols help.',
        'Collect simple supplies you already have.',
        'Do the activity together without rushing.',
        'Take one photo or share one laugh, then celebrate.'
      ],
      tip: 'Shrink the plan until it feels easy — that’s when the fun shows up.'
    };
    var route = ACTIVITY_ROUTES[title];
    var stepsHtml = how.steps.map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join('');

    var actions = [];
    if (route) {
      actions.push(
        '<button type="button" class="tf-btn tf-btn-primary" data-tf-act="route" data-tab="' +
          esc(route[0]) +
          '" data-sub="' +
          esc(route[1]) +
          '">Open activity →</button>'
      );
    }
    var markBtn = card.querySelector('[data-action="activity"]');
    if (markBtn) {
      var idx = markBtn.getAttribute('data-index') || '';
      var doneLabel = (markBtn.textContent || '').trim(); var done = /^\s*✓/.test(doneLabel) || /Already done|Done ✓/i.test(doneLabel);
      actions.push(
        '<button type="button" class="tf-btn tf-btn-alt" data-tf-act="mark" data-index="' +
          esc(idx) +
          '">' +
          (done ? '✓ Already done — tap to undo' : 'Mark done') +
          '</button>'
      );
    }
    actions.push('<button type="button" class="tf-btn tf-btn-alt" data-tf-act="close">Keep browsing</button>');

    lastFocus = card;
    var bd = document.createElement('div');
    bd.className = 'tf-backdrop';
    bd.innerHTML =
      '<div class="tf-sheet" role="dialog" aria-modal="true" aria-labelledby="tfActTitle">' +
      '<div class="tf-hero-band"><button type="button" class="tf-close" aria-label="Close">×</button>' +
      '<div class="tf-em" aria-hidden="true">' +
      esc(em) +
      '</div></div>' +
      '<div class="tf-body"><span class="tf-pill">' +
      esc(type) +
      '</span><h2 id="tfActTitle">' +
      esc(title) +
      '</h2><p class="tf-intro">' +
      esc(desc) +
      '</p><h3>How to make it happen</h3><ol class="tf-steps">' +
      stepsHtml +
      '</ol><h3>Festive tip</h3><p class="tf-tipbox">' +
      esc(how.tip) +
      '</p><div class="tf-actions">' +
      actions.join('') +
      '</div></div></div>';

    bd.addEventListener('click', function (e) {
      if (e.target === bd || e.target.closest('.tf-close') || e.target.closest('[data-tf-act="close"]')) {
        closeSheet();
        return;
      }
      var routeBtn = e.target.closest('[data-tf-act="route"]');
      if (routeBtn) {
        var tab = routeBtn.getAttribute('data-tab');
        var sub = routeBtn.getAttribute('data-sub');
        closeSheet();
        if (typeof go === 'function') go(tab, sub);
        return;
      }
      var mark = e.target.closest('[data-tf-act="mark"]');
      if (mark) {
        var index = mark.getAttribute('data-index');
        var real = document.querySelector('#screen [data-action="activity"][data-index="' + index + '"]');
        closeSheet();
        if (real) real.click();
        else if (typeof notice === 'function') notice('Activity updated.');
      }
    });

    document.body.appendChild(bd);
    openSheetEl = bd;
    document.addEventListener('keydown', onSheetKey, true);
    var closeBtn = bd.querySelector('.tf-close');
    if (closeBtn) closeBtn.focus();
  }

  function enhance() {
    var intros = document.querySelectorAll('#screen .gift-intro:not([data-tf])');
    for (var i = 0; i < intros.length; i++) {
      var intro = intros[i];
      intro.setAttribute('data-tf', 'banner');
      intro.classList.add('tf-tap');
      intro.setAttribute('role', 'button');
      intro.setAttribute('tabindex', '0');
      intro.setAttribute('aria-label', 'Festive tip — tap for a little Christmas magic');
      if (!intro.querySelector('.tf-hint')) {
        var hint = document.createElement('span');
        hint.className = 'tf-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.textContent = '✦ tap for a festive tip';
        intro.appendChild(hint);
      }
    }

    var dock = document.getElementById('hqMusicDock');
    if (dock && !dock.classList.contains('tf-ready')) {
      dock.classList.add('tf-ready');
      dock.setAttribute('data-tf', 'music');
    }

    var acts = document.querySelectorAll('#screen .list > .catalog-card:not([data-tf]):not([data-ed]):not([data-gd])');
    for (var a = 0; a < acts.length; a++) {
      var card = acts[a];
      /* Only Magic-style activity cards (have Mark done / Open activity / Find instructions) */
      if (!card.querySelector('[data-action="activity"], [data-action="activityOpen"], a.btn')) continue;
      var title = card.querySelector('.body b, b');
      card.setAttribute('data-tf', 'activity');
      card.classList.add('tf-act');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-label', 'Open activity: ' + (title ? title.textContent.trim() : 'activity'));
      if (!card.querySelector('.tf-chev')) {
        var chev = document.createElement('span');
        chev.className = 'tf-chev';
        chev.setAttribute('aria-hidden', 'true');
        chev.textContent = '›';
        card.appendChild(chev);
      }
    }

    var feats = document.querySelectorAll('#screen .card.feature:not([data-tf])');
    for (var f = 0; f < feats.length; f++) {
      var feat = feats[f];
      if (!feat.querySelector('[data-action="shortcut"]')) continue;
      feat.setAttribute('data-tf', 'feature');
      feat.classList.add('tf-feat');
      feat.setAttribute('role', 'button');
      feat.setAttribute('tabindex', '0');
      feat.setAttribute('aria-label', 'Find festive things to do');
    }

    var heroes = document.querySelectorAll('#screen .hero:not([data-tf])');
    for (var h = 0; h < heroes.length; h++) {
      var hero = heroes[h];
      hero.setAttribute('data-tf', 'hero');
      hero.classList.add('tf-hero');
      hero.setAttribute('role', 'button');
      hero.setAttribute('tabindex', '0');
      hero.setAttribute('aria-label', 'Countdown — tap for a festive tip');
    }
  }

  function eventPoint(e) {
    var x = e.clientX;
    var y = e.clientY;
    if ((x == null || y == null) && e.changedTouches && e.changedTouches[0]) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    }
    return { x: x, y: y };
  }

  function activateBanner(intro, e) {
    var pt = eventPoint(e || {});
    var heading = intro.querySelector('h2');
    var label = heading ? heading.textContent.trim() : 'Christmas tip';
    showTip(label.length > 40 ? 'Festive tip' : label, nextBannerTip(), pt.x, pt.y);
  }

  function activateMusic(dock, e) {
    if (!dock) return;
    var t = e && e.target;
    if (t && t.closest && t.closest('button, a, input, select, textarea, label, [data-hq-music]')) return false;
    var info = dock.querySelector('.hq-music-info small');
    var smallText = info ? info.textContent || '' : '';
    var hasSongs = !!dock.querySelector('[data-hq-music-select] option[value]:not([value=""])');
    /* Subtitle invites Magic → Music and there are no songs: go there */
    if (/Magic/i.test(smallText) && !hasSongs && typeof go === 'function') {
      go('magic', 'Music');
      if (typeof notice === 'function') notice('Add a Christmas song to get the party started.');
      return true;
    }
    dock.classList.toggle('open');
    return true;
  }

  function activateFeature(feat) {
    var btn = feat.querySelector('[data-action="shortcut"]');
    if (btn) {
      btn.click();
      return true;
    }
    if (typeof go === 'function') {
      go('explore');
      return true;
    }
    return false;
  }

  function activateHero(hero, e) {
    var pt = eventPoint(e || {});
    showTip('Countdown cheer', nextBannerTip(), pt.x, pt.y);
  }

  document.addEventListener(
    'click',
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;

      /* Never steal clicks from real controls */
      if (t.closest('.gd-backdrop, .ed-backdrop, .tf-backdrop, #hqPinLock, #hqChatModal')) return;

      var intro = t.closest('#screen .gift-intro.tf-tap, #screen .gift-intro[data-tf="banner"]');
      if (intro) {
        e.preventDefault();
        e.stopPropagation();
        activateBanner(intro, e);
        return;
      }

      var dock = t.closest('#hqMusicDock');
      if (dock) {
        if (t.closest('button, a, input, select, textarea, label, [data-hq-music]')) return;
        if (activateMusic(dock, e)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      var act = t.closest('#screen .list > .catalog-card.tf-act, #screen .list > .catalog-card[data-tf="activity"]');
      if (act) {
        if (t.closest('button, a, input, select, textarea, label')) return;
        e.preventDefault();
        e.stopPropagation();
        openActivitySheet(act);
        return;
      }

      var feat = t.closest('#screen .card.feature.tf-feat, #screen .card.feature[data-tf="feature"]');
      if (feat) {
        if (t.closest('button, a, input, select, textarea, label')) return;
        e.preventDefault();
        e.stopPropagation();
        activateFeature(feat);
        return;
      }

      var hero = t.closest('#screen .hero.tf-hero, #screen .hero[data-tf="hero"]');
      if (hero) {
        if (t.closest('button, a, input, select, textarea, label')) return;
        e.preventDefault();
        e.stopPropagation();
        activateHero(hero, e);
        return;
      }
    },
    true
  );

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('.gift-intro.tf-tap') && t.classList.contains('gift-intro')) {
      e.preventDefault();
      activateBanner(t, e);
      return;
    }
    if (t.classList.contains('tf-act') || t.getAttribute('data-tf') === 'activity') {
      e.preventDefault();
      openActivitySheet(t);
      return;
    }
    if (t.classList.contains('tf-feat') || t.getAttribute('data-tf') === 'feature') {
      e.preventDefault();
      activateFeature(t);
      return;
    }
    if (t.classList.contains('tf-hero') || t.getAttribute('data-tf') === 'hero') {
      e.preventDefault();
      activateHero(t, e);
    }
  });

  new MutationObserver(enhance).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  enhance();
})();
