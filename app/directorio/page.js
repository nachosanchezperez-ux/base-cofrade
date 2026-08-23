import EntityDirectoryExplorer from '@/components/EntityDirectoryExplorer'
import JsonLd from '@/components/JsonLd'
import { getPublicEntityDirectory } from '@/lib/supabase/public-entity-directory'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Directorio cofrade de Sevilla y provincia'
const description = 'Busca y explora hermandades, imágenes, pasos y bandas documentadas en Hilo Cofrade, con navegación por ubicación, calendario y estilo.'

export const metadata = {
  title,
  description,
  ...socialMetadata({
    title: 'Directorio',
    description,
    path: '/directorio',
  }),
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveOption(values, requested) {
  if (!requested) return 'todos'
  return values.find((value) => slugify(value) === slugify(requested)) || 'todos'
}

export default async function DirectorioPage({ searchParams }) {
  const [items, params] = await Promise.all([
    getPublicEntityDirectory(),
    searchParams,
  ])

  const requestedKind = String(params?.tipo || 'all')
  const kind = ['all', 'brotherhood', 'image', 'step', 'band'].includes(requestedKind)
    ? requestedKind
    : 'all'
  const scopedItems = kind === 'all' ? items : items.filter((item) => item.kind === kind)
  const municipalities = [...new Set(scopedItems.map((item) => item.municipality).filter(Boolean))]
  const subtypeValues = [...new Set(scopedItems.flatMap((item) => item.subtypeValues || []).filter(Boolean))]
  const holyWeekDays = [...new Set(scopedItems.map((item) => item.holyWeekDay).filter(Boolean))]
  const gloryMonths = [...new Set(scopedItems.map((item) => item.gloryMonth).filter(Boolean))]

  const initialState = {
    query: String(params?.q || ''),
    kind,
    territory: ['todos', 'sevilla-capital', 'provincia'].includes(String(params?.territorio || ''))
      ? String(params.territorio)
      : 'todos',
    municipality: resolveOption(municipalities, params?.localidad),
    subtype: kind === 'all' ? 'todos' : resolveOption(subtypeValues, params?.subtipo),
    holyWeekDay: kind === 'all' ? 'todos' : resolveOption(holyWeekDays, params?.dia),
    gloryMonth: kind === 'all' ? 'todos' : resolveOption(gloryMonths, params?.mes),
    limit: String(params?.limite || ''),
  }

  const counts = items.reduce((result, item) => {
    result[item.kind] = (result[item.kind] || 0) + 1
    return result
  }, {})

  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl('/directorio')}#collection`,
    url: absoluteUrl('/directorio'),
    name: 'Directorio de Hilo Cofrade',
    description,
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
    },
    hasPart: [
      { '@type': 'CollectionPage', name: `Hermandades (${counts.brotherhood || 0})`, url: absoluteUrl('/hermandades') },
      { '@type': 'CollectionPage', name: `Imágenes (${counts.image || 0})`, url: absoluteUrl('/imagenes') },
      { '@type': 'CollectionPage', name: `Pasos (${counts.step || 0})`, url: absoluteUrl('/pasos') },
      { '@type': 'CollectionPage', name: `Bandas (${counts.band || 0})`, url: absoluteUrl('/bandas') },
    ],
  }

  return (
    <section className="section page-top">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Directorio', path: '/directorio' },
      ])} />
      <JsonLd data={directoryJsonLd} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia cofrade</span>
        <h1 className="page-title">Directorio</h1>
        <p className="page-lead">
          Busca y explora Hilo Cofrade por entidad, ubicación, calendario procesional y estilo musical.
        </p>
        <EntityDirectoryExplorer items={items} initialState={initialState} />
      </div>
    </section>
  )
}
