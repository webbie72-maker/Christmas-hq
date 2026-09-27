/* Christmas HQ — Kitchen Recipe Gallery v6.1
   Local recipe photos for gallery + full recipe detail. */
(() => {
'use strict';

const escAttr = v => String(v ?? '')
  .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;');

function imagePath(r){
  return `./recipe-images/${encodeURIComponent(String(r.id))}.webp`;
}
window.hqRecipeImagePath=imagePath;

window.hqRecipeImageMissing=function(img){
  img.onerror=null;
  img.style.display='none';
  const box=img.closest('.hq-v6-photo,.hq-v6-detail-photo');
  if(box) box.classList.add('is-missing');
};

window.recipeCard=function recipeCard(r){
  return `<button class="recipe-card hq-v6-recipe-card" data-action="recipe" data-id="${escAttr(r.id)}">
    <span class="hq-v6-photo">
      <img src="${imagePath(r)}" alt="${escAttr(r.name)}" loading="lazy" decoding="async"
           onerror="hqRecipeImageMissing(this)">
    </span>
    <span class="recipe-type">${esc(r.type)}</span>
    <b>${esc(r.name)}</b>
    <small>⏱ ${esc(r.time)} · ${r.serves} serves</small>
    <span class="open">Full recipe &amp; method →</span>
  </button>`;
};

function upgradeDetail(){
  try{
    if(typeof ui==='undefined'||ui.tab!=='kitchen'||ui.sub?.kitchen!=='Recipes'||!ui.recipe) return;
    if(typeof RECIPES==='undefined') return;
    const r=RECIPES.find(x=>x.id===ui.recipe);
    if(!r) return;

    const back=[...document.querySelectorAll('[data-action="recipeBack"]')].find(Boolean);
    if(!back) return;
    const card=back.nextElementSibling;
    if(!card || card.querySelector('.hq-v6-detail-photo')) return;

    /* The legacy detail card's first child is the 64px emoji. Replace it in-place. */
    const first=card.firstElementChild;
    if(first){
      const photo=document.createElement('div');
      photo.className='hq-v6-detail-photo';
      photo.innerHTML=`<img src="${imagePath(r)}" alt="${escAttr(r.name)}" onerror="hqRecipeImageMissing(this)">`;
      first.replaceWith(photo);
    }
  }catch(e){}
}

const style=document.createElement('style');
style.id='christmas-hq-kitchen-v61-styles';
style.textContent=`
/* Approved Home spacing */
.mast[data-hq-page="home"] + #hqMusicDock{margin-bottom:4px!important}
.mast[data-hq-page="home"] ~ .container{padding-top:8px!important}
.mast[data-hq-page="home"] ~ .container .summary{margin-top:0!important;margin-bottom:4px!important}
.mast[data-hq-page="home"] ~ .container .section-line:first-of-type{margin-top:10px!important}
.mast[data-hq-page="home"] ~ .container .section-line{margin-top:14px!important}

/* Recipe gallery */
.recipe-grid{gap:12px!important}
.recipe-card.hq-v6-recipe-card{
 overflow:hidden!important;min-height:0!important;padding:0 0 15px!important;gap:5px!important;
 text-align:left!important;background:#fffefa!important;border:1px solid #e0e6de!important;
 border-radius:20px!important;box-shadow:0 8px 22px rgba(18,61,47,.08)!important
}
.hq-v6-recipe-card>.recipe-type,.hq-v6-recipe-card>b,
.hq-v6-recipe-card>small,.hq-v6-recipe-card>.open{margin-left:14px!important;margin-right:14px!important}
.hq-v6-recipe-card>.recipe-type{margin-top:12px!important}
.hq-v6-photo{position:relative;display:block;width:100%;height:155px;overflow:hidden;
 border-radius:19px 19px 0 0;background:#e8eee9}
.hq-v6-photo img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;
 object-position:center!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;
 transform:scale(1.035)}
.hq-v6-photo.is-missing:after,.hq-v6-detail-photo.is-missing:after{
 content:"Recipe photo";position:absolute;inset:0;display:grid;place-items:center;
 color:#49665c;font-weight:800;font-size:12px;background:linear-gradient(135deg,#edf4ef,#f8fbf8)
}
.hq-v6-recipe-card .recipe-art,.hq-v6-recipe-card .hq-food-photo,
.hq-v6-recipe-card .recipe-food-art,.hq-v6-recipe-card .food-art{display:none!important}

/* Full recipe page */
.hq-v6-detail-photo{
 position:relative;width:calc(100% + 32px);height:250px;margin:-16px -16px 20px;
 overflow:hidden;border-radius:20px 20px 0 0;background:#e8eee9
}
.hq-v6-detail-photo img{
 display:block;width:100%;height:100%;object-fit:cover;object-position:center;border:0;margin:0;
 transform:scale(1.025)
}
@media(max-width:430px){
 .hq-v6-photo{height:145px}
 .hq-v6-detail-photo{height:220px}
}
`;
document.head.appendChild(style);

/* Upgrade every render without modifying index.html's kitchen() function. */
const observer=new MutationObserver(()=>upgradeDetail());
observer.observe(document.body,{childList:true,subtree:true});

try{
 if(typeof ui!=='undefined'&&ui.tab==='kitchen'&&typeof render==='function') render(false);
}catch(e){}
setTimeout(upgradeDetail,0);
})();