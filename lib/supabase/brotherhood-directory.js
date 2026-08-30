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

export async function getHermandadesDirectory() {
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
    const brotherhoodRows = assertRows(
      await supabase
        .from('brotherhoods')
        .select('entity_id, official_name, popular_name, municipality_id, canonical_see_place_id, neighborhood, crest_path, brotherhood_types, current_procession_day')
        .in('entity_id', entityIds),
      'No se pudieron consultar los datos del directorio de Hermandades'
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

    return filterPublicPageEntities(entities, brotherhoodRows).map((entity) => {
      const brotherhood = brotherhoodById.get(entity.id) || {}
      const municipality = municipalityById.get(brotherhood.municipality_id) || {}
      const place = placeById.get(brotherhood.canonical_see_place_id) || {}
      return {
        id: entity.id, slug: entity.slug,
        nombrePopular: brotherhood.popular_name || entity.name,
        nombreOficial: brotherhood.official_name || entity.name,
        localidad: municipality.name || '', provincia: municipality.province || '', sede: place.name || '',
        barrio: brotherhood.neighborhood || '', diaSalida: brotherhood.current_procession_day || '',
        tipos: brotherhood.brotherhood_types || [], escudoPath: brotherhood.crest_path || null,
        resumen: entity.summary || '',
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio de Hermandades desde Supabase', { error: error instanceof Error ? error.message : String(error) })
    return []
  }
}
