import Link from 'next/link'
import AgendaCofradeDirectory from '@/components/AgendaCofradeDirectory'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getCrewEventDirectory } from '@/lib/supabase/crew-events'
import styles from './agenda-cofrade.module.css'

export const dynamic = 'force-dynamic'

const currentYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date())
const title = `Agenda cofrade de Sevilla y provincia ${currentYear}`
const description = 'Consulta procesiones, traslados, rosarios públicos, besamanos y besapiés de hoy y este fin de semana en Sevilla y su provincia.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/agenda-cofrade' },
  openGraph: { title: pageTitle(title), description, url: '/agenda-cofrade' },
  twitter: { title: pageTitle(title), description },
}

export default async function AgendaCofradePage() {
  const [{ items, today }, crewEvents] = await Promise.all([getAgendaCofrade(), getCrewEventDirectory()])
  const upcoming = items.filter((item) => item.isUpcoming && !item.isCancelled)
  const upcomingCrewCount = crewEvents.filter((item) => item.isUpcoming && !item.isCancelled).length
  const categoryCards = [
    ['processions', 'Procesiones'],
    ['transfers', 'Traslados'],
    ['rosaries', 'Rosarios públicos'],
    ['devotions', 'Besamanos y besapiés'],
  ].map(([key, label]) => ({ key, label, count: upcoming.filter((item) => item.category === key).length }))

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

      <nav className={styles.agendaNav} aria-label="Secciones de la Agenda Cofrade"><div className="shell"><a className={styles.current} href="#agenda" aria-current="page">Agenda principal</a><Link href="/extraordinarias">Extraordinarias</Link><Link href="/procesiones-de-gloria">Glorias</Link><a href="#agenda">Rosarios</a><a href="#agenda">Besamanos</a><Link href="/igualas-y-ensayos">Igualás y ensayos</Link></div></nav>

      <div className={`shell ${styles.content}`}>
        <section className={styles.categoryGrid} aria-label="Tipos de actos de la Agenda Cofrade">
          {categoryCards.map((card) => <a href="#agenda" key={card.key} data-category={card.key}><span>{card.label}</span><strong>{card.count}</strong><small>próximos actos</small></a>)}
        </section>
        <AgendaCofradeDirectory items={items} today={today} />
        <section className={styles.relatedCalendar} aria-labelledby="calendar-cuadrillas"><div><span>Calendario especializado</span><h2 id="calendar-cuadrillas">Igualás y ensayos</h2><p>Las convocatorias de cuadrillas quedan en un espacio propio, conectado con sus Hermandades y separado de la agenda de interés general.</p></div><Link href="/igualas-y-ensayos">Ver {upcomingCrewCount} próximas convocatorias <span>→</span></Link></section>
        <nav className={styles.relatedLinks} aria-label="Explorar contenidos relacionados"><span>Seguir explorando</span><Link href="/hermandades">Hermandades</Link><Link href="/procesiones-de-gloria">Calendario de Glorias</Link><Link href="/extraordinarias">Calendario de extraordinarias</Link></nav>
        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla"><span>Agenda actualizada</span><h2 id="agenda-sevilla">Qué ver hoy y este fin de semana en la Sevilla cofrade</h2><p>{seoDescription('Hilo Cofrade reúne los actos públicos de Sevilla capital y sus municipios en una cronología común. Procesiones, traslados, rosarios, besamanos y besapiés permanecen conectados con sus calendarios y con la ficha de cada Hermandad.')}</p></section>
      </div>
    </div>
  )
}
