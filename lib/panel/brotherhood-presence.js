import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function getBrotherhoodPresenceData(id) {
  const supabase = await createClient()
  const entity = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', id)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    'No se pudo cargar la Hermandad'
  )
  if (!entity) return null

  const [brotherhoodResult, municipalitiesResult, placesResult, socialLinksResult] = await Promise.all([
    supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, municipality_id, canonical_see_place_id')
      .eq('entity_id', id)
      .maybeSingle(),
    supabase
      .from('municipalities')
      .select('id, name, slug, province, autonomous_community, country')
      .order('name'),
    supabase
      .from('places')
      .select('id, municipality_id, name, slug, place_type, address, opening_hours_text, opening_hours_verified_at')
      .order('name'),
    supabase
      .from('entity_social_links')
      .select('id, platform, url, label, display_order, is_public')
      .eq('entity_id', id)
      .order('display_order')
      .order('platform'),
  ])

  const brotherhood = assertQuery(brotherhoodResult, 'No se pudo cargar la ficha de la Hermandad')
  if (!brotherhood) return null

  const municipalities = assertQuery(municipalitiesResult, 'No se pudieron cargar las localidades') || []
  const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
  const places = (assertQuery(placesResult, 'No se pudieron cargar los Lugares') || []).map((place) => ({
    ...place,
    municipality: municipalityById.get(place.municipality_id) || null,
  }))

  return {
    entity,
    brotherhood,
    municipalities,
    places,
    socialLinks: assertQuery(socialLinksResult, 'No se pudieron cargar los enlaces oficiales') || [],
  }
}
