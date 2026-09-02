import { getHermandadBySlug, getImagenBySlug, getPasoBySlug, hermandades } from '@/lib/data'
import { applyBrotherhoodAuthority } from '@/lib/supabase/brotherhood-authority'
import { orderProcessionalItems } from '@/lib/brotherhood-processional-order'
import { createPublicClient as createClient } from '@/lib/supabase/public'

const EMPTY_COLLECTIONS = {
  imagenes: [],
  pasos: [],
  participacionesConsejo: [],
  cronologia: [],
  habitos: [],
  salidas: [],
  cultos: [],
  cartelesFiestas: [],
  patrimonio: [],
  estrenos: [],
  patrimonioMusical: [],
  acompanamientoActual: [],
  acompanamientos: [],
  noticias: [],
  curiosidades: [],
  fuentesFicha: [],
}

function assertQuery(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }

  return result.data
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

const COLOR_NAME_FALLBACKS = {
  blanco: '#FFFFFF',
  celeste: '#66B8D4',
}

const MONTH_ABBREVIATIONS = {
  enero: 'ENE',
  febrero: 'FEB',
  marzo: 'MAR',
  abril: 'ABR',
  mayo: 'MAY',
  junio: 'JUN',
  julio: 'JUL',
  agosto: 'AGO',
  septiembre: 'SEP',
  octubre: 'OCT',
  noviembre: 'NOV',
  diciembre: 'DIC',
}

const LOCAL_CREST_PATHS = {
  'el-baratillo': '/escudos/el-baratillo.svg',
  'asuncion-de-cantillana': '/escudos/asuncion-de-cantillana.png',
}

const DIRECTORY_FALLBACKS = [
  ...hermandades,
  {
    id: 'H0002',
    slug: 'asuncion-de-cantillana',
    nombrePopular: 'La Asunción de Cantillana',
    nombreOficial: 'Antigua, Fervorosa y Real Hermandad de Nuestra Señora de la Asunción y Santísimo Rosario',
    localidad: 'Cantillana',
    provincia: 'Sevilla',
    sede: 'Iglesia Parroquial de Nuestra Señora de la Asunción',
    barrio: '',
    diaSalida: '15 de agosto',
    tipos: ['Gloria'],
    escudoPath: '/escudos/asuncion-de-cantillana.png',
    resumen: 'Hermandad de Gloria de Cantillana con sede en la parroquia de Nuestra Señora de la Asunción.',
  },
]

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const UNDOCUMENTED_PUBLIC_VALUE = /(?:pendiente|por confirmar|por anunciar|sin documentar|no documentad[oa]|por incorporar)/i

function documentedPublicText(value = '') {
  const text = String(value || '').trim()
  return text && !UNDOCUMENTED_PUBLIC_VALUE.test(text) ? text : ''
}

function youtubeVideoId(value = '') {
  const match = String(value).match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[&#?].*)?$/)
  return match?.[1] || ''
}

function colorValue(color) {
  return color?.hex_value || COLOR_NAME_FALLBACKS[normalized(color?.color_name)] || null
}

function darkenHex(hex, amount = 0.52) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#174F67'

  const channels = [1, 3, 5].map((position) => (
    Math.round(Number.parseInt(hex.slice(position, position + 2), 16) * amount)
      .toString(16)
      .padStart(2, '0')
  ))

  return `#${channels.join('')}`
}

function contrastText(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#FFFFFF'

  const [red, green, blue] = [1, 3, 5].map((position) => (
    Number.parseInt(hex.slice(position, position + 2), 16)
  ))
  const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000

  return brightness > 155 ? '#153B50' : '#FFFFFF'
}

function colorTheme(colors = [], fallback = {}) {
  if (!colors.length) return fallback

  const primaryRow = colors.find((color) => color.color_role === 'primary') || colors[0]
  const whiteRow = colors.find((color) => (
    normalized(color.color_name) === 'blanco' || color.hex_value?.toUpperCase() === '#FFFFFF'
  ))
  const accentRow = colors.find((color) => (
    color.color_role !== 'primary' && normalized(color.color_name) !== 'blanco'
  ))
  const primary = colorValue(primaryRow) || fallback.primario || '#153B69'
  const accent = colorValue(accentRow) || primary

  return {
    primario: primary,
    secundario: accent,
    claro: colorValue(whiteRow) || fallback.claro || '#FFFFFF',
    oscuro: darkenHex(primary),
    sobreSecundario: contrastText(accent),
    nombres: colors.map((color) => color.color_name).filter(Boolean),
  }
}

function displayDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function displayTime(value) {
  const match = /^(\d{2}):(\d{2})/.exec(String(value || ''))
  return match ? `${match[1]}:${match[2]} h` : ''
}

function cultDate(cult) {
  const exactDate = /^(\d{1,2}) de ([a-záéíóúñ]+)$/i.exec(cult.date_rule || '')

  if (exactDate) {
    return {
      fechaCorta: `${exactDate[1]} ${MONTH_ABBREVIATIONS[normalized(exactDate[2])] || exactDate[2]}`,
      fechaDetalle: '',
    }
  }

  const monthName = Object.keys(MONTH_ABBREVIATIONS)[(cult.month || 1) - 1]
  return {
    fechaCorta: (cult.recurrence_label || monthName || 'Fecha anual').toUpperCase(),
    fechaDetalle: cult.date_rule || '',
  }
}

function yearFrom(value = '') {
  return Number.parseInt(String(value).match(/\d{4}/)?.[0] || '0', 10)
}

function displayOrdinalPosition(position, total) {
  if (!position) return ''
  return total ? `${position}.ª de ${total}` : `${position}.ª`
}

