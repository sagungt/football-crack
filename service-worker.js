importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) console.log(`Workbox loaded`);
else console.log(`Workbox failed`);


workbox.setConfig({
    debug: true,
});

workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/bundle.js", revision: "1" },
    { url: "/push.js", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/icon_96x96.png", revision: "1" },
    { url: "/icon_128x128.png", revision: "1" },
    { url: "/icon_256x256.png", revision: "1" },
    { url: "/icon_384x384.png", revision: "1" },
    { url: "/icon_512x512.png", revision: "1" },
    { url: "/css/style.css", revision: "1" },
    { url: "/img/bg.jpg", revision: "1" },
    { url: "/img/icons/android-chrome-192x192.png", revision: "1" },
    { url: "/img/icons/android-chrome-512x512.png", revision: "1" },
    { url: "/img/icons/apple-touch-icon.png", revision: "1" },
    { url: "/img/icons/favicon-16x16.png", revision: "1" },
    { url: "/img/icons/favicon-32x32.png", revision: "1" },
    { url: "/img/icons/favicon.ico", revision: "1" },
    { url: "/img/icons/icon-192x192.png", revision: "1" },
    { url: "/img/icons/icon-256x256.png", revision: "1" },
    { url: "/img/icons/icon-384x384.png", revision: "1" },
    { url: "/img/icons/icon-512x512.png", revision: "1" },
    { url: "/img/icons/maskable-icon.png", revision: "1" },
    { url: "/img/icons/site.webmanifest", revision: "1" },
    { url: "/pages/components/sidenavbar.html", revision: "1" },
    { url: "/pages/components/topnavbar.html", revision: "1" },
    { url: "/pages/competition-detail.html", revision: "1" },
    { url: "/pages/competitions.html", revision: "1" },
    { url: "/pages/home.html", revision: "1" },
    { url: "/pages/match-detail.html", revision: "1" },
    { url: "/pages/matches.html", revision: "1" },
    { url: "/pages/saved.html", revision: "1" },
    { url: "/pages/standings.html", revision: "1" },
    { url: "/pages/team-detail.html", revision: "1" },
]);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://fonts.googleapis.com'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-assets',
    }),
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'api-data',
    })
);

workbox.routing.registerRoute(
    new RegExp('https://crests.football-data.org/'),
    workbox.strategies.cacheFirst({
        cacheName: 'crest-fotball',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
        ],
    })
);

self.addEventListener('push', function (event) {
    let body;
    if (event.data) body = event.data.text();
    else body = 'Push message no payload';
    const options = {
        body: body,
        icon: 'img/icons/icon-192x192.png',
        vibrate: [100, 0, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});