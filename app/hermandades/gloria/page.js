import { connection } from 'next/server'
import HermandadesCategoryDirectory from '@/components/HermandadesCategoryDirectory'
import { socialMetadata } from '@/lib/seo'
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory'

export const revalidate = 900

const title = 'Hermandades de Gloria'
const description = 'Hermandades de Gloria de Sevilla capital y provincia organizadas por localidad y mes principal.'
const path = '/hermandades/gloria'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path }),
}

export default async function GloriaDirectoryPage() {
  await connection()
  const hermandades = await getIndexableBrotherhoodDirectory()
  return <HermandadesCategoryDirectory hermandades={hermandades} typeKey="gloria" />
}
