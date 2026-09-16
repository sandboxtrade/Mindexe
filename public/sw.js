const CACHE_NAME = "mind-exe-shell-v5.3.2";
// Replaced with the actual hashed Vite output during `npm run build`.
// Keeping "./" here makes the source service worker safe if inspected before build.
const PRECACHE_URLS = ["./"];
const SAME_ORIGIN_DESTINATIONS = new Set(["document", "script", "style", "image", "font", "video", "worker"]);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache entries independently so one optional asset can never abort SW installation.
    await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("mind-exe-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    // Do not force-take over existing clients. Let the previous app instance finish with its
    // matching hashed chunks; the new worker activates naturally once old clients are gone.
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Never intercept Firebase/Gemini/Google requests.

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone()).catch(() => {});
        return fresh;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match("./")) || (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  if (!SAME_ORIGIN_DESTINATIONS.has(request.destination)) return;
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then(async (fresh) => {
      if (fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone()).catch(() => {});
      }
      return fresh;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
