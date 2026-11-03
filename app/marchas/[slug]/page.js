import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import EntityLastUpdated from '@/components/EntityLastUpdated'
import EntitySectionNav from '@/components/EntitySectionNav'
import { getPublicMarchBySlug } from '@/lib/supabase/public-marches'
import { groupReleasesForDisplay } from '@/lib/bands/discography'
import { absoluteUrl, breadcrumbJsonLd, marchHeadingByline, marchSeoTitle, socialMetadata } from '@/lib/seo'
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

// Crucetas: con más de 6, las 5 más recientes a la vista y el resto plegado.
const CRUCETAS_FOLD_THRESHOLD = 6
const CRUCETAS_VISIBLE = 5

function CrucetaRow({ item }) {
  return (
    <article>
      <div className={styles.historyDate}><strong>{item.year}</strong><span>{dateLabel(item.date)}</span></div>
      <div className={styles.historyCopy}>
        <h3><Link href={item.repertoireHref}>{item.outingTitle} <span aria-hidden="true">→</span></Link></h3>
        {item.brotherhood?.name ? <p>{item.brotherhood.href ? <Link href={item.brotherhood.href}>{item.brotherhood.name}</Link> : item.brotherhood.name}</p> : null}
        <small>
          {item.band?.href ? <Link href={item.band.href}>{item.band.name}</Link> : item.band?.name}
          {item.step?.name ? <> · {item.step.href ? <Link href={item.step.href}>{item.step.name}</Link> : item.step.name}</> : null}
        </small>
      </div>
      {item.count > 1 ? <strong className={styles.playCount}>{countLabel(item.count)}</strong> : null}
    </article>
  )
}

