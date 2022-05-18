const CACHE_NAME = "football-crack-v3";

let urlsToCache = [
    '/',
    '/index.html',
    '/bundle.js',
    '/img/bg.jpg',
    '/img/icons/android-chrome-192x192.png',
    '/img/icons/android-chrome-512x512.png',
    '/img/icons/apple-touch-icon.png',
    '/img/icons/favicon-16x16.png',
    '/img/icons/favicon-32x32.png',
    '/img/icons/favicon.ico',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-256x256.png',
    '/img/icons/icon-384x384.png',
    '/img/icons/icon-512x512.png',
    '/img/icons/site.webmanifest',
    '/pages/components/sidenavbar.html',
    '/pages/components/topnavbar.html',
    '/pages/competition-detail.html',
    '/pages/competitions.html',
    '/pages/home.html',
    '/pages/match-detail.html',
    '/pages/matches.html',
    '/pages/saved.html',
    '/pages/standings.html',
    '/pages/team-detail.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Abel&display=swap'
]

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
})

self.addEventListener('fetch', (e) => {
    // Cache fallback to network
    // e.respondWith(
    //     caches.match(e.request).then((r) => {
    //         console.log('[Service Worker] Fetching resource: ' + e.request.url);
    //         return r || fetch(e.request).then((response) => {
    //             return caches.open(CACHE_NAME).then((cache) => {
    //                 console.log('[Service Worker] Caching new resource: ' + e.request.url);
    //                 cache.put(e.request, response.clone());
    //                 return response;
    //             });
    //         });
    //     })
    // );
    // network fallback to cache
    e.respondWith(
        fetch(e.request)
            .then(function (response) {
                return caches.open(CACHE_NAME).then((cache) => {
                    // console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            })
            .catch(function () {
                // console.log('[Service Worker] Fetching resource from cache: ' + e.request.url);
                return caches.match(e.request);
            })
    );
});

self.addEventListener("activate", function (event) {
    self.clients.claim()
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME && cacheName.startsWith("football-crack")) {
                        console.log("ServiceWorker: cache " + cacheName + " deleted");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', function (event) {
    let body;
    if (event.data) body = event.data.text();
    else body = 'Push message no payload';
    const options = {
        body: body,
        icon: 'img/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});