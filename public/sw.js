const CACHE_NAME = 'cinestream-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://cdn.tailwindcss.com' // Cache external styling
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      }),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Only process GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Handle Navigation Requests (HTML) -> Network First, then Offline Page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request).then((cachedRes) => {
            if (cachedRes) return cachedRes;
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // 2. Handle TMDB API Calls -> Network First, then Cache
  if (url.pathname.includes('/3/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              try {
                cache.put(event.request, responseClone);
              } catch (e) { console.error('Cache put failed', e); }
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Handle Images (TMDB Posters) -> Cache First, then Network
  // This ensures images load instantly if previously viewed, great for offline lists
  if (url.hostname.includes('tmdb.org') && url.pathname.includes('/t/p/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
               try {
                cache.put(event.request, responseClone);
              } catch (e) { console.error('Cache put failed', e); }
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 4. Handle Static Assets -> Cache First
  if (!url.hostname.includes('firestore') && !url.hostname.includes('googleapis') && !url.pathname.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});