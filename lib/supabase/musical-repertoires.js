import 'server-only'

import { cache } from 'react'
import { presentMusicalRepertoireIdentity } from '@/lib/musical-repertoires/presentation'
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

function publicEntityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function listeningProvider(url = '') {
  if (/spotify\.com/i.test(url)) return 'Spotify'
  if (/youtu(?:\.be|be\.com)/i.test(url)) return 'YouTube'
  return 'Audio'
}

function yearOf(outing) {
  return outing?.year || Number(String(outing?.outing_date || '').slice(0, 4)) || null
}

async function loadRepertoireRelations(supabase, repertoires, { includeEntries = true, enrichEntries = true } = {}) {
  if (!repertoires.length) return []

  const repertoireIds = repertoires.map((item) => item.id)
  const outingIds = unique(repertoires.map((item) => item.outing_id))
  const entityIds = unique(repertoires.flatMap((item) => [item.band_entity_id, item.step_entity_id]))
  const sourceIds = unique(repertoires.map((item) => item.source_id))

  const [entriesResult, outingsResult, sourcesResult] = await Promise.all([
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
    sourceIds.length
      ? supabase
          .from('sources')
          .select('id, name, url, author_or_publisher, publication_date, notes')
          .in('id', sourceIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const entries = rows(entriesResult, 'No se pudieron cargar las obras de la cruceta')
  const outings = rows(outingsResult, 'No se pudieron cargar las procesiones de las crucetas')
  const sources = rows(sourcesResult, 'No se pudieron cargar las fuentes de las crucetas')
  const outingById = byId(outings)
  const sourceById = byId(sources)
  const brotherhoodIds = unique(outings.map((outing) => outing.brotherhood_entity_id))
  const marchIds = unique(entries.map((entry) => entry.march_entity_id))

  const [marchProfilesResult, authorsResult, dedicationsResult, recordingsResult, tracksResult] = await Promise.all([
    enrichEntries && marchIds.length
      ? supabase.from('marches').select('entity_id, composition_year, composition_date_text, work_type, music_type').in('entity_id', marchIds)
      : Promise.resolve({ data: [], error: null }),
    enrichEntries && marchIds.length
      ? supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role, notes').in('march_entity_id', marchIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    enrichEntries && marchIds.length
      ? supabase.from('march_dedications').select('march_entity_id, dedicatee_entity_id, dedication_type, dedication_text').in('march_entity_id', marchIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    enrichEntries && marchIds.length
      ? supabase.from('march_recordings').select('id, march_entity_id, band_entity_id, youtube_video_id, external_url, title, is_featured, recording_date, recording_date_text').in('march_entity_id', marchIds).eq('status', 'published').order('is_featured', { ascending: false }).order('recording_date', { ascending: false, nullsFirst: false })
      : Promise.resolve({ data: [], error: null }),
    enrichEntries && marchIds.length
      ? supabase.from('band_release_tracks').select('id, release_id, march_entity_id, spotify_url').in('march_entity_id', marchIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const marchProfiles = rows(marchProfilesResult, 'No se pudieron cargar las fichas de las Marchas')
  const authors = rows(authorsResult, 'No se pudieron cargar las autorías de las Marchas')
  const dedications = rows(dedicationsResult, 'No se pudieron cargar las dedicatorias de las Marchas')
  const recordings = rows(recordingsResult, 'No se pudieron cargar las grabaciones de las Marchas')
  const tracks = rows(tracksResult, 'No se pudieron cargar las pistas relacionadas')
  const allEntityIds = unique([
    ...entityIds,
    ...brotherhoodIds,
    ...marchIds,
    ...authors.map((item) => item.agent_entity_id),
    ...dedications.map((item) => item.dedicatee_entity_id),
    ...recordings.map((item) => item.band_entity_id),
  ])
  const releaseIds = unique(tracks.map((item) => item.release_id))

  const [allEntitiesResult, releasesResult] = await Promise.all([
    allEntityIds.length
      ? supabase.from('entities').select('id, entity_type, name, slug, status').in('id', allEntityIds)
      : Promise.resolve({ data: [], error: null }),
    releaseIds.length
      ? supabase.from('band_releases').select('id, band_entity_id, title, status').in('id', releaseIds).eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
  ])

  const allEntities = rows(allEntitiesResult, 'No se pudieron cargar las entidades musicales relacionadas')
  const releases = rows(releasesResult, 'No se pudieron cargar los lanzamientos relacionados')
  const entityById = byId(allEntities)
  const marchEntityById = entityById
  const marchProfileById = new Map(marchProfiles.map((item) => [item.entity_id, item]))
  const relatedEntityById = entityById
  const releaseById = byId(releases)

  const [brotherhoodProfilesResult, bandProfilesResult, colorsResult] = await Promise.all([
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

  const brotherhoodProfiles = rows(brotherhoodProfilesResult, 'No se pudieron cargar los perfiles de Hermandad de las crucetas')
  const bandProfiles = rows(bandProfilesResult, 'No se pudieron cargar los perfiles de Banda de las crucetas')
  const colors = rows(colorsResult, 'No se pudieron cargar los colores de las crucetas')
  const brotherhoodEntityById = entityById
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
    const year = yearOf(outing)
    const identity = presentMusicalRepertoireIdentity({
      brotherhoodName: brotherhoodProfile.popular_name || brotherhoodEntity.name || '',
      outingTitle: outing.title || '',
      outingType: outing.outing_type || '',
      outingDate: outing.outing_date || '',
      year,
    })

    return {
      id: repertoire.id,
      slug: repertoire.slug,
      title: repertoire.title,
      kind: repertoire.repertoire_kind,
      notes: repertoire.notes || '',
      href: `/crucetas-musicales/${repertoire.slug}`,
      displayTitle: identity.title,
      moment: identity.moment,
      year,
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
      step: step ? {
        id: step.id,
        name: step.name,
        slug: step.status === 'published' ? step.slug || '' : '',
      } : null,
      source: sourceById.get(repertoire.source_id) || null,
      colors: { primary, accent },
      entries: repertoireEntries.map((entry) => {
        const marchEntity = marchEntityById.get(entry.march_entity_id) || {}
        const marchProfile = marchProfileById.get(entry.march_entity_id) || {}
        const marchAuthors = authors
          .filter((item) => item.march_entity_id === entry.march_entity_id)
          .map((item) => ({
            id: item.agent_entity_id,
            name: relatedEntityById.get(item.agent_entity_id)?.name || '',
            role: item.author_role || '',
            notes: item.notes || '',
          }))
          .filter((item) => item.name)
        const marchDedications = dedications
          .filter((item) => item.march_entity_id === entry.march_entity_id)
          .map((item) => {
            const dedicatee = relatedEntityById.get(item.dedicatee_entity_id)
            return {
              id: item.dedicatee_entity_id,
              name: dedicatee?.name || item.dedication_text || '',
              text: item.dedication_text || '',
              type: item.dedication_type || '',
              href: publicEntityHref(dedicatee),
            }
          })
          .filter((item) => item.name || item.text)
        const featuredRecording = recordings.find((item) => item.march_entity_id === entry.march_entity_id && (item.youtube_video_id || item.external_url))
        const spotifyTrack = tracks.find((item) => item.march_entity_id === entry.march_entity_id && item.spotify_url && releaseById.has(item.release_id))
        const listeningUrl = featuredRecording?.youtube_video_id
          ? `https://www.youtube.com/watch?v=${featuredRecording.youtube_video_id}`
          : featuredRecording?.external_url || spotifyTrack?.spotify_url || ''

        return {
          id: entry.id,
          marchId: entry.march_entity_id,
          marchSlug: marchEntity.slug || '',
          marchHref: marchEntity.status === 'published' && marchEntity.slug ? `/marchas/${marchEntity.slug}` : '',
          title: entry.display_title,
          catalogTitle: marchEntity.name || entry.display_title,
          credit: entry.source_credit || '',
          count: entry.performance_count,
          displayOrder: entry.display_order,
          notes: entry.notes || '',
          workType: marchProfile.work_type || '',
          musicType: marchProfile.music_type || '',
          compositionYear: marchProfile.composition_year || marchProfile.composition_date_text || '',
          authors: marchAuthors,
          dedications: marchDedications,
          listening: listeningUrl ? {
            url: listeningUrl,
            provider: listeningProvider(listeningUrl),
            title: featuredRecording?.title || releaseById.get(spotifyTrack?.release_id)?.title || '',
          } : null,
        }
      }),
      worksCount: repertoireEntries.length,
      performancesCount: repertoireEntries.reduce((total, entry) => total + entry.performance_count, 0),
    }
  })
}

function publicRepertoireQuery(supabase) {
  return supabase
    .from('musical_repertoires')
    .select('id, slug, outing_id, band_entity_id, step_entity_id, source_id, title, repertoire_kind, notes, status')
    .eq('repertoire_kind', 'performed')
    .eq('status', 'published')
}

export const getMusicalRepertoireBySlug = cache(async function getMusicalRepertoireBySlug(slug) {
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
})

export async function getMusicalRepertoires({ brotherhoodEntityId = '', bandEntityId = '', throwOnError = false } = {}) {
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
    const enriched = await loadRepertoireRelations(supabase, result.data || [], { enrichEntries: false })
    return enriched.sort((first, second) => (second.date || '').localeCompare(first.date || ''))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las crucetas musicales relacionadas', {
      brotherhoodEntityId,
      bandEntityId,
      error: error instanceof Error ? error.message : String(error),
    })
    if (throwOnError) throw error
    return []
  }
}
