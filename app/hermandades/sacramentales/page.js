import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

const title = 'Hermandades Sacramentales'
const description = 'Hermandades Sacramentales de Sevilla capital y provincia organizadas por localidad.'
const path = '/hermandades/sacramentales'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function SacramentalesDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="sacramentales" />
}
