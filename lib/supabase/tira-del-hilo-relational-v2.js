import 'server-only'

import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { createClient } from '@/lib/supabase/server'
import {
  normalizeRelationalText,
  relationalEntityScore,
  relationalPeriodLabel,
  relationalRepertoireScore,
  relationalV2Intent,
} from '@/lib/tira-relational-v2'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band', 'march'])
const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
}

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
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

function resultSetContext({ root = null, entities = [], sourceIntent = '' } = {}) {
  const entityType = entities[0]?.entity_type || ''
  const entityIds = [...new Set(entities
    .filter((entity) => entity?.id && entity.entity_type === entityType)
    .map((entity) => entity.id))].slice(0, 12)
  return {
    entityId: root?.id || null,
    entityType: root?.entity_type || null,
    name: root?.name || '',
    ...(entityType && entityIds.length ? {
      resultSet: {
        entityType,
        entityIds,
        count: entityIds.length,
        label: `${entityIds.length} ${TYPE_LABELS[entityType] || 'entidades'}`,
        sourceIntent,
      },
    } : {}),
  }
}

function answer({ text, path = [], entities = [], items = [], links = [], evidence = [], references = [], followUps = [], context = null, compactItemLimit = 5 }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    links,
    evidence,
    references,
    followUps,
    context,
    compactItemLimit,
  }
}

