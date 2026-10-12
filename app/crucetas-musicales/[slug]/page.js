import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { musicalRepertoireDateLabel } from '@/lib/musical-repertoires/presentation'
import { getMusicalRepertoireBySlug } from '@/lib/supabase/musical-repertoires'
import { absoluteUrl, breadcrumbJsonLd, compactSeoTitle, socialMetadata } from '@/lib/seo'
import styles from '../crucetas.module.css'
import RepertoireExplorer from './RepertoireExplorer'

export const dynamic = 'force-static'
export const revalidate = 900

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

export async function generateMetadata({ params }) {
  const { slug } = await params
  const repertoire = await getMusicalRepertoireBySlug(slug)
  if (!repertoire) return { title: 'Cruceta musical no encontrada', robots: { index: false, follow: false } }

  const title = compactSeoTitle(`${repertoire.displayTitle}: cruceta de ${repertoire.band.name}`)
  const description = `${repertoire.worksCount} obras y ${repertoire.performancesCount} interpretaciones de ${repertoire.band.name} en ${repertoire.displayTitle}.`

  return {
    title,
    description,
    ...socialMetadata({ title, description, path: repertoire.href }),
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
        { name: repertoire.displayTitle, path: repertoire.href },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        name: repertoire.displayTitle,
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
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Crucetas musicales', href: '/crucetas-musicales' },
              { label: repertoire.displayTitle },
            ]}
            tone="dark"
            showAccent={false}
          />

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <div className={styles.heroMeta}>
                <div className={styles.verified}><i aria-hidden="true" /> Repertorio interpretado</div>
                <span className={styles.heroDate}>{musicalRepertoireDateLabel(repertoire.date)}</span>
              </div>
              <h1>{repertoire.displayTitle}</h1>
              <p>Cruceta de {repertoire.band.name}</p>
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

          <RepertoireExplorer entries={repertoire.entries} />
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
