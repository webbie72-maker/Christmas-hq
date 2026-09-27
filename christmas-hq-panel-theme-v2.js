/* Christmas HQ — Panel Theme v2 layout correction */
(()=>{
'use strict';
if(window.__hqPanelThemeV2)return; window.__hqPanelThemeV2=true;

const css=document.createElement('style');
css.id='hqPanelThemeV2Style';
css.textContent=`
.mast{
 min-height:270px!important;
 background-size:cover!important;
 background-position:center 52%!important;
 padding:18px 16px 14px!important;
}
.hq-home-brand{width:100%!important;text-align:center!important;margin:0!important;padding:0!important}
.hq-home-brand .mast-name{
 display:block!important;width:100%!important;
 font-family:Georgia,'Times New Roman',serif!important;
 font-size:clamp(40px,11vw,58px)!important;
 font-weight:1000!important;line-height:1!important;letter-spacing:-1.5px!important;
 white-space:nowrap!important;
 color:#fff4df!important;
 text-shadow:0 3px 0 #a61912,0 5px 0 #6d100c,0 8px 15px rgba(0,0,0,.72)!important;
 -webkit-text-stroke:1px rgba(255,255,255,.4)!important;
 /* gentle visual curve without distorting the whole header */
 transform:perspective(500px) rotateX(-4deg) scaleX(1.03)!important;
}
.hq-home-brand .hq-catchphrase{margin-top:3px!important;font-size:12px!important}
.hq-home-brand .hq-brand-flourish{display:none!important}

.hq-home-hero{margin-top:8px!important}
.hq-bottom-row{
 display:flex!important;justify-content:center!important;align-items:center!important;
 gap:7px!important;flex-wrap:nowrap!important;width:100%!important
}
.hq-christmas-countdown{
 display:flex!important;align-items:center!important;gap:7px!important;
 width:auto!important;max-width:calc(100% - 48px)!important;
 padding:5px 8px!important;border-radius:11px!important;
 background:rgba(5,30,27,.72)!important
}
.hq-days-block{gap:5px!important;padding-right:7px!important}
.hq-days-block strong{font-size:22px!important}
.hq-days-block span{font-size:6.5px!important;line-height:1.1!important;max-width:50px!important;letter-spacing:.45px!important}
.hq-clock-block small{font-size:5.5px!important;letter-spacing:.45px!important}
.hq-clock-block b{font-size:13px!important;letter-spacing:.6px!important}
.hq-home-buttons{display:flex!important;gap:0!important}
.hq-home-buttons .hq-settings-btn{
 display:grid!important;place-items:center!important;
 width:38px!important;height:38px!important;min-width:38px!important;padding:0!important;
 border-radius:12px!important;font-size:17px!important
}
.hq-home-buttons .hq-back-btn{display:none!important}

/* All non-home panels */
.mast:not([data-hq-page="home"]) .hq-page-brand{
 width:100%!important;text-align:center!important;margin:5px auto 0!important
}
.mast:not([data-hq-page="home"]) .hq-page-title{
 font-family:Georgia,'Times New Roman',serif!important;
 font-size:clamp(38px,10vw,52px)!important;font-weight:1000!important;line-height:1!important;
 color:#fff4df!important;letter-spacing:-1px!important;
 text-shadow:0 3px 0 #a61912,0 5px 0 #6d100c,0 8px 15px rgba(0,0,0,.72)!important
}
.mast:not([data-hq-page="home"]) .hq-page-subbrand{font-size:12px!important;font-weight:900!important}
.mast:not([data-hq-page="home"]) .hq-brand-flourish{display:none!important}
.mast:not([data-hq-page="home"]) .hq-page-back{
 position:absolute!important;right:12px!important;bottom:12px!important;top:auto!important;left:auto!important;
 width:auto!important;min-width:0!important;height:31px!important;
 padding:0 10px!important;border-radius:10px!important;
 font-size:11px!important;font-weight:900!important;z-index:8!important;
 background:rgba(7,34,31,.72)!important
}
@media(max-width:390px){
 .hq-home-brand .mast-name{font-size:36px!important}
 .hq-christmas-countdown{padding:4px 6px!important;gap:5px!important}
 .hq-days-block strong{font-size:20px!important}
 .hq-clock-block b{font-size:12px!important}
}
`;
document.head.appendChild(css);

function fix(){
 if(!window.mast||!window.ui)return;
 const page=(ui.tab||mast.dataset.hqPage||'home').toLowerCase();
 mast.dataset.hqPage=page;
 if(page==='home'){
   mast.querySelector('.hq-back-btn')?.style.setProperty('display','none','important');
 }
}
new MutationObserver(()=>requestAnimationFrame(fix))
 .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-hq-page']});
fix();
})();