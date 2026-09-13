import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import { getPublicMarchBySlug } from '@/lib/supabase/public-marches'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import styles from './marcha.module.css'

export const dynamic = 'force-dynamic'

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

export async function generateMetadata({ params }) {
  const { slug } = await params
  const march = await getPublicMarchBySlug(slug)
  if (!march) return { title: 'Marcha no encontrada', robots: { index: false, follow: false } }

  const composers = march.authors.filter((author) => author.role === 'composer').map((author) => author.name).join(', ')
  const description = [composers ? `Obra de ${composers}.` : '', march.documentedPerformances ? `${countLabel(march.documentedPerformances)} documentadas en crucetas musicales.` : '', march.listenings.length ? 'Grabaciones disponibles.' : ''].filter(Boolean).join(' ')

  return {
    title: `${march.name} · Marcha procesional`,
    description,
    alternates: { canonical: march.href },
    openGraph: { title: pageTitle(march.name), description, url: march.href },
  }
}

export default async function MarchDetailPage({ params }) {
  const { slug } = await params
  const march = await getPublicMarchBySlug(slug)
  if (!march) notFound()

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Crucetas musicales', path: '/crucetas-musicales' },
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
            <Link href="/">Inicio</Link><span>/</span><Link href="/crucetas-musicales">Crucetas musicales</Link><span>/</span><strong>Marcha</strong>
          </nav>
          <div className={styles.heroBody}>
            <span>{march.workType}</span>
            <h1>{march.name}</h1>
            {march.summary ? <p>{march.summary}</p> : null}
          </div>
          <div className={styles.metrics}>
            <div><strong>{march.documentedPerformances}</strong><span>interpretaciones documentadas</span></div>
            <div><strong>{march.repertoireHistory.length}</strong><span>procesiones relacionadas</span></div>
            <div><strong>{march.listenings.length}</strong><span>escuchas disponibles</span></div>
          </div>
        </div>
      </header>

      <section className={styles.identitySection}>
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
              <ul>{march.authors.map((author) => <li key={`${author.id}-${author.role}`}><small>{AUTHOR_LABELS[author.role] || 'Autoría'}</small><strong>{author.name}</strong></li>)}</ul>
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

      {march.listenings.length ? (
        <section className={styles.listenSection}>
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
        <section className={styles.historySection}>
          <div className="shell">
            <header className={styles.sectionHeading}><span>Marcha → procesión → banda</span><h2>Interpretada en</h2><p>Presencia documentada en las crucetas musicales publicadas.</p></header>
            <div className={styles.historyList}>
              {march.repertoireHistory.map((item) => (
                <article key={item.id}>
                  <div className={styles.historyDate}><strong>{item.year}</strong><span>{dateLabel(item.date)}</span></div>
                  <div className={styles.historyCopy}>
                    <h3><Link href={item.repertoireHref}>{item.outingTitle} <span aria-hidden="true">→</span></Link></h3>
                    <p>{item.brotherhood?.href ? <Link href={item.brotherhood.href}>{item.brotherhood.name}</Link> : item.brotherhood?.name}</p>
                    <small>{item.band?.href ? <Link href={item.band.href}>{item.band.name}</Link> : item.band?.name}</small>
                  </div>
                  <strong className={styles.playCount}>{countLabel(item.count)}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
