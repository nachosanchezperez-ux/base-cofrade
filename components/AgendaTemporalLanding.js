import Link from 'next/link'
import AgendaTemporalNav from '@/components/AgendaTemporalNav'
import AgendaTemporalEventList from '@/components/AgendaTemporalEventList'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './AgendaTemporalLanding.module.css'

// Con pocas citas no hay nada que filtrar: la lista va directamente tras el periodo.
const FILTERS_FROM = 4

const PERIOD_LABEL = { today: 'Hoy', tomorrow: 'Mañana', weekend: 'Fin de semana' }
const PERIOD_PHRASE = { today: 'hoy', tomorrow: 'mañana', weekend: 'este fin de semana' }
const OTHER_PERIODS = [
  { key: 'today', href: '/agenda-cofrade/hoy', label: 'Ver hoy' },
  { key: 'tomorrow', href: '/agenda-cofrade/manana', label: 'Ver mañana' },
  { key: 'weekend', href: '/agenda-cofrade/fin-de-semana', label: 'Ver el fin de semana' },
]

function queryHref(period, params) {
  return `/agenda-cofrade?${new URLSearchParams({ periodo: period, ...params }).toString()}#agenda`
}

// Selección compacta antes del listado (#1264): zona y tipo en una sola fila. Cada
// enlace abre la Agenda completa con ese periodo y ese filtro, con el mismo recuento.
function PeriodFilters({ landing }) {
  const zones = [
    { key: 'capital', label: 'Sevilla capital', count: landing.capitalCount },
    { key: 'province', label: 'Provincia', count: landing.provinceCount },
  ].filter((zone) => zone.count > 0)

  return (
    <nav className={styles.filters} aria-label={landing.filterHeading}>
      <div className="shell">
        <div className={styles.chips}>
          {zones.map((zone) => (
            <Link href={queryHref(landing.queryPeriod, { territorio: zone.key })} data-kind="zone" key={zone.key}>
              <span>{zone.label}</span><strong>{zone.count}</strong>
            </Link>
          ))}
          {landing.categories.map((category) => (
            <Link href={queryHref(landing.queryPeriod, { categoria: category.key })} data-category={category.key} key={category.key}>
              <span>{category.label}</span><strong>{category.count}</strong>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function EmptyPeriod({ landing }) {
  return (
    <section className={styles.empty} aria-labelledby="agenda-periodo-vacio">
      <div className="shell">
        <h2 id="agenda-periodo-vacio">No hay citas documentadas para {PERIOD_PHRASE[landing.period]}</h2>
        {landing.dateCaption ? <time>{landing.dateCaption}</time> : null}
        <p>Prueba con otro día o consulta todos los próximos actos de Sevilla y su provincia.</p>
        <div className={styles.emptyActions}>
          {OTHER_PERIODS.filter((item) => item.key !== landing.period).map((item) => (
            <Link href={item.href} key={item.key}>{item.label}</Link>
          ))}
          <Link href="/agenda-cofrade" data-primary="true">Todos los próximos actos <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  )
}

export default function AgendaTemporalLanding({ landing }) {
  const structuredItems = landing.items
    .filter((item) => item.href)
    .map((item) => ({ name: item.title, path: item.href }))
  const count = landing.count ?? landing.items.length

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Agenda Cofrade', path: '/agenda-cofrade' },
        { name: landing.heading, path: landing.path },
      ])} />
      <JsonLd data={{
        ...collectionPageJsonLd({
          path: landing.path,
          name: landing.title,
          description: landing.summaryWithPlaces || landing.description,
          items: structuredItems,
        }),
        // La frase completa, sin el recorte a 160 caracteres de las meta descriptions.
        ...(landing.summaryWithPlaces ? { description: landing.summaryWithPlaces } : {}),
        ...(landing.temporalCoverage ? { temporalCoverage: landing.temporalCoverage } : {}),
      }} />

      <header className={styles.hero}>
        <div className="shell">
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Agenda Cofrade', href: '/agenda-cofrade' },
              { label: PERIOD_LABEL[landing.period] },
            ]}
            tone="dark"
            showAccent={false}
          />
          <h1>{landing.heading}</h1>
          {/* Con actos: la frase ya lleva la fecha; sin actos, la fecha va en el aviso. */}
          {count ? <p>{landing.summary}</p> : null}
        </div>
      </header>

      <AgendaTemporalNav active={landing.period} />

      {count ? (
        <>
          {count >= FILTERS_FROM ? <PeriodFilters landing={landing} /> : null}
          <AgendaTemporalEventList landing={landing} />
        </>
      ) : <EmptyPeriod landing={landing} />}

      {landing.municipalities.length ? (
        <section className={styles.localGuides} aria-labelledby="agenda-temporal-municipios">
          <div className="shell">
            <header>
              <span>Guías locales</span>
              <h2 id="agenda-temporal-municipios">Municipios con actividad</h2>
              <small className={styles.scrollHint}>Desliza →</small>
            </header>
            <div>
              {landing.municipalities.map((municipality) => (
                <Link href={municipality.href} key={municipality.slug}>
                  <span>{municipality.label}</span><strong>{municipality.count}</strong><small>Guía local →</small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
