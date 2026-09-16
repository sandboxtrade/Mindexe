const CACHE_NAME = "mind-exe-shell-v5.3.3";
// Replaced with the actual hashed Vite output during `npm run build`.
// Keeping "./" here makes the source service worker safe if inspected before build.
const PRECACHE_URLS = ["./","./assets/calibration-ui-CNwYBJeZ.js","./assets/coach-ui-CxUu_Hwh.js","./assets/context-vWPThb91.js","./assets/dashboard-ui-CgGasaQT.js","./assets/decision-lab-ui-DUdYzcPg.js","./assets/icon-16-1u4V2-gj.png","./assets/icon-180-Lz3FnteG.png","./assets/icon-32-CYQkiXd8.png","./assets/index-Bunb9r_6.css","./assets/index-DeQgEvH6.js","./assets/manifest-ewBw_zNF.json","./assets/settings-ui-C4xb734m.js","./assets/strategy-lab-CiWc0toJ.js","./assets/vendor-charts-BK2KcVjL.js","./assets/vendor-firebase-BbJ3NL13.js","./assets/vendor-icons-9BlkPLz5.js","./assets/vendor-misc-BylpYxI7.js","./assets/vendor-react-OFDxoczQ.js","./icon-16.png","./icon-180.png","./icon-192.png","./icon-32.png","./icon-512.png","./index.html","./manifest.json","./splash-poster.jpg"];
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
