'use client'

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

function territoryLabel(item) {
  if (item.scope === 'capital') return 'Sevilla capital'
  return item.municipality ? `${item.municipality} · Provincia` : 'Provincia de Sevilla'
}

function groupByMonth(items) {
  const groups = []
  const byKey = new Map()

  for (const item of items) {
    const key = item.monthKey || `sin-fecha-${item.year || 'actual'}`
    const label = item.monthLabel || (item.year ? String(item.year) : 'Sin fecha')
    if (!byKey.has(key)) {
      const group = { key, label, items: [] }
      byKey.set(key, group)
      groups.push(group)
    }
    byKey.get(key).items.push(item)
  }

  return groups
}

function monthAnchor(key) {
  return `extraordinarias-${String(key || 'sin-fecha').replace(/[^a-z0-9-]/gi, '-')}`
}

export default function ExtraordinaryDirectory({ outings }) {
  const [status, setStatus] = useState('upcoming')
  const [territory, setTerritory] = useState('all')
  const [year, setYear] = useState('all')

  const upcoming = useMemo(() => outings.filter((item) => item.isUpcoming && !item.isCancelled), [outings])
  const celebrated = useMemo(() => outings.filter((item) => item.isCelebrated && !item.isCancelled), [outings])
  const years = useMemo(() => [...new Set(
    celebrated.map((item) => item.year).filter(Boolean)
  )].sort((a, b) => b - a), [celebrated])

  const statusSource = status === 'upcoming' ? upcoming : [...celebrated].reverse()
  const yearSource = useMemo(() => (
    status === 'celebrated' && year !== 'all'
      ? statusSource.filter((item) => String(item.year) === year)
      : statusSource
  ), [status, statusSource, year])

  const territoryCounts = useMemo(() => ({
    all: yearSource.length,
    capital: yearSource.filter((item) => item.scope === 'capital').length,
    province: yearSource.filter((item) => item.scope === 'province').length,
  }), [yearSource])

  const filtered = useMemo(() => yearSource.filter((item) => (
    territory === 'all' || item.scope === territory
  )), [territory, yearSource])

  const monthGroups = useMemo(() => groupByMonth(filtered), [filtered])
  const nextId = status === 'upcoming' ? filtered[0]?.id : null
  const territorySummary = territory === 'capital'
    ? 'Sevilla capital'
    : territory === 'province'
      ? 'Provincia de Sevilla'
      : 'Sevilla capital y provincia'

  return (
    <section className={styles.directory} id="calendario-extraordinarias" aria-labelledby="extraordinarias-list-title">
      <div className={styles.explorerHead}>
        <div>
          <span>Calendario</span>
          <h2 id="extraordinarias-list-title">{status === 'upcoming' ? 'Próximas extraordinarias' : 'Extraordinarias celebradas'}</h2>
        </div>
        <p>Elige el ámbito que quieras consultar. Las tarjetas indican de forma visible si la cita es en Sevilla capital o en un municipio de la provincia.</p>
      </div>

      <div className={styles.filters} aria-label="Filtros del calendario de extraordinarias">
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Estado</span>
          <div className={`${styles.segmented} ${styles.statusTabs}`} aria-label="Filtrar por estado">
            <button
              type="button"
              className={status === 'upcoming' ? styles.active : ''}
              onClick={() => {
                setStatus('upcoming')
                setYear('all')
              }}
              aria-pressed={status === 'upcoming'}
            >
              <span>Próximas</span><strong>{upcoming.length}</strong>
            </button>
            <button
              type="button"
              className={status === 'celebrated' ? styles.active : ''}
              onClick={() => setStatus('celebrated')}
              aria-pressed={status === 'celebrated'}
            >
              <span>Celebradas</span><strong>{celebrated.length}</strong>
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Dónde</span>
          <div className={`${styles.segmented} ${styles.territoryTabs}`} aria-label="Filtrar por territorio">
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
                <span>{label}</span><strong>{territoryCounts[value]}</strong>
              </button>
            ))}
          </div>
        </div>

        {status === 'celebrated' && years.length > 1 ? (
          <label className={styles.yearFilter}>
            <span className={styles.filterLabel}>Año</span>
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">Todos</option>
              {years.map((item) => <option value={String(item)} key={item}>{item}</option>)}
            </select>
          </label>
        ) : null}
      </div>

      <div className={styles.resultHead} aria-live="polite">
        <div>
          <strong>{plural(filtered.length, 'extraordinaria', 'extraordinarias')}</strong>
          <span>{territorySummary}</span>
        </div>
        {territory !== 'all' || year !== 'all' ? (
          <button
            type="button"
            onClick={() => {
              setTerritory('all')
              setYear('all')
            }}
          >
            Ver todo
          </button>
        ) : null}
      </div>

      {monthGroups.length > 1 ? (
        <nav className={styles.monthNav} aria-label="Ir directamente a un mes">
          {monthGroups.map((group) => (
            <a href={`#${monthAnchor(group.key)}`} key={group.key}>
              <span>{group.label}</span><strong>{group.items.length}</strong>
            </a>
          ))}
        </nav>
      ) : null}

      {monthGroups.length ? (
        <div className={styles.months}>
          {monthGroups.map((group) => (
            <section className={styles.monthGroup} id={monthAnchor(group.key)} key={group.key} aria-labelledby={`month-${group.key}`}>
              <div className={styles.monthHeading}>
                <h3 id={`month-${group.key}`}>{group.label}</h3>
                <span>{plural(group.items.length, 'cita', 'citas')}</span>
              </div>

              <div className={styles.list}>
                {group.items.map((outing) => {
                  const music = outing.music || []
                  return (
                    <article className={styles.card} id={outing.anchor} key={outing.id} data-scope={outing.scope}>
                      <time className={styles.dateBlock} dateTime={outing.date}>
                        <strong>{outing.dateParts.day}</strong>
                        <span>{outing.dateParts.month}</span>
                      </time>

                      <div className={styles.cardMain}>
                        <div className={styles.cardTopline}>
                          <span className={styles.territoryBadge} data-scope={outing.scope}>{territoryLabel(outing)}</span>
                          <small data-status={outing.eventStatus} data-next={outing.id === nextId ? 'true' : undefined}>{outing.id === nextId ? 'PRÓXIMA' : statusLabel(outing)}</small>
                        </div>

                        <h4><Link href={`/extraordinarias/${outing.slug}`}>{outing.title}</Link></h4>
                        {outing.brotherhoodName ? <strong className={styles.organizer}>{outing.brotherhoodName}</strong> : null}
                        {outing.reason ? <p className={styles.reason}>{outing.reason}</p> : null}

                        <div className={styles.cardFacts}>
                          {outing.departureTime ? <span><b>Salida</b>{outing.departureTime}</span> : null}
                          {outing.returnTime ? <span><b>Entrada</b>{outing.returnTime}</span> : null}
                          {outing.origin ? <span><b>Lugar</b>{outing.origin}</span> : null}
                        </div>

                        {music.length ? (
                          <div className={styles.musicLine}>
                            <b>Música</b>
                            <span>{music.map((band) => band.name).join(' · ')}</span>
                          </div>
                        ) : null}

                        <Link className={styles.cardDetailLink} href={`/extraordinarias/${outing.slug}`}>
                          Ver detalles <span>→</span>
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay extraordinarias con estos criterios</strong>
          <span>Prueba con otro ámbito o vuelve a mostrar todas las citas.</span>
        </div>
      )}
    </section>
  )
}
