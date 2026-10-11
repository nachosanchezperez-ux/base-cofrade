import Image from 'next/image'
import Link from 'next/link'
import { getExtraordinaryLiveState } from '@/lib/home-live-status'
import { getHomeAdaptivePriority } from '@/lib/home-adaptive-priority'
import { getProcessionLiveState } from '@/lib/procession-live-status'
import styles from '@/app/home.module.css'
import liveStyles from './HomeExtraordinaryLive.module.css'
import navStyles from './HomeExtraordinaryNav.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

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

export default function HomeFeaturedOuting({ featuredOuting, featuredBriefing }) {
  const featuredGuideHref = featuredOuting?.href || featuredOuting?.calendarHref || '/extraordinarias'
  const todayKey = madridDateKey()
  const featuredIsToday = featuredOuting?.date === todayKey
  const scheduleLiveState = featuredOuting
    ? getExtraordinaryLiveState(featuredOuting.date, featuredBriefing.schedule)
    : { state: 'upcoming', eyebrow: 'Próxima cita', nextId: '', pastIds: [] }
  const genericLiveState = featuredOuting?.liveState || (featuredOuting
    ? getProcessionLiveState({
        date: featuredOuting.date,
        endDate: featuredOuting.returnDate || '',
        startTime: featuredOuting.departureTime || '',
        endTime: featuredOuting.returnTime || '',
      })
    : { state: 'upcoming', isLive: false, label: 'Próxima', timingLabel: '' })
  // A morning Mass is a schedule milestone, not the start of the procession.
  const liveState = { ...scheduleLiveState, state: genericLiveState.state }
  const homePriority = getHomeAdaptivePriority({
    dateKey: featuredOuting?.date || '',
    todayKey,
    liveState: liveState.state,
  })
  const nextScheduleItem = liveState.nextId
    ? featuredBriefing.schedule.find((item) => item.id === liveState.nextId) || null
    : null
  const featuredDateLabel = homePriority.relativeDateLabel
    || featuredOuting?.dateParts?.weekdayLabel
    || featuredOuting?.dateParts?.label
    || ''
  const featuredTimingLabel = featuredOuting?.departureTime
    ? `Salida · ${featuredOuting.departureTime}`
    : ''
  const featuredMeta = [
    featuredOuting?.municipality,
    featuredOuting?.brotherhoodName,
    featuredDateLabel,
    featuredTimingLabel,
  ].filter(Boolean).join(' · ')
  const pastScheduleIds = new Set(liveState.pastIds || [])
  const mobileVisibleScheduleIds = mobileScheduleIds(featuredBriefing.schedule, liveState)
  const agendaTypeLabel = featuredOuting?.typeLabel || 'Procesión'
  const agendaEyebrow = liveState.state === 'live'
    ? `En curso · ${agendaTypeLabel}`
    : liveState.state === 'done' && featuredIsToday
      ? `Celebrada hoy · ${agendaTypeLabel}`
      : homePriority.relativeDateLabel
        ? `${homePriority.relativeDateLabel} · ${agendaTypeLabel}`
        : `Próxima cita · ${agendaTypeLabel}`

  return (
        <article className={`${styles.featuredExtraordinaryCard} ${polishStyles.extraordinaryCard} ${liveStyles.featuredExtraordinaryLive} ${featuredOuting.heroImagePath ? '' : liveStyles.featuredExtraordinaryNoMedia}`}>
          {featuredOuting.heroImagePath ? (
            <figure className={styles.featuredExtraordinaryMedia}>
              <div className={`${styles.featuredExtraordinaryImageFrame} ${polishStyles.extraordinaryImageFrame}`}>
                <Image
                  src={featuredOuting.heroImagePath}
                  alt={featuredOuting.heroImageAlt}
                  fill
                  sizes="(max-width: 859px) calc(100vw - 32px), 33vw"
                  priority
                />
                {liveState.state === 'live' ? (
                  <span className={liveStyles.liveImageBadge}><i aria-hidden="true" /> En curso</span>
                ) : null}
              </div>
              {featuredOuting.heroImageCredit ? (
                <figcaption>{featuredOuting.heroImageCredit}</figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className={`${styles.featuredExtraordinaryCopy} ${polishStyles.extraordinaryCopy}`}>
            <div className={styles.featuredExtraordinaryIntro}>
              <span className={`${styles.eyebrow} ${liveState.state === 'live' ? liveStyles.liveEyebrow : ''}`}>{agendaEyebrow}</span>
              <h3 className={`${styles.featuredAgendaTitle} ${polishStyles.extraordinaryTitle}`}>{featuredOuting.title}</h3>
              <div className={`${styles.featuredExtraordinaryMeta} ${polishStyles.extraordinaryMeta}`}>
                <strong>{featuredMeta}</strong>
              </div>
              {featuredOuting.reason ? <p>{featuredOuting.reason}</p> : null}
            </div>

            <div className={`${styles.extraordinaryBriefing} ${polishStyles.extraordinaryBriefing}`}>
              {featuredBriefing.schedule.length ? (
                <section className={styles.briefingBlock} aria-labelledby={`briefing-horarios-${featuredOuting.id}`}>
                  <span className={styles.briefingLabel} id={`briefing-horarios-${featuredOuting.id}`}>Horarios</span>
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
                <section className={styles.briefingBlock} aria-labelledby={`briefing-bandas-${featuredOuting.id}`}>
                  <span className={styles.briefingLabel} id={`briefing-bandas-${featuredOuting.id}`}>Bandas</span>
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
                <section className={`${styles.briefingBlock} ${styles.briefingPlaces}`} aria-labelledby={`briefing-lugares-${featuredOuting.id}`}>
                  <span className={styles.briefingLabel} id={`briefing-lugares-${featuredOuting.id}`}>Lugares clave</span>
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
              <Link className={navStyles.secondary} href={featuredOuting.calendarHref}>
                Ver {featuredOuting.calendarLabel}
              </Link>
            </div>
          </div>
        </article>
  )
}
