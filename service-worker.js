const CACHE = 'christmas-hq-pwa-v104';
const CACHE_PREFIX = 'christmas-hq-pwa-';

const CORE = [
  './', './index.html', './snowflake-icons.css?v=1', './hq-family-data.js?v=1', './family-cloud.js?v=10',
  './christmas-upgrades.js?v=14', './pin-lock.js?v=5', './lock-village.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

// Preload the remaining local features without letting one missing file block installation.
const FEATURES = [
  './hq-offline-music.js?v=2', './gift-extras.js?v=2', './hq-polish.js?v=1',
  './elf-on-the-shelf.js?v=2', './elf-setup-pictures.webp',
  './gift-photo-personal.webp', './gift-photo-under-50.webp', './gift-photo-kids.webp', './gift-photo-experience.webp', './gift-photo-foodie.webp', './gift-photo-tech.webp', './gift-photo-fitness.webp', './gift-photo-home.webp', './gift-photo-practical.webp', './gift-photo-outdoors.webp',
  './hq-built-in-music.js?v=1', './hq-admin-stats.js?v=4', './hq-admin-alert.js?v=1', './gift-match.js?v=1', './brownie-desserts.js?v=1', './terms.html', './account-deletion.js?v=1', './delete-account.html', './privacy.html',
  './games/index.html', './gift-library-2600.js', './checklist-links-fix.js?v=5',
  './christmas-hq-festive-live.js?v=28', './christmas-chat.js?v=9',
  './recipe-food-tiles.js?v=2', './panel-transitions.js?v=7',
  './exact-recipe-photos.js?v=2', './christmas-hq-kitchen-v5.js?v=1',
  './gift-detail-sheet.js?v=1',
  './explore-detail-sheet.js?v=2', './metric-links.js?v=1',
  './tap-fixes.js?v=1', './countdown-reminders.js?v=1',
  './kitchen-fixes.js?v=7', './welcome-tour.js?v=5', './phone-back.js?v=3', './family-invitations.js?v=5', './direct-chat.js?v=3'
];

function usable(response, url) {
  if (!response || !response.ok) return false;
  // Some hosts return the app's HTML with status 200 for missing assets.
  const type = response.headers.get('content-type') || '';
  const path = new URL(url, self.location.href).pathname;
  if (/\.(js|css)$/.test(path) && /text\/html/i.test(type)) return false;
  return true;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Keep previously cached artwork and feature scripts across this update.
    for (const key of await caches.keys()) {
      if (key === CACHE || !key.startsWith(CACHE_PREFIX)) continue;
      const old = await caches.open(key);
      for (const request of await old.keys()) {
        const response = await old.match(request);
        if (usable(response, request.url) && !await cache.match(request)) {
          await cache.put(request, response);
        }
      }
    }
    // The shell must be downloaded successfully before activating a new worker.
    await Promise.all(CORE.map(async path => {
      const url = new URL(path, self.location.href).href;
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!usable(response, url)) throw new Error('Could not cache ' + path);
      await cache.put(url, response);
    }));
    await Promise.allSettled(FEATURES.map(async path => {
      const url = new URL(path, self.location.href).href;
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (usable(response, url)) await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys())
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

const MUSIC_CACHE = 'christmas-hq-offline-music-v1';
const MUSIC_FILES = new Set(['aussie-christmas.mp3','poster-boy-christmas.mp3','the-river.mp3','christmas-time.mp3','a-very-merry-christmas.mp3','merry-christmas-time.mp3']);
async function offlineMusic(request) {
 const url = new URL(request.url);
 const cache = await caches.open(MUSIC_CACHE);
 const key = new URL(url.pathname, self.location.origin).href;
 const hit = request.cache === 'reload' || request.cache === 'no-store' ? null : await cache.match(key);
 if (!hit) return fetch(request);
 const range = request.headers.get('range');
 if (!range) return hit;
 const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
 if (!match || !match[1] && !match[2]) return hit;
 const bytes = new Uint8Array(await hit.arrayBuffer());
 const size = bytes.length;
 let start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
 let end = match[1] && match[2] ? Number(match[2]) : size - 1;
 const headers = new Headers(hit.headers);headers.set('accept-ranges','bytes');
 if (start >= size || start > end || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
  headers.set('content-range','bytes */'+size);headers.set('content-length','0');
  return new Response(null,{status:416,headers});
 }
 end = Math.min(end,size-1);
 const body = bytes.slice(start,end+1);
 headers.set('content-range','bytes '+start+'-'+end+'/'+size);headers.set('content-length',String(body.length));
 return new Response(body,{status:206,headers});
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (MUSIC_FILES.has(url.pathname.split('/').pop())) {
    event.respondWith(offlineMusic(request));return;
  }

  const navigation = request.mode === 'navigate';
  const networkFirst = navigation || /\.(js|css|html)$/.test(url.pathname);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(request);
    if (!networkFirst && hit) return hit;
    let response;
    try { response = await fetch(request); } catch (err) { /* Use the correct cached file below. */ }
    if (usable(response, request.url)) {
      // Cache failures (for example full storage) must not discard a good network response.
      event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
      return response;
    }
    if (hit) return hit;
    if (navigation) {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    // Scripts and styles never receive an HTML page as an offline fallback.
    if (response && !response.ok) return response;
    return Response.error();
  })());
});
