import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import { councilSummary } from '@/lib/via-crucis-consejo'
import ViaCrucisExplorer from './ViaCrucisExplorer'
import styles from './via-crucis.module.css'

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
    </section>
  )
}
