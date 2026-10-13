import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { councilSummary } from '@/lib/via-crucis-consejo'
import ViaCrucisExplorer from './ViaCrucisExplorer'
import SourcesBlock from '@/components/SourcesBlock'
import { SOURCE_HISTORY, SOURCE_CENSUS, SOURCE_2013, SOURCE_2027 } from '@/lib/via-crucis-consejo'
import styles from './via-crucis.module.css'

const viaCrucisSources = [
  { id: 'consejo-via-crucis-historico', nombre: 'Consejo de Hermandades de Sevilla · Imágenes que han presidido el Vía Crucis (1976–2026)', url: SOURCE_HISTORY },
  { id: 'consejo-hermandades-penitencia', nombre: 'Consejo de Hermandades de Sevilla · Nómina de hermandades de penitencia', url: SOURCE_CENSUS },
  { id: 'consejo-via-crucis-2013', nombre: 'Consejo de Hermandades de Sevilla · Vía Crucis extraordinario del Año de la Fe (2013)', url: SOURCE_2013 },
  { id: 'consejo-designacion-2027', nombre: 'Consejo de Hermandades de Sevilla · Designación del Cristo de la Exaltación para 2027', url: SOURCE_2027 },
]

const title = 'Vía Crucis del Consejo de Sevilla: histórico y estadísticas'
const description = 'Los Vía Crucis del Consejo de Hermandades de Sevilla desde 1976: imágenes protagonistas, estadísticas por jornada e iconografía y hermandades que aún no lo han presidido.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/via-crucis-sevilla' },
  ...socialMetadata({ title, description, path: '/via-crucis-sevilla' }),
}

export default function ViaCrucisSevillaPage() {
  return (
    <section className={styles.page}>
      <div className="shell">
        <JsonLd data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Vía Crucis del Consejo', path: '/via-crucis-sevilla' },
        ])} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: absoluteUrl('/via-crucis-sevilla'),
          inLanguage: 'es',
          mainEntity: { '@type': 'ItemList', numberOfItems: councilSummary.editions },
        }} />
        <SiteBreadcrumb
          items={[{ label: 'Inicio', href: '/' }, { label: 'Vía Crucis del Consejo' }]}
          showAccent={false}
        />
        <ViaCrucisExplorer />
      </div>
      <SourcesBlock sources={viaCrucisSources} />
    </section>
  )
}
