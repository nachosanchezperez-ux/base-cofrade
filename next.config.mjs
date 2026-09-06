/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '12mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/bandas/escolania-salesiana-capilla-musical-maria-auxiliadora',
        destination: '/bandas/escolania-salesiana-maria-auxiliadora-sevilla',
        permanent: true,
      },
      {
        source: '/extraordinarias/padre-pio-divina-gracia-salida-extraordinaria-2026-10-11',
        destination: '/extraordinarias/sevilla-divina-gracia-2026',
        permanent: true,
      },
      {
        source: '/hermandades/hermandad-san-esteban-sevilla',
        destination: '/hermandades/san-esteban',
        permanent: true,
      },
      {
        source: '/hermandades/hermandad-de-san-benito',
        destination: '/hermandades/san-benito',
        permanent: true,
      },
      {
        source: '/imagenes/nuestra-senora-santa-maria-aguas-santas-coronada-villaverde',
        destination: '/imagenes/nuestra-senora-aguas-santas-villaverde-del-rio',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/wikipedia/commons/**',
      },
      {
        protocol: 'https',
        hostname: 'www.amencarnacion.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hermandadlosnegritos.org',
        pathname: '/prueba/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'hermandaddesanbenito.net',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'noticiasdoloresdelcerro.wordpress.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pasionporlamusicacofrade.wordpress.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.palbincdn.com',
        pathname: '/users/**',
      },
      {
        protocol: 'https',
        hostname: 'lascigarreras.net',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.virgendelosreyes.es',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bandacruzroja.es',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'municipaldemairena.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'presentaciondoshermanas.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'coverartarchive.org',
        pathname: '/release/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '/image/thumb/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
