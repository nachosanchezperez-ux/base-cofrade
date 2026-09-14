'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from '@/app/agenda-cofrade/agenda-cofrade.module.css'

function groupByMonth(items) {
  const groups = []
  const index = new Map()

  for (const item of items) {
    if (!index.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      groups.push(group)
      index.set(item.monthKey, group)
    }
    index.get(item.monthKey).items.push(item)
  }

  return groups
}

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelado'
  if (item.isPast) return 'Celebrado'
  if (!item.date) return 'Fecha por confirmar'
  return 'Anunciado'
}

function Visual({ item }) {
  if (item.heroImagePath) {
    return (
      <div className={styles.cardVisual}>
        <Image
          src={item.heroImagePath}
          alt={item.heroImageAlt}
          fill
          sizes="(max-width: 720px) 84px, 132px"
          className={styles.cardPhoto}
        />
      </div>
    )
  }

  if (item.crestPath) {
    return (
      <div className={`${styles.cardVisual} ${styles.crestVisual}`} aria-hidden="true">
        <Image
          src={item.crestPath}
          alt=""
          fill
          sizes="(max-width: 720px) 72px, 112px"
          className={styles.cardCrest}
        />
      </div>
    )
  }

  return null
}

export default function RosaryDirectory({ outings }) {
  const [status, setStatus] = useState('upcoming')
  const [territory, setTerritory] = useState('all')

  const upcoming = useMemo(
    () => outings.filter((item) => item.isUpcoming && !item.isCancelled),
    [outings]
  )
  const archive = useMemo(
    () => outings.filter((item) => item.isPast || item.isCancelled).reverse(),
    [outings]
  )

  const filtered = useMemo(() => {
    const source = status === 'upcoming' ? upcoming : archive
    return source.filter((item) => territory === 'all' || item.scope === territory)
  }, [archive, status, territory, upcoming])

  const groups = useMemo(() => groupByMonth(filtered), [filtered])

  return (
    <section id="rosarios" className={styles.directory} aria-labelledby="rosarios-title">
      <div className={styles.sectionHead}>
        <div>
          <span>Calendario</span>
          <h2 id="rosarios-title">Rosarios públicos</h2>
        </div>
        <p>Solo recorridos por las calles presididos por una imagen o Simpecado.</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.segmented} aria-label="Filtrar rosarios por estado">
          <button type="button" className={status === 'upcoming' ? styles.active : ''} aria-pressed={status === 'upcoming'} onClick={() => setStatus('upcoming')}>
            Próximos <small>{upcoming.length}</small>
          </button>
          <button type="button" className={status === 'archive' ? styles.active : ''} aria-pressed={status === 'archive'} onClick={() => setStatus('archive')}>
            Archivo <small>{archive.length}</small>
          </button>
        </div>

        <div className={styles.segmented} aria-label="Filtrar rosarios por territorio">
          {[
            ['all', 'Todos'],
            ['capital', 'Sevilla capital'],
            ['province', 'Provincia'],
          ].map(([value, label]) => (
            <button type="button" key={value} className={territory === value ? styles.active : ''} aria-pressed={territory === value} onClick={() => setTerritory(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultSummary} aria-live="polite">
        <strong>{filtered.length} {filtered.length === 1 ? 'rosario' : 'rosarios'}</strong>
        <span>{status === 'upcoming' ? 'anunciados' : 'documentados'} · Sevilla y provincia</span>
      </div>

      {groups.length ? (
        <div className={styles.months}>
          {groups.map((group) => (
            <section className={styles.monthGroup} key={group.key} aria-labelledby={`rosarios-${group.key}`}>
              <div className={styles.monthHeading}>
                <h3 id={`rosarios-${group.key}`}>{group.label}</h3>
                <span>{group.items.length}</span>
              </div>

              <div className={styles.cards}>
                {group.items.map((item) => (
                  <article className={styles.card} key={item.id}>
                    <time className={styles.dateBlock} dateTime={item.date || undefined}>
                      <strong>{item.dateInfo.day}</strong>
                      <span>{item.dateInfo.month}</span>
                      {item.dateInfo.year ? <small>{item.dateInfo.year}</small> : null}
                    </time>

                    <div className={styles.cardBody}>
                      <div className={styles.cardTopline}>
                        <span>{item.mode}</span>
                        {item.isExtraordinary ? <b>Extraordinario</b> : null}
                        <small data-status={item.eventStatus}>{statusLabel(item)}</small>
                      </div>
                      <h4>{item.detailHref ? <Link href={item.detailHref}>{item.title}</Link> : item.title}</h4>
                      <p className={styles.organizer}>{item.brotherhoodName}</p>

                      <div className={styles.cardFacts}>
                        <span><b>Localidad</b>{item.municipality || 'Por confirmar'}</span>
                        <span><b>Horario</b>{item.departureTime ? `${item.departureTime}${item.returnTime ? `–${item.returnTime}` : ''} h` : 'Por confirmar'}</span>
                      </div>

                      {item.routeSummary ? <p className={styles.routePreview}>{item.routeSummary}</p> : null}

                      <div className={styles.cardActions}>
                        {item.detailHref ? <Link href={item.detailHref}>Ver ficha <span>→</span></Link> : null}
                        {item.brotherhoodHref ? <Link href={item.brotherhoodHref}>Hermandad</Link> : null}
                      </div>
                    </div>

                    <Visual item={item} />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay rosarios en esta selección</strong>
          <p>Prueba con otro territorio o consulta el archivo.</p>
        </div>
      )}
    </section>
  )
}
