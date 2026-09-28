/* Christmas HQ — Home V10 clean authoritative layer */
(()=>{'use strict';
if(window.__HQ_HOME_V10_CLEAN)return;window.__HQ_HOME_V10_CLEAN=true;

const css=document.createElement('style');
css.id='hq-home-v10-clean-style';
css.textContent=`
.mast[data-hq-page="home"]{
 height:365px!important;min-height:365px!important;max-height:365px!important;
 padding:0!important;border-radius:0 0 28px 28px!important;overflow:hidden!important;
 background:
  linear-gradient(180deg,rgba(1,8,20,.04),rgba(1,8,20,.12) 48%,rgba(1,8,20,.72)),
  url("./hq-home-scene-v9.webp?v=11") center/cover no-repeat!important;
 position:relative!important
}
.mast[data-hq-page="home"]>*:not(.hq-v10-home):not(.hq-snow){display:none!important}
.hq-v10-home{
 position:absolute!important;inset:0!important;z-index:40!important;
 display:flex!important;flex-direction:column!important;align-items:center!important;
 padding:calc(env(safe-area-inset-top) + 16px) 14px 15px!important;text-align:center!important
}
.hq-v10-title{
 margin-top:2px;font:1000 clamp(42px,12vw,64px)/.9 Georgia,serif;
 color:#fff0b7;letter-spacing:-2px;-webkit-text-stroke:1.2px #741b12;
 text-shadow:0 3px 0 #b5281c,0 6px 0 #71120c,0 10px 22px #000
}
.hq-v10-title:before,.hq-v10-title:after{
 content:"✦";font-size:.38em;color:#ffd35e;vertical-align:middle;margin:0 8px
}
.hq-v10-sub{
 margin-top:9px;color:#fff5d6;font:800 10px/1.2 system-ui,sans-serif;
 letter-spacing:2px;text-transform:uppercase;text-shadow:0 2px 7px #000
}
.hq-v10-spacer{flex:1}
.hq-v10-count{
 width:min(94%,470px);padding:11px 10px 10px;
 border:1px solid rgba(255,211,94,.72);border-radius:18px;
 background:linear-gradient(180deg,rgba(5,17,37,.91),rgba(3,12,29,.95));
 box-shadow:0 10px 28px rgba(0,0,0,.45);backdrop-filter:blur(8px);color:#fff
}
.hq-v10-count-title{
 font:800 17px Georgia,serif;color:#ffe3a0;margin-bottom:7px;padding-bottom:7px;
 border-bottom:1px solid rgba(255,220,135,.35)
}
.hq-v10-grid{display:grid;grid-template-columns:repeat(4,1fr)}
.hq-v10-unit{padding:0 4px;border-right:1px solid rgba(255,255,255,.16)}
.hq-v10-unit:last-child{border-right:0}
.hq-v10-num{
 display:block;font:900 clamp(26px,8vw,38px)/1 Georgia,serif;
 color:#ffd469;text-shadow:0 2px 8px #000
}
.hq-v10-label{display:block;margin-top:4px;font-size:9px;font-weight:850;color:#fff}
.mast[data-hq-page="home"]~.container>.hero:first-child{display:none!important}
body.hq-home-active #hqMusicDock{
 display:block!important;margin:10px 14px 4px!important;border-radius:17px!important
}
body:not(.hq-home-active) #hqMusicDock{display:none!important}
.mast[data-hq-page="home"] .circle-btn,.mast[data-hq-page="home"] .back-btn{display:none!important}
@media(max-width:390px){
 .mast[data-hq-page="home"]{height:350px!important;min-height:350px!important;max-height:350px!important}
 .hq-v10-title{font-size:40px}
 .hq-v10-count{width:97%}
}`;

document.head.appendChild(css);

function target(){
 const n=new Date(),y=n.getFullYear();
 let t=new Date(y,11,25,0,0,0);
 if(n>t)t=new Date(y+1,11,25,0,0,0);
 return t
}

function tick(){
 const ms=Math.max(0,target()-new Date());
 const v=[
  Math.floor(ms/86400000),
  Math.floor(ms%86400000/3600000),
  Math.floor(ms%3600000/60000),
  Math.floor(ms%60000/1000)
 ];
 document.querySelectorAll('.hq-v10-num').forEach((e,i)=>
  e.textContent=String(v[i]??0).padStart(i?2:1,'0')
 )
}

function apply(){
 if(typeof ui==='undefined'||!window.mast)return;
 const home=ui.tab==='home';
 document.body.classList.toggle('hq-home-active',home);

 if(!home){
  mast.querySelector('.hq-v10-home')?.remove();
  return
 }

 mast.dataset.hqPage='home';
 mast.querySelectorAll('.hq-v9-home').forEach(x=>x.remove());

 let h=mast.querySelector('.hq-v10-home');
 if(!h){
  h=document.createElement('div');
  h.className='hq-v10-home';
  h.innerHTML=`
   <div class="hq-v10-title">CHRISTMAS HQ</div>
   <div class="hq-v10-sub">Your family Christmas, all in one place</div>
   <div class="hq-v10-spacer"></div>
   <div class="hq-v10-count" aria-label="Countdown to Christmas">
    <div class="hq-v10-count-title">Countdown to Christmas Day</div>
    <div class="hq-v10-grid">
     <div class="hq-v10-unit"><span class="hq-v10-num">0</span><span class="hq-v10-label">Days</span></div>
     <div class="hq-v10-unit"><span class="hq-v10-num">00</span><span class="hq-v10-label">Hours</span></div>
     <div class="hq-v10-unit"><span class="hq-v10-num">00</span><span class="hq-v10-label">Minutes</span></div>
     <div class="hq-v10-unit"><span class="hq-v10-num">00</span><span class="hq-v10-label">Seconds</span></div>
    </div>
   </div>`;
  mast.appendChild(h)
 }
 tick()
}

function hook(){
 if(typeof render!=='function'||typeof ui==='undefined'||!window.mast){
  setTimeout(hook,50);
  return
 }
 const old=render;
 render=function(top=true){
  const out=old(top);
  requestAnimationFrame(apply);
  setTimeout(apply,40);
  return out
 };
 apply()
}

hook();
setInterval(()=>{apply();tick()},1000);
new MutationObserver(()=>requestAnimationFrame(apply))
 .observe(document.documentElement,{subtree:true,childList:true});
})();