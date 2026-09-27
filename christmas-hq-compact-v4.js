/* Christmas HQ — Compact Home + Recipe Tiles v4
   No image files. No recipe insertion. Layout only.
*/
(() => {
  'use strict';
  const css=`
/* HOME: target the current Festive Live home classes */
.mast[data-hq-page="home"] + .container{padding-top:12px!important}
.mast[data-hq-page="home"] + .container .summary{margin-top:0!important;gap:7px!important}
.mast[data-hq-page="home"] + .container .metric{min-height:68px!important;padding:9px 8px!important}
.mast[data-hq-page="home"] + .container .metric strong{font-size:20px!important}
.mast[data-hq-page="home"] + .container .metric span{font-size:11.5px!important}
.mast[data-hq-page="home"] + .container .section-line{margin-top:15px!important;margin-bottom:9px!important}
.mast[data-hq-page="home"] + .container .section-line:first-of-type{margin-top:15px!important}
.mast[data-hq-page="home"] + .container .quick-grid{gap:8px!important}
.mast[data-hq-page="home"] + .container .quick-grid .tap-card{
  min-height:116px!important;padding:12px!important;gap:5px!important
}
.mast[data-hq-page="home"] + .container .quick-grid .tap-card .big{font-size:30px!important}
.mast[data-hq-page="home"] + .container .quick-grid .tap-card strong{font-size:15px!important}
.mast[data-hq-page="home"] + .container .quick-grid .tap-card small{font-size:12.5px!important;line-height:1.3!important}

/* RECIPE TILES: compact only; do not add/remove recipe content */
.recipe-grid{gap:8px!important}
.recipe-card{min-height:0!important;padding:8px!important;gap:4px!important;border-radius:14px!important}
.recipe-card .hq-real-food-photo{height:105px!important;border-radius:11px!important}
.recipe-card b{font-size:15px!important;line-height:1.2!important}
.recipe-card small{font-size:12px!important;line-height:1.25!important}
.recipe-card .open{font-size:12px!important;margin-top:4px!important}
.recipe-card .recipe-type{font-size:10.5px!important;padding:3px 6px!important}

@media(max-width:390px){
 .mast[data-hq-page="home"] + .container{padding-left:12px!important;padding-right:12px!important}
 .mast[data-hq-page="home"] + .container .quick-grid .tap-card{min-height:108px!important;padding:10px!important}
 .recipe-card .hq-real-food-photo{height:96px!important}
}
`;
  if(document.getElementById('hqCompactHomeRecipesV4')) return;
  const s=document.createElement('style');
  s.id='hqCompactHomeRecipesV4';
  s.textContent=css;
  document.head.appendChild(s);
})();