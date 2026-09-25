import Link from 'next/link'
import styles from '@/app/agenda-cofrade/agenda-cofrade.module.css'
import v4Styles from '@/app/agenda-cofrade/agenda-cofrade-v4.module.css'

export default function AgendaCofradeNav({ activeSection = 'agenda', sticky = true }) {
  const selectedClass = (section) => activeSection === section ? v4Styles.navSelected : undefined
  const currentPage = (section) => activeSection === section ? 'page' : undefined

  return (
    <nav className={`${styles.agendaNav} ${v4Styles.agendaNavV4}`} data-sticky={sticky ? 'true' : 'false'} aria-label="Agendas de Hilo Cofrade">
      <div className="shell">
        <Link data-section="agenda" className={selectedClass('agenda')} href="/agenda-cofrade#agenda" aria-current={currentPage('agenda')}>Agenda Cofrade</Link>
        <Link data-section="extraordinary" className={selectedClass('extraordinary')} href="/extraordinarias" aria-current={currentPage('extraordinary')}>Extraordinarias</Link>
        <Link data-section="glories" className={selectedClass('glories')} href="/procesiones-de-gloria" aria-current={currentPage('glories')}>Glorias</Link>
        <Link data-section="crew" className={selectedClass('crew')} href="/igualas-y-ensayos" aria-current={currentPage('crew')}>Igualás y ensayos</Link>
      </div>
    </nav>
  )
}
