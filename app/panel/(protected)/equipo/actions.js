'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelAdmin } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const ROLES = new Set(['admin', 'editor', 'collaborator'])

function field(formData, name) {
  return String(formData.get(name) || '').trim()
}

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function savePanelUserAction(formData) {
  const admin = await requirePanelAdmin()
  const supabase = await createClient()
  const userId = field(formData, 'user_id')
  const displayName = field(formData, 'display_name')
  const role = field(formData, 'role')
  const active = formData.get('active') === 'on'
  const isNew = field(formData, 'is_new') === 'true'

  if (!UUID_PATTERN.test(userId)) throw new Error('El identificador del usuario no es válido.')
  if (!displayName) throw new Error('El nombre visible es obligatorio.')
  if (!ROLES.has(role)) throw new Error('El perfil seleccionado no es válido.')
  if (userId === admin.id && (!active || role !== 'admin')) {
    throw new Error('No puedes retirar tu propio acceso de administrador.')
  }

  const payload = { user_id: userId, display_name: displayName, role, active }
  if (isNew) {
    assertResult(await supabase.from('panel_users').insert(payload), 'No se pudo añadir el perfil')
  } else {
    assertResult(await supabase.from('panel_users').update({ display_name: displayName, role, active }).eq('user_id', userId), 'No se pudo actualizar el perfil')
  }

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: admin.id,
    actor_label: admin.name,
    action_type: isNew ? 'create' : 'update',
    object_type: 'panel_user',
    object_id: userId,
    summary: `${isNew ? 'Perfil añadido' : 'Perfil actualizado'}: ${displayName}`,
    changed_fields: { role, active },
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo registrar la auditoría', auditError)

  revalidatePath('/panel/equipo')
  redirect('/panel/equipo?saved=equipo')
}
