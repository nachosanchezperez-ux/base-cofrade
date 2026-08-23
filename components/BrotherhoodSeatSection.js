import Link from 'next/link'
import styles from './BrotherhoodSeatSection.module.css'

function titleCase(value = '') {
  const text = String(value).trim()
  if (!text) return 'Lugar de culto'

  return text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function verifiedLabel(value = '') {
  if (!value) return null

  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  const age = Math.max(0, Math.floor((today.getTime() - date.getTime()) / 86400000))
  const formatted = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

  return {
    text: age > 180 ? `Última comprobación · ${formatted}` : `Horario verificado · ${formatted}`,
    stale: age > 180,
  }
}

function directionsUrl(seat) {
  const hasCoordinates = Number.isFinite(seat.latitud) && Number.isFinite(seat.longitud)
  const query = hasCoordinates
    ? `${seat.latitud},${seat.longitud}`
    : [seat.nombre, seat.direccion, seat.localidad, seat.provincia].filter(Boolean).join(', ')

  if (!query) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function periodLabel(item) {
  if (item.desde && item.hasta) return `${item.desde}–${item.hasta}`
  if (item.desde) return `Desde ${item.desde}`
  if (item.hasta) return `Hasta ${item.hasta}`
  return 'Periodo documentado'
}

export default function BrotherhoodSeatSection({ seat }) {
  if (!seat?.nombre) return null

  const verification = verifiedLabel(seat.horarioVerificadoEn)
  const mapUrl = directionsUrl(seat)
  const hasCoordinates = Number.isFinite(seat.latitud) && Number.isFinite(seat.longitud)

  return (
    <section className={styles.section} id="sede">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Sede canónica</span>
            <h2>Sede y visita</h2>
          </div>
          <p>
            Dónde se encuentra la Hermandad y la información práctica para acercarse a su sede.
            Los cultos y celebraciones mantienen su calendario propio dentro de la ficha.
          </p>
        </header>

        <div className={styles.mainGrid}>
          <article className={styles.placeCard}>
            <div className={styles.placeTopline}>
              <span>{titleCase(seat.tipo)}</span>
              {seat.localidad ? <small>{seat.localidad}{seat.provincia && seat.provincia !== seat.localidad ? ` · ${seat.provincia}` : ''}</small> : null}
            </div>

            <div className={styles.placeIdentity}>
              <span className={styles.pin} aria-hidden="true"><i /></span>
              <div>
                <h3>{seat.nombre}</h3>
                {seat.direccion ? <p>{seat.direccion}</p> : <p className={styles.pending}>Dirección pendiente de documentar</p>}
              </div>
            </div>

            <div className={styles.placeActions}>
              {mapUrl ? (
                <a href={mapUrl} target="_blank" rel="noreferrer" className={styles.primaryAction}>
                  Cómo llegar <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {hasCoordinates ? (
                <span className={styles.coordinates}>{seat.latitud.toFixed(5)} · {seat.longitud.toFixed(5)}</span>
              ) : (
                <span className={styles.coordinates}>Ubicación exacta pendiente</span>
              )}
            </div>
          </article>

          <article className={styles.hoursCard}>
            <div className={styles.hoursHeader}>
              <span>Horario de apertura</span>
              {verification ? (
                <small className={verification.stale ? styles.stale : styles.verified}>{verification.text}</small>
              ) : null}
            </div>

            {seat.horarioApertura ? (
              <p className={styles.hoursText}>{seat.horarioApertura}</p>
            ) : (
              <div className={styles.hoursPending}>
                <strong>Pendiente de documentar</strong>
                <p>El horario habitual de apertura todavía no está publicado en Hilo Cofrade.</p>
              </div>
            )}

            <div className={styles.hoursFootnote}>
              <span aria-hidden="true">✦</span>
              <p>Este horario se refiere a la apertura habitual del templo. Misas, cultos y actos extraordinarios se documentan por separado.</p>
            </div>
          </article>
        </div>

        {seat.hermandadesCompartidas?.length > 0 ? (
          <div className={styles.shared}>
            <div className={styles.sharedHeading}>
              <span>También en esta sede</span>
              <small>{seat.hermandadesCompartidas.length} {seat.hermandadesCompartidas.length === 1 ? 'Hermandad relacionada' : 'Hermandades relacionadas'}</small>
            </div>
            <div className={styles.sharedLinks}>
              {seat.hermandadesCompartidas.map((brotherhood) => (
                <Link href={`/hermandades/${brotherhood.slug}`} key={brotherhood.id}>
                  <span>{brotherhood.nombre}</span>
                  <b aria-hidden="true">→</b>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {seat.sedesHistoricas?.length > 0 ? (
          <details className={styles.history}>
            <summary>
              <span>Historia de sus sedes</span>
              <small>{seat.sedesHistoricas.length} {seat.sedesHistoricas.length === 1 ? 'etapa documentada' : 'etapas documentadas'}</small>
              <b aria-hidden="true">＋</b>
            </summary>
            <div className={styles.historyList}>
              {seat.sedesHistoricas.map((item) => (
                <article key={item.id}>
                  <span>{periodLabel(item)}</span>
                  <div>
                    <strong>{item.nombre}</strong>
                    <p>{[titleCase(item.tipo), item.direccion].filter(Boolean).join(' · ')}</p>
                  </div>
                </article>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </section>
  )
}
