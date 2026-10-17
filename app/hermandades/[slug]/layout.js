import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'
import BrotherhoodHistoricalMusicPortal from '@/components/BrotherhoodHistoricalMusicPortal'
import { getCachedHistoricalMusicByBrotherhoodSlug } from '@/lib/supabase/brotherhood-page-cached'

export const dynamic = 'force-static'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  let historicalMusic = []

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
      <Suspense fallback={null}><HiloMovementsSection entityHref={`/hermandades/${slug}`} /></Suspense>
      <BrotherhoodHistoricalMusicPortal items={historicalMusic} />
    </>
  )
}
