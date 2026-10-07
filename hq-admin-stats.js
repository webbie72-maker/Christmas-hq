(() => {
 'use strict';
 const owner='7f41d607-bc14-4ba6-83ad-4b92a94be55c';
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
  const labels=[['total_users','Registered users'],['joined_today','Joined today'],['active_now','Active now'],['total_families','Families created']];
  const html='<h3>📊 Your Christmas HQ stats</h3><p class="muted-note">Only your admin account can access these totals.</p><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">'+labels.map(([key,label])=>'<div style="padding:14px;background:#f5f1e6;border-radius:14px;text-align:center;color:#174c3a"><strong style="display:block;font-size:28px">'+(cached?Number(cached[key]).toLocaleString():'—')+'</strong><span>'+label+'</span></div>').join('')+'</div><p class="muted-note" role="status">'+(failed?'Could not refresh. Check your connection and try again.':cached?'Updated '+new Date(lastFetch).toLocaleTimeString():'Loading your totals…')+'</p><p class="muted-note">Joined today uses Perth time. Active now means signed-in activity within five minutes, on versions with activity tracking.</p><button type="button" class="btn alt" id="hqAdminRefresh">Refresh totals</button>';
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
