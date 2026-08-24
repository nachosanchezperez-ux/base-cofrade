import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { getExtraordinaryDetail } from '@/lib/supabase/extraordinary-detail'
import { absoluteUrl, breadcrumbJsonLd, pageTitle, seoDescription } from '@/lib/seo'
import styles from './extraordinary-detail.module.css'
import mediaStyles from './extraordinary-media.module.css'
import journeyStyles from './extraordinary-journey.module.css'

export const dynamic = 'force-dynamic'

const getExtraordinary = cache(getExtraordinaryDetail)

function formatDate(value, withYear = true) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'Europe/Madrid',
  }).format(date)
}

function formatShortDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date).replace('.', '')
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function entryLabel(item) {
  const entry = item.schedule.find((scheduleItem) => {
    const label = normalizeText(scheduleItem.label)
    return label.includes('entrada')
      || label.includes('recogida')
      || label.includes('fin de la procesion')
      || label.includes('final de la procesion')
  })
  return item.returnTime || entry?.time || entry?.timeText || ''
}

function statusLabel(status) {
  if (status === 'held') return 'Celebrada'
  if (status === 'cancelled') return 'Cancelada'
  return 'Anunciada'
}

function musicTitle(section) {
  if (section === 'liturgical') return 'Música litúrgica'
  if (section === 'announcement') return 'Bando y anuncio'
  return 'Otros momentos musicales'
}

