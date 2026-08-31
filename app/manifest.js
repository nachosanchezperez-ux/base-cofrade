export default function manifest() {
  return {
    name: 'Hilo Cofrade',
    short_name: 'Hilo Cofrade',
    description:
      'Enciclopedia cofrade de Sevilla y su provincia: hermandades, imágenes, pasos, bandas, patrimonio, cultos y salidas relacionados.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#112339',
    icons: [
      {
        src: '/brand/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/brand/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
