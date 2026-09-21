import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

const title = 'Hermandades Sacramentales'
const description = 'Hermandades Sacramentales de Sevilla capital y provincia organizadas por localidad.'
const path = '/hermandades/sacramentales'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function SacramentalesDirectoryPage() {
  const hermandades = await getIndexableBrotherhoodDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="sacramentales" />
}
