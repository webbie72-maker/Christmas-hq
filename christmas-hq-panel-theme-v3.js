/* Christmas HQ — Panel Theme v3
   Fixes: compact premium scenic panels, larger arched-feel Home title,
   compact countdown, no back buttons, mobile-safe sizing.
*/
(()=>{
'use strict';
if(window.__hqPanelThemeV3)return; window.__hqPanelThemeV3=true;

const css=document.createElement('style');
css.id='hqPanelThemeV3Style';
css.textContent=`
.mast{
 position:relative!important;
 min-height:250px!important;
 height:auto!important;
 overflow:hidden!important;
 border-radius:0 0 28px 28px!important;
 background-size:cover!important;
 background-position:center center!important;
 padding:20px 16px 18px!important;
 box-sizing:border-box!important;
 isolation:isolate!important;
}
.mast::after{
 content:""!important;
 position:absolute!important; inset:0!important;
 background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.16) 55%,rgba(0,0,0,.36))!important;
 pointer-events:none!important; z-index:0!important;
}
.mast>*{position:relative!important;z-index:2!important}

/* HOME */
.hq-home-brand{
 width:100%!important;text-align:center!important;
 margin:0 auto!important;padding:0!important;
}
.hq-home-brand .mast-name{
 display:block!important;
 width:100%!important;
 margin:0 auto!important;
 font-family:Georgia,'Times New Roman',serif!important;
 font-size:clamp(48px,13vw,68px)!important;
 font-weight:1000!important;
 line-height:.94!important;
 letter-spacing:-2px!important;
 white-space:nowrap!important;
 color:#fff3d2!important;
 -webkit-text-stroke:1.2px rgba(255,248,220,.72)!important;
 text-shadow:0 3px 0 #b4261d,0 6px 0 #74140f,0 10px 18px rgba(0,0,0,.7)!important;
 transform:perspective(520px) rotateX(-8deg) scaleX(1.08)!important;
 transform-origin:50% 100%!important;
}
.hq-home-brand .hq-catchphrase{
 margin-top:8px!important;
 font-family:Georgia,'Times New Roman',serif!important;
 font-size:13px!important;
 font-style:italic!important;
 font-weight:800!important;
 letter-spacing:.7px!important;
 color:#fff4d6!important;
 text-shadow:0 2px 5px rgba(0,0,0,.8)!important;
}
.hq-brand-flourish{display:none!important}

.hq-home-hero{margin-top:13px!important}
.hq-bottom-row{
 display:flex!important;
 justify-content:center!important;
 align-items:center!important;
 gap:8px!important;
 flex-wrap:nowrap!important;
 width:100%!important;
}
.hq-christmas-countdown{
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 gap:8px!important;
 width:min(290px,calc(100vw - 92px))!important;
 max-width:290px!important;
 min-height:52px!important;
 padding:7px 10px!important;
 box-sizing:border-box!important;
 border-radius:16px!important;
 background:rgba(4,38,31,.82)!important;
 border:1px solid rgba(255,238,186,.28)!important;
 box-shadow:0 7px 18px rgba(0,0,0,.25)!important;
 backdrop-filter:blur(4px)!important;
}
.hq-days-block{gap:6px!important;padding-right:9px!important}
.hq-days-block strong{
 font-size:27px!important;line-height:1!important;color:#fff7df!important
}
.hq-days-block span{
 font-size:7px!important;line-height:1.05!important;
 max-width:58px!important;letter-spacing:.55px!important
}
.hq-clock-block small{font-size:6px!important;letter-spacing:.65px!important}
.hq-clock-block b{font-size:15px!important;letter-spacing:.8px!important}
.hq-home-buttons{display:flex!important;gap:0!important}
.hq-settings-btn{
 display:grid!important;place-items:center!important;
 width:38px!important;height:38px!important;min-width:38px!important;
 padding:0!important;border-radius:12px!important;font-size:17px!important;
 background:rgba(4,38,31,.82)!important
}
.hq-back-btn,.hq-page-back{display:none!important}

/* OTHER PAGE HERO PANELS */
.mast:not([data-hq-page="home"]){
 min-height:220px!important;
 display:flex!important;
 align-items:center!important;
 justify-content:center!important;
 background-position:center center!important;
}
.mast:not([data-hq-page="home"]) .hq-page-brand{
 width:100%!important;
 text-align:center!important;
 margin:0 auto!important;
 padding:0 12px!important;
}
.mast:not([data-hq-page="home"]) .hq-page-title{
 font-family:Georgia,'Times New Roman',serif!important;
 font-size:clamp(39px,10.5vw,56px)!important;
 font-weight:1000!important;
 line-height:.98!important;
 color:#fff3d2!important;
 letter-spacing:-1.4px!important;
 -webkit-text-stroke:1px rgba(255,248,220,.62)!important;
 text-shadow:0 3px 0 #a91e17,0 6px 0 #6e120e,0 10px 18px rgba(0,0,0,.72)!important;
}
.mast:not([data-hq-page="home"]) .hq-page-subbrand{
 margin-top:8px!important;
 font-size:13px!important;
 font-weight:900!important;
 color:#fff5da!important;
 text-shadow:0 2px 6px rgba(0,0,0,.85)!important;
}

/* Keep snow over the scenic image, but never let flakes create page overflow */
.mast .snow,.mast .snowfall,.mast [class*="snow"]{
 max-width:100%!important;
 overflow:hidden!important;
}

@media(max-width:390px){
 .mast{min-height:238px!important;padding:17px 12px 15px!important}
 .hq-home-brand .mast-name{font-size:clamp(44px,12.2vw,55px)!important}
 .hq-christmas-countdown{
   width:min(270px,calc(100vw - 82px))!important;
   padding:6px 8px!important;
 }
 .hq-days-block strong{font-size:24px!important}
 .hq-clock-block b{font-size:14px!important}
 .mast:not([data-hq-page="home"]){min-height:205px!important}
}
`;
document.head.appendChild(css);

function fix(){
 const m=window.mast || document.querySelector('.mast');
 const state=window.ui;
 if(!m)return;
 const page=((state&&state.tab)||m.dataset.hqPage||'home').toLowerCase();
 m.dataset.hqPage=page;
 m.querySelectorAll('.hq-back-btn,.hq-page-back').forEach(b=>b.style.setProperty('display','none','important'));
}
new MutationObserver(()=>requestAnimationFrame(fix))
 .observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-hq-page']});
fix();
})();