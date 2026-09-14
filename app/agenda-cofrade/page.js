import Link from 'next/link'
import AgendaCofradeDirectory from '@/components/AgendaCofradeDirectory'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade'
import styles from './agenda-cofrade.module.css'

export const dynamic = 'force-dynamic'

const currentYear = new Intl.DateTimeFormat('es-ES', { year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date())
const title = `Agenda cofrade de Sevilla y provincia ${currentYear}`
const description = 'Descubre qué ver hoy y este fin de semana en Sevilla y su provincia: extraordinarias, Glorias, rosarios públicos, igualás y ensayos.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/agenda-cofrade' },
  openGraph: { title: pageTitle(title), description, url: '/agenda-cofrade' },
  twitter: { title: pageTitle(title), description },
}

function addDays(value, amount) {
  const date = new Date(`${value}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function weekendRange(today) {
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay()
  const saturdayDistance = weekday === 0 ? -1 : weekday === 6 ? 0 : 6 - weekday
  const start = addDays(today, saturdayDistance)
  return [start, addDays(start, 1)]
}

export default async function AgendaCofradePage() {
  const { items, today } = await getAgendaCofrade()
  const upcoming = items.filter((item) => item.isUpcoming && !item.isCancelled)
  const [weekendStart, weekendEnd] = weekendRange(today)
  const todayCount = upcoming.filter((item) => item.date === today).length
  const weekendCount = upcoming.filter((item) => item.date >= weekendStart && item.date <= weekendEnd).length
  const provinceCount = upcoming.filter((item) => item.scope === 'province').length
  const next = upcoming.find((item) => item.date) || upcoming[0] || null
  const categoryCards = [
    ['extraordinary', 'Extraordinarias', '/extraordinarias'],
    ['glories', 'Glorias', '/procesiones-de-gloria'],
    ['rosaries', 'Rosarios públicos', '#agenda'],
    ['crew', 'Igualás y ensayos', '/igualas-y-ensayos'],
  ].map(([key, label, href]) => ({ key, label, href, count: upcoming.filter((item) => item.category === key).length }))

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Agenda Cofrade', path: '/agenda-cofrade' }])} />
      <JsonLd data={collectionPageJsonLd({ path: '/agenda-cofrade', name: pageTitle(title), description, items: upcoming.filter((item) => item.href).map((item) => ({ name: item.title, path: item.href })) })} />

      <header className={styles.hero}>
        <div className="shell">
          <nav className={styles.breadcrumb} aria-label="Migas de pan"><Link href="/">Inicio</Link><span>›</span><strong>Agenda Cofrade</strong></nav>
          <div className={styles.heroGrid}>
            <div><span className={styles.eyebrow}>Qué ver · Qué sale · Dónde ir</span><h1>Agenda Cofrade</h1><p>El gran centro para saber qué está pasando en Sevilla y en cada municipio de la provincia.</p></div>
            <div className={styles.nextCard}>
              <span>Próxima cita</span>
              {next ? <><strong>{next.dateInfo.weekdayLabel}</strong><Link href={next.href}>{next.title}</Link><small>{next.categoryName} · {next.municipality || 'Localidad por confirmar'}{next.startTime ? ` · ${next.startTime} h` : ''}</small></> : <strong>Pendiente de nuevas convocatorias</strong>}
            </div>
          </div>
          <div className={styles.heroStats}><a href="#agenda"><strong>{todayCount}</strong><span>para ver hoy</span></a><a href="#agenda"><strong>{weekendCount}</strong><span>este fin de semana</span></a><a href="#agenda"><strong>{provinceCount}</strong><span>en los municipios</span></a></div>
        </div>
      </header>

      <nav className={styles.agendaNav} aria-label="Secciones de la Agenda Cofrade"><div className="shell"><a className={styles.current} href="#agenda" aria-current="page">Toda la agenda</a><Link href="/extraordinarias">Extraordinarias</Link><Link href="/procesiones-de-gloria">Glorias</Link><a href="#agenda">Rosarios</a><Link href="/igualas-y-ensayos">Igualás y ensayos</Link></div></nav>

      <div className={`shell ${styles.content}`}>
        <section className={styles.categoryGrid} aria-label="Tipos de actos de la Agenda Cofrade">
          {categoryCards.map((card) => <Link href={card.href} key={card.key} data-category={card.key}><span>{card.label}</span><strong>{card.count}</strong><small>próximas citas</small></Link>)}
        </section>
        <AgendaCofradeDirectory items={items} today={today} />
        <section className={styles.seoCopy} aria-labelledby="agenda-sevilla"><span>Agenda actualizada</span><h2 id="agenda-sevilla">Qué hacer hoy y este fin de semana en la Sevilla cofrade</h2><p>{seoDescription('Hilo Cofrade reúne la actualidad de Sevilla capital y sus municipios en una cronología común. Extraordinarias, procesiones de Gloria, rosarios públicos, igualás y ensayos conservan sus fichas, horarios, recorridos y Fuentes.')}</p></section>
      </div>
    </div>
  )
}
