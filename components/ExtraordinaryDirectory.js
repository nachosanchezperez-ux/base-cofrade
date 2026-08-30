'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './ExtraordinaryDirectory.module.css'

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelada'
  if (item.isCelebrated) return 'Celebrada'
  return item.urgencyLabel || 'Próxima'
}

function groupByMonth(items) {
  const groups = []
  const byKey = new Map()

  for (const item of items) {
    if (!byKey.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      byKey.set(item.monthKey, group)
      groups.push(group)
    }
    byKey.get(item.monthKey).items.push(item)
  }

  return groups
}

export default function ExtraordinaryDirectory({ outings }) {
  const [status, setStatus] = useState('upcoming')
  const [territory, setTerritory] = useState('all')
  const [year, setYear] = useState('all')

  const upcoming = useMemo(() => outings.filter((item) => item.isUpcoming && !item.isCancelled), [outings])
  const celebrated = useMemo(() => outings.filter((item) => item.isCelebrated && !item.isCancelled), [outings])
  const featured = upcoming[0] || null
  const years = useMemo(() => [...new Set(
    outings.map((item) => item.year).filter(Boolean)
  )].sort((a, b) => b - a), [outings])

  const filtered = useMemo(() => {
    const source = status === 'upcoming' ? upcoming : [...celebrated].reverse()

    return source.filter((item) => {
      const matchesTerritory = territory === 'all'
        || (territory === 'capital' && item.scope === 'capital')
        || (territory === 'province' && item.scope === 'province')
      const matchesYear = year === 'all' || String(item.year) === year
      return matchesTerritory && matchesYear
    })
  }, [status, territory, year, upcoming, celebrated])

  const visibleItems = status === 'upcoming' && featured
    ? filtered.filter((item) => item.id !== featured.id)
    : filtered
  const monthGroups = useMemo(() => groupByMonth(visibleItems), [visibleItems])
  const filteredTotal = filtered.length

  return (
    <div className={styles.directory}>
      {featured ? (
        <article className={styles.featured} id={featured.anchor}>
          <div className={styles.featuredMedia}>
            {featured.heroImagePath ? (
              <>
                <Image
                  src={featured.heroImagePath}
                  alt={featured.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 780px) calc(100vw - 32px), 52vw"
                />
                <span className={styles.mediaShade} aria-hidden="true" />
                {featured.heroImageCredit ? (
                  <span className={styles.imageCredit}>{featured.heroImageCredit}</span>
                ) : null}
              </>
            ) : (
              <div className={styles.datePoster} aria-hidden="true">
                <strong>{featured.dateParts.day}</strong>
                <span>{featured.dateParts.month}</span>
                <small>{featured.dateParts.year}</small>
              </div>
            )}

            <div className={styles.liveBadge}>{featured.urgencyLabel || 'PRÓXIMA'}</div>
            <div className={styles.featuredDate}>
              <strong>{featured.dateParts.day}</strong>
              <span>{featured.dateParts.month}</span>
            </div>
          </div>

          <div className={styles.featuredCopy}>
            <span className={styles.featuredLocation}>{featured.municipality || 'Sevilla y provincia'}</span>
            <h2><Link href={`/extraordinarias/${featured.slug}`}>{featured.title}</Link></h2>
            <strong className={styles.featuredContext}>{featured.brotherhoodName}</strong>
            {featured.reason ? <p>{featured.reason}</p> : null}

            <div
              className={styles.featuredEssentials}
              style={featured.returnTime ? { gridTemplateColumns: '1.35fr .65fr .65fr' } : undefined}
            >
              <div>
                <span>Cuándo</span>
                <strong>{featured.dateParts.weekdayLabel || featured.dateParts.label}</strong>
              </div>
              <div>
                <span>Salida</span>
                <strong>{featured.departureTime || 'Por confirmar'}</strong>
              </div>
              {featured.returnTime ? (
                <div>
                  <span>Entrada</span>
                  <strong>{featured.returnTime}</strong>
                </div>
              ) : null}
            </div>

            {featured.music.length ? (
              <div className={`${styles.featuredMusic} ${styles.featuredMusicSpotlight}`}>
                <span>Acompañamiento musical</span>
                <div>
                  {featured.music.map((band, index) => (
                    <p key={band.id || `${featured.id}-${band.name}`}>
                      <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
                      <span>
                        <strong>{band.name}</strong>
                        {band.context ? <small>{band.context}</small> : null}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={styles.featuredActions}>
              <Link className={styles.featuredGuide} href={`/extraordinarias/${featured.slug}`}>
                Ver guía completa <span>→</span>
              </Link>
              <a className={styles.featuredJump} href="#calendario-extraordinarias">
                Próximas fechas <span>↓</span>
              </a>
            </div>
          </div>
        </article>
      ) : null}

      <section className={styles.explorer} id="calendario-extraordinarias" aria-labelledby="extraordinarias-list-title">
        <div className={styles.explorerHead}>
          <div>
            <span>Calendario</span>
            <h2 id="extraordinarias-list-title">Qué viene después</h2>
          </div>
          <p>Consulta las salidas extraordinarias por fecha, territorio y año. La información crece a medida que se documentan horarios, recorrido y música.</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.segmented} aria-label="Filtrar por estado">
            <button
              type="button"
              className={status === 'upcoming' ? styles.active : ''}
              onClick={() => setStatus('upcoming')}
              aria-pressed={status === 'upcoming'}
            >
              Próximas <small>{upcoming.length}</small>
            </button>
            <button
              type="button"
              className={status === 'celebrated' ? styles.active : ''}
              onClick={() => setStatus('celebrated')}
              aria-pressed={status === 'celebrated'}
            >
              Celebradas <small>{celebrated.length}</small>
            </button>
          </div>

          <div className={styles.segmented} aria-label="Filtrar por territorio">
            {[
              ['all', 'Todas'],
              ['capital', 'Sevilla capital'],
              ['province', 'Provincia'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={territory === value ? styles.active : ''}
                onClick={() => setTerritory(value)}
                aria-pressed={territory === value}
              >
                {label}
              </button>
            ))}
          </div>

          <label className={styles.yearFilter}>
            <span className="sr-only">Filtrar por año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">Todos los años</option>
              {years.map((item) => <option value={String(item)} key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className={styles.resultHead}>
          <div>
            <strong>{plural(filteredTotal, 'extraordinaria', 'extraordinarias')}</strong>
            <span>{status === 'upcoming' ? 'por celebrar' : 'ya celebradas'} · Sevilla y provincia</span>
          </div>
          {territory !== 'all' || year !== 'all' ? (
            <button
              type="button"
              onClick={() => {
                setTerritory('all')
                setYear('all')
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {monthGroups.length ? (
          <div className={styles.months}>
            {monthGroups.map((group) => (
              <section className={styles.monthGroup} key={group.key} aria-labelledby={`month-${group.key}`}>
                <div className={styles.monthHeading}>
                  <h3 id={`month-${group.key}`}>{group.label}</h3>
                  <span>{group.items.length}</span>
                </div>

                <div className={styles.list}>
                  {group.items.map((outing) => (
                    <article className={styles.card} id={outing.anchor} key={outing.id}>
                      <time className={styles.dateBlock} dateTime={outing.date}>
                        <strong>{outing.dateParts.day}</strong>
                        <span>{outing.dateParts.month}</span>
                      </time>

                      <div className={styles.cardMain}>
                        <div className={styles.cardTopline}>
                          {outing.municipality ? <span>{outing.municipality}</span> : null}
                          <small data-status={outing.eventStatus}>{statusLabel(outing)}</small>
                        </div>
                        <h4><Link href={`/extraordinarias/${outing.slug}`}>{outing.title}</Link></h4>
                        {outing.brotherhoodName ? <strong className={styles.organizer}>{outing.brotherhoodName}</strong> : null}
                        {outing.reason ? <p>{outing.reason}</p> : null}

                        {outing.music.length ? (
                          <div className={styles.cardMusic}>
                            <span>Música</span>
                            <div>
                              {outing.music.map((band) => (
                                <p key={band.id || `${outing.id}-${band.name}`}>
                                  <strong>{band.name}</strong>
                                  {band.context ? <small>{band.context}</small> : null}
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div className={styles.cardFooter}>
                          <div className={styles.cardFacts}>
                            {outing.departureTime ? <span><b>Salida</b>{outing.departureTime}</span> : null}
                            {outing.returnTime ? <span><b>Entrada</b>{outing.returnTime}</span> : null}
                          </div>
                          <div className={styles.signals} aria-label="Información disponible">
                            {outing.routeSummary ? <span>Recorrido publicado</span> : null}
                            {outing.music.length ? <span>Música confirmada</span> : null}
                          </div>
                        </div>
                        <Link className={styles.cardDetailLink} href={`/extraordinarias/${outing.slug}`}>
                          Ver guía <span>→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay extraordinarias con estos criterios</strong>
            <span>{status === 'upcoming' ? 'La próxima salida destacada puede estar ya arriba.' : 'Prueba otro año o territorio.'}</span>
          </div>
        )}
      </section>
    </div>
  )
}
