/* ========================================== */
/* sw.js: The Service Worker Background Proxy */
/* ========================================== */

// Define a name for our cache. Changing this version number forces an update.
const CACHE_NAME = 'technova-cache-v1';

// The essential files required to render the application offline
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/api.js',
    '/utils.js',
    '/offline.html'
];

// ============================================================ */
// 1. THE INSTALL LIFECYCLE
// ============================================================ */

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing phase...');
    
    // Tell the browser to wait until caching is finished before completing installation
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pre-caching core assets.');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete!');
                // Force the waiting service worker to become active
                return self.skipWaiting();
            })
    );
});

// ============================================================ */
// 2. THE FETCH INTERCEPTOR (Cache-First Strategy)
// ============================================================ */

self.addEventListener('fetch', (event) => {
    
    // We only want to intercept standard GET requests
    if (event.request.method !== 'GET') return;

    // Intercept the request and decide how to respond
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                
                // If the file is in the cache, serve it instantly!
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // If it's not in the cache, fetch it from the internet normally
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request).catch((error) => {
                    console.warn('[Service Worker] Network request failed:', event.request.url);
                    
                    // If they are offline AND the file isn't cached, return offline page
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/offline.html');
                    }
                    
                    // Return a simple error response for other assets
                    return new Response('Offline - content not available', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// ============================================================ */
// 3. THE ACTIVATE LIFECYCLE (Cleanup)
// ============================================================ */

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation phase...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => {
            console.log('[Service Worker] Activation complete!');
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// ============================================================ */
// 4. MESSAGE HANDLER (For communication with main.js)
// ============================================================ */

self.addEventListener('message', (event) => {
    console.log('[Service Worker] Received message:', event.data);
    
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'getCacheSize') {
        caches.open(CACHE_NAME).then((cache) => {
            cache.keys().then((keys) => {
                event.ports[0].postMessage({
                    size: keys.length,
                    files: keys.map(req => req.url)
                });
            });
        });
    }
});