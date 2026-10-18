(() => {
 'use strict';
 const owner='7f41d607-bc14-4ba6-83ad-4b92a94be55c';
const admins=new Set([owner,'73683ed7-20f5-4fad-a508-1878c78325ff']);

 const style=document.createElement('style');
 style.textContent=`
 #hqAdminStats.card{padding:12px!important;border:1px solid #c6a34b!important;border-radius:18px!important;background:linear-gradient(145deg,#174f3e,#0b332b)!important;color:#fff5da!important;box-shadow:0 3px 0 #a88129!important;margin-bottom:14px!important;}
 #hqAdminStats .hq-admin-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;}
 #hqAdminStats .hq-admin-title{font-size:15px!important;font-weight:800!important;color:#f4d68a!important;margin:0!important;line-height:1.3!important;}
 #hqAdminStats .hq-admin-private{font-size:10px!important;color:#e5ebdf!important;white-space:nowrap;}
 #hqAdminStats .hq-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;}
 #hqAdminStats .hq-admin-stat{display:flex;align-items:center;gap:8px;padding:9px 10px!important;background:#fff8e6!important;border:1px solid #d8bd76!important;border-radius:11px!important;color:#174c3a!important;min-width:0;}
 #hqAdminStats .hq-admin-icon{font-size:17px!important;line-height:1!important;}
 #hqAdminStats .hq-admin-value{display:block;font-size:23px!important;line-height:1.1!important;color:#174c3a!important;font-weight:800!important;}
 #hqAdminStats .hq-admin-label{display:block;font-size:10px!important;line-height:1.3!important;color:#174c3a!important;margin-top:2px;font-weight:700!important;}
 #hqAdminStats .hq-admin-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px;}
 #hqAdminStats .hq-admin-status{font-size:10px!important;color:#dce8dc!important;}
 #hqAdminStats #hqAdminRefresh{font-family:inherit!important;font-weight:700!important;font-size:11px!important;line-height:1.2!important;color:#174c3a!important;background:#f5dda0!important;border:1px solid #d7b75b!important;border-radius:9px!important;padding:6px 10px!important;min-height:0!important;box-shadow:none!important;margin:0!important;width:auto!important;}
 #hqAdminStats details{font-size:10px!important;color:#dce8dc!important;margin-top:7px!important;}
 #hqAdminStats summary{cursor:pointer;}
 #hqAdminStats details p{font-size:10px!important;color:#dce8dc!important;line-height:1.5!important;margin:6px 0 0!important;}
 `;
 document.head.appendChild(style);
 let cached=null, failed=false, busy=false, lastFetch=0, lastPing=0, previousUser='';
 const cloud=()=>window.ChristmasHQFamilyCloud;
 const uid=()=>cloud()?.session?.user?.id||'';
 function draw(){
  const existing=document.getElementById('hqAdminStats');
  if(!admins.has(uid()) || typeof ui==='undefined' || ui.tab!=='settings'){existing?.remove();return;}
  const host=document.getElementById('screen');
  if(!host)return;
  const card=existing||document.createElement('section');
  card.id='hqAdminStats';card.className='card';
  const labels=[['total_users','Registered users','👥'],['joined_today','Joined today','✨'],['active_now','Active now','🟢'],['total_families','Families created','🏡']];
  const html='<div class="hq-admin-head"><h3 class="hq-admin-title">✦ Admin dashboard</h3><span class="hq-admin-private">🔒 Admins only</span></div><div class="hq-admin-grid">'+labels.map(([key,label,icon])=>'<div class="hq-admin-stat"><span class="hq-admin-icon" aria-hidden="true">'+icon+'</span><div><strong class="hq-admin-value">'+(cached?Number(cached[key]).toLocaleString():'—')+'</strong><span class="hq-admin-label">'+label+'</span></div></div>').join('')+'</div><div class="hq-admin-footer"><span class="hq-admin-status" role="status">'+(failed?'Refresh unavailable':cached?'Updated '+new Date(lastFetch).toLocaleTimeString():'Loading…')+'</span><button type="button" id="hqAdminRefresh">↻ Refresh</button></div><details><summary>About these numbers</summary><p>Today follows Perth time. Active now counts signed-in users seen within five minutes on the updated app.</p></details>';
  if(card.dataset.rendered!==html){card.innerHTML=html;card.dataset.rendered=html;}
  if(!existing)host.prepend(card);
 }
 async function tick(force=false){
  const id=uid(),db=cloud()?.client;
  if(id!==previousUser){cached=null;failed=false;lastFetch=0;lastPing=0;previousUser=id;}
  draw();
  if(!id||!db||document.hidden||!navigator.onLine||busy)return;
  busy=true;
  try{
   if(Date.now()-lastPing>60000){const r=await db.rpc('hq_activity_ping');if(!r.error)lastPing=Date.now();}
   if(admins.has(id)&&typeof ui!=='undefined'&&ui.tab==='settings'&&(force||Date.now()-lastFetch>30000)){
    const result=await db.rpc('hq_admin_stats');
    if(uid()!==id)return;
    if(result.error)failed=true;
    else{cached=result.data;failed=false;lastFetch=Date.now();}
   }
  }catch{failed=true;}finally{busy=false;draw();}
 }
 document.addEventListener('click',e=>{if(e.target.closest('#hqAdminRefresh'))tick(true);});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
 window.addEventListener('online',()=>tick());
 setInterval(()=>tick(),2000);
 tick();
})();

