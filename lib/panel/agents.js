import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeEditableEntities } from '@/lib/panel/reference-nodes'

export const AGENT_KIND_LABELS = {
  person: 'Persona',
  workshop: 'Taller',
  company: 'Empresa',
  institution: 'Institución',
}

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}
function rows(result, label) { return assertQuery(result, label) || [] }

export async function getPanelAgents({ query = '', status = '', kind = '' } = {}) {
  const supabase = await createClient()
  let entityQuery = supabase.from('entities').select('id, name, slug, status, updated_at').eq('entity_type', 'agent').order('name')
  if (query) entityQuery = entityQuery.ilike('name', `%${query}%`)
  if (status) entityQuery = entityQuery.eq('status', status)
  const entities = rows(await entityQuery, 'No se pudieron cargar los Agentes del Panel')
  if (!entities.length) return []

  let agentQuery = supabase.from('agents').select('entity_id, agent_kind, municipality_id').in('entity_id', entities.map((entity) => entity.id))
  if (kind) agentQuery = agentQuery.eq('agent_kind', kind)
  const agentRows = rows(await agentQuery, 'No se pudieron cargar las fichas de Agente')
  const merged = mergeEditableEntities(entities, agentRows, 'agente', { agent_kind: 'person' })

  return merged.filter((entity) => !kind || entity.isEditable).map((entity) => ({
    ...entity,
    kind: entity.agent_kind || 'person',
    kindLabel: entity.isEditable ? AGENT_KIND_LABELS[entity.agent_kind] || 'Agente' : 'Nodo de referencia · se puede completar',
  }))
}

export async function getAgentEditorData(id) {
  const supabase = await createClient()
  const entity = assertQuery(await supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('id', id).eq('entity_type', 'agent').maybeSingle(), 'No se pudo cargar la entidad del Agente')
  if (!entity) return null

  const [agentResult, namesResult, disciplinesResult, rolesResult, municipalitiesResult, mediaResult, sourceLinksResult] = await Promise.all([
    supabase.from('agents').select('entity_id, agent_kind, municipality_id, foundation_or_birth_text, death_or_end_text, website_url, instagram_url, description, birth_or_foundation_date, death_or_end_date, address, email, phone, active_notes').eq('entity_id', id).maybeSingle(),
    supabase.from('agent_names').select('id, agent_entity_id, name, name_type, date_from, date_from_text, date_to, date_to_text, is_current, notes, created_at').eq('agent_entity_id', id).order('is_current', { ascending: false }).order('created_at'),
    supabase.from('agent_disciplines').select('id, agent_entity_id, discipline, is_primary, notes').eq('agent_entity_id', id).order('is_primary', { ascending: false }).order('discipline'),
    supabase.from('agent_roles').select('id, agent_entity_id, role_name, date_from, date_from_text, date_to, date_to_text, notes').eq('agent_entity_id', id).order('date_from', { ascending: false, nullsFirst: false }),
    supabase.from('municipalities').select('id, name, province').order('name'),
    supabase.from('entity_media').select('id, relation_type, is_cover').eq('entity_id', id),
    supabase.from('source_links').select('id, source_id, scope').eq('entity_id', id),
  ])

  const existingAgent = assertQuery(agentResult, 'No se pudo cargar la ficha del Agente')
  const agent = existingAgent || {
    entity_id: id,
    agent_kind: 'person',
    municipality_id: null,
    foundation_or_birth_text: null,
    death_or_end_text: null,
    website_url: null,
    instagram_url: null,
    description: null,
    birth_or_foundation_date: null,
    death_or_end_date: null,
    address: null,
    email: null,
    phone: null,
    active_notes: null,
  }
  const names = rows(namesResult, 'No se pudieron cargar los nombres del Agente')
  const disciplines = rows(disciplinesResult, 'No se pudieron cargar las disciplinas del Agente')
  const roles = rows(rolesResult, 'No se pudieron cargar los roles del Agente')
  const municipalities = rows(municipalitiesResult, 'No se pudieron cargar las localidades')
  const media = rows(mediaResult, 'No se pudo cargar el multimedia del Agente')
  const directSourceLinks = rows(sourceLinksResult, 'No se pudieron cargar las Fuentes del Agente').filter((link) => !String(link.scope || '').startsWith('relation:'))
  const sourceIds = [...new Set(directSourceLinks.map((link) => link.source_id).filter(Boolean))]
  const sources = sourceIds.length ? rows(await supabase.from('sources').select('id, name, url, source_type').in('id', sourceIds).order('name'), 'No se pudieron cargar las Fuentes del Agente') : []

  return {
    entity,
    agent,
    isReference: !existingAgent,
    names,
    disciplines,
    roles,
    municipalities,
    sources,
    coverage: { names: names.length, disciplines: disciplines.length, roles: roles.length, media: media.length, cover: media.some((item) => item.is_cover), sources: sources.length },
  }
}
