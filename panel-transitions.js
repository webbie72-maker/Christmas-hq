/* Christmas HQ - Panel Transitions v5
   Real main-page sliding + finger swipe navigation.
*/
(function(){
'use strict';
if(window.__christmasHQPanelTransitionsV5)return;
window.__christmasHQPanelTransitionsV5=true;

const ORDER=['home','gifts','plan','kitchen','magic','explore'];
const OUT=180, IN=260;
let busy=false, startX=0, startY=0, dx=0, tracking=false;
const screen=()=>document.getElementById('screen');
const current=()=>{
  const b=document.querySelector('#bottomNav button.current');
  return b?.dataset?.nav || (typeof ui!=='undefined' ? ui.tab : 'home');
};
const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const anim=(el,frames,opts)=>{
  if(!el||reduced()||typeof el.animate!=='function')return Promise.resolve();
  try{return el.animate(frames,opts).finished.catch(()=>{});}catch(e){return Promise.resolve();}
};
const clean=el=>{if(!el)return;el.style.transform='';el.style.opacity='';el.style.willChange='';};

document.documentElement.style.overflowX='hidden';
document.body.style.overflowX='hidden';

async function changeTo(target,dir){
  if(busy||!ORDER.includes(target)||target===current())return;
  const old=screen(); if(!old)return;
  busy=true;
  old.style.willChange='transform,opacity';
  const exit=dir==='back'?'100vw':'-100vw';
  const enter=dir==='back'?'-100vw':'100vw';
  await anim(old,[{transform:'translate3d(0,0,0)',opacity:1},{transform:'translate3d('+exit+',0,0)',opacity:.96}],{duration:OUT,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
  clean(old);
  try{
    if(typeof go==='function') go(target);
    else document.querySelector('#bottomNav button[data-nav="'+target+'"]')?.click();
  }catch(e){busy=false;return;}
  const fresh=screen();
  if(fresh){
    fresh.style.willChange='transform,opacity';
    await anim(fresh,[{transform:'translate3d('+enter+',0,0)',opacity:.96},{transform:'translate3d(0,0,0)',opacity:1}],{duration:IN,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    clean(fresh);
  }
  busy=false;
}

document.addEventListener('click',function(e){
  const b=e.target.closest('#bottomNav button[data-nav]');
  if(!b||busy)return;
  const target=b.dataset.nav, a=ORDER.indexOf(current()), z=ORDER.indexOf(target);
  if(a<0||z<0||a===z)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  changeTo(target,z<a?'back':'forward');
},true);

function blockedTarget(t){
  return !!t.closest('input,textarea,select,[contenteditable="true"],.subtabs,[data-no-swipe]');
}

document.addEventListener('touchstart',function(e){
  if(busy||e.touches.length!==1||blockedTarget(e.target))return;
  const t=e.touches[0]; startX=t.clientX; startY=t.clientY; dx=0; tracking=true;
},{passive:true});

document.addEventListener('touchmove',function(e){
  if(!tracking||busy||e.touches.length!==1)return;
  const t=e.touches[0], x=t.clientX-startX, y=t.clientY-startY;
  if(Math.abs(y)>Math.abs(x)*1.25){tracking=false;clean(screen());return;}
  if(Math.abs(x)<8)return;
  dx=x;
  if(Math.abs(x)>Math.abs(y)){
    e.preventDefault();
    const el=screen();
    if(el){
      const i=ORDER.indexOf(current());
      const edge=(dx>0&&i===0)||(dx<0&&i===ORDER.length-1);
      el.style.willChange='transform';
      el.style.transform='translate3d('+(edge?dx*.22:dx)+'px,0,0)';
    }
  }
},{passive:false});

document.addEventListener('touchend',function(){
  if(!tracking)return;
  tracking=false;
  const el=screen(), i=ORDER.indexOf(current()), moved=dx;
  clean(el);
  if(Math.abs(moved)>=55){
    if(moved<0&&i<ORDER.length-1)changeTo(ORDER[i+1],'forward');
    else if(moved>0&&i>0)changeTo(ORDER[i-1],'back');
    else anim(el,[{transform:'translate3d('+(moved*.22)+'px,0,0)'},{transform:'translate3d(0,0,0)'}],{duration:150,easing:'ease-out'}).then(()=>clean(el));
  }else{
    anim(el,[{transform:'translate3d('+moved+'px,0,0)'},{transform:'translate3d(0,0,0)'}],{duration:150,easing:'ease-out'}).then(()=>clean(el));
  }
  dx=0;
},{passive:true});

document.addEventListener('touchcancel',function(){tracking=false;dx=0;clean(screen());},{passive:true});
})();
