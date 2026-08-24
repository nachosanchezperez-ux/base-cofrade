import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

const title = 'Hermandades de Gloria'
const description = 'Hermandades de Gloria de Sevilla capital y provincia organizadas por localidad y mes principal.'
const path = '/hermandades/gloria'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function GloriaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="gloria" />
}
