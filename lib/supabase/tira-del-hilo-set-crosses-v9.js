import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { publicText } from '@/lib/supabase/public-entity-page'
import { setCrossesV9Intent } from '@/lib/tira-set-crosses-v9'

function href(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  return ''
}

function typeLabel(entityType = '') {
  if (entityType === 'brotherhood') return 'Hermandad'
  if (entityType === 'band') return 'Banda'
  if (entityType === 'image') return 'Imagen'
  if (entityType === 'march') return 'Marcha'
  if (entityType === 'agent') return 'Autor / profesional'
  return 'Entidad'
}

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: typeLabel(entity.entity_type),
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

async function repeatedBandsForSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))

  const result = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type')
    .in('brotherhood_entity_id', ids)
  if (result.error) throw result.error

  const byBand = new Map()
  for (const row of result.data || []) {
    if (!row.band_entity_id || !row.brotherhood_entity_id) continue
    const entry = byBand.get(row.band_entity_id) || { brotherhoodIds: new Set(), rows: [] }
    entry.brotherhoodIds.add(row.brotherhood_entity_id)
    entry.rows.push(row)
    byBand.set(row.band_entity_id, entry)
  }

  const repeatedIds = [...byBand.entries()]
    .filter(([, value]) => value.brotherhoodIds.size >= 2)
    .map(([bandId]) => bandId)
  const bands = await entitiesByIds(supabase, repeatedIds, 'band')
  const bandById = new Map(bands.map((band) => [band.id, band]))
  const repeated = repeatedIds
    .map((bandId) => ({ band: bandById.get(bandId), relation: byBand.get(bandId) }))
    .filter((item) => item.band)
    .sort((first, second) => (
      second.relation.brotherhoodIds.size - first.relation.brotherhoodIds.size
      || first.band.name.localeCompare(second.band.name, 'es')
    ))

  const preserved = setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_repeated_bands')
  if (!repeated.length) {
    return notDocumented('No hay una misma banda con acompañamiento actual publicado en al menos dos hermandades del conjunto anterior.', preserved)
  }

  return answer({
    text: `He encontrado ${repeated.length} ${repeated.length === 1 ? 'banda que se repite' : 'bandas que se repiten'} en los acompañamientos actuales de al menos dos hermandades del conjunto anterior.`,
    path: ['Contexto anterior', 'Música', 'Bandas repetidas'],
    entities: repeated.map((item) => publicEntity(item.band, `${item.relation.brotherhoodIds.size} hermandades`)),
    items: repeated.map((item) => {
      const names = [...item.relation.brotherhoodIds]
        .map((id) => brotherhoodById.get(id)?.name)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'es'))
      return {
        label: item.band.name,
        meta: `${names.length} hermandades · ${names.join(' · ')}`,
        href: href(item.band),
      }
    }),
    evidence: [{
      key: 'brotherhood-set-repeated-bands',
      label: 'Acompañamientos musicales actuales',
      detail: `${repeated.length} bandas repetidas entre ${brotherhoods.length} hermandades`,
    }],
    followUps: ['¿Qué marchas tienen dedicadas?', '¿Qué imágenes comparten autor?', 'Compáralas.'],
    context: preserved,
    compactItemLimit: Math.min(Math.max(repeated.length, 3), 10),
  })
}

