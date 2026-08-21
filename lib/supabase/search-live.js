import 'server-only'

import { createClient } from '@/lib/supabase/server'

const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / profesional',
  event: 'Acontecimiento',
  heritage_asset: 'Patrimonio',
  advocation: 'Advocación',
}

const SEARCHABLE_TYPES = Object.keys(TYPE_LABELS)
const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compact(value = '', max = 96) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function rankText(value, term) {
  const text = normalize(value)
  const query = normalize(term)
  if (!text || !query) return 0
  if (text === query) return 1200
  if (text.startsWith(query)) return 1000
  if (text.includes(query)) return 820

  const tokens = query.split(' ').filter((token) => token.length > 2)
  const overlap = tokens.filter((token) => text.includes(token)).length
  return overlap ? overlap * 90 : 0
}

async function publicEntitiesByIds(supabase, ids) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .in('entity_type', SEARCHABLE_TYPES)
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

function mapById(rows, key = 'entity_id') {
  return new Map((rows || []).map((row) => [row[key], row]))
}

export async function searchHiloEntities(rawTerm, requestedLimit = 8) {
  const term = String(rawTerm || '').trim().slice(0, 80)
  if (term.length < 2) return []

  const limit = Math.max(1, Math.min(Number(requestedLimit) || 8, 10))
  const supabase = await createClient()
  const pattern = `%${term}%`
  const candidateLimit = Math.max(18, limit * 3)

  const [nameResult, summaryResult, brotherhoodPopularResult, brotherhoodOfficialResult, bandNameResult, bandShortNameResult] = await Promise.all([
    supabase.from('entities').select('id, entity_type, name, slug, summary').in('entity_type', SEARCHABLE_TYPES).eq('status', 'published').ilike('name', pattern).limit(candidateLimit),
    supabase.from('entities').select('id, entity_type, name, slug, summary').in('entity_type', SEARCHABLE_TYPES).eq('status', 'published').ilike('summary', pattern).limit(candidateLimit),
    supabase.from('brotherhoods').select('entity_id, popular_name').ilike('popular_name', pattern).limit(candidateLimit),
    supabase.from('brotherhoods').select('entity_id, official_name').ilike('official_name', pattern).limit(candidateLimit),
    supabase.from('band_names').select('band_entity_id, name').ilike('name', pattern).limit(candidateLimit),
    supabase.from('band_names').select('band_entity_id, short_name').ilike('short_name', pattern).limit(candidateLimit),
  ])

  const failures = [nameResult, summaryResult, brotherhoodPopularResult, brotherhoodOfficialResult, bandNameResult, bandShortNameResult].find((result) => result.error)
  if (failures?.error) throw failures.error

  const directEntities = [...(nameResult.data || []), ...(summaryResult.data || [])]
  const aliasScore = new Map()
  const aliasIds = []

  ;[
    ...(brotherhoodPopularResult.data || []).map((row) => ({ id: row.entity_id, value: row.popular_name })),
    ...(brotherhoodOfficialResult.data || []).map((row) => ({ id: row.entity_id, value: row.official_name })),
    ...(bandNameResult.data || []).map((row) => ({ id: row.band_entity_id, value: row.name })),
    ...(bandShortNameResult.data || []).map((row) => ({ id: row.band_entity_id, value: row.short_name })),
  ].forEach(({ id, value }) => {
    if (!id) return
    aliasIds.push(id)
    aliasScore.set(id, Math.max(aliasScore.get(id) || 0, rankText(value, term) + 80))
  })

  const directById = new Map(directEntities.map((entity) => [entity.id, entity]))
  const missingAliasIds = [...new Set(aliasIds)].filter((id) => !directById.has(id))
  const aliasEntities = await publicEntitiesByIds(supabase, missingAliasIds)
  const candidates = [...directById.values(), ...aliasEntities]
  if (!candidates.length) return []

  const candidateIds = candidates.map((entity) => entity.id)
  const imageIds = candidates.filter((entity) => entity.entity_type === 'image').map((entity) => entity.id)
  const stepIds = candidates.filter((entity) => entity.entity_type === 'step').map((entity) => entity.id)
  const agentIds = candidates.filter((entity) => entity.entity_type === 'agent').map((entity) => entity.id)
  const marchIds = candidates.filter((entity) => entity.entity_type === 'march').map((entity) => entity.id)
  const brotherhoodIds = candidates.filter((entity) => entity.entity_type === 'brotherhood').map((entity) => entity.id)
  const bandIds = candidates.filter((entity) => entity.entity_type === 'band').map((entity) => entity.id)

  const [brotherhoodRowsResult, bandRowsResult, imageRowsResult, stepRowsResult, disciplineResult, marchAuthorsResult] = await Promise.all([
    brotherhoodIds.length
      ? supabase.from('brotherhoods').select('entity_id, popular_name, municipality_id, current_procession_day, brotherhood_types').in('entity_id', brotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
    bandIds.length
      ? supabase.from('bands').select('entity_id, band_type, municipality_id').in('entity_id', bandIds)
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase.from('images').select('entity_id, image_type, execution_date, execution_date_text').in('entity_id', imageIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase.from('steps').select('entity_id, step_type, execution_date_text').in('entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
    agentIds.length
      ? supabase.from('agent_disciplines').select('agent_entity_id, discipline, is_primary').in('agent_entity_id', agentIds)
      : Promise.resolve({ data: [], error: null }),
    marchIds.length
      ? supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').in('march_entity_id', marchIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])

  const enrichmentFailure = [brotherhoodRowsResult, bandRowsResult, imageRowsResult, stepRowsResult, disciplineResult, marchAuthorsResult].find((result) => result.error)
  if (enrichmentFailure?.error) throw enrichmentFailure.error

  const brotherhoodRows = brotherhoodRowsResult.data || []
  const bandRows = bandRowsResult.data || []
  const imageRows = imageRowsResult.data || []
  const stepRows = stepRowsResult.data || []
  const disciplines = disciplineResult.data || []
  const marchAuthors = marchAuthorsResult.data || []

  const municipalityIds = [...new Set([
    ...brotherhoodRows.map((row) => row.municipality_id),
    ...bandRows.map((row) => row.municipality_id),
  ].filter(Boolean))]
  const authorIds = [...new Set(marchAuthors.map((row) => row.agent_entity_id).filter(Boolean))]

  const [municipalityResult, authorResult] = await Promise.all([
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name').in('id', municipalityIds)
      : Promise.resolve({ data: [], error: null }),
    authorIds.length
      ? supabase.from('entities').select('id, name').in('id', authorIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])
  if (municipalityResult.error) throw municipalityResult.error
  if (authorResult.error) throw authorResult.error

  const brotherhoodById = mapById(brotherhoodRows)
  const bandById = mapById(bandRows)
  const imageById = mapById(imageRows)
  const stepById = mapById(stepRows)
  const municipalityById = new Map((municipalityResult.data || []).map((row) => [row.id, row.name]))
  const authorById = new Map((authorResult.data || []).map((row) => [row.id, row.name]))

  const disciplinesByAgent = disciplines.reduce((map, row) => {
    const values = map.get(row.agent_entity_id) || []
    if (row.discipline) values.push({ value: row.discipline, primary: row.is_primary })
    map.set(row.agent_entity_id, values)
    return map
  }, new Map())

  const authorsByMarch = marchAuthors.reduce((map, row) => {
    const values = map.get(row.march_entity_id) || []
    const name = authorById.get(row.agent_entity_id)
    if (name) values.push({ name, role: row.author_role })
    map.set(row.march_entity_id, values)
    return map
  }, new Map())

  return candidates
    .map((entity) => {
      let title = entity.name
      let subtitle = compact(entity.summary, 88) || TYPE_LABELS[entity.entity_type] || 'Entidad documentada'

      if (entity.entity_type === 'brotherhood') {
        const row = brotherhoodById.get(entity.id) || {}
        title = row.popular_name || entity.name
        subtitle = [municipalityById.get(row.municipality_id), row.current_procession_day, ...(row.brotherhood_types || [])].filter(Boolean).join(' · ')
      } else if (entity.entity_type === 'band') {
        const row = bandById.get(entity.id) || {}
        subtitle = [row.band_type, municipalityById.get(row.municipality_id)].filter(Boolean).join(' · ')
      } else if (entity.entity_type === 'image') {
        const row = imageById.get(entity.id) || {}
        subtitle = [row.image_type || 'Imagen', row.execution_date_text || row.execution_date].filter(Boolean).join(' · ')
      } else if (entity.entity_type === 'step') {
        const row = stepById.get(entity.id) || {}
        subtitle = [row.step_type || 'Paso', row.execution_date_text].filter(Boolean).join(' · ')
      } else if (entity.entity_type === 'agent') {
        const values = [...(disciplinesByAgent.get(entity.id) || [])]
          .sort((a, b) => Number(b.primary) - Number(a.primary))
          .map((item) => item.value)
        subtitle = values.length ? values.slice(0, 3).join(' · ') : 'Autor, artista o profesional'
      } else if (entity.entity_type === 'march') {
        const authors = authorsByMarch.get(entity.id) || []
        const composer = authors.find((item) => item.role === 'composer') || authors[0]
        subtitle = composer?.name ? `Composición · ${composer.name}` : 'Composición musical'
      }

      return {
        entityId: entity.id,
        entityType: entity.entity_type,
        type: TYPE_LABELS[entity.entity_type] || 'Entidad',
        title,
        subtitle,
        href: entityHref(entity),
        score: Math.max(rankText(title, term), rankText(entity.name, term), aliasScore.get(entity.id) || 0, rankText(entity.summary, term) - 100),
      }
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
    .slice(0, limit)
    .map(({ score, ...item }) => item)
}
