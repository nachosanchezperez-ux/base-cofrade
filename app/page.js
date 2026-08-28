import HomePageV2 from '@/components/HomePageV2'
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo'
import { getHomeSnapshot } from '@/lib/supabase/home-snapshot'

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
  const {
    todayContent,
    upcomingAgenda,
    featuredBriefing,
    discoveryThreads,
    exploreStats,
  } = await getHomeSnapshot()

  return (
    <HomePageV2
      today={today}
      todayContent={todayContent}
      upcomingAgenda={upcomingAgenda}
      featuredBriefing={featuredBriefing}
      discoveryThreads={discoveryThreads}
      exploreStats={exploreStats}
    />
  )
}
