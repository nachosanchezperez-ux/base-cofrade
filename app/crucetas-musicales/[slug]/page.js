import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { musicalRepertoireDateLabel, musicalRepertoireShortDate } from '@/lib/musical-repertoires/presentation'
import { getMusicalRepertoireBySlug } from '@/lib/supabase/musical-repertoires'
import { getMusicalRepertoires } from '@/lib/supabase/public-directory-cache'
import { absoluteUrl, breadcrumbJsonLd, compactSeoTitle, socialMetadata } from '@/lib/seo'
import styles from '../crucetas.module.css'
import RepertoireExplorer from './RepertoireExplorer'
import { plural } from '@/lib/plural'
import { isPreservedAgendaEventPath } from '@/lib/agenda-event-url-policy'
import { bandHabitualMarchIds, compareEditions, previousEdition } from '@/lib/musical-repertoires/insights'

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

// Otras crucetas de la misma Banda o de la misma Hermandad: el hilo musical
// sigue sin salir de la sección. Un fallo aquí nunca debe tumbar la ficha.
// Ficha propia de la salida, solo si existe como página (la política de la
// Agenda no crea una URL por cada acto; el resto redirige a la Agenda).
function outingPageHref(outing) {
  if (!outing?.slug) return ''
  return [
    `/procesiones-de-gloria/${outing.slug}`,
    `/extraordinarias/${outing.slug}`,
    `/agenda-cofrade/rosarios/${outing.slug}`,
  ].find((path) => isPreservedAgendaEventPath(path)) || ''
}

