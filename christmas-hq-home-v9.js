/* Christmas HQ — Home V9
   Cinematic HQ home, live countdown, music directly underneath,
   dedicated Settings nav. Loaded AFTER panel-theme.js.
*/
(()=>{
'use strict';
if(window.__HQ_HOME_V9)return;
window.__HQ_HOME_V9=true;

const css=document.createElement('style');
css.id='hq-home-v9-style';
css.textContent=`
.mast[data-hq-page="home"]{
 height:360px!important;
min-height:360px!important;
max-height:360px!important;;
 padding:0!important;
 border-radius:0 0 30px 30px!important;
 background:
  linear-gradient(180deg,rgba(1,8,24,.02) 0%,rgba(1,8,24,.02) 48%,rgba(1,8,24,.34) 100%),
  url("./hq-home-scene-v9.webp?v=9") center/cover no-repeat!important;
 display:flex!important;align-items:stretch!important;justify-content:stretch!important;
}
.mast[data-hq-page="home"]>*:not(.hq-v9-home):not(.hq-snow){display:none!important}
.hq-v9-home{
 position:relative;z-index:5;width:100%;height:360px;min-height:360px;max-height:360px;box-sizing:border-box;;
 display:flex;flex-direction:column;align-items:center;
 padding:calc(env(safe-area-inset-top) + 18px) 14px 18px;
}
.hq-v9-logo{
 margin-top:4px;text-align:center;
 font-family:Georgia,"Times New Roman",serif;
 font-weight:1000;font-size:clamp(43px,12vw,66px);line-height:.88;
 letter-spacing:-2px;color:#fff1ba;
 -webkit-text-stroke:1.4px #6e160d;
 text-shadow:0 3px 0 #b31f16,0 6px 0 #71110c,0 10px 22px rgba(0,0,0,.72);
 transform:perspective(420px) rotateX(-4deg) scaleX(1.04);
}
.hq-v9-logo:before{content:"✦  ";color:#ffd35e;font-size:.42em;vertical-align:middle}
.hq-v9-logo:after{content:"  ✦";color:#ffd35e;font-size:.42em;vertical-align:middle}
.hq-v9-ribbon{
 margin-top:8px;color:#fff4d0;font:800 11px/1.2 system-ui,sans-serif;
 letter-spacing:2.2px;text-transform:uppercase;text-shadow:0 2px 8px #000;
}
.hq-v9-spacer{flex:1}
.hq-v9-count{
 width:min(94%,470px);margin:0 auto 5px;padding:12px 12px 11px;
 border:1px solid rgba(255,211,94,.68);border-radius:18px;
 background:linear-gradient(180deg,rgba(5,17,37,.90),rgba(3,12,29,.93));
 box-shadow:0 10px 28px rgba(0,0,0,.44),inset 0 0 20px rgba(255,213,92,.06);
 backdrop-filter:blur(8px);color:#fff;text-align:center;
}
.hq-v9-count-title{
 font:800 18px Georgia,serif;color:#ffe3a0;margin-bottom:8px;
 padding-bottom:7px;border-bottom:1px solid rgba(255,220,135,.35);
}
.hq-v9-grid{display:grid;grid-template-columns:repeat(4,1fr)}
.hq-v9-unit{padding:0 5px;border-right:1px solid rgba(255,255,255,.16)}
.hq-v9-unit:last-child{border-right:0}
.hq-v9-num{
 display:block;font:900 clamp(27px,8vw,39px)/1 Georgia,serif;color:#ffd469;
 text-shadow:0 2px 8px rgba(0,0,0,.8)
}
.hq-v9-label{display:block;margin-top:4px;font-size:10px;font-weight:800;color:#fff}
.mast[data-hq-page="home"] ~ #hqMusicDock,
.mast[data-hq-page="home"] + #hqMusicDock{
 margin:10px 14px 4px!important;border-radius:17px!important;
 background:linear-gradient(180deg,#071426,#030c1a)!important;
 border:1px solid rgba(212,169,69,.58)!important;
 box-shadow:0 8px 22px rgba(0,0,0,.22)!important;
 color:#fff!important;
}
.mast[data-hq-page="home"] ~ .container > .hero:first-child{display:none!important}

/* Settings is a real destination, not a floating gear over Home */
.mast[data-hq-page="home"] .circle-btn,
.mast[data-hq-page="home"] .back-btn{display:none!important}
#bottomNav button[data-nav="settings"], .nav button[data-nav="settings"]{min-width:0}
.mast[data-hq-page="settings"]{
 min-height:210px!important;
 background:
  linear-gradient(180deg,rgba(4,18,25,.20),rgba(4,20,22,.76)),
  var(--hq-panel-scene)!important;
}
.mast[data-hq-page="settings"] .back-btn{display:none!important}
.mast[data-hq-page="settings"] .circle-btn{display:none!important}
.mast[data-hq-page="settings"] ~ .container .card{
 border-radius:18px!important;box-shadow:0 8px 22px rgba(18,53,41,.08)!important;
}
@media(max-width:390px){
.hq-v9-home{height:360px;min-height:360px;max-height:360px}
.mast[data-hq-page="home"]{height:360px!important;min-height:360px!important;max-height:360px!important}
 .hq-v9-logo{font-size:42px}
 .hq-v9-count{width:96%}
}
`;
document.head.appendChild(css);

function christmasTarget(){
 const now=new Date();
 let y=now.getFullYear();
 let target=new Date(y,11,25,0,0,0);
 if(now>target) target=new Date(y+1,11,25,0,0,0);
 return target;
}
function parts(){
 const ms=Math.max(0,christmasTarget()-new Date());
 return {
  d:Math.floor(ms/86400000),
  h:Math.floor(ms%86400000/3600000),
  m:Math.floor(ms%3600000/60000),
  s:Math.floor(ms%60000/1000)
 };
}
function updateClock(){
 const p=parts();
 const vals=[p.d,p.h,p.m,p.s];
 document.querySelectorAll('.hq-v9-num').forEach((el,i)=>{
   el.textContent=String(vals[i]??0).padStart(i?2:1,'0');
 });
}
function buildHome(){
 if(typeof ui==='undefined'||ui.tab!=='home'||!window.mast)return;
 mast.dataset.hqPage='home';
 let box=mast.querySelector('.hq-v9-home');
 if(!box){
  box=document.createElement('div');
  box.className='hq-v9-home';
  box.innerHTML=`
   <div class="hq-v9-logo">CHRISTMAS HQ</div>
   <div class="hq-v9-ribbon">Your family Christmas, all in one place</div>
   <div class="hq-v9-spacer"></div>
   <div class="hq-v9-count" aria-label="Countdown to Christmas">
    <div class="hq-v9-count-title">Christmas Day</div>
    <div class="hq-v9-grid">
     <div class="hq-v9-unit"><span class="hq-v9-num">0</span><span class="hq-v9-label">Days</span></div>
     <div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Hours</span></div>
     <div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Minutes</span></div>
     <div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Seconds</span></div>
    </div>
   </div>`;
  mast.appendChild(box);
 }
 updateClock();
}

function ensureSettingsNav(){
 const nav=document.getElementById('bottomNav')||document.querySelector('.nav');
 if(!nav||nav.querySelector('[data-nav="settings"]'))return;
 const b=document.createElement('button');
 b.type='button'; b.dataset.nav='settings';
 b.innerHTML='<i>⚙️</i><span>Settings</span>';
 b.addEventListener('click',e=>{e.preventDefault(); if(typeof go==='function')go('settings')});
 nav.appendChild(b);
}
function polishSettings(){
 if(typeof ui==='undefined'||ui.tab!=='settings'||!window.mast)return;
 mast.dataset.hqPage='settings';
 const title=mast.querySelector('.hq-page-title,.mast-title');
 if(title)title.textContent='Settings';
}
function apply(){
 if(typeof ui==='undefined')return;
 if(ui.tab==='home')buildHome();
 if(ui.tab==='settings')polishSettings();
 ensureSettingsNav();
}
function hook(){
 if(typeof render!=='function'){setTimeout(hook,80);return}
 const prior=render;
 render=function(top=true){
  const result=prior(top);
  requestAnimationFrame(apply);
  setTimeout(apply,80);
  return result;
 };
 apply();
}
hook();
setInterval(updateClock,1000);
new MutationObserver(()=>requestAnimationFrame(apply))
 .observe(document.documentElement,{subtree:true,childList:true});
})();