(()=>{
'use strict';
const owner='7f41d607-bc14-4ba6-83ad-4b92a94be55c';
const admins=new Set([owner,'73683ed7-20f5-4fad-a508-1878c78325ff']);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const countries=new Intl.DisplayNames(['en'],{type:'region'});
const options=[];
for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const code=String.fromCharCode(a,b);const name=countries.of(code);if(name&&name!==code)options.push([code,name]);}
options.sort((a,b)=>a[1].localeCompare(b[1]));
let user='',own=null,counts=null,loaded=false,busy=false,updated=0,ownUpdated=0,message='',worldMessage='',refreshQueued=false,keepTopAnchor=null;
const snoozed=new Set();/* "Not now" lasts for this app session only (in memory, per uid) */
const PROMPT_ID='hqLocationPrompt';
const hasLocation=()=>!!(own&&(own.city||own.country));
const tab=()=>typeof ui==='undefined'?'':ui.tab;
const promptStyle=document.createElement('style');
promptStyle.textContent='#hqLocationProfile{scroll-margin-top:84px}#hqLocationProfile.hq-loc-top{border:1px solid #d8bd76!important;box-shadow:0 0 0 3px #f4d68a55!important}#hqLocationProfile.hq-loc-flash{animation:hqLocFlash 1.4s ease}@keyframes hqLocFlash{0%,100%{box-shadow:0 0 0 3px #f4d68a55}35%{box-shadow:0 0 0 6px #e0b54fcc}}'+
'#'+PROMPT_ID+'{margin:12px 0 4px;position:relative;background:linear-gradient(145deg,#fffdf6 0%,#f7f0de 55%,#eaf3e8 100%);border:1px solid #e4d7b4;border-radius:20px;padding:16px 16px 14px;box-shadow:0 8px 28px #2547330b;overflow:hidden}'+
'#'+PROMPT_ID+'::before{content:"✦";position:absolute;right:10px;top:6px;font-size:28px;color:#c4984d;opacity:.55;pointer-events:none}'+
'#'+PROMPT_ID+' .hlp-kicker{font-size:10px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase;color:#9d742e;margin:0 0 6px}'+
'#'+PROMPT_ID+' .hlp-row{display:flex;gap:12px;align-items:flex-start}'+
'#'+PROMPT_ID+' .hlp-icon{width:44px;height:44px;min-width:44px;border-radius:14px;background:#103b31;color:#f4e3b0;display:grid;place-items:center;font-size:22px;box-shadow:0 4px 0 #0b2a22}'+
'#'+PROMPT_ID+' .hlp-copy{flex:1;min-width:0}'+
'#'+PROMPT_ID+' .hlp-copy h3{margin:0 0 4px;font:700 16px Georgia,serif;color:#103b31}'+
'#'+PROMPT_ID+' .hlp-copy p{margin:0;font-size:12px;color:#5f6b61;line-height:1.45}'+
'#'+PROMPT_ID+' .hlp-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}'+
'#'+PROMPT_ID+' .hlp-actions .btn{flex:1;min-width:90px}';
document.head.appendChild(promptStyle);
function blocked(){
 const html=document.documentElement,pin=document.getElementById('hqPinLock'),tour=document.getElementById('hqWelcomeTour');
 if(html.classList.contains('hq-pin-locked')||document.body?.classList.contains('hq-pin-locked'))return true;
 if(pin&&!pin.classList.contains('hqpin-hidden')&&getComputedStyle(pin).display!=='none')return true;
 if(tour&&tour.classList.contains('hqwt-on'))return true;
 return false;
}
function drawPrompt(){
 const id=window.ChristmasHQFamilyCloud?.session?.user?.id||'';
 const existing=document.getElementById(PROMPT_ID);
 const host=document.getElementById('screen');
 if(!id||id!==user||!loaded||hasLocation()||snoozed.has(id)||tab()!=='home'||!host||blocked()){existing?.remove();return;}
 const reminder=host.querySelector(':scope > #hqReminderCard');
 if(existing&&existing.parentElement===host){if(reminder&&existing.nextElementSibling!==reminder)reminder.insertAdjacentElement('beforebegin',existing);return;}
 const card=existing||document.createElement('div');
 card.id=PROMPT_ID;card.setAttribute('role','region');card.setAttribute('aria-label','Add your city');
 card.innerHTML='<div class="hlp-kicker">Welcome · Christmas HQ</div><div class="hlp-row"><div class="hlp-icon" aria-hidden="true">🌍</div><div class="hlp-copy"><h3>Where are you celebrating from?</h3><p>Add your city to the HQ world map. It’s optional and no exact location is shared.</p></div></div><div class="hlp-actions"><button type="button" class="btn small" data-hlp="add">Add my city</button><button type="button" class="btn small alt" data-hlp="later">Not now</button></div>';
 const hero=host.querySelector(':scope > .hero'),summary=host.querySelector(':scope > .summary');
 if(reminder)reminder.insertAdjacentElement('beforebegin',card);
 else if(hero)hero.insertAdjacentElement('afterend',card);
 else if(summary)summary.insertAdjacentElement('beforebegin',card);
 else host.insertAdjacentElement('afterbegin',card);
}
function draw(){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id||'';
 drawPrompt();
 if(tab()!=='settings'||!id){document.getElementById('hqLocationProfile')?.remove();document.getElementById('hqWorldCounts')?.remove();return;}
 const host=document.getElementById('screen');if(!host)return;
 if(!document.getElementById('hqLocationProfile')&&loaded){
 const card=document.createElement('section');card.className='card';card.id='hqLocationProfile';
 const anchor=host.querySelector(':scope > .cloud-card');
 const top=!hasLocation()||(!!keepTopAnchor&&keepTopAnchor===anchor);
 card.innerHTML='<h3>🌍 Your corner of the world</h3><p class="muted-note" style="font-size:13px">'+(top&&!hasLocation()?'Optional: add your city to the HQ world map. Only a city and country are used — no exact location, and no names appear in the tally.':'Optional: share your city and country for the admin’s location tally. No names or exact locations appear in the tally.')+'</p><form id="hqLocationForm"><label>City<input class="field" name="city" maxlength="80" placeholder="e.g. Perth" value="'+escape(own?.city)+'"></label><label>Country<select class="field" name="country"><option value="">Choose country</option>'+options.map(([c,n])=>'<option value="'+c+'" '+(own?.country===c?'selected':'')+'>'+escape(n)+'</option>').join('')+'</select></label><div class="btnrow"><button class="btn" type="submit">Save location</button>'+(hasLocation()?'<button class="btn alt" type="button" id="hqClearLocation">Remove location</button>':'')+'</div><p id="hqLocationStatus" role="status" style="font-size:12px">'+escape(message)+'</p></form>';
 if(top){
  card.classList.add('hq-loc-top');
  if(anchor)anchor.insertAdjacentElement('afterend',card);
  else{const intro=host.querySelector(':scope > .gift-intro');if(intro)intro.insertAdjacentElement('afterend',card);else host.prepend(card);}
 }else host.append(card);
 }
 if(admins.has(id)){
 const admin=document.getElementById('hqAdminStats');if(!admin)return;
 let world=document.getElementById('hqWorldCounts');if(!world){world=document.createElement('section');world.id='hqWorldCounts';world.className='card';world.style.background='#fff8e6';admin.insertAdjacentElement('afterend',world);}
 const html='<div style="border-top:1px solid #b99c55;margin-top:12px;padding-top:10px"><h4 style="font-size:16px;color:#174c3a;margin:0 0 8px">🌍 Members around the world</h4><button type="button" class="btn small alt" id="hqWorldRefresh">↻ Refresh locations</button><p role="status" style="font-size:12px;margin:8px 0">'+escape(worldMessage||(counts?'Updated '+new Date(updated).toLocaleTimeString():'Loading location totals…'))+'</p>'+(counts?'<div style="max-height:240px;overflow:auto"><table style="width:100%;font-size:13px;color:#174c3a;border-collapse:collapse"><thead><tr><th scope="col" style="text-align:left">City / country</th><th scope="col" style="text-align:right">Members</th></tr></thead><tbody>'+counts.locations.map(r=>'<tr><td style="padding:7px 0;border-bottom:1px solid #ffffff20">'+escape(r.city)+', '+escape(countries.of(r.country))+'</td><td style="text-align:right;font-weight:800">'+Number(r.members).toLocaleString()+'</td></tr>').join('')+'<tr><td style="padding-top:8px">Location not shared</td><td style="text-align:right;font-weight:800">'+Number(counts.unshared).toLocaleString()+'</td></tr></tbody></table></div><p style="font-size:10px;color:#526b5c;margin:8px 0 0">Optional member-entered locations · no individual pins</p>':'<p style="font-size:12px">'+escape(worldMessage||'Loading location totals…')+'</p>')+'</div>';
 if(world.innerHTML!==html)world.innerHTML=html;
 }
}
async function refresh(force=false){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id||'';
 if(user!==id){user=id;own=null;counts=null;loaded=false;updated=0;ownUpdated=0;message='';worldMessage='';refreshQueued=false;keepTopAnchor=null;document.getElementById('hqLocationProfile')?.remove();}
 draw();
 const t=tab(),onSettings=t==='settings',onHome=t==='home';
 if(!id||!cloud?.client||(!onSettings&&!onHome)||document.hidden)return;
 if(!navigator.onLine){if(onSettings){worldMessage='You’re offline. Reconnect to refresh location totals.';draw();}return;}
 if(busy){if(force)refreshQueued=true;return;}
 const wantCounts=onSettings&&admins.has(id)&&(force||!updated||Date.now()-updated>=30000);
 const wantOwn=force||!loaded||Date.now()-ownUpdated>=(onSettings?30000:300000);
 if(!wantOwn&&!wantCounts)return;
 busy=true;try{
 const requests=[wantOwn?cloud.client.rpc('hq_member_location'):Promise.resolve(null)];
 if(wantCounts)requests.push(cloud.client.rpc('hq_world_counts'));
 const results=await Promise.allSettled(requests);if(user!==id)return;
 if(wantOwn){const mine=results[0];
  if(mine.status==='fulfilled'&&mine.value&&!mine.value.error){own=mine.value.data;loaded=true;ownUpdated=Date.now();}
  else message='Could not load your saved location. Try again.';
 }
 if(wantCounts){const tally=results[1];
  if(tally.status==='fulfilled'&&!tally.value.error&&Array.isArray(tally.value.data?.locations)){counts=tally.value.data;worldMessage='';}
  else worldMessage='Could not refresh location totals. Tap Refresh locations to retry.';
  updated=Date.now();
 }
 }catch{worldMessage='Could not refresh location totals. Tap Refresh locations to retry.';}
 finally{busy=false;draw();if(refreshQueued){refreshQueued=false;refresh(true);}}
}
async function save(city,country){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id;if(!id)return;
 const form=document.getElementById('hqLocationForm');form?.querySelectorAll('button').forEach(b=>b.disabled=true);
 try{const r=await cloud.client.rpc('hq_member_location',{p_city:city,p_country:country,p_save:true});if(r.error)throw r.error;if(cloud.session?.user?.id!==id)return;
  const card=document.getElementById('hqLocationProfile');
  /* keep the card where it is for this Settings visit so it doesn't jump after saving */
  keepTopAnchor=card&&card.classList.contains('hq-loc-top')?document.querySelector('#screen > .cloud-card'):null;
  own=r.data;loaded=true;ownUpdated=Date.now();message=city?'Location saved.':'Location removed.';card?.remove();await refresh(true);}
 catch{const status=document.getElementById('hqLocationStatus');if(status)status.textContent='Could not save. Check your connection and try again.';}
 finally{form?.querySelectorAll('button').forEach(b=>b.disabled=false);}
}
function openLocationCard(){
 if(typeof go==='function')go('settings');else if(typeof ui!=='undefined'){ui.tab='settings';if(typeof render==='function')render(true);}
 let tries=0;
 const seek=()=>{
  draw();
  const card=document.getElementById('hqLocationProfile');
  if(!card){if(++tries<40)setTimeout(seek,75);return;}
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  card.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  card.classList.remove('hq-loc-flash');void card.offsetWidth;card.classList.add('hq-loc-flash');
  const input=card.querySelector('input[name="city"]');
  if(input)setTimeout(()=>{try{input.focus({preventScroll:true});}catch{input.focus();}},reduce?0:450);
  /* cards added above it a moment later (e.g. the admin dashboard) would push it down: keep it in view for a short while unless the user scrolls */
  let userMoved=false;const stop=()=>{userMoved=true;};
  ['touchstart','wheel','keydown'].forEach(ev=>window.addEventListener(ev,stop,{once:true,passive:true}));
  const started=Date.now();
  const hold=()=>{
   if(userMoved||!card.isConnected||tab()!=='settings')return;
   const top=card.getBoundingClientRect().top;
   if(Date.now()-started>700&&(top>window.innerHeight*0.45||top<0))card.scrollIntoView({behavior:'auto',block:'start'});
   if(Date.now()-started<3500)setTimeout(hold,150);
   else ['touchstart','wheel','keydown'].forEach(ev=>window.removeEventListener(ev,stop));
  };
  setTimeout(hold,150);
 };
 setTimeout(seek,60);
}
document.addEventListener('submit',e=>{if(e.target.id!=='hqLocationForm')return;e.preventDefault();const data=new FormData(e.target),city=String(data.get('city')).trim(),country=String(data.get('country'));if(!city||!country){document.getElementById('hqLocationStatus').textContent='Choose a city and country, or use Remove location.';return;}save(city,country);});
document.addEventListener('click',e=>{
 if(e.target.closest('#hqClearLocation'))save('','');
 if(e.target.closest('#hqAdminRefresh,#hqWorldRefresh'))refresh(true);
 const b=e.target.closest('#'+PROMPT_ID+' [data-hlp]');
 if(b){
  if(b.dataset.hlp==='later'){if(user)snoozed.add(user);document.getElementById(PROMPT_ID)?.remove();}
  else{document.getElementById(PROMPT_ID)?.remove();openLocationCard();}
 }
});
let queued=false;
const quick=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;drawPrompt();});};
const watch=()=>{const s=document.getElementById('screen');if(s)new MutationObserver(quick).observe(s,{childList:true});new MutationObserver(quick).observe(document.documentElement,{attributes:true,attributeFilter:['class']});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
setInterval(()=>refresh(),2000);refresh();
})();

