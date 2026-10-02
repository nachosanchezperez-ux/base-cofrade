import { connection } from 'next/server'
import HomePageV2 from '@/components/HomePageV2'
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo'
import { getHomeSnapshot } from '@/lib/supabase/home-snapshot'

export const revalidate = 60

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION, url: '/' },
  twitter: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION },
}

function hasPublicSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
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
  // Mantiene la resiliencia P0 en builds sin configuración, sin volver dinámica
  // la Home en Vercel cuando el cliente público de Supabase sí está disponible.
  if (!hasPublicSupabaseConfig()) await connection()

  const today = getTodayLabel()
  const {
    todayContent,
    upcomingAgenda,
    homeTemporal,
    featuredBriefing,
    editorialFeaturedOutingId,
    discoveryThreads,
    exploreStats,
  } = await getHomeSnapshot()

  return (
    <HomePageV2
      today={today}
      todayContent={todayContent}
      upcomingAgenda={upcomingAgenda}
      homeTemporal={homeTemporal}
      featuredBriefing={featuredBriefing}
      editorialFeaturedOutingId={editorialFeaturedOutingId}
      discoveryThreads={discoveryThreads}
      exploreStats={exploreStats}
    />
  )
}
