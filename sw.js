// ======================================
// MIJN BUDGET - SERVICE WORKER
// ======================================

const CACHE_NAME = "mijn-budget-v1";

const APP_BESTANDEN = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192x192.png",
    "./icon-512x512.png"
];


// ======================================
// INSTALLEREN
// ======================================

self.addEventListener(
    "install",
    event => {

        console.log(
            "Mijn Budget Service Worker installeren..."
        );

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(
                cache => {

                    return cache.addAll(
                        APP_BESTANDEN
                    );

                }
            )

        );

        self.skipWaiting();

    }
);


// ======================================
// ACTIVEREN
// ======================================

self.addEventListener(
    "activate",
    event => {

        console.log(
            "Mijn Budget Service Worker actief."
        );

        event.waitUntil(

            caches.keys().then(
                cacheNamen => {

                    return Promise.all(

                        cacheNamen
                            .filter(
                                cacheNaam =>
                                    cacheNaam !==
                                    CACHE_NAME
                            )
                            .map(
                                cacheNaam =>
                                    caches.delete(
                                        cacheNaam
                                    )
                            )

                    );

                }
            )

        );

        self.clients.claim();

    }
);


// ======================================
// BESTANDEN OPHALEN
// ======================================

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            ).then(
                antwoord => {

                    if (antwoord) {

                        return antwoord;

                    }

                    return fetch(
                        event.request
                    ).then(
                        netwerkAntwoord => {

                            return netwerkAntwoord;

                        }
                    );

                }
            )

        );

    }
);