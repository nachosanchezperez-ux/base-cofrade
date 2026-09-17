import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  marchRelationEntityScore,
  marchRelationsV3Intent,
  marchUsageKey,
} from '@/lib/tira-march-relations-v3'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band', 'march'])
const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / profesional',
}

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  return ''
}

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: TYPE_LABELS[entity.entity_type] || 'Entidad',
    name: entity.name,
    href: entityHref(entity),
    meta,
  }
}

function contextFor({ root = null, entities = [], sourceIntent = '' } = {}) {
  const resultType = entities[0]?.entity_type || ''
  const entityIds = [...new Set(entities
    .filter((entity) => entity?.id && entity.entity_type === resultType)
    .map((entity) => entity.id))]
    .slice(0, 12)
  return {
    entityId: root?.id || null,
    entityType: root?.entity_type || null,
    name: root?.name || '',
    ...(resultType && entityIds.length ? {
      resultSet: {
        entityType: resultType,
        entityIds,
        count: entityIds.length,
        label: `${entityIds.length} ${TYPE_LABELS[resultType] || 'entidades'}`,
        sourceIntent,
      },
    } : {}),
  }
}

function answer({ text, path, entities = [], items = [], links = [], evidence = [], followUps = [], context = null, compactItemLimit = 6 }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    links,
    evidence,
    references: [],
    followUps,
    context,
    compactItemLimit,
  }
}

function notDocumented(text, context = null) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: [],
    items: [],
    links: [],
    evidence: [],
    references: [],
    followUps: [],
    context,
  }
}

async function entitiesByIds(supabase, ids = [], entityType = '') {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  let query = supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('status', 'published')
    .in('id', unique)
  if (entityType) query = query.eq('entity_type', entityType)
  const result = await query
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

async function resolveEntity(supabase, question, entityType, context = null) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', entityType)
    .eq('status', 'published')
  if (result.error) throw result.error

  const ranked = (result.data || [])
    .map((entity) => ({ entity, score: marchRelationEntityScore(entity.name, question) }))
    .filter(({ score }) => score >= 300)
    .sort((first, second) => second.score - first.score || second.entity.name.length - first.entity.name.length)
  if (ranked[0]) return ranked[0].entity

  if (context?.entityId && context.entityType === entityType) {
    return (result.data || []).find((entity) => entity.id === context.entityId) || null
  }
  return null
}

