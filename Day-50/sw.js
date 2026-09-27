/* ========================================== */
/* sw.js - Service Worker for Offline Support */
/* ========================================== */

const CACHE_NAME = 'technova-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './core/store.js',
    './core/api.js',
    './components/GitHubCard.js'
];

// ============================================================ */
// INSTALL - Pre-cache assets
// ============================================================ */

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] Installation complete!');
                return self.skipWaiting();
            })
    );
});

// ============================================================ */
// ACTIVATE - Clean old caches
// ============================================================ */

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[SW] Clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
        .then(() => {
            console.log('[SW] Activation complete!');
            return self.clients.claim();
        })
    );
});

// ============================================================ */
// FETCH - Cache-first strategy
// ============================================================ */

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request).catch(() => {
                    // If offline and not cached, return offline page
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return new Response(`
                            <!DOCTYPE html>
                            <html>
                            <head><title>Offline</title>
                            <style>
                                body { font-family: sans-serif; text-align: center; padding: 2rem; background: #f8f5ff; }
                                h1 { color: #2d1b69; }
                                button { padding: 10px 20px; background: #2d1b69; color: white; border: none; border-radius: 8px; cursor: pointer; }
                            </style>
                            </head>
                            <body>
                                <h1>📡 You're Offline</h1>
                                <p>Please check your internet connection.</p>
                                <button onclick="location.reload()">🔄 Retry</button>
                            </body>
                            </html>
                        `, {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'text/html' }
                        });
                    }
                    return new Response('Offline - content not available', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});