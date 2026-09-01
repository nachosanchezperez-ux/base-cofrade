import Link from 'next/link'
import CofradeTypeBadges from '@/components/CofradeTypeBadges'
import { publicText } from '@/lib/supabase/public-entity-page'
import styles from './BrotherhoodOverviewV2.module.css'

function verifiedLabel(value = '') {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function directionsUrl(seat) {
  if (!seat) return ''
  const hasCoordinates = Number.isFinite(seat.latitud) && Number.isFinite(seat.longitud)
  const query = hasCoordinates
    ? `${seat.latitud},${seat.longitud}`
    : [seat.nombre, seat.direccion, seat.localidad, seat.provincia].filter(Boolean).join(', ')
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : ''
}

function periodLabel(item) {
  if (item.desde && item.hasta) return `${item.desde}–${item.hasta}`
  if (item.desde) return `Desde ${item.desde}`
  if (item.hasta) return `Hasta ${item.hasta}`
  return 'Periodo documentado'
}

function scheduleKind(value = '') {
  const line = String(value).toLocaleLowerCase('es')
  if (/misa|eucarist/.test(line)) return 'mass'
  if (/despacho|secretar|mayordom|oficina/.test(line)) return 'office'
  if (/exposici|adoraci|rosario|culto/.test(line)) return 'devotion'
  if (/apertura|visita/.test(line)) return 'opening'
  return 'note'
}

function scheduleLines(value = '') {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separator = line.indexOf('·')
      const hasLabel = separator > 0 && separator < 42

      return {
        id: `${index}-${line}`,
        kind: scheduleKind(line),
        label: hasLabel ? line.slice(0, separator).trim() : '',
        value: hasLabel ? line.slice(separator + 1).trim() : line,
      }
    })
}

export default function BrotherhoodOverviewV2({ brotherhood, heroFactLabels = [] }) {
  const seat = brotherhood.sedeDetalle
  const types = brotherhood.tipos || []
  const members = publicText(brotherhood.datosJornada?.totalHermanos)
  const titularCount = brotherhood.imagenes?.length || 0
  const mapUrl = directionsUrl(seat)
  const verified = verifiedLabel(seat?.horarioVerificadoEn)
  const templeSchedule = scheduleLines(seat?.horarioApertura)
  const heroFacts = new Set(heroFactLabels)

  const identityFacts = [
    publicText(brotherhood.fundacion) ? { label: 'Fundación', value: publicText(brotherhood.fundacion) } : null,
    members ? { label: 'Hermanos', value: members } : null,
    titularCount ? { label: 'Titulares', value: String(titularCount) } : null,
  ].filter((fact) => fact && !heroFacts.has(fact.label))
  const showIdentity = identityFacts.length > 0 || types.length > 1
  const showSeat = Boolean(publicText(seat?.nombre))

  if (!showIdentity && !showSeat) return null

  return (
    <section className={styles.section} id="resumen">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Información práctica</span>
          <h2>{showSeat ? 'Sede y visita' : 'Datos principales'}</h2>
        </header>

        <div className={`${styles.grid} ${showIdentity && showSeat ? '' : styles.gridSingle}`}>
          {showIdentity ? (
            <article className={styles.identityCard}>
              <div className={styles.cardTopline}>
                <span>Datos complementarios</span>
                {types.length > 1 ? <CofradeTypeBadges tipos={types} compact /> : null}
              </div>

              {identityFacts.length ? (
                <dl className={styles.identityFacts} data-count={identityFacts.length}>
                  {identityFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          ) : null}

          {showSeat ? (
            <article className={styles.seatCard} aria-label="Sede canónica, horarios y visita">
              <div className={styles.cardTopline}>
                <span>Sede canónica</span>
                {seat.tipo ? <small>{String(seat.tipo).replaceAll('_', ' ')}</small> : null}
              </div>

              <div className={styles.seatIdentity}>
                <span className={styles.pin} aria-hidden="true"><i /></span>
                <div>
                  <h3>{publicText(seat.nombre)}</h3>
                  {publicText(seat.direccion) ? <p>{publicText(seat.direccion)}</p> : null}
                </div>
              </div>

              {seat.horarioApertura ? (
                <div className={styles.hours}>
                  <div className={styles.hoursHero}>
                    <span className={styles.clock} aria-hidden="true"><i /></span>
                    <div>
                      <small>Sede · Horarios del templo</small>
                      <strong>Planifica tu visita</strong>
                    </div>
                    {verified ? <span className={styles.verified}>Revisado · {verified}</span> : null}
                  </div>

                  <div className={styles.hoursList}>
                    {templeSchedule.map((item) => (
                      <div className={`${styles.hoursRow} ${styles[`hours_${item.kind}`]}`} key={item.id}>
                        <span className={styles.hoursMarker} aria-hidden="true" />
                        <p>
                          {item.label ? <b>{item.label}</b> : null}
                          <span>{item.value}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className={styles.hoursFooter}>
                    <span aria-hidden="true">✦</span>
                    <p>Comprueba los cultos extraordinarios antes de desplazarte.</p>
                  </div>
                </div>
              ) : null}

              <div className={styles.seatActions}>
                {mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer">Cómo llegar <span aria-hidden="true">↗</span></a> : null}
                {seat.localidad ? <span>{seat.localidad}{seat.provincia && seat.provincia !== seat.localidad ? ` · ${seat.provincia}` : ''}</span> : null}
              </div>

              {seat.hermandadesCompartidas?.length > 0 ? (
                <div className={styles.shared}>
                  <small>También en esta sede</small>
                  <div>
                    {seat.hermandadesCompartidas.map((item) => (
                      <Link href={`/hermandades/${item.slug}`} key={item.id}>{item.nombre} <span aria-hidden="true">→</span></Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {seat.sedesHistoricas?.length > 0 ? (
                <details className={styles.seatHistory}>
                  <summary>Historia de sus sedes <span aria-hidden="true">＋</span></summary>
                  <div>
                    {seat.sedesHistoricas.map((item) => (
                      <article key={item.id}>
                        <small>{periodLabel(item)}</small>
                        <strong>{item.nombre}</strong>
                        {item.direccion ? <p>{item.direccion}</p> : null}
                      </article>
                    ))}
                  </div>
                </details>
              ) : null}
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}
