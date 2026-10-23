/* Full built-in audio downloads for offline playback. */
(()=>{'use strict';
 const CACHE='christmas-hq-offline-music-v1';let busy=false,ready=0,message='',serial=0;
 const songs=()=>window.ChristmasHQBuiltInSongs||[];
 const url=s=>new URL(s.url,location.href).href;
 async function inspect(){const version=++serial;try{if(!window.caches||!navigator.serviceWorker){message='Offline songs need the installed app or a supported browser.';draw();return;}const cache=await caches.open(CACHE);let count=0;for(const song of songs()){const hit=await cache.match(url(song));if(hit?.status===200&&/audio\//i.test(hit.headers.get('content-type')||''))count++;}if(version===serial){ready=count;draw();}}catch{message='Could not check offline storage. Try again in your browser.';draw();}}
 function draw(){if(typeof ui==='undefined')return;const show=ui.tab==='magic'&&ui.sub.magic==='Music';const old=document.getElementById('hqOfflineSongs');if(!show){old?.remove();return;}let box=old;if(!box){box=document.createElement('section');box.id='hqOfflineSongs';box.className='card';document.getElementById('screen')?.appendChild(box);box.innerHTML='<h3>🎵 Music without internet</h3><p class="muted-note">Download the six Christmas HQ songs on this phone. Download while online, then play them using the usual music player. Each phone needs its own download. Uses device storage.</p><p id="hqOfflineSongsStatus" role="status" aria-live="polite"></p><button class="btn full" type="button" id="hqDownloadSongs">Download songs for offline use</button>';}
 const status=box.querySelector('#hqOfflineSongsStatus'),button=box.querySelector('button');status.textContent=message||(ready===songs().length&&ready?'✓ All six songs saved on this phone.':ready+' of '+songs().length+' songs saved on this phone.');button.disabled=busy||!window.caches||!navigator.serviceWorker;button.textContent=busy?'Downloading…':ready===songs().length&&ready?'Refresh offline songs':'Download songs for offline use';
 }
 async function download(){if(busy)return;busy=true;message='Preparing offline download…';draw();try{
  if(!navigator.onLine)throw new Error('Connect to the internet to download the songs.');
  if(!navigator.serviceWorker?.controller)throw new Error('Close and reopen the app after the update, then try again.');
  const cache=await caches.open(CACHE);let completed=0;
  for(const song of songs()){message='Downloading '+(++completed)+' of '+songs().length+': '+song.title;draw();const response=await fetch(url(song),{cache:'reload'});if(response.status!==200||!/audio\//i.test(response.headers.get('content-type')||''))throw new Error('Could not download '+song.title+'. Please retry.');const blob=await response.blob();if(!blob.size)throw new Error('Empty audio download. Please retry.');const headers=new Headers(response.headers);headers.delete('content-encoding');headers.delete('content-range');headers.set('content-length',String(blob.size));await cache.put(url(song),new Response(blob,{status:200,headers}));}
  message='✓ All six songs saved on this phone. Ready for offline playback.';
 }catch(e){message=e.name==='QuotaExceededError'?'Not enough device storage. Free some space and retry.':e.message||'Download stopped. Reconnect and retry; completed songs are kept.';}finally{busy=false;await inspect();draw();}}
 document.addEventListener('click',e=>{if(e.target.closest('#hqDownloadSongs'))download();});
 const original=render;render=function(...args){const result=original.apply(this,args);draw();return result;};
 window.addEventListener('focus',inspect);draw();inspect();
})();
