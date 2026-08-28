import LegalDocumentPage from '@/components/legal/LegalDocumentPage'
import { socialMetadata } from '@/lib/seo'

const title = 'Aviso legal'
const description = 'Identificación, condiciones de uso y responsabilidades de Hilo Cofrade.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/aviso-legal' }),
}

export default function LegalNoticePage() {
  return <LegalDocumentPage documentKey="legal_notice" eyebrow="Información legal" intro={description} />
}
