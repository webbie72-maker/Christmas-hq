(() => {
  const PHOTO_MAP = [
    { re: /(ham|glazed ham|sticky honey|mustard ham)/i, label: 'Christmas ham', query: 'glazed christmas ham platter' },
    { re: /(prawn|shrimp|seafood platter|oyster|salmon|lobster)/i, label: 'Seafood platter', query: 'christmas seafood platter' },
    { re: /(turkey|roast turkey)/i, label: 'Roast turkey', query: 'roast turkey christmas dinner' },
    { re: /(chicken|roast chicken)/i, label: 'Roast chicken', query: 'roast chicken christmas platter' },
    { re: /(beef|roast beef|brisket)/i, label: 'Roast beef', query: 'roast beef christmas dinner' },
    { re: /(pork|porchetta)/i, label: 'Roast pork', query: 'roast pork crackling dinner' },
    { re: /(potato|roast potato|mash)/i, label: 'Potato side', query: 'crispy roast potatoes christmas' },
    { re: /(corn)/i, label: 'Corn side', query: 'buttered corn side dish' },
    { re: /(salad|slaw|coleslaw|greens)/i, label: 'Fresh salad', query: 'christmas salad platter' },
    { re: /(vegetable|veg|carrot|broccoli|beans|asparagus)/i, label: 'Vegetable side', query: 'roasted vegetables christmas side' },
    { re: /(pasta|lasagne|lasagna)/i, label: 'Pasta bake', query: 'baked pasta dish' },
    { re: /(pie|tart|quiche)/i, label: 'Pie or tart', query: 'savory tart christmas table' },
    { re: /(cake|fruit cake)/i, label: 'Christmas cake', query: 'christmas cake dessert' },
    { re: /(pudding|sticky date|bread pudding)/i, label: 'Christmas pudding', query: 'christmas pudding dessert' },
    { re: /(trifle)/i, label: 'Trifle', query: 'christmas trifle dessert' },
    { re: /(cheesecake)/i, label: 'Cheesecake', query: 'cheesecake dessert christmas' },
    { re: /(slice|brownie|bar)/i, label: 'Sweet slice', query: 'dessert slice brownies platter' },
    { re: /(biscuit|cookie|gingerbread)/i, label: 'Christmas biscuits', query: 'christmas cookies gingerbread' },
    { re: /(pavlova|meringue)/i, label: 'Pavlova', query: 'christmas pavlova dessert' },
    { re: /(ice cream|gelato|sorbet)/i, label: 'Cold dessert', query: 'ice cream dessert christmas' },
    { re: /(cocktail|mocktail|drink|punch)/i, label: 'Festive drink', query: 'christmas cocktail drink' },
    { re: /(breakfast|brunch)/i, label: 'Brunch', query: 'christmas brunch platter' }
  ];

  const CSS = `
    .hq-recipe-photo{
      position:relative;
      height:190px;
      border-radius:28px 28px 0 0;
      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
      overflow:hidden;
    }
    .hq-recipe-photo::after{
      content:"";
      position:absolute;
      inset:0;
      background:linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(0,0,0,.14) 100%);
    }
    .hq-recipe-photo-label{
      position:absolute;
      left:14px;
      bottom:14px;
      z-index:2;
      display:inline-flex;
      align-items:center;
      padding:8px 14px;
      border-radius:999px;
      background:rgba(10,76,58,.95);
      color:#fff;
      font-size:13px;
      font-weight:800;
      box-shadow:0 8px 18px rgba(0,0,0,.18);
    }
  `;

  function addCssOnce() {
    if (document.getElementById('hq-recipe-photo-css')) return;
    const style = document.createElement('style');
    style.id = 'hq-recipe-photo-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function txt(el) {
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findRecipeCards() {
    let cards = [
      ...document.querySelectorAll(
        '.recipe-card, .hq-recipe-card, .kitchen-recipe-card, [data-recipe-card], article, li'
      )
    ].filter(card => /Full recipe & method/i.test(txt(card)));

    if (cards.length) return cards;

    const found = new Set();
    document.querySelectorAll('a, button, div, p, span').forEach(el => {
      if (!/Full recipe & method/i.test(txt(el))) return;
      let node = el;
      while (node && node !== document.body) {
        const t = txt(node);
        if (t.length > 40 && t.length < 900 && /(serves|mins?|minutes|hr|hours|recipe)/i.test(t)) {
          found.add(node);
          break;
        }
        node = node.parentElement;
      }
    });

    return [...found];
  }

  function findTitle(card) {
    const titleEl =
      card.querySelector('h1, h2, h3, h4, .recipe-title, [data-recipe-title], strong');

    if (titleEl && txt(titleEl).length > 4) return txt(titleEl);

    const lines = (card.innerText || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (
        line.length > 6 &&
        line.length < 90 &&
        !/mains|sides|desserts|vegetarian|vegan|full recipe|serves|mins?|hours?/i.test(line)
      ) {
        return line;
      }
    }

    return 'Christmas recipe';
  }

  function choosePhoto(title, cardText) {
    const hay = `${title} ${cardText}`.toLowerCase();
    for (const item of PHOTO_MAP) {
      if (item.re.test(hay)) return item;
    }
    return { label: 'Festive dish', query: 'christmas food platter' };
  }

  function photoUrl(query, seed) {
    return `https://source.unsplash.com/featured/1200x900/?${encodeURIComponent(query + ',' + seed)}`;
  }

  function hideOldArt(card) {
    const targets = card.querySelectorAll(
      '.recipe-food-art, .recipe-emoji-art, .recipe-tile-art, .food-art, [data-recipe-art]'
    );
    targets.forEach(el => (el.style.display = 'none'));

    const first = card.firstElementChild;
    if (!first) return;
    if (first.classList && first.classList.contains('hq-recipe-photo')) return;

    const smallText = txt(first);
    if (smallText.length < 40 || /🍤|🍖|🥔|🌽|🥗|🍰|🍪|🍽️|🦐/u.test(smallText)) {
      first.style.display = 'none';
    }
  }

  function upgradeCard(card) {
    const title = findTitle(card);
    const pick = choosePhoto(title, txt(card));

    let hero = card.querySelector('.hq-recipe-photo');
    if (!hero) {
      hero = document.createElement('div');
      hero.className = 'hq-recipe-photo';
      card.insertBefore(hero, card.firstElementChild);
    }

    hero.style.backgroundImage =
      `linear-gradient(180deg, rgba(255,255,255,.08) 0%, rgba(0,0,0,.10) 100%), url("${photoUrl(pick.query, title)}")`;

    hero.innerHTML = `<span class="hq-recipe-photo-label">${pick.label}</span>`;

    card.style.overflow = 'hidden';
    hideOldArt(card);
  }

  function runRecipeFoodTiles() {
    addCssOnce();
    const cards = findRecipeCards();
    cards.forEach(upgradeCard);
  }

  let timer;
  function rerunSoon() {
    clearTimeout(timer);
    timer = setTimeout(runRecipeFoodTiles, 180);
  }

  document.addEventListener('DOMContentLoaded', runRecipeFoodTiles);
  window.addEventListener('load', runRecipeFoodTiles);

  const mo = new MutationObserver(rerunSoon);
  mo.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (e) => {
    if (e.target.closest('button, [role="tab"], .chip, .pill')) {
      setTimeout(runRecipeFoodTiles, 120);
    }
  });
})();
