import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function byId(rows = []) {
  return new Map(rows.map((row) => [row.id, row]))
}

export async function getBandDiscography(bandEntityId) {
  if (!bandEntityId) return []

  try {
    const supabase = createPublicClient()
    const [releasesResult, spotifyArtistResult, bandNameResult, bandEntityResult, bandProfileResult] = await Promise.all([
      supabase
        .from('band_releases')
        .select('*')
        .eq('band_entity_id', bandEntityId)
        .eq('status', 'published')
        .order('release_year', { ascending: false, nullsFirst: false })
        .order('release_date', { ascending: false, nullsFirst: false }),
      supabase
        .from('entity_social_links')
        .select('url')
        .eq('entity_id', bandEntityId)
        .eq('platform', 'spotify')
        .eq('is_public', true)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('band_names')
        .select('name')
        .eq('band_entity_id', bandEntityId)
        .eq('name_type', 'popular')
        .eq('is_current', true)
        .limit(1)
        .maybeSingle(),
      supabase.from('entities').select('name').eq('id', bandEntityId).eq('entity_type', 'band').maybeSingle(),
      supabase.from('bands').select('logo_path').eq('entity_id', bandEntityId).maybeSingle(),
    ])

    if (releasesResult.error) {
      if (releasesResult.error.code === '42P01' || releasesResult.error.code === 'PGRST205') return []
      throw releasesResult.error
    }
    if (spotifyArtistResult.error) throw spotifyArtistResult.error
    if (bandNameResult.error) throw bandNameResult.error
    if (bandEntityResult.error) throw bandEntityResult.error
    if (bandProfileResult.error) throw bandProfileResult.error

    const releases = releasesResult.data || []
    if (!releases.length) return []
    const artistSpotifyUrl = spotifyArtistResult.data?.url || ''
    const bandName = bandNameResult.data?.name || bandEntityResult.data?.name || ''
    const bandLogoPath = bandProfileResult.data?.logo_path || ''

    const releaseIds = releases.map((release) => release.id)
    const tracksResult = await supabase
      .from('band_release_tracks')
      .select('*')
      .in('release_id', releaseIds)
      .order('sequence_no')

    if (tracksResult.error) throw tracksResult.error
    const tracks = tracksResult.data || []
    const marchIds = unique(tracks.map((track) => track.march_entity_id))

    const [marchEntitiesResult, marchAuthorsResult, dedicationsResult] = await Promise.all([
      marchIds.length
        ? supabase.from('entities').select('id, name, slug, status').in('id', marchIds)
        : Promise.resolve({ data: [], error: null }),
      marchIds.length
        ? supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role, status').in('march_entity_id', marchIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      marchIds.length
        ? supabase.from('march_dedications').select('march_entity_id, dedicatee_entity_id, dedication_type, dedication_text, status').in('march_entity_id', marchIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
    ])

    if (marchEntitiesResult.error) throw marchEntitiesResult.error
    if (marchAuthorsResult.error) throw marchAuthorsResult.error
    if (dedicationsResult.error) throw dedicationsResult.error

    const marchEntities = marchEntitiesResult.data || []
    const marchAuthors = marchAuthorsResult.data || []
    const dedications = dedicationsResult.data || []
    const agentIds = unique(marchAuthors.map((author) => author.agent_entity_id))
    const dedicateeIds = unique(dedications.map((dedication) => dedication.dedicatee_entity_id))

    const [agentsResult, dedicateesResult] = await Promise.all([
      agentIds.length
        ? supabase.from('entities').select('id, name, slug, status').in('id', agentIds)
        : Promise.resolve({ data: [], error: null }),
      dedicateeIds.length
        ? supabase.from('entities').select('id, name, slug, entity_type, status').in('id', dedicateeIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    if (agentsResult.error) throw agentsResult.error
    if (dedicateesResult.error) throw dedicateesResult.error

    const marchById = byId(marchEntities)
    const agentById = byId(agentsResult.data || [])
    const dedicateeById = byId(dedicateesResult.data || [])

    return releases.map((release) => ({
      id: release.id,
      title: release.title,
      type: release.release_type,
      year: release.release_year,
      date: release.release_date,
      dateText: release.release_date_text || '',
      ordinalNumber: release.ordinal_number,
      description: release.description || '',
      coverImagePath: release.cover_image_path || '',
      coverImageAlt: release.cover_image_alt || release.title,
      coverImageCredit: release.cover_image_credit || '',
      spotifyUrl: release.spotify_url || '',
      externalUrl: release.external_url || '',
      artistSpotifyUrl,
      bandName,
      bandLogoPath,
      tracks: tracks
        .filter((track) => track.release_id === release.id)
        .map((track) => {
          const march = marchById.get(track.march_entity_id)
          const composers = marchAuthors
            .filter((author) => author.march_entity_id === track.march_entity_id && author.author_role === 'composer')
            .map((author) => agentById.get(author.agent_entity_id))
            .filter(Boolean)
          const marchDedications = dedications
            .filter((dedication) => dedication.march_entity_id === track.march_entity_id)
            .map((dedication) => {
              const dedicatee = dedicateeById.get(dedication.dedicatee_entity_id)
              return {
                id: dedicatee?.id || dedication.dedicatee_entity_id,
                name: dedicatee?.name || dedication.dedication_text || '',
                slug: dedicatee?.status === 'published' ? dedicatee.slug || '' : '',
                entityType: dedicatee?.entity_type || '',
                text: dedication.dedication_text || '',
              }
            })
            .filter((item) => item.name || item.text)

          return {
            id: track.id,
            sequenceNo: track.sequence_no,
            title: march?.name || track.title,
            marchSlug: march?.status === 'published' ? march.slug || '' : '',
            durationText: track.duration_text || '',
            spotifyUrl: track.spotify_url || '',
            composers: composers.map((composer) => ({
              id: composer.id,
              name: composer.name,
              slug: composer.status === 'published' ? composer.slug || '' : '',
            })),
            dedications: marchDedications,
          }
        }),
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la discografía de la banda', {
      bandEntityId,
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
