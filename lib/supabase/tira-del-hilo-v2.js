import 'server-only'

import { askHiloCofrade as askSingleHop } from '@/lib/supabase/tira-del-hilo'
import { createClient } from '@/lib/supabase/server'

const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / profesional',
}

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

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
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

function contextFor(entity) {
  return entity ? { entityId: entity.id, entityType: entity.entity_type, name: entity.name } : null
}

function answer({ text, path = [], entities = [], items = [], followUps = [], context = null }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    followUps,
    context,
  }
}

function notDocumented(text) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: [],
    items: [],
    followUps: [],
    context: null,
  }
}

function scoreName(name, question) {
  const entityName = normalize(name)
  const query = normalize(question)
  if (!entityName || !query) return 0
  if (query === entityName) return 1200
  if (query.includes(entityName)) return 1000 + Math.min(entityName.length, 80)
  if (entityName.includes(query)) return 800

  const tokens = entityName.split(' ').filter((token) => token.length > 2 && !['hermandad', 'banda', 'nuestra', 'senora'].includes(token))
  const queryTokens = new Set(query.split(' ').filter((token) => token.length > 2))
  const overlap = tokens.filter((token) => queryTokens.has(token)).length
  if (!overlap) return 0
  return (overlap / Math.max(tokens.length, 1)) * 600 + overlap * 40
}

