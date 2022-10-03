const cacheName = "ht-cache-v1.3";
const assets = [
  "https://thelegendofxd.github.io/headphone-test/",
  "https://thelegendofxd.github.io/headphone-test/index.html",
  "https://thelegendofxd.github.io/headphone-test/css/style.css",
  "https://thelegendofxd.github.io/headphone-test/js/app.js",
  "https://thelegendofxd.github.io/headphone-test/js/feather.min.js",
  "https://thelegendofxd.github.io/headphone-test/serviceWorker.js",
  "https://thelegendofxd.github.io/headphone-test/assets/icon72.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon96.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon128.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon144.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon152.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon192.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon384.png",
  "https://thelegendofxd.github.io/headphone-test/assets/icon512.png",
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    // Return true if you want to remove this cache
                    return true; // I guess I want to remove it?
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            )
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(fetchEvent.request).then(res => {
                const fetchPromise = fetch(fetchEvent.request)
                .then(networkResponse => {
                    cache.put(fetchEvent.request, networkResponse.clone());
                    return networkResponse;
                })
                return res || fetchPromise;
            })
        })
    )
});
