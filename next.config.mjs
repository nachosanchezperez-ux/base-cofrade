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
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
