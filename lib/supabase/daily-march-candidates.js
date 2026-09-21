import 'server-only'

import { buildDailyMarchCandidates } from '@/lib/daily-march-selection'
import { loadPublicRowsInBatches } from '@/lib/supabase/public-query-batches'

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export async function getDailyMarchCandidates(supabase, dateKey) {
  const profiles = rows(
    await supabase
      .from('marches')
      .select('entity_id, composition_year, composition_date_text, youtube_video_id, daily_priority')
      .eq('eligible_for_daily', true),
    'No se pudieron consultar las Marchas elegibles del día'
  )
  const marchIds = unique(profiles.map((item) => item.entity_id))
  if (!marchIds.length) return []

  const [entities, authors, recordings, tracks] = await Promise.all([
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('entities')
        .select('id, name')
        .in('id', ids)
        .eq('entity_type', 'march')
        .eq('status', 'published'),
      'No se pudieron validar las Marchas publicadas'
    ),
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('march_authors')
        .select('march_entity_id, agent_entity_id')
        .in('march_entity_id', ids)
        .eq('author_role', 'composer'),
      'No se pudieron validar los compositores de las Marchas'
    ),
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('march_recordings')
        .select('march_entity_id, youtube_video_id, external_url')
        .in('march_entity_id', ids)
        .eq('status', 'published'),
      'No se pudieron validar las grabaciones de las Marchas'
    ),
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('band_release_tracks')
        .select('march_entity_id, release_id, spotify_url')
        .in('march_entity_id', ids),
      'No se pudieron validar las pistas de las Marchas'
    ),
  ])

  const composerIds = unique(authors.map((item) => item.agent_entity_id))
  const releaseIds = unique(
    tracks
      .filter((item) => String(item.spotify_url || '').trim())
      .map((item) => item.release_id)
  )
  const [publishedComposers, publishedReleases] = await Promise.all([
    loadPublicRowsInBatches(
      composerIds,
      (ids) => supabase
        .from('entities')
        .select('id')
        .in('id', ids)
        .eq('status', 'published'),
      'No se pudieron validar los compositores publicados'
    ),
    loadPublicRowsInBatches(
      releaseIds,
      (ids) => supabase
        .from('band_releases')
        .select('id')
        .in('id', ids)
        .eq('status', 'published'),
      'No se pudieron validar los lanzamientos publicados'
    ),
  ])

  return buildDailyMarchCandidates({
    profiles,
    entities,
    authors,
    recordings,
    tracks,
    publishedComposers,
    publishedReleases,
    dateKey,
  })
}
