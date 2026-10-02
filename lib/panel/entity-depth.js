import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  loadPublicRowsInBatches,
  loadPublicRowsInPages,
} from '@/lib/supabase/public-query-batches'
import {
  ENTITY_DEPTH_DIMENSIONS,
  ENTITY_DEPTH_LEVELS,
  ENTITY_DEPTH_TYPE_LABELS,
  ENTITY_DEPTH_TYPES,
  scoreEntityDepth,
} from '@/lib/entity-depth'

const PAGE_SIZE = 80
const SORTS = ['depth-asc', 'depth-desc', 'relations', 'sources', 'name']

const PUBLIC_PATHS = {
  brotherhood: 'hermandades',
  band: 'bandas',
  march: 'marchas',
  agent: 'autores',
  image: 'imagenes',
  step: 'pasos',
}

const PANEL_PATHS = {
  brotherhood: 'hermandades',
  band: 'bandas',
  march: 'marchas',
  agent: 'agentes',
  image: 'imagenes',
  step: 'pasos',
}

function signal(key, label, present) {
  return { key, label, present: Boolean(present) }
}

function mapBy(rows = [], key = 'entity_id') {
  return new Map(rows.filter((row) => row?.[key]).map((row) => [row[key], row]))
}

function countMap(rows = [], key) {
  const map = new Map()
  for (const row of rows) {
    const id = row?.[key]
    if (!id) continue
    map.set(id, (map.get(id) || 0) + 1)
  }
  return map
}

function increment(map, id, amount = 1) {
  if (!id) return
  map.set(id, (map.get(id) || 0) + amount)
}

function countFor(map, id) {
  return map.get(id) || 0
}

function present(map, id) {
  return countFor(map, id) > 0
}

function text(...values) {
  return values.filter(Boolean).join(' ').trim()
}

function publicHref(entity) {
  const prefix = PUBLIC_PATHS[entity.entity_type]
  return prefix && entity.slug ? `/${prefix}/${entity.slug}` : ''
}

function panelHref(entity) {
  const prefix = PANEL_PATHS[entity.entity_type]
  return prefix && entity.id ? `/panel/${prefix}/${entity.id}` : ''
}

async function paged(queryPage, label) {
  return loadPublicRowsInPages(queryPage, label)
}

function sortItems(items, sort) {
  const copy = [...items]
  if (sort === 'depth-desc') {
    return copy.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'es'))
  }
  if (sort === 'relations') {
    return copy.sort((a, b) => b.relationCount - a.relationCount || a.score - b.score || a.name.localeCompare(b.name, 'es'))
  }
  if (sort === 'sources') {
    return copy.sort((a, b) => b.sourceCount - a.sourceCount || a.score - b.score || a.name.localeCompare(b.name, 'es'))
  }
  if (sort === 'name') {
    return copy.sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }
  return copy.sort((a, b) => a.score - b.score || b.relationCount - a.relationCount || a.name.localeCompare(b.name, 'es'))
}

