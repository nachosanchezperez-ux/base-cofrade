import { SITE_NAME } from '@/lib/seo'

export default function manifest() {
  return {
    name: `${SITE_NAME} · Enciclopedia cofrade`,
    short_name: SITE_NAME,
    description: 'Enciclopedia cofrade de Sevilla y su provincia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f2742',
    lang: 'es',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
