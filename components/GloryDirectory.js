'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './GloryDirectory.module.css'

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function groupByMonth(items) {
  const groups = []
  const index = new Map()

  for (const item of items) {
    if (!index.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      index.set(item.monthKey, group)
      groups.push(group)
    }
    index.get(item.monthKey).items.push(item)
  }

  return groups
}

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelada'
  if (item.isCelebrated) return 'Celebrada'
  if (item.isPast) return 'Fecha pasada'
  return item.urgencyLabel || 'Próxima'
}

export default function GloryDirectory({ outings }) {
  const [status, setStatus] = useState('upcoming')
  const [territory, setTerritory] = useState('all')
  const [year, setYear] = useState('all')

  const upcoming = useMemo(
    () => outings.filter((item) => item.isUpcoming && !item.isCancelled),
    [outings]
  )
  const celebrated = useMemo(
    () => outings.filter((item) => (item.isCelebrated || item.isPast) && !item.isCancelled),
    [outings]
  )
  const years = useMemo(
    () => [...new Set(outings.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a),
    [outings]
  )
  const featured = upcoming[0] || null

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

  return (
    <div className={styles.directory}>
      {featured ? (
        <article className={styles.featured}>
          <div className={styles.featuredVisual}>
            <div className={styles.featuredDate} aria-label={featured.dateParts.label}>
              <strong>{featured.dateParts.day}</strong>
              <span>{featured.dateParts.month}</span>
              <small>{featured.dateParts.year}</small>
            </div>
            {featured.crestPath ? (
              <Image
                src={featured.crestPath}
                alt={`Escudo de ${featured.brotherhoodName}`}
                width={150}
                height={150}
                className={styles.featuredCrest}
                sizes="150px"
              />
            ) : null}
            <span className={styles.featuredBadge}>{featured.urgencyLabel || 'PRÓXIMA'}</span>
          </div>

          <div className={styles.featuredCopy}>
            <span className={styles.kicker}>Próxima procesión</span>
            <h2><Link href={featured.detailHref}>{featured.title}</Link></h2>
            {featured.brotherhoodHref ? (
              <Link className={styles.brotherhoodLink} href={featured.brotherhoodHref}>
                {featured.brotherhoodName}
              </Link>
            ) : (
              <strong className={styles.brotherhoodLink}>{featured.brotherhoodName}</strong>
            )}
            <p className={styles.location}>{featured.municipality || 'Localidad por confirmar'}</p>

            <div className={styles.featuredFacts}>
              <div>
                <span>Fecha</span>
                <strong>{featured.dateParts.weekdayLabel || featured.dateParts.label}</strong>
              </div>
              <div>
                <span>Salida</span>
                <strong>{featured.departureTime || 'Por confirmar'}</strong>
              </div>
              <div>
                <span>Entrada</span>
                <strong>{featured.returnTime || 'Por confirmar'}</strong>
              </div>
            </div>

            {featured.description ? <p className={styles.featuredDescription}>{featured.description}</p> : null}

            <Link className={styles.primaryAction} href={featured.detailHref}>
              Ver procesión <span>→</span>
            </Link>
          </div>
        </article>
      ) : null}

      <section className={styles.explorer} aria-labelledby="calendario-glorias">
        <div className={styles.explorerHead}>
          <div>
            <span className={styles.kicker}>Calendario</span>
            <h2 id="calendario-glorias">Procesiones por meses</h2>
          </div>
          <p>Consulta las procesiones por fecha, territorio y año.</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.segmented} aria-label="Filtrar por estado">
            <button
              type="button"
              className={status === 'upcoming' ? styles.active : ''}
              aria-pressed={status === 'upcoming'}
              onClick={() => setStatus('upcoming')}
            >
              Próximas <small>{upcoming.length}</small>
            </button>
            <button
              type="button"
              className={status === 'celebrated' ? styles.active : ''}
              aria-pressed={status === 'celebrated'}
              onClick={() => setStatus('celebrated')}
            >
              Archivo <small>{celebrated.length}</small>
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
                aria-pressed={territory === value}
                onClick={() => setTerritory(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <label className={styles.yearFilter}>
            <span className="sr-only">Filtrar por año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">Todos los años</option>
              {years.map((item) => <option key={item} value={String(item)}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className={styles.resultHead}>
          <div>
            <strong>{plural(filtered.length, 'procesión', 'procesiones')}</strong>
            <span>{status === 'upcoming' ? 'por celebrar' : 'en archivo'} · Sevilla y provincia</span>
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
              <section className={styles.monthGroup} key={group.key} aria-labelledby={`gloria-${group.key}`}>
                <div className={styles.monthHeading}>
                  <h3 id={`gloria-${group.key}`}>{group.label}</h3>
                  <span>{group.items.length}</span>
                </div>

                <div className={styles.list}>
                  {group.items.map((outing) => (
                    <article className={styles.card} key={outing.id}>
                      <time className={styles.dateBlock} dateTime={outing.date}>
                        <strong>{outing.dateParts.day || '—'}</strong>
                        <span>{outing.dateParts.month || 'FECHA'}</span>
                      </time>

                      <div className={styles.cardMain}>
                        <div className={styles.cardTopline}>
                          <span>{outing.municipality || 'Localidad por confirmar'}</span>
                          <small data-status={outing.eventStatus}>{statusLabel(outing)}</small>
                        </div>
                        <h4><Link href={outing.detailHref}>{outing.title}</Link></h4>
                        {outing.brotherhoodHref ? (
                          <Link className={styles.organizer} href={outing.brotherhoodHref}>{outing.brotherhoodName}</Link>
                        ) : (
                          <strong className={styles.organizer}>{outing.brotherhoodName}</strong>
                        )}

                        <div className={styles.cardFooter}>
                          <div className={styles.cardFacts}>
                            {outing.departureTime ? <span><b>Salida</b>{outing.departureTime}</span> : null}
                            {outing.returnTime ? <span><b>Entrada</b>{outing.returnTime}</span> : null}
                            {outing.routeSummary ? <span><b>Recorrido</b>Disponible</span> : null}
                          </div>
                          <Link className={styles.detailLink} href={outing.detailHref}>
                            Ver ficha <span>→</span>
                          </Link>
                        </div>
                      </div>

                      {outing.crestPath ? (
                        <div className={styles.cardCrest} aria-hidden="true">
                          <Image src={outing.crestPath} alt="" width={78} height={78} sizes="78px" />
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay procesiones con estos filtros</strong>
            <span>Prueba con otro año o territorio.</span>
          </div>
        )}
      </section>
    </div>
  )
}