function notDocumented(text, context = null) {
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

async function publicEntities(supabase, types = []) {
  let query = supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('status', 'published')
  if (types.length) query = query.in('entity_type', types)
  const result = await query
  if (result.error) throw result.error
  return result.data || []
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

function bestEntity(entities, question, entityType = '') {
  return entities
    .filter((entity) => !entityType || entity.entity_type === entityType)
    .map((entity) => ({ entity, score: relationalEntityScore(entity.name, question, entity.entity_type) }))
    .filter(({ score }) => score >= 250)
    .sort((first, second) => second.score - first.score || second.entity.name.length - first.entity.name.length)[0] || null
}

async function relatedEntitiesForBrotherhood(supabase, brotherhood) {
  if (!brotherhood) return { images: [], steps: [] }
  const [imageLinks, stepLinks] = await Promise.all([
    supabase
      .from('brotherhood_images')
      .select('image_entity_id')
      .eq('brotherhood_entity_id', brotherhood.id)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('step_entity_id')
      .eq('brotherhood_entity_id', brotherhood.id)
      .eq('status', 'published'),
  ])
  if (imageLinks.error) throw imageLinks.error
  if (stepLinks.error) throw stepLinks.error
  const [images, steps] = await Promise.all([
    entitiesByIds(supabase, (imageLinks.data || []).map((row) => row.image_entity_id), 'image'),
    entitiesByIds(supabase, (stepLinks.data || []).map((row) => row.step_entity_id), 'step'),
  ])
  return { images, steps }
}

async function musicForSubject(supabase, question) {
  const allRoots = await publicEntities(supabase, ['brotherhood', 'image', 'step'])
  const brotherhoodMatch = bestEntity(allRoots, question, 'brotherhood')
  const brotherhood = brotherhoodMatch?.score >= 700 ? brotherhoodMatch.entity : null

  const scoped = brotherhood
    ? await relatedEntitiesForBrotherhood(supabase, brotherhood)
    : {
        images: allRoots.filter((entity) => entity.entity_type === 'image'),
        steps: allRoots.filter((entity) => entity.entity_type === 'step'),
      }

  const imageMatch = bestEntity(scoped.images, question, 'image')
  const stepMatch = bestEntity(scoped.steps, question, 'step')
  let subject = null
  let stepIds = []

  if ((imageMatch?.score || 0) > (stepMatch?.score || 0)) {
    subject = imageMatch.entity
    const links = await supabase
      .from('image_steps')
      .select('step_entity_id')
      .eq('image_entity_id', subject.id)
      .eq('status', 'published')
    if (links.error) throw links.error
    stepIds = [...new Set((links.data || []).map((row) => row.step_entity_id).filter(Boolean))]
  } else if (stepMatch) {
    subject = stepMatch.entity
    stepIds = [subject.id]
  }

  if (!subject || !stepIds.length) return null

  let query = supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, date_from_text')
    .in('step_entity_id', stepIds)
  if (brotherhood) query = query.eq('brotherhood_entity_id', brotherhood.id)
  const result = await query
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) {
    return notDocumented(`No hay un acompañamiento musical actual publicado para ${subject.name}${brotherhood ? ` en ${brotherhood.name}` : ''}.`, resultSetContext({ root: subject }))
  }

  const [bands, steps, brotherhoods] = await Promise.all([
    entitiesByIds(supabase, rows.map((row) => row.band_entity_id), 'band'),
    entitiesByIds(supabase, rows.map((row) => row.step_entity_id), 'step'),
    entitiesByIds(supabase, rows.map((row) => row.brotherhood_entity_id), 'brotherhood'),
  ])
  const bandById = new Map(bands.map((entity) => [entity.id, entity]))
  const stepById = new Map(steps.map((entity) => [entity.id, entity]))
  const brotherhoodById = new Map(brotherhoods.map((entity) => [entity.id, entity]))
  const usable = rows.filter((row) => bandById.has(row.band_entity_id))
  const uniqueBands = bands.filter((band) => usable.some((row) => row.band_entity_id === band.id))
  if (!uniqueBands.length) return null

  const root = uniqueBands.length === 1 ? uniqueBands[0] : subject
  const context = resultSetContext({ root, entities: uniqueBands, sourceIntent: 'music_for_precise_subject' })
  const text = uniqueBands.length === 1
    ? `${uniqueBands[0].name} es la formación que aparece como acompañamiento actual de ${subject.name}${brotherhood ? ` en ${brotherhood.name}` : ''}.`
    : `${subject.name} tiene ${uniqueBands.length} acompañamientos musicales actuales publicados${brotherhood ? ` en ${brotherhood.name}` : ''}.`

  return answer({
    text,
    path: [TYPE_LABELS[subject.entity_type] || 'Entidad', 'Acompañamiento musical actual', 'Banda'],
    entities: [publicEntity(subject, 'Sujeto consultado'), ...(brotherhood && brotherhood.id !== subject.id ? [publicEntity(brotherhood)] : []), ...uniqueBands.map((band) => publicEntity(band))],
    items: usable.map((row) => {
      const band = bandById.get(row.band_entity_id)
      const step = stepById.get(row.step_entity_id)
      const owner = brotherhoodById.get(row.brotherhood_entity_id)
      return {
        label: band?.name || 'Banda por documentar',
        meta: [row.position, step?.name, row.outing_type, owner?.name, row.date_from_text || row.year_from].filter(Boolean).join(' · '),
        href: entityHref(band),
      }
    }),
    evidence: [{
      key: `precise-music-${subject.id}`,
      label: 'Acompañamiento musical actual',
      detail: `${usable.length} relación${usable.length === 1 ? '' : 'es'} estructurada${usable.length === 1 ? '' : 's'} por paso`,
    }],
    followUps: uniqueBands.length === 1
      ? [`¿A qué hermandades acompaña ${uniqueBands[0].name}?`, `Cuéntame sobre ${uniqueBands[0].name}`]
      : ['¿Cuál de estas bandas es una banda de música?', 'Compáralas.'],
    context,
    compactItemLimit: Math.min(Math.max(usable.length, 3), 8),
  })
}

async function musicHistory(supabase, question) {
  const entities = await publicEntities(supabase, ['brotherhood', 'band'])
  const q = normalizeRelationalText(question)
  const bandMatch = bestEntity(entities, question, 'band')
  const brotherhoodMatch = bestEntity(entities, question, 'brotherhood')
  const asksBrotherhoodTargets = /\b(que hermandades|cuales hermandades|a que hermandades|hermandades ha|hermandades han)\b/.test(q)
  const asksBandTargets = /\b(que bandas|cuales bandas|bandas han|bandas que)\b/.test(q)

  let root = null
  let direction = ''
  if (asksBrotherhoodTargets && bandMatch) {
    root = bandMatch.entity
    direction = 'band_to_brotherhood'
  } else if (asksBandTargets && brotherhoodMatch) {
    root = brotherhoodMatch.entity
    direction = 'brotherhood_to_band'
  } else if ((bandMatch?.score || 0) > (brotherhoodMatch?.score || 0)) {
    root = bandMatch?.entity || null
    direction = 'band_to_brotherhood'
  } else {
    root = brotherhoodMatch?.entity || null
    direction = 'brotherhood_to_band'
  }
  if (!root) return null

  let query = supabase
    .from('music_accompaniment_periods')
    .select('id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, date_to_text, year_to, is_current, notes')
    .eq('status', 'published')
  query = direction === 'band_to_brotherhood'
    ? query.eq('band_entity_id', root.id)
    : query.eq('brotherhood_entity_id', root.id)
  const result = await query
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`No hay periodos de acompañamiento publicados para ${root.name}.`, resultSetContext({ root }))

  const targetType = direction === 'band_to_brotherhood' ? 'brotherhood' : 'band'
  const targetIds = rows.map((row) => direction === 'band_to_brotherhood' ? row.brotherhood_entity_id : row.band_entity_id)
  const [targets, steps] = await Promise.all([
    entitiesByIds(supabase, targetIds, targetType),
    entitiesByIds(supabase, rows.map((row) => row.step_entity_id), 'step'),
  ])
  const targetById = new Map(targets.map((entity) => [entity.id, entity]))
  const stepById = new Map(steps.map((entity) => [entity.id, entity]))
  const usable = rows.filter((row) => targetById.has(direction === 'band_to_brotherhood' ? row.brotherhood_entity_id : row.band_entity_id))
  const uniqueTargets = targets.filter((entity) => usable.some((row) => (
    direction === 'band_to_brotherhood' ? row.brotherhood_entity_id : row.band_entity_id
  ) === entity.id))

  return answer({
    text: `${root.name} tiene ${usable.length} ${usable.length === 1 ? 'periodo de acompañamiento publicado' : 'periodos de acompañamiento publicados'} con ${uniqueTargets.length} ${targetType === 'band' ? (uniqueTargets.length === 1 ? 'banda' : 'bandas') : (uniqueTargets.length === 1 ? 'hermandad' : 'hermandades')}. Se muestran tanto vínculos vigentes como históricos documentados.`,
    path: [TYPE_LABELS[root.entity_type] || 'Entidad', 'Acompañamientos', 'Histórico documentado'],
    entities: [publicEntity(root), ...uniqueTargets.map((entity) => publicEntity(entity))],
    items: usable.map((row) => {
      const targetId = direction === 'band_to_brotherhood' ? row.brotherhood_entity_id : row.band_entity_id
      const target = targetById.get(targetId)
      const step = stepById.get(row.step_entity_id)
      return {
        label: target?.name || 'Entidad por documentar',
        meta: [relationalPeriodLabel(row), row.outing_type, row.position, step?.name].filter(Boolean).join(' · '),
        href: entityHref(target),
        group: row.is_current ? 'Vigente' : 'Histórico',
      }
    }),
    evidence: [{
      key: `music-history-${root.id}`,
      label: 'Periodos musicales publicados',
      detail: `${usable.length} periodos · ${uniqueTargets.length} entidades relacionadas`,
    }],
    followUps: direction === 'band_to_brotherhood'
      ? ['¿Y a cuáles acompaña actualmente?', 'Ordénalas de más antigua a más reciente.']
      : ['¿Qué bandas acompañan actualmente a esta hermandad?', '¿Cuál es la vinculación más antigua?'],
    context: resultSetContext({ root, entities: uniqueTargets, sourceIntent: 'music_history' }),
    compactItemLimit: Math.min(Math.max(usable.length, 5), 12),
  })
}

