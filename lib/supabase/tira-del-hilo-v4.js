import 'server-only'

import { askHiloCofradeV3 } from '@/lib/supabase/tira-del-hilo-v3'
import { createClient } from '@/lib/supabase/server'
import {
  disciplineFromQuestion,
  genericSetIntent,
  normalizeTira,
  typeNoun,
} from '@/lib/tira-context'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
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

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: entity.entity_type === 'brotherhood'
      ? 'Hermandad'
      : entity.entity_type === 'image'
        ? 'Imagen'
        : entity.entity_type === 'step'
          ? 'Paso'
          : entity.entity_type === 'band'
            ? 'Banda'
            : entity.entity_type === 'march'
              ? 'Marcha'
              : entity.entity_type === 'agent'
                ? 'Autor / profesional'
                : 'Entidad',
    name: entity.name,
    href: entityHref(entity),
    meta,
  }
}

async function publicEntitiesByIds(supabase, ids = [], entityType = null) {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 12)
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

async function publicEntityById(supabase, id) {
  if (!id) return null
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()
  if (result.error) throw result.error
  return result.data || null
}

async function publicEntitiesByNames(supabase, names = [], entityType) {
  const unique = [...new Set(names.filter(Boolean))].slice(0, 12)
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .in('name', unique)
  if (result.error) throw result.error
  const byName = new Map((result.data || []).map((entity) => [entity.name, entity]))
  return unique.map((name) => byName.get(name)).filter(Boolean)
}

function setContext({ root = null, entities = [], sourceIntent = '' }) {
  const entityType = entities[0]?.entity_type || ''
  const entityIds = entities
    .filter((entity) => entity.entity_type === entityType)
    .map((entity) => entity.id)
    .slice(0, 12)

  return {
    entityId: root?.id || null,
    entityType: root?.entity_type || null,
    name: root?.name || '',
    resultSet: {
      entityType,
      entityIds,
      count: entityIds.length,
      label: `${entityIds.length} ${typeNoun(entityType, entityIds.length)}`,
      sourceIntent,
    },
  }
}

async function resolveSet(supabase, context) {
  const set = context?.resultSet
  if (!set?.entityType || !Array.isArray(set.entityIds) || !set.entityIds.length) return null
  const entities = await publicEntitiesByIds(supabase, set.entityIds, set.entityType)
  if (!entities.length) return null
  const root = await publicEntityById(supabase, context?.entityId)
  return { entities, root, sourceIntent: set.sourceIntent || 'result_set' }
}

