import Link from 'next/link'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getCrewEventDirectory } from '@/lib/supabase/crew-events'
import styles from './agenda-cofrade.module.css'
import v4Styles from './agenda-cofrade-v4.module.css'

export const revalidate = 300

const currentYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date())
const title = `Agenda cofrade de Sevilla y provincia ${currentYear}`
const description = 'Consulta procesiones, traslados, rosarios públicos, besamanos, besapiés y conciertos de bandas de hoy y este fin de semana en Sevilla y su provincia.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/agenda-cofrade' },
  openGraph: { title: pageTitle(title), description, url: '/agenda-cofrade' },
  twitter: { title: pageTitle(title), description },
}

export default async function AgendaCofradePage({ searchParams }) {
  const [agendaData, crewEvents, params] = await Promise.all([
    getAgendaCofrade(),
    getCrewEventDirectory(),
    searchParams,
  ])
  const { items, today } = agendaData
  const upcoming = items.filter((item) => item.isUpcoming && !item.isCancelled)
  const upcomingCrewCount = crewEvents.filter((item) => item.isUpcoming && !item.isCancelled).length

  const requestedCategory = String(params?.categoria || 'all')
  const initialCategory = ['all', 'processions', 'transfers', 'rosaries', 'devotions', 'concerts'].includes(requestedCategory)
    ? requestedCategory
    : 'all'
  const requestedPeriod = String(params?.periodo || 'upcoming')
  const initialPeriod = ['today', 'weekend', 'upcoming', 'archive'].includes(requestedPeriod)
    ? requestedPeriod
    : 'upcoming'
  const requestedTerritory = String(params?.territorio || 'all')
  const initialTerritory = ['all', 'capital', 'province'].includes(requestedTerritory)
    ? requestedTerritory
    : 'all'
  const agendaNavSection = ['rosaries', 'devotions', 'concerts'].includes(initialCategory)
    ? initialCategory
    : 'agenda'
  const navClass = (section) => agendaNavSection === section ? v4Styles.navSelected : undefined
  const navCurrent = (section) => agendaNavSection === section ? 'page' : undefined

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Agenda Cofrade', path: '/agenda-cofrade' }])} />
      <JsonLd data={collectionPageJsonLd({ path: '/agenda-cofrade', name: pageTitle(title), description, items: upcoming.filter((item) => item.href).map((item) => ({ name: item.title, path: item.href })) })} />

      <header className={styles.hero}>
        <div className="shell">
          <nav className={styles.breadcrumb} aria-label="Migas de pan"><Link href="/">Inicio</Link><span>›</span><strong>Agenda Cofrade</strong></nav>
          <div className={styles.heroCopy}><span className={styles.eyebrow}>Qué ver · Qué sale · Dónde ir</span><h1>Agenda Cofrade</h1><p>Todos los actos de interés público de Sevilla y su provincia, ordenados por fecha y claramente separados por tipo.</p></div>
        </div>
      </header>

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

      <div className={`shell ${styles.content} ${v4Styles.contentV4}`}>
        <AgendaCofradeDirectoryV4
          items={items}
          today={today}
          initialCategory={initialCategory}
          initialPeriod={initialPeriod}
          initialTerritory={initialTerritory}
        />
        <section className={styles.relatedCalendar} aria-labelledby="calendar-cuadrillas"><div><span>Calendario especializado</span><h2 id="calendar-cuadrillas">Igualás y ensayos</h2><p>Las convocatorias de cuadrillas quedan en un espacio propio, conectado con sus Hermandades y separado de la agenda de interés general.</p></div><Link href="/igualas-y-ensayos">Ver {upcomingCrewCount} próximas convocatorias <span>→</span></Link></section>
        <nav className={styles.relatedLinks} aria-label="Explorar contenidos relacionados"><span>Seguir explorando</span><Link href="/hermandades">Hermandades</Link><Link href="/bandas">Bandas</Link><Link href="/procesiones-de-gloria">Calendario de Glorias</Link><Link href="/extraordinarias">Calendario de extraordinarias</Link></nav>
        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla"><span>Agenda actualizada</span><h2 id="agenda-sevilla">Qué ver hoy y este fin de semana en la Sevilla cofrade</h2><p>{seoDescription('Hilo Cofrade reúne los actos públicos de Sevilla capital y sus municipios en una cronología común. Procesiones, traslados, rosarios, besamanos, besapiés y conciertos permanecen conectados con sus calendarios, Bandas y Hermandades.')}</p></section>
      </div>
    </div>
  )
}
