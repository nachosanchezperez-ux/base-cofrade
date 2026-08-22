'use server'

import { createClient } from '@/lib/supabase/server'
import { archiveEditorialContentAction, saveEditorialContentAction } from '../actions'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function contentId(formData) { const id = value(formData, 'content_id'); return UUID_PATTERN.test(id) ? id : null }

async function archiveScheduledOverrides(id) {
  if (!id) return
  const supabase = await createClient()
  const result = await supabase
    .from('daily_overrides')
    .update({ status: 'archived' })
    .eq('editorial_content_id', id)
    .neq('status', 'archived')
  if (result.error) throw new Error(`No se pudieron retirar las programaciones activas de este contenido: ${result.error.message}`)
}

export async function saveBankEditorialContentAction(formData) {
  const id = contentId(formData)
  const nextStatus = value(formData, 'status') || 'draft'
  if (id && nextStatus !== 'published') await archiveScheduledOverrides(id)
  return saveEditorialContentAction(formData)
}

export async function archiveBankEditorialContentAction(formData) {
  await archiveScheduledOverrides(contentId(formData))
  return archiveEditorialContentAction(formData)
}
