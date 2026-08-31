'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { CONTRIBUTION_STATUS_LABELS } from '@/lib/panel/contributions'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const FINAL_STATUSES = new Set(['accepted', 'rejected', 'applied', 'expired'])

function value(formData, name) {
  return String(formData.get(name) || '').normalize('NFC').trim()
}

export async function reviewContributionAction(formData) {
  const user = await requirePanelEditor()
  const contributionId = value(formData, 'contribution_id')
  const status = value(formData, 'status')
  const internalNotes = value(formData, 'internal_notes')
  const resolutionSummary = value(formData, 'resolution_summary')

  if (!UUID_PATTERN.test(contributionId)) throw new Error('La aportación no es válida.')
  if (!Object.hasOwn(CONTRIBUTION_STATUS_LABELS, status)) throw new Error('El estado editorial no es válido.')
  if (internalNotes.length > 4000) throw new Error('Las notas internas superan 4.000 caracteres.')
  if (resolutionSummary.length > 2000) throw new Error('El resumen de resolución supera 2.000 caracteres.')

  const supabase = await createClient()
  const current = await supabase
    .from('contributions')
    .select('id, title, status, assigned_to')
    .eq('id', contributionId)
    .maybeSingle()
  if (current.error || !current.data) throw new Error('La aportación ya no está disponible.')

  const payload = {
    status,
    internal_notes: internalNotes || null,
    resolution_summary: resolutionSummary || null,
    reviewed_by: user.id,
    reviewed_at: new Date().toISOString(),
    resolved_at: FINAL_STATUSES.has(status) ? new Date().toISOString() : null,
  }
  if (formData.has('assign_to_me')) payload.assigned_to = user.id
  if (formData.has('unassign')) payload.assigned_to = null

  const updated = await supabase
    .from('contributions')
    .update(payload)
    .eq('id', contributionId)
    .select('id')
    .single()
  if (updated.error) throw new Error(`No se pudo actualizar la aportación: ${updated.error.message}`)

  if (['accepted', 'applied'].includes(status)) {
    const attachments = await supabase
      .from('contribution_attachments')
      .update({ status: 'accepted', reviewed_at: new Date().toISOString() })
      .eq('contribution_id', contributionId)
      .eq('status', 'quarantined')
    if (attachments.error) console.error('[Hilo Cofrade] No se pudo actualizar la revisión de adjuntos', attachments.error)
  } else if (['rejected', 'expired'].includes(status)) {
    const attachments = await supabase
      .from('contribution_attachments')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('contribution_id', contributionId)
      .eq('status', 'quarantined')
    if (attachments.error) console.error('[Hilo Cofrade] No se pudo actualizar la revisión de adjuntos', attachments.error)
  }

  const audit = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: 'contribution',
    object_id: contributionId,
    summary: `Aportación revisada: ${current.data.title}`,
    changed_fields: {
      previous_status: current.data.status,
      status,
      assigned_to: payload.assigned_to ?? current.data.assigned_to,
      has_internal_notes: Boolean(internalNotes),
      has_resolution_summary: Boolean(resolutionSummary),
    },
  })
  if (audit.error) console.error('[Hilo Cofrade] No se pudo auditar la revisión de la aportación', audit.error)

  revalidatePath('/panel')
  revalidatePath('/panel/aportaciones')
  redirect(`/panel/aportaciones?id=${contributionId}&saved=reviewed`)
}

