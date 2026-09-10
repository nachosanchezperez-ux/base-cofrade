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
                  <span>Banda</span>
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
            <span>Banda</span>
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
            </div>
            <p>La cifra indica cuántas veces fue interpretada cada obra según la información facilitada. No se deduce el orden, el lugar ni si las interpretaciones fueron consecutivas.</p>
          </header>

          <div className={styles.worksGrid}>
            {repertoire.entries.map((entry) => (
              <article className={styles.workCard} key={entry.id}>
                <div className={styles.note} aria-hidden="true">♪</div>
                <div>
                  <h3>{entry.title}</h3>
                  {entry.credit ? <p>{entry.credit}</p> : <p>Autoría no indicada en la fuente</p>}
                </div>
                {entry.count > 1 ? (
                  <strong className={styles.count} aria-label={`${entry.count} interpretaciones`}>×{entry.count}</strong>
                ) : null}
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
