'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'ready'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

export async function saveLegalDraftAction(formData) {
  const user = await requirePanelEditor()
  const id = value(formData, 'document_id')
  const title = value(formData, 'title')
  const body = value(formData, 'body')
  const status = value(formData, 'status') || 'draft'

  if (!UUID_PATTERN.test(id)) throw new Error('El documento legal no es válido.')
  if (!title) throw new Error('El título es obligatorio.')
  if (!body) throw new Error('El contenido no puede quedar vacío.')
  if (!STATUSES.has(status)) throw new Error('El estado del borrador no es válido.')

  const supabase = await createClient()
  const payload = {
    title,
    body,
    status,
    internal_notes: value(formData, 'internal_notes') || null,
    updated_by: user.id,
  }
  const result = await supabase
    .from('legal_drafts')
    .update(payload)
    .eq('id', id)
    .select('id, document_key, title')
    .single()

  if (result.error || !result.data) {
    throw new Error(`No se pudo guardar el borrador legal: ${result.error?.message || 'documento inexistente'}`)
  }

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'legal_draft',
    object_id: result.data.id,
    summary: `Borrador legal actualizado: ${result.data.title}`,
    changed_fields: { document_key: result.data.document_key, status },
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo auditar el borrador legal', auditError)

  revalidatePath('/panel')
  revalidatePath('/panel/legal')
  redirect(`/panel/legal?saved=document-updated&document=${result.data.document_key}`)
}
