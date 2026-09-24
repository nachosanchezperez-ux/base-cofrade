import 'server-only'

import { filterPublicPageEntities } from '@/lib/supabase/public-entity-page'
import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function glorySeriesPriority(series = {}) {
  const label = normalized([series.outing_type, series.title].filter(Boolean).join(' '))
  if (label.includes('procesion de gloria')) return 0
  if (label.includes('gloriosa')) return 1
  if (label.includes('rosario')) return 2
  return 3
}

export async function getHermandadesDirectory({ throwOnError = false } = {}) {
  try {
    const supabase = createPublicClient()
    const entities = assertRows(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'brotherhood')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudo consultar el directorio de Hermandades'
    )

    if (!entities.length) return []

    const entityIds = entities.map((entity) => entity.id)
    const [brotherhoodResult, glorySeriesResult] = await Promise.all([
      supabase
        .from('brotherhoods')
        .select('entity_id, official_name, popular_name, municipality_id, canonical_see_place_id, neighborhood, crest_path, brotherhood_types, current_procession_day')
        .in('entity_id', entityIds),
      supabase
        .from('outing_series')
        .select('brotherhood_entity_id, outing_type, title, month, date_rule, display_order')
        .in('brotherhood_entity_id', entityIds)
        .eq('status', 'published')
        .not('month', 'is', null),
    ])
    const brotherhoodRows = assertRows(
      brotherhoodResult,
      'No se pudieron consultar los datos del directorio de Hermandades'
    )
    const glorySeriesRows = assertRows(
      glorySeriesResult,
      'No se pudieron consultar las fechas principales de las Glorias'
    )
    const municipalityIds = unique(brotherhoodRows.map((row) => row.municipality_id))
    const placeIds = unique(brotherhoodRows.map((row) => row.canonical_see_place_id))
    const [municipalityRows, placeRows] = await Promise.all([
      municipalityIds.length
        ? assertRows(await supabase.from('municipalities').select('id, name, province').in('id', municipalityIds), 'No se pudieron consultar las localidades del directorio')
        : [],
      placeIds.length
        ? assertRows(await supabase.from('places').select('id, name').in('id', placeIds), 'No se pudieron consultar las sedes del directorio')
        : [],
    ])

    const brotherhoodById = new Map(brotherhoodRows.map((row) => [row.entity_id, row]))
    const municipalityById = new Map(municipalityRows.map((row) => [row.id, row]))
    const placeById = new Map(placeRows.map((row) => [row.id, row]))
    const glorySeriesByBrotherhood = new Map()

    for (const series of glorySeriesRows) {
      const current = glorySeriesByBrotherhood.get(series.brotherhood_entity_id)
      if (!current) {
        glorySeriesByBrotherhood.set(series.brotherhood_entity_id, series)
        continue
      }

      const priorityDifference = glorySeriesPriority(series) - glorySeriesPriority(current)
      const orderDifference = Number(series.display_order || 999) - Number(current.display_order || 999)
      if (priorityDifference < 0 || (priorityDifference === 0 && orderDifference < 0)) {
        glorySeriesByBrotherhood.set(series.brotherhood_entity_id, series)
      }
    }

    return filterPublicPageEntities(entities, brotherhoodRows).map((entity) => {
      const brotherhood = brotherhoodById.get(entity.id) || {}
      const municipality = municipalityById.get(brotherhood.municipality_id) || {}
      const place = placeById.get(brotherhood.canonical_see_place_id) || {}
      const glorySeries = glorySeriesByBrotherhood.get(entity.id) || {}
      return {
        id: entity.id, slug: entity.slug,
        nombrePopular: brotherhood.popular_name || entity.name,
        nombreOficial: brotherhood.official_name || entity.name,
        localidad: municipality.name || '', provincia: municipality.province || '', sede: place.name || '',
        barrio: brotherhood.neighborhood || '', diaSalida: brotherhood.current_procession_day || '',
        gloriaMes: glorySeries.month || null,
        gloriaFecha: glorySeries.date_rule || '',
        tipos: brotherhood.brotherhood_types || [], escudoPath: brotherhood.crest_path || null,
        resumen: entity.summary || '',
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de Hermandades desde Supabase', { error: error instanceof Error ? error.message : String(error) })
    if (throwOnError) throw error
    return []
  }
}
