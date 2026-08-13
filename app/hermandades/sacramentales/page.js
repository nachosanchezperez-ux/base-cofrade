import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhoods'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hermandades Sacramentales',
  description: 'Hermandades Sacramentales de Sevilla capital y provincia organizadas por localidad.',
}

export default async function SacramentalesDirectoryPage() {
  const hermandades = await getHermandadesDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="sacramentales" />
}
