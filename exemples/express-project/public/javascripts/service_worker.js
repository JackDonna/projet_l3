const PREFIX = 'V2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const cache = await caches.open(PREFIX);
        })()
    );
    console.log(`${PREFIX} install service worker`);
})

self.addEventListener('activate', (event) => {
    clients.claim();
    console.log(`${PREFIX} Active service worker`);
})

self.addEventListener('fetch', (event) => {
    console.log(`${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
    console.log("test")
    if(event.request.mode === 'navigate'){
        event.respondWith((async () => {
            try{
                const preloadResponse = await event.preloadResponse();
                if (preloadResponse){
                    return preloadResponse
                }

                return await fetch(event.request);
            } catch(e){
                return new Response("Boujour les gens");
            }


        })())
    }
})
