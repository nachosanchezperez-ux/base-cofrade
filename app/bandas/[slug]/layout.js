import RelatedExtraordinaryOutings from '@/components/RelatedExtraordinaryOutings'
import { getBandUpcomingExtraordinaryLinksBySlug } from '@/lib/supabase/extraordinary-links'

export const dynamic = 'force-dynamic'

export default async function BandDetailLayout({ children, params }) {
  const { slug } = await params
  const extraordinaryOutings = await getBandUpcomingExtraordinaryLinksBySlug(slug)

  return (
    <>
      {children}
      <RelatedExtraordinaryOutings items={extraordinaryOutings} context="band" />
    </>
  )
}
