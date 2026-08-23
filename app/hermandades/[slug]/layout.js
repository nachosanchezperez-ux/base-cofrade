import BrotherhoodBroadcastGuide from '@/components/BrotherhoodBroadcastGuide'
import { getBrotherhoodBroadcastGuideBySlug } from '@/lib/supabase/brotherhood-broadcast-guide'

export const dynamic = 'force-dynamic'

export default async function BrotherhoodDetailLayout({ children, params }) {
  const { slug } = await params
  const guide = await getBrotherhoodBroadcastGuideBySlug(slug)

  return (
    <>
      {guide ? <BrotherhoodBroadcastGuide guide={guide} /> : null}
      {children}
    </>
  )
}
