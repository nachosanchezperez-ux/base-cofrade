'use server'

import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { updateAgentAction } from './actions'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const AGENT_KINDS = new Set(['person', 'workshop', 'company', 'institution'])

export async function saveAgentGeneralAction(formData) {
  await requirePanelEditor()
  const agentId = String(formData.get('agent_id') || '').trim()
  const agentKind = String(formData.get('agent_kind') || 'person').trim()
  if (!UUID_PATTERN.test(agentId)) throw new Error('Identificador de Persona no válido.')
  if (!AGENT_KINDS.has(agentKind)) throw new Error('El tipo de registro no es válido.')

  const supabase = await createClient()
  const existing = await supabase.from('agents').select('entity_id').eq('entity_id', agentId).maybeSingle()
  if (existing.error) throw new Error(`No se pudo comprobar la ficha de Persona: ${existing.error.message}`)
  if (!existing.data) {
    const inserted = await supabase.from('agents').insert({ entity_id: agentId, agent_kind: agentKind })
    if (inserted.error) throw new Error(`No se pudo consolidar el nodo de referencia: ${inserted.error.message}`)
  }

  return updateAgentAction(formData)
}
