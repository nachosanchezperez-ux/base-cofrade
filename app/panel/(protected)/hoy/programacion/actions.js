'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const EDITORIAL_TYPES = new Set(['fact', 'curiosity'])
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function optionalUuid(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function dateValue(formData, name) { const candidate = value(formData, name); if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.'); return candidate }
function editorialStatus(formData) { const candidate = value(formData, 'status') || 'published'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function integer(formData, name, fallback = 0) { const raw = value(formData, name); if (!raw) return fallback; const parsed = Number.parseInt(raw, 10); if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} debe ser un entero positivo.`); return parsed }
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }

async function refreshHome() {
  revalidatePath('/panel')
  revalidatePath('/panel/hoy')
  revalidatePath('/panel/hoy/programacion')
  revalidatePath('/panel/hoy/banco')
  revalidatePath('/')
}

export async function saveEditorialDailyOverrideAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const publishDate = dateValue(formData, 'publish_date')
  const requestedOverrideId = optionalUuid(formData, 'override_id')
  const editorialContentId = optionalUuid(formData, 'editorial_content_id')
  let contentType = value(formData, 'content_type') || 'curiosity'
  let title = nullable(formData, 'title')
  let summary = nullable(formData, 'summary')
  let entityId = optionalUuid(formData, 'entity_id')

  if (editorialContentId) {
    const content = assertRow(
      await supabase.from('editorial_content').select('id, content_type, title, summary, status').eq('id', editorialContentId).maybeSingle(),
      'El contenido del Banco no existe.'
    )
    if (!EDITORIAL_TYPES.has(content.content_type) || content.status !== 'published') throw new Error('El contenido del Banco debe estar publicado para programarlo.')
    contentType = content.content_type
    title = null
    summary = null
    entityId = null
  } else {
    if (!EDITORIAL_TYPES.has(contentType)) throw new Error('Tipo editorial no válido.')
    if (!title && !entityId) throw new Error('Selecciona un contenido del Banco o indica un título o entidad para el modo manual.')
    if (entityId) {
      const entity = await supabase.from('entities').select('id').eq('id', entityId).neq('status', 'archived').maybeSingle()
      if (entity.error || !entity.data) throw new Error('La entidad relacionada no está disponible.')
    }
  }

  const existingResult = await supabase
    .from('daily_overrides')
    .select('id, content_type, status')
    .eq('publish_date', publishDate)
    .in('content_type', [...EDITORIAL_TYPES])
    .order('sort_order')
  if (existingResult.error) throw new Error(`No se pudo consultar la programación editorial: ${existingResult.error.message}`)
  const existing = existingResult.data || []
  const sameType = existing.find((item) => item.content_type === contentType)
  const requested = existing.find((item) => item.id === requestedOverrideId)
  const target = sameType || requested || existing[0] || null

  if (existing.length) {
    let clear = supabase.from('daily_overrides').update({ status: 'archived' }).eq('publish_date', publishDate).in('content_type', [...EDITORIAL_TYPES])
    if (target?.id) clear = clear.neq('id', target.id)
    const cleared = await clear
    if (cleared.error) throw new Error(`No se pudieron retirar los overrides editoriales anteriores: ${cleared.error.message}`)
  }

  const payload = {
    publish_date: publishDate,
    content_type: contentType,
    title,
    summary,
    entity_id: entityId,
    editorial_content_id: editorialContentId,
    march_entity_id: null,
    event_entity_id: null,
    reason: nullable(formData, 'reason'),
    sort_order: integer(formData, 'sort_order', 1),
    status: editorialStatus(formData),
  }

  const result = target?.id
    ? await supabase.from('daily_overrides').update(payload).eq('id', target.id).select('id').single()
    : await supabase.from('daily_overrides').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar la programación editorial')

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: target?.id ? 'update' : 'create',
    object_type: 'daily_override',
    object_id: saved.id,
    entity_id: entityId,
    summary: `Programación editorial de Home: ${contentType} · ${publishDate}`,
    changed_fields: payload,
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo registrar la programación editorial', auditError)

  await refreshHome()
  redirect(`/panel/hoy/programacion?fecha=${publishDate}&saved=override`)
}
