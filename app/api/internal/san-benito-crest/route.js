export const dynamic = 'force-dynamic'

export async function GET() {
  const source = 'https://hermandaddesanbenito.net/wp-content/uploads/2022/12/escudo-transparente-284x300.png'
  const response = await fetch(source, {
    headers: { 'user-agent': 'Hilo Cofrade asset sync' },
    cache: 'no-store',
  })

  if (!response.ok) {
    return new Response('No se pudo obtener el escudo oficial', { status: 502 })
  }

  const body = await response.arrayBuffer()
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': response.headers.get('content-type') || 'image/png',
      'cache-control': 'no-store',
    },
  })
}
