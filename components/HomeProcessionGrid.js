import Link from 'next/link'
import { agendaMunicipalityHref } from '@/lib/agenda-relations'
import styles from './HomeProcessionGrid.module.css'

function outingHref(item) {
  return item?.href || item?.calendarHref || '/agenda-cofrade'
}

export default function HomeProcessionGrid({ outings = [] }) {
  const visible = outings.slice(0, 4)
  if (!visible.length) return null

  return (
    <div className={styles.grid} data-home-procession-layout="equal">
      {visible.map((outing) => {
        const municipalityHref = agendaMunicipalityHref(outing.municipality)
        return (
          <article className={styles.card} key={outing.id}>
            <div className={styles.topline}>
              <span>{outing.typeLabel || 'Procesión'}</span>
              <time dateTime={outing.date}>
                <strong>{outing.dateParts?.day || ''}</strong>
                <small>{outing.dateParts?.month || ''}</small>
              </time>
            </div>
            <h3>{outing.title}</h3>
            <p>{[outing.municipality, outing.brotherhoodName].filter(Boolean).join(' · ')}</p>
            <div className={styles.timing}>
              {outing.departureTime ? <span>Salida <strong>{outing.departureTime}</strong></span> : null}
              {outing.returnTime ? <span>Entrada <strong>{outing.returnTime}</strong></span> : null}
            </div>
            <div className={styles.actions}>
              <Link href={outingHref(outing)}>Abrir guía <span aria-hidden="true">→</span></Link>
              {municipalityHref ? <Link href={municipalityHref}>Guía de {outing.municipality}</Link> : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
