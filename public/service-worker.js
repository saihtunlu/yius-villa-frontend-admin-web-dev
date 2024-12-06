const CACHE_NAME = 'yv-cache-v1';
const urlsToCache = [
  '/', // Root
  '/index.html', // HTML entry point
];

// Install the service worker and cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
    // Check if the request is for a JavaScript file
    if (event.request.url.endsWith('.js')) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          // Return cached response if found
          if (response) {
            return response;
          }
  
          // Try fetching from the network 
          return fetch(event.request).then((fetchResponse) => {
            // Check if the fetch was successful
            if (!fetchResponse || fetchResponse.status !== 200) {
              throw new Error('Network response was not ok');
            }
  
            // Cache the response for future requests
            return caches.open(CACHE_NAME).then((cache) => {
              if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
        }).catch((error) => {
          console.error('Fetching JS file failed:', error);
          // Optionally handle errors, e.g., serve a fallback JS file or return an error response
          return new Response('Failed to fetch JS file', { status: 500 });
        })
      );
    } else {
      // For non-JS requests, use the network directly without caching
      event.respondWith(fetch(event.request));
    }
  });
  

// Remove old caches during activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
