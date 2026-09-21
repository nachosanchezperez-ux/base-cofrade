import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import BatchIngestionReview from './BatchIngestionReview'
import panelStyles from '@/app/panel/panel.module.css'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

export default async function AssistedIngestionBatchPage({ params }) {
  const { batchId } = await params
  if (!UUID_PATTERN.test(String(batchId || ''))) notFound()

  const user = await requirePanelUser()
  const supabase = await createClient()
  const importsResult = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, source_title, status, analysis, application_summary, model_name, content_sha256, fetched_at, created_at, error_text')
    .contains('analysis', { capture: { batch_ids: [batchId] } })
    .order('created_at', { ascending: true })
    .limit(30)

  if (importsResult.error) throw new Error(`No se pudo cargar la tanda de ingestión: ${importsResult.error.message}`)
  const imports = importsResult.data || []
  if (!imports.length) notFound()

  const targetIds = [...new Set(imports.map((item) => item.target_entity_id))]
  if (targetIds.length !== 1) throw new Error('La tanda contiene objetivos incompatibles y no puede continuar.')

  const targetResult = await supabase
    .from('entities')
    .select('id, name, slug, status')
    .eq('id', targetIds[0])
    .maybeSingle()
  if (targetResult.error) throw new Error(`No se pudo cargar la Hermandad objetivo: ${targetResult.error.message}`)
  if (!targetResult.data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={panelStyles.pageWrap}>
    <header className={panelStyles.pageHeader}>
      <div>
        <span className={panelStyles.eyebrow}>HC-AUTO-01 · Revisión por lote</span>
        <h1>{targetResult.data.name}</h1>
        <p>{imports.length} propuesta{imports.length === 1 ? '' : 's'} de Fuente · revisión humana antes del preflight conjunto</p>
      </div>
      <Link className={panelStyles.rowLink} href="/panel/datos/ingestion">← Volver a ingestión</Link>
    </header>

    {!canEdit ? <div className={panelStyles.readOnlyNotice}>Puedes revisar la tanda, pero solo administradores y editores pueden guardar decisiones y generar el lote gobernado.</div> : null}
    <BatchIngestionReview batchId={batchId} target={targetResult.data} imports={imports} canEdit={canEdit} />
  </div>
}