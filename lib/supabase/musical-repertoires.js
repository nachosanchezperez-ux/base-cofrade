import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function byId(items) {
  return new Map(items.map((item) => [item.id, item]))
}

function yearOf(outing) {
  return outing?.year || Number(String(outing?.outing_date || '').slice(0, 4)) || null
}

async function loadRepertoireRelations(supabase, repertoires, { includeEntries = true } = {}) {
  if (!repertoires.length) return []

  const repertoireIds = repertoires.map((item) => item.id)
  const outingIds = unique(repertoires.map((item) => item.outing_id))
  const entityIds = unique(repertoires.flatMap((item) => [item.band_entity_id, item.step_entity_id]))
  const sourceIds = unique(repertoires.map((item) => item.source_id))

  const [entriesResult, outingsResult, entitiesResult, sourcesResult] = await Promise.all([
    includeEntries
      ? supabase
          .from('musical_repertoire_entries')
          .select('id, repertoire_id, march_entity_id, display_title, source_credit, performance_count, display_order, notes')
          .in('repertoire_id', repertoireIds)
          .order('display_order')
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('outings')
      .select('id, brotherhood_entity_id, title, outing_type, outing_date, year, event_status, municipality_id')
      .in('id', outingIds),
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .in('id', entityIds),
    sourceIds.length
      ? supabase
          .from('sources')
          .select('id, name, url, author_or_publisher, publication_date, notes')
          .in('id', sourceIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const entries = rows(entriesResult, 'No se pudieron cargar las obras de la cruceta')
  const outings = rows(outingsResult, 'No se pudieron cargar las procesiones de las crucetas')
  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades de las crucetas')
  const sources = rows(sourcesResult, 'No se pudieron cargar las fuentes de las crucetas')
  const outingById = byId(outings)
  const entityById = byId(entities)
  const sourceById = byId(sources)
  const brotherhoodIds = unique(outings.map((outing) => outing.brotherhood_entity_id))

  const [brotherhoodEntitiesResult, brotherhoodProfilesResult, bandProfilesResult, colorsResult] = await Promise.all([
    brotherhoodIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug, status')
          .in('id', brotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
    brotherhoodIds.length
      ? supabase
          .from('brotherhoods')
          .select('entity_id, popular_name, official_name')
          .in('entity_id', brotherhoodIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('bands')
      .select('entity_id, logo_path, primary_color, secondary_color')
      .in('entity_id', unique(repertoires.map((item) => item.band_entity_id))),
    brotherhoodIds.length
      ? supabase
          .from('brotherhood_colors')
          .select('brotherhood_entity_id, color_role, hex_value, sort_order')
          .in('brotherhood_entity_id', brotherhoodIds)
          .eq('status', 'published')
          .order('sort_order')
      : Promise.resolve({ data: [], error: null }),
  ])

  const brotherhoodEntities = rows(brotherhoodEntitiesResult, 'No se pudieron cargar las Hermandades de las crucetas')
  const brotherhoodProfiles = rows(brotherhoodProfilesResult, 'No se pudieron cargar los perfiles de Hermandad de las crucetas')
  const bandProfiles = rows(bandProfilesResult, 'No se pudieron cargar los perfiles de Banda de las crucetas')
  const colors = rows(colorsResult, 'No se pudieron cargar los colores de las crucetas')
  const brotherhoodEntityById = byId(brotherhoodEntities)
  const brotherhoodProfileById = new Map(brotherhoodProfiles.map((item) => [item.entity_id, item]))
  const bandProfileById = new Map(bandProfiles.map((item) => [item.entity_id, item]))

  return repertoires.map((repertoire) => {
    const outing = outingById.get(repertoire.outing_id) || {}
    const band = entityById.get(repertoire.band_entity_id) || {}
    const step = entityById.get(repertoire.step_entity_id) || null
    const brotherhoodEntity = brotherhoodEntityById.get(outing.brotherhood_entity_id) || {}
    const brotherhoodProfile = brotherhoodProfileById.get(outing.brotherhood_entity_id) || {}
    const bandProfile = bandProfileById.get(repertoire.band_entity_id) || {}
    const repertoireEntries = entries.filter((entry) => entry.repertoire_id === repertoire.id)
    const brotherhoodColors = colors.filter((color) => color.brotherhood_entity_id === outing.brotherhood_entity_id)
    const primary = brotherhoodColors.find((color) => color.color_role === 'primary')?.hex_value
      || brotherhoodColors[0]?.hex_value
      || bandProfile.primary_color
      || '#31513b'
    const accent = brotherhoodColors.find((color) => color.color_role === 'accent')?.hex_value
      || brotherhoodColors.find((color) => color.color_role === 'secondary')?.hex_value
      || bandProfile.secondary_color
      || '#c59a42'

    return {
      id: repertoire.id,
      slug: repertoire.slug,
      title: repertoire.title,
      kind: repertoire.repertoire_kind,
      notes: repertoire.notes || '',
      href: `/crucetas-musicales/${repertoire.slug}`,
      year: yearOf(outing),
      date: outing.outing_date,
      outing: {
        id: outing.id,
        title: outing.title || outing.outing_type || 'Procesión',
        type: outing.outing_type || '',
        status: outing.event_status || '',
      },
      brotherhood: {
        id: brotherhoodEntity.id,
        name: brotherhoodProfile.popular_name || brotherhoodEntity.name || '',
        officialName: brotherhoodProfile.official_name || '',
        slug: brotherhoodEntity.slug || '',
        href: brotherhoodEntity.slug ? `/hermandades/${brotherhoodEntity.slug}` : '',
      },
      band: {
        id: band.id,
        name: band.name || '',
        slug: band.slug || '',
        href: band.slug ? `/bandas/${band.slug}` : '',
        logoPath: bandProfile.logo_path || '',
      },
      step: step ? { id: step.id, name: step.name, slug: step.slug || '' } : null,
      source: sourceById.get(repertoire.source_id) || null,
      colors: { primary, accent },
      entries: repertoireEntries.map((entry) => ({
        id: entry.id,
        marchId: entry.march_entity_id,
        title: entry.display_title,
        credit: entry.source_credit || '',
        count: entry.performance_count,
        displayOrder: entry.display_order,
        notes: entry.notes || '',
      })),
      worksCount: repertoireEntries.length,
      performancesCount: repertoireEntries.reduce((total, entry) => total + entry.performance_count, 0),
    }
  })
}

function publicRepertoireQuery(supabase) {
  return supabase
    .from('musical_repertoires')
    .select('id, slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind, notes, status')
    .eq('status', 'published')
}

export async function getMusicalRepertoireBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const result = await publicRepertoireQuery(supabase).eq('slug', slug).maybeSingle()
    if (result.error) throw result.error
    if (!result.data) return null
    const [repertoire] = await loadRepertoireRelations(supabase, [result.data])
    return repertoire || null
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la cruceta musical', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

export async function getMusicalRepertoires({ brotherhoodEntityId = '', bandEntityId = '' } = {}) {
  try {
    const supabase = createPublicClient()
    let query = publicRepertoireQuery(supabase)

    if (bandEntityId) query = query.eq('band_entity_id', bandEntityId)

    if (brotherhoodEntityId) {
      const outings = rows(
        await supabase
          .from('outings')
          .select('id')
          .eq('brotherhood_entity_id', brotherhoodEntityId)
          .eq('status', 'published'),
        'No se pudieron localizar las salidas de la Hermandad para sus crucetas'
      )
      if (!outings.length) return []
      query = query.in('outing_id', outings.map((outing) => outing.id))
    }

    const result = await query
    if (result.error) throw result.error
    const enriched = await loadRepertoireRelations(supabase, result.data || [])
    return enriched.sort((first, second) => (second.date || '').localeCompare(first.date || ''))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las crucetas musicales relacionadas', {
      brotherhoodEntityId,
      bandEntityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
