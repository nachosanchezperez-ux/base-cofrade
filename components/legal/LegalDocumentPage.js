import { notFound } from 'next/navigation'
import { getPublicLegalDocument } from '@/lib/supabase/public-legal'
import LegalMarkdown from './LegalMarkdown'
import styles from './legal-document.module.css'

function formatDate(value) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeZone: 'Europe/Madrid',
  }).format(new Date(value))
}

export default async function LegalDocumentPage({ documentKey, eyebrow, intro }) {
  const document = await getPublicLegalDocument(documentKey)
  if (!document) notFound()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span>{eyebrow}</span>
          <h1>{document.title}</h1>
          <p>{intro}</p>
          <small>Última actualización: {formatDate(document.updated_at)}</small>
        </div>
      </header>
      <div className={`shell ${styles.shell}`}>
        <article className={styles.document}>
          <LegalMarkdown>{document.body}</LegalMarkdown>
        </article>
      </div>
    </div>
  )
}
