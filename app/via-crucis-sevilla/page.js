import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import SourcesBlock from '@/components/SourcesBlock'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import {
  SOURCE_HISTORY, SOURCE_CENSUS, SOURCE_2013, SOURCE_2027,
  councilSummary, councilViaCrucisEditions, councilDayStats,
  councilIconographyStats,
  councilExtraordinary2013, councilNextEdition,
} from '@/lib/via-crucis-consejo'
import ViaCrucisExplorer from './ViaCrucisExplorer'
import styles from './via-crucis.module.css'

const PATH = '/via-crucis-sevilla'
const title = 'Vía Crucis del Consejo de Sevilla'
const description = 'Consulta el histórico del Vía Crucis del Consejo de Sevilla (1976–2026): imágenes protagonistas, estadísticas por jornadas y hermandades pendientes.'

const viaCrucisSources = [
  { id: 'consejo-via-crucis-historico', nombre: 'Consejo de Hermandades de Sevilla · Imágenes que han presidido el Vía Crucis (1976–2026)', url: SOURCE_HISTORY },
  { id: 'consejo-hermandades-penitencia', nombre: 'Consejo de Hermandades de Sevilla · Nómina de hermandades de penitencia', url: SOURCE_CENSUS },
  { id: 'consejo-via-crucis-2013', nombre: 'Consejo de Hermandades de Sevilla · Vía Crucis extraordinario del Año de la Fe (2013)', url: SOURCE_2013 },
  { id: 'consejo-designacion-2027', nombre: 'Consejo de Hermandades de Sevilla · Designación del Cristo de la Exaltación para 2027', url: SOURCE_2027 },
]

// A permanently rendered historical index keeps the year-by-year archive
// discoverable even though the interactive "Archivo por años" tab is secondary.
const chronologicalEditions = [...councilViaCrucisEditions].sort((a, b) => b.year - a.year)

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: PATH }),
}

export default function ViaCrucisSevillaPage() {
  const mostFrequentDay = councilDayStats[0]
  const mostFrequentIconography = councilIconographyStats[0]

  const archiveJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(PATH)}#collection`,
    name: title,
    description,
    url: absoluteUrl(PATH),
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: chronologicalEditions.length,
      itemListElement: chronologicalEditions.map((edition, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${edition.year}: ${edition.imageName} · ${edition.brotherhood.name}`,
        url: absoluteUrl(edition.brotherhood.href),
      })),
    },
  }

  return (
    <section className={styles.page}>
      <div className="shell">
        <JsonLd data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Vía Crucis del Consejo', path: PATH },
        ])} />
        <JsonLd data={archiveJsonLd} />
        <SiteBreadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Vía Crucis del Consejo' }]}
          className={styles.breadcrumbSpacing}
          showAccent={false}
        />
        <ViaCrucisExplorer />

        <section className={styles.archiveIndex} aria-labelledby="via-crucis-archivo-historico">
          <div className={styles.archiveIndexIntro}>
            <div>
              <span className={styles.eyebrow}>Consulta histórica</span>
              <h2 id="via-crucis-archivo-historico">Todos los Vía Crucis del Consejo de Sevilla</h2>
            </div>
            <p>Un archivo de las imágenes titulares y hermandades que han presidido este acto cuaresmal desde 1976, con sus jornadas de la Semana Santa y la evolución de las iconografías.</p>
          </div>
          <div className={styles.archiveIndexFacts}>
            <p>Entre 1976 y 2026 se documentan <strong>{councilSummary.editions} ediciones ordinarias</strong> y <strong>{councilSummary.representedBrotherhoods} hermandades distintas</strong>. La jornada con más designaciones es <strong>{mostFrequentDay.day}</strong>, con {mostFrequentDay.count}, y predominan las imágenes de <strong>{mostFrequentIconography.label.toLowerCase()}</strong>, presentes en {mostFrequentIconography.count} ediciones.</p>
            <p>El <strong>Vía Crucis extraordinario de {councilExtraordinary2013.year}</strong> se documenta por separado, ya que las imágenes previstas no procesionaron por la lluvia. La edición de 2021 figura en el histórico sin traslado procesional. La siguiente designación es la del <strong>{councilNextEdition.imageName}</strong>, de <Link href={councilNextEdition.brotherhood.href}>{councilNextEdition.brotherhood.name}</Link>, para 2027.</p>
          </div>
          <details className={styles.archiveIndexDetails}>
            <summary>
              <span>Consultar las {councilSummary.editions} ediciones ordinarias, año a año</span>
              <small>1976–2026</small>
            </summary>
            <ol className={styles.archiveIndexList}>
              {chronologicalEditions.map((edition) => (
                <li key={edition.year}>
                  <span className={styles.archiveIndexYear}>{edition.year}</span>
                  <div>
                    <Link href={edition.brotherhood.href}>{edition.imageName}</Link>
                    <small>{edition.brotherhood.name} · {edition.brotherhood.day}</small>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        </section>
      </div>
      <SourcesBlock sources={viaCrucisSources} />
    </section>
  )
}
