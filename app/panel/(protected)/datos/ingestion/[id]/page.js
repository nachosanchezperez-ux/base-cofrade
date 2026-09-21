import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import IngestionReview from './IngestionReview'
import panelStyles from '@/app/panel/panel.module.css'

export default async function AssistedIngestionReviewPage({ params, searchParams }) {
  const { id } = await params
  const query = await searchParams
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
  const requestedBatch = String(query?.batch || '')
  const batchId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(requestedBatch)
    && (documentImport.analysis?.capture?.batch_ids || []).includes(requestedBatch)
    ? requestedBatch
    : null

  return <div className={panelStyles.pageWrap}>
    <header className={panelStyles.pageHeader}>
      <div>
        <span className={panelStyles.eyebrow}>Ingestión asistida · Revisión humana</span>
        <h1>{targetResult.data.name}</h1>
        <p>{documentImport.source_title || documentImport.source_url}</p>
      </div>
      <Link className={panelStyles.rowLink} href={batchId ? `/panel/datos/ingestion/lotes/${batchId}` : "/panel/datos/ingestion"}>← {batchId ? "Volver a la tanda" : "Volver a ingestión"}</Link>
    </header>

    <IngestionReview documentImport={documentImport} target={targetResult.data} canEdit={canEdit} batchId={batchId} />
  </div>
}
