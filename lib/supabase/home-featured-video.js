import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function youtubeVideoId(value = '') {
  const match = String(value || '').trim().match(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/].*)?$/
  )
  return match?.[1] || ''
}

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function detailHref(outing, brotherhood) {
  if (outing?.slug && normalized(outing.outing_type).includes('rosario')) {
    return `/agenda-cofrade/rosarios/${outing.slug}`
  }
  if (brotherhood?.status === 'published' && brotherhood?.slug) {
    return `/hermandades/${brotherhood.slug}`
  }
  return '/agenda-cofrade'
}

export async function getHomeFeaturedVideo() {
  try {
    const supabase = createPublicClient()
    const today = madridDateKey()

    const outingsResult = await supabase
      .from('outings')
      .select('id, title, outing_type, outing_date, departure_time, municipality_id, brotherhood_entity_id, slug, event_status')
      .eq('status', 'published')
      .eq('outing_date', today)
      .neq('event_status', 'cancelled')
      .order('departure_time', { ascending: true, nullsFirst: false })

    if (outingsResult.error) throw outingsResult.error
    const outings = outingsResult.data || []
    if (!outings.length) return null

    const mediaResult = await supabase
      .from('outing_media')
      .select('outing_id, sort_order, media_assets(id, storage_path, media_type, title, caption, alt_text, author_name, source_name, source_url)')
      .in('outing_id', outings.map((item) => item.id))
      .order('sort_order')

    if (mediaResult.error) throw mediaResult.error

    const mediaByOuting = new Map()
    for (const link of mediaResult.data || []) {
      const media = relationOne(link.media_assets)
      const videoId = youtubeVideoId(media?.storage_path || media?.source_url)
      if (!videoId || media?.media_type !== 'video' || mediaByOuting.has(link.outing_id)) continue
      mediaByOuting.set(link.outing_id, { ...media, videoId })
    }

    const outing = outings.find((item) => mediaByOuting.has(item.id))
    if (!outing) return null

    const media = mediaByOuting.get(outing.id)
    const [brotherhoodResult, municipalityResult] = await Promise.all([
      outing.brotherhood_entity_id
        ? supabase.from('entities').select('id, name, slug, status').eq('id', outing.brotherhood_entity_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      outing.municipality_id
        ? supabase.from('municipalities').select('id, name').eq('id', outing.municipality_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ])

    if (brotherhoodResult.error) throw brotherhoodResult.error
    if (municipalityResult.error) throw municipalityResult.error

    const brotherhood = brotherhoodResult.data || null

    return {
      id: outing.id,
      title: outing.title || media.title || 'Retransmisión cofrade',
      outingType: outing.outing_type || '',
      time: outing.departure_time ? String(outing.departure_time).slice(0, 5) : '',
      municipality: municipalityResult.data?.name || '',
      brotherhoodName: brotherhood?.name || media.author_name || '',
      href: detailHref(outing, brotherhood),
      videoId: media.videoId,
      videoTitle: media.title || outing.title || 'Retransmisión cofrade',
      description: media.caption || media.alt_text || '',
      author: media.author_name || '',
      sourceUrl: media.source_url || `https://www.youtube.com/watch?v=${media.videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(media.videoId)}?rel=0`,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] Retransmisión de portada omitida temporalmente', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
