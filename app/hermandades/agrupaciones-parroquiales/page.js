import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

const title = 'Agrupaciones Parroquiales de Sevilla'
const description = 'Agrupaciones Parroquiales de Sevilla capital y provincia organizadas por localidad.'
const path = '/hermandades/agrupaciones-parroquiales'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function ParishGroupingsDirectoryPage() {
  const hermandades = await getIndexableBrotherhoodDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="agrupaciones-parroquiales" />
}
