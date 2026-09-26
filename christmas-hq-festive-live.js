/* Christmas HQ — FESTIVE LIVE upgrade
   - Real Christmas hero background + animated snow
   - Persistent personal Christmas music player
   - Family Games tab
   - Live Supabase family presence, trivia, song guessing, votes, wheel + leaderboard
   - Local Bingo + Memory Match
*/
(() => {
  'use strict';

  const HQ_SUPABASE_URL = 'https://onrphnvudtcmhltfbwkk.supabase.co';
  const HQ_SUPABASE_KEY = 'sb_publishable_uBe-QyM-eAYFpiRQxnsp7w_7v2HQoBl';
  const GAME_ROW_TITLE = '__live_game__';
  const GAME_SECTION = 'magic';
  const MUSIC_DB = 'christmas-hq-media-v1';
  const MUSIC_STORE = 'songs';

  let hqDb = null;
  let hqSession = null;
  let hqFamilyId = '';
  let hqFamilyMembers = [];
  let hqLiveRowId = '';
  let hqLiveState = null;
  let hqPresence = [];
  let hqGameChannel = null;
  let hqPresenceChannel = null;
  let hqLocalView = 'hub';

  let hqMusicSongs = [];
  let hqMusicObjectUrl = '';
  let hqAudio = null;
  let hqMusicEnabled = localStorage.getItem('christmas-hq-music-enabled') !== '0';
  let hqMusicVolume = Number(localStorage.getItem('christmas-hq-music-volume') || '0.55');
  let hqSelectedSongId = localStorage.getItem('christmas-hq-music-song') || '';

  let hqBingoMarked = new Set();
  let hqMemory = null;

  const TRIVIA = [
    ['What colour are the berries on mistletoe?', ['Red','White','Blue','Gold'], 1],
    ['Which reindeer is famous for a glowing nose?', ['Comet','Dasher','Rudolph','Blitzen'], 2],
    ['What plant is traditionally hung for a Christmas kiss?', ['Holly','Mistletoe','Ivy','Rosemary'], 1],
    ['Which country is widely associated with starting the modern Christmas tree tradition?', ['Germany','Australia','Canada','Italy'], 0],
    ['What date is Boxing Day?', ['24 December','25 December','26 December','31 December'], 2],
    ['What is traditionally placed at the very top of many Christmas trees?', ['A bell','A star or angel','A stocking','A candy cane'], 1],
    ['Which festive drink is often made with milk, cream, sugar and eggs?', ['Eggnog','Lemonade','Ginger beer','Cider'], 0],
    ['In Australia, Christmas falls in which season?', ['Autumn','Winter','Spring','Summer'], 3],
    ['Which character says “Bah, humbug!” in A Christmas Carol?', ['Tiny Tim','Bob Cratchit','Ebenezer Scrooge','Jacob Marley'], 2],
    ['What red-and-white striped sweet is strongly associated with Christmas?', ['Candy cane','Liquorice','Marshmallow','Jelly bean'], 0],
    ['Which bird is commonly shown on British Christmas cards?', ['Robin','Magpie','Eagle','Swan'], 0],
    ['How many doors are on a traditional Christmas Advent calendar ending on Christmas Eve?', ['12','20','24','31'], 2],
    ['What do people traditionally hang by the fireplace for Santa to fill?', ['Mittens','Stockings','Scarves','Pillows'], 1],
    ['Which Christmas decoration is made by looping greenery into a circle?', ['Garland','Wreath','Tinsel','Bauble'], 1],
    ['Which direction is the North Pole from Australia?', ['North','South','East','West'], 0],
    ['What is the name of Santa’s vehicle?', ['Sleigh','Carriage','Wagon','Snowmobile'], 0],
    ['What animals are traditionally said to pull Santa’s sleigh?', ['Horses','Reindeer','Huskies','Elk'], 1],
    ['Which sparkling decoration is often draped around a Christmas tree?', ['Tinsel','Ribbon grass','Confetti','Streamers'], 0],
    ['What do Australians often enjoy because Christmas is in summer?', ['Snowball fights','Beach time','Autumn leaves','Ski trips'], 1],
    ['What is December 25 called?', ['Christmas Eve','Christmas Day','Boxing Day','New Year’s Eve'], 1],
    ['Which spice is strongly associated with gingerbread?', ['Cinnamon','Paprika','Turmeric','Cumin'], 0],
    ['What is a group of Christmas songs sung door-to-door traditionally called?', ['Carols','Anthems','Ballads','Chants'], 0],
    ['Which colour combination is strongly associated with classic Christmas decor?', ['Red and green','Purple and orange','Blue and black','Pink and grey'], 0],
    ['What is Santa commonly said to say?', ['Ho ho ho','Hey hey hey','La la la','Go go go'], 0],
    ['Which Christmas plant has bright red leaves?', ['Poinsettia','Lavender','Tulip','Daffodil'], 0],
    ['What do people commonly exchange at Christmas?', ['Gifts','Homework','Invoices','Uniforms'], 0],
    ['What is the evening before Christmas Day called?', ['Christmas Eve','Boxing Eve','Advent Night','Santa Night'], 0],
    ['Which meal is a major family event for many Australians on Christmas Day?', ['Christmas lunch','Midnight breakfast','School lunch','Work dinner'], 0],
    ['What shape is a traditional Christmas bauble?', ['Round','Triangle','Hexagon','Star only'], 0],
    ['Which festive figure is often built from snow?', ['Snowman','Sandman','Tin man','Ginger man'], 0]
  ];

  const SONG_GUESS = [
    ['A sleigh ride with bells ringing all the way.', ['Jingle Bells','Silent Night','Deck the Halls','O Holy Night'], 0],
    ['A red-nosed reindeer becomes the hero of a foggy Christmas Eve.', ['Rudolph the Red-Nosed Reindeer','Frosty the Snowman','Little Drummer Boy','Winter Wonderland'], 0],
    ['A peaceful song about a calm and holy night.', ['Silent Night','Jingle Bells','Santa Baby','White Christmas'], 0],
    ['A snowman comes to life and has a magical adventure.', ['Frosty the Snowman','Joy to the World','The First Noel','Silver Bells'], 0],
    ['A song wishing listeners a happy Christmas and a happy New Year.', ['We Wish You a Merry Christmas','O Come All Ye Faithful','Hark! The Herald Angels Sing','Away in a Manger'], 0],
    ['A song about dreaming of a snowy Christmas.', ['White Christmas','Blue Christmas','Last Christmas','Silver Bells'], 0],
    ['A festive song about decorating with greenery and being jolly.', ['Deck the Halls','Silent Night','Little Drummer Boy','O Holy Night'], 0],
    ['A song centred on a little drummer visiting the newborn child.', ['The Little Drummer Boy','Jingle Bell Rock','Rockin’ Around the Christmas Tree','Feliz Navidad'], 0],
    ['A Spanish-English Christmas greeting song.', ['Feliz Navidad','Carol of the Bells','O Christmas Tree','Joy to the World'], 0],
    ['A song about rocking around a decorated Christmas tree.', ['Rockin’ Around the Christmas Tree','Silver Bells','Sleigh Ride','Blue Christmas'], 0],
    ['A song where city streets are filled with Christmas bells.', ['Silver Bells','Silent Night','Rudolph the Red-Nosed Reindeer','Away in a Manger'], 0],
    ['A joyful song announcing Christmas to the world.', ['Joy to the World','O Holy Night','White Christmas','The First Noel'], 0],
    ['A song inviting faithful people to come and celebrate.', ['O Come All Ye Faithful','Frosty the Snowman','Santa Baby','Deck the Halls'], 0],
    ['A song about riding together through snowy weather.', ['Sleigh Ride','Silent Night','Blue Christmas','The First Noel'], 0],
    ['A song about bells ringing in rapid repeating patterns.', ['Carol of the Bells','Silver Bells','Jingle Bells','O Christmas Tree'], 0],
    ['A song about a decorated evergreen tree.', ['O Christmas Tree','Feliz Navidad','White Christmas','Joy to the World'], 0],
    ['A romantic Christmas song asking Santa for extravagant gifts.', ['Santa Baby','Silent Night','Little Drummer Boy','Deck the Halls'], 0],
    ['A song about feeling sad during Christmas without someone special.', ['Blue Christmas','Sleigh Ride','Silver Bells','Joy to the World'], 0],
    ['A song celebrating the first announcement of Christmas.', ['The First Noel','Jingle Bell Rock','Frosty the Snowman','Santa Baby'], 0],
    ['A gentle song about a baby resting in a manger.', ['Away in a Manger','Rockin’ Around the Christmas Tree','Silver Bells','Sleigh Ride'], 0]
  ];

  const WOULD = [
    ['Beach Christmas','Snowy Christmas'],
    ['Ham','Seafood'],
    ['Real tree','Artificial tree'],
    ['Open presents early','Wait until Christmas morning'],
    ['Christmas lunch','Christmas dinner'],
    ['Lights everywhere','Simple decorations'],
    ['Secret Santa','Everyone buys for everyone'],
    ['Pavlova','Trifle'],
    ['Christmas movie marathon','Christmas games night'],
    ['Stay home','Big family gathering'],
    ['Carols','Christmas rock playlist'],
    ['Matching Christmas PJs','Normal clothes'],
    ['Big presents','Lots of small presents'],
    ['Cook everything yourself','Everyone brings a plate'],
    ['Santa photos','Christmas lights trail'],
    ['Shop early','Last-minute shopping'],
    ['Red and green decor','Gold and white decor'],
    ['Christmas Eve party','Boxing Day party'],
    ['Board games','Outdoor games'],
    ['Give experiences','Give physical presents']
  ];

  const WHEEL = [
    'Everyone tells their funniest Christmas memory',
    'Pick the next Christmas song',
    'Do your best Santa laugh',
    'Choose someone to open a small present',
    'Family selfie time',
    'Everyone gets a Christmas snack',
    'Tell a terrible Christmas joke',
    'Choose the next family game',
    'Do a 10-second Christmas dance',
    'Name five Christmas foods in 10 seconds',
    'Share one thing you are grateful for',
    'Choose someone to wear the Santa hat',
    'Sing one line of a Christmas song',
    'Everyone raises a toast',
    'Take a silly family photo',
    'Choose the next movie',
    'Tell the best gift you ever received',
    'Name three reindeer',
    'Christmas charades — your turn',
    'Give someone a genuine compliment'
  ];

  const BINGO_WORDS = [
    'Santa hat','Christmas lights','Pavlova','Wrapping paper','Reindeer',
    'Christmas tree','Family selfie','Carols','Candy cane','Gift bag',
    'Ham','Seafood','Tinsel','Christmas movie','Stocking',
    'Secret Santa','Christmas card','Bonbon','Christmas joke','Dessert',
    'Ice cold drink','Someone says “Merry Christmas”','Photo of food','Red outfit','Gold decoration'
  ];

  const MEMORY_ICONS = ['🎄','🎅','🎁','🦌','⭐','🔔','🍬','⛄','🧦','🍪','🕯️','❄️'];

  const hqEsc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
   function updateChristmasCountdown() {
  const daysEl = document.getElementById('hqChristmasDays');
  const clockEl = document.getElementById('hqChristmasClock');
  if (!daysEl || !clockEl) return;

  const now = new Date();

  if (now.getMonth() === 11 && now.getDate() === 25) {
    daysEl.textContent = '0';
    clockEl.textContent = 'MERRY CHRISTMAS 🎄';
    return;
  }

  let target = new Date(now.getFullYear(), 11, 25, 0, 0, 0);

  if (target <= now) {
    target = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0);
  }

  const left = target - now;

  const days = Math.floor(left / 86400000);
  const hours = Math.floor((left % 86400000) / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  daysEl.textContent = days;
  clockEl.textContent =
    String(hours).padStart(2,'0') + ':' +
    String(minutes).padStart(2,'0') + ':' +
    String(seconds).padStart(2,'0');
}

function buildChristmasHeader() {
  const pageNames = {
    home: 'Christmas HQ',
    gifts: 'Gifts',
    plan: 'Planner',
    kitchen: 'Kitchen',
    magic: 'Christmas Magic',
    games: 'Family Games',
    explore: 'Explore',
    settings: 'Settings'
  };

  const pageTitle = pageNames[ui.tab] || 'Christmas HQ';

  mast.innerHTML = ui.tab === 'home' ? `
    <div class="hq-home-brand">
      <div class="mast-name">Christmas HQ</div>
      <div class="hq-catchphrase">Your Christmas, sorted.</div>
      <div class="hq-brand-flourish">✦ · ✦</div>
    </div>

    <div class="hq-hero-main hq-home-hero">
      <div class="hq-bottom-row">

        <div class="hq-christmas-countdown">
          <div class="hq-days-block">
            <strong id="hqChristmasDays">--</strong>
            <span>DAYS UNTIL CHRISTMAS</span>
          </div>

          <div class="hq-clock-block">
            <small>HOURS · MINUTES · SECONDS</small>
            <b id="hqChristmasClock">--:--:--</b>
          </div>
        </div>

        <div class="hq-header-buttons hq-home-buttons">
          <button class="circle-btn hq-settings-btn"
            data-action="settings"
            aria-label="Settings">⚙</button>

          <button class="back-btn hq-back-btn"
            data-action="back"
            ${navStack.length ? '' : 'disabled'}>
            ← Back
          </button>
        </div>

      </div>
    </div>
  ` : `
    <div class="hq-page-brand">
      <div class="hq-page-title">${pageTitle}</div>
      <div class="hq-page-subbrand">Christmas HQ</div>
      <div class="hq-brand-flourish">✦ · ✦</div>
    </div>

    <button class="back-btn hq-page-back"
      data-action="back">
      ← Back
    </button>
  `;

  addSnow();
  updateChristmasCountdown();

  if (!window.__hqChristmasCountdownTimer) {
    window.__hqChristmasCountdownTimer =
      setInterval(updateChristmasCountdown, 1000);
  }
}

  function injectStyle() {
    if (document.getElementById('hqFestiveLiveStyle')) return;

    const style = document.createElement('style');
    style.id = 'hqFestiveLiveStyle';
    style.textContent = `
      .mast{
        position:relative !important;
        isolation:isolate;
        overflow:hidden;
        min-height:245px;
        background:
          linear-gradient(180deg,rgba(3,34,28,.14),rgba(3,34,28,.72) 70%,rgba(3,34,28,.92)),
          url('./christmas-hero-bg.png?v=5') center 46% / cover no-repeat !important;
        box-shadow:inset 0 -1px 0 rgba(255,255,255,.14),0 12px 32px rgba(21,54,40,.16);
      }
      .mast:before{
        content:"";
        position:absolute;inset:0;z-index:-1;
        background:
          radial-gradient(circle at 18% 12%,rgba(255,213,120,.22),transparent 30%),
          radial-gradient(circle at 84% 22%,rgba(255,255,255,.10),transparent 28%);
        pointer-events:none
      }
      .mast-bar,.mast-kicker,.mast-title,.mast-desc{position:relative;z-index:3}
      .mast-name,.mast-tag,.mast-kicker,.mast-title,.mast-desc{
        color:white !important;
        text-shadow:0 2px 10px rgba(0,0,0,.66)
      }
      .mast-title{max-width:90%;font-size:clamp(36px,8vw,58px)!important}
      .mast-tag,
.mast-desc{
  display:none!important;
}
.hq-brand{
  position:relative;
  z-index:3;
  display:flex;
  flex-direction:column;
  gap:1px;
}

.mast-name{
  font-size:24px!important;
  font-weight:950!important;
  letter-spacing:.2px;
  line-height:1.05;
}

.hq-catchphrase{
  color:#fff7df;
  font-family:Georgia,serif;
  font-size:14px;
  font-style:italic;
  font-weight:700;
  text-shadow:0 2px 8px rgba(0,0,0,.65);
}

.hq-hero-main{
  position:relative;
  z-index:3;
  margin-top:30px;
}

.hq-page-name{
  color:#fff;
  font-size:11px;
  font-weight:950;
  letter-spacing:2.4px;
  text-shadow:0 2px 8px rgba(0,0,0,.7);
  margin-bottom:8px;
}

.hq-christmas-countdown{
  display:flex;
  align-items:center;
  gap:12px;
  width:max-content;
  max-width:100%;
  padding:10px 12px;
  border:1px solid rgba(255,255,255,.25);
  border-radius:16px;
  background:rgba(5,38,31,.64);
  backdrop-filter:blur(10px);
  box-shadow:0 8px 24px rgba(0,0,0,.18);
}

.hq-days-block{
  display:flex;
  align-items:center;
  gap:9px;
  padding-right:12px;
  border-right:1px solid rgba(255,255,255,.22);
}

.hq-days-block strong{
  color:#fff;
  font-size:34px;
  line-height:1;
  font-weight:950;
}

.hq-days-block span{
  color:#fff7df;
  max-width:72px;
  font-size:9px;
  line-height:1.2;
  font-weight:900;
  letter-spacing:1px;
}

.hq-clock-block{
  display:flex;
  flex-direction:column;
  gap:1px;
}

.hq-clock-block small{
  color:#fff7df;
  font-size:8px;
  font-weight:900;
  letter-spacing:1px;
}

.hq-clock-block b{
  color:#fff;
  font-size:20px;
  letter-spacing:1px;
  text-shadow:0 2px 8px rgba(0,0,0,.65);
}
      .brand-icon,.back-btn,.circle-btn{
        backdrop-filter:blur(11px);
        background:rgba(7,46,37,.56)!important;
        border-color:rgba(255,255,255,.27)!important;
        color:white!important
      }
      .hq-snow{
        position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2
      }
      .hq-snow i{
        position:absolute;top:-12%;
        width:7px;height:7px;border-radius:50%;
        background:rgba(255,255,255,.88);
        filter:drop-shadow(0 0 5px rgba(255,255,255,.58));
        animation:hqSnowFall linear infinite;
        opacity:.75
      }
      @keyframes hqSnowFall{
        to{transform:translate3d(24px,430px,0) rotate(180deg)}
      }
      @media (prefers-reduced-motion:reduce){
        .hq-snow i{animation:none!important;display:none}
      }

      .hq-music-dock{
        position:relative;
        z-index:20;
        width:calc(100% - 32px);
        max-width:650px;
        margin:12px auto 18px auto;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(8,46,37,.96);
        color:white;
        border-radius:16px;
        padding:9px 12px;
        box-shadow:0 8px 22px rgba(0,0,0,.16);
        backdrop-filter:blur(14px)
      }
      
      .hq-music-mini{display:flex;align-items:center;gap:9px}
      .hq-music-icon{font-size:24px}
      .hq-music-info{flex:1;min-width:0}
      .hq-music-info b,.hq-music-info small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .hq-music-info small{opacity:.76;font-size:11px}
      .hq-music-btn{
        border:0;border-radius:999px;background:#fff;color:#0c4b3b;
        min-width:44px;height:40px;font-weight:900;font-size:17px;padding:0 12px
      }
      .hq-music-tools{display:none;gap:7px;margin-top:9px;align-items:center}
      .hq-music-dock.open .hq-music-tools{display:flex}
      .hq-music-tools select{
        min-width:0;flex:1;border-radius:11px;padding:8px;border:1px solid rgba(255,255,255,.25);
        background:#173f36;color:white
      }
      .hq-music-tools input[type=range]{width:82px}
      .hq-music-expand{
        background:transparent;border:0;color:white;font-size:18px;padding:5px 7px
      }

      .hq-game-online{
        display:flex;gap:8px;align-items:center;flex-wrap:wrap;
        padding:12px 14px;border-radius:16px;
        background:linear-gradient(135deg,#edf6ed,#fff6df);
        border:1px solid #dce7d8;margin-bottom:14px
      }
      .hq-online-dot{width:9px;height:9px;border-radius:50%;background:#16a765;box-shadow:0 0 0 4px #16a76522}
      .hq-player-chip{
        padding:6px 9px;border-radius:999px;background:white;border:1px solid #dfe7df;
        font-size:12px;font-weight:850
      }
      .hq-games-grid{
        display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px
      }
      .hq-game-card{
        text-align:left;border:0;border-radius:20px;padding:15px;color:white;min-height:148px;
        box-shadow:0 9px 24px rgba(20,67,50,.14);position:relative;overflow:hidden
      }
      .hq-game-card:after{
        content:"";position:absolute;right:-18px;bottom:-28px;width:95px;height:95px;border-radius:50%;
        background:rgba(255,255,255,.10)
      }
      .hq-game-card .big{display:block;font-size:31px;margin-bottom:11px}
      .hq-game-card b{display:block;font-size:17px;margin-bottom:5px}
      .hq-game-card small{display:block;line-height:1.35;opacity:.9}
      .hq-game-card.trivia{background:linear-gradient(135deg,#0c7654,#0a4f3d)}
      .hq-game-card.song{background:linear-gradient(135deg,#7553a7,#3f326c)}
      .hq-game-card.would{background:linear-gradient(135deg,#c65d28,#993b21)}
      .hq-game-card.bingo{background:linear-gradient(135deg,#2374a8,#174b7a)}
      .hq-game-card.wheel{background:linear-gradient(135deg,#ad3f8f,#65307d)}
      .hq-game-card.memory{background:linear-gradient(135deg,#ba3446,#7f2638)}
      .hq-game-stage{
        border-radius:22px;padding:17px;background:white;border:1px solid #e4e8e1;
        box-shadow:0 8px 26px rgba(30,60,44,.08)
      }
      .hq-game-stage h2{margin:0 0 8px;color:var(--forest)}
      .hq-game-stage .hq-question{font:700 24px Georgia,serif;line-height:1.2;margin:15px 0}
      .hq-answer-grid{display:grid;gap:9px}
      .hq-answer{
        border:2px solid #e0e5df;background:#fff;border-radius:15px;padding:13px;text-align:left;
        color:var(--forest);font-weight:850;font-size:15px
      }
      .hq-answer.selected{border-color:#15543f;background:#eef7ef}
      .hq-answer.correct{border-color:#18a25e;background:#e8f8ef}
      .hq-answer.wrong{border-color:#c44351;background:#fff0f1}
      .hq-leaderboard{display:grid;gap:7px;margin-top:12px}
      .hq-score{
        display:flex;justify-content:space-between;padding:9px 11px;border-radius:12px;background:#f5f7f2
      }
      .hq-game-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
      .hq-bingo{
        display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:12px
      }
      .hq-bingo button{
        aspect-ratio:1;border:1px solid #e0e4dd;border-radius:10px;background:#fff;
        font-size:10px;font-weight:800;padding:4px;line-height:1.1;color:var(--forest)
      }
      .hq-bingo button.marked{background:#145440;color:white;border-color:#145440}
      .hq-memory{
        display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px
      }
      .hq-memory button{
        aspect-ratio:1;border:0;border-radius:13px;background:#174b3c;color:white;font-size:27px;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)
      }
      .hq-memory button.faceup,.hq-memory button.matched{background:#fff3d6;color:#1b4d3d}
      .hq-wheel-result{
        margin:14px 0;padding:21px 15px;border-radius:50%;
        min-height:220px;display:grid;place-items:center;text-align:center;
        background:conic-gradient(#ba3446 0 16.6%,#d8952f 16.6% 33.3%,#1f7a54 33.3% 50%,#4676b7 50% 66.6%,#8b52a3 66.6% 83.3%,#d14e78 83.3%);
        border:8px solid #fff;box-shadow:0 9px 28px rgba(0,0,0,.14)
      }
      .hq-wheel-result span{
        background:rgba(10,47,38,.92);color:#fff;border-radius:18px;padding:16px;font-weight:900;max-width:75%
      }.nav{
  grid-template-columns:repeat(7,minmax(0,1fr))!important;
  gap:2px!important;
  width:calc(100% - 16px)!important;
  max-width:564px!important;
  bottom:8px!important;
  border:1px solid #e2e8df!important;
  border-radius:18px!important;
  padding:6px 4px calc(6px + env(safe-area-inset-bottom))!important;
  box-shadow:0 -5px 26px rgba(16,59,49,.18)!important;
  overflow:visible!important;
}

.nav button{
  min-width:0!important;
  min-height:48px!important;
  padding:5px 1px!important;
  font-size:9px!important;
  gap:2px!important;
}

.nav button i{
  font-size:20px!important;
}

.nav::-webkit-scrollbar{
  display:none;
}
/* CHRISTMAS HQ HOME HERO LAYOUT */
.hq-title-bar{
  justify-content:center!important;
  text-align:center;
  width:100%;
}

.hq-title-bar .hq-brand{
  align-items:center;
  width:100%;
}

.hq-title-bar .mast-name{
  font-family:"Brush Script MT","Segoe Script","Snell Roundhand",cursive!important;
  font-size:clamp(42px,11vw,62px)!important;
  font-weight:700!important;
  line-height:.95!important;
  letter-spacing:.5px!important;
  color:#fff8df!important;
  text-shadow:
    0 3px 12px rgba(0,0,0,.75),
    0 0 18px rgba(255,220,140,.22);
}

.hq-title-bar .hq-catchphrase{
  margin-top:7px;
  font-size:15px!important;
  text-align:center;
}

.hq-home-hero{
  margin-top:92px!important;
}

.hq-bottom-row{
  position:relative;
  width:100%;
  display:flex;
  justify-content:center;
  align-items:stretch;
}

.hq-bottom-row .hq-christmas-countdown{
  width:min(340px,calc(100% - 78px));
  min-height:92px;
  margin:0 auto;
  justify-content:center;
}

.hq-header-buttons{
  position:absolute;
  right:0;
  top:0;
  bottom:0;
  width:66px;
  display:grid;
  grid-template-rows:1fr 1fr;
  gap:7px;
}

.hq-header-buttons .hq-settings-btn,
.hq-header-buttons .hq-back-btn{
  width:100%!important;
  min-width:0!important;
  height:100%!important;
  min-height:0!important;
  margin:0!important;
  padding:4px!important;
  border-radius:14px!important;
}

.hq-header-buttons .hq-settings-btn{
  font-size:22px!important;
}

.hq-header-buttons .hq-back-btn{
  font-size:11px!important;
}

/* Remove the old large countdown card from the Home page */
#screen > .hero:first-child{
  display:none!important;
}
/* FINAL HERO POSITIONING */

/* HOME — strong Christmas HQ title */
.mast[data-hq-page="home"] .hq-title-bar .mast-name{
  font-size:clamp(44px,10vw,56px)!important;
  font-weight:700!important;
  text-shadow:
    0 4px 14px rgba(0,0,0,.85),
    0 0 24px rgba(255,221,145,.42)!important;
}

/* OTHER PAGES — same branding, smaller */
.mast:not([data-hq-page="home"]) .hq-title-bar{
  display:flex!important;
  justify-content:center!important;
  text-align:center!important;
}

.mast:not([data-hq-page="home"]) .hq-title-bar .mast-name{
  display:block!important;
  font-size:34px!important;
  line-height:1!important;
}

.mast:not([data-hq-page="home"]) .hq-title-bar .hq-catchphrase{
  display:block!important;
  font-size:12px!important;
  margin-top:4px!important;
}

/* Give countdown its own space on the left */
.hq-bottom-row{
  justify-content:flex-start!important;
  padding-right:82px!important;
}

.hq-bottom-row .hq-christmas-countdown{
  width:100%!important;
  max-width:355px!important;
  margin:0!important;
}

/* Settings + Back get their own footprint */
.hq-header-buttons{
  right:0!important;
  width:70px!important;
}
/* MOCKUP MATCH */

.mast{
  border-radius:0 0 28px 28px!important;
  padding:22px 18px 20px!important;
  border-bottom:1px solid rgba(255,255,255,.22)!important;
}

.mast[data-hq-page="home"]{
  min-height:330px!important;
}

.mast:not([data-hq-page="home"]){
  min-height:292px!important;
}

/* HOME */
.hq-home-brand{
  position:relative;
  z-index:4;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  width:100%;
  padding-top:10px;
}

.hq-home-brand .mast-name{
  display:block!important;
  width:100%;
  font-family:"Brush Script MT","Segoe Script","Snell Roundhand",cursive!important;
  font-size:clamp(52px,16vw,76px)!important;
  font-weight:700!important;
  line-height:.9!important;
  letter-spacing:-1px!important;

  background:linear-gradient(
    180deg,
    #fffce9 0%,
    #ffe9a7 52%,
    #e4ad4e 100%
  );

  -webkit-background-clip:text;
  background-clip:text;
  color:transparent!important;
  -webkit-text-fill-color:transparent;

  filter:
    drop-shadow(0 4px 2px rgba(0,0,0,.55))
    drop-shadow(0 0 12px rgba(255,214,107,.28));
}

.hq-home-brand .hq-catchphrase{
  display:block!important;
  margin-top:10px!important;
  color:#fff7dd!important;
  font:700 italic 18px/1.1 Georgia,serif!important;
  text-shadow:0 2px 8px rgba(0,0,0,.8)!important;
}

.hq-brand-flourish{
  margin-top:8px;
  color:#f4d27c;
  font-size:12px;
  letter-spacing:8px;
  text-shadow:0 1px 6px rgba(0,0,0,.7);
}

/* HOME COUNTDOWN */
.hq-home-hero{
  margin-top:54px!important;
}

.hq-bottom-row{
  gap:10px!important;
  padding-right:80px!important;
}

.hq-bottom-row .hq-christmas-countdown{
  max-width:none!important;
  min-height:96px!important;
  border:1px solid rgba(247,213,132,.55)!important;
  border-radius:22px!important;
  background:
    linear-gradient(
      135deg,
      rgba(7,58,45,.96),
      rgba(4,41,34,.96)
    )!important;

  box-shadow:
    0 12px 30px rgba(0,0,0,.28),
    inset 0 0 0 1px rgba(255,255,255,.04)!important;

  padding:14px!important;
}

.hq-days-block strong{
  color:#ffe9a5!important;
  font:800 44px/.9 Georgia,serif!important;
}

.hq-clock-block b{
  font:800 25px/1.05 Georgia,serif!important;
  color:white!important;
}

.hq-home-buttons{
  width:70px!important;
  gap:8px!important;
}

/* ALL OTHER PAGE HEADERS */
.hq-page-brand{
  position:relative;
  z-index:4;
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  padding:18px 8px 0;
}

.hq-page-title{
  width:100%;
  font-family:"Brush Script MT","Segoe Script","Snell Roundhand",cursive!important;
  font-size:clamp(54px,16vw,78px)!important;
  font-weight:700!important;
  line-height:.9!important;
  letter-spacing:-1px!important;

  background:linear-gradient(
    180deg,
    #fffce8 0%,
    #ffe6a0 55%,
    #dfa342 100%
  );

  -webkit-background-clip:text;
  background-clip:text;
  color:transparent!important;
  -webkit-text-fill-color:transparent;

  filter:
    drop-shadow(0 4px 2px rgba(0,0,0,.58))
    drop-shadow(0 0 12px rgba(255,214,107,.24));
}

.hq-page-subbrand{
  margin-top:9px;
  font-family:"Brush Script MT","Segoe Script","Snell Roundhand",cursive;
  font-size:27px;
  color:#fff5d5;
  text-shadow:0 2px 8px rgba(0,0,0,.8);
}

/* PROPER BACK BUTTON */
.hq-page-back{
  position:absolute!important;
  right:18px!important;
  bottom:18px!important;
  width:116px!important;
  height:48px!important;
  min-width:116px!important;
  min-height:48px!important;
  padding:0 16px!important;
  border-radius:16px!important;

  border:1px solid rgba(247,213,132,.48)!important;
  background:rgba(5,51,41,.94)!important;
  color:white!important;

  font-size:15px!important;
  font-weight:900!important;

  box-shadow:0 7px 18px rgba(0,0,0,.25)!important;
}
/* iPHONE / DYNAMIC ISLAND SAFE AREA */
.mast{
  padding-top:
    calc(22px + env(safe-area-inset-top))!important;

  padding-left:
    calc(18px + env(safe-area-inset-left))!important;

  padding-right:
    calc(18px + env(safe-area-inset-right))!important;
}

.mast[data-hq-page="home"]{
  min-height:
    calc(330px + env(safe-area-inset-top))!important;
}

.mast:not([data-hq-page="home"]){
  min-height:
    calc(292px + env(safe-area-inset-top))!important;
}

.hq-home-brand,
.hq-page-brand{
  max-width:100%!important;
  margin-left:auto!important;
  margin-right:auto!important;
}

.hq-home-brand .mast-name,
.hq-page-title,
.hq-page-subbrand{
  text-align:center!important;
  overflow-wrap:normal!important;
  word-break:normal!important;
}

.hq-page-title{
  padding-left:8px;
  padding-right:8px;
}

/* Keep longer titles safely inside iPhone width */
.mast[data-hq-page="magic"] .hq-page-title,
.mast[data-hq-page="games"] .hq-page-title{
  font-size:clamp(40px,12vw,62px)!important;
}

/* Back stays clear of curved iPhone edges */
.hq-page-back{
  right:
    calc(18px + env(safe-area-inset-right))!important;

  bottom:18px!important;
}
      @media(max-width:420px){
        .hq-games-grid{grid-template-columns:1fr 1fr}
        .hq-game-card{padding:13px;min-height:137px}
        .hq-bingo button{font-size:9px}
      }
    `;
    document.head.appendChild(style);
  }

  function addSnow() {
    if (!mast || mast.querySelector('.hq-snow')) return;
    const layer = document.createElement('div');
    layer.className = 'hq-snow';

    for (let i = 0; i < 34; i++) {
      const flake = document.createElement('i');
      flake.style.left = `${(i * 37) % 100}%`;
      flake.style.animationDuration = `${7 + (i % 8)}s`;
      flake.style.animationDelay = `${-(i % 10)}s`;
      const size = 4 + (i % 5);
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.opacity = String(.38 + ((i % 6) * .09));
      layer.appendChild(flake);
    }

    mast.appendChild(layer);
  }

  function addHomeGamesShortcut() {
    if (ui.tab !== 'home') return;
    const grids = screen.querySelectorAll('.quick-grid');
    const grid = grids[0];
    if (!grid || grid.querySelector('[data-nav="games"]')) return;

    const button = document.createElement('button');
    button.className = 'tap-card';
    button.dataset.nav = 'games';
    button.innerHTML = '<span class="big">🎮</span><strong>Family games</strong><small>Live trivia, bingo, votes & more</small>';
    grid.appendChild(button);
  }

  function ensureGamesNav() {
    if (!nav) return;

    const existing = nav.querySelector('[data-nav="games"]');
    if (!existing) {
      const button = document.createElement('button');
      button.dataset.nav = 'games';
      button.innerHTML = '<i>🎮</i><span>Games</span>';
      const explore = nav.querySelector('[data-nav="explore"]');
      if (explore) nav.insertBefore(button, explore);
      else nav.appendChild(button);
    }

    nav.querySelectorAll('button[data-nav]').forEach(button => {
      const isCurrent = button.dataset.nav === ui.tab;
      button.classList.toggle('current', isCurrent);
      if (isCurrent) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  }

  function playerName(id) {
    return hqFamilyMembers.find(m => m.user_id === id)?.display_name || (id === hqSession?.user?.id ? 'You' : 'Family');
  }

  function onlineHtml() {
    if (!hqSession || !hqFamilyId) {
      return `<div class="hq-game-online"><span>☁️</span><b>Connect Family Cloud in Settings for live multiplayer.</b></div>`;
    }

    const names = hqPresence.length
      ? hqPresence.map(p => p.name || 'Family member')
      : [playerName(hqSession.user.id)];

    return `<div class="hq-game-online">
      <span class="hq-online-dot"></span>
      <b>${names.length} online</b>
      ${names.map(n => `<span class="hq-player-chip">${hqEsc(n)}</span>`).join('')}
    </div>`;
  }

  function gameHub() {
    const live = hqLiveState?.game
      ? `<div class="callout" style="margin-bottom:13px"><b>🎮 Live game in progress:</b> ${hqEsc(gameLabel(hqLiveState.game))}
         <button class="btn small" style="margin-left:8px" data-hq-action="joinLiveGame">Join →</button></div>`
      : '';

    return `
      ${onlineHtml()}
      ${live}
      <div class="hq-games-grid">
        <button class="hq-game-card trivia" data-hq-game="trivia"><span class="big">🧠</span><b>Christmas Trivia</b><small>Live questions, answers and family leaderboard.</small></button>
        <button class="hq-game-card song" data-hq-game="song"><span class="big">🎵</span><b>Guess the Song</b><small>Christmas song clues — fastest family brain wins.</small></button>
        <button class="hq-game-card would" data-hq-game="would"><span class="big">↔️</span><b>Would You Rather?</b><small>Vote together and reveal the family split.</small></button>
        <button class="hq-game-card bingo" data-hq-game="bingo"><span class="big">🎟️</span><b>Christmas Bingo</b><small>Mark festive moments as they happen.</small></button>
        <button class="hq-game-card wheel" data-hq-game="wheel"><span class="big">🎡</span><b>Spin the Wheel</b><small>Random family Christmas challenges.</small></button>
        <button class="hq-game-card memory" data-hq-game="memory"><span class="big">🧩</span><b>Memory Match</b><small>Find all the festive pairs in the fewest moves.</small></button>
      </div>
      <div class="card" style="margin-top:14px;background:#f4f8f1">
        <h3>👪 Family multiplayer</h3>
        <p class="muted-note">Trivia, Guess the Song, Would You Rather and Spin the Wheel sync live between family members who have joined the same Christmas HQ family. Bingo and Memory Match work instantly on each phone.</p>
      </div>`;
  }

  function gameLabel(type) {
    return ({
      trivia:'Christmas Trivia',
      song:'Guess the Song',
      would:'Would You Rather?',
      wheel:'Spin the Wheel'
    })[type] || type || 'Family game';
  }

  function leaderboardHtml(scores = {}) {
    const rows = Object.entries(scores)
      .map(([id, score]) => [playerName(id), Number(score || 0)])
      .sort((a,b) => b[1] - a[1]);

    if (!rows.length) return '';

    return `<div class="hq-leaderboard">
      ${rows.map(([name,score],i) => `<div class="hq-score"><b>${i+1}. ${hqEsc(name)}</b><strong>${score}</strong></div>`).join('')}
    </div>`;
  }

  function liveGameStage() {
    const state = hqLiveState || {};
    const type = state.game;

    if (!type) {
      return `<div class="hq-game-stage"><h2>No live game yet</h2><p class="muted-note">Start one from the Games page.</p><button class="btn" data-hq-action="backHub">← Games</button></div>`;
    }

    if (type === 'trivia' || type === 'song') {
      const bank = type === 'trivia' ? TRIVIA : SONG_GUESS;
      const item = bank[(state.questionIndex || 0) % bank.length];
      const mine = state.answers?.[hqSession?.user?.id];
      const revealed = state.status === 'result';
      const correct = item[2];

      return `<div class="hq-game-stage">
        <div class="tagline">${type === 'trivia' ? '🧠 CHRISTMAS TRIVIA' : '🎵 GUESS THE SONG'} · ROUND ${Number(state.round || 1)}</div>
        <div class="hq-question">${hqEsc(item[0])}</div>
        <div class="hq-answer-grid">
          ${item[1].map((opt,i) => {
            let cls = '';
            if (mine === i) cls += ' selected';
            if (revealed && i === correct) cls += ' correct';
            if (revealed && mine === i && i !== correct) cls += ' wrong';
            return `<button class="hq-answer${cls}" data-hq-answer="${i}" ${mine !== undefined || revealed ? 'disabled' : ''}>${String.fromCharCode(65+i)}. ${hqEsc(opt)}</button>`;
          }).join('')}
        </div>
        <p class="muted-note">${Object.keys(state.answers || {}).length} answer${Object.keys(state.answers || {}).length===1?'':'s'} locked in.</p>
        ${revealed ? `<div class="callout"><b>Correct answer:</b> ${hqEsc(item[1][correct])}</div>${leaderboardHtml(state.scores)}` : ''}
        <div class="hq-game-toolbar">
          <button class="btn alt" data-hq-action="backHub">← Games</button>
          ${isHost(state) && !revealed ? `<button class="btn" data-hq-action="revealLive">Reveal answer</button>` : ''}
          ${isHost(state) && revealed ? `<button class="btn" data-hq-action="nextLive">Next question →</button>` : ''}
          ${isHost(state) ? `<button class="btn warn" data-hq-action="endLive">End game</button>` : ''}
        </div>
      </div>`;
    }

    if (type === 'would') {
      const item = WOULD[(state.questionIndex || 0) % WOULD.length];
      const mine = state.answers?.[hqSession?.user?.id];
      const revealed = state.status === 'result';
      const values = Object.values(state.answers || {});
      const aCount = values.filter(v => v === 0).length;
      const bCount = values.filter(v => v === 1).length;
      const total = Math.max(1, aCount + bCount);

      return `<div class="hq-game-stage">
        <div class="tagline">↔️ WOULD YOU RATHER · ROUND ${Number(state.round || 1)}</div>
        <div class="hq-question">Would you rather...</div>
        <div class="hq-answer-grid">
          <button class="hq-answer${mine===0?' selected':''}" data-hq-answer="0" ${mine!==undefined||revealed?'disabled':''}>A. ${hqEsc(item[0])}</button>
          <button class="hq-answer${mine===1?' selected':''}" data-hq-answer="1" ${mine!==undefined||revealed?'disabled':''}>B. ${hqEsc(item[1])}</button>
        </div>
        ${revealed ? `<div class="callout" style="margin-top:12px"><b>${hqEsc(item[0])}</b> — ${Math.round(aCount/total*100)}%<br><b>${hqEsc(item[1])}</b> — ${Math.round(bCount/total*100)}%</div>` : `<p class="muted-note">${values.length} vote${values.length===1?'':'s'} locked in.</p>`}
        <div class="hq-game-toolbar">
          <button class="btn alt" data-hq-action="backHub">← Games</button>
          ${isHost(state) && !revealed ? `<button class="btn" data-hq-action="revealLive">Reveal votes</button>` : ''}
          ${isHost(state) && revealed ? `<button class="btn" data-hq-action="nextLive">Next vote →</button>` : ''}
          ${isHost(state) ? `<button class="btn warn" data-hq-action="endLive">End game</button>` : ''}
        </div>
      </div>`;
    }

    if (type === 'wheel') {
      return `<div class="hq-game-stage">
        <div class="tagline">🎡 FAMILY CHALLENGE WHEEL</div>
        <h2>Spin it and do what it says</h2>
        <div class="hq-wheel-result"><span>${hqEsc(state.spinResult || 'Ready to spin...')}</span></div>
        <div class="hq-game-toolbar">
          <button class="btn alt" data-hq-action="backHub">← Games</button>
          <button class="btn" data-hq-action="spinWheel">🎡 Spin</button>
          ${isHost(state) ? `<button class="btn warn" data-hq-action="endLive">End game</button>` : ''}
        </div>
      </div>`;
    }

    return gameHub();
  }

  function bingoStage() {
    const won = bingoWon();
    return `<div class="hq-game-stage">
      <div class="tagline">🎟️ CHRISTMAS BINGO</div>
      <h2>${won ? '🎉 BINGO!' : 'Spot it. Tap it. Get five in a row.'}</h2>
      <p class="muted-note">Each person can play on their own phone while you’re all together.</p>
      <div class="hq-bingo">
        ${BINGO_WORDS.map((word,i) => `<button data-hq-bingo="${i}" class="${hqBingoMarked.has(i)?'marked':''}">${hqEsc(word)}</button>`).join('')}
      </div>
      <div class="hq-game-toolbar">
        <button class="btn alt" data-hq-action="backHub">← Games</button>
        <button class="btn warn" data-hq-action="resetBingo">Reset card</button>
      </div>
    </div>`;
  }

  function bingoWon() {
    const lines = [];
    for (let r=0;r<5;r++) lines.push([0,1,2,3,4].map(c => r*5+c));
    for (let c=0;c<5;c++) lines.push([0,1,2,3,4].map(r => r*5+c));
    lines.push([0,6,12,18,24],[4,8,12,16,20]);
    return lines.some(line => line.every(i => hqBingoMarked.has(i)));
  }

  function resetMemory() {
    const cards = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .map((icon,i) => ({id:`m${Date.now()}_${i}_${Math.random()}`,icon,matched:false}))
      .sort(() => Math.random() - .5);
    hqMemory = {cards, face:[], moves:0, locked:false};
  }

  function memoryStage() {
    if (!hqMemory) resetMemory();
    const done = hqMemory.cards.every(c => c.matched);

    return `<div class="hq-game-stage">
      <div class="tagline">🧩 MEMORY MATCH</div>
      <h2>${done ? '🎉 All pairs found!' : 'Find the Christmas pairs'}</h2>
      <p class="muted-note">Moves: <b>${hqMemory.moves}</b> · Pairs: <b>${hqMemory.cards.filter(c=>c.matched).length/2}/${MEMORY_ICONS.length}</b></p>
      <div class="hq-memory">
        ${hqMemory.cards.map((c,i) => {
          const up = c.matched || hqMemory.face.includes(i);
          return `<button data-hq-memory="${i}" class="${up?'faceup':''} ${c.matched?'matched':''}" ${c.matched?'disabled':''}>${up?c.icon:'?'}</button>`;
        }).join('')}
      </div>
      <div class="hq-game-toolbar">
        <button class="btn alt" data-hq-action="backHub">← Games</button>
        <button class="btn warn" data-hq-action="resetMemory">New board</button>
      </div>
    </div>`;
  }

  function gamesPage() {
    if (hqLocalView === 'hub') return gameHub();
    if (hqLocalView === 'bingo') return bingoStage();
    if (hqLocalView === 'memory') return memoryStage();
    return liveGameStage();
  }

  function renderGames(top = true) {
  buildChristmasHeader();

  screen.innerHTML = gamesPage();

  ensureGamesNav();
  addSnow();
  ensureMusicDock();

  if (top) {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }
}

  function isHost(state) {
    return !!hqSession && state?.hostId === hqSession.user.id;
  }

  function defaultGameState(type) {
    return {
      game:type,
      hostId:hqSession?.user?.id || '',
      status:'question',
      questionIndex:0,
      round:1,
      answers:{},
      scores:{},
      spinResult:'',
      updatedAt:new Date().toISOString()
    };
  }

  async function fetchLiveState() {
    if (!hqDb || !hqFamilyId) return;

    const { data, error } = await hqDb
      .from('shared_items')
      .select('id,data')
      .eq('family_id', hqFamilyId)
      .eq('section', GAME_SECTION)
      .eq('title', GAME_ROW_TITLE)
      .maybeSingle();

    if (error) {
      console.warn('Games state load failed', error);
      return;
    }

    if (data) {
      hqLiveRowId = data.id;
      hqLiveState = data.data || null;
    } else {
      hqLiveRowId = '';
      hqLiveState = null;
    }
  }

  async function saveLiveState(next) {
    if (!hqDb || !hqFamilyId || !hqSession) {
      hqLiveState = next;
      if (ui.tab === 'games') renderGames(false);
      return;
    }

    next.updatedAt = new Date().toISOString();

    if (hqLiveRowId) {
      const { error } = await hqDb
        .from('shared_items')
        .update({data:next,updated_at:new Date().toISOString()})
        .eq('id', hqLiveRowId);

      if (error) throw error;
    } else {
      const { data, error } = await hqDb
        .from('shared_items')
        .insert({
          family_id:hqFamilyId,
          section:GAME_SECTION,
          title:GAME_ROW_TITLE,
          data:next,
          created_by:hqSession.user.id
        })
        .select('id')
        .single();

      if (error) throw error;
      hqLiveRowId = data.id;
    }

    hqLiveState = next;
    if (ui.tab === 'games') renderGames(false);
  }

  async function mutateLive(mutator) {
    if (hqDb && hqFamilyId) await fetchLiveState();
    const next = structuredCloneSafe(hqLiveState || {});
    mutator(next);
    await saveLiveState(next);
  }

  function structuredCloneSafe(value) {
    try { return structuredClone(value); }
    catch (_) { return JSON.parse(JSON.stringify(value)); }
  }

  async function startLiveGame(type) {
    hqLocalView = type;
    const next = defaultGameState(type);
    await saveLiveState(next);
  }

  async function submitAnswer(index) {
    if (!hqSession) {
      notice('Sign into Family Cloud to play live with family.');
      return;
    }

    await mutateLive(state => {
      state.answers ||= {};
      state.answers[hqSession.user.id] = Number(index);
    });
  }

  async function revealLive() {
    await mutateLive(state => {
      if (state.game === 'trivia' || state.game === 'song') {
        const bank = state.game === 'trivia' ? TRIVIA : SONG_GUESS;
        const item = bank[(state.questionIndex || 0) % bank.length];
        state.scores ||= {};

        for (const [id, answer] of Object.entries(state.answers || {})) {
          if (Number(answer) === item[2]) state.scores[id] = Number(state.scores[id] || 0) + 1;
          else state.scores[id] = Number(state.scores[id] || 0);
        }
      }
      state.status = 'result';
    });
  }

  async function nextLive() {
    await mutateLive(state => {
      state.questionIndex = Number(state.questionIndex || 0) + 1;
      state.round = Number(state.round || 1) + 1;
      state.answers = {};
      state.status = 'question';
      state.spinResult = '';
    });
  }

  async function endLive() {
    await mutateLive(state => {
      state.game = null;
      state.status = 'lobby';
      state.answers = {};
      state.spinResult = '';
    });
    hqLocalView = 'hub';
  }

  async function spinWheel() {
    const result = WHEEL[Math.floor(Math.random() * WHEEL.length)];
    await mutateLive(state => {
      state.spinResult = result;
      state.status = 'result';
    });
  }

  async function initFamilyGames() {
    if (!window.supabase?.createClient) return;

    hqDb = window.supabase.createClient(HQ_SUPABASE_URL, HQ_SUPABASE_KEY, {
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });

    const { data } = await hqDb.auth.getSession();
    hqSession = data.session;
    hqFamilyId = localStorage.getItem('christmas-hq-family-id') || '';

    if (!hqSession || !hqFamilyId) {
      if (ui.tab === 'games') renderGames(false);
      return;
    }

    const { data: members } = await hqDb
      .from('family_members')
      .select('user_id,display_name,role')
      .eq('family_id', hqFamilyId);

    hqFamilyMembers = members || [];
    await fetchLiveState();

    hqGameChannel = hqDb.channel('hq-games-' + hqFamilyId)
      .on('postgres_changes',{
        event:'*',
        schema:'public',
        table:'shared_items',
        filter:`family_id=eq.${hqFamilyId}`
      }, payload => {
        const row = payload.new || payload.old || {};
        if (row.title !== GAME_ROW_TITLE) return;
        if (payload.eventType === 'DELETE') {
          hqLiveState = null;
          hqLiveRowId = '';
        } else {
          hqLiveState = row.data || null;
          hqLiveRowId = row.id || hqLiveRowId;
        }
        if (ui.tab === 'games') renderGames(false);
      })
      .subscribe();

    const me = hqFamilyMembers.find(m => m.user_id === hqSession.user.id);
    const myName = me?.display_name || hqSession.user.email?.split('@')[0] || 'Family';

    hqPresenceChannel = hqDb.channel('hq-family-presence-' + hqFamilyId, {
      config:{presence:{key:hqSession.user.id}}
    });

    hqPresenceChannel
      .on('presence',{event:'sync'},() => {
        const presence = hqPresenceChannel.presenceState();
        hqPresence = Object.values(presence)
          .flat()
          .map(p => ({id:p.user_id,name:p.display_name}))
          .filter((p,i,a) => a.findIndex(x => x.id === p.id) === i);

        if (ui.tab === 'games') renderGames(false);
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await hqPresenceChannel.track({
            user_id:hqSession.user.id,
            display_name:myName,
            online_at:new Date().toISOString()
          });
        }
      });
  }

  function openMusicDb() {
    return new Promise((resolve,reject) => {
      const req = indexedDB.open(MUSIC_DB,1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(MUSIC_STORE)) {
          const store = db.createObjectStore(MUSIC_STORE,{keyPath:'id'});
          store.createIndex('createdAt','createdAt');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function refreshMusicSongs() {
  try {
    const cloud = window.ChristmasHQFamilyCloud;

    if (
      cloud &&
      cloud.client &&
      cloud.session &&
      cloud.familyId
    ) {
      const { data, error } = await cloud.client
        .from('family_music')
        .select('*')
        .eq('family_id', cloud.familyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      hqMusicSongs = await Promise.all(
        (data || []).map(async row => {
          let playUrl = row.external_url || '';

          if (row.storage_path) {
            const { data: signed, error: signedError } =
              await cloud.client.storage
                .from('family-music')
                .createSignedUrl(row.storage_path, 3600);

            if (!signedError) {
              playUrl = signed?.signedUrl || '';
            }
          }

          return {
            id: row.id,
            title: row.title,
            artist: row.artist,
            url: playUrl,
            cloudAudio: !!row.storage_path,
            storagePath: row.storage_path,
            createdAt: row.created_at
          };
        })
      );

    } else {
      const db = await openMusicDb();

      hqMusicSongs = await new Promise((resolve, reject) => {
        const tx = db.transaction(MUSIC_STORE, 'readonly');
        const req = tx.objectStore(MUSIC_STORE).getAll();

        req.onsuccess = () =>
          resolve(
            (req.result || []).filter(
              song => song.file instanceof Blob
            )
          );

        req.onerror = () => reject(req.error);
      });
    }

    if (
      !hqSelectedSongId ||
      !hqMusicSongs.some(song => song.id === hqSelectedSongId)
    ) {
      hqSelectedSongId = hqMusicSongs[0]?.id || '';

      if (hqSelectedSongId) {
        localStorage.setItem(
          'christmas-hq-music-song',
          hqSelectedSongId
        );
      }
    }

    loadSelectedSong();
    ensureMusicDock();

  } catch (err) {
    console.warn('Music library load failed', err);
  }
}

   


  function ensureAudio() {
    if (hqAudio) return hqAudio;

    hqAudio = document.createElement('audio');
    hqAudio.id = 'hqPersistentChristmasAudio';
    hqAudio.loop = true;
    hqAudio.preload = 'metadata';
    hqAudio.volume = Math.min(1,Math.max(0,hqMusicVolume));
    document.body.appendChild(hqAudio);
    return hqAudio;
  }

  function selectedSong() {
    return hqMusicSongs.find(s => s.id === hqSelectedSongId) || hqMusicSongs[0] || null;
  }

  function loadSelectedSong() {
    const song = selectedSong();
    const audio = ensureAudio();

    if (hqMusicObjectUrl) {
      URL.revokeObjectURL(hqMusicObjectUrl);
      hqMusicObjectUrl = '';
    }

    if (song?.file instanceof Blob) {
  hqMusicObjectUrl = URL.createObjectURL(song.file);
  audio.src = hqMusicObjectUrl;

} else if (song?.cloudAudio && song?.url) {
  audio.src = song.url;

} else {
  audio.removeAttribute('src');
  return;
}

audio.volume = hqMusicVolume;
  }

  async function playMusic() {
    const song = selectedSong();

    if (!song) {
  notice('No song selected — tap Add song 🎵');
  return;
}
    

    const audio = ensureAudio();
    hqMusicEnabled = true;
    localStorage.setItem('christmas-hq-music-enabled','1');

    try {
      await audio.play();
    } catch (_) {
      notice('Tap Play once to let your browser start the music.');
    }

    ensureMusicDock();
  }

  function pauseMusic() {
    ensureAudio().pause();
    hqMusicEnabled = false;
    localStorage.setItem('christmas-hq-music-enabled','0');
    ensureMusicDock();
  }

  function ensureMusicDock() {
  let dock = document.getElementById('hqMusicDock');

  const showMusicDock =
    ui.tab === 'home' ||
    (ui.tab === 'magic' && ui.sub.magic === 'Music');

  if (!showMusicDock) {
    if (dock) dock.style.display = 'none';
    return;
  }

  if (dock) dock.style.display = '';

    if (!dock) {
      dock = document.createElement('div');
      dock.id = 'hqMusicDock';
      dock.className = 'hq-music-dock';
      mast.insertAdjacentElement('afterend', dock);
    }

    const song = selectedSong();
    const playing = !!hqAudio && !hqAudio.paused && !!hqAudio.src;

    dock.innerHTML = `
      <div class="hq-music-mini">
        <span class="hq-music-icon">🎵</span>
        <div class="hq-music-info">
          <b>${song ? hqEsc(song.title) : 'Your Christmas music'}</b>
          <small>${song ? hqEsc(song.artist || song.fileName || 'Christmas HQ') : 'Add your own song in Magic → Music'}</small>
        </div>
        <button class="hq-music-btn" data-hq-music="${playing?'pause':'play'}">${playing?'❚❚':'▶'}</button>
        <button class="hq-music-expand" data-hq-music="expand" aria-label="Music options">⋯</button>
      </div>
      <div class="hq-music-tools">
        <select data-hq-music-select aria-label="Choose Christmas song">
          ${hqMusicSongs.length ? hqMusicSongs.map(s => `<option value="${hqEsc(s.id)}" ${s.id===hqSelectedSongId?'selected':''}>${hqEsc(s.title)}</option>`).join('') : '<option value="">No uploaded songs yet</option>'}
        </select>
        <span>🔈</span>
        <input data-hq-volume type="range" min="0" max="1" step=".05" value="${hqMusicVolume}">
        <button class="hq-music-btn" data-hq-music="add" style="font-size:12px;white-space:nowrap">+ Add song</button>
      </div>`;
  }

  async function firstGestureMusic() {
  if (!hqMusicEnabled || !selectedSong()) return;

  try {
    await ensureAudio().play();
    document.removeEventListener('pointerdown', firstGestureMusic, true);
  } catch (_) {}

  ensureMusicDock();
}

    
  

  function renderFestiveAfter() {
    addSnow();
    ensureGamesNav();
    addHomeGamesShortcut();
    ensureMusicDock();
  }

  injectStyle();

  const previousRender = render;
  render = function(top = true) {
     mast.dataset.hqPage = ui.tab;
    if (ui.tab === 'games') {
      renderGames(top);
      return;
    }

    previousRender(top);
buildChristmasHeader();
renderFestiveAfter();
  };

  document.addEventListener('click', async event => {
    const gameCard = event.target.closest('[data-hq-game]');
    if (gameCard) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const type = gameCard.dataset.hqGame;

      if (type === 'bingo' || type === 'memory') {
        hqLocalView = type;
        renderGames(false);
        return;
      }

      if (!hqSession || !hqFamilyId) {
        notice('Connect Family Cloud in Settings to start a live family game.');
        return;
      }

      await startLiveGame(type);
      return;
    }

    const answer = event.target.closest('[data-hq-answer]');
    if (answer) {
      event.preventDefault();
      event.stopImmediatePropagation();
      await submitAnswer(Number(answer.dataset.hqAnswer));
      return;
    }

    const bingo = event.target.closest('[data-hq-bingo]');
    if (bingo) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const index = Number(bingo.dataset.hqBingo);
      if (hqBingoMarked.has(index)) hqBingoMarked.delete(index);
      else hqBingoMarked.add(index);
      renderGames(false);
      return;
    }

    const memory = event.target.closest('[data-hq-memory]');
    if (memory) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (!hqMemory || hqMemory.locked) return;
      const index = Number(memory.dataset.hqMemory);
      const card = hqMemory.cards[index];

      if (!card || card.matched || hqMemory.face.includes(index) || hqMemory.face.length >= 2) return;
      hqMemory.face.push(index);
      renderGames(false);

      if (hqMemory.face.length === 2) {
        hqMemory.moves++;
        const [a,b] = hqMemory.face;

        if (hqMemory.cards[a].icon === hqMemory.cards[b].icon) {
          hqMemory.cards[a].matched = true;
          hqMemory.cards[b].matched = true;
          hqMemory.face = [];
          renderGames(false);
        } else {
          hqMemory.locked = true;
          setTimeout(() => {
            hqMemory.face = [];
            hqMemory.locked = false;
            if (ui.tab === 'games' && hqLocalView === 'memory') renderGames(false);
          },700);
        }
      }
      return;
    }

    const actionButton = event.target.closest('[data-hq-action]');
    if (actionButton) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const action = actionButton.dataset.hqAction;

      try {
        if (action === 'backHub') {
          hqLocalView = 'hub';
          renderGames(false);
        } else if (action === 'joinLiveGame') {
          if (hqLiveState?.game) {
            hqLocalView = hqLiveState.game;
            renderGames(false);
          }
        } else if (action === 'revealLive') {
          await revealLive();
        } else if (action === 'nextLive') {
          await nextLive();
        } else if (action === 'endLive') {
          await endLive();
        } else if (action === 'spinWheel') {
          await spinWheel();
        } else if (action === 'resetBingo') {
          hqBingoMarked.clear();
          renderGames(false);
        } else if (action === 'resetMemory') {
          resetMemory();
          renderGames(false);
        }
      } catch (err) {
        console.warn(err);
        notice(err.message || 'Game update failed');
      }
      return;
    }

    const musicButton = event.target.closest('[data-hq-music]');
    if (musicButton) {
      event.preventDefault();
      event.stopImmediatePropagation();

      const action = musicButton.dataset.hqMusic;
      const dock = document.getElementById('hqMusicDock');

      if (action === 'play') await playMusic();
      if (action === 'pause') pauseMusic();
      if (action === 'expand') dock?.classList.toggle('open');
      if (action === 'add') {
  ui.tab = 'magic';
  ui.sub.magic = 'Music';
  render(true);
  setTimeout(() => {
    document.getElementById('christmasSongForm')?.scrollIntoView({
      behavior:'smooth',
      block:'start'
    });
  }, 100);
}
      return;
    }
  }, true);

  document.addEventListener('change', event => {
    const select = event.target.closest('[data-hq-music-select]');
    if (select) {
      hqSelectedSongId = select.value;
      localStorage.setItem('christmas-hq-music-song',hqSelectedSongId);
      const wasPlaying = hqAudio && !hqAudio.paused;
      loadSelectedSong();
      if (wasPlaying) playMusic();
      ensureMusicDock();
      return;
    }

    const volume = event.target.closest('[data-hq-volume]');
    if (volume) {
      hqMusicVolume = Number(volume.value);
      localStorage.setItem('christmas-hq-music-volume',String(hqMusicVolume));
      ensureAudio().volume = hqMusicVolume;
    }
  });

  document.addEventListener('input', event => {
    const volume = event.target.closest('[data-hq-volume]');
    if (volume) {
      hqMusicVolume = Number(volume.value);
      localStorage.setItem('christmas-hq-music-volume',String(hqMusicVolume));
      ensureAudio().volume = hqMusicVolume;
    }
  });

  document.addEventListener('submit', event => {
    if (event.target.id === 'christmasSongForm') {
      setTimeout(refreshMusicSongs,450);
    }
  }, true);

  document.addEventListener('pointerdown', firstGestureMusic, true);

  render(false);
  refreshMusicSongs();
  initFamilyGames();

  window.addEventListener('focus', refreshMusicSongs);
})();
