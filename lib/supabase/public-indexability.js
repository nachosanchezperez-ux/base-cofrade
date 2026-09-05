import 'server-only'

import { getBandsDirectory } from '@/lib/supabase/bands'
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories'
import { createPublicClient } from '@/lib/supabase/public'
import { meetsPublicEditorialMinimum } from '@/lib/supabase/public-entity-page'

function rowsOrEmpty(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function markerArray(ready) {
  return ready ? [{ id: 'seo-ready' }] : []
}

export function isBrotherhoodEditoriallyIndexable(hermandad) {
  if (!hermandad) return false
  return meetsPublicEditorialMinimum({
    identity: hermandad.nombrePopular || hermandad.nombreOficial,
    type: (hermandad.tipos || []).join(' · '),
    context: hermandad.localidad,
    summary: hermandad.resumen,
    relations: [
      hermandad.imagenes,
      hermandad.pasos,
      hermandad.cronologia,
      hermandad.acompanamientoActual,
      hermandad.patrimonio,
      hermandad.cultos,
    ],
    sources: hermandad.fuentesFicha || [],
    publicValues: hermandad,
  })
}

export function isBandEditoriallyIndexable(band) {
  if (!band) return false
  return meetsPublicEditorialMinimum({
    identity: band.popularName || band.officialName,
    type: band.type,
    context: band.municipality,
    summary: band.summary,
    relations: [
      band.accompaniments,
      band.historicalAccompaniments,
      band.outings,
      band.premieres,
      band.heritage,
      band.direction,
    ],
    sources: band.sources || [],
    publicValues: band,
  })
}

export function isImageEditoriallyIndexable(result) {
  if (!result?.imagen) return false
  const { imagen, hermandad } = result
  return meetsPublicEditorialMinimum({
    identity: imagen.nombre,
    type: imagen.tipologia || imagen.tipo,
    context: hermandad?.localidad || hermandad?.nombrePopular,
    summary: imagen.descripcion,
    relations: [hermandad?.id, result.pasos, imagen.restauraciones, imagen.acontecimientos],
    sources: imagen.fuentes || [],
    publicValues: imagen,
  })
}

export function isStepEditoriallyIndexable(result, heritage = { phases: [], sources: [] }) {
  if (!result?.paso) return false
  const { paso, hermandad, imagenes = [], bandas = [] } = result
  return meetsPublicEditorialMinimum({
    identity: paso.nombre,
    type: paso.tipo,
    context: hermandad?.localidad || hermandad?.nombrePopular,
    summary: paso.descripcion,
    relations: [hermandad?.id, imagenes, bandas, heritage.phases],
    sources: heritage.sources || [],
    publicValues: [paso, heritage.phases],
  })
}

function relationSet(rows, key) {
  return new Set(rows.map((row) => row[key]).filter(Boolean))
}

export async function getPublicIndexableEntityEntries({ brotherhoods = [] } = {}) {
  try {
    const supabase = createPublicClient()
    const [bands, images, steps] = await Promise.all([
      getBandsDirectory(),
      getImagesDirectory(),
      getStepsDirectory(),
    ])

    const brotherhoodIds = brotherhoods.map((item) => item.id).filter(Boolean)
    const bandIds = bands.map((item) => item.id).filter(Boolean)
    const imageIds = images.map((item) => item.id).filter(Boolean)
    const stepIds = steps.map((item) => item.id).filter(Boolean)
    const entityIds = unique([...brotherhoodIds, ...bandIds, ...imageIds, ...stepIds])

    if (!entityIds.length) return []

    const [
      entityRowsResult,
      directSourceLinksResult,
      brotherhoodProfilesResult,
      imageRowsResult,
      stepRowsResult,
      brotherhoodImagesResult,
      brotherhoodStepsResult,
      periodsResult,
      cultsResult,
      outingsResult,
      processionStatsResult,
      bandAgentsResult,
      bandPremieresResult,
      heritageAssetsResult,
      stepPhasesResult,
    ] = await Promise.all([
      supabase
        .from('entities')
        .select('id, entity_type, slug, updated_at')
        .in('id', entityIds)
        .eq('status', 'published'),
      supabase
        .from('source_links')
        .select('entity_id, source_id')
        .in('entity_id', entityIds),
      brotherhoodIds.length
        ? supabase.from('brotherhoods').select('*').in('entity_id', brotherhoodIds)
        : Promise.resolve({ data: [], error: null }),
      imageIds.length
        ? supabase
            .from('images')
            .select('entity_id, image_type, anatomical_type, execution_date, execution_date_text, material, technique, dimensions_text, iconography, current_condition, current_state_notes, description')
            .in('entity_id', imageIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('steps')
            .select('entity_id, step_type, description')
            .in('entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase
            .from('brotherhood_images')
            .select('brotherhood_entity_id, image_entity_id')
            .in('brotherhood_entity_id', brotherhoodIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase
            .from('brotherhood_steps')
            .select('brotherhood_entity_id, step_entity_id')
            .in('brotherhood_entity_id', brotherhoodIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('music_accompaniment_periods')
        .select('id, brotherhood_entity_id, band_entity_id, is_current')
        .eq('status', 'published'),
      brotherhoodIds.length
        ? supabase
            .from('cults')
            .select('id, brotherhood_entity_id')
            .in('brotherhood_entity_id', brotherhoodIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase
            .from('outings')
            .select('id, brotherhood_entity_id')
            .in('brotherhood_entity_id', brotherhoodIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      brotherhoodIds.length
        ? supabase
            .from('brotherhood_procession_stats')
            .select('brotherhood_entity_id, source_id')
            .in('brotherhood_entity_id', brotherhoodIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase
            .from('band_agents')
            .select('band_entity_id')
            .in('band_entity_id', bandIds)
            .eq('is_current', true)
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase
            .from('band_premieres')
            .select('band_entity_id, source_id')
            .in('band_entity_id', bandIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      [...brotherhoodIds, ...bandIds].length
        ? supabase
            .from('heritage_assets')
            .select('entity_id, parent_entity_id, asset_type')
            .in('parent_entity_id', [...brotherhoodIds, ...bandIds])
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('step_phases')
            .select('id, step_entity_id')
            .in('step_entity_id', stepIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
    ])

    const entityRows = rowsOrEmpty(entityRowsResult, 'No se pudieron consultar las entidades del sitemap')
    const directSourceLinks = rowsOrEmpty(directSourceLinksResult, 'No se pudieron consultar las fuentes directas del sitemap')
    const brotherhoodProfiles = rowsOrEmpty(brotherhoodProfilesResult, 'No se pudieron consultar los perfiles de Hermandad para SEO')
    const imageRows = rowsOrEmpty(imageRowsResult, 'No se pudieron consultar los datos de Imagen para SEO')
    const stepRows = rowsOrEmpty(stepRowsResult, 'No se pudieron consultar los datos de Paso para SEO')
    const brotherhoodImages = rowsOrEmpty(brotherhoodImagesResult, 'No se pudieron consultar las relaciones Hermandad–Imagen para SEO')
    const brotherhoodSteps = rowsOrEmpty(brotherhoodStepsResult, 'No se pudieron consultar las relaciones Hermandad–Paso para SEO')
    const periods = rowsOrEmpty(periodsResult, 'No se pudieron consultar los acompañamientos para SEO')
    const cults = rowsOrEmpty(cultsResult, 'No se pudieron consultar los Cultos para SEO')
    const outings = rowsOrEmpty(outingsResult, 'No se pudieron consultar las Salidas para SEO')
    const processionStats = rowsOrEmpty(processionStatsResult, 'No se pudieron consultar los datos procesionales para SEO')
    const bandAgents = rowsOrEmpty(bandAgentsResult, 'No se pudo consultar la dirección de bandas para SEO')
    const bandPremieres = rowsOrEmpty(bandPremieresResult, 'No se pudieron consultar los estrenos de bandas para SEO')
    const heritageAssets = rowsOrEmpty(heritageAssetsResult, 'No se pudo consultar el patrimonio relacionado para SEO')
    const stepPhases = rowsOrEmpty(stepPhasesResult, 'No se pudieron consultar las fases de los pasos para SEO')

    const phaseIds = stepPhases.map((item) => item.id)
    const cultIds = cults.map((item) => item.id)
    const outingIds = outings.map((item) => item.id)
    const periodIds = periods.map((item) => item.id)
    const heritageEntityIds = heritageAssets.map((item) => item.entity_id).filter(Boolean)

    const [phaseSourcesResult, cultSourcesResult, outingSourcesResult, periodSourcesResult, heritageSourcesResult] = await Promise.all([
      phaseIds.length
        ? supabase.from('source_links').select('source_id, step_phase_id').in('step_phase_id', phaseIds)
        : Promise.resolve({ data: [], error: null }),
      cultIds.length
        ? supabase.from('source_links').select('source_id, cult_id').in('cult_id', cultIds)
        : Promise.resolve({ data: [], error: null }),
      outingIds.length
        ? supabase.from('source_links').select('source_id, outing_id').in('outing_id', outingIds)
        : Promise.resolve({ data: [], error: null }),
      periodIds.length
        ? supabase.from('source_links').select('source_id, music_accompaniment_period_id').in('music_accompaniment_period_id', periodIds)
        : Promise.resolve({ data: [], error: null }),
      heritageEntityIds.length
        ? supabase.from('source_links').select('source_id, entity_id').in('entity_id', heritageEntityIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    const phaseSources = rowsOrEmpty(phaseSourcesResult, 'No se pudieron consultar las fuentes de fases para SEO')
    const cultSources = rowsOrEmpty(cultSourcesResult, 'No se pudieron consultar las fuentes de Cultos para SEO')
    const outingSources = rowsOrEmpty(outingSourcesResult, 'No se pudieron consultar las fuentes de Salidas para SEO')
    const periodSources = rowsOrEmpty(periodSourcesResult, 'No se pudieron consultar las fuentes de acompañamientos para SEO')
    const heritageSources = rowsOrEmpty(heritageSourcesResult, 'No se pudieron consultar las fuentes patrimoniales para SEO')

    const directSourceEntities = relationSet(directSourceLinks, 'entity_id')
    const entityById = new Map(entityRows.map((item) => [item.id, item]))
    const brotherhoodProfileById = new Map(brotherhoodProfiles.map((item) => [item.entity_id, item]))
    const imageRowById = new Map(imageRows.map((item) => [item.entity_id, item]))
    const stepRowById = new Map(stepRows.map((item) => [item.entity_id, item]))
    const phaseById = new Map(stepPhases.map((item) => [item.id, item]))
    const cultById = new Map(cults.map((item) => [item.id, item]))
    const outingById = new Map(outings.map((item) => [item.id, item]))
    const periodById = new Map(periods.map((item) => [item.id, item]))
    const heritageByEntityId = new Map(heritageAssets.map((item) => [item.entity_id, item]))

    const brotherhoodImageIds = new Map()
    for (const link of brotherhoodImages) {
      const ids = brotherhoodImageIds.get(link.brotherhood_entity_id) || []
      ids.push(link.image_entity_id)
      brotherhoodImageIds.set(link.brotherhood_entity_id, ids)
    }
    const brotherhoodStepIds = new Map()
    for (const link of brotherhoodSteps) {
      const ids = brotherhoodStepIds.get(link.brotherhood_entity_id) || []
      ids.push(link.step_entity_id)
      brotherhoodStepIds.set(link.brotherhood_entity_id, ids)
    }

    const phaseSourceSteps = new Set(
      phaseSources
        .map((link) => phaseById.get(link.step_phase_id)?.step_entity_id)
        .filter(Boolean)
    )
    const cultSourceBrotherhoods = new Set(
      cultSources
        .map((link) => cultById.get(link.cult_id)?.brotherhood_entity_id)
        .filter(Boolean)
    )
    const outingSourceBrotherhoods = new Set(
      outingSources
        .map((link) => outingById.get(link.outing_id)?.brotherhood_entity_id)
        .filter(Boolean)
    )
    const periodSourceBands = new Set(
      periodSources
        .map((link) => periodById.get(link.music_accompaniment_period_id)?.band_entity_id)
        .filter(Boolean)
    )
    const periodSourceBrotherhoods = new Set(
      periodSources
        .map((link) => periodById.get(link.music_accompaniment_period_id)?.brotherhood_entity_id)
        .filter(Boolean)
    )
    const heritageSourceParents = new Set(
      heritageSources
        .map((link) => heritageByEntityId.get(link.entity_id)?.parent_entity_id)
        .filter(Boolean)
    )

    const brotherhoodImageRelations = relationSet(brotherhoodImages, 'brotherhood_entity_id')
    const brotherhoodStepRelations = relationSet(brotherhoodSteps, 'brotherhood_entity_id')
    const currentBrotherhoodPeriods = new Set(
      periods.filter((item) => item.is_current).map((item) => item.brotherhood_entity_id).filter(Boolean)
    )
    const brotherhoodCultRelations = relationSet(cults, 'brotherhood_entity_id')
    const bandPeriodRelations = relationSet(periods, 'band_entity_id')
    const bandAgentRelations = relationSet(bandAgents, 'band_entity_id')
    const bandPremiereRelations = relationSet(bandPremieres, 'band_entity_id')
    const heritageParentRelations = relationSet(heritageAssets, 'parent_entity_id')
    const processionStatSources = relationSet(
      processionStats.filter((item) => item.source_id),
      'brotherhood_entity_id'
    )

    const hasBrotherhoodSource = (id) => {
      if (directSourceEntities.has(id) || processionStatSources.has(id)) return true
      if (cultSourceBrotherhoods.has(id) || outingSourceBrotherhoods.has(id) || periodSourceBrotherhoods.has(id)) return true
      if (heritageSourceParents.has(id)) return true
      if ((brotherhoodImageIds.get(id) || []).some((childId) => directSourceEntities.has(childId))) return true
      if ((brotherhoodStepIds.get(id) || []).some((childId) => directSourceEntities.has(childId) || phaseSourceSteps.has(childId))) return true
      return false
    }

    const brotherhoodEntries = brotherhoods.filter((item) => {
      const hasImages = brotherhoodImageRelations.has(item.id)
      const hasSteps = brotherhoodStepRelations.has(item.id)
      const hasCurrentMusic = currentBrotherhoodPeriods.has(item.id)
      const hasCults = brotherhoodCultRelations.has(item.id)
      const rawProfile = brotherhoodProfileById.get(item.id) || {}
      const candidate = {
        ...rawProfile,
        ...item,
        imagenes: markerArray(hasImages),
        pasos: markerArray(hasSteps),
        cronologia: [],
        acompanamientoActual: markerArray(hasCurrentMusic),
        patrimonio: [],
        cultos: markerArray(hasCults),
        fuentesFicha: markerArray(hasBrotherhoodSource(item.id)),
      }
      return isBrotherhoodEditoriallyIndexable(candidate)
    })

    const bandEntries = bands.filter((band) => {
      const hasPeriod = bandPeriodRelations.has(band.id)
      const hasAgent = bandAgentRelations.has(band.id)
      const hasPremiere = bandPremiereRelations.has(band.id)
      const hasHeritage = heritageParentRelations.has(band.id)
      const hasSource = directSourceEntities.has(band.id)
        || periodSourceBands.has(band.id)
        || bandPremieres.some((item) => item.band_entity_id === band.id && item.source_id)
        || Boolean(band.websiteUrl || band.youtubeUrl)
      return isBandEditoriallyIndexable({
        ...band,
        direction: markerArray(hasAgent),
        accompaniments: markerArray(hasPeriod),
        historicalAccompaniments: [],
        outings: [],
        premieres: markerArray(hasPremiere),
        heritage: markerArray(hasHeritage),
        sources: markerArray(hasSource),
      })
    })

    const imageEntries = images.filter((item) => {
      const row = imageRowById.get(item.id) || {}
      const imagen = {
        ...row,
        id: item.id,
        slug: item.slug,
        nombre: item.name,
        tipo: row.image_type || item.type,
        tipologia: row.anatomical_type || row.image_type || item.type,
        autor: (item.authorNames || []).join(' · '),
        fecha: row.execution_date_text || row.execution_date || item.date,
        descripcion: row.description || item.summary,
        material: row.material || item.material,
        tecnica: row.technique || item.technique,
        dimensiones: row.dimensions_text || '',
        iconografia: row.iconography || '',
        estadoActual: row.current_state_notes || item.condition,
        fuentes: markerArray(directSourceEntities.has(item.id)),
        restauraciones: [],
      }
      const hermandad = item.brotherhoodName
        ? {
            id: item.brotherhoodSlug || `brotherhood-${item.id}`,
            localidad: item.municipality,
            nombrePopular: item.brotherhoodName,
          }
        : null
      return isImageEditoriallyIndexable({ imagen, hermandad, pasos: [] })
    })

    const stepEntries = steps.filter((item) => {
      const row = stepRowById.get(item.id) || {}
      const hermandad = item.brotherhoodName
        ? {
            id: item.brotherhoodSlug || `brotherhood-${item.id}`,
            localidad: item.municipality,
            nombrePopular: item.brotherhoodName,
          }
        : null
      const phases = stepPhases.filter((phase) => phase.step_entity_id === item.id)
      const hasPhaseSource = phaseSourceSteps.has(item.id)
      return isStepEditoriallyIndexable({
        paso: {
          id: item.id,
          slug: item.slug,
          nombre: item.name,
          tipo: row.step_type || item.type,
          descripcion: row.description || item.summary,
        },
        hermandad,
        imagenes: item.imageNames || [],
        bandas: [],
      }, {
        phases,
        sources: markerArray(hasPhaseSource),
      })
    })

    const selectedIds = new Set([
      ...brotherhoodEntries.map((item) => item.id),
      ...bandEntries.map((item) => item.id),
      ...imageEntries.map((item) => item.id),
      ...stepEntries.map((item) => item.id),
    ])

    return entityRows
      .filter((item) => selectedIds.has(item.id) && item.slug)
      .map((item) => ({
        id: item.id,
        entityType: item.entity_type,
        slug: item.slug,
        updatedAt: item.updated_at || null,
      }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo calcular la indexabilidad compartida del sitemap', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