export async function getPanelEntityDepth({
  query = '',
  entityType = '',
  level = '',
  dimension = '',
  sort = 'depth-asc',
  page = 1,
} = {}) {
  const supabase = await createClient()

  const [
    entities,
    priorityRows,
    brotherhoods,
    bands,
    marches,
    agents,
    images,
    steps,
    mediaRows,
    brotherhoodImages,
    brotherhoodSteps,
    imageSteps,
    imageAuthorships,
    stepPersonnel,
    bandAgents,
    musicPeriods,
    bandReleases,
    marchAuthors,
    marchDedications,
    marchRecordings,
    repertoireEntries,
    releaseTracks,
    interventions,
    stepPhases,
    stepPhaseAgents,
    agentDisciplines,
  ] = await Promise.all([
    paged(
      (from, to) => supabase
        .from('entities')
        .select('id, entity_type, name, slug, summary, status')
        .eq('status', 'published')
        .in('entity_type', ENTITY_DEPTH_TYPES)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las entidades para Profundidad documental'
    ),
    paged(
      (from, to) => supabase
        .from('entity_editorial_priority')
        .select('id, relation_count, source_count, future_activity_count, next_activity_date')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las señales editoriales existentes'
    ),
    paged(
      (from, to) => supabase
        .from('brotherhoods')
        .select('entity_id, official_name, popular_name, foundation_text, municipality_id, canonical_see_place_id, brotherhood_types, current_procession_day, history_text, crest_path')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Hermandades'
    ),
    paged(
      (from, to) => supabase
        .from('bands')
        .select('entity_id, band_type, municipality_id, foundation_text, description, logo_path, hero_image_path')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Bandas'
    ),
    paged(
      (from, to) => supabase
        .from('marches')
        .select('entity_id, composition_year, composition_date_text, music_type, work_type, description, premiere_date, premiere_date_text, premiered_by_band_entity_id, youtube_video_id')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Marchas'
    ),
    paged(
      (from, to) => supabase
        .from('agents')
        .select('entity_id, agent_kind, municipality_id, foundation_or_birth_text, death_or_end_text, description, birth_or_foundation_date, death_or_end_date, website_url, instagram_url')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Autores'
    ),
    paged(
      (from, to) => supabase
        .from('images')
        .select('entity_id, image_type, anatomical_type, execution_date, execution_date_text, material, technique, iconography, description, current_condition, current_state_notes')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Imágenes'
    ),
    paged(
      (from, to) => supabase
        .from('steps')
        .select('entity_id, step_type, description, execution_date_text, style, materials, dimensions_text, current_condition, current_state_notes')
        .order('entity_id')
        .range(from, to),
      'No se pudieron cargar los perfiles de Pasos'
    ),
    paged(
      (from, to) => supabase
        .from('entity_media')
        .select('entity_id')
        .not('entity_id', 'is', null)
        .order('id')
        .range(from, to),
      'No se pudo cargar el apoyo visual'
    ),
    paged(
      (from, to) => supabase
        .from('brotherhood_images')
        .select('brotherhood_entity_id, image_entity_id')
        .eq('status', 'published')
        .is('date_to', null)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las relaciones Hermandad–Imagen'
    ),
    paged(
      (from, to) => supabase
        .from('brotherhood_steps')
        .select('brotherhood_entity_id, step_entity_id')
        .eq('status', 'published')
        .is('date_to', null)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las relaciones Hermandad–Paso'
    ),
    paged(
      (from, to) => supabase
        .from('image_steps')
        .select('image_entity_id, step_entity_id')
        .eq('status', 'published')
        .is('date_to', null)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las relaciones Imagen–Paso'
    ),
    paged(
      (from, to) => supabase
        .from('image_authorships')
        .select('image_entity_id, agent_entity_id')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las autorías de Imágenes'
    ),
    paged(
      (from, to) => supabase
        .from('step_personnel_periods')
        .select('step_entity_id, agent_entity_id, is_current')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar los responsables de Pasos'
    ),
    paged(
      (from, to) => supabase
        .from('band_agents')
        .select('band_entity_id, agent_entity_id, is_current')
        .order('id')
        .range(from, to),
      'No se pudieron cargar los responsables de Bandas'
    ),
    paged(
      (from, to) => supabase
        .from('music_accompaniment_periods')
        .select('brotherhood_entity_id, band_entity_id, step_entity_id, is_current')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar los acompañamientos musicales'
    ),
    paged(
      (from, to) => supabase
        .from('band_releases')
        .select('band_entity_id, release_year, release_date, release_date_text')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudo cargar la Discografía'
    ),
    paged(
      (from, to) => supabase
        .from('march_authors')
        .select('march_entity_id, agent_entity_id')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las autorías de Marchas'
    ),
    paged(
      (from, to) => supabase
        .from('march_dedications')
        .select('march_entity_id')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las dedicatorias de Marchas'
    ),
    paged(
      (from, to) => supabase
        .from('march_recordings')
        .select('march_entity_id')
        .neq('status', 'archived')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las grabaciones de Marchas'
    ),
    paged(
      (from, to) => supabase
        .from('musical_repertoire_entries')
        .select('march_entity_id')
        .not('march_entity_id', 'is', null)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las interpretaciones documentadas'
    ),
    paged(
      (from, to) => supabase
        .from('band_release_tracks')
        .select('march_entity_id')
        .not('march_entity_id', 'is', null)
        .order('id')
        .range(from, to),
      'No se pudieron cargar las apariciones discográficas'
    ),
    paged(
      (from, to) => supabase
        .from('heritage_interventions')
        .select('target_entity_id, agent_entity_id')
        .eq('status', 'published')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las intervenciones patrimoniales'
    ),
    paged(
      (from, to) => supabase
        .from('step_phases')
        .select('id, step_entity_id')
        .eq('status', 'published')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las fases de Pasos'
    ),
    paged(
      (from, to) => supabase
        .from('step_phase_agents')
        .select('step_phase_id, agent_entity_id')
        .order('id')
        .range(from, to),
      'No se pudieron cargar las autorías de fases de Pasos'
    ),
    paged(
      (from, to) => supabase
        .from('agent_disciplines')
        .select('agent_entity_id, discipline')
        .order('agent_entity_id')
        .range(from, to),
      'No se pudieron cargar las disciplinas de Autores'
    ),
  ])

  const agentIds = entities.filter((entity) => entity.entity_type === 'agent').map((entity) => entity.id)
  const agentSources = await loadPublicRowsInBatches(
    agentIds,
    (ids) => supabase.from('source_links').select('entity_id').in('entity_id', ids),
    'No se pudieron contar las Fuentes de Autores'
  )

  const priorityById = new Map(priorityRows.map((row) => [row.id, row]))
  const brotherhoodById = mapBy(brotherhoods)
  const bandById = mapBy(bands)
  const marchById = mapBy(marches)
  const agentById = mapBy(agents)
  const imageById = mapBy(images)
  const stepById = mapBy(steps)

  const mediaCounts = countMap(mediaRows, 'entity_id')
  const brotherhoodImageCounts = countMap(brotherhoodImages, 'brotherhood_entity_id')
  const imageBrotherhoodCounts = countMap(brotherhoodImages, 'image_entity_id')
  const brotherhoodStepCounts = countMap(brotherhoodSteps, 'brotherhood_entity_id')
  const stepBrotherhoodCounts = countMap(brotherhoodSteps, 'step_entity_id')
  const imageStepCounts = countMap(imageSteps, 'image_entity_id')
  const stepImageCounts = countMap(imageSteps, 'step_entity_id')
  const imageAuthorshipCounts = countMap(imageAuthorships, 'image_entity_id')
  const agentImageCounts = countMap(imageAuthorships, 'agent_entity_id')
  const stepPersonnelCounts = countMap(stepPersonnel, 'step_entity_id')
  const bandAgentCounts = countMap(bandAgents, 'band_entity_id')
  const agentBandCounts = countMap(bandAgents, 'agent_entity_id')
  const bandReleaseCounts = countMap(bandReleases, 'band_entity_id')
  const marchAuthorCounts = countMap(marchAuthors, 'march_entity_id')
  const agentMarchCounts = countMap(marchAuthors, 'agent_entity_id')
  const marchDedicationCounts = countMap(marchDedications, 'march_entity_id')
  const marchRecordingCounts = countMap(marchRecordings, 'march_entity_id')
  const marchRepertoireCounts = countMap(repertoireEntries, 'march_entity_id')
  const marchTrackCounts = countMap(releaseTracks, 'march_entity_id')
  const interventionTargetCounts = countMap(interventions, 'target_entity_id')
  const agentInterventionCounts = countMap(interventions, 'agent_entity_id')
  const stepPhaseCounts = countMap(stepPhases, 'step_entity_id')
  const agentDisciplineCounts = countMap(agentDisciplines, 'agent_entity_id')
  const agentSourceCounts = countMap(agentSources, 'entity_id')

  const musicBrotherhoodCounts = new Map()
  const musicBandCounts = new Map()
  const musicStepCounts = new Map()
  const currentMusicBrotherhood = new Set()
  const currentMusicBand = new Set()
  const currentMusicStep = new Set()
  for (const period of musicPeriods) {
    increment(musicBrotherhoodCounts, period.brotherhood_entity_id)
    increment(musicBandCounts, period.band_entity_id)
    increment(musicStepCounts, period.step_entity_id)
    if (period.is_current) {
      if (period.brotherhood_entity_id) currentMusicBrotherhood.add(period.brotherhood_entity_id)
      if (period.band_entity_id) currentMusicBand.add(period.band_entity_id)
      if (period.step_entity_id) currentMusicStep.add(period.step_entity_id)
    }
  }

  const currentBandAgent = new Set(bandAgents.filter((row) => row.is_current).map((row) => row.band_entity_id))
  const currentStepPersonnel = new Set(stepPersonnel.filter((row) => row.is_current).map((row) => row.step_entity_id))
  const releaseChronologyCounts = new Map()
  for (const release of bandReleases) {
    if (release.release_year || release.release_date || release.release_date_text) increment(releaseChronologyCounts, release.band_entity_id)
  }

  const phaseToStep = new Map(stepPhases.map((phase) => [phase.id, phase.step_entity_id]))
  const agentStepCounts = new Map()
  for (const relation of stepPhaseAgents) increment(agentStepCounts, relation.agent_entity_id)

  const items = entities.map((entity) => {
    const priority = priorityById.get(entity.id) || {}
    let relationCount = Number(priority.relation_count) || 0
    let sourceCount = Number(priority.source_count) || 0
    let identity = []
    let chronology = []
    let keyRelations = []
    let detail = ''
    let activityStrength = 0
    let supportStrength = 0

    if (entity.entity_type === 'brotherhood') {
      const profile = brotherhoodById.get(entity.id) || {}
      const musicCount = countFor(musicBrotherhoodCounts, entity.id)
      identity = [
        signal('name', 'Completar denominación oficial o popular', profile.official_name || profile.popular_name),
        signal('type', 'Clasificar la naturaleza de la Hermandad', Array.isArray(profile.brotherhood_types) && profile.brotherhood_types.length),
        signal('place', 'Documentar municipio o sede canónica', profile.municipality_id || profile.canonical_see_place_id),
      ]
      detail = profile.history_text || ''
      chronology = [
        signal('foundation', 'Documentar fundación o antigüedad', profile.foundation_text),
        signal('history', 'Construir cronología histórica', profile.history_text),
        signal('music-history', 'Documentar periodos musicales', musicCount),
      ]
      keyRelations = [
        signal('images', 'Relacionar titulares o Imágenes', present(brotherhoodImageCounts, entity.id)),
        signal('steps', 'Relacionar Pasos', present(brotherhoodStepCounts, entity.id)),
        signal('music', 'Relacionar acompañamientos musicales', musicCount),
      ]
      activityStrength = (Number(priority.future_activity_count) || 0) > 0
        ? 2
        : (currentMusicBrotherhood.has(entity.id) || profile.current_procession_day ? 1 : 0)
      supportStrength = profile.crest_path || present(mediaCounts, entity.id) ? 1 : 0
    } else if (entity.entity_type === 'band') {
      const profile = bandById.get(entity.id) || {}
      const musicCount = countFor(musicBandCounts, entity.id)
      identity = [
        signal('slug', 'Consolidar URL pública', entity.slug),
        signal('type', 'Clasificar el tipo de formación', profile.band_type),
        signal('place', 'Documentar municipio', profile.municipality_id),
      ]
      detail = profile.description || ''
      chronology = [
        signal('foundation', 'Documentar fundación', profile.foundation_text),
        signal('music-history', 'Documentar acompañamientos históricos', musicCount),
        signal('discography-history', 'Documentar discografía fechada', present(releaseChronologyCounts, entity.id)),
      ]
      keyRelations = [
        signal('direction', 'Documentar dirección o responsables', present(bandAgentCounts, entity.id)),
        signal('accompaniments', 'Relacionar Hermandades o acompañamientos', musicCount),
        signal('releases', 'Incorporar discografía', present(bandReleaseCounts, entity.id)),
      ]
      activityStrength = currentMusicBand.has(entity.id) || currentBandAgent.has(entity.id)
        ? 2
        : (musicCount || present(bandReleaseCounts, entity.id) ? 1 : 0)
      supportStrength = profile.logo_path || profile.hero_image_path || present(mediaCounts, entity.id) ? 1 : 0
    } else if (entity.entity_type === 'march') {
      const profile = marchById.get(entity.id) || {}
      const documentedUse = countFor(marchRecordingCounts, entity.id)
        + countFor(marchRepertoireCounts, entity.id)
        + countFor(marchTrackCounts, entity.id)
      identity = [
        signal('slug', 'Consolidar URL pública', entity.slug),
        signal('work-type', 'Clasificar el tipo de obra', profile.work_type),
        signal('music-type', 'Documentar formación o tipología musical', profile.music_type),
      ]
      detail = profile.description || ''
      chronology = [
        signal('composition', 'Documentar fecha o año de composición', profile.composition_year || profile.composition_date_text),
        signal('premiere', 'Documentar estreno', profile.premiere_date || profile.premiere_date_text),
        signal('documented-use', 'Documentar interpretaciones o grabaciones', documentedUse),
      ]
      keyRelations = [
        signal('authors', 'Documentar autoría', present(marchAuthorCounts, entity.id)),
        signal('dedication', 'Documentar dedicatoria o contexto', present(marchDedicationCounts, entity.id)),
        signal('recordings', 'Añadir grabación documentada', present(marchRecordingCounts, entity.id)),
        signal('performances', 'Relacionar crucetas o discografía', present(marchRepertoireCounts, entity.id) || present(marchTrackCounts, entity.id)),
      ]
      activityStrength = documentedUse ? 2 : (relationCount ? 1 : 0)
      supportStrength = profile.youtube_video_id || present(marchRecordingCounts, entity.id) || present(mediaCounts, entity.id) ? 1 : 0
    } else if (entity.entity_type === 'image') {
      const profile = imageById.get(entity.id) || {}
      const contextCount = countFor(imageBrotherhoodCounts, entity.id) + countFor(imageStepCounts, entity.id)
      identity = [
        signal('slug', 'Consolidar URL pública', entity.slug),
        signal('type', 'Clasificar la Imagen', profile.image_type || profile.anatomical_type),
        signal('artistic-context', 'Documentar técnica, material o iconografía', profile.material || profile.technique || profile.iconography),
      ]
      detail = text(profile.description, profile.current_state_notes)
      chronology = [
        signal('execution', 'Documentar fecha o época de ejecución', profile.execution_date || profile.execution_date_text),
        signal('interventions', 'Documentar restauraciones o intervenciones', present(interventionTargetCounts, entity.id)),
        signal('activity', 'Relacionar actividad cultual o procesional', (Number(priority.future_activity_count) || 0) > 0 || contextCount),
      ]
      keyRelations = [
        signal('authorship', 'Documentar autoría o atribución', present(imageAuthorshipCounts, entity.id)),
        signal('brotherhood', 'Relacionar Hermandad', present(imageBrotherhoodCounts, entity.id)),
        signal('step', 'Relacionar Paso', present(imageStepCounts, entity.id)),
        signal('heritage', 'Documentar restauraciones o intervenciones', present(interventionTargetCounts, entity.id)),
      ]
      activityStrength = (Number(priority.future_activity_count) || 0) > 0
        ? 2
        : (present(interventionTargetCounts, entity.id) || contextCount ? 1 : 0)
      supportStrength = present(mediaCounts, entity.id) ? 1 : 0
    } else if (entity.entity_type === 'step') {
      const profile = stepById.get(entity.id) || {}
      const musicCount = countFor(musicStepCounts, entity.id)
      identity = [
        signal('slug', 'Consolidar URL pública', entity.slug),
        signal('type', 'Clasificar el tipo de Paso', profile.step_type),
        signal('artistic-context', 'Documentar estilo o materiales', profile.style || profile.materials),
      ]
      detail = text(profile.description, profile.current_state_notes)
      chronology = [
        signal('execution', 'Documentar fecha o época de ejecución', profile.execution_date_text),
        signal('phases', 'Documentar fases o transformaciones', present(stepPhaseCounts, entity.id)),
        signal('personnel', 'Documentar periodos de responsables', present(stepPersonnelCounts, entity.id)),
      ]
      keyRelations = [
        signal('brotherhood', 'Relacionar Hermandad', present(stepBrotherhoodCounts, entity.id)),
        signal('images', 'Relacionar Imágenes que porta', present(stepImageCounts, entity.id)),
        signal('phases', 'Documentar autorías, fases o responsables', present(stepPhaseCounts, entity.id) || present(stepPersonnelCounts, entity.id)),
        signal('music', 'Relacionar acompañamiento musical cuando proceda', musicCount),
      ]
      activityStrength = (Number(priority.future_activity_count) || 0) > 0
        ? 2
        : (currentMusicStep.has(entity.id) || currentStepPersonnel.has(entity.id) ? 1 : 0)
      supportStrength = present(mediaCounts, entity.id) ? 1 : 0
    } else {
      const profile = agentById.get(entity.id) || {}
      const imageCount = countFor(agentImageCounts, entity.id)
      const marchCount = countFor(agentMarchCounts, entity.id)
      const interventionCount = countFor(agentInterventionCounts, entity.id)
      const stepBandCount = countFor(agentStepCounts, entity.id) + countFor(agentBandCounts, entity.id)
      relationCount = imageCount + marchCount + interventionCount + stepBandCount
      sourceCount = countFor(agentSourceCounts, entity.id)
      identity = [
        signal('slug', 'Consolidar URL pública', entity.slug),
        signal('kind', 'Clasificar persona, taller o institución', profile.agent_kind),
        signal('discipline', 'Documentar disciplina o contexto territorial', present(agentDisciplineCounts, entity.id) || profile.municipality_id),
      ]
      detail = profile.description || ''
      chronology = [
        signal('life', 'Documentar nacimiento, fundación o periodo', profile.birth_or_foundation_date || profile.foundation_or_birth_text),
        signal('work-history', 'Relacionar obra documentada', relationCount),
      ]
      keyRelations = [
        signal('images', 'Relacionar Imágenes', imageCount),
        signal('marches', 'Relacionar Marchas', marchCount),
        signal('interventions', 'Relacionar intervenciones patrimoniales', interventionCount),
        signal('other-works', 'Relacionar Pasos o Bandas', stepBandCount),
      ]
      activityStrength = relationCount >= 3 ? 2 : relationCount > 0 ? 1 : 0
      supportStrength = present(mediaCounts, entity.id) || profile.website_url || profile.instagram_url ? 1 : 0
    }

    const depth = scoreEntityDepth({
      entityType: entity.entity_type,
      identity,
      summary: entity.summary,
      detail,
      chronology,
      relationCount,
      keyRelations,
      sourceCount,
      activityStrength,
      supportStrength,
    })

    return {
      id: entity.id,
      entityType: entity.entity_type,
      typeLabel: ENTITY_DEPTH_TYPE_LABELS[entity.entity_type],
      name: entity.name,
      slug: entity.slug,
      score: depth.score,
      level: depth.level,
      dimensions: depth.dimensions,
      dimensionList: depth.dimensionList,
      weakestDimension: depth.weakestDimension,
      gaps: depth.gaps,
      relationCount,
      sourceCount,
      futureActivityCount: Number(priority.future_activity_count) || 0,
      nextActivityDate: priority.next_activity_date || null,
      publicHref: publicHref(entity),
      editHref: panelHref(entity),
    }
  })

  const levelCounts = Object.fromEntries(Object.keys(ENTITY_DEPTH_LEVELS).map((key) => [key, 0]))
  for (const item of items) levelCounts[item.level] += 1

  const summary = {
    total: items.length,
    average: items.length ? Math.round(items.reduce((total, item) => total + item.score, 0) / items.length) : 0,
    levels: levelCounts,
    byType: ENTITY_DEPTH_TYPES.map((type) => {
      const subset = items.filter((item) => item.entityType === type)
      return {
        type,
        label: ENTITY_DEPTH_TYPE_LABELS[type],
        count: subset.length,
        average: subset.length ? Math.round(subset.reduce((total, item) => total + item.score, 0) / subset.length) : 0,
      }
    }),
  }

  const safeType = ENTITY_DEPTH_TYPES.includes(entityType) ? entityType : ''
  const safeLevel = Object.hasOwn(ENTITY_DEPTH_LEVELS, level) ? level : ''
  const safeDimension = Object.hasOwn(ENTITY_DEPTH_DIMENSIONS, dimension) ? dimension : ''
  const safeSort = SORTS.includes(sort) ? sort : 'depth-asc'
  const normalizedQuery = String(query || '').trim().toLocaleLowerCase('es')

  let filtered = items.filter((item) => {
    if (normalizedQuery && !item.name.toLocaleLowerCase('es').includes(normalizedQuery)) return false
    if (safeType && item.entityType !== safeType) return false
    if (safeLevel && item.level !== safeLevel) return false
    if (safeDimension && item.weakestDimension?.key !== safeDimension) return false
    return true
  })

  filtered = sortItems(filtered, safeSort)
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(safePage, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE

  return {
    summary,
    items: filtered.slice(start, start + PAGE_SIZE),
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages,
    sort: safeSort,
    filters: {
      query: String(query || '').trim(),
      entityType: safeType,
      level: safeLevel,
      dimension: safeDimension,
    },
  }
}
