// Questo script serve solo per attivare la vera installazione su Android e iPhone
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Lascia passare le richieste di rete normalmente
  e.respondWith(fetch(e.request));
});
