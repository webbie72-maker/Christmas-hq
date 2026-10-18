/* Admin-only Home alert: new members / new shared locations. Read-only (uses the existing hq_admin_stats and hq_world_counts RPCs). */
(() => {
'use strict';
if(window.ChristmasHQAdminAlert)return;
const admins=new Set(['7f41d607-bc14-4ba6-83ad-4b92a94be55c','73683ed7-20f5-4fad-a508-1878c78325ff']);
const KEY='christmas-hq-admin-alert-v1:';
const POLL_MS=120000,FOCUS_MIN_MS=15000;
const cloud=()=>window.ChristmasHQFamilyCloud;
const uid=()=>cloud()?.session?.user?.id||'';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let regions=null;try{regions=new Intl.DisplayNames(['en'],{type:'region'});}catch{}
const countryName=c=>{try{return (regions&&c&&regions.of(String(c).toUpperCase()))||String(c||'');}catch{return String(c||'');}};
const locKey=r=>String(r?.city||'').trim().toLowerCase()+'|'+String(r?.country||'').trim().toUpperCase();
let user='',current={users:null,locs:null,shared:null,names:{}},busy=false,lastFetch=0;

function load(id){try{return JSON.parse(localStorage.getItem(KEY+id)||'null')||{};}catch{return {};}}
function save(id,base){try{localStorage.setItem(KEY+id,JSON.stringify(base));}catch{}}

/* Compare current values with this admin's last-seen baseline. First sighting of each value sets the baseline silently. */
function diff(){
 const id=uid();if(!admins.has(id))return null;
 const base=load(id);let changed=false;
 if(current.users!=null){
  if(typeof base.users!=='number'){base.users=current.users;changed=true;}
  else if(current.users<base.users){base.users=current.users;changed=true;}
 }
 if(current.locs){
  if(!Array.isArray(base.locs)){base.locs=current.locs.slice();base.shared=current.shared;changed=true;}
  else if(typeof base.shared!=='number'||current.shared<base.shared){base.shared=current.shared;changed=true;}
 }
 if(changed){base.at=Date.now();save(id,base);}
 const members=current.users!=null&&typeof base.users==='number'?Math.max(0,current.users-base.users):0;
 const seen=new Set(base.locs||[]);
 const fresh=current.locs&&Array.isArray(base.locs)?current.locs.filter(k=>!seen.has(k)):[];
 const moreShares=current.locs&&!fresh.length&&typeof base.shared==='number'?Math.max(0,current.shared-base.shared):0;
 return {members,fresh,moreShares};
}
function markSeen(){
 const id=uid();if(!admins.has(id))return;
 const base=load(id);
 if(current.users!=null)base.users=current.users;
 if(current.locs){base.locs=Array.from(new Set([...(base.locs||[]),...current.locs]));base.shared=current.shared;}
 base.at=Date.now();save(id,base);paint();
}

function ensure(){
 let el=document.getElementById('hqAdminAlert');
 if(!el){
  el=document.createElement('div');el.id='hqAdminAlert';el.hidden=true;
  el.innerHTML='<button type="button" class="hq-admin-alert-open" data-hq-admin-alert-open><span class="hq-admin-alert-tile" aria-hidden="true"><span class="hq-admin-alert-emoji">🎉</span><span class="hq-admin-alert-count"></span></span><span class="hq-admin-alert-text"></span></button><button type="button" class="hq-admin-alert-x" data-hq-admin-alert-dismiss aria-label="Dismiss admin alert">×</button>';
  document.body.appendChild(el);
 }
 return el;
}
function paint(){
 const id=uid();const el=document.getElementById('hqAdminAlert');
 const locked=document.documentElement.classList.contains('hq-pin-locked')||document.body?.classList.contains('hq-pin-locked');
 if(!admins.has(id)||typeof ui==='undefined'||ui.tab!=='home'||locked){if(el){el.hidden=true;el.classList.remove('has-alert');}if(!admins.has(id))el?.remove();return;}
 const d=diff();
 const lines=[];
 if(d&&d.members>0)lines.push('🎉 '+d.members+' new member'+(d.members===1?'':'s'));
 if(d&&d.fresh.length){
  const first=current.names[d.fresh[0]]||'';
  lines.push('🌍 New location'+(d.fresh.length>1?'s':'')+': '+first+(d.fresh.length>1?' +'+(d.fresh.length-1):''));
 }else if(d&&d.moreShares>0)lines.push('🌍 '+d.moreShares+' more location share'+(d.moreShares===1?'':'s'));
 const node=ensure();
 if(!lines.length){node.hidden=true;node.classList.remove('has-alert');return;}
 const count=(d.members||0)+(d.fresh.length||d.moreShares||0);
 const html=lines.map(l=>'<span class="hq-admin-alert-line">'+esc(l)+'</span>').join('');
 const text=node.querySelector('.hq-admin-alert-text');if(text.innerHTML!==html)text.innerHTML=html;
 node.querySelector('.hq-admin-alert-emoji').textContent=d.members>0?'🎉':'🌍';
 const badge=node.querySelector('.hq-admin-alert-count');badge.textContent=count>99?'99+':String(count);
 node.querySelector('[data-hq-admin-alert-open]').setAttribute('aria-label','Admin alert: '+lines.join(', ')+'. Open admin dashboard');
 node.hidden=false;node.classList.add('has-alert');tuck();
}

async function poll(force=false){
 const id=uid(),db=cloud()?.client;
 if(id!==user){user=id;current={users:null,locs:null,shared:null,names:{}};lastFetch=0;}
 paint();
 if(!admins.has(id)||!db||document.hidden||!navigator.onLine||busy)return;
 if(!force&&lastFetch&&Date.now()-lastFetch<POLL_MS)return;
 busy=true;lastFetch=Date.now();
 try{
  const [s,w]=await Promise.allSettled([db.rpc('hq_admin_stats'),db.rpc('hq_world_counts')]);
  if(uid()!==id)return;
  if(s.status==='fulfilled'&&!s.value?.error){const n=Number(s.value?.data?.total_users);if(Number.isFinite(n))current.users=n;}
  if(w.status==='fulfilled'&&!w.value?.error&&Array.isArray(w.value?.data?.locations)){
   const rows=w.value.data.locations.filter(r=>r&&String(r.city||'').trim()&&r.country);
   const names={};const keys=[];let shared=0;
   rows.forEach(r=>{const k=locKey(r);if(!names[k]){keys.push(k);names[k]=String(r.city).trim()+', '+countryName(r.country);}shared+=Number(r.members)||0;});
   current.locs=keys;current.names=names;current.shared=shared;
  }
 }catch{}finally{busy=false;paint();}
}

function openDashboard(){
 markSeen();
 if(typeof go==='function')go('settings');else if(typeof ui!=='undefined'){ui.tab='settings';render(true);}
 const started=Date.now();
 const place=t=>window.scrollTo({top:Math.max(0,t.getBoundingClientRect().top+window.scrollY-14),behavior:'smooth'});
 const seek=()=>{const t=document.getElementById('hqAdminStats');if(t){place(t);setTimeout(()=>{const again=document.getElementById('hqAdminStats');if(again&&Math.abs(again.getBoundingClientRect().top-14)>4)place(again);},700);return;}if(Date.now()-started<6000)setTimeout(seek,150);};
 setTimeout(seek,60);
}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-hq-admin-alert-dismiss]')){e.preventDefault();e.stopPropagation();markSeen();return;}
 if(e.target.closest('[data-hq-admin-alert-open]')){e.preventDefault();e.stopPropagation();openDashboard();}
},true);

