import HomeFeaturedOuting from '@/components/HomeFeaturedOuting'
import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeAgendaNow from '@/components/HomeAgendaNow'
import HomeExploreV2 from '@/components/HomeExploreV2'
import HomeKnowledgeThreads from '@/components/HomeKnowledgeThreads'
import HomeProjectOverview from '@/components/HomeProjectOverview'
import { buildHomeAgendaNow, selectHomeFeaturedOuting } from '@/lib/home-agenda-now'
import styles from '@/app/home.module.css'
import liveStyles from './HomeExtraordinaryLive.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

const heroThread = [
  ['/hermandades', 'Hermandades'],
  ['/imagenes', 'Imágenes'],
  ['/pasos', 'Pasos'],
  ['/bandas', 'Bandas'],
  ['/marchas', 'Marchas'],
  ['/autores', 'Autores'],
]

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
}) {
  // Una sola agenda en portada: Ahora · Hoy · Mañana · Fin de semana (PR B de la Tarea 06).
  const agendaNow = buildHomeAgendaNow(homeTemporal)

  // Destacado: la procesión en curso con su horario, o el destacado editorial vigente.
  const featured = selectHomeFeaturedOuting({ upcomingAgenda, editorialFeaturedOutingId, editorialHighlights })

  const featuredSection = featured && featuredBriefing ? (
    <section
      className={`${styles.section} ${styles.featuredExtraordinary} ${polishStyles.extraordinarySection}`}
      id="proximos-dias"
      aria-labelledby="proximos-dias-title"
    >
      <div className="shell">
        <header className={styles.upcomingAgendaHead}>
          <div>
            <span className={styles.eyebrow}>{featured.isLive ? 'Ahora mismo' : 'Extraordinaria destacada'}</span>
            <h2 id="proximos-dias-title">{featured.isLive
              ? (featured.liveCount > 1 ? `Procesión en curso · ${featured.liveCount} en la calle` : 'Procesión en curso')
              : 'Acontecimiento destacado'}</h2>
          </div>
        </header>
        <HomeFeaturedOuting featuredOuting={featured.outing} featuredBriefing={featuredBriefing} />
      </div>
    </section>
  ) : null

  return (
    <div className={styles.home}>
      <section className={`${styles.hero} ${polishStyles.hero}`} id="inicio">
        <div className="shell">
          <div className={`${styles.heroCopy} ${polishStyles.heroCopy}`}>
            <span className={styles.kicker}>Sevilla y su provincia</span>
            <h1 className={polishStyles.heroTitle}>Hilo Cofrade, <span>todo en las cofradías está relacionado</span></h1>
            <p className={polishStyles.heroDescription}>Consulta la agenda cofrade y descubre las conexiones entre hermandades, imágenes, pasos, bandas, marchas, autores y patrimonio.</p>
            <nav className={styles.heroActions} aria-label="Accesos principales">
              <Link className={styles.heroPrimaryAction} href="/directorio">
                Explorar la enciclopedia <span aria-hidden="true">→</span>
              </Link>
              <Link className={styles.heroSecondaryAction} href="/agenda-cofrade">
                Ver la agenda cofrade
              </Link>
            </nav>
            <div className={`${styles.heroThread} ${polishStyles.heroThread}`} aria-label="Recorrido del conocimiento relacionado de Hilo Cofrade">
              {heroThread.map(([href, label], index) => (
                <span key={href}>
                  <Link href={href}><b>{label}</b></Link>
                  {index < heroThread.length - 1 ? <i aria-hidden="true">→</i> : null}
                </span>
              ))}
            </div>
          </div>

          <aside className={`${styles.searchBox} ${polishStyles.searchBox}`} id="tiradelhilo">
            <div className={styles.searchInner}>
              <span className={styles.searchLabel}>Tira del hilo</span>
              <h2 className={polishStyles.searchTitle}>Pregunta a Hilo Cofrade</h2>
              <p className={polishStyles.searchDescription}>Escribe como hablarías con otra persona. La respuesta se construye únicamente con datos y relaciones ya documentados en Hilo Cofrade.</p>
              <HiloSearch homeCompact />
            </div>
          </aside>
        </div>
      </section>

      {agendaNow ? <HomeAgendaNow agenda={agendaNow} /> : null}

      {editorialHighlights.length ? (
        <section className={`${styles.section} ${styles.featuredExtraordinary} ${polishStyles.extraordinarySection}`} aria-labelledby="editorial-extraordinarias-title">
          <div className="shell">
            <header className={styles.upcomingAgendaHead}>
              <div>
                <span className={styles.eyebrow}>Extraordinarias destacadas</span>
                <h2 id="editorial-extraordinarias-title">Un día extraordinario</h2>
              </div>
            </header>
            <div className={liveStyles.editorialHighlights}>
            {editorialHighlights.map(({ outing, briefing }) => (
              <HomeFeaturedOuting key={outing.id} featuredOuting={outing} featuredBriefing={briefing} />
            ))}
            </div>
          </div>
        </section>
      ) : null}

      {featuredSection}

      <HomeProjectOverview />

      <HomeTodayV2 today={today} content={todayContent} />

      <HomeKnowledgeThreads threads={discoveryThreads} />
      <HomeExploreV2 stats={exploreStats} />
    </div>
  )
}
