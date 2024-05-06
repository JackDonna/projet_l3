const PREFIX = 'V1';

self.addEventListener('install', (event) => {
    console.log(`${PREFIX} install service worker`);
})

self.addEventListener('activate', (event) => {
    console.log(`${PREFIX} Active service worker`);
})

self.addEventListener("fetch", (event) => {
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
