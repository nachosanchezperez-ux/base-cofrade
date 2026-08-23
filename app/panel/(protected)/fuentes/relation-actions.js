'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { relationSourceConfig, relationSourceScope } from '@/lib/panel/relation-sources'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const RELATION_CONFIG = {
  brotherhood_image: { table: 'brotherhood_images', contextField: 'brotherhood_entity_id' },
  brotherhood_step: { table: 'brotherhood_steps', contextField: 'brotherhood_entity_id' },
  image_step: { table: 'image_steps', contextField: 'image_entity_id' },
  image_authorship: { table: 'image_authorships', contextField: 'image_entity_id' },
  march_author: { table: 'march_authors', contextField: 'march_entity_id' },
  march_dedication: { table: 'march_dedications', contextField: 'march_entity_id' },
  march_recording: { table: 'march_recordings', contextField: 'march_entity_id' },
  step_phase: { table: 'step_phases', contextField: 'step_entity_id' },
  step_personnel: { table: 'step_personnel_periods', contextField: 'step_entity_id' },
  music_accompaniment_period: { table: 'music_accompaniment_periods', contextField: 'step_entity_id' },
  heritage_intervention: { table: 'heritage_interventions', contextField: 'target_entity_id' },
  outing: { table: 'outings', contextField: 'brotherhood_entity_id' },
  cult: { table: 'cults', contextField: 'brotherhood_entity_id' },
  outing_series: { table: 'outing_series', contextField: 'brotherhood_entity_id' },
  band_premiere: { table: 'band_premieres', contextField: 'band_entity_id' },
  band_agent: { table: 'band_agents', contextField: 'band_entity_id' },
  brotherhood_habit: { table: 'brotherhood_habits', contextField: 'brotherhood_entity_id' },
  entity_relation: { table: 'entity_relations', contextField: 'source_entity_id' },
}

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function relationKind(formData) {
  const candidate = value(formData, 'relation_kind')
  if (!RELATION_CONFIG[candidate]) throw new Error('Tipo de relación no compatible con Fuentes.')
  relationSourceConfig(candidate)
  return candidate
}

function returnPath(formData) {
  const candidate = value(formData, 'return_path')
  if (!candidate.startsWith('/panel/') || candidate.includes('://') || candidate.includes('\\')) {
    throw new Error('Ruta de retorno no válida.')
  }

  const [rawPath, rawHash = ''] = candidate.split('#', 2)
  const path = rawPath.split('?')[0]
  const hash = rawHash.replace(/[^a-zA-Z0-9_-]/g, '')
  return {
    path,
    href: hash ? `${path}#${hash}` : path,
  }
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

async function loadRelation(supabase, kind, relationId, contextEntityId) {
  const config = RELATION_CONFIG[kind]
  return assertRow(
    await supabase
      .from(config.table)
      .select(`id, ${config.contextField}`)
      .eq('id', relationId)
      .eq(config.contextField, contextEntityId)
      .maybeSingle(),
    'La relación no existe o ya no pertenece al contexto indicado.'
  )
}

async function loadSource(supabase, sourceId) {
  return assertRow(
    await supabase
      .from('sources')
      .select('id, name')
      .eq('id', sourceId)
      .maybeSingle(),
    'La Fuente seleccionada no existe.'
  )
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la Fuente de relación', error)
}

function refresh(returnTo) {
  revalidatePath(returnTo.path)
  revalidatePath('/panel/fuentes')
  revalidatePath('/')
}

async function existingSourceLink(supabase, kind, relationId, contextEntityId, sourceId) {
  const config = relationSourceConfig(kind)
  let query = supabase.from('source_links').select('id').eq('source_id', sourceId)
  if (config.mode === 'scope') {
    query = query.eq('entity_id', contextEntityId).eq('scope', relationSourceScope(kind, relationId))
  } else {
    query = query.eq(config.column, relationId)
  }
  const result = await query.limit(1).maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar el vínculo de Fuente: ${result.error.message}`)
  return result.data || null
}

function sourceLinkPayload(kind, relationId, contextEntityId, sourceId) {
  const config = relationSourceConfig(kind)
  if (config.mode === 'scope') {
    return {
      source_id: sourceId,
      entity_id: contextEntityId,
      scope: relationSourceScope(kind, relationId),
    }
  }
  return {
    source_id: sourceId,
    [config.column]: relationId,
    scope: `relation:${kind}`,
  }
}

async function validateLinkTarget(supabase, kind, relationId, contextEntityId, linkId) {
  const config = relationSourceConfig(kind)
  let query = supabase.from('source_links').select('*').eq('id', linkId)
  if (config.mode === 'scope') {
    query = query.eq('entity_id', contextEntityId).eq('scope', relationSourceScope(kind, relationId))
  } else {
    query = query.eq(config.column, relationId)
  }
  return assertRow(await query.maybeSingle(), 'El vínculo de Fuente no existe o no corresponde a esta relación.')
}

export async function linkRelationSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const kind = relationKind(formData)
  const relationId = uuid(formData, 'relation_id')
  const contextEntityId = uuid(formData, 'context_entity_id')
  const sourceId = uuid(formData, 'source_id')
  const returnTo = returnPath(formData)

  const [relation, source] = await Promise.all([
    loadRelation(supabase, kind, relationId, contextEntityId),
    loadSource(supabase, sourceId),
  ])

  const existing = await existingSourceLink(supabase, kind, relation.id, contextEntityId, source.id)

  if (!existing) {
    const payload = sourceLinkPayload(kind, relation.id, contextEntityId, source.id)
    const created = assertRow(
      await supabase.from('source_links').insert(payload).select('id').single(),
      'No se pudo vincular la Fuente a la relación'
    )

    await audit(supabase, user, {
      action_type: 'link',
      object_type: `${kind}_source`,
      object_id: created.id,
      entity_id: contextEntityId,
      summary: `Fuente vinculada a relación: ${source.name}`,
      changed_fields: {
        source_id: source.id,
        relation_kind: kind,
        relation_id: relation.id,
        target_column: relationSourceConfig(kind).column || 'entity_id/scope',
      },
    })
  }

  refresh(returnTo)
  redirect(returnTo.href)
}

export async function unlinkRelationSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const kind = relationKind(formData)
  const relationId = uuid(formData, 'relation_id')
  const contextEntityId = uuid(formData, 'context_entity_id')
  const linkId = uuid(formData, 'link_id')
  const returnTo = returnPath(formData)

  await loadRelation(supabase, kind, relationId, contextEntityId)
  const link = await validateLinkTarget(supabase, kind, relationId, contextEntityId, linkId)
  const source = await loadSource(supabase, link.source_id)

  assertRow(
    await supabase.from('source_links').delete().eq('id', link.id).select('id').single(),
    'No se pudo retirar la Fuente de la relación'
  )

  await audit(supabase, user, {
    action_type: 'unlink',
    object_type: `${kind}_source`,
    object_id: link.id,
    entity_id: contextEntityId,
    summary: `Fuente retirada de relación sin borrar la Fuente: ${source.name}`,
    changed_fields: {
      source_id: source.id,
      relation_kind: kind,
      relation_id: relationId,
    },
  })

  refresh(returnTo)
  redirect(returnTo.href)
}
