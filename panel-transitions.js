/* Christmas HQ - Panel Transitions v6 */
(function(){
'use strict';
if(window.__christmasHQPanelTransitionsV6)return;
window.__christmasHQPanelTransitionsV6=true;
const ORDER=['home','gifts','plan','kitchen','magic','games','chat','explore'];const OUT=150,IN=210;
let busy=false,startX=0,startY=0,dx=0,tracking=false;
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

async function changeTo(target,dir,fromX=0){
 if(busy||!ORDER.includes(target)||target===current())return;
 const old=screen();if(!old)return;
 busy=true;old.style.willChange='transform';
 const exit=dir==='back'?'100vw':'-100vw';
 await anim(old,[{transform:'translate3d('+fromX+'px,0,0)'},{transform:'translate3d('+exit+',0,0)'}],
 {duration:OUT,easing:'cubic-bezier(.32,.72,0,1)',fill:'forwards'});
 clean(old);
try{document.querySelector('#bottomNav button[data-nav="'+target+'"]')?.click();} catch(e){busy=false;return;}
 const fresh=screen();
 if(fresh){
  const enter=dir==='back'?'-100vw':'100vw';
  fresh.style.willChange='transform';
  await anim(fresh,[{transform:'translate3d('+enter+',0,0)'},{transform:'translate3d(0,0,0)'}],
  {duration:IN,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
  clean(fresh);
 }
 busy=false;
}
document.addEventListener('click',function(e){
 const b=e.target.closest('#bottomNav button[data-nav]');if(!b||busy)return;
 const target=b.dataset.nav,a=ORDER.indexOf(current()),z=ORDER.indexOf(target);
 if(a<0||z<0||a===z)return;
 e.preventDefault();e.stopImmediatePropagation();changeTo(target,z<a?'back':'forward',0);
},true);
function blockedTarget(t){return !!t.closest('input,textarea,select,[contenteditable="true"],.subtabs,[data-no-swipe]');}
document.addEventListener('touchstart',function(e){
 if(busy||e.touches.length!==1||blockedTarget(e.target))return;
 const t=e.touches[0];startX=t.clientX;startY=t.clientY;dx=0;tracking=true;
},{passive:true});
document.addEventListener('touchmove',function(e){
 if(!tracking||busy||e.touches.length!==1)return;
 const t=e.touches[0],x=t.clientX-startX,y=t.clientY-startY;
 if(Math.abs(y)>Math.abs(x)*1.15&&Math.abs(y)>10){tracking=false;clean(screen());return;}
 if(Math.abs(x)<6)return;dx=x;
 if(Math.abs(x)>Math.abs(y)){
  e.preventDefault();const el=screen();
  if(el){const i=ORDER.indexOf(current()),edge=(dx>0&&i===0)||(dx<0&&i===ORDER.length-1),shown=edge?dx*.18:dx;
   el.style.willChange='transform';el.style.transform='translate3d('+shown+'px,0,0)';}
 }
},{passive:false});
document.addEventListener('touchend',function(){
 if(!tracking)return;tracking=false;
 const el=screen(),i=ORDER.indexOf(current()),moved=dx;
 if(Math.abs(moved)>=48){
  if(moved<0&&i<ORDER.length-1)changeTo(ORDER[i+1],'forward',moved);
  else if(moved>0&&i>0)changeTo(ORDER[i-1],'back',moved);
  else{const shown=moved*.18;anim(el,[{transform:'translate3d('+shown+'px,0,0)'},{transform:'translate3d(0,0,0)'}],{duration:130,easing:'cubic-bezier(.22,1,.36,1)'}).then(()=>clean(el));}
 }else anim(el,[{transform:'translate3d('+moved+'px,0,0)'},{transform:'translate3d(0,0,0)'}],{duration:130,easing:'cubic-bezier(.22,1,.36,1)'}).then(()=>clean(el));
 dx=0;
},{passive:true});
document.addEventListener('touchcancel',function(){tracking=false;dx=0;clean(screen());},{passive:true});
})();
