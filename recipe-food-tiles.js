/* Christmas HQ — Real Recipe Photo Tiles v2 */
(() => {
  'use strict';

  const FALLBACKS = {
    ham: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82',
    seafood: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=82',
    salad: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=82',
    turkey: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=82',
    chicken: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=82',
    beef: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=82',
    pork: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82',
    potato: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=900&q=82',
    pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=82',
    fruit: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=82',
    dessert: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82',
    baking: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=82',
    drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=82',
    breakfast: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=82',
    veggie: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=82',
    main: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=82'
  };

  const RULES = [
    [/potato salad/i,'salad','potato salad','Potato salad'],
    [/(prawn|shrimp|seafood|oyster|lobster)/i,'seafood','prawn seafood platter','Seafood platter'],
    [/(salmon|fish|snapper|barramundi|tuna)/i,'seafood','grilled fish seafood plate','Seafood'],
    [/(ham)/i,'ham','glazed ham dinner','Christmas ham'],
    [/(turkey)/i,'turkey','roast turkey dinner','Roast turkey'],
    [/(chicken)/i,'chicken','roast chicken dinner','Chicken'],
    [/(beef|steak|brisket)/i,'beef','roast beef dinner','Beef'],
    [/(lamb)/i,'beef','roast lamb dinner','Lamb'],
    [/(pork|crackling)/i,'pork','roast pork crackling','Pork'],
    [/(salad|slaw|coleslaw|rocket|greens)/i,'salad','fresh salad bowl','Fresh salad'],
    [/(potato|spud)/i,'potato','roast potatoes side dish','Potato'],
    [/(corn)/i,'veggie','grilled corn side dish','Corn'],
    [/(pasta|spaghetti|penne|linguine|macaroni)/i,'pasta','pasta dinner plate','Pasta'],
    [/(rice|fried rice)/i,'main','fried rice food','Rice dish'],
    [/(mango)/i,'fruit','mango dessert food','Mango'],
    [/(fruit|watermelon|pineapple|berries|strawberry)/i,'fruit','fresh fruit platter','Fruit'],
    [/(chocolate|cocoa|truffle)/i,'dessert','chocolate dessert','Chocolate'],
    [/(pavlova|trifle|cheesecake|cake|pudding|dessert|mousse|ice cream)/i,'dessert','christmas dessert cake','Dessert'],
    [/(shortbread|cookie|biscuit|gingerbread|baking|brownie|slice|cupcake)/i,'baking','christmas cookies baking','Christmas baking'],
    [/(mocktail|cocktail|drink|iced tea|punch|lemonade)/i,'drink','christmas mocktail drink','Festive drink'],
    [/(bagel|breakfast|brunch|french toast|toast)/i,'breakfast','christmas brunch breakfast','Breakfast'],
    [/(vegetarian|vegan|lentil|mushroom|vegetable|veggie)/i,'veggie','vegetarian christmas food','Vegetarian']
  ];

  function pick(r){
    const hay=[
      r?.name||'',
      r?.type||'',
      r?.detail||'',
      ...(Array.isArray(r?.tags)?r.tags:[])
    ].join(' ');
    for(const [re,key,query,label] of RULES){
      if(re.test(hay)) return {key,query,label};
    }
    const type=String(r?.type||'').toLowerCase();
    if(type.includes('dessert')) return {key:'dessert',query:'christmas dessert',label:'Dessert'};
    if(type.includes('drink')) return {key:'drink',query:'christmas drink',label:'Festive drink'};
    if(type.includes('baking')) return {key:'baking',query:'christmas baking',label:'Christmas baking'};
    if(type.includes('breakfast')) return {key:'breakfast',query:'christmas breakfast',label:'Breakfast'};
    if(type.includes('side')) return {key:'salad',query:'christmas side dish',label:'Christmas side'};
    if(type.includes('vegetarian')) return {key:'veggie',query:'vegetarian food',label:'Vegetarian'};
    return {key:'main',query:'christmas dinner plate',label:'Christmas dish'};
  }

  function photoUrl(query,key){
    const locks={
      ham:101,seafood:102,salad:103,turkey:104,chicken:105,beef:106,pork:107,
      potato:108,pasta:109,fruit:110,dessert:111,baking:112,drink:113,
      breakfast:114,veggie:115,main:116
    };
    const q=encodeURIComponent(query.replace(/\s+/g,','));
    return `https://loremflickr.com/900/650/${q}?lock=${locks[key]||116}`;
  }

  function safeAttr(v){
    return String(v??'')
      .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      .replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.hqRecipePhotoFallback = function(img,key){
    if(img.dataset.fallbackTried==='1') return;
    img.dataset.fallbackTried='1';
    img.src=FALLBACKS[key]||FALLBACKS.main;
  };

  window.recipeCard = function recipeCard(r){
    const p=pick(r);
    const src=photoUrl(p.query,p.key);
    return `<button class="recipe-card hq-photo-recipe-card" data-action="recipe" data-id="${r.id}">
      <span class="hq-real-food-photo">
        <img
          src="${safeAttr(src)}"
          alt="${safeAttr(r.name)}"
          loading="lazy"
          decoding="async"
          data-fallback-tried="0"
          onerror="hqRecipePhotoFallback(this,'${safeAttr(p.key)}')"
        >
        <span class="hq-real-food-shade"></span>
        <span class="hq-real-food-label">${esc(p.label)}</span>
      </span>
      <span class="recipe-type">${esc(r.type)}</span>
      <b>${esc(r.name)}</b>
      <small>⏱ ${esc(r.time)} · ${r.serves} serves</small>
      <span class="open">Full recipe & method →</span>
    </button>`;
  };

  const style=document.createElement('style');
  style.id='hq-real-recipe-photo-styles-v2';
  style.textContent=`
    .recipe-card.hq-photo-recipe-card{
      overflow:hidden!important;
      padding:0 0 15px!important;
      text-align:left!important;
      background:#fffefa!important;
      border:1px solid #e0e6de!important;
      border-radius:20px!important;
      box-shadow:0 8px 22px rgba(18,61,47,.07)!important;
    }
    .recipe-card.hq-photo-recipe-card>.recipe-type,
    .recipe-card.hq-photo-recipe-card>b,
    .recipe-card.hq-photo-recipe-card>small,
    .recipe-card.hq-photo-recipe-card>.open{
      margin-left:14px!important;
      margin-right:14px!important;
    }
    .recipe-card.hq-photo-recipe-card>.recipe-type{margin-top:12px!important}
    .hq-real-food-photo{
      position:relative;
      display:block;
      width:100%;
      height:155px;
      overflow:hidden;
      border-radius:19px 19px 0 0;
      background:#e7ece7;
    }
    .hq-real-food-photo img{
      display:block!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      border-radius:0!important;
    }
    .hq-real-food-shade{
      position:absolute;inset:0;
      background:linear-gradient(180deg,rgba(0,0,0,0) 48%,rgba(0,0,0,.28));
      pointer-events:none;
    }
    .hq-real-food-label{
      position:absolute;
      left:10px;bottom:10px;
      z-index:2;
      padding:5px 9px;
      border-radius:999px;
      background:rgba(8,67,51,.94);
      color:#fff;
      font-size:10px;
      font-weight:900;
      box-shadow:0 4px 12px rgba(0,0,0,.18);
    }

    /* kill every old emoji/cartoon recipe-art block */
    .hq-photo-recipe-card .recipe-art,
    .hq-photo-recipe-card .hq-food-photo,
    .hq-photo-recipe-card .recipe-food-art,
    .hq-photo-recipe-card .food-art{
      display:none!important;
    }

    @media(max-width:430px){
      .hq-real-food-photo{height:145px}
    }
  `;
  document.head.appendChild(style);

  /* Rebuild the recipe screen immediately if it is already open. */
  try{
    if(typeof ui!=='undefined' && ui.tab==='kitchen' && typeof render==='function'){
      render(false);
    }
  }catch(e){}
})();
