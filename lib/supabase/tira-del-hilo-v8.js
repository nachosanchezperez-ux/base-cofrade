import 'server-only'

import { askHiloCofradeV7 } from '@/lib/supabase/tira-del-hilo-v7'
import { createClient } from '@/lib/supabase/server'
import { rankTiraReferences } from '@/lib/tira-references'
import { relationSupportCandidate, splitGraphEdgeLabel } from '@/lib/tira-relation-references'

function isGraphPathResponse(response = {}) {
  return response?.kind === 'answer'
    && /^He encontrado un camino documentado/i.test(String(response.answer || ''))
    && Array.isArray(response.items)
    && response.items.length > 0
}

function entityByName(response = {}) {
  return new Map((response.entities || []).map((entity) => [entity.name, entity]))
}

async function relationIdsForCandidate(supabase, candidate) {
  const values = candidate?.values || {}
  let query

  if (candidate.kind === 'brotherhood_step') {
    query = supabase
      .from('brotherhood_steps')
      .select('id')
      .eq('brotherhood_entity_id', values.brotherhoodId)
      .eq('step_entity_id', values.stepId)
      .eq('status', 'published')
  } else if (candidate.kind === 'brotherhood_image') {
    query = supabase
      .from('brotherhood_images')
      .select('id')
      .eq('brotherhood_entity_id', values.brotherhoodId)
      .eq('image_entity_id', values.imageId)
      .eq('status', 'published')
  } else if (candidate.kind === 'image_step') {
    query = supabase
      .from('image_steps')
      .select('id')
      .eq('image_entity_id', values.imageId)
      .eq('step_entity_id', values.stepId)
      .eq('status', 'published')
  } else if (candidate.kind === 'step_personnel') {
    query = supabase
      .from('step_personnel_periods')
      .select('id')
      .eq('step_entity_id', values.stepId)
      .eq('agent_entity_id', values.agentId)
      .eq('status', 'published')
      .eq('is_current', true)
  } else if (candidate.kind === 'music_period_brotherhood') {
    query = supabase
      .from('music_accompaniment_periods')
      .select('id')
      .eq('brotherhood_entity_id', values.brotherhoodId)
      .eq('band_entity_id', values.bandId)
      .eq('status', 'published')
      .eq('is_current', true)
  } else if (candidate.kind === 'music_period_step') {
    query = supabase
      .from('music_accompaniment_periods')
      .select('id')
      .eq('step_entity_id', values.stepId)
      .eq('band_entity_id', values.bandId)
      .eq('status', 'published')
      .eq('is_current', true)
  } else if (candidate.kind === 'image_authorship') {
    query = supabase
      .from('image_authorships')
      .select('id')
      .eq('image_entity_id', values.imageId)
      .eq('agent_entity_id', values.agentId)
      .eq('status', 'published')
  } else if (candidate.kind === 'march_dedication') {
    query = supabase
      .from('march_dedications')
      .select('id')
      .eq('march_entity_id', values.marchId)
      .eq('dedicatee_entity_id', values.dedicateeId)
      .eq('status', 'published')
  } else {
    return []
  }

  const result = await query
  if (result.error) throw result.error
  return (result.data || []).map((row) => row.id).filter(Boolean)
}

async function resolveSupports(supabase, response) {
  const byName = entityByName(response)
  const supports = []

  for (let index = 0; index < response.items.length; index += 1) {
    const item = response.items[index]
    const edge = splitGraphEdgeLabel(item.label)
    if (!edge) continue
    const from = byName.get(edge.fromName)
    const to = byName.get(edge.toName)
    if (!from || !to) continue

    const candidate = relationSupportCandidate(from, to, item.meta || '')
    if (!candidate) continue
    const relationIds = await relationIdsForCandidate(supabase, candidate)
    if (!relationIds.length) continue

    supports.push({
      index,
      candidate,
      relationIds,
    })
  }

  return supports
}

async function sourceLinksForSupports(supabase, supports) {
  const grouped = new Map()
  for (const support of supports) {
    const column = support.candidate.sourceLinkColumn
    const ids = grouped.get(column) || new Set()
    support.relationIds.forEach((id) => ids.add(id))
    grouped.set(column, ids)
  }

  const rows = []
  for (const [column, idSet] of grouped.entries()) {
    const ids = [...idSet]
    const result = await supabase
      .from('source_links')
      .select(`source_id, ${column}, scope`)
      .in(column, ids)
    if (result.error) throw result.error
    for (const row of result.data || []) {
      rows.push({
        source_id: row.source_id,
        relationId: row[column],
        scope: row.scope,
        sourceLinkColumn: column,
      })
    }
  }
  return rows
}

async function attachExactRelationReferences(supabase, response) {
  if (!isGraphPathResponse(response)) return response

  const supports = await resolveSupports(supabase, response)
  if (!supports.length) return response

  const links = await sourceLinksForSupports(supabase, supports)
  const sourceIds = [...new Set(links.map((row) => row.source_id).filter(Boolean))]
  if (!sourceIds.length) return response

  const sourceResult = await supabase
    .from('sources')
    .select('id, name, url, source_type, author_or_publisher, publication_date')
    .in('id', sourceIds)
  if (sourceResult.error) throw sourceResult.error
  const sources = sourceResult.data || []

  let exactCount = 0
  const items = response.items.map((item, index) => {
    const support = supports.find((entry) => entry.index === index)
    if (!support) return item

    const relevantLinks = links
      .filter((link) => link.sourceLinkColumn === support.candidate.sourceLinkColumn)
      .filter((link) => support.relationIds.includes(link.relationId))
      .map((link) => ({ ...link, entity_id: `${support.index}` }))
    if (!relevantLinks.length) return item

    const references = rankTiraReferences(sources, relevantLinks, 2)
    if (!references.length) return item
    exactCount += references.length
    return {
      ...item,
      relationReferences: references,
      relationReferenceLabel: 'Fuente de esta relación',
    }
  })

  if (!exactCount) return response
  return {
    ...response,
    items,
    exactRelationReferenceCount: exactCount,
    relationReferencesNote: 'Estas fuentes están enlazadas directamente al registro de la relación utilizada en este salto del camino.',
  }
}

export async function askHiloCofradeV8(question, context = null) {
  const response = await askHiloCofradeV7(question, context)
  if (!isGraphPathResponse(response)) return response

  try {
    const supabase = await createClient()
    return await attachExactRelationReferences(supabase, response)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron resolver fuentes exactas del camino', {
      error: error instanceof Error ? error.message : String(error),
    })
    return response
  }
}
