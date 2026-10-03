/* Christmas HQ — pictured dishes, verified photo mapping v4 */
(() => {
'use strict';
if(typeof RECIPES==='undefined') return;
const PICTURED_DISHES = [
  {
    "id": "dish-acai-bowl",
    "name": "Acai berry breakfast bowl",
    "type": "Breakfast",
    "time": "10 min",
    "serves": 2,
    "icon": "🍽️",
    "detail": "Acai berry breakfast bowl — ingredients and step-by-step method.",
    "ingredients": [
      "2 frozen acai puree sachets",
      "1 frozen banana",
      "150 g frozen berries",
      "100 ml milk",
      "4 tbsp granola",
      "Fresh berries to top"
    ],
    "steps": [
      "Blend acai, banana, frozen berries and milk until thick.",
      "Divide between bowls and top with granola and fresh berries. Serve immediately."
    ],
    "photo": "./recipe-images/acai-bowl.jpg",
    "tags": [
      "breakfast",
      "acai",
      "berry",
      "breakfast",
      "bowl"
    ]
  },
  {
    "id": "dish-antipasto",
    "name": "Festive antipasto platter",
    "type": "Snacks",
    "time": "20 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Festive antipasto platter — ingredients and step-by-step method.",
    "ingredients": [
      "150 g salami",
      "150 g prosciutto",
      "200 g mixed cheese",
      "100 g olives",
      "150 g marinated artichokes",
      "100 g crackers",
      "1 bunch grapes"
    ],
    "steps": [
      "Drain the olives and artichokes.",
      "Arrange meats, cheeses and vegetables on a platter. Add crackers and grapes just before serving. Keep chilled until needed."
    ],
    "photo": "./recipe-images/antipasto.jpg",
    "tags": [
      "snacks",
      "festive",
      "antipasto",
      "platter"
    ]
  },
  {
    "id": "dish-apple-sauce",
    "name": "Homemade apple sauce",
    "type": "Sides",
    "time": "25 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Homemade apple sauce — ingredients and step-by-step method.",
    "ingredients": [
      "4 apples, peeled and diced",
      "80 ml water",
      "1 tbsp lemon juice",
      "1 tbsp caster sugar",
      "Pinch cinnamon"
    ],
    "steps": [
      "Put all ingredients in a saucepan, cover and simmer gently for 15–20 minutes until apples are soft.",
      "Mash for a chunky sauce or blend until smooth. Cool and refrigerate."
    ],
    "photo": "./recipe-images/apple-sauce.jpg",
    "tags": [
      "sides",
      "homemade",
      "apple",
      "sauce"
    ]
  },
  {
    "id": "dish-arancini",
    "name": "Mozzarella arancini",
    "type": "Snacks",
    "time": "40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Mozzarella arancini — ingredients and step-by-step method.",
    "ingredients": [
      "600 g cold cooked risotto",
      "100 g mozzarella, cubed",
      "80 g flour",
      "2 beaten eggs",
      "150 g breadcrumbs",
      "750 ml frying oil"
    ],
    "steps": [
      "Form cold risotto into 12 balls with mozzarella inside each.",
      "Roll in flour, egg and breadcrumbs. Heat oil to 170–180°C and fry in batches for 4–5 minutes until golden and hot throughout. Drain on paper towel."
    ],
    "photo": "./recipe-images/arancini.jpg",
    "tags": [
      "snacks",
      "mozzarella",
      "arancini"
    ]
  },
  {
    "id": "dish-avocado-toast",
    "name": "Avocado toast with tomato",
    "type": "Breakfast",
    "time": "10 min",
    "serves": 2,
    "icon": "🍽️",
    "detail": "Avocado toast with tomato — ingredients and step-by-step method.",
    "ingredients": [
      "4 slices sourdough",
      "2 ripe avocados",
      "150 g cherry tomatoes",
      "1 tbsp lemon juice",
      "1 tbsp olive oil",
      "Salt and pepper"
    ],
    "steps": [
      "Toast sourdough. Mash avocado with lemon juice and seasoning.",
      "Spread on toast, add halved tomatoes and drizzle with olive oil."
    ],
    "photo": "./recipe-images/avocado-toast.jpg",
    "tags": [
      "breakfast",
      "avocado",
      "toast",
      "with",
      "tomato"
    ]
  },
  {
    "id": "dish-banana-bread",
    "name": "Banana bread",
    "type": "Baking",
    "time": "1 hr 10 min",
    "serves": 10,
    "icon": "🍽️",
    "detail": "Banana bread — ingredients and step-by-step method.",
    "ingredients": [
      "3 ripe bananas",
      "250 g plain flour",
      "2 tsp baking powder",
      "120 g brown sugar",
      "2 eggs",
      "100 g melted butter",
      "80 ml milk",
      "1 tsp vanilla"
    ],
    "steps": [
      "Heat oven to 175°C and line a loaf tin. Mash bananas and mix with eggs, butter, milk and vanilla.",
      "Combine flour, baking powder and sugar, then fold in wet mixture. Bake 50–60 minutes until a skewer comes out clean. Cool before slicing."
    ],
    "photo": "./recipe-images/banana-bread.jpg",
    "tags": [
      "baking",
      "banana",
      "bread"
    ]
  },
  {
    "id": "dish-baked-beans",
    "name": "Smoky homemade baked beans",
    "type": "Breakfast",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Smoky homemade baked beans — ingredients and step-by-step method.",
    "ingredients": [
      "2 x 400 g cans cannellini beans, drained",
      "400 g canned tomatoes",
      "1 onion, diced",
      "2 garlic cloves",
      "1 tbsp olive oil",
      "1 tsp smoked paprika",
      "1 tbsp maple syrup",
      "4 slices toast"
    ],
    "steps": [
      "Soften onion in oil for 5 minutes. Add crushed garlic and paprika for 1 minute.",
      "Add tomatoes, beans and maple syrup. Simmer 20 minutes, stirring, and serve on toast."
    ],
    "photo": "./recipe-images/baked-beans.jpg",
    "tags": [
      "breakfast",
      "smoky",
      "homemade",
      "baked",
      "beans"
    ]
  },
  {
    "id": "dish-bread-wreath",
    "name": "Pull-apart bread wreath",
    "type": "Baking",
    "time": "2 hr 15 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Pull-apart bread wreath — ingredients and step-by-step method.",
    "ingredients": [
      "500 g bread flour",
      "7 g instant yeast",
      "300 ml warm water",
      "1 tsp sugar",
      "1 tsp salt",
      "2 tbsp olive oil",
      "30 g butter",
      "2 garlic cloves",
      "1 tbsp chopped parsley"
    ],
    "steps": [
      "Mix flour, yeast, sugar, salt, water and oil. Knead 8 minutes and leave covered to double, about 1 hour.",
      "Shape 12 rolls into a ring on a lined tray. Prove 30 minutes. Bake at 200°C for 20–25 minutes. Brush with melted butter, crushed garlic and parsley."
    ],
    "photo": "./recipe-images/bread-wreath.jpg",
    "tags": [
      "baking",
      "pull-apart",
      "bread",
      "wreath"
    ]
  },
  {
    "id": "dish-breakfast-burrito",
    "name": "Egg and bean breakfast burritos",
    "type": "Breakfast",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Egg and bean breakfast burritos — ingredients and step-by-step method.",
    "ingredients": [
      "4 large tortillas",
      "6 eggs",
      "400 g canned black beans, drained",
      "1 red capsicum, diced",
      "100 g grated cheese",
      "100 g salsa",
      "1 tbsp oil"
    ],
    "steps": [
      "Cook capsicum in oil until soft, add beans and warm through.",
      "Scramble eggs in a separate pan. Fill tortillas with eggs, beans, cheese and salsa, then roll and toast seam-side down."
    ],
    "photo": "./recipe-images/breakfast-burrito.jpg",
    "tags": [
      "breakfast",
      "egg",
      "and",
      "bean",
      "breakfast",
      "burritos"
    ]
  },
  {
    "id": "dish-breakfast-sandwich",
    "name": "Bacon and egg breakfast sandwiches",
    "type": "Breakfast",
    "time": "20 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Bacon and egg breakfast sandwiches — ingredients and step-by-step method.",
    "ingredients": [
      "4 bread rolls",
      "4 eggs",
      "8 bacon rashers",
      "4 cheese slices",
      "1 tomato, sliced",
      "4 tbsp tomato relish"
    ],
    "steps": [
      "Cook bacon until browned. Fry eggs to your preference.",
      "Split and toast rolls, then layer with relish, bacon, egg, cheese and tomato."
    ],
    "photo": "./recipe-images/breakfast-sandwich.jpg",
    "tags": [
      "breakfast",
      "bacon",
      "and",
      "egg",
      "breakfast",
      "sandwiches"
    ]
  },
  {
    "id": "dish-brownies",
    "name": "Chocolate brownies",
    "type": "Baking",
    "time": "40 min",
    "serves": 16,
    "icon": "🍽️",
    "detail": "Chocolate brownies — ingredients and step-by-step method.",
    "ingredients": [
      "150 g butter",
      "200 g dark chocolate",
      "180 g caster sugar",
      "3 eggs",
      "90 g plain flour",
      "30 g cocoa",
      "Pinch salt"
    ],
    "steps": [
      "Heat oven to 175°C and line a 20 cm square tin. Melt butter and chocolate, then cool slightly.",
      "Whisk in sugar and eggs. Fold in flour, cocoa and salt. Bake 22–28 minutes until edges are set and centre still slightly soft. Cool before cutting."
    ],
    "photo": "./recipe-images/brownies.jpg",
    "tags": [
      "baking",
      "chocolate",
      "brownies"
    ]
  },
  {
    "id": "dish-bruschetta",
    "name": "Tomato and basil bruschetta",
    "type": "Snacks",
    "time": "15 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Tomato and basil bruschetta — ingredients and step-by-step method.",
    "ingredients": [
      "8 baguette slices",
      "4 ripe tomatoes, diced",
      "1 garlic clove",
      "2 tbsp olive oil",
      "1 tbsp balsamic vinegar",
      "10 basil leaves",
      "Salt and pepper"
    ],
    "steps": [
      "Toast bread and rub lightly with cut garlic.",
      "Mix tomatoes, oil, vinegar, torn basil and seasoning. Spoon onto toast immediately before serving."
    ],
    "photo": "./recipe-images/bruschetta.jpg",
    "tags": [
      "snacks",
      "tomato",
      "and",
      "basil",
      "bruschetta"
    ]
  },
  {
    "id": "dish-brussels",
    "name": "Roasted Brussels sprouts",
    "type": "Sides",
    "time": "35 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Roasted Brussels sprouts — ingredients and step-by-step method.",
    "ingredients": [
      "750 g Brussels sprouts",
      "2 tbsp olive oil",
      "2 tbsp balsamic vinegar",
      "1 tbsp honey",
      "40 g toasted walnuts",
      "Salt and pepper"
    ],
    "steps": [
      "Heat oven to 210°C. Trim and halve sprouts, toss with oil and seasoning, and spread on a tray.",
      "Roast 25–30 minutes, turning once. Toss with balsamic and honey and scatter with walnuts."
    ],
    "photo": "./recipe-images/brussels.jpg",
    "tags": [
      "sides",
      "roasted",
      "brussels",
      "sprouts"
    ]
  },
  {
    "id": "dish-butter-chicken",
    "name": "Butter chicken",
    "type": "Mains",
    "time": "50 min + marinating",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Butter chicken — ingredients and step-by-step method.",
    "ingredients": [
      "700 g chicken thigh, diced",
      "150 g plain yoghurt",
      "2 tbsp garam masala",
      "1 tsp turmeric",
      "2 garlic cloves",
      "2 tsp grated ginger",
      "40 g butter",
      "400 g tomato passata",
      "150 ml cream",
      "Cooked rice to serve"
    ],
    "steps": [
      "Mix chicken with yoghurt, half the garam masala, turmeric, garlic and ginger. Refrigerate for 30 minutes.",
      "Melt butter and cook chicken in batches until browned. Add passata and remaining spice, simmer 20 minutes until chicken is cooked through. Stir in cream and serve with rice."
    ],
    "photo": "./recipe-images/butter-chicken.jpg",
    "tags": [
      "mains",
      "butter",
      "chicken"
    ]
  },
  {
    "id": "dish-caprese",
    "name": "Tomato and mozzarella caprese",
    "type": "Sides",
    "time": "15 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Tomato and mozzarella caprese — ingredients and step-by-step method.",
    "ingredients": [
      "4 tomatoes",
      "250 g fresh mozzarella",
      "20 basil leaves",
      "2 tbsp olive oil",
      "1 tbsp balsamic glaze",
      "Salt and pepper"
    ],
    "steps": [
      "Slice tomatoes and mozzarella and arrange alternately on a platter.",
      "Add basil, season and drizzle with olive oil and balsamic glaze."
    ],
    "photo": "./recipe-images/caprese.jpg",
    "tags": [
      "sides",
      "tomato",
      "and",
      "mozzarella",
      "caprese"
    ]
  },
  {
    "id": "dish-carbonara",
    "name": "Spaghetti carbonara",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Spaghetti carbonara — ingredients and step-by-step method.",
    "ingredients": [
      "400 g spaghetti",
      "150 g pancetta",
      "3 eggs",
      "80 g finely grated parmesan",
      "1 tsp black pepper",
      "Salt for pasta water"
    ],
    "steps": [
      "Cook spaghetti in salted water, reserving a mug of cooking water. Fry pancetta until golden.",
      "Whisk eggs, parmesan and pepper. Take pan off heat, add drained pasta and egg mixture, tossing quickly with a little pasta water to make a glossy sauce. Serve immediately."
    ],
    "photo": "./recipe-images/carbonara.jpg",
    "tags": [
      "mains",
      "spaghetti",
      "carbonara"
    ]
  },
  {
    "id": "dish-carrots",
    "name": "Honey-roasted carrots",
    "type": "Sides",
    "time": "40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Honey-roasted carrots — ingredients and step-by-step method.",
    "ingredients": [
      "800 g carrots",
      "2 tbsp olive oil",
      "2 tbsp honey",
      "1 tbsp thyme leaves",
      "Salt and pepper"
    ],
    "steps": [
      "Heat oven to 200°C. Peel and halve carrots lengthways, then toss with oil, honey, thyme and seasoning.",
      "Roast 30–35 minutes, turning once, until tender and golden."
    ],
    "photo": "./recipe-images/carrots.jpg",
    "tags": [
      "sides",
      "honey-roasted",
      "carrots"
    ]
  },
  {
    "id": "dish-cauliflower",
    "name": "Cauliflower cheese bake",
    "type": "Sides",
    "time": "45 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Cauliflower cheese bake — ingredients and step-by-step method.",
    "ingredients": [
      "1 cauliflower",
      "40 g butter",
      "40 g plain flour",
      "500 ml milk",
      "150 g grated cheddar",
      "1 tsp Dijon mustard",
      "40 g breadcrumbs"
    ],
    "steps": [
      "Heat oven to 200°C. Cut cauliflower into florets and steam 6–8 minutes.",
      "Melt butter, stir in flour for 1 minute, then gradually whisk in milk. Simmer until thick and add cheese and mustard. Pour over cauliflower in a baking dish, add crumbs and bake 20–25 minutes."
    ],
    "photo": "./recipe-images/cauliflower.jpg",
    "tags": [
      "sides",
      "cauliflower",
      "cheese",
      "bake"
    ]
  },
  {
    "id": "dish-cheese-board",
    "name": "Christmas cheese board",
    "type": "Snacks",
    "time": "20 min",
    "serves": 8,
    "icon": "🍽️",
    "detail": "Christmas cheese board — ingredients and step-by-step method.",
    "ingredients": [
      "150 g brie",
      "150 g cheddar",
      "150 g blue cheese",
      "150 g crackers",
      "100 g quince paste",
      "200 g grapes",
      "80 g nuts"
    ],
    "steps": [
      "Cut firm cheeses into easy-to-serve pieces.",
      "Arrange cheeses, crackers, quince paste, grapes and nuts on a board. Keep cheese refrigerated until shortly before serving."
    ],
    "photo": "./recipe-images/cheese-board.jpg",
    "tags": [
      "snacks",
      "christmas",
      "cheese",
      "board"
    ]
  },
  {
    "id": "dish-cheesecake",
    "name": "Berry cheesecake",
    "type": "Desserts",
    "time": "35 min + chilling",
    "serves": 10,
    "icon": "🍽️",
    "detail": "Berry cheesecake — ingredients and step-by-step method.",
    "ingredients": [
      "250 g digestive biscuits",
      "100 g melted butter",
      "500 g cream cheese",
      "100 g icing sugar",
      "1 tsp vanilla",
      "300 ml cream",
      "250 g fresh berries"
    ],
    "steps": [
      "Crush biscuits and mix with butter. Press into a lined 20 cm springform tin and chill.",
      "Beat cream cheese, sugar and vanilla until smooth. Whip cream to soft peaks and fold in. Spread over base and chill at least 6 hours. Top with berries."
    ],
    "photo": "./recipe-images/cheesecake.jpg",
    "tags": [
      "desserts",
      "berry",
      "cheesecake"
    ]
  },
  {
    "id": "dish-chia-pudding",
    "name": "Mango and berry chia pudding",
    "type": "Breakfast",
    "time": "10 min + chilling",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Mango and berry chia pudding — ingredients and step-by-step method.",
    "ingredients": [
      "80 g chia seeds",
      "500 ml milk",
      "2 tbsp maple syrup",
      "1 tsp vanilla",
      "1 mango, diced",
      "150 g berries"
    ],
    "steps": [
      "Whisk chia, milk, maple syrup and vanilla. Stand 10 minutes and whisk again.",
      "Divide into four jars and refrigerate overnight. Top with mango and berries."
    ],
    "photo": "./recipe-images/chia-pudding.jpg",
    "tags": [
      "breakfast",
      "mango",
      "and",
      "berry",
      "chia",
      "pudding"
    ]
  },
  {
    "id": "dish-crumpets",
    "name": "Homemade crumpets",
    "type": "Breakfast",
    "time": "1 hr 30 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Homemade crumpets — ingredients and step-by-step method.",
    "ingredients": [
      "250 g plain flour",
      "7 g instant yeast",
      "250 ml warm milk",
      "100 ml warm water",
      "1 tsp sugar",
      "1/2 tsp salt",
      "1/2 tsp bicarbonate of soda",
      "Butter for pan"
    ],
    "steps": [
      "Mix flour, yeast, milk, water, sugar and salt. Cover for 45–60 minutes until bubbly, then stir in bicarbonate.",
      "Grease rings and a pan, heat gently and pour in batter to 1 cm depth. Cook 6–8 minutes until holes form and tops set, remove rings, turn briefly and serve toasted with butter."
    ],
    "photo": "./recipe-images/crumpets.jpg",
    "tags": [
      "breakfast",
      "homemade",
      "crumpets"
    ]
  },
  {
    "id": "dish-curry",
    "name": "Chicken curry with rice",
    "type": "Mains",
    "time": "40 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken curry with rice — ingredients and step-by-step method.",
    "ingredients": [
      "700 g diced chicken thigh",
      "1 onion",
      "2 tbsp curry powder",
      "400 g canned tomatoes",
      "400 ml coconut milk",
      "2 tbsp oil",
      "200 g spinach",
      "Cooked rice to serve"
    ],
    "steps": [
      "Soften chopped onion in oil, add curry powder for 1 minute, then brown chicken.",
      "Add tomatoes and coconut milk and simmer 20–25 minutes until chicken is cooked through. Stir in spinach to wilt and serve with rice."
    ],
    "photo": "./recipe-images/curry.jpg",
    "tags": [
      "mains",
      "chicken",
      "curry",
      "with",
      "rice"
    ]
  },
  {
    "id": "dish-dips",
    "name": "Festive dip platter",
    "type": "Snacks",
    "time": "20 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Festive dip platter — ingredients and step-by-step method.",
    "ingredients": [
      "200 g hummus",
      "200 g tzatziki",
      "150 g beetroot dip",
      "2 carrots",
      "1 cucumber",
      "1 red capsicum",
      "150 g pita bread"
    ],
    "steps": [
      "Put dips into small serving bowls.",
      "Cut vegetables into sticks and pita into wedges. Arrange around the dips and keep chilled until serving."
    ],
    "photo": "./recipe-images/dips.jpg",
    "tags": [
      "snacks",
      "festive",
      "dip",
      "platter"
    ]
  },
  {
    "id": "dish-eggs-benedict",
    "name": "Eggs Benedict",
    "type": "Breakfast",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Eggs Benedict — ingredients and step-by-step method.",
    "ingredients": [
      "4 English muffins",
      "8 eggs",
      "8 bacon rashers",
      "3 egg yolks",
      "120 g melted butter",
      "1 tbsp lemon juice",
      "1 tsp white vinegar"
    ],
    "steps": [
      "Cook bacon and toast split muffins. Poach the 8 whole eggs in gently simmering water with vinegar.",
      "Whisk yolks and lemon over a bowl set above simmering water, gradually adding butter until thick. Keep the sauce warm, then layer muffins with bacon, poached eggs and sauce. Serve immediately."
    ],
    "photo": "./recipe-images/eggs-benedict.jpg",
    "tags": [
      "breakfast",
      "eggs",
      "benedict"
    ]
  },
  {
    "id": "dish-enchiladas",
    "name": "Chicken enchiladas",
    "type": "Mains",
    "time": "45 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken enchiladas — ingredients and step-by-step method.",
    "ingredients": [
      "8 tortillas",
      "500 g cooked shredded chicken",
      "400 g canned black beans, drained",
      "500 ml enchilada sauce",
      "150 g grated cheese",
      "1 onion, diced",
      "1 tbsp oil"
    ],
    "steps": [
      "Heat oven to 190°C. Soften onion in oil, mix with chicken, beans and 150 ml sauce.",
      "Fill and roll tortillas in a baking dish. Pour remaining sauce over, add cheese and bake 25 minutes until hot and bubbling."
    ],
    "photo": "./recipe-images/enchiladas.jpg",
    "tags": [
      "mains",
      "chicken",
      "enchiladas"
    ]
  },
  {
    "id": "dish-frittata",
    "name": "Vegetable frittata",
    "type": "Breakfast",
    "time": "35 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Vegetable frittata — ingredients and step-by-step method.",
    "ingredients": [
      "8 eggs",
      "80 ml milk",
      "1 zucchini",
      "1 red capsicum",
      "100 g spinach",
      "100 g feta",
      "1 tbsp olive oil"
    ],
    "steps": [
      "Heat oven to 190°C. Slice zucchini and capsicum and cook in oil in an ovenproof pan until soft. Add spinach to wilt.",
      "Beat eggs with milk and seasoning, pour over vegetables and scatter with feta. Bake 15–20 minutes until set."
    ],
    "photo": "./recipe-images/frittata.jpg",
    "tags": [
      "breakfast",
      "vegetable",
      "frittata"
    ]
  },
  {
    "id": "dish-fritters",
    "name": "Zucchini and corn fritters",
    "type": "Snacks",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Zucchini and corn fritters — ingredients and step-by-step method.",
    "ingredients": [
      "2 zucchini, grated",
      "200 g corn kernels",
      "2 eggs",
      "100 g self-raising flour",
      "60 g feta",
      "2 spring onions",
      "3 tbsp oil"
    ],
    "steps": [
      "Squeeze moisture from zucchini and mix with corn, eggs, flour, crumbled feta and sliced spring onions.",
      "Pan-fry spoonfuls in oil over medium heat for 3–4 minutes each side until golden and cooked through."
    ],
    "photo": "./recipe-images/fritters.jpg",
    "tags": [
      "snacks",
      "zucchini",
      "and",
      "corn",
      "fritters"
    ]
  },
  {
    "id": "dish-fruit-salad",
    "name": "Fresh summer fruit salad",
    "type": "Desserts",
    "time": "20 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Fresh summer fruit salad — ingredients and step-by-step method.",
    "ingredients": [
      "1/2 pineapple",
      "1 mango",
      "2 kiwifruit",
      "250 g strawberries",
      "200 g grapes",
      "1 tbsp lime juice",
      "1 tbsp honey"
    ],
    "steps": [
      "Peel and cut fruit into bite-sized pieces.",
      "Whisk lime juice with honey, toss gently through fruit and chill until serving."
    ],
    "photo": "./recipe-images/fruit-salad.jpg",
    "tags": [
      "desserts",
      "fresh",
      "summer",
      "fruit",
      "salad"
    ]
  },
  {
    "id": "dish-garlic-bread",
    "name": "Cheesy garlic bread",
    "type": "Sides",
    "time": "20 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Cheesy garlic bread — ingredients and step-by-step method.",
    "ingredients": [
      "1 baguette",
      "80 g softened butter",
      "3 garlic cloves",
      "2 tbsp parsley",
      "100 g grated mozzarella"
    ],
    "steps": [
      "Heat oven to 190°C. Mix butter, crushed garlic and parsley. Slice baguette without cutting fully through.",
      "Spread garlic butter into cuts and add cheese. Wrap in foil and bake 12 minutes, then uncover for 5 minutes."
    ],
    "photo": "./recipe-images/garlic-bread.jpg",
    "tags": [
      "sides",
      "cheesy",
      "garlic",
      "bread"
    ]
  },
  {
    "id": "dish-gnocchi",
    "name": "Gnocchi with tomato and basil",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Gnocchi with tomato and basil — ingredients and step-by-step method.",
    "ingredients": [
      "500 g gnocchi",
      "400 g canned tomatoes",
      "2 garlic cloves",
      "2 tbsp olive oil",
      "1 tsp sugar",
      "20 basil leaves",
      "50 g parmesan"
    ],
    "steps": [
      "Cook crushed garlic in oil for 30 seconds. Add tomatoes and sugar and simmer 15 minutes.",
      "Boil gnocchi until they float, drain and toss with sauce and basil. Serve with parmesan."
    ],
    "photo": "./recipe-images/gnocchi.jpg",
    "tags": [
      "mains",
      "gnocchi",
      "with",
      "tomato",
      "and",
      "basil"
    ]
  },
  {
    "id": "dish-granola",
    "name": "Toasted nut granola",
    "type": "Breakfast",
    "time": "35 min",
    "serves": 10,
    "icon": "🍽️",
    "detail": "Toasted nut granola — ingredients and step-by-step method.",
    "ingredients": [
      "300 g rolled oats",
      "100 g mixed nuts",
      "60 g pumpkin seeds",
      "80 ml maple syrup",
      "60 ml oil",
      "1 tsp cinnamon",
      "100 g dried cranberries"
    ],
    "steps": [
      "Heat oven to 160°C. Mix oats, nuts and seeds with maple syrup, oil and cinnamon.",
      "Spread on a lined tray and bake 25 minutes, stirring twice. Cool fully, then add cranberries. Store airtight."
    ],
    "photo": "./recipe-images/granola.jpg",
    "tags": [
      "breakfast",
      "toasted",
      "nut",
      "granola"
    ]
  },
  {
    "id": "dish-gravy",
    "name": "Rich roast gravy",
    "type": "Sides",
    "time": "15 min",
    "serves": 8,
    "icon": "🍽️",
    "detail": "Rich roast gravy — ingredients and step-by-step method.",
    "ingredients": [
      "3 tbsp roast pan juices or butter",
      "3 tbsp plain flour",
      "600 ml beef or chicken stock",
      "1 tsp Worcestershire sauce",
      "Pepper"
    ],
    "steps": [
      "Heat pan juices in a saucepan, add flour and stir for 2 minutes.",
      "Gradually whisk in stock and simmer 8–10 minutes until thick. Add Worcestershire sauce and season to taste."
    ],
    "photo": "./recipe-images/gravy.jpg",
    "tags": [
      "sides",
      "rich",
      "roast",
      "gravy"
    ]
  },
  {
    "id": "dish-grilled-tomatoes",
    "name": "Herb-grilled tomatoes",
    "type": "Breakfast",
    "time": "15 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Herb-grilled tomatoes — ingredients and step-by-step method.",
    "ingredients": [
      "4 large tomatoes",
      "2 tbsp olive oil",
      "1 tsp dried oregano",
      "1 garlic clove",
      "Salt and pepper"
    ],
    "steps": [
      "Halve tomatoes and brush with oil mixed with crushed garlic and oregano.",
      "Grill cut-side up under medium-high heat for 8–10 minutes until soft and lightly browned. Season before serving."
    ],
    "photo": "./recipe-images/grilled-tomatoes.jpg",
    "tags": [
      "breakfast",
      "herb-grilled",
      "tomatoes"
    ]
  },
  {
    "id": "dish-hash-browns",
    "name": "Crispy potato hash browns",
    "type": "Breakfast",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Crispy potato hash browns — ingredients and step-by-step method.",
    "ingredients": [
      "600 g potatoes",
      "1 small onion",
      "1 tbsp plain flour",
      "1/2 tsp salt",
      "3 tbsp oil"
    ],
    "steps": [
      "Grate potatoes and onion, rinse briefly and squeeze very dry. Mix with flour and salt.",
      "Shape thin patties and fry in oil over medium heat for 5–6 minutes each side until crisp, golden and tender inside."
    ],
    "photo": "./recipe-images/hash-browns.jpg",
    "tags": [
      "breakfast",
      "crispy",
      "potato",
      "hash",
      "browns"
    ]
  },
  {
    "id": "dish-hollandaise-sauce",
    "name": "Hollandaise sauce",
    "type": "Sides",
    "time": "15 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Hollandaise sauce — ingredients and step-by-step method.",
    "ingredients": [
      "3 egg yolks",
      "120 g butter",
      "1 tbsp lemon juice",
      "1 tbsp water",
      "Pinch salt"
    ],
    "steps": [
      "Melt butter. Whisk yolks, lemon and water in a heatproof bowl over gently simmering water, without the bowl touching it.",
      "Slowly whisk in butter until sauce thickens. Season and serve immediately."
    ],
    "photo": "./recipe-images/hollandaise-sauce.jpg",
    "tags": [
      "sides",
      "hollandaise",
      "sauce"
    ]
  },
  {
    "id": "dish-lasagne",
    "name": "Classic beef lasagne",
    "type": "Mains",
    "time": "1 hr 25 min",
    "serves": 8,
    "icon": "🍽️",
    "detail": "Classic beef lasagne — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef mince",
      "1 onion",
      "2 garlic cloves",
      "700 ml tomato passata",
      "1 tsp oregano",
      "250 g lasagne sheets",
      "60 g butter",
      "60 g flour",
      "750 ml milk",
      "150 g grated cheese",
      "1 tbsp oil"
    ],
    "steps": [
      "Soften chopped onion and garlic in oil, brown mince, add passata and oregano and simmer 20 minutes.",
      "Melt butter, stir in flour, then gradually add milk and cook until thick. Layer meat sauce, sheets and white sauce in a dish, finishing with sauce and cheese. Bake at 180°C for 40–45 minutes, then rest 10 minutes."
    ],
    "photo": "./recipe-images/lasagne.jpg",
    "tags": [
      "mains",
      "classic",
      "beef",
      "lasagne"
    ]
  },
  {
    "id": "dish-mac-and-cheese",
    "name": "Baked macaroni and cheese",
    "type": "Mains",
    "time": "40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Baked macaroni and cheese — ingredients and step-by-step method.",
    "ingredients": [
      "350 g macaroni",
      "40 g butter",
      "40 g plain flour",
      "600 ml milk",
      "250 g grated cheddar",
      "1 tsp mustard",
      "50 g breadcrumbs"
    ],
    "steps": [
      "Cook macaroni until just tender. Heat oven to 200°C.",
      "Make a sauce by melting butter, stirring in flour then whisking in milk. Simmer until thick, add cheese and mustard, mix with pasta, top with crumbs and bake 15–20 minutes."
    ],
    "photo": "./recipe-images/mac-and-cheese.jpg",
    "tags": [
      "mains",
      "baked",
      "macaroni",
      "and",
      "cheese"
    ]
  },
  {
    "id": "dish-meatballs",
    "name": "Beef meatballs in tomato sauce",
    "type": "Mains",
    "time": "40 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Beef meatballs in tomato sauce — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef mince",
      "1 egg",
      "60 g breadcrumbs",
      "2 garlic cloves",
      "1 tsp oregano",
      "700 ml passata",
      "1 tbsp olive oil",
      "50 g parmesan"
    ],
    "steps": [
      "Mix mince, egg, crumbs, half the garlic, oregano and seasoning. Shape 20 meatballs.",
      "Brown in oil, add remaining garlic and passata, and simmer 20 minutes until meatballs are cooked through. Top with parmesan."
    ],
    "photo": "./recipe-images/meatballs.jpg",
    "tags": [
      "mains",
      "beef",
      "meatballs",
      "in",
      "tomato",
      "sauce"
    ]
  },
  {
    "id": "dish-mince-pies",
    "name": "Christmas fruit mince pies",
    "type": "Baking",
    "time": "40 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Christmas fruit mince pies — ingredients and step-by-step method.",
    "ingredients": [
      "2 sheets shortcrust pastry",
      "400 g fruit mince",
      "1 beaten egg",
      "1 tbsp icing sugar"
    ],
    "steps": [
      "Heat oven to 190°C. Cut pastry circles to line 12 greased muffin wells.",
      "Fill with fruit mince, cover with pastry stars or lids and brush with egg. Bake 20–25 minutes. Cool and dust with icing sugar."
    ],
    "photo": "./recipe-images/mince-pies.jpg",
    "tags": [
      "baking",
      "christmas",
      "fruit",
      "mince",
      "pies"
    ]
  },
  {
    "id": "dish-mini-quiches",
    "name": "Mini cheese and bacon quiches",
    "type": "Snacks",
    "time": "35 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Mini cheese and bacon quiches — ingredients and step-by-step method.",
    "ingredients": [
      "2 sheets shortcrust pastry",
      "4 eggs",
      "150 ml cream",
      "100 g cooked bacon",
      "100 g grated cheese",
      "2 spring onions"
    ],
    "steps": [
      "Heat oven to 190°C. Line 12 greased muffin wells with pastry circles.",
      "Whisk eggs and cream and stir in chopped bacon, cheese and sliced onions. Fill pastry cases and bake 20–25 minutes until set."
    ],
    "photo": "./recipe-images/mini-quiches.jpg",
    "tags": [
      "snacks",
      "mini",
      "cheese",
      "and",
      "bacon",
      "quiches"
    ]
  },
  {
    "id": "dish-mousse",
    "name": "Chocolate mousse cups",
    "type": "Desserts",
    "time": "20 min + chilling",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Chocolate mousse cups — ingredients and step-by-step method.",
    "ingredients": [
      "200 g dark chocolate",
      "400 ml thickened cream",
      "2 tbsp icing sugar",
      "1 tsp vanilla"
    ],
    "steps": [
      "Melt chocolate gently and cool until barely warm. Whip cream with sugar and vanilla to soft peaks.",
      "Fold a third of cream into chocolate, then gently fold in the remainder. Divide into cups and chill at least 3 hours."
    ],
    "photo": "./recipe-images/mousse.jpg",
    "tags": [
      "desserts",
      "chocolate",
      "mousse",
      "cups"
    ]
  },
  {
    "id": "dish-muesli",
    "name": "Fruit and nut muesli",
    "type": "Breakfast",
    "time": "10 min",
    "serves": 8,
    "icon": "🍽️",
    "detail": "Fruit and nut muesli — ingredients and step-by-step method.",
    "ingredients": [
      "300 g rolled oats",
      "80 g almonds",
      "60 g pumpkin seeds",
      "100 g dried fruit",
      "40 g coconut flakes",
      "Milk or yoghurt to serve"
    ],
    "steps": [
      "Chop almonds and dried fruit.",
      "Mix with oats, seeds and coconut. Store airtight and serve with milk or yoghurt."
    ],
    "photo": "./recipe-images/muesli.jpg",
    "tags": [
      "breakfast",
      "fruit",
      "and",
      "nut",
      "muesli"
    ]
  },
  {
    "id": "dish-muffins",
    "name": "Blueberry muffins",
    "type": "Baking",
    "time": "35 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Blueberry muffins — ingredients and step-by-step method.",
    "ingredients": [
      "300 g self-raising flour",
      "120 g caster sugar",
      "2 eggs",
      "180 ml milk",
      "100 ml oil",
      "1 tsp vanilla",
      "200 g blueberries"
    ],
    "steps": [
      "Heat oven to 180°C and line a muffin tin. Combine flour and sugar in one bowl and eggs, milk, oil and vanilla in another.",
      "Fold wet ingredients into dry, then add berries. Divide into 12 cases and bake 20–25 minutes."
    ],
    "photo": "./recipe-images/muffins.jpg",
    "tags": [
      "baking",
      "blueberry",
      "muffins"
    ]
  },
  {
    "id": "dish-mushrooms",
    "name": "Garlic roasted mushrooms",
    "type": "Sides",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Garlic roasted mushrooms — ingredients and step-by-step method.",
    "ingredients": [
      "500 g mushrooms",
      "40 g butter",
      "3 garlic cloves",
      "2 tbsp parsley",
      "Salt and pepper"
    ],
    "steps": [
      "Heat oven to 210°C. Toss mushrooms with melted butter, crushed garlic and seasoning.",
      "Roast 15–20 minutes and scatter with parsley before serving."
    ],
    "photo": "./recipe-images/mushrooms.jpg",
    "tags": [
      "sides",
      "garlic",
      "roasted",
      "mushrooms"
    ]
  },
  {
    "id": "dish-nachos",
    "name": "Loaded beef nachos",
    "type": "Mains",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Loaded beef nachos — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef mince",
      "1 tbsp oil",
      "2 tbsp taco seasoning",
      "400 g canned kidney beans",
      "300 g corn chips",
      "150 g grated cheese",
      "150 g salsa",
      "1 avocado",
      "100 g sour cream"
    ],
    "steps": [
      "Brown mince in oil, add seasoning, drained beans and 100 ml water, then simmer 10 minutes.",
      "Arrange chips and beef in a baking dish, add cheese and bake at 200°C for 10 minutes. Top with salsa, diced avocado and sour cream."
    ],
    "photo": "./recipe-images/nachos.jpg",
    "tags": [
      "mains",
      "loaded",
      "beef",
      "nachos"
    ]
  },
  {
    "id": "dish-noodles",
    "name": "Chicken stir-fry noodles",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken stir-fry noodles — ingredients and step-by-step method.",
    "ingredients": [
      "500 g chicken breast strips",
      "300 g egg noodles",
      "1 carrot",
      "1 capsicum",
      "200 g broccoli",
      "3 tbsp soy sauce",
      "2 tbsp oyster sauce",
      "1 tbsp oil"
    ],
    "steps": [
      "Cook noodles according to packet. Thinly slice vegetables.",
      "Stir-fry chicken in oil until cooked through, add vegetables for 4 minutes, then noodles and sauces. Toss until hot."
    ],
    "photo": "./recipe-images/noodles.jpg",
    "tags": [
      "mains",
      "chicken",
      "stir-fry",
      "noodles"
    ]
  },
  {
    "id": "dish-omelette",
    "name": "Cheese and herb omelette",
    "type": "Breakfast",
    "time": "15 min",
    "serves": 2,
    "icon": "🍽️",
    "detail": "Cheese and herb omelette — ingredients and step-by-step method.",
    "ingredients": [
      "4 eggs",
      "2 tbsp milk",
      "40 g grated cheese",
      "1 tbsp chopped chives",
      "20 g butter",
      "Salt and pepper"
    ],
    "steps": [
      "Beat eggs with milk, chives and seasoning. Melt half the butter in a nonstick pan.",
      "Pour in half the egg mixture and gently pull edges inward until almost set. Add half the cheese and fold. Repeat for the second omelette."
    ],
    "photo": "./recipe-images/omelette.jpg",
    "tags": [
      "breakfast",
      "cheese",
      "and",
      "herb",
      "omelette"
    ]
  },
  {
    "id": "dish-oysters",
    "name": "Fresh oysters with lemon",
    "type": "Snacks",
    "time": "15 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Fresh oysters with lemon — ingredients and step-by-step method.",
    "ingredients": [
      "24 freshly shucked oysters from a reputable supplier",
      "2 lemons",
      "Crushed ice",
      "2 tbsp finely diced shallot",
      "3 tbsp red wine vinegar"
    ],
    "steps": [
      "Keep oysters cold and arrange on crushed ice.",
      "Cut lemons into wedges. Mix shallot and vinegar for a dressing and serve alongside. Discard oysters that smell unpleasant and serve promptly."
    ],
    "photo": "./recipe-images/oysters.jpg",
    "tags": [
      "snacks",
      "fresh",
      "oysters",
      "with",
      "lemon"
    ]
  },
  {
    "id": "dish-pesto-pasta",
    "name": "Basil pesto pasta",
    "type": "Mains",
    "time": "20 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Basil pesto pasta — ingredients and step-by-step method.",
    "ingredients": [
      "400 g penne",
      "100 g basil pesto",
      "150 g cherry tomatoes",
      "50 g parmesan",
      "2 tbsp toasted pine nuts"
    ],
    "steps": [
      "Cook pasta, reserving 100 ml cooking water.",
      "Toss drained pasta with pesto, halved tomatoes and enough cooking water to loosen. Top with parmesan and pine nuts."
    ],
    "photo": "./recipe-images/pesto-pasta.jpg",
    "tags": [
      "mains",
      "basil",
      "pesto",
      "pasta"
    ]
  },
  {
    "id": "dish-pasta",
    "name": "Tomato penne pasta",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Tomato penne pasta — ingredients and step-by-step method.",
    "ingredients": [
      "400 g penne",
      "700 ml passata",
      "2 garlic cloves",
      "2 tbsp olive oil",
      "1 tsp oregano",
      "10 basil leaves",
      "50 g parmesan"
    ],
    "steps": [
      "Cook pasta in salted boiling water. Gently cook crushed garlic in oil for 30 seconds.",
      "Add passata and oregano, simmer 15 minutes and season. Toss with pasta and basil, then top with parmesan."
    ],
    "photo": "./recipe-images/pasta.jpg",
    "tags": [
      "mains",
      "tomato",
      "penne",
      "pasta"
    ]
  },
  {
    "id": "dish-pizza",
    "name": "Pepperoni pizza",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Pepperoni pizza — ingredients and step-by-step method.",
    "ingredients": [
      "2 large pizza bases",
      "150 ml pizza sauce",
      "200 g mozzarella",
      "100 g pepperoni",
      "1 capsicum",
      "1 tsp oregano"
    ],
    "steps": [
      "Heat oven to 220°C. Spread bases with sauce.",
      "Add cheese, pepperoni, sliced capsicum and oregano. Bake 12–15 minutes until crust is crisp and cheese bubbles."
    ],
    "photo": "./recipe-images/pizza.jpg",
    "tags": [
      "mains",
      "pepperoni",
      "pizza"
    ]
  },
  {
    "id": "dish-porridge",
    "name": "Berry breakfast porridge",
    "type": "Breakfast",
    "time": "15 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Berry breakfast porridge — ingredients and step-by-step method.",
    "ingredients": [
      "160 g rolled oats",
      "600 ml milk",
      "200 ml water",
      "2 tbsp honey",
      "200 g berries"
    ],
    "steps": [
      "Simmer oats with milk and water for 8–10 minutes, stirring until creamy.",
      "Divide into bowls and top with honey and berries."
    ],
    "photo": "./recipe-images/porridge.jpg",
    "tags": [
      "breakfast",
      "berry",
      "breakfast",
      "porridge"
    ]
  },
  {
    "id": "dish-ravioli",
    "name": "Spinach and ricotta ravioli",
    "type": "Mains",
    "time": "20 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Spinach and ricotta ravioli — ingredients and step-by-step method.",
    "ingredients": [
      "500 g spinach and ricotta ravioli",
      "60 g butter",
      "12 sage leaves",
      "50 g parmesan",
      "Salt and pepper"
    ],
    "steps": [
      "Cook ravioli according to packet.",
      "Melt butter in a frying pan and cook until lightly golden. Add sage to crisp, then toss through drained ravioli. Season and add parmesan."
    ],
    "photo": "./recipe-images/ravioli.jpg",
    "tags": [
      "mains",
      "spinach",
      "and",
      "ricotta",
      "ravioli"
    ]
  },
  {
    "id": "dish-risotto",
    "name": "Mushroom risotto",
    "type": "Mains",
    "time": "40 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Mushroom risotto — ingredients and step-by-step method.",
    "ingredients": [
      "300 g arborio rice",
      "300 g mushrooms",
      "1 onion",
      "1 L hot vegetable stock",
      "40 g butter",
      "60 g parmesan",
      "1 tbsp olive oil"
    ],
    "steps": [
      "Soften diced onion in oil and half the butter. Add sliced mushrooms and cook 5 minutes, then stir in rice.",
      "Add hot stock a ladle at a time, stirring until absorbed before adding more. Cook about 20 minutes until rice is tender. Stir in remaining butter and parmesan."
    ],
    "photo": "./recipe-images/risotto.jpg",
    "tags": [
      "mains",
      "mushroom",
      "risotto"
    ]
  },
  {
    "id": "dish-sausage-breakfast",
    "name": "Sausage and egg breakfast plate",
    "type": "Breakfast",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Sausage and egg breakfast plate — ingredients and step-by-step method.",
    "ingredients": [
      "8 breakfast sausages",
      "4 eggs",
      "4 tomatoes",
      "200 g mushrooms",
      "1 tbsp oil",
      "4 slices toast"
    ],
    "steps": [
      "Cook sausages thoroughly in a frying pan, turning often. Halve tomatoes and cook alongside sliced mushrooms.",
      "Fry eggs in a little oil and serve with sausages, vegetables and toast."
    ],
    "photo": "./recipe-images/sausage-breakfast.jpg",
    "tags": [
      "breakfast",
      "sausage",
      "and",
      "egg",
      "breakfast",
      "plate"
    ]
  },
  {
    "id": "dish-sausage-rolls",
    "name": "Homemade sausage rolls",
    "type": "Snacks",
    "time": "40 min",
    "serves": 24,
    "icon": "🍽️",
    "detail": "Homemade sausage rolls — ingredients and step-by-step method.",
    "ingredients": [
      "500 g sausage mince",
      "1 small onion, grated",
      "1 carrot, grated",
      "60 g breadcrumbs",
      "2 sheets puff pastry",
      "1 beaten egg"
    ],
    "steps": [
      "Heat oven to 200°C. Mix mince, onion, carrot and breadcrumbs.",
      "Cut pastry in half and place filling in a log along each piece. Roll, seal, cut into portions and brush with egg. Bake 25–30 minutes until golden and filling is cooked through."
    ],
    "photo": "./recipe-images/sausage-rolls.jpg",
    "tags": [
      "snacks",
      "homemade",
      "sausage",
      "rolls"
    ]
  },
  {
    "id": "dish-satay",
    "name": "Chicken satay skewers",
    "type": "Mains",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken satay skewers — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken thigh",
      "3 tbsp soy sauce",
      "1 tbsp honey",
      "100 g peanut butter",
      "200 ml coconut milk",
      "1 tbsp lime juice",
      "1 tsp curry powder"
    ],
    "steps": [
      "Cut chicken into strips and coat with 2 tbsp soy and honey. Thread onto soaked skewers.",
      "Simmer peanut butter, coconut milk, lime, curry powder and remaining soy for 5 minutes. Grill skewers 10–15 minutes, turning, until cooked through. Serve sauce separately."
    ],
    "photo": "./recipe-images/satay.jpg",
    "tags": [
      "mains",
      "chicken",
      "satay",
      "skewers"
    ]
  },
  {
    "id": "dish-scones",
    "name": "Classic cream-tea scones",
    "type": "Baking",
    "time": "30 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Classic cream-tea scones — ingredients and step-by-step method.",
    "ingredients": [
      "350 g self-raising flour",
      "40 g caster sugar",
      "80 g cold butter",
      "180 ml milk",
      "Jam and whipped cream to serve"
    ],
    "steps": [
      "Heat oven to 220°C. Rub butter into flour and sugar, then mix in milk to form a soft dough.",
      "Pat to 2 cm thick, cut rounds without twisting and place close together on a lined tray. Bake 12–15 minutes. Serve with jam and cream."
    ],
    "photo": "./recipe-images/scones.jpg",
    "tags": [
      "baking",
      "classic",
      "cream-tea",
      "scones"
    ]
  },
  {
    "id": "dish-shakshuka",
    "name": "Shakshuka with tomatoes and eggs",
    "type": "Breakfast",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Shakshuka with tomatoes and eggs — ingredients and step-by-step method.",
    "ingredients": [
      "6 eggs",
      "1 onion",
      "1 red capsicum",
      "2 garlic cloves",
      "800 g canned tomatoes",
      "1 tsp cumin",
      "1 tsp paprika",
      "2 tbsp oil"
    ],
    "steps": [
      "Soften diced onion and capsicum in oil. Add crushed garlic, cumin and paprika, then tomatoes and simmer 15 minutes.",
      "Make six wells, add eggs, cover and cook gently until whites are set. Serve with bread."
    ],
    "photo": "./recipe-images/shakshuka.jpg",
    "tags": [
      "breakfast",
      "shakshuka",
      "with",
      "tomatoes",
      "and",
      "eggs"
    ]
  },
  {
    "id": "dish-smoothie-bowl",
    "name": "Berry smoothie bowl",
    "type": "Breakfast",
    "time": "10 min",
    "serves": 2,
    "icon": "🍽️",
    "detail": "Berry smoothie bowl — ingredients and step-by-step method.",
    "ingredients": [
      "2 frozen bananas",
      "200 g frozen berries",
      "100 ml milk",
      "4 tbsp granola",
      "2 tbsp shredded coconut",
      "Fresh berries to top"
    ],
    "steps": [
      "Blend bananas, frozen berries and milk until thick.",
      "Spoon into bowls and top with granola, coconut and fresh berries."
    ],
    "photo": "./recipe-images/smoothie-bowl.jpg",
    "tags": [
      "breakfast",
      "berry",
      "smoothie",
      "bowl"
    ]
  },
  {
    "id": "dish-spaghetti-bolognese",
    "name": "Spaghetti bolognese",
    "type": "Mains",
    "time": "50 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Spaghetti bolognese — ingredients and step-by-step method.",
    "ingredients": [
      "400 g spaghetti",
      "500 g beef mince",
      "1 onion",
      "1 carrot",
      "2 garlic cloves",
      "700 ml passata",
      "2 tbsp tomato paste",
      "1 tsp oregano",
      "1 tbsp oil"
    ],
    "steps": [
      "Soften finely diced onion and carrot in oil, add garlic and mince and brown.",
      "Stir in tomato paste, passata and oregano and simmer 30 minutes. Cook spaghetti and serve with sauce."
    ],
    "photo": "./recipe-images/spaghetti-bolognese.jpg",
    "tags": [
      "mains",
      "spaghetti",
      "bolognese"
    ]
  },
  {
    "id": "dish-spinach",
    "name": "Creamy garlic spinach",
    "type": "Sides",
    "time": "20 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Creamy garlic spinach — ingredients and step-by-step method.",
    "ingredients": [
      "500 g spinach",
      "20 g butter",
      "2 garlic cloves",
      "100 ml cream",
      "30 g parmesan",
      "Pinch nutmeg"
    ],
    "steps": [
      "Melt butter and soften crushed garlic for 30 seconds.",
      "Add spinach in batches to wilt. Add cream and simmer 3 minutes. Stir in parmesan and nutmeg and season."
    ],
    "photo": "./recipe-images/spinach.jpg",
    "tags": [
      "sides",
      "creamy",
      "garlic",
      "spinach"
    ]
  },
  {
    "id": "dish-spring-rolls",
    "name": "Vegetable spring rolls",
    "type": "Snacks",
    "time": "40 min",
    "serves": 20,
    "icon": "🍽️",
    "detail": "Vegetable spring rolls — ingredients and step-by-step method.",
    "ingredients": [
      "20 spring roll wrappers",
      "300 g shredded cabbage",
      "1 grated carrot",
      "100 g bean sprouts",
      "2 spring onions",
      "2 tbsp soy sauce",
      "1 tbsp oil",
      "Oil for frying"
    ],
    "steps": [
      "Stir-fry vegetables in 1 tbsp oil for 3–4 minutes, add soy and cool completely.",
      "Place a little filling on each wrapper, fold sides and roll tightly, sealing with water. Fry in 175°C oil until crisp and golden, then drain."
    ],
    "photo": "./recipe-images/spring-rolls.jpg",
    "tags": [
      "snacks",
      "vegetable",
      "spring",
      "rolls"
    ]
  },
  {
    "id": "dish-stir-fry",
    "name": "Beef and vegetable stir-fry",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Beef and vegetable stir-fry — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef strips",
      "1 capsicum",
      "200 g broccoli",
      "1 carrot",
      "2 garlic cloves",
      "3 tbsp soy sauce",
      "2 tbsp oyster sauce",
      "1 tbsp oil"
    ],
    "steps": [
      "Thinly slice vegetables. Sear beef in hot oil in small batches and remove.",
      "Stir-fry vegetables and crushed garlic for 4–5 minutes. Return beef, add sauces and toss until hot. Serve with rice."
    ],
    "photo": "./recipe-images/stir-fry.jpg",
    "tags": [
      "mains",
      "beef",
      "and",
      "vegetable",
      "stir-fry"
    ]
  },
  {
    "id": "dish-sweet-potato",
    "name": "Roasted sweet potato",
    "type": "Sides",
    "time": "35 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Roasted sweet potato — ingredients and step-by-step method.",
    "ingredients": [
      "800 g sweet potato",
      "2 tbsp olive oil",
      "1 tsp smoked paprika",
      "1 tbsp thyme",
      "Salt and pepper"
    ],
    "steps": [
      "Heat oven to 210°C. Peel and cube sweet potato.",
      "Toss with oil, paprika, thyme and seasoning. Roast 25–30 minutes, turning once, until tender and golden."
    ],
    "photo": "./recipe-images/sweet-potato.jpg",
    "tags": [
      "sides",
      "roasted",
      "sweet",
      "potato"
    ]
  },
  {
    "id": "dish-tacos",
    "name": "Beef tacos",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Beef tacos — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef mince",
      "2 tbsp taco seasoning",
      "1 tbsp oil",
      "8 taco shells",
      "1 tomato",
      "100 g lettuce",
      "80 g cheese",
      "100 g salsa"
    ],
    "steps": [
      "Brown mince in oil, add seasoning and 100 ml water and simmer 10 minutes.",
      "Warm shells, then fill with beef, chopped tomato, shredded lettuce, cheese and salsa."
    ],
    "photo": "./recipe-images/tacos.jpg",
    "tags": [
      "mains",
      "beef",
      "tacos"
    ]
  },
  {
    "id": "dish-tarts",
    "name": "Mini spinach and feta tarts",
    "type": "Snacks",
    "time": "35 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Mini spinach and feta tarts — ingredients and step-by-step method.",
    "ingredients": [
      "2 sheets shortcrust pastry",
      "150 g spinach",
      "150 g feta",
      "3 eggs",
      "100 ml cream",
      "1 tbsp oil"
    ],
    "steps": [
      "Heat oven to 190°C. Line 12 muffin wells with pastry.",
      "Wilt spinach in oil, cool and squeeze dry. Whisk eggs and cream, mix with spinach and feta, fill cases and bake 20–25 minutes."
    ],
    "photo": "./recipe-images/tarts.jpg",
    "tags": [
      "snacks",
      "mini",
      "spinach",
      "and",
      "feta",
      "tarts"
    ]
  },
  {
    "id": "dish-thai-curry",
    "name": "Thai red chicken curry",
    "type": "Mains",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Thai red chicken curry — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken thigh",
      "2 tbsp red curry paste",
      "400 ml coconut milk",
      "1 capsicum",
      "150 g green beans",
      "1 tbsp fish sauce",
      "1 tbsp lime juice",
      "1 tbsp oil"
    ],
    "steps": [
      "Fry curry paste in oil for 1 minute. Add coconut milk and diced chicken.",
      "Simmer 15 minutes, add sliced capsicum and beans and cook 5–8 minutes more until chicken is cooked through. Add fish sauce and lime and serve with rice."
    ],
    "photo": "./recipe-images/thai-curry.jpg",
    "tags": [
      "mains",
      "thai",
      "red",
      "chicken",
      "curry"
    ]
  },
  {
    "id": "dish-waffles",
    "name": "Berry breakfast waffles",
    "type": "Breakfast",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Berry breakfast waffles — ingredients and step-by-step method.",
    "ingredients": [
      "250 g plain flour",
      "2 tsp baking powder",
      "2 tbsp sugar",
      "2 eggs",
      "350 ml milk",
      "60 g melted butter",
      "200 g berries",
      "Maple syrup to serve"
    ],
    "steps": [
      "Combine flour, baking powder and sugar. Whisk eggs, milk and butter, then mix into dry ingredients.",
      "Cook portions in a greased waffle maker according to its directions. Serve with berries and syrup."
    ],
    "photo": "./recipe-images/waffles.jpg",
    "tags": [
      "breakfast",
      "berry",
      "breakfast",
      "waffles"
    ]
  },
  {
    "id": "dish-xmas-cake",
    "name": "Christmas fruit cake",
    "type": "Baking",
    "time": "3 hr + soaking",
    "serves": 16,
    "icon": "🍽️",
    "detail": "Christmas fruit cake — ingredients and step-by-step method.",
    "ingredients": [
      "700 g mixed dried fruit",
      "200 ml orange juice",
      "200 g butter",
      "180 g brown sugar",
      "4 eggs",
      "250 g plain flour",
      "1 tsp baking powder",
      "2 tsp mixed spice",
      "100 g almonds"
    ],
    "steps": [
      "Soak fruit in orange juice overnight. Heat oven to 150°C and double-line a 20 cm deep cake tin.",
      "Beat butter and sugar, add eggs one at a time, then fold in flour, baking powder, spice, fruit and almonds. Bake 2–2.5 hours until a skewer is clean, covering loosely if browning too fast. Cool in tin."
    ],
    "photo": "./recipe-images/xmas-cake.jpg",
    "tags": [
      "baking",
      "christmas",
      "fruit",
      "cake"
    ]
  },
  {
    "id": "dish-yoghurt",
    "name": "Fruit and yoghurt breakfast bowls",
    "type": "Breakfast",
    "time": "10 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Fruit and yoghurt breakfast bowls — ingredients and step-by-step method.",
    "ingredients": [
      "600 g Greek yoghurt",
      "200 g berries",
      "1 sliced banana",
      "80 g granola",
      "2 tbsp honey"
    ],
    "steps": [
      "Divide yoghurt between bowls.",
      "Top with berries, banana and granola and drizzle with honey."
    ],
    "photo": "./recipe-images/yoghurt.jpg",
    "tags": [
      "breakfast",
      "fruit",
      "and",
      "yoghurt",
      "breakfast",
      "bowls"
    ]
  },
  {
    "id": "dish-yule-log",
    "name": "Chocolate Christmas yule log",
    "type": "Desserts",
    "time": "55 min + cooling",
    "serves": 10,
    "icon": "🍽️",
    "detail": "Chocolate Christmas yule log — ingredients and step-by-step method.",
    "ingredients": [
      "4 eggs",
      "100 g caster sugar",
      "70 g plain flour",
      "30 g cocoa",
      "300 ml cream",
      "150 g dark chocolate",
      "150 ml extra cream"
    ],
    "steps": [
      "Heat oven to 180°C and line a 25 x 35 cm tray. Whisk eggs and sugar until thick, fold in flour and cocoa and bake 10–12 minutes.",
      "Turn onto baking paper dusted with cocoa and roll while warm. Cool, unroll and fill with whipped cream. Roll again. Pour hot extra cream over chocolate, stir smooth, cool until spreadable and coat the log."
    ],
    "photo": "./recipe-images/yule-log.jpg",
    "tags": [
      "desserts",
      "chocolate",
      "christmas",
      "yule",
      "log"
    ]
  },
  {
    "id": "dish-popular-beef-4",
    "name": "Pumpkin soup",
    "type": "Mains",
    "time": "40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Pumpkin soup — ingredients and step-by-step method.",
    "ingredients": [
      "1 kg peeled pumpkin",
      "1 onion",
      "2 garlic cloves",
      "750 ml vegetable stock",
      "100 ml cream",
      "1 tbsp oil"
    ],
    "steps": [
      "Soften chopped onion and garlic in oil, then add diced pumpkin and stock.",
      "Simmer 25 minutes until tender. Blend carefully until smooth, stir in cream and season."
    ],
    "photo": "./recipe-images/popular-beef-4.jpg",
    "tags": [
      "mains",
      "pumpkin",
      "soup"
    ]
  },
  {
    "id": "dish-popular-beef-5",
    "name": "Roast chicken with vegetables",
    "type": "Mains",
    "time": "1 hr 40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Roast chicken with vegetables — ingredients and step-by-step method.",
    "ingredients": [
      "1.6 kg whole chicken",
      "600 g potatoes",
      "4 carrots",
      "2 onions",
      "2 tbsp olive oil",
      "1 lemon",
      "2 tsp thyme"
    ],
    "steps": [
      "Heat oven to 190°C. Cut vegetables into chunks and place in a roasting dish. Rub chicken with oil, thyme and seasoning and place lemon halves in cavity.",
      "Roast 80–100 minutes, turning vegetables once, until chicken is cooked through and the thickest part reaches 74°C. Rest 15 minutes before carving."
    ],
    "photo": "./recipe-images/popular-beef-5.jpg",
    "tags": [
      "mains",
      "roast",
      "chicken",
      "with",
      "vegetables"
    ]
  },
  {
    "id": "dish-popular-beef-6",
    "name": "Beef Wellington",
    "type": "Mains",
    "time": "1 hr 30 min + chilling",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Beef Wellington — ingredients and step-by-step method.",
    "ingredients": [
      "800 g centre-cut beef fillet",
      "500 g mushrooms",
      "6 prosciutto slices",
      "2 tbsp Dijon mustard",
      "1 large puff pastry sheet",
      "1 beaten egg",
      "1 tbsp oil"
    ],
    "steps": [
      "Sear seasoned beef in oil, cool and brush with mustard. Finely chop mushrooms and fry until all moisture evaporates.",
      "Lay prosciutto on cling film, spread mushrooms and roll around beef, then chill 20 minutes. Wrap in pastry, seal, brush with egg and chill 15 minutes. Bake at 200°C for 35–45 minutes, checking desired doneness with a thermometer. Rest 10 minutes."
    ],
    "photo": "./recipe-images/popular-beef-6.jpg",
    "tags": [
      "mains",
      "beef",
      "wellington"
    ]
  },
  {
    "id": "dish-popular-beef-7",
    "name": "Creamy mushroom chicken",
    "type": "Mains",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Creamy mushroom chicken — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken breast",
      "250 g mushrooms",
      "2 garlic cloves",
      "150 ml chicken stock",
      "150 ml cream",
      "1 tbsp oil",
      "1 tsp thyme"
    ],
    "steps": [
      "Sear chicken in oil and remove. Cook sliced mushrooms and crushed garlic in the same pan.",
      "Add stock, cream and thyme, return chicken and simmer 12–15 minutes until cooked through. Season and serve with rice or mash."
    ],
    "photo": "./recipe-images/popular-beef-7.jpg",
    "tags": [
      "mains",
      "creamy",
      "mushroom",
      "chicken"
    ]
  },
  {
    "id": "dish-popular-beef-8",
    "name": "Pumpkin risotto",
    "type": "Mains",
    "time": "45 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Pumpkin risotto — ingredients and step-by-step method.",
    "ingredients": [
      "300 g arborio rice",
      "500 g pumpkin, diced",
      "1 onion",
      "1 L hot vegetable stock",
      "40 g butter",
      "60 g parmesan",
      "1 tbsp olive oil"
    ],
    "steps": [
      "Roast pumpkin with half the oil at 200°C for 25 minutes. Soften diced onion with remaining oil and half the butter, then stir in rice.",
      "Add stock a ladle at a time until rice is tender, about 20 minutes. Fold in pumpkin, remaining butter and parmesan."
    ],
    "photo": "./recipe-images/popular-beef-8.jpg",
    "tags": [
      "mains",
      "pumpkin",
      "risotto"
    ]
  },
  {
    "id": "dish-popular-beef-9",
    "name": "Slow-braised lamb shanks",
    "type": "Mains",
    "time": "3 hr",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Slow-braised lamb shanks — ingredients and step-by-step method.",
    "ingredients": [
      "4 lamb shanks",
      "1 onion",
      "2 carrots",
      "2 garlic cloves",
      "400 g canned tomatoes",
      "500 ml beef stock",
      "2 rosemary sprigs",
      "2 tbsp oil"
    ],
    "steps": [
      "Heat oven to 160°C. Brown shanks in oil in a casserole and remove. Soften chopped onion and carrots, then add garlic.",
      "Add tomatoes, stock, rosemary and lamb. Cover and cook in oven 2.5 hours until meat is tender, turning once. Reduce sauce on stovetop if needed."
    ],
    "photo": "./recipe-images/popular-beef-9.jpg",
    "tags": [
      "mains",
      "slow-braised",
      "lamb",
      "shanks"
    ]
  },
  {
    "id": "dish-popular-beef-10",
    "name": "Chicken parmigiana",
    "type": "Mains",
    "time": "40 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken parmigiana — ingredients and step-by-step method.",
    "ingredients": [
      "4 chicken breast schnitzels",
      "80 g flour",
      "2 beaten eggs",
      "150 g breadcrumbs",
      "250 ml tomato passata",
      "120 g mozzarella",
      "50 g parmesan",
      "3 tbsp oil"
    ],
    "steps": [
      "Heat oven to 200°C. Coat chicken in flour, egg and breadcrumbs and pan-fry until golden.",
      "Place on a tray, top with passata and cheeses and bake 15–20 minutes until chicken is cooked through and cheese bubbles."
    ],
    "photo": "./recipe-images/popular-beef-10.jpg",
    "tags": [
      "mains",
      "chicken",
      "parmigiana"
    ]
  },
  {
    "id": "dish-popular-beef-11",
    "name": "Beef stroganoff",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Beef stroganoff — ingredients and step-by-step method.",
    "ingredients": [
      "600 g beef strips",
      "250 g mushrooms",
      "1 onion",
      "150 ml beef stock",
      "150 g sour cream",
      "1 tbsp Dijon mustard",
      "1 tbsp oil",
      "250 g pasta to serve"
    ],
    "steps": [
      "Cook pasta. Quickly sear beef in oil in batches and remove.",
      "Soften sliced onion and mushrooms, add stock and mustard and simmer 5 minutes. Lower heat, stir in sour cream and return beef briefly. Serve over pasta."
    ],
    "photo": "./recipe-images/popular-beef-11.jpg",
    "tags": [
      "mains",
      "beef",
      "stroganoff"
    ]
  },
  {
    "id": "dish-popular-beef-13",
    "name": "Teriyaki chicken",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Teriyaki chicken — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken thigh",
      "4 tbsp soy sauce",
      "2 tbsp brown sugar",
      "2 tbsp mirin",
      "1 tsp grated ginger",
      "1 tbsp oil",
      "1 tsp sesame seeds",
      "Cooked rice to serve"
    ],
    "steps": [
      "Mix soy, sugar, mirin and ginger. Brown chicken in oil.",
      "Add sauce and simmer 10–15 minutes, turning until chicken is cooked through and sauce coats it. Sprinkle sesame seeds and serve with rice."
    ],
    "photo": "./recipe-images/popular-beef-13.jpg",
    "tags": [
      "mains",
      "teriyaki",
      "chicken"
    ]
  },
  {
    "id": "dish-popular-beef-14",
    "name": "Honey garlic chicken",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Honey garlic chicken — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken thigh",
      "3 tbsp honey",
      "3 tbsp soy sauce",
      "4 garlic cloves",
      "1 tbsp lemon juice",
      "1 tbsp oil"
    ],
    "steps": [
      "Brown chicken in oil. Mix honey, soy, crushed garlic and lemon.",
      "Add sauce with 80 ml water and simmer 12–15 minutes until chicken is cooked through and sauce thickens."
    ],
    "photo": "./recipe-images/popular-beef-14.jpg",
    "tags": [
      "mains",
      "honey",
      "garlic",
      "chicken"
    ]
  },
  {
    "id": "dish-popular-beef-15",
    "name": "Sweet chilli prawns",
    "type": "Mains",
    "time": "20 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Sweet chilli prawns — ingredients and step-by-step method.",
    "ingredients": [
      "700 g peeled raw prawns",
      "4 tbsp sweet chilli sauce",
      "1 tbsp soy sauce",
      "1 tbsp lime juice",
      "2 garlic cloves",
      "1 tbsp oil",
      "2 spring onions"
    ],
    "steps": [
      "Stir-fry prawns and crushed garlic in oil for 3–4 minutes until opaque and cooked.",
      "Add sauces and lime, toss for 1 minute and top with sliced spring onions. Serve with rice."
    ],
    "photo": "./recipe-images/popular-beef-15.jpg",
    "tags": [
      "mains",
      "sweet",
      "chilli",
      "prawns"
    ]
  },
  {
    "id": "dish-popular-beef-16",
    "name": "Lemon and herb baked fish",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Lemon and herb baked fish — ingredients and step-by-step method.",
    "ingredients": [
      "4 x 180 g white fish fillets",
      "1 lemon",
      "2 tbsp olive oil",
      "2 garlic cloves",
      "2 tbsp chopped parsley",
      "Salt and pepper"
    ],
    "steps": [
      "Heat oven to 200°C. Put fish in a baking dish and drizzle with oil, lemon juice, crushed garlic and seasoning.",
      "Bake 12–18 minutes, depending on thickness, until flesh is opaque and flakes easily. Add parsley and serve."
    ],
    "photo": "./recipe-images/popular-beef-16.jpg",
    "tags": [
      "mains",
      "lemon",
      "and",
      "herb",
      "baked",
      "fish"
    ]
  },
  {
    "id": "dish-popular-beef-17",
    "name": "Thai beef salad",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Thai beef salad — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef steak",
      "1 cucumber",
      "200 g cherry tomatoes",
      "1 red onion",
      "1 bunch coriander",
      "2 tbsp lime juice",
      "1 tbsp fish sauce",
      "1 tsp brown sugar",
      "1 tsp oil"
    ],
    "steps": [
      "Sear steak in oil to your preference and rest before slicing.",
      "Slice vegetables and toss with coriander. Mix lime, fish sauce and sugar and toss through salad and sliced beef."
    ],
    "photo": "./recipe-images/popular-beef-17.jpg",
    "tags": [
      "mains",
      "thai",
      "beef",
      "salad"
    ]
  },
  {
    "id": "dish-popular-beef-18",
    "name": "Chicken Caesar salad",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken Caesar salad — ingredients and step-by-step method.",
    "ingredients": [
      "500 g chicken breast",
      "1 cos lettuce",
      "100 g croutons",
      "60 g parmesan",
      "100 ml Caesar dressing",
      "1 tbsp oil"
    ],
    "steps": [
      "Cook chicken in oil until cooked through, rest and slice.",
      "Toss chopped lettuce with dressing, croutons and chicken and top with shaved parmesan."
    ],
    "photo": "./recipe-images/popular-beef-18.jpg",
    "tags": [
      "mains",
      "chicken",
      "caesar",
      "salad"
    ]
  },
  {
    "id": "dish-popular-beef-19",
    "name": "Greek salad",
    "type": "Sides",
    "time": "15 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Greek salad — ingredients and step-by-step method.",
    "ingredients": [
      "4 tomatoes",
      "1 cucumber",
      "1 red onion",
      "150 g feta",
      "100 g olives",
      "3 tbsp olive oil",
      "1 tbsp red wine vinegar",
      "1 tsp oregano"
    ],
    "steps": [
      "Chop tomatoes and cucumber, thinly slice onion and place in a bowl with olives.",
      "Whisk oil, vinegar and oregano. Toss through salad and top with feta."
    ],
    "photo": "./recipe-images/popular-beef-19.jpg",
    "tags": [
      "sides",
      "greek",
      "salad"
    ]
  },
  {
    "id": "dish-popular-beef-20",
    "name": "Quinoa vegetable salad",
    "type": "Sides",
    "time": "30 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Quinoa vegetable salad — ingredients and step-by-step method.",
    "ingredients": [
      "200 g quinoa",
      "400 ml water",
      "1 cucumber",
      "200 g cherry tomatoes",
      "1 capsicum",
      "2 tbsp olive oil",
      "2 tbsp lemon juice",
      "2 tbsp parsley"
    ],
    "steps": [
      "Rinse quinoa and simmer covered in water for 15 minutes, then stand 5 minutes and cool.",
      "Dice vegetables and toss with quinoa, oil, lemon and parsley. Season and chill."
    ],
    "photo": "./recipe-images/popular-beef-20.jpg",
    "tags": [
      "sides",
      "quinoa",
      "vegetable",
      "salad"
    ]
  },
  {
    "id": "dish-popular-lamb-8",
    "name": "Shepherd's pie",
    "type": "Mains",
    "time": "1 hr",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Shepherd's pie — ingredients and step-by-step method.",
    "ingredients": [
      "600 g lamb mince",
      "1 onion",
      "2 carrots",
      "150 g peas",
      "2 tbsp tomato paste",
      "300 ml beef stock",
      "1 tbsp Worcestershire sauce",
      "1 kg potatoes",
      "50 g butter",
      "100 ml milk",
      "1 tbsp oil"
    ],
    "steps": [
      "Soften chopped onion and carrot in oil, brown mince, add paste, stock and Worcestershire and simmer 20 minutes. Add peas.",
      "Boil peeled potatoes until tender and mash with butter and milk. Put meat in a baking dish, top with mash and bake at 200°C for 20 minutes."
    ],
    "photo": "./recipe-images/popular-lamb-8.jpg",
    "tags": [
      "mains",
      "shepherd's",
      "pie"
    ]
  },
  {
    "id": "dish-popular-lamb-10",
    "name": "Slow-cooked pulled beef",
    "type": "Mains",
    "time": "4 hr",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Slow-cooked pulled beef — ingredients and step-by-step method.",
    "ingredients": [
      "1.2 kg beef chuck",
      "1 onion",
      "3 garlic cloves",
      "300 ml beef stock",
      "200 ml barbecue sauce",
      "1 tbsp smoked paprika",
      "1 tbsp oil"
    ],
    "steps": [
      "Heat oven to 150°C. Brown beef in oil in a casserole.",
      "Add sliced onion, garlic, stock, sauce and paprika. Cover and braise 3.5–4 hours until fork-tender. Shred and mix through the cooking sauce."
    ],
    "photo": "./recipe-images/popular-lamb-10.jpg",
    "tags": [
      "mains",
      "slow-cooked",
      "pulled",
      "beef"
    ]
  },
  {
    "id": "dish-popular-lamb-12",
    "name": "Chilli con carne",
    "type": "Mains",
    "time": "50 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Chilli con carne — ingredients and step-by-step method.",
    "ingredients": [
      "500 g beef mince",
      "1 onion",
      "2 garlic cloves",
      "400 g kidney beans",
      "800 g canned tomatoes",
      "1 tbsp cumin",
      "1 tsp chilli powder",
      "1 tbsp oil"
    ],
    "steps": [
      "Soften chopped onion and garlic in oil, add mince and brown.",
      "Add cumin, chilli, tomatoes and drained beans and simmer 30 minutes. Season and serve with rice."
    ],
    "photo": "./recipe-images/popular-lamb-12.jpg",
    "tags": [
      "mains",
      "chilli",
      "con",
      "carne"
    ]
  },
  {
    "id": "dish-popular-lamb-13",
    "name": "Mexican burrito bowls",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Mexican burrito bowls — ingredients and step-by-step method.",
    "ingredients": [
      "300 g rice",
      "400 g black beans, drained",
      "200 g corn",
      "1 avocado",
      "150 g salsa",
      "100 g cheese",
      "1 lime",
      "1 tsp cumin"
    ],
    "steps": [
      "Cook rice. Warm beans and corn with cumin and a splash of water.",
      "Divide rice and beans between bowls. Add diced avocado, salsa and cheese and squeeze over lime."
    ],
    "photo": "./recipe-images/popular-lamb-13.jpg",
    "tags": [
      "mains",
      "mexican",
      "burrito",
      "bowls"
    ]
  },
  {
    "id": "dish-popular-lamb-14",
    "name": "Chicken fajitas",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Chicken fajitas — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken breast strips",
      "2 capsicums",
      "1 onion",
      "2 tbsp fajita seasoning",
      "1 tbsp oil",
      "8 tortillas",
      "100 g sour cream",
      "1 lime"
    ],
    "steps": [
      "Toss chicken with seasoning and stir-fry in oil until nearly cooked.",
      "Add sliced capsicums and onion and cook until tender and chicken is cooked through. Serve in warm tortillas with sour cream and lime."
    ],
    "photo": "./recipe-images/popular-lamb-14.jpg",
    "tags": [
      "mains",
      "chicken",
      "fajitas"
    ]
  },
  {
    "id": "dish-popular-lamb-18",
    "name": "Coconut prawn curry",
    "type": "Mains",
    "time": "25 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Coconut prawn curry — ingredients and step-by-step method.",
    "ingredients": [
      "700 g peeled raw prawns",
      "1 onion",
      "2 tbsp curry paste",
      "400 ml coconut milk",
      "150 g spinach",
      "1 tbsp oil",
      "1 lime"
    ],
    "steps": [
      "Soften sliced onion in oil and fry curry paste for 1 minute. Add coconut milk and simmer 8 minutes.",
      "Add prawns and simmer 4–5 minutes until opaque, add spinach to wilt and finish with lime juice."
    ],
    "photo": "./recipe-images/popular-lamb-18.jpg",
    "tags": [
      "mains",
      "coconut",
      "prawn",
      "curry"
    ]
  },
  {
    "id": "dish-popular-lamb-20",
    "name": "Lemon chicken piccata",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Lemon chicken piccata — ingredients and step-by-step method.",
    "ingredients": [
      "600 g chicken breast, sliced thin",
      "50 g flour",
      "40 g butter",
      "1 tbsp oil",
      "150 ml chicken stock",
      "2 tbsp lemon juice",
      "2 tbsp capers",
      "2 tbsp parsley"
    ],
    "steps": [
      "Dust chicken with flour and cook in oil and half the butter until cooked through, then remove.",
      "Add stock, lemon and capers and simmer 4 minutes. Whisk in remaining butter, return chicken and scatter with parsley."
    ],
    "photo": "./recipe-images/popular-lamb-20.jpg",
    "tags": [
      "mains",
      "lemon",
      "chicken",
      "piccata"
    ]
  },
  {
    "id": "dish-popular-pork-1",
    "name": "Tandoori chicken",
    "type": "Mains",
    "time": "45 min + marinating",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Tandoori chicken — ingredients and step-by-step method.",
    "ingredients": [
      "800 g chicken thighs",
      "150 g yoghurt",
      "2 tbsp tandoori spice mix",
      "1 tbsp lemon juice",
      "2 garlic cloves",
      "1 tbsp oil"
    ],
    "steps": [
      "Mix yoghurt, spice, lemon, crushed garlic and oil, coat chicken and refrigerate for at least 1 hour.",
      "Bake on a lined tray at 210°C for 25–35 minutes until browned and cooked through. Serve with rice and yoghurt."
    ],
    "photo": "./recipe-images/popular-pork-1.jpg",
    "tags": [
      "mains",
      "tandoori",
      "chicken"
    ]
  },
  {
    "id": "dish-popular-pork-2",
    "name": "Garlic naan bread",
    "type": "Sides",
    "time": "1 hr 30 min",
    "serves": 8,
    "icon": "🍽️",
    "detail": "Garlic naan bread — ingredients and step-by-step method.",
    "ingredients": [
      "350 g plain flour",
      "7 g instant yeast",
      "1 tsp sugar",
      "1/2 tsp salt",
      "120 ml warm water",
      "100 g yoghurt",
      "2 tbsp oil",
      "40 g butter",
      "2 garlic cloves"
    ],
    "steps": [
      "Mix flour, yeast, sugar, salt, water, yoghurt and oil. Knead 5 minutes and prove covered for 1 hour.",
      "Divide into eight and roll thin. Cook in a hot dry pan 1–2 minutes each side until puffed and spotted. Brush with melted garlic butter."
    ],
    "photo": "./recipe-images/popular-pork-2.jpg",
    "tags": [
      "sides",
      "garlic",
      "naan",
      "bread"
    ]
  },
  {
    "id": "dish-popular-pork-3",
    "name": "Vegetable rice pilaf",
    "type": "Sides",
    "time": "35 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Vegetable rice pilaf — ingredients and step-by-step method.",
    "ingredients": [
      "300 g basmati rice",
      "1 onion",
      "1 carrot",
      "150 g peas",
      "600 ml vegetable stock",
      "30 g butter",
      "1 tsp cumin"
    ],
    "steps": [
      "Soften diced onion and carrot in butter, add cumin and rice and stir 1 minute.",
      "Add stock, cover and simmer gently 12–15 minutes. Add peas for the final 3 minutes, then stand covered 5 minutes and fluff."
    ],
    "photo": "./recipe-images/popular-pork-3.jpg",
    "tags": [
      "sides",
      "vegetable",
      "rice",
      "pilaf"
    ]
  },
  {
    "id": "dish-popular-pork-4",
    "name": "Vegetable lasagne",
    "type": "Mains",
    "time": "1 hr 10 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Vegetable lasagne — ingredients and step-by-step method.",
    "ingredients": [
      "250 g lasagne sheets",
      "1 zucchini",
      "1 capsicum",
      "250 g mushrooms",
      "700 ml passata",
      "500 ml white sauce",
      "150 g cheese",
      "1 tbsp oil"
    ],
    "steps": [
      "Heat oven to 180°C. Chop and saute vegetables in oil until softened and stir in passata.",
      "Layer vegetables, sheets and white sauce in a dish. Finish with sauce and cheese and bake 40–45 minutes. Rest 10 minutes."
    ],
    "photo": "./recipe-images/popular-pork-4.jpg",
    "tags": [
      "mains",
      "vegetable",
      "lasagne"
    ]
  },
  {
    "id": "dish-popular-pork-5",
    "name": "Spinach and feta filo pie",
    "type": "Mains",
    "time": "55 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Spinach and feta filo pie — ingredients and step-by-step method.",
    "ingredients": [
      "8 filo sheets",
      "300 g spinach",
      "200 g feta",
      "3 eggs",
      "1 onion",
      "60 g melted butter",
      "1 tbsp oil"
    ],
    "steps": [
      "Heat oven to 180°C. Soften diced onion in oil and wilt spinach. Cool and squeeze excess liquid, then mix with feta and eggs.",
      "Brush filo sheets with butter and layer in a pie dish. Add filling and fold pastry over. Bake 35–40 minutes until crisp and filling is set."
    ],
    "photo": "./recipe-images/popular-pork-5.jpg",
    "tags": [
      "mains",
      "spinach",
      "and",
      "feta",
      "filo",
      "pie"
    ]
  },
  {
    "id": "dish-popular-pork-6",
    "name": "Zucchini slice",
    "type": "Mains",
    "time": "45 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Zucchini slice — ingredients and step-by-step method.",
    "ingredients": [
      "3 zucchini, grated",
      "5 eggs",
      "100 g self-raising flour",
      "100 g cheese",
      "1 onion, finely diced",
      "100 g cooked bacon",
      "60 ml oil"
    ],
    "steps": [
      "Heat oven to 180°C and line a slice tin. Squeeze excess liquid from zucchini.",
      "Mix all ingredients, season and pour into tin. Bake 30–35 minutes until golden and set. Rest before slicing."
    ],
    "photo": "./recipe-images/popular-pork-6.jpg",
    "tags": [
      "mains",
      "zucchini",
      "slice"
    ]
  },
  {
    "id": "dish-popular-pork-7",
    "name": "Savoury cheese muffins",
    "type": "Baking",
    "time": "35 min",
    "serves": 12,
    "icon": "🍽️",
    "detail": "Savoury cheese muffins — ingredients and step-by-step method.",
    "ingredients": [
      "300 g self-raising flour",
      "2 eggs",
      "200 ml milk",
      "80 ml oil",
      "150 g cheese",
      "100 g corn",
      "2 spring onions"
    ],
    "steps": [
      "Heat oven to 180°C and line a muffin tin. Mix flour, cheese, corn and sliced onions.",
      "Whisk eggs, milk and oil, fold into dry ingredients, divide between cases and bake 20–25 minutes."
    ],
    "photo": "./recipe-images/popular-pork-7.jpg",
    "tags": [
      "baking",
      "savoury",
      "cheese",
      "muffins"
    ]
  },
  {
    "id": "dish-popular-pork-9",
    "name": "Mini party pies",
    "type": "Snacks",
    "time": "1 hr",
    "serves": 24,
    "icon": "🍽️",
    "detail": "Mini party pies — ingredients and step-by-step method.",
    "ingredients": [
      "400 g beef mince",
      "1 onion",
      "1 tbsp oil",
      "2 tbsp flour",
      "250 ml beef stock",
      "2 tbsp tomato sauce",
      "2 shortcrust pastry sheets",
      "2 puff pastry sheets",
      "1 beaten egg"
    ],
    "steps": [
      "Soften diced onion in oil and brown mince. Stir in flour, add stock and sauce and simmer until thick, then cool.",
      "Line mini muffin wells with shortcrust circles, add filling, cover with puff pastry circles and seal. Brush with egg and bake at 200°C for 20–25 minutes."
    ],
    "photo": "./recipe-images/popular-pork-9.jpg",
    "tags": [
      "snacks",
      "mini",
      "party",
      "pies"
    ]
  },
  {
    "id": "dish-popular-pork-15",
    "name": "Sticky barbecue pork ribs",
    "type": "Mains",
    "time": "2 hr 30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Sticky barbecue pork ribs — ingredients and step-by-step method.",
    "ingredients": [
      "1.5 kg pork ribs",
      "200 ml barbecue sauce",
      "2 tbsp honey",
      "2 tbsp soy sauce",
      "1 tsp smoked paprika"
    ],
    "steps": [
      "Heat oven to 160°C. Mix sauce, honey, soy and paprika. Rub half over ribs, wrap tightly in foil and place on a tray.",
      "Bake 2 hours until tender. Unwrap, brush with remaining sauce and cook at 220°C for 15–20 minutes until sticky."
    ],
    "photo": "./recipe-images/popular-pork-15.jpg",
    "tags": [
      "mains",
      "sticky",
      "barbecue",
      "pork",
      "ribs"
    ]
  },
  {
    "id": "dish-popular-pork-16",
    "name": "Pork schnitzel",
    "type": "Mains",
    "time": "30 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Pork schnitzel — ingredients and step-by-step method.",
    "ingredients": [
      "4 pork loin steaks, flattened",
      "80 g flour",
      "2 beaten eggs",
      "150 g breadcrumbs",
      "3 tbsp oil",
      "1 lemon"
    ],
    "steps": [
      "Season pork and coat in flour, egg and crumbs.",
      "Fry over medium heat 4–5 minutes each side until golden and cooked through. Drain and serve with lemon wedges."
    ],
    "photo": "./recipe-images/popular-pork-16.jpg",
    "tags": [
      "mains",
      "pork",
      "schnitzel"
    ]
  },
  {
    "id": "dish-popular-pork-17",
    "name": "Pulled pork burgers",
    "type": "Mains",
    "time": "4 hr 30 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Pulled pork burgers — ingredients and step-by-step method.",
    "ingredients": [
      "1.5 kg pork shoulder",
      "1 onion",
      "200 ml barbecue sauce",
      "150 ml water",
      "1 tbsp smoked paprika",
      "6 bread rolls",
      "300 g coleslaw"
    ],
    "steps": [
      "Heat oven to 150°C. Put pork, sliced onion, sauce, water and paprika in a covered casserole.",
      "Cook 4 hours until easily shredded. Remove excess fat, shred and mix with sauce. Serve in rolls with coleslaw."
    ],
    "photo": "./recipe-images/popular-pork-17.jpg",
    "tags": [
      "mains",
      "pulled",
      "pork",
      "burgers"
    ]
  },
  {
    "id": "dish-popular-pork-18",
    "name": "Sausages with mashed potato",
    "type": "Mains",
    "time": "40 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Sausages with mashed potato — ingredients and step-by-step method.",
    "ingredients": [
      "8 pork sausages",
      "800 g potatoes",
      "40 g butter",
      "100 ml milk",
      "250 ml gravy",
      "1 tbsp oil"
    ],
    "steps": [
      "Boil peeled potatoes until tender, drain and mash with butter and milk.",
      "Cook sausages in oil over medium heat, turning, until browned and cooked through. Serve on mash with heated gravy."
    ],
    "photo": "./recipe-images/popular-pork-18.jpg",
    "tags": [
      "mains",
      "sausages",
      "with",
      "mashed",
      "potato"
    ]
  },
  {
    "id": "dish-popular-pork-19",
    "name": "Crispy pork belly bites",
    "type": "Mains",
    "time": "1 hr 40 min",
    "serves": 6,
    "icon": "🍽️",
    "detail": "Crispy pork belly bites — ingredients and step-by-step method.",
    "ingredients": [
      "1 kg skinless pork belly",
      "2 tbsp soy sauce",
      "2 tbsp honey",
      "1 tbsp rice vinegar",
      "1 tsp five-spice",
      "2 garlic cloves"
    ],
    "steps": [
      "Heat oven to 180°C. Cut pork into 3 cm pieces, toss with soy, honey, vinegar, spice and crushed garlic.",
      "Place in a covered baking dish with 100 ml water and cook 1 hour. Uncover and cook 25–30 minutes, turning, until tender and browned."
    ],
    "photo": "./recipe-images/popular-pork-19.jpg",
    "tags": [
      "mains",
      "crispy",
      "pork",
      "belly",
      "bites"
    ]
  },
  {
    "id": "dish-popular-pork-20",
    "name": "Sweet and sour pork",
    "type": "Mains",
    "time": "35 min",
    "serves": 4,
    "icon": "🍽️",
    "detail": "Sweet and sour pork — ingredients and step-by-step method.",
    "ingredients": [
      "600 g diced pork",
      "3 tbsp cornflour",
      "1 capsicum",
      "1 onion",
      "200 g pineapple pieces",
      "4 tbsp tomato sauce",
      "3 tbsp rice vinegar",
      "2 tbsp sugar",
      "2 tbsp soy sauce",
      "2 tbsp oil"
    ],
    "steps": [
      "Coat pork with cornflour and pan-fry in oil until browned and cooked through. Remove.",
      "Stir-fry sliced vegetables, add pineapple and remaining ingredients with 100 ml water, simmer 3 minutes and return pork. Toss until coated and hot."
    ],
    "photo": "./recipe-images/popular-pork-20.jpg",
    "tags": [
      "mains",
      "sweet",
      "and",
      "sour",
      "pork"
    ]
  }
];
// Keep the Christmas originals and their IDs, including saved menu references.
const oldPopular=RECIPES.filter(r=>String(r.id).startsWith('popular-'));
const photoById={
 ham:'ham.webp',prawns:'prawns.webp',potatoes:'potatoes.webp',pavlova:'pavlova.webp',
 trifle:'trifle.webp',salad:'salad.jpg',rocky:'rocky.webp',veggie:'veggie.webp',
 punch:'punch.jpg',ginger:'ginger.jpg',breakfast:'breakfast.jpg',wraps:'wraps.jpg',
 turkey:'turkey.jpg',pork:'pork.jpg',salmon:'salmon.webp',chicken:'chicken.jpg',
 lamb:'lamb.jpg',lentil:'lentil.jpg',stuffing:'stuffing.jpg','potato-salad':'potato-salad.jpg',
 coleslaw:'coleslaw.jpg',corn:'corn.webp',fruit:'fruit.webp',bagels:'bagels.jpg',
 'french-toast':'french-toast.jpg','fried-rice':'fried-rice.jpg'
};
const categoryPhoto={chicken:'chicken.jpg',beef:'beef.webp',lamb:'lamb.jpg',pork:'pork.jpg',ham:'ham.webp',prawns:'prawns.webp',fish:'popular-beef-16.jpg',potato:'potatoes.webp',pasta:'pasta.jpg',vegetarian:'veggie.webp'};
for(let i=RECIPES.length-1;i>=0;i--) if(String(RECIPES[i].id).startsWith('popular-')||String(RECIPES[i].id).startsWith('dish-')) RECIPES.splice(i,1);
const existingNames=new Set(RECIPES.map(r=>r.name.toLowerCase()));
for(const r of PICTURED_DISHES) if(!existingNames.has(r.name.toLowerCase())) RECIPES.push(r);
// Retain an old recipe only when it is already in a saved menu; do not discard users' plans.
if(typeof state!=='undefined' && Array.isArray(state.menu)) {
 for(const r of oldPopular) if(state.menu.includes(r.id)) {
  const group=String(r.id).replace(/^popular-/,'').replace(/-\d+$/,'');
  const image=categoryPhoto[group];
  r.photo=image?'./recipe-images/'+image:null;
  r.savedMenuOnly=true;
  RECIPES.push(r);
 }
}
const escAttr = v => String(v ?? '')
  .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;');

function imagePath(r){
  if(r.photo) return r.photo;
  const file=photoById[r.id];
  return file?'./recipe-images/'+file:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#edf4ef"/><text x="400" y="250" text-anchor="middle" fill="#49665c" font-family="sans-serif" font-size="28">Photo coming soon</text></svg>');
}
window.hqRecipeImagePath=imagePath;

window.hqRecipeImageMissing=function(img){
  img.onerror=null;
  img.style.setProperty('display','none','important');
  const box=img.closest('.hq-v6-photo,.hq-v6-detail-photo');
  if(box) box.classList.add('is-missing');
};

window.recipeCard=function recipeCard(r){
  if(r.savedMenuOnly) return "";
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
 object-position:50% 50%!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;
 transform:scale(1.16)}
.hq-v6-photo.is-missing:after,.hq-v6-detail-photo.is-missing:after{
 content:"Photo coming soon";position:absolute;inset:0;display:grid;place-items:center;
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
 display:block;width:100%;height:100%;object-fit:cover;object-position:50% 50%;border:0;margin:0;
 transform:scale(1.16)
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

