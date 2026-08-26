import Image from 'next/image'
import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeExploreV2 from '@/components/HomeExploreV2'
import HomeKnowledgeThreads from '@/components/HomeKnowledgeThreads'
import { getExtraordinaryLiveState } from '@/lib/home-live-status'
import { getHomeAdaptivePriority } from '@/lib/home-adaptive-priority'
import styles from '@/app/home.module.css'
import liveStyles from './HomeExtraordinaryLive.module.css'
import navStyles from './HomeExtraordinaryNav.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

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

function mobileScheduleIds(schedule = [], liveState = {}) {
  if (schedule.length <= 3) return new Set(schedule.map((item) => item.id))

  if (liveState.state === 'done') {
    return new Set(schedule.slice(-3).map((item) => item.id))
  }

  const nextIndex = schedule.findIndex((item) => item.id === liveState.nextId)
  let start = 0

  if (nextIndex >= 0) {
    start = liveState.state === 'live' ? nextIndex - 1 : nextIndex
    start = Math.max(0, Math.min(start, schedule.length - 3))
  }

  return new Set(schedule.slice(start, start + 3).map((item) => item.id))
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
  const featuredGuideHref = featuredExtraordinary?.href || '/extraordinarias'
  const todayKey = madridDateKey()
  const featuredIsToday = featuredExtraordinary?.date === todayKey
  const liveState = featuredExtraordinary
    ? getExtraordinaryLiveState(featuredExtraordinary.date, featuredBriefing.schedule)
    : { state: 'upcoming', eyebrow: 'Próxima extraordinaria', nextId: '', pastIds: [] }
  const homePriority = getHomeAdaptivePriority({
    dateKey: featuredExtraordinary?.date || '',
    todayKey,
    liveState: liveState.state,
  })
  const nextScheduleItem = liveState.nextId
    ? featuredBriefing.schedule.find((item) => item.id === liveState.nextId) || null
    : null
  const featuredDateLabel = homePriority.relativeDateLabel
    || featuredExtraordinary?.dateParts?.weekdayLabel
    || featuredExtraordinary?.dateParts?.label
    || ''
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
  const mobileVisibleScheduleIds = mobileScheduleIds(featuredBriefing.schedule, liveState)
  const extraordinaryEyebrow = homePriority.eyebrow || liveState.eyebrow

  const extraordinarySection = featuredExtraordinary ? (
    <section
      className={`${styles.section} ${styles.featuredExtraordinary} ${polishStyles.extraordinarySection}`}
      id="extraordinarias"
      aria-labelledby="proxima-extraordinaria-title"
      data-home-urgency={homePriority.urgency}
    >
      <div className="shell">
        <article className={`${styles.featuredExtraordinaryCard} ${polishStyles.extraordinaryCard} ${liveState.state === 'live' ? liveStyles.featuredExtraordinaryLive : ''} ${featuredExtraordinary.heroImagePath ? '' : liveStyles.featuredExtraordinaryNoMedia}`}>
          {featuredExtraordinary.heroImagePath ? (
            <figure className={styles.featuredExtraordinaryMedia}>
              <div className={`${styles.featuredExtraordinaryImageFrame} ${polishStyles.extraordinaryImageFrame}`}>
                <Image
                  src={featuredExtraordinary.heroImagePath}
                  alt={featuredExtraordinary.heroImageAlt}
                  fill
                  sizes="(max-width: 859px) calc(100vw - 32px), 33vw"
                  priority
                />
                {liveState.state === 'live' ? (
                  <span className={liveStyles.liveImageBadge}><i aria-hidden="true" /> En curso</span>
                ) : null}
              </div>
              {featuredExtraordinary.heroImageCredit ? (
                <figcaption>{featuredExtraordinary.heroImageCredit}</figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className={`${styles.featuredExtraordinaryCopy} ${polishStyles.extraordinaryCopy}`}>
            <div className={styles.featuredExtraordinaryIntro}>
              <span className={`${styles.eyebrow} ${liveState.state === 'live' ? liveStyles.liveEyebrow : ''}`}>{extraordinaryEyebrow}</span>
              <h2 className={polishStyles.extraordinaryTitle} id="proxima-extraordinaria-title">{featuredExtraordinary.title}</h2>
              <div className={`${styles.featuredExtraordinaryMeta} ${polishStyles.extraordinaryMeta}`}>
                <strong>{featuredMeta}</strong>
              </div>
              {featuredExtraordinary.reason ? <p>{featuredExtraordinary.reason}</p> : null}
            </div>

            <div className={`${styles.extraordinaryBriefing} ${polishStyles.extraordinaryBriefing}`}>
              {featuredBriefing.schedule.length ? (
                <section className={styles.briefingBlock} aria-labelledby="briefing-horarios">
                  <span className={styles.briefingLabel} id="briefing-horarios">Horarios</span>
                  <div className={styles.briefingRows}>
                    {featuredBriefing.schedule.map((item) => {
                      const isNext = item.id === liveState.nextId
                      const isPast = pastScheduleIds.has(item.id)
                      const mobileVisible = mobileVisibleScheduleIds.has(item.id)
                      return (
                        <div
                          className={`${styles.briefingRow} ${polishStyles.briefingRow} ${mobileVisible ? '' : polishStyles.mobileScheduleHidden} ${isNext ? liveStyles.briefingRowNext : ''} ${isPast ? liveStyles.briefingRowPast : ''}`}
                          key={item.id}
                        >
                          <strong>{item.time}</strong>
                          <span>
                            <span className={liveStyles.briefingTitleLine}>
                              <b>{item.label}</b>
                              {isNext ? <em className={liveStyles.briefingStatus}>{liveState.state === 'live' ? 'Siguiente' : 'Primer hito'}</em> : null}
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
                  {featuredBriefing.schedule.length > 3 ? (
                    <small className={polishStyles.mobileScheduleNote}>La guía completa reúne todos los horarios y detalles.</small>
                  ) : null}
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
                  <div className={`${styles.placePills} ${polishStyles.placePills}`}>
                    {featuredBriefing.places.map((place) => <span key={place.id}>{place.name}</span>)}
                  </div>
                </section>
              ) : null}
            </div>

            <div className={navStyles.actions}>
              <Link className={navStyles.primary} href={featuredGuideHref}>
                Abrir guía completa <span aria-hidden="true">→</span>
              </Link>
              <Link className={navStyles.secondary} href="/extraordinarias">
                Ver todas las extraordinarias
              </Link>
            </div>
          </div>
        </article>

        {followingExtraordinaryOutings.length ? (
          <div className={`${styles.nextExtraSection} ${polishStyles.nextExtraSection}`} id="siguientes-extraordinarias">
            <div className={styles.nextExtraHead} style={stackedNextExtraHeadStyle}>
              <span className={styles.eyebrow}>Después</span>
              <h2>Las siguientes extraordinarias</h2>
            </div>
            <div className={`${styles.nextExtraList} ${polishStyles.nextExtraList}`}>
              {followingExtraordinaryOutings.map((outing) => (
                <Link
                  className={`${styles.nextExtraRow} ${navStyles.row} ${polishStyles.nextExtraRow}`}
                  href={outing.href || '/extraordinarias'}
                  key={outing.id}
                  aria-label={`Abrir guía de ${outing.title}`}
                >
                  <time dateTime={outing.date}>
                    <strong>{outing.dateParts.day}</strong>
                    <span>{outing.dateParts.month}</span>
                  </time>
                  <div>
                    <h3>{outing.title}</h3>
                    <p>{[outing.municipality, outing.reason].filter(Boolean).join(' · ')}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link className={navStyles.calendar} href="/extraordinarias">
              Ver calendario completo <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  ) : null

  const todaySection = <HomeTodayV2 today={today} content={todayContent} />

  return (
    <div className={styles.home}>
      <section className={`${styles.hero} ${polishStyles.hero}`} id="inicio">
        <div className="shell">
          <div className={`${styles.heroCopy} ${polishStyles.heroCopy}`}>
            <span className={styles.kicker}>Sevilla y su provincia</span>
            <h1 className={polishStyles.heroTitle}>Hilo Cofrade, <span>todo en las cofradías está relacionado</span></h1>
            <p className={polishStyles.heroDescription}>Consulta, descubre y sigue las conexiones entre hermandades, imágenes, bandas, marchas, autores y patrimonio.</p>
            <nav className={styles.heroActions} aria-label="Accesos principales">
              <Link className={styles.heroPrimaryAction} href="/directorio">
                Explorar la enciclopedia <span aria-hidden="true">→</span>
              </Link>
              <Link className={styles.heroSecondaryAction} href="/extraordinarias">
                Ver próximas extraordinarias
              </Link>
            </nav>
            <div className={`${styles.heroThread} ${polishStyles.heroThread}`} aria-label="Recorrido del conocimiento relacionado de Hilo Cofrade">
              {heroThread.map((item, index) => (
                <span key={item}>
                  <b>{item}</b>
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

      {homePriority.extraordinaryFirst ? (
        <>
          {extraordinarySection}
          {todaySection}
        </>
      ) : (
        <>
          {todaySection}
          {extraordinarySection}
        </>
      )}

      <HomeKnowledgeThreads threads={discoveryThreads} />
      <HomeExploreV2 stats={exploreStats} />
    </div>
  )
}
