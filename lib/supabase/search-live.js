import 'server-only'

import { crewEventTypeLabel } from '@/lib/crew-events'
import { resolveHiloMediaReference } from '@/lib/supabase/hilo-media-paths'
import { isPublicEntityPageReady } from '@/lib/supabase/public-entity-page'
import { createPublicClient as createClient } from '@/lib/supabase/public'
import { buildHiloDirectoryItems, parseHiloSearchScope } from '@/lib/hilo-search-scope'
import { normalizeFreeFactText } from '@/lib/tira-free-facts'
import { outingPublicHref } from '@/lib/tira-published-content'
import { selectCandidatesForEnrichment } from '@/lib/search-enrichment-selection'

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
const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band', 'march'])
const PUBLIC_MEDIA_RIGHTS = ['owned', 'authorized', 'licensed', 'public_domain']

async function optionalRows(query, stage, failures = []) {
  try {
    const result = await query
    if (result?.error) {
      failures.push({ stage, code: result.error.code || 'query_failed' })
      return []
    }
    return result?.data || []
  } catch (error) {
    failures.push({ stage, code: error?.name || 'request_failed' })
    return []
  }
}

function reportPartialSearch(failures = []) {
  if (!failures.length) return
  console.warn('[Hilo Cofrade] Autocompletado parcial', {
    stages: [...new Set(failures.map((failure) => failure.stage))],
    codes: [...new Set(failures.map((failure) => failure.code))],
  })
}

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

function entityHref(entity, profile) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'event') {
    return profile?.event_category === 'crew_call' ? `/igualas-y-ensayos/${entity.slug}` : ''
  }
  if (!NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (!isPublicEntityPageReady(entity, profile)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
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

function numericFocus(value, fallback = 50) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function identityVisual(supabase, path, alt) {
  const src = resolveHiloMediaReference(supabase, path)
  if (!src) return null
  return {
    src,
    alt,
    kind: 'identity',
    fit: 'contain',
    focusPosition: '50% 50%',
  }
}

function coverVisual(supabase, media, fallbackAlt) {
  const src = resolveHiloMediaReference(supabase, media?.storage_path)
  if (!src) return null
  const focusX = numericFocus(media?.focus_x)
  const focusY = numericFocus(media?.focus_y)
  return {
    src,
    alt: media?.alt_text || fallbackAlt,
    kind: 'photo',
    fit: media?.fit_mode === 'contain' ? 'contain' : 'cover',
    focusPosition: `${focusX}% ${focusY}%`,
  }
}

async function publicEntitiesByIds(supabase, ids, failures = []) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  return optionalRows(supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary, status')
    .in('id', unique)
    .in('entity_type', SEARCHABLE_TYPES)
    .eq('status', 'published'), 'entities_by_id', failures)
}

function mapById(rows, key = 'entity_id') {
  return new Map((rows || []).map((row) => [row[key], row]))
}

function relatedEntityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  return ''
}

