/* Explore: tap Decor / Discover idea cards for a fun in-app how-to sheet. */
(function () {
  'use strict';
  if (window.__exploreDetailSheet) return;
  window.__exploreDetailSheet = true;

  var LS_CHECK = 'hq-explore-checklist-v1';
  var LS_DONE = 'hq-explore-done-v1';

  var css = document.createElement('style');
  css.textContent = [
    '#screen .catalog:not(#giftResults) .catalog-card{cursor:pointer;position:relative;-webkit-tap-highlight-color:rgba(16,59,49,.12)}',
    '#screen .catalog:not(#giftResults) .catalog-card:focus-visible{outline:3px solid #c9a227;outline-offset:2px}',
    '#screen .tap-card[data-action="mapSearch"],#screen .tap-card[data-action="lightSearch"]{cursor:pointer;position:relative}',
    '#screen .tap-card[data-action="mapSearch"]:focus-visible,#screen .tap-card[data-action="lightSearch"]:focus-visible{outline:3px solid #c9a227;outline-offset:2px}',
    '.ed-chev{color:#103b31;opacity:.55;font-size:22px;font-weight:700;margin-left:4px;line-height:1;align-self:center}',
    '.tap-card .ed-chev{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:20px}',
    '.ed-badge{position:absolute;top:8px;right:10px;font-size:14px;line-height:1;z-index:1}',
    '.tap-card .ed-badge{top:8px;right:28px}',
    '.ed-backdrop{position:fixed;inset:0;z-index:9000;background:rgba(10,30,24,.55);display:flex;align-items:flex-end;justify-content:center;animation:edFade .18s ease}',
    '.ed-sheet{background:#fbf6ea;color:#103b31;width:100%;max-width:520px;max-height:90vh;overflow:auto;border-radius:24px 24px 0 0;padding:0 0 calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.3);border-top:4px solid #c9a227;animation:edUp .22s ease;font-family:inherit}',
    '@media(min-width:700px){.ed-backdrop{align-items:center}.ed-sheet{border-radius:24px;max-height:85vh}}',
    '.ed-hero{position:relative;overflow:hidden;padding:28px 20px 22px;background:linear-gradient(135deg,#103b31 0%,#1a5c48 45%,#c9a227 140%);color:#fff;border-radius:20px 20px 0 0;text-align:center;min-height:140px}',
    '.ed-hero-em{font-size:64px;line-height:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,.25));position:relative;z-index:1}',
    '.ed-sparkle{position:absolute;inset:0;pointer-events:none;overflow:hidden}',
    '.ed-sparkle i{position:absolute;width:6px;height:6px;border-radius:50%;background:#fff;opacity:.85;animation:edFall linear infinite}',
    '.ed-sparkle i:nth-child(odd){width:4px;height:4px;background:#f4e3b0;border-radius:0;transform:rotate(45deg)}',
    '@keyframes edFall{0%{transform:translateY(-12px) rotate(0);opacity:0}10%{opacity:.9}100%{transform:translateY(160px) rotate(180deg);opacity:0}}',
    '@media(prefers-reduced-motion:reduce){.ed-sparkle,.ed-burst{display:none!important}.ed-backdrop,.ed-sheet{animation:none}}',
    '.ed-close{position:absolute;top:12px;right:12px;z-index:2;border:0;background:rgba(255,255,255,.22);color:#fff;width:36px;height:36px;border-radius:50%;font-size:20px;cursor:pointer}',
    '.ed-body{padding:18px 20px 8px}',
    '.ed-sheet h2{margin:0 0 6px;font-size:22px;color:#103b31}',
    '.ed-intro{margin:0 0 14px;line-height:1.5;font-size:15px;color:#2a4438}',
    '.ed-sheet h3{margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#8a6d12}',
    '.ed-steps{margin:0;padding:0;list-style:none;counter-reset:edstep}',
    '.ed-steps li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #ebe3cf;font-size:14px;line-height:1.45;counter-increment:edstep}',
    '.ed-steps li:last-child{border-bottom:0}',
    '.ed-steps li::before{content:counter(edstep);flex:none;width:28px;height:28px;border-radius:50%;background:#103b31;color:#f4e3b0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}',
    '.ed-check{list-style:none;margin:0;padding:0}',
    '.ed-check li{display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:6px;background:#fff;border:1px solid #e6dcc3;border-radius:12px;font-size:14px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.ed-check li.is-on{background:#eaf3e7;border-color:#b7d4bc}',
    '.ed-check input{accent-color:#2c7554;width:18px;height:18px;flex:none}',
    '.ed-tip,.ed-kids{background:#fff;border:1px solid #e6dcc3;border-radius:14px;padding:12px 14px;font-size:14px;line-height:1.45;margin:0}',
    '.ed-tip{border-left:4px solid #c9a227}',
    '.ed-kids{border-left:4px solid #103b31;margin-top:10px}',
    '.ed-actions{display:grid;gap:8px;margin-top:18px}',
    '.ed-btn.ed-btn-map{background:#fff;color:#103b31;border:1.5px solid #c9a227}',
    '.ed-btn{width:100%;border:0;border-radius:14px;padding:13px;font-weight:800;font-size:15px;cursor:pointer}',
    '.ed-btn-plan{background:#103b31;color:#fff}',
    '.ed-btn-done{background:#efe6d0;color:#103b31;border:1px solid #d9ccaa}',
    '.ed-btn-done.is-done{background:#eaf3e7;color:#2c6945;border-color:#b7d4bc}',
    '.ed-burst{position:fixed;inset:0;pointer-events:none;z-index:9100;overflow:hidden}',
    '.ed-burst span{position:absolute;left:50%;top:45%;font-size:18px;animation:edPop .9s ease-out forwards}',
    '@keyframes edPop{0%{transform:translate(-50%,-50%) scale(.4);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1);opacity:0}}',
    '@keyframes edFade{from{opacity:0}}@keyframes edUp{from{transform:translateY(40px);opacity:0}}'
  ].join('\n');
  document.head.appendChild(css);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function slug(title) {
    return String(title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'idea';
  }

  function loadJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return {};
      var v = JSON.parse(raw);
      return v && typeof v === 'object' ? v : {};
    } catch (e) {
      return {};
    }
  }

  function saveJSON(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  }

  function isDone(id) {
    return !!loadJSON(LS_DONE)[id];
  }

  function setDone(id, val) {
    var all = loadJSON(LS_DONE);
    if (val) all[id] = true;
    else delete all[id];
    saveJSON(LS_DONE, all);
  }

  function getChecks(id) {
    var all = loadJSON(LS_CHECK);
    return all[id] && typeof all[id] === 'object' ? all[id] : {};
  }

  function setCheck(id, index, on) {
    var all = loadJSON(LS_CHECK);
    if (!all[id] || typeof all[id] !== 'object') all[id] = {};
    if (on) all[id][index] = true;
    else delete all[id][index];
    saveJSON(LS_CHECK, all);
  }

  /* Content keyed by exact card title */
  var CONTENT = {
    'The classic tree': {
      cat: 'Decor',
      intro: 'Turn a bare tree into the glowing heart of your home. Take it slow, play carols, and make every bauble feel like a memory.',
      steps: [
        'Fluff every branch outward so the tree looks full and soft, not flat against the wall.',
        'Weave warm-white lights deep into the branches first — work from the trunk out, then step back and fill dark spots.',
        'Hang your largest ornaments evenly around the tree so it feels balanced from every angle.',
        'Fill gaps with medium and small decorations, mixing shiny, matte, and handmade pieces.',
        'Add ribbon or garland in loose S-curves rather than tight rings.',
        'Finish with one meaningful family ornament near the front, then crown the top and switch the lights on together.'
      ],
      need: ['Tree (real or artificial)', 'Warm-white lights', 'Large + small ornaments', 'A special family ornament', 'Optional ribbon or garland', 'Tree topper'],
      tip: 'Turn the room lights down before you judge the tree — what looks sparse in daylight often sparkles beautifully at night.',
      kids: 'Handing up ornaments, choosing the “star of the night,” and counting how many red baubles they can find.'
    },
    'Christmas table': {
      cat: 'Decor',
      intro: 'A beautiful table doesn’t need a department-store budget — just two colours, a bit of greenery, and soft candlelight.',
      steps: [
        'Pick a simple colour pair (forest + gold, cream + red, or coastal blue + white) and stick to it.',
        'Lay a runner or folded cloth down the centre — leave room for plates and elbows.',
        'Add low greenery: eucalyptus, pine, or even clipped garden leaves in a line.',
        'Nestle battery candles or tealights among the greenery so faces stay lit and conversation easy.',
        'Fold napkins with a sprig of greenery or a cinnamon stick tucked in.',
        'Set water glasses and a shared jug of icy water — especially welcome on a warm Australian Christmas Day.'
      ],
      need: ['Table runner or cloth', 'Two accent colours', 'Greenery or leaves', 'Battery candles / tealights', 'Napkins', 'Place settings'],
      tip: 'Keep centrepieces low so everyone can see each other — Christmas magic is faces, not towering florals.',
      kids: 'Folding napkins, placing name cards, and arranging the candle “path” down the middle.'
    },
    'Festive front door': {
      cat: 'Decor',
      intro: 'Your front door is the first “Merry Christmas” guests receive. Make it cheerful, simple, and weather-smart.',
      steps: [
        'Choose one hero piece: a wreath, a swag, or a big outdoor bow.',
        'Hang it securely with a proper wreath hanger or outdoor-safe hook — no mystery nails.',
        'Add a short string of outdoor-rated fairy lights around the frame or wreath.',
        'Tuck in one welcome touch: a doormat, a lantern, or a potted plant with a red ribbon.',
        'Check that lights and cords stay clear of the walkway and don’t create a trip hazard.',
        'Step to the footpath at dusk and admire your handiwork — adjust until it feels inviting.'
      ],
      need: ['Wreath or door swag', 'Outdoor-safe hanger', 'Outdoor-rated fairy lights', 'One welcome accent', 'Spare batteries / timer'],
      tip: 'A timer on the lights means your door twinkles every evening without you remembering to flip the switch.',
      kids: 'Helping choose the wreath ribbon colour and pressing the “test lights” button.'
    },
    'Wrapping station': {
      cat: 'Decor',
      intro: 'Set up once, wrap all week. A tidy station turns chaotic gift-wrapping into a cosy production line.',
      steps: [
        'Claim a clear table or floor corner and lay down a cut-proof mat or old sheet.',
        'Group supplies: paper rolls, bags, tissue, tape, scissors, tags, and ribbon in jars or trays.',
        'Make a “named box” or bag per person so finished gifts don’t get mixed up.',
        'Wrap similar-sized gifts in batches — it’s faster than switching paper every time.',
        'Write tags as you go (tired brains invent mystery presents).',
        'Pack leftover scraps into a small “emergency kit” for last-minute gifts.'
      ],
      need: ['Wrapping paper or reusable bags', 'Tape & scissors', 'Ribbon / twine', 'Gift tags & pen', 'Tissue paper', 'Named boxes or tubs'],
      tip: 'Keep a “too-pretty-to-toss” scrap pile — kids love making gift toppers from leftover ribbon curls.',
      kids: 'Sticking tags, curling ribbon, and decorating plain bags with stickers or drawings.'
    },
    'Outdoor light setup': {
      cat: 'Decor',
      intro: 'Safe, glowing, and glorious — outdoor lights are the neighbourhood’s favourite free show when done thoughtfully.',
      steps: [
        'Plan your outline first: roofline, tree, path, or balcony — sketch it on paper if it helps.',
        'Use only lights and extension leads rated for outdoor Australian conditions.',
        'Keep connections off the ground and away from puddles; use weatherproof covers where needed.',
        'Secure cables with outdoor clips — never staples through the cord — and keep walkways clear.',
        'Plug into a protected outlet or outdoor timer; test a small section before finishing the whole house.',
        'Do a night walk-around: fix dark patches, then enjoy a hot chocolate victory lap.'
      ],
      need: ['Outdoor-rated lights', 'Outdoor extension lead', 'Cable clips', 'Timer or RCD-protected outlet', 'Ladder (with a spotter)', 'Gloves'],
      tip: 'Warm white feels cosy; a single colour theme usually looks more magical than every hue at once.',
      kids: 'Choosing the display theme and doing the official “sparkle inspection” from the driveway.'
    },
    'Australian summer Christmas': {
      cat: 'Decor',
      intro: 'Sun, shade, ice, and good company — design your celebration for a proper Perth-style summer Christmas.',
      steps: [
        'Set seating in the shade first: verandah, sail, umbrella, or under a tree.',
        'Create a drink station with icy water, cordial, and a bucket of ice that can be topped up easily.',
        'Add light décor that won’t wilt: bunting, battery lights, and a simple tablecloth that can handle a breeze.',
        'Plan a cool-down corner: sunscreen, hats, and a spray bottle of water for little ones.',
        'Keep perishable food in the shade or on ice until serving time.',
        'As the evening cools, switch on fairy lights and let the backyard glow.'
      ],
      need: ['Shade (umbrella / sail)', 'Esky or ice buckets', 'Drink station glasses/cups', 'Sunscreen & hats', 'Outdoor seating', 'Battery fairy lights'],
      tip: 'Freeze bunches of grapes or berries as edible ice cubes — pretty in drinks and a hit with kids.',
      kids: 'Filling the ice bucket, hanging bunting, and being official “water jug refillers.”'
    },
    'Christmas lights drive': {
      cat: 'Family',
      intro: 'Pile into the car (or stroll the best streets), queue up carols, and hunt for the brightest blocks like a festive treasure map.',
      steps: [
        'Pick a suburb or two and a start time just after dusk — lights look best when the sky still has a little colour.',
        'Pack water, snacks, and a soft blanket for back-seat cosiness.',
        'Start a shared “wow list”: everyone calls out their favourite display.',
        'Park legally, keep noise neighbour-friendly, and never block driveways.',
        'Hop out only where it’s safe and welcome; take photos without lingering on private lawns.',
        'End with hot chocolate or ice cream and vote on “Best Lights of the Night.”'
      ],
      need: ['Charged phone for maps', 'Snacks & water', 'Playlist of carols', 'Camera or phone', 'Small notepad for favourites', 'Cash/card for a treat stop'],
      tip: 'Save your favourite stops in Christmas HQ’s Light trail so you can build a driving route next time.',
      kids: 'Being the official “sparkle spotters” and awarding imaginary medals to the best houses.'
    },
    'Christmas markets': {
      cat: 'Family',
      intro: 'Wander, nibble, and find handmade treasures — markets are half shopping, half summer-evening adventure.',
      steps: [
        'Choose a market night and check opening hours before you go (listings change each year).',
        'Set a small spending budget and give each person a “one special find” mission.',
        'Eat something festive first so hunger doesn’t make every stall feel urgent.',
        'Collect business cards or notes for makers you love — perfect for next year’s gifts.',
        'Look for experiences too: carols, craft stalls, or photo spots — not only shopping.',
        'Leave while energy is high; debrief favourites on the way home.'
      ],
      need: ['Reusable tote bag', 'Water bottle', 'Small budget / cash', 'Comfy shoes', 'Phone for notes/photos', 'Light jacket for evening breeze'],
      tip: 'Go early for calm browsing, or later for atmosphere — decide which vibe your crew needs tonight.',
      kids: 'Choosing one craft to admire, counting fairy lights, and picking a shared treat to split.'
    },
    'Santa experiences': {
      cat: 'Family',
      intro: 'Meeting Santa (or doing a creative Santa alternative) can be magical when you plan for short waits and happy faces.',
      steps: [
        'Decide your style: classic Santa photo, letters to Santa, or a homemade “Santa workshop” at home.',
        'If visiting Santa, check session times and whether bookings are needed.',
        'Prep kids with a short chat: what they’d like to say, and that Santa is busy but kind.',
        'Pack a backup activity (stickers, snack) for any queue time.',
        'Take photos quickly, then celebrate with a small treat so the memory sticks.',
        'At home, leave a “Santa snack plate” ready for Christmas Eve as a sweet tradition.'
      ],
      need: ['Booking details or home plan', 'Outfit / festive top', 'Snack & water', 'Camera or phone', 'Small thank-you for helpers', 'Letter kit (paper + stamps optional)'],
      tip: 'If queues look long, switch to Plan B: write letters, bake cookies, or do a Santa video call with a relative in costume.',
      kids: 'Writing or drawing a letter to Santa and choosing the carrot for the reindeer.'
    },
    'Carols & concerts': {
      cat: 'Family',
      intro: 'Singing under summer stars is peak Christmas joy — whether it’s a park carol night or a living-room singalong.',
      steps: [
        'Pick your format: local carols by candlelight, a community concert, or a backyard playlist night.',
        'Arrive early for a good spot; bring a rug and low chairs if it’s outdoors.',
        'Print or save lyrics for two or three favourites so everyone can join in.',
        'Pack soft lighting (battery candles) and keep flames out of dry grass.',
        'Sing the silly songs as loudly as the sacred ones — joy counts.',
        'Finish with a shared dessert and a photo of the whole crew glowing.'
      ],
      need: ['Rug or chairs', 'Water & light snacks', 'Battery candles', 'Lyrics on phone/paper', 'Insect repellent (outdoors)', 'A festive playlist backup'],
      tip: 'If little voices tire early, agree on “three songs then dance break” — keeps the night fun, not forced.',
      kids: 'Conducting with a candy-cane baton and choosing the final song of the night.'
    },
    'Christmas dining': {
      cat: 'Family',
      intro: 'Whether you’re booking a long lunch or hosting at home, festive dining is about pace, shade, and happy plates.',
      steps: [
        'Choose dine-out or host-in, then lock the date so everyone can plan travel and naps.',
        'For restaurants, book early and note allergy needs when you reserve.',
        'For home, finalise the menu and which dishes can be made the day before.',
        'Set a serve time and work backwards — cold dishes ready first, hot dishes last.',
        'Include a hero dessert and plenty of icy drinks for the heat.',
        'After eating, take a stroll or play a quick game before anyone melts into the couch forever.'
      ],
      need: ['Booking or menu plan', 'Allergy notes', 'Drink & ice plan', 'Serving platters', 'Playlist', 'A simple timing list'],
      tip: 'One spectacular make-ahead dessert beats three stressful last-minute puddings.',
      kids: 'Designing handmade menus or place cards and helping plate the fruit platter.'
    },
    'Family Christmas activities': {
      cat: 'Family',
      intro: 'Build a day of small delights — craft, play, and outdoors time — so Christmas feels like a season, not a single morning.',
      steps: [
        'List three activities: one craft, one outing or outdoor play, one cosy indoor option for hot afternoons.',
        'Prep craft supplies the night before so starting is easy.',
        'Do the outdoor/active thing in the cooler morning or evening.',
        'Keep the craft short and finishable — pride beats perfection.',
        'Add a “surprise pouch” with stickers, a card game, or movie snacks.',
        'End with a gratitude round: each person shares one favourite moment.'
      ],
      need: ['Simple craft kit', 'Card game or movie', 'Sunscreen / hats', 'Snacks', 'Speaker for music', 'A small surprise pouch'],
      tip: 'Rotate who picks the next activity — kids remember the power as much as the plan.',
      kids: 'Picking the craft theme and leading the end-of-day gratitude round.'
    }
  };

  function fallbackContent(title, em) {
    return {
      cat: 'Family',
      intro: 'A little festive mission for "' + title + '". Keep it light, keep it joyful, and make it yours.',
      steps: [
        'Gather everyone who wants to join and set a playful mood with a carol or two.',
        'Decide what “done” looks like so the activity stays fun, not endless.',
        'Collect the simple supplies you already have at home.',
        'Do the main activity together — phones down if you can.',
        'Take one photo or jot one memory in your notes.',
        'Celebrate with a small treat and tick it off your Christmas adventure list.'
      ],
      need: ['A little time together', 'Any supplies you already own', 'Water or a cool drink', 'A speaker or humming voices', 'A sense of humour', 'Optional camera'],
      tip: 'The best Christmas plans are the ones you’ll actually enjoy — shrink the idea until it feels easy.',
      kids: 'Choosing the music and declaring when it’s officially “magic o’clock.”',
      em: em
    };
  }

  function getContent(title, em) {
    return CONTENT[title] || fallbackContent(title, em);
  }

  function cardTitle(card) {
    var b = card.querySelector('.body b, strong');
    return b ? b.textContent.trim() : '';
  }

  function cardEmoji(card) {
    var em = card.querySelector('.em, .big');
    return em ? em.textContent.trim() : '✨';
  }

  function isExploreDecorCard(el) {
    return !!(el && el.closest && el.closest('#screen .catalog:not(#giftResults)') && el.classList.contains('catalog-card'));
  }

  function isExploreDiscoverCard(el) {
    if (!el || !el.classList || !el.classList.contains('tap-card')) return false;
    var a = el.getAttribute('data-action');
    return a === 'mapSearch' || a === 'lightSearch';
  }

  function enhance() {
    var decor = document.querySelectorAll('#screen .catalog:not(#giftResults) .catalog-card:not([data-ed])');
    for (var i = 0; i < decor.length; i++) {
      markCard(decor[i], false);
    }
    var disc = document.querySelectorAll('#screen .tap-card[data-action="mapSearch"]:not([data-ed]), #screen .tap-card[data-action="lightSearch"]:not([data-ed])');
    for (var j = 0; j < disc.length; j++) {
      markCard(disc[j], true);
    }
  }

  function markCard(c, isDiscover) {
    var title = cardTitle(c);
    var id = slug(title);
    c.setAttribute('data-ed', '1');
    c.setAttribute('data-ed-id', id);
    if (!isDiscover) {
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
    }
    c.setAttribute('aria-haspopup', 'dialog');
    c.setAttribute('aria-label', 'Open idea: ' + title);
    if (!c.querySelector('.ed-chev')) {
      var chev = document.createElement('span');
      chev.className = 'ed-chev';
      chev.setAttribute('aria-hidden', 'true');
      chev.textContent = '›';
      c.appendChild(chev);
    }
    syncBadge(c, id);
    // Soften Discover copy that promised an external search
    if (isDiscover) {
      var small = c.querySelector('small');
      if (small && /↗/.test(small.textContent)) {
        small.textContent = small.textContent.replace(/\s*↗\s*$/, '').replace(/^Search /, 'Ideas for ') + ' — tap for a fun plan';
      }
    }
  }

  function syncBadge(card, id) {
    var existing = card.querySelector('.ed-badge');
    if (isDone(id)) {
      if (!existing) {
        var b = document.createElement('span');
        b.className = 'ed-badge';
        b.setAttribute('aria-label', 'Done');
        b.textContent = '✅';
        card.appendChild(b);
      }
    } else if (existing) {
      existing.remove();
    }
  }

  function syncAllBadges() {
    var cards = document.querySelectorAll('#screen [data-ed-id]');
    for (var i = 0; i < cards.length; i++) {
      syncBadge(cards[i], cards[i].getAttribute('data-ed-id'));
    }
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function sparkleHTML() {
    if (prefersReducedMotion()) return '';
    var bits = [];
    for (var i = 0; i < 14; i++) {
      var left = 4 + (i * 7) % 92;
      var delay = ((i * 0.37) % 3).toFixed(2);
      var dur = (2.4 + (i % 5) * 0.35).toFixed(2);
      bits.push(
        '<i style="left:' + left + '%;animation-delay:' + delay + 's;animation-duration:' + dur + 's"></i>'
      );
    }
    return '<div class="ed-sparkle" aria-hidden="true">' + bits.join('') + '</div>';
  }

  var openEl = null;
  var lastFocus = null;
  var currentMeta = null;
  var edBypass = false;

  function close() {
    if (!openEl) return;
    openEl.remove();
    openEl = null;
    currentMeta = null;
    document.removeEventListener('keydown', onKey, true);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function stepsHTML(steps) {
    return '<ol class="ed-steps">' + steps.map(function (s) {
      return '<li><span>' + esc(s) + '</span></li>';
    }).join('') + '</ol>';
  }

  function checklistHTML(id, need) {
    var saved = getChecks(id);
    return '<ul class="ed-check" data-ed-check="' + esc(id) + '">' + need.map(function (item, idx) {
      var on = !!saved[idx];
      return (
        '<li class="' + (on ? 'is-on' : '') + '" data-idx="' + idx + '">' +
          '<input type="checkbox"' + (on ? ' checked' : '') + ' aria-label="' + esc(item) + '">' +
          '<span>' + esc(item) + '</span>' +
        '</li>'
      );
    }).join('') + '</ul>';
  }

  function open(card) {
    close();
    var title = cardTitle(card);
    var em = cardEmoji(card);
    var id = slug(title);
    var info = getContent(title, em);
    var done = isDone(id);
    currentMeta = { id: id, title: title, cat: info.cat || 'Family', card: card };
    lastFocus = card;

    var bd = document.createElement('div');
    bd.className = 'ed-backdrop';
    bd.innerHTML =
      '<div class="ed-sheet" role="dialog" aria-modal="true" aria-labelledby="edTitle">' +
        '<div class="ed-hero">' +
          sparkleHTML() +
          '<button type="button" class="ed-close" aria-label="Close">×</button>' +
          '<div class="ed-hero-em" aria-hidden="true">' + esc(em) + '</div>' +
        '</div>' +
        '<div class="ed-body">' +
          '<h2 id="edTitle">' + esc(title) + '</h2>' +
          '<p class="ed-intro">' + esc(info.intro) + '</p>' +
          '<h3>How to do it</h3>' + stepsHTML(info.steps) +
          '<h3>You\'ll need</h3>' + checklistHTML(id, info.need) +
          '<h3>Make it extra magical</h3>' +
          '<p class="ed-tip">' + esc(info.tip) + '</p>' +
          '<p class="ed-kids"><strong>Kids can help by</strong> ' + esc(info.kids) + '</p>' +
          '<div class="ed-actions">' +
            '<button type="button" class="ed-btn ed-btn-plan" data-ed-act="plan">⭐ Add to our plans</button>' +
            '<button type="button" class="ed-btn ed-btn-done' + (done ? ' is-done' : '') + '" data-ed-act="done">' +
              (done ? '✓ Done — nice work!' : '✓ We did it!') +
            '</button>' +
            (isExploreDiscoverCard(card) ? '<button type="button" class="ed-btn ed-btn-map" data-ed-act="map">🗺️ Show places near us</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>';

    bd.addEventListener('click', function (e) {
      if (e.target === bd || e.target.closest('.ed-close')) {
        close();
        return;
      }
      var checkLi = e.target.closest('.ed-check li');
      if (checkLi && currentMeta) {
        var input = checkLi.querySelector('input');
        if (e.target !== input) {
          input.checked = !input.checked;
        }
        var idx = checkLi.getAttribute('data-idx');
        setCheck(currentMeta.id, idx, input.checked);
        checkLi.classList.toggle('is-on', input.checked);
        return;
      }
      var actBtn = e.target.closest('[data-ed-act]');
      if (actBtn && currentMeta) {
        var act = actBtn.getAttribute('data-ed-act');
        if (act === 'plan') addToPlans(currentMeta.title, currentMeta.cat);
        if (act === 'done') markDidIt(actBtn);
        if (act === 'map') {
          var mapCard = currentMeta.card;
          close();
          edBypass = true;
          try { mapCard.click(); } finally { edBypass = false; }
        }
      }
    });

    document.body.appendChild(bd);
    openEl = bd;
    document.addEventListener('keydown', onKey, true);
    bd.querySelector('.ed-close').focus();
  }

  function toast(msg) {
    if (typeof notice === 'function') notice(msg);
    else {
      try {
        document.querySelector('.toast') && document.querySelector('.toast').remove();
        var x = document.createElement('div');
        x.className = 'toast';
        x.textContent = msg;
        document.body.appendChild(x);
        setTimeout(function () { x.remove(); }, 3000);
      } catch (e) {}
    }
  }

  function addToPlans(title, cat) {
    var text = title;
    try {
      if (typeof state !== 'undefined' && state && Array.isArray(state.tasks)) {
        var exists = state.tasks.some(function (t) {
          return String(t.text).toLowerCase() === text.toLowerCase();
        });
        if (exists) {
          toast('Already on your checklist');
          return;
        }
        var id = typeof uid === 'function' ? uid() : 'id' + Date.now().toString(36);
        var due = typeof dateStr === 'function' ? dateStr(12, 20) : ((typeof YEAR !== 'undefined' ? YEAR : new Date().getFullYear()) + '-12-20');
        state.tasks.unshift({
          id: id,
          text: text,
          category: cat || 'Family',
          date: due,
          done: false,
          preset: false
        });
        if (typeof persist === 'function') persist('Added to your Christmas checklist ⭐');
        else toast('Added to your Christmas checklist ⭐');
        return;
      }
    } catch (e) {}
    toast('Could not add to plans — try the Planning centre checklist');
  }

  function burst() {
    if (prefersReducedMotion()) return;
    var layer = document.createElement('div');
    layer.className = 'ed-burst';
    var glyphs = ['❄', '✨', '⭐', '🎄', '💫', '❄', '✨', '🌟'];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('span');
      var angle = (Math.PI * 2 * i) / 18;
      var dist = 60 + (i % 5) * 28;
      s.textContent = glyphs[i % glyphs.length];
      s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(angle) * dist - 20 + 'px');
      s.style.animationDelay = (i * 0.02) + 's';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 1000);
  }

  function markDidIt(btn) {
    if (!currentMeta) return;
    setDone(currentMeta.id, true);
    btn.classList.add('is-done');
    btn.textContent = '✓ Done — nice work!';
    burst();
    syncBadge(currentMeta.card, currentMeta.id);
    syncAllBadges();
    toast('Marked as done — merry magic!');
  }

  document.addEventListener(
    'click',
    function (e) {
      var card =
        e.target.closest &&
        (e.target.closest('#screen .catalog:not(#giftResults) .catalog-card') ||
          e.target.closest('#screen .tap-card[data-action="mapSearch"]') ||
          e.target.closest('#screen .tap-card[data-action="lightSearch"]'));
      if (!card || edBypass) return;
      if (e.target.closest('a, input')) return;
      // Discover cards previously opened Google — keep it in-app and fun instead.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      open(card);
    },
    true
  );

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest && e.target.closest('#screen .catalog:not(#giftResults) .catalog-card, #screen .tap-card[data-action="mapSearch"], #screen .tap-card[data-action="lightSearch"]');
    if (!card || e.target !== card) return;
    e.preventDefault();
    open(card);
  });

  new MutationObserver(enhance).observe(document.documentElement, { childList: true, subtree: true });
  enhance();
})();
