import { directorySearchExtras } from '@/lib/entity-directory-url-state'
import { getPublicEntityDirectory } from '@/lib/supabase/public-directory-cache'

// Texto de búsqueda del /directorio (nombres oficiales y palabras clave), fuera
// del HTML: el navegador lo pide al empezar a escribir y lo guarda en caché.
export const revalidate = 900

export async function GET() {
  try {
    const extras = directorySearchExtras(await getPublicEntityDirectory())
    return Response.json(extras, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo preparar la búsqueda del directorio', {
      error: error instanceof Error ? error.message : String(error),
    })
    return Response.json({}, { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
  }
}
