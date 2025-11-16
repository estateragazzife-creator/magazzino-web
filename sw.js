// sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', () => {
  // Cache-first strategy
});