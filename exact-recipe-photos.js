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

  function fallbackKey(r){
    const s = [r?.name||'', r?.type||'', r?.detail||'', ...(Array.isArray(r?.tags)?r.tags:[])]
      .join(' ').toLowerCase();
    if(/prawn|shrimp|seafood|oyster|lobster|salmon|fish|snapper|barramundi|tuna/.test(s)) return 'seafood';
    if(/ham/.test(s)) return 'ham';
    if(/turkey/.test(s)) return 'turkey';
    if(/chicken/.test(s)) return 'chicken';
    if(/beef|steak|brisket|lamb/.test(s)) return 'beef';
    if(/pork|crackling/.test(s)) return 'pork';
    if(/potato/.test(s)) return 'potato';
    if(/salad|slaw|coleslaw/.test(s)) return 'salad';
    if(/pasta|spaghetti|penne|linguine|macaroni/.test(s)) return 'pasta';
    if(/fruit|mango|watermelon|pineapple|berries|strawberry/.test(s)) return 'fruit';
    if(/pavlova|trifle|cheesecake|cake|pudding|dessert|mousse|ice cream|rocky road|chocolate/.test(s)) return 'dessert';
    if(/shortbread|cookie|biscuit|gingerbread|brownie|slice|cupcake/.test(s)) return 'baking';
    if(/mocktail|cocktail|drink|tea|punch|lemonade/.test(s)) return 'drink';
    if(/breakfast|brunch|pancake|french toast|toast/.test(s)) return 'breakfast';
    if(/vegetarian|vegan|lentil|mushroom|vegetable|veggie/.test(s)) return 'veggie';
    return 'main';
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
    const key = fallbackKey(r);
    const src = exactPhotoUrl(r);

    return `<button class="recipe-card hq-photo-recipe-card" data-action="recipe" data-id="${r.id}">
      <span class="hq-real-food-photo">
        <img
          src="${safeAttr(src)}"
          alt="${safeAttr(r.name)}"
          loading="lazy"
          decoding="async"
          data-fallback-tried="0"
          onerror="hqRecipePhotoFallback(this,'${safeAttr(key)}')"
        >
        <span class="hq-real-food-shade"></span>
        <span class="hq-real-food-label">${typeof esc==='function' ? esc(exactLabel(r)) : safeAttr(exactLabel(r))}</span>
      </span>
      <span class="recipe-type">${typeof esc==='function' ? esc(r.type) : safeAttr(r.type)}</span>
      <b>${typeof esc==='function' ? esc(r.name) : safeAttr(r.name)}</b>
      <small>⏱ ${typeof esc==='function' ? esc(r.time) : safeAttr(r.time)} · ${r.serves} serves</small>
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
