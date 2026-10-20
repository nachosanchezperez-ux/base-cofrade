import Link from 'next/link'
import { agendaThreadLinks } from '@/lib/agenda-event-relations'
import styles from './AgendaEventThread.module.css'

// «El hilo» de un acto: Hermandad, imágenes, pasos, bandas y guía local, con
// el nombre visible y su tipo encima. Solo relaciones con ficha publicada.
// La analítica existente lo registra como related_content_click (agenda_hilo).
export default function AgendaEventThread({ item, includeMunicipality = false, className = '' }) {
  const links = agendaThreadLinks(item, { includeMunicipality })
  if (!links.length) return null

  return (
    <nav
      className={`${styles.thread} ${className}`}
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
