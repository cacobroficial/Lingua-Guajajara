// Nhe'ẽ PWA Service Worker — v1.0
const CACHE = 'nhee-guajajara-v5';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './vocab-extra.js',
  './features-extra.js',
  './arawy-ai.js',
  './tts-video-patch.js',
  './videos-panel.js',
  './nhee-patch.js',
  './final-update.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Nunito:wght@400;600;800&family=Kalam:wght@400;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => {
      try { return new Request(u, { mode: 'no-cors' }); } catch { return u; }
    }))).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Don't intercept youtube/external video
  if (e.request.url.includes('youtube.com') || e.request.url.includes('youtu.be')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copy = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
