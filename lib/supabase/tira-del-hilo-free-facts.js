import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { freeFactIntent, freeSetIntent, normalizeFreeFactText } from '@/lib/tira-free-facts'
import { rankTiraReferences } from '@/lib/tira-references'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / profesional',
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

function notDocumented(text, context = null) {
  return {
    kind: 'not_documented',
    answer: text,
    path: [],
    entities: [],
    items: [],
    evidence: [],
    references: [],
    followUps: [],
    context,
  }
}

function scoreName(name = '', question = '') {
  const n = normalizeFreeFactText(name)
  const q = normalizeFreeFactText(question)
  if (!n || !q) return 0
  if (q === n) return 1200
  if (q.includes(n)) return 1000 + Math.min(n.length, 100)
  const variants = [
    n.replace(/^hermandad de /, ''),
    n.replace(/^hermandad /, ''),
    n.replace(/^banda de /, ''),
    n.replace(/^banda /, ''),
    n.replace(/^(la|el) /, ''),
  ].filter((value) => value.length >= 5)
  const direct = variants.filter((value) => q.includes(value)).sort((a, b) => b.length - a.length)[0]
  return direct ? 800 + direct.length : 0
}

async function resolveEntity(supabase, question, entityTypes, context = null) {
  const types = [...new Set((entityTypes || []).filter(Boolean))]
  if (!types.length) return null
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('entity_type', types)
    .eq('status', 'published')
  if (result.error) throw result.error

  const explicit = (result.data || [])
    .map((entity) => ({ entity, score: scoreName(entity.name, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
  if (explicit) return explicit

  if (context?.entityId && types.includes(context.entityType)) {
    const contextual = await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary')
      .eq('id', context.entityId)
      .eq('status', 'published')
      .maybeSingle()
    if (contextual.error) throw contextual.error
    return contextual.data || null
  }
  return null
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
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function safeUrl(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

function youtubeUrl(value = '') {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return safeUrl(raw)
  return `https://www.youtube.com/watch?v=${encodeURIComponent(raw)}`
}

function providerLabel(url = '') {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes('spotify')) return 'Spotify'
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube'
    return host.replace(/^www\./, '')
  } catch {
    return 'Escucha externa'
  }
}

async function sourceReferences(supabase, { entityId = null, recordingIds = [] } = {}) {
  const linkGroups = []
  if (entityId) {
    const result = await supabase
      .from('source_links')
      .select('source_id, entity_id, scope')
      .eq('entity_id', entityId)
    if (result.error) throw result.error
    linkGroups.push(...(result.data || []))
  }
  if (recordingIds.length) {
    const result = await supabase
      .from('source_links')
      .select('source_id, march_recording_id, scope')
      .in('march_recording_id', recordingIds)
    if (result.error) throw result.error
    linkGroups.push(...(result.data || []).map((row) => ({
      source_id: row.source_id,
      entity_id: row.march_recording_id,
      scope: ['Exacta · Grabación', row.scope].filter(Boolean).join(' · '),
    })))
  }
  const sourceIds = [...new Set(linkGroups.map((link) => link.source_id).filter(Boolean))]
  if (!sourceIds.length) return []
  const sources = await supabase
    .from('sources')
    .select('id, name, url, source_type, author_or_publisher, publication_date')
    .in('id', sourceIds)
  if (sources.error) throw sources.error
  return rankTiraReferences(sources.data || [], linkGroups, 4)
}

async function marchListening(supabase, march) {
  const [marchRowResult, recordingResult, trackResult] = await Promise.all([
    supabase.from('marches').select('youtube_video_id').eq('entity_id', march.id).maybeSingle(),
    supabase
      .from('march_recordings')
      .select('id, band_entity_id, recording_date_text, youtube_video_id, external_url, title, is_featured')
      .eq('march_entity_id', march.id)
      .eq('status', 'published'),
    supabase
      .from('band_release_tracks')
      .select('id, release_id, title, duration_text, spotify_url')
      .eq('march_entity_id', march.id),
  ])
  if (marchRowResult.error) throw marchRowResult.error
  if (recordingResult.error) throw recordingResult.error
  if (trackResult.error) throw trackResult.error

  const recordings = recordingResult.data || []
  const tracks = trackResult.data || []
  const releaseIds = [...new Set(tracks.map((row) => row.release_id).filter(Boolean))]
  const releasesResult = releaseIds.length
    ? await supabase
        .from('band_releases')
        .select('id, band_entity_id, title, release_year, status')
        .in('id', releaseIds)
        .eq('status', 'published')
    : { data: [], error: null }
  if (releasesResult.error) throw releasesResult.error
  const releases = releasesResult.data || []
  const releaseById = new Map(releases.map((row) => [row.id, row]))
  const bandIds = [
    ...recordings.map((row) => row.band_entity_id),
    ...releases.map((row) => row.band_entity_id),
  ]
  const bands = await entitiesByIds(supabase, bandIds)
  const bandById = new Map(bands.map((entity) => [entity.id, entity]))

  const options = []
  const push = ({ label, meta, url, provider, priority = 0 }) => {
    const cleanUrl = safeUrl(url)
    if (!cleanUrl) return
    options.push({ label, meta, externalUrl: cleanUrl, provider, priority })
  }

  const mainYoutube = youtubeUrl(marchRowResult.data?.youtube_video_id)
  if (mainYoutube) {
    push({ label: `Escuchar «${march.name}»`, meta: 'YouTube · vídeo asociado a la marcha', url: mainYoutube, provider: 'YouTube', priority: 90 })
  }

  recordings.forEach((row) => {
    const band = bandById.get(row.band_entity_id)
    const baseMeta = [band?.name, row.recording_date_text, row.is_featured ? 'Grabación destacada' : 'Grabación publicada'].filter(Boolean).join(' · ')
    const yt = youtubeUrl(row.youtube_video_id)
    if (yt) push({ label: row.title || `Grabación de «${march.name}»`, meta: ['YouTube', baseMeta].filter(Boolean).join(' · '), url: yt, provider: 'YouTube', priority: row.is_featured ? 100 : 80 })
    const external = safeUrl(row.external_url)
    if (external && external !== yt) {
      const provider = providerLabel(external)
      push({ label: row.title || `Grabación de «${march.name}»`, meta: [provider, baseMeta].filter(Boolean).join(' · '), url: external, provider, priority: row.is_featured ? 95 : 75 })
    }
  })

  tracks.forEach((row) => {
    const release = releaseById.get(row.release_id)
    if (!release) return
    const url = safeUrl(row.spotify_url)
    if (!url) return
    const band = bandById.get(release.band_entity_id)
    push({
      label: row.title || march.name,
      meta: ['Spotify', release.title, release.release_year, band?.name, row.duration_text].filter(Boolean).join(' · '),
      url,
      provider: 'Spotify',
      priority: 110,
    })
  })

  const seen = new Set()
  const sorted = options
    .sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label, 'es'))
    .filter((item) => {
      if (seen.has(item.externalUrl)) return false
      seen.add(item.externalUrl)
      return true
    })
    .slice(0, 8)

  if (!sorted.length) {
    return notDocumented(`No hay todavía una grabación o enlace de escucha publicado para «${march.name}» en Hilo Cofrade.`, contextFor(march))
  }

  const references = await sourceReferences(supabase, {
    entityId: march.id,
    recordingIds: recordings.map((row) => row.id),
  })
  const providers = [...new Set(sorted.map((item) => item.provider).filter(Boolean))]

  return answer({
    text: `He encontrado ${sorted.length} ${sorted.length === 1 ? 'opción publicada' : 'opciones publicadas'} para escuchar «${march.name}»${providers.length ? ` en ${providers.join(' y ')}` : ''}.`,
    path: ['Marcha', 'Grabaciones y discografía', 'Escucha'],
    entities: [publicEntity(march, 'Marcha consultada')],
    items: sorted.map(({ priority, provider, ...item }) => item),
    evidence: [{ key: `march-listen-${march.id}`, label: 'Enlaces de escucha publicados', detail: `${sorted.length} opciones · ${providers.join(', ')}` }],
    references,
    referencesNote: references.length ? 'Las fuentes marcadas como “Exacta · Grabación” están enlazadas a grabaciones concretas; las demás respaldan la ficha de la marcha.' : '',
    followUps: [`¿Quién compuso ${march.name}?`, `¿De qué año es ${march.name}?`, `¿A quién está dedicada ${march.name}?`],
    context: contextFor(march),
  })
}

async function placeById(supabase, id) {
  if (!id) return null
  const result = await supabase.from('places').select('id, name, address, municipality_id').eq('id', id).maybeSingle()
  if (result.error) throw result.error
  return result.data || null
}

async function municipalityById(supabase, id) {
  if (!id) return null
  const result = await supabase.from('municipalities').select('id, name').eq('id', id).maybeSingle()
  if (result.error) throw result.error
  return result.data || null
}

function dimensionsLabel(row = {}, kind = '') {
  if (row.dimensions_text) return String(row.dimensions_text).trim()
  const values = kind === 'image'
    ? [row.height_cm && `${row.height_cm} cm alto`, row.width_cm && `${row.width_cm} cm ancho`, row.depth_cm && `${row.depth_cm} cm fondo`]
    : [row.length_cm && `${row.length_cm} cm largo`, row.width_cm && `${row.width_cm} cm ancho`, row.height_cm && `${row.height_cm} cm alto`]
  return values.filter(Boolean).join(' · ')
}

async function entityFact(supabase, entity, intent) {
  const references = await sourceReferences(supabase, { entityId: entity.id })
  const referenceNote = references.length ? 'Fuentes vinculadas a la ficha publicada de la entidad consultada.' : ''

  if (entity.entity_type === 'brotherhood') {
    const result = await supabase
      .from('brotherhoods')
      .select('foundation_text, municipality_id, canonical_see_place_id, neighborhood, brotherhood_types, current_procession_day')
      .eq('entity_id', entity.id)
      .maybeSingle()
    if (result.error) throw result.error
    const row = result.data || {}

    if (intent.kind === 'foundation' || intent.kind === 'entity_date') {
      const value = String(row.foundation_text || '').trim()
      if (!value) return notDocumented(`La fecha de fundación de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `${entity.name} tiene documentada su fundación en ${value}.`, path: ['Hermandad', 'Fundación'], entities: [publicEntity(entity, value)], items: [{ label: 'Fundación', meta: value }], evidence: [{ key: `brotherhood-foundation-${entity.id}`, label: 'Fundación publicada', detail: value }], references, referencesNote: referenceNote, followUps: [`¿Dónde tiene su sede ${entity.name}?`, `¿Qué tipo de hermandad es ${entity.name}?`], context: contextFor(entity) })
    }
    if (intent.kind === 'brotherhood_type') {
      const values = (row.brotherhood_types || []).filter(Boolean)
      if (!values.length) return notDocumented(`Los tipos de ${entity.name} todavía no están documentados.`, contextFor(entity))
      return answer({ text: `${entity.name} está clasificada como ${values.join(', ')}.`, path: ['Hermandad', 'Tipos'], entities: [publicEntity(entity, values.join(' · '))], items: values.map((value) => ({ label: value, meta: 'Tipo de hermandad' })), evidence: [{ key: `brotherhood-types-${entity.id}`, label: 'Tipos publicados', detail: values.join(', ') }], references, referencesNote: referenceNote, followUps: [`¿Qué día procesiona ${entity.name}?`], context: contextFor(entity) })
    }
    if (intent.kind === 'brotherhood_day') {
      const value = String(row.current_procession_day || '').trim()
      if (!value) return notDocumented(`La jornada procesional actual de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `${entity.name} tiene como jornada procesional actual: ${value}.`, path: ['Hermandad', 'Jornada procesional'], entities: [publicEntity(entity, value)], items: [{ label: 'Jornada', meta: value }], evidence: [{ key: `brotherhood-day-${entity.id}`, label: 'Jornada publicada', detail: value }], references, referencesNote: referenceNote, followUps: [`¿Qué pasos tiene ${entity.name}?`, `¿Qué bandas acompañan a ${entity.name}?`], context: contextFor(entity) })
    }
    if (intent.kind === 'headquarters') {
      const place = await placeById(supabase, row.canonical_see_place_id)
      const value = [place?.name, place?.address, row.neighborhood].filter(Boolean).join(' · ')
      if (!value) return notDocumented(`La sede de ${entity.name} todavía no está documentada de forma estructurada.`, contextFor(entity))
      return answer({ text: `La sede documentada de ${entity.name} es ${place?.name || value}${row.neighborhood ? `, en ${row.neighborhood}` : ''}.`, path: ['Hermandad', 'Sede'], entities: [publicEntity(entity, value)], items: [{ label: place?.name || 'Sede', meta: [place?.address, row.neighborhood].filter(Boolean).join(' · ') }], evidence: [{ key: `brotherhood-see-${entity.id}`, label: 'Sede publicada', detail: value }], references, referencesNote: referenceNote, followUps: [`¿De qué localidad es ${entity.name}?`], context: contextFor(entity) })
    }
    if (intent.kind === 'location') {
      const municipality = await municipalityById(supabase, row.municipality_id)
      if (!municipality?.name) return notDocumented(`La localidad de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `${entity.name} está documentada en ${municipality.name}.`, path: ['Hermandad', 'Localidad'], entities: [publicEntity(entity, municipality.name)], items: [{ label: municipality.name, meta: 'Localidad' }], evidence: [{ key: `brotherhood-location-${entity.id}`, label: 'Localidad publicada', detail: municipality.name }], references, referencesNote: referenceNote, context: contextFor(entity) })
    }
  }

  if (entity.entity_type === 'band') {
    const result = await supabase
      .from('bands')
      .select('foundation_text, municipality_id, headquarters_text, band_type')
      .eq('entity_id', entity.id)
      .maybeSingle()
    if (result.error) throw result.error
    const row = result.data || {}

    if (intent.kind === 'foundation' || intent.kind === 'entity_date') {
      const value = String(row.foundation_text || '').trim()
      if (!value) return notDocumented(`La fundación de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `${entity.name} tiene documentada su fundación en ${value}.`, path: ['Banda', 'Fundación'], entities: [publicEntity(entity, value)], items: [{ label: 'Fundación', meta: value }], evidence: [{ key: `band-foundation-${entity.id}`, label: 'Fundación publicada', detail: value }], references, referencesNote: referenceNote, followUps: [`¿De qué localidad es ${entity.name}?`, `¿A qué hermandades acompaña ${entity.name}?`], context: contextFor(entity) })
    }
    if (intent.kind === 'band_type') {
      const value = String(row.band_type || '').trim()
      if (!value) return notDocumented(`El tipo de formación de ${entity.name} todavía no está documentado.`, contextFor(entity))
      return answer({ text: `${entity.name} está clasificada como ${value}.`, path: ['Banda', 'Tipo de formación'], entities: [publicEntity(entity, value)], items: [{ label: 'Tipo de formación', meta: value }], evidence: [{ key: `band-type-${entity.id}`, label: 'Tipo publicado', detail: value }], references, referencesNote: referenceNote, context: contextFor(entity) })
    }
    if (intent.kind === 'headquarters') {
      const value = String(row.headquarters_text || '').trim()
      if (!value) return notDocumented(`La sede de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `La sede documentada de ${entity.name} es ${value}.`, path: ['Banda', 'Sede'], entities: [publicEntity(entity, value)], items: [{ label: 'Sede', meta: value }], evidence: [{ key: `band-hq-${entity.id}`, label: 'Sede publicada', detail: value }], references, referencesNote: referenceNote, context: contextFor(entity) })
    }
    if (intent.kind === 'location') {
      const municipality = await municipalityById(supabase, row.municipality_id)
      if (!municipality?.name) return notDocumented(`La localidad de ${entity.name} todavía no está documentada.`, contextFor(entity))
      return answer({ text: `${entity.name} es una formación de ${municipality.name}.`, path: ['Banda', 'Localidad'], entities: [publicEntity(entity, municipality.name)], items: [{ label: municipality.name, meta: 'Localidad' }], evidence: [{ key: `band-location-${entity.id}`, label: 'Localidad publicada', detail: municipality.name }], references, referencesNote: referenceNote, followUps: [`¿Cuándo se fundó ${entity.name}?`], context: contextFor(entity) })
    }
  }

  if (entity.entity_type === 'image') {
    const result = await supabase
      .from('images')
      .select('image_type, execution_date, execution_date_text, material, technique, dimensions_text, height_cm, width_cm, depth_cm, iconography')
      .eq('entity_id', entity.id)
      .maybeSingle()
    if (result.error) throw result.error
    const row = result.data || {}
    const values = {
      entity_date: String(row.execution_date_text || row.execution_date || '').trim(),
      image_type: String(row.image_type || '').trim(),
      material: String(row.material || '').trim(),
      image_technique: String(row.technique || '').trim(),
      dimensions: dimensionsLabel(row, 'image'),
      image_iconography: String(row.iconography || '').trim(),
    }
    const labels = { entity_date: 'Datación', image_type: 'Tipología', material: 'Material', image_technique: 'Técnica', dimensions: 'Dimensiones', image_iconography: 'Iconografía' }
    const value = values[intent.kind]
    if (value !== undefined) {
      if (!value) return notDocumented(`${labels[intent.kind]} de ${entity.name} todavía no está documentada de forma estructurada.`, contextFor(entity))
      return answer({ text: `${labels[intent.kind]} de ${entity.name}: ${value}.`, path: ['Imagen', labels[intent.kind]], entities: [publicEntity(entity, value)], items: [{ label: labels[intent.kind], meta: value }], evidence: [{ key: `image-${intent.kind}-${entity.id}`, label: `${labels[intent.kind]} publicada`, detail: value }], references, referencesNote: referenceNote, followUps: [`¿Quién hizo ${entity.name}?`, `¿Ha sido restaurada ${entity.name}?`], context: contextFor(entity) })
    }
  }

  if (entity.entity_type === 'step') {
    const result = await supabase
      .from('steps')
      .select('step_type, style, materials, dimensions_text, length_cm, width_cm, height_cm, workbenches_count, carrier_system, execution_date_text')
      .eq('entity_id', entity.id)
      .maybeSingle()
    if (result.error) throw result.error
    const row = result.data || {}
    const values = {
      entity_date: String(row.execution_date_text || '').trim(),
      step_type: String(row.step_type || '').trim(),
      step_style: String(row.style || '').trim(),
      material: String(row.materials || '').trim(),
      dimensions: dimensionsLabel(row, 'step'),
      step_workbenches: row.workbenches_count == null ? '' : `${row.workbenches_count}`,
      step_carrier: String(row.carrier_system || '').trim(),
    }
    const labels = { entity_date: 'Datación', step_type: 'Tipo de paso', step_style: 'Estilo', material: 'Materiales', dimensions: 'Dimensiones', step_workbenches: 'Trabajaderas', step_carrier: 'Sistema de porteo' }
    const value = values[intent.kind]
    if (value !== undefined) {
      if (!value) return notDocumented(`${labels[intent.kind]} de ${entity.name} todavía no está documentado de forma estructurada.`, contextFor(entity))
      const display = intent.kind === 'step_workbenches' ? `${value} trabajaderas` : value
      return answer({ text: `${labels[intent.kind]} de ${entity.name}: ${display}.`, path: ['Paso', labels[intent.kind]], entities: [publicEntity(entity, display)], items: [{ label: labels[intent.kind], meta: display }], evidence: [{ key: `step-${intent.kind}-${entity.id}`, label: `${labels[intent.kind]} publicado`, detail: display }], references, referencesNote: referenceNote, followUps: [`¿Quién lleva ${entity.name}?`, `¿Qué banda acompaña ${entity.name}?`], context: contextFor(entity) })
    }
  }

  return null
}

function commonValues(rows, field) {
  const values = rows.map((row) => String(row?.[field] ?? '').trim()).filter(Boolean)
  if (values.length !== rows.length) return ''
  const normalized = new Set(values.map((value) => normalizeFreeFactText(value)))
  return normalized.size === 1 ? values[0] : ''
}

function intersectionArrays(rows, field) {
  if (!rows.length || rows.some((row) => !Array.isArray(row?.[field]) || !row[field].length)) return []
  const first = rows[0][field]
  return first.filter((value) => rows.every((row) => row[field].some((candidate) => normalizeFreeFactText(candidate) === normalizeFreeFactText(value))))
}

async function commonFactsForSet(supabase, context, entityType) {
  const ids = [...new Set(context?.resultSet?.entityIds || [])].slice(0, 12)
  if (ids.length < 2) return null
  const entities = await entitiesByIds(supabase, ids)
  const typed = entities.filter((entity) => entity.entity_type === entityType)
  if (typed.length < 2) return null
  const facts = []

  if (entityType === 'image') {
    const result = await supabase.from('images').select('entity_id, image_type, material, technique, anatomical_type, is_dress_image').in('entity_id', ids)
    if (result.error) throw result.error
    const rows = result.data || []
    ;[['image_type', 'Tipología'], ['material', 'Material'], ['technique', 'Técnica'], ['anatomical_type', 'Tipo anatómico']].forEach(([field, label]) => {
      const value = commonValues(rows, field)
      if (value) facts.push({ label, value })
    })
    if (rows.length === typed.length && rows.every((row) => row.is_dress_image === true)) facts.push({ label: 'Uso', value: 'Todas son imágenes de vestir' })
  }

  if (entityType === 'step') {
    const result = await supabase.from('steps').select('entity_id, step_type, style, materials, carrier_system').in('entity_id', ids)
    if (result.error) throw result.error
    const rows = result.data || []
    ;[['step_type', 'Tipo de paso'], ['style', 'Estilo'], ['materials', 'Materiales'], ['carrier_system', 'Sistema de porteo']].forEach(([field, label]) => {
      const value = commonValues(rows, field)
      if (value) facts.push({ label, value })
    })
  }

  if (entityType === 'band') {
    const result = await supabase.from('bands').select('entity_id, band_type, municipality_id').in('entity_id', ids)
    if (result.error) throw result.error
    const rows = result.data || []
    const type = commonValues(rows, 'band_type')
    if (type) facts.push({ label: 'Tipo de formación', value: type })
    const municipalityId = commonValues(rows, 'municipality_id')
    if (municipalityId) {
      const municipality = await municipalityById(supabase, municipalityId)
      if (municipality?.name) facts.push({ label: 'Localidad', value: municipality.name })
    }
  }

  if (entityType === 'brotherhood') {
    const result = await supabase.from('brotherhoods').select('entity_id, brotherhood_types, municipality_id, current_procession_day').in('entity_id', ids)
    if (result.error) throw result.error
    const rows = result.data || []
    const types = intersectionArrays(rows, 'brotherhood_types')
    if (types.length) facts.push({ label: 'Tipos compartidos', value: types.join(', ') })
    const municipalityId = commonValues(rows, 'municipality_id')
    if (municipalityId) {
      const municipality = await municipalityById(supabase, municipalityId)
      if (municipality?.name) facts.push({ label: 'Localidad', value: municipality.name })
    }
    const day = commonValues(rows, 'current_procession_day')
    if (day) facts.push({ label: 'Jornada procesional', value: day })
  }

  if (entityType === 'march') {
    const result = await supabase.from('marches').select('entity_id, music_type').in('entity_id', ids)
    if (result.error) throw result.error
    const rows = result.data || []
    const type = commonValues(rows, 'music_type')
    if (type) facts.push({ label: 'Tipo musical', value: type })

    const authors = await supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').in('march_entity_id', ids).eq('author_role', 'composer').eq('status', 'published')
    if (authors.error) throw authors.error
    const byMarch = new Map(ids.map((id) => [id, new Set()]))
    ;(authors.data || []).forEach((row) => byMarch.get(row.march_entity_id)?.add(row.agent_entity_id))
    const first = [...(byMarch.get(ids[0]) || [])]
    const shared = first.filter((agentId) => ids.every((id) => byMarch.get(id)?.has(agentId)))
    if (shared.length) {
      const agents = await entitiesByIds(supabase, shared)
      if (agents.length) facts.push({ label: 'Compositor compartido', value: agents.map((agent) => agent.name).join(', ') })
    }
  }

  if (entityType === 'agent') {
    const result = await supabase.from('agent_disciplines').select('agent_entity_id, discipline').in('agent_entity_id', ids)
    if (result.error) throw result.error
    const byAgent = new Map(ids.map((id) => [id, new Set()]))
    ;(result.data || []).forEach((row) => { if (row.discipline) byAgent.get(row.agent_entity_id)?.add(row.discipline) })
    const first = [...(byAgent.get(ids[0]) || [])]
    const shared = first.filter((discipline) => ids.every((id) => [...(byAgent.get(id) || [])].some((candidate) => normalizeFreeFactText(candidate) === normalizeFreeFactText(discipline))))
    if (shared.length) facts.push({ label: 'Disciplinas compartidas', value: shared.join(', ') })
  }

  const setLabel = context?.resultSet?.label || `${typed.length} ${TYPE_LABELS[entityType]?.toLowerCase() || 'entidades'}`
  const setContext = {
    ...context,
    resultSet: {
      ...context.resultSet,
      entityIds: typed.map((entity) => entity.id),
      count: typed.length,
    },
  }

  if (!facts.length) {
    return answer({
      text: `No encuentro un valor estructurado idéntico y documentado en todas las entidades del conjunto ${setLabel}. Eso no significa que no compartan rasgos históricos; solo que no hay una coincidencia homogénea suficiente en los campos comparables actuales.`,
      path: ['Contexto anterior', 'Campos comparables', 'Coincidencias'],
      items: typed.map((entity) => ({ label: entity.name, meta: TYPE_LABELS[entityType] || 'Entidad', href: entityHref(entity) })),
      followUps: ['Compáralas.', 'Ordénalas de más antigua a más reciente.'],
      context: setContext,
    })
  }

  return answer({
    text: `Dentro del conjunto anterior he encontrado ${facts.length} ${facts.length === 1 ? 'coincidencia estructurada' : 'coincidencias estructuradas'} compartidas por todas las entidades.`,
    path: ['Contexto anterior', 'Campos comparables', 'Coincidencias'],
    items: facts.map((fact) => ({ label: fact.label, meta: fact.value })),
    evidence: facts.map((fact, index) => ({ key: `set-common-${entityType}-${index}`, label: fact.label, detail: fact.value })),
    followUps: ['Compáralas.', 'Ordénalas de más antigua a más reciente.'],
    context: setContext,
  })
}

export async function askHiloCofradeFreeFacts(question, context = null) {
  const intent = freeFactIntent(question, context?.entityType || '')
  if (!intent) return null
  const supabase = await createClient()
  try {
    const entity = await resolveEntity(supabase, question, intent.entityTypes, context)
    if (!entity) return null
    if (intent.kind === 'march_listen') return await marchListening(supabase, entity)
    return await entityFact(supabase, entity, intent)
  } catch (error) {
    console.error('[Hilo Cofrade] Error en hechos gratuitos estructurados', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

export async function askHiloCofradeFreeSet(question, context = null) {
  const entityType = context?.resultSet?.entityType || ''
  const intent = freeSetIntent(question, entityType)
  if (!intent) return null
  const supabase = await createClient()
  try {
    if (intent.kind === 'set_common') return await commonFactsForSet(supabase, context, entityType)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en razonamiento gratuito de conjuntos', {
      question: String(question || '').slice(0, 320),
      entityType,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
