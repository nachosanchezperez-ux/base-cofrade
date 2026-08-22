import 'server-only'

import { askHiloCofradeV4 } from '@/lib/supabase/tira-del-hilo-v4'
import { createClient } from '@/lib/supabase/server'
import { addUndirectedEdge, shortestGraphPath } from '@/lib/graph-path'
import { normalizeTira, typeNoun } from '@/lib/tira-context'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
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

function notDocumented(text, context = null) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: [],
    items: [],
    followUps: [],
    context,
  }
}

function setContext(entities, sourceIntent) {
  const entityType = entities[0]?.entity_type || ''
  const ids = entities.filter((item) => item.entity_type === entityType).map((item) => item.id).slice(0, 12)
  return ids.length
    ? {
        entityId: null,
        entityType: null,
        name: '',
        resultSet: {
          entityType,
          entityIds: ids,
          count: ids.length,
          label: `${ids.length} ${typeNoun(entityType, ids.length)}`,
          sourceIntent,
        },
      }
    : null
}

function entityNameVariants(name = '', entityType = '') {
  const normalized = normalizeTira(name)
  const variants = new Set([normalized])
  if (entityType === 'brotherhood') {
    variants.add(normalized.replace(/^hermandad de /, ''))
    variants.add(normalized.replace(/^hermandad /, ''))
  }
  if (entityType === 'band') {
    variants.add(normalized.replace(/^banda de /, ''))
    variants.add(normalized.replace(/^banda /, ''))
  }
  for (const value of [...variants]) {
    variants.add(value.replace(/^(la|el) /, ''))
  }
  return [...variants].filter((value) => value.length >= 5)
}

function entityScore(entity, question) {
  const q = normalizeTira(question)
  const variants = entityNameVariants(entity.name, entity.entity_type)
  const direct = variants.filter((variant) => q.includes(variant)).sort((a, b) => b.length - a.length)[0]
  return direct ? 1000 + direct.length : 0
}

async function allPublicEntities(supabase) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

