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
  const labels=[['total_users','Registered users','👥','#e5f3ee'],['joined_today','Joined today','✨','#fff2d4'],['active_now','Active now','🟢','#e6f2fa'],['total_families','Families created','🏡','#f9e9e9']];
  const html='<div style="background:linear-gradient(135deg,#195c46,#0b332b);padding:20px;border-radius:20px;color:#fff;text-align:center;margin-bottom:16px"><div style="font-size:11px;letter-spacing:2px;color:#f4d68a;font-weight:800">✦ YOUR ADMIN DASHBOARD ✦</div><h3 style="color:#fff;margin:8px 0;font-size:23px">Christmas HQ at a glance</h3><span style="font-size:12px;color:#dcece3">🔒 Private to your account</span></div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">'+labels.map(([key,label,icon,bg])=>'<div style="padding:16px 8px;background:'+bg+';border:1px solid rgba(184,145,52,.25);border-radius:18px;text-align:center;color:#174c3a;box-shadow:0 3px 8px rgba(20,65,45,.06)"><span style="font-size:23px;display:block;margin-bottom:5px">'+icon+'</span><strong style="display:block;font-size:34px;line-height:1.15">'+(cached?Number(cached[key]).toLocaleString():'—')+'</strong><span style="display:block;font-size:13px;font-weight:700;margin-top:6px">'+label+'</span></div>').join('')+'</div><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:16px"><span style="font-size:11px;color:#62756a" role="status">'+(failed?'Refresh unavailable':cached?'Updated '+new Date(lastFetch).toLocaleTimeString():'Loading…')+'</span><button type="button" class="btn alt" style="font-size:12px;padding:9px 13px" id="hqAdminRefresh">↻ Refresh</button></div><details style="margin-top:12px;font-size:12px;color:#62756a"><summary style="cursor:pointer">About these numbers</summary><p style="line-height:1.6;margin:8px 0 0">Today follows Perth time. Active now counts signed-in users seen within five minutes on the updated app.</p></details>';
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
