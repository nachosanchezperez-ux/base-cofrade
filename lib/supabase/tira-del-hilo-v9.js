import 'server-only'

import { askHiloCofradeV8 } from '@/lib/supabase/tira-del-hilo-v8'
import { createClient } from '@/lib/supabase/server'
import { directSupportKind, supportReferenceLabel } from '@/lib/tira-direct-support'
import { rankTiraReferences } from '@/lib/tira-references'

const HREF_PREFIX = {
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
  brotherhood: 'hermandades',
}

function slugFromHref(href = '', entityType = '') {
  const prefix = HREF_PREFIX[entityType]
  if (!prefix) return ''
  const match = String(href || '').match(new RegExp(`^/${prefix}/([^/?#]+)`))
  return match?.[1] || ''
}

async function resolveItemsByHref(supabase, response, entityType) {
  const targets = []
  for (let index = 0; index < (response.items || []).length; index += 1) {
    const slug = slugFromHref(response.items[index]?.href, entityType)
    if (slug) targets.push({ index, slug })
  }
  const slugs = [...new Set(targets.map((target) => target.slug))]
  if (!slugs.length) return new Map()

  const result = await supabase
    .from('entities')
    .select('id, slug')
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .in('slug', slugs)
  if (result.error) throw result.error
  const bySlug = new Map((result.data || []).map((entity) => [entity.slug, entity.id]))
  return new Map(targets.map((target) => [target.index, bySlug.get(target.slug)]).filter(([, id]) => Boolean(id)))
}

async function resolveItemsByLabel(supabase, response, entityType) {
  const targets = (response.items || []).map((item, index) => ({ index, name: String(item?.label || '').trim() })).filter((target) => target.name)
  const names = [...new Set(targets.map((target) => target.name))]
  if (!names.length) return new Map()

  const result = await supabase
    .from('entities')
    .select('id, name')
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .in('name', names)
  if (result.error) throw result.error
  const byName = new Map((result.data || []).map((entity) => [entity.name, entity.id]))
  return new Map(targets.map((target) => [target.index, byName.get(target.name)]).filter(([, id]) => Boolean(id)))
}

async function sourcesForRelationRows(supabase, relationRows, sourceLinkColumn, targetField, itemTargets) {
  if (!relationRows.length || !itemTargets.size) return new Map()
  const relationIds = relationRows.map((row) => row.id).filter(Boolean)
  if (!relationIds.length) return new Map()

  const linkResult = await supabase
    .from('source_links')
    .select(`source_id, ${sourceLinkColumn}, scope`)
    .in(sourceLinkColumn, relationIds)
  if (linkResult.error) throw linkResult.error
  const links = linkResult.data || []
  const sourceIds = [...new Set(links.map((link) => link.source_id).filter(Boolean))]
  if (!sourceIds.length) return new Map()

  const sourceResult = await supabase
    .from('sources')
    .select('id, name, url, source_type, author_or_publisher, publication_date')
    .in('id', sourceIds)
  if (sourceResult.error) throw sourceResult.error
  const sources = sourceResult.data || []
  const rowsByTarget = new Map()
  relationRows.forEach((row) => {
    const targetId = row[targetField]
    const current = rowsByTarget.get(targetId) || []
    current.push(row.id)
    rowsByTarget.set(targetId, current)
  })

  const referencesByIndex = new Map()
  for (const [index, targetId] of itemTargets.entries()) {
    const ids = rowsByTarget.get(targetId) || []
    if (!ids.length) continue
    const relevantLinks = links
      .filter((link) => ids.includes(link[sourceLinkColumn]))
      .map((link) => ({ ...link, entity_id: targetId }))
    const references = rankTiraReferences(sources, relevantLinks, 2)
    if (references.length) referencesByIndex.set(index, references)
  }

  return referencesByIndex
}

function withItemReferences(response, kind, referencesByIndex) {
  if (!referencesByIndex.size) return response
  let count = 0
  const items = (response.items || []).map((item, index) => {
    const references = referencesByIndex.get(index)
    if (!references?.length) return item
    count += references.length
    return {
      ...item,
      relationReferences: references,
      relationReferenceLabel: supportReferenceLabel(kind),
    }
  })

  return {
    ...response,
    items,
    exactDirectReferenceCount: count,
    directReferencesNote: 'Las referencias mostradas junto a cada resultado están enlazadas directamente al registro de esa relación o intervención.',
  }
}

