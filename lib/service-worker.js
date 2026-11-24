// Service worker de Hilo Cofrade (24/11/2026): la app funciona sin cobertura.
// Se sirve desde app/sw.js/route.js con la versión del despliegue.
//
// - Páginas: red primero (máx. 4 s); si no hay red, la última copia guardada;
//   si no la hay, /sin-conexion. Se guardan las 60 últimas páginas visitadas.
// - Programa de mano 2027: se guarda entero a petición (botón «Guardar sin
//   cobertura») en una caché propia que no se recorta.
// - Estáticos de Next (_next/static, inmutables): caché primero.
// - Imágenes (_next/image, /brand): copia guardada y se refresca por detrás.
// - Nunca: Panel, API, peticiones RSC de navegación interna, otros dominios.

export const OFFLINE_PATH = '/sin-conexion'
export const SW_CACHES = Object.freeze({
  pages: 'hc-pages',
  programme: 'hc-programme',
  static: 'hc-static',
  images: 'hc-images',
  shell: 'hc-shell',
})
export const SW_LIMITS = Object.freeze({ pages: 60, images: 400 })
export const NAVIGATION_TIMEOUT_MS = 4000

// ¿Qué hace el service worker con esta petición? Pura, para poder probarla.
export function swRoute({ method = 'GET', url = '', origin = '', mode = '', accept = '', rsc = false } = {}) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return 'skip'
  }
  if (method !== 'GET' || parsed.origin !== origin) return 'skip'
  const path = parsed.pathname
  if (/^\/(panel|api|sw\.js|calendario)(\/|$)/.test(path) || /\/estado$/.test(path)) return 'skip'
  if (rsc || parsed.searchParams.has('_rsc')) return 'skip'
  if (path.startsWith('/_next/static/')) return 'static'
  if (path.startsWith('/_next/image') || path.startsWith('/brand/')) return 'image'
  if (mode === 'navigate' || /text\/html/.test(accept)) return 'page'
  return 'skip'
}

export function buildServiceWorker({ version = 'dev', programmeUrls = [] } = {}) {
  const config = JSON.stringify({
    version,
    caches: SW_CACHES,
    limits: SW_LIMITS,
    offline: OFFLINE_PATH,
    timeout: NAVIGATION_TIMEOUT_MS,
    programme: programmeUrls,
  })
  return `/* Hilo Cofrade · service worker · ${version} */
const CONFIG = ${config};
const swRoute = ${swRoute.toString()};
const KNOWN = Object.values(CONFIG.caches);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CONFIG.caches.shell)
      .then((cache) => cache.addAll([CONFIG.offline]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('hc-') && !KNOWN.includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const request of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(request);
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then((value) => { clearTimeout(timer); resolve(value); }, (error) => { clearTimeout(timer); reject(error); });
  });
}

function pageKey(url) {
  const parsed = new URL(url);
  parsed.hash = '';
  // ?origen=app (inicio de la app instalada) es la misma portada.
  parsed.searchParams.delete('origen');
  return parsed.toString();
}

async function handlePage(request) {
  const key = pageKey(request.url);
  try {
    const response = await withTimeout(fetch(request), CONFIG.timeout);
    // Sin copias de redirecciones: Safari no las acepta como navegación.
    if (response.ok && response.type === 'basic' && !response.redirected) {
      const copy = response.clone();
      const isProgramme = CONFIG.programme.includes(new URL(key).pathname);
      caches.open(isProgramme ? CONFIG.caches.programme : CONFIG.caches.pages)
        .then((cache) => cache.put(key, copy))
        .then(() => (isProgramme ? null : trim(CONFIG.caches.pages, CONFIG.limits.pages)));
    }
    return response;
  } catch (error) {
    const saved = await caches.match(key, { ignoreVary: true });
    if (saved) return saved;
    const offline = await caches.match(CONFIG.offline);
    return offline || new Response('Sin conexión', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function handleStatic(request) {
  const saved = await caches.match(request);
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) {
    const copy = response.clone();
    caches.open(CONFIG.caches.static).then((cache) => cache.put(request, copy));
  }
  return response;
}

async function handleImage(request) {
  const saved = await caches.match(request);
  const network = fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CONFIG.caches.images)
        .then((cache) => cache.put(request, copy))
        .then(() => trim(CONFIG.caches.images, CONFIG.limits.images));
    }
    return response;
  }).catch(() => saved || Response.error());
  return saved || network;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const route = swRoute({
    method: request.method,
    url: request.url,
    origin: self.location.origin,
    mode: request.mode,
    accept: request.headers.get('accept') || '',
    rsc: request.headers.has('rsc') || request.headers.has('next-router-state-tree'),
  });
  if (route === 'page') event.respondWith(handlePage(request));
  else if (route === 'static') event.respondWith(handleStatic(request));
  else if (route === 'image') event.respondWith(handleImage(request));
});

// «Guardar sin cobertura» del programa de mano: descarga todas sus páginas.
self.addEventListener('message', (event) => {
  const data = event.data || {};
  const port = event.ports && event.ports[0];
  if (data.type === 'hc:programme-status') {
    event.waitUntil(caches.open(CONFIG.caches.programme).then(async (cache) => {
      const keys = await cache.keys();
      const saved = new Set(keys.map((request) => new URL(request.url).pathname));
      port && port.postMessage({ type: 'status', saved: CONFIG.programme.filter((path) => saved.has(path)).length, total: CONFIG.programme.length });
    }));
  }
  if (data.type === 'hc:save-programme') {
    event.waitUntil((async () => {
      const cache = await caches.open(CONFIG.caches.programme);
      let done = 0;
      let failed = 0;
      for (const path of CONFIG.programme) {
        try {
          const response = await fetch(path, { credentials: 'same-origin', headers: { Accept: 'text/html' } });
          if (!response.ok) throw new Error(String(response.status));
          await cache.put(new URL(path, self.location.origin).toString(), response);
          done += 1;
        } catch (error) {
          failed += 1;
        }
        port && port.postMessage({ type: 'progress', done, failed, total: CONFIG.programme.length });
      }
      port && port.postMessage({ type: 'done', done, failed, total: CONFIG.programme.length });
    })());
  }
});
`
}
