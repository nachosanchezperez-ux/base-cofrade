// Manifiesto de la aplicación instalable (actualizado 24/11/2026: icono
// adaptable para Android, accesos directos y textos de «central de datos»).
export default function manifest() {
  return {
    id: '/',
    name: 'Hilo Cofrade',
    short_name: 'Hilo Cofrade',
    description:
      'La central de datos de las cofradías de Sevilla y su provincia: agenda, programa de mano de la Semana Santa, hermandades, imágenes, pasos, bandas y marchas conectados entre sí.',
    lang: 'es',
    dir: 'ltr',
    start_url: '/?origen=app',
    scope: '/',
    display: 'standalone',
    background_color: '#112339',
    theme_color: '#112339',
    categories: ['lifestyle', 'travel', 'reference'],
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Mantener pulsado el icono de la app (Android) muestra estos accesos.
    shortcuts: [
      { name: 'Agenda de hoy', short_name: 'Hoy', url: '/agenda-cofrade/hoy', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
      { name: 'Programa de mano 2027', short_name: '2027', url: '/semana-santa-sevilla-2027', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
      { name: 'Igualás y ensayos', short_name: 'Igualás', url: '/igualas-y-ensayos', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
      { name: 'Hermandades', short_name: 'Hermandades', url: '/hermandades', icons: [{ src: '/brand/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
