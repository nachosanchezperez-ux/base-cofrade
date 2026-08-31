import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { crewEventStatusLabel } from '@/lib/crew-events'
import { absoluteUrl, breadcrumbJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import { getCrewEventDetail } from '@/lib/supabase/crew-events'
import styles from './crew-event-detail.module.css'

export const revalidate = 900

function madridUtcOffset(value) {
  if (!value) return '+00:00'
  const zone = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  }).formatToParts(new Date(`${value}T12:00:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value || 'GMT+00:00'
  return zone.replace('GMT', '') || '+00:00'
}

function madridDateTime(date, time) {
  if (!date) return ''
  return time ? `${date}T${time}:00${madridUtcOffset(date)}` : date
}

function eventSeoTitle(event) {
  return [event.title, event.dateParts.label, event.municipality].filter(Boolean).join(' · ')
}

function eventSeoDescription(event) {
  const timing = event.dateParts.label
    ? `${event.dateParts.label}${event.startTime ? ` a las ${event.startTime}` : ''}`
    : ''
  const steps = event.steps.length ? `Paso: ${event.steps.map((step) => step.name).join(', ')}` : ''
  const agents = event.agents.length
    ? `${event.agents.length === 1 ? 'Responsable' : 'Responsables'}: ${event.agents.map((agent) => agent.name).join(', ')}`
    : ''

  return seoDescription([
    event.summary || event.description || `${event.eventTypeLabel} de ${event.brotherhoodName}`,
    timing,
    event.location ? `Lugar: ${event.location}` : '',
    steps,
    agents,
  ].filter(Boolean).join('. '))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const event = await getCrewEventDetail(slug)
  if (!event) return { title: 'Convocatoria no encontrada', robots: { index: false, follow: false } }
  const title = eventSeoTitle(event)
  const description = eventSeoDescription(event)
  const canonical = `/igualas-y-ensayos/${event.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title: pageTitle(title), description, url: canonical },
    twitter: { title: pageTitle(title), description },
  }
}

export default async function CrewEventDetailPage({ params }) {
  const { slug } = await params
  const event = await getCrewEventDetail(slug)
  if (!event) notFound()

  const canonicalUrl = absoluteUrl(event.detailHref)
  const description = eventSeoDescription(event)
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle(eventSeoTitle(event)),
    description,
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    mainEntity: { '@id': `${canonicalUrl}#event` },
  }
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${canonicalUrl}#event`,
    name: event.title,
    startDate: madridDateTime(event.date, event.startTime),
    ...(event.endTime ? { endDate: madridDateTime(event.date, event.endTime) } : {}),
    description,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: event.isCancelled
      ? 'https://schema.org/EventCancelled'
      : event.isPostponed
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    url: canonicalUrl,
    organizer: {
      '@type': 'Organization',
      name: event.brotherhoodName,
      ...(event.brotherhoodHref ? { url: absoluteUrl(event.brotherhoodHref) } : {}),
    },
    location: {
      '@type': 'Place',
      name: event.location || event.municipality || 'Sevilla',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.municipality,
        addressRegion: event.province || 'Sevilla',
        addressCountry: 'ES',
      },
    },
    mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
  }

  return (
    <article className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Igualás y Ensayos', path: '/igualas-y-ensayos' },
        { name: event.title, path: event.detailHref },
      ])} />
      <JsonLd data={pageJsonLd} />
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