async function attachBrotherhoodImages(supabase, response, kind) {
  const brotherhoodId = response?.context?.entityId
  if (!brotherhoodId) return response
  const targets = await resolveItemsByHref(supabase, response, 'image')
  const imageIds = [...new Set(targets.values())]
  if (!imageIds.length) return response

  const relationResult = await supabase
    .from('brotherhood_images')
    .select('id, image_entity_id')
    .eq('brotherhood_entity_id', brotherhoodId)
    .in('image_entity_id', imageIds)
    .eq('status', 'published')
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'brotherhood_image_id', 'image_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachBrotherhoodSteps(supabase, response, kind) {
  const brotherhoodId = response?.context?.entityId
  if (!brotherhoodId) return response
  const targets = await resolveItemsByHref(supabase, response, 'step')
  const stepIds = [...new Set(targets.values())]
  if (!stepIds.length) return response

  const relationResult = await supabase
    .from('brotherhood_steps')
    .select('id, step_entity_id')
    .eq('brotherhood_entity_id', brotherhoodId)
    .in('step_entity_id', stepIds)
    .eq('status', 'published')
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'brotherhood_step_id', 'step_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachPersonnelByAgent(supabase, response, kind) {
  const agentId = response?.context?.entityId
  if (!agentId) return response
  const targets = await resolveItemsByHref(supabase, response, 'step')
  const stepIds = [...new Set(targets.values())]
  if (!stepIds.length) return response

  const relationResult = await supabase
    .from('step_personnel_periods')
    .select('id, step_entity_id')
    .eq('agent_entity_id', agentId)
    .in('step_entity_id', stepIds)
    .eq('status', 'published')
    .eq('is_current', true)
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'step_personnel_period_id', 'step_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachPersonnelByStep(supabase, response, kind) {
  const stepId = response?.context?.entityId
  if (!stepId) return response
  const targets = await resolveItemsByLabel(supabase, response, 'agent')
  const agentIds = [...new Set(targets.values())]
  if (!agentIds.length) return response

  const relationResult = await supabase
    .from('step_personnel_periods')
    .select('id, agent_entity_id')
    .eq('step_entity_id', stepId)
    .in('agent_entity_id', agentIds)
    .eq('status', 'published')
    .eq('is_current', true)
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'step_personnel_period_id', 'agent_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachMusicByBrotherhood(supabase, response, kind) {
  const brotherhoodId = response?.context?.entityId
  if (!brotherhoodId) return response
  const targets = await resolveItemsByHref(supabase, response, 'band')
  const bandIds = [...new Set(targets.values())]
  if (!bandIds.length) return response

  const relationResult = await supabase
    .from('music_accompaniment_periods')
    .select('id, band_entity_id')
    .eq('brotherhood_entity_id', brotherhoodId)
    .in('band_entity_id', bandIds)
    .eq('status', 'published')
    .eq('is_current', true)
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'music_accompaniment_period_id', 'band_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachMusicByBand(supabase, response, kind) {
  const bandId = response?.context?.entityId
  if (!bandId) return response
  const targets = await resolveItemsByHref(supabase, response, 'brotherhood')
  const brotherhoodIds = [...new Set(targets.values())]
  if (!brotherhoodIds.length) return response

  const relationResult = await supabase
    .from('music_accompaniment_periods')
    .select('id, brotherhood_entity_id')
    .eq('band_entity_id', bandId)
    .in('brotherhood_entity_id', brotherhoodIds)
    .eq('status', 'published')
    .eq('is_current', true)
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'music_accompaniment_period_id', 'brotherhood_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachImageAuthorships(supabase, response, kind) {
  const targets = await resolveItemsByHref(supabase, response, 'image')
  const imageIds = [...new Set(targets.values())]
  if (!imageIds.length) return response

  const relationResult = await supabase
    .from('image_authorships')
    .select('id, image_entity_id')
    .in('image_entity_id', imageIds)
    .eq('status', 'published')
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'image_authorship_id', 'image_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachImageRestorations(supabase, response, kind) {
  const targets = await resolveItemsByHref(supabase, response, 'image')
  const imageIds = [...new Set(targets.values())]
  if (!imageIds.length) return response

  const relationResult = await supabase
    .from('image_restorations')
    .select('id, image_entity_id')
    .in('image_entity_id', imageIds)
  if (relationResult.error) throw relationResult.error
  const references = await sourcesForRelationRows(supabase, relationResult.data || [], 'heritage_update_id', 'image_entity_id', targets)
  return withItemReferences(response, kind, references)
}

async function attachDirectReferences(supabase, response) {
  const kind = directSupportKind(response?.path || [])
  if (!kind || response?.kind !== 'answer' || !response?.items?.length) return response

  if (kind === 'brotherhood_images') return attachBrotherhoodImages(supabase, response, kind)
  if (kind === 'brotherhood_steps') return attachBrotherhoodSteps(supabase, response, kind)
  if (kind === 'step_personnel_agent') return attachPersonnelByAgent(supabase, response, kind)
  if (kind === 'step_personnel_step') return attachPersonnelByStep(supabase, response, kind)
  if (kind === 'music_brotherhood') return attachMusicByBrotherhood(supabase, response, kind)
  if (kind === 'music_band') return attachMusicByBand(supabase, response, kind)
  if (kind === 'image_authorships') return attachImageAuthorships(supabase, response, kind)
  if (kind === 'image_restorations') return attachImageRestorations(supabase, response, kind)
  return response
}

export async function askHiloCofradeV9(question, context = null) {
  const response = await askHiloCofradeV8(question, context)
  if (response?.kind !== 'answer') return response

  try {
    const supabase = await createClient()
    return await attachDirectReferences(supabase, response)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron resolver fuentes exactas de la respuesta', {
      error: error instanceof Error ? error.message : String(error),
    })
    return response
  }
}
