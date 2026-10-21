// sw.js - Versión Robusta para Alfadrones PWA

const CACHE_NAME = "alfa-drone-v2"; // Incrementamos versión para forzar actualización
const urlsToCache = [
  "./",
  "./index.html",
  "./css/bootstrap.min.css",
  "./css/style.css",
  "./css/mobile.css",
  "./js/main.js",
  "./img/logo-A.png",
  // ⚠️ NOTA: No incluimos imágenes grandes ni fuentes externas aquí.
  // Se cachearán automáticamente cuando el navegador las pida (estrategia NetworkFirst/CacheFirst abajo).
];

self.addEventListener("install", (event) => {
  console.log("[SW] Instalando...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Abriendo caché");
        // Usamos Promise.allSettled para que NO falle si UN archivo no existe
        return Promise.allSettled(urlsToCache.map((url) => cache.add(url)));
      })
      .then((results) => {
        results.forEach((result) => {
          if (result.status === "rejected") {
            console.warn("[SW] Error al cachear recurso:", result.reason);
          } else {
            console.log("[SW] Recurso cacheado exitosamente");
          }
        });
        return self.skipWaiting(); // Fuerza la activación inmediata
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activando...");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keyNames) => {
        return Promise.all(
          keyNames.map((keyName) => {
            if (!cacheWhitelist.includes(keyName)) {
              console.log("[SW] Eliminando caché vieja:", keyName);
              return caches.delete(keyName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Toma control de todas las pestañas abiertas
  );
});

self.addEventListener("fetch", (event) => {
  // Estrategia: Cache First para assets locales, Network First para el resto
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Si está en caché, úsalo
      }

      // Si no está en caché, ve a la red
      return fetch(event.request)
        .then((networkResponse) => {
          // Opcional: Guardar en caché las respuestas nuevas de la red
          // Solo para GET requests y same-origin
          if (event.request.method !== "GET" || !networkResponse.ok) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error("[SW] Error de red:", error);
          // Aquí podrías devolver una página de error personalizada si quisieras
          throw error;
        });
    })
  );
});
