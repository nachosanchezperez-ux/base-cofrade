import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import IngestionReview from './IngestionReview'
import panelStyles from '@/app/panel/panel.module.css'

export default async function AssistedIngestionReviewPage({ params }) {
  const { id } = await params
  const user = await requirePanelUser()
  const supabase = await createClient()

  const importResult = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, source_title, status, analysis_version, analysis, application_summary, model_name, content_sha256, fetched_at, created_at, error_text')
    .eq('id', id)
    .maybeSingle()
  if (importResult.error) throw new Error(`No se pudo cargar la propuesta: ${importResult.error.message}`)
  if (!importResult.data) notFound()

  const documentImport = importResult.data
  const targetResult = await supabase
    .from('entities')
    .select('id, name, slug, status')
    .eq('id', documentImport.target_entity_id)
    .maybeSingle()
  if (targetResult.error) throw new Error(`No se pudo cargar la Hermandad objetivo: ${targetResult.error.message}`)
  if (!targetResult.data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={panelStyles.pageWrap}>
    <header className={panelStyles.pageHeader}>
      <div>
        <span className={panelStyles.eyebrow}>Ingestión asistida · Revisión humana</span>
        <h1>{targetResult.data.name}</h1>
        <p>{documentImport.source_title || documentImport.source_url}</p>
      </div>
      <Link className={panelStyles.rowLink} href="/panel/datos/ingestion">← Volver a ingestión</Link>
    </header>

    <IngestionReview documentImport={documentImport} target={targetResult.data} canEdit={canEdit} />
  </div>
}
