import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import { getMusicalRepertoires } from '@/lib/supabase/public-directory-cache'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import styles from './crucetas.module.css'
import CrucetasDirectory from './CrucetasDirectory'

export const revalidate = 900

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
  await connection()
  const repertoires = await getMusicalRepertoires()
  const directoryItems = repertoires.map((item) => ({
    id: item.id,
    href: item.href,
    year: item.year,
    displayTitle: item.displayTitle,
    worksCount: item.worksCount,
    performancesCount: item.performancesCount,
    colors: item.colors,
    municipality: item.municipality ? { name: item.municipality.name } : null,
    brotherhood: { name: item.brotherhood.name },
    band: { name: item.band.name },
  }))

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
          <p>Los repertorios que las bandas confirman después de cada procesión, identificados por Hermandad, jornada o fecha, año y formación musical.</p>
        </div>
      </header>

      <section className={styles.directoryList}>
        <div className="shell">
          <div className={styles.directoryHeading}>
            <span>Repertorios documentados</span>
            <strong>{repertoires.length}</strong>
          </div>
          {repertoires.length ? <CrucetasDirectory repertoires={directoryItems} /> : (
            <p className={styles.empty}>Las primeras crucetas documentadas se publicarán próximamente.</p>
          )}
        </div>
      </section>
    </div>
  )
}
