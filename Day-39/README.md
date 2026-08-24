# Day 39: Offline Architecture & Service Workers

## 📝 What I Built
Today I added offline support using Service Workers to cache assets and enable offline browsing.

**Live Demo:** https://hithashree-git.github.io/50-Days-Web-Challenge/Day-39/

## 📸 Screenshots

### 💻 Code View
![Day 39 Code](screenshots/day39-code.png)

### 🌐 Browser Output
![Day 39 Output](screenshots/day39-output.png)

### 🦖 Offline Status
![Offline Status](screenshots/day39-offline.png)

## 🔑 Key Learnings

### 1. Service Worker Registration
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== CACHE_NAME).map(caches.delete));
        })
    );
});
🧩 Challenges Faced

Challenge: CSS not updating after changes

    Solution: Use "Update on reload" in DevTools or change cache version

Challenge: HTTPS requirement

    Solution: Service workers require HTTPS (localhost works locally)

🎯 Features Implemented

    ☑

    Service Worker registration
    ☑

    Pre-caching core assets
    ☑

    Cache-first strategy
    ☑

    Offline page fallback
    ☑

    Old cache cleanup
    ☑

    Cache status UI
    ☑

    Online/Offline detection

🔗 Links

    GitHub: https://github.com/HITHASHREE-GIT/50-Days-Web-Challenge

    Live Demo: https://hithashree-git.github.io/50-Days-Web-Challenge/Day-39/