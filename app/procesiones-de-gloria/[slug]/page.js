import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import ProcessionRoute from '@/components/ProcessionRoute'
import { buildProcessionRoute } from '@/lib/procession-route'
import { getGloryDetail } from '@/lib/supabase/glory-directory'
import { absoluteUrl, breadcrumbJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import styles from './glory-detail.module.css'

export const dynamic = 'force-dynamic'

const getGlory = cache(getGloryDetail)

function formatDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  const label = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`
}

function formatSeoDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

function entryLabel(item) {
  if (item.returnTime) return item.returnTime
  const row = item.schedule.find((scheduleItem) => {
    const label = String(scheduleItem.label || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
    return label.includes('entrada') || label.includes('recogida') || label.includes('fin de la procesion')
  })
  return row?.time || row?.timeText || ''
}

function statusLabel(item) {
  if (item.isCancelled) return 'Cancelada'
  if (item.isCelebrated) return 'Celebrada'
  return item.urgencyLabel || 'Próxima'
}

function seoCoverage(item) {
  const coverage = ['fecha']
  if (item.schedule.length || item.departureTime || item.returnTime) coverage.push('horarios')
  if (item.routeSummary) coverage.push('recorrido')
  if (item.processionalMusic.length) coverage.push('bandas')
  if (item.sources.length) coverage.push('fuentes')
  return coverage.join(', ')
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getGlory(slug)

  if (!item) {
    return {
      title: 'Procesión de Gloria no encontrada',
      robots: { index: false, follow: false },
    }
  }

  const title = `${item.title} · ${formatSeoDate(item.date)} · ${item.municipality}`
  const description = seoDescription([
    item.title,
    formatSeoDate(item.date),
    item.municipality,
    `Guía con ${seoCoverage(item)} de la procesión de Gloria.`,
  ].filter(Boolean).join('. '))
  const canonical = item.detailHref

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(title),
      description,
      url: canonical,
      ...(item.heroImagePath ? { images: [{ url: item.heroImagePath, alt: item.heroImageAlt }] } : {}),
    },
    twitter: {
      card: item.heroImagePath ? 'summary_large_image' : 'summary',
      title: pageTitle(title),
      description,
      ...(item.heroImagePath ? { images: [item.heroImagePath] } : {}),
    },
  }
}

export default async function GloryDetailPage({ params }) {
  const { slug } = await params
  const item = await getGlory(slug)
  if (!item) notFound()

  const canonicalPath = item.detailHref
  const canonicalUrl = absoluteUrl(canonicalPath)
  const entry = entryLabel(item)
  const dateLabel = formatDate(item.date)
  const processionRoute = buildProcessionRoute({
    route: item.route,
    routeSummary: item.routeSummary,
    origin: item.origin,
    destination: item.destination,
    schedule: item.schedule,
  })
  const pageDescription = seoDescription([
    `${item.title}${item.municipality ? ` · ${item.municipality}` : ''}`,
    formatSeoDate(item.date),
    item.description || 'Procesión de Gloria documentada en Hilo Cofrade.',
    `Información de ${seoCoverage(item)}.`,
  ].filter(Boolean).join('. '))
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle(item.title),
    description: pageDescription,
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    mainEntity: { '@id': `${canonicalUrl}#event` },
  }
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${canonicalUrl}#event`,
    url: canonicalUrl,
    name: item.title,
    startDate: item.departureTime ? `${item.date}T${item.departureTime}:00+02:00` : item.date,
    ...(item.returnDate || item.returnTime ? {
      endDate: `${item.returnDate || item.date}${item.returnTime ? `T${item.returnTime}:00+02:00` : ''}`,
    } : {}),
    description: item.description || pageDescription,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(item.isUpcoming ? { eventStatus: 'https://schema.org/EventScheduled' } : {}),
    ...(item.isCancelled ? { eventStatus: 'https://schema.org/EventCancelled' } : {}),
    organizer: {
      '@type': 'Organization',
      name: item.brotherhoodName,
      ...(item.brotherhoodHref ? { url: absoluteUrl(item.brotherhoodHref) } : {}),
    },
    location: {
      '@type': 'Place',
      name: item.origin || item.municipality || 'Sevilla',
      address: {
        '@type': 'PostalAddress',
        addressLocality: item.municipality,
        addressRegion: 'Sevilla',
        addressCountry: 'ES',
      },
    },
    mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
  }

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Procesiones de Gloria', path: '/procesiones-de-gloria' },
        { name: item.title, path: canonicalPath },
      ])} />
      <JsonLd data={pageJsonLd} />
      <JsonLd data={eventJsonLd} />

      <section className={styles.hero}>
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Link className={styles.backLink} href="/procesiones-de-gloria">← Todas las Glorias</Link>
            <div className={styles.topline}>
              <span>{item.municipality || 'Sevilla y provincia'}</span>
              <span data-status={item.eventStatus}>{statusLabel(item)}</span>
            </div>
            <h1>{item.title}</h1>
            {item.brotherhoodHref
              ? <Link className={styles.brotherhood} href={item.brotherhoodHref}>{item.brotherhoodName}</Link>
              : <strong className={styles.brotherhood}>{item.brotherhoodName}</strong>}
            {item.description ? <p className={styles.lead}>{item.description}</p> : null}

            <div className={styles.keyFacts}>
              <div className={styles.dateFact}><span>Fecha</span><strong>{dateLabel}</strong></div>
              <div><span>Salida</span><strong>{item.departureTime || 'Por confirmar'}</strong></div>
              <div><span>Entrada</span><strong>{entry || 'Por confirmar'}</strong></div>
              <div><span>Tipo</span><strong>{item.outingType}</strong></div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            {item.heroImagePath ? (
              <>
                <Image src={item.heroImagePath} alt={item.heroImageAlt} fill priority sizes="(max-width: 820px) calc(100vw - 32px), 36vw" />
                {item.heroImageCredit ? <small>{item.heroImageCredit}</small> : null}
              </>
            ) : item.crestPath ? (
              <Image className={styles.crest} src={item.crestPath} alt={`Escudo de ${item.brotherhoodName}`} width={380} height={380} priority />
            ) : (
              <div className={styles.datePoster} aria-hidden="true">
                <strong>{item.dateParts.day}</strong>
                <span>{item.dateParts.month}</span>
                <small>{item.dateParts.year}</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={`shell ${styles.body}`}>
        <section className={styles.section} aria-labelledby="datos-procesion-gloria">
          <div className={styles.sectionHead}>
            <span className="eyebrow">De un vistazo</span>
            <h2 id="datos-procesion-gloria">Datos documentados</h2>
          </div>
          <div className={styles.infoGrid}>
            <article><span>Hermandad</span>{item.brotherhoodHref ? <Link href={item.brotherhoodHref}>{item.brotherhoodName}</Link> : <strong>{item.brotherhoodName}</strong>}</article>
            <article><span>Localidad</span><strong>{item.municipality || 'Por documentar'}</strong></article>
            <article><span>Fecha</span><strong>{dateLabel}</strong></article>
            <article><span>Estado</span><strong>{statusLabel(item)}</strong></article>
          </div>
          {item.publicNotes ? <p className={styles.publicNotes}>{item.publicNotes}</p> : null}
        </section>

        {(processionRoute.summary || processionRoute.legs.length) ? (
          <section className={styles.section} aria-labelledby="recorrido-procesion-gloria">
            <div className={styles.sectionHead}>
              <span className="eyebrow">Itinerario</span>
              <h2 id="recorrido-procesion-gloria">Recorrido</h2>
            </div>
            <ProcessionRoute route={processionRoute} />
          </section>
        ) : null}

        <section className={styles.section} aria-labelledby="musica-procesion-gloria">
          <div className={styles.sectionHead}>
            <span className="eyebrow">Acompañamiento</span>
            <h2 id="musica-procesion-gloria">Música</h2>
          </div>
          {item.processionalMusic.length ? (
            <div className={styles.musicList}>
              {item.processionalMusic.map((music, index) => (
                <article key={music.id || `${music.name}-${index}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    {music.href ? <Link href={music.href}>{music.name}</Link> : <strong>{music.name}</strong>}
                    {music.context ? <p>{music.context}</p> : null}
                    {music.notes ? <small>{music.notes}</small> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.pending}>Acompañamiento musical pendiente de documentar en esta salida.</p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="fuentes-procesion-gloria">
          <div className={styles.sectionHead}>
            <span className="eyebrow">Trazabilidad</span>
            <h2 id="fuentes-procesion-gloria">Fuentes</h2>
          </div>
          {item.sources.length ? (
            <div className={styles.sources}>
              {item.sources.map((source) => (
                <article key={source.id}>
                  <div>
                    <strong>{source.name}</strong>
                    {source.scope ? <p>{source.scope}</p> : null}
                    <small>{[source.publisher, source.publicationDate].filter(Boolean).join(' · ')}</small>
                  </div>
                  {source.url ? <a href={source.url} target="_blank" rel="noreferrer">Consultar fuente ↗</a> : null}
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.pending}>Fuentes específicas pendientes de incorporar a esta salida.</p>
          )}
        </section>
      </div>
    </div>
  )
}
