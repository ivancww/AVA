// ====== 每次修改代碼，請務必更改這個版本號 ======
const CACHE_NAME = 'ava-system-v2.6.0'; 
// ================================================

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png'
];

self.addEventListener('install', event => {
  // 強制要求新的 Service Worker 立即接管，不等待舊版關閉
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 刪除所有舊版本的 Cache
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 強制立即控制所有打開的頁面
  );
});