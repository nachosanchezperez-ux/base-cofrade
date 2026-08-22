import Image from 'next/image'
import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeExploreV2 from '@/components/HomeExploreV2'
import { getExtraordinaryLiveState } from '@/lib/home-live-status'
import styles from '@/app/home.module.css'

const stackedNextExtraHeadStyle = { alignItems: 'flex-start', flexDirection: 'column', gap: 4 }
const heroThread = ['Hermandades', 'Imágenes', 'Pasos', 'Bandas', 'Marchas', 'Autores']

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

export default function HomePageV2({
  today,
  todayContent,
  extraordinaryOutings,
  featuredBriefing,
  discoveryThreads,
  exploreStats,
}) {
  const featuredExtraordinary = extraordinaryOutings[0] || null
  const followingExtraordinaryOutings = extraordinaryOutings.slice(1)
  const featuredIsToday = featuredExtraordinary?.date === madridDateKey()
  const liveState = featuredExtraordinary
    ? getExtraordinaryLiveState(featuredExtraordinary.date, featuredBriefing.schedule)
    : { state: 'upcoming', eyebrow: 'Próxima extraordinaria', nextId: '', pastIds: [] }
  const nextScheduleItem = liveState.nextId
    ? featuredBriefing.schedule.find((item) => item.id === liveState.nextId) || null
    : null
  const featuredDateLabel = liveState.state === 'live'
    ? 'En curso'
    : liveState.state === 'done'
      ? 'Celebrada hoy'
      : featuredIsToday
        ? 'Hoy'
        : featuredExtraordinary?.dateParts?.weekdayLabel || featuredExtraordinary?.dateParts?.label || ''
  const featuredTimingLabel = nextScheduleItem?.time
    ? `${liveState.state === 'live' ? 'Siguiente' : 'Comienza'} · ${nextScheduleItem.time}`
    : featuredIsToday && featuredExtraordinary?.departureTime
      ? `Salida · ${featuredExtraordinary.departureTime}`
      : ''
  const featuredMeta = [
    featuredExtraordinary?.municipality,
    featuredDateLabel,
    featuredTimingLabel,
  ].filter(Boolean).join(' · ')
  const pastScheduleIds = new Set(liveState.pastIds || [])

  return (
    <div className={styles.home}>
      <section className={styles.hero} id="inicio">
        <div className="shell">
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Sevilla y su provincia</span>
            <h1>Hilo Cofrade, <span>todo en las cofradías está relacionado</span></h1>
            <p>Consulta, descubre y sigue las conexiones entre hermandades, imágenes, bandas, marchas, autores y patrimonio.</p>
            <div className={styles.heroThread} aria-label="Recorrido del conocimiento relacionado de Hilo Cofrade">
              {heroThread.map((item, index) => (
                <span key={item}>
                  <b>{item}</b>
                  {index < heroThread.length - 1 ? <i aria-hidden="true">→</i> : null}
                </span>
              ))}
            </div>
          </div>

          <aside className={styles.searchBox} id="tiradelhilo">
            <div className={styles.searchInner}>
              <span className={styles.searchLabel}>Tira del hilo</span>
              <h2>Pregunta a Hilo Cofrade</h2>
              <p>Escribe como hablarías con otra persona. La respuesta se construye únicamente con datos y relaciones ya documentados en Hilo Cofrade.</p>
              <HiloSearch homeCompact />
            </div>
          </aside>
        </div>
      </section>

      {featuredExtraordinary ? (
        <section
          className={`${styles.section} ${styles.featuredExtraordinary}`}
          id="extraordinarias"
          aria-labelledby="proxima-extraordinaria-title"
        >
          <div className="shell">
            <article className={`${styles.featuredExtraordinaryCard} ${liveState.state === 'live' ? styles.featuredExtraordinaryLive : ''}`}>
              {featuredExtraordinary.heroImagePath ? (
                <figure className={styles.featuredExtraordinaryMedia}>
                  <div className={styles.featuredExtraordinaryImageFrame}>
                    <Image
                      src={featuredExtraordinary.heroImagePath}
                      alt={featuredExtraordinary.heroImageAlt}
                      fill
                      sizes="(max-width: 859px) calc(100vw - 32px), 33vw"
                      priority
                    />
                    {liveState.state === 'live' ? (
                      <span className={styles.liveImageBadge}><i aria-hidden="true" /> En curso</span>
                    ) : null}
                  </div>
                  {featuredExtraordinary.heroImageCredit ? (
                    <figcaption>{featuredExtraordinary.heroImageCredit}</figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className={styles.featuredExtraordinaryCopy}>
                <div className={styles.featuredExtraordinaryIntro}>
                  <span className={`${styles.eyebrow} ${liveState.state === 'live' ? styles.liveEyebrow : ''}`}>{liveState.eyebrow}</span>
                  <h2 id="proxima-extraordinaria-title">{featuredExtraordinary.title}</h2>
                  <div className={styles.featuredExtraordinaryMeta}>
                    <strong>{featuredMeta}</strong>
                  </div>
                  {featuredExtraordinary.reason ? <p>{featuredExtraordinary.reason}</p> : null}
                </div>

                <div className={styles.extraordinaryBriefing}>
                  {featuredBriefing.schedule.length ? (
                    <section className={styles.briefingBlock} aria-labelledby="briefing-horarios">
                      <span className={styles.briefingLabel} id="briefing-horarios">Horarios</span>
                      <div className={styles.briefingRows}>
                        {featuredBriefing.schedule.map((item) => {
                          const isNext = item.id === liveState.nextId
                          const isPast = pastScheduleIds.has(item.id)
                          return (
                            <div
                              className={`${styles.briefingRow} ${isNext ? styles.briefingRowNext : ''} ${isPast ? styles.briefingRowPast : ''}`}
                              key={item.id}
                            >
                              <strong>{item.time}</strong>
                              <span>
                                <span className={styles.briefingTitleLine}>
                                  <b>{item.label}</b>
                                  {isNext ? <em>{liveState.state === 'live' ? 'Siguiente' : 'Primer hito'}</em> : null}
                                </span>
                                {item.dayLabel ? <small>{item.dayLabel}</small> : null}
                                {item.place ? <small>{item.place}</small> : null}
                                {item.label === 'Misa estacional' && featuredBriefing.liturgicalMusic[0]?.name
                                  ? <small>Música · {featuredBriefing.liturgicalMusic[0].name}</small>
                                  : null}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  ) : null}

                  {featuredBriefing.bands.length ? (
                    <section className={styles.briefingBlock} aria-labelledby="briefing-bandas">
                      <span className={styles.briefingLabel} id="briefing-bandas">Bandas</span>
                      <div className={styles.briefingRows}>
                        {featuredBriefing.bands.map((band) => (
                          <div className={styles.bandRow} key={band.id}>
                            {band.href
                              ? <Link className={styles.bandEntityLink} href={band.href}>{band.name}</Link>
                              : <strong>{band.name}</strong>}
                            {band.context ? <small>{band.context}</small> : null}
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {featuredBriefing.places.length ? (
                    <section className={`${styles.briefingBlock} ${styles.briefingPlaces}`} aria-labelledby="briefing-lugares">
                      <span className={styles.briefingLabel} id="briefing-lugares">Lugares clave</span>
                      <div className={styles.placePills}>
                        {featuredBriefing.places.map((place) => <span key={place.id}>{place.name}</span>)}
                      </div>
                    </section>
                  ) : null}
                </div>
              </div>
            </article>

            {followingExtraordinaryOutings.length ? (
              <div className={styles.nextExtraSection} id="siguientes-extraordinarias">
                <div className={styles.nextExtraHead} style={stackedNextExtraHeadStyle}>
                  <span className={styles.eyebrow}>Después</span>
                  <h2>Las siguientes extraordinarias</h2>
                </div>
                <div className={styles.nextExtraList}>
                  {followingExtraordinaryOutings.map((outing) => (
                    <article className={styles.nextExtraRow} key={outing.id}>
                      <time dateTime={outing.date}>
                        <strong>{outing.dateParts.day}</strong>
                        <span>{outing.dateParts.month}</span>
                      </time>
                      <div>
                        <h3>{outing.title}</h3>
                        <p>{[outing.municipality, outing.reason].filter(Boolean).join(' · ')}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <HomeTodayV2 today={today} content={todayContent} />

      {discoveryThreads.length ? (
        <section className={`${styles.section} ${styles.threadsSection}`} id="ultimos-hilos">
          <div className="shell">
            <div className={styles.threadsHead}>
              <span className={styles.threadsEyebrow}>Conocimiento en movimiento</span>
              <h2>Últimos hilos incorporados</h2>
              <p>Lo último que ha crecido dentro de la enciclopedia: nuevas relaciones, patrimonio y conexiones ya publicadas.</p>
            </div>
            <div className={styles.threadRail}>
              {discoveryThreads.map((thread) => (
                <Link className={styles.threadCard} href={thread.href} key={thread.id}>
                  <div className={styles.threadTopline}>
                    <span className={styles.threadLabel}>{thread.label}</span>
                    <span className={styles.threadActivity}>
                      <strong>{thread.activityStatus}</strong>
                      {thread.dateLabel ? (
                        <time dateTime={thread.dateTime}>{thread.dateLabel}</time>
                      ) : null}
                    </span>
                  </div>
                  <h3>{thread.title}</h3>
                  <strong className={styles.threadMetric}>{thread.metric}</strong>
                  <p>{thread.summary}</p>
                  <div className={styles.threadPath} aria-label={`Ruta de descubrimiento: ${thread.path.join(', ')}`}>
                    {thread.path.map((step, index) => (
                      <span key={`${thread.id}-${step}`}>{index ? '→ ' : ''}{step}</span>
                    ))}
                  </div>
                  <span className={styles.threadCta}>{thread.cta}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <HomeExploreV2 stats={exploreStats} />
    </div>
  )
}
