import BrotherhoodBroadcastGuide from '@/components/BrotherhoodBroadcastGuide'
import RelatedExtraordinaryOutings from '@/components/RelatedExtraordinaryOutings'
import { getBrotherhoodBroadcastGuideBySlug } from '@/lib/supabase/brotherhood-broadcast-guide'
import { getBrotherhoodUpcomingExtraordinaryLinksBySlug } from '@/lib/supabase/extraordinary-links'

export const dynamic = 'force-dynamic'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  const [guide, extraordinaryOutings] = await Promise.all([
    getBrotherhoodBroadcastGuideBySlug(slug),
    getBrotherhoodUpcomingExtraordinaryLinksBySlug(slug),
  ])

  return (
    <>
      {guide ? <BrotherhoodBroadcastGuide guide={guide} /> : null}
      {children}
      <RelatedExtraordinaryOutings items={extraordinaryOutings} context="brotherhood" />
    </>
  )
}