async function bestEntity(supabase, question, entityType, { includeUnpublished = false, context = null } = {}) {
  if (context?.entityId && context.entityType === entityType) {
    const q = normalize(question)
    const explicitName = normalize(context.name)
    const looksLikeFollowUp = /^(y|ademas|tambien|entonces|que|quien|cual|cuales|cuanto|cuantos|cuantas|donde|como)\b/.test(q)
    if (looksLikeFollowUp && !q.includes(explicitName)) {
      const contextual = await supabase
        .from('entities')
        .select('id, entity_type, name, slug, summary, status')
        .eq('id', context.entityId)
        .maybeSingle()
      if (!contextual.error && contextual.data && (includeUnpublished || contextual.data.status === 'published')) return contextual.data
    }
  }

  let query = supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary, status')
    .eq('entity_type', entityType)
  if (!includeUnpublished) query = query.eq('status', 'published')
  const result = await query
  if (result.error) throw result.error

  return (result.data || [])
    .map((entity) => ({ entity, score: scoreName(entity.name, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
}

async function publicEntitiesByIds(supabase, ids, entityType = null) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  let query = supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .eq('status', 'published')
  if (entityType) query = query.eq('entity_type', entityType)
  const result = await query
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function romanToNumber(value = '') {
  const roman = String(value).toUpperCase()
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  let previous = 0
  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const current = values[roman[index]] || 0
    total += current < previous ? -current : current
    previous = Math.max(previous, current)
  }
  return total
}

function centuryFromText(value = '') {
  const match = normalize(value).match(/siglo\s+([ivxlcdm]+|\d{1,2})/i)
  if (!match) return null
  return /^\d+$/.test(match[1]) ? Number(match[1]) : romanToNumber(match[1])
}

function yearFromText(value = '') {
  const match = String(value || '').match(/\b(1[0-9]{3}|20[0-9]{2})\b/)
  return match ? Number(match[1]) : null
}

function temporalCriterion(question) {
  const q = normalize(question)
  const century = centuryFromText(q)
  const year = yearFromText(q)
  const direction = /\b(anteriores|anterior|antes|previas|previa)\b/.test(q)
    ? 'before'
    : /\b(posteriores|posterior|despues|desde)\b/.test(q)
      ? 'after'
      : null
  if (!direction || (!century && !year)) return null
  return century ? { direction, unit: 'century', value: century } : { direction, unit: 'year', value: year }
}

function imageChronology(row) {
  const text = row.execution_date_text || row.execution_date || ''
  const explicitYear = row.execution_date ? Number(String(row.execution_date).slice(0, 4)) : yearFromText(text)
  const explicitCentury = centuryFromText(text) || (explicitYear ? Math.floor((explicitYear - 1) / 100) + 1 : null)
  return { text: text || 'Datación no documentada', year: explicitYear, century: explicitCentury }
}

function chronologyMatches(chronology, criterion) {
  if (criterion.unit === 'century') {
    if (!chronology.century) return false
    return criterion.direction === 'before'
      ? chronology.century < criterion.value
      : chronology.century > criterion.value
  }
  if (!chronology.year && !chronology.century) return false
  const comparableYear = chronology.year || ((chronology.century - 1) * 100 + 50)
  return criterion.direction === 'before'
    ? comparableYear < criterion.value
    : comparableYear > criterion.value
}

function romanCentury(number) {
  const romans = ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI']
  return romans[number] || String(number)
}

async function imagesByBrotherhoodChronology(supabase, question, context) {
  const brotherhood = await bestEntity(supabase, question, 'brotherhood', { context })
  const criterion = temporalCriterion(question)
  if (!brotherhood || !criterion) return notDocumented('No identifico todavía la hermandad o el criterio temporal de esa consulta.')

  const links = await supabase
    .from('brotherhood_images')
    .select('image_entity_id')
    .eq('brotherhood_entity_id', brotherhood.id)
    .eq('status', 'published')
  if (links.error) throw links.error

  const imageIds = (links.data || []).map((row) => row.image_entity_id)
  const [entities, imageRowsResult] = await Promise.all([
    publicEntitiesByIds(supabase, imageIds, 'image'),
    imageIds.length
      ? supabase.from('images').select('entity_id, execution_date, execution_date_text, image_type').in('entity_id', imageIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  if (imageRowsResult.error) throw imageRowsResult.error

  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const filtered = (imageRowsResult.data || [])
    .map((row) => ({ row, entity: entityById.get(row.entity_id), chronology: imageChronology(row) }))
    .filter((item) => item.entity && chronologyMatches(item.chronology, criterion))
    .sort((a, b) => (a.chronology.year || a.chronology.century * 100) - (b.chronology.year || b.chronology.century * 100))

  const criterionLabel = criterion.unit === 'century'
    ? `al siglo ${romanCentury(criterion.value)}`
    : `a ${criterion.value}`
  if (!filtered.length) {
    return notDocumented(`No hay imágenes publicadas de ${brotherhood.name} que cumplan el criterio ${criterion.direction === 'before' ? 'anterior' : 'posterior'} ${criterionLabel}.`)
  }

  return answer({
    text: `${brotherhood.name} tiene ${filtered.length} ${filtered.length === 1 ? 'imagen documentada' : 'imágenes documentadas'} ${criterion.direction === 'before' ? 'anteriores' : 'posteriores'} ${criterionLabel}.`,
    path: ['Hermandad', 'Imágenes', 'Datación'],
    entities: [publicEntity(brotherhood)],
    items: filtered.map(({ entity, row, chronology }) => ({
      label: entity.name,
      meta: [row.image_type, chronology.text].filter(Boolean).join(' · '),
      href: entityHref(entity),
    })),
    followUps: [`¿Qué titulares tiene ${brotherhood.name}?`, `¿Qué pasos tiene ${brotherhood.name}?`],
    context: contextFor(brotherhood),
  })
}

async function bestMunicipality(supabase, question) {
  const result = await supabase.from('municipalities').select('id, name')
  if (result.error) throw result.error
  return (result.data || [])
    .map((municipality) => ({ municipality, score: scoreName(municipality.name, question) }))
    .filter((item) => item.score >= 300)
    .sort((a, b) => b.score - a.score)[0]?.municipality || null
}

function brotherhoodTypeFromQuestion(question) {
  const q = normalize(question)
  if (/\bgloria|glorias\b/.test(q)) return 'Gloria'
  if (/\bpenitencia|penitenciales\b/.test(q)) return 'Penitencia'
  if (/\bsacramental|sacramentales\b/.test(q)) return 'Sacramental'
  return null
}

async function bandsByBrotherhoodFilters(supabase, question) {
  const [municipality, type] = await Promise.all([
    bestMunicipality(supabase, question),
    Promise.resolve(brotherhoodTypeFromQuestion(question)),
  ])
  if (!municipality && !type) return notDocumented('Necesito al menos una localidad o un tipo de hermandad para cruzar esa consulta.')

  let brotherhoodQuery = supabase
    .from('brotherhoods')
    .select('entity_id, popular_name, brotherhood_types, municipality_id')
  if (municipality) brotherhoodQuery = brotherhoodQuery.eq('municipality_id', municipality.id)
  const brotherhoodRowsResult = await brotherhoodQuery
  if (brotherhoodRowsResult.error) throw brotherhoodRowsResult.error

  const filteredRows = (brotherhoodRowsResult.data || []).filter((row) => !type || (row.brotherhood_types || []).includes(type))
  const publicBrotherhoods = await publicEntitiesByIds(supabase, filteredRows.map((row) => row.entity_id), 'brotherhood')
  const publicIds = new Set(publicBrotherhoods.map((entity) => entity.id))
  const brotherhoodRows = filteredRows.filter((row) => publicIds.has(row.entity_id))
  if (!brotherhoodRows.length) return notDocumented('No hay hermandades publicadas que cumplan todavía esos filtros.')

  const relationResult = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type')
    .in('brotherhood_entity_id', brotherhoodRows.map((row) => row.entity_id))
  if (relationResult.error) throw relationResult.error
  const relations = relationResult.data || []
  if (!relations.length) return notDocumented('Las hermandades encontradas no tienen acompañamientos musicales actuales publicados.')

  const [bands, steps] = await Promise.all([
    publicEntitiesByIds(supabase, relations.map((row) => row.band_entity_id), 'band'),
    publicEntitiesByIds(supabase, relations.map((row) => row.step_entity_id), 'step'),
  ])
  const bandById = new Map(bands.map((entity) => [entity.id, entity]))
  const stepById = new Map(steps.map((entity) => [entity.id, entity]))
  const brotherhoodById = new Map(publicBrotherhoods.map((entity) => [entity.id, entity]))
  const usable = relations.filter((row) => bandById.has(row.band_entity_id) && brotherhoodById.has(row.brotherhood_entity_id))
  const bandCount = new Set(usable.map((row) => row.band_entity_id)).size

  return answer({
    text: `He cruzado ${usable.length} acompañamientos actuales: ${bandCount} ${bandCount === 1 ? 'banda' : 'bandas'} relacionadas con ${brotherhoodRows.length} ${brotherhoodRows.length === 1 ? 'hermandad' : 'hermandades'}${type ? ` de ${type.toLowerCase()}` : ''}${municipality ? ` en ${municipality.name}` : ''}.`,
    path: ['Filtros', 'Hermandades', 'Acompañamientos', 'Bandas'],
    entities: [...publicBrotherhoods.map((entity) => publicEntity(entity)), ...bands.map((entity) => publicEntity(entity))],
    items: usable.map((row) => {
      const band = bandById.get(row.band_entity_id)
      const brotherhood = brotherhoodById.get(row.brotherhood_entity_id)
      const step = stepById.get(row.step_entity_id)
      return {
        label: band.name,
        meta: [brotherhood.name, row.outing_type, row.position, step?.name].filter(Boolean).join(' · '),
        href: entityHref(band),
      }
    }),
    followUps: publicBrotherhoods[0] ? [`¿Qué pasos tiene ${publicBrotherhoods[0].name}?`] : [],
    context: null,
  })
}

async function agentsWorkingOnMultipleSteps(supabase) {
  const result = await supabase
    .from('step_phase_details')
    .select('agent_entity_id, agent_name, step_entity_id, step_name, discipline')
  if (result.error) throw result.error

  const groups = new Map()
  ;(result.data || []).forEach((row) => {
    if (!row.agent_entity_id || !row.step_entity_id || !row.agent_name) return
    const group = groups.get(row.agent_entity_id) || {
      agentId: row.agent_entity_id,
      name: row.agent_name,
      steps: new Map(),
      disciplines: new Set(),
    }
    group.steps.set(row.step_entity_id, row.step_name)
    if (row.discipline) group.disciplines.add(row.discipline)
    groups.set(row.agent_entity_id, group)
  })

  const candidates = [...groups.values()].filter((group) => group.steps.size > 1)
  const publicAgents = await publicEntitiesByIds(supabase, candidates.map((group) => group.agentId), 'agent')
  const publicIds = new Set(publicAgents.map((entity) => entity.id))
  const ranked = candidates
    .filter((group) => publicIds.has(group.agentId))
    .sort((a, b) => b.steps.size - a.steps.size || a.name.localeCompare(b.name, 'es'))

  if (!ranked.length) return notDocumented('Todavía no hay autores publicados con trabajo documentado en más de un paso.')

  return answer({
    text: `${ranked.length} ${ranked.length === 1 ? 'autor o profesional aparece' : 'autores o profesionales aparecen'} documentados en más de un paso.`,
    path: ['Autores', 'Fases de paso', 'Pasos compartidos'],
    entities: [],
    items: ranked.slice(0, 12).map((group) => ({
      label: group.name,
      meta: `${group.steps.size} pasos${group.disciplines.size ? ` · ${[...group.disciplines].slice(0, 3).join(', ')}` : ''}`,
      href: '',
    })),
    followUps: ranked[0] ? [`Cuéntame sobre ${ranked[0].name}`] : [],
    context: null,
  })
}

async function relationBetweenMarchBandBrotherhood(supabase, question) {
  const [march, band, brotherhood] = await Promise.all([
    bestEntity(supabase, question, 'march'),
    bestEntity(supabase, question, 'band'),
    bestEntity(supabase, question, 'brotherhood', { includeUnpublished: true }),
  ])
  if (!march || !band || !brotherhood) return notDocumented('No consigo identificar las tres piezas de esa relación todavía.')

  const periodResult = await supabase
    .from('music_accompaniment_periods')
    .select('year_from, date_from_text, year_to, date_to_text, outing_type, position, notes, status')
    .eq('band_entity_id', band.id)
    .eq('brotherhood_entity_id', brotherhood.id)
    .eq('status', 'published')
  if (periodResult.error) throw periodResult.error

  const period = (periodResult.data || [])[0] || null
  const marchSummary = normalize(march.summary)
  const summaryConnects = marchSummary.includes(normalize(band.name))
    || marchSummary.includes(normalize(brotherhood.name).replace(/^hermandad de /, ''))

  if (!period || !summaryConnects) {
    return notDocumented(`No tengo publicada una relación suficientemente documentada entre «${march.name}», ${band.name} y ${brotherhood.name}.`)
  }

  const periodLabel = [
    period.year_from || period.date_from_text,
    period.year_to || period.date_to_text,
  ].filter(Boolean).join('–')
  const brotherhoodDisplay = brotherhood.name.replace(/^Hermandad de /, '')

  return answer({
    text: `La relación documentada es histórica: ${band.name} acompañó a ${brotherhood.name}${periodLabel ? ` entre ${periodLabel}` : ''}, y la ficha publicada de «${march.name}» sitúa el origen de la marcha en esa vinculación.`,
    path: ['Banda', 'Acompañamiento histórico', 'Hermandad', 'Origen documentado', 'Marcha'],
    entities: [publicEntity(band), publicEntity(march)],
    items: [{
      label: `${band.name} → ${brotherhoodDisplay}`,
      meta: [periodLabel, period.outing_type, period.position].filter(Boolean).join(' · '),
      href: entityHref(band),
    }],
    followUps: [`¿Quién compuso ${march.name}?`, `¿A qué hermandades acompaña ${band.name}?`],
    context: contextFor(march),
  })
}

function multiIntent(question) {
  const q = normalize(question)

  if (/\bimagenes\b/.test(q) && /\b(anteriores|anterior|antes|posteriores|posterior|despues)\b/.test(q) && (/\bsiglo\b/.test(q) || /\b(1[0-9]{3}|20[0-9]{2})\b/.test(q))) {
    return 'images_by_chronology'
  }

  if (/\bbandas?\b/.test(q) && /\bhermandades?\b/.test(q) && (/\b(gloria|glorias|penitencia|sacramental|sacramentales)\b/.test(q) || /\ben\b/.test(q))) {
    return 'bands_by_filters'
  }

  if (/\b(autores|artistas|profesionales)\b/.test(q) && /\b(mas de un paso|varios pasos|distintos pasos)\b/.test(q)) {
    return 'agents_multiple_steps'
  }

  if (/\brelacion\b/.test(q)) return 'relation_triplet'
  return null
}

export async function askHiloCofradeV2(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  const intent = multiIntent(clean)
  if (!intent) return askSingleHop(clean, context)

  const supabase = await createClient()
  try {
    if (intent === 'images_by_chronology') return await imagesByBrotherhoodChronology(supabase, clean, context)
    if (intent === 'bands_by_filters') return await bandsByBrotherhoodFilters(supabase, clean)
    if (intent === 'agents_multiple_steps') return await agentsWorkingOnMultipleSteps(supabase)
    if (intent === 'relation_triplet') return await relationBetweenMarchBandBrotherhood(supabase, clean)
    return askSingleHop(clean, context)
  } catch (error) {
    console.error('[Hilo Cofrade] Error en consulta multirrelacional', {
      question: clean,
      intent,
      error: error instanceof Error ? error.message : String(error),
    })
    return notDocumented('No he podido completar ese cruce de relaciones ahora mismo. Prefiero dejarlo sin respuesta antes que inferir un dato no documentado.')
  }
}
