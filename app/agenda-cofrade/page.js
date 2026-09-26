import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'
import AgendaCofradeDirectoryFromUrl from '@/components/AgendaCofradeDirectoryFromUrl'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import AgendaCofradeNavFromUrl from '@/components/AgendaCofradeNavFromUrl'
import AgendaTemporalNav from '@/components/AgendaTemporalNav'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, filteredViewRobots, pageTitle, seoDescription } from '@/lib/seo'
import { agendaSeoCopy, madridYear } from '@/lib/seo-calendar'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import styles from './agenda-cofrade.module.css'
import v4Styles from './agenda-cofrade-v4.module.css'

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const { title, description } = agendaSeoCopy(madridYear())
  const robots = filteredViewRobots(params, ['categoria', 'periodo', 'territorio', 'municipio'])
  return {
    title,
    description,
    alternates: { canonical: '/agenda-cofrade' },
    openGraph: { title: pageTitle(title), description, url: '/agenda-cofrade' },
    twitter: { title: pageTitle(title), description },
    ...(robots ? { robots } : {}),
  }
}

function compactAgendaItem(item) {
  return {
    key: item.key,
    date: item.date,
    endDate: item.endDate,
    dateInfo: item.dateInfo,
    startTime: item.startTime,
    endTime: item.endTime,
    timeText: item.timeText,
    title: item.title,
    summary: item.summary,
    category: item.category,
    categoryLabel: item.categoryLabel,
    categoryHref: item.categoryHref,
    isExtraordinary: item.isExtraordinary,
    isUpcoming: item.isUpcoming,
    isCancelled: item.isCancelled,
    monthKey: item.monthKey,
    monthLabel: item.monthLabel,
    municipality: item.municipality,
    municipalityHref: item.municipalityHref,
    organizer: item.organizer,
    organizerHref: item.organizerHref,
    place: item.place,
    href: item.href,
    actionLabel: item.actionLabel,
    imagePath: item.imagePath,
    imageFallbackPath: item.imageFallbackPath,
    imageKind: item.imageKind,
    imageAlt: item.imageAlt,
    relatedBrotherhoodHref: item.relatedBrotherhoodHref,
    repertoireText: item.repertoireText,
    bands: (item.bands || []).map((band) => ({
      id: band.id,
      name: band.name,
      href: band.href,
    })),
  }
}

export default async function AgendaCofradePage() {
  // La disponibilidad de Supabase no debe bloquear la compilación de la web.
  // La caché de datos se mantiene en getAgendaCofrade, también en esta ruta dinámica.
  await connection()
  const { title, description } = agendaSeoCopy(madridYear())
  const agendaData = await getAgendaCofrade()
  const { items, today } = agendaData
  const nowIso = new Date().toISOString()
  const upcoming = items.filter((item) => item.isUpcoming && !item.isCancelled)
  const interactiveItems = upcoming.map(compactAgendaItem)

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
      <AgendaTemporalNav />

      <div className={`shell ${styles.content} ${v4Styles.contentV4}`}>
        <Suspense fallback={<AgendaCofradeDirectoryV4 items={interactiveItems} today={today} initialNowIso={nowIso} />}>
          <AgendaCofradeDirectoryFromUrl items={interactiveItems} today={today} initialNowIso={nowIso} />
        </Suspense>
        <section className={styles.relatedCalendar} aria-labelledby="calendar-cuadrillas"><div><span>Calendario especializado</span><h2 id="calendar-cuadrillas">Igualás y ensayos</h2><p>Las convocatorias de cuadrillas quedan en un espacio propio, conectado con sus Hermandades y separado de la agenda de interés general.</p></div><Link href="/igualas-y-ensayos">Ver próximas convocatorias <span>→</span></Link></section>
        <nav className={styles.relatedLinks} aria-label="Explorar contenidos relacionados"><span>Seguir explorando</span><Link href="/hermandades">Hermandades</Link><Link href="/bandas">Bandas</Link><Link href="/procesiones-de-gloria">Calendario de Glorias</Link><Link href="/extraordinarias">Calendario de extraordinarias</Link></nav>
        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla"><span>Agenda actualizada</span><h2 id="agenda-sevilla">Qué ver hoy y este fin de semana en la Sevilla cofrade</h2><p>{seoDescription('Hilo Cofrade reúne únicamente los próximos actos públicos de Sevilla capital y sus municipios en una cronología común. Procesiones, traslados, rosarios, besamanos, besapiés y conciertos permanecen conectados con sus calendarios, Bandas y Hermandades.')}</p></section>
      </div>
    </div>
  )
}
