import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { publicText } from '@/lib/supabase/public-entity-page'
import { foundationChronologyKey, setReasoningV8Intent } from '@/lib/tira-set-reasoning-v8'

function href(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  return ''
}

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: entity.entity_type === 'agent' ? 'Autor / profesional' : 'Hermandad',
    name: entity.name,
    href: href(entity),
    meta,
  }
}

function answer({ text, path = [], entities = [], items = [], links = [], evidence = [], followUps = [], context = null, compactItemLimit = 6 }) {
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
      label: label || `${entityIds.length} hermandades`,
      sourceIntent,
    },
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

function formatDate(value = '') {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00Z`)
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function dateRangeLabel(start = '', end = '') {
  if (!start) return ''
  if (!end || start === end) return formatDate(start)
  return `${formatDate(start)} → ${formatDate(end)}`
}

async function orderByFoundation(supabase, context, direction) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null

  const rows = await supabase
    .from('brotherhoods')
    .select('entity_id, foundation_text')
    .in('entity_id', ids)
  if (rows.error) throw rows.error
  const rowById = new Map((rows.data || []).map((row) => [row.entity_id, row]))

  const enriched = brotherhoods.map((brotherhood) => {
    const foundationText = publicText(rowById.get(brotherhood.id)?.foundation_text || '')
    return {
      brotherhood,
      foundationText,
      chronology: foundationChronologyKey(foundationText),
    }
  })

  const known = enriched.filter((item) => Number.isFinite(item.chronology))
    .sort((first, second) => {
      const difference = first.chronology - second.chronology
      if (difference) return direction === 'newest_first' ? -difference : difference
      return first.brotherhood.name.localeCompare(second.brotherhood.name, 'es')
    })
  const unknown = enriched.filter((item) => !Number.isFinite(item.chronology))
    .sort((first, second) => first.brotherhood.name.localeCompare(second.brotherhood.name, 'es'))
  const ordered = [...known, ...unknown]
  const orderedIds = ordered.map((item) => item.brotherhood.id)
  const directionLabel = direction === 'newest_first' ? 'de más reciente a más antigua' : 'de más antigua a más reciente'

  return answer({
    text: `He ordenado el conjunto anterior ${directionLabel} usando la referencia cronológica más antigua explícita en el campo de fundación publicado. ${unknown.length ? `${unknown.length} ${unknown.length === 1 ? 'hermandad queda' : 'hermandades quedan'} al final porque no tienen una cronología fundacional ordenable.` : 'Todas tienen una referencia cronológica ordenable.'}`,
    path: ['Contexto anterior', 'Hermandades', 'Antigüedad documentada'],
    entities: ordered.map((item) => publicEntity(item.brotherhood, item.foundationText)),
    items: ordered.map((item, index) => ({
      label: `${index + 1}. ${item.brotherhood.name}`,
      meta: item.foundationText || 'Fundación sin referencia cronológica ordenable',
      href: href(item.brotherhood),
    })),
    evidence: [{
      key: 'brotherhood-set-foundation-order',
      label: 'Fundación publicada',
      detail: `${known.length} de ${brotherhoods.length} hermandades con cronología ordenable`,
    }],
    followUps: ['¿Cuáles llevan banda de música?', '¿Qué cultos tienen próximamente?', '¿Qué autores se repiten entre ellas?'],
    context: setContext(context, orderedIds, `${orderedIds.length} hermandades ordenadas por antigüedad`, 'brotherhood_set_foundation_order'),
    compactItemLimit: Math.min(Math.max(ordered.length, 3), 12),
  })
}

function groupCultRows(rows = []) {
  const groups = new Map()
  for (const row of rows) {
    const key = row.occurrence_id || row.calendar_item_id || `${row.brotherhood_entity_id}|${row.title}|${row.item_date}`
    const current = groups.get(key) || {
      key,
      brotherhoodId: row.brotherhood_entity_id,
      title: row.title || 'Culto publicado',
      subtype: row.subtype || '',
      startDate: row.item_date || '',
      endDate: row.item_date || '',
      place: row.place_name || '',
      times: new Set(),
    }
    if (row.item_date && (!current.startDate || row.item_date < current.startDate)) current.startDate = row.item_date
    if (row.item_date && (!current.endDate || row.item_date > current.endDate)) current.endDate = row.item_date
    if (row.item_time) current.times.add(String(row.item_time).slice(0, 5))
    if (!current.place && row.place_name) current.place = row.place_name
    groups.set(key, current)
  }
  return [...groups.values()].sort((first, second) => (
    `${first.startDate}T${[...first.times][0] || '23:59'}`
      .localeCompare(`${second.startDate}T${[...second.times][0] || '23:59'}`)
  ))
}

async function upcomingCultsForSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))

  const result = await supabase
    .from('calendar_cult_days')
    .select('calendar_item_id, brotherhood_entity_id, title, subtype, item_date, item_time, place_name, event_status, occurrence_id')
    .in('brotherhood_entity_id', ids)
    .gte('item_date', madridToday())
    .order('item_date')
  if (result.error) throw result.error

  const rows = (result.data || []).filter((row) => String(row.event_status || '').toLowerCase() !== 'cancelled')
  const groups = groupCultRows(rows).filter((row) => brotherhoodById.has(row.brotherhoodId))
  if (!groups.length) {
    return notDocumented('Ninguna de las hermandades del conjunto anterior tiene cultos futuros publicados ahora mismo en la Agenda Cofrade.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_upcoming_cults'))
  }

  const activeBrotherhoodIds = [...new Set(groups.map((row) => row.brotherhoodId))]
  return answer({
    text: `Dentro de las ${brotherhoods.length} hermandades del conjunto anterior, ${activeBrotherhoodIds.length} ${activeBrotherhoodIds.length === 1 ? 'tiene' : 'tienen'} cultos futuros publicados. En total hay ${groups.length} ${groups.length === 1 ? 'cita agrupada' : 'citas agrupadas'} en la Agenda Cofrade.`,
    path: ['Contexto anterior', 'Hermandades', 'Próximos cultos'],
    entities: activeBrotherhoodIds.map((id) => publicEntity(brotherhoodById.get(id))),
    items: groups.slice(0, 30).map((row) => {
      const brotherhood = brotherhoodById.get(row.brotherhoodId)
      return {
        label: row.title,
        meta: [row.subtype, dateRangeLabel(row.startDate, row.endDate), [...row.times].join(' / '), row.place].filter(Boolean).join(' · '),
        href: href(brotherhood),
        group: brotherhood?.name || 'Hermandad',
      }
    }),
    links: [{ label: 'Abrir cultos en la Agenda Cofrade', href: '/agenda-cofrade?categoria=devotions#agenda' }],
    evidence: [{
      key: 'brotherhood-set-upcoming-cults',
      label: 'Agenda Cofrade · Cultos futuros',
      detail: `${groups.length} citas agrupadas · ${activeBrotherhoodIds.length} hermandades`,
    }],
    followUps: ['Ordénalas por antigüedad.', '¿Cuáles llevan banda de música?', '¿Qué autores se repiten entre ellas?'],
    context: setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_upcoming_cults'),
    compactItemLimit: Math.min(Math.max(groups.length, 4), 10),
  })
}

function addAgentRelation(map, agentId, brotherhoodId, detail) {
  if (!agentId || !brotherhoodId) return
  const entry = map.get(agentId) || { brotherhoods: new Map() }
  const details = entry.brotherhoods.get(brotherhoodId) || new Set()
  if (detail) details.add(detail)
  entry.brotherhoods.set(brotherhoodId, details)
  map.set(agentId, entry)
}

async function repeatedAgentsForSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))

  const [imageLinks, stepLinks] = await Promise.all([
    supabase
      .from('brotherhood_images')
      .select('brotherhood_entity_id, image_entity_id')
      .in('brotherhood_entity_id', ids)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('brotherhood_entity_id, step_entity_id')
      .in('brotherhood_entity_id', ids)
      .eq('status', 'published'),
  ])
  if (imageLinks.error) throw imageLinks.error
  if (stepLinks.error) throw stepLinks.error

  const imageOwners = new Map()
  ;(imageLinks.data || []).forEach((row) => {
    const owners = imageOwners.get(row.image_entity_id) || new Set()
    owners.add(row.brotherhood_entity_id)
    imageOwners.set(row.image_entity_id, owners)
  })
  const stepOwners = new Map()
  ;(stepLinks.data || []).forEach((row) => {
    const owners = stepOwners.get(row.step_entity_id) || new Set()
    owners.add(row.brotherhood_entity_id)
    stepOwners.set(row.step_entity_id, owners)
  })

  const imageIds = [...imageOwners.keys()]
  const stepIds = [...stepOwners.keys()]
  const [imageAuthorships, stepDetails] = await Promise.all([
    imageIds.length
      ? supabase
          .from('image_authorships')
          .select('image_entity_id, agent_entity_id, role_name')
          .in('image_entity_id', imageIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('step_phase_details')
          .select('step_entity_id, agent_entity_id, discipline, role_name')
          .in('step_entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  if (imageAuthorships.error) throw imageAuthorships.error
  if (stepDetails.error) throw stepDetails.error

  const relations = new Map()
  ;(imageAuthorships.data || []).forEach((row) => {
    for (const brotherhoodId of imageOwners.get(row.image_entity_id) || []) {
      addAgentRelation(relations, row.agent_entity_id, brotherhoodId, ['Imagen', row.role_name].filter(Boolean).join(' · '))
    }
  })
  ;(stepDetails.data || []).forEach((row) => {
    for (const brotherhoodId of stepOwners.get(row.step_entity_id) || []) {
      addAgentRelation(relations, row.agent_entity_id, brotherhoodId, ['Paso', row.discipline, row.role_name].filter(Boolean).join(' · '))
    }
  })

  const repeatedIds = [...relations.entries()]
    .filter(([, value]) => value.brotherhoods.size >= 2)
    .map(([agentId]) => agentId)
  const agents = await entitiesByIds(supabase, repeatedIds, 'agent')
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))

  const repeated = repeatedIds
    .map((agentId) => ({ agent: agentById.get(agentId), relation: relations.get(agentId) }))
    .filter((item) => item.agent)
    .sort((first, second) => (
      second.relation.brotherhoods.size - first.relation.brotherhoods.size
      || first.agent.name.localeCompare(second.agent.name, 'es')
    ))

  if (!repeated.length) {
    return notDocumented('No hay autores o profesionales patrimoniales publicados que se repitan en al menos dos hermandades del conjunto anterior.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_repeated_agents'))
  }

  return answer({
    text: `He encontrado ${repeated.length} ${repeated.length === 1 ? 'autor o profesional patrimonial que aparece' : 'autores o profesionales patrimoniales que aparecen'} en al menos dos hermandades del conjunto anterior. El cruce usa autorías de imágenes y trabajos de paso estructurados.`,
    path: ['Contexto anterior', 'Patrimonio', 'Autores repetidos'],
    entities: repeated.map((item) => publicEntity(item.agent, `${item.relation.brotherhoods.size} hermandades`)),
    items: repeated.map((item) => {
      const brotherhoodNames = [...item.relation.brotherhoods.keys()]
        .map((id) => brotherhoodById.get(id)?.name)
        .filter(Boolean)
        .sort((first, second) => first.localeCompare(second, 'es'))
      return {
        label: item.agent.name,
        meta: `${brotherhoodNames.length} hermandades · ${brotherhoodNames.join(' · ')}`,
        group: `${brotherhoodNames.length} hermandades`,
      }
    }),
    evidence: [{
      key: 'brotherhood-set-repeated-agents',
      label: 'Autorías de imágenes y trabajos de paso',
      detail: `${repeated.length} profesionales repetidos entre ${brotherhoods.length} hermandades`,
    }],
    followUps: ['Ordénalas por antigüedad.', '¿Cuáles llevan banda de música?', '¿Qué cultos tienen próximamente?'],
    context: setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_repeated_agents'),
    compactItemLimit: Math.min(Math.max(repeated.length, 4), 10),
  })
}

export async function askHiloCofradeSetReasoningV8(question, context = null) {
  const intent = setReasoningV8Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()

  try {
    if (intent.kind === 'brotherhood_set_foundation_order') {
      return orderByFoundation(supabase, context, intent.direction)
    }
    if (intent.kind === 'brotherhood_set_upcoming_cults') {
      return upcomingCultsForSet(supabase, context)
    }
    if (intent.kind === 'brotherhood_set_repeated_agents') {
      return repeatedAgentsForSet(supabase, context)
    }
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en razonamiento de conjuntos V8', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
