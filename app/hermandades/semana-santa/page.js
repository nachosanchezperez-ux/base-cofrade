import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

const title = 'Hermandades de Semana Santa'
const description = 'Hermandades de Semana Santa de Sevilla capital y provincia organizadas por localidad y jornada de salida.'
const path = '/hermandades/semana-santa'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function SemanaSantaDirectoryPage() {
  const hermandades = await getIndexableBrotherhoodDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="semana-santa" />
}