async function repertoireEntries(question) {
  const repertoires = await getMusicalRepertoires()
  if (!repertoires.length) return null
  const ranked = repertoires
    .map((repertoire) => ({ repertoire, score: relationalRepertoireScore(repertoire, question) }))
    .filter(({ score }) => score >= 700)
    .sort((first, second) => second.score - first.score)
  if (!ranked.length) return null

  const bestScore = ranked[0].score
  const selected = ranked
    .filter(({ score }) => score >= bestScore - 50)
    .slice(0, 3)
    .map(({ repertoire }) => repertoire)
  const entries = selected
    .flatMap((repertoire) => (repertoire.entries || []).map((entry) => ({ repertoire, entry })))
    .slice(0, 30)
  if (!entries.length) {
    return notDocumented(`La cruceta ${selected[0]?.displayTitle || selected[0]?.title || 'seleccionada'} está publicada, pero todavía no tiene marchas cargadas.`)
  }

  const marchEntities = entries
    .filter(({ entry }) => entry.marchId && entry.marchHref)
    .map(({ entry }) => ({
      id: entry.marchId,
      entity_type: 'march',
      name: entry.catalogTitle || entry.title,
      slug: entry.marchSlug || '',
    }))
  const uniqueMarches = [...new Map(marchEntities.map((entity) => [entity.id, entity])).values()].slice(0, 12)
  const totalWorks = entries.length
  const primary = selected[0]

  return answer({
    text: selected.length === 1
      ? `${primary.displayTitle || primary.title} contiene ${totalWorks} ${totalWorks === 1 ? 'marcha publicada' : 'marchas publicadas'} en Hilo Cofrade.`
      : `He localizado ${selected.length} crucetas que coinciden con la consulta y ${totalWorks} marchas publicadas entre ellas.`,
    path: ['Música', 'Crucetas musicales', selected.length === 1 ? (primary.displayTitle || primary.title) : 'Coincidencias', 'Marchas'],
    entities: uniqueMarches.map((entity) => publicEntity(entity)),
    items: entries.slice(0, 12).map(({ repertoire, entry }) => ({
      label: entry.catalogTitle || entry.title,
      meta: [
        entry.count > 1 ? `${entry.count} interpretaciones` : '',
        (entry.authors || []).map((author) => author.name).filter(Boolean).join(', '),
        entry.compositionYear,
      ].filter(Boolean).join(' · '),
      href: entry.marchHref || repertoire.href,
      group: selected.length > 1 ? (repertoire.displayTitle || repertoire.title) : '',
    })),
    links: selected.map((repertoire) => ({
      label: `Abrir ${repertoire.displayTitle || repertoire.title}`,
      href: repertoire.href,
    })),
    evidence: selected.map((repertoire) => ({
      key: `repertoire-${repertoire.id}`,
      label: 'Cruceta musical publicada',
      detail: `${repertoire.displayTitle || repertoire.title} · ${repertoire.worksCount} obras`,
    })),
    followUps: uniqueMarches.length
      ? ['¿Quién compuso estas marchas?', '¿Qué tienen en común?', 'Ordénalas de más antigua a más reciente.']
      : [],
    context: uniqueMarches.length
      ? resultSetContext({ entities: uniqueMarches, sourceIntent: 'repertoire_entries' })
      : null,
    compactItemLimit: Math.min(Math.max(Math.min(totalWorks, 12), 5), 12),
  })
}

