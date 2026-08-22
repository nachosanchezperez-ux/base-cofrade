'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import styles from './ExtraordinaryDirectory.module.css'

function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelada'
  if (item.isCelebrated) return 'Celebrada'
  return 'Próxima'
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
  const municipalities = useMemo(() => new Set(
    outings.map((item) => item.municipality).filter(Boolean)
  ).size, [outings])

  const filtered = useMemo(() => {
    const source = status === 'upcoming' ? upcoming : celebrated

    return source.filter((item) => {
      const matchesTerritory = territory === 'all'
        || (territory === 'capital' && item.scope === 'capital')
        || (territory === 'province' && item.scope === 'province')
      const matchesYear = year === 'all' || String(item.year) === year
      return matchesTerritory && matchesYear
    })
  }, [status, territory, year, upcoming, celebrated])

  const list = status === 'upcoming' && featured
    ? filtered.filter((item) => item.id !== featured.id)
    : filtered

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
                  sizes="(max-width: 780px) calc(100vw - 32px), 43vw"
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
            <div className={styles.featuredDate}>
              <strong>{featured.dateParts.day}</strong>
              <span>{featured.dateParts.month}</span>
            </div>
          </div>

          <div className={styles.featuredCopy}>
            <span className={styles.featuredEyebrow}>Próxima extraordinaria</span>
            <h2>{featured.title}</h2>
            <strong className={styles.featuredContext}>
              {[featured.brotherhoodName, featured.municipality].filter(Boolean).join(' · ')}
            </strong>
            {featured.reason ? <p>{featured.reason}</p> : null}

            <div className={styles.quickFacts}>
              <div>
                <span>Fecha</span>
                <strong>{featured.dateParts.weekdayLabel || featured.dateParts.label}</strong>
              </div>
              <div>
                <span>Salida</span>
                <strong>{featured.departureTime || 'Por confirmar'}</strong>
              </div>
              <div>
                <span>Localidad</span>
                <strong>{featured.municipality || 'Por documentar'}</strong>
              </div>
            </div>

            <a className={styles.featuredJump} href="#listado-extraordinarias">
              Ver calendario completo <span>↓</span>
            </a>
          </div>
        </article>
      ) : null}

      <div className={styles.summaryStrip} aria-label="Resumen del directorio">
        <div>
          <strong>{upcoming.length}</strong>
          <span>{upcoming.length === 1 ? 'próxima' : 'próximas'}</span>
        </div>
        <div>
          <strong>{celebrated.length}</strong>
          <span>{celebrated.length === 1 ? 'celebrada' : 'celebradas'}</span>
        </div>
        <div>
          <strong>{municipalities}</strong>
          <span>{municipalities === 1 ? 'localidad' : 'localidades'}</span>
        </div>
      </div>

      <section className={styles.explorer} id="listado-extraordinarias" aria-labelledby="extraordinarias-list-title">
        <div className={styles.explorerHead}>
          <div>
            <span>Agenda extraordinaria</span>
            <h2 id="extraordinarias-list-title">Todas, ordenadas para consultar rápido</h2>
          </div>
          <p>Filtra por estado, territorio y año. Los datos proceden de las salidas documentadas en Hilo Cofrade.</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup} aria-label="Filtrar por estado">
            <span className={styles.filterLabel}>Estado</span>
            <div className={styles.segmented}>
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
          </div>

          <div className={styles.filterGroup} aria-label="Filtrar por territorio">
            <span className={styles.filterLabel}>Territorio</span>
            <div className={styles.segmented}>
              {[
                ['all', 'Todas'],
                ['capital', 'Sevilla'],
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
          </div>

          <label className={styles.yearFilter}>
            <span className={styles.filterLabel}>Año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">Todos</option>
              {years.map((item) => <option value={String(item)} key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className={styles.resultHead}>
          <div>
            <strong>{plural(filtered.length, 'extraordinaria', 'extraordinarias')}</strong>
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

        {list.length ? (
          <div className={styles.list}>
            {list.map((outing) => (
              <article className={styles.card} id={outing.anchor} key={outing.id}>
                <time className={styles.dateBlock} dateTime={outing.date}>
                  <strong>{outing.dateParts.day}</strong>
                  <span>{outing.dateParts.month}</span>
                  <small>{outing.dateParts.year}</small>
                </time>

                <div className={styles.cardMain}>
                  <div className={styles.cardTopline}>
                    <span>{outing.municipality || 'Localidad por documentar'}</span>
                    <small data-status={outing.eventStatus}>{statusLabel(outing)}</small>
                  </div>
                  <h3>{outing.title}</h3>
                  <strong>{outing.brotherhoodName}</strong>
                  {outing.reason ? <p>{outing.reason}</p> : null}

                  <div className={styles.cardFacts}>
                    {outing.departureTime ? <span><b>Salida</b>{outing.departureTime}</span> : null}
                    {outing.returnTime ? <span><b>Entrada</b>{outing.returnTime}</span> : null}
                    {outing.origin ? <span><b>Origen</b>{outing.origin}</span> : null}
                    {outing.destination && outing.destination !== outing.origin
                      ? <span><b>Destino</b>{outing.destination}</span>
                      : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay más extraordinarias con estos criterios</strong>
            <span>
              {status === 'upcoming'
                ? 'La próxima extraordinaria destacada aparece arriba. Cambia los filtros para consultar el resto.'
                : 'Prueba otro año o territorio.'}
            </span>
          </div>
        )}
      </section>
    </div>
  )
}
