const CACHE_NAME = 'neurolasermap-v2';
const RUNTIME_CACHE = 'neurolasermap-runtime-v2';
const BASE_PATH = '/api/webapp';
const ASSETS_TO_CACHE = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
];
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[Service Worker] Some assets failed to cache:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/pwa-auth') || url.pathname.startsWith('/api/trpc')) {
    event.respondWith(fetch(request));
    return;
  }
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|ico)$/)) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;
        return fetch(request).then((response) => {
          if (response.ok) {
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, response.clone()));
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((r) => r || caches.match(BASE_PATH + '/index.html'));
      })
    );
    return;
  }
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(RUNTIME_CACHE).then((c) => c.put(request, response.clone()));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
