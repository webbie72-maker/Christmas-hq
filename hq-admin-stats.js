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
  if(card.innerHTML!==html)card.innerHTML=html;
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
