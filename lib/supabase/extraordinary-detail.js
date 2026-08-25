import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function entityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function musicSection(type) {
  if (type === 'processional_music') return 'processional'
  if (type === 'liturgical_music') return 'liturgical'
  if (type === 'announcement_music') return 'announcement'
  return 'other'
}

function assetPublicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function journeyPhases(route) {
  if (!route || typeof route !== 'object' || !Array.isArray(route.phases)) return []

  return route.phases
    .map((phase, index) => ({
      id: String(phase?.id || `phase-${index + 1}`),
      eyebrow: String(phase?.eyebrow || ''),
      title: String(phase?.title || ''),
      time: String(phase?.time || ''),
      summary: String(phase?.summary || ''),
      places: Array.isArray(phase?.places)
        ? phase.places.map((place) => String(place || '')).filter(Boolean)
        : [],
    }))
    .filter((phase) => phase.title)
}

export async function getExtraordinaryDetail(slug) {
  if (!slug) return null

  try {
    const supabase = createPublicClient()
    const baseResult = await supabase
      .from('extraordinary_outings_directory')
      .select('*')
      .eq('slug', slug)
      .eq('province', 'Sevilla')
      .maybeSingle()

    if (baseResult.error) throw new Error(`No se pudo consultar la extraordinaria: ${baseResult.error.message}`)
    const outing = baseResult.data
    if (!outing) return null

    const outingTextResult = await supabase
      .from('outings')
      .select('origin_text, destination_text, route')
      .eq('id', outing.id)
      .maybeSingle()
    if (outingTextResult.error) throw new Error(`No se pudieron consultar los lugares y fases de la extraordinaria: ${outingTextResult.error.message}`)
    const outingText = outingTextResult.data || {}

    const [scheduleRows, musicRows, sourceLinkRows, outingMediaRows] = await Promise.all([
      assertRows(
        await supabase
          .from('outing_schedule_items')
          .select('id, sequence_no, label, item_date, item_time, time_text, place_id, place_text, notes')
          .eq('outing_id', outing.id)
          .order('sequence_no'),
        'No se pudieron consultar los horarios de la extraordinaria'
      ),
      assertRows(
        await supabase
          .from('outing_music_details')
          .select('music_position_id, music_assignment_id, position_order, position_code, position_label, band_entity_id, band_name, participation_mode, segment_start_label, segment_end_label, notes')
          .eq('outing_id', outing.id)
          .order('position_order'),
        'No se pudo consultar la música de la extraordinaria'
      ),
      assertRows(
        await supabase
          .from('source_links')
          .select('id, source_id, scope, notes, sources(id, name, url, source_type, author_or_publisher, publication_date, notes)')
          .eq('outing_id', outing.id),
        'No se pudieron consultar las fuentes de la extraordinaria'
      ),
      assertRows(
        await supabase
          .from('outing_media')
          .select('id, role, sort_order, media_asset_id, media_assets(id, storage_path, title, alt_text, author_name, rights_status)')
          .eq('outing_id', outing.id)
          .order('role')
          .order('sort_order'),
        'No se pudo consultar la multimedia de la extraordinaria'
      ),
    ])

    const placeIds = [...new Set(scheduleRows.map((item) => item.place_id).filter(Boolean))]
    const bandIds = [...new Set(musicRows.map((item) => item.band_entity_id).filter(Boolean))]
    const entityIds = [...new Set([outing.brotherhood_entity_id, ...bandIds].filter(Boolean))]

    const [places, entities] = await Promise.all([
      placeIds.length
        ? assertRows(
            await supabase.from('places').select('id, name, slug, place_type').in('id', placeIds),
            'No se pudieron consultar los lugares de la extraordinaria'
          )
        : [],
      entityIds.length
        ? assertRows(
            await supabase
              .from('entities')
              .select('id, name, slug, entity_type, status')
              .in('id', entityIds),
            'No se pudieron consultar las entidades relacionadas con la extraordinaria'
          )
        : [],
    ])

    const placeById = new Map(places.map((place) => [place.id, place]))
    const entityById = new Map(entities.map((entity) => [entity.id, entity]))
    const brotherhoodEntity = entityById.get(outing.brotherhood_entity_id) || null

    const schedule = scheduleRows.map((item) => ({
      id: item.id,
      order: item.sequence_no,
      label: item.label,
      date: item.item_date || outing.outing_date || '',
      time: timeLabel(item.item_time),
      timeText: item.time_text || '',
      place: placeById.get(item.place_id)?.name || item.place_text || '',
      notes: item.notes || '',
    }))

    const music = musicRows.map((item) => {
      const entity = entityById.get(item.band_entity_id) || null
      return {
        id: item.music_assignment_id,
        order: item.position_order,
        section: musicSection(item.position_code),
        positionCode: item.position_code || '',
        context: item.position_label || [item.segment_start_label, item.segment_end_label].filter(Boolean).join(' → '),
        name: item.band_name || entity?.name || 'Acompañamiento por documentar',
        href: entityHref(entity),
        start: item.segment_start_label || '',
        end: item.segment_end_label || '',
        notes: item.notes || '',
      }
    })

    const sourceLinks = sourceLinkRows
      .map((link) => {
        const source = relationOne(link.sources)
        if (!source) return null
        return {
          id: link.id,
          name: source.name,
          url: source.url || '',
          type: source.source_type || '',
          publisher: source.author_or_publisher || '',
          publicationDate: source.publication_date || '',
          scope: link.scope || '',
          notes: link.notes || source.notes || '',
        }
      })
      .filter(Boolean)
      .sort((first, second) => String(second.publicationDate || '').localeCompare(String(first.publicationDate || '')))

    const media = outingMediaRows
      .map((row) => {
        const asset = relationOne(row.media_assets)
        if (!asset) return null
        const path = assetPublicUrl(supabase, asset.storage_path || '')
        if (!path) return null
        return {
          id: row.id,
          role: row.role,
          sortOrder: row.sort_order || 0,
          path,
          title: asset.title || '',
          alt: asset.alt_text || outing.title || 'Imagen de la extraordinaria',
          credit: asset.author_name || '',
        }
      })
      .filter(Boolean)

    return {
      id: outing.id,
      slug: outing.slug,
      referenceCode: outing.reference_code || '',
      title: outing.title || outing.outing_type || 'Salida extraordinaria',
      outingType: outing.outing_type || 'Salida extraordinaria',
      brotherhoodName: outing.brotherhood_name || outing.organizer_name || 'Entidad organizadora por documentar',
      brotherhoodHref: entityHref(brotherhoodEntity),
      municipality: outing.municipality_name || '',
      province: outing.province || 'Sevilla',
      date: outing.outing_date || '',
      year: outing.year || null,
      departureTime: timeLabel(outing.departure_time),
      returnTime: timeLabel(outing.return_time),
      returnDate: outing.return_date || '',
      reason: outing.reason || '',
      description: outing.description || '',
      publicNotes: outing.public_notes || '',
      origin: outing.origin_place_name || outingText.origin_text || '',
      destination: outing.destination_place_name || outingText.destination_text || '',
      routeSummary: outing.route_summary || '',
      journeyPhases: journeyPhases(outingText.route),
      eventStatus: outing.event_status || 'announced',
      heroImagePath: outing.hero_image_path || '',
      heroImageAlt: outing.hero_image_alt || outing.title || 'Salida extraordinaria',
      heroImageCredit: outing.hero_image_credit || '',
      schedule,
      music,
      processionalMusic: music.filter((item) => item.section === 'processional'),
      liturgicalMusic: music.filter((item) => item.section === 'liturgical'),
      announcementMusic: music.filter((item) => item.section === 'announcement'),
      otherMusic: music.filter((item) => item.section === 'other'),
      poster: media.find((item) => item.role === 'poster') || null,
      gallery: media.filter((item) => item.role === 'gallery').sort((a, b) => a.sortOrder - b.sortOrder),
      sources: sourceLinks,
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo cargar la ficha de la extraordinaria', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
