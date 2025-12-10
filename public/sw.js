const CACHE_NAME = 'cinestream-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://cdn.tailwindcss.com' 
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

  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);


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


  if (!url.hostname.includes('firestore') && !url.hostname.includes('googleapis') && !url.pathname.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});