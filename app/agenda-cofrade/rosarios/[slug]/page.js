import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  compactSeoTitle,
  schemaEventStatus,
  seoDescription,
  socialMetadata,
} from '@/lib/seo'
import { getRosaryOutingDetail } from '@/lib/supabase/rosary-outings'
import styles from './rosary-detail.module.css'

export const dynamic = 'force-dynamic'

const getRosary = cache(getRosaryOutingDetail)

function formatDate(value) {
  if (!value) return 'Fecha por confirmar'
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

function madridUtcOffset(value) {
  if (!value) return '+00:00'
  const zone = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'longOffset',
  }).formatToParts(new Date(`${value}T12:00:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value || 'GMT+00:00'
  return zone.replace('GMT', '') || '+00:00'
}

function dateTime(date, time) {
  if (!date) return ''
  return time ? `${date}T${time}:00${madridUtcOffset(date)}` : date
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getRosary(slug)
  if (!item) return { title: 'Rosario no encontrado', robots: { index: false, follow: false } }

  const title = compactSeoTitle(`${item.title}${item.municipality ? ` en ${item.municipality}` : ''}`)
  const description = seoDescription([
    item.mode,
    formatDate(item.date),
    item.departureTime ? `salida a las ${item.departureTime} horas` : '',
    item.routeSummary ? 'horario y recorrido' : 'información actualizada',
  ].filter(Boolean).join('. '))
  const canonical = `/agenda-cofrade/rosarios/${item.slug}`

  return {
    title,
    description,
    ...socialMetadata({
      title,
      description,
      path: canonical,
      type: 'article',
      images: item.heroImagePath ? [{ url: item.heroImagePath, alt: item.heroImageAlt }] : undefined,
    }),
  }
}

export default async function RosaryDetailPage({ params }) {
  const { slug } = await params
  const item = await getRosary(slug)
  if (!item) notFound()

  const canonicalPath = `/agenda-cofrade/rosarios/${item.slug}`
  const canonicalUrl = absoluteUrl(canonicalPath)
  const description = item.description || `${item.mode} documentado en la Agenda Cofrade de Hilo Cofrade.`
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${canonicalUrl}#event`,
    url: canonicalUrl,
    name: item.title,
    startDate: dateTime(item.date, item.departureTime),
    ...(item.returnTime || item.returnDate ? { endDate: dateTime(item.returnDate || item.date, item.returnTime) } : {}),
    description,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(schemaEventStatus(item) ? { eventStatus: schemaEventStatus(item) } : {}),
    ...(item.heroImagePath ? { image: [absoluteUrl(item.heroImagePath)] } : {}),
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
        ...(item.originAddress ? { streetAddress: item.originAddress } : {}),
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
        { name: 'Agenda Cofrade', path: '/agenda-cofrade' },
        { name: 'Rosarios', path: '/agenda-cofrade#rosarios' },
        { name: item.title, path: canonicalPath },
      ])} />
      <JsonLd data={eventJsonLd} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>›</span><Link href="/agenda-cofrade">Agenda Cofrade</Link><span>›</span><strong>Rosarios</strong>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.badges}>
                <span>{item.mode}</span>
                {item.isExtraordinary ? <b>Extraordinario</b> : null}
              </div>
              <h1>{item.title}</h1>
              <p>{item.brotherhoodName}</p>
              <div className={styles.heroFacts}>
                <div><span>Fecha</span><strong>{formatDate(item.date)}</strong></div>
                <div><span>Salida</span><strong>{item.departureTime ? `${item.departureTime} h` : 'Por confirmar'}</strong></div>
                <div><span>Localidad</span><strong>{item.municipality || 'Por confirmar'}</strong></div>
              </div>
            </div>

            {item.heroImagePath || item.crestPath ? (
              <div className={`${styles.heroVisual} ${item.crestPath && !item.heroImagePath ? styles.crestVisual : ''}`}>
                <Image
                  src={item.heroImagePath || item.crestPath}
                  alt={item.heroImagePath ? item.heroImageAlt : `Escudo de ${item.brotherhoodName}`}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 34vw"
                  className={item.heroImagePath ? styles.heroPhoto : styles.heroCrest}
                />
                {item.heroImageCredit ? <small>Fotografía: {item.heroImageCredit}</small> : null}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <article className={styles.mainColumn}>
          {description ? (
            <section>
              <span className={styles.eyebrow}>El rosario</span>
              <h2>Información</h2>
              <p className={styles.lead}>{description}</p>
            </section>
          ) : null}

          {item.routeSummary ? (
            <section>
              <span className={styles.eyebrow}>Por las calles</span>
              <h2>Recorrido</h2>
              <p className={styles.route}>{item.routeSummary}</p>
            </section>
          ) : null}

          {item.schedule.length ? (
            <section>
              <span className={styles.eyebrow}>Hitos previstos</span>
              <h2>Horarios</h2>
              <div className={styles.rows}>
                {item.schedule.map((row) => (
                  <div className={styles.row} key={row.id}>
                    <strong>{row.time || row.timeText || '—'}</strong>
                    <div><b>{row.label}</b>{row.place ? <span>{row.place}</span> : null}{row.notes ? <small>{row.notes}</small> : null}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {item.music.length ? (
            <section>
              <span className={styles.eyebrow}>Acompañamiento</span>
              <h2>Música</h2>
              <div className={styles.rows}>
                {item.music.map((row, index) => (
                  <div className={styles.row} key={row.id || `${row.name}-${index}`}>
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                    <div>{row.href ? <Link href={row.href}>{row.name}</Link> : <b>{row.name}</b>}{row.context ? <span>{row.context}</span> : null}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className={styles.aside}>
          <div className={styles.summaryCard}>
            <span>De un vistazo</span>
            <dl>
              <div><dt>Modalidad</dt><dd>{item.mode}</dd></div>
              <div><dt>Salida</dt><dd>{item.origin || 'Por confirmar'}</dd></div>
              {item.destination ? <div><dt>Destino</dt><dd>{item.destination}</dd></div> : null}
              <div><dt>Entrada</dt><dd>{item.returnTime ? `${item.returnTime} h` : 'Por confirmar'}</dd></div>
            </dl>
            {item.brotherhoodHref ? <Link href={item.brotherhoodHref}>Ver ficha de la Hermandad <span>→</span></Link> : null}
          </div>

          {item.sources.length ? (
            <div className={styles.sources}>
              <span>Fuentes</span>
              {item.sources.map((source) => source.url ? (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>{source.name}<small>↗</small></a>
              ) : <p key={source.id}>{source.name}</p>)}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
