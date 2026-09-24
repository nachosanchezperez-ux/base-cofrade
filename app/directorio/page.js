import { connection } from 'next/server'
import { Suspense } from 'react'
import Link from 'next/link'
import EntityDirectoryExplorer from '@/components/EntityDirectoryExplorer'
import EntityDirectoryExplorerFromUrl from '@/components/EntityDirectoryExplorerFromUrl'
import JsonLd from '@/components/JsonLd'
import { getPublicEntityDirectory } from '@/lib/supabase/public-directory-cache'
import { absoluteUrl, breadcrumbJsonLd, socialMetadata } from '@/lib/seo'
import styles from './directorio.module.css'

export const revalidate = 900

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

export default async function DirectorioPage() {
  await connection()
  const items = await getPublicEntityDirectory()

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
      { '@type': 'CollectionPage', name: 'Marchas procesionales', url: absoluteUrl('/marchas') },
    ],
  }

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Directorio', path: '/directorio' },
      ])} />
      <JsonLd data={directoryJsonLd} />
      <div className="shell">
        <span className="eyebrow">Enciclopedia cofrade</span>
        <h1 className="page-title">Directorio</h1>
        <p className="page-lead">
          Hermandades, Imágenes, Pasos y Bandas comparten este buscador relacional. El archivo musical dispone además de un directorio propio para recorrer sus obras, compositores y conexiones procesionales.
        </p>
        <Link className={styles.marchesLink} href="/marchas">
          Explorar el directorio de Marchas <span aria-hidden="true">→</span>
        </Link>
        <Suspense fallback={<EntityDirectoryExplorer items={items} />}>
          <EntityDirectoryExplorerFromUrl items={items} />
        </Suspense>
      </div>
    </section>
  )
}
