import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import styles from './crucetas.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Crucetas musicales y repertorios procesionales',
  description: 'Repertorios interpretados por las bandas en procesiones y salidas, vinculados con cada Hermandad, paso y edición.',
  alternates: { canonical: '/crucetas-musicales' },
  openGraph: {
    title: pageTitle('Crucetas musicales y repertorios procesionales'),
    description: 'Consulta las marchas interpretadas por las bandas en cada procesión documentada.',
    url: '/crucetas-musicales',
  },
}

export default async function MusicalRepertoiresDirectoryPage() {
  const repertoires = await getMusicalRepertoires()

  return (
    <div className={styles.directory}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Crucetas musicales', path: '/crucetas-musicales' },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Crucetas musicales',
        url: absoluteUrl('/crucetas-musicales'),
      }} />

      <header className={styles.directoryHero}>
        <div className="shell">
          <span>Archivo sonoro procesional</span>
          <h1>Crucetas musicales</h1>
          <p>Los repertorios que las bandas confirman después de cada procesión, relacionados con la Hermandad, el paso y la edición concreta.</p>
        </div>
      </header>

      <section className={styles.directoryList}>
        <div className="shell">
          <div className={styles.directoryHeading}>
            <span>Repertorios documentados</span>
            <strong>{repertoires.length}</strong>
          </div>
          {repertoires.length ? (
            <div className={styles.directoryGrid}>
              {repertoires.map((item) => (
                <article
                  className={styles.directoryCard}
                  key={item.id}
                  style={{ '--repertoire-primary': item.colors.primary, '--repertoire-accent': item.colors.accent }}
                >
                  <div className={styles.directoryYear}>{item.year}</div>
                  <span>Repertorio interpretado</span>
                  <h2>{item.outing.title}</h2>
                  <p>{item.brotherhood.name}</p>
                  <dl>
                    <div><dt>Obras</dt><dd>{item.worksCount}</dd></div>
                    <div><dt>Interpretaciones</dt><dd>{item.performancesCount}</dd></div>
                  </dl>
                  <small>{item.band.name}</small>
                  <Link href={item.href}>Abrir cruceta <b aria-hidden="true">→</b></Link>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Las primeras crucetas documentadas se publicarán próximamente.</p>
          )}
        </div>
      </section>
    </div>
  )
}
