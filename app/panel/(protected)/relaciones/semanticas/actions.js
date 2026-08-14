'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { SEMANTIC_RELATION_TYPES } from '@/lib/panel/semantic-relations'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const RELATION_RULES = {
  has_titular: { sourceType: 'brotherhood', targetType: 'advocation' },
  owned_by: { sourceType: 'image', targetType: 'agent', targetAgentKind: 'institution' },
  institutional_band: { sourceType: 'brotherhood', targetType: 'band' },
}

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la relación semántica', error)
}

function refresh() {
  revalidatePath('/panel/relaciones')
  revalidatePath('/panel/relaciones/semanticas')
  revalidatePath('/panel/fuentes')
}

export async function createAdvocationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const name = value(formData, 'name')
  const slug = slugify(value(formData, 'slug') || name)
  const advocationType = value(formData, 'advocation_type') || null
  const description = value(formData, 'description') || null

  if (!name) throw new Error('El nombre de la identidad devocional es obligatorio.')
  if (!slug) throw new Error('No se ha podido generar un slug válido.')

  const [slugRows, advocationEntities] = await Promise.all([
    supabase.from('entities').select('id, name').eq('slug', slug).limit(1),
    supabase.from('entities').select('id, name').eq('entity_type', 'advocation'),
  ])
  if (assertRows(slugRows, 'No se pudo comprobar el slug').length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }
  const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  const duplicate = assertRows(advocationEntities, 'No se pudieron comprobar duplicados')
    .find((item) => item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() === normalizedName)
  if (duplicate) throw new Error(`Ya existe una identidad devocional con ese nombre: ${duplicate.name}.`)

  const id = randomUUID()
  assertRow(
    await supabase.from('entities').insert({
      id,
      entity_type: 'advocation',
      name,
      slug,
      status: 'draft',
    }).select('id').single(),
    'No se pudo crear la entidad devocional'
  )
  assertRow(
    await supabase.from('advocations').insert({
      entity_id: id,
      advocation_type: advocationType,
      description,
    }).select('entity_id').single(),
    'No se pudo crear la advocación'
  )

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'advocation',
    object_id: id,
    entity_id: id,
    summary: `Identidad devocional creada: ${name}`,
    changed_fields: { advocation_type: advocationType, description },
  })

  refresh()
  redirect('/panel/relaciones/semanticas?saved=advocation')
}

async function validateEndpoint(supabase, id, expectedType, label) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, status')
      .eq('id', id)
      .eq('entity_type', expectedType)
      .maybeSingle(),
    `${label} no existe o no es del tipo esperado.`
  )
}

export async function createSemanticRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const relationType = value(formData, 'relation_type')
  const rule = RELATION_RULES[relationType]
  if (!rule) throw new Error('Tipo de relación semántica no permitido.')

  const sourceId = uuid(formData, 'source_entity_id')
  const targetId = uuid(formData, 'target_entity_id')
  if (sourceId === targetId) throw new Error('Una entidad no puede relacionarse consigo misma.')

  const [source, target] = await Promise.all([
    validateEndpoint(supabase, sourceId, rule.sourceType, 'La entidad origen'),
    validateEndpoint(supabase, targetId, rule.targetType, 'La entidad destino'),
  ])

  if (rule.targetAgentKind) {
    const agent = assertRow(
      await supabase.from('agents').select('entity_id, agent_kind').eq('entity_id', target.id).maybeSingle(),
      'La institución seleccionada no tiene ficha de Agente.'
    )
    if (agent.agent_kind !== rule.targetAgentKind) {
      throw new Error('La propiedad debe apuntar a un Agente de tipo Institución.')
    }
  }

  const requestedStatus = value(formData, 'status') === 'published' ? 'published' : 'draft'
  if (requestedStatus === 'published') {
    if (user.role !== 'admin') throw new Error('Solo un administrador puede publicar una relación.')
    if (source.status !== 'published' || target.status !== 'published') {
      throw new Error('Ambos extremos deben estar publicados antes de publicar la relación.')
    }
  }

  const existing = assertRows(
    await supabase
      .from('entity_relations')
      .select('id, status')
      .eq('source_entity_id', source.id)
      .eq('target_entity_id', target.id)
      .eq('relation_type', relationType)
      .neq('status', 'archived')
      .limit(1),
    'No se pudo comprobar la relación existente'
  )[0]
  if (existing) throw new Error('Esta relación ya existe.')

  const relation = assertRow(
    await supabase.from('entity_relations').insert({
      source_entity_id: source.id,
      target_entity_id: target.id,
      relation_type: relationType,
      date_from_text: value(formData, 'date_from_text') || null,
      date_to_text: value(formData, 'date_to_text') || null,
      notes: value(formData, 'notes') || null,
      status: requestedStatus,
    }).select('id').single(),
    'No se pudo crear la relación'
  )

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'entity_relation',
    object_id: relation.id,
    entity_id: source.id,
    summary: `${SEMANTIC_RELATION_TYPES[relationType]}: ${source.name} → ${target.name}`,
    changed_fields: { relation_type: relationType, target_entity_id: target.id, status: requestedStatus },
  })

  refresh()
  redirect('/panel/relaciones/semanticas?saved=relation')
}

export async function archiveSemanticRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const relationId = uuid(formData, 'relation_id')
  const current = assertRow(
    await supabase
      .from('entity_relations')
      .select('id, source_entity_id, target_entity_id, relation_type, status')
      .eq('id', relationId)
      .maybeSingle(),
    'La relación ya no existe.'
  )
  if (!RELATION_RULES[current.relation_type]) throw new Error('Esta relación no se gestiona desde este módulo.')
  if (current.status === 'published' && user.role !== 'admin') {
    throw new Error('Solo un administrador puede archivar una relación publicada.')
  }

  const updated = assertRow(
    await supabase.from('entity_relations').update({ status: 'archived' }).eq('id', relationId).select('id').single(),
    'No se pudo archivar la relación'
  )

  await audit(supabase, user, {
    action_type: 'archive',
    object_type: 'entity_relation',
    object_id: updated.id,
    entity_id: current.source_entity_id,
    summary: 'Relación semántica archivada',
    changed_fields: { status: 'archived' },
  })

  refresh()
  redirect('/panel/relaciones/semanticas?saved=archived')
}