async function dedicatedMarchesForSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))

  const titularLinks = await supabase
    .from('brotherhood_images')
    .select('brotherhood_entity_id, image_entity_id')
    .in('brotherhood_entity_id', ids)
    .eq('relation_type', 'titular')
    .eq('status', 'published')
  if (titularLinks.error) throw titularLinks.error

  const imageOwners = new Map()
  for (const row of titularLinks.data || []) {
    const owners = imageOwners.get(row.image_entity_id) || new Set()
    owners.add(row.brotherhood_entity_id)
    imageOwners.set(row.image_entity_id, owners)
  }
  const dedicateeIds = [...new Set([...ids, ...imageOwners.keys()])]
  const dedicationResult = await supabase
    .from('march_dedications')
    .select('march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, date_from_text')
    .in('dedicatee_entity_id', dedicateeIds)
    .eq('status', 'published')
  if (dedicationResult.error) throw dedicationResult.error
  const rows = dedicationResult.data || []
  if (!rows.length) {
    return notDocumented('No hay marchas con dedicatorias publicadas dirigidas a estas hermandades o a sus imágenes titulares.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_dedicated_marches'))
  }

  const marches = await entitiesByIds(supabase, rows.map((row) => row.march_entity_id), 'march')
  const images = await entitiesByIds(supabase, [...imageOwners.keys()], 'image')
  const marchById = new Map(marches.map((item) => [item.id, item]))
  const imageById = new Map(images.map((item) => [item.id, item]))
  const grouped = new Map()

  for (const row of rows) {
    const march = marchById.get(row.march_entity_id)
    if (!march) continue
    const directBrotherhood = brotherhoodById.get(row.dedicatee_entity_id)
    const ownerIds = directBrotherhood
      ? [directBrotherhood.id]
      : [...(imageOwners.get(row.dedicatee_entity_id) || [])]
    if (!ownerIds.length) continue

    const entry = grouped.get(march.id) || { march, targets: [] }
    for (const brotherhoodId of ownerIds) {
      const brotherhood = brotherhoodById.get(brotherhoodId)
      if (!brotherhood) continue
      const image = imageById.get(row.dedicatee_entity_id)
      entry.targets.push({
        brotherhood,
        dedicatee: directBrotherhood?.name || image?.name || row.dedication_text || 'Dedicatoria publicada',
        type: row.dedication_type || '',
      })
    }
    grouped.set(march.id, entry)
  }

  const items = [...grouped.values()]
    .sort((a, b) => a.march.name.localeCompare(b.march.name, 'es'))
  if (!items.length) {
    return notDocumented('No hay marchas publicadas que puedan vincularse de forma estructurada con las dedicatorias del conjunto anterior.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_dedicated_marches'))
  }

  return answer({
    text: `He encontrado ${items.length} ${items.length === 1 ? 'marcha dedicada' : 'marchas dedicadas'} a las hermandades del conjunto anterior o a sus imágenes titulares mediante dedicatorias publicadas.`,
    path: ['Contexto anterior', 'Música', 'Marchas dedicadas'],
    entities: items.slice(0, 12).map((item) => publicEntity(item.march)),
    items: items.slice(0, 30).map((item) => {
      const groups = [...new Map(item.targets.map((target) => [`${target.brotherhood.id}|${target.dedicatee}`, target])).values()]
      return {
        label: item.march.name,
        meta: groups.map((target) => [target.dedicatee, target.brotherhood.name].filter(Boolean).join(' · ')).join(' / '),
        href: href(item.march),
        group: groups[0]?.brotherhood?.name || 'Dedicatorias',
      }
    }),
    evidence: [{
      key: 'brotherhood-set-dedicated-marches',
      label: 'Dedicatorias musicales publicadas',
      detail: `${items.length} marchas · hermandades e imágenes titulares`,
    }],
    followUps: ['¿Qué bandas se repiten?', '¿Qué imágenes comparten autor?', 'Compáralas.'],
    context: setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_dedicated_marches'),
    compactItemLimit: Math.min(Math.max(items.length, 5), 12),
  })
}

