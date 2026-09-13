import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { getMusicalRepertoireBySlug } from '@/lib/supabase/musical-repertoires'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import styles from '../crucetas.module.css'

export const dynamic = 'force-dynamic'

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

function BandLogo({ band, size = 36 }) {
  if (!band?.logoPath) return <span aria-hidden="true">♪</span>

  return (
    <Image
      src={band.logoPath}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
    />
  )
}

function authorship(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  const primary = composers.length ? composers : entry.authors
  return primary.map((author) => author.name).join(' · ') || entry.credit || ''
}

function secondaryAuthorship(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  if (!composers.length) return ''
  return entry.authors
    .filter((author) => author.role !== 'composer')
    .map((author) => `${author.role === 'adapter' ? 'Adaptación' : author.role === 'lyricist' ? 'Letra' : 'Autoría'}: ${author.name}`)
    .join(' · ')
}

function performanceLabel(count) {
  return count === 1 ? '1 vez' : `${count} veces`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const repertoire = await getMusicalRepertoireBySlug(slug)
  if (!repertoire) return { title: 'Cruceta musical no encontrada', robots: { index: false, follow: false } }

  const title = `${repertoire.brotherhood.name}: cruceta musical de ${repertoire.year}`
  const description = `${repertoire.worksCount} obras y ${repertoire.performancesCount} interpretaciones de ${repertoire.band.name} en ${repertoire.outing.title}.`

  return {
    title,
    description,
    alternates: { canonical: repertoire.href },
    openGraph: { title: pageTitle(title), description, url: repertoire.href },
  }
}

