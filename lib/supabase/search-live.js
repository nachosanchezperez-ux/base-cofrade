import 'server-only'

import { crewEventTypeLabel } from '@/lib/crew-events'
import { resolveHiloMediaReference } from '@/lib/supabase/hilo-media-paths'
import { isPublicEntityPageReady } from '@/lib/supabase/public-entity-page'
import { createPublicClient as createClient } from '@/lib/supabase/public'
import { outingPublicHref } from '@/lib/tira-published-content'

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

async function publicEntitiesByIds(supabase, ids) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary, status')
    .in('id', unique)
    .in('entity_type', SEARCHABLE_TYPES)
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
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

async function searchPublishedContent(supabase, term, candidateLimit) {
  const pattern = `%${term}%`
  const [repertoiresResult, outingsResult, cultsResult, updatesResult, premieresResult] = await Promise.all([
    supabase
      .from('musical_repertoires')
      .select('id, slug, title, notes, outing_id, band_entity_id, step_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit),
    supabase
      .from('outings')
      .select('id, slug, title, outing_type, character, outing_date, year, reason, brotherhood_entity_id, municipality_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit),
    supabase
      .from('cults')
      .select('id, title, cult_type, cult_date, date_rule, brotherhood_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit),
    supabase
      .from('heritage_updates')
      .select('id, title, update_type, year, brotherhood_entity_id, target_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit),
    supabase
      .from('band_premieres')
      .select('id, title, composer_name, premiere_year, band_entity_id, march_entity_id')
      .eq('status', 'published')
      .ilike('title', pattern)
      .limit(candidateLimit),
  ])
  const failed = [repertoiresResult, outingsResult, cultsResult, updatesResult, premieresResult].find((result) => result.error)
  if (failed?.error) throw failed.error

  const repertoires = repertoiresResult.data || []
  const outings = outingsResult.data || []
  const cults = cultsResult.data || []
  const updates = updatesResult.data || []
  const premieres = premieresResult.data || []
  const relatedIds = [...new Set([
    ...repertoires.flatMap((item) => [item.band_entity_id, item.step_entity_id]),
    ...outings.map((item) => item.brotherhood_entity_id),
    ...cults.map((item) => item.brotherhood_entity_id),
    ...updates.flatMap((item) => [item.brotherhood_entity_id, item.target_entity_id]),
    ...premieres.flatMap((item) => [item.band_entity_id, item.march_entity_id]),
  ].filter(Boolean))]
  const municipalityIds = [...new Set(outings.map((item) => item.municipality_id).filter(Boolean))]
  const [entitiesResult, municipalitiesResult] = await Promise.all([
    relatedIds.length
      ? supabase.from('entities').select('id, entity_type, name, slug, status').in('id', relatedIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name').in('id', municipalityIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  if (entitiesResult.error) throw entitiesResult.error
  if (municipalitiesResult.error) throw municipalitiesResult.error
  const entityById = new Map((entitiesResult.data || []).map((entity) => [entity.id, entity]))
  const municipalityById = new Map((municipalitiesResult.data || []).map((item) => [item.id, item.name]))

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

export async function searchHiloEntities(rawTerm, requestedLimit = 8) {
  const term = String(rawTerm || '').trim().slice(0, 80)
  if (term.length < 2) return []

  const limit = Math.max(1, Math.min(Number(requestedLimit) || 8, 10))
  const supabase = await createClient()
  const pattern = `%${term}%`
  const candidateLimit = Math.max(18, limit * 3)

  const [nameResult, summaryResult, brotherhoodPopularResult, brotherhoodOfficialResult, bandNameResult, bandShortNameResult, entityAliasResult, imageAliasResult, agentAliasResult, publishedContent] = await Promise.all([
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').in('entity_type', SEARCHABLE_TYPES).eq('status', 'published').ilike('name', pattern).limit(candidateLimit),
    supabase.from('entities').select('id, entity_type, name, slug, summary, status').in('entity_type', SEARCHABLE_TYPES).eq('status', 'published').ilike('summary', pattern).limit(candidateLimit),
    supabase.from('brotherhoods').select('entity_id, popular_name').ilike('popular_name', pattern).limit(candidateLimit),
    supabase.from('brotherhoods').select('entity_id, official_name').ilike('official_name', pattern).limit(candidateLimit),
    supabase.from('band_names').select('band_entity_id, name').ilike('name', pattern).limit(candidateLimit),
    supabase.from('band_names').select('band_entity_id, short_name').ilike('short_name', pattern).limit(candidateLimit),
    supabase.from('entity_names').select('entity_id, name').eq('status', 'published').ilike('name', pattern).limit(candidateLimit),
    supabase.from('image_names').select('image_entity_id, name').ilike('name', pattern).limit(candidateLimit),
    supabase.from('agent_names').select('agent_entity_id, name').ilike('name', pattern).limit(candidateLimit),
    searchPublishedContent(supabase, term, candidateLimit),
  ])

  const failures = [nameResult, summaryResult, brotherhoodPopularResult, brotherhoodOfficialResult, bandNameResult, bandShortNameResult, entityAliasResult, imageAliasResult, agentAliasResult].find((result) => result.error)
  if (failures?.error) throw failures.error

  const directEntities = [...(nameResult.data || []), ...(summaryResult.data || [])]
  const aliasScore = new Map()
  const aliasIds = []

  ;[
    ...(brotherhoodPopularResult.data || []).map((row) => ({ id: row.entity_id, value: row.popular_name })),
    ...(brotherhoodOfficialResult.data || []).map((row) => ({ id: row.entity_id, value: row.official_name })),
    ...(bandNameResult.data || []).map((row) => ({ id: row.band_entity_id, value: row.name })),
    ...(bandShortNameResult.data || []).map((row) => ({ id: row.band_entity_id, value: row.short_name })),
    ...(entityAliasResult.data || []).map((row) => ({ id: row.entity_id, value: row.name })),
    ...(imageAliasResult.data || []).map((row) => ({ id: row.image_entity_id, value: row.name })),
    ...(agentAliasResult.data || []).map((row) => ({ id: row.agent_entity_id, value: row.name })),
  ].forEach(({ id, value }) => {
    if (!id) return
    aliasIds.push(id)
    aliasScore.set(id, Math.max(aliasScore.get(id) || 0, rankText(value, term) + 80))
  })

  const directById = new Map(directEntities.map((entity) => [entity.id, entity]))
  const missingAliasIds = [...new Set(aliasIds)].filter((id) => !directById.has(id))
  const aliasEntities = await publicEntitiesByIds(supabase, missingAliasIds)
  const candidates = [...directById.values(), ...aliasEntities]
  if (!candidates.length) return publishedContent
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
    .slice(0, limit)
    .map(({ score, ...item }) => item)

  const candidateIds = candidates.map((entity) => entity.id)
  const imageIds = candidates.filter((entity) => entity.entity_type === 'image').map((entity) => entity.id)
  const stepIds = candidates.filter((entity) => entity.entity_type === 'step').map((entity) => entity.id)
  const agentIds = candidates.filter((entity) => entity.entity_type === 'agent').map((entity) => entity.id)
  const marchIds = candidates.filter((entity) => entity.entity_type === 'march').map((entity) => entity.id)
  const brotherhoodIds = candidates.filter((entity) => entity.entity_type === 'brotherhood').map((entity) => entity.id)
  const bandIds = candidates.filter((entity) => entity.entity_type === 'band').map((entity) => entity.id)
  const eventIds = candidates.filter((entity) => entity.entity_type === 'event').map((entity) => entity.id)
  const marchProfileIds = candidates.filter((entity) => entity.entity_type === 'march').map((entity) => entity.id)

  const [brotherhoodRowsResult, bandRowsResult, imageRowsResult, stepRowsResult, eventRowsResult, marchRowsResult, disciplineResult, marchAuthorsResult, coverRelationsResult] = await Promise.all([
    brotherhoodIds.length
      ? supabase.from('brotherhoods').select('entity_id, popular_name, municipality_id, current_procession_day, brotherhood_types, crest_path').in('entity_id', brotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
    bandIds.length
      ? supabase.from('bands').select('entity_id, band_type, municipality_id, logo_path').in('entity_id', bandIds)
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase.from('images').select('entity_id, image_type, execution_date, execution_date_text').in('entity_id', imageIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase.from('steps').select('entity_id, step_type, execution_date_text').in('entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
    eventIds.length
      ? supabase.from('events').select('entity_id, event_category, event_type, event_date').in('entity_id', eventIds).eq('event_category', 'crew_call')
      : Promise.resolve({ data: [], error: null }),
    marchProfileIds.length
      ? supabase.from('marches').select('entity_id').in('entity_id', marchProfileIds)
      : Promise.resolve({ data: [], error: null }),
    agentIds.length
      ? supabase.from('agent_disciplines').select('agent_entity_id, discipline, is_primary').in('agent_entity_id', agentIds)
      : Promise.resolve({ data: [], error: null }),
    marchIds.length
      ? supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').in('march_entity_id', marchIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    candidateIds.length
      ? supabase
          .from('entity_media')
          .select('entity_id, media_asset_id, sort_order, focus_x, focus_y, fit_mode')
          .in('entity_id', candidateIds)
          .eq('is_cover', true)
          .order('sort_order', { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ])

  const enrichmentFailure = [brotherhoodRowsResult, bandRowsResult, imageRowsResult, stepRowsResult, eventRowsResult, marchRowsResult, disciplineResult, marchAuthorsResult, coverRelationsResult].find((result) => result.error)
  if (enrichmentFailure?.error) throw enrichmentFailure.error

  const brotherhoodRows = brotherhoodRowsResult.data || []
  const bandRows = bandRowsResult.data || []
  const imageRows = imageRowsResult.data || []
  const stepRows = stepRowsResult.data || []
  const eventRows = eventRowsResult.data || []
  const marchRows = marchRowsResult.data || []
  const disciplines = disciplineResult.data || []
  const marchAuthors = marchAuthorsResult.data || []
  const coverRelations = coverRelationsResult.data || []

  const municipalityIds = [...new Set([
    ...brotherhoodRows.map((row) => row.municipality_id),
    ...bandRows.map((row) => row.municipality_id),
  ].filter(Boolean))]
  const authorIds = [...new Set(marchAuthors.map((row) => row.agent_entity_id).filter(Boolean))]
  const coverMediaIds = [...new Set(coverRelations.map((row) => row.media_asset_id).filter(Boolean))]

  const [municipalityResult, authorResult, coverMediaResult] = await Promise.all([
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name').in('id', municipalityIds)
      : Promise.resolve({ data: [], error: null }),
    authorIds.length
      ? supabase.from('entities').select('id, name').in('id', authorIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    coverMediaIds.length
      ? supabase
          .from('media_assets')
          .select('id, storage_path, alt_text, rights_status')
          .in('id', coverMediaIds)
          .eq('media_type', 'image')
          .in('rights_status', PUBLIC_MEDIA_RIGHTS)
      : Promise.resolve({ data: [], error: null }),
  ])
  if (municipalityResult.error) throw municipalityResult.error
  if (authorResult.error) throw authorResult.error
  if (coverMediaResult.error) throw coverMediaResult.error

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
  const municipalityById = new Map((municipalityResult.data || []).map((row) => [row.id, row.name]))
  const authorById = new Map((authorResult.data || []).map((row) => [row.id, row.name]))
  const coverMediaById = new Map((coverMediaResult.data || []).map((row) => [row.id, row]))
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

  const entityResults = candidates
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
        score: Math.max(rankText(title, term), rankText(entity.name, term), aliasScore.get(entity.id) || 0, rankText(entity.summary, term) - 100),
      }
    })
  return [...entityResults, ...publishedContent]
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'es'))
    .slice(0, limit)
    .map(({ score, ...item }) => item)
}
