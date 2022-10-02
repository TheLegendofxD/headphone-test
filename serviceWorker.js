const cache_name = "ht-cache-v1.3";
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
        caches.open(cache_name).then(cache => {
            cache.addAll(assets)
        })
    )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
});
