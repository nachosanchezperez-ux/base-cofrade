import Link from 'next/link'
import styles from './AgendaTemporalNav.module.css'
import { adventSeason } from '@/lib/advent-season'

const baseLinks = [
  { key: 'today', href: '/agenda-cofrade/hoy', label: 'Hoy', copy: 'Qué ver hoy' },
  { key: 'tomorrow', href: '/agenda-cofrade/manana', label: 'Mañana', copy: 'Planifica mañana' },
  { key: 'weekend', href: '/agenda-cofrade/fin-de-semana', label: 'Fin de semana', copy: 'Sábado y domingo' },
]

const adventLink = { key: 'advent', href: '/agenda-cofrade/adviento', label: 'Adviento', copy: 'Hasta el 6 de enero' }

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

export default function AgendaTemporalNav({ active = '' }) {
  // El acceso a Adviento aparece del 1 de noviembre al 6 de enero.
  const links = adventSeason(madridToday())?.visible || active === 'advent' ? [...baseLinks, adventLink] : baseLinks
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
