import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { crewEventStatusLabel } from '@/lib/crew-events'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import { getCrewEventDetail } from '@/lib/supabase/crew-events'
import styles from './crew-event-detail.module.css'

export const revalidate = 900

export async function generateMetadata({ params }) {
  const { slug } = await params
  const event = await getCrewEventDetail(slug)
  if (!event) return { title: pageTitle('Convocatoria no encontrada'), robots: { index: false, follow: false } }
  const description = event.summary || `${event.eventTypeLabel} de ${event.brotherhoodName} el ${event.dateParts.label}.`
  return {
    title: pageTitle(`${event.eventTypeLabel} · ${event.brotherhoodName}`),
    description,
    alternates: { canonical: `/igualas-y-ensayos/${event.slug}` },
    openGraph: { title: pageTitle(event.title), description, url: `/igualas-y-ensayos/${event.slug}` },
    twitter: { title: pageTitle(event.title), description },
  }
}

export default async function CrewEventDetailPage({ params }) {
  const { slug } = await params
  const event = await getCrewEventDetail(slug)
  if (!event) notFound()
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    eventStatus: event.isCancelled
      ? 'https://schema.org/EventCancelled'
      : event.isPostponed
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    url: absoluteUrl(event.detailHref),
    organizer: { '@type': 'Organization', name: event.brotherhoodName },
    ...(event.location ? { location: { '@type': 'Place', name: event.location, address: event.municipality } } : {}),
  }

  return (
    <article className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Igualás y Ensayos', path: '/igualas-y-ensayos' },
        { name: event.title, path: event.detailHref },
      ])} />
      <JsonLd data={eventJsonLd} />
      <div className="shell">
        <nav className={styles.breadcrumb} aria-label="Migas de pan"><Link href="/igualas-y-ensayos">Igualás y Ensayos</Link><span>→</span><strong>{event.eventTypeLabel}</strong></nav>

        <header className={styles.hero}>
          <div className={styles.datePanel}>
            <time dateTime={event.date}><strong>{event.dateParts.day}</strong><span>{event.dateParts.month}</span><small>{event.dateParts.year}</small></time>
            <span className={styles.status} data-status={event.eventStatus}>{event.urgencyLabel || crewEventStatusLabel(event.eventStatus)}</span>
          </div>
          <div className={styles.heroCopy}>
            <span className="eyebrow">{event.eventTypeLabel} · {event.municipality}</span>
            <h1>{event.title}</h1>
            {event.brotherhoodHref ? <Link className={styles.brotherhood} href={event.brotherhoodHref}>{event.brotherhoodName}</Link> : <strong className={styles.brotherhood}>{event.brotherhoodName}</strong>}
            {event.summary ? <p>{event.summary}</p> : null}
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.main}>
            <section className={styles.facts} aria-labelledby="datos-convocatoria">
              <div className={styles.sectionHeading}><span className="eyebrow">Convocatoria</span><h2 id="datos-convocatoria">Datos principales</h2></div>
              <dl>
                <div><dt>Fecha</dt><dd>{event.dateParts.weekdayLabel}</dd></div>
                <div><dt>Hora</dt><dd>{event.timeText || event.startTime || 'Por confirmar'}{event.endTime ? ` – ${event.endTime}` : ''}</dd></div>
                <div><dt>Localidad</dt><dd>{event.municipality}</dd></div>
                <div><dt>Lugar</dt><dd>{event.location || 'Por confirmar'}</dd></div>
              </dl>
            </section>

            {event.steps.length ? (
              <section className={styles.section} aria-labelledby="pasos-convocados"><div className={styles.sectionHeading}><span className="eyebrow">Relaciones</span><h2 id="pasos-convocados">Paso{event.steps.length === 1 ? '' : 's'}</h2></div><div className={styles.relationList}>{event.steps.map((step) => <article key={step.id}><span>Paso vinculado</span>{step.href ? <Link href={step.href}>{step.name}</Link> : <strong>{step.name}</strong>}{step.notes ? <p>{step.notes}</p> : null}</article>)}</div></section>
            ) : null}

            {event.agents.length ? (
              <section className={styles.section} aria-labelledby="capataces-convocatoria"><div className={styles.sectionHeading}><span className="eyebrow">Equipo responsable</span><h2 id="capataces-convocatoria">Capataces y responsables</h2></div><div className={styles.relationList}>{event.agents.map((agent) => <article key={`${agent.id}-${agent.roleName}`}><span>{agent.roleName}</span><strong>{agent.name}</strong>{agent.notes ? <p>{agent.notes}</p> : null}</article>)}</div></section>
            ) : null}

            {event.description || event.requirements || event.publicNotes ? (
              <section className={styles.section} aria-labelledby="informacion-convocatoria"><div className={styles.sectionHeading}><span className="eyebrow">Información</span><h2 id="informacion-convocatoria">Indicaciones de la convocatoria</h2></div>{event.description ? <p>{event.description}</p> : null}{event.requirements ? <div className={styles.notice}><strong>Indicaciones para la cuadrilla</strong><p>{event.requirements}</p></div> : null}{event.publicNotes ? <p>{event.publicNotes}</p> : null}</section>
            ) : null}

            {event.sources.length ? (
              <section className={styles.section} aria-labelledby="fuentes-convocatoria"><div className={styles.sectionHeading}><span className="eyebrow">Documentación</span><h2 id="fuentes-convocatoria">Fuentes</h2></div><ol className={styles.sources}>{event.sources.map((source) => <li key={source.id}>{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> : <strong>{source.name}</strong>}<span>{source.author_or_publisher || source.source_type || ''}</span></li>)}</ol></section>
            ) : null}
          </div>

          <aside className={styles.aside}>
            <span className="eyebrow">Hilo relacional</span><h2>En esta convocatoria</h2>
            <div><span>Hermandad</span><strong>{event.brotherhoodName}</strong></div>
            <div><span>Pasos</span><strong>{event.steps.length || 'Por documentar'}</strong></div>
            <div><span>Responsables</span><strong>{event.agents.length || 'Por documentar'}</strong></div>
            <Link href="/igualas-y-ensayos">Volver al calendario <span>→</span></Link>
          </aside>
        </div>
      </div>
    </article>
  )
}
