var CACHE_NAME = 'cba-boxing-v3';
var ASSETS = [
  '/Cuban-Boxing-app/',
  '/Cuban-Boxing-app/index.html',
  '/Cuban-Boxing-app/manifest.json',
  '/Cuban-Boxing-app/sw.js',
  '/Cuban-Boxing-app/icon-192x192.png',
  '/Cuban-Boxing-app/icon-512x512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).catch(function(err) { console.log('Cache error:', err); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (!event.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() { return caches.match('/Cuban-Boxing-app/'); });
    })
  );
});
