import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhoods'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hermandades de Gloria',
  description: 'Hermandades de Gloria de Sevilla capital y provincia organizadas por localidad y mes principal.',
}

export default async function GloriaDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="gloria" />
}