async function loadMarchUsages(supabase, marchIds = []) {
  const ids = [...new Set(marchIds.filter(Boolean))]
  if (!ids.length) return []

  const entriesResult = await supabase
    .from('musical_repertoire_entries')
    .select('repertoire_id, march_entity_id, display_title, performance_count, display_order')
    .in('march_entity_id', ids)
  if (entriesResult.error) throw entriesResult.error
  const entries = entriesResult.data || []
  const repertoireIds = [...new Set(entries.map((entry) => entry.repertoire_id).filter(Boolean))]
  if (!repertoireIds.length) return []

  const repertoiresResult = await supabase
    .from('musical_repertoires')
    .select('id, slug, outing_id, band_entity_id, step_entity_id, title, repertoire_kind, status')
    .in('id', repertoireIds)
    .eq('status', 'published')
    .eq('repertoire_kind', 'performed')
  if (repertoiresResult.error) throw repertoiresResult.error
  const repertoires = repertoiresResult.data || []
  const repertoireById = new Map(repertoires.map((row) => [row.id, row]))
  const outingIds = [...new Set(repertoires.map((row) => row.outing_id).filter(Boolean))]

  const outingsResult = outingIds.length
    ? await supabase
        .from('outings')
        .select('id, brotherhood_entity_id, title, outing_type, outing_date, year, status')
        .in('id', outingIds)
        .eq('status', 'published')
    : { data: [], error: null }
  if (outingsResult.error) throw outingsResult.error
  const outings = outingsResult.data || []
  const outingById = new Map(outings.map((row) => [row.id, row]))

  const entityIds = [...new Set([
    ...ids,
    ...repertoires.map((row) => row.band_entity_id),
    ...repertoires.map((row) => row.step_entity_id),
    ...outings.map((row) => row.brotherhood_entity_id),
  ].filter(Boolean))]
  const entities = await entitiesByIds(supabase, entityIds)
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  const seen = new Set()
  return entries
    .map((entry) => {
      const repertoire = repertoireById.get(entry.repertoire_id)
      if (!repertoire) return null
      const outing = outingById.get(repertoire.outing_id) || null
      return {
        ...entry,
        repertoire,
        outing,
        march: entityById.get(entry.march_entity_id) || null,
        band: entityById.get(repertoire.band_entity_id) || null,
        step: entityById.get(repertoire.step_entity_id) || null,
        brotherhood: entityById.get(outing?.brotherhood_entity_id) || null,
      }
    })
    .filter(Boolean)
    .filter((row) => {
      const key = marchUsageKey(row)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((first, second) => {
      const firstYear = Number(first.outing?.year || String(first.outing?.outing_date || '').slice(0, 4)) || 0
      const secondYear = Number(second.outing?.year || String(second.outing?.outing_date || '').slice(0, 4)) || 0
      return secondYear - firstYear
        || Number(first.display_order || 0) - Number(second.display_order || 0)
        || String(first.repertoire.title || '').localeCompare(String(second.repertoire.title || ''), 'es')
    })
}

function usageMeta(row, { includeMarch = false } = {}) {
  const year = row.outing?.year || String(row.outing?.outing_date || '').slice(0, 4)
  return [
    includeMarch ? row.march?.name : '',
    row.brotherhood?.name,
    row.band?.name,
    row.step?.name,
    row.outing?.outing_type,
    year,
    row.performance_count > 1 ? `${row.performance_count} interpretaciones` : '',
  ].filter(Boolean).join(' · ')
}

function repertoireHref(row) {
  return row?.repertoire?.slug ? `/crucetas-musicales/${row.repertoire.slug}` : ''
}

async function marchRepertoires(supabase, question, context) {
  const march = await resolveEntity(supabase, question, 'march', context)
  if (!march) return null
  const usages = await loadMarchUsages(supabase, [march.id])
  if (!usages.length) {
    return notDocumented(`«${march.name}» no aparece todavía en una cruceta musical publicada de Hilo Cofrade.`, contextFor({ root: march }))
  }

  const repertoireCount = new Set(usages.map((row) => row.repertoire.id)).size
  const bands = [...new Map(usages.filter((row) => row.band).map((row) => [row.band.id, row.band])).values()]
  return answer({
    text: `«${march.name}» aparece en ${repertoireCount} ${repertoireCount === 1 ? 'cruceta musical publicada' : 'crucetas musicales publicadas'} de Hilo Cofrade.`,
    path: ['Marcha', 'Crucetas musicales', 'Apariciones'],
    entities: [publicEntity(march), ...bands.map((band) => publicEntity(band))],
    items: usages.map((row) => ({
      label: row.repertoire.title || row.outing?.title || 'Cruceta musical',
      meta: usageMeta(row),
      href: repertoireHref(row),
    })),
    links: [{ label: `Abrir la ficha de «${march.name}»`, href: entityHref(march) }],
    evidence: [{
      key: `march-repertoires-${march.id}`,
      label: 'Apariciones en crucetas publicadas',
      detail: `${repertoireCount} cruceta${repertoireCount === 1 ? '' : 's'} · ${bands.length} banda${bands.length === 1 ? '' : 's'}`,
    }],
    followUps: ['¿Qué bandas la han interpretado?', '¿Quién la compuso?', '¿A quién está dedicada?'],
    context: contextFor({ root: march }),
    compactItemLimit: Math.min(Math.max(usages.length, 3), 10),
  })
}

async function marchBands(supabase, question, context) {
  const march = await resolveEntity(supabase, question, 'march', context)
  if (!march) return null
  const usages = await loadMarchUsages(supabase, [march.id])

  const [recordingsResult, tracksResult] = await Promise.all([
    supabase
      .from('march_recordings')
      .select('id, band_entity_id, recording_date_text, title, is_featured, status')
      .eq('march_entity_id', march.id)
      .eq('status', 'published'),
    supabase
      .from('band_release_tracks')
      .select('id, release_id, march_entity_id, title, spotify_url')
      .eq('march_entity_id', march.id),
  ])
  if (recordingsResult.error) throw recordingsResult.error
  if (tracksResult.error) throw tracksResult.error
  const recordings = recordingsResult.data || []
  const tracks = tracksResult.data || []
  const releaseIds = [...new Set(tracks.map((row) => row.release_id).filter(Boolean))]
  const releasesResult = releaseIds.length
    ? await supabase
        .from('band_releases')
        .select('id, band_entity_id, title, release_year, status')
        .in('id', releaseIds)
        .eq('status', 'published')
    : { data: [], error: null }
  if (releasesResult.error) throw releasesResult.error
  const releases = releasesResult.data || []
  const releaseById = new Map(releases.map((row) => [row.id, row]))

  const bandIds = [...new Set([
    ...usages.map((row) => row.band?.id),
    ...recordings.map((row) => row.band_entity_id),
    ...releases.map((row) => row.band_entity_id),
  ].filter(Boolean))]
  const bands = await entitiesByIds(supabase, bandIds, 'band')
  const bandById = new Map(bands.map((band) => [band.id, band]))
  const evidenceByBand = new Map(bandIds.map((id) => [id, []]))

  usages.forEach((row) => {
    if (!row.band?.id) return
    const evidence = evidenceByBand.get(row.band.id) || []
    evidence.push(`Cruceta: ${row.brotherhood?.name || row.repertoire.title}${row.outing?.year ? ` · ${row.outing.year}` : ''}`)
    evidenceByBand.set(row.band.id, evidence)
  })
  recordings.forEach((row) => {
    if (!row.band_entity_id) return
    const evidence = evidenceByBand.get(row.band_entity_id) || []
    evidence.push(['Grabación publicada', row.recording_date_text, row.title].filter(Boolean).join(' · '))
    evidenceByBand.set(row.band_entity_id, evidence)
  })
  tracks.forEach((row) => {
    const release = releaseById.get(row.release_id)
    if (!release?.band_entity_id) return
    const evidence = evidenceByBand.get(release.band_entity_id) || []
    evidence.push(['Discografía', release.title, release.release_year].filter(Boolean).join(' · '))
    evidenceByBand.set(release.band_entity_id, evidence)
  })

  const documented = bands.filter((band) => (evidenceByBand.get(band.id) || []).length)
  if (!documented.length) {
    return notDocumented(`No hay todavía una banda documentada interpretando o grabando «${march.name}» en las capas públicas disponibles.`, contextFor({ root: march }))
  }

  return answer({
    text: `Hilo Cofrade documenta ${documented.length} ${documented.length === 1 ? 'banda' : 'bandas'} interpretando o grabando «${march.name}» mediante crucetas, grabaciones o discografía publicadas.`,
    path: ['Marcha', 'Interpretaciones documentadas', 'Bandas'],
    entities: [publicEntity(march), ...documented.map((band) => publicEntity(band))],
    items: documented.map((band) => ({
      label: band.name,
      meta: (evidenceByBand.get(band.id) || []).join(' / '),
      href: entityHref(band),
    })),
    followUps: ['¿En qué crucetas aparece?', '¿Quién la compuso?', '¿A quién está dedicada?'],
    context: contextFor({ root: march, entities: documented, sourceIntent: 'march_documented_bands' }),
    compactItemLimit: Math.min(Math.max(documented.length, 3), 10),
  })
}

async function marchDedications(supabase, question, context) {
  const march = await resolveEntity(supabase, question, 'march', context)
  if (!march) return null
  const result = await supabase
    .from('march_dedications')
    .select('dedicatee_entity_id, dedication_type, dedication_text, date_from_text, notes')
    .eq('march_entity_id', march.id)
    .eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) {
    return notDocumented(`«${march.name}» no tiene todavía una dedicatoria estructurada publicada en Hilo Cofrade. No la infiero por el título de la obra.`, contextFor({ root: march }))
  }

  const dedicatees = await entitiesByIds(supabase, rows.map((row) => row.dedicatee_entity_id))
  const byId = new Map(dedicatees.map((entity) => [entity.id, entity]))
  return answer({
    text: `«${march.name}» tiene ${rows.length} ${rows.length === 1 ? 'dedicatoria publicada' : 'dedicatorias publicadas'} en Hilo Cofrade.`,
    path: ['Marcha', 'Dedicatorias', 'Entidades relacionadas'],
    entities: [publicEntity(march), ...dedicatees.map((entity) => publicEntity(entity))],
    items: rows.map((row) => {
      const dedicatee = byId.get(row.dedicatee_entity_id)
      return {
        label: dedicatee?.name || row.dedication_text || 'Dedicatoria documentada',
        meta: [row.dedication_type, row.dedication_text, row.date_from_text].filter(Boolean).join(' · '),
        href: entityHref(dedicatee),
      }
    }),
    followUps: ['¿Quién la compuso?', '¿En qué crucetas aparece?', '¿Qué bandas la han interpretado?'],
    context: contextFor({ root: march }),
  })
}

async function composerAgentsForMarch(supabase, marchId) {
  const result = await supabase
    .from('march_authors')
    .select('agent_entity_id, author_role')
    .eq('march_entity_id', marchId)
    .eq('status', 'published')
  if (result.error) throw result.error
  const composerIds = (result.data || [])
    .filter((row) => row.author_role === 'composer')
    .map((row) => row.agent_entity_id)
  const fallbackIds = (result.data || []).map((row) => row.agent_entity_id)
  return entitiesByIds(supabase, composerIds.length ? composerIds : fallbackIds, 'agent')
}

async function repertoireMarchesForAgent(supabase, agent, { excludeMarchId = '' } = {}) {
  const authorsResult = await supabase
    .from('march_authors')
    .select('march_entity_id, author_role')
    .eq('agent_entity_id', agent.id)
    .eq('status', 'published')
  if (authorsResult.error) throw authorsResult.error
  const composerRows = (authorsResult.data || []).filter((row) => row.author_role === 'composer')
  const rows = composerRows.length ? composerRows : (authorsResult.data || [])
  const marchIds = [...new Set(rows.map((row) => row.march_entity_id).filter((id) => id && id !== excludeMarchId))]
  const marches = await entitiesByIds(supabase, marchIds, 'march')
  const publicIds = new Set(marches.map((march) => march.id))
  const usages = await loadMarchUsages(supabase, marchIds)
  return {
    marches: marches.filter((march) => usages.some((usage) => usage.march_entity_id === march.id)),
    usages: usages.filter((usage) => publicIds.has(usage.march_entity_id)),
  }
}

async function agentRepertoireMarches(supabase, question, context, { groupByRepertoire = false } = {}) {
  const agent = await resolveEntity(supabase, question, 'agent', context)
  if (!agent) return null
  const { marches, usages } = await repertoireMarchesForAgent(supabase, agent)
  if (!usages.length) {
    return notDocumented(`${agent.name} no tiene todavía marchas vinculadas a crucetas musicales publicadas en Hilo Cofrade.`, contextFor({ root: agent }))
  }

  const repertoireMap = new Map()
  usages.forEach((row) => {
    const current = repertoireMap.get(row.repertoire.id) || { row, marchIds: new Set() }
    current.marchIds.add(row.march_entity_id)
    repertoireMap.set(row.repertoire.id, current)
  })
  const repertoireCount = repertoireMap.size

  if (groupByRepertoire) {
    const grouped = [...repertoireMap.values()]
    return answer({
      text: `${agent.name} tiene ${marches.length} ${marches.length === 1 ? 'marcha' : 'marchas'} presentes en ${repertoireCount} ${repertoireCount === 1 ? 'cruceta musical publicada' : 'crucetas musicales publicadas'}.`,
      path: ['Autor / compositor', 'Marchas', 'Crucetas musicales'],
      entities: [publicEntity(agent), ...marches.slice(0, 12).map((march) => publicEntity(march))],
      items: grouped.map(({ row, marchIds }) => ({
        label: row.repertoire.title || row.outing?.title || 'Cruceta musical',
        meta: [`${marchIds.size} ${marchIds.size === 1 ? 'obra' : 'obras'} de ${agent.name}`, row.brotherhood?.name, row.band?.name, row.outing?.year].filter(Boolean).join(' · '),
        href: repertoireHref(row),
      })),
      followUps: marches[0] ? [`¿En qué crucetas aparece ${marches[0].name}?`, '¿Qué tienen en común estas marchas?'] : [],
      context: contextFor({ root: agent, entities: marches, sourceIntent: 'agent_repertoire_marches' }),
      compactItemLimit: Math.min(Math.max(grouped.length, 4), 10),
    })
  }

  return answer({
    text: `${agent.name} tiene ${marches.length} ${marches.length === 1 ? 'marcha publicada' : 'marchas publicadas'} que aparecen en ${repertoireCount} ${repertoireCount === 1 ? 'cruceta musical' : 'crucetas musicales'} de Hilo Cofrade.`,
    path: ['Autor / compositor', 'Marchas', 'Apariciones en crucetas'],
    entities: [publicEntity(agent), ...marches.slice(0, 12).map((march) => publicEntity(march))],
    items: usages.map((row) => ({
      label: row.march?.name || row.display_title || 'Marcha',
      meta: [row.repertoire.title, row.brotherhood?.name, row.band?.name, row.outing?.year].filter(Boolean).join(' · '),
      href: entityHref(row.march) || repertoireHref(row),
      group: row.repertoire.title,
    })),
    links: [...repertoireMap.values()].slice(0, 6).map(({ row }) => ({
      label: `Abrir ${row.repertoire.title || 'cruceta'}`,
      href: repertoireHref(row),
    })),
    followUps: marches[0] ? [`¿En qué crucetas aparece ${marches[0].name}?`, '¿Quién compuso estas marchas?', 'Compáralas.'] : [],
    context: contextFor({ root: agent, entities: marches, sourceIntent: 'agent_repertoire_marches' }),
    compactItemLimit: 10,
  })
}

async function sameAuthorRepertoireMarches(supabase, question, context) {
  const march = await resolveEntity(supabase, question, 'march', context)
  if (!march) return null
  const composers = await composerAgentsForMarch(supabase, march.id)
  if (!composers.length) {
    return notDocumented(`No hay un compositor estructurado publicado para «${march.name}», así que no puedo buscar otras obras del mismo autor con seguridad.`, contextFor({ root: march }))
  }

  const collections = await Promise.all(composers.map(async (agent) => ({
    agent,
    ...(await repertoireMarchesForAgent(supabase, agent, { excludeMarchId: march.id })),
  })))
  const usages = collections.flatMap((collection) => collection.usages)
  const marches = [...new Map(collections.flatMap((collection) => collection.marches).map((item) => [item.id, item])).values()]
  if (!usages.length) {
    return notDocumented(`No hay otras marchas de ${composers.map((agent) => agent.name).join(' y ')} vinculadas a crucetas publicadas, aparte de «${march.name}».`, contextFor({ root: march }))
  }

  return answer({
    text: `He encontrado ${marches.length} ${marches.length === 1 ? 'marcha distinta' : 'marchas distintas'} de ${composers.map((agent) => agent.name).join(' y ')} en crucetas publicadas, sin contar «${march.name}».`,
    path: ['Marcha', 'Compositor', 'Otras obras', 'Crucetas musicales'],
    entities: [publicEntity(march), ...composers.map((agent) => publicEntity(agent)), ...marches.slice(0, 12).map((item) => publicEntity(item))],
    items: usages.map((row) => ({
      label: row.march?.name || row.display_title || 'Marcha',
      meta: [row.repertoire.title, row.brotherhood?.name, row.band?.name, row.outing?.year].filter(Boolean).join(' · '),
      href: entityHref(row.march) || repertoireHref(row),
    })),
    followUps: marches[0] ? [`¿En qué crucetas aparece ${marches[0].name}?`, '¿Qué tienen en común estas marchas?', 'Compáralas.'] : [],
    context: contextFor({ root: composers.length === 1 ? composers[0] : march, entities: marches, sourceIntent: 'same_author_repertoire_marches' }),
    compactItemLimit: 10,
  })
}

export async function askHiloCofradeMarchRelationsV3(question, context = null) {
  const intent = marchRelationsV3Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()

  try {
    if (intent.kind === 'march_repertoires') return await marchRepertoires(supabase, question, context)
    if (intent.kind === 'march_bands') return await marchBands(supabase, question, context)
    if (intent.kind === 'march_dedications') return await marchDedications(supabase, question, context)
    if (intent.kind === 'agent_repertoire_marches') return await agentRepertoireMarches(supabase, question, context)
    if (intent.kind === 'agent_repertoires') return await agentRepertoireMarches(supabase, question, context, { groupByRepertoire: true })
    if (intent.kind === 'same_author_repertoire_marches') return await sameAuthorRepertoireMarches(supabase, question, context)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en relaciones musicales de Marchas V3', {
      question: String(question || '').slice(0, 320),
      intent: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
