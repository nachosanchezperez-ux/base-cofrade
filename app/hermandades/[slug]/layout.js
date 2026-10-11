import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'
import { HILO_MOVEMENTS } from '@/lib/hilo-movements-data'
import BrotherhoodHistoricalMusicPortal from '@/components/BrotherhoodHistoricalMusicPortal'
import { getHistoricalMusicByBrotherhoodSlug } from '@/lib/supabase/historical-music'

export const dynamic = 'force-static'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  const root = HILO_MOVEMENTS.find((item) => item.status === 'published' && item.brotherhood.slug === slug)?.brotherhood
  let historicalMusic = []

  try {
    historicalMusic = await getHistoricalMusicByBrotherhoodSlug(slug)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo preparar la experiencia del histórico musical', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return (
    <>
      {children}
      {root ? <Suspense fallback={null}><HiloMovementsSection brotherhoodId={root.id} brotherhoodName={root.label} /></Suspense> : null}
      <BrotherhoodHistoricalMusicPortal items={historicalMusic} />
    </>
  )
}
