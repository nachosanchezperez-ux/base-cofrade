import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

const title = 'Hermandades de Semana Santa'
const description = 'Hermandades de Semana Santa de Sevilla capital y provincia organizadas por localidad y jornada de salida.'
const path = '/hermandades/semana-santa'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function SemanaSantaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="semana-santa" />
}
