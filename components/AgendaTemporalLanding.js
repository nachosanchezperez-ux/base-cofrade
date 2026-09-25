import Link from 'next/link'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'
import AgendaTemporalNav from '@/components/AgendaTemporalNav'
import ContextAgendaSection from '@/components/ContextAgendaSection'
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
        <div className="shell">
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>›</span>
            <Link href="/agenda-cofrade">Agenda Cofrade</Link><span>›</span>
            <strong>{landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}</strong>
          </nav>
          <span className={styles.eyebrow}>{landing.eyebrow}</span>
          <h1>{landing.heading}</h1>
          <p>{landing.description}</p>
          {landing.dateCaption ? <time>{landing.dateCaption}</time> : null}
          <div className={styles.stats}>
            <strong><b>{landing.items.length}</b> {landing.items.length === 1 ? 'cita' : 'citas'}</strong>
            <strong><b>{landing.capitalCount}</b> Sevilla capital</strong>
            <strong><b>{landing.provinceCount}</b> provincia</strong>
            <strong><b>{landing.municipalities.length}</b> {landing.municipalities.length === 1 ? 'localidad' : 'localidades'}</strong>
          </div>
        </div>
      </header>

      <AgendaCofradeNav activeSection="agenda" sticky={false} />
      <AgendaTemporalNav active={landing.period} />

      <main>
        <section className={styles.overview}>
          <div className="shell">
            <div className={styles.territories}>
              <Link href={queryHref(landing.queryPeriod, 'capital')}>
                <span>Sevilla capital</span><strong>{landing.capitalCount}</strong><small>Ver citas filtradas →</small>
              </Link>
              <Link href={queryHref(landing.queryPeriod, 'province')}>
                <span>Provincia</span><strong>{landing.provinceCount}</strong><small>Ver municipios →</small>
              </Link>
            </div>

            {landing.categories.length ? (
              <section className={styles.categories} aria-labelledby="agenda-temporal-tipos">
                <header><span>Por tipo de acto</span><h2 id="agenda-temporal-tipos">Qué hay en esta jornada</h2></header>
                <div>
                  {landing.categories.map((category) => (
                    <Link href={`/agenda-cofrade?periodo=${landing.queryPeriod}&categoria=${category.key}#agenda`} key={category.key}>
                      <span>{category.label}</span><strong>{category.count}</strong>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {landing.municipalities.length ? (
              <section className={styles.municipalities} aria-labelledby="agenda-temporal-municipios">
                <header><span>Por localidad</span><h2 id="agenda-temporal-municipios">Municipios con actividad</h2></header>
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
          <ContextAgendaSection
            id="agenda-del-periodo"
            eyebrow={landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}
            title="Todas las citas"
            description="Cronología construida únicamente con actos públicos documentados en Hilo Cofrade y conectados con sus entidades y calendarios."
            items={landing.items}
            maxItems={40}
            links={[
              { href: '/agenda-cofrade', label: 'Agenda Cofrade completa' },
              { href: '/procesiones-de-gloria', label: 'Glorias' },
              { href: '/extraordinarias', label: 'Extraordinarias' },
            ]}
          />
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
      </main>
    </div>
  )
}
