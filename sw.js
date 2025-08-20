// Archivos a cachear
const CACHE_NAME = "eco-v1";
const FILES_TO_CACHE = [
  "/",
  "/login.html",
  "/index.html",
  "/css/styles.css",
  "/js/app.js",
  "/assets/logo1.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/manifest.json"
];

// Instalar Service Worker
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Interceptar requests
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
self.addEventListener("install", e => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", e => {
  // de momento no hace nada especial
});
