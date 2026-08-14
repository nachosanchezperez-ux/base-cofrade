'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { relationSourceScope, relationSourceTargetField } from '@/lib/panel/relation-sources'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const RELATION_CONFIG = {
  brotherhood_image: { table: 'brotherhood_images', contextField: 'brotherhood_entity_id' },
  brotherhood_step: { table: 'brotherhood_steps', contextField: 'brotherhood_entity_id' },
  image_step: { table: 'image_steps', contextField: 'image_entity_id' },
  image_authorship: { table: 'image_authorships', contextField: 'image_entity_id' },
  entity_relation: { table: 'entity_relations', contextField: 'source_entity_id' },
  intervention: { table: 'heritage_interventions', contextField: 'target_entity_id' },
  music_accompaniment_period: { table: 'music_accompaniment_periods', contextField: 'brotherhood_entity_id' },
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
  return candidate
}

function returnPath(formData) {
  const candidate = value(formData, 'return_path')
  if (!candidate.startsWith('/panel/') || candidate.includes('://') || candidate.includes('\\')) {
    throw new Error('Ruta de retorno no válida.')
  }
  return candidate.split('?')[0]
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
  revalidatePath(returnTo)
  revalidatePath('/panel/fuentes')
}

export async function linkRelationSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const kind = relationKind(formData)
  const relationId = uuid(formData, 'relation_id')
  const contextEntityId = uuid(formData, 'context_entity_id')
  const sourceId = uuid(formData, 'source_id')
  const returnTo = returnPath(formData)
  const targetField = relationSourceTargetField(kind)
  const scope = relationSourceScope(kind, relationId)
  const notes = value(formData, 'source_notes') || null

  const [relation, source] = await Promise.all([
    loadRelation(supabase, kind, relationId, contextEntityId),
    loadSource(supabase, sourceId),
  ])

  const [directExisting, legacyExisting] = await Promise.all([
    supabase
      .from('source_links')
      .select('id')
      .eq('source_id', source.id)
      .eq(targetField, relationId)
      .limit(1)
      .maybeSingle(),
    supabase
      .from('source_links')
      .select('id')
      .eq('source_id', source.id)
      .eq('entity_id', contextEntityId)
      .eq('scope', scope)
      .limit(1)
      .maybeSingle(),
  ])

  if (directExisting.error) throw new Error(`No se pudo comprobar el vínculo directo de Fuente: ${directExisting.error.message}`)
  if (legacyExisting.error) throw new Error(`No se pudo comprobar el vínculo legacy de Fuente: ${legacyExisting.error.message}`)

  if (!directExisting.data && !legacyExisting.data) {
    const created = assertRow(
      await supabase
        .from('source_links')
        .insert({
          source_id: source.id,
          [targetField]: relationId,
          scope: value(formData, 'source_scope') || null,
          notes,
        })
        .select('id')
        .single(),
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
        target_field: targetField,
        scope: value(formData, 'source_scope') || null,
        notes,
      },
    })
  }

  refresh(returnTo)
  redirect(returnTo)
}

export async function unlinkRelationSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const kind = relationKind(formData)
  const relationId = uuid(formData, 'relation_id')
  const contextEntityId = uuid(formData, 'context_entity_id')
  const linkId = uuid(formData, 'link_id')
  const returnTo = returnPath(formData)
  const targetField = relationSourceTargetField(kind)
  const legacyScope = relationSourceScope(kind, relationId)

  await loadRelation(supabase, kind, relationId, contextEntityId)

  const link = assertRow(
    await supabase
      .from('source_links')
      .select(`id, source_id, entity_id, scope, ${targetField}`)
      .eq('id', linkId)
      .maybeSingle(),
    'El vínculo de Fuente no existe.'
  )
  const isDirect = link[targetField] === relationId
  const isLegacy = link.entity_id === contextEntityId && link.scope === legacyScope
  if (!isDirect && !isLegacy) throw new Error('El vínculo de Fuente no corresponde a esta relación.')

  const source = await loadSource(supabase, link.source_id)

  assertRow(
    await supabase
      .from('source_links')
      .delete()
      .eq('id', link.id)
      .select('id')
      .single(),
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
      target_field: targetField,
      legacy_scope: isLegacy ? legacyScope : null,
    },
  })

  refresh(returnTo)
  redirect(returnTo)
}
