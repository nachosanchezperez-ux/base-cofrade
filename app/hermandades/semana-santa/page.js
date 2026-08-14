import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hermandades de Semana Santa',
  description: 'Hermandades de Semana Santa de Sevilla capital y provincia organizadas por localidad y jornada de salida.',
}

export default async function SemanaSantaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="semana-santa" />
}
