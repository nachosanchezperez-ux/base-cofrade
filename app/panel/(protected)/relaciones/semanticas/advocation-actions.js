'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

export async function setAdvocationStatusAction(formData) {
  const user = await requirePanelEditor()
  if (user.role !== 'admin') throw new Error('Solo un administrador puede publicar o archivar una identidad devocional.')

  const advocationId = String(formData.get('advocation_id') || '').trim()
  const status = String(formData.get('status') || '').trim()
  if (!UUID_PATTERN.test(advocationId)) throw new Error('Identificador de advocación no válido.')
  if (!['draft', 'published', 'archived'].includes(status)) throw new Error('Estado no válido.')

  const supabase = await createClient()
  const current = await supabase
    .from('entities')
    .select('id, name, status')
    .eq('id', advocationId)
    .eq('entity_type', 'advocation')
    .maybeSingle()
  if (current.error) throw new Error(`No se pudo comprobar la identidad devocional: ${current.error.message}`)
  if (!current.data) throw new Error('La identidad devocional ya no existe.')

  const updated = await supabase
    .from('entities')
    .update({ status })
    .eq('id', advocationId)
    .eq('entity_type', 'advocation')
    .select('id')
    .single()
  if (updated.error) throw new Error(`No se pudo cambiar el estado: ${updated.error.message}`)

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: status === 'published' ? 'publish' : status === 'archived' ? 'archive' : 'update',
    object_type: 'advocation',
    object_id: advocationId,
    entity_id: advocationId,
    summary: `Identidad devocional ${status}: ${current.data.name}`,
    changed_fields: { status },
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo registrar el cambio de estado de la advocación', auditError)

  revalidatePath('/panel/relaciones/semanticas')
  redirect('/panel/relaciones/semanticas?saved=advocation-status')
}