async function repertoireContext(repertoire) {
  try {
    const all = await getMusicalRepertoires()
    const related = all
      .filter((item) => item.id !== repertoire.id && (
        (repertoire.band.id && item.band.id === repertoire.band.id)
        || (repertoire.brotherhood.id && item.brotherhood.id === repertoire.brotherhood.id)
      ))
      .slice(0, 6)
    return {
      related,
      habitualIds: [...bandHabitualMarchIds(all, repertoire.band.id)],
      comparison: compareEditions(repertoire, previousEdition(repertoire, all)),
    }
  } catch {
    return { related: [], habitualIds: [], comparison: null }
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const repertoire = await getMusicalRepertoireBySlug(slug)
  if (!repertoire) return { title: 'Cruceta musical no encontrada', robots: { index: false, follow: false } }

  const title = compactSeoTitle(`${repertoire.displayTitle}: cruceta de ${repertoire.band.name}`)
  const description = `${plural(repertoire.worksCount, 'obra', 'obras')} y ${plural(repertoire.performancesCount, 'interpretación', 'interpretaciones')} de ${repertoire.band.name} en ${repertoire.displayTitle}.`

  return {
    title,
    description,
    // images: null → la imagen propia de opengraph-image.js (colores de la Hermandad).
    ...socialMetadata({ title, description, path: repertoire.href, images: null }),
  }
}

export default async function MusicalRepertoireDetailPage({ params }) {
  const { slug } = await params
  const repertoire = await getMusicalRepertoireBySlug(slug)
  if (!repertoire) notFound()

  const stepHref = repertoire.step?.slug ? `/pasos/${repertoire.step.slug}` : ''
  const listenableCount = repertoire.entries.filter((entry) => entry.listening).length
  const { related, habitualIds, comparison } = await repertoireContext(repertoire)
  const outingHref = outingPageHref(repertoire.outing)
  const heroContext = [
    repertoire.outing.type,
    repertoire.municipality?.name,
    repertoire.moment ? musicalRepertoireDateLabel(repertoire.date) : '',
  ].filter(Boolean).join(' · ')

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
        byArtist: { '@type': 'MusicGroup', name: repertoire.band.name, url: repertoire.band.href ? absoluteUrl(repertoire.band.href) : undefined },
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
                {heroContext ? <span className={styles.heroDate}>{heroContext}</span> : null}
              </div>
              <h1>{repertoire.displayTitle}</h1>
              {repertoire.band.href ? (
                <Link className={styles.heroBand} href={repertoire.band.href}>
                  <BandLogo band={repertoire.band} size={38} />
                  <span className={styles.heroBandCopy}><small>Cruceta de</small><strong>{repertoire.band.name}</strong></span>
                  <b aria-hidden="true">→</b>
                </Link>
              ) : <p>Cruceta de {repertoire.band.name}</p>}
            </div>
          </div>

          <div className={styles.heroMetrics}>
            <div><strong>{repertoire.worksCount}</strong><span>obras distintas</span></div>
            <div><strong>{repertoire.performancesCount}</strong><span>interpretaciones</span></div>
          </div>
        </div>
      </header>

      {repertoire.brotherhood.href || repertoire.step || outingHref ? <section className={styles.relationsSection}>
        <div className={`shell ${styles.relationsGrid}`}>
          {repertoire.brotherhood.href ? (
            <Link href={repertoire.brotherhood.href}>
              <span>Hermandad</span>
              <strong>{repertoire.brotherhood.name}</strong>
              <small>Consultar ficha <b aria-hidden="true">→</b></small>
            </Link>
          ) : null}
          {outingHref ? (
            <Link href={outingHref}>
              <span>Salida</span>
              <strong>{repertoire.outing.type || 'La procesión'}</strong>
              <small>Consultar la salida <b aria-hidden="true">→</b></small>
            </Link>
          ) : null}
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
      </section> : null}

      <section className={styles.repertoireSection}>
        <div className="shell">
          <header className={styles.repertoireHeading}>
            <div>
              <span>La música de la procesión</span>
              <h2>Repertorio interpretado</h2>
              <small>{plural(repertoire.worksCount, 'marcha vinculada', 'marchas vinculadas')}{listenableCount ? ` · ${listenableCount} con escucha disponible` : ''}</small>
            </div>
            <p>La cifra indica cuántas veces fue interpretada cada obra según la información facilitada. No se deduce el orden, el lugar ni si las interpretaciones fueron consecutivas.</p>
          </header>

          {comparison && (comparison.entered.length || comparison.left.length) ? (
            <aside className={styles.comparison} aria-label={`Respecto a ${comparison.previous.year}`}>
              <h3>Respecto a <Link href={comparison.previous.href}>{comparison.previous.year}</Link></h3>
              <p>{comparison.sameBand ? `Misma banda. Repiten ${comparison.kept} obras.` : `Cambio de banda: en ${comparison.previous.year} acompañó ${comparison.previous.band}.`}</p>
              {comparison.entered.length ? <p><strong>Entran:</strong> {comparison.entered.map((item) => item.title).join(' · ')}</p> : null}
              {comparison.left.length ? <p><strong>Salen:</strong> {comparison.left.map((item) => item.title).join(' · ')}</p> : null}
            </aside>
          ) : null}

          <RepertoireExplorer entries={repertoire.entries} habitualIds={habitualIds} bandName={repertoire.band.name} />
        </div>
      </section>

      {related.length ? (
        <section className={styles.relatedSection} aria-labelledby="mas-crucetas">
          <div className="shell">
            <h2 id="mas-crucetas">Más crucetas</h2>
            <div className={styles.directoryGrid}>
              {related.map((item) => (
                <article className={styles.directoryCard} key={item.id} style={{ '--repertoire-primary': item.colors.primary, '--repertoire-accent': item.colors.accent }}>
                  <div className={styles.cardTopline}>
                    <time dateTime={item.date}>{musicalRepertoireShortDate(item.date) || item.year}</time>
                    {item.outing.type ? <span>{item.outing.type}</span> : null}
                  </div>
                  <h3><Link href={item.href}>{item.identityName || item.displayTitle.split(' · ')[0]}</Link></h3>
                  <p className={styles.cardBand}>Por <strong>{item.band.name}</strong></p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
