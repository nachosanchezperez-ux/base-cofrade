import 'server-only'

import { createClient } from '@/lib/supabase/server'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getPanelMasterData() {
  const supabase = await createClient()
  const [advocationEntitiesResult, advocationsResult, municipalitiesResult, placesResult, imagesResult, mediaResult, sourceLinksResult] = await Promise.all([
    supabase.from('entities').select('id, name, slug, summary, status, updated_at').eq('entity_type', 'advocation').order('name'),
    supabase.from('advocations').select('entity_id, advocation_type, description'),
    supabase.from('municipalities').select('id, name, slug, province, autonomous_community, country, created_at').order('name'),
    supabase.from('places').select('id, municipality_id, name, slug, place_type, address, latitude, longitude, notes, opening_hours_text, opening_hours_verified_at, updated_at').order('name'),
    supabase.from('images').select('entity_id, advocation_entity_id').not('advocation_entity_id', 'is', null),
    supabase.from('entity_media').select('entity_id').in('entity_id', []),
    supabase.from('source_links').select('entity_id').not('entity_id', 'is', null),
  ])

  const entities = rows(advocationEntitiesResult, 'No se pudieron cargar las Advocaciones')
  const advocations = rows(advocationsResult, 'No se pudieron cargar los datos de Advocaciones')
  const municipalities = rows(municipalitiesResult, 'No se pudieron cargar los Municipios')
  const places = rows(placesResult, 'No se pudieron cargar los Lugares')
  const images = rows(imagesResult, 'No se pudieron cargar las Imágenes vinculadas')
  const sourceLinks = rows(sourceLinksResult, 'No se pudieron cargar las Fuentes vinculadas')

  const entityIds = entities.map((item) => item.id)
  const media = entityIds.length
    ? rows(await supabase.from('entity_media').select('entity_id').in('entity_id', entityIds), 'No se pudo cargar el Multimedia de Advocaciones')
    : []
  const subtypeById = new Map(advocations.map((item) => [item.entity_id, item]))

  return {
    advocations: entities.map((entity) => {
      const subtype = subtypeById.get(entity.id) || {}
      return {
        ...entity,
        advocation_type: subtype.advocation_type || '',
        description: subtype.description || '',
        imageCount: images.filter((item) => item.advocation_entity_id === entity.id).length,
        mediaCount: media.filter((item) => item.entity_id === entity.id).length,
        sourceCount: sourceLinks.filter((item) => item.entity_id === entity.id).length,
      }
    }),
    municipalities,
    places,
  }
}
