import DirectoryBreadcrumb from '@/components/DirectoryBreadcrumb'
import HeritageDirectoryFacets from '@/components/HeritageDirectoryFacets'
import JsonLd from '@/components/JsonLd'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/seo'

export default function HeritageDirectoryRoutePage({
  allItems,
  items,
  kind,
  section,
  directoryLabel,
  eyebrow,
  title,
  description,
  path,
  contextLabel,
  initialMunicipalitySlug = '',
}) {
  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: directoryLabel, path: `/${section}` },
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
          { label: directoryLabel, href: `/${section}` },
          { label: contextLabel },
        ]} />
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-lead">{description}</p>
        <HeritageDirectoryFacets items={allItems} section={section} title={directoryLabel} />
        <RelationalEntityDirectory
          items={items}
          kind={kind}
          initialMunicipalitySlug={initialMunicipalitySlug}
        />
      </div>
    </section>
  )
}