const style=document.createElement('style');
style.textContent=[
'#hqAdminAlert{position:fixed;top:calc(12px + env(safe-area-inset-top));left:max(12px,calc((100vw - 580px)/2 + 12px));z-index:75;display:flex;align-items:flex-start;gap:0;max-width:min(calc(100vw - 97px),300px);pointer-events:none}',
'#hqAdminAlert[hidden]{display:none!important}',
'#hqAdminAlert{transition:opacity .18s ease}#hqAdminAlert.hq-admin-alert-tucked{opacity:0;visibility:hidden}#hqAdminAlert.hq-admin-alert-tucked *{pointer-events:none!important}',
'#hqAdminAlert .hq-admin-alert-open{pointer-events:auto;display:flex;align-items:center;gap:7px;min-width:0;margin:0;padding:0;border:0;background:transparent;box-shadow:none;font:inherit;color:#493514;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}',
'#hqAdminAlert .hq-admin-alert-tile{position:relative;flex:0 0 49px;width:49px;height:49px;box-sizing:border-box;border:2px solid #b58429;border-radius:17px;background:#fff1ab;box-shadow:0 4px 0 #92661f,0 5px 15px #103b3130;padding:7px;color:#493514;display:flex;align-items:center;justify-content:center}',
'#hqAdminAlert .hq-admin-alert-emoji{font-size:24px;line-height:1}',
'#hqAdminAlert .hq-admin-alert-count{position:absolute;top:-7px;right:-7px;min-width:20px;height:20px;box-sizing:border-box;border-radius:12px;background:#a41c2e;color:#fff;font-size:10px;font-weight:900;line-height:16px;text-align:center;padding:0 4px;border:2px solid #fff8d5}',
'#hqAdminAlert .hq-admin-alert-text{display:flex;flex-direction:column;justify-content:center;min-width:0;min-height:37px;box-sizing:border-box;padding:5px 24px 5px 9px;border:2px solid #b58429;border-radius:14px;background:#fff1ab;box-shadow:0 3px 0 #92661f,0 5px 15px #103b3130}',
'#hqAdminAlert .hq-admin-alert-line{display:block;font-size:11.5px;font-weight:850;line-height:1.3;color:#493514;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'#hqAdminAlert .hq-admin-alert-x{pointer-events:auto;position:relative;flex:0 0 auto;align-self:center;margin:0 0 0 -25px;width:24px;height:24px;min-height:0;padding:0;border:0;border-radius:12px;background:transparent;box-shadow:none;color:#6b4a14;font-size:18px;font-weight:900;line-height:24px;text-align:center;cursor:pointer}',
'#hqAdminAlert .hq-admin-alert-x::before{content:"";position:absolute;inset:-8px}',
/* Same wiggle as the Home chat bubble (#hqHomeChatBubble.has-unread in family-invitations.js): identical keyframes, 6s ease-in-out infinite, applied to the matching 49px tile. */
'#hqAdminAlert.has-alert .hq-admin-alert-tile{animation:hqChatWiggle 6s ease-in-out infinite}',
'@keyframes hqChatWiggle{0%,17%,100%{transform:rotate(0)}3%,9%{transform:rotate(-9deg)}6%,12%{transform:rotate(9deg)}15%{transform:rotate(-4deg)}}',
'@media(prefers-reduced-motion:reduce){#hqAdminAlert.has-alert .hq-admin-alert-tile{animation:none}}'
].join('\n');
document.head.appendChild(style);

