/* Christmas HQ — compact home + recipe showcase v3 */
(() => {
'use strict';
const css=`
.container{padding-top:12px!important}
.summary{margin-top:8px!important}
.section-line{margin-top:15px!important;margin-bottom:9px!important}
.quick-grid{gap:8px!important}
.tap-card{min-height:112px!important;padding:13px!important;gap:5px!important}
.tap-card .big{font-size:28px!important}
.card{margin-bottom:9px!important}
.hq-recipe-showcase{width:100%;aspect-ratio:3/2;object-fit:cover;display:block;border-radius:18px;margin:4px 0 12px;box-shadow:0 8px 24px #17352520}
.recipe-grid{gap:8px!important}
.recipe-card{padding:8px!important;gap:4px!important;min-height:0!important;border-radius:14px!important}
.hq-real-food-photo{height:104px!important;border-radius:11px!important}
.recipe-card b{font-size:15px!important}.recipe-card small{font-size:12px!important}.recipe-card .open{font-size:12px!important}
@media(max-width:430px){.container{padding-left:12px!important;padding-right:12px!important}.hq-real-food-photo{height:98px!important}}
`;
if(!document.getElementById('hq-compact-v3')){const s=document.createElement('style');s.id='hq-compact-v3';s.textContent=css;document.head.appendChild(s)}
function add(){const g=document.querySelector('.recipe-grid');if(!g||document.querySelector('.hq-recipe-showcase'))return;const i=document.createElement('img');i.className='hq-recipe-showcase';i.src='./christmas-food.webp?v=1';i.alt='Christmas recipe collection';g.parentNode.insertBefore(i,g)}
new MutationObserver(add).observe(document.documentElement,{childList:true,subtree:true});add();
})();