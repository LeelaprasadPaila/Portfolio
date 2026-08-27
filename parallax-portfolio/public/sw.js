// Service Worker for PWA support
const CACHE_NAME = 'portfolio-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API calls
    if (event.request.url.includes('/api/')) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Cache first for static assets
    if (
        event.request.url.includes('/assets/') ||
        event.request.url.includes('/images/')
    ) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // Network first for navigation
    if (event.request.mode === 'navigate') {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // Stale-while-revalidate for everything else
    event.respondWith(staleWhileRevalidate(event.request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        // Only cache successful full responses (status 200). Partial (206) or streamed
        // responses are not supported by Cache.put in some browsers and will throw.
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            try {
                await cache.put(request, response.clone());
            } catch (err) {
                // Swallow cache put errors to avoid unhandled rejections
                console.warn('[SW] cache.put failed for', request.url, err);
            }
        }
        return response;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            try {
                await cache.put(request, response.clone());
            } catch (err) {
                console.warn('[SW] cache.put failed for', request.url, err);
            }
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // Return offline page for navigation
        if (request.mode === 'navigate') {
            return caches.match('/');
        }
        
        return new Response('Offline', { status: 503 });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
            try {
                cache.put(request, response.clone());
            } catch (err) {
                console.warn('[SW] cache.put failed for', request.url, err);
            }
        }
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}