const CACHE_NAME = 'pomodoro-v1';
const ASSETS_TO_CACHE = [
    'index.html', // No trailing slash for file
    'style.css',  // No trailing slash for file
    'main.js',    // No trailing slash for file
    'manifest.json', // No trailing slash for file
    'icon-192.png',   // No trailing slash for file
    'icon-512.png'    // No trailing slash for file
];

// Install event - cache the app shell
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    
    self.clients.claim();
});

// Fetch event - serve cached content first, then network
self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                return cached || fetch(event.request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    // Cache hit - return the response from the cached version
                    if (response) {
                        return response;
                    }
                    
                    // Not in cache - fetch from the network
                    return fetch(event.request).then((response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response to update cache and also serve it from there
                        const clonedResponse = response.clone();
                        
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clonedResponse);
                        });
                        
                        return response;
                    });
                })
        );
    }
});