function DiscographyRow({ item }) {
  return (
    <article>
      <div className={styles.discographyYear}><strong>{item.year || '—'}</strong></div>
      <div>
        <h3>{item.bandDiscographyHref ? <Link href={item.bandDiscographyHref}>{item.title} <span aria-hidden="true">→</span></Link> : item.title}</h3>
        {item.band?.name ? <p>{item.band.href ? <Link href={item.band.href}>{item.band.name}</Link> : item.band.name}</p> : null}
      </div>
    </article>
  )
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const march = await getPublicMarchBySlug(slug)
  if (!march) return { title: 'Marcha no encontrada', robots: { index: false, follow: false } }

  const composers = march.authors.filter((author) => author.role === 'composer').map((author) => author.name).join(', ')
  const description = [composers ? `Obra de ${composers}.` : '', march.documentedPerformances ? `${countLabel(march.documentedPerformances)} ${metricLabel(march.documentedPerformances, 'documentada', 'documentadas')} en crucetas musicales.` : '', march.listenings.length ? 'Grabaciones disponibles.' : ''].filter(Boolean).join(' ')

  const title = marchSeoTitle(
    march.name,
    march.authors.filter((author) => author.role === 'composer').map((author) => author.name)
  )
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
  const headingByline = marchHeadingByline(march.authors.filter((author) => author.role === 'composer').map((author) => author.name))

  const palette = march.palette || {}
  const hasFicha = Boolean(march.compositionYear || march.musicType || march.premiere || march.premiereBand)
  const identityBlocks = [hasFicha, march.authors.length > 0, march.dedications.length > 0].filter(Boolean).length
  const crucetasVisible = march.repertoireHistory.length > CRUCETAS_FOLD_THRESHOLD
    ? march.repertoireHistory.slice(0, CRUCETAS_VISIBLE)
    : march.repertoireHistory
  const crucetasFolded = march.repertoireHistory.slice(crucetasVisible.length)
  const discography = groupReleasesForDisplay(march.discographyHistory)
  // Cifras como accesos a su sección; ninguna a 0 (decisión 19/10/2026).
  const metrics = [
    { href: '#crucetas', count: march.documentedPerformances, label: metricLabel(march.documentedPerformances, 'interpretación documentada', 'interpretaciones documentadas') },
    { href: '#escuchar', count: march.listenings.length, label: metricLabel(march.listenings.length, 'escucha disponible', 'escuchas disponibles') },
    { href: '#discografia', count: march.discographyHistory.length, label: metricLabel(march.discographyHistory.length, 'aparición discográfica', 'apariciones discográficas') },
  ].filter((metric) => metric.count > 0)

  return (
    <div
      className={styles.page}
      style={{
        '--march-primary': palette.primario || '#102943',
        '--march-secondary': palette.secundario || '#C99F49',
        '--march-dark': palette.oscuro || '#08131F',
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
        '@id': `${absoluteUrl(march.href)}#composition`,
        name: march.name,
        url: absoluteUrl(march.href),
        mainEntityOfPage: absoluteUrl(march.href),
        dateCreated: march.compositionYear || undefined,
        composer: march.authors
          .filter((author) => author.role === 'composer')
          .map((author) => {
            const organizationAuthor = ['workshop', 'company', 'institution'].includes(author.kind)
            return {
              '@type': organizationAuthor ? 'Organization' : 'Person',
              ...(author.href ? {
                '@id': `${absoluteUrl(author.href)}#${organizationAuthor ? 'organization' : 'person'}`,
                url: absoluteUrl(author.href),
              } : {}),
              name: author.name,
            }
          }),
      }} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroShell}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Marchas', href: '/marchas' },
              { label: march.name },
            ]}
            tone="dark"
            showAccent={false}
          />
          <div className={styles.heroBody}>
            <span>{march.workType}</span>
            {/* Hay varias «Esperanza» o «Macarena»: el compositor forma parte del H1. */}
            <h1>
              {march.name}
              {headingByline ? <span className={styles.titleQualifier}><span className="sr-only">, </span>{headingByline}</span> : null}
            </h1>
            {march.summary ? <p>{march.summary}</p> : null}
          </div>
          {metrics.length ? (
            <nav className={styles.metrics} aria-label="Contenido de la ficha">
              {metrics.map((metric) => (
                <a href={metric.href} key={metric.href}><strong>{metric.count}</strong><span>{metric.label}</span></a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <EntityLastUpdated value={march.updatedAt} variant="bar" />

      <EntitySectionNav items={[
        identityBlocks > 0 && { href: '#resumen', label: 'Ficha musical' },
        march.listenings.length > 0 && { href: '#escuchar', label: 'Escuchar' },
        march.repertoireHistory.length > 0 && { href: '#crucetas', label: 'Crucetas' },
        march.discographyHistory.length > 0 && { href: '#discografia', label: 'Discografía' },
      ]} />

      {identityBlocks ? (
        <section className={styles.identitySection} id="resumen">
          <div className={`shell ${styles.identityGrid}`} data-blocks={identityBlocks}>
            {hasFicha ? (
              <article>
                <span>Ficha musical</span>
                <dl>
                  {march.compositionYear ? <div><dt>Composición</dt><dd>{march.compositionYear}</dd></div> : null}
                  {march.musicType ? <div><dt>Formación</dt><dd>{march.musicType}</dd></div> : null}
                  {march.premiere ? <div><dt>Estreno</dt><dd>{march.premiere}</dd></div> : null}
                  {march.premiereBand ? <div><dt>Estrenada por</dt><dd>{march.premiereBand.href ? <Link href={march.premiereBand.href}>{march.premiereBand.name}</Link> : march.premiereBand.name}</dd></div> : null}
                </dl>
              </article>
            ) : null}
            {march.authors.length ? (
              <article>
                <span>Autoría</span>
                <ul>{march.authors.map((author) => <li key={`${author.id}-${author.role}`}><small>{AUTHOR_LABELS[author.role] || 'Autoría'}</small><strong>{author.href ? <Link href={author.href}>{author.name}</Link> : author.name}</strong></li>)}</ul>
              </article>
            ) : null}
            {march.dedications.length ? (
              <article>
                <span>{march.dedications.length === 1 ? 'Dedicatoria' : 'Dedicatorias'}</span>
                <ul>{march.dedications.map((dedication, index) => <li key={`${dedication.id}-${index}`}><small>{dedication.date || 'Dedicada a'}</small><strong>{dedication.href ? <Link href={dedication.href}>{dedication.name}</Link> : dedication.name}</strong>{dedication.text && dedication.text !== dedication.name ? <p>{dedication.text}</p> : null}</li>)}</ul>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {march.listenings.length ? (
        <section className={styles.listenSection} id="escuchar">
          <div className="shell">
            <header className={styles.sectionHeading}><h2>Escuchar la marcha</h2></header>
            <div className={styles.listenGrid}>
              {march.listenings.map((listening) => (
                <article className={styles.listenCard} key={listening.url}>
                  <a
                    className={styles.listenPlay}
                    href={listening.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Escuchar ${listening.title} en ${listening.provider}`}
                    data-hilo-event="march_listen_click"
                    data-hilo-provider={listening.provider.toLowerCase()}
                  ><span aria-hidden="true">▶</span></a>
                  <div>
                    <small>{listening.provider}{listening.year ? ` · ${listening.year}` : ''}</small>
                    <strong>{listening.title}</strong>
                    {listening.band?.name ? <p>{listening.band.href ? <Link href={listening.band.href}>{listening.band.name}</Link> : listening.band.name}</p> : null}
                  </div>
                  <a className={styles.listenExternal} href={listening.url} target="_blank" rel="noopener noreferrer" aria-label="Abrir grabación"><span aria-hidden="true">↗</span></a>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {march.repertoireHistory.length ? (
        <section className={styles.historySection} id="crucetas">
          <div className="shell">
            <header className={styles.sectionHeading}><h2>Interpretada en</h2></header>
            <div className={styles.historyList}>
              {crucetasVisible.map((item) => <CrucetaRow item={item} key={item.id} />)}
            </div>
            {crucetasFolded.length ? (
              <details className={styles.fold}>
                <summary>{crucetasFolded.length === 1 ? 'Otra cruceta' : `Otras ${crucetasFolded.length} crucetas`}<b aria-hidden="true">+</b></summary>
                <div className={styles.historyList}>
                  {crucetasFolded.map((item) => <CrucetaRow item={item} key={item.id} />)}
                </div>
              </details>
            ) : null}
          </div>
        </section>
      ) : null}

      {march.discographyHistory.length ? (
        <section className={styles.discographySection} id="discografia">
          <div className="shell">
            <header className={styles.sectionHeading}><h2>En la discografía</h2></header>
            <div className={styles.discographyList}>
              {discography.recent.map((item) => <DiscographyRow item={item} key={item.id} />)}
            </div>
            {discography.groups.map((group) => (
              <details className={styles.fold} key={group.key}>
                <summary>{group.label}<small>{group.releases.length} {group.releases.length === 1 ? 'trabajo' : 'trabajos'}</small><b aria-hidden="true">+</b></summary>
                <div className={styles.discographyList}>
                  {group.releases.map((item) => <DiscographyRow item={item} key={item.id} />)}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
