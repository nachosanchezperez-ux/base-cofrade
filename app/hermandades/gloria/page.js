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

const title = 'Hermandades de Gloria'
const description = 'Hermandades de Gloria de Sevilla capital y provincia organizadas por localidad y mes principal.'
const path = '/hermandades/gloria'

export async function generateMetadata() {
  const items = (await getHermandadesDirectory()).filter((item) => hasDirectoryType(item, 'gloria'))
  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function GloriaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => hasDirectoryType(item, 'gloria'))
  return <>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Hermandades', path: '/hermandades' },
      { name: 'Glorias', path },
    ])} />
    <JsonLd data={collectionPageJsonLd({
      path,
      name: title,
      description,
      items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
    })} />
    <HermandadesCategoryDirectory hermandades={hermandades} typeKey="gloria" />
  </>
}
