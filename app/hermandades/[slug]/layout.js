import BrotherhoodHistoricalMusicPortal from '@/components/BrotherhoodHistoricalMusicPortal'
import { getHistoricalMusicByBrotherhoodSlug } from '@/lib/supabase/historical-music'

export const dynamic = 'force-dynamic'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
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
      <BrotherhoodHistoricalMusicPortal items={historicalMusic} />
    </>
  )
}