async function sharedAuthorImagesForSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))

  const links = await supabase
    .from('brotherhood_images')
    .select('brotherhood_entity_id, image_entity_id')
    .in('brotherhood_entity_id', ids)
    .eq('status', 'published')
  if (links.error) throw links.error

  const owners = new Map()
  for (const row of links.data || []) {
    const current = owners.get(row.image_entity_id) || new Set()
    current.add(row.brotherhood_entity_id)
    owners.set(row.image_entity_id, current)
  }
  const imageIds = [...owners.keys()]
  if (!imageIds.length) {
    return notDocumented('El conjunto anterior no tiene imágenes publicadas suficientes para cruzar autorías.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_shared_author_images'))
  }

  const authorships = await supabase
    .from('image_authorships')
    .select('image_entity_id, agent_entity_id, role_name')
    .in('image_entity_id', imageIds)
    .eq('status', 'published')
  if (authorships.error) throw authorships.error

  const byAgent = new Map()
  for (const row of authorships.data || []) {
    if (!row.agent_entity_id) continue
    const entry = byAgent.get(row.agent_entity_id) || { imageIds: new Set(), brotherhoodIds: new Set(), rows: [] }
    entry.imageIds.add(row.image_entity_id)
    for (const brotherhoodId of owners.get(row.image_entity_id) || []) entry.brotherhoodIds.add(brotherhoodId)
    entry.rows.push(row)
    byAgent.set(row.agent_entity_id, entry)
  }

  const sharedAgentIds = [...byAgent.entries()]
    .filter(([, value]) => value.imageIds.size >= 2 && value.brotherhoodIds.size >= 2)
    .map(([agentId]) => agentId)
  const agents = await entitiesByIds(supabase, sharedAgentIds, 'agent')
  const images = await entitiesByIds(supabase, imageIds, 'image')
  const agentById = new Map(agents.map((item) => [item.id, item]))
  const imageById = new Map(images.map((item) => [item.id, item]))

  const groups = sharedAgentIds
    .map((agentId) => ({ agent: agentById.get(agentId), relation: byAgent.get(agentId) }))
    .filter((item) => item.agent)
    .sort((a, b) => (
      b.relation.brotherhoodIds.size - a.relation.brotherhoodIds.size
      || a.agent.name.localeCompare(b.agent.name, 'es')
    ))

  if (!groups.length) {
    return notDocumented('No hay imágenes de hermandades distintas del conjunto anterior que compartan una autoría estructurada.', setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_shared_author_images'))
  }

  const responseItems = []
  for (const group of groups) {
    for (const imageId of group.relation.imageIds) {
      const image = imageById.get(imageId)
      if (!image) continue
      const ownerNames = [...(owners.get(imageId) || [])]
        .map((id) => brotherhoodById.get(id)?.name)
        .filter(Boolean)
      responseItems.push({
        label: image.name,
        meta: ownerNames.join(' · '),
        href: href(image),
        group: group.agent.name,
      })
    }
  }

  return answer({
    text: `He encontrado ${groups.length} ${groups.length === 1 ? 'autor compartido' : 'autores compartidos'} con imágenes publicadas en al menos dos hermandades distintas del conjunto anterior.`,
    path: ['Contexto anterior', 'Imágenes', 'Autoría compartida'],
    entities: groups.map((group) => publicEntity(group.agent, `${group.relation.imageIds.size} imágenes`)),
    items: responseItems.slice(0, 30),
    evidence: [{
      key: 'brotherhood-set-shared-author-images',
      label: 'Autorías de imágenes publicadas',
      detail: `${groups.length} autores compartidos · ${responseItems.length} relaciones visibles`,
    }],
    followUps: ['¿Qué marchas tienen dedicadas?', '¿Qué bandas se repiten?', 'Compáralas.'],
    context: setContext(context, ids, `${brotherhoods.length} hermandades`, 'brotherhood_set_shared_author_images'),
    compactItemLimit: Math.min(Math.max(responseItems.length, 5), 12),
  })
}

