/* Christmas HQ — Home spacing + unique recipe photos v5 */
(() => {
'use strict';

const css=`
/* HOME ONLY: remove the dead air around music/stats/toolkit */
.mast[data-hq-page="home"] + #hqMusicDock{margin-bottom:4px!important}
.mast[data-hq-page="home"] ~ .container{padding-top:8px!important}
.mast[data-hq-page="home"] ~ .container .summary{margin-top:0!important;margin-bottom:4px!important}
.mast[data-hq-page="home"] ~ .container .section-line:first-of-type{margin-top:10px!important}
.mast[data-hq-page="home"] ~ .container .section-line{margin-top:14px!important}

/* Keep recipe cards compact */
.recipe-grid{gap:8px!important}
.recipe-card{min-height:0!important;padding:8px!important;gap:4px!important}
.recipe-card .hq-real-food-photo{height:105px!important}
`;
const st=document.createElement('style');st.id='hqV5Fix';st.textContent=css;document.head.appendChild(st);

/* Give every recipe a unique full-name image request.
   No category lock: honey mustard, parmesan, paprika, teriyaki etc request different dishes. */
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)%900000+1000}
function imgFor(r){
 const n=String(r?.name||'Christmas food').trim();
 const q=encodeURIComponent((n+' plated finished dish food').replace(/\s+/g,','));
 return `https://loremflickr.com/900/650/${q}?lock=${hash(n)}`;
}
function escA(v){return String(v??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function installRecipeCard(){
 if(typeof window.recipeCard!=='function') return;
 window.recipeCard=function(r){
   const src=imgFor(r);
   const E=typeof esc==='function'?esc:escA;
   return `<button class="recipe-card hq-photo-recipe-card" data-action="recipe" data-id="${escA(r.id)}">
    <span class="hq-real-food-photo">
      <img src="${escA(src)}" alt="${escA(r.name)}" loading="lazy" decoding="async">
      <span class="hq-real-food-shade"></span>
      <span class="hq-real-food-label">${E(r.name)}</span>
    </span>
    <span class="recipe-type">${E(r.type)}</span>
    <b>${E(r.name)}</b>
    <small>⏱ ${E(r.time)} · ${r.serves} serves</small>
    <span class="open">Full recipe & method →</span>
   </button>`;
 };
 try{ if(typeof ui!=='undefined'&&ui.tab==='kitchen'&&typeof render==='function')render(false) }catch(e){}
}
installRecipeCard();
setTimeout(installRecipeCard,250);
})();