async function searchPublishedContent(supabase, term, candidateLimit, failures = []) {
  const pattern = `%${term}%`
  const [repertoires, outings, cults, updates, premieres] = await Promise.all([
    optionalRows(supabase
      .from('musical_repertoires')
      .select('id, slug, title, notes, outing_id, band_entity_id, step_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit), 'content_repertoires', failures),
    optionalRows(supabase
      .from('outings')
      .select('id, slug, title, outing_type, character, outing_date, year, reason, brotherhood_entity_id, municipality_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit), 'content_outings', failures),
    optionalRows(supabase
      .from('cults')
      .select('id, title, cult_type, cult_date, date_rule, brotherhood_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit), 'content_cults', failures),
    optionalRows(supabase
      .from('heritage_updates')
      .select('id, title, update_type, year, brotherhood_entity_id, target_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit), 'content_heritage', failures),
    optionalRows(supabase
      .from('band_premieres')
      .select('id, title, composer_name, premiere_year, band_entity_id, march_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit), 'content_premieres', failures),
  ])
  const relatedIds = [...new Set([
    ...repertoires.flatMap((item) => [item.band_entity_id, item.step_entity_id]),
    ...outings.map((item) => item.brotherhood_entity_id),
    ...cults.map((item) => item.brotherhood_entity_id),
    ...updates.flatMap((item) => [item.brotherhood_entity_id, item.target_entity_id]),
    ...premieres.flatMap((item) => [item.band_entity_id, item.march_entity_id]),
  ].filter(Boolean))]
  const municipalityIds = [...new Set(outings.map((item) => item.municipality_id).filter(Boolean))]
  const [relatedEntities, municipalities] = await Promise.all([
    relatedIds.length
      ? optionalRows(supabase.from('entities').select('id, entity_type, name, slug, status').in('id', relatedIds).eq('status', 'published'), 'content_entities', failures)
      : Promise.resolve([]),
    municipalityIds.length
      ? optionalRows(supabase.from('municipalities').select('id, name').in('id', municipalityIds), 'content_municipalities', failures)
      : Promise.resolve([]),
  ])
  const entityById = new Map(relatedEntities.map((entity) => [entity.id, entity]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))

  return [
    ...repertoires.map((item) => {
      const band = entityById.get(item.band_entity_id)
      const step = entityById.get(item.step_entity_id)
      return {
        entityId: '', entityType: 'musical_repertoire', type: 'Cruceta musical', title: item.title,
        subtitle: [band?.name, step?.name].filter(Boolean).join(' · '), location: '', descriptor: [band?.name, step?.name].filter(Boolean).join(' · '),
        visual: null, href: item.slug ? `/crucetas-musicales/${item.slug}` : '', score: rankText(item.title, term) + 70,
      }
    }),
    ...outings.map((item) => {
      const brotherhood = entityById.get(item.brotherhood_entity_id)
      const location = municipalityById.get(item.municipality_id) || ''
      return {
        entityId: '', entityType: 'outing', type: item.character === 'extraordinary' ? 'Salida extraordinaria' : item.outing_type || 'Salida', title: item.title,
        subtitle: [brotherhood?.name, item.outing_date || item.year, location].filter(Boolean).join(' · '), location, descriptor: [brotherhood?.name, item.outing_date || item.year].filter(Boolean).join(' · '),
        visual: null, href: outingPublicHref(item, brotherhood?.slug), score: rankText(item.title, term) + 60,
      }
    }),
    ...cults.map((item) => {
      const brotherhood = entityById.get(item.brotherhood_entity_id)
      return {
        entityId: '', entityType: 'cult', type: 'Culto', title: item.title,
        subtitle: [item.cult_type, item.cult_date || item.date_rule, brotherhood?.name].filter(Boolean).join(' · '), location: '', descriptor: [item.cult_type, item.cult_date || item.date_rule, brotherhood?.name].filter(Boolean).join(' · '),
        visual: null, href: brotherhood?.slug ? `/hermandades/${brotherhood.slug}#cultos` : '', score: rankText(item.title, term) + 50,
      }
    }),
    ...updates.map((item) => {
      const brotherhood = entityById.get(item.brotherhood_entity_id)
      const target = entityById.get(item.target_entity_id)
      return {
        entityId: '', entityType: 'heritage_update', type: 'Estreno patrimonial', title: item.title,
        subtitle: [item.update_type, item.year, brotherhood?.name].filter(Boolean).join(' · '), location: '', descriptor: [item.update_type, item.year, brotherhood?.name].filter(Boolean).join(' · '),
        visual: null, href: relatedEntityHref(target) || (brotherhood?.slug ? `/hermandades/${brotherhood.slug}#estrenos` : ''), score: rankText(item.title, term) + 45,
      }
    }),
    ...premieres.map((item) => {
      const band = entityById.get(item.band_entity_id)
      const march = entityById.get(item.march_entity_id)
      return {
        entityId: '', entityType: 'band_premiere', type: 'Estreno musical', title: item.title,
        subtitle: [item.composer_name, item.premiere_year, band?.name].filter(Boolean).join(' · '), location: '', descriptor: [item.composer_name, item.premiere_year, band?.name].filter(Boolean).join(' · '),
        visual: null, href: relatedEntityHref(march) || (band?.slug ? `/bandas/${band.slug}#repertorio` : ''), score: rankText(item.title, term) + 45,
      }
    }),
  ].filter((item) => item.title && item.href)
}

function matchesBrotherhoodType(row, requestedType = '') {
  if (!requestedType) return true
  const expected = normalizeFreeFactText(requestedType)
  return (row.brotherhood_types || []).some((type) => normalizeFreeFactText(type) === expected)
}

async function searchScopedProfiles(supabase, scope, municipalities, candidateLimit, failures = []) {
  if (!scope) return { brotherhoods: [], bands: [] }

  const municipality = municipalities.find((item) => (
    normalizeFreeFactText(item.name) === normalizeFreeFactText(scope.municipality)
  ))
  const profileLimit = Math.max(36, candidateLimit * 4)
  const wantsBrotherhoods = scope.entityGroup !== 'band'
  const wantsBands = scope.entityGroup !== 'brotherhood' && !scope.processionDay

  let brotherhoodQuery = supabase
    .from('brotherhoods')
    .select('entity_id, popular_name, municipality_id, current_procession_day, brotherhood_types, crest_path')
    .limit(profileLimit)
  if (municipality?.id) brotherhoodQuery = brotherhoodQuery.eq('municipality_id', municipality.id)
  if (scope.processionDay) brotherhoodQuery = brotherhoodQuery.ilike('current_procession_day', `%${scope.processionDay}%`)

  let bandQuery = supabase
    .from('bands')
    .select('entity_id, band_type, municipality_id, logo_path')
    .limit(profileLimit)
  if (municipality?.id) bandQuery = bandQuery.eq('municipality_id', municipality.id)

  const [brotherhoods, bands] = await Promise.all([
    wantsBrotherhoods
      ? optionalRows(brotherhoodQuery, 'scope_brotherhoods', failures)
      : Promise.resolve([]),
    wantsBands && scope.municipality
      ? optionalRows(bandQuery, 'scope_bands', failures)
      : Promise.resolve([]),
  ])

  return {
    brotherhoods: brotherhoods.filter((row) => matchesBrotherhoodType(row, scope.brotherhoodType)),
    bands,
  }
}

export async function searchHiloEntities(rawTerm, requestedLimit = 8) {
  const term = String(rawTerm || '').trim().slice(0, 80)
  if (term.length < 2) return []

  const limit = Math.max(1, Math.min(Number(requestedLimit) || 8, 10))
  const supabase = await createClient()
  const pattern = `%${term}%`
  const candidateLimit = Math.max(18, limit * 3)
  const failures = []

  // public.entities is CHECK-constrained to the same nine entity types exposed
  // by TYPE_LABELS/SEARCHABLE_TYPES. Repeating entity_type IN (...) here made
  // Postgres choose entities_type_idx for a non-selective predicate and turned
  // substring searches into hundreds of extra heap-buffer hits.
  const [
    nameRows,
    summaryRows,
    brotherhoodPopularRows,
    brotherhoodOfficialRows,
    bandNameRows,
    bandShortNameRows,
    entityAliasRows,
    imageAliasRows,
    agentAliasRows,
    municipalities,
    publishedContent,
  ] = await Promise.all([
    optionalRows(supabase.from('entities').select('id, entity_type, name, slug, summary, status').eq('status', 'published').ilike('name', pattern).limit(candidateLimit), 'entity_names', failures),
    optionalRows(supabase.from('entities').select('id, entity_type, name, slug, summary, status').eq('status', 'published').ilike('summary', pattern).limit(candidateLimit), 'entity_summaries', failures),
    optionalRows(supabase.from('brotherhoods').select('entity_id, popular_name').ilike('popular_name', pattern).limit(candidateLimit), 'brotherhood_popular_names', failures),
    optionalRows(supabase.from('brotherhoods').select('entity_id, official_name').ilike('official_name', pattern).limit(candidateLimit), 'brotherhood_official_names', failures),
    optionalRows(supabase.from('band_names').select('band_entity_id, name').ilike('name', pattern).limit(candidateLimit), 'band_names', failures),
    optionalRows(supabase.from('band_names').select('band_entity_id, short_name').ilike('short_name', pattern).limit(candidateLimit), 'band_short_names', failures),
    optionalRows(supabase.from('entity_names').select('entity_id, name').eq('status', 'published').ilike('name', pattern).limit(candidateLimit), 'entity_aliases', failures),
    optionalRows(supabase.from('image_names').select('image_entity_id, name').ilike('name', pattern).limit(candidateLimit), 'image_aliases', failures),
    optionalRows(supabase.from('agent_names').select('agent_entity_id, name').ilike('name', pattern).limit(candidateLimit), 'agent_aliases', failures),
    optionalRows(supabase.from('municipalities').select('id, name').order('name'), 'municipalities', failures),
    searchPublishedContent(supabase, term, candidateLimit, failures),
  ])

  const scope = parseHiloSearchScope(term, municipalities.map((item) => item.name))
  const scopedProfiles = await searchScopedProfiles(supabase, scope, municipalities, candidateLimit, failures)
  const directoryItems = buildHiloDirectoryItems(scope, {
    brotherhoodCount: scopedProfiles.brotherhoods.length,
    bandCount: scopedProfiles.bands.length,
  })
  const scopeScore = new Map([
    ...scopedProfiles.brotherhoods.map((row) => [row.entity_id, 1750]),
    ...scopedProfiles.bands.map((row) => [row.entity_id, 1700]),
  ])
  const scopedIds = [...scopeScore.keys()]
  const directEntities = [...nameRows, ...summaryRows]
  const aliasScore = new Map()
  const aliasIds = []

  ;[
    ...brotherhoodPopularRows.map((row) => ({ id: row.entity_id, value: row.popular_name })),
    ...brotherhoodOfficialRows.map((row) => ({ id: row.entity_id, value: row.official_name })),
    ...bandNameRows.map((row) => ({ id: row.band_entity_id, value: row.name })),
    ...bandShortNameRows.map((row) => ({ id: row.band_entity_id, value: row.short_name })),
    ...entityAliasRows.map((row) => ({ id: row.entity_id, value: row.name })),
    ...imageAliasRows.map((row) => ({ id: row.image_entity_id, value: row.name })),
    ...agentAliasRows.map((row) => ({ id: row.agent_entity_id, value: row.name })),
  ].forEach(({ id, value }) => {
    if (!id) return
    aliasIds.push(id)
    aliasScore.set(id, Math.max(aliasScore.get(id) || 0, rankText(value, term) + 80))
  })

  const directById = new Map(directEntities.map((entity) => [entity.id, entity]))
  const missingEntityIds = [...new Set([...aliasIds, ...scopedIds])].filter((id) => !directById.has(id))
  const supplementalEntities = await publicEntitiesByIds(supabase, missingEntityIds, failures)
  const candidates = [...new Map([...directById.values(), ...supplementalEntities].map((entity) => [entity.id, entity])).values()]
  if (!candidates.length) {
    reportPartialSearch(failures)
    return [...directoryItems, ...publishedContent]
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
      .slice(0, limit)
      .map(({ score, ...item }) => item)
  }

  const candidateBaseScoreById = new Map(
    candidates.map((entity) => [
      entity.id,
      Math.max(
        rankText(entity.name, term),
        aliasScore.get(entity.id) || 0,
        scopeScore.get(entity.id) || 0,
        rankText(entity.summary, term) - 100
      ),
    ])
  )
  // El enriquecimiento no cambia la puntuación de Imágenes, Pasos, Bandas,
  // Marchas, Agentes ni Acontecimientos. Enriquecemos solo los candidatos que
  // todavía pueden entrar en el top final y conservamos todos los empates.
  // Las Hermandades se mantienen completas porque su nombre popular puede
  // sustituir al nombre canónico durante el enriquecimiento.
  const enrichmentCandidates = selectCandidatesForEnrichment(candidates, {
    limit,
    scoreById: candidateBaseScoreById,
    alwaysIncludeTypes: ['brotherhood'],
  })

  const candidateIds = enrichmentCandidates.map((entity) => entity.id)
  const imageIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'image').map((entity) => entity.id)
  const stepIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'step').map((entity) => entity.id)
  const agentIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'agent').map((entity) => entity.id)
  const marchIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'march').map((entity) => entity.id)
  const brotherhoodIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'brotherhood').map((entity) => entity.id)
  const bandIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'band').map((entity) => entity.id)
  const eventIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'event').map((entity) => entity.id)
  const marchProfileIds = enrichmentCandidates.filter((entity) => entity.entity_type === 'march').map((entity) => entity.id)

  const [brotherhoodRows, bandRows, imageRows, stepRows, eventRows, marchRows, disciplines, marchAuthors, coverRelations] = await Promise.all([
    brotherhoodIds.length
      ? optionalRows(supabase.from('brotherhoods').select('entity_id, popular_name, municipality_id, current_procession_day, brotherhood_types, crest_path').in('entity_id', brotherhoodIds), 'profiles_brotherhoods', failures)
      : Promise.resolve([]),
    bandIds.length
      ? optionalRows(supabase.from('bands').select('entity_id, band_type, municipality_id, logo_path').in('entity_id', bandIds), 'profiles_bands', failures)
      : Promise.resolve([]),
    imageIds.length
      ? optionalRows(supabase.from('images').select('entity_id, image_type, execution_date, execution_date_text').in('entity_id', imageIds), 'profiles_images', failures)
      : Promise.resolve([]),
    stepIds.length
      ? optionalRows(supabase.from('steps').select('entity_id, step_type, execution_date_text').in('entity_id', stepIds), 'profiles_steps', failures)
      : Promise.resolve([]),
    eventIds.length
      ? optionalRows(supabase.from('events').select('entity_id, event_category, event_type, event_date').in('entity_id', eventIds).eq('event_category', 'crew_call'), 'profiles_events', failures)
      : Promise.resolve([]),
    marchProfileIds.length
      ? optionalRows(supabase.from('marches').select('entity_id').in('entity_id', marchProfileIds), 'profiles_marches', failures)
      : Promise.resolve([]),
    agentIds.length
      ? optionalRows(supabase.from('agent_disciplines').select('agent_entity_id, discipline, is_primary').in('agent_entity_id', agentIds), 'profiles_agents', failures)
      : Promise.resolve([]),
    marchIds.length
      ? optionalRows(supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').in('march_entity_id', marchIds).eq('status', 'published'), 'profiles_march_authors', failures)
      : Promise.resolve([]),
    candidateIds.length
      ? optionalRows(supabase
          .from('entity_media')
          .select('entity_id, media_asset_id, sort_order, focus_x, focus_y, fit_mode')
          .in('entity_id', candidateIds)
          .eq('is_cover', true)
          .order('sort_order', { ascending: true }), 'profiles_media', failures)
      : Promise.resolve([]),
  ])

  const authorIds = [...new Set(marchAuthors.map((row) => row.agent_entity_id).filter(Boolean))]
  const coverMediaIds = [...new Set(coverRelations.map((row) => row.media_asset_id).filter(Boolean))]

  const [authors, coverMedia] = await Promise.all([
    authorIds.length
      ? optionalRows(supabase.from('entities').select('id, name').in('id', authorIds).eq('status', 'published'), 'profile_authors', failures)
      : Promise.resolve([]),
    coverMediaIds.length
      ? optionalRows(supabase
          .from('media_assets')
          .select('id, storage_path, alt_text, rights_status')
          .in('id', coverMediaIds)
          .eq('media_type', 'image')
          .in('rights_status', PUBLIC_MEDIA_RIGHTS), 'profile_media_assets', failures)
      : Promise.resolve([]),
  ])

  const brotherhoodById = mapById(brotherhoodRows)
  const bandById = mapById(bandRows)
  const imageById = mapById(imageRows)
  const stepById = mapById(stepRows)
  const eventById = mapById(eventRows)
  const publicProfileByType = {
    brotherhood: brotherhoodById,
    band: bandById,
    image: imageById,
    step: stepById,
    event: eventById,
    march: mapById(marchRows),
  }
  const municipalityById = new Map(municipalities.map((row) => [row.id, row.name]))
  const authorById = new Map(authors.map((row) => [row.id, row.name]))
  const coverMediaById = new Map(coverMedia.map((row) => [row.id, row]))
  const coverByEntity = new Map()

  coverRelations.forEach((relation) => {
    if (coverByEntity.has(relation.entity_id)) return
    const media = coverMediaById.get(relation.media_asset_id)
    if (!media) return
    coverByEntity.set(relation.entity_id, { ...media, ...relation })
  })

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

  const entityResults = enrichmentCandidates
    .map((entity) => {
      let title = entity.name
      let location = ''
      let descriptor = compact(entity.summary, 88) || TYPE_LABELS[entity.entity_type] || 'Entidad documentada'
      let subtitle = descriptor
      let visual = null

      if (entity.entity_type === 'brotherhood') {
        const row = brotherhoodById.get(entity.id) || {}
        title = row.popular_name || entity.name
        location = municipalityById.get(row.municipality_id) || ''
        descriptor = [row.current_procession_day, ...(row.brotherhood_types || [])].filter(Boolean).join(' · ')
        subtitle = [location, descriptor].filter(Boolean).join(' · ')
        visual = identityVisual(supabase, row.crest_path, `${title} · escudo`)
      } else if (entity.entity_type === 'band') {
        const row = bandById.get(entity.id) || {}
        location = municipalityById.get(row.municipality_id) || ''
        descriptor = row.band_type || 'Formación musical'
        subtitle = [descriptor, location].filter(Boolean).join(' · ')
        visual = identityVisual(supabase, row.logo_path, `${title} · logotipo`)
      } else if (entity.entity_type === 'image') {
        const row = imageById.get(entity.id) || {}
        descriptor = [row.image_type || 'Imagen', row.execution_date_text || row.execution_date].filter(Boolean).join(' · ')
        subtitle = descriptor
      } else if (entity.entity_type === 'step') {
        const row = stepById.get(entity.id) || {}
        descriptor = [row.step_type || 'Paso', row.execution_date_text].filter(Boolean).join(' · ')
        subtitle = descriptor
      } else if (entity.entity_type === 'event') {
        const row = eventById.get(entity.id) || {}
        descriptor = row.event_category === 'crew_call'
          ? [crewEventTypeLabel(row.event_type), row.event_date].filter(Boolean).join(' · ')
          : 'Acontecimiento'
        subtitle = descriptor
      } else if (entity.entity_type === 'agent') {
        const values = [...(disciplinesByAgent.get(entity.id) || [])]
          .sort((a, b) => Number(b.primary) - Number(a.primary))
          .map((item) => item.value)
        descriptor = values.length ? values.slice(0, 3).join(' · ') : 'Autor, artista o profesional'
        subtitle = descriptor
      } else if (entity.entity_type === 'march') {
        const authors = authorsByMarch.get(entity.id) || []
        const composer = authors.find((item) => item.role === 'composer') || authors[0]
        descriptor = composer?.name ? `Composición · ${composer.name}` : 'Composición musical'
        subtitle = descriptor
      }

      if (!visual) visual = coverVisual(supabase, coverByEntity.get(entity.id), title)

      return {
        entityId: entity.id,
        entityType: entity.entity_type,
        type: entity.entity_type === 'event' && eventById.has(entity.id)
          ? 'Igualá / ensayo'
          : TYPE_LABELS[entity.entity_type] || 'Entidad',
        title,
        subtitle,
        location,
        descriptor,
        visual,
        href: entityHref(entity, publicProfileByType[entity.entity_type]?.get(entity.id)),
        score: Math.max(
          rankText(title, term),
          rankText(entity.name, term),
          aliasScore.get(entity.id) || 0,
          scopeScore.get(entity.id) || 0,
          rankText(entity.summary, term) - 100
        ),
      }
    })
  reportPartialSearch(failures)
  return [...directoryItems, ...entityResults, ...publishedContent]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
    .slice(0, limit)
    .map(({ score, ...item }) => item)
}