async function compareBrotherhoodSet(supabase, context) {
  const ids = resultSetIds(context)
  const brotherhoods = await entitiesByIds(supabase, ids, 'brotherhood')
  if (brotherhoods.length < 2) return null

  const [details, imageLinks, stepLinks, musicRows, cultRows] = await Promise.all([
    supabase
      .from('brotherhoods')
      .select('entity_id, foundation_text, brotherhood_types, current_procession_day, municipality_id, canonical_see_place_id')
      .in('entity_id', ids),
    supabase
      .from('brotherhood_images')
      .select('brotherhood_entity_id, relation_type')
      .in('brotherhood_entity_id', ids)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('brotherhood_entity_id')
      .in('brotherhood_entity_id', ids)
      .eq('status', 'published'),
    supabase
      .from('current_music_accompaniments')
      .select('brotherhood_entity_id, band_entity_id')
      .in('brotherhood_entity_id', ids),
    supabase
      .from('calendar_cult_days')
      .select('brotherhood_entity_id, occurrence_id, calendar_item_id, event_status, item_date')
      .in('brotherhood_entity_id', ids)
      .gte('item_date', madridToday()),
  ])
  for (const result of [details, imageLinks, stepLinks, musicRows, cultRows]) {
    if (result.error) throw result.error
  }

  const detailById = new Map((details.data || []).map((row) => [row.entity_id, row]))
  const municipalityIds = [...new Set((details.data || []).map((row) => row.municipality_id).filter(Boolean))]
  const placeIds = [...new Set((details.data || []).map((row) => row.canonical_see_place_id).filter(Boolean))]
  const [municipalities, places] = await Promise.all([
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name').in('id', municipalityIds)
      : Promise.resolve({ data: [], error: null }),
    placeIds.length
      ? supabase.from('places').select('id, name').in('id', placeIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  if (municipalities.error) throw municipalities.error
  if (places.error) throw places.error
  const municipalityById = new Map((municipalities.data || []).map((row) => [row.id, row.name]))
  const placeById = new Map((places.data || []).map((row) => [row.id, row.name]))

  const countBy = (rows, field, filter = () => true) => {
    const map = new Map()
    for (const row of rows || []) {
      if (!filter(row)) continue
      map.set(row[field], (map.get(row[field]) || 0) + 1)
    }
    return map
  }
  const titularCounts = countBy(imageLinks.data, 'brotherhood_entity_id', (row) => row.relation_type === 'titular')
  const stepCounts = countBy(stepLinks.data, 'brotherhood_entity_id')
  const bandSets = new Map()
  for (const row of musicRows.data || []) {
    const set = bandSets.get(row.brotherhood_entity_id) || new Set()
    if (row.band_entity_id) set.add(row.band_entity_id)
    bandSets.set(row.brotherhood_entity_id, set)
  }
  const cultSets = new Map()
  for (const row of cultRows.data || []) {
    if (String(row.event_status || '').toLowerCase() === 'cancelled') continue
    const set = cultSets.get(row.brotherhood_entity_id) || new Set()
    set.add(row.occurrence_id || row.calendar_item_id)
    cultSets.set(row.brotherhood_entity_id, set)
  }

  const compared = brotherhoods.map((brotherhood) => {
    const row = detailById.get(brotherhood.id) || {}
    return {
      brotherhood,
      foundation: publicText(row.foundation_text || ''),
      types: (row.brotherhood_types || []).filter(Boolean),
      day: publicText(row.current_procession_day || ''),
      municipality: municipalityById.get(row.municipality_id) || '',
      place: placeById.get(row.canonical_see_place_id) || '',
      titulars: titularCounts.get(brotherhood.id) || 0,
      steps: stepCounts.get(brotherhood.id) || 0,
      bands: bandSets.get(brotherhood.id)?.size || 0,
      futureCults: cultSets.get(brotherhood.id)?.size || 0,
    }
  })

  return answer({
    text: `Comparo las ${compared.length} hermandades del conjunto anterior con los mismos campos publicados: fundación, tipo, jornada, sede, titulares, pasos, acompañamientos musicales actuales y cultos futuros. No se asigna un ganador ni una valoración global.`,
    path: ['Contexto anterior', 'Hermandades', 'Comparación estructurada'],
    entities: compared.map((item) => publicEntity(item.brotherhood)),
    items: compared.map((item) => ({
      label: item.brotherhood.name,
      meta: [
        item.foundation ? `Fundación: ${item.foundation}` : 'Fundación: sin dato ordenable',
        item.types.length ? `Tipo: ${item.types.join(', ')}` : '',
        item.day ? `Jornada: ${item.day}` : '',
        [item.place, item.municipality].filter(Boolean).length ? `Sede: ${[item.place, item.municipality].filter(Boolean).join(' · ')}` : '',
        `${item.titulars} titulares`,
        `${item.steps} pasos`,
        `${item.bands} bandas actuales`,
        `${item.futureCults} cultos futuros`,
      ].filter(Boolean).join(' · '),
      href: href(item.brotherhood),
    })),
    evidence: [{
      key: 'brotherhood-set-compare',
      label: 'Comparación sobre campos estructurados',
      detail: `${compared.length} hermandades · 8 dimensiones documentales`,
    }],
    followUps: ['¿Qué bandas se repiten?', '¿Qué marchas tienen dedicadas?', '¿Qué imágenes comparten autor?'],
    context: setContext(context, ids, `${brotherhoods.length} hermandades comparadas`, 'brotherhood_set_compare'),
    compactItemLimit: Math.min(Math.max(compared.length, 4), 12),
  })
}

export async function askHiloCofradeSetCrossesV9(question, context = null) {
  const intent = setCrossesV9Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()

  try {
    if (intent.kind === 'brotherhood_set_repeated_bands') return repeatedBandsForSet(supabase, context)
    if (intent.kind === 'brotherhood_set_dedicated_marches') return dedicatedMarchesForSet(supabase, context)
    if (intent.kind === 'brotherhood_set_shared_author_images') return sharedAuthorImagesForSet(supabase, context)
    if (intent.kind === 'brotherhood_set_compare') return compareBrotherhoodSet(supabase, context)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en cruces de conjuntos V9', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