function hrefType(href = '') {
  if (/^\/hermandades\//.test(href)) return 'brotherhood'
  if (/^\/imagenes\//.test(href)) return 'image'
  if (/^\/pasos\//.test(href)) return 'step'
  if (/^\/bandas\//.test(href)) return 'band'
  return ''
}

function hrefSlug(href = '') {
  return String(href).split('/').filter(Boolean)[1] || ''
}

async function entitiesFromItemHrefs(supabase, items = []) {
  const typed = items
    .map((item) => ({ type: hrefType(item.href), slug: hrefSlug(item.href) }))
    .filter((item) => item.type && item.slug)
  if (!typed.length) return []

  const type = typed[0].type
  if (typed.some((item) => item.type !== type)) return []
  const slugs = [...new Set(typed.map((item) => item.slug))].slice(0, 12)
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', type)
    .eq('status', 'published')
    .in('slug', slugs)
  if (result.error) throw result.error
  const bySlug = new Map((result.data || []).map((entity) => [entity.slug, entity]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean)
}

function defaultSetFollowUps(entityType) {
  if (entityType === 'band') return ['¿Cuáles son bandas de música?', '¿Desde cuándo acompaña cada una?', '¿Cuál aparece relacionada con más hermandades?']
  if (entityType === 'agent') return ['Enséñame solo los orfebres.', '¿Quién aparece en más pasos?', 'Compáralos.']
  if (entityType === 'step') return ['¿Quién lleva cada uno?', '¿Qué bandas acompañan estos pasos?', 'Compáralos.']
  if (entityType === 'brotherhood') return ['¿Qué bandas acompañan a estas hermandades?', '¿Cuántos pasos tiene cada una?', 'Compáralas.']
  if (entityType === 'march') return ['¿Quién compuso cada una?', 'Compáralas.']
  return []
}

async function augmentResponseSet(supabase, response) {
  if (response?.kind !== 'answer' || response?.context?.resultSet) return response

  let entities = await entitiesFromItemHrefs(supabase, response.items || [])
  const pathKey = (response.path || []).join('|')

  if (!entities.length && pathKey === 'Autores|Fases de paso|Pasos compartidos') {
    entities = await publicEntitiesByNames(supabase, (response.items || []).map((item) => item.label), 'agent')
  }

  if (!entities.length && pathKey === 'Autor|Composición|Marchas') {
    entities = await publicEntitiesByNames(supabase, (response.items || []).map((item) => item.label), 'march')
  }

  if (entities.length < 1) return response
  const entityType = entities[0].entity_type
  if (!['band', 'agent', 'step', 'brotherhood', 'march', 'image'].includes(entityType)) return response

  const root = await publicEntityById(supabase, response?.context?.entityId)
  return {
    ...response,
    followUps: defaultSetFollowUps(entityType).length
      ? defaultSetFollowUps(entityType)
      : response.followUps,
    context: setContext({
      root,
      entities,
      sourceIntent: pathKey.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 64) || 'response_set',
    }),
  }
}

async function entityNamesByIds(supabase, ids = [], entityType = null) {
  const entities = await publicEntitiesByIds(supabase, ids, entityType)
  return new Map(entities.map((entity) => [entity.id, entity]))
}

async function municipalityNames(supabase, ids = []) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return new Map()
  const result = await supabase.from('municipalities').select('id, name').in('id', unique)
  if (result.error) throw result.error
  return new Map((result.data || []).map((item) => [item.id, item.name]))
}

function mentionedEntity(question, entities) {
  const q = normalizeTira(question)
  return entities
    .filter((entity) => normalizeTira(entity.name).length >= 5)
    .sort((a, b) => b.name.length - a.name.length)
    .find((entity) => q.includes(normalizeTira(entity.name))) || null
}

async function filterMusicBands(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase.from('bands').select('entity_id, band_type').in('entity_id', ids)
  if (result.error) throw result.error
  const musicIds = new Set((result.data || [])
    .filter((row) => /musica/i.test(normalizeTira(row.band_type)))
    .map((row) => row.entity_id))
  const bands = resolved.entities.filter((entity) => musicIds.has(entity.id))

  if (!bands.length) {
    return notDocumented(`Dentro de las ${resolved.entities.length} bandas anteriores no hay ninguna clasificada como banda de música en los datos publicados.`, setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }))
  }

  return answer({
    text: `De las ${resolved.entities.length} bandas anteriores, ${bands.length} ${bands.length === 1 ? 'está clasificada' : 'están clasificadas'} como banda de música.`,
    path: ['Contexto anterior', 'Bandas', 'Tipo de formación'],
    entities: bands.map((band) => publicEntity(band, 'Banda de música')),
    items: bands.map((band) => ({ label: band.name, meta: 'Banda de música', href: entityHref(band) })),
    followUps: ['¿Desde cuándo acompaña cada una?', '¿Cuál aparece relacionada con más hermandades?', 'Compáralas.'],
    context: setContext({ root: resolved.root, entities: bands, sourceIntent: 'band_filter_music' }),
  })
}

async function bandAccompanimentSince(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('current_music_accompaniments')
    .select('band_entity_id, brotherhood_entity_id, position, outing_type, year_from, date_from_text')
    .in('band_entity_id', ids)
  if (result.error) throw result.error
  const rows = result.data || []
  const brotherhoodById = await entityNamesByIds(supabase, rows.map((row) => row.brotherhood_entity_id), 'brotherhood')
  const rowsByBand = new Map()
  rows.forEach((row) => {
    const current = rowsByBand.get(row.band_entity_id) || []
    current.push(row)
    rowsByBand.set(row.band_entity_id, current)
  })

  return answer({
    text: `He revisado los acompañamientos actuales publicados de las ${resolved.entities.length} bandas anteriores. La fecha que muestro es el inicio documentado de cada relación actual cuando está disponible.`,
    path: ['Contexto anterior', 'Bandas', 'Acompañamientos actuales', 'Inicio'],
    items: resolved.entities.map((band) => {
      const relations = rowsByBand.get(band.id) || []
      const meta = relations.length
        ? relations.map((row) => [
            brotherhoodById.get(row.brotherhood_entity_id)?.name,
            row.year_from || row.date_from_text || 'Inicio por documentar',
            row.outing_type,
          ].filter(Boolean).join(' · ')).join(' / ')
        : 'Sin acompañamientos actuales publicados'
      return { label: band.name, meta, href: entityHref(band) }
    }),
    followUps: ['¿Cuál aparece relacionada con más hermandades?', 'Compáralas.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function bandBrotherhoodRanking(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('current_music_accompaniments')
    .select('band_entity_id, brotherhood_entity_id')
    .in('band_entity_id', ids)
  if (result.error) throw result.error

  const counts = new Map(ids.map((id) => [id, new Set()]))
  ;(result.data || []).forEach((row) => counts.get(row.band_entity_id)?.add(row.brotherhood_entity_id))
  const ranked = [...resolved.entities]
    .map((band) => ({ band, count: counts.get(band.id)?.size || 0 }))
    .sort((a, b) => b.count - a.count || a.band.name.localeCompare(b.band.name, 'es'))
  const leader = ranked[0]

  return answer({
    text: leader
      ? `${leader.band.name} es la que aparece relacionada actualmente con más hermandades dentro del conjunto: ${leader.count}.`
      : 'No hay relaciones actuales publicadas para comparar este conjunto.',
    path: ['Contexto anterior', 'Bandas', 'Acompañamientos', 'Hermandades', 'Recuento'],
    items: ranked.map(({ band, count }) => ({
      label: band.name,
      meta: `${count} ${count === 1 ? 'hermandad actual relacionada' : 'hermandades actuales relacionadas'}`,
      href: entityHref(band),
    })),
    followUps: ['¿Desde cuándo acompaña cada una?', 'Compáralas.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function compareBands(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const [bandResult, accompanimentResult] = await Promise.all([
    supabase.from('bands').select('entity_id, band_type, municipality_id, foundation_text').in('entity_id', ids),
    supabase.from('current_music_accompaniments').select('band_entity_id, brotherhood_entity_id').in('band_entity_id', ids),
  ])
  if (bandResult.error) throw bandResult.error
  if (accompanimentResult.error) throw accompanimentResult.error

  const bandById = new Map((bandResult.data || []).map((row) => [row.entity_id, row]))
  const municipalities = await municipalityNames(supabase, (bandResult.data || []).map((row) => row.municipality_id))
  const counts = new Map(ids.map((id) => [id, new Set()]))
  ;(accompanimentResult.data || []).forEach((row) => counts.get(row.band_entity_id)?.add(row.brotherhood_entity_id))

  return answer({
    text: `Comparo las ${resolved.entities.length} bandas anteriores con los campos homogéneos ya publicados: tipo, localidad, fundación y número de hermandades con acompañamiento actual.`,
    path: ['Contexto anterior', 'Bandas', 'Comparación'],
    items: resolved.entities.map((band) => {
      const row = bandById.get(band.id) || {}
      const count = counts.get(band.id)?.size || 0
      return {
        label: band.name,
        meta: [
          row.band_type || 'Tipo por documentar',
          municipalities.get(row.municipality_id),
          row.foundation_text ? `Fundación: ${row.foundation_text}` : '',
          `${count} ${count === 1 ? 'hermandad actual' : 'hermandades actuales'}`,
        ].filter(Boolean).join(' · '),
        href: entityHref(band),
      }
    }),
    followUps: ['¿Cuál aparece relacionada con más hermandades?', '¿Desde cuándo acompaña cada una?'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

function disciplineMatches(value, requested) {
  const haystack = normalizeTira(value)
  const aliases = {
    orfebreria: ['orfebreria', 'orfebre'],
    bordado: ['bordado', 'bordador'],
    talla: ['talla', 'tallista'],
    dorado: ['dorado', 'dorador'],
    escultura: ['escultura', 'escultor', 'imagineria', 'imaginero'],
    composicion: ['composicion', 'compositor', 'musica'],
    arquitectura: ['arquitectura', 'arquitecto'],
    pintura: ['pintura', 'pintor'],
    fotografia: ['fotografia', 'fotografo'],
    restauracion: ['restauracion', 'restaurador'],
  }
  return (aliases[requested] || [requested]).some((alias) => haystack.includes(alias))
}

async function filterAgentsByDiscipline(supabase, resolved, question) {
  const requested = disciplineFromQuestion(question)
  if (!requested) return notDocumented('No identifico qué disciplina quieres usar como filtro.', setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }))

  const ids = resolved.entities.map((entity) => entity.id)
  const [disciplineResult, phaseResult] = await Promise.all([
    supabase.from('agent_disciplines').select('agent_entity_id, discipline').in('agent_entity_id', ids),
    supabase.from('step_phase_details').select('agent_entity_id, discipline').in('agent_entity_id', ids),
  ])
  if (disciplineResult.error) throw disciplineResult.error
  if (phaseResult.error) throw phaseResult.error

  const matched = new Set()
  ;[...(disciplineResult.data || []), ...(phaseResult.data || [])].forEach((row) => {
    if (disciplineMatches(row.discipline, requested)) matched.add(row.agent_entity_id)
  })
  const agents = resolved.entities.filter((entity) => matched.has(entity.id))

  if (!agents.length) {
    return notDocumented(`No hay ${requested} documentados dentro del conjunto anterior.`, setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }))
  }

  return answer({
    text: `He filtrado el conjunto anterior por ${requested}: quedan ${agents.length} ${typeNoun('agent', agents.length)}.`,
    path: ['Contexto anterior', 'Autores y profesionales', 'Disciplina'],
    items: agents.map((agent) => ({ label: agent.name, meta: requested, href: '' })),
    followUps: agents[0] ? [`¿En qué pasos trabajó ${agents[0].name}?`, 'Compáralos.'] : [],
    context: setContext({ root: resolved.root, entities: agents, sourceIntent: `agent_filter_${requested}` }),
  })
}

async function stepsOfSetAgent(supabase, resolved, agent) {
  const result = await supabase
    .from('step_phase_details')
    .select('step_entity_id, step_name, discipline, role_name, phase_name, date_from_text, date_to_text')
    .eq('agent_entity_id', agent.id)
  if (result.error) throw result.error

  const rows = result.data || []
  const steps = await publicEntitiesByIds(supabase, rows.map((row) => row.step_entity_id), 'step')
  if (!steps.length) return notDocumented(`No hay pasos públicos relacionados con ${agent.name} mediante fases de ejecución documentadas.`, setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }))
  const rowsByStep = new Map()
  rows.forEach((row) => {
    const current = rowsByStep.get(row.step_entity_id) || []
    current.push(row)
    rowsByStep.set(row.step_entity_id, current)
  })

  return answer({
    text: `${agent.name} aparece documentado en ${steps.length} ${typeNoun('step', steps.length)} mediante fases o trabajos del paso.`,
    path: ['Autor / profesional', 'Fases de paso', 'Pasos'],
    entities: [publicEntity(agent)],
    items: steps.map((step) => ({
      label: step.name,
      meta: (rowsByStep.get(step.id) || []).map((row) => [row.discipline, row.role_name, row.phase_name, row.date_from_text].filter(Boolean).join(' · ')).join(' / '),
      href: entityHref(step),
    })),
    followUps: ['Compáralos.', '¿Quién lleva cada uno?', '¿Qué bandas acompañan estos pasos?'],
    context: setContext({ root: agent, entities: steps, sourceIntent: 'agent_steps' }),
  })
}

async function compareAgents(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const [phaseResult, marchResult] = await Promise.all([
    supabase.from('step_phase_details').select('agent_entity_id, step_entity_id, discipline').in('agent_entity_id', ids),
    supabase.from('march_authors').select('agent_entity_id, march_entity_id, author_role').in('agent_entity_id', ids).eq('status', 'published'),
  ])
  if (phaseResult.error) throw phaseResult.error
  if (marchResult.error) throw marchResult.error

  const steps = new Map(ids.map((id) => [id, new Set()]))
  const disciplines = new Map(ids.map((id) => [id, new Set()]))
  const marches = new Map(ids.map((id) => [id, new Set()]))
  ;(phaseResult.data || []).forEach((row) => {
    steps.get(row.agent_entity_id)?.add(row.step_entity_id)
    if (row.discipline) disciplines.get(row.agent_entity_id)?.add(row.discipline)
  })
  ;(marchResult.data || []).forEach((row) => marches.get(row.agent_entity_id)?.add(row.march_entity_id))

  return answer({
    text: `Comparo los ${resolved.entities.length} autores o profesionales anteriores por presencia documentada en pasos, disciplinas y marchas publicadas.`,
    path: ['Contexto anterior', 'Autores y profesionales', 'Comparación'],
    items: resolved.entities.map((agent) => ({
      label: agent.name,
      meta: [
        `${steps.get(agent.id)?.size || 0} pasos`,
        [...(disciplines.get(agent.id) || [])].slice(0, 3).join(', '),
        `${marches.get(agent.id)?.size || 0} marchas`,
      ].filter(Boolean).join(' · '),
      href: '',
    })),
    followUps: resolved.entities[0] ? [`¿En qué pasos trabajó ${resolved.entities[0].name}?`] : [],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function personnelOfSteps(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('current_step_personnel')
    .select('step_entity_id, agent_name, role_name, year_from, date_from_text')
    .in('step_entity_id', ids)
  if (result.error) throw result.error
  const rowsByStep = new Map()
  ;(result.data || []).forEach((row) => {
    const current = rowsByStep.get(row.step_entity_id) || []
    current.push(row)
    rowsByStep.set(row.step_entity_id, current)
  })

  return answer({
    text: `He consultado el personal actual documentado de los ${resolved.entities.length} pasos anteriores.`,
    path: ['Contexto anterior', 'Pasos', 'Personal actual'],
    items: resolved.entities.map((step) => {
      const rows = rowsByStep.get(step.id) || []
      return {
        label: step.name,
        meta: rows.length
          ? rows.map((row) => [row.agent_name, row.role_name, row.year_from || row.date_from_text].filter(Boolean).join(' · ')).join(' / ')
          : 'Personal actual por documentar',
        href: entityHref(step),
      }
    }),
    followUps: ['¿Qué bandas acompañan estos pasos?', 'Compáralos.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function bandsOfSteps(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('current_music_accompaniments')
    .select('step_entity_id, band_entity_id, position, outing_type, year_from, date_from_text')
    .in('step_entity_id', ids)
  if (result.error) throw result.error
  const bandById = await entityNamesByIds(supabase, (result.data || []).map((row) => row.band_entity_id), 'band')
  const rowsByStep = new Map()
  ;(result.data || []).forEach((row) => {
    const current = rowsByStep.get(row.step_entity_id) || []
    current.push(row)
    rowsByStep.set(row.step_entity_id, current)
  })

  return answer({
    text: `He cruzado los ${resolved.entities.length} pasos anteriores con los acompañamientos musicales actuales publicados.`,
    path: ['Contexto anterior', 'Pasos', 'Acompañamientos', 'Bandas'],
    items: resolved.entities.map((step) => {
      const rows = rowsByStep.get(step.id) || []
      return {
        label: step.name,
        meta: rows.length
          ? rows.map((row) => [bandById.get(row.band_entity_id)?.name, row.position, row.outing_type].filter(Boolean).join(' · ')).join(' / ')
          : 'Sin banda actual publicada para este paso',
        href: entityHref(step),
      }
    }),
    followUps: ['¿Quién lleva cada uno?', 'Compáralos.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function compareSteps(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const [stepResult, phaseResult, personnelResult] = await Promise.all([
    supabase.from('steps').select('entity_id, step_type, style, materials, dimensions_text, workbenches_count, carrier_system, execution_date_text').in('entity_id', ids),
    supabase.from('step_phase_details').select('step_entity_id, agent_entity_id').in('step_entity_id', ids),
    supabase.from('current_step_personnel').select('step_entity_id, agent_entity_id').in('step_entity_id', ids),
  ])
  if (stepResult.error) throw stepResult.error
  if (phaseResult.error) throw phaseResult.error
  if (personnelResult.error) throw personnelResult.error

  const stepById = new Map((stepResult.data || []).map((row) => [row.entity_id, row]))
  const agents = new Map(ids.map((id) => [id, new Set()]))
  const personnel = new Map(ids.map((id) => [id, new Set()]))
  ;(phaseResult.data || []).forEach((row) => row.agent_entity_id && agents.get(row.step_entity_id)?.add(row.agent_entity_id))
  ;(personnelResult.data || []).forEach((row) => row.agent_entity_id && personnel.get(row.step_entity_id)?.add(row.agent_entity_id))

  return answer({
    text: `Comparo los ${resolved.entities.length} pasos anteriores con los datos estructurados que comparten: tipología, datación, estilo/materiales, dimensiones, trabajaderas y autores o profesionales relacionados.`,
    path: ['Contexto anterior', 'Pasos', 'Comparación'],
    items: resolved.entities.map((step) => {
      const row = stepById.get(step.id) || {}
      return {
        label: step.name,
        meta: [
          row.step_type,
          row.execution_date_text,
          row.style,
          row.materials,
          row.dimensions_text,
          row.workbenches_count ? `${row.workbenches_count} trabajaderas` : '',
          `${agents.get(step.id)?.size || 0} autores/profesionales en fases`,
          `${personnel.get(step.id)?.size || 0} responsables actuales`,
        ].filter(Boolean).join(' · '),
        href: entityHref(step),
      }
    }),
    followUps: ['¿Quién lleva cada uno?', '¿Qué bandas acompañan estos pasos?'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function bandsOfBrotherhoodSet(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, band_entity_id, position, outing_type')
    .in('brotherhood_entity_id', ids)
  if (result.error) throw result.error
  const bandById = await entityNamesByIds(supabase, (result.data || []).map((row) => row.band_entity_id), 'band')
  const rowsByBrotherhood = new Map()
  ;(result.data || []).forEach((row) => {
    const current = rowsByBrotherhood.get(row.brotherhood_entity_id) || []
    current.push(row)
    rowsByBrotherhood.set(row.brotherhood_entity_id, current)
  })

  return answer({
    text: `He cruzado las ${resolved.entities.length} hermandades anteriores con sus acompañamientos musicales actuales publicados.`,
    path: ['Contexto anterior', 'Hermandades', 'Acompañamientos', 'Bandas'],
    items: resolved.entities.map((brotherhood) => {
      const rows = rowsByBrotherhood.get(brotherhood.id) || []
      return {
        label: brotherhood.name,
        meta: rows.length
          ? rows.map((row) => [bandById.get(row.band_entity_id)?.name, row.outing_type, row.position].filter(Boolean).join(' · ')).join(' / ')
          : 'Sin acompañamientos actuales publicados',
        href: entityHref(brotherhood),
      }
    }),
    followUps: ['¿Cuántos pasos tiene cada una?', 'Compáralas.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function stepCountsOfBrotherhoods(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('brotherhood_steps')
    .select('brotherhood_entity_id, step_entity_id')
    .in('brotherhood_entity_id', ids)
    .eq('status', 'published')
  if (result.error) throw result.error
  const counts = new Map(ids.map((id) => [id, new Set()]))
  ;(result.data || []).forEach((row) => counts.get(row.brotherhood_entity_id)?.add(row.step_entity_id))

  return answer({
    text: `Este es el número de pasos publicados relacionados con cada una de las ${resolved.entities.length} hermandades anteriores.`,
    path: ['Contexto anterior', 'Hermandades', 'Pasos', 'Recuento'],
    items: resolved.entities.map((brotherhood) => {
      const count = counts.get(brotherhood.id)?.size || 0
      return { label: brotherhood.name, meta: `${count} ${typeNoun('step', count)}`, href: entityHref(brotherhood) }
    }),
    followUps: ['¿Qué bandas acompañan a estas hermandades?', 'Compáralas.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function compareBrotherhoods(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const [brotherhoodResult, stepResult, bandResult] = await Promise.all([
    supabase.from('brotherhoods').select('entity_id, foundation_text, municipality_id, neighborhood, brotherhood_types, current_procession_day').in('entity_id', ids),
    supabase.from('brotherhood_steps').select('brotherhood_entity_id, step_entity_id').in('brotherhood_entity_id', ids).eq('status', 'published'),
    supabase.from('current_music_accompaniments').select('brotherhood_entity_id, band_entity_id').in('brotherhood_entity_id', ids),
  ])
  if (brotherhoodResult.error) throw brotherhoodResult.error
  if (stepResult.error) throw stepResult.error
  if (bandResult.error) throw bandResult.error

  const detailById = new Map((brotherhoodResult.data || []).map((row) => [row.entity_id, row]))
  const municipalities = await municipalityNames(supabase, (brotherhoodResult.data || []).map((row) => row.municipality_id))
  const steps = new Map(ids.map((id) => [id, new Set()]))
  const bands = new Map(ids.map((id) => [id, new Set()]))
  ;(stepResult.data || []).forEach((row) => steps.get(row.brotherhood_entity_id)?.add(row.step_entity_id))
  ;(bandResult.data || []).forEach((row) => bands.get(row.brotherhood_entity_id)?.add(row.band_entity_id))

  return answer({
    text: `Comparo las ${resolved.entities.length} hermandades anteriores por tipo, localidad, fundación, día de salida, pasos y bandas actuales documentadas.`,
    path: ['Contexto anterior', 'Hermandades', 'Comparación'],
    items: resolved.entities.map((brotherhood) => {
      const row = detailById.get(brotherhood.id) || {}
      return {
        label: brotherhood.name,
        meta: [
          (row.brotherhood_types || []).join(' / '),
          municipalities.get(row.municipality_id),
          row.neighborhood,
          row.foundation_text ? `Fundación: ${row.foundation_text}` : '',
          row.current_procession_day,
          `${steps.get(brotherhood.id)?.size || 0} pasos`,
          `${bands.get(brotherhood.id)?.size || 0} bandas actuales`,
        ].filter(Boolean).join(' · '),
        href: entityHref(brotherhood),
      }
    }),
    followUps: ['¿Qué bandas acompañan a estas hermandades?', '¿Cuántos pasos tiene cada una?'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function authorsOfMarchSet(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('march_authors')
    .select('march_entity_id, agent_entity_id, author_role')
    .in('march_entity_id', ids)
    .eq('status', 'published')
  if (result.error) throw result.error
  const agentById = await entityNamesByIds(supabase, (result.data || []).map((row) => row.agent_entity_id), 'agent')
  const rowsByMarch = new Map()
  ;(result.data || []).forEach((row) => {
    const current = rowsByMarch.get(row.march_entity_id) || []
    current.push(row)
    rowsByMarch.set(row.march_entity_id, current)
  })

  return answer({
    text: `He consultado las autorías publicadas de las ${resolved.entities.length} marchas anteriores.`,
    path: ['Contexto anterior', 'Marchas', 'Autorías'],
    items: resolved.entities.map((march) => {
      const rows = rowsByMarch.get(march.id) || []
      return {
        label: march.name,
        meta: rows.length
          ? rows.map((row) => [agentById.get(row.agent_entity_id)?.name, row.author_role].filter(Boolean).join(' · ')).join(' / ')
          : 'Autoría por documentar',
        href: '',
      }
    }),
    followUps: ['Compáralas.'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function compareMarches(supabase, resolved) {
  const ids = resolved.entities.map((entity) => entity.id)
  const result = await supabase
    .from('march_authors')
    .select('march_entity_id, agent_entity_id, author_role')
    .in('march_entity_id', ids)
    .eq('status', 'published')
  if (result.error) throw result.error
  const agentById = await entityNamesByIds(supabase, (result.data || []).map((row) => row.agent_entity_id), 'agent')
  const rowsByMarch = new Map()
  ;(result.data || []).forEach((row) => {
    const current = rowsByMarch.get(row.march_entity_id) || []
    current.push(row)
    rowsByMarch.set(row.march_entity_id, current)
  })

  return answer({
    text: `Comparo las ${resolved.entities.length} marchas anteriores con lo que está estructurado de forma común: autorías publicadas y resumen documental de cada obra.`,
    path: ['Contexto anterior', 'Marchas', 'Comparación'],
    items: resolved.entities.map((march) => {
      const rows = rowsByMarch.get(march.id) || []
      const authors = rows.map((row) => [agentById.get(row.agent_entity_id)?.name, row.author_role].filter(Boolean).join(' · ')).filter(Boolean)
      return {
        label: march.name,
        meta: [authors.join(' / ') || 'Autoría por documentar', march.summary].filter(Boolean).join(' · '),
        href: '',
      }
    }),
    followUps: ['¿Quién compuso cada una?'],
    context: setContext({ root: resolved.root, entities: resolved.entities, sourceIntent: resolved.sourceIntent }),
  })
}

async function answerSetFollowUp(supabase, question, context) {
  const resolved = await resolveSet(supabase, context)
  if (!resolved) return null
  if (resolved.entities[0]?.entity_type === 'image') return null

  const explicit = mentionedEntity(question, resolved.entities)
  if (resolved.entities[0]?.entity_type === 'agent' && explicit && /\bpaso|pasos\b/.test(normalizeTira(question))) {
    return stepsOfSetAgent(supabase, resolved, explicit)
  }

  const intent = genericSetIntent(question, resolved.entities[0]?.entity_type)
  if (!intent) return null

  if (intent === 'band_filter_music') return filterMusicBands(supabase, resolved)
  if (intent === 'band_accompaniment_since') return bandAccompanimentSince(supabase, resolved)
  if (intent === 'band_most_brotherhoods') return bandBrotherhoodRanking(supabase, resolved)
  if (intent === 'band_compare') return compareBands(supabase, resolved)
  if (intent === 'agent_filter_discipline') return filterAgentsByDiscipline(supabase, resolved, question)
  if (intent === 'agent_compare') return compareAgents(supabase, resolved)
  if (intent === 'step_personnel') return personnelOfSteps(supabase, resolved)
  if (intent === 'step_bands') return bandsOfSteps(supabase, resolved)
  if (intent === 'step_compare') return compareSteps(supabase, resolved)
  if (intent === 'brotherhood_bands') return bandsOfBrotherhoodSet(supabase, resolved)
  if (intent === 'brotherhood_steps') return stepCountsOfBrotherhoods(supabase, resolved)
  if (intent === 'brotherhood_compare') return compareBrotherhoods(supabase, resolved)
  if (intent === 'march_authors') return authorsOfMarchSet(supabase, resolved)
  if (intent === 'march_compare') return compareMarches(supabase, resolved)
  return null
}

export async function askHiloCofradeV4(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  if (context?.resultSet?.entityType && context.resultSet.entityType !== 'image') {
    const supabase = await createClient()
    try {
      const contextual = await answerSetFollowUp(supabase, clean, context)
      if (contextual) return contextual
    } catch (error) {
      console.error('[Hilo Cofrade] Error al razonar sobre un conjunto contextual', {
        question: clean,
        entityType: context?.resultSet?.entityType,
        error: error instanceof Error ? error.message : String(error),
      })
      return notDocumented('No he podido continuar ese conjunto ahora mismo. Prefiero no completar la respuesta con información no documentada.', context)
    }
  }

  const response = await askHiloCofradeV3(clean, context)
  if (response?.kind !== 'answer' || response?.context?.resultSet) return response

  try {
    const supabase = await createClient()
    return await augmentResponseSet(supabase, response)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo preparar un conjunto genérico de resultados', {
      question: clean,
      error: error instanceof Error ? error.message : String(error),
    })
    return response
  }
}
