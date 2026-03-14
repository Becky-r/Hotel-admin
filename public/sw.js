// Service Worker for Hotel Management System PWA

const CACHE_NAME = 'hotel-mgmt-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => {
        // Return cached version if offline
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline - Please check your connection');
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  try {
    const pendingChanges = await getPendingChanges();
    for (const change of pendingChanges) {
      await fetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(change),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await clearPendingChanges();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function getPendingChanges() {
  // Implementation for getting pending changes from IndexedDB
  return [];
}

async function clearPendingChanges() {
  // Implementation for clearing pending changes
}
