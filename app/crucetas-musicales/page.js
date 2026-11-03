import Link from 'next/link'
import { connection } from 'next/server'
import { contributionReadiness } from '@/lib/contributions/security'
import JsonLd from '@/components/JsonLd'
import { getMusicalRepertoires } from '@/lib/supabase/public-directory-cache'
import { absoluteUrl, breadcrumbJsonLd, pageTitle } from '@/lib/seo'
import styles from './crucetas.module.css'
import CrucetasDirectory from './CrucetasDirectory'
import RepertoireInsights from './RepertoireInsights'
import { newMarchesOfYear, topMarches } from '@/lib/musical-repertoires/insights'

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
  const latestYear = Math.max(0, ...repertoires.map((item) => Number(item.year) || 0)) || null
  const seasonRepertoires = latestYear ? repertoires.filter((item) => Number(item.year) === latestYear) : repertoires
  const mostPlayed = topMarches(seasonRepertoires, { limit: 5 })
  const newMarches = latestYear ? newMarchesOfYear(repertoires, latestYear) : []
  const directoryItems = repertoires.map((item) => ({
    id: item.id,
    href: item.href,
    year: item.year,
    displayTitle: item.displayTitle,
    identityName: item.identityName,
    date: item.date,
    outingType: item.outing.type,
    marchTitles: item.marchTitles,
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

      <RepertoireInsights
        year={latestYear}
        totalRepertoires={seasonRepertoires.length}
        mostPlayed={mostPlayed}
        newMarches={newMarches}
      />

      <section className={styles.directoryList}>
        <div className="shell">
          {repertoires.length ? <CrucetasDirectory repertoires={directoryItems} /> : (
            <p className={styles.empty}>Las primeras crucetas documentadas se publicarán próximamente.</p>
          )}
          {contributionReadiness().enabled ? (
            <p className={styles.contributeLine}>¿Tienes el repertorio de otra salida? <Link href="/colabora/cruceta">Envía la cruceta</Link></p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
