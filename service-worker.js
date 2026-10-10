const CACHE = 'christmas-hq-pwa-v83';
const CACHE_PREFIX = 'christmas-hq-pwa-';

const CORE = [
  './', './index.html', './snowflake-icons.css?v=1', './hq-family-data.js?v=1', './family-cloud.js?v=10',
  './christmas-upgrades.js?v=8', './pin-lock.js?v=5', './lock-village.jpg',
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

// Preload the remaining local features without letting one missing file block installation.
const FEATURES = [
  './elf-on-the-shelf.js?v=1', './elf-setup-pictures.webp',
  './gift-photo-personal.webp', './gift-photo-under-50.webp', './gift-photo-kids.webp', './gift-photo-experience.webp', './gift-photo-foodie.webp', './gift-photo-tech.webp', './gift-photo-fitness.webp', './gift-photo-home.webp', './gift-photo-practical.webp', './gift-photo-outdoors.webp',
  './hq-built-in-music.js?v=1', './hq-admin-stats.js?v=2', './gift-match.js?v=1', './brownie-desserts.js?v=1', './terms.html', './account-deletion.js?v=1', './delete-account.html', './privacy.html',
  './gift-library-2600.js', './checklist-links-fix.js?v=2',
  './christmas-hq-festive-live.js?v=25', './christmas-chat.js?v=7',
  './recipe-food-tiles.js?v=2', './panel-transitions.js?v=7',
  './exact-recipe-photos.js?v=2', './christmas-hq-kitchen-v5.js?v=1',
  './christmas-hq-panel-theme.js?v=8', './gift-detail-sheet.js?v=1',
  './explore-detail-sheet.js?v=1', './metric-links.js?v=1',
  './tap-fixes.js?v=1', './countdown-reminders.js?v=1',
  './kitchen-fixes.js?v=5', './welcome-tour.js?v=5', './phone-back.js?v=3', './family-invitations.js?v=4', './direct-chat.js?v=2'
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

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

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
