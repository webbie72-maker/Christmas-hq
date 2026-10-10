(() => {
 'use strict';
 const owner='7f41d607-bc14-4ba6-83ad-4b92a94be55c';

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
  if(uid()!==owner || typeof ui==='undefined' || ui.tab!=='settings'){existing?.remove();return;}
  const host=document.getElementById('screen');
  if(!host)return;
  const card=existing||document.createElement('section');
  card.id='hqAdminStats';card.className='card';
  const labels=[['total_users','Registered users','👥'],['joined_today','Joined today','✨'],['active_now','Active now','🟢'],['total_families','Families created','🏡']];
  const html='<div class="hq-admin-head"><h3 class="hq-admin-title">✦ Admin dashboard</h3><span class="hq-admin-private">🔒 Just for you</span></div><div class="hq-admin-grid">'+labels.map(([key,label,icon])=>'<div class="hq-admin-stat"><span class="hq-admin-icon" aria-hidden="true">'+icon+'</span><div><strong class="hq-admin-value">'+(cached?Number(cached[key]).toLocaleString():'—')+'</strong><span class="hq-admin-label">'+label+'</span></div></div>').join('')+'</div><div class="hq-admin-footer"><span class="hq-admin-status" role="status">'+(failed?'Refresh unavailable':cached?'Updated '+new Date(lastFetch).toLocaleTimeString():'Loading…')+'</span><button type="button" id="hqAdminRefresh">↻ Refresh</button></div><details><summary>About these numbers</summary><p>Today follows Perth time. Active now counts signed-in users seen within five minutes on the updated app.</p></details>';
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
   if(id===owner&&typeof ui!=='undefined'&&ui.tab==='settings'&&(force||Date.now()-lastFetch>30000)){
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
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const countries=new Intl.DisplayNames(['en'],{type:'region'});
const options=[];
for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const code=String.fromCharCode(a,b);const name=countries.of(code);if(name&&name!==code)options.push([code,name]);}
options.sort((a,b)=>a[1].localeCompare(b[1]));
let user='',own=null,counts=null,loaded=false,busy=false,updated=0,message='',worldMessage='',refreshQueued=false;
function draw(){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id||'';
 if(typeof ui==='undefined'||ui.tab!=='settings'||!id){document.getElementById('hqLocationProfile')?.remove();document.getElementById('hqWorldCounts')?.remove();return;}
 const host=document.getElementById('screen');if(!host)return;
 if(!document.getElementById('hqLocationProfile')&&loaded){
 const card=document.createElement('section');card.className='card';card.id='hqLocationProfile';
 card.innerHTML='<h3>🌍 Your corner of the world</h3><p class="muted-note" style="font-size:13px">Optional: share your city and country for the admin’s location tally. No names or exact locations appear in the tally.</p><form id="hqLocationForm"><label>City<input class="field" name="city" maxlength="80" placeholder="e.g. Perth" value="'+escape(own?.city)+'"></label><label>Country<select class="field" name="country"><option value="">Choose country</option>'+options.map(([c,n])=>'<option value="'+c+'" '+(own?.country===c?'selected':'')+'>'+escape(n)+'</option>').join('')+'</select></label><div class="btnrow"><button class="btn" type="submit">Save location</button><button class="btn alt" type="button" id="hqClearLocation">Remove location</button></div><p id="hqLocationStatus" role="status" style="font-size:12px">'+escape(message)+'</p></form>';
 host.append(card);
 }
 if(id===owner){
 const admin=document.getElementById('hqAdminStats');if(!admin)return;
 let world=document.getElementById('hqWorldCounts');if(!world){world=document.createElement('section');world.id='hqWorldCounts';world.className='card';world.style.background='#fff8e6';admin.insertAdjacentElement('afterend',world);}
 const html='<div style="border-top:1px solid #b99c55;margin-top:12px;padding-top:10px"><h4 style="font-size:16px;color:#174c3a;margin:0 0 8px">🌍 Members around the world</h4><button type="button" class="btn small alt" id="hqWorldRefresh">↻ Refresh locations</button><p role="status" style="font-size:12px;margin:8px 0">'+escape(worldMessage||(counts?'Updated '+new Date(updated).toLocaleTimeString():'Loading location totals…'))+'</p>'+(counts?'<div style="max-height:240px;overflow:auto"><table style="width:100%;font-size:13px;color:#174c3a;border-collapse:collapse"><thead><tr><th scope="col" style="text-align:left">City / country</th><th scope="col" style="text-align:right">Members</th></tr></thead><tbody>'+counts.locations.map(r=>'<tr><td style="padding:7px 0;border-bottom:1px solid #ffffff20">'+escape(r.city)+', '+escape(countries.of(r.country))+'</td><td style="text-align:right;font-weight:800">'+Number(r.members).toLocaleString()+'</td></tr>').join('')+'<tr><td style="padding-top:8px">Location not shared</td><td style="text-align:right;font-weight:800">'+Number(counts.unshared).toLocaleString()+'</td></tr></tbody></table></div><p style="font-size:10px;color:#526b5c;margin:8px 0 0">Optional member-entered locations · no individual pins</p>':'<p style="font-size:12px">'+escape(worldMessage||'Loading location totals…')+'</p>')+'</div>';
 if(world.innerHTML!==html)world.innerHTML=html;
 }
}
async function refresh(force=false){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id||'';
 if(user!==id){user=id;own=null;counts=null;loaded=false;updated=0;message='';worldMessage='';refreshQueued=false;document.getElementById('hqLocationProfile')?.remove();}
 draw();if(!id||typeof ui==='undefined'||ui.tab!=='settings'||document.hidden)return;
 if(!navigator.onLine){worldMessage='You’re offline. Reconnect to refresh location totals.';draw();return;}
 if(busy){if(force)refreshQueued=true;return;}
 if(loaded&&!force&&Date.now()-updated<30000)return;
 busy=true;try{
 const requests=[cloud.client.rpc('hq_member_location')];
 if(id===owner)requests.push(cloud.client.rpc('hq_world_counts'));
 const results=await Promise.allSettled(requests);if(user!==id)return;
 const mine=results[0];
 if(mine.status==='fulfilled'&&!mine.value.error){own=mine.value.data;loaded=true;}
 else message='Could not load your saved location. Try again.';
 if(id===owner){const tally=results[1];
  if(tally.status==='fulfilled'&&!tally.value.error&&Array.isArray(tally.value.data?.locations)){counts=tally.value.data;worldMessage='';}
  else worldMessage='Could not refresh location totals. Tap Refresh locations to retry.';
 }
 updated=Date.now();
 }catch{worldMessage='Could not refresh location totals. Tap Refresh locations to retry.';}
 finally{busy=false;draw();if(refreshQueued){refreshQueued=false;refresh(true);}}
}
async function save(city,country){
 const cloud=window.ChristmasHQFamilyCloud,id=cloud?.session?.user?.id;if(!id)return;
 const form=document.getElementById('hqLocationForm');form?.querySelectorAll('button').forEach(b=>b.disabled=true);
 try{const r=await cloud.client.rpc('hq_member_location',{p_city:city,p_country:country,p_save:true});if(r.error)throw r.error;if(cloud.session?.user?.id!==id)return;own=r.data;message=city?'Location saved.':'Location removed.';document.getElementById('hqLocationProfile')?.remove();await refresh(true);}
 catch{const status=document.getElementById('hqLocationStatus');if(status)status.textContent='Could not save. Check your connection and try again.';}
 finally{form?.querySelectorAll('button').forEach(b=>b.disabled=false);}
}
document.addEventListener('submit',e=>{if(e.target.id!=='hqLocationForm')return;e.preventDefault();const data=new FormData(e.target),city=String(data.get('city')).trim(),country=String(data.get('country'));if(!city||!country){document.getElementById('hqLocationStatus').textContent='Choose a city and country, or use Remove location.';return;}save(city,country);});
document.addEventListener('click',e=>{if(e.target.closest('#hqClearLocation'))save('','');if(e.target.closest('#hqAdminRefresh,#hqWorldRefresh'))refresh(true);});
setInterval(()=>refresh(),2000);refresh();
})();

(()=>{const style=document.createElement('style');style.textContent='#screen #hqWorldCounts{background:#fff8e6!important;color:#174c3a!important}#screen #hqWorldCounts h4,#screen #hqWorldCounts th,#screen #hqWorldCounts td,#screen #hqWorldCounts p{color:#174c3a!important}#hqWorldCounts table{margin-top:10px}#hqWorldCounts th,#hqWorldCounts td{padding:8px 4px!important;border-bottom:1px solid #d8dfd2}';document.head.appendChild(style);})();
