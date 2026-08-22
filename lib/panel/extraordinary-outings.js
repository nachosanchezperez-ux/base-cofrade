import 'server-only'

import { createClient } from '@/lib/supabase/server'

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function assetPublicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function mapOutingMedia(supabase, rows = []) {
  return rows.map((row) => {
    const asset = relationOne(row.media_assets)
    return {
      id: row.id,
      role: row.role,
      sortOrder: row.sort_order || 0,
      mediaAssetId: row.media_asset_id,
      path: assetPublicUrl(supabase, asset?.storage_path || ''),
      storagePath: asset?.storage_path || '',
      title: asset?.title || '',
      alt: asset?.alt_text || '',
      credit: asset?.author_name || '',
      rightsStatus: asset?.rights_status || '',
    }
  })
}

export async function getPanelExtraordinaryOutings({ query = '', eventStatus = '' } = {}) {
  const supabase = await createClient()
  let request = supabase
    .from('outings')
    .select('id, reference_code, slug, title, outing_type, outing_date, event_status, status, organizer_name, hero_image_path, municipalities(name)')
    .eq('character', 'extraordinary')
    .neq('status', 'archived')
    .order('outing_date', { ascending: true, nullsFirst: false })

  if (eventStatus) request = request.eq('event_status', eventStatus)

  const { data, error } = await request
  if (error) throw new Error(`No se pudieron cargar las extraordinarias del panel: ${error.message}`)

  const outingIds = (data || []).map((item) => item.id)
  const mediaRows = outingIds.length
    ? await supabase.from('outing_media').select('outing_id, role').in('outing_id', outingIds)
    : { data: [], error: null }
  if (mediaRows.error) throw new Error(`No se pudo comprobar la multimedia de las extraordinarias: ${mediaRows.error.message}`)

  const mediaCounts = new Map()
  for (const row of mediaRows.data || []) {
    const current = mediaCounts.get(row.outing_id) || { poster: false, gallery: 0 }
    if (row.role === 'poster') current.poster = true
    if (row.role === 'gallery') current.gallery += 1
    mediaCounts.set(row.outing_id, current)
  }

  const needle = normalize(query)
  return (data || [])
    .map((item) => ({
      ...item,
      municipality: relationOne(item.municipalities)?.name || '',
      hasPhoto: Boolean(item.hero_image_path),
      hasPoster: mediaCounts.get(item.id)?.poster || false,
      galleryCount: mediaCounts.get(item.id)?.gallery || 0,
    }))
    .filter((item) => {
      if (!needle) return true
      return normalize([
        item.title,
        item.organizer_name,
        item.municipality,
        item.reference_code,
        item.outing_type,
      ].filter(Boolean).join(' ')).includes(needle)
    })
}

export async function getPanelExtraordinaryOuting(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('outings')
    .select('id, reference_code, slug, title, outing_type, outing_date, departure_time, return_date, return_time, reason, description, public_notes, event_status, status, organizer_name, hero_image_path, hero_image_alt, hero_image_credit, municipalities(name)')
    .eq('id', id)
    .eq('character', 'extraordinary')
    .maybeSingle()

  if (error) throw new Error(`No se pudo cargar la extraordinaria: ${error.message}`)
  if (!data) return null

  const [scheduleResult, musicResult, sourceResult, outingMediaResult] = await Promise.all([
    supabase.from('outing_schedule_items').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase.from('outing_music_positions').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase.from('source_links').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase
      .from('outing_media')
      .select('id, role, sort_order, media_asset_id, media_assets(id, storage_path, title, alt_text, author_name, rights_status)')
      .eq('outing_id', id)
      .order('role')
      .order('sort_order'),
  ])

  if (scheduleResult.error) throw new Error(`No se pudieron contar los horarios: ${scheduleResult.error.message}`)
  if (musicResult.error) throw new Error(`No se pudo contar la música: ${musicResult.error.message}`)
  if (sourceResult.error) throw new Error(`No se pudieron contar las fuentes: ${sourceResult.error.message}`)
  if (outingMediaResult.error) throw new Error(`No se pudo cargar la multimedia: ${outingMediaResult.error.message}`)

  const media = mapOutingMedia(supabase, outingMediaResult.data || [])

  return {
    ...data,
    municipality: relationOne(data.municipalities)?.name || '',
    scheduleCount: scheduleResult.count || 0,
    musicCount: musicResult.count || 0,
    sourceCount: sourceResult.count || 0,
    poster: media.find((item) => item.role === 'poster') || null,
    gallery: media.filter((item) => item.role === 'gallery').sort((a, b) => a.sortOrder - b.sortOrder),
  }
}
