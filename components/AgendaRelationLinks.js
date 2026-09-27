import Link from 'next/link'
import { agendaMunicipalityHref, brotherhoodAgendaHref, uniqueAgendaRelations } from '@/lib/agenda-relations'
import styles from './AgendaRelationLinks.module.css'

export default function AgendaRelationLinks({
  brotherhoodName = '',
  brotherhoodHref = '',
  municipality = '',
  calendarHref = '',
  calendarLabel = 'Calendario',
  bands = [],
  steps = [],
}) {
  const municipalityHref = agendaMunicipalityHref(municipality)
  const linkedBands = uniqueAgendaRelations(bands)
  const linkedSteps = uniqueAgendaRelations(steps)
  const moreDatesHref = brotherhoodAgendaHref(brotherhoodHref)

  const items = [
    brotherhoodHref && brotherhoodName ? { label: 'Hermandad', name: brotherhoodName, href: brotherhoodHref } : null,
    municipalityHref && municipality ? { label: 'Localidad', name: municipality, href: municipalityHref } : null,
    ...linkedBands.map((band) => ({ label: 'Banda', name: band.name, href: band.href })),
    ...linkedSteps.map((step) => ({ label: 'Paso', name: step.name, href: step.href })),
    moreDatesHref ? { label: 'Más citas', name: 'Agenda de la Hermandad', href: moreDatesHref } : null,
    calendarHref ? { label: 'Calendario', name: calendarLabel, href: calendarHref } : null,
  ].filter(Boolean)

  if (!items.length) return null

  return (
    <aside className={styles.wrap} aria-label="Relaciones de este acto" data-analytics-related-section="hilo_relacional">
      <div className={`shell ${styles.inner}`}>
        <div className={styles.heading}>
          <span>Hilo relacional</span>
          <strong>Relacionado con este acto</strong>
        </div>
        <nav className={styles.links}>
          {items.map((item) => (
            <Link href={item.href} key={`${item.label}-${item.href}`} data-analytics-destination-name={item.name}>
              <small>{item.label}</small>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
