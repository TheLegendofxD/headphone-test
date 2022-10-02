const cache_name = "ht-cache-v1"
const assets = [
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/js/feather.min.js",
  "/serviceWorker.js",
  "/assets/beep.ogg",
  "/assets/beep.mp3",
  "/assets/icon72.png",
  "/assets/icon96.png",
  "/assets/icon128.png",
  "/assets/icon144.png",
  "/assets/icon152.png",
  "/assets/icon192.png",
  "/assets/icon384.png",
  "/assets/icon512.png",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cache_name).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})