(()=>{const style=document.createElement('style');style.textContent='#screen #hqWorldCounts{background:#fff8e6!important;color:#174c3a!important}#screen #hqWorldCounts h4,#screen #hqWorldCounts th,#screen #hqWorldCounts td,#screen #hqWorldCounts p{color:#174c3a!important}#hqWorldCounts table{margin-top:10px}#hqWorldCounts th,#hqWorldCounts td{padding:8px 4px!important;border-bottom:1px solid #d8dfd2}';document.head.appendChild(style);})();

(()=>{
'use strict';
const admins=new Set(['7f41d607-bc14-4ba6-83ad-4b92a94be55c','73683ed7-20f5-4fad-a508-1878c78325ff']);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const BLOCKED='No reports visible. If you expect some, admin read access may need turning on in Supabase.';
const perth=t=>{try{return new Date(t).toLocaleString('en-AU',{timeZone:'Australia/Perth',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'})+' AWST';}catch{return '';}};
const snip=s=>{s=String(s??'').trim();return s.length>160?s.slice(0,157)+'…':s;};
let user='',rows=null,status='Loading reports…',busy=false,updated=0,queued=false;
const style=document.createElement('style');
style.textContent='#hqAdminReports.card{background:#fff8e6!important;color:#174c3a!important;border:1px solid #d8bd76!important}#hqAdminReports h4{font-size:16px;color:#174c3a!important;margin:0 0 8px}#hqAdminReports .hq-rep{border-top:1px solid #d8dfd2;padding:8px 0;font-size:12px;color:#174c3a!important}#hqAdminReports .hq-rep-type{display:inline-block;font-weight:800;font-size:10px;padding:2px 7px;border-radius:8px;background:#174c3a;color:#fff5da!important;margin-right:6px}#hqAdminReports .hq-rep-type.msg{background:#8a2a2a}#hqAdminReports .hq-rep-text{margin:4px 0;padding:6px 8px;background:#fff;border-left:3px solid #c6a34b;border-radius:6px;white-space:pre-wrap;word-break:break-word}#hqAdminReports .hq-rep-meta{font-size:10px;color:#526b5c!important}#hqAdminReports p{color:#174c3a!important}';
document.head.appendChild(style);
function draw(){
 const id=window.ChristmasHQFamilyCloud?.session?.user?.id||'';
 const existing=document.getElementById('hqAdminReports');
 if(!admins.has(id)||typeof ui==='undefined'||ui.tab!=='settings'){existing?.remove();return;}
 const anchor=document.getElementById('hqWorldCounts')||document.getElementById('hqAdminStats');if(!anchor)return;
 const card=existing||document.createElement('section');card.id='hqAdminReports';card.className='card';
 const list=rows&&rows.length?rows.map(r=>'<div class="hq-rep"><span class="hq-rep-type'+(r.kind==='Message'?' msg':'')+'">'+esc(r.kind)+'</span><strong>'+esc(r.reason||'(no reason)')+'</strong>'+(r.details?'<div>'+esc(r.details)+'</div>':'')+'<div class="hq-rep-text">'+(r.text?esc(r.text):'<em>Reported content not available'+(r.targetId?' (id '+esc(r.targetId)+')':'')+'</em>')+'</div><div class="hq-rep-meta">'+esc(perth(r.created_at))+'</div></div>').join(''):'';
 const html='<h4>🚩 Reports</h4><button type="button" class="btn small alt" id="hqReportsRefresh">↻ Refresh reports</button><p role="status" style="font-size:12px;margin:8px 0">'+esc(status)+'</p><div style="max-height:420px;overflow:auto">'+list+'</div>';
 if(card.dataset.rendered!==html){card.innerHTML=html;card.dataset.rendered=html;}
 if(!existing||card.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',card);
}
async function lookup(db,table,ids,cols){
 if(!ids.length)return {};
 try{const r=await db.from(table).select(cols).in('id',ids);if(r.error)return {};const m={};(r.data||[]).forEach(x=>m[x.id]=x);return m;}catch{return {};}
}
async function load(force=false){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id||'',db=cloud?.client;
 if(id!==user){user=id;rows=null;status='Loading reports…';updated=0;}
 draw();
 if(!admins.has(id)||!db||typeof ui==='undefined'||ui.tab!=='settings'||document.hidden)return;
 if(busy){if(force)queued=true;return;}
 if(!force&&updated&&Date.now()-updated<60000)return;
 if(!navigator.onLine){status='You’re offline. Reconnect and tap Refresh reports.';draw();return;}
 busy=true;
 try{
  const [c,d]=await Promise.allSettled([
   db.from('chat_reports').select('*').order('created_at',{ascending:false}).limit(30),
   db.from('hq_dm_reports').select('*').order('created_at',{ascending:false}).limit(30)
  ]);
  if(user!==id)return;
  const ok=x=>x.status==='fulfilled'&&!x.value.error;
  const errs=[];if(!ok(c))errs.push('community');if(!ok(d))errs.push('message');
  const cr=ok(c)?(c.value.data||[]):[],dr=ok(d)?(d.value.data||[]):[];
  const [msgs,threads,dms]=await Promise.all([
   lookup(db,'chat_messages',[...new Set(cr.map(r=>r.message_id).filter(Boolean))],'id,body,author_name,is_deleted'),
   lookup(db,'chat_threads',[...new Set(cr.filter(r=>!r.message_id).map(r=>r.thread_id).filter(Boolean))],'id,title,body,author_name'),
   lookup(db,'hq_direct_messages',[...new Set(dr.map(r=>r.message_id).filter(Boolean))],'id,body,sender_id')
  ]);
  if(user!==id)return;
  const all=[
   ...cr.map(r=>{const m=r.message_id?msgs[r.message_id]:threads[r.thread_id];const text=m?(m.is_deleted?'[deleted]':snip((m.title?m.title+' — ':'')+(m.body||''))):'';return {kind:'Community',reason:r.reason,details:r.details,created_at:r.created_at,targetId:r.message_id||r.thread_id,text:text&&m?.author_name?text+'  — '+m.author_name:text};}),
   ...dr.map(r=>{const m=dms[r.message_id];return {kind:'Message',reason:r.reason,details:r.details,created_at:r.created_at,targetId:r.message_id,text:m?snip(m.body):''};})
  ].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,30);
  rows=all;updated=Date.now();
  if(errs.length)status=(all.length?'Could not load '+errs.join(' and ')+' reports. ':'')+BLOCKED;
  else status=all.length?all.length+' latest report'+(all.length===1?'':'s')+' · updated '+perth(updated):BLOCKED;
 }catch{rows=[];status=BLOCKED;}
 finally{busy=false;draw();if(queued){queued=false;load(true);}}
}
document.addEventListener('click',e=>{if(e.target.closest('#hqReportsRefresh,#hqAdminRefresh'))load(true);});
setInterval(()=>load(),2000);load();
})();
