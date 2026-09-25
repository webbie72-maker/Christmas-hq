const CACHE='christmas-hq-pwa-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icons-192.png','./icons-512.png','apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return res}).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(res=>{if(res&&res.status===200){const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return res})));
});
