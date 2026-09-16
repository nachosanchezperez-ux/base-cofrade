import Link from 'next/link'
import styles from '@/app/agenda-cofrade/agenda-cofrade.module.css'
import v4Styles from '@/app/agenda-cofrade/agenda-cofrade-v4.module.css'

export default function AgendaCofradeNav({ initialCategory = 'all' }) {
  const agendaNavSection = ['rosaries', 'devotions', 'concerts'].includes(initialCategory)
    ? initialCategory
    : 'agenda'
  const navClass = (section) => agendaNavSection === section ? v4Styles.navSelected : undefined
  const navCurrent = (section) => agendaNavSection === section ? 'page' : undefined

  return (
    <nav className={`${styles.agendaNav} ${v4Styles.agendaNavV4}`} aria-label="Secciones de la Agenda Cofrade">
      <div className="shell">
        <Link data-section="agenda" className={navClass('agenda')} href="/agenda-cofrade#agenda" aria-current={navCurrent('agenda')}>Agenda principal</Link>
        <Link data-section="extraordinary" href="/extraordinarias">Extraordinarias</Link>
        <Link data-section="glories" href="/procesiones-de-gloria">Glorias</Link>
        <Link data-section="rosaries" className={navClass('rosaries')} href="/agenda-cofrade?categoria=rosaries#agenda" aria-current={navCurrent('rosaries')}>Rosarios públicos</Link>
        <Link data-section="devotions" className={navClass('devotions')} href="/agenda-cofrade?categoria=devotions#agenda" aria-current={navCurrent('devotions')}>Besamanos</Link>
        <Link data-section="concerts" className={navClass('concerts')} href="/agenda-cofrade?categoria=concerts#agenda" aria-current={navCurrent('concerts')}>Conciertos</Link>
        <Link data-section="crew" href="/igualas-y-ensayos">Igualás y ensayos</Link>
      </div>
    </nav>
  )
}
