import LegalDocumentPage from '@/components/legal/LegalDocumentPage'
import { socialMetadata } from '@/lib/seo'

const title = 'Política de privacidad'
const description = 'Información sobre el tratamiento de datos personales y los derechos de las personas usuarias.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/privacidad' }),
}

export default function PrivacyPage() {
  return <LegalDocumentPage documentKey="privacy_policy" eyebrow="Privacidad" intro={description} />
}
