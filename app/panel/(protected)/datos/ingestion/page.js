import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import IngestionStart from './IngestionStart'
import panelStyles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Ingestión asistida · Panel' }

export default async function AssistedIngestionPage() {
  const user = await requirePanelUser()
  const supabase = await createClient()
  const canEdit = ['admin', 'editor'].includes(user.role)

  const [targetsResult, importsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived')
      .order('name', { ascending: true })
      .limit(1000),
    supabase
      .from('document_imports')
      .select('id, target_entity_id, source_title, source_url, status, model_name, application_summary, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  if (targetsResult.error) throw new Error(`No se pudieron cargar las Hermandades: ${targetsResult.error.message}`)
  if (importsResult.error) throw new Error(`No se pudo cargar el historial de ingestiones: ${importsResult.error.message}`)

  const targets = targetsResult.data || []
  const targetNames = new Map(targets.map((target) => [target.id, target.name]))
  const recentImports = (importsResult.data || []).map((item) => ({
    ...item,
    target_name: targetNames.get(item.target_entity_id) || 'Hermandad',
  }))

  return <div className={panelStyles.pageWrap}>
    <header className={panelStyles.pageHeader}>
      <div>
        <span className={panelStyles.eyebrow}>Fuentes → propuesta → preflight</span>
        <h1>Ingestión asistida</h1>
        <p>Parte de una URL, extrae hechos con evidencia y convierte únicamente lo que apruebes en un lote gobernado del importador masivo.</p>
      </div>
    </header>

    {!canEdit ? <div className={panelStyles.readOnlyNotice}>Tu perfil puede revisar propuestas, pero solo administradores y editores pueden analizar Fuentes o generar lotes.</div> : null}
    <IngestionStart
      targets={targets}
      recentImports={recentImports}
      canEdit={canEdit}
      aiConfigured={Boolean(process.env.OPENAI_API_KEY)}
    />
  </div>
}
