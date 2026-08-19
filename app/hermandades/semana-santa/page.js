import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import JsonLd from '@/components/JsonLd'
import { hasDirectoryType } from '@/lib/brotherhood-directory'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  directoryRobots,
  socialMetadata,
} from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const revalidate = 3600

const title = 'Hermandades de Semana Santa'
const description = 'Hermandades de Semana Santa de Sevilla capital y provincia organizadas por localidad y jornada de salida.'
const path = '/hermandades/semana-santa'

export async function generateMetadata() {
  const items = (await getHermandadesDirectory()).filter((item) => hasDirectoryType(item, 'semana-santa'))
  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function SemanaSantaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => hasDirectoryType(item, 'semana-santa'))
  return <>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Hermandades', path: '/hermandades' },
      { name: 'Semana Santa', path },
    ])} />
    <JsonLd data={collectionPageJsonLd({
      path,
      name: title,
      description,
      items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
    })} />
    <HermandadesCategoryDirectory hermandades={hermandades} typeKey="semana-santa" />
  </>
}