async function brotherhoodsWithMusic(supabase, context) {
  const ids = [...new Set(context?.resultSet?.entityIds || [])].slice(0, 12)
  if (!ids.length) return null
  const [brotherhoods, music] = await Promise.all([
    entitiesByIds(supabase, ids, 'brotherhood'),
    supabase
      .from('current_music_accompaniments')
      .select('brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type')
      .in('brotherhood_entity_id', ids),
  ])
  if (music.error) throw music.error
  const rows = music.data || []
  const activeIds = new Set(rows.map((row) => row.brotherhood_entity_id))
  const filtered = brotherhoods.filter((brotherhood) => activeIds.has(brotherhood.id))
  if (!filtered.length) {
    return notDocumented('Ninguna de las hermandades del conjunto anterior tiene acompañamientos musicales actuales publicados.', context)
  }

  const bands = await entitiesByIds(supabase, rows.map((row) => row.band_entity_id), 'band')
  const bandById = new Map(bands.map((entity) => [entity.id, entity]))
  const rowsByBrotherhood = new Map()
  rows.forEach((row) => {
    const current = rowsByBrotherhood.get(row.brotherhood_entity_id) || []
    current.push(row)
    rowsByBrotherhood.set(row.brotherhood_entity_id, current)
  })

  return answer({
    text: `De las ${brotherhoods.length} hermandades del conjunto anterior, ${filtered.length} ${filtered.length === 1 ? 'tiene' : 'tienen'} acompañamiento musical actual publicado.`,
    path: ['Contexto anterior', 'Hermandades', 'Con acompañamiento musical'],
    entities: filtered.map((brotherhood) => publicEntity(brotherhood)),
    items: filtered.map((brotherhood) => ({
      label: brotherhood.name,
      meta: (rowsByBrotherhood.get(brotherhood.id) || [])
        .map((row) => [bandById.get(row.band_entity_id)?.name, row.outing_type, row.position].filter(Boolean).join(' · '))
        .join(' / '),
      href: entityHref(brotherhood),
    })),
    followUps: ['¿Qué bandas acompañan a estas hermandades?', 'Compáralas.', 'Ordénalas de más antigua a más reciente.'],
    context: resultSetContext({ entities: filtered, sourceIntent: 'brotherhoods_with_music' }),
    compactItemLimit: Math.min(Math.max(filtered.length, 3), 12),
  })
}

export async function askHiloCofradeRelationalV2(question, context = null) {
  const intent = relationalV2Intent(question, context)
  if (!intent) return null

  try {
    if (intent.kind === 'repertoire_entries') return await repertoireEntries(question)
    const supabase = await createClient()
    if (intent.kind === 'music_for_subject') return await musicForSubject(supabase, question)
    if (intent.kind === 'music_history') return await musicHistory(supabase, question)
    if (intent.kind === 'brotherhoods_with_music') return await brotherhoodsWithMusic(supabase, context)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en Buscador relacional V2', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
