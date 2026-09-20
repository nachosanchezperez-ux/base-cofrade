import BandDirectoryFacets from '@/components/BandDirectoryFacets'
import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { bandDirectoryItems } from '@/lib/band-directory'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'

export default function BandDirectoryRoutePage({ bands, title, description, path, contextLabel }) {
  const items = bandDirectoryItems(bands)

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Bandas', path: '/bandas' },
        { name: contextLabel, path },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path,
        name: title,
        description,
        items: items.map((item) => ({ name: item.name, path: item.href })),
      })} />
      <div className="shell">
        <DirectoryBreadcrumb items={[
          { label: 'Bandas', href: '/bandas' },
          { label: contextLabel },
        ]} />
        <span className="eyebrow">Enciclopedia musical</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{description}</p>
        <BandDirectoryFacets bands={bands} />
        <RelationalEntityDirectory items={items} kind="band" />
      </div>
    </section>
  )
}
