import Link from 'next/link'
import styles from '@/app/agenda-cofrade/agenda-cofrade.module.css'
import v4Styles from '@/app/agenda-cofrade/agenda-cofrade-v4.module.css'

export default function AgendaCofradeNav() {
  return (
    <nav className={`${styles.agendaNav} ${v4Styles.agendaNavV4}`} aria-label="Calendarios de Hilo Cofrade">
      <div className="shell">
        <Link data-section="agenda" className={v4Styles.navSelected} href="/agenda-cofrade#agenda" aria-current="page">Agenda</Link>
        <Link data-section="extraordinary" href="/extraordinarias">Extraordinarias</Link>
        <Link data-section="glories" href="/procesiones-de-gloria">Glorias</Link>
        <Link data-section="crew" href="/igualas-y-ensayos">Igualás y ensayos</Link>
      </div>
    </nav>
  )
}
