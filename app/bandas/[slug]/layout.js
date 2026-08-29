import RelatedExtraordinaryOutings from '@/components/RelatedExtraordinaryOutings'
import { getBandUpcomingExtraordinaryLinksBySlug } from '@/lib/supabase/extraordinary-links'
import detailStyles from './band-detail-polish.module.css'
import periodStyles from './band-period-emphasis.module.css'

export const dynamic = 'force-dynamic'

export default async function BandDetailLayout({ children, params }) {
  const { slug } = await params
  const extraordinaryOutings = await getBandUpcomingExtraordinaryLinksBySlug(slug)

  return (
    <>
      <div className={`${detailStyles.detailScope} ${periodStyles.periodScope}`}>{children}</div>
      <RelatedExtraordinaryOutings items={extraordinaryOutings} context="band" />
    </>
  )
}
