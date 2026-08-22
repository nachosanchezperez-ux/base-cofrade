import Image from 'next/image'
import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeExploreV2 from '@/components/HomeExploreV2'
import styles from '@/app/home.module.css'

const stackedNextExtraHeadStyle = { alignItems: 'flex-start', flexDirection: 'column', gap: 4 }
const heroThread = ['Hermandades', 'Imágenes', 'Pasos', 'Bandas', 'Marchas', 'Autores']

function madridParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    time: `${value('hour')}:${value('minute')}`,
  }
}

function madridDateKey(date = new Date()) {
  return madridParts(date).date
}

function exactScheduleStamp(item, fallbackDate = '') {
  const match = String(item?.time || '').match(/^(\d{1,2}):(\d{2})$/)
  const date = item?.itemDate || fallbackDate
  if (!date || !match) return ''
  return `${date}T${match[1].padStart(2, '0')}:${match[2]}`
}

function scheduleWithLiveState(schedule = [], outingDate = '', now = new Date()) {
  const madrid = madridParts(now)
  const nowStamp = `${madrid.date}T${madrid.time}`
  const stamps = schedule.map((item) => exactScheduleStamp(item, outingDate))
  const nextIndex = stamps.findIndex((stamp) => stamp && stamp >= nowStamp)

  return schedule.map((item, index) => ({
    ...item,
    isPast: Boolean(stamps[index] && stamps[index] < nowStamp),
    isNext: index === nextIndex,
  }))
}

function ThreadMedia({ media }) {
  if (!media?.path) return null
  const isSymbol = media.kind === 'crest' || media.kind === 'logo'
  return (
    <span className={styles.threadMedia} data-kind={media.kind || 'photo'}>
      <Image
        src={media.path}
        alt={media.alt || media.name || ''}
        fill
        sizes="72px"
        style={{
          objectFit: isSymbol ? 'contain' : 'cover',
          objectPosition: media.focusPosition || '50% 50%',
        }}
      />
    </span>
  )
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
  const liveSchedule = featuredIsToday
    ? scheduleWithLiveState(featuredBriefing.schedule, featuredExtraordinary?.date)
    : featuredBriefing.schedule
  const nextScheduleItem = featuredIsToday ? liveSchedule.find((item) => item.isNext) : null
  const featuredDateLabel = featuredIsToday
    ? 'Hoy'
    : featuredExtraordinary?.dateParts?.weekdayLabel || featuredExtraordinary?.dateParts?.label || ''
  const featuredMeta = [
    featuredExtraordinary?.municipality,
    featuredDateLabel,
    featuredIsToday && nextScheduleItem
      ? `Siguiente · ${nextScheduleItem.time} · ${nextScheduleItem.label}`
      : featuredIsToday && featuredExtraordinary?.departureTime
        ? `Salida · ${featuredExtraordinary.departureTime}`
        : '',
  ].filter(Boolean).join(' · ')

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
            <article className={styles.featuredExtraordinaryCard}>
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
                  </div>
                  {featuredExtraordinary.heroImageCredit ? (
                    <figcaption>{featuredExtraordinary.heroImageCredit}</figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className={styles.featuredExtraordinaryCopy}>
                <div className={styles.featuredExtraordinaryIntro}>
                  <span className={styles.eyebrow}>{featuredIsToday ? 'Hoy · Extraordinaria' : 'Próxima extraordinaria'}</span>
                  <h2 id="proxima-extraordinaria-title">{featuredExtraordinary.title}</h2>
                  <div className={styles.featuredExtraordinaryMeta}>
                    <strong>{featuredMeta}</strong>
                    {featuredIsToday && nextScheduleItem ? <span className={styles.liveBadge}>Agenda viva</span> : null}
                  </div>
                  {featuredExtraordinary.reason ? <p>{featuredExtraordinary.reason}</p> : null}
                </div>

                <div className={styles.extraordinaryBriefing}>
                  {liveSchedule.length ? (
                    <section className={styles.briefingBlock} aria-labelledby="briefing-horarios">
                      <span className={styles.briefingLabel} id="briefing-horarios">Horarios</span>
                      <div className={styles.briefingRows}>
                        {liveSchedule.map((item) => (
                          <div
                            className={`${styles.briefingRow} ${item.isPast ? styles.briefingRowPast : ''} ${item.isNext ? styles.briefingRowNext : ''}`}
                            key={item.id}
                          >
                            <strong>{item.time}</strong>
                            <span>
                              <b>
                                {item.label}
                                {item.isNext ? <em className={styles.nextBadge}>Siguiente</em> : null}
                              </b>
                              {item.dayLabel ? <small>{item.dayLabel}</small> : null}
                              {item.place ? <small>{item.place}</small> : null}
                              {item.label === 'Misa estacional' && featuredBriefing.liturgicalMusic[0]?.name
                                ? <small>Música · {featuredBriefing.liturgicalMusic[0].name}</small>
                                : null}
                            </span>
                          </div>
                        ))}
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
                  <div className={styles.threadIdentity}>
                    <ThreadMedia media={thread.media} />
                    <div>
                      <h3>{thread.title}</h3>
                      <strong className={styles.threadMetric}>{thread.metric}</strong>
                    </div>
                  </div>
                  <p>{thread.summary}</p>
                  {thread.media?.credit ? <small className={styles.threadCredit}>{thread.media.credit}</small> : null}
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
