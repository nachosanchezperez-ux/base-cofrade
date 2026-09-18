import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { matchMunicipalityName, normalizeFreeFactText } from '@/lib/tira-free-facts'
import { subsetFiltersV10Intent } from '@/lib/tira-subset-filters-v10'

function href(entity) {
  if (!entity?.slug) return ''
  return entity.entity_type === 'brotherhood' ? `/hermandades/${entity.slug}` : ''
}

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: 'Hermandad',
    name: entity.name,
    href: href(entity),
    meta,
  }
}

function answer({ text, path = [], entities = [], items = [], evidence = [], followUps = [], context = null, compactItemLimit = 6 }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    links: [],
    evidence,
    references: [],
    followUps,
    context,
    compactItemLimit,
  }
}

function notDocumented(text, context) {
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

function resultSetIds(context) {
  return [...new Set((context?.resultSet?.entityIds || []).filter(Boolean))].slice(0, 12)
}

function setContext(context, ids, label, sourceIntent) {
  const entityIds = [...new Set((ids || []).filter(Boolean))].slice(0, 12)
  return {
    entityId: null,
    entityType: null,
    name: context?.name || label || '',
    resultSet: {
      entityType: 'brotherhood',
      entityIds,
      count: entityIds.length,
      label,
      sourceIntent,
    },
  }
}

async function entitiesByIds(supabase, ids = []) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', 'brotherhood')
    .eq('status', 'published')
    .in('id', unique)
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function madridToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function subsetResponse({ context, original, filtered, reason, sourceIntent }) {
  const label = `${filtered.length} ${filtered.length === 1 ? 'hermandad' : 'hermandades'} · ${reason}`
  return answer({
    text: `He reducido el conjunto anterior de ${original.length} a ${filtered.length} ${filtered.length === 1 ? 'hermandad' : 'hermandades'}: ${reason}.`,
    path: ['Contexto anterior', 'Filtro', reason],
    entities: filtered.map((item) => publicEntity(item)),
    items: filtered.map((item) => ({
      label: item.name,
      meta: reason,
      href: href(item),
    })),
    evidence: [{
      key: sourceIntent,
      label: 'Subconjunto filtrado',
      detail: `${filtered.length} de ${original.length} hermandades`,
    }],
    followUps: ['Compáralas.', '¿Qué autores se repiten entre ellas?', '¿Qué marchas tienen dedicadas?'],
    context: setContext(context, filtered.map((item) => item.id), label, sourceIntent),
    compactItemLimit: Math.min(Math.max(filtered.length, 3), 12),
  })
}

async function filterByType(supabase, context, brotherhoodType) {
  const ids = resultSetIds(context)
  const original = await entitiesByIds(supabase, ids)
  const details = await supabase
    .from('brotherhoods')
    .select('entity_id, brotherhood_types')
    .in('entity_id', ids)
  if (details.error) throw details.error

  const normalized = normalizeFreeFactText(brotherhoodType)
  const allowed = new Set((details.data || [])
    .filter((row) => (row.brotherhood_types || []).some((value) => normalizeFreeFactText(value) === normalized))
    .map((row) => row.entity_id))
  const filtered = original.filter((item) => allowed.has(item.id))
  if (!filtered.length) {
    return notDocumented(`Ninguna hermandad del conjunto anterior está publicada como ${brotherhoodType}.`, context)
  }
  return subsetResponse({
    context,
    original,
    filtered,
    reason: brotherhoodType,
    sourceIntent: 'brotherhood_set_filter_type',
  })
}

async function filterByMunicipality(supabase, question, context) {
  const ids = resultSetIds(context)
  const original = await entitiesByIds(supabase, ids)
  const details = await supabase
    .from('brotherhoods')
    .select('entity_id, municipality_id')
    .in('entity_id', ids)
  if (details.error) throw details.error

  const municipalityIds = [...new Set((details.data || []).map((row) => row.municipality_id).filter(Boolean))]
  const municipalities = municipalityIds.length
    ? await supabase.from('municipalities').select('id, name').in('id', municipalityIds)
    : { data: [], error: null }
  if (municipalities.error) throw municipalities.error

  const municipality = matchMunicipalityName(question, (municipalities.data || []).map((row) => row.name))
  if (!municipality) return null
  const municipalityId = (municipalities.data || []).find((row) => normalizeFreeFactText(row.name) === normalizeFreeFactText(municipality))?.id
  if (!municipalityId) return null

  const allowed = new Set((details.data || []).filter((row) => row.municipality_id === municipalityId).map((row) => row.entity_id))
  const filtered = original.filter((item) => allowed.has(item.id))
  if (!filtered.length) {
    return notDocumented(`Ninguna hermandad del conjunto anterior pertenece a ${municipality}.`, context)
  }
  return subsetResponse({
    context,
    original,
    filtered,
    reason: municipality,
    sourceIntent: 'brotherhood_set_filter_municipality',
  })
}

async function filterByMusicAbsence(supabase, context) {
  const ids = resultSetIds(context)
  const original = await entitiesByIds(supabase, ids)
  const music = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id')
    .in('brotherhood_entity_id', ids)
  if (music.error) throw music.error

  const withMusic = new Set((music.data || []).map((row) => row.brotherhood_entity_id))
  const filtered = original.filter((item) => !withMusic.has(item.id))
  if (!filtered.length) {
    return notDocumented('Todas las hermandades del conjunto anterior tienen acompañamiento musical actual publicado.', context)
  }
  return subsetResponse({
    context,
    original,
    filtered,
    reason: 'sin acompañamiento musical actual publicado',
    sourceIntent: 'brotherhood_set_filter_without_music',
  })
}

async function filterByFutureCults(supabase, context, keepWithCults) {
  const ids = resultSetIds(context)
  const original = await entitiesByIds(supabase, ids)
  const rows = await supabase
    .from('calendar_cult_days')
    .select('brotherhood_entity_id, event_status, item_date')
    .in('brotherhood_entity_id', ids)
    .gte('item_date', madridToday())
  if (rows.error) throw rows.error

  const withCults = new Set((rows.data || [])
    .filter((row) => String(row.event_status || '').toLowerCase() !== 'cancelled')
    .map((row) => row.brotherhood_entity_id))
  const filtered = original.filter((item) => keepWithCults ? withCults.has(item.id) : !withCults.has(item.id))
  const reason = keepWithCults ? 'con cultos futuros publicados' : 'sin cultos futuros publicados'
  if (!filtered.length) {
    return notDocumented(`Ninguna hermandad del conjunto anterior cumple el filtro «${reason}».`, context)
  }
  return subsetResponse({
    context,
    original,
    filtered,
    reason,
    sourceIntent: keepWithCults
      ? 'brotherhood_set_filter_with_future_cults'
      : 'brotherhood_set_filter_without_future_cults',
  })
}

export async function askHiloCofradeSubsetFiltersV10(question, context = null) {
  const intent = subsetFiltersV10Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()

  try {
    if (intent.kind === 'brotherhood_set_filter_type') return filterByType(supabase, context, intent.brotherhoodType)
    if (intent.kind === 'brotherhood_set_filter_municipality') return filterByMunicipality(supabase, question, context)
    if (intent.kind === 'brotherhood_set_filter_without_music') return filterByMusicAbsence(supabase, context)
    if (intent.kind === 'brotherhood_set_filter_with_future_cults') return filterByFutureCults(supabase, context, true)
    if (intent.kind === 'brotherhood_set_filter_without_future_cults') return filterByFutureCults(supabase, context, false)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en filtros de subconjuntos V10', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
