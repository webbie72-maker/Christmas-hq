/* Christmas HQ — 299 Gift Ideas */
(() => {
  'use strict';
  if (typeof IDEAS === 'undefined') {
    console.warn('Christmas HQ gift library could not find IDEAS.');
    return;
  }
  const CHRISTMAS_GIFT_IDEAS = [
    ['🎁','Personalised photo book','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Engraved keyring','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom family calendar','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised leather wallet','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Initial necklace','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Birthstone bracelet','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom name mug','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised phone case','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Monogrammed toiletry bag','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Photo blanket','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom star map','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Engraved watch box','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised recipe book','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Family tree print','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom pet portrait','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Name-embroidered robe','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised jewellery box','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom photo puzzle','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Engraved pen set','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Memory keepsake box','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised travel tag','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom house portrait','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Handwritten recipe tea towel','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Name-engraved drink bottle','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised Christmas ornament','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom playlist plaque','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Engraved pocket knife','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Personalised cufflinks','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Photo locket','Personal','A thoughtful gift with a personal touch.'],
    ['🎁','Custom family name sign','Personal','A thoughtful gift with a personal touch.'],
    ['🧦','Premium socks and treats','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Mini Bluetooth speaker','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Reusable insulated cup','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Desk plant','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Movie-night snack box','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Puzzle book bundle','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Scented candle','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Travel coffee mug','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Phone stand','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Board game card pack','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Gourmet hot chocolate kit','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Novelty apron','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Portable picnic blanket','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Notebook and pen set','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Mini tool kit','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Car cleaning kit','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Coffee beans sampler','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Tea tasting box','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Baking mix jar','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Succulent trio','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Reusable lunch bag','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Pocket torch','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Beanie and gloves set','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Beach towel','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Water bottle','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Bath bomb set','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Chocolate tasting box','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Wireless charging pad','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Compact umbrella','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧦','Christmas biscuit tin','Under $50','A useful Christmas gift that keeps the budget under control.'],
    ['🧸','LEGO building set','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Magnetic tile set','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Science experiment kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Art and craft box','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Kids gardening kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Remote-control car','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Dress-up costume','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Storybook bundle','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Kids baking kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Wooden train set','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Dinosaur excavation kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Space discovery kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Junior microscope','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Make-your-own slime kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Kids karaoke microphone','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Board game for kids','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Outdoor water-play set','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Scooter accessories pack','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Personalised storybook','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','STEM robot kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Kids instant-print camera','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Puzzle bundle','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Play tent','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Building block marble run','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Junior cooking set','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Craft bead kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Kids binoculars','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Make-your-own jewellery kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Soft toy and bedtime story','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🧸','Family scavenger-hunt kit','Kids','A fun, hands-on gift for kids to enjoy beyond Christmas Day.'],
    ['🎟️','Restaurant gift voucher','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Concert tickets','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Theatre tickets','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Cinema gold-class tickets','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Cooking class','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Pottery workshop','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Wine-free tasting experience','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Family zoo pass','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Aquarium tickets','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Escape room booking','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Indoor skydiving session','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Go-karting session','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','High tea for two','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Day spa voucher','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Massage voucher','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Photography session','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Surf lesson','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Kayak hire','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Stand-up paddleboard lesson','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Paint-and-sip class','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Comedy show tickets','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Museum membership','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Wildlife park encounter','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Mini-golf family pass','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Bowling night voucher','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Picnic hamper experience','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Scenic train ride','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Weekend breakfast voucher','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Adventure ropes course','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🎟️','Family attraction pass','Experience','Give them something memorable to do, not just something to unwrap.'],
    ['🍫','Artisan chocolate hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Coffee lover hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Tea lover hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Cheese board gift set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Pasta-making kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Pizza-making kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','BBQ rub collection','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Hot sauce sampler','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Olive oil tasting set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Gourmet salt collection','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Baking essentials hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Cookie decorating kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Dessert-making kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Mocktail hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Breakfast hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Picnic food hamper','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Spice collection','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Sourdough starter kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Premium jam set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Honey tasting set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Chocolate fondue set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Cheese-making kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Homemade pasta class kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Gourmet popcorn set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Ice-cream sundae kit','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Charcuterie board set','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Coffee grinder','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Milk frother','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Recipe book bundle','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🍫','Personalised chopping board','Foodie','A delicious pick for someone who loves food, cooking or treats.'],
    ['🎧','Wireless headphones','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Noise-cancelling earbuds','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Portable Bluetooth speaker','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Smartwatch','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Fitness tracker','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Wireless charging stand','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Power bank','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','USB-C charging hub','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Mechanical keyboard','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Wireless mouse','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Laptop stand','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Tablet stand','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Streaming device','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Smart light bulbs','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Digital photo frame','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Mini projector','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Webcam upgrade','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Portable SSD','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','USB microphone','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Gaming headset','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Phone gimbal','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Bluetooth tracker tags','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Smart plug set','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','E-reader','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Portable photo printer','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Car phone mount','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Multi-device charger','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Cable organiser kit','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Desk charging mat','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['🎧','Compact action camera','Tech','A handy tech upgrade for work, home or everyday life.'],
    ['💪','Gym accessories set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Resistance band set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Foam roller','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Massage ball set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Lifting straps','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Weightlifting belt','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Gym backpack','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Insulated shaker bottle','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Yoga mat','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Yoga block set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Pilates ring','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Skipping rope','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Adjustable dumbbells','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Kettlebell','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Workout towel set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Recovery massage gun','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Running belt','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Sports store voucher','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','GPS running watch','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Heart-rate monitor','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Cycling gloves','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Running cap','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Gym gloves','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Mobility band kit','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Protein shaker set','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Training journal','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Home workout sliders','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Balance board','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Stretching strap','Fitness','A practical choice for training, recovery or staying active.'],
    ['💪','Sports duffel bag','Fitness','A practical choice for training, recovery or staying active.'],
    ['🏠','Plant and stylish pot','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Scented candle set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Diffuser set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Throw blanket','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Cushion set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Serving platter','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Cheese board','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Decorative vase','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Table lamp','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Bedside lamp','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Indoor herb garden','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Wall art print','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Photo frame set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Luxury towel set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Premium bedsheet set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Kitchen canister set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Coffee table book','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Serving bowl set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Picnic basket','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Outdoor lantern','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Cushioned picnic rug','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Smart light set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Houseplant care kit','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Decorative storage baskets','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Tea towel set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Coaster set','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Clock','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Entryway organiser','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Laundry hamper','Home','A stylish or useful upgrade for their home.'],
    ['🏠','Christmas table centrepiece','Home','A stylish or useful upgrade for their home.'],
    ['🛠️','Quality tool upgrade','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Multi-tool','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Socket set','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Car emergency kit','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Tyre inflator','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Portable jump starter','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Work lunch cooler','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Travel organiser','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Packing cube set','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Durable backpack','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Laptop bag','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Wallet','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Key organiser','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Rechargeable torch','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Headlamp','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Toolbox organiser','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Battery charger','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Work gloves','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Insulated lunch box','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Portable air compressor','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Car vacuum','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Boot organiser','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Cordless screwdriver','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Tape measure set','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Travel adaptor','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','First-aid kit','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Umbrella','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Reusable shopping bag set','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Shoe-care kit','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🛠️','Everyday carry pouch','Practical','A genuinely useful gift they can put to work straight away.'],
    ['🏕️','Beach picnic kit','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Camping lantern','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Camping chair','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Portable hammock','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Insulated cooler','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Picnic rug','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Camping cookware set','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Head torch','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Hiking daypack','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Dry bag','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Beach umbrella','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Beach games set','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Fishing tackle box','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Fishing rod combo','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Portable camp table','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Reusable picnic set','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Outdoor speaker','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Binoculars','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Bird-watching guide','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Garden starter kit','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Gardening tool set','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Raised herb planter','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Outdoor fire-pit tool set','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Camping pillow','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Sleeping bag','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Camp coffee maker','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Waterproof picnic blanket','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Portable shade shelter','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
    ['🏕️','Trail walking poles','Outdoors','Great for camping, the beach, the garden or weekend adventures.'],
  ];
  IDEAS.splice(0, IDEAS.length, ...CHRISTMAS_GIFT_IDEAS);

  if (typeof gifts === 'function' && !window.__christmasGiftIdeasWrapped) {
    window.__christmasGiftIdeasWrapped = true;
    const originalGifts = gifts;
    gifts = function(){
      return originalGifts()
        .replace(/Browse 36 gift ideas/g, 'Browse 299 gift ideas')
        .replace(/36 starter ideas/g, '299 gift ideas');
    };
  }
})();

/* Christmas HQ — Checklist links + My Christmas Music */
(() => {
  'use strict';

  // ---------- Checklist navigation fix ----------
  document.addEventListener('click', event => {
    if (typeof ui === 'undefined' || ui.tab !== 'home') return;

    const taskRow = event.target.closest('.item');
    if (
      taskRow &&
      taskRow.querySelector('[data-action="taskToggle"]') &&
      !event.target.closest('input,button,a,label')
    ) {
      go('plan', 'Checklist');
      return;
    }

    const metric = event.target.closest('.metric');

if (metric) {
  const text = metric.textContent || '';

  if (/Tasks done/i.test(text)) {
    go('plan', 'Checklist');
    return;
  }

  if (/Gifts bought/i.test(text)) {
    go('gifts', 'My gifts');
    return;
  }

  if (/Budget left/i.test(text)) {
    go('plan', 'Budget');
    return;
  }
}
  });

  // ---------- My Christmas Music ----------
  const DB_NAME = 'christmas-hq-media-v1';
  const STORE = 'songs';
  let songUrls = [];
  function familyMusicCloud() {
  return window.ChristmasHQFamilyCloud || null;
}

function familyMusicReady() {
  const cloud = familyMusicCloud();

  return !!(
    cloud &&
    cloud.client &&
    cloud.session &&
    cloud.familyId
  );
}

  function openSongDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function listSongs() {
  if (!familyMusicReady()) {
    const db = await openSongDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();

      req.onsuccess = () => {
        const songs = (req.result || []).sort((a, b) =>
          String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
        );

        resolve(songs);
      };

      req.onerror = () => reject(req.error);
    });
  }

  const cloud = familyMusicCloud();
  const client = cloud.client;

  const { data, error } = await client
    .from('family_music')
    .select('*')
    .eq('family_id', cloud.familyId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const songs = await Promise.all(
    (data || []).map(async row => {
      let signedUrl = '';

      if (row.storage_path) {
        const { data: signed, error: signedError } =
          await client.storage
            .from('family-music')
            .createSignedUrl(row.storage_path, 3600);

        if (!signedError) {
          signedUrl = signed?.signedUrl || '';
        }
      }

      return {
        id: row.id,
        title: row.title,
        artist: row.artist,
        url: row.external_url || signedUrl,
        cloudAudio: !!row.storage_path,
        storagePath: row.storage_path,
        createdAt: row.created_at
      };
    })
  );

  return songs;
}

  async function saveSong(song) {
  if (!familyMusicReady()) {
    const db = await openSongDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(song);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  const cloud = familyMusicCloud();
  const client = cloud.client;
  const familyId = cloud.familyId;
  const userId = cloud.session.user.id;

  let storagePath = null;

  if (song.file instanceof Blob) {
    const extension =
      String(song.fileName || 'song.mp3')
        .split('.')
        .pop()
        .replace(/[^a-zA-Z0-9]/g, '') || 'mp3';

    storagePath =
      familyId + '/' +
      Date.now() + '-' +
      Math.random().toString(36).slice(2, 9) +
      '.' + extension;

    const { error: uploadError } = await client.storage
      .from('family-music')
      .upload(storagePath, song.file, {
        contentType: song.file.type || 'audio/mpeg',
        upsert: false
      });

    if (uploadError) throw uploadError;
  }

  const { error } = await client
    .from('family_music')
    .insert({
      family_id: familyId,
      title: song.title,
      artist: song.artist || '',
      storage_path: storagePath,
      external_url: song.url || null,
      mime_type: song.file?.type || '',
      size_bytes: song.file?.size || 0,
      created_by: userId
    });

  if (error) {
    if (storagePath) {
      await client.storage
        .from('family-music')
        .remove([storagePath]);
    }

    throw error;
  }
}

  async function deleteSong(id) {
  if (!familyMusicReady()) {
    const db = await openSongDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  const cloud = familyMusicCloud();
  const client = cloud.client;

  const { data: song, error: loadError } = await client
    .from('family_music')
    .select('storage_path')
    .eq('id', id)
    .eq('family_id', cloud.familyId)
    .single();

  if (loadError) throw loadError;

  if (song?.storage_path) {
    const { error: storageError } = await client.storage
      .from('family-music')
      .remove([song.storage_path]);

    if (storageError) throw storageError;
  }

  const { error } = await client
    .from('family_music')
    .delete()
    .eq('id', id)
    .eq('family_id', cloud.familyId);

  if (error) throw error;
}

  function musicScreen() {
    return `
      <div class="card" style="background:#f2f6ed">
        <h3>🎵 My Christmas music</h3>
        <p class="muted-note">
          Add your own Christmas song from your phone, or paste a Suno, YouTube,
          Spotify or other music link.
        </p>
      </div>

      <form class="card form" id="christmasSongForm">
        <h3>Add my song</h3>

        <label>
          Song title
          <input class="field" name="title" maxlength="100"
            placeholder="e.g. Christmas on the Red Dirt" required>
        </label>

        <label>
          Artist / who made it
          <input class="field" name="artist" maxlength="80"
            placeholder="e.g. Troy / Voltocrew">
        </label>

        <label>
          Upload an audio file
          <input class="field" type="file" name="audio"
            accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg">
        </label>

        <div style="text-align:center;font-weight:900;color:#829087">OR</div>

        <label>
          Paste a music link
          <input class="field" name="url" type="url"
            placeholder="https://...">
        </label>

        <button class="btn full" type="submit">🎵 Add to Christmas HQ</button>

        <p class="muted-note">
  Songs added here are shared with your Family Christmas HQ so everyone in your family can see and play them.
</p>
      </form>

      ${line('My Christmas songs')}
      <div id="christmasSongList">
        <div class="empty">
          <div class="big">🎶</div>
          <b>Loading your songs...</b>
        </div>
      </div>`;
  }

  async function refreshSongList() {
    const target = document.getElementById('christmasSongList');
    if (!target) return;

    songUrls.forEach(url => URL.revokeObjectURL(url));
    songUrls = [];

    try {
      const songs = await listSongs();

      if (!songs.length) {
        target.innerHTML = empty(
          '🎶',
          'Your Christmas playlist starts here',
          'Upload your own song or paste a music link above.'
        );
        return;
      }

      target.innerHTML = songs.map(song => {
        let player = '';

        if (song.file instanceof Blob) {
  const objectUrl = URL.createObjectURL(song.file);
  songUrls.push(objectUrl);

  player = `
    <audio controls preload="metadata"
      style="width:100%;margin-top:10px"
      src="${objectUrl}"></audio>`;

} else if (song.cloudAudio && song.url) {
  player = `
    <audio controls preload="metadata"
      style="width:100%;margin-top:10px"
      src="${esc(song.url)}"></audio>`;

} else if (song.url) {
  player = `
    <a class="btn small alt"
      style="margin-top:10px;text-decoration:none"
      href="${esc(song.url)}"
      target="_blank"
      rel="noopener">
      ▶ Open song
    </a>`;
}

        return `
          <div class="card">
            <div style="display:flex;gap:11px;align-items:flex-start">
              <span class="item-icon">🎵</span>

              <div style="flex:1;min-width:0">
                <b style="display:block;color:var(--forest);font-size:16px">
                  ${esc(song.title)}
                </b>
                <small class="muted">
                  ${esc(song.artist || 'My Christmas song')}
                </small>
                ${player}
              </div>

              <button class="icon-action" type="button"
                data-song-delete="${esc(song.id)}"
                aria-label="Delete song">×</button>
            </div>
          </div>`;
      }).join('');
    } catch (err) {
      target.innerHTML = `
        <div class="callout">
          Could not open the music library on this device.
        </div>`;
      console.warn('Christmas HQ music library error', err);
    }
  }

  if (typeof magic === 'function' && !window.__christmasMusicWrapped) {
    window.__christmasMusicWrapped = true;
    const originalMagic = magic;

    magic = function() {
      const tabs = ['Advent', 'Activities', 'Movie night', 'Music', 'Santa letter'];

      if (ui.sub.magic === 'Music') {
        return (
          bigheading(
            'YOUR CHRISTMAS SOUNDTRACK',
            'Christmas music',
            'Add your own songs and build a soundtrack for the season.'
          ) +
          subnav('magic', tabs) +
          musicScreen()
        );
      }

      let html = originalMagic();

      const santaMarker =
        '<button data-action="sub" data-tab="magic" data-value="Santa letter"';

      const musicButton =
        '<button data-action="sub" data-tab="magic" data-value="Music" ' +
        'class="">🎵 Music</button>';

      if (!html.includes('data-value="Music"')) {
        html = html.replace(santaMarker, musicButton + santaMarker);
      }

      return html;
    };
  }

  if (typeof render === 'function' && !window.__christmasMusicRenderWrapped) {
    window.__christmasMusicRenderWrapped = true;
    const originalRender = render;

    render = function(top = true) {
      originalRender(top);

      if (ui.tab === 'magic' && ui.sub.magic === 'Music') {
        setTimeout(refreshSongList, 0);
      }
    };
  }

  document.addEventListener('submit', async event => {
    if (event.target.id !== 'christmasSongForm') return;

    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const artist = String(data.get('artist') || '').trim();
    const url = String(data.get('url') || '').trim();
    const file = form.elements.audio?.files?.[0] || null;

    if (!file && !url) {
      notice('Choose an audio file or paste a music link');
      return;
    }

    if (file && file.size > 40 * 1024 * 1024) {
      notice('That audio file is over 40 MB. Choose a smaller file.');
      return;
    }

    try {
      await saveSong({
        id: 'song_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        title,
        artist,
        url: file ? '' : url,
        file: file || null,
        fileName: file?.name || '',
        createdAt: new Date().toISOString()
      });

      form.reset();
      await refreshSongList();
      notice('Christmas song added 🎵');
    } catch (err) {
      console.warn(err);
      notice('Could not save that song on this device');
    }
  });

  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-song-delete]');
    if (!button) return;

    if (!confirm('Remove this song from Christmas HQ?')) return;

    try {
      await deleteSong(button.dataset.songDelete);
      await refreshSongList();
      notice('Song removed');
    } catch (err) {
      console.warn(err);
      notice('Could not remove that song');
    }
  });
})();
/* Christmas HQ — navigation safety net */
(() => {
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.nav) {
      event.preventDefault();
      event.stopImmediatePropagation();
      go(button.dataset.nav);
      return;
    }

    const action = button.dataset.action;

    if (action === 'sub') {
  event.preventDefault();
  event.stopImmediatePropagation();

  const tab = button.dataset.tab;
  const sub = button.dataset.value;

  rememberNav();
  ui.tab = tab;
  ui.recipe = '';
  ui.sub[tab] = sub;

  render(true);
  return;
}

    if (action === 'shortcut') {
      event.preventDefault();
      event.stopImmediatePropagation();
      go(button.dataset.target);
      return;
    }

    if (action === 'familyOpen') {
      event.preventDefault();
      event.stopImmediatePropagation();
      ui.editFamilyId = '';
      go('plan', 'Family');
      return;
    }

    if (action === 'secretOpen') {
      event.preventDefault();
      event.stopImmediatePropagation();
      go('gifts', 'Secret Santa');
      return;
    }

    if (action === 'recipeJump') {
      event.preventDefault();
      event.stopImmediatePropagation();
      go('kitchen', 'Recipes');

      requestAnimationFrame(() => {
        document
          .getElementById('recipeLibrary')
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  }, true);
})();
/* Gifts summary cards — make them work */
document.addEventListener('click', event => {
  if (typeof ui === 'undefined' || ui.tab !== 'gifts') return;

  const metric = event.target.closest('.metric');
  if (!metric) return;

  const text = metric.textContent || '';

  event.preventDefault();

  if (/Estimated cost/i.test(text)) {
    go('plan', 'Budget');
    return;
  }

  if (/Gifts planned/i.test(text)) {
    ui.sub.gifts = 'My gifts';
    render(false);

    requestAnimationFrame(() => {
      const headings = [...document.querySelectorAll('.section-line h2')];
      const target = headings.find(h => /Your gift list/i.test(h.textContent));
      target?.scrollIntoView({ behavior:'smooth', block:'start' });
    });

    return;
  }

  if (/Already bought/i.test(text)) {
    ui.sub.gifts = 'My gifts';
    render(false);

    requestAnimationFrame(() => {
      const headings = [...document.querySelectorAll('.section-line h2')];
      const target = headings.find(h => /Your gift list/i.test(h.textContent));
      target?.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  }
}, true);
/* Christmas HQ — PERSON GIFT LISTS */
(() => {
  if (window.__hqPersonGiftLists) return;
  window.__hqPersonGiftLists = true;

  const previousGiftsScreen = gifts;

  ui.hqGiftPerson = ui.hqGiftPerson || '';

  function hqGiftRecipient(gift) {
    if (gift.recipientId) {
      const member = familyById(gift.recipientId);
      if (member) return member.name;
    }

    return String(gift.recipient || 'Unassigned').trim() || 'Unassigned';
  }

  function hqGiftItem(gift) {
  function hqGiftItem(gift) {
  const hasLink =
    /^https?:\/\//i.test(
      String(gift.shoppingUrl || '')
    );

  return `
    <div class="hq-person-gift-card ${gift.bought ? 'bought' : ''}">

      <div class="hq-gift-card-top">

        <label class="hq-gift-bought">
          <input
            type="checkbox"
            data-action="giftToggle"
            data-id="${esc(gift.id)}"
            ${gift.bought ? 'checked' : ''}>

          <span>
            ${gift.bought ? '✓ Bought' : 'Still shopping'}
          </span>
        </label>

        <button
          type="button"
          class="hq-gift-edit-main"
          data-hq-gift-edit="${esc(gift.id)}">
          ✎ Edit
        </button>

      </div>

      <button
        type="button"
        class="hq-gift-main-info"
        data-hq-gift-edit="${esc(gift.id)}">

        <span class="hq-gift-present">🎁</span>

        <span class="hq-gift-details">
          <strong>${esc(gift.name)}</strong>
          <small>${currency(gift.price)}</small>
        </span>

        <span class="hq-gift-arrow">›</span>
      </button>

      <div class="hq-gift-tools">

        ${
          hasLink
            ? `
              <a
                class="hq-gift-tool"
                href="${esc(gift.shoppingUrl)}"
                target="_blank"
                rel="noopener">
                🔗 Link
              </a>
            `
            : `
              <button
                type="button"
                class="hq-gift-tool"
                data-hq-gift-edit="${esc(gift.id)}">
                🔗 Add link
              </button>
            `
        }

        <button
          type="button"
          class="hq-gift-tool ${gift.shoppingNotes ? 'has-data' : ''}"
          data-hq-gift-edit="${esc(gift.id)}">
          📝 Notes
        </button>

        <button
          type="button"
          class="hq-gift-tool ${gift.barcode ? 'has-data' : ''}"
          data-hq-gift-edit="${esc(gift.id)}">
          📷 Scan
        </button>

        <button
          type="button"
          class="hq-gift-tool delete"
          data-action="giftDelete"
          data-id="${esc(gift.id)}">
          🗑
        </button>

      </div>

      ${
        gift.shoppingNotes
          ? `
            <div class="hq-gift-note-preview">
              📝 ${esc(gift.shoppingNotes)}
            </div>
          `
          : ''
      }

    </div>
  `;
}

  function hqAddGiftForm(person = '') {
    return `
      <form class="card form" data-form="gift">

        ${
          person
            ? `
              <div class="callout">
                Adding a gift for <b>${esc(person)}</b>
              </div>

              <input
                type="hidden"
                name="recipient"
                value="${esc(person)}">
            `
            : `
              <label>
                Who is it for?
                <input
                  class="field"
                  name="recipient"
                  list="familyRecipientChoices"
                  placeholder="Choose family or enter a name"
                  required
                  maxlength="80">

                <datalist id="familyRecipientChoices">
                  ${state.family.map(member => `
                    <option value="${esc(member.name)}">
                      ${esc(member.relation || 'Family')}
                    </option>
                  `).join('')}
                </datalist>
              </label>
            `
        }

        <label>
          Gift idea / item
          <input
            class="field"
            name="name"
            placeholder="e.g. A day spa voucher"
            required
            maxlength="100">
        </label>

        <div class="two">
          <label>
            Budget (AUD)
            <input
              class="field"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value="0"
              required>
          </label>

          <label>
            Status
            <select class="field" name="bought">
              <option value="false">Still shopping</option>
              <option value="true">Already bought</option>
            </select>
          </label>
        </div>

        <button type="submit" class="btn full">
          + Save gift
        </button>
      </form>
    `;
  }

  gifts = function () {
    if (ui.sub.gifts !== 'My gifts') {
      return previousGiftsScreen();
    }

    const spent = state.gifts
      .filter(g => g.bought)
      .reduce((total, g) => total + Number(g.price || 0), 0);

    const planned = state.gifts
      .reduce((total, g) => total + Number(g.price || 0), 0);

    let content = `
      <div class="summary" style="margin-top:0">
        <div class="metric">
          <strong>${state.gifts.length}</strong>
          <span>Gifts planned</span>
        </div>

        <div class="metric gold">
          <strong>${currency(planned)}</strong>
          <span>Estimated cost</span>
        </div>

        <div class="metric red">
          <strong>${currency(spent)}</strong>
          <span>Already bought</span>
        </div>
      </div>
    `;

    /* INSIDE ONE PERSON */
    if (ui.hqGiftPerson) {
      const person = ui.hqGiftPerson;

      const personGifts = state.gifts.filter(
        gift =>
          hqGiftRecipient(gift).toLowerCase() ===
          person.toLowerCase()
      );

      content += `
        <button
          type="button"
          class="btn alt"
          data-hq-gifts-back
          style="margin:16px 0">
          ← All gift lists
        </button>

        ${line(
          `${esc(person)}'s gift list`,
          `<span class="pill green">${personGifts.length} gifts</span>`
        )}

        ${hqAddGiftForm(person)}

        <div class="list">
          ${
            personGifts.length
              ? personGifts.map(hqGiftItem).join('')
              : empty(
                  '🎁',
                  'No gifts yet',
                  `Add the first present for ${esc(person)}.`
                )
          }
        </div>
      `;

    /* MAIN GIFTS PAGE */
    } else {
      const people = new Map();

      state.gifts.forEach(gift => {
        const name = hqGiftRecipient(gift);
        const key = name.toLowerCase();

        if (!people.has(key)) {
          people.set(key, {
            name,
            gifts: []
          });
        }

        people.get(key).gifts.push(gift);
      });

      content += `
        ${line('Add a gift')}
        ${hqAddGiftForm()}

        ${line('Your gift list')}

        ${
          people.size
            ? `
              <div class="list">
                ${[...people.values()].map(person => {
                  const total = person.gifts.reduce(
                    (sum, gift) =>
                      sum + Number(gift.price || 0),
                    0
                  );

                  const bought = person.gifts.filter(
                    gift => gift.bought
                  ).length;

                  return `
                    <button
                      type="button"
                      class="family-card"
                      data-hq-gift-person="${esc(person.name)}"
                      style="
                        width:100%;
                        text-align:left;
                        cursor:pointer;
                      ">

                      <div class="family-head">
                        <span class="family-initial">🎁</span>

                        <div class="item-info">
                          <div class="family-name">
                            ${esc(person.name)}
                          </div>

                          <div class="family-meta">
                            ${person.gifts.length} gifts ·
                            ${bought} bought ·
                            ${currency(total)}
                          </div>
                        </div>

                        <span
                          style="
                            font-size:28px;
                            color:#154f3d;
                            font-weight:900;
                          ">
                          ›
                        </span>
                      </div>
                    </button>
                  `;
                }).join('')}
              </div>
            `
            : empty(
                '🎁',
                'Your list starts here',
                'Add the first present or browse the gift idea library.'
              )
        }

        <div style="margin-top:14px">
          <button
            class="btn alt full"
            data-action="sub"
            data-tab="gifts"
            data-value="Gift ideas">
            Browse 200 gift ideas →
          </button>
        </div>
      `;
    }

    return (
      bigheading(
        'SANTA’S GIFT WORKSHOP',
        'Gifts without the guesswork',
        'Get organised, find inspiration and keep track of every present.'
      ) +
      subnav(
        'gifts',
        ['My gifts', 'Gift ideas', 'Secret Santa']
      ) +
      content
    );
  };

  document.addEventListener('click', event => {
    const personButton =
      event.target.closest('[data-hq-gift-person]');

    if (personButton) {
      ui.hqGiftPerson =
        personButton.dataset.hqGiftPerson || '';

      render(true);
      return;
    }

    const backButton =
      event.target.closest('[data-hq-gifts-back]');

    if (backButton) {
      ui.hqGiftPerson = '';
      render(true);
    }
  });
})();
/* Christmas HQ — ADVANCED GIFT EDITOR */
(() => {
  if (window.__hqAdvancedGiftEditor) return;
  window.__hqAdvancedGiftEditor = true;

  const previousGiftPage = gifts;

  ui.hqEditGiftId = ui.hqEditGiftId || '';

  function hqGiftPersonName(gift) {
    if (gift?.recipientId) {
      const member = familyById(gift.recipientId);
      if (member) return member.name;
    }

    return String(gift?.recipient || 'Gift list');
  }

  function hqSafeGiftUrl(value) {
    let url = String(value || '').trim();
    if (!url) return '';

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      const parsed = new URL(url);

      if (
        parsed.protocol !== 'http:' &&
        parsed.protocol !== 'https:'
      ) {
        return '';
      }

      return parsed.href;
    } catch (_) {
      return '';
    }
  }

  gifts = function () {
    if (!ui.hqEditGiftId) {
      return previousGiftPage();
    }

    const gift = state.gifts.find(
      item => item.id === ui.hqEditGiftId
    );

    if (!gift) {
      ui.hqEditGiftId = '';
      return previousGiftPage();
    }

    const person = hqGiftPersonName(gift);
    const shopUrl = hqSafeGiftUrl(gift.shoppingUrl);

    return (
      bigheading(
        'SANTA’S GIFT WORKSHOP',
        'Edit gift',
        `Update the present for ${person}.`
      ) +

      subnav(
        'gifts',
        ['My gifts', 'Gift ideas', 'Secret Santa']
      ) +

      `
      <button
        type="button"
        class="btn alt"
        data-hq-gift-edit-close
        style="margin-bottom:14px">
        ← Back to ${esc(person)}'s gifts
      </button>

      <form
        class="card form"
        data-hq-gift-edit-form>

        <h3>🎁 Edit gift details</h3>

        <label>
          Gift / item
          <input
            class="field"
            name="name"
            maxlength="120"
            required
            value="${esc(gift.name || '')}">
        </label>

        <div class="two">
          <label>
            Budget / price (AUD)
            <input
              class="field"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value="${Number(gift.price || 0)}">
          </label>

          <label>
            Status
            <select class="field" name="bought">
              <option
                value="false"
                ${gift.bought ? '' : 'selected'}>
                Still shopping
              </option>

              <option
                value="true"
                ${gift.bought ? 'selected' : ''}>
                Already bought
              </option>
            </select>
          </label>
        </div>

        <label>
          🛒 Product / shop link
          <input
            class="field"
            name="shoppingUrl"
            type="url"
            inputmode="url"
            placeholder="https://..."
            value="${esc(gift.shoppingUrl || '')}">
        </label>

        ${
          shopUrl
            ? `
              <a
                class="btn alt full"
                href="${esc(shopUrl)}"
                target="_blank"
                rel="noopener">
                🔗 Open saved shopping link
              </a>
            `
            : ''
        }

        <label>
          📝 Shopping notes
          <textarea
            class="field"
            name="shoppingNotes"
            rows="5"
            maxlength="1000"
            placeholder="Size, colour, where you saw it, sale price, ideas while shopping...">${esc(gift.shoppingNotes || '')}</textarea>
        </label>

        <label>
          🏷️ Barcode
          <input
            class="field"
            name="barcode"
            inputmode="numeric"
            maxlength="120"
            placeholder="Scan or enter barcode"
            value="${esc(gift.barcode || '')}">
        </label>

        <button
          type="button"
          class="btn alt full"
          data-hq-scan-barcode>
          📷 Scan barcode
        </button>

        <button
          type="submit"
          class="btn full">
          ✓ Save changes
        </button>

        <button
          type="button"
          class="btn warn full"
          data-hq-gift-editor-delete>
          🗑 Delete this gift
        </button>

      </form>
      `
    );
  };

  document.addEventListener('click', event => {
    const editButton =
      event.target.closest('[data-hq-gift-edit]');

    if (editButton) {
      event.preventDefault();

      ui.hqEditGiftId =
        editButton.dataset.hqGiftEdit || '';

      render(true);
      return;
    }

    if (
      event.target.closest(
        '[data-hq-gift-edit-close]'
      )
    ) {
      event.preventDefault();

      ui.hqEditGiftId = '';
      render(true);
      return;
    }

    if (
      event.target.closest(
        '[data-hq-gift-editor-delete]'
      )
    ) {
      event.preventDefault();

      const gift = state.gifts.find(
        item => item.id === ui.hqEditGiftId
      );

      if (
        gift &&
        confirm(`Delete "${gift.name}"?`)
      ) {
        state.gifts = state.gifts.filter(
          item => item.id !== gift.id
        );

        ui.hqEditGiftId = '';

        persist('Gift deleted');
      }
    }
  }, true);

  document.addEventListener(
    'submit',
    event => {
      const form =
        event.target.closest(
          '[data-hq-gift-edit-form]'
        );

      if (!form) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const gift = state.gifts.find(
        item => item.id === ui.hqEditGiftId
      );

      if (!gift) return;

      const data =
        Object.fromEntries(
          new FormData(form)
        );

      gift.name =
        String(data.name || '').trim();

      gift.price =
        Math.max(
          0,
          Number(data.price) || 0
        );

      gift.bought =
        data.bought === 'true';

      gift.shoppingUrl =
        hqSafeGiftUrl(
          data.shoppingUrl
        );

      gift.shoppingNotes =
        String(
          data.shoppingNotes || ''
        ).trim();

      gift.barcode =
        String(
          data.barcode || ''
        ).trim();

      ui.hqEditGiftId = '';

      persist('Gift updated');
    },
    true
  );
})();
/* Christmas HQ — BARCODE SCANNER */
(() => {
  if (window.__hqBarcodeScanner) return;
  window.__hqBarcodeScanner = true;

  let hqBarcodeReader = null;
  let hqBarcodeTarget = null;

  async function hqCloseBarcodeScanner() {
    const modal = document.getElementById('hqBarcodeModal');

    if (hqBarcodeReader) {
      try {
        await hqBarcodeReader.stop();
      } catch (_) {}

      try {
        await hqBarcodeReader.clear();
      } catch (_) {}

      hqBarcodeReader = null;
    }

    hqBarcodeTarget = null;
    modal?.remove();
  }

  async function hqOpenBarcodeScanner(target) {
    if (typeof Html5Qrcode === 'undefined') {
      notice('Barcode scanner is still loading. Try again in a moment.');
      return;
    }

    await hqCloseBarcodeScanner();

    hqBarcodeTarget = target;

    const modal = document.createElement('div');
    modal.id = 'hqBarcodeModal';

    modal.innerHTML = `
      <div class="hq-barcode-sheet">
        <div class="hq-barcode-head">
          <div>
            <b>📷 Scan product barcode</b>
            <small>Point the rear camera at the barcode.</small>
          </div>

          <button
            type="button"
            class="icon-action"
            data-hq-barcode-close
            aria-label="Close scanner">
            ×
          </button>
        </div>

        <div id="hqBarcodeReader"></div>

        <p class="muted-note">
          Keep the barcode inside the camera box and hold the phone steady.
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    hqBarcodeReader =
      new Html5Qrcode('hqBarcodeReader');

    try {
      await hqBarcodeReader.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: (width, height) => ({
            width: Math.min(width * 0.88, 360),
            height: Math.min(height * 0.36, 150)
          })
        },
        async decodedText => {
          if (hqBarcodeTarget) {
            hqBarcodeTarget.value = decodedText;

            hqBarcodeTarget.dispatchEvent(
              new Event('input', {
                bubbles: true
              })
            );
          }

          await hqCloseBarcodeScanner();

          notice('Barcode scanned');
        },
        () => {}
      );

    } catch (error) {
      await hqCloseBarcodeScanner();

      notice(
        'Camera could not start. Check camera permission and try again.'
      );
    }
  }

  document.addEventListener('click', event => {
    const scanButton =
      event.target.closest('[data-hq-scan-barcode]');

    if (scanButton) {
      event.preventDefault();

      const form =
        scanButton.closest(
          '[data-hq-gift-edit-form]'
        );

      const input =
        form?.querySelector(
          '[name="barcode"]'
        );

      if (input) {
        hqOpenBarcodeScanner(input);
      }

      return;
    }

    if (
      event.target.closest(
        '[data-hq-barcode-close]'
      ) ||
      event.target.id === 'hqBarcodeModal'
    ) {
      event.preventDefault();

      hqCloseBarcodeScanner();
    }
  }, true);

  const style =
    document.createElement('style');

  style.textContent = `
    #hqBarcodeModal{
      position:fixed;
      inset:0;
      z-index:9999;
      display:flex;
      align-items:flex-end;
      justify-content:center;

      padding:
        20px
        14px
        calc(20px + env(safe-area-inset-bottom));

      background:rgba(2,20,16,.76);
      backdrop-filter:blur(8px);
    }

    .hq-barcode-sheet{
      width:min(100%,540px);
      max-height:88dvh;
      overflow:auto;

      border-radius:24px;
      background:#fffefa;
      padding:17px;

      box-shadow:
        0 24px 70px rgba(0,0,0,.38);
    }

    .hq-barcode-head{
      display:flex;
      align-items:flex-start;
      gap:12px;
      margin-bottom:14px;
    }

    .hq-barcode-head > div{
      flex:1;
      min-width:0;
    }

    .hq-barcode-head b{
      display:block;
      color:#103b31;
      font-size:18px;
    }

    .hq-barcode-head small{
      display:block;
      color:#6c776e;
      margin-top:3px;
    }

    #hqBarcodeReader{
      overflow:hidden;
      border:2px solid #c4984d;
      border-radius:18px;
      background:#0b1512;
    }

    #hqBarcodeReader video{
      width:100%!important;
      border-radius:15px;
    }
  `;

  document.head.appendChild(style);
})();
