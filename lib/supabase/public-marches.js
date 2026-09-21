import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { createPublicClient } from '@/lib/supabase/public'
import { publicErrorMessage } from '@/lib/supabase/public-error'
import {
  loadPublicRowsInBatches,
  loadPublicRowsInPages,
} from '@/lib/supabase/public-query-batches'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function byId(items = []) {
  return new Map(items.map((item) => [item.id, item]))
}

function entityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function provider(url = '') {
  if (/spotify\.com/i.test(url)) return 'Spotify'
  if (/youtu(?:\.be|be\.com)/i.test(url)) return 'YouTube'
  return 'Audio'
}

function uniqueListenings(items) {
  return [...new Map(items.filter((item) => item.url).map((item) => [item.url, item])).values()]
}

export const getPublicMarchSitemapEntries = cache(async function getPublicMarchSitemapEntries() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL
    || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (process.env.VERCEL) {
      throw new Error('Falta la configuración pública de Supabase para generar el sitemap de Marchas')
    }
    return []
  }

  const supabase = createPublicClient()
  const rows = await loadPublicRowsInPages(
    (from, to) => supabase
      .from('entities')
      .select('id, slug, updated_at')
      .eq('entity_type', 'march')
      .eq('status', 'published')
      .not('slug', 'is', null)
      .order('id')
      .range(from, to),
    'No se pudieron consultar las Marchas del sitemap'
  )

  return rows
    .filter((item) => item.slug)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      updatedAt: item.updated_at || null,
    }))
})

