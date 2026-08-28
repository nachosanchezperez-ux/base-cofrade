import LegalDocumentPage from '@/components/legal/LegalDocumentPage'
import { socialMetadata } from '@/lib/seo'

const title = 'Cookies y almacenamiento local'
const description = 'Tecnologías de almacenamiento y servicios externos utilizados por Hilo Cofrade.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/cookies' }),
}

export default function StoragePolicyPage() {
  return <LegalDocumentPage documentKey="storage_policy" eyebrow="Transparencia técnica" intro={description} />
}
