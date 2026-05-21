/* ═══════════════════════════════════════════
   PediVault Service Worker v3.0
   Strategy: Cache-first for assets,
   Network-first for API calls,
   Offline shell fallback for navigation
   ═══════════════════════════════════════════ */

const CACHE_NAME    = 'pedivault-v3';
const OFFLINE_URL   = '/offline.html';

/* Assets to pre-cache on install */
const PRECACHE_URLS = [
  '/',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500&display=swap',
];

/* ── INSTALL: pre-cache shell ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: clean old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: routing strategy ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin API requests */
  if(request.method !== 'GET') return;
  if(url.hostname === 'api.anthropic.com') return; /* Never cache AI responses */
  if(url.hostname.includes('railway.app')) return; /* Never cache API calls */

  /* Navigation requests → serve app shell */
  if(request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/').then(r => r || new Response('<h1>Offline</h1>', { headers:{'Content-Type':'text/html'} }))
      )
    );
    return;
  }

  /* Font/image assets → Cache first */
  if(url.hostname.includes('fonts.') || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  /* JS/CSS → Cache first with network refresh */
  if(request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then(cached => {
        const networkFetch = fetch(request).then(response => {
          caches.open(CACHE_NAME).then(c => c.put(request, response.clone()));
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  /* Default → Network with cache fallback */
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
