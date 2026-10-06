import { getPublicPlatformUpdates } from '@/lib/supabase/platform-updates'

export const dynamic = 'force-dynamic'

const responseHeaders = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
}

export async function GET() {
  try {
    const items = await getPublicPlatformUpdates()
    return Response.json(
      { items, generatedAt: new Date().toISOString() },
      { headers: responseHeaders },
    )
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las novedades públicas', {
      error: error instanceof Error ? error.message : String(error),
    })
    return Response.json(
      { error: 'No se han podido cargar las novedades. Vuelve a intentarlo.' },
      { status: 503, headers: responseHeaders },
    )
  }
}
