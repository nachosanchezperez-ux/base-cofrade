import 'server-only'

import { askHiloCofradeV2 } from '@/lib/supabase/tira-del-hilo-v2'
import { createClient } from '@/lib/supabase/server'

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

async function publicEntitiesByIds(supabase, ids, entityType = null) {
  const unique = [...new Set((ids || []).filter(Boolean))].slice(0, 12)
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

function setLabel(entities, root = null) {
  const count = entities.length
  const noun = count === 1 ? 'imagen' : 'imágenes'
  return `${count} ${noun}${root?.name ? ` de ${root.name}` : ''}`
}

function resultSetContext({ root = null, entities = [], sourceIntent = '' }) {
  const entityIds = entities.map((entity) => entity.id).filter(Boolean).slice(0, 12)
  return {
    entityId: root?.id || null,
    entityType: root?.entity_type || null,
    name: root?.name || '',
    resultSet: {
      entityType: 'image',
      entityIds,
      count: entityIds.length,
      label: setLabel(entities, root),
      sourceIntent,
    },
  }
}

function imageSetFollowUpIntent(question, context) {
  const set = context?.resultSet
  if (set?.entityType !== 'image' || !Array.isArray(set.entityIds) || !set.entityIds.length) return null

  const q = normalize(question)
  const refersToSet = /\b(cada una|cuales|ellas|estas|esas|las anteriores|las imagenes|estas imagenes|esas imagenes|todas)\b/.test(q)
    || /\blas hizo\b/.test(q)
    || /^y\b/.test(q)

  if (
    /\b(quien|autoria|autor|autores|hizo|realizo|creo)\b/.test(q)
    && refersToSet
  ) return 'image_set_authorship'

  if (/\b(restaurad|restauradas|restauracion|restauraciones|intervenidas|intervencion|intervenciones)\b/.test(q) && refersToSet) {
    return 'image_set_restorations'
  }

  if (/\b(comparamelas|comparalas|compara|comparar|comparacion|diferencias|diferencian)\b/.test(q)) {
    return 'image_set_compare'
  }

  return null
}

async function resolveImageSet(supabase, context) {
  const entities = await publicEntitiesByIds(supabase, context?.resultSet?.entityIds || [], 'image')
  if (!entities.length) return null
  const root = await publicEntityById(supabase, context?.entityId)
  return { entities, root }
}

function certaintyLabel(value = '') {
  const normalized = normalize(value)
  if (!normalized) return ''
  if (normalized === 'documented') return 'documentada'
  if (normalized === 'attributed') return 'atribuida'
  if (normalized === 'probable') return 'probable'
  if (normalized === 'traditional') return 'tradicional'
  return value
}

function authorshipFallback(summary = '') {
  const text = String(summary || '').trim()
  if (!text) return 'Autoría no documentada en esta capa del grafo'

  const attributed = text.match(/tradicionalmente atribuida a ([^.]+)/i)
  if (attributed?.[1]) return `Autoría anónima · atribución tradicional a ${attributed[1].trim()}`

  const related = text.match(/tradicionalmente relacionada con ([^.]+)/i)
  if (related?.[1]) return `Autoría anónima · relación tradicional con ${related[1].trim()}`

  const madeBy = text.match(/realizad[ao] por ([^.]+)/i)
  if (madeBy?.[1]) return `Autoría indicada en ficha · ${madeBy[1].trim()}`

  if (/autoría anónima|imagen anónima|\banónim[oa]\b/i.test(text)) return 'Autoría anónima'
  return 'Autoría no documentada en esta capa del grafo'
}

function authorshipMeta(entity, rows = []) {
  if (!rows.length) return authorshipFallback(entity?.summary)
  return rows
    .map((row) => [
      row.agent_name,
      row.role_name,
      row.certainty ? `certeza ${certaintyLabel(row.certainty)}` : '',
    ].filter(Boolean).join(' · '))
    .join(' / ')
}

async function authorshipOfImageSet(supabase, resolved, sourceIntent) {
  const { entities, root } = resolved
  const result = await supabase
    .from('image_authorship_details')
    .select('image_entity_id, agent_name, role_name, authorship_type, certainty')
    .in('image_entity_id', entities.map((entity) => entity.id))
  if (result.error) throw result.error

  const rowsByImage = new Map()
  ;(result.data || []).forEach((row) => {
    const rows = rowsByImage.get(row.image_entity_id) || []
    rows.push(row)
    rowsByImage.set(row.image_entity_id, rows)
  })

  const context = resultSetContext({ root, entities, sourceIntent })
  return answer({
    text: `Sigo con las ${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'} anteriores. Para cada una muestro la autoría estructurada cuando existe y, si no, únicamente la atribución o anonimato que ya figura en su ficha.`,
    path: ['Contexto anterior', `${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'}`, 'Autoría'],
    items: entities.map((entity) => ({
      label: entity.name,
      meta: authorshipMeta(entity, rowsByImage.get(entity.id) || []),
      href: entityHref(entity),
    })),
    followUps: ['¿Y cuáles han sido restauradas?', 'Compáramelas.'],
    context,
  })
}

async function restorationsOfImageSet(supabase, resolved, sourceIntent) {
  const { entities, root } = resolved
  const result = await supabase
    .from('image_restorations')
    .select('image_entity_id, title, update_date, year, discipline, description')
    .in('image_entity_id', entities.map((entity) => entity.id))
  if (result.error) throw result.error

  const rows = result.data || []
  const rowsByImage = new Map()
  rows.forEach((row) => {
    const current = rowsByImage.get(row.image_entity_id) || []
    current.push(row)
    rowsByImage.set(row.image_entity_id, current)
  })

  const restored = entities.filter((entity) => rowsByImage.has(entity.id))
  const context = resultSetContext({ root, entities, sourceIntent })

  if (!restored.length) {
    return answer({
      text: `En las ${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'} que veníamos consultando no hay restauraciones publicadas en Hilo Cofrade en este momento. Eso no significa que no existan históricamente; significa que todavía no están documentadas en esta capa del grafo.`,
      path: ['Contexto anterior', `${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'}`, 'Restauraciones'],
      followUps: ['¿Quién hizo cada una?', 'Compáramelas.'],
      context,
    })
  }

  return answer({
    text: `De las ${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'} anteriores, ${restored.length} ${restored.length === 1 ? 'tiene' : 'tienen'} restauraciones publicadas en Hilo Cofrade.`,
    path: ['Contexto anterior', `${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'}`, 'Restauraciones'],
    items: restored.map((entity) => {
      const restorations = rowsByImage.get(entity.id) || []
      const details = restorations.map((row) => [
        row.year || row.update_date || '',
        row.discipline,
        row.title,
      ].filter(Boolean).join(' · ')).join(' / ')
      return { label: entity.name, meta: details, href: entityHref(entity) }
    }),
    followUps: ['¿Quién hizo cada una?', 'Compáramelas.'],
    context,
  })
}

function imageChronology(row = {}) {
  return row.execution_date_text || row.execution_date || 'Datación no documentada'
}

async function compareImageSet(supabase, resolved, sourceIntent) {
  const { entities, root } = resolved
  const ids = entities.map((entity) => entity.id)
  const [imageRowsResult, authorshipResult, restorationResult] = await Promise.all([
    supabase
      .from('images')
      .select('entity_id, image_type, execution_date, execution_date_text, material, technique, dimensions_text, anatomical_type, current_condition')
      .in('entity_id', ids),
    supabase
      .from('image_authorship_details')
      .select('image_entity_id, agent_name, role_name, certainty')
      .in('image_entity_id', ids),
    supabase
      .from('image_restorations')
      .select('image_entity_id, year, update_date')
      .in('image_entity_id', ids),
  ])
  if (imageRowsResult.error) throw imageRowsResult.error
  if (authorshipResult.error) throw authorshipResult.error
  if (restorationResult.error) throw restorationResult.error

  const imageById = new Map((imageRowsResult.data || []).map((row) => [row.entity_id, row]))
  const authorshipById = new Map()
  ;(authorshipResult.data || []).forEach((row) => {
    const rows = authorshipById.get(row.image_entity_id) || []
    rows.push(row)
    authorshipById.set(row.image_entity_id, rows)
  })
  const restorationCount = new Map()
  ;(restorationResult.data || []).forEach((row) => {
    restorationCount.set(row.image_entity_id, (restorationCount.get(row.image_entity_id) || 0) + 1)
  })

  const context = resultSetContext({ root, entities, sourceIntent })
  return answer({
    text: `Comparo las ${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'} que veníamos consultando con los campos que están documentados de forma homogénea: datación, tipología, técnica o material, autoría y restauraciones publicadas.`,
    path: ['Contexto anterior', `${entities.length} ${entities.length === 1 ? 'imagen' : 'imágenes'}`, 'Comparación'],
    items: entities.map((entity) => {
      const row = imageById.get(entity.id) || {}
      const restorations = restorationCount.get(entity.id) || 0
      return {
        label: entity.name,
        meta: [
          row.image_type,
          imageChronology(row),
          row.material ? `Material: ${row.material}` : '',
          row.technique ? `Técnica: ${row.technique}` : '',
          authorshipMeta(entity, authorshipById.get(entity.id) || []),
          restorations ? `${restorations} ${restorations === 1 ? 'restauración publicada' : 'restauraciones publicadas'}` : 'Sin restauraciones publicadas',
        ].filter(Boolean).join(' · '),
        href: entityHref(entity),
      }
    }),
    followUps: ['¿Quién hizo cada una?', '¿Y cuáles han sido restauradas?'],
    context,
  })
}

function imageSlugFromHref(href = '') {
  const match = String(href).match(/^\/imagenes\/([^/?#]+)/)
  return match?.[1] || ''
}

async function augmentImageChronologyResponse(supabase, response) {
  const isChronology = response?.kind === 'answer'
    && Array.isArray(response.path)
    && response.path.join('|') === 'Hermandad|Imágenes|Datación'
  if (!isChronology) return response

  const slugs = [...new Set((response.items || []).map((item) => imageSlugFromHref(item.href)).filter(Boolean))].slice(0, 12)
  if (!slugs.length) return response

  const entityResult = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', 'image')
    .eq('status', 'published')
    .in('slug', slugs)
  if (entityResult.error) throw entityResult.error

  const bySlug = new Map((entityResult.data || []).map((entity) => [entity.slug, entity]))
  const entities = slugs.map((slug) => bySlug.get(slug)).filter(Boolean)
  if (!entities.length) return response

  const root = await publicEntityById(supabase, response?.context?.entityId)
  return {
    ...response,
    followUps: ['¿Quién hizo cada una?', '¿Y cuáles han sido restauradas?', 'Compáramelas.'],
    context: resultSetContext({ root, entities, sourceIntent: 'images_by_chronology' }),
  }
}

export async function askHiloCofradeV3(question, context = null) {
  const clean = String(question || '').trim()
  if (!clean) return notDocumented('Escribe una pregunta para empezar a tirar del hilo.')
  if (clean.length > 320) return notDocumented('La consulta es demasiado larga. Prueba con una pregunta más concreta.')

  const setIntent = imageSetFollowUpIntent(clean, context)
  if (setIntent) {
    const supabase = await createClient()
    try {
      const resolved = await resolveImageSet(supabase, context)
      if (!resolved) return notDocumented('El conjunto anterior ya no contiene imágenes públicas que pueda consultar.')
      const sourceIntent = context?.resultSet?.sourceIntent || 'image_result_set'
      if (setIntent === 'image_set_authorship') return await authorshipOfImageSet(supabase, resolved, sourceIntent)
      if (setIntent === 'image_set_restorations') return await restorationsOfImageSet(supabase, resolved, sourceIntent)
      if (setIntent === 'image_set_compare') return await compareImageSet(supabase, resolved, sourceIntent)
    } catch (error) {
      console.error('[Hilo Cofrade] Error al continuar un conjunto contextual', {
        question: clean,
        setIntent,
        error: error instanceof Error ? error.message : String(error),
      })
      return notDocumented('No he podido continuar ese conjunto ahora mismo. Prefiero no completar la respuesta con información no documentada.', context)
    }
  }

  const response = await askHiloCofradeV2(clean, context)
  if (response?.kind !== 'answer') return response

  try {
    const supabase = await createClient()
    return await augmentImageChronologyResponse(supabase, response)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo preparar el conjunto contextual', {
      question: clean,
      error: error instanceof Error ? error.message : String(error),
    })
    return response
  }
}
