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

const title = 'Hermandades Sacramentales'
const description = 'Hermandades Sacramentales de Sevilla capital y provincia organizadas por localidad.'
const path = '/hermandades/sacramentales'

export async function generateMetadata() {
  const items = (await getHermandadesDirectory()).filter((item) => hasDirectoryType(item, 'sacramentales'))
  return {
    title,
    description,
    robots: directoryRobots(items),
    ...socialMetadata({ title, description, path }),
  }
}

export default async function SacramentalesDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  const items = hermandades.filter((item) => hasDirectoryType(item, 'sacramentales'))
  return <>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Hermandades', path: '/hermandades' },
      { name: 'Sacramentales', path },
    ])} />
    <JsonLd data={collectionPageJsonLd({
      path,
      name: title,
      description,
      items: items.map((item) => ({ name: item.nombrePopular, path: `/hermandades/${item.slug}` })),
    })} />
    <HermandadesCategoryDirectory hermandades={hermandades} typeKey="sacramentales" />
  </>
}
