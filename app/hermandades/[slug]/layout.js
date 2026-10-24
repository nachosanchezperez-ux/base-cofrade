import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'
import BrotherhoodHistoricalMusicPortal from '@/components/BrotherhoodHistoricalMusicPortal'
import { getCachedHistoricalMusicByBrotherhoodSlug } from '@/lib/supabase/brotherhood-page-cached'
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page'
import { usesBrotherhoodChapters } from '@/lib/brotherhood-chapters-rollout'

export const dynamic = 'force-static'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  let historicalMusic = []
  // Ficha por capítulos (piloto): la actualidad ya está en Inicio, no se repite.
  // Lectura de la caché de datos de la ficha (la misma que usa la página).
  const chaptersPilot = await getHermandadPageBySlug(slug)
    .then((brotherhood) => usesBrotherhoodChapters(brotherhood?.id))
    .catch(() => false)

  try {
    historicalMusic = await getCachedHistoricalMusicByBrotherhoodSlug(slug)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo preparar la experiencia del histórico musical', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return (
    <>
      {children}
      {chaptersPilot ? null : <Suspense fallback={null}><HiloMovementsSection entityHref={`/hermandades/${slug}`} /></Suspense>}
      <BrotherhoodHistoricalMusicPortal items={historicalMusic} />
    </>
  )
}
