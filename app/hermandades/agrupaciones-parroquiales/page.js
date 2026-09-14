import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

const title = 'Agrupaciones Parroquiales de Sevilla'
const description = 'Agrupaciones Parroquiales de Sevilla capital y provincia organizadas por localidad.'
const path = '/hermandades/agrupaciones-parroquiales'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function ParishGroupingsDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="agrupaciones-parroquiales" />
}
