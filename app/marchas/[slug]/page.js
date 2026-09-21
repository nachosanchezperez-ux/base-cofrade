import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import EntityLastUpdated from '@/components/EntityLastUpdated'
import EntitySectionNav from '@/components/EntitySectionNav'
import RelationalThread from '@/components/RelationalThread'
import { getPublicMarchBySlug } from '@/lib/supabase/public-marches'
import { absoluteUrl, breadcrumbJsonLd, compactSeoTitle, socialMetadata } from '@/lib/seo'
import styles from './marcha.module.css'

export const dynamic = 'force-static'
export const revalidate = 900

const AUTHOR_LABELS = {
  composer: 'Composición',
  adapter: 'Adaptación',
  lyricist: 'Letra',
  arranger: 'Arreglo',
}

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

function countLabel(count) {
  return count === 1 ? '1 interpretación' : `${count} interpretaciones`
}

function metricLabel(count, singular, plural) {
  return count === 1 ? singular : plural
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const march = await getPublicMarchBySlug(slug)
  if (!march) return { title: 'Marcha no encontrada', robots: { index: false, follow: false } }

  const composers = march.authors.filter((author) => author.role === 'composer').map((author) => author.name).join(', ')
  const description = [composers ? `Obra de ${composers}.` : '', march.documentedPerformances ? `${countLabel(march.documentedPerformances)} ${metricLabel(march.documentedPerformances, 'documentada', 'documentadas')} en crucetas musicales.` : '', march.listenings.length ? 'Grabaciones disponibles.' : ''].filter(Boolean).join(' ')

  const title = compactSeoTitle(`${march.name} · Marcha procesional`)
  return {
    title,
    description,
    ...socialMetadata({ title, description, path: march.href }),
  }
}

