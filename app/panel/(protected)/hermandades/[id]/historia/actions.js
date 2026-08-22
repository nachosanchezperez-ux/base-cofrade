'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function saveBrotherhoodHistoryAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const historyText = value(formData, 'history_text')

  const entity = assertMutation(
    await supabase
      .from('entities')
      .select('id, slug, name')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    'No se pudo validar la Hermandad'
  )
  if (!entity) throw new Error('La Hermandad ya no existe.')

  assertMutation(
    await supabase
      .from('brotherhoods')
      .update({ history_text: historyText || null })
      .eq('entity_id', brotherhoodId),
    'No se pudo guardar la Historia'
  )

  const auditResult = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'brotherhood_history',
    object_id: brotherhoodId,
    entity_id: brotherhoodId,
    summary: `Historia actualizada: ${entity.name}`,
    changed_fields: { history_text: historyText },
  })
  if (auditResult.error) throw new Error(`No se pudo registrar la edición: ${auditResult.error.message}`)

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/historia`)
  revalidatePath('/hermandades')
  if (entity.slug) revalidatePath(`/hermandades/${entity.slug}`)

  redirect(`/panel/hermandades/${brotherhoodId}/historia?saved=1`)
}