function MusicRows({ items }) {
  if (!items.length) return null
  return (
    <div className={styles.musicRows}>
      {items.map((item, index) => (
        <article className={styles.musicRow} key={item.id || `${item.name}-${index}`}>
          <span className={styles.musicIndex}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            {item.href ? <Link href={item.href}>{item.name}</Link> : <strong>{item.name}</strong>}
            {item.context ? <p>{item.context}</p> : null}
            {item.notes ? <small>{item.notes}</small> : null}
          </div>
        </article>
      ))}
    </div>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getExtraordinary(slug)

  if (!item) {
    return {
      title: 'Extraordinaria no encontrada',
      robots: { index: false, follow: false },
    }
  }

  const title = `${item.title} · ${item.municipality}`
  const description = seoDescription(
    [
      `Guía de la ${item.outingType.toLocaleLowerCase('es')} de ${item.title}`,
      item.municipality ? `en ${item.municipality}` : '',
      item.reason ? `con motivo de ${item.reason}` : '',
      ': horarios, recorrido, música y fuentes.',
    ].filter(Boolean).join(' ').replace(/\s+:/, ':')
  )
  const canonical = `/extraordinarias/${item.slug}`

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

export default async function ExtraordinaryDetailPage({ params }) {
  const { slug } = await params
  const item = await getExtraordinary(slug)
  if (!item) notFound()

  const canonicalPath = `/extraordinarias/${item.slug}`
  const entry = entryLabel(item)
  const dateLabel = formatDate(item.date)
  const otherMusicGroups = [
    ['liturgical', item.liturgicalMusic],
    ['announcement', item.announcementMusic],
    ['other', item.otherMusic],
  ].filter(([, rows]) => rows.length)

  const pageDescription = seoDescription(
    `${item.title}${item.municipality ? ` · ${item.municipality}` : ''}. ${item.reason || item.description || 'Salida extraordinaria documentada en Hilo Cofrade.'}`
  )
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(canonicalPath)}#webpage`,
    url: absoluteUrl(canonicalPath),
    name: pageTitle(`${item.title} · ${item.municipality}`),
    description: pageDescription,
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
  }
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${item.outingType}: ${item.title}`,
    startDate: item.departureTime ? `${item.date}T${item.departureTime}:00` : item.date,
    ...(item.returnDate || item.returnTime ? {
      endDate: `${item.returnDate || item.date}${item.returnTime ? `T${item.returnTime}:00` : ''}`,
    } : {}),
    description: item.reason || item.description || pageDescription,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(item.eventStatus === 'announced' ? { eventStatus: 'https://schema.org/EventScheduled' } : {}),
    ...(item.eventStatus === 'cancelled' ? { eventStatus: 'https://schema.org/EventCancelled' } : {}),
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
  }

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Extraordinarias', path: '/extraordinarias' },
        { name: item.title, path: canonicalPath },
      ])} />
      <JsonLd data={pageJsonLd} />
      <JsonLd data={eventJsonLd} />

      <section className={styles.hero}>
        <div className={`shell ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Link className={styles.backLink} href="/extraordinarias">← Todas las extraordinarias</Link>
            <div className={styles.heroTopline}>
              <span>{item.municipality || 'Sevilla y provincia'}</span>
              <span data-status={item.eventStatus}>{statusLabel(item.eventStatus)}</span>
            </div>
            <h1>{item.title}</h1>
            {item.brotherhoodHref
              ? <Link className={styles.brotherhood} href={item.brotherhoodHref}>{item.brotherhoodName}</Link>
              : <strong className={styles.brotherhood}>{item.brotherhoodName}</strong>}
            {item.reason ? <p className={styles.reason}>{item.reason}</p> : null}

            <div className={styles.keyFacts}>
              <div className={styles.dateFact}>
                <span>Fecha</span>
                <strong>{dateLabel}</strong>
              </div>
              {item.departureTime ? <div><span>Salida</span><strong>{item.departureTime}</strong></div> : null}
              {entry ? <div><span>Entrada</span><strong>{entry}</strong></div> : null}
              <div><span>Tipo</span><strong>{item.outingType}</strong></div>
            </div>
          </div>

          <div className={styles.heroMedia}>
            {item.heroImagePath ? (
              <>
                <Image
                  src={item.heroImagePath}
                  alt={item.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 860px) calc(100vw - 40px), 42vw"
                />
                <span className={styles.heroShade} aria-hidden="true" />
                {item.heroImageCredit ? <small>{item.heroImageCredit}</small> : null}
              </>
            ) : (
              <div className={styles.datePoster}>
                <span>{formatShortDate(item.date)}</span>
                <strong>{item.municipality || 'Sevilla'}</strong>
                <small>Extraordinaria</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Contenido de la guía">
        <div className="shell">
          {item.journeyPhases.length ? <a href="#desarrollo">Desarrollo</a> : null}
          {item.schedule.length ? <a href="#horarios">Horarios</a> : null}
          {item.processionalMusic.length ? <a href="#musica">Acompañamiento</a> : null}
          {item.routeSummary ? <a href="#recorrido">Recorrido</a> : null}
          {item.poster ? <a href="#cartel">Cartel</a> : null}
          {item.gallery.length ? <a href="#galeria">Galería</a> : null}
          {item.sources.length ? <a href="#fuentes">Fuentes</a> : null}
        </div>
      </nav>

      <div className={`shell ${styles.content}`}>
        {item.journeyPhases.length ? (
          <section className={`${styles.section} ${journeyStyles.journeySection}`} id="desarrollo">
            <header className={styles.sectionHead}>
              <span>Cómo se desarrolla</span>
              <h2>Desarrollo de la jornada</h2>
              <p>Los distintos momentos de la extraordinaria, ordenados para entender la jornada de un vistazo.</p>
            </header>
            <div className={journeyStyles.journeyGrid}>
              {item.journeyPhases.map((phase, index) => (
                <article className={journeyStyles.journeyCard} key={phase.id}>
                  <div className={journeyStyles.journeyTopline}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {phase.eyebrow ? <small>{phase.eyebrow}</small> : null}
                  </div>
                  <h3>{phase.title}</h3>
                  {phase.time ? <strong className={journeyStyles.journeyTime}>{phase.time}</strong> : null}
                  {phase.summary ? <p>{phase.summary}</p> : null}
                  {phase.places.length ? (
                    <div className={journeyStyles.journeyPlaces}>
                      {phase.places.map((place) => <span key={`${phase.id}-${place}`}>{place}</span>)}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {item.schedule.length ? (
          <section className={styles.section} id="horarios">
            <header className={styles.sectionHead}>
              <span>La jornada</span>
              <h2>Horarios</h2>
              <p>Hitos publicados para seguir la extraordinaria durante el día.</p>
            </header>
            <div className={styles.timeline}>
              {item.schedule.map((scheduleItem) => (
                <article key={scheduleItem.id}>
                  <div className={styles.timelineTime}>
                    <strong>{scheduleItem.time || scheduleItem.timeText || '—'}</strong>
                    {scheduleItem.date && scheduleItem.date !== item.date
                      ? <small>{formatShortDate(scheduleItem.date)}</small>
                      : null}
                  </div>
                  <div className={styles.timelineCopy}>
                    <h3>{scheduleItem.label}</h3>
                    {scheduleItem.place ? <strong>{scheduleItem.place}</strong> : null}
                    {scheduleItem.notes ? <p>{scheduleItem.notes}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {item.processionalMusic.length ? (
          <section className={`${styles.section} ${styles.musicSection}`} id="musica">
            <header className={styles.sectionHead}>
              <span>Tras el paso</span>
              <h2>Acompañamiento musical</h2>
              <p>Bandas y formaciones que acompañan la salida, diferenciadas por tramo cuando está documentado.</p>
            </header>
            <MusicRows items={item.processionalMusic} />
          </section>
        ) : null}

        {otherMusicGroups.length ? (
          <section className={`${styles.section} ${styles.otherMusicSection}`}>
            <header className={styles.sectionHead}>
              <span>Programa musical</span>
              <h2>Otros momentos musicales</h2>
            </header>
            <div className={styles.otherMusicGrid}>
              {otherMusicGroups.map(([section, rows]) => (
                <div key={section}>
                  <h3>{musicTitle(section)}</h3>
                  <MusicRows items={rows} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {item.routeSummary ? (
          <section className={styles.section} id="recorrido">
            <header className={styles.sectionHead}>
              <span>Por dónde verla</span>
              <h2>Recorrido</h2>
            </header>
            {(item.origin || item.destination) ? (
              <div className={styles.routeFacts}>
                {item.origin ? <div><span>Origen</span><strong>{item.origin}</strong></div> : null}
                {item.destination ? <div><span>Destino</span><strong>{item.destination}</strong></div> : null}
              </div>
            ) : null}
            <p className={styles.routeText}>{item.routeSummary}</p>
          </section>
        ) : null}

        {(item.description || item.publicNotes) ? (
          <section className={`${styles.section} ${styles.contextSection}`}>
            <header className={styles.sectionHead}>
              <span>Contexto</span>
              <h2>Datos de interés</h2>
            </header>
            {item.description ? <p>{item.description}</p> : null}
            {item.publicNotes ? <p>{item.publicNotes}</p> : null}
          </section>
        ) : null}

        {item.poster ? (
          <section className={`${styles.section} ${mediaStyles.mediaSection}`} id="cartel">
            <header className={styles.sectionHead}>
              <span>Imagen oficial</span>
              <h2>Cartel</h2>
              <p>Pieza anunciadora documentada para esta extraordinaria.</p>
            </header>
            <div className={mediaStyles.posterWrap}>
              <figure className={mediaStyles.posterFigure}>
                <div className={mediaStyles.posterFrame}>
                  <Image src={item.poster.path} alt={item.poster.alt} fill sizes="(max-width: 620px) calc(100vw - 40px), 520px" />
                </div>
                {item.poster.credit ? <figcaption>{item.poster.credit}</figcaption> : null}
              </figure>
              <div className={mediaStyles.posterCopy}>
                <span>Cartel oficial</span>
                <h3>{item.poster.title || item.title}</h3>
                <p>El cartel se conserva completo, sin aplicar recortes editoriales.</p>
              </div>
            </div>
          </section>
        ) : null}

        {item.gallery.length ? (
          <section className={styles.section} id="galeria">
            <header className={styles.sectionHead}>
              <span>Archivo visual</span>
              <h2>Galería</h2>
              <p>Imágenes complementarias vinculadas a esta extraordinaria.</p>
            </header>
            <div className={mediaStyles.galleryGrid}>
              {item.gallery.map((media) => (
                <figure className={mediaStyles.galleryItem} key={media.id}>
                  <a className={mediaStyles.galleryLink} href={media.path} target="_blank" rel="noreferrer">
                    <div className={mediaStyles.galleryFrame}>
                      <Image src={media.path} alt={media.alt} fill sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 900px) 50vw, 33vw" />
                    </div>
                  </a>
                  <figcaption>
                    {media.credit ? <strong>{media.credit}</strong> : null}
                    <small>{media.alt}</small>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className={mediaStyles.galleryHint}>Pulsa una fotografía para verla completa.</p>
          </section>
        ) : null}

        {item.sources.length ? (
          <section className={styles.section} id="fuentes">
            <header className={styles.sectionHead}>
              <span>Documentación</span>
              <h2>Fuentes</h2>
              <p>Información utilizada para documentar esta extraordinaria en Hilo Cofrade.</p>
            </header>
            <div className={styles.sources}>
              {item.sources.map((source) => (
                <article key={source.id}>
                  <div>
                    <span>{source.type || 'Fuente'}</span>
                    <strong>{source.name}</strong>
                    {source.scope ? <p>{source.scope}</p> : null}
                    {source.publicationDate ? <small>{formatShortDate(source.publicationDate)}</small> : null}
                  </div>
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">Abrir fuente ↗</a>
                  ) : <span className={styles.sourceNoLink}>Referencia interna</span>}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
