/* Christmas HQ Home V10 */
(()=>{if(window.__HQV10)return;window.__HQV10=1;
const st=document.createElement("style");st.textContent=`
.mast[data-hq-page="home"] .hq-v9-home{display:flex!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:50!important}
.mast[data-hq-page="home"] .hq-v9-logo,.mast[data-hq-page="home"] .hq-v9-ribbon,.mast[data-hq-page="home"] .hq-v9-count{display:block!important;visibility:visible!important;opacity:1!important}
.mast[data-hq-page="home"] .hq-v9-spacer{display:block!important}
.mast[data-hq-page="home"] .hq-v9-grid{display:grid!important}
#bottomNav button[data-nav="settings"],.nav button[data-nav="settings"]{display:none!important}`;
document.head.appendChild(st);
function target(){let n=new Date(),y=n.getFullYear(),t=new Date(y,11,25);if(n>t)t=new Date(y+1,11,25);return t}
function tick(){let ms=Math.max(0,target()-new Date()),v=[Math.floor(ms/86400000),Math.floor(ms%86400000/3600000),Math.floor(ms%3600000/60000),Math.floor(ms%60000/1000)];document.querySelectorAll(".hq-v9-num").forEach((e,i)=>e.textContent=String(v[i]||0).padStart(i?2:1,"0"))}
function fix(){if(typeof ui==="undefined"||ui.tab!=="home"||!window.mast)return;mast.dataset.hqPage="home";let h=mast.querySelector(".hq-v9-home");if(!h){h=document.createElement("div");h.className="hq-v9-home";h.innerHTML=`<div class="hq-v9-logo">CHRISTMAS HQ</div><div class="hq-v9-ribbon">Your family Christmas, all in one place</div><div class="hq-v9-spacer"></div><div class="hq-v9-count"><div class="hq-v9-count-title">Christmas Day</div><div class="hq-v9-grid"><div class="hq-v9-unit"><span class="hq-v9-num">0</span><span class="hq-v9-label">Days</span></div><div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Hours</span></div><div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Minutes</span></div><div class="hq-v9-unit"><span class="hq-v9-num">00</span><span class="hq-v9-label">Seconds</span></div></div></div>`;mast.appendChild(h)}tick()}
setInterval(()=>{fix();tick()},1000);new MutationObserver(()=>requestAnimationFrame(fix)).observe(document.documentElement,{subtree:true,childList:true});setTimeout(fix,100);
})();