function displayMinutes(totalMinutes) {
  if (!Number.isFinite(totalMinutes)) return ''

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (!hours) return `${minutes} min`
  if (!minutes) return `${hours} h`
  return `${hours} h ${String(minutes).padStart(2, '0')} min`
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function mergeBySlug(localItems = [], remoteItems = []) {
  const remoteBySlug = new Map(remoteItems.map((item) => [item.slug, item]))
  const merged = localItems.map((localItem) => {
    const remoteItem = remoteBySlug.get(localItem.slug) || {}
    const documentedRemoteValues = Object.fromEntries(
      Object.entries(remoteItem).filter(([, value]) => (
        value !== null && value !== undefined && value !== ''
      ))
    )

    return { ...localItem, ...documentedRemoteValues }
  })
  const localSlugs = new Set(localItems.map((item) => item.slug))

  return [
    ...merged,
    ...remoteItems.filter((item) => !localSlugs.has(item.slug)),
  ]
}

async function loadEntities(supabase, ids, label) {
  if (!ids.length) return []

  return assertQuery(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status')
      .in('id', ids)
      .eq('status', 'published'),
    label
  )
}

async function loadBrotherhoodFromSupabase(slug) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status')
      .eq('entity_type', 'brotherhood')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    'No se pudo consultar la hermandad'
  )

  if (!entity) return null

  const [
    brotherhoodResult,
    imageLinksResult,
    stepLinksResult,
    colorsResult,
    habitsResult,
    heritageAssetsResult,
    heritageUpdatesResult,
    cultsResult,
    outingsResult,
    outingSeriesResult,
    socialLinksResult,
    musicPeriodsResult,
    processionStatsResult,
  ] = await Promise.all([
    supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, neighborhood, website_url, instagram_url, crest_path, brotherhood_types, current_procession_day, notes')
      .eq('entity_id', entity.id)
      .maybeSingle(),
    supabase
      .from('brotherhood_images')
      .select('image_entity_id, relation_type, date_from_text, date_to_text')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_steps')
      .select('step_entity_id, relation_type, date_from_text, date_to_text')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('brotherhood_colors')
      .select('id, color_name, hex_value, color_role, sort_order, notes')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('sort_order'),
    supabase
      .from('brotherhood_habits')
      .select('id, name, tunic_description, hood_description, cord_description, buttons_description, shield_description, footwear_description, image_path, image_alt, sort_order')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('sort_order'),
    supabase
      .from('heritage_assets')
      .select('entity_id, parent_entity_id, asset_type, description, current_condition, notes, date_from, date_from_text, date_to, date_to_text, is_current, origin_notes, technique, materials, dimensions_text, iconography, historical_context, provenance_text, blessing_date, blessing_date_text, display_order, is_featured')
      .eq('parent_entity_id', entity.id)
      .order('display_order'),
    supabase
      .from('heritage_updates')
      .select('id, update_type, title, update_date, year, target_entity_id, element_name, discipline, description')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('year', { ascending: false }),
    supabase
      .from('cults')
      .select('id, image_entity_id, cult_type, title, cult_date, date_rule, month, time_text, place_id, description, is_recurring, recurrence_label, display_order')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('display_order'),
    supabase
      .from('outings')
      .select('id, outing_type, character, title, outing_date, return_date, year, departure_time, return_time, municipality_id, origin_place_id, destination_place_id, reason, route, route_summary, description, public_notes, event_status')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('outing_date', { ascending: false }),
    supabase
      .from('outing_series')
      .select('id, outing_type, character, title, month, date_rule, time_text, municipality_id, origin_place_id, destination_place_id, route_summary, description, display_order')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('display_order'),
    supabase
      .from('entity_social_links')
      .select('id, platform, url, label, display_order')
      .eq('entity_id', entity.id)
      .eq('is_public', true)
      .order('display_order'),
    supabase
      .from('music_accompaniment_periods')
      .select('id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, notes')
      .eq('brotherhood_entity_id', entity.id)
      .eq('is_current', true)
      .eq('status', 'published')
      .order('position'),
    supabase
      .from('brotherhood_procession_stats')
      .select('id, year, total_nazarenos_count, total_procession_count, position_by_nazarenos, position_by_procession, brotherhoods_in_day, official_career_duration_minutes, source_id')
      .eq('brotherhood_entity_id', entity.id)
      .eq('status', 'published')
      .order('year', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const brotherhood = assertQuery(brotherhoodResult, 'No se pudieron consultar los datos de la hermandad')
  if (!brotherhood) return null

  const imageLinks = assertQuery(imageLinksResult, 'No se pudieron consultar los titulares')
  const stepLinks = assertQuery(stepLinksResult, 'No se pudieron consultar los pasos')
  const colors = assertQuery(colorsResult, 'No se pudieron consultar los colores corporativos')
  const habitRows = assertQuery(habitsResult, 'No se pudo consultar la indumentaria nazarena')
  const heritageAssets = assertQuery(heritageAssetsResult, 'No se pudieron consultar las piezas patrimoniales')
  const heritageUpdates = assertQuery(heritageUpdatesResult, 'No se pudieron consultar las novedades patrimoniales')
  const cultRows = assertQuery(cultsResult, 'No se pudieron consultar los cultos')
  const outingRows = assertQuery(outingsResult, 'No se pudieron consultar las salidas')
  const outingSeriesTableMissing = ['PGRST205', '42P01'].includes(outingSeriesResult.error?.code);
  const outingSeriesRows = outingSeriesTableMissing
    ? []
    : assertQuery(outingSeriesResult, 'No se pudieron consultar las salidas recurrentes')
  const socialLinksTableMissing = ['PGRST205', '42P01'].includes(socialLinksResult.error?.code)
  const socialLinks = socialLinksTableMissing
    ? []
    : assertQuery(socialLinksResult, 'No se pudieron consultar los enlaces oficiales')
  const musicPeriods = assertQuery(musicPeriodsResult, 'No se pudo consultar el acompañamiento musical')
  const processionStatsTableMissing = ['PGRST205', '42P01'].includes(processionStatsResult.error?.code)
  const processionStats = processionStatsTableMissing
    ? null
    : assertQuery(processionStatsResult, 'No se pudieron consultar los datos de la jornada')
  const outingSeriesMovementRows = outingSeriesRows.length
    ? assertQuery(
        await supabase
          .from('outing_series_movements')
          .select('id, outing_series_id, sequence_no, direction, date_rule, time_text, origin_place_id, destination_place_id, route_summary, description')
          .in('outing_series_id', outingSeriesRows.map((item) => item.id))
          .order('sequence_no'),
        'No se pudieron consultar los movimientos de las salidas recurrentes'
      )
    : []
  const [outingEntitiesResult, outingMediaResult] = outingRows.length
    ? await Promise.all([
        supabase
          .from('outing_entities')
          .select('outing_id, entity_id, role')
          .in('outing_id', outingRows.map((item) => item.id))
          .eq('role', 'processional_image'),
        supabase
          .from('outing_media')
          .select('outing_id, role, sort_order, media_assets(id, storage_path, media_type, title, alt_text, author_name, source_url)')
          .in('outing_id', outingRows.map((item) => item.id))
          .order('sort_order'),
      ])
    : [{ data: [], error: null }, { data: [], error: null }]
  const outingEntityLinks = assertQuery(outingEntitiesResult, 'No se pudieron consultar las imágenes que participan en las salidas')
  const outingMediaRows = assertQuery(outingMediaResult, 'No se pudo consultar la multimedia de las salidas')
  const imageIds = unique(imageLinks.map((item) => item.image_entity_id))
  const stepIds = unique(stepLinks.map((item) => item.step_entity_id))
  const heritageAssetIds = unique(heritageAssets.map((item) => item.entity_id))
  const heritageUpdateIds = heritageUpdates.map((item) => item.id)
  const heritageUpdateTargetIds = unique(heritageUpdates.map((item) => item.target_entity_id))
  const musicPeriodIds = musicPeriods.map((item) => item.id)
  const musicBandIds = unique(musicPeriods.map((item) => item.band_entity_id))

  const [
    imageEntities,
    imageRowsResult,
    stepEntities,
    stepRowsResult,
    imageStepLinksResult,
    authorLinksResult,
    eventLinksResult,
    municipalityResult,
    placeResult,
    heritageUpdateAgentsResult,
    stepPersonnelResult,
    stepPhasesResult,
    heritageAssetEntities,
    heritageInterventionsResult,
    heritageMediaResult,
    heritageUpdateTargetsResult,
    musicBandEntities,
    musicBandRowsResult,
  ] = await Promise.all([
    loadEntities(supabase, imageIds, 'No se pudieron consultar las entidades de imagen'),
    imageIds.length
      ? supabase
          .from('images')
          .select('entity_id, image_type, execution_date, execution_date_text, material, technique, dimensions_text, iconography, anatomical_type, is_dress_image, current_condition, current_state_notes, description, notes')
          .in('entity_id', imageIds)
      : Promise.resolve({ data: [], error: null }),
    loadEntities(supabase, stepIds, 'No se pudieron consultar las entidades de paso'),
    stepIds.length
      ? supabase
          .from('steps')
          .select('entity_id, step_type, style, materials, dimensions_text, carrier_system, execution_date_text, current_condition, current_state_notes, description, notes')
          .in('entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('image_steps')
          .select('image_entity_id, step_entity_id, relation_type')
          .in('step_entity_id', stepIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    imageIds.length
      ? supabase
          .from('entity_relations')
          .select('source_entity_id, target_entity_id, relation_type')
          .in('target_entity_id', imageIds)
          .eq('relation_type', 'author_of')
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('entity_relations')
      .select('source_entity_id, target_entity_id, relation_type')
      .in('target_entity_id', [entity.id, ...imageIds])
      .eq('relation_type', 'involves')
      .eq('status', 'published'),
    brotherhood.municipality_id
      ? supabase
          .from('municipalities')
          .select('id, name, slug, province')
          .eq('id', brotherhood.municipality_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    brotherhood.canonical_see_place_id
      ? supabase
          .from('places')
          .select('id, name, slug, place_type, address')
          .eq('id', brotherhood.canonical_see_place_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    heritageUpdateIds.length
      ? supabase
          .from('heritage_update_agents')
          .select('heritage_update_id, agent_entity_id, role_name, discipline, notes')
          .in('heritage_update_id', heritageUpdateIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('current_step_personnel')
          .select('step_entity_id, agent_entity_id, agent_name, role_name')
          .in('step_entity_id', stepIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('step_phases')
          .select('id, step_entity_id, phase_name, phase_type, date_from, date_from_text, date_to, date_to_text, description, notes')
          .in('step_entity_id', stepIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    loadEntities(supabase, heritageAssetIds, 'No se pudieron consultar las entidades patrimoniales'),
    heritageAssetIds.length
      ? supabase
          .from('heritage_interventions')
          .select('id, target_entity_id, agent_entity_id, discipline, element_name, intervention_type, phase, date_from, date_from_text, date_to, date_to_text, description')
          .in('target_entity_id', heritageAssetIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    heritageAssetIds.length
      ? supabase
          .from('entity_media')
          .select('entity_id, relation_type, sort_order, is_cover, media_assets(id, storage_path, title, caption, alt_text, author_name, rights_status)')
          .in('entity_id', heritageAssetIds)
          .order('sort_order')
      : Promise.resolve({ data: [], error: null }),
    heritageUpdateTargetIds.length
      ? supabase
          .from('heritage_assets')
          .select('entity_id, public_image_path, public_image_alt, public_image_credit')
          .in('entity_id', heritageUpdateTargetIds)
      : Promise.resolve({ data: [], error: null }),
    loadEntities(supabase, musicBandIds, 'No se pudieron consultar las bandas del acompañamiento'),
    musicBandIds.length
      ? supabase
          .from('bands')
          .select('entity_id, band_type')
          .in('entity_id', musicBandIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const imageRows = assertQuery(imageRowsResult, 'No se pudieron consultar los datos de las imágenes')
  const stepRows = assertQuery(stepRowsResult, 'No se pudieron consultar los datos de los pasos')
  const imageStepLinks = assertQuery(imageStepLinksResult, 'No se pudieron consultar las imágenes de los pasos')
  const authorLinks = assertQuery(authorLinksResult, 'No se pudieron consultar las autorías')
  const eventLinks = assertQuery(eventLinksResult, 'No se pudieron consultar los acontecimientos')
  const municipality = assertQuery(municipalityResult, 'No se pudo consultar la localidad')
  const place = assertQuery(placeResult, 'No se pudo consultar la sede canónica')
  const heritageUpdateAgents = assertQuery(heritageUpdateAgentsResult, 'No se pudieron consultar los agentes patrimoniales')
  const stepPersonnel = assertQuery(stepPersonnelResult, 'No se pudo consultar el personal actual de los pasos')
  const stepPhases = assertQuery(stepPhasesResult, 'No se pudieron consultar las fases de los pasos')
  const heritageInterventions = assertQuery(heritageInterventionsResult, 'No se pudieron consultar las autorías de las piezas patrimoniales')
  const heritageMedia = assertQuery(heritageMediaResult, 'No se pudo consultar el archivo visual patrimonial')
  const heritageUpdateTargets = assertQuery(heritageUpdateTargetsResult, 'No se pudo consultar la imagen de las novedades patrimoniales')
  const musicBandRows = assertQuery(musicBandRowsResult, 'No se pudieron consultar las fichas de las bandas')
  const stepPhaseIds = stepPhases.map((item) => item.id)
  const heritageInterventionIds = heritageInterventions.map((item) => item.id)

  const stepPhaseAgents = stepPhaseIds.length
    ? assertQuery(
        await supabase
          .from('step_phase_agents')
          .select('step_phase_id, agent_entity_id, discipline, role_name, notes')
          .in('step_phase_id', stepPhaseIds),
        'No se pudieron consultar los agentes de las fases de los pasos'
      )
    : []

  const authorIds = unique(authorLinks.map((item) => item.source_entity_id))
  const eventIds = unique(eventLinks.map((item) => item.source_entity_id))
  const agentIds = unique([
    ...authorIds,
    ...heritageUpdateAgents.map((item) => item.agent_entity_id),
    ...heritageInterventions.map((item) => item.agent_entity_id),
    ...stepPhaseAgents.map((item) => item.agent_entity_id),
  ])
  const [agentEntities, eventEntities, eventRowsResult] = await Promise.all([
    loadEntities(supabase, agentIds, 'No se pudieron consultar los agentes'),
    loadEntities(supabase, eventIds, 'No se pudieron consultar los acontecimientos'),
    eventIds.length
      ? supabase
          .from('events')
          .select('entity_id, event_type, event_date, event_date_text, description')
          .in('entity_id', eventIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  const eventRows = assertQuery(eventRowsResult, 'No se pudieron consultar los datos de los acontecimientos')

  const sourceTargetIds = unique([entity.id, ...imageIds, ...stepIds, ...heritageAssetIds, ...eventIds, ...agentIds])
  const sourceLinkResults = await Promise.all([
    sourceTargetIds.length
      ? supabase.from('source_links').select('source_id').in('entity_id', sourceTargetIds)
      : Promise.resolve({ data: [], error: null }),
    heritageUpdateIds.length
      ? supabase.from('source_links').select('source_id').in('heritage_update_id', heritageUpdateIds)
      : Promise.resolve({ data: [], error: null }),
    heritageInterventionIds.length
      ? supabase.from('source_links').select('source_id').in('intervention_id', heritageInterventionIds)
      : Promise.resolve({ data: [], error: null }),
    stepPhaseIds.length
      ? supabase.from('source_links').select('source_id').in('step_phase_id', stepPhaseIds)
      : Promise.resolve({ data: [], error: null }),
    cultRows.length
      ? supabase.from('source_links').select('source_id').in('cult_id', cultRows.map((item) => item.id))
      : Promise.resolve({ data: [], error: null }),
    outingRows.length
      ? supabase.from('source_links').select('source_id').in('outing_id', outingRows.map((item) => item.id))
      : Promise.resolve({ data: [], error: null }),
    outingSeriesRows.length
      ? supabase.from('source_links').select('source_id').in('outing_series_id', outingSeriesRows.map((item) => item.id))
      : Promise.resolve({ data: [], error: null }),
    musicPeriodIds.length
      ? supabase.from('source_links').select('source_id').in('music_accompaniment_period_id', musicPeriodIds)
      : Promise.resolve({ data: [], error: null }),
  ])
  const sourceLinks = sourceLinkResults.flatMap((result) => (
    assertQuery(result, 'No se pudieron consultar los enlaces de fuentes')
  ))
  const sourceIds = unique([
    ...sourceLinks.map((item) => item.source_id),
    processionStats?.source_id,
  ])
  const sources = sourceIds.length
    ? assertQuery(
        await supabase
          .from('sources')
          .select('id, name, url, source_type, author_or_publisher, publication_date, accessed_at')
          .in('id', sourceIds)
          .order('name'),
        'No se pudieron consultar las fuentes'
      )
    : []

  const imageRowById = new Map(imageRows.map((item) => [item.entity_id, item]))
  const agentById = new Map(agentEntities.map((item) => [item.id, item]))
  const stepRowById = new Map(stepRows.map((item) => [item.entity_id, item]))
  const eventRowById = new Map(eventRows.map((item) => [item.entity_id, item]))
  const heritageAssetById = new Map(heritageAssets.map((item) => [item.entity_id, item]))
  const heritageUpdateTargetById = new Map(heritageUpdateTargets.map((item) => [item.entity_id, item]))
  const musicBandEntityById = new Map(musicBandEntities.map((item) => [item.id, item]))
  const musicBandById = new Map(musicBandRows.map((item) => [item.entity_id, item]))

  const acompanamientoActual = musicPeriods.map((period) => {
    const bandEntity = musicBandEntityById.get(period.band_entity_id)
    const band = musicBandById.get(period.band_entity_id) || {}

    return {
      id: period.id,
      posicion: period.position || 'Acompañamiento musical',
      banda: bandEntity?.name || '',
      bandaSlug: bandEntity?.slug || '',
      tipo: band.band_type || 'Formación musical',
      observaciones: period.notes || '',
      pasoId: period.step_entity_id || '',
      periodo: period.date_from_text || (period.year_from ? `Desde ${period.year_from}` : ''),
      salida: period.outing_type || '',
    }
  })

  const imagenes = imageEntities.map((imageEntity) => {
    const image = imageRowById.get(imageEntity.id) || {}
    const autores = authorLinks
      .filter((link) => link.target_entity_id === imageEntity.id)
      .map((link) => agentById.get(link.source_entity_id)?.name)
      .filter(Boolean)

    return {
      id: imageEntity.id,
      slug: imageEntity.slug,
      nombre: imageEntity.name,
      tipo: image.image_type || 'Imagen',
      autor: documentedPublicText(autores.join(' · ') || (/autor desconocido/i.test(image.notes || '') ? 'Autor desconocido' : '')),
      fecha: documentedPublicText(image.execution_date_text || image.execution_date),
      descripcion: image.description || imageEntity.summary || '',
      material: image.material || '',
      tecnica: image.technique || '',
      dimensiones: image.dimensions_text || '',
      iconografia: image.iconography || '',
      estadoActual: image.current_state_notes || '',
      iniciales: initials(imageEntity.name),
      procesiona: imageStepLinks.some((link) => link.image_entity_id === imageEntity.id),
    }
  })
  const imageNameById = new Map(imagenes.map((imagen) => [imagen.id, imagen.nombre]))

  const pasos = stepEntities.map((stepEntity) => {
    const step = stepRowById.get(stepEntity.id) || {}
    const fases = stepPhases
      .filter((phase) => phase.step_entity_id === stepEntity.id)
      .sort((first, second) => yearFrom(first.date_from_text || first.date_from) - yearFrom(second.date_from_text || second.date_from))
      .map((phase) => ({
        id: phase.id,
        nombre: phase.phase_name,
        tipo: phase.phase_type || 'Intervención',
        periodo: [phase.date_from_text || phase.date_from, phase.date_to_text || phase.date_to]
          .filter(Boolean)
          .join('–'),
        descripcion: phase.description || '',
        agentes: stepPhaseAgents
          .filter((link) => link.step_phase_id === phase.id)
          .map((link) => ({
            id: link.agent_entity_id,
            nombre: agentById.get(link.agent_entity_id)?.name || '',
            rol: link.role_name || link.discipline,
            disciplina: link.discipline,
          }))
          .filter((agent) => agent.nombre),
      }))

    return {
      id: stepEntity.id,
      slug: stepEntity.slug,
      nombre: stepEntity.name,
      tipo: step.step_type || 'Paso',
      descripcion: step.description || stepEntity.summary || '',
      materiales: step.materials || '',
      sistemaPortadores: step.carrier_system || '',
      ejecucion: step.execution_date_text || '',
      estadoActual: step.current_state_notes || '',
      capatazActual: stepPersonnel
        .filter((item) => item.step_entity_id === stepEntity.id && normalized(item.role_name) === 'capataz')
        .map((item) => item.agent_name)
        .filter(Boolean)
        .join(' · '),
      fases,
      imagenes: imageStepLinks
        .filter((link) => link.step_entity_id === stepEntity.id)
        .map((link) => link.image_entity_id),
    }
  })

  const acontecimientos = eventEntities.map((eventEntity) => {
    const event = eventRowById.get(eventEntity.id) || {}

    return {
      id: eventEntity.id,
      slug: eventEntity.slug,
      titulo: eventEntity.name,
      categoria: event.event_type || 'Acontecimiento',
      ano: event.event_date_text || event.event_date || '',
      resumen: event.description || eventEntity.summary || '',
      protagonistas: imagenes
        .filter((imagen) => eventLinks.some(
          (link) => link.source_entity_id === eventEntity.id && link.target_entity_id === imagen.id
        ))
        .map((imagen) => imagen.nombre)
        .join(' y '),
    }
  }).sort((first, second) => yearFrom(first.ano) - yearFrom(second.ano))

  const piezasPatrimoniales = heritageAssetEntities
    .map((assetEntity) => {
      const asset = heritageAssetById.get(assetEntity.id) || {}
      const mediaLinks = heritageMedia.filter((item) => item.entity_id === assetEntity.id)
      const coverLink = mediaLinks.find((item) => item.is_cover)
        || mediaLinks.find((item) => item.relation_type === 'cover')
        || mediaLinks[0]
      const mediaAsset = Array.isArray(coverLink?.media_assets)
        ? coverLink.media_assets[0]
        : coverLink?.media_assets
      const coverUrl = mediaAsset?.storage_path
        ? mediaAsset.storage_path.startsWith('/')
          ? mediaAsset.storage_path
          : supabase.storage.from('hilo-media').getPublicUrl(mediaAsset.storage_path).data.publicUrl
        : ''

      return {
        id: assetEntity.id,
        slug: assetEntity.slug,
        nombre: assetEntity.name,
        tipo: asset.asset_type || 'Pieza patrimonial',
        resumen: assetEntity.summary || '',
        descripcion: asset.description || assetEntity.summary || '',
        fecha: asset.date_from_text || displayDate(asset.date_from),
        bendicion: asset.blessing_date_text || displayDate(asset.blessing_date),
        tecnica: asset.technique || '',
        materiales: asset.materials || '',
        dimensiones: asset.dimensions_text || '',
        iconografia: asset.iconography || '',
        contexto: asset.historical_context || '',
        procedencia: asset.provenance_text || '',
        origen: asset.origin_notes || '',
        explicacionAutor: asset.notes || '',
        conservacion: asset.current_condition || '',
        actual: asset.is_current,
        destacado: asset.is_featured,
        orden: asset.display_order || 0,
        imagen: coverUrl
          ? {
              src: coverUrl,
              alt: mediaAsset.alt_text || assetEntity.name,
              pie: mediaAsset.caption || '',
              autor: mediaAsset.author_name || '',
            }
          : null,
        agentes: heritageInterventions
          .filter((item) => item.target_entity_id === assetEntity.id)
          .map((item) => ({
            id: item.agent_entity_id,
            nombre: agentById.get(item.agent_entity_id)?.name || '',
            rol: item.phase || item.discipline,
            disciplina: item.discipline,
            intervencion: item.intervention_type || '',
            fecha: item.date_from_text || displayDate(item.date_from),
          }))
          .filter((item) => item.nombre),
      }
    })
    .sort((first, second) => first.orden - second.orden)

  const esCartelDeHermandad = (pieza) => normalized(pieza.tipo).includes('cartel')
  const cartelesFiestas = piezasPatrimoniales
    .filter(esCartelDeHermandad)
    .sort((first, second) => yearFrom(second.fecha) - yearFrom(first.fecha))
  const patrimonio = piezasPatrimoniales.filter((pieza) => !esCartelDeHermandad(pieza))

  const estrenos = heritageUpdates.map((update) => {
    const target = heritageUpdateTargetById.get(update.target_entity_id)
    const agentes = heritageUpdateAgents
      .filter((link) => link.heritage_update_id === update.id)
      .map((link) => {
        const name = agentById.get(link.agent_entity_id)?.name
        return name ? {
          id: link.agent_entity_id,
          nombre: name,
          rol: link.role_name || '',
        } : null
      })
      .filter(Boolean)

    return {
      id: update.id,
      ano: update.year || displayDate(update.update_date),
      fecha: displayDate(update.update_date),
      fechaIso: update.update_date || '',
      tipo: update.update_type === 'restauracion' ? 'Restauración' : 'Estreno',
      titulo: update.title,
      descripcion: update.description || '',
      autoria: agentes.map((agente) => [agente.nombre, agente.rol].filter(Boolean).join(' · ')).join(' · ') || 'Responsable no documentado',
      agentes,
      disciplina: update.discipline || '',
      elemento: update.element_name || '',
      imagen: target?.public_image_path
        ? {
            src: target.public_image_path,
            alt: target.public_image_alt || update.title,
            credito: target.public_image_credit || '',
          }
        : null,
    }
  })

  const cultos = cultRows.map((cult) => ({
    id: cult.id,
    nombre: cult.title,
    tipo: [cult.cult_type, cult.time_text].filter(Boolean).join(' · '),
    descripcion: cult.description || '',
    ...cultDate(cult),
  }))

  const habitos = habitRows.map((habit) => ({
    id: habit.id,
    nombre: habit.name,
    tunica: habit.tunic_description || '',
    antifaz: habit.hood_description || '',
    cordon: habit.cord_description || '',
    botonadura: habit.buttons_description || '',
    escudo: habit.shield_description || '',
    calzado: habit.footwear_description || '',
    imagenPath: habit.image_path || '',
    imagenAlt: habit.image_alt || '',
  }))

  const salidasConcretas = outingRows.map((outing) => {
    const videoMedia = outingMediaRows
      .filter((link) => link.outing_id === outing.id)
      .map((link) => link.media_assets)
      .map((media) => Array.isArray(media) ? media[0] : media)
      .find((media) => media?.media_type === 'video' && youtubeVideoId(media.storage_path || media.source_url))
    const videoId = youtubeVideoId(videoMedia?.storage_path || videoMedia?.source_url)

    return {
      id: outing.id,
      tipo: outing.outing_type,
      caracter: outing.character === 'extraordinary' ? 'Extraordinaria' : 'Ordinaria',
      nombre: outing.title || outing.outing_type,
      titulares: outingEntityLinks
        .filter((link) => link.outing_id === outing.id)
        .map((link) => imageNameById.get(link.entity_id))
        .filter(Boolean)
        .join(' · '),
      momento: [displayDate(outing.outing_date), displayTime(outing.departure_time), documentedPublicText(outing.description)].filter(Boolean).join(' · '),
      destino: outing.route_summary || outing.reason || '',
      estado: outing.event_status,
      video: videoId ? {
        id: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        titulo: videoMedia.title || `Vídeo oficial de ${outing.title || outing.outing_type}`,
        descripcion: videoMedia.alt_text || '',
        autor: videoMedia.author_name || '',
      } : null,
    }
  })

  const salidasRecurrentes = outingSeriesRows.map((outing) => ({
    id: outing.id,
    tipo: outing.outing_type,
    caracter: 'Anual',
    nombre: outing.title,
    titulares: '',
    momento: [documentedPublicText(outing.date_rule), documentedPublicText(outing.time_text)].filter(Boolean).join(' · '),
    destino: outing.route_summary || '',
    estado: 'recurring',
    movimientos: outingSeriesMovementRows
      .filter((movement) => movement.outing_series_id === outing.id)
      .map((movement) => ({
        sentido: movement.direction,
        momento: [documentedPublicText(movement.date_rule), documentedPublicText(movement.time_text)].filter(Boolean).join(' · '),
        destino: movement.route_summary || '',
      })),
  }))

  const datosJornada = processionStats
    ? {
        ano: processionStats.year,
        ordenJornada: displayOrdinalPosition(
          processionStats.position_by_nazarenos,
          processionStats.brotherhoods_in_day
        ),
        totalCortejo: processionStats.total_procession_count?.toLocaleString('es-ES') || '',
        totalNazarenos: processionStats.total_nazarenos_count?.toLocaleString('es-ES') || '',
        tiempoCarreraOficial: displayMinutes(processionStats.official_career_duration_minutes),
      }
    : null

  return {
    entity,
    brotherhood,
    municipality,
    place,
    imagenes,
    pasos,
    acontecimientos,
    colors,
    cartelesFiestas,
    patrimonio,
    estrenos,
    cultos,
    habitos,
    salidas: [...salidasConcretas, ...salidasRecurrentes],
    acompanamientoActual,
    socialLinks,
    sources,
    datosJornada,
  }
}

function mergeBrotherhood(local, remote) {
  const base = local || {
    ...EMPTY_COLLECTIONS,
    colores: {
      primario: '#153B69',
      secundario: '#A71930',
      claro: '#FFFFFF',
    },
    resumen: remote.entity.summary || '',
    historia: remote.brotherhood.notes || remote.entity.summary || '',
    tipos: [],
  }

  const localImageSlugs = new Set((base.imagenes || []).map((imagen) => imagen.slug))
  const remoteImageSlugs = new Set((remote.imagenes || []).map((imagen) => imagen.slug))
  const imagenes = orderProcessionalItems(mergeBySlug(base.imagenes, remote.imagenes).map((imagen) => ({
    ...imagen,
    autor: documentedPublicText(imagen.autor),
    fecha: documentedPublicText(imagen.fecha),
    iniciales: imagen.iniciales || initials(imagen.nombre),
    fichaDisponible: remoteImageSlugs.has(imagen.slug) || localImageSlugs.has(imagen.slug),
  })))
  const remoteImageIdBySlug = new Map(imagenes.map((imagen) => [imagen.slug, imagen.id]))
  const localImageSlugById = new Map((base.imagenes || []).map((imagen) => [imagen.id, imagen.slug]))

  const localStepSlugs = new Set((base.pasos || []).map((paso) => paso.slug))
  const remoteStepSlugs = new Set((remote.pasos || []).map((paso) => paso.slug))
  const pasos = orderProcessionalItems(mergeBySlug(base.pasos, remote.pasos).map((paso) => ({
    ...paso,
    acompanamientoActual: remote.acompanamientoActual
      ?.filter((item) => item.pasoId === paso.id)
      .map((item) => item.banda)
      .join(' · ') || paso.acompanamientoActual,
    fichaDisponible: remoteStepSlugs.has(paso.slug) || localStepSlugs.has(paso.slug),
    imagenes: paso.imagenes?.length
      ? paso.imagenes.map((id) => remoteImageIdBySlug.get(localImageSlugById.get(id)) || id)
      : [],
  })))

  const remoteCouncilEvents = remote.acontecimientos.filter((event) =>
    event.categoria.toLowerCase().includes('vía crucis')
  )
  const localCouncilEvents = base.participacionesConsejo || []
  const participacionesConsejo = remoteCouncilEvents.map((remoteEvent) => ({
    ...(localCouncilEvents.find((localEvent) => localEvent.ano === remoteEvent.ano) || {}),
    ...remoteEvent,
  }))
  const remoteChronology = remote.acontecimientos.map((event) => ({
    id: event.id,
    fecha: yearFrom(event.ano) || event.ano,
    titulo: event.titulo,
    texto: event.resumen,
    estado: event.categoria,
  }))

  return {
    ...EMPTY_COLLECTIONS,
    ...base,
    id: remote.entity.id,
    slug: remote.entity.slug,
    nombrePopular: remote.brotherhood.popular_name || remote.entity.name,
    nombreOficial: remote.brotherhood.official_name,
    localidad: remote.municipality?.name || base.localidad,
    provincia: remote.municipality?.province || base.provincia,
    sede: remote.place?.name || base.sede,
    barrio: remote.brotherhood.neighborhood || base.barrio,
    fundacion: remote.brotherhood.foundation_text || base.fundacion,
    diaSalida: remote.brotherhood.current_procession_day || base.diaSalida,
    tipos: remote.brotherhood.brotherhood_types?.length
      ? remote.brotherhood.brotherhood_types
      : base.tipos,
    colores: colorTheme(remote.colors, base.colores),
    resumen: remote.entity.summary || base.resumen,
    historia: base.historia || remote.brotherhood.notes || '',
    escudoPath: remote.brotherhood.crest_path
      || LOCAL_CREST_PATHS[remote.entity.slug]
      || base.escudoPath
      || null,
    escudoIniciales: initials(remote.brotherhood.popular_name || remote.entity.name),
    enlacesOficiales: remote.socialLinks?.length
      ? remote.socialLinks
      : [
          remote.brotherhood.website_url ? { id: 'legacy-website', platform: 'website', url: remote.brotherhood.website_url, label: 'Web oficial' } : null,
          remote.brotherhood.instagram_url ? { id: 'legacy-instagram', platform: 'instagram', url: remote.brotherhood.instagram_url, label: 'Instagram' } : null,
        ].filter(Boolean),
    imagenes,
    pasos,
    cronologia: base.cronologia?.length ? base.cronologia : remoteChronology,
    salidas: base.salidas?.length ? base.salidas : remote.salidas,
    cultos: base.cultos?.length ? base.cultos : remote.cultos,
    habitos: remote.habitos,
    cartelesFiestas: remote.cartelesFiestas?.length
      ? remote.cartelesFiestas
      : base.cartelesFiestas,
    patrimonio: remote.patrimonio?.length ? remote.patrimonio : base.patrimonio,
    estrenos: base.estrenos?.length ? base.estrenos : remote.estrenos,
    participacionesConsejo: remoteCouncilEvents.length
      ? participacionesConsejo
      : localCouncilEvents,
    acompanamientoActual: remote.acompanamientoActual?.length
      ? remote.acompanamientoActual
      : base.acompanamientoActual,
    datosJornada: remote.datosJornada || base.datosJornada,
    fuentesFicha: remote.sources.length
      ? remote.sources.map((source) => ({
          id: source.id,
          nombre: source.name,
          url: source.url,
          descripcion: source.source_type,
        }))
      : base.fuentesFicha,
    datosDesdeSupabase: true,
  }
}

export async function getHermandadesDirectory() {
  try {
    const supabase = await createClient()
    const entities = assertQuery(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'brotherhood')
        .eq('status', 'published')
        .order('name'),
      'No se pudo consultar el directorio de hermandades'
    )

    if (!entities.length) return DIRECTORY_FALLBACKS

    const entityIds = entities.map((entity) => entity.id)
    const brotherhoodRows = assertQuery(
      await supabase
        .from('brotherhoods')
        .select('entity_id, official_name, popular_name, municipality_id, canonical_see_place_id, neighborhood, crest_path, brotherhood_types, current_procession_day')
        .in('entity_id', entityIds),
      'No se pudieron consultar los datos del directorio'
    )
    const municipalityIds = unique(brotherhoodRows.map((row) => row.municipality_id))
    const placeIds = unique(brotherhoodRows.map((row) => row.canonical_see_place_id))
    const [municipalityRows, placeRows] = await Promise.all([
      municipalityIds.length
        ? assertQuery(
            await supabase
              .from('municipalities')
              .select('id, name, province')
              .in('id', municipalityIds),
            'No se pudieron consultar las localidades del directorio'
          )
        : [],
      placeIds.length
        ? assertQuery(
            await supabase
              .from('places')
              .select('id, name')
              .in('id', placeIds),
            'No se pudieron consultar las sedes del directorio'
          )
        : [],
    ])
    const brotherhoodById = new Map(brotherhoodRows.map((row) => [row.entity_id, row]))
    const municipalityById = new Map(municipalityRows.map((row) => [row.id, row]))
    const placeById = new Map(placeRows.map((row) => [row.id, row]))
    const remoteItems = entities.map((entity) => {
      const brotherhood = brotherhoodById.get(entity.id) || {}
      const municipality = municipalityById.get(brotherhood.municipality_id) || {}
      const place = placeById.get(brotherhood.canonical_see_place_id) || {}

      return {
        id: entity.id,
        slug: entity.slug,
        nombrePopular: brotherhood.popular_name || entity.name,
        nombreOficial: brotherhood.official_name || entity.name,
        localidad: municipality.name || '',
        provincia: municipality.province || '',
        sede: place.name || '',
        barrio: brotherhood.neighborhood || '',
        diaSalida: brotherhood.current_procession_day || '',
        tipos: brotherhood.brotherhood_types || [],
        escudoPath: brotherhood.crest_path || LOCAL_CREST_PATHS[entity.slug] || null,
        resumen: entity.summary || '',
      }
    })

    return mergeBySlug(DIRECTORY_FALLBACKS, remoteItems)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    })
    return DIRECTORY_FALLBACKS
  }
}

export async function getHermandadPageBySlug(slug) {
  const local = getHermandadBySlug(slug)

  try {
    const remote = await loadBrotherhoodFromSupabase(slug)
    if (!remote) return local
    const merged = mergeBrotherhood(local, remote)
    return applyBrotherhoodAuthority({ merged, local, remote })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la hermandad desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return local
  }
}

async function loadRelatedBrotherhoodPage(slug, entityType, relationTable, relationColumn) {
  const supabase = await createClient()
  const relatedEntity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug')
      .eq('entity_type', entityType)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle(),
    `No se pudo consultar la entidad ${entityType}`
  )

  if (!relatedEntity) return null

  const relations = assertQuery(
    await supabase
      .from(relationTable)
      .select('brotherhood_entity_id')
      .eq(relationColumn, relatedEntity.id)
      .eq('status', 'published')
      .limit(1),
    `No se pudo consultar la relación de ${entityType} con su hermandad`
  )
  const relation = relations[0]
  if (!relation?.brotherhood_entity_id) return null

  const brotherhoodEntity = assertQuery(
    await supabase
      .from('entities')
      .select('slug')
      .eq('id', relation.brotherhood_entity_id)
      .eq('entity_type', 'brotherhood')
      .eq('status', 'published')
      .maybeSingle(),
    'No se pudo consultar la hermandad relacionada'
  )

  if (!brotherhoodEntity?.slug) return null
  const hermandad = await getHermandadPageBySlug(brotherhoodEntity.slug)
  return hermandad ? { relatedEntity, hermandad } : null
}

export async function getImagenPageBySlug(slug) {
  const fallback = getImagenBySlug(slug)

  try {
    const result = await loadRelatedBrotherhoodPage(slug, 'image', 'brotherhood_images', 'image_entity_id')
    if (!result) return fallback

    const imagen = result.hermandad.imagenes.find((item) => (
      item.id === result.relatedEntity.id || item.slug === slug
    ))
    return imagen ? { imagen, hermandad: result.hermandad } : fallback
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la imagen desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback
  }
}

export async function getPasoPageBySlug(slug) {
  const fallback = getPasoBySlug(slug)

  try {
    const result = await loadRelatedBrotherhoodPage(slug, 'step', 'brotherhood_steps', 'step_entity_id')
    if (!result) return fallback

    const paso = result.hermandad.pasos.find((item) => (
      item.id === result.relatedEntity.id || item.slug === slug
    ))
    return paso ? { paso, hermandad: result.hermandad } : fallback
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el paso desde Supabase', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return fallback
  }
}
