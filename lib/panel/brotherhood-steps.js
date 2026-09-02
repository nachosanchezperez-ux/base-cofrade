import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || null
}

function mediaAsset(value) {
  return Array.isArray(value) ? value[0] : value
}

function publicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (/^https?:\/\//i.test(storagePath) || storagePath.startsWith('/')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

export async function getBrotherhoodStepRelations(brotherhoodId) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, relationsResult, stepEntitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name, official_name')
      .eq('entity_id', brotherhoodId)
      .maybeSingle(),
    supabase
      .from('brotherhood_steps')
      .select('id, step_entity_id, relation_type, date_from, date_from_text, date_to, date_to_text, status, created_at')
      .eq('brotherhood_entity_id', brotherhoodId)
      .order('created_at'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'step')
      .order('name'),
  ])

  const entity = assertRow(entityResult, 'No se pudo cargar la Hermandad')
  const brotherhood = assertRow(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!entity || !brotherhood) return null

  const relations = assertRows(relationsResult, 'No se pudieron cargar los Pasos relacionados')
  const stepEntities = assertRows(stepEntitiesResult, 'No se pudieron cargar los Pasos existentes')
  const stepIds = stepEntities.map((step) => step.id)
  const relatedStepIds = [...new Set(relations.map((relation) => relation.step_entity_id).filter(Boolean))]

  const [stepRows, mediaLinks] = await Promise.all([
    stepIds.length
      ? supabase
          .from('steps')
          .select('entity_id, step_type, current_condition')
          .in('entity_id', stepIds)
          .then((result) => assertRows(result, 'No se pudieron cargar los tipos de Paso'))
      : Promise.resolve([]),
    relatedStepIds.length
      ? supabase
          .from('entity_media')
          .select('id, entity_id, media_asset_id, relation_type, sort_order, is_cover, notes, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status)')
          .in('entity_id', relatedStepIds)
          .order('is_cover', { ascending: false })
          .order('sort_order')
          .then((result) => assertRows(result, 'No se pudieron cargar las fotografías de los Pasos'))
      : Promise.resolve([]),
  ])

  const mediaByStepId = new Map()
  mediaLinks.forEach((link) => {
    const asset = mediaAsset(link.media_assets)
    if (!asset) return
    const list = mediaByStepId.get(link.entity_id) || []
    list.push({
      ...link,
      asset,
      publicUrl: publicUrl(supabase, asset.storage_path),
    })
    mediaByStepId.set(link.entity_id, list)
  })

  const stepRowById = new Map(stepRows.map((step) => [step.entity_id, step]))
  const steps = stepEntities.map((step) => {
    const row = stepRowById.get(step.id) || {}
    const media = mediaByStepId.get(step.id) || []
    const cover = media.find((item) => item.is_cover)
      || media.find((item) => ['cover', 'hero', 'principal', 'main'].includes(item.relation_type))
      || media[0]
      || null

    return {
      ...step,
      stepType: row.step_type || 'Paso',
      condition: row.current_condition || '',
      media,
      cover,
      meta: [row.step_type || 'Paso', step.status === 'published' ? 'Publicado' : 'Borrador']
        .filter(Boolean)
        .join(' · '),
    }
  })
  const stepById = new Map(steps.map((step) => [step.id, step]))
  const hydratedRelations = relations.map((relation) => ({
    ...relation,
    step: stepById.get(relation.step_entity_id) || null,
  }))
  const sourceSupport = await loadRelationSourceSupport(supabase, hydratedRelations, 'brotherhood_step')

  return {
    entity,
    brotherhood,
    relations: sourceSupport.relations,
    candidates: steps.filter((step) => step.status !== 'archived'),
    sourceOptions: sourceSupport.sourceOptions,
  }
}