export default async function MusicalRepertoireDetailPage({ params }) {
  const { slug } = await params
  const repertoire = await getMusicalRepertoireBySlug(slug)
  if (!repertoire) notFound()

  const stepHref = repertoire.step?.slug ? `/pasos/${repertoire.step.slug}` : ''
  const listenableCount = repertoire.entries.filter((entry) => entry.listening).length

  return (
    <div
      className={styles.detail}
      style={{ '--repertoire-primary': repertoire.colors.primary, '--repertoire-accent': repertoire.colors.accent }}
    >
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Crucetas musicales', path: '/crucetas-musicales' },
        { name: repertoire.brotherhood.name, path: repertoire.href },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        name: repertoire.title,
        url: absoluteUrl(repertoire.href),
        numTracks: repertoire.worksCount,
        dateCreated: repertoire.date,
        byArtist: { '@type': 'MusicGroup', name: repertoire.band.name, url: absoluteUrl(repertoire.band.href) },
        track: repertoire.entries.map((entry) => ({
          '@type': 'MusicRecording',
          name: entry.title,
          url: entry.marchHref ? absoluteUrl(entry.marchHref) : undefined,
        })),
      }} />

      <header className={styles.detailHero}>
        <div className={`shell ${styles.detailHeroShell}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><Link href="/crucetas-musicales">Crucetas musicales</Link>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.heroMeta}>
                <div className={styles.verified}><i aria-hidden="true" /> Repertorio interpretado</div>
                <span className={styles.heroDate}>{dateLabel(repertoire.date)}</span>
                <span className={styles.heroEdition}>Edición {repertoire.year}</span>
              </div>
              <h1>{repertoire.brotherhood.name}</h1>
              <p>{repertoire.outing.title}</p>
              {repertoire.band.href ? (
                <Link className={styles.heroBand} href={repertoire.band.href}>
                  <BandLogo band={repertoire.band} size={38} />
                  <strong>{repertoire.band.name}</strong>
                  <b aria-hidden="true">→</b>
                </Link>
              ) : null}
            </div>
          </div>

          <div className={styles.heroMetrics}>
            <div><strong>{repertoire.worksCount}</strong><span>obras distintas</span></div>
            <div><strong>{repertoire.performancesCount}</strong><span>interpretaciones</span></div>
          </div>
        </div>
      </header>

      <section className={styles.relationsSection}>
        <div className={`shell ${styles.relationsGrid}`}>
          <Link href={repertoire.brotherhood.href}>
            <span>Hermandad</span>
            <strong>{repertoire.brotherhood.name}</strong>
            <small>Consultar ficha <b aria-hidden="true">→</b></small>
          </Link>
          <Link href={repertoire.band.href}>
            <span aria-label="Banda"><BandLogo band={repertoire.band} size={30} /></span>
            <strong>{repertoire.band.name}</strong>
            <small>Consultar ficha <b aria-hidden="true">→</b></small>
          </Link>
          {repertoire.step ? (
            stepHref ? (
              <Link href={stepHref}>
                <span>Paso</span>
                <strong>{repertoire.step.name}</strong>
                <small>Consultar ficha <b aria-hidden="true">→</b></small>
              </Link>
            ) : (
              <div>
                <span>Paso</span>
                <strong>{repertoire.step.name}</strong>
                <small>Procesión de {repertoire.year}</small>
              </div>
            )
          ) : null}
        </div>
      </section>

      <section className={styles.repertoireSection}>
        <div className="shell">
          <header className={styles.repertoireHeading}>
            <div>
              <span>La música de la procesión</span>
              <h2>Repertorio interpretado</h2>
              <small>{repertoire.worksCount} Marchas vinculadas{listenableCount ? ` · ${listenableCount} con escucha disponible` : ''}</small>
            </div>
            <p>La cifra indica cuántas veces fue interpretada cada obra según la información facilitada. No se deduce el orden, el lugar ni si las interpretaciones fueron consecutivas.</p>
          </header>

          <div className={styles.worksGrid}>
            {repertoire.entries.map((entry) => (
              <article className={styles.workCard} key={entry.id}>
                <div className={styles.note} aria-hidden="true">♪</div>
                <div className={styles.workCopy}>
                  <div className={styles.workTitle}>
                    <span>{entry.workType || 'Marcha vinculada'}{entry.compositionYear ? ` · ${entry.compositionYear}` : ''}</span>
                    <h3>{entry.marchHref ? <Link href={entry.marchHref}>{entry.title} <b aria-hidden="true">→</b></Link> : entry.title}</h3>
                  </div>
                  <dl className={styles.workRelations}>
                    <div>
                      <dt>Autoría</dt>
                      <dd>{authorship(entry) || 'No documentada'}</dd>
                      {secondaryAuthorship(entry) ? <small>{secondaryAuthorship(entry)}</small> : null}
                    </div>
                    {entry.dedications.length ? (
                      <div>
                        <dt>Dedicatoria</dt>
                        <dd>{entry.dedications.map((dedication, index) => (
                          <span key={`${dedication.id}-${index}`}>
                            {index ? ' · ' : ''}
                            {dedication.href ? <Link href={dedication.href}>{dedication.name}</Link> : dedication.name}
                          </span>
                        ))}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
                <div className={styles.workActions}>
                  <strong className={styles.count} aria-label={`${entry.count} ${entry.count === 1 ? 'interpretación' : 'interpretaciones'}`}>{performanceLabel(entry.count)}</strong>
                  {entry.listening ? (
                    <a
                      className={styles.listen}
                      href={entry.listening.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escuchar ${entry.title} en ${entry.listening.provider}`}
                      data-hilo-event="repertoire_listen_click"
                      data-hilo-provider={entry.listening.provider.toLowerCase()}
                    >
                      <span aria-hidden="true">▶</span>
                      <span>Escuchar <small>{entry.listening.provider}</small></span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sourceSection}>
        <div className={`shell ${styles.sourceCard}`}>
          <div><span>Fuente directa</span><h2>{repertoire.source?.name || 'Información de la formación musical'}</h2></div>
          <p>{repertoire.source?.notes || repertoire.notes}</p>
          {repertoire.source?.url ? <a href={repertoire.source.url} target="_blank" rel="noreferrer">Consultar publicación original ↗</a> : null}
        </div>
      </section>
    </div>
  )
}
