import HomeFeaturedOuting from '@/components/HomeFeaturedOuting'
import HomeHero from '@/components/HomeHero'
import HomeAgendaNow from '@/components/HomeAgendaNow'
import HomeCrewCalls from '@/components/HomeCrewCalls'
import HomeDiscover from '@/components/HomeDiscover'
import HomeUpdatesLink from '@/components/HomeUpdatesLink'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeKnowledgeThreads from '@/components/HomeKnowledgeThreads'
import { buildHomeAgendaNow, homeLiveFocus, selectHomeFeaturedOuting } from '@/lib/home-agenda-now'
import styles from '@/app/home.module.css'
import liveStyles from './HomeExtraordinaryLive.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

// Portada de 5 bloques (P2-F, auditoría del 17/10):
//   1. Cabecera y buscador
//   2. Agenda cofrade (Ahora · Hoy · Mañana · Fin de semana) con las igualás dentro
//   3. Destacados (Panel y procesión en curso), solo si los hay
//   4. Actualidad: El Hilo se mueve
//   5. Descubre Hilo Cofrade: accesos, «Hoy en Hilo Cofrade» y últimos hilos
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
  // La procesión en curso con su horario y bandas, salvo que ya figure entre los
  // destacados del Panel (selectHomeFeaturedOuting evita la repetición).
  const live = selectHomeFeaturedOuting({ upcomingAgenda, editorialFeaturedOutingId, editorialHighlights })
  // Un solo foco (#1253): la salida en curso se muestra dentro de la Agenda, como
  // su cita principal, con el siguiente horario, las bandas y la guía. El bloque
  // aparte solo queda si la Agenda no la encuentra (red de seguridad) o para los
  // destacados elegidos en el Panel.
  const liveFocus = live?.isLive ? homeLiveFocus({ outing: live.outing, briefing: featuredBriefing }) : null
  const agendaNow = buildHomeAgendaNow(homeTemporal, { liveFocus })
  const liveInAgenda = Boolean(liveFocus && agendaNow?.liveFocusMatched)
  const highlights = [
    ...(live && featuredBriefing && !liveInAgenda ? [{ outing: live.outing, briefing: featuredBriefing, isLive: live.isLive }] : []),
    ...editorialHighlights,
  ]

  return (
    <div className={styles.home}>
      <HomeHero />

      {agendaNow ? (
        <HomeAgendaNow agenda={agendaNow}>
          <HomeCrewCalls calls={crewCalls} embedded />
        </HomeAgendaNow>
      ) : <HomeCrewCalls calls={crewCalls} />}

      {highlights.length ? (
        <section
          className={`${styles.section} ${styles.featuredExtraordinary} ${polishStyles.extraordinarySection}`}
          id="extraordinarias"
          aria-labelledby="destacados-title"
        >
          <div className="shell">
            <header className={styles.upcomingAgendaHead}>
              <h2 id="destacados-title">{live?.isLive && !liveInAgenda && !editorialHighlights.length ? 'Procesión en curso' : 'Destacados'}</h2>
            </header>
            <div className={liveStyles.editorialHighlights}>
              {highlights.map(({ outing, briefing }) => (
                <HomeFeaturedOuting key={outing.id} featuredOuting={outing} featuredBriefing={briefing} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <HomeUpdatesLink news={news} />

      <HomeDiscover stats={exploreStats}>
        <HomeTodayV2 today={today} content={todayContent} embedded />
        <HomeKnowledgeThreads threads={discoveryThreads} embedded />
      </HomeDiscover>
    </div>
  )
}
