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

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
const SEARCHABLE_TYPES = Object.keys(TYPE_LABELS)

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compact(value = '', max = 150) {
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

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: TYPE_LABELS[entity.entity_type] || 'Entidad',
    name: entity.name,
    href: entityHref(entity),
    meta: meta || compact(entity.summary, 110),
  }
}

function scoreEntity(entity, question) {
  const name = normalize(entity.name)
  const query = normalize(question)
  if (!name || !query) return 0
  if (query === name) return 1000
  if (query.includes(name)) return 900 + Math.min(name.length, 80)
  if (name.includes(query)) return 760 + Math.min(query.length, 80)

  const nameTokens = name.split(' ').filter((token) => token.length > 2)
  const queryTokens = new Set(query.split(' ').filter((token) => token.length > 2))
  const overlap = nameTokens.filter((token) => queryTokens.has(token)).length
  if (!overlap) return 0
  return (overlap / Math.max(nameTokens.length, 1)) * 500 + overlap * 20
}

async function listEntities(supabase, types = SEARCHABLE_TYPES) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('entity_type', types)
    .eq('status', 'published')
    .order('name')

  if (result.error) throw result.error
  return result.data || []
}

async function entityById(supabase, id) {
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

async function bestEntity(supabase, question, types, context = null) {
  if (context?.entityId && (!types?.length || types.includes(context.entityType))) {
    const contextual = await entityById(supabase, context.entityId)
    const normalizedQuestion = normalize(question)
    const explicitOtherName = contextual && !normalizedQuestion.includes(normalize(contextual.name))
      ? false
      : true
    const looksLikeFollowUp = /^(y|ademas|tambien|entonces|que|quien|cuales|cuantas|donde)\b/.test(normalizedQuestion)
    if (contextual && (explicitOtherName || looksLikeFollowUp)) return contextual
  }

  const entities = await listEntities(supabase, types)
  return entities
    .map((entity) => ({ entity, score: scoreEntity(entity, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
}

async function entitiesByIds(supabase, ids = []) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .eq('status', 'published')
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((item) => [item.id, item]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function contextFor(entity) {
  if (!entity) return null
  return { entityId: entity.id, entityType: entity.entity_type, name: entity.name }
}

function notDocumented(message = 'Todavía no tengo esa relación documentada en Hilo Cofrade.') {
  return {
    kind: 'not_documented',
    answer: message,
    path: [],
    entities: [],
    items: [],
    followUps: [],
    context: null,
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

async function composerOfMarch(supabase, question, context) {
  const march = await bestEntity(supabase, question, ['march'], context)
  if (!march) return notDocumented('No identifico qué marcha quieres consultar todavía.')

  const links = await supabase
    .from('march_authors')
    .select('agent_entity_id, author_role, notes')
    .eq('march_entity_id', march.id)
    .eq('status', 'published')
  if (links.error) throw links.error

  const composerLinks = (links.data || []).filter((item) => item.author_role === 'composer')
  const chosen = composerLinks.length ? composerLinks : (links.data || [])
  const authors = await entitiesByIds(supabase, chosen.map((item) => item.agent_entity_id))
  if (!authors.length) return notDocumented(`La autoría de «${march.name}» todavía no está documentada.`)

  const names = authors.map((item) => item.name)
  const text = names.length === 1
    ? `«${march.name}» está compuesta por ${names[0]}.`
    : `«${march.name}» tiene ${names.length} autorías documentadas: ${names.join(', ')}.`

  return answer({
    text,
    path: ['Marcha', 'Autoría', 'Autor'],
    entities: [publicEntity(march), ...authors.map((item) => publicEntity(item, 'Autoría documentada'))],
    followUps: [
      `¿Qué otras marchas ha compuesto ${authors[0].name}?`,
      `Cuéntame sobre ${march.name}`,
    ],
    context: contextFor(march),
  })
}

async function marchesByAgent(supabase, question, context) {
  const agent = await bestEntity(supabase, question, ['agent'], context)
  if (!agent) return notDocumented('No identifico qué autor o profesional quieres consultar.')

  const links = await supabase
    .from('march_authors')
    .select('march_entity_id, author_role')
    .eq('agent_entity_id', agent.id)
    .eq('status', 'published')
  if (links.error) throw links.error

  const marches = await entitiesByIds(supabase, (links.data || []).map((item) => item.march_entity_id))
  const sorted = [...marches].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  if (!sorted.length) return notDocumented(`No hay marchas publicadas relacionadas con ${agent.name} en este momento.`)

  return answer({
    text: `${agent.name} tiene ${sorted.length} ${sorted.length === 1 ? 'marcha publicada' : 'marchas publicadas'} en Hilo Cofrade.`,
    path: ['Autor', 'Composición', 'Marchas'],
    entities: [publicEntity(agent)],
    items: sorted.slice(0, 12).map((item) => ({ label: item.name, meta: 'Marcha documentada', href: '' })),
    followUps: [`¿Quién compuso ${sorted[0].name}?`],
    context: contextFor(agent),
  })
}

async function stepsByAgent(supabase, question, context) {
  const agent = await bestEntity(supabase, question, ['agent'], context)
  if (!agent) return notDocumented('No identifico qué capataz o profesional quieres consultar.')

  const result = await supabase
    .from('current_step_personnel')
    .select('step_entity_id, step_name, role_name, year_from, date_from_text')
    .eq('agent_entity_id', agent.id)
    .order('step_name')
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`No hay pasos actuales relacionados con ${agent.name} en el grafo publicado.`)

  const steps = await entitiesByIds(supabase, rows.map((item) => item.step_entity_id))
  const stepById = new Map(steps.map((item) => [item.id, item]))

  return answer({
    text: `${agent.name} figura actualmente en ${rows.length} ${rows.length === 1 ? 'paso' : 'pasos'} como ${rows[0]?.role_name?.toLowerCase() || 'personal del paso'}.`,
    path: ['Profesional', 'Paso', 'Hermandad'],
    entities: [publicEntity(agent)],
    items: rows.map((row) => {
      const step = stepById.get(row.step_entity_id)
      return {
        label: row.step_name,
        meta: [row.role_name, row.date_from_text && row.date_from_text !== 'Inicio por documentar' ? row.date_from_text : ''].filter(Boolean).join(' · '),
        href: entityHref(step),
      }
    }),
    followUps: [`¿Quién lleva ${rows[0].step_name}?`],
    context: contextFor(agent),
  })
}

async function personnelOfStep(supabase, question, context) {
  const step = await bestEntity(supabase, question, ['step'], context)
  if (!step) return notDocumented('No identifico qué paso quieres consultar.')

  const result = await supabase
    .from('current_step_personnel')
    .select('agent_entity_id, agent_name, role_name, year_from, date_from_text')
    .eq('step_entity_id', step.id)
    .order('role_name')
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`El personal actual de «${step.name}» todavía no está documentado.`)

  const agents = await entitiesByIds(supabase, rows.map((item) => item.agent_entity_id))
  const agentById = new Map(agents.map((item) => [item.id, item]))

  return answer({
    text: rows.length === 1
      ? `${rows[0].agent_name} figura como ${rows[0].role_name?.toLowerCase() || 'responsable'} de «${step.name}».`
      : `«${step.name}» tiene ${rows.length} responsables actuales documentados.`,
    path: ['Paso', 'Personal', 'Profesionales'],
    entities: [publicEntity(step)],
    items: rows.map((row) => ({
      label: row.agent_name,
      meta: [row.role_name, row.date_from_text && row.date_from_text !== 'Inicio por documentar' ? row.date_from_text : ''].filter(Boolean).join(' · '),
      href: entityHref(agentById.get(row.agent_entity_id)),
    })),
    followUps: [`¿Qué pasos dirige ${rows[0].agent_name}?`],
    context: contextFor(step),
  })
}

async function bandsOfBrotherhood(supabase, question, context) {
  const brotherhood = await bestEntity(supabase, question, ['brotherhood'], context)
  if (!brotherhood) return notDocumented('No identifico qué hermandad quieres consultar.')

  const result = await supabase
    .from('current_music_accompaniments')
    .select('band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text')
    .eq('brotherhood_entity_id', brotherhood.id)
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`No hay acompañamientos musicales actuales publicados para ${brotherhood.name}.`)

  const bands = await entitiesByIds(supabase, rows.map((item) => item.band_entity_id))
  const steps = await entitiesByIds(supabase, rows.map((item) => item.step_entity_id))
  const bandById = new Map(bands.map((item) => [item.id, item]))
  const stepById = new Map(steps.map((item) => [item.id, item]))

  return answer({
    text: `${brotherhood.name} tiene ${rows.length} ${rows.length === 1 ? 'acompañamiento musical actual' : 'acompañamientos musicales actuales'} documentados.`,
    path: ['Hermandad', 'Acompañamiento', 'Banda'],
    entities: [publicEntity(brotherhood)],
    items: rows.map((row) => {
      const band = bandById.get(row.band_entity_id)
      const step = stepById.get(row.step_entity_id)
      return {
        label: band?.name || 'Banda por documentar',
        meta: [row.position, step?.name, row.outing_type].filter(Boolean).join(' · '),
        href: entityHref(band),
      }
    }),
    followUps: [`Cuéntame sobre ${bands[0]?.name || brotherhood.name}`],
    context: contextFor(brotherhood),
  })
}

async function brotherhoodsOfBand(supabase, question, context) {
  const band = await bestEntity(supabase, question, ['band'], context)
  if (!band) return notDocumented('No identifico qué banda quieres consultar.')

  const result = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, step_entity_id, position, outing_type, year_from')
    .eq('band_entity_id', band.id)
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`No hay acompañamientos actuales publicados para ${band.name}.`)

  const brotherhoods = await entitiesByIds(supabase, rows.map((item) => item.brotherhood_entity_id))
  const steps = await entitiesByIds(supabase, rows.map((item) => item.step_entity_id))
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))
  const stepById = new Map(steps.map((item) => [item.id, item]))

  return answer({
    text: `${band.name} aparece actualmente relacionada con ${new Set(rows.map((item) => item.brotherhood_entity_id)).size} ${new Set(rows.map((item) => item.brotherhood_entity_id)).size === 1 ? 'hermandad' : 'hermandades'} mediante acompañamientos publicados.`,
    path: ['Banda', 'Acompañamientos', 'Hermandades'],
    entities: [publicEntity(band)],
    items: rows.map((row) => {
      const brotherhood = brotherhoodById.get(row.brotherhood_entity_id)
      const step = stepById.get(row.step_entity_id)
      return {
        label: brotherhood?.name || 'Hermandad por documentar',
        meta: [row.outing_type, row.position, step?.name].filter(Boolean).join(' · '),
        href: entityHref(brotherhood),
      }
    }),
    followUps: brotherhoods[0] ? [`¿Qué bandas acompañan a ${brotherhoods[0].name}?`] : [],
    context: contextFor(band),
  })
}

async function titularsOfBrotherhood(supabase, question, context) {
  const brotherhood = await bestEntity(supabase, question, ['brotherhood'], context)
  if (!brotherhood) return notDocumented('No identifico qué hermandad quieres consultar.')

  const result = await supabase
    .from('brotherhood_images')
    .select('image_entity_id, relation_type, procesiona')
    .eq('brotherhood_entity_id', brotherhood.id)
    .eq('relation_type', 'titular')
    .eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  const images = await entitiesByIds(supabase, rows.map((item) => item.image_entity_id))
  const imageById = new Map(images.map((item) => [item.id, item]))
  if (!rows.length) return notDocumented(`Los titulares de ${brotherhood.name} todavía no están documentados.`)

  return answer({
    text: `${brotherhood.name} tiene ${rows.length} ${rows.length === 1 ? 'titular publicado' : 'titulares publicados'} en Hilo Cofrade.`,
    path: ['Hermandad', 'Titularidad', 'Imágenes'],
    entities: [publicEntity(brotherhood)],
    items: rows.map((row) => {
      const image = imageById.get(row.image_entity_id)
      return {
        label: image?.name || 'Imagen por documentar',
        meta: row.procesiona === false ? 'Titular · no procesiona' : 'Titular',
        href: entityHref(image),
      }
    }),
    followUps: images[0] ? [`Cuéntame sobre ${images[0].name}`] : [],
    context: contextFor(brotherhood),
  })
}

async function stepsOfBrotherhood(supabase, question, context) {
  const brotherhood = await bestEntity(supabase, question, ['brotherhood'], context)
  if (!brotherhood) return notDocumented('No identifico qué hermandad quieres consultar.')

  const result = await supabase
    .from('brotherhood_steps')
    .select('step_entity_id, relation_type, date_from_text')
    .eq('brotherhood_entity_id', brotherhood.id)
    .eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  const steps = await entitiesByIds(supabase, rows.map((item) => item.step_entity_id))
  if (!steps.length) return notDocumented(`Los pasos de ${brotherhood.name} todavía no están documentados.`)

  return answer({
    text: `${brotherhood.name} tiene ${steps.length} ${steps.length === 1 ? 'paso relacionado' : 'pasos relacionados'} publicados.`,
    path: ['Hermandad', 'Pasos', 'Relaciones'],
    entities: [publicEntity(brotherhood)],
    items: steps.map((step) => ({ label: step.name, meta: 'Paso relacionado', href: entityHref(step) })),
    followUps: [`¿Quién lleva ${steps[0].name}?`],
    context: contextFor(brotherhood),
  })
}

async function genericEntity(supabase, question, context) {
  const entity = await bestEntity(supabase, question, SEARCHABLE_TYPES, context)
  if (!entity) {
    const all = await listEntities(supabase)
    const ranked = all
      .map((item) => ({ item, score: scoreEntity(item, question) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)

    if (!ranked.length) return notDocumented('No encuentro todavía una entidad o relación que responda a esa consulta.')
    return {
      kind: 'results',
      answer: 'He encontrado estas entidades relacionadas con tu consulta.',
      path: [],
      entities: ranked.map(({ item }) => publicEntity(item)),
      items: [],
      followUps: [],
      context: ranked[0] ? contextFor(ranked[0].item) : null,
    }
  }

  let summary = compact(entity.summary, 320)
  if (!summary) summary = `${TYPE_LABELS[entity.entity_type] || 'Entidad'} documentada en Hilo Cofrade.`

  return answer({
    text: `${entity.name}. ${summary}`,
    path: [TYPE_LABELS[entity.entity_type] || 'Entidad', 'Ficha', 'Relaciones'],
    entities: [publicEntity(entity)],
    followUps: entity.entity_type === 'brotherhood'
      ? [`¿Qué titulares tiene ${entity.name}?`, `¿Qué bandas acompañan a ${entity.name}?`]
      : entity.entity_type === 'band'
        ? [`¿A qué hermandades acompaña ${entity.name}?`]
        : entity.entity_type === 'step'
          ? [`¿Quién lleva ${entity.name}?`]
          : entity.entity_type === 'march'
            ? [`¿Quién compuso ${entity.name}?`]
            : entity.entity_type === 'agent'
              ? [`¿Qué marchas ha compuesto ${entity.name}?`, `¿Qué pasos dirige ${entity.name}?`]
              : [],
    context: contextFor(entity),
  })
}

function intentFor(question, context) {
  const q = normalize(question)

  const asksComposer = /\b(compuso|compuesta|compuesto|compositor|autoria|autor)\b/.test(q) && !/\b(marchas|composiciones|obras)\b/.test(q)
  if (asksComposer) return 'composer_of_march'

  if (/\b(marchas|composiciones|obras)\b/.test(q) && /\b(compuso|compuesto|compuesta|compone|compuestas|autor|compositor)\b/.test(q)) {
    return 'marches_by_agent'
  }

  if (/\b(pasos)\b/.test(q) && /\b(dirige|dirigidos|lleva|lleva|capataz|capataz|manda)\b/.test(q)) {
    return 'steps_by_agent'
  }

  if ((/\b(quien|capataz|capataz|lleva|dirige)\b/.test(q) && /\b(paso|palio|misterio|cristo)\b/.test(q)) || (context?.entityType === 'step' && /\b(quien|lleva|dirige|capataz)\b/.test(q))) {
    return 'personnel_of_step'
  }

  if (/\b(titulares|titular)\b/.test(q)) return 'titulars_of_brotherhood'

  if (/\b(pasos)\b/.test(q) && !/\b(dirige|lleva|capataz|capataz|manda)\b/.test(q)) {
    if (context?.entityType === 'brotherhood' || /\b(hermandad|cofradia)\b/.test(q)) return 'steps_of_brotherhood'
  }

  if (/\b(bandas|banda|musica|acompanamiento|acompanamientos)\b/.test(q)) {
    if (context?.entityType === 'band' || /\b(donde|hermandades|acompaña|acompanan|toca)\b/.test(q)) {
      return 'brotherhoods_of_band_or_bands_of_brotherhood'
    }
    return 'bands_of_brotherhood'
  }

  if (context?.entityType === 'agent' && /\b(pasos)\b/.test(q)) return 'steps_by_agent'
  if (context?.entityType === 'agent' && /\b(marchas|obras|composiciones)\b/.test(q)) return 'marches_by_agent'
  if (context?.entityType === 'march' && /\b(quien|autor|compositor)\b/.test(q)) return 'composer_of_march'
  if (context?.entityType === 'brotherhood' && /\b(bandas|musica|acompanamiento)\b/.test(q)) return 'bands_of_brotherhood'
  if (context?.entityType === 'brotherhood' && /\b(titulares|imagenes)\b/.test(q)) return 'titulars_of_brotherhood'

  return 'generic'
}

export async function askHiloCofrade(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  const supabase = await createClient()
  const intent = intentFor(clean, context)

  try {
    if (intent === 'composer_of_march') return await composerOfMarch(supabase, clean, context)
    if (intent === 'marches_by_agent') return await marchesByAgent(supabase, clean, context)
    if (intent === 'steps_by_agent') return await stepsByAgent(supabase, clean, context)
    if (intent === 'personnel_of_step') return await personnelOfStep(supabase, clean, context)
    if (intent === 'bands_of_brotherhood') return await bandsOfBrotherhood(supabase, clean, context)
    if (intent === 'titulars_of_brotherhood') return await titularsOfBrotherhood(supabase, clean, context)
    if (intent === 'steps_of_brotherhood') return await stepsOfBrotherhood(supabase, clean, context)

    if (intent === 'brotherhoods_of_band_or_bands_of_brotherhood') {
      const band = await bestEntity(supabase, clean, ['band'], context)
      const brotherhood = await bestEntity(supabase, clean, ['brotherhood'], context)
      if (band && (!brotherhood || scoreEntity(band, clean) >= scoreEntity(brotherhood, clean))) {
        return await brotherhoodsOfBand(supabase, clean, contextFor(band))
      }
      return await bandsOfBrotherhood(supabase, clean, brotherhood ? contextFor(brotherhood) : context)
    }

    return await genericEntity(supabase, clean, context)
  } catch (error) {
    console.error('[Hilo Cofrade] Error en Tira del hilo', {
      question: clean,
      intent,
      error: error instanceof Error ? error.message : String(error),
    })
    return notDocumented('No he podido resolver esa consulta ahora mismo. El dato no se ha inventado: prefiero dejarlo sin respuesta hasta poder comprobarlo.')
  }
}
