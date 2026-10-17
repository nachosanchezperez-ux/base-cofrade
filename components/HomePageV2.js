import HomeFeaturedOuting from '@/components/HomeFeaturedOuting'
import HomeHero from '@/components/HomeHero'
import HomeAgendaNow from '@/components/HomeAgendaNow'
import HomeCrewCalls from '@/components/HomeCrewCalls'
import HomeDiscover from '@/components/HomeDiscover'
import HomeUpdatesLink from '@/components/HomeUpdatesLink'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeKnowledgeThreads from '@/components/HomeKnowledgeThreads'
import { buildHomeAgendaNow, selectHomeFeaturedOuting } from '@/lib/home-agenda-now'
import styles from '@/app/home.module.css'
import liveStyles from './HomeExtraordinaryLive.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

// Portada · Tarea 08. Jerarquía única:
//   A. Cabecera y buscador
//   B. Agenda cofrade (Ahora · Hoy · Mañana · Fin de semana)
//   B2. Igualás y ensayos (próximas convocatorias de cuadrilla)
//   C. Destacados (Panel → Portada editorial → Destacados, y la procesión en curso)
//   D. Descubre Hilo Cofrade (accesos a las secciones)
//   E. Actualidad y descubrimiento (El Hilo se mueve, Descubre hoy, últimos hilos)
export default function HomePageV2({
  today,
  todayContent,
  upcomingAgenda = [],
  homeTemporal = null,
  featuredBriefing,
  editorialFeaturedOutingId = '',
  editorialHighlights = [],
  discoveryThreads,
  exploreStats,
  news = [],
  crewCalls = null,
}) {
  const agendaNow = buildHomeAgendaNow(homeTemporal)

  // La procesión en curso con su horario y bandas, salvo que ya figure entre los
  // destacados del Panel (selectHomeFeaturedOuting evita la repetición).
  const live = selectHomeFeaturedOuting({ upcomingAgenda, editorialFeaturedOutingId, editorialHighlights })
  const highlights = [
    ...(live && featuredBriefing ? [{ outing: live.outing, briefing: featuredBriefing, isLive: live.isLive }] : []),
    ...editorialHighlights,
  ]

  return (
    <div className={styles.home}>
      <HomeHero />

      {agendaNow ? <HomeAgendaNow agenda={agendaNow} /> : null}

      <HomeCrewCalls calls={crewCalls} />

      {highlights.length ? (
        <section
          className={`${styles.section} ${styles.featuredExtraordinary} ${polishStyles.extraordinarySection}`}
          id="extraordinarias"
          aria-labelledby="destacados-title"
        >
          <div className="shell">
            <header className={styles.upcomingAgendaHead}>
              <h2 id="destacados-title">{live?.isLive && !editorialHighlights.length ? 'Procesión en curso' : 'Destacados'}</h2>
            </header>
            <div className={liveStyles.editorialHighlights}>
              {highlights.map(({ outing, briefing }) => (
                <HomeFeaturedOuting key={outing.id} featuredOuting={outing} featuredBriefing={briefing} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <HomeDiscover stats={exploreStats} />

      <HomeUpdatesLink news={news} />

      <HomeTodayV2 today={today} content={todayContent} />

      <HomeKnowledgeThreads threads={discoveryThreads} />
    </div>
  )
}
