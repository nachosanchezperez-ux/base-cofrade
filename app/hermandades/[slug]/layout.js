import RelatedExtraordinaryOutings from '@/components/RelatedExtraordinaryOutings'
import { getBrotherhoodUpcomingExtraordinaryLinksBySlug } from '@/lib/supabase/extraordinary-links'

export const dynamic = 'force-dynamic'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  const extraordinaryOutings = await getBrotherhoodUpcomingExtraordinaryLinksBySlug(slug)

  return (
    <>
      {children}
      <RelatedExtraordinaryOutings items={extraordinaryOutings} context="brotherhood" />
    </>
  )
}
