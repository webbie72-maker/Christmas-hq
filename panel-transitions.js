/* Christmas HQ - Panel Transitions v7 */
(function(){
'use strict';
if(window.__christmasHQPanelTransitionsV7)return;
window.__christmasHQPanelTransitionsV7=true;
const ORDER=['home','gifts','plan','kitchen','magic','games','chat','explore','settings'];const OUT=150,IN=210;let busy=false,startX=0,startY=0,dx=0,tracking=false;
const screen=()=>document.getElementById('screen');
const current=()=>document.querySelector('#bottomNav button.current')?.dataset?.nav||(typeof ui!=='undefined'?ui.tab:'home');
const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const anim=(el,frames,opts)=>{if(!el||reduced()||typeof el.animate!=='function')return Promise.resolve();try{return el.animate(frames,opts).finished.catch(()=>{});}catch(e){return Promise.resolve();}};
const clean=el=>{if(!el)return;el.style.transform='';el.style.opacity='';el.style.willChange='';};

const style=document.createElement('style');
style.id='christmas-hq-v6-mobile-fixes';
style.textContent=`
.mast::before{content:none!important;display:none!important;background:none!important}
.santa-box::after{content:none!important;display:none!important}
.hq-christmas-countdown{box-sizing:border-box!important;min-width:0!important;overflow:hidden!important}
.hq-days-block,.hq-clock-block{min-width:0!important}
.hq-clock-block{flex:1 1 auto!important}
.hq-clock-block b{max-width:100%!important;white-space:nowrap!important;font-variant-numeric:tabular-nums!important}
@media(max-width:430px){
 .hq-bottom-row{padding-right:76px!important}
 .hq-bottom-row .hq-christmas-countdown{width:100%!important;padding:12px 10px!important;gap:8px!important}
 .hq-days-block{gap:6px!important;padding-right:8px!important}
 .hq-days-block strong{font-size:clamp(35px,10vw,44px)!important}
 .hq-days-block span{font-size:8px!important;max-width:66px!important}
 .hq-clock-block small{font-size:7px!important;letter-spacing:.7px!important}
 .hq-clock-block b{font-size:clamp(19px,6vw,24px)!important;letter-spacing:.4px!important}
}
@media(max-width:375px){
 .hq-bottom-row{padding-right:70px!important}
 .hq-bottom-row .hq-christmas-countdown{padding:10px 8px!important;gap:6px!important}
 .hq-days-block{padding-right:6px!important}
 .hq-days-block strong{font-size:34px!important}
 .hq-days-block span{font-size:7px!important;max-width:56px!important}
 .hq-clock-block small{font-size:6.5px!important;letter-spacing:.45px!important}
 .hq-clock-block b{font-size:19px!important}
}`;
document.head.appendChild(style);
document.documentElement.style.overflowX='hidden';
document.body.style.overflowX='hidden';

async function changeTo(target){
 if(busy||!ORDER.includes(target)||target===current())return;
 busy=true;
 clean(screen());
 try{document.querySelector('#bottomNav button[data-nav="'+target+'"]')?.click();}catch(e){}
 busy=false;
}
document.addEventListener('click',function(e){
 const b=e.target.closest('#bottomNav button[data-nav]');if(!b||busy)return;
 const target=b.dataset.nav,a=ORDER.indexOf(current()),z=ORDER.indexOf(target);
 if(a<0||z<0||a===z)return;
 e.preventDefault();e.stopImmediatePropagation();changeTo(target);
},true);
function blockedTarget(t){return !!t.closest('input,textarea,select,[contenteditable="true"],.subtabs,[data-no-swipe]');}
document.addEventListener('touchstart',function(e){
 if(busy||e.touches.length!==1||blockedTarget(e.target))return;
 const t=e.touches[0];startX=t.clientX;startY=t.clientY;dx=0;tracking=true;
},{passive:true});
document.addEventListener('touchmove',function(e){
 if(!tracking||busy||e.touches.length!==1)return;
 const t=e.touches[0],x=t.clientX-startX,y=t.clientY-startY;
 if(Math.abs(y)>Math.abs(x)){tracking=false;return;}
 dx=x;
},{passive:true});
document.addEventListener('touchend',function(){
 if(!tracking)return;tracking=false;
 const i=ORDER.indexOf(current()),moved=dx;
 if(Math.abs(moved)>=72){
  if(moved<0&&i<ORDER.length-1)changeTo(ORDER[i+1]);
  else if(moved>0&&i>0)changeTo(ORDER[i-1]);
 }
 dx=0;
},{passive:true});
document.addEventListener('touchcancel',function(){tracking=false;dx=0;clean(screen());},{passive:true});
})();
