import 'server-only'

import { askHiloCofradeReasoning } from '@/lib/supabase/tira-del-hilo-reasoning'
import { createClient } from '@/lib/supabase/server'
import { sortTemporal, temporalIntent } from '@/lib/temporal-ranking'
import { typeNoun } from '@/lib/tira-context'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
const SUPPORTED_TYPES = new Set(['brotherhood', 'image', 'step', 'band', 'march'])

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

async function publicEntitiesByIds(supabase, ids = [], entityType) {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 12)
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .in('id', unique)
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

async function temporalRows(supabase, entityType, ids) {
  if (entityType === 'image') {
    const result = await supabase
      .from('images')
      .select('entity_id, execution_date, execution_date_text')
      .in('entity_id', ids)
    if (result.error) throw result.error
    return (result.data || []).map((row) => ({
      entityId: row.entity_id,
      dateText: row.execution_date_text || row.execution_date || '',
    }))
  }

  if (entityType === 'step') {
    const result = await supabase
      .from('steps')
      .select('entity_id, execution_date_text')
      .in('entity_id', ids)
    if (result.error) throw result.error
    return (result.data || []).map((row) => ({ entityId: row.entity_id, dateText: row.execution_date_text || '' }))
  }

  if (entityType === 'band') {
    const result = await supabase
      .from('bands')
      .select('entity_id, foundation_text')
      .in('entity_id', ids)
    if (result.error) throw result.error
    return (result.data || []).map((row) => ({ entityId: row.entity_id, dateText: row.foundation_text || '' }))
  }

  if (entityType === 'brotherhood') {
    const result = await supabase
      .from('brotherhoods')
      .select('entity_id, foundation_text')
      .in('entity_id', ids)
    if (result.error) throw result.error
    return (result.data || []).map((row) => ({ entityId: row.entity_id, dateText: row.foundation_text || '' }))
  }

  if (entityType === 'march') {
    const result = await supabase
      .from('marches')
      .select('entity_id, composition_year, composition_date_text')
      .in('entity_id', ids)
    if (result.error) throw result.error
    return (result.data || []).map((row) => ({
      entityId: row.entity_id,
      dateText: row.composition_date_text || row.composition_year || '',
    }))
  }

  return []
}

function contextForSet(context, entities, sourceIntent = 'temporal_set') {
  const entityType = entities[0]?.entity_type || context?.resultSet?.entityType || ''
  const ids = entities.map((entity) => entity.id).slice(0, 12)
  return {
    entityId: context?.entityId || null,
    entityType: context?.entityType || null,
    name: context?.name || '',
    resultSet: {
      entityType,
      entityIds: ids,
      count: ids.length,
      label: `${ids.length} ${typeNoun(entityType, ids.length)}`,
      sourceIntent,
    },
  }
}

async function temporalSetAnswer(supabase, question, context) {
  const intent = temporalIntent(question)
  const set = context?.resultSet
  if (!intent || !set?.entityType || !SUPPORTED_TYPES.has(set.entityType)) return null

  const entities = await publicEntitiesByIds(supabase, set.entityIds || [], set.entityType)
  if (!entities.length) return notDocumented('El conjunto anterior ya no contiene entidades públicas que pueda ordenar.', null)

  const rows = await temporalRows(supabase, set.entityType, entities.map((entity) => entity.id))
  const rowById = new Map(rows.map((row) => [row.entityId, row]))
  const entries = entities.map((entity) => ({
    entity,
    name: entity.name,
    dateText: rowById.get(entity.id)?.dateText || '',
  }))
  const { dated, undated } = sortTemporal(entries, intent.direction)
  const activeContext = contextForSet(context, entities, set.sourceIntent || 'temporal_set')

  if (!dated.length) {
    return notDocumented(`No hay dataciones estructuradas suficientes para ordenar las ${typeNoun(set.entityType, entities.length)} anteriores.`, activeContext)
  }

  const oldestLabel = intent.direction === 'oldest' ? 'más antigua' : 'más reciente'
  const masculine = set.entityType === 'step' ? (intent.direction === 'oldest' ? 'más antiguo' : 'más reciente') : oldestLabel
  const adjective = set.entityType === 'step' ? masculine : oldestLabel
  const leader = dated[0]

  if (intent.mode === 'extreme') {
    return answer({
      text: `${leader.entity.name} es ${adjective} dentro del conjunto anterior según la datación publicada: ${leader.temporal.label}.`,
      path: ['Contexto anterior', 'Datación', intent.direction === 'oldest' ? 'Más antiguo' : 'Más reciente'],
      entities: [{
        id: leader.entity.id,
        entityType: leader.entity.entity_type,
        type: leader.entity.entity_type === 'image' ? 'Imagen' : leader.entity.entity_type === 'step' ? 'Paso' : leader.entity.entity_type === 'band' ? 'Banda' : leader.entity.entity_type === 'brotherhood' ? 'Hermandad' : 'Marcha',
        name: leader.entity.name,
        href: entityHref(leader.entity),
        meta: leader.temporal.label,
      }],
      items: dated.slice(0, 12).map((entry) => ({
        label: entry.entity.name,
        meta: entry.temporal.label,
        href: entityHref(entry.entity),
      })),
      followUps: [
        intent.direction === 'oldest' ? 'Ordénalas de más antigua a más reciente.' : 'Ordénalas de más reciente a más antigua.',
        'Compáralas.',
      ],
      context: activeContext,
    })
  }

  const directionLabel = intent.direction === 'oldest'
    ? 'de más antigua a más reciente'
    : 'de más reciente a más antigua'
  const precisionNote = dated.some((entry) => entry.temporal.precision === 'century')
    ? ' Las dataciones expresadas solo por siglo se ordenan a nivel de siglo, sin inventar un año concreto.'
    : ''

  return answer({
    text: `He ordenado ${dated.length} ${typeNoun(set.entityType, dated.length)} ${directionLabel} según la datación disponible.${precisionNote}${undated.length ? ` ${undated.length} quedan fuera del orden por no tener una datación comparable.` : ''}`,
    path: ['Contexto anterior', 'Datación', 'Orden cronológico'],
    items: [
      ...dated.map((entry, index) => ({
        label: `${index + 1}. ${entry.entity.name}`,
        meta: entry.temporal.label,
        href: entityHref(entry.entity),
      })),
      ...undated.map((entry) => ({
        label: entry.entity.name,
        meta: 'Datación no comparable',
        href: entityHref(entry.entity),
      })),
    ].slice(0, 12),
    followUps: [intent.direction === 'oldest' ? '¿Cuál es la más reciente?' : '¿Cuál es la más antigua?', 'Compáralas.'],
    context: activeContext,
  })
}

export async function askHiloCofradeV5(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  if (context?.resultSet?.entityType && temporalIntent(clean)) {
    try {
      const supabase = await createClient()
      const temporal = await temporalSetAnswer(supabase, clean, context)
      if (temporal) return temporal
    } catch (error) {
      console.error('[Hilo Cofrade] Error en operación temporal del conjunto', {
        question: clean,
        entityType: context?.resultSet?.entityType,
        error: error instanceof Error ? error.message : String(error),
      })
      return notDocumented('No he podido ordenar temporalmente ese conjunto con suficiente seguridad.', context)
    }
  }

  return askHiloCofradeReasoning(clean, context)
}
