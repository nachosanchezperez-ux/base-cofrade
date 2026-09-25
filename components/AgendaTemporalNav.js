import Link from 'next/link'
import styles from './AgendaTemporalNav.module.css'

const links = [
  { key: 'today', href: '/agenda-cofrade/hoy', label: 'Hoy', copy: 'Qué ver hoy' },
  { key: 'tomorrow', href: '/agenda-cofrade/manana', label: 'Mañana', copy: 'Planifica mañana' },
  { key: 'weekend', href: '/agenda-cofrade/fin-de-semana', label: 'Fin de semana', copy: 'Sábado y domingo' },
]

export default function AgendaTemporalNav({ active = '' }) {
  return (
    <nav className={styles.nav} aria-label="Agenda Cofrade por fecha">
      <div className="shell">
        <span>Consultar por fecha</span>
        <div>
          {links.map((item) => (
            <Link
              href={item.href}
              data-active={active === item.key ? 'true' : undefined}
              aria-current={active === item.key ? 'page' : undefined}
              key={item.key}
            >
              <strong>{item.label}</strong>
              <small>{item.copy}</small>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
