'use server'

import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { publicEntityHref } from '@/lib/editorial-freshness'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function entityId(formData) {
  const id = String(formData.get('entity_id') || '').trim()
  if (!UUID_PATTERN.test(id)) throw new Error('Entidad no válida.')
  return id
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function loadEntity(supabase, id) {
  return assertMutation(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status, updated_at, content_updated_at')
      .eq('id', id)
      .single(),
    'No se pudo consultar la entidad'
  )
}

async function audit(supabase, user, entity, summary, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'entity_editorial_freshness',
    object_id: entity.id,
    entity_id: entity.id,
    summary,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría de frescura', error)
}

function revalidateEntity(entity) {
  revalidatePath('/panel')
  revalidatePath('/panel/datos')
  revalidatePath('/panel/datos/frescura')
  const publicHref = publicEntityHref(entity)
  if (publicHref) revalidatePath(publicHref)
  const directory = publicHref.split('/').slice(0, 2).join('/')
  if (directory) revalidatePath(directory)
}

export async function markEntityReviewedAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = entityId(formData)
  const entity = await loadEntity(supabase, id)
  const reviewedAt = new Date().toISOString()
  const legacyContentDate = entity.content_updated_at || entity.updated_at || null

  assertMutation(
    await supabase
      .from('entities')
      .update({
        editorial_reviewed_at: reviewedAt,
        ...(legacyContentDate ? { content_updated_at: legacyContentDate } : {}),
      })
      .eq('id', id),
    'No se pudo registrar la revisión editorial'
  )

  await audit(
    supabase,
    user,
    entity,
    `Ficha revisada: ${entity.name}`,
    {
      editorial_reviewed_at: reviewedAt,
      ...(legacyContentDate ? { content_updated_at: legacyContentDate } : {}),
    }
  )
  revalidateEntity(entity)
}

export async function markEntityContentUpdatedAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = entityId(formData)
  const entity = await loadEntity(supabase, id)
  const updatedAt = new Date().toISOString()

  assertMutation(
    await supabase
      .from('entities')
      .update({
        content_updated_at: updatedAt,
        editorial_reviewed_at: updatedAt,
      })
      .eq('id', id),
    'No se pudo registrar la actualización editorial'
  )

  await audit(
    supabase,
    user,
    entity,
    `Contenido actualizado: ${entity.name}`,
    {
      content_updated_at: updatedAt,
      editorial_reviewed_at: updatedAt,
    }
  )
  revalidateEntity(entity)
}
