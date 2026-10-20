import Link from 'next/link'
import { agendaThreadLinks } from '@/lib/agenda-event-relations'
import styles from './AgendaEventThread.module.css'

// «El hilo» de un acto: Hermandad, imágenes, pasos, bandas y guía local, con
// el nombre visible y su tipo encima. Solo relaciones con ficha publicada.
// La analítica existente lo registra como related_content_click (agenda_hilo).
// `compact` (listas de periodo): una línea por enlace y lo esencial (una imagen,
// un paso y una banda). El detalle de la Agenda completa muestra el hilo entero.
export default function AgendaEventThread({ item, includeMunicipality = false, compact = false, className = '' }) {
  const links = agendaThreadLinks(item, compact
    ? { includeMunicipality, maxImages: 1, maxSteps: 1, maxBands: 1 }
    : { includeMunicipality })
  if (!links.length) return null

  return (
    <nav
      className={`${styles.thread} ${compact ? styles.compact : ''} ${className}`}
      aria-label={`Relacionado con ${item.title || 'este acto'}`}
      data-analytics-related-section="agenda_hilo"
      data-analytics-source-type="agenda"
    >
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} data-kind={link.kind} data-analytics-destination-name={link.name}>
              <small>{link.label}</small>
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