export default async function MarchDetailPage({ params }) {
  const { slug } = await params
  const march = await getPublicMarchBySlug(slug)
  if (!march) notFound()

  const relatedBands = [
    ...(march.premiereBand?.href ? [{ ...march.premiereBand, relation: 'Estrenada por' }] : []),
    ...march.listenings.filter((item) => item.band?.href).map((item) => ({ ...item.band, relation: 'Grabación' })),
    ...march.repertoireHistory.filter((item) => item.band?.href).map((item) => ({ ...item.band, relation: 'Interpretación documentada' })),
    ...march.discographyHistory.filter((item) => item.band?.href).map((item) => ({ ...item.band, relation: 'Discografía' })),
  ]
  const marchThreadItems = [
    ...march.authors
      .filter((author) => author.href)
      .map((author) => ({
        kind: 'Compositor',
        relation: AUTHOR_LABELS[author.role] || 'Autoría',
        title: author.name,
        href: author.href,
        context: 'Ver otras Marchas documentadas',
      })),
    ...march.dedications
      .filter((dedication) => dedication.href)
      .map((dedication) => ({
        kind: 'Dedicatoria',
        relation: 'Dedicada a',
        title: dedication.name,
        href: dedication.href,
        context: [dedication.date, dedication.text !== dedication.name ? dedication.text : ''].filter(Boolean).join(' · '),
      })),
    ...relatedBands.map((band) => ({
      kind: 'Banda',
      relation: band.relation,
      title: band.name,
      href: band.href,
      context: 'Formación vinculada a esta obra',
    })),
    ...march.repertoireHistory.map((item) => ({
      kind: 'Cruceta',
      relation: 'Interpretada en',
      title: item.outingTitle || item.repertoireTitle,
      href: item.repertoireHref,
      context: [item.brotherhood?.name, item.band?.name, item.year].filter(Boolean).join(' · '),
    })),
    ...march.discographyHistory
      .filter((item) => item.bandDiscographyHref)
      .map((item) => ({
        kind: 'Discografía',
        relation: 'Incluida en',
        title: item.title,
        href: item.bandDiscographyHref,
        context: [item.band?.name, item.year].filter(Boolean).join(' · '),
      })),
  ]

  return (
    <div
      className={styles.page}
      style={{
        '--brotherhood-primary': '#102943',
        '--brotherhood-secondary': '#c99f49',
        '--brotherhood-dark': '#08131f',
      }}
    >
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Marchas', path: '/marchas' },
        { name: march.name, path: march.href },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'MusicComposition',
        name: march.name,
        url: absoluteUrl(march.href),
        dateCreated: march.compositionYear || undefined,
        composer: march.authors.filter((author) => author.role === 'composer').map((author) => ({ '@type': 'Person', name: author.name })),
      }} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroShell}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><Link href="/marchas">Marchas</Link><span>/</span><strong>{march.name}</strong>
          </nav>
          <div className={styles.heroBody}>
            <span>{march.workType}</span>
            <h1>{march.name}</h1>
            {march.summary ? <p>{march.summary}</p> : null}
          </div>
          <div className={styles.metrics}>
            <div><strong>{march.documentedPerformances}</strong><span>{metricLabel(march.documentedPerformances, 'interpretación documentada', 'interpretaciones documentadas')}</span></div>
            <div><strong>{march.repertoireHistory.length}</strong><span>{metricLabel(march.repertoireHistory.length, 'cruceta relacionada', 'crucetas relacionadas')}</span></div>
            <div><strong>{march.listenings.length}</strong><span>{metricLabel(march.listenings.length, 'escucha disponible', 'escuchas disponibles')}</span></div>
            <div><strong>{march.discographyHistory.length}</strong><span>{metricLabel(march.discographyHistory.length, 'aparición discográfica', 'apariciones discográficas')}</span></div>
          </div>
        </div>
      </header>

      <EntityLastUpdated value={march.updatedAt} variant="bar" />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'Ficha musical' },
        marchThreadItems.length > 0 && { href: '#tira-del-hilo', label: 'Conexiones' },
        march.listenings.length > 0 && { href: '#escuchar', label: 'Escuchar' },
        march.repertoireHistory.length > 0 && { href: '#crucetas', label: 'Crucetas' },
        march.discographyHistory.length > 0 && { href: '#discografia', label: 'Discografía' },
      ]} />

      <section className={styles.identitySection} id="resumen">
        <div className={`shell ${styles.identityGrid}`}>
          <article>
            <span>Ficha musical</span>
            <dl>
              {march.compositionYear ? <div><dt>Composición</dt><dd>{march.compositionYear}</dd></div> : null}
              {march.musicType ? <div><dt>Formación</dt><dd>{march.musicType}</dd></div> : null}
              {march.premiere ? <div><dt>Estreno</dt><dd>{march.premiere}</dd></div> : null}
              {march.premiereBand ? <div><dt>Estrenada por</dt><dd>{march.premiereBand.href ? <Link href={march.premiereBand.href}>{march.premiereBand.name}</Link> : march.premiereBand.name}</dd></div> : null}
            </dl>
          </article>
          <article>
            <span>Autoría</span>
            {march.authors.length ? (
              <ul>{march.authors.map((author) => <li key={`${author.id}-${author.role}`}><small>{AUTHOR_LABELS[author.role] || 'Autoría'}</small><strong>{author.href ? <Link href={author.href}>{author.name}</Link> : author.name}</strong></li>)}</ul>
            ) : <p>Autoría todavía no documentada.</p>}
          </article>
          <article>
            <span>Dedicatoria</span>
            {march.dedications.length ? (
              <ul>{march.dedications.map((dedication, index) => <li key={`${dedication.id}-${index}`}><small>{dedication.date || 'Dedicada a'}</small><strong>{dedication.href ? <Link href={dedication.href}>{dedication.name}</Link> : dedication.name}</strong>{dedication.text && dedication.text !== dedication.name ? <p>{dedication.text}</p> : null}</li>)}</ul>
            ) : <p>Sin dedicatoria documentada en las fuentes publicadas.</p>}
          </article>
        </div>
      </section>

      <RelationalThread
        currentLabel="Marcha"
        currentName={march.name}
        currentMeta={[march.compositionYear, march.musicType].filter(Boolean).join(' · ')}
        items={marchThreadItems}
        priorityProfile="marcha"
        eyebrow="Descubre el hilo"
        title="Conexiones de esta Marcha"
        description="Continúa por su compositor, dedicatorias, bandas, crucetas y presencia discográfica. Cada vínculo parte de datos ya documentados en Hilo Cofrade."
      />

      {march.listenings.length ? (
        <section className={styles.listenSection} id="escuchar">
          <div className="shell">
            <header className={styles.sectionHeading}><span>Archivo sonoro</span><h2>Escuchar la marcha</h2><p>Grabaciones y pistas enlazadas con esta obra.</p></header>
            <div className={styles.listenGrid}>
              {march.listenings.map((listening) => (
                <a className={styles.listenCard} href={listening.url} target="_blank" rel="noopener noreferrer" key={listening.url} data-hilo-event="march_listen_click" data-hilo-provider={listening.provider.toLowerCase()}>
                  <span aria-hidden="true">▶</span>
                  <div><small>{listening.provider}{listening.year ? ` · ${listening.year}` : ''}</small><strong>{listening.title}</strong>{listening.band?.name ? <p>{listening.band.name}</p> : null}</div>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {march.repertoireHistory.length ? (
        <section className={styles.historySection} id="crucetas">
          <div className="shell">
            <header className={styles.sectionHeading}><span>Marcha → procesión → banda</span><h2>Interpretada en</h2><p>Presencia documentada en las crucetas musicales publicadas.</p></header>
            <div className={styles.historyList}>
              {march.repertoireHistory.map((item) => (
                <article key={item.id}>
                  <div className={styles.historyDate}><strong>{item.year}</strong><span>{dateLabel(item.date)}</span></div>
                  <div className={styles.historyCopy}>
                    <h3><Link href={item.repertoireHref}>{item.outingTitle} <span aria-hidden="true">→</span></Link></h3>
                    <p>{item.brotherhood?.href ? <Link href={item.brotherhood.href}>{item.brotherhood.name}</Link> : item.brotherhood?.name}</p>
                    <small>
                      {item.band?.href ? <Link href={item.band.href}>{item.band.name}</Link> : item.band?.name}
                      {item.step?.name ? <> · {item.step.href ? <Link href={item.step.href}>{item.step.name}</Link> : item.step.name}</> : null}
                    </small>
                  </div>
                  <strong className={styles.playCount}>{countLabel(item.count)}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {march.discographyHistory.length ? (
        <section className={styles.discographySection} id="discografia">
          <div className="shell">
            <header className={styles.sectionHeading}><span>Marcha → disco → banda</span><h2>En la discografía</h2><p>Trabajos publicados donde esta obra figura como pista documentada.</p></header>
            <div className={styles.discographyList}>
              {march.discographyHistory.map((item) => (
                <article key={item.id}>
                  <div className={styles.discographyYear}><strong>{item.year || '—'}</strong><span>Edición</span></div>
                  <div>
                    <h3>{item.bandDiscographyHref ? <Link href={item.bandDiscographyHref}>{item.title} <span aria-hidden="true">→</span></Link> : item.title}</h3>
                    {item.band?.name ? <p>{item.band.href ? <Link href={item.band.href}>{item.band.name}</Link> : item.band.name}</p> : null}
                  </div>
                  {item.spotifyUrl ? <a className={styles.spotifyLink} href={item.spotifyUrl} target="_blank" rel="noopener noreferrer">Spotify ↗</a> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
