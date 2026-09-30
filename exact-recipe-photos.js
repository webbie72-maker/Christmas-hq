/* Christmas HQ — Exact Recipe Photo Matcher v1
   Loads after recipe-food-tiles.js.
   Uses the FULL recipe name for each photo lookup and a unique stable lock per recipe,
   so different recipes no longer share a generic category photo.
*/
(() => {
  'use strict';

  function safeAttr(v){
    return String(v ?? '')
      .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      .replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  

  function stableLock(text){
    let h = 2166136261;
    for(let i=0;i<text.length;i++){
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return 1000 + (Math.abs(h >>> 0) % 900000);
  }

  function exactPhotoUrl(r){
    const name = String(r?.name || 'Christmas dish').trim();
    // Full dish name + food/plated helps the provider return the finished recipe,
    // rather than a raw ingredient or generic category image.
    const query = `${name} finished dish plated food`;
    const q = encodeURIComponent(query.replace(/\s+/g, ','));
    return `https://loremflickr.com/900/650/${q}?lock=${stableLock(name)}`;
  }

  function exactLabel(r){
    return String(r?.name || 'Christmas dish');
  }

  window.recipeCard = function recipeCard(r){
    const src = exactPhotoUrl(r);

    return `<button class="recipe-card hq-photo-recipe-card" data-action="recipe" data-id="${r.id}">
      <span class="hq-real-food-photo">
        <img
          src="${safeAttr(src)}"
          alt="${safeAttr(r.name)}"
          loading="lazy"
          decoding="async"
          >
        <span class="hq-real-food-shade"></span>
        <span class="hq-real-food-label">${typeof esc==='function' ? esc(exactLabel(r)) : safeAttr(exactLabel(r))}</span>
      </span>
      <span class="recipe-type">${typeof esc==='function' ? esc(r.type) : safeAttr(r.type)}</span>
      <b>${typeof esc==='function' ? esc(r.name) : safeAttr(r.name)}</b>
      <small>⏱ ${typeof esc==='function' ? esc(r.time) : safeAttr(r>.time)} · ${r.serves} serves</small>
      <span class="open">Full recipe & method →</span>
    </button>`;
  };

  // Rebuild immediately if Food/Kitchen is already open.
  try{
    if(typeof ui!=='undefined' && ui.tab==='kitchen' && typeof render==='function'){
      render(false);
    }
  }catch(e){}
})();
