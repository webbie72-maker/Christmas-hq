/* Christmas HQ — Smart Recipe Food Tiles */
(() => {
  'use strict';
  if (window.__hqRecipeFoodTilesLoaded) return;
  window.__hqRecipeFoodTilesLoaded = true;

  function foodTileFor(r){
    const hay = [
      r?.name || '',
      r?.type || '',
      r?.detail || '',
      ...(Array.isArray(r?.tags) ? r.tags : []),
      ...(Array.isArray(r?.ingredients) ? r.ingredients.slice(0,6) : [])
    ].join(' ').toLowerCase();

    const rules = [
      [/potato salad/, 'potato-salad', '🥔', '🥗', 'Potato salad'],
      [/(salad|slaw|coleslaw|rocket|leafy|greens)/, 'salad', '🥗', '🍅', 'Fresh salad'],
      [/(prawn|shrimp|seafood)/, 'seafood', '🦐', '🍋', 'Seafood platter'],
      [/(salmon|fish|snapper|barramundi|tuna)/, 'fish', '🐟', '🍋', 'Fish'],
      [/(ham)/, 'ham', '🍖', '🍍', 'Christmas ham'],
      [/(turkey)/, 'turkey', '🦃', '🌿', 'Roast turkey'],
      [/(chicken)/, 'chicken', '🍗', '🍋', 'Chicken'],
      [/(beef|steak|brisket)/, 'beef', '🥩', '🔥', 'Beef'],
      [/(lamb)/, 'lamb', '🍖', '🌿', 'Lamb'],
      [/(pork|crackling)/, 'pork', '🐷', '🍎', 'Pork'],
      [/(potato|spud)/, 'potato', '🥔', '🌿', 'Potato'],
      [/(pasta|spaghetti|penne|linguine|macaroni)/, 'pasta', '🍝', '🧀', 'Pasta'],
      [/(corn)/, 'corn', '🌽', '🧈', 'Corn'],
      [/(rice|fried rice)/, 'rice', '🍚', '🍍', 'Rice dish'],
      [/(mango)/, 'mango', '🥭', '🍰', 'Mango'],
      [/(chocolate|cocoa|truffle)/, 'chocolate', '🍫', '🍓', 'Chocolate'],
      [/(fruit platter|fruit salad|watermelon|pineapple|berries|strawberry)/, 'fruit', '🍉', '🍍', 'Fruit platter'],
      [/(cake|cheesecake|pudding|dessert|trifle|pavlova|mousse|ice cream)/, 'dessert', '🍰', '🍓', 'Dessert'],
      [/(shortbread|cookie|biscuit|baking|brownie|slice|cupcake)/, 'baking', '🍪', '🧁', 'Christmas baking'],
      [/(mocktail|drink|iced tea|punch|lemonade|smoothie)/, 'drink', '🥤', '🍓', 'Festive drink'],
      [/(bagel|breakfast|brunch|french toast|toast)/, 'breakfast', '🥯', '🍓', 'Breakfast'],
      [/(stuffing|bread)/, 'bread', '🍞', '🌿', 'Festive side'],
      [/(cranberry|sauce|relish|chutney)/, 'sauce', '🍒', '🍊', 'Sauce'],
      [/(vegetarian|vegan|lentil|mushroom|vegetable|veggie)/, 'veggie', '🥕', '🥬', 'Vegetarian']
    ];

    for (const [re, cls, a, b, label] of rules) {
      if (re.test(hay)) return {cls, a, b, label};
    }

    const type = String(r?.type || '').toLowerCase();
    if (type.includes('dessert')) return {cls:'dessert',a:'🍰',b:'🍓',label:'Dessert'};
    if (type.includes('drink')) return {cls:'drink',a:'🥤',b:'🍓',label:'Festive drink'};
    if (type.includes('baking')) return {cls:'baking',a:'🍪',b:'🧁',label:'Christmas baking'};
    if (type.includes('breakfast')) return {cls:'breakfast',a:'🥯',b:'🍓',label:'Breakfast'};
    if (type.includes('side')) return {cls:'salad',a:'🥗',b:'🥕',label:'Christmas side'};
    if (type.includes('vegetarian')) return {cls:'veggie',a:'🥕',b:'🥬',label:'Vegetarian'};
    return {cls:'main',a:r?.icon || '🍽️',b:'🌿',label:'Christmas dish'};
  }

  window.recipeCard = function recipeCard(r){
    const v = foodTileFor(r);
    return `<button class="recipe-card hq-food-card" data-action="recipe" data-id="${r.id}">
      <span class="hq-food-photo food-${v.cls}" aria-hidden="true">
        <span class="hq-food-plate"></span>
        <span class="hq-food-main">${v.a}</span>
        <span class="hq-food-side">${v.b}</span>
        <span class="hq-food-tag">${esc(v.label)}</span>
      </span>
      <span class="recipe-type">${esc(r.type)}</span>
      <b>${esc(r.name)}</b>
      <small>⏱ ${esc(r.time)} · ${r.serves} serves</small>
      <span class="open">Full recipe & method →</span>
    </button>`;
  };

  const style = document.createElement('style');
  style.id = 'hqRecipeFoodTileStyles';
  style.textContent = `
    .recipe-grid{align-items:stretch}
    .recipe-card.hq-food-card{
      overflow:hidden!important;
      padding:0 0 15px!important;
      text-align:left!important;
      background:#fffefa!important;
      border:1px solid #e0e6de!important;
      border-radius:20px!important;
      box-shadow:0 8px 22px rgba(18,61,47,.07)!important;
    }
    .recipe-card.hq-food-card>.recipe-type,
    .recipe-card.hq-food-card>b,
    .recipe-card.hq-food-card>small,
    .recipe-card.hq-food-card>.open{
      margin-left:14px!important;
      margin-right:14px!important;
    }
    .recipe-card.hq-food-card>.recipe-type{margin-top:12px!important}
    .hq-food-photo{
      position:relative;
      width:100%;
      height:132px;
      display:block;
      overflow:hidden;
      border-radius:19px 19px 0 0;
      background:linear-gradient(145deg,#edf5e8,#dcebd8);
      isolation:isolate;
    }
    .hq-food-photo:before{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 16% 18%,rgba(255,255,255,.8) 0 2px,transparent 3px),
        radial-gradient(circle at 82% 25%,rgba(255,255,255,.55) 0 2px,transparent 3px),
        linear-gradient(180deg,rgba(255,255,255,.2),rgba(0,0,0,.04));
      z-index:0;
    }
    .hq-food-plate{
      position:absolute;
      width:112px;height:82px;
      left:50%;top:50%;
      transform:translate(-50%,-43%);
      border-radius:50%;
      background:radial-gradient(ellipse at center,#fff 0 48%,#f4f1e8 49% 63%,#d8d5cb 64% 66%,transparent 67%);
      filter:drop-shadow(0 10px 9px rgba(32,54,42,.18));
      z-index:1;
    }
    .hq-food-main{
      position:absolute;
      left:50%;top:50%;
      transform:translate(-57%,-55%) rotate(-5deg);
      font-size:54px;
      line-height:1;
      z-index:2;
      filter:drop-shadow(0 5px 4px rgba(0,0,0,.12));
    }
    .hq-food-side{
      position:absolute;
      left:64%;top:54%;
      transform:translate(-20%,-20%) rotate(8deg);
      font-size:28px;
      z-index:3;
      filter:drop-shadow(0 3px 3px rgba(0,0,0,.12));
    }
    .hq-food-tag{
      position:absolute;
      left:9px;bottom:8px;
      z-index:4;
      padding:4px 8px;
      border-radius:999px;
      background:rgba(8,46,37,.88);
      color:#fff;
      font-size:9px;
      font-weight:900;
      letter-spacing:.2px;
      box-shadow:0 3px 10px rgba(0,0,0,.14);
    }

    .food-salad,.food-potato-salad{background:linear-gradient(145deg,#dff3d9,#bfe4c8)}
    .food-seafood,.food-fish{background:linear-gradient(145deg,#dff4f4,#b9e1e8)}
    .food-ham,.food-pork{background:linear-gradient(145deg,#f8e0d6,#efc8b8)}
    .food-turkey,.food-chicken{background:linear-gradient(145deg,#f4ead2,#e8d7ae)}
    .food-beef,.food-lamb{background:linear-gradient(145deg,#ead8d0,#d8beb4)}
    .food-potato,.food-corn,.food-rice,.food-bread{background:linear-gradient(145deg,#f5edcf,#e8dba9)}
    .food-pasta{background:linear-gradient(145deg,#f7e9c7,#eccf8e)}
    .food-veggie{background:linear-gradient(145deg,#e1f1d2,#c9e5b8)}
    .food-mango,.food-fruit{background:linear-gradient(145deg,#fff0c8,#f7cf8b)}
    .food-chocolate{background:linear-gradient(145deg,#ead8c8,#cba98e)}
    .food-dessert,.food-baking{background:linear-gradient(145deg,#f9dfe6,#efd0dc)}
    .food-drink{background:linear-gradient(145deg,#dff1ec,#bfe0d7)}
    .food-breakfast{background:linear-gradient(145deg,#f5e8d1,#e7d1ad)}
    .food-sauce{background:linear-gradient(145deg,#f7d9d8,#e9b9b8)}
    .food-main{background:linear-gradient(145deg,#e6f0df,#d0dfc9)}

    @media(max-width:430px){
      .hq-food-photo{height:118px}
      .hq-food-main{font-size:48px}
      .hq-food-side{font-size:25px}
    }
  `;
  document.head.appendChild(style);

  try{
    if(typeof ui!=='undefined' && ui.tab==='kitchen' && typeof render==='function') render(false);
  }catch(e){}
})();