function namedEntities(question, entities) {
  return entities
    .map((entity) => ({ entity, score: entityScore(entity, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.entity)
    .filter((entity, index, list) => list.findIndex((candidate) => candidate.id === entity.id) === index)
}

async function entitiesByIds(supabase, ids = [], entityType = null) {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 50)
  if (!unique.length) return []
  let query = supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .eq('status', 'published')
  if (entityType) query = query.eq('entity_type', entityType)
  const result = await query
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((item) => [item.id, item]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function isBandRankingQuestion(question) {
  const q = normalizeTira(question)
  return /\b(banda|bandas)\b/.test(q)
    && /\b(mas|mayor)\b/.test(q)
    && /\b(hermandad|hermandades)\b/.test(q)
}

function isAgentRankingQuestion(question) {
  const q = normalizeTira(question)
  return /\b(autor|autores|profesional|profesionales|artista|artistas|quien)\b/.test(q)
    && /\b(mas|mayor)\b/.test(q)
    && /\b(paso|pasos)\b/.test(q)
}

function isComposerBrotherhoodRanking(question) {
  const q = normalizeTira(question)
  return /\b(compositor|compositores)\b/.test(q)
    && /\b(mas|mayor)\b/.test(q)
    && /\b(marcha|marchas|composiciones)\b/.test(q)
}

function isConnectionQuestion(question) {
  const q = normalizeTira(question)
  return !question.includes(',')
    && /\b(relacion|conexion|vinculo|camino|conecta|conectan)\b/.test(q)
    && /\bentre\b/.test(q)
}

async function rankBandsByBrotherhoods(supabase, context, question) {
  const q = normalizeTira(question)
  const historical = /\b(historic|historicamente|historia|a lo largo)\w*/.test(q)
  let bands = []

  if (context?.resultSet?.entityType === 'band') {
    bands = await entitiesByIds(supabase, context.resultSet.entityIds, 'band')
  } else {
    const all = await allPublicEntities(supabase)
    bands = all.filter((item) => item.entity_type === 'band')
  }
  if (!bands.length) return notDocumented('No hay bandas públicas suficientes para realizar ese recuento.', context)

  const ids = bands.map((band) => band.id)
  const relationResult = historical
    ? await supabase
        .from('music_accompaniment_periods')
        .select('band_entity_id, brotherhood_entity_id')
        .in('band_entity_id', ids)
        .eq('status', 'published')
    : await supabase
        .from('current_music_accompaniments')
        .select('band_entity_id, brotherhood_entity_id')
        .in('band_entity_id', ids)
  if (relationResult.error) throw relationResult.error

  const counts = new Map(ids.map((id) => [id, new Set()]))
  ;(relationResult.data || []).forEach((row) => counts.get(row.band_entity_id)?.add(row.brotherhood_entity_id))
  const ranked = bands
    .map((band) => ({ band, count: counts.get(band.id)?.size || 0 }))
    .sort((a, b) => b.count - a.count || a.band.name.localeCompare(b.band.name, 'es'))
  const leader = ranked[0]
  const scope = context?.resultSet?.entityType === 'band' ? 'dentro del conjunto anterior' : 'entre las bandas publicadas'
  const timeLabel = historical ? 'en relaciones históricas publicadas' : 'mediante acompañamientos actuales publicados'

  return answer({
    text: `${leader.band.name} es la banda conectada con más hermandades ${scope}: ${leader.count} ${leader.count === 1 ? 'hermandad' : 'hermandades'} ${timeLabel}.`,
    path: ['Bandas', historical ? 'Acompañamientos históricos' : 'Acompañamientos actuales', 'Hermandades', 'Recuento'],
    entities: [publicEntity(leader.band)],
    items: ranked.slice(0, 12).map(({ band, count }) => ({
      label: band.name,
      meta: `${count} ${count === 1 ? 'hermandad relacionada' : 'hermandades relacionadas'}`,
      href: entityHref(band),
    })),
    followUps: historical ? ['¿Y si miramos solo los acompañamientos actuales?', 'Compáralas.'] : ['¿Y contando también relaciones históricas?', 'Compáralas.'],
    context: setContext(ranked.slice(0, 12).map((item) => item.band), historical ? 'band_historical_ranking' : 'band_current_ranking'),
  })
}

async function rankAgentsBySteps(supabase, context) {
  let agents = []
  if (context?.resultSet?.entityType === 'agent') {
    agents = await entitiesByIds(supabase, context.resultSet.entityIds, 'agent')
  } else {
    const all = await allPublicEntities(supabase)
    agents = all.filter((item) => item.entity_type === 'agent')
  }
  if (!agents.length) return notDocumented('No hay autores o profesionales públicos suficientes para realizar ese recuento.', context)

  const ids = agents.map((agent) => agent.id)
  const result = await supabase
    .from('step_phase_details')
    .select('agent_entity_id, step_entity_id, discipline')
    .in('agent_entity_id', ids)
  if (result.error) throw result.error

  const steps = new Map(ids.map((id) => [id, new Set()]))
  const disciplines = new Map(ids.map((id) => [id, new Set()]))
  ;(result.data || []).forEach((row) => {
    steps.get(row.agent_entity_id)?.add(row.step_entity_id)
    if (row.discipline) disciplines.get(row.agent_entity_id)?.add(row.discipline)
  })
  const ranked = agents
    .map((agent) => ({ agent, count: steps.get(agent.id)?.size || 0, disciplines: [...(disciplines.get(agent.id) || [])] }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.agent.name.localeCompare(b.agent.name, 'es'))
  if (!ranked.length) return notDocumented('No hay trabajos de paso estructurados para ese conjunto de profesionales.', context)
  const leader = ranked[0]
  const scope = context?.resultSet?.entityType === 'agent' ? 'dentro del conjunto anterior' : 'entre los profesionales publicados'

  return answer({
    text: `${leader.agent.name} es quien aparece en más pasos ${scope}: ${leader.count} ${typeNoun('step', leader.count)} con fases o trabajos documentados.`,
    path: ['Autores / profesionales', 'Fases de paso', 'Pasos', 'Recuento'],
    entities: [publicEntity(leader.agent)],
    items: ranked.slice(0, 12).map(({ agent, count, disciplines: values }) => ({
      label: agent.name,
      meta: [`${count} ${typeNoun('step', count)}`, values.slice(0, 3).join(', ')].filter(Boolean).join(' · '),
      href: '',
    })),
    followUps: leader ? [`¿En qué pasos trabajó ${leader.agent.name}?`, 'Enséñame solo los orfebres.', 'Compáralos.'] : [],
    context: setContext(ranked.slice(0, 12).map((item) => item.agent), 'agent_step_ranking'),
  })
}

async function rankComposersForBrotherhood(supabase, question) {
  const all = await allPublicEntities(supabase)
  const brotherhood = namedEntities(question, all).find((item) => item.entity_type === 'brotherhood')
  if (!brotherhood) return null

  const dedicationResult = await supabase
    .from('march_dedications')
    .select('march_entity_id')
    .eq('dedicatee_entity_id', brotherhood.id)
    .eq('status', 'published')
  if (dedicationResult.error) throw dedicationResult.error
  const marchIds = [...new Set((dedicationResult.data || []).map((row) => row.march_entity_id).filter(Boolean))]
  if (!marchIds.length) return notDocumented(`No hay marchas publicadas dedicadas directamente a ${brotherhood.name} suficientes para realizar ese recuento.`)

  const authorResult = await supabase
    .from('march_authors')
    .select('march_entity_id, agent_entity_id, author_role')
    .in('march_entity_id', marchIds)
    .eq('author_role', 'composer')
    .eq('status', 'published')
  if (authorResult.error) throw authorResult.error

  const counts = new Map()
  ;(authorResult.data || []).forEach((row) => {
    const current = counts.get(row.agent_entity_id) || new Set()
    current.add(row.march_entity_id)
    counts.set(row.agent_entity_id, current)
  })
  const agents = await entitiesByIds(supabase, [...counts.keys()], 'agent')
  const ranked = agents
    .map((agent) => ({ agent, count: counts.get(agent.id)?.size || 0 }))
    .sort((a, b) => b.count - a.count || a.agent.name.localeCompare(b.agent.name, 'es'))
  if (!ranked.length) return notDocumented(`Las marchas de ${brotherhood.name} todavía no tienen compositores estructurados suficientes para ese recuento.`)
  const leader = ranked[0]

  return answer({
    text: `${leader.agent.name} es el compositor con más marchas dedicadas directamente a ${brotherhood.name} en los datos publicados: ${leader.count}.`,
    path: ['Hermandad', 'Marchas dedicadas', 'Compositores', 'Recuento'],
    entities: [publicEntity(brotherhood), publicEntity(leader.agent)],
    items: ranked.slice(0, 12).map(({ agent, count }) => ({
      label: agent.name,
      meta: `${count} ${count === 1 ? 'marcha dedicada' : 'marchas dedicadas'}`,
      href: '',
    })),
    followUps: [`¿Qué marchas de ${brotherhood.name} ha compuesto ${leader.agent.name}?`, 'Compáralos.'],
    context: setContext(ranked.slice(0, 12).map((item) => item.agent), 'brotherhood_composer_ranking'),
  })
}

function relationLabel(value, fallback) {
  const text = String(value || '').trim()
  if (!text) return fallback
  return text.replace(/_/g, ' ')
}

async function buildPublishedGraph(supabase, entities) {
  const publicIds = new Set(entities.map((entity) => entity.id))
  const adjacency = new Map()
  const [
    brotherhoodSteps,
    brotherhoodImages,
    imageSteps,
    personnel,
    music,
    marchAuthors,
    dedications,
    imageAuthors,
  ] = await Promise.all([
    supabase.from('brotherhood_steps').select('brotherhood_entity_id, step_entity_id, relation_type').eq('status', 'published'),
    supabase.from('brotherhood_images').select('brotherhood_entity_id, image_entity_id, relation_type').eq('status', 'published'),
    supabase.from('image_steps').select('image_entity_id, step_entity_id, relation_type').eq('status', 'published'),
    supabase.from('current_step_personnel').select('step_entity_id, agent_entity_id, role_name, date_from_text'),
    supabase.from('current_music_accompaniments').select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type'),
    supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').eq('status', 'published'),
    supabase.from('march_dedications').select('march_entity_id, dedicatee_entity_id, dedication_type').eq('status', 'published'),
    supabase.from('image_authorships').select('image_entity_id, agent_entity_id, authorship_type, role_name').eq('status', 'published'),
  ])

  const results = [brotherhoodSteps, brotherhoodImages, imageSteps, personnel, music, marchAuthors, dedications, imageAuthors]
  const error = results.find((result) => result.error)?.error
  if (error) throw error

  const add = (from, to, relation, detail = '') => {
    if (!publicIds.has(from) || !publicIds.has(to)) return
    addUndirectedEdge(adjacency, from, to, relation, detail)
  }

  ;(brotherhoodSteps.data || []).forEach((row) => add(row.brotherhood_entity_id, row.step_entity_id, relationLabel(row.relation_type, 'Paso de la hermandad')))
  ;(brotherhoodImages.data || []).forEach((row) => add(row.brotherhood_entity_id, row.image_entity_id, relationLabel(row.relation_type, 'Imagen de la hermandad')))
  ;(imageSteps.data || []).forEach((row) => add(row.image_entity_id, row.step_entity_id, relationLabel(row.relation_type, 'Imagen en el paso')))
  ;(personnel.data || []).forEach((row) => add(row.step_entity_id, row.agent_entity_id, row.role_name || 'Personal actual del paso', row.date_from_text || ''))
  ;(music.data || []).forEach((row) => {
    add(row.brotherhood_entity_id, row.band_entity_id, 'Acompañamiento musical actual', [row.outing_type, row.position].filter(Boolean).join(' · '))
    if (row.step_entity_id) add(row.step_entity_id, row.band_entity_id, 'Banda del paso', [row.outing_type, row.position].filter(Boolean).join(' · '))
  })
  ;(marchAuthors.data || []).forEach((row) => add(row.march_entity_id, row.agent_entity_id, row.author_role === 'composer' ? 'Composición' : relationLabel(row.author_role, 'Autoría musical')))
  ;(dedications.data || []).forEach((row) => add(row.march_entity_id, row.dedicatee_entity_id, relationLabel(row.dedication_type, 'Dedicatoria musical')))
  ;(imageAuthors.data || []).forEach((row) => add(row.image_entity_id, row.agent_entity_id, row.role_name || relationLabel(row.authorship_type, 'Autoría de imagen')))

  return adjacency
}

async function connectionBetweenEntities(supabase, question) {
  const entities = await allPublicEntities(supabase)
  const detected = namedEntities(question, entities)
  if (detected.length < 2) return null

  const [start, target] = detected
  const adjacency = await buildPublishedGraph(supabase, entities)
  const graphPath = shortestGraphPath(adjacency, start.id, target.id, 6)
  if (!graphPath) {
    return notDocumented(`No encuentro un camino de hasta seis relaciones publicadas entre ${start.name} y ${target.name}.`)
  }

  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const nodes = graphPath.nodes.map((id) => entityById.get(id)).filter(Boolean)
  const items = graphPath.edges.map((edge, index) => {
    const from = entityById.get(edge.from)
    const to = entityById.get(edge.to)
    return {
      label: `${from?.name || 'Entidad'} → ${to?.name || 'Entidad'}`,
      meta: [edge.relation, edge.detail].filter(Boolean).join(' · '),
      href: entityHref(to),
      index,
    }
  })

  return answer({
    text: `He encontrado un camino documentado de ${graphPath.edges.length} ${graphPath.edges.length === 1 ? 'relación' : 'relaciones'} entre ${start.name} y ${target.name}.`,
    path: nodes.map((node) => TYPE_LABELS[node.entity_type] || 'Entidad'),
    entities: nodes.slice(0, 8).map((node) => publicEntity(node)),
    items,
    followUps: nodes.length > 2 ? [`Cuéntame sobre ${nodes[1].name}`, `Cuéntame sobre ${nodes[nodes.length - 2].name}`] : [],
    context: null,
  })
}

export async function askHiloCofradeReasoning(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  const q = normalizeTira(clean)
  const hasSet = Boolean(context?.resultSet?.entityType)

  try {
    const supabase = await createClient()

    if (context?.resultSet?.entityType === 'agent' && isAgentRankingQuestion(clean)) {
      return await rankAgentsBySteps(supabase, context)
    }

    if (context?.resultSet?.entityType === 'band' && isBandRankingQuestion(clean)) {
      return await rankBandsByBrotherhoods(supabase, context, clean)
    }

    if (!hasSet && isComposerBrotherhoodRanking(clean)) {
      const ranked = await rankComposersForBrotherhood(supabase, clean)
      if (ranked) return ranked
    }

    if (!hasSet && isBandRankingQuestion(clean)) {
      return await rankBandsByBrotherhoods(supabase, null, clean)
    }

    if (!hasSet && isAgentRankingQuestion(clean)) {
      return await rankAgentsBySteps(supabase, null)
    }

    if (!hasSet && isConnectionQuestion(clean) && !/refugiame/.test(q)) {
      const connection = await connectionBetweenEntities(supabase, clean)
      if (connection) return connection
    }
  } catch (error) {
    console.error('[Hilo Cofrade] Error en razonamiento del grafo', {
      question: clean,
      error: error instanceof Error ? error.message : String(error),
    })
    return notDocumented('No he podido completar ese razonamiento ahora mismo. Prefiero no inferir una relación que el grafo no pueda demostrar.', context)
  }

  return askHiloCofradeV4(clean, context)
}