export const getPublicMarchDirectory = cache(async function getPublicMarchDirectory() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL
    || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (process.env.VERCEL) {
      throw new Error('Falta la configuración pública de Supabase para generar el directorio de Marchas')
    }
    return []
  }

  const supabase = createPublicClient()
  const entities = await loadPublicRowsInPages(
    (from, to) => supabase
      .from('entities')
      .select('id, name, slug, summary, updated_at')
      .eq('entity_type', 'march')
      .eq('status', 'published')
      .not('slug', 'is', null)
      .order('name')
      .order('id')
      .range(from, to),
    'No se pudieron consultar las Marchas del directorio'
  )
  const marchIds = entities.map((item) => item.id)

  const [profiles, authors] = await Promise.all([
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('marches')
        .select('entity_id, composition_year, composition_date_text, work_type, music_type')
        .in('entity_id', ids),
      'No se pudieron consultar las fichas del directorio de Marchas'
    ),
    loadPublicRowsInBatches(
      marchIds,
      (ids) => supabase
        .from('march_authors')
        .select('march_entity_id, agent_entity_id, author_role')
        .in('march_entity_id', ids)
        .eq('status', 'published'),
      'No se pudieron consultar las autorías del directorio de Marchas'
    ),
  ])
  const agentIds = unique(authors.map((item) => item.agent_entity_id))
  const agents = await loadPublicRowsInBatches(
    agentIds,
    (ids) => supabase
      .from('entities')
      .select('id, name')
      .in('id', ids)
      .eq('status', 'published'),
    'No se pudieron consultar los autores del directorio de Marchas'
  )
  const profileById = new Map(profiles.map((item) => [item.entity_id, item]))
  const agentById = byId(agents)
  const authorsByMarch = new Map()

  for (const relation of authors) {
    const author = agentById.get(relation.agent_entity_id)
    if (!author?.name) continue
    const current = authorsByMarch.get(relation.march_entity_id) || []
    current.push({ id: author.id, name: author.name, role: relation.author_role || '' })
    authorsByMarch.set(relation.march_entity_id, current)
  }

  return entities
    .filter((item) => item.slug && item.name)
    .map((item) => {
      const profile = profileById.get(item.id) || {}
      const allAuthors = authorsByMarch.get(item.id) || []
      const composers = allAuthors.filter((author) => author.role === 'composer')
      return {
        id: item.id,
        slug: item.slug,
        href: `/marchas/${item.slug}`,
        name: item.name,
        summary: item.summary || '',
        workType: profile.work_type || 'Marcha procesional',
        musicType: profile.music_type || '',
        compositionYear: profile.composition_year || profile.composition_date_text || '',
        authors: composers.length ? composers : allAuthors,
        updatedAt: item.updated_at || null,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
})

async function loadPublicMarchBySlug(slug) {
  try {
    const supabase = createPublicClient()
    const entityResult = await supabase
      .from('entities')
      .select('id, entity_type, name, slug, summary, status, updated_at')
      .eq('entity_type', 'march')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (entityResult.error) throw entityResult.error
    if (!entityResult.data) return null
    const entity = entityResult.data

    const [profileResult, authorsResult, dedicationsResult, recordingsResult, entriesResult, tracksResult] = await Promise.all([
      supabase
        .from('marches')
        .select('entity_id, composition_year, composition_date_text, work_type, music_type, premiere_date, premiere_date_text, premiered_by_band_entity_id, description')
        .eq('entity_id', entity.id)
        .maybeSingle(),
      supabase
        .from('march_authors')
        .select('agent_entity_id, author_role, notes')
        .eq('march_entity_id', entity.id)
        .eq('status', 'published'),
      supabase
        .from('march_dedications')
        .select('dedicatee_entity_id, dedication_type, dedication_text, date_from_text, notes')
        .eq('march_entity_id', entity.id)
        .eq('status', 'published'),
      supabase
        .from('march_recordings')
        .select('id, band_entity_id, title, recording_date, recording_date_text, youtube_video_id, external_url, is_featured, notes')
        .eq('march_entity_id', entity.id)
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('recording_date', { ascending: false, nullsFirst: false }),
      supabase
        .from('musical_repertoire_entries')
        .select('id, repertoire_id, performance_count, display_title')
        .eq('march_entity_id', entity.id),
      supabase
        .from('band_release_tracks')
        .select('id, release_id, spotify_url, title')
        .eq('march_entity_id', entity.id),
    ])

    if (profileResult.error) throw profileResult.error
    const profile = profileResult.data || {}
    const authors = rows(authorsResult, 'No se pudieron cargar las autorías de la Marcha')
    const dedications = rows(dedicationsResult, 'No se pudieron cargar las dedicatorias de la Marcha')
    const recordings = rows(recordingsResult, 'No se pudieron cargar las grabaciones de la Marcha')
    const entries = rows(entriesResult, 'No se pudieron cargar las crucetas de la Marcha')
    const tracks = rows(tracksResult, 'No se pudieron cargar las pistas de la Marcha')
    const repertoireIds = unique(entries.map((item) => item.repertoire_id))
    const releaseIds = unique(tracks.map((item) => item.release_id))

    const [repertoiresResult, releasesResult] = await Promise.all([
      repertoireIds.length
        ? supabase
            .from('musical_repertoires')
            .select('id, slug, title, outing_id, band_entity_id, repertoire_kind, status')
            .in('id', repertoireIds)
            .eq('repertoire_kind', 'performed')
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      releaseIds.length
        ? supabase
            .from('band_releases')
            .select('id, band_entity_id, title, release_year, status')
            .in('id', releaseIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
    ])

    const repertoires = rows(repertoiresResult, 'No se pudieron cargar los repertorios relacionados')
    const releases = rows(releasesResult, 'No se pudieron cargar los lanzamientos relacionados')
    const outingIds = unique(repertoires.map((item) => item.outing_id))
    const relatedEntityIds = unique([
      ...authors.map((item) => item.agent_entity_id),
      ...dedications.map((item) => item.dedicatee_entity_id),
      ...recordings.map((item) => item.band_entity_id),
      ...repertoires.map((item) => item.band_entity_id),
      ...releases.map((item) => item.band_entity_id),
      profile.premiered_by_band_entity_id,
    ])

    const outingsResult = outingIds.length
      ? await supabase
          .from('outings')
          .select('id, brotherhood_entity_id, title, outing_date, year, status')
          .in('id', outingIds)
          .eq('status', 'published')
      : { data: [], error: null }

    const outings = rows(outingsResult, 'No se pudieron cargar las procesiones relacionadas')
    const brotherhoodIds = unique(outings.map((item) => item.brotherhood_entity_id))
    const allRelatedEntityIds = unique([...relatedEntityIds, ...brotherhoodIds])
    const [brotherhoodsResult, relatedEntitiesResult] = await Promise.all([
      brotherhoodIds.length
        ? supabase
            .from('brotherhoods')
            .select('entity_id, popular_name, official_name')
            .in('entity_id', brotherhoodIds)
        : Promise.resolve({ data: [], error: null }),
      allRelatedEntityIds.length
        ? supabase
            .from('entities')
            .select('id, entity_type, name, slug, status')
            .in('id', allRelatedEntityIds)
        : Promise.resolve({ data: [], error: null }),
    ])
    const brotherhoodProfiles = rows(brotherhoodsResult, 'No se pudieron cargar las Hermandades relacionadas')
    const relatedEntities = rows(relatedEntitiesResult, 'No se pudieron cargar las entidades relacionadas')
    const repertoireById = byId(repertoires)
    const releaseById = byId(releases)
    const outingById = byId(outings)
    const relatedById = byId(relatedEntities)
    const brotherhoodById = relatedById
    const brotherhoodProfileById = new Map(brotherhoodProfiles.map((item) => [item.entity_id, item]))

    const repertoireHistory = entries
      .map((entry) => {
        const repertoire = repertoireById.get(entry.repertoire_id)
        if (!repertoire) return null
        const outing = outingById.get(repertoire.outing_id)
        if (!outing) return null
        const band = relatedById.get(repertoire.band_entity_id)
        const brotherhood = brotherhoodById.get(outing.brotherhood_entity_id)
        const brotherhoodProfile = brotherhoodProfileById.get(outing.brotherhood_entity_id)
        return {
          id: entry.id,
          count: entry.performance_count,
          repertoireTitle: repertoire.title,
          repertoireHref: `/crucetas-musicales/${repertoire.slug}`,
          outingTitle: outing.title,
          date: outing.outing_date,
          year: outing.year || Number(String(outing.outing_date || '').slice(0, 4)) || null,
          band: band ? { name: band.name, href: entityHref(band) } : null,
          brotherhood: brotherhood ? {
            name: brotherhoodProfile?.popular_name || brotherhood.name,
            href: entityHref(brotherhood),
          } : null,
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    const recordingListenings = recordings.map((recording) => {
      const url = recording.youtube_video_id
        ? `https://www.youtube.com/watch?v=${recording.youtube_video_id}`
        : recording.external_url || ''
      const band = relatedById.get(recording.band_entity_id)
      return {
        id: recording.id,
        url,
        provider: provider(url),
        title: recording.title || entity.name,
        year: recording.recording_date_text || Number(String(recording.recording_date || '').slice(0, 4)) || null,
        featured: recording.is_featured,
        band: band ? { name: band.name, href: entityHref(band) } : null,
      }
    })
    const trackListenings = tracks.map((track) => {
      const release = releaseById.get(track.release_id)
      if (!release?.id || !track.spotify_url) return null
      const band = relatedById.get(release.band_entity_id)
      return {
        id: track.id,
        url: track.spotify_url,
        provider: 'Spotify',
        title: track.title || release.title || entity.name,
        year: release.release_year,
        featured: false,
        band: band ? { name: band.name, href: entityHref(band) } : null,
      }
    }).filter(Boolean)

    return {
      id: entity.id,
      slug: entity.slug,
      updatedAt: entity.updated_at || null,
      href: `/marchas/${entity.slug}`,
      name: entity.name,
      summary: entity.summary || profile.description || '',
      workType: profile.work_type || 'Marcha procesional',
      musicType: profile.music_type || '',
      compositionYear: profile.composition_year || profile.composition_date_text || '',
      premiere: profile.premiere_date_text || profile.premiere_date || '',
      premiereBand: relatedById.get(profile.premiered_by_band_entity_id) ? {
        name: relatedById.get(profile.premiered_by_band_entity_id).name,
        href: entityHref(relatedById.get(profile.premiered_by_band_entity_id)),
      } : null,
      authors: authors.map((item) => ({
        id: item.agent_entity_id,
        name: relatedById.get(item.agent_entity_id)?.name || '',
        role: item.author_role || '',
        notes: item.notes || '',
      })).filter((item) => item.name),
      dedications: dedications.map((item) => {
        const dedicatee = relatedById.get(item.dedicatee_entity_id)
        return {
          id: item.dedicatee_entity_id,
          name: dedicatee?.name || item.dedication_text || '',
          text: item.dedication_text || '',
          date: item.date_from_text || '',
          notes: item.notes || '',
          href: entityHref(dedicatee),
        }
      }).filter((item) => item.name || item.text),
      listenings: uniqueListenings([...recordingListenings, ...trackListenings]),
      repertoireHistory,
      documentedPerformances: repertoireHistory.reduce((total, item) => total + item.count, 0),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha pública de la Marcha', {
      slug,
      error: publicErrorMessage(error),
    })
    throw error instanceof Error ? error : new Error(publicErrorMessage(error))
  }
}

const getCachedPublicMarchBySlug = unstable_cache(
  loadPublicMarchBySlug,
  ['hilo-cofrade-public-march-detail-v3'],
  { revalidate: 900, tags: ['public-march-detail'] }
)

export const getPublicMarchBySlug = cache(function getPublicMarchBySlug(slug) {
  return getCachedPublicMarchBySlug(slug)
})
