import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  dedicationTypeLabel,
  freeDirectIntent,
  normalizeFreeDirectText,
} from '@/lib/tira-free-direct'
import { rankTiraReferences } from '@/lib/tira-references'

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

function contextFor(entity) {
  return entity ? { entityId: entity.id, entityType: entity.entity_type, name: entity.name } : null
}

function answer({ text, path = [], entities = [], items = [], evidence = [], references = [], referencesNote = '', followUps = [], context = null }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    evidence,
    references,
    referencesNote,
    followUps,
    context,
  }
}

function notDocumented(text, march) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: march ? [publicEntity(march)] : [],
    items: [],
    evidence: [],
    references: [],
    followUps: march ? [`¿Quién compuso ${march.name}?`, `Cuéntame sobre ${march.name}`] : [],
    context: contextFor(march),
  }
}

function scoreName(name = '', question = '') {
  const n = normalizeFreeDirectText(name)
  const q = normalizeFreeDirectText(question)
  if (!n || !q) return 0
  if (q.includes(n)) return 1000 + n.length
  const trimmed = n.replace(/^(marcha|la|el) /, '')
  return trimmed.length >= 5 && q.includes(trimmed) ? 800 + trimmed.length : 0
}

async function publishedEntityById(supabase, id) {
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

async function publishedEntitiesByIds(supabase, ids = []) {
  const unique = [...new Set(ids.filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .eq('status', 'published')
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

async function resolveMarch(supabase, question, context) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', 'march')
    .eq('status', 'published')
  if (result.error) throw result.error

  const explicit = (result.data || [])
    .map((entity) => ({ entity, score: scoreName(entity.name, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
  if (explicit) return explicit

  if (context?.entityType === 'march' && context?.entityId) {
    return publishedEntityById(supabase, context.entityId)
  }
  return null
}

async function sourceReferences(supabase, { entityId = null, dedicationIds = [] } = {}) {
  let linksResult
  if (dedicationIds.length) {
    linksResult = await supabase
      .from('source_links')
      .select('source_id, march_dedication_id, scope')
      .in('march_dedication_id', dedicationIds)
  } else if (entityId) {
    linksResult = await supabase
      .from('source_links')
      .select('source_id, entity_id, scope')
      .eq('entity_id', entityId)
  } else {
    return []
  }
  if (linksResult.error) throw linksResult.error

  const links = (linksResult.data || []).map((link) => ({
    ...link,
    entity_id: entityId || link.march_dedication_id || '',
    scope: dedicationIds.length
      ? ['Exacta · Dedicatoria', link.scope].filter(Boolean).join(' · ')
      : link.scope,
  }))
  const sourceIds = [...new Set(links.map((link) => link.source_id).filter(Boolean))]
  if (!sourceIds.length) return []

  const sourcesResult = await supabase
    .from('sources')
    .select('id, name, url, source_type, author_or_publisher, publication_date')
    .in('id', sourceIds)
  if (sourcesResult.error) throw sourcesResult.error
  return rankTiraReferences(sourcesResult.data || [], links, 4)
}

async function marchCompositionDate(supabase, march) {
  const result = await supabase
    .from('marches')
    .select('composition_year, composition_date_text')
    .eq('entity_id', march.id)
    .maybeSingle()
  if (result.error) throw result.error
  const row = result.data || {}
  const dateLabel = String(row.composition_date_text || row.composition_year || '').trim()
  if (!dateLabel) return notDocumented(`La fecha de composición de «${march.name}» todavía no está documentada en Hilo Cofrade.`, march)
  const references = await sourceReferences(supabase, { entityId: march.id })

  return answer({
    text: `La composición de «${march.name}» está documentada en ${dateLabel}.`,
    path: ['Marcha', 'Datación', 'Composición'],
    entities: [publicEntity(march, dateLabel)],
    items: [{ label: 'Composición', meta: dateLabel, href: '' }],
    evidence: [{ key: `march-date-${march.id}`, label: 'Datación publicada', detail: dateLabel }],
    references,
    referencesNote: references.length ? 'Fuentes vinculadas a la ficha publicada de la marcha.' : '',
    followUps: [`¿Quién compuso ${march.name}?`, `¿A quién está dedicada ${march.name}?`, `¿Cuándo se estrenó ${march.name}?`],
    context: contextFor(march),
  })
}

async function marchDedication(supabase, march) {
  const result = await supabase
    .from('march_dedications')
    .select('id, dedicatee_entity_id, dedication_type, dedication_text, date_from_text, notes')
    .eq('march_entity_id', march.id)
    .eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return notDocumented(`La dedicatoria de «${march.name}» todavía no está documentada en Hilo Cofrade.`, march)

  const dedicatees = await publishedEntitiesByIds(supabase, rows.map((row) => row.dedicatee_entity_id))
  const byId = new Map(dedicatees.map((entity) => [entity.id, entity]))
  const items = rows.map((row) => {
    const entity = byId.get(row.dedicatee_entity_id)
    const label = entity?.name || String(row.dedication_text || 'Dedicatoria documentada').trim()
    return {
      label,
      meta: [dedicationTypeLabel(row.dedication_type), row.date_from_text, entity && row.dedication_text !== entity.name ? row.dedication_text : ''].filter(Boolean).join(' · '),
      href: entityHref(entity),
    }
  })
  const references = await sourceReferences(supabase, {
    entityId: march.id,
    dedicationIds: rows.map((row) => row.id),
  })
  const names = [...new Set(items.map((item) => item.label).filter(Boolean))]
  const text = names.length === 1
    ? `«${march.name}» está dedicada a ${names[0]}.`
    : `«${march.name}» tiene ${names.length} dedicatorias publicadas: ${names.join(', ')}.`

  return answer({
    text,
    path: ['Marcha', 'Dedicatoria', 'Entidad relacionada'],
    entities: [publicEntity(march), ...dedicatees.map((entity) => publicEntity(entity, 'Dedicatoria documentada'))],
    items,
    evidence: rows.slice(0, 4).map((row, index) => ({
      key: `march-dedication-${row.id || index}`,
      label: 'Dedicatoria publicada',
      detail: [items[index]?.label, dedicationTypeLabel(row.dedication_type), row.date_from_text].filter(Boolean).join(' · '),
    })),
    references,
    referencesNote: references.length ? 'Las fuentes marcadas como “Exacta · Dedicatoria” están enlazadas al registro de dedicatoria utilizado.' : '',
    followUps: [`¿De qué año es ${march.name}?`, `¿Quién compuso ${march.name}?`, `¿Cuándo se estrenó ${march.name}?`],
    context: contextFor(march),
  })
}

async function marchPremiere(supabase, march) {
  const result = await supabase
    .from('marches')
    .select('premiere_date, premiere_date_text, premiere_place_id, premiered_by_band_entity_id')
    .eq('entity_id', march.id)
    .maybeSingle()
  if (result.error) throw result.error
  const row = result.data || {}
  const dateLabel = String(row.premiere_date_text || row.premiere_date || '').trim()
  if (!dateLabel && !row.premiere_place_id && !row.premiered_by_band_entity_id) {
    return notDocumented(`El estreno de «${march.name}» todavía no está documentado en Hilo Cofrade.`, march)
  }

  const [band, placeResult, references] = await Promise.all([
    publishedEntityById(supabase, row.premiered_by_band_entity_id),
    row.premiere_place_id
      ? supabase.from('places').select('id, name').eq('id', row.premiere_place_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    sourceReferences(supabase, { entityId: march.id }),
  ])
  if (placeResult.error) throw placeResult.error
  const place = placeResult.data || null
  const details = [dateLabel, place?.name, band?.name].filter(Boolean)

  return answer({
    text: `El estreno documentado de «${march.name}»${dateLabel ? ` figura en ${dateLabel}` : ''}${place?.name ? `, en ${place.name}` : ''}${band?.name ? `, a cargo de ${band.name}` : ''}.`,
    path: ['Marcha', 'Estreno', 'Datos publicados'],
    entities: [publicEntity(march), publicEntity(band, 'Formación del estreno')],
    items: [
      dateLabel ? { label: 'Fecha de estreno', meta: dateLabel, href: '' } : null,
      place?.name ? { label: 'Lugar', meta: place.name, href: '' } : null,
      band ? { label: band.name, meta: 'Formación del estreno', href: entityHref(band) } : null,
    ].filter(Boolean),
    evidence: [{ key: `march-premiere-${march.id}`, label: 'Estreno publicado', detail: details.join(' · ') }],
    references,
    referencesNote: references.length ? 'Fuentes vinculadas a la ficha publicada de la marcha.' : '',
    followUps: [`¿De qué año es ${march.name}?`, `¿Quién compuso ${march.name}?`, `¿A quién está dedicada ${march.name}?`],
    context: contextFor(march),
  })
}

async function marchType(supabase, march) {
  const result = await supabase
    .from('marches')
    .select('music_type')
    .eq('entity_id', march.id)
    .maybeSingle()
  if (result.error) throw result.error
  const musicType = String(result.data?.music_type || '').trim()
  if (!musicType) return notDocumented(`El tipo musical de «${march.name}» todavía no está documentado en Hilo Cofrade.`, march)
  const references = await sourceReferences(supabase, { entityId: march.id })

  return answer({
    text: `«${march.name}» está clasificada en Hilo Cofrade como ${musicType}.`,
    path: ['Marcha', 'Clasificación', 'Tipo musical'],
    entities: [publicEntity(march, musicType)],
    items: [{ label: 'Tipo musical', meta: musicType, href: '' }],
    evidence: [{ key: `march-type-${march.id}`, label: 'Clasificación publicada', detail: musicType }],
    references,
    referencesNote: references.length ? 'Fuentes vinculadas a la ficha publicada de la marcha.' : '',
    followUps: [`¿Quién compuso ${march.name}?`, `¿De qué año es ${march.name}?`, `¿A quién está dedicada ${march.name}?`],
    context: contextFor(march),
  })
}

export async function askHiloCofradeFreeDirect(question, context = null) {
  const intent = freeDirectIntent(question, context?.entityType || '')
  if (!intent) return null

  const supabase = await createClient()
  try {
    const march = await resolveMarch(supabase, question, context)
    if (!march) return null

    if (intent === 'march_composition_date') return await marchCompositionDate(supabase, march)
    if (intent === 'march_dedication') return await marchDedication(supabase, march)
    if (intent === 'march_premiere') return await marchPremiere(supabase, march)
    if (intent === 'march_type') return await marchType(supabase, march)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en dato directo gratuito de marcha', {
      question: String(question || '').slice(0, 320),
      intent,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
