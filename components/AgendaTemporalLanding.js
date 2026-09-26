import Link from 'next/link'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import AgendaTemporalNav from '@/components/AgendaTemporalNav'
import AgendaTemporalEventList from '@/components/AgendaTemporalEventList'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'
import styles from './AgendaTemporalLanding.module.css'

function queryHref(period, territory) {
  return `/agenda-cofrade?periodo=${period}&territorio=${territory}#agenda`
}

export default function AgendaTemporalLanding({ landing }) {
  const structuredItems = landing.items
    .filter((item) => item.href)
    .map((item) => ({ name: item.title, path: item.href }))

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Agenda Cofrade', path: '/agenda-cofrade' },
        { name: landing.heading, path: landing.path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: landing.path,
        name: landing.title,
        description: landing.description,
        items: structuredItems,
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <nav className={styles.breadcrumb} aria-label="Migas de pan">
              <Link href="/">Inicio</Link><span>›</span>
              <Link href="/agenda-cofrade">Agenda Cofrade</Link><span>›</span>
              <strong>{landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}</strong>
            </nav>
            <span className={styles.eyebrow}>{landing.eyebrow}</span>
            <h1>{landing.heading}</h1>
            <p>{landing.description}</p>
            {landing.dateCaption ? <time>{landing.dateCaption}</time> : null}
            <nav className={styles.heroActions} aria-label="Acciones de esta agenda">
              <a href="#agenda-del-periodo">Ver todas las citas <span aria-hidden="true">↓</span></a>
              <Link href="/agenda-cofrade">Agenda completa</Link>
            </nav>
          </div>

          <aside className={styles.heroPanel} aria-label="Resumen del periodo">
            <span>De un vistazo</span>
            <strong>{landing.items.length}</strong>
            <p>{landing.items.length === 1 ? 'cita documentada' : 'citas documentadas'} en este periodo.</p>
            <div className={styles.stats}>
              <span><b>{landing.capitalCount}</b> Sevilla capital</span>
              <span><b>{landing.provinceCount}</b> Provincia</span>
              <span><b>{landing.municipalities.length}</b> {landing.municipalities.length === 1 ? 'localidad' : 'localidades'}</span>
            </div>
          </aside>
        </div>
      </header>

      <AgendaCofradeNav activeSection="agenda" sticky={false} />
      <AgendaTemporalNav active={landing.period} />

      <div>
        <section className={styles.overview}>
          <div className="shell">
            <header className={styles.overviewHeading}>
              <div><span>Organiza tu visita</span><h2>Filtra antes de bajar a la cronología</h2></div>
              <p>Elige territorio, tipo de acto o municipio. La lista completa queda justo después.</p>
            </header>

            <div className={styles.overviewGrid}>
              <section className={styles.scope} aria-labelledby="agenda-temporal-donde">
                <header><span>Dónde</span><h3 id="agenda-temporal-donde">Capital o provincia</h3></header>
                <div className={styles.territories}>
                  <Link href={queryHref(landing.queryPeriod, 'capital')}>
                    <span>Sevilla capital</span><strong>{landing.capitalCount}</strong><small>Ver citas →</small>
                  </Link>
                  <Link href={queryHref(landing.queryPeriod, 'province')}>
                    <span>Provincia</span><strong>{landing.provinceCount}</strong><small>Ver municipios →</small>
                  </Link>
                </div>
              </section>

              {landing.categories.length ? (
                <section className={styles.categories} aria-labelledby="agenda-temporal-tipos">
                  <header><span>Qué</span><h3 id="agenda-temporal-tipos">Por tipo de acto</h3></header>
                  <div>
                    {landing.categories.map((category) => (
                      <Link href={`/agenda-cofrade?periodo=${landing.queryPeriod}&categoria=${category.key}#agenda`} key={category.key}>
                        <span>{category.label}</span><strong>{category.count}</strong>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            {landing.municipalities.length ? (
              <section className={styles.municipalities} aria-labelledby="agenda-temporal-municipios">
                <header><span>Guías locales</span><h3 id="agenda-temporal-municipios">Municipios con actividad</h3></header>
                <div>
                  {landing.municipalities.map((municipality) => (
                    <Link href={municipality.href} key={municipality.slug}>
                      <span>{municipality.label}</span><strong>{municipality.count}</strong><small>Guía local →</small>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>

        {landing.items.length ? (
          <AgendaTemporalEventList landing={landing} />
        ) : (
          <section className={styles.empty}>
            <div className="shell">
              <span>Agenda abierta</span>
              <h2>No hay citas publicadas para este periodo</h2>
              <p>La URL permanece disponible y se actualizará automáticamente cuando exista un nuevo acto documentado.</p>
              <Link href="/agenda-cofrade">Ver próximos actos →</Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
