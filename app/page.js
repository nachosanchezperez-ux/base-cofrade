import HomePageV2 from '@/components/HomePageV2'
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo'
import { getUpcomingExtraordinaryOutings } from '@/lib/supabase/home'
import { getDiverseHomeDiscoveryThreads } from '@/lib/supabase/home-discovery-diverse'
import { getHomeExploreStats } from '@/lib/supabase/home-v2'
import { getTodayHomeContentV2 } from '@/lib/supabase/home-effective-editorial'
import { getOutingBriefing } from '@/lib/supabase/outing-briefing'

export const dynamic = 'force-dynamic'

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION, url: '/' },
  twitter: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION },
}

function getTodayLabel() {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const parts = formatter.formatToParts(new Date())
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  const weekday = value('weekday')
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${value('day')} de ${value('month')} de ${value('year')}`
}

export default async function HomePage() {
  const today = getTodayLabel()
  const [
    todayContent,
    extraordinaryOutings,
    discoveryThreads,
    exploreStats,
  ] = await Promise.all([
    getTodayHomeContentV2(),
    getUpcomingExtraordinaryOutings(5),
    getDiverseHomeDiscoveryThreads(3),
    getHomeExploreStats(),
  ])

  const featuredExtraordinary = extraordinaryOutings[0] || null
  const featuredBriefing = featuredExtraordinary
    ? await getOutingBriefing(featuredExtraordinary.id, featuredExtraordinary.date)
    : { schedule: [], bands: [], liturgicalMusic: [], places: [] }

  return (
    <HomePageV2
      today={today}
      todayContent={todayContent}
      extraordinaryOutings={extraordinaryOutings}
      featuredBriefing={featuredBriefing}
      discoveryThreads={discoveryThreads}
      exploreStats={exploreStats}
    />
  )
}