/* Keep clear of the music dock when the page scrolls it up under the fixed alert. */
let tuckFrame=0;
function tuck(){tuckFrame=0;const el=document.getElementById('hqAdminAlert');if(!el||el.hidden)return;const dock=document.getElementById('hqMusicDock');let hit=false;
 if(dock&&dock.offsetParent!==null){const a=el.getBoundingClientRect(),d=dock.getBoundingClientRect();hit=!(a.right<=d.left||a.left>=d.right||a.bottom+6<=d.top||a.top>=d.bottom);}
 el.classList.toggle('hq-admin-alert-tucked',hit);}
window.addEventListener('scroll',()=>{if(!tuckFrame)tuckFrame=requestAnimationFrame(tuck);},{passive:true});
window.addEventListener('resize',()=>{if(!tuckFrame)tuckFrame=requestAnimationFrame(tuck);});
if(typeof render==='function'){const previous=render;render=function(...args){const result=previous.apply(this,args);paint();return result;};}
window.addEventListener('focus',()=>poll(Date.now()-lastFetch>FOCUS_MIN_MS));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll(Date.now()-lastFetch>FOCUS_MIN_MS);});
window.addEventListener('online',()=>poll(true));
setInterval(()=>poll(),3000); /* cheap: only fetches for a signed-in admin, at most every 2 minutes */
poll();
window.ChristmasHQAdminAlert={refresh:()=>poll(true),markSeen};
})();
