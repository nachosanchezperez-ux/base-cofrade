function hasText(value) {
  return Boolean(String(value || '').trim())
}

function dayNumber(dateKey) {
  const [year, month, day] = String(dateKey || '').split('-').map(Number)
  if (!year || !month || !day) return 0
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000)
}

export function buildDailyMarchCandidates({
  profiles,
  entities,
  authors,
  recordings,
  tracks,
  publishedComposers,
  publishedReleases,
  dateKey,
}) {
  const publishedComposerIds = new Set(publishedComposers.map((item) => item.id))
  const marchesWithComposer = new Set(
    authors
      .filter((item) => publishedComposerIds.has(item.agent_entity_id))
      .map((item) => item.march_entity_id)
  )
  const marchesWithRecording = new Set(
    recordings
      .filter((item) => hasText(item.youtube_video_id) || hasText(item.external_url))
      .map((item) => item.march_entity_id)
  )
  const publishedReleaseIds = new Set(publishedReleases.map((item) => item.id))
  const marchesWithTrack = new Set(
    tracks
      .filter((item) => hasText(item.spotify_url) && publishedReleaseIds.has(item.release_id))
      .map((item) => item.march_entity_id)
  )
  const entityById = new Map(entities.map((item) => [item.id, item]))

  const eligible = profiles
    .filter((profile) => entityById.has(profile.entity_id))
    .filter((profile) => marchesWithComposer.has(profile.entity_id))
    .filter((profile) => (
      hasText(profile.youtube_video_id)
      || marchesWithRecording.has(profile.entity_id)
      || marchesWithTrack.has(profile.entity_id)
    ))
    .sort((a, b) => a.entity_id.localeCompare(b.entity_id))

  if (!eligible.length) return []
  const rotationIndex = ((dayNumber(dateKey) % eligible.length) + eligible.length) % eligible.length

  return eligible.map((profile, index) => ({
    entity_id: profile.entity_id,
    name: entityById.get(profile.entity_id)?.name || '',
    composition_year: profile.composition_year,
    composition_date_text: profile.composition_date_text,
    youtube_video_id: profile.youtube_video_id,
    daily_priority: index === rotationIndex
      ? 32_767
      : Math.min(Number(profile.daily_priority) || 0, 32_766),
  }))
}
