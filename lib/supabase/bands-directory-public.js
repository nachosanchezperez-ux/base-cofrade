import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function currentName(names, type) {
  return names.find((item) => item.name_type === type && item.is_current)
    || names.find((item) => item.name_type === type)
}

export async function getPublicBandsDirectory() {
  try {
    const supabase = createPublicClient()
    const entities = assertQuery(
      await supabase
        .from('entities')
        .select('id, name, slug, summary')
        .eq('entity_type', 'band')
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudo consultar el directorio público de bandas'
    )

    if (!entities.length) return []

    const ids = entities.map((item) => item.id)
    const [bandsResult, namesResult, relationsResult] = await Promise.all([
      supabase.from('bands').select('*').in('entity_id', ids),
      supabase.from('band_names').select('*').in('band_entity_id', ids).order('is_current', { ascending: false }),
      supabase
        .from('entity_relations')
        .select('source_entity_id, target_entity_id, relation_type')
        .in('source_entity_id', ids)
        .in('relation_type', ['belongs_to_brotherhood', 'associated_with_brotherhood'])
        .eq('status', 'published'),
    ])

    const bandRows = assertQuery(bandsResult, 'No se pudieron consultar las fichas públicas de bandas')
    const nameRows = assertQuery(namesResult, 'No se pudieron consultar los nombres públicos de bandas')
    const relationRows = assertQuery(relationsResult, 'No se pudieron consultar las vinculaciones públicas de bandas')
    const municipalityIds = unique(bandRows.map((item) => item.municipality_id))
    const linkedBrotherhoodIds = unique(relationRows.map((item) => item.target_entity_id))

    const [municipalities, linkedBrotherhoods] = await Promise.all([
      municipalityIds.length
        ? assertQuery(
            await supabase.from('municipalities').select('id, name, slug, province').in('id', municipalityIds),
            'No se pudieron consultar las localidades públicas de bandas'
          )
        : [],
      linkedBrotherhoodIds.length
        ? assertQuery(
            await supabase.from('entities').select('id, name, slug, status').in('id', linkedBrotherhoodIds),
            'No se pudieron consultar las hermandades vinculadas a bandas'
          )
        : [],
    ])

    const bandById = new Map(bandRows.map((row) => [row.entity_id, row]))
    const municipalityById = new Map(municipalities.map((row) => [row.id, row]))
    const brotherhoodById = new Map(linkedBrotherhoods.map((row) => [row.id, row]))

    return entities.map((entity) => {
      const band = bandById.get(entity.id) || {}
      const bandNames = nameRows.filter((name) => name.band_entity_id === entity.id)
      const official = currentName(bandNames, 'official')
      const popular = currentName(bandNames, 'popular')
      const municipality = municipalityById.get(band.municipality_id) || {}
      const entityRelations = relationRows.filter((item) => item.source_entity_id === entity.id)
      const linkedRelation = entityRelations.find((item) => item.relation_type === 'belongs_to_brotherhood')
        || entityRelations.find((item) => item.relation_type === 'associated_with_brotherhood')
      const linkedBrotherhood = brotherhoodById.get(linkedRelation?.target_entity_id) || null

      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        popularName: popular?.name || entity.name,
        officialName: official?.name || entity.name,
        officialShortName: official?.short_name || '',
        summary: entity.summary || '',
        type: band.band_type || 'Formación musical',
        typeSlug: slugify(band.band_type || 'Formación musical'),
        municipality: municipality.name || 'Localidad por documentar',
        municipalitySlug: municipality.slug || '',
        province: municipality.province || '',
        foundation: band.foundation_text || '',
        linkedBrotherhood: linkedBrotherhood?.name || band.linked_brotherhood_name || '',
        primaryColor: band.primary_color || '#63358B',
        secondaryColor: band.secondary_color || '#29272C',
        logoPath: band.logo_path || '',
      }
    })
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar el directorio público de bandas con cliente anónimo', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
