import Link from 'next/link'
import { Suspense } from 'react'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'
import AgendaCofradeDirectoryFromUrl from '@/components/AgendaCofradeDirectoryFromUrl'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import AgendaCofradeNavFromUrl from '@/components/AgendaCofradeNavFromUrl'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { agendaSeoCopy, madridYear } from '@/lib/seo-calendar'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import { getCrewEventDirectory } from '@/lib/supabase/crew-events'
import styles from './agenda-cofrade.module.css'
import v4Styles from './agenda-cofrade-v4.module.css'

export const revalidate = 300

export function generateMetadata() {
  const { title, description } = agendaSeoCopy(madridYear())
  return {
    title,
    description,
    alternates: { canonical: '/agenda-cofrade' },
    openGraph: { title: pageTitle(title), description, url: '/agenda-cofrade' },
    twitter: { title: pageTitle(title), description },
  }
}

export default async function AgendaCofradePage() {
  const { title, description } = agendaSeoCopy(madridYear())
  const [agendaData, crewEvents] = await Promise.all([
    getAgendaCofrade(),
    getCrewEventDirectory(),
  ])
  const { items, today } = agendaData
  const upcoming = items.filter((item) => item.isUpcoming && !item.isCancelled)
  const upcomingCrewCount = crewEvents.filter((item) => item.isUpcoming && !item.isCancelled).length

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Agenda Cofrade', path: '/agenda-cofrade' }])} />
      <JsonLd data={collectionPageJsonLd({ path: '/agenda-cofrade', name: pageTitle(title), description, items: upcoming.filter((item) => item.href).map((item) => ({ name: item.title, path: item.href })) })} />

      <header className={styles.hero}>
        <div className="shell">
          <nav className={styles.breadcrumb} aria-label="Migas de pan"><Link href="/">Inicio</Link><span>›</span><strong>Agenda Cofrade</strong></nav>
          <div className={styles.heroCopy}><span className={styles.eyebrow}>Qué ver · Qué sale · Dónde ir</span><h1>Agenda Cofrade</h1><p>Solo los próximos actos de interés público de Sevilla y su provincia, ordenados por fecha y claramente separados por tipo.</p></div>
        </div>
      </header>

      <Suspense fallback={<AgendaCofradeNav />}>
        <AgendaCofradeNavFromUrl />
      </Suspense>

      <div className={`shell ${styles.content} ${v4Styles.contentV4}`}>
        <Suspense fallback={<AgendaCofradeDirectoryV4 items={upcoming} today={today} />}>
          <AgendaCofradeDirectoryFromUrl items={upcoming} today={today} />
        </Suspense>
        <section className={styles.relatedCalendar} aria-labelledby="calendar-cuadrillas"><div><span>Calendario especializado</span><h2 id="calendar-cuadrillas">Igualás y ensayos</h2><p>Las convocatorias de cuadrillas quedan en un espacio propio, conectado con sus Hermandades y separado de la agenda de interés general.</p></div><Link href="/igualas-y-ensayos">Ver {upcomingCrewCount} próximas convocatorias <span>→</span></Link></section>
        <nav className={styles.relatedLinks} aria-label="Explorar contenidos relacionados"><span>Seguir explorando</span><Link href="/hermandades">Hermandades</Link><Link href="/bandas">Bandas</Link><Link href="/procesiones-de-gloria">Calendario de Glorias</Link><Link href="/extraordinarias">Calendario de extraordinarias</Link></nav>
        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla"><span>Agenda actualizada</span><h2 id="agenda-sevilla">Qué ver hoy y este fin de semana en la Sevilla cofrade</h2><p>{seoDescription('Hilo Cofrade reúne únicamente los próximos actos públicos de Sevilla capital y sus municipios en una cronología común. Procesiones, traslados, rosarios, besamanos, besapiés y conciertos permanecen conectados con sus calendarios, Bandas y Hermandades.')}</p></section>
      </div>
    </div>
  )
}
